// ==UserScript==
// @name         Quicker-替换【我喜欢的】中子程序的打开的命令
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  【Quicker网站个人中心-我喜欢的】中的子程序打开命令不正确，点击后会报错，本脚本修复了此bug
// @author       HDG
// @match        https://getquicker.net/Member/MyFavor
// @icon         data:image/png;base64,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
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/502515/Quicker-%E6%9B%BF%E6%8D%A2%E3%80%90%E6%88%91%E5%96%9C%E6%AC%A2%E7%9A%84%E3%80%91%E4%B8%AD%E5%AD%90%E7%A8%8B%E5%BA%8F%E7%9A%84%E6%89%93%E5%BC%80%E7%9A%84%E5%91%BD%E4%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/502515/Quicker-%E6%9B%BF%E6%8D%A2%E3%80%90%E6%88%91%E5%96%9C%E6%AC%A2%E7%9A%84%E3%80%91%E4%B8%AD%E5%AD%90%E7%A8%8B%E5%BA%8F%E7%9A%84%E6%89%93%E5%BC%80%E7%9A%84%E5%91%BD%E4%BB%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const table = document.querySelector('.table-hover');
    const existingIds = new Set(); // 用于存储已处理的ID
    const observer = new MutationObserver(() => {
        // 获取表格
        if (!table) return;

        // 获取第一列的单元格
        const rows = table.querySelectorAll('tr');

        rows.forEach(row => {
            const firstCell = row.cells[0]; // 获取第一列单元格
            if (firstCell) {
                const cellContent = firstCell.textContent.trim();
                const iconElement = firstCell.querySelector('i[data-copy]');
                if (iconElement) {
                    const dataCopy = iconElement.getAttribute('data-copy');
                    if (dataCopy) {
                        const id = new URL(dataCopy).searchParams.get("id");

                        // 只处理新增的部分
                        if (!existingIds.has(id)) {
                            existingIds.add(id); // 将ID添加到已处理集合中

                            // 获取同一行第五列的元素（命令）
                            const fifthCell = row.cells[4]; // 获取第五列单元格
                            if (fifthCell) {
                                const anchorElement = fifthCell.querySelector('a');
                                if (anchorElement) {
                                    anchorElement.href = `quicker:previewsp:${id}`;
                                }
                            }
                        }
                    }
                }
            }
        });
    });

    // 配置观察选项
    observer.observe(table, {
        childList: true,
        subtree: true
    });
})();