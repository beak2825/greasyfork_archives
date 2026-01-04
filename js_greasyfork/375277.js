// ==UserScript==
// @name         动词词皇
// @namespace    https://weibo.com/liuyinanlaoshi*
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://weibo.com/liuyinanlaoshi*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375277/%E5%8A%A8%E8%AF%8D%E8%AF%8D%E7%9A%87.user.js
// @updateURL https://update.greasyfork.org/scripts/375277/%E5%8A%A8%E8%AF%8D%E8%AF%8D%E7%9A%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setTimeout(() => {
        for(var i = 0; i < document.getElementsByClassName("WB_text W_f14").length; i++) {
            var more = document.getElementsByClassName("WB_text W_f14")[i].getElementsByClassName("WB_text_opt")[0];
            if(more){more.click()}
        }
        setTimeout(() => {
            for(var i = 0; i < document.getElementsByClassName("WB_text W_f14").length; i=i+2) {
                var temp = document.getElementsByClassName('WB_text W_f14')[i+1];
                var txt = temp.innerHTML.replace(/(v|vt|vi|n|a)([\.][\s\S]*?)(<br>|<a [\s\S]*?>)/g,'<input type=\'button\' value=\'more\' onclick="javascript:this.value=(this.value == \'more\'? \'$1$2\' : \'more\');this.style.color=(this.value == \'more\'? \'#ccc\' : \'#333\');" style="background:#fff; border: 1px #ccc solid; padding: 1px 5px;cursor: pointer; outline: none; color:#ccc;" /><br>');
                temp.innerHTML = txt;
            }
        }, 1000);
    }, 2000)();
})();