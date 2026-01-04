// ==UserScript==
// @name         EH收藏导出/入
// @namespace    https://www.mohuangdiyu.com/
// @version      1.0
// @description  在e-hentai或exhentai中, 导出/入收藏
// @author       地狱 魔皇
// @match        *://e-hentai.org/*
// @match        *://exhentai.org/*
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      e-hentai.org
// @connect      exhentai.org
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540512/EH%E6%94%B6%E8%97%8F%E5%AF%BC%E5%87%BA%E5%85%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/540512/EH%E6%94%B6%E8%97%8F%E5%AF%BC%E5%87%BA%E5%85%A5.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const validSites = ['e-hentai.org', 'exhentai.org'];
    if (!validSites.some(site => location.hostname.includes(site))) {
        alert('此脚本仅支持 e-hentai 和 exhentai');
        return;
    }

    const styles = `
        .eh-mask {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.6);
            z-index: 9998;
        }
        .eh-popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #fff;
            color: #111;
            padding: 20px;
            z-index: 9999;
            border-radius: 10px;
            min-width: 300px;
            max-height: 80vh;
            overflow: auto;
            box-shadow: 0 0 15px rgba(0,0,0,0.6);
            font-family: sans-serif;
        }
        .eh-popup h3 {
            margin-top: 0;
            color: #222;
        }
        .eh-popup select, .eh-popup button, .eh-popup input, .eh-popup label {
            width: 100%;
            margin-top: 10px;
            font-size: 14px;
            color: #000;
            background-color: #fff;
        }
        .eh-popup button {
            background-color: #007bff;
            color: #fff;
            border: none;
            padding: 8px;
            border-radius: 4px;
            cursor: pointer;
        }
        .eh-popup button:hover {
            background-color: #0056b3;
        }
        .eh-status {
            margin-top: 15px;
            font-size: 13px;
            max-height: 200px;
            overflow-y: auto;
            white-space: pre-wrap;
            background: #f9f9f9;
            color: #000;
            padding: 10px;
            border-radius: 5px;
            border: 1px solid #ccc;
        }
    `;

    function injectStyles() {
        const styleTag = document.createElement('style');
        styleTag.textContent = styles;
        document.head.appendChild(styleTag);
    }

    function fetchFavoriteCategories(callback) {
        const base = location.origin;
        GM_xmlhttpRequest({
            method: 'GET',
            url: base + '/favorites.php',
            onload: function (res) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(res.responseText, 'text/html');
                const results = [
                    { name: 'All', id: 'all' }
                ];
                doc.querySelectorAll('div.fp').forEach(div => {
                    const onclick = div.getAttribute('onclick');
                    if (onclick && onclick.includes('favorites.php?favcat=')) {
                        const match = onclick.match(/favcat=(\d+)/);
                        const icon = div.querySelector('.i');
                        const name = icon ? icon.getAttribute('title') : null;
                        if (match && name) {
                            results.push({ id: match[1], name });
                        }
                    }
                });
                callback(results);
            },
            onerror: function () {
                alert('无法加载收藏夹列表');
            }
        });
    }

    function fetchAllPages(startUrl, callback, accumulated = []) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: startUrl,
            onload: function (res) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(res.responseText, 'text/html');

                const rows = doc.querySelectorAll('table.itg > tbody > tr');

                rows.forEach(tr => {
                    const a = tr.querySelector('td.gl3c.glname > a');
                    if (!a) return;

                    const url = a.href;
                    const title = a.querySelector('div.glink')?.textContent.trim() || '';
                    let note = a.querySelector('div.glfnote')?.textContent.trim() || '';
                    note = note.replace(/^Note:\s*/i, '');

                    // 查找以 posted_ 开头的 div
                    const postedDiv = tr.querySelector('div[id^="posted_"]');
                    const favName = postedDiv?.getAttribute('title') || '';

                    const imgElement = tr.querySelector('div.glthumb img');
                    const img_url = imgElement
                    ? (imgElement.getAttribute('data-src') || imgElement.getAttribute('src') || '').replace('s.exhentai.org', 'ehgt.org')
                    : '';

                    accumulated.push({
                        标题: title,
                        链接: url,
                        说明: note,
                        收藏夹: favName,
                        缩略图: img_url
                    });
                });

                const next = doc.querySelector('a#unext');
                if (next) {
                    fetchAllPages(next.href, callback, accumulated);
                } else {
                    callback(accumulated);
                }
            },
            onerror: function () {
                alert('无法加载收藏内容');
            }
        });
    }

    function fetchFavorites(favcat, callback) {
        const base = location.origin;
        const url = favcat === 'all' ? base + '/favorites.php?inline_set=dm_l' : `${base}/favorites.php?inline_set=dm_l&favcat=${favcat}`;
        fetchAllPages(url, callback);
    }

    function downloadExportedData(data, format) {
        if (format === 'json') {
            const json = data.map(item => ({ title: item['标题'], url: item['链接'], note: item['说明'], favname: item['收藏夹'], img_url: item['缩略图'] }));
            const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            triggerDownload(url, 'favorites.json');
        } else if (format === 'xlsx') {
            if (typeof XLSX === 'undefined') {
                alert('XLSX 库未加载');
                return;
            }
            const worksheet = XLSX.utils.json_to_sheet(data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, '收藏');
            const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([wbout], { type: 'application/octet-stream' });
            const url = URL.createObjectURL(blob);
            triggerDownload(url, 'favorites.xlsx');
        }
    }

    function triggerDownload(url, filename) {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    }

    function showExportPopup() {
        if (document.querySelector('.eh-mask')) return;

        fetchFavoriteCategories(favCats => {
            const mask = document.createElement('div');
            mask.className = 'eh-mask';

            const popup = document.createElement('div');
            popup.className = 'eh-popup';

            const title = document.createElement('h3');
            title.textContent = '导出收藏';

            const formatSelect = document.createElement('select');
            ['json', 'xlsx'].forEach(fmt => {
                const opt = document.createElement('option');
                opt.value = fmt;
                opt.textContent = `导出格式：${fmt}`;
                formatSelect.appendChild(opt);
            });

            const favSelect = document.createElement('select');
            favCats.forEach(cat => {
                const opt = document.createElement('option');
                opt.value = cat.id;
                opt.textContent = `收藏夹：${cat.name}`;
                favSelect.appendChild(opt);
            });

            const exportBtn = document.createElement('button');
            exportBtn.textContent = '导出';
            exportBtn.onclick = () => {
                const format = formatSelect.value;
                const favcat = favSelect.value;
                fetchFavorites(favcat, data => {
                    downloadExportedData(data, format);
                });
                closePopup();
            };

            popup.appendChild(title);
            popup.appendChild(formatSelect);
            popup.appendChild(favSelect);
            popup.appendChild(exportBtn);

            document.body.appendChild(mask);
            document.body.appendChild(popup);

            function closePopup() {
                mask.remove();
                popup.remove();
            }
            mask.addEventListener('click', closePopup);
        });
    }
    function parseGalleryInfo(url) {
        const match = url.match(/\/g\/(\d+)\/([a-z0-9]+)\//);
        return match ? { gid: match[1], token: match[2] } : null;
    }

    function importFavoritesFromData(data, favcat, skipDuplicate, statusBox) {
        const base = location.origin;
        let cancelImport = false;

        // 添加取消按钮
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '取消导入';
        cancelBtn.style.marginTop = '10px';
        cancelBtn.onclick = () => cancelImport = true;
        statusBox.parentElement.appendChild(cancelBtn);

        function extractGids(existingGids) {
            const gidSet = new Set();

            // 遍历existingGids数组
            for (let i = 0; i < existingGids.length; i++) {
                const url = existingGids[i]['链接'];
                const info = parseGalleryInfo(url);

                if (info && info.gid) {
                    gidSet.add(info.gid);
                }
            }

            return gidSet;
        }


        function doImport(existingGids) {
            let success = 0, fail = 0;

            const importOne = (item, index) => {
                if (cancelImport) {
                    statusBox.textContent += `\n🚫 导入已取消\n`;
                    return;
                }
                const info = parseGalleryInfo(item.url);
                if (!info) {
                    statusBox.textContent += `❌ 无效链接: ${item.url}\n`;
                    fail++;
                    return;
                }
                if (skipDuplicate && existingGids.has(info.gid)) {
                    statusBox.textContent += `⚠️ 已存在跳过: ${item.url}\n`;
                    return;
                }

                const formData = new URLSearchParams();
                formData.set('favcat', favcat);
                formData.set('favnote', item.note || '');
                formData.set('apply', 'Add to Favorites');
                formData.set('update', '1');

                GM_xmlhttpRequest({
                    method: 'POST',
                    url: `${base}/gallerypopups.php?gid=${info.gid}&t=${info.token}&act=addfav`,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    data: formData.toString(),
                    onload: () => {
                        if (cancelImport) return;
                        statusBox.textContent += `✅ 成功: ${item.url}\n`;
                        success++;
                    },
                    onerror: () => {
                        if (cancelImport) return;
                        statusBox.textContent += `❌ 失败: ${item.url}\n`;
                        fail++;
                    }
                });
            };

            for (let i = 0; i < data.length; i++) {
                if (cancelImport) break;
                importOne(data[i], i);
            }
        }

        if (skipDuplicate) {
            fetchAllPages(base + '/favorites.php', (existingGids) => {
                const gidSet = extractGids(existingGids);
                doImport(gidSet);
            });
        } else {
            doImport();
        }
    }


    function showImportPopup() {
        if (document.querySelector('.eh-mask')) return;

        fetchFavoriteCategories(favCats => {
            const mask = document.createElement('div');
            mask.className = 'eh-mask';

            const popup = document.createElement('div');
            popup.className = 'eh-popup';

            const title = document.createElement('h3');
            title.textContent = '导入收藏';

            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = '.json,.xlsx';

            const favSelect = document.createElement('select');

            favCats.forEach(cat => {
                if (cat.name === "All") return;
                const opt = document.createElement('option');
                opt.value = cat.id;
                opt.textContent = `收藏夹：${cat.name}`;
                favSelect.appendChild(opt);
            });

            const skipCheckbox = document.createElement('input');
            skipCheckbox.type = 'checkbox';
            skipCheckbox.id = 'skipDup';
            const skipLabel = document.createElement('label');
            skipLabel.textContent = '跳过已存在的收藏';
            skipLabel.htmlFor = 'skipDup';

            const importBtn = document.createElement('button');
            importBtn.textContent = '开始导入';

            const statusBox = document.createElement('div');
            statusBox.className = 'eh-status';
            statusBox.textContent = '等待导入...';

            const controlBox = document.createElement('div');

            const checkboxMap = []; // 用于收集所有复选框状态

            importBtn.onclick = () => {
                const file = fileInput.files[0];
                if (!file) return alert('请先选择文件');

                const reader = new FileReader();
                reader.onload = function () {
                    let data;
                    if (file.name.endsWith('.json')) {
                        try {
                            data = JSON.parse(reader.result);
                        } catch (e) {
                            return alert('JSON格式错误');
                        }
                    } else if (file.name.endsWith('.xlsx')) {
                        if (typeof XLSX === 'undefined') return alert('XLSX 库未加载');
                        const workbook = XLSX.read(reader.result, { type: 'binary' });
                        const sheet = workbook.Sheets[workbook.SheetNames[0]];
                        data = XLSX.utils.sheet_to_json(sheet);
                    }

                    if (!Array.isArray(data)) return alert('导入数据无效');

                    // 清空旧的状态
                    statusBox.textContent = '';
                    statusBox.style.display = 'flex';
                    statusBox.style.flexWrap = 'wrap';
                    statusBox.style.gap = '12px';
                    statusBox.style.height = '50vh';
                    statusBox.style.overflowY = 'auto';


                    controlBox.style.marginBottom = '10px';
                    controlBox.style.display = 'flex';
                    controlBox.style.justifyContent = 'space-between';
                    controlBox.style.alignItems = 'center';
                    const counter = document.createElement('span');
                    counter.textContent = `已勾选 0 / ${data.length}`;

                    const selectAllBtn = document.createElement('button');
                    selectAllBtn.textContent = '全选';
                    selectAllBtn.onclick = () => {
                        checkboxMap.forEach(checkbox => checkbox.checked = true);
                        updateCounter();
                    };

                    const invertBtn = document.createElement('button');
                    invertBtn.textContent = '反选';
                    invertBtn.onclick = () => {
                        checkboxMap.forEach(checkbox => checkbox.checked = !checkbox.checked);
                        updateCounter();
                    };

                    function updateCounter() {
                        const checked = checkboxMap.filter(cb => cb.checked).length;
                        counter.textContent = `已勾选 ${checked} / ${data.length}`;
                    }

                    const buttonGroup = document.createElement('div');
                    buttonGroup.appendChild(selectAllBtn);
                    buttonGroup.appendChild(invertBtn);

                    controlBox.appendChild(counter);
                    controlBox.appendChild(buttonGroup);

                    // 构建列表
                    data.forEach((item, index) => {
                        const label = document.createElement('label');
                        label.style.display = 'flex';
                        label.style.alignItems = 'center';
                        label.style.flex = '1 1 calc(33.333% - 12px)';
                        label.style.padding = '10px';
                        label.style.marginBottom = '10px';
                        label.style.border = '1px solid #ccc';
                        label.style.borderRadius = '6px';
                        label.style.background = '#f4f4f4';
                        label.style.boxSizing = 'border-box';
                        label.style.gap = '8px';

                        const checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';
                        checkbox.checked = true;
                        checkboxMap.push(checkbox);
                        checkbox.onclick = updateCounter;

                        const title = item.title || item.标题 || '无标题';
                        const note = item.note || item.说明 || '';
                        const url = item.url || item.链接 || '';
                        const favName = item.收藏夹 || item.favname;
                        const thumbUrl = item.img_url || item.缩略图

                        const img = document.createElement('img');
                        img.src = thumbUrl;
                        img.style.width = '60px';
                        img.style.height = 'auto';
                        img.style.flexShrink = '0';
                        img.style.borderRadius = '4px';
                        img.style.objectFit = 'cover';

                        const span = document.createElement('span');
                        span.textContent = title;
                        span.style.marginLeft = '8px';
                        span.title = `链接: ${url}\n说明: ${note}\n收藏夹: ${favName}`;

                        label.appendChild(checkbox);
                        label.appendChild(img)
                        label.appendChild(span);
                        statusBox.appendChild(label);
                    });

                    // 替换“开始导入”按钮行为
                    importBtn.textContent = '确认导入已勾选项';
                    importBtn.onclick = () => {
                        const selectedData = data.filter((_, i) => checkboxMap[i].checked);
                        if (selectedData.length === 0) return alert('请至少勾选一个收藏');
                        statusBox.textContent = `正在导入 ${selectedData.length} 个收藏...\n`;
                        importFavoritesFromData(selectedData, favSelect.value, skipCheckbox.checked, statusBox);
                    };
                };

                if (file.name.endsWith('.xlsx')) reader.readAsBinaryString(file);
                else reader.readAsText(file);
            };

            popup.appendChild(title);
            popup.appendChild(fileInput);
            popup.appendChild(favSelect);
            popup.appendChild(skipCheckbox);
            popup.appendChild(skipLabel);
            popup.appendChild(importBtn);
            popup.appendChild(statusBox);
            popup.appendChild(controlBox);

            document.body.appendChild(mask);
            document.body.appendChild(popup);

            function closePopup() {
                mask.remove();
                popup.remove();
            }
            mask.addEventListener('click', closePopup);
        });
    }

    function load() {
        GM_registerMenuCommand('📤 导出收藏', showExportPopup);
        GM_registerMenuCommand('📥 导入收藏', showImportPopup);

        // 自动加载 xlsx 库
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
        document.head.appendChild(script);
    }

    injectStyles();
    load();
})();