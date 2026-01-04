// ==UserScript==
// @name         Import_tensorflow.js
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在线导入tensorflow.js,方便在控制台任意调试张量
// @author       Onion
// @match     https://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant     none
// @license   MIT
// @downloadURL https://update.greasyfork.org/scripts/455767/Import_tensorflowjs.user.js
// @updateURL https://update.greasyfork.org/scripts/455767/Import_tensorflowjs.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload=()=>{
        let script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.src = " https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@2.0.0/dist/tf.min.js";
        document.documentElement.appendChild(script);
    }

//         document.querySelector('html').innerHTML+=`<script src="https://raw.githubusercontent.com/LiWeny16/LiWeny16/main/js/tf.min.js"></script>`
    // Your code here...
})();