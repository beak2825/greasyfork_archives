// ==UserScript==
// @name         禅道bug保存校验
// @namespace    http://tampermonkey.net/
// @version      2024-10-17
// @description  禅道创建/修改bug保存校验
// @author       漠北
// @match        https://chandao.mygjp.com.cn/bug-edit*
// @match        https://chandao.mygjp.com.cn/bug-create*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mygjp.com.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512825/%E7%A6%85%E9%81%93bug%E4%BF%9D%E5%AD%98%E6%A0%A1%E9%AA%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/512825/%E7%A6%85%E9%81%93bug%E4%BF%9D%E5%AD%98%E6%A0%A1%E9%AA%8C.meta.js
// ==/UserScript==

(function() {
    var btn = document.getElementById("submit")
    btn.onclick =(function() {
                if (document.getElementById("story").value==="0"){
            return confirm("bug未关联相关需求，请注意。如要要忽略提示请点击确认")
        }
         });

})();