// ==UserScript==
// @name            百度搜索Stylish样式修复
// @namespace       https://greasyfork.org/users/4
// @description     Restore Stylish styles from deletion on baidu.com
// @version         1.0
// @author          Maplerecall
// @match           *://www.baidu.com/*
// @run-at          document-start
// @downloadURL https://update.greasyfork.org/scripts/2476/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2Stylish%E6%A0%B7%E5%BC%8F%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/2476/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2Stylish%E6%A0%B7%E5%BC%8F%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

function fixBaiduStyle(){
    if(window.location.href.indexOf("/s?")==-1){
        if(window.location.href.indexOf("#wd")!=-1){
            window.location.href="http://www.baidu.com/s?wd="+window.location.href.substring(window.location.href.indexOf("=")+1,window.location.href.indexOf("&"));
        }
        else {
            setTimeout(fixBaiduStyle,500);
        }
    }
}
fixBaiduStyle();