// ==UserScript==
// @name         mask fix screen
// @name:zh-CN   拯救联想显示器灰色显示问题
// @noframes     true
// @namespace    https://github.com/jackdizhu
// @version      0.5.1
// @description:zh-CN  添加水印层，修复联想显示器，灰色色值显示问题
// @description:en     Fix screen gray display problem
// @author       jackdizhu
// @match        *
// @include      *
// @grant        none
// @run-at       document-end
// @require https://greasyfork.org/scripts/407021-get-os-info/code/get%20os%20info.js?version=826356
// @description 添加水印层，修复联想显示器，灰色色值显示问题
// @downloadURL https://update.greasyfork.org/scripts/381507/mask%20fix%20screen.user.js
// @updateURL https://update.greasyfork.org/scripts/381507/mask%20fix%20screen.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (!window.$os.Windows) {
        return false
    }
    var $div = document.createElement('div')
    $div.style = `
    position: fixed;
    pointer-events: none;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background: #eee;
    opacity: 0.1;
    z-index: 999999999;
    `
    document.body.appendChild($div)
})();