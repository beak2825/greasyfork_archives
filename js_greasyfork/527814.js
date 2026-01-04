// ==UserScript==
// @name            喜马拉雅专辑下载器
// @version         1.3.1
// @description     登录后支持VIP音频下载，支持专辑批量下载，支持添加编号。（基于“黑客, uid:219866”代码）
// @author          Ming
// @match           *://www.ximalaya.com/*
// @grant           GM_xmlhttpRequest
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_addStyle
// @grant           GM_setClipboard
// @grant           GM_download
// @icon            https://www.ximalaya.com/favicon.ico
// @require         https://registry.npmmirror.com/crypto-js/4.1.1/files/crypto-js.js
// @license         MIT
// @namespace       https://greasyfork.org/users/1438860
// @downloadURL https://update.greasyfork.org/scripts/527814/%E5%96%9C%E9%A9%AC%E6%8B%89%E9%9B%85%E4%B8%93%E8%BE%91%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/527814/%E5%96%9C%E9%A9%AC%E6%8B%89%E9%9B%85%E4%B8%93%E8%BE%91%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function showAlert(message, type = 'info') {
        const alertDiv = document.createElement('div');
        alertDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            padding: 10px 20px;
            background: ${type === 'error' ? '#fff2f0' : '#f6ffed'};
            border: 1px solid ${type === 'error' ? '#ffccc7' : '#b7eb8f'};
            color: ${type === 'error' ? '#cf1322' : '#389e0d'};
            border-radius: 4px;
            z-index: 2147483647;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        `;
        alertDiv.textContent = message;
        document.body.appendChild(alertDiv);

        setTimeout(() => {
            alertDiv.style.transition = 'opacity 0.3s';
            alertDiv.style.opacity = '0';
            setTimeout(() => alertDiv.remove(), 300);
        }, 3000);
    }

    function initSetting() {
        var setting;
        if (!GM_getValue('priate_script_xmly_data')) {
            GM_setValue('priate_script_xmly_data', {
                left: 20,
                top: 100,
                manualMusicURL: null,
                quality: 1,
                showNumber: true,
                numberOffset: 1
            })
        }
        setting = GM_getValue('priate_script_xmly_data')
        if (!setting.quality) setting.quality = 1;
        setting.quality = 1; // Always high quality
        if (setting.showNumber === null) setting.showNumber = true;
        if (!setting.numberOffset) setting.numberOffset = 1;
        GM_setValue('priate_script_xmly_data', setting)
    }

    // 手动获取音频地址功能
    function manualGetMusicURL() {
        let windowID = getRandStr("1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM", 100)

        function getRandStr(chs, len) {
            let str = "";
            while (len--) {
                str += chs[parseInt(Math.random() * chs.length)];
            }
            return str;
        }
        (function() {
            let playOriginal = HTMLAudioElement.prototype.play;

            function play() {
                let link = this.src;
                window.top.postMessage(Array("audioVideoCapturer", link, windowID, "link"), "*");
                return playOriginal.call(this);
            }
            HTMLAudioElement.prototype.play = play;
            HTMLAudioElement.prototype.play.toString = HTMLAudioElement.prototype.play.toString.bind(playOriginal);
        })();
        if (window.top == window) {
            window.addEventListener("message", function(event) {
                if (event.data[0] == "audioVideoCapturer") {
                    var setting = GM_getValue('priate_script_xmly_data')
                    setting.manualMusicURL = event.data[1]
                    GM_setValue('priate_script_xmly_data', setting)
                }
            });
        }
    }

    manualGetMusicURL()

    function injectDiv() {
        try {
            // Check if div already exists
            if (document.getElementById('priate_script_div')) {
                return;
            }

            var priate_script_div = document.createElement("div");
            priate_script_div.innerHTML = `
                <div id="priate_script_div">
                    <b style='font-size:24px; font-weight:300; margin: 5px 10px'>喜马拉雅下载器</b>
                    <p id='priate_script_setting' style='margin: 0 0'>
                        音质: <a href="#" id="qualityBtn">标准</a> |
                        编号: <a href="#" id="numberToggleBtn">关闭</a>
                        <span id="numberOffsetSpan" style="display:none">
                            (<a href="#" id="numberOffsetBtn">0</a>)
                        </span>
                    </p>
                    <button id="loadBtn">加载</button>
                    <button id="downloadBtn" style="display:none">下载</button>
                    <button id="exportBtn" style="display:none">导出</button>
                    <button id="cancelBtn" style="display:none">取消</button>
                    <table id="musicTable" style="display:none">
                        <thead>
                            <tr>
                                <th><a href="#" id="selectAllBtn" style='color:#337ab7'>全选</a></th>
                                <th>标题</th>
                                <th>操作</th>
                            </tr>
                        </thead>
                        <tbody id="musicTableBody"></tbody>
                    </table>
                </div>
            `;
            document.body.appendChild(priate_script_div);

            // Set initial position
            const setting = GM_getValue('priate_script_xmly_data');
            const div = document.getElementById('priate_script_div');
            if (div) {
                div.style.left = (setting.left || 20) + "px";
                div.style.top = (setting.top || 100) + "px";
            }
        } catch (error) {
            console.error('Failed to inject div:', error);
        }
    }

    function dragFunc(id) {
        var Drag = document.getElementById(id);
        var setting = GM_getValue('priate_script_xmly_data')
        Drag.onmousedown = function(event) {
            var ev = event || window.event;
            event.stopPropagation();
            var disX = ev.clientX - Drag.offsetLeft;
            var disY = ev.clientY - Drag.offsetTop;
            document.onmousemove = function(event) {
                var ev = event || window.event;
                setting.left = ev.clientX - disX
                Drag.style.left = setting.left + "px";
                setting.top = ev.clientY - disY
                Drag.style.top = setting.top + "px";
                Drag.style.cursor = "move";
                GM_setValue('priate_script_xmly_data', setting)
            };
        };
        Drag.onmouseup = function() {
            document.onmousemove = null;
            this.style.cursor = "default";
        };
    };

    // 第一种获取musicURL的方式，任意用户均可获得，不可获得VIP音频
    async function getSimpleMusicURL1(item) {
        var res = null;
        if (item.url) {
            res = item.url;
        } else {
            const timestamp = Date.parse(new Date());
            var url = `https://mobwsa.ximalaya.com/mobile-playpage/playpage/tabs/${item.id}/${timestamp}`;

            try {
                const response = await fetch(url);
                const resp = await response.json();

                if (resp.ret === 0) {
                    const setting = GM_getValue('priate_script_xmly_data');
                    const trackInfo = resp.data.playpage.trackInfo;
                    if (setting.quality == 0) {
                        res = trackInfo.playUrl32;
                    } else if (setting.quality == 1) {
                        res = trackInfo.playUrl64;
                    }
                }
            } catch (error) {
                console.error('Error fetching URL:', error);
            }
        }
        return res;
    }
    // 第二种获取musicURL的方式，任意用户均可获得，不可获得VIP音频
    async function getSimpleMusicURL2(item) {
        var res = null;
        if (item.url) {
            res = item.url;
        } else {
            var url = `https://www.ximalaya.com/revision/play/v1/audio?id=${item.id}&ptype=1`;

            try {
                const response = await fetch(url);
                const resp = await response.json();
                if (resp.ret == 200) {
                    res = resp.data.src;
                }
            } catch (error) {
                console.error('Error fetching URL:', error);
            }
        }
        return res;
    }

    //获取任意音频方法
    async function getAllMusicURL1(item) {
        var res = null
        var setting;
        if (item.url) {
            res = item.url
        } else {
            const all_li = document.querySelectorAll('.sound-list>ul li');
            for (var num = 0; num < all_li.length; num++) {
                var li = all_li[num]
                const item_a = li.querySelector('a');
                const id = item_a.href.split('/')[item_a.href.split('/').length - 1]
                if (id == item.id) {
                    li.querySelector('div.all-icon').click()
                    while (!res) {
                        await Sleep(1)
                        setting = GM_getValue('priate_script_xmly_data')
                        res = setting.manualMusicURL
                    }
                    setting.manualMusicURL = null
                    GM_setValue('priate_script_xmly_data', setting)
                    li.querySelector('div.all-icon').click()
                    break
                }
            }
        }
        if (!res && item.isSingle) {
            document.querySelector('div.play-btn').click()
            while (!res) {
                await Sleep(1)
                setting = GM_getValue('priate_script_xmly_data')
                res = setting.manualMusicURL
            }
            setting.manualMusicURL = null
            GM_setValue('priate_script_xmly_data', setting)
            document.querySelector('div.play-btn').click()
        }
        return res
    }
    // 通过解密数据的方式获取 URL
    async function getAllMusicURL2(item) {
        function decrypt(t) {
            return CryptoJS.AES.decrypt({
                ciphertext: CryptoJS.enc.Base64url.parse(t)
            }, CryptoJS.enc.Hex.parse('aaad3e4fd540b0f79dca95606e72bf93'), {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7
            }).toString(CryptoJS.enc.Utf8)
        }

        var res = null;
        if (item.url) {
            res = item.url;
        } else {
            const timestamp = Date.parse(new Date());
            var url = `https://www.ximalaya.com/mobile-playpage/track/v3/baseInfo/${timestamp}?device=web&trackId=${item.id}`;

            try {
                const response = await fetch(url);
                const resp = await response.json();
                try {
                    res = decrypt(resp.trackInfo.playUrlList[0].url);
                } catch (e) {
                    console.log("解密错误");
                    res = null;
                }
            } catch (error) {
                console.error('Error fetching URL:', error);
            }
        }
        return res;
    }

    class XimalayaDownloader {
        constructor() {
            this.setting = GM_getValue('priate_script_xmly_data');
            this.data = [];
            this.musicList = [];
            this.isDownloading = false;
            this.cancelDownloadObj = null;
            this.stopDownload = false;
            this.autoDownloadEnabled = false;
            this.autoDownloadPaused = false;

            this.createButtons();
            this.initElements();
            this.initEventListeners();
            this.updateUI();
        }

        createButtons() {
            // Create auto download button only
            const autoDownloadBtn = document.createElement('button');
            autoDownloadBtn.id = 'autoDownloadBtn';
            autoDownloadBtn.textContent = '自动下载';
            autoDownloadBtn.style.display = 'none';

            const downloadBtn = document.getElementById('downloadBtn');
            if (downloadBtn) {
                downloadBtn.parentNode.insertBefore(autoDownloadBtn, downloadBtn.nextSibling);
            }
        }

        initElements() {
            try {
                this.elements = {
                    qualityBtn: document.getElementById('qualityBtn'),
                    numberToggleBtn: document.getElementById('numberToggleBtn'),
                    numberOffsetBtn: document.getElementById('numberOffsetBtn'),
                    numberOffsetSpan: document.getElementById('numberOffsetSpan'),
                    loadBtn: document.getElementById('loadBtn'),
                    downloadBtn: document.getElementById('downloadBtn'),
                    exportBtn: document.getElementById('exportBtn'),
                    cancelBtn: document.getElementById('cancelBtn'),
                    selectAllBtn: document.getElementById('selectAllBtn'),
                    musicTable: document.getElementById('musicTable'),
                    musicTableBody: document.getElementById('musicTableBody'),
                    autoDownloadBtn: document.getElementById('autoDownloadBtn')
                };

                // Verify all elements were found
                for (let key in this.elements) {
                    if (!this.elements[key]) {
                        throw new Error(`Element ${key} not found`);
                    }
                }
            } catch (error) {
                console.error('Failed to initialize elements:', error);
                throw error;
            }
        }

        initEventListeners() {
            this.elements.qualityBtn.onclick = () => this.changeQuality();
            this.elements.numberToggleBtn.onclick = () => this.switchShowNumber();
            this.elements.numberOffsetBtn.onclick = () => this.addNumberOffset();
            this.elements.numberOffsetBtn.oncontextmenu = (e) => {
                e.preventDefault();
                this.subNumberOffset();
            };
            this.elements.loadBtn.onclick = () => this.loadMusic();
            this.elements.downloadBtn.onclick = () => this.downloadAllMusics();
            this.elements.exportBtn.onclick = () => this.exportAllMusicURL();
            this.elements.cancelBtn.onclick = () => this.cancelDownload();
            this.elements.selectAllBtn.onclick = () => this.selectAllMusic();
            this.elements.autoDownloadBtn.onclick = () => this.toggleAutoDownload();
        }

        updateUI() {
            // Update quality button
            const qualityColors = ["#946C00", "#55ACEE", "#00947e", "#337ab7"];
            const qualityTexts = ["标准", "高清", "超高", "未知"];
            const quality = (this.setting.quality >= 0 && this.setting.quality <= 2) ? this.setting.quality : 3;
            this.elements.qualityBtn.style.color = qualityColors[quality];
            this.elements.qualityBtn.textContent = qualityTexts[quality];

            // Update number toggle
            this.elements.numberToggleBtn.style.color = this.setting.showNumber ? "#00947e" : "#CC0F35";
            this.elements.numberToggleBtn.textContent = this.setting.showNumber ? "开启" : "关闭";
            this.elements.numberOffsetSpan.style.display = this.setting.showNumber ? "inline" : "none";
            this.elements.numberOffsetBtn.textContent = this.setting.numberOffset;

            // Update buttons
            this.elements.loadBtn.textContent = this.data.length > 0 ? "重载" : "加载";
            this.elements.downloadBtn.style.display = (!this.isDownloading && this.musicList.length > 0) ? "inline" : "none";
            this.elements.exportBtn.style.display = (!this.isDownloading && this.musicList.length > 0) ? "inline" : "none";
            this.elements.cancelBtn.style.display = this.isDownloading ? "inline" : "none";
            this.elements.musicTable.style.display = this.data.length > 0 ? "block" : "none";
            this.elements.autoDownloadBtn.style.display = (!this.isDownloading && this.musicList.length > 0) ? "inline" : "none";
            this.elements.autoDownloadBtn.textContent = this.autoDownloadEnabled ? "停止自动" : "自动下载";

            this.renderMusicList();
        }

        renderMusicList() {
            this.elements.musicTableBody.innerHTML = '';
            const dataToRender = this.isDownloading ? this.musicList : this.data;

            dataToRender.forEach(item => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>
                        <input type="checkbox" class="checkMusicBox"
                            ${this.musicList.includes(item) ? 'checked' : ''}
                            ${(item.isDownloaded || this.isDownloading) ? 'disabled' : ''}>
                    </td>
                    <td><a href="#" style="color:#337ab7">${item.title}</a></td>
                    <td>
                        ${this.getActionButtonHTML(item)}
                    </td>
                `;

                // Add event listeners
                const checkbox = tr.querySelector('input');
                checkbox.onchange = () => this.toggleMusicSelection(item);

                const downloadBtn = tr.querySelector('.downloadBtn');
                if (downloadBtn) {
                    downloadBtn.onclick = () => this.downloadMusic(item);
                }

                this.elements.musicTableBody.appendChild(tr);
            });
        }

        getActionButtonHTML(item) {
            if (item.isDownloaded) return '<a style="color:#00947E">完成</a>';
            if (item.isDownloading) return `<a style="color:#C01D07">${item.progress}</a>`;
            if (item.isFailued) return '<a style="color:red">失败</a>';
            if (this.isDownloading) return '';

            return '<a href="#" class="downloadBtn" style="color:#993333">下载</a>';
        }

        async loadMusic() {
            const whiteList = ['sound', 'album'];
            const type = location.pathname.split('/')[location.pathname.split('/').length - 2];

            if (whiteList.indexOf(type) < 0) {
                showAlert("请先进入一个专辑页面并等待页面完全加载！", "error");
                this.data = [];
                this.musicList = [];
                this.updateUI();
                return;
            }

            const all_li = document.querySelectorAll('.sound-list>ul li');
            const result = [];

            all_li.forEach((item) => {
                const item_a = item.querySelector('a');
                const number = item.querySelector('span.num') ?
                    parseInt(item.querySelector('span.num').innerText) : 0;
                const title = item_a.title.trim()
                    .replace(/\\|\/|\?|\？|\*|\"|\"|\"|\'|\'|\'|\<|\>|\{|\}|\[|\]|\【|\】|\：|\:|\、|\^|\$|\!|\~|\`|\|/g, '')
                    .replace(/\./g, '-');

                const formattedNumber = String(number + this.setting.numberOffset - 1).padStart(4, '0');

                const music = {
                    id: item_a.href.split('/')[item_a.href.split('/').length - 1],
                    number,
                    title: this.setting.showNumber ?
                        `${formattedNumber}-${title}` : title,
                    isDownloading: false,
                    isDownloaded: false,
                    progress: 0,
                };
                result.push(music);
            });

            // Handle single audio case
            if (result.length === 0 && type === 'sound') {
                const music = {
                    id: location.pathname.split('/')[location.pathname.split('/').length - 1],
                    title: this.setting.showNumber ?
                        `0001-${document.querySelector('h1.title-wrapper')?.innerText || '未知标题'}` :
                        document.querySelector('h1.title-wrapper')?.innerText || '未知标题',
                    isDownloading: false,
                    isDownloaded: false,
                    progress: 0,
                    isSingle: true
                };
                result.push(music);
            }

            if (result.length === 0) {
                showAlert("未获取到数据，请进入一个专辑页面并等待页面完全加载！", "error");
            }

            this.data = result;
            this.musicList = [...result];
            this.updateUI();
        }

        async downloadMusic(item) {
            if (this.stopDownload || item.isDownloading || item.isDownloaded) return;

            item.isDownloading = true;
            item.isFailued = false;
            this.updateUI();

            try {
                const url = item.url || await this.getMusicURL(item);
                if (!url) {
                    throw new Error('Failed to get music URL');
                }

                return new Promise((resolve, reject) => {
                    const details = {
                        url: url,
                        name: item.title + '.mp3',
                        onload: () => {
                            item.isDownloading = false;
                            item.isDownloaded = true;
                            this.updateUI();
                            resolve();
                        },
                        onerror: (e) => {
                            item.isDownloading = false;
                            if (e.error !== 'aborted') {
                                item.isFailued = true;
                            }
                            this.updateUI();
                            reject(e);
                        },
                        onprogress: (d) => {
                            item.progress = (Math.round(d.loaded / d.total * 10000) / 100.00) + "%";
                            this.updateUI();
                        }
                    };

                    this.cancelDownloadObj = GM_download(details);
                });
            } catch (error) {
                console.error('Download failed:', error);
                item.isDownloading = false;
                item.isFailued = true;
                this.updateUI();
                throw error;
            }
        }

        async getMusicURL(item) {
            let url = await getSimpleMusicURL1(item);
            if (!url) url = await getSimpleMusicURL2(item);
            if (!url) url = await getAllMusicURL2(item);
            if (!url) url = await getAllMusicURL1(item);
            return url;
        }

        async downloadAllMusics() {
            try {
                this.isDownloading = true;
                this.stopDownload = false;
                this.updateUI();

                for (const item of this.musicList) {
                    if (this.stopDownload) break;
                    if (!item.isDownloaded && !item.isDownloading) {
                        try {
                            await this.downloadMusic(item);
                            // Random delay between 3-6 seconds between downloads
                            const delay = Math.floor(Math.random() * 2000) + 2000;
                            await new Promise(resolve => setTimeout(resolve, delay));
                        } catch (error) {
                            this.autoDownloadEnabled = false;
                            throw error;
                        }
                    }
                }
            } catch (error) {
                console.error('Batch download failed:', error);
                showAlert('批量下载失败，已停止所有任务', 'error');
                this.autoDownloadEnabled = false;
            } finally {
                this.isDownloading = false;
                this.stopDownload = false;
                this.updateUI();
            }
        }

        cancelDownload() {
            this.stopDownload = true;
            if (this.cancelDownloadObj) {
                this.cancelDownloadObj.abort();
            }
            this.isDownloading = false;
            this.updateUI();
        }

        toggleMusicSelection(item) {
            const index = this.musicList.indexOf(item);
            if (index > -1) {
                this.musicList.splice(index, 1);
            } else {
                this.musicList.push(item);
            }
            this.updateUI();
        }

        selectAllMusic() {
            if (this.musicList.length === this.data.length) {
                this.musicList = [];
            } else {
                this.musicList = [...this.data];
            }
            this.updateUI();
        }

        changeQuality() {
            showAlert("由于喜马拉雅接口变动，此功能暂时不可用，目前统一为高清。", "info");
            this.setting.quality = 1;
            GM_setValue('priate_script_xmly_data', this.setting);
            this.updateUI();
        }

        switchShowNumber() {
            this.setting.showNumber = !this.setting.showNumber;
            if (this.setting.showNumber) {
                this.setting.numberOffset = 1;
            } else {
                this.setting.numberOffset = 0;
            }
            GM_setValue('priate_script_xmly_data', this.setting);
            if (this.data.length > 0) {
                this.loadMusic();
            }
            this.updateUI();
        }

        addNumberOffset() {
            if (!this.setting.showNumber) {
                showAlert("请先开启编号功能再设置编号偏移量！", "error");
                return;
            }
            this.setting.numberOffset += 1;
            GM_setValue('priate_script_xmly_data', this.setting);
            if (this.data.length > 0) {
                this.loadMusic();
            }
            this.updateUI();
        }

        subNumberOffset() {
            if (!this.setting.showNumber) {
                showAlert("请先开启编号功能再设置编号偏移量！", "error");
                return;
            }
            this.setting.numberOffset -= 1;
            GM_setValue('priate_script_xmly_data', this.setting);
            if (this.data.length > 0) {
                this.loadMusic();
            }
            this.updateUI();
        }

        async exportAllMusicURL() {
            try {
                const urls = [];
                for (const item of this.musicList) {
                    const url = await this.getMusicURL(item);
                    if (url) {
                        urls.push(url);
                    }
                }
                if (urls.length > 0) {
                    GM_setClipboard(urls.join('\n'));
                    showAlert("音频链接已复制到剪贴板", "info");
                } else {
                    showAlert("没有可导出的链接", "error");
                }
            } catch (error) {
                console.error('Export failed:', error);
                showAlert("导出失败，请重试", "error");
            }
        }

        toggleAutoDownload() {
            this.autoDownloadEnabled = !this.autoDownloadEnabled;
            if (this.autoDownloadEnabled) {
                this.startAutoDownload();
            } else {
                this.cancelDownload();
            }
            this.updateUI();
        }

        async startAutoDownload() {
            while (this.autoDownloadEnabled && !this.stopDownload) {
                try {
                    await this.downloadAllMusics();

                    // If autoDownloadEnabled is false (set to false when download fails), don't continue
                    if (!this.autoDownloadEnabled) {
                        break;
                    }

                    // Check if there's a next page
                    const nextPageBtn = document.querySelector('.page-next .page-link.N_t');
                    if (!nextPageBtn) {
                        this.autoDownloadEnabled = false;
                        showAlert("所有页面下载完成！", "info");
                        break;
                    }

                    // Random delay between 3-6 seconds before moving to next page
                    const delay = Math.floor(Math.random() * 3000) + 3000;
                    await new Promise(resolve => setTimeout(resolve, delay));

                    // Click next page and wait for content to load
                    nextPageBtn.click();
                    await this.waitForContentLoad();

                    // Load new page content
                    await this.loadMusic();

                } catch (error) {
                    console.error('Auto-download error:', error);
                    this.autoDownloadPaused = true;
                    showAlert("下载过程中遇到错误，已暂停自动下载", "error");
                    break;
                }
            }
            this.updateUI();
        }

        waitForContentLoad() {
            return new Promise(resolve => {
                let attempts = 0;
                const checkContent = setInterval(() => {
                    attempts++;
                    const contentLoaded = document.querySelectorAll('.sound-list>ul li').length > 0;
                    if (contentLoaded || attempts > 20) {  // timeout after 10 seconds
                        clearInterval(checkContent);
                        setTimeout(resolve, 1000); // wait an extra second for good measure
                    }
                }, 500);
            });
        }
    }

    // Modify init function to use MutationObserver
    function init() {
        try {
            initSetting();

            // Wait for body to be available
            if (document.body) {
                injectDiv();
                setTimeout(() => {
                    window.ximalayaDownloader = new XimalayaDownloader();
                    dragFunc("priate_script_div");
                }, 100); // Increased timeout
            } else {
                // If body not available, wait for it
                const observer = new MutationObserver((mutations, obs) => {
                    if (document.body) {
                        obs.disconnect();
                        init();
                    }
                });

                observer.observe(document.documentElement, {
                    childList: true,
                    subtree: true
                });
            }
        } catch (error) {
            console.error('Initialization failed:', error);
        }
    }

    // Remove DOMContentLoaded event listener and call init directly
    init();
})();

GM_addStyle(`
#priate_script_div {
    font-size: 14px;
    position: fixed;
    background-color: #fff;
    color: #333;
    text-align: center;
    padding: 10px;
    z-index: 9999;
    border-radius: 8px;
    border: 1px solid #ddd;
    box-shadow: 0 2px 12px rgba(0,0,0,0.15);
    user-select: none;
    position: fixed !important;
    z-index: 2147483647 !important;
    background-color: #fff !important;
}

#priate_script_div button {
    border-radius: 4px;
    border: 1px solid #ddd;
    background-color: #fff;
    color: #333;
    padding: 4px 8px;
    margin: 4px 6px;
    cursor: pointer;
}

#priate_script_div table {
    text-align: center;
    margin: 5px auto;
    border-collapse: collapse;
    max-height: 400px;
    overflow-y: auto;
}

#priate_script_div td, #priate_script_div th {
    border: 1px solid #ddd;
    padding: 6px 10px;
}

.checkMusicBox {
    transform: scale(1.2);
    cursor: pointer;
}

#priate_script_div * {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
}
`);