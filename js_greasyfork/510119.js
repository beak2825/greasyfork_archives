// ==UserScript==
// @name         CookieCloud
// @namespace    http://tampermonkey.net/
// @version      v0.23
// @description  CookieCloud的tampermonkey版本，目前仅支持上传cookie，兼容移动端gear浏览器；
// @author       tomato
// @icon         https://store-images.s-microsoft.com/image/apps.63473.a0ccb631-d5e7-422b-bcc7-c0405274114b.be044f83-1292-4e84-a65d-e0527d895863.05fc1666-519a-4d36-8b67-8110c70b45cc?mode=scale&h=64&q=90&w=64
// @match        *://*/*
// @grant        GM_cookie
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @connect *
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/510119/CookieCloud.user.js
// @updateURL https://update.greasyfork.org/scripts/510119/CookieCloud.meta.js
// ==/UserScript==

/* global $, jQuery, CryptoJS */


(function() {
    'use strict';

    const configStoreKey = '_cookieCloudConfig';
    const positionKey = '__cookieCloudPositionTop';
    const zIndexNum = Number.MAX_SAFE_INTEGER;
    const themeColor = '236, 97, 91';

    function color(opacity) {
        return `rgba(${themeColor}, ${opacity})`
    }

    function createEle(tag, config = {style: {}}) {
        const ele = document.createElement(tag);
        const {style = {}, ...otherConfig } = config;
        Object.assign(ele.style, style);
        Object.assign(ele, (otherConfig || {}));
        return ele;
    }

    function initDrage(draggable, target) {
        let offsetX, offsetY, isDragging = false;

        // 开始拖拽
        function startDrag(event) {
            event.preventDefault();
            event.stopPropagation();
            isDragging = true;
            if (event.type === 'mousedown') {
                offsetX = event.clientX - draggable.getBoundingClientRect().left;
                offsetY = event.clientY - draggable.getBoundingClientRect().top;
            } else if (event.type === 'touchstart') {
                const touch = event.touches[0];
                offsetX = touch.clientX - draggable.getBoundingClientRect().left;
                offsetY = touch.clientY - draggable.getBoundingClientRect().top;
            }

            document.addEventListener('mousemove', onDrag);
            document.addEventListener('touchmove', onDrag);
        }

        // 拖拽中
        function onDrag(event) {
            if (!isDragging) return;
            let clientX, clientY;
            if (event.type === 'mousemove') {
                clientX = event.clientX;
                clientY = event.clientY;
            } else if (event.type === 'touchmove') {
                const touch = event.touches[0];
                clientX = touch.clientX;
                clientY = touch.clientY;
            }

            const newY = clientY - offsetY;
            draggable.style.top = `${Math.max(18, Math.min(window.innerHeight - draggable.offsetHeight, newY))}px`;
            storePosition(draggable.style.top);
            // 固定左边
            draggable.style.left = '0px';
        }

        function storePosition(top) {
            GM_setValue(positionKey, top);
        }

        // 结束拖拽
        function endDrag() {
            isDragging = false;
            document.removeEventListener('mousemove', onDrag);
            document.removeEventListener('touchmove', onDrag);
        }

        // 监听事件
        target.addEventListener('mousedown', startDrag);
        target.addEventListener('touchstart', startDrag);
        document.addEventListener('mouseup', endDrag);
        document.addEventListener('touchend', endDrag);
    }

    async function init() {
        const defaultTop = window.innerHeight / 2;
        const top = GM_getValue(positionKey) || `${defaultTop}px`;
        const btnContainer = createEle('section', {
            style: {
                position: 'fixed',
                top,
                left: '0px',
                background: color(0.6),
                borderRadius: '0 20px 20px 0',
                zIndex: zIndexNum,
            }
        });
        const btnStyles = {
            display: 'block',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            fontSize: '12px',
            backgroundColor: color(0.4),
            border: 'none',
            color: '#fff',
            margin: '10px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)'
        }
        const asyncBtn = createEle('button', {
            style: btnStyles,
            innerHTML: '上传'
        });
        const asyncConfigBtn = createEle('button', {
            style: btnStyles,
            innerHTML: '配置',
            onclick: function() {
                const modal = initConfigForm();
                document.body.appendChild(modal);
            }
        });
        const moveBtn = createEle('button', {
            style: {
                position: 'absolute',
                width: '22px',
                height: '22px',
                top: '-15px',
                right: '-15px',
                background: color(1),
                border: 'none',
                borderRadius: '50%',
                padding: '0',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#fff',
            },
            innerHTML: `<svg style="width: 12px;height: 12px;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1024"><path d="M501.0944 1021.824c6.9376 2.8928 14.8224 2.8928 21.8112 0 3.4304-1.4336 6.528-3.4816 9.1136-6.0672 0.0256 0 0.0768-0.0256 0.0768-0.0256l158.9248-158.9248c11.1104-11.1104 11.1104-29.1328 0-40.2176-11.0848-11.0848-29.0816-11.0848-40.1664 0.0256l-110.4384 110.4128 0.0256-335.36c0-15.6928-12.7232-28.416-28.416-28.416s-28.416 12.6976-28.416 28.3904l0 335.3856-110.4128-110.4128c-11.1104-11.0848-29.1072-11.0848-40.1408 0-11.1104 11.1104-11.136 29.1072-0.0512 40.192l158.9504 158.9248c0.8192 0.8192 1.8944 1.1776 2.816 1.8688C496.7168 1019.1872 498.688 1020.8256 501.0944 1021.824zM522.9056 2.176c-6.9376-2.8928-14.8224-2.8928-21.7856 0C497.6896 3.584 494.592 5.632 491.9808 8.2176c-0.0256 0-0.0768 0.0512-0.0768 0.0512L332.9792 167.168c-11.1104 11.1104-11.1104 29.1328 0 40.2176 11.0848 11.0848 29.0816 11.0848 40.1664-0.0256l110.4384-110.4128-0.0256 335.36c0 15.6928 12.7232 28.416 28.416 28.416 15.6928 0 28.4416-12.6976 28.4416-28.3904L540.416 96.9472l110.4128 110.4128c11.1104 11.0848 29.1072 11.0848 40.1408 0 11.1104-11.1104 11.1616-29.1072 0.0512-40.192l-158.9504-158.8992c-0.8192-0.8448-1.8944-1.2032-2.816-1.8944C527.2832 4.8128 525.312 3.1744 522.9056 2.176zM1021.824 522.9056c2.8928-6.9376 2.8928-14.8224 0-21.8112-1.408-3.4304-3.456-6.528-6.0416-9.1136 0-0.0256-0.0512-0.0768-0.0512-0.0768l-158.8992-158.9248c-11.1104-11.1104-29.1584-11.1104-40.2432 0-11.0592 11.0848-11.0592 29.0816 0.0512 40.1664l110.3872 110.4384-335.36-0.0256c-15.6928 0-28.3904 12.7232-28.3904 28.416s12.6976 28.416 28.3904 28.416l335.36 0-110.3872 110.4128c-11.1104 11.1104-11.1104 29.1072 0 40.1408 11.1104 11.1104 29.1072 11.136 40.192 0.0512l158.8992-158.9504c0.8448-0.8192 1.2032-1.8944 1.8944-2.816C1019.1872 527.2832 1020.8256 525.312 1021.824 522.9056zM2.176 501.0944c-2.8928 6.9376-2.8928 14.8224 0 21.7856 1.408 3.456 3.456 6.5536 6.0416 9.1392l0.0512 0.0512 158.8992 158.9504c11.1104 11.1104 29.1584 11.1104 40.2432 0 11.0592-11.1104 11.0592-29.1072-0.0512-40.192l-110.3872-110.4384 335.36 0.0512c15.6928 0 28.3904-12.7488 28.3904-28.416 0-15.6928-12.6976-28.4416-28.3904-28.4416l-335.36 0.0256 110.3872-110.4128c11.1104-11.1104 11.1104-29.1072 0-40.1408-11.1104-11.1104-29.1072-11.1616-40.192-0.0512l-158.8992 158.9504c-0.8448 0.8192-1.2032 1.8944-1.8944 2.816C4.8128 496.7168 3.1744 498.688 2.176 501.0944z" p-id="1025"></path></svg>`
        });

        btnContainer.appendChild(asyncBtn);
        btnContainer.appendChild(asyncConfigBtn);
        btnContainer.appendChild(moveBtn);
        document.body.appendChild(btnContainer);
        initDrage(btnContainer, moveBtn);
        
        // 为按钮添加点击事件
        asyncBtn.onclick = async function(event) {
            event.stopPropagation();
            const that = this;
            const config = GM_getValue(configStoreKey);
            if (!config) {
                msg('请填写配置');
                return;
            };
            const {url, uuid, password, domain = location.host} = JSON.parse(config);
            if (!url) {
                msg('请填写服务器地址');
                return;
            };
            if (!uuid) {
                msg('请填写uuid');
                return;
            };
            if (!password) {
                msg('请填写密码');
                return;
            };

            if (that.uploading) {
                return;
            }
            that.uploading = true;
            asyncBtn.innerText = '上传中';
            const cookies = await getCookie(domain);
            const encryptCookies = cookie_encrypt(uuid, password, cookies);

            const payload = {
                uuid,
                encrypted: encryptCookies
            };

            const res = await syncCookie(url, payload);
            try {
                const resData = JSON.parse(res.response)
                console.log('resData:', resData);
                that.uploading = false;
                asyncBtn.innerText = '上传';
                if (resData.action === 'done') {
                    msg('同步成功')
                } else {
                    throw('错误')
                }
            } catch(e) {
                that.uploading = false;
                asyncBtn.innerText = '上传';
                msg(String(e))
            }
        };
    }

    const msg = (function () {
        const originalAlert = window.alert;
        return (title) => {
            originalAlert(title);
        }
    })();

    function initConfigForm() {
        // 创建遮罩层
        const overlay = createEle('div', {
            style: {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: zIndexNum,
            }
        });

        // 创建弹框（Modal）容器
        const modal = createEle('div', {
            style: {
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '95%',
                maxWidth: '400px',
                backgroundColor: '#fff',
                padding: '20px',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
                zIndex: zIndexNum,
                borderRadius: '8px',
            }
        });

        // 创建表单
        const form = createEle('form');
        const inputStyles = {
            width: '100%',
            padding: '8px',
            boxSizing: 'border-box',
            border: '1px solid #ddd',
            outline: 'none',
            borderRadius: '8px',
            marginBottom: '10px'
        };

        // 创建同步域名关键词·默认当前域名
        const domainEle = createEle('textarea', {
            style: inputStyles,
            placeholder: '同步域名关键词·一行一个',
            rows: 3,
        });

        // 创建输入框 服务器地址
        const urlEle = createEle('input', {
            style: inputStyles,
            type: 'text',
            placeholder: '服务器地址',
        });

        // 创建输入框 端对端加密密码
        const pwdEle = createEle('input', {
            style: inputStyles,
            type: 'text',
            placeholder: '输入框 端对端加密密码',
        });

        // 创建输入框 用户KEY · UUID
        const uuieEle = createEle('input', {
            style: inputStyles,
            type: 'text',
            placeholder: '用户KEY · UUID',
        });

        // 创建保存按钮
        const saveButton = createEle('button', {
            style: {
                width: '100%',
                padding: '10px',
                backgroundColor: '#87CEEB',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                fontSize: '16px',
                borderRadius: '4px',
            },
            type: 'submit',
            innerText: '保存',
        });

        const config = GM_getValue(configStoreKey);
        if (config) {
            const {url, uuid, password, domain = ''} = JSON.parse(config);
            urlEle.value = url;
            pwdEle.value = password;
            uuieEle.value = uuid;
            domainEle.value = domain;
        };

        saveButton.onclick = function () {
            const configStr = JSON.stringify({
                url: urlEle.value,
                password: pwdEle.value,
                uuid: uuieEle.value,
                domain: domainEle.value
            });
            GM_setValue(configStoreKey, configStr);
            overlay.remove();
        }
        modal.onclick = function (event) {
            event.stopPropagation();
        }
        overlay.onclick = function () {
            overlay.remove();
        }
        // 将输入框和保存按钮添加到表单
        form.appendChild(domainEle);
        form.appendChild(urlEle);
        form.appendChild(pwdEle);
        form.appendChild(uuieEle);
        form.appendChild(saveButton);

        // 将表单添加到弹框中
        modal.appendChild(form);
        overlay.appendChild(modal);
        return overlay;
    }

    // 用aes对cookie进行加密
    function cookie_encrypt( uuid, password, cookies ) {
        const the_key = CryptoJS.MD5(uuid+'-'+password).toString().substring(0,16);
        const data_to_encrypt = JSON.stringify({"cookie_data":cookies,"update_time":new Date()});
        return CryptoJS.AES.encrypt(data_to_encrypt, the_key).toString();
    }

    async function getCookie(domain) {
        const domains = domain?.trim().length > 0 ? domain?.trim().split("\n") : [];
        return new Promise((res, rej) => {
            GM_cookie.list({}, function(cookies, error) {
                console.log('cookies:', cookies)
                if (!error) {
                    const ret_cookies = {};
                    if( Array.isArray(domains) && domains.length > 0 ) {
                        console.log("domains", domains);
                        for( const domain of domains ) {
                            ret_cookies[domain] = [];
                            for( const cookie of cookies ) {
                                if( cookie.domain?.includes(domain) ) {
                                    ret_cookies[domain].push( cookie );
                                }
                            }
                        }
                    }
                    console.log('ret_cookies:', ret_cookies)
                    res(ret_cookies);
                } else {
                    console.error(error);
                    rej(error)
                }
            });
        })
    }
    // 上传cookie
    async function syncCookie(url, body) {
        return new Promise((res, rej) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: url+'/update',
                data: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                },
                onload: function(response) {
                    console.log('Response:', response.responseText);
                    res(response);
                },
                onerror: function(error) {
                    console.error('Error:', error);
                    rej(error);
                }
            });
        })
    }

    window.addEventListener('load', init);
})();