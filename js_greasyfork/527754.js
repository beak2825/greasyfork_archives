// ==UserScript==
// @name         NTR ToolBox
// @namespace    http://tampermonkey.net/
// @version      v0.7
// @author       TheNano
// @description  ToolBox for Novel Translate bot website
// @match        https://books.fishhawk.top/*
// @match        https://books1.fishhawk.top/*
// @match        https://n.novelia.cc/*
// @icon         https://github.com/LittleSurvival/NTR-ToolBox/blob/main/icon.jpg?raw=true
// @grant        GM_openInTab
// @license      All Rights Reserved
// @downloadURL https://update.greasyfork.org/scripts/527754/NTR%20ToolBox.user.js
// @updateURL https://update.greasyfork.org/scripts/527754/NTR%20ToolBox.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (window._NTRToolBoxInstance) {
        return;
    }

    window._NTRToolBoxInstance = true;

    const CONFIG_VERSION = 20;
    const VERSION = 'v0.6';
    const CONFIG_STORAGE_KEY = 'NTR_ToolBox_Config';
    const IS_MOBILE = /Mobi|Android/i.test(navigator.userAgent);
    const domainAllowed = (location.hostname === 'books.fishhawk.top' || location.hostname === 'books1.fishhawk.top' || location.hostname === 'n.novelia.cc');

    // -----------------------------------
    // Module settings
    // -----------------------------------

    function newBooleanSetting(nameDefault, boolDefault) {
        return { name: nameDefault, type: 'boolean', value: Boolean(boolDefault) };
    }
    function newNumberSetting(nameDefault, numDefault) {
        return { name: nameDefault, type: 'number', value: Number(numDefault || 0) };
    }
    function newStringSetting(nameDefault, strDefault) {
        return { name: nameDefault, type: 'string', value: String(strDefault == null ? '' : strDefault) };
    }
    function newSelectSetting(nameDefault, arrOptions, valDefault) {
        return { name: nameDefault, type: 'select', value: valDefault, options: arrOptions };
    }
    function getModuleSetting(mod, key) {
        if (!mod.settings) return undefined;
        const found = mod.settings.find(s => s.name === key);
        return found ? found.value : undefined;
    }
    function isModuleEnabledByWhitelist(modItem) {
        if (!modItem.whitelist) {
            return domainAllowed;
        }
        const whitelist = modItem.whitelist;
        const parts = Array.isArray(whitelist) ? whitelist : [whitelist];
        return domainAllowed && parts.some(p => {
            if (typeof p === 'string') {
                if (p.endsWith('/*')) {
                    const base = p.slice(0, -2);
                    return location.pathname.startsWith(base) || location.pathname === base;
                }
                return location.pathname.includes(p);
            }
            return false;
        });
    }

    // -----------------------------------
    // Module definitions
    // -----------------------------------
    const moduleAddSakuraTranslator = {
        name: '添加Sakura翻譯器',
        type: 'onclick',
        whitelist: '/workspace/sakura',
        settings: [
            newNumberSetting('數量', 5),
            newStringSetting('名稱', 'NTR translator '),
            newStringSetting('鏈接', 'https://sakura-share.one'),
            newStringSetting('bind', 'none'),
        ],
        run: async function (cfg) {
            const totalCount = getModuleSetting(cfg, '數量') || 1;
            const namePrefix = getModuleSetting(cfg, '名稱') || '';
            const linkValue = getModuleSetting(cfg, '鏈接') || '';

            StorageUtils.addSakuraWorker(namePrefix, linkValue, totalCount);
        }
    }

    const moduleAddGPTTranslator = {
        name: '添加GPT翻譯器',
        type: 'onclick',
        whitelist: '/workspace/gpt',
        settings: [
            newNumberSetting('數量', 5),
            newStringSetting('名稱', 'NTR translator '),
            newStringSetting('模型', 'deepseek-chat'),
            newStringSetting('鏈接', 'https://api.deepseek.com'),
            newStringSetting('Key', 'sk-wait-for-input'),
            newStringSetting('bind', 'none'),
        ],
        run: async function (cfg) {
            const totalCount = getModuleSetting(cfg, '數量') || 1;
            const namePrefix = getModuleSetting(cfg, '名稱') || '';
            const model = getModuleSetting(cfg, '模型') || '';
            const apiKey = getModuleSetting(cfg, 'Key') || '';
            const apiUrl = getModuleSetting(cfg, '鏈接') || '';

            StorageUtils.addGPTWorker(namePrefix, model, apiUrl, apiKey, totalCount);
        }
    };

    const moduleDeleteTranslator = {
        name: '刪除翻譯器',
        type: 'onclick',
        whitelist: '/workspace',
        settings: [
            newStringSetting('排除', '共享,本机,AutoDL'),
            newStringSetting('bind', 'none'),
        ],
        run: async function (cfg) {
            const excludeStr = getModuleSetting(cfg, '排除') || '';
            const excludeArr = excludeStr.split(',').filter(x => x);

            if (location.href.endsWith('gpt')) {
                StorageUtils.removeAllWorkers(StorageUtils.gpt, excludeArr);
            } else if (location.href.endsWith('sakura')) {
                StorageUtils.removeAllWorkers(StorageUtils.sakura, excludeArr);
            }
        }
    };

    const moduleLaunchTranslator = {
        name: '啟動翻譯器',
        type: 'onclick',
        whitelist: '/workspace',
        settings: [
            newNumberSetting('延遲間隔', 50),
            newNumberSetting('最多啟動', 999),
            newBooleanSetting('避免無效啟動', true),
            newStringSetting('排除', '本机,AutoDL'),
            newStringSetting('bind', 'none'),
        ],
        run: async function (cfg, auto) {
            const intervalVal = getModuleSetting(cfg, '延遲間隔') || 50;
            const maxClick = getModuleSetting(cfg, '最多啟動') || 999;
            const noEmptyLaunch = getModuleSetting(cfg, '避免無效啟動');
            const allBtns = [...document.querySelectorAll('button')].filter(btn => {
                if (!auto && noEmptyLaunch) return true;
                const listItem = btn.closest('.n-list-item');
                if (listItem) {
                    const errorMessages = listItem.querySelectorAll('div');
                    return !Array.from(errorMessages).some(div => div.textContent.includes("TypeError: Failed to fetch"));
                }
                return true;
            });
            const delay = ms => new Promise(r => setTimeout(r, ms));
            let idx = 0, clickCount = 0, lastRunning = 0, emptyCheck = 0;

            async function nextClick() {
                while (idx < allBtns.length && clickCount < maxClick) {
                    const btn = allBtns[idx++];
                    if (btn.textContent.includes('启动')) {
                        btn.click();
                        clickCount++;
                        await delay(intervalVal);
                    }
                    if (noEmptyLaunch) {
                        let running = [...document.querySelectorAll('button')].filter(btn => btn.textContent.includes('停止')).length;
                        if (running == lastRunning) emptyCheck++;
                        if (emptyCheck > 3) break;
                    }
                }
            }
            await nextClick();
        }
    };

    const moduleQueueSakuraV2 = {
        name: '排隊Sakura v2',
        type: 'onclick',
        whitelist: ['/wenku', '/novel', '/favorite'],
        progress: { percentage: 0, info: '' },
        settings: [
            newNumberSetting('單次擷取web數量(可破限)', 20),
            newNumberSetting('擷取單頁wenku數量(deving)', 20),
            newSelectSetting('模式', ['常規', '過期', '重翻'], '常規'),
            newSelectSetting('分段', ['智能', '固定'], '智能'),
            newNumberSetting('智能均分任務上限', 1000),
            newNumberSetting('智能均分章節下限', 5),
            newNumberSetting('固定均分任務', 6),
            newBooleanSetting('R18(需登入)', true),
            newStringSetting('bind', 'none'),
        ],
        run: async function (cfg) {
            const webCatchLimit = getModuleSetting(cfg, '單次擷取web數量(可破限)') || 20;
            const wenkuCatchLimit = getModuleSetting(cfg, '擷取單頁wenku數量(deving)') || 20;
            const pair = getModuleSetting(cfg, '固定均分任務') || 6;
            const smartJobLimit = getModuleSetting(cfg, '智能均分任務上限') || 1000;
            const smartChapterLimit = getModuleSetting(cfg, '智能均分章節下限') || 5;
            const type = TaskUtils.getTypeString(window.location.pathname);
            const mode = getModuleSetting(cfg, '模式') || '常規';
            const sepMode = getModuleSetting(cfg, '分段') || '智能';
            const r18Bypass = getModuleSetting(cfg, 'R18(需登入)');

            let results = [];
            let errorFlag = false;
            const maxRetries = 3;

            const modeMap = { '常規': '常规', '過期': '过期', '重翻': '重翻' };
            const cnMode = modeMap[mode] || '常规';

            switch (type) {
                case 'wenkus': {
                    const wenkuIds = TaskUtils.wenkuIds();
                    const apiEndpoint = `/api/wenku/`;

                    await Promise.all(
                        wenkuIds.map(async (id) => {
                            let attempts = 0;
                            let success = false;

                            while (attempts < maxRetries && !success) {
                                try {
                                    const response = await script.fetch(`${window.location.origin}${apiEndpoint}${id}`, r18Bypass);
                                    if (!response.ok) throw new Error('Network response was not ok');
                                    const data = await response.json();
                                    const volumeIds = data.volumeJp.map(volume => volume.volumeId);

                                    volumeIds.forEach(name => results.push({ task: TaskUtils.wenkuLinkBuilder(id, name, SettingUtils.getTranslateMode(mode)), description: name }))
                                    success = true;
                                } catch (error) {
                                    NotificationUtils.showError(`Failed to fetch data for ID ${id}, attempt ${attempts + 1}.`);
                                    attempts++;
                                    if (attempts < maxRetries) {
                                        await new Promise(resolve => setTimeout(resolve, 1000));
                                    }
                                }
                            }
                        })
                    );
                    await StorageUtils.addJobs(StorageUtils.sakura, results);
                    break;
                };
                case 'wenku': {
                    await TaskUtils.clickButtons(cnMode);
                    await TaskUtils.clickButtons('排队Sakura');
                    break;
                }
                case 'novels': {
                    const apiUrl = TaskUtils.webSearchApi(webCatchLimit);
                    try {
                        const response = await script.fetch(`${window.location.origin}${apiUrl}`, r18Bypass);
                        if (!response.ok) throw new Error('Network response was not ok');
                        const data = await response.json();
                        const novels = data.items.map(item => {
                            const title = item.titleZh ?? item.titleJp;
                            return {
                                url: `/${item.providerId}/${item.novelId}`,
                                description: title,
                                total: item.total,
                                sakura: item.sakura
                            };
                        });
                        results = sepMode == '智能'
                            ? await TaskUtils.assignTasksSmart(novels, smartJobLimit, smartChapterLimit, SettingUtils.getTranslateMode(mode))
                            : await TaskUtils.assignTasksStatic(novels, pair, SettingUtils.getTranslateMode(mode));

                        await StorageUtils.addJobs(StorageUtils.sakura, results);
                    } catch (error) {
                        errorFlag = true;
                        NotificationUtils.showError(`Failed to fetch data for ID ${id}, attempt ${attempts + 1}.`)
                    }
                    break;
                }
                case 'novel': {
                    try {
                        const targetSpan = Array.from(document.querySelectorAll('span.n-text')).find(span => /总计 (\d+) \/ 百度 (\d+) \/ 有道 (\d+) \/ GPT (\d+) \/ Sakura (\d+)/.test(span.textContent));
                        const [_, total, , , , sakura] = targetSpan.textContent.match(/总计 (\d+) \/ 百度 (\d+) \/ 有道 (\d+) \/ GPT (\d+) \/ Sakura (\d+)/);
                        const url = window.location.pathname.split('/novel')[1];
                        const title = document.title;
                        if (title.includes('轻小说机翻机器人')) throw Error('小說頁尚未載入');

                        const novels = [{ url: url, total: total, sakura: sakura, description: title }];
                        results = sepMode == '智能'
                            ? await TaskUtils.assignTasksSmart(novels, smartJobLimit, smartChapterLimit, SettingUtils.getTranslateMode(mode))
                            : await TaskUtils.assignTasksStatic(novels, pair, SettingUtils.getTranslateMode(mode));

                        await StorageUtils.addJobs(StorageUtils.sakura, results);
                    } catch (error) {
                        errorFlag = true;
                        NotificationUtils.showError(`Failed to fetch data for ${title}.`);
                    }
                    break;
                }
                case 'favorite-web': {
                    const url = new URL(window.location.href);
                    //get folder id
                    const id = url.pathname.endsWith('/web') ? 'default' : url.pathname.split('/').pop();
                    let tries = 0;
                    let page = 0;

                    while (true) {
                        const apiUrl = `${url.origin}/api/user/favored-web/${id}?page=${page}&pageSize=90&sort=update`;
                        let tasks = [];
                        let novelCount = 0;
                        try {
                            const response = await script.fetch(apiUrl);
                            const data = await response.json();
                            const novels = data.items.map(item => {
                                const title = item.titleZh ?? item.titleJp;
                                return {
                                    url: `/${item.providerId}/${item.novelId}`,
                                    description: title,
                                    total: item.total,
                                    sakura: item.sakura
                                };
                            });
                            novelCount = novels.length;
                            tasks = sepMode == '智能'
                                ? await TaskUtils.assignTasksSmart(novels, smartJobLimit, smartChapterLimit, SettingUtils.getTranslateMode(mode))
                                : await TaskUtils.assignTasksStatic(novels, pair, SettingUtils.getTranslateMode(mode));

                            await StorageUtils.addJobs(StorageUtils.sakura, tasks);
                            results.push(tasks);
                            NotificationUtils.showSuccess(`成功排隊 ${3 * page + 1}-${3 * page + 3}頁, 共${tasks.length}個任務`);
                        } catch (error) {
                            console.log(error);
                            NotificationUtils.showError(`Failed to fetch data for ${id}, page ${page + 1}.`);
                            if (tries++ > 3) break;
                            continue;
                        }
                        if (novelCount < 90) break;
                        else page++;
                    }
                    break;
                }
                case 'favorite-wenku': {
                    const url = new URL(window.location.href);
                    //get folder id
                    const id = url.pathname.endsWith('/wenku') ? 'default' : url.pathname.split('/').pop();
                    let page = 0;
                    let tries = 0;
                    while (true) {
                        const apiUrl = `${url.origin}/api/user/favored-wenku/${id}?page=${page}&pageSize=72&sort=update`;
                        let tasks = [];
                        let novelCount = 0;
                        try {
                            const response = await script.fetch(apiUrl);
                            const data = await response.json();
                            const wenkuIds = data.items.map(novel => novel.id);
                            novelCount = wenkuIds.length;

                            await Promise.all(
                                wenkuIds.map(async (id) => {
                                    let attempts = 0;
                                    let success = false;
                                    const apiEndpoint = `/api/wenku/`;

                                    while (attempts < maxRetries && !success) {
                                        try {
                                            const response = await script.fetch(`${window.location.origin}${apiEndpoint}${id}`, r18Bypass);
                                            if (!response.ok) throw new Error('Network response was not ok');
                                            const data = await response.json();
                                            const volumeIds = data.volumeJp.map(volume => volume.volumeId);

                                            volumeIds.forEach(name => tasks.push({ task: TaskUtils.wenkuLinkBuilder(id, name, mode), description: name }))
                                            success = true;
                                        } catch (error) {
                                            NotificationUtils.showError(`Failed to fetch data for ID ${id}, attempt ${attempts + 1}:`);
                                            attempts++;
                                            if (attempts < maxRetries) {
                                                await new Promise(resolve => setTimeout(resolve, 1000));
                                            }
                                        }
                                    }
                                })
                            );
                            await StorageUtils.addJobs(StorageUtils.sakura, tasks);
                            results.push(tasks);
                            NotificationUtils.showSuccess(`成功排隊 ${3 * page + 1}-${3 * page + 3}頁, 共${tasks.length}本小說`);
                        } catch (error) {
                            console.log(error);
                            NotificationUtils.showError(`Failed to fetch data for ${id}, page ${page + 1}.`);
                            if (tries > 3) break;
                            continue;
                        }
                        if (novelCount < 72) break;
                        else page++;
                    }
                    break;
                }
                default: { }
            }
            if (errorFlag) return;
            const novels = new Set(results.map(result => result.description));
            NotificationUtils.showSuccess(`排隊成功 : 共 ${novels.size} 本小說, 均分 ${results.length} 分段.`);
        }
    }

    const moduleQueueGPTV2 = {
        name: '排隊GPT v2',
        type: 'onclick',
        whitelist: ['/wenku', '/novel', '/favorite/web'],
        progress: { percentage: 0, info: '' },
        settings: [
            newNumberSetting('單次擷取web數量(可破限)', 20),
            newNumberSetting('擷取單頁wenku數量(deving)', 20),
            newSelectSetting('模式', ['常規', '過期', '重翻'], '常規'),
            newSelectSetting('分段', ['智能', '固定'], '智能'),
            newNumberSetting('智能均分任務上限', 1000),
            newNumberSetting('智能均分章節下限', 5),
            newNumberSetting('固定均分任務', 6),
            newBooleanSetting('R18(需登入)', true),
            newStringSetting('bind', 'none'),
        ],
        run: async function (cfg) {
            const webCatchLimit = getModuleSetting(cfg, '單次擷取web數量(可破限)') || 20;
            const wenkuCatchLimit = getModuleSetting(cfg, '擷取單頁wenku數量(deving)') || 20;
            const pair = getModuleSetting(cfg, '固定均分任務') || 6;
            const smartJobLimit = getModuleSetting(cfg, '智能均分任務上限') || 1000;
            const smartChapterLimit = getModuleSetting(cfg, '智能均分章節下限') || 5;
            const type = TaskUtils.getTypeString(window.location.pathname);
            const mode = getModuleSetting(cfg, '模式') || '常規';
            const sepMode = getModuleSetting(cfg, '分段') || '智能';
            const r18Bypass = getModuleSetting(cfg, 'R18(需登入)');

            let results = [];
            const maxRetries = 3;
            let errorFlag = false;

            const modeMap = { '常規': '常规', '過期': '过期', '重翻': '重翻' };
            const cnMode = modeMap[mode] || '常规';


            switch (type) {
                case 'wenkus': {
                    const wenkuIds = TaskUtils.wenkuIds();
                    const apiEndpoint = `/api/wenku/`;

                    await Promise.all(
                        wenkuIds.map(async (id) => {
                            let attempts = 0;
                            let success = false;

                            while (attempts < maxRetries && !success) {
                                try {
                                    const response = await script.fetch(`${window.location.origin}${apiEndpoint}${id}`, r18Bypass);
                                    if (!response.ok) throw new Error('Network response was not ok');
                                    const data = await response.json();
                                    const volumeIds = data.volumeJp.map(volume => volume.volumeId);

                                    volumeIds.forEach(name => results.push({ task: TaskUtils.wenkuLinkBuilder(id, name, mode), description: name }))
                                    success = true;
                                } catch (error) {
                                    NotificationUtils.showError(`Failed to fetch data for ID ${id}, attempt ${attempts + 1}:`);
                                    attempts++;
                                    if (attempts < maxRetries) {
                                        await new Promise(resolve => setTimeout(resolve, 1000));
                                    }
                                }
                            }
                        })
                    );
                    await StorageUtils.addJobs(StorageUtils.gpt, results);
                    break;
                };
                case 'wenku': {
                    await TaskUtils.clickButtons(cnMode);
                    await TaskUtils.clickButtons('排队Sakura');
                    break;
                }
                case 'novels': {
                    const apiUrl = TaskUtils.webSearchApi(webCatchLimit);
                    try {
                        const response = await script.fetch(`${window.location.origin}${apiUrl}`, r18Bypass)
                        if (!response.ok) throw new Error('Network response was not ok');
                        const data = await response.json();
                        const novels = data.items.map(item => {
                            const title = item.titleZh ?? item.titleJp;
                            return {
                                url: `/${item.providerId}/${item.novelId}`,
                                description: title,
                                total: item.total,
                                gpt: item.gpt
                            };
                        });
                        results = sepMode == '智能'
                            ? await TaskUtils.assignTasksSmart(novels, smartJobLimit, smartChapterLimit, SettingUtils.getTranslateMode(mode))
                            : await TaskUtils.assignTasksStatic(novels, pair, SettingUtils.getTranslateMode(mode));

                        await StorageUtils.addJobs(StorageUtils.gpt, results);
                    } catch (error) {
                        errorFlag = true;
                        NotificationUtils.showError(`Failed to fetch data for ID ${id}, attempt ${attempts + 1}:`);
                    }
                    break;
                }
                case 'novel': {
                    try {
                        const targetSpan = Array.from(document.querySelectorAll('span.n-text')).find(span => /总计 (\d+) \/ 百度 (\d+) \/ 有道 (\d+) \/ GPT (\d+) \/ Sakura (\d+)/.test(span.textContent));
                        const [_, total, , , gpt] = targetSpan.textContent.match(/总计 (\d+) \/ 百度 (\d+) \/ 有道 (\d+) \/ GPT (\d+) \/ Sakura (\d+)/);
                        const url = window.location.pathname.split('/novel')[1];

                        const title = document.title;
                        if (title.includes('轻小说机翻机器人')) throw Error('小說頁尚未載入');

                        const novels = [{ url: url, total: total, gpt: gpt, description: title }]

                        results = sepMode == '智能'
                            ? await TaskUtils.assignTasksSmart(novels, smartJobLimit, smartChapterLimit, SettingUtils.getTranslateMode(mode))
                            : await TaskUtils.assignTasksStatic(novels, pair, SettingUtils.getTranslateMode(mode));

                        await StorageUtils.addJobs(StorageUtils.gpt, results);
                    } catch (error) {
                        errorFlag = true;
                        NotificationUtils.showError(`Failed to fetch data for ${title}.`);
                    }
                    break;
                }
                case 'favorite-web': {
                    const url = new URL(window.location.href);
                    //get folder id
                    const id = url.pathname.endsWith('/web') ? 'default' : url.pathname.split('/').pop();
                    let tries = 0;
                    let page = 0;

                    while (true) {
                        const apiUrl = `${url.origin}/api/user/favored-web/${id}?page=${page}&pageSize=90&sort=update`;
                        let tasks = [];
                        let novelCount = 0;
                        try {
                            const response = await script.fetch(apiUrl);
                            const data = await response.json();
                            const novels = data.items.map(item => {
                                const title = item.titleZh ?? item.titleJp;
                                return {
                                    url: `/${item.providerId}/${item.novelId}`,
                                    description: title,
                                    total: item.total,
                                    gpt: item.gpt
                                };
                            });
                            novelCount = novels.length;
                            tasks = sepMode == '智能'
                                ? await TaskUtils.assignTasksSmart(novels, smartJobLimit, smartChapterLimit, SettingUtils.getTranslateMode(mode))
                                : await TaskUtils.assignTasksStatic(novels, pair, SettingUtils.getTranslateMode(mode));

                            await StorageUtils.addJobs(StorageUtils.gpt, tasks);
                            results.push(tasks);
                            NotificationUtils.showSuccess(`成功排隊 ${3 * page + 1}-${3 * page + 3}頁, 共${novelCount}本小說`);
                        } catch (error) {
                            console.log(error);
                            NotificationUtils.showError(`Failed to fetch data for ${id}, page ${page + 1}.`);
                            if (tries++ > 3) break;
                            continue;
                        }
                        if (novelCount < 90) break;
                        else page++;
                    }
                    break;
                }
                case 'favorite-wenku': {
                    const url = new URL(window.location.href);
                    //get folder id
                    const id = url.pathname.endsWith('/wenku') ? 'default' : url.pathname.split('/').pop();
                    let page = 0;
                    let tries = 0;
                    while (true) {
                        const apiUrl = `${url.origin}/api/user/favored-wenku/${id}?page=${page}&pageSize=72&sort=update`;
                        let tasks = [];
                        let novelCount = 0;
                        try {
                            const response = await script.fetch(apiUrl);
                            const data = await response.json();
                            const wenkuIds = data.items.map(novel => novel.id);
                            novelCount = wenkuIds.length;

                            await Promise.all(
                                wenkuIds.map(async (id) => {
                                    let attempts = 0;
                                    let success = false;
                                    const apiEndpoint = `/api/wenku/`;

                                    while (attempts < maxRetries && !success) {
                                        try {
                                            const response = await script.fetch(`${window.location.origin}${apiEndpoint}${id}`, r18Bypass);
                                            if (!response.ok) throw new Error('Network response was not ok');
                                            const data = await response.json();
                                            const volumeIds = data.volumeJp.map(volume => volume.volumeId);

                                            volumeIds.forEach(name => tasks.push({ task: TaskUtils.wenkuLinkBuilder(id, name, mode), description: name }))
                                            success = true;
                                        } catch (error) {
                                            NotificationUtils.showError(`Failed to fetch data for ID ${id}, attempt ${attempts + 1}:`);
                                            attempts++;
                                            if (attempts < maxRetries) {
                                                await new Promise(resolve => setTimeout(resolve, 1000));
                                            }
                                        }
                                    }
                                })
                            );
                            await StorageUtils.addJobs(StorageUtils.gpt, tasks);
                            results.push(tasks);
                            NotificationUtils.showSuccess(`成功排隊 ${3 * page + 1}-${3 * page + 3}頁, 共${tasks.length}本小說`);
                        } catch (error) {
                            console.log(error);
                            NotificationUtils.showError(`Failed to fetch data for ${id}, page ${page + 1}.`);
                            if (tries > 3) break;
                            continue;
                        }
                        if (novelCount < 72) break;
                        else page++;
                    }
                    break;
                }
                default: { }
            }
            if (errorFlag) return;
            const novels = new Set(results.map(result => result.description));
            NotificationUtils.showSuccess(`排隊成功 : 共 ${novels.size} 本小說, 均分 ${results.length} 分段.`);
        }
    }

    const moduleAutoRetry = {
        name: '自動重試',
        type: 'keep',
        whitelist: '/workspace/*',
        settings: [
            newNumberSetting('最大重試次數', 99),
            newBooleanSetting('置頂重試任務', false),
            newBooleanSetting('重啟翻譯器', true),
        ],
        _attempts: 0,
        _lastRun: 0,
        _interval: 1000,
        run: async function (cfg) {
            const now = Date.now();
            if (now - this._lastRun < this._interval) return;
            this._lastRun = now;

            const maxAttempts = getModuleSetting(cfg, '最大重試次數') || 99;
            const relaunch = getModuleSetting(cfg, '重啟翻譯器') || 3;
            const moveToTop = getModuleSetting(cfg, '置頂重試任務');

            if (!this._boundClickHandler) {
                this._boundClickHandler = (e) => {
                    if (e.target.tagName === 'button') {
                        this._attempts = 0;
                    }
                };
                document.addEventListener('click', this._boundClickHandler);
            }

            const listItems = document.querySelectorAll('.n-list-item');
            const unfinished = [...listItems].filter(item => {
                const desc = item.querySelector('.n-thing-main__description');
                return desc && desc.textContent.includes('未完成');
            });
            async function retryTasks(attempts) {
                const hasStop = [...document.querySelectorAll('button')].some(b => b.textContent === '停止');
                if (!hasStop) {
                    const retryBtns = [...document.querySelectorAll('button')].filter(b => b.textContent.includes('重试未完成任务'));
                    if (retryBtns[0]) {
                        const clickCount = Math.min(unfinished.length, listItems.length);
                        for (let i = 0; i < clickCount; i++) {
                            retryBtns[0].click();
                        }
                        if (moveToTop) {
                            TaskUtils.clickTaskMoveToTop(unfinished.length);
                        }
                        attempts++;
                    }
                }
                return attempts;
            }

            if (unfinished.length > 0 && this._attempts < maxAttempts) {
                this._attempts = await retryTasks(this._attempts);
                script.delay(10);
                if (relaunch) {
                    script.runModule('啟動翻譯器');
                }
            }
        }
    };

    const moduleSyncStorage = {
        name: '資料同步',
        type: 'onclick',
        whitelist: '/workspace/*',
        hidden: true,
        settings: [
            newStringSetting('bind', 'none')
        ],
        run: async function (cfg) {
        }
    }

    const defaultModules = [
        moduleAddSakuraTranslator,
        moduleAddGPTTranslator,
        moduleDeleteTranslator,
        moduleLaunchTranslator,
        moduleQueueSakuraV2,
        moduleQueueGPTV2,
        moduleAutoRetry,
        moduleSyncStorage,
    ];

    // -----------------------------------
    // Setting Utils
    // -----------------------------------
    class SettingUtils {
        static getTranslateMode(mode) {
            const map = { '常規': 'normal', '過期': 'expire', '重翻': 'all' };
            return map[mode];
        }
    }

    // -----------------------------------
    // TaskUtils Utils
    // -----------------------------------
    class TaskUtils {
        static getTypeString = (url) => {
            const patterns = {
                'wenkus': new RegExp(`^/wenku(\\?.*)?$`), // Matches /wenku and /wenku?params
                'wenku': new RegExp(`^/wenku\\/.*(\\?.*)?$`), // Matches /wenku/* and /wenku/*?params
                'novels': new RegExp(`^/novel(\\?.*)?$`), // Matches /novel and /novel?params
                'novel': new RegExp(`^/novel\\/.*(\\?.*)?$`), // Matches /novel/*/* and /novel/*/*?params
                'favorite-web': new RegExp(`^/favorite/web(/.*)?(\\?.*)?$`), // Matches /favorite/web and /favorite/web/* and /favorite/web?params
                'favorite-wenku': new RegExp(`^/favorite/wenku(/.*)?(\\?.*)?$`), // Matches /favorite/wenku and /favorite/wenku/* and /favorite/wenku?params
                'favorite-local': new RegExp(`^/favorite/local(/.*)?(\\?.*)?$`) // Matches /favorite/local and /favorite/local/* and /favorite/local?params
            };
            for (const [key, pattern] of Object.entries(patterns)) {
                if (pattern.test(url)) {
                    return key;
                }
            }
            return null;
        };

        static wenkuLinkBuilder(series, name, mode) {
            return `wenku/${series}/${name}?level=${mode}&forceMetadata=false&startIndex=0&endIndex=65536`
        }

        static webLinkBuilder(url, from = 0, to = 65536, mode) {
            return `web${url}?level=${mode}&forceMetadata=false&startIndex=${from}&endIndex=${to}`
        }

        //return "id"
        static wenkuIds() {
            const links = [...document.querySelectorAll('a[href^="/wenku/"]')];
            return links.map(link => link.getAttribute('href').split('/wenku/')[1]);
        }

        //return api link
        static webSearchApi(limit = 20) {
            const urlParams = new URLSearchParams(location.search), page = Math.max(urlParams.get('page') - 1 || 0, 0);
            const input = document.querySelector('input[placeholder="中/日文标题或作者"]');
            let rawQuery = input ? input.value.trim() : '';

            const query = encodeURIComponent(rawQuery);
            const selected = [...document.querySelectorAll('.n-text.__text-dark-131ezvy-p')].map(e => e.textContent.trim());

            const sourceMap = {
                Kakuyomu: 'kakuyomu',
                '成为小说家吧': 'syosetu',
                Novelup: 'novelup',
                Hameln: 'hameln',
                Pixiv: 'pixiv',
                Alphapolis: 'alphapolis'
            };
            const typeMap = { '连载中': '1', '已完结': '2', '短篇': '3', '全部': '0' };
            const levelMap = { '一般向': '1', 'R18': '2', '全部': '0' };
            const translateMap = { 'GPT': '1', 'Sakura': '2', '全部': '0' };
            const sortMap = { '更新': '0', '点击': '1', '相关': '2' };
            const providers = Object.keys(sourceMap)
                .filter(k => selected.includes(k))
                .map(k => sourceMap[k])
                .join(',') || 'kakuyomu,syosetu,novelup,hameln,pixiv,alphapolis';
            const tKey = Object.keys(typeMap).find(x => selected.includes(x)) || '全部';
            const lKey = Object.keys(levelMap).find(x => selected.includes(x)) || '全部';
            const trKey = Object.keys(translateMap).find(x => selected.includes(x)) || '全部';
            const sKey = Object.keys(sortMap).find(x => selected.includes(x)) || '更新';

            return `/api/novel?page=${page}&pageSize=${limit}&query=${query}` +
                `&provider=${encodeURIComponent(providers)}&type=${typeMap[tKey]}&level=${levelMap[lKey]}` +
                `&translate=${translateMap[trKey]}&sort=${sortMap[sKey]}`;
        }

        //return { task, description }
        static async assignTasksSmart(novels, smartJobLimit, smartChapterLimit, mode) {
            function undone(n) {
                if (mode === "normal") {
                    const sOrG = (n.sakura ?? n.gpt) || 0;
                    //Using max to deal with some total > sakura situation
                    return Math.max(n.total - sOrG, 0);
                }
                return n.total;
            }
            const totalChapters = novels.reduce((acc, n) => acc + undone(n), 0);
            const potentialMaxTask = Math.floor(totalChapters / smartChapterLimit);
            let maxTasks = Math.min(potentialMaxTask, smartJobLimit);

            if (maxTasks <= 0 && totalChapters > 0) {
                maxTasks = smartJobLimit;
            }
            if (totalChapters === 0) {
                return [];
            }
            const chunkSize = Math.ceil(totalChapters / (maxTasks || 1));
            const sorted = [...novels].sort((a, b) => undone(b) - undone(a));

            const result = [];
            let usedTasks = 0;

            for (const novel of sorted) {
                let remain = undone(novel);
                if (remain <= 0) continue;

                let startIndex = (mode === "normal") ? (novel.total - remain) : 0;

                while (remain > 0 && usedTasks < smartJobLimit) {
                    const thisChunk = Math.min(remain, chunkSize);
                    const endIndex = startIndex + thisChunk;

                    result.push({
                        task: TaskUtils.webLinkBuilder(novel.url, startIndex, endIndex, mode),
                        description: novel.description
                    });

                    usedTasks++;
                    remain -= thisChunk;
                    startIndex = endIndex;
                    if (usedTasks >= smartJobLimit) {
                        break;
                    }
                }
                if (usedTasks >= smartJobLimit) {
                    break;
                }
            }

            return result;
        }

        //return { task, description }
        static async assignTasksStatic(novels, parts, mode) {
            function undone(n) {
                if (mode === "normal") {
                    const sOrG = (n.sakura ?? n.gpt) || 0;
                    return n.total - sOrG;
                }
                return n.total;
            }

            const result = [];

            for (const novel of novels) {
                const totalChapters = undone(novel);
                if (totalChapters <= 0) continue;
                const startBase = (mode === "normal")
                    ? (novel.total - totalChapters)
                    : 0;

                const chunkSize = Math.ceil(totalChapters / parts);

                for (let i = 0; i < parts; i++) {
                    const chunkStart = startBase + i * chunkSize;
                    const chunkEnd = (i === parts - 1)
                        ? (startBase + totalChapters)
                        : (chunkStart + chunkSize);

                    if (chunkStart < startBase + totalChapters) {
                        result.push({
                            task: TaskUtils.webLinkBuilder(novel.url, chunkStart, chunkEnd, mode),
                            description: novel.description
                        });
                    }
                }
            }
            return result;
        }

        static async clickTaskMoveToTop(count, reserve=true) {
            const extras = document.querySelectorAll('.n-thing-header__extra');
            for (let i = 0; i < count;i++) {
                const offset = reserve ? extras.length - i - 1 : i;
                const container = extras[offset];
                const buttons = container.querySelectorAll('button');
                if (buttons.length) {
                    buttons[0].click();
                }
            }
        }

        static async clickButtons(name = '') {
            const btns = document.querySelectorAll('button');
            btns.forEach(btn => {
                if (name === '' || btn.textContent.includes(name)) {
                    btn.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
                }
            });
        }
    }

    // -----------------------------------
    // Storage Utils
    // -----------------------------------
    class StorageUtils {
        static sakura = location.hostname === 'n.novelia.cc' ? 'workspace-sakura' : 'sakura-workspace';
        static gpt = location.hostname === 'n.novelia.cc' ? 'gpt-workspace' : 'workspace-gpt';
        static updateUrl = [
            'workspace/sakura',
            'workspace/gpt'
        ];

        static async update() {
            const storageKey = (window.location.pathname.includes('workspace/sakura') ? this.sakura : (window.location.pathname.includes('workspace/gpt') ? this.gpt : null));
            if (!storageKey) return;

            const data = await this._getData(storageKey);
            await this._setData(storageKey, data);
        }

        static async _setData(key, data) {
            localStorage.setItem(key, JSON.stringify(data));
            window.dispatchEvent(new StorageEvent('storage', {
                key: key,
                newValue: JSON.stringify(data),
                url: window.location.href,
                storageArea: localStorage
            }));
        }

        static async _getData(key) {
            let raw = localStorage.getItem(key);
            if (raw) {
                return JSON.parse(raw);
            }
            return { workers: [], jobs: [], uncompletedJobs: [] };
        }

        static async addSakuraWorker(id, endpoint, amount = null, prevSegLength = 500, segLength = 500) {
            const total = amount ?? -1;
            let data = await this._getData(this.sakura);

            function _dataInsert(id, endpoint, prevSegLength, segLength) {
                const worker = { id, endpoint, prevSegLength, segLength };
                const existingIndex = data.workers.findIndex(w => w.id === id);
                if (existingIndex !== -1) {
                    data.workers[existingIndex] = worker;
                } else {
                    data.workers.push(worker);
                }
            }
            if (total == -1) {
                _dataInsert(id, endpoint, prevSegLength, segLength);
            } else {
                for (let i = 1; i < total + 1; i++) {
                    _dataInsert(id + i, endpoint, prevSegLength, segLength);
                }
            }
            await this._setData(this.sakura, data);
        }

        static async addGPTWorker(id, model, endpoint, key, amount = null) {
            const total = amount ?? -1;
            let data = await this._getData(this.gpt);

            function _dataInsert(id, model, endpoint, key) {
                const worker = { id, type: 'api', model, endpoint, key };
                const existingIndex = data.workers.findIndex(w => w.id === id);
                if (existingIndex !== -1) {
                    data.workers[existingIndex] = worker;
                } else {
                    data.workers.push(worker);
                }
            }
            if (total == -1) {
                _dataInsert(id, model, endpoint, key);
            } else {
                for (let i = 1; i < total + 1; i++) {
                    _dataInsert(id + i, model, endpoint, key);
                }
            }
            await this._setData(this.gpt, data);
        }

        static async removeWorker(key, id) {
            let data = await this._getData(key);
            data.workers = data.workers.filter(w => w.id !== id);
            await this._setData(key, data);
        }

        static async removeAllWorkers(key, exclude = []) {
            let data = await this._getData(key);
            data.workers = data.workers.filter(w => exclude.includes(w.id));
            await this._setData(key, data);
        }

        static async addJob(key, task, description, createAt = Date.now()) {
            const job = { task, description, createAt };
            let data = await this._getData(key);
            data.jobs.push(job);
            await this._setData(key, data);
        }

        static async addJobs(key, jobs = [], createAt = Date.now()) {
            let data = await this._getData(key);
            const existingTasks = new Set(data.jobs.map(job => job.task));
            jobs.forEach(({ task, description }) => {
                if (!existingTasks.has(task)) {
                    const job = { task, description, createAt };
                    data.jobs.push(job);
                }
            });
            await this._setData(key, data);
        }

        static async getUncompletedJobs(key) {
            return (await this._getData(key)).uncompletedJobs;
        }
    }

    class NotificationUtils {
        static _initContainer() {
            if (!this._container) {
                this._container = document.createElement('div');
                this._container.className = 'ntr-notification-container';
                document.body.appendChild(this._container);
            }
        }

        static showSuccess(text) {
            this._show(text, '✅');
        }

        static showWarning(text) {
            this._show(text, '⚠️');
        }

        static showError(text) {
            this._show(text, '❌');
        }

        static _show(msg, icon) {
            this._initContainer();
            const box = document.createElement('div');
            box.className = 'ntr-notification-message';

            const iconSpan = document.createElement('span');
            iconSpan.className = 'ntr-icon';
            iconSpan.textContent = icon;

            const textNode = document.createTextNode(msg);

            box.appendChild(iconSpan);
            box.appendChild(textNode);
            this._container.appendChild(box);

            setTimeout(() => {
                box.classList.add('fade-out');
                setTimeout(() => box.remove(), 300);
            }, 1000);
        }
    }


    // -----------------------------------
    // Main Toolbox
    // -----------------------------------
    class NTRToolBox {
        constructor() {
            this.configuration = this.loadConfiguration();
            this.keepActiveSet = new Set();
            this.headerMap = new Map();
            this._pollTimer = null;
            this.token = this.initToken();

            this._lastKeepRun = 0;
            this._lastVisRun = 0;
            this._lastEndPoint = window.location.href;

            this.buildGUI();
            this.attachGlobalKeyBindings();
            this.loadKeepStateAndStart();
            this.scheduleNextPoll();
        }

        static cloneDefaultModules() {
            return defaultModules.map(m => ({
                ...m,
                settings: m.settings ? m.settings.map(s => ({ ...s })) : [],
                _lastRun: 0
            }));
        }

        static DragHandler = class {
            constructor(panel, title) {
                this.panel = panel;
                this.title = title;
                this.dragging = false;
                this.offsetX = 0;
                this.offsetY = 0;
                this.init();
            }

            init() {
                this.title.addEventListener('mousedown', (e) => {
                    if (e.button !== 0) return;
                    // Disable transitions while dragging
                    this.panel.style.transition = 'none';
                    this.dragging = true;
                    this.offsetX = e.clientX - this.panel.offsetLeft;
                    this.offsetY = e.clientY - this.panel.offsetTop;
                    e.preventDefault();
                });

                document.addEventListener('mousemove', (e) => {
                    if (!this.dragging) return;
                    const newLeft = e.clientX - this.offsetX;
                    const newTop = e.clientY - this.offsetY;
                    this.panel.style.left = newLeft + 'px';
                    this.panel.style.top = newTop + 'px';
                    this.clampPosition();
                });

                document.addEventListener('mouseup', () => {
                    if (!this.dragging) return;
                    this.dragging = false;
                    // Re-enable transitions
                    this.panel.style.transition = 'width 0.3s ease, height 0.3s ease, top 0.3s ease, left 0.3s ease';
                    const rect = this.panel.getBoundingClientRect();
                    let left = rect.left;
                    let top = rect.top;
                    left = Math.min(Math.max(left, 0), window.innerWidth - rect.width);
                    top = Math.min(Math.max(top, 0), window.innerHeight - rect.height);
                    this.panel.style.left = left + 'px';
                    this.panel.style.top = top + 'px';
                    localStorage.setItem('ntr-panel-position', JSON.stringify({
                        left: this.panel.style.left,
                        top: this.panel.style.top
                    }));
                });
                // Touch events for mobile
                this.title.addEventListener('touchstart', (e) => {
                    // Disable transitions while dragging
                    this.panel.style.transition = 'none';
                    this.dragging = true;
                    const touch = e.touches[0];
                    this.offsetX = touch.clientX - this.panel.offsetLeft;
                    this.offsetY = touch.clientY - this.panel.offsetTop;
                    e.preventDefault();
                }, { passive: false });

                document.addEventListener('touchmove', (e) => {
                    if (!this.dragging) return;
                    const touch = e.touches[0];
                    const newLeft = touch.clientX - this.offsetX;
                    const newTop = touch.clientY - this.offsetY;
                    this.panel.style.left = newLeft + 'px';
                    this.panel.style.top = newTop + 'px';
                    this.clampPosition();
                    e.preventDefault();
                }, { passive: false });

                document.addEventListener('touchend', (e) => {
                    if (!this.dragging) return;
                    this.dragging = false;
                    // Re-enable transitions
                    this.panel.style.transition = 'width 0.3s ease, height 0.3s ease, top 0.3s ease, left 0.3s ease';
                    const rect = this.panel.getBoundingClientRect();
                    let left = rect.left;
                    let top = rect.top;
                    left = Math.min(Math.max(left, 0), window.innerWidth - rect.width);
                    top = Math.min(Math.max(top, 0), window.innerHeight - rect.height);
                    this.panel.style.left = left + 'px';
                    this.panel.style.top = top + 'px';
                    localStorage.setItem('ntr-panel-position', JSON.stringify({
                        left: this.panel.style.left,
                        top: this.panel.style.top
                    }));
                }, { passive: false });
            }

            clampPosition() {
                const rect = this.panel.getBoundingClientRect();
                let left = parseFloat(this.panel.style.left) || 0;
                let top = parseFloat(this.panel.style.top) || 0;
                const maxLeft = window.innerWidth - rect.width;
                const maxTop = window.innerHeight - rect.height;
                if (left < 0) left = 0;
                if (top < 0) top = 0;
                if (left > maxLeft) left = maxLeft;
                if (top > maxTop) top = maxTop;
                this.panel.style.left = left + 'px';
                this.panel.style.top = top + 'px';
            }
        }

        initToken() {
            const auth = localStorage.getItem('auth');
            if (auth) {
                const parsedInfo = JSON.parse(auth);
                return parsedInfo.profile.token;
            }
            return null;
        }

        loadConfiguration() {
            let stored;
            try {
                stored = JSON.parse(localStorage.getItem(CONFIG_STORAGE_KEY));
            } catch (e) { }
            if (!stored || stored.version !== CONFIG_VERSION) {
                const fresh = NTRToolBox.cloneDefaultModules();
                return { version: CONFIG_VERSION, modules: fresh };
            }
            const loaded = NTRToolBox.cloneDefaultModules();
            stored.modules.forEach(storedMod => {
                const defMod = loaded.find(m => m.name === storedMod.name);
                if (defMod) {
                    for (const k in storedMod) {
                        if (
                            defMod.hasOwnProperty(k) &&
                            typeof defMod[k] === typeof storedMod[k] &&
                            storedMod[k] !== undefined
                        ) {
                            defMod[k] = storedMod[k];
                        }
                    }
                }
            });
            if (loaded.length !== defaultModules.length) {
                const fresh = NTRToolBox.cloneDefaultModules();
                localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify({ version: CONFIG_VERSION, modules: fresh }));
                return { version: CONFIG_VERSION, modules: fresh };
            } else {
                const defNames = defaultModules.map(x => x.name).sort().join(',');
                const storedNames = loaded.map(x => x.name).sort().join(',');
                if (defNames !== storedNames) {
                    const fresh = NTRToolBox.cloneDefaultModules();
                    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify({ version: CONFIG_VERSION, modules: fresh }));
                    return { version: CONFIG_VERSION, modules: fresh };
                }
            }
            // Reattach run
            loaded.forEach(m => {
                const found = defaultModules.find(d => d.name === m.name);
                if (found && typeof found.run === 'function') {
                    for (const p in found) {
                        if (!m.hasOwnProperty(p)) {
                            m[p] = found[p];
                        }
                    }
                    m.run = found.run;
                }
            });
            return { version: CONFIG_VERSION, modules: loaded };
        }

        saveConfiguration() {
            localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(this.configuration));
        }

        buildGUI() {
            this.panel = document.createElement('div');
            this.panel.id = 'ntr-panel';

            // restore from localStorage
            const savedPos = localStorage.getItem('ntr-panel-position');
            if (savedPos) {
                try {
                    const parsed = JSON.parse(savedPos);
                    if (parsed.left && parsed.top) {
                        this.panel.style.left = parsed.left;
                        this.panel.style.top = parsed.top;
                    }
                } catch (e) { }
            }

            this.isMinimized = false;
            this.titleBar = document.createElement('div');
            this.titleBar.className = 'ntr-titlebar';
            this.titleBar.innerHTML = 'NTR ToolBox ' + VERSION;

            this.toggleSpan = document.createElement('span');
            this.toggleSpan.style.float = 'right';
            this.toggleSpan.textContent = '[-]';
            this.titleBar.appendChild(this.toggleSpan);

            this.panel.appendChild(this.titleBar);

            this.panelBody = document.createElement('div');
            this.panelBody.className = 'ntr-panel-body';
            this.panel.appendChild(this.panelBody);

            this.infoBar = document.createElement('div');
            this.infoBar.className = 'ntr-info';
            const leftInfo = document.createElement('span');
            const rightInfo = document.createElement('span');
            leftInfo.textContent = IS_MOBILE
                ? '單擊執行 | ⚙️設定'
                : '左鍵執行/切換 | 右鍵設定';
            rightInfo.textContent = 'Author: TheNano(百合仙人)';
            this.infoBar.appendChild(leftInfo);
            this.infoBar.appendChild(rightInfo);
            this.panel.appendChild(this.infoBar);

            document.body.appendChild(this.panel);

            // set up drag
            this.dragHandler = new NTRToolBox.DragHandler(this.panel, this.titleBar);

            this.buildModules();

            setTimeout(() => {
                this.expandedWidth = this.panel.offsetWidth;
                this.expandedHeight = this.panel.offsetHeight;

                const wasMin = this.isMinimized;
                if (!wasMin) this.panel.classList.add('minimized');
                const h0 = this.panel.offsetHeight;
                if (!wasMin) this.panel.classList.remove('minimized');

                this.minimizedWidth = this.panel.offsetWidth;
                this.minimizedHeight = h0;
            }, 150);

            if (IS_MOBILE) {
                // On mobile, single tap toggles minimized state.
                this.titleBar.addEventListener('click', e => {
                    if (!this.dragHandler.dragging) {
                        e.preventDefault();
                        this.setMinimizedState(!this.isMinimized);
                    }
                });
            } else {
                this.titleBar.addEventListener('contextmenu', e => {
                    e.preventDefault();
                    this.setMinimizedState(!this.isMinimized);
                });
            }
        }

        buildModules() {
            this.panelBody.innerHTML = '';
            this.headerMap.clear();

            this.configuration.modules.forEach(mod => {
                const container = document.createElement('div');
                container.className = 'ntr-module-container';

                const header = document.createElement('div');
                header.className = 'ntr-module-header';

                const nameSpan = document.createElement('span');
                nameSpan.textContent = mod.name;
                header.appendChild(nameSpan);

                if (!IS_MOBILE) {
                    const iconSpan = document.createElement('span');
                    iconSpan.textContent = (mod.type === 'keep') ? '⇋' : '▶';
                    iconSpan.style.marginLeft = '8px';
                    header.appendChild(iconSpan);
                }

                const settingsDiv = document.createElement('div');
                settingsDiv.className = 'ntr-settings-container';
                settingsDiv.style.display = 'none';

                if (IS_MOBILE) {
                    const btn = document.createElement('button');
                    btn.textContent = '⚙️';
                    btn.style.color = 'white';
                    btn.style.float = 'right';
                    btn.onclick = e => {
                        e.stopPropagation();
                        const styleVal = window.getComputedStyle(settingsDiv).display;
                        settingsDiv.style.display = (styleVal === 'none' ? 'block' : 'none');
                    };
                    header.appendChild(btn);

                    header.onclick = e => {
                        if (e.target.classList.contains('ntr-bind-button') || e.target === btn) return;
                        this.handleModuleClick(mod, header);
                    };
                } else {
                    header.oncontextmenu = e => {
                        e.preventDefault();
                        const styleVal = window.getComputedStyle(settingsDiv).display;
                        settingsDiv.style.display = (styleVal === 'none' ? 'block' : 'none');
                    };
                    header.onclick = e => {
                        if (e.button === 0 && !e.ctrlKey && !e.altKey && !e.shiftKey) {
                            if (e.target.classList.contains('ntr-bind-button')) return;
                            this.handleModuleClick(mod, header);
                        }
                    };
                }
                if (Array.isArray(mod.settings)) {
                    mod.settings.forEach(s => {
                        const row = document.createElement('div');
                        row.style.marginBottom = '8px';

                        const label = document.createElement('label');
                        label.style.display = 'inline-block';
                        label.style.minWidth = '70px';
                        label.style.color = '#ccc';
                        label.textContent = s.name + ': ';
                        row.appendChild(label);

                        let inputEl;
                        switch (s.type) {
                            case 'boolean': {
                                inputEl = document.createElement('input');
                                inputEl.type = 'checkbox';
                                inputEl.checked = !!s.value;
                                inputEl.onchange = () => {
                                    s.value = inputEl.checked;
                                    this.saveConfiguration();
                                };
                                break;
                            }
                            case 'number': {
                                inputEl = document.createElement('input');
                                inputEl.type = 'number';
                                inputEl.value = s.value;
                                inputEl.className = 'ntr-number-input';
                                inputEl.onchange = () => {
                                    s.value = Number(inputEl.value) || 0;
                                    this.saveConfiguration();
                                };
                                break;
                            }
                            case 'select': {
                                inputEl = document.createElement('select');
                                if (Array.isArray(s.options)) {
                                    s.options.forEach(opt => {
                                        const optEl = document.createElement('option');
                                        optEl.value = opt;
                                        optEl.textContent = opt;
                                        if (opt === s.value) optEl.selected = true;
                                        inputEl.appendChild(optEl);
                                    });
                                }
                                inputEl.onchange = () => {
                                    s.value = inputEl.value;
                                    this.saveConfiguration();
                                };
                                break;
                            }
                            case 'string': {
                                if (s.name === 'bind') {
                                    inputEl = document.createElement('button');
                                    inputEl.className = 'ntr-bind-button';
                                    inputEl.textContent = (s.value === 'none') ? '(None)' : `[${s.value.toUpperCase()}]`;
                                    inputEl.onclick = () => {
                                        inputEl.textContent = '(Press any key)';
                                        const handler = ev => {
                                            ev.preventDefault();
                                            if (ev.key === 'Escape') {
                                                s.value = 'none';
                                                inputEl.textContent = '(None)';
                                            } else {
                                                s.value = ev.key.toLowerCase();
                                                inputEl.textContent = `[${ev.key.toUpperCase()}]`;
                                            }
                                            this.saveConfiguration();
                                            document.removeEventListener('keydown', handler, true);
                                            ev.stopPropagation();
                                        };
                                        document.addEventListener('keydown', handler, true);
                                    };
                                } else {
                                    inputEl = document.createElement('input');
                                    inputEl.type = 'text';
                                    inputEl.value = s.value;
                                    inputEl.className = 'ntr-input';
                                    inputEl.onchange = () => {
                                        s.value = inputEl.value;
                                        this.saveConfiguration();
                                    };
                                }
                                break;
                            }
                            default: {
                                inputEl = document.createElement('span');
                                inputEl.style.color = '#999';
                                inputEl.textContent = String(s.value);
                            }
                        }
                        row.appendChild(inputEl);
                        settingsDiv.appendChild(row);
                    });
                }

                container.appendChild(header);
                container.appendChild(settingsDiv);

                this.panelBody.appendChild(container);
                this.headerMap.set(mod, header);
            });
        }

        attachGlobalKeyBindings() {
            document.addEventListener('keydown', e => {
                if (e.ctrlKey || e.altKey || e.metaKey) return;
                const pk = e.key.toLowerCase();
                this.configuration.modules.forEach(mod => {
                    const bind = mod.settings.find(s => s.name === 'bind');
                    if (!bind || bind.value === 'none') return;
                    if (bind.value.toLowerCase() === pk) {
                        if (!isModuleEnabledByWhitelist(mod)) return;
                        e.preventDefault();
                        this.handleModuleClick(mod, null);
                    }
                });
            });
        }

        handleModuleClick(mod, header) {
            if (!domainAllowed || !isModuleEnabledByWhitelist(mod)) return;
            try {
                if (mod.type === 'onclick') {
                    if (typeof mod.run === 'function') {
                        Promise.resolve(mod.run(mod)).catch(console.error);
                    }
                } else if (mod.type === 'keep') {
                    const active = this.keepActiveSet.has(mod.name);
                    if (active) {
                        if (header) this.stopKeepModule(mod, header);
                    } else {
                        if (header) this.startKeepModule(mod, header);
                    }
                }
            } catch (err) {
                console.error('Error running module:', mod.name, err);
            }
        }

        startKeepModule(mod, header) {
            if (this.keepActiveSet.has(mod.name)) return;
            header.classList.add('active');
            this.keepActiveSet.add(mod.name);
            this.updateKeepStateStorage();
        }

        stopKeepModule(mod, header) {
            header.classList.remove('active');
            this.keepActiveSet.delete(mod.name);
            this.updateKeepStateStorage();
        }

        updateKeepStateStorage() {
            const st = {};
            this.keepActiveSet.forEach(n => {
                st[n] = true;
            });
            localStorage.setItem('NTR_KeepState', JSON.stringify(st));
        }

        loadKeepStateAndStart() {
            let saved = {};
            try {
                saved = JSON.parse(localStorage.getItem('NTR_KeepState') || '{}');
            } catch (e) { }
            this.configuration.modules.forEach(mod => {
                if (mod.type === 'keep' && saved[mod.name]) {
                    const hdr = this.headerMap.get(mod);
                    if (hdr) {
                        this.startKeepModule(mod, hdr);
                    }
                }
            });
        }

        scheduleNextPoll() {
            const now = Date.now();
            if (now - this._lastKeepRun >= 100) {
                this.pollKeepModules();
                this._lastKeepRun = now;
            }
            if (now - this._lastVisRun >= 250) {
                this.updateModuleVisibility();
                if (this._lastEndPoint != window.location.href) {
                    StorageUtils.update();
                    this._lastEndPoint = window.location.href;
                }
                this._lastVisRun = now;
            }
            this._pollTimer = setTimeout(() => {
                this.scheduleNextPoll();
            }, 10);
        }

        pollKeepModules() {
            this.configuration.modules.forEach(mod => {
                if (mod.type === 'keep' && this.keepActiveSet.has(mod.name) && typeof mod.run === 'function') {
                    mod.run(mod);
                }
            });
        }

        runModule(name) {
            this.configuration.modules.filter(mod => mod.name == name).forEach(mod => {
                if (typeof mod.run === 'function') {
                    mod.run(mod, true);
                }
            });
        }

        updateModuleVisibility() {
            this.configuration.modules.forEach(mod => {
                const hdr = this.headerMap.get(mod);
                if (!hdr) return;
                const cont = hdr.parentElement;
                const allowed = domainAllowed && isModuleEnabledByWhitelist(mod) && !mod.hidden;
                if (!allowed) {
                    cont.style.display = 'none';
                    if (mod.type === 'keep' && this.keepActiveSet.has(mod.name)) {
                        this.stopKeepModule(mod, hdr);
                    }
                } else {
                    cont.style.display = 'block';
                }
            });
        }

        getAnchorCornerInfo(rect) {
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const horizontal = (centerX < window.innerWidth / 2) ? 'left' : 'right';
            const vertical = (centerY < window.innerHeight / 2) ? 'top' : 'bottom';
            return {
                corner: vertical + '-' + horizontal,
                x: (horizontal === 'left' ? rect.left : rect.right),
                y: (vertical === 'top' ? rect.top : rect.bottom)
            };
        }

        setMinimizedState(newVal) {
            if (this.isMinimized === newVal) return;
            const rect = this.panel.getBoundingClientRect();
            const anchor = this.getAnchorCornerInfo(rect);

            this.isMinimized = newVal;
            if (this.isMinimized) {
                this.panel.classList.add('minimized');
                this.toggleSpan.textContent = '[+]';
                this.panelBody.style.display = 'none';
                this.infoBar.style.display = 'none';
            } else {
                this.panel.classList.remove('minimized');
                this.toggleSpan.textContent = '[-]';
                this.panelBody.style.display = 'block';
                this.infoBar.style.display = 'flex';
            }

            setTimeout(() => {
                const newRect = this.panel.getBoundingClientRect();
                let left, top;
                switch (anchor.corner) {
                    case 'top-left':
                        left = anchor.x;
                        top = anchor.y;
                        break;
                    case 'top-right':
                        left = anchor.x - newRect.width;
                        top = anchor.y;
                        break;
                    case 'bottom-left':
                        left = anchor.x;
                        top = anchor.y - newRect.height;
                        break;
                    case 'bottom-right':
                        left = anchor.x - newRect.width;
                        top = anchor.y - newRect.height;
                        break;
                    default:
                        left = parseFloat(this.panel.style.left) || newRect.left;
                        top = parseFloat(this.panel.style.top) || newRect.top;
                }
                left = Math.min(Math.max(left, 0), window.innerWidth - newRect.width);
                top = Math.min(Math.max(top, 0), window.innerHeight - newRect.height);
                this.panel.style.left = left + 'px';
                this.panel.style.top = top + 'px';
                localStorage.setItem('ntr-panel-position', JSON.stringify({
                    left: this.panel.style.left,
                    top: this.panel.style.top
                }));
            }, 310);
        }

        async fetch(url, bypass = true) {
            if (bypass && this.token) {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${this.token}`
                    }
                });
                return response;
            } else {
                return await fetch(url);
            }
        }

        delay(ms) {
            return new Promise(r => setTimeout(r, ms));
        }
    }

    const css = document.createElement('style');
    css.textContent = `
    #ntr-panel {
        position: fixed;
        left: 20px;
        top: 70px;
        z-index: 9999;
        background: #1E1E1E;
        color: #BBB;
        padding: 8px;
        border-radius: 8px;
        font-family: Arial, sans-serif;
        width: 320px;
        box-shadow: 2px 2px 12px rgba(0,0,0,0.5);
        border: 1px solid #333;
        transition: width 0.3s ease, height 0.3s ease, top 0.3s ease, left 0.3s ease;
    }
    #ntr-panel.minimized {
        width: 200px;
    }
    .ntr-titlebar {
        font-weight: bold;
        padding: 10px;
        cursor: move;
        background: #292929;
        border-radius: 6px;
        color: #CCC;
        user-select: none;
    }
    .ntr-panel-body {
        padding: 6px;
        background: #232323;
        border-radius: 4px;
        overflow-y: auto;
        max-height: 80vh;
        transition: max-height 0.3s ease;
    }
    #ntr-panel.minimized .ntr-panel-body {
        max-height: 0;
    }
    .ntr-module-container {
        margin-bottom: 12px;
        border: 1px solid #444;
        border-radius: 4px;
    }
    .ntr-module-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #2E2E2E;
        padding: 6px 8px;
        border-radius: 3px 3px 0 0;
        border-bottom: 1px solid #333;
        cursor: pointer;
        transition: background 0.3s;
    }
    .ntr-module-header:hover {
        background: #3a3a3a;
    }
    .ntr-settings-container {
        padding: 6px;
        background: #1C1C1C;
        display: none;
    }
    .ntr-input {
        width: 120px;
        padding: 4px;
        border: 1px solid #555;
        border-radius: 4px;
        background: #2A2A2A;
        color: #FFF;
    }
    .ntr-number-input {
        width: 60px;
        padding: 4px;
        border: 1px solid #555;
        border-radius: 4px;
        background: #2A2A2A;
        color: #FFF;
    }
    .ntr-bind-button {
        padding: 4px 8px;
        border: 1px solid #555;
        border-radius: 4px;
        background: #2A2A2A;
        color: #FFF;
        cursor: pointer;
    }
    .ntr-info {
        display: flex;
        justify-content: space-between;
        font-size: 10px;
        color: #888;
        margin-top: 8px;
    }
    .ntr-module-header.active {
        background: #63E2B7 !important;
        color: #fff !important;
    }
    .ntr-notification-container {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 9999;
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }
    .ntr-notification-message {
        display: flex;
        align-items: center;
        min-width: 200px;
        margin-top: 8px;
        padding: 4px 8px;
        border-radius: 4px;
        background-color: #2A2A2A;
        color: #fff;
        font-size: 14px;
        font-family: sans-serif;
        opacity: 1;
        transition: opacity 0.3s ease;
    }
    .ntr-notification-message .ntr-icon {
        margin-right: 4px;
        font-size: 16px;
    }
    .ntr-notification-message.fade-out {
        opacity: 0;
    }
    @media only screen and (max-width:600px) {
        #ntr-panel {
            transform: scale(0.6);
            transform-origin: top left;
        }
    }
    `;
    document.head.appendChild(css);

    // -----------------------------------
    // Init Script
    // -----------------------------------
    const script = new NTRToolBox();
})();