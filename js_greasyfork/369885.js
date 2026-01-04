// ==UserScript==
// @name         javlibrary to javbus
// @namespace    http://weib.in/
// @version      0.1.1
// @description  add a href to javbus
// @author       svatyvabin
// @match        http://www.javlibrary.com/cn/?v=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369885/javlibrary%20to%20javbus.user.js
// @updateURL https://update.greasyfork.org/scripts/369885/javlibrary%20to%20javbus.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var v = document.getElementById('video_id');
    var elementCode = v.childNodes[1].getElementsByClassName('text')[0];
    var code = elementCode.innerHTML;
    elementCode.innerHTML = '<a href="http://www.javbus.com/' + code + '">' + code + '</a>';
})();