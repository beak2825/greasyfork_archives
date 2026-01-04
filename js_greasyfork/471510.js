// ==UserScript==
// @name         m3u8格式播放
// @namespace    http://tampermonkey.net/
// @version      0.0.7
// @description  用于播放m3u8视频
// @license      MIT
// @author       bgcode
// @match        http://lzizy.net/*
// @match        http://ffzy5.tv/*
// @icon         data:image/png;base64,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
// @require      https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/471510/m3u8%E6%A0%BC%E5%BC%8F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/471510/m3u8%E6%A0%BC%E5%BC%8F%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Your code here...
  $("html").append('<div class="bgcode" onclick="bgcode()"><svg t="1689829718315" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1659" width="40px" height="40px"><path d="M901.12 0H122.88C53.248 0 0 53.248 0 122.88v778.24c0 65.536 53.248 122.88 122.88 122.88h778.24c69.632 0 122.88-57.344 122.88-122.88V122.88c0-69.632-53.248-122.88-122.88-122.88z m81.92 901.12c0 45.056-36.864 81.92-81.92 81.92H122.88c-45.056 0-81.92-36.864-81.92-81.92V122.88c0-45.056 36.864-81.92 81.92-81.92h778.24c45.056 0 81.92 36.864 81.92 81.92v778.24z" fill="#1296db" p-id="1660"></path><path d="M741.376 471.04l-159.744-90.112-159.744-90.112c-4.096-4.096-8.192-8.192-16.384-8.192-20.48 0-36.864 16.384-36.864 40.96v368.64c0 20.48 16.384 36.864 36.864 36.864 8.192 0 12.288 0 20.48-4.096l159.744-90.112 159.744-90.112c20.48-20.48 20.48-57.344-4.096-73.728z m-180.224 122.88L409.6 684.032V327.68l151.552 90.112 151.552 90.112-151.552 86.016z" fill="#1296db" p-id="1661"></path><path d="M839.68 839.68m-61.44 0a61.44 61.44 0 1 0 122.88 0 61.44 61.44 0 1 0-122.88 0Z" fill="#1296db" p-id="1662"></path></svg></div>');
  $("html>head").append(`<style>
        .bgcode {
            color: rgb(238, 192, 26);
            background-color: write;
            width: 40px;
            height: 40px;
            float: right;
            border-radius: 6px;
            text-decoration: none;
            border: none;
            mragin:0px;
            position:fixed;
            right:20px;
            top:100px;
            z-index:1;
        }

        .bgcode:hover {
            background-color: #18c7df;
            /* Green */
            color: white;
        }

        .bgcode:active {
           // background-color: #3e8e41;
            transform: translateY(2px);
        }
    </style>`);


   $("head").append(`<script src="https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js"></script><script src="https://cdn.jsdelivr.net/npm/artplayer/dist/artplayer.js"></script>
<script src="https://cdn.jsdelivr.net/npm/hls.js@1.2.7/dist/hls.min.js"></script>`)
$("head").append(`<script src="https://cdn.jsdelivr.net/gh/Codebglh/YHscript@1.2.9/lz/YH.js"></script> <link href="https://cdn.jsdelivr.net/gh/Codebglh/YHscript@1.2.9/lz/YH.css" rel="stylesheet" type="text/css">`)


})();
