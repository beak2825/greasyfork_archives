// ==UserScript==
// @name               Greasyfork script-set-edit button
// @name:zh-CN         Greasyfork 快捷编辑收藏
// @name:zh-TW         Greasyfork 快捷編輯收藏
// @name:en            Greasyfork script-set-edit button
// @name:en-US         Greasyfork script-set-edit button
// @name:fr            Greasyfork Set Edit+
// @namespace          Greasyfork-Favorite
// @version            0.3.2.2
// @description        Add / Remove script into / from script set directly in GF script info page
// @description:zh-CN  在GF脚本页直接编辑收藏集
// @description:zh-TW  在GF腳本頁直接編輯收藏集
// @description:en     Add / Remove script into / from script set directly in GF script info page
// @description:en-US  Add / Remove script into / from script set directly in GF script info page
// @description:fr     Ajouter un script à un jeu de scripts / supprimer un script d'un jeu de scripts directement sur la page d'informations sur les scripts GF
// @author             PY-DNG
// @license            GPL-3.0-or-later
// @match              http*://*.greasyfork.org/*
// @match              http*://*.sleazyfork.org/*
// @match              http*://*.cn-greasyfork.org/*
// @require            https://update.greasyfork.org/scripts/456034/1597683/Basic%20Functions%20%28For%20userscripts%29.js
// @require            https://update.greasyfork.org/scripts/449583/1324274/ConfigManager.js
// @icon               data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAbBJREFUOE+Vk7GKGlEUhr8pAiKKDlqpCDpLUCzWBxCENBa+hBsL9wHsLWxXG4tNtcGH0MIiWopY7JSGEUWsbESwUDMw4Z7siLsZDbnlPff/7n/+e67G38sA6sAXIPVWXgA/gCdgfinRPuhfCoXCw3Q65XA4eLBl6zvw1S2eAZqmvTqOc5/NZhkMBqRSKWzbvgYxgbwquoAX4MGyLHK5HIlEgtFo9C+IOFEAo1gsWsvlUmyPx2MymYxAhsMh6XT6lpM7BXjWdf1xNpuRz+fl8GQywTAMGo0G1WpVnJxOJ692vinADPgcDAaZz+cCOR6PmKZJPB4XUb/fp1wuewF+KoBCf1JVBVE5dDodms3mWdDtdqlUKl6AX+8ALmS9XgtM0/5kvNlspKX9fv8RIgBp4bISCoXo9XqsVitKpRK6rrPb7STQ7XZ7eVRaeAYerz14OBxGOfL7/eIgmUwKzHEcJZEQ1eha1wBqPxqNihufzyeQWCzmtiPPqJYM0jWIyiISibBYLAgEAtTrdVqt1nmQXN0rcH/LicqmVqvRbrdN27bfjbKru+nk7ZD3Z7q4+b++82/YPKIrXsKZ3AAAAABJRU5ErkJggg==
// @grant              GM_setValue
// @grant              GM_getValue
// @grant              GM_listValues
// @grant              GM_deleteValue
// @grant              GM_registerMenuCommand
// @grant              GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/519898/Greasyfork%20script-set-edit%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/519898/Greasyfork%20script-set-edit%20button.meta.js
// ==/UserScript==

/* eslint-disable no-multi-spaces */
/* eslint-disable no-return-assign */

/* global LogLevel DoLog Err $ $All $CrE $AEL $$CrE addStyle detectDom destroyEvent copyProp copyProps parseArgs escJsStr replaceText getUrlArgv dl_browser dl_GM AsyncManager queueTask FunctionLoader loadFuncs require isLoaded */
/* global ConfigManager */

(function __MAIN__() {
    'use strict';

	const CONST = {
		TextAllLang: {
            DEFAULT: 'en-US',
			'zh-CN': {
				FavEdit: '收藏集：',
				Add: '加入此集',
				Remove: '移出此集',
				Edit: '手动编辑',
				EditIframe: '页内编辑',
				CloseIframe: '关闭编辑',
				CopySID: '复制脚本ID',
				Sync: '同步',
				NotLoggedIn: '请先登录Greasyfork',
				NoSetsYet: '您还没有创建过收藏集',
				NewSet: '新建收藏集',
				sortByApiDefault: ['默认排序', '默认倒序'],
				Working: ['工作中...', '就快好了...'],
				InSetStatus: ['[ ]', '[✔]'],
				Groups: {
					Server: 'GreasyFork收藏集',
					Local: '本地收藏集',
					New: '新建'
				},
				Refreshing: {
					List: '获取收藏集列表...',
					Script: '获取收藏集内容...',
					Data: '获取收藏集数据...'
				},
				UseAPI: ['[ ] 使用GF的收藏集API', '[✔]使用GF的收藏集API'],
				Error: {
					AlreadyExist: '脚本已经在此收藏集中了',
					NotExist: '脚本不在此收藏集中',
					NetworkError: '网络错误',
					Unknown: '未知错误'
				}
			},
			'zh-TW': {
				FavEdit: '收藏集：',
				Add: '加入此集',
				Remove: '移出此集',
				Edit: '手動編輯',
				EditIframe: '頁內編輯',
				CloseIframe: '關閉編輯',
				CopySID: '複製腳本ID',
				Sync: '同步',
				NotLoggedIn: '請先登錄Greasyfork',
				NoSetsYet: '您還沒有創建過收藏集',
				NewSet: '新建收藏集',
				sortByApiDefault: ['默認排序', '默認倒序'],
				Working: ['工作中...', '就快好了...'],
				InSetStatus: ['[ ]', '[✔]'],
				Groups: {
					Server: 'GreasyFork收藏集',
					Local: '本地收藏集',
					New: '新建'
				},
				Refreshing: {
					List: '獲取收藏集清單...',
					Script: '獲取收藏集內容...',
					Data: '獲取收藏集數據...'
				},
				UseAPI: ['[ ] 使用GF的收藏集API', '[✔]使用GF的收藏集API'],
				Error: {
					AlreadyExist: '腳本已經在此收藏集中了',
					NotExist: '腳本不在此收藏集中',
					NetworkError: '網絡錯誤',
					Unknown: '未知錯誤'
				}
			},
			'en-US': {
				FavEdit: 'Script set: ',
				Add: 'Add',
				Remove: 'Remove',
				Edit: 'Edit Manually',
				EditIframe: 'In-Page Edit',
				CloseIframe: 'Close Editor',
				CopySID: 'Copy Script-ID',
				Sync: 'Sync',
				NotLoggedIn: 'Login to greasyfork to use script sets',
				NoSetsYet: 'You haven\'t created a collection yet',
				NewSet: 'Create a new set',
				sortByApiDefault: ['Default', 'Default reverse'],
				Working: ['Working...', 'Just a moment...'],
				InSetStatus: ['[ ]', '[✔]'],
				Groups: {
					Server: 'GreasyFork',
					Local: 'Local',
					New: 'New'
				},
				Refreshing: {
					List: 'Fetching script sets...',
					Script: 'Fetching set content...',
					Data: 'Fetching script sets data...'
				},
				UseAPI: ['[ ] Use GF API', '[✔] Use GF API'],
				Error: {
					AlreadyExist: 'Script is already in set',
					NotExist: 'Script is not in set yet',
					NetworkError: 'Network Error',
					Unknown: 'Unknown Error'
				}
			},
			'default': {
				FavEdit: 'Script set: ',
				Add: 'Add',
				Remove: 'Remove',
				Edit: 'Edit Manually',
				EditIframe: 'In-Page Edit',
				CloseIframe: 'Close Editor',
				CopySID: 'Copy Script-ID',
				Sync: 'Sync',
				NotLoggedIn: 'Login to greasyfork to use script sets',
				NoSetsYet: 'You haven\'t created a collection yet',
				NewSet: 'Create a new set',
				sortByApiDefault: ['Default', 'Default reverse'],
				Working: ['Working...', 'Just a moment...'],
				InSetStatus: ['[ ]', '[✔]'],
				Groups: {
					Server: 'GreasyFork',
					Local: 'Local',
					New: 'New'
				},
				Refreshing: {
					List: 'Fetching script sets...',
					Script: 'Fetching set content...',
					Data: 'Fetching script sets data...'
				},
				UseAPI: ['[ ] Use GF API', '[✔] Use GF API'],
				Error: {
					AlreadyExist: 'Script is already in set',
					NotExist: 'Script is not in set yet',
					NetworkError: 'Network Error',
					Unknown: 'Unknown Error'
				}
			},
		},
		URL: {
			SetLink: `https://${location.host}/scripts?set=$ID`,
			SetEdit: `https://${location.host}/users/$UID/sets/$ID/edit`
		},
		ConfigRule: {
			'version-key': 'config-version',
			ignores: ['useAPI'],
			defaultValues: {
				'script-sets': {
					sets: [],
					time: 0,
					'config-version': 2,
				},
				'useAPI': true
			},
			'updaters': {
				/*'config-key': [
					function() {
						// This function contains updater for config['config-key'] from v0 to v1
					},
					function() {
						// This function contains updater for config['config-key'] from v1 to v2
					}
				]*/
				'script-sets': [
					config => {
						// v0 ==> v1
						// Fill set.id
						const sets = config.sets;
						sets.forEach(set => {
							const id = getUrlArgv(set.link, 'set');
							set.id = id;
							set.scripts = null; // After first refresh, it should be an array of SIDs:string
						});

						// Delete old version identifier
						delete config.version;

						return config;
					},
					config => {
						// v1 ==> v2
						return config
					}
				]
			},
		},
        get Text() {
            const page_i18n = $('.language-selector-locale').value;
            const browser_i18n = navigator.language;
            return findLanguagePack(CONST.TextAllLang, page_i18n, browser_i18n);

            function findLanguagePack(packs, ...lang_codes) {
                const getSuffix = code => code.slice(0, code.indexOf('-'));
                
                const lang_code =
                    // Pack code that directly matches one of provided language code
                    Object.keys(packs).find(pcode =>
                        lang_codes.some(lcode => pcode === lcode)
                    ) ??
                    // Pack code which suffix matches one of provided language code
                    Object.keys(packs).find(pcode =>
                        lang_codes.some(lcode => getSuffix(pcode) === getSuffix(lcode))
                    ) ??
                    // No matches, use default language pack
                    packs.DEFAULT;
                
                return packs[lang_code];
            }
        },
	};

	const CM = new ConfigManager(CONST.ConfigRule);
	const CONFIG = CM.Config;
	CM.updateAllConfigs();
	CM.setDefaults();

    const functions = {
        utils: {
            /** @typedef {Awaited<ReturnType<typeof functions.utils.func>>} utils */
            func() {
                function makeBooleanSettings(settings) {
                    for (const setting of settings) {
                        makeBooleanMenu(setting.text, setting.key, setting.defaultValue, setting.callback, setting.initCallback);
                    }

                    function makeBooleanMenu(texts, key, defaultValue=false, callback=null, initCallback=false) {
                        const initialVal = GM_getValue(key, defaultValue);
                        const initialText = texts[initialVal + 0];
                        let id = makeMenu(initialText, onClick);
                        initCallback && callback(key, initialVal);

                        function onClick() {
                            const newValue = !GM_getValue(key, defaultValue);
                            const newText = texts[newValue + 0];
                            GM_setValue(key, newValue);
                            id = makeMenu(newText, onClick, id);
                            typeof callback === 'function' && callback(key, newValue);
                        }

                        function makeMenu(text, func, id) {
                            if (GM_info.scriptHandler === 'Tampermonkey' && GM_hasVersion('5.0')) {
                                return GM_registerMenuCommand(text, func, {
                                    id,
                                    autoClose: false,
                                });
                            } else {
                                GM_unregisterMenuCommand(id);
                                return GM_registerMenuCommand(text, func);
                            }
                        }
                    }

                    function GM_hasVersion(version) {
                        return hasVersion(GM_info?.version || '0', version);

                        function hasVersion(ver1, ver2) {
                            return compareVersions(ver1.toString(), ver2.toString()) >= 0;

                            // https://greasyfork.org/app/javascript/versioncheck.js
                            // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/version/format
                            function compareVersions(a, b) {
                            if (a == b) {
                                return 0;
                            }
                            let aParts = a.split('.');
                            let bParts = b.split('.');
                            for (let i = 0; i < aParts.length; i++) {
                                let result = compareVersionPart(aParts[i], bParts[i]);
                                if (result != 0) {
                                return result;
                                }
                            }
                            // If all of a's parts are the same as b's parts, but b has additional parts, b is greater.
                            if (bParts.length > aParts.length) {
                                return -1;
                            }
                            return 0;
                            }

                            function compareVersionPart(partA, partB) {
                            let partAParts = parseVersionPart(partA);
                            let partBParts = parseVersionPart(partB);
                            for (let i = 0; i < partAParts.length; i++) {
                                // "A string-part that exists is always less than a string-part that doesn't exist"
                                if (partAParts[i].length > 0 && partBParts[i].length == 0) {
                                return -1;
                                }
                                if (partAParts[i].length == 0 && partBParts[i].length > 0) {
                                return 1;
                                }
                                if (partAParts[i] > partBParts[i]) {
                                return 1;
                                }
                                if (partAParts[i] < partBParts[i]) {
                                return -1;
                                }
                            }
                            return 0;
                            }

                            // It goes number, string, number, string. If it doesn't exist, then
                            // 0 for numbers, empty string for strings.
                            function parseVersionPart(part) {
                            if (!part) {
                                return [0, "", 0, ""];
                            }
                            let partParts = /([0-9]*)([^0-9]*)([0-9]*)([^0-9]*)/.exec(part)
                            return [
                                partParts[1] ? parseInt(partParts[1]) : 0,
                                partParts[2],
                                partParts[3] ? parseInt(partParts[3]) : 0,
                                partParts[4]
                            ];
                            }
                        }
                    }
                }

                // Copy text to clipboard (needs to be called in an user event)
                function copyText(text) {
                    // Create a new textarea for copying
                    const newInput = document.createElement('textarea');
                    document.body.appendChild(newInput);
                    newInput.value = text;
                    newInput.select();
                    document.execCommand('copy');
                    document.body.removeChild(newInput);
                }

                return {
                    makeBooleanSettings,
                    copyText
                }
            }
        },
        api: {
            /** @typedef {Awaited<ReturnType<typeof functions.api.func>>} api */
            func() {
                const API = {
                    async getScriptSets() {
                        const userpage = API.getUserpage();
                        const oDom = await API.getDocument(userpage);
            
                        const list =  Array.from($(oDom, 'ul#user-script-sets').children);
                        const NoSets = list.length === 1 && list.every(li => li.children.length === 1);
                        const script_sets = NoSets ? [] : Array.from($(oDom, 'ul#user-script-sets').children).filter(li => li.children.length === 2).map(li => {
                            try {
                                return {
                                    name: li.children[0].innerText,
                                    link: li.children[0].href,
                                    linkedit: li.children[1].href,
                                    id: getUrlArgv(li.children[0].href, 'set')
                                }
                            } catch(err) {
                                DoLog(LogLevel.Error, [li, err, li.children.length, li.children[0]?.innerHTML, li.children[1]?.innerHTML], 'error');
                                Err(err);
                            }
                        });
            
                        return script_sets;
                    },
            
                    async getSetScripts(url) {
                        return [...$All(await API.getDocument(url), '#script-set-scripts>input[name="scripts-included[]"]')].map(input => input.value);
                    },
            
                    /**
                     * @typedef {Object} SetsDataAPI
                     * @property {Response} resp - api fetch response object
                     * @property {boolean} ok - resp.ok (resp.status >= 200 && resp.status <= 299)
                     * @property {(Object|null)} data - api response json data, or null if not resp.ok
                     */
                    /**
                     * @returns {SetsDataAPI}
                     */
                    async getSetsData() {
                        const userpage = API.getUserpage();
                        const url = (userpage.endsWith('/') ? userpage : userpage + '/') + 'sets'
            
                        const resp = await fetch(url, { credentials: 'same-origin' });
                        if (resp.ok) {
                            return {
                                ok: true,
                                resp,
                                data: await resp.json()
                            };
                        } else {
                            return {
                                ok: false,
                                resp,
                                data: null
                            };
                        }
                    },
            
                    /**
                     * @returns {(string|null)} the user's profile page url, from page top-right link <a>.href
                     */
                    getUserpage() {
                        const a = $('#nav-user-info>.user-profile-link>a');
                        return a ? a.href : null;
                    },
            
                    /**
                     * @returns {(string|null)} the user's id, in string format
                     */
                    getUserID() {
                        const userpage = API.getUserpage(); //https://greasyfork.org/zh-CN/users/667968-pyudng
                        return userpage ? userpage.match(/\/users\/(\d+)(-[^\/]*\/*)?/)[1] : null;
                    },
            
                    // editCallback recieves:
                    //     true: edit doc load success
                    //     false: already in set
                    // finishCallback recieves:
                    //     text: successfully added to set with text tip `text`
                    //     true: successfully loaded document but no text tip found
                    //     false: xhr error
                    addFav(url, sid, editCallback, finishCallback) {
                        API.modifyFav(url, oDom => {
                            const existingInput = [...$All(oDom, '#script-set-scripts>input[name="scripts-included[]"][type="hidden"]')].find(input => input.value === sid);
                            if (existingInput) {
                                editCallback(false);
                                return false;
                            }
            
                            const input = $CrE('input');
                            input.value = sid;
                            input.name = 'scripts-included[]';
                            input.type = 'hidden';
                            $(oDom, '#script-set-scripts').appendChild(input);
                            editCallback(true);
                        }, oDom => {
                            const status = $(oDom, 'p.notice');
                            const status_text = status ? status.innerText : true;
                            finishCallback(status_text);
                        }, err => finishCallback(false));
                    },
            
                    // editCallback recieves:
                    //     true: edit doc load success
                    //     false: already not in set
                    // finishCallback recieves:
                    //     text: successfully removed from set with text tip `text`
                    //     true: successfully loaded document but no text tip found
                    //     false: xhr error
                    removeFav(url, sid, editCallback, finishCallback) {
                        API.modifyFav(url, oDom => {
                            const existingInput = [...$All(oDom, '#script-set-scripts>input[name="scripts-included[]"][type="hidden"]')].find(input => input.value === sid);
                            if (!existingInput) {
                                editCallback(false);
                                return false;
                            }
            
                            existingInput.remove();
                            editCallback(true);
                        }, oDom => {
                            const status = $(oDom, 'p.notice');
                            const status_text = status ? status.innerText : true;
                            finishCallback(status_text);
                        }, err => finishCallback(false));
                    },
            
                    async modifyFav(url, editCallback, finishCallback, onerror) {
                        const oDom = await API.getDocument(url);
                        if (editCallback(oDom) === false) { return false; }
            
                        const form = $(oDom, '.change-script-set');
                        const data = new FormData(form);
                        data.append('save', '1');
            
                        // Use XMLHttpRequest insteadof GM_xmlhttpRequest because there's unknown issue with GM_xmlhttpRequest
                        const xhr = new XMLHttpRequest();
                        xhr.open('POST', API.toAbsoluteURL(form.getAttribute('action')));
                        xhr.responseType = 'blob';
                        xhr.onload = async e => finishCallback(await API.parseDocument(xhr.response));
                        xhr.onerror = onerror;
                        xhr.send(data);
                    },
            
                    // Download and parse a url page into a html document(dom).
                    // Returns a promise fulfills with dom
                    async getDocument(url, retry=5) {
                        try {
                            const response = await fetch(url, {
                                method: 'GET',
                                cache: 'reload',
                            });
                            if (response.status === 200) {
                                const blob = await response.blob();
                                const oDom = await API.parseDocument(blob);
                                return oDom;
                            } else {
                                throw new Error(`response.status is not 200 (${response.status})`);
                            }
                        } catch(err) {
                            if (--retry > 0) {
                                return API.getDocument(url, retry);
                            } else {
                                throw err;
                            }
                        }
                    },
            
                    // Returns a promise fulfills with dom
                    parseDocument(htmlblob) {
                        return new Promise((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onload = function(e) {
                                const htmlText = reader.result;
                                const dom = new DOMParser().parseFromString(htmlText, 'text/html');
                                resolve(dom);
                            }
                            reader.onerror = err => reject(err);
                            reader.readAsText(htmlblob, document.characterSet);
                        });
                    },
            
                    toAbsoluteURL(relativeURL, base=`${location.protocol}//${location.host}/`) {
                        return new URL(relativeURL, base).href;
                    },
            
                    GM_hasVersion(version) {
                        return hasVersion(GM_info?.version || '0', version);
            
                        function hasVersion(ver1, ver2) {
                            return compareVersions(ver1.toString(), ver2.toString()) >= 0;
            
                            // https://greasyfork.org/app/javascript/versioncheck.js
                            // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/version/format
                            function compareVersions(a, b) {
                            if (a == b) {
                                return 0;
                            }
                            let aParts = a.split('.');
                            let bParts = b.split('.');
                            for (let i = 0; i < aParts.length; i++) {
                                let result = compareVersionPart(aParts[i], bParts[i]);
                                if (result != 0) {
                                return result;
                                }
                            }
                            // If all of a's parts are the same as b's parts, but b has additional parts, b is greater.
                            if (bParts.length > aParts.length) {
                                return -1;
                            }
                            return 0;
                            }
            
                            function compareVersionPart(partA, partB) {
                            let partAParts = parseVersionPart(partA);
                            let partBParts = parseVersionPart(partB);
                            for (let i = 0; i < partAParts.length; i++) {
                                // "A string-part that exists is always less than a string-part that doesn't exist"
                                if (partAParts[i].length > 0 && partBParts[i].length == 0) {
                                return -1;
                                }
                                if (partAParts[i].length == 0 && partBParts[i].length > 0) {
                                return 1;
                                }
                                if (partAParts[i] > partBParts[i]) {
                                return 1;
                                }
                                if (partAParts[i] < partBParts[i]) {
                                return -1;
                                }
                            }
                            return 0;
                            }
            
                            // It goes number, string, number, string. If it doesn't exist, then
                            // 0 for numbers, empty string for strings.
                            function parseVersionPart(part) {
                            if (!part) {
                                return [0, "", 0, ""];
                            }
                            let partParts = /([0-9]*)([^0-9]*)([0-9]*)([^0-9]*)/.exec(part)
                            return [
                                partParts[1] ? parseInt(partParts[1]) : 0,
                                partParts[2],
                                partParts[3] ? parseInt(partParts[3]) : 0,
                                partParts[4]
                            ];
                            }
                        }
                    }
                };
            
                return API;
            }
        },
        'Favorite panel': {
            checkers: {
                type: 'func',
                value: () => {
                    const path = location.pathname.split('/').filter(p=>p).map(p => p.toLowerCase());
                    const index = path.indexOf('scripts');
                    const scripts_exist = [0,1].includes(index);
                    const is_scripts_list = path.length-1 === index;
                    const is_set_page = /[\?&]set=\d+/.test(location.search);
                    const correct_page = [undefined, 'code', 'feedback'].includes(path[index+2]);
                    return scripts_exist && !is_scripts_list && !is_set_page && correct_page;
                }
            },
            dependencies: ['utils', 'api'],
            func() {
                /** @type {utils} */
                const utils = require('utils');
                /** @type {api} */
                const GFScriptSetAPI = require('api');
                //if (!GFScriptSetAPI.getUserpage()) {return false;}

                class FavoritePanel {
                    #CM;
                    #sid;
                    #sets;
                    #elements;
                    #disabled;

                    constructor(CM) {
                        this.#CM = CM;
                        this.#sid = location.pathname.match(/scripts\/(\d+)/)[1];
                        this.#sets = this.#CM.getConfig('script-sets').sets;
                        this.#elements = {};
                        this.disabled = false;

                        // Sort sets by name in alphabetical order
                        FavoritePanel.#sortSetsdata(this.#sets);

                        const script_after = $('#script-feedback-suggestion+*') || $('#new-script-discussion');
                        const script_parent = script_after.parentElement;

                        // Container
                        const script_favorite = this.#elements.container = $$CrE({
                            tagName: 'div',
                            props: {
                                id: 'script-favorite',
                                innerHTML: CONST.Text.FavEdit
                            },
                            styles: { margin: '0.75em 0' }
                        });

                        // Selecter
                        const favorite_groups = this.#elements.select = $$CrE({
                            tagName: 'select',
                            props: { id: 'favorite-groups' },
                            styles: { maxWidth: '40vw' },
                            listeners: [['change', (() => {
                                let lastSelected = 0;
                                const record = () => lastSelected = favorite_groups.selectedIndex;
                                const recover = () => favorite_groups.selectedIndex = lastSelected;

                                return e => {
                                    const value = favorite_groups.value;
                                    const type = /^\d+$/.test(value) ? 'set-id' : 'command';

                                    switch (type) {
                                        case 'set-id': {
                                            const set = this.#sets.find(set => set.id === favorite_groups.value);
                                            favorite_edit.href = set.linkedit;
                                            break;
                                        }
                                        case 'command': {
                                            recover();
                                            this.#execCommand(value);
                                        }
                                    }

                                    this.#refreshButtonDisplay();
                                    record();
                                }
                            }) ()]]
                        });
                        favorite_groups.id = 'favorite-groups';

                        // Buttons
                        const makeBtn = (id, innerHTML, onClick, isLink=false) => $$CrE({
                            tagName: 'a',
                            props: {
                                id, innerHTML,
                                [isLink ? 'target' : 'href']: isLink ? '_blank' : 'javascript:void(0);'
                            },
                            styles: { margin: '0px 0.5em' },
                            listeners: [['click', onClick]]
                        });

                        const favorite_add = this.#elements.btnAdd = makeBtn('favorite-add', CONST.Text.Add, e => this.#addFav());
                        const favorite_remove = this.#elements.btnRemove = makeBtn('favorite-remove', CONST.Text.Remove, e => this.#removeFav());
                        const favorite_edit = this.#elements.btnEdit = makeBtn('favorite-edit', CONST.Text.Edit, e => {}, true);
                        const favorite_iframe = this.#elements.btnIframe = makeBtn('favorite-edit-in-page', CONST.Text.EditIframe, e => this.#editInPage(e));
                        const favorite_copy = this.#elements.btnCopy = makeBtn('favorite-add', CONST.Text.CopySID, e => utils.copyText(this.#sid));
                        const favorite_sync = this.#elements.btnSync = makeBtn('favorite-sync', CONST.Text.Sync, e => this.#refresh());

                        script_favorite.appendChild(favorite_groups);
                        script_after.before(script_favorite);
                        [favorite_add, favorite_remove, favorite_edit, favorite_iframe, favorite_copy, favorite_sync].forEach(button => script_favorite.appendChild(button));

                        // Text tip
                        const tip = this.#elements.tip = $CrE('span');
                        script_favorite.appendChild(tip);

                        // Display cached sets first
                        this.#displaySets();

                        // Request GF document to update sets
                        this.#autoRefresh();
                    }

                    get sid() {
                        return this.#sid;
                    }

                    get sets() {
                        return FavoritePanel.#deepClone(this.#sets);
                    }

                    get elements() {
                        return FavoritePanel.#lightClone(this.#elements);
                    }

                    #refresh() {
                        const that = this;
                        const method = CONFIG.useAPI ? 'api' : 'doc';
                        return {
                            api: () => this.#refresh_api(),
                            doc: () => this.#refresh_doc()
                        }[method]();
                    }

                    async #refresh_api() {
                        const CONFIG = this.#CM.Config;

                        this.#disable();
                        this.#tip(CONST.Text.Refreshing.Data);

                        // Check login status
                        if (!GFScriptSetAPI.getUserpage()) {
                            this.#tip(CONST.Text.NotLoggedIn);
                            return;
                        }

                        // Request sets data api
                        const api_result = await GFScriptSetAPI.getSetsData();
                        const sets_data = api_result.data;
                        const uid = GFScriptSetAPI.getUserID();

                        if (!api_result.ok) {
                            // When api fails, use doc as fallback
                            DoLog(LogLevel.Error, 'Sets API failed.');
                            DoLog(LogLevel.Error, api_result);
                            return this.#refresh_doc();
                        }

                        // For forward compatibility, convert all setids and scriptids to string
                        // and fill property set.link and set.linkedit
                        for (const set of sets_data) {
                            // convert set id to string
                            set.id = set.id.toString();
                            // https://greasyfork.org/zh-CN/scripts?set=439237
                            set.link = replaceText(CONST.URL.SetLink, { $ID: set.id });
                            // https://greasyfork.org/zh-CN/users/667968-pyudng/sets/439237/edit
                            set.linkedit = replaceText(CONST.URL.SetEdit, { $UID: uid, $ID: set.id });

                            // there's two kind of sets: Favorite and non-favorite
                            // favorite set's data is an array of object, where each object represents a script, with script's properties
                            // non-favorite set's data is an array of ints, where each int means a script's id
                            // For forward compatibility, we only store script ids, in string format
                            set.scripts.forEach((script, i, scripts) => {
                                if (typeof script === 'number') {
                                    scripts[i] = script.toString();
                                } else {
                                    scripts[i] = script.id.toString();
                                }
                            });
                        }

                        // Sort sets by name in alphabetical order
                        FavoritePanel.#sortSetsdata(sets_data);

                        this.#sets = CONFIG['script-sets'].sets = sets_data;
                        CONFIG['script-sets'].time = Date.now();

                        this.#tip();
                        this.#enable();
                        this.#displaySets();
                        this.#refreshButtonDisplay();
                    }

                    // Request document: get sets list and
                    async #refresh_doc() {
                        const CONFIG = this.#CM.Config;

                        this.#disable();
                        this.#tip(CONST.Text.Refreshing.List);

                        // Check login status
                        if (!GFScriptSetAPI.getUserpage()) {
                            this.#tip(CONST.Text.NotLoggedIn);
                            return;
                        }

                        // Refresh sets list
                        this.#sets = CONFIG['script-sets'].sets = await GFScriptSetAPI.getScriptSets();
                        CONFIG['script-sets'].time = Date.now();
                        this.#displaySets();

                        // Refresh each set's script list
                        this.#tip(CONST.Text.Refreshing.Script);
                        await Promise.all(this.#sets.map(async set => {
                            // Fetch scripts
                            set.scripts = await GFScriptSetAPI.getSetScripts(set.linkedit);
                            this.#displaySets();

                            // Save to GM_storage
                            const setIndex = CONFIG['script-sets'].sets.findIndex(s => s.id === set.id);
                            CONFIG['script-sets'].sets[setIndex].scripts = set.scripts;
                            CONFIG['script-sets'].time = Date.now();
                        }));

                        this.#tip();
                        this.#enable();
                        this.#refreshButtonDisplay();
                    }

                    // Refresh on instance creation.
                    // This should be running in low-frequecy. Refreshing makes lots of requests which may resul in a 503 error(rate limit) for the user.
                    #autoRefresh(minTime=1*24*60*60*1000) {
                        const CONFIG = this.#CM.Config;
                        const lastRefresh = new Date(CONFIG['script-sets'].time);
                        if (Date.now() - lastRefresh > minTime) {
                            this.#refresh();
                            return true;
                        } else {
                            return false;
                        }
                    }

                    #addFav() {
                        const set = this.#getCurrentSet();
                        const option = set.elmOption;

                        this.#displayNotice(CONST.Text.Working[0]);
                        GFScriptSetAPI.addFav(this.#getCurrentSet().linkedit, this.#sid, editStatus => {
                            if (!editStatus) {
                                this.#displayNotice(CONST.Text.Error.AlreadyExist);
                                option.innerText = `${CONST.Text.InSetStatus[1]} ${set.name}`;
                            } else {
                                this.#displayNotice(CONST.Text.Working[1]);
                            }
                        }, finishStatus => {
                            if (finishStatus) {
                                // Save to this.#sets and GM_storage
                                if (CONFIG['script-sets'].sets.some(set => !set.scripts)) {
                                    // If scripts property is missing, do sync(refresh)
                                    this.#refresh();
                                } else {
                                    const setIndex = CONFIG['script-sets'].sets.findIndex(s => s.id === set.id);
                                    CONFIG['script-sets'].sets[setIndex].scripts.push(this.#sid);
                                    this.#sets = CM.getConfig('script-sets').sets;
                                }

                                // Display
                                this.#displayNotice(typeof finishStatus === 'string' ? finishStatus : CONST.Text.Error.Unknown);
                                set.elmOption.innerText = `${CONST.Text.InSetStatus[1]} ${set.name}`;
                                this.#displaySets();
                            } else {
                                this.#displayNotice(CONST.Text.Error.NetworkError);
                            }
                        });
                    }

                    #removeFav() {
                        const set = this.#getCurrentSet();
                        const option = set.elmOption;

                        this.#displayNotice(CONST.Text.Working[0]);
                        GFScriptSetAPI.removeFav(this.#getCurrentSet().linkedit, this.#sid, editStatus => {
                            if (!editStatus) {
                                this.#displayNotice(CONST.Text.Error.NotExist);
                                option.innerText = `${CONST.Text.InSetStatus[0]} ${set.name}`;
                            } else {
                                this.#displayNotice(CONST.Text.Working[1]);
                            }
                        }, finishStatus => {
                            if (finishStatus) {
                                // Save to this.#sets and GM_storage
                                if (CONFIG['script-sets'].sets.some(set => !set.scripts)) {
                                    // If scripts property is missing, do sync(refresh)
                                    this.#refresh();
                                } else {
                                    const setIndex = CONFIG['script-sets'].sets.findIndex(s => s.id === set.id);
                                    const scriptIndex = CONFIG['script-sets'].sets[setIndex].scripts.indexOf(this.#sid);
                                    CONFIG['script-sets'].sets[setIndex].scripts.splice(scriptIndex, 1);
                                    this.#sets = CM.getConfig('script-sets').sets;
                                }

                                // Display
                                this.#displayNotice(typeof finishStatus === 'string' ? finishStatus : CONST.Text.Error.Unknown);
                                set.elmOption.innerText = `${CONST.Text.InSetStatus[0]} ${set.name}`;
                                this.#displaySets();
                            } else {
                                this.#displayNotice(CONST.Text.Error.NetworkError);
                            }
                        });
                    }

                    #editInPage(e) {
                        e.preventDefault();

                        const _iframes = [...$All(this.#elements.container, '.script-edit-page')];
                        if (_iframes.length) {
                            // Iframe exists, close iframe
                            this.#elements.btnIframe.innerText = CONST.Text.EditIframe;
                            _iframes.forEach(ifr => ifr.remove());
                            this.#refresh();
                        } else {
                            // Iframe not exist, make iframe
                            this.#elements.btnIframe.innerText = CONST.Text.CloseIframe;

                            const iframe = $$CrE({
                                tagName: 'iframe',
                                props: {
                                    src: this.#getCurrentSet().linkedit
                                },
                                styles: {
                                    width: '100%',
                                    height: '60vh'
                                },
                                classes: ['script-edit-page'],
                                listeners: [['load', e => {
                                    //this.#refresh();
                                    //iframe.style.height = iframe.contentDocument.body.parentElement.offsetHeight + 'px';
                                }]]
                            });
                            this.#elements.container.appendChild(iframe);
                        }
                    }

                    #displayNotice(text) {
                        const notice = $CrE('p');
                        notice.classList.add('notice');
                        notice.id = 'fav-notice';
                        notice.innerText = text;
                        const old_notice = $('#fav-notice');
                        old_notice && old_notice.parentElement.removeChild(old_notice);
                        $('#script-content').insertAdjacentElement('afterbegin', notice);
                    }

                    #tip(text='', timeout=0) {
                        this.#elements.tip.innerText = text;
                        timeout > 0 && setTimeout(() => this.#elements.tip.innerText = '', timeout);
                    }

                    // Apply this.#sets to gui
                    #displaySets() {
                        const elements = this.#elements;

                        // Save selected set
                        const old_value = elements.select.value;
                        [...elements.select.children].forEach(child => child.remove());

                        // Make <optgroup>s and <option>s
                        const serverGroup = elements.serverGroup = $$CrE({ tagName: 'optgroup', attrs: { label: CONST.Text.Groups.Server } });
                        this.#sets.forEach(set => {
                            // Create <option>
                            set.elmOption = $$CrE({
                                tagName: 'option',
                                props: {
                                    innerText: set.name,
                                    value: set.id
                                }
                            });
                            // Display inset status
                            if (set.scripts) {
                                const inSet = set.scripts.includes(this.#sid);
                                set.elmOption.innerText = `${CONST.Text.InSetStatus[inSet+0]} ${set.name}`;
                            }
                            // Append <option> into <select>
                            serverGroup.appendChild(set.elmOption);
                        });
                        if (this.#sets.length === 0) {
                            const optEmpty = elements.optEmpty = $$CrE({
                                tagName: 'option',
                                props: {
                                    innerText: CONST.Text.NoSetsYet,
                                    value: 'empty',
                                    selected: true
                                }
                            });
                            serverGroup.appendChild(optEmpty);
                        }

                        const newGroup = elements.newGroup = $$CrE({ tagName: 'optgroup', attrs: { label: CONST.Text.Groups.New } });
                        const newSet = elements.newSet = $$CrE({
                            tagName: 'option',
                            props: {
                                innerText: CONST.Text.NewSet,
                                value: 'new',
                            }
                        });
                        newGroup.appendChild(newSet);
                        [serverGroup, newGroup].forEach(optgroup => elements.select.appendChild(optgroup));

                        // Adjust <select> width
                        elements.select.style.width = Math.max.apply(null, Array.from($All(elements.select, 'option')).map(o => o.innerText.length)).toString() + 'em';

                        // Select previous selected set's <option>
                        const selected = old_value ? [...$All(elements.select, 'option')].find(option => option.value === old_value) : null;
                        selected && (selected.selected = true);

                        // Set edit-button.href
                        if (elements.select.value !== 'empty') {
                            const curset = this.#sets.find(set => set.id === elements.select.value);
                            elements.btnEdit.href = curset.linkedit;
                        }

                        // Display correct button
                        this.#refreshButtonDisplay();
                    }

                    // Display only add button when script in current set, otherwise remove button
                    // Disable set-related buttons when not selecting options that not represents a set
                    #refreshButtonDisplay() {
                        const set = this.#getCurrentSet();
                        !this.#disabled && ([this.#elements.btnAdd, this.#elements.btnRemove, this.#elements.btnEdit, this.#elements.btnIframe]
                                .forEach(element => set ? FavoritePanel.#enableElement(element) : FavoritePanel.#disableElement(element)));
                        if (!set || !set.scripts) { return null; }
                        if (set.scripts.includes(this.#sid)) {
                            this.#elements.btnAdd.style.setProperty('display', 'none');
                            this.#elements.btnRemove.style.removeProperty('display');
                            return true;
                        } else {
                            this.#elements.btnRemove.style.setProperty('display', 'none');
                            this.#elements.btnAdd.style.removeProperty('display');
                            return false;
                        }
                    }

                    #execCommand(command) {
                        switch (command) {
                            case 'new': {
                                const url = GFScriptSetAPI.getUserpage() + (this.#getCurrentSet() ? '/sets/new' : '/sets/new?fav=1');
                                window.open(url);
                                break;
                            }
                            case 'empty': {
                                // Do nothing
                                break;
                            }
                        }
                    }

                    // Returns null if no <option>s yet
                    #getCurrentSet() {
                        return this.#sets.find(set => set.id === this.#elements.select.value) || null;
                    }

                    #disable() {
                        [
                            this.#elements.select,
                            this.#elements.btnAdd, this.#elements.btnRemove,
                            this.#elements.btnEdit, this.#elements.btnIframe,
                            this.#elements.btnCopy, this.#elements.btnSync
                        ].forEach(element => FavoritePanel.#disableElement(element));
                        this.#disabled = true;
                    }

                    #enable() {
                        [
                            this.#elements.select,
                            this.#elements.btnAdd, this.#elements.btnRemove,
                            this.#elements.btnEdit, this.#elements.btnIframe,
                            this.#elements.btnCopy, this.#elements.btnSync
                        ].forEach(element => FavoritePanel.#enableElement(element));
                        this.#disabled = false;
                    }

                    static #disableElement(element) {
                        element.style.filter = 'grayscale(1) brightness(0.95)';
                        element.style.opacity = '0.25';
                        element.style.pointerEvents = 'none';
                        element.tabIndex = -1;
                    }

                    static #enableElement(element) {
                        element.style.removeProperty('filter');
                        element.style.removeProperty('opacity');
                        element.style.removeProperty('pointer-events');
                        element.tabIndex = 0;
                    }

                    static #deepClone(val) {
                        if (typeof structuredClone === 'function') {
                            return structuredClone(val);
                        } else {
                            return JSON.parse(JSON.stringify(val));
                        }
                    }

                    static #lightClone(val) {
                        if (['string', 'number', 'boolean', 'undefined', 'bigint', 'symbol', 'function'].includes(val) || val === null) {
                            return val;
                        }
                        if (Array.isArray(val)) {
                            return val.slice();
                        }
                        if (typeof val === 'object') {
                            return Object.fromEntries(Object.entries(val));
                        }
                    }

                    static #sortSetsdata(sets_data) {
                        // Sort sets by name in alphabetical order
                        const sorted_names = sets_data.map(set => set.name).sort();
                        if (sorted_names.includes('Favorite')) {
                            // Keep set `Favorite` at first place
                            sorted_names.splice(0, 0, sorted_names.splice(sorted_names.indexOf('Favorite'), 1)[0]);
                        }
                        sets_data.sort((setA, setB) => sorted_names.indexOf(setA.name) - sorted_names.indexOf(setB.name));
                    }
                }

                const panel = new FavoritePanel(CM);
            }
        },
        'api-doc switch': {
            checkers: {
                type: 'switch',
                value: true
            },
            dependencies: 'utils',
            func: e => {
                /** @type {utils} */
                const utils = require('utils');
                utils.makeBooleanSettings([{
                    text: CONST.Text.UseAPI,
                    key: 'useAPI',
                    defaultValue: true
                }]);
            }
        },
        'Set scripts sort': {
            checkers: {
                type: 'func',
                value: () => {
                    const scripts_exist = [1, 2].map(index => location.pathname.split('/')[index]?.toLowerCase()).includes('scripts');
                    const is_set_page = /[\?&]set=\d+/.test(location.search);
                    return scripts_exist && is_set_page;
                }
            },
            detectDom: '#script-list-sort>ul',
            func: e => {
                const search = new URLSearchParams(location.search);
                const set_id = search.get('set');
                const sort = search.get('sort');
                if (!CONFIG['script-sets'].sets.some(set => set.id === set_id)) { return false; }

                const ul = $('#script-list-sort>ul');
                [false, true].forEach(reverse => {
                    const li = $$CrE({
                        tagName: 'li',
                        classes: ['list-option', 'gse-sort'], // gse: (G)resyfork(S)et(E)dit+
                        attrs: { reverse: reverse ? '1' : '0' },
                    });
                    const a = $$CrE({
                        tagName: 'a',
                        props: { innerText: CONST.Text.sortByApiDefault[+reverse] },
                        attrs: { rel: 'nofollow', href: getSortUrl(reverse) }
                    });
                    li.appendChild(a);
                    ul.appendChild(li);
                });
                $AEL(ul, 'click', e => {
                    if (e.target.matches('.gse-sort>a')) {
                        e.preventDefault();
                        const a = e.target;
                        const li = a.parentElement;
                        const reverse = !!+li.getAttribute('reverse');
                        sortByApiDefault(reverse);
                        buttonClicked(a);
                        setSortUrl(reverse);
                    }
                }, { capture: true });

                switch (sort) {
                    case 'gse_default':
                        sortByApiDefault(false);
                        buttonClicked($('.gse-sort[reverse="0"]>a'));
                        break;
                    case 'gse_reverse':
                        sortByApiDefault(true);
                        buttonClicked($('.gse-sort[reverse="1"]>a'));
                        break;
                }

                /**
                 * Sort <li>s in #browse-script-list by default api order
                 * Default api order is by add-to-set time right now (2024-07-21),
                 * but this is not a promising feature
                 */
                function sortByApiDefault(reverse=false) {
                    const ol = $('#browse-script-list');
                    const li_scripts = Array.from(ol.children);
                    const set = CM.getConfig('script-sets').sets.find(set => set.id === set_id);
                    const scripts = set.scripts;
                    li_scripts.sort((li1, li2) => {
                        const [sid1, sid2] = [li1, li2].map(li => li.getAttribute('data-script-id'));
                        const [index1, index2] = [sid1, sid2].map(sid => scripts.indexOf(sid)).map(index => index >= 0 ? index : Infinity);

                        return (reverse ? [1, -1] : [-1, 1])[index1 > index2 ? 1 : 0];
                    });
                    //li_scripts.forEach(li => ol.removeChild(li));
                    li_scripts.forEach(li => ol.appendChild(li));
                }

                /**
                 * Change the clicked button gui to given one
                 */
                function buttonClicked(a) {
                    const li = a.parentElement;
                    const ul = li.parentElement;
                    const old_li_current = Array.from(ul.children).find(li => li.classList.contains('list-current'));

                    li.classList.add('list-current');
                    a.remove();
                    li.innerText = a.innerText;

                    old_li_current.classList.remove('list-current');
                    const old_li_a = $$CrE({
                        tagName: 'a',
                        attrs: { href: location.pathname + location.search + location.hash },
                        props: { innerText: old_li_current.innerText }
                    });
                    old_li_current.innerText = '';
                    old_li_current.appendChild(old_li_a);
                }

                /**
                 * Set url search params when sorting
                 */
                function setSortUrl(reverse) {
                    history.replaceState({}, '', getSortUrl(reverse));
                }

                /**
                 * Make corrent url search params with sorting
                 */
                function getSortUrl(reverse) {
                    const search = new URLSearchParams(location.search);
                    search.set('sort', reverse ? 'gse_reverse' : 'gse_default');
                    const url = location.pathname + '?' + search.toString();
                    return url;
                }
            }
        }
    };

    const oFuncs = Object.entries(functions).reduce((arr, [id, oFunc]) => {
        oFunc.id = id;
        arr.push(oFunc);
        return arr;
    }, []);
    loadFuncs(oFuncs);
})();