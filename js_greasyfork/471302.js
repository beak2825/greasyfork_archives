// ==UserScript==
// @name         标小智LOGO神器编辑界面去水印
// @namespace    https://www.logosc.cn
// @version      0.2
// @description  需手动截图
// @author       shxuai
// @match        https://www.logosc.cn/edit*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-idle
// @license      版权没有,违者不究
// @require https://code.jquery.com/jquery-3.1.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/471302/%E6%A0%87%E5%B0%8F%E6%99%BALOGO%E7%A5%9E%E5%99%A8%E7%BC%96%E8%BE%91%E7%95%8C%E9%9D%A2%E5%8E%BB%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/471302/%E6%A0%87%E5%B0%8F%E6%99%BALOGO%E7%A5%9E%E5%99%A8%E7%BC%96%E8%BE%91%E7%95%8C%E9%9D%A2%E5%8E%BB%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */
this.$ = this.jQuery = jQuery.noConflict(true);

window.onload = function() {
    'use strict';


    $("rect.watermarklayer") .remove();

    $('.display-action--preview').click(function() {
        $("rect.watermarklayer").remove();
    });

}