// ==UserScript==
// @name         PDF查看器
// @description  Inserts an online PDF document on any webpage
// @author       JetBee
// @namespace    com.bee
// @version      1.2
// @license      MIT
// @icon         https://e.huawei.com/favicon.ico
// @match        *://e.huawei.com/cn/material/networking/*
// @match        *://e.huawei.com/cn/material/enterprise/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/463055/PDF%E6%9F%A5%E7%9C%8B%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/463055/PDF%E6%9F%A5%E7%9C%8B%E5%99%A8.meta.js
// ==/UserScript==

function main() {
    var url = window.location.href
    var lastSlashIndex = url.lastIndexOf('/');
    var id = url.substring(lastSlashIndex + 1);
    var pdfUrl = "https://e-file.huawei.com/en/material/MaterialDownload?id=" + id;
    var iframe = document.createElement('object');
    iframe.id = "insertPDF"

    iframe.setAttribute('data', ' https://vw.usdoc.cn/?w=5&src=' + pdfUrl);
    iframe.setAttribute('width', '100%');
    iframe.setAttribute('height', '1200px');
    iframe.setAttribute('frameborder', '0');
    var target = document.getElementsByClassName("self-cistern")[0]
    iframe.style.display = "none"
    target.appendChild(iframe);
}

function show1() {
    document.getElementById("insertPDF").style.display = "block"
    document.getElementsByClassName("online-container-wrap")[0].style.display = 'none'
}

function hide1() {
    document.getElementById("insertPDF").style.display = "none"
    document.getElementsByClassName("online-container-wrap")[0].style.display = 'block'
}

(function () {
    'use strict';

    // Add styles to the button element
    // Add styles to the button element
    // Add styles to the button element
    GM_addStyle(`
        #floatingButton {
            position: fixed;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            z-index: 9999;
            background: #007aff;
            color: white;
            padding: 10px 20px;
            border: none;
            cursor: pointer;
            border-radius: 50px;
            font-size: 16px;
            box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
            transition: all 0.3s ease;
        }
        
        #floatingButton:hover {
            background: #0055d4;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
        }
        
        #floatingButton:active {
            background: #0055d4;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            transform: translateY(-50%) scale(0.95);
        }
        
        #floatingButton:focus {
            outline: none;
        }
    `);
    var button = document.createElement("button");
    button.id = "floatingButton";
    button.innerHTML = "变身";
    button.style.style = ""
    button.addEventListener("click", function () {
        if (button.textContent == "变身") {
            button.textContent = "还原"
            show1()
        } else {
            button.textContent = "变身"
            hide1()
        }
    });
    document.body.appendChild(button);
    main();
})();