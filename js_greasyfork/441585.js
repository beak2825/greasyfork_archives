// ==UserScript==
// @name         加密m3u8视频下载
// @namespace    https://www.tampermonkey.net/
// @version      1.0.0
// @description  研究学习网络视频加密方法，仅供学习使用，请下载后24小时内删除，对使用脚本造成的后果自行承担!
// @author       xxx
// @match        *://*/*
// @require      https://unpkg.com/ajax-hook@2.0.3/dist/ajaxhook.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_info
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441585/%E5%8A%A0%E5%AF%86m3u8%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/441585/%E5%8A%A0%E5%AF%86m3u8%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
(function () {
    'use strict';

    let config = {
        domId: '_ly_jmspxzzs_2',
        btns: {
            download: '_ly_download_2',
            push: '_ly_m3u8_push_2',
        },
        capture: false,
        loading: false,
    };

    var polyv_videos = {};
    var bokecc_videos = {};
    var qiqiuyun_videos = {};

    ah.proxy({
        onRequest: (config, handler) => {
            handler.next(config);
        },
        onError: (err, handler) => {
            handler.next(err)
        },
        onResponse: (response, handler) => {
            try {
                console.log('test11111111')
                handleResponse(response);
            } catch (e) {
                alert('视频处理失败了，请提交反馈并附上链接。error:' + e.message || 'none')
                console.log(e)
            }

            handler.next(response)
        }
    })

    try {
        Object.assign(XMLHttpRequest, { UNSENT: 0, OPENED: 1, HEADERS_RECEIVED: 2, LOADING: 3, DONE: 4 });
    } catch (e) {
        console.log(e)
    }

    window.addEventListener ? window.addEventListener("message", listenerMessages, !1) : window.attachEvent("onmessage", listenerMessages)

    function listenerMessages(e) {
        var host = window.location.host;
        try {
            if (host === 'service-cdn.qiqiuyun.net') {
                return listenerQiqiuyun(e);
            }
        } catch (t) {
            console.log(t)
        }

    }

    function listenerQiqiuyun(t) {
        var e = t.data;
        if ("object" !== typeof e) {
            e = JSON.parse(t.data);
        }

        if (!e.cmd || e.cmd !== 'init') {
            return false;
        }
        var vid = e.options.resource.no;

        if (!qiqiuyun_videos[vid]) {
            qiqiuyun_videos[vid] = {};
        }

        qiqiuyun_videos[vid].title = e.options.resource.name;
        qiqiuyun_videos[vid].version = e.options.coreConfig.hls.version;

    }

    function handleResponse(response) {
        var host = window.location.host;
        if (host === 'service-cdn.qiqiuyun.net') {
            return handleQiqiuyun(response);
        }


        var domain_pattern = /[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+\.?/;

        var matchs = response.config.url.match(domain_pattern);

        if (!matchs) {
            return false;
        }

        switch (matchs[0]) {
            case 'hls.videocc.net':
            case 'player.polyv.net':
                handleVideocc(response)
                break;
            case 'p.bokecc.com':
                handleBokecc(response)
                break;
            default:
                if (matchs[0].indexOf('.play.bokecc.com') > -1 && response.config.url.indexOf('.m3u8') > -1) {
                    handleBokecc(response)
                    break;
                }
        }
    }

    function handleQiqiuyun(response) {
        var url = response.config.url;
        var matchs = url.match(/\/hls\/(\d+)\/(clef|stream)/);
        var matchs2 = url.match(/\/(hls_clef|hls_stream)\/(.*)\?resNo=([a-zA-Z0-9]{32})/);

        var vid, type;
        if (matchs) {
            vid = matchs[1];
            type = matchs[2];
        } else if (matchs2) {
            vid = matchs2[3];
            type = matchs2[1].replace('hls_', '');
        } else {
            return false;
        }



        if (!qiqiuyun_videos[vid]) {
            qiqiuyun_videos[vid] = {};
        }

        var content = response.response;
        if (type === 'clef') {

            qiqiuyun_videos[vid].key = content;

            var decrypt_key = uint8arrayToBase64(decryptQiqiuyunKey(content, qiqiuyun_videos[vid].version));

            qiqiuyun_videos[vid].decrypt_key = decrypt_key;

            if (qiqiuyun_videos[vid].m3u8) {
                qiqiuyun_videos[vid].m3u8 = qiqiuyun_videos[vid].m3u8.replace(/URI="(.+?)"/g, 'URI="base64:' + decrypt_key + '"');
                addBtns(vid, 'qiqiuyun');
            }

        } else {
            qiqiuyun_videos[vid].m3u8_url = url;
            qiqiuyun_videos[vid].m3u8 = content;
        }
    }

    function handleBokecc(response) {
        var url = response.config.url;

        var matchs = url.match(/([a-zA-Z0-9]{32})/g);

        if (!matchs) {
            return false;
        }

        var vid = matchs[0];

        if (!bokecc_videos[vid]) {
            bokecc_videos[vid] = {};
        }

        var content = response.response;
        if (url.indexOf('servlet/hlskey') > -1) {
            decryptBokecc259(vid, content);
        } else if (url.indexOf('.m3u8') > -1) {
            var m3u8_url = url.split('.m3u8')[0];
            bokecc_videos[vid].ts_url = m3u8_url;
            bokecc_videos[vid].ts_vid = m3u8_url.split('/').pop();
            bokecc_videos[vid].m3u8_url = url;
            bokecc_videos[vid].m3u8 = content;
        }
    }

    function decryptBokecc259(vid, data) {
        bokecc_videos[vid].key = data

        data = new Uint8Array(data);
        if (data.length > 16) {

            if (data[0] !== 0) {
                return false;
            }

            data = data.subarray(1);

            var invSBox = base64ToUint8Array("Uglq1TA2pTi/QKOegfPX+3zjOYKbL/+HNI5DRMTe6ctUe5QypsIjPe5MlQtC+sNOCC6hZijZJLJ2W6JJbYvRJXL49mSGaJgW1KRczF1ltpJscEhQ/e252l4VRlenjZ2EkNirAIy80wr35FgFuLNFBtAsHo/KPw8Cwa+9AwETims6kRFBT2fc6pfyz87wtOZzlqx0IuetNYXi+TfoHHXfbkfxGnEdKcWJb7diDqoYvhv8Vj5LxtJ5IJrbwP54zVr0H92oM4gHxzGxEhBZJ4DsX2BRf6kZtUoNLeV6n5PJnO+g4DtNrir1sMjruzyDU5lhFysEfrp31ibhaRRjVSEMfQ==");

            for (var i = 0; i < data.length; i++) {
                var t = data[i];
                if (t < 0) {
                    t = 255 & t;
                }
                data[i] = invSBox[t];
            }

            data = data.subarray(0, 16)
        }

        bokecc_videos[vid].decrypt_key = uint8arrayToBase64(data)
        bokecc_videos[vid].m3u8 = bokecc_videos[vid].m3u8.replace(/URI="(.+?)"/g, 'URI="base64:' + bokecc_videos[vid].decrypt_key + '"');
        bokecc_videos[vid].m3u8 = bokecc_videos[vid].m3u8.replace(new RegExp(bokecc_videos[vid].ts_vid, 'g'), bokecc_videos[vid].ts_url);

        addBtns(vid, 'bokecc');
    }

    function handleVideocc(response) {
        var url = response.config.url;
        var vid = getPolyvVid(url);


        if (!vid) {
            return false;
        }

        if (!polyv_videos[vid]) {
            polyv_videos[vid] = {};
        }

        var content = response.response;
        if (url.indexOf('.key?token') > -1) {
            handleVideoKey(vid, url, content);
        } else if (url.indexOf('.m3u8?pid') > -1) {
            polyv_videos[vid].m3u8 = content
        } else if (url.indexOf('.json') > -1) {
            content = JSON.parse(content).body;
            polyv_videos[vid].json = content
            decryptVideoJson(vid, content)
        }

    }

    function handleVideoKey(vid, url, content) {

        polyv_videos[vid].key_url = url
        polyv_videos[vid].key_vid = getPolyvKeyVid(url);
        polyv_videos[vid].token = getPolyvToken(url);
        polyv_videos[vid].key = content

        var drm = url.match(/playsafe\/(v\d+)\//);

        if (drm) {
            drm = drm[1];
        } else {
            drm = 'v10';
        }
        polyv_videos[vid].drm = drm;


        switch (drm) {
            case 'v10':
                decryptV10Key(vid);
                break;
            case 'v11':
                console.log('已升级~');
                break;
            case 'v1102':
                decryptV1102Key(vid);
                break;
        }

    }

    function getPolyvVid(url) {
        var matchs = url.match(/([a-zA-Z0-9]{32})/g);
        return matchs ? matchs[0] : false;
    }

    function getPolyvKeyVid(url) {
        var matchs = url.match(/([a-zA-Z0-9_]{34})/g);
        return matchs ? matchs[0] : false;
    }

    function getPolyvToken(url) {
        var matchs = url.match(/([a-zA-Z0-9-]{36,64})/g);
        return matchs ? matchs[0] : false;
    }

    function decryptVideoJson(vid, json) {
        var new_vid = vid + '_' + vid.substring(0, 1);
        var md5 = CryptoJS.MD5(new_vid).toString();
        var key = md5.substring(0, 16);
        var iv = md5.substring(16, 32);

        var de_info = aesDecrypt(json, key, iv);

        de_info = CryptoJS.enc.Base64.parse(de_info).toString(CryptoJS.enc.Utf8);
        de_info = JSON.parse(de_info);
        polyv_videos[vid].title = de_info['title'];
        polyv_videos[vid].seed_const = de_info['seed_const'];
    }

    function decryptV10Key(vid) {
        if (!polyv_videos[vid] || !polyv_videos[vid].key || polyv_videos[vid].seed_const == null) {
            return false
        }
        var key = CryptoJS.MD5(polyv_videos[vid].seed_const + '').toString().substring(0, 16);
        var iv = CryptoJS.enc.Hex.parse('01020305070B0D1113171D0705030201').toString(CryptoJS.enc.Utf8);
        var decrypt_key = aesDecryptArrayBuffer(polyv_videos[vid].key, key, iv);
        if (decrypt_key) {
            polyv_videos[vid].decrypt_key = decrypt_key;
            polyv_videos[vid].m3u8 = polyv_videos[vid].m3u8.replace(/URI="(.+?)"/g, 'URI="base64:' + decrypt_key + '"');
            addBtns(vid, 'polyv');
        }
        return decrypt_key;
    }

    function decryptV1102Key(vid) {
        if (!polyv_videos[vid] || !polyv_videos[vid].key || polyv_videos[vid].seed_const == null) {
            return false
        }
        var seed_const_md5 = CryptoJS.MD5('YIQi0wUE57S1HRPUzcSN' + polyv_videos[vid].seed_const).toString();
        var seed_const = (function (seed_const, seed_const_md5) {
            var i, val, arr = [], v;
            seed_const_md5 = stringToUint8Array(seed_const_md5);
            for (i in seed_const_md5) {
                v = seed_const_md5[i];
                if (v + seed_const - 97 < 0) {
                    val = -(-(v + seed_const - 97) % 26)
                } else {
                    val = ((v + seed_const - 97) % 26)
                }
                arr.push(val + 97)
            }
            return Uint8ArrayToString(arr);
        })(polyv_videos[vid].seed_const, seed_const_md5);

        var token = polyv_videos[vid].token.split('-').pop().substring(1);
        token = func_0(token, { 'l': 'a', 'p': 'b', 'm': 'c', 'k': 'd', 'e': 'o', 'n': 'f', 'j': 'g', 'i': 'h', 'b': 'i', 'h': 'j', 'u': 'k', 'v': 'l', 'g': 'n', 'y': 'm', 'c': 'e', 'f': 'p', 't': 'q', 'x': 'r', 'd': 's', 'r': 't', 'z': 'u', 's': 'v', 'o': 'w', 'a': 'x', 'w': 'y', 'q': 'z', '0': '0', '1': '1', '2': '2', '6': '3', '7': '4', '8': '5', '3': '6', '4': '7', '5': '8', '9': '9' })

        var key = (function (token, seed_const) {
            var arr = [];
            var key_arr = [0, 6, 12, 18, 24, 30, 1, 5, 7, 11, 13, 17, 19, 23, 25, 29, 31, 2, 4, 8, 10, 14, 16, 20, 22, 26, 28, 3, 9, 15, 21, 27];
            for (var i in key_arr) { arr.push(token[key_arr[i]]); }
            return CryptoJS.MD5(arr.join('') + seed_const).toString().substring(0, 16);
        })(CryptoJS.MD5(token).toString(), seed_const);

        var iv = CryptoJS.enc.Hex.parse('01020305070B0D1113171D0705030201').toString(CryptoJS.enc.Utf8);


        var decrypt_key = aesDecryptArrayBuffer(polyv_videos[vid].key, key, iv);

        if (decrypt_key) {
            decrypt_key = (function (value) {
                var arr = [];
                var key_arr = [0, 4, 8, 12, 1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15];
                for (var i in key_arr) { if (typeof (value[key_arr[i]]) != 'undefined') { arr.push(value[key_arr[i]]); } }
                return uint8arrayToBase64(new Uint8Array(arr));
            })(base64ToUint8Array(decrypt_key));


            polyv_videos[vid].decrypt_key = decrypt_key;
            polyv_videos[vid].m3u8 = polyv_videos[vid].m3u8.replace(/URI="(.+?)"/g, 'URI="base64:' + decrypt_key + '"');
            addBtns(vid, 'polyv');
        }

        return decrypt_key;
    }


    function decryptQiqiuyunKey(key, version) {
        key = new Uint8Array(key);
        var length = key.length;
        var index = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        if (length === 20) {
            var q = "a".charCodeAt(0);
            var a, u;
            if (version === 2) {
                a = parseInt(String.fromCharCode(key[0]), 36) % 2;
                u = parseInt("" + String.fromCharCode(key[a]) + String.fromCharCode(key[a + 1]), 36) % 3;
                if (u === 2) {
                    key[3] = key[3] - q + 26 * (parseInt(String.fromCharCode(key[4]), 10) + 1) - q
                    key[8] = key[8] - q + 26 * (parseInt(String.fromCharCode(key[9]), 10) + 1) - q
                    key[14] = key[14] - q + 26 * (parseInt(String.fromCharCode(key[15]), 10) + 1) - q
                    key[18] = key[18] - q + 26 * (parseInt(String.fromCharCode(key[19]), 10) + 2) - q
                    index = [0, 1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 14, 16, 17, 18]
                } else if (u === 1) {
                    index = [0, 1, 2, 3, 4, 12, 13, 14, 7, 6, 18, 17, 15, 8, 9, 10]
                } else {
                    index = [0, 1, 2, 12, 13, 14, 15, 16, 17, 18, 4, 5, 6, 7, 9, 10]
                }
            } else if (version === 3) {
                a = parseInt(String.fromCharCode(key[0]), 36) % 2;
                u = parseInt("" + String.fromCharCode(key[a]) + String.fromCharCode(key[a + 1]), 36) % 3;
                if (u === 2) {
                    key[5] = key[5] - q + 26 * (parseInt(String.fromCharCode(key[6]), 10) + 1) - q
                    key[9] = key[9] - q + 26 * (parseInt(String.fromCharCode(key[10]), 10) + 1) - q
                    key[13] = key[13] - q + 26 * (parseInt(String.fromCharCode(key[14]), 10) + 1) - q
                    key[17] = key[17] - q + 26 * (parseInt(String.fromCharCode(key[18]), 10) + 2) - q
                    index = [0, 1, 2, 3, 4, 5, 7, 8, 9, 11, 12, 13, 15, 16, 17, 19]
                } else if (u === 1) {
                    index = [0, 1, 2, 8, 9, 10, 11, 12, 18, 17, 16, 15, 14, 4, 5, 6]
                } else {
                    index = [0, 1, 2, 3, 4, 15, 16, 17, 18, 10, 11, 12, 13, 6, 7, 8]
                }
            } else {
                a = parseInt(String.fromCharCode(key[0]), 36) % 7;
                u = parseInt("" + String.fromCharCode(key[a]) + String.fromCharCode(key[a + 1]), 36) % 3;
                if (u === 2) {
                    key[8] = key[8] - q + 26 * (parseInt(String.fromCharCode(key[9]), 10) + 1) - q
                    key[10] = key[10] - q + 26 * (parseInt(String.fromCharCode(key[11]), 10) + 1) - q
                    key[15] = key[15] - q + 26 * (parseInt(String.fromCharCode(key[16]), 10) + 1) - q
                    key[17] = key[17] - q + 26 * (parseInt(String.fromCharCode(key[18]), 10) + 2) - q
                    index = [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 13, 14, 15, 17, 19]
                } else if (u === 1) {
                    index = [0, 1, 2, 3, 4, 12, 13, 14, 7, 6, 18, 17, 15, 8, 9, 10]
                } else {
                    index = [0, 1, 2, 12, 13, 14, 15, 16, 17, 18, 4, 5, 6, 7, 9, 10]
                }
            }
        } else if (length === 17) {
            index = [8, 9, 2, 3, 4, 5, 6, 7, 0, 1, 10, 11, 12, 13, 14, 15];
        }
        var decrypt_key = [];
        index.map(function (e) {
            decrypt_key.push(key[e])
        })
        return new Uint8Array(decrypt_key);
    }

    function func_0(value, key) {
        var res = '';
        value = value.split('');
        for (var i in value) {
            res += key[value[i]] || '';
        }
        return res;
    }

    function toBytes(t) {
        for (var e = [], i = 0; i < t.length; i += 2) e.push(parseInt(t.substr(i, 2), 16));
        return e
    }

    function aesDecrypt(data, key, iv) {
        var encryptedHexStr = CryptoJS.enc.Hex.parse(data);
        var srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
        var decrypt = CryptoJS.AES.decrypt(srcs, CryptoJS.enc.Utf8.parse(key), { iv: CryptoJS.enc.Utf8.parse(iv), mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
        return decrypt.toString(CryptoJS.enc.Utf8);
    }

    function aesDecryptArrayBuffer(data, key, iv) {
        data = CryptoJS.lib.WordArray.create(data).toString(CryptoJS.enc.Base64)
        var decrypt = CryptoJS.AES.decrypt(data, CryptoJS.enc.Utf8.parse(key), { iv: CryptoJS.enc.Utf8.parse(iv), mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
        return decrypt.toString(CryptoJS.enc.Base64);
    }

    function Uint8ArrayToString(fileData) {
        var dataString = "";
        for (var i = 0; i < fileData.length; i++) {
            dataString += String.fromCharCode(fileData[i]);
        }

        return dataString
    }

    function uint8arrayToBase64(u8Arr) {
        var CHUNK_SIZE = 0x8000; //arbitrary number
        var index = 0;
        var length = u8Arr.length;
        var result = '';
        var slice;
        while (index < length) {
            slice = u8Arr.subarray(index, Math.min(index + CHUNK_SIZE, length));
            result += String.fromCharCode.apply(null, slice);
            index += CHUNK_SIZE;
        }
        return btoa(result);
    }

    function base64ToUint8Array(base64String) {
        var padding = '='.repeat((4 - base64String.length % 4) % 4);
        var base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
        var rawData = window.atob(base64);
        var outputArray = new Uint8Array(rawData.length);
        for (var i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    function stringToUint8Array(str) {
        var arr = [];
        for (var i = 0, j = str.length; i < j; ++i) {
            arr.push(str.charCodeAt(i));
        }
        return new Uint8Array(arr);
    }

    document.onreadystatechange = function () {
        //         zmQuery('body').append(`<script>
        // //console.log = ()=> {}
        // //window.Firebug = false;
        // //console.clear = () => {};
        // </script>`)
        appendDom();
        document.querySelector('#_m3u8_port_2').addEventListener('click', function () { return false; })
        document.querySelector('.ly_download_m3u8').addEventListener('click', clickDownLoad)
    };

    function addBtns(vid, type) {
        var data = {};
        if (type === 'polyv') {
            data = polyv_videos[vid];
        } else if (type === 'bokecc') {
            data = bokecc_videos[vid];
        } else if (type === 'qiqiuyun') {
            data = qiqiuyun_videos[vid];
        } else {
            return false;
        }
        if (data.added) {
            return true;
        }
        data.added = true;
        let down_btn = document.createElement('div')
        down_btn.className = '_jss_btns ly_download_m3u8'
        down_btn.dataset.vid = vid
        down_btn.dataset.type = type
        down_btn.innerText = '下载' + (data.title || vid)
        document.querySelector('#' + config.domId).append(down_btn)
        document.querySelector('.ly_download_m3u8').addEventListener('click', clickDownLoad)
    }

    function clickDownLoad(e) {
        var data = e.target.dataset;
        if (!data || !data.vid || !data.type) {
            return alert('出错啦，没获取到vid');
        }
        var vid = data.vid;
        if (data.type === 'polyv') {
            data = polyv_videos[vid];
        } else if (data.type === 'bokecc') {
            data = bokecc_videos[vid];
        } else if (data.type === 'qiqiuyun') {
            data = qiqiuyun_videos[vid];
        } else {
            return alert('出错啦，未知类型');
        }
        if (!data) {
            return alert('出错啦，没找到视频');
        }
        var a = document.createElement('a')
        a.download = (data.title || vid) + '.m3u8'
        a.href = URL.createObjectURL(new Blob([data.m3u8], { type: 'application/vnd.apple.mpegurl' }))
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        a.remove()
    }

    function appendDom() {
        let style = `
            #${config.domId} {
                position: fixed;
                top: 50px;
                right: 30px;
                z-index: 99999;
            }
            #_m3u8_port_2 {
                width: 35px;
                margin-right: 10px;
                font-size: 12px;
                text-align: center;
            }
            ._jss_btns {
                margin-bottom:10px;
                padding: 0 20px;
                z-index: 99999;
                color: white;
                cursor: pointer;
                font-size: 15px;
                font-weight: bold;
                line-height: 40px;
                text-align: center;
                border-radius: 3px;
                background-color: #e6222a;
                box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.2);
            }
        `;
        let style_node = document.createElement('style')
        style_node.innerText = style
        document.body.append(style_node)
        let down_btn = document.createElement('div')
        down_btn.id = config.domId
        document.body.append(down_btn)
    }

})();