// ==UserScript==
// @name              IwaraZip Enhancement
// @description       Enhancement IwaraZip
// @name:zh-CN        IwaraZip 增强
// @description:zh-CN 增强 IwaraZip 使用体验
// @icon              https://www.iwara.zip/themes/spirit/assets/images/favicon/favicon.ico
// @namespace         https://github.com/dawn-lc/
// @author            dawn-lc
// @license           Apache-2.0
// @copyright         2024, Dawnlc (https://dawnlc.me/)
// @source            https://github.com/dawn-lc/IwaraZipEnhancement
// @supportURL        https://github.com/dawn-lc/IwaraZipEnhancement/issues
// @connect           iwara.zip
// @connect           *.iwara.zip
// @connect           localhost
// @connect           127.0.0.1
// @connect           *
// @match             *://*.iwara.zip/*
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_listValues
// @grant             GM_deleteValue
// @grant             GM_addValueChangeListener
// @grant             GM_addStyle
// @grant             GM_addElement
// @grant             GM_getResourceText
// @grant             GM_setClipboard
// @grant             GM_download
// @grant             GM_xmlhttpRequest
// @grant             GM_openInTab
// @grant             GM_info
// @grant             unsafeWindow
// @run-at            document-start
// @require           https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/src/toastify.min.js
// @resource          toastify-css https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/src/toastify.min.css
// @version           0.1.15
// @downloadURL https://update.greasyfork.org/scripts/514667/IwaraZip%20Enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/514667/IwaraZip%20Enhancement.meta.js
// ==/UserScript==
(function () {
    const originalFetch = unsafeWindow.fetch;
    const originalNodeAppendChild = unsafeWindow.Node.prototype.appendChild;
    const originalAddEventListener = unsafeWindow.EventTarget.prototype.addEventListener;
    const isNull = (obj) => typeof obj === 'undefined' || obj === null;
    const isObject = (obj) => !isNull(obj) && typeof obj === 'object' && !Array.isArray(obj);
    const isString = (obj) => !isNull(obj) && typeof obj === 'string';
    const isNumber = (obj) => !isNull(obj) && typeof obj === 'number';
    const isElement = (obj) => !isNull(obj) && obj instanceof Element;
    const isNode = (obj) => !isNull(obj) && obj instanceof Node;
    const isStringTupleArray = (obj) => Array.isArray(obj) && obj.every(item => Array.isArray(item) && item.length === 2 && typeof item[0] === 'string' && typeof item[1] === 'string');
    const hasFunction = (obj, method) => {
        return !method.isEmpty() && !isNull(obj) ? method in obj && typeof obj[method] === 'function' : false;
    };
    const getString = (obj) => {
        obj = obj instanceof Error ? String(obj) : obj;
        obj = obj instanceof Date ? obj.format('YYYY-MM-DD') : obj;
        return typeof obj === 'object' ? JSON.stringify(obj, null, 2) : String(obj);
    };
    Array.prototype.any = function () {
        return this.prune().length > 0;
    };
    Array.prototype.prune = function () {
        return this.filter(i => i !== null && typeof i !== 'undefined');
    };
    Array.prototype.unique = function (prop) {
        return this.filter((item, index, self) => index === self.findIndex((t) => (prop ? t[prop] === item[prop] : t === item)));
    };
    Array.prototype.union = function (that, prop) {
        return [...this, ...that].unique(prop);
    };
    Array.prototype.intersect = function (that, prop) {
        return this.filter((item) => that.some((t) => prop ? t[prop] === item[prop] : t === item)).unique(prop);
    };
    Array.prototype.difference = function (that, prop) {
        return this.filter((item) => !that.some((t) => prop ? t[prop] === item[prop] : t === item)).unique(prop);
    };
    Array.prototype.complement = function (that, prop) {
        return this.union(that, prop).difference(this.intersect(that, prop), prop);
    };
    String.prototype.isEmpty = function () {
        return !isNull(this) && this.length === 0;
    };
    String.prototype.among = function (start, end, greedy = false) {
        if (this.isEmpty() || start.isEmpty() || end.isEmpty())
            return '';
        const startIndex = this.indexOf(start);
        if (startIndex === -1)
            return '';
        const adjustedStartIndex = startIndex + start.length;
        const endIndex = greedy ? this.lastIndexOf(end) : this.indexOf(end, adjustedStartIndex);
        if (endIndex === -1 || endIndex < adjustedStartIndex)
            return '';
        return this.slice(adjustedStartIndex, endIndex);
    };
    String.prototype.splitLimit = function (separator, limit) {
        if (this.isEmpty() || isNull(separator)) {
            throw new Error('Empty');
        }
        let body = this.split(separator);
        return limit ? body.slice(0, limit).concat(body.slice(limit).join(separator)) : body;
    };
    String.prototype.truncate = function (maxLength) {
        return this.length > maxLength ? this.substring(0, maxLength) : this.toString();
    };
    String.prototype.trimHead = function (prefix) {
        return this.startsWith(prefix) ? this.slice(prefix.length) : this.toString();
    };
    String.prototype.trimTail = function (suffix) {
        return this.endsWith(suffix) ? this.slice(0, -suffix.length) : this.toString();
    };
    String.prototype.toURL = function () {
        let URLString = this;
        if (URLString.split('//')[0].isEmpty()) {
            URLString = `${unsafeWindow.location.protocol}${URLString}`;
        }
        return new URL(URLString.toString());
    };
    Array.prototype.append = function (arr) {
        this.push(...arr);
    };
    String.prototype.replaceVariable = function (replacements, count = 0) {
        let replaceString = this.toString();
        try {
            replaceString = Object.entries(replacements).reduce((str, [key, value]) => {
                if (str.includes(`%#${key}:`)) {
                    let format = str.among(`%#${key}:`, '#%').toString();
                    return str.replaceAll(`%#${key}:${format}#%`, getString(hasFunction(value, 'format') ? value.format(format) : value));
                }
                else {
                    return str.replaceAll(`%#${key}#%`, getString(value));
                }
            }, replaceString);
            count++;
            return Object.keys(replacements).map((key) => this.includes(`%#${key}#%`)).includes(true) && count < 128 ? replaceString.replaceVariable(replacements, count) : replaceString;
        }
        catch (error) {
            GM_getValue('isDebug') && console.log(`replace variable error: ${getString(error)}`);
            return replaceString;
        }
    };
    function prune(obj) {
        if (Array.isArray(obj)) {
            return obj.filter(isNotEmpty).map(prune);
        }
        if (isElement(obj) || isNode(obj)) {
            return obj;
        }
        if (isObject(obj)) {
            return Object.fromEntries(Object.entries(obj)
                .filter(([key, value]) => isNotEmpty(value))
                .map(([key, value]) => [key, prune(value)]));
        }
        return isNotEmpty(obj) ? obj : undefined;
    }
    function isNotEmpty(obj) {
        if (isNull(obj)) {
            return false;
        }
        if (Array.isArray(obj)) {
            return obj.some(isNotEmpty);
        }
        if (isString(obj)) {
            return !obj.isEmpty();
        }
        if (isNumber(obj)) {
            return !Number.isNaN(obj);
        }
        if (isElement(obj) || isNode(obj)) {
            return true;
        }
        if (isObject(obj)) {
            return Object.values(obj).some(isNotEmpty);
        }
        return true;
    }
    const fetch = (input, init, force) => {
        if (init && init.headers && isStringTupleArray(init.headers))
            throw new Error("init headers Error");
        if (init && init.method && !(init.method === 'GET' || init.method === 'HEAD' || init.method === 'POST'))
            throw new Error("init method Error");
        return force || (typeof input === 'string' ? input : input.url).toURL().hostname !== unsafeWindow.location.hostname ? new Promise((resolve, reject) => {
            GM_xmlhttpRequest(prune({
                method: (init && init.method) || 'GET',
                url: typeof input === 'string' ? input : input.url,
                headers: (init && init.headers) || {},
                data: ((init && init.body) || null),
                onload: function (response) {
                    resolve(new Response(response.responseText, {
                        status: response.status,
                        statusText: response.statusText,
                    }));
                },
                onerror: function (error) {
                    reject(error);
                }
            }));
        }) : originalFetch(input, init);
    };
    const UUID = function () {
        return Array.from({ length: 8 }, () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)).join('');
    };
    const ceilDiv = function (dividend, divisor) {
        return Math.floor(dividend / divisor) + (dividend % divisor > 0 ? 1 : 0);
    };
    const language = function () {
        let env = (!isNull(config) ? config.language : (navigator.language ?? navigator.languages[0] ?? 'en')).replace('-', '_');
        let main = env.split('_').shift() ?? 'en';
        return (!isNull(i18n[env]) ? env : !isNull(i18n[main]) ? main : 'en');
    };
    const renderNode = function (renderCode) {
        renderCode = prune(renderCode);
        if (isNull(renderCode))
            throw new Error("RenderCode null");
        if (typeof renderCode === 'string') {
            return document.createTextNode(renderCode.replaceVariable(i18n[language()]).toString());
        }
        if (renderCode instanceof Node) {
            return renderCode;
        }
        if (typeof renderCode !== 'object' || !renderCode.nodeType) {
            throw new Error('Invalid arguments');
        }
        const { nodeType, attributes, events, className, childs } = renderCode;
        const node = document.createElement(nodeType);
        (!isNull(attributes) && Object.keys(attributes).any()) && Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value));
        (!isNull(events) && Object.keys(events).any()) && Object.entries(events).forEach(([eventName, eventHandler]) => originalAddEventListener.call(node, eventName, eventHandler));
        (!isNull(className) && className.length > 0) && node.classList.add(...[].concat(className));
        !isNull(childs) && node.append(...[].concat(childs).map(renderNode));
        return node;
    };
    let ToastType;
    (function (ToastType) {
        ToastType[ToastType["Log"] = 0] = "Log";
        ToastType[ToastType["Info"] = 1] = "Info";
        ToastType[ToastType["Warn"] = 2] = "Warn";
        ToastType[ToastType["Error"] = 3] = "Error";
    })(ToastType || (ToastType = {}));
    let VersionState;
    (function (VersionState) {
        VersionState[VersionState["Low"] = 0] = "Low";
        VersionState[VersionState["Equal"] = 1] = "Equal";
        VersionState[VersionState["High"] = 2] = "High";
    })(VersionState || (VersionState = {}));
    class Version {
        constructor(versionString) {
            const [version, preRelease, buildMetadata] = versionString.split(/[-+]/);
            const versionParts = version.split('.').map(Number);
            this.major = versionParts[0] || 0;
            this.minor = versionParts.length > 1 ? versionParts[1] : 0;
            this.patch = versionParts.length > 2 ? versionParts[2] : 0;
            this.preRelease = preRelease ? preRelease.split('.') : [];
            this.buildMetadata = buildMetadata;
        }
        compare(other) {
            const compareSegment = (a, b) => {
                if (a < b) {
                    return VersionState.Low;
                }
                else if (a > b) {
                    return VersionState.High;
                }
                return VersionState.Equal;
            };
            let state = compareSegment(this.major, other.major);
            if (state !== VersionState.Equal)
                return state;
            state = compareSegment(this.minor, other.minor);
            if (state !== VersionState.Equal)
                return state;
            state = compareSegment(this.patch, other.patch);
            if (state !== VersionState.Equal)
                return state;
            for (let i = 0; i < Math.max(this.preRelease.length, other.preRelease.length); i++) {
                const pre1 = this.preRelease[i];
                const pre2 = other.preRelease[i];
                if (pre1 === undefined && pre2 !== undefined) {
                    return VersionState.High;
                }
                else if (pre1 !== undefined && pre2 === undefined) {
                    return VersionState.Low;
                }
                if (pre1 !== undefined && pre2 !== undefined) {
                    state = compareSegment(isNaN(+pre1) ? pre1 : +pre1, isNaN(+pre2) ? pre2 : +pre2);
                    if (state !== VersionState.Equal)
                        return state;
                }
            }
            return VersionState.Equal;
        }
    }
    if (GM_getValue('isDebug')) {
        console.log(getString(GM_info));
        debugger;
    }
    let DownloadType;
    (function (DownloadType) {
        DownloadType[DownloadType["Aria2"] = 0] = "Aria2";
        DownloadType[DownloadType["Browser"] = 1] = "Browser";
        DownloadType[DownloadType["Others"] = 2] = "Others";
    })(DownloadType || (DownloadType = {}));
    class I18N {
        constructor() {
            this.zh_CN = this['zh'];
            this.zh = {
                appName: 'IwaraZip 增强',
                language: '语言: ',
                downloadPath: '下载到: ',
                downloadProxy: '下载代理: ',
                downloadProxyUser: '代理用户名: ',
                downloadProxyPassword: '下载密码: ',
                aria2Path: 'Aria2 RPC: ',
                aria2Token: 'Aria2 密钥: ',
                rename: '重命名',
                save: '保存',
                reset: '重置',
                ok: '确定',
                on: '开启',
                off: '关闭',
                isDebug: '调试模式',
                downloadType: '下载方式',
                browserDownload: '浏览器下载',
                configurationIncompatible: '检测到不兼容的配置文件，请重新配置！',
                browserDownloadNotEnabled: `未启用下载功能！`,
                browserDownloadNotWhitelisted: `请求的文件扩展名未列入白名单！`,
                browserDownloadNotPermitted: `下载功能已启用，但未授予下载权限！`,
                browserDownloadNotSupported: `目前浏览器/版本不支持下载功能！`,
                browserDownloadNotSucceeded: `下载未开始或失败！`,
                browserDownloadUnknownError: `未知错误，有可能是下载时提供的参数存在问题，请检查文件名是否合法！`,
                browserDownloadTimeout: `下载超时，请检查网络环境是否正常！`,
                loadingCompleted: '加载完成',
                settings: '打开设置',
                configError: '脚本配置中存在错误，请修改。',
                alreadyKnowHowToUse: '我已知晓如何使用!!!',
                notice: [
                    { nodeType: 'br' },
                    '测试版本，发现问题请前往GitHub反馈！'
                ],
                pushTaskSucceed: '推送下载任务成功！',
                connectionTest: '连接测试',
                settingsCheck: '配置检查',
                createTask: '创建任务',
                downloadPathError: '下载路径错误!',
                browserDownloadModeError: '请启用脚本管理器的浏览器API下载模式!',
                parsingProgress: '解析进度: ',
                downloadFailed: '下载失败！',
                downloadThis: '下载当前',
                downloadAll: '下载所有',
                allCompleted: '全部完成！',
                pushTaskFailed: '推送下载任务失败！'
            };
        }
    }
    class Config {
        constructor() {
            this.language = language();
            this.downloadType = DownloadType.Others;
            this.downloadPath = '/IwaraZip/%#FileName#%';
            this.downloadProxy = '';
            this.downloadProxyUser = '';
            this.downloadProxyPassword = '';
            this.aria2Path = 'http://127.0.0.1:6800/jsonrpc';
            this.aria2Token = '';
            let body = new Proxy(this, {
                get: function (target, property) {
                    if (property === 'configChange') {
                        return target.configChange;
                    }
                    let value = GM_getValue(property, target[property]);
                    GM_getValue('isDebug') && console.log(`get: ${property} ${getString(value)}`);
                    return value;
                },
                set: function (target, property, value) {
                    if (property === 'configChange') {
                        target.configChange = value;
                        return true;
                    }
                    GM_setValue(property, value);
                    GM_getValue('isDebug') && console.log(`set: ${property} ${getString(value)}`);
                    target.configChange(property);
                    return true;
                }
            });
            GM_listValues().forEach((value) => {
                GM_addValueChangeListener(value, (name, old_value, new_value, remote) => {
                    GM_getValue('isDebug') && console.log(`$Is Remote: ${remote} Change Value: ${name}`);
                    if (remote && !isNull(body.configChange))
                        body.configChange(name);
                });
            });
            return body;
        }
        async check() {
            switch (this.downloadType) {
                case DownloadType.Aria2:
                    return await aria2Check();
                case DownloadType.Browser:
                    return await EnvCheck();
                default:
                    break;
            }
            return true;
        }
    }
    class configEdit {
        constructor(config) {
            this.target = config;
            this.target.configChange = (item) => { this.configChange.call(this, item); };
            this.interfacePage = renderNode({
                nodeType: 'p'
            });
            let save = renderNode({
                nodeType: 'button',
                childs: '%#save#%',
                attributes: {
                    title: i18n[language()].save
                },
                events: {
                    click: async () => {
                        save.disabled = !save.disabled;
                        if (await this.target.check()) {
                            unsafeWindow.location.reload();
                        }
                        save.disabled = !save.disabled;
                    }
                }
            });
            let reset = renderNode({
                nodeType: 'button',
                childs: '%#reset#%',
                attributes: {
                    title: i18n[language()].reset
                },
                events: {
                    click: () => {
                        firstRun();
                        unsafeWindow.location.reload();
                    }
                }
            });
            this.interface = renderNode({
                nodeType: 'div',
                attributes: {
                    id: 'pluginConfig'
                },
                childs: [
                    {
                        nodeType: 'div',
                        className: 'main',
                        childs: [
                            {
                                nodeType: 'h2',
                                childs: '%#appName#%'
                            },
                            {
                                nodeType: 'label',
                                childs: [
                                    '%#language#% ',
                                    {
                                        nodeType: 'input',
                                        className: 'inputRadioLine',
                                        attributes: Object.assign({
                                            name: 'language',
                                            type: 'text',
                                            value: this.target.language
                                        }),
                                        events: {
                                            change: (event) => {
                                                this.target.language = event.target.value;
                                            }
                                        }
                                    }
                                ]
                            },
                            this.downloadTypeSelect(),
                            this.interfacePage,
                            this.switchButton('isDebug', GM_getValue, (name, e) => { GM_setValue(name, e.target.checked); }, false),
                        ]
                    },
                    {
                        nodeType: 'p',
                        className: 'buttonList',
                        childs: [
                            reset,
                            save
                        ]
                    }
                ]
            });
        }
        switchButton(name, get, set, defaultValue) {
            let button = renderNode({
                nodeType: 'p',
                className: 'inputRadioLine',
                childs: [
                    {
                        nodeType: 'label',
                        childs: `%#${name}#%`,
                        attributes: {
                            for: name
                        }
                    }, {
                        nodeType: 'input',
                        className: 'switch',
                        attributes: {
                            type: 'checkbox',
                            name: name,
                        },
                        events: {
                            change: (e) => {
                                if (set !== undefined) {
                                    set(name, e);
                                    return;
                                }
                                else {
                                    this.target[name] = e.target.checked;
                                }
                            }
                        }
                    }
                ]
            });
            return button;
        }
        inputComponent(name, type, get, set) {
            return {
                nodeType: 'label',
                childs: [
                    `%#${name}#% `,
                    {
                        nodeType: 'input',
                        attributes: Object.assign({
                            name: name,
                            type: type ?? 'text',
                            value: get !== undefined ? get(name) : this.target[name]
                        }),
                        events: {
                            change: (e) => {
                                if (set !== undefined) {
                                    set(name, e);
                                    return;
                                }
                                else {
                                    this.target[name] = e.target.value;
                                }
                            }
                        }
                    }
                ]
            };
        }
        downloadTypeSelect() {
            let select = renderNode({
                nodeType: 'p',
                className: 'inputRadioLine',
                childs: [
                    `%#downloadType#%`,
                    {
                        nodeType: 'select',
                        childs: Object.keys(DownloadType).filter((i) => isNaN(Number(i))).map((i) => renderNode({
                            nodeType: 'option',
                            childs: i
                        })),
                        attributes: {
                            name: 'downloadType'
                        },
                        events: {
                            change: (e) => {
                                this.target.downloadType = e.target.selectedIndex;
                            }
                        }
                    }
                ]
            });
            select.selectedIndex = Number(this.target.downloadType);
            return select;
        }
        configChange(item) {
            switch (item) {
                case 'downloadType':
                    this.interface.querySelector(`[name=${item}]`).selectedIndex = Number(this.target.downloadType);
                    this.pageChange();
                    break;
                case 'checkPriority':
                    this.pageChange();
                    break;
                default:
                    let element = this.interface.querySelector(`[name=${item}]`);
                    if (element) {
                        switch (element.type) {
                            case 'radio':
                                element.value = this.target[item];
                                break;
                            case 'checkbox':
                                element.checked = this.target[item];
                                break;
                            case 'text':
                            case 'password':
                                element.value = this.target[item];
                                break;
                            default:
                                break;
                        }
                    }
                    break;
            }
        }
        pageChange() {
            while (this.interfacePage.hasChildNodes()) {
                this.interfacePage.removeChild(this.interfacePage.firstChild);
            }
            let downloadConfigInput = [
                renderNode(this.inputComponent('downloadPath')),
                renderNode(this.inputComponent('downloadProxy')),
                renderNode(this.inputComponent('downloadProxyUser')),
                renderNode(this.inputComponent('downloadProxyPassword')),
            ];
            let aria2ConfigInput = [
                renderNode(this.inputComponent('aria2Path')),
                renderNode(this.inputComponent('aria2Token', 'password'))
            ];
            let BrowserConfigInput = [
                renderNode(this.inputComponent('downloadPath'))
            ];
            switch (this.target.downloadType) {
                case DownloadType.Aria2:
                    downloadConfigInput.map(i => originalNodeAppendChild.call(this.interfacePage, i));
                    aria2ConfigInput.map(i => originalNodeAppendChild.call(this.interfacePage, i));
                    break;
                default:
                    BrowserConfigInput.map(i => originalNodeAppendChild.call(this.interfacePage, i));
                    break;
            }
            if (this.target.checkPriority) {
                originalNodeAppendChild.call(this.interfacePage, renderNode(this.inputComponent('downloadPriority')));
            }
        }
        inject() {
            if (!unsafeWindow.document.querySelector('#pluginConfig')) {
                originalNodeAppendChild.call(unsafeWindow.document.body, this.interface);
                this.configChange('downloadType');
            }
        }
    }
    class menu {
        constructor() {
            this.interfacePage = renderNode({
                nodeType: 'ul'
            });
            this.interface = renderNode({
                nodeType: 'div',
                attributes: {
                    id: 'pluginMenu'
                },
                childs: this.interfacePage
            });
        }
        button(name, click) {
            return renderNode(prune({
                nodeType: 'li',
                childs: `%#${name}#%`,
                events: {
                    click: (event) => {
                        click(name, event);
                        event.stopPropagation();
                        return false;
                    }
                }
            }));
        }
        inject() {
            if (!unsafeWindow.document.querySelector('#pluginMenu')) {
                let downloadThisButton = this.button('downloadThis', async (name, event) => {
                    let title = unsafeWindow.document.querySelector('.image-name-title');
                    let downloadButton = unsafeWindow.document.querySelector('button[onclick^="openUrl"]');
                    pushDownloadTask(new FileInfo(title.innerText, downloadButton.getAttribute('onclick').among("openUrl('", "');", true)));
                });
                let downloadAllButton = this.button('downloadAll', (name, event) => {
                    manageDownloadTaskQueue();
                });
                let settingsButton = this.button('settings', (name, event) => {
                    editConfig.inject();
                });
                originalNodeAppendChild.call(this.interfacePage, downloadAllButton);
                originalNodeAppendChild.call(this.interfacePage, downloadThisButton);
                originalNodeAppendChild.call(this.interfacePage, settingsButton);
                originalNodeAppendChild.call(unsafeWindow.document.body, this.interface);
            }
        }
    }
    class FileInfo {
        constructor(name, url) {
            if (!isNull(name) || !isNull(url)) {
                this.url = url.toURL();
                this.name = name;
                this.isInit = true;
            }
        }
        async init(element) {
            if (!isNull(element)) {
                this.url = new URL(`${element.getAttribute('dtfullurl')}/${element.getAttribute('dtsafefilenameforurl')}`);
                this.name = element.getAttribute('dtfilename');
                this.fileID = element.getAttribute('fileid');
                let details = await (await fetch("https://www.iwara.zip/account/ajax/file_details", {
                    "headers": {
                        "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
                    },
                    "referrer": "https://www.iwara.zip/",
                    "body": `u=${this.fileID}&p=true`,
                    "method": "POST"
                })).json();
                this.token = details.html.among('download_token=', '\'');
                this.url.searchParams.append("download_token", this.token);
            }
            return this;
        }
    }
    GM_addStyle(GM_getResourceText('toastify-css'));
    GM_addStyle(`

        :root {
            --body: #f2f2f2;
            --body-alt: #ededed;
            --body-dark: #e8e8e8;
            --body-darker: #dedede;
            --text: #444;
            --muted: #848484;
            --error: #be5046;
            --error-text: #f8f8ff;
            --danger: #be5046;
            --danger-dark: #7b1a11;
            --danger-text: #f8f8ff;
            --warning: #dda82b;
            --warning-dark: #dda82b;
            --warning-text: white;
            --success: #45aa63;
            --wura: #dda82b;
            --primary: #1abc9c;
            --primary-text: #f8f8ff;
            --primary-dark: #19b898;
            --primary-faded: rgba(26, 188, 156, 0.2);
            --secondary: #ff004b;
            --secondary-dark: #eb0045;
            --white: #f8f8ff;
            --red: #c64a4a;
            --green: green;
            --yellow: yellow;
            --blue: blue;
            --admin-color: #d98350;
            --moderator-color: #9889ff;
            --premium-color: #ff62cd;
            color: var(--text)
        }

        .rainbow-text {
            background-image: linear-gradient(to right, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #8b00ff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-size: 600% 100%;
            animation: rainbow 0.5s infinite linear;
        }
        @keyframes rainbow {
            0% {
                background-position: 0% 0%;
            }
            100% {
                background-position: 100% 0%;
            }
        }

        #pluginMenu {
            z-index: 2147483644;
            color: white;
            position: fixed;
            top: 50%;
            right: 0px;
            padding: 10px;
            background-color: #565656;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-shadow: 0 0 10px #ccc;
            transform: translate(2%, -50%);
        }
        #pluginMenu ul {
            list-style: none;
            margin: 0;
            padding: 0;
        }
        #pluginMenu li {
            padding: 5px 10px;
            cursor: pointer;
            text-align: center;
            user-select: none;
        }
        #pluginMenu li:hover {
            background-color: #000000cc;
            border-radius: 3px;
        }

        #pluginConfig {
            color: var(--text);
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.75);
            z-index: 2147483646; 
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        #pluginConfig .main {
            background-color: var(--body);
            padding: 24px;
            margin: 10px;
            overflow-y: auto;
            width: 400px;
        }
        #pluginConfig .buttonList {
            display: flex;
            flex-direction: row;
            justify-content: center;
        }
        @media (max-width: 640px) {
            #pluginConfig .main {
                width: 100%;
            }
        }
        #pluginConfig button {
            background-color: blue;
            margin: 0px 20px 0px 20px;
            padding: 10px 20px;
            color: white;
            font-size: 18px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        #pluginConfig button {
            background-color: blue;
        }
        #pluginConfig button[disabled] {
            background-color: darkgray;
            cursor: not-allowed;
        }
        #pluginConfig p {
            display: flex;
            flex-direction: column;
        }
        #pluginConfig p label{
            display: flex;
            flex-direction: column;
            margin: 5px 0 5px 0;
        }
        #pluginConfig .inputRadioLine {
            display: flex;
            align-items: center;
            flex-direction: row;
            justify-content: space-between;
        }
        #pluginConfig input[type="text"], #pluginConfig input[type="password"] {
            outline: none;
            border-top: none;
            border-right: none;
            border-left: none;
            border-image: initial;
            border-bottom: 1px solid var(--muted);
            line-height: 1;
            height: 30px;
            box-sizing: border-box;
            width: 100%;
            background-color: var(--body);
            color: var(--text);
        }
        #pluginConfig input[type='checkbox'].switch{
            outline: none;
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
            position: relative;
            width: 40px;
            height: 20px;
            background: #ccc;
            border-radius: 10px;
            transition: border-color .2s, background-color .2s;
        }
        #pluginConfig input[type='checkbox'].switch::after {
            content: '';
            display: inline-block;
            width: 40%;
            height: 80%;
            border-radius: 50%;
            background: #fff;
            box-shadow: 0, 0, 2px, #999;
            transition: .2s;
            top: 2px;
            position: absolute;
            right: 55%;
        }
        #pluginConfig input[type='checkbox'].switch:checked {
            background: rgb(19, 206, 102);
        }
        #pluginConfig input[type='checkbox'].switch:checked::after {
            content: '';
            position: absolute;
            right: 2px;
            top: 2px;
        }

        #pluginOverlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.75);
            z-index: 2147483645; 
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        #pluginOverlay .main {
            color: white;
            font-size: 24px;
            width: 60%;
            background-color: rgba(64, 64, 64, 0.75);
            padding: 24px;
            margin: 10px;
            overflow-y: auto;
        }
        @media (max-width: 640px) {
            #pluginOverlay .main {
                width: 100%;
            }
        }
        #pluginOverlay button {
            padding: 10px 20px;
            color: white;
            font-size: 18px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        #pluginOverlay button {
            background-color: blue;
        }
        #pluginOverlay button[disabled] {
            background-color: darkgray;
            cursor: not-allowed;
        }
        #pluginOverlay .checkbox {
            width: 32px;
            height: 32px;
            margin: 0 4px 0 0;
            padding: 0;
        }
        #pluginOverlay .checkbox-container {
            display: flex;
            align-items: center;
            margin: 0 0 10px 0;
        }
        #pluginOverlay .checkbox-label {
            color: white;
            font-size: 32px;
            font-weight: bold;
            margin-left: 10px;
            display: flex;
            align-items: center;
        }

        .toastify h3 {
            margin: 0 0 10px 0;
        }
        .toastify p {
            margin: 0 ;
        }
    `);
    var i18n = new I18N();
    var config = new Config();
    var editConfig = new configEdit(config);
    var pluginMenu = new menu();
    function toastNode(body, title) {
        return renderNode({
            nodeType: 'div',
            childs: [
                !isNull(title) && !title.isEmpty() ? {
                    nodeType: 'h3',
                    childs: `%#appName#% - ${title}`
                } : {
                    nodeType: 'h3',
                    childs: '%#appName#%'
                },
                {
                    nodeType: 'p',
                    childs: body
                }
            ]
        });
    }
    function getTextNode(node) {
        return node.nodeType === Node.TEXT_NODE
            ? node.textContent || ''
            : node.nodeType === Node.ELEMENT_NODE
                ? Array.from(node.childNodes)
                    .map(getTextNode)
                    .join('')
                : '';
    }
    function newToast(type, params) {
        const logFunc = {
            [ToastType.Warn]: console.warn,
            [ToastType.Error]: console.error,
            [ToastType.Log]: console.log,
            [ToastType.Info]: console.info,
        }[type] || console.log;
        params = Object.assign({
            newWindow: true,
            gravity: 'top',
            position: 'left',
            stopOnFocus: true
        }, type === ToastType.Warn && {
            duration: -1,
            style: {
                background: 'linear-gradient(-30deg, rgb(119 76 0), rgb(255 165 0))'
            }
        }, type === ToastType.Error && {
            duration: -1,
            style: {
                background: 'linear-gradient(-30deg, rgb(108 0 0), rgb(215 0 0))'
            }
        }, !isNull(params) && params);
        if (!isNull(params.text)) {
            params.text = params.text.replaceVariable(i18n[language()]).toString();
        }
        logFunc((!isNull(params.text) ? params.text : !isNull(params.node) ? getTextNode(params.node) : 'undefined').replaceVariable(i18n[language()]));
        return Toastify(params);
    }
    function analyzeLocalPath(path) {
        let matchPath = path.replaceAll('//', '/').replaceAll('\\\\', '/').match(/^([a-zA-Z]:)?[\/\\]?([^\/\\]+[\/\\])*([^\/\\]+\.\w+)$/);
        if (isNull(matchPath))
            throw new Error(`%#downloadPathError#%["${path}"]`);
        try {
            return {
                fullPath: matchPath[0],
                drive: matchPath[1] || '',
                filename: matchPath[3]
            };
        }
        catch (error) {
            throw new Error(`%#downloadPathError#% ["${matchPath.join(',')}"]`);
        }
    }
    function pushDownloadTask(fileInfo) {
        switch (config.downloadType) {
            case DownloadType.Aria2:
                aria2Download(fileInfo);
                break;
            case DownloadType.Browser:
                browserDownload(fileInfo);
                break;
            default:
                othersDownload(fileInfo);
                break;
        }
    }
    async function manageDownloadTaskQueue() {
        let list = document.querySelectorAll('div[fileid]');
        let size = list.length;
        let node = renderNode({
            nodeType: 'p',
            childs: `%#parsingProgress#%[${list.length}/${size}]`
        });
        let start = newToast(ToastType.Info, {
            node: node,
            duration: -1
        });
        start.showToast();
        for (let index = 0; index < list.length; index++) {
            pushDownloadTask(await (new FileInfo()).init(list[index]));
            node.firstChild.textContent = `${i18n[language()].parsingProgress}[${list.length - (index + 1)}/${size}]`;
        }
        start.hideToast();
        if (size != 1) {
            let completed = newToast(ToastType.Info, {
                text: `%#allCompleted#%`,
                duration: -1,
                close: true,
                onClick() {
                    completed.hideToast();
                }
            });
            completed.showToast();
        }
    }
    function aria2Download(fileInfo) {
        (async function (name, downloadUrl) {
            let localPath = analyzeLocalPath(config.downloadPath.replaceVariable({
                FileName: name
            }).trim());
            let res = await aria2API('aria2.addUri', [
                [downloadUrl.href],
                prune({
                    'all-proxy': config.downloadProxy,
                    'all-proxy-user': config.downloadProxyUser,
                    'all-proxy-passwd': config.downloadProxyPassword,
                    'out': localPath.filename,
                    'dir': localPath.fullPath.replace(localPath.filename, ''),
                    'referer': window.location.hostname,
                    'header': [
                        'Cookie:' + unsafeWindow.document.cookie
                    ]
                })
            ]);
            console.log(`Aria2 ${name} ${JSON.stringify(res)}`);
            newToast(ToastType.Info, {
                node: toastNode(`${name} %#pushTaskSucceed#%`)
            }).showToast();
        }(fileInfo.name, fileInfo.url));
    }
    function othersDownload(fileInfo) {
        (async function (Name, DownloadUrl) {
            DownloadUrl.searchParams.set('download', analyzeLocalPath(config.downloadPath.replaceVariable({
                FileName: Name
            }).trim()).filename);
            GM_openInTab(DownloadUrl.href, { active: false, insert: true, setParent: true });
        }(fileInfo.name, fileInfo.url));
    }
    function browserDownload(fileInfo) {
        (async function (Name, DownloadUrl) {
            function browserDownloadError(error) {
                let errorInfo = getString(Error);
                if (!(error instanceof Error)) {
                    errorInfo = {
                        'not_enabled': `%#browserDownloadNotEnabled#%`,
                        'not_whitelisted': `%#browserDownloadNotWhitelisted#%`,
                        'not_permitted': `%#browserDownloadNotPermitted#%`,
                        'not_supported': `%#browserDownloadNotSupported#%`,
                        'not_succeeded': `%#browserDownloadNotSucceeded#% ${error.details ?? getString(error.details)}`
                    }[error.error] || `%#browserDownloadUnknownError#%`;
                }
                let toast = newToast(ToastType.Error, {
                    node: toastNode([
                        `${Name} %#downloadFailed#%`,
                        { nodeType: 'br' },
                        errorInfo,
                        { nodeType: 'br' },
                        `%#tryRestartingDownload#%`
                    ], '%#browserDownload#%'),
                    async onClick() {
                        toast.hideToast();
                    }
                });
                toast.showToast();
            }
            GM_download({
                url: DownloadUrl.href,
                saveAs: false,
                name: config.downloadPath.replaceVariable({
                    NowTime: new Date(),
                    FileName: Name
                }).trim(),
                onerror: (err) => browserDownloadError(err),
                ontimeout: () => browserDownloadError(new Error('%#browserDownloadTimeout#%'))
            });
        }(fileInfo.name, fileInfo.url));
    }
    async function aria2API(method, params) {
        return await (await fetch(config.aria2Path, {
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                method: method,
                id: UUID(),
                params: [`token:${config.aria2Token}`, ...params]
            }),
            method: 'POST'
        })).json();
    }
    async function EnvCheck() {
        try {
            if (GM_info.downloadMode !== 'browser') {
                GM_getValue('isDebug') && console.log(GM_info);
                throw new Error('%#browserDownloadModeError#%');
            }
        }
        catch (error) {
            let toast = newToast(ToastType.Error, {
                node: toastNode([
                    `%#configError#%`,
                    { nodeType: 'br' },
                    getString(error)
                ], '%#settingsCheck#%'),
                position: 'center',
                onClick() {
                    toast.hideToast();
                }
            });
            toast.showToast();
            return false;
        }
        return true;
    }
    async function aria2Check() {
        try {
            let res = await (await fetch(config.aria2Path, {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    'jsonrpc': '2.0',
                    'method': 'aria2.tellActive',
                    'id': UUID(),
                    'params': ['token:' + config.aria2Token]
                })
            })).json();
            if (res.error) {
                throw new Error(res.error.message);
            }
        }
        catch (error) {
            let toast = newToast(ToastType.Error, {
                node: toastNode([
                    `Aria2 RPC %#connectionTest#%`,
                    { nodeType: 'br' },
                    getString(error)
                ], '%#settingsCheck#%'),
                position: 'center',
                onClick() {
                    toast.hideToast();
                }
            });
            toast.showToast();
            return false;
        }
        return true;
    }
    function firstRun() {
        console.log('First run config reset!');
        GM_listValues().forEach(i => GM_deleteValue(i));
        config = new Config();
        editConfig = new configEdit(config);
        let confirmButton = renderNode({
            nodeType: 'button',
            attributes: {
                disabled: true,
                title: i18n[language()].ok
            },
            childs: '%#ok#%',
            events: {
                click: () => {
                    GM_setValue('isFirstRun', false);
                    GM_setValue('version', GM_info.script.version);
                    unsafeWindow.document.querySelector('#pluginOverlay').remove();
                    editConfig.inject();
                }
            }
        });
        originalNodeAppendChild.call(unsafeWindow.document.body, renderNode({
            nodeType: 'div',
            attributes: {
                id: 'pluginOverlay'
            },
            childs: [
                {
                    nodeType: 'div',
                    className: 'main',
                    childs: [
                        { nodeType: 'p', childs: '%#useHelpForBase#%' }
                    ]
                },
                {
                    nodeType: 'div',
                    className: 'checkbox-container',
                    childs: {
                        nodeType: 'label',
                        className: ['checkbox-label', 'rainbow-text'],
                        childs: [{
                                nodeType: 'input',
                                className: 'checkbox',
                                attributes: {
                                    type: 'checkbox',
                                    name: 'agree-checkbox'
                                },
                                events: {
                                    change: (event) => {
                                        confirmButton.disabled = !event.target.checked;
                                    }
                                }
                            }, '%#alreadyKnowHowToUse#%']
                    }
                },
                confirmButton
            ]
        }));
    }
    async function main() {
        if (GM_getValue('isFirstRun', true)) {
            firstRun();
            return;
        }
        if (!await config.check()) {
            newToast(ToastType.Info, {
                text: `%#configError#%`,
                duration: 60 * 1000,
            }).showToast();
            editConfig.inject();
            return;
        }
        GM_setValue('version', GM_info.script.version);
        pluginMenu.inject();
        let notice = newToast(ToastType.Info, {
            node: toastNode([
                `加载完成`,
                { nodeType: 'br' },
                `公告: `,
                ...i18n[language()].notice
            ]),
            duration: 10000,
            gravity: 'bottom',
            position: 'center',
            onClick() {
                notice.hideToast();
            }
        });
        notice.showToast();
    }
    if (new Version(GM_getValue('version', '0.0.0')).compare(new Version('0.0.1')) === VersionState.Low) {
        GM_setValue('isFirstRun', true);
        alert(i18n[language()].configurationIncompatible);
    }
    (unsafeWindow.document.body ? Promise.resolve() : new Promise(resolve => originalAddEventListener.call(unsafeWindow.document, "DOMContentLoaded", resolve))).then(main);
})();
