// ==UserScript==
// @name          Ex自適應全寬
// @namespace     https://greasyfork.org/scripts/516145
// @version       2024.11.17
// @description   全寬度E绅士 全寬度 E-Hentai 和 Exhentai
// @icon          https://e-hentai.org/favicon.ico
// @match         http://e-hentai.org/*
// @match         http://exhentai.org/*
// @exclude       http://e-hentai.org/s/*
// @exclude       http://exhentai.org/s/*
// @match         https://e-hentai.org/*
// @match         https://exhentai.org/*
// @exclude       https://e-hentai.org/s/*
// @exclude       https://exhentai.org/s/*
// @run-at        document-end
// @grant         none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/518226/Ex%E8%87%AA%E9%81%A9%E6%87%89%E5%85%A8%E5%AF%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/518226/Ex%E8%87%AA%E9%81%A9%E6%87%89%E5%85%A8%E5%AF%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function $(id) { return document.getElementById(id); }

    function c(className) { return document.getElementsByClassName(className); }

    // 保存初始表格行状态
    let initialTableRows = null;

    // 根据页面宽度动态调整列数
    function adjustColumns() {
        const width = window.innerWidth;
        const columnWidthS = 270; // 每列的寬度 250-400
        const columnWidthG = 240; // 每列的寬度
        const marginAdjustmentS = 10; // 邊距調整值
        const marginAdjustmentG = 30; // 邊距調整值
        let columnsS = Math.floor((width - marginAdjustmentS) / columnWidthS); // 減去邊距，並計算列數
        let columnsG = Math.floor((width - marginAdjustmentG) / columnWidthG); // 減去邊距，並計算列數
        // 確保最小列數
        columnsS = Math.max(columnsS, 3);
        columnsG = Math.max(columnsG, 3);

        // 計算實際的寬度
        const clientWidthS = columnsS * columnWidthS;
        const clientWidthG = 700 + (columnsG - 3) * columnWidthG;

        // 設置最大寬度和列數
        if (window.location.pathname.indexOf("/g/") != 0 && c("itg gld").length != 0) { // 非畫廊頁面 且 縮圖模式
            c("ido")[0].style.maxWidth = `${clientWidthS}px`; // 設置最大寬度
            c("itg gld")[0].style = `grid-template-columns: repeat(${columnsS}, 1fr); Width:100%`; // 設置列數和邊距
            const searchbox = $("searchbox"); //搜索框
            if (searchbox) {
                const tbody = searchbox.querySelector('tbody'); // 查找 tbody
                if (tbody) {
                    // 保存初始表格状态
                    if (!initialTableRows) {
                        initialTableRows = tbody.innerHTML; // 保存原始 HTML
                    }
                    if (columnsS >= 6) {
                        // 合併表格行
                        const rows = tbody.querySelectorAll('tr');
                        if (rows.length >= 2) {
                            const firstRow = rows[0];
                            const secondRow = rows[1];
                            Array.from(secondRow.children).forEach(td => {
                                firstRow.appendChild(td);
                            });
                            secondRow.remove();
                        }
                    } else {
                        // 恢復為初始狀態
                        tbody.innerHTML = initialTableRows;
                    }
                }
                if (columnsS >= 6) {
                    c("idi")[0].style.width = `${720 + 670}px`;
                    c("idi")[1].style.width = `${720 + 670}px`;
                    $("f_search").style.width = `${560 + 670}px`;
                } else {
                    c("idi")[0].style.width = "720px";
                    c("idi")[1].style.width = "720px";
                    $("f_search").style.width = "560px";
                }
            }
        } else if (window.location.pathname.indexOf("/g/") == 0) { // /g/ 畫廊頁面
            if (columnsG >= 6) {
                c("gm")[0].style.maxWidth = `${clientWidthG + 20}px`; // 設置最详情大寬度
                c("gm")[1].style.maxWidth = `${clientWidthG + 20}px`; // 設置最評論區大寬度
                $("gd2").style.width = `${clientWidthG - 255}px`; // 設置標題欄寬度
                $("gmid").style.width = `${clientWidthG - 250}px`; // 設置標籤欄寬度
                $("gd4").style.width = `${clientWidthG - 600}px`; // 設置標籤欄寬度
            } else {
                c("gm")[0].style.maxWidth = ""; // 設置最详情大寬度
                c("gm")[1].style.maxWidth = ""; // 設置最評論區大寬度
                $("gd2").style.width = ""; // 設置標題欄寬度
                $("gmid").style.width = ""; // 設置標籤欄寬度
                $("gd4").style.width = ""; // 設置標籤欄寬度
            }
            if (columnsG >= 6 && $("gdo")) { //防止不存在"gdo"時報錯
                $("gdo").style.maxWidth = `${clientWidthG + 20}px`; // 設置縮圖設置欄最大寬度
            } else if ($("gdo")) {
                $("gdo").style.maxWidth = ""; // 設置縮圖設置欄最大寬度
            }
            if (c("gdtl").length != 0) { // large thumbs hathperk
                $("gdt").style.maxWidth = `${clientWidthG}px`; // 設置最大寬度
                const im = c("gdtl");
                for (let i = 0; i < im.length; i++) {
                    im[i].style.width = "234px";
                }
            } else {
                $("gdt").style.maxWidth = `${clientWidthG}px`; // 設置最大寬度
            }
        }
    }

    // 初始化和窗口大小变化时调整列数
    adjustColumns();
    window.addEventListener('resize', adjustColumns);

})();
