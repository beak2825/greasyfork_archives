// ==UserScript==
// @name         Youku 视频去广告
// @namespace    Youku.com
// @version      0.1
// @description  Youku 视频去广
// @match        https://v.youku.com/v_show/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408723/Youku%20%E8%A7%86%E9%A2%91%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/408723/Youku%20%E8%A7%86%E9%A2%91%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const rules = [
    {
      //去倒计时
      url: /^(https:)?\/\/acs\.youku\.com\/h5\/mtop\.youku\.play\.ups\.appinfo\.get.+callback=mtopjsonp.+/,
      async callback (url) {
        const val = await (await fetch(url, { credentials: 'include' })).text();
        const cb = url.match(/mtopjsonp\d*/);
        if(!cb) return;
        const index = val.indexOf(cb[0]);
        if(index < 2){
          const json = JSON.parse(val.slice(index + cb[0].length + 1, -1));
          delete json.data.data.ad;
          createScript(`${cb[0]}(${JSON.stringify(json)})`);
        }
      }
    }
  ];

  const createScript = (text) => {
    const script = document.createElement('script');
    script.textContent = text;
    document.head.appendChild(script);
    script.remove();
  }
  Object.defineProperty(
    HTMLScriptElement.prototype, '_original',
    Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, 'src')
  );
  Object.defineProperty(HTMLScriptElement.prototype, 'src', {
    get () {
      return this._original;
    },
    set (val) {
      const rule = rules.find(r => r.url.test(val));
      if (rule) {
        rule.callback(val);
      }else{
        this._original = val;
      }
    }
  });
})();
