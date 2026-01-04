// ==UserScript==
// @name              网盘提速
// @license           MIT
// @namespace         https://github.com/AFANOOO/sspan
// @antifeature       membership
// @description       支持夸克/百度/阿里/天翼/迅雷/移动六大网盘，不限制速度下载的网盘解析脚本，无视黑号，拥有IDM/Aria2/Motrix三种方式任意体验极速下载！支持Microsoft Edge、Google Chrome、Firefox等浏览器 面向所有网友免费交流学习使用，更多功能正在完善中...
// @antifeature       ads
// @antifeature       tracking
// @version           1.3.6
// @author            ahonker999
// @homepage          http://bds.yt3166.com
// @supportURL        http://bds.yt3166.com
// @match             *://pan.baidu.com/*
// @match             *://yun.baidu.com/*
// @match             *://pan.baidu.com/disk/home*
// @match             *://yun.baidu.com/disk/home*
// @match             *://pan.baidu.com/disk/main*
// @match             *://yun.baidu.com/disk/main*
// @match             *://pan.baidu.com/s/*
// @match             *://yun.baidu.com/s/*
// @match             *://pan.baidu.com/share/*
// @match             *://yun.baidu.com/share/*
// @connect           localhost
// @connect           127.0.0.1
// @connect           baidu.com
// @connect           *
// @require           https://lib.baomitu.com/layui/2.9.3/layui.min.js
// @require           https://lib.baomitu.com/limonte-sweetalert2/11.10.2/sweetalert2.all.min.js
// @require           https://lib.baomitu.com/layui/2.9.3/layui.js
// @resource          customCSS https://lib.baomitu.com/layui/2.9.3/css/layui.css
// @require           https://unpkg.com/jquery@3.7.0/dist/jquery.min.js
// @require           https://unpkg.com/sweetalert2@10.16.6/dist/sweetalert2.all.min.js
// @require           https://unpkg.com/js-md5@0.7.3/build/md5.min.js
// @connect           baidu.com
// @connect           baidupcs.com
// @connect           aliyundrive.com
// @connect           alipan.com
// @connect           189.cn
// @connect           xunlei.com
// @connect           quark.cn
// @connect           bds.yt3166.com
// @connect           yun.139.com
// @connect           caiyun.139.com
// @connect           localhost
// @connect           *
// @run-at            document-idle
// @grant             unsafeWindow
// @grant             GM_xmlhttpRequest
// @grant             GM_setClipboard
// @grant             GM_setValue
// @grant             GM_getValue
// @grant             GM_deleteValue
// @grant             GM_openInTab
// @grant             GM_info
// @grant             GM_registerMenuCommand
// @grant             GM_cookie
// @grant             window.close
// @icon              data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/502655/%E7%BD%91%E7%9B%98%E6%8F%90%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/502655/%E7%BD%91%E7%9B%98%E6%8F%90%E9%80%9F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let pt = '', selectList = [], params = {}, mode = '', width = 800, pan = {}, color = '',
        doc = $(document), progress = {}, request = {}, ins = {}, idm = {};
    const scriptInfo = GM_info.script;
    const version = scriptInfo.version;
    const author = scriptInfo.author;
    const name = scriptInfo.name;
    const manageHandler = GM_info.scriptHandler;
    const manageVersion = GM_info.version;
    const customClass = {
        popup: 'pl-popup',
        header: 'pl-header',
        title: 'pl-title',
        closeButton: 'pl-close',
        content: 'pl-content',
        input: 'pl-input',
        footer: 'pl-footer'
    };

    const terminalType = {
        wc: "Windows CMD",
        wp: "Windows PowerShell",
        lt: "Linux 终端",
        ls: "Linux Shell",
        mt: "MacOS 终端",
    };

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
            let cname = name + "=";
            let ca = document.cookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i].trim();
                if (c.indexOf(cname) == 0) return c.substring(cname.length, c.length);
            }
            return "";
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

        deleteValue(name) {
            GM_deleteValue(name);
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

        getExtension(name) {
            const reg = /(?!\.)\w+$/;
            if (reg.test(name)) {
                let match = name.match(reg);
                return match[0].toUpperCase();
            }
            return '';
        },

        sizeFormat(value) {
            if (value === +value) {
                let unit = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
                let index = Math.floor(Math.log(value) / Math.log(1024));
                let size = value / Math.pow(1024, index);
                size = size.toFixed(1);
                return size + unit[index];
            }
            return '';
        },

        sortByName(arr) {
            const handle = () => {
                return (a, b) => {
                    const p1 = a.filename ? a.filename : a.server_filename;
                    const p2 = b.filename ? b.filename : b.server_filename;
                    return p1.localeCompare(p2, "zh-CN");
                };
            };
            arr.sort(handle());
        },

        fixFilename(name) {
            return name.replace(/[!?&|`"'*\/:<>\\]/g, '_');
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

        get(url, headers, type, extra) {
            return new Promise((resolve, reject) => {
                let requestObj = GM_xmlhttpRequest({
                    method: "GET", url, headers,
                    responseType: type || 'json',
                    onload: (res) => {
                        if (res.status === 204) {
                            requestObj.abort();
                            idm[extra.index] = true;
                        }
                        if (type === 'blob') {
                            res.status === 200 && base.blobDownload(res.response, extra.filename);
                            resolve(res);
                        } else {
                            resolve(res.response || res.responseText);
                        }
                    },
                    onprogress: (res) => {
                        if (extra && extra.filename && extra.index) {
                            res.total > 0 ? progress[extra.index] = (res.loaded * 100 / res.total).toFixed(2) : progress[extra.index] = 0.00;
                        }
                    },
                    onloadstart() {
                        extra && extra.filename && extra.index && (request[extra.index] = requestObj);
                    },
                    onerror: (err) => {
                        reject(err);
                    },
                });
            });
        },

        getFinalUrl(url, headers) {
            return new Promise((resolve, reject) => {
                let requestObj = GM_xmlhttpRequest({
                    method: "GET", url, headers,
                    onload: (res) => {
                        resolve(res.finalUrl)
                    },
                    onerror: (err) => {
                        reject(err);
                    }
                });
            });
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

        getMajorVersion(version) {
            const [major] = (version || '').split('.');
            return /^\d+$/.test(major) ? major : null;
        },

        findReact(dom, traverseUp = 0) {
            const key = Object.keys(dom).find(key => {
                return key.startsWith("__reactFiber$")
                    || key.startsWith("__reactInternalInstance$");
            });
            const domFiber = dom[key];
            if (domFiber == null) return null;

            if (domFiber._currentElement) {
                let compFiber = domFiber._currentElement._owner;
                for (let i = 0; i < traverseUp; i++) {
                    compFiber = compFiber._currentElement._owner;
                }
                return compFiber._instance;
            }

            const GetCompFiber = fiber => {
                let parentFiber = fiber.return;
                while (typeof parentFiber.type == "string") {
                    parentFiber = parentFiber.return;
                }
                return parentFiber;
            };
            let compFiber = GetCompFiber(domFiber);
            for (let i = 0; i < traverseUp; i++) {
                compFiber = GetCompFiber(compFiber);
            }
            return compFiber.stateNode || compFiber;
        },

        initDefaultConfig() {
            let value = [{
                name: 'setting_rpc_domain',
                value: 'http://localhost'
            }, {
                name: 'setting_rpc_port',
                value: '16800'
            }, {
                name: 'setting_rpc_path',
                value: '/jsonrpc'
            }, {
                name: 'setting_rpc_token',
                value: ''
            }, {
                name: 'setting_rpc_dir',
                value: 'D:'
            }, {
                name: 'setting_terminal_type',
                value: 'wc'
            }, {
                name: 'setting_theme_color',
                value: '#09AAFF'
            }, {
                name: 'setting_init_code',
                value: ''
            }, {
                name: 'license',
                value: ''
            }];

            value.forEach((v) => {
                base.getValue(v.name) === undefined && base.setValue(v.name, v.value);
            });
        },

     

        addPanLinkerStyle() {
            color = base.getValue('setting_theme_color');
            let css = `
            body::-webkit-scrollbar { display: none }
            ::-webkit-scrollbar { width: 6px; height: 10px }
            ::-webkit-scrollbar-track { border-radius: 0; background: none }
            ::-webkit-scrollbar-thumb { background-color: rgba(85,85,85,.4) }
            ::-webkit-scrollbar-thumb,::-webkit-scrollbar-thumb:hover { border-radius: 5px; -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.2) }
            ::-webkit-scrollbar-thumb:hover { background-color: rgba(85,85,85,.3) }
            .swal2-popup { font-size: 16px !important; }
            .pl-popup { font-size: 12px !important; }
            .pl-popup a { color: ${color} !important; }
            .pl-header { padding: 0!important;align-items: flex-start!important; border-bottom: 1px solid #eee!important; margin: 0 0 10px!important; padding: 0 0 5px!important; }
            .pl-title { font-size: 16px!important; line-height: 1!important;white-space: nowrap!important; text-overflow: ellipsis!important;}
            .pl-content { padding: 0 !important; font-size: 12px!important; }
            .pl-main { max-height: 400px;overflow-y:scroll; }
            .pl-footer {font-size: 12px!important;justify-content: flex-start!important; margin: 10px 0 0!important; padding: 5px 0 0!important; color: #f56c6c!important; }
            .pl-item { display: flex; align-items: center; line-height: 22px; }
            .pl-item-name { flex: 0 0 150px; text-align: left;margin-right: 10px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; cursor:default; }
            .pl-item-link { flex: 1; overflow: hidden; text-align: left; white-space: nowrap; text-overflow: ellipsis;cursor:pointer }
            .pl-item-btn { background: ${color}; padding: 4px 5px; border-radius: 3px; line-height: 1; cursor: pointer; color: #fff; }
            .pl-item-tip { display: flex; justify-content: space-between;flex: 1; }
            .pl-back { width: 70px; background: #ddd; border-radius: 3px; cursor:pointer; margin:1px 0; }
            .pl-ext { display: inline-block; width: 44px; background: #999; color: #fff; height: 16px; line-height: 16px; font-size: 12px; border-radius: 3px;}
            .pl-retry {padding: 3px 10px; background: #cc3235; color: #fff; border-radius: 3px; cursor: pointer;}
            .pl-browserdownload { padding: 3px 10px; background: ${color}; color: #fff; border-radius: 3px; cursor: pointer;}
            .pl-item-progress { display:flex;flex: 1;align-items:center}
            .pl-progress { display: inline-block;vertical-align: middle;width: 100%; box-sizing: border-box;line-height: 1;position: relative;height:15px; flex: 1}
            .pl-progress-outer { height: 15px;border-radius: 100px;background-color: #ebeef5;overflow: hidden;position: relative;vertical-align: middle;}
            .pl-progress-inner{ position: absolute;left: 0;top: 0;background-color: #409eff;text-align: right;border-radius: 100px;line-height: 1;white-space: nowrap;transition: width .6s ease;}
            .pl-progress-inner-text { display: inline-block;vertical-align: middle;color: #d1d1d1;font-size: 12px;margin: 0 5px;height: 15px}
            .pl-progress-tip{ flex:1;text-align:right}
            .pl-progress-how{ flex: 0 0 90px; background: #ddd; border-radius: 3px; margin-left: 10px; cursor: pointer; text-align: center;}
            .pl-progress-stop{ flex: 0 0 50px; padding: 0 10px; background: #cc3235; color: #fff; border-radius: 3px; cursor: pointer;margin-left:10px;height:20px}
            .pl-progress-inner-text:after { display: inline-block;content: "";height: 100%;vertical-align: middle;}
            .pl-btn-primary { background: ${color}; border: 0; border-radius: 4px; color: #ffffff; cursor: pointer; font-size: 12px; outline: none; display:flex; align-items: center; justify-content: center; margin: 2px 0; padding: 6px 0;transition: 0.3s opacity; }
            .pl-btn-primary:hover { opacity: 0.9;transition: 0.3s opacity; }
            .pl-btn-success { background: #55af28; animation: easeOpacity 1.2s 2; animation-fill-mode:forwards }
            .pl-btn-info { background: #606266; }
            .pl-btn-warning { background: #da9328; }
            .pl-btn-warning { background: #da9328; }
            .pl-btn-danger { background: #cc3235; }
            .ali-button {display: inline-flex;align-items: center;justify-content: center;border: 0 solid transparent;border-radius: 5px;box-shadow: 0 0 0 0 transparent;width: fit-content;white-space: nowrap;flex-shrink: 0;font-size: 14px;line-height: 1.5;outline: 0;touch-action: manipulation;transition: background .3s ease,color .3s ease,border .3s ease,box-shadow .3s ease;color: #fff;background: rgb(99 125 255);margin-left: 20px;padding: 1px 12px;position: relative; cursor:pointer; height: 32px;}
            .ali-button:hover {background: rgb(122, 144, 255)}
            .tianyi-button {margin-right: 20px; padding: 4px 12px; border-radius: 4px; color: #fff; font-size: 12px; border: 1px solid #0073e3; background: #2b89ea; cursor: pointer; position: relative;}
            .tianyi-button:hover {border-color: #1874d3; background: #3699ff;}
            .yidong-button {float: left; position: relative; margin: 20px 24px 20px 0; width: 98px; height: 36px; background: #3181f9; border-radius: 2px; font-size: 14px; color: #fff; line-height: 39px; text-align: center; cursor: pointer;}
            .yidong-share-button {display: inline-block; position: relative; font-size: 14px; line-height: 36px; height: 36px; text-align: center; color: #fff; border: 1px solid #5a9afa; border-radius: 2px; padding: 0 24px; margin-left: 24px; background: #3181f9; cursor: pointer;}
            .yidong-button:hover {background: #2d76e5;}
            .xunlei-button {display: inline-flex;align-items: center;justify-content: center;border: 0 solid transparent;border-radius: 5px;box-shadow: 0 0 0 0 transparent;width: fit-content;white-space: nowrap;flex-shrink: 0;font-size: 14px;line-height: 1.5;outline: 0;touch-action: manipulation;transition: background .3s ease,color .3s ease,border .3s ease,box-shadow .3s ease;color: #fff;background: #3f85ff;margin-left: 12px;padding: 0px 12px;position: relative; cursor:pointer; height: 36px;}
            .xunlei-button:hover {background: #619bff}
            .quark-button {display: inline-flex; align-items: center; justify-content: center; border: 1px solid #ddd; border-radius: 8px; white-space: nowrap; flex-shrink: 0; font-size: 14px; line-height: 1.5; outline: 0; color: #333; background: #fff; margin-right: 10px; padding: 0px 14px; position: relative; cursor: pointer; height: 36px;}
            .quark-button:hover { background:#f6f6f6 }
            .pl-dropdown-menu {position: absolute;right: 0;top: 30px;padding: 5px 0;color: rgb(37, 38, 43);background: #fff;z-index: 999;width: 102px;border: 1px solid #ddd;border-radius: 10px; box-shadow: 0 0 1px 1px rgb(28 28 32 / 5%), 0 8px 24px rgb(28 28 32 / 12%);}
            .pl-dropdown-menu-item { height: 30px;display: flex;align-items: center;justify-content: center;cursor:pointer }
            .pl-dropdown-menu-item:hover { background-color: rgba(132,133,141,0.08);}
            .pl-button .pl-dropdown-menu { display: none; }
            .pl-button:hover .pl-dropdown-menu { display: block!important; }
            .pl-button-init { opacity: 0.5; animation: easeInitOpacity 1.2s 3; animation-fill-mode:forwards }
             @keyframes easeInitOpacity { from { opacity: 0.5; } 50% { opacity: 1 } to { opacity: 0.5; } }
             @keyframes easeOpacity { from { opacity: 1; } 50% { opacity: 0.35 } to { opacity: 1; } }
            .element-clicked { opacity: 0.5; }
            .pl-extra { margin-top: 10px;display:flex}
            .pl-extra button { flex: 1}
            .pointer { cursor:pointer }
            .pl-setting-label { display: flex;align-items: center;justify-content: space-between;padding-top: 10px; }
            .pl-label { flex: 0 0 100px;text-align:left; }
            .pl-input { flex: 1; padding: 8px 10px; border: 1px solid #c2c2c2; border-radius: 5px; font-size: 14px }
            .pl-color { flex: 1;display: flex;flex-wrap: wrap; margin-right: -10px;}
            .pl-color-box { width: 35px;height: 35px;margin:10px 10px 0 0;; box-sizing: border-box;border:1px solid #fff;cursor:pointer }
            .pl-color-box.checked { border:3px dashed #111!important }
            .pl-close:focus { outline: 0; box-shadow: none; }
            .tag-danger {color:#cc3235;margin: 0 5px;}
            .pl-tooltip { position: absolute; color: #ffffff; max-width: 600px; font-size: 12px; padding: 5px 10px; background: #333; border-radius: 5px; z-index: 110000; line-height: 1.3; display:none; word-break: break-all;}
             @keyframes load { 0% { transform: rotate(0deg) } 100% { transform: rotate(360deg) } }
            .pl-loading-box > div > div { position: absolute;border-radius: 50%;}
            .pl-loading-box > div > div:nth-child(1) { top: 9px;left: 9px;width: 82px;height: 82px;background: #ffffff;}
            .pl-loading-box > div > div:nth-child(2) { top: 14px;left: 38px;width: 25px;height: 25px;background: #666666;animation: load 1s linear infinite;transform-origin: 12px 36px;}
            .pl-loading { width: 16px;height: 16px;display: inline-block;overflow: hidden;background: none;}
            .pl-loading-box { width: 100%;height: 100%;position: relative;transform: translateZ(0) scale(0.16);backface-visibility: hidden;transform-origin: 0 0;}
            .pl-loading-box div { box-sizing: content-box; }
            .swal2-container { z-index:100000!important; }
            body.swal2-height-auto { height: inherit!important; }
            .btn-operate .btn-main { display:flex; align-items:center; }
            `;
            this.addStyle('panlinker-style', 'style', css);
        },
   showSetting() {
            let dom = '', btn = '',
                colorList = ['#09AAFF', '#cc3235', '#526efa', '#518c17', '#ed944b', '#f969a5', '#bca280'];
            dom += `<label class="pl-setting-label"><div class="pl-label">RPC主机</div><input type="text"  placeholder="主机地址，需带上http(s)://" class="pl-input listener-domain" value="${base.getValue('setting_rpc_domain')}"></label>`;
            dom += `<label class="pl-setting-label"><div class="pl-label">RPC端口</div><input type="text" placeholder="端口号，例如：Motrix为16800" class="pl-input listener-port" value="${base.getValue('setting_rpc_port')}"></label>`;
            dom += `<label class="pl-setting-label"><div class="pl-label">RPC路径</div><input type="text" placeholder="路径，默认为/jsonrpc" class="pl-input listener-path" value="${base.getValue('setting_rpc_path')}"></label>`;
            dom += `<label class="pl-setting-label"><div class="pl-label">RPC密钥</div><input type="text" placeholder="无密钥无需填写" class="pl-input listener-token" value="${base.getValue('setting_rpc_token')}"></label>`;
            dom += `<label class="pl-setting-label"><div class="pl-label">保存路径</div><input type="text" placeholder="文件下载后保存路径，例如：D:" class="pl-input listener-dir" value="${base.getValue('setting_rpc_dir')}"></label>`;

            colorList.forEach((v) => {
                btn += `<div data-color="${v}" style="background: ${v};border: 1px solid ${v}" class="pl-color-box listener-color ${v === base.getValue('setting_theme_color') ? 'checked' : ''}"></div>`;
            });
            dom += `<label class="pl-setting-label"><div class="pl-label">访问类型</div><select class="pl-input listener-terminal">`;
            Object.keys(terminalType).forEach(k => {
                dom += `<option value="${k}" ${base.getValue('setting_terminal_type') === k ? 'selected' : ''}>${terminalType[k]}</option>`;
            });
            dom += `</select></label>`;
            dom += `<label class="pl-setting-label"><div class="pl-label">换个颜色</div> <div class="pl-color">${btn}<div></label>`;
            dom = '<div>' + dom + '</div>';
            Swal.fire({
                title: '提速配置',
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
            doc.on('input', '.listener-domain', async (e) => {
                base.setValue('setting_rpc_domain', e.target.value);
            });
            doc.on('input', '.listener-port', async (e) => {
                base.setValue('setting_rpc_port', e.target.value);
            });
            doc.on('input', '.listener-path', async (e) => {
                base.setValue('setting_rpc_path', e.target.value);
            });
            doc.on('input', '.listener-token', async (e) => {
                base.setValue('setting_rpc_token', e.target.value);
            });
            doc.on('input', '.listener-dir', async (e) => {
                base.setValue('setting_rpc_dir', e.target.value);
            });
            doc.on('change', '.listener-terminal', async (e) => {
                base.setValue('setting_terminal_type', e.target.value);
            });
        },

        registerMenuCommand() {
            GM_registerMenuCommand('⚙️ 设置', () => {
                this.showSetting();
            });
        },

        createTip() {
            $('body').append('<div class="pl-tooltip"></div>');

            doc.on('mouseenter mouseleave', '.listener-tip', (e) => {
                if (e.type === 'mouseenter') {
                    let filename = e.currentTarget.innerText;
                    let size = e.currentTarget.dataset.size;
                    let tip = `${filename}<span style="margin-left: 10px;color: #f56c6c;">${size}</span>`;
                    $(e.currentTarget).css({opacity: '0.5'});
                    $('.pl-tooltip').html(tip).css({
                        'left': e.pageX + 10 + 'px',
                        'top': e.pageY - e.currentTarget.offsetTop > 14 ? e.pageY + 'px' : e.pageY + 20 + 'px'
                    }).show();
                } else {
                    $(e.currentTarget).css({opacity: '1'});
                    $('.pl-tooltip').hide(0);
                }
            });
        },

        createLoading() {
            return $('<div class="pl-loading"><div class="pl-loading-box"><div><div></div><div></div></div></div></div>');
        },

        createDownloadIframe() {
            let $div = $('<div style="padding:0;margin:0;display:block"></div>');
            let $iframe = $('<iframe src="javascript:;" id="downloadIframe" style="display:none"></iframe>');
            $div.append($iframe);
            $('body').append($div);
        },

        getMirrorList(link, mirror, thread = 2) {
            let host = new URL(link).host;
            let mirrors = [];
            for (let i = 0; i < mirror.length; i++) {
                for (let j = 0; j < thread; j++) {
                    let item = link.replace(host, mirror[i]) + '&'.repeat(j);
                    mirrors.push(item);
                }
            }
            return mirrors.join('\n');
        },

        listenElement(element, callback) {
            const checkInterval = 500; // 检查元素的间隔时间（毫秒）
            let wasElementFound = false; // 用于跟踪元素是否之前已经找到

            function checkElement() {
                if (document.querySelector(element)) {
                    wasElementFound = true;
                    callback();
                } else if (wasElementFound) {
                    wasElementFound = false; // 元素消失后重置标志
                }

                setTimeout(checkElement, checkInterval);
            }

            checkElement();
        },
        async initDialog() {
            let result = await Swal.fire({
                title: pan.init[5],
                html: `<div><img style="width: 250px;margin-bottom: 10px;" src="data:image/png;base64,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bfd/H3Nyj/KY//l/IvMo9fvd/7Myn6tj/s+5HTv0fpJ1LfXxKX2Dv4jLPLZV+DG7Zxi25P0652HGcOJi57Q1e534M/coj5WDf2vxIW0nbcqe2cj/ozKf8y7IflvWKX1H3866Yo/RWEXcTK/n1/3Z+8GacMKW6pVh1IO5pPs35/LRNxjP9+dGefUw2kDfi0wbEz/znpW597VLaGm9QD2+9L9SSimllFJKKaWUUkpdTTsRERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERkTvkH4eXjmrZO46cAAABU21rQlT6zsr+AH+lhQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeJzt1uFpg2AUhlEHcREHcRAXcRAHcREHsbyBC7emIf+KCeeBQ5tP++tNbM5TkiRJkiRJkiRJkiRJkiRJkiRJH9FxHOe+70/nOcu1d/e/uk/3b13XcxzHc5qmx8/sGP0s99S9dRbLsjxexzAMf76HdO+yY5V9s2F2rc37PbV/1Te//o3uX7bre1Y565/lep19+8bZv7pe0/3Lc77vX//X53l+2j/X7P99Zdt67tfv27b9+sz357/9v6/6Htf3q/dArtV3+5xF1Z8d12uSJEmSJEmSJEn69wYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPhAPwr5rLhS2ipmAAARcm1rQlT6zsr+AH+r0QAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAeJztXK2zrLjTfv82JBIZi4yMxCKRkbGRyMjI2EgkEoscyZv+CHBubRWSmV/1s7W79x5mTvF0Op3+zGC0GYzpu65bjuOIRgHG8uetQbgDsBijC/o5zXnSrZnd2HVtQSgPJ3zYA8p36QsFnzAMw/99OWKey1uaXnXw3utAHJRejkD89QZcYpERk4THnfWTKiJru1QeJnhU6at4nNji8ja/J5S3LMtktHKf8kdLPAqL6Th6EsCETMbyIXORHJaAclCw/rO5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ICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iPgogICAgICAgICA8eG1wOkNyZWF0b3JUb29sPkFkb2JlIEZpcmV3b3JrcyBDUzYgKFdpbmRvd3MpPC94bXA6Q3JlYXRvclRvb2w+CiAgICAgICAgIDx4bXA6Q3JlYXRlRGF0ZT4yMDI0LTExLTExVDAxOjAyOjI5WjwveG1wOkNyZWF0ZURhdGU+CiAgICAgICAgIDx4bXA6TW9kaWZ5RGF0ZT4yMDI0LTExLTExVDAxOjAzOjEwWjwveG1wOk1vZGlmeURhdGU+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iPgogICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3BuZzwvZGM6Zm9ybWF0PgogICAgICA8L3JkZjpEZXNjcmlwdGlvbj4KICAgPC9yZGY6UkRGPgo8L3g6eG1wbWV0YT4KICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/Pg7f8FMAACAASURBVHiczJ13eFRl+vc/Z3rJ1PSEkoQWmjRFmgXFgl3WxUXddUVWXXv/uZZ1ddG1V1B3F8QKisoqSpFFQKQLSO8koWVS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" alt="1"><input class="swal2-input" id="init" type="text" placeholder="请输入提速码"></div>`,
                allowOutsideClick: false,
                showCloseButton: true,
                confirmButtonText: '确定'
            });
            if (result.isDismissed && result.dismiss === 'close') return;
            if (pan.num === $('#init').val() || pan.license === $('#init').val()) {
                base.setValue('setting_init_code', pan.num);
                base.setValue('license', pan.license);
                message.success(pan.init[2]);
                setTimeout(() => {
                    history.go(0);
                }, 1500);
            } else {
                await Swal.fire({
                    title: pan.init[3],
                    text: pan.init[4],
                    confirmButtonText: '重新输入',
                    imageUrl: pan.img,
                });
                await this.initDialog();
            }
        },
    };

    let baidu = {

        _getExtra() {
            let seKey = decodeURIComponent(base.getCookie('BDCLND'));
            return '{' + '"sekey":"' + seKey + '"' + "}";
        },

        _getSurl() {
            let reg = /(?<=s\/|surl=)([a-zA-Z0-9_-]+)/g;
            if (reg.test(location.href)) {
                return location.href.match(reg)[0];
            }
            return '';
        },

        _getFidList() {
            let fidlist = [];
            selectList.forEach(v => {
                if (+v.isdir === 1) return;
                fidlist.push(v.fs_id);
            });
            return '[' + fidlist + ']';
        },

        _resetData() {
            progress = {};
            $.each(request, (key) => {
                (request[key]).abort();
            });
            $.each(ins, (key) => {
                clearInterval(ins[key]);
            });
            idm = {};
            ins = {};
            request = {};
        },

        setBDUSS() {
            try {
                GM_cookie && GM_cookie('list', {name: 'BDUSS'}, (cookies, error) => {
                    if (!error) {
                        let BDUSS = cookies?.[0]?.value;
                        if (BDUSS) {
                            base.setStorage("baiduyunPlugin_BDUSS", {BDUSS});
                        }
                    }
                });
            } catch (e) {
            }
        },

        getBDUSS() {
            let baiduyunPlugin_BDUSS = base.getStorage('baiduyunPlugin_BDUSS') ? base.getStorage('baiduyunPlugin_BDUSS') : '{"baiduyunPlugin_BDUSS":""}';
            return baiduyunPlugin_BDUSS.BDUSS || '';
        },

        convertLinkToAria(link, filename, ua) {
            let BDUSS = this.getBDUSS();
            if (!!BDUSS) {
                filename = base.fixFilename(filename);
                return encodeURIComponent(`aria2c "${link}" --out "${filename}" --header "User-Agent: ${ua}" --header "Cookie: BDUSS=${BDUSS}"`);
            }
            return {
                link: pan.assistant,
                text: pan.init[5]
            };
        },

        convertLinkToBC(link, filename, ua) {
            let BDUSS = this.getBDUSS();
            if (!!BDUSS) {
                let cookie = `BDUSS=${BDUSS}`;
                let bc = `AA/${encodeURIComponent(filename)}/?url=${encodeURIComponent(link)}&cookie=${encodeURIComponent(cookie)}&user_agent=${encodeURIComponent(ua)}ZZ`;
                return encodeURIComponent(`bc://http/${base.e(bc)}`);
            }
            return {
                link: pan.assistant,
                text: pan.init[5]
            };
        },

        convertLinkToCurl(link, filename, ua) {
            let BDUSS = this.getBDUSS();
            if (!!BDUSS) {
                let terminal = base.getValue('setting_terminal_type');
                filename = base.fixFilename(filename);
                return encodeURIComponent(`${terminal !== 'wp' ? 'curl' : 'curl.exe'} -L -C - "${link}" -o "${filename}" -A "${ua}" -b "BDUSS=${BDUSS}"`);
            }
            return {
                link: pan.assistant,
                text: pan.init[5]
            };
        },

        addPageListener() {
            function _factory(e) {
                let target = $(e.target);
                let item = target.parents('.pl-item');
                let link = item.find('.pl-item-link');
                let progress = item.find('.pl-item-progress');
                let tip = item.find('.pl-item-tip');
                return {
                    item, link, progress, tip, target,
                };
            }

            function _reset(i) {
                ins[i] && clearInterval(ins[i]);
                request[i] && request[i].abort();
                progress[i] = 0;
                idm[i] = false;
            }

            doc.on('mouseenter mouseleave click', '.pl-button.g-dropdown-button', (e) => {
                if (e.type === 'mouseleave') {
                    $(e.currentTarget).removeClass('button-open');
                } else {
                    $(e.currentTarget).addClass('button-open');
                    $(e.currentTarget).find('.pl-dropdown-menu').show();
                }
            });
            doc.on('mouseleave', '.pl-button.g-dropdown-button .pl-dropdown-menu', (e) => {
                $(e.currentTarget).hide();
            });

            doc.on('click', '.pl-button-mode', (e) => {
                mode = e.target.dataset.mode;
                Swal.showLoading();
                this.getPCSLink();
            });
            doc.on('click', '.listener-link-api', async (e) => {
                e.preventDefault();
                let o = _factory(e);
                let $width = o.item.find('.pl-progress-inner');
                let $text = o.item.find('.pl-progress-inner-text');
                let filename = o.link[0].dataset.filename;
                let index = o.link[0].dataset.index;
                _reset(index);
                base.get(o.link[0].dataset.link, {"User-Agent": pan.ua}, 'blob', {filename, index});
                ins[index] = setInterval(() => {
                    let prog = +progress[index] || 0;
                    let isIDM = idm[index] || false;
                    if (isIDM) {
                        o.tip.hide();
                        o.progress.hide();
                        o.link.text('已成功唤起IDM，请查看IDM下载框！').animate({opacity: '0.5'}, "slow").show();
                        clearInterval(ins[index]);
                        idm[index] = false;
                    } else {
                        o.link.hide();
                        o.tip.hide();
                        o.progress.show();
                        $width.css('width', prog + '%');
                        $text.text(prog + '%');
                        if (prog === 100) {
                            clearInterval(ins[index]);
                            progress[index] = 0;
                            o.item.find('.pl-progress-stop').hide();
                            o.item.find('.pl-progress-tip').html('下载完成，正在弹出浏览器下载框！');
                        }
                    }
                }, 500);
            });
            doc.on('click', '.listener-retry', async (e) => {
                let o = _factory(e);
                o.tip.hide();
                o.link.show();
            });
            doc.on('click', '.listener-how', async (e) => {
                let o = _factory(e);
                let index = o.link[0].dataset.index;
                if (request[index]) {
                    request[index].abort();
                    clearInterval(ins[index]);
                    o.progress.hide();
                    o.tip.show();
                }

            });
            doc.on('click', '.listener-stop', async (e) => {
                let o = _factory(e);
                let index = o.link[0].dataset.index;
                if (request[index]) {
                    request[index].abort();
                    clearInterval(ins[index]);
                    o.tip.hide();
                    o.progress.hide();
                    o.link.show(0);
                }
            });
            doc.on('click', '.listener-back', async (e) => {
                let o = _factory(e);
                o.tip.hide();
                o.link.show();
            });
            doc.on('click', '.listener-link-aria, .listener-copy-all', (e) => {
                e.preventDefault();
                if (!e.target.dataset.link) {
                    $(e.target).removeClass('listener-copy-all').addClass('pl-btn-danger').html(`${pan.init[5]}👉<a href="${pan.assistant}" target="_blank" class="pl-a">点击此处安装</a>👈`);
                } else {
                    base.setClipboard(decodeURIComponent(e.target.dataset.link));
                    $(e.target).text('复制成功，快去粘贴吧！').animate({opacity: '0.5'}, "slow");
                }
            });
            doc.on('click', '.listener-link-rpc', async (e) => {
                let target = $(e.currentTarget);
                target.find('.icon').remove();
                target.find('.pl-loading').remove();
                target.prepend(base.createLoading());
                let res = await this.sendLinkToRPC(e.currentTarget.dataset.filename, e.currentTarget.dataset.link);
                if (res === 'success') {
                    $('.listener-rpc-task').show();
                    target.removeClass('pl-btn-danger').html('发送成功，快去看看吧！').animate({opacity: '0.5'}, "slow");
                } else if (res === 'assistant') {
                    target.addClass('pl-btn-danger').html(`${pan.init[5]}👉<a href="${pan.assistant}" target="_blank" class="pl-a">点击此处安装</a>👈`);
                } else {
                    target.addClass('pl-btn-danger').text('发送失败，请检查您的RPC配置信息！').animate({opacity: '0.5'}, "slow");
                }
            });
            doc.on('click', '.listener-send-rpc', (e) => {
                $('.listener-link-rpc').click();
                $(e.target).text('发送完成，发送结果见上方按钮！').animate({opacity: '0.5'}, "slow");
            });
            
            doc.on('click', '.listener-rpc-task', () => {
                let rpc = JSON.stringify({
                    domain: base.getValue('setting_rpc_domain'),
                    port: base.getValue('setting_rpc_port'),
                }), url = `${pan.d}/?rpc=${base.e(rpc)}#${base.getValue('setting_rpc_token')}`;
                GM_openInTab(url, {active: true});
            });
            document.documentElement.addEventListener('mouseup', (e) => {
                if (e.target.nodeName === 'A' && ~e.target.className.indexOf('pl-a')) {
                    e.stopPropagation();
                }
            }, true);
        },

        addButton() {
            if (!pt) return;
            let $toolWrap;
            let $button = $(`<div class="g-dropdown-button pointer pl-button"><div style="color:#fff;background: ${color};border-color:${color}" class="g-button g-button-blue"><span class="g-button-right"><em class="icon icon-download"></em><span class="text" style="width: 60px;">下载提速</span></span></div><div class="menu" style="width:auto;z-index:41;border-color:${color}"><div style="color:${color}" class="g-button-menu pl-button-mode" data-mode="api">API下载</div><div style="color:${color}" class="g-button-menu pl-button-mode" data-mode="aria">Aria下载</div><div style="color:${color}" class="g-button-menu pl-button-mode" data-mode="rpc">RPC下载</div><div style="color:${color}" class="g-button-menu pl-button-mode" data-mode="curl">cURL下载</div><div style="color:${color}" class="g-button-menu pl-button-mode" data-mode="bc">BC下载</div><li class="g-button-menu pl-button-mode listener-open-setting">提速设置</li>微信ahonker999</div></div>`);
            if (pt === 'home') $toolWrap = $(pan.btn.home);
            if (pt === 'main') {
                $toolWrap = $(pan.btn.main);
                $button = $(`<div class="pl-button" style="position: relative; display: inline-block; margin-right: 8px;"><button class="u-button u-button--primary u-button--small is-round is-has-icon" style="background: ${color};border-color: ${color};font-size: 14px; padding: 8px 16px; border: none;"><i class="u-icon u-icon-download"></i><span>下载提速</span></button><ul class="dropdown-list nd-common-float-menu pl-dropdown-menu"><li class="sub cursor-p pl-button-mode" data-mode="api">API下载</li><li class="sub cursor-p pl-button-mode" data-mode="aria">Aria下载</li><li class="sub cursor-p pl-button-mode" data-mode="rpc">RPC下载</li><li class="sub cursor-p pl-button-mode" data-mode="curl">cURL下载</li><li class="sub cursor-p pl-button-mode" data-mode="bc" >BC下载</li><li class="sub cursor-p pl-button-mode listener-open-setting">提速设置</li>微信ahonker999</ul></div>`);
            }
            if (pt === 'share') $toolWrap = $(pan.btn.share);
            $toolWrap.prepend($button);
            this.setBDUSS();
            this.addPageListener();
        },

        addInitButton() {
            if (!pt) return;
            let $toolWrap;
            let $button = $(`<div class="g-dropdown-button pointer pl-button-init" style="opacity:.5"><div style="color:#fff;background: ${color};border-color:${color}" class="g-button g-button-blue"><span class="g-button-right"><em class="icon icon-download"></em><span class="text" style="width: 60px;">下载提速</span></span></div></div>`);
            if (pt === 'home') $toolWrap = $(pan.btn.home);
            if (pt === 'main') {
                $toolWrap = $(pan.btn.main);
                $button = $(`<div class="pl-button-init" style="opacity:.5; display: inline-block; margin-right: 8px;"><button class="u-button u-button--primary u-button--small is-round is-has-icon" style="background: ${color};border-color: ${color};font-size: 14px; padding: 8px 16px; border: none;"><i class="u-icon u-icon-download"></i><span>下载提速</span></button></div>`);
            }
            if (pt === 'share') $toolWrap = $(pan.btn.share);
            $toolWrap.prepend($button);
            $button.click(() => base.initDialog());
        },

        async getToken() {
            const openTab = () => {
                GM_openInTab(pan.pcs[3], {active: false, insert: true, setParent: true});
                base.deleteValue('baidu_access_token');
            };

            const waitForToken = () => new Promise((resolve) => {
                    let attempts = 0;
                const interval = setInterval(() => {
                    const token = base.getValue('baidu_access_token');
                    if (token) {
                        clearInterval(interval);
                        resolve(token);
                        }
                        attempts++;
                    if (attempts > 60) {
                        clearInterval(interval);
                            resolve('');
                        }
                    }, 1000);
                });

            if (manageHandler === 'Tampermonkey' && base.getMajorVersion(manageVersion) >= 5) {
                openTab();
                return waitForToken();
            }
            let res = await base.getFinalUrl(pan.pcs[3]);

            if (!res.includes('authorize') && !res.includes('access_token=')) {
                openTab();
                return waitForToken();
            }
            if (res.includes('authorize')) {
                let html = await base.get(pan.pcs[3], {}, 'text');
                let bdstoken = html.match(/name="bdstoken"\s+value="([^"]+)"/)?.[1];
                let client_id = html.match(/name="client_id"\s+value="([^"]+)"/)?.[1];
                let data = {
                    grant_permissions_arr: 'netdisk',
                    bdstoken: bdstoken,
                    client_id: client_id,
                    response_type: "token",
                    display: "page",
                    grant_permissions: "basic,netdisk"
                };
                await base.post(pan.pcs[3], base.stringify(data), {
                    'Content-Type': 'application/x-www-form-urlencoded',
                });
                let res2 = await base.getFinalUrl(pan.pcs[3]);
                let accessToken = res2.match(/access_token=([^&]+)/)?.[1];
                accessToken && base.setValue('baidu_access_token', accessToken);
                return accessToken;
            }
            let accessToken = res.match(/access_token=([^&]+)/)?.[1];
            accessToken && base.setValue('baidu_access_token', accessToken);
            return accessToken;
        },

        async getPCSLink(maxRequestTime = 1) {
            selectList = this.getSelectedList();
            let fidList = this._getFidList(), url, res;

            if (pt === 'home' || pt === 'main') {
                if (selectList.length === 0) {
                    return message.error('提示：请先勾选要下载的文件！');
                }
                if (fidList.length === 2) {
                    return message.error('提示：请打开文件夹后勾选文件！');
                }
                fidList = encodeURIComponent(fidList);
                let accessToken = base.getValue('baidu_access_token') || await this.getToken();
                url = `${pan.pcs[0]}&fsids=${fidList}&access_token=${accessToken}`;
                res = await base.get(url, {"User-Agent": pan.ua});
            }
            if (pt === 'share') {
                this.getShareData();
                if (!params.bdstoken) {
                    return message.error('提示：请先登录网盘！');
                }
                if (selectList.length === 0) {
                    return message.error('提示：请先勾选要下载的文件！');
                }
                if (fidList.length === 2) {
                    return message.error('提示：请打开文件夹后勾选文件！');
                }
                let dialog = await Swal.fire({
                    toast: true,
                    icon: 'info',
                    title: `提示：请将文件<span class="tag-danger">[保存到网盘]</span>👉前往<span class="tag-danger">[我的网盘]</span>中下载！`,
                    showConfirmButton: true,
                    confirmButtonText: '点击保存',
                    position: 'top',
                });
                if (dialog.isConfirmed) {
                    $('.tools-share-save-hb')[0].click();
                }
                return;
            }
            if (res.errno === 0) {
                let html = this.generateDom(res.list);
                this.showMainDialog(pan[mode][0], html, pan[mode][1]);
            } else if (res.errno === 112) {
                return message.error('提示：页面过期，请刷新重试！');
            } else if (res.errno === 9019) {
                maxRequestTime--;
                await this.getToken();
                if (maxRequestTime > 0) {
                    await this.getPCSLink(maxRequestTime);
                } else {
                    message.error('提示：获取下载链接失败！请刷新网页后重试！');
                }
            } else {
                base.deleteValue('baidu_access_token');
                message.error('提示：获取下载链接失败！请刷新网页后重试！');
            }
        },

        generateDom(list) {
            let content = '<div class="pl-main">';
            let alinkAllText = '';
            base.sortByName(list);
            list.forEach((v, i) => {
                if (v.isdir === 1) return;
                let filename = v.server_filename || v.filename;
                let ext = base.getExtension(filename);
                let size = base.sizeFormat(v.size);
                let dlink = v.dlink + '&access_token=' + base.getValue('baidu_access_token');
                if (mode === 'api') {
                    content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <a class="pl-item-link pl-a listener-link-api" href="${dlink}" data-filename="${filename}" data-link="${dlink}" data-index="${i}">${dlink}</a>
                                <div class="pl-item-tip" style="display: none"><span>若没有弹出IDM下载框，找到IDM <b>选项</b> -> <b>文件类型</b> -> <b>第一个框</b> 中添加后缀 <span class="pl-ext">${ext}</span>，<a href="${pan.idm}" target="_blank" class="pl-a">详见此处</a></span> <span class="pl-back listener-back">返回</span></div>
                                <div class="pl-item-progress" style="display: none">
                                    <div class="pl-progress">
                                        <div class="pl-progress-outer"></div>
                                        <div class="pl-progress-inner" style="width:5%">
                                          <div class="pl-progress-inner-text">0%</div>
                                        </div>
                                    </div>
                                    <span class="pl-progress-stop listener-stop">取消下载</span>
                                    <span class="pl-progress-tip">未发现IDM，使用自带浏览器下载</span>
                                    <span class="pl-progress-how listener-how">如何唤起IDM？</span>
                                </div></div>`;
                }
                if (mode === 'aria') {
                    let alink = this.convertLinkToAria(dlink, filename, pan.ua);
                    if (typeof (alink) === 'object') {
                        content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <a class="pl-item-link pl-a" target="_blank" href="${alink.link}" data-filename="${filename}" data-link="${alink.link}">${decodeURIComponent(alink.text)}</a> </div>`;
                    } else {
                        alinkAllText += alink + '\r\n';
                        content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <a class="pl-item-link pl-a listener-link-aria" href="${alink}" title="点击复制aria2c链接" data-filename="${filename}" data-link="${alink}">${decodeURIComponent(alink)}</a> </div>`;
                    }
                }
                if (mode === 'rpc') {
                    content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <button class="pl-item-link listener-link-rpc pl-btn-primary pl-btn-info" data-filename="${filename}" data-link="${dlink}"><em class="icon icon-device"></em><span style="margin-left: 5px;">推送到 RPC 下载器</span></button></div>`;
                }
                if (mode === 'curl') {
                    let alink = this.convertLinkToCurl(dlink, filename, pan.ua);
                    if (typeof (alink) === 'object') {
                        content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <a class="pl-item-link pl-a" target="_blank" href="${alink.link}" data-filename="${filename}" data-link="${alink.link}">${decodeURIComponent(alink.text)}</a> </div>`;
                    } else {
                        alinkAllText += alink + '\r\n';
                        content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <a class="pl-item-link pl-a listener-link-aria" href="${alink}" title="点击复制curl链接" data-filename="${filename}" data-link="${alink}">${decodeURIComponent(alink)}</a> </div>`;
                    }
                }
                if (mode === 'bc') {
                    let alink = this.convertLinkToBC(dlink, filename, pan.ua);
                    if (typeof (alink) === 'object') {
                        content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <a class="pl-item-link pl-a" target="_blank" href="${alink.link}" data-filename="${filename}" data-link="${alink.link}">${decodeURIComponent(alink.text)}</a> </div>`;
                    } else {
                        content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <a class="pl-item-link pl-a" href="${decodeURIComponent(alink)}" title="点击用比特彗星下载" data-filename="${filename}" data-link="${alink}">${decodeURIComponent(alink)}</a> </div>`;
                    }

                }
            });
            content += '</div>';
            if (mode === 'aria')
                content += `<div class="pl-extra"><button class="pl-btn-primary listener-copy-all" data-link="${alinkAllText}">复制全部链接</button></div>`;
            if (mode === 'rpc') {
                let rpc = base.getValue('setting_rpc_domain') + ':' + base.getValue('setting_rpc_port') + base.getValue('setting_rpc_path');
                content += `<div class="pl-extra"><button class="pl-btn-primary listener-send-rpc">发送全部链接</button><button title="${rpc}" class="pl-btn-primary pl-btn-warning listener-open-setting" style="margin-left: 10px">设置 RPC 参数（当前为：${rpc}）</button><button class="pl-btn-primary pl-btn-success listener-rpc-task" style="margin-left: 10px;display: none">查看下载任务</button></div>`;
            }
            if (mode === 'curl')
                content += `<div class="pl-extra"><button class="pl-btn-primary listener-copy-all" data-link="${alinkAllText}">复制全部链接</button><button class="pl-btn-primary pl-btn-warning listener-open-setting" style="margin-left: 10px;">设置终端类型（当前为：${terminalType[base.getValue('setting_terminal_type')]}）</button></div>`;
            return content;
        },

        async sendLinkToRPC(filename, link) {
            let rpc = {
                domain: base.getValue('setting_rpc_domain'),
                port: base.getValue('setting_rpc_port'),
                path: base.getValue('setting_rpc_path'),
                token: base.getValue('setting_rpc_token'),
                dir: base.getValue('setting_rpc_dir'),
            };
            let BDUSS = this.getBDUSS();
            if (!BDUSS) return 'assistant';

            let url = `${rpc.domain}:${rpc.port}${rpc.path}`;
            let rpcData = {
                id: new Date().getTime(),
                jsonrpc: '2.0',
                method: 'aria2.addUri',
                params: [`token:${rpc.token}`, [link], {
                    dir: rpc.dir,
                    out: filename,
                    header: [`User-Agent: ${pan.ua}`, `Cookie: BDUSS=${BDUSS}`]
                }]
            };
            try {
                let res = await base.post(url, rpcData, {"User-Agent": pan.ua}, '');
                if (res.result) return 'success';
                return 'fail';
            } catch (e) {
                return 'fail';
            }
        },

        getSelectedList() {
            try {
                return require('system-core:context/context.js').instanceForSystem.list.getSelected();
            } catch (e) {
                return document.querySelector('.wp-s-core-pan').__vue__.selectedList;
            }
        },

        getLogid() {
            let ut = require("system-core:context/context.js").instanceForSystem.tools.baseService;
            return ut.base64Encode(base.getCookie("BAIDUID"));
        },

        getShareData() {
            let res = locals.dump();
            params.shareType = 'secret';
            params.sign = '';
            params.timestamp = '';
            params.bdstoken = res.bdstoken.value;
            params.channel = 'chunlei';
            params.clienttype = 0;
            params.web = 1;
            params.app_id = 250528;
            params.encrypt = 0;
            params.product = 'share';
            params.logid = this.getLogid();
            params.primaryid = res.shareid.value;
            params.uk = res.share_uk.value;
            params.shareType === 'secret' && (params.extra = this._getExtra());
            params.surl = this._getSurl();
        },

        detectPage() {
            let path = location.pathname;
            if (/^\/disk\/home/.test(path)) return 'home';
            if (/^\/disk\/main/.test(path)) return 'main';
            if (/^\/(s|share)\//.test(path)) return 'share';
            return '';
            return '';
        },

        showMainDialog(title, html, footer) {
            Swal.fire({
                title,
                html,
                footer,
                allowOutsideClick: false,
                showCloseButton: true,
                showConfirmButton: false,
                position: 'top',
                width,
                padding: '15px 20px 5px',
                customClass,
            }).then(() => {
                this._resetData();
            });
        },

        async initPanLinker() {
            base.initDefaultConfig();
            base.addPanLinkerStyle();
            pt = this.detectPage();
            let res = await base.post
            (`https://api.youxiaohou.com/config/v2?ver=${version}&a=${author}`, {}, {}, 'text');
            pan = JSON.parse(base.d(res));
            Object.freeze && Object.freeze(pan);
            pan.num === base.getValue('setting_init_code') ||
            pan.license === base.getValue('license') ? this.addButton() : this.addInitButton();
            base.createTip();
            base.registerMenuCommand();
        },

        async initAuthorize() {
            let ins = setInterval(() => {
                if (/openapi.baidu.com\/oauth\/2.0\/authorize/.test(location.href)) {
                    let confirmButton = document.querySelector('#auth-allow');
                    if (confirmButton) {
                        confirmButton.click();
                        return;
                    }
                }
                if (/openapi.baidu.com\/oauth\/2.0\/login_success/.test(location.href)) {
                    if (location.href.includes('access_token')) {
                        let token = location.href.match(/access_token=(.*?)&/)[1];
                        base.setValue('baidu_access_token', token);
                        window.close()
                    }
                }
            }, 200)
        }
    };

    let ali = {

        convertLinkToAria(link, filename, ua) {
            filename = base.fixFilename(filename);
            return encodeURIComponent(`aria2c "${link}" --out "${filename}" --header "Referer: https://www.aliyundrive.com/"`);
        },

        convertLinkToBC(link, filename, ua) {
            let bc = `AA/${encodeURIComponent(filename)}/?url=${encodeURIComponent(link)}&refer=${encodeURIComponent('https://www.aliyundrive.com/')}ZZ`;
            return encodeURIComponent(`bc://http/${base.e(bc)}`);
        },

        convertLinkToCurl(link, filename, ua) {
            let terminal = base.getValue('setting_terminal_type');
            filename = base.fixFilename(filename);
            return encodeURIComponent(`${terminal !== 'wp' ? 'curl' : 'curl.exe'} -L -C - "${link}" -o "${filename}" -e "https://www.aliyundrive.com/"`);
        },

        addPageListener() {
            doc.on('click', '.pl-button-mode', (e) => {
                mode = e.target.dataset.mode;
                Swal.showLoading();
                this.getPCSLink();
            });
            doc.on('click', '.listener-link-api', async (e) => {
                e.preventDefault();
                let dataset = e.currentTarget.dataset;
                let href = dataset.link;
                // let url = await this.getRealLink(dataset.did, dataset.fid);
                // if (url) href = url;
                $('#downloadIframe').attr('src', href);
                // let d = document.createElement("a");
                // d.download = e.currentTarget.dataset.filename;
                // d.rel = "noopener";
                // d.href = href;
                // d.dispatchEvent(new MouseEvent("click"));
            });
            doc.on('click', '.listener-link-api-btn', async (e) => {
                base.setClipboard(e.target.dataset.filename);
                $(e.target).text('复制成功').animate({opacity: '0.5'}, "slow");
            });
            doc.on('click', '.listener-link-aria, .listener-copy-all', (e) => {
                e.preventDefault();
                base.setClipboard(decodeURIComponent(e.target.dataset.link));
                $(e.target).text('复制成功，快去粘贴吧！').animate({opacity: '0.5'}, "slow");
            });
            doc.on('click', '.listener-link-rpc', async (e) => {
                let target = $(e.currentTarget);
                target.find('.icon').remove();
                target.find('.pl-loading').remove();
                target.prepend(base.createLoading());
                let res = await this.sendLinkToRPC(e.currentTarget.dataset.filename, e.currentTarget.dataset.link);
                if (res === 'success') {
                    $('.listener-rpc-task').show();
                    target.removeClass('pl-btn-danger').html('发送成功，快去看看吧！').animate({opacity: '0.5'}, "slow");
                } else {
                    target.addClass('pl-btn-danger').text('发送失败，请检查您的RPC配置信息！').animate({opacity: '0.5'}, "slow");
                }
            });
            doc.on('click', '.listener-send-rpc', (e) => {
                $('.listener-link-rpc').click();
                $(e.target).text('发送完成，发送结果见上方按钮！').animate({opacity: '0.5'}, "slow");
            });
            doc.on('click', '.listener-open-setting', () => {
                base.showSetting();
            });
            doc.on('click', '.listener-rpc-task', () => {
                let rpc = JSON.stringify({
                    domain: base.getValue('setting_rpc_domain'),
                    port: base.getValue('setting_rpc_port'),
                }), url = `${pan.d}/?rpc=${base.e(rpc)}#${base.getValue('setting_rpc_token')}`;
                GM_openInTab(url, {active: true});
            });
        },

        async getRealLink(d, f) {
            let authorization = `${base.getStorage('token').token_type} ${base.getStorage('token').access_token}`;
            let res = await base.post(pan.pcs[1], {
                drive_id: d,
                file_id: f
            }, {
                authorization,
                "content-type": "application/json;charset=utf-8",
                "referer": "https://www.aliyundrive.com/",
                "x-canary": "client=windows,app=adrive,version=v6.0.0"
            });
            if (res.code === 'AccessTokenInvalid') {
                return message.error('提示：Token过期，请刷新网页后重试！');
            }
            if (res.url) {
                return res.url;
            }
            return '';
        },

        addButton() {
            if (!pt) return;
            let $toolWrap;
            let $button = $(`<div class="ali-button pl-button"><svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="16" height="16"><path d="M853.333 938.667H170.667a85.333 85.333 0 0 1-85.334-85.334v-384A85.333 85.333 0 0 1 170.667 384H288a32 32 0 0 1 0 64H170.667a21.333 21.333 0 0 0-21.334 21.333v384a21.333 21.333 0 0 0 21.334 21.334h682.666a21.333 21.333 0 0 0 21.334-21.334v-384A21.333 21.333 0 0 0 853.333 448H736a32 32 0 0 1 0-64h117.333a85.333 85.333 0 0 1 85.334 85.333v384a85.333 85.333 0 0 1-85.334 85.334z" fill="#fff"/><path d="M715.03 543.552a32.81 32.81 0 0 0-46.251 0L554.005 657.813v-540.48a32 32 0 0 0-64 0v539.734L375.893 543.488a32.79 32.79 0 0 0-46.229 0 32.427 32.427 0 0 0 0 46.037l169.557 168.811a32.81 32.81 0 0 0 46.251 0l169.557-168.81a32.47 32.47 0 0 0 0-45.974z" fill="#FF9C00"/></svg><span>下载提速</span><ul class="pl-dropdown-menu"><li class="pl-dropdown-menu-item pl-button-mode" data-mode="api">API下载</li><li class="pl-dropdown-menu-item pl-button-mode" data-mode="aria" >Aria下载</li><li class="pl-dropdown-menu-item pl-button-mode" data-mode="rpc">RPC下载</li><li class="pl-dropdown-menu-item pl-button-mode" data-mode="curl">cURL下载</li><li class="pl-dropdown-menu-item pl-button-mode" data-mode="bc" >BC下载</li><li class="pl-dropdown-menu-item pl-button-mode listener-open-setting">提速设置</li>微信ahonker999</ul></div>`);
            if (pt === 'home') {
                base.listenElement(pan.btn.home, () => {
                    $toolWrap = $(pan.btn.home);
                    $('.pl-button').length === 0 && $toolWrap.append($button);
                })
            }
            if (pt === 'share') {
                $button.css({'margin-right': '10px'});
                base.listenElement(pan.btn.share, () => {
                    $toolWrap = $(pan.btn.share);
                    $('.pl-button').length === 0 && $toolWrap.prepend($button);
                })
            }
            base.createDownloadIframe();
            this.addPageListener();
        },

        addInitButton() {
            if (!pt) return;
            let $toolWrap;
            let $button = $(`<div class="ali-button pl-button-init"><svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="16" height="16"><path d="M853.333 938.667H170.667a85.333 85.333 0 0 1-85.334-85.334v-384A85.333 85.333 0 0 1 170.667 384H288a32 32 0 0 1 0 64H170.667a21.333 21.333 0 0 0-21.334 21.333v384a21.333 21.333 0 0 0 21.334 21.334h682.666a21.333 21.333 0 0 0 21.334-21.334v-384A21.333 21.333 0 0 0 853.333 448H736a32 32 0 0 1 0-64h117.333a85.333 85.333 0 0 1 85.334 85.333v384a85.333 85.333 0 0 1-85.334 85.334z" fill="#fff"/><path d="M715.03 543.552a32.81 32.81 0 0 0-46.251 0L554.005 657.813v-540.48a32 32 0 0 0-64 0v539.734L375.893 543.488a32.79 32.79 0 0 0-46.229 0 32.427 32.427 0 0 0 0 46.037l169.557 168.811a32.81 32.81 0 0 0 46.251 0l169.557-168.81a32.47 32.47 0 0 0 0-45.974z" fill="#FF9C00"/></svg><span>下载提速</span></div>`);
            if (pt === 'home') {
                base.listenElement(pan.btn.home, () => {
                    $toolWrap = $(pan.btn.home);
                    $('.pl-button-init').length === 0 && $toolWrap.append($button);
                })
            }
            if (pt === 'share') {
                $button.css({'margin-right': '10px'});
                base.listenElement(pan.btn.share, () => {
                    $toolWrap = $(pan.btn.share);
                    $('.pl-butto-init').length === 0 && $toolWrap.prepend($button);
                })
            }
            $button.click(() => base.initDialog());
        },

        async getPCSLink() {
            let reactDomGrid = document.querySelector(pan.dom.grid);
            if (reactDomGrid) {
                let res = await Swal.fire({
                    title: '提示',
                    html: '<div style="display: flex;align-items: center;justify-content: center;">请先切换到 <b>列表视图</b>（<svg class="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="16" height="16"><path d="M132 928c-32.8 0-59.2-26.4-59.2-59.2s26.4-59.2 59.2-59.2h760c32.8 0 59.2 26.4 59.2 59.2S924.8 928 892 928H132zm0-356.8c-32.8 0-59.2-26.4-59.2-59.2s26.4-59.2 59.2-59.2h760c32.8 0 59.2 26.4 59.2 59.2s-26.4 59.2-59.2 59.2H132zm0-356c-32.8 0-59.2-26.4-59.2-59.2S99.2 96.8 132 96.8h760c32.8 0 59.2 26.4 59.2 59.2s-26.4 59.2-59.2 59.2H132z"/></svg>）后获取！</div>',
                    confirmButtonText: '点击切换'
                });
                if (res) {
                    document.querySelector(pan.dom.switch).click();
                    return message.success('切换成功，请重新获取下载链接！');
                }
                return false;
            }
            selectList = this.getSelectedList();
            if (selectList.length === 0) {
                return message.error('提示：请先勾选要下载的文件！');
            }
            if (this.isOnlyFolder()) {
                return message.error('提示：请打开文件夹后勾选文件！');
            }
            if (pt === 'share') {
                if (selectList.length > 20) {
                    return message.error('提示：单次最多可勾选 20 个文件！');
                }
                try {
                    let authorization = `${base.getStorage('token').token_type} ${base.getStorage('token').access_token}`;
                    let xShareToken = base.getStorage('shareToken').share_token;

                    for (let i = 0; i < selectList.length; i++) {
                        let res = await base.post(pan.pcs[0], {
                            expire_sec: 600,
                            file_id: selectList[i].fileId,
                            share_id: selectList[i].shareId
                        }, {
                            authorization,
                            "content-type": "application/json;charset=utf-8",
                            "x-share-token": xShareToken
                        });
                        if (res.download_url) {
                            selectList[i].downloadUrl = res.download_url;
                        }
                    }
                } catch (e) {
                    return message.error('提示：请先登录网盘！');
                }
            } else {
                if (selectList.length > 20) {
                    return message.error('提示：单次最多可勾选 20 个文件！');
                }
                let noUrlSelectList = selectList.filter(v => !Boolean(v.url))
                let queue = [];
                noUrlSelectList.forEach((item, index) => {
                    queue.push(this.getRealLink(item.driveId, item.fileId));
                });

                const res = await Promise.all(queue);
                res.forEach((val, index) => {
                    noUrlSelectList[index].url = val;
                });

            }
            let html = this.generateDom(selectList);
            this.showMainDialog(pan[mode][0], html, pan[mode][1]);
        },

        generateDom(list) {
            let content = '<div class="pl-main">';
            let alinkAllText = '';
            list.forEach((v, i) => {
                if (v.type === 'folder') return;
                let filename = v.name;
                let fid = v.fileId;
                let did = v.driveId;
                let size = base.sizeFormat(v.size);
                let dlink = v.downloadUrl || v.url;
                if (mode === 'api') {
                    content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <a class="pl-item-link listener-link-api" data-did="${did}" data-fid="${fid}" data-filename="${filename}" data-link="${dlink}" data-index="${i}">${dlink}</a>
                                <div class="pl-item-btn listener-link-api-btn" data-filename="${filename}">复制文件名</div>
                                </div>`;
                }
                if (mode === 'aria') {
                    let alink = this.convertLinkToAria(dlink, filename, navigator.userAgent);
                    alinkAllText += alink + '\r\n';
                    content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <a class="pl-item-link listener-link-aria" href="${alink}" title="点击复制aria2c链接" data-filename="${filename}" data-link="${alink}">${decodeURIComponent(alink)}</a> </div>`;
                }
                if (mode === 'rpc') {
                    content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <button class="pl-item-link listener-link-rpc pl-btn-primary pl-btn-info" data-filename="${filename}" data-link="${dlink}"><em class="icon icon-device"></em><span style="margin-left: 5px;">推送到 RPC 下载器</span></button></div>`;
                }
                if (mode === 'curl') {
                    let alink = this.convertLinkToCurl(dlink, filename, navigator.userAgent);
                    alinkAllText += alink + '\r\n';
                    content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <a class="pl-item-link listener-link-aria" href="${alink}" title="点击复制curl链接" data-filename="${filename}" data-link="${alink}">${decodeURIComponent(alink)}</a> </div>`;
                }
                if (mode === 'bc') {
                    let alink = this.convertLinkToBC(dlink, filename, navigator.userAgent);
                    content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <a class="pl-item-link" href="${decodeURIComponent(alink)}" title="点击用比特彗星下载" data-filename="${filename}" data-link="${alink}">${decodeURIComponent(alink)}</a> </div>`;
                }
            });
            content += '</div>';
            if (mode === 'aria')
                content += `<div class="pl-extra"><button class="pl-btn-primary listener-copy-all" data-link="${alinkAllText}">复制全部链接</button></div>`;
            if (mode === 'rpc') {
                let rpc = base.getValue('setting_rpc_domain') + ':' + base.getValue('setting_rpc_port') + base.getValue('setting_rpc_path');
                content += `<div class="pl-extra"><button class="pl-btn-primary listener-send-rpc">发送全部链接</button><button title="${rpc}" class="pl-btn-primary pl-btn-warning listener-open-setting" style="margin-left: 10px">设置 RPC 参数（当前为：${rpc}）</button><button class="pl-btn-primary pl-btn-success listener-rpc-task" style="margin-left: 10px;display: none">查看下载任务</button></div>`;
            }
            if (mode === 'curl')
                content += `<div class="pl-extra"><button class="pl-btn-primary listener-copy-all" data-link="${alinkAllText}">复制全部链接</button><button class="pl-btn-primary pl-btn-warning listener-open-setting" style="margin-left: 10px;">设置终端类型（当前为：${terminalType[base.getValue('setting_terminal_type')]}）</button></div>`;
            return content;
        },

        async sendLinkToRPC(filename, link) {
            let rpc = {
                domain: base.getValue('setting_rpc_domain'),
                port: base.getValue('setting_rpc_port'),
                path: base.getValue('setting_rpc_path'),
                token: base.getValue('setting_rpc_token'),
                dir: base.getValue('setting_rpc_dir'),
            };

            let url = `${rpc.domain}:${rpc.port}${rpc.path}`;
            let rpcData = {
                id: new Date().getTime(),
                jsonrpc: '2.0',
                method: 'aria2.addUri',
                params: [`token:${rpc.token}`, [link], {
                    dir: rpc.dir,
                    out: filename,
                    header: [`Referer: https://www.aliyundrive.com/`]
                }]
            };
            try {
                let res = await base.post(url, rpcData, {"Referer": "https://www.aliyundrive.com/"}, '');
                if (res.result) return 'success';
                return 'fail';
            } catch (e) {
                return 'fail';
            }
        },

        getSelectedList() {
            try {
                let selectedList = [];
                let reactDom = document.querySelector(pan.dom.list);
                let reactObj = base.findReact(reactDom, 1);
                let props = reactObj.pendingProps;
                if (props) {
                    let fileList = props.dataSource || [];
                    let selectedKeys = props.selectedKeys.split(',');
                    fileList.forEach((val) => {
                        if (selectedKeys.includes(val.fileId)) {
                            selectedList.push(val);
                        }
                    });
                }
                return selectedList;
            } catch (e) {
                return [];
            }
        },

        detectPage() {
            let path = location.pathname;
            if (/^\/(drive)/.test(path)) return 'home';
            if (/^\/(s|share)\//.test(path)) return 'share';
            return '';
        },

        isOnlyFolder() {
            for (let i = 0; i < selectList.length; i++) {
                if (selectList[i].type === 'file') return false;
            }
            return true;
        },

        showMainDialog(title, html, footer) {
            Swal.fire({
                title,
                html,
                footer,
                allowOutsideClick: false,
                showCloseButton: true,
                showConfirmButton: false,
                position: 'top',
                width,
                padding: '15px 20px 5px',
                customClass,
            });
        },

        async initPanLinker() {
            base.initDefaultConfig();
            base.addPanLinkerStyle();
            pt = this.detectPage();
            let res = await base.post
            (`https://api.youxiaohou.com/config/v2/ali?ver=${version}&a=${author}`, {}, {}, 'text');
            pan = JSON.parse(base.d(res));
            Object.freeze && Object.freeze(pan);
            pan.num === base.getValue('setting_init_code') ||
            pan.license === base.getValue('license') ? this.addButton() : this.addInitButton();
            base.createTip();
            base.registerMenuCommand();
        }
    };

    let tianyi = {

        convertLinkToAria(link, filename, ua) {
            filename = base.fixFilename(filename);
            return encodeURIComponent(`aria2c "${link}" --out "${filename}"`);
        },

        convertLinkToBC(link, filename, ua) {
            let bc = `AA/${encodeURIComponent(filename)}/?url=${encodeURIComponent(link)}ZZ`;
            return encodeURIComponent(`bc://http/${base.e(bc)}`);
        },

        convertLinkToCurl(link, filename, ua) {
            let terminal = base.getValue('setting_terminal_type');
            filename = base.fixFilename(filename);
            return encodeURIComponent(`${terminal !== 'wp' ? 'curl' : 'curl.exe'} -L -C - "${link}" -o "${filename}"`);
        },

        addPageListener() {
            doc.on('click', '.pl-button-mode', (e) => {
                mode = e.target.dataset.mode;
                Swal.showLoading();
                this.getPCSLink();
            });
            doc.on('click', '.listener-link-api', async (e) => {
                e.preventDefault();
                $('#downloadIframe').attr('src', e.currentTarget.dataset.link);
            });
            doc.on('click', '.listener-link-aria, .listener-copy-all', (e) => {
                e.preventDefault();
                base.setClipboard(decodeURIComponent(e.target.dataset.link));
                $(e.target).text('复制成功，快去粘贴吧！').animate({opacity: '0.5'}, "slow");
            });
            doc.on('click', '.listener-link-rpc', async (e) => {
                let target = $(e.currentTarget);
                target.find('.icon').remove();
                target.find('.pl-loading').remove();
                target.prepend(base.createLoading());
                let res = await this.sendLinkToRPC(e.currentTarget.dataset.filename, e.currentTarget.dataset.link);
                if (res === 'success') {
                    $('.listener-rpc-task').show();
                    target.removeClass('pl-btn-danger').html('发送成功，快去看看吧！').animate({opacity: '0.5'}, "slow");
                } else {
                    target.addClass('pl-btn-danger').text('发送失败，请检查您的RPC配置信息！').animate({opacity: '0.5'}, "slow");
                }
            });
            doc.on('click', '.listener-send-rpc', (e) => {
                $('.listener-link-rpc').click();
                $(e.target).text('发送完成，发送结果见上方按钮！').animate({opacity: '0.5'}, "slow");
            });
            doc.on('click', '.listener-open-setting', () => {
                base.showSetting();
            });
            doc.on('click', '.listener-rpc-task', () => {
                let rpc = JSON.stringify({
                    domain: base.getValue('setting_rpc_domain'),
                    port: base.getValue('setting_rpc_port'),
                }), url = `${pan.d}/?rpc=${base.e(rpc)}#${base.getValue('setting_rpc_token')}`;
                GM_openInTab(url, {active: true});
            });
        },

        addButton() {
            if (!pt) return;
            let $toolWrap;
            let $button = $(`<div class="tianyi-button pl-button">下载提速<ul class="pl-dropdown-menu" style="top: 26px;"><li class="pl-dropdown-menu-item pl-button-mode" data-mode="api">API下载</li><li class="pl-dropdown-menu-item pl-button-mode" data-mode="aria" >Aria下载</li><li class="pl-dropdown-menu-item pl-button-mode" data-mode="rpc">RPC下载</li><li class="pl-dropdown-menu-item pl-button-mode" data-mode="curl">cURL下载</li><li class="pl-dropdown-menu-item pl-button-mode" data-mode="bc" >BC下载</li><li class="pl-dropdown-menu-item pl-button-mode listener-open-setting">提速设置</li>微信ahonker999</ul></div>`);
            if (pt === 'home') {
                base.listenElement(pan.btn.home, () => {
                    $toolWrap = $(pan.btn.home);
                    $('.pl-button').length === 0 && $toolWrap.prepend($button);
                })
            }
            if (pt === 'share') {
                base.listenElement(pan.btn.share, () => {
                    $toolWrap = $(pan.btn.share);
                    $('.pl-button').length === 0 && $toolWrap.prepend($button);
                })
            }
            base.createDownloadIframe();
            this.addPageListener();
        },

        addInitButton() {
            if (!pt) return;
            let $toolWrap;
            let $button = $(`<div class="tianyi-button pl-button-init">下载提速</div>`);
            if (pt === 'home') {
                base.listenElement(pan.btn.home, () => {
                    $toolWrap = $(pan.btn.home);
                    $('.pl-button-init').length === 0 && $toolWrap.prepend($button);
                })
            }
            if (pt === 'share') {
                $button.css({'margin-right': '10px'});
                base.listenElement(pan.btn.share, () => {
                    $toolWrap = $(pan.btn.share);
                    $('.pl-button-init').length === 0 && $toolWrap.prepend($button);
                })
            }
            $button.click(() => base.initDialog());
        },

        async getToken() {
            let res = await base.getFinalUrl(pan.pcs[1], {});
            let accessToken = res.match(/accessToken=(\w+)/)?.[1];
            accessToken && base.setStorage('accessToken', accessToken);
            return accessToken;
        },

        async getFileUrlByOnce(item, index, token) {
            try {
                if (item.downloadUrl) return {
                    index,
                    downloadUrl: item.downloadUrl
                };
                let time = Date.now(),
                    fileId = item.fileId,
                    o = "AccessToken=" + token + "&Timestamp=" + time + "&fileId=" + fileId,
                    url = pan.pcs[2] + '?fileId=' + fileId;
                if (item.shareId) {
                    o = "AccessToken=" + token + "&Timestamp=" + time + "&dt=1&fileId=" + fileId + "&shareId=" + item.shareId;
                    url += '&dt=1&shareId=' + item.shareId;
                }
                let sign = md5(o).toString();
                let res = await base.get(url, {
                    "accept": "application/json;charset=UTF-8",
                    "sign-type": 1,
                    "accesstoken": token,
                    "timestamp": time,
                    "signature": sign
                });
                if (res.res_code === 0) {
                    return {
                        index,
                        downloadUrl: res.fileDownloadUrl
                    };
                } else if (res.errorCode === 'InvalidSessionKey') {
                    return {
                        index,
                        downloadUrl: '提示：请先登录网盘！'
                    };
                } else if (res.res_code === 'ShareNotFoundFlatDir') {
                    return {
                        index,
                        downloadUrl: '提示：请先[转存]文件，👉前往[我的网盘]中下载！'
                    };
                } else {
                    return {
                        index,
                        downloadUrl: '获取下载地址失败，请刷新重试！'
                    };
                }
            } catch (e) {
                return {
                    index,
                    downloadUrl: '获取下载地址失败，请刷新重试！'
                };
            }
        },

        async getPCSLink() {
            selectList = this.getSelectedList();
            if (selectList.length === 0) {
                return message.error('提示：请先勾选要下载的文件！');
            }
            if (this.isOnlyFolder()) {
                return message.error('提示：请打开文件夹后勾选文件！');
            }
            let token = base.getStorage('accessToken') || await this.getToken();
            if (!token) {
                return message.error('提示：请先登录网盘！');
            }
            let queue = [];
            selectList.forEach((item, index) => {
                queue.push(this.getFileUrlByOnce(item, index, token));
            });

            const res = await Promise.all(queue);
            res.forEach(val => {
                selectList[val.index].downloadUrl = val.downloadUrl;
            });

            let html = this.generateDom(selectList);
            this.showMainDialog(pan[mode][0], html, pan[mode][1]);
        },

        generateDom(list) {
            let content = '<div class="pl-main">';
            let alinkAllText = '';
            list.forEach((v, i) => {
                if (v.isFolder) return;
                let filename = v.fileName;
                let size = base.sizeFormat(v.size);
                let dlink = v.downloadUrl;
                if (mode === 'api') {
                    content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <a class="pl-item-link listener-link-api" data-filename="${filename}" data-link="${dlink}" data-index="${i}">${dlink}</a>
                                </div>`;
                }
                if (mode === 'aria') {
                    let alink = this.convertLinkToAria(dlink, filename, navigator.userAgent);
                    alinkAllText += alink + '\r\n';
                    content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <a class="pl-item-link listener-link-aria" href="${alink}" title="点击复制aria2c链接" data-filename="${filename}" data-link="${alink}">${decodeURIComponent(alink)}</a> </div>`;
                }
                if (mode === 'rpc') {
                    content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <button class="pl-item-link listener-link-rpc pl-btn-primary pl-btn-info" data-filename="${filename}" data-link="${dlink}"><em class="icon icon-device"></em><span style="margin-left: 5px;">推送到 RPC 下载器</span></button></div>`;
                }
                if (mode === 'curl') {
                    let alink = this.convertLinkToCurl(dlink, filename, navigator.userAgent);
                    alinkAllText += alink + '\r\n';
                    content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <a class="pl-item-link listener-link-aria" href="${alink}" title="点击复制curl链接" data-filename="${filename}" data-link="${alink}">${decodeURIComponent(alink)}</a> </div>`;
                }
                if (mode === 'bc') {
                    let alink = this.convertLinkToBC(dlink, filename, navigator.userAgent);
                    content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <a class="pl-item-link" href="${decodeURIComponent(alink)}" title="点击用比特彗星下载" data-filename="${filename}" data-link="${alink}">${decodeURIComponent(alink)}</a> </div>`;
                }
            });
            content += '</div>';
            if (mode === 'aria')
                content += `<div class="pl-extra"><button class="pl-btn-primary listener-copy-all" data-link="${alinkAllText}">复制全部链接</button></div>`;
            if (mode === 'rpc') {
                let rpc = base.getValue('setting_rpc_domain') + ':' + base.getValue('setting_rpc_port') + base.getValue('setting_rpc_path');
                content += `<div class="pl-extra"><button class="pl-btn-primary listener-send-rpc">发送全部链接</button><button title="${rpc}" class="pl-btn-primary pl-btn-warning listener-open-setting" style="margin-left: 10px">设置 RPC 参数（当前为：${rpc}）</button><button class="pl-btn-primary pl-btn-success listener-rpc-task" style="margin-left: 10px;display: none">查看下载任务</button></div>`;
            }
            if (mode === 'curl')
                content += `<div class="pl-extra"><button class="pl-btn-primary listener-copy-all" data-link="${alinkAllText}">复制全部链接</button><button class="pl-btn-primary pl-btn-warning listener-open-setting" style="margin-left: 10px;">设置终端类型（当前为：${terminalType[base.getValue('setting_terminal_type')]}）</button></div>`;
            return content;
        },

        async sendLinkToRPC(filename, link) {
            let rpc = {
                domain: base.getValue('setting_rpc_domain'),
                port: base.getValue('setting_rpc_port'),
                path: base.getValue('setting_rpc_path'),
                token: base.getValue('setting_rpc_token'),
                dir: base.getValue('setting_rpc_dir'),
            };

            let url = `${rpc.domain}:${rpc.port}${rpc.path}`;
            let rpcData = {
                id: new Date().getTime(),
                jsonrpc: '2.0',
                method: 'aria2.addUri',
                params: [`token:${rpc.token}`, [link], {
                    dir: rpc.dir,
                    out: filename,
                    header: []
                }]
            };
            try {
                let res = await base.post(url, rpcData, {}, '');
                if (res.result) return 'success';
                return 'fail';
            } catch (e) {
                return 'fail';
            }
        },

        getSelectedList() {
            try {
                return document.querySelector(".c-file-list").__vue__.selectedList;
            } catch (e) {
                return [document.querySelector(".info-detail").__vue__.fileDetail];
            }
        },

        detectPage() {
            let path = location.pathname;
            if (/^\/web\/main/.test(path)) return 'home';
            if (/^\/web\/share/.test(path)) return 'share';
            return '';
        },

        isOnlyFolder() {
            for (let i = 0; i < selectList.length; i++) {
                if (!selectList[i].isFolder) return false;
            }
            return true;
        },

        showMainDialog(title, html, footer) {
            Swal.fire({
                title,
                html,
                footer,
                allowOutsideClick: false,
                showCloseButton: true,
                showConfirmButton: false,
                position: 'top',
                width,
                padding: '15px 20px 5px',
                customClass,
            });
        },

        async initPanLinker() {
            base.initDefaultConfig();
            base.addPanLinkerStyle();
            pt = this.detectPage();
            let res = await base.post
            (`https://api.youxiaohou.com/config/v2/tianyi?ver=${version}&a=${author}`, {}, {}, 'text');
            pan = JSON.parse(base.d(res));
            Object.freeze && Object.freeze(pan);
            pan.num === base.getValue('setting_init_code') ||
            pan.license === base.getValue('license') ? this.addButton() : this.addInitButton();
            this.getToken();
            base.createTip();
            base.registerMenuCommand();
        }
    };

    let xunlei = {

        convertLinkToAria(link, filename, ua) {
            filename = base.fixFilename(filename);
            return encodeURIComponent(`aria2c "${link}" --out "${filename}"`);
        },

        convertLinkToBC(link, filename, ua) {
            let bc = `AA/${encodeURIComponent(filename)}/?url=${encodeURIComponent(link)}ZZ`;
            return encodeURIComponent(`bc://http/${base.e(bc)}`);
        },

        convertLinkToCurl(link, filename, ua) {
            let terminal = base.getValue('setting_terminal_type');
            filename = base.fixFilename(filename);
            return encodeURIComponent(`${terminal !== 'wp' ? 'curl' : 'curl.exe'} -L -C - "${link}" -o "${filename}"`);
        },

        addPageListener() {
            doc.on('click', '.pl-button-mode', (e) => {
                mode = e.target.dataset.mode;
                Swal.showLoading();
                this.getPCSLink();
            });
            doc.on('click', '.listener-link-api', async (e) => {
                e.preventDefault();
                $('#downloadIframe').attr('src', e.currentTarget.dataset.link);
            });
            doc.on('click', '.listener-link-api-btn', async (e) => {
                base.setClipboard(e.target.dataset.filename);
                $(e.target).text('复制成功').animate({opacity: '0.5'}, "slow");
            });
            doc.on('click', '.listener-link-bc-btn', async (e) => {
                let mirror = base.getMirrorList(e.target.dataset.dlink, pan.mirror);
                base.setClipboard(mirror);
                $(e.target).text('复制成功').animate({opacity: '0.5'}, "slow");
            });
            doc.on('click', '.listener-link-aria, .listener-copy-all', (e) => {
                e.preventDefault();
                base.setClipboard(decodeURIComponent(e.target.dataset.link));
                $(e.target).text('复制成功，快去粘贴吧！').animate({opacity: '0.5'}, "slow");
            });
            doc.on('click', '.listener-link-rpc', async (e) => {
                let target = $(e.currentTarget);
                target.find('.icon').remove();
                target.find('.pl-loading').remove();
                target.prepend(base.createLoading());
                let res = await this.sendLinkToRPC(e.currentTarget.dataset.filename, e.currentTarget.dataset.link);
                if (res === 'success') {
                    $('.listener-rpc-task').show();
                    target.removeClass('pl-btn-danger').html('发送成功，快去看看吧！').animate({opacity: '0.5'}, "slow");
                } else {
                    target.addClass('pl-btn-danger').text('发送失败，请检查您的RPC配置信息！').animate({opacity: '0.5'}, "slow");
                }
            });
            doc.on('click', '.listener-send-rpc', (e) => {
                $('.listener-link-rpc').click();
                $(e.target).text('发送完成，发送结果见上方按钮！').animate({opacity: '0.5'}, "slow");
            });
            doc.on('click', '.listener-open-setting', () => {
                base.showSetting();
            });
            doc.on('click', '.listener-rpc-task', () => {
                let rpc = JSON.stringify({
                    domain: base.getValue('setting_rpc_domain'),
                    port: base.getValue('setting_rpc_port'),
                }), url = `${pan.d}/?rpc=${base.e(rpc)}#${base.getValue('setting_rpc_token')}`;
                GM_openInTab(url, {active: true});
            });
        },

        addButton() {
            if (!pt) return;
            let $toolWrap;
            let $button = $(`<div class="xunlei-button pl-button"><i class="xlpfont xlp-download"></i><span style="font-size: 13px;margin-left: 6px;">下载提速</span><ul class="pl-dropdown-menu" style="top: 34px;"><li class="pl-dropdown-menu-item pl-button-mode" data-mode="api">API下载</li><li class="pl-dropdown-menu-item pl-button-mode" data-mode="aria" >Aria下载</li><li class="pl-dropdown-menu-item pl-button-mode" data-mode="rpc">RPC下载</li><li class="pl-dropdown-menu-item pl-button-mode" data-mode="curl">cURL下载</li><li class="pl-dropdown-menu-item pl-button-mode" data-mode="bc" >BC下载</li><li class="pl-dropdown-menu-item pl-button-mode listener-open-setting">提速设置</li>微信ahonker999</ul></div>`);
            if (pt === 'home') {
                base.listenElement(pan.btn.home, () => {
                    $toolWrap = $(pan.btn.home);
                    $('.pl-button').length === 0 && $toolWrap.prepend($button);
                })
            }
            if (pt === 'share') {
                $button.css({'margin-right': '10px'});
                base.listenElement(pan.btn.share, () => {
                    $toolWrap = $(pan.btn.share);
                    $('.pl-button').length === 0 && $toolWrap.prepend($button);
                })
            }
            base.createDownloadIframe();
            this.addPageListener();
        },

        addInitButton() {
            if (!pt) return;
            let $toolWrap;
            let $button = $(`<div class="xunlei-button pl-button-init"><i class="xlpfont xlp-download"></i><span style="font-size: 13px;margin-left: 6px;">下载提速</span></div>`);
            if (pt === 'home') {
                base.listenElement(pan.btn.home, () => {
                    $toolWrap = $(pan.btn.home);
                    $('.pl-button-init').length === 0 && $toolWrap.prepend($button);
                })
            }
            if (pt === 'share') {
                $button.css({'margin-right': '10px'});
                base.listenElement(pan.btn.share, () => {
                    $toolWrap = $(pan.btn.share);
                    $('.pl-button-init').length === 0 && $toolWrap.prepend($button);
                })
            }
            $button.click(() => base.initDialog());
        },

        getToken() {
            let credentials = {}, captcha = {};
            for (let i = 0; i < localStorage.length; i++) {
                if (/^credentials_/.test(localStorage.key(i))) {
                    credentials = base.getStorage(localStorage.key(i));
                    base.setStorage('');
                }
                if (/^captcha_[\w]{16}/.test(localStorage.key(i))) {
                    captcha = base.getStorage(localStorage.key(i));
                }
            }
            let deviceid = /(\w{32})/.exec(base.getStorage('deviceid').split(','))[0];
            let token = {
                credentials,
                captcha,
                deviceid
            };
            return token;
        },

        async getFileUrlByOnce(item, index, token) {
            try {
                if (item.downloadUrl) return {
                    index,
                    downloadUrl: item.downloadUrl
                };
                let res = await base.get(pan.pcs[0] + item.id, {
                    'Authorization': `${token.credentials.token_type} ${token.credentials.access_token}`,
                    'content-type': "application/json",
                    'x-captcha-token': token.captcha.token,
                    'x-device-id': token.deviceid,
                });
                if (res.web_content_link) {
                    return {
                        index,
                        downloadUrl: res.web_content_link
                    };
                } else {
                    return {
                        index,
                        downloadUrl: '获取下载地址失败，请刷新重试！'
                    };
                }
            } catch (e) {
                return message.error('提示：请先登录网盘后刷新页面！');
            }
        },

        async getPCSLink() {
            selectList = this.getSelectedList();
            if (selectList.length === 0) {
                return message.error('提示：请先勾选要下载的文件！');
            }
            if (this.isOnlyFolder()) {
                return message.error('提示：请打开文件夹后勾选文件！');
            }
            if (pt === 'home') {
                let queue = [];
                let token = this.getToken();
                selectList.forEach((item, index) => {
                    queue.push(this.getFileUrlByOnce(item, index, token));
                });
                const res = await Promise.all(queue);
                res.forEach(val => {
                    selectList[val.index].downloadUrl = val.downloadUrl;
                });
            } else {
                let dialog = await Swal.fire({
                    toast: true,
                    icon: 'info',
                    title: `提示：请将文件<span class="tag-danger">[保存到网盘]</span>👉前往<span class="tag-danger">[我的网盘]</span>中下载！`,
                    showConfirmButton: true,
                    confirmButtonText: '点击保存',
                    position: 'top',
                });
                if (dialog.isConfirmed) {
                    document.querySelector('.saveToCloud').click();
                    return;
                }
            }
            let html = this.generateDom(selectList);
            this.showMainDialog(pan[mode][0], html, pan[mode][1]);

        },

        generateDom(list) {
            let content = '<div class="pl-main">';
            let alinkAllText = '';
            list.forEach((v, i) => {
                if (v.kind === 'drive#folder') return;
                let filename = v.name;
                let size = base.sizeFormat(+v.size);
                let dlink = v.downloadUrl;
                if (mode === 'api') {
                    content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <a class="pl-item-link listener-link-api" data-filename="${filename}" data-link="${dlink}" data-index="${i}">${dlink}</a>
                                <div class="pl-item-btn listener-link-api-btn" data-filename="${filename}">复制文件名</div>
                                </div>`;
                }
                if (mode === 'aria') {
                    let alink = this.convertLinkToAria(dlink, filename, navigator.userAgent);
                    alinkAllText += alink + '\r\n';
                    content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <a class="pl-item-link listener-link-aria" href="${alink}" title="点击复制aria2c链接" data-filename="${filename}" data-link="${alink}">${decodeURIComponent(alink)}</a> </div>`;
                }
                if (mode === 'rpc') {
                    content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <button class="pl-item-link listener-link-rpc pl-btn-primary pl-btn-info" data-filename="${filename}" data-link="${dlink}"><em class="icon icon-device"></em><span style="margin-left: 5px;">推送到 RPC 下载器</span></button></div>`;
                }
                if (mode === 'curl') {
                    let alink = this.convertLinkToCurl(dlink, filename, navigator.userAgent);
                    alinkAllText += alink + '\r\n';
                    content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <a class="pl-item-link listener-link-aria" href="${alink}" title="点击复制curl链接" data-filename="${filename}" data-link="${alink}">${decodeURIComponent(alink)}</a> </div>`;
                }
                if (mode === 'bc') {
                    let alink = this.convertLinkToBC(dlink, filename, navigator.userAgent);
                    content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <a class="pl-item-link" href="${decodeURIComponent(alink)}" title="点击用比特彗星下载" data-filename="${filename}" data-link="${alink}">${decodeURIComponent(alink)}</a> 
                                <div class="pl-item-btn listener-link-bc-btn" data-dlink="${dlink}">复制镜像地址</div>
                                </div>`;
                }
            });
            content += '</div>';
            if (mode === 'aria')
                content += `<div class="pl-extra"><button class="pl-btn-primary listener-copy-all" data-link="${alinkAllText}">复制全部链接</button></div>`;
            if (mode === 'rpc') {
                let rpc = base.getValue('setting_rpc_domain') + ':' + base.getValue('setting_rpc_port') + base.getValue('setting_rpc_path');
                content += `<div class="pl-extra"><button class="pl-btn-primary listener-send-rpc">发送全部链接</button><button title="${rpc}" class="pl-btn-primary pl-btn-warning listener-open-setting" style="margin-left: 10px">设置 RPC 参数（当前为：${rpc}）</button><button class="pl-btn-primary pl-btn-success listener-rpc-task" style="margin-left: 10px;display: none">查看下载任务</button></div>`;
            }
            if (mode === 'curl')
                content += `<div class="pl-extra"><button class="pl-btn-primary listener-copy-all" data-link="${alinkAllText}">复制全部链接</button><button class="pl-btn-primary pl-btn-warning listener-open-setting" style="margin-left: 10px;">设置终端类型（当前为：${terminalType[base.getValue('setting_terminal_type')]}）</button></div>`;
            return content;
        },

        async sendLinkToRPC(filename, link) {
            let rpc = {
                domain: base.getValue('setting_rpc_domain'),
                port: base.getValue('setting_rpc_port'),
                path: base.getValue('setting_rpc_path'),
                token: base.getValue('setting_rpc_token'),
                dir: base.getValue('setting_rpc_dir'),
            };

            let url = `${rpc.domain}:${rpc.port}${rpc.path}`;
            let rpcData = {
                id: new Date().getTime(),
                jsonrpc: '2.0',
                method: 'aria2.addUri',
                params: [`token:${rpc.token}`, [link], {
                    dir: rpc.dir,
                    out: filename,
                    header: []
                }]
            };
            try {
                let res = await base.post(url, rpcData, {}, '');
                if (res.result) return 'success';
                return 'fail';
            } catch (e) {
                return 'fail';
            }
        },

        getSelectedList() {
            try {
                let doms = document.querySelectorAll('.SourceListItem__item--XxpOC');
                let selectedList = [];
                for (let dom of doms) {
                    let domVue = dom.__vue__;
                    if (domVue.selected.includes(domVue.info.id)) {
                        selectedList.push(domVue.info);
                    }
                }
                return selectedList;
            } catch (e) {
                return [];
            }
        },

        detectPage() {
            let path = location.pathname;
            if (/^\/$/.test(path)) return 'home';
            if (/^\/(s|share)\//.test(path)) return 'share';
            return '';
        },

        isOnlyFolder() {
            for (let i = 0; i < selectList.length; i++) {
                if (selectList[i].kind === 'drive#file') return false;
            }
            return true;
        },

        showMainDialog(title, html, footer) {
            Swal.fire({
                title,
                html,
                footer,
                allowOutsideClick: false,
                showCloseButton: true,
                showConfirmButton: false,
                position: 'top',
                width,
                padding: '15px 20px 5px',
                customClass,
            });
        },

        async initPanLinker() {
            base.initDefaultConfig();
            base.addPanLinkerStyle();
            pt = this.detectPage();
            let res = await base.post
            (`https://api.youxiaohou.com/config/v2/xunlei?ver=${version}&a=${author}`, {}, {}, 'text');
            pan = JSON.parse(base.d(res));
            Object.freeze && Object.freeze(pan);
            pan.num === base.getValue('setting_init_code') ||
            pan.license === base.getValue('license') ? this.addButton() : this.addInitButton();
            base.createTip();
            base.registerMenuCommand();
        }
    };

    let quark = {

        convertLinkToAria(link, filename, ua) {
            filename = base.fixFilename(filename);
            return encodeURIComponent(`aria2c "${link}" --out "${filename}" --header "Cookie: ${document.cookie}"`);
        },

        convertLinkToBC(link, filename, ua) {
            let bc = `AA/${encodeURIComponent(filename)}/?url=${encodeURIComponent(link)}&cookie=${encodeURIComponent(document.cookie)}ZZ`;
            return encodeURIComponent(`bc://http/${base.e(bc)}`);
        },

        convertLinkToCurl(link, filename, ua) {
            let terminal = base.getValue('setting_terminal_type');
            filename = base.fixFilename(filename);
            return encodeURIComponent(`${terminal !== 'wp' ? 'curl' : 'curl.exe'} -L -C - "${link}" -o "${filename}" -b "${document.cookie}"`);
        },

        addPageListener() {
            window.addEventListener('hashchange', async (e) => {
                let home = 'https://pan.quark.cn/list#/', all = 'https://pan.quark.cn/list#/list/all';
                if (e.oldURL === home && e.newURL === all) return;
                await base.sleep(150);
                if ($('.quark-button').length > 0) return;
                pan.num === base.getValue('setting_init_code') ||
                pan.license === base.getValue('license') ? this.addButton() : this.addInitButton();
            });
            doc.on('click', '.pl-button-mode', (e) => {
                mode = e.target.dataset.mode;
                Swal.showLoading();
                this.getPCSLink();
            });
            doc.on('click', '.listener-link-api', async (e) => {
                e.preventDefault();
                $('#downloadIframe').attr('src', e.currentTarget.dataset.link);
            });
            doc.on('click', '.listener-link-aria, .listener-copy-all', (e) => {
                e.preventDefault();
                base.setClipboard(decodeURIComponent(e.target.dataset.link));
                $(e.target).text('复制成功，快去粘贴吧！').animate({opacity: '0.5'}, "slow");
            });
            doc.on('click', '.listener-link-rpc', async (e) => {
                let target = $(e.currentTarget);
                target.find('.icon').remove();
                target.find('.pl-loading').remove();
                target.prepend(base.createLoading());
                let res = await this.sendLinkToRPC(e.currentTarget.dataset.filename, e.currentTarget.dataset.link);
                if (res === 'success') {
                    $('.listener-rpc-task').show();
                    target.removeClass('pl-btn-danger').html('发送成功，快去看看吧！').animate({opacity: '0.5'}, "slow");
                } else {
                    target.addClass('pl-btn-danger').text('发送失败，请检查您的RPC配置信息！').animate({opacity: '0.5'}, "slow");
                }
            });
            doc.on('click', '.listener-send-rpc', (e) => {
                $('.listener-link-rpc').click();
                $(e.target).text('发送完成，发送结果见上方按钮！').animate({opacity: '0.5'}, "slow");
            });
            doc.on('click', '.listener-open-setting', () => {
                base.showSetting();
            });
            doc.on('click', '.listener-rpc-task', () => {
                let rpc = JSON.stringify({
                    domain: base.getValue('setting_rpc_domain'),
                    port: base.getValue('setting_rpc_port'),
                }), url = `${pan.d}/?rpc=${base.e(rpc)}#${base.getValue('setting_rpc_token')}`;
                GM_openInTab(url, {active: true});
            });
        },

        addButton() {
            if (!pt) return;
            let $toolWrap;
            let $button = $(`<div class="quark-button pl-button"><svg width="22" height="22" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd" stroke="#555" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 2-2z"/><path d="M14 8h1.553c.85 0 1.16.093 1.47.267.311.174.556.43.722.756.166.326.255.65.255 1.54v4.873c0 .892-.089 1.215-.255 1.54-.166.327-.41.583-.722.757-.31.174-.62.267-1.47.267H6.447c-.85 0-1.16-.093-1.47-.267a1.778 1.778 0 01-.722-.756c-.166-.326-.255-.65-.255-1.54v-4.873c0-.892.089-1.215.255-1.54.166-.327.41-.583.722-.757.31-.174.62-.267 1.47-.267H11"/><path stroke-linecap="round" stroke-linejoin="round" d="M11 3v10"/></g></svg><b>下载提速</b><ul class="pl-dropdown-menu"><li class="pl-dropdown-menu-item pl-button-mode" data-mode="api">API下载</li><li class="pl-dropdown-menu-item pl-button-mode" data-mode="aria" >Aria下载</li><li class="pl-dropdown-menu-item pl-button-mode" data-mode="rpc">RPC下载</li><li class="pl-dropdown-menu-item pl-button-mode" data-mode="curl">cURL下载</li><li class="pl-dropdown-menu-item pl-button-mode" data-mode="bc" >BC下载</li><li class="pl-dropdown-menu-item pl-button-mode listener-open-setting">提速设置</li>微信ahonker999</ul></div>`);
            if (pt === 'home') {
                base.listenElement(pan.btn.home, () => {
                    $toolWrap = $(pan.btn.home);
                    $('.pl-button').length === 0 && $toolWrap.prepend($button);
                });
            }
            if (pt === 'share') {
                $button.css({'margin-right': '10px'});
                base.listenElement(pan.btn.share, () => {
                    $toolWrap = $(pan.btn.share);
                    $('.pl-button').length === 0 && $toolWrap.prepend($button);
                });
            }
        },

        addInitButton() {
            if (!pt) return;
            let $toolWrap;
            let $button = $(`<div class="quark-button pl-button-init"><svg width="22" height="22" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd" stroke="#555" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 2-2z"/><path d="M14 8h1.553c.85 0 1.16.093 1.47.267.311.174.556.43.722.756.166.326.255.65.255 1.54v4.873c0 .892-.089 1.215-.255 1.54-.166.327-.41.583-.722.757-.31.174-.62.267-1.47.267H6.447c-.85 0-1.16-.093-1.47-.267a1.778 1.778 0 01-.722-.756c-.166-.326-.255-.65-.255-1.54v-4.873c0-.892.089-1.215.255-1.54.166-.327.41-.583.722-.757.31-.174.62-.267 1.47-.267H11"/><path stroke-linecap="round" stroke-linejoin="round" d="M11 3v10"/></g></svg><b>下载提速</b></div>`);
            if (pt === 'home') {
                base.listenElement(pan.btn.home, () => {
                    $toolWrap = $(pan.btn.home);
                    $('.pl-button-init').length === 0 && $toolWrap.prepend($button);
                })
            }
            if (pt === 'share') {
                $button.css({'margin-right': '10px'});
                base.listenElement(pan.btn.share, () => {
                    $toolWrap = $(pan.btn.share);
                    $('.pl-button-init').length === 0 && $toolWrap.prepend($button);
                })
            }
            $button.click(() => base.initDialog());
        },

        async getPCSLink() {
            selectList = this.getSelectedList();
            if (selectList.length === 0) {
                return message.error('提示：请先勾选要下载的文件！');
            }
            if (this.isOnlyFolder()) {
                return message.error('提示：请打开文件夹后勾选文件！');
            }
            let fids = [];
            selectList.forEach(val => {
                fids.push(val.fid);
            });
            if (pt === 'home') {
                let res = await base.post(pan.pcs[0], {
                    "fids": fids
                }, {"content-type": "application/json;charset=utf-8", "user-agent": pan.ua});
                if (res.code === 31001) {
                    return message.error('提示：请先登录网盘！');
                }
                if (res.code !== 0) {
                    return message.error('提示：获取链接失败！');
                }
                let html = this.generateDom(res.data);
                this.showMainDialog(pan[mode][0], html, pan[mode][1]);
            } else {
                let dialog = await Swal.fire({
                    toast: true,
                    icon: 'info',
                    title: `提醒：请先把文件<span class="tag-danger">[保存到网盘]</span>👉再前往<span class="tag-danger">[我的网盘]</span>下载！`,
                    showConfirmButton: true,
                    confirmButtonText: '点击保存',
                    position: 'top',
                });
                if (dialog.isConfirmed) {
                    document.querySelector('.file-info_r').click();
                    return;
                }
            }
        },

        generateDom(list) {
            let content = '<div class="pl-main">';
            let alinkAllText = '';
            list.forEach((v, i) => {
                if (v.file === false) return;
                let filename = v.file_name;
                let fid = v.fid;
                let size = base.sizeFormat(v.size);
                let dlink = v.download_url;
                if (mode === 'api') {
                    content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <a class="pl-item-link listener-link-api" data-fid="${fid}" data-filename="${filename}" data-link="${dlink}" data-index="${i}">${dlink}</a>
                                </div>`;
                }
                if (mode === 'aria') {
                    let alink = this.convertLinkToAria(dlink, filename, navigator.userAgent);
                    alinkAllText += alink + '\r\n';
                    content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <a class="pl-item-link listener-link-aria" href="${alink}" title="点击复制aria2c链接" data-filename="${filename}" data-link="${alink}">${decodeURIComponent(alink)}</a> </div>`;
                }
                if (mode === 'rpc') {
                    content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <button class="pl-item-link listener-link-rpc pl-btn-primary pl-btn-info" data-filename="${filename}" data-link="${dlink}"><em class="icon icon-device"></em><span style="margin-left: 5px;">推送到 RPC 下载器</span></button></div>`;
                }
                if (mode === 'curl') {
                    let alink = this.convertLinkToCurl(dlink, filename, navigator.userAgent);
                    alinkAllText += alink + '\r\n';
                    content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <a class="pl-item-link listener-link-aria" href="${alink}" title="点击复制curl链接" data-filename="${filename}" data-link="${alink}">${decodeURIComponent(alink)}</a> </div>`;
                }
                if (mode === 'bc') {
                    let alink = this.convertLinkToBC(dlink, filename, navigator.userAgent);
                    content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <a class="pl-item-link" href="${decodeURIComponent(alink)}" title="点击用比特彗星下载" data-filename="${filename}" data-link="${alink}">${decodeURIComponent(alink)}</a> </div>`;
                }
            });
            content += '</div>';
            if (mode === 'aria')
                content += `<div class="pl-extra"><button class="pl-btn-primary listener-copy-all" data-link="${alinkAllText}">复制全部链接</button></div>`;
            if (mode === 'rpc') {
                let rpc = base.getValue('setting_rpc_domain') + ':' + base.getValue('setting_rpc_port') + base.getValue('setting_rpc_path');
                content += `<div class="pl-extra"><button class="pl-btn-primary listener-send-rpc">发送全部链接</button><button title="${rpc}" class="pl-btn-primary pl-btn-warning listener-open-setting" style="margin-left: 10px">设置 RPC 参数（当前为：${rpc}）</button><button class="pl-btn-primary pl-btn-success listener-rpc-task" style="margin-left: 10px;display: none">查看下载任务</button></div>`;
            }
            if (mode === 'curl')
                content += `<div class="pl-extra"><button class="pl-btn-primary listener-copy-all" data-link="${alinkAllText}">复制全部链接</button><button class="pl-btn-primary pl-btn-warning listener-open-setting" style="margin-left: 10px;">设置终端类型（当前为：${terminalType[base.getValue('setting_terminal_type')]}）</button></div>`;
            return content;
        },

        async sendLinkToRPC(filename, link) {
            let rpc = {
                domain: base.getValue('setting_rpc_domain'),
                port: base.getValue('setting_rpc_port'),
                path: base.getValue('setting_rpc_path'),
                token: base.getValue('setting_rpc_token'),
                dir: base.getValue('setting_rpc_dir'),
            };

            let url = `${rpc.domain}:${rpc.port}${rpc.path}`;
            let rpcData = {
                id: new Date().getTime(),
                jsonrpc: '2.0',
                method: 'aria2.addUri',
                params: [`token:${rpc.token}`, [link], {
                    dir: rpc.dir,
                    out: filename,
                    header: [`Cookie: ${document.cookie}`]
                }]
            };
            try {
                let res = await base.post(url, rpcData, {"Cookie": document.cookie}, '');
                if (res.result) return 'success';
                return 'fail';
            } catch (e) {
                return 'fail';
            }
        },

        getSelectedList() {
            try {
                let selectedList = [];
                let reactDom = document.getElementsByClassName('file-list')[0];
                let reactObj = base.findReact(reactDom);
                let props = reactObj.props;
                if (props) {
                    let fileList = props.list || [];
                    let selectedKeys = props.selectedRowKeys || [];
                    fileList.forEach((val) => {
                        if (selectedKeys.includes(val.fid)) {
                            selectedList.push(val);
                        }
                    });
                }
                return selectedList;
            } catch (e) {
                return [];
            }
        },

        detectPage() {
            let path = location.pathname;
            if (/^\/(list)/.test(path)) return 'home';
            if (/^\/(s|share)\//.test(path)) return 'share';
            return '';
        },

        isOnlyFolder() {
            for (let i = 0; i < selectList.length; i++) {
                if (selectList[i].file) return false;
            }
            return true;
        },

        showMainDialog(title, html, footer) {
            Swal.fire({
                title,
                html,
                footer,
                allowOutsideClick: false,
                showCloseButton: true,
                showConfirmButton: false,
                position: 'top',
                width,
                padding: '15px 20px 5px',
                customClass,
            });
        },

        async initPanLinker() {
            base.initDefaultConfig();
            base.addPanLinkerStyle();
            pt = this.detectPage();
            let res = await base.post
            (`https://api.youxiaohou.com/config/v2/quark?ver=${version}&a=${author}`, {}, {}, 'text');
            pan = JSON.parse(base.d(res));
            Object.freeze && Object.freeze(pan);
            pan.num === base.getValue('setting_init_code') ||
            pan.license === base.getValue('license') ? this.addButton() : this.addInitButton();
            this.addPageListener();
            base.createTip();
            base.createDownloadIframe();
            base.registerMenuCommand();
        }
    };

    let yidong = {

        convertLinkToAria(link, filename, ua) {
            filename = base.fixFilename(filename);
            return encodeURIComponent(`aria2c "${link}" --out "${filename}"`);
        },

        convertLinkToBC(link, filename, ua) {
            let bc = `AA/${encodeURIComponent(filename)}/?url=${encodeURIComponent(link)}ZZ`;
            return encodeURIComponent(`bc://http/${base.e(bc)}`);
        },

        convertLinkToCurl(link, filename, ua) {
            let terminal = base.getValue('setting_terminal_type');
            filename = base.fixFilename(filename);
            return encodeURIComponent(`${terminal !== 'wp' ? 'curl' : 'curl.exe'} -L -C - "${link}" -o "${filename}"`);
        },

        addPageListener() {
            doc.on('click', '.pl-button-mode', (e) => {
                mode = e.target.dataset.mode;
                Swal.showLoading();
                this.getPCSLink();
            });
            doc.on('click', '.listener-link-api', async (e) => {
                e.preventDefault();
                $('#downloadIframe').attr('src', e.currentTarget.dataset.link);
            });
            doc.on('click', '.listener-link-aria, .listener-copy-all', (e) => {
                e.preventDefault();
                base.setClipboard(decodeURIComponent(e.target.dataset.link));
                $(e.target).text('复制成功，快去粘贴吧！').animate({opacity: '0.5'}, "slow");
            });
            doc.on('click', '.listener-link-rpc', async (e) => {
                let target = $(e.currentTarget);
                target.find('.icon').remove();
                target.find('.pl-loading').remove();
                target.prepend(base.createLoading());
                let res = await this.sendLinkToRPC(e.currentTarget.dataset.filename, e.currentTarget.dataset.link);
                if (res === 'success') {
                    $('.listener-rpc-task').show();
                    target.removeClass('pl-btn-danger').html('发送成功，快去看看吧！').animate({opacity: '0.5'}, "slow");
                } else {
                    target.addClass('pl-btn-danger').text('发送失败，请检查您的RPC配置信息！').animate({opacity: '0.5'}, "slow");
                }
            });
            doc.on('click', '.listener-send-rpc', (e) => {
                $('.listener-link-rpc').click();
                $(e.target).text('发送完成，发送结果见上方按钮！').animate({opacity: '0.5'}, "slow");
            });
            doc.on('click', '.listener-open-setting', () => {
                base.showSetting();
            });
            doc.on('click', '.listener-rpc-task', () => {
                let rpc = JSON.stringify({
                    domain: base.getValue('setting_rpc_domain'),
                    port: base.getValue('setting_rpc_port'),
                }), url = `${pan.d}/?rpc=${base.e(rpc)}#${base.getValue('setting_rpc_token')}`;
                GM_openInTab(url, {active: true});
            });
        },

        addButton() {
            if (!pt) return;
            let $toolWrap;
            let $button = $(`<div class="yidong-button pl-button">下载提速<ul class="pl-dropdown-menu" style="top: 36px;"><li class="pl-dropdown-menu-item pl-button-mode" data-mode="api">API下载</li><li class="pl-dropdown-menu-item pl-button-mode" data-mode="aria" >Aria下载</li><li class="pl-dropdown-menu-item pl-button-mode" data-mode="rpc">RPC下载</li><li class="pl-dropdown-menu-item pl-button-mode" data-mode="curl">cURL下载</li><li class="pl-dropdown-menu-item pl-button-mode" data-mode="bc" >BC下载</li><li class="pl-dropdown-menu-item pl-button-mode listener-open-setting">提速设置</li>微信ahonker999</ul></div>`);
            if (pt === 'home') {
                base.listenElement(pan.btn.home, () => {
                    $toolWrap = $(pan.btn.home);
                    $('.pl-button').length === 0 && $toolWrap.prepend($button);
                })
            }
            if (pt === 'share') {
                $button.removeClass('yidong-button').addClass('yidong-share-button');
                base.listenElement(pan.btn.share, () => {
                    $toolWrap = $(pan.btn.share);
                    $('.pl-button').length === 0 && $toolWrap.prepend($button);
                })
            }
            base.createDownloadIframe();
            this.addPageListener();
        },

        addInitButton() {
            if (!pt) return;
            let $toolWrap;
            let $button = $(`<div class="yidong-button pl-button-init">下载提速</div>`);
            if (pt === 'home') {
                base.listenElement(pan.btn.home, () => {
                    $toolWrap = $(pan.btn.home);
                    $('.pl-button-init').length === 0 && $toolWrap.prepend($button);
                })
            }
            if (pt === 'share') {
                $button.removeClass('yidong-button').addClass('yidong-share-button');
                base.listenElement(pan.btn.share, () => {
                    $toolWrap = $(pan.btn.share);
                    $('.pl-button-init').length === 0 && $toolWrap.prepend($button);
                })
            }
            $button.click(() => base.initDialog());
        },

        getRandomString(len) {
            len = len || 16;
            let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
            let maxPos = $chars.length;
            let pwd = '';
            for (let i = 0; i < len; i++) {
                pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
            }
            return pwd;
        },

        utob(str) {
            const u = String.fromCharCode;
            return str.replace(/[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g, (t) => {
                if (t.length < 2) {
                    let e = t.charCodeAt(0);
                    return e < 128 ? t : e < 2048 ? u(192 | e >>> 6) + u(128 | 63 & e) : u(224 | e >>> 12 & 15) + u(128 | e >>> 6 & 63) + u(128 | 63 & e);
                }
                e = 65536 + 1024 * (t.charCodeAt(0) - 55296) + (t.charCodeAt(1) - 56320);
                return u(240 | e >>> 18 & 7) + u(128 | e >>> 12 & 63) + u(128 | e >>> 6 & 63) + u(128 | 63 & e);
            });
        },

        getSign(e, t, a, n) {
            let r = "",
                i = "";
            if (t) {
                let s = Object.assign({}, t);
                i = JSON.stringify(s),
                    i = i.replace(/\s*/g, ""),
                    i = encodeURIComponent(i);
                let c = i.split(""),
                    u = c.sort();
                i = u.join("");
            }
            let A = md5(base.e(this.utob(i)));
            let l = md5(a + ":" + n);
            return md5(A + l).toUpperCase();
        },

        async getFileUrlByOnce(item, index) {
            try {
                if (item.downloadUrl) return {
                    index,
                    downloadUrl: item.downloadUrl
                };
                if (this.detectPage() === 'home') {
                    let body = {
                        "contentID": item.contentID,
                        "commonAccountInfo": {"account": item.owner, "accountType": 1},
                        "operation": "0",
                        "inline": "0",
                        "extInfo": {"isReturnCdnDownloadUrl": "1"}
                    };
                    let time = new Date(+new Date() + 8 * 3600 * 1000).toJSON().substr(0, 19).replace('T', ' ');
                    let key = this.getRandomString(16);
                    let sign = this.getSign(undefined, body, time, key);

                    let res = await base.post(pan.pcs[0], body, {
                        'authorization': base.getCookie('authorization'),
                        'x-huawei-channelSrc': '10000034',
                        'x-inner-ntwk': '2',
                        'mcloud-channel': '1000101',
                        'mcloud-client': '10701',
                        'mcloud-sign': time + "," + key + "," + sign,
                        'content-type': "application/json;charset=UTF-8",
                        'caller': 'web',
                        'CMS-DEVICE': 'default',
                        'x-DeviceInfo': '||9|7.12.0|chrome|118.0.0.0||windows 10||zh-CN|||',
                        'x-SvcType': '1',
                    });
                    if (res.success) {
                        return {
                            index,
                            downloadUrl: res.data.downloadURL
                        };
                    } else {
                        return {
                            index,
                            downloadUrl: '获取下载地址失败，请刷新重试！'
                        };
                    }
                }
                if (this.detectPage() === 'share') {
                    let vueDom = document.querySelector(".main_file_list").__vue__;

                    let res = await base.post(pan.pcs[1], `linkId=${vueDom.linkID}&contentIds=${item.path}&catalogIds=`, {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    });
                    if (res.code === 0) {
                        return {
                            index,
                            downloadUrl: res.data.redrUrl
                        };
                    } else {
                        return {
                            index,
                            downloadUrl: '获取下载地址失败，请刷新重试！'
                        };
                    }
                }
            } catch (e) {
                return {
                    index,
                    downloadUrl: '获取下载地址失败，请刷新重试！'
                };
            }
        },

        async getPCSLink() {
            selectList = this.getSelectedList();
            if (selectList.length === 0) {
                return message.error('提示：请先勾选要下载的文件！');
            }
            if (this.isOnlyFolder()) {
                return message.error('提示：请打开文件夹后勾选文件！');
            }

            let queue = [];
            selectList.forEach((item, index) => {
                queue.push(this.getFileUrlByOnce(item, index));
            });

            const res = await Promise.all(queue);
            res.forEach(val => {
                selectList[val.index].downloadUrl = val.downloadUrl;
            });

            let html = this.generateDom(selectList);
            this.showMainDialog(pan[mode][0], html, pan[mode][1]);
        },

        generateDom(list) {
            let content = '<div class="pl-main">';
            let alinkAllText = '';
            list.forEach((v, i) => {
                if (v.dirEtag || v.caName) return;
                let filename = v.contentName || v.coName;
                let size = base.sizeFormat(v.contentSize || v.coSize);
                let dlink = v.downloadUrl;
                if (mode === 'api') {
                    content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <a class="pl-item-link listener-link-api" data-filename="${filename}" data-link="${dlink}" data-index="${i}">${dlink}</a>
                                </div>`;
                }
                if (mode === 'aria') {
                    let alink = this.convertLinkToAria(dlink, filename, navigator.userAgent);
                    alinkAllText += alink + '\r\n';
                    content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <a class="pl-item-link listener-link-aria" href="${alink}" title="点击复制aria2c链接" data-filename="${filename}" data-link="${alink}">${decodeURIComponent(alink)}</a> </div>`;
                }
                if (mode === 'rpc') {
                    content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <button class="pl-item-link listener-link-rpc pl-btn-primary pl-btn-info" data-filename="${filename}" data-link="${dlink}"><em class="icon icon-device"></em><span style="margin-left: 5px;">推送到 RPC 下载器</span></button></div>`;
                }
                if (mode === 'curl') {
                    let alink = this.convertLinkToCurl(dlink, filename, navigator.userAgent);
                    alinkAllText += alink + '\r\n';
                    content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <a class="pl-item-link listener-link-aria" href="${alink}" title="点击复制curl链接" data-filename="${filename}" data-link="${alink}">${decodeURIComponent(alink)}</a> </div>`;
                }
                if (mode === 'bc') {
                    let alink = this.convertLinkToBC(dlink, filename, navigator.userAgent);
                    content += `<div class="pl-item">
                                <div class="pl-item-name listener-tip" data-size="${size}">${filename}</div>
                                <a class="pl-item-link" href="${decodeURIComponent(alink)}" title="点击用比特彗星下载" data-filename="${filename}" data-link="${alink}">${decodeURIComponent(alink)}</a> </div>`;
                }
            });
            content += '</div>';
            if (mode === 'aria')
                content += `<div class="pl-extra"><button class="pl-btn-primary listener-copy-all" data-link="${alinkAllText}">复制全部链接</button></div>`;
            if (mode === 'rpc') {
                let rpc = base.getValue('setting_rpc_domain') + ':' + base.getValue('setting_rpc_port') + base.getValue('setting_rpc_path');
                content += `<div class="pl-extra"><button class="pl-btn-primary listener-send-rpc">发送全部链接</button><button title="${rpc}" class="pl-btn-primary pl-btn-warning listener-open-setting" style="margin-left: 10px">设置 RPC 参数（当前为：${rpc}）</button><button class="pl-btn-primary pl-btn-success listener-rpc-task" style="margin-left: 10px;display: none">查看下载任务</button></div>`;
            }
            if (mode === 'curl')
                content += `<div class="pl-extra"><button class="pl-btn-primary listener-copy-all" data-link="${alinkAllText}">复制全部链接</button><button class="pl-btn-primary pl-btn-warning listener-open-setting" style="margin-left: 10px;">设置终端类型（当前为：${terminalType[base.getValue('setting_terminal_type')]}）</button></div>`;
            return content;
        },

        async sendLinkToRPC(filename, link) {
            let rpc = {
                domain: base.getValue('setting_rpc_domain'),
                port: base.getValue('setting_rpc_port'),
                path: base.getValue('setting_rpc_path'),
                token: base.getValue('setting_rpc_token'),
                dir: base.getValue('setting_rpc_dir'),
            };

            let url = `${rpc.domain}:${rpc.port}${rpc.path}`;
            let rpcData = {
                id: new Date().getTime(),
                jsonrpc: '2.0',
                method: 'aria2.addUri',
                params: [`token:${rpc.token}`, [link], {
                    dir: rpc.dir,
                    out: filename,
                    header: []
                }]
            };
            try {
                let res = await base.post(url, rpcData, {}, '');
                if (res.result) return 'success';
                return 'fail';
            } catch (e) {
                return 'fail';
            }
        },

        getSelectedList() {
            try {
                return document.querySelector(".main_file_list").__vue__.selectList.map(val => val.item);
            } catch (e) {
                let vueDom = document.querySelector(".home-page").__vue__;
                let fileList = vueDom._computedWatchers.fileList.value;
                let dirList = vueDom._computedWatchers.dirList.value;
                let selectedFileIndex = vueDom.selectedFile;
                let selectedDirIndex = vueDom.selectedDir;
                let selectFileList = fileList.filter((v, i) => {
                    return selectedFileIndex.includes(i);
                });
                let selectDirList = dirList.filter((v, i) => {
                    return selectedDirIndex.includes(i);
                });
                return [...selectFileList, ...selectDirList];
            }
        },

        detectPage() {
            let path = location.pathname;
            if (/^\/w/.test(path)) return 'home';
            if (/^\/link|shareweb/.test(path)) return 'share';
            return '';
        },

        isOnlyFolder() {
            for (let i = 0; i < selectList.length; i++) {
                if (selectList[i].fileEtag || selectList[i].coName) return false;
            }
            return true;
        },

        showMainDialog(title, html, footer) {
            Swal.fire({
                title,
                html,
                footer,
                allowOutsideClick: false,
                showCloseButton: true,
                showConfirmButton: false,
                position: 'top',
                width,
                padding: '15px 20px 5px',
                customClass,
            });
        },

        async initPanLinker() {
            base.initDefaultConfig();
            base.addPanLinkerStyle();
            pt = this.detectPage();
            let res = await base.post
            (`https://api.youxiaohou.com/config/v2/yidong?ver=${version}&a=${author}`, {}, {}, 'text');
            pan = JSON.parse(base.d(res));
            Object.freeze && Object.freeze(pan);
            pan.num === base.getValue('setting_init_code') ||
            pan.license === base.getValue('license') ? this.addButton() : this.addInitButton();
            base.createTip();
            base.registerMenuCommand();
        }
    };

    let main = {
        init() {
            
            if (/pan.quark.cn/.test(location.host)) {
                quark.initPanLinker();
            }
            if (/(pan|yun).baidu.com/.test(location.host)) {
                baidu.initPanLinker();
            }
            if (/openapi.baidu.com\/oauth/.test(location.href)) {
                baidu.initAuthorize()
            }
            if (/www.(aliyundrive|alipan).com/.test(location.host)) {
                ali.initPanLinker();
            }
            if (/cloud.189.cn/.test(location.host)) {
                tianyi.initPanLinker();
            }
            if (/pan.xunlei.com/.test(location.host)) {
                xunlei.initPanLinker();
            }
            if (/(yun|caiyun).139.com/.test(location.host)) {
                yidong.initPanLinker();
            }
        }
    };

    main.init();
})();