// ==UserScript==
// @name         saltMCBBS
// @namespace    http://salt.is.lovely/
// @description  salt's MCBBS 拓展
// @author       salt
// @match        https://*.mcbbs.net/*
// @grant        none
// @icon         https://s3.ax1x.com/2021/02/06/yYstBQ.png
// @version      0.1.9Pre3
// @license      CC BY-NC-SA 4.0
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/419006/saltMCBBS.user.js
// @updateURL https://update.greasyfork.org/scripts/419006/saltMCBBS.meta.js
// ==/UserScript==
// LOGO使用U钙网（uugai.com）工具制作，有二次加工且字体为非商用字体
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
(function () {
    const myversion = '0.1.9';
    const logo = 'https://s3.ax1x.com/2021/02/06/yYstBQ.png';
    const myprefix = '[SaltMCBBS]';
    const medalLinkPrefix = 'https://www.mcbbs.net/static/image/common/';
    const noticimgurl = [
        'https://s3.ax1x.com/2020/11/28/DynR1S.png',
        'https://s3.ax1x.com/2020/11/28/DynW6g.png',
        'https://s3.ax1x.com/2020/11/28/DynfXQ.png',
        'https://s3.ax1x.com/2020/11/28/Dyn2p8.png',
        'https://s3.ax1x.com/2020/11/28/Dyn4mj.png',
        'https://s3.ax1x.com/2020/11/28/Dyn50s.png',
        'https://s3.ax1x.com/2020/11/28/Dyncff.png',
    ];
    const techprefix = 'saltMCBBS-';
    let autoRunLock = true;
    let myPriority = 0;
    let dbHandler;
    let MExtConfiectFix = [false, false];
    const antiWaterRegExp = [
        /^[\s\S]{0,2}([\.\*\s]|\/meme\/)*(\S|\/meme\/)\s*(\2([\.\*\s]|\/meme\/)*)*([\.\*\s]|\/meme\/)*[\s\S]?\s?$/,
        /^[\s\S]{0,3}(请?让?我是?来?|可以)?.{0,3}([水氵]{3}|[水氵][一二两亿]?[帖贴下]+|完成每?日?一?水?帖?贴?的?任务)[\s\S]{0,3}$/,
    ];
    const randomStringGen = [
        'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'.split(''),
        'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM0123456789'.split(''),
    ];
    const newDiv = () => {
        return document.createElement('div');
    };
    class saltMCBBSOriginClass {
        constructor() {
            var _a, _b;
            this.messagePanel = (_a = document.querySelector('#messagePanel')) !== null && _a !== void 0 ? _a : newDiv();
            this.consolePanel = (_b = document.querySelector('#consolePanel')) !== null && _b !== void 0 ? _b : newDiv();
            let mg = this.messagePanel;
            if (!mg.hasAttribute('id')) {
                mg.id = 'messagePanel';
                mg.className = 'messagePanel';
                document.body.append(mg);
            }
            let cc = this.consolePanel;
            if (!cc.hasAttribute('id')) {
                cc.id = 'consolePanel';
                cc.className = 'consolePanel';
            }
        }
        simpleAntiXSS(s) {
            return s
                .replace(/&colon;/gi, ':')
                .replace(/&NewLine;/gi, ':')
                .replace(/\<(\s*\/?\s*(?:s[cet]|tag|meta|title|input|label|body|h[^\d]|iframe|t[abrd]|link|fie|but|opt|lay|base|emb|bgs|\!))/gi, '&lt;$1')
                .replace(/autofocus|\%[23][ec]|\\(74|x3c|u0?0?3c)|\&\#x?\d+|on\S+\s*\=/gi, '咕咕咕')
                .replace(/((src|size|doc|tion|cent|href)\s*\=\s*[\'\"]?|(expression|url)\s*\(\s*)\s*((\S+script|behaviour)\s*[\:\;]|[^\>]+text\/html)[^\>]/gi, '咕咕咕>')
                .replace(/position\s*\:\s*fixed/gi, 'position:relative');
        }
        inputBox(options) {
            let panel = newDiv();
            panel.className = 'saltMCBBSinputbox';
            let ta = document.createElement('textarea');
            if (options.placeholder)
                ta.placeholder = options.placeholder;
            if (options.defaultText)
                ta.value = options.defaultText;
            let accept = newDiv();
            accept.textContent = '确定';
            accept.onclick = function () {
                let s = ta.value;
                panel.remove();
                if (options.acceptCallback)
                    options.acceptCallback(s);
            };
            let cancel = newDiv();
            cancel.textContent = '取消';
            cancel.onclick = function () {
                let s = ta.value;
                panel.remove();
                if (options.cancelCallback)
                    options.cancelCallback(s);
            };
            let btn = newDiv();
            btn.className = 'btn';
            btn.appendChild(accept);
            btn.appendChild(cancel);
            panel.appendChild(ta);
            panel.appendChild(btn);
            document.body.appendChild(panel);
        }
        formatMemePack(m) {
            var _a;
            let memelist = '';
            for (let meme of m.memes) {
                memelist += `"![${meme.name}](${meme.url})`;
                if (typeof meme.width === 'string')
                    memelist += `{${meme.width},${(_a = meme.height) !== null && _a !== void 0 ? _a : meme.width}}`;
                memelist += '",\n';
            }
            return `/* SaltMCBBS表情包导出 “${m.name}” */
{"名字":"${m.name}",${m.author ? '"作者":"' + m.author + '",' : ''}${m.version ? '"版本":"' + m.version + '",' : ''}${m.license ? '"许可证":"' + m.license + '",' : ''}${m.others ? '"其他":"' + m.others + '",' : ''}
"表情":[
${memelist.replace(/\,$/, '')}]}
/* SaltMCBBS${myversion}导出，可能无法导入旧版的SaltMCBBS */`;
        }
        resolveMemePack(s) {
            var _a;
            let getAuthor = /[\"\'](?:表情包?|(?:meme)?packe?t?)?\s*(?:author|原?作者)[\"\']\s*[\:\,\;：，；]\s*[\"\'](.*?)[\"\']/i.exec(s);
            let getVersion = /[\"\'](?:表情包?|(?:meme)?packe?t?)?\s*(?:ver(?:sion)?|版本号?)[\"\']\s*[\:\,\;：，；]\s*(?:[\"\'](.*?)[\"\']|(\d+))/i.exec(s);
            let getName = /[\"\'](?:表情包?|(?:meme)?packe?t?)?\s*(?:name|名[字称]?)[\"\']\s*[\:\,\;：，；]\s*[\"\'](.*?)[\"\']/i.exec(s);
            let getLicense = /[\"\'](?:表情包?|(?:meme)?packe?t?)?\s*(?:[授版]权(?:信息|协议)|[授版]?权?(?:许可证?书?)|licenses?)[\"\']\s*[\:\,\;：，；]\s*[\"\'](.*?)[\"\']/i.exec(s);
            let getOther = /[\"\'](?:表情包?|(?:meme)?packe?t?)?\s*(?:备注|其他|说明|(?:note|remark|other)s?)[\"\']\s*[\:\,\;：，；]\s*[\"\'](.*?)[\"\']/i.exec(s);
            let obj = {
                name: getName ? getName[1] : '未知名称',
                memes: this.formatMeme(s),
            };
            if (getAuthor)
                obj.author = getAuthor[1];
            if (getVersion)
                obj.version = (_a = getVersion[1]) !== null && _a !== void 0 ? _a : getVersion[2];
            if (getLicense)
                obj.license = getLicense[1];
            if (getOther)
                obj.others = getOther[1];
            return obj;
        }
        formatMeme(s) {
            var _a;
            let r = /(?:[\!！\s\)]|^)[\[【](.*?)[\]】]\s*[\(（](.*?)[\)）]\s*(?:[\{｛]\s*(\d+?)\s*(?:[\,，]\s*(\d+?)\s*)?[\}｝])?/gi;
            let m = [], temp, safe = 2333;
            while ((temp = r.exec(s)) && safe-- > 0) {
                let x = { name: temp[1], url: temp[2] };
                if (temp[3]) {
                    (x.width = temp[3]), (x.height = (_a = temp[4]) !== null && _a !== void 0 ? _a : temp[3]);
                }
                m.push(x);
            }
            return m;
        }
        unique(arr) {
            this.assert(Array.isArray(arr));
            let array = [];
            for (var i = 0; i < arr.length; i++) {
                if (array.indexOf(arr[i]) == -1) {
                    array.push(arr[i]);
                }
            }
            return array;
        }
        randomID(len = 16) {
            let s = this.randomChoice(randomStringGen[0]);
            for (let i = 1; i < len; i++)
                s += this.randomChoice(randomStringGen[1]);
            if (document.getElementById(s))
                return this.randomID(len);
            else
                return s;
        }
        tick(handler, second = 1) {
            this.assert(second > 0, '时间间隔不能小于0!');
            return setInterval(handler, Math.round(second * 1000));
        }
        clearTick(handlerNum) {
            clearInterval(handlerNum);
        }
        getTime() {
            return new Date().getTime();
        }
        getData(key) {
            let temp;
            switch (key) {
                case 'antiWaterRegExp':
                    return antiWaterRegExp;
                case 'noticImgUrl':
                    return noticimgurl;
                case 'medalLinkPrefix':
                    return medalLinkPrefix;
                case 'version':
                    return myversion;
                case 'prefix':
                    return myprefix;
                case 'randomStringGen':
                    return randomStringGen;
                default:
                    temp = '';
            }
            return temp;
        }
        scrollTo(targetY = 0, steps = 25) {
            if (targetY < 0) {
                targetY = 0;
            }
            if (targetY > document.body.offsetHeight - 200) {
                targetY = document.body.offsetHeight - 200;
            }
            var step = (targetY - document.documentElement.scrollTop) / steps;
            let safe = 0;
            let timer = setInterval(() => {
                var diff = Math.abs(targetY - document.documentElement.scrollTop);
                if (diff > Math.abs(step)) {
                    document.documentElement.scrollTop += step;
                    safe += 1;
                }
                else {
                    document.documentElement.scrollTop = targetY;
                    clearInterval(timer);
                }
                if (safe > steps + 5) {
                    document.documentElement.scrollTop = targetY;
                    clearInterval(timer);
                }
            }, 20);
        }
        docReady(callback) {
            if (document.readyState != 'loading') {
                callback();
            }
            else {
                document.addEventListener('readystatechange', () => {
                    if (document.readyState == 'interactive') {
                        callback();
                    }
                });
            }
        }
        docNearlyReady(callback) {
            return __awaiter(this, void 0, void 0, function* () {
                if (document.readyState != 'loading') {
                    callback();
                }
                else {
                    while (!document.getElementById('ft') &&
                        !document.getElementById('footer') &&
                        document.readyState == 'loading')
                        yield this.sleep(5);
                    callback();
                }
            });
        }
        saltQuery(selector, callback) {
            let elems = document.querySelectorAll(selector);
            for (let i = 0; i < elems.length; i++) {
                callback(i, elems[i]);
            }
        }
        saltObserver(id, callback, watchAttr = false, watchChildList = true) {
            if (!watchAttr && !watchChildList) {
                return null;
            }
            let targetNode = null;
            if (typeof id == 'string') {
                targetNode = document.getElementById(id);
            }
            else if (id instanceof Element) {
                targetNode = id;
            }
            if (!targetNode) {
                return null;
            }
            let x = new MutationObserver(callback);
            let json = {
                attributes: watchAttr,
                childList: watchChildList,
                subtree: true,
            };
            x.observe(targetNode, json);
            return x;
        }
        write(key, value) {
            if (value) {
                value = JSON.stringify(value);
            }
            localStorage.setItem(techprefix + key, value);
        }
        read(key) {
            let value = localStorage.getItem(techprefix + key);
            if (value && value != 'undefined' && value != 'null') {
                return JSON.parse(value);
            }
            return null;
        }
        readWithDefault(key, defaultValue) {
            let value = localStorage.getItem(techprefix + key);
            if (value && value != 'undefined' && value != 'null') {
                let temp = JSON.parse(value);
                if (typeof defaultValue == 'boolean' &&
                    typeof temp == 'string') {
                    if (temp == 'true') {
                        temp = true;
                    }
                    else {
                        temp = false;
                    }
                }
                return temp;
            }
            this.write(key, defaultValue);
            return defaultValue;
        }
        randomChoice(arr) {
            if (arr.length < 1) {
                return null;
            }
            return arr[Math.floor(Math.random() * arr.length)];
        }
        formatToStringArray(str, spliter = '\n') {
            let arr = [];
            let temparr = str.split(spliter);
            for (let x of temparr) {
                let s = this.Trim(x);
                if (s.length > 0) {
                    arr.push(s);
                }
            }
            return arr;
        }
        cleanStringArray(arr, test = /^\/\//) {
            let fin = [];
            for (let s of arr) {
                if (!test.test(s))
                    fin.push(s);
            }
            return fin;
        }
        Trim(x) {
            return x.replace(/^\s+|\s+$/gm, '');
        }
        obj2a(obj, targetDefault = '_self') {
            let as = [];
            if (['_self', '_parent', '_blank', '_top'].indexOf(targetDefault) !=
                -1) {
                targetDefault = '_self';
            }
            for (let x of obj) {
                let a = document.createElement('a');
                a.href = x.url;
                if (typeof x.img == 'string' && x.img.length > 2) {
                    a.innerHTML = `<img src="${x.img}">`;
                }
                a.innerHTML += x.text;
                if (typeof x.target == 'string' &&
                    ['_self', '_parent', '_blank', '_top'].indexOf(x.target) !=
                        -1) {
                    a.target = x.target;
                }
                else {
                    a.target = targetDefault;
                }
                if (typeof x.class == 'string' && x.class.length > 0) {
                    a.className = x.class;
                }
                if (typeof x.title == 'string' && x.title.length > 0) {
                    a.title = x.title;
                }
                as.push(a);
            }
            return as;
        }
        addChildren(parent, children) {
            let temp = document.createDocumentFragment();
            for (let i = 0; i < children.length; i++) {
                temp.appendChild(children[i]);
            }
            parent.appendChild(temp);
        }
        fetchUID(uid, callback, retry = 2, retryTime = 1500) {
            if (typeof uid == 'string') {
                uid = parseInt(uid);
            }
            if (uid < 1 || isNaN(uid)) {
                return;
            }
            let obj = this;
            fetch('https://www.mcbbs.net/api/mobile/index.php?module=profile&uid=' +
                uid)
                .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                else {
                    return Promise.reject(Object.assign({}, response.json(), {
                        status: response.status,
                        statusText: response.statusText,
                    }));
                }
            })
                .then((data) => {
                callback(data);
            })
                .catch((error) => {
                console.log(error);
                if (retry > 0) {
                    setTimeout(() => {
                        obj.fetchUID(uid, callback, retry - 1, retryTime);
                    }, retryTime);
                }
            });
        }
        fetchTID(tid, callback, page = 1, retry = 2, retryTime = 1500) {
            if (typeof tid == 'string') {
                tid = parseInt(tid);
            }
            if (tid < 1 || isNaN(tid)) {
                return;
            }
            let obj = this;
            fetch('https://www.mcbbs.net/api/mobile/index.php?version=4&module=viewthread&tid=' +
                tid +
                '&page=' +
                page)
                .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                else {
                    return Promise.reject(Object.assign({}, response.json(), {
                        status: response.status,
                        statusText: response.statusText,
                    }));
                }
            })
                .then((data) => {
                callback(data);
            })
                .catch((error) => {
                if (retry > 0) {
                    setTimeout(() => {
                        obj.fetchTID(tid, callback, page, retry - 1, retryTime);
                    }, retryTime);
                }
            });
        }
        getUID() {
            return typeof window.discuz_uid ? parseInt(window.discuz_uid) : 0;
        }
        getTID() {
            var _a, _b, _c;
            return parseInt((_a = (window.tid ? window.tid + '' : null)) !== null && _a !== void 0 ? _a : ((_c = (_b = window.location.href.match(/thread-([\d]+)/)) !== null && _b !== void 0 ? _b : window.location.href.match(/tid\=([\d]+)/)) !== null && _c !== void 0 ? _c : [
                '0',
                '0',
            ])[1]);
        }
        message(html, callback, type = 0) {
            let div = document.createElement('div');
            div.innerHTML = html;
            div.className = switchType(type);
            div.addEventListener('click', () => {
                if (callback)
                    callback(removeDiv);
            });
            let close = document.createElement('div');
            close.className = 'close-button';
            close.addEventListener('click', function (ev) {
                ev.stopPropagation();
                removeDiv();
            });
            div.appendChild(close);
            this.messagePanel.appendChild(div);
            function removeDiv() {
                div.remove();
            }
            function switchType(type) {
                switch (type) {
                    case 1:
                        return 'info';
                    case 2:
                        return 'success';
                    case 3:
                        return 'warn';
                    case 4:
                        return 'error';
                    default:
                        return 'normal';
                }
            }
        }
        assert(condition, msg = '发生错误') {
            if (!condition)
                throw new Error(myprefix + ': ' + msg);
        }
        log(msg) {
            let t = typeof msg;
            let p = myprefix + ': ';
            if (t == 'boolean' || t == 'number' || t == 'string') {
                console.log(p + msg);
            }
            else if (t == 'object') {
                console.log(p, msg);
            }
            else if (msg instanceof Array) {
                console.log(p + '[' + msg.join(', ') + ']');
            }
            else if (t == 'undefined') {
                console.log(p + 'undefined');
            }
            else {
                console.log(p);
                console.log(msg);
            }
        }
        version() {
            if (navigator.userAgent.indexOf('Firefox') == -1)
                console.log('%c ' +
                    myprefix +
                    ' %c ' +
                    myversion +
                    ' 开源地址: https://github.com/Salt-lovely/saltMCBBS ', 'background: #fbf2db url(' +
                    logo +
                    ') no-repeat center;background-size:contain;padding-left:75px;line-height:75px;color:transparent', 'color:Sienna;font-size:1rem;line-height:75px;');
            else
                console.log('%c ' +
                    myprefix +
                    ' %c ' +
                    myversion +
                    ' 开源地址: https://github.com/Salt-lovely/saltMCBBS ', 'background-color:#fbf2db;color:Sienna;font-weight:bold;', '');
        }
        sleep(time) {
            return new Promise((resolve) => setTimeout(resolve, time));
        }
    }
    class saltMCBBS extends saltMCBBSOriginClass {
        constructor(autorun = false) {
            super();
            this.settingPanel = document.createElement('div');
            this.links = document.createElement('div');
            this.moveTopBarToLeft = this.readWithDefault('SaltMoveTopBarToLeft', true);
            this.dataBaseHandler = dbHandler;
            this.rootFontSize = 12;
            if (!autorun) {
                return;
            }
            window.saltMCBBSCSS.setStyle(`body{background-attachment:fixed}body>div[style]:not([id]):not([class]){float:left}body #top{transition:0.3s ease;transition-delay:0.5s}body #top:hover{transition-delay:0s}body:hover #top{transition-delay:0s}body.hasBackgroundImage #top,body.hasBackgroundImage #footer{opacity:var(--mcmapwpOpacity, 1)}body.hasBackgroundImage:hover #top,body.hasBackgroundImage:hover #footer{opacity:var(--mcmapwpCommonOpacity, 1)}@media screen and (max-width: 1130px){body>.mc_map_wp{margin-left:0}}.pmwarn{width:auto !important}.pmwarn a{background:url(template/mcbbs/image/warning.gif) no-repeat 0px 2px !important;background-size:16px !important;padding-left:18px !important}#uhd .mn ul .pmwarn a{background-color:rgba(0,0,0,0.4);box-shadow:0 0 0 2px rgba(0,0,0,0.2)}.reported{position:relative}.reported::after{content:"已举报";top:57px;left:400px;font-size:42px;font-weight:bold;color:#c32;position:absolute;opacity:0.5;pointer-events:none}.reported.warned::after{content:"已制裁";color:#2c4}.settingPanel,.consolePanel,.emoticonPanel{width:50vw;min-width:360px;left:25vw;max-height:80vh;min-height:10vh;top:10vh;position:fixed;background-color:#fbfbfb;background-clip:padding-box;padding:0 8px 8px 8px;border:8px solid;border-radius:8px;border-color:rgba(0,0,0,0.2);box-sizing:border-box;overflow-y:auto;transition:0.3s ease, opacity 0.2s ease;z-index:999999;scrollbar-width:thin;scrollbar-color:#999 #eee}.settingPanel::-webkit-scrollbar,.consolePanel::-webkit-scrollbar,.emoticonPanel::-webkit-scrollbar{width:4px;height:4px}.settingPanel::-webkit-scrollbar-thumb,.consolePanel::-webkit-scrollbar-thumb,.emoticonPanel::-webkit-scrollbar-thumb{border-radius:2px;box-shadow:inset 0 0 4px rgba(102,102,102,0.25);background:#999}.settingPanel::-webkit-scrollbar-track,.consolePanel::-webkit-scrollbar-track,.emoticonPanel::-webkit-scrollbar-track{box-shadow:inset 0 0 4px rgba(187,187,187,0.25);border-radius:1px;background:#eee}.settingPanel.visible,.consolePanel.visible,.emoticonPanel.visible{opacity:1}.settingPanel.hidden,.consolePanel.hidden,.emoticonPanel.hidden{opacity:0;transition-timing-function:ease-in}.settingPanel>*:first-child,.consolePanel>*:first-child,.emoticonPanel>*:first-child{background-color:#fbfbfb;position:sticky;top:0;z-index:99}.settingPanel .flb,.consolePanel .flb,.emoticonPanel .flb{background-color:transparent}.settingPanel .flb .flbc,.consolePanel .flb .flbc,.emoticonPanel .flb .flbc{color:#999}.consolePanel.visible{left:25vw}.consolePanel.hidden{left:-90vw}.consolePanel>div{margin:0 0 5px 0;min-height:10vh;max-height:calc(80vh - 6 * 14px - 46px);overflow-y:auto;scrollbar-width:thin;scrollbar-color:#999 #eee}.consolePanel>div::-webkit-scrollbar{width:4px;height:4px}.consolePanel>div::-webkit-scrollbar-thumb{border-radius:2px;box-shadow:inset 0 0 4px rgba(102,102,102,0.25);background:#999}.consolePanel>div::-webkit-scrollbar-track{box-shadow:inset 0 0 4px rgba(187,187,187,0.25);border-radius:1px;background:#eee}.consolePanel>textarea{resize:vertical;font-size:14px;line-height:16.8px;height:33.6px;min-height:16.8px;max-height:336px;width:calc(100% - 8px);border:none;border-width:0;scrollbar-width:thin;scrollbar-color:#999 #eee}.consolePanel>textarea::-webkit-scrollbar{width:8px;height:8px}.consolePanel>textarea::-webkit-scrollbar-thumb{border-radius:4px;box-shadow:inset 0 0 4px rgba(102,102,102,0.25);background:#999}.consolePanel>textarea::-webkit-scrollbar-track{box-shadow:inset 0 0 4px rgba(187,187,187,0.25);border-radius:2px;background:#eee}.settingPanel.visible{top:10vh}.settingPanel.hidden{top:-90vh}.settingPanel>*{width:100%;box-sizing:border-box;margin-bottom:8px;float:left}.settingPanel .flb span>a{color:#3a74ad}.settingPanel .flb span>a:hover{color:#6cf}.settingPanel h3{font-size:12.25px}.settingPanel h3 small{font-size:10.5px;color:grey}.settingPanel h3.half-h3{width:calc(50% - 14px);padding:0 10px 0 0;float:left;text-align:right}.settingPanel textarea{resize:vertical;line-height:1.2em;height:3.6em;min-height:2.4em;max-height:24em;width:calc(100% - 8px);border:none;border-width:0;scrollbar-width:thin;scrollbar-color:#999 #eee}.settingPanel textarea::-webkit-scrollbar{width:8px;height:8px}.settingPanel textarea::-webkit-scrollbar-thumb{border-radius:4px;box-shadow:inset 0 0 4px rgba(102,102,102,0.25);background:#999}.settingPanel textarea::-webkit-scrollbar-track{box-shadow:inset 0 0 4px rgba(187,187,187,0.25);border-radius:2px;background:#eee}.settingPanel input{width:calc(50% - 4px);float:left;text-align:center}.settingPanel input[type="range"]{width:calc(100% - 8px)}.settingPanel input[type="checkbox"]{display:none}.emoticonPanel.visible{left:25vw}.emoticonPanel.hidden{left:-90vw}.emoticonPanel .memelist>div{width:calc(100% - 8px);padding:4px;border-bottom:1px solid #999}.emoticonPanel .memelist .memeitem{display:flex;outline-offset:-2px}.emoticonPanel .memelist .memeitem>*{margin-top:auto;margin-bottom:auto}.emoticonPanel .memelist .memeitem img{width:30%;margin-right:8px;max-width:100px;max-height:100px}.emoticonPanel .memelist .memeitem p{width:70%}.emoticonPanel .memelist .memeitem.selected{outline:2px solid #999}.emoticonPanel .op{width:100%;position:sticky;bottom:-8px;left:0;display:flex;background-color:#fbfbfb}.emoticonPanel .op>div{width:100%;padding:4px;border-radius:4px;text-align:center;cursor:pointer;transition:0.3s ease}.emoticonPanel .op>div:hover{color:#f0f0f0;background-color:var(--ThemeColor, #e91e63)}.emoticonPanel .flb span>a{color:#3a74ad}.emoticonPanel .flb span>a:hover{color:#6cf}.messagePanel{position:fixed;width:calc(15 * 14px + 16px);padding:8px;max-height:100vh;bottom:0;right:0;font-size:14px;color:#000000;box-sizing:content-box;z-index:1}.messagePanel>div{width:100%;min-height:16px;bottom:0;padding:8px;margin:4px 0;border-radius:4px;opacity:0.75;box-sizing:border-box;float:left;transition:0.3s ease;position:relative;z-index:99999}.messagePanel>div.normal{background-color:#efefef}.messagePanel>div.info{background-color:#b7d9ff}.messagePanel>div.warn{background-color:#fff8b7}.messagePanel>div.success{background-color:#b7ffbb}.messagePanel>div.error{background-color:#ffc2b7}.messagePanel>div:hover{opacity:1}.messagePanel>div>.close-button{width:16px;height:16px;top:0;right:0;position:absolute;transition:0.3s ease;transform-origin:50% 50%}.messagePanel>div>.close-button::after{content:"×";font-size:16px;line-height:16px;color:#000000}.messagePanel>div>.close-button:hover{transform:scale(1.2)}.messagePanel>div img{max-width:75%}.saltMCBBSinputbox{width:50vw;min-width:360px;left:25vw;max-height:80vh;min-height:80vh;top:10vh;position:fixed;background-color:#f0f0f0;background-clip:padding-box;padding:0 0 0 0;border:8px solid;border-radius:8px;border-color:rgba(0,0,0,0.2);box-sizing:border-box;overflow-y:auto;transition:0.3s ease, opacity 0.2s ease;z-index:999999;scrollbar-width:thin;scrollbar-color:#999 #eee}.saltMCBBSinputbox::-webkit-scrollbar{width:4px;height:4px}.saltMCBBSinputbox::-webkit-scrollbar-thumb{border-radius:2px;box-shadow:inset 0 0 4px rgba(102,102,102,0.25);background:#999}.saltMCBBSinputbox::-webkit-scrollbar-track{box-shadow:inset 0 0 4px rgba(187,187,187,0.25);border-radius:1px;background:#eee}.saltMCBBSinputbox.visible{opacity:1}.saltMCBBSinputbox.hidden{opacity:0;transition-timing-function:ease-in}.saltMCBBSinputbox>*:first-child{background-color:#f0f0f0;position:sticky;top:0;z-index:99}.saltMCBBSinputbox .flb{background-color:transparent}.saltMCBBSinputbox .flb .flbc{color:#999}.saltMCBBSinputbox textarea{width:100%;height:calc(80vh - 52px);padding:2px;border:none;box-sizing:border-box;scrollbar-width:thin;scrollbar-color:#999 #eee}.saltMCBBSinputbox textarea::-webkit-scrollbar{width:4px;height:4px}.saltMCBBSinputbox textarea::-webkit-scrollbar-thumb{border-radius:2px;box-shadow:inset 0 0 4px rgba(102,102,102,0.25);background:#999}.saltMCBBSinputbox textarea::-webkit-scrollbar-track{box-shadow:inset 0 0 4px rgba(187,187,187,0.25);border-radius:1px;background:#eee}.saltMCBBSinputbox .btn{width:100%;height:36px;padding:0;display:flex}.saltMCBBSinputbox .btn>div{width:100%;height:36px;line-height:36px;text-align:center;cursor:pointer;transition:0.3s ease}.saltMCBBSinputbox .btn>div:hover{color:#f0f0f0;background-color:var(--ThemeColor, #e91e63)}input[type="checkbox"]+label.checkbox{position:relative;width:48px;height:24px;margin-left:calc(25% - 24px);background:#999;float:left;border-radius:12px;cursor:pointer;transition:background 0.3s;z-index:1}input[type="checkbox"]+label.checkbox[disabled]{cursor:not-allowed;opacity:0.75}input[type="checkbox"]+label.checkbox::before,input[type="checkbox"]+label.checkbox::after{transition:0.3s ease;position:absolute}input[type="checkbox"]+label.checkbox::before{content:"关";top:2px;left:28px;color:#fff;line-height:20px}input[type="checkbox"]+label.checkbox::after{content:"";top:2px;left:2px;width:20px;height:20px;border-radius:10px;background:#fff}input[type="checkbox"]:checked+label.checkbox{background-color:var(--ThemeColor, #e91e63)}input[type="checkbox"]:checked+label.checkbox::before{content:"开";left:8px}input[type="checkbox"]:checked+label.checkbox::after{left:26px}input[type="checkbox"]:active+label.checkbox::after{width:28px;border-radius:12px}input[type="checkbox"]:checked:active+label.checkbox::after{left:18px}textarea.pt{line-height:1.25em;resize:vertical;min-height:5em;max-height:56.25em;scrollbar-width:thin;scrollbar-color:#999 #eee}textarea.pt::-webkit-scrollbar{width:8px;height:8px}textarea.pt::-webkit-scrollbar-thumb{border-radius:4px;box-shadow:inset 0 0 4px rgba(102,102,102,0.25);background:#999}textarea.pt::-webkit-scrollbar-track{box-shadow:inset 0 0 4px rgba(187,187,187,0.25);border-radius:2px;background:#eee}#ct .mn .bm .tdats .alt.h th{padding-top:0;padding-bottom:0;border-top:0;border-bottom:0}#ct .mn .bm .tdats #tba{height:46px;padding-top:8px;padding-bottom:0}#ct .mn .bm .tdats #tba li{width:100%}#ct .mn .bm .tdats .tb{margin-top:0}#ct .mn .bm .tdats .notice{color:inherit;background:none;border:none}#ct .mn .bm .tdats .notice ::after,#ct .mn .bm .tdats .notice ::before{display:none}.plhin .sign{scrollbar-width:thin;scrollbar-color:#999 #eee}.plhin .sign::-webkit-scrollbar{width:4px;height:4px}.plhin .sign::-webkit-scrollbar-thumb{border-radius:2px;box-shadow:inset 0 0 4px rgba(102,102,102,0.25);background:#999}.plhin .sign::-webkit-scrollbar-track{box-shadow:inset 0 0 4px rgba(187,187,187,0.25);border-radius:1px;background:#eee}.linksStillOnTopBar{width:100%;text-align:center}.linksStillOnTopBar>a{display:inline-block;width:90%;padding:4px 6px;border-radius:4px}.linksStillOnTopBar>a:hover{background:var(--ThemeColor, #e91e63);color:white}#toptb{transition:opacity 0.3s ease}
`, 'main');
            window.saltMCBBSCSS.setStyle(`body.nightS #saltNewPageHead{--saltNewPageHeadbgcolor-l-t:rgba(68,68,68,0.5);--saltNewPageHeadbgcolor-l:#444;--saltNewPageHeadbgcolor:#363636}body.nightS #saltNewPageHead,body.nightS #saltNewPageHead a{color:#f0f0f0}body.nightS #saltNewPageHead a:hover{color:#6cf}body.nightS #saltNewPageHead .y_search,body.nightS #saltNewPageHead #scbar_type_menu{background-image:none;background-color:#444}body.nightS #saltNewPageHead .y_search{outline:none}body.nightS #saltNewPageHead .y_search .y_search_btn button{box-shadow:none;filter:invert(0.8) hue-rotate(170deg)}body.nightS #saltNewPageHead .y_search .y_search_inp{background-color:#555;background-image:none}body.nightS #saltNewPageHead .y_search .y_search_inp input{background-color:#666}body.nightS #saltNewPageHead .y_search .scbar_type_td{background-color:#555;background-image:none}#toptb,#p-navSticky{display:none}#top .uix_sidebarNav{margin-top:-60px}#saltNewPageHead{position:fixed;width:310px;height:100vh;top:0;left:-340px;padding:10px 30px;background-color:var(--saltNewPageHeadbgcolor-l-t, #fdfdfd99);color:#111;transition:0.4s ease;transition-delay:0.4s;overflow-x:hidden;box-sizing:content-box;opacity:0.35;z-index:999999}#saltNewPageHead:hover{left:0;background-color:var(--saltNewPageHeadbgcolor-l, #fdfdfd);opacity:1;transition:0.4s ease}#saltNewPageHead::after{content:"saltMCBBS脚本，开发语言: Typescript + SCSS";position:absolute;top:90vh;right:0;color:var(--saltNewPageHeadbgcolor, #fbfbfb);z-index:-1}#saltNewPageHead .y_search,#saltNewPageHead .userinfo,#saltNewPageHead .links,#saltNewPageHead .addons{width:100%;margin:0;margin-bottom:10.5px;overflow:hidden;font-size:14px}#saltNewPageHead .y_search{background-color:transparent;outline:1px solid #ccc;overflow-y:hidden}#saltNewPageHead .y_search,#saltNewPageHead .y_search table{width:100%}#saltNewPageHead .y_search .y_search_btn{opacity:0.5}#saltNewPageHead .y_search .y_search_btn:hover{opacity:0.9}#saltNewPageHead .y_search .y_search_inp{width:calc(100% - 42px);background-image:none}#saltNewPageHead .y_search .y_search_inp input{width:calc(100% - 10px)}#saltNewPageHead .y_search .scbar_type_td{width:48px;background-image:none}#saltNewPageHead #scbar_type_menu{top:var(--top, 322px) !important}#saltNewPageHead .userinfo{overflow-x:hidden}#saltNewPageHead .userinfo>div,#saltNewPageHead .userinfo>span{margin-bottom:7px}#saltNewPageHead .userinfo .username{width:100%;height:100px;font-weight:bold;position:relative}#saltNewPageHead .userinfo .username a{top:2px;position:absolute;font-size:24.5px}#saltNewPageHead .userinfo .username div{top:36px;width:10.2em;position:absolute;color:#999}#saltNewPageHead .userinfo .username img{right:7px;top:4px;position:absolute;border-radius:10%;-webkit-filter:drop-shadow(0 3px 4px #222);filter:drop-shadow(0 3px 4px #222)}#saltNewPageHead .userinfo .thread{width:100%;display:flex;font-size:12.25px;text-align:center}#saltNewPageHead .userinfo .thread span,#saltNewPageHead .userinfo .thread a{width:100%;display:inline-block}#saltNewPageHead .userinfo .progress{width:95%;height:10.5px;margin-left:auto;margin-right:auto;border:1px solid #999;background-color:var(--saltNewPageHeadbgcolor, #fbfbfb);position:relative;display:block;transition:0.3s ease}#saltNewPageHead .userinfo .progress>span{height:100%;background-color:var(--progresscolor, #6cf);display:block}#saltNewPageHead .userinfo .progress::after{content:attr(tooltip);display:block;width:140%;left:-20%;top:0;position:absolute;font-size:9.8px;color:transparent;text-align:center;transition:0.3s ease}#saltNewPageHead .userinfo .progress:hover{transform:translateY(7px)}#saltNewPageHead .userinfo .progress:hover::after{top:-14px;color:inherit}#saltNewPageHead .userinfo .credit{position:relative;margin-bottom:0;font-size:12.25px}#saltNewPageHead .userinfo .credit span{width:calc(50% - 4px);display:inline-block;height:16.8px;line-height:16.8px;padding-left:14px;position:relative;box-sizing:border-box}#saltNewPageHead .userinfo .credit span img{left:1px;top:2px;position:absolute}#saltNewPageHead .links a{width:100%;height:24.5px;line-height:24.5px;display:inline-block;background-color:#fff0;text-align:center;font-size:14px;border-bottom:1px solid #eee}#saltNewPageHead .links a:hover{background-color:var(--saltNewPageHeadbgcolor, #fbfbfb)}#saltNewPageHead .links a:last-child{border-bottom:none}#saltNewPageHead .links .showmenu{padding-right:0;background-image:none}#saltNewPageHead .addons a{width:calc(50% - 4px);display:inline-block;height:22.4px;line-height:22.4px;text-align:center;font-size:14px;background-color:#fff0;border:1px solid transparent}#saltNewPageHead .addons a:hover{background-color:var(--saltNewPageHeadbgcolor, #fbfbfb);border-color:#efefef}#saltNewPageHead .addons a img{display:inline-block;vertical-align:middle;max-width:21px;max-height:21px;margin-right:7px}
`, 'pagehead');
            window.saltMCBBSCSS.setStyle(`body.nightS{--bodybg:#2b2b2b;--bodybg-l:#2b2b2b;--bodybg-l-t:rgba(43,43,43,0)}body.nightS{background-color:#1c1c1c !important;background-image:var(--bodyimg-night);color:#eaeaea}body.nightS a{color:#eaeaea}body.nightS a:hover{color:#6cf}body.nightS input,body.nightS button,body.nightS select,body.nightS textarea{background-color:#3d3d3d;background-image:none;border-color:#837c73;color:#eaeaea}body.nightS button.pn{background-color:#525252}body.nightS .uix_sidebarNav{background-color:#3d3d3d}body.nightS .uix_sidebarNav>div>div{color:#eaeaea;background-color:#3d3d3d;background-image:none}body.nightS .uix_sidebarNav .uix_sidebarNavList>li .p-navEl__inner:hover{background-color:#525252}body.nightS .uix_sidebarNav .uix_sidebarNavList>li .p-navEl__inner a{color:#ddd}body.nightS .uix_mainTabBar{background-color:#3d3d3d;color:#eaeaea}body.nightS .uix_mainTabBar a.tabs-tab.rippleButton{color:#ddd}body.nightS .uix_mainTabBar a.tabs-tab.rippleButton:hover{color:#fff}body.nightS #p-navSticky,body.nightS #p-navSticky nav{background-color:#3d3d3d}body.nightS #p-navSticky a.p-navgroup-link,body.nightS #p-navSticky nav a.p-navgroup-link{color:#eaeaea}body.nightS #p-navSticky a.p-navgroup-link:hover,body.nightS #p-navSticky nav a.p-navgroup-link:hover{color:#fff}body.nightS #body_fixed_bg{opacity:0}body.nightS .fl .forum_index_title,body.nightS .sttl,body.nightS .mn .bm_h{background-color:#3d3d3d;padding-left:16px}body.nightS .p_pop,body.nightS .p_pof,body.nightS .sllt{background-color:#3d3d3d;border-color:#837c73;background-image:none}body.nightS .p_pop a,body.nightS .p_pof a,body.nightS .sllt a{color:#eaeaea}body.nightS .p_pop a:hover,body.nightS .p_pof a:hover,body.nightS .sllt a:hover{color:#6cf;background-color:#837c73}body.nightS #pt .z a,body.nightS #pt .z em,body.nightS #pt .z span{color:#eaeaea}body.nightS #nv_right{background-color:#3d3d3d;background-image:none}body.nightS #nv_right a{color:#eaeaea}body.nightS #nv_right a:hover{color:#6cf}body.nightS .m_c,body.nightS .tm_c{background-color:#2b2b2b;color:#eaeaea}body.nightS .m_c .dt th,body.nightS .tm_c .dt th{background-color:#2b2b2b}body.nightS .m_c .px,body.nightS .m_c .pt,body.nightS .m_c .ps,body.nightS .m_c select,body.nightS .tm_c .px,body.nightS .tm_c .pt,body.nightS .tm_c .ps,body.nightS .tm_c select{background-color:#3d3d3d;border-top:none;border-bottom:none;border-left:none;border-right:none;border-width:0px}body.nightS .m_c .o,body.nightS .tm_c .o{background-color:#3d3d3d}body.nightS .m_c a,body.nightS .tm_c a{color:#eaeaea}body.nightS .m_c a:hover,body.nightS .tm_c a:hover{color:#6cf}body.nightS .m_c .flb,body.nightS .tm_c .flb{background-color:transparent}body.nightS .nfl .f_c{background-color:#444;border:none}body.nightS .alt>th,body.nightS .alt>td{background-color:#3d3d3d}body.nightS .dt td,body.nightS .dt th{background-color:#3d3d3d}body.nightS .dt td a,body.nightS .dt th a{color:#eaeaea}body.nightS .dt td a:hover,body.nightS .dt th a:hover{color:#6cf}body.nightS .dt tr:not(.alt) td,body.nightS .dt tr:not(.alt) th{background-color:#2b2b2b}body.nightS .bm{background-color:transparent}body.nightS #toptb{background-image:none;background-color:#3d3d3d}body.nightS #toptb .y_search{background-image:none;background-color:#444}body.nightS #toptb .y_search .y_search_btn button{box-shadow:none;filter:invert(0.8) hue-rotate(170deg)}body.nightS #toptb .y_search .y_search_inp{background-color:#555;background-image:none}body.nightS #toptb .y_search .y_search_inp input{background-color:#666}body.nightS #toptb .y_search .scbar_type_td{background-color:#555;background-image:none}body.nightS #user_info_menu{background-image:none;background-color:#525252}body.nightS #user_info_menu .linksStillOnTopBar a{color:#eaeaea}body.nightS #user_info_menu .linksStillOnTopBar a:hover{background:var(--MExtBtnClr, #999)}body.nightS .xi2,body.nightS .xi2 a,body.nightS .xi3 a{color:#69f}body.nightS .tl th em,body.nightS .tl th em a{color:#4dc4ff}body.nightS .block.move-span{color:#eaeaea;background-color:#3d3d3d}body.nightS .block.move-span a{color:#eaeaea}body.nightS .block.move-span a:hover{color:#6cf}body.nightS .block-container,body.nightS .tbn{background-color:#3d3d3d;color:#eaeaea}body.nightS .block-minorHeader{color:#ddd}body.nightS .block-body{background-color:#3d3d3d}body.nightS .node-body{background-color:transparent;color:#eaeaea}body.nightS .node-body a{color:#eaeaea}body.nightS .node-body a:hover{color:#6cf}body.nightS .card_gender_127,body.nightS .card_gender_3,body.nightS .card_gender_2,body.nightS .card_gender_1,body.nightS .card_gender_0{background-image:none;border-color:#837c73}body.nightS .card_gender_127 .o a,body.nightS .card_gender_3 .o a,body.nightS .card_gender_2 .o a,body.nightS .card_gender_1 .o a,body.nightS .card_gender_0 .o a{background-color:#525252;background-image:none}body.nightS .card_gender_127{background-color:#53492d}body.nightS .card_gender_3{background-color:#173617}body.nightS .card_gender_2{background-color:#50303d}body.nightS .card_gender_1{background-color:#204060}body.nightS .card_gender_0{background-color:#3d3d3d}body.nightS #diy_chart #frame48dS31{border-color:transparent !important}body.nightS #diy_chart .frame{background-color:#3d3d3d;border-color:transparent}body.nightS #diy_chart .frame .column{color:#eaeaea}body.nightS #diy_chart .frame .column a{color:#eaeaea}body.nightS #diy_chart .frame .column a:hover{color:#6cf}body.nightS #diy_chart .frame .column .tab-title.title{background-color:#2b2b2b !important}body.nightS #diy_chart .frame .column .tab-title.title ul{background-color:#3d3d3d !important}body.nightS #diy_chart .frame .column .tab-title.title ul li a{border-color:transparent !important}body.nightS #diy_chart .frame .column .tab-title.title ul li:not(.a) a{background-color:#525252}body.nightS #diy_chart .frame .column .tab-title.title ul li.a a{background-color:#666}body.nightS #diy_chart .frame .column .tb-c>div{background-color:#3d3d3d}body.nightS #diy_chart #tabVpFJkk{background-color:#3d3d3d !important;border-color:transparent !important}body.nightS .portal_block_summary iframe{filter:brightness(0.5)}body.nightS .pgb a{background-color:transparent}body.nightS .pgt .pg a,body.nightS .pgt .pg strong,body.nightS .pgt .pg label,body.nightS .pgs .pg a,body.nightS .pgs .pg strong,body.nightS .pgs .pg label{color:#eaeaea;background-color:transparent}body.nightS .pgt .pg strong,body.nightS .pgs .pg strong{background-color:#3d3d3d}body.nightS .pgbtn,body.nightS .pgbtn a{border:none;box-shadow:none}body.nightS .pgbtn a{background-color:#3d3d3d;color:#eaeaea;border:none}body.nightS #wp .wp{background-color:#2b2b2b;color:#eaeaea}body.nightS #wp .wp table,body.nightS #wp .wp tr,body.nightS #wp .wp td{border-color:#837c73}body.nightS #wp .wp table a,body.nightS #wp .wp tr a,body.nightS #wp .wp td a{color:#eaeaea}body.nightS #wp .wp table a:hover,body.nightS #wp .wp tr a:hover,body.nightS #wp .wp td a:hover{color:#6cf}body.nightS #postlist{background-color:transparent;border:none}body.nightS #postlist>table,body.nightS .plhin,body.nightS #f_pst{border:none;box-shadow:none}body.nightS #postlist>table tr,body.nightS #postlist>table td,body.nightS #postlist>table div,body.nightS .plhin tr,body.nightS .plhin td,body.nightS .plhin div,body.nightS #f_pst tr,body.nightS #f_pst td,body.nightS #f_pst div{border-color:#837c73}body.nightS #postlist>table .ad,body.nightS .plhin .ad,body.nightS #f_pst .ad{background-color:#3d3d3d}body.nightS #postlist>table td.pls,body.nightS .plhin td.pls,body.nightS #f_pst td.pls{background-color:#2b2b2b;border:none}body.nightS #postlist>table td.plc,body.nightS .plhin td.plc,body.nightS #f_pst td.plc{background-color:#3d3d3d;border:none}body.nightS #postlist>table .pls .avatar img,body.nightS .plhin .pls .avatar img,body.nightS #f_pst .pls .avatar img{background-color:#3d3d3d;background-image:none}body.nightS #postlist>table a,body.nightS .plhin a,body.nightS #f_pst a{color:#eaeaea}body.nightS #postlist>table a:hover,body.nightS .plhin a:hover,body.nightS #f_pst a:hover{color:#6cf}body.nightS .plhin .quote{background-color:#525252;color:#eaeaea}body.nightS .plhin .pcb .t_fsz>table table{color:#444}body.nightS .plhin .pcb .t_fsz>table .spoilerbutton{border:1px solid #525252}body.nightS .plhin .pcb .t_fsz>table .spoilerbody>table{color:#eaeaea;text-shadow:none}body.nightS .plhin .pls{border-radius:0}body.nightS .plhin.warned{opacity:0.1}body.nightS .plhin.warned:hover{opacity:0.9}body.nightS .plhin .tbn .mt.bbda{background-image:none;background-color:#3d3d3d}body.nightS .plhin .tbn ul{border-top:none;border-bottom:none;border-left:none;border-right:none;border-width:0px}body.nightS #vfastpost{background-color:transparent;background-image:none}body.nightS #vfastpost #vf_l,body.nightS #vfastpost #vf_m,body.nightS #vfastpost #vf_r,body.nightS #vfastpost #vf_b{background-color:#2b2b2b;background-image:none}body.nightS #vfastpost #vf_m input{border-color:transparent;color:#eaeaea !important}body.nightS #vfastpost #vf_l{border-radius:5px 0 0 5px}body.nightS #vfastpost #vf_r{border-radius:0 5px 5px 0}body.nightS #vfastpost #vreplysubmit{background-color:#2b2b2b;background-image:none;box-shadow:none;position:relative}body.nightS #vfastpost #vreplysubmit:after{content:"快速回复";position:absolute;top:0;left:0;width:100%;height:38px;line-height:38px;font-size:14px}body.nightS #p_btn a,body.nightS #p_btn a i{background-color:#525252;background-image:none}body.nightS .psth{background-color:#525252;background-image:none}body.nightS #postlist.bm{border-color:#837c73}body.nightS #mymodannouncement,body.nightS #myskinannouncement,body.nightS #mytextureannouncement,body.nightS #my16modannouncement,body.nightS #announcement,body.nightS #announcement1,body.nightS #announcement2,body.nightS .cgtl caption,body.nightS .locked{background-color:#2b2b2b;border:none}body.nightS #fastpostform .pls,body.nightS #fastpostform .plc{border:none}body.nightS #fastposteditor,body.nightS #fastposteditor .bar,body.nightS #fastposteditor .area,body.nightS #fastposteditor .pt{background-color:#2b2b2b;border:none}body.nightS #fastposteditor .fpd a{filter:drop-shadow(0 0 4px #fff) drop-shadow(0 0 4px #fff) drop-shadow(0 0 4px #fff)}body.nightS #postform .tedt>div{background-color:#3d3d3d}body.nightS #postform .tedt .bar .fpd a{filter:drop-shadow(0 0 4px #fff) drop-shadow(0 0 4px #fff) drop-shadow(0 0 4px #fff)}body.nightS #postform .tedt .area,body.nightS #postform .tedt .area textarea{background-color:#2b2b2b}body.nightS .pi strong a{border-color:transparent}body.nightS #threadstamp img{filter:drop-shadow(0 0 4px #fff) drop-shadow(0 0 4px #fff) drop-shadow(0 0 4px #fff)}body.nightS .blockcode{background-color:#2b2b2b;background-image:url(https://attachment.mcbbs.net/forum/202101/22/221225qf7ml74pmu2rggmz.png);border-color:#999;color:#eaeaea}body.nightS .blockcode ol li{color:#fff}body.nightS .blockcode ol li:hover{background:#706b5c;color:#d9e6f2}body.nightS #ct .bm.bml.pbn .bm_c,body.nightS #ct .bm.bmw.fl .bm_c{background-color:#3d3d3d !important}body.nightS #ct .mn a.bm_h{background-color:#3d3d3d !important;border:none;color:#eaeaea}body.nightS #ct .mn a.bm_h:hover{color:#6cf}body.nightS #ct .fastpreview .bm_c{background-color:#2b2b2b !important}body.nightS #ct .fastpreview .bm_c .pcb{background-color:#2b2b2b}body.nightS #threadlist{background-color:#3d3d3d}body.nightS #threadlist .structItem:hover{background-color:#525252}body.nightS .structItem-title{color:#eaeaea}body.nightS .p-title .p-title-value,body.nightS .p-description .listInline{color:#eaeaea}body.nightS #pgt{background-color:transparent !important}body.nightS #thread_types>li a,body.nightS #separatorline th,body.nightS #separatorline td,body.nightS #forumnewshow,body.nightS #f_pst .bm_c{background-color:#3d3d3d !important}body.nightS #thread_types>li a{color:#eaeaea}body.nightS #thread_types>li a:hover{color:#6cf}body.nightS #livethread{border-color:#837c73}body.nightS #livethread #livereplycontentout{background-color:#2b2b2b;scrollbar-width:thin;scrollbar-color:#eee #999}body.nightS #livethread #livereplycontentout::-webkit-scrollbar{width:8px;height:8px}body.nightS #livethread #livereplycontentout::-webkit-scrollbar-thumb{border-radius:8px;box-shadow:inset 0 0 4px rgba(102,102,102,0.25);background:#999}body.nightS #livethread #livereplycontentout::-webkit-scrollbar-track{box-shadow:inset 0 0 4px rgba(187,187,187,0.25);border-radius:8px;background:#eee}body.nightS #livethread #livereplycontent{background-color:#2b2b2b}body.nightS #livethread #livereplycontent>div{background-color:#3d3d3d}body.nightS #livethread #livefastcomment{border-color:#837c73;background-color:#2b2b2b}body.nightS #livethread #livefastcomment textarea{background-color:#3d3d3d;color:#eaeaea !important}body.nightS #waterfall li{background-image:none;background-color:#3d3d3d;transition:0.3 ease}body.nightS #waterfall li:hover{background-color:#525252}body.nightS #waterfall li>*{background-image:none;background-color:transparent}body.nightS #portal_block_857,body.nightS #portal_block_873,body.nightS #portal_block_871{background-color:#3d3d3d !important}body.nightS #framet3reHb,body.nightS #framecpjFn1,body.nightS #framecvgTv9{border-color:#837c73 !important}body.nightS #ct .appl{border-color:transparent !important}body.nightS #ct .appl .tbn h2{background-color:#1c1c1c;background-image:none}body.nightS #ct .appl .tbn ul{border:none}body.nightS #ct .appl .tbn ul li:hover{background-color:#3d3d3d}body.nightS #ct .appl .tbn a{color:#eaeaea;background-color:transparent}body.nightS #ct .appl .tbn a:hover{color:#6cf}body.nightS #ct .mn .bm{background-color:transparent}body.nightS #ct .mn .bm .tb.cl,body.nightS #ct .mn .bm .bm_h{background-color:#1c1c1c;background-image:none}body.nightS #ct .mn .bm .tb.cl h3,body.nightS #ct .mn .bm .bm_h h3{color:#eaeaea !important}body.nightS #ct .mn .bm .bm.mtm,body.nightS #ct .mn .bm .bm_c{background-color:#3d3d3d;border-color:transparent}body.nightS #ct .mn .bm ul li{color:#eaeaea}body.nightS #ct .mn .bm ul.buddy li{background-color:#3d3d3d;border:none}body.nightS #ct .mn .bm a{color:#eaeaea}body.nightS #ct .mn .bm a:hover{color:#6cf}body.nightS #ct .mn .bm .bm.bmn.mtm.cl{background-color:transparent !important}body.nightS #ct .mn .bm input,body.nightS #ct .mn .bm select,body.nightS #ct .mn .bm option{background-color:#3d3d3d;background-image:none;border-top:none;border-bottom:none;border-left:none;border-right:none;border-width:0px}body.nightS #ct .mn .bm .nts{background-color:#3d3d3d}body.nightS #ct .mn .bm .nts .ntc_body[style*="color"]{color:#eaeaea !important}body.nightS #ct .mn .bm .pg a,body.nightS #ct .mn .bm .pg strong,body.nightS #ct .mn .bm .pg label{color:#eaeaea;background-color:transparent}body.nightS #ct .mn .bm .pg strong{background-color:#3d3d3d}body.nightS #ct .mn .bm .tdats th,body.nightS #ct .mn .bm .tdats td{background-color:#2b2b2b}body.nightS #ct .mn .bm .tdats th.alt,body.nightS #ct .mn .bm .tdats td.alt{background-color:#3d3d3d}body.nightS #ct .mn .bm .tdats .alt th,body.nightS #ct .mn .bm .tdats .alt td{background-color:#3d3d3d}body.nightS #ct .mn .bm .tdats .alt.h th,body.nightS #ct .mn .bm .tdats .alt.h td{color:#3d3d3d;background-color:#eaeaea}body.nightS #ct .mn .bm .pml .hover{background-color:#3d3d3d}body.nightS #ct .mn .bm[style*="background:#fff"]{background-color:transparent !important}body.nightS #ct .mn .bm[style*="background:#fff"] .tedt>div{background-color:#3d3d3d}body.nightS #ct .mn .bm[style*="background:#fff"] .tedt .bar .fpd a{filter:drop-shadow(0 0 4px #fff) drop-shadow(0 0 4px #fff) drop-shadow(0 0 4px #fff)}body.nightS #ct .mn .bm[style*="background:#fff"] .tedt .area,body.nightS #ct .mn .bm[style*="background:#fff"] .tedt .area textarea{background-color:#2b2b2b}body.nightS #ct[style*="background"]{background-color:transparent !important}body.nightS #threadlist .pbw h3 a{color:#69f}body.nightS #threadlist .pbw h3 a:visited{color:#b54dff}body.nightS #threadlist .pbw p{color:#eaeaea}body.nightS #pmform .tedt>div,body.nightS #td_sightml .tedt>div{background-color:#3d3d3d}body.nightS #pmform .tedt .bar .fpd a,body.nightS #td_sightml .tedt .bar .fpd a{filter:drop-shadow(0 0 4px #fff) drop-shadow(0 0 4px #fff) drop-shadow(0 0 4px #fff)}body.nightS #pmform .tedt .area,body.nightS #pmform .tedt .area textarea,body.nightS #td_sightml .tedt .area,body.nightS #td_sightml .tedt .area textarea{background-color:#2b2b2b}body.nightS #nv>ul{background-color:#2b2b2b;background-image:none;border:none}body.nightS #nv>ul li:first-child>a,body.nightS #nv>ul li:first-child>a:hover{border-left:none}body.nightS #nv>ul li:last-child>a,body.nightS #nv>ul li:last-child>a:hover{border-right:none}body.nightS #nv>ul li>a{background-color:#3d3d3d}body.nightS #nv>ul li>a,body.nightS #nv>ul li>a:hover{border-color:#3d3d3d}body.nightS #nv>ul li>a:hover{background-color:#525252}body.nightS #uhd{background-color:#3d3d3d;border-color:#2b2b2b}body.nightS #uhd ul.tb.cl{border-bottom-color:#2b2b2b}body.nightS #uhd ul.tb.cl li a{background-color:#2b2b2b;border:none;color:#eaeaea}body.nightS #uhd ul.tb.cl li a:hover{color:#6cf}body.nightS #uhd .mn ul li a{color:#eaeaea}body.nightS #uhd .mn ul li a :hover{color:#6cf}body.nightS #uhd .mn .tb{background-color:transparent}body.nightS #ct{border-color:#2b2b2b}body.nightS #ct[style*="background:#fff"]{background-color:#3d3d3d !important}body.nightS .tl{background-color:transparent}body.nightS .tl tr{background-color:transparent}body.nightS .tl tr th,body.nightS .tl tr td{background-color:transparent;border:none}body.nightS .tl tr:hover th,body.nightS .tl tr:hover td{background-color:#525252}body.nightS #visitor_content,body.nightS #friend_content,body.nightS .emp,body.nightS .blocktitle{color:#eaeaea}body.nightS #visitor_content a,body.nightS #friend_content a,body.nightS .emp a,body.nightS .blocktitle a{color:#eaeaea}body.nightS #visitor_content a:hover,body.nightS #friend_content a:hover,body.nightS .emp a:hover,body.nightS .blocktitle a:hover{color:#6cf;background-color:#837c73}body.nightS #typeid_ctrl_menu{background-color:#3d3d3d;border-color:#837c73}body.nightS #typeid_ctrl_menu li{color:#eaeaea}body.nightS #editorbox{background-color:#3d3d3d}body.nightS #editorbox>*{background-color:transparent}body.nightS #editorbox .tb .a a,body.nightS #editorbox .tb .current a{background-color:#525252}body.nightS #editorbox .area{background-color:#2b2b2b}body.nightS .ftid a{background-color:#3d3d3d;border-color:#837c73;color:#eaeaea !important}body.nightS .exfm{background-color:#525252;border-color:#837c73}body.nightS #e_controls{background-color:#525252}body.nightS #e_controls .b1r a,body.nightS #e_controls .b2r a{border:none;border-width:0px}body.nightS #e_controls .b1r a:not(.dp),body.nightS #e_controls .b2r a:not(.dp){filter:drop-shadow(0 0 4px #fff) drop-shadow(0 0 4px #fff) drop-shadow(0 0 4px #fff)}body.nightS #e_controls .b1r a.dp,body.nightS #e_controls .b2r a.dp{background-color:#525252;color:#eaeaea}body.nightS #e_textarea{background-color:#2b2b2b}body.nightS #e_body .area,body.nightS #rstnotice,body.nightS #e_bbar{background-color:#3d3d3d;border-color:#837c73}body.nightS #nav>div:not(.uix_fabBar),body.nightS #nav>div>div:not(.uix_fabBar),body.nightS #content>*>div:not(.uix_fabBar),body.nightS #content>*>div>div:not(.uix_fabBar),body.nightS li>div:not(.uix_fabBar),body.nightS li>div>div:not(.uix_fabBar),body.nightS #end>div:not(.uix_fabBar),body.nightS #end>div>div:not(.uix_fabBar),body.nightS #footer>div:not(.uix_fabBar),body.nightS #footer>div>div:not(.uix_fabBar){background-color:#3d3d3d}body.nightS #nav strong>a,body.nightS #content>* strong>a,body.nightS li strong>a,body.nightS #end strong>a,body.nightS #footer strong>a{color:#eaeaea}body.nightS #nav strong>a:hover,body.nightS #content>* strong>a:hover,body.nightS li strong>a:hover,body.nightS #end strong>a:hover,body.nightS #footer strong>a:hover{color:#6cf}body.nightS #content p.author{background-color:#3d3d3d}body.nightS .xl label,body.nightS .xl label a{color:#f99}body.nightS a[style*="or:"][style*="#333333"],body.nightS font[style*="or:"][style*="#333333"]{color:#e0e0e0 !important}body.nightS a[style*="or:"][style*="#663399"],body.nightS font[style*="or:"][style*="#663399"]{color:#de90df !important}body.nightS a[style*="or:"][style*="#8f2a90"],body.nightS font[style*="or:"][style*="#8f2a90"]{color:#de90df !important}body.nightS a[style*="or:"][style*="#660099"],body.nightS font[style*="or:"][style*="#660099"]{color:#bf8cd9 !important}body.nightS a[style*="or:"][style*="#660000"],body.nightS font[style*="or:"][style*="#660000"]{color:#c66 !important}body.nightS a[style*="or:"][style*="#993333"],body.nightS font[style*="or:"][style*="#993333"]{color:#f99 !important}body.nightS a[style*="or:"][style*="#EE1B2E"],body.nightS font[style*="or:"][style*="#EE1B2E"]{color:#f99 !important}body.nightS a[style*="or:"][style*="#ff0000"],body.nightS font[style*="or:"][style*="#ff0000"]{color:#f99 !important}body.nightS a[style*="or:"][style*="#FF0000"],body.nightS font[style*="or:"][style*="#FF0000"]{color:#f99 !important}body.nightS a[style*="or:"][style*="#CC0000"],body.nightS font[style*="or:"][style*="#CC0000"]{color:#f99 !important}body.nightS a[style*="or:"][style*="#EE5023"],body.nightS font[style*="or:"][style*="#EE5023"]{color:#e97c5d !important}body.nightS a[style*="or:"][style*="#996600"],body.nightS font[style*="or:"][style*="#996600"]{color:#e6a219 !important}body.nightS a[style*="or:"][style*="#663300"],body.nightS font[style*="or:"][style*="#663300"]{color:#d97f26 !important}body.nightS a[style*="or:"][style*="#006666"],body.nightS font[style*="or:"][style*="#006666"]{color:#6cc !important}body.nightS a[style*="or:"][style*="#3C9D40"],body.nightS font[style*="or:"][style*="#3C9D40"]{color:#8f8 !important}body.nightS a[style*="or:"][style*="#009900"],body.nightS font[style*="or:"][style*="#009900"]{color:#9f9 !important}body.nightS a[style*="or:"][style*="#2897C5"],body.nightS font[style*="or:"][style*="#2897C5"]{color:#52b6e0 !important}body.nightS a[style*="or:"][style*="#3366ff"],body.nightS font[style*="or:"][style*="#3366ff"]{color:#6af !important}body.nightS a[style*="or:"][style*="#2b65b7"],body.nightS font[style*="or:"][style*="#2b65b7"]{color:#6af !important}body.nightS a[style*="or:"][style*="#003399"],body.nightS font[style*="or:"][style*="#003399"]{color:#6af !important}body.nightS a[style*="or:"][style*="#2B65B7"],body.nightS font[style*="or:"][style*="#2B65B7"]{color:#6af !important}body.nightS a[style*="or:"][style*="#330066"],body.nightS font[style*="or:"][style*="#330066"]{color:#b28cd9 !important}body.nightS a[style*="or:"][style*="#8F2A90"],body.nightS font[style*="or:"][style*="#8F2A90"]{color:#cf61d1 !important}body.nightS a[style*="or:"][style*="#EC1282"],body.nightS font[style*="or:"][style*="#EC1282"]{color:#f655a8 !important}body.nightS a[style*="nd-co"][style*="#FFFFFF"]{background-color:transparent !important}body.nightS a[style*="nd-co"][style*="Wheat"]{background-color:transparent !important}body.nightS a[style*="nd-co"][style*="white"]{background-color:transparent !important}body.nightS a[style*="nd-co"][style*="#ffffff"]{background-color:transparent !important}body.nightS a[style*="nd-co"][style*="rgb(251, 242, 219)"]{background-color:transparent !important}body.nightS a[style*="nd-co"][style*="rgb(236, 227, 184)"]{background-color:transparent !important}body.nightS a[style*="nd-co"][style*="rgb(255, 255, 255)"]{background-color:transparent !important}body.nightS a[style*="nd-co"][style*="rgb(252, 252, 252)"]{background-color:transparent !important}body.nightS font[color*="#000"]{color:#fff !important}body.nightS font[color*="black"]{color:#fff !important}body.nightS font[color*="Black"]{color:#fff !important}body.nightS font[color*="333333"]{color:#e0e0e0 !important}body.nightS font[color*="353535"]{color:#e0e0e0 !important}body.nightS font[color*="660000"]{color:#c66 !important}body.nightS font[color*="8b0000"]{color:#c66 !important}body.nightS font[color*="ff0000"]{color:#f99 !important}body.nightS font[color*="red"]{color:#f99 !important}body.nightS font[color*="Red"]{color:#f99 !important}body.nightS font[color*="000080"]{color:#8af !important}body.nightS font[color*="0000ff"]{color:#8af !important}body.nightS font[color*="3366ff"]{color:#8af !important}body.nightS font[color*="003399"]{color:#8af !important}body.nightS font[color*="blue"]{color:#8af !important}body.nightS font[color*="Blue"]{color:#8af !important}body.nightS font[color*="Navy"]{color:#8af !important}body.nightS font[color*="339933"]{color:#9f9 !important}body.nightS font[color*="009900"]{color:#9f9 !important}body.nightS font[color*="008000"]{color:#9f9 !important}body.nightS font[color*="006400"]{color:#9f9 !important}body.nightS font[color*="#0640"]{color:#9f9 !important}body.nightS font[color*="green"]{color:#9f9 !important}body.nightS font[color*="Green"]{color:#9f9 !important}body.nightS font[color*="660099"]{color:#bf8cd9 !important}body.nightS font[color*="4b0082"]{color:#b54dff !important}body.nightS font[color*="Indigo"]{color:#b54dff !important}body.nightS font[color*="DarkOrchid"]{color:#c57ce9 !important}body.nightS font[color*="800080"]{color:#e830e8 !important}body.nightS font[color*="Purple"]{color:#e830e8 !important}body.nightS font[color*="2d76c4"]{color:#5c97d6 !important}body.nightS font[color*="Olive"]{color:#ff3 !important}body.nightS font[color*="Sienna"]{color:#d28460 !important}body.nightS font[style*="nd-co"][style*="#FFFFFF"]{background-color:transparent !important}body.nightS font[style*="nd-co"][style*="Wheat"]{background-color:transparent !important}body.nightS font[style*="nd-co"][style*="white"]{background-color:transparent !important}body.nightS font[style*="nd-co"][style*="#ffffff"]{background-color:transparent !important}body.nightS font[style*="nd-co"][style*="rgb(251, 242, 219)"]{background-color:transparent !important}body.nightS font[style*="nd-co"][style*="rgb(236, 227, 184)"]{background-color:transparent !important}body.nightS font[style*="nd-co"][style*="rgb(255, 255, 255)"]{background-color:transparent !important}body.nightS font[style*="nd-co"][style*="rgb(252, 252, 252)"]{background-color:transparent !important}body.nightS .t_f[style*="background-color"][style*="#FBF2DB"]{background-color:transparent !important}body.nightS .consolePanel,body.nightS .settingPanel,body.nightS .emoticonPanel,body.nightS .saltMCBBSinputbox{background-color:#2b2b2b;color:#eaeaea;border-color:rgba(153,153,153,0.2)}body.nightS .consolePanel>*:first-child,body.nightS .settingPanel>*:first-child,body.nightS .emoticonPanel>*:first-child,body.nightS .saltMCBBSinputbox>*:first-child{background-color:#2b2b2b}body.nightS .consolePanel textarea,body.nightS .settingPanel textarea{background-color:#3d3d3d;border:none}body.nightS .consolePanel input,body.nightS .settingPanel input{border:none;border-width:0px}body.nightS .consolePanel div h3>small,body.nightS .settingPanel div h3>small{color:#aaa}body.nightS .emoticonPanel .op{background-color:#2b2b2b}
`, 'night-style');
            window.saltMCBBSCSS.setStyle(`p.md_ctrl{position:relative;float:left;min-width:120px;overflow:visible;margin-left:5px;padding-left:10px;transition:0.3s ease}p.md_ctrl:not(.salt-expand),p.md_ctrl:not(.salt-expand):hover{max-height:var(--maxHeight, 96px) !important}p.md_ctrl.salt-expand,p.md_ctrl.salt-expand:hover{max-height:var(--expandHeight, 960px)}p.md_ctrl.expandable{padding-bottom:32px;overflow:hidden}p.md_ctrl .saltExpandHandler{position:absolute;bottom:0;left:0;width:100%;height:32px;color:#3882a7;background-image:linear-gradient(0deg, #fcfcfc, #fcfcfc, rgba(252,252,252,0));cursor:pointer}p.md_ctrl .saltExpandHandler:after{content:'点击展开';display:block;width:100%;height:32px;line-height:32px;text-align:center}p.md_ctrl.salt-expand .saltExpandHandler:after{content:'点击收起'}p.md_ctrl:not(.expandable) .saltExpandHandler{display:none}p.md_ctrl>a{width:100%}p.md_ctrl>a>img{animation:dropdown 0.5s ease;position:relative;width:35px;height:55px;-webkit-filter:drop-shadow(0 3px 2px #000);filter:drop-shadow(0 3px 2px #000);margin:4.5px;transition:filter 0.5s ease}p.md_ctrl>a>img:hover{animation:pickup 0.5s ease;-webkit-transform:matrix3d(1, 0, 0, 0, 0, 1, 0, -0.001, 0, 0, 1, 0, 0, -1.6, 0, 0.85);transform:matrix3d(1, 0, 0, 0, 0, 1, 0, -0.001, 0, 0, 1, 0, 0, -1.6, 0, 0.85);-webkit-filter:drop-shadow(0 5px 4px rgba(0,0,0,0.75));filter:drop-shadow(0 5px 4px rgba(0,0,0,0.75))}body.night-style p.md_ctrl .saltExpandHandler{color:#6cf;background-image:linear-gradient(0deg, var(--bodybg-l, #313131), var(--bodybg-l, #313131), var(--bodybg-l-t, rgba(49,49,49,0)))}body #append_parent>.tip_4,body .tip_4.aimg_tip,body .pls .tip_4,body .tip_4[id*="attach"],body dd>.tip_4{background-color:#e3c99eee !important;max-height:90px !important;width:140px;margin-top:35px}body .tip_4.aimg_tip,body .tip_4[id*="attach"]{width:200px !important;padding:5px !important;background-image:none !important}body .tip_4[id*='attach'] .tip_c{padding:5px !important;background-image:none !important}body .tip_4.aimg_tip p{pointer-events:auto !important}body #append_parent>.tip_4{margin-top:40px;margin-left:-10px}body .tip_3,body .tip_4{transition:opacity 0.4s ease !important;width:105px;height:165px;padding:0;border:none;border-radius:5px;margin-top:85px;margin-left:44px;pointer-events:none !important;overflow:hidden;background-color:rgba(153,153,153,0.75);box-shadow:0px 10px 25px -4px #000;image-rendering:pixelated}body .tip_3::before,body .tip_4::before{content:'';position:absolute;z-index:-1;top:-7px;left:-7px;width:119px;height:187px;background-size:119px 187px !important;-webkit-filter:saturate(140%);filter:saturate(140%)}body .tip .tip_horn{display:none}body .tip .tip_c{padding:20px 15px 0 15px;height:165px;color:#222;line-height:1.2em}body .tip .tip_c>p,body .tip .tip_c>h4{color:#222}body .tip .tip_c h4{border-bottom:1px solid #fff;text-align:center}body .tip[id$='_menu'][id^='m']{display:flex}body .tip[id$='_menu'][id^='m'] .tip_c{height:auto;margin:auto;padding:0 0 5px 0;background-color:rgba(255,255,255,0.4);text-shadow:0 0 6px #fff, 0 0 6px #fff, 0 0 6px #fff, 0 0 6px #fff}body .tip[id$='_menu'][id^='m'] .tip_c>p,body .tip[id$='_menu'][id^='m'] .tip_c>h4{padding:5px 10px 0}body .tip::after{content:'';position:absolute;height:100%;width:100%;top:0;left:0;background-image:linear-gradient(142deg, #fff0 0%, #fff4 5%, #fff2 28%, #fff0 29%, #fff0 70%, #fff2 70.5%, #fff2 73%, #fff0 74%, #fff4 75%, #fff2 85%, #fff0 85.1%);z-index:-1}body div[id$='_menu']:before{background-repeat:no-repeat;background:var(--bgimg, transparent);z-index:-1}body div[id$='_101_menu']:before{--bgimg:url(static/image/common/m_a2.png)}body div[id$='_102_menu']:before{--bgimg:url(static/image/common/m_a3.png)}body div[id$='_103_menu']:before{--bgimg:url(static/image/common/m_a6.png)}body div[id$='_11_menu']:before{--bgimg:url(static/image/common/m_d1.png)}body div[id$='_12_menu']:before{--bgimg:url(static/image/common/m_d2.png)}body div[id$='_104_menu']:before{--bgimg:url(static/image/common/m_b1.png)}body div[id$='_105_menu']:before{--bgimg:url(static/image/common/m_b3.png)}body div[id$='_106_menu']:before{--bgimg:url(static/image/common/m_b4.png)}body div[id$='_234_menu']:before{--bgimg:url(static/image/common/m_b5.gif)}body div[id$='_107_menu']:before{--bgimg:url(static/image/common/m_rc1.png)}body div[id$='_108_menu']:before{--bgimg:url(static/image/common/m_rc3.png)}body div[id$='_109_menu']:before{--bgimg:url(static/image/common/m_rc5.png)}body div[id$='_250_menu']:before{--bgimg:url(static/image/common/m_c_10years.png)}body div[id$='_76_menu']:before{--bgimg:url(static/image/common/m_g5.png)}body div[id$='_58_menu']:before{--bgimg:url(static/image/common/m_g3.png)}body div[id$='_59_menu']:before{--bgimg:url(static/image/common/m_g4.png)}body div[id$='_21_menu']:before{--bgimg:url(static/image/common/m_noob.png)}body div[id$='_9_menu']:before{--bgimg:url(static/image/common/m_c2.png)}body div[id$='_2_menu']:before{--bgimg:url(static/image/common/m_c3.png)}body div[id$='_38_menu']:before{--bgimg:url(static/image/common/m_c1.png)}body div[id$='_112_menu']:before{--bgimg:url(static/image/common/m_c4.png)}body div[id$='_251_menu']:before{--bgimg:url(static/image/common/m_c_piglin.png)}body div[id$='_155_menu']:before{--bgimg:url(static/image/common/m_cape_mc2011.png)}body div[id$='_156_menu']:before{--bgimg:url(static/image/common/m_cape_mc2012.png)}body div[id$='_157_menu']:before{--bgimg:url(static/image/common/m_cape_mc2013.png)}body div[id$='_158_menu']:before{--bgimg:url(static/image/common/m_cape_mc2015.png)}body div[id$='_159_menu']:before{--bgimg:url(static/image/common/m_cape_Tr.png)}body div[id$='_180_menu']:before{--bgimg:url(static/image/common/m_cape_cobalt.png)}body div[id$='_181_menu']:before{--bgimg:url(static/image/common/m_cape_maper.png)}body div[id$='_196_menu']:before{--bgimg:url(static/image/common/m_cape_mc2016.png)}body div[id$='_247_menu']:before{--bgimg:url(static/image/common/m_cape_Mojira.png)}body div[id$='_45_menu']:before{--bgimg:url(static/image/common/m_s1.png)}body div[id$='_127_menu']:before{--bgimg:url(static/image/common/m_s2.png)}body div[id$='_78_menu']:before{--bgimg:url(static/image/common/m_p_pc.png)}body div[id$='_113_menu']:before{--bgimg:url(static/image/common/m_p_and.png)}body div[id$='_114_menu']:before{--bgimg:url(static/image/common/m_p_ios.png)}body div[id$='_141_menu']:before{--bgimg:url(static/image/common/m_p_wp.png)}body div[id$='_160_menu']:before{--bgimg:url(static/image/common/m_p_w10.png)}body div[id$='_115_menu']:before{--bgimg:url(static/image/common/m_p_box360.png)}body div[id$='_116_menu']:before{--bgimg:url(static/image/common/m_p_boxone.png)}body div[id$='_117_menu']:before{--bgimg:url(static/image/common/m_p_ps3.png)}body div[id$='_118_menu']:before{--bgimg:url(static/image/common/m_p_ps4.png)}body div[id$='_119_menu']:before{--bgimg:url(static/image/common/m_p_psv.png)}body div[id$='_170_menu']:before{--bgimg:url(static/image/common/m_p_wiiu.png)}body div[id$='_209_menu']:before{--bgimg:url(static/image/common/m_p_switch.png)}body div[id$='_227_menu']:before{--bgimg:url(static/image/common/m_p_3ds.png)}body div[id$='_56_menu']:before{--bgimg:url(static/image/common/m_g1.png)}body div[id$='_57_menu']:before{--bgimg:url(static/image/common/m_g2.png)}body div[id$='_61_menu']:before{--bgimg:url(static/image/common/m_p1.png)}body div[id$='_62_menu']:before{--bgimg:url(static/image/common/m_p2.png)}body div[id$='_63_menu']:before{--bgimg:url(static/image/common/m_p3.png)}body div[id$='_46_menu']:before{--bgimg:url(static/image/common/m_p4.png)}body div[id$='_64_menu']:before{--bgimg:url(static/image/common/m_p5.png)}body div[id$='_65_menu']:before{--bgimg:url(static/image/common/m_p6.png)}body div[id$='_66_menu']:before{--bgimg:url(static/image/common/m_p7.png)}body div[id$='_75_menu']:before{--bgimg:url(static/image/common/m_p8.png)}body div[id$='_85_menu']:before{--bgimg:url(static/image/common/m_p9.png)}body div[id$='_86_menu']:before{--bgimg:url(static/image/common/m_p10.png)}body div[id$='_100_menu']:before{--bgimg:url(static/image/common/m_p11.png)}body div[id$='_175_menu']:before{--bgimg:url(static/image/common/m_p12.png)}body div[id$='_182_menu']:before{--bgimg:url(static/image/common/m_p13.png)}body div[id$='_91_menu']:before{--bgimg:url(static/image/common/m_h1.png)}body div[id$='_93_menu']:before{--bgimg:url(static/image/common/m_h2.png)}body div[id$='_92_menu']:before{--bgimg:url(static/image/common/m_h3.png)}body div[id$='_94_menu']:before{--bgimg:url(static/image/common/m_h4.png)}body div[id$='_95_menu']:before{--bgimg:url(static/image/common/m_h5.png)}body div[id$='_96_menu']:before{--bgimg:url(static/image/common/m_h6.png)}body div[id$='_152_menu']:before{--bgimg:url(static/image/common/m_h7.png)}body div[id$='_183_menu']:before{--bgimg:url(static/image/common/m_h8.png)}body div[id$='_200_menu']:before{--bgimg:url(static/image/common/m_h9.png)}body div[id$='_210_menu']:before{--bgimg:url(static/image/common/m_h10.png)}body div[id$='_70_menu']:before{--bgimg:url(static/image/common/m_arena_v1.png)}body div[id$='_72_menu']:before{--bgimg:url(static/image/common/m_arena_v2.png)}body div[id$='_88_menu']:before{--bgimg:url(static/image/common/m_arena_v3.png)}body div[id$='_111_menu']:before{--bgimg:url(static/image/common/m_arena_v4.png)}body div[id$='_69_menu']:before{--bgimg:url(static/image/common/m_arena_w1.png)}body div[id$='_68_menu']:before{--bgimg:url(static/image/common/m_arena_w2.png)}body div[id$='_73_menu']:before{--bgimg:url(static/image/common/m_arena_w3.png)}body div[id$='_74_menu']:before{--bgimg:url(static/image/common/m_arena_w4.png)}body div[id$='_89_menu']:before{--bgimg:url(static/image/common/m_arena_w5.png)}body div[id$='_90_menu']:before{--bgimg:url(static/image/common/m_arena_w6.png)}body div[id$='_98_menu']:before{--bgimg:url(static/image/common/m_arena_w8.png)}body div[id$='_99_menu']:before{--bgimg:url(static/image/common/m_arena_w7.png)}body div[id$='_120_menu']:before{--bgimg:url(static/image/common/m_arena_v5.png)}body div[id$='_121_menu']:before{--bgimg:url(static/image/common/m_arena_w9.png)}body div[id$='_122_menu']:before{--bgimg:url(static/image/common/m_arena_w10.png)}body div[id$='_123_menu']:before{--bgimg:url(static/image/common/m_arena_i1.png)}body div[id$='_129_menu']:before{--bgimg:url(static/image/common/m_arena_v6.png)}body div[id$='_130_menu']:before{--bgimg:url(static/image/common/m_arena_w11.png)}body div[id$='_131_menu']:before{--bgimg:url(static/image/common/m_arena_w12.png)}body div[id$='_132_menu']:before{--bgimg:url(static/image/common/m_arena_i2.png)}body div[id$='_143_menu']:before{--bgimg:url(static/image/common/m_arena_v7.png)}body div[id$='_144_menu']:before{--bgimg:url(static/image/common/m_arena_v7f.png)}body div[id$='_145_menu']:before{--bgimg:url(static/image/common/m_arena_w13.png)}body div[id$='_146_menu']:before{--bgimg:url(static/image/common/m_arena_w14.png)}body div[id$='_164_menu']:before{--bgimg:url(static/image/common/m_arena_v8.png)}body div[id$='_165_menu']:before{--bgimg:url(static/image/common/m_arena_w15.png)}body div[id$='_166_menu']:before{--bgimg:url(static/image/common/m_arena_w16.png)}body div[id$='_176_menu']:before{--bgimg:url(static/image/common/m_arena_v9.png)}body div[id$='_177_menu']:before{--bgimg:url(static/image/common/m_arena_w17.png)}body div[id$='_178_menu']:before{--bgimg:url(static/image/common/m_arena_w18.png)}body div[id$='_184_menu']:before{--bgimg:url(static/image/common/m_arena_v10.png)}body div[id$='_185_menu']:before{--bgimg:url(static/image/common/m_arena_w19.png)}body div[id$='_186_menu']:before{--bgimg:url(static/image/common/m_arena_w20.png)}body div[id$='_204_menu']:before{--bgimg:url(static/image/common/m_arena_v11.png)}body div[id$='_205_menu']:before{--bgimg:url(static/image/common/m_arena_w21.png)}body div[id$='_206_menu']:before{--bgimg:url(static/image/common/m_arena_w22.png)}body div[id$='_211_menu']:before{--bgimg:url(static/image/common/m_arena_v12.png)}body div[id$='_212_menu']:before{--bgimg:url(static/image/common/m_arena_w23.png)}body div[id$='_213_menu']:before{--bgimg:url(static/image/common/m_arena_w24.png)}body div[id$='_224_menu']:before{--bgimg:url(static/image/common/m_arena_v13.png)}body div[id$='_225_menu']:before{--bgimg:url(static/image/common/m_arena_w25.png)}body div[id$='_226_menu']:before{--bgimg:url(static/image/common/m_arena_w26.png)}body div[id$='_237_menu']:before{--bgimg:url(static/image/common/m_arena14_1.png)}body div[id$='_238_menu']:before{--bgimg:url(static/image/common/m_arena14_2.png)}body div[id$='_239_menu']:before{--bgimg:url(static/image/common/m_arena14_3.png)}body div[id$='_136_menu']:before{--bgimg:url(static/image/common/m_s_v1.png)}body div[id$='_167_menu']:before{--bgimg:url(static/image/common/m_s_bili.png)}body div[id$='_174_menu']:before{--bgimg:url(static/image/common/m_s_v2.png)}body div[id$='_195_menu']:before{--bgimg:url(static/image/common/m_s_v3.png)}body div[id$='_218_menu']:before{--bgimg:url(static/image/common/m_s_bili2.png)}body div[id$='_240_menu']:before{--bgimg:url(static/image/common/m_s_v4.png)}body div[id$='_253_menu']:before{--bgimg:url(static/image/common/m_s_wiki.png)}body div[id$='_254_menu']:before{--bgimg:url(static/image/common/m_s_mcwiki.png)}body div[id$='_124_menu']:before{--bgimg:url(static/image/common/m_pearena_v1.png)}body div[id$='_125_menu']:before{--bgimg:url(static/image/common/m_pearena_w2.png)}body div[id$='_126_menu']:before{--bgimg:url(static/image/common/m_pearena_w1.png)}body div[id$='_133_menu']:before{--bgimg:url(static/image/common/m_pearena_v2.png)}body div[id$='_134_menu']:before{--bgimg:url(static/image/common/m_pearena_w4.png)}body div[id$='_135_menu']:before{--bgimg:url(static/image/common/m_pearena_w3.png)}body div[id$='_147_menu']:before{--bgimg:url(static/image/common/m_pearena_v3.png)}body div[id$='_148_menu']:before{--bgimg:url(static/image/common/m_pearena_w6.png)}body div[id$='_149_menu']:before{--bgimg:url(static/image/common/m_pearena_w5.png)}body div[id$='_161_menu']:before{--bgimg:url(static/image/common/m_pearena_v4.png)}body div[id$='_162_menu']:before{--bgimg:url(static/image/common/m_pearena_w8.png)}body div[id$='_163_menu']:before{--bgimg:url(static/image/common/m_pearena_w7.png)}body div[id$='_171_menu']:before{--bgimg:url(static/image/common/m_pearena_v5.png)}body div[id$='_172_menu']:before{--bgimg:url(static/image/common/m_pearena_w10.png)}body div[id$='_173_menu']:before{--bgimg:url(static/image/common/m_pearena_w9.png)}body div[id$='_190_menu']:before{--bgimg:url(static/image/common/m_pearena_w13.png)}body div[id$='_192_menu']:before{--bgimg:url(static/image/common/m_pearena_v6.png)}body div[id$='_193_menu']:before{--bgimg:url(static/image/common/m_pearena_w11.png)}body div[id$='_194_menu']:before{--bgimg:url(static/image/common/m_pearena_w12.png)}body div[id$='_201_menu']:before{--bgimg:url(static/image/common/m_pearena_v7.png)}body div[id$='_202_menu']:before{--bgimg:url(static/image/common/m_pearena_w16.png)}body div[id$='_203_menu']:before{--bgimg:url(static/image/common/m_pearena_w15.png)}body div[id$='_214_menu']:before{--bgimg:url(static/image/common/m_pearena_v8.png)}body div[id$='_215_menu']:before{--bgimg:url(static/image/common/m_pearena_w18.png)}body div[id$='_216_menu']:before{--bgimg:url(static/image/common/m_pearena_w17.png)}body div[id$='_221_menu']:before{--bgimg:url(static/image/common/m_pearena_v9.png)}body div[id$='_222_menu']:before{--bgimg:url(static/image/common/m_pearena_w20.png)}body div[id$='_223_menu']:before{--bgimg:url(static/image/common/m_pearena_w19.png)}body div[id$='_229_menu']:before{--bgimg:url(static/image/common/m_pearena_v10.png)}body div[id$='_230_menu']:before{--bgimg:url(static/image/common/m_pearena_w22.png)}body div[id$='_231_menu']:before{--bgimg:url(static/image/common/m_pearena_w21.png)}body div[id$='_241_menu']:before{--bgimg:url(static/image/common/m_pearena_v11.png)}body div[id$='_242_menu']:before{--bgimg:url(static/image/common/m_pearena_w24.png)}body div[id$='_243_menu']:before{--bgimg:url(static/image/common/m_pearena_w23.png)}body div[id$='_197_menu']:before{--bgimg:url(static/image/common/m_pofg_v1.png)}body div[id$='_198_menu']:before{--bgimg:url(static/image/common/m_pofg_v2.png)}body div[id$='_199_menu']:before{--bgimg:url(static/image/common/m_pofg_v3.png)}body div[id$='_137_menu']:before{--bgimg:url(static/image/common/m_g_cw.png)}body div[id$='_138_menu']:before{--bgimg:url(static/image/common/m_g_trp.png)}body div[id$='_139_menu']:before{--bgimg:url(static/image/common/m_g_tas.png)}body div[id$='_140_menu']:before{--bgimg:url(static/image/common/m_g_sc.png)}body div[id$='_142_menu']:before{--bgimg:url(static/image/common/m_g_sl.png)}body div[id$='_150_menu']:before{--bgimg:url(static/image/common/m_g_hayo.png)}body div[id$='_151_menu']:before{--bgimg:url(static/image/common/m_g_aa.png)}body div[id$='_153_menu']:before{--bgimg:url(static/image/common/m_g_is.png)}body div[id$='_154_menu']:before{--bgimg:url(static/image/common/m_g_cbl.png)}body div[id$='_168_menu']:before{--bgimg:url(static/image/common/m_g_ntl.png)}body div[id$='_169_menu']:before{--bgimg:url(static/image/common/m_g_tcp.png)}body div[id$='_179_menu']:before{--bgimg:url(static/image/common/m_g_mpw.png)}body div[id$='_207_menu']:before{--bgimg:url(static/image/common/m_g_ud.png)}body div[id$='_217_menu']:before{--bgimg:url(static/image/common/m_g_bs.png)}body div[id$='_219_menu']:before{--bgimg:url(static/image/common/m_g_pcd.png)}body div[id$='_220_menu']:before{--bgimg:url(static/image/common/m_g_gwnw.png)}body div[id$='_228_menu']:before{--bgimg:url(static/image/common/m_g_lw.png)}body div[id$='_232_menu']:before{--bgimg:url(static/image/common/m_g_uel.png)}body div[id$='_233_menu']:before{--bgimg:url(static/image/common/m_g_tgc.png)}body div[id$='_235_menu']:before{--bgimg:url(static/image/common/m_g_nf.png)}body div[id$='_236_menu']:before{--bgimg:url(static/image/common/m_g_mcbk.png)}body div[id$='_244_menu']:before{--bgimg:url(static/image/common/m_g_pos.png)}body div[id$='_245_menu']:before{--bgimg:url(static/image/common/m_g_stc.png)}body div[id$='_246_menu']:before{--bgimg:url(static/image/common/m_g_cps.png)}body div[id$='_248_menu']:before{--bgimg:url(static/image/common/m_g_wiki.png)}body div[id$='_249_menu']:before{--bgimg:url(static/image/common/m_g_rmg.png)}body div[id$='_252_menu']:before{--bgimg:url(static/image/common/m_g_tml.png)}@keyframes pickup{0%{-webkit-transform:matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);transform:matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)}50%{-webkit-transform:matrix3d(1, 0, 0, -0.002, 0, 1, 0, -0.002, 0, 0, 1, 0, 0, -1, 0, 0.92);transform:matrix3d(1, 0, 0, -0.002, 0, 1, 0, -0.002, 0, 0, 1, 0, 0, -1, 0, 0.92)}100%{-webkit-transform:matrix3d(1, 0, 0, 0, 0, 1, 0, -0.001, 0, 0, 1, 0, 0, -1.6, 0, 0.85);transform:matrix3d(1, 0, 0, 0, 0, 1, 0, -0.001, 0, 0, 1, 0, 0, -1.6, 0, 0.85)}}@keyframes dropdown{0%{-webkit-transform:matrix3d(1, 0, 0, 0, 0, 1, 0, -0.001, 0, 0, 1, 0, 0, -1.6, 0, 0.85);transform:matrix3d(1, 0, 0, 0, 0, 1, 0, -0.001, 0, 0, 1, 0, 0, -1.6, 0, 0.85)}50%{-webkit-transform:matrix3d(1, 0, 0, -0.001, 0, 1, 0, -0.002, 0, 0, 1, 0, 0, -1.1, 0, 0.92);transform:matrix3d(1, 0, 0, -0.001, 0, 1, 0, -0.002, 0, 0, 1, 0, 0, -1.1, 0, 0.92)}100%{-webkit-transform:matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);transform:matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)}}
`, 'medal');
            window.saltMCBBSCSS.setStyle(`#threadlist div.structItem[classified]{--backcolor:transparent;--backcolor-t1:transparent;--backcolor-t2:transparent;--backcolor-t3:transparent;background-image:-webkit-linear-gradient(90deg, var(--backcolor) 0%, var(--backcolor-t1) .2%, var(--backcolor-t2) .5%, var(--backcolor-t3) 45%, transparent 100%);background-image:linear-gradient(90deg, var(--backcolor) 0%, var(--backcolor-t1) .2%, var(--backcolor-t2) .5%, var(--backcolor-t3) 45%, transparent 100%)}#threadlist div.structItem[classified].digestpost{--backcolor:#0db1f2;--backcolor-t1:rgba(13,177,242,0.8);--backcolor-t2:rgba(13,177,242,0.08);--backcolor-t3:rgba(13,177,242,0)}#threadlist div.structItem[classified].reward{--backcolor:#f2690d;--backcolor-t1:rgba(242,105,13,0.8);--backcolor-t2:rgba(242,105,13,0.08);--backcolor-t3:rgba(242,105,13,0)}#threadlist div.structItem[classified].big-reward{--backcolor:#f20d93;--backcolor-t1:rgba(242,13,147,0.8);--backcolor-t2:rgba(242,13,147,0.08);--backcolor-t3:rgba(242,13,147,0)}#threadlist div.structItem[classified].great-reward{--backcolor:#f20dd3;--backcolor-t1:rgba(242,13,211,0.8);--backcolor-t2:rgba(242,13,211,0.08);--backcolor-t3:rgba(242,13,211,0)}#threadlist div.structItem[classified].solved{--backcolor:#0df2ad;--backcolor-t1:rgba(13,242,173,0.8);--backcolor-t2:rgba(13,242,173,0.08);--backcolor-t3:rgba(13,242,173,0)}#threadlist div.structItem[classified].locked{--backcolor:#333;--backcolor-t1:rgba(51,51,51,0.8);--backcolor-t2:rgba(51,51,51,0.08);--backcolor-t3:rgba(51,51,51,0)}#threadlist div.structItem[classified].top-1{--backcolor:#0dd7f2;--backcolor-t1:rgba(13,215,242,0.8);--backcolor-t2:rgba(13,215,242,0.08);--backcolor-t3:rgba(13,215,242,0)}#threadlist div.structItem[classified].top-2{--backcolor:#2196f3;--backcolor-t1:rgba(33,150,243,0.8);--backcolor-t2:rgba(33,150,243,0.08);--backcolor-t3:rgba(33,150,243,0)}#threadlist div.structItem[classified].top-3{--backcolor:#f28f0d;--backcolor-t1:rgba(242,143,13,0.8);--backcolor-t2:rgba(242,143,13,0.08);--backcolor-t3:rgba(242,143,13,0)}#threadlist div.structItem[classified].punitive-publicity{--backcolor:crimson;--backcolor-t1:rgba(220,20,60,0.8);--backcolor-t2:rgba(220,20,60,0.08);--backcolor-t3:rgba(220,20,60,0)}
`, 'threadClassify');
            this.moveTopBarToLeft = this.readWithDefault('SaltMoveTopBarToLeft', true);
            this.version();
            let ev = new CustomEvent('saltMCBBSload', {
                detail: { name: 'saltMCBBS', version: myversion },
            });
            console.time(myprefix + '初始化耗时');
            this.init();
            console.timeEnd(myprefix + '初始化耗时');
            this.docNearlyReady(() => {
                console.time(myprefix + '主模块耗时');
                this.movePageHead();
                this.warnOP();
                this.reasonListOP();
                this.medalOP();
                this.animationOP();
                this.leftPosterInfoOP();
                this.antiSniff();
                this.reportRememberOP();
                this.lazyLoadImgOP();
                this.imgProxyOP();
                this.threadClassifyOP();
                this.antiWaterOP();
                this.bugFixOP();
                this.confiectFixOP();
                autoRunLock = false;
                this.sortSetting();
                window.dispatchEvent(ev);
                console.timeEnd(myprefix + '主模块耗时');
            });
        }
        init() {
            let obj = this;
            window.saltMCBBSCSS.putStyle('', 'main');
            let isNight = this.readWithDefault('isNightStyle', false);
            this.nightStyle(isNight, false);
            let sp = this.settingPanel;
            sp.id = techprefix + 'settingPanel';
            sp.className = 'settingPanel';
            let settingPanelTitle = document.createElement('div');
            settingPanelTitle.innerHTML = `<h3 class="flb" style="width:100%;padding-right:0;"><em>SaltMCBBS ${myversion} 设置面板</em>
            <span style="float:right">
            <a class="sslct_btn" onclick="extstyle('./template/mcbbs/style/winter')" title="冬季"><i style="background:#4d82ff"></i></a>
            <a class="sslct_btn" onclick="extstyle('./template/mcbbs/style/default')" title="经典"><i style="background:#70ba5e"></i></a>
            <a class="sslct_btn" onclick="extstyle('./template/mcbbs/style/nether')" title="下界"><i style="background:#ae210f"></i></a>
            <a href="javascript:;" onclick="window.saltMCBBSConsole.showConsolePanel()" title="你也可以使用 Ctrl+\` 快捷键">打开控制台</a>
            <a href="javascript:;" onclick="window.saltMCBBS.toggleNightStyle()" title="点击切换夜间/正常模式">切换夜间模式</a>
            <a href="https://github.com/Salt-lovely/saltMCBBS/releases" target="_blank" title="前往GitHub下载最新版">更新SaltMCBBS</a>
            <a href="javascript:;" class="flbc" onclick="saltMCBBS.hideSettingPanel()" title="关闭">关闭</a>
            </span></h3>`;
            this.addSetting(settingPanelTitle, techprefix + 'settingPanelTitle');
            this.hideSettingPanel();
            document.body.prepend(sp);
            this.addTextareaSetting('昼间模式下的背景图片 <small>一行一个, 填写超链接(URL)，随机选择，开头添加“//”暂时禁用这个图片</small>', this.readWithDefault('dayBackgroundImage', []).join('\n'), (el) => {
                obj.write('dayBackgroundImage', obj.formatToStringArray(el.value));
                obj.updateBackground();
            }, '昼间模式下的背景图片', 210);
            this.addTextareaSetting('夜间模式下的背景图片 <small>一行一个, 填写超链接(URL)，随机选择，开头添加“//”暂时禁用这个图片</small>', this.readWithDefault('nightBackgroundImage', []).join('\n'), (el) => {
                obj.write('nightBackgroundImage', obj.formatToStringArray(el.value));
                obj.updateBackground();
            }, '夜间模式下的背景图片', 211);
            let opacity = this.readWithDefault('mcmapwpOpacity', 0.5);
            let commonOpacity = this.readWithDefault('mcmapwpCommonOpacity', 0.9);
            document.body.style.setProperty('--mcmapwpOpacity', opacity + '');
            document.body.style.setProperty('--mcmapwpCommonOpacity', commonOpacity + '');
            this.addRangeSetting('主体部分的透明度<small> 有自定义背景图片、鼠标在页面外时，主体部分的透明度，当前不透明度: ' +
                opacity +
                '</small>', opacity, [0, 1, 0.05], (vl, ev) => {
                this.write('mcmapwpOpacity', vl);
                this.changeSettingH3('主体部分的透明度', '主体部分的透明度<small> 有自定义背景图片、鼠标在页面外时，主体部分的透明度，当前不透明度: ' +
                    vl +
                    '</small>');
                document.body.style.setProperty('--mcmapwpOpacity', vl + '');
            }, '主体部分的透明度', 212);
            this.addSetting({
                type: 'range',
                title: '主体部分的基础透明度',
                subtitle: '有自定义背景图片、鼠标在页面内时，主体部分的透明度，当前不透明度: ' +
                    commonOpacity,
                range: [0, 1, 0.05],
                value: commonOpacity,
                callback: (vl, ev) => {
                    this.write('mcmapwpCommonOpacity', vl);
                    this.changeSettingH3('主体部分的基础透明度', '主体部分的基础透明度<small> 有自定义背景图片、鼠标在页面内时，主体部分的透明度，当前不透明度: ' +
                        vl +
                        '</small>');
                    document.body.style.setProperty('--mcmapwpCommonOpacity', vl + '');
                },
                name: '主体部分的基础透明度',
                priority: 213,
            });
            this.updateBackground();
            initCSSOP();
            setTimeout(afunc, 0);
            function initCSSOP() {
                if (obj.moveTopBarToLeft) {
                    window.saltMCBBSCSS.putStyle('#toptb{opacity:0}');
                }
                else {
                    window.saltMCBBSCSS.putStyle('body>.mc_map_wp{margin-top:50px;}#e_controls[style*="fixed"]{top:47px !important;}');
                }
                let signHeight = obj.readWithDefault('signBarHeight', 200);
                obj.addSetting({
                    type: 'input',
                    title: '签名栏高度控制',
                    subtitle: '单位像素，小于0禁用此功能，设为0屏蔽签名栏',
                    text: signHeight + '',
                    callback: (el, ev) => {
                        let n = parseInt(el.value);
                        if (isNaN(n))
                            return;
                        signBarHeightControl(n);
                        obj.write('signBarHeight', n);
                    },
                    priority: 62,
                });
                signBarHeightControl(signHeight);
                function signBarHeightControl(h) {
                    if (h < 0)
                        window.saltMCBBSCSS.delStyle('signBarHeight');
                    else if (h > 0)
                        window.saltMCBBSCSS.putStyle(`
/**/
.plhin .sign{max-height:${h}px !important;overflow-y:auto;transition:max-height .3s ease;}
`, 'signBarHeight');
                    else if (h == 0) {
                        window.saltMCBBSCSS.putStyle(`
/**/
.plhin .sign{display:none}
`, 'signBarHeight');
                    }
                }
                let showLOGO = obj.readWithDefault('showMCBBSLogo', true), showRightTopAd = obj.readWithDefault('showRightTopAd', true);
                let showTopObjectsCSSKey = 'showTopObjectsCSSKey';
                showTopObjects(showLOGO, showRightTopAd);
                obj.addSetting({
                    type: 'check',
                    title: '显示MCBBS的LOGO',
                    subtitle: '显示页面顶部的MCBBS LOGO',
                    checked: showLOGO,
                    callback: (ck, ev) => {
                        showLOGO = ck;
                        obj.write('showMCBBSLogo', ck);
                        showTopObjects(showLOGO, showRightTopAd);
                    },
                    priority: 10,
                });
                obj.addSetting({
                    type: 'check',
                    title: '显示右上角广告栏',
                    subtitle: '显示页面顶部右上角的广告栏',
                    checked: showRightTopAd,
                    callback: (ck, ev) => {
                        showRightTopAd = ck;
                        obj.write('showRightTopAd', ck);
                        showTopObjects(showLOGO, showRightTopAd);
                    },
                    priority: 11,
                });
                function showTopObjects(logo, ad) {
                    let css = '/*显示/隐藏顶部LOGO的css*/';
                    if (!logo && !ad) {
                        css += '.new_wp .hdc{display:none;}';
                    }
                    else if (!logo) {
                        css += '.new_wp .hdc h2{display:none;}';
                    }
                    else if (!ad) {
                        css += '.new_wp .hdc #um + .y{display:none;}';
                    }
                    window.saltMCBBSCSS.putStyle(css, showTopObjectsCSSKey);
                }
                let isUserInfoSticky = obj.readWithDefault('userInfoSticky', true);
                window.saltMCBBSCSS.setStyle(`
                .p-body-main .bm,
                .plhin td.pls{
                    overflow: visible;
                }
                .plhin td.pls > div.favatar{
                    position: sticky;
                    top: ${obj.moveTopBarToLeft ? '0' : '50px'};
                }
                div.tip[id^="g_up"] {
                    left: 20px !important;
                    top: 160px !important;
                }`, 'userInfoSticky');
                userInfoSticky(isUserInfoSticky);
                obj.addSetting({
                    type: 'check',
                    title: '层主信息栏跟随页面',
                    subtitle: '帖子页面左侧层主信息跟随页面滚动',
                    checked: isUserInfoSticky,
                    callback: (ck, ev) => {
                        obj.write('userInfoSticky', ck);
                        userInfoSticky(ck);
                    },
                    name: '左侧用户信息跟随',
                    priority: 22,
                });
                function userInfoSticky(b) {
                    if (b)
                        window.saltMCBBSCSS.putStyle('', 'userInfoSticky');
                    else
                        window.saltMCBBSCSS.delStyle('userInfoSticky');
                }
            }
            function afunc() {
                var _a;
                let s = (_a = getComputedStyle(document.documentElement).fontSize) !== null && _a !== void 0 ? _a : '14';
                let fs = parseInt(s);
                if (!isNaN(fs))
                    obj.rootFontSize = fs;
            }
        }
        movePageHead() {
            var _a;
            this.assert(autoRunLock, '不在页面初始运行状态');
            let obj = this;
            let enableSaltMoveTopBarToLeft = this.moveTopBarToLeft;
            this.addCheckSetting('顶栏移动到页面左侧<br><small>使用左侧栏代替顶栏的功能</small>', enableSaltMoveTopBarToLeft, (ck, ev) => {
                this.write('SaltMoveTopBarToLeft', ck);
                this.message('"顶栏移动到页面左侧"配置项需要刷新生效<br>点击刷新', () => {
                    location.reload();
                }, 3);
            }, '顶栏移动到页面左侧', 5);
            if (!enableSaltMoveTopBarToLeft) {
                window.saltMCBBSCSS.delStyle('pagehead');
                (_a = document
                    .querySelector('#user_info_menu')) === null || _a === void 0 ? void 0 : _a.appendChild(this.links);
                this.addSideBarLink('切换夜间模式', () => {
                    obj.toggleNightStyle();
                });
                this.addSideBarLink('SaltMCBBS 设置', () => {
                    obj.showSettingPanel();
                });
                this.links.className = 'linksStillOnTopBar';
                return;
            }
            let leftdiv = document.createElement('div');
            leftdiv.id = 'saltNewPageHead';
            let userinfo = document.createElement('div');
            let links = this.links;
            let addons = document.createElement('div');
            let headlinks = document.querySelectorAll('#toptb .z a');
            this.addChildren(links, headlinks);
            this.addSideBarLink('切换夜间模式', () => {
                obj.toggleNightStyle();
            });
            this.addSideBarLink('SaltMCBBS 设置', () => {
                obj.showSettingPanel();
            });
            links.className = 'links';
            let myaddon = [
                {
                    text: '签到',
                    url: 'plugin.php?id=dc_signin',
                    img: 'https://patchwiki.biligame.com/images/mc/3/3f/23qf12ycegf4vgfbj7gehffrur6snkv.png',
                },
                {
                    text: '任务',
                    url: 'home.php?mod=task',
                    img: 'https://patchwiki.biligame.com/images/mc/9/98/kbezikk5l83s2l2ewht1mhr8fltn0dv.png',
                },
                {
                    text: '消息',
                    url: 'home.php?mod=space&do=notice&view=mypost',
                    class: 'saltmessage',
                    img: noticimgurl[0],
                },
                {
                    text: '好友',
                    url: 'home.php?mod=space&do=friend',
                    img: 'https://www.mcbbs.net/template/mcbbs/image/friends.png',
                },
                {
                    text: '勋章',
                    url: 'home.php?mod=medal',
                    img: 'https://patchwiki.biligame.com/images/mc/2/26/85hl535hwws6snk4dt430lh3k7nyknr.png',
                },
                {
                    text: '道具',
                    url: 'home.php?mod=magic',
                    img: 'https://www.mcbbs.net/template/mcbbs/image/tools.png',
                },
                {
                    text: '收藏',
                    url: 'home.php?mod=space&do=favorite&view=me',
                    img: 'https://patchwiki.biligame.com/images/mc/d/dd/hnrqjfj0x2wl46284js23m26fgl3q8l.png',
                },
                {
                    text: '挖矿',
                    url: 'plugin.php?id=mcbbs_lucky_card:prize_pool',
                    img: 'https://www.mcbbs.net/source/plugin/mcbbs_lucky_card/magic/magic_lucky_card.gif',
                },
                {
                    text: '宣传',
                    url: 'plugin.php?id=mcbbs_ad:ad_manage',
                    img: 'https://patchwiki.biligame.com/images/mc/4/43/pfmuw066q7ugi0wv4eyfjbeu3sxd3a4.png',
                },
                {
                    text: '设置',
                    url: 'home.php?mod=spacecp',
                    title: 'SaltMCBBS设置在下面',
                    img: 'https://patchwiki.biligame.com/images/mc/9/90/dr8rvwsbxfgr79liq91icuxkj6nprve.png',
                },
            ];
            this.addChildren(addons, this.obj2a(myaddon));
            addons.className = 'addons';
            movePageHeadGetUserInfo(userinfo);
            userinfo.className = 'userinfo';
            leftdiv.appendChild(userinfo);
            let searchbox = document.querySelector('.cl.y_search');
            if (searchbox instanceof HTMLElement) {
                leftdiv.appendChild(searchbox);
            }
            let searchtype = document.querySelector('#scbar_type_menu');
            if (searchtype instanceof HTMLElement) {
                leftdiv.appendChild(searchtype);
                if (searchbox instanceof HTMLElement) {
                    searchtype.style.setProperty('--top', Math.floor(Math.max(searchbox.offsetTop, 200) + 25) +
                        'px');
                }
            }
            let searchboxn = document.querySelector('.uix_searchBar');
            if (searchboxn instanceof HTMLElement) {
                leftdiv.appendChild(searchboxn);
            }
            leftdiv.appendChild(addons);
            leftdiv.appendChild(links);
            leftdiv.addEventListener('dblclick', () => {
                obj.toggleNightStyle();
            });
            document.body.appendChild(leftdiv);
            window.saltMCBBSCSS.putStyle('', 'pagehead');
            function movePageHeadGetUserInfo(el) {
                let uid = obj.getUID();
                if (uid < 1) {
                    return;
                }
                obj.fetchUID(uid, (data) => {
                    var _a, _b;
                    let variable = data.Variables;
                    let space = variable.space;
                    let creaitex = variable.extcredits;
                    obj.messageOp(variable.notice);
                    let credits = space.credits;
                    let post = space.posts;
                    let thread = space.threads;
                    let digestpost = space.digestposts;
                    let extcredits = [
                        '0',
                        space.extcredits1,
                        space.extcredits2,
                        space.extcredits3,
                        space.extcredits4,
                        space.extcredits5,
                        space.extcredits6,
                        space.extcredits7,
                        space.extcredits8,
                    ];
                    let uid = space.uid;
                    let uname = (_a = space.username) !== null && _a !== void 0 ? _a : '';
                    let group = space.group;
                    let lowc = parseInt(group.creditslower), highc = parseInt(group.creditshigher);
                    let grouptitle = (_b = space.group.grouptitle) !== null && _b !== void 0 ? _b : '';
                    let progress = Math.round(((parseInt(credits) - highc) / (lowc - highc)) *
                        10000) / 100;
                    let progresstitle = highc +
                        ' -> ' +
                        lowc +
                        ' | 还需: ' +
                        (lowc - parseInt(credits)) +
                        ' | 进度: ' +
                        progress +
                        '%';
                    el.innerHTML = `
<div class="username">
<a href="https://www.mcbbs.net/?${uid}">${uname}</a>
<div>${space.customstatus}</div>
<img id="settingsaltMCBBS" src="https://www.mcbbs.net/uc_server/data/avatar/${uidFormat(uid)}_avatar_middle.jpg" width=100 />
</div>
<div class="thread">
<a href="https://www.mcbbs.net/forum.php?mod=guide&view=my&type=reply" target="_blank">回帖数: ${post}</a>
<a href="https://www.mcbbs.net/forum.php?mod=guide&view=my" target="_blank">主题数: ${thread}</a>
<span>精华帖: ${digestpost}</span>
</div>
<span class="progress" tooltip="${progresstitle}"><span style="width:${progress}%">&nbsp;</span></span>
<div class="credit">
<span><a href="https://www.mcbbs.net/home.php?mod=spacecp&ac=credit" target="_self">总积分: ${credits}</a></span>
<span><a href="https://www.mcbbs.net/home.php?mod=spacecp&ac=usergroup" target="_self">${grouptitle}</a></span>
<span>${creaitex[1].img}${creaitex[1].title}: ${extcredits[1] + creaitex[1].unit}</span>
<span>${creaitex[2].img}${creaitex[2].title}: ${extcredits[2] + creaitex[2].unit}</span>
<span>${creaitex[3].img}${creaitex[3].title}: ${extcredits[3] + creaitex[3].unit}</span>
<span>${creaitex[4].img}${creaitex[4].title}: ${extcredits[4] + creaitex[4].unit}</span>
<span>${creaitex[5].img}${creaitex[5].title}: ${extcredits[5] + creaitex[5].unit}</span>
<span>${creaitex[6].img}${creaitex[6].title}: ${extcredits[6] + creaitex[6].unit}</span>
<span>${creaitex[7].img}${creaitex[7].title}: ${extcredits[7] + creaitex[7].unit}</span>
<span>${creaitex[8].img}${creaitex[8].title}: ${extcredits[8] + creaitex[8].unit}</span>
</div>
`;
                    function uidFormat(uid) {
                        let u = uid + '';
                        while (u.length < 9)
                            u = '0' + u;
                        return (u.slice(0, 3) +
                            '/' +
                            u.slice(3, 5) +
                            '/' +
                            u.slice(5, 7) +
                            '/' +
                            u.slice(7, 9));
                    }
                });
            }
        }
        messageOp(notice) {
            const urlList = [
                'https://www.mcbbs.net/home.php?mod=space&do=notice&view=mypost',
                'https://www.mcbbs.net/home.php?mod=space&do=pm',
                'https://www.mcbbs.net/home.php?mod=space&do=notice&view=system',
                'https://www.mcbbs.net/home.php?mod=space&do=notice&view=mypost',
            ];
            let xx = document.querySelector('#saltNewPageHead .addons a.saltmessage');
            if (!xx) {
                return;
            }
            let msg = [
                parseInt(notice.newmypost),
                parseInt(notice.newpm),
                parseInt(notice.newprompt),
                parseInt(notice.newpush),
            ], sum = 0;
            for (var i in msg) {
                let temp = msg[i];
                sum += temp;
                if (temp > 0)
                    xx.setAttribute('href', urlList[i]);
            }
            if (sum > 6) {
                sum = 6;
            }
            if (sum > 0) {
                xx.setAttribute('title', `新回复: ${msg[0]} | 新私信: ${msg[1]} | 新通知: ${msg[2]} | 新推送: ${msg[3]}`);
            }
            let img = document.querySelector('#saltNewPageHead .addons a.saltmessage img');
            if (img) {
                img.setAttribute('src', noticimgurl[sum]);
            }
        }
        warnOP() {
            this.assert(autoRunLock, '不在页面初始运行状态');
            let obj = this;
            let warnPostOpacity = this.readWithDefault('warnedPostOpacity', true);
            warnedPostOpacity();
            this.addSetting({
                type: 'check',
                title: '透明显示被警告的帖子',
                subtitle: '关闭并不影响其他功能检测被制裁的帖子',
                checked: warnPostOpacity,
                callback: (ck) => {
                    warnPostOpacity = ck;
                    warnedPostOpacity();
                    this.write('warnedPostOpacity', ck);
                },
                name: '透明显示被警告的帖子',
                priority: 42,
            });
            this.saltQuery('#postlist .plhin:not([warnOP])', (i, el) => {
                var _a, _b, _c;
                if (el.querySelector('.plc .pi a[title*="受到警告"]')) {
                    if (el.parentElement) {
                        el.parentElement.classList.add('warned');
                    }
                    else {
                        el.classList.add('warned');
                    }
                }
                else {
                    for (let td of Array.from(el.querySelectorAll('.rate td.xg1,.rate td.xw1'))) {
                        if (((_a = td.textContent) === null || _a === void 0 ? void 0 : _a.indexOf('人气 -')) == 0 ||
                            td.textContent == '-10' ||
                            td.textContent == '-5' ||
                            td.textContent == '-15' ||
                            td.textContent == '-20') {
                            if (el.parentElement) {
                                el.parentElement.classList.add('warned');
                            }
                            else {
                                el.classList.add('warned');
                            }
                        }
                    }
                }
                let uid = '0';
                let uname = el.querySelector('.authi .xw1');
                if (uname) {
                    uid = ((_c = /uid=(\d+)/.exec((_b = uname.getAttribute('href')) !== null && _b !== void 0 ? _b : '')) !== null && _c !== void 0 ? _c : ['', '0'])[1];
                }
                if (uid != '0') {
                    let a = el.querySelector('.favatar ul.xl');
                    if (!a) {
                        a = document.createElement('ul');
                        a.className = 'xl xl2 o cl';
                        let f = el.querySelector('.pls.favatar');
                        if (f) {
                            f.appendChild(a);
                        }
                    }
                    let li = document.createElement('li');
                    li.className = 'pmwarn';
                    li.appendChild(addWarnBtn(uid));
                    a.appendChild(li);
                }
                el.setAttribute('warnOP', '');
            });
            this.saltQuery('#uhd:not([warnOP])', (i, el) => {
                var _a, _b;
                let uid = obj.getUID() + '';
                let uname = el.querySelector('.h .avt a');
                if (uname) {
                    console.log(uname);
                    uid = ((_b = /uid=(\d+)/.exec((_a = uname.getAttribute('href')) !== null && _a !== void 0 ? _a : '')) !== null && _b !== void 0 ? _b : ['', '0'])[1];
                }
                let h = el.querySelector('.h');
                let a = el.querySelector('.h .mn ul');
                let li = document.createElement('li');
                li.className = 'pmwarn';
                li.appendChild(addWarnBtn(uid));
                if (a) {
                    a.appendChild(li);
                }
                else {
                    let div = document.createElement('div');
                    div.className = 'mn';
                    let ul = document.createElement('ul');
                    ul.appendChild(li);
                    div.appendChild(ul);
                    (h !== null && h !== void 0 ? h : el).appendChild(div);
                }
                el.setAttribute('warnOP', '');
            });
            function addWarnBtn(uid, text = '查看警告记录') {
                let a = document.createElement('a');
                a.href =
                    'forum.php?mod=misc&action=viewwarning&tid=19&uid=' + uid;
                a.title = text;
                a.textContent = text;
                a.className = 'xi2';
                a.setAttribute('onclick', "showWindow('viewwarning', this.href)");
                return a;
            }
            function warnedPostOpacity() {
                if (warnPostOpacity) {
                    window.saltMCBBSCSS.putStyle(`
/**/
.warned { opacity: 0.2;transition: 0.3s ease; }
.warned:hover { opacity: 0.9; }
`, 'warnedPostOpacity');
                }
                else {
                    window.saltMCBBSCSS.delStyle('warnedPostOpacity');
                }
            }
        }
        reasonListOP() {
            this.assert(autoRunLock, '不在页面初始运行状态');
            this.saltObserver('append_parent', () => {
                let rateUl = document.querySelector('.reasonselect:not([done])');
                if (rateUl) {
                    let rateReasonList = this.cleanStringArray(this.readWithDefault('rateReasonList', []));
                    rateUl.setAttribute('done', '');
                    for (let rea of rateReasonList) {
                        let li = document.createElement('li');
                        li.textContent = rea;
                        li.onmouseover = function () {
                            li.className = 'xi2 cur1';
                        };
                        li.onmouseout = function () {
                            li.className = '';
                        };
                        li.onclick = function () {
                            var _a;
                            let r = document.getElementById('reason');
                            if (r instanceof HTMLInputElement) {
                                r.value = (_a = li.textContent) !== null && _a !== void 0 ? _a : '';
                            }
                        };
                        rateUl.appendChild(li);
                    }
                }
                let reportUl = document.querySelector('#report_reasons:not([done])');
                if (reportUl) {
                    let reportReasonList = this.cleanStringArray(this.readWithDefault('reportReasonList', []));
                    reportUl.setAttribute('done', '');
                    let qita = reportUl.querySelector('input[value="其他"]');
                    let qitaP = null;
                    let qitabr = null;
                    if (qita) {
                        qitaP = qita.parentElement;
                        if (qitaP) {
                            qitabr = qitaP.nextElementSibling;
                        }
                    }
                    for (let rea of reportReasonList) {
                        let br = document.createElement('br');
                        let label = document.createElement('label');
                        label.innerHTML = `<input type="radio" name="report_select" class="pr" onclick="$('report_other').style.display='none';$('report_msg').style.display='none';$('report_message').value='${rea}'" value="${rea}"> ${rea}`;
                        reportUl.appendChild(label);
                        reportUl.appendChild(br);
                    }
                    if (qitaP) {
                        reportUl.appendChild(qitaP);
                    }
                    if (qitabr) {
                        reportUl.appendChild(qitabr);
                    }
                }
            });
            let rateReasonList = this.readWithDefault('rateReasonList', []);
            this.addTextareaSetting('自定义评分理由<small> 评分时可供选择的理由，一行一个，开头添加“//”暂时禁用</small>', rateReasonList.join('\n'), (el, e) => {
                this.write('rateReasonList', this.formatToStringArray(el.value));
            }, '自定义评分理由', 101);
            let reportReasonList = this.readWithDefault('reportReasonList', []);
            this.addTextareaSetting('自定义举报理由<small> 举报时可供选择的理由，一行一个，开头添加“//”暂时禁用</small>', reportReasonList.join('\n'), (el, e) => {
                this.write('reportReasonList', this.formatToStringArray(el.value));
            }, '自定义举报理由', 102);
        }
        medalOP() {
            this.assert(autoRunLock, '不在页面初始运行状态');
            let obj = this;
            let enable = this.readWithDefault('saltMedalFunction', true);
            let blur = this.readWithDefault('saltMedalBlur', true);
            window.saltMCBBSCSS.setStyle('div.tip[id$="_menu"]:before{image-rendering:auto;filter:blur(3px)}', 'saltMedalBlurCSS');
            this.addCheckSetting('启用勋章栏功能<br><small> 特别的勋章样式(会被MCBBS Extender覆盖)</small>', enable, (ck, ev) => {
                this.write('saltMedalFunction', ck);
                enable = ck;
                if (enable) {
                    window.saltMCBBSCSS.putStyle('', 'medal');
                    setTimeout(sub, 500);
                }
                else {
                    window.saltMCBBSCSS.delStyle('medal');
                }
            }, '启用勋章栏功能', 50);
            this.addCheckSetting('勋章大图高斯模糊<br><small>不再使用默认的等比放大</small>', blur, (ck, ev) => {
                this.write('saltMedalBlur', ck);
                if (ck) {
                    window.saltMCBBSCSS.putStyle('', 'saltMedalBlurCSS');
                }
                else {
                    window.saltMCBBSCSS.delStyle('saltMedalBlurCSS');
                }
            }, '勋章大图高斯模糊', 51);
            this.addInputSetting('勋章栏高度<br><small> 64像素/行, 可以输入小数(会被MCBBS Extender覆盖)</small>', this.readWithDefault('medalLine', 3) + '', (el, e) => {
                let line = parseFloat(el.value);
                if (isNaN(line)) {
                    return;
                }
                if (line < 0.5) {
                    line = 0.5;
                }
                if (line > 25) {
                    line = 25;
                }
                this.write('medalLine', line);
                if (enable) {
                    sub();
                }
                else {
                    this.message('使用勋章栏高度控制功能前，需要先启用勋章栏功能', (f) => {
                        f();
                    }, 3);
                }
            }, '勋章栏高度', 52);
            if (enable) {
                window.saltMCBBSCSS.putStyle('', 'medal');
                setTimeout(sub, 0);
            }
            if (blur) {
                window.saltMCBBSCSS.putStyle('', 'saltMedalBlurCSS');
            }
            this.saltObserver('postlist', () => {
                if (document.querySelector('p.md_ctrl:not([saltMedalFunction-checked])')) {
                    sub();
                }
            });
            function sub() {
                let line = obj.readWithDefault('medalLine', 2.5);
                let style = 'p.md_ctrl,p.md_ctrl:hover{--maxHeight:calc(64px * ' +
                    line +
                    ');}';
                window.saltMCBBSCSS.putStyle(style, 'medalLine');
                addBtn();
                heightCheck();
                setTimeout(() => {
                    addBtn();
                    heightCheck();
                }, 500);
                function heightCheck() {
                    obj.saltQuery('p.md_ctrl', (i, el) => {
                        if (!(el instanceof HTMLElement)) {
                            return;
                        }
                        if (el.scrollHeight > el.offsetHeight + 3) {
                            el.addClass('expandable');
                        }
                        else {
                            el.removeClass('expandable');
                        }
                    });
                }
                function addBtn() {
                    obj.saltQuery('p.md_ctrl:not([saltMedalFunction-checked])', (i, el) => {
                        if (!(el instanceof HTMLElement)) {
                            return;
                        }
                        el.setAttribute('saltMedalFunction-checked', '');
                        let img = el.querySelectorAll('a img');
                        if (img.length < 1) {
                            return;
                        }
                        let a = el.querySelector('a');
                        if (!a) {
                            return;
                        }
                        el.style.setProperty('--expandHeight', a.offsetHeight + 96 + 'px');
                        let div = document.createElement('div');
                        div.addClass('saltExpandHandler');
                        div.addEventListener('click', () => {
                            el.toggleClass('salt-expand');
                        });
                        el.appendChild(div);
                    });
                }
            }
        }
        antiSniff() {
            let enable = this.readWithDefault('saltAntiSniff', true), tellme = this.readWithDefault('saltAntiSniffRecat', true);
            let obj = this;
            let pages = new Set();
            this.addCheckSetting('反嗅探措施<br><small>屏蔽一些坛友的部分探针</small>', enable, (ck, ev) => {
                this.write('saltAntiSniff', ck);
                if (ck)
                    sub();
            }, '反嗅探措施', 31);
            this.addCheckSetting('处理探针后是否通知<br><small>右下角的提示可能会有点烦人</small>', tellme, (ck, ev) => {
                this.write('saltAntiSniffRecat', ck);
                tellme = ck;
            }, '处理探针后是否通知', 32);
            if (enable)
                sub();
            function sub() {
                return __awaiter(this, void 0, void 0, function* () {
                    obj.saltQuery('img:not([saltAntiSniff-check-done])', (i, el) => {
                        var _a, _b, _c, _d;
                        if (el instanceof HTMLImageElement) {
                            el.setAttribute('saltAntiSniff-check-done', '');
                            if (el.hasAttribute('src')) {
                                if (el.src.indexOf('home.php?') != -1 &&
                                    !/(\&additional\=removevlog|mod\=task\&do\=apply)(\&|$)/.test(el.src)) {
                                    if (tellme)
                                        obj.message('侦测到<img>探针: <br>' +
                                            el.src +
                                            '<br>类型: Discuz!访客探针', (f) => {
                                            f();
                                        });
                                    console.log(el);
                                    if (!pages.has(el.src)) {
                                        pages.add(el.src);
                                        setTimeout(() => {
                                            el.src += '&additional=removevlog';
                                        }, 50);
                                    }
                                }
                            }
                            if (el.hasAttribute('file')) {
                                if (((_a = el.getAttribute('file')) !== null && _a !== void 0 ? _a : '').indexOf('home.php?') != -1 &&
                                    !/\&additional\=removevlog(\&|$)/.test((_b = el.getAttribute('file')) !== null && _b !== void 0 ? _b : '')) {
                                    if (tellme)
                                        obj.message('侦测到<img>探针: <br>' +
                                            ((_c = el.getAttribute('file')) !== null && _c !== void 0 ? _c : '') +
                                            '<br>类型: Discuz!访客探针', (f) => {
                                            f();
                                        });
                                    console.log(el);
                                    el.setAttribute('file', ((_d = el.getAttribute('file')) !== null && _d !== void 0 ? _d : '') +
                                        '&additional=removevlog');
                                }
                            }
                        }
                    });
                    obj.saltQuery('a.notabs:not([saltAntiSniff-check-done])', (i, el) => {
                        if (el instanceof HTMLAnchorElement &&
                            el.hasAttribute('href')) {
                            el.setAttribute('saltAntiSniff-check-done', '');
                            el.addEventListener('mouseout', () => {
                                obj.log('已处理访客探针: ' + el.href);
                                fetch(el.href +
                                    '&view=admin&additional=removevlog');
                            });
                        }
                    });
                });
            }
        }
        reportRememberOP() {
            this.assert(autoRunLock, '不在页面初始运行状态');
            let obj = this;
            let saveKey = 'saltReportRemember';
            let numSaveKey = 'saltReportRememberLength';
            main();
            function main() {
                return __awaiter(this, void 0, void 0, function* () {
                    if (obj.getUID() < 1) {
                        obj.message('未检测到UID<br>点击重试 <a href="https://www.mcbbs.net/member.php?mod=logging&action=login">点击登录</a> <a href="https://www.mcbbs.net/bilibili_connect.php?mod=auth&op=login">B站登录</a>', (f) => {
                            f();
                            main();
                        });
                        return;
                    }
                    saveKey += '-' + obj.getUID();
                    yield obj.dataBaseHandler.waitForReady();
                    yield update();
                    check();
                    obj.addSetting({
                        type: 'input',
                        title: '帖子举报历史记录长度',
                        subtitle: '建议在4w以内, 设为 0 关闭此功能',
                        text: '' + obj.readWithDefault(numSaveKey, 1024),
                        callback: (el, ev) => {
                            let len = parseInt(el.value);
                            if (isNaN(len)) {
                                return;
                            }
                            if (len < 0) {
                                len = 0;
                            }
                            if (len > 1048576) {
                                len = 1048576;
                            }
                            obj.write(numSaveKey, len);
                        },
                        name: '举报记录功能',
                        priority: 61,
                    });
                    let obs = obj.saltObserver('append_parent', () => {
                        var _a, _b;
                        let reportBtn = document.querySelector('#report_submit[fwin]:not([done])');
                        if (reportBtn) {
                            reportBtn.setAttribute('done', '');
                            let pid = ((_b = ((_a = reportBtn.getAttribute('fwin')) !== null && _a !== void 0 ? _a : '0').match(/\d+/)) !== null && _b !== void 0 ? _b : ['0'])[0];
                            if (pid != '0') {
                                reportBtn.addEventListener('click', () => {
                                    obj.log('检测到举报: pid-' + pid);
                                    push(pid);
                                });
                            }
                        }
                    });
                });
            }
            function push(pid) {
                return __awaiter(this, void 0, void 0, function* () {
                    if (typeof pid == 'string') {
                        pid = parseInt(pid);
                        if (isNaN(pid) || pid < 1) {
                            return;
                        }
                    }
                    else if (typeof pid == 'number') {
                        if (pid < 1) {
                            return;
                        }
                    }
                    else if (typeof pid == 'bigint') {
                        if (pid < 1) {
                            return;
                        }
                    }
                    let pidList = yield obj.dataBaseHandler.read(saveKey, []);
                    pidList.push(pid);
                    yield obj.dataBaseHandler.write(saveKey, pidList);
                    obj.log('已记录举报: pid-' + pid);
                    check();
                });
            }
            function check() {
                var _a, _b, _c, _d;
                return __awaiter(this, void 0, void 0, function* () {
                    let pidList = cut(yield obj.dataBaseHandler.read(saveKey, []), obj.readWithDefault(numSaveKey, 1024));
                    for (let div of Array.from(document.querySelectorAll('#postlist > div.reported'))) {
                        if (!(div instanceof HTMLElement)) {
                            continue;
                        }
                        let pid = parseInt(((_b = ((_a = div.getAttribute('id')) !== null && _a !== void 0 ? _a : '0').match(/\d+/)) !== null && _b !== void 0 ? _b : [
                            '0',
                        ])[0]);
                        if (pidList.indexOf(pid) == -1) {
                            div.removeClass('reported');
                        }
                    }
                    for (let div of Array.from(document.querySelectorAll('#postlist > div:not(.reported)'))) {
                        if (!(div instanceof HTMLElement)) {
                            continue;
                        }
                        let pid = parseInt(((_d = ((_c = div.getAttribute('id')) !== null && _c !== void 0 ? _c : '0').match(/\d+/)) !== null && _d !== void 0 ? _d : [
                            '0',
                        ])[0]);
                        if (pidList.indexOf(pid) != -1) {
                            div.addClass('reported');
                        }
                    }
                });
            }
            function cut(list, len) {
                let newlist = list;
                let diff = newlist.length - len;
                if (diff < 1) {
                    return newlist;
                }
                newlist = newlist.slice(diff);
                return newlist;
            }
            function update() {
                return __awaiter(this, void 0, void 0, function* () {
                    let oldData = obj.read(saveKey);
                    if (!oldData || oldData.length == 0)
                        return;
                    let newData = obj.unique([
                        ...oldData,
                        ...(yield obj.dataBaseHandler.read(saveKey, [])),
                    ]);
                    yield obj.dataBaseHandler.write(saveKey, newData);
                });
            }
        }
        lazyLoadImgOP() {
            var _a, _b;
            this.assert(autoRunLock, '不在页面初始运行状态');
            let enable = this.readWithDefault('lazyLoadImgEnable', true), obj = this;
            this.addCheckSetting('另一种图片懒加载<br><small>一种更友好的图片懒加载方式</small>', enable, (ck, ev) => {
                obj.write('lazyLoadImgEnable', ck);
                obj.message('图片懒加载模式切换需要刷新生效', (f) => {
                    f();
                }, 3);
            }, '另一种图片懒加载', 45);
            if (!enable) {
                return;
            }
            let imgs;
            if (window.lazyload) {
                imgs = HTMLImgFliter((_a = window.lazyload.imgs) !== null && _a !== void 0 ? _a : []);
                window.lazyload.imgs = [];
            }
            else {
                imgs = HTMLImgFliter([
                    ...Array.from(document.querySelectorAll('.t_fsz .t_f img:not([src]):not([lazyloaded])')),
                    ...Array.from(document.querySelectorAll('.t_fsz .t_f img[src*="static/image/common/none.gif"]:not([lazyloaded])')),
                    ...Array.from(document.querySelectorAll('.t_fsz .pattl img[src*="static/image/common/none.gif"]:not([lazyloaded])')),
                ]);
            }
            let obs = new IntersectionObserver((entries) => {
                var _a, _b;
                let img = entries[0].target;
                obs.unobserve(img);
                if (!(img instanceof HTMLImageElement)) {
                    return;
                }
                img.setAttribute('src', (_a = img.getAttribute('file')) !== null && _a !== void 0 ? _a : '');
                img.setAttribute('alt', '图片加载中, 请稍作等待......');
                obj.log('加载图片: ' + ((_b = img.getAttribute('file')) !== null && _b !== void 0 ? _b : ''));
                setTimeout(() => {
                    if (!img.hasAttribute('loaded') &&
                        img.hasAttribute('lazyloadthumb')) {
                        window.thumbImg(img);
                    }
                }, 500);
                setTimeout(() => {
                    if (!img.hasAttribute('loaded') &&
                        img.hasAttribute('lazyloadthumb')) {
                        window.thumbImg(img);
                    }
                }, 1500);
                setTimeout(() => {
                    if (!img.hasAttribute('loaded') &&
                        img.hasAttribute('lazyloadthumb')) {
                        window.thumbImg(img);
                    }
                }, 5000);
                setTimeout(() => {
                    if (!img.hasAttribute('loaded') &&
                        img.hasAttribute('lazyloadthumb')) {
                        window.thumbImg(img);
                    }
                }, 10000);
            });
            for (let img of imgs) {
                img.setAttribute('lazyloaded', 'true');
                img.src = '';
                img.style.maxWidth = '750px';
                img.addEventListener('load', () => {
                    img.setAttribute('loaded', '');
                    if (img.hasAttribute('lazyloadthumb')) {
                        window.thumbImg(img);
                    }
                });
                img.addEventListener('error', () => {
                    if (img.hasAttribute('waitRetry'))
                        img.alt = '加载失败, 点击重试或等待自动重载......';
                    img.setAttribute('waitRetry', '');
                });
                img.addEventListener('click', () => {
                    var _a, _b;
                    if (!img.hasAttribute('loaded') &&
                        img.hasAttribute('waitRetry')) {
                        img.alt = '图片重新加载中......';
                        img.removeAttribute('waitRetry');
                        img.numAttribute('retry').add(1);
                        img.src = (_b = (_a = img.getAttribute('file')) !== null && _a !== void 0 ? _a : img.getAttribute('src')) !== null && _b !== void 0 ? _b : '';
                    }
                });
                obs.observe(img);
                obj.log('劫持图片: ' + ((_b = img.getAttribute('file')) !== null && _b !== void 0 ? _b : ''));
            }
            function HTMLImgFliter(elems) {
                let imgs = [];
                for (let el of elems)
                    if (el instanceof HTMLImageElement)
                        imgs.push(el);
                return imgs;
            }
        }
        imgProxyOP() {
            let enableProxy = this.readWithDefault('LoadImgProxyEnable', true), enableAntiASL = this.readWithDefault('antiAntiStealingLinkEnable', true), obj = this;
            let cssSelector = window.location.href.indexOf('action=printable') == -1
                ? '.t_fsz .t_f img, .img img'
                : 'body > img, body > * > img';
            cssSelector +=
                window.location.href.indexOf('/forum.php') != -1
                    ? ', .common p > img'
                    : '';
            cssSelector +=
                window.location.href.indexOf('thread') != -1
                    ? ', .plhin .sign img'
                    : '';
            this.addCheckSetting('启用代理加载图片<br><small>访问imgur等现在访问困难的图床</small>', enableProxy, (ck, ev) => {
                enableProxy = ck;
                obj.write('LoadImgProxyEnable', ck);
                obj.message('代理加载配置需要刷新页面生效', (f) => {
                    f();
                }, 3);
            }, '启用代理加载图片', 47);
            this.addCheckSetting('启用反反盗链功能<br><small>访问微博、贴吧等后来启用反盗链的图床</small>', enableAntiASL, (ck, ev) => {
                enableAntiASL = ck;
                obj.write('antiAntiStealingLinkEnable', ck);
                obj.message('反反盗链配置需要刷新页面生效', (f) => {
                    f();
                }, 3);
            }, '启用反反盗链功能', 46);
            handler();
            this.saltObserver('ct', handler);
            function handler() {
                obj.saltQuery(cssSelector, (i, img) => {
                    if (img instanceof HTMLImageElement) {
                        if (enableProxy) {
                            addProxy(img);
                        }
                        if (enableAntiASL) {
                            antiAntiStealingLink(img);
                        }
                    }
                });
            }
            function addProxy(img) {
                var _a, _b;
                if (img.hasAttribute('proxyed')) {
                    return;
                }
                let src = '', attr = 'src';
                let proxy = obj.randomChoice([
                    'https://saltproxy.saltlovely.workers.dev/',
                    'https://public-cdrl-proxy.moushu.workers.dev/',
                ]);
                let needProxyWebSite = ['imgur.com/', 'upload.cc/'];
                src = (_a = img.getAttribute(attr)) !== null && _a !== void 0 ? _a : '';
                if (src.indexOf('static/image/common/none.gif') != -1 ||
                    src.length < 4) {
                    attr = 'file';
                    src = (_b = img.getAttribute(attr)) !== null && _b !== void 0 ? _b : '';
                }
                for (let s of needProxyWebSite) {
                    if (src.indexOf(s) != -1) {
                        obj.log('检查到需要代理的图床: ' + s + '\n - 链接: ' + src);
                        src = proxy + src;
                        img.setAttribute(attr, src);
                        img.setAttribute('proxyed', '');
                        return;
                    }
                }
            }
            function antiAntiStealingLink(img) {
                var _a, _b;
                if (img.hasAttribute('referrerpolicy')) {
                    return;
                }
                let src = '', attr = 'src';
                let antiStealingLinkWebSite = [
                    'sinaimg.cn',
                    'tiebapic.baidu.com',
                    'qpic.cn',
                    'planetminecraft.com',
                    'hdslb.com',
                ];
                let advancedAntiStealingLinkWebSite = [
                    'hiphotos.bdimg.com',
                    'minecraftxz.com',
                ];
                src = (_a = img.getAttribute(attr)) !== null && _a !== void 0 ? _a : '';
                if (src.indexOf('static/image/common/none.gif') != -1 ||
                    src.length < 4) {
                    attr = 'file';
                    src = (_b = img.getAttribute(attr)) !== null && _b !== void 0 ? _b : '';
                }
                for (let s of advancedAntiStealingLinkWebSite) {
                    if (src.indexOf(s) != -1) {
                        iframeSet(img, s, src);
                        return;
                    }
                }
                for (let s of antiStealingLinkWebSite) {
                    if (src.indexOf(s) != -1) {
                        noRefSet(img, s);
                        return;
                    }
                }
                function noRefSet(img, tuChuang) {
                    img.setAttribute('referrerpolicy', 'no-referrer');
                    obj.log('检查到需要反反盗链的图床: ' +
                        tuChuang +
                        '\n - 链接: ' +
                        src);
                }
                function iframeSet(img, tuChuang, src) {
                    img.setAttribute('referrerpolicy', 'no-referrer');
                    obj.log('检查到需要代理以反反盗链的图床: ' +
                        tuChuang +
                        '\n - 链接: ' +
                        src);
                    src = 'https://images.weserv.nl/?url=' + src;
                    img.src = src;
                }
            }
        }
        threadClassifyOP() {
            let enable = this.readWithDefault('threadClassifyEnable', true), obj = this;
            this.addCheckSetting('帖子分类高亮<br><small>按照帖子的类型进行高亮</small>', enable, (ck, ev) => {
                obj.write('threadClassifyEnable', ck);
                enable = ck;
                if (enable) {
                    fullCheck();
                    window.saltMCBBSCSS.putStyle('', 'threadClassify');
                }
                else {
                    disable();
                    window.saltMCBBSCSS.delStyle('threadClassify');
                }
            }, '帖子分类高亮', 43);
            if (enable) {
                fullCheck();
                window.saltMCBBSCSS.putStyle('', 'threadClassify');
            }
            let threadlisttableid = document.querySelector('#threadlisttableid');
            if (threadlisttableid) {
                this.saltObserver(threadlisttableid, () => {
                    if (enable) {
                        fullCheck();
                    }
                });
            }
            function fullCheck() {
                return __awaiter(this, void 0, void 0, function* () {
                    obj.saltQuery('#threadlist div.structItem:not([classified])', (i, el) => {
                        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                        if (!(el instanceof HTMLElement)) {
                            return;
                        }
                        el.setAttribute('classified', '');
                        el.setAttribute('type', (_b = (_a = el.querySelector('.structItem-title .label')) === null || _a === void 0 ? void 0 : _a.textContent) !== null && _b !== void 0 ? _b : '');
                        el.setAttribute('author', ((_c = el.getAttribute('data-author')) !== null && _c !== void 0 ? _c : '').replace(/^\s|\s$/g, ''));
                        let title = (_e = (_d = el.querySelector('.structItem-title')) === null || _d === void 0 ? void 0 : _d.textContent) !== null && _e !== void 0 ? _e : '';
                        let thread = (_g = (_f = el.querySelector('.structItem-title a[title]')) === null || _f === void 0 ? void 0 : _f.textContent) !== null && _g !== void 0 ? _g : '';
                        if (el.hasClass('js-threadListItem-565057') ||
                            el.hasClass('js-threadListItem-7808')) {
                            el.addClass('top-3');
                        }
                        else if (el.hasClass('structItem_top')) {
                            el.addClass('top-1');
                        }
                        if (el.querySelector('img[alt="新人帖"]')) {
                            el.addClass('newbie');
                        }
                        if (el.querySelector('a[title="只看进行中的"]')) {
                            el.addClass('reward');
                            let pirce = parseInt(((_k = ((_j = (_h = el.querySelector('a[title="只看进行中的"]')) === null || _h === void 0 ? void 0 : _h.textContent) !== null && _j !== void 0 ? _j : '').match(/\d+/)) !== null && _k !== void 0 ? _k : ['30'])[0]);
                            if (pirce >= 100) {
                                el.addClass('big-reward');
                            }
                            if (pirce >= 500) {
                                el.addClass('great-reward');
                            }
                        }
                        if (el.querySelector('a[title="只看已解决的"]')) {
                            el.addClass('solved');
                        }
                        if (el.querySelector('.fa-lock[title="已关闭"]')) {
                            el.addClass('locked');
                        }
                        if (el.querySelector('th img[src$="hot_3.gif"]')) {
                            el.addClass('hot-3');
                        }
                        if (el.querySelector('th img[src$="hot_2.gif"]')) {
                            el.addClass('hot-2');
                        }
                        if (el.querySelector('th img[src$="hot_1.gif"]')) {
                            el.addClass('hot-1');
                        }
                        if (el.querySelector('th img[src$="recommend_3.gif"]')) {
                            el.addClass('rec-3');
                        }
                        if (el.querySelector('th img[src$="recommend_2.gif"]')) {
                            el.addClass('rec-2');
                        }
                        if (el.querySelector('th img[src$="recommend_1.gif"]')) {
                            el.addClass('rec-1');
                        }
                        if (el.querySelector('th img[alt="推荐"]')) {
                            el.addClass('recommend');
                        }
                        if (el.querySelector('th img[alt="版主推荐"]')) {
                            el.addClass('moderator-recommend');
                        }
                        if (el.querySelector('th img[alt="优秀"]')) {
                            el.addClass('excellent');
                        }
                        if (el.querySelector('th img[alt="digest"]')) {
                            el.addClass('digestpost');
                        }
                        if (el.querySelector('th img[alt="attach_img"]')) {
                            el.addClass('pic');
                        }
                        if (el.querySelector('th img[alt="attachment"]')) {
                            el.addClass('file');
                        }
                        if (el.querySelector('th img[alt="agree"]')) {
                            el.addClass('good');
                        }
                        if (el.querySelector('th img[alt="disagree"]')) {
                            el.addClass('bad');
                        }
                        if (/[\[【]\s?.*晒尸\s?[】\]]|^(剽窃|转账)晒尸/.test(thread)) {
                            el.addClass('punitive-publicity');
                        }
                    });
                });
            }
            function disable() {
                return __awaiter(this, void 0, void 0, function* () {
                    obj.saltQuery('#threadlist div.structItem[classified]', (i, el) => {
                        if (!(el instanceof HTMLElement)) {
                            return;
                        }
                        el.removeAttribute('classified');
                        el.removeAttribute('type');
                        el.removeAttribute('author');
                        el.removeClass('top-1 top-2 top-3 debate newbie reward big-reward great-reward solved locked hot-1 hot-2 hot-3 rec-1 rec-2 rec-3 recommend moderator-recommend excellent digestpost file pic good bad punitive-publicity');
                    });
                });
            }
        }
        antiWaterOP() {
            this.assert(autoRunLock, '不在页面初始运行状态');
            let obj = this;
            let enableAntiWater = this.readWithDefault('SaltAntiWater', false);
            this.addCheckSetting('水帖检测机制<br><small>只会检测页面中的漏网水帖</small>', enableAntiWater, (ck, ev) => {
                this.write('SaltAntiWater', ck);
                this.message('"水帖检测机制"配置项需要刷新生效<br>点击刷新', () => {
                    location.reload();
                }, 3);
            }, '水帖检测机制', 41);
            (function () {
                return __awaiter(this, void 0, void 0, function* () {
                    yield obj.dataBaseHandler.waitForReady();
                    let antiWaterRegExpRaw = yield obj.dataBaseHandler.read('SaltAntiWaterRegExp', '// 写法: /表达式/标记 -- 表达式: 正则表达式 -- 标记: i-忽略大小写 g-多次匹配 m-多行匹配 -- 示例: /[6六six]{3,}/i' +
                        '\n' +
                        /^[\s\S]{0,2}([\.\*\s]|\/meme\/)*(\S|\/meme\/)\s*(\2([\.\*\s]|\/meme\/)*)*([\.\*\s]|\/meme\/)*[\s\S]?\s?$/ +
                        '\n' +
                        /^[\s\S]{0,3}(请?让?我是?来?|可以)?.{0,3}([水氵]{3}|[水氵][一二两亿]?[帖贴下]+|完成每?日?一?水?帖?贴?的?任务)[\s\S]{0,3}$/);
                    let antiWaterRegExp = string2RegExp(obj.cleanStringArray(obj.formatToStringArray(antiWaterRegExpRaw)));
                    obj.addTextareaSetting('自定义水帖匹配正则<small> 匹配水帖，一行一个，开头添加“//”暂时禁用</small>', antiWaterRegExpRaw, (el, ev) => {
                        obj.dataBaseHandler.write('SaltAntiWaterRegExp', el.value);
                        antiWaterRegExp = string2RegExp(obj.cleanStringArray(obj.formatToStringArray(el.value)));
                        if (enableAntiWater) {
                            obj.antiWater(antiWaterRegExp);
                        }
                    }, '自定义水帖匹配正则', 220);
                    if (enableAntiWater) {
                        setTimeout(() => {
                            obj.antiWater(antiWaterRegExp);
                        }, 500);
                    }
                });
            })();
            function string2RegExp(str) {
                let r = [];
                for (let s of str) {
                    if (s.indexOf('/') != 0) {
                        continue;
                    }
                    s = s.slice(1);
                    if (s.indexOf('/') < 1) {
                        continue;
                    }
                    let p = s.slice(0, s.lastIndexOf('/')), a = s.slice(s.lastIndexOf('/')).replace(/[^igm]/g, '');
                    r.push(new RegExp(p, a));
                }
                return r;
            }
        }
        leftPosterInfoOP() {
            this.assert(autoRunLock, '不在页面初始运行状态');
            let obj = this;
            let pidInfo = [];
            let handler = this.readWithDefault('leftPosterInfoShow', '//积分,帖子,主题,精华,金粒,宝石,贡献,爱心,钻石,人气,下界之星,最后登录,注册时间\n金粒\n宝石\n贡献\n爱心');
            reflash(this.cleanStringArray(this.formatToStringArray(handler)));
            this.addSetting({
                type: 'textarea',
                title: '左侧用户信息显示控制',
                subtitle: '显示层主的信息（积分、发帖情况等），一行一个，开头添加“//”暂时禁用',
                text: handler,
                callback: (el) => {
                    let v = el.value;
                    reflash(this.cleanStringArray(this.formatToStringArray(v)));
                    this.write('leftPosterInfoShow', v);
                },
                priority: 216,
            });
            function reflash(handler) {
                obj.saltQuery('.plhin', (i, el) => {
                    var _a, _b, _c;
                    if (!(el instanceof HTMLElement))
                        return;
                    let outInfo = el.querySelector('.favatar > dl');
                    if (!(outInfo instanceof HTMLElement))
                        return;
                    let pid = ((_b = ((_a = el.getAttribute('id')) !== null && _a !== void 0 ? _a : '0').match(/\d+/)) !== null && _b !== void 0 ? _b : [
                        '0',
                    ])[0];
                    let info = getInfo(el, pid).info;
                    let html = '';
                    for (let h of handler)
                        for (let i of info)
                            if (((_c = i.dt.textContent) !== null && _c !== void 0 ? _c : '').indexOf(h) != -1) {
                                html += `<dt>${i.dt.innerHTML}</dt><dd>${i.dd.innerHTML}</dd>`;
                                break;
                            }
                    outInfo.innerHTML = html;
                });
            }
            function getInfo(el, pid) {
                for (let pf of pidInfo)
                    if (pf.pid == pid)
                        return pf;
                let info = [];
                let card = el.querySelector('.bui[id]');
                if (card instanceof HTMLElement) {
                    let dl = card.querySelector('dl');
                    if (dl) {
                        let dd = dl.querySelectorAll('dd'), dt = dl.querySelectorAll('dt');
                        for (let i = 0; i < Math.min(dd.length, dt.length); i++) {
                            info.push({ dt: dt[i], dd: dd[i] });
                        }
                    }
                }
                let outInfo = el.querySelector('.favatar > dl');
                if (outInfo instanceof HTMLElement) {
                    let dd = outInfo.querySelectorAll('dd'), dt = outInfo.querySelectorAll('dt');
                    for (let i = 0; i < Math.min(dd.length, dt.length); i++) {
                        info.push({ dt: dt[i], dd: dd[i] });
                    }
                }
                pidInfo.push({ pid: pid, info: info });
                return { pid: pid, info: info };
            }
        }
        animationOP() {
            this.assert(autoRunLock, '不在页面初始运行状态');
            let obj = this;
            document.addEventListener('visibilitychange', updateNightStyle);
            function updateNightStyle() {
                if (document.hidden)
                    return;
                let isNight = obj.readWithDefault('isNightStyle', false);
                let isReallyNight = document.body.hasClass('nightS');
                if (isNight != isReallyNight)
                    obj.nightStyle(isNight, false);
            }
            let tempFontSize = 14;
            getMaxCodeLine();
            window.saltMCBBSCSS.setStyle(`
/**/
.pl .blockcode {position: relative;}
.pl .blockcode > div[id] {position: relative;max-height: 75vh;max-width: 750px;scrollbar-width: thin;scrollbar-color: #eee #999;overflow: auto;z-index: 10;}
.pl .blockcode > div[id]::-webkit-scrollbar {width: 10px;height: 10px;}
.pl .blockcode > div[id]::-webkit-scrollbar-thumb {border-radius: 10px;box-shadow: inset 0 0 4px rgba(102, 102, 102, 0.25);background: #999;}
.pl .blockcode > div[id]::-webkit-scrollbar-track {box-shadow: inset 0 0 4px rgba(187, 187, 187, 0.25);border-radius: 10px;background: #eee;}
/*
.pl .blockcode > div::after {
    content: "01.\\A 02.\\A 03.\\A 04.\\A 05.\\A 06.\\A 07.\\A 08.\\A 09.\\A ";
    position: absolute;overflow: hidden;width: 31px;height: var(--lineCountXlineHeight,100%);top: 0;left: 0;font-size: 14px;line-height: ${tempFontSize + 4}px;text-align: right;}
*/
.pl .blockcode > div > .codeline {display:block !important;position: absolute;top: 0;left: -10px;background-color:#ededed;overflow: hidden;width: 36px;height: var(--lineCountXlineHeight,100%);user-select: none;}
.pl .blockcode > div > .codeline > div {font-size: 14px;line-height: ${tempFontSize + 4}px;height: ${tempFontSize + 4}px;text-align: right;}
body.nightS .pl .blockcode > div > .codeline {background-color:#1a1a1a}
.pl .blockcode > em {top: 2px;right: 2px;position: absolute;margin: 0 0 0 0;z-index: 12;padding: 5px;border: 1px dashed #369;border-radius:5px;opacity:.3;font-size: 14px;transition: .3s ease;}
.pl .blockcode > em:hover {border-color: #48c;color: #48c !important;opacity:1;}
.pl .blockcode ol {overflow: visible;margin-left: 33px !important;font-size: 14px;scrollbar-width: thin;scrollbar-color: #eee #999;list-style: none;}
/*.pl .blockcode ol::-webkit-scrollbar {width: 10px;height: 10px;}
.pl .blockcode ol::-webkit-scrollbar-thumb {border-radius: 10px;box-shadow: inset 0 0 4px rgba(102, 102, 102, 0.25);background: #999;}
.pl .blockcode ol::-webkit-scrollbar-track {box-shadow: inset 0 0 4px rgba(187, 187, 187, 0.25);border-radius: 10px;background: #eee;}*/
.pl .blockcode ol li {
    color: #333;height: ${tempFontSize + 4}px;padding-left: 14px;margin-left: 0;font-size: 14px;line-height: ${tempFontSize + 4}px;
    list-style: none;white-space: pre;float: left;clear: both;min-width: calc(100% - 16px);}
/*.pl .blockcode::after {content: "";position: absolute;width: 42px;height: 100%;top: 0;left: 0;border-right: 1px solid #ccc;background-color: #ededed;z-index: 1;}*/
.pl .blockcode .line-counter{display: none;}/*兼容MCBBS Extender*/
`, 'blockCodeCSS');
            blockCodeCSSFunc(this.readWithDefault('blockCodeCSSFunc', true));
            this.addCheckSetting('代码栏样式优化<br><small>兼容模式下覆盖MCBBS Extender</small>', this.readWithDefault('blockCodeCSSFunc', true), (ck, ev) => {
                this.write('blockCodeCSSFunc', ck);
                blockCodeCSSFunc(ck);
            }, '代码栏样式优化', 24);
            function blockCodeCSSFunc(b) {
                if (b)
                    window.saltMCBBSCSS.putStyle('', 'blockCodeCSS');
                else
                    window.saltMCBBSCSS.delStyle('blockCodeCSS');
            }
            function getMaxCodeLine() {
                obj.saltQuery('.blockcode > div[id]', (i, el) => {
                    if (!(el instanceof HTMLElement))
                        return;
                    let l = el.querySelectorAll('ol li').length, div = newDiv(), html = '';
                    el.style.setProperty('--lineCountXlineHeight', l * (tempFontSize + 4) + 'px');
                    for (let i = 1; i < l + 1; i++) {
                        html += '<div>' + i + '.</div>';
                    }
                    div.innerHTML = html;
                    div.className = 'codeline';
                    div.style.display = 'none';
                    let preLeft = 0;
                    el.addEventListener('scroll', function (ev) {
                        if (preLeft == el.scrollLeft)
                            return;
                        div.style.left =
                            (MExtConfiectFix[1]
                                ? el.scrollLeft
                                : el.scrollLeft - 10) + 'px';
                        preLeft = el.scrollLeft;
                    });
                    el.appendChild(div);
                });
            }
            this.updateThemeColor();
            this.saltQuery('.sslct_btn', (i, el) => {
                if (el instanceof HTMLElement)
                    el.addEventListener('click', () => {
                        setTimeout(obj.updateThemeColor, 50);
                    });
            });
            let forceH5Player = this.readWithDefault('forceH5Player', false), allowAutoPlayMusic = this.readWithDefault('allowAutoPlayMusic', false);
            allowAuto(allowAutoPlayMusic);
            forceH5(forceH5Player);
            this.addSetting({
                type: 'check',
                title: '强制使用H5播放器',
                subtitle: '仅对网易外链播放器有效',
                checked: forceH5Player,
                callback: (ck) => {
                    this.write('forceH5Player', ck);
                    obj.message('强制使用H5播放器选项刷新生效', (f) => {
                        f();
                    }, 3);
                },
                name: '强制使用H5播放器',
                priority: 26,
            });
            this.addSetting({
                type: 'check',
                title: '阻止自动播放音乐',
                subtitle: '仅对网易外链播放器有效',
                checked: allowAutoPlayMusic,
                callback: (ck) => {
                    this.write('allowAutoPlayMusic', ck);
                    obj.message('阻止自动播放音乐选项刷新生效', (f) => {
                        f();
                    }, 3);
                },
                name: '阻止自动播放音乐',
                priority: 27,
            });
            function forceH5(ck) {
                if (ck)
                    obj.saltQuery('embed,iframe', (i, el) => {
                        var _a, _b, _c;
                        if (!(el instanceof HTMLElement))
                            return;
                        let src = (_a = el.getAttribute('src')) !== null && _a !== void 0 ? _a : '';
                        if (src.indexOf('music.163') == -1 ||
                            src.indexOf('?') == -1)
                            return;
                        src = src.slice(src.indexOf('?')).replace('sid', 'id');
                        el.setAttribute('src', 'https://music.163.com/outchain/player' + src);
                        if (/height\=66/i.test(src))
                            el.setAttribute('height', '86');
                        if (el.tagName.toUpperCase() == 'EMBED') {
                            let iframe = document.createElement('iframe');
                            iframe.width = (_b = el.getAttribute('width')) !== null && _b !== void 0 ? _b : '320';
                            iframe.height = (_c = el.getAttribute('height')) !== null && _c !== void 0 ? _c : '86';
                            iframe.src = el.getAttribute('src');
                            iframe.style.border = 'none';
                            el.replaceWith(iframe);
                        }
                    });
            }
            function allowAuto(ck) {
                if (ck)
                    obj.saltQuery('embed,iframe', (i, el) => {
                        var _a;
                        if (!(el instanceof HTMLElement))
                            return;
                        let src = (_a = el.getAttribute('src')) !== null && _a !== void 0 ? _a : '';
                        if (src.indexOf('music.163') == -1)
                            return;
                        src = src.replace(/auto\=\d+/, 'auto=0');
                        el.setAttribute('src', src);
                    });
            }
        }
        confiectFixOP() {
            this.assert(autoRunLock, '不在页面初始运行状态');
            let obj = this;
            let enabled = this.readWithDefault('saltMCBBSconfiectFix', true);
            this.addCheckSetting('冲突修复功能<br><small>尝试修复与其他脚本的冲突</small>', enabled, (ck, ev) => {
                this.write('saltMCBBSconfiectFix', ck);
                if (ck)
                    sub();
            }, '冲突修复功能', 21);
            function sub() {
                let links = obj.links;
                let ul = document.querySelector('.user_info_menu_btn');
                if (!ul || !(ul instanceof HTMLElement)) {
                    return;
                }
                let a = ul.querySelectorAll('a'), othersArchor = [];
                for (let i = 4; i < a.length; i++) {
                    othersArchor.push(a[i]);
                }
                if (othersArchor.length > 0) {
                    obj.addChildren(links, othersArchor);
                    obj.log(othersArchor);
                }
            }
            function MExtFix() {
                if (document.querySelector('.md_ctrl .hoverable-medal')) {
                    window.saltMCBBSCSS.putStyle(`
/*修复勋章栏的偏移*/
p.md_ctrl{padding-left: 0;}
div.tip.tip_4[id*=md_] p{position:relative;top:0;transform:none;}
                `, 'MExtConfiectFixCSS-medal');
                }
                if (document.querySelector('.blockcode .line-counter')) {
                    window.saltMCBBSCSS.putStyle(`
/*代码行数*/
.pl .blockcode ol{
    margin-left: 0 !important;
}
.pl .blockcode > div::after{
    width: 35px;
    height: var(--lineCountXlineHeight,calc(100% - 15px));
    margin-top: 10px;
}
.pl .blockcode > div > .codeline {
    top: 10px;
    left: 0;
}
/*.pl .blockcode div[id]{
    max-height: 999rem;
}*/
body.nightS .blockcode .line-counter {background-color:#1a1a1a}
body.nightS .pl .blockcode div[id]{
    background: none;
}
                `, 'MExtConfiectFixCSS-blockcode');
                    MExtConfiectFix[1] = true;
                }
                window.saltMCBBSCSS.putStyle(`
/*修复同时出现两个警告按钮*/
.pmwarn + .view_warns_inposts,
.pmwarn + .view_warns_home,
.view_warns_inposts + .pmwarn,
.view_warns_home + .pmwarn{
    display: none;
}
                `, 'MExtConfiectFixCSS2');
            }
            if (enabled) {
                if (this.readWithDefault('SaltMoveTopBarToLeft', true)) {
                    sub();
                    setTimeout(() => {
                        sub();
                    }, 2500);
                    setTimeout(() => {
                        sub();
                    }, 2500);
                    window.addEventListener('load', () => {
                        sub();
                    });
                }
                obj.docReady(() => {
                    if (typeof window.MExt != 'undefined') {
                        MExtFix();
                        setTimeout(() => {
                            MExtFix();
                        }, 2500);
                        setTimeout(() => {
                            MExtFix();
                        }, 10000);
                        window.addEventListener('load', () => {
                            MExtFix();
                        });
                    }
                });
            }
        }
        bugFixOP() {
            this.assert(autoRunLock, '不在页面初始运行状态');
            window.copycode = copycode;
            function copycode(el) {
                var _a;
                let i = document.createElement('textarea'), s = [];
                let li = Array.from(el.querySelectorAll('ol li'));
                console.log(li);
                for (let l of li)
                    s.push(((_a = l.textContent) !== null && _a !== void 0 ? _a : '').replace(/^\n|\n$/, ''));
                i.value = s.join('\n');
                i.readOnly = true;
                i.setAttribute('style', 'opacity:0;position:absolute');
                console.log(i.value);
                document.body.appendChild(i);
                i.select();
                i.setSelectionRange(0, i.value.length);
                let b = document.execCommand('copy');
                if (!b)
                    alert('复制失败');
                i.remove();
            }
        }
        antiWater(RegExps = antiWaterRegExp, ignoreWarned = true, callback) {
            return __awaiter(this, void 0, void 0, function* () {
                let obj = this;
                let queryStr = ignoreWarned
                    ? '#postlist > div:not(.warned)'
                    : '#postlist > div';
                this.saltQuery(queryStr, (i, el) => {
                    var _a, _b, _c;
                    if (!(el instanceof HTMLElement)) {
                        return;
                    }
                    let td = el.querySelector('td[id^="postmessage"]');
                    if (!(td instanceof HTMLElement)) {
                        return;
                    }
                    let tempEl = document.createElement('div');
                    tempEl.innerHTML = td.innerHTML;
                    for (let img of Array.from(tempEl.querySelectorAll('img[smilieid]')))
                        if (img instanceof HTMLImageElement)
                            img.replaceWith('/meme/');
                    for (let font0 of Array.from(tempEl.querySelectorAll('font[style*="font-size:0px"]')))
                        if (font0 instanceof HTMLImageElement)
                            font0.remove();
                    let quote = tempEl.querySelector('div.quote');
                    if (quote) {
                        let a = quote.querySelector('a');
                        if (a)
                            if (/.*\s?发表于.*\d{4}/.test((_a = a.textContent) !== null && _a !== void 0 ? _a : ''))
                                quote.remove();
                    }
                    let pstatus = tempEl.querySelector('i.pstatus');
                    if (pstatus)
                        if (/./.test((_b = pstatus.textContent) !== null && _b !== void 0 ? _b : ''))
                            pstatus.remove();
                    let t = (_c = tempEl.textContent) !== null && _c !== void 0 ? _c : '';
                    for (let aw of RegExps) {
                        if (aw.test(t)) {
                            if (callback) {
                                callback(el, td, t);
                            }
                            else {
                                obj.message((el.hasClass('reported')
                                    ? '该疑似水帖已被您举报'
                                    : '发现未制裁的疑似水帖') +
                                    ':<br><span>' +
                                    tempEl.innerHTML +
                                    '</span>', () => {
                                    obj.scrollTo(el.offset().top - 50);
                                });
                            }
                            break;
                        }
                    }
                    tempEl = null;
                });
            });
        }
        updateBackground() {
            let isReallyNight = document.body.hasClass('nightS');
            if (isReallyNight) {
                let nbg = this.readWithDefault('nightBackgroundImage', []);
                putNightImg(this.randomChoice(this.cleanStringArray(nbg)));
            }
            else {
                let dbg = this.readWithDefault('dayBackgroundImage', []);
                putDayImg(this.randomChoice(this.cleanStringArray(dbg)));
            }
            function putDayImg(link) {
                if (typeof link == 'string' && link.length > 0) {
                    window.saltMCBBSCSS.putStyle(`
                    body{--bodyimg-day:url('${link}');background-image:var(--bodyimg-day);background-size:cover;}
                    body:not(.night-style) #body_fixed_bg{opacity:0}`, 'setBackgroundImage-day');
                    document.body.addClass('hasBackgroundImage');
                }
                else {
                    window.saltMCBBSCSS.delStyle('setBackgroundImage-day');
                    document.body.removeClass('hasBackgroundImage');
                }
            }
            function putNightImg(link) {
                if (typeof link == 'string' && link.length > 0) {
                    window.saltMCBBSCSS.putStyle(`
                    body{--bodyimg-night:url('${link}');background-size:cover;}
                    body.night-style #body_fixed_bg{opacity:0}`, 'setBackgroundImage-night');
                    document.body.addClass('hasBackgroundImage');
                }
                else {
                    window.saltMCBBSCSS.delStyle('setBackgroundImage-night');
                    document.body.removeClass('hasBackgroundImage');
                }
            }
        }
        hideSettingPanel() {
            this.settingPanel.classList.remove('visible');
            this.settingPanel.classList.add('hidden');
        }
        showSettingPanel() {
            this.settingPanel.classList.remove('hidden');
            this.settingPanel.classList.add('visible');
        }
        addSetting(div, id, priority) {
            var _a, _b, _c, _d;
            if (div instanceof Element) {
                if (typeof id == 'string' && id.length > 0) {
                    div.setAttribute('name', id);
                }
                if (!priority) {
                    priority = myPriority;
                    myPriority += 500;
                }
                div.setAttribute('priority', priority + '');
                this.settingPanel.appendChild(div);
            }
            else if (typeof div.type == 'string') {
                switch (div.type) {
                    case 'check':
                        this.addCheckSetting(div.title +
                            (div.subtitle
                                ? '<br><small> ' + div.subtitle + '</small>'
                                : ''), div.checked, div.callback, (_a = div.name) !== null && _a !== void 0 ? _a : div.title, div.priority);
                        if (!autoRunLock) {
                            this.sortSetting();
                        }
                        return;
                    case 'input':
                        this.addInputSetting(div.title +
                            (div.subtitle
                                ? '<br><small> ' + div.subtitle + '</small>'
                                : ''), div.text, div.callback, (_b = div.name) !== null && _b !== void 0 ? _b : div.title, div.priority);
                        if (!autoRunLock) {
                            this.sortSetting();
                        }
                        return;
                    case 'textarea':
                        this.addTextareaSetting(div.title +
                            (div.subtitle
                                ? '<small> ' + div.subtitle + '</small>'
                                : ''), div.text, div.callback, (_c = div.name) !== null && _c !== void 0 ? _c : div.title, div.priority);
                        if (!autoRunLock) {
                            this.sortSetting();
                        }
                        return;
                    case 'range':
                        this.addRangeSetting(div.title +
                            (div.subtitle
                                ? '<small> ' + div.subtitle + '</small>'
                                : ''), div.value, div.range, div.callback, (_d = div.name) !== null && _d !== void 0 ? _d : div.title, div.priority);
                        if (!autoRunLock) {
                            this.sortSetting();
                        }
                        return;
                    case 'normal':
                        this.addSetting(div.element, div.name, div.priority);
                        if (!autoRunLock) {
                            this.sortSetting();
                        }
                        return;
                    default:
                        this.assert(false, '配置项类型错误: 未知的类型' + div);
                        if (!autoRunLock) {
                            this.sortSetting();
                        }
                        return;
                }
            }
            else {
                return this.assert(false, '参数错误: ' + div);
            }
        }
        addTextareaSetting(h3, textarea, callback, id, priority) {
            let newsetting = document.createElement('div');
            newsetting.innerHTML = '<h3>' + h3 + '</h3>';
            let textareaEl = document.createElement('textarea');
            textareaEl.value = textarea;
            textareaEl.addEventListener('change', function (e) {
                callback(this, e);
            });
            newsetting.appendChild(textareaEl);
            this.addSetting(newsetting, id !== null && id !== void 0 ? id : h3, priority);
        }
        addInputSetting(h3, text, callback, id, priority) {
            let newsetting = document.createElement('div');
            newsetting.innerHTML = '<h3 class="half-h3">' + h3 + '</h3>';
            let inputEl = document.createElement('input');
            inputEl.value = text;
            inputEl.addEventListener('change', function (e) {
                callback(this, e);
            });
            newsetting.appendChild(inputEl);
            this.addSetting(newsetting, id !== null && id !== void 0 ? id : h3, priority);
        }
        addCheckSetting(h3, checked, callback, id, priority) {
            let newsetting = document.createElement('div');
            newsetting.innerHTML = '<h3 class="half-h3">' + h3 + '</h3>';
            let inputEl = document.createElement('input'), inputId = this.randomID();
            inputEl.id = inputId;
            inputEl.type = 'checkbox';
            inputEl.checked = checked;
            inputEl.addEventListener('click', function (e) {
                callback(this.checked, e);
            });
            newsetting.appendChild(inputEl);
            let label = document.createElement('label');
            label.className = 'checkbox';
            label.htmlFor = inputId;
            newsetting.appendChild(label);
            this.addSetting(newsetting, id !== null && id !== void 0 ? id : h3, priority);
        }
        addRangeSetting(h3, value, range, callback, id, priority) {
            var _a, _b, _c, _d, _e, _f;
            let rg = [0, 0, 0];
            if (range instanceof Array) {
                rg[0] = (_a = range[0]) !== null && _a !== void 0 ? _a : 0;
                rg[1] = (_b = range[1]) !== null && _b !== void 0 ? _b : 100;
                rg[2] = (_c = range[2]) !== null && _c !== void 0 ? _c : 1;
            }
            else {
                rg[0] = (_d = range.min) !== null && _d !== void 0 ? _d : 0;
                rg[1] = (_e = range.max) !== null && _e !== void 0 ? _e : 100;
                rg[2] = (_f = range.step) !== null && _f !== void 0 ? _f : 1;
            }
            if (rg[0] > rg[1]) {
                let temp = rg[0];
                rg[0] = rg[1];
                rg[1] = temp;
            }
            let newsetting = document.createElement('div');
            newsetting.innerHTML = '<h3>' + h3 + '</h3>';
            let inputEl = document.createElement('input');
            inputEl.type = 'range';
            inputEl.min = rg[0] + '';
            inputEl.max = rg[1] + '';
            inputEl.step = rg[2] + '';
            inputEl.value = value + '';
            inputEl.addEventListener('change', function (ev) {
                callback(parseFloat(this.value), ev);
            });
            newsetting.appendChild(inputEl);
            this.addSetting(newsetting, id !== null && id !== void 0 ? id : h3, priority);
        }
        delSetting(id) {
            if (!(typeof id == 'string' && id.length > 0)) {
                return;
            }
            let div = this.settingPanel.children;
            for (let x of div) {
                if (x.hasAttribute('name') && x.getAttribute('name') == id) {
                    this.log('已找到配置项: ' + id);
                    this.settingPanel.removeChild(x);
                    return;
                }
            }
        }
        sortSetting() {
            var _a;
            let divs = Array.from(document.querySelectorAll('#saltMCBBS-settingPanel > *'));
            for (let div of divs) {
                if (!div.hasAttribute('priority')) {
                    div.setAttribute('priority', '99999999');
                }
                else if (isNaN(parseInt((_a = div.getAttribute('priority')) !== null && _a !== void 0 ? _a : ''))) {
                    div.setAttribute('priority', '99999998');
                }
            }
            divs.sort((a, b) => {
                var _a, _b;
                return (parseInt((_a = a.getAttribute('priority')) !== null && _a !== void 0 ? _a : '') -
                    parseInt((_b = b.getAttribute('priority')) !== null && _b !== void 0 ? _b : ''));
            });
            this.addChildren(this.settingPanel, divs);
        }
        changeSettingH3(id, html) {
            if (!(typeof id == 'string' && id.length > 0)) {
                return;
            }
            let div = this.settingPanel.children;
            for (let x of div) {
                if (x.hasAttribute('name') && x.getAttribute('name') == id) {
                    let h3 = x.querySelector('h3');
                    if (h3)
                        h3.innerHTML = html;
                    return;
                }
            }
        }
        addSideBarLink(a, callback) {
            let links = this.links;
            if (typeof a == 'string') {
                let anchor = document.createElement('a');
                anchor.textContent = a;
                anchor.href = 'javascript: void(0);';
                if (typeof callback == 'function') {
                    anchor.addEventListener('click', (ev) => {
                        callback(ev);
                    });
                }
                else if (typeof callback == 'string') {
                    anchor.href = callback;
                }
                links.appendChild(anchor);
            }
            else if (a instanceof HTMLElement) {
                links.appendChild(a);
            }
        }
        nightStyle(night = true, log = false) {
            if (night) {
                window.saltMCBBSCSS.putStyle('', 'night-style');
                document.body.addClass('night-style nightS');
            }
            else {
                document.body.removeClass('night-style nightS');
            }
            if (log) {
                this.write('isNightStyle', night);
            }
            this.updateBackground();
        }
        toggleNightStyle() {
            let isnight = this.readWithDefault('isNightStyle', false);
            this.nightStyle(!isnight, true);
        }
        updateThemeColor() {
            var _a;
            let themeFinder = ['/winter', '/nether', '/default'];
            let themeColor = ['#66a6ff', '#c2290a', '#3dc322'];
            let theme = window.getcookie('extstyle');
            let i, s;
            for (i = 0; i < themeFinder.length; i++)
                if (theme.indexOf(themeFinder[i]) != -1)
                    break;
            s = (_a = themeColor[i]) !== null && _a !== void 0 ? _a : '#e91e63';
            document.body.style.setProperty('--ThemeColor', s);
            return s;
        }
    }
    class saltMCBBSCSS {
        constructor() {
            this.styles = {};
        }
        setStyle(css, key) {
            if (typeof css != 'string' || typeof key != 'string') {
                return false;
            }
            this.styles[key] = css;
            return true;
        }
        getStyle(key) {
            if (typeof key != 'string') {
                return '';
            }
            if (this.styles[key])
                return this.styles[key];
            else
                return '';
        }
        putStyle(css, key) {
            let status = 0;
            if (typeof css == 'string' && css.length > 2) {
                status += 1;
            }
            if (typeof key == 'string' && key.length > 0) {
                status += 2;
            }
            switch (status) {
                case 0:
                    return false;
                case 1:
                    let s = document.createElement('style');
                    s.textContent = css;
                    document.head.appendChild(s);
                    break;
                case 2:
                    let c = this.getStyle(key);
                    if (c.length > 0) {
                        let x = this.getStyleElement(key);
                        if (!x) {
                            let s = document.createElement('style');
                            s.textContent = c;
                            this.setStyleElement(key, s);
                            document.head.appendChild(s);
                        }
                        else {
                            if (x.textContent != c)
                                x.textContent = c;
                        }
                    }
                    else {
                        return false;
                    }
                    break;
                case 3:
                    let x = this.getStyleElement(key);
                    if (!x) {
                        this.styles[key] = css;
                        let s = document.createElement('style');
                        s.textContent = css;
                        this.setStyleElement(key, s);
                        document.head.appendChild(s);
                    }
                    else {
                        this.styles[key] = css;
                        if (x.textContent != css)
                            x.textContent = css;
                    }
                    break;
            }
            return true;
        }
        delStyle(key) {
            if (typeof key != 'string') {
                return false;
            }
            let el = this.getStyleElement(key);
            if (el) {
                el.remove();
                return true;
            }
            else {
                return false;
            }
        }
        replaceStyle(css, key) {
            if (typeof css != 'string' || typeof key != 'string') {
                return false;
            }
            let el = this.getStyleElement(key);
            if (el) {
                this.styles[key] = css;
                el.textContent = css;
            }
            else {
                this.putStyle(css, key);
            }
            return true;
        }
        getStyleElement(key) {
            if (typeof key != 'string') {
                return null;
            }
            return document.querySelector(`style[${techprefix + key}]`);
        }
        setStyleElement(key, el) {
            if (typeof key != 'string' || !(el instanceof Element)) {
                return false;
            }
            el.setAttribute(techprefix + key, '');
            return true;
        }
    }
    class saltMCBBSDataBaseHandler {
        constructor(database, mainStoreName = 'mainStore', prefix = '[saltMCBBSDataBaseHandler]') {
            this.readable = false;
            this.prefix = prefix;
            let obj = this;
            let dbRequest = indexedDB.open(database, 1);
            dbRequest.onupgradeneeded = function (ev) {
                console.log(`%c${obj.prefix}: 创建数据库 ${database}`, 'font-size:1rem;');
                obj.db = this.result;
                console.log(`%c${obj.prefix}: 创建仓库 ${database}`, 'font-size:1rem;');
                let s = obj.db.createObjectStore(mainStoreName, {
                    keyPath: 'mainKey',
                });
                s.createIndex('indexByKey', 'mainKey', {
                    unique: true,
                });
            };
            dbRequest.onsuccess = function (ev) {
                obj.readable = true;
                obj.db = dbRequest.result;
            };
            this.getStore = function () {
                return this.db
                    .transaction(mainStoreName, 'readwrite')
                    .objectStore(mainStoreName);
            };
        }
        has(key) {
            this.assertReadable();
            let obj = this;
            return new Promise(function (resolve, reject) {
                let request = obj.getStore().get(key);
                request.onsuccess = function () {
                    if (typeof request.result != 'undefined' &&
                        typeof request.result.value != 'undefined')
                        resolve(true);
                    else
                        resolve(false);
                };
                request.onerror = function () {
                    resolve(false);
                };
            });
        }
        read(key, defaultValue) {
            this.assertReadable();
            let obj = this;
            return new Promise(function (resolve, reject) {
                let request = obj.getStore().get(key);
                request.onsuccess = function () {
                    if (typeof request.result != 'undefined' &&
                        typeof request.result.value != 'undefined')
                        resolve(request.result.value);
                    else {
                        obj.write(key, defaultValue);
                        resolve(defaultValue);
                    }
                };
                request.onerror = function (ev) {
                    obj.write(key, defaultValue);
                    console.log(ev);
                    resolve(defaultValue);
                };
            });
        }
        write(key, value) {
            this.assertReadable();
            let obj = this;
            return new Promise(function (resolve, reject) {
                let request = obj
                    .getStore()
                    .put({ mainKey: key, value: value });
                request.onsuccess = function () {
                    resolve();
                };
                request.onerror = function (ev) {
                    reject(ev);
                };
            });
        }
        delete(key) {
            this.assertReadable();
            let obj = this;
            return new Promise(function (resolve, reject) {
                let request = obj.getStore().delete(key);
                request.onsuccess = function () {
                    resolve();
                };
                request.onerror = function (ev) {
                    reject(ev);
                };
            });
        }
        readAllKey() {
            this.assertReadable();
            let obj = this;
            let store = this.getStore();
            let keys = [];
            return new Promise(function (resolve, reject) {
                store.openKeyCursor().onsuccess = function (ev) {
                    let cur = this.result;
                    if (cur) {
                        keys.push(cur.key + '');
                        cur.continue();
                    }
                    else
                        resolve(keys);
                };
            });
        }
        readAll() {
            return __awaiter(this, void 0, void 0, function* () {
                this.assertReadable();
                let store = this.getStore();
                let keys = [];
                return new Promise(function (resolve, reject) {
                    store.openCursor().onsuccess = function (ev) {
                        let cur = this.result;
                        if (cur) {
                            keys.push({
                                mainKey: cur.key + '',
                                value: cur.value.value,
                            });
                            cur.continue();
                        }
                        else
                            resolve(keys);
                    };
                });
            });
        }
        readAllValue() {
            return __awaiter(this, void 0, void 0, function* () {
                return (yield this.readAll()).map((v) => v.value);
            });
        }
        waitForReady() {
            return __awaiter(this, void 0, void 0, function* () {
                while (!this.readable)
                    yield new Promise((resolve) => setTimeout(resolve, 5));
            });
        }
        assertReadable() {
            if (!this.readable || !this.db) {
                throw new Error(this.prefix + ': 你不能访问一个尚未准备完毕的数据库');
            }
        }
    }
    (function () {
        if (!HTMLElement.prototype.addClass) {
            HTMLElement.prototype.addClass = function (classes) {
                let cls = String(classes).replace(/\s+/gm, ',').split(',');
                for (let c of cls) {
                    this.classList.add(c);
                }
                return this;
            };
        }
        if (!HTMLElement.prototype.toggleClass) {
            HTMLElement.prototype.toggleClass = function (classes) {
                var cls = String(classes).replace(/\s+/gm, ',').split(',');
                for (var c of cls) {
                    if (this.classList.contains(c))
                        this.classList.remove(c);
                    else
                        this.classList.add(c);
                }
                return this;
            };
        }
        if (!HTMLElement.prototype.hasClass) {
            HTMLElement.prototype.hasClass = function (OneClass) {
                return this.classList.contains(OneClass);
            };
        }
        if (!HTMLElement.prototype.removeClass) {
            HTMLElement.prototype.removeClass = function (classes) {
                var cls = String(classes).replace(/\s+/gm, ',').split(',');
                for (var c of cls) {
                    this.classList.remove(c);
                }
                return this;
            };
        }
        if (!HTMLElement.prototype.offset) {
            HTMLElement.prototype.offset = function () {
                var _a;
                if (!this.getClientRects().length)
                    return { top: 0, left: 0 };
                var rect = this.getBoundingClientRect();
                var win = (_a = this.ownerDocument.defaultView) !== null && _a !== void 0 ? _a : {
                    pageYOffset: 0,
                    pageXOffset: 0,
                };
                return {
                    top: rect.top + win.pageYOffset,
                    left: rect.left + win.pageXOffset,
                };
            };
        }
        if (!HTMLElement.prototype.numAttribute) {
            HTMLElement.prototype.numAttribute = function (key) {
                var _a;
                let value;
                if (this.hasAttribute(key)) {
                    value = parseInt((_a = this.getAttribute(key)) !== null && _a !== void 0 ? _a : '');
                }
                else {
                    value = 0;
                    this.setAttribute(key, value + '');
                }
                if (isNaN(value)) {
                    value = 0;
                    this.setAttribute(key, value + '');
                }
                return {
                    value: value,
                    set: (num) => {
                        this.setAttribute(key, num + '');
                        return this.numAttribute(key);
                    },
                    add: (num) => {
                        this.setAttribute(key, value + num + '');
                        return this.numAttribute(key);
                    },
                };
            };
        }
        if (!HTMLElement.prototype.inViewport) {
            HTMLElement.prototype.inViewport = function () {
                var _a, _b;
                let r = this.getBoundingClientRect(), h = (_a = window.innerHeight) !== null && _a !== void 0 ? _a : document.documentElement.clientHeight, w = (_b = window.innerWidth) !== null && _b !== void 0 ? _b : document.documentElement.clientWidth;
                return (((r.top >= 0 && r.top < h) ||
                    (r.bottom > 0 && r.bottom <= h)) &&
                    ((r.left >= 0 && r.left < w) ||
                        (r.right > 0 && r.right <= w)));
            };
        }
        if (!HTMLElement.prototype.allInViewport) {
            HTMLElement.prototype.allInViewport = function () {
                var _a, _b;
                let r = this.getBoundingClientRect();
                return (r.top >= 0 &&
                    r.bottom <=
                        ((_a = window.innerHeight) !== null && _a !== void 0 ? _a : document.documentElement.clientHeight) &&
                    r.left >= 0 &&
                    r.right <=
                        ((_b = window.innerWidth) !== null && _b !== void 0 ? _b : document.documentElement.clientWidth));
            };
        }
    })();
    (function () {
        if (!window.indexedDB) {
            let s = myprefix +
                myversion +
                ': 您的浏览器并不支持**完整**的 IndexedDB 功能, 请使用 0.1.6 版本\n' +
                'Your browser does not support a STABLE version of IndexedDB, please work at ver-0.1.6.';
            setTimeout(function () {
                alert(s);
            }, 0);
            throw new Error(s);
        }
    })();
    if (window.self != window.top) {
        return;
    }
    window['saltMCBBSCSS'] = new saltMCBBSCSS();
    dbHandler = new saltMCBBSDataBaseHandler('saltMCBBSlvPJIXr13EqdD67b');
    window['saltMCBBSOriginClass'] = saltMCBBSOriginClass;
    window['saltMCBBSDataBaseHandler'] = saltMCBBSDataBaseHandler;
    window['saltMCBBS'] = new saltMCBBS(true);
    window.saltMCBBS.docReady(function () {
        if (document.querySelector('.mc_map_wp')) {
            window.saltMCBBS.message('您正在使用的SaltMCBBS并不适用于v2版本的MCBBS，请换用旧版(0.1.8)的SaltMCBBS<br><a href="">点击这里下载旧版SaltMCBBS</a>', (f) => {
                f();
            }, 4);
        }
    });
})();
(function () {
    if (window.self != window.top) {
        return;
    }
    const prefix = '[SaltMCBBS控制台]';
    const sm = window.saltMCBBS;
    const consolePanel = sm.consolePanel;
    const logArea = document.createElement('div');
    const inputArea = document.createElement('textarea');
    const newWindow = (url) => { window.open(url); return '打开网址: ' + url; };
    const Trim = sm.Trim;
    const token = sm.randomID();
    const commandMap = {
        gid: gid, fid: fid,
        tid: tid, pid: pid,
        uid: uid, uname: uname, username: uname,
        openurl: newWindow, newwindow: newWindow,
        runjs: runJS, eval: runJS,
        togglenight: togglenightstyle, togglenightstyle: togglenightstyle, nightstyle: togglenightstyle,
        cls: cls, cleanscreen: cls,
        test: echo, echo: echo,
        editlog: editlog, posteditlog: editlog,
        help: helpMe, "?": helpMe, "？": helpMe
    };
    const helpMap = {
        gid: '前往对应大区，用法：<b>gid &lt;数字ID></b>', fid: '前往对应版块，用法：<b>fid &lt;数字ID|英文ID></b>',
        tid: '前往对应主题，用法：<b>tid &lt;数字ID></b>', pid: '前往对应帖子，用法：<b>pid &lt;数字ID></b>',
        uid: '前往对应用户主页，用法：<b>uid &lt;数字ID></b>', uname: '前往对应用户主页，用法：<b>uname &lt;用户名></b>', username: '前往对应用户主页，用法：<b>username &lt;用户名></b>',
        openurl: '新窗口打开链接，用法：<b>openurl &lt;URL></b>', newwindow: '新窗口打开链接，用法：<b>newwindow &lt;URL></b>',
        runjs: '执行指令，用法：<b>runjs &lt;指令(可以是多行的)></b>', eval: '执行指令，用法：<b>eval &lt;指令(可以是多行的)></b>',
        togglenight: '切换夜间模式，用法：<b>togglenight</b>', togglenightstyle: '切换夜间模式，用法：<b>togglenightstyle</b>', nightstyle: '切换夜间模式，用法：<b>nightstyle</b>',
        cls: '清屏，用法：<b>cls</b>', cleanscreen: '清屏，用法：<b>cleanscreen</b>',
        editlog: '查看指定帖子的编辑记录<b>editlog &lt;pid></b>', posteditlog: '查看指定帖子的编辑记录<b>posteditlog &lt;pid></b>',
        test: '返回输入的参数，用法：<b>test &lt;任意内容></b>', echo: '返回输入的参数，用法：<b>echo &lt;任意内容></b>',
        help: '显示帮助，用法：<b>help &lt;指令名或留空></b>', "?": '显示帮助，用法：<b>? &lt;指令名或留空></b>', "？": '显示帮助，用法：<b>？ &lt;指令名或留空></b>'
    };
    function runCommand(command, codeToken) {
        let cmd = CmdResolve(command);
        if (commandMap[cmd.mainCmd])
            return commandMap[cmd.mainCmd].call(null, cmd.cmdBody, codeToken);
        else
            return '请检查指令拼写: ' + cmd.mainCmd;
    }
    function CmdResolve(cmd) {
        var _a;
        let temp = cmd + '';
        let p = temp.replace('\n', ' ').indexOf(' ');
        if (p == -1)
            return {
                mainCmd: temp,
                cmdBody: ''
            };
        else
            return {
                mainCmd: temp.slice(0, p).toLowerCase(),
                cmdBody: Trim((_a = temp.slice(p)) !== null && _a !== void 0 ? _a : '')
            };
    }
    function tid(cmdBody) {
        let tid = parseInt(cmdBody);
        if (isNaN(tid) || tid < 1)
            return '错误的tid';
        newWindow(`https://www.mcbbs.net/thread-${tid}-1-1.html`);
        return `访问tid为${tid}的主题帖`;
    }
    function pid(cmdBody) {
        let pid = parseInt(cmdBody);
        if (isNaN(pid) || pid < 1)
            return '错误的pid';
        newWindow(`https://www.mcbbs.net/forum.php?mod=redirect&goto=findpost&ptid=0&pid=${pid}`);
        return `访问pid为${pid}的帖子`;
    }
    function uid(cmdBody) {
        let uid = parseInt(cmdBody);
        if (isNaN(uid) || uid < 1)
            return '错误的uid';
        newWindow(`https://www.mcbbs.net/?${uid}`);
        return `访问uid为${uid}的用户页面`;
    }
    function uname(cmdBody) {
        if (/[\s\/\&]/.test(cmdBody))
            return '用户名含有非法字符';
        newWindow(`https://www.mcbbs.net/home.php?mod=space&username=${cmdBody}`);
        return `访问用户名为${cmdBody}的用户页面`;
    }
    function gid(cmdBody) {
        let gid = parseInt(cmdBody);
        if (isNaN(gid) || gid < 1)
            return '错误的gid';
        newWindow(`https://www.mcbbs.net/forum.php?gid=${gid}`);
        return `访问gid为${gid}的大区`;
    }
    function fid(cmdBody) {
        if (cmdBody.length < 1)
            return '错误的fid';
        newWindow(`https://www.mcbbs.net/forum-${cmdBody}-1.html`);
        return `访问fid为${cmdBody}的版块`;
    }
    function runJS(js, codeToken) {
        if (codeToken === token)
            if (confirm('请确认这是您本人的操作，' + prefix + '将要执行以下代码: \n' + js)) {
                let stat = '已执行JS';
                try {
                    (0, window.eval)(js);
                }
                catch (e) {
                    stat += '，出现错误：' + e;
                }
                finally {
                    return stat;
                }
            }
            else
                return 'JS执行被用户取消';
        throw new Error('检测到非法的JS执行请求');
    }
    function togglenightstyle() {
        window.saltMCBBS.toggleNightStyle();
        return '切换夜间模式';
    }
    function cls() {
        setTimeout(() => { logArea.innerHTML = ''; }, 0);
        return '';
    }
    function echo(cb) { return cb; }
    function helpMe(cmd) {
        let c = CmdResolve(cmd).mainCmd;
        if (typeof c == 'string' && c.length > 0) {
            if (helpMap[c])
                return helpMap[c];
        }
        let ans = '可用指令：\n';
        for (let k in helpMap) {
            ans += k + '\n';
        }
        ans += '使用<b> help &lt;指令名> </b>来获取详细说明';
        return ans;
    }
    function editlog(cmdBody) {
        if (cmdBody.length < 1)
            return '错误的pid';
        newWindow(`https://www.mcbbs.net/plugin.php?id=mcbbs_editlog&doing=viewthreadlogs&pid=${cmdBody}`);
        return `访问pid为${cmdBody}的帖子的编辑记录`;
    }
    class saltMCBBSConsole {
        run(command, codeToken) {
            this.log(runCommand(Trim(command), codeToken));
            logArea.scrollTop = logArea.scrollHeight;
        }
        log(s) {
            let div = document.createElement('div');
            div.innerHTML = s;
            logArea.appendChild(div);
            console.log(prefix + ': ' + s);
        }
        hideConsolePanel() {
            consolePanel.removeClass('visible').addClass('hidden');
            inputArea.blur();
        }
        showConsolePanel() {
            consolePanel.addClass('visible').removeClass('hidden');
            inputArea.focus();
        }
    }
    consolePanel.innerHTML = `<h3 class="flb" style="width:100%;margin-left:-8px;padding-right:0;">
    <em>SaltMCBBS控制台</em>
    <span style="float:right">
    <a href="javascript:;" class="flbc" onclick="saltMCBBSConsole.hideConsolePanel()" title="关闭">关闭</a>
    </span></h3>`;
    logArea.contentEditable = 'false';
    inputArea.addEventListener('keypress', function (ev) {
        let smc = window.saltMCBBSConsole;
        let value = this.value + '';
        if (!ev.shiftKey && ev.code == 'Enter') {
            this.value = '';
            if (!/^\s*$/.test(value)) {
                smc.log('·> ' + value);
                smc.run(value, token);
            }
            ev.preventDefault();
        }
    });
    consolePanel.appendChild(logArea);
    consolePanel.appendChild(inputArea);
    document.body.appendChild(consolePanel);
    window['saltMCBBSConsole'] = new saltMCBBSConsole();
    window.saltMCBBSConsole.hideConsolePanel();
    document.body.addEventListener('keydown', function (ev) {
        if (ev.ctrlKey && ev.code == 'Backquote')
            window.saltMCBBSConsole.showConsolePanel();
    });
})();
(function () {
    return __awaiter(this, void 0, void 0, function* () {
        if (window.self != window.top) {
            return;
        }
        const db = new window.saltMCBBSDataBaseHandler('saltMCBBSMemeGSU3Rk2ZWSAk0M8d');
        const sm = window.saltMCBBS;
        const newDiv = () => { return document.createElement('div'); };
        const simpleAntiXSS = sm.simpleAntiXSS;
        const emoticonPanel = (function () {
            let d = newDiv();
            d.className = 'emoticonPanel';
            d.addClass('hidden');
            d.id = 'emoticonPanel';
            d.innerHTML = `<h3 class="flb" style="width:100%;margin-left:-8px;padding-right:0;">
    <em>SaltMCBBS表情包管理</em>
    <span style="float:right">
    </span></h3>`;
            let iep = document.createElement('a');
            iep.href = 'javascript:void(0);';
            iep.textContent = '使用表情包';
            iep.onclick = function (ev) {
                showPanel(ev.clientX, ev.clientY);
            };
            d.querySelector('h3 span').appendChild(iep);
            let a = document.createElement('a');
            a.href = 'javascript:void(0);';
            a.className = 'flbc';
            a.textContent = '关闭';
            a.onclick = function () {
                d.removeClass('visible').addClass('hidden');
            };
            d.querySelector('h3 span').appendChild(a);
            document.body.appendChild(d);
            return d;
        })();
        const memeList = (function () {
            let d = newDiv();
            d.className = 'memelist';
            emoticonPanel.appendChild(d);
            return d;
        })();
        const insertEmoticonPanel = (function () {
            let d = newDiv();
            d.className = 'insertEmoticonPanel';
            d.id = 'insertEmoticonPanel';
            d.style.display = 'none';
            let tb = newDiv();
            tb.className = 'topbar';
            d.appendChild(tb);
            let close = newDiv();
            close.textContent = ' × ';
            close.className = 'close';
            close.onclick = function () { d.style.display = 'none'; };
            d.appendChild(close);
            document.body.appendChild(d);
            let o = document.createElement('a');
            o.href = 'javascript:void(0);';
            o.textContent = '表情包管理';
            o.onclick = function () {
                emoticonPanel.removeClass('hidden').addClass('visible');
            };
            tb.appendChild(o);
            let a = document.createElement('a');
            a.href = 'javascript:void(0);';
            a.textContent = '使用表情包';
            a.onclick = function (ev) { showPanel(ev.clientX, ev.clientY); };
            sm.addSideBarLink(a);
            let mousePos = { x: 0, y: 0 }, pos = { x: 0, y: 0 }, isDrag = false;
            d.addEventListener('mousedown', function (ev) {
                var _a, _b;
                if (ev.target != this && ev.target != tb) {
                    isDrag = false;
                    return;
                }
                mousePos.x = ev.clientX;
                mousePos.y = ev.clientY;
                pos.x = parseInt((_a = this.style.getPropertyValue('--left')) !== null && _a !== void 0 ? _a : '0');
                pos.y = parseInt((_b = this.style.getPropertyValue('--top')) !== null && _b !== void 0 ? _b : '0');
                isDrag = true;
            });
            d.addEventListener('mousemove', function (ev) {
                if (!isDrag)
                    return;
                move(ev.clientX, ev.clientY);
            });
            d.addEventListener('mouseout', function (ev) {
                if (!isDrag)
                    return;
                move(ev.clientX, ev.clientY);
            });
            d.addEventListener('mouseup', function (ev) {
                if (isDrag)
                    isDrag = false;
            });
            return d;
            function move(x, y) {
                let width = (window.innerWidth || document.documentElement.clientWidth) - d.offsetWidth;
                let height = (window.innerHeight || document.documentElement.clientHeight) - d.offsetHeight;
                let dx = pos.x + x - mousePos.x;
                let dy = pos.y + y - mousePos.y;
                if (dx < 0)
                    dx = 0;
                else if (dx > width)
                    dx = width;
                if (dy < 0)
                    dy = 0;
                else if (dy > height)
                    dy = height;
                d.style.setProperty('--left', dx + 'px');
                d.style.setProperty('--top', dy + 'px');
            }
        })();
        const insertEmoticonPanelMain = (function () {
            let m = newDiv();
            m.className = 'main';
            insertEmoticonPanel.appendChild(m);
            return m;
        })();
        const insertEmoticonPanelBar = (function () {
            let bar = newDiv();
            bar.className = 'bar';
            insertEmoticonPanel.appendChild(bar);
            return bar;
        })();
        let chosenList = [];
        let enableList;
        let memeLoadList = [];
        let busyLock = [false, false];
        window.saltMCBBSCSS.putStyle(`.insertEmoticonPanel{position:fixed;top:var(--top, 10vh);left:var(--left, 10vw);width:var(--width, 30vw);min-width:360px;height:var(--height, 30vh);min-height:270px;padding:24px 0 0;background-color:#fefefe;background-clip:padding-box;border:8px solid rgba(0,0,0,0.2);border-radius:8px;user-select:none;z-index:15}.insertEmoticonPanel .main{width:100%;height:calc(100% - 40px);display:grid;grid-template-columns:repeat(auto-fill, minmax(60px, 1fr));grid-template-rows:repeat(auto-fill, minmax(60px, 1fr));overflow-y:auto;scrollbar-width:thin;scrollbar-color:#999 #eee}.insertEmoticonPanel .main::-webkit-scrollbar{width:4px;height:4px}.insertEmoticonPanel .main::-webkit-scrollbar-thumb{border-radius:2px;box-shadow:inset 0 0 4px rgba(102,102,102,0.25);background:#999}.insertEmoticonPanel .main::-webkit-scrollbar-track{box-shadow:inset 0 0 4px rgba(187,187,187,0.25);border-radius:1px;background:#eee}.insertEmoticonPanel .main>div{height:0;padding:50% 0;text-align:center;position:relative;background-color:#fefefe;outline:1px solid #999;overflow:hidden;cursor:pointer}.insertEmoticonPanel .main>div>div{position:absolute;top:0;left:0;width:100%;text-align:center}.insertEmoticonPanel .main>div img{max-width:100%;margin-top:50%;transform:translateY(-50%);transform-origin:50% 50%}.insertEmoticonPanel .main>div::after{content:attr(title);position:absolute;top:-100%;left:0;width:100%;padding:5px 0;background-color:rgba(255,255,255,0.5);transition:0.3s ease}.insertEmoticonPanel .main>div:hover::after{top:0}.insertEmoticonPanel .bar{width:100%;height:40px;white-space:nowrap;overflow-x:auto;scrollbar-width:thin;scrollbar-color:#999 #eee}.insertEmoticonPanel .bar::-webkit-scrollbar{width:4px;height:4px}.insertEmoticonPanel .bar::-webkit-scrollbar-thumb{border-radius:2px;box-shadow:inset 0 0 4px rgba(102,102,102,0.25);background:#999}.insertEmoticonPanel .bar::-webkit-scrollbar-track{box-shadow:inset 0 0 4px rgba(187,187,187,0.25);border-radius:1px;background:#eee}.insertEmoticonPanel .bar>div{display:inline-block;padding:8px;line-height:20px;text-align:center;background-color:#fbfbfb;border-left:1px solid #999;border-bottom:1px solid #999;border-top:1px solid #999;background-color:#fbfbfb;cursor:pointer}.insertEmoticonPanel .bar>div.select{border-top-color:transparent;background-color:#fff}.insertEmoticonPanel .bar>div:last-child{border-right:1px solid #999}.insertEmoticonPanel .close{position:absolute;top:0;right:0;width:24px;height:24px;padding:0;font-size:12px;text-align:center;cursor:pointer;transform-origin:50% 50%;transition:0.3s ease}.insertEmoticonPanel .close:hover{transform:scale(1.2)}.insertEmoticonPanel .topbar{position:absolute;top:0;width:calc(100% - 24px);height:24px;overflow:hidden;color:#3a74ad}.insertEmoticonPanel .topbar>a{float:right;height:24px;line-height:24px;color:#3a74ad}.insertEmoticonPanel .topbar>a:hover{color:#6cf}.pl .blockcode>em.importMemePack{right:74px}.nightS .insertEmoticonPanel{background-color:#444;color:#f0f0f0;border-color:rgba(153,153,153,0.2)}.nightS .insertEmoticonPanel .main>div{background-color:#444}.nightS .insertEmoticonPanel .main>div::after{background-color:rgba(34,34,34,0.5)}.nightS .insertEmoticonPanel .bar>div{background-color:#353535}.nightS .insertEmoticonPanel .bar>div.select{background-color:#555}
`, 'saltMCBBSEmoticon');
        yield db.waitForReady();
        (function () {
            let op = newDiv();
            op.className = 'op';
            addDiv('编辑', editMeme);
            addDiv('删除', deleteList);
            addDiv('导入', importMeme);
            addDiv('导出', exportMeme, '一次只能导出一个');
            addDiv('刷新', reflashList);
            emoticonPanel.appendChild(op);
            function addDiv(text, func, tip) {
                let d = newDiv();
                d.textContent = text;
                if (tip)
                    d.title = tip;
                d.onclick = func;
                op.appendChild(d);
            }
        })();
        reflashList();
        sm.docReady(() => {
            sm.saltQuery('.blockcode', (i, el) => {
                var _a;
                let li = el.querySelector('ol li');
                if (!li)
                    return;
                let s = (_a = li.textContent) !== null && _a !== void 0 ? _a : '';
                if (!(/^\s*\/[\/\*].*saltmcbbs\s*表情包/i.test(s)))
                    return;
                let em = document.createElement('em');
                em.textContent = '导入表情包';
                em.className = 'importMemePack';
                em.onclick = function () {
                    var _a;
                    if (!confirm('确定要导入表情包吗?'))
                        return;
                    let x = '';
                    for (let li of Array.from(el.querySelectorAll('ol li'))) {
                        x += ((_a = li.textContent) !== null && _a !== void 0 ? _a : '').replace(/\n$/, '') + '\n';
                    }
                    importMeme(x);
                };
                el.appendChild(em);
            });
        });
        function enableMeme(name) {
            let el = sm.readWithDefault('enableMemeList', []);
            if (el.indexOf(name) != -1)
                return;
            el.push(name);
            enableList = el;
            sm.write('enableMemeList', el);
        }
        function disableMeme(name) {
            let el = sm.readWithDefault('enableMemeList', []);
            if (el.indexOf(name) == -1)
                return;
            el = el.filter((v) => { return v != name; });
            enableList = el;
            sm.write('enableMemeList', el);
        }
        function deleteList() {
            return __awaiter(this, void 0, void 0, function* () {
                if (chosenList.length < 1)
                    return alert('请先选中一个表情');
                if (!(confirm('你确定要删除这' + chosenList.length + '个表情包吗？\n' + chosenList.join('、') + '\n删除后将无法恢复！')))
                    return;
                if (busyLock[1])
                    return;
                else
                    busyLock[1] = true;
                for (let mp of chosenList) {
                    disableMeme(mp);
                    yield db.delete(mp);
                }
                yield reflashList();
                busyLock[1] = false;
            });
        }
        function editMeme() {
            if (chosenList.length < 1)
                return alert('请先选中一个表情');
            let target = chosenList[0];
            for (let m of memeLoadList) {
                if (m.name != target)
                    continue;
                let cb = function (text) {
                    var _a, _b, _c, _d;
                    return __awaiter(this, void 0, void 0, function* () {
                        let n = sm.resolveMemePack(text);
                        if (n.memes.length < 1) {
                            alert('表情数量为0，不可修改！');
                            return;
                        }
                        n.name = m.name;
                        if (!(confirm(`“${n.name}”表情包修改确认：
老版本：作者 ${(_a = m.author) !== null && _a !== void 0 ? _a : '佚名'}，版本 ${(_b = m.version) !== null && _b !== void 0 ? _b : '未知版本'}，表情 ${m.memes.length}个
新版本：作者 ${(_c = n.author) !== null && _c !== void 0 ? _c : '佚名'}，版本 ${(_d = n.version) !== null && _d !== void 0 ? _d : '未知版本'}，表情 ${n.memes.length}个\n注意：修改后将无法恢复，建议在GitHub存档你的表情包`)))
                            return;
                        yield db.write(n.name, n);
                        reflashList();
                        alert('新版本的“' + n.name + '”已经存入数据库');
                    });
                };
                sm.inputBox({
                    defaultText: sm.formatMemePack(m),
                    acceptCallback: cb
                });
                return;
            }
        }
        function importMeme(text) {
            const cb = function (text) {
                var _a, _b, _c, _d, _e, _f, _g;
                return __awaiter(this, void 0, void 0, function* () {
                    let m = sm.resolveMemePack(text);
                    if (m.memes.length < 1) {
                        alert('表情数量为0，不可导入！');
                        return;
                    }
                    m.name = (_a = m.name) !== null && _a !== void 0 ? _a : '未命名的表情包';
                    let alreadyExist = yield db.has(m.name);
                    if (alreadyExist) {
                        let n = yield db.read(m.name, m);
                        if (!(confirm(`已经存在名为“${m.name}”的表情包
已有版本：作者 ${(_b = n.author) !== null && _b !== void 0 ? _b : '佚名'}，版本 ${(_c = n.version) !== null && _c !== void 0 ? _c : '未知版本'}，表情 ${n.memes.length}个
导入版本：作者 ${(_d = m.author) !== null && _d !== void 0 ? _d : '佚名'}，版本 ${(_e = m.version) !== null && _e !== void 0 ? _e : '未知版本'}，表情 ${m.memes.length}个\n是否覆盖？`)))
                            return;
                        if (n.memes.length >= m.memes.length && !(confirm('检测到新版本表情数量没有增加...\n此操作不可撤销，是否覆盖？')))
                            return;
                    }
                    else if (!confirm(`表情包信息：\n表情包名 ${m.name}，作者 ${(_f = m.author) !== null && _f !== void 0 ? _f : '佚名'}\n版本 ${(_g = m.version) !== null && _g !== void 0 ? _g : '未知版本'}，表情 ${m.memes.length}个\n确认导入？`))
                        return;
                    yield db.write(m.name, m);
                    enableMeme(m.name);
                    reflashList();
                    alert('新的表情包“' + m.name + '”已经存入数据库，默认启用');
                });
            };
            if (typeof text == 'string' && text.length > 0)
                cb(text);
            else
                sm.inputBox({
                    placeholder: '一次只能导入一个表情包，表情包封面图是表情包最后一张图',
                    acceptCallback: cb
                });
        }
        function exportMeme() {
            if (chosenList.length < 1)
                return alert('请先选中一个表情');
            let target = chosenList[0];
            for (let m of memeLoadList) {
                if (m.name != target)
                    continue;
                sm.inputBox({
                    defaultText: sm.formatMemePack(m)
                });
                return;
            }
        }
        function item(p) {
            var _a, _b, _c, _d, _e;
            p.name = simpleAntiXSS((_a = p.name) !== null && _a !== void 0 ? _a : '未命名的表情包');
            p.author = simpleAntiXSS((_b = p.author) !== null && _b !== void 0 ? _b : '佚名');
            p.version = simpleAntiXSS((_c = p.version) !== null && _c !== void 0 ? _c : '未知版本');
            p.license = simpleAntiXSS((_d = p.license) !== null && _d !== void 0 ? _d : '作者版权所有');
            let d = newDiv();
            d.className = 'memeitem';
            d.onclick = function () {
                if (chosenList.indexOf(p.name) != -1) {
                    chosenList = chosenList.filter((v) => { return v != p.name; });
                    d.removeClass('selected');
                }
                else {
                    chosenList.push(p.name);
                    d.addClass('selected');
                }
            };
            let img = document.createElement('img');
            img.alt = '表情包图片';
            img.src = ((_e = p.memes[p.memes.length - 1]) !== null && _e !== void 0 ? _e : { url: 'https://attachment.mcbbs.net/common/5f/common_110_icon.png' }).url;
            let r = document.createElement('p');
            r.innerHTML = `<big><b>${p.name}</b></big><br>作者：${p.author}<br>许可证：${p.license}<br>
表情数：${p.memes.length}个，版本：${p.version}
${p.others ? '<br>\n其他信息：' + simpleAntiXSS(p.others) : ''}`;
            let id = sm.randomID() + 'emoticon';
            let input = document.createElement('input');
            input.type = 'checkbox';
            input.id = id;
            input.checked = enableList.indexOf(p.name) != -1;
            input.hidden = true;
            input.onclick = function (e) {
                e.stopPropagation();
                if (input.checked)
                    enableMeme(p.name);
                else
                    disableMeme(p.name);
            };
            let lable = document.createElement('label');
            lable.className = 'checkbox';
            lable.htmlFor = id;
            lable.onclick = function (e) { e.stopPropagation(); };
            let div = newDiv();
            div.appendChild(input);
            div.appendChild(lable);
            d.appendChild(img);
            d.appendChild(r);
            d.appendChild(div);
            return d;
        }
        function reflashList() {
            return __awaiter(this, void 0, void 0, function* () {
                if (busyLock[0])
                    return;
                else
                    busyLock[0] = true;
                enableList = sm.readWithDefault('enableMemeList', []);
                chosenList = [];
                let allMemepackList = yield db.readAllValue();
                memeLoadList = allMemepackList;
                memeList.innerHTML = '';
                for (let meme of allMemepackList) {
                    memeList.appendChild(item(meme));
                }
                reflashInsertEmoticonPanel();
                busyLock[0] = false;
            });
        }
        function showPanel(x = 0, y = 0) {
            let d = insertEmoticonPanel;
            let windowWidth = window.innerWidth || document.documentElement.clientWidth;
            let windowHeight = window.innerHeight || document.documentElement.clientHeight;
            let panelWidth = Math.round(windowWidth * 0.35);
            let panelHeight = Math.round(windowHeight * 0.3);
            d.style.setProperty('--width', panelWidth + 'px');
            d.style.setProperty('--height', panelHeight + 'px');
            let left = (windowWidth - x) > panelWidth ? x : x - panelWidth;
            let top = (windowHeight - y) > panelHeight ? y : y - panelHeight;
            d.style.setProperty('--left', left + 'px');
            d.style.setProperty('--top', top + 'px');
            d.style.display = 'block';
            if (insertEmoticonPanelBar.innerHTML == '')
                reflashInsertEmoticonPanel();
        }
        function reflashInsertEmoticonPanel() {
            var _a, _b;
            insertEmoticonPanelBar.innerHTML = '';
            for (let pack of memeLoadList) {
                if (enableList.indexOf(pack.name) == -1)
                    continue;
                let btn = newDiv();
                btn.innerHTML = (_a = pack.name) !== null && _a !== void 0 ? _a : '未命名的表情包';
                btn.onclick = function () {
                    changePack(pack);
                    let pre = insertEmoticonPanelBar.querySelector('.select');
                    if (pre)
                        pre.classList.remove('select');
                    btn.addClass('select');
                };
                insertEmoticonPanelBar.appendChild(btn);
            }
            (_b = insertEmoticonPanelBar.querySelector('div')) === null || _b === void 0 ? void 0 : _b.click();
        }
        function changePack(pack) {
            insertEmoticonPanelMain.innerHTML = '';
            let lazyload = 0, tempList = [];
            for (let meme of pack.memes) {
                let a = newDiv(), b = newDiv(), img = document.createElement('img');
                a.title = meme.name;
                a.onclick = function () {
                    insertMeme(meme);
                };
                img.alt = meme.name;
                setTimeout(() => {
                    img.src = meme.url;
                }, Math.floor((10 * lazyload++) ** 0.5));
                b.appendChild(img);
                a.appendChild(b);
                tempList.push(a);
            }
            sm.addChildren(insertEmoticonPanelMain, tempList);
        }
        function insertMeme(meme) {
            var _a, _b, _c;
            let imgStr, imgHTML;
            if (typeof meme['width'] == 'undefined') {
                imgStr = `[img]${meme.url}[/img]`;
                imgHTML = '<img src="' + meme.url.replace(/([\"\<\>\&])/g, '\\$1') + '" />';
            }
            else {
                imgStr = `[img=${meme.width},${(_a = meme.height) !== null && _a !== void 0 ? _a : meme.width}]${meme.url}[/img]`;
                imgHTML = `<img src="${meme.url.replace(/([\"\<\>\&])/g, '\\$1')}" width=${meme.width} height=${(_b = meme.height) !== null && _b !== void 0 ? _b : meme.width} />`;
            }
            let focus = getFocus();
            if (!focus)
                return;
            if (focus instanceof HTMLBodyElement || focus.tagName.toUpperCase() == 'BODY') {
                if (!window.insertText) {
                    (0, eval)(`function insertText(text, movestart, moveend, select, sel) {checkFocus();if(wysiwyg) {try {if(!editdoc.execCommand('insertHTML', false, text)) {throw 'insertHTML Err';}} catch(e) {try {if(!isUndefined(editdoc.selection) && editdoc.selection.type != 'Text' && editdoc.selection.type != 'None') {movestart = false;editdoc.selection.clear();}range = isUndefined(sel) ? editdoc.selection.createRange() : sel;range.pasteHTML(text);if(text.indexOf('\n') == -1) {if(!isUndefined(movestart)) {range.moveStart('character', -strlen(text) + movestart);range.moveEnd('character', -moveend);} else if(movestart != false) {range.moveStart('character', -strlen(text));}if(!isUndefined(select) && select) {range.select();}}} catch(e) {if(!sel) {var sel = editdoc.getSelection();var range = sel.getRangeAt(0);} else {var range = sel;}if(range && range.insertNode) {range.deleteContents();}var frag = range.createContextualFragment(text);range.insertNode(frag);}}} else {if(!isUndefined(editdoc.selectionStart)) {if(editdoc._selectionStart) {editdoc.selectionStart = editdoc._selectionStart;editdoc.selectionEnd = editdoc._selectionEnd;editdoc._selectionStart = 0;editdoc._selectionEnd = 0;}var opn = editdoc.selectionStart + 0;editdoc.value = editdoc.value.substr(0, editdoc.selectionStart) + text + editdoc.value.substr(editdoc.selectionEnd);if(!isUndefined(movestart)) {editdoc.selectionStart = opn + movestart;editdoc.selectionEnd = opn + strlen(text) - moveend;} else if(movestart !== false) {editdoc.selectionStart = opn;editdoc.selectionEnd = opn + strlen(text);}} else if(document.selection && document.selection.createRange) {if(isUndefined(sel)) {sel = document.selection.createRange();}if(editbox.sel) {sel = editbox.sel;editbox.sel = null;}sel.text = text.replace(/\r?\n/g, '\r\n');if(!isUndefined(movestart)) {sel.moveStart('character', -strlen(text) +movestart);sel.moveEnd('character', -moveend);} else if(movestart !== false) {sel.moveStart('character', -strlen(text));}sel.select();} else {editdoc.value += text;}}checkFocus();}`);
                }
                window.insertText(imgHTML);
            }
            else if (focus instanceof HTMLInputElement || focus instanceof HTMLTextAreaElement) {
                let pos = (_c = focus.selectionStart) !== null && _c !== void 0 ? _c : 0;
                let v = focus.value;
                focus.value = v.slice(0, pos) + imgStr + v.slice(pos);
                setTimeout(() => { focus.selectionStart = pos + imgStr.length; }, 0);
            }
            function getFocus() {
                var _a, _b, _c;
                let TaId = ['e_textarea', 'fastpostmessage', 'postmessage', 'livereplymessage', 'replymessage'];
                let inputId = ['vmessage'];
                let editPage = (function () {
                    let p = document.querySelector('#postbox');
                    if (p && p.querySelector('iframe'))
                        return true;
                    return false;
                })();
                let a = document.activeElement;
                if (a) {
                    if (a instanceof HTMLTextAreaElement) {
                        if (((_a = a.id) !== null && _a !== void 0 ? _a : '').length < 1 || TaId.indexOf((_b = a.id) !== null && _b !== void 0 ? _b : '') == -1)
                            return null;
                        if (!editPage)
                            return a;
                        if (a.style.display != 'none')
                            return a;
                    }
                    if (a instanceof HTMLBodyElement && a.contentEditable == 'true') {
                        let iframe = document.querySelector('#postbox').querySelector('iframe');
                        if (iframe.style.display != 'none')
                            return a;
                        return document.querySelector('#postbox').querySelector('textarea');
                    }
                    if (a instanceof HTMLInputElement)
                        if (inputId.indexOf((_c = a.id) !== null && _c !== void 0 ? _c : '') != -1)
                            return a;
                }
                if (editPage) {
                    let ta = document.querySelector('#postbox').querySelector('textarea');
                    if (ta.style.display != 'none')
                        return ta;
                    let iframe = document.querySelector('#postbox').querySelector('iframe');
                    if (iframe.contentDocument && iframe.contentDocument.body && iframe.contentDocument.body.contentEditable == 'true')
                        return iframe.contentDocument.body;
                }
                else {
                    for (let s of [...TaId, ...inputId]) {
                        let el = document.getElementById(s);
                        if (el && el.allInViewport() && el.style.display != 'none')
                            return el;
                    }
                }
                return null;
            }
        }
    });
})();
