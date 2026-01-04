// ==UserScript==
// @name         google百度搜索屏蔽CSDN
// @icon         https://csdnimg.cn/public/favicon.ico
// @namespace    http://cjcmx.net/
// @version      0.1
// @description  自动在搜索条件后面增加 -csdn， 以此屏蔽csdn网站信息。只适用于google和百度的搜索页面
// @author       cjcmx
// @match        *://www.google.com/search*
// @match        *://www.baidu.com/s*
// @match        *://www.baidu.com/$
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375279/google%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%B1%8F%E8%94%BDCSDN.user.js
// @updateURL https://update.greasyfork.org/scripts/375279/google%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%B1%8F%E8%94%BDCSDN.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var className = {
        "baidu":"s_ipt",
        "google": "gLFyf gsfi"
    };
    var key = window.location.href.indexOf("://www.baidu.com")!=-1 ? "baidu" : "google";
    var wordInput = document.getElementsByClassName(className[key])[0];
    if(wordInput){
        wordInput.addEventListener("keydown",function(e){
            if(e.key=='Enter' && this.value.length>0 && this.value.indexOf("-csdn")==-1){
                this.value += " -csdn";
            }
        });
        wordInput.addEventListener("blur",function(){
            if(this.value.length>0 && this.value.indexOf("-csdn")==-1){
                this.value += " -csdn";
            }
        });
        wordInput.addEventListener("focus",function(){
            var index = this.value.indexOf(" -csdn");
            if(index != -1){
                this.value = this.value.substring(0,index);
            }
        })
    }
})();