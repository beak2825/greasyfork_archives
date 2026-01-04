// ==UserScript==
// @name         OCS助手
// @namespace    https://ocs.klweb.top
// @version      2.2.1
// @description  OCS网课脚本，目前有超星刷课脚本，超星作业考试脚本，智慧树刷课，作业脚本
// @author       skeleton
// @connect      klweb.top
// @match        **://**/**
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @require      https://unpkg.com/vue/dist/vue.min.js
// @require      https://unpkg.com/element-ui/lib/index.js
// @resource     skcss  https://wk.klweb.top/cdn/chaoxing/sk-panel.css
// @require      https://greasyfork.org/scripts/410993-chaoxing-html5-video-support/code/ChaoXing%20html5%20video%20support.js?version=857025
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/418575/OCS%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/418575/OCS%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

var chatiId = "";       //查题码，如果需要更改请填写到左边的 '' 里面 ，以后将默认使用这里的查题码 ctrl + s 保存


(function() {

 'use strict';
    var $ = jQuery

    unsafeWindow.alert=console.log;//禁止弹窗


    var originUrl = 'https://wk.klweb.top'

    var setting = {
        doWork:false
    }
    //引入我的主脚本
    $.getScript(originUrl+'/cdn/ocs.js?_='+new Date().getTime(),function(r,s){
        console.log(s)
        startSK({
            chatiId,unsafeWindow,$,Vue,originUrl,setting
        })
         console.log("脚本启动成功！")
    });
    let skcss = GM_getResourceText('skcss')
    localStorage.skPanelCss = skcss


})();



