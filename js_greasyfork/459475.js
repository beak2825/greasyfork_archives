// ==UserScript==
// @name         github助手
// @namespace    https://github.com/Twtcer
// @version      0.0.1
// @match        https://github.com/*
// @description  github助手 | 按alt + x 快捷复制克隆地址 |
// @author       Twtcer
// @grant        GM_setClipboard
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/459475/github%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/459475/github%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
      document.onkeydown = function(e) {
              if (e.keyCode == 88 && e.altKey) {
                  //console.log(`url: ${window.location.href}`);
                  let url = window.location.href;
                  let github = 'https://github.com/';
                  let arr = url.replace(github,'').split('/');

                  if(arr.length > 0) {
                      let userName = arr[0];
                      let repo = arr[1];
                      let projectUrl = `${github}${userName}/${repo}`;
                      let cloneUrl = `git clone ${projectUrl}`;
                      GM_setClipboard(cloneUrl,'{ type: ‘text’, mimetype: ‘text/plain’}'); 
                  }
              }
      }


})();