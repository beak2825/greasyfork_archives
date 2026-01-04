// ==UserScript==
// @name         删种辅助脚本
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  辅助脚本，仅限于辅助取消勾选全xx集，应该仔细复核
// @author       JDWLL123
// @match        https://pterclub.com/torrents.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491679/%E5%88%A0%E7%A7%8D%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/491679/%E5%88%A0%E7%A7%8D%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function cancelCheckboxes() {
        const table = document.getElementById('torrenttable');
        let found = false;
        const trElements = Array.from(table.getElementsByTagName('tr'))

        trElements.forEach(function (tr) {
            var textContent = tr.textContent;
            var match_1 = textContent.match(/全(\d+)集/);
            var match_2 = textContent.match(/全(\d+)期/);
            if (match_1 || match_2) {
                let numberOfEpisodes = NaN;
                if(match_1) numberOfEpisodes = parseInt(match_1[1]);
                if(match_2) numberOfEpisodes = parseInt(match_2[1]);
                if (!isNaN(numberOfEpisodes)) {
                    var checkbox = tr.querySelector('input[type="checkbox"][name="delid[]"]');
                    if (checkbox) {
                        console.log(1)
                        checkbox.checked = false;
                        if (!found) {
                            const link = document.querySelector('a[title*="PTerWEB"]');
                            let href = link.getAttribute('href');
                            let regex = /details\.php\?id=(\d+)/;
                            let match2 = href.match(regex);
                            if (match2) {
                                found = true;
                                const inputElement = document.querySelector('input[name="related_torrent_url"]');
                                inputElement.value = "https://pterclub.com/details.php?id=" + match2[1];
                                const inputElement2 = document.querySelector('textarea[name="reason_input"]');
                                inputElement2.value = "根据资源合集规则，予以删除，感谢您的贡献！";
                                const packageRadio = document.getElementById('r-package');
                                packageRadio.checked = true;
                            }
                        }
                    }
                }
            }
        });
    }

    function addButton() {
        var button = document.createElement('button');
        button.textContent = '取消勾选全集';
        button.style.position = 'fixed';
        button.style.top = '10px';
        button.style.left = '10px';
        button.style.zIndex = '9999';
        button.addEventListener('click', function () {
            cancelCheckboxes();
        });

        // 将按钮添加到页面上
        var targetElement = document.querySelector('body');
        targetElement.appendChild(button);
    }

    window.addEventListener('load', addButton);
})();

