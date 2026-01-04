// ==UserScript==
// @name         Beautify
// @namespace    https://github.com/symant233/PublicTools
// @version      0.1.87
// @description  美化<误>各网页界面
// @author       symant233
// @icon         https://cdn.jsdelivr.net/gh/symant233/PublicTools/Beautify/Bkela.png
// @match        https://*.vuejs.org/*
// @match        https://www.runoob.com/*
// @match        https://blog.csdn.net/*
// @match        https://es6.ruanyifeng.com/*
// @match        https://wenku.baidu.com/*
// @match        https://didi.github.io/cube-ui/*
// @match        https://www.bilibili.com/*
// @match        https://space.bilibili.com/*
// @match        https://cn.bing.com/search?q=*
// @match        https://duckduckgo.com/?q=*
// @match        https://baike.baidu.com/*
// @match        https://yz.chsi.com.cn/sytj/tj/*
// @match        https://www.30secondsofcode.org/*
// @match        https://developer.mozilla.org/*
// @match        https://juejin.cn/editor/drafts/*
// @match        https://xui.ptlogin2.qq.com/cgi-bin/xlogin*
// @match        https://steamcommunity.com/*
// @match        https://www.pixiv.net/*
// @match        https://live.bilibili.com/*
// @match        https://frontendwingman.com/*
// @match        https://cloud.tencent.com/developer/*
// @match        https://www.npmjs.com/*
// @match        https://www.zhihu.com/*
// @match        https://fanyi.baidu.com/*
// @match        https://jiexi.8old.cn/*
// @match        https://read.qidian.com/*
// @match        https://*.taobao.com/*
// @match        https://s.taobao.com/search?q=*
// @match        https://*.tmall.com/*
// @match        https://caddyserver.com/docs/*
// @match        https://leetcode.cn/*
// @match        https://mooc1.chaoxing.com/work/*
// @match        https://mooc1.chaoxing.com/mooc2/work/*
// @match        https://*sci-hub.*/*
// @match        https://scholar.google.com/scholar?q=*
// @match        https://www.dlsite.com/*
// @match        https://preactjs.com/*
// @match        https://*.react.dev/*
// @match        https://basarat.gitbook.io/*
// @match        https://www.photopea.com/*
// @match        https://www.phind.com/*
// @match        https://hd.nowcoder.com/link.html?target=*
// @match        *://www.cesium.xin/*
// @match        https://message.bilibili.com/*
// @match        *://pan.baidu.com/share/*
// @match        https://x.com/*
// @match        https://*.xiaoeknow.com/*
// @match        https://nextjs.org/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @license      GPL-3.0
// @homepageURL  https://greasyfork.org/zh-CN/scripts/390421-beautify
// @supportURL   https://github.com/symant233/PublicTools/issues
// @downloadURL https://update.greasyfork.org/scripts/390421/Beautify.user.js
// @updateURL https://update.greasyfork.org/scripts/390421/Beautify.meta.js
// ==/UserScript==

;(function() {
    'use strict';

    const $ = {
        // 选择器函数
        $(selector) {
            return document.querySelectorAll(selector);
        },
        // 获取第一个匹配元素
        first(selector) {
            return document.querySelector(selector);
        },
        // 通用遍历方法
        each(selector, callback) {
            const elements = this.$(selector);
            for (let i = 0; i < elements.length; i++) {
                callback(elements[i], i);
            }
        },
        // 添加类
        addClass(selector, className) {
            this.each(selector, element => {
                element.classList.add(className);
            });
        },
        // 移除类
        removeClass(selector, className) {
            this.each(selector, element => {
                element.classList.remove(className);
            });
        },
        // 设置属性
        attr(selector, attr, value) {
            this.each(selector, element => {
                element.setAttribute(attr, value);
            });
        },
        // 获取属性
        getAttr(selector, attr) {
            const element = this.first(selector);
            return element ? element.getAttribute(attr) : null;
        },
        // 添加事件监听
        on(selector, event, handler) {
            this.each(selector, element => {
                element.addEventListener(event, handler);
            });
        },
        // 移除元素
        remove(selector) {
            this.each(selector, element => {
                element.remove();
            });
        },
        // 添加HTML
        append(selector, html) {
            const element = this.first(selector);
            if (element) {
                element.insertAdjacentHTML('beforeend', html);
            }
        },
        // 添加元素到指定元素
        appendTo(selector, targetSelector) {
            const element = document.createElement(selector);
            const target = this.first(targetSelector);
            if (target) {
                target.appendChild(element);
            }
            return element;
        },
        // 点击事件
        click(selector) {
            const element = this.first(selector);
            if (element) {
                element.click();
            }
        },
        // 获取子元素
        children(selector) {
            const element = this.first(selector);
            return element ? element.children : [];
        },
        // 获取父元素
        parent(selector) {
            const element = this.first(selector);
            return element ? element.parentElement : null;
        },
        // 创建元素
        create(tagName) {
            return document.createElement(tagName);
        }
    };
    
    // 打印载入日志
    (function(left, right, color) {
        const arg = [
            `%c ${left} %c ${right} `,
            'padding:1px;border-radius:3px 0 0 3px;color:#fff;background:#606060;',
            `padding:1px;border-radius:0 3px 3px 0;color:#fff;background:${color}`
        ];
        console.log(...arg);
    })('Loaded', 'Beautify', '#e99010');
    
    switch (location.hostname) {
        case 'vuejs.org':
            function zhVue() {
                let url = location.href.replace('://vue', '://cn.vue');
                location.href = url;
            }
            const el = document.querySelector('a[href="/translations/"]');
            el.addEventListener("click", zhVue);
            el.href = '#';
            break;
        case 'www.runoob.com':
            //隐藏头部logo 移动搜索框位置到navbar
            $.append('#index-nav', `<form action="//www.runoob.com/" target="_blank" style="display: inline;float: right;">
                <input class="placeholder" id="s" name="s" placeholder="搜索……" autocomplete="off"></form>`);
            $.append('.pc-nav', `<form action="//www.runoob.com/" target="_blank" style="display: inline;position: absolute;right:0;">
                <input class="placeholder" id="s" name="s" placeholder="搜索……" autocomplete="off"></form>`);
            GM_addStyle(`#s{outline: 0; height: 2.3rem; margin-top: -1px; margin-right: 2rem; border: 0; border-radius: 4px;}`);
            $.remove('.logo-search');
            GM_addStyle(`.col.nav{padding-top: 5px;}`);
            $.parent('#sidebar-right-re')?.remove();
            $.remove('.feedback-btn');
            $.remove('.qrcode');
            GM_addStyle(`.navigation{background: grey;}`);
            if (document.location.href.split('/')[3] == "try") {
                $.remove('nav');
                GM_addStyle(`body{padding-top: 60px;}`);
                $.remove('footer');
            }
            break;
        case 'csdn.net': {
            console.log('Beautify@ try to click');
            const btnReadmore = $.first('.btn-readmore');
            if (btnReadmore) {
                btnReadmore.click();
                console.log('Beautify@ clicked: true');
            }
            break;
        }
        case 'es6.ruanyifeng.com':
            GM_addStyle(`
                #content{width: 63%; padding-bottom: 0px;}
                #back_to_top{right: 35px;}
                #edit{right: 35px;}
                #theme{right: 35px;}
                #flip{right: 10px;}
            `);
            break;
        case 'wenku.baidu.com':
            setTimeout(function() {
                console.log('show more');
                $.click('.btn-know');
                $.click('.moreBtn');
            }, 1500 );
            break;
        case 'didi.github.io':
            setTimeout(function() {
                GM_addStyle(`
                    .navigator{height: 54px; line-height: 54px;}
                    .home-view{padding-top: 38px;}
                `);
            }, 500 );
            break;
        case 'bilibili.com':
        case 'www.bilibili.com': {
            const enableWideScreen = GM_getValue('enableWideScreen', true); // 是否启用宽屏模式
            GM_registerMenuCommand('切换宽屏设置', () => GM_setValue('enableWideScreen', !enableWideScreen));
            // 宽屏模式 来自 https://github.com/bilibili-helper/bilibili-helper-o/blob/637d0741b0d81154c7bc330f8fce19b926f5a71b/src/js/modules/videoWiden/UI/index.js
            function setWide() {
                const btn = document.querySelector('.bpx-player-ctrl-wide:not(.bpx-state-entered)');
                if (btn) {
                    btn.click();
                    // 调整滚动位置
                    setTimeout(() => {
                        const player = document.querySelector('#bilibili-player');
                        if (player) {
                            const playerRect = player.getBoundingClientRect();
                            const position = window.scrollY + playerRect.top - 75; // Navbar height
                            window.scrollTo({ top: position });
                        }
                    }, 500);
                    if (unsafeWindow.ob) unsafeWindow.ob.disconnect(); // 触发后停止监听
                }
            }
            new Promise(resolve => {
                const player = document.querySelector('#bilibili-player');
                if (player && enableWideScreen) {
                    unsafeWindow.ob = new MutationObserver((mutationList) => {
                        setWide();
                    });
                    unsafeWindow.ob.observe(player, {
                        attributes: false,
                        subtree: true,
                        childList: true,
                    });
                }
                resolve();
            });
            // PiP 画中画模式快捷键`p`
            document.addEventListener('keyup', function (e) {
                if (e.key === 'p' && e.altKey) {
                    document.querySelector('video').requestPictureInPicture();
                } else if (e.key === 'ArrowRight' & e.altKey === true) {
                    $.click('.bilibili-player-video-btn-next');
                }
            }, false);
            GM_addStyle(`
                html.gray {
                    filter: grayscale(0) !important;
                    -webkit-filter: grayscale(0) !important;
                }
                .bili-subtitle-x-subtitle-panel-text {
                    font-family: unset !important;
                }
            `);
            // start of the `spm_id_from` filter
            let listener = function (e) {
                let i = e.target;
                for (; i && i.tagName !== "A"; )
                    i = i.parentNode;
                if ((i == null ? void 0 : i.tagName) !== "A")
                    return;
                let o = i.getAttribute("href");
                if (!o || !/\/\//.test(o) || !/spm_id_from=/.test(o) || /^blob:/.test(o))
                    return;
                i.setAttribute("href", o.split('?spm_id_from')[0]); // fuck bilibili spm_id
            }
            document.body.addEventListener("contextmenu", listener, false);
            break;
        }
        case 'cn.bing.com': {
            //GM_addStyle('#b_content{padding-left: 85px;}');
            break;
        }
        case 'duckduckgo.com': {
            GM_addStyle('#links_wrapper{padding-left: 108px;}');
            break;
        }
        case 'baike.baidu.com':
            $.remove('.video-list-container'); // 删除播放器容器
            GM_addStyle(`
                .lemmaWgt-searchHeader{height:55px;}
                div[class^="videoListWrap"], div[class^="knowledge-toolbar"], .J-knowledge-editor-toolbar {display: none;}
                .content-wrapper .content {font: unset;}
                .wgt-searchbar-new.wgt-searchbar .logo-container{padding: 6px 0;}
                .wgt-searchbar-new.wgt-searchbar .search{padding: 8px 0;}
                .wgt-navbar-hover {margin-top: 5px;}
                #J-lemma-video-list, #J-bottom-tashuo {display: none;}
            `);
            break;
        case 'yz.chsi.com.cn': {
            // 去除不符合不能调剂的信息
            function filter() {
                const tbody = $.first("#content-qecxList > table > tbody");
                if (!tbody) return;
                
                const children = tbody.children;
                for (let i = 0; i < children.length; i++) {
                    const lastChild = children[i].lastElementChild;
                    if (lastChild && (
                        lastChild.innerText.includes("不符合") || 
                        (lastChild.firstElementChild && lastChild.firstElementChild.title.includes('不符合'))
                    )) {
                        children[i].remove();
                        console.log(children[i].textContent + 'removed');
                    }
                }
            }
            
            const btnFilter = $.create('button');
            btnFilter.id = 'btn-filter';
            GM_addStyle('#btn-filter{width: 50px;}');
            btnFilter.textContent = '过滤';
            
            const ewmFix = $.first('.ewm-fix');
            if (ewmFix) {
                ewmFix.appendChild(btnFilter);
                btnFilter.addEventListener('click', filter);
            }
            
            document.addEventListener('keyup', function (e) {
                if (e.key === 'Enter' && e.ctrlKey) {
                    $.click('.tj-seach-btn');
                }
            }, false);
            break;
        }
        case 'www.30secondsofcode.org':
            GM_addStyle('.nav-bar{height:auto;}');
            break;
        case 'developer.mozilla.org': {
            GM_addStyle(`
                .mdn-cta-container{display:none;}
                .page-header{padding:12px 24px;}
                .breadcrumb-locale-container,#license{margin:0px;}
                .logo{height:59px;}
                .localized-content-note.notecard.neutral{display:none;}
                .header-search{margin-bottom: 4px;}
                .top-banner.fallback{display:none;}
            `);
            break;
        }
        case 'juejin.cn':
            GM_addStyle('.header.editor-header{height:4rem;}.main .bytemd{height:calc(100vh - 4rem);}');
            break;
        case 'xui.ptlogin2.qq.com':
            // 自动启用账号密码登录 去他大爷的扫码登录
            // GM_addStyle('.web_qr_login{display:block !important;}.qlogin,#bottom_qlogin{display:none !important;}');
            break;
        case 'steamcommunity.com': {
            setInterval(()=>{
                try {
                    document.getElementById('market_sell_dialog_accept_ssa').checked = true;
                } catch (err) {}
                try {
                    document.getElementById('market_buyorder_dialog_accept_ssa').checked = true;
                } catch (err) {}
            }, 2000);
            break;
        }
        case 'www.pixiv.net':
            // 需要与脚本配合使用 https://greasyfork.org/zh-CN/scripts/34153-pixiv-plus
            GM_addStyle(`
                select#select-ahao-favorites {
                    font-size: 14px;
                    line-height: 22px;
                    flex: 1 1 auto;
                    height: auto;
                    margin: 0px -9px;
                    padding: 9px 8px;
                    border: none;
                    border-radius: 4px;
                    color: rgba(0, 0, 0, 0.64);
                    background-color: rgba(0, 0, 0, 0.04);
                    transition: background-color 0.2s ease 0s, color 0.2s ease 0s;
                }
                #select-ahao-favorites+div{gap: 0px;}
            `);
            break;
        case 'live.bilibili.com': {
            const enableSideFollow = GM_getValue('enableSideFollow', false); // 是否切换关注按钮全屏展示
            GM_registerMenuCommand('切换关注按钮全屏展示', () => GM_setValue('enableSideFollow', !enableSideFollow));
            GM_addStyle(`
                .side-bar-popup-cntr{bottom:5% !important;height:84% !important;}
                .anchor-list {height: calc(100% - 55px) !important}
                .anchor-list > div {height:unset !important; align-content: flex-start;}
                .follow-cntr{height:100%;}
                .shortcut-item .follow-cntr{height:unset;}
                .section-content-cntr{height: calc(100% - 64px) !important;}
                .title-length-limit{max-width:unset !important;}
            `);
            if (enableSideFollow) GM_addStyle(`
                .player-full-win .side-bar-cntr {display: block !important; height: 60px !important; padding: 4px !important;}
                .player-full-win .side-bar-cntr div[data-upgrade-intro="Laboratory"] {display: none;}
                .player-full-win .side-bar-cntr div[data-upgrade-intro="Top"] {display: none;}
            `);
            break;
        }
        case 'frontendwingman.com':
            try {
                // credit: github.com/invobzvr
                Object.defineProperty(document.querySelector('.theme-container').__vue__,'locked',{
                    get:()=>true,
                    set:function(val){this._data.locked=true}
                });
                document.querySelector('.theme-container').__vue__.locked = true;
            } catch (e) {
                console.warn('Beautify: 自动解锁失效.');
            }
            break;
        case 'cloud.tencent.com':
            GM_addStyle('.doc-main-hd {margin-bottom: 24px;padding-bottom: 28px;border-bottom: 1px solid #e5e5e5;}');
            break;
        case 'www.npmjs.com':
            GM_addStyle(`
                .center-ns {padding-bottom: unset;}
                pre.editor.editor-colors {overflow: overlay;}
                header > div:nth-child(2) {display: none;}
            `);
            break;
        case 'www.zhihu.com':
            if (window.location.href === "https://www.zhihu.com/hot") {
                document.querySelectorAll('.HotItem').forEach((e) => {
                    if (!e.outerHTML.includes('HotItem-excerpt')) {e.remove();}
                    if (!e.outerHTML.includes('HotItem-img')) {e.remove();}
                });
            }break;
        case 'fanyi.baidu.com':
            GM_addStyle(`
                .download-app,.doc-feedback-group{display:none;}
                .header{padding:3px 0 7px 0;}
                .doc-whole-container{height:100%;}
                .doc-trans-view-wrap{width: unset;height: 88%;margin-top: -38px;}
            `);
            break;
        case 'jiexi.8old.cn': {
            // https://jx.m3u8.tv/jiexi/?url=
            document.addEventListener('keyup', function (e) {
                if (e.key === 'f') {
                    $.click('.dplayer-full-icon');
                } else if ([1,2,3,4].includes(parseInt(e.key))) {
                    const speedItems = $.$('.dplayer-setting-speed-item');
                    if (speedItems.length > parseInt(e.key)) {
                        speedItems[parseInt(e.key)].click();
                    }
                }
            }, false);
            break;
        }
        case 'qidian.com':
            GM_addStyle(`
                body{overflow-x:hidden !important;}
                .admire-wrap,.guide-btn-wrap,#j_navGameBtn,#navReward,#j_phoneRead{display:none;}
            `);
            break;
        case 'caddyserver.com':
            GM_addStyle(`
                pre > code.cmd {font-size: 1rem; overflow: overlay;}
                main > .sidebar:last-child {flex-shrink: 2;}
                main > nav.sidebar {font-size: 1.2rem; width: 20%;}
                article > :not(h1), dd, article p, article ol, article ul, article pre, article table {margin-bottom: 0.5rem;}
                pre {padding-bottom: 0.5rem !important;padding-top: 0.5rem !important;}
                pre.chroma {font-size: 1rem;}
                #paper1, #paper2 {display: none;}
                .paper3 {top: unset;left: unset;}
                hr {margin-top: 2.5rem; margin-bottom: 2.5rem !important;}
            `);
            break;
        case 'leetcode.cn':
            GM_addStyle(`
                ul[class*="NavbarList"] > li[class*="NavbarListItem"]:nth-child(2)::after{display:none !important}
                ul[class*="NavbarList"] > li[class*="NavbarListItem"]:nth-child(6)::after{display:none !important}
                [class*=TimeRemainContainer]{display:none;}
                section[class*=MainContainer] > div[class*=Container]:nth-child(1){display: none;}
                section[class*=MainContainer]{margin-top: 12px;}
                span[class*=BasicTag-StyledTag]{margin-right: 8px;}
            `);
            // 自动开启运行结果差别
            function enableDiff () {
                const btn = document.querySelector('label[class*="Label-StyledSwitch"]');
                if (btn && !btn.getAttribute('beautify-data')) {
                    btn.setAttribute('beautify-data', true);
                    btn.click();
                }
            }
            setTimeout(() => {
                const button = $.first('div[class*=second-section-container] > div:last-child button');
                if (button) button.click();
                
                new Promise(resolve => {
                    const container = document.querySelector('div[class*="CodeAreaContainer"]');
                    if (container) {
                        new MutationObserver((mutationList) => {
                            mutationList.forEach((mutation) => {
                                if (mutation.oldValue) enableDiff();
                            });
                        }).observe(container, {
                            attributes: true,
                            attributeOldValue: true,
                            subtree: true,
                        });
                    }
                    resolve();
                });
            }, 2600);
            // 控制台获取题解 Markdown 源码
            function getMarkdown() {
                const node = document.querySelector('div[class*="ContentContainer"]');
                const key = Object.keys(node).find(key=>{
                    return key.startsWith("__reactEventHandlers$");
                });
                console.log(node[key].children[0].props.children);
            }
            globalThis.unsafeWindow.getMarkdown = getMarkdown;
            break;
        case 's.taobao.com':
            GM_addStyle(`
                .grid-total .grid-right {display: none !important;}
                .grid-total .grid-left {width: unset !important;}
                li#J_FeedbackExperience {display: none;}
            `);
            break;
        case 'mooc1.chaoxing.com':
        case 'chaoxing.com':
            GM_addStyle(`#edui1_iframeholder{height:530px !important;}`);
            break;
        case 'scholar.google.com':
            GM_addStyle(`
                .donate{display:none !important;}
                #arovswmd_panel{display:none;}
                #gs_hdr{margin:unset !important;}
            `);
            break;
        case 'www.dlsite.com':
            GM_addStyle('h1#work_name{user-select: text !important;} body{overflow-y: initial !important;}');
            break;
        case 'preactjs.com':
            GM_addStyle(`
                header > div[class^='banner'] , header > a[class^='corner'] { display: none !important; }
                #app > main { padding-top: 3.5rem; }
                #app > main > div[class^=tutorial] { top: 3.5rem; }
                #app > main > div[class^=repl] { top: 3.5rem; }
            `);
            break;
        case 'react.dev':
            function zhReact(event) {
                event.preventDefault();
                let url = location.href.replace('://react', '://zh-hans.react');
                location.href = url;
            } // 跳转到中文对应页面
            document.querySelector('a[href="/community/translations"]').addEventListener("click", zhReact);
            break;
        case 'www.photopea.com': {
            // code from https://chrome.google.com/webstore/detail/remove-ads-from-photopea/gjkjjhgjcalgefcimahpbacihndicccn
            GM_addStyle('.app > div:not(:first-child) { visibility: hidden; }');
            function addCustomEvent() {
              const ADS_WIDTH = window.screen.width < 1180 ? 180 : 320;
              document.addEventListener('resizecanvas', () => {
                // push the ads container outside of the viewport
                window.innerWidth = document.documentElement.clientWidth + ADS_WIDTH;
              });
            }
            // inject our custom event listener into the "main world"
            document.documentElement.setAttribute('onreset', `(${addCustomEvent})()`);
            document.documentElement.dispatchEvent(new CustomEvent('reset'));
            document.documentElement.removeAttribute('onreset');
            function resize(event = {}) {
              if (!event.skip) {
                document.dispatchEvent(new CustomEvent('resizecanvas'));

                // trigger another resize event to update any listeners with the new window.innerWidth
                const resizeEvent = new Event('resize');
                resizeEvent.skip = true;
                window.dispatchEvent(resizeEvent);
              }
            }
            let debounce;
            window.addEventListener('resize', event => {
              clearTimeout(debounce);
              debounce = setTimeout(() => resize(event), 100);
            });
            resize();
            break;
        }
        case 'www.phind.com':
            GM_addStyle(`body {overflow-y: initial !important;}`);
            let engines = localStorage.getItem('userSearchRules') || null;
            if (!engines) {
                localStorage.setItem('userSearchRules', '{"developer.mozilla.org":3,"github.com":2,"stackoverflow.com":2,"www.reddit.com":-1,\
                "www.quora.com":-2,"www.pinterest.com":-3,"wikipedia.com":1,"numpy.org":1,"vuejs.org":1,"reactjs.org":1,"csdn.net":-2}');
            }
            break;
        case 'hd.nowcoder.com':
            const link = location.href.split('?target=')[1];
            location.href = link;
            break;
        case 'basarat.gitbook.io':
            GM_addStyle(`
                html {overflow: visible !important;}
                div.gitbook-root > div > div > header {height: 3.9rem;}
                div.gitbook-root > div header a[href^="https://youtube.com"] {display:none;}
                div.gitbook-root > div header a[href^="https://www.udemy.com"] {display:none;}
                div.gitbook-root div[data-testid="page.desktopTableOfContents"] {top: 62px !important; height: calc(100vh - 64px) !important;}
            `)
            break;
        case 'www.cesium.xin':
            GM_addStyle(`
                code[class*="language-"] { white-space: inherit; }
                footer { padding: 6px; }
            `);
            break;
        case 'message.bilibili.com':
            const callback = function(mutationList, observer) {
                if (document.querySelector('div.right .dialog:not(.hide)')) {
                    const el = document.querySelector('div.right .dialog:not(.hide)')
                    const mid = el.__vue__.userInfo.mid;
                    if (mid) {
                        el.querySelector('.title span').onclick = function() {
                            window.open(`https://space.bilibili.com/${mid}/video`);
                        }
                    }
                }
            }
            const observer = new MutationObserver(callback);
            observer.observe(document.body, { childList: true, subtree: true });
            GM_addStyle(`
                div.right .dialog .title span { padding: 8px; cursor: pointer; }
                div.right .dialog .title span:hover { text-decoration: underline; }
            `);
            break;
        case 'pan.baidu.com':
            setInterval(() => {
                const el = document.querySelector('input#accessCode');
                if (el && el.value.length === 4) document.querySelector('#submitBtn').click();
            }, 1000)
            break;
        case 'x.com':
            const linkElement = document.createElement('link');
            linkElement.rel = 'shortcut icon';
            linkElement.href = '//abs.twimg.com/favicons/twitter.ico';
            document.head.appendChild(linkElement);
            break;
        case 'nextjs.org':
            GM_addStyle(`
                main > div.relative { padding-top: 1rem; }
                main > div.relative > div.sticky { top: 5rem; }
                main > div.relative > nav > .sticky { top: 6.5rem; }
            `);
            break;
        default:
            break;
    }
    
    const aliList = [
        /^https:.+tmall.com\//,
        /^https:.+taobao.com\//,
    ];
    aliList.forEach((i) => {
        if (i.test(document.location.href)) {
            // 移除阴间字体 arial
            GM_addStyle('span,input,li,div,a{font-family:none;}');
        }
    });
    if (/.*sci-hub.+/.test(location.hostname)) {
        GM_addStyle('#rollback img{width:50px !important;height:50px;margin-left:12px;}');
    };
    if (location.hostname.endsWith('.xiaoeknow.com')) {
        document.addEventListener('keyup', function (e) {
            const video = document.querySelector('video');
            if (!video) return;
            if (e.key === ' ' && video.paused) {
                video.play();
            } else if (e.key === ' ') {
                video.pause();
            }
            if (e.key === 'f') {
                document.querySelector('.fullBtn').click();
            }
            if (e.key === 'ArrowLeft') {
                video.currentTime = video.currentTime - 5;
            } else if (e.key === 'ArrowRight') {
                video.currentTime = video.currentTime + 5;
            }
        }); // 快捷键控制视频
    }
})();
