// ==UserScript==
// @name         baidu-beautify
// @namespace    InTereSTingHE
// @version      0.1
// @description  Beautify your baidu page!
// @author       InTereSTingHE
// @match        https://www.baidu.com/
// @grant        none
// @require      http://code.jquery.com/jquery-3.x-git.min.js
/* globals jQuery, $, waitForKeyElements */

// @downloadURL https://update.greasyfork.org/scripts/419568/baidu-beautify.user.js
// @updateURL https://update.greasyfork.org/scripts/419568/baidu-beautify.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var lg = $('#lg');
    if(lg.length == 1){
        $(lg).html('<img id="s_lg_img" class="s_lg_img_gold_show" src="//www.baidu.com/img/PCtm_d9c8750bed0b3c7d089fa7d55720d6cf.png" width="270" height="129" usemap="#mp">');
    }

    var btn = $('#s_btn_wr');
    if(btn.length == 1){
        $(btn).html('<input type="submit" value="搜搜搜" id="su" class="btn self-btn bg s_btn">');
    }
})();