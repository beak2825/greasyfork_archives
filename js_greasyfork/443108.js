// ==UserScript==
// @name         copy_killer.js
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  删除网站复制时讨厌的声明 目前支持网站 Leetcode | CSDN
// @author       wuuconix
// @match        https://leetcode-cn.com/problems/*
// @match        https://blog.csdn.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leetcode-cn.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443108/copy_killerjs.user.js
// @updateURL https://update.greasyfork.org/scripts/443108/copy_killerjs.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener('copy',function(e){
        let clipboardData = e.clipboardData || window.clipboardData
        let text = clipboardData.getData("text") //剪切板里的内容 这时已经有讨厌的声明了
        if (text) { //这个不能不判断。有时候text为空，但是 Default事件会给它加东西。所以我们必须在text有值得时候才preventDefault
            let leetCodeReg = /来源：力扣（LeetCode）\n链接：[\s\S]*非商业转载请注明出处。/
            let csdnReg = /————————————————[\s\S]{2}版权声明：本文为CSDN博主[\s\S]*/
            if (text.match(leetCodeReg)) {
                console.log("检测到Leetcode声明")
                text = text.replace(leetCodeReg, "")
            } else if (text.match(csdnReg, "")) {
                console.log("检测到CSDN声明")
                text = text.replace(csdnReg, "")
            }
            e.preventDefault();
            text = text.trim() //删除复制内容头尾的空格，优化复制体验
            clipboardData.setData('text/plain', text)
        }
	})
})();