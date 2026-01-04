// ==UserScript==
// @name         notion靠右悬浮目录
// @version      0.1.2
// @namespace    https://www.notion.so/
// @description  将notion页面中的第一个目录模块放在右侧并且可以隐藏，未隐藏时鼠标放在该区域可以滑动目录
// @match        https://www.notion.so/*
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494578/notion%E9%9D%A0%E5%8F%B3%E6%82%AC%E6%B5%AE%E7%9B%AE%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/494578/notion%E9%9D%A0%E5%8F%B3%E6%82%AC%E6%B5%AE%E7%9B%AE%E5%BD%95.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    function addRightTOC(){
        $("head").prepend(`
        <style>
        #panel {
            float: right;
            position: fixed;
            top: 45px;
            right: 20px;
            z-index: 101;
            will-change: transform;
        }

        </style>
        `)
        $("head").prepend(`
        <style id="toc-style">
        .notion-table_of_contents-block {
            float: right;
            position: fixed !important;
            //height: 800px!important;
            // left: 0;
            top: 45px !important;
            // bottom: 0;
            right: 10px !important;
            z-index: 101 !important;
            width: 256px !important;
            overflow-y: scroll !important;
            -webkit-overflow-scrolling: touch !important;
            display:none;
        }
        </style>
        `)

        $("body").prepend(`

        <main id="panel">
        <header>
            <button class="toggle-button">☰</button>
        </header>
        </main>
        `);
        function get_html_toc_style(str, is_show) {
            let lines = str.split('\n');
            if (lines.length < 2) {
                return str;
            }
            let secondLastLineIndex = lines.length - 2;
            if (is_show){
                lines[secondLastLineIndex] = "            display:block;";
            }else{
                lines[secondLastLineIndex] = "            display:none;";
            }
            // 将修改后的行重新组合成字符串
            let modifiedStr = lines.join('\n');

            return modifiedStr;
        }

        // Toggle button
        $('.toggle-button').on('click', function () {
            //updateOutline();
            if (toc_open){
                toc_open = false;
                $('#panel').css("right", "20px");
                $("#toc-style").html(get_html_toc_style($("#toc-style").html(),false));
                //$(".notion-table_of_contents-block").css("display", "none");
            }else{
                toc_open = true;
                $('#panel').css("right", "276px");
                $("#toc-style").html(get_html_toc_style($("#toc-style").html(),true));
                //$(".notion-table_of_contents-block").css("display", "block");
                //console.log($("#notion-app > div > div:nth-child(1) > div > div:nth-child(4) > main").height()-45);
                $(".notion-table_of_contents-block").height($("#notion-app").height()-45);
            }
        });
    }
    let toc_open = false;

    window.addEventListener('load', function () {
        console.log(history);
        //let max_search_ms = 10000
        let timer_id = setInterval(function () {
            if ($(".notion-table_of_contents-block").length > 0) {
                //$(".notion-table_of_contents-block").hide();
                addRightTOC();
                clearInterval(timer_id);
            } else {
                //max_search_ms = max_search_ms-500
                //if (max_search_ms<500){
                //    clearInterval(timer_id);
                //}
            }
        }, 100);


    }, false);
})();