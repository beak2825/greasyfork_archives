// ==UserScript==
// @name         cq_auto_script3
// @namespace    skeleton
// @version      1.0.0
// @description  private script3
// @author       skeleton
// @match        *://*.chaoxing.com/mycourse/studentstudy*
// @run-at       document-end
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/449185/cq_auto_script3.user.js
// @updateURL https://update.greasyfork.org/scripts/449185/cq_auto_script3.meta.js
// ==/UserScript==
 
 
(function() {
 
    'use strict';
    setTimeout(()=>{
         window.document.location.reload()
    },60 * 60 * 1000)
})();
 
 