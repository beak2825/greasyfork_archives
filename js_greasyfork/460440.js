// ==UserScript==
// @name         快捷谷歌
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       xki
// @match        *://*.bing.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @downloadURL https://update.greasyfork.org/scripts/460440/%E5%BF%AB%E6%8D%B7%E8%B0%B7%E6%AD%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/460440/%E5%BF%AB%E6%8D%B7%E8%B0%B7%E6%AD%8C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var a=new URL(document.URL)
    var c=a.searchParams.get('q')
    var b='https://www.google.com/search?q='+c;
    //key listener ALT+Z快速跳转到google搜索
    document.addEventListener("keydown", async event => {
      const e = event || window.Event;
      const ekey = e.altKey && !e.ctrlKey && !e.shiftKey;
      if (e.keyCode === 90 && ekey) {
        e.preventDefault();
        window.location.replace(b);
      }})
    console.log(c);
    // Your code here...
})();