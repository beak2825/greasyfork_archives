// ==UserScript==
// @name        YouTube _yt_player Tamer
// @namespace   UserScripts
// @match       https://www.youtube.com/*
// @grant       none
// @version     0.1.1
// @license     MIT
// @author      CY Fung
// @description To enhance YouTube performance by changing _yt_player
// @run-at      document-start
// @unwrap
// @inject-into page
// @downloadURL https://update.greasyfork.org/scripts/473958/YouTube%20_yt_player%20Tamer.user.js
// @updateURL https://update.greasyfork.org/scripts/473958/YouTube%20_yt_player%20Tamer.meta.js
// ==/UserScript==

function getZq(_yt_player){


  for(const [k,v] of Object.entries(_yt_player)){

    const p = typeof v ==='function' ? v.prototype : 0;
    if(p
       && typeof p.start === 'function'
       && typeof p.isActive === 'function'
       && typeof p.stop === 'function'){

      return k;

    }

  }


}

(()=>{

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




  cleanContext(window).then(__CONTEXT__ => {
    if (!__CONTEXT__) return null;

    const { requestAnimationFrame, setTimeout, cancelAnimationFrame, setInterval, clearInterval, animate, requestIdleCallback } = __CONTEXT__;


    class RAFHub {
      constructor() {
        /** @type {number} */
        this.startAt = 8170;
        /** @type {number} */
        this.counter = 0;
        /** @type {number} */
        this.rid = 0;
        /** @type {Map<number, FrameRequestCallback>} */
        this.funcs = new Map();
        const funcs = this.funcs;
        /** @type {FrameRequestCallback} */
        this.bCallback = this.mCallback.bind(this);
        this.pClear = () => funcs.clear();
      }
      /** @param {DOMHighResTimeStamp} highResTime */
      mCallback(highResTime) {
        this.rid = 0;
        Promise.resolve().then(this.pClear);
        this.funcs.forEach(func => Promise.resolve(highResTime).then(func).catch(console.warn));
      }
      /** @param {FrameRequestCallback} f */
      request(f) {
        if (this.counter > 1e9) this.counter = 9;
        let cid = this.startAt + (++this.counter);
        this.funcs.set(cid, f);
        if (this.rid === 0) this.rid = requestAnimationFrame(this.bCallback);
        return cid;
      }
      /** @param {number} cid */
      cancel(cid) {
        cid = +cid;
        if (cid > 0) {
          if (cid <= this.startAt) {
            return cancelAnimationFrame(cid);
          }
          if (this.rid > 0) {
            this.funcs.delete(cid);
            if (this.funcs.size === 0) {
              cancelAnimationFrame(this.rid);
              this.rid = 0;
            }
          }
        }
      }
    }

    const rafHub = new RAFHub();


    new Promise(resolve => {

      let cid = setInterval(() => {
        let t = (((window || 0)._yt_player || 0) || 0);
        if (t) {

          clearInterval(cid);
          resolve(t);
        }
      }, 1);
    }).then(_yt_player => {

      if(!_yt_player || typeof _yt_player !=='object')return;



      let keyZq = getZq(_yt_player);
      // _yt_player[keyZq] = g.k

      if(!keyZq) return;


      const g = _yt_player
      let k = keyZq

      const f = g[k];
      if(typeof f !== 'function') return;

      let dummyObject = new f;
      let nilFunc = ()=>{};

      let nilObj = {};

      // console.log(1111111111)

      let keyBoolD = '';
      let keyWindow = '';
      let keyFuncC = '';
      let keyCidj = '';

      for(const [t,y] of Object.entries(dummyObject)){
        if(y instanceof Window) keyWindow = t;
      }

      dummyObject.start.call(new Proxy(dummyObject, {
        get(target, prop){
          let v= target[prop]
          if(v instanceof Window && !keyWindow){
            keyWindow = t;
          }
          let y= typeof v ==='function' ? nilFunc : typeof v ==='object' ? nilObj : v;
          if(prop === keyWindow) y = {
            requestAnimationFrame(f){
              return 3;
            },
            cancelAnimationFrame(){

            }
          }
          if(!keyFuncC && typeof v ==='function' && !(prop in target.constructor.prototype) ){
            keyFuncC = prop;
          }
          // console.log('[get]', prop, typeof target[prop])


          return y;
        },
        set(target, prop, value){

          if(typeof value==='boolean' && !keyBoolD){
            keyBoolD = prop;
          }
          if(typeof value ==='number' && !keyCidj && value >=2 ){
            keyCidj = prop;
          }

          // console.log('[set]', prop, value)
          target[prop]=value

          return true;
        }
      }))

/*
      console.log({
        keyBoolD,
        keyFuncC,
        keyWindow,
        keyCidj
      })

      console.log( dummyObject[keyFuncC])


      console.log(2222222222)
*/




     g[k].prototype.start = function() {
        this.stop();
        this[keyBoolD] = true;
         this[keyCidj] = rafHub.request(this[keyFuncC]);
    }
    ;
    g[k].prototype.stop = function() {
        if (this.isActive() && this[keyCidj]) {
          rafHub.cancel(this[keyCidj]);
        }
        this[keyCidj] = null
    }


      /*
          g[k].start = function() {
        this.stop();
        this.D = true;
        var a = requestAnimationFrame
          , b = cancelAnimationFrame;
         this.j =  a.call(this.B, this.C)
    }
    ;
    g[k].stop = function() {
        if (this.isActive()) {
            var a = requestAnimationFrame
              , b = cancelAnimationFrame;
             b.call(this.B, this.j)
        }
        this.j = null
    }
      */


    });

  });





})();