// ==UserScript==
// @name         评论隐藏信息
// @version      2025-08-17-ddd
// @description  给视频或者根评论点踩即可获取并复制隐藏信息，发送<|内容|过期天数||>或者<|内容|过期天数|密码|>到已有评论下可以创建隐藏信息
// @author       RK
// @match        *://*.bilibili.com/*
// @connect      txttool.cn
// @icon         https://static.hdslb.com/images/favicon.ico
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11.22.3/dist/sweetalert2.all.min.js#md5=D4Le54swPmFIKP1ejrXgqg==
// @require      https://cdn.bootcdn.net/ajax/libs/crypto-js/4.1.1/crypto-js.min.js#md5=LKA62HiFq5g1QQkrh62ymQ==
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @grant        GM_getResourceText
// @resource     DATA https://api.bilibili.com/x/emote/package?ids=1&business=reply
// @license      WTFPL
// @namespace    https://greasyfork.org/users/1503113
// @downloadURL https://update.greasyfork.org/scripts/545155/%E8%AF%84%E8%AE%BA%E9%9A%90%E8%97%8F%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/545155/%E8%AF%84%E8%AE%BA%E9%9A%90%E8%97%8F%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const oFetch = fetch;
    var originalSend = XMLHttpRequest.prototype.send;

    const hateApi = '//api.bilibili.com/x/v2/reply/hate';
    const getNoteApi = 'https://api.txttool.cn/netcut/note/info';
    const addApi = '//api.bilibili.com/x/v2/reply/add';
    const saveNoteApi = 'https://api.txttool.cn/netcut/note/save';
    const replyApi = '//api.bilibili.com/x/v2/reply/reply';
    const likeApi = '//api.bilibili.com/x/web-interface/archive/like';


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

    function getMessage(oid, rpid) {
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
                        title: '输入密码',
                        input: 'text',
                        inputAttributes: {
                            maxlength: '32',
                            autocapitalize: 'off',
                            autocorrect: 'off',
                            autocomplete: 'off'
                        }
                    });
                    if (password) {
                        params.set('note_pwd', password);
                        GM_xmlhttpRequest({
                            method: 'GET',
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
    }


    async function handleHate(urlParams) {
        const resObject = { code: 111 };
        const oid = urlParams.get('oid');
        const rpid = urlParams.get('rpid');
        getMessage(oid, rpid);
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

        let root = urlParams.get('root');
        if (root == null || root == '0') {
            root = oid;
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
                'Content-Type': 'application/x-www-form-urlencoded'
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

    async function handleReply(urlParams, url, options) {
        const replyWhiteList = GM_getValue('replyWhiteList', []);
        const useReply = GM_getValue('useReply', 0);
        if (useReply == 0 && replyWhiteList.length == 0) {
            return await oFetch(url, options);
        }

        const oid = urlParams.get('oid');
        const root = urlParams.get('root');
        const params = new URLSearchParams();
        params.append('note_name', `_${root}`);
        params.append('note_pwd', oid);
        return new Promise((resolve, reject) => {
            oFetch(url, options)
                .then(response => response.json())
                .then(data => {
                    if (useReply == 0 && !replyWhiteList.includes(data.data.root.mid)) {
                        resolve(new Response(JSON.stringify(data)));
                        return;
                    }
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: `${getNoteApi}?${params}`,
                        onload: async (res) => {
                            const jObject = JSON.parse(res.responseText);
                            const moke = {
                                mid: 0,
                                count: 0,
                                rcount: 0,
                                state: 0,
                                ctime: 0,
                                like: 0,
                                replies: null,
                                content: {
                                    message: '<无信息>',
                                    jump_url: {},
                                    max_line: 32,
                                    members: []
                                },
                                member: {
                                    mid: 0,
                                    uname: '匿名',
                                    sex: '保密',
                                    avatar: 'https://i1.hdslb.com/bfs/face/member/noface.jpg',
                                    sign: '',
                                    level_info: {
                                        current_level: 0,
                                        current_min: 0,
                                        current_exp: 0,
                                        next_exp: 0
                                    }
                                }
                            };

                            if (jObject.status == 1) {
                                moke.ctime = Math.floor(Date.parse(jObject.data.updated_time) / 1000);
                                const note_content = CryptoJS.AES.decrypt(jObject.data.note_content, oid);
                                const escaped = note_content.toString(CryptoJS.enc.Utf8).replaceAll(/\\n/g, '\n');
                                moke.content.message = escaped;
                                moke.content.emote = {};
                                for (let eitem of (escaped.match(/\[[^\[\]]+\]/g) ?? [])) {
                                    const emoteInfo = DATA.data.packages[0].emote.find(item => item.text == eitem);
                                    if (emoteInfo) {
                                        moke.content.emote[emoteInfo.text] = emoteInfo;
                                    }
                                }
                                data.data.replies.unshift(moke);
                            }
                            resolve(new Response(JSON.stringify(data)));
                        }
                    });
                });
        });
    }

    async function handleLike(urlParams) {
        const like = urlParams.get('like');
        if (like != 2) {
            return false;
        }
        const aid = urlParams.get('aid');
        getMessage(aid, aid);
        return true;
    }

    async function mFetch(url, options) {
        const params = url.substring(url.indexOf('?') + 1);
        if (url.startsWith(hateApi) || url.startsWith(`https:${hateApi}`)) {
            return await handleHate(new URLSearchParams(options.body ?? params));
        }
        else if (url.startsWith(addApi) || url.startsWith(`https:${addApi}`)) {
            return await handleAdd(new URLSearchParams(options.body ?? params), url, options);
        }
        else if (url.startsWith(replyApi) || url.startsWith(`https:${replyApi}`)) {
            return await handleReply(new URLSearchParams(options.body ?? params), url, options);
        }
        /*
        else if (url.startsWith(likeApi) || url.startsWith(`https:${likeApi}`)) {
            return await handleLike(new URLSearchParams(options.body ?? params), url, options);
        }
        */
        return await oFetch(url, options);
    }

    window.unsafeWindow.fetch = mFetch;

    XMLHttpRequest.prototype.send = function (args) {
        const url = this._url;
        const params = new URLSearchParams(args);
        if (url) {
            if (url.startsWith(likeApi) || url.startsWith(`https:${likeApi}`)) {
                if (handleLike(params)) {
                    arguments[0] = arguments[0]?.replace('like=2', 'like=1');
                }
            }
        }
        else if (params.has('aid') && params.has('like')) {
            if (handleLike(params)) {
                arguments[0] = arguments[0]?.replace('like=2', 'like=1');
            }
        }
        originalSend.apply(this, arguments);
    };

    const DATA = JSON.parse(GM_getResourceText('DATA'));

    GM_registerMenuCommand('设置查看回复获取', async function () {
        const useReply = GM_getValue('useReply', 0);
        const { value: accept } = await Swal.fire({
            title: '设置查看回复获取',
            input: 'checkbox',
            inputValue: useReply,
            inputPlaceholder: '每次查看回复都获取信息',
            confirmButtonText: '确认',
        });
        GM_setValue('useReply', accept ?? 0);
    });

    GM_registerMenuCommand('设置查看回复白名单', async function () {
        const replyWhiteList = GM_getValue('replyWhiteList', []);
        const { value: text } = await Swal.fire({
            input: 'textarea',
            inputLabel: '白名单列表',
            inputPlaceholder: '输入包含UP主UID的列表，此列表内的评论始终会尝试获取',
            inputValue: JSON.stringify(replyWhiteList),
            showCancelButton: true
        });
        if (text) {
            GM_setValue('replyWhiteList', JSON.parse(text));
        }
    });

})();

