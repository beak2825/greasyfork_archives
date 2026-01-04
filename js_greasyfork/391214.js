// ==UserScript==
// @name         spys.one proxy parser
// @namespace    iquaridys:hideme-parser-proxy
// @version      1.0.2
// @description  Parse proxy data from spys.one page with free porxy checker
// @author       iquaridys
// @match        https://spys.one/*
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/391214/spysone%20proxy%20parser.user.js
// @updateURL https://update.greasyfork.org/scripts/391214/spysone%20proxy%20parser.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Register menu command
    GM_registerMenuCommand('Parse Proxies', function () {
        let resultText = '';
        const elements = document.querySelectorAll('.spy14');

        // Parse elements with proxy info
        elements.forEach((element) => {
            if (element.innerText.includes(':')) {
                resultText += element.innerText + '\n';
            }
        });

        if (resultText) {
            // Open a new window and display the results
            const newWindow = window.open();
            newWindow.document.write(`
                <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 0;
                            background-color: #f4f4f4;
                            display: flex;
                            height: 100vh;
                        }
                        .container {
                            display: flex;
                            width: 100%;
                        }
                        .sidebar {
                            width: 30%;
                            background-color: #fff;
                            padding: 20px;
                            box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
                            overflow-y: auto;
                            height: 100%;
                        }
                        .content {
                            width: 70%;
                            padding: 20px;
                        }
                        iframe {
                            border: none;
                            width: 100%;
                            height: 100%;
                        }
                        pre {
                            white-space: pre-wrap;
                            word-wrap: break-word;
                            font-size: 12px;
                            color: #333;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="sidebar">
                            <pre>${resultText}</pre>
                        </div>
                        <div class="content">
                            <iframe src="https://proxychecker.infatica.io/"></iframe>
                        </div>
                    </div>
                </body>
                </html>
            `);
            newWindow.document.close();
        } else {
            alert('No proxies found on the page!');
        }
    });
})();
