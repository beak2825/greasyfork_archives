// ==UserScript==
// @name         debugger_shortcut
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  debugger_shortcut_desc
// @author       XT
// @match        *://*/*
// @grant        none
// @license Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/507116/debugger_shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/507116/debugger_shortcut.meta.js
// ==/UserScript==

(function () {
    'use strict';
  
    var statusDiv = document.createElement('div');
    statusDiv.style.position = 'fixed';
    statusDiv.style.bottom = '10px';
    statusDiv.style.right = '10px';
    statusDiv.style.backgroundColor = '#333';
    statusDiv.style.color = 'white';
    statusDiv.style.padding = '10px';
    statusDiv.style.zIndex = '10000';
    statusDiv.style.borderRadius = '5px';
    statusDiv.style.fontFamily = 'Arial, sans-serif';
    statusDiv.innerHTML = 'click F2';
    document.body.appendChild(statusDiv);
  
    document.addEventListener('keydown', function (event) {
      if (event.key === 'F2') {
        statusDiv.innerHTML = 'debugger sucessful';
        debugger;
      }
    });
  
    // 显示脚本成功运行的信息
    console.log("Tampermonkey Loaded");
  })();
  