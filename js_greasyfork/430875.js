// ==UserScript==
// @name         远景去广告
// @namespace    https://www.v587.com/
// @version      1.00
// @description  远景去广告 自用
// @author       penrcz
// @match        https://bbs.pcbeta.com
// @match        https://bbs.pcbeta.com/forum*
// @match        https://bbs.pcbeta.com/viewthread*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/430875/%E8%BF%9C%E6%99%AF%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/430875/%E8%BF%9C%E6%99%AF%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = $ || window.$ || unsafeWindow.$;

    var _oldShowADialog = unsafeWindow.showADialog;

    unsafeWindow.showADialog = function () {
        _p('fuck ad');
    };

    _p(unsafeWindow.top_frame);

    unsafeWindow.alert = function(){
        _p('alert');
    }

    var _script = $("script:last").remove();

    _p(_script);

    $("#BAIDU_DUP_fp_wrapper").remove();


})();

/**
 * 打印
 */
function _p(obj){
    console.log(obj);
}

