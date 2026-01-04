// ==UserScript==
// @name         Bang to moder
// @namespace    http://tampermonkey.net/
// @version      0.111
// @description  try to take over the world!
// @author       You
// @match        https://shikme.ru/
// @icon         https://shikme.ru/default_images/icon.png
// updateURL     https://greasyfork.org/scripts/419764-bang-to-moder/code/Bang%20to%20moder.user.js
// @grant        none
// @grant        unsafeWindow
// @grant        GM_info
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/419764/Bang%20to%20moder.user.js
// @updateURL https://update.greasyfork.org/scripts/419764/Bang%20to%20moder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //win.document.onmousemove = function() {window.focus();
    var o = new Audio("https://shikme.ru/uploads/c71f6ae9fb59ba2586d81f24a01a4ea343c1cc59.mp3");
    if (observer) observer.disconnect();
    var observer = new MutationObserver(function(mutationList) {
        for (let mutation of mutationList) {
            if (mutation.addedNodes.length){
                //console.log(mutation);
                o.volume = 0.5;
                o.currentTime = 0;
                o.play();
            }
        }
    });
    observer.observe(report_notify, {childList: true, subtree: true});//get_private
    console.log(GM_info.script.name+' v'+GM_info.script.version+' run');
})();