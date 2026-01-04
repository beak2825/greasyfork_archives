// ==UserScript==
// @name               Sudoku backup (International)
// @namespace          https://bbs.tampermonkey.net.cn/
// @version            1.2.6
// @description:zh-CN  点击插件图标显示功能按钮：备份和恢复 sudoku.com 的进度数据到本地
// @description:en     Backup and restore progress data for sudoku.com.
// @author             addpd
// @match              https://sudoku.com/*
// @grant              GM_registerMenuCommand
// @grant              GM_unregisterMenuCommand
// @license            MIT
// @description 点击插件图标显示功能按钮：备份和恢复 sudoku.com 的进度数据 / Backup and restore progress data for sudoku.com.
// @downloadURL https://update.greasyfork.org/scripts/539852/Sudoku%20backup%20%28International%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539852/Sudoku%20backup%20%28International%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- Internationalization (i18n) ---
    const translations = {
        en: {
            backup: "Click to Backup",
            import: "Import Backup",
            noFileSelected: "No file selected.",
            jsonReadSuccess: "JSON file read successfully. See console for details.",
            jsonParseError: "Failed to parse JSON: ",
        },
        zh: {
            backup: "点击备份",
            import: "导入备份",
            noFileSelected: "未选择文件",
            jsonReadSuccess: "JSON文件读取成功，详情请查看控制台",
            jsonParseError: "JSON解析失败: ",
        }
    };

    // Detect page language using document.documentElement.lang
    // Default to English if the language is not Chinese ('zh')
    const lang = document.documentElement.lang.toLowerCase().startsWith('zh') ? 'zh' : 'en';
    const t = translations[lang];


    // --- Script Logic ---

    // Backup function
    const backup = () => {
        const data = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            data[key] = localStorage.getItem(key);
        }
        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        // Get current time for filename, format: YYYYMMDD_HHMMSS
        const now = new Date();
        const pad = n => n.toString().padStart(2, '0');
        const timestamp = now.getFullYear().toString() +
            pad(now.getMonth() + 1) +
            pad(now.getDate()) + '_' +
            pad(now.getHours()) +
            pad(now.getMinutes()) +
            pad(now.getSeconds());

        const a = document.createElement("a");
        a.href = url;
        a.download = `sudoku_backup_${timestamp}.json`; // Filename with timestamp
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // Read and restore function
    const read = (data) => {
        Object.keys(data).forEach(function (k) {
            localStorage.setItem(k, data[k]);
        });
        location.reload(); // Reload page to apply restored data
    };

    // --- Register Menu Commands ---

    // Backup command
    GM_registerMenuCommand(
        t.backup,
        function () {
            backup();
        },
        "1"
    );

    // Import command
    GM_registerMenuCommand(
        t.import,
        function () {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json,application/json';
            input.style.display = 'none'; // Hide the element

            input.onchange = e => {
                const file = e.target.files[0];
                if (!file) {
                    alert(t.noFileSelected);
                    return;
                }
                const reader = new FileReader();
                reader.onload = event => {
                    try {
                        const jsonData = JSON.parse(event.target.result);
                        console.log('JSON data from file:', jsonData);
                        alert(t.jsonReadSuccess);
                        // Add data to localStorage
                        read(jsonData);
                    } catch (err) {
                        alert(t.jsonParseError + err.message);
                    }
                };
                reader.readAsText(file);
            };

            document.body.appendChild(input);
            input.click();
            document.body.removeChild(input);
        },
        "2"
    );

})();
