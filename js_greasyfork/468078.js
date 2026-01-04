// ==UserScript==
// @name         喵传链接
// @namespace    https://t.me/KyokuSai
// @version      0.1.3
// @description  生成、转存秒传链接喵
// @author       HanaCream
// @match        *://pan.baidu.com/disk/home*
// @match        *://pan.baidu.com/disk/main*
// @match        *://yun.baidu.com/disk/home*
// @match        *://yun.baidu.com/disk/main*
// @match        *://wangpan.baidu.com/disk/home*
// @match        *://wangpan.baidu.com/disk/main*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @connect      baidu.com
// @connect      baidupcs.com
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/468078/%E5%96%B5%E4%BC%A0%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/468078/%E5%96%B5%E4%BC%A0%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

(function () {
    'use strict';

    if (GM_getValue('savepath') === undefined) GM_setValue('savepath', '');
    if (GM_getValue('ua') === undefined) GM_setValue('ua', 'nekoupload');
    if (GM_getValue('debug') === undefined) GM_setValue('debug', false);
    if (GM_getValue('purify') === undefined) GM_setValue('purify', false);
    if (GM_getValue('drag') === undefined) GM_setValue('drag', true);
    if (GM_getValue('dlinkapi') === undefined) GM_setValue('dlinkapi', false);
    let $_savepath = GM_getValue('savepath');
    let $_ua = GM_getValue('ua');
    let $_debug = GM_getValue('debug');
    let $_purify = GM_getValue('purify');
    let $_drag = GM_getValue('drag');
    let $_dlinkapi = GM_getValue('dlinkapi');

    var styleElement = document.createElement('style');
    styleElement.innerHTML = `
.nekoupload-switch{position:relative;display:inline-block;width:64px;height:26px;transition:all .3s ease}.nekoupload-switch>div{position:absolute;top:0;right:0;bottom:0;left:0;cursor:pointer;border:1px solid #626262;border-radius:32px;background:0 0}.nekoupload-switch>div:before{position:absolute;bottom:2px;left:3px;width:20px;height:20px;content:"";transition:all .3s cubic-bezier(.55,-.36,.59,1.46);border-radius:50%;background-color:#9c9c9c}.checked.nekoupload-switch>div{border-color:#fa4276}.checked.nekoupload-switch>div:before{transform:translateX(36px);background-color:#fa4276}#nekoupload_dialog *{box-sizing:border-box}#nekoupload_dialog{position:fixed;top:0;left:0;right:0;bottom:0;width:100%;height:100%;display:none;z-index:10000}#nekoupload_dialog_filter{position:fixed;top:0;left:0;right:0;bottom:0;width:100%;height:100%;z-index:10001;display:block;transition:opacity .3s ease;background:rgba(0,0,0,.2);opacity:0}#nekoupload_dialog_container{display:flex;position:absolute;top:50%;left:50%;transform:translate(-50%,calc(-50% + 4rem));width:min(600px,98%);background:#fff;align-items:center;border-radius:8px;overflow:hidden;flex-direction:column;z-index:10002;transition:all .3s ease;box-shadow:-1px 0 4px rgba(0,0,0,.04),0 1px 7px rgba(0,0,0,.07),3px 1px 12px rgba(0,0,0,.09)}.nekoupload-dialog-opened #nekoupload_dialog_filter{opacity:1}.nekoupload-dialog-opened #nekoupload_dialog_container{transform:translate(-50%,-50%)}body.nekoupload-dialog-opened{overflow:hidden}#nekoupload_dialog_title{font-size:1.2rem;font-weight:700;line-height:1;padding:.8rem;width:100%;text-align:center;background:#ffcad9}#nekoupload_dialog_content{font-size:1rem;font-weight:600;line-height:1.4;padding:1rem;color:#333;max-height:60vh;overflow:auto;width:100%;word-wrap:break-word}#nekoupload_dialog_btn{padding:.4rem}#nekoupload_dialog_btn button{background:#ff8ad2;padding:.4rem 1.2rem;border-radius:16px;margin:0 1rem;box-shadow:-1px 0 4px rgba(0,0,0,.04),0 1px 7px rgba(0,0,0,.07),3px 1px 12px rgba(0,0,0,.09);transition:all .3s ease;border:0;font-size:1.2rem;line-height:1;font-weight:700;color:#fff}#nekoupload_dialog_btn button:hover{background:#ff69f2;border:0}#nekoupload_btn{position:fixed;bottom:1.6rem;right:2rem;height:-moz-max-content;height:max-content;z-index:9999;transition:all .3s ease;display:flex;flex-direction:column}#nekoupload_btn button{width:2.8rem;height:2.8rem;background:#fff;border-radius:8px;color:#ff4276;font-size:1.2rem;font-weight:700;box-shadow:-1px 0 4px rgba(0,0,0,.04),0 1px 7px rgba(0,0,0,.07),3px 1px 12px rgba(0,0,0,.09);transition:all .3s ease;border:0;margin:4px}#nekoupload_btn button:hover{color:#fff;background:rgba(255,66,118,.64);border:0}#nekoupload_btn_settings svg{width:100%;height:100%;padding:.5rem}#nekoupload_btn button:hover .nekoupload-setting{fill:#fff}#nekoupload_nekocode{width:100%;min-height:5rem;text-align:left;margin:1rem 0;padding:.4rem .6rem;border-radius:8px;box-shadow:-1px 0 4px rgba(0,0,0,.04),0 1px 7px rgba(0,0,0,.07),3px 1px 12px rgba(0,0,0,.09);border:0;outline:0}.nekoupload-input{width:100%;min-height:1rem;text-align:left;margin:0 0 1rem;padding:.4rem .6rem;border-radius:8px;box-shadow:-1px 0 4px rgba(0,0,0,.04),0 1px 7px rgba(0,0,0,.07),3px 1px 12px rgba(0,0,0,.09);border:0;outline:0}#nekoupload_nekocode::-moz-placeholder,.nekoupload-input::-moz-placeholder{color:#999;font-size:1rem;font-weight:400}#nekoupload_nekocode::placeholder,.nekoupload-input::placeholder{color:#999;font-size:1rem;font-weight:400}#nekoupload_nekocode_savepath{margin:0}#nekoupload_filedrop{position:fixed;width:100%;height:50%;top:50%;left:0;z-index:1000001;pointer-events:none}#nekoupload_filedrop>div{position:fixed;top:0;left:0;width:100%;height:100%;z-index:10000;pointer-events:inherit;-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);background:rgba(0,0,0,.05);transition:all .3s ease;color:#fff;text-shadow:-1px 0 4px rgba(0,0,0,.04),0 1px 7px rgba(0,0,0,.07),3px 1px 12px rgba(0,0,0,.09);letter-spacing:4px;text-indent:4px;font-size:2.4rem;font-weight:700;text-align:center;display:flex;flex-direction:column;justify-content:center;opacity:0}#nekoupload_filedrop.nekoupload-filedroping>div{opacity:1}
`;
    document.head.appendChild(styleElement);

    let dialogPara = {
        duration: 300,
        opened: false,
    };
    function dialog_show($title = '', $content = '', $args = {}) {
        return new Promise((resolve) => {
            $('#nekoupload_dialog_filter').off('click');
            if ($args === {} || $args.force === null || $args.force === undefined || $args.force !== true) {
                $('#nekoupload_dialog_filter').on('click', function () {
                    dialog_reset();
                    resolve(null);
                })
            }

            function dialog_open() {
                $('#nekoupload_dialog').fadeIn(dialogPara.duration);
                $('#nekoupload_dialog').addClass('nekoupload-dialog-opened');
                $('body').addClass('nekoupload-dialog-opened');
                $('#nekoupload_dialog_title').html($title);
                $('#nekoupload_dialog_content').html($content);
                if ($args !== {}) {
                    if ($args.confirmText !== null && $args.confirmText !== undefined && $args.confirmText !== '') {
                        $('#nekoupload_dialog_btn_confirm').html($args.confirmText).show().on('click', function () {
                            resolve(true);
                        });
                    } else {
                        $('#nekoupload_dialog_btn_confirm').html($args.confirmText).hide();
                    }
                    if ($args.cancelText !== null && $args.cancelText !== undefined && $args.cancelText !== '') {
                        $('#nekoupload_dialog_btn_cancel').html($args.cancelText).show().on('click', function () {
                            resolve(false);
                        });
                    } else {
                        $('#nekoupload_dialog_btn_cancel').html($args.confirmText).hide();
                    }
                }
            }

            function dialog_reset() {
                $('#nekoupload_dialog').fadeOut(dialogPara.duration);
                $('#nekoupload_dialog').removeClass('nekoupload-dialog-opened');
                $('body').removeClass('nekoupload-dialog-opened');
                setTimeout(() => {
                    $('#nekoupload_dialog_title').html('');
                    $('#nekoupload_dialog_content').html('');
                    $('#nekoupload_dialog_btn_confirm').html('').hide().off('click');
                    $('#nekoupload_dialog_btn_cancel').html('').hide().off('click');
                }, dialogPara.duration);
            }

            let dialog_is_opened = $('#nekoupload_dialog').hasClass('nekoupload-dialog-opened');
            if (dialog_is_opened && $title !== '') {
                dialog_reset();
                setTimeout(() => {
                    dialog_open();
                }, dialogPara.duration);
            } else {
                if (dialog_is_opened || $title === '') {
                    dialog_reset();
                } else {
                    dialog_open();
                }
            }
        });
    }
    function dialog_update($title = '', $content = '') {
        if ($('#nekoupload_dialog').hasClass('nekoupload-dialog-opened')) {
            if ($title !== '') $('#nekoupload_dialog_title').html($title);
            if ($content !== '') $('#nekoupload_dialog_content').html($content);
        }
    }


    function decryptMd5(md5) {
        if (!((parseInt(md5[9]) >= 0 && parseInt(md5[9]) <= 9) ||
            (md5[9] >= "a" && md5[9] <= "f")))
            return decrypt(md5);
        else
            return md5;
        function decrypt(encryptMd5) {
            var key = (encryptMd5[9].charCodeAt(0) - "g".charCodeAt(0)).toString(16);
            var key2 = encryptMd5.substr(0, 9) + key + encryptMd5.substr(10);
            var key3 = "";
            for (var a = 0; a < key2.length; a++)
                key3 += (parseInt(key2[a], 16) ^ (15 & a)).toString(16);
            var md5 = key3.substr(8, 8) +
                key3.substr(0, 8) +
                key3.substr(24, 8) +
                key3.substr(16, 8);
            return md5;
        }
    }
    function getSelectedFileList() {
        if (location.href.includes('baidu.com/disk/main')) {
            return document.querySelector(".nd-main-list, .nd-new-main-list").__vue__.selectedList;
        } else {
            return unsafeWindow.require("system-core:context/context.js").instanceForSystem.list.getSelected();
        }
    }
    function getBdstoken() {
        if (location.href.includes('baidu.com/disk/main')) {
            return document.querySelector(".nd-main-list, .nd-new-main-list").__vue__.yunData.bdstoken;
        } else {
            return unsafeWindow.locals.get("bdstoken");
        }
    }
    function refreshList() {
        if (location.href.includes('baidu.com/disk/main')) {
            return document.querySelector(".nd-main-list, .nd-new-main-list").__vue__.reloadList();
        } else {
            return unsafeWindow.require("system-core:system/baseService/message/message.js").trigger("system-refresh");
        }
    }
    function convertData(data) {
        var query = "";
        for (var key in data)
            query += "&" + key + "=" + encodeURIComponent(data[key]);
        return query;
    }
    var ajax_assign = (undefined && undefined.__assign) || function () {
        ajax_assign = Object.assign || function (t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                    t[p] = s[p];
            }
            return t;
        };
        return ajax_assign.apply(this, arguments);
    };

    function ajax(config) {
        return new Promise(function (resolve, reject) {
            GM_xmlhttpRequest(ajax_assign(ajax_assign({
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36",
                }
            }, config), {
                onload: function (res) {
                    resolve(res);
                }, onerror: function () {
                    reject();
                }
            }))
        });
    }

    function get_slice_md5(file, dlink) {
        return new Promise(async function (resolve, reject) {
            var data = await ajax({
                url: dlink,
                method: "GET",
                responseType: "arraybuffer",
                headers: {
                    "Range": "bytes=0-" + (file.size < 262144 ? 1 : 262143),
                    "User-Agent": $_ua,
                },
            });
            if (data.status !== 206) {
                if ($_debug) console.dir(data);
                resolve([]);
            }
            var _md5 = data.responseHeaders.match(/content-md5:[ ]([\da-f]{32})/i)[1];
            var _slice_md5 = _md5;
            if (!(file.size < 262144)) {
                _slice_md5 = CryptoJS.MD5(CryptoJS.lib.WordArray.create(data.response)).toString(CryptoJS.enc.Hex).toUpperCase();
            }
            resolve([_md5, _slice_md5]);
        });
    }
    function download_single(panfiles, i, dlink) {
        return new Promise(async function (resolve, reject) {
            var data = await ajax({
                url: dlink,
                method: "GET",
                headers: {
                    "Range": "bytes=0-1",
                    "User-Agent": $_ua,
                },
            });
            if (data.status !== 206) {
                if ($_debug) console.dir(data);
                resolve(false);
            }
            dlink = data.finalUrl;
            if ($_debug) console.dir(dlink);
            var _command = await dialog_show('\u89E3\u6790\u6210\u529F', `
            \u6587\u4EF6\u540D\u79F0\uFF1A${panfiles[i].server_filename}<br>
            \u4E0B\u8F7DUA: ${$_ua}<br>
            \u6587\u4EF6\u76F4\u94FE\uFF1A${dlink}<br>
            <br>
            \u8FDB\u5EA6\uFF1A${i} / ${panfiles.length}<br>
            `, {
                confirmText: '\u590D\u5236\u76F4\u94FE',
                cancelText: '\u76F4\u63A5\u4E0B\u8F7D',
            });
            if (_command === true) {
                GM_setClipboard(dlink);
            } else if (_command === false) {
                dialog_show('\u4E0B\u8F7D\u4E2D\u2026', `
                \u6587\u4EF6\u540D\u79F0\uFF1A${panfiles[i].server_filename}<br>
                \u4E0B\u8F7D\u8FDB\u5EA6\uFF1A0%<br>
                <br>
                \u8FDB\u5EA6\uFF1A${i} / ${panfiles.length}<br>
                `, {
                    force: true,
                });
                data = await ajax({
                    url: dlink,
                    method: "GET",
                    responseType: "arraybuffer",
                    headers: {
                        "Range": "bytes=0-" + (panfiles[i].size - 1),
                        "User-Agent": $_ua,
                    },
                    onprogress: function (event) {
                        try {
                            if (!event) return;
                            var _percent = ((event.loaded / event.total) * 100).toFixed() + "%";
                            if ($_debug) console.dir(_percent);
                            dialog_update('', `
                            \u6587\u4EF6\u540D\u79F0\uFF1A${panfiles[i].server_filename}<br>
                            \u4E0B\u8F7D\u8FDB\u5EA6\uFF1A${_percent}<br>
                            <br>
                            \u8FDB\u5EA6\uFF1A${i} / ${panfiles.length}<br>
                            `);
                        } catch (_) { }
                    },
                });
                if (data.response.byteLength !== panfiles[i].size) {
                    if ($_debug) console.dir(data);
                    // resolve(false);
                }
                var url = URL.createObjectURL(new Blob([data.response]));
                var link = document.createElement('a');
                link.href = url;
                link.download = panfiles[i].server_filename;
                link.click();
                URL.revokeObjectURL(url);
                resolve(true);
            }
        });
    }


    function sleep(time) {
        return new Promise(function (resolve) {
            setTimeout(resolve, time);
        });
    }
    function get_md5s(file) {
        if ($_debug) console.dir(file);
        return new Promise(function (resolve, reject) {
            var reader = new FileReader();
            reader.onloadend = function (e) {
                var md5 = CryptoJS.MD5(CryptoJS.enc.Latin1.parse(e.target.result)).toString(CryptoJS.enc.Hex).toUpperCase();
                var slice_md5 = md5;
                if (file.size > 262144) {
                    slice_md5 = CryptoJS.MD5(CryptoJS.enc.Latin1.parse(e.target.result.slice(0, 262144))).toString(CryptoJS.enc.Hex).toUpperCase();
                }
                if ($_debug) console.dir(md5);
                if ($_debug) console.dir(slice_md5);
                resolve(md5 + '#' + slice_md5);
            };
            reader.readAsBinaryString(file);
        });
    }
    async function get_nekoupload_offline($files) {
        if ($_debug) console.dir($files);
        var _filearray = Array.from($files).filter(file => !(file.size > 21474836480));
        var command = await dialog_show('\u751F\u6210\u79BB\u7EBF\u79D2\u4F20', `
        \u203B\u6B64\u529F\u80FD\u4E3A\u79BB\u7EBF\u529F\u80FD\uFF0C\u4E0D\u7ECF\u8FC7\u767E\u5EA6\u7F51\u76D8\u3002<br>
        \u203B\u751F\u6210\u7684\u79D2\u4F20\u4EC5\u5728\u4E91\u7AEF\u5DF2\u6709\u8BE5\u6587\u4EF6\u65F6\u53EF\u4EE5\u8F6C\u5B58\u3002<br>
        \u7531\u4E8E\u79D2\u4F20\u4EC5\u652F\u6301\u4E0D\u8D85\u8FC720G\u7684\u6587\u4EF6\uFF0C\u6545\u6B64\u5904\u4E5F\u4F1A\u6821\u9A8C\u6587\u4EF6\u5927\u5C0F\u3002<br>
        \u8BF7\u52A1\u5FC5\u7406\u89E3\u6B64\u9879\u64CD\u4F5C\u7684\u610F\u4E49\u3002<br>
        <br>
        \u4E0D\u652F\u6301\u6587\u4EF6\u5217\u8868\uFF1A<br>
        ${Array.from($files).filter(file => file.size > 21474836480).map(file => file.name).join('<br>')}
        <br>
        \u6240\u9009\u6587\u4EF6\u5217\u8868\uFF1A<br>
        ${_filearray.map(file => file.name).join('<br>')}
        `, {
            confirmText: '\u751F\u6210',
        });
        if (command === true) {
            dialog_show('\u8BF7\u7B49\u5F85', `
            \u79BB\u7EBF\u79D2\u4F20\u751F\u6210\u4E2D\u3002<br>
            <br>
            \u8FDB\u5EA6\uFF1A0 / ${_filearray.length}
            `, {
                force: true,
            });
            await sleep(500);
            var res = [];
            for (var i = 0; i < $files.length; i++) {
                var file = $files[i];
                if ($_debug) console.dir(file.name);
                var md5s = await get_md5s(file);
                res.push(md5s + '#' + file.size + '#' + file.name);
                if ($_debug) console.dir(res[i]);
                dialog_update('', `
                \u79BB\u7EBF\u79D2\u4F20\u751F\u6210\u4E2D\u3002<br>
                <br>
                \u8FDB\u5EA6\uFF1A${i + 1} / ${_filearray.length}
                `);
            }
            var _command = await dialog_show('\u79BB\u7EBF\u79D2\u4F20\u751F\u6210\u5B8C\u6210', `
            \u6587\u4EF6\u603B\u6570\uFF1A${_filearray.length}<br>
            <br>
            \u79D2\u4F20\u94FE\u63A5\uFF1A<br>
            ${res.join("<br>")}
            `, {
                confirmText: '\u590D\u5236\u79D2\u4F20\u94FE\u63A5',
                // cancelText: '复制跳转链接',
            });
            if (_command === true) {
                GM_setClipboard(res.join("\n"));
                dialog_show();
            }
        }
    }

    function nekoupload_init() {

        if (!$('#nekoupload_dialog').length) {
            $('body').append(`
                <div id="nekoupload_dialog">
                    <div id="nekoupload_dialog_filter">
                    </div>
                    <div id="nekoupload_dialog_container">
                        <div id="nekoupload_dialog_title">
                        </div>
                        <div id="nekoupload_dialog_content">
                        </div>
                        <div id="nekoupload_dialog_btn">
                            <button id="nekoupload_dialog_btn_cancel">
                            </button>
                            <button id="nekoupload_dialog_btn_confirm">
                            </button>
                        </div>
                    </div>
                </div>
            `);
        }

        var version = '0.1.3';
        if (!GM_getValue('version_check') || GM_getValue('version_check') !== version) {
            dialog_show('\u55B5\u4F20\u94FE\u63A5', `
            \u811A\u672C\u4EC5\u4F9B\u4EA4\u6D41\u5B66\u4E60\u4F7F\u7528\u3002<br>
            \u90E8\u5206\u529F\u80FD\u53C2\u8003 mengzonefire \u5236\u4F5C\u7684\u811A\u672C\u3002<br>
            \u203B\u6309\u94AE\u5728\u53F3\u4E0B\u89D2\uFF01<br>
            \u203B\u8BF7\u5C3D\u91CF\u5728pan.baidu.com\u8FD9\u4E2A\u57DF\u540D\uFF0C\u5E76\u4E14\u4F7F\u7528\u65B0\u7248\u754C\u9762\u3002<br>
            <br>
            \u5173\u4E8E\u6B64\u811A\u672C\uFF1A<br>
            \u7531\u4E0D\u77E5\u540D\u7F51\u53CB\u5236\u4F5C\uFF0C\u56E0\u4E3A\u6CA1\u5199\u8FC7\u6CB9\u7334\u811A\u672C\u6240\u4EE5\u975E\u5E38\u4E0D\u5B8C\u5584\u3002<br>
            \u6216\u8BB8\u4F1A\u968F\u7740\u767E\u5EA6\u7F51\u76D8\u63A5\u53E3\u66F4\u65B0\u800C\u5931\u6548\uFF0C\u4F46\u662F\u811A\u672C\u4E0D\u4F1A\u81EA\u52A8\u66F4\u65B0\u3002<br>
            <br>
            \u811A\u672C\u4F7F\u7528\u8BF4\u660E\uFF1A<br>
            \u203B\u8F6C\u5B58\u53EA\u652F\u6301\u6807\u51C6\u957F\u94FE\u63A5\uFF01<br>
            \u203B\u8F6C\u5B58\u53EA\u652F\u6301\u6807\u51C6\u957F\u94FE\u63A5\uFF01<br>
            \u203B\u8F6C\u5B58\u53EA\u652F\u6301\u6807\u51C6\u957F\u94FE\u63A5\uFF01<br>
            \u203B\u9ED8\u8BA4\u63A5\u53E3\u751F\u6210\u79D2\u4F20\u4F1A\u4E3A\u6BCF\u4E2A\u6587\u4EF6\u521B\u5EFA\u4E00\u6B211\u5929\u7684\u5206\u4EAB\u94FE\u63A5\uFF01<br>
            <br>
            \u66F4\u65B0\u65E5\u5FD7\uFF1A<br>
            0.1.2\uFF1A\u4FEE\u590D\u4E2D\u6587\u4E71\u7801\uFF0C\u6DFB\u52A0\u4E86\u914D\u7F6E\u8BBE\u7F6E\uFF0C\u6DFB\u52A0\u83B7\u53D6\u76F4\u94FE\u529F\u80FD\uFF0C\u4FEE\u590D\u4E00\u4E9B\u9519\u8BEF\u3002<br>
            0.1.3\uFF1A\u589E\u52A0\u4E86\u79BB\u7EBF\u79D2\u4F20\u529F\u80FD\uFF0C\u5141\u8BB8\u66F4\u6362\u4E0D\u9700\u8981\u521B\u5EFA\u5206\u4EAB\u7684\u63A5\u53E3\uFF0C\u4FEE\u590D\u4E86\u5DF2\u77E5\u7684\u51E0\u4E2A\u751F\u6210\u79D2\u4F20\u548C\u8F6C\u5B58\u9519\u8BEF\uFF0C\u589E\u52A0\u4E86\u4E00\u4E9B\u989D\u5916\u7684\u914D\u7F6E\u548C\u529F\u80FD\u3002
            `);
            GM_setValue('version_check', version);
        }

        $(document).on('click', '.nekoupload-switch', function () {
            $(this).toggleClass('checked');
        });

        if ($_purify) {

            var styleElement = document.createElement('style');
            styleElement.innerHTML = `
.nd-chat-ai-btn{display:none!important}.wp-s-header-user__create-team-title{display:none!important}.u-button u-svip-button{display:none!important}.u-svip-button--mini{display:none!important}.web-header-ad-item{display:none!important}.wp-s-aside-nav__main-bottom{display:none!important}
            `;
            document.head.appendChild(styleElement);
            // $('.wp-s-aside-nav__sub').hide();
        }

        if (!$('#nekoupload_btn').length) {
            $('body').append(`
                <div id="nekoupload_btn">
                    <button id="nekoupload_btn_settings">
                        <svg t="1685720104649" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5535" width="200" height="200"><path class="nekoupload-setting" d="M512.3 709.1c-108.7 0-197.2-88.4-197.2-197.2s88.4-197.2 197.2-197.2S709.4 403.3 709.4 512c0 44.8-15.4 88.6-43.4 123.4L638.1 613c23.2-28.9 35.5-63.8 35.5-101 0-89-72.4-161.3-161.3-161.3S351 423 351 512s72.4 161.3 161.3 161.3c25.3 0 49.5-5.7 71.9-16.9l16 32.1c-27.4 13.7-57 20.6-87.9 20.6z" fill="#FF7878" p-id="5536"></path><path class="nekoupload-setting" d="M347.1 924c-11.1 0-22.3-2.9-32.2-8.6l-52.4-30.2c-19.8-11.4-31.8-32.5-31.3-55l1.6-83.9c0.3-16.6-3.9-33-12.3-47.6l-13.1-22.6c-8.3-14.3-20.4-26.3-34.9-34.7l-76.9-44.3c-19.3-11.1-31.4-31.7-31.4-53.7l-0.1-62.1c0-22.6 12.4-43.5 32.6-54.5l74.2-40.6c15.5-8.5 28.2-20.9 36.8-35.9l12.3-21.4c8.3-14.5 12.6-30.9 12.2-47.5l-1.9-87.9c-0.5-22.5 11.5-43.6 31.2-55l51.7-30c20.1-11.6 44.9-11.6 65 0.2l74.3 43.6c15.1 8.9 32.4 13.5 50 13.5h22c18.3 0 36.1-5 51.5-14.5l68.8-42.1c20.2-12.4 45.4-12.7 65.9-0.9l52.1 30.1c19 11 31.1 31.3 31.3 52.9l1.2 90.7c0.2 15.6 4.5 31 12.3 44.5l13.8 23.9c8.4 14.5 20.7 26.7 35.5 35.1l71.4 40.4c19.6 11.1 31.8 31.8 31.8 54l0.1 63c0 21.6-11.6 42-30.3 53.2L856 640.6c-13.9 8.4-25.5 20.1-33.4 34l-14.5 25.2c-7.8 13.6-12 29-12.2 44.6l-1 86.8c-0.2 21.7-12.2 42-31.2 53L711 914.8c-19.9 11.5-44.6 11.5-64.5 0.1l-70-40.4c-14.9-8.6-32-13.2-49.4-13.2H502.2c-16.9 0-33.5 4.3-48.1 12.5l-75.5 42.1c-9.8 5.4-20.6 8.1-31.5 8.1z m-1.4-788.3c-5 0-9.9 1.3-14.3 3.9l-51.7 30c-8.5 4.9-13.6 13.8-13.4 23.2l1.9 87.9c0.5 23.1-5.4 46-17 66.2l-12.3 21.4c-11.9 20.8-29.5 37.9-50.7 49.5L114 458.4c-8.6 4.7-14 13.6-14 23.1l0.1 62.1c0 9.2 5.1 17.9 13.4 22.7l76.9 44.3c20 11.5 36.6 28.1 48 47.8l13.1 22.6c11.7 20.2 17.6 43.1 17.1 66.2L267 831c-0.2 9.5 5 18.3 13.4 23.2l52.4 30.2c8.7 5 19.5 5.1 28.2 0.2l75.5-42.1c19.9-11.1 42.6-17 65.5-17H526.9c23.7 0 47 6.2 67.4 18l70 40.4c8.8 5.1 19.8 5.1 28.6 0l52.7-30.6c8.2-4.8 13.2-13.2 13.3-22.4l1-86.8c0.3-21.7 6.1-43.2 17-62l14.5-25.2c11-19.1 26.9-35.3 46-46.8l73.9-44.5c8.1-4.9 13-13.3 13-22.5l-0.1-63c0-9.3-5.2-18.1-13.6-22.8l-71.4-40.4c-20.4-11.5-37.4-28.3-49-48.3l-13.8-23.9c-10.9-18.9-16.8-40.3-17.1-62l-1.2-90.7c-0.1-9.1-5.3-17.7-13.4-22.4l-52.1-30.1c-9.1-5.3-20.3-5.1-29.2 0.4L594.8 182c-21 12.9-45.3 19.7-70.2 19.8h-22c-24 0-47.5-6.4-68.1-18.5l-74.3-43.6c-4.5-2.7-9.5-4-14.5-4z" fill="#FF7878" p-id="5537"></path></svg>
                    </button>
                    <button id="nekoupload_btn_trigger">
                        <span>\u55B5</span>
                    </button>
                </div>
            `);

            $('#nekoupload_btn_trigger').on('click', async function () {
                // var generatebdlinkTask = new GeneratebdlinkTask();
                var panfiles = getSelectedFileList().filter((_item) => _item.isdir !== 1);
                if (panfiles.length > 0) {
                    var errmsg = [];
                    var command = await dialog_show('\u8BF7\u9009\u62E9\u64CD\u4F5C', `
                    \u751F\u6210\u79D2\u4F20\u548C\u76F4\u63A5\u4E0B\u8F7D\u90FD\u4F1A\u4E3A\u6BCF\u4E2A\u6587\u4EF6\u521B\u5EFA\u4E00\u4E2A1\u5929\u7684\u5206\u4EAB\u94FE\u63A5\uFF01<br>
                    \u6682\u4E0D\u652F\u6301\u52FE\u9009\u7684\u6587\u4EF6\u5939<br>
                    \u8BF7\u5728\u4E86\u89E3\u4E4B\u540E\u4F7F\u7528\u3002<br>
                    <br>
                    \u5DF2\u9009\u4E2D\u6587\u4EF6\uFF08${panfiles.length}\u4E2A\uFF09\uFF1A<br>
                    ` + panfiles.map((_item) => _item.server_filename).join("<br>"), {
                        confirmText: '\u751F\u6210\u79D2\u4F20',
                        cancelText: '\u76F4\u63A5\u4E0B\u8F7D',
                    });
                    if (command !== null) {
                        if (command === true) {
                            dialog_show('\u8BF7\u7B49\u5F85', `
                            \u79D2\u4F20\u94FE\u63A5\u751F\u6210\u4E2D\u2026\u2026<br>
                            <br>
                            \u8FDB\u5EA6\uFF1A0 / ${panfiles.length}<br>
                            \u51FA\u9519\uFF1A0 / ${panfiles.length}
                            `, {
                                force: true,
                            });
                        }
                        var res = [];
                        for (var i = 0; i < panfiles.length; i++) {
                            var file = panfiles[i];
                            var $md5 = decryptMd5(file['md5']), $size = file['size'], $fs_id = file['fs_id'], $shareid, $randsk, $uk, $sign, $timestamp, $slice_md5;
                            var $surl = '', $spwd = 1234;

                            if (command === false) {
                                dialog_show('\u8BF7\u7B49\u5F85', `
                                    \u83B7\u53D6\u6587\u4EF6\uFF1A${file.server_filename}<br>
                                    <br>
                                    \u8FDB\u5EA6\uFF1A${i} / ${panfiles.length}<br>
                                    \u51FA\u9519\uFF1A${errmsg.length} / ${panfiles.length}
                                    `, {
                                    force: true,
                                });
                            }

                            var $dlink;
                            if ($_dlinkapi) {
                                var data = await ajax({
                                    url: "https://pan.baidu.com/api/filemetas?dlink=1&fsids=" + JSON.stringify([String($fs_id)]),
                                    responseType: "json",
                                    method: "GET",
                                    headers: {
                                        "User-Agent": $_ua,
                                    }
                                });
                                if (data.status !== 200 || data.response.errno > 0) {
                                    errmsg.push('\u83B7\u53D6dlink\u5931\u8D25\uFF1A' + file.server_filename);
                                    if ($_debug) console.dir(data);
                                    if ($_debug) console.dir(errmsg);
                                    continue;
                                }
                                data = data.response;
                                $dlink = data.info[0].dlink;
                            } else {
                                var data = await ajax({
                                    url: "https://pan.baidu.com/share/set?channel=chunlei&web=1&app_id=250528&logid=MTU4MTk0MzY0MTQwNzAuNDA0MzQxOTM0MzE2MzM4Ng==&clienttype=0",
                                    responseType: "json",
                                    method: "POST",
                                    data: convertData({
                                        'schannel': 4,
                                        'channel_list': '[]',
                                        'period': 1,
                                        'pwd': $spwd,
                                        'fid_list': JSON.stringify([file.fs_id]),
                                    })
                                });
                                if (data.status !== 200 || data.response.errno > 0) {
                                    errmsg.push('\u521B\u5EFA\u5206\u4EAB\u94FE\u63A5\u5931\u8D25\uFF1A' + file.server_filename);
                                    if ($_debug) console.dir(data);
                                    if ($_debug) console.dir(errmsg);
                                    continue;
                                }
                                data = data.response;
                                $shareid = data.shareid;

                                $surl = /https\:\/\/pan.baidu.com\/s\/(.*)/.exec(data.link)[1];
                                data = await ajax({
                                    url: 'https://pan.baidu.com/s/' + $surl,
                                });
                                if (data.status !== 200 || data.response.errno > 0) {
                                    errmsg.push('\u83B7\u53D6BDCLND\u51FA\u9519\uFF1A' + file.server_filename);
                                    if ($_debug) console.dir(data);
                                    if ($_debug) console.dir(errmsg);
                                    continue;
                                }
                                if (data.responseHeaders.indexOf('BDCLND=') === -1) {
                                    errmsg.push('\u83B7\u53D6BDCLND\u5931\u8D25\uFF1A' + file.server_filename);
                                    if ($_debug) console.dir(data);
                                    if ($_debug) console.dir(errmsg);
                                    continue;
                                }
                                $randsk = data.responseHeaders.match(/BDCLND=(.+?);/)[1];
                                data = data.response;
                                $uk = JSON.parse(data.match(/locals.mset\((\{.*?\})\);/)[1]).share_uk;

                                data = await ajax({
                                    url: 'https://pan.baidu.com/share/tplconfig?shareid=' + $shareid + '&uk=' + $uk + '&fields=sign,timestamp&channel=chunlei&web=1&app_id=250528&clienttype=0',
                                    responseType: "json",
                                });
                                if (data.status !== 200 || data.response.errno > 0) {
                                    errmsg.push('\u83B7\u53D6\u989D\u5916\u4FE1\u606F\u5931\u8D25\uFF1A' + file.server_filename);
                                    if ($_debug) console.dir(data);
                                    if ($_debug) console.dir(errmsg);
                                    continue;
                                }
                                data = data.response;
                                $sign = data['data'].sign;
                                $timestamp = data['data'].timestamp;
                                data = await ajax({
                                    url: 'https://pan.baidu.com/api/sharedownload?channel=chunlei&clienttype=12&web=1&app_id=250528&sign=' + $sign + '&timestamp=' + $timestamp,
                                    method: "POST",
                                    headers: {
                                        "Referer": "https://pan.baidu.com/disk/home",
                                    },
                                    responseType: "json",
                                    data: convertData({
                                        encrypt: 0,
                                        extra: '{"sekey":"' + decodeURIComponent($randsk) + '"}',
                                        fid_list: "[" + $fs_id + "]",
                                        primaryid: $shareid,
                                        uk: $uk,
                                        product: 'share',
                                        type: 'nolimit',
                                    }),
                                });
                                if (data.status !== 200 || data.response.errno > 0) {
                                    errmsg.push('\u83B7\u53D6dlink\u5931\u8D25\uFF1A' + file.server_filename);
                                    if ($_debug) console.dir(data);
                                    if ($_debug) console.dir(errmsg);
                                    continue;
                                }
                                data = data.response;
                                $dlink = data.list[0].dlink
                            }

                            if (command === true) {
                                $slice_md5 = await get_slice_md5(file, $dlink);
                                if ($slice_md5 === []) {
                                    errmsg.push('\u4E0B\u8F7D\u5206\u7247\u5931\u8D25\uFF1A' + file.server_filename);
                                    if ($_debug) console.dir(data);
                                    if ($_debug) console.dir(errmsg);
                                    continue;
                                }
                                $md5 = $slice_md5[0].toUpperCase(); //修正md5
                                $slice_md5 = $slice_md5[1].toUpperCase();
                                res.push($md5 + '#' + $slice_md5 + '#' + $size + '#' + file.server_filename);

                                dialog_update('', `
                                \u79D2\u4F20\u94FE\u63A5\u751F\u6210\u4E2D\u2026\u2026<br>
                                <br>
                                \u8FDB\u5EA6\uFF1A${i + 1} / ${panfiles.length}<br>
                                \u51FA\u9519\uFF1A${errmsg.length} / ${panfiles.length}
                                `);
                            } else {
                                var _tmp = await download_single(panfiles, i, $dlink);
                                if (_tmp === false) {
                                    errmsg.push('\u4E0B\u8F7D\u5931\u8D25\uFF1A' + file.server_filename);
                                }
                            }
                        }
                        if (command === true) {
                            if ($_debug) console.log(res);
                            var _command = await dialog_show('\u751F\u6210\u7ED3\u679C', `
                            \u6587\u4EF6\u603B\u6570\uFF1A${panfiles.length}<br>
                            \u51FA\u9519\u603B\u6570\uFF1A${errmsg.length}<br>
                            <br>
                            \u51FA\u9519\u4FE1\u606F\uFF1A<br>
                            ${errmsg.join("<br>")}<br>
                            <br>
                            \u79D2\u4F20\u94FE\u63A5\uFF1A<br>
                            ${res.join("<br>")}
                            `, {
                                confirmText: '\u590D\u5236\u79D2\u4F20\u94FE\u63A5',
                                // cancelText: '复制跳转链接',
                            });
                            if (_command === true) {
                                GM_setClipboard(res.join("\n"));
                                dialog_show();
                            }
                        } else {
                            dialog_show();
                        }
                    }
                } else {

















                    var _command = await dialog_show('\u79D2\u4F20\u8F6C\u5B58&\u79BB\u7EBF\u79D2\u4F20', `
                    <p>\u203B\u53EA\u652F\u6301\u6807\u51C6\u957F\u94FE\u63A5\uFF01</p>
                    <p>\u203B\u6587\u4EF6\u5927\u5C0F\u4E0D\u80FD\u8D85\u8FC720G\uFF01</p>
                    <p>\u203B\u5982\u679C\u76EE\u5F55\u4E2D\u5DF2\u6709\u8BE5\u6587\u4EF6\uFF0C\u4F1A\u8FDB\u884C\u8986\u76D6</p>
                    <p>\u8BF7\u8F93\u5165\u79D2\u4F20\u4EE3\u7801\uFF1A</p>
                    <textarea id="nekoupload_nekocode" placeholder="\u8F93\u5165\u79D2\u4F20\u94FE\u63A5\u3002\n\u203B\u4EC5\u80FD\u8F6C\u5B58\u6807\u51C6\u957F\u94FE\u63A5\uFF01"></textarea>
                    <input class="nekoupload-input" id="nekoupload_nekocode_savepath" placeholder="\u8F93\u5165\u4FDD\u5B58\u8DEF\u5F84\uFF0C\u9ED8\u8BA4\u5F53\u524D\u6587\u4EF6\u5939" value="${$_savepath}"></input>
                    `, {
                        confirmText: '\u8F6C\u5B58',
                        cancelText: '\u751F\u6210\u79BB\u7EBF\u79D2\u4F20',
                    });
                    var _reg = /([\d+a-fA-F]{32})#([\d+a-fA-F]{32})#(\d+)#(.*)(\n|$)/;
                    if (_command === true) {
                        var $nekocode_original = $('#nekoupload_nekocode').val().split('\n');
                        var $savepath = $('#nekoupload_nekocode_savepath').val();
                        if ($savepath === '') {
                            var $savepath, nowPath = location.href.match(/path=(.+?)(?:&|$)/);
                            if (nowPath)
                                $savepath = decodeURIComponent(nowPath[1]);
                            else
                                $savepath = "/";
                            if ($savepath.charAt($savepath.length - 1) !== "/")
                                $savepath += "/";
                        } else {
                            $savepath = ('/' + $savepath + '/').replace(/\/\//g, '/');
                        }
                        var $bdstoken = getBdstoken();
                        var unsupport = $nekocode_original.filter((_item) => !(_item.match(_reg) && _item.match(_reg)[3] <= 21474836480));
                        var $nekocode = $nekocode_original.filter((_item) => _item.match(_reg) && _item.match(_reg)[3] <= 21474836480);
                        if (unsupport.length > 0) {
                            if (!$nekocode.length) {
                                dialog_show('\u79D2\u4F20\u4EE3\u7801\u4E0D\u652F\u6301', `
                                \u8F93\u5165\u7684\u79D2\u4F20\u4EE3\u7801\u5747\u4E0D\u652F\u6301\u3002<br>
                                \u53EA\u652F\u6301\u6807\u51C6\u957F\u94FE\u63A5\uFF0C\u4E14\u6587\u4EF6\u5927\u5C0F\u4E0D\u8D85\u8FC720G\uFF0C\u683C\u5F0F\u4E3A\uFF1A<br>
                                32\u4F4Dmd5 # 32\u4F4Dslice-md5 # \u6587\u4EF6\u5B57\u8282\u6570 # \u6587\u4EF6\u540D
                                `)
                                return;
                            } else {
                                var _confirm = await dialog_show('\u79D2\u4F20\u4EE3\u7801\u542B\u6709\u4E0D\u652F\u6301\u7684\u90E8\u5206', `
                                \u4EE5\u4E0B\u4EE3\u7801\u4E0D\u652F\u6301\uFF08${unsupport.length}\u4E2A\uFF09\uFF1A<br>
                                ${unsupport.join("<br>")}
                                `, {
                                    confirmText: `\u8F6C\u5B58\u652F\u6301\u90E8\u5206\uFF08${$nekocode.length}\u4E2A\uFF09`,
                                });
                                if (_confirm !== true) return;
                            }
                        }
                        dialog_show('\u8BF7\u7B49\u5F85', `
                            \u79D2\u4F20\u94FE\u63A5\u8F6C\u5B58\u4E2D\u2026\u2026<br>
                            <br>
                            \u8FDB\u5EA6\uFF1A0 / ${$nekocode.length}<br>
                            \u51FA\u9519\uFF1A0 / ${$nekocode.length}
                            `, {
                            force: true,
                        });
                        var res = [];
                        var errmsg = [];
                        for (var i = 0; i < $nekocode.length; i++) {
                            var $neko = $nekocode[i];
                            if ($_debug) console.dir($neko);
                            var _matches = $neko.match(_reg);
                            var $md5, $slice_md5, $size, $filepath;
                            $md5 = _matches[1].toUpperCase();
                            $slice_md5 = _matches[2].toLowerCase();
                            $size = _matches[3];
                            $filepath = _matches[4];

                            var data = await ajax({
                                url: 'https://pan.baidu.com/api/rapidupload?bdstoken=' + $bdstoken,
                                responseType: "json",
                                method: "POST",
                                data: convertData({
                                    'rtype': 0,
                                    'path': $savepath + $filepath,
                                    'content-md5': $md5.toUpperCase(),
                                    'slice-md5': $slice_md5,
                                    'content-length': $size,
                                }),
                                headers: {
                                    "User-Agent": "netdisk;2.2.51.6;netdisk;10.0.63;PC;android-android;QTP/1.0.32.2",
                                }
                            });
                            if (data.response.errno > 0) {
                                var _data = await ajax({
                                    url: 'https://pan.baidu.com/api/rapidupload?bdstoken=' + $bdstoken,
                                    responseType: "json",
                                    method: "POST",
                                    data: convertData({
                                        'rtype': 0,
                                        'path': $savepath + $filepath,
                                        'content-md5': $md5.toLowerCase(),
                                        'slice-md5': $slice_md5,
                                        'content-length': $size,
                                    }),
                                    headers: {
                                        "User-Agent": "netdisk;2.2.51.6;netdisk;10.0.63;PC;android-android;QTP/1.0.32.2",
                                    }
                                });
                                if (_data.response.errno > 0) {
                                    errmsg.push('\u8F6C\u5B58\u5931\u8D25\uFF1A' + $filepath);
                                    if ($_debug) console.dir(data);
                                    if ($_debug) console.dir(errmsg);
                                    continue;
                                }
                            }
                            res.push($filepath);
                            dialog_update('', `
                            \u79D2\u4F20\u94FE\u63A5\u8F6C\u5B58\u4E2D\u2026\u2026<br>
                            <br>
                            \u8FDB\u5EA6\uFF1A${i + 1} / ${$nekocode.length}<br>
                            \u51FA\u9519\uFF1A${errmsg.length} / ${$nekocode.length}
                            `);
                        }
                        if ($_debug) console.log(res);
                        var _command = await dialog_show('\u8F6C\u5B58\u7ED3\u679C', `
                        \u6587\u4EF6\u603B\u6570\uFF1A${$nekocode_original.length}<br>
                        \u4E0D\u652F\u6301\u6570\uFF1A${$nekocode_original.length - $nekocode.length}<br>
                        \u51FA\u9519\u603B\u6570\uFF1A${errmsg.length}<br>
                        <br>
                        \u8F6C\u5B58\u6210\u529F\uFF1A<br>
                        ${res.join("<br>")}
                        <br>
                        \u51FA\u9519\u4FE1\u606F\uFF1A<br>
                        ${errmsg.join("<br>")}
                        `, {
                            confirmText: '\u5237\u65B0\u9875\u9762',
                        });
                        if (_command === true) {
                            refreshList();
                            dialog_show();
                        }
                    } else if (_command === false) {
                        var selects = await dialog_show('\u751F\u6210\u79BB\u7EBF\u79D2\u4F20', `
                        \u203B\u6B64\u529F\u80FD\u4E3A\u79BB\u7EBF\u529F\u80FD\uFF0C\u4E0D\u7ECF\u8FC7\u767E\u5EA6\u7F51\u76D8\u3002<br>
                        \u203B\u751F\u6210\u7684\u79D2\u4F20\u4EC5\u5728\u4E91\u7AEF\u5DF2\u6709\u8BE5\u6587\u4EF6\u65F6\u53EF\u4EE5\u8F6C\u5B58\u3002<br>
                        \u7531\u4E8E\u79D2\u4F20\u4EC5\u652F\u6301\u4E0D\u8D85\u8FC720G\u7684\u6587\u4EF6\uFF0C\u6545\u6B64\u5904\u4E5F\u4F1A\u6821\u9A8C\u6587\u4EF6\u5927\u5C0F\u3002<br>
                        \u8BF7\u52A1\u5FC5\u7406\u89E3\u6B64\u9879\u64CD\u4F5C\u7684\u610F\u4E49\u3002<br>
                        <input id="nekoupload_offline" type="file" multiple>
                        `, {
                            confirmText: '\u751F\u6210',
                        });
                        if (selects === true) {
                            get_nekoupload_offline($('#nekoupload_offline').prop('files'));
                        }
                    }
                }
            });









            $('#nekoupload_btn_settings').on('click', async function () {
                var command = await dialog_show('\u8BBE\u7F6E&\u8BF4\u660E', `
                \u5173\u4E8E\u79D2\u4F20\uFF1A<br>
                \u203B\u9ED8\u8BA4\u63A5\u53E3\u751F\u6210\u65F6\u4F1A\u521B\u5EFA\u5206\u4EAB\u94FE\u63A5\uFF0C\u5927\u91CF\u521B\u5EFA\u4F1A\u88AB\u767E\u5EA6\u7981\u6B62\u5206\u4EAB\u4E00\u6BB5\u65F6\u95F4\u3002<br>
                \u203B\u8F6C\u5B58\u63A5\u53E3\u5F00\u59CB\u9700\u8981\u989D\u5916\u53C2\u6570\uFF0C\u6545\u811A\u672C\u4E0D\u4F1A\u652F\u6301\u65E7\u7684\u77ED\u79D2\u4F20\u94FE\u63A5\u3002<br>
                <br>
                \u5173\u4E8E\u4E0B\u8F7D\uFF1A<br>
                \u5982\u679C\u8D26\u53F7\u662F\u666E\u901A\u8D26\u53F7\uFF0C\u76F4\u63A5\u4E0B\u8F7D\u4E0D\u4F1A\u52A0\u901F\u4E14\u4E0D\u7A33\u5B9A\uFF0C\u4F46\u53EF\u81EA\u884C\u5BFC\u5165\u591A\u7EBF\u7A0B\u4E0B\u8F7D\u5668\u3002<br>
                \u5982\u679C\u8D26\u53F7\u662F\u4F1A\u5458\u8D26\u53F7\uFF0C\u4E0B\u8F7D\u901F\u5EA6\u4F1A\u5F88\u9AD8\u4F46\u4E0D\u5EFA\u8BAE\u4E0B\u8F7D\u5927\u6587\u4EF6\u3002<br>
                \u5982\u679C\u7528\u5176\u5B83\u4E0B\u8F7D\u5DE5\u5177\u4E0B\u8F7D\u76F4\u94FE\uFF0C\u9700\u8981\u914D\u7F6E User-Agent \u4E3A\u63D0\u793A/\u8BBE\u7F6E\u7684\u503C\u3002<br>
                <br>
                \u9ED8\u8BA4\u8F6C\u5B58\u8DEF\u5F84\uFF1A<br>
                <input class="nekoupload-input" id="nekoupload_btn_settings_savepath" placeholder="\u9ED8\u8BA4\u7A7A\u3002\u8BE5\u9879\u8BBE\u7F6E\u4E3A\u7A7A\u65F6\uFF0C\u8F6C\u5B58\u4F1A\u81EA\u52A8\u9009\u62E9\u6253\u5F00\u7684\u6587\u4EF6\u5939\u3002" value="${$_savepath}"></input>
                \u4E0B\u8F7DUA\uFF1A<br>
                <input class="nekoupload-input" id="nekoupload_btn_settings_ua" placeholder="\u9ED8\u8BA4nekoupload\u3002\u8BE5\u9879\u8BBE\u7F6E\u4E0D\u53EF\u4E3A\u7A7A\u3002" value="${$_ua}"></input>
                \u66F4\u6362\u63A5\u53E3\uFF1A
                <label class="nekoupload-switch${$_dlinkapi ? ' checked' : ''}" id="nekoupload_btn_settings_dlinkapi"><div></div></label><br>
                <span style="color: #999">
                \u9ED8\u8BA4\u5173\u95ED\uFF0C\u751F\u6210\u79D2\u4F20/\u76F4\u63A5\u4E0B\u8F7D\u4F1A\u9700\u8981\u5BF9\u6587\u4EF6\u521B\u5EFA\u5206\u4EAB\u3002\u5982\u679C\u5F00\u542F\uFF0C\u4F1A\u7F29\u77ED\u8BF7\u6C42\u65F6\u95F4\u5E76\u4E0D\u9700\u8981\u521B\u5EFA\u5206\u4EAB\u3002
                </span><br>
                \u6587\u4EF6\u62D6\u62FD\uFF1A
                <label class="nekoupload-switch${$_drag ? ' checked' : ''}" id="nekoupload_btn_settings_drag"><div></div></label><br>
                <span style="color: #999">
                \u5F00\u542F\u5219\u5141\u8BB8\u62D6\u62FD\u6587\u4EF6\u5230\u7F51\u9875\u4E0B\u534A\u533A\u57DF\u8FDB\u884C\u79BB\u7EBF\u79D2\u4F20\u7684\u751F\u6210\uFF0C\u5173\u95ED\u53EF\u4EE5\u907F\u514D\u4E00\u4E9B\u9875\u9762\u95EE\u9898\u3002
                </span><br>
                \u7B80\u6D01\u6A21\u5F0F\uFF1A
                <label class="nekoupload-switch${$_purify ? ' checked' : ''}" id="nekoupload_btn_settings_purify"><div></div></label><br>
                <span style="color: #999">
                \u5F00\u542F\u4F1A\u5C06\u7F51\u9875\u7684\u4E00\u4E9B\u5143\u7D20\u9690\u85CF\u3002
                </span><br>
                \u8C03\u8BD5\u6A21\u5F0F\uFF1A
                <label class="nekoupload-switch${$_debug ? ' checked' : ''}" id="nekoupload_btn_settings_debug"><div></div></label><br>
                <span style="color: #999">
                \u5F00\u542F\u4F1A\u5728\u63A7\u5236\u53F0\u8F93\u51FA\u4FE1\u606F\u3002
                </span><br>
                `, {
                    confirmText: '\u4FDD\u5B58\u8BBE\u7F6E\u5E76\u5237\u65B0',
                });
                if (command === true) {
                    GM_setValue('savepath', $('#nekoupload_btn_settings_savepath').val());
                    if ($('#nekoupload_btn_settings_ua').val() !== '') GM_setValue('ua', $('#nekoupload_btn_settings_ua').val());
                    GM_setValue('debug', $('#nekoupload_btn_settings_debug').hasClass('checked'));
                    GM_setValue('purify', $('#nekoupload_btn_settings_purify').hasClass('checked'));
                    GM_setValue('drag', $('#nekoupload_btn_settings_drag').hasClass('checked'));
                    GM_setValue('dlinkapi', $('#nekoupload_btn_settings_dlinkapi').hasClass('checked'));
                    // dialog_show();
                    location.reload();
                }
            })
        }








        if (!$('#nekoupload_filedrop').length && $_drag) {
            $('body').append(`
            <div id="nekoupload_filedrop"><div>\u751F\u6210\u79BB\u7EBF\u79D2\u4F20</div></div>
            `);
            $(document).on('mouseleave', function () {
                $('#nekoupload_filedrop').css('pointer-events', 'auto');
            });
            $(document).on('mouseenter', function () {
                $('#nekoupload_filedrop').css('pointer-events', 'none');
            });
            var filedrop = $('#nekoupload_filedrop');
            filedrop.on('dragenter', function (event) {
                event.stopPropagation();
                event.preventDefault();
                $(this).addClass('nekoupload-filedroping');
            });
            filedrop.on('dragover', function (event) {
                event.stopPropagation();
                event.preventDefault();
                $(this).addClass('nekoupload-filedroping');
            });
            filedrop.on('dragleave', function (event) {
                event.stopPropagation();
                event.preventDefault();
                $(this).removeClass('nekoupload-filedroping');
            });
            filedrop.on('drop', function (event) {
                event.stopPropagation();
                event.preventDefault();
                $(this).removeClass('nekoupload-filedroping');

                var files = event.originalEvent.dataTransfer.files;
                if ($_debug) console.dir(files)
                get_nekoupload_offline(files);
            });
        }
    }
    nekoupload_init();
})();