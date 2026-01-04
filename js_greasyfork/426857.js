// ==UserScript==
// @name         notion悬浮大纲
// @namespace    https://www.notion.so/
// @version      0.1.2
// @description  在notion页面的右侧，悬浮当前page的大纲（table of contents）
// @author       jueserencai
// @match        https://www.notion.so/*
// @icon         https://www.google.com/s2/favicons?domain=segmentfault.com
// @grant        none
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/slideout/1.0.1/slideout.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/426857/notion%E6%82%AC%E6%B5%AE%E5%A4%A7%E7%BA%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/426857/notion%E6%82%AC%E6%B5%AE%E5%A4%A7%E7%BA%B2.meta.js
// ==/UserScript==


(function () {
    'use strict';

    // Your code here...
    window.addEventListener('load', function () {


        $("head").prepend(`
        <style>
        body {
            width: 100%;
            height: 100%;
        }

        .slideout-menu {
            float: right;
            position: fixed;
            // left: 0;
            top: 20px;
            // bottom: 0;
            right: 10px;
            z-index: 101;
            width: 256px;
            overflow-y: scroll;
            -webkit-overflow-scrolling: touch;
            display: none;
        }

        .slideout-panel {
            float: right;
            position: relative;
            top: 10px;
            right: 20px;
            z-index: 101;
            will-change: transform;
        }

        .slideout-open,
        .slideout-open body,
        .slideout-open .slideout-panel {
            overflow: hidden;
        }

        .slideout-open .slideout-menu {
            display: block;
        }
        </style>
        `)

        $("body").prepend(`
        <nav id="menu">
        <h2></h2>
        </nav>

        <main id="panel">
        <header>
            <button class="toggle-button">☰</button>
        </header>
        </main>
        `)

        var height = $(`#notion-app > div > div.notion-cursor-listener > div.notion-frame > div:nth-child(1)`).height();
        $('#menu').css("top", height + 20);
        $('#panel').css("top", height + 20);
        $('#panel').css("position", "fixed");
        $('#menu').css("height", "100%");

        var slideout = new Slideout({
            'panel': document.getElementById('panel'),
            'menu': document.getElementById('menu'),
            'padding': 256,
            'tolerance': 70,
            'side': 'right'
        });

        // Toggle button
        $('.toggle-button').on('click', function () {
            slideout.toggle();
            updateOutline();
        });


        function updateOutline() {
            var outline = $(".notion-table_of_contents-block");
            $("#menu").html(outline.html());
        }

        $(".notion-table_of_contents-block").change(function () {
            updateOutline();
        });


    }, false);
})();