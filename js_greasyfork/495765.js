// ==UserScript==
// @name         Page Click Tool
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Page Click Tool For Saker!
// @author       Jimmy
// @include      *
// @icon         https://img.staticdj.com/02face4114a147617cabf02ab9c59cec.png
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/moment@2.29.1/moment.min.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@10.16.6/dist/sweetalert2.all.min.js
// @license      AGPL License
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_cookie
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/495765/Page%20Click%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/495765/Page%20Click%20Tool.meta.js
// ==/UserScript==

(function() {
    //弹出框提示
    let toast = Swal.mixin({
        toast: true,
        position: 'center', // 'top-end',
        showreplaceButton: false,
        timer: 3500,
        timerProgressBar: false,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    });

    //数据操作
    let util = {
        clog(c) {
            console.log(c);
        },
        getCookie(name) {
            let arr = document.cookie.replace(/\s/g, "").split(';');
            for (let i = 0, l = arr.length; i < l; i++) {
                let tempArr = arr[i].split('=');
                if (tempArr[0] == name) {
                    return decodeURIComponent(tempArr[1]);
                }
            }
            return '';
        },
        getValue(name) {
            return GM_getValue(name);
        },
        setValue(name, value) {
            GM_setValue(name, value);
        },
        getStorage(key) {
            return localStorage.getItem(key);
        },
        setStorage(key, value) {
            return localStorage.setItem(key, value);
        },
        blobDownload(blob, filename) {
            if (blob instanceof Blob) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.click();
                URL.revokeObjectURL(url);
            }
        },
        message: {
            success(text) {
                toast.fire({title: text, icon: 'success'});
            },
            error(text) {
                toast.fire({title: text, icon: 'error'});
            },
            warning(text) {
                toast.fire({title: text, icon: 'warning'});
            },
            info(text) {
                toast.fire({title: text, icon: 'info'});
            },
            question(text) {
                toast.fire({title: text, icon: 'question'});
            }
        },
        post(url, data, headers, type) {
            if (Object.prototype.toString.call(data) === '[object Object]') {
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
        get(url, headers, type) {
            return new Promise((resolve, reject) => {
                let requestObj = GM_xmlhttpRequest({
                    method: "GET", url, headers,
                    responseType: type || 'json',
                    onload: (res) => {
                        if (res.status === 404) {
                            requestObj.abort();
                        }
                        resolve(res.response || res.responseText);
                    },
                    onprogress: (res) => {
                    },
                    onloadstart() {
                    },
                    onerror: (err) => {
                        reject(err);
                    },
                });
            });
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
        getUrlParam(name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]); return null;
        }
    };

    GM_addStyle(`
        .web-editor-inspect {
            cursor: default !important;
            outline: rgb(119, 0, 255) dashed 2px !important;
        }
        .web-editor-inspect-active {
            outline: rgb(119, 0, 255) solid 2px !important;
        }
    `);

    'use strict';

    document.body.contentEditable='true';

    document.addEventListener('contextmenu', function(event) {
        event.stopPropagation();
    }, true);

    document.addEventListener('copy', function(event) {
        event.stopPropagation();
    }, true);

})();