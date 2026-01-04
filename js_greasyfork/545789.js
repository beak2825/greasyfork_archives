// ==UserScript==
// @name         评论隐藏信息
// @version      2025-08-16-f
// @description  给根评论点踩即可获取并复制隐藏信息，发送<|内容|过期天数||>或者<|内容|过期天数|密码|>到已有评论下可以创建隐藏信息
// @author       RK
// @match        *://*.bilibili.com/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11.22.3/dist/sweetalert2.all.min.js#md5=D4Le54swPmFIKP1ejrXgqg==
// @require      https://cdn.bootcdn.net/ajax/libs/crypto-js/4.1.1/crypto-js.min.js#md5=LKA62HiFq5g1QQkrh62ymQ==
// @connect txttool.cn
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @namespace    https://greasyfork.org/users/1503113
// @downloadURL https://update.greasyfork.org/scripts/545789/%E8%AF%84%E8%AE%BA%E9%9A%90%E8%97%8F%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/545789/%E8%AF%84%E8%AE%BA%E9%9A%90%E8%97%8F%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const oFetch = fetch;
    const hateApi = '//api.bilibili.com/x/v2/reply/hate';
    const getNoteApi = 'https://api.txttool.cn/netcut/note/info';
    const addApi = '//api.bilibili.com/x/v2/reply/add';
    const saveNoteApi = 'https://api.txttool.cn/netcut/note/save';


    const expireTime = new Map();
    expireTime.set('1H', 3600);
    expireTime.set('6H', 21600);
    expireTime.set('1D', 86400);
    expireTime.set('3D', 259200);
    expireTime.set('1W', 604800);
    expireTime.set('1M', 2592000);
    expireTime.set('3M', 7776000);
    expireTime.set('6M', 15552000);
    expireTime.set('1Y', 31536000);
    expireTime.set('2Y', 63072000);
    expireTime.set('3Y', 94608000);

    async function handleHate(urlParams) {
        const resObject = { code: 111 };
        const oid = urlParams.get('oid');
        const rpid = urlParams.get('rpid');
        const params = new URLSearchParams();
        params.append('note_name', `_${rpid}`);
        params.append('note_pwd', oid);

        GM_xmlhttpRequest({
            method: 'GET',
            url: `${getNoteApi}?${params}`,
            onload: async (res) => {
                const jObject = JSON.parse(res.responseText);
                if (jObject.status == 1) {
                    const note_content = CryptoJS.AES.decrypt(jObject.data.note_content, oid);
                    const escaped = note_content.toString(CryptoJS.enc.Utf8).replaceAll(/\\n/g, '\n');
                    GM_setClipboard(escaped, 'text');
                    Swal.fire({
                        title: '内容已复制',
                        text: escaped,
                        icon: 'success'
                    });
                }
                else if (jObject.status == 4) {
                    const { value: password } = await Swal.fire({
                        title: "输入密码",
                        input: "text",
                        inputAttributes: {
                            maxlength: "32",
                            autocapitalize: "off",
                            autocorrect: "off",
                            autocomplete: "off"
                        }
                    });
                    if (password) {
                        params.set('note_pwd', password);
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: `${getNoteApi}?${params}`,
                            onload: (res) => {
                                const jObject = JSON.parse(res.responseText);
                                if (jObject.status == 1) {
                                    const note_content = CryptoJS.AES.decrypt(jObject.data.note_content, password);
                                    const escaped = note_content.toString(CryptoJS.enc.Utf8).replaceAll(/\\n/g, '\n');
                                    GM_setClipboard(escaped, 'text');
                                    Swal.fire({
                                        title: '内容已复制',
                                        text: escaped,
                                        icon: 'success'
                                    });
                                }
                                else {
                                    Swal.fire({
                                        title: '密码错误',
                                        icon: 'error'
                                    });
                                }
                            }
                        });
                    }
                }
            }
        });

        return new Response(JSON.stringify(resObject));
    }

    async function handleAdd(urlParams, url, options) {
        const resObject = { code: 111 };
        const oid = urlParams.get('oid');
        const message = urlParams.get('message');
        const matches = message.match(/<\|([^\|]+)\|([^\|]+)\|([^\|]+)?\|>/);

        if (matches == null) {
            return await oFetch(url, options);
        }

        const root = urlParams.get('root');
        if (root == null || root == '0') {
            resObject.message = '无法发送一级评论';
            return new Response(JSON.stringify(resObject));
        }

        const content = matches[1];
        const expire = matches[2].toUpperCase();
        const password = matches[3] ?? oid;

        const params = new URLSearchParams();
        params.append('note_name', `_${root}`);
        params.append('note_content', CryptoJS.AES.encrypt(content, password).toString());
        if (expireTime.has(expire)) {
            params.append('expire_time', expireTime.get(expire));
        }
        else {
            Swal.fire({
                title: '不正确的有效时间',
                text: `应在[${expireTime.keys().toArray().toString()}]中选择`,
                icon: 'error'
            });
            resObject.message = '无法发送评论';
            return new Response(JSON.stringify(resObject));
        }
        params.append('note_pwd', password);

        GM_xmlhttpRequest({
            method: 'POST',
            url: saveNoteApi,
            data: params.toString(),
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            onload: (res) => {
                const jObject = JSON.parse(res.responseText);
                if (jObject.status == 1) {
                    Swal.fire({
                        title: '成功发送消息',
                        icon: 'success'
                    });
                }
                else {
                    Swal.fire({
                        title: '消息发送失败',
                        icon: 'error'
                    });
                }
            }
        });

        resObject.message = '已尝试发出消息';
        return new Response(JSON.stringify(resObject));
    }

    async function mFetch(url, options) {
        if (url.startsWith(hateApi) || url.startsWith(`https:${hateApi}`)) {
            return await handleHate(new URLSearchParams(options.body));
        }
        else if (url.startsWith(addApi) || url.startsWith(`https:${addApi}`)) {
            return await handleAdd(new URLSearchParams(options.body), url, options);
        }
        return await oFetch(url, options);
    }

    window.unsafeWindow.fetch = mFetch;
})();