// ==UserScript==
// @name         google百度搜索屏蔽douyin
// @icon         https://csdnimg.cn/public/favicon.ico
// @namespace    http://io.bhe.ink/
// @version      0.1
// @description  自动在搜索条件后面增加 -douyin.com， 以此屏蔽douyin网站信息。只适用于google和百度的搜索页面 借鉴自 cjcmx
// @author       cjcmx
// @match        *://www.google.com/search*
// @match        *://www.baidu.com/s*
// @match        *://www.baidu.com/$
// @license      mit
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536808/google%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%B1%8F%E8%94%BDdouyin.user.js
// @updateURL https://update.greasyfork.org/scripts/536808/google%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%B1%8F%E8%94%BDdouyin.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var className = {
        "baidu":"s_ipt",
        "google": "gLFyf"
    };
    var key = window.location.href.indexOf("://www.baidu.com")!=-1 ? "baidu" : "google";

    var elements = document.getElementsByClassName(className[key]);
    var wordInput;
    for (var i = 0; i < elements.length; i++) {
        if (elements[i].tagName.toLowerCase() === 'textarea') {
            wordInput = elements[i];
        }
    }
    if(wordInput){
        wordInput.addEventListener("keydown",function(e){
            if(e.key=='Enter' && this.value.length>0 && this.value.indexOf("-douyin.com")==-1){
                this.value += " -douyin.com";
            }
        });
        wordInput.addEventListener("blur",function(){
            if(this.value.length>0 && this.value.indexOf("-douyin.com")==-1){
                this.value += " -douyin.com";
            }
        });
        wordInput.addEventListener("focus",function(){
            var index = this.value.indexOf(" -douyin.com");
            if(index != -1){
                this.value = this.value.substring(0,index);
            }
        })
    }
})();