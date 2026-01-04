// ==UserScript==
// @name         咕咕镇PK助手
// @license      MIT License
// @namespace    https://greasyfork.org/zh-CN/users/915763-zyxboy
// @version      2.7.9
// @description  咕咕镇插件：PK助手
// @author       zyxboy
// @match        https://www.guguzhen.com/fyg_pk.php
// @match        https://www.momozhen.com/*
// @connect      www.guguzhen.com
// @connect      www.momozhen.com
// @grant        GM_info
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/467212/%E5%92%95%E5%92%95%E9%95%87PK%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/467212/%E5%92%95%E5%92%95%E9%95%87PK%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
/* eslint-env jquery */
/* jshint esversion:12 */
(async function() {
    'use strict'

    const g_isInSandBox = true;
    const g_version = GM_info.script.version + (g_isInSandBox ? '' : ' (RP)');
    const g_modiTime = '2025-10-19 00:15:00';

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // data Xport
    //
    ////////////////////////////////////////////////////////////////////////////////////////////////////

    function importData(kfUser, json, config, logs) {
        return new Promise( async (resolve) => {
            let data = JSON.parse(json);
            if (config) {
                if (data.config != null) {
                    localStorage.setItem(kfUser + '_pkAssist_Config', JSON.stringify(data.config));
                }
                else {
                    alert('导入信息中不包含配置数据，请检查。');
                    resolve(false);
                    return;
                }
            }

            if (!logs) {
                resolve(config);
                return;
            }
            else if (data.stores == null) {
                alert('导入信息中不包含日志数据，请检查。');
                resolve(false);
                return;
            }

            let dbName = kfUser + '_pkAssistDB';
            let dbExists = false;
            for (let db of await window.indexedDB.databases()) {
                if (db.name == dbName) {
                    dbExists = true;
                    break;
                }
            }
            if (!dbExists) {
                resolve(false);
                return;
            }

            let pkDB = null;
            let res = await new Promise((resolve) => {
                let req = window.indexedDB.deleteDatabase(dbName);
                req.onerror = (e) => {
                    alert('清空助手数据库失败。');
                    console.log('pk助手：数据库错误 => ', e.target.error);
                    resolve(false);
                };
                req.onsuccess = (async (e) => {
                    req = window.indexedDB.open(kfUser + '_pkAssistDB');
                    req.onerror = req.onblocked = ((e) => {
                        alert('创建或打开助手数据库失败。');
                        console.log('pk助手：数据库错误 => ', e.target.error);
                        resolve(false);
                    });
                    req.onsuccess = ((e) => {
                        pkDB = e.target.result;
                        resolve(true);
                    });
                    req.onupgradeneeded = ((e) => {
                        let db = e.target.result;
                        for (let name in (data.stores ?? {})) {
                            let store = db.createObjectStore(name, { keyPath : data.stores[name].keyPath });
                            for (let index of data.stores[name].indices) {
                                store.createIndex(index.name, index.keyPath,
                                                  { unique : index.unique, multiEntry : index.multiEntry });
                            }
                            for (let record of data.stores[name].records) {
                                store.add(record);
                            }
                        }
                    });
                });
            });
            if (pkDB != null) {
                pkDB.close();
            }
            resolve(res);
        });
    }

    function exportData(kfUser, config, logs) {
        return new Promise(async (resolve) => {
            let data =
                {
                    config : config ? JSON.parse(localStorage.getItem(kfUser + '_pkAssist_Config')) : null,
                    stores : logs ? {} : null
                };

            if (!logs) {
                resolve(config ? JSON.stringify(data) : '');
                return;
            }

            let dbName = kfUser + '_pkAssistDB';
            let dbExists = false;
            for (let db of await window.indexedDB.databases()) {
                if (db.name == dbName) {
                    dbExists = true;
                    break;
                }
            }
            if (!dbExists) {
                resolve('');
                return;
            }

            let pkDB = null;
            let res = await new Promise((resolve) => {
                let dbName = kfUser + '_pkAssistDB';
                let req = window.indexedDB.open(dbName);
                req.onerror = req.onblocked = ((e) => {
                    alert('创建或打开助手数据库失败。');
                    console.log('pk助手：数据库错误 => ', e.target.error);
                    resolve(false);
                });
                req.onsuccess = ((e) => {
                    pkDB = e.target.result;
                    resolve(true);
                });
            });
            if (res) {
                res = await new Promise(async (resolve) => {
                    let r = true;
                    let trans = pkDB.transaction(pkDB.objectStoreNames, 'readonly');
                    for (let name of trans.objectStoreNames) {
                        r = await new Promise((resolve) => {
                            let store = trans.objectStore(name);
                            let req = store.getAll();
                            req.onerror = ((e) => {
                                alert('打开助手数据失败。');
                                console.log('pk助手：打开数据错误 => ', e.target.error);
                                resolve(false);
                            });
                            req.onsuccess = ((e) => {
                                data.stores[name] = {};
                                data.stores[name].keyPath = store.keyPath;
                                data.stores[name].indices = [];
                                for (let ni of store.indexNames) {
                                    let index = store.index(ni);
                                    data.stores[name].indices.push(
                                        {
                                            name : ni,
                                            keyPath : index.keyPath,
                                            unique : index.unique,
                                            multiEntry : index.multiEntry
                                        });
                                }
                                data.stores[name].records = e.target.result;
                                resolve(true);
                            });
                        });
                        if (!r) {
                            break;
                        }
                    }
                    resolve(r);
                });
                pkDB.close();
            }
            resolve(res ? JSON.stringify(data) : '');
        });
    }

    if (window.location.hostname.indexOf('momozhen') >= 0 && window.location.pathname.indexOf('lander') >= 0) {
        let div = document.createElement('div');
        div.innerHTML =
            '<div style="color:white;background-color:black;font-size:1.2em;padding:15px;"><b>用户名</b>' +
                '<input type="text" id="pk-assist-momozhen-kf-user" style="margin-left:10px;" />' +
                '<button id="pk-assist-momozhen-do-export" style="margin-left:15px;">导出助手数据</button></div>';
        div.querySelector('#pk-assist-momozhen-do-export').onclick = (async (e) => {
            let kfUser = document.getElementById('pk-assist-momozhen-kf-user').value;
            let json = await exportData(kfUser, true, true);
            if (json?.length > 0) {
                let a = document.createElement("a");
                a.href = URL.createObjectURL(new Blob([json], { type: "application/json" }));
                a.download = kfUser + '_save_pkAssist_data.json';
                a.click();
            }
            else {
                alert('未导出任何数据。');
            }
        });

        document.body.appendChild(div);
        return;
    }
    else if (!window.location.pathname.startsWith('/fyg_pk.php')) {
        return;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // end of data Xport
    //
    ////////////////////////////////////////////////////////////////////////////////////////////////////

    String.format = ((format, ...args) => format?.replace(/\{(\d+)\}/g, (_, m) => args[parseInt(m)]));

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // common utilities
    //
    ////////////////////////////////////////////////////////////////////////////////////////////////////

    const g_navigatorSelector = 'body > div > div.row > div.panel > div.panel-body > div';
    const g_kfUser = document.querySelector(g_navigatorSelector + ' > button.btn.btn-lg')?.innerText;
    if (!(g_kfUser?.length > 0)) {
        console.log(`PK助手(${g_version}): 咕咕镇版本不匹配或正在测试`);
        return;
    }
    console.log(`PK助手(${g_version}): ${g_kfUser}`);

    const g_exportInterfaceId = 'gugu-assistant-interface-export';
    let g_assistantInterface = null;

    function getAssistantInterfaceAsync() {
        return new Promise((resolve) => {
            if (g_assistantInterface == null) {
                let timeout = Date.now() + 5000;
                let timer = setInterval(() => {
                    if ((g_assistantInterface = document.getElementById(g_exportInterfaceId)?.assistantInterface) != null) {
                        clearInterval(timer);
                        resolve(true);
                    }
                    else if (timeout - Date.now() < 0) {
                        clearInterval(timer);
                        resolve(false);
                    }
                }, 200);
            }
            else {
                resolve(true);
            }
        });
    }
    if (!(await getAssistantInterfaceAsync())) {
        console.log('PK助手: 获取插件接口超时');
        return;
    }

    const TIMESTAMP = g_assistantInterface.timestamp;
    const AJAX = g_assistantInterface.httpRequest;
    const POPUP = g_assistantInterface.genericPopup;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // add-ins
    //
    ////////////////////////////////////////////////////////////////////////////////////////////////////

    const g_configStorageKey = g_kfUser + '_pkAssist_Config';
    const g_defaultAutoRefreshPeriod = '00:00=300';
    const g_defaultRecordLiveDuration = 10;
    function loadAddinsConfigData() {
        return JSON.parse(localStorage.getItem(g_configStorageKey));
    }
    function saveAddinsConfigData(json) {
        localStorage.setItem(g_configStorageKey, JSON.stringify(json));
    }

    let g_config = null;
    function readConfig() {
        let save = 0;
        g_config = loadAddinsConfigData();
        if (g_config == null) {
            g_config = {
                showRecordPanel : true,
                refreshPeriod : g_defaultAutoRefreshPeriod,
                recordLiveDuration : g_defaultRecordLiveDuration,
                scheduleEnabled : false,
                scheduleList : [],
                scheduling : { date : null, state : '' , tasks : [] }
            };
            save++;
        }
        if (g_config.showRecordPanel == null) {
            g_config.showRecordPanel = true;
            save++;
        }
        parseAutoRefreshPeriod(g_config.refreshPeriod)
        if(isNaN(g_config.recordLiveDuration) || g_config.recordLiveDuration < 0) {
            g_config.recordLiveDuration = 0;
            save++;
        }
        if (g_config.scheduleEnabled == null) {
            g_config.scheduleEnabled = false;
            save++;
        }
        if (g_config.scheduleList == null) {
            g_config.scheduleList = [];
            save++;
        }
        if (save > 0) {
            saveConfig();
        }
        g_taskState = (g_config.scheduling?.state ?? '');
    }
    function saveConfig() {
        saveAddinsConfigData(g_config);
    }

    const g_tasks = [
        {
            index : -1,
            name : 'switchSolution',
            alias : '方案切换',
            activity : (task) => {
                return true;
            },
            validate : (task) => {
                if (task.completionSolution != '默认') {
                    task.taskSolution = '默认';
                }
                else if (task.taskSolution == '默认') {
                    return null;
                }
                task.param = '';
                return task;
            }
        },
        {
            index : -1,
            name : 'PVP',
            alias : '攻击玩家',
            parameterTips : '出击次数[,中断条件]',
            activity : (task) => {
                g_battleResult = '平';
                g_rushBroke = false;
                if ((task.originalAttackCount = g_pkAtkCount) >= g_maxAtkCount) {
                    addLog('出击次数已达上限', 'red');
                }
                else {
                    if (task.breakCondition == null) {
                        let params = task.param.trim().match(/^(\d+)(,?)(.*)$/);
                        if (params?.length == 4) {
                            task.attackCount = parseInt(params[1]);
                            if (task.attackCount <= 0) {
                                task.attackCount = 1;
                            }
                            let cond = params[3].trim();
                            if (params[2].trim() != ',' || cond.length == 0) {
                                task.breakCondition = 'false';
                            }
                            else {
                                task.breakCondition = cond;
                            }
                        }
                        else {
                            task.attackCount = 1;
                            task.breakCondition = 'false';
                        }
                    }
                    if (task.attackCount > 0) {
                        jgjg(2);
                        return false;
                    }
                }
                return true;
            },
            checkCompletion : (task) => {
                g_battleResult = (task.originalAttackCount == g_pkAtkCount ? '平' : (g_pkWinCount > 0 ? '胜' : '负'));
                g_rushBroke = evaluateCondition(task.breakCondition);
                return (g_rushBroke || (g_battleResult != '平' && --task.attackCount <= 0) ||
                        g_pkAtkCount >= g_maxAtkCount || task.deadline <= Date.now());
            },
            validate : (task) => {
                let params = task.param.trim().match(/^(\d+)(,?)(.*)$/);
                if (params?.length == 4) {
                    let count = parseInt(params[1]);
                    if (count <= 0) {
                        count = 1;
                    }
                    if (params[2].trim() != ',' || params[3].trim().length == 0) {
                        task.param = count.toString();
                    }
                }
                else {
                    task.param = '1';
                }
                return task;
            }
        },
        {
            index : -1,
            name : 'PVE',
            alias : '攻击野怪',
            parameterTips : '出击次数[,中断条件]',
            activity : (task) => {
                g_battleResult = '平';
                g_rushBroke = false;
                if ((task.originalAttackCount = g_pkAtkCount) >= g_maxAtkCount) {
                    addLog('出击次数已达上限', 'red');
                }
                else {
                    if (task.breakCondition == null) {
                        let params = task.param.trim().match(/^(\d+)(,?)(.*)$/);
                        if (params?.length == 4) {
                            task.attackCount = parseInt(params[1]);
                            if (task.attackCount <= 0) {
                                task.attackCount = 1;
                            }
                            let cond = params[3].trim();
                            if (params[2].trim() != ',' || cond.length == 0) {
                                task.breakCondition = 'false';
                            }
                            else {
                                task.breakCondition = cond;
                            }
                        }
                        else {
                            task.attackCount = 1;
                            task.breakCondition = 'false';
                        }
                    }
                    if (task.attackCount > 0) {
                        jgjg(1);
                        return false;
                    }
                }
                return true;
            },
            checkCompletion : (task) => {
                g_battleResult = (task.originalAttackCount == g_pkAtkCount ? '平' : (g_pkWinCount > 0 ? '胜' : '负'));
                g_rushBroke = evaluateCondition(task.breakCondition);
                return (g_rushBroke || (g_battleResult != '平' && --task.attackCount <= 0) ||
                        g_pkAtkCount >= g_maxAtkCount || task.deadline <= Date.now());
            },
            validate : (task) => {
                let params = task.param.trim().match(/^(\d+)(,?)(.*)$/);
                if (params?.length == 4) {
                    let count = parseInt(params[1]);
                    if (count <= 0) {
                        count = 1;
                    }
                    if (params[2].trim() != ',' || params[3].trim().length == 0) {
                        task.param = count.toString();
                    }
                }
                else {
                    task.param = '1';
                }
                return task;
            }
        },
        {
            index : -1,
            name : 'openGifts',
            alias : '翻牌奖励',
            parameterTips : '翻牌设置（默认使用一键翻牌设置，格式相同）',
            activity : (task) => {
                if (task.gift == undefined) {
                    task.gift = '无';
                    g_assistantInterface.gift.open(
                        task.param,
                        (gift) => {
                            g_gift = (gift ?? '无');
                            executeTask(task, true);
                        });
                }
                return false;
            },
            checkCompletion : (task) => {
                return (task.deadline <= Date.now());
            },
            validate : (task) => {
                task.param = task.param.replaceAll(/[ \+]/g, '');
                return task;
            }
        },
        {
            index : -1,
            name : 'readGifts',
            alias : '获取奖励结果',
            activity : (task) => {
                if (task.giftInfo == undefined) {
                    task.giftInfo = {};
                    g_assistantInterface.readInfo.gift(
                        task.giftInfo,
                        true,
                        () => {
                            g_gift = (task.giftInfo?.gift ?? '无');
                            executeTask(task, true);
                        });
                }
                return false;
            },
            checkCompletion : (task) => {
                return (task.deadline <= Date.now());
            },
            validate : (task) => {
                task.param = '';
                return task;
            }
        },
        {
            index : -1,
            name : 'useRecoverDrug',
            alias : '恢复体力',
            activity : (task) => {
                if (task.completed == undefined) {
                    task.completed = false;
                    POPUP.initialize();
                    POPUP.showProgressMessage('嗑药中，请稍候...');
                    useRecoverDrug((succeeded) => {
                        task.completed = true;
                        if (!succeeded) {
                            addLog('嗑药失败，体力未恢复，请检查。', 'red');
                        }
                        POPUP.close(true, true);
                        pklog();
                        pklist();
                    });
                }
                return false;
            },
            checkCompletion : (task) => {
                return (task.completed || task.deadline <= Date.now());
            },
            validate : (task) => {
                task.param = '';
                return task;
            }
        },
        {
            index : -1,
            name : 'waitAttackCountReset',
            alias : '等待出击次数重置',
            parameterTips : '轮询周期〈毫秒〉',
            activity : (task) => {
                if (task.refreshPeriod == null && isNaN(task.refreshPeriod = parseInt(task.param))) {
                    task.refreshPeriod = g_attackCountResetPollingPeriod;
                }
                task.timerId = setTimeout(() => {
                    task.timerId = -1;
                    pklist();
                    task.lastExec = Date.now();
                }, Math.max(0, task.refreshPeriod - (Date.now() - (task.lastExec ?? 0))));
                return false;
            },
            checkCompletion : (task) => {
                if (task.timerId >= 0) {
                    clearTimeout(task.timerId);
                }
                return (g_pkAtkCount == 0 || task.deadline <= Date.now());
            },
            validate : (task) => {
                let period = parseInt(task.param);
                if (isNaN(period)) {
                    period = g_attackCountResetPollingPeriod;
                }
                else if (period < 0) {
                    period = 0;
                }
                task.param = period.toString();
                return task;
            }
        },
        {
            index : -1,
            name : 'delayRefresh',
            alias : '延时刷新',
            parameterTips : '延时时长〈毫秒〉',
            activity : (task) => {
                let leftTime = parseInt(task.param) - (Date.now() - task.startTime);
                if (isNaN(leftTime)) {
                    leftTime = g_attackCountResetPollingPeriod;
                }
                task.timerId = setTimeout(() => {
                    task.timerId = -1;
                    pklog();
                    pklist();
                }, Math.max(0, leftTime));
                return false;
            },
            checkCompletion : (task) => {
                if (task.timerId >= 0) {
                    clearTimeout(task.timerId);
                }
                let leftTime = parseInt(task.param) - (Date.now() - task.startTime);
                if (isNaN(leftTime)) {
                    leftTime = g_attackCountResetPollingPeriod;
                }
                return (task.timerId == -1 || leftTime <= 0 || task.deadline <= Date.now());
            },
            validate : (task) => {
                let delay = parseInt(task.param);
                if (isNaN(delay)) {
                    delay = g_attackCountResetPollingPeriod;
                }
                else if (delay < 0) {
                    delay = 0;
                }
                task.param = delay.toString();
                return task;
            }
        },
        {
            index : -1,
            name : 'sendPageMessage',
            alias : '发送页面消息',
            parameterTips : '页面消息数据',
            activity : (task) => {
                g_assistantInterface.pageMessage.addSingle(
                    `${g_logTitle} （任务消息）`,
                    `<b style="color:red;'};">${evaluateSymbolicString(task.param)}</b>`);
                return true;
            },
            validate : (task) => {
                task.taskSolution = task.completionSolution = '默认';
                return task;
            }
        },
        {
            index : -1,
            name : 'setTaskData',
            alias : '设置任务状态数据',
            parameterTips : '任务状态数据',
            activity : (task) => {
                g_config.scheduling.state = g_taskState = evaluateSymbolicString(task.param);
                saveConfig();
                return true;
            },
            validate : (task) => {
                task.taskSolution = task.completionSolution = '默认';
                return task;
            }
        },
        {
            index : -1,
            name : 'pauseScheduler',
            alias : '停止任务调度',
            parameterTips : '任务状态数据',
            activity : (task) => {
                if (task.param.length > 0) {
                    g_config.scheduling.state = g_taskState = evaluateSymbolicString(task.param);
                }
                ctrl_enableSchedule.checked = g_config.scheduleEnabled = false;
                saveConfig();
                return true;
            },
            validate : (task) => {
                task.completionSolution = '默认';
                return task;
            }
        },
        {
            index : -1,
            name : 'logout',
            alias : '退出登录',
            parameterTips : '任务调度状态',
            activity : (task) => {
                if (task.param.length > 0) {
                    ctrl_enableSchedule.checked = g_config.scheduleEnabled = evaluateCondition(task.param);
                    saveConfig();
                }
                POPUP.initialize();
                POPUP.showProgressMessage('退出中，请稍候...');
                AJAX.begin(
                    AJAX.GuGuZhenRequest.login,
                    'm=out',
                    (response) => {
                        executeTask(task, true);
                        POPUP.close(true, true);
                        g_login = false;
                    });
                return false;
            },
            checkCompletion : (task) => {
                return (task.deadline <= Date.now());
            },
            validate : (task) => {
                task.taskSolution = task.completionSolution = '默认';
                return task;
            }
        }
    ];

    let g_login = true;
    let g_battleResult = '平';
    let g_rushBroke = false;
    let g_execCount = 0;
    let g_gift = '无';
    let g_taskState = '';
    const g_conditionSymbols = [
        { symbol : '段位' , alias : 'GR' , variable : 'g_pkGrade' , description : '当前所在段位，需“\'”包围' },
        { symbol : '进度' , alias : 'PR' , variable : 'g_pkProgress' , description : '段位进度，不含“%”' },
        { symbol : '狗牌' , alias : 'MC' , variable : 'g_pkAtkWins' , description : '今日获得狗牌数' },
        { symbol : '出击' , alias : 'RC' , variable : 'g_pkAtkCount' , description : '今日出击次数' },
        { symbol : '连胜' , alias : 'WC' , variable : 'g_pkWinCount' , description : '连胜场次' },
        { symbol : '连败' , alias : 'LC' , variable : 'g_pkLoseCount' , description : '连败场次' },
        { symbol : '战果' , alias : 'BR' , variable : 'g_battleResult' , description : '前次出击战果，胜、平、负，需“\'”包围，刷新重置，每日重置' },
        { symbol : '中断' , alias : 'RB' , variable : 'g_rushBroke' , description : '前一出击任务达到中断条件为真，否则为假，刷新重置，每日重置' },
        { symbol : '执行' , alias : 'EC' , variable : 'g_execCount' , description : '当前任务自动执行持续次数，包括首次执行' },
        { symbol : '中奖' , alias : 'PS' , variable : 'g_pkPrizeState' , description : '满足领取翻牌奖励条件为真，否则为假，无论是否已领取' },
        { symbol : '奖励' , alias : 'PG' , variable : 'g_gift' , description : '翻牌奖励结果，无、幸运、稀有、史诗、传说，需“\'”包围，刷新重置，每日重置' },
        { symbol : '状态' , alias : 'TS' , variable : 'g_taskState' , description : '自定义状态数据，每日重置' }
    ];
    const g_symbolMap = new Map();
    g_conditionSymbols.forEach((item, index) => {
        g_symbolMap.set(item.symbol, item);
        g_symbolMap.set(item.alias, item);
    });
    function formatSymbolicString(str) {
        return str?.replace(/\$\[(.*?)\]/g, (_, m) => { return `$[${g_symbolMap.get(m)?.symbol ?? m}]`; });
    }
    function evaluateSymbolicString(str) {
        if (str?.length > 0) {
            try {
                return eval(str.replace(/\$\[(.*?)\]/g, (_, m) => (g_symbolMap.get(m)?.variable ?? m)));
            }
            catch (e) {
                addLog(`表达式解析：<b>表达式〈${str}〉不合法，发生错误〈${e.toString()}〉。</b>`, 'red');
            }
        }
        return '';
    }
    function evaluateCondition(condition) {
        return (!(condition?.length > 0) || evaluateSymbolicString(condition)?.toString().toLowerCase() == 'true');
    }

    const g_attackCountResetPollingPeriod = 1000;
    const g_taskMap = new Map();
    g_tasks.forEach((item, index) => {
        item.index = index;
        g_taskMap.set(item.name, item);
        g_taskMap.set(item.alias, item);
    });

    function cloneScheduleList(tasks) {
        if (tasks != null) {
            let cloned = [];
            tasks?.forEach((t) => {
                let clone = {};
                for(let field in t) {
                    clone[field] = t[field];
                }
                cloned.push(clone);
            });
            return cloned;
        }
        return null;
    }
    function formatScheduleList(tasks, ignoreEnabledFlag) {
        let tips = [];
        tasks?.forEach((t) => {
            let meta = g_taskMap.get(t.activity);
            tips.push(`${ignoreEnabledFlag ? '' : (t.enabled ? '● ' : '□ ')}${t.time} + ${t.timeout} → ` +
                      `${t.condition?.length > 0 ? `（条件：${t.condition}） → ` : ''}${t.taskSolution} → ` +
                      `${meta?.alias ?? `（${t.activity}）`}${(meta?.parameterTips?.length ?? 0) + (t.param?.length ?? 0) > 0 ?
                      `（${(meta?.parameterTips ?? '未定义') + '=' + (t.param ?? '未定义')}）` : ''} → ${t.completionSolution}`);
        });
        return (tips.length > 0 ? tips.join('\n') : '（空）');
    }
    let g_currentTask = null;
    function getNextTask(peek) {
        if (g_currentTask != null) {
            return g_currentTask;
        }

        let save = 0;
        let timestamp = TIMESTAMP.get();
        if (g_config.scheduling?.date != timestamp.date) {
            g_config.scheduling = {
                date : timestamp.date,
                state : '',
                tasks : cloneScheduleList(g_config.scheduleList)
            };
            g_battleResult = '平';
            g_rushBroke = false;
            g_gift = '无';
            g_taskState = '';
            save++;
        }

        let task = null;
        let tl = g_config.scheduling.tasks.length;
        if (tl > 0) {
            let now = TIMESTAMP.timeToMS(timestamp.time);
            for (let i = 0; i < tl; i++) {
                task = g_config.scheduling.tasks[i];
                let tt = TIMESTAMP.timeToMS(task.time);
                if (now > tt + (task.timeout * 1000)) {
                    g_config.scheduling.tasks.splice(i, 1);
                    i--;
                    tl--;
                    task = null;
                    save++;
                }
                else if (task.enabled) {
                    if (now < tt) {
                        task.interval = tt - now;
                    }
                    else {
                        if (!peek) {
                            g_config.scheduling.tasks.splice(i, 1);
                            save++;
                        }
                        task.interval = 0;
                    }
                    break;
                }
                task = null;
            }
        }
        if (save > 0) {
            ctrl_dailySchedule.title = formatScheduleList(g_config.scheduling.tasks);
            saveConfig();
        }
        return task;
    }
    function confirmNextTask() {
        let task = getNextTask(true);
        if (task?.interval <= g_taskTolerance && g_config.scheduleEnabled && ctrl_enableSchedule.checked &&
            !confirm(`下一个任务：\n\n    ${formatScheduleList([task], true)}\n\n` +
                     `将于大约 ${Math.trunc(task.interval / 1000)} 秒后执行，继续吗？\n` +
                     `若需暂停任务调度请点击“取消”按钮。`)) {
            ctrl_enableSchedule.checked = false;
            return false;
        }
        return true;
    }
    function executeTask(task, end) {
        let taskString = '任务 → ' + formatScheduleList([task], true);
        if (end) {
            postSwitch();
        }
        else if (g_currentTask?.isReady) {
            doActivity(false);
        }
        else if (g_currentTask == null) {
            startTask();
        }

        function startTask() {
            if (evaluateCondition(task.condition)) {
                addLog('执行' + taskString, 'blue', false, true);
                task.startTime = Date.now();
                task.deadline = Date.parse(`${TIMESTAMP.get().date} ${task.time}`) + (task.timeout * 1000);
                g_execCount = 0;
                g_currentTask = task;
                if (task.taskSolution != '默认') {
                    g_assistantInterface.binding.switchByName(
                        null,
                        task.taskSolution,
                        (error) => {
                            ctrl_pkAddinPanel.refreshBinding?.call();
                            doActivity(error);
                        });
                }
                else {
                    doActivity(false);
                }
            }
            else {
                addLog(`执行${taskString}：<b style="color:red;">条件〈${task.condition}〉不成立，任务取消</b>`, 'blue', false, true);
                doRefresh(0);
            }
        }
        function doActivity(error) {
            if (error) {
                addLog(`任务起始方案“${task.taskSolution}”切换失败，本次任务取消`, 'red');
            }
            else {
                g_execCount++;
                if (g_currentTask.isReady) {
                    addLog('继续' + taskString, 'blue', false, true);
                }
                else {
                    g_currentTask.isReady = true;
                }
                if (!(g_taskMap.get(task.activity)?.activity(task) ?? true)) {
                    return;
                }
            }
            g_currentTask = null;
            postSwitch();
        }
        function postSwitch() {
            g_currentTask = null;
            if (task.completionSolution != '默认') {
                g_assistantInterface.binding.switchByName(null, task.completionSolution, endTask);
            }
            else {
                endTask(false);
            }
        }
        function endTask(error) {
            if (error) {
                addLog(`任务结束方案“${task.completionSolution}”切换失败`, 'red');
            }
            if (task.completionSolution != '默认') {
                ctrl_pkAddinPanel.refreshBinding?.call();
            }
            addLog('结束' + taskString, 'blue', false, true);
            doRefresh(0);
        }
    }
    function modifyScheduleList(title, tasks, fnPostProcess, fnParams) {
        tasks = cloneScheduleList(tasks);

        POPUP.initialize();

        const taskCheckedBG = 'white';
        const taskUncheckedBG = '#f0f0f0';
        const altInputInitialBG = '#e0e8f0';
        const altInputConnectedBG = '#c0c8e0';
        let fixedContent =
            '<div style="font-size:15px;color:#0000c0;padding:20px 0px 10px;"><b><ul>' +
            '<li>每个任务每日只会被触发一次，且任务触发具串行行为，即，上个任务完成之前下个任务将不会开始。此行为仅限执行时刻，任务定义不受影响，亦即允许定义' +
                '两个及以上触发时间相同的任务，若前一个任务执行完成后后一个任务尚在有效触发期内则将会被触发</li>' +
            '<li>任务触发时间精确到秒。如果您的设备时间与服务器时间不同步，则调整秒值有助于需要精确控制任务触发时机的场合</li>' +
            '<li>任务触发顺序以时间排序，具有相同触发时间任务的执行顺序以任务定义界面顺序为准</li>' +
            '<li>任务触发超时值用于控制需要在某个特定时间段（触发时间始持续至超时止）内触发及重试的任务。如果任务调度器执行期间某个任务尚未触发但当前时间大于' +
                '任务触发时间+超时值，此任务本日内将无触发机会。一但某个任务在符合时间要求的情况下被触发，则它至少会被执行一次并自动重试直至超时（如果需要）</li>' +
            '<li>任务方案及完成方案指任务执行前、后需切换至的角色绑定方案，默认为不切换。如果出现执行前切换失败则任务将终止，但任务后方案切换依然会被执行</li>' +
            '<li style="color:red;">任务调度器不会自动使用道具，如遇执行出击任务时无出击次数可用则会发生无效出击的情况</li>' +
            '<li style="color:red;">如果发生相应浏览器页面未加载、窗口或页签被遮挡、最小化等影响定时器的情形，则任务调度器的行为将不可预测</li></ul></b></div>' +
            `<div class="${POPUP.topLineDivClass}"><input type="text" id="alt-input"
                  style="display:inline-block;width:100%;font-size:1.3em;background-color:${altInputInitialBG};" /></div>`;
        let mainContent =
            `<style> #task-table { width:100%; }
                     #task-table th.task-index { width:4%; }
                     #task-table th.task-enabled { width:6%; padding-top:3px; }
                     #task-table th.task-time { width:10%; }
                     #task-table th.task-timeout { width:8%; }
                     #task-table th.task-condition { width:8%; }
                     #task-table th.task-solution { width:13%; }
                     #task-table th.task-activity { width:15%; }
                     #task-table th.task-completion-solution { width:13%; }
                     #task-table th.task-param { width:8%; }
                     #task-table th.task-button { width:15%; }
                     #task-table tr.alt { background-color:${POPUP.backgroundColorAlt}; }
                     #task-table input { width:100%; height:1.9em; }
                     #task-table input.alt-connected { background-color:${altInputInitialBG}; }
                     #task-table input[type="checkbox"] { width:auto; height:auto; }
                     #task-table select { width:100%; height:1.9em; }
                     #task-table b { width:100%; text-align:center; }
                     #task-table span { display:inline-block; width:20%; cursor:pointer; color:grey; } </style>
                 <div class="${POPUP.topLineDivClass}" id="Xport-div" style="display:none;"><div style="height:200px;">
                      <textarea id="Xport-text" style="height:100%;width:100%;resize:none;"></textarea></div>
                      <div style="padding:10px 0px 20px 0px;">
                          <b id="${POPUP.informationTipsId}" style="float:left;font-size:15px;color:red;"> </b>
                          <button type="button" style="float:right;margin-left:1px;" id="Xport-hide">隐藏</button>
                          <button type="button" style="float:right;" id="Xport-op">复制</button></div></div>
                 <div class="${POPUP.topLineDivClass}">
                 <table id="task-table"><tr class="alt">
                      <th class="task-index">序号</th>
                      <th class="task-enabled"><input type="checkbox" id="enable-all-tasks" />` +
                      `<label for="enable-all-tasks" style="margin-left:3px;cursor:pointer;">触发</label></th>
                      <th class="task-time">时间</th>
                      <th class="task-timeout">超时（秒）</th>
                      <th class="task-condition">执行条件</th>
                      <th class="task-solution">任务方案</th>
                      <th class="task-activity">任务</th>
                      <th class="task-completion-solution">完成方案</th>
                      <th class="task-param">额外参数</th>
                      <th class="task-button"></th></tr></table><div>`;
        let rowContent =
            `<td></td>
             <td><input type="checkbox" checked /></td>
             <td><input type="time" step="1" value="00:00:00" /></td>
             <td><input type="text" style="width:99%;" value="600" oninput="value=value.replace(/[\\D]/g,'');" /></td>
             <td><input type="text" class="alt-connected" style="width:99%;" value="" /></td>
             <td><select><option value="默认">默认</option></select></td>
             <td><select></select></td>
             <td><select><option value="默认">默认</option></select></td>
             <td><input type="text" class="alt-connected" style="width:99%;" value="" /></td>
             <td><b><span title="上移">▲</span><span title="下移" style="background-color:#ccdddd;">▼</span>` +
                   `<span title="新增">✚</span><span title="复制" style="background-color:#ccdddd;">⊗</span>` +
                   `<span title="删除">✖</span></b></td>`;

        POPUP.setFixedContent(fixedContent);
        POPUP.setContent(title, mainContent);

        let trProto = document.createElement('tr');
        trProto.className = 'task-row';
        trProto.innerHTML = rowContent;
        let condVars = [];
        g_conditionSymbols.forEach((s) => {
            condVars.push(`● ${s.symbol}（${s.alias}，${s.description}）`);
        });
        let conditionTitle = '全局变量（引用方式 $[变量名]）：\n' + condVars.join('\n');
        let selectors = trProto.querySelectorAll('select');
        g_assistantInterface.binding.list()?.forEach((role) => {
            let opg = document.createElement('optgroup');
            opg.label = `● ${role.role.name}`;
            role.bindings.forEach((bind) => {
                let op = document.createElement('option');
                op.value = op.innerText = `${role.role.name} ${g_assistantInterface.binding.SOLUTION_NAME_SEPARATOR} ${bind.name}`;
                opg.appendChild(op);
            });
            selectors[0].appendChild(opg.cloneNode(true));
            selectors[2].appendChild(opg);
        });
        g_tasks.forEach((task) => {
            let op = document.createElement('option');
            op.value = task.name;
            op.innerText = task.alias;
            op.title = (task.parameterTips ?? '无参数');
            selectors[1].appendChild(op);
        });

        function altConnectTarget(target) {
            if (altInput.altTarget != target) {
                if (altInput.altTarget != null) {
                    altInput.altTarget.style.backgroundColor = altInputInitialBG;
                    altInput.altTarget = null;
                }
                if ((altInput.altTarget = target) != null) {
                    altInput.value = target.value;
                    altInput.title = target.title;
                    altInput.altTarget = target;
                    target.style.backgroundColor = altInputConnectedBG;
                    altInput.style.backgroundColor = altInputConnectedBG;
                }
                else {
                    altInput.value = '';
                    altInput.title = '';
                    altInput.style.backgroundColor = altInputInitialBG;
                }
            }
        }
        POPUP.contentContainer()?.addEventListener("focusin", ((e) => {
            if (e.target?.className == 'alt-connected') {
                altConnectTarget(e.target);
            }
            else if (e.target != altInput) {
                altConnectTarget(null);
            }
        }));
        let altInput = POPUP.querySelector('#alt-input');
        altInput.onfocus = ((e) => {
            altInput.value = (altInput.altTarget?.value ?? '');
            altInput.title = (altInput.altTarget?.title ?? '');
        });
        altInput.oninput = (() => {
            if (altInput.altTarget != null) {
                altInput.altTarget.value = altInput.value;
            }
            else {
                altInput.value = '';
            }
        });
        altInput.onchange = (() => {
            if (altInput.altTarget != null) {
                altInput.altTarget.value = altInput.value;
                altInput.altTarget.onchange({currentTarget : altInput.altTarget});
                altInput.value = altInput.altTarget.value;
                altInput.title = altInput.altTarget.title;
            }
            else {
                altInput.value = '';
                altInput.title = '';
            }
        });
        let taskTable = POPUP.querySelector('#task-table');
        POPUP.querySelector('#enable-all-tasks').onchange = ((e) => {
            let chk = e.currentTarget.checked;
            taskTable.querySelectorAll('tr.task-row')?.forEach((t) => {
                t.children[1].firstElementChild.checked = chk;
                t.children[1].firstElementChild.onchange({currentTarget : t.children[1].firstElementChild});
            });
        });

        function moveUp(e) {
            let t = e.currentTarget.parentElement?.parentElement?.parentElement;
            let n = t?.previousElementSibling;
            if (n?.previousElementSibling != null) {
                t.remove();
                n.parentElement.insertBefore(t, n);
                renderRows();
            }
        }
        function moveDown(e) {
            let t = e.currentTarget.parentElement?.parentElement?.parentElement;
            let n = t?.nextElementSibling;
            if (n != null) {
                t.remove();
                n.parentElement.insertBefore(t, n.nextElementSibling);
                renderRows();
            }
        }
        function addTask(e) {
            taskTable.insertBefore(newTask(), e.currentTarget.parentElement?.parentElement?.parentElement?.nextElementSibling);
            renderRows();
        }
        function cloneTask(e) {
            let t = e.currentTarget.parentElement?.parentElement?.parentElement;
            taskTable.insertBefore(newTask(collectRow(t)), t?.nextElementSibling);
            renderRows();
        }
        function deleteTask(e) {
            e.currentTarget.parentElement?.parentElement?.parentElement.remove();
            if (taskTable.children.length == 1) {
                taskTable.appendChild(newTask());
            }
            renderRows();
        }
        function newTask(task) {
            let t = trProto.cloneNode(true);
            let ops = t.querySelectorAll('span');
            ops[0].onclick = moveUp;
            ops[1].onclick = moveDown;
            ops[2].onclick = addTask;
            ops[3].onclick = cloneTask;
            ops[4].onclick = deleteTask;
            t.children[1].firstElementChild.onchange = ((e) => {
                let bg = (e.currentTarget.checked ? taskCheckedBG : taskUncheckedBG);
                e.currentTarget.parentElement.parentElement.children[0].style.color =
                    (e.currentTarget.checked ? 'black' : 'darkgrey');
                e.currentTarget.parentElement.parentElement.children[2].firstElementChild.style.backgroundColor = bg;
                e.currentTarget.parentElement.parentElement.children[3].firstElementChild.style.backgroundColor = bg;
                e.currentTarget.parentElement.parentElement.children[5].firstElementChild.style.backgroundColor = bg;
                e.currentTarget.parentElement.parentElement.children[6].firstElementChild.style.backgroundColor = bg;
                e.currentTarget.parentElement.parentElement.children[7].firstElementChild.style.backgroundColor = bg;
            });
            t.children[1].oncontextmenu = t.children[1].firstElementChild.oncontextmenu = ((e) => {
                e.preventDefault();
                if (e.currentTarget.type == 'checkbox') {
                    return;
                }
                let chk = !e.currentTarget.firstElementChild.checked;
                for (let tr = e.currentTarget.parentElement;
                     tr?.className?.startsWith('task-row');
                     tr = tr.previousElementSibling) {
                    tr.children[1].firstElementChild.checked = chk;
                    tr.children[1].firstElementChild.onchange({currentTarget : tr.children[1].firstElementChild});
                }
            });
            t.children[4].firstElementChild.onchange = ((e) => {
                e.currentTarget.value = formatSymbolicString(e.currentTarget.value);
                e.currentTarget.title = `条件：\n● ${e.currentTarget.value?.length > 0 ? `${e.currentTarget.value}` : '无'}\n\n${conditionTitle}`;
            });
            t.children[6].firstElementChild.onchange = ((e) => {
                e.currentTarget.title = e.currentTarget.options[e.currentTarget.selectedIndex].title;
                e.currentTarget.parentElement.parentElement.children[8].firstElementChild.title =
                    `参数（${e.currentTarget.options[e.currentTarget.selectedIndex].title}）：` +
                    `\n● ${t.children[8].firstElementChild.value?.length > 0 ? t.children[8].firstElementChild.value : '无'}\n\n${conditionTitle}`;
            });
            t.children[8].firstElementChild.onchange = ((e) => {
                e.currentTarget.value = formatSymbolicString(e.currentTarget.value);
                e.currentTarget.title = `参数（${t.children[6].firstElementChild.options[t.children[6].firstElementChild.selectedIndex].title}）：` +
                                        `\n● ${e.currentTarget.value?.length > 0 ? e.currentTarget.value : '无'}\n\n${conditionTitle}`;
            });
            t.children[4].firstElementChild.oninput = t.children[8].firstElementChild.oninput = ((e) => {
                if (altInput.altTarget == e.currentTarget) {
                    altInput.value = e.currentTarget.value;
                }
            });
            if (task != null) {
                t.children[1].firstElementChild.checked = (task.enabled ?? false);
                t.children[2].firstElementChild.value = (task.time ?? '00:00:00');
                t.children[3].firstElementChild.value = (task.timeout ?? '600');
                t.children[4].firstElementChild.value = (task.condition ?? '');
                t.children[5].firstElementChild.value = (task.taskSolution ?? '默认');
                t.children[6].firstElementChild.value = (task.activity ?? 'switchSolution');
                t.children[7].firstElementChild.value = (task.completionSolution ?? '默认');
                t.children[8].firstElementChild.value = (task.param ?? '');
            }
            else {
                t.children[2].firstElementChild.value = TIMESTAMP.get().time;
            }
            t.children[1].firstElementChild.onchange({currentTarget : t.children[1].firstElementChild});
            t.children[4].firstElementChild.onchange({currentTarget : t.children[4].firstElementChild});
            t.children[6].firstElementChild.onchange({currentTarget : t.children[6].firstElementChild});
            t.children[8].firstElementChild.onchange({currentTarget : t.children[8].firstElementChild});
            return t;
        }
        function renderRows() {
            altConnectTarget(null)
            taskTable.querySelectorAll('tr.task-row')?.forEach((t, i) => {
                t.children[0].innerText = i + 1;
                t.className = 'task-row' + ((i & 1) == 0 ? '' : ' alt');
            });
        }
        function representTasks(tasks) {
            taskTable.querySelectorAll('tr.task-row')?.forEach((t) => { t.remove(); });
            if (tasks?.length > 0) {
                tasks?.forEach((t) => { taskTable.appendChild(newTask(t)); });
            }
            else {
                taskTable.appendChild(newTask());
            }
            renderRows();
        }
        function collectRow(row) {
            let activity = row.children[6].firstElementChild.value;
            return g_taskMap.get(activity)?.validate({
                enabled : row.children[1].firstElementChild.checked,
                time : row.children[2].firstElementChild.value,
                timeout : parseInt(row.children[3].firstElementChild.value),
                condition : row.children[4].firstElementChild.value,
                taskSolution : row.children[5].firstElementChild.value,
                activity : activity,
                completionSolution : row.children[7].firstElementChild.value,
                param : row.children[8].firstElementChild.value
            });
        }
        function collectRows() {
            let tasks = [];
            taskTable.querySelectorAll('tr.task-row')?.forEach((t, i) => {
                let task = collectRow(t);
                if (task != null) {
                    task.index = i;
                    tasks.push(task);
                }
            });
            tasks.sort(compareTask);
            tasks.forEach((t, i) => { t.index = i; });
            return tasks;
        }
        function compareTask(a, b) {
            let delta = parseInt(a.time.replaceAll(':', '')) - parseInt(b.time.replaceAll(':', ''));
            if (delta == 0) {
                delta = a.index - b.index;
                if (isNaN(delta)) {
                    delta = 0;
                }
            }
            return delta;
        }

        representTasks(tasks);

        let xportDiv = POPUP.querySelector('#Xport-div');
        let xportText = POPUP.querySelector('#Xport-text');
        let xportOp = POPUP.querySelector('#Xport-op');
        xportOp.onclick = (() => {
            if (xportOp.innerText.startsWith('复制')) {
                xportText.select();
                if (document.execCommand('copy')) {
                    POPUP.showInformationTips('导出内容已复制到剪贴板', 5000);
                }
                else {
                    POPUP.showInformationTips('复制失败，请进行手工复制（CTRL+A, CTRL+C）');
                }
            }
            else {
                representTasks(JSON.parse(xportText.value));
                POPUP.showInformationTips('导入已完成', 5000);
            }
        });

        POPUP.querySelector('#Xport-hide').onclick = (() => {
            xportDiv.style.display = 'none';
            xportText.value = '';
        });

        POPUP.addButton(
            '导入',
            0,
            () => {
                POPUP.showInformationTips('');
                xportOp.innerText = '执行导入';
                xportText.value = '';
                xportText.removeAttribute('readonly');
                xportDiv.style.display = 'block';
                xportDiv.scrollIntoView(true);
            },
            true);
        POPUP.addButton(
            '导出',
            0,
            () => {
                let string = JSON.stringify(collectRows());
                if (string?.length > 0) {
                    POPUP.showInformationTips('');
                    xportOp.innerText = '复制导出内容至剪贴板';
                    xportText.value = string;
                    xportText.setAttribute('readonly', '');
                    xportDiv.style.display = 'block';
                    xportDiv.scrollIntoView(true);
                }
            },
            true);
        POPUP.addButton('重新排序', 0, (() => { representTasks(collectRows()); }), true);
        POPUP.addButton('全部清除', 0, (() => {
            if (confirm('这将清除全部已定义任务，继续吗？')) {
                representTasks(null);
            }
        }),true);
        POPUP.addButton(
            '确认',
            80,
            (() => {
                if (fnPostProcess != null) {
                    fnPostProcess(collectRows(), fnParams);
                }
                POPUP.close(true, true);
            }),
            false);
        POPUP.addCloseButton(80);

        POPUP.setContentSize(window.innerHeight - 600, window.innerWidth - 200, true);
        POPUP.showModal(true);
    }

    let g_autoRefresh_Period = [];
    function parseAutoRefreshPeriod(configString) {
        let period = -1;
        if (configString?.length > 0) {
            g_autoRefresh_Period = [];
            let pairs = configString.split(',');
            let index = 0;
            for (let p of pairs) {
                let pair = p.split('=');
                if (pair.length == 2) {
                    let t = pair[0].split(':');
                    let h, m, time, peri;
                    if (t?.length != 2 || (h = parseInt(t[0])) < 0 || h > 23 || (m = parseInt(t[1])) < 0 ||
                        m > 59 || isNaN(time = h * 60 + m) || isNaN(peri = parseInt(pair[1])) || peri < 1) {

                        period = -1;
                        break;
                    }
                    g_autoRefresh_Period.push({ time : time , period : peri });
                    index++;
                }
                else if (pair.length == 1 && index == 0) {
                    period = isNaN(period = parseInt(pair[0])) ? -1 : period;
                    break;
                }
                else {
                    period = -1;
                    break;
                }
            }
            if (index == pairs.length) {
                g_autoRefresh_Period.sort((a, b) => a.time - b.time);
                if (g_autoRefresh_Period[0].time != 0) {
                    g_autoRefresh_Period[0].time = 0;
                }
                return;
            }
        }
        g_autoRefresh_Period = [{ time : 0 , period : (period > 0 ? period : -1) }];
    }

    function getAutoRefreshPeriod() {
        let period = g_autoRefresh_Period[0].period;
        let time = new Date();
        time = time.getHours() * 60 + time.getMinutes();
        for (let p of g_autoRefresh_Period) {
            if (time < p.time) {
                break;
            }
            period = p.period;
        }
        return (period > 0 ? period : -1);
    }

    function formatAutoRefreshPeriod(separator) {
        separator ??= ',';
        let pairs = [];
        for (let p of g_autoRefresh_Period) {
            pairs.push(`${('0' + Math.trunc(p.time / 60)).slice(-2)}:${('0' + p.time % 60).slice(-2)}=${p.period}`);
        }
        return pairs.join(separator);
    }

    function setRefreshPeriod(configString) {
        doRefresh(-1);

        let r = (getAutoRefreshPeriod() > 0);
        let newPeriod = prompt("刷新周期列表（时段间以','分隔，0或其它非法值禁止自动刷新）：", configString ?? formatAutoRefreshPeriod());
        if (newPeriod != null) {
            parseAutoRefreshPeriod(newPeriod);
            r = (getAutoRefreshPeriod() > 0);
            ctrl_refreshCountdownLabel.innerText = (r ? '距离下次刷新' : '禁止自动刷新');
            ctrl_refreshCountdownLabel.style.fontWeight = (r ? '' : 'bold');
            ctrl_refreshCountdownLabel.style.color = (r ? '' : 'maroon');
            ctrl_refreshCountdownLabel.title = `刷新周期：\n${formatAutoRefreshPeriod('\n')}`;

            g_config.refreshPeriod = formatAutoRefreshPeriod();
            saveConfig();
        }
        if (r) {
            confirmNextTask();
        }

        doRefresh();
    }

    let g_pkAssistDBName = g_kfUser + '_pkAssistDB';
    let g_pkAssistDB = null;
    function initializeDB() {
        return new Promise((resolve) => {
            let req = window.indexedDB.open(g_pkAssistDBName);
            req.onsuccess = ((e) => {
                // clean deprecated storage
                // GM_listValues()?.forEach((k) => { GM_deleteValue(k); });
                // clean end
                g_pkAssistDB = e.target.result;
                resolve(true);
            });
            req.onerror = req.onblocked = ((e) => {
                alert('创建或打开助手数据库失败，请检查。');
                console.log('pk助手：数据库错误 => ', e.target.error);
                resolve(false);
            });
            req.onupgradeneeded = ((e) => {
                let db = e.target.result;
                // import pk recoreds
                let store = db.createObjectStore('pvp', { keyPath : 'date' });
                let gmKey = g_kfUser + '_pvpRecord';
                let gmRec = (GM_getValue(gmKey) ?? {});
                let k = Object.keys(gmRec).sort((a, b) => {
                    if (isNaN(a = Date.parse(a))) {
                        return 1;
                    }
                    else if (isNaN(b = Date.parse(b))) {
                        return -1;
                    }
                    return a - b;
                });
                for (let d of k) {
                    if (isNaN(Date.parse(d))) {
                        break;
                    }
                    let v = gmRec[d];
                    if (v != undefined) {
                        store.add({ date : d , log : v });
                    }
                }
                // import log
                store = db.createObjectStore('log', { keyPath : 'timestamp' });
                gmKey = g_kfUser + '_logRecord';
                gmRec = (GM_getValue(gmKey) ?? {});
                k = Object.keys(gmRec).sort((a, b) => {
                    if (isNaN(a = Date.parse(a))) {
                        return 1;
                    }
                    else if (isNaN(b = Date.parse(b))) {
                        return -1;
                    }
                    return a - b;
                });
                for (let d of k) {
                    if (isNaN(Date.parse(d))) {
                        break;
                    }
                    let v = gmRec[d];
                    if (v != undefined) {
                        let lts = 0;
                        for (let b of v) {
                            let ts = Date.parse(`${d} ${b[0]}`);
                            if (ts <= lts) {
                                ts = ++lts;
                            }
                            else {
                                lts = ts;
                            }
                            store.add({ timestamp : ts , date : d , time : b[0] , log : b[1] });
                        }
                    }
                }
                // import battle recoreds
                store = db.createObjectStore('battle', { keyPath : 'timestamp' });
                store.createIndex('date', 'date');
                gmKey = g_kfUser + '_pkRecord';
                gmRec = (GM_getValue(gmKey) ?? {});
                k = Object.keys(gmRec).sort((a, b) => {
                    if (isNaN(a = Date.parse(a))) {
                        return 1;
                    }
                    else if (isNaN(b = Date.parse(b))) {
                        return -1;
                    }
                    return a - b;
                });
                for (let d of k) {
                    if (isNaN(Date.parse(d))) {
                        break;
                    }
                    let v = gmRec[d];
                    if (v != undefined) {
                        let lts = 0;
                        for (let b of v) {
                            let ts = Date.parse(`${d} ${b[1][0]}`);
                            if (ts <= lts) {
                                ts = ++lts;
                            }
                            else {
                                lts = ts;
                            }
                            store.add({ timestamp : ts , date : d , time : b[1][0] , log : b[1][1] , codec : b[0] });
                        }
                    }
                }
            });
        });
    }
    if(!(await initializeDB())) {
        return;
    }

    const g_logTitle = `PK助手 v${g_version}`;
    function addLog(log, color, archive, noNotification) {
        if (log?.length > 0) {
            g_assistantInterface.pageMessage.addSingle(g_logTitle, `<div style="color:${color ?? 'black'};">${log}</div>`, noNotification);
            if (archive) {
                return saveLog(log);
            }
        }
        return null;
    }
    function saveLog(log) {
        if (g_config.recordLiveDuration > 0 && log?.length > 0) {
            let timestamp = Date.now();
            let date = TIMESTAMP.get(new Date(timestamp));
            return new Promise((resolve) => {
                let req = g_pkAssistDB.transaction('log', 'readwrite').objectStore('log').add(
                    {
                        timestamp: timestamp ,
                        date : date.date,
                        time : date.time,
                        log : log
                    });
                req.onerror = ((e) => {
                    addLog('日志保存失败，请检查。', 'red');
                    console.log(e.target.error);
                    resolve(false);
                });
                req.onsuccess = ((e) => {
                    resolve(true);
                });
            });
        }
    }

    const g_pvpRecordCodec = [
        {
            index : -1,
            name : '20230808-001',
            encode : (date, div, oldDiv) => {
                function newRecordCount(div, oldDiv, maxCompare) {
                    let dl = div.children.length;
                    let odl = oldDiv.children.length;
                    if (odl > 0) {
                        for (let i = 0; i < dl; i++) {
                            let cc = maxCompare;
                            for (var j = 0; j < odl && i + j < dl && cc > 0; j++, cc--) {
                                let n = div.children[i + j].innerText.replace(/([攻守])/, '/$1').replaceAll(/\s/g, '');
                                let o = oldDiv.children[j].innerText.replace(/([攻守])/, '/$1').replaceAll(/\s/g, '');
                                if (n.match(/\d+/)?.[0] != o.match(/\d+/)?.[0] ||
                                    n.substring(n.indexOf('/')) != o.substring(o.indexOf('/'))) {
                                    break;
                                }
                            }
                            if (cc == 0 || j >= odl || i + j >= dl) {
                                return i;
                            }
                        }
                    }
                    return dl;
                }

                if (/[昨今]天\s*\d{2}时/.test(div?.querySelector('div.row > div.col-md-2 > div.alert.fyg_f18.fyg_tc')?.innerText)) {
                    let iDup = newRecordCount(div, oldDiv, g_maxDupRecordCount);
                    if (iDup > 0) {
                        let o = oldDiv.firstElementChild;
                        let h = parseInt(date.time.substring(0, 2));
                        let d = Date.parse(date.date);
                        for (let i = 0; i < iDup ; i++) {
                            let n = div.children[i].cloneNode(true);
                            let t = n.firstElementChild.firstElementChild;
                            let yd = /昨/.test(t.innerText);
                            let ht = t.innerText.match(/\d+/)?.[0];
                            let dd = 0;
                            let dh = parseInt(ht ?? 0) - h;
                            if (yd && dh > 0) {
                                dd = dh = -1;
                            }
                            // else if (dh == -23) {
                            //     dd = dh = 1;
                            // }
                            let dt = (dd == 0 ? date : TIMESTAMP.get(new Date(d + (dd * 24 * 3600000)))).date;
                            t.innerHTML = (dh == 0 ? date.time : ht + (dh > 0 ? ':00:00' : ':59:59')) +
                                ` <span style="color:grey;">［${dt.slice(-5)}］</span>`;
                            n.title = dt;
                            oldDiv.insertBefore(n, o);
                        }
                        return oldDiv.innerHTML;
                    }
                    return '';
                }
                return null;
            },
            decode : (data) => {
                return data;
            },
            render : (date, div) => {
                div?.querySelectorAll('div.row')?.forEach((r) => {
                    if (r.title == date.date) {
                        r.firstElementChild.firstElementChild.style.backgroundColor = '#e0e0f0';
                        r.firstElementChild.firstElementChild.style.color = '#c00000';
                        r.firstElementChild.firstElementChild.firstElementChild.style.color = '#800000';
                    }
                });
                return div;
            },
            trim : (date, data) => {
                let div = document.createElement('div');
                div.innerHTML = (data ?? '');
                div.querySelectorAll('div.row')?.forEach((r) => {
                    if (r.title != date.date) {
                        r.remove();
                    }
                });
                return div.innerHTML;
            }
        }
    ];
    const g_pvpRecordCodecMap = new Map();
    g_pvpRecordCodec.forEach((item, index) => {
        item.index = index;
        g_pvpRecordCodecMap.set(item.name, item);
    });
    const g_maxDupRecordCount = 5;
    const g_defaultPvpRecordCodec = g_pvpRecordCodec[0];

    const g_battleCodec = [
        {
            index : -1,
            name : '20230317-001',
            encode : (div) => {
                return (div?.querySelectorAll('div.col-md-7 > p > span.fyg_f18')?.length == 2 &&
                        div?.querySelector('div.with-icon.fyg_tc') != null ? div.innerHTML : null);
            },
            decode : (data) => {
                let div = document.createElement('div');
                div.innerHTML = data;

                let roles = div.querySelectorAll('div.col-md-7 p span.fyg_f18');
                let role1 = roles?.[0]?.innerText?.match(/（Lv\.(\d+)\s*(.+?)）\s*(.+)/);
                let role2 = roles?.[1]?.innerText?.match(/(.+?)\s*（(.+?)\s*Lv\.(\d+).*?）/);
                let result = div.querySelector('div.with-icon.fyg_tc');
                result = result?.className?.match(/alert-(.+?)\s+/)?.[1];

                div.querySelectorAll('div.row > div.row > div.col-md-6 > div.alert > div.row')?.forEach((e) => {
                    e.removeAttribute('style');
                });

                return { roles : [ (role1 == null ? g_anonymousRole : { kfUser : role1[3], card : role1[2], level : role1[1] }),
                                   (role2 == null ? g_anonymousRole : { kfUser : role2[1], card : role2[2], level : role2[3] }) ],
                         winner : (result == null ? 0 : (result == 'danger' ? 1 : 2)),
                         battle : div };
            }
        }
    ];
    const g_battleCodecMap = new Map();
    g_battleCodec.forEach((item, index) => {
        item.index = index;
        g_battleCodecMap.set(item.name, item);
    });
    const g_anonymousRole = { kfUser : '未知', role : '未知', level : 0 };
    const g_defaultBattleCodec = g_battleCodec[0];
    let g_battleDateList = null;
    const DateComparer = ((a, b) => Date.parse(b) - Date.parse(a));
    function buildBattleDateList() {
        g_battleDateList = [];
        return new Promise((resolve) => {
            let req = g_pkAssistDB.transaction('battle', 'readonly').objectStore('battle').index('date').openCursor(null, 'prevunique');
            req.onerror = ((e) => { resolve(false); });
            req.onsuccess = ((e) => {
                let cursor = e.target.result;
                if (cursor == undefined) {
                    resolve(true);
                    return;
                }
                g_assistantInterface.util.insert(g_battleDateList, cursor.key, DateComparer);
                cursor.continue();
            });
        });
    }
    await buildBattleDateList();

    const g_pkText = document.querySelector("#pk_text");
    let g_currentTime = TIMESTAMP.get();
    let g_currentPvp = null;
    function hookPkText() {
        function saveBattle(date, log, key) {
            return new Promise((resolve) => {
                let req = g_pkAssistDB.transaction('battle', 'readwrite').objectStore('battle').add(
                    {
                        timestamp : key,
                        date : date.date,
                        time : date.time,
                        log : log,
                        codec : g_defaultBattleCodec.name
                    });
                req.onerror = ((e) => {
                    addLog('战斗记录保存失败，请检查。', 'red');
                    console.log(e.target.error);
                    resolve(false);
                });
                req.onsuccess = ((e) => {
                    if (g_assistantInterface.util.search(g_battleDateList, date.date, DateComparer) < 0) {
                        g_assistantInterface.util.insert(g_battleDateList, date.date, DateComparer);
                    }
                    resolve(true);
                });
            });
        }
        function loadPvp(date) {
            return new Promise((resolve) => {
                let req = g_pkAssistDB.transaction('pvp', 'readonly').objectStore('pvp').get(date.date);
                req.onerror = ((e) => { resolve(null); });
                req.onsuccess = ((e) => { resolve(e.target.result?.log); });
            });
        }
        function savePvp(date, log) {
            return new Promise((resolve) => {
                let req = g_pkAssistDB.transaction('pvp', 'readwrite').objectStore('pvp').put(
                    {
                        date : date.date,
                        log : log
                    });
                req.onerror = ((e) => {
                    addLog('防守记录保存失败，请检查。', 'red');
                    console.log(e.target.error);
                    resolve(false);
                });
                req.onsuccess = ((e) => {
                    resolve(true);
                });
            });
        }
        async function processPkText() {
            if (g_config.recordLiveDuration > 0) {
                let timestamp = Date.now();
                let date = TIMESTAMP.get(new Date(timestamp));
                let log = g_defaultBattleCodec.encode(g_pkText);
                if (log != null){
                    saveBattle(date, log, timestamp);
                }
                else {
                    if (g_currentTime.date != date.date) {
                        if (g_currentPvp != null) {
                            savePvp(g_currentTime, g_currentPvp = g_defaultPvpRecordCodec.trim(g_currentTime, g_currentPvp));
                            savePvp(date, g_currentPvp);
                        }
                        g_currentTime = date;
                    }
                    else if (g_currentPvp == null) {
                        if ((g_currentPvp = await loadPvp(g_currentTime)) == null) {
                            let yd = TIMESTAMP.get(new Date(timestamp - (24 * 3600000)));
                            if((g_currentPvp = await loadPvp(yd)) != null) {
                                savePvp(yd, g_currentPvp = g_defaultPvpRecordCodec.trim(yd, g_currentPvp));
                                savePvp(g_currentTime, g_currentPvp);
                            }
                        }
                    }
                    if (g_pkText.innerText.trim().length == 0) {
                        g_pkText.innerHTML = (g_currentPvp ??= '');
                    }
                    else {
                        let div = document.createElement('div');
                        div.innerHTML = (g_currentPvp ??= '');
                        if ((log = g_defaultPvpRecordCodec.encode(date, g_pkText, div)) != null) {
                            if (log.length > 0) {
                                g_currentPvp = log;
                                savePvp(g_currentTime, g_currentPvp);
                            }
                            g_pkText.innerHTML = g_currentPvp;
                        }
                    }
                    g_defaultPvpRecordCodec.render(g_currentTime, g_pkText);
                }
            }
        }

        let pkTextObserver = new MutationObserver((mList) => {
            for (let e of mList) {
                if (e.addedNodes?.length > 0) {
                    pkTextObserver.disconnect();
                    processPkText();
                    pkTextObserver.observe(g_pkText, { childList : true });
                    break;
                }
            }
        });

        processPkText();
        pkTextObserver.observe(g_pkText, { childList : true });
    }

    let g_refreshCount = 0;
    let g_recordCount = 0;
    let g_refreshError = 0;
    function refreshCounters() {
        ctrl_refreshCount.innerText = `${g_refreshCount} / ${g_recordCount} / ${g_refreshError}`;
    }

    const g_pkList = document.querySelector("#pklist");
    const g_pkInformationNames = ['当前所在段位', '段位进度', '今日获得狗牌 / 今日出击次数', '连胜场次 | 连败场次'];
    const g_pkInformationValues = ['初始化', '初始化', '初始化', '初始化'];
    let g_pkPrizeState = null;
    const g_maxPvpLogIdle = 5;
    let g_pvpLogIdle = 0;
    const g_maxPvpLogIdleTime = 300000;
    let g_pvpLogTime = 0;
    const g_maxAtkCount = 20;
    let g_pkGrade = '';
    let g_pkProgress = 0;
    let g_pkAtkWins = 0;
    let g_pkAtkCount = 0;
    let g_pkWinCount = 0;
    let g_pkLoseCount = 0;
    const g_errorRetryPeriod = 30;
    let g_ajaxFailure = false;
    let g_refreshFailure = false;
    function processPkList(initializing) {
        doRefresh(-1);
        g_refreshCount++;
        let log = [];
        let pvpLog = false;
        let timestamp = Date.now();
        if (initializing) {
            log.push(`版本时间：${g_modiTime}`);
        }
        let infos = g_pkList.querySelectorAll('div.row.panel-body > div.fyg_tc > span.fyg_lh60');
        if (infos?.length == g_pkInformationNames.length) {
            if (g_refreshFailure) {
                addLog('战斗页面信息恢复', 'blue');
                g_refreshFailure = false;
            }
            let prize = /请至首页/.test(g_pkList.firstElementChild.innerText);
            if (g_pkPrizeState != prize) {
                g_pkPrizeState = prize;
                if (!initializing) {
                    log.push('翻牌奖励条件：' + (prize ? '已满足' : '未满足'));
                }
                else {
                    log.push('翻牌奖励条件：初始化 → ' + (prize ? '已满足' : '未满足'));
                }
            }
            infos.forEach((e, i) => {
                if (e.parentElement.innerText.indexOf(g_pkInformationNames[i]) >= 0) {
                    if (g_pkInformationValues[i] != e.innerText) {
                        log.push(`${g_pkInformationNames[i]}：${g_pkInformationValues[i]} → ${e.innerText}`);
                        g_pkInformationValues[i] = e.innerText;
                        if (i == 0) {
                            g_pkGrade = g_pkInformationValues[0].trim();
                        }
                        else if (i == 1) {
                            pvpLog = true;
                            g_pkProgress = parseInt(g_pkInformationValues[1]);
                        }
                        else if (i == 2) {
                            if (!(pvpLog = (g_pkInformationValues[i] == '0 / 0'))) {
                                g_pvpLogTime = timestamp;
                                g_pvpLogIdle = 0;
                            }
                            let pkResult = g_pkInformationValues[2].split('/');
                            g_pkAtkWins = parseInt(pkResult[0]);
                            g_pkAtkCount = parseInt(pkResult[1]);
                        }
                        else if (i == 3) {
                            let pkResult = g_pkInformationValues[3].split('|');
                            g_pkWinCount = parseInt(pkResult[0]);
                            g_pkLoseCount = parseInt(pkResult[1]);
                        }
                    }
                }
                else {
                    g_refreshError++;
                    addLog('战斗页面信息异常：' + g_pkInformationNames[i], 'red');
                }
            });

            if (log.length > 0) {
                addLog(log.join('<br>'), 'darkblue', !initializing, initializing);
            }

            if (initializing || pvpLog || ++g_pvpLogIdle >= g_maxPvpLogIdle || timestamp - g_pvpLogTime >= g_maxPvpLogIdleTime) {
                g_pvpLogTime = timestamp;
                g_pvpLogIdle = 0;
                g_recordCount++;
                pklog();
            }

            if (g_currentTask != null) {
                executeTask(g_currentTask, (g_taskMap.get(g_currentTask.activity)?.checkCompletion?.call(null, g_currentTask) ?? true));
            }
            else {
                doRefresh();
            }
        }
        else if (g_login) {
            if (!g_refreshFailure) {
                addLog('战斗页面信息异常', 'red');
                g_refreshFailure = true;
            }
            g_refreshError++;
            doRefresh(g_errorRetryPeriod);
        }
    }

    const g_dayMSCorrection = 0;
    const g_dayMS = 24 * 3600000 + g_dayMSCorrection;
    const g_timerTolerance = 5000;
    let g_countDownTimer = null;
    let g_today = TIMESTAMP.get().date;
    function doRefresh(interval) {
        if (g_countDownTimer != null) {
            clearTimeout(g_countDownTimer);
            g_countDownTimer = null;
            ctrl_refreshCountdown.innerText = '00:00:00';
        }

        if (!g_login) {
            return;
        }

        let date = TIMESTAMP.get();
        if (g_today != date.date) {
            deleteRecords(null, true);
            g_today = date.date;
        }

        refreshCounters();

        interval ??= getAutoRefreshPeriod();
        if (interval < 0) {
            return;
        }
        interval *= 1000;

        if (g_config.scheduleEnabled && ctrl_enableSchedule.checked && !g_refreshFailure && !g_ajaxFailure) {
            let task = getNextTask();
            if (task != null) {
                if (task.interval == 0) {
                    executeTask(task);
                    return;
                }
                interval = Math.min(interval, task.interval);
            }
        }

        interval = Math.min(interval, g_dayMS - TIMESTAMP.timeToMS(date.time));

        if (interval == 0) {
            pklist();
        }
        else {
            let fireTime = Date.now() + interval;
            timerRoutine(false);

            function timerRoutine(setOnly) {
                let etr = fireTime - Date.now();
                if (etr <= 0) {
                    g_countDownTimer = null;
                    pklist();
                    if ((etr = -etr) > g_timerTolerance) {
                        g_refreshError++;
                        addLog(`定时器间隔异常：${formatTimeSpan(interval)} → ${formatTimeSpan(interval + etr)}`, 'red');
                    }
                }
                else if (setOnly) {
                    g_countDownTimer = setTimeout(timerRoutine, Math.min(etr, 1000), false);
                }
                else {
                    ctrl_refreshCountdown.innerText = formatTimeSpan(etr);
                    timerRoutine(true);
                }
            }

            function formatTimeSpan(milliseconds) {
                return `${('0' + Math.trunc((milliseconds += 999) / 3600000)).slice(-2)}:${
                          ('0' + Math.trunc(milliseconds / 60000) % 60).slice(-2)}:${
                          ('0' + Math.trunc(milliseconds / 1000) % 60).slice(-2)}`;
            }
        }
    }

    let g_requestPropertyUse = null;
    async function useRecoverDrug(fnPostProcess, fnParams) {
        if (g_requestPropertyUse == null) {
            if ((g_requestPropertyUse = await AJAX.getInfoAsync('oclick', AJAX.GuGuZhenRequest.user, true)) == null) {
                addLog('无法获取服务请求接口（oclick）', 'red');
                if (fnPostProcess != null) {
                    fnPostProcess(false, fnParams);
                }
                return;
            }
            g_requestPropertyUse.data = g_requestPropertyUse.data.replace('"+cn+"', '13').replace('"+id+"', '2');
        }

        AJAX.begin(
            g_requestPropertyUse.request,
            g_requestPropertyUse.data,
            (response) => {
                if (fnPostProcess != null) {
                    fnPostProcess(response.responseText.indexOf('已刷新') >= 0, fnParams);
                }
            });
    }

    function deleteRecords(before, init) {
        let tp = null;
        if (init || confirm('这将永久删除相应日志，继续吗？')) {
            let keepTime = parseInt(before ?? g_config?.recordLiveDuration) * 24 * 3600000;
            if (!isNaN(keepTime)) {
                let keepTS = Date.parse(`${TIMESTAMP.get().date} 00:00:00`) + (24 * 3600000) - keepTime;
                let keepDT = TIMESTAMP.get(new Date(keepTS)).date;
                tp = new Promise((resolve) => {
                    let tx = g_pkAssistDB.transaction(['pvp', 'log', 'battle'], 'readwrite');
                    tx.onerror = tx.onabort = ((e) => {
                        addLog('日志清理失败，请检查。', 'red');
                        console.log(e.target.error);
                        resolve(false);
                    });
                    tx.oncomplete = ((e) => { resolve(true); });
                    tx.objectStore('pvp').delete(IDBKeyRange.upperBound(keepDT, true));
                    tx.objectStore('log').delete(IDBKeyRange.upperBound(keepTS, true));
                    tx.objectStore('battle').delete(IDBKeyRange.upperBound(keepTS, true));
                });
                return Promise.all([tp, buildBattleDateList()]);
            }
        }
        return null;
    }

    async function showBattleRecords(key) {
        const g_pkTitleStyle = ['alert', 'alert-danger', 'alert-info'];

        let text = '';
        let divtext =
            '<div class="pk-record-frame">' +
              '<div class="pk-record-title {0}" style="padding:0px;margin-bottom:0px;" navigate-key="{5}"><h3>' +
                '<div style="float:left;width:45%;text-align:right;">{1}</div>' +
                '<div style="float:left;width:10%;">{2}</div>' +
                '<div style="text-align:left;">{3}</div>' +
                '<div class="pk-record-delete" style="width:5%;float:right;" title="删除">×</div></h3></div>' +
              '<div class="pk-record-content" style="padding:10px;display:none;">{4}</div></div>';

        let stat = [0, 0, 0];
        let date = Date.parse(`${key} 00:00:00`);
        let range = (isNaN(date) ? null : IDBKeyRange.bound(date, date + (24 * 3600000), false, true));
        await new Promise((resolve) => {
            let date = null, log, r;
            let req = g_pkAssistDB.transaction('battle', 'readonly').objectStore('battle').openCursor(range, 'prev');
            req.onerror = ((e) => { resolve(false); });
            req.onsuccess = ((e) => {
                let cursor = e.target.result;
                if (cursor == null) {
                    if (date != null) {
                        text +=
                            `<div class="pk-record-date-title" navigate-key="${date}">
                              <b>${date}</b>胜 （${r[1]}） 平 （${r[0]}） 负 （${r[2]}） 总 （${r[0] + r[1] + r[2]}） ` +
                                           `胜率 （${(r[0] = r[1] + r[2]) > 0
                                            ? Math.trunc(10000 * r[1] / r[0] + 0.5) / 100 : 'N/A'}%）</div>${log}`;
                    }
                    resolve(true);
                    return;
                }
                let rc = cursor.value;
                if (date != rc.date) {
                    if (date != null) {
                        text +=
                            `<div class="pk-record-date-title" navigate-key="${date}">
                              <b>${date}</b>胜 （${r[1]}） 平 （${r[0]}） 负 （${r[2]}） 总 （${r[0] + r[1] + r[2]}） ` +
                                           `胜率 （${(r[0] = r[1] + r[2]) > 0
                                            ? Math.trunc(10000 * r[1] / r[0] + 0.5) / 100 : 'N/A'}%）</div>${log}`;
                    }
                    date = rc.date;
                    log = '';
                    r = [0, 0, 0];
                }
                let battleInfo = g_battleCodecMap.get(rc.codec)?.decode(rc.log);
                if (battleInfo != null) {
                    log += divtext.format(g_pkTitleStyle[battleInfo.winner],
                                          `${battleInfo.roles[0].kfUser} （Lv.${battleInfo.roles[0].level} ${battleInfo.roles[0].card}）`,
                                          rc.time ?? '--:--:--',
                                          `（${battleInfo.roles[1].card} Lv.${battleInfo.roles[1].level}） ${battleInfo.roles[1].kfUser}`,
                                          battleInfo.battle.innerHTML,
                                          rc.timestamp);
                    r[battleInfo.winner]++;
                    stat[battleInfo.winner]++;
                }
                cursor.continue();
            });
        });

        text += '<div class="pk-record-date-title"><b>关闭</b></div>';
        ctrl_pkRecordList.innerHTML = text;
        ctrl_pkRecordStatistics.innerText = `胜 （${stat[1]}） 平 （${stat[0]}） 负 （${stat[2]}） 总 （${stat[0] + stat[1] + stat[2]}） ` +
                                            `胜率 （${(stat[0] = stat[1] + stat[2]) > 0
                                             ? Math.trunc(10000 * stat[1] / stat[0] + 0.5) / 100 : 'N/A'}%）`;
        ctrl_pkRecordNavigator.setAttribute('navigate-key', (ctrl_pkRecordDate.value = (key ?? '')));

        $(".pk-record-date-title").click(function() {
            let key = $(this).attr("navigate-key");
            if (key == null) {
                ctrl_pkRecordMask.onclick({ target : ctrl_pkRecordMask });
            }
            else if (!(ctrl_pkRecordNavigator.getAttribute('navigate-key')?.length > 0)) {
                showBattleRecords(key);
            }
        });

        $(".pk-record-title").click(function(e) {
            if (e.target.className == 'pk-record-delete') {
                let key = parseInt($(this).attr("navigate-key"));
                let date = TIMESTAMP.get(new Date(key));
                if (confirm(`这将删除“${date.date} ${date.time}”的选定战斗记录项，继续吗？`)) {
                    new Promise((resolve) => {
                        let req = g_pkAssistDB.transaction('battle', 'readwrite').objectStore('battle').delete(key);
                        req.onerror = ((e) => {
                            alert('删除失败，清检查。');
                            console.log(e.target.error);
                            resolve(false);
                        });
                        req.onsuccess = ((e) => { resolve(true); });
                    }).then((result) => {
                        if(result) {
                            $(this).parent().remove();
                            ctrl_pkRecordStatistics.innerText = '需刷新';
                        }
                    });
                }
            }
            else {
                if ($(this).next().css("display") == "none") {
                    $(this).next().css("display", "block");
                }
                else {
                    $(this).next().css("display", "none");
                }
            }
        });

        $(".pk-record-content").dblclick(function() {
            $(this).css("display", "none");
        });

        $('[data-toggle="tooltip"]').tooltip();

        ctrl_pkRecordMask.style.display = 'block';
        ctrl_pkRecordNavigator.style.display = (key == null ? 'none' : 'table');
        ctrl_pkRecordPopup.style.display = 'flex';
        ctrl_pkRecordList.scrollTo(0, 0);
    }

    async function showPvpRecords() {
        let text =
            '<div id="clear-all-log" style="cursor:pointer;background-color:#3280fc;color:#f0f040;text-align:center;">' +
             '<h3 style="padding:10px;">清除全部攻防日志</h3></div>';
        let divtext =
            '<div class="pk-record-frame"><div class="pk-record-title alert-success" navigate-key="{0}">' +
                '<h3><div style="width:35%;padding-left:20%;text-align:left;"><b>{0}</b></div>' +
                    '<div style="width:60%;text-align:left;text-decoration:underline;">' +
                      '<span class="pvp-rec-statistics">攻 （{2}，{3}%）</span>' +
                      '<span class="pvp-rec-statistics">守 （{4}，{5}%）</span>' +
                      '<span class="pvp-rec-statistics">总 （{6}，{7}%）</span></div>' +
                    '<div class="pk-record-delete" style="width:5%;" title="删除">×</div></h3></div>' +
              '<div class="pk-record-content" style="padding:10px;display:none;">{1}</div></div>';

        let stat = [0, 0, 0];
        await new Promise((resolve) => {
            let req = g_pkAssistDB.transaction('pvp', 'readonly').objectStore('pvp').openCursor(null, 'prev');
            req.onerror = ((e) => { resolve(false); });
            req.onsuccess = ((e) => {
                let cursor = e.target.result;
                if (cursor == null) {
                    resolve(true);
                    return;
                }
                let rc = cursor.value;
                let div = document.createElement('div');
                div.innerHTML = rc.log;
                let atk = [0, 0, 0];
                let def = [0, 0, 0];
                let tot = [0, 0, 0];
                for (let rec of div.children) {
                    let t = rec.children[1]?.firstElementChild?.innerText;
                    let r = rec.children[2]?.firstElementChild?.innerText;
                    let a = (t == '攻' ? atk : t == '守' ? def : tot);
                    a[r = (r == '胜' ? 1 : r == '败' ? 2 : 0)]++;
                    tot[r]++;
                    if (rec.title == rc.date) {
                        stat[r]++;
                    }
                }
                text += divtext.format(rc.date, div.innerHTML,
                                       atk[0] + atk[1] + atk[2], (atk[0] = atk[1] + atk[2]) > 0
                                       ? Math.trunc(10000 * atk[1] / atk[0] + 0.5) / 100 : 'N/A',
                                       def[0] + def[1] + def[2], (def[0] = def[1] + def[2]) > 0
                                       ? Math.trunc(10000 * def[1] / def[0] + 0.5) / 100 : 'N/A',
                                       tot[0] + tot[1] + tot[2], (tot[0] = tot[1] + tot[2]) > 0
                                       ? Math.trunc(10000 * tot[1] / tot[0] + 0.5) / 100 : 'N/A');
                cursor.continue();
            });
        });

        text += '<div class="pk-record-date-title"><b>关闭</b></div>';
        ctrl_pkRecordList.innerHTML = text;
        ctrl_pkRecordStatistics.innerText = `胜 （${stat[1]}） 平 （${stat[0]}） 负 （${stat[2]}） 总 （${stat[0] + stat[1] + stat[2]}） ` +
                                            `胜率 （${(stat[0] = stat[1] + stat[2]) > 0
                                             ? Math.trunc(10000 * stat[1] / stat[0] + 0.5) / 100 : 'N/A'}%）`;

        $("#clear-all-log").click(function() {
            if (confirm('这将永久删除所有攻防日志，继续吗？')) {
                new Promise((resolve) => {
                    let req = g_pkAssistDB.transaction('pvp', 'readwrite').objectStore('pvp').clear();
                    req.onerror = ((e) => {
                        alert('删除失败，清检查。');
                        console.log(e.target.error);
                        resolve(false);
                    });
                    req.onsuccess = ((e) => { resolve(true); });
                }).then((result) => {
                    if(result) {
                        showPvpRecords();
                    }
                });
            }
        });

        $(".pk-record-date-title").click(function() {
            ctrl_pkRecordMask.onclick({ target : ctrl_pkRecordMask });
        });

        function showPvpRecord(div, type) {
            for (let r of div.children) {
                r.style.display = (r.children[1].firstElementChild.innerText == type || type == '总' ? 'block' : 'none');
            }
        }
        $(".pk-record-title").click(function(e) {
            if (e.target.className == 'pk-record-delete') {
                let key = $(this).attr("navigate-key");
                if (confirm(`这将删除“${key}”全部攻防日志，继续吗？`)) {
                    new Promise((resolve) => {
                        let req = g_pkAssistDB.transaction('pvp', 'readwrite').objectStore('pvp').delete(key);
                        req.onerror = ((e) => {
                            alert('删除失败，清检查。');
                            console.log(e.target.error);
                            resolve(false);
                        });
                        req.onsuccess = ((e) => { resolve(true); });
                    }).then((result) => {
                        if(result) {
                            $(this).parent().remove();
                            ctrl_pkRecordStatistics.innerText = '需刷新';
                        }
                    });
                }
            }
            else {
                if ($(this).next().css("display") == "none") {
                    if (e.target.className == 'pvp-rec-statistics') {
                        showPvpRecord($(this).next()[0], e.target.innerText.substring(0, 1));
                    }
                    $(this).next().css("display", "block");
                }
                else {
                    if (e.target.className == 'pvp-rec-statistics') {
                        showPvpRecord($(this).next()[0], e.target.innerText.substring(0, 1));
                    }
                    else {
                        $(this).next().css("display", "none");
                    }
                }
            }
        });

        $(".pk-record-content").dblclick(function() {
            $(this).css("display", "none");
        });

        ctrl_pkRecordMask.style.display = 'block';
        ctrl_pkRecordNavigator.style.display = 'none';
        ctrl_pkRecordPopup.style.display = 'flex';
        ctrl_pkRecordList.scrollTo(0, 0);
    }

    async function showLogRecords() {
        let text =
            '<div id="clear-all-log" style="cursor:pointer;background-color:#3280fc;color:#f0f040;text-align:center;">' +
             '<h3 style="padding:10px;">清除全部挂机日志</h3></div>';
        let divtext =
            '<div class="pk-record-frame"><div class="pk-record-title alert-success" navigate-key="{0}">' +
              '<h3>{0} （{1}）<div class="pk-record-delete" style="width:5%;float:right;" title="删除">×</div></h3></div>' +
              '<div class="pk-record-content" style="padding:10px;display:none;">{2}</div></div>';

        await new Promise((resolve) => {
            let date = null, cnt = 0, log, alt;
            let req = g_pkAssistDB.transaction('log', 'readonly').objectStore('log').openCursor(null, 'prev');
            req.onerror = ((e) => { resolve(false); });
            req.onsuccess = ((e) => {
                let cursor = e.target.result;
                if (cursor == null) {
                    if (date != null) {
                        text += divtext.format(date, cnt, log);
                    }
                    resolve(true);
                    return;
                }
                let rc = cursor.value;
                if (date != rc.date) {
                    if (date != null) {
                        text += divtext.format(date, cnt, log);
                    }
                    date = rc.date;
                    cnt = 0;
                    log = '';
                    alt = false;
                }
                cnt++;
                log +=
                    `<div style="padding:5px;background-color:${alt = !alt ? '#f0f0f0' : ''};"><b style="color:purple;">` +
                    `【${rc.date} ${rc.time}】：</b><div style="padding:0px 0px 0px 15px;color:darkblue;">${rc.log}</div></div>`;
                cursor.continue();
            });
        });

        text += '<div class="pk-record-date-title"><b>关闭</b></div>';
        ctrl_pkRecordList.innerHTML = text;
        ctrl_pkRecordStatistics.innerText = '';

        $("#clear-all-log").click(function() {
            if (confirm('这将永久删除所有挂机日志，继续吗？')) {
                new Promise((resolve) => {
                    let req = g_pkAssistDB.transaction('log', 'readwrite').objectStore('log').clear();
                    req.onerror = ((e) => {
                        alert('删除失败，清检查。');
                        console.log(e.target.error);
                        resolve(false);
                    });
                    req.onsuccess = ((e) => { resolve(true); });
                }).then((result) => {
                    if(result) {
                        showLogRecords();
                    }
                });
            }
        });

        $(".pk-record-date-title").click(function() {
            ctrl_pkRecordMask.onclick({ target : ctrl_pkRecordMask });
        });

        $(".pk-record-title").click(function(e) {
            if (e.target.className == 'pk-record-delete') {
                let key = $(this).attr("navigate-key");
                if (confirm(`这将删除“${key}”全部挂机日志，继续吗？`)) {
                    let date = Date.parse(`${key} 00:00:00`);
                    let range = IDBKeyRange.bound(date, date + (24 * 3600000), false, true);
                    new Promise((resolve) => {
                        let req = g_pkAssistDB.transaction('log', 'readwrite').objectStore('log').delete(range);
                        req.onerror = ((e) => {
                            alert('删除失败，清检查。');
                            console.log(e.target.error);
                            resolve(false);
                        });
                        req.onsuccess = ((e) => { resolve(true); });
                    }).then((result) => {
                        if(result) {
                            $(this).parent().remove();
                        }
                    });
                }
            }
            else {
                if ($(this).next().css("display") == "none") {
                    $(this).next().css("display", "block");
                }
                else {
                    $(this).next().css("display", "none");
                }
            }
        });

        $(".pk-record-content").dblclick(function() {
            $(this).css("display", "none");
        });

        ctrl_pkRecordMask.style.display = 'block';
        ctrl_pkRecordNavigator.style.display = 'none';
        ctrl_pkRecordPopup.style.display = 'flex';
        ctrl_pkRecordList.scrollTo(0, 0);
    }

    function doXport() {
        function readFile() {
            let files = document.getElementById("json-file-input");
            return new Promise((resolve) => {
                if (files.files.length == 0) {
                    resolve('');
                    return;
                }
                let reader = new FileReader();
                reader.onerror = ((e) => {
                    resolve('');
                });
                reader.onloadend = ((e) => {
                    resolve(e.target.result);
                });
                reader.readAsText(files.files[0]);
            });
        }

        let mainContent =
            '<div style="padding:20px;font-size:1.2em;"><label for="json-file-input">选择导入文件（导出时将被忽略）：</label><hr>' +
                '<input type="file" id="json-file-input" accept=".json, .txt" /><hr>' +
                '<input type="checkbox" id="include-config" style="margin-right:5px;" checked />' +
                '<label for="include-config">配置数据</label><div style="float:right;">' +
                '<input type="checkbox" id="include-logs" style="margin-right:5px;" checked />' +
                '<label for="include-logs">日志记录</label></div></div>';

        POPUP.initialize();
        POPUP.setContent('导入/导出助手数据', mainContent);

        let config = POPUP.querySelector('#include-config');
        let logs = POPUP.querySelector('#include-logs');

        POPUP.addButton(
            '导入',
            80,
            (async () => {
                POPUP.showProgressMessage('导入中，请稍候...');
                let success;
                let json = await readFile();
                if (success = (json?.length > 0)) {
                    g_pkAssistDB.close();
                    success = await importData(g_kfUser, json, config.checked, logs.checked);
                }
                if (!success) {
                    alert('导入失败，请检查导入选项及导入文件内容。');
                }
                POPUP.close(true, true);
                window.location.reload();
            }),
            false);
        POPUP.addButton(
            '导出',
            80,
            (async () => {
                let json = await exportData(g_kfUser, config.checked, logs.checked);
                if (json?.length > 0) {
                    let a = document.createElement("a");
                    a.href = URL.createObjectURL(new Blob([json], { type: "application/json" }));
                    a.download =
                        `${g_kfUser}${config.checked ? '_config' : ''}${logs.checked ? '_logs' : ''}` +
                        `_${TIMESTAMP.get().date.replaceAll('-', '')}_${TIMESTAMP.get().time.replaceAll(':', '')}` +
                        `_pkAssist_data.json`;
                    a.click();
                }
                else {
                    alert('未导出任何数据。');
                }
                POPUP.close(true, true);
            }),
            false);
        POPUP.addCloseButton(80);
        POPUP.setContentSize(210, 420, true);
        POPUP.showModal(true);
    }

    const g_taskTolerance = 600000;
    let ctrl_pkAddinPanel = null;
    let ctrl_pkRecordMask = null;
    let ctrl_pkRecordPopup = null;
    let ctrl_pkRecordClose = null;
    let ctrl_pkRecordStatistics = null;
    let ctrl_pkRecordNavigator = null;
    let ctrl_pkRecordDate = null;
    let ctrl_pkRecordCollapse = null;
    let ctrl_pkRecordList = null;
    let ctrl_toggleRecordPanel = null;
    let ctrl_enableSchedule = null;
    let ctrl_setupSchedule = null;
    let ctrl_dailySchedule = null;
    let ctrl_refreshCount = null;
    let ctrl_refreshCountdownLabel = null;
    let ctrl_refreshCountdown = null;
    function executeAssistant() {
        readConfig();

        let timer = setInterval(async () => {
            if ((ctrl_pkAddinPanel = document.getElementById('pk-addin-panel'))?.getAttribute('pk-text-hooked') == 'true') {
                clearInterval(timer);

                let pkRecordDiv = document.createElement('div');
                pkRecordDiv.innerHTML =
                    `<style>
                        .pk-record-mask {
                            display: none;
                            position: fixed;
                            overflow: hidden;
                            width: 100vw;
                            height: 100vh;
                            background-color: rgba(0, 0, 0, 0.4);
                            left: 0;
                            top: 0;
                            z-index: 99;
                            justify-content: center;
                            align-items: center;
                        }
                        .pk-record-popup {
                            display: none;
                            position: fixed;
                            width: 99%;
                            height: 99%;
                            background-color: white;
                            margin: auto;
                            left: 0;
                            right: 0;
                            top: 0;
                            bottom: 0;
                            border: 1px solid #000099;
                            border-radius: 5px;
                            box-sizing: border-box;
                            z-index: 199;
                            flex-direction: column;
                        }
                        .pk-record-popup-title {
                            display: table;
                            width: 100%;
                            height: 45px;
                            color: #f0f040;
                            background-color: #3280fc;
                            font-size: 18px;
                            padding: 5px 10px;
                        }
                        .pk-record-list {
                            display: block;
                            width: 100%;
                            box-sizing: border-box;
                            padding: 0px 10px;
                            overflow: auto;
                        }
                        .pk-record-frame {
                            margin-top: 5px;
                            padding: 0px;
                            border: 1px solid darkgrey;
                        }
                        .pk-record-date-title {
                            margin-top: 5px;
                            padding: 3px;
                            background-color:#202020;
                            color: #e0e0e0;
                            text-align:center;
                            cursor: pointer;
                        }
                        .pk-record-date-title > b {
                            padding-right: 30px;
                            display: inline-block;
                            color: #f0f040;
                            font-size: 18px;
                        }
                        .pk-record-title {
                            cursor: pointer;
                            height: 30px;
                            text-align: center;
                        }
                        .pk-record-title > h3 {
                            line-height: 200%;
                            margin: 0px;
                        }
                        .pk-record-title > h3 > div {
                            diaplay: table;
                            float:left;
                        }
                        .pk-record-title > h3 > div.pk-record-delete:hover {
                            background-color: #c0e0c0;
                        }
                        .pk-record-title > h3 > div > span {
                            display: inline-block;
                            width: 25%;
                            color: #606060;
                            font-size: 0.9em;
                            padding-left: 20px;
                            text-decoration: underline;
                        }
                        .pk-record-title > h3 > div > span:hover {
                            background-color: #c0e0c0;
                        }
                        .btn-bold-mr5 {
                            font-weight: bold;
                            margin-right: 5px;
                        }
                     </style>
                     <div class="pk-record-mask" id="pk-record-mask"></div>
                     <div class="pk-record-popup" id="pk-record-popup">
                       <div class="pk-record-popup-title">
                         <div style="display:table-cell;float:left;"><i class="icon icon-remove-sign"
                              id="record-list-close" style="cursor:pointer;" title="关闭"></i>
                           <b id="record-list-statistics" style="display:inline-block;color:#e0e0e0;
                                  margin-top:3px;margin-left:30px;font-size:18px;"></b></div>
                         <div id="record-list-collapse" style="display:table-cell;padding-top:3px;float:right;text-align:right;">
                           <i class="icon icon-chevron-sign-up" id="record-list-collapse-full"
                              style="cursor:pointer;margin-left:30px;" title="折叠全部展开内容"></i>
                         </div>
                         <div id="record-list-navigator" style="display:table-cell;float:right;text-align:right;">
                           <input type="date" id="record-list-date" title="查看战斗日志日期"
                                  style="width:120px;font-size:15px;margin-top:2px;margin-right:30px;background-color:#e0e0e0;" />
                           <i class="icon icon-step-backward" id="record-list-begin" style="cursor:pointer;margin-right:10px;" title="最早"></i>
                           <i class="icon icon-backward" id="record-list-previous" style="cursor:pointer;margin-right:10px;" title="前一批"></i>
                           <i class="icon icon-forward" id="record-list-next" style="cursor:pointer;margin-right:10px;" title="下一批"></i>
                           <i class="icon icon-step-forward" id="record-list-end" style="cursor:pointer;margin-right:10px;" title="最近"></i>
                           <b id="record-list-all" style="display:inline-block;cursor:pointer;margin-left:20px;">显示全部</b>
                         </div>
                       </div>
                       <div class="pk-record-list" id="pk-record-list"></div>
                     </div>`;
                // icon-collapse-full
                // icon-chevron-sign-up

                ctrl_pkRecordMask = pkRecordDiv.querySelector('#pk-record-mask');
                ctrl_pkRecordMask.onclick = ((e) => {
                    if (e.target.id == 'pk-record-mask') {
                        ctrl_pkRecordMask.style.display = 'none';
                        ctrl_pkRecordPopup.style.display = 'none';
                        ctrl_pkRecordList.innerHTML = '';
                    }
                });

                ctrl_pkRecordPopup = pkRecordDiv.querySelector('#pk-record-popup');
                ctrl_pkRecordClose = pkRecordDiv.querySelector('#record-list-close');
                ctrl_pkRecordClose.onclick = (() => {
                    ctrl_pkRecordMask.onclick({ target : ctrl_pkRecordMask });
                });
                ctrl_pkRecordStatistics = pkRecordDiv.querySelector('#record-list-statistics');

                ctrl_pkRecordNavigator = pkRecordDiv.querySelector('#record-list-navigator');
                ctrl_pkRecordNavigator.onclick = ((e) => {
                    let key = ctrl_pkRecordNavigator.getAttribute('navigate-key');
                    if (g_battleDateList.length > 0 && !isNaN(Date.parse(key))) {
                        switch(e?.target?.id) {
                            case 'record-list-begin': {
                                if (key != g_battleDateList[g_battleDateList.length - 1]) {
                                    showBattleRecords(g_battleDateList[g_battleDateList.length - 1]);
                                }
                                break;
                            }
                            case 'record-list-previous': {
                                let ik = g_assistantInterface.util.search(g_battleDateList, key, DateComparer);
                                if (ik < 0) {
                                    ik = -1;
                                }
                                if (ik < g_battleDateList.length - 1) {
                                    showBattleRecords(g_battleDateList[ik + 1]);
                                }
                                break;
                            }
                            case 'record-list-next': {
                                let ik = g_assistantInterface.util.search(g_battleDateList, key, DateComparer);
                                if (ik < 0) {
                                    ik = 1;
                                }
                                if (ik > 0) {
                                    showBattleRecords(g_battleDateList[ik - 1]);
                                }
                                break;
                            }
                            case 'record-list-end': {
                                if (key != g_battleDateList[0]) {
                                    showBattleRecords(g_battleDateList[0]);
                                }
                                break;
                            }
                            case 'record-list-all': {
                                ctrl_pkRecordNavigator.style.display = 'none';
                                ctrl_pkRecordList.innerHTML = '<div class="pk-record-date-title"><b>读取中，请稍候...</b></div>';
                                ctrl_pkRecordStatistics.innerText = '请稍候...';
                                setTimeout(showBattleRecords, 100, null);
                                break;
                            }
                        }
                    }
                });

                ctrl_pkRecordDate = ctrl_pkRecordNavigator.querySelector('#record-list-date');
                ctrl_pkRecordDate.onchange = (() => { showBattleRecords(ctrl_pkRecordDate.value); });

                ctrl_pkRecordCollapse = pkRecordDiv.querySelector('#record-list-collapse-full');
                ctrl_pkRecordCollapse.onclick = (() => {
                    pkRecordDiv.querySelectorAll('div.pk-record-content')?.forEach((div) => {
                        div.style.display = 'none';
                    });
                });

                ctrl_pkRecordList = pkRecordDiv.querySelector('#pk-record-list');

                let pkAssistDiv = document.createElement('div');
                pkAssistDiv.className = 'row';
                pkAssistDiv.innerHTML =
                    `<div class="panel panel-info" style="width:100%;">
                     <div class="panel-heading" style="width:100%;display:table;border:none;">
                     <div id="record-panel" style="margin-top:3px;float:left;">` +
                      `<button type="button" class="btn btn-bold-mr5" id="load-pk-record">战斗</button>` +
                      `<button type="button" class="btn btn-bold-mr5" id="load-pvp-record">攻防</button>` +
                      `<button type="button" class="btn btn-bold-mr5" id="load-log-record">挂机</button>` +
                      `<button type="button" class="btn btn-bold-mr5" id="Xport-data" style="margin-right:15px;">导入/导出</button>` +
                      `日志默认保留 <input type="text" id="pk-record-live-duration" style="width:30px;"
                                         title="日志记录默认保留天数，修改后重新刷新页面生效"
                                         value="${g_config.recordLiveDuration}"
                                         oninput="value=value.replace(/[\\D]/g,'');" /> 天` +
                      `<button type="button" class="btn btn-bold-mr5" id="delete-pk-record" style="margin-left:15px;"
                               title="删除给定时间以前的日志以释放存储空间及加快加载速度">删除</button>` +
                      `<input type="text" id="delete-pk-record-before" style="width:30px;"
                              title="欲保留的记录天数" value="${Math.ceil(g_config.recordLiveDuration / 2)}"
                              oninput="value=value.replace(/[\\D]/g,'');" /> 天以前的日志</div>
                     <div id="toggle-record-panel" title="折叠日志面板"
                          style="padding-left:10px;padding-top:3px;margin-top:5px;margin-left:10px;
                                 border-left:3px groove cyan;float:left;cursor:pointer;">
                       <i class="icon icon-chevron-sign-left"></i></div>
                     <div style="margin-top:4px;text-align:right;float:right;">` +
                      `<input type="checkbox" id="enable-schedule" />
                       <a href="###" id="setup-schedule" style="margin-left:3px;text-decoration:underline;">任务排程</a>
                       <a href="###" id="daily-schedule" style="margin-left:3px;text-decoration:underline;">今日任务</a>
                       <span style="margin-left:15px;text-decoration:underline;">
                       <a href="###" id="refresh-countdown-label" title="刷新周期：\n${formatAutoRefreshPeriod('\n')}">禁止自动刷新</a>：` +
                      `<a href="###" id="refresh-countdown" style="color:maroon;" title="立即刷新">00:00:00</a></span>` +
                      `<span style="margin-left:15px;">刷新 / 记录 / 错误：</span><span id="refresh-count"
                             style="color:blue;">0 / 0 / 0</span></div></div></div>`;

                ctrl_toggleRecordPanel = pkAssistDiv.querySelector('#toggle-record-panel');
                ctrl_toggleRecordPanel.onclick = (() => {
                    g_config.showRecordPanel = !g_config.showRecordPanel;
                    saveConfig();
                    initializeRecordPanel();
                });
                function initializeRecordPanel() {
                    if (g_config.showRecordPanel) {
                        ctrl_toggleRecordPanel.firstElementChild.className = 'icon icon-chevron-sign-left';
                        ctrl_toggleRecordPanel.title = "折叠日志面板";
                        ctrl_toggleRecordPanel.previousElementSibling.style.display = 'block';
                    }
                    else {
                        ctrl_toggleRecordPanel.firstElementChild.className = 'icon icon-chevron-sign-right';
                        ctrl_toggleRecordPanel.title = "展开日志面板";
                        ctrl_toggleRecordPanel.previousElementSibling.style.display = 'none';
                    }
                }
                initializeRecordPanel();

                pkAssistDiv.querySelector('#load-pk-record').onclick = (() => { showBattleRecords(TIMESTAMP.get().date); });
                pkAssistDiv.querySelector('#load-log-record').onclick = (() => { showLogRecords(); });
                pkAssistDiv.querySelector('#load-pvp-record').onclick = (() => { showPvpRecords(); });
                pkAssistDiv.querySelector('#delete-pk-record').onclick = (() => {
                    deleteRecords(pkAssistDiv.querySelector('#delete-pk-record-before').value);
                });
                pkAssistDiv.querySelector('#pk-record-live-duration').onchange = ((e) => {
                    if(isNaN(g_config.recordLiveDuration = parseInt(e.target.value))) {
                        e.target.value = (g_config.recordLiveDuration = g_defaultRecordLiveDuration).toString();
                    }
                    saveConfig();
                });
                pkAssistDiv.querySelector('#Xport-data').onclick = (() => {
                    doXport();
                });

                function inputSchedule(scheduling) {
                    function saveSchedule(tasks, scheduling) {
                        if (scheduling) {
                            g_config.scheduling.tasks = tasks;
                            ctrl_dailySchedule.title = formatScheduleList(g_config.scheduling.tasks);
                        }
                        else {
                            g_config.scheduleList = tasks;
                            ctrl_setupSchedule.title = formatScheduleList(tasks);
                            if (confirm('任务排程模板已修改，重新生成今日任务排程吗？\n若需保持今日排程请点击“取消”按钮。')) {
                                g_config.scheduling = null;
                            }
                        }
                        if (!confirmNextTask()) {
                            g_config.scheduleEnabled = false;
                        }
                        saveConfig();
                        doRefresh(0);
                    }

                    getNextTask(true);
                    let tasks = (scheduling && g_config.scheduling?.tasks?.length > 0 ? g_config.scheduling.tasks : g_config.scheduleList);
                    modifyScheduleList(scheduling ? '今日任务' : '任务排程', tasks, saveSchedule, scheduling);
                }
                ctrl_enableSchedule = pkAssistDiv.querySelector('#enable-schedule');
                ctrl_enableSchedule.checked = g_config.scheduleEnabled;
                ctrl_enableSchedule.onchange = (() => {
                    g_config.scheduleEnabled = ctrl_enableSchedule.checked;
                    if (!confirmNextTask()) {
                        g_config.scheduleEnabled = false;
                    }
                    saveConfig();
                    doRefresh(0);
                });

                ctrl_setupSchedule = pkAssistDiv.querySelector('#setup-schedule');
                ctrl_setupSchedule.onclick = (() => {
                    inputSchedule(false);
                });
                ctrl_setupSchedule.title = formatScheduleList(g_config.scheduleList);

                ctrl_dailySchedule = pkAssistDiv.querySelector('#daily-schedule');
                ctrl_dailySchedule.onclick = (() => {
                    inputSchedule(true);
                });
                ctrl_dailySchedule.title = formatScheduleList(g_config.scheduling?.tasks);

                let r = (getAutoRefreshPeriod() > 0);
                ctrl_refreshCountdownLabel = pkAssistDiv.querySelector('#refresh-countdown-label');
                ctrl_refreshCountdownLabel.innerText = (r ? '距离下次刷新' : '禁止自动刷新');
                ctrl_refreshCountdownLabel.style.fontWeight = (r ? '' : 'bold');
                ctrl_refreshCountdownLabel.style.color = (r ? '' : 'maroon');
                ctrl_refreshCountdownLabel.onclick = (() => {
                    let rps = formatAutoRefreshPeriod();
                    setRefreshPeriod(rps?.indexOf('-') >= 0 ? g_defaultAutoRefreshPeriod : rps);
                });
                ctrl_refreshCountdown = pkAssistDiv.querySelector('#refresh-countdown');
                ctrl_refreshCountdown.onclick = (() => { doRefresh(0); });

                ctrl_refreshCount = pkAssistDiv.querySelector('#refresh-count');

                ctrl_pkAddinPanel.parentElement.parentElement.parentElement.insertBefore(
                    pkAssistDiv,
                    ctrl_pkAddinPanel.parentElement.parentElement);

                document.body.appendChild(pkRecordDiv);

                await deleteRecords(null, true);
                hookPkText();

                confirmNextTask();
                processPkList(true);

                (new MutationObserver((mList) => {
                    if (g_refreshFailure || g_ajaxFailure) {
                        processPkList(false);
                    }
                    else {
                        for (let e of mList) {
                            if (e.addedNodes?.length > 0) {
                                processPkList(false);
                                break;
                            }
                        }
                    }
                })).observe(g_pkList, { childList : true });

                $(document).ajaxComplete((e, r) => {
                    if (g_login && r.status != 200) {
                        if (!g_ajaxFailure) {
                            addLog('战斗页面刷新异常', 'red');
                            g_ajaxFailure = true;
                        }
                        g_refreshError++;
                        doRefresh(g_errorRetryPeriod);
                    }
                    else if (g_ajaxFailure) {
                        addLog('战斗页面刷新恢复', 'blue');
                        g_ajaxFailure = false;
                    }
                });
            }
        }, 200);
    }

    executeAssistant();
})();
