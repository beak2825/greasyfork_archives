// ==UserScript==
// @name         简篇助手
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  简篇网站账号切换与媒体提取工具
// @author       Your name
// @match        https://www.jianpian.cn/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519964/%E7%AE%80%E7%AF%87%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/519964/%E7%AE%80%E7%AF%87%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const STYLES = {
        floatingWindow: `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 320px;
            height: 500px;
            background: rgba(255, 255, 255, 0.98);
            border-radius: 12px;
            padding: 15px;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            transition: all 0.3s ease;
            display: flex;
            flex-direction: column;
        `,
        tabs: `display: flex; margin-bottom: 15px; border-bottom: 1px solid #eee;`,
        tab: `padding: 8px 16px; cursor: pointer; border-bottom: 2px solid transparent; color: #666; transition: all 0.3s ease;`,
        activeTab: `color: #2c5282; border-bottom: 2px solid #2c5282;`,
        button: `
            background: #4299e1 !important;
            color: white !important;
            border: none !important;
            padding: 8px 12px !important;
            border-radius: 4px !important;
            cursor: pointer !important;
            font-size: 13px !important;
            font-weight: 500 !important;
            transition: all 0.2s ease !important;
            width: 100% !important;
            height: auto !important;
            line-height: 1.5 !important;
            box-sizing: border-box !important;
            margin: 0 !important;
            text-align: center !important;
            display: block !important;
        `,
        content: `height: 100%; overflow-y: auto; padding: 10px;`,
        minimizeButton: `
            position: absolute;
            top: 15px;
            right: 15px;
            width: 20px;
            height: 20px;
            line-height: 20px;
            text-align: center;
            cursor: pointer;
            font-size: 16px;
            color: #666;
            transition: all 0.3s ease;
        `,
        minimized: `
            position: fixed;
            top: 20%;
            right: 20px;
            width: auto;
            height: auto;
            padding: 10px 15px;
            background: rgba(255, 255, 255, 0.98);
            border-radius: 12px;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            cursor: pointer;
            transition: all 0.3s ease;
        `,
        modal: `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `,
        modalContent: `
            background: white;
            padding: 20px;
            border-radius: 12px;
            max-width: 400px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
        `,
        accountItem: `
            padding: 12px;
            margin: 8px 0;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
        `
    };

    const ESSENTIAL_COOKIES = ['epian-token', 'epian-user-id'];

    const MediaStore = {
        items: new Map(),

        clear() {
            this.items.clear();
        },

        add(type, url, posterUrl = null) {
            const processedUrl = type === '图片' ? reformatImageUrl(url) : url;
            if (this.items.has(processedUrl)) return false;

            this.items.set(processedUrl, {
                type,
                url: processedUrl,
                posterUrl,
                bbcode: this.generateBBCode(type, processedUrl, posterUrl)
            });
            return true;
        },

        generateBBCode(type, url, posterUrl = null) {
            switch(type) {
                case '图片':
                    return `[img]${url}[/img]`;
                case '音频':
                    return `[audio]${url}[/audio]`;
                case '视频':
                    return `[movie]${url}[/movie]`; // 基础BBCode不包含封面
            }
        },

        getAllUrls() {
            return Array.from(this.items.keys());
        },

        getAllBBCode() {
            return Array.from(this.items.values()).map(item => {
                // 普通BBCode永远不包含封面
                return this.generateBBCode(item.type, item.url);
            });
        },

        getAllBBCode2() {
            return Array.from(this.items.values()).map(item => {
                // BBCode2 仅在视频类型且有封面时才包含封面
                if (item.type === '视频' && item.posterUrl) {
                    return `[movie]${item.url}|${item.posterUrl}[/movie]`;
                }
                return this.generateBBCode(item.type, item.url);
            });
        },

        getItem(url) {
            return this.items.get(url);
        },

        size() {
            return this.items.size;
        }
    };

    function isValidUrl(url) {
        return url && (
            url.startsWith('https://media-volc.jianpian.info/') ||
            url.startsWith('https://img-volc.jianpian.info/')
        );
    }

    function reformatImageUrl(url) {
        if (!url.startsWith('https://img-volc.jianpian.info/')) return url;
        const match = url.match(/https:\/\/img-volc\.jianpian\.info\/([^?~]+)/);
        if (!match) return url;

        const filePath = match[1];
        if (filePath.includes('__transed__')) {
            const [basePath, extension] = filePath.split('__transed__');
            return `https://img-volc.jianpian.info/${basePath}.${extension.split('.')[0]}`;
        }
        return url;
    }

    function updateButtonState(button, originalText, duration = 1000) {
        button.textContent = '已复制';
        setTimeout(() => button.textContent = originalText, duration);
    }

    const MEDIA_STYLES = {
        container: `
            margin: 0 0 15px 0;
            padding: 12px;
            background: #f8f9fa;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
        `,
        typeLabel: (type) => `
            display: inline-block;
            padding: 2px 8px;
            background: ${
                type === '视频' ? '#3182ce' : 
                type === '音频' ? '#38a169' : 
                '#805ad5'
            };
            color: white;
            border-radius: 4px;
            font-size: 12px;
            margin-bottom: 8px;
        `,
        url: `
            font-size: 14px;
            color: #4a5568;
            word-break: break-all;
            margin-bottom: 12px;
            line-height: 1.5;
            font-family: monospace;
        `,
        buttonGroup: `
            display: flex;
            gap: 10px;
        `
    };

    function addMediaLink(url, type, posterUrl = null) {
        if (!MediaStore.add(type, url, posterUrl)) return;

        const container = document.getElementById('mediaContent');
        const linkDiv = document.createElement('div');
        const mediaItem = MediaStore.getItem(type === '图片' ? reformatImageUrl(url) : url);
        
        linkDiv.style.cssText = MEDIA_STYLES.container;
        linkDiv.innerHTML = `
            <div style="${MEDIA_STYLES.typeLabel(type)}">${type}</div>
            <div style="${MEDIA_STYLES.url}">${mediaItem.url}</div>
            <div style="${MEDIA_STYLES.buttonGroup}">
                <button class="copy-btn" style="${STYLES.button}">复制链接</button>
                <button class="copy-bbcode-btn" style="${STYLES.button} background: #38a169 !important;">复制BBCode</button>
                ${type === '视频' && posterUrl ? `
                    <button class="copy-bbcode2-btn" style="${STYLES.button} background: #805ad5 !important;">复制BBCode2</button>
                ` : ''}
            </div>
        `;

        const copyBtn = linkDiv.querySelector('.copy-btn');
        const copyBBCodeBtn = linkDiv.querySelector('.copy-bbcode-btn');
        
        copyBtn.onclick = () => {
            navigator.clipboard.writeText(mediaItem.url);
            updateButtonState(copyBtn, '复制链接');
        };

        copyBBCodeBtn.onclick = () => {
            // 普通BBCode永远不包含封面
            navigator.clipboard.writeText(MediaStore.generateBBCode(type, mediaItem.url));
            updateButtonState(copyBBCodeBtn, '复制BBCode');
        };

        if (type === '视频' && posterUrl) {
            const copyBBCode2Btn = linkDiv.querySelector('.copy-bbcode2-btn');
            copyBBCode2Btn.onclick = () => {
                // BBCode2 包含封面
                navigator.clipboard.writeText(`[movie]${mediaItem.url}|${posterUrl}[/movie]`);
                updateButtonState(copyBBCode2Btn, '复制BBCode2');
            };
        }

        container.appendChild(linkDiv);
    }

    function createBatchCopyButtons() {
        const container = document.createElement('div');
        container.style.cssText = MEDIA_STYLES.buttonGroup;
        container.style.padding = '10px';
        container.style.marginBottom = '15px';

        const buttons = [
            ['复制全部链接', () => MediaStore.getAllUrls()],
            ['复制全部BBCode', () => MediaStore.getAllBBCode()],
            ['复制全部BBCode2', () => MediaStore.getAllBBCode2()]
        ];

        buttons.forEach(([text, getter]) => {
            const button = document.createElement('button');
            button.textContent = text;
            button.style.cssText = STYLES.button;
            button.onclick = () => {
                navigator.clipboard.writeText(getter().join('\n'));
                updateButtonState(button, text);
            };
            container.appendChild(button);
        });

        return container;
    }

    const POSTER_URL_REGEX = /url\("([^"]+)"\)/;

    const MediaScanner = {
        scanVideoPosters() {
            const posterMap = new Map();
            document.querySelectorAll('.poster').forEach(poster => {
                const style = poster.getAttribute('style');
                if (style) {
                    const match = style.match(POSTER_URL_REGEX);
                    if (match && isValidUrl(match[1])) {
                        const videoElem = poster.closest('div[class*="video"]')?.querySelector('video');
                        if (videoElem) {
                            const posterUrl = reformatImageUrl(match[1]);
                            posterMap.set(videoElem, posterUrl);
                        }
                    }
                }
            });
            return posterMap;
        },

        scan() {
            try {
                const posterMap = this.scanVideoPosters();

                // 扫描视频
                document.querySelectorAll('video').forEach(video => {
                    if (video.src && isValidUrl(video.src)) {
                        addMediaLink(video.src, '视频', posterMap.get(video));
                    }
                    video.querySelectorAll('source').forEach(source => {
                        if (source.src && isValidUrl(source.src)) {
                            addMediaLink(source.src, '视频', posterMap.get(video));
                        }
                    });
                });

                // 扫描音频
                document.querySelectorAll('audio').forEach(audio => {
                    if (audio.src && isValidUrl(audio.src)) {
                        addMediaLink(audio.src, '音频');
                    }
                    audio.querySelectorAll('source').forEach(source => {
                        if (source.src && isValidUrl(source.src)) {
                            addMediaLink(source.src, '音频');
                        }
                    });
                });

                // 扫描图片
                document.querySelectorAll('img').forEach(img => {
                    if (img.src && isValidUrl(img.src)) {
                        addMediaLink(img.src, '图片');
                    }
                });

                return MediaStore.size();
            } catch (error) {
                console.error('扫描媒体出错:', error);
                throw error;
            }
        }
    };

    function scanMedia() {
        const mediaContent = document.getElementById('mediaContent');
        if (!mediaContent || mediaContent.style.display === 'none') return;
        
        mediaContent.innerHTML = '';
        mediaContent.appendChild(createBatchCopyButtons());
        
        MediaStore.clear();
        
        requestAnimationFrame(() => {
            try {
                const count = MediaScanner.scan();
                if (count === 0) {
                    mediaContent.innerHTML = '<div style="text-align: center; padding: 30px;">未找到媒体文件</div>';
                }
            } catch (error) {
                mediaContent.innerHTML = '扫描媒体时出错，请刷新页面重试';
            }
        });
    }

    function getAccountList(accounts) {
        const accountNames = Object.keys(accounts);
        if (accountNames.length === 0) return null;
        
        return '已保存的账号：\n\n' + accountNames.map(name => {
            const account = accounts[name];
            return `${name}${account.note ? ` (${account.note})` : ''}\n保存时间: ${account.saveDate}`;
        }).join('\n\n');
    }

    function showAccountSelector(accounts, onSelect, title) {
        const modal = document.createElement('div');
        modal.style.cssText = STYLES.modal;
        
        const content = document.createElement('div');
        content.style.cssText = STYLES.modalContent;
        content.innerHTML = `<h3 style="margin: 0 0 16px 0; font-size: 18px;">${title}</h3>`;

        Object.entries(accounts).forEach(([name, account]) => {
            const item = document.createElement('div');
            item.style.cssText = STYLES.accountItem;
            item.innerHTML = `
                <div style="font-weight: 500; color: #2d3748;">${name}</div>
                ${account.note ? `<div style="color: #718096; font-size: 12px;">备注: ${account.note}</div>` : ''}
                <div style="color: #a0aec0; font-size: 12px;">保存时间: ${account.saveDate}</div>
            `;
            item.onmouseover = () => item.style.background = '#f7fafc';
            item.onmouseout = () => item.style.background = 'white';
            item.onclick = () => {
                onSelect(name);
                document.body.removeChild(modal);
            };
            content.appendChild(item);
        });

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '取消';
        closeBtn.style.cssText = STYLES.button;
        closeBtn.onclick = () => document.body.removeChild(modal);
        content.appendChild(closeBtn);

        modal.appendChild(content);
        document.body.appendChild(modal);

        // 点击背景关闭
        modal.onclick = (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        };
    }

    function checkAccounts() {
        const accounts = GM_getValue('accounts', {});
        if (Object.keys(accounts).length === 0) {
            alert('还没有保存任何账号！');
            return null;
        }
        return accounts;
    }

    function switchAccount() {
        const accounts = checkAccounts();
        if (!accounts) return;

        showAccountSelector(accounts, (selectedAccount) => {
            ESSENTIAL_COOKIES.forEach(name => {
                document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.jianpian.cn`;
            });

            accounts[selectedAccount].cookies.split(';').forEach(cookie => {
                document.cookie = `${cookie.trim()}; path=/; domain=.jianpian.cn`;
            });

            location.reload();
        }, '选择要切换的账号');
    }

    function deleteAccount() {
        const accounts = checkAccounts();
        if (!accounts) return;

        showAccountSelector(accounts, (selectedAccount) => {
            if (confirm(`确定要删除账号 "${selectedAccount}" 吗？`)) {
                delete accounts[selectedAccount];
                GM_setValue('accounts', accounts);
                alert('删除成功！');
            }
        }, '选择要删除的账号');
    }

    const BUTTON_CONFIGS = {
        saveCookie: ['保存当前账号', async () => {
            const currentCookies = document.cookie.split(';');
            const essentialCookies = currentCookies.filter(cookie => 
                ESSENTIAL_COOKIES.some(name => cookie.split('=')[0].trim() === name)
            );

            if (essentialCookies.length === 0) {
                alert('未检测到登录状态，请先登录！');
                return;
            }

            const accountName = prompt('请为当前账号设置一个名称：');
            if (!accountName) return;

            const accountNote = prompt('请输入账号备注（可）：');
            const accounts = GM_getValue('accounts', {});
            accounts[accountName] = {
                cookies: essentialCookies.join(';'),
                note: accountNote || '',
                saveDate: new Date().toLocaleString()
            };
            GM_setValue('accounts', accounts);
            alert('保存成功！');
        }],
        switchAccount: ['切换账号', switchAccount],
        deleteAccount: ['删除账号', deleteAccount],
        exportAccounts: ['导出账号', () => {
            const accounts = GM_getValue('accounts', {});
            const blob = new Blob([JSON.stringify(accounts, null, 2)], { type: 'application/json' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = '简篇账号数据.json';
            a.click();
            URL.revokeObjectURL(a.href);
        }],
        importAccounts: ['导入账号', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = e => {
                const reader = new FileReader();
                reader.onload = event => {
                    try {
                        const accounts = JSON.parse(event.target.result);
                        GM_setValue('accounts', accounts);
                        alert('导入成功！');
                    } catch (error) {
                        alert('导入失败，文件格式错误！');
                    }
                };
                reader.readAsText(e.target.files[0]);
            };
            input.click();
        }]
    };

    function createUI() {
        const container = document.createElement('div');
        container.id = 'jianpianHelper';
        container.style.cssText = STYLES.floatingWindow;

        const minimizeBtn = document.createElement('div');
        minimizeBtn.textContent = '−';
        minimizeBtn.style.cssText = STYLES.minimizeButton;
        minimizeBtn.title = '最小化';

        let isMinimized = false;
        minimizeBtn.onclick = (e) => {
            e.stopPropagation();
            isMinimized = !isMinimized;
            
            if (isMinimized) {
                container.innerHTML = '简篇助手';
                container.style.cssText = STYLES.minimized;
                container.title = '点击展开';
                container.onclick = () => {
                    isMinimized = false;
                    container.style.cssText = STYLES.floatingWindow;
                    container.innerHTML = '';
                    setupUI();
                    setupAccountButtons();
                    container.onclick = null;
                };
            }
        };

        function setupUI() {
            const tabs = document.createElement('div');
            tabs.style.cssText = STYLES.tabs;
            
            const [accountTab, mediaTab] = ['账号管理', '媒体提取'].map(text => {
                const tab = document.createElement('div');
                tab.textContent = text;
                tab.style.cssText = STYLES.tab + (text === '账号管理' ? STYLES.activeTab : '');
                return tab;
            });

            tabs.append(accountTab, mediaTab);

            const [accountContent, mediaContent] = ['account', 'media'].map(id => {
                const content = document.createElement('div');
                content.id = `${id}Content`;
                content.style.cssText = STYLES.content + `; display: ${id === 'account' ? 'block' : 'none'};`;
                return content;
            });

            [accountTab, mediaTab].forEach((tab, i) => {
                tab.onclick = () => {
                    [accountTab, mediaTab].forEach((t, j) => 
                        t.style.cssText = STYLES.tab + (i === j ? STYLES.activeTab : '')
                    );
                    accountContent.style.display = i === 0 ? 'block' : 'none';
                    mediaContent.style.display = i === 0 ? 'none' : 'block';
                    if (i === 1) scanMedia();
                };
            });

            container.appendChild(minimizeBtn);
            container.appendChild(tabs);
            container.appendChild(accountContent);
            container.appendChild(mediaContent);
        }

        setupUI();
        return container;
    }

    function setupAccountButtons() {
        const accountContent = document.getElementById('accountContent');
        const accountButtons = document.createElement('div');
        accountButtons.style.cssText = `
            padding: 10px;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
        `;
        
        Object.entries(BUTTON_CONFIGS).forEach(([_, [text, handler]]) => {
            const button = document.createElement('button');
            button.textContent = text;
            button.style.cssText = STYLES.button;
            button.onclick = handler;
            accountButtons.appendChild(button);
        });

        accountContent.appendChild(accountButtons);
    }

    function init() {
        const container = createUI();
        document.body.appendChild(container);
        setupAccountButtons();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

