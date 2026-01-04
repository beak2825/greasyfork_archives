// ==UserScript==
// @name        PTP image cache
// @namespace   https://greasyfork.org/
// @match       https://passthepopcorn.me/*
// @grant       GM.registerMenuCommand
// @grant       GM.xmlhttpRequest
// @version     1.0
// @author      lucianjp
// @description --
// @run-at      document-start
// @inject-into page
// @downloadURL https://update.greasyfork.org/scripts/485171/PTP%20image%20cache.user.js
// @updateURL https://update.greasyfork.org/scripts/485171/PTP%20image%20cache.meta.js
// ==/UserScript==

class UserJsCore {
  constructor() {
    throw new Error('UserJsCore cannot be instantiated.');
  }

  static ready = (callback) =>
    document.readyState !== "loading"
      ? callback()
      : document.addEventListener("DOMContentLoaded", callback);

  static observe = (observableCollection, continuous = false) => {
    const observables = Array.from(observableCollection.entries()).filter(
      ([_, observable]) => observable instanceof UserJsCore.ObservableAll || !observable.currentValue
    );

    const observer = new MutationObserver(function (mutations) {
      for (var i = mutations.length - 1; i >= 0; i--) {
        const mutation = mutations[i];

        // Check for added nodes
        if (mutation.addedNodes.length > 0) {
          for (var j = mutation.addedNodes.length - 1; j >= 0; j--) {
            const $node = mutation.addedNodes[j];

            // Process added nodes
            if ($node && $node.nodeType === 1) {
              processNode($node);
            }
          }
        }

        // Check for attribute changes
        if (mutation.type === 'attributes' && mutation.attributeName) {
          const $node = mutation.target;

          // Process nodes with attribute changes
          if ($node && $node.nodeType === 1) {
            processNode($node);
          }
        }
      }
    });

    function processNode($node) {
      let observablesLength = observables.length;

      for (let k = observablesLength - 1; k >= 0; k--) {
        const [_, observable] = observables[k];

        if (observable.test($node)) {
          if (observable instanceof UserJsCore.Observable) {
            observable.set($node);
            const last = observables.pop();
            if (k < observablesLength - 1) observables[k] = last;
            observablesLength = observablesLength - 1;
          }
          if (observable instanceof UserJsCore.ObservableAll) {
            observable.currentValue.includes($node) || observable.add($node);
          }
          break;
        }
      }

      if (observables.length === 0 && !continuous) {
        observer.disconnect();
      }
    }

    observer.observe(document, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style','src'],
    });

    if (!continuous) UserJsCore.ready(() => observer.disconnect());

    return observer;
  };

  static ObservableAll = class {
    constructor(lookup, test) {
      this.values = [];
      this.callbacks = [];
      this.lookup = lookup;
      this.test = test;

      if (typeof lookup === "function") {
        this.values = [...lookup()];
      }
    }

    add(newValue) {
      this.values.push(newValue);
      this.executeCallbacks(newValue);
    }

    then(callback) {
      if (typeof callback === "function") {
        this.callbacks.push(callback);
        if (this.values.length > 0)
          this.values.forEach((value) => callback(value));
      }
      return this;
    }

    executeCallbacks(value) {
      this.callbacks.forEach((callback) => callback(value));
    }

    get currentValue() {
      return this.values;
    }
  }

  static AsyncQueue = class {
    constructor(concurrentLimit = 6) {
      this.concurrentLimit = concurrentLimit;
      this.runningCount = 0;
      this.queue = [];
      this.isPaused = false;
    }

    async enqueueAsync(func, priority = 0) {
      return new Promise((resolve, reject) => {
        const taskId = Symbol(); // Generate a unique ID for each task
        const task = {
          id: taskId,
          func,
          priority,
          resolve,
          reject,
        };

        const execute = async (task) => {
          if (this.isPaused) {
            this.queue.unshift(task);
            this.logQueueStatus();
            return;
          }

          this.runningCount++;
          this.logQueueStatus();

          try {
            const result = await task.func();
            task.resolve(result);
          } catch (error) {
            task.reject(error);
          } finally {
            this.runningCount--;

            if (this.queue.length > 0) {
              const nextTask = this.queue.shift();
              execute(nextTask);
            }
            this.logQueueStatus();
          }
        };

        this.logQueueStatus();

        if (this.runningCount < this.concurrentLimit) {
          execute(task);
        } else {
          this.queue.push(task);
        }
      });
    }

    cancelTask(taskId) {
      const index = this.queue.findIndex((task) => task.id === taskId);
      if (index !== -1) {
        const [canceledTask] = this.queue.splice(index, 1);
        canceledTask.reject(new Error('Task canceled'));
      }
    }

    logQueueStatus() {
      //console.log(`Running: ${this.runningCount}, Queued: ${this.queue.length}`);
    }

    clearQueue() {
      this.queue.forEach((task) => task.reject(new Error('Queue cleared')));
      this.queue = [];
    }

    pause() {
      this.isPaused = true;
      this.logQueueStatus();
    }

    resume() {
      this.isPaused = false;
      if (this.queue.length > 0) {
        this.queue.sort((a, b) => b.priority - a.priority);
        const nextTask = this.queue.shift();
        this.enqueueAsync(nextTask.func, nextTask.priority);
      }
      this.logQueueStatus();
    }
  }

  static Cache = class {
    constructor(props = {}) {
      this.version = props.version ?? 1;
      this.name = props.dbName ?? window.location.origin;
      this.storeName = props.storeName ?? 'cache';
      this.db = null;
      this.concurrentRequests = props.concurrentRequests ?? 6;

      this.queue = new UserJsCore.AsyncQueue(this.concurrentRequests);
    }

    init() {
      if(GM.xmlhttpRequest === undefined){
        throw new Error("UserJsCore.Cache needs the GM.xmlhttpRequest granted");
      }

      return new Promise(resolve => {
        if(this.db) resolve(this);

        const request = indexedDB.open(this.name, this.version);

        request.onupgradeneeded = event => {
          event.target.result.createObjectStore(this.storeName);
        };

        request.onsuccess = () => {
          this.db = request.result;

          this.db.onerror = () => {
            console.error('Error creating/accessing db');
          };

          if (this.db.setVersion && this.db.version !== this.version) {
            const version = this.db.setVersion(this.version);
            version.onsuccess = () => {
              this.db.createObjectStore(this.storeName);
              resolve(this);
            };
          } else {
            resolve(this);
          }
        };
      });
    }

    putImage(key, url) {
      return this.queue.enqueueAsync(async () => {
        if (!this.db) {
          throw new Error('DB not initialized. Call the init method');
        }

        try {
          const blob = await new Promise((resolve, reject) => {
            console.log(`requesting : ${url}`)
            GM.xmlhttpRequest({
              method: 'GET',
              url: url,
              responseType: 'blob',
              onload: (event) => resolve(event.response),
              onerror: (e) => reject(e),
            });
          });

          // Check if the blob is a valid image
          if (!(blob instanceof Blob) || blob.type.indexOf('image') === -1) {
            throw new Error('The response does not contain a valid image.');
          }

          const transaction = this.db.transaction(this.storeName, 'readwrite');
          transaction.objectStore(this.storeName).put(blob, key);

          return URL.createObjectURL(blob);
        } catch (error) {
          console.error(error);
          throw error;
        }
      });
    }

    getImage(key) {
      return new Promise((resolve, reject) => {
        if (!this.db) {
          return reject('DB not initialized. Call the init method');
        }

        const transaction = this.db.transaction(this.storeName, 'readonly');
        const request = transaction.objectStore(this.storeName).get(key);
        request.onsuccess = event => {
          const result = event?.target?.result;
          if(result)
            resolve(URL.createObjectURL(result));
          else
            resolve();
        };

        request.onerror = (event) => {
          const error = event?.target?.error;
          reject(error);
        };
      });
    }

    clear() {
      return new Promise(resolve => {
        if (!this.db)
          return reject('DB not initialized. Call the init method');

        const transaction = this.db.transaction(this.storeName, "readwrite");
        const request = transaction.objectStore(this.storeName).clear();

        request.onsuccess = () => {
          resolve();
        };
      });
    }
  }
};

const cache = new UserJsCore.Cache({ storeName: "cache" });
const cachePromise = cache.init();

(async () => {
  GM.registerMenuCommand("Clear Cache", async () => {
    if (confirm("Are you sure you want to clear the cover cache?")) {
      await cache.clear();
      alert(
        `The Cache has been cleared\n{ indexdb: '${cache.name}', objectStore: '${cache.storeName}' }`
      );
    }
  });

  UserJsCore.observe(
    [
      new UserJsCore.ObservableAll(
        () => document.getElementsByTagName("img"),
        ($node) =>
          $node instanceof HTMLImageElement ||
          $node instanceof HTMLAnchorElement
      ).then(async ($node) => {
        if ($node instanceof HTMLImageElement) {
          if ($node.src.includes("ptpimg")) {
            let replace = false;
            let key = $node.src;

            if (!$node.complete) {
              $node.src = "";
              $node.dataset.src = key;
              replace = true;
            }

            cachePromise.then(async () => {
              const img = (await cache.getImage(key)) ?? (await cache.putImage(key, key));
              if(replace)
                $node.src = img;
            });
          }
        } else {
          const style =
            $node.currentStyle || window.getComputedStyle($node, false);
          const bi = style.backgroundImage.slice(4, -1).replace(/"/g, "");

          if (bi.includes("ptpimg")) {
            cachePromise.then(async () => {
              $node.style.backgroundImage = `url(${
                (await cache.getImage(bi)) ?? (await cache.putImage(bi, bi))
              })`;
            });
          }
        }
      }),
    ],
    true
  );
})();
