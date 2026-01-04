// ==UserScript==
// @name         cq_auto_script
// @namespace    skeleton
// @version      3.0.0
// @description  private script
// @author       skeleton
// @match        *://*.chaoxing.com/space/*
// @run-at       document-end
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/449001/cq_auto_script.user.js
// @updateURL https://update.greasyfork.org/scripts/449001/cq_auto_script.meta.js
// ==/UserScript==
 
 
(function() {
 
    'use strict';
    setTimeout(()=>{
        const win = unsafeWindow.document.querySelector('iframe').contentWindow
        win.getStudied?.()

        setTimeout(()=>{
            // 随机看课
            const links = Array.from(win.document.querySelectorAll('.w_cournopadd .w_cour_txt a'))
            const count = parseInt(Math.random() * links.length)
            links[count]?.click()
        },10000)
    },5000)
})();
 
 