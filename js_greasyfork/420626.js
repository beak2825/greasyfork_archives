// ==UserScript==
// @name         Luckybaud Plugin
// @name:zh-CN   Luckybaud 成绩查询插件
// @namespace    https://jianqinggao.com
// @version      0.2.1
// @description  Allowing you to check your grade from the main screen in the Assignment Center! No need to go to the assignment detail page.
// @description:zh-CN  允许你直接从作业中心直接查看你的成绩,无需点进作业细节页面！
// @author       Johnson Gao
// @match        https://*.myschoolapp.com/app/student
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @grant        none
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/420626/Luckybaud%20Plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/420626/Luckybaud%20Plugin.meta.js
// ==/UserScript==
//
//Copyright 2021 Jianqing Gao
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

/**
 * Invoked when the document is ready. Inject the main script into the webpage.
 * The main script must be injected because the script requires adding eventlistener
 * and calling functions in the scripts
 * to some elements.
 */
$(document).ready(() => {
    // inject the script if and only if the user is on the correct page.
    if (window.location.href.includes("assignment-center")) {
        var s = document.createElement("script")
        s.src = "https://us.file.jianqinggao.com/dist/LuckyBaud.js"
        document.getElementsByTagName("head")[0].appendChild(s)
    }

})