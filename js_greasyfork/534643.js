// ==UserScript==
// @name         Phigros谱面信息提取
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  提取Phigros谱面信息并导出为JSON
// @author       FrandreJoestar
// @match        https://mzh.moegirl.org.cn/Phigros/%E8%B0%B1%E9%9D%A2%E4%BF%A1%E6%81%AF
// @icon         https://img.moegirl.org.cn/common/a/ab/Phigros_Icon_3.0.0.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534643/Phigros%E8%B0%B1%E9%9D%A2%E4%BF%A1%E6%81%AF%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/534643/Phigros%E8%B0%B1%E9%9D%A2%E4%BF%A1%E6%81%AF%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮
    const btn = document.createElement('button');
    btn.innerHTML = '导出谱面信息';
    btn.style.position = 'fixed';
    btn.style.top = '20px';
    btn.style.right = '20px';
    btn.style.zIndex = 9999;
    btn.style.padding = '12px 20px';
    btn.style.backgroundColor = '#673AB7';
    btn.style.color = 'white';
    btn.style.border = 'none';
    btn.style.borderRadius = '8px';
    btn.style.cursor = 'pointer';
    btn.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    btn.style.fontSize = '16px';
    document.body.appendChild(btn);

    // 提取歌曲基础信息
    const infoExtractor = (table, label) => {
        const rows = table.querySelectorAll('tr');
        for (const row of rows) {
            const cells = Array.from(row.children);
            for (let i = 0; i < cells.length; i++) {
                const cell = cells[i];
                if (cell.textContent.trim() === label) {
                    let valueIndex = i + 1;
                    while (cells[valueIndex]?.hasAttribute('colspan')) {
                        const colspan = parseInt(cells[valueIndex].getAttribute('colspan'), 10) || 1;
                        valueIndex += colspan;
                    }
                    return cells[valueIndex]?.textContent.trim() || null;
                }
            }
        }
        return null;
    };

    // 提取歌曲基础信息
    const mtExtractor = (table, label) => {
        const rows = table.querySelectorAll('tr');
        for (const row of rows) {
            const cells = Array.from(row.children);
            for (let i = 0; i < cells.length; i++) {
                const cell = cells[i];
                if (cell.textContent.trim() === label) {
                    let valueIndex = i + 1;
                    while (cells[valueIndex]?.hasAttribute('colspan')) {
                        const colspan = parseInt(cells[valueIndex].getAttribute('colspan'), 10) || 1;
                        valueIndex += colspan;
                    }
                    return cells[valueIndex-2]?.textContent.trim() || null;
                }
            }
        }
        return null;
    };

    // 多标签提取器(bpm 和 时长)
    const multiLabelExtractor = (table, labels) => {
        for (const label of labels) {
            const value = mtExtractor(table, label);
            if (value) return value;
        }
        return null;
    };

    // 多标签提取器（信息）
    const multiLabelExtractor1 = (table, labels) => {
        for (const label of labels) {
            const value = infoExtractor(table, label);
            if (value) return value;
        }
        return null;
    };

    btn.addEventListener('click', () => {
        const result = Array.from(document.querySelectorAll('table.wikitable')).map(table => {
            const song = {
                name: table.querySelector('th').textContent.trim().replace(/\n/g, ''),
                duration: 0,
                bpm: parseInt(multiLabelExtractor(table, ['BPM'])?.replace(/\D/g, '') || 0),
                composer: multiLabelExtractor1(table, ['曲师', '作曲家']) || '未知',
                illustrator: multiLabelExtractor1(table, ['画师', '插图']) || '未知',
                difficulties: {}
            };

            // 处理时长信息
            const durationText = multiLabelExtractor(table, ['时长', '长度']);
            if (durationText) {
                const cleanTime = durationText.replace(/[^0-9:]/g, '');
                song.duration = cleanTime.split(':').reduce((acc, time) => (acc * 60) + parseInt(time || 0, 10), 0);
            }

            // 提取难度信息
            const diffHeader = Array.from(table.querySelectorAll('th')).find(th => th.textContent.includes('难度'));
            if (diffHeader) {
                let currentRow = diffHeader.closest('tr').nextElementSibling;
                while (currentRow && currentRow.querySelector('td')) {
                    const cells = currentRow.querySelectorAll('td');
                    if (cells.length >= 5) {
                        const diffName = cells[0].querySelector('b')?.textContent.trim();
                        if (diffName) {
                            song.difficulties[diffName] = {
                                level: parseInt(cells[1].textContent, 10) || 0,
                                constant: parseFloat(cells[2].textContent) || 0.0,
                                notes: parseInt(cells[3].textContent, 10) || 0,
                                mapper: cells[4].textContent.trim().replace(/\s+/g, ' ')
                            };
                        }
                    }
                    currentRow = currentRow.nextElementSibling;
                }
            }

            return song;
        });

        // 生成下载文件（保持不变）
        const timestamp = new Date().toISOString().slice(0, 19).replace(/[-T:]/g, '');
        const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `phigros_data_${timestamp}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    });
})();