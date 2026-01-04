// ==UserScript==
// @name         swagger复制【右键显示信息在下方】
// @namespace    https://tangtao.cn
// @version      1.0.1
// @description  添加切换按钮，点击即可改变
// @author       tangtao
// @match        */swagger-ui.html
// @match        */swagger/index.html
// @grant        GM_log
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_deleteValue
// @license      MIT License
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/445233/swagger%E5%A4%8D%E5%88%B6%E3%80%90%E5%8F%B3%E9%94%AE%E6%98%BE%E7%A4%BA%E4%BF%A1%E6%81%AF%E5%9C%A8%E4%B8%8B%E6%96%B9%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/445233/swagger%E5%A4%8D%E5%88%B6%E3%80%90%E5%8F%B3%E9%94%AE%E6%98%BE%E7%A4%BA%E4%BF%A1%E6%81%AF%E5%9C%A8%E4%B8%8B%E6%96%B9%E3%80%91.meta.js
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
        $("body").on("contextmenu",'.opblock-summary-control', function(){
            var path = $(this).find('.opblock-summary-path').attr('data-path');
            var description = $(this).find('.opblock-summary-description').html();
            var text = 'url：'+path+' 描述：'+description;
            // alert(text);
            // console.log(text);
            // copy(text);
            $(this).parent().parent().append('<div>'+text+'</div>');
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