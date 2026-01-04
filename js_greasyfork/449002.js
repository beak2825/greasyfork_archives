// ==UserScript==
// @name         cq_auto_script_2
// @namespace    skeleton
// @version      4.0.0
// @description  private script_2
// @author       skeleton
// @match        *://mooc2-ans.chaoxing.com/mycourse/*
// @match        *://*.chaoxing.com/mooc2-ans/mycourse/studentcourse*
// @run-at       document-end
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/449002/cq_auto_script_2.user.js
// @updateURL https://update.greasyfork.org/scripts/449002/cq_auto_script_2.meta.js
// ==/UserScript==
 
 
(function() {
 
    'use strict';
     
    
    setTimeout(()=>{
        unsafeWindow.document.querySelector('[title].chapter_item')?.click()
    },5000)

    setTimeout(()=>{
        unsafeWindow.document.location.search = document.location.search.replace(/(pageHeader)=\d+/,'$1=1')
    },10000)
})();
 
 