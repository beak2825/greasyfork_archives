// ==UserScript==
// @name         yyds
// @namespace    http://www.csgxcf.com/
// @version      1.0.0
// @description  zhenzhendeliwu
// @author       nkg
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js
// @match        https://*.magicmirror.sankuai.com/*
// @grant        GM_download
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @grant        GM_info
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/429545/yyds.user.js
// @updateURL https://update.greasyfork.org/scripts/429545/yyds.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var flag = null;

$("#t1").bind("DOMNodeInserted", function(e) {
    if(flag != null){
        clearTimeout(flag);
    }
    flag = setTimeout(function() {
        startIt();
    }, 500);
});

function startIt(){
    if(document.getElementsByName("armsg")[1].children.length < 22){
        $("#t1 div[name='armsg']").append("<input type=\"button\" value=\"YYDS\" onclick=\"addOptions(this)\" class=\"findCls\" style=\"width: 66px;float: inherit;\">");
    }
    if(document.getElementsByTagName("head")[0].children.length < 21){
        var btnscript = $('<script>function addOptions(btn){var opts = ["国内集团优享会", "会员特惠价"];for (let i = 0; i < opts.length; i++) {$(btn).parent().parent().find("#disCountSelect").append("<option value=" + opts[i]+">"+opts[i] + "</option>");}}</script>')
        $('head').append(btnscript);
    }
}
})();