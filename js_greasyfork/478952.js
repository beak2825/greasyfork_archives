// ==UserScript==
// @name         cpprefrence.com 暗黑主题
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @description  cppreference.com 网页黑暗模式主题
// @author       You
// @match        *://*.cppreference.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cppreference.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478952/cpprefrencecom%20%E6%9A%97%E9%BB%91%E4%B8%BB%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/478952/cpprefrencecom%20%E6%9A%97%E9%BB%91%E4%B8%BB%E9%A2%98.meta.js
// ==/UserScript==

; (function () {
    'use strict'
    document.documentElement.hidden = true
    document.addEventListener("DOMContentLoaded", ready);
    function ready() {
        console.log('styleload');


        if (document.getElementById("mycomtomstyle")) return;
        var style = document.createElement('style')
        style.id = "mycomtomstyle";
        let backgroundcolor = '#232529'
        let fontColor = '#cccccc'
        style.innerHTML = `
       .mainpagetable tr.row td {
        background: ${backgroundcolor};
        border: none !important;
        }
          body{
              background: none repeat scroll 0 0 ${backgroundcolor};

          }#bodyContent{font: 15px/20px BlinkMacSystemFont,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;}
          div#cpp-content-base,.sitedir-ltr textarea,.t-navbar-menu > div,

            table.wikitable,  .sitedir-ltr input,div#cpp-footer-base ,table.ambox ,div.vectorTabs span,div.vectorMenu ul,div.vectorMenu h5 span {
              background: ${backgroundcolor};color: #fff;
          }
          div#cpp-head-second-base {
            background: ${backgroundcolor};
            }
            div#cpp-head-first-base {
            border-bottom: 1px solid #eee;
            background: ${backgroundcolor};
            }
            div#content {
                color: ${fontColor};
            }
            h1, h2, h3, h4, h5, h6 {
                color: ${fontColor};
            }a {
                color: #52935f;
            }a:visited {
                color: #607fb3;
            }
            .t-spar {
                color: #cfcfcf;
            }
            .cpp.source-cpp .kw4 {
                color: #8383ff;
            }.mw-geshi a {
                color: #669efc;
            }
            .cpp.source-cpp .de1, .cpp.source-cpp .de2 {
            font: normal normal 1em/1.2em monospace; margin:0; padding:0; background:none; vertical-align:top;
            color:#4dc9b0;
            }
            .cpp.source-cpp  {font-family:monospace;}
            .cpp.source-cpp .imp {font-weight: bold; color: red;}
            .cpp.source-cpp li, .cpp.source-cpp .li1 {font-weight: normal; vertical-align:top;}
            .cpp.source-cpp .ln {width:1px;text-align:right;margin:0;padding:0 2px;vertical-align:top;}
            .cpp.source-cpp .li2 {font-weight: bold; vertical-align:top;}
            .cpp.source-cpp .kw1 {color: #569cd6;}
            .cpp.source-cpp .kw2 {color: #569cd6;}
            .cpp.source-cpp .kw3 {color: #8484ff;}
            .cpp.source-cpp .kw4 {color: #3d90d6;}
            .cpp.source-cpp .co1 {color: #7181b6;}
            .cpp.source-cpp .co2 {color: #339900;}
            .cpp.source-cpp .coMULTI {color: #7181b6; font-style: italic;}
            .cpp.source-cpp .es0 {color: #008000; font-weight: bold;}
            .cpp.source-cpp .es1 {color: #008000; font-weight: bold;}
            .cpp.source-cpp .es2 {color: #008000; font-weight: bold;}
            .cpp.source-cpp .es3 {color: #008000; font-weight: bold;}
            .cpp.source-cpp .es4 {color: #008000; font-weight: bold;}
            .cpp.source-cpp .es5 {color: #008000; font-weight: bold;}
            .cpp.source-cpp .br0 {color: #ffd700;}
            .cpp.source-cpp .sy0 {color: #008000;}
            .cpp.source-cpp .sy1 {color: #d4d4d4;}
            .cpp.source-cpp .sy2 {color: #d4d4d4;}
            .cpp.source-cpp .sy3 {color: #d4d4d4;}
            .cpp.source-cpp .sy4 {color:#cccccc;}
            .cpp.source-cpp .st0 {color: #f1fa8c;}
            .cpp.source-cpp .nu0 {color: #b5cea8;}
            .cpp.source-cpp .nu6 {color: #6161ff;}
            .cpp.source-cpp .nu8 {color: #8080ff;}
            .cpp.source-cpp .nu12 {color: #a9a9ff;}
            .cpp.source-cpp .nu16 {color:#a2a2ff;}
            .cpp.source-cpp .nu17 {color:#7777ff;}
            .cpp.source-cpp .nu18 {color:#7f7fff;}
            .cpp.source-cpp .nu19 {color:#9595ff;}
            .cpp.source-cpp .me2 {color:#4dc9b0;}
            /*代码高亮*/
            pre {
                color: #8cdcfe;
            }

            pre,
            div.mw-geshi {
                background-color: #282a36;
                border: 1px solid #313131;

            }

            table {
                border-color: #2b2b2b;
            }

            .t-rev>td:nth-child(1),
            table.ambox,
            .t-rev>td:nth-child(2),
            .t-rev-inl {
                border: 1px solid #3c3c3c;
            }

            .t-c {
                border: none;
                background-color: #323545;
                padding: 0px 4px;
                margin: 2px;
                display: inline-block;

            }

            .mw-geshi.cpp.source-cpp {
                border: none;
                background-color: #323545;
                color: #868d9a !important;
                display: inline-block;
                border-radus: 2px;
            }

            .mw-geshi.cpp.source-cpp * {

                color: #868d9a !important;
            }

            .t-c * {
                color: #868d9a !important;
            }

            p,
            dd {
                line-height: 1.4em;
                margin: 10px 0;
            }

            ul {
                list-style-type: initial;
                list-style-image: none;
            }

            .t-sdsc-sep {
                border-top: 1px solid #504545;
                padding: 0;
            }

            table.wikitable>tr>th,
            table.wikitable>*>tr>th {
                background-color: #232529;
                text-align: center;
                color: #cccccc
            }

            table.wikitable>tr>th,
            table.wikitable>tr>td,
            table.wikitable>*>tr>th,
            table.wikitable>*>tr>td {
                border: 1px #5e5e5e solid;
                padding: 0.2em;
            }

            div.vectorTabs li.selected a,
            div.vectorTabs li.selected a:visited {
                color: #c0c0c0;
                text-decoration: none;
            }
                `
        document.body.appendChild(style);
        document.documentElement.hidden = false
    }

    // Your code here...
})()