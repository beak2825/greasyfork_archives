// ==UserScript==
// @name         Fishhawk Redirect
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  跳转到轻小说机翻机器人
// @author       otokoneko
// @license      MIT
// @match        https://kakuyomu.jp/works/*
// @match        https://ncode.syosetu.com/*
// @match        https://novel18.syosetu.com/*
// @match        https://novelup.plus/story/*
// @match        https://syosetu.org/novel/*
// @match        https://www.pixiv.net/novel/series/*
// @match        https://www.pixiv.net/novel/show.php*
// @match        https://www.alphapolis.co.jp/novel/*/*
// @icon         https://n.novelia.cc/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/526089/Fishhawk%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/526089/Fishhawk%20Redirect.meta.js
// ==/UserScript==

(function() {
    const defaultConfig = {
        openInNewWindow: true,
        redirectChapter: true,
        baseUrl: 'https://n.novelia.cc/novel'
    };

    const CONFIG = new Proxy(defaultConfig, {
        get(target, key) {
            if (key in target) {
                return GM_getValue(key, target[key]);
            }
            return undefined;
        },
        set(target, key, value) {
            target[key] = value;
            GM_setValue(key, value);
            return true;
        }
    });

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    GM_registerMenuCommand("设置", () => {
        if (!document.getElementById('fishhawk-settings')) {
            createSettingsPanel();
        }
        toggleSettings();
    });

    const mainButton = createButton();
    document.body.appendChild(mainButton);

    let settingsPanel = null, wrapper = null;

    function createButton() {
        const button = document.createElement('div');
        button.role = 'button';
        button.ariaLabel = 'Redirect to Fishhawk';
        button.tabIndex = 0;
        button.style.cssText = `
            position: fixed;
            bottom: 5%;
            left: ${isMobile ? '10px' : '-30px'};
            z-index: 9999;
            cursor: pointer;
            width: 40px;
            height: 40px;
            transition: ${isMobile ? 'none' : 'left 0.3s ease, opacity 0.3s'};
            opacity: ${isMobile ? '1' : '0.8'};
        `;

        const svg = '<svg version="1.0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" preserveAspectRatio="xMidYMid meet" width="100%" height="100%"><g transform="translate(0,512) scale(0.1,-0.1)" stroke="none" fill="rgb(24, 160, 88)"><path d="M1438 4566 c-65 -34 -120 -64 -123 -67 -2 -3 96 -199 219 -435 l224 -429 -614 -3 -614 -2 0 -400 0 -400 -185 0 -185 0 0 -750 0 -750 185 0 185 0 0 -400 0 -400 2030 0 2030 0 0 400 0 400 185 0 185 0 0 750 0 750 -185 0 -185 0 -2 398 -3 397 -614 3 c-534 2 -612 4 -607 17 3 8 104 204 225 435 l219 420 -124 64 -124 63 -19 -31 c-10 -17 -128 -241 -261 -499 l-243 -467 -481 2 -481 3 -245 470 c-135 259 -252 482 -260 497 l-15 27 -117 -63z m349 -1669 c203 -106 213 -388 18 -498 -187 -105 -416 29 -414 241 1 118 50 199 150 249 59 30 70 32 139 29 43 -3 89 -12 107 -21z m1789 -5 c98 -50 162 -169 151 -279 -23 -224 -292 -330 -461 -182 -62 55 -88 108 -94 192 -8 119 44 213 150 267 58 29 69 31 138 27 50 -2 89 -11 116 -25z m-126 -1372 l0 -280 -890 0 -890 0 0 280 0 280 890 0 890 0 0 -280z"></path></g></svg>';
        button.innerHTML = svg;

        if (!isMobile) {
            let hoverState = false;
            const edgeThreshold = 50;

            const updatePosition = (e) => {
                if (hoverState) return;
                const nearEdge = e.clientX <= edgeThreshold;
                button.style.left = nearEdge ? '10px' : '-30px';
            };

            document.addEventListener('mousemove', (e) => {
                requestAnimationFrame(() => updatePosition(e));
            });

            button.addEventListener('mouseenter', () => {
                hoverState = true;
                button.style.left = '10px';
                button.style.opacity = '1';
            });

            button.addEventListener('mouseleave', (e) => {
                hoverState = false;
                button.style.opacity = '0.8';
                if (e.clientX > edgeThreshold) {
                    button.style.left = '-30px';
                }
            });
        }

        button.addEventListener('click', performRedirect);
        button.addEventListener('keydown', (e) => {
            if (['Enter', ' '].includes(e.key)) performRedirect();
        });

        return button;
    }

    function toggleSettings() {
        if (!settingsPanel) return;

        const isVisible = settingsPanel.style.display === 'block';
        settingsPanel.style.display = isVisible ? 'none' : 'block';

        if (!isVisible) {
            const clickHandler = (e) => {
                if (!wrapper.contains(e.target)) {
                    settingsPanel.style.display = 'none';
                    document.removeEventListener('click', clickHandler);
                }
            };
            setTimeout(() => document.addEventListener('click', clickHandler), 10);
        }
    }

    function createSettingsPanel() {
        wrapper = document.createElement('div');
        const shadowRoot = wrapper.attachShadow({ mode: 'open' });

        settingsPanel = document.createElement('div');
        settingsPanel.id = 'fishhawk-settings';
        settingsPanel.style.cssText = `
            position: fixed;
            bottom: 60px;
            left: 10px;
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 10000;
            display: none;
        `;

        const title = document.createElement('h3');
        title.textContent = 'Fishhawk Redirect 设置';
        title.style.marginTop = '0';

        const newWindowOption = createCheckbox(
            '在新窗口打开',
            CONFIG.openInNewWindow,
            (checked) => {CONFIG.openInNewWindow = checked;}
        );

        const redirectChapterOption = createCheckbox(
            '章节页面直接跳转至章节翻译',
            CONFIG.redirectChapter,
            (checked) => {CONFIG.redirectChapter = checked;}
        );

        const baseUrlInput = document.createElement('div');
        baseUrlInput.innerHTML = `
        <label for="base-url">跳转至</label>
        <input type="text" id="base-url" value="${CONFIG.baseUrl}" />
    `;
        const baseUrlInputElement = baseUrlInput.querySelector('#base-url');
        baseUrlInputElement.addEventListener('input', (event) => {
            CONFIG.baseUrl = event.target.value;
        });

        settingsPanel.append(title, newWindowOption, redirectChapterOption, baseUrlInput);
        shadowRoot.appendChild(settingsPanel);
        document.body.appendChild(wrapper);
    }

    function createCheckbox(label, checked, callback) {
        const container = document.createElement('label');
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.margin = '8px 0';

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = checked;
        input.addEventListener('change', () => callback(input.checked));

        const text = document.createElement('span');
        text.textContent = label;
        text.style.marginLeft = '8px';

        container.append(input, text);
        return container;
    }

    function performRedirect() {
        const newUrl = generateFishhawkUrl();
        if (!newUrl) return;

        if (CONFIG.openInNewWindow) {
            window.open(newUrl, '_blank');
        } else {
            window.location.href = newUrl;
        }
    }

    const rules = {
        kakuyomu: {
            isBook(url) {
                return url.hostname === "kakuyomu.jp" && /^\/works\/\d+$/.test(url.pathname);
            },
            isChapter(url) {
                return url.hostname === "kakuyomu.jp" && /^\/works\/\d+\/episodes\/\d+$/.test(url.pathname);
            },
            mapBook(url) {
                const nid = url.pathname.split('/')[2];
                return `kakuyomu/${nid}`;
            },
            mapChapter(url, redirectChapter) {
                const path = url.pathname.split('/');
                const nid = path[2];
                const cid = path[4];
                return redirectChapter ? `kakuyomu/${nid}/${cid}` : `kakuyomu/${nid}`;
            }
        },
        syosetu: {
            isBook(url) {
                return /^(novel18|ncode).syosetu.com$/.test(url.hostname) && (/^\/n\d{4}[a-z]*\/?$/i.test(url.pathname) || /^\/novelview\/infotop\/ncode\/n\d{4}[a-z]*/i.test(url.pathname));
            },
            isChapter(url) {
                const seriesChapter = /^(novel18|ncode).syosetu.com$/.test(url.hostname) && /^\/n\d{4}[a-z]*\/\d+\/?$/i.test(url.pathname);
                const shortChapter = /^(novel18|ncode).syosetu.com$/.test(url.hostname) && /^\/n\d{4}[a-z]*\/?$/i.test(url.pathname) && document.querySelector('div.p-novel__body');
                return seriesChapter || shortChapter;
            },
            mapBook(url) {
                const path = url.pathname.toLowerCase().split('/');
                const nid = /n\d{4}[a-z]*/.test(path[1]) ? path[1] : path[4];
                return `syosetu/${nid}`;
            },
            mapChapter(url, redirectChapter) {
                const path = url.pathname.toLowerCase().split('/');
                const nid = path[1];
                const cid = path[2] ?? 'default';
                return redirectChapter ? `syosetu/${nid}/${cid}` : `syosetu/${nid}`;
            }
        },
        novelup: {
            isBook(url) {
                return url.hostname === "novelup.plus" && /^\/story\/\d+$/.test(url.pathname);
            },
            isChapter(url) {
                return url.hostname === "novelup.plus" && /^\/story\/\d+\/\d+$/.test(url.pathname);
            },
            mapBook(url) {
                const nid = url.pathname.split('/')[2];
                return `novelup/${nid}`;
            },
            mapChapter(url, redirectChapter) {
                const path = url.pathname.split('/');
                const nid = path[2];
                const cid = path[3];
                return redirectChapter ? `novelup/${nid}/${cid}` : `novelup/${nid}`;
            }
        },
        hameln: {
            isBook(url) {
                return url.hostname === "syosetu.org" && /^\/novel\/\d+\/$/.test(url.pathname);
            },
            isChapter(url) {
                return url.hostname === "syosetu.org" && /^\/novel\/\d+\/\d+\.html$/.test(url.pathname);
            },
            mapBook(url) {
                const id = url.pathname.split('/')[2];
                return `hameln/${id}`;
            },
            mapChapter(url, redirectChapter) {
                const path = url.pathname.split('/');
                const nid = path[2];
                const cid = path[3].replace('.html', '');
                return redirectChapter ? `hameln/${nid}/${cid}` : `hameln/${nid}`;
            }
        },
        pixivSeries: {
            isBook(url) {
                return url.hostname === "www.pixiv.net" && /^\/novel\/series\/\d+$/.test(url.pathname);
            },
            isChapter(url) { return false; },
            mapBook(url) {
                const id = url.pathname.split('/')[3];
                return `pixiv/${id}`;
            },
            mapChapter(url, redirectChapter) { return null; }
        },
        pixivShow: {
            isBook(url) {
                return url.hostname === "www.pixiv.net" && /^\/novel\/show.php$/.test(url.pathname);
            },
            isChapter(url) {
                return url.hostname === "www.pixiv.net" && /^\/novel\/show.php$/.test(url.pathname);
            },
            mapBook(url) {
                const id = url.searchParams.get('id');
                return `pixiv/s${id}`;
            },
            mapChapter(url, redirectChapter) {
                const id = url.searchParams.get('id');
                return redirectChapter ? `pixiv/s${id}/${id}` : `pixiv/s${id}`;
            }
        },
        alphapolis: {
            isBook(url) {
                return url.hostname === "www.alphapolis.co.jp" && /^\/novel\/\d+\/\d+$/.test(url.pathname);
            },
            isChapter(url) {
                return url.hostname === "www.alphapolis.co.jp" && /^\/novel\/\d+\/\d+\/episode\/\d+$/.test(url.pathname);
            },
            mapBook(url) {
                const path = url.pathname.split('/');
                return `alphapolis/${path[2]}-${path[3]}`;
            },
            mapChapter(url, redirectChapter) {
                const path = url.pathname.split('/');
                return redirectChapter ? `alphapolis/${path[2]}-${path[3]}/${path[5]}` : `alphapolis/${path[2]}-${path[3]}`;
            }
        }
    };

    function generateFishhawkUrl() {
        const url = new URL(window.location.href);
        for (const rule of Object.values(rules)) {
            try {
                if (rule.isChapter(url)) {
                    return `${CONFIG.baseUrl}/${rule.mapChapter(url, CONFIG.redirectChapter)}`;
                }
                if (rule.isBook(url)) {
                    return `${CONFIG.baseUrl}/${rule.mapBook(url)}`;
                }
            } catch(e) { console.error(e); }
        }
        return null;
    }
})();