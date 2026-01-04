// ==UserScript==
// @name        userscripts-core-library
// @version     0.3.0
// @author      lucianjp
// @description Core library to handle webpages dom with userscripts from document-start
// ==/UserScript==
// https://greasyfork.org/scripts/476017-userscripts-core-library/code/userscripts-core-library.js

//polyfills
if (typeof GM == 'undefined') {
  this.GM = {};
}

class UserJsCore {
  constructor() {
    throw new Error('UserJsCore cannot be instantiated.');
  }
  
  static ready = (callback) =>
    document.readyState !== "loading"
      ? callback()
      : document.addEventListener("DOMContentLoaded", callback);

  static addStyle = (aCss) => {
    let head = document.getElementsByTagName("head")[0];
    if (!head) {
      console.error("Head element not found. Cannot add style.");
      return null;
    }

    let style = document.createElement("style");
    style.setAttribute("type", "text/css");
    style.textContent = aCss;
    head.appendChild(style);
    return style;
  };

  static observe = (observableCollection, continuous = false) => {
    const observables = Array.from(observableCollection.entries()).filter(
      ([_, observable]) => observable instanceof UserJsCore.ObservableAll || !observable.currentValue
    );

    const observer = new MutationObserver(function (mutations) {
      for (var i = mutations.length - 1; i >= 0; i--) {
        const mutation = mutations[i];
        const addedNodesLength = mutation.addedNodes.length;
        if (addedNodesLength > 0) {
          for (var j = addedNodesLength - 1; j >= 0; j--) {
            const $node = mutation.addedNodes[j];
            if ($node && $node.nodeType === 1) {
              let observablesLength = observables.length;
              for (let k = observablesLength - 1; k >= 0; k--) {
                const [_, observable] = observables[k];

                if (observable.test($node)) {
                  if(observable instanceof UserJsCore.Observable) {
                    observable.set($node);
                    const last = observables.pop();
                    if (k < observablesLength - 1) observables[k] = last;
                    observablesLength = observablesLength - 1;
                  }
                  if(observable instanceof UserJsCore.ObservableAll){
                    observable.currentValue.includes($node) || observable.add($node);
                  }
                  break;
                }
              }
            }
          }

          if (observables.length === 0 && !continuous) {
            observer.disconnect();
            return;
          }
        }
      }
    });

    observer.observe(document, { childList: true, subtree: true });

    if (!continuous) UserJsCore.ready(() => observer.disconnect());

    return observer;
  };

  static Observable = class {
    constructor(lookup, test) {
      this.value = undefined;
      this.callbacks = [];
      this.lookup = lookup;
      this.test = test;
  
      if (typeof lookup === "function") {
        this.value = lookup();
      }
    }
  
    set(newValue) {
      this.value = newValue;
      this.executeCallbacks(this.value);
    }
  
    then(callback) {
      if (typeof callback === "function") {
        this.callbacks.push(callback);
        if (this.value) callback(this.value);
      }
      return this;
    }
  
    executeCallbacks(value) {
      this.callbacks.forEach((callback) => callback(value));
    }
  
    get currentValue() {
      return this.value;
    }
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
  
  static ObservableCollection = class extends Map {
    constructor() {
      super();
    }
  
    add(name, observable) {
      this.set(name, observable);
      return observable;
    }
  }
  
  static Config = class {
    static #config;
    static #isInitializedPromise;
  
    constructor() {
      throw new Error('Config cannot be instantiated.');
    }
  
    static async init(defaultConfig = {}) {
      if (!this.#isInitializedPromise) {
        this.#isInitializedPromise = (async () => {
          if (!this.#config) {
            const storedConfig = await GM.getValue('config', {});
            this.#config = { ...defaultConfig, ...storedConfig };
          }
        })();
      }
      await this.#isInitializedPromise;
      return this; // Return the class instance after initialization
    }
  
    static get(key) {
      if (!this.#isInitializedPromise) {
        throw new Error('Config has not been initialized. Call init() first.');
      }
      return this.#config[key];
    }
  
    static set(key, value) {
      if (!this.#isInitializedPromise) {
        throw new Error('Config has not been initialized. Call init() first.');
      }
      this.#config[key] = value;
      GM.setValue('config', this.#config);
    }
  }

  static Feature = class {
    constructor(id, name, action) {
      this._id = id;
      this._name = name;
      if (this.enabled == null) {
        this.enabled = true;
      }
      if (this._enabled) {
        try{
          action();
          console.groupCollapsed(name)
          console.log(`${name} started`)
        } catch (error){
          console.group(name)
          console.error(error);
        }
        console.groupEnd();
      }
    }
    set id(id) {
      this._id = id;
    }
    get id() {
      return this._id;
    }
    set name(name) {
      this._name = name;
    }
    get name() {
      return this._name;
    }
    set enabled(enabled) {
      this._enabled = enabled;
      UserJsCore.Config.set(`feature_${this._id}`, this._enabled);
    }
    get enabled() {
      return this._enabled || (this._enabled = UserJsCore.Config.get(`feature_${this._id}`));
    }
  
    get displayName() {
      return `${this._enabled ? "Disable" : "Enable"} ${this._name}`;
    }
  
    toggle() {
      this.enabled = !this.enabled;
    }
  }

  static Menu = class {
    static #menuIds = [];
    static #features;
    static #notification;
  
    static initialize(features, notificationChange) {
      if(GM.registerMenuCommand === undefined){
        throw new Error("UserJsCore.Menu needs the GM.registerMenuCommand granted");
      }
      if(GM.unregisterMenuCommand === undefined){
        throw new Error("UserJsCore.Menu needs the GM.unregisterMenuCommand granted");
      }
      this.#features = Object.values(features);
      this.#notification = notificationChange;
      this.#generateMenu();
    }
  
    static #generateMenu() {
      if (this.#menuIds.length > 0 && this.#notification) {
        this.#notification();
      }
  
      this.#menuIds.forEach((id) => GM.unregisterMenuCommand(id));
      for (const feature of this.#features) {
        this.#menuIds.push(
          GM.registerMenuCommand(feature.displayName, () => {
            feature.toggle();
            this.#generateMenu();
          })
        );
      }
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
              //this.queue.sort((a, b) => b.priority - a.priority);
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
          //this.queue.sort((a, b) => b.priority - a.priority);
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
      if(GM.xmlHttpRequest === undefined){
        throw new Error("UserJsCore.Cache needs the GM.xmlHttpRequest granted");
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
            GM.xmlHttpRequest({
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
