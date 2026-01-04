// ==UserScript==
// @name        提取各类影迷网站页面中的神秘代码
// @namespace   http://tampermonkey.net/
// @match       *://63h.net/*
// @match       *://www.63h.net/*
// @match       *://*.63h.*/*
// @match       *://ibeigu.com/*
// @match       *://www.ibeigu.com/*
// @match       *://*.ibeigu.*/*
// @match       *://kingliftin.com/*
// @match       *://www.kingliftin.com/*
// @match       *://*.kingliftin.*/*
// @match       *://hanyunfang.com/*
// @match       *://www.hanyunfang.com/*
// @match       *://*.hanyunfang.*/*
// @match       *://succai.com/*
// @match       *://www.succai.com/*
// @match       *://*.succai.*/*
// @match       *://lj7.net/*
// @match       *://www.lj7.net/*
// @match       *://*.lj7.*/*
// @match       *://xiaomibev.com/*
// @match       *://www.xiaomibev.com/*
// @match       *://*.xiaomibev.*/*
// @match       *://tonglinjunye.com/*
// @match       *://www.tonglinjunye.com/*
// @match       *://*.tonglinjunye.*/*
// @match       *://sctsw.com/*
// @match       *://www.sctsw.com/*
// @match       *://*.sctsw.*/*
// @match       *://vectorsideco.com/*
// @match       *://www.vectorsideco.com/*
// @match       *://*.vectorsideco.*/*
// @match       *://yingwaima.com/*
// @match       *://www.yingwaima.com/*
// @match       *://*.yingwaima.*/*
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @connect     missav.ws
// @connect     ja.wikipedia.org
// @connect     zh.wikipedia.org
// @connect     xslist.org
// @connect     av-wiki.net
// @connect     www.xb1.com
// @connect     www.javrate.com
// @version     1.2.1
// @author      slowFever
// @description 自动提取当前页面中的神秘代码，并显示演员信息，适用于各类影迷相关网站。
// @icon        https://www.google.com/s2/favicons?sz=64&domain=www.succai.com
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/537763/%E6%8F%90%E5%8F%96%E5%90%84%E7%B1%BB%E5%BD%B1%E8%BF%B7%E7%BD%91%E7%AB%99%E9%A1%B5%E9%9D%A2%E4%B8%AD%E7%9A%84%E7%A5%9E%E7%A7%98%E4%BB%A3%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/537763/%E6%8F%90%E5%8F%96%E5%90%84%E7%B1%BB%E5%BD%B1%E8%BF%B7%E7%BD%91%E7%AB%99%E9%A1%B5%E9%9D%A2%E4%B8%AD%E7%9A%84%E7%A5%9E%E7%A7%98%E4%BB%A3%E7%A0%81.meta.js
// ==/UserScript==

(function () {
    'use strict';

    class ActressInfoPanel {
        constructor () {
            // 定义支持的站点及其对应的选择器配置
            this.siteConfigs = {
                'www.63h.net': {
                    title: '.entry-header h1.entry-title',
                    images: '.entry-content p > img',
                    names: '.tags-links a[rel="tag"]',
                    domain: 'www.63h.net'
                },
                'www.ibeigu.com': {
                    title: '.entry-header h1.entry-title',
                    images: '.entry-content p > img:not([name="imgxa"])',
                    names: '.tags-links a[rel="tag"]',
                    domain: 'www.ibeigu.com'
                },
                'www.kingliftin.com': {
                    title: '.entry-header h1.entry-title',
                    images: '.entry-content p > img',
                    names: '.tags-links a[rel="tag"]',
                    domain: 'www.kingliftin.com'
                },
                'www.hanyunfang.com': {
                    title: '.entry-header h1.entry-title',
                    images: '.entry-content p > img',
                    names: '.tags-links a[rel="tag"]',
                    domain: 'www.hanyunfang.com'
                },
                'www.succai.com': {
                    title: '.entry-header h1.entry-title',
                    images: '.entry-content p > img',
                    names: '.tags-links a[rel="tag"]',
                    domain: 'www.succai.com'
                },
                'www.lj7.net': {
                    title: '.entry-header h1.entry-title',
                    images: '.entry-content p > img',
                    names: '.tags-links a[rel="tag"]',
                    domain: 'www.lj7.net'
                },
                'www.xiaomibev.com': {
                    title: '.entry-header h1.entry-title',
                    images: '.entry-content p > img',
                    names: '.tags-links a[rel="tag"]',
                    domain: 'www.xiaomibev.com'
                },
                'www.tonglinjunye.com': {
                    title: '.entry-header h1.entry-title',
                    images: '.entry-content p > img:not([name="imgxa"])',
                    names: '.tags-links a[rel="tag"]',
                    domain: 'www.tonglinjunye.com'
                },
                'www.sctsw.com': {
                    title: '.entry-header h1.entry-title',
                    images: '.entry-content p > img',
                    names: '.tags-links a[rel="tag"]',
                    domain: 'www.sctsw.com'
                },
                'www.vectorsideco.com': {
                    title: '.article-header h1.article-title',
                    images: '.article-content p > img:not([name="imgxa"])',
                    names: '.article-tags a[rel="tag"]',
                    domain: 'www.vectorsideco.com'
                },
                'www.yingwaima.com': {
                    title: '.article-header h1.article-title',
                    images: '.article-content p > img:not([name="imgxa"])',
                    names: '.article-tags a[rel="tag"]',
                    domain: 'www.yingwaima.com'
                }
            }

            // 根据当前网页的域名匹配对应的配置
            this.currentConfig = this._matchSiteConfig();

            this.DEFAULT_IMAGE = 'data:image/png;base64,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';

            // 面板相关
            this.panel = null; // 面板
            this.toggleBtn = null; // 面板按钮
            this.iconOpen = `<svg t="1748606871665" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7954" width="20" height="20"><path d="M544.768 507.904V251.904c-2.048-16.384-16.384-28.672-30.72-28.672-18.432 0-32.768 14.336-32.768 32.768v251.904c-43.008 14.336-73.728 53.248-73.728 102.4s30.72 88.064 73.728 102.4V772.096c2.048 16.384 16.384 28.672 30.72 28.672 18.432 0 32.768-14.336 32.768-32.768v-55.296c43.008-14.336 73.728-53.248 73.728-102.4 0-47.104-30.72-88.064-73.728-102.4zM512 653.312c-24.576 0-43.008-18.432-43.008-43.008 0-24.576 18.432-43.008 43.008-43.008s43.008 18.432 43.008 43.008c0 24.576-18.432 43.008-43.008 43.008z" p-id="7955" fill="#ffffff"></path><path d="M854.016 0H169.984C75.776 0 0 75.776 0 169.984v681.984C0 948.224 75.776 1024 169.984 1024h681.984c94.208 0 169.984-75.776 169.984-169.984V169.984C1024 75.776 948.224 0 854.016 0z m106.496 854.016v6.144c-4.096 55.296-49.152 100.352-106.496 100.352H163.84c-55.296-4.096-100.352-49.152-100.352-106.496V163.84c4.096-55.296 49.152-100.352 106.496-100.352H858.112c55.296 4.096 100.352 49.152 100.352 106.496v684.032z" p-id="7956" fill="#ffffff"></path><path d="M288.768 317.44v-65.536c-2.048-16.384-16.384-28.672-30.72-28.672-18.432 0-32.768 14.336-32.768 32.768v61.44c-43.008 14.336-73.728 53.248-73.728 102.4s30.72 88.064 73.728 102.4v249.856c2.048 16.384 16.384 28.672 30.72 28.672 18.432 0 32.768-14.336 32.768-32.768v-245.76c43.008-14.336 73.728-53.248 73.728-102.4s-30.72-88.064-73.728-102.4z m-32.768 145.408c-24.576 0-43.008-18.432-43.008-43.008 0-24.576 18.432-43.008 43.008-43.008s43.008 18.432 43.008 43.008c0 22.528-20.48 43.008-43.008 43.008zM798.72 317.44v-65.536c-2.048-16.384-16.384-28.672-30.72-28.672-18.432 0-32.768 14.336-32.768 32.768v61.44c-43.008 14.336-73.728 53.248-73.728 102.4s30.72 88.064 73.728 102.4v249.856c2.048 16.384 16.384 28.672 30.72 28.672 18.432 0 32.768-14.336 32.768-32.768v-245.76c43.008-14.336 73.728-53.248 73.728-102.4s-30.72-88.064-73.728-102.4z m-32.768 145.408c-24.576 0-43.008-18.432-43.008-43.008 0-24.576 18.432-43.008 43.008-43.008s43.008 18.432 43.008 43.008c0 22.528-18.432 43.008-43.008 43.008z" p-id="7957" fill="#ffffff"></path></svg>`; // 展开图标
            this.iconClose = `<svg t="1748606610599" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5450" width="20" height="20"><path d="M512 0a512 512 0 1 1 0 1024A512 512 0 0 1 512 0z m170.368 284.8L512 455.168 341.632 284.8l-56.832 56.832L455.168 512 284.8 682.368l56.832 56.768L512 568.768l170.368 170.368 56.768-56.768L568.768 512l170.368-170.368-56.768-56.832z" fill="#ffffff" p-id="5451"></path></svg>`; // 收起图标

            // 元素
            this.titleElement = null; // 标题元素
            this.imgElements = []; // 图片元素
            this.names = []; // 名字列表

            // 面板显示状态 （true 显示 / false 隐藏）
            this.panelVisible = GM_getValue('panelVisible', true); // 默认显示
        }

        // 样式
        applyStyles() {
            const css =`
            #custom-panel-toggle {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background-color: #678efd;
                color: white;
                border: none;
                padding: 8px 15px;
                border-radius: 6px;
                cursor: pointer;
                z-index: 9999;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                font-size: 14px;
            }

            #custom-panel {
                position: fixed;
                bottom: 70px;
                right: 20px;
                width: auto;
                height: auto;
                z-index: 99999;
                font-family: sans-serif;
                opacity: 0;
                transform: translateX(400px);
                pointer-events: none;
                transition: opacity 0.5s ease, transform 0.5s ease;
            }

            #custom-panel.visible {
                opacity: 1;
                transform: translateX(0);
                pointer-events: auto;
            }

            #custom-panel .profile {
                background-color: hwb(0deg 96.37% 3.63% / 68%);
                backdrop-filter: blur(3px) saturate(180%);
                -webkit-backdrop-filter: blur(3px) saturate(180%);
                border-radius: 12px;
                display: flex;
                align-items: center;
                box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.2);
                padding: 8px;
                margin-bottom: 10px;
            }

            #custom-panel .avatar {
                width: 60px;
                height: 60px;
                border-radius: 50%;
                object-fit: cover;
                object-position: center top;
                margin-right: 10px;
                border: 2px solid #ccc;
            }

            #custom-panel .info {
                flex: 1;
            }

            #custom-panel .info div {
                font-size: 12px;
                line-height: 1.5;
            }

            #custom-panel .movie-information {
                width: 300px;
                height: auto;
                background-color: hwb(224.4deg 40.39% 0.78% / 68%);
                backdrop-filter: blur(3px) saturate(180%);
                -webkit-backdrop-filter: blur(3px) saturate(180%);
                color: white;
                border-radius: 12px;
                box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
                padding: 15px;
            }

            #custom-panel h3 {
                display: flex;
                margin-top: 0;
                font-size: 16px;
                color: #ffffff;
            }

            #btn {
                display: flex;
                padding: 4px 10px;
                background-color: #0050ff;
                color: white;
                border: none;
                border-radius: 3px;
                font-size: 12px;
                cursor: pointer;
                transition: background-color 0.2s ease;
            }

            #btn:hover {
                background-color: #1d4ed8;
            }

            #custom-panel .content-panel {
                font-size: 14px;
                line-height: 1.4;
            }

            .ellipsis-2 {
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
                text-overflow: ellipsis;
                word-break: break-word;
            }
    
            .image-container {
                overflow: hidden;
                margin-top: 10px;
            }
    
            .image-grid {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                justify-content: space-between;
            }
    
            .image-grid img {
                width: calc(50% - 5px);
                height: auto;
                object-fit: contain;
                border-radius: 6px;
                box-shadow: 0 2px 6px rgba(0,0,0,0.15);
                max-width: 100%;
            }
    
            @media screen and (max-width: 400px) {
                #custom-panel {
                    right: 0;
                    padding: 10px;
                }

                #custom-panel .movie-information {
                    width: 100%;
                }
            }
            `;
            GM_addStyle(css);
        }

        // 获取当前页面的标题、图片、名字
        collectPageData() {
            if (!this.currentConfig) {
                console.error("无法提取数据，未找到匹配的配置");
                return;
            }

            // 根据当前配置提取页面数据
            console.log(this.currentConfig)
            const { title, images, names } = this.currentConfig;
            this.titleElement = document.querySelector(title);
            this.imgElements = document.querySelectorAll(images);
            this.names = [...document.querySelectorAll(names)].map(el => el.innerText);

            console.log('获取到的名字：', this.names);
        }

        // 解析番号
        extractCodeFromText(text) {
            const matches = text.match(/[A-Z]{2,}-\d{2,}/gi);
            return matches ? matches.join(',') : '';
        }

        // panel 构建
        createPanel() {
            const code = this.titleElement ? this.extractCodeFromText(this.titleElement.textContent) : '';
            this.panel = document.createElement('div');
            this.panel.id = 'custom-panel';
            this.panel.innerHTML = `
                <div class="profile">
                    <img src="data:image/gif;base64,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" alt="加载中。。。" width="30" style="margin: 0 auto;">
                </div>
                <div class="movie-information">
                  <h3>
                    <span style="flex:1;">番号：<span id="code">${code}</span></span>
                    <button id="btn">复制</button>
                  </h3>
                  <div class="content-panel ellipsis-2" id="panel-title">
                    ${this.titleElement ? this.titleElement.textContent : ''}
                  </div>
                  <div class="content-panel image-container">
                    <div class="image-grid" id="image-grid">
                      ${[...this.imgElements].map(item => `<img src="${item.src}" alt="Image">`).join('')}
                    </div>
                  </div>
                </div>
            `;
            document.body.appendChild(this.panel);
        }

        // 初始化面板状态
        initPanelState() {
            if (this.panelVisible) {
                this.panel.classList.add('visible');
            } else {
                this.panel.classList.remove('visible');
            }
        }

        // 切换按钮
        createToggleButton() {
            this.toggleBtn = document.createElement('button');
            this.toggleBtn.id = 'custom-panel-toggle';
            this.toggleBtn.style = 'display: flex; align-items: center; justify-content: center;';

            // 根据初始状态显示图标
            this.toggleBtn.innerHTML = this.panelVisible ? this.iconClose : this.iconOpen;
            document.body.appendChild(this.toggleBtn);

            // 点击切换
            this.toggleBtn.onclick = () => {
                this.panelVisible = this.panel.classList.toggle('visible');
                GM_setValue('panelVisible', this.panelVisible);
                this.toggleBtn.innerHTML = this.panelVisible ? this.iconClose : this.iconOpen;
            };
        }

        // 复制按钮逻辑
        setupCopyLogic() {
            const btn = this.panel.querySelector('#btn');
            const codeSpan = this.panel.querySelector('#code');
            btn.addEventListener('click', () => {
                const textToCopy = (codeSpan.textContent || '').trim();

                navigator.clipboard.writeText(textToCopy).then(() => {
                    btn.textContent = '已复制';
                    btn.disabled = true;

                    setTimeout(() => {
                        btn.textContent = '复制';
                        btn.disabled = false;
                    }, 3000);
                }).catch(err => {
                    console.error('复制失败:', err);
                    alert('复制失败，请手动复制');
                });
            });
        }

        // 默认图片相关工具
        getDefaultImage() {
            return this.DEFAULT_IMAGE;
        }
        _isDefaultImage(url) {
            return url === this.DEFAULT_IMAGE;
        }

        /**
         * 从 MissAV 抓取女优信息。
         * @param {string} name - 女优名称。
         * @returns {Promise<Object|null>}
         */
        async fetchFromMissAV(name) {
            return new Promise((resolve) => {
                const url = 'https://missav.ws/cn/actresses/' + encodeURIComponent(name);

                GM_xmlhttpRequest({
                    method: 'GET',
                    headers: {
                        'Cookie': 'cf_clearance=rXSWNEkmbhhcwPrQVahhXcz9c.cP4Y_pHCfl_8EAEJs-1749198122-1.2.1.1-K0uYl8yj2uDHyfv3vt2B0O6IV06_TroIG7vdran1huSSqzEp0.4cVKxtgqJ5IM4GyqURudb4wtz5i.vbQtcr.H.kYwCxTTwonQ9FoxyI1rNN0gF9.Yn2L_c7F5mxdfyFCGPj5U8vmqed5bkifrVmFjc.qosxAoibnM4WrZaHlPX5h9lDeZeweKlPFHGEAtk9237bEejVGptDbLEfpQvdnT2nC79CbvisRr9.89Y5H.5Q7IWzlrP79dFZXzVRWQbROVR_yk3uXHka1eHw_jrcCUpBSFXp_oZatnsWPFy9.y3Jsf9T_4TMN8d7wBOC0MMgqnYZrTCgY7GJPUHCWpBThW6pH56dimV_5Fc5UK9sb9h8F7wfbzEnOLMqCHQtOQhD', // 替换为最新值
                    },
                    url,
                    onload: (response) => {
                        if (response.status !== 200) return resolve(null);

                        try {
                            const doc = new DOMParser().parseFromString(response.responseText, 'text/html');
                            const root = doc.querySelector('.hero-pattern');
                            if (!root) return resolve(null);

                            let birthday = null, age = null, height = null, cup = null, image = null;

                            // 获取图片、姓名和信息文本节点
                            const imgEl = root.querySelector('img')?.src || null;
                            if (imgEl) image = imgEl;
                            const actressName = root.querySelector('h4')?.textContent?.trim() || name;
                            const infoText = root.querySelector('.text-nord9')?.innerText?.trim().replace(/\s+/g, ' ') || '';

                            // 使用 _parseBirthdayAndAge方法 提取生日并计算年龄
                            ({birthday, age} = this._parseBirthdayAndAge(infoText));

                            // 使用 _parseBodySpecs 解析三围和罩杯, 身高
                            ({height, cup} = this._parseBodySpecs(infoText));

                            resolve({
                                source: 'missAV',
                                name: actressName,
                                birthday,
                                age,
                                height,
                                cup,
                                image
                            });

                        } catch (err) {
                            console.warn('解析 MissAV 页面失败:', err);
                            resolve(null);
                        }
                    },
                    onerror: () => resolve(null)
                });
            });
        }

        /**
         * 从日文维基百科抓取女优信息。
         * @param {string} name - 女优名称。
         * @returns {Promise<Object|null>}
         */
        async fetchFromWikipedia_ja(name) {
            return new Promise((resolve) => {
                const wikiUrl_ja = 'https://ja.wikipedia.org/wiki/' + encodeURIComponent(name);
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: wikiUrl_ja,
                    onload: (response) => {
                        if (response.status !== 200) return resolve(null);

                        try {
                            const doc = new DOMParser().parseFromString(response.responseText, 'text/html');
                            const infoBox = doc.querySelector('.infobox'); // 查找信息框
                            if (!infoBox) return resolve(null);

                            let age = null, height = null, cup = null, birthday = null, image = null;

                            // 通过 _extractInfoBoxImage(infoBox) 方法，获取女优照片
                            image = this._extractInfoBoxImage(infoBox);

                            // 提取表格中的字段
                            const rows = infoBox.querySelectorAll('tr');
                            rows.forEach(row => {
                                const header = row.querySelector('th');
                                const data = row.querySelector('td');
                                if (!header || !data) return;

                                const label = header.textContent.trim();
                                const value = data.textContent.trim();

                                // 出生日期和年龄，身高，罩杯
                                if (/生年月日/.test(label)) {
                                    // 使用 _parseBirthdayAndAge方法 提取生日并计算年龄
                                    const result = this._parseBirthdayAndAge(value);
                                    birthday = result.birthday;
                                    age = result.age;
                                } else if (/身[長高]|体重/.test(label) && !/比|率/.test(label)) {
                                    const h = (label + value).match(/(\d{2,3})\s*(厘米|cm)/i);
                                    if (h) height = h[1];
                                } else if (/ブラサイズ/.test(label)) {
                                    const cupMatch = value.match(/[A-Z]/i);
                                    if (cupMatch) cup = cupMatch[0].toUpperCase();
                                }
                            });

                            resolve({source: 'ja.wikipedia', name, birthday, age, height, cup, image});
                        } catch (err) {
                            resolve(null);
                        }
                    },
                    onerror: () => resolve(null)
                });
            });
        }

        /**
         * 从中文维基百科抓取女优信息。
         * @param {string} name - 女优名称。
         * @returns {Promise<Object|null>}
         */
        async fetchFromWikipedia_zh(name) {
            return new Promise((resolve) => {
                const wikiUrl_zh = 'https://zh.wikipedia.org/wiki/' + encodeURIComponent(name);
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: wikiUrl_zh,
                    onload: (response) => {
                        if (response.status !== 200) return resolve(null);

                        try {
                            const doc = new DOMParser().parseFromString(response.responseText, 'text/html');
                            const infoBox = doc.querySelector('.infobox, .infobox.vcard, .infobox.biography.vcard');
                            if (!infoBox) return resolve(null);

                            let age = null, height = null, cup = null, birthday = null, image = null;

                            // 通过 _extractInfoBoxImage(infoBox) 方法，获取女优照片
                            image = this._extractInfoBoxImage(infoBox);

                            // 提取信息表中的字段
                            const rows = infoBox.querySelectorAll('tr');
                            rows.forEach(row => {
                                const header = row.querySelector('th');
                                const data = row.querySelector('td');
                                if (!header || !data) return;

                                const label = header.textContent.trim();
                                const value = data.textContent.trim();

                                // 出生日期和年龄，身高，罩杯
                                if (/出生|生年/.test(label)) {
                                    // 使用 _parseBirthdayAndAge方法 提取生日并计算年龄
                                    const result = this._parseBirthdayAndAge(value);
                                    birthday = result.birthday;
                                    age = result.age;
                                } else if (/身[長高]|体重/.test(label) && !/比|率/.test(label)) {
                                    const h = (label + value).match(/(\d{2,3})\s*(厘米|cm)/i);
                                    if (h) height = h[1];
                                } else if (/三围|罩杯/.test(label)) {
                                    const cupMatch = value.match(/[A-Z]/i);
                                    if (cupMatch) cup = cupMatch[0].toUpperCase();
                                }
                            });

                            resolve({ source: 'zh.wikipedia', name, birthday, age, height, cup, image });
                        } catch (err) {
                            resolve(null);
                        }
                    },
                    onerror: () => resolve(null)
                });
            });
        }

        /**
         * 从 AV-Wiki 抓取女优信息。
         * @param {string} name - 女优名称。
         * @returns {Promise<Object|null>}
         */
        async fetchFromAvWikiInfo(name) {
            return new Promise((resolve) => {
                const searchUrl = `https://av-wiki.net/?s=${encodeURIComponent(name)}&post_type=product`;

                const self = this; // 保存 this

                GM_xmlhttpRequest({
                    url: searchUrl,
                    method: 'GET',
                    headers: {
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                        'Referer': 'https://av-wiki.net/',
                    },
                    onload: function (response) {
                        if (response.status !== 200) return resolve(null);

                        try {
                            const doc = new DOMParser().parseFromString(response.responseText, 'text/html');
                            // 搜索结果页，找到演员链接
                            const link = Array.from(doc.querySelectorAll("a[rel='tag']"))
                                .find(a => a.textContent.trim() === name);

                            if (!link) {
                                return resolve(null);
                            }

                            // 进入演员详情页
                            GM_xmlhttpRequest({
                                url: link.href,
                                method: 'GET',
                                onload: function (res2) {
                                    if (res2.status !== 200) return resolve(null);

                                    try {
                                        const doc2 = new DOMParser().parseFromString(res2.responseText, 'text/html');

                                        let birthday = null, age = null, height = null, cup = null, image = null;

                                        // 头像
                                        const imgEl = doc2.querySelector('.actress-image img');
                                        if (imgEl) image = imgEl.src;

                                        // 解析基本资料字段
                                        const ddEls = doc2.querySelectorAll('.actress-data dd');
                                        ddEls.forEach(dd => {
                                            const text = dd.textContent.trim();

                                            // 使用 _parseBirthdayAndAge方法 提取生日并计算年龄
                                            ({ birthday, age } = self._parseBirthdayAndAge(text));

                                            // 三围 / 罩杯 / 身高
                                            // 只要这一行包含 T/B/W/H 格式就交给 parseBodySpecs
                                            if (/T\d{2,3}.*B\d{2,3}/i.test(text)) {
                                                const { height: h, cup: c } = self._parseBodySpecs(text);
                                                if (h) height = h;
                                                if (c) cup = c;
                                            }
                                        });

                                        resolve({
                                            source: 'av-wiki',
                                            name,
                                            birthday,
                                            age,
                                            height,
                                            cup,
                                            image
                                        });
                                    } catch (err) {
                                        console.warn('解析 AV-Wiki 详情页失败:', err);
                                        resolve(null);
                                    }
                                },
                                onerror: () => resolve(null)
                            });
                        } catch (err) {
                            console.warn('解析 AV-Wiki 搜索页失败:', err);
                            resolve(null);
                        }
                    },
                    onerror: () => resolve(null)
                });
            });
        }

        /**
         * 从 xb1 抓取女优信息。
         * @param {string} name - 女优名称。
         * @returns {Promise<Object|null>}
         */
        async fetchFromXB1(name) {
            return new Promise((resolve) => {
                // https://www.xb1.com/search/%E6%AD%A6%E7%94%B0%E6%80%9C%E9%A6%99
                const searchUrl = `https://www.xb1.com/search/${encodeURIComponent(name)}`;

                const self = this; // 保存 this

                GM_xmlhttpRequest({
                    url: searchUrl,
                    method: 'GET',
                    headers: {
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36',
                        'Referer': 'https://www.xb1.com/',
                    },
                    onload: function (response) {
                        // 检查HTTP响应状态码，如果不是200（成功）就返回null
                        if (response.status !== 200) return resolve(null);

                        try {
                            // 解析返回的HTML文本
                            const doc = new DOMParser().parseFromString(response.responseText, 'text/html');

                            // 搜索结果页，找到所有演员条目链接
                            const allLinks = doc.querySelectorAll('.r-text dt a');

                            // 番号正则
                            const codeRegex = /[A-Z]{2,5}-\d{2,5}/;

                            // 过滤掉含番号的，并保留包含名字的
                            const candidates = [...allLinks].filter(a => {
                                const t = a.textContent.replace(/\s+/g, '');
                                return !codeRegex.test(t) && t.includes(name);
                            });

                            // 优先找完全相等，没有就取第一个
                            const link = candidates.find(a => a.textContent.replace(/\s+/g, '') === name) || candidates[0] || null;

                            // 如果链接不存在，返回null
                            if (!link) {
                                return resolve(null);
                            }

                            // 拼接完整URL（相对路径转绝对路径）
                            const fullUrl = new URL(link.getAttribute('href'), 'https://www.xb1.com').href;

                            GM_xmlhttpRequest({
                                url: fullUrl,
                                method: 'GET',
                                onload: function (res2) {
                                    if (res2.status !== 200) return resolve(null);

                                    try {
                                        const doc2 = new DOMParser().parseFromString(res2.responseText, 'text/html');

                                        // 从 meta 中提取资料
                                        const descMeta = doc2.querySelector('meta[property="og:description"]');
                                        const imgMeta = doc2.querySelector('meta[property="og:image"]');

                                        // 解析基本资料字段
                                        let birthday = null, age = null, height = null, cup = null, image = null;

                                        if (descMeta) {
                                            const desc = descMeta.getAttribute('content');

                                            // 使用 _parseBirthdayAndAge方法 提取生日并计算年龄
                                            ({ birthday, age } = self._parseBirthdayAndAge(desc));

                                            // 使用 _parseBodySpecs 解析三围和罩杯, 身高
                                            const bodySpecs = self._parseBodySpecs(desc);
                                            if (bodySpecs.cup) cup = bodySpecs.cup;
                                            if (bodySpecs.height) height = bodySpecs.height;
                                        }

                                        // 图片
                                        if (imgMeta) {
                                            image = imgMeta.getAttribute('content');
                                        }

                                        resolve({
                                            source: 'xb1',
                                            name,
                                            birthday,
                                            age,
                                            height,
                                            cup,
                                            image
                                        });
                                    } catch (err) {
                                        console.warn('解析 xb1 详情页失败:', err);
                                        resolve(null);
                                    }
                                },
                                onerror: () => resolve(null)
                            });
                        } catch (err) {
                            console.warn('解析 xb1 搜索页失败:', err);
                            resolve(null);
                        }
                    },
                    onerror: () => resolve(null)
                })
            })
        }

        /**
         * 从 javrate 抓取女优信息。
         * @param {string} name - 女优名称。
         * @returns {Promise<Object|null>}
         */
        async fetchFromJavrate(name) {
            return new Promise((resolve) => {
                // https://www.javrate.com/search/%E5%A5%B3%E5%84%AA/%E6%AD%A6%E7%94%B0%E6%80%9C%E9%A6%99
                const searchUrl = `https://www.javrate.com/search/%E5%A5%B3%E5%84%AA/${encodeURIComponent(name)}`;

                const self = this; // 保存 this

                GM_xmlhttpRequest({
                    url: searchUrl,
                    method: 'GET',
                    headers: {
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
                        'Referer': 'https://www.javrate.com/',
                    },
                    onload: function (response) {
                        if (response.status !== 200) return resolve(null);

                        try {
                            const doc = new DOMParser().parseFromString(response.responseText, 'text/html');

                            // 搜索结果页，找到演员列表
                            const actorListEle = doc.querySelector('.body-root > section.body-container > section.actor-grid > .actor-card');

                            // 如果演员列表元素不存在，或存在但无任何子元素和内容，则返回null（表示无数据）
                            if (!actorListEle || (actorListEle.children.length === 0 && actorListEle.innerHTML.trim() === '')) return resolve(null);

                            // 取第一个演员项
                            const firstActorLink = actorListEle.firstElementChild;

                            // 如果没有找到，返回null
                            if (!firstActorLink) return resolve(null);

                            // 拼接完整URL（相对路径转绝对路径）
                            const fullUrl = new URL(firstActorLink.getAttribute('href'), 'https://www.javrate.com/').href;

                            // 进入演员详情页
                            GM_xmlhttpRequest({
                                url: fullUrl,
                                method: 'GET',
                                onload: function (res2) {
                                    if (res2.status !== 200) return resolve(null);

                                    try {
                                        const doc2 = new DOMParser().parseFromString(res2.responseText, 'text/html');

                                        // 取得演员信息区域
                                        const actorInfo = doc2.querySelector('.actor-info > article.actor-info-box');

                                        // 解析基本资料字段
                                        let birthday = null, age = null, height = null, cup = null, image = null;

                                        // 女优头像照片
                                        const imgEl = actorInfo.firstElementChild.querySelector('div > img');
                                        if (imgEl) image = imgEl.src;

                                        // 演员详细信息
                                        const infoRows = actorInfo.querySelector('section');

                                        // 生日 & 年龄
                                        const birthdayRow = self._findRowByTitle(infoRows, "生日");
                                        if (birthdayRow) {
                                            birthday = birthdayRow.querySelector('h4')?.textContent.trim();
                                            age = self._extractNumber(birthdayRow.querySelector('span')?.textContent.trim());
                                        }

                                        // 身高
                                        const heightRow = self._findRowByTitle(infoRows, "身長");
                                        if (heightRow) height = self._extractNumber(heightRow.querySelector('h4')?.textContent.trim());

                                        // 罩杯
                                        const cupRow = self._findRowByTitle(infoRows, "罩杯");
                                        if (cupRow) cup = cupRow.querySelector('h4')?.textContent.trim();

                                        resolve({
                                            source: 'javrate',
                                            name,
                                            birthday,
                                            age,
                                            height,
                                            cup,
                                            image
                                        });
                                    } catch (err) {
                                        console.warn('解析 javrate 详情页失败:', err);
                                        resolve(null);
                                    }
                                },
                                onerror: () => resolve(null)
                            });
                        } catch (err) {

                        }
                    },
                    onerror: () => resolve(null)
                })
            });
        }

        /**
         * 从 XSList 搜索页面抓取女优信息。
         * @param {string} name - 女优名称。
         * @returns {Promise<Object|null>}
         */
        async fetchFromXSList(name) {
            return new Promise((resolve) => {
                const url = 'https://xslist.org/search?query=' + encodeURIComponent(name);

                GM_xmlhttpRequest({
                    method: 'GET',
                    headers: {
                        'Cookie': 'cf_clearance=fptXTTN8FE.IY1htTYY3SxpXotCz2.gl2e1DyEhKxRI-1757420495-1.2.1.1-aaDzvjJSdM4WMTGYmYajnHvBt2rszcNkz3i46vDgb.P4QWMvGiTeAD8PZ9T0Reknd_80f12bJb45_.VE1t8FHI0uhw80b29roBSwypFBmCCp6aLuC3seR8AIHgi.w2k6MJGkOLoUOZdnERczCgqkNho70AfX5_V.Z90cMeWqDoS8Henis_aNLsD4wZE9TsDUkpm54UpflRcB9ZU5C5oLFv0ga0kgVnO0ufdqEuGomYg', // 替换为最新值
                    },
                    url,
                    onload: (response) => {
                        if (response.status !== 200) return resolve(null);

                        try {
                            const doc = new DOMParser().parseFromString(response.responseText, 'text/html');
                            const resultItem = doc.querySelector('ul.r > li');
                            if (!resultItem) return resolve(null);

                            const a = resultItem.querySelector('h3 a');
                            const img = resultItem.querySelector('img');
                            const p = resultItem.querySelector('p');

                            if (!a || !p) return resolve(null);

                            const title = a.getAttribute('title') || '';
                            const [, zhName] = title.split(' - ');
                            const image = img?.src || null;

                            const text = p.textContent;

                            // 使用 _parseBirthdayAndAge方法 提取生日并计算年龄
                            const { birthday, age } = this._parseBirthdayAndAge(text);

                            // 身高
                            const heightMatch = text.match(/Measurements:.*?B(\d{2,3})/);
                            const height = heightMatch ? heightMatch[1] : null;

                            // 罩杯
                            const cupMatch = text.match(/Cup Size:\s*([A-Z])/i);
                            const cup = cupMatch ? cupMatch[1].toUpperCase() : null;

                            resolve({
                                source: 'xslist-search',
                                name: zhName || name,
                                birthday,
                                age,
                                height,
                                cup,
                                image
                            });
                        } catch (err) {
                            console.warn('解析 XSList 搜索页面失败:', err);
                            resolve(null);
                        }
                    },
                    onerror: () => resolve(null)
                });
            });
        }

        /**
         * 并行从多个数据源获取女优信息并合并结果
         *
         * @typedef {Object} ActorInfo
         * @property {string} name - 演员姓名
         * @property {string} source - 数据源标识（逗号分隔）
         * @property {string|null} birthday - 生日（YYYY-MM-DD格式）
         * @property {number|null} age - 年龄（自动计算）
         * @property {string|number|null} height - 身高（单位cm）
         * @property {string|null} cup - 罩杯（大写字母）
         * @property {string} image - 图片URL（保证必有值）
         * @param {string|string[]} names - 单个名字或名字数组
         * @returns {Promise<ActorInfo>} 标准化的演员信息
         */
        async fetchActressInfoFromSources(names) {

            const nameList = Array.isArray(names) ? names : [names];

            const sources = [
                this.fetchFromMissAV.bind(this),
                this.fetchFromJavrate.bind(this),
                this.fetchFromWikipedia_ja.bind(this),
                this.fetchFromWikipedia_zh.bind(this),
                this.fetchFromAvWikiInfo.bind(this),
                this.fetchFromXB1.bind(this),
                this.fetchFromXSList.bind(this)
            ];

            console.group('[fetchActressInfoFromSources] START');
            console.log('待查询名字列表:', nameList);

            for (const name of nameList) {

                console.group(`👤 查询名字: ${name}`);
                console.time(`⏱ ${name} 总耗时`);

                try {

                    const settledResults = await Promise.allSettled(
                        sources.map(fn => {

                            const sourceName = fn.name
                                .replace('bound ', '')
                                .replace('fetchFrom', '');

                            console.log(`➡️ [${name}] 调用数据源: ${sourceName}`);

                            // ⚠️ 核心：所有数据源都包一层超时保护
                            return this._withTimeout(
                                fn(name)
                                    .then(result => {
                                        if (!result) {
                                            console.warn(`⚠️ [${name}] ${sourceName} 返回 null`);
                                            return null;
                                        }

                                        console.log(`✅ [${name}] ${sourceName} 成功`, result);

                                        return {
                                            ...result,
                                            source: result.source || sourceName
                                        };
                                    })
                                    .catch(err => {
                                        console.error(`❌ [${name}] ${sourceName} 抛错`, err);
                                        return null;
                                    }),
                                15000, // ⏱ 超时 15 秒
                                sourceName,
                                name
                            );
                        })
                    );

                    console.log(`📦 [${name}] allSettled 原始结果:`, settledResults);

                    const results = settledResults
                        .filter(r => r.status === 'fulfilled' && r.value)
                        .map(r => r.value);

                    console.log(`🎯 [${name}] 有效结果数量: ${results.length}`);
                    console.table(results);

                    if (!results.length) {
                        console.warn(`🚫 [${name}] 所有数据源无结果，尝试下一个名字`);
                        console.timeEnd(`⏱ ${name} 总耗时`);
                        console.groupEnd();
                        continue;
                    }

                    const merged = {
                        name,
                        source: '',
                        birthday: null,
                        age: null,
                        height: null,
                        cup: null,
                        image: null
                    };

                    console.group(`🧩 [${name}] 合并字段`);

                    for (const r of results) {

                        console.group(`来源: ${r.source}`);

                        if (!merged.image && r.image && !this._isDefaultImage(r.image)) {
                            merged.image = r.image;
                            console.log('🖼 image ←', r.image);
                        }

                        if (!merged.birthday && r.birthday) {
                            merged.birthday = r.birthday;
                            console.log('🎂 birthday ←', r.birthday);
                        }

                        if (!merged.age && r.age) {
                            merged.age = r.age;
                            console.log('🔢 age ←', r.age);
                        }

                        if (!merged.height && r.height) {
                            merged.height = r.height;
                            console.log('📏 height ←', r.height);
                        }

                        if (!merged.cup && r.cup) {
                            merged.cup = r.cup;
                            console.log('👙 cup ←', r.cup);
                        }

                        console.groupEnd();
                    }

                    console.groupEnd();

                    merged.source = [...new Set(results.map(r => r.source))].join(',');

                    if (!merged.image) {
                        merged.image = this.getDefaultImage();
                        console.warn('🖼 使用默认图片');
                    }

                    console.log(`✅ [${name}] 最终合并结果`, merged);

                    console.timeEnd(`⏱ ${name} 总耗时`);
                    console.groupEnd();
                    console.groupEnd();

                    return merged;

                } catch (err) {
                    console.error(`🔥 [${name}] 查询异常，继续下一个`, err);
                    console.timeEnd(`⏱ ${name} 总耗时`);
                    console.groupEnd();
                }
            }

            console.warn(`❌ 查询结束：${nameList} 未查询到有效数据`);

            console.groupEnd();

            return {
                name: nameList[0],
                source: '',
                birthday: null,
                age: null,
                height: null,
                cup: null,
                image: this.getDefaultImage()
            };
        }

        /**
         * 判断 info 对象是否包含完整信息（年龄、身高、罩杯）。
         * @param info
         * @returns {boolean}
         */
        isCompleteInfo(info) {
            return info && info.age && info.height && info.cup;
        }

        /**
         * 从给定的名字列表中异步获取女优信息。
         *
         * @param {Array<string>} names - 包含女优姓名的字符串数组。
         * @returns {Promise<Object>} - 返回获取到的女优信息对象。如果所有尝试失败，返回默认数据。
         *
         * 过程说明：
         * - 尝试从多个来源获取每个名字的详细信息。
         * - 若成功获取完整信息，则立即返回。
         * - 若获取不完整，则记录错误信息并继续尝试。
         * - 若所有尝试均失败，则返回已有最完整的结果或默认数据。
         */
        async fetchFromNameList(names) {

            const errors = []; // 收集所有错误用于调试
            const candidates = []; // 保存每个名字的合并结果

            for (const [index, name] of names.entries()) {
                try {
                    console.log(`%c[开始尝试第 ${index + 1} 个名称: ${name}]`, 'background: #f25a47; color: white;');
                    const info = await this.fetchActressInfoFromSources(name);

                    // 收集每个名字的结果
                    candidates.push(info);

                    if (this.isCompleteInfo(info)) {
                        console.log(`%c[成功获取${name}信息]`, 'background: #43b244; color: white;');
                        return info; // 成功时直接返回
                    }

                    // 记录不完整的结果用于调试
                    errors.push({ name, reason: 'incomplete_info', info });
                } catch (err) {
                    console.warn(`[尝试 ${index + 1}/${names.length}] 失败:`, err);
                    errors.push({ name, reason: 'fetch_error', error: err });
                }
            }

            // 如果没有完全信息，则返回“最完整”的已有数据
            if (candidates.length) {
                // 按已填字段数量排序，选出信息最完整的
                candidates.sort((a, b) => {

                    // 需要比较的字段（图片 + 四个基础信息）
                    const fields = ['birthday','age','height','cup','image'];

                    /**
                     * 计算某个对象的“信息完整度”
                     * - 生日 / 年龄 / 身高 / 罩杯：只要有值就算 1 分
                     * - 图片：必须存在且不是默认图才算 1 分
                     */
                    const countFields = obj => fields.filter(f => {
                        if (f === 'image') {
                            // 默认图不计分，避免干扰排序
                            return obj.image && !this._isDefaultImage(obj.image);
                        }
                        return obj[f];
                    }).length;

                    // 排序规则：信息越多的排在前面
                    return countFields(b) - countFields(a);
                });

                const best = candidates[0];
                console.warn('所有尝试未能获取完整信息，返回已有最完整数据', best);
                return best;
            }

            // fallback: 所有名字都完全失败
            console.warn('所有尝试失败，返回默认数据', errors);
            return {
                name: names[0],
                source: '',
                birthday: null,
                age: null,
                height: null,
                cup: null,
                image: this.getDefaultImage()
            };
        }

        // 更新页面：在 .profile 区域展示信息
        updateProfile(info) {
            const profile = document.querySelector('.profile');
            if (!profile) return;

            profile.innerHTML = `
                <img src="${info.image}" alt="头像" class="avatar">
                <div class="info">
                  <div>姓名：<span id="name">${info.name}</span></div>
                  <div>年龄：<span id="age">${info.age ?? '未收录'}</span></div>
                  <div>身高：<span id="height">${info.height ? info.height + 'cm' : '未收录'}</span></div>
                  <div>罩杯：<span id="cup">${info.cup ?? '未收录'}</span></div>
                </div>
            `;
        }

        // 辅助函数 start
        /**
         * 从 infobox 提取可靠头像图片
         * @param {HTMLElement} infoBox
         * @returns {string|null} 图片 URL
         */
        _extractInfoBoxImage(infoBox) {
            if (!infoBox) return null;

            const imgEls = infoBox.querySelectorAll('img');
            for (const img of imgEls) {
                const src = img.getAttribute('src');
                if (!src) continue;

                const fullSrc = src.startsWith('http') ? src : 'https:' + src;

                // 必须来自 Commons 缩略图，且 jpg/png
                const isFromCommons = fullSrc.includes('upload.wikimedia.org/wikipedia/commons/thumb/');
                const isValidExt = /\.(jpg|jpeg|png)$/i.test(fullSrc);
                if (!isFromCommons || !isValidExt) continue;

                // 排除可能签名、logo、旗帜、图标、彩纸等无关图片
                const junkPatterns = [
                    /\/(Flag_of_|Heart_|Maza_sirdute|Icon_|Commons_|Wiki|Wikiquote|Wikidata|Wikisource)/i,
                    /signature|autograph|colored_paper|logo|symbol|icon|seal|stamp/i,
                    /\.svg$/i
                ];

                const isJunk = junkPatterns.some(re => re.test(fullSrc));
                if (isJunk) continue;

                // 找到合适图片
                return fullSrc;
            }

            return null;
        }

        /**
         * 解析生日和年龄信息
         *
         * 支持多种日期格式：
         * 1. YYYY-MM-DD (如 "2020-05-12")
         * 2. YYYY/MM/DD (如 "2020/05/12")
         * 3. 中文日期格式 (如 "2020年5月12日")
         * 4. 英文格式 (如 "born on 05/12/2020")
         *
         * 会自动计算当前年龄（基于当前日期）
         *
         * @param {string} text - 包含生日信息的文本
         * @returns {Object} 包含以下字段的对象:
         *   - birthday {string|null} 格式化的生日(YYYY-MM-DD)，解析失败返回null
         *   - age {number|null} 计算出的年龄，解析失败返回null
         */
        _parseBirthdayAndAge(text) {
            let birthday = null;
            let age = null;

            // 常见的日期格式正则
            const patterns = [
                /(\d{4})-(\d{1,2})-(\d{1,2})/, // 2020-05-12
                /(\d{4})\/(\d{1,2})\/(\d{1,2})/, // 2020/05/12
                /(\d{4})年(\d{1,2})月(\d{1,2})日?/, // 2020年5月12日
                /born on (\d{1,2})\/(\d{1,2})\/(\d{4})/, // born on 05/12/2020
            ];

            for (const re of patterns) {
                const m = text.match(re);
                if (m) {
                    let y, mth, d;
                    if (re === patterns[3]) {
                        // born on MM/DD/YYYY
                        [ , mth, d, y ] = m;
                    } else {
                        [ , y, mth, d ] = m;
                    }

                    // 格式化日期 YYYY-MM-DD
                    birthday = `${y}-${String(mth).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

                    // 计算年龄
                    const birthDate = new Date(+y, +mth - 1, +d);
                    const now = new Date();
                    age = now.getFullYear() - birthDate.getFullYear();
                    if (now < new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate())) {
                        age--;
                    }
                    break;
                }
            }

            return { birthday, age };
        }

        /**
         * 解析身体规格数据（身高、胸围、腰围、罩杯）
         *
         * 支持多种格式：
         * 1. 身高单独匹配：T / Height / 身長 / 身高 (如 "T160" 或 "身高: 165cm")
         * 2. B/W罩杯格式：B100(I) W60 或 B92(Oカップ) W56
         * 3. 三围格式：100-60-100 或 三围: 90-60-90
         * 4. 日式连字符格式：T162-B100-W69-H92
         * 5. 日式斜杠格式：T156 / B86(Dカップ) / W56 / H85
         *
         * 当未明确罩杯时，会根据胸围和腰围自动估算罩杯尺寸
         *
         * @param {string} raw - 包含身体规格的原始字符串
         * @returns {Object} 解析结果对象，可能包含:
         *   - height {number} 身高(cm)
         *   - bust {number} 胸围(cm)
         *   - waist {number} 腰围(cm)
         *   - cup {string} 罩杯尺寸(大写字母)
         */
        _parseBodySpecs(raw = "") {
            let height = null, bust = null, waist = null, cup = null;

            // 定义所有匹配规则
            const patterns = [
                {
                    // 匹配身高：T / Height / 身長 / 身高，带可选冒号
                    re: /(?:T|Height|身長|身高)[:：]?\s*(\d{2,3})/i,
                    apply: (m) => { if (!height) height = +m[1]; }
                },
                {
                    // 匹配 B/W 明确罩杯：B100(I) W60、B92(Oカップ) W56、B:90（H）W:67
                    re: /B\s*[:：]?\s*(\d{2,3})\s*(?:cm)?\s*[（(]?([A-Za-z])(?:カップ)?[)）]?\s*W\s*[:：]?\s*(\d{2,3})\s*(?:cm)?/i,
                    apply: (m) => { bust = +m[1]; if (m[2]) cup = m[2].toUpperCase(); waist = +m[3]; }
                },
                {
                    // 匹配三围数字格式：100-60-100 或 87 - 60 - 94 cm
                    re: /三围[:：]?\s*(\d{2,3})\s*-\s*(\d{2,3})\s*-\s*(\d{2,3})/i,
                    apply: m => { bust = +m[1]; waist = +m[2]; }
                },
                {
                    // 匹配 "三围: B88 / W59 / H90" 或 "B88-W59-H90"
                    re: /三围[:：]?\s*B(\d{2,3})\s*[\/-]\s*W(\d{2,3})\s*[\/-]\s*H(\d{2,3})/i,
                    apply: (m) => { bust = +m[1]; waist = +m[2]; }
                },
                {
                    // 日文连字符风格：T162-B100-W69-H92
                    re: /T(\d{2,3})-B(\d{2,3})-W(\d{2,3})/i,
                    apply: (m) => { height = +m[1]; bust = +m[2]; waist = +m[3]; }
                },
                {
                    // 日文斜杠/空格风格：T156 / B86(Dカップ) / W56 / H85
                    re: /T(\d{2,3})\s*\/?\s*B(\d{2,3})\s*\(?([A-Za-z])?(?:カップ)?\)?\s*\/?\s*W(\d{2,3})/i,
                    apply: (m) => { height = +m[1]; bust = +m[2]; if (m[3]) cup = m[3].toUpperCase(); waist = +m[4]; }
                },
                {
                    // 日文空格风格，括号罩杯可选：T157 B86(E) W56 H89
                    re: /T(\d{2,3})\s*B(\d{2,3})\s*\(?([A-Za-z])?(?:カップ)?\)?\s*W(\d{2,3})/i,
                    apply: m => { height = +m[1]; bust = +m[2]; if (m[3]) cup = m[3].toUpperCase(); waist = +m[4]; }
                },
                {
                    // 匹配 “Ｂ/Ｗ/Ｈ”：Ｂ88cm Ｗ61cm Ｈ88cm
                    re: /[BＢ]\s*(\d{2,3})\s*cm?\s*[WＷ]\s*(\d{2,3})\s*cm?/i,
                    apply: (m) => { bust = +m[1]; waist = +m[2]; }
                },
                {
                    // 匹配 B90cm（Fcup）-W62cm-H91cm 这种格式
                    re: /B\s*(\d{2,3})\s*cm?\s*[（(]?([A-Za-z])(?:cup)?[)）]?\s*-\s*W\s*(\d{2,3})/i,
                    apply: (m) => { bust = +m[1]; cup = m[2].toUpperCase(); waist = +m[3]; }
                },
                {
                    // 匹配 "158cm / 35F - 24 - 35" 或者 "158cm/35F-24-35"
                    re: /(\d{3})cm\s*\/\s*(\d{2,3})([A-Za-z])?\s*-\s*(\d{2,3})\s*-\s*(\d{2,3})/i,
                    apply: (m) => { height = +m[1]; bust = +m[2]; if (m[3]) cup = m[3].toUpperCase(); waist = +m[4]; }
                },
                {
                    // 匹配 "31C - 21 - 32" 或者 "31C-21-32"
                    re: /(\d{1,3})([A-Za-z])\s*-\s*(\d{2,3})\s*-\s*(\d{2,3})/i,
                    apply: (m) => { bust = +m[1]; cup = m[2].toUpperCase(); waist = +m[3]; }
                }
            ];

            // 循环匹配规则
            for (const { re, apply } of patterns) {
                const match = raw.match(re);
                if (match) {
                    apply(match);
                }
            }

            console.log("明确罩杯: ", cup);

            // 如果没有明确罩杯，但有 bust 和 waist，尝试估算
            if (!cup && bust) {
                let underGuess = waist ? waist + 10 : bust * 0.85; // 经验公式
                console.log("估算下胸围:", underGuess);
                underGuess = Math.max(60, Math.min(100, Math.round(underGuess))); // 限制在60-100cm范围
                const diff = bust - underGuess;
                const cupSizes = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                const index = Math.round((diff - 10) / 2.5); // A=10cm起点
                if (index >= 0 && index < cupSizes.length) cup = cupSizes[index] + " (估算) ";
            }

            console.log('%c解析三围数据:', 'background: #209cee; color: white;', raw, { height, bust, waist, cup });

            // 返回结果
            const res = {};
            if (height) res.height = height;
            if (bust) res.bust = bust;
            if (waist) res.waist = waist;
            if (cup) res.cup = cup;
            return res;
        }

        /**
         * 匹配当前网站的配置。
         * 根据当前页面的主机名，在 `siteConfigs` 中查找匹配的站点配置。
         *
         * @return {Object|null} 返回匹配的站点配置对象，如果未找到则返回 null。
         */
        _matchSiteConfig() {
            const host = window.location.hostname;
            for (const site in this.siteConfigs) {
                if (host.includes(site)) {
                    return this.siteConfigs[site];
                }
            }
            console.warn("未找到匹配的站点配置:", host);
            return null;
        }

        /**
         * 在指定的 section 中查找包含指定关键字的 row 元素
         * @param {Element} section 容器元素
         * @param {string} keyword 关键字
         * @returns 返回匹配到的元素或 undefined
         */
        _findRowByTitle(section, keyword) {
            return Array.from(section.querySelectorAll('.row'))
                .find(row => row.querySelector('h3')?.textContent.includes(keyword));
        }

        /**
         * 字符串转数字
         * @param {string} str 输入字符串
         * @returns {number|null} 整数或 null
         */
        _extractNumber(str) {
            const match = str.match(/\d+/);
            return match ? parseInt(match[0], 10) : null;
        }

        /**
         * 为异步操作添加超时控制
         *
         * @param {Promise} promise - 原始Promise
         * @param {number} ms - 超时时间(ms)
         * @param {string} sourceName - 数据源标识
         * @param {string} name - 查询名称（用于日志）
         * @returns {Promise} 超时返回null，否则返回原始结果
         *
         * @example
         * await _withTimeout(apiCall(), 5000, "API", "三上悠亚");
         */
        _withTimeout(promise, ms, sourceName, name) {

            let timerId;

            const timeoutPromise = new Promise(resolve => {
                timerId = setTimeout(() => {
                    console.warn(`⏱️ [${name}] ${sourceName} 超时 ${ms}ms`);
                    resolve(null);
                }, ms);
            });

            return Promise.race([
                promise.finally(() => {
                    // ⭐ 关键：一旦真实 promise 结束，立刻清掉定时器
                    clearTimeout(timerId);
                }),
                timeoutPromise
            ]);
        }
        // 辅助函数 end

        // 初始化入口
        init() {
            // 1) 样式
            this.applyStyles();

            // 2) 数据采集
            this.collectPageData();

            // 3) 依据是否符合条件继续执行
            if (!this.titleElement || this.imgElements.length === 0 ||
                !this.titleElement.textContent.match(/[A-Z]{2,}-\d{2,}/i)) {
                console.error('未找到标题、图片或番号，脚本停止执行。');
                return;
            }

            // 4) 构建面板、初始化面板状态、切换按钮、复制按钮
            this.createPanel();
            this.initPanelState()
            this.createToggleButton();
            this.setupCopyLogic();

            console.log('面板信息:', {
                "panel": this.panel,
                "toggleBtn": this.toggleBtn,
                "panelVisible": this.panelVisible
            });

            // 5) 抓取并更新信息
            this.fetchFromNameList(this.names)
                .then(info => {
                    console.log('[女优信息🕵️]:', info);
                    this.updateProfile(info);
                })
                .catch(err => {
                    console.error('获取女优信息失败:', err);
                    const profile = document.querySelector('.profile');
                    if (profile) {
                        profile.innerHTML = `
                          <h4 style="text-align: center; color: #000; font-size: 14px; margin: 0;">
                            获取女优信息失败
                          </h4>
                        `;
                    }
                });
        }

    }

    // 启动
    const app = new ActressInfoPanel();
    app.init();
})();
