// ==UserScript==
// @name                YouTube CPU-Tamer Upgrade
// @version             0.3
// @description         Optimize CPU and GPU usage while watching YouTube videos
// @author              AstralRift
// @namespace           https://greasyfork.org/users/1300060
// @match               *://*.youtube.com/*
// @match               *://*.youtube-nocookie.com/embed/*
// @match               *://music.youtube.com/*
// @exclude             *://*.youtube.com/*/*.{txt,png,jpg,jpeg,gif,xml,svg,manifest,log,ini}
// @run-at              document-start
// @grant               none
// @license             MIT
// @downloadURL https://update.greasyfork.org/scripts/495119/YouTube%20CPU-Tamer%20Upgrade.user.js
// @updateURL https://update.greasyfork.org/scripts/495119/YouTube%20CPU-Tamer%20Upgrade.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const win = this instanceof Window ? this : window;

  const scriptKey = 'YTB_CPUTamer_AstralRift';
  if (win[scriptKey]) throw new Error('Duplicated Userscript Calling');
  win[scriptKey] = true;

  const PromiseConstructor = function (executor) {
    return new Promise(executor);
  };

  const ExternalPromise = (function () {
    let resolve_, reject_;
    const handler = function (resolve, reject) {
      resolve_ = resolve;
      reject_ = reject;
    };
    const PromiseExternal = function (cb) {
      cb = cb || handler;
      const promise = new PromiseConstructor(cb);
      if (cb === handler) {
        promise.resolve = resolve_;
        promise.reject = reject_;
      }
      return promise;
    };
    return PromiseExternal;
  })();

  const checkGPUAcceleration = (function () {
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
    } catch (e) {
      return false;
    }
  })();

  if (!checkGPUAcceleration) {
    throw new Error('Your browser does not support GPU Acceleration. YouTube CPU-Tamer is skipped.');
  }

  const getTimeUpdate = (function () {
    window.lastTimeUpdate = 1;
    document.addEventListener('timeupdate', function () {
      window.lastTimeUpdate = Date.now();
    }, true);
    let topLastTimeUpdate = -1;
    try {
      topLastTimeUpdate = top.lastTimeUpdate;
    } catch (e) { }
    return topLastTimeUpdate >= 1 ? function () { return top.lastTimeUpdate; } : function () { return window.lastTimeUpdate; };
  })();

  const initializeContext = function (win) {
    return new PromiseConstructor(function (resolve) {
      const waitForFrame = requestAnimationFrame;
      let maxRetries = 16;
      const frameId = 'vanillajs-iframe-v1';
      let frame = document.getElementById(frameId);
      let removeFrame = null;
      if (!frame) {
        frame = document.createElement('iframe');
        frame.id = frameId;
        const blobURL = typeof webkitCancelAnimationFrame === 'function' && typeof kagi === 'undefined' ? (frame.src = URL.createObjectURL(new Blob([], { type: 'text/html' }))) : null;
        frame.sandbox = 'allow-same-origin';
        let noscriptElement = document.createElement('noscript');
        noscriptElement.appendChild(frame);
        (function waitForDocument() {
          if (!document.documentElement && maxRetries-- > 0) {
            return new PromiseConstructor(waitForFrame).then(waitForDocument);
          }
          const root = document.documentElement;
          root.appendChild(noscriptElement);
          if (blobURL) PromiseConstructor.resolve().then(function () { URL.revokeObjectURL(blobURL); });

          removeFrame = function (setTimeout) {
            const removeFrameWhenReady = function (e) {
              if (e) win.removeEventListener("DOMContentLoaded", removeFrameWhenReady, false);
              e = noscriptElement;
              noscriptElement = win = removeFrame = 0;
              if (setTimeout) {
                setTimeout(function () { e.remove(); }, 200);
              } else {
                e.remove();
              }
            };
            if (!setTimeout || document.readyState !== 'loading') {
              removeFrameWhenReady();
            } else {
              win.addEventListener("DOMContentLoaded", removeFrameWhenReady, false);
            }
          };
        })();
      }
      (function waitForFrameContext() {
        if (!frame.contentWindow && maxRetries-- > 0) {
          return new PromiseConstructor(waitForFrame).then(waitForFrameContext);
        }
        const frameContext = frame.contentWindow;
        if (!frameContext) throw new Error('window is not found.');
        try {
          const { requestAnimationFrame, setInterval, setTimeout, clearInterval, clearTimeout } = frameContext;
          const boundFunctions = { requestAnimationFrame, setInterval, setTimeout, clearInterval, clearTimeout };
          for (let key in boundFunctions) boundFunctions[key] = boundFunctions[key].bind(win);
          if (removeFrame) PromiseConstructor.resolve(boundFunctions.setTimeout).then(removeFrame);
          resolve(boundFunctions);
        } catch (e) {
          if (removeFrame) removeFrame();
          resolve(null);
        }
      })();
    });
  };

  initializeContext(win).then(function (context) {
    if (!context) return null;

    const { requestAnimationFrame, setTimeout, setInterval, clearTimeout, clearInterval } = context;

    let animationFrameInterrupter = null;

    const createRAFHelper = function () {
      const animationElement = document.createElement('a-f');
      if (!('onanimationiteration' in animationElement)) {
        return function (resolve) {
          animationFrameInterrupter = resolve;
          requestAnimationFrame(resolve);
        };
      }
      animationElement.id = 'a-f';
      let animationQueue = null;
      animationElement.onanimationiteration = function () {
        if (animationQueue !== null) {
          animationQueue();
          animationQueue = null;
        }
      };
      if (!document.getElementById('afscript')) {
        const style = document.createElement('style');
        style.id = 'afscript';
        style.textContent = `
          @keyFrames aF1 {
            0% { order: 0; }
            100% { order: 1; }
          }
          #a-f[id] {
            visibility: collapse !important;
            position: fixed !important;
            display: block !important;
            top: -100px !important;
            left: -100px !important;
            margin: 0 !important;
            padding: 0 !important;
            outline: 0 !important;
            border: 0 !important;
            z-index: -1 !important;
            width: 0px !important;
            height: 0px !important;
            contain: strict !important;
            pointer-events: none !important;
            animation: 1ms steps(2, jump-none) 0ms infinite alternate forwards running aF1 !important;
          }
        `;
        (document.head || document.documentElement).appendChild(style);
      }
      document.documentElement.insertBefore(animationElement, document.documentElement.firstChild);
      return function (resolve) {
        animationQueue = resolve;
        animationFrameInterrupter = resolve;
      };
    };

    const rafHelper = createRAFHelper();

    (function () {
      let afPromisePrimary, afPromiseSecondary;
      afPromisePrimary = afPromiseSecondary = { resolved: true };
      let afIndex = 0;
      const resolveRAF = function (rafPromise) {
        return new PromiseConstructor(function (resolve) {
          rafHelper(resolve);
        }).then(function () {
          rafPromise.resolved = true;
          const time = ++afIndex;
          if (time > 9e9) afIndex = 9;
          rafPromise.resolve(time);
          return time;
        });
      };
      const executeRAF = function () {
        return new PromiseConstructor(function (resolve) {
          const pendingPrimary = !afPromisePrimary.resolved ? afPromisePrimary : null;
          const pendingSecondary = !afPromiseSecondary.resolved ? afPromiseSecondary : null;
          let time = 0;
          if (pendingPrimary && pendingSecondary) {
            resolve(PromiseConstructor.all([pendingPrimary, pendingSecondary]).then(function (times) {
              const t1 = times[0];
              const t2 = times[1];
              time = t1 > t2 && t1 - t2 < 8e9 ? t1 : t2;
              return time;
            }));
          } else {
            const newPrimary = !pendingPrimary ? (afPromisePrimary = new ExternalPromise()) : null;
            const newSecondary = !pendingSecondary ? (afPromiseSecondary = new ExternalPromise()) : null;
            const executeSecondary = function () {
              if (newPrimary) {
                resolveRAF(newPrimary).then(function (t) {
                  time = t;
                  if (newSecondary) {
                    resolveRAF(newSecondary).then(function (t2) {
                      time = t2;
                      resolve(time);
                    });
                  } else {
                    resolve(time);
                  }
                });
              } else if (newSecondary) {
                resolveRAF(newSecondary).then(function (t) {
                  time = t;
                  resolve(time);
                });
              } else {
                resolve(time);
              }
            };
            if (pendingSecondary) {
              pendingSecondary.then(function () {
                executeSecondary();
              });
            } else if (pendingPrimary) {
              pendingPrimary.then(function () {
                executeSecondary();
              });
            } else {
              executeSecondary();
            }
          }
        });
      };
      const executingTasks = new Set();
      const wrapFunction = function (handler, store) {
        return function () {
          const currentTime = Date.now();
          if (currentTime - getTimeUpdate() < 800 && currentTime - store.lastTime < 800) {
            const id = store.id;
            executingTasks.add(id);
            executeRAF().then(function (time) {
              const isNotRemoved = executingTasks.delete(id);
              if (!isNotRemoved || time === store.lastExecution) return;
              store.lastExecution = time;
              store.lastTime = currentTime;
              handler();
            });
          } else {
            store.lastTime = currentTime;
            handler();
          }
        };
      };
      const createFunctionWrapper = function (originalFunction) {
        return function (func, ms) {
          if (ms === undefined) ms = 0;
          if (typeof func === 'function') {
            const store = { lastTime: Date.now() };
            const wrappedFunc = wrapFunction(func, store);
            store.id = originalFunction(wrappedFunc, ms);
            return store.id;
          } else {
            return originalFunction(func, ms);
          }
        };
      };
      win.setTimeout = createFunctionWrapper(setTimeout);
      win.setInterval = createFunctionWrapper(setInterval);

      const clearFunctionWrapper = function (originalFunction) {
        return function (id) {
          if (id) executingTasks.delete(id) || originalFunction(id);
        };
      };

      win.clearTimeout = clearFunctionWrapper(clearTimeout);
      win.clearInterval = clearFunctionWrapper(clearInterval);

      try {
        win.setTimeout.toString = setTimeout.toString.bind(setTimeout);
        win.setInterval.toString = setInterval.toString.bind(setInterval);
        win.clearTimeout.toString = clearTimeout.toString.bind(clearTimeout);
        win.clearInterval.toString = clearInterval.toString.bind(clearInterval);
      } catch (e) { console.warn(e); }
    })();

    let intervalInterrupter = null;
    setInterval(function () {
      if (intervalInterrupter === animationFrameInterrupter) {
        if (intervalInterrupter !== null) {
          animationFrameInterrupter();
          intervalInterrupter = null;
        }
      } else {
        intervalInterrupter = animationFrameInterrupter;
      }
    }, 125);
  });
})();
