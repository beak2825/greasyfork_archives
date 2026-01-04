// ==UserScript==
// @name         吾爱打开自动签到
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  吾爱论坛自动签到
// @author       sugarzhang、院长
// @match        https://www.52pojie.cn/
// @include      *://www.52pojie.cn*
// @grant        GM_addStyle
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @require      https://cdn.bootcss.com/sweetalert/2.1.2/sweetalert.min.js
// @require      https://code.jquery.com/jquery-latest.js
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
// @license      GPL License
// @downloadURL https://update.greasyfork.org/scripts/394307/%E5%90%BE%E7%88%B1%E6%89%93%E5%BC%80%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/394307/%E5%90%BE%E7%88%B1%E6%89%93%E5%BC%80%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

function getInfoString(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = window.location.search.substr(1).match(reg);
            if (r != null)
                return unescape(r[2]);
            return null;
        }

$(document).ready(function() {

    //获取签到按钮
    var qiandao = $('#um > p:nth-child(3) > a:nth-child(1)');
    if(qiandao[0] != undefined){
        //模拟点击事件
        qiandao[0].click();
    }

    //var url = window.location.href;
    var param = location.search.substr(1);

   if(window.location.href == ('https://www.52pojie.cn/home.php?'+param)){
      //获取首页a链接
        var shouye = $('#hd > div > div.hdc.cl > h2 > a');
      //模拟首页点击事件,一秒后，跳转首页
       setTimeout(shouye[0].click(),2000);
   }

});

