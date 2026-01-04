// ==UserScript==
// @name              阿里云原画播放
// @version           1.1.3
// @author            Author Moe
// @date              2023-03-04
// @description       在画质选项中加入原画播放选项，使用potplayer播放阿里云盘原画视频（需要安装potplayer插件）https://github.com/gene9831/AliyunDrivePotPlayer。【提示】抓的接口限制增加，账号可能被风控限速，请酌情使用
// @license           AGPL-3.0-or-later
// @match             *://www.aliyundrive.com/s/*
// @match             *://www.aliyundrive.com/drive*
// @require           https://unpkg.com/jquery@3.6.0/dist/jquery.min.js
// @require           https://unpkg.com/bn.js@4.11.8/lib/bn.js
// @require           https://unpkg.com/@lionello/secp256k1-js@1.1.0/src/secp256k1.js
// @connect           aliyundrive.com
// @connect           localhost
// @connect           *
// @run-at            document-idle
// @grant             unsafeWindow
// @grant             GM_xmlhttpRequest
// @grant             GM_setClipboard
// @grant             GM_setValue
// @grant             GM_getValue
// @grant             GM_openInTab
// @grant             GM_info
// @grant             GM_registerMenuCommand
// @grant             GM_cookie
// @icon              https://gw.alicdn.com/imgextra/i3/O1CN01aj9rdD1GS0E8io11t_!!6000000000620-73-tps-16-16.ico
// @namespace https://greasyfork.org/users/1026976
// @downloadURL https://update.greasyfork.org/scripts/460014/%E9%98%BF%E9%87%8C%E4%BA%91%E5%8E%9F%E7%94%BB%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/460014/%E9%98%BF%E9%87%8C%E4%BA%91%E5%8E%9F%E7%94%BB%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let g_drive_id = "", g_file_id = "", g_file_name = "", g_share_id = "";
    let privateKey = "", publicKey = "";
    let app_id = "", device_id = "",user_id = "";
    let signature = "";
    let headers={};
    let api_url = {
            "0": "https://api.aliyundrive.com/v2/file/get_share_link_download_url",
            "1": "https://api.aliyundrive.com/v2/file/get_download_url"
        };


    let main = {

        isType(obj) {
            return Object.prototype.toString.call(obj).replace(/^\[object (.+)\]$/, '$1').toLowerCase();
        },

        post(url, data, headers, type) {
            if (this.isType(data) === 'object') {
                data = JSON.stringify(data);
            }
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "POST", url, headers, data,
                    responseType: type || 'json',
                    onload: (res) => {
                        type === 'blob' ? resolve(res) : resolve(res.response || res.responseText);
                    },
                    onerror: (err) => {
                        reject(err);
                    },
                });
            });
        },

        getStorage(key) {
            try {
                return JSON.parse(localStorage.getItem(key));
            } catch (e) {
                return localStorage.getItem(key);
            }
        },

        async getRealLink(d, f) {
            let res = await this.post(api_url[1], {
                drive_id: d,
                file_id: f
            }, headers);
            //console.log("getRealLink", d,f,res);
            if (res.url) {
                return res.url;
            }
            return '';
        },

        async getPCSLink(f, s){
            try {
                let authorization = `${this.getStorage('token').token_type} ${this.getStorage('token').access_token}`;
                let xShareToken = this.getStorage('shareToken').share_token;
                let res = await this.post(api_url[0], {
                    expire_sec: 600,
                    file_id: g_file_id,
                    share_id: g_share_id
                }, {
                    authorization,
                    "content-type": "application/json;charset=utf-8",
                    "x-share-token": xShareToken
                });
                if (res.download_url) {
                    return res.download_url;
                }
            } catch (e) {
                //console.log('提示：请先登录网盘！');
            }
        },


        initDefaultConfig() {
            let value = [{
                name: 'url-scheme',
                value: 'potplayer://'
            },];

            value.forEach((v) => {
                GM_getValue(v.name) === undefined && GM_setValue(v.name, v.value);
            });
        },

        async initECDSAKey() {
            let privateKeyBuf = window.crypto.getRandomValues(new Uint8Array(32));
            privateKey = Secp256k1.uint256(privateKeyBuf, 16);
            publicKey = Secp256k1.generatePublicKeyFromPrivateKeyData(privateKey);
            publicKey = "04" + publicKey.x + publicKey.y;
            app_id = "5dde4e1bdf9e4966b387ba58f4b3fdc3";
            device_id = this.getStorage('token').device_id;
            user_id = this.getStorage('token').user_id;
            console.log("initECDSAKey",privateKeyBuf);
            let nonce = 0;
            //sign
            let text = `${app_id}:${device_id}:${user_id}:${nonce}`;
            let encoder = new TextEncoder();
            let data = encoder.encode(text);
            let hashBuffer = await crypto.subtle.digest('SHA-256', data);
            //hashBuffer to uint8 array
            hashBuffer = new Uint8Array(hashBuffer);
            console.log("hashBuffer",hashBuffer);
            let sig = Secp256k1.ecsign(privateKey, Secp256k1.uint256(hashBuffer, 16));
            signature = sig.r + sig.s + "01";
            headers = {
                "content-type": "application/json;charset=utf-8",
                "authorization": `${this.getStorage('token').token_type} ${this.getStorage('token').access_token}`,
                "origin": "https://www.aliyundrive.com",
                "referer": "https://www.aliyundrive.com/",
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36 Edg/110.0.1587.41",
                "x-canary": "client=web,app=adrive,version=v3.17.0",
                "x-device-id": device_id,
                "x-signature": signature,
            }
            //create session
            const req = await fetch('https://api.aliyundrive.com/users/v1/users/device/create_session', {
                method: 'POST',
                body: JSON.stringify({ "deviceName": "Edge浏览器", "modelName": "Windows网页版", "pubKey": publicKey }),
                headers: headers
            });
            const res = await req.json();
            console.log("create session",res);
        },

        init() {
            main.initDefaultConfig();
            main.initECDSAKey();
            //识别页面类型
            let sharepage=window.location.href.indexOf("s/")>0;
            //劫持XMLHttpRequest
            var send = XMLHttpRequest.prototype.send;
            XMLHttpRequest.prototype.send = function (data) {
                let url = this.openParams ? this.openParams[1] : this.responseURL;
                //console.log("aopsend",data)
                if (url.indexOf("/file/get_video_preview_play_info") > 0) {
                    //console.log("inject",data)
                    g_drive_id = JSON.parse(data).drive_id;
                    g_file_id = JSON.parse(data).file_id;
                    g_share_id = JSON.parse(data).share_id;
                    if (sharepage) {
                        g_file_name = document.getElementsByClassName("header-file-name--CN_fq")[0].textContent;
                    }
                    else {
                        g_file_name = document.getElementsByClassName("text--2KGvI")[0].textContent;
                    }
                    //console.log("got:", url, g_drive_id, g_file_id, g_file_name);

                    //循环检测dom创建，添加按钮
                    let ins = setInterval(() => {
                        let quality = document.getElementsByClassName("drawer-list--JYzyI");
                        if (quality.length > 0) {
                            if (sharepage) {
                                quality[0].innerHTML += `<li class="drawer-item--2cNtQ original-video-play" data-is-current="false">
                                            <div class="text--AMJbu">原画下载</div>
                                        </li>`;
                                let play_button = document.getElementsByClassName("original-video-play")[0];
                                play_button.addEventListener("click", async function () {
                                    let url = await main.getPCSLink(g_file_id, g_share_id);
                                    let d = document.createElement("a");
                                    d.download = g_file_name;
                                    d.rel = "noopener";
                                    d.href = url;
                                    d.dispatchEvent(new MouseEvent("click"));
                                });
                            }
                            else {
                                quality[2].innerHTML += `<li class="drawer-item--2cNtQ original-video-play" data-is-current="false">
                                            <div class="text--AMJbu">原画播放</div>
                                        </li>`;
                                let play_button = document.getElementsByClassName("original-video-play")[0];
                                play_button.addEventListener("click", async function () {
                                    let url = await main.getRealLink(g_drive_id, g_file_id);
                                    let scheme = GM_getValue('url-scheme');
                                    url = scheme + url;
                                    let d = document.createElement("a");
                                    d.download = g_file_name;
                                    d.rel = "noopener";
                                    d.href = url;
                                    d.dispatchEvent(new MouseEvent("click"));
                                });
                            }
                            clearInterval(ins);
                        }
                    }, 50);

                }

                send.apply(this, arguments);
            };
        }
    };
    main.init();
})();
