// ==UserScript==
// @name              实时显示星号密码
// @namespace         https://github.com/yutian81/greasyfork-js
// @version           1.0.9
// @author            YouXiaoHou / yutian81二改
// @description       实时显示输入的密码内容，再也不担心忘记密码和输错密码了。
// @match             *://*/*
// @license           MIT
// @homepage          https://blog.811520.xyz/
// @supportURL        https://github.com/yutian81/greasyfork-js
// @require           https://unpkg.com/sweetalert2@10.16.6/dist/sweetalert2.min.js
// @resource          swalStyle https://unpkg.com/sweetalert2@10.16.6/dist/sweetalert2.min.css
// @run-at            document-start
// @grant             GM_setValue
// @grant             GM_getValue
// @grant             GM_registerMenuCommand
// @grant             GM_getResourceText
// @icon              data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjggMTI4Ij48cGF0aCBkPSJNMTAzLjkgNTEuMkg0Ni4xYy0xLjIgMC0yLjEtLjktMi4xLTIuMVYyOS44YzAtNy4xIDguOS0xNC45IDIwLTE0LjkgMTEgMCAyMCA3LjggMjAgMTQuOXY2LjRjLjYgMy42IDMuOCA2LjQgNy43IDYuNHM3LjItMi44IDcuNy02LjRoLjF2LTYuNEM5OS41IDEzLjQgODMuNiAwIDY0IDBTMjguNSAxMy40IDI4LjUgMjkuOFY0OWMwIDEuMi0uOSAyLjEtMi4xIDIuMUgyNGMtNy40IDAtMTMuMyA1LjctMTMuMyAxMi44djUxLjJjMCA3LjEgNiAxMi44IDE3LjMgMTIuOGg4MGM3LjQgMCAxMy4zLTUuNyAxMy4zLTEyLjh2LTUxYy0uMS03LjEtNi4xLTEyLjktMTMuNC0xMi45eiIgZmlsbD0iIzQ0NCIvPjxwYXRoIGQ9Ik02Ni44IDY2LjRsNCAxMi40Yy40IDEuMiAxLjUgMiAyLjggMmgxM2MyLjkgMCA0LjEgMy43IDEuNyA5LjRsLTEwLjUgNy42Yy0xIC44LTEuNSAyLjEtMS4xIDMuM2w0IDEyLjRjLjkgMi43LTIuMiA1LTQuNiAzLjNsLTEwLjUtNy42Yy0xLS44LTIuNC0uOC0zLjUgMGwtMTAuNSA3LjZjLTIuMyAxLjctNS41LS42LTQuNi0zLjNsNC0xIiBmaWxsPSIjZmZmIi8+PC9zdmc+
// @downloadURL https://update.greasyfork.org/scripts/524888/%E5%AE%9E%E6%97%B6%E6%98%BE%E7%A4%BA%E6%98%9F%E5%8F%B7%E5%AF%86%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/524888/%E5%AE%9E%E6%97%B6%E6%98%BE%E7%A4%BA%E6%98%9F%E5%8F%B7%E5%AF%86%E7%A0%81.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let MutationObserverNew = null;

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
            document.head.appendChild(style);
        },
    };

    let main = {
        initValue() {
            let value = [{
                name: 'setting_wait_time',
                value: 300
            }, {
                name: 'setting_show_method',
                value: 0
            }];

            value.forEach((v) => {
                util.getValue(v.name) === undefined && util.setValue(v.name, v.value);
            });
        },

        observer() {
            MutationObserverNew = window.MutationObserver;
        },

        registerMenuCommand() {
            GM_registerMenuCommand('⚙️ 设置', () => {
                let html = `<div style="font-size: 1em;">
                              <label class="starpassword-setting-label">显示密码方式
                              <select id="S-starpassword-show-method" class="starpassword-select">
                                <option value="0" ${util.getValue('setting_show_method') == 0 ? 'selected' : ''}>鼠标悬浮在密码框上时</option>
                                <option value="1" ${util.getValue('setting_show_method') == 1 ? 'selected' : ''}>双击密码框时</option>
                                <option value="2" ${util.getValue('setting_show_method') == 2 ? 'selected' : ''}>单击密码框时</option>
                                <option value="3" ${util.getValue('setting_show_method') == 3 ? 'selected' : ''}>按下Ctrl并单击密码框时</option>
                              </select>
                              </label>
                              <label class="starpassword-setting-label"><span>等待时间 <span id="S-starpassword-wait-time-label">（${util.getValue('setting_wait_time')}毫秒）</span></span><input type="range" id="S-starpassword-wait-time" min="0" max="1000" step="50" value="${util.getValue('setting_wait_time')}" style="width: 180px;"></label>
                            </div>`;
                Swal.fire({
                    title: '实时显示星号密码',
                    html,
                    icon: 'info',
                    showCloseButton: true,
                    confirmButtonText: '保存',
                    footer: '<div style="text-align: center;font-size: 1em;">Powered by <a href="https://blog.811520.xyz/">yutian81-青云志</a></div>',
                    customClass: {
                        container: 'starpassword-container',
                        popup: 'starpassword-popup'
                    }
                }).then((res) => {
                    res.isConfirmed && history.go(0);
                });

                document.getElementById('S-starpassword-show-method').addEventListener('change', (e) => {
                    util.setValue('setting_show_method', e.currentTarget.value);
                });
                document.getElementById('S-starpassword-wait-time').addEventListener('change', (e) => {
                    util.setValue('setting_wait_time', e.target.value);
                    document.getElementById('S-starpassword-wait-time-label').innerText = `（${e.target.value}毫秒）`;
                });
            });
        },

        addPluginStyle() {
            let style = `
                .starpassword-container { z-index: 999999!important }
                .starpassword-popup { font-size: 14px!important }
                .starpassword-setting-label { display:flex; align-items: center; justify-content: space-between; padding-top: 18px; }
                .starpassword-select { background: #f3fcff; height: 28px; width: 180px; line-height: 28px; border: 1px solid #9bc0dd; border-radius: 2px;}
                .starpassword-password-display {
                    position: absolute;
                    background: white;
                    border: 1px solid #ddd;
                    padding: 5px;
                    z-index: 1000;
                    font-size: 14px;
                    color: #333;
                    display: none; /* 初始状态隐藏 */
                }
            `;

            if (document.head) {
                util.addStyle('swal-pub-style', 'style', GM_getResourceText('swalStyle'));
                util.addStyle('starpassword-style', 'style', style);
            }

            const headObserver = new MutationObserver(() => {
                util.addStyle('swal-pub-style', 'style', GM_getResourceText('swalStyle'));
                util.addStyle('starpassword-style', 'style', style);
            });
            headObserver.observe(document.head, {childList: true, subtree: true});
        },

        isTopWindow() {
            return window.self === window.top;
        },

        showPassword() {
            const KEY_ENTER = 13;
            const KEY_CTRL = 17;
            let behave = util.getValue('setting_show_method');
            let wait = util.getValue('setting_wait_time');

            function createDisplayElement(tar) {
                let displayElement = document.createElement('div');
                displayElement.className = 'starpassword-password-display';
                displayElement.style.display = 'none';
                tar.parentNode.appendChild(displayElement);
                return displayElement;
            }

            function updateDisplayElement(displayElement, tar) {
                if (tar.value) {
                    displayElement.innerText = tar.value;
                    displayElement.style.display = 'block';
                    displayElement.style.top = `${tar.offsetTop + tar.offsetHeight}px`;
                    displayElement.style.left = `${tar.offsetLeft}px`;
                } else {
                    displayElement.style.display = 'none'; // 如果输入框为空，隐藏div
                }
            }

            function bindEvents(tar, displayElement) {
                // 实时显示密码内容
                tar.addEventListener('input', () => {
                    updateDisplayElement(displayElement, tar);
                }, false);

                // 聚焦时不显示div
                tar.addEventListener('focus', () => {
                    displayElement.style.display = 'none';
                }, false);

                // 失去焦点时隐藏div
                tar.addEventListener('blur', () => {
                    displayElement.style.display = 'none';
                }, false);
            }

            function mouseOver(tar) {
                let displayElement = createDisplayElement(tar);

                tar.addEventListener('mouseover', () => {
                    tar.isMouseOver = true;
                    setTimeout(() => {
                        if (tar.isMouseOver) {
                            updateDisplayElement(displayElement, tar);
                        }
                    }, wait);
                }, false);

                tar.addEventListener('mouseout', () => {
                    tar.isMouseOver = false;
                    displayElement.style.display = 'none';
                }, false);

                bindEvents(tar, displayElement);
            }

            function mouseDblClick(tar) {
                let displayElement = createDisplayElement(tar);

                tar.addEventListener('dblclick', () => {
                    updateDisplayElement(displayElement, tar);
                }, false);

                bindEvents(tar, displayElement);
            }

            function mouseFocus(tar) {
                let displayElement = createDisplayElement(tar);

                tar.addEventListener('focus', () => {
                    displayElement.style.display = 'none';
                }, false);

                bindEvents(tar, displayElement);
            }

            function ctrlKeyShift(tar) {
                let displayElement = createDisplayElement(tar);

                let isHide = true;
                let notPressCtrl = true;
                let onlyCtrl = true;

                tar.addEventListener('keyup', e => {
                    if (e.keyCode === KEY_CTRL) {
                        if (onlyCtrl) {
                            isHide = !isHide;
                        } else {
                            isHide = false;
                        }

                        if (isHide) {
                            displayElement.style.display = 'none';
                        } else {
                            updateDisplayElement(displayElement, tar);
                        }
                        notPressCtrl = true;
                        onlyCtrl = true;
                    }
                }, false);

                tar.addEventListener('keydown', e => {
                    if (e.keyCode === KEY_ENTER) {
                        displayElement.style.display = 'none';
                        isHide = true;
                        notPressCtrl = true;
                        onlyCtrl = true;
                    } else if (e.keyCode === KEY_CTRL) {
                        if (notPressCtrl) {
                            updateDisplayElement(displayElement, tar);
                            notPressCtrl = false;
                            onlyCtrl = true;
                        }
                    } else {
                        onlyCtrl = notPressCtrl;
                    }
                }, false);

                bindEvents(tar, displayElement);
            }

            const actionsArr = [mouseOver, mouseDblClick, mouseFocus, ctrlKeyShift];
            const doc = window.document;
            const modified = new WeakSet();

            function modifyAllInputs() {
                const passwordInputs = doc.querySelectorAll('input[type=password]');
                passwordInputs.forEach(input => {
                    if (!modified.has(input)) {
                        actionsArr[behave](input);
                        modified.add(input);
                    }
                });
            }

            function modifyWeb() {
                modifyAllInputs();
            }

            modifyWeb();

            const docObserver = new MutationObserverNew(() => {
                modifyWeb();
            });

            docObserver.observe(doc.documentElement, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['type']
            });
        },

        init() {
            this.observer();
            this.initValue();
            this.showPassword();
            this.addPluginStyle();
            this.isTopWindow() && this.registerMenuCommand();
        }
    };
    main.init();
})();
