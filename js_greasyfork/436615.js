// ==UserScript==
// @name         江苏大学工具集合
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动填充江苏大学相关内容
// @author       jklujklu
// @match        https://*.ujs.edu.cn/*
// @match        http://*.ujs.edu.cn/*
// @icon         https://www.google.com/s2/favicons?domain=ujs.edu.cn
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/436615/%E6%B1%9F%E8%8B%8F%E5%A4%A7%E5%AD%A6%E5%B7%A5%E5%85%B7%E9%9B%86%E5%90%88.user.js
// @updateURL https://update.greasyfork.org/scripts/436615/%E6%B1%9F%E8%8B%8F%E5%A4%A7%E5%AD%A6%E5%B7%A5%E5%85%B7%E9%9B%86%E5%90%88.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...

    class UJS {
        static baidu_token = 'https://aip.baidubce.com/oauth/2.0/token';
        static baidu_ocr = 'https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic';

        #access_token
        #baidu_client_id
        #baidu_client_secret

        constructor() {
            this.#access_token = ''
            this.#baidu_client_id = '6I7HtRFpHAUhmMX5mcmo44Rk'
            this.#baidu_client_secret = 'f391XyndBEGLKWmPGmexHWI1WhxYo85M'
        }

        init() {
            console.log('init')
            const host = window.location.host
            if (host === 'pass.ujs.edu.cn') {
                this.initLoginForm();
            }
            GM_registerMenuCommand("辅导员评测", () => {
                this.fudaoyuan();
            }, "S");
            GM_registerMenuCommand("登录", async () => {
                await this.login();
            }, "L");
        }

        fudaoyuan() {
            const tables = this.#getIframeDocument(document.querySelector('iframe')).querySelectorAll('td > table[id]');
            tables.forEach(item => {
                item.querySelector('td:nth-child(1) input').checked = true;
            })
            tables[tables.length - 1].querySelector('td:nth-child(2) input').checked = true;
        }

        initLoginForm() {
            const btn = document.createElement('div');
            btn.innerText = '保存账号';
            btn.classList.add('auth_login_btn', 'primary', 'full_width');
            btn.onclick = () => {
                const username = document.querySelector('input[id="username"]').value;
                const pwd = document.querySelector('input[id="password"]').value;
                if (username && pwd) {
                    GM_setValue("username", username);
                    GM_setValue("password", pwd);
                    alert(`username: ${username}\npassword: ${pwd}\n已保存！`)
                } else {
                    alert('用户名或密码为空！');
                }
            }
            document.querySelector('#casLoginForm').appendChild(btn);
        }

        async login() {
            const username = GM_getValue("username");
            const pwd = GM_getValue("password");
            if (username && pwd) {
                document.querySelector('input[id="username"]').value = username;
                document.querySelector('input[id="password"]').value = pwd;
            } else {
                alert('用户名或密码为空，请更新！');
                return;
            }
            if (this.#access_token === '') {
                const rs = await this.#get(UJS.baidu_token, {
                    'grant_type': 'client_credentials',
                    'client_id': this.#baidu_client_id,
                    'client_secret': this.#baidu_client_secret
                })
                this.#access_token = rs['access_token']
            }

            while (true) {
                const capImg = await this.#toDataURL('https://pass.ujs.edu.cn/cas/captcha.html?ts=565')
                console.log(capImg);
                document.querySelector('#captchaImg').src = capImg
                const ocr = await this.#post(`${UJS.baidu_ocr}?access_token=${this.#access_token}`, {image: capImg});
                const capText = ocr['words_result'][0]['words'].replaceAll(' ', '')
                document.querySelector('input[id="captchaResponse"]').value = capText;
                if (capText.length === 4) {
                    break
                } else {
                    await this.#sleep(1000);
                }
            }
        }

        #get(url, params) {
            return new Promise(resolve => {
                GM_xmlhttpRequest({
                    url: url + '?' + Object.keys(params).map(key => key + "=" + encodeURIComponent(params[key])).join("&"),
                    method: 'GET',
                    onload: response => {
                        console.log("请求成功");
                        console.log(response.responseText);
                        resolve(JSON.parse(response.responseText))
                    },
                    onerror: response => {
                        console.log("ocr failed!");
                    }
                });
            })
        }

        #post(url, data) {
            return new Promise(resolve => {
                GM_xmlhttpRequest({
                    url: url,
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    data: Object.keys(data).map(key => key + "=" + encodeURIComponent(data[key])).join("&"),
                    method: 'POST',
                    onload: response => {
                        console.log("请求成功");
                        console.log(response.responseText);
                        resolve(JSON.parse(response.responseText))
                    },
                    onerror: response => {
                        console.log("ocr failed!");
                    }
                });
            })
        }

        #sleep(time) {
            return new Promise((resolve) => setTimeout(resolve, time));
        }

        #toDataURL(url) {
            return fetch(url)
                .then(response => response.blob())
                .then(blob => new Promise((resolve, reject) => {
                    const reader = new FileReader()
                    reader.onloadend = () => resolve(reader.result)
                    reader.onerror = reject
                    reader.readAsDataURL(blob)
                }))
        }

        #getIframeDocument(element) {
            return element.contentDocument || element.contentWindow.document;
        }
    }

    new UJS().init();

})();