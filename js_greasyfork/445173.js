// ==UserScript==
// @name         咕咕镇数据采集
// @license      MIT License
// @namespace    https://greasyfork.org/users/448113
// @version      2.8.2
// @description  咕咕镇数据采集，目前采集已关闭，兼作助手
// @author       paraii
// @match        https://www.guguzhen.com/*
// @match        https://www.momozhen.com/*
// @connect      www.guguzhen.com
// @connect      www.momozhen.com
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/445173/%E5%92%95%E5%92%95%E9%95%87%E6%95%B0%E6%8D%AE%E9%87%87%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/445173/%E5%92%95%E5%92%95%E9%95%87%E6%95%B0%E6%8D%AE%E9%87%87%E9%9B%86.meta.js
// ==/UserScript==
/* eslint-env jquery */
/* jshint esversion:12 */
(async function() {
    'use strict'

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // data Xport
    //
    ////////////////////////////////////////////////////////////////////////////////////////////////////

    if (window.location.hostname.indexOf('momozhen') >= 0 && window.location.pathname.indexOf('lander') >= 0) {
        function generateExportString(kfUser) {
            let userData = [];
            for (let i = 0; i < localStorage.length; i++) {
                let item = localStorage.key(i), value;
                if (item.startsWith(kfUser) && (value = localStorage.getItem(item)) != null) {
                    userData.push(`${item}:${value}`);
                }
            }
            return userData.join('\n');
        }

        let div = document.createElement('div');
        div.innerHTML =
            '<div style="color:white;background-color:black;font-size:1.2em;padding:15px;"><b>用户名</b>' +
                '<input type="text" id="assist-momozhen-kf-user" style="margin-left:10px;" />' +
                '<button id="assist-momozhen-do-export" style="margin-left:15px;">读取配置数据</button></div>' +
            '<div style="height:320px;"><textarea id="assist-momozhen-user-data" readonly="true" ' +
                 'style="height:100%;width:100%;resize:none;"></textarea></div>';
        div.querySelector('#assist-momozhen-do-export').onclick = ((e) => {
            document.getElementById('assist-momozhen-user-data').value =
                generateExportString(document.getElementById('assist-momozhen-kf-user').value);
        });

        document.body.appendChild(div);
        return;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // end of data Xport
    //
    ////////////////////////////////////////////////////////////////////////////////////////////////////

    const g_isInSandBox = true;
    const g_version = GM_info.script.version + (g_isInSandBox ? '' : ' (RP)');
    const g_modiTime = '2025-09-21 01:40:00';

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // common utilities
    //
    ////////////////////////////////////////////////////////////////////////////////////////////////////

    const g_navigatorSelector = 'body > div > div.row > div.panel > div.panel-body > div';
    const g_kfUser = document.querySelector(g_navigatorSelector + ' > button.btn.btn-lg')?.innerText;
    if (!(g_kfUser?.length > 0)) {
        console.log(`数据采集(${g_version}): 咕咕镇版本不匹配或正在测试`);
        return;
    }
    console.log(`数据采集(${g_version}): ${g_kfUser}`);

    const g_exportInterfaceId = 'gugu-assistant-interface-export';
    let g_assistantInterface = null;

    const g_guguzhenLogin = '/fyg_login.php';
    const g_guguzhenHome = '/fyg_index.php';
    const g_guguzhenBeach = '/fyg_beach.php';
    const g_guguzhenPK = '/fyg_pk.php';
    const g_guguzhenEquip = '/fyg_equip.php';
    const g_guguzhenWish = '/fyg_wish.php';
    const g_guguzhenGem = '/fyg_gem.php';
    const g_guguzhenShop = '/fyg_shop.php';
    const g_guguzhenLog = '/fyg_ulog.php';

    const g_showSolutionPanelStorageKey = g_kfUser + '_showSolutionPanel';
    const g_showConfigPanelStorageKey = g_kfUser + '_showConfigPanel';
    const g_indexRallyStorageKey = g_kfUser + '_indexRally';
    const g_keepPkRecordStorageKey = g_kfUser + '_keepPkRecord';
    const g_expandPkRecordStorageKey = g_kfUser + '_expandPkRecord';
    const g_amuletGroupCollectionStorageKey = g_kfUser + '_amulet_Groups';
    const g_equipmentExpandStorageKey = g_kfUser + '_equipment_Expand';
    const g_equipmentStoreExpandStorageKey = g_kfUser + '_equipment_StoreExpand';
    const g_equipmentBGStorageKey = g_kfUser + '_equipment_BG';
    const g_beachForceExpandStorageKey = g_kfUser + '_beach_forceExpand';
    const g_beachBGStorageKey = g_kfUser + '_beach_BG';
    const g_gemConfigStorageKey = g_kfUser + '_gem_Config';
    const g_userDataStorageKeyConfig = [ g_kfUser,
                                         g_showSolutionPanelStorageKey, g_showConfigPanelStorageKey,
                                         g_indexRallyStorageKey, g_keepPkRecordStorageKey, g_expandPkRecordStorageKey,
                                         g_amuletGroupCollectionStorageKey,
                                         g_equipmentExpandStorageKey, g_equipmentStoreExpandStorageKey, g_equipmentBGStorageKey,
                                         g_beachForceExpandStorageKey, g_beachBGStorageKey,
                                         g_gemConfigStorageKey ];

    const g_gameVersionStorageKey = g_kfUser + '_gameVersion';
    const g_forgeHistoryStorageKey = g_kfUser + '_forgeHistory';
    const g_userDataStorageKeyNonConfig = [ g_gameVersionStorageKey, g_forgeHistoryStorageKey ];

    // deprecated
    const g_amuletGroupsStorageKey = g_kfUser + '_amulet_groups';
    const g_autoTaskEnabledStorageKey = g_kfUser + '_autoTaskEnabled';
    const g_autoTaskCheckStoneProgressStorageKey = g_kfUser + '_autoTaskCheckStoneProgress';
    const g_ignoreWishpoolExpirationStorageKey = g_kfUser + '_ignoreWishpoolExpiration';
    const g_stoneProgressEquipTipStorageKey = g_kfUser + '_stone_ProgressEquipTip';
    const g_stoneProgressCardTipStorageKey = g_kfUser + '_stone_ProgressCardTip';
    const g_stoneProgressHaloTipStorageKey = g_kfUser + '_stone_ProgressHaloTip';
    const g_stoneOperationStorageKey = g_kfUser + '_stoneOperation';
    const g_forgeBoxUsageStorageKey = g_kfUser + '_forgeBoxUsageStorageKey';
    const g_beachIgnoreStoreMysEquipStorageKey = g_kfUser + '_beach_ignoreStoreMysEquip';
    const g_userDataStorageKeyExtra = [ g_amuletGroupsStorageKey, g_autoTaskEnabledStorageKey, g_autoTaskCheckStoneProgressStorageKey,
                                        g_ignoreWishpoolExpirationStorageKey, g_stoneProgressEquipTipStorageKey,
                                        g_stoneProgressCardTipStorageKey, g_stoneProgressHaloTipStorageKey,
                                        g_stoneOperationStorageKey, g_forgeBoxUsageStorageKey, g_beachIgnoreStoreMysEquipStorageKey,
                                       'attribute', 'cardName', 'title', 'over', 'halo_max', 'beachcheck', 'dataReward', 'keepcheck' ];
    // deprecated

    function beginCheckGameLog(fnPostProcess, fnParams) {
        let mode = (g_configMap.get('checkGameUpdate')?.value ?? 0);
        if (mode == 2 || (mode == 1 && window.location.pathname == g_guguzhenHome)) {
            let ov = localStorage.getItem(g_gameVersionStorageKey);
            httpRequestBegin(
                GuGuZhenRequest.log,
                '',
                (response) => {
                    let nv = response.responseText?.match(/<h3>(.*?)<\/h3>/)?.[1]?.trim();
                    if (nv?.length > 0) {
                        if (nv != ov) {
                            localStorage.setItem(g_gameVersionStorageKey, nv);
                            ov ??= nv;
                        }
                        if (fnPostProcess != null) {
                            fnPostProcess(ov, nv, fnParams);
                        }
                    }
                });
        }
    }

    const USER_STORAGE_RESERVED_SEPARATORS = /[:;,|=+*%!#$&?<>{}^`"\\\/\[\]\r\n\t\v\s]/;
    const USER_STORAGE_KEY_VALUE_SEPARATOR = ':';

    const g_userMessageContainerId = 'user-message-container';
    const g_userMessageDivId = 'user-message-div';
    const g_userMessageBtnId = 'user-message-btn';
    let g_msgCount = 0;
    function addUserMessage(msgs, noNotification) {
        if (msgs?.length > 0) {
            let div = document.getElementById(g_userMessageDivId);
            if (div == null) {
                function clearNotification() {
                    g_msgCount = 0;
                    let btn = document.getElementById(g_userMessageBtnId);
                    if (btn != null) {
                        btn.style.display = 'none';
                    }
                }

                let div_row = document.createElement('div');
                div_row.className = 'row';
                div_row.id = g_userMessageContainerId;
                document.querySelector('div.row.fyg_lh60.fyg_tr').parentElement.appendChild(div_row);

                let div_pan = document.createElement('div');
                div_pan.className = 'panel panel-info';
                div_row.appendChild(div_pan);

                let div_head = document.createElement('div');
                div_head.className = 'panel-heading';
                div_head.innerText = '页面消息';
                div_pan.appendChild(div_head);

                let div_op = document.createElement('div');
                div_op.style.float = 'right';
                div_head.appendChild(div_op);

                let link_mark = document.createElement('a');
                link_mark.style.marginRight = '20px';
                link_mark.innerText = '〇 已读';
                link_mark.href = '###';
                link_mark.onclick = (() => {
                    clearNotification();
                    let m = document.getElementById(g_userMessageDivId).children;
                    for (let e of m) {
                        let name = e.firstElementChild;
                        if (name.getAttribute('item-readed') != 'true') {
                            name.setAttribute('item-readed', 'true');
                            name.style.color = 'grey';
                            name.innerText = name.innerText.substring(1);
                        }
                    }
                });
                div_op.appendChild(link_mark);

                let link_clear = document.createElement('a');
                link_clear.style.marginRight = '20px';
                link_clear.innerText = '〇 清空';
                link_clear.href = '###';
                link_clear.onclick = (() => {
                    clearNotification();
                    document.getElementById(g_userMessageDivId).innerHTML = '';
                });
                div_op.appendChild(link_clear);

                let link_top = document.createElement('a');
                link_top.innerText = '〇 回到页首 ▲';
                link_top.href = '###';
                link_top.onclick = (() => { document.body.scrollIntoView(true); });
                div_op.appendChild(link_top);

                div = document.createElement('div');
                div.className = 'panel-body';
                div.id = g_userMessageDivId;
                div_pan.appendChild(div);
            }

            if (!noNotification) {
                let btn = document.getElementById(g_userMessageBtnId);
                if (btn == null) {
                    let navBar = document.querySelector(g_navigatorSelector);
                    btn = navBar.firstElementChild.cloneNode(true);
                    btn.id = g_userMessageBtnId;
                    btn.className += ' btn-danger';
                    btn.setAttribute('onclick', `window.location.href='#${g_userMessageContainerId}'`);
                    navBar.appendChild(btn);
                }
                btn.innerText = `查看消息（${g_msgCount += msgs.length}）`;
                btn.style.display = 'inline-block';
            }

            let timeStamp = getTimeStamp();
            timeStamp = timeStamp.date + ' ' + timeStamp.time;
            let alt = (div.firstElementChild?.className?.length > 0);
            msgs.forEach((msg) => {
                let div_info = document.createElement('div');
                div_info.className = (alt = !alt ? 'alt' : '');
                div_info.style.backgroundColor = (alt ? '#f0f0f0' : '');
                div_info.style.padding = '5px';
                div_info.innerHTML =
                    `<b style="color:purple;">★【${timeStamp}】${msg[0]}：</b>` +
                    `<div style="padding:0px 0px 0px 15px;">${msg[1]}</div>`;
                div.insertBefore(div_info, div.firstElementChild);
            });
        }
    }

    function addUserMessageSingle(title, msg, noNotification) {
        addUserMessage([[title, msg]], noNotification)
    }

    function getTimeStamp(date, dateSeparator, timeSeparator) {
        date ??= new Date();
        dateSeparator ??= '-';
        timeSeparator ??= ':';
        return {
            date : `${('000' + date.getFullYear()).slice(-4)}${dateSeparator}${('0' + (date.getMonth() + 1))
                                                  .slice(-2)}${dateSeparator}${('0' + date.getDate()).slice(-2)}`,
            time : `${('0' + date.getHours()).slice(-2)}${timeSeparator}${('0' + date.getMinutes())
                                             .slice(-2)}${timeSeparator}${('0' + date.getSeconds()).slice(-2)}`
        };
    }

    function timeToMS(time) {
        return ((parseInt(time.substring(0, 2)) * 3600 + parseInt(time.substring(3, 5)) * 60 + parseInt(time.substring(6))) * 1000);
    }

    function loadUserConfigData() {
        return JSON.parse(localStorage.getItem(g_kfUser));
    }

    function saveUserConfigData(json) {
        localStorage.setItem(g_kfUser, JSON.stringify(json));
    }

    // generic configuration items represented using checkboxes
    function setupConfigCheckbox(checkbox, configKey, fnPostProcess, fnParams) {
        checkbox.checked = (localStorage.getItem(configKey) == 'true');
        checkbox.onchange = ((e) => {
            localStorage.setItem(configKey, e.currentTarget.checked);
            if (fnPostProcess != null) {
                fnPostProcess(e.currentTarget.checked, fnParams);
            }
        });
        return checkbox.checked;
    }

    // HTTP requests
    const AJAXRequestAPI = {
        auto : 0,
        sandBox : 1,
        jQuery : 2,
        webAPI : 3
    };
    const GuGuZhenRequest = {
        read : { method : 'POST' , url : '/fyg_read.php' },
        update : { method : 'POST' , url : '/fyg_click.php' },
        login : { method : 'GET' , url : g_guguzhenLogin },
        user : { method : 'GET' , url : g_guguzhenHome },
        beach : { method : 'GET' , url : g_guguzhenBeach },
        pk : { method : 'GET' , url : g_guguzhenPK },
        equip : { method : 'GET' , url : g_guguzhenEquip },
        wish : { method : 'GET' , url : g_guguzhenWish },
        gem : { method : 'GET' , url : g_guguzhenGem },
        shop : { method : 'GET' , url : g_guguzhenShop },
        log : { method : 'GET' , url : g_guguzhenLog }
    };
    const MoMoZhenRequest = GuGuZhenRequest;
    const g_postHeader = { 'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8' /*, 'Cookie' : document.cookie*/ };
    let g_ajaxRequestAPI = (g_isInSandBox ? AJAXRequestAPI.sandBox : AJAXRequestAPI.jQuery);
    let g_httpRequests = [];
    function httpRequestBegin(request, queryString, fnLoad, fnError, fnTimeout) {
        let requestObj;
        if (g_isInSandBox && g_ajaxRequestAPI == AJAXRequestAPI.sandBox) {
            requestObj = GM_xmlhttpRequest({
                method: request.method,
                url: window.location.origin + request.url,
                headers: g_postHeader,
                data: queryString,
                onload: fnLoad,
                onerror: fnError,
                ontimeout: fnTimeout
            });
        }
        else if (g_ajaxRequestAPI == AJAXRequestAPI.webAPI) {
            requestObj = new XMLHttpRequest();
            requestObj.onload = (fnLoad != null ? (e) => fnLoad(e.currentTarget) : undefined);
            requestObj.onerror = (fnError != null ? (e) => fnError(e.currentTarget) : undefined);
            requestObj.ontimeout = (fnTimeout != null ? (e) => fnTimeout(e.currentTarget) : undefined);
            requestObj.open(request.method, window.location.origin + request.url);
            for (let name in g_postHeader) {
                requestObj.setRequestHeader(name, g_postHeader[name]);
            }
            requestObj.send(queryString);
        }
        else {
            requestObj = $.ajax({
                type: request.method,
                url: window.location.origin + request.url,
                data: queryString,
                contentType: g_postHeader['Content-Type'],
                global: false,
                success: (fnLoad != null ? (result, status, xhr) => fnLoad(xhr) : undefined),
                error: (fnError != null || fnTimeout != null ? (xhr, status, error) => {
                    if (status == 'error' && fnError != null) {
                        fnError(xhr);
                    }
                    else if (status == 'timeout' && fnTimeout != null) {
                        fnTimeout(xhr);
                    }
                } : undefined)
            });
        }
        g_httpRequests.push(requestObj);
        return requestObj;
    }

    function httpRequestAbortAll() {
        while (g_httpRequests.length > 0) {
            g_httpRequests.pop().abort();
        }
        g_httpRequests = [];
    }

    function httpRequestClearAll() {
        g_httpRequests = [];
    }

    // request data
    const g_httpRequestMap = new Map();
    function getRequestInfoAsync(name, location, forceRefresh) {
        return new Promise((resolve) => {
            if (forceRefresh) {
                g_httpRequestMap.delete(name);
            }
            let r = g_httpRequestMap.get(name);
            if (r != null || !(name?.length > 0) || location == null) {
                resolve(r);
            }
            else {
                beginGetRequestMap(
                    location,
                    async () => {
                        resolve(await getRequestInfoAsync(name, null));
                    });
            }
        });
    }

    function beginGetRequestMap(location, fnPostProcess, fnParams) {
        function searchScript(text) {
            let regex = /<script.+?<\/script>/gms;
            let script;
            while ((script = regex.exec(text))?.length > 0) {
                searchFunction(script[0]);
            }
            if (fnPostProcess != null) {
                fnPostProcess(fnParams);
            }
        }
        function searchFunction(text) {
            let regex = /^\s*function\s+(.+?)\s*\(.+?\{(.+?)((^\s*function)|(<\/script>))/gms;
            let func;
            while ((func = regex.exec(text))?.length == 6 && func[1]?.length > 0 && func[2]?.length > 0) {
                let request = searchRequest(func[2]);
                if (request != null) {
                    g_httpRequestMap.set(func[1], request);
                }
                if (func[3] != '<\/script>') {
                    regex.lastIndex -= func[3].length;
                }
                else {
                    break;
                }
            }
        }
        function searchRequest(text) {
            let method = text.match(/^\s*type\s*:\s*"(.+)"\s*,\s*$/m);
            let url = text.match(/^\s*url\s*:\s*"(.+)"\s*,\s*$/m);
            let data = text.match(/^\s*data\s*:\s*"(.+),\s*$/m);
            if (method?.length > 1 && url?.length > 1 && data?.length > 1) {
                return {
                    request : {
                        method : method[1],
                        url : (url[1].startsWith('/') ? '' : '/') + url[1]
                    },
                    data : data[1].endsWith('"') ? data[1].slice(0, -1) : data[1]
                };
            }
            return null;
        }

        if (location == null) {
            searchScript(document.documentElement.innerHTML);
        }
        else {
            httpRequestBegin(location, '', (response) => { searchScript(response.responseText); });
        }
    }
    beginGetRequestMap();

    // read objects from bag and store with title filter
    function beginReadObjects(bag, store, fnPostProcess, fnParams) {
        if (bag != null || store != null) {
            httpRequestBegin(
                GuGuZhenRequest.read,
                'f=7',
                (response) => {
                    let div = document.createElement('div');
                    div.innerHTML = response.responseText;

                    if (bag != null) {
                        div.querySelectorAll('div.alert-danger > button.btn.fyg_mp3')?.forEach((e) => { bag.push(e); });
                    }
                    if (store != null) {
                        div.querySelectorAll('div.alert-success > button.btn.fyg_mp3')?.forEach((e) => { store.push(e); });
                    }
                    if (fnPostProcess != null) {
                        fnPostProcess(fnParams);
                    }
                });
        }
        else if (fnPostProcess != null) {
            fnPostProcess(fnParams);
        }
    }

    function beginReadObjectIds(bagIds, storeIds, key, ignoreEmptyCell, fnPostProcess, fnParams) {
        function parseObjectIds() {
            if (bagIds != null) {
                objectIdParseNodes(bag, bagIds, key, ignoreEmptyCell);
            }
            if (storeIds != null) {
                objectIdParseNodes(store, storeIds, key, ignoreEmptyCell);
            }
            if (fnPostProcess != null) {
                fnPostProcess(fnParams);
            }
        }

        let bag = (bagIds != null ? [] : null);
        let store = (storeIds != null ? [] : null);
        if (bag != null || store != null) {
            beginReadObjects(bag, store, parseObjectIds, null);
        }
        else if (fnPostProcess != null) {
            fnPostProcess(fnParams);
        }
    }

    function objectIdParseNodes(nodes, ids, key, ignoreEmptyCell) {
        for (let node of nodes) {
            if (node.className?.indexOf('fyg_mp3') >= 0) {
                let click = node.getAttribute('onclick');
                let id = click?.match(/\d+/g);
                if (id?.length > 0) {
                    id = id[click?.match(/omenu/)?.length > 0 ? id.length - 1 : 0];
                    if (id != null) {
                        if (objectMatchTitle(node, key)) {
                            ids.push(parseInt(id));
                            continue;
                        }
                    }
                }
                if (!ignoreEmptyCell) {
                    ids.push(-1);
                }
            }
        }
    }

    function objectMatchTitle(node, key){
        return (!(key?.length > 0) || (node.getAttribute('data-original-title') ?? node.getAttribute('title'))?.indexOf(key) >= 0);
    }

    // we wait the response(s) of the previous batch of request(s) to send another batch of request(s)
    // rather than simply send them all within an inside foreach - which could cause too many requests
    // to server simultaneously, that can be easily treated as D.D.O.S attack and therefor leads server
    // to returns http status 503: Service Temporarily Unavailable
    // * caution * the parameter 'objects' is required been sorted by their indices in ascending order
    const ConcurrentRequestCount = { min : 1 , max : 8 , default : 4 };
    const ObjectMovePath = { bag2store : 0 , store2bag : 1 , store2beach : 2 , beach2store : 3 };
    const ObjectMoveRequestLocation = [
        { location : GuGuZhenRequest.equip , name : 'puti' },
        { location : GuGuZhenRequest.equip , name : 'puto' },
        { location : GuGuZhenRequest.beach , name : 'stdel' },
        { location : GuGuZhenRequest.beach , name : 'stpick' }
    ];
    const ObjectMoveRequest = [ null, null, null, null ];
    let g_maxConcurrentRequests = ConcurrentRequestCount.default;
    async function beginMoveObjects(objects, path, fnProgress, fnPostProcess, fnParams) {
        ObjectMoveRequest[path] ??= await getRequestInfoAsync(ObjectMoveRequestLocation[path].name,
                                                              ObjectMoveRequestLocation[path].location);
        if (ObjectMoveRequest[path] == null) {
            console.log('missing function:', ObjectMoveRequestLocation[path].name);
            addUserMessageSingle('装备护符', '<b style="color:red;">无法获取服务请求格式，可能的原因是咕咕镇版本不匹配或正在测试。</b>');
            if (fnPostProcess != null) {
                fnPostProcess(fnParams);
            }
            return;
        }

        let total = objects?.length;
        let count = 0;
        let moving = 0;
        let error = false;
        let abort = false;
        for (let i = 0; i < g_maxConcurrentRequests && beginMove(); i++);

        function beginMove() {
            if (!abort) {
                let id = objects?.pop();
                if (id >= 0) {
                    moving++;
                    httpRequestBegin(
                        ObjectMoveRequest[path].request,
                        ObjectMoveRequest[path].data.replace('"+id+"', id),
                        (response) => {
                            if (path != ObjectMovePath.store2beach && response.responseText != 'ok') {
                                addUserMessageSingle('装备护符', `<b style="color:red;">装备或护符移动失败。<br>${response.responseText}</b>`);
                                error = true;
                            }
                            else {
                                count++;
                            }
                            moving--;
                            abort = (abort || (fnProgress != null && !fnProgress(total, count, error)));
                            beginMove();
                        });
                    return true;
                }
            }
            if (moving == 0 && fnPostProcess != null) {
                moving = -1;
                fnPostProcess(fnParams);
            }
            return false;
        }
    }

    const g_beach_pirl_verify_data = '85797';
    const g_store_pirl_verify_data = '124';
    const g_objectPirlRequest = g_httpRequestMap.get('pirl');
    function beginPirlObjects(storePirl, objects, fnProgress, fnPostProcess, fnParams) {
        let requestData = g_objectPirlRequest.data.replace('"+pirlyz+"', storePirl ? g_store_pirl_verify_data : g_beach_pirl_verify_data);
        let total = objects?.length;
        let count = 0;
        let perling = 0;
        let error = false;
        let abort = false;
        for (let i = 0; i < g_maxConcurrentRequests && beginPirl(); i++);

        function beginPirl() {
            if (!abort) {
                let id = objects?.pop();
                if (id >= 0) {
                    perling++;
                    httpRequestBegin(
                        g_objectPirlRequest.request,
                        requestData.replace('"+id+"', id),
                        (response) => {
                            if (!/\d+/.test(response.responseText) && response.responseText.indexOf('销毁') < 0) {
                                addUserMessageSingle('销毁护符', `<b style="color:red;">销毁护符失败。<br>${response.responseText}</b>`);
                                error = true;
                            }
                            else {
                                count++;
                            }
                            perling--;
                            abort = (abort || (fnProgress != null && !fnProgress(total, count, error)));
                            beginPirl();
                        });
                    return true;
                }
            }
            if (perling == 0 && fnPostProcess != null) {
                perling = -1;
                fnPostProcess(fnParams);
            }
            return false;
        }
    }

    // roleInfo = { isRoleInfo, meta, level, [ equips ] }
    function beginReadCurrentRole(roleInfo, force, fnPostProcess, fnParams) {
        function parseCarding(carding) {
            if (roleInfo != null) {
                let roleName = carding.querySelector('div.text-info.fyg_f18.fyg_lh60')?.children[0];
                let unique = roleName?.querySelector('#unique');
                let meta = g_roleMap.get((unique ?? roleName)?.innerText);
                if (roleInfo.isRoleInfo = (meta != null)) {
                    roleInfo.meta = meta;
                    roleInfo.level = parseInt(carding.querySelector
                                              ('div.text-info.fyg_f18.fyg_lh60')?.children[1]?.innerText?.match(/\d+/)?.[0] ?? 0);
                    roleInfo.equips = carding.querySelectorAll('div.row > div.fyg_tc > button.btn.fyg_mp3.fyg_tc');
                }
            }
        }
        let div = (force ? null : document.getElementById('carding'));
        if (div == null) {
            httpRequestBegin(
                GuGuZhenRequest.read,
                'f=9',
                (response) => {
                    div = document.createElement('div');
                    div.innerHTML = response.responseText;
                    parseCarding(div);
                    if (fnPostProcess != null) {
                        fnPostProcess(fnParams);
                    }
                });
            return;
        }
        parseCarding(div);
        if (fnPostProcess != null) {
            fnPostProcess(fnParams);
        }
    }

    function readCurrentRoleAsync(force) {
        return new Promise((resolve) => {
            let roleInfo = {};
            beginReadCurrentRole(roleInfo, force, () => { resolve(roleInfo.isRoleInfo ? roleInfo : null); });
        });
    }

    // cardInfo = { isCardInfo, meta, level, quality, haloSlots, growth, [ points ], repointLeft }
    function beginReadCardInfo(card, cardInfo, force, fnPostProcess, fnParams) {
        function parseInfo(infoDiv) {
            if (cardInfo != null) {
                let infos = infoDiv.querySelectorAll('div.col-md-3.alert.alert-primary > span');
                if (cardInfo.isCardInfo = (infos?.length > 0)) {
                    cardInfo.meta = meta;
                    cardInfo.level = parseInt(infos[0]?.innerText?.match(/\d+/)?.[0] ?? 0);
                    cardInfo.quality = parseInt(infos[1]?.innerText?.match(/\d+/)?.[0] ?? 0);
                    cardInfo.haloSlots = parseInt(infos[2]?.innerText?.match(/\d+/)?.[0] ?? 0);
                    cardInfo.growth = parseInt(infos[3]?.innerText?.match(/\d+/)?.[0] ?? 0);
                    cardInfo.points = [];
                    cardInfo.repointLeft = parseInt(infoDiv.querySelector('div.btn-group > span.with-padding.bg-warning')?.innerText ?? 0);
                    infoDiv.querySelectorAll('input.form-control[type="number"]')?.forEach((v) => {
                        cardInfo.points.push(parseInt(v.value));
                    });
                }
            }
        }
        let meta = g_roleMap.get(card);
        if (meta != null) {
            let div = (force ? null : document.getElementById('backpacks'));
            if (div != null && div.querySelector('#sjj1') != null) {
                let name = div.querySelector('div.row > div.col-md-3 > span.text-info.fyg_f24');
                if (g_roleMap.get((name?.querySelector('#unique') ?? name)?.innerText)?.id != meta.id) {
                    div = null;
                }
            }
            if (div == null) {
                httpRequestBegin(
                    GuGuZhenRequest.read,
                    'f=18&zid=' + meta.id,
                    (response) => {
                        div ??= document.createElement('div');
                        div.innerHTML = response.responseText;
                        parseInfo(div);
                        if (fnPostProcess != null) {
                            fnPostProcess(fnParams);
                        }
                    });
                return;
            }
            parseInfo(div);
        }
        if (fnPostProcess != null) {
            fnPostProcess(fnParams);
        }
    }

    function readCardInfoAsync(card, force) {
        return new Promise((resolve) => {
            let cardInfo = {};
            beginReadCardInfo(card, cardInfo, force, () => { resolve(cardInfo.isCardInfo ? cardInfo : null); });
        });
    }

    // haloInfo = { isHaloInfo, points, slots, items =  [ selected1, selected2, ... ] }
    function beginReadHaloInfo(haloInfo, fnPostProcess, fnParams) {
        httpRequestBegin(
            GuGuZhenRequest.read,
            'f=5',
            (response) => {
                if (haloInfo != null) {
                    haloInfo.isHaloInfo = true;
                    let div = document.createElement('div');
                    div.innerHTML = response.responseText;
                    let haloPS = div.querySelector('div.alert.alert-info > h3')?.innerText?.match(/(\d+).+?(\d+)/);
                    if (haloPS?.length == 3) {
                        haloInfo.points = parseInt(haloPS[1]);
                        haloInfo.slots = parseInt(haloPS[2]);
                    }
                    else {
                        haloInfo.points = 0;
                        haloInfo.slots = 0;
                    }
                    haloInfo.items = [];
                    for (let id of (div.querySelector('script')?.innerHTML?.matchAll(/halotfzt2\((\d+)\)/g) ?? [])) {
                        haloInfo.items.push(id[1]);
                    }
                    if (g_halos[0].description == null) {
                        div.querySelectorAll('div.row > div.col-md-3 > div')?.forEach((h) => {
                            let meta = g_haloMap.get(h.getAttribute('onclick')?.match(/\((\d+)\)/)?.[1]);
                            if (meta != null) {
                                meta.description = (h.title ?? h.getAttribute('data-original-title') ?? '');
                            }
                        });
                    }
                }
                if (fnPostProcess != null) {
                    fnPostProcess(fnParams);
                }
            });
    }

    function readHaloInfoAsync() {
        return new Promise((resolve) => {
            let haloInfo = {};
            beginReadHaloInfo(haloInfo, () => { resolve(haloInfo.isHaloInfo ? haloInfo : null); });
        });
    }

    // points = [ extraBagCells, wishPt_0, ..., wishPt_13 ], misc = [ ? yyyy ? , ? mmdd ? ]
    const g_wishpoolLength = 14;
    function beginReadWishpool(points, misc, fnPostProcess, fnParams) {
        httpRequestBegin(
            GuGuZhenRequest.read,
            'f=19',
            (response) => {
                let a = response.responseText.split('#');
                if (a.length >= g_wishpoolLength + 3) {
                    if (misc != null) {
                        misc[0] = a[0];
                        misc[1] = a[1];
                    }
                    if (points != null) {
                        let bagCells = Math.floor((parseInt(a[8]) + parseInt(a[9]) + parseInt(a[10]) + parseInt(a[11])) / 100);
                        bagCells = Math.min(10, Math.max(bagCells, parseInt(a[2])));
                        points[0] = bagCells.toString()
                        for (let i = 1; i <= g_wishpoolLength; i++) {
                            points[i] = a[i + 2];
                        }
                    }
                }
                if (fnPostProcess != null) {
                    fnPostProcess(fnParams);
                }
            });
    }

    function readWishpoolAsync(misc) {
        return new Promise((resolve) => {
            let points = [];
            beginReadWishpool(points, misc, () => { resolve(points.length == (g_wishpoolLength + 1) ? points : null); });
        });
    }

    // giftInfo = { isGiftInfo, peek, gift }
    function beginReadGiftZone(giftInfo, force, fnPostProcess, fnParams) {
        function parseGifts(giftsDiv) {
            if (giftInfo != null) {
                let btns = giftsDiv.querySelectorAll('button.btn.btn-lg.btn-block.fyg_lh60');
                if (giftInfo.isGiftInfo = (btns?.length == 12)) {
                    giftInfo.peek = giftsDiv.lastElementChild?.innerText?.match(/SVIP透视.+?“(.+?)”/)?.[1];
                    let gs = [];
                    for (let btn of btns) {
                        let g = btn.innerText.replaceAll(/\s/g, '');
                        if ((gs[g] = (gs[g] ?? 0) + 1) > 2) {
                            giftInfo.gift = g;
                            break;
                        }
                    }
                }
            }
        }
        let div = (force ? null : document.getElementById('gifsall'));
        if (div == null) {
            httpRequestBegin(
                GuGuZhenRequest.read,
                'f=10',
                (response) => {
                    div = document.createElement('div');
                    div.innerHTML = response.responseText;
                    parseGifts(div);
                    if (fnPostProcess != null) {
                        fnPostProcess(fnParams);
                    }
                });
            return;
        }
        parseGifts(div);
        if (fnPostProcess != null) {
            fnPostProcess(fnParams);
        }
    }

    function readGiftZoneAsync(force) {
        return new Promise((resolve) => {
            let giftInfo = {};
            beginReadGiftZone(giftInfo, force, () => { resolve(giftInfo.isGiftInfo ? giftInfo : null); });
        });
    }

    // userInfo = { isUserInfo, kfUser, grade, level, seashell, bvip, svip }
    function beginReadUserInfo(userInfo, fnPostProcess, fnParams) {
        httpRequestBegin(
            GuGuZhenRequest.user,
            '',
            (response) => {
                if (userInfo != null) {
                    userInfo.isUserInfo = true;
                    userInfo.kfUser = g_kfUser;
                    userInfo.grade = (response.responseText.match(/<p.+?>\s*段位\s*<.+?>\s*(.+?)\s*<.+?<\/p>/)?.[1] ?? '');
                    userInfo.level = parseInt(response.responseText.match(/<p.+?>\s*等级\s*<.+?>\s*(\d+).*?<.+?<\/p>/)?.[1] ?? 0);
                    userInfo.seashell = parseInt(response.responseText.match(/<p.+?>\s*贝壳\s*<.+?>\s*(\d+).*?<.+?<\/p>/)?.[1] ?? 0);
                    userInfo.bvip = ((response.responseText.match(/<p.+?>\s*BVIP\s*<.+?>\s*(.+?)\s*<.+?<\/p>/)?.[1] ?? '').length > 0);
                    userInfo.svip = ((response.responseText.match(/<p.+?>\s*SVIP\s*<.+?>\s*(.+?)\s*<.+?<\/p>/)?.[1] ?? '').length > 0);
                }
                if (fnPostProcess != null) {
                    fnPostProcess(fnParams);
                }
            });
    }

    function readUserInfoAsync() {
        return new Promise((resolve) => {
            let userInfo = {};
            beginReadUserInfo(userInfo, () => { resolve(userInfo.isUserInfo ? userInfo : null); });
        });
    }

    function setupAddinExportInterface() {
        if (g_assistantInterface == null &&
            (g_assistantInterface = document.getElementById(g_exportInterfaceId)?.assistantInterface) == null) {

            g_assistantInterface = {
                config : {
                    get : (id) => g_configMap.get(id)?.value,
                    refresh : readConfig,
                    modify : modifyConfig
                },
                timestamp : {
                    get : getTimeStamp,
                    timeToMS : timeToMS
                },
                pageMessage : {
                    add : addUserMessage,
                    addSingle : addUserMessageSingle
                },
                httpRequest : {
                    GuGuZhenRequest : GuGuZhenRequest,
                    MoMoZhenRequest : MoMoZhenRequest,
                    begin : httpRequestBegin,
                    abortAll : httpRequestAbortAll,
                    clearAll : httpRequestClearAll,
                    getInfoAsync : getRequestInfoAsync
                },
                readInfo : {
                    role : beginReadCurrentRole,
                    card : beginReadCardInfo,
                    halo : beginReadHaloInfo,
                    wish : beginReadWishpool,
                    gift : beginReadGiftZone,
                    user : beginReadUserInfo,
                    async : {
                        role : readCurrentRoleAsync,
                        card : readCardInfoAsync,
                        halo : readHaloInfoAsync,
                        wish : readWishpoolAsync,
                        gift : readGiftZoneAsync,
                        user : readUserInfoAsync
                    }
                },
                equip : {
                    bag : {
                        // TODO
                    },
                    store : {
                        // TODO
                    },
                    amulet : {
                        // TODO
                    },
                    equip : {
                        meta : {
                            list : g_equipments,
                            map : g_equipMap,
                        },
                        // TODO
                    },
                    property : {
                        meta : {
                            list : g_properties,
                            map : g_propertyMap,
                        },
                        read : beginReadProperties,
                        // TODO
                    },
                },
                genericPopup : {
                    informationTipsId : g_genericPopupInformationTipsId,
                    topLineDivClass : g_genericPopupTopLineDivClass,
                    backgroundColor : g_genericPopupBackgroundColor,
                    backgroundColorAlt : g_genericPopupBackgroundColorAlt,
                    initialize : genericPopupInitialize,
                    reset : genericPopupReset,
                    contentContainer : genericPopupGetContentContainer,
                    setContent : genericPopupSetContent,
                    setFixedContent : genericPopupSetFixedContent,
                    addButton : genericPopupAddButton,
                    addCloseButton : genericPopupAddCloseButton,
                    setContentSize : genericPopupSetContentSize,
                    showModal : genericPopupShowModal,
                    close : genericPopupClose,
                    onClickOutside : genericPopupOnClickOutside,
                    querySelector : genericPopupQuerySelector,
                    querySelectorAll : genericPopupQuerySelectorAll,
                    showInformationTips : genericPopupShowInformationTips,
                    showProgressMessage : genericPopupShowProgressMessage,
                    updateProgressMessage : genericPopupUpdateProgressMessage,
                    closeProgressMessage : genericPopupCloseProgressMessage,
                    taskPopup : {
                        setup : genericPopupTaskListPopupSetup,
                        setState : genericPopupTaskSetState,
                        complete : genericPopupTaskComplete,
                        abort : genericPopupTaskAbort,
                        checkCompletion : genericPopupTaskCheckCompletion
                    }
                },
                binding : {
                    SOLUTION_NAME_SEPARATOR : SOLUTION_NAME_SEPARATOR,
                    list : readBindingSolutionList,
                    switchByName : switchSolutionByName
                },
                gift : {
                    open : openGifts
                },
                util : {
                    search : searchElement,
                    insert : insertElement,
                    findNew : findNewObjects
                }
            };

            let exp = document.createElement('div');
            exp.id = g_exportInterfaceId;
            exp.style.display = 'none';
            exp.assistantInterface = g_assistantInterface;
            document.body.appendChild(exp);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // amulet management
    //
    ////////////////////////////////////////////////////////////////////////////////////////////////////

    const AMULET_STORAGE_GROUP_SEPARATOR = '|';
    const AMULET_STORAGE_GROUPNAME_SEPARATOR = '=';
    const AMULET_STORAGE_AMULET_SEPARATOR = ',';
    const AMULET_STORAGE_CODEC_SEPARATOR = '-';
    const AMULET_STORAGE_ITEM_SEPARATOR = ' ';
    const AMULET_STORAGE_ITEM_NV_SEPARATOR = '+';

    const g_amuletDefaultLevelIds = {
        start : 0,
        end : 2,
        稀有 : 0,
        史诗 : 1,
        传奇 : 2
    };
    const g_amuletDefaultTypeIds = {
        start : 2,
        end : 6,
        星铜苹果 : 0,
        蓝银葡萄 : 1,
        紫晶樱桃 : 2
    };
    const g_amuletDefaultLevelNames = [ '稀有', '史诗', '传奇' ];
    const g_amuletDefaultTypeNames = [ '星铜苹果', '蓝银葡萄', '紫晶樱桃' ];
    const g_amuletBuffs = [
        { index : -1 , name : '力量' , type : 0 , maxValue : 80 , unit : '点' , shortMark : 'STR' },
        { index : -1 , name : '敏捷' , type : 0 , maxValue : 80 , unit : '点' , shortMark : 'AGI' },
        { index : -1 , name : '智力' , type : 0 , maxValue : 80 , unit : '点' , shortMark : 'INT' },
        { index : -1 , name : '体魄' , type : 0 , maxValue : 80 , unit : '点' , shortMark : 'VIT' },
        { index : -1 , name : '精神' , type : 0 , maxValue : 80 , unit : '点' , shortMark : 'SPR' },
        { index : -1 , name : '意志' , type : 0 , maxValue : 80 , unit : '点' , shortMark : 'MND' },
        { index : -1 , name : '物理攻击' , type : 1 , maxValue : 10 , unit : '%' , shortMark : 'PATK' },
        { index : -1 , name : '魔法攻击' , type : 1 , maxValue : 10 , unit : '%' , shortMark : 'MATK' },
        { index : -1 , name : '速度' , type : 1 , maxValue : 10 , unit : '%' , shortMark : 'SPD' },
        { index : -1 , name : '生命护盾回复效果' , type : 1 , maxValue : 10 , unit : '%' , shortMark : 'REC' },
        { index : -1 , name : '最大生命值' , type : 1 , maxValue : 10 , unit : '%' , shortMark : 'HP' },
        { index : -1 , name : '最大护盾值' , type : 1 , maxValue : 10 , unit : '%' , shortMark : 'SLD' },
        { index : -1 , name : '固定生命偷取' , type : 2 , maxValue : 10 , unit : '%' , shortMark : 'LCH' },
        { index : -1 , name : '固定反伤' , type : 2 , maxValue : 10 , unit : '%' , shortMark : 'RFL' },
        { index : -1 , name : '固定暴击几率' , type : 2 , maxValue : 10 , unit : '%' , shortMark : 'CRT' },
        { index : -1 , name : '技能几率加成' , type : 2 , maxValue : 10 , unit : '%' , shortMark : 'SKL' },
        { index : -1 , name : '物理防御效果' , type : 2 , maxValue : 10 , unit : '%' , shortMark : 'PDEF' },
        { index : -1 , name : '魔法防御效果' , type : 2 , maxValue : 10 , unit : '%' , shortMark : 'MDEF' },
        { index : -1 , name : '全属性' , type : 2 , maxValue : 10 , unit : '点' , shortMark : 'AAA' },
        { index : -1 , name : '暴击抵抗' , type : 2 , maxValue : 5 , unit : '%' , shortMark : 'CRTR' },
        { index : -1 , name : '技能抵抗' , type : 2 , maxValue : 5 , unit : '%' , shortMark : 'SKLR' }
    ];
    const g_amuletBuffMap = new Map();
    g_amuletBuffs.forEach((item, index) => {
        item.index = index;
        g_amuletBuffMap.set(item.index, item);
        g_amuletBuffMap.set(item.index.toString(), item);
        g_amuletBuffMap.set(item.name, item);
        g_amuletBuffMap.set(item.shortMark, item);
    });

    let g_amuletLevelIds = g_amuletDefaultLevelIds;
    let g_amuletTypeIds = g_amuletDefaultTypeIds;
    let g_amuletLevelNames = g_amuletDefaultLevelNames;
    let g_amuletTypeNames = g_amuletDefaultTypeNames;

    // deprecated
    function amuletLoadTheme(theme) {
        if (theme.dessertlevel?.length > 0 && theme.dessertname?.length > 0) {
            g_amuletLevelNames = theme.dessertlevel;
            g_amuletTypeNames = theme.dessertname;
            g_amuletLevelIds = {
                start : 0,
                end : theme.dessertlevel[0].length
            };
            g_amuletTypeIds = {
                start : theme.dessertlevel[0].length,
                end : theme.dessertlevel[0].length + theme.dessertname[0].length
            };
            for (let i = g_amuletLevelNames.length - 1; i >= 0; i--) {
                g_amuletLevelIds[g_amuletLevelNames[i].slice(0, g_amuletLevelIds.end - g_amuletLevelIds.start)] = i;
            }
            for (let i = g_amuletTypeNames.length - 1; i >= 0; i--) {
                g_amuletTypeIds[g_amuletTypeNames[i].slice(0, g_amuletTypeIds.end - g_amuletTypeIds.start)] = i;
            }
        }
    }
    // deprecated

    function Amulet() {
        this.isAmulet = true;
        this.id = -1;
        this.type = -1;
        this.level = 0;
        this.enhancement = 0;
        this.buffs = [];
        this.buffCode = null;
        this.text = null;

        this.reset = (() => {
            this.id = -1;
            this.type = -1;
            this.level = 0;
            this.enhancement = 0;
            this.buffs = [];
            this.buffCode = null;
            this.text = null;
        });

        this.isValid = (() => {
            return (this.type >= 0 && this.type < g_amuletDefaultTypeNames.length);
        });

        this.addItem = ((item, buff) => {
            if (this.isValid()) {
                let meta = g_amuletBuffMap.get(item);
                if (meta?.type == this.type && (buff = parseInt(buff)) > 0) {
                    this.buffs[meta.index] = (this.buffs[meta.index] ?? 0) + buff;
                    this.buffCode = null;
                    return true;
                }
                else {
                    this.reset();
                }
            }
            return false;
        });

        this.fromCode = ((code) => {
            this.reset();
            let e = code?.split(AMULET_STORAGE_CODEC_SEPARATOR);
            if (e?.length == 4) {
                this.type = parseInt(e[0]);
                this.level = parseInt(e[1]);
                this.enhancement = parseInt(e[2]);
                e[3].split(AMULET_STORAGE_ITEM_SEPARATOR).forEach((item) => {
                    let nv = item.split(AMULET_STORAGE_ITEM_NV_SEPARATOR);
                    this.addItem(nv[0], nv[1]);
                });
                this.getCode();
            }
            return (this.isValid() ? this : null);
        });

        this.fromBuffText = ((text) => {
            this.reset();
            let nb = text?.split(' = ');
            if (nb?.length == 2) {
                this.type = (g_amuletTypeIds[nb[0].slice(g_amuletTypeIds.start, g_amuletTypeIds.end)] ??
                             g_amuletDefaultTypeIds[nb[0].slice(g_amuletDefaultTypeIds.start, g_amuletDefaultTypeIds.end)]);
                this.level = (g_amuletLevelIds[nb[0].slice(g_amuletLevelIds.start, g_amuletLevelIds.end)] ??
                              g_amuletDefaultLevelIds[nb[0].slice(g_amuletDefaultLevelIds.start, g_amuletDefaultLevelIds.end)]);
                this.enhancement = parseInt(nb[0].match(/\d+/)[0]);
                this.buffCode = 0;
                nb[1].replaceAll(/(\+)|( 点)|( %)/g, '').split(',').forEach((buff) => {
                    let nv = buff.trim().split(' ');
                    this.addItem(nv[0], nv[1]);
                });
                if (this.isValid()) {
                    this.text = nb[1];
                    this.getCode();
                    return this;
                }
            }
            this.reset();
            return null;
        });

        this.fromNode = ((node) => {
            if (node?.nodeType == Node.ELEMENT_NODE) {
                if (this.fromBuffText(node.getAttribute('amulate-string')) != null &&
                    !isNaN(this.id = parseInt(node.getAttribute('onclick').match(/\d+/)?.[0]))) {

                    return this;
                }
                else if (node.className?.indexOf('fyg_mp3') >= 0) {
                    this.reset();
                    let typeName = (node.getAttribute('data-original-title') ?? node.getAttribute('title') ?? '');
                    if (!/Lv.+?>\d+</.test(typeName)) {
                        let unique = typeName.match(/<span id='unique' style='display:none'>(.+?)<\/span>/)?.[1];
                        if (unique != null) {
                            typeName = unique;
                        }
                        let id = node.getAttribute('onclick');
                        let content = node.getAttribute('data-content');
                        if (id?.length > 0 && content?.length > 0 &&
                            !isNaN(this.type = (g_amuletTypeIds[typeName.slice(g_amuletTypeIds.start, g_amuletTypeIds.end)] ??
                                                g_amuletDefaultTypeIds[typeName.slice(g_amuletDefaultTypeIds.start,
                                                                                      g_amuletDefaultTypeIds.end)])) &&
                            !isNaN(this.level = (g_amuletLevelIds[typeName.slice(g_amuletLevelIds.start, g_amuletLevelIds.end)] ??
                                                 g_amuletDefaultLevelIds[typeName.slice(g_amuletDefaultLevelIds.start,
                                                                                        g_amuletDefaultLevelIds.end)])) &&
                            !isNaN(this.id = parseInt(id.match(/\d+/)?.[0])) &&
                            !isNaN(this.enhancement = parseInt(node.innerText))) {

                            this.text = '';
                            let attr = null;
                            let regex = /<p.*?>(.+?)<.*?>\+(\d+).*?<\/span><\/p>/g;
                            while ((attr = regex.exec(content))?.length == 3) {
                                let buffMeta = g_amuletBuffMap.get(attr[1]);
                                if (buffMeta != null) {
                                    if (!this.addItem(attr[1], attr[2])) {
                                        break;
                                    }
                                    this.text += `${this.text.length > 0 ? ', ' : ''}${attr[1]} +${attr[2]} ${buffMeta.unit}`;
                                }
                            }
                            if (this.isValid()) {
                                node.setAttribute('amulet-string', this.formatBuffText());
                                this.getCode();
                                return this;
                            }
                        }
                    }
                }
            }
            this.reset();
            return null;
        });

        this.fromAmulet = ((amulet) => {
            this.reset();
            if (amulet?.isValid()) {
                this.id = amulet.id;
                this.type = amulet.type;
                this.level = amulet.level;
                this.enhancement = amulet.enhancement;
                this.buffs = amulet.buffs.slice();
                this.buffCode = amulet.buffCode;
                this.text = amulet.text;
            }
            return (this.isValid() ? this : null);
        });

        this.getCode = (() => {
            if (this.isValid()) {
                if (!(this.buffCode?.length > 0)) {
                    let bc = [];
                    this.buffs.forEach((e, i) => {
                        bc.push(i + AMULET_STORAGE_ITEM_NV_SEPARATOR + e);
                    });
                    this.buffCode = bc.join(AMULET_STORAGE_ITEM_SEPARATOR);
                }
                return (this.type + AMULET_STORAGE_CODEC_SEPARATOR +
                        this.level + AMULET_STORAGE_CODEC_SEPARATOR +
                        this.enhancement + AMULET_STORAGE_CODEC_SEPARATOR +
                        this.buffCode);
            }
            return null;
        });

        this.getBuff = (() => {
            return this.buffs;
        });

        this.getTotalPoints = (() => {
            let points = 0;
            this.buffs?.forEach((e) => {
                points += e;
            });
            return points;
        });

        this.formatName = (() => {
            if (this.isValid()) {
                return `${g_amuletLevelNames[this.level]}${g_amuletTypeNames[this.type]} (+${this.enhancement})`;
            }
            return null;
        });

        this.formatBuff = (() => {
            if (this.isValid()) {
                if (this.text?.length > 0) {
                    return this.text;
                }
                let bi = [];
                this.buffs.forEach((e, i) => {
                    let meta = g_amuletBuffMap.get(i);
                    bi.push(`${meta.name} +${e} ${meta.unit}`);
                });
                this.text = bi.join(', ');
            }
            return this.text;
        });

        this.formatBuffText = (() => {
            if (this.isValid()) {
                return this.formatName() + ' = ' + this.formatBuff();
            }
            return null;
        });

        this.formatShortMark = (() => {
            let text = this.formatBuff()?.replaceAll(/(\+)|( 点)|( %)/g, '');
            if (text?.length > 0) {
                this.buffs.forEach((e, i) => {
                    let meta = g_amuletBuffMap.get(i);
                    text = text.replaceAll(meta.name, meta.exportAlias ?? meta.shortMark);
                });
                return this.formatName() + ' = ' + text;
            }
            return null;
        });

        this.compareMatch = ((other, ascType) => {
            if (!this.isValid()) {
                return 1;
            }
            else if (!other?.isValid()) {
                return -1;
            }

            let delta = other.type - this.type;
            if (delta != 0) {
                return (ascType ? -delta : delta);
            }
            return (other.buffCode > this.buffCode ? -1 : (other.buffCode < this.buffCode ? 1 : 0));
        });

        this.compareTo = ((other, ascType) => {
            if (!this.isValid()) {
                return 1;
            }
            else if (!other?.isValid()) {
                return -1;
            }

            let delta = other.type - this.type;
            if (delta != 0) {
                return (ascType ? -delta : delta);
            }

            let tbuffs = this.formatBuffText().split(' = ')[1].replaceAll(/(\+)|( 点)|( %)/g, '').split(', ');
            let obuffs = other.formatBuffText().split(' = ')[1].replaceAll(/(\+)|( 点)|( %)/g, '').split(', ');
            let bl = Math.min(tbuffs.length, obuffs.length);
            for (let i = 0; i < bl; i++) {
                let tbuff = tbuffs[i].split(' ');
                let obuff = obuffs[i].split(' ');
                if ((delta = (g_amuletBuffMap.get(tbuff[0])?.index ?? g_amuletBuffs.length)
                           - (g_amuletBuffMap.get(obuff[0])?.index ?? g_amuletBuffs.length)) != 0 ||
                    (delta = parseInt(obuff[1]) - parseInt(tbuff[1])) != 0) {
                    return delta;
                }
            }
            if ((delta = obuffs.length - tbuffs.length) != 0 ||
                (delta = other.level - this.level) != 0 ||
                (delta = other.enhancement - this.enhancement) != 0) {
                return delta;
            }

            return 0;
        });
    }

    function AmuletGroup(persistenceString) {
        this.isAmuletGroup = true;
        this.name = null;
        this.items = [];
        this.buffSummary = [];

        this.isValid = (() => {
            return (this.items.length > 0 && amuletIsValidGroupName(this.name));
        });

        this.count = (() => {
            return this.items.length;
        });

        this.clear = (() => {
            this.items = [];
            this.buffSummary = [];
        });

        this.add = ((amulet) => {
            if (amulet?.isValid()) {
                amulet.buffs.forEach((e, i) => {
                    this.buffSummary[i] = (this.buffSummary[i] ?? 0) + e;
                });
                return insertElement(this.items, amulet, (a, b) => a.compareTo(b, true));
            }
            return -1;
        });

        this.remove = ((amulet) => {
            if (this.isValid() && amulet?.isValid()) {
                let i = searchElement(this.items, amulet, (a, b) => a.compareTo(b, true));
                if (i >= 0) {
                    amulet.buffs.forEach((e, i) => {
                        this.buffSummary[i] -= e;
                        if (this.buffSummary[i] <= 0) {
                            delete this.buffSummary[i];
                        }
                    });
                    this.items.splice(i, 1);
                    return true;
                }
            }
            return false;
        });

        this.removeId = ((id) => {
            if (this.isValid()) {
                let i = this.items.findIndex((a) => a.id == id);
                if (i >= 0) {
                    let amulet = this.items[i];
                    amulet.buffs.forEach((e, i) => {
                        this.buffSummary[i] -= e;
                        if (this.buffSummary[i] <= 0) {
                            delete this.buffSummary[i];
                        }
                    });
                    this.items.splice(i, 1);
                    return amulet;
                }
            }
            return null;
        });

        this.merge = ((group) => {
            group?.items?.forEach((am) => { this.add(am); });
            return this;
        });

        this.validate = ((amulets) => {
            if (this.isValid()) {
                let mismatch = 0;
                let al = this.items.length;
                let i = 0;
                if (amulets?.length > 0) {
                    amulets = amulets.slice().sort((a, b) => a.compareMatch(b));
                    for ( ; amulets.length > 0 && i < al; i++) {
                        let mi = searchElement(amulets, this.items[i], (a, b) => a.compareMatch(b));
                        if (mi >= 0) {
                            // remove a matched amulet from the amulet pool can avoid one single amulet matches all
                            // the equivalent objects in the group.
                            // let's say two (or even more) AGI +5 apples in one group is fairly normal, if we just
                            // have only one equivalent apple in the amulet pool and we don't remove it when the
                            // first match happens, then the 2nd apple will get matched later, the consequence would
                            // be we can never find the mismatch which should be encountered at the 2nd apple
                            this.items[i].fromAmulet(amulets[mi]);
                            amulets.splice(mi, 1);
                        }
                        else {
                            mismatch++;
                        }
                    }
                }
                if (i > mismatch) {
                    this.items.sort((a, b) => a.compareTo(b, true));
                }
                if (i < al) {
                    mismatch += (al - i);
                }
                return (mismatch == 0);
            }
            return false;
        });

        this.findIndices = ((amulets) => {
            let indices = [];
            let al;
            if (this.isValid() && (al = amulets?.length) > 0) {
                let items = this.items.slice().sort((a, b) => a.compareMatch(b));
                for (let i = 0; items.length > 0 && i < al; i++) {
                    let mi;
                    if (amulets[i]?.id >= 0 && (mi = searchElement(items, amulets[i], (a, b) => a.compareMatch(b))) >= 0) {
                        // similar to the 'validate', remove the amulet from the search list when we found
                        // a match item in first time to avoid the duplicate founding, e.g. say we need only
                        // one AGI +5 apple in current group and we actually have 10 of AGI +5 apples in store,
                        // if we found the first matched itme in store and record it's index but not remove it
                        // from the temporary searching list, then we will continuously reach this kind of
                        // founding and recording until all those 10 AGI +5 apples are matched and processed,
                        // this obviously ain't the result what we expected
                        indices.push(i);
                        items.splice(mi, 1);
                    }
                }
            }
            return indices;
        });

        this.parse = ((persistenceString) => {
            this.clear();
            if (persistenceString?.length > 0) {
                let elements = persistenceString.split(AMULET_STORAGE_GROUPNAME_SEPARATOR);
                if (elements.length == 2) {
                    let name = elements[0].trim();
                    if (amuletIsValidGroupName(name)) {
                        let items = elements[1].split(AMULET_STORAGE_AMULET_SEPARATOR);
                        let il = items.length;
                        for (let i = 0; i < il; i++) {
                            if (this.add((new Amulet()).fromCode(items[i])) < 0) {
                                this.clear();
                                break;
                            }
                        }
                        if (this.count() > 0) {
                            this.name = name;
                        }
                    }
                }
            }
            return (this.count() > 0);
        });

        this.formatBuffSummary = ((linePrefix, lineSuffix, lineSeparator, ignoreMaxValue) => {
            if (this.isValid()) {
                let str = '';
                let nl = '';
                g_amuletBuffs.forEach((buff) => {
                    let v = this.buffSummary[buff.index];
                    if (v > 0) {
                        str += `${nl}${linePrefix}${buff.name} +${ignoreMaxValue ? v : Math.min(v, buff.maxValue)} ${buff.unit}${lineSuffix}`;
                        nl = lineSeparator;
                    }
                });
                return str;
            }
            return '';
        });

        this.formatBuffShortMark = ((keyValueSeparator, itemSeparator, ignoreMaxValue) => {
            if (this.isValid()) {
                let str = '';
                let sp = '';
                g_amuletBuffs.forEach((buff) => {
                    let v = this.buffSummary[buff.index];
                    if (v > 0) {
                        str += `${sp}${buff.exportAlias ?? buff.shortMark}${keyValueSeparator}` +
                               `${ignoreMaxValue ? v : Math.min(v, buff.maxValue)}`;
                        sp = itemSeparator;
                    }
                });
                return str;
            }
            return '';
        });

        this.formatItems = ((linePrefix, erroeLinePrefix, lineSuffix, errorLineSuffix, lineSeparator) => {
            if (this.isValid()) {
                let str = '';
                let nl = '';
                this.items.forEach((amulet) => {
                    str += `${nl}${amulet.id < 0 ? erroeLinePrefix : linePrefix}${amulet.formatBuffText()}` +
                           `${amulet.id < 0 ? errorLineSuffix : lineSuffix}`;
                    nl = lineSeparator;
                });
                return str;
            }
            return '';
        });

        this.getDisplayStringLineCount = (() => {
            if (this.isValid()) {
                let lines = 0;
                g_amuletBuffs.forEach((buff) => {
                    if (this.buffSummary[buff.index] > 0) {
                        lines++;
                    }
                });
                return lines + this.items.length;
            }
            return 0;
        });

        this.formatPersistenceString = (() => {
            if (this.isValid()) {
                let codes = [];
                this.items.forEach((amulet) => {
                    codes.push(amulet.getCode());
                });
                return `${this.name}${AMULET_STORAGE_GROUPNAME_SEPARATOR}${codes.join(AMULET_STORAGE_AMULET_SEPARATOR)}`;
            }
            return '';
        });

        this.parse(persistenceString);
    }

    function AmuletGroupCollection(persistenceString) {
        this.isAmuletGroupCollection = true;
        this.items = {};
        this.itemCount = 0;

        this.count = (() => {
            return this.itemCount;
        });

        this.contains = ((name) => {
            return this.items.hasOwnProperty(name);
        });

        this.add = ((item) => {
            if (item?.isValid()) {
                if (!this.contains(item.name)) {
                    this.itemCount++;
                }
                this.items[item.name] = item;
                return true;
            }
            return false;
        });

        this.remove = ((name) => {
            if (this.contains(name)) {
                delete this.items[name];
                this.itemCount--;
                return true;
            }
            return false;
        });

        this.clear = (() => {
            this.items = {};
            this.itemCount = 0;
        });

        this.get = ((name) => {
            return this.items[name];
        });

        this.rename = ((oldName, newName) => {
            if (amuletIsValidGroupName(newName)) {
                let group = this.items[oldName];
                if (this.remove(oldName)) {
                    group.name = newName;
                    return this.add(group);
                }
            }
            return false;
        });

        this.toArray = (() => {
            return Object.values(this.items);
        });

        this.toNameArray = (() => {
            return Object.keys(this.items);
        });

        this.parse = ((persistenceString) => {
            this.clear();
            if (persistenceString?.length > 0) {
                let groupStrings = persistenceString.split(AMULET_STORAGE_GROUP_SEPARATOR);
                let gl = groupStrings.length;
                for (let i = 0; i < gl; i++) {
                    if (!this.add(new AmuletGroup(groupStrings[i]))) {
                        this.clear();
                        break;
                    }
                }
            }
            return (this.count() > 0);
        });

        this.formatPersistenceString = (() => {
            let str = '';
            let ns = '';
            for (let name in this.items) {
                str += (ns + this.items[name].formatPersistenceString());
                ns = AMULET_STORAGE_GROUP_SEPARATOR;
            }
            return str;
        });

        this.parse(persistenceString);
    }

    function amuletIsValidGroupName(groupName) {
        return (groupName?.length > 0 && groupName.length < 32 && groupName.search(USER_STORAGE_RESERVED_SEPARATORS) < 0);
    }

    function amuletSaveGroups(groups) {
        if (groups?.count() > 0) {
            localStorage.setItem(g_amuletGroupCollectionStorageKey, groups.formatPersistenceString());
        }
        else {
            localStorage.removeItem(g_amuletGroupCollectionStorageKey);
        }
    }

    function amuletLoadGroups() {
        return new AmuletGroupCollection(localStorage.getItem(g_amuletGroupCollectionStorageKey));
    }

    function amuletClearGroups() {
        localStorage.removeItem(g_amuletGroupCollectionStorageKey);
    }

    function amuletSaveGroup(group) {
        if (group?.isValid()) {
            let groups = amuletLoadGroups();
            if (groups.add(group)) {
                amuletSaveGroups(groups);
            }
        }
    }

    function amuletLoadGroup(groupName) {
        return amuletLoadGroups().get(groupName);
    }

    function amuletDeleteGroup(groupName) {
        let groups = amuletLoadGroups();
        if (groups.remove(groupName)) {
            amuletSaveGroups(groups);
        }
    }

    function amuletCreateGroupFromArray(groupName, amulets) {
        if (amulets?.length > 0 && amuletIsValidGroupName(groupName)) {
            let group = new AmuletGroup(null);
            for (let amulet of amulets) {
                if (group.add(amulet) < 0) {
                    group.clear();
                    break;
                }
            }
            if (group.count() > 0) {
                group.name = groupName;
                return group;
            }
        }
        return null;
    }

    function amuletNodesToArray(nodes, array, key) {
        array ??= [];
        let amulet;
        for (let node of nodes) {
            if (objectMatchTitle(node, key) && (amulet ??= new Amulet()).fromNode(node)?.isValid()) {
                array.push(amulet);
                amulet = null;
            }
        }
        return array;
    }

    function beginReadAmulets(bagAmulets, storeAmulets, key, fnPostProcess, fnParams) {
        function parseAmulets() {
            if (bagAmulets != null) {
                amuletNodesToArray(bag, bagAmulets, key);
            }
            if (storeAmulets != null) {
                amuletNodesToArray(store, storeAmulets, key);
            }
            if (fnPostProcess != null) {
                fnPostProcess(fnParams);
            }
        }

        let bag = (bagAmulets != null ? [] : null);
        let store = (storeAmulets != null ? [] : null);
        if (bag != null || store != null) {
            beginReadObjects(bag, store, parseAmulets, null);
        }
        else if (fnPostProcess != null) {
            fnPostProcess(fnParams);
        }
    }

    function beginLoadAmuletGroupsDiff(groupNames, fnProgress, fnPostProcess, fnParams) {
        let bag, store, loading;
        if (groupNames?.length > 0) {
            loading = [];
            groupNames.forEach((gn) => {
                let g = amuletLoadGroup(gn);
                if (g?.isValid()) {
                    loading = loading.concat(g.items);
                }
            });

            if (loading.length > 0) {
                if (fnProgress != null) {
                    fnProgress(5, 1, loading.length);
                }
                beginReadAmulets(bag = [], store = [], null, beginUnload);
                return;
            }
        }
        if (fnPostProcess != null) {
            fnPostProcess(fnParams);
        }

        function beginUnload() {
            let ids = [];
            if (bag.length > 0) {
                let indices = findNewObjects(bag, loading.sort((a, b) => a.compareMatch(b)), true, true,
                                             (a, b) => a.compareMatch(b)).sort((a, b) => b - a);
                while (indices?.length > 0) {
                    ids.push(bag[indices.pop()].id);
                }
            }
            if (fnProgress != null) {
                fnProgress(5, 2, ids.length);
            }
            beginMoveObjects(
                ids,
                ObjectMovePath.bag2store,
                fnProgress == null ? null : (total, count) => {
                    fnProgress(1, count / total * 0.2 + 0.4, total - count);
                    return true;
                },
                beginLoad,
                ids.length);
        }

        function beginLoad(unloadedCount) {
            if (loading.length > 0 && store.length > 0) {
                if (unloadedCount == 0) {
                    let indices = amuletCreateGroupFromArray('_', loading)?.findIndices(store)?.sort((a, b) => b - a);
                    let ids = [];
                    while (indices?.length > 0) {
                        ids.push(store[indices.pop()].id);
                    }
                    if (fnProgress != null) {
                        fnProgress(5, 4, ids.length);
                    }
                    beginMoveObjects(
                        ids,
                        ObjectMovePath.store2bag,
                        fnProgress == null ? null : (total, count) => {
                            fnProgress(1, count / total * 0.2 + 0.8, total - count);
                            return true;
                        },
                        fnPostProcess,
                        fnParams);
                }
                else {
                    if (fnProgress != null) {
                        fnProgress(5, 3, loading.length);
                    }
                    beginReadAmulets(null, store = [], null, beginLoad, 0);
                }
            }
            else if (fnPostProcess != null) {
                fnPostProcess(fnParams);
            }
        }
    }

    function beginMoveAmulets({ groupName, amulets, path, prog, proc, params }) {
        let indices = amuletLoadGroup(groupName)?.findIndices(amulets)?.sort((a, b) => b - a);
        let ids = [];
        while (indices?.length > 0) {
            ids.push(amulets[indices.pop()].id);
        }
        beginMoveObjects(ids, path, prog, proc, params);
    }

    function beginLoadAmuletGroupFromStore(amulets, groupName, fnProgress, fnPostProcess, fnParams) {
        if (amulets?.length > 0) {
            let store = amuletNodesToArray(amulets);
            beginMoveAmulets({ groupName : groupName, amulets : store, path : ObjectMovePath.store2bag,
                               prog : fnProgress, proc : fnPostProcess, params : fnParams });
        }
        else {
            beginReadAmulets(null, amulets = [], null, beginMoveAmulets,
                             { groupName : groupName, amulets : amulets, path : ObjectMovePath.store2bag,
                               prog : fnProgress, proc : fnPostProcess, params : fnParams });
        }
    }

    function beginUnloadAmuletGroupFromBag(amulets, groupName, fnProgress, fnPostProcess, fnParams) {
        if (amulets?.length > 0) {
            let bag = amuletNodesToArray(amulets);
            beginMoveAmulets({ groupName : groupName, amulets : bag, path : ObjectMovePath.bag2store,
                               prog : fnProgress, proc : fnPostProcess, params : fnParams });
        }
        else {
            beginReadAmulets(amulets, null, null, beginMoveAmulets,
                             { groupName : groupName, amulets : amulets, path : ObjectMovePath.bag2store,
                               prog : fnProgress, proc : fnPostProcess, params : fnParams });
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // property utilities
    //
    ////////////////////////////////////////////////////////////////////////////////////////////////////

    const g_equipmentDefaultLevelName = [ '普通', '幸运', '稀有', '史诗', '传奇' ];
    const g_equipmentLevelStyleClass = [ 'primary', 'info', 'success', 'warning', 'danger' ];
    const g_equipmentLevelPoints = [ 200, 321, 419, 516, 585 ];
    const g_equipmentLevelBGColor = [ '#e0e8e8', '#c0e0ff', '#c0ffc0', '#ffffc0', '#ffd0d0' ];

    const g_properties = [
        { index : -1 , id : 3001 , name : '体能刺激药水' },
        { index : -1 , id : 3002 , name : '锻造材料箱' },
        { index : -1 , id : 3003 , name : '灵魂药水' },
        { index : -1 , id : 3004 , name : '随机装备箱' },
        { index : -1 , id : 3005 , name : '宝石原石' },
        { index : -1 , id : 3301 , name : '蓝锻造石' },
        { index : -1 , id : 3302 , name : '绿锻造石' },
        { index : -1 , id : 3303 , name : '金锻造石' },
        { index : -1 , id : 3309 , name : '苹果核' },
        { index : -1 , id : 3310 , name : '光环天赋石' }
    ];

    const g_propertyMap = new Map();
    g_properties.forEach((item, index) => {
        item.index = index;
        item.alias = item.name;
        g_propertyMap.set(item.id, item);
        g_propertyMap.set(item.id.toString(), item);
        g_propertyMap.set(item.name, item);
    });

    // deprecated
    function propertyLoadTheme(theme) {
        if (theme.itemsname?.length > 0) {
            theme.itemsname.forEach((item, index) => {
                if (!g_propertyMap.has(item) && index < g_properties.length) {
                    g_properties[index].alias = item;
                    g_propertyMap.set(item, g_properties[index]);
                }
            });
        }
    }
    // deprecated

    function propertyInfoParseNode(node) {
        function formatPropertyString(p) {
            return `${p.meta.index},${p.level},${p.amount}`;
        }

        function parsePropertyString(s) {
            let a = s.split(',');
            return {
                isProperty : true,
                meta : g_properties[parseInt(a[0])],
                level : parseInt(a[1]),
                amount : parseInt(a[2])
            };
        }

        if (node?.nodeType == Node.ELEMENT_NODE) {
            let s = node.getAttribute('property-string');
            if (s?.length > 0) {
                return parsePropertyString(s);
            }
            else if (node.className?.split(' ').length >= 2 && node.className.indexOf('fyg_mp3') >= 0) {
                let title = (node.getAttribute('data-original-title') ?? node.getAttribute('title'));
                let unique = title?.match(/<span id='unique' style='display:none'>(.+?)<\/span> x(\d+)/);
                if (unique?.length == 3) {
                    title = unique.slice(-2);
                }
                else if ((title = title?.match(/(.+?) x(\d+)/))?.length == 3){
                    title.splice(0, 1);
                }
                let meta = g_propertyMap.get(title?.[0]?.trim());
                if (meta != null) {
                    let text = node.getAttribute('data-content');
                    let lv = node.getAttribute('data-tip-class');
                    if (text?.length > 0 && lv?.length > 0) {
                        if (meta.discription == null) {
                            meta.discription = text;
                        }
                        let p = {
                            isProperty : true,
                            meta : meta,
                            level : g_equipmentLevelStyleClass.indexOf(lv.substring(lv.indexOf('-') + 1)),
                            amount : parseInt(title[1])
                        };
                        node.setAttribute('property-string', formatPropertyString(p));
                        return p;
                    }
                }
            }
        }
        return null;
    }

    function propertyNodesToInfoArray(nodes, array, key) {
        array ??= [];
        let e;
        for (let i = nodes?.length - 1; i >= 0; i--) {
            if (objectMatchTitle(nodes[i], key) && (e = propertyInfoParseNode(nodes[i])) != null) {
                array.unshift(e);
            }
        }
        return array;
    }

    function propertyInfoComparer(p1, p2) {
        return p1.metaIndex - p2.metaIndex;
    }

    function beginReadProperties(properties, key, fnPostProcess, fnParams) {
        if (properties != null) {
            let store = [];
            beginReadObjects(
                null,
                store,
                () => {
                    propertyNodesToInfoArray(store, properties, key);

                    if (fnPostProcess != null) {
                        fnPostProcess(fnParams);
                    }
                });
        }
        else if (fnPostProcess != null) {
            fnPostProcess(fnParams);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // equipment utilities
    //
    ////////////////////////////////////////////////////////////////////////////////////////////////////

    const g_equipAttributes = [
        { index : 0 , type : 0 , name : '物理攻击' },
        { index : 1 , type : 0 , name : '魔法攻击' },
        { index : 2 , type : 0 , name : '攻击速度' },
        { index : 3 , type : 0 , name : '最大生命' },
        { index : 4 , type : 0 , name : '最大护盾' },
        { index : 5 , type : 1 , name : '附加物伤' },
        { index : 6 , type : 1 , name : '附加魔伤' },
        { index : 7 , type : 1 , name : '附加攻速' },
        { index : 8 , type : 1 , name : '附加生命' },
        { index : 9 , type : 1 , name : '附加护盾' },
        { index : 10 , type : 1 , name : '附加回血' },
        { index : 11 , type : 1 , name : '附加回盾' },
        { index : 12 , type : 0 , name : '护盾回复' },
        { index : 13 , type : 0 , name : '物理穿透' },
        { index : 14 , type : 0 , name : '魔法穿透' },
        { index : 15 , type : 0 , name : '暴击穿透' },
        { index : 16 , type : 1 , name : '附加物穿' },
        { index : 17 , type : 1 , name : '附加物防' },
        { index : 18 , type : 1 , name : '附加魔防' },
        { index : 19 , type : 1 , name : '物理减伤' },
        { index : 20 , type : 1 , name : '魔法减伤' },
        { index : 21 , type : 0 , name : '生命偷取' },
        { index : 22 , type : 0 , name : '伤害反弹' },
        { index : 23 , type : 1 , name : '附加魔穿' },
        { index : 24 , type : 1 , name : '技能概率' },
        { index : 25 , type : 1 , name : '暴击概率' },
        { index : 26 , type : 1 , name : '力量生命' },
        { index : 27 , type : 1 , name : '体魄生命' },
        { index : 28 , type : 1 , name : '意志生命' },
        { index : 29 , type : 1 , name : '体魄物减' },
        { index : 30 , type : 1 , name : '意志魔减' },
        { index : 31 , type : 1 , name : '敏捷绝伤' },
        { index : 32 , type : 1 , name : '敏捷生命' },
        { index : 33 , type : 1 , name : '智力攻速' },
        { index : 34 , type : 1 , name : '力量物防' },
        { index : 35 , type : 1 , name : '敏捷魔防' }
    ];

    const g_equipments = [
        {
            index : -1,
            name : '反叛者的刺杀弓',
            type : 0,
            attributes : [ { attribute : g_equipAttributes[0] , div : 5 , add : 30 },
                           { attribute : g_equipAttributes[15] , div : 20 , add : 10 },
                           { attribute : g_equipAttributes[13] , div : 20 , add : 10 },
                           { attribute : g_equipAttributes[16] } ],
            shortMark : 'ASSBOW'
        },
        {
            index : -1,
            name : '狂信者的荣誉之刃',
            type : 0,
            attributes : [ { attribute : g_equipAttributes[0] , div : 5 , add : 20 },
                           { attribute : g_equipAttributes[2] , div : 5 , add : 20 },
                           { attribute : g_equipAttributes[15] , div : 20 , add : 10 },
                           { attribute : g_equipAttributes[13] , div : 20 , add : 10 } ],
            shortMark : 'BLADE'
        },
        {
            index : -1,
            name : '陨铁重剑',
            type : 0,
            attributes : [ { attribute : g_equipAttributes[5] , mul : 20 },
                           { attribute : g_equipAttributes[5] , mul : 20 },
                           { attribute : g_equipAttributes[0] , div : 5 , add : 30 },
                           { attribute : g_equipAttributes[15] , div : 20 , add : 1 } ],
            merge : [ [ 0, 1 ], [ 2 ], [ 3 ] ],
            shortMark : 'CLAYMORE'
        },
        {
            index : -1,
            name : '幽梦匕首',
            type : 0,
            attributes : [ { attribute : g_equipAttributes[0] , div : 5 },
                           { attribute : g_equipAttributes[1] , div : 5 },
                           { attribute : g_equipAttributes[7] , mul : 4 },
                           { attribute : g_equipAttributes[2] , div : 5 , add : 25 } ],
            shortMark : 'DAGGER'
        },
        {
            index : -1,
            name : '清澄长杖',
            type : 0,
            attributes : [ { attribute : g_equipAttributes[1] , div : 5 , add : 20 },
                           { attribute : g_equipAttributes[14] , div : 20 , add : 5 },
                           { attribute : g_equipAttributes[2] , div : 5 },
                           { attribute : g_equipAttributes[33] , div : 375 } ],
            shortMark : 'LIMPIDWAND'
        },
        {
            index : -1,
            name : '荆棘盾剑',
            type : 0,
            attributes : [ { attribute : g_equipAttributes[21] , div : 20 , add : 10 },
                           { attribute : g_equipAttributes[22] , div : 15 },
                           { attribute : g_equipAttributes[17] },
                           { attribute : g_equipAttributes[18] } ],
            shortMark : 'SHIELD'
        },
        {
            index : -1,
            name : '饮血魔剑',
            type : 0,
            attributes : [ { attribute : g_equipAttributes[0] , div : 5 , add : 50 },
                           { attribute : g_equipAttributes[13] , div : 20 , add : 10 },
                           { attribute : g_equipAttributes[23] , mul : 2 },
                           { attribute : g_equipAttributes[21] , div : 20, add : 10 } ],
            shortMark : 'SPEAR'
        },
        {
            index : -1,
            name : '彩金长剑',
            type : 0,
            attributes : [ { attribute : g_equipAttributes[0] , div : 5 , add : 10 },
                           { attribute : g_equipAttributes[1] , div : 5 , add : 10 },
                           { attribute : g_equipAttributes[2] , div : 5 , add : 20 },
                           { attribute : g_equipAttributes[31] , div : 25 } ],
            shortMark : 'COLORFUL'
        },
        {
            index : -1,
            name : '光辉法杖',
            type : 0,
            attributes : [ { attribute : g_equipAttributes[1] , div : 5 },
                           { attribute : g_equipAttributes[1] , div : 5 },
                           { attribute : g_equipAttributes[1] , div : 5 },
                           { attribute : g_equipAttributes[14] , div : 20 } ],
            merge : [ [ 0, 1, 2 ], [ 3 ] ],
            shortMark : 'WAND'
        },
        {
            index : -1,
            name : '探险者短弓',
            type : 0,
            attributes : [ { attribute : g_equipAttributes[5] , mul : 10 },
                           { attribute : g_equipAttributes[6] , mul : 10 },
                           { attribute : g_equipAttributes[7] , mul : 2 },
                           { attribute : g_equipAttributes[21] , div : 20 , add : 10 } ],
            shortMark : 'BOW'
        },
        {
            index : -1,
            name : '探险者短杖',
            type : 0,
            attributes : [ { attribute : g_equipAttributes[5] , mul : 10 },
                           { attribute : g_equipAttributes[6] , mul : 10 },
                           { attribute : g_equipAttributes[14] , div : 20 , add : 5 },
                           { attribute : g_equipAttributes[21] , div : 20 , add : 10 } ],
            shortMark : 'STAFF'
        },
        {
            index : -1,
            name : '探险者之剑',
            type : 0,
            attributes : [ { attribute : g_equipAttributes[5] , mul : 10 },
                           { attribute : g_equipAttributes[6] , mul : 10 },
                           { attribute : g_equipAttributes[16] },
                           { attribute : g_equipAttributes[21] , div : 20 , add : 10 } ],
            shortMark : 'SWORD'
        },
        {
            index : -1,
            name : '命师的传承手环',
            type : 1,
            attributes : [ { attribute : g_equipAttributes[1] , div : 5 , add : 1 },
                           { attribute : g_equipAttributes[14] , div : 20 , add : 1 },
                           { attribute : g_equipAttributes[9] , mul : 20 },
                           { attribute : g_equipAttributes[18] } ],
            shortMark : 'BRACELET'
        },
        {
            index : -1,
            name : '秃鹫手环',
            type : 1,
            attributes : [ { attribute : g_equipAttributes[21] , div : 20 , add : 1 },
                           { attribute : g_equipAttributes[21] , div : 20 , add : 1 },
                           { attribute : g_equipAttributes[21] , div : 20 , add : 1 },
                           { attribute : g_equipAttributes[7] , mul : 2 } ],
            merge : [ [ 0, 1, 2 ], [ 3 ] ],
            shortMark : 'VULTURE'
        },
        {
            index : -1,
            name : '海星戒指',
            type : 1,
            attributes : [ { attribute : g_equipAttributes[16] , div : 2 },
                           { attribute : g_equipAttributes[23] , div : 2 },
                           { attribute : g_equipAttributes[25] , mul : 4 , div : 5 },
                           { attribute : g_equipAttributes[24] , mul : 4 , div : 5 } ],
            shortMark : 'RING'
        },
        {
            index : -1,
            name : '噬魔戒指',
            type : 1,
            attributes : [ { attribute : g_equipAttributes[23] , div : 2 },
                           { attribute : g_equipAttributes[24] , mul : 4 , div : 5 },
                           { attribute : g_equipAttributes[26] , mul : 2 , div : 25 },
                           { attribute : g_equipAttributes[3] , mul : 7 , div : 100 } ],
            shortMark : 'DEVOUR'
        },
        {
            index : -1,
            name : '折光戒指',
            type : 1,
            attributes : [ { attribute : g_equipAttributes[7] , mul : 2 },
                           { attribute : g_equipAttributes[25] , mul : 4 , div : 5 },
                           { attribute : g_equipAttributes[15] , div : 20 },
                           { attribute : g_equipAttributes[32] , div : 20 } ],
            shortMark : 'REFRACT'
        },
        {
            index : -1,
            name : '探险者手环',
            type : 1,
            attributes : [ { attribute : g_equipAttributes[5] , mul : 10 },
                           { attribute : g_equipAttributes[6] , mul : 10 },
                           { attribute : g_equipAttributes[7] , mul : 2 },
                           { attribute : g_equipAttributes[8] , mul : 10 } ],
            shortMark : 'GLOVES'
        },
        {
            index : -1,
            name : '旅法师的灵光袍',
            type : 2,
            attributes : [ { attribute : g_equipAttributes[8] , mul : 10 },
                           { attribute : g_equipAttributes[11] , mul : 60 },
                           { attribute : g_equipAttributes[4] , div : 5 , add : 25 },
                           { attribute : g_equipAttributes[9] , mul : 50 } ],
            shortMark : 'CLOAK'
        },
        {
            index : -1,
            name : '挑战斗篷',
            type : 2,
            attributes : [ { attribute : g_equipAttributes[4] , div : 5 , add : 50 },
                           { attribute : g_equipAttributes[9] , mul : 100 },
                           { attribute : g_equipAttributes[18] },
                           { attribute : g_equipAttributes[20] , mul : 5 } ],
            shortMark : 'CAPE'
        },
        {
            index : -1,
            name : '战线支撑者的荆棘重甲',
            type : 2,
            attributes : [ { attribute : g_equipAttributes[3] , div : 5 , add : 20 },
                           { attribute : g_equipAttributes[17] },
                           { attribute : g_equipAttributes[18] },
                           { attribute : g_equipAttributes[22] , div : 15 , add : 10 } ],
            shortMark : 'THORN'
        },
        {
            index : -1,
            name : '复苏战衣',
            type : 2,
            attributes : [ { attribute : g_equipAttributes[3] , div : 5 , add : 50 },
                           { attribute : g_equipAttributes[19] , mul : 5 },
                           { attribute : g_equipAttributes[20] , mul : 5 },
                           { attribute : g_equipAttributes[10] , mul : 20 } ],
            shortMark : 'WOOD'
        },
        {
            index : -1,
            name : '探险者铁甲',
            type : 2,
            attributes : [ { attribute : g_equipAttributes[8] , mul : 20 },
                           { attribute : g_equipAttributes[17] },
                           { attribute : g_equipAttributes[18] },
                           { attribute : g_equipAttributes[10] , mul : 10 } ],
            shortMark : 'PLATE'
        },
        {
            index : -1,
            name : '探险者皮甲',
            type : 2,
            attributes : [ { attribute : g_equipAttributes[8] , mul : 25 },
                           { attribute : g_equipAttributes[19] , mul : 2 },
                           { attribute : g_equipAttributes[20] , mul : 2 },
                           { attribute : g_equipAttributes[10] , mul : 6 } ],
            shortMark : 'LEATHER'
        },
        {
            index : -1,
            name : '探险者布甲',
            type : 2,
            attributes : [ { attribute : g_equipAttributes[8] , mul : 25 },
                           { attribute : g_equipAttributes[19] , mul : 2 },
                           { attribute : g_equipAttributes[20] , mul : 2 },
                           { attribute : g_equipAttributes[10] , mul : 6 } ],
            shortMark : 'CLOTH'
        },
        {
            index : -1,
            name : '萌爪耳钉',
            type : 3,
            attributes : [ { attribute : g_equipAttributes[29] , mul : 17 , div : 2000 },
                           { attribute : g_equipAttributes[30] , mul : 17 , div : 2000 },
                           { attribute : g_equipAttributes[27] , div : 30 },
                           { attribute : g_equipAttributes[28] , div : 30 } ],
            shortMark : 'RIBBON'
        },
        {
            index : -1,
            name : '占星师的耳饰',
            type : 3,
            attributes : [ { attribute : g_equipAttributes[8] , mul : 5 },
                           { attribute : g_equipAttributes[4] , div : 5 },
                           { attribute : g_equipAttributes[9] , mul : 20 },
                           { attribute : g_equipAttributes[19] , mul : 2 } ],
            shortMark : 'TIARA'
        },
        {
            index : -1,
            name : '猎魔耳环',
            type : 3,
            attributes : [ { attribute : g_equipAttributes[24] , mul : 2 , div : 5 },
                           { attribute : g_equipAttributes[26] , mul : 2 , div : 25 },
                           { attribute : g_equipAttributes[32] , mul : 2 , div : 25 },
                           { attribute : g_equipAttributes[3] , mul : 3 , div : 50 } ],
            shortMark : 'HUNT'
        },
        {
            index : -1,
            name : '凶神耳环',
            type : 3,
            attributes : [ { attribute : g_equipAttributes[16] , div : 2 },
                           { attribute : g_equipAttributes[34] , div : 250 },
                           { attribute : g_equipAttributes[35] , div : 250 },
                           { attribute : g_equipAttributes[24] , mul : 2 , div : 5 } ],
            shortMark : 'FIERCE'
        },
        {
            index : -1,
            name : '探险者耳环',
            type : 3,
            attributes : [ { attribute : g_equipAttributes[8] , mul : 10 },
                           { attribute : g_equipAttributes[19] , mul : 2 },
                           { attribute : g_equipAttributes[20] , mul : 2 },
                           { attribute : g_equipAttributes[10] , mul : 4 } ],
            shortMark : 'SCARF'
        }
    ];

    const g_equipMap = new Map();
    g_equipments.forEach((item, index) => {
        item.index = index;
        item.alias = item.name;
        g_equipMap.set(item.name, item);
        g_equipMap.set(item.shortMark, item);
    });

    const g_oldEquipNames = [
        [ '荆棘盾剑', '荆棘剑盾' ],
        [ '饮血魔剑', '饮血长枪' ],
        [ '探险者手环', '探险者手套' ],
        [ '秃鹫手环', '秃鹫手套' ],
        [ '复苏战衣', '复苏木甲' ],
        [ '萌爪耳钉', '天使缎带' ],
        [ '占星师的耳饰', '占星师的发饰' ],
        [ '探险者耳环', '探险者头巾' ]
    ];

    const g_defaultEquipAttributeMerge = [ [0], [1], [2], [3] ];
    const defaultEquipAttributeCalculate = ((a, l, p) => Math.trunc((l * (a.mul ?? 1) / (a.div ?? 1) + (a.add ?? 0)) * (p / 10)) / 10);
    function defaultBeachEquipComparer(setting, eq1, eq2) {
        let eqMeta = eq1.meta;
        let delta = [];
        let quality = eq1.getQuality(true) - eq2.getQuality(true);
        let majorAdv = 0;
        let majorEq = 0;
        let majorDis = 0;
        let minorAdv = 0;

        eqMeta.attributes.forEach((attr, index) => {
            let calculator = (attr.calculate ?? defaultEquipAttributeCalculate);
            let d = calculator(attr, eq1.level, eq1.pAttributes[index]) - calculator(attr, eq2.level, eq2.pAttributes[index]);
            if (setting[index + 1]) {
                delta.push(0);
                if (d > 0) {
                    minorAdv++;
                }
            }
            else {
                delta.push(d);
            }
        });

        let merge = (eqMeta.merge?.length > 1 ? eqMeta.merge : g_defaultEquipAttributeMerge);
        for (let indices of merge) {
            let sum = 0;
            indices.forEach((index) => { sum += delta[index]; });
            if (sum > 0) {
                majorAdv++;
            }
            else if (sum < 0) {
                majorDis++;
            }
            else {
                majorEq++;
            }
        };

        return { quality : quality, majorAdv : majorAdv, majorEq : majorEq, majorDis : majorDis, minorAdv : minorAdv };
    }

    function equipmentVerify(node, eq) {
        let mark = (g_configMap.get('markEquipmentNotMeetPrediction')?.value ?? 0);
        if ((eq ??= (new Equipment()).fromNode(node, false)) != null) {
            let error = 0;
            let attrs = node.getAttribute('data-content')?.match(/'>.+\+\d+\.?\d*%?.*?<span/g);
            if (attrs?.length == 4) {
                eq.meta.attributes.forEach((attr, index) => {
                    let eBase = (attr.calculate ?? defaultEquipAttributeCalculate)(attr, eq.level, eq.pAttributes[index]);
                    let disp = attrs[index].match(/\+(\d+\.?\d*)/)?.[1];
                    if (eBase.toString() != disp) {
                        console.log(`${eq.meta.alias} Lv.${eq.level} #${index}: ${attrs[index].slice(2, -5)} ---> ${eBase}`);
                        error++;
                    }
                });
                return (mark * error);
            }
        }
        console.log(`BUG equip: ${node}`);
        return -mark;
    }

    function equipmentVerifyManual(name, level, attrs, displays) {
        let eqMeta = g_equipMap.get(name);
        if (eqMeta != null && attrs?.length == 4 && displays?.length == 4) {
            console.log(`${name} Lv.${level}`);
            eqMeta.attributes.forEach((a, i) => {
                let eBase = (a.calculate ?? defaultEquipAttributeCalculate)(a, level, attrs[i]);
                console.log(`${i}: ${displays[i]} ---> ${eBase}`);
            });
        }
    }

    // deprecated
    let g_equipmentLevelName = g_equipmentDefaultLevelName;
    let g_useOldEquipName = false;
    let g_useThemeEquipName = false;
    function equipLoadTheme(theme) {
        if (theme.level?.length > 0) {
            g_equipmentLevelName = theme.level;
        }
        if (g_useOldEquipName) {
            g_oldEquipNames.forEach((item) => {
                if (!g_equipMap.has(item[1])) {
                    let eqMeta = g_equipMap.get(item[0]);
                    if (eqMeta != null) {
                        eqMeta.alias = item[1];
                        g_equipMap.set(eqMeta.alias, eqMeta);
                    }
                }
            });
        }
        if (g_useThemeEquipName) {
            for(let item in theme) {
                if (/^[a-z]+\d+$/.test(item) && theme[item].length >= 5 && theme[item][3]?.length > 0 && !g_equipMap.has(theme[item][3])) {
                    let eqMeta = g_equipMap.get(theme[item][2]);
                    if (eqMeta != null) {
                        eqMeta.alias = theme[item][3];
                        g_equipMap.set(eqMeta.alias, eqMeta);
                    }
                }
            }
        }
    }
    // deprecated

    function Equipment() {
        this.isEquipment = true;
        this.meta = null;
        this.level = 0;
        this.pAttributes = [ 0, 0, 0, 0 ];
        this.myst = false;
        this.id = -1;
        this.quality = -1;
        this.qualityLevel = -1;

        this.reset = (() => {
            this.meta = null;
            this.level = 0;
            this.pAttributes = [ 0, 0, 0, 0 ];
            this.myst = false;
            this.id = -1;
            this.quality = -1;
            this.qualityLevel = -1;
        });

        this.isValid = (() => {
            return (this.meta != null);
        });

        this.fromEquipText = ((text) => {
            this.reset();
            let eq = text?.split(',');
            if (eq?.length > 6) {
                this.meta = g_equipMap.get(eq[0]);
                this.level = parseInt(eq[1]);
                this.pAttributes = [ parseInt(eq[2]), parseInt(eq[3]), parseInt(eq[4]), parseInt(eq[5]) ];
                this.myst = (eq[6] != '0');
                this.id = parseInt(eq[7]);
                if (this.isValid()) {
                    return this;
                }
                this.reset();
            }
            return null;
        });

        this.fromNode = ((node, ignoreIllegalAttributes) => {
            if (node?.nodeType == Node.ELEMENT_NODE) {
                let text = node.getAttribute('equip-string');
                if (text?.length > 0) {
                    return this.fromEquipText(text);
                }
                else if (node.className?.split(' ').length >= 2 && node.className.indexOf('fyg_mp3') >= 0) {
                    let titleName = node.hasAttribute('data-original-title') ? 'data-original-title' : 'title';
                    let title = node.getAttribute(titleName);
                    let ieq = title?.match(/Lv.+?>\s*(\d+)\s*<.+?\/i>\s*(\d+)\s*<.+?<br>(.+)/);
                    if (ieq?.length == 4) {
                        let unique = ieq[3].match(/<span id='unique' style='display:none'>(.+?)<\/span>/);
                        let name = (unique?.length == 2 ? unique[1] : ieq[3]).trim();
                        this.meta = (g_equipMap.get(name) ?? g_equipMap.get(name.substring(g_equipmentLevelName[0].length)));
                        if (this.meta != null) {
                            this.level = parseInt(ieq[1]);
                            let attrs = node.getAttribute('data-content')?.match(/>\s*\d+\s?%\s*</g);
                            let i = attrs?.length;
                            if (ignoreIllegalAttributes || i > 0) {
                                if (i != 4) {
                                    i = 4;
                                }
                                for (--i; i >= 0; i--) {
                                    this.pAttributes[i] = parseInt(attrs?.[i]?.match(/\d+/)?.[0] ?? 0);
                                }
                                this.myst = /\[神秘属性\]/.test(node.getAttribute('data-content'));
                                this.id = parseInt(node.getAttribute('onclick')?.match(/\d+/)?.[0] ?? '-1');

                                node.setAttribute('equip-string', this.formatEquipText());
                                node.setAttribute(titleName,
                                                  title.replace(/(Lv.+?>\s*\d+\s*)(<)/,
                                                                `$1<span style="font-size:15px;">（${this.getQuality()}%）</span>$2`));
                                return this;
                            }
                        }
                    }
                }
            }
            this.reset();
            return null;
        });

        this.formatEquipText = ((ignoreId) => {
            if (this.isValid()) {
                return `${this.meta.shortMark},${this.level},${this.pAttributes.join(',')},` +
                    `${this.myst ? 1 : 0}${ignoreId ? '' : ',' + (isNaN(this.id) ? -1 : this.id)}`;
            }
            return null;
        });

        this.formatExportText = (() => {
            if (this.isValid()) {
                return `${this.meta.exportAlias ?? this.meta.shortMark} ${this.level} ${this.pAttributes.join(' ')} ${this.myst ? 1 : 0}`;
            }
            return null;
        });

        this.formatEquipAttrText = ((itemSeparator) => {
            let text = '';
            if (this.isValid()) {
                itemSeparator ??= ', ';
                let sp = '';
                this.meta.attributes.forEach((attr, index) => {
                    text += `${sp}${attr.attribute.name} +${(attr.calculate ?? defaultEquipAttributeCalculate)
                                                                 (attr,
                                                                  this.level,
                                                                  this.pAttributes[index])}${attr.attribute.type == 0 ? '%' : ''}`;
                    sp = itemSeparator;
                });
            }
            return text;
        });

        this.getQuality = ((ignoreMyst) => {
            if (this.isValid()) {
                if (this.quality < 0) {
                    this.quality = this.pAttributes[0] + this.pAttributes[1] + this.pAttributes[2] + this.pAttributes[3];
                }
                return (this.quality + ((!ignoreMyst && this.myst) ? 100 : 0));
            }
            return -1;
        });

        this.getQualityLevel = (() => {
            if (this.isValid()) {
                if (this.qualityLevel < 0) {
                    let q = this.getQuality(false);
                    if (q >= 0) {
                        for (var i = g_equipmentLevelPoints.length - 1; i > 0 && q < g_equipmentLevelPoints[i]; i--);
                        this.qualityLevel = i;
                    }
                }
                return this.qualityLevel;
            }
            return -1;
        });

        this.compareTo = ((other, ascLevel) => {
            if (!this.isValid()) {
                return 1;
            }
            else if (!other?.isValid()) {
                return -1;
            }

            let delta;
            if ((delta = this.meta.index - other.meta.index) == 0) {
                if ((delta = this.level - other.level) == 0) {
                    for (let i = 0; i < 4 && delta == 0; delta = this.pAttributes[i] - other.pAttributes[i++]);
                    if (delta == 0) {
                        delta = this.myst - other.myst;
                    }
                }
                if (!ascLevel) {
                    delta = -delta;
                }
            }
            return delta;
        });
    }

    function equipmentNodesToArray(nodes, array, ignoreIllegalAttributes) {
        array ??= [];
        for (let i = nodes?.length - 1; i >= 0; i--) {
            let e = (new Equipment()).fromNode(nodes[i], ignoreIllegalAttributes);
            if (e?.isValid()) {
                array.unshift(e);
            }
        }
        return array;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // object utilities
    //
    ////////////////////////////////////////////////////////////////////////////////////////////////////

    function objectGetLevel(e) {
        if (e != null) {
            let eq = (e.isEquipment ? e : (new Equipment()).fromNode(e, true));
            if (eq?.isValid()) {
                return eq.getQualityLevel();
            }
            else if ((eq = e.isProperty ? e : propertyInfoParseNode(e))?.isProperty) {
                return eq.level;
            }
            else if ((eq = (e.isAmulet ? e : (new Amulet()).fromNode(e)))?.isValid()) {
                return (eq.level + 2)
            }
        }
        return -1;
    }

    function objectNodeComparer(e1, e2) {
        let eq1 = (new Equipment).fromNode(e1, true);
        let eq2 = (new Equipment).fromNode(e2, true);

        if (eq1 == null && eq2 == null) {
            return ((new Amulet()).fromNode(e1)?.compareTo((new Amulet()).fromNode(e2)) ?? 1);
        }
        else if (eq1 == null) {
            return 1;
        }
        else if (eq2 == null) {
            return -1;
        }
        return eq1.compareTo(eq2);
    }

    function objectIsEmptyNode(node) {
        return (/空/.test(node?.innerText) || !(node?.getAttribute('data-content')?.length > 0));
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // bag & store utilities
    //
    ////////////////////////////////////////////////////////////////////////////////////////////////////

    function findAmuletIds(container, amulets, ids, maxCount) {
        ids ??= [];
        let cl = container?.length;
        if (cl > 0 && amulets?.length > 0) {
            maxCount ??= cl;
            let ams = amuletNodesToArray(container);
            for (let i = ams.length - 1; i >= 0 && amulets.length > 0 && ids.length < maxCount; i--) {
                for (let j = amulets.length - 1; j >= 0; j--) {
                    if (ams[i].compareTo(amulets[j]) == 0) {
                        amulets.splice(j, 1);
                        ids.unshift(ams[i].id);
                        break;
                    }
                }
            }
        }
        return ids;
    }

    function findEquipmentIds(container, equips, ids, maxCount) {
        ids ??= [];
        let cl = container?.length;
        if (cl > 0 && equips?.length > 0) {
            maxCount ??= cl;
            let eqs = equipmentNodesToArray(container);
            for (let i = eqs.length - 1; i >= 0 && equips.length > 0 && ids.length < maxCount; i--) {
                for (let j = equips.length - 1; j >= 0; j--) {
                    if (eqs[i].compareTo(equips[j]) == 0) {
                        equips.splice(j, 1);
                        ids.unshift(eqs[i].id);
                        break;
                    }
                }
            }
        }
        return ids;
    }

    function beginClearBag(bag, key, fnProgress, fnPostProcess, fnParams) {
        function beginClearBagObjects(objects) {
            beginMoveObjects(objects, ObjectMovePath.bag2store, fnProgress, fnPostProcess, fnParams);
        }

        let objects = [];
        if (bag?.length > 0) {
            objectIdParseNodes(bag, objects, key, true);
            beginClearBagObjects(objects);
        }
        else {
            beginReadObjectIds(objects, null, key, true, beginClearBagObjects, objects);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // generic popups
    //
    ////////////////////////////////////////////////////////////////////////////////////////////////////

    const g_genericPopupContainerId = 'generic-popup-container';
    const g_genericPopupClass = 'generic-popup';
    const g_genericPopupId = g_genericPopupClass;
    const g_genericPopupWindowClass = 'generic-popup-window';
    const g_genericPopupContentContainerId = 'generic-popup-content-container';
    const g_genericPopupContentClass = 'generic-popup-content';
    const g_genericPopupContentId = g_genericPopupContentClass;
    const g_genericPopupFixedContentId = 'generic-popup-content-fixed';
    const g_genericPopupInformationTipsId = 'generic-popup-information-tips';
    const g_genericPopupProgressClass = g_genericPopupClass;
    const g_genericPopupProgressId = 'generic-popup-progress';
    const g_genericPopupProgressContentClass = 'generic-popup-content-progress';
    const g_genericPopupProgressContentId = g_genericPopupProgressContentClass;
    const g_genericPopupBGInfoClass = 'generic-popup-background-information';
    const g_genericPopupBGInfoId = g_genericPopupBGInfoClass;
    const g_genericPopupTopLineDivClass = 'generic-popup-top-line-container';
    const g_genericPopupTitleTextClass = 'generic-popup-title-text';
    const g_genericPopupTitleTextId = g_genericPopupTitleTextClass;
    const g_genericPopupTitleButtonContainerId = 'generic-popup-title-button-container';
    const g_genericPopupFootButtonContainerId = 'generic-popup-foot-button-container';
    const g_genericPopupBackgroundColor = '#ebf2f9';
    const g_genericPopupBackgroundColorAlt = '#dbe2e9';
    const g_genericPopupBorderColor = '#3280fc';
    const g_genericPopupTitleTextColor = '#ffffff';

    const g_genericPopupStyle =
        `<style>
            .${g_genericPopupClass} {
                width: 100vw;
                height: 100vh;
                background-color: rgba(0, 0, 0, 0.4);
                position: fixed;
                left: 0;
                top: 0;
                bottom: 0;
                right: 0;
                z-index: 99;
                display: none;
                justify-content: center;
                align-items: center;
            }
            .${g_genericPopupWindowClass} {
                border: 2px solid ${g_genericPopupBorderColor};
                border-radius: 5px;
                box-shadow: 4px 4px 16px 8px rgba(0, 0, 0, 0.4);
            }
            .${g_genericPopupContentClass} {
                width: 100%;
                background-color: ${g_genericPopupBackgroundColor};
                box-sizing: border-box;
                padding: 0px 30px;
                color: black;
            }
            .${g_genericPopupProgressContentClass} {
                width: 400px;
                height: 200px;
                background-color: ${g_genericPopupBackgroundColor};
                box-sizing: border-box;
                box-shadow: 4px 4px 16px 8px rgba(0, 0, 0, 0.4);
                border: 2px solid ${g_genericPopupBorderColor};
                border-radius: 5px;
                display: table;
            }
            #${g_genericPopupProgressContentId} {
                height: 100%;
                width: 100%;
                color: #0000c0;
                font-size: 24px;
                font-weight: bold;
                display: table-cell;
                text-align: center;
                vertical-align: middle;
            }
            .${g_genericPopupBGInfoClass} {
                width: 100vw;
                height: 100vh;
                background-color: rgba(100, 100, 100, 1.0);
                position: fixed;
                left: 0;
                top: 0;
                bottom: 0;
                right: 0;
                font-size: 18px;
                font-weight: bold;
                z-index: 199;
                display: none;
            }
            .${g_genericPopupTopLineDivClass} {
                width: 100%;
                padding: 20px 0px;
                border-top: 2px groove #d0d0d0;
            }
            .generic-popup-title-foot-container {
                width: 100%;
                height: 40px;
                background-color: ${g_genericPopupBorderColor};
                padding: 0px 30px;
                display: table;
            }
            .${g_genericPopupTitleTextClass} {
                height: 100%;
                color: ${g_genericPopupTitleTextColor};
                font-size: 18px;
                display: table-cell;
                text-align: left;
                vertical-align: middle;
            }
        </style>`;

    const g_genericPopupHTML =
        `${g_genericPopupStyle}
         <div class="${g_genericPopupClass}" id="${g_genericPopupId}">
           <div class="${g_genericPopupWindowClass}">
             <div class="generic-popup-title-foot-container">
               <span class="${g_genericPopupTitleTextClass}" id="${g_genericPopupTitleTextId}"></span>
               <div id="${g_genericPopupTitleButtonContainerId}" style="float:right;margin-top:6px;"></div>
             </div>
             <div id="${g_genericPopupContentContainerId}">
               <div class="${g_genericPopupContentClass}" id="${g_genericPopupFixedContentId}" style="display:none;"></div>
               <div class="${g_genericPopupContentClass}" id="${g_genericPopupContentId}"></div>
             </div>
             <div class="generic-popup-title-foot-container">
               <div id="${g_genericPopupFootButtonContainerId}" style="float:right;margin-top:8px;"></div>
             </div>
           </div>
         </div>
         <div class="${g_genericPopupProgressClass}" id="${g_genericPopupProgressId}">
           <div class="${g_genericPopupProgressContentClass}"><span id="${g_genericPopupProgressContentId}"></span></div>
         </div>
         <div class="${g_genericPopupBGInfoClass}" id="${g_genericPopupBGInfoId}"></div>`;

    let g_genericPopupContainer = null;
    function genericPopupInitialize() {
        if ((g_genericPopupContainer ??= document.getElementById(g_genericPopupContainerId)) == null) {
            g_genericPopupContainer = document.createElement('div');
            g_genericPopupContainer.id = g_genericPopupContainerId;
            document.body.appendChild(g_genericPopupContainer);
        }
        g_genericPopupContainer.innerHTML = g_genericPopupHTML;
    }

    function genericPopupReset(initialize) {
        if (initialize) {
            g_genericPopupContainer.innerHTML = g_genericPopupHTML;
        }
        else {
            let fixedContent = g_genericPopupContainer.querySelector('#' + g_genericPopupFixedContentId);
            fixedContent.style.display = 'none';
            fixedContent.innerHTML = '';

            g_genericPopupContainer.querySelector('#' + g_genericPopupTitleTextId).innerText = '';
            g_genericPopupContainer.querySelector('#' + g_genericPopupContentId).innerHTML = '';
            g_genericPopupContainer.querySelector('#' + g_genericPopupTitleButtonContainerId).innerHTML = '';
            g_genericPopupContainer.querySelector('#' + g_genericPopupFootButtonContainerId).innerHTML = '';
        }
    }

    function genericPopupGetContentContainer() {
        return g_genericPopupContainer.querySelector('#' + g_genericPopupContentContainerId);
    }

    function genericPopupSetContent(title, content) {
        g_genericPopupContainer.querySelector('#' + g_genericPopupTitleTextId).innerText = title;
        g_genericPopupContainer.querySelector('#' + g_genericPopupContentId).innerHTML = content;
    }

    function genericPopupSetFixedContent(content) {
        let fixedContent = g_genericPopupContainer.querySelector('#' + g_genericPopupFixedContentId);
        fixedContent.style.display = 'block';
        fixedContent.innerHTML = content;
    }

    function genericPopupAddButton(text, width, clickProc, addToTitle) {
        let btn = document.createElement('button');
        btn.innerText = text;
        btn.onclick = clickProc;
        if (width != null && width > 0) {
            width = width.toString();
            btn.style.width = width + (width.endsWith('px') || width.endsWith('%') ? '' : 'px');
        }
        else {
            btn.style.width = 'auto';
        }

        g_genericPopupContainer.querySelector('#' + (addToTitle
                                              ? g_genericPopupTitleButtonContainerId
                                              : g_genericPopupFootButtonContainerId)).appendChild(btn);
        return btn;
    }

    function genericPopupAddCloseButton(width, text, addToTitle) {
        return genericPopupAddButton(text?.length > 0 ? text : '关闭', width, (() => { genericPopupClose(true); }), addToTitle);
    }

    function genericPopupSetContentSize(height, width, scrollable) {
        height = (height?.toString() ?? '100%');
        width = (width?.toString() ?? '100%');

        g_genericPopupContainer.querySelector('#' + g_genericPopupContentContainerId).style.width
            = width + (width.endsWith('px') || width.endsWith('%') ? '' : 'px');

        let content = g_genericPopupContainer.querySelector('#' + g_genericPopupContentId);
        content.style.height = height + (height.endsWith('px') || height.endsWith('%') ? '' : 'px');
        content.style.overflow = (scrollable ? 'auto' : 'hidden');
    }

    function genericPopupShowModal(clickOutsideToClose) {
        genericPopupClose(false);

        let popup = g_genericPopupContainer.querySelector('#' + g_genericPopupId);

        if (clickOutsideToClose) {
            popup.onclick = ((event) => {
                if (event.target == popup) {
                    genericPopupClose(true);
                }
            });
        }
        else {
            popup.onclick = null;
        }

        popup.style.display = "flex";
    }

    function genericPopupClose(reset, initialize) {
        genericPopupCloseBGInfo();
        genericPopupCloseProgressMessage();

        let popup = g_genericPopupContainer.querySelector('#' + g_genericPopupId);
        popup.style.display = "none";

        if (reset) {
            genericPopupReset(initialize);
        }

        httpRequestClearAll();
    }

    function genericPopupOnClickOutside(fnProcess, fnParams) {
        let popup = g_genericPopupContainer.querySelector('#' + g_genericPopupId);

        if (fnProcess != null) {
            popup.onclick = ((event) => {
                if (event.target == popup) {
                    fnProcess(fnParams);
                }
            });
        }
        else {
            popup.onclick = null;
        }
    }

    function genericPopupQuerySelector(selectString) {
        return g_genericPopupContainer.querySelector(selectString);
    }

    function genericPopupQuerySelectorAll(selectString) {
        return g_genericPopupContainer.querySelectorAll(selectString);
    }

    let g_genericPopupInformationTipsTimer = null;
    function genericPopupShowInformationTips(msg, time) {
        if (g_genericPopupInformationTipsTimer != null) {
            clearTimeout(g_genericPopupInformationTipsTimer);
            g_genericPopupInformationTipsTimer = null;
        }
        let msgContainer = g_genericPopupContainer.querySelector('#' + g_genericPopupInformationTipsId);
        if (msgContainer != null) {
            msgContainer.innerText = (msg?.length > 0 ? `[ ${msg} ]` : '');
            if ((time = parseInt(time)) > 0) {
                g_genericPopupInformationTipsTimer = setTimeout(() => {
                    g_genericPopupInformationTipsTimer = null;
                    msgContainer.innerText = '';
                }, time);
            }
        }
    }

    function genericPopupShowProgressMessage(progressMessage) {
        genericPopupClose(false);

        g_genericPopupContainer.querySelector('#' + g_genericPopupProgressContentId).innerText
            = (progressMessage?.length > 0 ? progressMessage : '请稍候...');
        g_genericPopupContainer.querySelector('#' + g_genericPopupProgressId).style.display = "flex";
    }

    function genericPopupUpdateProgressMessage(progressMessage) {
        g_genericPopupContainer.querySelector('#' + g_genericPopupProgressContentId).innerText
            = (progressMessage?.length > 0 ? progressMessage : '请稍候...');
    }

    function genericPopupCloseProgressMessage() {
        g_genericPopupContainer.querySelector('#' + g_genericPopupProgressId).style.display = "none";
    }

    function genericPopupShowBGInfo(infoContent) {
        g_genericPopupContainer.querySelector('#' + g_genericPopupBGInfoId).innerHTML = (infoContent ?? '');
        g_genericPopupContainer.querySelector('#' + g_genericPopupBGInfoId).style.display = "block";
    }

    function genericPopupUpdateBGinfo(infoContent) {
        g_genericPopupContainer.querySelector('#' + g_genericPopupBGInfoId).innerHTML = (infoContent ?? '');
    }

    function genericPopupCloseBGInfo(clearContent) {
        if (clearContent) {
            g_genericPopupContainer.querySelector('#' + g_genericPopupBGInfoId).innerHTML = '';
        }
        g_genericPopupContainer.querySelector('#' + g_genericPopupBGInfoId).style.display = "none";
    }

    //
    // generic task-list based progress popup
    //
    const g_genericPopupTaskListId = 'generic-popup-task-list';
    const g_genericPopupTaskItemId = 'generic-popup-task-item-';
    const g_genericPopupTaskWaiting = '×';
    const g_genericPopupTaskCompleted = '√';
    const g_genericPopupTaskCompletedWithError = '！';
    const g_genericPopupColorTaskIncompleted = '#c00000';
    const g_genericPopupColorTaskCompleted = '#0000c0';
    const g_genericPopupColorTaskCompletedWithError = 'red';

    let g_genericPopupIncompletedTaskCount = 0;
    function genericPopupTaskListPopupSetup(title, popupWidth, tasks, fnCancelRoutine, cancelButtonText, cancelButtonWidth) {
        g_genericPopupIncompletedTaskCount = tasks.length;

        genericPopupSetContent(title, `<div style="padding:15px 0px 15px 0px;"><ul id="${g_genericPopupTaskListId}"></ul></div>`);
        let indicatorList = g_genericPopupContainer.querySelector('#' + g_genericPopupTaskListId);
        for (let i = 0; i < g_genericPopupIncompletedTaskCount; i++) {
            let li = document.createElement('li');
            li.id = g_genericPopupTaskItemId + i;
            li.style.color = g_genericPopupColorTaskIncompleted;
            li.innerHTML = `<span>${g_genericPopupTaskWaiting}</span><span>&nbsp;${tasks[i]}&nbsp;</span><span></span>`;
            indicatorList.appendChild(li);
        }

        if (fnCancelRoutine != null) {
            genericPopupAddButton(cancelButtonText?.length > 0 ? cancelButtonText : '取消', cancelButtonWidth, fnCancelRoutine, false);
        }

        genericPopupSetContentSize(Math.min(g_genericPopupIncompletedTaskCount * 20 + 30, window.innerHeight - 400), popupWidth, true);
    }

    function genericPopupTaskSetState(index, state) {
        let item = g_genericPopupContainer.querySelector('#' + g_genericPopupTaskItemId + index)?.lastChild;
        if (item != null) {
            item.innerText = (state ?? '');
        }
    }

    function genericPopupTaskComplete(index, error) {
        let li = g_genericPopupContainer.querySelector('#' + g_genericPopupTaskItemId + index);
        if (li?.firstChild?.innerText == g_genericPopupTaskWaiting) {
            li.firstChild.innerText = (error ? g_genericPopupTaskCompletedWithError : g_genericPopupTaskCompleted);
            li.style.color = (error ? g_genericPopupColorTaskCompletedWithError : g_genericPopupColorTaskCompleted);
            g_genericPopupIncompletedTaskCount--;
        }
    }

    function genericPopupTaskAbort() {
        if (g_genericPopupIncompletedTaskCount > 0) {
            let indicatorCount = (g_genericPopupContainer.querySelector('#' + g_genericPopupTaskListId)?.children?.length ?? 0);
            while (indicatorCount > 0) {
                genericPopupTaskComplete(--indicatorCount, true);
            }
        }
    }

    function genericPopupTaskCheckCompletion() {
        return (g_genericPopupIncompletedTaskCount == 0);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // switch solution
    //
    ////////////////////////////////////////////////////////////////////////////////////////////////////

    const BINDING_SEPARATOR = ';';
    const BINDING_NAME_SEPARATOR = '=';
    const BINDING_ELEMENT_SEPARATOR = '|';
    const SOLUTION_NAME_SEPARATOR = ':';

    function readBindingSolutionList(role, solution) {
        if (role == null && solution?.length > 0) {
            solution = solution.split(SOLUTION_NAME_SEPARATOR);
            if (solution?.length == 2) {
                role = solution[0].trim();
                solution = solution[1].trim();
            }
        }

        let roleId = 0;
        if (role != null && (roleId = (g_roleMap.get(role)?.id) ?? 0) == 0) {
            return null;
        }
        else if (solution != null && solution.length == 0) {
            return null;
        }

        let udata = loadUserConfigData();
        if (roleId > 0) {
            let binding = readRoleBinding(roleId, solution);
            return (binding == null ? null : [ binding ]);
        }
        else {
            let bindings = [];
            for (let id in udata.dataBind) {
                let binding = readRoleBinding(id, solution);
                if (binding != null) {
                    insertElement(bindings, binding, (a, b) => a.role.id - b.role.id);
                }
            }
            return (bindings.length > 0 ? bindings : null);
        }

        function readRoleBinding(id, solution) {
            let bindings = [];
            let bindInfo = udata.dataBind[id];
            if (bindInfo != null) {
                bindInfo.split(BINDING_SEPARATOR).forEach((s) => {
                    let a = s.split(BINDING_NAME_SEPARATOR);
                    let b;
                    if (a.length == 2 && (a[0] = a[0].trim()).length > 0 &&
                        (solution == null || a[0] == solution) &&
                        (b = a[1].split(BINDING_ELEMENT_SEPARATOR)).length > 5) {

                        // deprecated : compatibility issues
                        for (let i = 0; i < 4; i++) {
                            let c = b[i].split(',');
                            if (c.length > 8) {
                                c.splice(2, 2);
                                b[i] = c.join(',');
                            }
                        }
                        // deprecated

                        a[1] = b.join(BINDING_ELEMENT_SEPARATOR);
                        insertElement(bindings,
                                      { name : a[0], binding : a[1] },
                                      (a, b) => a.name < b.name ? -1 : (a.name > b.name ? 1 : 0));
                    }
                });
            }
            return (bindings.length > 0 ? { role : g_roleMap.get(id), bindings : bindings } : null);
        }
    }

    function switchSolutionByName(role, solution, fnPostProcess, fnParams) {
        genericPopupInitialize();
        genericPopupShowProgressMessage('读取中，请稍候...');
        let bind = readBindingSolutionList(role, solution);
        if (bind?.length == 1) {
            switchBindingSolution(`${bind[0].role.id}${BINDING_NAME_SEPARATOR}${bind[0].bindings[0].binding}`, fnPostProcess, fnParams);
        }
        else {
            switchBindingSolution(BINDING_NAME_SEPARATOR, fnPostProcess, fnParams);
        }
    }

    const g_switchSolutionRequests = {};
    async function switchBindingSolution(bindingString, fnPostProcess, fnParams) {
        if (!(bindingString?.length > 0)) {
            roleSetupCompletion();
            return;
        }

        if ((g_switchSolutionRequests.card ??= await getRequestInfoAsync('upcard', GuGuZhenRequest.equip)) != null) {
            g_switchSolutionRequests.halo ??= await getRequestInfoAsync('halosave', GuGuZhenRequest.equip);
            g_switchSolutionRequests.equip ??= await getRequestInfoAsync('puton', GuGuZhenRequest.equip);
            g_switchSolutionRequests.point ??= await getRequestInfoAsync('updstat', GuGuZhenRequest.equip);
        }
        if (g_switchSolutionRequests.card == null || g_switchSolutionRequests.halo == null ||
            g_switchSolutionRequests.equip == null || g_switchSolutionRequests.point == null) {

            console.log('missing function: ', g_switchSolutionRequests);
            addUserMessageSingle('角色方案切换', '<b style="color:red;">无法获取服务请求格式，可能的原因是咕咕镇版本不匹配或正在测试。</b>');
            roleSetupCompletion(true);
            return;
        }

        let binding = bindingString?.split(BINDING_NAME_SEPARATOR);
        let roleId = g_roleMap.get(binding?.[0]?.trim())?.id;
        let bindInfo = binding?.[1]?.split(BINDING_ELEMENT_SEPARATOR)
        if (roleId == null || !(bindInfo?.length > 5)) {
            console.log('missing format: ', bindingString);
            addUserMessageSingle('角色方案切换', '<b style="color:red;">无效的绑定信息，无法执行切换。</b>');
            roleSetupCompletion(true);
            return;
        }

        let cardInfo = await readCardInfoAsync(roleId, true);
        if (cardInfo == null) {
            addUserMessageSingle('角色方案切换', '<b style="color:red;">读取卡片信息失败，无法执行切换。</b>');
            roleSetupCompletion(true);
            return;
        }

        let roleInfo = await readCurrentRoleAsync(true);
        if (roleInfo == null) {
            addUserMessageSingle('角色方案切换', '<b style="color:red;">获取当前角色信息失败，无法执行切换。</b>');
            roleSetupCompletion(true);
            return;
        }

        let bindingEquipments = bindInfo.slice(0, 4);
        let bindingHalos = ((bindInfo[4] = bindInfo[4].trim()).length > 0 ? bindInfo[4].split(',') : []);
        let amuletGroups = ((bindInfo[5] = bindInfo[5].trim()).length > 0 ? bindInfo[5].split(',') : []);
        let points = bindInfo[6]?.split(',');
        let osPoints = Math.trunc((cardInfo.level * 3 + 6) * (1 + cardInfo.quality / 100));
        let osDistributions = [];
        if (points?.length >= 8 && points[0] == 'true' && points[1] == 'true') {
            let pts = points.slice(-6);
            for (let i = 0; i < 6; i++) {
                osPoints -= (pts[i] = parseInt(pts[i]));
            }
            if (osPoints > 0 && points.length > 8) {
                points[2].split('').forEach((i) => {
                    if ((i = parseInt(i)) >= 0 && i < 6 && osDistributions.indexOf(i) < 0) {
                        osDistributions.push(i);
                    }
                    else {
                        osPoints = -1;
                    }
                });
            }
            if (osPoints < 0) {
                addUserMessageSingle('角色方案切换', '<b style="color:red;">加点方案或自由点数分配信息无效，请检查。</b>');
                roleSetupCompletion(true);
                return;
            }
            points = pts;
        }
        else {
            points = [];
        }

        readConfig();

        let switchMethod = (g_configMap.get('solutionSwitchMethod')?.value ?? 0);
        let pointMethod = (g_configMap.get('solutionPointMethod')?.value ?? 0);
        let outstandingPointsMethod = (g_configMap.get('solutionOutstandingPointsMethod')?.value ?? 0);
        let currentEquipments = equipmentNodesToArray(roleInfo.equips);
        let equipmentOperationError = 0;
        let putonRequestsCount = 0;

        beginSwitch();

        function roleSetupCompletion(error) {
            httpRequestClearAll();
            genericPopupClose(true, true);

            if (fnPostProcess != null) {
                fnPostProcess(error, fnParams);
            }
        }

        function checkForRoleSetupCompletion() {
            if (genericPopupTaskCheckCompletion()) {
                // delay for the final state can be seen
                genericPopupTaskSetState(0);
                genericPopupTaskSetState(1);
                genericPopupTaskSetState(2);
                genericPopupTaskSetState(3);
                genericPopupTaskSetState(4);
                setTimeout(roleSetupCompletion, 200, equipmentOperationError > 0);
            }
        }

        function amuletLoadCompletion() {
            genericPopupTaskComplete(4);
            checkForRoleSetupCompletion();
        }

        function beginAmuletLoadGroups() {
            let groups = amuletGroups?.length;
            if (groups > 0) {
                genericPopupTaskSetState(4, `- 加载护符...（${groups} - 0 %）`);
                if (switchMethod == 0) {
                    beginLoadAmuletGroupFromStore(
                        null,
                        amuletGroups.shift(),
                        (total, count) => {
                            genericPopupTaskSetState(4, `- 加载护符...（${groups} - ${Math.trunc(count * 100 / total)} %）`);
                            return true;
                        },
                        beginAmuletLoadGroups,
                        null);
                }
                else {
                    beginLoadAmuletGroupsDiff(
                        amuletGroups,
                        (total, count, amuletCount) => {
                            genericPopupTaskSetState(4, `- 加载护符...（${amuletCount} - ${Math.trunc(count * 100 / total)} %）`);
                        },
                        amuletLoadCompletion,
                        null);
                }
            }
            else {
                amuletLoadCompletion();
            }
        }

        function beginLoadAmulets() {
            genericPopupTaskSetState(3);
            genericPopupTaskComplete(3, equipmentOperationError > 0);

            if (amuletGroups?.length > 0) {
                if (switchMethod == 0) {
                    genericPopupTaskSetState(4, '- 清理饰品...');
                    beginClearBag(
                        null,
                        null,
                        (total, count) => {
                            genericPopupTaskSetState(4, `- 清理饰品...（${count} / ${total}）`);
                            return true;
                        },
                        beginAmuletLoadGroups,
                        null);
                }
                else {
                    beginAmuletLoadGroups();
                }
            }
            else {
                amuletLoadCompletion();
            }
        }

        function putonEquipments(objects, fnPostProcess, fnParams) {
            if (objects?.length > 0) {
                let ids = [];
                while (ids.length < g_maxConcurrentRequests && objects.length > 0) {
                    ids.push(objects.pop());
                }
                if ((putonRequestsCount = ids.length) > 0) {
                    while (ids.length > 0) {
                        httpRequestBegin(
                            g_switchSolutionRequests.equip.request,
                            g_switchSolutionRequests.equip.data.replace('"+id+"', ids.shift()),
                            (response) => {
                                if (response.responseText.indexOf('已装备') < 0) {
                                    equipmentOperationError++;
                                    console.log(response.responseText);
                                }
                                if (--putonRequestsCount == 0) {
                                    putonEquipments(objects, fnPostProcess, fnParams);
                                }
                            });
                    }
                    return;
                }
            }
            if (fnPostProcess != null) {
                fnPostProcess(fnParams);
            }
        }

        function beginPutonEquipments() {
            genericPopupTaskSetState(3, '- 检查装备...');
            let equipsToPuton = [];
            for (let i = 0; i < 4; i++) {
                let equipInfo = (new Equipment()).fromEquipText(bindingEquipments[i]);
                if (equipInfo == null) {
                    console.log(bindingEquipments[i]);
                    addUserMessageSingle('角色方案切换', '<b style="color:red;">有装备格式错误，请重新检查绑定。</b>');
                    cancelSwitching();
                    return;
                }
                if (equipInfo.compareTo(currentEquipments[i]) != 0) {
                    equipsToPuton.push(equipInfo);
                }
            }
            if (equipsToPuton.length == 0) {
                beginLoadAmulets();
            }
            else {
                let store = [];
                beginReadObjects(null, store, scheduleEquipments, null);

                function scheduleEquipments() {
                    let eqIds = findEquipmentIds(store, equipsToPuton);
                    if (equipsToPuton.length == 0) {
                        genericPopupTaskSetState(3, `- 穿戴装备...（${eqIds.length}）`);
                        putonEquipments(eqIds, beginLoadAmulets, null);
                    }
                    else {
                        console.log(equipsToPuton);
                        addUserMessageSingle('角色方案切换', '<b style="color:red;">有装备不存在，请重新检查绑定。</b>');
                        cancelSwitching();
                    }
                }
            }
        }

        function beginSetupHalo() {
            if (bindingHalos?.length > 0) {
                let halo = [];
                bindingHalos.forEach((h) => {
                    let hid = g_haloMap.get(h.trim())?.id;
                    if (hid > 0) {
                        halo.push(hid);
                    }
                });
                if ((halo = halo.join(','))?.length > 0) {
                    genericPopupTaskSetState(2, '- 设置光环...');
                    httpRequestBegin(
                        g_switchSolutionRequests.halo.request,
                        g_switchSolutionRequests.halo.data.replace('"+savearr+"', halo),
                        (response) => {
                            genericPopupTaskSetState(2);
                            genericPopupTaskComplete(2, response.responseText != 'ok');
                            checkForRoleSetupCompletion();
                        });
                    return;
                }
            }
            genericPopupTaskComplete(2);
            checkForRoleSetupCompletion();
        }

        function cancelSwitching() {
            httpRequestAbortAll();
            genericPopupTaskAbort();
            roleSetupCompletion(true);
        }

        async function beginSwitch() {
            function beginRoleSetup() {
                beginSetupHalo();
                beginPutonEquipments();
            }

            function repointAsync() {
                return new Promise((resolve) => {
                    httpRequestBegin(
                        g_switchSolutionRequests.point.request,
                        g_switchSolutionRequests.point.data.replace('"+id+"', roleId).replace(
                            /&add(\d{2})=".+?\+"/g, (_, i) => `&add${i}=${points[parseInt(i) - 1]}`),
                        (response) => resolve(response.responseText.indexOf('未修改') >= 0 || response.responseText.indexOf('已完成') >= 0));
                });
            }

            function mountCardAsync() {
                return new Promise((resolve) => {
                    httpRequestBegin(
                        g_switchSolutionRequests.card.request,
                        g_switchSolutionRequests.card.data.replace('"+id+"', roleId),
                        (response) => resolve(response.responseText == 'ok' || response.responseText.indexOf('装备中') >= 0));
                });
            }

            genericPopupInitialize();
            genericPopupTaskListPopupSetup('切换中...', 300, [ '加点', '角色', '光环', '装备', '饰品' ], cancelSwitching);
            genericPopupShowModal(false);

            let repoint = false;
            if (points?.length == 6) {
                genericPopupTaskSetState(0, `- 检查加点...`);
                if (osPoints > 0) {
                    if (outstandingPointsMethod == 2) {
                        if (osDistributions.length == 0) {
                            let ia = [ 0, 1, 2, 3, 4, 5 ].sort((a, b) => points[b] - points[a]);
                            for (let i = 0; i < 6 && points[ia[i]] >= points[ia[0]]; i++) {
                                osDistributions.push(ia[i]);
                            }
                        }
                        let ptsd = Math.trunc(osPoints / osDistributions.length);
                        let ptsr = (osPoints % osDistributions.length);
                        let solutionPts = points.slice();
                        osDistributions.forEach((i, j) => {
                            points[i] += (ptsd + (j < ptsr));
                        });
                        addUserMessageSingle(
                            '角色方案切换',
                            `<b style="color:blue;">检测到自由点数（${osPoints}点）并执行自动分配：` +
                            `<br>&nbsp;&nbsp;&nbsp;&nbsp;方案加点（ ${solutionPts.join(', ')} ）` +
                            `<br>&nbsp;&nbsp;&nbsp;&nbsp;修正加点（ ${points.join(', ')} ）</b>`);
                    }
                    else if (repoint = (outstandingPointsMethod == 1)) {
                        addUserMessageSingle(
                            '角色方案切换',
                            `<b style="color:red;">警告，检测到自由点数（${osPoints}点），请检查。</b>`);
                    }
                }
                if (!repoint) {
                    for (let i = 0; i < 6; i++) {
                        if (repoint = (points[i] != cardInfo.points[i])) {
                            break;
                        }
                    }
                    if (repoint) {
                        if (pointMethod == 0 || cardInfo.repointLeft == 0) {
                            addUserMessageSingle(
                                '角色方案切换',
                                `<b style="color:red;">警告，加点不符（今日可用修改次数:${cardInfo.repointLeft}）：` +
                                `<br>&nbsp;&nbsp;&nbsp;&nbsp;方案加点（ ${points.join(', ')} ）` +
                                `<br>&nbsp;&nbsp;&nbsp;&nbsp;实际加点（ ${cardInfo.points.join(', ')} ）</b>`);
                        }
                        else {
                            genericPopupTaskSetState(0, `- 修改加点...`);
                            if (repoint = !(await repointAsync())) {
                                addUserMessageSingle(
                                    '角色方案切换',
                                    `<b style="color:red;">修改加点失败（今日可用修改次数:${cardInfo.repointLeft}），请检查。</b>`);
                            }
                        }
                    }
                }
            }
            if (!repoint) {
                genericPopupTaskSetState(0);
                genericPopupTaskComplete(0);
                if (roleId == roleInfo.meta.id) {
                    genericPopupTaskComplete(1);
                    beginRoleSetup();
                    return;
                }
                genericPopupTaskSetState(1, '- 切换角色...');
                if (await mountCardAsync()) {
                    genericPopupTaskSetState(1);
                    genericPopupTaskComplete(1);
                    beginRoleSetup();
                    return;
                }
                addUserMessageSingle('角色方案切换', '<b style="color:red;">切换角色失败。</b>');
            }
            cancelSwitching();
        }
    }

    let g_openGiftRequest;
    async function openGifts(openSequence, fnPostProcess, fnParams) {
        function openGiftsCompletion(gift) {
            genericPopupClose(true, true);

            if (fnPostProcess != null) {
                fnPostProcess(gift, fnParams);
            }
        }

        genericPopupInitialize();
        genericPopupShowProgressMessage();

        readConfig();

        let seq = (openSequence?.length > 0 ? openSequence : g_configMap.get('openCardSequence')?.value)?.replaceAll(/[ \+]/g, '');
        if (!(seq?.length > 0)) {
            addUserMessageSingle('翻牌', '<b style="color:red;">错误的调用参数。</b>');
            openGiftsCompletion();
            return;
        }
        if ((g_openGiftRequest ??= await getRequestInfoAsync('giftop', GuGuZhenRequest.user)) == null) {
            addUserMessageSingle('翻牌', '<b style="color:red;">无法获取请求接口。</b>');
            openGiftsCompletion();
            return;
        }
        let giftInfo = await readGiftZoneAsync(true);
        if (giftInfo == null) {
            addUserMessageSingle('翻牌', '<b style="color:red;">奖池获取失败。</b>');
            openGiftsCompletion();
            return;
        }
        else if (giftInfo.gift != null) {
            addUserMessageSingle('翻牌', `<b style="color:red;">已获取翻牌奖励（${giftInfo.gift}），无法再次获取。</b>`);
            openGiftsCompletion(giftInfo.gift);
            return;
        }

        seq = seq.split(',');
        let openPeek = seq?.[0]?.match(/\((.+?)\)/)?.[1];
        if (openPeek?.length > 0) {
            seq.shift();
            if (giftInfo.peek?.length > 0) {
                let i = seq.indexOf('1');
                if (i >= 0) {
                    seq.splice(i, 1);
                }
                i = seq.indexOf('-1');
                if (i >= 0) {
                    seq.splice(i, 1);
                }
                seq.unshift(openPeek.indexOf(giftInfo.peek) >= 0 ? '1' : '-1');
            }
        }

        let abs;
        let inc = 0;
        let exc = 0;
        let rnd = [];
        let dup = [];
        let openSeq = [];
        for (let e of seq) {
            if (e.length == 0 || e == '?') {
                if (++inc > 9) {
                    addUserMessageSingle('翻牌', '<b style="color:red;">翻牌序列定义错误，请检查。</b>');
                    openGiftsCompletion();
                    return;
                }
                rnd.push(openSeq.length);
                openSeq.push(0);
                continue;
            }
            else if ((!/^-?\d+$/.test(e) || (abs = Math.abs(e = parseInt(e))) < 1 || abs > 12 || dup[abs] != null) ||
                     (e < 0 && ++exc > 3) || (e > 0 && ++inc > 9)) {
                addUserMessageSingle('翻牌', '<b style="color:red;">翻牌序列定义错误，请检查。</b>');
                openGiftsCompletion();
                return;
            }
            else if (e > 0) {
                openSeq.push(e);
            }
            dup[abs] = true;
        }
        if (rnd.length > 0 || openSeq.length < 9) {
            let outstanding = [];
            for (let i = 1; i <= 12; i++) {
                if (!dup[i]) {
                    outstanding.push(i);
                }
            }
            for (let i = rnd.length - 1; i >= 0; i--) {
                let ri = Math.trunc(Math.random() * outstanding.length);
                openSeq[rnd[i]] = outstanding[ri];
                outstanding.splice(ri, 1);
            }
            while (openSeq.length < 9) {
                let ri = Math.trunc(Math.random() * outstanding.length);
                openSeq.push(outstanding[ri]);
                outstanding.splice(ri, 1);
            }
        }

        async function beginOpenCard(sequence) {
            if (sequence?.length > 0) {
                let id = sequence.shift();
                genericPopupUpdateProgressMessage(g_roles[id - 1].name + '...');
                httpRequestBegin(
                    g_openGiftRequest.request,
                    g_openGiftRequest.data.replace('"+id+"', id),
                    (response) => {
                        if (response.responseText?.length > 0) {
                            sequence = null;
                            addUserMessageSingle('翻牌', response.responseText);
                        }
                        beginOpenCard(sequence, fnPostProcess, fnParams);
                    });
            }
            else {
                giftInfo = await readGiftZoneAsync(true);
                openGiftsCompletion(giftInfo?.gift);
            }
        }

        beginOpenCard(openSeq);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // constants
    //
    ////////////////////////////////////////////////////////////////////////////////////////////////////

    const g_roles = [
        { index : -1 , id : 3000 , name : '舞' , hasG : true , shortMark : 'WU' },
        { index : -1 , id : 3001 , name : '默' , hasG : false , shortMark : 'MO' },
        { index : -1 , id : 3002 , name : '琳' , hasG : false , shortMark : 'LIN' },
        { index : -1 , id : 3003 , name : '艾' , hasG : false , shortMark : 'AI' },
        { index : -1 , id : 3004 , name : '梦' , hasG : false , shortMark : 'MENG' },
        { index : -1 , id : 3005 , name : '薇' , hasG : false , shortMark : 'WEI' },
        { index : -1 , id : 3006 , name : '伊' , hasG : false , shortMark : 'YI' },
        { index : -1 , id : 3007 , name : '冥' , hasG : false , shortMark : 'MING' },
        { index : -1 , id : 3008 , name : '命' , hasG : false , shortMark : 'MIN' },
        { index : -1 , id : 3009 , name : '希' , hasG : true , shortMark : 'XI' },
        { index : -1 , id : 3010 , name : '霞' , hasG : true , shortMark : 'XIA' },
        { index : -1 , id : 3011 , name : '雅' , hasG : true , shortMark : 'YA' }
    ];

    const g_roleMap = new Map();
    g_roles.forEach((item, index) => {
        item.index = index;
        g_roleMap.set(item.id, item);
        g_roleMap.set(item.id.toString(), item);
        g_roleMap.set(item.name, item);
        g_roleMap.set(item.shortMark, item);
    });

    const g_gemWorks = [
        {
            index : -1,
            name : '赶海',
            nameRegex : { line : 1 , regex : /^\d+贝壳$/ },
            progressRegex : { line : 1 , regex : /(\d+)/ },
            completionProgress : 1000000,
            unitRegex : { line : 4 , regex : /(\d+)/ },
            unitSymbol : '贝壳'
        },
        {
            index : -1,
            name : '随机装备箱',
            nameRegex : { line : 1 , regex : /^随机装备箱$/ },
            progressRegex : { line : 0 , regex : /(\d+\.?\d*)%?/ },
            completionProgress : 100,
            unitRegex : { line : 4 , regex : /(\d+\.?\d*)%?/ },
            unitSymbol : '%'
        },
        {
            index : -1,
            name : '灵魂药水',
            nameRegex : { line : 1 , regex : /^灵魂药水$/ },
            progressRegex : { line : 0 , regex : /(\d+\.?\d*)%?/ },
            completionProgress : 100,
            unitRegex : { line : 4 , regex : /(\d+\.?\d*)%?/ },
            unitSymbol : '%'
        },
        {
            index : -1,
            name : '宝石原石',
            nameRegex : { line : 1 , regex : /^宝石原石/ },
            progressRegex : { line : 0 , regex : /(\d+\.?\d*)%?/ },
            completionProgress : 100,
            unitRegex : { line : 4 , regex : /(\d+\.?\d*)%?/ },
            unitSymbol : '%'
        },
        {
            index : -1,
            name : '星沙',
            nameRegex : { line : 1 , regex : /^\d+星沙\(\d+\.?\d*\)/ },
            progressRegex : { line : 1 , regex : /\((\d+\.?\d*)\)/ },
            completionProgress : 10,
            precision : 0,
            unitRegex : { line : 4 , regex : /(\d+\.?\d*)/ },
            unitSymbol : ''
        },
        {
            index : -1,
            name : '幻影经验',
            nameRegex : { line : 1 , regex : /^\d+幻影经验$/ },
            progressRegex : { line : 1 , regex : /(\d+)/ },
            completionProgress : 200,
            precision : 0,
            unitRegex : { line : 4 , regex : /(\d+\.?\d*)/ },
            unitSymbol : ''
        }
    ];

    const g_gemMinWorktimeMinute = 8 * 60;
    const g_gemPollPeriodMinute = { min : 1 , max : 8 * 60 , default : 60 };
    const g_gemFailurePollPeriodSecond = 30;
    const g_gemWorkMap = new Map();
    g_gemWorks.forEach((item, index) => {
        item.index = index;
        item.alias = item.name;
        g_gemWorkMap.set(item.name, item);
    });

    function readGemWorkCompletionCondition() {
        let cond = g_configMap.get('gemWorkCompletionCondition');
        let conds = cond?.value?.split(',');
        let len = Math.min(conds?.length ?? 0, g_gemWorks.length);
        let error = 0;
        for (let i = len - 1; i >= 0; i--) {
            if ((conds[i] = conds[i].trim()).length > 0) {
                let comp = conds[i].match(new RegExp(`^${g_gemWorks[i].unitRegex.regex.source}$`))?.[1];
                if (!isNaN(comp = Number.parseFloat(comp))) {
                    g_gemWorks[i].completionProgress = comp;
                }
                else {
                    error++;
                }
            }
        }
        return error;
    }

    const g_halos = [
        { index : -1 , id : 101 , name : '启程之誓' , points : 0 , shortMark : 'SHI' },
        { index : -1 , id : 102 , name : '启程之心' , points : 0 , shortMark : 'XIN' },
        { index : -1 , id : 201 , name : '破壁之心' , points : 20 , shortMark : 'BI' },
        { index : -1 , id : 202 , name : '破魔之心' , points : 20 , shortMark : 'MO' },
        { index : -1 , id : 203 , name : '复合护盾' , points : 20 , shortMark : 'DUN' },
        { index : -1 , id : 204 , name : '鲜血渴望' , points : 20 , shortMark : 'XUE' },
        { index : -1 , id : 205 , name : '削骨之痛' , points : 20 , shortMark : 'XIAO' },
        { index : -1 , id : 206 , name : '圣盾祝福' , points : 20 , shortMark : 'SHENG' },
        { index : -1 , id : 207 , name : '恶意抽奖' , points : 20 , shortMark : 'E' },
        { index : -1 , id : 301 , name : '伤口恶化' , points : 30 , shortMark : 'SHANG' },
        { index : -1 , id : 302 , name : '精神创伤' , points : 30 , shortMark : 'SHEN' },
        { index : -1 , id : 303 , name : '铁甲尖刺' , points : 30 , shortMark : 'CI' },
        { index : -1 , id : 304 , name : '忍无可忍' , points : 30 , shortMark : 'REN' },
        { index : -1 , id : 305 , name : '热血战魂' , points : 30 , shortMark : 'RE' },
        { index : -1 , id : 306 , name : '点到为止' , points : 30 , shortMark : 'DIAN' },
        { index : -1 , id : 307 , name : '午时已到' , points : 30 , shortMark : 'WU' },
        { index : -1 , id : 308 , name : '纸薄命硬' , points : 30 , shortMark : 'ZHI' },
        { index : -1 , id : 309 , name : '不动如山' , points : 30 , shortMark : 'SHAN' },
        { index : -1 , id : 401 , name : '沸血之志' , points : 100 , shortMark : 'FEI' },
        { index : -1 , id : 402 , name : '波澜不惊' , points : 100 , shortMark : 'BO' },
        { index : -1 , id : 403 , name : '飓风之力' , points : 100 , shortMark : 'JU' },
        { index : -1 , id : 404 , name : '红蓝双刺' , points : 100 , shortMark : 'HONG' },
        { index : -1 , id : 405 , name : '荧光护盾' , points : 100 , shortMark : 'JUE' },
        { index : -1 , id : 406 , name : '后发制人' , points : 100 , shortMark : 'HOU' },
        { index : -1 , id : 407 , name : '钝化锋芒' , points : 100 , shortMark : 'DUNH' },
        { index : -1 , id : 408 , name : '自信回头' , points : 100 , shortMark : 'ZI' },
        { index : -1 , id : 1101 , name : '致命节奏' , points : 120 , shortMark : 'JIE' },
        { index : -1 , id : 1102 , name : '往返车票' , points : 120 , shortMark : 'PIAO' },
        { index : -1 , id : 1103 , name : '天降花盆' , points : 120 , shortMark : 'PEN' }
    ];

    const g_haloMap = new Map();
    g_halos.forEach((item, index) => {
        item.index = index;
        g_haloMap.set(item.id, item);
        g_haloMap.set(item.id.toString(), item);
        g_haloMap.set(item.name, item);
        g_haloMap.set(item.shortMark, item);
    });

    const g_configs = [
        {
            index : -1,
            id : 'checkGameUpdate',
            name : '刷新页面时检查游戏更新（0：禁用，1：仅首页，2：所有页面）',
            defaultValue : 1,
            value : 1,
            tips : '执行游戏页面刷新时按设定方式自动检查更新日志。页面刷新指整个页面重新加载而非页面局部内容更新。一般而言点击浏览器刷新按钮或游戏页面' +
                   '最上方导航按钮都将触发页面刷新。',
            validate : ((value) => {
                return /^[0-2]$/.test(value);
            }),
            onchange : ((value) => {
                if (/^[0-2]$/.test(value)) {
                    return parseInt(value);
                }
                return 0;
            })
        },
        {
            index : -1,
            id : 'webRequestAPI',
            name : `网络请求接口（0：自动，1：沙盒，2：jQuery，3：WebAPI）`,
            defaultValue : AJAXRequestAPI.jQuery,
            value : AJAXRequestAPI.jQuery,
            tips : '向服务器提交异步请求时所使用的接口。如果设置为自动（默认），则当插件运行于沙盒（默认）模式下时使用沙盒接口，运行于非沙盒模式下时使用' +
                   'jQuery接口；如果插件运行于非沙盒模式下而设置为使用沙盒接口则实际将使用jQuery接口。WebAPI为系统底层接口，沙盒接口及jQuery接口均基' +
                   '于它进行封装。原则上出于安全性考虑一般设置为自动即可，只有在特殊情况下（例如某些浏览器本身支脚本插件但对沙盒接口支持不完整）才需要明' +
                   '确设置使用jQuery甚至WebAPI接口。注意，此设置将应用于所有依赖于本插件的其它插件。判断本插件运行模式的方法为：在咕咕镇首页左下区域查' +
                   '看“插件版本”，如果版本号末尾有“(RP)”字样则说明为非沙盒模式，否则为沙盒模式。',
            validate : ((value) => {
                return (/^[0-3]$/.test(value));
            }),
            onchange : ((value) => {
                if (!(/^[0-3]$/.test(value))) {
                    value = 0;
                }
                if ((value = parseInt(value)) == AJAXRequestAPI.auto) {
                    g_ajaxRequestAPI = (g_isInSandBox ? AJAXRequestAPI.sandBox : AJAXRequestAPI.jQuery);
                }
                else if (value == AJAXRequestAPI.sandBox && !g_isInSandBox) {
                    g_ajaxRequestAPI = AJAXRequestAPI.jQuery;
                }
                else {
                    g_ajaxRequestAPI = value;
                }
                return value;
            })
        },
        {
            index : -1,
            id : 'maxConcurrentRequests',
            name : `最大并发网络请求（${ConcurrentRequestCount.min} - ${ConcurrentRequestCount.max}）`,
            defaultValue : ConcurrentRequestCount.default,
            value : ConcurrentRequestCount.default,
            tips : '向服务器提交的并发请求的最大数量。过高的设置容易引起服务阻塞或被认定为DDOS攻击从而导致服务器停止服务（HTTP 503）。',
            validate : ((value) => {
                return (!isNaN(value = parseInt(value)) && value >= ConcurrentRequestCount.min && value <= ConcurrentRequestCount.max);
            }),
            onchange : ((value) => {
                if (!isNaN(value = parseInt(value)) && value >= ConcurrentRequestCount.min && value <= ConcurrentRequestCount.max) {
                    return (g_maxConcurrentRequests = value);
                }
                return (g_maxConcurrentRequests = ConcurrentRequestCount.default);
            })
        },
        {
            index : -1,
            id : 'solutionSwitchMethod',
            name : '方案切换方式（0：完全，1：差分）',
            defaultValue : 1,
            value : 1,
            tips : '执行绑定方案切换时所要使用的方法。“完全切换”和“差分切换”的主要区别在于护符组的加载方式，完全切换方式总是首先清空饰品栏然后按照绑定' +
                   '定义中指定的加载顺序逐项加载护符组，优点是优先级较高的组会先行加载，当饰品栏空间不足时不完全加载的组一般为优先级较低的组，而缺点则' +
                   '是加载效率较低；差分切换方式会忽略护符组的优先级，首先卸载已经在饰品栏中但并不在方案中的护符而留下重叠部分，然后加载缺失的护符，但' +
                   '加载顺序随机，这意味着当饰品栏空间不足时可能出现重要护符未能加载的情况，但这种加载方式效率较高（尤其是在护符重叠较多的方案间切换时）。' +
                   '正常情况下由于当前版本的饰品栏空间较为固定，所以绑定方案不应使用多于饰品栏空间的护符数量，而在这种情况下差分加载方式具有明显的优势。',
            validate : ((value) => {
                return /^[01]$/.test(value);
            }),
            onchange : ((value) => {
                if (/^[01]$/.test(value)) {
                    return parseInt(value);
                }
                return 0;
            })
        },
        {
            index : -1,
            id : 'solutionPointMethod',
            name : '方案加点切换方式（0：仅检查，1：按需修改）',
            defaultValue : 0,
            value : 0,
            tips : '执行绑定方案切换时，如果方案同时指定了加点方式，则可能会涉及加点修改。加点修改目前有每日次数限制，所以务须谨慎设置此选项以免遭遇意外' +
                   '损失。此选项为“0”时方案切换仅检查绑定加点与当前加点是否一致并根据结果按需提示；设为“1”时若检测到绑定加点与当前加点不同则尝试修改当' +
                   '前加点，失败则提示（例如当日加点修改次数用尽时），所以需特别注意当日加点修改次数的使用情况以防意外。方案未绑定加点方式时，此设置不影' +
                   '响切换过程。',
            validate : ((value) => {
                return /^[01]$/.test(value);
            }),
            onchange : ((value) => {
                if (/^[01]$/.test(value)) {
                    return parseInt(value);
                }
                return 0;
            })
        },
        {
            index : -1,
            id : 'solutionOutstandingPointsMethod',
            name : '方案自由点数处理方式（0：忽略，1：中断，2：自动分配）',
            defaultValue : 0,
            value : 0,
            tips : '在进行方案加点绑定时未使用全部可用点数，或角色等级、品质提升时会增加可用点数上限，此类情况下将产生未分配的自由点数。此选项为“0”时' +
                   '表示自由点数将被忽略，由玩家手动处理；设为“1”时如果在切换过程中检测到存在未分配的自由点数即中止切换过程并提示；设为“2”时则由切换' +
                   '过程依据方案绑定时所设定的“平均分配自由点数”各项执行平均分配，如果“平均分配自由点数”未选定任何项，则会将自由点合并加入配点最多的' +
                   '项（有多个最大项时则在这些项间执行平均分配）并提示。请注意，本设置仅在方案切换过程中起作用，并不会修改方案绑定数据，且可能产生意外' +
                   '的加点修改次数消耗；根据“方案加点切换方式”设置（设为“0”时），还可能因自由点数自动分配而导致加点一致性检查不通过的情况发生。',
            validate : ((value) => {
                return /^[012]$/.test(value);
            }),
            onchange : ((value) => {
                if (/^[012]$/.test(value)) {
                    return parseInt(value);
                }
                return 0;
            })
        },
        {
            index : -1,
            id : 'listNamesOnInputAmuletGroupName',
            name : '输入护符组名称时列表显示等待时长（0：禁止，50-1000：毫秒）',
            defaultValue : 0,
            value : 0,
            tips : '在任意要求输入护符组名称时输入框背景可改变为已定义的护符组名称列表，这将遮挡整个窗口原本显示内容，而且由于输入框为模态对话框，所以' +
                   '除输入框外其它元素均不可操作，亦无法滚动显示内容，所以如果已定义的护符组较多或有较长组名称时可能会导致显示不全。此设置为0时为不启用' +
                   '此功能，启用时一般设为50-100为佳。已知问题：由于浏览器延时机制及任务调度的随机性，此功能可能会出现偶发性工作不正常（背景无改变），' +
                   '通常为延时不足所致，一般取消输入后重新进入输入状态即可恢复，如果频繁出现则需尝试设置更长的延时值。',
            validate : ((value) => {
                return (/^\d+$/.test(value) && (value = parseInt(value)) == 0 || (value >= 50 && value <= 1000));
            }),
            onchange : ((value) => {
                if ((/^\d+$/.test(value) && (value = parseInt(value)) == 0 || (value >= 50 && value <= 1000))) {
                    return value;
                }
                return 0;
            })
        },
        {
            index : -1,
            id : 'singlePotRecovery',
            name : '以单瓶方式使用体能刺激药水（0：禁止，1：允许）',
            defaultValue : 1,
            value : 1,
            tips : '以单瓶方式使用体能刺激药水可再一次获得翻牌的贝壳和经验奖励（仅基础奖励，无道具），无需重新出击和翻牌。此方式对于药水充足且出击胜率高' +
                   '的玩家并非最佳选择，将此选项设为0可防止点错。',
            validate : ((value) => {
                return /^[01]$/.test(value);
            }),
            onchange : ((value) => {
                if (/^[01]$/.test(value)) {
                    return parseInt(value);
                }
                return 0;
            })
        },
        {
            index : -1,
            id : 'makeTopWishOnly',
            name : '许愿时只允许投入最高档（0：否，1：是）',
            defaultValue : 0,
            value : 0,
            tips : '在许愿时只有投入最高档系统才会给予额外福利，将本选项设置为“1”以防止误投除最高档以外的其它档从而错失福利（土豪专用，穷人请设“0”）。',
            validate : ((value) => {
                return /^[01]$/.test(value);
            }),
            onchange : ((value) => {
                if (/^[01]$/.test(value)) {
                    return parseInt(value);
                }
                return 0;
            })
        },
        {
            index : -1,
            id : 'openCardSequence',
            name : `一键翻牌次序（(透视),整数 ±(1-12) 组成的无重复序列或留空）`,
            defaultValue : '',
            value : '',
            tips : '一键翻牌时的开牌次序，此设置留空时（所有空格字符将被过滤）将不显示一键翻牌相关面板。序列中禁止出现绝对值重复的元素，负数表示排除某张牌，可' +
                   '出现在任意位置且不占位，排除个数须不大于3。由于最多只需翻开9张牌必定会出现三同色，所以正数及随机元素个数须不大于9，不足9时程序将在开牌时按' +
                   '需随机补足。单个元素也可设置为随机，只需将该元素设置为无内容和/或单个“?”即可。在设置的起始部分可以用“(传说史诗)”（不包括引号但包括半角括' +
                   '弧）类似形式的元素指定在有透视福利的段位对首张卡片的处理，如果透视卡片与设定匹配则会被首先翻开，否则不会翻开。此设置优先级高于随后序列中对' +
                   '透视卡片的设置：若透视匹配，即使随后包含“-1”也会翻开；若透视不匹配随后即使有“1”也将被忽略。在无透视福利的段位此元素将被忽略。' +
                   '例：“?”=“,”=全随机；“-12”=排除绮，其余全随机；“-1,12,,6,-2,,?,5”=排除舞和默，依次翻开：绮、随机、薇、随机、随机、梦、随机到底；' +
                   '“(传说),-1”=透视传说首卡翻开，无透视或透视非传说首卡不翻，其余随机到底。开牌过程中任意时刻出现三同色或错误即终止。',
            validate : ((value) => {
                let seq = value.replaceAll(/[ \+]/g, '').split(',');
                let openPeek = seq?.[0]?.match(/\(.+?\)/)?.[0];
                if (openPeek?.length > 0) {
                    seq.shift();
                }
                let abs;
                let inc = 0;
                let exc = 0;
                let dup = [];
                for (let e of seq) {
                    if (e.length == 0 || e == '?') {
                        if (++inc > 9) {
                            return false;
                        }
                        continue;
                    }
                    else if ((!/^-?\d+$/.test(e) || (abs = Math.abs(e = parseInt(e))) < 1 || abs > 12 || dup[abs] != null) ||
                             (e < 0 && ++exc > 3) || (e > 0 && ++inc > 9)) {
                        return false;
                    }
                    dup[abs] = true;
                }
                return true;
            }),
            onchange : ((value) => {
                let seq = (value = value.replaceAll(/[ \+]/g, '')).split(',');
                let openPeek = seq?.[0]?.match(/\(.+?\)/)?.[0];
                if (openPeek?.length > 0) {
                    seq.shift();
                }
                let abs;
                let inc = 0;
                let exc = 0;
                let dup = [];
                for (let e of seq) {
                    if (e.length == 0 || e == '?') {
                        if (++inc > 9) {
                            return '';
                        }
                        continue;
                    }
                    else if ((!/^-?\d+$/.test(e) || (abs = Math.abs(e = parseInt(e))) < 1 || abs > 12 || dup[abs] != null) ||
                             (e < 0 && ++exc > 3) || (e > 0 && ++inc > 9)) {
                        return '';
                    }
                    dup[abs] = true;
                }
                return value;
            })
        },
        {
            index : -1,
            id : 'maxEquipForgeHistoryList',
            name : `锻造历史记录数限制（0 - 100）`,
            defaultValue : 15,
            value : 15,
            tips : '锻造历史记录的条目数限制，0为不保存。当记录数超出限制时将按照锻造顺序移除较早的记录。除非您有特殊需求，否则此项设置不宜过大，15 ~ 30' +
                   '可能是较为平衡的选择。',
            validate : ((value) => {
                return (!isNaN(value = parseInt(value)) && value >= 0 && value <= 100);
            }),
            onchange : ((value) => {
                if (!isNaN(value = parseInt(value)) && value >= 0 && value <= 100) {
                    return value;
                }
                return 15;
            })
        },
        {
            index : -1,
            id : 'markEquipmentNotMeetPrediction',
            name : `标记不符合预测公式计算结果的装备（0：否，1：是）`,
            defaultValue : 0,
            value : 0,
            tips : '由于装备词条属性计算公式并不公开，所以插件只能使用尽可能符合大多数显示计算结果的预测公式。由于预测公式与实际公式可能存在差异，而且即使预测' +
                   '符合实际仍然有可能存在因不同程序语言使用不同的优化计算方式而导致的浮点数误差，所以会出现个别装备的个别词条属性的显示值与插件的预测值不一致' +
                   '的情况，这些差异仅表现在显示方面，并不会影响装备在战斗中的实际效果。此设置值为1时插件会在穿戴、仓库、沙滩等位置对装备进行预测公式验证，不能' +
                   '通过验证的装备将被标记（粉紫色边框，代表预测公式的反例）；而设置为0时则不予标记（仅在控制台输出）。此功能主要用于插件排错及计算公式验证，对' +
                   '游戏本身并无实际影响。',
            validate : ((value) => {
                return /^[01]$/.test(value);
            }),
            onchange : ((value) => {
                if (/^[01]$/.test(value)) {
                    return parseInt(value);
                }
                return 0;
            })
        },
        {
            index : -1,
            id : 'pkButtonProtection',
            name : `战斗页面防误触控制（按钮序号=按钮名称,……，或留空）`,
            defaultValue : '',
            value : '',
            tips : '此选项并不直接控制战斗页面各种操作的可用性，而是设置在战斗页面为相应操作显示可用性控制的勾选项。其中“按钮序号”为操作对应按钮的实际相对位置' +
                   '（0为起始位置，咕咕镇当前版本中0对应“攻击玩家”，1对应“攻击野怪”，2对应“战斗记录”），“按钮名称”为您习惯使用的操作称谓，在战斗页面将作为勾' +
                   '选项名称显示，但其中不可包含“=”及“,”等会引起歧义的字符。例如“1=PVE”或“0=打人,1=打野,2=刷记录”均符合格式要求。这些选项在战斗页面被勾选' +
                   '后方可进行相应操作，且勾选项的状态不会被持久保存，每次进入或刷新战斗页面时这些勾选项均将被重置为未勾选状态，必须重新勾选后相应操作才可用。' +
                   '本选项中未出现的操作将不会在战斗页面进行控制，其状态与咕咕镇默认实现相同。请注意，所有这些设置及控制都只对手动点击按钮操作有效，对其它形式' +
                   '的触发（如插件代码访问等）均无影响。',
            validate : ((value) => {
                if (value?.trim().length > 0) {
                    let ops = value.split(',');
                    for (let i = ops.length - 1; i >= 0; i--) {
                        let op = ops[i].split('=');
                        if (op.length != 2 || isNaN(parseInt(op[0])) || op[1].trim().length == 0) {
                            return false;
                        }
                    }
                }
                return true;
            }),
            onchange : ((value) => {
                if (value?.trim().length > 0) {
                    let ops = value.split(',');
                    for (let i = ops.length - 1; i >= 0; i--) {
                        let op = ops[i].split('=');
                        if (op.length != 2 || isNaN(parseInt(op[0])) || op[1].trim().length == 0) {
                            return '';
                        }
                    }
                }
                return value;
            })
        },
        {
            index : -1,
            id : 'minBeachEquipLevelToAmulet',
            name : `沙滩装备转护符最小等级（绿,黄,红）`,
            defaultValue : '1,1,1',
            value : '1,1,1',
            tips : '沙滩装备批量转换护符时各色装备所需达到的最小等级，小于对应等级的装备不会被转换，但玩家依然可以选择手动熔炼。',
            validate : ((value) => {
                return /^\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*$/.test(value);
            }),
            onchange : ((value) => {
                if (/^\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*$/.test(value)) {
                    return value;
                }
                return '1,1,1';
            })
        },
        {
            index : -1,
            id : 'minBeachAmuletPointsToStore',
            name : `沙滩转护符默认入仓最小加成（苹果,葡萄,樱桃）`,
            defaultValue : '1,1%,1%',
            value : '1,1%,1%',
            tips : '沙滩装备批量转换护符时默认处于入仓列表的最小加成，“%”可省略。此设置仅为程序产生分类列表时作为参考，玩家可通过双击或以上下文菜单键单击' +
                   '特定护符移动它的位置。',
            validate : ((value) => {
                return /^\s*\d+\s*,\s*\d+\s*%?\s*,\s*\d+\s*%?\s*$/.test(value);
            }),
            onchange : ((value) => {
                if (/^\s*\d+\s*,\s*\d+\s*%?\s*,\s*\d+\s*%?\s*$/.test(value)) {
                    return value;
                }
                return '1,1%,1%';
            })
        },
        {
            index : -1,
            id : 'clearBeachAfterBatchToAmulet',
            name : `批量转护符完成后自动清理沙滩（0：否，1：是）`,
            defaultValue : 0,
            value : 0,
            tips : '沙滩装备批量转换护符完成后自动清理沙滩上残存的装备。装备一但被清理将转换为各种锻造石且不可恢复，当此选项开启时请务必确保在使用批量转护符' +
                   '功能之前拾取所有欲保留的装备。',
            validate : ((value) => {
                return /^[01]$/.test(value);
            }),
            onchange : ((value) => {
                if (/^[01]$/.test(value)) {
                    return parseInt(value);
                }
                return 0;
            })
        },
        {
            index : -1,
            id : 'gemPollPeriod',
            name : `宝石工坊挂机轮询周期（0：禁用，1-${Math.min(g_gemPollPeriodMinute.max, g_gemMinWorktimeMinute)}：分钟）`,
            defaultValue : g_gemPollPeriodMinute.default,
            value : g_gemPollPeriodMinute.default,
            tips : '宝石工坊挂机程序向服务器发出进度轮询请求的间隔时间，以分钟为单位。0表示禁用挂机程序，同时各工作台完工剩余时间和工会面板也将不会显示。此项设置越' +
                   '小对服务器造成的压力越大，除非您一直盯着宝石工坊的页面（这种情况建议手动按需刷新），否则您不会因较小的设置值获得任何额外优势，因为挂机程序会根据' +
                   '工作进度动态调整轮询时间间隔以便及时收工重开。所以如果您的需求只是单纯的自动收工重开则建议设置为最大值。唯一例外是当您的设备时钟走时明显偏慢，小' +
                   '时误差达到分钟级别时可根据情况适当调小设置，推荐公式为“期望时间 - 期望时间内可能产生的最大正误差”。如果您的设备时钟偏快则在设为最大值的情况下无' +
                   '需进行任何额外调整。',
            validate : ((value) => {
                return (!isNaN(value = parseInt(value)) && value <= g_gemPollPeriodMinute.max);
            }),
            onchange : ((value) => {
                if (!isNaN(value = parseInt(value)) && value <= g_gemPollPeriodMinute.max) {
                    return value;
                }
                return g_gemPollPeriodMinute.default;
            })
        },
        {
            index : -1,
            id : 'gemWorkCompletionCondition',
            name : `宝石工坊完工条件（按工作台顺序以“,”分隔或留空）`,
            defaultValue : '',
            value : '',
            tips : '宝石工坊运作过程中挂机程序对各工作台进行完工判定的条件，按照工作台次序以“,”分隔，“%”可省略。也可以单项或全部留空表示使用默认值（目前贝壳1000000，' +
                   '星沙10，幻影经验200，其它100%）。在满足基本收工条件后（目前为开工满8小时），此设置将被挂机程序直接用于自动收工判定。请注意，设置程序只进行格式检' +
                   '查，并不会对有效值范围作出任何假设，所以一个错误的设置可能会令完工判定逻辑失效从而影响自动收工功能的正确运行。',
            validate : ((value) => {
                let conds = value.split(',');
                if (conds.length > g_gemWorks.length) {
                    return false;
                }
                for (let i = conds.length - 1; i >= 0; i--) {
                    if ((conds[i] = conds[i].trim()).length > 0 && !(new RegExp(`^${g_gemWorks[i].unitRegex.regex.source}$`)).test(conds[i])) {
                        return false;
                    }
                }
                return true;
            }),
            onchange : ((value) => {
                let conds = value.split(',');
                if (conds.length > g_gemWorks.length) {
                    return '';
                }
                for (let i = conds.length - 1; i >= 0; i--) {
                    if ((conds[i] = conds[i].trim()).length > 0 && !(new RegExp(`^${g_gemWorks[i].unitRegex.regex.source}$`)).test(conds[i])) {
                        return '';
                    }
                }
                return value;
            })
        },
        {
            index : -1,
            id : 'equipShortMarkReplacement',
            name : `装备简称导出替换（默认=替换,……，或留空）`,
            defaultValue : '',
            value : '',
            tips : '如果有其它插件或应用程序需使用“导出计算器”功能时，您可定义某些装备简称的默认值替换规则以符合目标软件的要求。规则的设置格式为“默认1=简称1,' +
                   '默认2=简称2,……,默认n=简称n”（不包括双引号，内容区分大小写，且“=”及“,”须为半角字符），其中“默认x”须为插件中有定义的装备名称或简称，相同' +
                   '装备的默认名称及简称是等价的，即设置串“反叛者的刺杀弓=ABOW”与“ASSBOW=ABOW”完全等价。“简称x”由目标软件所规定，其值不可包含半角“=”及“,”，' +
                   '亦不可为0长度或全空格。如果您同时使用了主题包插件，则主题包插件中的装备名称将被视同默认装备名称。',
            validate : ((value) => {
                if (value?.trim().length > 0) {
                    let rps = value.split(',');
                    for (let i = rps.length - 1; i >= 0; i--) {
                        let rp = rps[i].split('=');
                        if (rp.length != 2 || !g_equipMap.has(rp[0].trim()) || rp[1].trim().length == 0) {
                            return false;
                        }
                    }
                }
                return true;
            }),
            onchange : ((value) => {
                if (value?.trim().length > 0) {
                    let rps = value.split(',');
                    for (let i = rps.length - 1; i >= 0; i--) {
                        let meta;
                        let rp = rps[i].split('=');
                        if (rp.length != 2 || (meta = g_equipMap.get(rp[0].trim())) == null ||
                            (meta.exportAlias = rp[1].trim()).length == 0) {

                            g_equipments.forEach((eq) => { delete eq.exportAlias; });
                            return '';
                        }
                    }
                }
                return value;
            })
        },
        {
            index : -1,
            id : 'haloShortMarkReplacement',
            name : `光环技能简称导出替换（默认=替换,……，或留空）`,
            defaultValue : '',
            value : '',
            tips : '如果有其它插件或应用程序需使用“导出计算器”功能时，您可定义某些光环技能简称的默认值替换规则以符合目标软件的要求。规则的设置格式为“默认1=简称1,' +
                   '默认2=简称2,……,默认n=简称n”（不包括双引号，内容区分大小写，且“=”及“,”须为半角字符），其中“默认x”须为插件中有定义的光环技能名称或简称，' +
                   '相同光环技能的默认名称及简称是等价的，即设置串“不动如山=BU”与“SHAN=BU”完全等价。“简称x”由目标软件所规定，其值不可包含半角“=”及“,”，' +
                   '亦不可为0长度或全空格。',
            validate : ((value) => {
                if (value?.trim().length > 0) {
                    let rps = value.split(',');
                    for (let i = rps.length - 1; i >= 0; i--) {
                        let rp = rps[i].split('=');
                        if (rp.length != 2 || !g_haloMap.has(rp[0].trim()) || rp[1].trim().length == 0) {
                            return false;
                        }
                    }
                }
                return true;
            }),
            onchange : ((value) => {
                if (value?.trim().length > 0) {
                    let rps = value.split(',');
                    for (let i = rps.length - 1; i >= 0; i--) {
                        let meta;
                        let rp = rps[i].split('=');
                        if (rp.length != 2 || (meta = g_haloMap.get(rp[0].trim())) == null ||
                            (meta.exportAlias = rp[1].trim()).length == 0) {

                            g_halos.forEach((halo) => { delete halo.exportAlias; });
                            return '';
                        }
                    }
                }
                return value;
            })
        },
        {
            index : -1,
            id : 'amuletBuffShortMarkReplacement',
            name : `护符词条简称导出替换（默认=替换,……，或留空）`,
            defaultValue : '',
            value : '',
            tips : '如果有其它插件或应用程序需使用“导出护符”或“导出计算器”功能时，您可定义某些护符词条简称的默认值替换规则以符合目标软件的要求。规则的设置格式为' +
                   '“默认1=简称1,默认2=简称2,……,默认n=简称n”（不包括双引号，内容区分大小写，且“=”及“,”须为半角字符），其中“默认x”须为插件中有定义的护符词条' +
                   '名称或简称，相同护符词条的默认名称及简称是等价的，即设置串“全属性=ALL”与“AAA=ALL”完全等价。“简称x”由目标软件所规定，其值不可包含半角' +
                   '“=”及“,”，亦不可为0长度或全空格。',
            validate : ((value) => {
                if (value?.trim().length > 0) {
                    let rps = value.split(',');
                    for (let i = rps.length - 1; i >= 0; i--) {
                        let rp = rps[i].split('=');
                        if (rp.length != 2 || !g_amuletBuffMap.has(rp[0].trim()) || rp[1].trim().length == 0) {
                            return false;
                        }
                    }
                }
                return true;
            }),
            onchange : ((value) => {
                if (value?.trim().length > 0) {
                    let rps = value.split(',');
                    for (let i = rps.length - 1; i >= 0; i--) {
                        let meta;
                        let rp = rps[i].split('=');
                        if (rp.length != 2 || (meta = g_amuletBuffMap.get(rp[0].trim())) == null ||
                            (meta.exportAlias = rp[1].trim()).length == 0) {

                            g_amuletBuffs.forEach((buff) => { delete buff.exportAlias; });
                            return '';
                        }
                    }
                }
                return value;
            })
        },
    ];

    const g_configMap = new Map();
    g_configs.forEach((item, index) => {
        item.index = index;
        g_configMap.set(item.id, item);
    });

    function readConfig() {
        let udata = loadUserConfigData();
        g_configs.forEach((item) => {
            item.value = (item.onchange?.call(null, udata.config[item.id] ?? item.defaultValue));
        });
        return udata;
    }

    function modifyConfig(title, reload, ...configIds) {
        title ??= '插件设置';
        let udata = readConfig();
        let configs = (configIds?.length > 0 ? [] : g_configs);
        if (configIds?.length > 0) {
            for (let id of configIds) {
                let cfg = g_configMap.get(id);
                if (cfg != null) {
                    configs.push(cfg);
                }
            }
        }

        genericPopupInitialize();

        let fixedContent =
            '<div style="padding:20px 10px 10px 0px;color:blue;font-size:16px;"><b>请勿随意修改配置项，' +
            `除非您知道它的准确用途并且设置为正确的值，否则可能导致插件工作异常<span id="${g_genericPopupInformationTipsId}" ` +
            'style="float:right;color:red;"></span></b></div>';
        let mainContent =
            `<style> #config-table { width:100%; }
                         #config-table th { width:25%; line-height:240%; }
                         #config-table th.config-name { width:60%; }
                         #config-table th.config-button { width:15%; }
                         #config-table button.config-restore-value { width:48%; float:right; margin-left:1px; }
                         #config-table tr.alt { background-color:${g_genericPopupBackgroundColorAlt}; } </style>
                 <div class="${g_genericPopupTopLineDivClass}"><table id="config-table">
                 <tr class="alt"><th class="config-name">配置项 （在项名称或值输入框上悬停查看说明）</th><th>值</th>
                 <th class="config-button"></th></tr></table><div>`;

        genericPopupSetFixedContent(fixedContent);
        genericPopupSetContent(title, mainContent);

        let configTable = genericPopupQuerySelector('#config-table');
        configs.forEach((item, index) => {
            let tr = document.createElement('tr');
            tr.className = ('config-tr' + ((index & 1) == 0 ? '' : ' alt'));
            tr.setAttribute('config-item', item.id);
            tr.innerHTML =
                `<td><div data-toggle="popover" data-placement="bottom" data-trigger="hover" data-content="${item.tips}">${item.name}<div></td>
                     <td><div data-toggle="popover" data-placement="bottom" data-trigger="hover" data-content="${item.tips}">
                         <input type="text" style="display:inline-block;width:100%;" value="${item.value}" /><div></td>
                     <td><button type="button" class="config-restore-value" title="重置为当前配置" value="${item.value}">当前</button>` +
                `<button type="button" class="config-restore-value" title="重置为默认配置" value="${item.defaultValue}">默认</button></td>`;
            tr.children[1].children[0].children[0].oninput = tr.children[1].children[0].children[0].onchange = validateInput;
            configTable.appendChild(tr);
        });
        function validateInput(e) {
            let tr = e.target.parentElement.parentElement.parentElement;
            let cfg = g_configMap.get(tr.getAttribute('config-item'));
            tr.style.color = ((cfg.validate?.call(null, e.target.value) ?? true) ? 'black' : 'red');
        }

        configTable.querySelectorAll('button.config-restore-value').forEach((btn) => { btn.onclick = restoreValue; });
        function restoreValue(e) {
            let input = e.target.parentElement.parentElement.children[1].children[0].children[0];
            input.value = e.target.value;
            input.oninput({ target : input });
            genericPopupShowInformationTips('配置项已' + e.target.title, 5000);
        }

        $('#config-table div[data-toggle="popover"]').popover();

        genericPopupAddButton('重置为当前配置', 0, restoreValueAll, true).setAttribute('config-restore-default-all', 0);
        genericPopupAddButton('重置为默认配置', 0, restoreValueAll, true).setAttribute('config-restore-default-all', 1);
        function restoreValueAll(e) {
            let defaultValue = (e.target.getAttribute('config-restore-default-all') == '1');
            configTable.querySelectorAll('tr.config-tr').forEach((row) => {
                let id = row.getAttribute('config-item');
                let cfg = g_configMap.get(id);
                let input = row.children[1].children[0].children[0];
                input.value = (defaultValue ? cfg.defaultValue : (cfg.value ?? cfg.defaultValue));
                input.oninput({ target : input });
            });
            genericPopupShowInformationTips('全部配置项已' + e.target.innerText, 5000);
        }

        genericPopupAddButton('保存', 80, saveConfig, false).setAttribute('config-save-config', 1);
        genericPopupAddButton('确认', 80, saveConfig, false).setAttribute('config-save-config', 0);
        function saveConfig(e) {
            let close = (e.target.getAttribute('config-save-config') == '0');
            let config = (udata?.config ?? {});
            let error = [];
            configTable.querySelectorAll('tr.config-tr').forEach((row) => {
                let id = row.getAttribute('config-item');
                let cfg = g_configMap.get(id);
                let value = row.children[1].children[0].children[0].value;
                if (cfg.validate?.call(null, value) ?? true) {
                    config[id] = cfg.value = row.children[2].children[0].value = (cfg.onchange?.call(null, value) ?? value);
                }
                else {
                    error.push(cfg.name);
                }
            });

            udata.config = config;
            saveUserConfigData(udata);

            if (error.length > 0) {
                alert('以下配置项输入内容有误，如有必要请重新设置：\n\n    [ ' + error.join(' ]\n    [ ') + ' ]');
            }
            else if (close) {
                if (reload) {
                    window.location.reload();
                }
                else {
                    genericPopupClose(true, true);
                }
            }
            else {
                genericPopupShowInformationTips('配置已保存', 5000);
            }
        }
        genericPopupAddCloseButton(80);

        genericPopupSetContentSize(Math.min(configs.length * 28 + 70, Math.max(window.innerHeight - 200, 400)),
                                   Math.min(720, Math.max(window.innerWidth - 100, 680)),
                                   true);
        genericPopupShowModal(true);
    }

    function initiatizeConfig() {
        let udata = loadUserConfigData();
        if (udata == null) {
            udata = {
                dataIndex : { battleInfoNow : '' , battleInfoBefore : '' , battleInfoBack : '' },
                dataBeachSift : {},
                dataBind : {},
                dataBindDefault : {},
                config : {},
                calculatorTemplatePVE : {}
            };
        }
        else {
            if (udata.dataIndex == null) {
                udata.dataIndex = { battleInfoNow : '' , battleInfoBefore : '' , battleInfoBack : '' };
            }
            if (udata.dataBeachSift == null) {
                udata.dataBeachSift = {};
            }
            if (udata.dataBind == null) {
                udata.dataBind = {};
            }
            if (udata.dataBindDefault == null) {
                udata.dataBindDefault = {};
            }
            if (udata.config == null) {
                udata.config = {};
            }
            if (udata.calculatorTemplatePVE == null) {
                udata.calculatorTemplatePVE = {};
            }
            for (let key in udata.dataBeachSift) {
                if (!g_equipMap.has(key) && key != 'ignoreEquipQuality' &&
                    key != 'ignoreMysEquip' && key != 'ignoreEquipLevel') {

                    delete udata.dataBeachSift[key];
                }
            }
            for (let key in udata.dataBind) {
                if (!g_roleMap.has(key)) {
                    delete udata.dataBind[key];
                }
            }
            for (let key in udata.dataBindDefault) {
                if (!g_roleMap.has(key) || udata.dataBind[key] == null) {
                    delete udata.dataBindDefault[key];
                }
            }
            for (let key in udata.config) {
                if (!g_configMap.has(key)) {
                    delete udata.config[key];
                }
            }
            for (let key in udata.calculatorTemplatePVE) {
                if (!g_roleMap.has(key)) {
                    delete udata.calculatorTemplatePVE[key];
                }
            }
        }

        saveUserConfigData(udata);
        readConfig();
    }

    // deprecated
    let g_themeLoaded = false;
    function loadTheme() {
        if (!g_themeLoaded) {
            g_themeLoaded = true;
            let cb = document.querySelector('input.iconpack-switch');
            if (cb != null) {
                g_useOldEquipName = cb.checked;
                g_useThemeEquipName = (document.querySelector('input.themepack-equip')?.checked ?? false);
                try {
                    let theme = JSON.parse(sessionStorage.getItem('ThemePack') ?? '{}');
                    if (theme?.url != null) {
                        amuletLoadTheme(theme);
                        propertyLoadTheme(theme);
                        equipLoadTheme(theme);
                    }
                }
                catch (ex) {
                    console.log('THEME:');
                    console.log(ex);
                }
            }
        }
    }
    // deprecated

    initiatizeConfig();
    setupAddinExportInterface();
    beginCheckGameLog((ov, nv) => {
        if (nv?.length > 0) {
            document.querySelectorAll('div.row.fyg_lh60.fyg_tr a')?.forEach((a) => {
                if (a.innerText == '更新日志') {
                    a.innerText = `更新日志（${nv}）`;
                    if (ov != nv) {
                        a.className = a.className.replace('primary', 'danger');
                        addUserMessageSingle(
                            '你游更新',
                            `<b style="color:#c00000;">版本：${ov} → ${nv}，请至<a href="${g_guguzhenLog}">《更新日志》</a>了解详情。</b>`);
                    }
                }
            });
        }
    });

    const g_messageBoxObserver = new MutationObserver((mList) => {
        g_messageBoxObserver.disconnect();
        readConfig();

        let btns = mList?.[0]?.target?.querySelectorAll('button.btn.btn-primary');
        btns?.forEach((btn) => {
            if (btn.getAttribute('onclick')?.indexOf('oclick(\'13\',\'1\')') >= 0) {
                if (g_configMap.get('singlePotRecovery')?.value == 0) {
                    btn.disabled = 'disabled';
                    btn.parentElement.innerHTML = btn.outerHTML + '<b style="margin-left:10px;color:red;">（已禁止）</b>';
                }
            }
        });
        g_messageBoxObserver.observe(document.getElementById('mymessage'), { subtree : true , childList : true });
    });
    g_messageBoxObserver.observe(document.getElementById('mymessage'), { subtree : true , childList : true });

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // page add-ins
    //
    ////////////////////////////////////////////////////////////////////////////////////////////////////

    if (window.location.pathname == g_guguzhenHome) {
        const USER_DATA_xPORT_GM_KEY = g_kfUser + '_export_string';
        const USER_DATA_xPORT_SEPARATOR = '\n';

        function importUserConfigData() {
            genericPopupSetContent(
                '导入内容',
                `<b><div id="user_data_import_tip" style="color:#0000c0;padding:15px 0px 10px;">` +
                `请将从其它系统中使用同一帐号导出的内容填入文本框中并执行导入操作</div></b>
                 <div style="height:320px;"><textarea id="user_data_persistence_string"
                      style="height:100%;width:100%;resize:none;"></textarea></div>
                 <div style="padding:5px 0px 5px;"><input type="checkbox" id="includeNonConfigDataCheckbox" />
                     <label for="includeNonConfigDataCheckbox" style="margin-left:5px;cursor:pointer;">包含非配置类数据</label></div>`);

            let btnRead = genericPopupAddButton(
                '从全局存储中读取',
                0,
                ((e) => {
                    btnRead.disabled = btnImport.disabled = 'disabled';
                    genericPopupQuerySelector('#user_data_persistence_string').value = GM_getValue(USER_DATA_xPORT_GM_KEY, '');
                    let tipContainer = genericPopupQuerySelector('#user_data_import_tip');
                    let tipColor = tipContainer.style.color;
                    let tipString = tipContainer.innerText;
                    tipContainer.style.color = '#ff0000';
                    tipContainer.innerText = (genericPopupQuerySelector('#user_data_persistence_string').value.length > g_kfUser.length ?
                                              '已从全局存储中读取成功' : '未能读取导出数据，请确保已在“数据导出”功能中写入全局存储');
                    setTimeout((() => {
                        tipContainer.style.color = tipColor;
                        tipContainer.innerText = tipString;
                        btnRead.disabled = btnImport.disabled = '';
                    }), 3000);
                }),
                true);
            btnRead.disabled = g_isInSandBox ? '' : 'disabled';

            let btnImport = genericPopupAddButton(
                '执行导入',
                0,
                (() => {
                    btnRead.disabled = btnImport.disabled = 'disabled';
                    let userData = genericPopupQuerySelector('#user_data_persistence_string').value.split(USER_DATA_xPORT_SEPARATOR);
                    if (userData.length > 0) {
                        if (confirm('导入操作会覆盖已有的用户配置（护符组定义、卡片装备光环护符绑定、沙滩装备筛选配置等等），要继续吗？')) {
                            let backup = [];
                            let importedItems = [];
                            let illegalItems = [];
                            g_userDataStorageKeyConfig.forEach((item, index) => {
                                backup[index] = localStorage.getItem(item);
                            });
                            userData.forEach((item) => {
                                if ((item = item.trim()).length > 0) {
                                    let key = item.slice(0, item.indexOf(USER_STORAGE_KEY_VALUE_SEPARATOR));
                                    let nonCfgIdx = g_userDataStorageKeyNonConfig.indexOf(key);
                                    if (!includeNonConfigDataCheckbox.checked && nonCfgIdx >= 0) {
                                        return;
                                    }
                                    if (nonCfgIdx >= 0 || g_userDataStorageKeyConfig.indexOf(key) >= 0) {
                                        if (illegalItems.length == 0) {
                                            localStorage.setItem(key, item.substring(key.length + 1));
                                            importedItems.push(key);
                                        }
                                    }
                                    else {
                                        illegalItems.push(key);
                                    }
                                }
                            });
                            if (illegalItems.length > 0) {
                                importedItems.forEach((item) => {
                                    let index = g_userDataStorageKeyConfig.indexOf(item);
                                    if (index >= 0 && backup[index] != null) {
                                        localStorage.setItem(item, backup[index]);
                                    }
                                    else {
                                        localStorage.removeItem(item);
                                    }
                                });
                                alert('输入内容格式有误，有非法项目导致导入失败，请检查：\n\n    [ ' + illegalItems.join(' ]\n    [ ') + ' ]');
                            }
                            else if (importedItems.length > 0) {
                                alert('导入已完成：\n\n    [ ' + importedItems.join(' ]\n    [ ') + ' ]');
                                window.location.reload();
                                return;
                            }
                            else {
                                alert('输入内容格式有误，导入失败，请检查！');
                            }
                        }
                    }
                    else {
                        alert('输入内容格式有误，导入失败，请检查！');
                    }
                    btnRead.disabled = g_isInSandBox ? '' : 'disabled';
                    btnImport.disabled = '';
                }),
                true);
            genericPopupAddCloseButton(80);

            let includeNonConfigDataCheckbox = genericPopupQuerySelector('#includeNonConfigDataCheckbox');

            genericPopupSetContentSize(400, 600, false);
            genericPopupShowModal(true);
        }

        function exportUserConfigData() {
            genericPopupSetContent(
                '导出内容',
                `<b><div id="user_data_export_tip" style="color:#0000c0;padding:15px 0px 10px;">
                 请勿修改任何导出内容，将其保存为纯文本在其它系统中使用相同的帐号执行导入操作</div></b>
                 <div style="height:320px;"><textarea id="user_data_persistence_string" readonly="true"
                      style="height:100%;width:100%;resize:none;"></textarea></div>
                 <div style="padding:5px 0px 5px;"><input type="checkbox" id="includeNonConfigDataCheckbox" checked />
                     <label for="includeNonConfigDataCheckbox" style="margin-left:5px;cursor:pointer;">包含非配置类数据</label></div>`);

            let btnWrite = genericPopupAddButton(
                '写入全局存储',
                0,
                (() => {
                    btnWrite.disabled = btnCopy.disabled = 'disabled';
                    GM_setValue(USER_DATA_xPORT_GM_KEY, genericPopupQuerySelector('#user_data_persistence_string').value);
                    let tipContainer = genericPopupQuerySelector('#user_data_export_tip');
                    let tipColor = tipContainer.style.color;
                    let tipString = tipContainer.innerText;
                    tipContainer.style.color = '#ff0000';
                    tipContainer.innerText = '导出内容已写入全局存储';
                    setTimeout((() => {
                        tipContainer.style.color = tipColor;
                        tipContainer.innerText = tipString;
                        btnWrite.disabled = btnCopy.disabled = '';
                    }), 3000);
                }),
                true);
            btnWrite.disabled = g_isInSandBox ? '' : 'disabled';

            let btnCopy = genericPopupAddButton(
                '复制导出内容至剪贴板',
                0,
                (() => {
                    btnWrite.disabled = btnCopy.disabled = 'disabled';
                    let tipContainer = genericPopupQuerySelector('#user_data_export_tip');
                    let tipColor = tipContainer.style.color;
                    let tipString = tipContainer.innerText;
                    tipContainer.style.color = '#ff0000';
                    genericPopupQuerySelector('#user_data_persistence_string').select();
                    if (document.execCommand('copy')) {
                        tipContainer.innerText = '导出内容已复制到剪贴板';
                    }
                    else {
                        tipContainer.innerText = '复制失败，这可能是因为浏览器没有剪贴板访问权限，请进行手工复制（CTRL+A, CTRL+C）';
                    }
                    setTimeout((() => {
                        tipContainer.style.color = tipColor;
                        tipContainer.innerText = tipString;
                        btnWrite.disabled = g_isInSandBox ? '' : 'disabled';
                        btnCopy.disabled = '';
                    }), 3000);
                }),
                true);
            genericPopupAddCloseButton(80);

            function generateExportString() {
                let userData = [];
                g_userDataStorageKeyConfig.concat(includeNonConfigDataCheckbox.checked ? g_userDataStorageKeyNonConfig : []).forEach((item) => {
                    let value = localStorage.getItem(item);
                    if (value != null) {
                        userData.push(`${item}${USER_STORAGE_KEY_VALUE_SEPARATOR}${value}`);
                    }
                });
                genericPopupQuerySelector('#user_data_persistence_string').value = userData.join(USER_DATA_xPORT_SEPARATOR);
            }

            let includeNonConfigDataCheckbox = genericPopupQuerySelector('#includeNonConfigDataCheckbox');
            includeNonConfigDataCheckbox.onchange = generateExportString;

            generateExportString();
            genericPopupSetContentSize(400, 600, false);
            genericPopupShowModal(true);
        }

        function clearUserData() {
            if (confirm('这将清除所有用户配置（护符组定义、卡片装备光环护符绑定、沙滩装备筛选配置等等）和数据，要继续吗？')) {
                g_userDataStorageKeyConfig.concat(g_userDataStorageKeyNonConfig).concat(g_userDataStorageKeyExtra).forEach((item) => {
                    localStorage.removeItem(item);
                });
                alert('用户配置和数据已全部清除！');
                window.location.reload();
            }
        }

        function addForgeHistory(attrs) {
            readConfig();

            let maxList = (g_configMap.get('maxEquipForgeHistoryList')?.value ?? 0);
            if (maxList <= 0) {
                return;
            }
            let ts = getTimeStamp();
            let lv = 1, name = '', quality = 0, eqLv;
            let div = document.createElement('div');
            attrs.forEach((p, i) => {
                if (i == 1) {
                    let m = p.innerText.match(/\s*Lv\.(\d+)\s*-\s*(.+)/);
                    if (m?.length == 3) {
                        lv = m[1];
                        name = m[2].trim();
                    }
                }
                else if (i > 1) {
                    let m = p.innerText.match(/\s(\d+)\s*%\s/);
                    if (m?.length == 2) {
                        quality += parseInt(m[1]);
                    }
                    else if(p.innerText.startsWith('[神秘属性]')) {
                        quality += 100;
                    }
                    div.appendChild(p.cloneNode(true));
                }
            });
            for (eqLv = g_equipmentLevelPoints.length - 1; eqLv > 0 && quality < g_equipmentLevelPoints[eqLv]; eqLv--);
            let title =
                `Lv.<span class="fyg_f18">${lv}<span style="font-size:15px;">（${quality}%）</span></span>
                    <span class="fyg_f18 pull-right"><i class="icon icon-star"></i> 0</span><br>${name}`;

            let btn = document.createElement('button');
            btn.className = `btn btn-light btn-equipment popover-${g_equipmentLevelStyleClass[eqLv]}`;
            btn.style.minWidth = '240px';
            btn.style.padding = '0px';
            btn.style.marginRight = '5px';
            btn.style.marginBottom = '5px';
            btn.style.textAlign = 'left';
            btn.style.boxShadow = 'none';
            btn.style.lineHeight = '150%';
            btn.innerHTML =
                `<h3 class="popover-title" style="color:white;background-color:black;text-align:center;padding:3px;">${ts.date} ${ts.time}</h3>
                 <h3 class="popover-title bg-${g_equipmentLevelStyleClass[eqLv]}">${title}</h3>
                 <div class="popover-content-show" style="padding:10px 10px 0px 10px;">${div.innerHTML}</div>`;

            let history = (localStorage.getItem(g_forgeHistoryStorageKey) ?? '');
            div.innerHTML = history;
            div.insertBefore(btn, div.firstElementChild);
            while (div.children.length > maxList) {
                div.lastElementChild.remove();
            }
            localStorage.setItem(g_forgeHistoryStorageKey, div.innerHTML.replaceAll(USER_DATA_xPORT_SEPARATOR, '').replaceAll(/>\s+</g, '><'));
        }

        function showForgeHistory() {
            readConfig();

            let maxList = (g_configMap.get('maxEquipForgeHistoryList')?.value ?? 0);
            let history = (localStorage.getItem(g_forgeHistoryStorageKey) ?? '');
            let div = document.createElement('div');
            div.style.padding = '10px';
            div.style.backgroundColor = '#ddf4df';
            div.innerHTML = history;
            while (div.children.length > maxList) {
                div.lastElementChild.remove();
            }
            localStorage.setItem(g_forgeHistoryStorageKey, div.innerHTML.replaceAll(USER_DATA_xPORT_SEPARATOR, '').replaceAll(/>\s+</g, '><'));

            let fixedContent =
                '<div style="padding:20px 10px 10px 0px;color:blue;font-size:15px;"><b><ul>' +
                    '<li>历史记录仅包含在本机上使用本浏览器本帐号以常规方式（即：使用“锻造指定绿色以上装备”按钮）锻造的装备</li>' +
                    '<li>如果您使用多种锻造方式（包括但不限于常规、插件脚本、不同设备、不同浏览器等），此列表参考价值极为有限</li>' +
                    '<li>日期信息取自您锻造时的本机时间，如果您的本机时间不准确则装备锻造时间亦不准确</li></ul></b></div>';
            const mainContent = `<div class="${g_genericPopupTopLineDivClass}" id="historyDiv"></div>`;

            genericPopupInitialize();
            genericPopupSetFixedContent(fixedContent);
            genericPopupSetContent('装备锻造历史记录', mainContent);

            let historyDiv = genericPopupQuerySelector('#historyDiv');
            historyDiv.appendChild(div);
            fitMystSection(historyDiv);

            genericPopupAddButton(
                '清理记录',
                0,
                (() => {
                    let keep = prompt('请输入欲保留的记录条目数（0 - 100）', maxList);
                    if (/^\s*\d+\s*$/.test(keep) && (keep = parseInt(keep)) >= 0) {
                        if (keep < div.children.length && confirm(`这将删除 ${div.children.length - keep} 条历史记录，继续吗？`)) {
                            while (div.children.length > keep) {
                                div.lastElementChild.remove();
                            }
                            localStorage.setItem(g_forgeHistoryStorageKey, div.innerHTML);
                        }
                    }
                    else if (keep != null) {
                        alert('非法的输入值，请检查后重新输入。');
                    }
                }),
                true);
            genericPopupAddButton('记录设置', 0, (() => { modifyConfig('锻造记录设置', false, 'maxEquipForgeHistoryList'); }), true);
            genericPopupAddCloseButton(80);
            genericPopupSetContentSize(Math.min(window.innerHeight - 300, Math.max(window.innerHeight - 300, 400)),
                                       Math.min(840, Math.max(window.innerWidth - 200, 600)),
                                       true);
            genericPopupShowModal(true);

            function fitMystSection(container) {
                $(`#${container.id} .btn-equipment .bg-danger.with-padding`).css({
                    'max-width': '220px',
                    'padding': '5px 5px 5px 5px',
                    'white-space': 'pre-line',
                    'word-break': 'break-all'
                });
            }
        }

        (new MutationObserver((mList) => {
            if (mList?.[0]?.target?.style.display != 'none' &&
                mList?.[0]?.target?.innerHTML?.indexOf('锻造出了新装备') >= 0) {

                let eq = mList?.[0]?.target?.querySelectorAll('p');
                if (eq?.length > 5) {
                    addForgeHistory(eq);
                }
            }
        })).observe(document.getElementById('mymessage'), { subtree : true, childList : true });

        let timer = setInterval(() => {
            let panels = document.querySelectorAll('div.col-md-3 > div.panel > div.panel-body');
            if (panels?.length >= 2) {
                clearInterval(timer);
                genericPopupInitialize();

                let panel = panels[1];
                let userData = loadUserConfigData();
                let dataIndex = userData.dataIndex;

                for (var px = panel.firstElementChild; px != null && !px.innerText.startsWith('对玩家战斗'); px = px.nextElementSibling);
                if (px != null) {
                    let p0 = px.cloneNode(true);
                    let sp = p0.firstElementChild;
                    p0.firstChild.textContent = '对玩家战斗（上次查看）';

                    dataIndex.battleInfoNow = px.firstElementChild.innerText;
                    if (dataIndex.battleInfoNow == dataIndex.battleInfoBefore) {
                        sp.innerText = dataIndex.battleInfoBack;
                    }
                    else {
                        sp.innerText = dataIndex.battleInfoBefore;
                        dataIndex.battleInfoBack = dataIndex.battleInfoBefore;
                        dataIndex.battleInfoBefore = dataIndex.battleInfoNow
                        saveUserConfigData(userData);
                    }
                    px.parentElement.insertBefore(p0, px.nextElementSibling);
                }
                else {
                    px = panel.firstElementChild;
                }

                let globalDataBtnContainer = document.createElement('div');
                globalDataBtnContainer.style.borderTop = '1px solid #d0d0d0';
                globalDataBtnContainer.style.padding = '10px 0px 0px';

                let versionLabel = px.cloneNode(true);
                let versionText = versionLabel.firstElementChild;
                versionLabel.firstChild.textContent = '插件版本：';
                versionText.innerHTML = `<i class="icon icon-info-sign" data-toggle="tooltip" data-placement="left"
                                            data-original-title="${g_modiTime}"> ${g_version}</i>`;
                globalDataBtnContainer.appendChild(versionLabel);

                let configBtn = document.createElement('button');
                configBtn.className = 'btn';
                configBtn.innerHTML = '设置';
                configBtn.style.width = '100%';
                configBtn.style.marginBottom = '1px';
                configBtn.onclick = (() => { modifyConfig(); });
                globalDataBtnContainer.appendChild(configBtn);

                let importBtn = configBtn.cloneNode(true);
                importBtn.innerHTML = '导入用户配置数据';
                importBtn.onclick = (() => { importUserConfigData(); });
                globalDataBtnContainer.appendChild(importBtn);

                let exportBtn = configBtn.cloneNode(true);
                exportBtn.innerHTML = '导出用户配置数据';
                exportBtn.onclick = (() => { exportUserConfigData(); });
                globalDataBtnContainer.appendChild(exportBtn);

                let eraseBtn = configBtn.cloneNode(true);
                eraseBtn.innerHTML = '清除用户数据';
                eraseBtn.onclick = (() => { clearUserData(); });
                globalDataBtnContainer.appendChild(eraseBtn);
                px.parentElement.appendChild(globalDataBtnContainer);

                if (g_configMap.get('openCardSequence')?.value?.replaceAll(/[ \+]/g, '').length > 0) {
                    let openCardBtnContainer = document.createElement('div')
                    openCardBtnContainer.style.textAlign = 'right';
                    openCardBtnContainer.innerHTML =
                        '<span style="color:blue;font-size:16px;">★ 如果您选择使用一键翻牌功能，表明您完全接受最终结果，否则请选择手动翻牌</span>';

                    let openCardConfigBtn = document.createElement('button');
                    openCardConfigBtn.className = 'btn btn-lg';
                    openCardConfigBtn.innerHTML = '一键翻牌设置';
                    openCardConfigBtn.style.marginLeft = '15px';
                    openCardConfigBtn.style.marginRight = '1px';
                    openCardConfigBtn.onclick = (() => { modifyConfig('一键翻牌设置', false, 'openCardSequence'); });
                    openCardBtnContainer.appendChild(openCardConfigBtn);

                    let openCardBtn = document.createElement('button');
                    openCardBtn.className = 'btn btn-lg';
                    openCardBtn.innerHTML = '一键翻牌';
                    openCardBtn.onclick = (() => { openGifts(null, () => { indre(10, 'gifsall'); }); });
                    openCardBtnContainer.appendChild(openCardBtn);
                    let cardDiv = document.querySelector('#gifsall');
                    cardDiv.parentElement.appendChild(openCardBtnContainer);
                }

                let btns = document.querySelectorAll('button.btn.btn-lg');
                for (let btn of btns) {
                    if (btn.innerText.indexOf('锻造') >= 0) {
                        let forgeHistoryBtn = document.createElement('button');
                        forgeHistoryBtn.className = 'btn btn-lg';
                        forgeHistoryBtn.innerHTML = '查看锻造历史记录';
                        forgeHistoryBtn.style.width = getComputedStyle(btn).getPropertyValue('width');
                        forgeHistoryBtn.style.marginTop = '1px';
                        forgeHistoryBtn.onclick = (() => { showForgeHistory(); });
                        btn.parentElement.appendChild(forgeHistoryBtn);
                        break;
                    }
                }

                $('[data-toggle="tooltip"]').tooltip();
            }
        }, 200);
    }
    else if (window.location.pathname == g_guguzhenEquip) {
        genericPopupInitialize();

        let timer = setInterval(() => {
            let cardingDiv = document.getElementById('carding');
            let backpacksDiv = document.getElementById('backpacks');
            if (cardingDiv?.firstElementChild != null && backpacksDiv?.firstElementChild != null) {
                clearInterval(timer);

                // deprecated
                loadTheme();
                // deprecated

                const bagQueryString = 'div.alert-danger';
                const storeQueryString = 'div.alert-success';
                const cardingObjectsQueryString = 'div.row > div.fyg_tc > button.btn.fyg_mp3';
                const bagObjectsQueryString = 'div.alert-danger > button.btn.fyg_mp3';
                const storeObjectsQueryString = 'div.alert-success > button.btn.fyg_mp3';
                const storeButtonId = 'collapse-backpacks-store';

                let equipmentDiv = document.createElement('div');
                equipmentDiv.id = 'equipmentDiv';
                equipmentDiv.style.width = '100%';
                equipmentDiv.innerHTML =
                    `<p class="alert alert-danger" id="equip-ctrl-container" style="text-align:right;">
                        <input type="checkbox" id="equipment_StoreExpand" style="margin-right:5px;" />
                        <label for="equipment_StoreExpand" style="margin-right:15px;cursor:pointer;">仅显示饰品栏和仓库</label>
                        <input type="checkbox" id="equipment_Expand" style="margin-right:5px;" />
                        <label for="equipment_Expand" style="margin-right:15px;cursor:pointer;">全部展开</label>
                        <input type="checkbox" id="equipment_BG" style="margin-right:5px;" />
                        <label for="equipment_BG" style="margin-right:15px;cursor:pointer;">使用深色背景</label>
                        <button type="button" id="objects_Cleanup">清理库存</button></p>
                     <div id="equipment_ObjectContainer" style="display:block;height:0px;">
                     <p><button type="button" class="btn btn-block collapsed" data-toggle="collapse" data-target="#eq5">道具 ▼</button></p>
                        <div class="in" id="eq5"></div>
                     <p><button type="button" class="btn btn-block collapsed" data-toggle="collapse" data-target="#eq4">护符 ▼</button></p>
                        <div class="in" id="eq4"></div>
                     <p><button type="button" class="btn btn-block collapsed" data-toggle="collapse" data-target="#eq0">武器装备 ▼</button></p>
                        <div class="in" id="eq0"></div>
                     <p><button type="button" class="btn btn-block collapsed" data-toggle="collapse" data-target="#eq1">手臂装备 ▼</button></p>
                        <div class="in" id="eq1"></div>
                     <p><button type="button" class="btn btn-block collapsed" data-toggle="collapse" data-target="#eq2">身体装备 ▼</button></p>
                        <div class="in" id="eq2"></div>
                     <p><button type="button" class="btn btn-block collapsed" data-toggle="collapse" data-target="#eq3">头部装备 ▼</button></p>
                        <div class="in" id="eq3"></div>
                     <p><button type="button" class="btn btn-block collapsed" id="${storeButtonId}">仓库 ▼</button></p></div>`;

                function refreshEquipmentPage(fnPostProcess) {
                    let asyncOperations = 2;
                    let asyncObserver = new MutationObserver(() => {
                        if (--asyncOperations == 0) {
                            asyncObserver.disconnect();
                            if (fnPostProcess != null) {
                                fnPostProcess();
                            }
                        }
                    });
                    asyncObserver.observe(backpacksDiv, { childList : true });

                    // refresh #carding & #backpacks
                    cding();
                    eqbp(1);
                }

                equipmentDiv.querySelector('#objects_Cleanup').onclick = objectsCleanup;
                function objectsCleanup() {
                    genericPopupInitialize();

                    let cancelled = false;
                    function cancelProcess() {
                        if (timer != null) {
                            clearInterval(timer);
                            timer = null;
                        }
                        if (!cancelled) {
                            cancelled = true;
                            httpRequestAbortAll();
                            refreshEquipmentPage(() => { genericPopupClose(true); });
                        }
                    }

                    let timer = null;
                    function postProcess(closeCountDown) {
                        if (closeCountDown > 0) {
                            genericPopupOnClickOutside(cancelProcess);
                            timer = setInterval(() => {
                                if (cancelled || --closeCountDown == 0) {
                                    cancelProcess();
                                }
                                else {
                                    genericPopupShowInformationTips(`所有操作已完成，窗口将在 ${closeCountDown} 秒后关闭`, 0);
                                }
                            }, 1000);
                        }
                        else {
                            cancelProcess();
                        }
                    }

                    let bagObjects = backpacksDiv.querySelectorAll(bagObjectsQueryString);
                    let storeObjects = backpacksDiv.querySelectorAll(storeObjectsQueryString);
                    function refreshContainer(fnPostProcess) {
                        function queryObjects() {
                            bagObjects = backpacksDiv.querySelectorAll(bagObjectsQueryString);
                            storeObjects = backpacksDiv.querySelectorAll(storeObjectsQueryString);
                            if (fnPostProcess != null) {
                                fnPostProcess();
                            }
                        }

                        refreshEquipmentPage(queryObjects);
                    }

                    function processEquips() {
                        let equips = [];
                        genericPopupQuerySelectorAll('table.equip-list input.equip-checkbox.equip-item').forEach((e) => {
                            if (e.checked) {
                                equips.push((new Equipment()).fromEquipText(e.getAttribute('original-item')));
                            }
                        });

                        if (equips.length > 0) {
                            genericPopupShowInformationTips(`丢弃装备...（0 / ${equips.length}）`, 0);
                            let ids = findEquipmentIds(storeObjects, equips);
                            if (ids.length > 0) {
                                beginMoveObjects(
                                    ids,
                                    ObjectMovePath.store2beach,
                                    (total, count) => {
                                        genericPopupShowInformationTips(`丢弃装备...（${count} / ${total}）`, 0);
                                        return true;
                                    },
                                    refreshContainer,
                                    processAmulets);
                                return;
                            }
                            else {
                                alert('有装备不存在，请在清理结束后检查！');
                                console.log(equips);
                            }
                        }
                        processAmulets();
                    }

                    function processAmulets() {
                        let amulets = [];
                        let groupItem = 0;
                        genericPopupQuerySelectorAll('table.amulet-list input.equip-checkbox.amulet-item').forEach((e) => {
                            if (e.checked) {
                                if (e.hasAttribute('group-item')) {
                                    groupItem++;
                                }
                                amulets.push((new Amulet()).fromBuffText(e.getAttribute('original-item')));
                            }
                        });
                        if (!(groupItem == 0 || confirm(`选中的护符中有 ${groupItem} 个可能已加入护符组，继续销毁吗？`))) {
                            cancelProcess();
                            return;
                        }

                        let bag = 0;
                        pirlAmulets();

                        function pirlAmulets() {
                            if (amulets.length > 0) {
                                genericPopupShowInformationTips(`销毁护符...（0 / ${amulets.length}）`, 0);
                                if ((bag & 1) == 0) {
                                    bag++;
                                    let ids = findAmuletIds(storeObjects, amulets);
                                    if (ids.length > 0) {
                                        beginPirlObjects(
                                            true,
                                            ids,
                                            (total, count) => {
                                                genericPopupShowInformationTips(`销毁护符...（${count} / ${total}）`, 0);
                                                return true;
                                            },
                                            refreshContainer,
                                            pirlAmulets);
                                        return;
                                    }
                                }
                                if (bag == 1) {
                                    bag++;
                                    let ids = findAmuletIds(bagObjects, amulets.slice());
                                    if (ids.length > 0) {
                                        let emptyCells = parseInt(backpacksDiv.querySelector(storeQueryString + ' > p.fyg_lh40.fyg_tc.text-gray')
                                                                         ?.innerText?.match(/\d+/)[0]);
                                        if (emptyCells >= ids.length) {
                                            beginMoveObjects(ids, ObjectMovePath.bag2store, null, refreshContainer, pirlAmulets);
                                        }
                                        else {
                                            alert('仓库空间不足，清理无法继续，请检查！');
                                            cancelProcess();
                                        }
                                        return;
                                    }
                                    else {
                                        alert('有护符不存在，请在清理结束后检查！');
                                        console.log(amulets);
                                    }
                                }
                                else {
                                    alert('有护符不存在，请在清理结束后检查！');
                                    console.log(amulets);
                                }
                            }
                            postProcess(15);
                        }
                    }

                    let fixedContent =
                        '<div style="padding:20px 10px 10px 0px;color:blue;font-size:16px;"><b><ul>' +
                          '<li>护符表中被选中的护符会被销毁，此操作不可逆，请谨慎使用</li>' +
                          '<li>如果饰品栏有您欲销毁的护符，请确保仓库中届时有足够的空间容纳它们（饰品栏护符会在最后一个步骤销毁）</li>' +
                          '<li>装备表中被选中的装备会被丢弃，丢弃后的装备将出现在沙滩上，并在24小时后消失，在它消失前您可随时捡回</li>' +
                          '<li>正在使用的装备不会出现在装备表中，如果您想要丢弃正在使用的装备，请首先将它替换下来</li>' +
                          `<li id="${g_genericPopupInformationTipsId}" style="color:red;">` +
                             `<input type="checkbox" id="disclaimer-check" />` +
                             `<label for="disclaimer-check" style="margin-left:5px;cursor:pointer;">` +
                              `本人已仔细阅读并完全理解以上全部注意事项，愿意独立承担所有因此操作而引起的一切后果及损失</label></li></ul></b></div>`;
                    const mainStyle =
                          '<style> .group-menu { position:relative;' +
                                                'display:inline-block;' +
                                                'color:blue;' +
                                                'font-size:20px;' +
                                                'cursor:pointer; } ' +
                                  '.group-menu-items { display:none;' +
                                                      'position:absolute;' +
                                                      'font-size:15px;' +
                                                      'word-break:keep-all;' +
                                                      'white-space:nowrap;' +
                                                      'margin:0 auto;' +
                                                      'width:fit-content;' +
                                                      'z-index:999;' +
                                                      'background-color:white;' +
                                                      'box-shadow:0px 2px 16px 4px rgba(0, 0, 0, 0.4);' +
                                                      'padding:15px 30px; } '+
                                  '.group-menu-item { } ' +
                                  '.group-menu:hover .group-menu-items { display:block; } ' +
                                  '.group-menu-items .group-menu-item:hover { background-color:#bbddff; } ' +
                              'b > span { color:purple; } ' +
                              'button.btn-group-selection { width:80px; float:right; } ' +
                              'table.amulet-list { width:100%; } ' +
                                  'table.amulet-list th.object-name { width:20%; text-align:left; } ' +
                                  'table.amulet-list th.object-property { width:80%; text-align:left; } ' +
                              'table.equip-list { width:100%; } ' +
                                  'table.equip-list th.object-name { width:44%; text-align:left; } ' +
                                  'table.equip-list th.object-property { width:14%; text-align:left; } ' +
                              'table tr.alt { background-color:' + g_genericPopupBackgroundColorAlt + '; } ' +
                          '</style>';
                    const menuItems =
                          '<div class="group-menu-items"><ul>' +
                              '<li class="group-menu-item"><a href="#amulets-div">护符</a></li>' +
                              '<li class="group-menu-item"><a href="#equips1-div">武器装备</a></li>' +
                              '<li class="group-menu-item"><a href="#equips2-div">手臂装备</a></li>' +
                              '<li class="group-menu-item"><a href="#equips3-div">身体装备</a></li>' +
                              '<li class="group-menu-item"><a href="#equips4-div">头部装备</a></li>' +
                          '</ul></div>';
                    const amuletTable =
                          '<table class="amulet-list"><tr class="alt"><th class="object-name">护符</th>' +
                             '<th class="object-property">属性</th></tr></table>';
                    const equipTable =
                          '<table class="equip-list"><tr class="alt"><th class="object-name">装备</th><th class="object-property">属性</th>' +
                             '<th class="object-property"></th><th class="object-property"></th><th class="object-property"></th></tr></table>';
                    const btnGroup =
                          '<button type="button" class="btn-group-selection" select-type="2">反选</button>' +
                          '<button type="button" class="btn-group-selection" select-type="1">全不选</button>' +
                          '<button type="button" class="btn-group-selection" select-type="0">全选</button>';
                    const mainContent =
                        `${mainStyle}
                         <div class="${g_genericPopupTopLineDivClass}" id="amulets-div">
                           <b class="group-menu">护符 （选中 <span>0</span>）（★：已加入护符组） ▼${menuItems}</b>${btnGroup}<p />${amuletTable}</div>
                         <div class="${g_genericPopupTopLineDivClass}" id="equips1-div">
                           <b class="group-menu">武器装备 （选中 <span>0</span>） ▼${menuItems}</b>${btnGroup}<p />${equipTable}</div>
                         <div class="${g_genericPopupTopLineDivClass}" id="equips2-div">
                           <b class="group-menu">手臂装备 （选中 <span>0</span>） ▼${menuItems}</b>${btnGroup}<p />${equipTable}</div>
                         <div class="${g_genericPopupTopLineDivClass}" id="equips3-div">
                           <b class="group-menu">身体装备 （选中 <span>0</span>） ▼${menuItems}</b>${btnGroup}<p />${equipTable}</div>
                         <div class="${g_genericPopupTopLineDivClass}" id="equips4-div">
                           <b class="group-menu">头部装备 （选中 <span>0</span>） ▼${menuItems}</b>${btnGroup}<p />${equipTable}</div>`;

                    genericPopupSetFixedContent(fixedContent);
                    genericPopupSetContent('清理库存', mainContent);

                    genericPopupQuerySelectorAll('.group-menu-item')?.forEach((mi) => {
                        mi.onclick = ((e) => { e.currentTarget?.firstElementChild?.click(); });
                    });

                    function batchSelection(e) {
                        let selType = parseInt(e.target.getAttribute('select-type'));
                        let selCount = 0;
                        e.target.parentElement.querySelectorAll('input.equip-checkbox').forEach((chk) => {
                            if (chk.checked = (selType == 2 ? !chk.checked : selType == 0)) {
                                selCount++;
                            }
                        });
                        e.target.parentElement.firstElementChild.firstElementChild.innerText = selCount;
                    }

                    const objectTypeColor = [ '#e0fff0', '#ffe0ff', '#fff0e0', '#d0f0ff' ];
                    let bagAmulets = amuletNodesToArray(backpacksDiv.querySelectorAll(bagObjectsQueryString));
                    let groupAmulets = [];
                    amuletLoadGroups().toArray().forEach((group) => { groupAmulets.push(group.items); });
                    groupAmulets = groupAmulets.flat().sort((a , b) => a.compareMatch(b));
                    let amulet_selector = genericPopupQuerySelector('table.amulet-list');
                    let storeAmulets = amuletNodesToArray(backpacksDiv.querySelectorAll(storeObjectsQueryString));
                    storeAmulets.concat(bagAmulets).sort((a , b) => a.compareTo(b)).forEach((item) => {
                        let gi = searchElement(groupAmulets, item, (a , b) => a.compareMatch(b));
                        if (gi >= 0) {
                            groupAmulets.splice(gi, 1);
                        }
                        let tr = document.createElement('tr');
                        tr.style.color = (gi >= 0 ? 'blue' : '');
                        tr.style.backgroundColor = objectTypeColor[item.type];
                        tr.innerHTML =
                            `<td><input type="checkbox" class="equip-checkbox amulet-item" id="amulet-${item.id}"
                                        original-item="${item.formatBuffText()}"${gi >= 0 ? ' group-item' : ''} />
                                 <label for="amulet-${item.id}" style="margin-left:5px;cursor:pointer;">
                                        ${gi >= 0 ? '★ ' : ''}${item.formatName()}</label></td>
                             <td>${item.formatBuff()}</td>`;
                        amulet_selector.appendChild(tr);
                    });

                    let eqIndex = 0;
                    let eq_selectors = genericPopupQuerySelectorAll('table.equip-list');
                    let storeEquips = equipmentNodesToArray(backpacksDiv.querySelectorAll(storeObjectsQueryString));
                    storeEquips.sort((a, b) => a.compareTo(b)).forEach((item) => {
                        let tr = document.createElement('tr');
                        tr.style.backgroundColor = g_equipmentLevelBGColor[item.getQualityLevel()];
                        tr.innerHTML =
                            `<td><input type="checkbox" class="equip-checkbox equip-item" id="equip-${++eqIndex}"
                                        original-item="${item.formatEquipText()}" />
                                 <label for="equip-${eqIndex}" style="margin-left:5px;cursor:pointer;">` +
                                       `${item.meta.alias} - Lv.${item.level} （${item.getQuality()}%） ` +
                                       `${item.myst ? ' - [ 神秘 ]' : ''}</label></td>
                             <td>${item.formatEquipAttrText('</td><td>')}</td>`;
                        tr.title = `${item.pAttributes.join('% - ')}%`;
                        eq_selectors[item.meta.type].appendChild(tr);
                    });

                    genericPopupQuerySelectorAll('input.equip-checkbox').forEach((e) => { e.onchange = equipCheckboxStateChange; });
                    function equipCheckboxStateChange(e) {
                        let countSpan = e.target.parentElement.parentElement.parentElement.parentElement.firstElementChild.firstElementChild;
                        countSpan.innerText = parseInt(countSpan.innerText) + (e.target.checked ? 1 : -1);
                    }

                    let btnGo = genericPopupAddButton('开始', 80, (() => {
                        genericPopupOnClickOutside(null);
                        operationEnabler(false);
                        genericPopupQuerySelector('#disclaimer-check').disabled = 'disabled';
                        processEquips();
                    }), false);
                    let btnCancel = genericPopupAddButton('取消', 80, () => {
                        operationEnabler(false);
                        btnCancel.disabled = 'disabled';
                        cancelProcess();
                    }, false);

                    function operationEnabler(enabled) {
                        let v = enabled ? '' : 'disabled';
                        genericPopupQuerySelectorAll('button.btn-group-selection').forEach((e) => { e.disabled = v; });
                        genericPopupQuerySelectorAll('input.equip-checkbox').forEach((e) => { e.disabled = v; });
                        btnGo.disabled = v;
                    }
                    operationEnabler(false);
                    genericPopupQuerySelector('#disclaimer-check').onchange = ((e) => { operationEnabler(e.target.checked); });

                    let objectsCount = bagAmulets.length + storeEquips.length + storeAmulets.length;
                    genericPopupSetContentSize(Math.min((objectsCount * 31) + (6 * 104), Math.max(window.innerHeight - 400, 400)),
                                               Math.min(1000, Math.max(window.innerWidth - 200, 600)),
                                               true);
                    genericPopupShowModal(true);
                }

                ////////////////////////////////////////////////////////////////////////////////
                //
                // collapse container
                //
                ////////////////////////////////////////////////////////////////////////////////

                let forceEquipDivOperation = true;
                let equipDivExpanded = {};

                equipmentDiv.querySelectorAll('button.btn.btn-block.collapsed').forEach((btn) => { btn.onclick = backupEquipmentDivState; });
                function backupEquipmentDivState(e) {
                    let targetDiv = equipmentDiv.querySelector(e.target.getAttribute('data-target'));
                    if (targetDiv != null) {
                        equipDivExpanded[targetDiv.id] = !equipDivExpanded[targetDiv.id];
                    }
                    else {
                        equipDivExpanded[e.target.id] = !equipDivExpanded[e.target.id];
                    }
                };

                function collapseEquipmentDiv(expand, force) {
                    let targetDiv;
                    equipmentDiv.querySelectorAll('button.btn.btn-block').forEach((btn) => {
                        if (btn.getAttribute('data-toggle') == 'collapse' &&
                            (targetDiv = equipmentDiv.querySelector(btn.getAttribute('data-target'))) != null) {

                            let exp = expand;
                            if (equipDivExpanded[targetDiv.id] == null || force) {
                                equipDivExpanded[targetDiv.id] = exp;
                            }
                            else {
                                exp = equipDivExpanded[targetDiv.id];
                            }

                            targetDiv.className = (exp ? 'in' : 'collapse');
                            targetDiv.style.height = (exp ? 'auto' : '0px');
                        }
                    });
                    if (equipDivExpanded[storeButtonId] == null || force) {
                        equipDivExpanded[storeButtonId] = expand;
                    }
                    if (equipDivExpanded[storeButtonId]) {
                        $('#backpacks > ' + storeQueryString).show();
                    }
                    else {
                        $('#backpacks > ' + storeQueryString).hide();
                    }
                }

                let objectContainer = equipmentDiv.querySelector('#equipment_ObjectContainer');
                function switchObjectContainerStatus(show) {
                    if (show) {
                        objectContainer.style.display = 'block';
                        objectContainer.style.height = 'auto';
                        if (equipDivExpanded[storeButtonId]) {
                            $('#backpacks > ' + storeQueryString).show();
                        }
                        else {
                            $('#backpacks > ' + storeQueryString).hide();
                        }
                    }
                    else {
                        objectContainer.style.height = '0px';
                        objectContainer.style.display = 'none';
                        $('#backpacks > ' + storeQueryString).show();
                    }

                    equipmentDiv.querySelector('#equipment_Expand').disabled =
                        equipmentDiv.querySelector('#equipment_BG').disabled = (show ? '' : 'disabled');
                }

                function changeEquipmentDivStyle(bg) {
                    $('#equipmentDiv .backpackDiv').css({
                        'background-color': bg ? 'black' : '#ffe5e0'
                    });
                    $('#equipmentDiv .storeDiv').css({
                        'background-color': bg ? 'black' : '#ddf4df'
                    });
                    $('#equipmentDiv .btn-light').css({
                        'background-color': bg ? 'black' : 'white'
                    });
                    $('#equipmentDiv .popover-content-show').css({
                        'background-color': bg ? 'black' : 'white',
                        'color': bg ? 'white' : 'black'
                    });
                    $('#equipmentDiv .popover-title').css({
                        'color': bg ? 'black' : 'white'
                    });
                    $('#equipmentDiv .bg-special').css({
                        'background-color': bg ? 'black' : '#8666b8',
                        'color': bg ? '#c0c0c0' : 'white',
                        'border-bottom': bg ? '1px solid grey' : 'none'
                    });
                    $('#equipmentDiv .btn-equipment .pull-right').css({
                        'color': bg ? 'black' : 'white'
                    });
                    $('#equipmentDiv .btn-equipment .bg-danger.with-padding').css({
                        'color': bg ? 'black' : 'white'
                    });
                }

                let equipmentStoreExpand = setupConfigCheckbox(
                    equipmentDiv.querySelector('#equipment_StoreExpand'),
                    g_equipmentStoreExpandStorageKey,
                    (checked) => { switchObjectContainerStatus(!(equipmentStoreExpand = checked)); },
                    null);
                let equipmentExpand = setupConfigCheckbox(
                    equipmentDiv.querySelector('#equipment_Expand'),
                    g_equipmentExpandStorageKey,
                    (checked) => { collapseEquipmentDiv(equipmentExpand = checked, true); },
                    null);
                let equipmentBG = setupConfigCheckbox(
                    equipmentDiv.querySelector('#equipment_BG'),
                    g_equipmentBGStorageKey,
                    (checked) => { changeEquipmentDivStyle(equipmentBG = checked); },
                    null);

                let wishpool = [];
                let userInfo = {};
                async function restructureEquipUI(fnPostProcess, fnParams) {
                    if (!(wishpool?.length > 0)) {
                        wishpool = await readWishpoolAsync(null);
                    }
                    if (!(userInfo?.isUserInfo)) {
                        userInfo = await readUserInfoAsync();
                    }
                    addCollapse(fnPostProcess, fnParams);
                }

                function addCollapse(fnPostProcess, fnParams) {
                    let waitForBtn = setInterval(() => {
                        if (cardingDiv?.firstElementChild != null && backpacksDiv?.firstElementChild != null) {
                            let eqbtns = cardingDiv.querySelectorAll(cardingObjectsQueryString);
                            let eqstore = backpacksDiv.querySelectorAll(storeObjectsQueryString);
                            if (eqbtns?.length > 0 || eqstore?.length > 0) {
                                clearInterval(waitForBtn);

                                eqstore.forEach((item) => { item.dataset.instore = 1; });
                                eqbtns =
                                    Array.from(eqbtns).concat(
                                    Array.from(backpacksDiv.querySelectorAll(bagObjectsQueryString))).concat(
                                    Array.from(eqstore)).sort(objectNodeComparer);

                                if (!(document.getElementsByClassName('collapsed')?.length > 0)) {
                                    backpacksDiv.insertBefore(equipmentDiv, backpacksDiv.firstElementChild);
                                }
                                for (let i = eqbtns.length - 1; i >= 0; i--) {
                                    if (objectIsEmptyNode(eqbtns[i]) || eqbtns[i].className?.indexOf('popover') >= 0) {
                                        eqbtns.splice(i, 1);
                                    }
                                }

                                let ineqBackpackDiv =
                                    '<div class="backpackDiv" style="padding:10px;margin-bottom:10px;"></div>' +
                                    '<div class="storeDiv" style="padding:10px;margin-bottom:10px;"></div>';
                                let eqDivs = [ equipmentDiv.querySelector('#eq0'),
                                               equipmentDiv.querySelector('#eq1'),
                                               equipmentDiv.querySelector('#eq2'),
                                               equipmentDiv.querySelector('#eq3'),
                                               equipmentDiv.querySelector('#eq4'),
                                               equipmentDiv.querySelector('#eq5') ];
                                eqDivs.forEach((item) => { item.innerHTML = ineqBackpackDiv; });

                                const store = [ '', '【仓】'];
                                eqbtns.forEach((btn) => {
                                    let equip = (new Equipment()).fromNode(btn, true);
                                    let amulet = (new Amulet()).fromNode(btn);
                                    let propInfo = propertyInfoParseNode(btn);
                                    let styleClass = g_equipmentLevelStyleClass[objectGetLevel(equip ?? amulet ?? propInfo)];
                                    let btn0 = document.createElement('button');
                                    btn0.className = `btn btn-light popover-${styleClass}`;
                                    btn0.style.minWidth = '200px';
                                    btn0.style.marginRight = '5px';
                                    btn0.style.marginBottom = '5px';
                                    btn0.style.padding = '0px';
                                    btn0.style.textAlign = 'left';
                                    btn0.style.boxShadow = 'none';
                                    btn0.style.lineHeight = '150%';
                                    btn0.setAttribute('onclick', btn.getAttribute('onclick'));
                                    let enhancements = (amulet != null ? ' +' + btn.innerText.trim() : '');
                                    let storeText = store[btn.dataset.instore ?? 0];
                                    btn0.innerHTML =
                                        `<h3 class="popover-title bg-${styleClass}">${storeText}${btn.dataset.originalTitle}${enhancements}</h3>
                                         <div class="popover-content-show" style="padding:10px 10px 0px 10px;">${btn.dataset.content}</div>`;

                                    if (equip != null && btn0.lastChild.lastChild?.nodeType != Node.ELEMENT_NODE) {
                                        btn0.lastChild.lastChild?.remove();
                                    }

                                    let ineq;
                                    if (amulet != null) {
                                        ineq = 4;
                                    }
                                    else if (equip != null) {
                                        ineq = equip.meta.type;
                                        btn0.style.minWidth = '240px';
                                        btn0.className += ' btn-equipment';

                                        // debug only
                                        if (equipmentVerify(btn, equip) != 0) {
                                            btn.style.border = '3px solid #ff00ff';
                                            btn0.style.border = '5px solid #ff00ff';
                                        }
                                    }
                                    else {
                                        ineq = 5;
                                        btn0.lastChild.style.cssText =
                                            'max-width:180px;padding:10px;text-align:center;white-space:pre-line;word-break:break-all;';
                                    }

                                    (storeText == '' ? eqDivs[ineq].firstChild : eqDivs[ineq].firstChild.nextSibling).appendChild(btn0);
                                });

                                eqDivs.forEach((div) => {
                                    for (let area of div.children) {
                                        if (area.children.length == 0) {
                                            area.style.display = 'none';
                                        }
                                    }
                                    div.ondblclick = ((e) => {
                                        if (e.target?.className == 'in' || e.target?.parentElement?.className == 'in') {
                                            e.currentTarget?.previousElementSibling?.firstElementChild?.click();
                                            (window.getSelection ?? document.getSelection)?.call()?.removeAllRanges();
                                        }
                                    });
                                });

                                function inputAmuletGroupNameAsync(defaultGroupName) {
                                    let delayMS = (g_configMap.get('listNamesOnInputAmuletGroupName')?.value ?? 0);
                                    if (delayMS != 0) {
                                        let names = (amuletLoadGroups()?.toNameArray() ?? ['（空）']).sort();
                                        let ul = `&nbsp;<br><span style="font-size:20px;color:#000080">已定义的护符组</span><br>&nbsp;<br>` +
                                            `<ul><li>${names.join('</li><li>')}</li></ul>`;
                                        genericPopupShowBGInfo(ul);
                                    }

                                    return new Promise((resolve) => {
                                        setTimeout(() => {
                                            let groupName = prompt('请输入护符组名称（不超过31个字符，请仅使用大、小写英文字母、数字、连字符、下划线及中文字符）',
                                                                   defaultGroupName ?? '');
                                            if (groupName != null && !amuletIsValidGroupName(groupName)) {
                                                alert('名称不符合命名规则，信息未保存。');
                                                groupName = null;
                                            }
                                            genericPopupCloseBGInfo(true);
                                            resolve(groupName);
                                        }, delayMS);
                                    });
                                }

                                function queryAmulets(bag, store, key) {
                                    let count = 0;
                                    if (bag != null) {
                                        amuletNodesToArray(backpacksDiv.querySelectorAll(bagObjectsQueryString), bag, key);
                                        count += bag.length;
                                    }
                                    if (store != null) {
                                        amuletNodesToArray(backpacksDiv.querySelectorAll(storeObjectsQueryString), store, key);
                                        count += store.length;
                                    }
                                    return count;
                                }

                                function showAmuletGroupsPopup() {
                                    function beginSaveBagAsGroup(groupName, update) {
                                        let amulets = [];
                                        queryAmulets(amulets, null);
                                        createAmuletGroup(groupName, amulets, update);
                                        showAmuletGroupsPopup();
                                    }

                                    genericPopupClose(true);

                                    let bag = [];
                                    let store = [];
                                    if (queryAmulets(bag, store) == 0) {
                                        alert('护符信息加载异常，请检查！');
                                        refreshEquipmentPage(null);
                                        return;
                                    }

                                    let amulets = bag.concat(store);
                                    let bagGroup = amuletCreateGroupFromArray('当前饰品栏', bag);
                                    let groups = amuletLoadGroups();
                                    if (bagGroup == null && groups.count() == 0) {
                                        alert('饰品栏为空，且未找到预保存的护符组信息！');
                                        return;
                                    }

                                    let bagCells = 8 + parseInt(wishpool?.[0] ?? 0);
                                    if (userInfo?.bvip) {
                                        bagCells += 2;
                                    }
                                    if (userInfo?.svip) {
                                        bagCells += 5;
                                    }

                                    genericPopupSetContent(
                                        '护符组管理',
                                        '<style> .group-menu { position:relative;' +
                                                              'display:inline-block;' +
                                                              'color:blue;' +
                                                              'font-size:20px;' +
                                                              'cursor:pointer; } ' +
                                                '.group-menu-items { display:none;' +
                                                                    'position:absolute;' +
                                                                    'font-size:15px;' +
                                                                    'word-break:keep-all;' +
                                                                    'white-space:nowrap;' +
                                                                    'margin:0 auto;' +
                                                                    'width:fit-content;' +
                                                                    'z-index:999;' +
                                                                    'background-color:white;' +
                                                                    'box-shadow:0px 2px 16px 4px rgba(0, 0, 0, 0.4);' +
                                                                    'padding:15px 30px; } ' +
                                                '.group-menu-item { } ' +
                                                '.group-menu-item a.item-error { color:red; } ' +
                                                '.group-menu:hover .group-menu-items { display:block; } ' +
                                                '.group-menu-items .group-menu-item:hover { background-color:#bbddff; } ' +
                                        '</style>' +
                                        '<div id="popup_amulet_groups" style="margin-top:15px;"></div>');
                                    let amuletContainer = genericPopupQuerySelector('#popup_amulet_groups');
                                    let groupMenuDiv = document.createElement('div');
                                    groupMenuDiv.className = 'group-menu-items';
                                    groupMenuDiv.innerHTML = '<ul></ul>';
                                    let groupMenu = groupMenuDiv.firstChild;

                                    if (bagGroup != null) {
                                        let groupDiv = document.createElement('div');
                                        groupDiv.className = g_genericPopupTopLineDivClass;
                                        groupDiv.id = 'popup_amulet_group_bag';
                                        groupDiv.setAttribute('group-name', '当前饰品栏内容');
                                        groupDiv.innerHTML =
                                            `<b class="group-menu" style="color:${bagGroup.count() > bagCells ? 'red' : 'blue'};">` +
                                               `当前饰品栏内容 [${bagGroup.count()} / ${bagCells}] ▼</b>`;

                                        let mitem = document.createElement('li');
                                        mitem.className = 'group-menu-item';
                                        mitem.innerHTML =
                                            `<a href="#popup_amulet_group_bag">当前饰品栏内容 [${bagGroup.count()} / ${bagCells}]</a>`;
                                        groupMenu.appendChild(mitem);

                                        g_amuletTypeNames.slice().reverse().forEach((item) => {
                                            let btn = document.createElement('button');
                                            btn.innerText = '清空' + item;
                                            btn.style.float = 'right';
                                            btn.setAttribute('amulet-key', item);
                                            btn.onclick = clearSpecAmulet;
                                            groupDiv.appendChild(btn);
                                        });

                                        function clearSpecAmulet(e) {
                                            genericPopupShowProgressMessage('处理中，请稍候...');
                                            beginClearBag(
                                                backpacksDiv.querySelectorAll(bagObjectsQueryString),
                                                e.target.getAttribute('amulet-key'),
                                                (total, count) => {
                                                    genericPopupShowProgressMessage(`处理中，请稍候...（${count} / ${total}）`);
                                                    return true;
                                                },
                                                refreshEquipmentPage,
                                                showAmuletGroupsPopup);
                                        }

                                        let clearBagGroupBtn = document.createElement('button');
                                        clearBagGroupBtn.innerText = '清空饰品栏';
                                        clearBagGroupBtn.style.float = 'right';
                                        clearBagGroupBtn.onclick = (() => {
                                            genericPopupShowProgressMessage('处理中，请稍候...');
                                            beginClearBag(
                                                backpacksDiv.querySelectorAll(bagObjectsQueryString),
                                                null,
                                                (total, count) => {
                                                    genericPopupShowProgressMessage(`处理中，请稍候...（${count} / ${total}）`);
                                                    return true;
                                                },
                                                refreshEquipmentPage,
                                                showAmuletGroupsPopup);
                                        });
                                        groupDiv.appendChild(clearBagGroupBtn);

                                        let saveBagGroupBtn = document.createElement('button');
                                        saveBagGroupBtn.innerText = '保存为护符组';
                                        saveBagGroupBtn.style.float = 'right';
                                        saveBagGroupBtn.onclick = (async () => {
                                            let groupName = await inputAmuletGroupNameAsync();
                                            if (groupName != null) {
                                                beginSaveBagAsGroup(groupName, false);
                                            }
                                        });
                                        groupDiv.appendChild(saveBagGroupBtn);

                                        let groupInfoDiv = document.createElement('div');
                                        groupInfoDiv.innerHTML =
                                            `<hr><ul style="color:#000080;">${bagGroup.formatBuffSummary('<li>', '</li>', '', true)}</ul>
                                             <hr><ul>${bagGroup.formatItems('<li>', '<li style="color:red;">', '</li>', '</li>', '')}</ul>
                                             <hr><ul><li>AMULET ${bagGroup.formatBuffShortMark(' ', ' ', false)} ENDAMULET</li></ul>`;
                                        groupDiv.appendChild(groupInfoDiv);

                                        amuletContainer.appendChild(groupDiv);
                                    }

                                    let li = 0
                                    let groupArray = groups.toArray();
                                    let gl = (groupArray?.length ?? 0);
                                    if (gl > 0) {
                                        let groupBindingMap = new Map();
                                        readBindingSolutionList()?.forEach((role) => {
                                            role.bindings.forEach((bind) => {
                                                bind.binding.split(BINDING_ELEMENT_SEPARATOR)[5].split(',').forEach((groupName) => {
                                                    if (amuletIsValidGroupName(groupName)) {
                                                        let solutions = (groupBindingMap.get(groupName) ?? []);
                                                        solutions.push(`${role.role.name} ${SOLUTION_NAME_SEPARATOR} ${bind.name}`);
                                                        if (!groupBindingMap.has(groupName)) {
                                                            groupBindingMap.set(groupName, solutions);
                                                        }
                                                    }
                                                });
                                            });
                                        });
                                        groupArray = groupArray.sort((a, b) => a.name < b.name ? -1 : 1);
                                        for (let i = 0; i < gl; i++) {
                                            let err = !groupArray[i].validate(amulets);

                                            let groupDiv = document.createElement('div');
                                            groupDiv.className = g_genericPopupTopLineDivClass;
                                            groupDiv.id = 'popup_amulet_group_' + i;
                                            groupDiv.setAttribute('group-name', groupArray[i].name);
                                            groupDiv.innerHTML =
                                                `<b class="group-menu" style="color:${err ? "red" : "blue"};">` +
                                                `${groupArray[i].name} [${groupArray[i].count()}] ▼</b>`;

                                            let mitem = document.createElement('li');
                                            mitem.className = 'group-menu-item';
                                            mitem.innerHTML =
                                                `<a ${err ? 'class="item-error" ' : ''}href="#popup_amulet_group_${i}">` +
                                                `${groupArray[i].name} [${groupArray[i].count()}]</a>`;
                                            groupMenu.appendChild(mitem);

                                            let amuletDeleteGroupBtn = document.createElement('button');
                                            amuletDeleteGroupBtn.innerText = '删除';
                                            amuletDeleteGroupBtn.style.float = 'right';
                                            amuletDeleteGroupBtn.onclick = ((e) => {
                                                let groupName = e.target.parentElement.getAttribute('group-name');
                                                if (confirm(`删除护符组 "${groupName}" 吗？`)) {
                                                    amuletDeleteGroup(groupName);
                                                    showAmuletGroupsPopup();
                                                }
                                            });
                                            groupDiv.appendChild(amuletDeleteGroupBtn);

                                            let amuletModifyGroupBtn = document.createElement('button');
                                            amuletModifyGroupBtn.innerText = '编辑';
                                            amuletModifyGroupBtn.style.float = 'right';
                                            amuletModifyGroupBtn.onclick = ((e) => {
                                                let groupName = e.target.parentElement.getAttribute('group-name');
                                                modifyAmuletGroup(groupName);
                                            });
                                            groupDiv.appendChild(amuletModifyGroupBtn);

                                            let importAmuletGroupBtn = document.createElement('button');
                                            importAmuletGroupBtn.innerText = '导入';
                                            importAmuletGroupBtn.style.float = 'right';
                                            importAmuletGroupBtn.onclick = ((e) => {
                                                let groupName = e.target.parentElement.getAttribute('group-name');
                                                let persistenceString = prompt('请输入护符组编码（工具软件生成的特殊格式序列）');
                                                if (persistenceString != null) {
                                                    let group = new AmuletGroup(`${groupName}${AMULET_STORAGE_GROUPNAME_SEPARATOR}${persistenceString}`);
                                                    if (group.isValid()) {
                                                        let groups = amuletLoadGroups();
                                                        if (groups.add(group)) {
                                                            amuletSaveGroups(groups);
                                                            showAmuletGroupsPopup();
                                                        }
                                                        else {
                                                            alert('保存失败！');
                                                        }
                                                    }
                                                    else {
                                                        alert('输入的护符组编码无效，请检查！');
                                                    }
                                                }
                                            });
                                            groupDiv.appendChild(importAmuletGroupBtn);

                                            let renameAmuletGroupBtn = document.createElement('button');
                                            renameAmuletGroupBtn.innerText = '更名';
                                            renameAmuletGroupBtn.style.float = 'right';
                                            renameAmuletGroupBtn.onclick = (async (e) => {
                                                let oldName = e.target.parentElement.getAttribute('group-name');
                                                let groupName = await inputAmuletGroupNameAsync(oldName);
                                                if (groupName != null && groupName != oldName) {
                                                    let groups = amuletLoadGroups();
                                                    if (!groups.contains(groupName) || confirm(`护符组 "${groupName}" 已存在，要覆盖吗？`)) {
                                                        if (groups.rename(oldName, groupName)) {
                                                            amuletSaveGroups(groups);
                                                            showAmuletGroupsPopup();
                                                        }
                                                        else {
                                                            alert('更名失败！');
                                                        }
                                                    }
                                                }
                                            });
                                            groupDiv.appendChild(renameAmuletGroupBtn);

                                            let updateAmuletGroupBtn = document.createElement('button');
                                            updateAmuletGroupBtn.innerText = '更新';
                                            updateAmuletGroupBtn.style.float = 'right';
                                            updateAmuletGroupBtn.onclick = ((e) => {
                                                let groupName = e.target.parentElement.getAttribute('group-name');
                                                if (confirm(`用当前饰品栏内容替换 "${groupName}" 护符组预定内容吗？`)) {
                                                    beginSaveBagAsGroup(groupName, true);
                                                }
                                            });
                                            groupDiv.appendChild(updateAmuletGroupBtn);

                                            let unamuletLoadGroupBtn = document.createElement('button');
                                            unamuletLoadGroupBtn.innerText = '入仓';
                                            unamuletLoadGroupBtn.style.float = 'right';
                                            unamuletLoadGroupBtn.onclick = ((e) => {
                                                let groupName = e.target.parentElement.getAttribute('group-name');
                                                genericPopupShowProgressMessage('处理中，请稍候...');
                                                beginUnloadAmuletGroupFromBag(
                                                    backpacksDiv.querySelectorAll(bagObjectsQueryString),
                                                    groupName,
                                                    (total, count) => {
                                                        genericPopupShowProgressMessage(`处理中，请稍候...（${count} / ${total}）`);
                                                        return true;
                                                    },
                                                    refreshEquipmentPage,
                                                    showAmuletGroupsPopup);
                                            });
                                            groupDiv.appendChild(unamuletLoadGroupBtn);

                                            let amuletLoadGroupBtn = document.createElement('button');
                                            amuletLoadGroupBtn.innerText = '装备';
                                            amuletLoadGroupBtn.style.float = 'right';
                                            amuletLoadGroupBtn.onclick = ((e) => {
                                                let groupName = e.target.parentElement.getAttribute('group-name');
                                                genericPopupShowProgressMessage('处理中，请稍候...');
                                                beginLoadAmuletGroupFromStore(
                                                    backpacksDiv.querySelectorAll(storeObjectsQueryString),
                                                    groupName,
                                                    (total, count) => {
                                                        genericPopupShowProgressMessage(`处理中，请稍候...（${count} / ${total}）`);
                                                        return true;
                                                    },
                                                    refreshEquipmentPage,
                                                    showAmuletGroupsPopup);
                                            });
                                            groupDiv.appendChild(amuletLoadGroupBtn);

                                            let solutions = (groupBindingMap.get(groupArray[i].name) ?? ['（未绑定）']);
                                            let groupInfoDiv = document.createElement('div');
                                            groupInfoDiv.innerHTML =
                                                `<hr><ul style="color:#000080;">${groupArray[i].formatBuffSummary('<li>', '</li>', '', true)}</ul>
                                                 <hr><ul><li>${solutions.join('</li><li>')}</li></ul>
                                                 <hr><ul style="color:#000080;">${groupArray[i].formatItems('<li>', '<li style="color:red;">', '</li>', '</li>', '')}</ul>
                                                 <hr><ul><li>AMULET ${groupArray[i].formatBuffShortMark(' ', ' ', false)} ENDAMULET</li></ul>`;
                                            groupDiv.appendChild(groupInfoDiv);

                                            amuletContainer.appendChild(groupDiv);
                                            li += groupArray[i].getDisplayStringLineCount();
                                        }
                                    }

                                    genericPopupQuerySelectorAll('.group-menu')?.forEach((gm) => {
                                        gm.appendChild(groupMenuDiv.cloneNode(true));
                                    });
                                    genericPopupQuerySelectorAll('.group-menu-item')?.forEach((mi) => {
                                        mi.onclick = ((e) => { e.currentTarget?.firstElementChild?.click(); });
                                    });

                                    if (bagGroup != null) {
                                        gl++;
                                        li += bagGroup.getDisplayStringLineCount();
                                    }

                                    genericPopupAddButton('新建护符组', 0, modifyAmuletGroup, true);
                                    genericPopupAddButton(
                                        '导入新护符组',
                                        0,
                                        (async () => {
                                            let groupName = await inputAmuletGroupNameAsync();
                                            if (groupName != null) {
                                                let persistenceString = prompt('请输入护符组编码（工具软件生成的特殊格式序列）');
                                                if (persistenceString != null) {
                                                    let group = new AmuletGroup(`${groupName}${AMULET_STORAGE_GROUPNAME_SEPARATOR}${persistenceString}`);
                                                    if (group.isValid()) {
                                                        let groups = amuletLoadGroups();
                                                        if (!groups.contains(groupName) || confirm(`护符组 "${groupName}" 已存在，要覆盖吗？`)) {
                                                            if (groups.add(group)) {
                                                                amuletSaveGroups(groups);
                                                                showAmuletGroupsPopup();
                                                            }
                                                            else {
                                                                alert('保存失败！');
                                                            }
                                                        }
                                                    }
                                                    else {
                                                        alert('输入的护符组编码无效，请检查！');
                                                    }
                                                }
                                            }
                                        }),
                                        true);
                                    genericPopupAddButton(
                                        '清除护符组',
                                        0,
                                        () => {
                                            if (confirm('要删除全部已定义的护符组信息吗？')) {
                                                amuletClearGroups();
                                                showAmuletGroupsPopup();
                                                alert('已删除全部预定义护符组信息。');
                                            }
                                        },
                                        true);
                                    genericPopupAddCloseButton(80);

                                    genericPopupSetContentSize(Math.min((li * 20) + (gl * 160) + 60, Math.max(window.innerHeight - 200, 400)),
                                                               Math.min(1000, Math.max(window.innerWidth - 100, 600)),
                                                               true);
                                    genericPopupShowModal(true);

                                    (window.getSelection ?? document.getSelection)?.call()?.removeAllRanges();
                                }

                                function modifyAmuletGroup(groupName) {
                                    function divHeightAdjustment(div) {
                                        div.style.height = (div.parentElement.offsetHeight - div.offsetTop - 3) + 'px';
                                    }

                                    function refreshAmuletList() {
                                        amuletList.innerHTML = '';
                                        amulets.forEach((am) => {
                                            if (amuletFilter == -1 || am.type == amuletFilter) {
                                                let item = document.createElement('li');
                                                item.setAttribute('original-id', am.id);
                                                item.innerText = am.formatBuffText();
                                                amuletList.appendChild(item);
                                            }
                                        });
                                    }

                                    function refreshGroupAmuletSummary() {
                                        let count = group.count();
                                        if (count > 0) {
                                            groupSummary.innerHTML = group.formatBuffSummary('<li>', '</li>', '', true);
                                            groupSummary.style.display = 'block';
                                        }
                                        else {
                                            groupSummary.style.display = 'none';
                                            groupSummary.innerHTML = '';
                                        }
                                        divHeightAdjustment(groupAmuletList.parentElement);
                                        amuletCount.innerText = count;
                                    }

                                    function refreshGroupAmuletList() {
                                        groupAmuletList.innerHTML = '';
                                        group.items.forEach((am) => {
                                            if (am.id >= 0) {
                                                let item = document.createElement('li');
                                                item.setAttribute('original-id', am.id);
                                                item.innerText = am.formatBuffText();
                                                groupAmuletList.appendChild(item);
                                            }
                                        });
                                    }

                                    function refreshGroupAmuletDiv() {
                                        refreshGroupAmuletSummary();
                                        refreshGroupAmuletList();
                                    }

                                    function moveAmuletItem(e) {
                                        let li = e.target;
                                        if (li.tagName == 'LI') {
                                            let from = li.parentElement;
                                            let id = li.getAttribute('original-id');
                                            from.removeChild(li);
                                            if (from == amuletList) {
                                                let i = searchElement(amulets, id, (a, b) => a - b.id);
                                                let am = amulets[i];
                                                amulets.splice(i, 1);
                                                groupAmuletList.insertBefore(li, groupAmuletList.children.item(group.add(am)));
                                            }
                                            else {
                                                let am = group.removeId(id);
                                                insertElement(amulets, am, (a, b) => a.id - b.id);
                                                if (amuletFilter == -1 || am.type == amuletFilter) {
                                                    for (var item = amuletList.firstChild;
                                                         parseInt(item?.getAttribute('original-id')) <= am.id;
                                                         item = item.nextSibling);
                                                    amuletList.insertBefore(li, item);
                                                }
                                            }
                                            refreshGroupAmuletSummary();
                                            groupChanged = true;
                                        }
                                    }

                                    let bag = [];
                                    let store = [];
                                    if (queryAmulets(bag, store) == 0) {
                                        alert('获取护符信息失败，请检查！');
                                        return;
                                    }
                                    let amulets = bag.concat(store).sort((a, b) => a.compareTo(b));
                                    amulets.forEach((item, index) => { item.id = index; });

                                    let displayName = groupName;
                                    if (!amuletIsValidGroupName(displayName)) {
                                        displayName = '(未命名)';
                                        groupName = null;
                                    }
                                    else if (displayName.length > 20) {
                                        displayName = displayName.slice(0, 19) + '...';
                                    }

                                    let groupChanged = false;
                                    let group = amuletLoadGroup(groupName);
                                    if (!group?.isValid()) {
                                        group = new AmuletGroup(null);
                                        group.name = '(未命名)';
                                        groupName = null;
                                    }
                                    else {
                                        group.validate(amulets);
                                        while (group.removeId(-1) != null) {
                                            groupChanged = true;
                                        }
                                        group.items.forEach((am) => {
                                            let i = searchElement(amulets, am, (a, b) => a.id - b.id);
                                            if (i >= 0) {
                                                amulets.splice(i, 1);
                                            }
                                        });
                                    }

                                    genericPopupClose(true);

                                    let fixedContent =
                                        '<div style="padding:20px 0px 5px 0px;font-size:18px;color:blue;"><b>' +
                                        '<span>左键双击或上下文菜单键单击护符条目以进行添加或移除操作</span><span style="float:right;">共 ' +
                                        '<span id="amulet_count" style="color:#800020;">0</span> 个护符</span></b></div>';
                                    let mainContent =
                                        '<style> ul > li:hover { background-color:#bbddff; } </style>' +
                                        '<div style="display:block;height:100%;width:100%;">' +
                                          '<div style="position:relative;display:block;float:left;height:96%;width:49%;' +
                                               'margin-top:10px;border:1px solid #000000;">' +
                                            '<div id="amulet_filter" style="display:inline-block;width:100%;padding:5px;color:#0000c0;' +
                                                 'font-size:14px;text-align:center;border-bottom:2px groove #d0d0d0;margin-bottom:10px;">' +
                                            '</div>' +
                                            '<div style="position:absolute;display:block;height:1px;width:100%;overflow:scroll;">' +
                                              '<ul id="amulet_list" style="cursor:pointer;"></ul>' +
                                            '</div>' +
                                          '</div>' +
                                          '<div style="position:relative;display:block;float:right;height:96%;width:49%;' +
                                               'margin-top:10px;border:1px solid #000000;">' +
                                            '<div id="group_summary" style="display:block;width:100%;padding:10px 5px;' +
                                                 'border-bottom:2px groove #d0d0d0;color:#000080;margin-bottom:10px;"></div>' +
                                            '<div style="position:absolute;display:block;height:1px;width:100%;overflow:scroll;">' +
                                              '<ul id="group_amulet_list" style="cursor:pointer;"></ul>' +
                                            '</div>' +
                                          '</div>' +
                                        '</div>';

                                    genericPopupSetFixedContent(fixedContent);
                                    genericPopupSetContent('编辑护符组 - ' + displayName, mainContent);

                                    let amuletCount = genericPopupQuerySelector('#amulet_count');
                                    let amuletFilter = -1;
                                    let amuletFilterList = genericPopupQuerySelector('#amulet_filter');
                                    let amuletList = genericPopupQuerySelector('#amulet_list');
                                    let groupSummary = genericPopupQuerySelector('#group_summary');
                                    let groupAmuletList = genericPopupQuerySelector('#group_amulet_list');

                                    function addAmuletFilterItem(text, amuletTypesId, checked) {
                                        let check = document.createElement('input');
                                        check.type = 'radio';
                                        check.name = 'amulet-filter';
                                        check.id = 'amulet-type-' + amuletTypesId.toString();
                                        check.setAttribute('amulet-type-id', amuletTypesId);
                                        check.checked = checked;
                                        if (amuletFilterList.firstChild != null) {
                                            check.style.marginLeft = '30px';
                                        }
                                        check.onchange = ((e) => {
                                            if (e.target.checked) {
                                                amuletFilter = e.target.getAttribute('amulet-type-id');
                                                refreshAmuletList();
                                            }
                                        });

                                        let label = document.createElement('label');
                                        label.innerText = text;
                                        label.setAttribute('for', check.id);
                                        label.style.cursor = 'pointer';
                                        label.style.marginLeft = '5px';

                                        amuletFilterList.appendChild(check);
                                        amuletFilterList.appendChild(label);
                                    }

                                    for (let amuletType of g_amuletTypeNames) {
                                        addAmuletFilterItem(amuletType,
                                                            g_amuletTypeIds[amuletType.slice(0, g_amuletTypeIds.end - g_amuletTypeIds.start)],
                                                            false);
                                    }
                                    addAmuletFilterItem('全部', -1, true);

                                    refreshAmuletList();
                                    refreshGroupAmuletDiv();

                                    amuletList.oncontextmenu = groupAmuletList.oncontextmenu = ((e) => { e.preventDefault(); moveAmuletItem(e); });
                                    amuletList.ondblclick = groupAmuletList.ondblclick = moveAmuletItem;

                                    genericPopupAddButton(
                                        '清空护符组',
                                        0,
                                        (() => {
                                            if (group.count() > 0) {
                                                group.items.forEach((am) => { insertElement(amulets, am, (a, b) => a.id - b.id); });
                                                group.clear();

                                                refreshAmuletList();
                                                refreshGroupAmuletDiv();

                                                groupChanged = true;
                                            }
                                        }),
                                        true);

                                    if (amuletIsValidGroupName(groupName)) {
                                        genericPopupAddButton(
                                            '另存为',
                                            80,
                                            (async () => {
                                                if (!group.isValid()) {
                                                    alert('护符组内容存在错误，请检查！');
                                                    return;
                                                }

                                                let gn = await inputAmuletGroupNameAsync(groupName);
                                                if (gn == null) {
                                                    return;
                                                }

                                                let groups = amuletLoadGroups();
                                                if (groups.contains(gn) && !confirm(`护符组 "${gn}" 已存在，要覆盖吗？`)) {
                                                    return;
                                                }

                                                group.name = gn;
                                                if (groups.add(group)) {
                                                    amuletSaveGroups(groups);
                                                    showAmuletGroupsPopup();
                                                }
                                                else {
                                                    alert('保存失败！');
                                                }
                                            }),
                                            false);
                                    }

                                    genericPopupAddButton(
                                        '确认',
                                        80,
                                        (async () => {
                                            if (!groupChanged && group.isValid()) {
                                                showAmuletGroupsPopup();
                                                return;
                                            }
                                            else if (!group.isValid()) {
                                                alert('护符组内容存在错误，请检查！');
                                                return;
                                            }

                                            let groups = amuletLoadGroups();
                                            if (!amuletIsValidGroupName(groupName)) {
                                                let gn = await inputAmuletGroupNameAsync(displayName);
                                                if (gn == null || (groups.contains(gn) && !confirm(`护符组 "${gn}" 已存在，要覆盖吗？`))) {
                                                    return;
                                                }
                                                group.name = gn;
                                            }

                                            if (groups.add(group)) {
                                                amuletSaveGroups(groups);
                                                showAmuletGroupsPopup();
                                            }
                                            else {
                                                alert('保存失败！');
                                            }
                                        }),
                                        false);

                                    let btnCancel = genericPopupAddButton(
                                        '取消',
                                        80,
                                        (() => {
                                            if (!groupChanged || confirm('护符组内容已修改，不保存吗？')) {
                                                showAmuletGroupsPopup();
                                            }
                                        }),
                                        false);

                                    genericPopupSetContentSize(Math.min(800, Math.max(window.innerHeight - 200, 500)),
                                                               Math.min(1000, Math.max(window.innerWidth - 100, 600)),
                                                               false);
                                    genericPopupShowModal(false);
                                    genericPopupOnClickOutside(btnCancel.onclick);

                                    divHeightAdjustment(amuletList.parentElement);
                                    divHeightAdjustment(groupAmuletList.parentElement);
                                }

                                function createAmuletGroup(groupName, amulets, update) {
                                    let group = amuletCreateGroupFromArray(groupName, amulets);
                                    if (group != null) {
                                        let groups = amuletLoadGroups();
                                        if (update || !groups.contains(groupName) || confirm(`护符组 "${groupName}" 已存在，要覆盖吗？`)) {
                                            if (groups.add(group)) {
                                                amuletSaveGroups(groups);
                                                genericPopupClose(true);
                                                return true;
                                            }
                                            else {
                                                alert('保存失败！');
                                            }
                                        }
                                    }
                                    else {
                                        alert('保存异常，请检查！');
                                    }
                                    genericPopupClose(true);
                                    return false;
                                }

                                function exportAmulets() {
                                    function formatAmuletsString() {
                                        let bag = [];
                                        let store = [];
                                        let exportLines = [];
                                        if (queryAmulets(bag, store) > 0) {
                                            let amulets = bag.concat(store).sort((a, b) => a.compareTo(b));
                                            let amuletIndex = 1;
                                            amulets.forEach((am) => {
                                                exportLines.push(`${('00' + amuletIndex).slice(-3)} - ${am.formatShortMark()}`);
                                                amuletIndex++;
                                            });
                                        }
                                        return (exportLines.length > 0 ? exportLines.join('\n') : '');
                                    }

                                    genericPopupSetContent(
                                        '护符导出',
                                        `<b><div id="amulet_export_tip" style="color:#0000c0;padding:15px 0px 10px;">
                                         请勿修改任何导出内容，将其复制至指定文件中供其它相应工具使用</div></b>
                                         <div style="height:330px;"><textarea id="amulet_persistence_string" readonly="true"
                                         style="height:100%;width:100%;resize:none;"></textarea></div>`);

                                    genericPopupAddButton(
                                        '复制导出内容至剪贴板',
                                        0,
                                        ((e) => {
                                            e.target.disabled = 'disabled';
                                            let tipContainer = genericPopupQuerySelector('#amulet_export_tip');
                                            let tipColor = tipContainer.style.color;
                                            let tipString = tipContainer.innerText;
                                            tipContainer.style.color = '#ff0000';
                                            genericPopupQuerySelector('#amulet_persistence_string').select();
                                            if (document.execCommand('copy')) {
                                                tipContainer.innerText = '导出内容已复制到剪贴板';
                                            }
                                            else {
                                                tipContainer.innerText = '复制失败，这可能是因为浏览器没有剪贴板访问权限，请进行手工复制（CTRL+A, CTRL+C）';
                                            }
                                            setTimeout((() => {
                                                tipContainer.style.color = tipColor;
                                                tipContainer.innerText = tipString;
                                                e.target.disabled = '';
                                            }), 3000);
                                        }),
                                        true);
                                    genericPopupAddCloseButton(80);

                                    genericPopupQuerySelector('#amulet_persistence_string').value = formatAmuletsString();

                                    genericPopupSetContentSize(400, 600, false);
                                    genericPopupShowModal(true);
                                }

                                function exportEquipments() {
                                    function formatEquipString() {
                                        let eqText = [];
                                        let eqs = equipmentNodesToArray(cardingDiv.querySelectorAll(cardingObjectsQueryString));
                                        eqs = equipmentNodesToArray(backpacksDiv.querySelectorAll(storeObjectsQueryString), eqs);
                                        eqs.sort((a, b) => a.compareTo(b));
                                        eqs.forEach((eq) => { eqText.push(eq.formatExportText()); });
                                        return eqText.join('\n');
                                    }

                                    genericPopupSetContent(
                                        '装备导出',
                                        `<b><div id="equip_export_tip" style="color:#0000c0;padding:15px 0px 10px;">
                                         请勿修改任何导出内容，将其复制至指定文件中供其它相应工具使用</div></b>
                                         <div style="height:330px;"><textarea id="equip_persistence_string" readonly="true"
                                         style="height:100%;width:100%;resize:none;"></textarea></div>`);

                                    genericPopupAddButton(
                                        '复制导出内容至剪贴板',
                                        0,
                                        ((e) => {
                                            e.target.disabled = 'disabled';
                                            let tipContainer = genericPopupQuerySelector('#equip_export_tip');
                                            let tipColor = tipContainer.style.color;
                                            let tipString = tipContainer.innerText;
                                            tipContainer.style.color = '#ff0000';
                                            genericPopupQuerySelector('#equip_persistence_string').select();
                                            if (document.execCommand('copy')) {
                                                tipContainer.innerText = '导出内容已复制到剪贴板';
                                            }
                                            else {
                                                tipContainer.innerText = '复制失败，这可能是因为浏览器没有剪贴板访问权限，请进行手工复制（CTRL+A, CTRL+C）';
                                            }
                                            setTimeout((() => {
                                                tipContainer.style.color = tipColor;
                                                tipContainer.innerText = tipString;
                                                e.target.disabled = '';
                                            }), 3000);
                                        }),
                                        true);
                                    genericPopupAddCloseButton(80);

                                    genericPopupQuerySelector('#equip_persistence_string').value = formatEquipString();

                                    genericPopupSetContentSize(400, 600, false);
                                    genericPopupShowModal(true);
                                }

                                let amuletButtonsGroupContainer = document.getElementById('amulet_management_btn_group');
                                if (amuletButtonsGroupContainer == null) {
                                    let equipCtrlContainer = document.querySelector('#equip-ctrl-container');
                                    amuletButtonsGroupContainer = document.createElement('p');
                                    amuletButtonsGroupContainer.id = 'amulet_management_btn_group';
                                    amuletButtonsGroupContainer.style.display = 'inline-block';
                                    amuletButtonsGroupContainer.style.float = 'left';
                                    equipCtrlContainer.insertBefore(amuletButtonsGroupContainer, equipCtrlContainer.firstElementChild);

                                    let exportAmuletsBtn = document.createElement('button');
                                    exportAmuletsBtn.innerText = '导出护符';
                                    exportAmuletsBtn.style.width = '100px';
                                    exportAmuletsBtn.style.marginRight = '1px';
                                    exportAmuletsBtn.onclick = (() => {
                                        exportAmulets();
                                    });
                                    amuletButtonsGroupContainer.appendChild(exportAmuletsBtn);

                                    let exportEquipBtn = document.createElement('button');
                                    exportEquipBtn.innerText = '导出装备';
                                    exportEquipBtn.style.width = '100px';
                                    exportEquipBtn.style.marginRight = '1px';
                                    exportEquipBtn.onclick = (() => {
                                        exportEquipments();
                                    });
                                    amuletButtonsGroupContainer.appendChild(exportEquipBtn);

                                    let manageAmuletGroupBtn = document.createElement('button');
                                    manageAmuletGroupBtn.innerText = '管理护符组';
                                    manageAmuletGroupBtn.style.width = '100px';
                                    manageAmuletGroupBtn.onclick = (() => {
                                        genericPopupInitialize();
                                        showAmuletGroupsPopup();
                                    });
                                    amuletButtonsGroupContainer.appendChild(manageAmuletGroupBtn);

                                    document.getElementById(storeButtonId).onclick = (() => {
                                        if ($('#backpacks > ' + storeQueryString).css('display') == 'none') {
                                            $('#backpacks > ' + storeQueryString).show();
                                        } else {
                                            $('#backpacks > ' + storeQueryString).hide();
                                        }
                                        backupEquipmentDivState({ target : document.getElementById(storeButtonId) });
                                    });
                                }

                                let bagButtonsGroupContainer = document.getElementById('bag_management_btn_group');
                                if (bagButtonsGroupContainer == null) {
                                    let bagTitle = backpacksDiv.querySelector(bagQueryString + ' > p.fyg_tr');
                                    let bagButtonsGroupContainer = document.createElement('p');
                                    bagButtonsGroupContainer.id = 'bag_management_btn_group';
                                    bagButtonsGroupContainer.style.display = 'inline-block';
                                    bagButtonsGroupContainer.style.float = 'left';
                                    bagButtonsGroupContainer.style.marginTop = '6px';
                                    bagTitle.insertBefore(bagButtonsGroupContainer, bagTitle.firstElementChild);

                                    let beginClearBagBtn = document.createElement('button');
                                    beginClearBagBtn.innerText = '清空饰品栏';
                                    beginClearBagBtn.style.width = '100px';
                                    beginClearBagBtn.style.marginRight = '1px';
                                    beginClearBagBtn.onclick = (() => {
                                        genericPopupShowProgressMessage('处理中，请稍候...');
                                        beginClearBag(
                                            backpacksDiv.querySelectorAll(bagObjectsQueryString),
                                            null,
                                            (total, count) => {
                                                genericPopupShowProgressMessage(`处理中，请稍候...（${count} / ${total}）`);
                                                return true;
                                            },
                                            refreshEquipmentPage,
                                            () => { genericPopupClose(true, true); });
                                    });
                                    bagButtonsGroupContainer.appendChild(beginClearBagBtn);

                                    let amuletSaveGroupBtn = document.createElement('button');
                                    amuletSaveGroupBtn.innerText = '存为护符组';
                                    amuletSaveGroupBtn.style.width = '100px';
                                    amuletSaveGroupBtn.onclick = (async () => {
                                        let groupName = await inputAmuletGroupNameAsync();
                                        if (groupName != null) {
                                            let amulets = [];
                                            if (queryAmulets(amulets, null) == 0) {
                                                alert('保存失败，请检查饰品栏内容！');
                                            }
                                            else if (createAmuletGroup(groupName, amulets, false)) {
                                                alert('保存成功。');
                                            }
                                        }
                                    });
                                    bagButtonsGroupContainer.appendChild(amuletSaveGroupBtn);
                                }

                                $('#equipmentDiv .btn-equipment .bg-danger.with-padding').css({
                                    'max-width': '220px',
                                    'padding': '5px 5px 5px 5px',
                                    'white-space': 'pre-line',
                                    'word-break': 'break-all'
                                });

                                collapseEquipmentDiv(equipmentExpand, forceEquipDivOperation);
                                changeEquipmentDivStyle(equipmentBG);
                                switchObjectContainerStatus(!equipmentStoreExpand);

                                forceEquipDivOperation = false;
                            }
                            if (fnPostProcess != null) {
                                fnPostProcess(fnParams);
                            }
                        }
                    }, 200);
                }

                const g_genCalcCfgPopupLinkId = 'gen_calc_cfg_popup_link';
                const g_bindingPopupLinkId = 'binding_popup_link';
                const g_bindingSolutionId = 'binding_solution_div';
                const g_bindingListSelectorId = 'binding_list_selector';
                const g_equipOnekeyLinkId = 'equip_one_key_link';
                function equipOnekey() {
                    function refreshRolePage(error, roleId) {
                        cding();
                        xxcard(roleId);
                    }
                    let solutionSelector = document.getElementById(g_bindingListSelectorId);
                    let rn = solutionSelector?.value?.split(':');
                    if (rn?.length == 2) {
                        let solution = rn[1].trim();
                        if (solution?.length > 0) {
                            let roleId = g_roleMap.get(rn[0].trim()).id;
                            let udata = loadUserConfigData();
                            if (udata.dataBindDefault[roleId] != solution) {
                                udata.dataBindDefault[roleId] = solution;
                                saveUserConfigData(udata);
                            }
                            switchSolutionByName(roleId, solution, refreshRolePage, roleId);
                            return;
                        }
                    }
                    alert('绑定信息读取失败，无法装备！');
                }

                const BINDING_NAME_DEFAULT = '(未命名)';
                async function showBindingPopup(roleId) {
                    genericPopupInitialize();
                    genericPopupShowProgressMessage('读取中，请稍候...');

                    let bindInfo = readBindingSolutionList(roleId);
                    let cardInfo = await readCardInfoAsync(roleId, true);

                    const highlightBackgroundColor = '#80c0f0';
                    const fixedContent =
                        '<style> .binding-list  { position:relative; width:100%; display:inline-block; } ' +
                                '.binding-names { display:none;' +
                                                 'position:absolute;' +
                                                 'word-break:keep-all;' +
                                                 'white-space:nowrap;' +
                                                 'margin:0 auto;' +
                                                 'width:100%;' +
                                                 'z-index:999;' +
                                                 'background-color:white;' +
                                                 'box-shadow:0px 2px 16px 4px rgba(0, 0, 0, 0.4);' +
                                                 'padding:10px 20px; } '+
                                '.binding-name  { cursor:pointer; } ' +
                                '.binding-list:hover .binding-names { display:block; } ' +
                                '.binding-list:focus-within .binding-names { display:block; } ' +
                                '.binding-names .binding-name:hover { background-color:#bbddff; } </style>' +
                        `<div style="width:100%;color:#0000ff;padding:20px 10px 5px 0px;"><b style="font-size:15px;">绑定方案名称` +
                        `（不超过31个字符，请仅使用大、小写英文字母、数字、连字符、下划线及中文字符）：` +
                        `<span id="${g_genericPopupInformationTipsId}" style="float:right;color:red;"></span></b></div>
                         <div style="width:100%;padding:0px 10px 20px 0px;"><div class="binding-list">
                         <input type="text" id="binding_name" style="display:inline-block;width:100%;" maxlength="31" />
                         <div class="binding-names" id="binding_list"><ul></ul></div></div></div>`;
                    const pointsTable =
                          '<table class="points-info" id="points-info">' +
                             '<tr class="alt">' +
                             '<th class="points-bind">绑定</th><th class="points-summary">属性点</th>' +
                             '<th class="points-attribute">力量</th><th class="points-attribute">敏捷</th><th class="points-attribute">智力</th>' +
                             '<th class="points-attribute">体魄</th><th class="points-attribute">精神</th><th class="points-attribute">意志</th>' +
                             '<th class="points-operation">操作</th></tr>' +
                             '<tr id="points-alloc">' +
                             '<td><input type="checkbox" id="points-bind" /></td>' +
                             '<td id="points-summary" style="text-align:center;"></td>' +
                             '<td><input type="text" style="width:90%;" value="1" oninput="value=value.replace(/[\\D]/g,\'\');" /></td>' +
                             '<td><input type="text" style="width:90%;" value="1" oninput="value=value.replace(/[\\D]/g,\'\');" /></td>' +
                             '<td><input type="text" style="width:90%;" value="1" oninput="value=value.replace(/[\\D]/g,\'\');" /></td>' +
                             '<td><input type="text" style="width:90%;" value="1" oninput="value=value.replace(/[\\D]/g,\'\');" /></td>' +
                             '<td><input type="text" style="width:90%;" value="1" oninput="value=value.replace(/[\\D]/g,\'\');" /></td>' +
                             '<td><input type="text" style="width:90%;" value="1" oninput="value=value.replace(/[\\D]/g,\'\');" /></td>' +
                             '<td><button type="button" id="points-restore" style="width:48%;margin-left:1px;">恢复</button>' +
                                 '<button type="button" id="points-read" style="width:48%;margin-left:1px;">实际</button></td>' +
                             '</tr>' +
                             '<tr class="alt" id="points-dist">' +
                             '<td></td>' +
                             '<td style="text-align:center;">平均分配自由点数</td>' +
                             '<td><input type="checkbox" id="points-dist-str" /></td><td><input type="checkbox" id="points-dist-agi" /></td>' +
                             '<td><input type="checkbox" id="points-dist-int" /></td><td><input type="checkbox" id="points-dist-vit" /></td>' +
                             '<td><input type="checkbox" id="points-dist-spr" /></td><td><input type="checkbox" id="points-dist-mnd" /></td>' +
                             '<td><button type="button" id="points-dist-none" style="width:48%;margin-left:1px;">清除</button>' +
                                 '<button type="button" id="points-dist-all" style="width:48%;margin-left:1px;">全选</button></td>' +
                             '</tr></table>';
                    const mainContent =
                        `<style> .equipment_label    { display:inline-block; width:15%; }
                                 .equipment_selector { display:inline-block; width:84%; color:#145ccd; float:right; }
                                  ul > li { cursor:pointer; }
                                  table.points-info { width:100%; } ' +
                                        table.points-info th.points-bind { width:5%; text-align:left; }
                                        table.points-info th.points-summary { width:25%; text-align:center; }
                                        table.points-info th.points-attribute { width:9%; text-align:left; }
                                        table.points-info th.points-operation { width:16%; text-align:center; }
                                        table.points-info button { width:48%;float:right; }
                                        table tr.alt { background-color:${g_genericPopupBackgroundColorAlt}; } </style>
                         <div class="${g_genericPopupTopLineDivClass}" id="role_export_div" style="display:none;">
                         <div style="height:200px;">
                              <textarea id="role_export_string" readonly="true" style="height:100%;width:100%;resize:none;"></textarea></div>
                         <div style="padding:10px 0px 20px 0px;">
                              <button type="button" style="float:right;margin-left:1px;" id="hide_export_div">隐藏</button>
                              <button type="button" style="float:right;" id="copy_export_string">复制导出内容至剪贴板</button></div></div>
                         <div class="${g_genericPopupTopLineDivClass}">
                              <b><input type="checkbox" id="points-notice" />
                              <label for="points-notice" style="margin-left:5px;font-size:1.15em;color:red;cursor:pointer;">` +
                                    `本人完全知悉此选项所有可能的副作用，并且自愿承担由此产生的一切损失</label></b>
                              <br><br>${pointsTable}</div>
                         <div class="${g_genericPopupTopLineDivClass}">
                             <span class="equipment_label">武器装备：</span><select class="equipment_selector"></select><br><br>
                             <span class="equipment_label">手臂装备：</span><select class="equipment_selector"></select><br><br>
                             <span class="equipment_label">身体装备：</span><select class="equipment_selector"></select><br><br>
                             <span class="equipment_label">头部装备：</span><select class="equipment_selector"></select><br></div>
                         <div class="${g_genericPopupTopLineDivClass}"><div id="halo_selector"></div></div>
                         <div class="${g_genericPopupTopLineDivClass}" id="amulet_selector" style="display:block;"><div></div></div>`;

                    genericPopupSetFixedContent(fixedContent);
                    genericPopupSetContent(`${cardInfo.meta.name} - ${cardInfo.level} 级`, mainContent);

                    let ptsTotal = Math.trunc((cardInfo.level * 3 + 6) * (1 + cardInfo.quality / 100));
                    let ptsUsed = 0;
                    let ptsNotice = genericPopupQuerySelector('#points-notice');
                    let ptsInfo = genericPopupQuerySelector('#points-info');
                    let ptsBind = ptsInfo.querySelector('#points-bind');
                    let ptsSum = ptsInfo.querySelector('#points-summary');
                    let ptsOriginal = cardInfo.points.slice();
                    let ptsText = ptsInfo.querySelectorAll('#points-alloc input[type="text"]');
                    let ptsRead = ptsInfo.querySelector('#points-read');
                    let ptsRestore = ptsInfo.querySelector('#points-restore');
                    let ptsDist = ptsInfo.querySelectorAll('#points-dist input[type="checkbox"]');
                    let ptsDistAll = ptsInfo.querySelector('#points-dist-all');
                    let ptsDistNone = ptsInfo.querySelector('#points-dist-none');
                    function representBindPoints(notice, bind, dist, points) {
                        if (notice != null) {
                            ptsNotice.checked = notice;
                        }
                        if (bind != null) {
                            ptsBind.checked = bind;
                        }
                        for (let i = 0; i < 6; i++) {
                            ptsText[i].value = points[i];
                        }
                        if (dist != null) {
                            ptsDist.forEach((chk, i) => { chk.checked = (dist.indexOf(i) >= 0); });
                        }
                        ptsChanged();
                    }
                    function collectBindPoints() {
                        if (ptsNotice.checked) {
                            let v = [];
                            let d = '';
                            v.push(ptsNotice.checked.toString());
                            v.push(ptsBind.checked.toString());
                            ptsDist.forEach((chk, i) => { d += (chk.checked ? i.toString() : ''); });
                            v.push(d);
                            ptsText.forEach((txt) => { v.push(txt.value); });
                            return v;
                        }
                        return [];
                    }
                    function ptsChanged() {
                        ptsBind.disabled = (ptsNotice.checked ? '' : 'disabled');
                        let td = (!ptsBind.checked || ptsBind.disabled ? 'disabled' : '');
                        ptsText.forEach((txt) => { txt.disabled = td; });
                        ptsRead.disabled = td;
                        ptsRestore.disabled = td;
                        ptsDist.forEach((chk) => { chk.disabled = td; });
                        ptsDistAll.disabled = td;
                        ptsDistNone.disabled = td;

                        ptsUsed = 0;
                        for (let i = 0; i < 6; i++) {
                            let pt = parseInt(ptsText[i].value);
                            if (isNaN(pt) || pt < 1) {
                                ptsText[i].value = '1';
                                pt = 1;
                            }
                            ptsUsed += pt;
                        }
                        ptsSum.innerText = `${ptsUsed} / ${ptsTotal} （${ptsTotal - ptsUsed}）`;
                        ptsSum.style.color = (ptsUsed > ptsTotal ? 'red' : 'blue');
                    }
                    ptsNotice.onchange = ptsBind.onchange = ptsChanged;
                    ptsText.forEach((txt) => { txt.onchange = ptsChanged; });
                    ptsRead.onclick = ptsRestore.onclick = ((e) => {
                        representBindPoints(null, null, null, e.currentTarget.id == 'points-read' ? cardInfo.points : ptsOriginal);
                    });
                    ptsDistAll.onclick = ptsDistNone.onclick = ((e) => {
                        ptsDist.forEach((chk) => { chk.checked = (e.currentTarget.id == 'points-dist-all'); });
                    });
                    representBindPoints(null, null, null, cardInfo.points);

                    let eq_selectors = genericPopupQuerySelectorAll('select.equipment_selector');
                    let asyncOperations = 4;
                    let haloMax = 0;
                    let haloGroupItemMax = 0;

                    let store = [];
                    beginReadObjects(
                        null,
                        store,
                        async () => {
                            let equipment = equipmentNodesToArray(store);
                            let cr = await readCurrentRoleAsync(true);
                            if (cr != null) {
                                equipmentNodesToArray(cr.equips, equipment);
                            }
                            equipment.sort((a, b) => a.compareTo(b)).forEach((item) => {
                                let lv = item.getQualityLevel();
                                let op = document.createElement('option');
                                op.style.backgroundColor = g_equipmentLevelBGColor[lv];
                                op.innerText =
                                    `${item.meta.alias} Lv.${item.level} （${item.getQuality()}%） - ` +
                                    `${item.pAttributes.join('% ')}% ${item.myst ? ' - [ 神秘 ]' : ''}`;
                                op.title =
                                    `Lv.${item.level} - ${item.myst ? '神秘' : ''}${g_equipmentLevelName[lv]}装备\n` +
                                    `${item.formatEquipAttrText('\n')}`;
                                op.value = item.formatEquipText(true);
                                eq_selectors[item.meta.type].appendChild(op);
                            });

                            eq_selectors.forEach((eqs) => {
                                eqs.onchange = equipSelectionChange;
                                equipSelectionChange({ target : eqs });
                            });
                            function equipSelectionChange(e) {
                                let op = e.target.options[e.target.selectedIndex];
                                e.target.title = (op?.title ?? '');
                                e.target.style.backgroundColor = (op?.style.backgroundColor ?? 'white');
                            }
                            asyncOperations--;
                        });

                    let currentHalo;
                    beginReadHaloInfo(
                        currentHalo = {},
                        () => {
                            haloMax = currentHalo.points;
                            let haloInfo =
                                `天赋点：<span style="color:#0000c0;"><span id="halo_points">0</span> / ${haloMax}</span>，
                                 技能位：<span style="color:#0000c0;"><span id="halo_slots">0</span> / ${cardInfo.haloSlots}</span>
                                 <b id="halo_errors" style="display:none;color:red;margin-left:15px;">（光环天赋点数 / 角色卡片技能位不足）</b>`;
                            let haloSelector = genericPopupQuerySelector('#halo_selector');
                            haloSelector.innerHTML =
                                `<style> .halo_group { display:block; width:20%; float:left; text-align:center; border-left:1px solid grey; }
                                         div > a { display:inline-block; width:80%; } </style>
                                 <div>${haloInfo}</div>
                                 <p></p>
                                 <div style="display:table;">
                                 <div class="halo_group"></div>
                                 <div class="halo_group"></div>
                                 <div class="halo_group"></div>
                                 <div class="halo_group"></div>
                                 <div class="halo_group" style="border-right:1px solid grey;"></div></div>`;
                            let haloGroups = haloSelector.querySelectorAll('.halo_group');
                            let group = -1;
                            let points = -1;
                            g_halos.forEach((item) => {
                                if (item.points != points) {
                                    points = item.points;
                                    group++;
                                }
                                let a = document.createElement('a');
                                a.href = '###';
                                a.className = 'halo_item';
                                a.innerText = item.name + ' ' + item.points;
                                a.title = item.description;
                                haloGroups[group].appendChild(a);
                                if (haloGroups[group].children.length > haloGroupItemMax) {
                                    haloGroupItemMax = haloGroups[group].children.length;
                                }
                            });

                            function selector_halo() {
                                let hp = parseInt(haloPoints.innerText);
                                let hs = parseInt(haloSlots.innerText);
                                if ($(this).attr('item-selected') != 1) {
                                    $(this).attr('item-selected', 1);
                                    $(this).css('background-color', highlightBackgroundColor);
                                    hp += parseInt($(this).text().split(' ')[1]);
                                    hs++;
                                }
                                else {
                                    $(this).attr('item-selected', 0);
                                    $(this).css('background-color', g_genericPopupBackgroundColor);
                                    hp -= parseInt($(this).text().split(' ')[1]);
                                    hs--;
                                }
                                haloPoints.innerText = hp;
                                haloSlots.innerText = hs;
                                haloPoints.style.color = (hp <= haloMax ? '#0000c0' : 'red');
                                haloSlots.style.color = (hs <= cardInfo.haloSlots ? '#0000c0' : 'red');
                                haloErrors.style.display = (hp <= haloMax && hs <= cardInfo.haloSlots ? 'none' : 'inline-block');
                            }

                            haloPoints = genericPopupQuerySelector('#halo_points');
                            haloSlots = genericPopupQuerySelector('#halo_slots');
                            haloErrors = genericPopupQuerySelector('#halo_errors');
                            $('.halo_item').each(function(i, e) {
                                $(e).on('click', selector_halo);
                                $(e).attr('original-item', $(e).text().split(' ')[0]);
                            });
                            asyncOperations--;
                        });

                    if (wishpool?.length > 0) {
                        asyncOperations--;
                    }
                    else {
                        beginReadWishpool(wishpool, null, () => { asyncOperations--; });
                    }
                    if (userInfo?.isUserInfo) {
                        asyncOperations--;
                    }
                    else {
                        beginReadUserInfo(userInfo, () => { asyncOperations--; });
                    }

                    function collectBindingInfo() {
                        let halo = [];
                        let sum = 0;
                        $('.halo_item').each(function(i, e) {
                            if ($(e).attr('item-selected') == 1) {
                                let ee = e.innerText.split(' ');
                                sum += parseInt(ee[1]);
                                halo.push($(e).attr('original-item'));
                            }
                        });
                        if (ptsTotal >= ptsUsed && sum <= haloMax && halo.length <= cardInfo.haloSlots) {
                            let roleInfo = [ cardInfo.meta.shortMark, cardInfo.level, userInfo.level, cardInfo.haloSlots, cardInfo.quality ];
                            if (cardInfo.meta.hasG) {
                                roleInfo.splice(1, 0, 'G=' + cardInfo.growth);
                            }

                            let amuletArray = [];
                            $('.amulet_item').each(function(i, e) {
                                if ($(e).attr('item-selected') == 1) {
                                    amuletArray[parseInt(e.lastChild.innerText) - 1] = ($(e).attr('original-item'));
                                }
                            });

                            let eqs = [];
                            eq_selectors.forEach((eq) => { eqs.push(eq.value); });

                            let ptsBind = collectBindPoints();

                            return [ roleInfo, wishpool.slice(-g_wishpoolLength), amuletArray,
                                     ptsBind[1] == 'true' ? ptsBind.slice(-6) : cardInfo.points, eqs, halo, ptsBind ];
                        }
                        return null;
                    }

                    function generateExportString() {
                        let info = collectBindingInfo();
                        if (info?.length > 0) {
                            let exp = [ info[0].join(' '), 'WISH ' + info[1].join(' ') ];

                            let ag = new AmuletGroup();
                            ag.name = 'export-temp';
                            info[2].forEach((gn) => {
                                ag.merge(amuletGroups.get(gn));
                            });
                            if (ag.isValid()) {
                                exp.push(`AMULET ${ag.formatBuffShortMark(' ', ' ', false)} ENDAMULET`);
                            }

                            exp.push(info[3].join(' '));

                            info[4].forEach((eq) => {
                                exp.push((new Equipment()).fromEquipText(eq)?.formatExportText() ?? 'NONE');
                            });

                            let halos = [ info[5].length ];
                            info[5].forEach((h) => {
                                let halo = g_haloMap.get(h);
                                halos.push(halo.exportAlias ?? halo.shortMark);
                            });
                            exp.push(halos.join(' '));

                            return exp.join('\n') + '\n';
                        }
                        else {
                            alert('加点或光环天赋设置有误！');
                        }
                        return null;
                    }

                    function unbindAll() {
                        if (confirm('这将清除本卡片全部绑定方案，继续吗？')) {
                            let udata = loadUserConfigData();
                            if (udata.dataBind[cardInfo.meta.id] != null) {
                                delete udata.dataBind[cardInfo.meta.id];
                            }
                            saveUserConfigData(udata);
                            bindingName.value = BINDING_NAME_DEFAULT;
                            bindingList.innerHTML = '';
                            refreshBindingSelector(cardInfo.meta.id);
                            genericPopupShowInformationTips('解除全部绑定成功', 5000);
                        }
                    };

                    function deleteBinding() {
                        if (validateBindingName()) {
                            let bindings = [];
                            let found = false;
                            $('.binding-name').each((index, item) => {
                                if (item.innerText == bindingName.value) {
                                    bindingList.removeChild(item);
                                    found = true;
                                }
                                else {
                                    bindings.push(`${item.innerText}${BINDING_NAME_SEPARATOR}${item.getAttribute('original-item')}`);
                                }
                            });
                            if (found) {
                                let bn = bindingName.value;
                                let bi = null;
                                let udata = loadUserConfigData();
                                if (bindings.length > 0) {
                                    udata.dataBind[cardInfo.meta.id] = bindings.join(BINDING_SEPARATOR);
                                    bindingName.value = bindingList.children[0].innerText;
                                    bi = bindingList.children[0].getAttribute('original-item');
                                }
                                else if (udata.dataBind[cardInfo.meta.id] != null) {
                                    delete udata.dataBind[cardInfo.meta.id];
                                    bindingName.value = BINDING_NAME_DEFAULT;
                                }
                                saveUserConfigData(udata);
                                refreshBindingSelector(cardInfo.meta.id);
                                representBinding(bi);
                                genericPopupShowInformationTips(bn + '：解绑成功', 5000);
                            }
                            else {
                                alert('方案名称未找到！');
                            }
                        }
                    };

                    function saveBinding() {
                        if (validateBindingName()) {
                            let info = collectBindingInfo();
                            if (info?.length > 0) {
                                let bind_info = [ info[4][0], info[4][1], info[4][2], info[4][3], info[5].join(','),
                                                  info[2].join(','), info[6].join(',') ].join(BINDING_ELEMENT_SEPARATOR);
                                let newBinding = true;
                                let bindings = [];
                                ptsOriginal = (info[6].length >= 8 ? info[6].slice(-6) : cardInfo.points.slice());
                                $('.binding-name').each((index, item) => {
                                    if (item.innerText == bindingName.value) {
                                        item.setAttribute('original-item', bind_info);
                                        newBinding = false;
                                    }
                                    bindings.push(`${item.innerText}${BINDING_NAME_SEPARATOR}${item.getAttribute('original-item')}`);
                                });
                                if (newBinding) {
                                    let li = document.createElement('li');
                                    li.className = 'binding-name';
                                    li.innerText = bindingName.value;
                                    li.setAttribute('original-item', bind_info);
                                    for (var li0 = bindingList.firstChild; li0?.innerText < li.innerText; li0 = li0.nextSibling);
                                    bindingList.insertBefore(li, li0);
                                    bindings.push(`${bindingName.value}${BINDING_NAME_SEPARATOR}${bind_info}`);
                                }

                                let udata = loadUserConfigData();
                                udata.dataBind[cardInfo.meta.id] = bindings.join(BINDING_SEPARATOR);
                                saveUserConfigData(udata);
                                refreshBindingSelector(cardInfo.meta.id);
                                genericPopupShowInformationTips(bindingName.value + '：绑定成功', 5000);
                                if (amuletMissing != null) {
                                    amuletMissing.style.display = 'none';
                                }
                            }
                            else {
                                alert('加点或光环天赋设置有误！');
                            }
                        }
                    }

                    function isValidBindingName(bindingName) {
                        return (bindingName?.length > 0 && bindingName.length < 32 && bindingName.search(USER_STORAGE_RESERVED_SEPARATORS) < 0);
                    }

                    function validateBindingName() {
                        let valid = isValidBindingName(bindingName.value);
                        genericPopupShowInformationTips(valid ? null : '方案名称不符合规则，请检查');
                        return valid;
                    }

                    function validateBinding() {
                        if (validateBindingName) {
                            let ol = bindingList.children.length;
                            for (let i = 0; i < ol; i++) {
                                if (bindingName.value == bindingList.children[i].innerText) {
                                    representBinding(bindingList.children[i].getAttribute('original-item'));
                                    break;
                                }
                            }
                        }
                    }

                    function representBinding(items) {
                        if (items?.length > 0) {
                            let elements = items.split(BINDING_ELEMENT_SEPARATOR);
                            if (elements.length > 3) {
                                let v = elements.slice(0, 4);
                                eq_selectors.forEach((eqs) => {
                                    for (let op of eqs.childNodes) {
                                        if (v.indexOf(op.value) >= 0) {
                                            eqs.value = op.value;
                                            break;
                                        }
                                    }
                                    eqs.onchange({ target : eqs });
                                });
                            }
                            if (elements.length > 4) {
                                let hp = 0;
                                let hs = 0;
                                let v = elements[4].split(',');
                                $('.halo_item').each((index, item) => {
                                    let s = (v.indexOf($(item).attr('original-item')) < 0 ? 0 : 1);
                                    $(item).attr('item-selected', s);
                                    $(item).css('background-color', s == 0 ? g_genericPopupBackgroundColor : highlightBackgroundColor);
                                    hp += (s == 0 ? 0 : parseInt($(item).text().split(' ')[1]));
                                    hs += s;
                                });
                                haloPoints.innerText = hp;
                                haloSlots.innerText = hs;
                                haloPoints.style.color = (hp <= haloMax ? '#0000c0' : 'red');
                                haloSlots.style.color = (hs <= cardInfo.haloSlots ? '#0000c0' : 'red');
                                haloErrors.style.display = (hp <= haloMax && hs <= cardInfo.haloSlots ? 'none' : 'inline-block');
                            }
                            selectedAmuletGroupCount = 0;
                            if (elements.length > 5 && amuletCount != null) {
                                let ac = 0;
                                let v = elements[5].split(',');
                                amuletMissing.style.display = 'none';
                                for (let i = v.length - 1; i >= 0; i--) {
                                    if (v[i].trim().length > 0 && !amuletGroups.contains(v[i])) {
                                        v.splice(i, 1);
                                        amuletMissing.style.display = 'inline-block';
                                    }
                                }
                                $('.amulet_item').each((index, item) => {
                                    let j = v.indexOf($(item).attr('original-item'));
                                    let s = (j < 0 ? 0 : 1);
                                    $(item).attr('item-selected', s);
                                    $(item).css('background-color', s == 0 ? g_genericPopupBackgroundColor : highlightBackgroundColor);
                                    item.lastChild.innerText = (j < 0 ? '' : j + 1);
                                    selectedAmuletGroupCount += s;
                                    ac += (s == 0 ? 0 : parseInt($(item).text().match(/\[(\d+)\]/)[1]));
                                });
                                amuletCount.innerText = ac + ' / ' + bagCells;
                                amuletCount.style.color = (ac <= bagCells ? 'blue' : 'red');
                            }
                            let notice, bind, dist;
                            ptsOriginal = elements[6]?.split(',');
                            if (ptsOriginal?.length >= 8) {
                                notice = (ptsOriginal.shift() == 'true');
                                bind = (ptsOriginal.shift() == 'true');
                                dist = (ptsOriginal.length == 6 ? '' : ptsOriginal.shift());
                            }
                            else {
                                ptsOriginal = cardInfo.points.slice();
                                notice = false;
                                bind = false;
                                dist = '';
                            }
                            representBindPoints(notice, bind, dist, ptsOriginal);
                        }
                    }

                    function selector_amulet() {
                        let ac = parseInt(amuletCount.innerText);
                        let tc = parseInt($(this).text().match(/\[(\d+)\]/)[1]);
                        if ($(this).attr('item-selected') != 1) {
                            $(this).attr('item-selected', 1);
                            $(this).css('background-color', highlightBackgroundColor);
                            this.lastChild.innerText = ++selectedAmuletGroupCount;
                            ac += tc;
                        }
                        else {
                            $(this).attr('item-selected', 0);
                            $(this).css('background-color', g_genericPopupBackgroundColor);
                            let i = parseInt(this.lastChild.innerText);
                            this.lastChild.innerText = '';
                            ac -= tc;
                            if (i < selectedAmuletGroupCount) {
                                $('.amulet_item').each((index, item) => {
                                    var j;
                                    if ($(item).attr('item-selected') == 1 && (j = parseInt(item.lastChild.innerText)) > i) {
                                        item.lastChild.innerText = j - 1;
                                    }
                                });
                            }
                            selectedAmuletGroupCount--;
                        }
                        amuletCount.innerText = ac + ' / ' + bagCells;
                        amuletCount.style.color = (ac <= bagCells ? 'blue' : 'red');
                    }

                    let bindingList = genericPopupQuerySelector('#binding_list').firstChild;
                    let bindingName = genericPopupQuerySelector('#binding_name');
                    let haloPoints = null;
                    let haloSlots = null;
                    let haloErrors = null;
                    let amuletContainer = genericPopupQuerySelector('#amulet_selector').firstChild;
                    let amuletCount = null;
                    let amuletMissing = null;
                    let amuletGroups = amuletLoadGroups();
                    let selectedAmuletGroupCount = 0;
                    let bagCells = 8;

                    let amuletGroupCount = (amuletGroups?.count() ?? 0);
                    if (amuletGroupCount > 0) {
                        amuletContainer.innerHTML =
                            '护符组：已选定 <span id="amulet_count">0 / 0</span> 个护符 ' +
                            '<b id="amulet_missing" style="display:none;color:red;">（使用了已失效的护符组名称，请重新绑定）</b>' +
                            '<span style="float:right;margin-right:5px;">加载顺序</span><p /><ul></ul>';
                        amuletCount = genericPopupQuerySelector('#amulet_count');
                        amuletCount.style.color = 'blue';
                        amuletMissing = genericPopupQuerySelector('#amulet_missing');
                        let amuletArray = amuletGroups.toArray().sort((a, b) => a.name < b.name ? -1 : 1);
                        let amuletGroupContainer = amuletContainer.lastChild;
                        for (let i = 0; i < amuletGroupCount; i++) {
                            let li = document.createElement('li');
                            li.className = 'amulet_item';
                            li.setAttribute('original-item', amuletArray[i].name);
                            li.title = amuletArray[i].formatBuffSummary('', '', '\n', false);
                            li.innerHTML =
                                `<a href="###">${amuletArray[i].name} [${amuletArray[i].count()}]</a>` +
                                `<span style="color:#0000c0;width:40;float:right;margin-right:5px;"></span>`;
                            li.onclick = selector_amulet;
                            amuletGroupContainer.appendChild(li);
                        }
                    }
                    else {
                        amuletContainer.innerHTML =
                            '<ul><li>未能读取护符组定义信息，这可能是因为您没有预先完成护符组定义。</li><p />' +
                                '<li>将护符与角色卡片进行绑定并不是必须的，但如果您希望使用此功能，' +
                                    '则必须先定义护符组然后才能将它们与角色卡片进行绑定。</li><p />' +
                                '<li>要定义护符组，您需要前往 [ <b style="color:#0000c0;">卡片装备 → 武器装备</b> ] 页面，' +
                                    '并在其中使用将饰品栏内容 [ <b style="color:#0000c0;">存为护符组</b> ] 功能，' +
                                    '或在 [ <b style="color:#0000c0;">管理护符组</b> ] 相应功能中进行定义。</li></ul>';
                    }

                    bindInfo?.[0].bindings.forEach((item) => {
                        let binding = item.binding.split(BINDING_ELEMENT_SEPARATOR);
                        if (binding.length > 5) {
                            let amuletGroupNames = binding[5].split(',');
                            let ag = '';
                            let sp = '';
                            let al = amuletGroupNames.length;
                            for (let i = 0; i < al; i++) {
                                if (amuletGroups.contains(amuletGroupNames[i])) {
                                    ag += (sp + amuletGroupNames[i]);
                                    sp = ',';
                                }
                            }
                            binding[5] = ag;
                            item.binding = binding.join(BINDING_ELEMENT_SEPARATOR);
                        }

                        let op = document.createElement('li');
                        op.className = 'binding-name';
                        op.innerText = item.name;
                        op.setAttribute('original-item', item.binding);
                        bindingList.appendChild(op);
                    });

                    let timer = setInterval(() => {
                        if (asyncOperations == 0) {
                            clearInterval(timer);
                            httpRequestClearAll();

                            bagCells += parseInt(wishpool?.[0] ?? 0);
                            if (userInfo?.bvip) {
                                bagCells += 2;
                            }
                            if (userInfo?.svip) {
                                bagCells += 5;
                            }
                            if (amuletCount != null) {
                                amuletCount.innerText = '0 / ' + bagCells;
                                amuletCount.style.color = 'blue';
                            }

                            let index = bindingList.children.length - 1;
                            if (index >= 0) {
                                let solutionSelector = document.getElementById(g_bindingListSelectorId);
                                let selectedOption = solutionSelector?.options?.[solutionSelector.selectedIndex];
                                if (selectedOption == null) {
                                    index = -1;
                                }
                                for ( ; index >= 0; index--) {
                                    if (bindingList.children[index].innerText == selectedOption.innerText) {
                                        break;
                                    }
                                }
                                if (index < 0) {
                                    index = 0;
                                }
                                bindingName.value = bindingList.children[index].innerText;
                                representBinding(bindingList.children[index].getAttribute('original-item'));
                            }
                            else {
                                bindingName.value = BINDING_NAME_DEFAULT;
                            }

                            bindingName.oninput = validateBindingName;
                            bindingName.onchange = validateBinding;
                            bindingList.onclick = ((e) => {
                                let li = e.target;
                                if (li.tagName == 'LI') {
                                    bindingName.value = li.innerText;
                                    representBinding(li.getAttribute('original-item'));
                                }
                            });

                            genericPopupQuerySelector('#copy_export_string').onclick = (() => {
                                genericPopupQuerySelector('#role_export_string').select();
                                if (document.execCommand('copy')) {
                                    genericPopupShowInformationTips('导出内容已复制到剪贴板', 5000);
                                }
                                else {
                                    genericPopupShowInformationTips('复制失败，请进行手工复制（CTRL+A, CTRL+C）');
                                }
                            });

                            genericPopupQuerySelector('#hide_export_div').onclick = (() => {
                                genericPopupQuerySelector('#role_export_div').style.display = 'none';
                            });

                            genericPopupSetContentSize(Math.min((haloGroupItemMax + amuletGroupCount) * 20
                                                                                  + (amuletGroupCount > 0 ? 60 : 160)
                                                                                  + 260 + 150,
                                                                Math.max(window.innerHeight - 340, 400)),
                                                       680, true);

                            genericPopupAddButton('解除绑定', 0, deleteBinding, true);
                            genericPopupAddButton('全部解绑', 0, unbindAll, true);
                            genericPopupAddButton('绑定', 80, saveBinding, false);
                            genericPopupAddButton(
                                '导出计算器',
                                0,
                                () => {
                                    let string = generateExportString();
                                    if (string?.length > 0) {
                                        genericPopupQuerySelector('#role_export_string').value = string;
                                        let div = genericPopupQuerySelector('#role_export_div');
                                        div.style.display = 'block';
                                        div.scrollIntoView(true);
                                    }
                                },
                                false);
                            genericPopupAddCloseButton(80);

                            genericPopupCloseProgressMessage();
                            genericPopupShowModal(true);
                        }
                    }, 200);
                }

                async function showCalcConfigGenPopup(roleId) {
                    genericPopupInitialize();
                    genericPopupShowProgressMessage('读取中，请稍候...');

                    let cardInfo = await readCardInfoAsync(roleId, true);
                    let roleTotalPt = Math.trunc((cardInfo.level * 3 + 6) * (1 + cardInfo.quality / 100));

                    const monsters = [
                        {
                            name : '营养均衡的史莱姆',
                            shortMark : 'SLIME',
                            alias : 'SLIME'
                        }
                    ];

                    let fixedContent =
                        '<div style="padding:20px 10px 10px 0px;color:blue;font-size:16px;"><b><ul>' +
                          '<li>初次使用本功能时请先仔细阅读咕咕镇计算器相关资料及此后各部分设置说明以便对其中涉及到的概念及元素建立基本认识</li>' +
                          '<li>此功能只生成指定角色的PVE配置，若需供其他角色使用请在相应角色页面使用此功能或自行正确修改配置</li>' +
                          '<li>此功能只生成计算器可用的基础PVE配置，若需使用计算器提供的其它高级功能请自行正确修改配置</li>' +
                          '<li>此功能并未进行完整的数据合法性检查，并不保证生成的配置100%正确，所以请仔细阅读说明并正确使用各项设置</li>' +
                          `<li id="${g_genericPopupInformationTipsId}" style="color:red;">` +
                              '保存模板可保存当前设置，每次保存均会覆盖前一次保存的设置，保存模板后再次进入此功能时将自动加载最后一次保存的设置</li></ul></b></div>';
                    const mainStyle =
                          '<style> .group-menu { position:relative;' +
                                                'display:inline-block;' +
                                                'color:blue;' +
                                                'font-size:20px;' +
                                                'cursor:pointer; } ' +
                                  '.group-menu-items { display:none;' +
                                                      'position:absolute;' +
                                                      'font-size:15px;' +
                                                      'word-break:keep-all;' +
                                                      'white-space:nowrap;' +
                                                      'margin:0 auto;' +
                                                      'width:fit-content;' +
                                                      'z-index:999;' +
                                                      'background-color:white;' +
                                                      'box-shadow:0px 2px 16px 4px rgba(0, 0, 0, 0.4);' +
                                                      'padding:15px 30px; } ' +
                                  '.group-menu-item { } ' +
                                  '.group-menu:hover .group-menu-items { display:block; } ' +
                                  '.group-menu-items .group-menu-item:hover { background-color:#bbddff; } ' +
                              '.section-help-text { font-size:15px; color:navy; } ' +
                              'b > span { color:purple; } ' +
                              'button.btn-group-selection { width:80px; float:right; } ' +
                              'table.mon-list { width:100%; } ' +
                                  'table.mon-list th.mon-name { width:40%; text-align:left; } ' +
                                  'table.mon-list th.mon-alias { width:15%; text-align:left; } ' +
                                  'table.mon-list th.mon-level { width:15%; text-align:left; } ' +
                                  'table.mon-list th.mon-diff { width:15%; text-align:left; } ' +
                                  'table.mon-list th.mon-batch-count { width:15%; text-align:left; } ' +
                              'table.role-info { width:100%; } ' +
                                  'table.role-info th.role-item { width:30%; text-align:left; } ' +
                                  'table.role-info th.role-points { width:10%; text-align:left; } ' +
                                  'table.role-info th.role-operation { width:10%; text-align:center; } ' +
                              'table.equip-list { width:100%; } ' +
                                  'table.equip-list th.equip-name { width:44%; text-align:left; } ' +
                                  'table.equip-list th.equip-property { width:14%; text-align:left; } ' +
                              'table.misc-config { width:100%; } ' +
                                  'table.misc-config th { width:20%; text-align:center; } ' +
                                  'table.misc-config td { text-align:center; } ' +
                              'table tr.alt { background-color:' + g_genericPopupBackgroundColorAlt + '; } ' +
                          '</style>';
                    const menuItems =
                          '<div class="group-menu-items"><ul>' +
                              '<li class="group-menu-item"><a href="#mon-div">野怪</a></li>' +
                              '<li class="group-menu-item"><a href="#role-div">角色</a></li>' +
                              '<li class="group-menu-item"><a href="#equips1-div">武器装备</a></li>' +
                              '<li class="group-menu-item"><a href="#equips2-div">手臂装备</a></li>' +
                              '<li class="group-menu-item"><a href="#equips3-div">身体装备</a></li>' +
                              '<li class="group-menu-item"><a href="#equips4-div">头部装备</a></li>' +
                              '<li class="group-menu-item"><a href="#halo-div">光环</a></li>' +
                              '<li class="group-menu-item"><a href="#amulet-div">护符</a></li>' +
                              '<li class="group-menu-item"><a href="#misc-div">其它</a></li><hr>' +
                              '<li class="group-menu-item"><a href="#result-div">生成结果</a></li>' +
                          '</ul></div>';
                    const monTable =
                          '<table class="mon-list"><tr class="alt"><th class="mon-name">名称</th><th class="mon-alias">简称</th>' +
                             '<th class="mon-level">基础等级</th><th class="mon-diff">级差</th><th class="mon-batch-count">额外批次数</th>' +
                             '</tr></table>';
                    const roleTable =
                          '<table class="role-info" id="role-info"><tr class="alt"><th class="role-item">设置</th>' +
                             '<th class="role-points">力量</th><th class="role-points">敏捷</th><th class="role-points">智力</th>' +
                             '<th class="role-points">体魄</th><th class="role-points">精神</th><th class="role-points">意志</th>' +
                             '<th class="role-operation">操作</th></tr><tr>' +
                             '<td>属性点下限（须大于0）<span id ="role-points-summary" style="float:right;margin-right:5px;"></span></td>' +
                             '<td><input type="text" style="width:90%;" value="1" oninput="value=value.replace(/[\\D]/g,\'\');" /></td>' +
                             '<td><input type="text" style="width:90%;" value="1" oninput="value=value.replace(/[\\D]/g,\'\');" /></td>' +
                             '<td><input type="text" style="width:90%;" value="1" oninput="value=value.replace(/[\\D]/g,\'\');" /></td>' +
                             '<td><input type="text" style="width:90%;" value="1" oninput="value=value.replace(/[\\D]/g,\'\');" /></td>' +
                             '<td><input type="text" style="width:90%;" value="1" oninput="value=value.replace(/[\\D]/g,\'\');" /></td>' +
                             '<td><input type="text" style="width:90%;" value="1" oninput="value=value.replace(/[\\D]/g,\'\');" /></td>' +
                             '<td><button type="button" class="role-points-text-reset" style="width:100%;" value="1">重置</td></tr><tr class="alt">' +
                             '<td>属性点上限（0为无限制）</td>' +
                             '<td><input type="text" style="width:90%;" value="0" oninput="value=value.replace(/[\\D]/g,\'\');" /></td>' +
                             '<td><input type="text" style="width:90%;" value="0" oninput="value=value.replace(/[\\D]/g,\'\');" /></td>' +
                             '<td><input type="text" style="width:90%;" value="0" oninput="value=value.replace(/[\\D]/g,\'\');" /></td>' +
                             '<td><input type="text" style="width:90%;" value="0" oninput="value=value.replace(/[\\D]/g,\'\');" /></td>' +
                             '<td><input type="text" style="width:90%;" value="0" oninput="value=value.replace(/[\\D]/g,\'\');" /></td>' +
                             '<td><input type="text" style="width:90%;" value="0" oninput="value=value.replace(/[\\D]/g,\'\');" /></td>' +
                             '<td><button type="button" class="role-points-text-reset" style="width:100%;" value="0">重置</td>' +
                             '</tr></table>';
                    const equipTable =
                          '<table class="equip-list"><tr class="alt"><th class="equip-name">装备</th><th class="equip-property">属性</th>' +
                             '<th class="equip-property"></th><th class="equip-property"></th><th class="equip-property"></th></tr></table>';
                    const miscTable =
                          '<table class="misc-config"><tr class="alt">' +
                             '<th>计算线程数</th><th>最大组合数</th><th>单组测试次数</th><th>置信区间测试阈值（%）</th><th>输出计算进度</th></tr><tr>' +
                             '<td><input type="text" style="width:90%;" original-item="THREADS" value="4" oninput="value=value.replace(/[\\D]/g,\'\');" /></td>' +
                             '<td><input type="text" style="width:90%;" original-item="SEEDMAX" value="1000000" oninput="value=value.replace(/[\\D]/g,\'\');" /></td>' +
                             '<td><input type="text" style="width:90%;" original-item="TESTS" value="2000" oninput="value=value.replace(/[\\D]/g,\'\');" /></td>' +
                             '<td><input type="text" style="width:90%;" original-item="CITEST" value="0" oninput="value=value.replace(/[^\\d.]/g,\'\');" /></td>' +
                             '<td><input type="text" style="width:90%;" original-item="VERBOSE" value="1" oninput="value=value.replace(/[\\D]/g,\'\');" /></td></tr></table>';
                    const btnGroup =
                          '<button type="button" class="btn-group-selection" select-type="2">反选</button>' +
                          '<button type="button" class="btn-group-selection" select-type="1">全不选</button>' +
                          '<button type="button" class="btn-group-selection" select-type="0">全选</button>';
                    const mainContent =
                        `${mainStyle}
                         <div class="${g_genericPopupTopLineDivClass}" id="mon-div">
                           <b class="group-menu">野怪设置 （选中 <span>0</span>） ▼${menuItems}</b>${btnGroup}<hr>
                             <span class="section-help-text">` +
                             `只有勾选行的野怪信息才会被写入配置，且这些信息与选定角色相关。简称栏填写您所使用的计算器对特定野怪配置所使用的代称，例如曾经的` +
                             `“MU”、“SHOU”……“HAO2”、“YU2”……及现用的“SHI”、“SLIME”等等，这些信息可能会随着咕咕镇及计算器的升级而不断变化，如果留空则使` +
                             `用默认简称。基础等级为您所欲战胜野怪的最低等级，一般情况下填写当前等级即可。如果您需要考虑野怪等级的动态变化，则可以通过填写级` +
                             `差及额外批次数生成阶梯式野怪数据以对等级变化后的野怪同时进行优化综合胜率计算。请注意，单等级计算的结果可能与阶梯等级计算结果有` +
                             `较大差异，原因是阶梯等级计算会计算最大化综合胜率而不是最大化最低等级胜率，所以您单独计算例如100级野怪时可能会得出100%胜率的结` +
                             `果，而当您加入120级同时计算时可能会得到100级95%而120级75%胜率的结果，因为若按之前算得100级100%胜率的加点方案对120级野怪的` +
                             `胜率可能低于70%或更低，在等级平均分布前提下其综合胜率显然低于95%+75%方案。</span><hr>${monTable}</div>
                         <div class="${g_genericPopupTopLineDivClass}" id="role-div">
                           <b class="group-menu">角色基础设置 （${cardInfo.meta.name}，${cardInfo.level}级，${cardInfo.quality}%品质，` +
                             `${cardInfo.meta.hasG ? `${cardInfo.growth}成长值，` : ''}${roleTotalPt}属性点） ▼${menuItems}` +
                             `</b><hr><span class="section-help-text">` +
                             `属性点下限初始值为指定角色当前点数分配方案，直接使用这些值主要用于胜率验证、装备及光环技能选择等情况，全部置1表示由计算器从` +
                             `头开始计算近似最佳点数分配（该行末的重置按钮将属性点下限全部置1）。也可为各点数设置合理的下限值（必须大于0且总和小于等于总` +
                             `可用属性点数）并由计算器分配剩余点数，这一般用于角色升级后可用点数增加、指定加点方案大致方向并进行装备、光环选择等情况，在` +
                             `其它条件相同的情况下，越少的剩余点数将节约越多的计算时间。属性点上限用于指定特定属性点数分配的上限，设为0表示无限制。合理地` +
                             `设置上限可以节约计算时间，典型的应用场景为将某些明确无需加点的属性上限设为1（例如3速角色的敏捷、血量系的精神等，以及通常情况` +
                             `下梦、默仅敏捷、智力、精神为0，其它皆为1，当然特殊加点除外），而将其它设为0（该行末的重置按钮将属性点上限全部置0）。除非上限` +
                             `值设为0（无限制），否则请务必保证相应的下限值不超过上限值，非法设置将导致计算器运行错误。</span><hr>
                              <input type="checkbox" id="role-useWishpool" checked /><label for="role-useWishpool"
                                     style="margin-left:5px;cursor:pointer;">使用许愿池数据（悬停查看）</label><hr>${roleTable}</div>
                         <div class="${g_genericPopupTopLineDivClass}" id ="equips1-div">
                           <b class="group-menu">武器装备 （选中 <span>0</span>） ▼${menuItems}</b>${btnGroup}<hr>
                             <span class="section-help-text">` +
                             `某类装备中如果只选中其中一件则意味着固定使用此装备；选中多件表示由计算器从选中的装备中选择一件合适（不保证最优）的装备；` +
                             `不选等同于全选，即由计算器在全部同类装备中进行选择。一般原则是尽可能多地固定使用装备，留给计算器的选择越多意味着计算所花` +
                             `的时间将越长（根据其它设置及硬件算力，可能长至数天）。</span><hr>${equipTable}</div>
                         <div class="${g_genericPopupTopLineDivClass}" id="equips2-div">
                           <b class="group-menu">手臂装备 （选中 <span>0</span>） ▼${menuItems}</b>${btnGroup}<p />${equipTable}</div>
                         <div class="${g_genericPopupTopLineDivClass}" id="equips3-div">
                           <b class="group-menu">身体装备 （选中 <span>0</span>） ▼${menuItems}</b>${btnGroup}<p />${equipTable}</div>
                         <div class="${g_genericPopupTopLineDivClass}" id="equips4-div">
                           <b class="group-menu">头部装备 （选中 <span>0</span>） ▼${menuItems}</b>${btnGroup}<p />${equipTable}</div>
                         <div class="${g_genericPopupTopLineDivClass}" id="halo-div">
                           <b class="group-menu">光环技能 ▼${menuItems}</b><hr><span class="section-help-text">` +
                             `在“选用的光环技能”栏选择基本可以确定使用的的光环技能（例如血量重剑系几乎肯定会带沸血之志而护盾法系及某些反伤系带波澜不惊` +
                             `的可能性非常大），如果设置正确（光环点数未超范围）则计算器只需补齐空闲的技能位，所以这里指定的光环越多则计算所需时间越少。` +
                             `排除的光环用于指定几乎不可能出现在计算结果中的光环（例如护盾系可以排除沸血之志而法系基本可排除破壁之心，在技能位不足的情` +
                             `况下启程系列可以考虑全部排除），计算器在寻找优势方案时不会使用这些光环技能进行尝试，所以在有空闲技能位和光环点数充足的情况` +
                             `下，排除的光环技能越多则所需计算时间越少。选用与排除的技能允许重复，如果发生这种情况将强制选用。</span><hr>
                              <div style="width:100%;font-size:15px;"><div id="halo_selector"></div></div></div>
                         <div class="${g_genericPopupTopLineDivClass}" id ="amulet-div">
                           <b class="group-menu">护符 ▼${menuItems}</b><hr><span class="section-help-text">` +
                             `护符配置可以省略，或由当前饰品栏内容决定，如果有预先定义的护符组也可以使用护符组的组合。使用第二及第三种方式时需考虑饰品栏容` +
                             `量（包括许愿池及VIP权益对饰品栏的加成）。</span><hr><div style="font-size:15px;">
                              <input type="radio" class="amulet-config" name="amulet-config" id="amulet-config-none" />
                                  <label for="amulet-config-none" style="cursor:pointer;margin-left:5px;">无</label><br>
                              <input type="radio" class="amulet-config" name="amulet-config" id="amulet-config-bag" checked />
                                  <label for="amulet-config-bag" style="cursor:pointer;margin-left:5px;">当前饰品栏内容（悬停查看）</label><br>
                              <input type="radio" class="amulet-config" name="amulet-config" id="amulet-config-groups" />
                                  <label for="amulet-config-groups" style="cursor:pointer;margin-left:5px;">护符组（在组名称上悬停查看）</label>
                              <div id="amulet_selector" style="display:block;padding:0px 20px 0px 20px;"></div></div></div>
                         <div class="${g_genericPopupTopLineDivClass}" id ="misc-div">
                           <b class="group-menu">其它 ▼${menuItems}</b><hr><span class="section-help-text">` +
                             `除非清楚修改以下配置项将会造成的影响，否则如无特殊需求请保持其默认值。</span><ul class="section-help-text">` +
                             `<li>计算线程数：计算所允许使用的最大线程数，较大的值可以提高并行度从而减少计算用时，但超出处理器物理限制将适得其反，` +
                                 `合理的值应小于处理器支持的物理线程数（推荐值：处理器物理线程数-1或-2）</li>` +
                             `<li>最大组合数：如果给定配置所产生的组合数超过此值将会造成精度下降，但过大的值可能会造成内存不足，且过大的组合数需求` +
                                 `通常意味着待定项目过多，计算将异常耗时，请尝试多固定一些装备及光环技能项，多排除一些无用的光环技能项</li>` +
                             `<li>单组测试次数：特定的点数分配、装备、光环等组合与目标战斗过程的模拟次数，较高的值一般会产生可信度较高的结果，但会` +
                                 `消耗较长的计算时间（此设置仅在置信区间测试阈值设为0时生效）</li>` +
                             `<li>置信区间测试阈值：不使用固定的测试次数而以置信区间阈值代替，可有小数部分。当测试结果的置信区间达到此值时计算终止，` +
                                 `此设置生效（不为0）时单组测试次数设置将被忽略</li>` +
                             `<li>输出计算进度：1为计算过程中在命令行窗口中显示计算时间、进度等信息，0为无显示</li></ul><hr>${miscTable}<hr>
                              <span class="section-help-text">` +
                             `不同类型的计算器可能需要额外的设置信息，例如支持CUDA显卡运算的计算器需要对CUDA环境进行设置。在下面的文本框中按照特定` +
                             `计算器的要求填写其差异化设置，配置生成程序不会对这些内容进行任何特殊处理而仅仅将其插入到生成内容中。请注意，使用了这类` +
                             `特殊设置的配置文件只能应用于与之对应的计算器，应用于其它不同的计算器可能会因为无法识别或不支持的设置而运行失败。具体设` +
                             `置内容及格式等信息请参阅特定计算器程序说明。</span><hr><div style="height:100px;">
                              <textarea id="extra-settings" style="height:100%;width:100%;resize:none;"></textarea></div></div>
                         <div class="${g_genericPopupTopLineDivClass}" id="result-div">
                           <b class="group-menu">生成配置 ▼${menuItems}</b><hr><span class="section-help-text">` +
                             `生成配置文本后一种方式是将其内容复制至计算器目录中的“newkf.in”文件替换其内容并保存（使用文本编辑器），然后运行计算器` +
                             `执行文件（32位系统：newkf.bat或newkf.exe，64位系统：newkf_64.bat或newkf_64.exe）在其中输入anpc（小写）命令并` +
                             `回车然后等待计算完成。另一种使用方式是将生成的配置文本另存为一个ansi编码（重要）的文本文件，名称自定，然后将此文件用` +
                             `鼠标拖放至前述的计算器执行文件上，待程序启动后同样使用anpc命令开始计算。</span><hr><div style="height:200px;">
                              <textarea id="export-result" style="height:100%;width:100%;resize:none;"></textarea></div>
                           <div style="padding:10px 0px 20px 0px;">
                              <button type="button" style="float:right;" id="copy-to-clipboard">复制导出内容至剪贴板</button>
                              <button type="button" style="float:right;" id="save-template-do-export">保存模板并生成配置</button>
                              <button type="button" style="float:right;" id="do-export">生成配置</button></div></div>`;

                    genericPopupSetFixedContent(fixedContent);
                    genericPopupSetContent('咕咕镇计算器配置生成（PVE）', mainContent);

                    genericPopupQuerySelectorAll('.group-menu-item')?.forEach((mi) => {
                        mi.onclick = ((e) => { e.currentTarget?.firstElementChild?.click(); });
                    });

                    genericPopupQuerySelectorAll('button.btn-group-selection').forEach((btn) => { btn.onclick = batchSelection; });
                    function batchSelection(e) {
                        let selType = parseInt(e.target.getAttribute('select-type'));
                        let selCount = 0;
                        e.target.parentElement.querySelectorAll('input.generic-checkbox').forEach((chk) => {
                            if (chk.checked = (selType == 2 ? !chk.checked : selType == 0)) {
                                selCount++;
                            }
                        });
                        e.target.parentElement.firstElementChild.firstElementChild.innerText = selCount;
                    }

                    function countGenericCheckbox(div) {
                        let selsum = 0;
                        genericPopupQuerySelectorAll(`${div} input.generic-checkbox`).forEach((e) => {
                            if (e.checked) {
                                selsum++;
                            }
                        });
                        genericPopupQuerySelector(`${div} b span`).innerText = selsum;
                    }

                    let asyncOperations = 4;
                    let equipItemCount = 0;
                    let bag = [];
                    let store = [];
                    beginReadObjects(
                        bag,
                        store,
                        async () => {
                            let equipment = equipmentNodesToArray(store);
                            let cr = await readCurrentRoleAsync(true);
                            if (cr != null) {
                                equipmentNodesToArray(cr.equips, equipment);
                            }

                            let eqIndex = 0;
                            let eq_selectors = genericPopupQuerySelectorAll('table.equip-list');
                            equipment.sort((a, b) => a.compareTo(b)).forEach((item) => {
                                let lv = item.getQualityLevel();
                                let tr = document.createElement('tr');
                                tr.style.backgroundColor = g_equipmentLevelBGColor[lv];
                                tr.innerHTML =
                                    `<td><input type="checkbox" class="generic-checkbox equip-checkbox equip-item" id="equip-${++eqIndex}"
                                                original-item="${item.formatExportText()}" />
                                         <label for="equip-${eqIndex}" style="margin-left:5px;cursor:pointer;">
                                                ${item.meta.alias} - Lv.${item.level} （${item.getQuality()}%） ` +
                                               `${item.myst ? ' - [ 神秘 ]' : ''}</label></td>
                                     <td>${item.formatEquipAttrText('</td><td>')}</td>`;
                                tr.title = `${item.pAttributes.join('% - ')}%`;
                                eq_selectors[item.meta.type].appendChild(tr);
                            });
                            equipItemCount = equipment.length;

                            let bagGroup = amuletCreateGroupFromArray('temp', amuletNodesToArray(bag));
                            if (bagGroup?.isValid()) {
                                let radio = genericPopupQuerySelector('#amulet-config-bag');
                                radio.setAttribute('original-item', `AMULET ${bagGroup.formatBuffShortMark(' ', ' ', false)} ENDAMULET`);
                                radio.nextElementSibling.title = radio.title = bagGroup.formatBuffSummary('', '', '\n', false);
                            }
                            asyncOperations--;
                        },
                        null);

                    const highlightBackgroundColor = '#80c0f0';
                    let haloMax = 0;
                    let haloPoints = null;
                    let haloSlots = null;
                    let haloErrors = null;
                    let currentHalo;
                    beginReadHaloInfo(
                        currentHalo = {},
                        () => {
                            haloMax = currentHalo.points;
                            let haloInfo =
                                `天赋点：<span style="color:#0000c0;"><span id="halo_points">0</span> / ${haloMax}</span>，` +
                                `技能位：<span style="color:#0000c0;"><span id="halo_slots">0</span> / ${cardInfo.haloSlots}</span>` +
                                `<b id="halo_errors" style="display:none;color:red;margin-left:15px;">（光环天赋点数 / 角色卡片技能位不足）</b>`;
                            let haloSelector = genericPopupQuerySelector('#halo_selector');
                            haloSelector.innerHTML =
                                `<style>
                                    .halo_group { display:block; width:20%; float:left; text-align:center; border-left:1px solid grey; }
                                    .halo_group_exclude { display:block; width:20%; float:left; text-align:center; border-left:1px solid grey; }
                                     div > a { display:inline-block; width:90%; } </style>
                                 <b style="margin-right:15px;">选用的光环技能：</b>${haloInfo}
                                 <p />
                                 <div style="display:table;">
                                 <div class="halo_group"></div>
                                 <div class="halo_group"></div>
                                 <div class="halo_group"></div>
                                 <div class="halo_group"></div>
                                 <div class="halo_group" style="border-right:1px solid grey;"></div></div>
                                 <div style="display:table;width:100%;margin-top:15px;padding-top:10px;border-top:1px solid lightgrey;">
                                   <b>排除的光环技能：</b>
                                   <p />
                                 </div>
                                 <div style="display:table;">
                                 <div class="halo_group_exclude"></div>
                                 <div class="halo_group_exclude"></div>
                                 <div class="halo_group_exclude"></div>
                                 <div class="halo_group_exclude"></div>
                                 <div class="halo_group_exclude" style="border-right:1px solid grey;"></div></div>`;
                            let haloGroups = haloSelector.querySelectorAll('.halo_group');
                            let haloExGroups = haloSelector.querySelectorAll('.halo_group_exclude');
                            let group = -1;
                            let points = -1;
                            g_halos.forEach((item) => {
                                if (item.points != points) {
                                    points = item.points;
                                    group++;
                                }
                                let a = document.createElement('a');
                                a.href = '###';
                                a.className = 'halo_item';
                                a.innerText = item.name + ' ' + item.points;
                                a.title = item.description;
                                haloGroups[group].appendChild(a.cloneNode(true));
                                a.className = 'halo_item_exclude';
                                haloExGroups[group].appendChild(a);
                            });

                            function selector_halo() {
                                let hp = parseInt(haloPoints.innerText);
                                let hs = parseInt(haloSlots.innerText);
                                if ($(this).attr('item-selected') != 1) {
                                    $(this).attr('item-selected', 1);
                                    $(this).css('background-color', highlightBackgroundColor);
                                    hp += parseInt($(this).text().split(' ')[1]);
                                    hs++;
                                }
                                else {
                                    $(this).attr('item-selected', 0);
                                    $(this).css('background-color', g_genericPopupBackgroundColor);
                                    hp -= parseInt($(this).text().split(' ')[1]);
                                    hs--;
                                }
                                haloPoints.innerText = hp;
                                haloSlots.innerText = hs;
                                haloPoints.style.color = (hp <= haloMax ? '#0000c0' : 'red');
                                haloSlots.style.color = (hs <= cardInfo.haloSlots ? '#0000c0' : 'red');
                                haloErrors.style.display = (hp <= haloMax && hs <= cardInfo.haloSlots ? 'none' : 'inline-block');
                            }

                            haloPoints = genericPopupQuerySelector('#halo_points');
                            haloSlots = genericPopupQuerySelector('#halo_slots');
                            haloErrors = genericPopupQuerySelector('#halo_errors');
                            $('.halo_item').each(function(i, e) {
                                $(e).on('click', selector_halo);
                                $(e).attr('original-item', $(e).text().split(' ')[0]);
                            });

                            function selector_halo_exclude() {
                                if ($(this).attr('item-selected') != 1) {
                                    $(this).attr('item-selected', 1);
                                    $(this).css('background-color', highlightBackgroundColor);
                                }
                                else {
                                    $(this).attr('item-selected', 0);
                                    $(this).css('background-color', g_genericPopupBackgroundColor);
                                }
                            }

                            $('.halo_item_exclude').each(function(i, e) {
                                $(e).on('click', selector_halo_exclude);
                                $(e).attr('original-item', $(e).text().split(' ')[0]);
                            });
                            asyncOperations--;
                        },
                        null);

                    let useWishpool = genericPopupQuerySelector('#role-useWishpool');
                    if (wishpool?.length > 0) {
                        useWishpool.title = useWishpool.nextElementSibling.title = 'WISH ' + wishpool.slice(-g_wishpoolLength).join(' ');
                        asyncOperations--;
                    }
                    else {
                        beginReadWishpool(
                            wishpool,
                            null,
                            () => {
                                useWishpool.title = useWishpool.nextElementSibling.title = 'WISH ' + wishpool.slice(-g_wishpoolLength).join(' ');
                                asyncOperations--; },
                            null);
                    }
                    if (userInfo?.isUserInfo) {
                        asyncOperations--;
                    }
                    else {
                        beginReadUserInfo(userInfo, () => { asyncOperations--; });
                    }

                    let mon_selector = genericPopupQuerySelector('table.mon-list');
                    monsters.forEach((e, i) => {
                        let tr = document.createElement('tr');
                        tr.className = 'mon-row' + ((i & 1) == 0 ? '' : ' alt');
                        tr.setAttribute('original-item', e.shortMark);
                        tr.title = e.name;
                        tr.innerHTML =
                            `<td><input type="checkbox" class="generic-checkbox mon-checkbox mon-item"
                                        id="mon-item-${i}"${i == 0 ? ' checked' : ''} />
                                 <label for="mon-item-${i}" style="margin-left:5px;cursor:pointer;">${e.name}</label></td>
                             <td><input type="text" class="mon-textbox" style="width:80%;" maxlength="32" value="${e.alias}"
                                        oninput="value=value.replace(/[\\s]/g,'');" /></td>
                             <td><input type="text" class="mon-textbox" style="width:80%;" value="0"
                                        oninput="value=value.replace(/[\\D]/g,'');" /></td>
                             <td><input type="text" class="mon-textbox" style="width:80%;" value="0"
                                        oninput="value=value.replace(/[\\D]/g,'');" /></td>
                             <td><input type="text" class="mon-textbox" style="width:80%;" value="0"
                                        oninput="value=value.replace(/[\\D]/g,'');" /></td>`;
                        mon_selector.appendChild(tr);
                    });
                    countGenericCheckbox('#mon-div');

                    let roleInfo = genericPopupQuerySelector('#role-info');
                    let rolePtsSum = roleInfo.querySelector('#role-points-summary');
                    let textPts = roleInfo.querySelectorAll('input[type="text"]');
                    for (let i = 0; i < 6; i++) {
                        textPts[i].value = cardInfo.points[i];
                        textPts[i].onchange = rolePtsChanged;
                    }
                    rolePtsChanged();
                    function rolePtsChanged() {
                        let ptsSum = 0;
                        for (let i = 0; i < 6; i++) {
                            let pt = parseInt(textPts[i].value);
                            if (isNaN(pt) || pt < 1) {
                                textPts[i].value = '1';
                                pt = 1;
                            }
                            ptsSum += pt;
                        }
                        rolePtsSum.innerText = `（${ptsSum} / ${roleTotalPt}）`;
                        rolePtsSum.style.color = (ptsSum > roleTotalPt ? 'red' : 'blue');
                    }
                    roleInfo.querySelectorAll('button.role-points-text-reset').forEach((item) => {
                        item.onclick = ((e) => {
                            e.target.parentElement.parentElement.querySelectorAll('input[type="text"]').forEach((item) => {
                                item.value = e.target.value;
                            });
                            if (e.target.value == '1') {
                                rolePtsChanged;
                            }
                        });
                    });

                    let amuletRadioGroup = genericPopupQuerySelectorAll('#amulet-div input.amulet-config');
                    let bagCells = 8;
                    let amuletContainer = genericPopupQuerySelector('#amulet_selector');
                    amuletContainer.innerHTML = '护符组：已选定 <span id="amulet_count">0 / 0</span> 个护符<p /><ul></ul>';
                    let amuletCount = genericPopupQuerySelector('#amulet_count');
                    amuletCount.style.color = 'blue';
                    let amuletGroups = amuletLoadGroups();
                    let amuletGroupCount = (amuletGroups?.count() ?? 0);
                    if (amuletGroupCount > 0) {
                        let amuletArray = amuletGroups.toArray().sort((a, b) => a.name < b.name ? -1 : 1);
                        let amuletGroupContainer = amuletContainer.lastChild;
                        for (let i = 0; i < amuletGroupCount; i++) {
                            let li = document.createElement('li');
                            li.className = 'amulet_item';
                            li.setAttribute('original-item', amuletArray[i].name);
                            li.title = amuletArray[i].formatBuffSummary('', '', '\n', false);
                            li.innerHTML = `<a href="###">${amuletArray[i].name} [${amuletArray[i].count()}]</a>`;
                            li.onclick = selector_amulet;
                            amuletGroupContainer.appendChild(li);
                        }
                    }
                    function selector_amulet() {
                        if (!amuletRadioGroup[2].checked) {
                            amuletRadioGroup[0].checked = false;
                            amuletRadioGroup[1].checked = false;
                            amuletRadioGroup[2].checked = true;
                        }
                        let ac = parseInt(amuletCount.innerText);
                        let tc = parseInt($(this).text().match(/\[(\d+)\]/)[1]);
                        if ($(this).attr('item-selected') != 1) {
                            $(this).attr('item-selected', 1);
                            $(this).css('background-color', highlightBackgroundColor);
                            ac += tc;
                        }
                        else {
                            $(this).attr('item-selected', 0);
                            $(this).css('background-color', g_genericPopupBackgroundColor);
                            ac -= tc;
                        }
                        amuletCount.innerText = ac + ' / ' + bagCells;
                        amuletCount.style.color = (ac <= bagCells ? 'blue' : 'red');
                    }

                    function generateTemplate() {
                        let template = {
                            monster : {},
                            role : { useWishpool : true , points : [] },
                            equipment : { selected : [] },
                            halo : { selected : [] , excluded : [] },
                            amulet : { selected : -1 , selectedGroups : [] },
                            miscellaneous : {}
                        };
                        mon_selector.querySelectorAll('.mon-row').forEach((tr) => {
                            let col = tr.children;
                            template.monster[tr.getAttribute('original-item')] = {
                                selected : col[0].firstElementChild.checked,
                                alias : col[1].firstElementChild.value,
                                level : col[2].firstElementChild.value,
                                diff : col[3].firstElementChild.value,
                                batch : col[4].firstElementChild.value
                            };
                        });

                        template.role.useWishpool = useWishpool.checked;
                        genericPopupQuerySelectorAll('#role-info input').forEach((e, i) => {
                            template.role.points.push(e.value);
                        });

                        genericPopupQuerySelectorAll('table.equip-list input.equip-checkbox.equip-item').forEach((e) => {
                            if (e.checked) {
                                template.equipment.selected.push(e.getAttribute('original-item'));
                            }
                        });

                        genericPopupQuerySelectorAll('#halo_selector a.halo_item').forEach((e) => {
                            if (e.getAttribute('item-selected') == 1) {
                                template.halo.selected.push(e.getAttribute('original-item'));
                            }
                        });
                        genericPopupQuerySelectorAll('#halo_selector a.halo_item_exclude').forEach((e) => {
                            if (e.getAttribute('item-selected') == 1) {
                                template.halo.excluded.push(e.getAttribute('original-item'));
                            }
                        });

                        let amchk = genericPopupQuerySelectorAll('#amulet-div input.amulet-config');
                        for (var amStyle = amchk.length - 1; amStyle >= 0 && !amchk[amStyle].checked; amStyle--);
                        template.amulet.selected = amStyle;
                        genericPopupQuerySelectorAll('#amulet_selector .amulet_item').forEach((e) => {
                            if (e.getAttribute('item-selected') == 1) {
                                template.amulet.selectedGroups.push(e.getAttribute('original-item'));
                            }
                        });

                        genericPopupQuerySelectorAll('#misc-div table.misc-config input').forEach((e) => {
                            template.miscellaneous[e.getAttribute('original-item')] = e.value;
                        });
                        template.miscellaneous.extraSettings = genericPopupQuerySelector('#extra-settings').value;

                        return template;
                    }

                    function applyTemplate(template) {
                        mon_selector.querySelectorAll('.mon-row').forEach((tr) => {
                            let shortMark = tr.getAttribute('original-item');
                            let mon = template.monster[shortMark];
                            if (mon != null) {
                                let col = tr.children;
                                col[0].firstElementChild.checked = mon.selected;
                                col[1].firstElementChild.value = mon.alias?.length > 0 ? mon.alias : shortMark;
                                col[2].firstElementChild.value = mon.level;
                                col[3].firstElementChild.value = mon.diff;
                                col[4].firstElementChild.value = mon.batch;
                            }
                        });
                        countGenericCheckbox('#mon-div');

                        useWishpool.checked = template.role.useWishpool;
                        genericPopupQuerySelectorAll('#role-info input').forEach((e, i) => {
                            e.value = template.role.points[i];
                        });
                        rolePtsChanged();

                        let eqs = template.equipment.selected.slice();
                        genericPopupQuerySelectorAll('table.equip-list input.equip-checkbox.equip-item').forEach((e) => {
                            let i = eqs.indexOf(e.getAttribute('original-item'));
                            if (e.checked = (i >= 0)) {
                                eqs.splice(i, 1);
                            }
                        });
                        countGenericCheckbox('#equips1-div');
                        countGenericCheckbox('#equips2-div');
                        countGenericCheckbox('#equips3-div');
                        countGenericCheckbox('#equips4-div');

                        let hp = 0;
                        let hs = 0;
                        genericPopupQuerySelectorAll('#halo_selector a.halo_item').forEach((e) => {
                            if (template.halo.selected.indexOf(e.getAttribute('original-item')) >= 0) {
                                e.setAttribute('item-selected', 1);
                                e.style.backgroundColor = highlightBackgroundColor;
                                hp += parseInt(e.innerText.split(' ')[1]);
                                hs++;
                            }
                            else {
                                e.setAttribute('item-selected', 0);
                                e.style.backgroundColor = g_genericPopupBackgroundColor;
                            }
                        });
                        haloPoints.innerText = hp;
                        haloSlots.innerText = hs;
                        haloPoints.style.color = (hp <= haloMax ? '#0000c0' : 'red');
                        haloSlots.style.color = (hs <= cardInfo.haloSlots ? '#0000c0' : 'red');

                        genericPopupQuerySelectorAll('#halo_selector a.halo_item_exclude').forEach((e) => {
                            if (template.halo.excluded.indexOf(e.getAttribute('original-item')) >= 0) {
                                e.setAttribute('item-selected', 1);
                                e.style.backgroundColor = highlightBackgroundColor;
                            }
                            else {
                                e.setAttribute('item-selected', 0);
                                e.style.backgroundColor = g_genericPopupBackgroundColor;
                            }
                        });

                        genericPopupQuerySelectorAll('#amulet-div input.amulet-config').forEach((e, i) => {
                            e.checked = (template.amulet.selected == i);
                        });
                        let ac = 0;
                        genericPopupQuerySelectorAll('#amulet_selector .amulet_item').forEach((e) => {
                            if (template.amulet.selectedGroups.indexOf(e.getAttribute('original-item')) >= 0) {
                                e.setAttribute('item-selected', 1);
                                e.style.backgroundColor = highlightBackgroundColor;
                                ac += parseInt(e.innerHTML.match(/\[(\d+)\]/)[1]);
                            }
                            else {
                                e.setAttribute('item-selected', 0);
                                e.style.backgroundColor = g_genericPopupBackgroundColor;
                            }
                        });
                        amuletCount.innerText = ac + ' / ' + bagCells;
                        amuletCount.style.color = (ac <= bagCells ? 'blue' : 'red');

                        genericPopupQuerySelectorAll('#misc-div table.misc-config input').forEach((e) => {
                            e.value = template.miscellaneous[e.getAttribute('original-item')];
                        });
                        genericPopupQuerySelector('#extra-settings').value = template.miscellaneous.extraSettings;
                    }

                    function collectConfigData() {
                        let cfg = [ haloMax,
                                    '',
                                    `${cardInfo.meta.shortMark}${cardInfo.meta.hasG ? ' G=' + cardInfo.growth : ''} ` +
                                    `${cardInfo.level} ${userInfo.level} ${cardInfo.haloSlots} ${cardInfo.quality}` ];
                        if (useWishpool.checked) {
                            cfg.push(useWishpool.title);
                        }

                        let amchk = genericPopupQuerySelectorAll('#amulet-div input.amulet-config');
                        if (amchk[1].checked) {
                            let am = amchk[1].getAttribute('original-item');
                            if (am?.length > 0) {
                                cfg.push(am);
                            }
                        }
                        else if (amchk[2].checked) {
                            let ag = new AmuletGroup();
                            ag.name = 'temp';
                            $('.amulet_item').each(function(i, e) {
                                if ($(e).attr('item-selected') == 1) {
                                    ag.merge(amuletGroups.get($(e).attr('original-item')));
                                }
                            });
                            if (ag.isValid()) {
                                cfg.push(`AMULET ${ag.formatBuffShortMark(' ', ' ', false)} ENDAMULET`);
                            }
                        }

                        let pts = [];
                        let ptsMax = [ 'MAXATTR' ];
                        genericPopupQuerySelectorAll('#role-info input').forEach((e, i) => {
                            (i < 6 ? pts : ptsMax).push(e.value);
                        });
                        cfg.push(pts.join(' '));

                        let eq = [ [], [], [], [] ];
                        genericPopupQuerySelectorAll('table.equip-list').forEach((t, ti) => {
                            let equ = t.querySelectorAll('input.equip-checkbox.equip-item');
                            let equnsel = [];
                            equ.forEach((e) => {
                                let eqstr = e.getAttribute('original-item');
                                if (e.checked) {
                                    eq[ti].push(eqstr);
                                }
                                else if (eq[ti].length == 0) {
                                    equnsel.push(eqstr);
                                }
                            });
                            if (eq[ti].length == 0) {
                                eq[ti] = equnsel;
                            }
                        });
                        let eqsel = [];
                        eq.forEach((e) => {
                            if (e.length == 1) {
                                cfg.push(e[0]);
                            }
                            else {
                                cfg.push('NONE');
                                eqsel.push(e);
                            }
                        });

                        let halos = [];
                        $('.halo_item').each(function(i, e) {
                            if ($(e).attr('item-selected') == 1) {
                                let h = g_haloMap.get($(e).attr('original-item'));
                                halos.push(h.exportAlias ?? h.shortMark);
                            }
                        });
                        cfg.push(halos.length > 0 ? halos.length + ' ' + halos.join(' ') : '0');
                        cfg.push('');

                        if (eqsel.length > 0) {
                            cfg.push('GEAR\n    ' + eqsel.flat().join('\n    ') + '\nENDGEAR');
                            cfg.push('');
                        }

                        let mon = [];
                        mon_selector.querySelectorAll('input.mon-checkbox.mon-item').forEach((e) => {
                            if (e.checked) {
                                let tr = e.parentElement.parentElement;
                                let col = tr.children;
                                let alias = col[1].firstElementChild.value?.trim();
                                mon.push({
                                    alias : alias?.length > 0 ? alias : tr.getAttribute('original-item'),
                                    level : parseInt(col[2].firstElementChild.value),
                                    diff : parseInt(col[3].firstElementChild.value),
                                    batch : parseInt(col[4].firstElementChild.value)
                                });
                            }
                        });
                        if (mon.length > 0) {
                            cfg.push('NPC');
                            const sp = '        ';
                            mon.forEach((m, index) => {
                                let batch = (m.diff != 0 && m.batch > 0 ? m.batch : 0);
                                for (let i = 0; i <= batch; i++) {
                                    cfg.push('    ' + (m.alias + sp).substring(0, 8) +
                                             ((m.level + (i * m.diff)).toString() + sp).substring(0, 8) + '0');
                                }
                                if (index != mon.length - 1) {
                                    cfg.push('');
                                }
                            });
                            cfg.push('ENDNPC');
                            cfg.push('');
                        }

                        genericPopupQuerySelectorAll('#misc-div table.misc-config input').forEach((e) => {
                            cfg.push(e.getAttribute('original-item') + ' ' + e.value);
                        });
                        cfg.push('REDUCERATE 3 10');
                        cfg.push('PCWEIGHT 1 1');
                        cfg.push('DEFENDER 0');
                        cfg.push('');
                        let extra = (genericPopupQuerySelector('#extra-settings').value ?? '').trim();
                        if (extra.length > 0) {
                            cfg.push(extra);
                            cfg.push('');
                        }

                        cfg.push(ptsMax.join(' '));
                        halos = [];
                        $('.halo_item_exclude').each(function(i, e) {
                            if ($(e).attr('item-selected') == 1) {
                                let h = g_haloMap.get($(e).attr('original-item'));
                                halos.push(h.exportAlias ?? h.shortMark);
                            }
                        });
                        if (halos.length > 0) {
                            cfg.push('AURAFILTER ' + halos.join('_'));
                        }

                        return cfg;
                    }

                    let timer = setInterval(() => {
                        if (asyncOperations == 0) {
                            clearInterval(timer);
                            httpRequestClearAll();

                            bagCells += parseInt(wishpool?.[0] ?? 0);
                            if (userInfo?.bvip) {
                                bagCells += 2;
                            }
                            if (userInfo?.svip) {
                                bagCells += 5;
                            }
                            amuletCount.innerText = '0 / ' + bagCells;
                            amuletCount.style.color = 'blue';

                            let udata = loadUserConfigData();
                            let template = udata.calculatorTemplatePVE?.[cardInfo.meta.id];

                            function loadTemplate(hideTips) {
                                if (template != null) {
                                    applyTemplate(template);

                                    btnLoadTemplate.disabled = '';
                                    btnDeleteTemplate.disabled = '';
                                }
                                else {
                                    btnLoadTemplate.disabled = 'disabled';
                                    btnDeleteTemplate.disabled = 'disabled';
                                }
                                if (hideTips != true) {
                                    genericPopupShowInformationTips(template != null ? '模板已加载' : '模板加载失败');
                                }
                            }

                            function saveTemplate() {
                                udata.calculatorTemplatePVE ??= {};
                                udata.calculatorTemplatePVE[cardInfo.meta.id] = template = generateTemplate();
                                saveUserConfigData(udata);

                                btnLoadTemplate.disabled = '';
                                btnDeleteTemplate.disabled = '';
                                genericPopupShowInformationTips('模板已保存');
                            }

                            function deleteTemplate() {
                                delete udata.calculatorTemplatePVE[cardInfo.meta.id];
                                saveUserConfigData(udata);

                                template = null;
                                btnLoadTemplate.disabled = 'disabled';
                                btnDeleteTemplate.disabled = 'disabled';
                                genericPopupShowInformationTips('模板已删除');
                            }

                            genericPopupQuerySelectorAll('input.generic-checkbox').forEach((e) => { e.onchange = genericCheckboxStateChange; });
                            function genericCheckboxStateChange(e) {
                                let countSpan = e.target.parentElement.parentElement.parentElement.parentElement.firstElementChild.firstElementChild;
                                countSpan.innerText = parseInt(countSpan.innerText) + (e.target.checked ? 1 : -1);
                            }

                            genericPopupQuerySelector('#copy-to-clipboard').onclick = (() => {
                                genericPopupQuerySelector('#export-result').select();
                                if (document.execCommand('copy')) {
                                    genericPopupShowInformationTips('导出内容已复制到剪贴板');
                                }
                                else {
                                    genericPopupShowInformationTips('复制失败，请进行手工复制（CTRL+A, CTRL+C）');
                                }
                            });

                            genericPopupQuerySelector('#do-export').onclick =
                                genericPopupQuerySelector('#save-template-do-export').onclick = (
                                (e) => {
                                    let textbox = genericPopupQuerySelector('#export-result');
                                    textbox.value = '';
                                    let string = collectConfigData().join('\n') + '\n';
                                    if (string?.length > 0) {
                                        textbox.value = string;
                                        if (e.target.id.startsWith('save-template')) {
                                            saveTemplate();
                                        }
                                    }
                                });

                            genericPopupSetContentSize(Math.min(4000, Math.max(window.innerHeight - 400, 400)),
                                                       Math.min(1000, Math.max(window.innerWidth - 200, 600)),
                                                       true);

                            genericPopupAddButton('保存模板', 0, saveTemplate, true);
                            let btnLoadTemplate = genericPopupAddButton('加载模板', 0, loadTemplate, true);
                            let btnDeleteTemplate = genericPopupAddButton('删除模板', 0, deleteTemplate, true);
                            genericPopupAddCloseButton(80);

                            loadTemplate(true);

                            genericPopupCloseProgressMessage();
                            genericPopupShowModal(true);
                        }
                    }, 200);
                }

                function refreshBindingSelector(roleId) {
                    let bindingsolutionDiv = document.getElementById(g_bindingSolutionId);
                    let bindingList = document.getElementById(g_bindingListSelectorId);

                    bindingList.innerHTML = '';

                    let udata = loadUserConfigData();
                    let defaultSolution = false;
                    let bindInfo = readBindingSolutionList(roleId);
                    if (bindInfo?.length == 1) {
                        bindInfo[0].bindings.forEach((item) => {
                            let op = document.createElement('option');
                            op.value = `${bindInfo[0].role.name}${SOLUTION_NAME_SEPARATOR}${item.name}`;
                            op.innerText = item.name;
                            bindingList.appendChild(op);
                            if (udata.dataBindDefault[roleId] == item.name) {
                                bindingList.value = op.value;
                                defaultSolution = true;
                            }
                        });
                        bindingsolutionDiv.style.display = 'inline-block';
                    }
                    else {
                        bindingsolutionDiv.style.display = 'none';
                    }

                    if (!defaultSolution && udata.dataBindDefault[roleId] != null) {
                        delete udata.dataBindDefault[roleId];
                        saveUserConfigData(udata);
                    }
                }

                function addRoleOperationBtn(roleId) {
                    function toolsLinks(e) {
                        if (e.target.id == g_genCalcCfgPopupLinkId) {
                            showCalcConfigGenPopup(roleId);
                        }
                        else if (e.target.id == g_bindingPopupLinkId) {
                            showBindingPopup(roleId);
                        }
                        else if (e.target.id == g_equipOnekeyLinkId) {
                            equipOnekey();
                        }
                    }

                    let bindingAnchor = backpacksDiv.querySelector('div.row > div.col-md-12').parentElement.nextSibling;
                    let toolsContainer = document.createElement('div');
                    toolsContainer.className = 'btn-group';
                    toolsContainer.style.display = 'block';
                    toolsContainer.style.width = '100%';
                    toolsContainer.style.marginTop = '15px';
                    toolsContainer.style.fontSize = '18px';
                    toolsContainer.style.padding = '10px';
                    toolsContainer.style.borderRadius = '5px';
                    toolsContainer.style.color = '#0000c0';
                    toolsContainer.style.backgroundColor = '#ebf2f9';
                    bindingAnchor.parentElement.insertBefore(toolsContainer, bindingAnchor);

                    let genCalcCfgLink = document.createElement('span');
                    genCalcCfgLink.setAttribute('class', 'fyg_lh30');
                    genCalcCfgLink.style.width = '25%';
                    genCalcCfgLink.style.textAlign = 'left';
                    genCalcCfgLink.style.display = 'inline-block';
                    genCalcCfgLink.innerHTML =
                        `<a href="###" style="text-decoration:underline;" id="${g_genCalcCfgPopupLinkId}">生成计算器配置（PVE）</a>`;
                    genCalcCfgLink.querySelector('#' + g_genCalcCfgPopupLinkId).onclick = toolsLinks;
                    toolsContainer.appendChild(genCalcCfgLink);

                    let bindingLink = document.createElement('span');
                    bindingLink.setAttribute('class', 'fyg_lh30');
                    bindingLink.style.width = '25%';
                    bindingLink.style.textAlign = 'left';
                    bindingLink.style.display = 'inline-block';
                    bindingLink.innerHTML =
                        `<a href="###" style="text-decoration:underline;" id="${g_bindingPopupLinkId}">绑定（装备 光环 护符）</a>`;
                    bindingLink.querySelector('#' + g_bindingPopupLinkId).onclick = toolsLinks;
                    toolsContainer.appendChild(bindingLink);

                    let bindingsolutionDiv = document.createElement('div');
                    bindingsolutionDiv.id = g_bindingSolutionId;
                    bindingsolutionDiv.style.display = 'none';
                    bindingsolutionDiv.style.width = '50%';

                    let bindingList = document.createElement('select');
                    bindingList.id = g_bindingListSelectorId;
                    bindingList.style.width = '80%';
                    bindingList.style.color = '#0000c0';
                    bindingList.style.textAlign = 'center';
                    bindingList.style.display = 'inline-block';
                    bindingsolutionDiv.appendChild(bindingList);

                    let applyLink = document.createElement('span');
                    applyLink.setAttribute('class', 'fyg_lh30');
                    applyLink.style.width = '20%';
                    applyLink.style.textAlign = 'right';
                    applyLink.style.display = 'inline-block';
                    applyLink.innerHTML = `<a href="###" style="text-decoration:underline;" id="${g_equipOnekeyLinkId}">应用方案</a>`;
                    applyLink.querySelector('#' + g_equipOnekeyLinkId).onclick = toolsLinks;
                    bindingsolutionDiv.appendChild(applyLink);
                    toolsContainer.appendChild(bindingsolutionDiv);

                    refreshBindingSelector(roleId);
                }

                function switchEquipSubtabs() {
                    function enableSwitchEquipSubtabs(enabled) {
                        const maskDivId = 'equip-tab-div';
                        let maskDiv = document.getElementById(maskDivId);
                        if (maskDiv == null) {
                            maskDiv = document.createElement('div');
                            maskDiv.id = maskDivId;
                            maskDiv.style.position = 'absolute';
                            maskDiv.style.zIndex = '999';
                            maskDiv.style.height = '100%';
                            maskDiv.style.width = '100%';
                            maskDiv.style.top = '0';
                            maskDiv.style.left = '0';
                            maskDiv.style.backgroundColor = 'rgb(0, 0, 0, 0.02)';
                            maskDiv.enableSwitchEquipSubtabs = enableSwitchEquipSubtabs;
                            let container = document.querySelector('ul.nav.nav-secondary.nav-justified').parentElement;
                            container.insertBefore(maskDiv, container.firstElementChild);
                        }
                        else if (!enabled && maskDiv.style.display != 'none') {
                            return false;
                        }
                        maskDiv.style.display = (enabled ? 'none' : 'block');
                        return true;
                    }

                    if (enableSwitchEquipSubtabs(false)) {
                        let index = -1;
                        document.querySelectorAll('ul.nav.nav-secondary.nav-justified > li').forEach((e, i) => {
                            if (e.className.indexOf('active') >= 0) {
                                index = i;
                            }
                        });
                        switch (index) {
                            case 0: {
                                if (document.getElementById('equipmentDiv') == null) {
                                    restructureEquipUI(enableSwitchEquipSubtabs, true);
                                    return;
                                }
                                else {
                                    switchObjectContainerStatus(!equipmentStoreExpand);
                                }
                                break;
                            }
                            case 1: {
                                let roleName = backpacksDiv.querySelector('div.row > div.col-md-3 > span.text-info.fyg_f24');
                                let unique = roleName?.querySelector('#unique');
                                let roleId = g_roleMap.get((unique ?? roleName)?.innerText)?.id;
                                if (roleId != null) {
                                    addRoleOperationBtn(roleId);
                                }
                                break;
                            }
                            default: {
                                break;
                            }
                        }
                        enableSwitchEquipSubtabs(true);
                    }
                }

                let backpacksObserver = new MutationObserver(() => {
                    backpacksObserver.disconnect();
                    switchEquipSubtabs();
                    backpacksObserver.observe(backpacksDiv, { childList : true });
                });

                switchEquipSubtabs();
                backpacksObserver.observe(backpacksDiv, { childList : true });

                equipmentNodesToArray(cardingDiv.querySelectorAll(cardingObjectsQueryString));
                new MutationObserver(() => {
                    equipmentNodesToArray(cardingDiv.querySelectorAll(cardingObjectsQueryString));
                }).observe(cardingDiv, { childList : true });
            }
        }, 200);
    }
    else if (window.location.pathname == g_guguzhenBeach) {
        genericPopupInitialize();

        let beachConfigDiv = document.createElement('div');
        beachConfigDiv.style.padding = '5px 15px';
        beachConfigDiv.style.borderBottom = '1px solid #d0d0d0';
        beachConfigDiv.innerHTML =
            `<button type="button" style="width:160px;" id="analyze-indicator" disabled>分析中...（0）</button>
             <div style="float:right;">
               <button type="button" style="width:120px;" id="siftSettings">筛选展开设置</button>
               <button type="button" style="width:120px;" id="toAmuletSettings">批量转护符设置</button>
               <input type="checkbox" id="forceExpand" style="margin-left:15px;margin-right:5px;" />
               <label for="forceExpand" style="margin-right:15px;cursor:pointer;">强制展开所有装备</label>
               <input type="checkbox" id="beach_BG" style="margin-right:5px;" />
               <label for="beach_BG" style="cursor:pointer;">使用深色背景</label>
             </div></div>`;

        let equipRefreshRequired = true;
        let btnAnalyze = beachConfigDiv.querySelector('#analyze-indicator');
        btnAnalyze.onclick = (() => {
            if (document.getElementById('beach_copy') != null) {
                btnAnalyze.disabled = 'disabled';
                equipRefreshRequired = true;
                analyzeBeachEquips();
            }
        });

        let forceExpand = setupConfigCheckbox(
            beachConfigDiv.querySelector('#forceExpand'),
            g_beachForceExpandStorageKey,
            (checked) => {
                forceExpand = checked;
                if (document.getElementById('beach_copy') != null) {
                    analyzeBeachEquips();
                }
            },
            null);

        let beach_BG = setupConfigCheckbox(
            beachConfigDiv.querySelector('#beach_BG'),
            g_beachBGStorageKey,
            (checked) => { changeBeachStyle('beach_copy', beach_BG = checked); },
            null);

        beachConfigDiv.querySelector('#toAmuletSettings').onclick = (() => {
            modifyConfig('批量转护符设置', false, 'minBeachEquipLevelToAmulet', 'minBeachAmuletPointsToStore', 'clearBeachAfterBatchToAmulet');
        });

        beachConfigDiv.querySelector('#siftSettings').onclick = (() => {
            // deprecated
            loadTheme();
            // deprecated

            let fixedContent =
                '<div style="font-size:15px;color:#0000c0;padding:20px 0px 10px;"><b><ul>' +
                '<li>被勾选的装备不会被展开，不会产生与已有装备的对比列表，但传奇、史诗及有神秘属性的装备例外</li>' +
                '<li>未勾选的属性将被视为主要属性，沙滩装备的任一主要属性值大于已有装备的相应值时即有可能被展开，除非已有装备中至少有一件其各项属性值均不低于沙滩装备</li>' +
                '<li>被勾选的属性将被视为次要属性，当且仅当沙滩装备和已有装备的主要属性值完全相等时才会被对比</li>' +
                '<li>不作为筛选依据的已有装备或指定特性不会与沙滩装备直接进行比较，这些装备不会影响沙滩装备的展开与否</li></ul></b></div>';
            let mainContent =
                `<style> #equip-table { width:100%; }
                         #equip-table th { width:17%; text-align:right; }
                         #equip-table th.equip-name { width:32%; text-align:left; }
                         #equip-table td { display:table-cell; text-align:right; }
                         #equip-table td.equip-name { display:table-cell; text-align:left; }
                         #equip-table label.equip-checkbox-label { margin-left:5px; cursor:pointer; }
                         #equip-table tr.alt { background-color:${g_genericPopupBackgroundColorAlt}; } </style>
                 <div class="${g_genericPopupTopLineDivClass}" style="color:#800080;">
                   <b style="display:inline-block;width:30%;">不作为筛选依据的特性及装备：</b>
                   <span style="display:inline-block;width:22%;;text-align:center;">
                     <input type="checkbox" id="ignoreEquipQuality" style="margin-right:5px;" />
                     <label for="ignoreEquipQuality" style="cursor:pointer;">装备品质</label></span>
                   <span style="display:inline-block;width:22%;;text-align:center;">
                     <input type="checkbox" id="ignoreMysEquip" style="margin-right:5px;" />
                     <label for="ignoreMysEquip" style="cursor:pointer;">神秘装备</label></span>
                   <b style="display:inline-block;width:22%;text-align:right;">低于 ` +
                     `<input type="text" id="ignoreEquipLevel" style="width:40px;" maxlength="3" value="0"
                             oninput="value=value.replace(/[\\D]/g,'');" /> 级的装备</b></div>
                 <div class="${g_genericPopupTopLineDivClass}"><table id="equip-table">
                 <tr class="alt"><th class="equip-name"><input type="checkbox" id="equip-name-check" />
                   <label class="equip-checkbox-label" for="equip-name-check">装备名称</label></th>
                 <th>装备属性</th><th /><th /><th /></tr></table><div>`;

            genericPopupSetFixedContent(fixedContent);
            genericPopupSetContent('沙滩装备筛选设置', mainContent);

            genericPopupQuerySelector('#equip-name-check').onchange = ((e) => {
                let eqchecks = equipTable.querySelectorAll('input.sift-settings-checkbox');
                for (let i = 0; i < eqchecks.length; i += 5) {
                    eqchecks[i].checked = e.target.checked;
                }
            });

            let udata = loadUserConfigData();
            if (udata.dataBeachSift == null) {
                udata.dataBeachSift = {};
                saveUserConfigData(udata);
            }

            let ignoreEquipQuality = genericPopupQuerySelector('#ignoreEquipQuality');
            let ignoreMysEquip = genericPopupQuerySelector('#ignoreMysEquip');
            let ignoreEquipLevel = genericPopupQuerySelector('#ignoreEquipLevel');

            ignoreEquipQuality.checked = (udata.dataBeachSift.ignoreEquipQuality ?? false);
            ignoreMysEquip.checked = (udata.dataBeachSift.ignoreMysEquip ?? false);
            ignoreEquipLevel.value = (udata.dataBeachSift.ignoreEquipLevel ?? "0");

            let equipTable = genericPopupQuerySelector('#equip-table');
            let equipTypeColor = [ '#000080', '#008000', '#800080', '#008080' ];
            g_equipments.forEach((equip) => {
                let tr = document.createElement('tr');
                tr.id = `equip-index-${equip.index}`;
                tr.className = ('equip-tr' + ((equip.index & 1) == 0 ? '' : ' alt'));
                tr.setAttribute('equip-abbr', equip.shortMark);
                tr.style.color = equipTypeColor[equip.type];
                let attrHTML = '';
                equip.attributes.forEach((item, index) => {
                    let attrId = `${tr.id}-attr-${index}`;
                    attrHTML +=
                        `<td><input type="checkbox" class="sift-settings-checkbox" id="${attrId}" />
                         <label class="equip-checkbox-label" for="${attrId}">${item.attribute.name}</label></td>`;
                });
                let equipId = `equip-${equip.index}`;
                tr.innerHTML =
                    `<td class="equip-name"><input type="checkbox" class="sift-settings-checkbox" id="${equipId}" />
                         <label class="equip-checkbox-label" for="${equipId}">${equip.alias}</label></td>${attrHTML}`;
                equipTable.appendChild(tr);
            });

            let eqchecks = equipTable.querySelectorAll('input.sift-settings-checkbox');
            for (let i = 0; i < eqchecks.length; i += 5) {
                let abbr = eqchecks[i].parentElement.parentElement.getAttribute('equip-abbr');
                if (udata.dataBeachSift[abbr] != null) {
                    let es = udata.dataBeachSift[abbr].split(',');
                    for (let j = 0; j < es.length; j++) {
                        eqchecks[i + j].checked = (es[j] == 'true');
                    }
                }
            }

            genericPopupAddButton(
                '确认',
                80,
                (() => {
                    let settings = {
                        ignoreEquipQuality : ignoreEquipQuality.checked,
                        ignoreMysEquip : ignoreMysEquip.checked,
                        ignoreEquipLevel : ignoreEquipLevel.value
                    };
                    equipTable.querySelectorAll('tr.equip-tr').forEach((row) => {
                        let checks = [];
                        row.querySelectorAll('input.sift-settings-checkbox').forEach((col) => { checks.push(col.checked); });
                        settings[row.getAttribute('equip-abbr')] = checks.join(',');
                    });

                    let udata = loadUserConfigData();
                    udata.dataBeachSift = settings;
                    saveUserConfigData(udata);

                    window.location.reload();
                }),
                false);
            genericPopupAddCloseButton(80);

            genericPopupSetContentSize(Math.min(g_equipments.length * 31 + 130, Math.max(window.innerHeight - 400, 600)),
                                       Math.min(750, Math.max(window.innerWidth - 100, 600)),
                                       true);
            genericPopupShowModal(true);
        });

        let beach = document.getElementById('beachall');
        beach.parentElement.insertBefore(beachConfigDiv, beach);

        let batbtns = document.querySelector('div.col-md-12 > div.panel > div.panel-heading > div.btn-group > button.btn.btn-danger');
        let toAmuletBtn = document.createElement('button');
        toAmuletBtn.className = batbtns.className;
        toAmuletBtn.innerText = '批量沙滩装备转护符';
        toAmuletBtn.style.marginLeft = '1px';
        toAmuletBtn.onclick = equipToAmulet;
        toAmuletBtn.disabled = 'disabled';
        batbtns.parentElement.appendChild(toAmuletBtn);

        function equipToAmulet() {
            // deprecated
            loadTheme();
            // deprecated

            readConfig();

            function divHeightAdjustment(div) {
                div.style.height = (div.parentElement.offsetHeight - div.offsetTop - 3) + 'px';
            }

            function moveAmuletItem(e) {
                let li = e.target;
                if (li.tagName == 'LI') {
                    let container = (li.parentElement == amuletToStoreList ? amuletToDestroyList : amuletToStoreList);
                    let liIndex = parseInt(li.getAttribute('li-index'));
                    for (var li0 = container.firstChild; parseInt(li0?.getAttribute('li-index')) < liIndex; li0 = li0.nextSibling);
                    container.insertBefore(li, li0);
                }
            }

            function refreshStore(fnPostProcess) {
                // read store
                stbp();

                let timer = setInterval(() => {
                    if (asyncOperations == 0) {
                        clearInterval(timer);
                        if (fnPostProcess != null) {
                            fnPostProcess();
                        }
                    }
                }, 200);
            }

            function queryObjects(storeAmulets, beach, beachEquipLevel) {
                freeCell = parseInt(document.querySelector('#wares > p.fyg_lh40.fyg_tc.text-gray')?.innerText?.match(/\d+/)?.[0]);
                if (isNaN(freeCell)) {
                    freeCell = 0;
                }
                if (storeAmulets != null) {
                    amuletNodesToArray(document.querySelectorAll('#wares > button.btn.fyg_mp3'), storeAmulets);
                }
                if (beach != null) {
                    let nodes = document.getElementById('beachall').children;
                    for (let node of nodes) {
                        let lv = objectGetLevel(node);
                        if (lv > 1) {
                            lv -= 2;
                            let eq = (new Equipment()).fromNode(node);
                            if (eq != null && eq.level >= beachEquipLevel[lv]) {
                                beach.push(eq.id);
                            }
                        }
                    }
                }
            }

            function pirlEquip() {
                let ids = [];
                while (originalBeachEquips.length > 0 && ids.length < freeCell) {
                    ids.unshift(originalBeachEquips.pop());
                }
                pirlCount = ids.length;
                genericPopupShowInformationTips(`熔炼装备...（0 / ${pirlCount}）`, 0);
                beginPirlObjects(
                    false,
                    ids,
                    (total, count) => {
                        genericPopupShowInformationTips(`熔炼装备...（${count} / ${total}）`, 0);
                        return true;
                    },
                    refreshStore,
                    prepareNewAmulets);
            }

            function prepareNewAmulets() {
                let amulets = [];
                queryObjects(amulets);
                newAmulets = findNewObjects(amulets, originalStoreAmulets, false, false, (a, b) => a.compareTo(b));
                if (newAmulets.length != pirlCount) {
                    alert('熔炼装备出错无法继续，请手动处理！');
                    window.location.reload();
                    return;
                }
                let liAm = [];
                newAmulets.forEach((am, index) => {
                    let li = document.createElement('li');
                    li.innerText = (am.type == 2 || am.level == 2 ? '★ ' : '') + am.formatBuffText();
                    li.style.backgroundColor = g_equipmentLevelBGColor[am.level + 2];
                    li.setAttribute('item-index', index);
                    liAm.push(li);
                });
                liAm.sort((a, b) => newAmulets[parseInt(a.getAttribute('item-index'))].compareTo(
                                    newAmulets[parseInt(b.getAttribute('item-index'))])).forEach((li, index) => {
                    li.setAttribute('li-index', index);
                    let am = newAmulets[parseInt(li.getAttribute('item-index'))];
                    (am.getTotalPoints() < minBeachAmuletPointsToStore[am.type] ? amuletToDestroyList : amuletToStoreList).appendChild(li);
                });
                (window.getSelection ?? document.getSelection)?.call()?.removeAllRanges();
                genericPopupShowInformationTips((originalBeachEquips.length > 0 ? '本批' : '全部') + '装备熔炼完成，请分类后继续', 0);
                btnContinue.innerText = `继续 （剩余 ${originalBeachEquips.length} 件装备 / ${freeCell} 个空位）`;
                btnContinue.disabled = '';
                btnCloseOnBatch.disabled = (originalBeachEquips.length > 0 ? '' : 'disabled');
            }

            function processNewAmulets() {
                btnContinue.disabled = 'disabled';
                btnCloseOnBatch.disabled = 'disabled';

                if (pirlCount > 0) {
                    let indices = [];
                    for (let li of amuletToDestroyList.children) {
                        indices.push(parseInt(li.getAttribute('item-index')));
                    }
                    if (indices.length > 0) {
                        let ids = [];
                        let warning = 0;
                        indices.sort((a, b) => a - b).forEach((i) => {
                            let am = newAmulets[i];
                            if (am.type == 2 || am.level == 2) {
                                warning++;
                            }
                            ids.push(am.id);
                        });
                        if (warning > 0 && !confirm(`这将销毁 ${warning} 个“樱桃／传奇”护符，要继续吗？`)) {
                            btnContinue.disabled = '';
                            btnCloseOnBatch.disabled = (originalBeachEquips.length > 0 ? '' : 'disabled');
                            return;
                        }
                        amuletToDestroyList.innerHTML = '';
                        coresCollected += indices.length;
                        pirlCount -= indices.length;
                        genericPopupShowInformationTips(`销毁护符...（0 / ${ids.length}）`, 0);
                        beginPirlObjects(
                            true,
                            ids,
                            (total, count) => {
                                genericPopupShowInformationTips(`销毁护符...（${count} / ${total}）`, 0);
                                return true;
                            },
                            refreshStore,
                            processNewAmulets);
                    }
                    else {
                        amuletToStoreList.innerHTML = '';
                        amuletsCollected += pirlCount;
                        pirlCount = 0;
                        processNewAmulets();
                    }
                }
                else if (originalBeachEquips.length > 0) {
                    queryObjects(originalStoreAmulets);
                    originalStoreAmulets.sort((a, b) => a.compareTo(b));
                    pirlEquip();
                }
                else {
                    postProcess(15);
                }
            }

            function postProcess(closeCountDown) {
                let closed = false;
                function closeProcess() {
                    if (timer != null) {
                        clearInterval(timer);
                        timer = null;
                    }
                    if (!closed) {
                        closed = true;
                        genericPopupClose(true, true);
                        if (clearBeachAfterBatchToAmulet != 0) {
                            // clear beach
                            sttz();
                        }
                        let msgBox = document.getElementById('mymessage');
                        timer = setInterval(() => {
                            if (asyncOperations == 0 && (!(msgBox?.style?.display?.length > 0) || msgBox.style.display == 'none')) {
                                clearInterval(timer);
                                timer = null;
                                window.location.reload();
                            }
                        }, 200);
                    }
                }

                let timer = null;
                if (closeCountDown > 0) {
                    genericPopupQuerySelector('#fixed-tips').innerText = `操作完成，共获得 ${amuletsCollected} 个护符， 销毁 ${coresCollected} 个护符`;
                    genericPopupOnClickOutside(closeProcess);
                    timer = setInterval(() => {
                        if (--closeCountDown == 0) {
                            closeProcess();
                        }
                        else {
                            genericPopupShowInformationTips(`窗口将在 ${closeCountDown} 秒后关闭，` +
                                                            `点击窗口外区域立即关闭${clearBeachAfterBatchToAmulet != 0 ? '并清理沙滩' : ''}`, 0);
                        }
                    }, 1000);
                }
                else {
                    closeProcess();
                }
            }

            const objectTypeColor = [ '#e0fff0', '#ffe0ff', '#fff0e0', '#d0f0ff' ];
            let minBeachAmuletPointsToStore = [ 1, 1, 1 ];
            let cfg = g_configMap.get('minBeachAmuletPointsToStore')?.value?.split(',');
            if (cfg?.length == 3) {
                cfg.forEach((item, index) => {
                    if (isNaN(minBeachAmuletPointsToStore[index] = parseInt(item))) {
                        minBeachAmuletPointsToStore[index] = 1;
                    }
                });
            }

            let originalBeachEquips = [];
            let originalStoreAmulets = [];
            let freeCell = 0;
            let pirlCount = 0;
            let amuletsCollected = 0;
            let coresCollected = 0;
            let newAmulets = null;

            let clearBeachAfterBatchToAmulet = (g_configMap.get('clearBeachAfterBatchToAmulet')?.value ?? 0);
            let minBeachEquipLevelToAmulet = (g_configMap.get('minBeachEquipLevelToAmulet')?.value ?? '1,1,1').split(',');
            for (let i = 0; i < 3; i++) {
                minBeachEquipLevelToAmulet[i] = parseInt(minBeachEquipLevelToAmulet[i] ?? 0);
                if (isNaN(minBeachEquipLevelToAmulet[i])) {
                    minBeachEquipLevelToAmulet[i] = 1;
                }
            }
            queryObjects(null, originalBeachEquips, minBeachEquipLevelToAmulet);
            if (originalBeachEquips.length == 0) {
                alert('沙滩无可熔炼装备！');
                return;
            }
            else if (freeCell == 0) {
                alert('仓库已满！');
                return;
            }

            let fixedContent =
                `<div style="width:100%;padding:10px 0px 0px 0px;font-size:16px;color:blue;"><b>
                   <span id="fixed-tips">左键双击或上下文菜单键单击条目以进行分类间移动</span><br>
                   <div id="${g_genericPopupInformationTipsId}" style="width:100%;color:red;text-align:right;"></div></b></div>`;
            let mainContent =
                '<div style="display:block;height:96%;width:100%;">' +
                  '<div style="position:relative;display:block;float:left;height:96%;width:48%;' +
                              'margin-top:10px;border:1px solid #000000;">' +
                    '<div style="display:block;width:100%;padding:5px;border-bottom:2px groove #d0d0d0;margin-bottom:10px;">放入仓库</div>' +
                    '<div style="position:absolute;display:block;height:1px;width:100%;overflow:scroll;">' +
                      '<ul id="amulet_to_store_list" style="cursor:pointer;"></ul></div></div>' +
                  '<div style="position:relative;display:block;float:right;height:96%;width:48%;' +
                              'margin-top:10px;border:1px solid #000000;">' +
                    '<div style="display:block;width:100%;padding:5px;border-bottom:2px groove #d0d0d0;margin-bottom:10px;">销毁护符</div>' +
                    '<div style="position:absolute;display:block;height:1px;width:100%;overflow:scroll;">' +
                      '<ul id="amulet_to_destroy_list" style="cursor:pointer;"></ul></div></div></div>';

            genericPopupSetFixedContent(fixedContent);
            genericPopupSetContent('批量护符转换', mainContent);

            let amuletToStoreList = genericPopupQuerySelector('#amulet_to_store_list');
            let amuletToDestroyList = genericPopupQuerySelector('#amulet_to_destroy_list');
            amuletToStoreList.oncontextmenu = amuletToDestroyList.oncontextmenu = ((e) => { e.preventDefault(); moveAmuletItem(e); });
            amuletToStoreList.ondblclick = amuletToDestroyList.ondblclick = moveAmuletItem;

            genericPopupShowInformationTips('这会分批将沙滩可熔炼装备转化为护符，请点击“继续”开始', 0);
            let btnContinue = genericPopupAddButton(`继续 （剩余 ${originalBeachEquips.length} 件装备 / ${freeCell} 个空位）`,
                                                    0, processNewAmulets, true);
            let btnCloseOnBatch = genericPopupAddButton('本批完成后关闭（不清理沙滩）', 0, (() => {
                clearBeachAfterBatchToAmulet = 0;
                originalBeachEquips = [];
                processNewAmulets();
            }), false);
            btnCloseOnBatch.disabled = 'disabled';

            genericPopupAddButton('关闭（不清理沙滩）', 0, (() => { window.location.reload(); }), false);

            genericPopupSetContentSize(400, 700, false);

            analyzingEquipment = true;
            genericPopupShowModal(false);

            divHeightAdjustment(amuletToStoreList.parentElement);
            divHeightAdjustment(amuletToDestroyList.parentElement);
        }

        let asyncOperations = 1;
        let equipExchanged = false;
        let cardingNodes, equipNodes, equipInfos = [];
        let roleInfo;
        beginReadCurrentRole(
            roleInfo = {},
            true,
            () => {
                $(document).ajaxSend(() => { asyncOperations++; });
                $(document).ajaxComplete((e, r) => {
                    if (r.responseText?.indexOf('已装备') >= 0) {
                        equipExchanged = true;
                    }
                    if (--asyncOperations < 0) {
                        asyncOperations = 0;
                    }
                });

                cardingNodes = Array.from(roleInfo.equips).sort(objectNodeComparer);
                if (--asyncOperations < 0) {
                    asyncOperations = 0;
                }
            });

        (new MutationObserver((mlist) => {
            if (!(mlist[0].addedNodes[0]?.className?.indexOf('popover') >= 0 ||
                  mlist[0].removedNodes[0]?.className?.indexOf('popover') >= 0)) {
                let oldNodes = Array.from(mlist[0].removedNodes).sort(objectNodeComparer);
                let newNodes = Array.from(mlist[0].addedNodes).sort(objectNodeComparer);
                let oldInfos = equipmentNodesToArray(oldNodes);
                let newInfos = equipmentNodesToArray(newNodes);
                if (equipExchanged) {
                    equipExchanged = false;
                    let puton = findNewObjects(oldInfos, newInfos, true, false, (a, b) => a.compareTo(b));
                    if (puton.length == 1) {
                        let takeoff = findNewObjects(newInfos, oldInfos, true, false, (a, b) => a.compareTo(b));
                        if (takeoff.length == 1) {
                            let exi = searchElement(cardingNodes, newNodes[takeoff[0]], objectNodeComparer);
                            if (exi >= 0) {
                                cardingNodes.splice(exi, 1);
                            }
                        }
                        if (cardingNodes.length < 4) {
                            insertElement(cardingNodes, oldNodes[puton[0]], objectNodeComparer);
                        }
                    }
                    return;
                }

                equipRefreshRequired = (oldInfos.length != newInfos.length);

                if (oldNodes.length == newNodes.length) {
                    analyzeBeachEquips();
                }
            }
        })).observe(document.getElementById('wares'), { childList : true });

        let beachTimer = setInterval(() => {
            if (asyncOperations == 0 &&
                (document.getElementById('beachall')?.firstChild?.nodeType ?? Node.ELEMENT_NODE) == Node.ELEMENT_NODE &&
                (document.getElementById('wares')?.firstChild?.nodeType ?? Node.ELEMENT_NODE) == Node.ELEMENT_NODE) {

                clearInterval(beachTimer);

                // deprecated
                loadTheme();
                // deprecated

                analyzeBeachEquips();
                (new MutationObserver(() => { analyzeBeachEquips(); })).observe(document.getElementById('beachall'), { childList : true });

                toAmuletBtn.disabled = '';
            }
        }, 200);

        let analyzingEquipment = false;
        function analyzeBeachEquips() {
            if (!analyzingEquipment) {
                analyzingEquipment = true;
                let count = (document.getElementById('beachall')?.children?.length ?? 0);
                btnAnalyze.innerText = `分析中...（${count}）`;

                let equipTimer = setInterval(() => {
                    if (asyncOperations == 0) {
                        clearInterval(equipTimer);

                        if (equipRefreshRequired) {
                            equipNodes = cardingNodes.concat(Array.from(document.querySelectorAll('#wares button.btn.fyg_mp3')))
                                                     .sort(objectNodeComparer);
                            equipInfos = equipmentNodesToArray(equipNodes);
                            equipRefreshRequired = false;

                            // debug only
                            equipInfos.forEach((e, i) => {
                                if (equipmentVerify(equipNodes[i], e) != 0) {
                                    equipNodes[i].style.border = '3px solid #ff00ff';
                                }
                            });
                        }

                        expandEquipment();

                        btnAnalyze.innerText = `重新分析（${count}）`;
                        btnAnalyze.disabled = (document.getElementById('beachall')?.children?.length > 0 ? '' : 'disabled');

                        analyzingEquipment = false;
                    }
                }, 200);
            }
        }

        function expandEquipment() {
            let beach_copy = document.getElementById('beach_copy');
            if (beach_copy == null) {
                let beachall = document.getElementById('beachall');
                beach_copy = beachall.cloneNode();
                beachall.style.display = 'none';
                beach_copy.id = 'beach_copy';
                beach_copy.style.backgroundColor = beach_BG ? 'black' : 'white';
                beachall.parentElement.insertBefore(beach_copy, beachall);

                (new MutationObserver((mList) => {
                    if (!analyzingEquipment && mList?.length == 1 && mList[0].type == 'childList' &&
                        mList[0].addedNodes?.length == 1 && !(mList[0].removedNodes?.length > 0)) {

                        let node = mList[0].addedNodes[0];
                        if (node.hasAttribute('role')) {
                            node.remove();
                        }
                        else if (node.className?.indexOf('popover') >= 0) {
                            node.setAttribute('id', 'id_temp_apply_beach_BG');
                            changeBeachStyle('id_temp_apply_beach_BG', beach_BG);
                            node.removeAttribute('id');
                            if (node.className?.indexOf('popover-') < 0) {
                                let content = node.querySelector('.popover-content');
                                content.style.borderRadius = '5px';
                                content.style.border = '4px double ' + (beach_BG ? 'white' : 'black');
                            }
                        }
                    }
                })).observe(beach_copy, { childList : true });
            }
            copyBeach(beach_copy);

            let udata = loadUserConfigData();
            if (udata.dataBeachSift == null) {
                udata.dataBeachSift = {};
                saveUserConfigData(udata);
            }

            let ignoreEquipQuality = (udata.dataBeachSift.ignoreEquipQuality ?? false);
            let ignoreMysEquip = (udata.dataBeachSift.ignoreMysEquip ?? false);
            let ignoreEquipLevel = parseInt(udata.dataBeachSift.ignoreEquipLevel ?? '0');
            if (isNaN(ignoreEquipLevel)) {
                ignoreEquipLevel = 0;
            }

            let settings = {};
            for (let abbr in udata.dataBeachSift) {
                if (g_equipMap.has(abbr)) {
                    let checks = udata.dataBeachSift[abbr].split(',');
                    if (checks?.length == 5) {
                        let setting = [];
                        checks.forEach((checked) => { setting.push(checked.trim().toLowerCase() == 'true'); });
                        settings[abbr] = setting;
                    }
                }
            }

            const defaultSetting = [ false, false, false, false, false ];
            beach_copy.querySelectorAll('button.btn.fyg_mp3').forEach((btn) => {
                let eq = (new Equipment()).fromNode(btn);
                if (eq != null) {
                    let isExpanding = false;
                    let eqLv = eq.getQualityLevel();
                    if (forceExpand || eqLv > 2 || eq.myst) {
                        isExpanding = true;
                    }
                    else {
                        let setting = (settings[eq.meta.shortMark] ?? defaultSetting);
                        if (!setting[0]) {
                            let isFind = false;
                            for (let j = equipInfos.length - 1; j >= 0; j--) {
                                if (equipInfos[j].meta.index == eq.meta.index &&
                                    !(ignoreMysEquip && equipInfos[j].myst) &&
                                    equipInfos[j].level >= ignoreEquipLevel) {

                                    isFind = true;
                                    let res = defaultBeachEquipComparer(setting, eq, equipInfos[j]);
                                    if (!ignoreEquipQuality && (res.quality > 0 || (res.quality == 0 && eq.level > equipInfos[j].level))) {
                                        isExpanding = true;
                                    }
                                    else if (res.majorAdv == 0) {
                                        if (res.minorAdv == 0) {
                                            isExpanding = false;
                                            break;
                                        }
                                        else if (!isExpanding) {
                                            isExpanding = (res.majorDis == 0);
                                        }
                                    }
                                    else {
                                        isExpanding = true;
                                    }
                                }
                            }
                            if (!isFind) {
                                isExpanding = true;
                            }
                        }
                    }
                    let btn0 = null;
                    if (isExpanding) {
                        btn0 = document.createElement('button');
                        btn0.className = `btn btn-light popover-${g_equipmentLevelStyleClass[eqLv]}`;
                        btn0.style.minWidth = '240px';
                        btn0.style.padding = '0px';
                        btn0.style.marginBottom = '5px';
                        btn0.style.textAlign = 'left';
                        btn0.style.boxShadow = 'none';
                        btn0.style.lineHeight = '150%';
                        btn0.setAttribute('data-toggle', 'popover');
                        btn0.setAttribute('data-trigger', 'hover');
                        btn0.setAttribute('data-placement', 'bottom');
                        btn0.setAttribute('data-html', 'true');
                        btn0.setAttribute('onclick', btn.getAttribute('onclick'));

                        let popover = document.createElement('div');
                        popover.innerHTML =
                            `<style> .popover { max-width:100%; }
                                     .compare-equip-title { margin-bottom:0px; text-align:center; }
                                     .compare-equip-content { padding:10px 5px 0px 5px; text-align:left; line-height:120%;}
                             </style>`;
                        equipInfos.forEach((ieq, i) => {
                            if (eq.meta.index == ieq.meta.index) {
                                let btn1 = document.createElement('button');
                                let styleClass = g_equipmentLevelStyleClass[ieq.getQualityLevel()];
                                btn1.className = `btn btn-light popover-${styleClass}`;
                                btn1.style.cssText = 'min-width:220px;padding:0px;box-shadow:none;margin-right:5px;margin-bottom:5px;';
                                btn1.innerHTML =
                                    `<p class="compare-equip-title bg-${styleClass}">Lv.<b>${ieq.level}（${ieq.getQuality()}%）</b></p>
                                     <div class="compare-equip-content">${equipNodes[i].dataset.content}</div>`;
                                if (btn1.lastChild.lastChild?.nodeType != Node.ELEMENT_NODE) {
                                    btn1.lastChild.lastChild?.remove();
                                }
                                if (btn1.lastChild.lastChild?.className?.indexOf('bg-danger') >= 0) {
                                    btn1.lastChild.lastChild.style.cssText =
                                        'max-width:210px;padding:3px;white-space:pre-line;word-break:break-all;';
                                }
                                popover.insertBefore(btn1, popover.firstElementChild);

                                // debug only
                                if (equipmentVerify(equipNodes[i], ieq) != 0) {
                                    btn1.style.border = '5px solid #ff00ff';
                                }
                            }
                        });
                        btn0.setAttribute('data-content', popover.innerHTML);
                        btn0.innerHTML =
                            `<h3 class="popover-title bg-${g_equipmentLevelStyleClass[eq.getQualityLevel()]}">${btn.dataset.originalTitle}</h3>
                             <div class="popover-content-show" style="padding:10px 10px 0px 10px;">${btn.dataset.content}</div>`;
                        beach_copy.insertBefore(btn0, btn.nextSibling);
                    }
                    // debug only
                    if (equipmentVerify(btn, eq) != 0) {
                        btn.style.border = '3px solid #ff00ff';
                        if (btn0 != null) {
                            btn0.style.border = '5px solid #ff00ff';
                        }
                    }
                }
            });

            $(function() {
                $('#beach_copy .btn[data-toggle="popover"]').popover();
            });
            $('#beach_copy .bg-danger.with-padding').css({
                'max-width': '220px',
                'padding': '5px',
                'white-space': 'pre-line',
                'word-break': 'break-all'
            });

            changeBeachStyle('beach_copy', beach_BG);

            function copyBeach(beach_copy) {
                beach_copy.innerHTML = '';
                Array.from(document.getElementById('beachall').children).sort(sortBeach).forEach((node) => {
                    beach_copy.appendChild(node.cloneNode(true));
                });

                function sortBeach(a, b) {
                    let delta = objectGetLevel(a) - objectGetLevel(b);
                    if (delta == 0) {
                        if ((delta = parseInt(a.innerText.match(/\d+/)[0]) - parseInt(b.innerText.match(/\d+/)[0])) == 0) {
                            delta = (a.getAttribute('data-original-title') < b.getAttribute('data-original-title') ? -1 : 1);
                        }
                    }
                    return -delta;
                }
            }
        }

        function changeBeachStyle(container, bg) {
            $(`#${container}`).css({
                'background-color': bg ? 'black' : 'white'
            });
            $(`#${container} .popover-content-show`).css({
                'background-color': bg ? 'black' : 'white'
            });
            $(`#${container} .btn-light`).css({
                'background-color': bg ? 'black' : 'white'
            });
            $(`#${container} .popover-title`).css({
                'color': bg ? 'black' : 'white'
            });
            $(`#${container} .compare-equip-title`).css({
                'color': bg ? 'black' : 'white'
            });
            $(`#${container} .pull-right`).css({
                'color': bg ? 'black' : 'white'
            });
            $(`#${container} .bg-danger.with-padding`).css({
                'color': bg ? 'black' : 'white'
            });
        }

        document.body.style.paddingBottom = '1000px';
    }
    else if (window.location.pathname == g_guguzhenPK) {
        let timer = setInterval(() => {
            let pkListDiv = document.querySelector('#pklist');
            if (pkListDiv?.firstElementChild != null) {
                clearInterval(timer);

                let pkConfigDiv = document.createElement('div');
                pkConfigDiv.className = 'row';
                pkConfigDiv.innerHTML =
                    `<div class="panel panel-info" style="width:100%;">
                     <div class="panel-heading" id="pk-addin-panel" style="width:100%;display:table;border:none;">
                     <div id="solutionPanel" style="display:none;margin-top:3px;float:left;"
                          data-toggle="tooltip" data-placement="top"
                          data-original-title="如果在其它页面增加、删除或修改了任何绑定方案，请重新刷新本页面或点击“更新列表”链接以获取新的方案列表。` +
                                              `如果在其它页面切换了方案，亦请重新刷新本页面或点击“更新列表”链接以获取当前配置信息，` +
                                              `在方案列表上悬停可查看当前配置摘要。"><b>
                       <a href="###" id="refreshSolutionList"
                          style="margin-top:2px;font-size:15px;text-decoration:underline;float:left;">更新列表</a>
                       <div style="padding-top:1px;margin-left:10px;margin-right:10px;float:left;">
                         <select id="bindingSolutions" style="width:200px;font-size:15px;padding:2px 0px;"></select></div>
                       <a href="###" id="switchSolutionLink"
                          style="display:inline-block;margin-top:2px;font-size:15px;text-decoration:underline;float:left;">应用方案</a>
                       <span id="repointLeft"
                          style="display:inline-block;margin-top:2px;margin-left:3px;font-size:15px;float:left;"></span></b></div>
                     <div id="toggle-solution-panel" title="折叠方案切换面板"
                          style="padding-left:10px;padding-top:3px;margin-top:5px;margin-left:10px;
                                 border-left:3px groove cyan;float:left;cursor:pointer;">
                       <i class="icon icon-chevron-sign-left"></i></div>
                     <div id="pk-config-panel" style="margin-top:4px;text-align:right;float:right;">
                     <div style="float:left;">
                       <input type="checkbox" id="indexRallyCheckbox" style="margin-left:15px;" />
                       <label for="indexRallyCheckbox" style="margin-left:5px;cursor:pointer;">为攻击回合加注索引</label>
                       <input type="checkbox" id="keepPkRecordCheckbox" style="margin-left:15px;" />
                       <label for="keepPkRecordCheckbox" style="margin-left:5px;cursor:pointer;">暂时保持战斗记录</label>
                       <input type="checkbox" id="expandPkRecordCheckbox" style="margin-left:15px;" />
                       <label for="expandPkRecordCheckbox" style="margin-left:5px;cursor:pointer;">展开临时战斗记录</label></div></div>
                     <div id="toggle-pk-config-panel" title="折叠设置面板"
                          style="padding-right:10px;padding-top:3px;margin-top:5px;margin-right:10px;
                                 border-right:3px groove cyan;float:right;cursor:pointer;">
                       <i class="icon icon-chevron-sign-right"></i></div>
                     </div></div>`;
                let pkAddinPanel = pkConfigDiv.querySelector('#pk-addin-panel');

                let showSolutionPanel = (localStorage.getItem(g_showSolutionPanelStorageKey) == 'true');
                let ctrlToggleSolutionPanel = pkConfigDiv.querySelector('#toggle-solution-panel');
                ctrlToggleSolutionPanel.onclick = (() => {
                    localStorage.setItem(g_showSolutionPanelStorageKey, showSolutionPanel = !showSolutionPanel);
                    initializeSolutionPanel();
                });
                function initializeSolutionPanel() {
                    if (showSolutionPanel) {
                        ctrlToggleSolutionPanel.firstElementChild.className = 'icon icon-chevron-sign-left';
                        ctrlToggleSolutionPanel.title = "折叠方案切换面板";
                        ctrlToggleSolutionPanel.previousElementSibling.style.display = 'block';
                    }
                    else {
                        ctrlToggleSolutionPanel.firstElementChild.className = 'icon icon-chevron-sign-right';
                        ctrlToggleSolutionPanel.title = "展开方案切换面板";
                        ctrlToggleSolutionPanel.previousElementSibling.style.display = 'none';
                    }
                }
                initializeSolutionPanel();

                pkConfigDiv.querySelector('#refreshSolutionList').onclick = (() => { refreshBindingSolutionList(); });

                let bindingSolutions = pkConfigDiv.querySelector('#bindingSolutions');
                function refreshBindingSolutionList() {
                    bindingSolutions.innerHTML = '<option></option>';
                    readBindingSolutionList()?.forEach((role) => {
                        let opg = document.createElement('optgroup');
                        opg.label = `● ${role.role.name}`;
                        bindingSolutions.appendChild(opg);
                        role.bindings.forEach((bind) => {
                            let op = document.createElement('option');
                            op.value = op.innerText = `${role.role.name} ${SOLUTION_NAME_SEPARATOR} ${bind.name}`;
                            opg.appendChild(op);
                        });
                    });
                    refreshCurrentSolution();
                }
                function refreshCurrentSolution() {
                    bindingSolutions.disabled = 'disabled';
                    bindingSolutions.options[0].innerText = '读取角色配置...';
                    bindingSolutions.selectedIndex = 0;
                    let roleInfo = {};
                    beginReadCurrentRole(
                        roleInfo,
                        true,
                        () => {
                            if (roleInfo.isRoleInfo) {
                                for (let opt of bindingSolutions.children) {
                                    if (opt.label?.trim().slice(-1) == roleInfo.meta.name) {
                                        if (opt != bindingSolutions.firstElementChild.nextElementSibling) {
                                            opt.remove();
                                            bindingSolutions.insertBefore(opt, bindingSolutions.firstElementChild.nextElementSibling);
                                        }
                                        break;
                                    }
                                }
                                let title = `正在使用角色\n${roleInfo.meta.name} Lv.${roleInfo.level}`;
                                let eqs = equipmentNodesToArray(roleInfo.equips);
                                eqs?.forEach((eq) => {
                                    title += `\n ● ${eq.meta.alias} Lv.${eq.level}${eq.myst ? ' [神秘]' : ''}`;
                                });
                                bindingSolutions.title = title;
                                bindingSolutions.options[0].innerText = `★ ${roleInfo.meta.name}：${eqs?.[0]?.meta.alias ?? '未知'}`;
                                bindingSolutions.selectedIndex = 0;
                                let haloInfo = {};
                                beginReadHaloInfo(
                                    haloInfo,
                                    () => {
                                        title += '\n';
                                        if (haloInfo.isHaloInfo) {
                                            let i = 0;
                                            for (let halo of haloInfo.items) {
                                                title += `${((i++ % 4) == 0) ? '\n ●' : ' |'} ${g_haloMap.get(halo)?.name ?? '未知'}`;
                                            }
                                        }
                                        else {
                                            title += '\n ● 读取光环信息失败';
                                        }
                                        bindingSolutions.title = title;
                                        bindingSolutions.disabled = '';
                                    }
                                );
                            }
                            else {
                                bindingSolutions.options[0].innerText = '★ 读取角色配置失败';
                            }
                        }
                    );
                    repointLeft.innerText = '（剩余改点次数：读取中...）';
                    let cardInfo = {};
                    beginReadCardInfo(
                        g_roles[0].id,
                        cardInfo,
                        true,
                        () => {
                            repointLeft.innerText = `（剩余改点次数：${cardInfo.isCardInfo ? cardInfo.repointLeft : '未知'}）`;
                            repointLeft.title = cardInfo.isCardInfo ? cardInfo.points.join(', ') : '未知'
                        });
                }
                let repointLeft = pkConfigDiv.querySelector('#repointLeft');
                let switchSolutionLink = pkConfigDiv.querySelector('#switchSolutionLink');
                switchSolutionLink.onclick = (() => {
                    if (bindingSolutions.selectedIndex > 0) {
                        switchSolutionByName(null, bindingSolutions.value, refreshCurrentSolution);
                    }
                });
                refreshBindingSolutionList();

                let showConfigPanel = (localStorage.getItem(g_showConfigPanelStorageKey) == 'true');
                let ctrlToggleConfigPanel = pkConfigDiv.querySelector('#toggle-pk-config-panel');
                ctrlToggleConfigPanel.onclick = (() => {
                    localStorage.setItem(g_showConfigPanelStorageKey, showConfigPanel = !showConfigPanel);
                    initializeConfigPanel();
                });
                function initializeConfigPanel() {
                    if (showConfigPanel) {
                        ctrlToggleConfigPanel.firstElementChild.className = 'icon icon-chevron-sign-right';
                        ctrlToggleConfigPanel.title = "折叠设置面板";
                        ctrlToggleConfigPanel.previousElementSibling.firstElementChild.style.display = 'block';
                    }
                    else {
                        ctrlToggleConfigPanel.firstElementChild.className = 'icon icon-chevron-sign-left';
                        ctrlToggleConfigPanel.title = "展开设置面板";
                        ctrlToggleConfigPanel.previousElementSibling.firstElementChild.style.display = 'none';
                    }
                }
                initializeConfigPanel();

                let pkConfigPanel = pkConfigDiv.querySelector('#pk-config-panel');
                let indexRally = setupConfigCheckbox(
                    pkConfigPanel.querySelector('#indexRallyCheckbox'),
                    g_indexRallyStorageKey,
                    (checked) => { indexRally = checked; },
                    null);

                let keepPkRecord = setupConfigCheckbox(
                    pkConfigPanel.querySelector('#keepPkRecordCheckbox'),
                    g_keepPkRecordStorageKey,
                    (checked) => { pkRecordDiv.style.display = ((keepPkRecord = checked) ? 'block' : 'none'); },
                    null);

                let expandPkRecord = setupConfigCheckbox(
                    pkConfigPanel.querySelector('#expandPkRecordCheckbox'),
                    g_expandPkRecordStorageKey,
                    (checked) => {
                        expandPkRecord = checked;
                        pkRecordDiv.querySelectorAll('div.pk-history-item')?.forEach((p) => {
                            p.style.display = (checked ? 'block' : 'none');
                        });
                    },
                    null);

                let pkButtonEnabler = [];
                g_configMap.get('pkButtonProtection')?.value?.split(',')?.forEach((exp) => {
                    let ctrl = exp.split('=');
                    if (ctrl.length == 2 && (ctrl[0] = parseInt(ctrl[0])) >= 0 &&
                        pkButtonEnabler[ctrl[0]] == null && (ctrl[1] = ctrl[1].trim()).length > 0) {

                        let chk = document.createElement('input');
                        chk.type = 'checkbox';
                        chk.id = 'pkButtonEnabler-' + ctrl[0];
                        chk.style.marginLeft = '15px';
                        chk.setAttribute('btn-index', ctrl[0]);
                        chk.onchange = ((e) => {
                            let btn = pkListDiv.querySelectorAll(
                                'button.btn.btn-block.dropdown-toggle.fyg_lh30')[parseInt(e.currentTarget.getAttribute('btn-index'))];
                            if (btn != null) {
                                btn.disabled = e.currentTarget.checked ? '' : 'disabled';
                            }
                        });

                        let lbl = document.createElement('label');
                        lbl.setAttribute('for', chk.id);
                        lbl.style.marginLeft = '5px';
                        lbl.style.cursor = 'pointer';
                        lbl.innerText = ctrl[1];

                        pkConfigPanel.appendChild(chk);
                        pkConfigPanel.appendChild(lbl);

                        pkButtonEnabler[ctrl[0]] = chk;
                    }
                });
                function enablePkButtons() {
                    let btns = pkListDiv.querySelectorAll('button.btn.btn-block.dropdown-toggle.fyg_lh30');
                    pkButtonEnabler.forEach((chk, index) => {
                        let btn = btns[index];
                        if (btn != null) {
                            btn.disabled = chk.checked ? '' : 'disabled';
                        }
                    });
                }

                enablePkButtons();
                (new MutationObserver((mList) => {
                    for (let e of mList) {
                        if (e.addedNodes?.length > 0) {
                            enablePkButtons();
                            break;
                        }
                    }
                })).observe(pkListDiv, { childList : true });

                let pkDiv = document.querySelector('#pk_text');
                pkDiv.parentElement.insertBefore(pkConfigDiv, pkDiv);
                $('#solutionPanel').tooltip();

                let pkRecordDiv = document.createElement('div');
                pkRecordDiv.id = 'pk_record';
                pkRecordDiv.style.marginTop = '5px';
                pkRecordDiv.style.display = (keepPkRecord ? 'block' : 'none');
                pkDiv.parentElement.insertBefore(pkRecordDiv, pkDiv.nextSibling);

                let pkCount = 0;
                let lastPk = null;
                let lastPkTime = null;
                let pkObserver = new MutationObserver((mList) => {
                    function processPkText() {
                        if (indexRally) {
                            let turn_l = 0;
                            let turn_r = 0;
                            pkDiv.querySelectorAll('p.bg-default').forEach((e, i) => {
                                let myTurn = (e.parentElement.className.indexOf('fyg_tr') >= 0);
                                let rally = document.createElement('b');
                                rally.className = 'bg-default';
                                rally.innerText = (myTurn ? `${i + 1} （${++turn_l}）` : `（${++turn_r}） ${i + 1}`);
                                rally.style.float = (myTurn ? 'left' : 'right');
                                rally.style.padding = '0px 5px';
                                e.appendChild(rally);
                            });
                        }
                        if (keepPkRecord) {
                            let pkTime = getTimeStamp();
                            if (lastPk != null) {
                                let player = (lastPk.querySelector('div.col-md-7.fyg_tr > p > span.fyg_f18')?.innerText ?? '（Lv.∞×0 玩家）' + g_kfUser);
                                let opponent = (lastPk.querySelector('div.col-md-7.fyg_tl > p > span.fyg_f18')?.innerText ?? '独孤求败（神仙 Lv.1÷0）');
                                let pkLabel = lastPk.querySelector('div.with-icon.fyg_tc').cloneNode();
                                pkLabel.className = (pkLabel.className?.match(/ (alert-.+?) /)?.[1] ?? '');
                                pkLabel.style.padding = '8px';
                                pkLabel.style.marginBottom = '2px';
                                pkLabel.style.cursor = 'pointer';
                                pkLabel.style.fontSize = '18px';
                                pkLabel.style.fontWeight = 'bold';
                                pkLabel.innerHTML =
                                    `<div style="float:left;width:45%;text-align:right;">${player}</div>
                                     <div style="float:left;width:10%;text-align:center;color:#0000c0;">${lastPkTime.time}</div>
                                     <div style="text-align:left;">${opponent}</div>`;
                                pkLabel.onclick = ((e) => {
                                    let pkhis = e.currentTarget.nextSibling;
                                    pkhis.style.display = (pkhis.style.display == 'none' ? 'block' : 'none');
                                });

                                let pkRec = document.createElement('div');
                                pkRec.style.marginTop = '2px';
                                pkRec.appendChild(pkLabel);
                                pkRec.appendChild(lastPk);
                                pkRecordDiv.insertBefore(pkRec, pkRecordDiv.firstElementChild);

                                lastPk.style.display = (expandPkRecord ? 'block' : 'none');
                                $(`#${lastPk.id} .btn[data-toggle="tooltip"]`).tooltip();
                                lastPk = null;
                            }
                            if (lastPkTime != null) {
                                if (lastPkTime.date != pkTime.date) {
                                    let dateLabel = document.createElement('h3');
                                    dateLabel.innerText = lastPkTime.date;
                                    dateLabel.style.padding = '5px';
                                    dateLabel.style.marginTop = '2px';
                                    dateLabel.style.marginBottom = '2px';
                                    dateLabel.style.color = '#c0c0c0';
                                    dateLabel.style.backgroundColor = '#202020';
                                    dateLabel.style.textAlign = 'center';
                                    pkRecordDiv.insertBefore(dateLabel, pkRecordDiv.firstElementChild);
                                    lastPkTime = null;
                                }
                            }
                            if (pkDiv.querySelector('div.with-icon.fyg_tc') != null) {
                                lastPk = pkDiv.cloneNode(true);
                                lastPk.id = 'pk_history_' + pkCount++;
                                lastPk.className += ' pk-history-item';
                                lastPkTime = pkTime;
                            }
                        }
                    }

                    pkObserver.disconnect();
                    processPkText();
                    pkObserver.observe(pkDiv, { childList : true });
                });
                pkObserver.observe(pkDiv, { childList : true });

                pkAddinPanel.refreshBinding = refreshBindingSolutionList;
                pkAddinPanel.setAttribute('pk-text-hooked', 'true');
            }
        }, 200);
    }
    else if (window.location.pathname == g_guguzhenWish) {
        function getWishPoints() {
            let text = 'WISH';
            for (let i = 2; i <= g_wishpoolLength + 1; i++) {
                text += (' ' + (document.getElementById('xyx_' + ('0' + i).slice(-2))?.innerText ?? '0'));
            }
            return text;
        }

        let div = document.createElement('div');
        div.className = 'row';
        div.innerHTML =
            '<div class="panel panel-info"><div class="panel-heading">计算器许愿点设置 （' +
                '<a href="###" id="copyWishPoints">点击这里复制到剪贴板</a>）</div>' +
                '<input type="text" class="panel-body" id="calcWishPoints" readonly="true" ' +
                       'style="width:100%;border:none;outline:none;" value="" /></div>';

        let calcWishPoints = div.querySelector('#calcWishPoints');
        calcWishPoints.value = getWishPoints();

        let xydiv = document.getElementById('xydiv');
        xydiv.parentElement.parentElement.insertBefore(div, xydiv.parentElement.nextSibling);

        div.querySelector('#copyWishPoints').onclick = ((e) => {
            calcWishPoints.select();
            if (document.execCommand('copy')) {
                e.target.innerText = '许愿点设置已复制到剪贴板';
            }
            else {
                e.target.innerText = '复制失败，这可能是因为浏览器没有剪贴板访问权限，请进行手工复制';
            }
            setTimeout(() => { e.target.innerText = '点击这里复制到剪贴板'; }, 3000);
        });

        (new MutationObserver(() => {
            calcWishPoints.value = getWishPoints();
        })).observe(xydiv, { subtree : true , childList : true , characterData : true });

        if (g_configMap.get('makeTopWishOnly')?.value == 1) {
            let msgDiv = document.getElementById('mymessage');
            if (msgDiv != null) {
                (new MutationObserver((mList) => {
                    let btns = msgDiv.querySelectorAll('#mymessagehtml > button.btn.btn-lg.btn-block');
                    btns?.forEach((btn, index) => {
                        if (index != (btns.length - 1)) {
                            btn.style.display = 'none';
                        }
                    });
                })).observe(msgDiv, { subtree : true , childList : true });
            }
        }
    }
    else if (window.location.pathname == g_guguzhenGem) {
        let gemPollPeriod = (g_configMap.get('gemPollPeriod')?.value ?? 0);
        if (gemPollPeriod == 0) {
            return;
        }
        let timer = setInterval(() => {
            let gemdDiv = document.querySelector('#gemd');
            if (gemdDiv?.firstElementChild != null) {
                clearInterval(timer);

                let error = readGemWorkCompletionCondition();
                if (error > 0) {
                    addUserMessageSingle('宝石工坊完成条件设置', `在完成条件设置中发现 <b style="color:red;">${error}</b> 个错误，将使用默认值替换。`);
                }

                let unionDiv = document.createElement('div');
                unionDiv.className = 'row';
                unionDiv.innerHTML =
                    `<div class="panel panel-info"><div class="panel-heading" style="padding-bottom:10px;">
                         <div style="display:inline-block;margin-top:5px;"><b>咕咕镇工会（伪）</b></div>
                         <div style="float:right;">上次刷新：<span id="last-refresh-time" style="color:blue;margin-right:15px;"></span>` +
                             `距离下次刷新：<a href="###" id="refresh-count-down" style="text-decoration:underline;margin-right:15px;"
                                 title="立即刷新">00:00:00</a>定时器最大延迟：` +
                             `<a href="###" id="refresh-longest-delay" style="text-decoration:underline;margin-right:15px;"
                                 title="重新开始测量">00:00:00</a>` +
                             `<button type="button" id="btn-setup" style="width:60px;">设置</button></div></div>
                         <div class="panel-body"><div style="padding:10px;color:#00a0b0;font-size:15px;">
                             <b><span style="color:red;">★ 节约用电，人人有责。</span>这是一个浏览器挂机功能，对运行环境要求比较苛刻，在很多` +
                               `情形下都不能正常工作，这些情形包括但不限于浏览器窗口最小化、浏览器窗口被其它程序遮挡、本页签为非活动页签及屏幕保护程序` +
                               `运行、屏幕休眠、锁屏等等，不同浏览器的表现可能会有所不同。如果您不能接受这些常见情形所导致的运行问题，请谨慎使用本功能` +
                               `或经常检查网页运行状态以确保不会蒙受意外损失（刚刚是谁说的WebWorker？我闲但我没那么闲）。<hr>` +
                               `★ 根据初步测试，已知新版本的firefox（111）、chromium内核（chrome（109）、edge（109），需关闭页签休眠模式）浏览器` +
                               `在窗口最小化、被其它程序遮挡、本页签为非活动页签等情况下可能会产生最长1分钟的延迟，但并不排除发生更长时间延迟的可能性，` +
                               `在对较早浏览器版本的测试中曾出现长达6小时以上的延迟。其它浏览器尤其是移动端浏览器的行为尚待测试补充。</b><hr>` +
                            `<button type="button" id="btn-apply" style="width:60px;margin-right:5px;" disabled>实施</button>` +
                            `<button type="button" id="btn-restore" style="width:60px;" disabled>否决</button></div>
                         <div style="padding:10px;">
                             <input type="radio" class="condition-config" name="condition-config" id="condition-config-none" checked />
                                 <label for="condition-config-none" style="cursor:pointer;margin-left:5px;"
                                        title="手动控制开工及收工时机">BOSS至尊，工会退散</label><br>
                             <input type="radio" class="condition-config" name="condition-config" id="condition-config-program" />
                                 <label for="condition-config-program" style="cursor:pointer;margin-left:5px;"
                                        title="由挂机程序自动判定收工重开时机">HR强势，KPI考核（不考核任何KPI则强制最短工时轮班）</label></div>
                         <div style="padding-left:33px;">
                             <div style="display:block;border:1px solid lightgrey;border-radius:5px;margin-left:40;">
                                 <div style="display:block;padding:5px 15px;border-bottom:1px solid lightgrey;margin-bottom:10px;">
                                     <input type="radio" class="program-config" name="program-config" id="program-config-or" checked />
                                         <label for="program-config-or" style="cursor:pointer;margin-left:5px;margin-right:15px;"
                                                title="工作时长达到目标的前提下，任一选定项目达到预设进度即可收工重开">完成任一选定KPI项</label>
                                     <input type="radio" class="program-config" name="program-config" id="program-config-and" />
                                         <label for="program-config-and" style="cursor:pointer;margin-left:5px;margin-right:15px;"
                                                title="工作时长达到目标的前提下，选定项目全部达到各自预设进度才可收工重开">完成全部选定KPI项</label>
                                     <b>（已选定 <span id="kpi-count" style="color:#0000c0">0</span> 项）</b>
                                 </div><div style="padding:5px 15px;"><ul id="kpi-list" style="cursor:pointer;"></ul></div>
                             </div></div></div></div>`;

                let lastRefTime = unionDiv.querySelector('#last-refresh-time');
                let refCountDown = unionDiv.querySelector('#refresh-count-down');
                let refLongestDelay = unionDiv.querySelector('#refresh-longest-delay');
                let btnApply = unionDiv.querySelector('#btn-apply');
                let btnRestore = unionDiv.querySelector('#btn-restore');
                let btnSetup = unionDiv.querySelector('#btn-setup');
                let conditionConfig = unionDiv.querySelectorAll('input.condition-config');
                let programConfig = unionDiv.querySelectorAll('input.program-config');
                let kpiList = unionDiv.querySelector('#kpi-list');
                let kpiCount = unionDiv.querySelector('#kpi-count');

                function refreshTime() {
                    let ts = getTimeStamp();
                    lastRefTime.innerText = ts.date + ' ' + ts.time;
                }

                conditionConfig.forEach((op) => {
                    op.onchange = (() => { btnApply.disabled = btnRestore.disabled = ''; });
                });

                programConfig.forEach((op) => {
                    op.onchange = (() => { btnApply.disabled = btnRestore.disabled = ''; });
                });

                const highlightBackgroundColor = '#80c0f0';
                g_gemWorks.forEach((item) => {
                    let li = document.createElement('li');
                    li.setAttribute('original-item', item.name);
                    li.innerHTML = `<a href="###">${item.name} 【${item.completionProgress.toString() + item.unitSymbol}】</a>`;
                    li.onclick = selectGemWork;
                    kpiList.appendChild(li);
                });
                function selectGemWork(e) {
                    let count = parseInt(kpiCount.innerText);
                    if ($(this).attr('item-selected') != 1) {
                        $(this).attr('item-selected', 1);
                        $(this).css('background-color', highlightBackgroundColor);
                        count++;
                    }
                    else {
                        $(this).attr('item-selected', 0);
                        $(this).css('background-color', '');
                        count--;
                    }
                    kpiCount.innerText = count;
                    btnApply.disabled = btnRestore.disabled = '';
                }

                let currentGemConfig;
                function saveGemConfig(gemConfig) {
                    localStorage.setItem(g_gemConfigStorageKey, collectConfig(gemConfig));
                    btnApply.disabled = btnRestore.disabled = 'disabled';

                    function collectConfig(gemConfig) {
                        if (gemConfig == null) {
                            gemConfig = {
                                gemConfig : conditionConfig[0].checked ? 0 : 1,
                                programConfig : programConfig[0].checked ? 0 : 1,
                                kpiList : []
                            };
                            for (let i = kpiList.children?.length - 1; i >= 0; i--) {
                                if (kpiList.children[i].getAttribute('item-selected') == 1) {
                                    gemConfig.kpiList.push(kpiList.children[i].getAttribute('original-item'));
                                }
                            }
                        }
                        currentGemConfig = gemConfig;
                        return `${gemConfig.gemConfig}|${gemConfig.programConfig}` +
                               `${gemConfig.kpiList.length > 0 ? '|' + gemConfig.kpiList.join(',') : ''}`;
                    }
                }

                function loadGemConfig() {
                    let gemConfig = parseConfig();
                    let error = (gemConfig == null);
                    if (error) {
                        gemConfig = { gemConfig : 0 , programConfig : 0 , kpiList : [] };
                    }
                    else {
                        for (let i = gemConfig.kpiList.length - 1; i >= 0; i--) {
                            if (!g_gemWorkMap.has(gemConfig.kpiList[i])) {
                                gemConfig.kpiList.splice(i, 1);
                                error = true;
                            }
                        }
                    }
                    if (error) {
                        saveGemConfig(gemConfig);
                    }
                    representConfig(gemConfig);
                    btnApply.disabled = btnRestore.disabled = 'disabled';
                    return (currentGemConfig = gemConfig);

                    function parseConfig() {
                        let config = localStorage.getItem(g_gemConfigStorageKey)?.split('|');
                        if (config?.length >= 2 && config?.length <= 3) {
                            let gemConfig = {
                                gemConfig : parseInt(config[0]),
                                programConfig : parseInt(config[1]),
                                kpiList : config[2]?.split(',') ?? []
                            };
                            if (gemConfig.gemConfig >= 0 && gemConfig.gemConfig <= 1 &&
                                gemConfig.programConfig >= 0 && gemConfig.programConfig <= 1) {

                                return gemConfig;
                            }
                        }
                        return null;
                    }

                    function representConfig(gemConfig) {
                        conditionConfig[0].checked = !(conditionConfig[1].checked = (gemConfig.gemConfig == 1));
                        programConfig[0].checked = !(programConfig[1].checked = (gemConfig.programConfig == 1));
                        let count = 0;
                        for (let i = kpiList.children?.length - 1; i >= 0; i--) {
                            if (gemConfig.kpiList.indexOf(kpiList.children[i].getAttribute('original-item')) >= 0) {
                                kpiList.children[i].setAttribute('item-selected', 1);
                                kpiList.children[i].style.backgroundColor = highlightBackgroundColor;
                                count++;
                            }
                            else {
                                kpiList.children[i].setAttribute('item-selected', 0);
                                kpiList.children[i].style.backgroundColor = '';
                            }
                            kpiCount.innerText = count;
                        }
                    }
                }

                refCountDown.onclick = (() => { queueRefresh(0); });
                refLongestDelay.onclick = (() => { longestDelay = 0; refLongestDelay.innerText = '00:00:00'; });
                btnApply.onclick = (() => { saveGemConfig(null); shiftConfirm = true; queueRefresh(0); });
                btnRestore.onclick = (() => { loadGemConfig(); });
                btnSetup.onclick = (() => { modifyConfig('宝石工坊挂机设置', true, 'gemPollPeriod', 'gemWorkCompletionCondition'); });

                let div = gemdDiv.parentElement.parentElement;
                div.parentElement.insertBefore(unionDiv, div.nextSibling);

                loadGemConfig();

                let longestDelay = 0;
                let countDownTimer = null;
                function queueRefresh(timeSecond) {
                    if (countDownTimer != null) {
                        clearTimeout(countDownTimer);
                        countDownTimer = null;
                        refCountDown.innerText = '00:00:00';
                    }
                    if (timeSecond == 0) {
                        rgamd();
                    }
                    else if (timeSecond > 0) {
                        let lastTick = Date.now();
                        let fireTime = lastTick + (timeSecond * 1000);
                        let interval = fireTime;
                        timerRoutine(false);

                        function timerRoutine(setOnly) {
                            let now = Date.now();
                            let delay = (now - lastTick) - interval;
                            if (delay > longestDelay) {
                                longestDelay = delay;
                                refLongestDelay.innerText = formatTimeSpan(longestDelay - 999);
                            }

                            let etr = fireTime - now;
                            if (etr <= 0) {
                                countDownTimer = null;
                                rgamd();
                            }
                            else if (setOnly) {
                                lastTick = now;
                                countDownTimer = setTimeout(timerRoutine, interval = Math.min(etr, 1000), false);
                            }
                            else {
                                refCountDown.innerText = formatTimeSpan(etr);
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

                const changeShiftRequest = g_httpRequestMap.get('cgamd');
                function changeShift() {
                    function beginChangeShift() {
                        httpRequestBegin(
                            changeShiftRequest.request,
                            changeShiftRequest.data,
                            (response) => {
                                addUserMessageSingle('宝石工坊', response.responseText);
                                rgamd();
                            },
                            () => { queueRefresh(g_gemFailurePollPeriodSecond); },
                            () => { queueRefresh(g_gemFailurePollPeriodSecond); });
                    }

                    setTimeout(beginChangeShift, 100);
                }

                function collectGemWorkStatus(workDivs) {
                    let status = [];
                    g_gemWorks.forEach((template, i) => {
                        let lines = workDivs[i].innerHTML.replace('\r', '').replace('\n', '').split('<br>');
                        if (lines?.length >= 5 && template.nameRegex.regex.test(lines[template.nameRegex.line])) {
                            status.push(`${template.name}：${lines[template.progressRegex.line]
                                        .match(template.progressRegex.regex)?.[1]}${template.unitSymbol}`);
                        }
                    });
                    return (status.length > 0 ? status.join('，') : '休息日');
                }

                function calculateGemWork(template, workDiv, timeElapsed) {
                    let etc = [-1, 0];
                    let lines = workDiv.innerHTML.replace('\r', '').replace('\n', '').split('<br>');
                    if (lines?.length < 5 || !template.nameRegex.regex.test(lines[template.nameRegex.line])) {
                        return etc;
                    }
                    let progress = Number.parseFloat(lines[template.progressRegex.line].match(template.progressRegex.regex)?.[1]);
                    let unit = Number.parseFloat(lines[template.unitRegex.line].match(template.unitRegex.regex)?.[1]);
                    if (isNaN(progress) || isNaN(unit) || unit == 0) {
                        return etc;
                    }
                    if (template.precision == 0) {
                        etc[1] = Math.ceil(Math.trunc(progress + 1) / unit) - timeElapsed;
                    }
                    else if (Math.ceil(progress / unit) < timeElapsed) {
                        etc[1] = -1;
                    }
                    etc[0] = Math.ceil(template.completionProgress / unit) - timeElapsed;
                    if (etc[0] < 0) {
                        etc[0] = 0;
                    }
                    return etc;
                }

                let shiftConfirm = true;
                function updateGemWorks() {
                    refreshTime();
                    queueRefresh(-1);

                    let btn = gemdDiv.querySelector('div.col-sm-12 > button.btn.btn-block.btn-lg');
                    if (btn == null) {
                        queueRefresh(g_gemFailurePollPeriodSecond);
                        return;
                    }

                    let workTime = btn.innerText?.match(/^已开工(\d+)小时(\d+)分钟/);
                    let timeElapsed = parseInt(workTime?.[1]) * 60 + parseInt(workTime?.[2]);
                    let etr = g_gemMinWorktimeMinute - timeElapsed;

                    let checkList = null;
                    let checkCount = 0;
                    if (currentGemConfig.gemConfig == 1) {
                        if (isNaN(etr)) {
                            if (!shiftConfirm || confirm('宝石工坊尚未开工，是否开工？')) {
                                shiftConfirm = false;
                                changeShift();
                                return;
                            }
                            else {
                                conditionConfig[0].checked = !(conditionConfig[1].checked = false)
                                currentGemConfig.gemConfig = 0;
                            }
                        }
                        else if (etr <= 0) {
                            checkList = currentGemConfig.kpiList;
                            checkCount = (currentGemConfig.programConfig == 0 ? Math.min(1, checkList.length) : checkList.length);
                        }
                    }

                    let pollTime = (etr > 0 ? Math.min(etr, gemPollPeriod) : gemPollPeriod);
                    let shift = (checkList != null && checkCount == 0);

                    let workDivs = gemdDiv.querySelectorAll('div.col-sm-2 > div.fyg_f14.fyg_lh30');
                    for (let i = workDivs?.length - 1; i >= 0; i--) {
                        let result = '未开工';
                        if (i < g_gemWorks.length) {
                            let etc = calculateGemWork(g_gemWorks[i], workDivs[i], timeElapsed);
                            if (etc[0] > 0) {
                                if (etc[0] < pollTime) {
                                    pollTime = etc[0];
                                }
                                let h = Math.trunc(etc[0] / 60);
                                let m = etc[0] % 60;
                                result = `剩余 ${h == 0 ? '' : `${h} 小时 `}${m == 0 ? '' : `${m} 分`}`.trim();
                            }
                            else if (etc[0] == 0) {
                                if (!shift && checkList?.indexOf(g_gemWorks[i].name) >= 0) {
                                    shift = (--checkCount == 0);
                                }
                                result = `已完成`;
                                workDivs[i].className = workDivs[i].className.replace('info', 'danger');
                            }
                            result += '<br>';
                            if (etc[1] > 0) {
                                let h = Math.trunc(etc[1] / 60);
                                let m = etc[1] % 60;
                                result += `距下一整数 ${h == 0 ? '' : `${h} 小时 `}${m == 0 ? '' : `${m} 分`}`.trim();
                            }
                            else if (etc[1] < 0 || g_gemWorks[i].precision == 0) {
                                result += '进度已达上限';
                            }
                            else {
                                result += '&nbsp;';
                            }
                        }
                        workDivs[i].innerHTML += ('<br>' + result);
                    }
                    if (shift) {
                        if (!shiftConfirm || confirm('宝石工坊已达换班条件，是否换班？')) {
                            shiftConfirm = false;
                            addUserMessageSingle('宝石工坊', `准备换班，${workTime[0].substring(1)}，工作进度（${collectGemWorkStatus(workDivs)}）。`);
                            changeShift();
                            return;
                        }
                        else {
                            conditionConfig[0].checked = !(conditionConfig[1].checked = false)
                            currentGemConfig.gemConfig = 0;
                        }
                    }
                    shiftConfirm = false;
                    queueRefresh(pollTime * 60);
                }

                $(document).ajaxComplete((e, r) => {
                    if (r.status != 200) {
                        queueRefresh(g_gemFailurePollPeriodSecond);
                    }
                });

                let gemWorksObserver = new MutationObserver(() => {
                    gemWorksObserver.disconnect();
                    updateGemWorks();
                    gemWorksObserver.observe(gemdDiv, { subtree : true , childList : true , characterData : true });
                });

                updateGemWorks();
                gemWorksObserver.observe(gemdDiv, { subtree : true , childList : true , characterData : true });
            }
        }, 200);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // array utilities
    //
    ////////////////////////////////////////////////////////////////////////////////////////////////////

    // perform a binary search. array must be sorted, but no matter in ascending or descending order.
    // in this manner, you must pass in a proper comparer function for it works properly, aka, if the
    // array was sorted in ascending order, then the comparer(a, b) should return a negative value
    // while a < b or a positive value while a > b; otherwise, if the array was sorted in descending
    // order, then the comparer(a, b) should return a positive value while a < b or a negative value
    // while a > b, and in both, if a equals b, the comparer(a, b) should return 0. if you pass nothing
    // or null / null value as comparer, then you must make sure about that the array was sorted
    // in ascending order.
    //
    // in this particular case, we just want to check whether the array contains the value or not, we
    // don't even need to point out the first place where the value appears (if the array actually
    // contains the value), so we perform a simplest binary search and return an index (may not the
    // first place where the value appears) or a negative value (means value not found) to indicate
    // the search result.
    function searchElement(array, value, fnComparer) {
        if (array?.length > 0) {
            fnComparer ??= ((a, b) => a < b ? -1 : (a > b ? 1 : 0));
            let li = 0;
            let hi = array.length - 1;
            while (li <= hi) {
                let mi = ((li + hi) >> 1);
                let cr = fnComparer(value, array[mi]);
                if (cr == 0) {
                    return mi;
                }
                else if (cr > 0) {
                    li = mi + 1;
                }
                else {
                    hi = mi - 1;
                }
            }
        }
        return -1;
    }

    // perform a binary insertion. the array and comparer must exactly satisfy as it in the searchElement
    // function. this operation behaves sort-stable, aka, the newer inserting element will be inserted
    // into the position after any existed equivalent elements.
    function insertElement(array, value, fnComparer) {
        if (array != null) {
            fnComparer ??= ((a, b) => a < b ? -1 : (a > b ? 1 : 0));
            let li = 0;
            let hi = array.length - 1;
            while (li <= hi) {
                let mi = ((li + hi) >> 1);
                let cr = fnComparer(value, array[mi]);
                if (cr >= 0) {
                    li = mi + 1;
                }
                else {
                    hi = mi - 1;
                }
            }
            array.splice(li, 0, value);
            return li;
        }
        return -1;
    }

    // it's not necessary to have newArray been sorted, but the oldArray must be sorted since we are calling
    // searchElement. if there are some values should be ignored in newArray, the comparer(a, b) should be
    // implemented as return 0 whenever parameter a equals any of values that should be ignored.
    function findNewObjects(newArray, oldArray, findIndices, removeDupFromOldArray, fnComparer) {
        if (!removeDupFromOldArray) {
            oldArray = oldArray?.slice();
        }
        let newObjects = [];
        for (let i = newArray?.length - 1; i >= 0; i--) {
            let index = searchElement(oldArray, newArray[i], fnComparer);
            if (index < 0) {
                newObjects.unshift(findIndices ? i : newArray[i]);
            }
            else {
                oldArray.splice(index, 1);
            }
        }
        return newObjects;
    }
})();
