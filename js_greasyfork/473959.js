// ==UserScript==
// @name        YouTube Element.prototype.animate Tamer
// @namespace   UserScripts
// @match       https://www.youtube.com/*
// @grant       none
// @version     0.1.0
// @license     MIT
// @author      CY Fung
// @description To enhance YouTube performance by changing Element.prototype.animate
// @run-at      document-start
// @unwrap
// @inject-into page
// @downloadURL https://update.greasyfork.org/scripts/473959/YouTube%20Elementprototypeanimate%20Tamer.user.js
// @updateURL https://update.greasyfork.org/scripts/473959/YouTube%20Elementprototypeanimate%20Tamer.meta.js
// ==/UserScript==

(()=>{

  const Promise = (async ()=>{})().constructor;

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
      const { requestAnimationFrame, setTimeout, cancelAnimationFrame, setInterval, clearInterval } = fc;
      const res = { requestAnimationFrame, setTimeout, cancelAnimationFrame, setInterval, clearInterval };
      for (let k in res) res[k] = res[k].bind(win); // necessary
      if (removeIframeFn) Promise.resolve(res.setTimeout).then(removeIframeFn);
      res.animate = HTMLElement.prototype.animate;
      return res;
    } catch (e) {
      console.warn(e);
      return null;
    }
  };


  cleanContext(window).then(__CONTEXT__ => {
    if (!__CONTEXT__) return null;

    const { requestAnimationFrame, setTimeout, cancelAnimationFrame, setInterval, clearInterval, animate } = __CONTEXT__;

    HTMLCanvasElement.prototype.animate = animate;

    let cid = setInterval(()=>{
       HTMLCanvasElement.prototype.animate = animate;
    },1);

    setTimeout(()=>{
      clearInterval(cid)
    }, 3000)

  });

})();