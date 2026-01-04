// ==UserScript==
// @name         swagger复制【右键复制】
// @namespace    https://tangtao.cn
// @version      1.0.4
// @description  添加右键复制功能，支持path和描述。因为swagger版本不同，可能不会生效，请给我留言。
// @author       tangtao
// @match        */swagger-ui.html
// @match        */swagger/index.html
// @match        */api/swagger-ui/index.html
// @grant        GM_log
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_deleteValue
// @license      MIT License
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/445262/swagger%E5%A4%8D%E5%88%B6%E3%80%90%E5%8F%B3%E9%94%AE%E5%A4%8D%E5%88%B6%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/445262/swagger%E5%A4%8D%E5%88%B6%E3%80%90%E5%8F%B3%E9%94%AE%E5%A4%8D%E5%88%B6%E3%80%91.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Your code here...
    $(function () {
        initFunc();
    })
 
    function initFunc() {
        document.oncontextmenu = function (e) {
            return false; //阻止浏览器的右击菜单
        };
        $("body").on("contextmenu",'.opblock-summary-path', function(){
            var text= $(this).attr('data-path');
            copy(text);
            alert('复制url成功');
        })
        $("body").on("contextmenu",'.opblock-summary-description', function(){
            var text= $(this).html();
            copy(text);
            alert('复制描述成功');
        })
    }
 
    var copy = function (str) {
 
        var div = document.createElement("div");
 
        div.innerHTML = '<span>' + str + '</span>';
 
        document.body.appendChild(div);
 
        var range = document.createRange();
 
        var selection = window.getSelection();
 
        selection.removeAllRanges();
 
        range.selectNodeContents(div);
 
        selection.addRange(range);
 
        document.execCommand('copy');
 
        selection.removeAllRanges();
 
        document.body.removeChild(div);
 
    };
 
 
 
 
})();