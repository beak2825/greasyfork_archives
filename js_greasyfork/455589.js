// ==UserScript==
// @name         Overleaf Editor Font Customizer
// @name:zh-CN   Overleaf 编辑器字体修改
// @namespace    https://greasyfork.org/en/scripts/455589
// @version      1.0
// @description  Customize your Overleaf editor's font family.
// @description:zh-CN  该脚本允许你自定义 Overleaf 编辑器的字体。
// @author       billchen2k
// @license      MIT
// @match        https://www.overleaf.com/project/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=overleaf.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/455589/Overleaf%20Editor%20Font%20Customizer.user.js
// @updateURL https://update.greasyfork.org/scripts/455589/Overleaf%20Editor%20Font%20Customizer.meta.js
// ==/UserScript==

// Change this to your desired font family.
var fontFamily = "PragmataPro Liga, Consolas, CMU Typewriter Text, Songti SC";

(function() {
    'use strict';
    window.addEventListener('load', function() {
        GM_addStyle(`.cm-content {font-family: ${fontFamily} !important;}`);
    }, false);
})();