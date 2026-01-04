// ==UserScript==
// @name         A Vue Detector (开发版)
// @namespace    Vue Detetcor
// @version      0.3
// @description  一个 Vue 页面探针
// @author       mscststs
// @license      ISC
// @match        *://*/*
// @grant       GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/442012/A%20Vue%20Detector%20%28%E5%BC%80%E5%8F%91%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/442012/A%20Vue%20Detector%20%28%E5%BC%80%E5%8F%91%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function detector(){
        const body = document.querySelector("body");
        const script = document.createElement("script");
        script.src = "http://localhost/vueDetector/vueDetector.umd.min.js?v="+Math.random();
        script.onload = function(){
            window.vueDetector && console.log("[[ Vue Detector Loaded]]");
            try{
                new vueDetector.default({mode:"dev", reload:detector});
            }catch(e){
                console.error(e)
            }
            //setTimeout(()=>{new vueDetector.default();},500)
        };
        body.appendChild(script);
    }

    GM_registerMenuCommand( "打开探针",()=>{
        detector();
    });




    // Your code here...
})();