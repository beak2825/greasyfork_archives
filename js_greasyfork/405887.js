// ==UserScript==
// @name         笔试小助手~嘘~
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  小助手
// @author       ssxxaabb
// @match        *://*/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/405887/%E7%AC%94%E8%AF%95%E5%B0%8F%E5%8A%A9%E6%89%8B~%E5%98%98~.user.js
// @updateURL https://update.greasyfork.org/scripts/405887/%E7%AC%94%E8%AF%95%E5%B0%8F%E5%8A%A9%E6%89%8B~%E5%98%98~.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let bodyEl = $("body");
    bodyEl.append('<div style="position: absolute; opacity: 90%; min-width: 50px; min-height: 50px; top: 5px; left: 5px; z-index: 9999">\n' +
        '    <div id="addClose" style="position: absolute; right: 5px; top: 5px; color: red; cursor:pointer ">关闭</div>\n' +
        '    <iframe id="addBaidu" style="width: 500px; height: 400px; display: none;" src="https://m.baidu.com" scrolling="yes" sandbox="allow-same-origin allow-top-navigation allow-forms allow-scripts">\n' +
        '    </iframe>\n' +
        '</div>')
    $("#addClose").click(function () {
        let addBaidu = $("#addBaidu");
        if (addBaidu.css('display') !== 'none'){
            $("#addBaidu").css('display', 'none');

        }else{
            $("#addBaidu").css('display', 'block');
        }
    })
})();