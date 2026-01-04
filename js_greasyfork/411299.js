// ==UserScript==
// @name         MSDN英文地址转中文地址
// @namespace    RudyLiu.MSDNTransfer
// @version      0.3
// @description  访问MSDN时英文地址(en-us)会自动转为(zh-cn)
// @author       rudylhm
// @match        https://learn.microsoft.com/*
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @icon         https://docs.microsoft.com/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/411299/MSDN%E8%8B%B1%E6%96%87%E5%9C%B0%E5%9D%80%E8%BD%AC%E4%B8%AD%E6%96%87%E5%9C%B0%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/411299/MSDN%E8%8B%B1%E6%96%87%E5%9C%B0%E5%9D%80%E8%BD%AC%E4%B8%AD%E6%96%87%E5%9C%B0%E5%9D%80.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var urlHost = 'https://learn.microsoft.com/'
    var defaultLang = 'zh-cn'
    var url = window.location.href
    var langArray = getLocaleArray()
    var lang = url.replace(urlHost,'').split('/')
    if (lang.length > 0){
        if (lang[0] != defaultLang){
            lang[0] = defaultLang
            let newUrl = urlHost+lang.join('/')
            window.location.replace(newUrl)
        }
    }
})();

function getLocaleArray(){
    var langUrl = 'https://docs.microsoft.com/zh-cn/locale/'
    $.ajaxSettings.async = false
    $.get(
        langUrl,
        function(response){

        }
    )
    $.ajaxSettings.async = true
}