// ==UserScript==
// @name         BU2FS WebSDR 畫面調整
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  把 BU2FS 提供的 WebSDR 畫面自動調整成習慣的樣子
// @author       DoReMi
// @match        http://miaoski.idv.tw:8901/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=idv.tw
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503873/BU2FS%20WebSDR%20%E7%95%AB%E9%9D%A2%E8%AA%BF%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/503873/BU2FS%20WebSDR%20%E7%95%AB%E9%9D%A2%E8%AA%BF%E6%95%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 儲存原生的 open 方法
    var open = XMLHttpRequest.prototype.open;

    // 覆蓋 open 方法
    XMLHttpRequest.prototype.open = function() {
        this.addEventListener('load', function() {
            // 在這裡添加你的代碼來處理 Ajax 請求完成後的操作
            var button = document.querySelector('#html5choice > input[type=button]');
            if (button) {
                button.click();
            }
        }, false);

        // 調用原生的 open 方法
        open.apply(this, arguments);
    };

    window.addEventListener('load', function() {
        var checkbox = document.querySelector('form[name=viewform] > div:nth-child(2) > input[type=checkbox]');
        if (checkbox) {
            checkbox.checked = true;
        }

        var squelchCheckbox = document.querySelector('#squelchcheckbox');
        if (squelchCheckbox) {
            squelchCheckbox.checked = true;
        }

        var autonotchCheckbox = document.querySelector('#autonotchcheckbox');
        if (autonotchCheckbox) {
            autonotchCheckbox.checked = true;
        }

        // 延遲三秒後執行
        setTimeout(function() {
            var wfsizeSelect = document.querySelector('#wfsize');
            if (wfsizeSelect) {
                // 創建新的選項
                var newOption = document.createElement('option');
                newOption.value = '570';
                newOption.text = 'huge';
                wfsizeSelect.appendChild(newOption);

                // 選擇新的選項
                wfsizeSelect.value = '570';
                wfsizeSelect.dispatchEvent(new Event('change'));
            }

            var wfmodeSelect = document.querySelector('#wfmode');
            if (wfmodeSelect) {
                // 選擇新的選項
                wfmodeSelect.value = '3';
                wfmodeSelect.dispatchEvent(new Event('change'));
            }

            window.scrollTo(0, 520); // 捲動到垂直位置 500 像素
        }, 1000);
    });
})();
