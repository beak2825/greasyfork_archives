// ==UserScript==
// @name               （自用）小功能合集
// @namespace          https://greasyfork.org/users/667968-pyudng
// @version            0.4
// @description        自动登录、自动签到等
// @author             PY-DNG
// @license            GPL-3.0-or-later
// @match              http*://*/*
// @require            https://update.greasyfork.org/scripts/456034/1546794/Basic%20Functions%20%28For%20userscripts%29.js
// @grant              GM_getValue
// @grant              GM_setValue
// @grant              GM_xmlhttpRequest
// @connect            *
// @downloadURL https://update.greasyfork.org/scripts/528755/%EF%BC%88%E8%87%AA%E7%94%A8%EF%BC%89%E5%B0%8F%E5%8A%9F%E8%83%BD%E5%90%88%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/528755/%EF%BC%88%E8%87%AA%E7%94%A8%EF%BC%89%E5%B0%8F%E5%8A%9F%E8%83%BD%E5%90%88%E9%9B%86.meta.js
// ==/UserScript==

/* eslint-disable no-multi-spaces */
/* eslint-disable no-return-assign */

/* global LogLevel DoLog Err $ $All $CrE $AEL $$CrE addStyle detectDom destroyEvent copyProp copyProps parseArgs escJsStr replaceText getUrlArgv dl_browser dl_GM AsyncManager queueTask FunctionLoader loadFuncs require isLoaded */


/* 规则：
1. 自动登录不能在代码里写密码/Token，帐号可以写；
2. 如需使用密码/Token，请写在GM-storage里：
  - 密码：非明文方式存储
  - Token：可明文存储
*/

(function __MAIN__() {
    'use strict';

	const pool = loadFuncs([{
        id: 'utils',
        params: ['GM_setValue', 'GM_getValue'],
        async func(GM_setValue, GM_getValue) {
            // 每天最多load一次的checker，无需提供checker.value，对每个功能id每天只返回一次true
            // 注意：虽说每天只返回一次true，但是考虑到某些页面未执行完毕某功能函数时就被关闭，可能导致某些任务未执行完成的问题，
            // checker会等到功能函数执行完毕才标记此功能函数为“今日已执行”；也就是说，短时间内开启多个页面，可能会导致使用了
            // 此checker的功能函数执行多次
            FunctionLoader.registerChecker('daily', function() {
                const oFunc = this;
                const id = oFunc.id;

                // Check if today loaded
                const date = getDate();
                const load_record = GM_getValue('load-record', {});
                const today_loaded = load_record.hasOwnProperty(id) && load_record[id] === date;
                load_record[id] = date;

                // If not loaded yet for today, allows its load and take load record after its loading
                if (!today_loaded) {
                    const controller = new AbortController();
                    pool.addEventListener('load', e => {
                        if (e.detail.id === oFunc.id) {
                            GM_setValue('load-record', load_record);
                            controller.abort();
                        }
                    }, { signal: controller.signal });
                }
                return !today_loaded;
            });

            function nextEventLoop() {
                return sleep();
            }

            function sleep(time = 0) {
                const { promise, resolve } = Promise.withResolvers();
                setTimeout(() => resolve(), time);
                return promise;
            }

            function getDate() {
                const date = new Date();
                return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
            }

            /**
             * 记录任务执行结果到 <脚本存储空间/给定的key> 数组中，并允许指定最多保存条目数量
             * @param {Object} details
             * @param {function} [details.GM_getValue] - 读取脚本存储的函数；如果提供，使用提供的值，否则使用上下文中的值
             * @param {function} [details.GM_setValue] - 写入脚本存储的函数；如果提供，使用提供的值，否则使用上下文中的值
             * @param {number} [details.max_length=30] - 最大保存条目数量，超出时，将删除最早保存的条目
             * @param {*} details.result - 需要保存的任务执行结果
             * @param {string} details.key - 脚本存储空间key，同`GM_getValue`和`GM_setValue`的第一个参数
             */
            function saveResult({
                GM_getValue: _GM_getValue = GM_getValue,
                GM_setValue: _GM_setValue = GM_setValue,
                max_length = 30,
                result,
                key = 'result'
            }) {
                // 记录结果
                const save = _GM_getValue(key, []);
                save.push({
                    date: getDate(),
                    result,
                    url: location.href
                });

                // 最多只记录30条结果
                save.length > max_length && save.splice(0, save.length - max_length);
                _GM_setValue(key, save);
            }

            /**
             * Sends a GM_xmlhttpRequest with given details object, returns promise
             * onload, onerror and ontimeout is bound for resolve and reject, so explicitly setting these callbacks takes no effect
             * @param {Object} details
             */
            function request(details) {
                const { promise, resolve, reject } = Promise.withResolvers();
                details = Object.assign({
                    method: 'GET'
                }, details);
                details = Object.assign(details, {
                    onload: e => resolve(e.responseText),
                    onerror: err => reject(err),
                    ontimeout: err => reject(err)
                });
                GM_xmlhttpRequest(details);
                return promise;
            }

            const crypto = await (async function() {
                const key = await getKey();
                const encoder = new TextEncoder();
                const decoder = new TextDecoder();

                /**
                 * Get stored key for RSA encryption
                 * If not exists, returns a new generated key and store it
                 * @returns {Promise<CryptoKey>}
                 */
                async function getKey() {
                    if (!GM_getValue('crypto', {}).key) {
                        const key = await window.crypto.subtle.generateKey({
                            name: 'AES-GCM',
                            length: 128
                        }, true, ['encrypt', 'decrypt']);
                        const export_key = await window.crypto.subtle.exportKey('jwk', key);
                        GM_setValue('crypto', { key: export_key });
                    }
                    const stored_key = GM_getValue('crypto');
                    return await window.crypto.subtle.importKey(
                        'jwk',
                        stored_key.key,
                        'AES-GCM',
                        false,
                        ['encrypt', 'decrypt']
                    )
                }

                /**
                 * encrypt bytes data
                 * @param {ArrayBuffer} bytes 
                 * @returns {Promise<{ data: ArrayBuffer, iv: Uint8Array }>}
                 */
                async function encrypt(bytes) {
                    const iv = new Uint8Array(96);
                    window.crypto.getRandomValues(iv);
                    return {
                        data: await window.crypto.subtle.encrypt({
                            name: 'AES-GCM', iv,
                        }, key, bytes),
                        iv
                    };
                }

                /**
                 * decrypt bytes data
                 * @param {ArrayBuffer} bytes 
                 * @param {Uint8Array} iv
                 * @returns {Promise<ArrayBuffer>}
                 */
                async function decrypt(bytes, iv) {
                    return window.crypto.subtle.decrypt({
                        name: 'AES-GCM', iv
                    }, key, bytes);
                }
                
                /**
                 * encrypt text using internal key, returns encoded data in string format
                 * @param {string} text - text to be encrypted
                 * @returns {Promise<{ data: string, iv: string >}
                 */
                async function encryptText(text) {
                    const bytes = encoder.encode(text);
                    const { data: encrypted, iv } = await encrypt(bytes);
                    const base64_data = _arrayBufferToBase64(encrypted);
                    const base64_iv = _arrayBufferToBase64(iv);
                    const str_data = base64_data + ',' + base64_iv;
                    return str_data;
                }

                /**
                 * decrypt base64-encoded encrypted data string to its original string data
                 * @param {string} str_data - encryptText returned string-format encoded data
                 * @returns {Promise<string>}
                 */
                async function decryptText(str_data) {
                    const [base64_data, base64_iv] = str_data.split(',');
                    const bytes = _base64ToArrayBuffer(base64_data);
                    const iv = _base64ToArrayBuffer(base64_iv);
                    const decrypted = await decrypt(bytes, iv);
                    const text = decoder.decode(decrypted);
                    return text;
                }

                // From: https://stackoverflow.com/a/9458996/22690698
                function _arrayBufferToBase64( buffer ) {
                    var binary = '';
                    var bytes = new Uint8Array( buffer );
                    var len = bytes.byteLength;
                    for (var i = 0; i < len; i++) {
                        binary += String.fromCharCode( bytes[ i ] );
                    }
                    return window.btoa( binary );
                }

                // Written based on _arrayBufferToBase64,
                // which is from https://stackoverflow.com/a/9458996/22690698
                function _base64ToArrayBuffer(base64) {
                    const binary = window.atob( base64 );
                    const bytes = new Uint8Array(binary.length);
                    for (let i = 0; i < binary.length; i++) {
                        bytes[i] = binary.charCodeAt(i);
                    }
                    return bytes;
                }

                return {
                    available: !!window.crypto?.subtle,
                    encrypt,
                    decrypt,
                    encryptText,
                    decryptText
                };
            }) ();

            return {
                nextEventLoop,
                sleep,
                getDate,
                saveResult,
                request,
                crypto
            }
        }
    }, {
        id: 'AutoDL-Account-Fill',
        desc: 'AutoDL自动登录',
        dependencies: ['utils', 'token'],
        checkers: {
            type: 'starturl',
            value: 'https://www.autodl.com/login'
        },
        detectDom: '.login-center .login-operate',
        async func() {
            const utils = require('utils');
            const token = require('token');

            if (!token.has('autodl')) { return; }

            const loginarea = $('.login-operate').parentElement;
            const form = $(loginarea, 'form');
            const account_input = $(form, 'input[placeholder="请输入手机号"]');
            const password_input = $(form, 'input[placeholder="请输入密码"]');
            const login_button = $('.login-operate.operate').previousElementSibling.previousElementSibling;

            const account_info = await token.get('autodl');
            account_input.value = account_info.account;
            password_input.value = account_info.password;
            account_input.dispatchEvent(new Event('change'));
            password_input.dispatchEvent(new Event('change'));
            setTimeout(() => login_button.click());
        }
    }, {
        id: 'fufugal-autohunt-click',
        desc: '初音的青葱自动寻宝（模拟页面操作版）',
        disabled: true,
        checkers: {
            type: 'url',
            value: 'https://www.fufugal.com/'
        },
        detectDom: '.user-infos>.aglist',
        dependencies: 'utils',
        params: ['GM_setValue', 'GM_getValue'],
        async func(GM_setValue, GM_getValue) {
            const utils = require('utils');

            if (GM_getValue('last-hunt') === utils.getDate()) { return; }

            /** @type {HTMLElement} */
            const spirit_list = $('.user-infos>.aglist');
            const hunt_button = spirit_list.previousElementSibling;
            hunt_button.click();
            /** @todo 这里应该detectDom检测确认获得了寻宝结果，或者出现了今日已寻宝的提示 */
            GM_setValue('last-hunt', utils.getDate());
        }
    }, {
        id: 'token',
        desc: '各类网站Token获取',
        dependencies: 'utils',
        params: ['GM_setValue', 'GM_getValue'],
        async func(GM_setValue, GM_getValue) {
            const utils = require('utils');

            // 创建一个新的函数池用于加载不同网站的token getter
            const pool = new FunctionLoader.FuncPool({
                GM_getValue, GM_setValue
            });

            // 以下所有子函数对象，均仅仅用于在对应网页上获取token更新到存储
            // 更新到存储的token值必须是一个JSONable的值，更新方式为调用set(oFunc.id, token_value)
            // 在set/get内部，token值经加密后统一存储在token[id]键上，需要用时即时解密
            // 注意：以下子函数对象需仅在token实际发生变化/需要更新时才可调用set，因为每次set都会进行一次DoLog，以后也许还会做更多事情（比如广播change事件）
            await pool.load([{
                id: 'fufugal',
                desc: '初音的青葱',
                checkers: {
                    type: 'starturl',
                    value: 'https://www.fufugal.com/'
                },
                params: ['oFunc'],
                async func(oFunc) {
                    // 获取token，每秒获取一次，用户注销/重新登录/切换帐号了也能保证是最新的
                    setInterval(parseToken, 1000);
                    let token = await get(oFunc.id);
                    token = parseToken();

                    /**
                     * 在初音的青葱网站页面上，从localStorage获取token并存储到GM storage \
                     * 未登录时，返回null
                     * @returns {string|null}
                     */
                    function parseToken() {
                        const cur_token = (localStorage.user && JSON.parse(localStorage.user).token) || null;
                        if (token !== cur_token) {
                            set(oFunc.id, cur_token);
                            token = cur_token;
                        }
                        return token;
                    }
                }
            }, {
                id: 'yurifans',
                desc: 'yurifans',
                checkers: {
                    type: 'starturl',
                    value: 'https://yuri.website/'
                },
                params: ['oFunc'],
                async func(oFunc) {
                    // 获取token，每秒获取一次，用户注销/重新登录/切换帐号了也能保证是最新的
                    setInterval(parseToken, 1000);
                    let token = await get(oFunc.id);
                    token = parseToken();

                    /**
                     * 在yurifans页面上，从cookie获取token并存储到GM storage \
                     * 未在cookie中找到token时，返回null
                     * @returns {string|null}
                     */
                    function parseToken() {
                        const cookie_vals = document.cookie.split(';');
                        const cur_token = cookie_vals.find(str => str.startsWith('b2_token='))?.split('=')[1] ?? null;
                        if (token !== cur_token) {
                            set(oFunc.id, cur_token);
                            token = cur_token;
                        }
                        return token;
                    }
                }
            }, {
                id: 'autodl',
                desc: 'AutoDL 帐号密码登录',
                checkers: {
                    type: 'func',
                    value: () => location.host === 'www.autodl.com' && location.pathname === '/login'
                },
                detectDom: '.login-operate.operate',
                params: ['oFunc'],
                async func(oFunc) {
                    const token = await get(oFunc.id);
                    const account_input = $('input.el-input__inner[placeholder="请输入手机号"]');
                    const password_input = $('input.el-input__inner[placeholder="请输入密码"]');
                    const login_button = $('.login-operate.operate').previousElementSibling.previousElementSibling;
                    $AEL(login_button, 'click', function() {
                        const account = account_input.value;
                        const password = password_input.value;
                        if (token.account !== account || token.password !== password) {
                            set(oFunc.id, { account, password });
                        }
                    });
                }
            }]);

            return { get, has, set };

            async function get(id) {
                if (!has(id)) { return null; }
                const tokens = GM_getValue('token', {});
                const token = JSON.parse(await utils.crypto.decryptText(tokens[id]));
                return token;
            }

            function has(id) {
                return !!GM_getValue('token', {})[id];
            }

            async function set(id, token) {
                const tokens = GM_getValue('token', {});
                tokens[id] = await utils.crypto.encryptText(JSON.stringify(token));
                GM_setValue('token', tokens);
                DoLog(LogLevel.Success, `Token updated token for ${id}`);
            }
        }
    }, {
        id: 'fufugal-sign-hunt',
        desc: '初音的青葱自动签到、寻宝',
        checkers: {
            type: 'daily' // 在utils里注册，所以无论是否require都要在dependencies中填上utils
        },
        dependencies: ['utils', 'token'],
        params: ['oFunc', 'GM_setValue', 'GM_getValue'],
        async func(oFunc, GM_setValue, GM_getValue) {
            const token = require('token');
            const utils = require('utils');
            if (!token.has('fufugal')) {
                alert(`[${GM_info.script.name}][${oFunc.id}] 尚未获取初音的青葱的API Token，请打开初音的青葱网页（如果未登录请登录），程序会自动获取。`);
                return;
            }

            const result = await Promise.all([
                api('https://www.fufugal.com/addJf'),
                api('https://www.fufugal.com/hunt')
            ]);

            // 记录结果
            utils.saveResult({ result, GM_setValue, GM_getValue });

            function api(url) {
                return new Promise(async (resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'GET', url,
                        headers: {
                            'x-auth-token': await token.get('fufugal'),
                            'referrer': 'https://www.fufugal.com/',
                            'accept': 'application/json, text/plain, */*',
                            'host': 'www.fufugal.com'
                        },
                        onload: e => resolve(e.responseText),
                        onerror: err => reject(err)
                    });
                });
            }
        }
    }, {
        id: 'fallenark-task',
        desc: '方舟每日任务',
        checkers: {
            type: 'daily', // 在utils里注册，所以无论是否require都要在dependencies中填上utils
            value: 'fallenark-task'
        },
        dependencies: ['utils'],
        params: ['GM_setValue', 'GM_getValue'],
        async func(GM_setValue, GM_getValue) {
            const utils = require('utils');

            /** @todo 每天登录 湿度+25 没做 */

            // 每天登录 湿度+25
            // 此任务的原理为访问主页后，后台自动增加湿度值，并在cookies中通知前端，前端清除相关cookie并展示横幅
            // 一定先做这个请求，完成后再进行其他的，因为每天第一个请求就会进行Set-Cookie
            // 其实不用专门请求这个……因为请求其他api时也会自动完成这个
            // result.push(await (new Promise((resolve, reject) => {
            //     GM_xmlhttpRequest({
            //         method: 'GET',
            //         url: 'https://bbs.fallenark.com/',
            //         headers: {
            //             accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
            //             host: 'bbs.fallenark.com',
            //         },
            //         onload: e => resolve(e.responseHeaders),
            //         onerror: err => reject(err)
            //     });
            // })));

            // 任务版任务
            const result_obj = await Promise.all([
                api('https://bbs.fallenark.com/home.php?mod=task&do=apply&id=14')
            ]);
            const result = result_obj.map(e => ({
                response: e.responseText,
                headers: e.responseHeaders
            }));

            // 记录结果
            utils.saveResult({ result, GM_setValue, GM_getValue });

            function api(url) {
                return new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'GET', url,
                        headers: {
                            referrer: 'https://bbs.fallenark.com/home.php?mod=task'
                        },
                        onload: e => resolve(e),
                        onerror: err => reject(err)
                    });
                });
            }
        }
    }, {
        id: 'yamibo-sign',
        desc: '百合会签到',
        checkers: {
            type: 'daily' // 在utils里注册，所以无论是否require都要在dependencies中填上utils
        },
        dependencies: 'utils',
        params: ['GM_setValue', 'GM_getValue'],
        async func(GM_setValue, GM_getValue) {
            const utils = require('utils');

            // Get formhash
            const html1 = await utils.request({
                url: 'https://bbs.yamibo.com/plugin.php?id=zqlj_sign',
                headers: {
                    referrer: 'https://bbs.yamibo.com/plugin.php?id=zqlj_sign'
                },
            });
            const parser = new DOMParser();
            const doc1 = parser.parseFromString(html1, 'text/html');
            const formhash = $(doc1, '#scbar_form>input[name="formhash"]')?.value;
            Assert(formhash, 'Cannot get formhash from sign page');

            // Sign
            const html2 = await utils.request({
                url: `https://bbs.yamibo.com/plugin.php?id=zqlj_sign&sign=${formhash}`,
                headers: {
                    referrer: 'https://bbs.yamibo.com/plugin.php?id=zqlj_sign'
                },
            });
            const doc2 = parser.parseFromString(html2, 'text/html');
            const message = extractResultText(doc2);

            // Repair day (补签)
            const select = $(doc1, '#repairday');
            const repair_results = [];
            if (select && select.children.length) {
                const promises = [...select.children].map(opt => {
                    const repair_key = $('#repairday+.repairbtn').getAttribute('onclick').match(/[\?&]repair=([\da-zA-Z]+)/)?.[1];
                    const url = `https://bbs.yamibo.com/plugin.php?id=zqlj_sign&repair=${repair_key}&repairday=${opt.value}`;
                    const response_html = utils.request({
                        url,
                        headers: {
                            referrer: 'https://bbs.yamibo.com/plugin.php?id=zqlj_sign'
                        },
                    });
                    const doc = parser.parseFromString(response_html, 'text/html');
                    const message = extractResultText(doc);
                    return message;
                });
                repair_results.push(...await Promise.all(promises));
            }

            // 记录结果
            utils.saveResult({ result: { sign: message, repair: repair_results }, GM_setValue, GM_getValue });

            function extractResultText(doc) {
                const msg_p = $(doc, '#messagetext>p:first-of-type').cloneNode(true);
                [...msg_p.children].filter(elm => ['SCRIPT', 'STYLE'].includes(elm.tagName)).forEach(elm => elm.remove());
                const message = msg_p.innerText;
                return message;
            }
        }
    }, {
        id: 'yurifans-sign',
        desc: 'yurifans签到',
        checkers: {
            type: 'daily' // 在utils里注册，所以无论是否require都要在dependencies中填上utils
        },
        dependencies: ['utils', 'token'],
        params: ['oFunc', 'GM_setValue', 'GM_getValue'],
        async func(oFunc, GM_setValue, GM_getValue) {
            const token = require('token');
            const utils = require('utils');

            if (!token.has('yurifans')) {
                alert(`[${GM_info.script.name}][${oFunc.id}] 尚未获取yurifans的API Token，请打开初yurifans网页（如果未登录请登录），程序会自动获取。`);
                return;
            }

            const result_text = await utils.request({
                method: 'POST',
                url: 'https://yuri.website/wp-json/b2/v1/userMission',
                headers: {
                    authorization: 'Bearer ' + await token.get('yurifans'),
                    origin: 'https://yuri.website',
                    referer: 'https://yuri.website/task',
                    accept: 'application/json, text/plain, */*'
                }
            });
            const result = JSON.parse(result_text);

            // 记录结果
            utils.saveResult({ result, GM_setValue, GM_getValue });
        }
    }, {
        id: 'fufugal-bgset',
        desc: '解锁初音的青葱的设置背景图功能',
        checkers: {
            type: 'starturl',
            value: 'https://www.fufugal.com/'
        },
        func() {
            detectDom({
                selector: '.background-container>.settings-panel',
                callback: panel => {
                    const group = $(panel, '.thumbnail-group');
                    const setbtn = group.nextElementSibling;
                    const controller = new AbortController();
                    let index = null;
                    [...group.children].forEach(elm => $AEL(elm, 'click', e => {
                        if (e.currentTarget.parentElement !== group) { return; }
                        if (!document.contains(group)) { controller.abort(); return; }
                        index = [...group.children].indexOf(e.currentTarget) + 1;
                    }, { capture: true, signal: controller.signal }))
                    $AEL(setbtn, 'click', e => {
                        if (index === null) { return; }
                        //e.stopImmediatePropagation();
                        const user = JSON.parse(localStorage.user);
                        user.config.config_bg = index;
                        localStorage.user = JSON.stringify(user);
                        location.reload();
                    }, { capture: true, signal: controller.signal });
                }
            });
        }
    }, {
        id: 'ads',
        desc: '广告屏蔽',
        async func() {
            const pool = new FunctionLoader.FuncPool();
            pool.load([{
                'id': 'alhs',
                checkers: {
                    // https://alhs.xyz/index.php/archives/2022/06/39540/
                    type: 'func',
                    value: () => ['alhs.xyz', 'alhs.link'].includes(location.host) && location.pathname.match(/^\/index\.php\/archives\/\d+\/\d+\/\d+/)
                },
                func() {
                    detectDom({
                        selector: '#post_content>div',
                        /**
                         * @param {HTMLDivElement} div
                         */
                        callback: div => {
                            /*
                            结构匹配：
                            - div
                              - a
                                - img
                              - div
                            */
                            if (div.children.length !== 2) { return; }
                            const a = div.firstElementChild;
                            if (a.nodeName !== 'A') { return; }
                            if (a.target !== '_blank') { return; }
                            if (a.children.length !== 1) { return; }
                            const img = a.firstElementChild;
                            if (img.nodeName !== 'IMG') { return; }
                            const ad_text = div.lastElementChild;
                            if (ad_text.nodeName !== 'DIV') { return; }

                            hideElement(div);
                        }
                    });
                }
            }]);

            /**
             * @param {HTMLElement} elm
             */
            function hideElement(elm) {
                elm.style.position = 'fixed';
                elm.style.left = '200vw';
            }
        }
    }]);
}) ();