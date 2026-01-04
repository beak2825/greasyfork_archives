// ==UserScript==
// @name         Bitcointalk Mobile
// @namespace    https://bitcointalk.org
// @version      1.1
// @description  Improves readability on bitcointalk.org for mobile
// @author       Royal Cap
// @match        https://bitcointalk.org/*
// @grant        GM_addStyle
// @run-at 	 document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/546752/Bitcointalk%20Mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/546752/Bitcointalk%20Mobile.meta.js
// ==/UserScript==

(function () {
        'use strict';

        GM_addStyle(` html, body {
                width: 100% !important;
                max-width: 100vw !important;
                overflow-x: hidden !important;
                margin: 0 !important;
                padding: 5px !important;
            }

            @media screen and (max-width: 768px) {
                head {
                    display: contents;
                }

                head::before {
                    content: '<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">';
                }
            }

            body, p, div, span, a {
                font-size: 108% !important;
                line-height: 1.2 !important;
            }

            a:link, a:visited {
                text-decoration: underline !important;
            }

            a:hover {
                text-decoration: none !important;
            }


            .post h4, .post h5 {
                font-size: 22px !important;
                font-weight: bold !important;
            }

            .smalltext, .quote, .code {
                font-size: 25px !important;
            }

            .quote, .code {
                border: 1px solid #ccc !important;
                padding: 5px !important;
            }

            table {
                width: 100% !important;
                max-width: 100% !important;
                box-sizing: border-box !important;
            }

            td {
                word-wrap: break-word !important;
                max-width: 100% !important;
            }

            img {
                max-width: 100% !important;
                height: auto !important;
            }

            .nav, #header, #footer {
                font-size: 20px !important;
                width: 100% !important;
            }

            input, textarea, select {
                border: 1px solid #aaa !important;
                padding-right: 35px !important;
            }

            textarea {
                font-size: 100%;
                font-family: verdana, sans-serif;
                width: 60% !important;
            }

            .reply_button, .windowbg {
                vertical-align: middle;
                width: 10%;
            }

            .nav, .nav:link, .nav:visited {
                color: #000000;
                text-decoration: none;
                font-size: 115% !important;
            }


            span.prevnext a:link {
                font-size: 500% !important;
            }

            a:link {
                font-size: 22px !important;
            }


            .post {
                font-size: 27px !important;
            }





            `);
    })();