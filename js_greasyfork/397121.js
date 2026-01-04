// ==UserScript==
// @name         Reverse anime list in myself-bbs
// @description  Reverse anime list in https://myself-bbs.com/
// @icon         https://myself-bbs.com/favicon.ico
// @author       jaychsu
// @version      1.0.0
// @license      WTFPL
// @match        https://myself-bbs.com/thread-*
// @namespace https://greasyfork.org/users/420771
// @downloadURL https://update.greasyfork.org/scripts/397121/Reverse%20anime%20list%20in%20myself-bbs.user.js
// @updateURL https://update.greasyfork.org/scripts/397121/Reverse%20anime%20list%20in%20myself-bbs.meta.js
// ==/UserScript==


(function() {
    'use strict'
  
    const list = document.querySelector('.main_list')
    
    let i = list.childNodes.length
    
    while (i--) list.appendChild(list.childNodes[i])
})()