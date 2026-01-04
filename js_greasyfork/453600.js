// ==UserScript==
// @name               ASMR Online 一键下载
// @name:zh-CN         ASMR Online 一键下载
// @name:en            ASMR Online Work Downloader
// @namespace          ASMR-ONE
// @version            1.4
// @description        一键下载asmr.one上的整个作品(或者选择文件下载)，包括全部的文件和目录结构
// @description:zh-CN  一键下载asmr.one上的整个作品(或者选择文件下载)，包括全部的文件和目录结构
// @description:en     Download all(selected) folders and files for current work on asmr.one in one click, preserving folder structures
// @author             PY-DNG
// @license            MIT
// @match              https://www.asmr.one/*
// @match              https://www.asmr-100.com/*
// @match              https://www.asmr-200.com/*
// @match              https://www.asmr-300.com/*
// @match              https://asmr.one/*
// @match              https://asmr-100.com/*
// @match              https://asmr-200.com/*
// @match              https://asmr-300.com/*
// @connect            asmr.one
// @connect            asmr-100.com
// @connect            asmr-200.com
// @connect            asmr-300.com
// @connect            localhost
// @connect            127.0.0.1
// @connect            *
// @require            https://update.greasyfork.org/scripts/456034/1542392/Basic%20Functions%20%28For%20userscripts%29.js
// @require            https://update.greasyfork.org/scripts/458132/1138364/ItemSelector.js
// @require            https://update.greasyfork.org/scripts/528191/1543992/Aria2%20RPC%20Edit%202.js
// @icon               https://www.asmr.one/statics/app-logo-128x128.png
// @grant              GM_download
// @grant              GM_registerMenuCommand
// @grant              GM_xmlhttpRequest
// @grant              GM_setValue
// @grant              GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/453600/ASMR%20Online%20%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/453600/ASMR%20Online%20%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

/* eslint-disable no-multi-spaces */
/* eslint-disable no-return-assign */

/* global LogLevel DoLog Err $ $All $CrE $AEL $$CrE addStyle detectDom destroyEvent copyProp copyProps parseArgs escJsStr replaceText getUrlArgv dl_browser dl_GM AsyncManager queueTask FunctionLoader loadFuncs require isLoaded */
/* global ItemSelector, Aria2 */

(function __MAIN__() {
    'use strict';

	const CONST = {
		HTML: {
			DownloadButton: `
				<button tabindex="0" type="button" id="download-btn"
						class="q-btn q-btn-item non-selectable no-outline q-btn--standard q-btn--rectangle bg-cyan q-mt-sm shadow-4 q-mx-xs q-px-sm text-white q-btn--actionable q-focusable q-hoverable q-btn--wrap q-btn--dense">
					<span class="q-focus-helper"></span><span class="q-btn__wrapper col row q-anchor--skip"><span
						class="q-btn__content text-center col items-center q-anchor--skip justify-center row"><span class="block" id="download-btn-inner">DOWNLOAD</span></span></span>
				</button>
			`
		},
		TextAllLang: {
            DEFAULT: 'en',
            'zh-CN': {
                DownloadFolder: 'ASMR-ONE',
                WorkFolder: '{RJ} - {WorkName}',
                DownloadButton: '下载',
                DownloadButton_Working: '正在下载（{Done}/{All}）',
                DownloadButton_Done: '下载（已完成）',
                SelectDownloadFiles: '选择下载的文件：',
                RootFolder: '根目录',
                Prefix_File: '[文件] ',
                Prefix_Folder: '[文件夹] ',
                NoTitle: '未命名',
                UseAria2: ['[ ] 使用Aria2下载', '[✔] 使用Aria2下载'],
                SetRPCPort: '设置Aria2端口',
                SetRPCHost: '设置Aria2地址',
                SetRPCSecret: '设置Aria2密钥',
                SetAria2Dir: '设置Aria2下载目录',
                SetUseHTTPS: ['[ ] 使用HTTPS连接Aria2', '[✔] 使用HTTPS连接Aria2']
            },
            'en': {
                DownloadFolder: 'ASMR-ONE',
                WorkFolder: '{RJ} - {WorkName}',
                DownloadButton: 'Download',
                DownloadButton_Working: 'Downloading({Done}/{All})',
                DownloadButton_Done: 'Download(Finished)',
                SelectDownloadFiles: 'Select files to download',
                RootFolder: 'Root',
                Prefix_File: '[File] ',
                Prefix_Folder: '[Folder] ',
                NoTitle: 'No Title',
                UseAria2: ['[ ] Download via aria2', '[✔] Download via aria2'],
                SetRPCPort: 'Set aria2 port',
                SetRPCHost: 'Set aria2 host',
                SetRPCSecret: 'Set aria2 secret',
                SetAria2Dir: 'Set aria2 DL dir',
                SetUseHTTPS: ['[ ] Use https for aria2', '[✔] Use https for aria2']
            }
		},
		Number: {
			Max_Download: 2,
			GUITextChangeDelay: 1500
		}
	}

    // Init language
	const i18n = Object.keys(CONST.TextAllLang).includes(navigator.language) ? navigator.language : CONST.TextAllLang.DEFAULT;
	CONST.Text = CONST.TextAllLang[i18n];

    loadFuncs([{
        id: 'utils',
        func() {
            const win = typeof unsafeWindow === 'object' && unsafeWindow !== null ? unsafeWindow : window;

            function htmlElm(html) {
                const parent = $CrE('div');
                parent.innerHTML = html;
                return parent.children.length > 1 ? Array.from(parent.children) : parent.children[0];
            }

            function getOSSep() {
                return ({
                    'Windows': '\\',
                    'Mac': '/',
                    'iOS': '/',
                    'Linux': '/',
                    'Null': '-'
                })[getOS()];
            }

            function getOS() {
                const ua = navigator.userAgent.toLowerCase();
                const platform = (navigator.platform || '').toLowerCase();
                const test = (s) => ua.includes(s) || platform.includes(s);

                const map = {
                    'Windows': ['windows', 'win32', 'win64', 'win86'],
                    'Mac': ['macintosh', 'mac os x', 'mac os'],
                    'iOS': ['iphone', 'ipad', 'ipod'],
                    'Linux': ['linux', 'x11']
                };

                // 优先检查 iOS（因为 iOS 的 UA 可能包含 "Mac"）
                if (map.iOS.some(test)) return 'iOS';

                // 检查其他系统
                for (const [sys, strs] of Object.entries(map)) {
                    if (sys !== 'iOS' && strs.some(test)) {
                        return sys;
                    }
                }

                // 备选检测：如果 UA 包含 "Mac" 但未匹配 iOS，则可能是 macOS
                if (ua.includes('mac')) return 'Mac';

                return 'Null';
            }

            // Returns a random string
            function randstr(length=16, nums=true, cases=true) {
                const all = 'abcdefghijklmnopqrstuvwxyz' + (nums ? '0123456789' : '') + (cases ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' : '');
                return Array(length).fill(0).reduce(pre => (pre += all.charAt(randint(0, all.length-1))), '');
            }

            function randint(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }

            function cloneObject(obj) {
                return window.structuredClone?.(obj) ?? JSON.parse(JSON.stringify(obj));
            }

            // Save text to textfile
            function downloadText(text, name) {
                if (!text || !name) {return false;};
                const blob = new Blob([text], { type:"text/plain;charset=utf-8" });
                const url = URL.createObjectURL(blob);
                dl_browser(url, name);
                setTimeout(() => URL.revokeObjectURL(url), 1000);
            }

            /**
             * @callback setting_update_callback
             * @param {string} key
             * @param {*} value
             */
            /**
             * @typedef {Object} BooleanSetting
             * @property {string[]} texts - [text when false, text when true]
             * @property {string} key
             * @property {boolean} [defaultValue=false]
             * @property {setting_update_callback} [callback=null]
             * @property {boolean} [initCallback=false]
             * @property {function} {GM_getValue} - use this variable as GM_getValue function if provided
             * @property {function} {GM_setValue} - use this variable as GM_setValue function if provided
             */
            /**
             * @param {BooleanSetting | BooleanSetting[]} settings
             */
            function makeBooleanSettings(settings) {
                settings = Array.isArray(settings) ? settings : [settings];
                settings.forEach(setting => makeBooleanMenu(setting));

                /**
                 * @param {BooleanSetting} setting
                 */
                function makeBooleanMenu(setting) {
                    const texts = setting.texts;
                    const key = setting.key;
                    const defaultValue = setting.defaultValue ?? false;
                    const callback = setting.callback ?? function() {};
                    const initCallback = setting.initCallback ?? false;
                    const getValue = setting.GM_getValue ?? GM_getValue;
                    const setValue = setting.GM_setValue ?? GM_setValue;

                    const initialVal = getValue(key, defaultValue);
                    const initialText = texts[+initialVal];
                    let id = makeMenu(initialText, onClick);
                    initCallback && callback(key, initialVal);

                    function onClick() {
                        const newValue = !getValue(key, defaultValue);
                        const newText = texts[newValue + 0];
                        setValue(key, newValue);
                        id = makeMenu(newText, onClick, id);
                        callback(key, newValue);
                    }

                    function makeMenu(text, func, id) {
                        return GM_registerMenuCommand(text, func, {
                            id,
                            //autoClose: false,
                        });
                    }
                }
            }

            function joinPath(p1, p2) {
                return p1.replace(/[\/\\]+$/, '') + getOSSep() + p2.replace(/^[\/\\]+/, '');
            }

            class ProgressManager {
                /** @type {number} */
                steps;
                /** @type {progressCallback} */
                #callback;
                /** @type {number} */
                #finished;

                /**
                 * This callback is called each time a promise resolves
                 * @callback progressCallback
                 * @param {number} resolved_count
                 * @param {number} total_count
                 */

                /**
                 * @param {number} steps - Total steps count of the task
                 */
                constructor(steps, callback) {
                    this.steps = steps;
                    this.#callback = callback;
                    this.#finished = 0;

                    this.steps && this.#callback(this.#finished, this.steps);
                }

                /**
                 * Add one step
                 */
                add() { this.steps++; }

                async progress(promise) {
                    const val = promise ? await promise : null;
                    try {
                        setTimeout(() => this.#callback(++this.#finished, this.steps));
                    } finally {
                        return val;
                    }
                }

                /**
                 * Resolves after all promise resolved, and callback each time one of them resolves
                 * @param {Array<Promise>} promises
                 * @param {progressCallback} callback
                 */
                static async all(promises, callback) {
                    const manager = new ProgressManager(promises.length, callback);
                    await Promise.all(promises.map(promise => manager.progress(promise, callback)));
                }
            }

            return {
                window: win,
                htmlElm, getOSSep, getOS, randstr, randint, cloneObject,
                downloadText, makeBooleanSettings, joinPath, ProgressManager
            }
        }
    }, {
        id: 'debug',
        dependencies: 'utils',
        func() {
            const utils = require('utils');

            GM_registerMenuCommand('导出调试包', debugInfo);

            function debugInfo() {
                const win = utils.window;
                const DebugInfo = {
                    version: GM_info.script.version,
                    GM_info: GM_info,
                    platform: navigator.platform,
                    userAgent: navigator.userAgent,
                    getOS: utils.getOS(),
                    getOSSep: utils.getOSSep(),
                    url: location.href,
                    topurl: win.top.location.href,
                    iframe: win.top !== win,
                    languages: [...navigator.languages],
                    timestamp: (new Date()).getTime()
                };

                // Log in console
                DoLog(LogLevel.Debug, '=== Userscript [' + GM_info.script.name + '] debug info ===');
                DoLog(LogLevel.Debug, DebugInfo);
                DoLog(LogLevel.Debug, '=== /Userscript [' + GM_info.script.name + '] debug info ===');

                // Save to file
                utils.downloadText(JSON.stringify(DebugInfo), 'Debug Info_' + GM_info.script.name + '_' + (new Date()).getTime().toString() + '.json');
            }

            return { debugInfo };
        }
    }, {
        id: 'item-selector',
        desc: 'Initialize an ItemSelector instance and return it as is',
        detectDom: 'body',
        func() {
            const IS = new ItemSelector();
            const observer = new MutationObserver(setTheme);
            observer.observe(document.body, {attributes: true, attributeFilter: ['class']});
            setTheme();
            return IS;

            function setTheme() {
                IS.setTheme([...document.body.classList].includes('body--dark') ? 'dark' : 'light');
            }
        }
    }, {
        id: 'aria2',
        desc: 'Aria2 RPC support',
        dependencies: 'utils',
        params: ['GM_setValue', 'GM_getValue'],
        func(GM_setValue, GM_getValue) {
            const utils = require('utils');
            const aria2 = new Aria2(Object.assign({
                port: GM_getValue('port', 6800),
                host: GM_getValue('host', 'localhost'),
                https: GM_getValue('https', false)
            }, GM_getValue('secret', null) !== null ? {
                auth: {
                    type: Aria2AUTH.secret,
                    pass: GM_getValue('secret', '')
                }
            } : {}));

            GM_registerMenuCommand(CONST.Text.SetRPCHost, e => userInputHost());
            GM_registerMenuCommand(CONST.Text.SetRPCPort, e => userInputPort());
            GM_registerMenuCommand(CONST.Text.SetRPCSecret, e => userInputSecret());
            GM_registerMenuCommand(CONST.Text.SetAria2Dir, e => userInputDir());

            utils.makeBooleanSettings({
                texts: CONST.Text.SetUseHTTPS,
                key: 'https',
                defaultValue: false,
                GM_setValue, GM_getValue,
                callback: (key, value) => aria2.options.https = value,
                initCallback: true
            });

            /**
             * Download file via aria2
             * @param {string} url
             * @param {string} path - full path = user-set base dir + path param
             * @returns {Object|null} aria2 addUri api result, or null if dl base dir not set
             */
            async function download(url, path) {
                if (!checkDir()) { return null; }
                aria2.host = GM_getValue('host', 'localhost');
                aria2.port = GM_getValue('port', 6800);
                const sep = utils.getOSSep();
                const dir = GM_getValue('dir', '');
                const fullpath = utils.joinPath(dir, path);
                const pathparts = fullpath.split(sep);
                const filename = pathparts.pop();
                const fulldir = pathparts.join(sep);
                const response = await aria2.addUri([url], {
                    dir: fulldir,
                    out: filename,
                    'max-connection-per-server': 4,
                    header: [
                        `origin: https://asmr-200.com`,
                        `referer: https://asmr-200.com/`,
                        `user-agent: ${navigator.userAgent}`
                    ]
                });
                return JSON.parse(response.responseText);
            }

            /**
             * Check if base download dir is properly set by user, if not, promt user to set
             * @returns {boolean} whether user finally set the base download dir
             */
            function checkDir() {
                GM_getValue('dir', null) || userInputDir();
                return !!GM_getValue('dir', null);
            }

            function userInputHost() {
                const input = prompt(CONST.Text.SetRPCHost, aria2.options.host);
                const reg = /^(?:https?:\/\/)?([a-zA-Z0-9\.]+)\/?$/;
                if (input !== null && reg.test(input)) {
                    const host = input.match(reg)[1];
                    aria2.options.host = host;
                    GM_setValue('host', host);
                }
            }

            function userInputPort() {
                const input = prompt(CONST.Text.SetRPCPort, aria2.options.port);
                if (input !== null && /^\d+$/.test(input)) {
                    const port = parseInt(input, 10);
                    aria2.options.port = port;
                    GM_setValue('port', port);
                }
            }

            function userInputSecret() {
                const input = prompt(CONST.Text.SetRPCSecret, '');
                if (input !== null) {
                    aria2.options.auth = {
                        type: Aria2AUTH.secret,
                        pass: input
                    };
                    GM_setValue('secret', input);
                }
            }

            function userInputDir() {
                const input = prompt(CONST.Text.SetAria2Dir, GM_getValue('dir', ''));
                if (input !== null) {
                    GM_setValue('dir', input);
                }
            }

            return {
                download, checkDir,
                get host() { return aria2.host; },
                get port() { return aria2.port; },
            }
        }
    }, {
        id: 'downloader',
        desc: 'download files to disk',
        dependencies: ['utils', 'aria2'],
        params: ['GM_setValue', 'GM_getValue'],
        func(GM_setValue, GM_getValue) {
            const utils = require('utils');
            const aria2 = require('aria2');

            utils.makeBooleanSettings({
                texts: CONST.Text.UseAria2,
                key: 'use-aria2',
                defaultValue: false,
                GM_setValue, GM_getValue,
                callback: (key, value) => value && aria2.checkDir(),
                initCallback: true
            });

            /**
             * Download file from url to path
             * @param {string} url
             * @param {string} path
             * @returns {Promise}
             */
            function download(url, path) {
                const downloader = getDownloader();

                switch (downloader) {
                    case 'native': {
                        return queueTask(dl, 'native-download');

                        function dl(retry=3) {
                            return new Promise((resolve, reject) => {
                                const on_error = err => --retry > 0 ? dl(retry).then(resolve).catch(reject) : reject(err);
                                const fullpath = utils.joinPath(CONST.Text.DownloadFolder, path);
                                GM_download({
                                    url: url,
                                    name: fullpath,
                                    onload: resolve,
                                    onerror: on_error,
                                    ontimeout: on_error
                                });
                            });
                        }
                    }
                    case 'aria2': {
                        return aria2.download(url, path);
                    }
                }
            }

            /**
             * Which downloader user chooses to use
             * @typedef { 'native' | 'aria2' } downloader
             */
            /**
             * @returns {downloader}
             */
            function getDownloader() {
                return GM_getValue('use-aria2', false) ? 'aria2' : 'native';
            }

            return {
                download,
                get downloader() { return getDownloader(); }
            };
        }
    }, {
        id: 'api',
        func() {
            function tracks(id) {
                return callApi({
                    endpoint: `tracks/${id}`
                });
            }

            /**
             * callApi detail object
             * @typedef {Object} api_detail
             * @property {string} endpoint - api endpoint
             * @property {Object} [search] - search params
             * @property {string} [method='GET']
             */

            /**
             * Do basic asmr-online api request
             * This is the queued version of _callApi
             * @param {api_detail} detail
             * @returns
             */
            function callApi(...args) {
                return queueTask(() => _callApi(...args), 'callApi');
            }

            /**
             * Do basic asmr-online api request
             * @param {api_detail} detail
             * @returns
             */
            function _callApi(detail) {
                const host = `api.${location.host.match(/(?:[^.]+\.)?([^.]+\.[^.]+)/)[1]}`;
                const search_string = new URLSearchParams(detail.search).toString();
                const url = `https://${host}/api/${detail.endpoint.replace(/^\//, '')}` + (search_string ? '?' + search_string : '');
                const method = detail.method ?? 'GET';

                return new Promise((resolve, reject) => {
                    const options = {
                        method, url,
                        headers: {
                            accept: 'application/json, text/plain, */*'
                        },
                        onload(e) {
                            try {
                                e.status === 200 ? resolve(JSON.parse(e.responseText)) : reject(e.responseText);
                            } catch(err) {
                                reject(err);
                            }
                        },
                        onerror: err => reject(err)
                    }
                    GM_xmlhttpRequest(options);
                });
            }

            return {
                tracks,
                callApi
            };
        }
    }, {
        id: 'main',
        dependencies: ['utils', 'api', 'downloader', 'item-selector'],
        func() {
            const utils = require('utils');
            const api = require('api');
            const downloader = require('downloader');
            const IS = require('item-selector');

            detectDom({
                selector: '#work-tree',
                callback: e => pageWork()
            });

            async function pageWork() {
                // Make button
                const downloadBtn = utils.htmlElm(CONST.HTML.DownloadButton);
                const downloadBtn_inner = $(downloadBtn, '#download-btn-inner');
                downloadBtn_inner.innerText = CONST.Text.DownloadButton;
                (await detectDom(".q-page-container .q-pa-sm")).append(downloadBtn);
                $AEL(downloadBtn, 'click', batchDownload);

                async function batchDownload() {
                    const manager = new utils.ProgressManager(0, on_progress);
                    const DATA = 'Original-Item-Properties-Data-' + utils.randstr();
                    const list = await api.tracks(getid());
                    const json = list2json(list);
                    IS.show(json, {
                        title: CONST.Text.SelectDownloadFiles,
                        onok: (e, json) => {
                            const list = json2list(json);
                            list.forEach(item => dealItem(item));
                        }
                    });

                    function list2json(list) {
                        list = structuredClone(list);
                        const json = {text: CONST.Text.RootFolder, children: [], [DATA]: {}};
                        json.children.push(...list.map(item => convert(item)));
                        return json;

                        function convert(item) {
                            const json = {};
                            switch (item.type) {
                                case 'folder': {
                                    json.text = CONST.Text.Prefix_Folder + item.title;
                                    json.children = item.children.map(child => convert(child));
                                    break;
                                }
                                case 'audio':
                                case 'text':
                                case 'image':
                                case 'other': {
                                    json.text = CONST.Text.Prefix_File + item.title;
                                    break;
                                }
                                default:
                                    //debugger;
                                    DoLog(LogLevel.Warning, 'Unknown item type: ' + item.type);
                            }
                            json[DATA] = item;
                            delete json[DATA].children;
                            return json;
                        }
                    }

                    function json2list(json) {
                        if (json === null) {return [];}
                        json = structuredClone(json);
                        const root_item = convert(json);
                        const list = root_item.children;
                        return list;

                        function convert(json) {
                            const item = json[DATA];
                            if (Array.isArray(json.children)) {
                                item.children = [];
                                for (const child of json.children) {
                                    item.children.push(convert(child));
                                }
                            }
                            return item;
                        }
                    }

                    async function dealItem(item, path=[]) {
                        switch (item.type) {
                            case 'folder': {
                                for (const child of item.children) {
                                    dealItem(child, path.concat([item.title]));
                                }
                                break;
                            }
                            case 'audio':
                            case 'text':
                            case 'image':
                            case 'other': {
                                manager.add();
                                const sep = utils.getOSSep();
                                const _sep = ({'/': '／', '\\': '＼'})[sep];
                                const url = item.mediaDownloadUrl;
                                const RJ = location.pathname.split('/').pop();
                                const dlpath = [
                                    // Work folder
                                    replaceText(CONST.Text.WorkFolder, {'{RJ}': RJ, '{WorkName}': item.workTitle || CONST.Text.NoTitle}),
                                    // File path in work
                                    ...path,
                                    // File name
                                    item.title,
                                ].map(name => escapePath(name)).join(sep);
                                await manager.progress(downloader.download(url, dlpath));
                                break;
                            }
                            default:
                                //debugger;
                                DoLog(LogLevel.Warning, 'Unknown item type: ' + item.type);
                                DoLog(LogLevel.Warning, item);
                                await manager.progress();
                        }
                    }

                    function on_progress(finished, total) {
                        downloadBtn_inner.innerText = replaceText(CONST.Text.DownloadButton_Working, { '{Done}': finished, '{All}': total });
                        finished === total && setTimeout(() => (downloadBtn_inner.innerText = CONST.Text.DownloadButton_Done), CONST.Number.GUITextChangeDelay);
                    }

                    /**
                     * Replace unallowed special characters in a path part
                     * @param {string} path - a part of path, such as a folder name / file name
                     */
                    function escapePath(path) {
                        // Replace special characters
                        const chars_bank = {
                            '\\': '＼',
                            '/': '／',
                            ':': '：',
                            '*': '＊',
                            '?': '？',
                            '"': "'",
                            '<': '＜',
                            '>': '＞',
                            '|': '｜'
                        };
                        for (const [char, replacement] of Object.entries(chars_bank)) {
                            path = path.replaceAll(char, replacement);
                        }

                        // Disallow ending with dots
                        path.endsWith('.') && (path += '_');
                        return path;
                    }
                }
            }

            function getid() {
                return location.pathname.split('/').pop().substring(2);
            }
        }
    }]);
}) ();