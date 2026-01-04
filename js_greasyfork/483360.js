// ==UserScript==
// @name         ESP辅助脚本1
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ESP辅助脚本
// @author       twt
// @match        https://esplmc-test.apps.digiwincloud.com.cn/esp-log/LoginPage.do*
// @match        https://esplmc.apps.digiwincloud.com.cn/esp-log/LoginPage.do*
// @match        https://esplmc.apps.digiwincloud.com/esp-log/LoginPage.do*
// @require      https://unpkg.com/jquery@3.6.0/dist/jquery.min.js
// @require      https://unpkg.com/sweetalert2@10.16.6/dist/sweetalert2.all.min.js
// @require      https://unpkg.com/js-md5@0.7.3/build/md5.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=digiwincloud.com.cn
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483360/ESP%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC1.user.js
// @updateURL https://update.greasyfork.org/scripts/483360/ESP%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC1.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const $ = window.jQuery;
    let doc = $(document);

    let toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3500,
        timerProgressBar: false,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    });

    const message = {
        success: (text) => {
            toast.fire({title: text, icon: 'success'});
        },
        error: (text) => {
            toast.fire({title: text, icon: 'error'});
        },
        warning: (text) => {
            toast.fire({title: text, icon: 'warning'});
        },
        info: (text) => {
            toast.fire({title: text, icon: 'info'});
        },
        question: (text) => {
            toast.fire({title: text, icon: 'question'});
        }
    };

    let base = {

        getCookie(name) {
            let cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                let cookiePair = cookies[i].trim().split('=');
                if (cookiePair.length === 2) {
                    let cookieName = cookiePair[0];
                    if (cookieName === name) {
                        return cookiePair[1];
                    }
                }
            }
            return '';
        },

        isType(obj) {
            return Object.prototype.toString.call(obj).replace(/^\[object (.+)\]$/, '$1').toLowerCase();
        },

        getValue(name) {
            return GM_getValue(name);
        },

        setValue(name, value) {
            GM_setValue(name, value);
        },

        getStorage(key) {
            try {
                return JSON.parse(localStorage.getItem(key));
            } catch (e) {
                return localStorage.getItem(key);
            }
        },

        setStorage(key, value) {
            if (this.isType(value) === 'object' || this.isType(value) === 'array') {
                return localStorage.setItem(key, JSON.stringify(value));
            }
            return localStorage.setItem(key, value);
        },

        setClipboard(text) {
            GM_setClipboard(text, 'text');
        },

        e(str) {
            return btoa(unescape(encodeURIComponent(str)));
        },

        d(str) {
            return decodeURIComponent(escape(atob(str)));
        },


        stringify(obj) {
            let str = '';
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    var value = obj[key];
                    if (Array.isArray(value)) {
                        for (var i = 0; i < value.length; i++) {
                            str += encodeURIComponent(key) + '=' + encodeURIComponent(value[i]) + '&';
                        }
                    } else {
                        str += encodeURIComponent(key) + '=' + encodeURIComponent(value) + '&';
                    }
                }
            }
            return str.slice(0, -1); // 去掉末尾的 "&"
        },

        addStyle(id, tag, css) {
            tag = tag || 'style';
            let doc = document, styleDom = doc.getElementById(id);
            if (styleDom) return;
            let style = doc.createElement(tag);
            style.rel = 'stylesheet';
            style.id = id;
            tag === 'style' ? style.innerHTML = css : style.href = css;
            doc.getElementsByTagName('head')[0].appendChild(style);
        },

        sleep(time) {
            return new Promise(resolve => setTimeout(resolve, time));
        },

        initDefaultConfig() {
            let value = [{
                name: 'username',
                value: ''
            }, {
                name: 'password',
                value: ''
            }];

            value.forEach((v) => {
                base.getValue(v.name) === undefined && base.setValue(v.name, v.value);
            });
        },

        showSetting() {
            let dom = '', btn = '',
                colorList = ['#09AAFF', '#cc3235', '#526efa', '#518c17', '#ed944b', '#f969a5', '#bca280'];
            dom += `<label class="pl-setting-label"><div class="pl-label">账号</div><input type="text"  placeholder="正式区账号" class="pl-input listener-username" value="${base.getValue('username')}"></label>`;
            dom += `<label class="pl-setting-label"><div class="pl-label">密码</div><input type="password" placeholder="正式区密码" class="pl-input listener-password" value="${base.getValue('password')}"></label>`;
            dom = '<div>' + dom + '</div>';

            Swal.fire({
                title: '密码配置',
                html: dom,
                icon: 'info',
                showCloseButton: true,
                showConfirmButton: false,
            }).then(() => {
                message.success('设置成功！');
                history.go(0);
            });

            doc.on('click', '.listener-color', async (e) => {
                base.setValue('setting_theme_color', e.target.dataset.color);
                message.success('设置成功！');
                history.go(0);
            });
            doc.on('input', '.listener-username', async (e) => {
                base.setValue('username', e.target.value);
            });
            doc.on('input', '.listener-password', async (e) => {
                base.setValue('password', e.target.value);
            });
        },

        registerMenuCommand() {
            GM_registerMenuCommand('⚙️ 设置', () => {
                this.showSetting();
            });
        }
    };
    let username;
    let password;
    const init = () => {
        let url = window.location.href;
        if (url.indexOf("test") > -1) {
            username = "DS";
            password = "DS";
        } else {
            username = base.getValue('username');
            password = base.getValue('password');
        }
    }
    $(document).ready(function() {
        base.initDefaultConfig();
        base.registerMenuCommand();
        init();
        $("#j_username").val(username);
        $("#j_password").val(password);
        if (window.location.href.indexOf("error") == -1) {
             ClickSubmit();
        }

    });



})();