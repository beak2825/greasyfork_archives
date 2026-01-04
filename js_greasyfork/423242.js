// ==UserScript==
// @name         python文档方向键翻页
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  方便读python文档
// @author       You
// @match        https://docs.python.org/zh-cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423242/python%E6%96%87%E6%A1%A3%E6%96%B9%E5%90%91%E9%94%AE%E7%BF%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/423242/python%E6%96%87%E6%A1%A3%E6%96%B9%E5%90%91%E9%94%AE%E7%BF%BB%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    let key_text = {37:"上一页",39:"下一页"};
    document.onkeydown=function(e){
        let k = window.event?e.keyCode:e.which;
        for (let key in key_text) {
            if(k==key){
                let ass = document.querySelectorAll("div.related>ul>li.right>a");
                for(let a of ass){
                    if(a.innerHTML== key_text[key]){
                        a.click();
                    }
                }
            }
        }
    }
})();