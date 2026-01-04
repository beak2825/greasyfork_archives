// ==UserScript==
// @name         ZOZOshortcut2
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Execute UserScript
// @author       Your Name
// @match        https://hstorage.xyz/* 
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529685/ZOZOshortcut2.user.js
// @updateURL https://update.greasyfork.org/scripts/529685/ZOZOshortcut2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const button = document.createElement('div');
    button.style.position = 'fixed';
    button.style.top = '15px';
    button.style.left = '15px';
    button.style.width = '25px';
    button.style.height = '25px';
    button.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.zIndex = '10000';
    button.style.display = 'flex';
    button.style.alignItems = 'center';
    button.style.justifyContent = 'center';

    for (let i = 0; i < 3; i++) {
        const line = document.createElement('div');
        line.style.width = '20px';
        line.style.height = '3px';
        line.style.backgroundColor = 'white';
        line.style.margin = '2px 0';
        button.appendChild(line);
    }

    button.addEventListener('click', () => {
javascript:(function(){
  var u = window.location.href;
  var ua = navigator.userAgent;
  if(/android/i.test(ua)){
    window.location = "intent:" + u.replace(/^https?:\/\//, "") + "#Intent;package=com.android.chrome;scheme=https;end";
  }
})();
    });

    document.body.appendChild(button);
})();