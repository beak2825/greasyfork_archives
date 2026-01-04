// ==UserScript==
// @name        YouTube schedulerInstanceInstance_ Tamer
// @namespace   UserScripts
// @match       https://www.youtube.com/*
// @grant       none
// @version     0.1.0
// @license     MIT
// @author      CY Fung
// @description To enhance YouTube performance by changing schedulerInstanceInstance_
// @run-at      document-start
// @unwrap
// @inject-into page
// @allFrames
// @downloadURL https://update.greasyfork.org/scripts/473957/YouTube%20schedulerInstanceInstance_%20Tamer.user.js
// @updateURL https://update.greasyfork.org/scripts/473957/YouTube%20schedulerInstanceInstance_%20Tamer.meta.js
// ==/UserScript==


(() => {



  const Promise = (async () => { })().constructor;

  const cleanContext = async (win) => {
    const waitFn = requestAnimationFrame; // shall have been binded to window
    try {
      let mx = 16; // MAX TRIAL
      const frameId = 'vanillajs-iframe-v1';
      /** @type {HTMLIFrameElement | null} */
      let frame = document.getElementById(frameId);
      let removeIframeFn = null;
      if (!frame) {
        frame = document.createElement('iframe');
        frame.id = 'vanillajs-iframe-v1';
        frame.sandbox = 'allow-same-origin'; // script cannot be run inside iframe but API can be obtained from iframe
        let n = document.createElement('noscript'); // wrap into NOSCRPIT to avoid reflow (layouting)
        n.appendChild(frame);
        while (!document.documentElement && mx-- > 0) await new Promise(waitFn); // requestAnimationFrame here could get modified by YouTube engine
        const root = document.documentElement;
        root.appendChild(n); // throw error if root is null due to exceeding MAX TRIAL
        removeIframeFn = (setTimeout) => {
          const removeIframeOnDocumentReady = (e) => {
            e && win.removeEventListener("DOMContentLoaded", removeIframeOnDocumentReady, false);
            win = null;
            setTimeout(() => {
              n.remove();
              n = null;
            }, 200);
          }
          if (document.readyState !== 'loading') {
            removeIframeOnDocumentReady();
          } else {
            win.addEventListener("DOMContentLoaded", removeIframeOnDocumentReady, false);
          }
        }
      }
      while (!frame.contentWindow && mx-- > 0) await new Promise(waitFn);
      const fc = frame.contentWindow;
      if (!fc) throw "window is not found."; // throw error if root is null due to exceeding MAX TRIAL
      const { requestAnimationFrame, setTimeout, cancelAnimationFrame, setInterval, clearInterval, requestIdleCallback } = fc;
      const res = { requestAnimationFrame, setTimeout, cancelAnimationFrame, setInterval, clearInterval, requestIdleCallback };
      for (let k in res) res[k] = res[k].bind(win); // necessary
      if (removeIframeFn) Promise.resolve(res.setTimeout).then(removeIframeFn);
      res.animate = HTMLElement.prototype.animate;
      jsonParseFix = {
        _JSON: fc.JSON, _parse: fc.JSON.parse
      }
      return res;
    } catch (e) {
      console.warn(e);
      return null;
    }
  };


  let idleFrom = Date.now() + 2700;
  let slowMode = false;

  let ytEvented = false;

  function setupEvents(){

  document.addEventListener('yt-navigate', () => {

    ytEvented = true;
    slowMode = false;
    idleFrom = Date.now() + 2700;

  });
  document.addEventListener('yt-navigate-start', () => {

    ytEvented = true;
    slowMode = false;
    idleFrom = Date.now() + 2700;

  });

  document.addEventListener('yt-page-type-changed', () => {

    ytEvented = true;
    slowMode = false;
    idleFrom = Date.now() + 1700;

  });


  document.addEventListener('yt-player-updated', () => {

    ytEvented = true;
    slowMode = false;
    idleFrom = Date.now() + 1700;

  });


  document.addEventListener('yt-page-data-fetched', () => {

    ytEvented = true;
    slowMode = false;
    idleFrom = Date.now() + 1700;

  });

  document.addEventListener('yt-navigate-finish', () => {

    ytEvented = true;
    slowMode = false;
    let t = Date.now() + 700;
    if(t>idleFrom) idleFrom = t;

  });

  document.addEventListener('yt-page-data-updated', () => {

    ytEvented = true;
    slowMode = false;
    let t = Date.now() + 700;
    if(t>idleFrom) idleFrom = t;

  });

  document.addEventListener('yt-watch-comments-ready', () => {

    ytEvented = true;
    slowMode = false;
    let t = Date.now() + 700;
    if(t>idleFrom) idleFrom = t;

  });
  }


  cleanContext(window).then(__CONTEXT__ => {
    if (!__CONTEXT__) return null;

    const { requestAnimationFrame, setTimeout, cancelAnimationFrame, setInterval, clearInterval, animate, requestIdleCallback } = __CONTEXT__;

    //      window.requestAnimationFrame=function(r){
    //        console.log(location.href)
    //        console.log((new Error()).stack);
    //        return requestAnimationFrame(r)
    //      }


    let foregroundResolveFn = null;
    let foregroundPromise = null;

    const getForegroundPromise = () => {
      if (document.visibilityState === 'visible') return Promise.resolve();
      else {
        return foregroundPromise = foregroundPromise || new Promise(resolve=>{
          requestAnimationFrame(()=>{
            foregroundPromise = null;
            resolve();
          });
        });
      }
    }

    new Promise(resolve => {

      let cid = setInterval(() => {
        let t = (((window || 0).ytglobal || 0).schedulerInstanceInstance_ || 0);
        if (t) {

          clearInterval(cid);
          resolve(t);
        }
      }, 1);
    }).then(schedulerInstanceInstance_ => {

      if (!ytEvented) {
        idleFrom = Date.now() + 2700;
        slowMode = false; // integrity
      }

      const checkOK = typeof schedulerInstanceInstance_.start === 'function' && !schedulerInstanceInstance_.start991 && !schedulerInstanceInstance_.stop && !schedulerInstanceInstance_.cancel && !schedulerInstanceInstance_.terminate && !schedulerInstanceInstance_.interupt;
      if (checkOK) {


        schedulerInstanceInstance_.start991 = schedulerInstanceInstance_.start;


        let pp = Promise.resolve();

        let requestingFn = null;
        let requestingArgs = null;
        let requestingDT = 0;

        let timerId = null;
        const entries = [];
        const f = function () {
          requestingFn = this.fn;
          requestingArgs = [...arguments];
          requestingDT = Date.now();
          entries.push({
            fn: requestingFn,
            args: requestingArgs,
            t: requestingDT
          });
          // if (Date.now() < idleFrom) {
          //   timerId = this.fn.apply(window, arguments);
          // } else {
          //   timerId = this.fn.apply(window, arguments);

          // }
          // timerId = 12377;
          return 12377;
        }


        const fakeFns = [
          f.bind({ fn: requestAnimationFrame }),
          f.bind({ fn: setInterval }),
          f.bind({ fn: setTimeout }),
          f.bind({ fn: requestIdleCallback })
        ]




        let timerResolve = null;
        setInterval(() => {
          timerResolve && timerResolve();
          timerResolve = null;
          if (!slowMode && Date.now() > idleFrom) slowMode = true;
        }, 250);

        let mzt = 0;

        let fnSelectorProp = null;

        schedulerInstanceInstance_.start = function () {

          const mk1 = window.requestAnimationFrame
          const mk2 = window.setInterval
          const mk3 = window.setTimeout
          const mk4 = window.requestIdleCallback

          const tThis = this['$$12378$$'] || this;


          window.requestAnimationFrame = fakeFns[0]
          window.setInterval = fakeFns[1]
          window.setTimeout = fakeFns[2]
          window.requestIdleCallback = fakeFns[3]

          fnSelectorProp = null;


          tThis.start991.call(new Proxy(tThis, {
            get(target, prop, receiver) {
              if (prop === '$$12377$$') return true;
              if (prop === '$$12378$$') return target;

              // console.log('get',prop)
              return target[prop]
            },
            set(target, prop, value, receiver) {
              // console.log('set', prop, value)


              if (value >= 1 && value <= 4) fnSelectorProp = prop;
              if (value === 12377 && fnSelectorProp) {

                const originalSelection = target[fnSelectorProp];
                const timerIdProp = prop;

                /*


          case 1:
              var a = this.K;
              this.g = this.I ? window.requestIdleCallback(a, {
                  timeout: 3E3
              }) : window.setTimeout(a, ma);
              break;
          case 2:
              this.g = window.setTimeout(this.M, this.N);
              break;
          case 3:
              this.g = window.requestAnimationFrame(this.L);
              break;
          case 4:
              this.g = window.setTimeout(this.J, 0)
          }

          */

                const doForegroundSlowMode = () => {

                  const tir = ++mzt;
                  const f = requestingArgs[0];


                  getForegroundPromise().then(() => {


                    new Promise(r => {
                      timerResolve = r
                    }).then(() => {
                      if (target[timerIdProp] === -tir) f();
                    });

                  })

                  target[fnSelectorProp] = 931;
                  target[prop] = -tir;
                }

                if (target[fnSelectorProp] === 2 && requestingFn === setTimeout) {
                  if (slowMode && !(requestingArgs[1] > 250)) {

                    doForegroundSlowMode();

                  } else {
                    target[prop] = setTimeout.apply(window, requestingArgs);

                  }

                } else if (target[fnSelectorProp] === 3 && requestingFn === requestAnimationFrame) {

                  if (slowMode) {

                    doForegroundSlowMode();

                  } else {
                    target[prop] = requestAnimationFrame.apply(window, requestingArgs);
                  }


                } else if (target[fnSelectorProp] === 4 && requestingFn === setTimeout && !requestingArgs[1]) {

                  const f = requestingArgs[0];
                  const tir = ++mzt;
                  Promise.resolve().then(() => {
                    if (target[timerIdProp] === -tir) f();
                  });
                  target[fnSelectorProp] = 930;
                  target[prop] = -tir;

                } else if (target[fnSelectorProp] === 1 && (requestingFn === requestIdleCallback || requestingFn === setTimeout)) {

                  doForegroundSlowMode();

                } else {
                  // target[prop] = timerId;
                  target[fnSelectorProp] = 0;
                  target[prop] = 0;
                }

                // *****
                // console.log('[[set]]', slowMode , prop, value, `fnSelectorProp: ${originalSelection} -> ${target[fnSelectorProp]}`)
              } else {

                target[prop] = value;
              }
              // console.log('set',prop,value)
              return true;
            }
          }));

          fnSelectorProp = null;


          window.requestAnimationFrame = mk1;
          window.setInterval = mk2
          window.setTimeout = mk3
          window.requestIdleCallback = mk4;



        }

        schedulerInstanceInstance_.start.toString = function () {
          return schedulerInstanceInstance_.start991.toString();
        }

        const funcNames = [...(schedulerInstanceInstance_.start + "").matchAll(/[\(,]this\.(\w{1,2})[,\)]/g)].map(e => e[1]).map(prop => ({
          prop,
          value: schedulerInstanceInstance_[prop],
          type: typeof schedulerInstanceInstance_[prop]

        }));
        // console.log('fcc', funcNames)




      }


    }).catch(console.warn);

  });

  setupEvents();



})();