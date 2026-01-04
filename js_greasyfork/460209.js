// ==UserScript==
// @name               多重搜索MultipleSearch
// @name:zh-CN         多重搜索
// @name:zh-TW         多重搜索
// @name:zh-HK         多重搜索
// @name:en-US         MultipleSearch
// @name:en-UK         MultipleSearch
// @author             Cassius0924
// @namespace          http://tampermonkey.net/
// @version            0.5.0
// @description        携带搜索词快捷切换搜索引擎、视频网站或博客网站。Quickly switch between search engines, video sites or blog sites with search words.
// @description:zh-CN  携带搜索词快捷切换搜索引擎、视频网站或博客网站。
// @description:zh-TW  攜帶搜索詞快捷切換搜索引擎、視頻網站或博客網站。
// @description:zh-HK  攜帶搜索詞快捷切換搜索引擎、視頻網站或博客網站。
// @description:en-US  Quickly switch between search engines, video sites or blog sites with search words.
// @description:en-UK  Quickly switch between search engines, video sites or blog sites with search words.
// @license            MIT
// @icon               https://i.imgur.com/oqVZgBY.png
// @match              https://www.bing.com/search*
// @match              https://www.baidu.com/s?*
// @match              https://www.google.com/search?*
// @match              https://www.google.ad/search*
// @match              https://www.google.ae/search*
// @match              https://www.google.com.af/search*
// @match              https://www.google.com.ag/search*
// @match              https://www.google.com.ai/search*
// @match              https://www.google.al/search*
// @match              https://www.google.am/search*
// @match              https://www.google.co.ao/search*
// @match              https://www.google.com.ar/search*
// @match              https://www.google.as/search*
// @match              https://www.google.at/search*
// @match              https://www.google.com.au/search*
// @match              https://www.google.az/search*
// @match              https://www.google.ba/search*
// @match              https://www.google.com.bd/search*
// @match              https://www.google.be/search*
// @match              https://www.google.bf/search*
// @match              https://www.google.bg/search*
// @match              https://www.google.com.bh/search*
// @match              https://www.google.bi/search*
// @match              https://www.google.bj/search*
// @match              https://www.google.com.bn/search*
// @match              https://www.google.com.bo/search*
// @match              https://www.google.com.br/search*
// @match              https://www.google.bs/search*
// @match              https://www.google.bt/search*
// @match              https://www.google.co.bw/search*
// @match              https://www.google.by/search*
// @match              https://www.google.com.bz/search*
// @match              https://www.google.ca/search*
// @match              https://www.google.cd/search*
// @match              https://www.google.cf/search*
// @match              https://www.google.cg/search*
// @match              https://www.google.ch/search*
// @match              https://www.google.ci/search*
// @match              https://www.google.co.ck/search*
// @match              https://www.google.cl/search*
// @match              https://www.google.cm/search*
// @match              https://www.google.cn/search*
// @match              https://www.google.com.co/search*
// @match              https://www.google.co.cr/search*
// @match              https://www.google.com.cu/search*
// @match              https://www.google.cv/search*
// @match              https://www.google.com.cy/search*
// @match              https://www.google.cz/search*
// @match              https://www.google.de/search*
// @match              https://www.google.dj/search*
// @match              https://www.google.dk/search*
// @match              https://www.google.dm/search*
// @match              https://www.google.com.do/search*
// @match              https://www.google.dz/search*
// @match              https://www.google.com.ec/search*
// @match              https://www.google.ee/search*
// @match              https://www.google.com.eg/search*
// @match              https://www.google.es/search*
// @match              https://www.google.com.et/search*
// @match              https://www.google.fi/search*
// @match              https://www.google.com.fj/search*
// @match              https://www.google.fm/search*
// @match              https://www.google.fr/search*
// @match              https://www.google.ga/search*
// @match              https://www.google.ge/search*
// @match              https://www.google.gg/search*
// @match              https://www.google.com.gh/search*
// @match              https://www.google.com.gi/search*
// @match              https://www.google.gl/search*
// @match              https://www.google.gm/search*
// @match              https://www.google.gr/search*
// @match              https://www.google.com.gt/search*
// @match              https://www.google.gy/search*
// @match              https://www.google.com.hk/search*
// @match              https://www.google.hn/search*
// @match              https://www.google.hr/search*
// @match              https://www.google.ht/search*
// @match              https://www.google.hu/search*
// @match              https://www.google.co.id/search*
// @match              https://www.google.ie/search*
// @match              https://www.google.co.il/search*
// @match              https://www.google.im/search*
// @match              https://www.google.co.in/search*
// @match              https://www.google.iq/search*
// @match              https://www.google.is/search*
// @match              https://www.google.it/search*
// @match              https://www.google.je/search*
// @match              https://www.google.com.jm/search*
// @match              https://www.google.jo/search*
// @match              https://www.google.co.jp/search*
// @match              https://www.google.co.ke/search*
// @match              https://www.google.com.kh/search*
// @match              https://www.google.ki/search*
// @match              https://www.google.kg/search*
// @match              https://www.google.co.kr/search*
// @match              https://www.google.com.kw/search*
// @match              https://www.google.kz/search*
// @match              https://www.google.la/search*
// @match              https://www.google.com.lb/search*
// @match              https://www.google.li/search*
// @match              https://www.google.lk/search*
// @match              https://www.google.co.ls/search*
// @match              https://www.google.lt/search*
// @match              https://www.google.lu/search*
// @match              https://www.google.lv/search*
// @match              https://www.google.com.ly/search*
// @match              https://www.google.co.ma/search*
// @match              https://www.google.md/search*
// @match              https://www.google.me/search*
// @match              https://www.google.mg/search*
// @match              https://www.google.mk/search*
// @match              https://www.google.ml/search*
// @match              https://www.google.com.mm/search*
// @match              https://www.google.mn/search*
// @match              https://www.google.ms/search*
// @match              https://www.google.com.mt/search*
// @match              https://www.google.mu/search*
// @match              https://www.google.mv/search*
// @match              https://www.google.mw/search*
// @match              https://www.google.com.mx/search*
// @match              https://www.google.com.my/search*
// @match              https://www.google.co.mz/search*
// @match              https://www.google.com.na/search*
// @match              https://www.google.com.ng/search*
// @match              https://www.google.com.ni/search*
// @match              https://www.google.ne/search*
// @match              https://www.google.nl/search*
// @match              https://www.google.no/search*
// @match              https://www.google.com.np/search*
// @match              https://www.google.nr/search*
// @match              https://www.google.nu/search*
// @match              https://www.google.co.nz/search*
// @match              https://www.google.com.om/search*
// @match              https://www.google.com.pa/search*
// @match              https://www.google.com.pe/search*
// @match              https://www.google.com.pg/search*
// @match              https://www.google.com.ph/search*
// @match              https://www.google.com.pk/search*
// @match              https://www.google.pl/search*
// @match              https://www.google.pn/search*
// @match              https://www.google.com.pr/search*
// @match              https://www.google.ps/search*
// @match              https://www.google.pt/search*
// @match              https://www.google.com.py/search*
// @match              https://www.google.com.qa/search*
// @match              https://www.google.ro/search*
// @match              https://www.google.ru/search*
// @match              https://www.google.rw/search*
// @match              https://www.google.com.sa/search*
// @match              https://www.google.com.sb/search*
// @match              https://www.google.sc/search*
// @match              https://www.google.se/search*
// @match              https://www.google.com.sg/search*
// @match              https://www.google.sh/search*
// @match              https://www.google.si/search*
// @match              https://www.google.sk/search*
// @match              https://www.google.com.sl/search*
// @match              https://www.google.sn/search*
// @match              https://www.google.so/search*
// @match              https://www.google.sm/search*
// @match              https://www.google.sr/search*
// @match              https://www.google.st/search*
// @match              https://www.google.com.sv/search*
// @match              https://www.google.td/search*
// @match              https://www.google.tg/search*
// @match              https://www.google.co.th/search*
// @match              https://www.google.com.tj/search*
// @match              https://www.google.tl/search*
// @match              https://www.google.tm/search*
// @match              https://www.google.tn/search*
// @match              https://www.google.to/search*
// @match              https://www.google.com.tr/search*
// @match              https://www.google.tt/search*
// @match              https://www.google.com.tw/search*
// @match              https://www.google.co.tz/search*
// @match              https://www.google.com.ua/search*
// @match              https://www.google.co.ug/search*
// @match              https://www.google.co.uk/search*
// @match              https://www.google.com.uy/search*
// @match              https://www.google.co.uz/search*
// @match              https://www.google.com.vc/search*
// @match              https://www.google.co.ve/search*
// @match              https://www.google.vg/search*
// @match              https://www.google.co.vi/search*
// @match              https://www.google.com.vn/search*
// @match              https://www.google.vu/search*
// @match              https://www.google.ws/search*
// @match              https://www.google.rs/search*
// @match              https://www.google.co.za/search*
// @match              https://www.google.co.zm/search*
// @match              https://www.google.co.zw/search*
// @match              https://www.google.cat/search*
// @grant               GM_setValue
// @grant               GM_getValue
// @grant               GM_addStyle
// @grant               GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/460209/%E5%A4%9A%E9%87%8D%E6%90%9C%E7%B4%A2MultipleSearch.user.js
// @updateURL https://update.greasyfork.org/scripts/460209/%E5%A4%9A%E9%87%8D%E6%90%9C%E7%B4%A2MultipleSearch.meta.js
// ==/UserScript==
(function () {
    "use strict";
    // TODO: 使用命名函数表达式而不是函数声明
    // TODO: 国际化
    // TODO: GM_addStyle()去广告
    // TODO: registerMenuCommand()


    GM_registerMenuCommand('设置', () => {
        alert('暂未开放');
    });
    GM_registerMenuCommand('g更新', () => {
        alert('暂未开放');
    });

    // 已经适配网页
    const handlers = {
        baidu: {
            // 网页预处理
            preprocess() {
                const head = selectElement('#head');
                head.style = 'height: 140px; transition:height 0.3s ease-in-out;';
                const div = createElement('div', 'ms-cover', 'background-color: white; height: 50px');
                const hw = selectElement('#head .head_wrapper');
                const u = selectElement('#u');
                const u1 = selectElement('#u1');
                const skt = selectElement('#head .search-keyboard-toast');
                div.appendChildren(hw, u, u1, skt);
                head.appendChild(div);
                selectElement('#s_tab').style = 'padding-top: 140px; transition: all 0.3s ease-in-out;';
                // TODO-1: 解决输入框无法使用快捷键的问题，难搞
            },
            // 添加多重搜索组件
            addMSComponent() {
                const head = selectElement('#head');
                const div = createElement('div', 'ms-container', 'margin-left: 120px;');
                const css = '@media screen and (min-width: 1921px) { .ms-container { width: 1055px; margin: 0 auto !important;} }\n #ms-component .ms-dragging {opacity: 0.5; transition: all 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28) 0s}\n#ms-component .ms-crowded {transition: all 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28) 0s;}';
                const style = createElement('style', '', '', css);
                const component = msComponent.render(div);
                component.style = 'bottom: 8px; position: absolute;';
                div.appendChildren(style, component);
                head.appendChild(div);
                // addShortcutKeys();
            },
            // 添加滚动监听
            addScrollListener() {
                window.onscroll = function () {
                    const head = selectElement('#head');
                    const searchTab = selectElement('#s_tab');
                    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                    scrollTop > 12 && (selectElement('.cr-title').style.marginTop = '20px');
                    scrollTop > 0
                        ? (head.style.height = '103px', searchTab.style.paddingTop = '115px')
                        : (head.style.height = '140px', searchTab.style.paddingTop = '140px');
                    toggleMSComponent(scrollTop, 0, 0);
                    turnOffToggleSortMode();
                };
            },
            // 切换排序模式预处理
            preToggleSortMode() {
                GM_getValue('sortMode') === 'off'
                    ? (selectElement('#head').style.height = '155px', selectElement('#s_tab').style.paddingTop = '155px')
                    : (selectElement('#head').style.height = '140px', selectElement('#s_tab').style.paddingTop = '140px');
            },
            // 获取搜索内容
            getSearchContent() {
                return selectElement('#kw').value;
            },
        },
        google: {
            preprocess() {
                const bg = selectElement('.sfbg');
                setTimeout(() => {
                    bg.style = 'height:190px; z-index:-100;';
                    bg.style.transition = 'height 0.3s ease-in-out';
                }, 0);
                const dodTBe = selectElement('.dodTBe');
                dodTBe.style.height = '125px';
                dodTBe.style.transition = 'all, 0.3s ease-in-out';
            },
            addMSComponent() {
                const head = selectElement('.CvDJxb');
                head.style = 'display:flex; flex-direction: column; justify-content: center;';
                const css = '#ms-component{--ms-margin:165px;margin-left: calc(var(--ms-margin) - 15px);} @media(prefers-color-scheme:light){#ms-component{background:#fff !important;}} @media(prefers-color-scheme:dark){.ms-item {background: #303134 !important; color:#e8eaed !important; box-shadow: none !important; box-sizing: content-box ;border: 1px solid rgb(95,99,104);} .ms-item svg path:nth-child(2){fill: #e8eaed}.mss-content, .mss-icon-content{border: 1px solid rgb(95,99,104); background-color: #202124;}.mss-icon-close svg path:nth-child(2), .mss-del-btn svg path:nth-child(2){fill: #e8eaed;}.mss-title, .mss-icon-title {color: #e8eaed; border-bottom: 1px solid rgb(95,99,104);}.mss-item {background: #303134; border: 1px solid rgb(95,99,104); box-shadow: none;}.mss-item-name, .mss-item-url, .mss-del-btn, .mss-name-input, .mss-url-input, .mss-icon-input, .mss-add-btn, .mss-icon-cancel-btn, .mss-icon-confirm-btn {background: #303134; border: 1px solid rgb(95,99,104); box-shadow: none;}}@media (max-width: 1300px) {#ms-component{--ms-margin: 28px;}}@media (min-width: 1121px) and (max-width: 1300px) {#ms-component{--ms-margin:  calc((100vw - 1065px)/2);}}\n @media (min-width: 1459px) and (max-width: 1659px) {#ms-component{--ms-margin: calc(25vw + -200px);}}\n@media (min-width: 1659px) {#ms-component{--ms-margin: 215px;}}\n#ms-component .ms-dragging {opacity: 0.5; transition: all 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28) 0s}\n#ms-component .ms-crowded {transition: all 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28) 0s;} .pin{z-index: 1000}';
                const style = createElement('style', '', '', css);
                const component = msComponent.render(head);
                component.style = 'bottom: 8px; position: absolute; top: 60px;';
                component.appendChild(style);
            },
            addScrollListener() {
                window.onscroll = function () {
                    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                    if (scrollTop > 120) {
                        selectElement('.sfbg').style.height = '135px';
                        selectElement('#ms-component').style.top = '52px';
                        selectElement('.dodTBe').style.height = '90px';
                    } else if (scrollTop <= 0) {
                        selectElement('.sfbg').style.height = '210px';
                        selectElement('.dodTBe').style.height = '125px';
                    } else {
                        selectElement('#ms-component').style.top = '60px';
                    }
                    toggleMSComponent(scrollTop, 120, 0);
                    turnOffToggleSortMode();
                };
            },
            preToggleSortMode() {
                GM_getValue('sortMode') === 'off'
                    ? (selectElement('.sfbg').style.height = '240px', selectElement('.dodTBe').style.height = '140px')
                    : (selectElement('.sfbg').style.height = '210px', selectElement('.dodTBe').style.height = '125px');
            },
            getSearchContent() {
                return selectElement('.i4ySpb ~ .gLFyf').value;
            },
        },
        bing: {
            preprocess() {
                const head = selectElement('#b_header');
                head.style = '/*height: 0 !important*/; transform: translateY(-75px);z-index: 10; transition:all, 0.3s ease-in-out;';
                const content = selectElement('#b_content');
                content.style = 'position: relative;z-index:9; top: -70px; transition:top, 0.3s ease-in-out;';
                const scopeBar = selectElement('.b_scopebar');
                scopeBar.style = 'position: relative; margin-top: 70px; transition:all, 0.3s ease-in-out;';
                const searchBox = selectElement('#sb_form_q');
                searchBox.onfocus = () => {
                    selectElement('#ms-component').classList.remove('top');
                };
                searchBox.onblur = () => {
                    selectElement('#ms-component').classList.add('top');
                };
            },
            addMSComponent() {
                const head = selectElement('#b_header');
                const body = selectElement('.b_respl');
                const css = '.ms-dragging {opacity: 0.5; transition: all 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28) 0s} #ms-component .ms-crowded {transition: all 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28) 0s;} .top{z-index:100} .pin{z-index: 1000;}';
                const style = createElement('style', '', '', css);
                document.head.appendChild(style);
                const component = msComponent.create();
                component.classList.add('top');
                component.style = 'position: sticky; top: 0; height: 0px; margin-top:75px; padding-left: 150px;';
                body.insertBefore(component, head);
            },
            addScrollListener() {
                window.onscroll = function () {
                    const msComponent = selectElement('#ms-component');
                    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                    scrollTop > 60 && (msComponent.style.paddingBlock = '10px');
                    scrollTop <= 130 && (msComponent.style.paddingBlock = '0px');
                    scrollTop > 110 && (msComponent.style.height = '30px', msComponent.style.boxShadow = '0 2px 10px 0 rgb(0 0 0 / 10%)');
                    scrollTop <= 140 && (msComponent.style.height = '0px', msComponent.style.boxShadow = '');
                    toggleMSComponent(scrollTop, 70, 70);
                    turnOffToggleSortMode();
                };

            },
            preToggleSortMode() {
                const msComponent = selectElement('#ms-component');
                const scopeBar = selectElement('.b_scopebar');
                GM_getValue('sortMode') === 'off'
                    ? scopeBar.style.marginTop = '85px'
                    : (msComponent.style.marginTop = '75px', scopeBar.style.marginTop = '70px');
            },
            getSearchContent() {
                return selectElement('#sb_form_q').value;
            },
        },
        cnbing: { // TODO: 中国版bing
            preprocess() {

            },
            addMSComponent() {

            },
            addScrollListener() {

            },
            preToggleSortMode() {

            },
            getSearchContent() {

            },
        },
        other: {},
    };

    const hostToKey = {
        'www.baidu.com': 'baidu',
        'www.google.*': 'google',
        'www.bing.com': 'bing',
        'cn.bing.com': 'cnbing',
    };

    function getHandler() {
        const host = window.location.hostname;
        let handlerKey = 'other';
        for (let key in hostToKey) {
            if (new RegExp('^' + key).test(host)) {
                handlerKey = hostToKey[key];
                break;
            }
        }
        return handlers[handlerKey];
    }

    const theme = {
        component: {
            backgroundColor: '#ffffff',
            color: '#4e6ef2',
            // color: '#ec29b3',
            border: 'none',
        },
        item: {
            backgroundColor: 'linear-gradient(135deg, rgba(245, 245, 245, 1) 0%, rgba(255, 255, 255, 1) 100%)',
            color: '#4e6ef2',
            // color: '#ec29b3',
            border: 'none',
            borderRadius: '8px',
            boxShadow: '-4px -4px 10px -8px rgb(255 255 255), 4px 4px 10px -8px rgb(0 0 0 / 30%)',
        },
        settings: {
            backgroundColor: '#ffffff',
            color: '#4e6ef2',
            // color: '#ec29b3',
            border: 'none',
        },
    }
    GM_setValue('theme', theme);

    //重构makeMSComponent()
    const msComponent = {
        theme: {},
        searchEngines: [],
        dragging: {},
        component: {},

        init() {
            this.searchEngines = GM_getValue('searchEngines');
            this.theme = GM_getValue('theme').component;
        },

        create() {
            this.init();
            this.component = createElementWithId('div', 'ms-component');
            this.searchEngines.forEach((searchEngine, index) => {
                const item = Object.create(msItem);
                if (index === this.searchEngines.length - 1) {
                    this.component.appendChild(item.createSettings(searchEngine));
                } else {
                    item.props = searchEngine;
                    this.component.appendChild(item.create());
                }
            });
            this.bindShortcuts();
            return this.component;
        },

        render(parentNode) {
            parentNode.appendChildren(this.create());
            return this.component;
        },

        toggle() {
            const handler = getHandler();
            handler.preToggleSortMode();
            if (GM_getValue('sortMode') === 'off') {
                this.component.classList.add('ms-sort-mode')
                GM_setValue('sortMode', 'on');
            } else {
                selectElement('#ms-component').childNodes.forEach((child) => {
                    child.style.transition = '';
                });
                this.component.classList.remove('ms-sort-mode')
                GM_setValue('sortMode', 'off');
            }
        },

        hover() {

        },

        bindShortcuts() {
            const texts = this.component.querySelectorAll('.ms-name');
            const system = getSystem();
            const modifier = (system === 'mac' || system === 'ipad') ? '⌥' : 'Alt';
            let originalTexts = [];
            texts.forEach((text) => {
                originalTexts.push(text.innerHTML);
            });
            document.body.addEventListener('keydown', (event) => {
                if (event.altKey) {
                    this.component.classList.add('pin');
                    const len = texts.length > 9 ? 9 : texts.length;
                    [...Array(len)].forEach((_, i) => {
                        const keyCode = `Digit${i + 1}`;
                        texts[i].style.height = `${texts[i].offsetHeight}px`;
                        texts[i].style.width = `${texts[i].offsetWidth}px`;
                        texts[i].innerHTML = `${modifier} + ${i + 1}`;
                        if (event.code === keyCode) {
                            event.preventDefault(); // 阻止键盘输入
                            search(this.searchEngines[i]);
                        }
                    });
                }
            });
            document.body.addEventListener('keyup', (event) => {
                if (!event.altKey) {
                    this.component.classList.remove('pin');
                    texts.forEach((text, index) => {
                        text.style.width = '';
                        text.innerHTML = originalTexts[index];
                    });
                }
            });
        }
    }

    const msItem = {
        props: {
            name: '',
            url: '',
            icon: '',
        },
        item: {},
        theme: {},

        init() {
            this.theme = GM_getValue('theme').item;
        },

        create() {
            this.init();
            this.item = createElement('div', 'ms-item');
            this.addElements();
            this.events.bindItem.bind(this)();
            // addStyles(this.element, this.theme);
            return this.item;
        },

        createSettings(special) {  //TODO：进一步重构
            this.init();
            this.item = createElement('div', 'ms-item');
            const content = createElement('div', 'ms-item-content', '', special.toggleSortIcon + special.plusIcon);
            content.childNodes.forEach((item) => {
                    item.onmouseover = () => item.lastChild.style = `fill:${this.theme.color};`;
                    item.onmouseout = () => item.lastChild.style = '';
                }
            );
            this.item.style.justifyContent = 'center';
            this.item.appendChild(content);
            this.events.bindSettings.bind(this)();
            return this.item;
        },


        addElements() {
            const content = createElement('div', 'ms-item-content');
            const sortIcon = createElement('div', 'ms-sort-icon');
            const name = createElement('span', 'ms-name', '', this.props.name);
            const icon = createElement('img', 'ms-icon');
            icon.src = this.props.icon;
            icon.draggable = false;
            const url = createInput('', 'ms-url', 'display:none', this.props.url);
            content.appendChildren(sortIcon, icon, name, url);
            this.item.draggable = true;
            this.item.appendChild(content);
        },
        events: {
            bindItem() {
                const delay = 500;
                const onDragOver = function _onDragOver(e) {
                    e.preventDefault(); // 阻止默认事件
                };
                const onDragStart = function _onDragStart(e) {
                    msComponent.dragging = e.target;
                    e.dataTransfer.effectAllowed = 'move';
                    e.target.parentNode.childNodes.forEach(element => {
                        element === e.target
                            ? element.classList.toggle("ms-dragging")
                            : element.classList.toggle("ms-crowded");
                    });
                };
                const onDragEnd = function _onDragEnd(e) {
                    setTimeout(() => {
                        e.target.parentNode.childNodes.forEach(element => {
                            element === e.target
                                ? element.classList.toggle("ms-dragging")
                                : element.classList.toggle("ms-crowded");
                        });
                    }, 0);
                };
                const onDrop = function _onDrop(e) {
                    if (!e.target.classList.contains('ms-dragging')) {
                        const draggingIndex = Array.prototype.indexOf.call(msComponent.dragging.parentNode.children, msComponent.dragging);
                        const targetIndex = Array.prototype.indexOf.call(this.item.parentNode.children, this.item);
                        const startPosition = msComponent.dragging.getBoundingClientRect();
                        const endPosition = this.item.getBoundingClientRect();
                        if (draggingIndex < targetIndex) {
                            addAnimation(draggingIndex, targetIndex, startPosition, endPosition, msComponent.dragging);
                            setTimeout(() => {
                                msComponent.dragging.parentNode.childNodes.forEach((element) => {
                                    element.style.transform = '';
                                });
                                this.item.parentNode.insertBefore(msComponent.dragging, this.item.nextSibling);
                                msComponent.bindShortcuts();
                            }, delay);
                        } else {
                            addAnimation(draggingIndex, targetIndex, startPosition, endPosition, msComponent.dragging);
                            setTimeout(() => {
                                msComponent.dragging.parentNode.childNodes.forEach((element) => {
                                    element.style.transform = '';
                                });
                                this.item.parentNode.insertBefore(msComponent.dragging, this.item);
                                msComponent.bindShortcuts();
                            }, delay);
                        }
                        updateData(draggingIndex, targetIndex);
                    }
                };

                // 添加动画
                const addAnimation = function _addAnimation(draggingIndex, targetIndex, startPosition, endPosition, dragging) {
                    let deltaX = 0;
                    const component = dragging.parentNode;
                    if (draggingIndex < targetIndex) {  //往右
                        deltaX = endPosition.right - startPosition.right;
                        for (let i = draggingIndex + 1; i <= targetIndex; i++) {
                            const element = component.children[i];
                            const deltaX2 = startPosition.left - dragging.nextSibling.getBoundingClientRect().left;
                            element.style.transition = '';
                            element.style.transform = `translateX(${deltaX2}px)`;
                            element.offsetWidth;
                            element.style.transition = 'all 0s';
                        }
                    } else {  // 往左
                        deltaX = endPosition.left - startPosition.left;
                        for (let i = targetIndex; i < draggingIndex; i++) {
                            const element = component.children[i];
                            const deltaX2 = startPosition.right - dragging.previousSibling.getBoundingClientRect().right;
                            element.style.transition = '';
                            element.style.transform = `translateX(${deltaX2}px)`;
                            element.offsetWidth;
                            element.style.transition = 'all 0s';
                        }
                    }
                    dragging.style.transition = '';
                    dragging.style.transform = `translateX(${deltaX}px)`;
                    dragging.offsetWidth;
                    dragging.style.transition = 'all 0s';
                };

                // 更新数据
                const updateData = function _updateData(draggingIndex, targetIndex) {
                    const engines = GM_getValue('searchEngines');
                    const draggingEngine = engines.splice(draggingIndex, 1)[0];
                    engines.splice(targetIndex, 0, draggingEngine);
                    GM_setValue('searchEngines', engines);
                };

                const onClick = function _onClick() {
                    search(this.props);
                };
                this.item.onclick = onClick.bind(this);
                this.item.ondragover = onDragOver;
                this.item.ondragstart = onDragStart;
                this.item.ondragend = onDragEnd;
                this.item.ondrop = onDrop.bind(this);
            },
            // 绑定最后一项
            bindSettings() {
                this.item.querySelector('.ms-toggle-sort-icon').onclick = () => msComponent.toggle();
                this.item.querySelector('.ms-plus-icon').onclick = () => msSettingsPanel.render(document.body);
            }
        }
    }

    const msSettingsPanel = {
        props: {
            title: '',
        },

        init() {
            this.props.title = '多重搜索设置';
        },

        create() {
            this.init();
            this.panel = createElementWithId('div', 'ms-settings-panel');
            const content = createElement('div', 'mss-content');
            const title = createElement('div', 'mss-title', '', this.props.title);
            const container = createElement('div', 'mss-container');
            const left = createElement('div', 'mss-left');
            const list = createElement('div', 'mss-list');
            const right = createElement('div', 'mss-right');
            const form = createElement('form', 'mss-form');
            const nameInput = createInput('', 'mss-name-input', '', '', '搜索引擎名称');
            const urlInput = createInput('', 'mss-url-input', '', '', '搜索引擎地址');
            const iconInput = createInput('', 'mss-icon-input', '', '', '图标地址（留空自动生成）');
            const addBtn = createElement('button', 'mss-add-btn', '', '添加');
            const close = createElement('div', 'mss-icon-close', '', '<svg class=\'mss-close-icon\' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"><path fill="none" d="M0 0h24v24H0z"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>');
            const cancelBtn = createElement('button', 'mss-icon-cancel-btn', '', '取消');
            const confirmBtn = createElement('button', 'mss-icon-confirm-btn', '', '确定');
            form.appendChildren(nameInput, urlInput, iconInput, addBtn);
            left.appendChild(list);
            right.appendChild(form);
            container.appendChildren(left, right);
            content.appendChildren(close, title, container, cancelBtn, confirmBtn);
            this.panel.appendChild(content);
            const searchEngines = GM_getValue('searchEngines');
            searchEngines.forEach((searchEngine, index) => {
                index !== searchEngines.length - 1 && this.appendListItem(searchEngine);
            });
            this.events.bindPanel.bind(this)();
            this.events.bindForm.bind(this)();
            return this.panel;
        },

        appendListItem(searchEngine) {
            const item = createElement('div', 'mss-item');
            const icon = createElement('img', 'mss-item-icon');
            icon.src = searchEngine.icon;
            const center = createElement('div', 'mss-center');
            const name = createInput('', 'mss-item-name', '', searchEngine.name, '名称');
            const url = createInput('', 'mss-item-url', '', searchEngine.url, '网址');
            const icon_ = createInput('', 'mss-item-icon_', '', searchEngine.icon);
            const delBtn = createElement('button', 'mss-del-btn', '', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"><path fill="none" d="M0 0h24v24H0z"/><path d="M7 4V2h10v2h5v2h-2v15a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6H2V4h5zM6 6v14h12V6H6zm3 3h2v8H9V9zm4 0h2v8h-2V9z"/></svg>');
            center.appendChildren(name, url, icon_)
            item.appendChildren(icon, center, delBtn)
            this.panel.querySelector('.mss-list').appendChild(item);
            this.events.bindListItem.bind(this)(item);
        },

        render(parentNode) {
            parentNode.appendChild(this.create());
        },

        events: {
            //绑定面板事件
            bindPanel() {
                //关闭按钮
                const list = this.panel.querySelector('.mss-list');
                this.panel.querySelector('.mss-icon-close').addEventListener('click', () => {
                    this.panel.remove();
                });
                //取消按钮
                this.panel.querySelector('.mss-icon-cancel-btn').addEventListener('click', (e) => {
                    this.panel.remove();
                });
                //确认按钮
                this.panel.querySelector('.mss-icon-confirm-btn').addEventListener('click', (e) => {
                    const newSearchEngines = [];
                    const settings = GM_getValue('searchEngines').pop();
                    this.panel.querySelector('.mss-list').childNodes.forEach((item, index) => {
                        if (item.style.display !== 'none') {
                            const name = list.querySelectorAll('.mss-item-name')[index].value;
                            const url = list.querySelectorAll('.mss-item-url')[index].value;
                            const icon = list.querySelectorAll('.mss-item-icon')[index].src;
                            newSearchEngines.push({name, url, icon,});
                        }
                    });
                    newSearchEngines.push(settings);
                    GM_setValue('searchEngines', newSearchEngines);
                    this.panel.remove();
                    window.location.reload();
                });
            },
            //绑定表单事件
            bindForm() {
                //添加按钮
                const form = this.panel.querySelector('.mss-form')
                form.querySelector('.mss-add-btn').addEventListener('click', (e) => {    //TODO: 判断URL是否有效
                    e.preventDefault();
                    let url = form.querySelector('.mss-url-input').value;
                    const name = form.querySelector('.mss-name-input').value;
                    const icon = form.querySelector('.mss-icon-input').value || generateIconUrl(url);
                    if (name && url && icon) {
                        const searchEngine = {name, url, icon,};
                        this.appendListItem(searchEngine);
                    }
                });
            },
            //绑定列表事件
            bindListItem(item) {
                //图标按钮
                item.querySelector('.mss-item-icon').addEventListener('click', () => {
                    this.createIconPanel(item);
                });
                //删除按钮
                item.querySelector('.mss-del-btn').addEventListener('click', () => {
                    item.style.display = 'none';
                });
            },
            //绑定图标面板事件
            bindIconPanel() {
                this.iconPanel.querySelector('.mss-icon-close').addEventListener('click', () => {
                    this.iconPanel.remove();
                });
                this.iconPanel.querySelector('.mss-icon-cancel-btn').addEventListener('click', () => {
                    this.iconPanel.remove();
                });
                this.iconPanel.querySelector('.mss-icon-confirm-btn').addEventListener('click', () => {
                    this.panel.querySelector('.mss-item-icon').src = this.iconPanel.querySelector('.mss-icon-input').value || generateIconUrl(this.panel.querySelector('.mss-item-url').value)
                    this.iconPanel.remove();
                });
            }

        },

        createIconPanel(item) { // TODO: 提示信息Toast
            this.iconPanel = createElement('div', 'mss-icon-panel');
            const content = createElement('div', 'mss-icon-content');
            const title = createElement('div', 'mss-icon-title', '', '修改图标');
            const container = createElement('div', 'mss-icon-container');
            const form = createElement('form', 'mss-icon-form');
            const iconInput = createInput('', 'mss-icon-input', '', this.panel.querySelector('.mss-item-icon').src, '图标地址（留空自动生成）');
            const close = createElement('div', 'mss-icon-close', '', '<svg class=\'mss-icon-editor-close-icon\' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"><path fill="none" d="M0 0h24v24H0z"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>');
            const cancelBtn = createElement('button', 'mss-icon-cancel-btn', '', '取消');
            const confirmBtn = createElement('button', 'mss-icon-confirm-btn', '', '确定');
            form.appendChild(iconInput);
            container.appendChild(form);
            content.appendChildren(title, container, close, cancelBtn, confirmBtn);
            this.iconPanel.appendChild(content);
            this.events.bindIconPanel.bind(this)();
            document.body.appendChild(this.iconPanel);
        },

        addStyles() {
            let style = document.createElement('style');
        }

    }

    const msStyle = {
        globalStyle: '#ms-component {background: white;border-radius: 10px;display: flex;flex-wrap: nowrap;flex-direction: row; transition: padding-block 0.3s ease-in-out 0s, box-shadow 0.3s ease-in-out 0s, height 0.3s ease-in-out, 0s margin-top 0.3s ease-in-out;}  .ms-container {margin-left: 120px;}  .ms-item {height: 48.5px;overflow-y: hidden;min-width: 30px;margin-inline: 10px;display: flex;padding: 6px 10px;flex-direction: column;align-items: center;justify-content: flex-end;cursor: pointer;background: linear-gradient(135deg, rgba(245, 245, 245, 1) 0%, rgba(255, 255, 255, 1) 100%);box-shadow: -4px -4px 10px -8px rgba(255, 255, 255, 1), 4px 4px 10px -8px rgba(0, 0, 0, .3);border-radius: 8px;color: black;text-decoration: none; transition: height 0.3s ease-in-out 0s}.ms-item:hover{color: #4e6ef2 !important;} .ms-sort-mode .ms-item { height: 63.5px; } .ms-mini .ms-item { height: 18px; } .ms-mini .ms-toggle-sort-icon { height: 0px; width: 0px; opacity: 0; } .ms-mini .ms-sort-icon { height: 0px; opacity: 0; margin-bottom: 0px; } .ms-mini .ms-icon { height: 0px; width: 0px; opacity: 0; } .ms-item-content {display: flex;flex-direction: column;align-items: center;justify-content: flex-end;}  .ms-sort-icon {width: 10px;height: 3px;margin-bottom: 10px;border-radius: 3px;background: #909eb0;transition: height 0.3s ease-in-out;}  .ms-icon {width: 30px;height: 30px;border-radius: 5px;transition: all 0.3s ease-in-out;}  .ms-toggle-sort-icon {transition: all 0.3s ease-in-out;}  .ms-name {min-width: 36px;margin-top: 2px;font-size: 12px;font-weight: bold;white-space: nowrap;overflow: hidden; text-align: center;}  #ms-settings-panel {position: fixed;top: 0;left: 0;width: 100%;height: 100%;background: rgba(0, 0, 0, 0.2);z-index: 1000;display: flex;justify-content: center;align-items: center;}  .mss-content {position: relative;width: 800px;height: 500px;border-radius: 10px;display: flex;flex-direction: column;justify-content: flex-start;align-items: center;background: #EFEFEFFF;}  .mss-title {width: 100%;height: 15%;display: flex;justify-content: center;align-items: center;font-size: 20px;font-weight: bold;border-bottom: 1px solid #e5e5e5;}  .mss-container {width: 100%;height: 85%;display: flex;flex-direction: row;justify-content: flex-start;align-items: center;}  .mss-left {width: 100%;height: 100%;display: flex;flex-direction: column;justify-content: flex-start;align-items: center;}  .mss-list {width: 400px;height: 100%;display: flex;flex-direction: column;justify-content: flex-start;align-items: center;overflow-y: scroll;overflow-x: hidden;}  .mss-list::-webkit-scrollbar {}  .mss-item {width: auto;height: 60px;margin-block: 10px;padding-block: 10px;padding-inline: 10px;display: flex;flex-direction: row;justify-content: flex-start;align-items: center;border-radius: 10px;box-shadow: -4px -4px 10px -8px rgba(255, 255, 255, 1), 4px 4px 10px -8px rgba(0, 0, 0, .3);background: linear-gradient(135deg, rgba(230, 230, 230, 1) 0%, rgba(246, 246, 246, 1) 100%);}  .mss-item-icon {width: 45px;height: 45px;margin: 0 0;border-radius: 10px;cursor: pointer;}  .mss-center {margin: 0 10px;height: 100%;display: flex;flex-direction: column;justify-content: space-around;align-items: stretch;}  .mss-item-name {width: 80px;border: none;outline: none;border-radius: 3px;padding: 3px 10px 1px;font-weight: bold;box-shadow: -4px -4px 10px -8px rgba(255, 255, 255, 1) inset, 4px 4px 10px -8px rgba(0, 0, 0, .3) inset;background: linear-gradient(135deg, rgba(240, 240, 240, 1) 0%, rgba(246, 246, 246, 1) 100%);}  .mss-item-url {width: 185px;border: none;outline: none;border-radius: 3px;padding: 3px 10px 1px;font-weight: bold;box-shadow: -4px -4px 10px -8px rgba(255, 255, 255, 1) inset, 4px 4px 10px -8px rgba(0, 0, 0, .3) inset;background: linear-gradient(135deg, rgba(240, 240, 240, 1) 0%, rgba(246, 246, 246, 1) 100%);}  .mss-item-icon_ {display: none;}  .mss-del-btn {width: 45px;height: 45px;border: 1px solid #e5e5e5;border-radius: 10px;cursor: pointer;}  .mss-icon-panel {position: fixed;top: 0;left: 0;width: 100%;height: 100%;background: rgba(0, 0, 0, 0.2);z-index: 1000;display: flex;justify-content: center;align-items: center;}  .mss-icon-content {position: relative;width: 400px;height: 300px;border-radius: 10px;display: flex;flex-direction: column;justify-content: flex-start;align-items: center;background: #EFEFEFFF;}  .mss-icon-title {width: 100%;height: 20%;display: flex;justify-content: center;align-items: center;font-size: 20px;font-weight: bold;border-bottom: 1px solid #e5e5e5;}  .mss-icon-container {width: 100%;height: 80%;display: flex;flex-direction: row;justify-content: flex-start;align-items: center;}  .mss-icon-form {width: 100%;height: 90px;display: flex;margin-bottom: 30px;flex-direction: column;justify-content: center;align-items: center;}  .mss-icon-input {width: 280px;height: 40px;border: 1px solid #e5e5e5;border-radius: 10px;margin-bottom: 10px;padding: 0 10px;font-weight: bold;box-shadow: -4px -4px 10px -8px rgba(255, 255, 255, 1) inset, 4px 4px 10px -8px rgba(0, 0, 0, .3) inset;background: linear-gradient(135deg, rgba(240, 240, 240, 1) 0%, rgba(246, 246, 246, 1) 100%);}  .mss-icon-close {position: absolute;top: 20px;right: 10px;width: 30px;display: flex;flex-direction: row;justify-content: center;align-items: center;height: 30px;margin: 0 10px;cursor: pointer;}  .mss-icon-cancel-btn {position: absolute;bottom: 10px;right: 100px;width: 80px;height: 40px;border: 1px solid #e5e5e5;border-radius: 10px;background: #e5e5e5;cursor: pointer;box-shadow: -4px -4px 10px -8px rgba(255, 255, 255, 1), 4px 4px 10px -8px rgba(0, 0, 0, .3);background: linear-gradient(135deg, rgba(230, 230, 230, 1) 0%, rgba(246, 246, 246, 1) 100%);}  .mss-icon-confirm-btn {position: absolute;bottom: 10px;right: 10px;width: 80px;height: 40px;border: 1px solid #e5e5e5;border-radius: 10px;background: #e5e5e5;cursor: pointer;box-shadow: -4px -4px 10px -8px rgba(255, 255, 255, 1), 4px 4px 10px -8px rgba(0, 0, 0, .3);background: linear-gradient(135deg, rgba(230, 230, 230, 1) 0%, rgba(246, 246, 246, 1) 100%);}  .mss-right {width: 100%;height: 100%;display: flex;flex-direction: column;justify-content: center;align-items: center;}  .mss-form {width: 100%;height: 200px;display: flex;flex-direction: column;justify-content: center;align-items: center;}  .mss-name-input {width: 300px;height: 40px;border: 1px solid #e5e5e5;border-radius: 10px;margin-bottom: 10px;padding: 0 10px;box-shadow: -4px -4px 10px -8px rgba(255, 255, 255, 1) inset, 4px 4px 10px -8px rgba(0, 0, 0, .3) inset;background: linear-gradient(135deg, rgba(240, 240, 240, 1) 0%, rgba(246, 246, 246, 1) 100%);}  .mss-url-input {width: 300px;height: 40px;border: 1px solid #e5e5e5;border-radius: 10px;margin-bottom: 10px;padding: 0 10px;box-shadow: -4px -4px 10px -8px rgba(255, 255, 255, 1) inset, 4px 4px 10px -8px rgba(0, 0, 0, .3) inset;background: linear-gradient(135deg, rgba(240, 240, 240, 1) 0%, rgba(246, 246, 246, 1) 100%);}  .mss-icon-input {width: 300px;height: 40px;border: 1px solid #e5e5e5;border-radius: 10px;margin-bottom: 10px;padding: 0 10px;box-shadow: -4px -4px 10px -8px rgba(255, 255, 255, 1) inset, 4px 4px 10px -8px rgba(0, 0, 0, .3) inset;background: linear-gradient(135deg, rgba(240, 240, 240, 1) 0%, rgba(246, 246, 246, 1) 100%);}  .mss-add-btn {width: 300px;height: 40px;border: 1px solid #e5e5e5;border-radius: 10px;margin-bottom: 10px;padding: 0 10px;background: #e5e5e5;cursor: pointer;box-shadow: -4px -4px 10px -8px rgba(255, 255, 255, 1), 4px 4px 10px -8px rgba(0, 0, 0, .3);background: linear-gradient(135deg, rgba(230, 230, 230, 1) 0%, rgba(246, 246, 246, 1) 100%);}  .mss-close {position: absolute;top: 22.5px;right: 10px;width: 30px;display: flex;flex-direction: row;justify-content: center;align-items: center;height: 30px;margin: 0 10px;cursor: pointer;}  .mss-cancel-btn {position: absolute;bottom: 10px;right: 100px;width: 80px;height: 40px;border: 1px solid #e5e5e5;border-radius: 10px;background: #e5e5e5;cursor: pointer;box-shadow: -4px -4px 10px -8px rgba(255, 255, 255, 1), 4px 4px 10px -8px rgba(0, 0, 0, .3);background: linear-gradient(135deg, rgba(230, 230, 230, 1) 0%, rgba(246, 246, 246, 1) 100%);}  .mss-button-btn {position: absolute;bottom: 10px;right: 10px;width: 80px;height: 40px;border: 1px solid #e5e5e5;border-radius: 10px;background: #e5e5e5;cursor: pointer;box-shadow: -4px -4px 10px -8px rgba(255, 255, 255, 1), 4px 4px 10px -8px rgba(0, 0, 0, .3);background: linear-gradient(135deg, rgba(230, 230, 230, 1) 0%, rgba(246, 246, 246, 1) 100%);} input{box-sizing:border-box;-webkit-box-sizing: border-box;}',

        add(css) {
            this.globalStyle.innerHTML += css;
        },

        get() {
            return createElement('style', 'ms-global-style', '', this.globalStyle);
        }
    }

    function generateIconUrl(url) {
        const api = 'https://icon.horse/icon/';
        let hostname = '';
        try {
            new RegExp('^(https:\\/\\/)').test(url) || (url = `https://${url}`);
            hostname = new URL(url).hostname;
        } catch (e) {
            alert('网址格式错误');
            return;
        }
        return api + hostname;
    }

    //Toast
    function toast(text) {
        const toast = createElement('div', 'mss-toast');
        toast.innerText = text;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.remove();
        }, 2000);
    }

    const addStyles = function _addStyles(element, styles) {
        Object.assign(element.style, styles);
    }

    function turnOffToggleSortMode() {
        GM_getValue('sortMode') === 'on' && msComponent.toggle();
    }

    // 展开或折叠组件
    function toggleMSComponent(scrollTop, expandCritical, collapseCritical) {
        const component = selectElement('#ms-component');
        if (scrollTop > expandCritical) {
            component.classList.add('ms-mini');
        } else if (scrollTop <= collapseCritical) {
            component.classList.remove('ms-mini');
        }
    }

    function search(searchEngine) {
        const handler = getHandler();
        window.open(searchEngine.url + handler.getSearchContent());
    }

    // 获取系统类型
    function getSystem() {
        const {userAgent} = navigator;
        const isMac = userAgent.indexOf('Mac') > -1;
        const isIpad = userAgent.indexOf('iPad') > -1;
        if (isMac) {
            return 'mac';
        }
        if (isIpad) {
            return 'ipad';
        }
        return 'win';
    }

    function createElement(tag, className, style, content) {
        const element = document.createElement(tag);
        className && (element.className = className);
        style && (element.style = style);
        content && (element.innerHTML = content);
        return element;
    }

    function createElementWithId(tag, id, style, content) {
        const element = document.createElement(tag);
        id && (element.id = id);
        style && (element.style = style);
        content && (element.innerHTML = content);
        return element;
    }

    function createInput(type, className, style, value, placeholder) {
        const input = document.createElement('input');
        type && (input.type = type);
        className && (input.className = className);
        style && (input.style = style);
        value && (input.value = value);
        placeholder && (input.placeholder = placeholder);
        return input;
    }

    function selectElement(className) {
        return document.querySelector(className);
    }

    function selectElementAll(className) {
        return document.querySelectorAll(className);
    }

    Node.prototype.appendChildren = function (...children) {
        children.forEach((child) => {
            this.appendChild(child);
        });
    }


    if (GM_getValue('searchEngines') == null) {
        // TODO: 复选框确认是否使用搜索引擎
        const searchEngines = [
            {
                name: '百度',
                url: 'https://www.baidu.com/s?wd=',
                icon: 'https://icon.horse/icon/www.baidu.com',
            },
            {
                name: '谷歌',
                url: 'https://www.google.com/search?q=',
                icon: 'https://icon.horse/icon/www.google.com',
            },
            {
                name: '必应',
                url: 'https://www.bing.com/search?q=',
                icon: 'https://icon.horse/icon/www.bing.com',
            },
            {
                name: 'YouTube',
                url: 'https://www.youtube.com/results?search_query=',
                icon: 'https://icon.horse/icon/www.youtube.com',
            },
            {
                name: '哔哩哔哩',
                url: 'https://search.bilibili.com/all?keyword=',
                icon: 'https://icon.horse/icon/www.bilibili.com',
            },
            {
                name: '知乎',
                url: 'https://www.zhihu.com/search?type=content&q=',
                icon: 'https://icon.horse/icon/www.zhihu.com',
            },
            {
                name: 'CSDN',
                url: 'https://so.csdn.net/so/search/s.do?q=',
                icon: 'https://icon.horse/icon/so.csdn.net',
            },
            {
                name: 'DuckDuckGo',
                url: 'https://duckduckgo.com/?q=',
                icon: 'https://icon.horse/icon/www.duckduckgo.com',
            },
            {
                name: 'Settings',
                toggleSortIcon: '<svg class=\'ms-toggle-sort-icon\' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="19" height="19"><path fill="none" d="M0 0h24v24H0z"/><path d="M16.05 12.05L21 17l-4.95 4.95-1.414-1.414 2.536-2.537L4 18v-2h13.172l-2.536-2.536 1.414-1.414zm-8.1-10l1.414 1.414L6.828 6 20 6v2H6.828l2.536 2.536L7.95 11.95 3 7l4.95-4.95z"/></svg>',
                plusIcon: `<svg class='ms-plus-icon' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"><path fill="none" d="M0 0h24v24H0z"/><path d="M2 12c0-.865.11-1.703.316-2.504A3 3 0 0 0 4.99 4.867a9.99 9.99 0 0 1 4.335-2.505 3 3 0 0 0 5.348 0 9.99 9.99 0 0 1 4.335 2.505 3 3 0 0 0 2.675 4.63c.206.8.316 1.638.316 2.503 0 .865-.11 1.703-.316 2.504a3 3 0 0 0-2.675 4.629 9.99 9.99 0 0 1-4.335 2.505 3 3 0 0 0-5.348 0 9.99 9.99 0 0 1-4.335-2.505 3 3 0 0 0-2.675-4.63C2.11 13.704 2 12.866 2 12zm4.804 3c.63 1.091.81 2.346.564 3.524.408.29.842.541 1.297.75A4.993 4.993 0 0 1 12 18c1.26 0 2.438.471 3.335 1.274.455-.209.889-.46 1.297-.75A4.993 4.993 0 0 1 17.196 15a4.993 4.993 0 0 1 2.77-2.25 8.126 8.126 0 0 0 0-1.5A4.993 4.993 0 0 1 17.195 9a4.993 4.993 0 0 1-.564-3.524 7.989 7.989 0 0 0-1.297-.75A4.993 4.993 0 0 1 12 6a4.993 4.993 0 0 1-3.335-1.274 7.99 7.99 0 0 0-1.297.75A4.993 4.993 0 0 1 6.804 9a4.993 4.993 0 0 1-2.77 2.25 8.126 8.126 0 0 0 0 1.5A4.993 4.993 0 0 1 6.805 15zM12 15a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0-2a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/></svg>`,
            },
        ];
        GM_setValue('searchEngines', searchEngines);
    }

    GM_setValue('sortMode', 'off');

    const handler = getHandler();
    handler.preprocess.call();
    handler.addMSComponent.call();
    handler.addScrollListener.call();

    selectElement('#ms-component').appendChild(msStyle.get());
}());
