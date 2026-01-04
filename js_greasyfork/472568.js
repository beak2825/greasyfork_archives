// ==UserScript==
// @name              阳光模式助手 (原夜间模式助手)
// @namespace         https://github.com/syhyz1990/darkmode
// @namespace         https://www.youxiaohou.com/tool/install-darkmode.html
// @version           2.2.2.1
// @description       实现特定网站的白天模式，支持手动设置网站
// @author            YouXiaoHou , update by krtttt
// @license           MIT
// @homepage          https://www.youxiaohou.com/tool/install-darkmode.html
// @supportURL        https://github.com/syhyz1990/darkmode
// @match             *://*/*
// @require           https://unpkg.com/darkrule@latest/dist/rule.min.js
// @require           https://unpkg.com/sweetalert2@10.16.6/dist/sweetalert2.min.js
// @resource          swalStyle https://unpkg.com/sweetalert2@10.16.6/dist/sweetalert2.min.css
// @run-at            document-start
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_registerMenuCommand
// @grant             GM_getResourceText
// @icon              data:image/svg+xml;utf8,%3Csvg%20class%3D%22icon%22%20style%3D%22width%3A%201em%3Bheight%3A%201em%3Bvertical-align%3A%20middle%3Bfill%3A%20currentColor%3Boverflow%3A%20hidden%3B%22%20viewBox%3D%220%200%201024%201024%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M1024%200H0v1024h1024V0z%22%20fill%3D%22%23FFFFFF%22%20opacity%3D%22.01%22%20%2F%3E%3Cpath%20d%3D%22M512%20162.133333c-17.066667%200-34.133333-12.8-34.133333-34.133333V64c0-17.066667%2012.8-34.133333%2034.133333-34.133333s34.133333%2012.8%2034.133333%2034.133333v68.266667c0%2017.066667-17.066667%2029.866667-34.133333%2029.866666zM827.733333%20196.266667l-46.933333%2046.933333%2046.933333-46.933333zM780.8%20273.066667c-8.533333%200-17.066667-4.266667-21.333333-8.533334-12.8-12.8-12.8-34.133333%200-46.933333L806.4%20170.666667c12.8-12.8%2034.133333-12.8%2046.933333%200%2012.8%2012.8%2012.8%2034.133333%200%2046.933333l-46.933333%2046.933333c-8.533333%208.533333-17.066667%208.533333-25.6%208.533334zM960%20541.866667h-68.266667c-17.066667%200-34.133333-12.8-34.133333-34.133334s12.8-34.133333%2034.133333-34.133333h68.266667c17.066667%200%2034.133333%2012.8%2034.133333%2034.133333s-17.066667%2034.133333-34.133333%2034.133334zM827.733333%20827.733333l-46.933333-46.933333%2046.933333%2046.933333zM827.733333%20861.866667c-8.533333%200-17.066667-4.266667-21.333333-8.533334l-46.933333-46.933333c-12.8-12.8-12.8-34.133333%200-46.933333%2012.8-12.8%2034.133333-12.8%2046.933333%200l46.933333%2046.933333c12.8%2012.8%2012.8%2034.133333%200%2046.933333-8.533333%204.266667-17.066667%208.533333-25.6%208.533334zM512%20989.866667c-17.066667%200-34.133333-12.8-34.133333-34.133334v-68.266666c0-17.066667%2012.8-34.133333%2034.133333-34.133334s34.133333%2012.8%2034.133333%2034.133334v68.266666c0%2021.333333-17.066667%2034.133333-34.133333%2034.133334zM196.266667%20827.733333l46.933333-46.933333-46.933333%2046.933333zM196.266667%20861.866667c-8.533333%200-17.066667-4.266667-21.333334-8.533334-12.8-12.8-12.8-34.133333%200-46.933333l46.933334-46.933333c12.8-12.8%2034.133333-12.8%2046.933333%200%2012.8%2012.8%2012.8%2034.133333%200%2046.933333L217.6%20853.333333c-4.266667%204.266667-12.8%208.533333-21.333333%208.533334zM132.266667%20541.866667H64c-17.066667%200-34.133333-12.8-34.133333-34.133334s12.8-34.133333%2034.133333-34.133333h68.266667c17.066667%200%2034.133333%2012.8%2034.133333%2034.133333s-17.066667%2034.133333-34.133333%2034.133334zM196.266667%20196.266667l46.933333%2046.933333-46.933333-46.933333zM243.2%20273.066667c-8.533333%200-17.066667-4.266667-21.333333-8.533334L170.666667%20217.6c-8.533333-12.8-8.533333-34.133333%200-46.933333%208.533333-12.8%2034.133333-12.8%2046.933333%200l46.933333%2046.933333c12.8%2012.8%2012.8%2034.133333%200%2046.933333-4.266667%208.533333-12.8%208.533333-21.333333%208.533334zM512%20797.866667c-157.866667%200-290.133333-128-290.133333-290.133334s128-290.133333%20290.133333-290.133333%20290.133333%20128%20290.133333%20290.133333-132.266667%20290.133333-290.133333%20290.133334z%20m0-512c-123.733333%200-226.133333%20102.4-226.133333%20226.133333s102.4%20226.133333%20226.133333%20226.133333%20226.133333-102.4%20226.133333-226.133333-102.4-226.133333-226.133333-226.133333z%22%20fill%3D%22%23FF6600%22%20%2F%3E%3C%2Fsvg%3E
//
// @downloadURL https://update.greasyfork.org/scripts/472568/%E9%98%B3%E5%85%89%E6%A8%A1%E5%BC%8F%E5%8A%A9%E6%89%8B%20%28%E5%8E%9F%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F%E5%8A%A9%E6%89%8B%29.user.js
// @updateURL https://update.greasyfork.org/scripts/472568/%E9%98%B3%E5%85%89%E6%A8%A1%E5%BC%8F%E5%8A%A9%E6%89%8B%20%28%E5%8E%9F%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F%E5%8A%A9%E6%89%8B%29.meta.js
// ==/UserScript==

;(function () {
    'use strict';

    let util = {
        getValue(name) {
            return GM_getValue(name);
        },

        setValue(name, value) {
            GM_setValue(name, value);
        },

        addStyle(id, tag, css) {
            tag = tag || 'style';
            let doc = document, styleDom = doc.getElementById(id);
            if (styleDom) return;
            let style = doc.createElement(tag);
            style.rel = 'stylesheet';
            style.id = id;
            tag === 'style' ? style.innerHTML = css : style.href = css;
            doc.head.appendChild(style);
        },

        hover(ele, fn1, fn2) {
            ele.onmouseenter = function () {  //移入事件
                fn1.call(ele);
            };
            ele.onmouseleave = function () { //移出事件
                fn2.call(ele);
            };
        },

        addThemeColor(color) {
            let doc = document, meta = doc.getElementsByName('theme-color')[0];
            if (meta) return meta.setAttribute('content', color);
            let metaEle = doc.createElement('meta');
            metaEle.name = 'theme-color';
            metaEle.content = color;
            doc.head.appendChild(metaEle);
        },
        getThemeColor() {
            let meta = document.getElementsByName('theme-color')[0];
            if (meta) {
                return meta.content;
            }
            return '#ffffff';
        },

        removeElementById(eleId) {
            let ele = document.getElementById(eleId);
            ele && ele.parentNode.removeChild(ele);
        },

        hasElementById(eleId) {
            return document.getElementById(eleId);
        },

        filter: '-webkit-filter: url(#dark-mode-filter) !important; filter: url(#dark-mode-filter) !important;',
        reverseFilter: '-webkit-filter: url(#dark-mode-reverse-filter) !important; filter: url(#dark-mode-reverse-filter) !important;',
        firefoxFilter: `filter: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><filter id="dark-mode-filter" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0.283 -0.567 -0.567 0 0.925 -0.567 0.283 -0.567 0 0.925 -0.567 -0.567 0.283 0 0.925 0 0 0 1 0"/></filter></svg>#dark-mode-filter') !important;`,
        firefoxReverseFilter: `filter: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><filter id="dark-mode-reverse-filter" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0.333 -0.667 -0.667 0 1 -0.667 0.333 -0.667 0 1 -0.667 -0.667 0.333 0 1 0 0 0 1 0"/></filter></svg>#dark-mode-reverse-filter') !important;`,
        noneFilter: '-webkit-filter: none !important; filter: none !important;',
    };

    let main = {
        /**
         * 配置默认值
         */
        initValue() {
            let value = [{
                name: 'dark_mode',
                value: 'light'
            }, {
                name: 'button_position',
                value: 'left'
            }, {
                name: 'button_size',
                value: 32
            }, {
                name: 'exclude_list',
                value: []
            }, {
                name: 'origin_theme_color',
                value: '#ffffff'
            }];

            value.forEach((v) => {
                util.getValue(v.name) === undefined && util.setValue(v.name, v.value);
            });
        },

        addExtraStyle() {
            try {
                return darkModeRule;
            } catch (e) {
                return '';
            }
        },

        createDarkFilter() {
            if (util.hasElementById('dark-mode-svg')) return;
            let svgDom = '<svg id="dark-mode-svg" style="height: 0; width: 0;"><filter id="dark-mode-filter" x="0" y="0" width="99999" height="99999"><feColorMatrix type="matrix" values="0.283 -0.567 -0.567 0 0.925 -0.567 0.283 -0.567 0 0.925 -0.567 -0.567 0.283 0 0.925 0 0 0 1 0"></feColorMatrix></filter><filter id="dark-mode-reverse-filter" x="0" y="0" width="99999" height="99999"><feColorMatrix type="matrix" values="0.333 -0.667 -0.667 0 1 -0.667 0.333 -0.667 0 1 -0.667 -0.667 0.333 0 1 0 0 0 1 0"></feColorMatrix></filter></svg>';
            let div = document.createElementNS('http://www.w3.org/1999/xhtml', 'div');
            div.innerHTML = svgDom;
            let frag = document.createDocumentFragment();
            while (div.firstChild)
                frag.appendChild(div.firstChild);
            document.head.appendChild(frag);
        },

        createDarkStyle() {
            util.addStyle('dark-mode-style', 'style', `
                @media screen {
                    html {
                        ${this.isFirefox() ? util.firefoxFilter : util.filter}
                        scrollbar-color: #454a4d #202324;
                    }
            
                    /* Default Reverse rule */
                    img, 
                    video, 
                    iframe,
                    canvas,
                    :not(object):not(body) > embed,
                    object,
                    svg image,
                    [style*="background:url"],
                    [style*="background-image:url"],
                    [style*="background: url"],
                    [style*="background-image: url"],
                    [background],
                    twitterwidget,
                    .sr-reader,
                    .no-dark-mode,
                    .sr-backdrop {
                        ${this.isFirefox() ? util.firefoxReverseFilter : util.reverseFilter}
                    }
            
                    [style*="background:url"] *,
                    [style*="background-image:url"] *,
                    [style*="background: url"] *,
                    [style*="background-image: url"] *,
                    input,
                    [background] *,
                    img[src^="https://s0.wp.com/latex.php"],
                    twitterwidget .NaturalImage-image {
                        ${util.noneFilter}
                    }
            
                    /* Text contrast */
                    html {
                        text-shadow: 0 0 0 !important;
                    }
            
                    /* Full screen */
                    .no-filter,
                    :-webkit-full-screen,
                    :-webkit-full-screen *,
                    :-moz-full-screen,
                    :-moz-full-screen *,
                    :fullscreen,
                    :fullscreen * {
                        ${util.noneFilter}
                    }
                    
                    ::-webkit-scrollbar {
                        background-color: #202324;
                        color: #aba499;
                    }
                    ::-webkit-scrollbar-thumb {
                        background-color: #454a4d;
                    }
                    ::-webkit-scrollbar-thumb:hover {
                        background-color: #575e62;
                    }
                    ::-webkit-scrollbar-thumb:active {
                        background-color: #484e51;
                    }
                    ::-webkit-scrollbar-corner {
                        background-color: #181a1b;
                    }
            
                    /* Page background */
                    html {
                        background: #fff !important;
                    }
                    
                    ${this.addExtraStyle()}
                }
            
                @media print {
                    .no-print {
                        display: none !important;
                    }
                }`);
        },

        setThemeColor() {
            util.setValue('origin_theme_color', util.getThemeColor());
        },

        enableDarkMode() {
            if (this.isFullScreen()) return;
            !this.isFirefox() && this.createDarkFilter();
            this.createDarkStyle();
            util.addThemeColor('#131313');
        },

        disableDarkMode() {
            util.removeElementById('dark-mode-svg');
            util.removeElementById('dark-mode-style');
            util.addThemeColor(util.getValue('origin_theme_color'));
        },

        addButton() {
            if (this.isTopWindow()) {
                let buttonSize = util.getValue('button_size');
                let buttonPosition = util.getValue('button_position');
                let svgSize = parseInt(buttonSize * 0.6);
                let buttonWidth = +buttonSize + 2;
                let html = `<div class="no-print" id="darkmode-container" style="position: fixed; ${buttonPosition}: -${buttonWidth / 2}px; bottom: 25px; cursor: pointer; z-index: 2147483647; user-select: none;"><div id="darkmode-button" style="width: ${buttonSize}px;height: ${buttonSize}px;background: #fff;border:1px solid #f6f6f6;display: flex;align-items: center;justify-content: center;border-radius: 50%;position: relative;"><svg fill="#009fe8" id="svg-light" style="width: ${svgSize}px;height: ${svgSize}px;margin: 0;padding: 0;transition: transform 0.3s, opacity 0.3s;position: absolute;${!this.isDarkMode() ? 'transform: scale(0);opacity: 0;' : ''}" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M587.264 104.96c33.28 57.856 52.224 124.928 52.224 196.608 0 218.112-176.128 394.752-393.728 394.752-29.696 0-58.368-3.584-86.528-9.728C223.744 832.512 369.152 934.4 538.624 934.4c229.376 0 414.72-186.368 414.72-416.256 1.024-212.992-159.744-389.12-366.08-413.184z"></path><path d="M340.48 567.808l-23.552-70.144-70.144-23.552 70.144-23.552 23.552-70.144 23.552 70.144 70.144 23.552-70.144 23.552-23.552 70.144zM168.96 361.472l-30.208-91.136-91.648-30.208 91.136-30.208 30.72-91.648 30.208 91.136 91.136 30.208-91.136 30.208-30.208 91.648z"></path></svg><svg fill="#009fe8" id="svg-dark" style="width: ${svgSize}px;height: ${svgSize}px;margin: 0;padding: 0;transition: transform 0.3s, opacity 0.3s;position: absolute;${this.isDarkMode() ? 'transform: scale(0);opacity: 0;' : ''}" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M234.24 512a277.76 277.76 0 1 0 555.52 0 277.76 277.76 0 1 0-555.52 0zM512 187.733a42.667 42.667 0 0 1-42.667-42.666v-102.4a42.667 42.667 0 0 1 85.334 0v102.826A42.667 42.667 0 0 1 512 187.733zm-258.987 107.52a42.667 42.667 0 0 1-29.866-12.373l-72.96-73.387a42.667 42.667 0 0 1 59.306-59.306l73.387 72.96a42.667 42.667 0 0 1 0 59.733 42.667 42.667 0 0 1-29.867 12.373zm-107.52 259.414H42.667a42.667 42.667 0 0 1 0-85.334h102.826a42.667 42.667 0 0 1 0 85.334zm34.134 331.946a42.667 42.667 0 0 1-29.44-72.106l72.96-73.387a42.667 42.667 0 0 1 59.733 59.733l-73.387 73.387a42.667 42.667 0 0 1-29.866 12.373zM512 1024a42.667 42.667 0 0 1-42.667-42.667V878.507a42.667 42.667 0 0 1 85.334 0v102.826A42.667 42.667 0 0 1 512 1024zm332.373-137.387a42.667 42.667 0 0 1-29.866-12.373l-73.387-73.387a42.667 42.667 0 0 1 0-59.733 42.667 42.667 0 0 1 59.733 0l72.96 73.387a42.667 42.667 0 0 1-29.44 72.106zm136.96-331.946H878.507a42.667 42.667 0 1 1 0-85.334h102.826a42.667 42.667 0 0 1 0 85.334zM770.987 295.253a42.667 42.667 0 0 1-29.867-12.373 42.667 42.667 0 0 1 0-59.733l73.387-72.96a42.667 42.667 0 1 1 59.306 59.306l-72.96 73.387a42.667 42.667 0 0 1-29.866 12.373z"></path></svg></div></div>`;

                document.body.insertAdjacentHTML('beforeend', html);

                let containerDOM = document.getElementById('darkmode-container');
                let buttonDOM = document.getElementById('darkmode-button');
                let lightDOM = document.getElementById('svg-light');
                let darkDOM = document.getElementById('svg-dark');

                util.hover(containerDOM, () => {
                    containerDOM.style[buttonPosition] = '0px';
                    containerDOM.style.transition = `${buttonPosition} 0.3s`
                }, () => {
                    containerDOM.style[buttonPosition] = `-${buttonWidth / 2}px`;
                    containerDOM.style.transition = `${buttonPosition} 0.3s`
                });

                buttonDOM.addEventListener("click", () => {
                    if (this.isDarkMode()) { //黑暗模式变为正常模式
                        lightDOM.style.transform = 'scale(0)';
                        lightDOM.style.opacity = '0';
                        darkDOM.style.transform = 'scale(1)';
                        darkDOM.style.opacity = '1';
                        util.setValue('dark_mode', 'light');
                        this.disableDarkMode();
                    } else {
                        lightDOM.style.transform = 'scale(1)';
                        lightDOM.style.opacity = '1';
                        darkDOM.style.transform = 'scale(0)';
                        darkDOM.style.opacity = '0';
                        util.setValue('dark_mode', 'dark');
                        this.enableDarkMode();
                    }
                });
            }
        },

        registerMenuCommand() {
            if (this.isTopWindow()) {
                let whiteList = util.getValue('exclude_list');
                let host = location.host;
                if (whiteList.includes(host)) {
                    GM_registerMenuCommand('💡 对当前网站关闭插件：❌', () => {
                        let index = whiteList.indexOf(host);
                        whiteList.splice(index, 1);
                        util.setValue('exclude_list', whiteList);
                        history.go(0);
                    });
                } else {
                    GM_registerMenuCommand('💡 对当前网站开启插件：✔️', () => {
                        whiteList.push(host);
                        util.setValue('exclude_list', Array.from(new Set(whiteList)));
                        history.go(0);
                    });
                }

                GM_registerMenuCommand('⚙️ 设置', () => {
                    let style = `
                                .darkmode-popup { font-size: 14px !important; }
                                .darkmode-center { display: flex;align-items: center; }
                                .darkmode-setting-label { display: flex;align-items: center;justify-content: space-between;padding-top: 15px; }
                                .darkmode-setting-label-col { display: flex;align-items: flex-start;;padding-top: 15px;flex-direction:column }
                                .darkmode-setting-radio { width: 16px;height: 16px; }
                                .darkmode-setting-textarea { width: 100%; margin: 14px 0 0; height: 100px; resize: none; border: 1px solid #bbb; box-sizing: border-box; padding: 5px 10px; border-radius: 5px; color: #666; line-height: 1.2; }
                                .darkmode-setting-input { border: 1px solid #bbb; box-sizing: border-box; padding: 5px 10px; border-radius: 5px; width: 100px}
                            `;
                    util.addStyle('darkmode-style', 'style', style);
                    util.addStyle('swal-pub-style', 'style', GM_getResourceText('swalStyle'));
                    let excludeListStr = util.getValue('exclude_list').join('\n');

                    let dom = `<div style="font-size: 1em;">
                              <label class="darkmode-setting-label">按钮位置 
                              <div id="S-Dark-Position" class="darkmode-center">
                              <input type="radio" name="buttonPosition" ${util.getValue('button_position') === 'left' ? 'checked' : ''} class="darkmode-setting-radio" value="left">
                              左 
                              <input type="radio" name="buttonPosition" style="margin-left: 30px;" ${util.getValue('button_position') === 'right' ? 'checked' : ''} class="darkmode-setting-radio" value="right">
                              右
                              </div>
                              </label>
                              <label class="darkmode-setting-label"><span style="text-align: left;">按钮大小（默认：30）<small id="currentSize">当前：${util.getValue('button_size')}</small></span>
                              <input id="S-Dark-Size" type="range" class="darkmode-setting-range" min="20" max="50" step="2" value="${util.getValue('button_size')}">
                              </label>
                              <label class="darkmode-setting-label-col">下列网址会启动本插件 
                              <textarea placeholder="列表中的域名将会启动本插件，一行一个，例如：v.youku.com" id="S-Dark-Exclude" class="darkmode-setting-textarea">${excludeListStr}</textarea></label>
                            </div>`;
                    Swal.fire({
                        title: '阳光模式配置',
                        html: dom,
                        icon: 'info',
                        showCloseButton: true,
                        confirmButtonText: '保存',
                        footer: '<div style="text-align: center;font-size: 1em;">点击查看 <a href="https://www.youxiaohou.com/tool/install-darkmode.html" target="_blank">使用说明</a>，助手免费开源，Powered by <a href="https://www.youxiaohou.com">油小猴</a></div>',
                        customClass: {
                            popup: 'darkmode-popup',
                        },
                    }).then((res) => {
                        res.isConfirmed && history.go(0);
                    });

                    document.getElementById('S-Dark-Position').addEventListener('click', (e) => {
                        e.target.tagName === "INPUT" && util.setValue('button_position', e.target.value);
                    });
                    document.getElementById('S-Dark-Size').addEventListener('change', (e) => {
                        util.setValue('button_size', e.currentTarget.value);
                        document.getElementById('currentSize').innerText = '当前：' + e.currentTarget.value;
                    });
                    document.getElementById('S-Dark-Exclude').addEventListener('change', (e) => {
                        util.setValue('exclude_list', Array.from(new Set(e.currentTarget.value.split('\n').filter(Boolean))));
                    });
                });
            }
        },

        isTopWindow() {
            return window.self === window.top;
        },

        addListener() {
            document.addEventListener("fullscreenchange", (e) => {
                if (this.isFullScreen()) {
                    //进入全屏
                    this.disableDarkMode();
                } else {
                    //退出全屏
                    this.isDarkMode() && this.enableDarkMode();
                }
            });
        },

        isDarkMode() {
            return util.getValue('dark_mode') === 'dark';
        },
        isInExcludeList() {
            return !util.getValue('exclude_list').includes(location.host);
        },

        isFullScreen() {
            return document.fullscreenElement;
        },

        isFirefox() {
            return /Firefox/i.test(navigator.userAgent);
        },

        firstEnableDarkMode() {
            if (document.head) {
                this.isDarkMode() && this.enableDarkMode();
            }
            const headObserver = new MutationObserver(() => {
                this.isDarkMode() && this.enableDarkMode();
            });
            headObserver.observe(document.head, {childList: true, subtree: true});

            if (document.body) {
                this.addButton();
            } else {
                const bodyObserver = new MutationObserver(() => {
                    if (document.body) {
                        bodyObserver.disconnect();
                        this.addButton();
                    }
                });
                bodyObserver.observe(document, {childList: true, subtree: true});
            }
        },

        init() {
            this.initValue();
            this.setThemeColor();
            this.registerMenuCommand();
            if (this.isInExcludeList()) return;
            this.addListener();
            this.firstEnableDarkMode();
        }
    };


    main.init();
})();
