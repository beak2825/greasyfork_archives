// ==UserScript==
// @name         GuguTown Helper
// @name:zh-CN   咕咕镇助手
// @name:zh-TW   咕咕鎮助手
// @name:ja      咕咕镇助手
// @namespace    https://github.com/GuguTown/GuguTownHelper
// @homepage     https://github.com/GuguTown/GuguTownHelper
// @version      2.3.4
// @description  WebGame GuguTown Helper
// @description:zh-CN 气人页游 咕咕镇助手
// @description:zh-TW 氣人頁遊 咕咕鎮助手
// @description:ja オンラインゲーム 咕咕镇助手
// @author       paraii & zyxboy
// @match        https://www.guguzhen.com/*
// @match        https://www.momozhen.com/*
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/467866/GuguTown%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/467866/GuguTown%20Helper.meta.js
// ==/UserScript==
/* eslint-env jquery */
function gudaq(){
    'use strict'

    const g_version = '2.3.4 (RP)';
    const g_modiTime = '2023-06-03 18:00:00';

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // common utilities
    //
    ////////////////////////////////////////////////////////////////////////////////////////////////////

    const g_navigatorSelector = 'body > div > div.row > div.panel > div.panel-body > div';
    const g_kfUser = document.querySelector(g_navigatorSelector + ' > button.btn.btn-lg')?.innerText;
    if (!(g_kfUser?.length > 0)) {
        console.log('数据采集: 咕咕镇版本不匹配或正在测试');
        return;
    }
    console.log('数据采集: ' + g_kfUser);

    const g_guguzhenHome = '/fyg_index.php';
    const g_guguzhenBeach = '/fyg_beach.php';
    const g_guguzhenPK = '/fyg_pk.php';
    const g_guguzhenEquip = '/fyg_equip.php';
    const g_guguzhenWish = '/fyg_wish.php';
    const g_guguzhenGem = '/fyg_gem.php';
    const g_guguzhenShop = '/fyg_shop.php';

    const g_showSolutionPanelStorageKey = g_kfUser + '_showSolutionPanel';
    const g_indexRallyStorageKey = g_kfUser + '_indexRally';
    const g_keepPkRecordStorageKey = g_kfUser + '_keepPkRecord';
    const g_amuletGroupCollectionStorageKey = g_kfUser + '_amulet_Groups';
    const g_equipmentExpandStorageKey = g_kfUser + '_equipment_Expand';
    const g_equipmentStoreExpandStorageKey = g_kfUser + '_equipment_StoreExpand';
    const g_equipmentBGStorageKey = g_kfUser + '_equipment_BG';
    const g_beachForceExpandStorageKey = g_kfUser + '_beach_forceExpand';
    const g_beachBGStorageKey = g_kfUser + '_beach_BG';
    const g_gemConfigStorageKey = g_kfUser + '_gem_Config';
    const g_forgeHistoryStorageKey = g_kfUser + '_forgeHistory';
    const g_userDataStorageKeyConfig = [ g_kfUser, g_showSolutionPanelStorageKey, g_indexRallyStorageKey, g_keepPkRecordStorageKey,
                                         g_amuletGroupCollectionStorageKey, g_equipmentExpandStorageKey, g_equipmentStoreExpandStorageKey,
                                         g_equipmentBGStorageKey, g_beachForceExpandStorageKey, g_beachBGStorageKey, g_gemConfigStorageKey,
                                         g_forgeHistoryStorageKey ];

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

    const USER_STORAGE_RESERVED_SEPARATORS = /[:;,|=+*%!#$&?<>{}^`"\\\/\[\]\r\n\t\v\s]/;
    const USER_STORAGE_KEY_VALUE_SEPARATOR = ':';

    const g_userMessageDivId = 'user-message-div';
    const g_userMessageBtnId = 'user-message-btn';
    var g_msgCount = 0;
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
                document.querySelector('div.row.fyg_lh60.fyg_tr').parentNode.appendChild(div_row);

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
                    btn.setAttribute('onclick', `window.location.href='#${g_userMessageDivId}'`);
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
    const GuGuZhenRequest = {
        read : { method : 'POST' , url : '/fyg_read.php' },
        update : { method : 'POST' , url : '/fyg_click.php' },
        user : { method : 'GET' , url : g_guguzhenHome },
        beach : { method : 'GET' , url : g_guguzhenBeach },
        pk : { method : 'GET' , url : g_guguzhenPK },
        equip : { method : 'GET' , url : g_guguzhenEquip },
        wish : { method : 'GET' , url : g_guguzhenWish },
        gem : { method : 'GET' , url : g_guguzhenGem },
        shop : { method : 'GET' , url : g_guguzhenShop }
    };
    const MoMoZhenRequest = GuGuZhenRequest;
    const g_postHeader = { 'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8' /*, 'Cookie' : document.cookie*/ };
    const g_networkTimeoutMS = 120 * 1000;
    var g_httpRequests = [];
    function httpRequestBegin(request, queryString, fnLoad, fnError, fnTimeout) {
        let requestObj;
        const g_readUrl = window.location.origin + '/fyg_read.php'
        const g_postUrl = window.location.origin + '/fyg_click.php'
        requestObj = new XMLHttpRequest();
        requestObj.onload = requestObj.onerror = requestObj.ontimeout = httpRequestEventHandler;
        requestObj.open(request.method, window.location.origin + request.url);
        for (let name in g_postHeader) {
            requestObj.setRequestHeader(name, g_postHeader[name]);
        }
        requestObj.send(queryString);

        function httpRequestEventHandler(e) {
            switch (e.type) {
                case 'load':
                    if (fnLoad != null) {
                        fnLoad(e.currentTarget);
                    }
                    break;
                case 'error':
                    if (fnError != null) {
                        fnError(e.currentTarget);
                    }
                    break;
                case 'timeout':
                    if (fnTimeout != null) {
                        fnTimeout(e.currentTarget);
                    }
                    break;
            }
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
    function getRequestInfoAsync(name, location) {
        return new Promise((resolve) => {
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
    // beginGetRequestMap(null, () => { console.log(g_httpRequestMap); });
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
    var g_maxConcurrentRequests = ConcurrentRequestCount.default;
    var g_objectMoveRequestsCount = 0;
    var g_objectMoveTargetSiteFull = false;
    async function beginMoveObjects(objects, path, fnPostProcess, fnParams) {
        if (!g_objectMoveTargetSiteFull && objects?.length > 0) {
            ObjectMoveRequest[path] ??= await getRequestInfoAsync(ObjectMoveRequestLocation[path].name,
                                                                  ObjectMoveRequestLocation[path].location);
            if (ObjectMoveRequest[path] == null) {
                console.log('missing function:', ObjectMoveRequestLocation[path].name);
                return;
            }
            let ids = [];
            while (ids.length < g_maxConcurrentRequests && objects.length > 0) {
                let id = objects.pop();
                if (id >= 0) {
                    ids.push(id);
                }
            }
            if ((g_objectMoveRequestsCount = ids.length) > 0) {
                while (ids.length > 0) {
                    httpRequestBegin(
                        ObjectMoveRequest[path].request,
                        ObjectMoveRequest[path].data.replace('"+id+"', ids.shift()),
                        (response) => {
                            if (path != ObjectMovePath.store2beach && response.responseText != 'ok') {
                                g_objectMoveTargetSiteFull = true;
                                console.log(response.responseText);
                            }
                            if (--g_objectMoveRequestsCount == 0) {
                                beginMoveObjects(objects, path, fnPostProcess, fnParams);
                            }
                        });
                }
                return;
            }
        }
        g_objectMoveTargetSiteFull = false;
        if (fnPostProcess != null) {
            fnPostProcess(fnParams);
        }
    }

    const g_beach_pirl_verify_data = '85797';
    const g_store_pirl_verify_data = '124';
    const g_objectPirlRequest = g_httpRequestMap.get('pirl');
    var g_objectPirlRequestsCount = 0;
    function beginPirlObjects(storePirl, objects, fnPostProcess, fnParams) {
        if (objects?.length > 0) {
            let ids = [];
            while (ids.length < g_maxConcurrentRequests && objects.length > 0) {
                ids.push(objects.pop());
            }
            if ((g_objectPirlRequestsCount = ids.length) > 0) {
                while (ids.length > 0) {
                    httpRequestBegin(
                        g_objectPirlRequest.request,
                        g_objectPirlRequest.data.replace('"+id+"', ids.shift()).replace(
                            '"+pirlyz+"', storePirl ? g_store_pirl_verify_data : g_beach_pirl_verify_data),
                        (response) => {
                            if (!/\d+/.test(response.responseText.trim()) && response.responseText.indexOf('果核') < 0) {
                                console.log(response.responseText);
                            }
                            if (--g_objectPirlRequestsCount == 0) {
                                beginPirlObjects(storePirl, objects, fnPostProcess, fnParams);
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

    // roleInfo = [ roleId, roleName, [ equips ] ]
    function beginReadRoleInfo(roleInfo, fnPostProcess, fnParams) {
        function parseCarding(carding) {
            if (roleInfo != null) {
                let role = g_roleMap.get(carding.querySelector('div.text-info.fyg_f24.fyg_lh60')?.children[0]?.innerText);
                if (role != null) {
                    roleInfo.push(role.id);
                    roleInfo.push(role.name);
                    roleInfo.push(carding.querySelectorAll('div.row > div.fyg_tc > button.btn.fyg_mp3'));
                }
            }
        }
        let div = document.getElementById('carding');
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

    // haloInfo = [ haloPoints, haloSlots, [ haloItem1, haloItem2, ... ] ]
    function beginReadHaloInfo(haloInfo, fnPostProcess, fnParams) {
        httpRequestBegin(
            GuGuZhenRequest.read,
            'f=5',
            (response) => {
                if (haloInfo != null) {
                    let haloPS = response.responseText.match(/<h3>.+?(\d+).+?(\d+).+?<\/h3>/);
                    if (haloPS?.length == 3) {
                        haloInfo.push(parseInt(haloPS[1]));
                        haloInfo.push(parseInt(haloPS[2]));
                    }
                    else {
                        haloInfo.push(0);
                        haloInfo.push(0);
                    }
                    let halo = [];
                    for (let item of response.responseText.matchAll(/halotfzt2\((\d+)\)/g)) {
                        halo.push(item[1]);
                    }
                    haloInfo.push(halo);
                }
                if (fnPostProcess != null) {
                    fnPostProcess(fnParams);
                }
            });
    }

    function beginReadWishpool(points, misc, fnPostProcess, fnParams) {
        httpRequestBegin(
            GuGuZhenRequest.read,
            'f=19',
            (response) => {
                let a = response.responseText.split('#');
                if (misc != null) {
                    misc[0] = a[0];
                    misc[1] = a[1];
                }
                if (points != null) {
                    for (let i = a.length - 1; i >= 2; i--) {
                        points[i - 2] = a[i];
                    }
                }
                if (fnPostProcess != null) {
                    fnPostProcess(fnParams);
                }
            });
    }

    // userInfo = [ kfUser, grade, level, seashell, bvip, svip ]
    function beginReadUserInfo(userInfo, fnPostProcess, fnParams) {
        httpRequestBegin(
            GuGuZhenRequest.user,
            '',
            (response) => {
                if (userInfo != null) {
                    userInfo.push(g_kfUser);
                    userInfo.push(response.responseText.match(/<p.+?>\s*段位\s*<.+?>\s*(.+?)\s*<.+?<\/p>/)?.[1] ?? '');
                    userInfo.push(response.responseText.match(/<p.+?>\s*等级\s*<.+?>\s*(\d+).*?<.+?<\/p>/)?.[1] ?? '');
                    userInfo.push(response.responseText.match(/<p.+?>\s*贝壳\s*<.+?>\s*(\d+).*?<.+?<\/p>/)?.[1] ?? '');
                    userInfo.push(response.responseText.match(/<p.+?>\s*BVIP\s*<.+?>\s*(.+?)\s*<.+?<\/p>/)?.[1] ?? '');
                    userInfo.push(response.responseText.match(/<p.+?>\s*SVIP\s*<.+?>\s*(.+?)\s*<.+?<\/p>/)?.[1] ?? '');
                }
                if (fnPostProcess != null) {
                    fnPostProcess(fnParams);
                }
            });
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

    // deprecated
    const AMULET_TYPE_ID_FACTOR = 100000000000000;
    const AMULET_LEVEL_ID_FACTOR = 10000000000000;
    const AMULET_ENHANCEMENT_FACTOR = 1000000000000;
    const AMULET_BUFF_MAX_FACTOR = AMULET_ENHANCEMENT_FACTOR;
    // deprecated

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
        { index : -1 , name : '固定技能几率' , type : 2 , maxValue : 10 , unit : '%' , shortMark : 'SKL' },
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

    var g_amuletLevelIds = g_amuletDefaultLevelIds;
    var g_amuletTypeIds = g_amuletDefaultTypeIds;
    var g_amuletLevelNames = g_amuletDefaultLevelNames;
    var g_amuletTypeNames = g_amuletDefaultTypeNames;

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
                    let typeName = (node.getAttribute('data-original-title') ?? node.getAttribute('title'));
                    if (!/Lv.+?>\d+</.test(typeName)) {
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
                    text = text.replaceAll(meta.name, meta.shortMark);
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
                if ((delta = g_amuletBuffMap.get(tbuff[0]).index - g_amuletBuffMap.get(obuff[0]).index) != 0 ||
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
                        str += `${sp}${buff.shortMark}${keyValueSeparator}${ignoreMaxValue ? v : Math.min(v, buff.maxValue)}`;
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
            return (this.items[name] != null);
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
            for (let name in this.items) {
                delete this.items[name];
            }
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
            let groups = [];
            for (let name in this.items) {
                groups.push(this.items[name]);
            }
            return groups;
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

    // deprecated
    // 2023-05-04: new amulet items added
    function AmuletOld() {
        this.id = -1;
        this.type = -1;
        this.level = 0;
        this.enhancement = 0;
        this.buffCode = 0;
        this.text = null;

        this.reset = (() => {
            this.id = -1;
            this.type = -1;
            this.level = 0;
            this.enhancement = 0;
            this.buffCode = 0;
            this.text = null;
        });

        this.isValid = (() => {
            return (this.type >= 0 && this.type < g_amuletDefaultTypeNames.length && this.buffCode > 0);
        });

        this.fromCode = ((code) => {
            if (!isNaN(code)) {
                this.type = Math.trunc(code / AMULET_TYPE_ID_FACTOR) % 10;
                this.level = Math.trunc(code / AMULET_LEVEL_ID_FACTOR) % 10;
                this.enhancement = Math.trunc(code / AMULET_ENHANCEMENT_FACTOR) % 10;
                this.buffCode = code % AMULET_BUFF_MAX_FACTOR;
            }
            else {
                this.reset();
            }
            return (this.isValid() ? this : null);
        });

        this.fromBuffText = ((text) => {
            if (text?.length > 0) {
                let nb = text.split(' = ');
                if (nb.length == 2) {
                    this.id = -1;
                    this.type = (g_amuletTypeIds[nb[0].slice(g_amuletTypeIds.start, g_amuletTypeIds.end)] ??
                                 g_amuletDefaultTypeIds[nb[0].slice(g_amuletDefaultTypeIds.start, g_amuletDefaultTypeIds.end)]);
                    this.level = (g_amuletLevelIds[nb[0].slice(g_amuletLevelIds.start, g_amuletLevelIds.end)] ??
                                  g_amuletDefaultLevelIds[nb[0].slice(g_amuletDefaultLevelIds.start, g_amuletDefaultLevelIds.end)]);
                    this.enhancement = parseInt(nb[0].match(/\d+/)[0]);
                    this.buffCode = 0;
                    nb[1].replaceAll(/(\+)|( 点)|( %)/g, '').split(',').forEach((buff) => {
                        let nv = buff.trim().split(' ');
                        this.buffCode += ((100 ** (g_amuletBuffMap.get(nv[0]).index % 6)) * parseInt(nv[1]));
                    });
                    if (this.isValid()) {
                        this.text = nb[1];
                        return this;
                    }
                }
            }
            this.reset();
            return null;
        });

        this.fromNode = ((node) => {
            if (node?.nodeType == Node.ELEMENT_NODE) {
                if (this.fromBuffText(node.getAttribute('amulate-string'))?.isValid() &&
                    !isNaN(this.id = parseInt(node.getAttribute('onclick').match(/\d+/)?.[0]))) {

                    return this;
                }
                else if (node.className?.indexOf('fyg_mp3') >= 0) {
                    let typeName = (node.getAttribute('data-original-title') ?? node.getAttribute('title'));
                    if (!/Lv.+?>\d+</.test(typeName)) {
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

                            this.buffCode = 0;
                            this.text = '';
                            let attr = null;
                            let regex = /<p.*?>(.+?)<.*?>\+(\d+).*?<\/span><\/p>/g;
                            while ((attr = regex.exec(content))?.length == 3) {
                                let buffMeta = g_amuletBuffMap.get(attr[1]);
                                if (buffMeta != null) {
                                    this.buffCode += ((100 ** (buffMeta.index % 6)) * attr[2]);
                                    this.text += `${this.text.length > 0 ? ', ' : ''}${attr[1]} +${attr[2]} ${buffMeta.unit}`;
                                }
                            }
                            if (this.isValid()) {
                                node.setAttribute('amulate-string', this.formatBuffText());
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
            if (amulet?.isValid()) {
                this.id = amulet.id;
                this.type = amulet.type;
                this.level = amulet.level;
                this.enhancement = amulet.enhancement;
                this.buffCode = amulet.buffCode;
                this.text = amulet.text;
            }
            else {
                this.reset();
            }
            return (this.isValid() ? this : null);
        });

        this.getCode = (() => {
            if (this.isValid()) {
                return (this.type * AMULET_TYPE_ID_FACTOR +
                        this.level * AMULET_LEVEL_ID_FACTOR +
                        this.enhancement * AMULET_ENHANCEMENT_FACTOR +
                        this.buffCode);
            }
            return -1;
        });

        this.getBuff = (() => {
            let buffs = {};
            if (this.isValid()) {
                let code = this.buffCode;
                let type = this.type * 6;
                g_amuletBuffs.slice(type, type + 6).forEach((buff) => {
                    let v = (code % 100);
                    if (v > 0) {
                        buffs[buff.name] = v;
                    }
                    code = Math.trunc(code / 100);
                });
            }
            return buffs;
        });

        this.getTotalPoints = (() => {
            let points = 0;
            if (this.isValid()) {
                let code = this.buffCode;
                for(let i = 0; i < 6; i++) {
                    points += (code % 100);
                    code = Math.trunc(code / 100);
                }
            }
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
                this.text = '';
                let buffs = this.getBuff();
                for (let buff in buffs) {
                    this.text += `${this.text.length > 0 ? ', ' : ''}${buff} +${buffs[buff]} ${g_amuletBuffMap.get(buff).unit}`;
                }
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
                for (let buff in this.getBuff()) {
                    text = text.replaceAll(buff, g_amuletBuffMap.get(buff).shortMark);
                }
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
            return (other.buffCode - this.buffCode);
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
                if ((delta = g_amuletBuffMap.get(tbuff[0]).index - g_amuletBuffMap.get(obuff[0]).index) != 0 ||
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

    function AmuletGroupOld(persistenceString) {
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
                let buffs = amulet.getBuff();
                for (let buff in buffs) {
                    this.buffSummary[buff] = (this.buffSummary[buff] ?? 0) + buffs[buff];
                }
                return insertElement(this.items, amulet, (a, b) => a.compareTo(b, true));
            }
            return -1;
        });

        this.remove = ((amulet) => {
            if (this.isValid() && amulet?.isValid()) {
                let i = searchElement(this.items, amulet, (a, b) => a.compareTo(b, true));
                if (i >= 0) {
                    let buffs = amulet.getBuff();
                    for (let buff in buffs) {
                        this.buffSummary[buff] = (this.buffSummary[buff] ?? 0) - buffs[buff];
                        if (this.buffSummary[buff] <= 0) {
                            delete this.buffSummary[buff];
                        }
                    }
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
                    let buffs = amulet.getBuff();
                    for (let buff in buffs) {
                        this.buffSummary[buff] = (this.buffSummary[buff] ?? 0) - buffs[buff];
                        if (this.buffSummary[buff] <= 0) {
                            delete this.buffSummary[buff];
                        }
                    }
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
                            if (this.add((new AmuletOld()).fromCode(parseInt(items[i]))) < 0) {
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
                    let v = this.buffSummary[buff.name];
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
                    let v = this.buffSummary[buff.name];
                    if (v > 0) {
                        str += `${sp}${buff.shortMark}${keyValueSeparator}${ignoreMaxValue ? v : Math.min(v, buff.maxValue)}`;
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
                    if (this.buffSummary[buff.name] > 0) {
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

    function AmuletGroupCollectionOld(persistenceString) {
        this.items = {};
        this.itemCount = 0;

        this.count = (() => {
            return this.itemCount;
        });

        this.contains = ((name) => {
            return (this.items[name] != null);
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
            for (let name in this.items) {
                delete this.items[name];
            }
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
            let groups = [];
            for (let name in this.items) {
                groups.push(this.items[name]);
            }
            return groups;
        });

        this.parse = ((persistenceString) => {
            this.clear();
            if (persistenceString?.length > 0) {
                let groupStrings = persistenceString.split(AMULET_STORAGE_GROUP_SEPARATOR);
                let gl = groupStrings.length;
                for (let i = 0; i < gl; i++) {
                    if (!this.add(new AmuletGroupOld(groupStrings[i]))) {
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

    function amuletGroupStorageConvert() {
        if (localStorage.getItem(g_amuletGroupCollectionStorageKey) == null) {
            console.log('Begin convert amulet groups ...');
            let groups = (new AmuletGroupCollectionOld(localStorage.getItem(g_amuletGroupsStorageKey))).toArray();
            if (groups?.length > 0) {
                console.log(groups.length + ' amulet groups loaded');
                let ngs = new AmuletGroupCollection();
                groups.forEach((g, i) => {
                    console.log('amulet group #' + i + ' - ' + g.name + ' : ' + g.count() + ' amulets included');
                    let ng = new AmuletGroup();
                    ng.name = g.name;
                    g.items.forEach((a, j) => {
                        let na = (new Amulet()).fromBuffText(a.formatBuffText());
                        if (ng.add(na) < 0) {
                            console.log('amulet group #' + i + ' - ' + ng.name + ' : add amulet #' + j + ' failed');
                            console.log(na);
                        }
                    });
                    console.log('amulet group #' + i + ' - ' + ng.name + ' : ' + ng.count() + ' amulets converted');
                    if (!ngs.add(ng)) {
                        console.log('amulet group #' + i + ' - ' + ng.name + ' : add group failed');
                    }
                });
                console.log(ngs.count() + ' amulet groups converted');
                amuletSaveGroups(ngs);
            }
        }
    }
    amuletGroupStorageConvert();
    // deprecated

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
                    fnProgress(4, 1, loading.length);
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
                fnProgress(4, 2, ids.length);
            }
            beginMoveObjects(ids, ObjectMovePath.bag2store, beginLoad, ids.length);
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
                        fnProgress(4, 4, ids.length);
                    }
                    beginMoveObjects(ids, ObjectMovePath.store2bag, fnPostProcess, fnParams);
                }
                else {
                    if (fnProgress != null) {
                        fnProgress(4, 3, loading.length);
                    }
                    beginReadAmulets(null, store = [], null, beginLoad, 0);
                }
            }
            else if (fnPostProcess != null) {
                fnPostProcess(fnParams);
            }
        }
    }

    function beginMoveAmulets({ groupName, amulets, path, proc, params }) {
        let indices = amuletLoadGroup(groupName)?.findIndices(amulets)?.sort((a, b) => b - a);
        let ids = [];
        while (indices?.length > 0) {
            ids.push(amulets[indices.pop()].id);
        }
        beginMoveObjects(ids, path, proc, params);
    }

    function beginLoadAmuletGroupFromStore(amulets, groupName, fnPostProcess, fnParams) {
        if (amulets?.length > 0) {
            let store = amuletNodesToArray(amulets);
            beginMoveAmulets({ groupName : groupName, amulets : store, path : ObjectMovePath.store2bag,
                               proc : fnPostProcess, params : fnParams });
        }
        else {
            beginReadAmulets(null, amulets = [], null, beginMoveAmulets,
                             { groupName : groupName, amulets : amulets, path : ObjectMovePath.store2bag,
                               proc : fnPostProcess, params : fnParams });
        }
    }

    function beginUnloadAmuletGroupFromBag(amulets, groupName, fnPostProcess, fnParams) {
        if (amulets?.length > 0) {
            let bag = amuletNodesToArray(amulets);
            beginMoveAmulets({ groupName : groupName, amulets : bag, path : ObjectMovePath.bag2store,
                               proc : fnPostProcess, params : fnParams });
        }
        else {
            beginReadAmulets(amulets, null, null, beginMoveAmulets,
                             { groupName : groupName, amulets : amulets, path : ObjectMovePath.bag2store,
                               proc : fnPostProcess, params : fnParams });
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
    function propertyInfoParseNode(node) {
        function formatPropertyString(p) {
            return `${p.metaIndex},${p.level},${p.amount}`;
        }

        function parsePropertyString(s) {
            let a = s.split(',');
            console.log(s);
            return {
                isProperty : true,
                metaIndex : parseInt(a[0]),
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
                let title = (node.getAttribute('data-original-title') ?? node.getAttribute('title'))?.split(' ');
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
                            metaIndex : meta.index,
                            level : g_equipmentLevelStyleClass.indexOf(lv.substring(lv.indexOf('-') + 1)),
                            amount : parseInt(title?.[1]?.match(/\d+/)?.[0] ?? 0)
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
                },
                store);
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

    var g_equipmentLevelName = g_equipmentDefaultLevelName;
    function equipmentInfoParseNode(node, ignoreIllegalAttributes) {
        if (node?.nodeType == Node.ELEMENT_NODE) {
            let eq = node.getAttribute('equip-string')?.split(',');
            if (eq?.length >= 8 && g_equipMap.has(eq[0])) {
                return eq;
            }
            else if (node.className?.split(' ').length >= 2 && node.className.indexOf('fyg_mp3') >= 0) {
                let attrTitle = node.hasAttribute('data-original-title') ? 'data-original-title' : 'title';
                let title = node.getAttribute(attrTitle);
                let eqInfo = title?.match(/Lv.+?>\s*(\d+)\s*<.+?\/i>\s*(\d+)\s*<.+?<br>(.+)/);
                if (eqInfo?.length == 4) {
                    let name = eqInfo[3].trim();
                    let meta = (g_equipMap.get(name) ?? g_equipMap.get(name.substring(g_equipmentLevelName[0].length)));
                    if(meta==undefined){
                        let tempEqName,tempEqNameC;
                        let tempEqType=node.innerHTML;
                        if(tempEqType.indexOf('z21')>-1){tempEqType=1;tempEqName='NEWEQA';tempEqNameC='待更新的未知新武器'}
                        else if(tempEqType.indexOf('z22')>-1){tempEqType=2;tempEqName='NEWEQB';;tempEqNameC='待更新的未知新手饰'}
                        else if(tempEqType.indexOf('z23')>-1){tempEqType=3;tempEqName='NEWEQC';;tempEqNameC='待更新的未知新防具'}
                        else if(tempEqType.indexOf('z24')>-1){tempEqType=4;tempEqName='NEWEQD';;tempEqNameC='待更新的未知新耳饰'};
                        meta={
                            "index": tempEqType-1,
                            "name": tempEqNameC,
                            "type": tempEqType,
                            "attributes": [
                                {
                                    "attribute": {
                                        "index": 33,
                                        "type": 0,
                                        "name": "未知属性"
                                    },
                                    "factor": 0,
                                    "additive": 42
                                },
                                {
                                    "attribute": {
                                        "index": 33,
                                        "type": 0,
                                        "name": "未知属性"
                                    },
                                    "factor": 0,
                                    "additive": 42
                                },
                                {
                                    "attribute": {
                                        "index": 15,
                                        "type": 0,
                                        "name": "未知属性"
                                    },
                                    "factor": 0,
                                    "additive": 42
                                },
                                {
                                    "attribute": {
                                        "index": 33,
                                        "type": 0,
                                        "name": "未知属性"
                                    },
                                    "factor": 0,
                                    "additive": 42
                                }
                            ],
                            "shortMark": tempEqName,
                            "alias": tempEqNameC
                        };
                    };
                    name = meta?.shortMark;
                    if (name?.length > 0) {
                        let attr = node.getAttribute('data-content')?.match(/>\s*\d+\s?%\s*</g);
                        let lv = eqInfo[1];
                        let lvEx = eqInfo[2];
                        if ((ignoreIllegalAttributes || attr?.length > 0) && lv?.length > 0 && lvEx?.length > 0) {
                            let e = [ name, lv, meta.type < 2 ? lvEx : '0', meta.type < 2 ? '0' : lvEx,
                                     (attr?.[0]?.match(/\d+/)?.[0] ?? '0'),
                                     (attr?.[1]?.match(/\d+/)?.[0] ?? '0'),
                                     (attr?.[2]?.match(/\d+/)?.[0] ?? '0'),
                                     (attr?.[3]?.match(/\d+/)?.[0] ?? '0'),
                                     (/\[神秘属性\]/.test(node.getAttribute('data-content')) ? '1' : '0'),
                                     (node.getAttribute('onclick')?.match(/\d+/)?.[0] ?? '-1') ];
                            node.setAttribute(attrTitle, title.replace(/(Lv.+?>\s*\d+\s*)(<)/,
                                                                       `$1<span style="font-size:15px;">（${equipmentQuality(e)}%）</span>$2`));
                            node.setAttribute('equip-string', e.join(','));
                            return e;
                        }
                    }
                }
            }
        }
        return null;
    }

    function equipmentQuality(e) {
        let eq = (Array.isArray(e) ? e : equipmentInfoParseNode(e, true));
        if (eq?.length >= 9) {
            return parseInt(eq[4]) + parseInt(eq[5]) + parseInt(eq[6]) + parseInt(eq[7]) + (parseInt(eq[8]) * 100);
        }
        return -1;
    }

    function equipmentNodesToInfoArray(nodes, array, ignoreIllegalAttributes) {
        array ??= [];
        for (let i = nodes?.length - 1; i >= 0; i--) {
            let e = equipmentInfoParseNode(nodes[i], ignoreIllegalAttributes);
            if (e != null) {
                array.unshift(e);
            }
        }
        return array;
    }

    function equipmentInfoComparer(e1, e2) {
        let delta = g_equipMap.get(e1[0]).index - g_equipMap.get(e2[0]).index;
        for (let i = 1; i < 9 && delta == 0; delta = parseInt(e1[i]) - parseInt(e2[i++]));
        return delta;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //
    // object utilities
    //
    ////////////////////////////////////////////////////////////////////////////////////////////////////

    function objectGetLevel(e) {
        let eq = equipmentQuality(e);
        if (eq >= 0) {
            for (var i = g_equipmentLevelPoints.length - 1; i > 0 && eq < g_equipmentLevelPoints[i]; i--);
            return i;
        }
        else if((eq = e.isProperty ? e : propertyInfoParseNode(e))?.isProperty){
            return eq.level;
        }
        else if ((eq = (e.isAmulet ? e : (new Amulet()).fromNode(e)))?.isValid()) {
            return (eq.level + 2)
        }
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
        return -1;
    }

    function objectNodeComparer(e1, e2) {
        let eq1 = equipmentInfoParseNode(e1, true);
        let eq2 = equipmentInfoParseNode(e2, true);

        if (eq1 == null && eq2 == null) {
            return ((new Amulet()).fromNode(e1)?.compareTo((new Amulet()).fromNode(e2)) ?? 1);
        }
        else if (eq1 == null) {
            return 1;
        }
        else if (eq2 == null) {
            return -1;
        }
        return equipmentInfoComparer(eq1, eq2);
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
            let eqs = equipmentNodesToInfoArray(container);
            for (let i = eqs.length - 1; i >= 0 && equips.length > 0 && ids.length < maxCount; i--) {
                for (let j = equips.length - 1; j >= 0; j--) {
                    if (equipmentInfoComparer(eqs[i], equips[j]) == 0) {
                        equips.splice(j, 1);
                        ids.unshift(parseInt(eqs[i][9]));
                        break;
                    }
                }
            }
        }
        return ids;
    }

    function beginClearBag(bag, key, fnPostProcess, fnParams) {
        function beginClearBagObjects(objects) {
            beginMoveObjects(objects, ObjectMovePath.bag2store, fnPostProcess, fnParams);
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
         </div>`;

    var g_genericPopupContainer = null;
    function genericPopupInitialize() {
        if (g_genericPopupContainer == null && (g_genericPopupContainer = document.getElementById(g_genericPopupContainerId)) == null) {
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

    var g_genericPopupIncompletedTaskCount = 0;
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

    const g_switchSolutionRequests = {};
    async function switchBindingSolution(bindingString, fnPostProcess, fnParams) {
        if ((g_switchSolutionRequests.card ??= await getRequestInfoAsync('upcard', GuGuZhenRequest.equip)) != null) {
            g_switchSolutionRequests.halo ??= await getRequestInfoAsync('halosave', GuGuZhenRequest.equip);
            g_switchSolutionRequests.equip ??= await getRequestInfoAsync('puton', GuGuZhenRequest.equip);
        }
        if (g_switchSolutionRequests.card == null ||
            g_switchSolutionRequests.halo == null ||
            g_switchSolutionRequests.equip == null) {

            console.log('missing function:', g_switchSolutionRequests);
            alert('无法获取服务请求格式，可能的原因是咕咕镇版本不匹配或正在测试。');
            window.location.reload();
            return;
        }

        let binding = bindingString?.split(BINDING_NAME_SEPARATOR);
        let roleId = g_roleMap.get(binding?.[0]?.trim())?.id;
        let bindInfo = binding?.[1]?.split(BINDING_ELEMENT_SEPARATOR)
        if (roleId == null || bindInfo?.length != 6) {
            console.log('missins format:', bindingString);
            alert('无效的绑定信息，无法执行切换。');
            window.location.reload();
            return;
        }

        let bindingEquipments = bindInfo.slice(0, 4);
        let bindingHalos = bindInfo[4].split(',');
        let amuletGroups = bindInfo[5].split(',');

        function roleSetupCompletion() {
            httpRequestClearAll();
            genericPopupClose(true, true);

            if (fnPostProcess != null) {
                fnPostProcess(fnParams);
            }
        }

        function checkForRoleSetupCompletion() {
            if (genericPopupTaskCheckCompletion()) {
                // delay for the final state can be seen
                genericPopupTaskSetState(0);
                genericPopupTaskSetState(1);
                genericPopupTaskSetState(2);
                genericPopupTaskSetState(3);
                setTimeout(roleSetupCompletion, 200);
            }
        }

        function amuletLoadCompletion() {
            genericPopupTaskComplete(3);
            checkForRoleSetupCompletion();
        }

        let switchMethod = g_configMap.get('solutionSwitchMethod')?.value;
        function beginAmuletLoadGroups() {
            if (amuletGroups?.length > 0) {
                if (switchMethod == 0) {
                    genericPopupTaskSetState(3, `- 加载护符...（${amuletGroups?.length}）`);
                    beginLoadAmuletGroupFromStore(null, amuletGroups.shift(), beginAmuletLoadGroups, null);
                }
                else {
                    genericPopupTaskSetState(3, `- 加载护符...`);
                    beginLoadAmuletGroupsDiff(amuletGroups, amuletLoadProgress, amuletLoadCompletion, null);
                }
            }
            else {
                amuletLoadCompletion();
            }

            function amuletLoadProgress(total, current, amuletCount) {
                genericPopupTaskSetState(3, `- 加载护符...（${amuletCount} - ${Math.trunc(current * 100 / total)}%）`);
            }
        }

        function beginLoadAmulets() {
            genericPopupTaskSetState(2);
            genericPopupTaskComplete(2, equipmentOperationError > 0);

            if (amuletGroups?.length > 0) {
                if (switchMethod == 0) {
                    genericPopupTaskSetState(3, '- 清理饰品...');
                    beginClearBag(null, null, beginAmuletLoadGroups, null);
                }
                else {
                    beginAmuletLoadGroups();
                }
            }
            else {
                amuletLoadCompletion();
            }
        }

        let equipmentOperationError = 0;
        let putonRequestsCount;
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

        let currentEquipments = null;
        function beginPutonEquipments() {
            genericPopupTaskSetState(2, '- 检查装备...');
            let equipsToPuton = [];
            for (let i = 0; i < 4; i++) {
                let equipInfo = bindingEquipments[i].split(',');
                equipInfo.push(-1);
                if (equipmentInfoComparer(equipInfo, currentEquipments[i]) != 0) {
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
                        genericPopupTaskSetState(2, `- 穿戴装备...（${eqIds.length}）`);
                        putonEquipments(eqIds, beginLoadAmulets, null);
                    }
                    else {
                        console.log(equipsToPuton);
                        alert('有装备不存在，请重新检查绑定！');

                        httpRequestAbortAll();
                        roleSetupCompletion();
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
                    genericPopupTaskSetState(1, '- 设置光环...');
                    httpRequestBegin(
                        g_switchSolutionRequests.halo.request,
                        g_switchSolutionRequests.halo.data.replace('"+savearr+"', halo),
                        (response) => {
                            genericPopupTaskSetState(1);
                            genericPopupTaskComplete(1, response.responseText != 'ok');
                            checkForRoleSetupCompletion();
                        });
                    return;
                }
            }
            genericPopupTaskComplete(1);
            checkForRoleSetupCompletion();
        }

        function beginRoleSetup() {
            beginSetupHalo();
            beginPutonEquipments();
        }

        function beginSwitch(roleInfo) {
            function cancelSwitching() {
                httpRequestAbortAll();
                roleSetupCompletion();
            }

            if (!(roleInfo?.length > 0)) {
                alert('获取当前角色信息失败，无法执行切换。');
                window.location.reload();
                return;
            }

            currentEquipments = equipmentNodesToInfoArray(roleInfo[2]);

            genericPopupInitialize();
            genericPopupTaskListPopupSetup('切换中...', 300, [ '卡片', '光环', '装备', '饰品' ], cancelSwitching);
            genericPopupShowModal(false);

            if (roleId == roleInfo[0]) {
                genericPopupTaskComplete(0);
                beginRoleSetup();
            }
            else {
                genericPopupTaskSetState(0, '- 装备中...');
                httpRequestBegin(
                    g_switchSolutionRequests.card.request,
                    g_switchSolutionRequests.card.data.replace('"+id+"', roleId),
                    (response) => {
                        genericPopupTaskSetState(0);
                        if (response.responseText == 'ok' || response.responseText == '你没有这张卡片或已经装备中') {
                            genericPopupTaskComplete(0);
                            beginRoleSetup();
                        }
                        else {
                            genericPopupTaskComplete(0, true);
                            alert('卡片装备失败！');
                            cancelSwitching();
                        }
                    });
            }
        }

        let roleInfo = [];
        beginReadRoleInfo(roleInfo, beginSwitch, roleInfo);
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
        let conds = cond.value.split(',');
        let len = Math.min(conds.length, g_gemWorks.length);
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
        { index : 33 , type : 0 , name : '未知属性' }
    ];

    const g_equipments = [
        {
            index : -1,
            name : '待更新的未知新武器',
            type : 0,
            attributes : [ { attribute : g_equipAttributes[33] , factor : 1 , additive : 0 },
                           { attribute : g_equipAttributes[33] , factor : 1 , additive : 0 },
                           { attribute : g_equipAttributes[33] , factor : 1 , additive : 0 },
                           { attribute : g_equipAttributes[33] , factor : 1 , additive : 0 } ],
            shortMark : 'NEWEQA'
        },
        {
            index : -1,
            name : '待更新的未知新手饰',
            type : 1,
            attributes : [ { attribute : g_equipAttributes[33] , factor : 1 , additive : 0 },
                           { attribute : g_equipAttributes[33] , factor : 1 , additive : 0 },
                           { attribute : g_equipAttributes[33] , factor : 1 , additive : 0 },
                           { attribute : g_equipAttributes[33] , factor : 1 , additive : 0 } ],
            shortMark : 'NEWEQB'
        },
        {
            index : -1,
            name : '待更新的未知新防具',
            type : 2,
            attributes : [ { attribute : g_equipAttributes[33] , factor : 1 , additive : 0 },
                           { attribute : g_equipAttributes[33] , factor : 1 , additive : 0 },
                           { attribute : g_equipAttributes[33] , factor : 1 , additive : 0 },
                           { attribute : g_equipAttributes[33] , factor : 1 , additive : 0 } ],
            shortMark : 'NEWEQC'
        },
        {
            index : -1,
            name : '待更新的未知新耳饰',
            type : 3,
            attributes : [ { attribute : g_equipAttributes[33] , factor : 1 , additive : 0 },
                           { attribute : g_equipAttributes[33] , factor : 1 , additive : 0 },
                           { attribute : g_equipAttributes[33] , factor : 1 , additive : 0 },
                           { attribute : g_equipAttributes[33] , factor : 1 , additive : 0 } ],
            shortMark : 'NEWEQD'
        },
        {
            index : -1,
            name : '反叛者的刺杀弓',
            type : 0,
            attributes : [ { attribute : g_equipAttributes[0] , factor : 1 / 5 , additive : 30 },
                           { attribute : g_equipAttributes[15] , factor : 1 / 20 , additive : 10 },
                           { attribute : g_equipAttributes[13] , factor : 1 / 20 , additive : 10 },
                           { attribute : g_equipAttributes[16] , factor : 1 , additive : 0 } ],
            shortMark : 'ASSBOW'
        },
        {
            index : -1,
            name : '狂信者的荣誉之刃',
            type : 0,
            attributes : [ { attribute : g_equipAttributes[0] , factor : 1 / 5 , additive : 20 },
                           { attribute : g_equipAttributes[2] , factor : 1 / 5 , additive : 20 },
                           { attribute : g_equipAttributes[15] , factor : 1 / 20 , additive : 10 },
                           { attribute : g_equipAttributes[13] , factor : 1 / 20 , additive : 10 } ],
            shortMark : 'BLADE'
        },
        {
            index : -1,
            name : '陨铁重剑',
            type : 0,
            attributes : [ { attribute : g_equipAttributes[5] , factor : 20 , additive : 0 },
                           { attribute : g_equipAttributes[5] , factor : 20 , additive : 0 },
                           { attribute : g_equipAttributes[0] , factor : 1 / 5 , additive : 30 },
                           { attribute : g_equipAttributes[15] , factor : 1 / 20 , additive : 1 } ],
            merge : [ [ 0, 1 ], [ 2 ], [ 3 ] ],
            shortMark : 'CLAYMORE'
        },
        {
            index : -1,
            name : '幽梦匕首',
            type : 0,
            attributes : [ { attribute : g_equipAttributes[0] , factor : 1 / 5 , additive : 0 },
                           { attribute : g_equipAttributes[1] , factor : 1 / 5 , additive : 0 },
                           { attribute : g_equipAttributes[7] , factor : 4 , additive : 0 },
                           { attribute : g_equipAttributes[2] , factor : 1 / 5 , additive : 25 } ],
            shortMark : 'DAGGER'
        },
        {
            index : -1,
            name : '荆棘盾剑',
            type : 0,
            attributes : [ { attribute : g_equipAttributes[21] , factor : 1 / 15 , additive : 10 },
                           { attribute : g_equipAttributes[22] , factor : 1 / 15 , additive : 0 },
                           { attribute : g_equipAttributes[17] , factor : 1 , additive : 0 },
                           { attribute : g_equipAttributes[18] , factor : 1 , additive : 0 } ],
            shortMark : 'SHIELD'
        },
        {
            index : -1,
            name : '饮血魔剑',
            type : 0,
            attributes : [ { attribute : g_equipAttributes[0] , factor : 1 / 5 , additive : 50 },
                           { attribute : g_equipAttributes[13] , factor : 1 / 20 , additive : 10 },
                           { attribute : g_equipAttributes[23] , factor : 2 , additive : 0 },
                           { attribute : g_equipAttributes[21] , factor : 1 / 15, additive : 10 } ],
            shortMark : 'SPEAR'
        },
        {
            index : -1,
            name : '彩金长剑',
            type : 0,
            attributes : [ { attribute : g_equipAttributes[0] , factor : 1 / 5 , additive : 10 },
                           { attribute : g_equipAttributes[1] , factor : 1 / 5 , additive : 10 },
                           { attribute : g_equipAttributes[2] , factor : 1 / 5 , additive : 20 },
                           { attribute : g_equipAttributes[31] , factor : 1 / 20 , additive : 0 } ],
            shortMark : 'COLORFUL'
        },
        {
            index : -1,
            name : '光辉法杖',
            type : 0,
            attributes : [ { attribute : g_equipAttributes[1] , factor : 1 / 5 , additive : 0 },
                           { attribute : g_equipAttributes[1] , factor : 1 / 5 , additive : 0 },
                           { attribute : g_equipAttributes[1] , factor : 1 / 5 , additive : 0 },
                           { attribute : g_equipAttributes[14] , factor : 1 / 20 , additive : 0 } ],
            merge : [ [ 0, 1, 2 ], [ 3 ] ],
            shortMark : 'WAND'
        },
        {
            index : -1,
            name : '探险者短弓',
            type : 0,
            attributes : [ { attribute : g_equipAttributes[5] , factor : 10 , additive : 0 },
                           { attribute : g_equipAttributes[6] , factor : 10 , additive : 0 },
                           { attribute : g_equipAttributes[7] , factor : 2 , additive : 0 },
                           { attribute : g_equipAttributes[21] , factor : 1 / 15 , additive : 10 } ],
            shortMark : 'BOW'
        },
        {
            index : -1,
            name : '探险者短杖',
            type : 0,
            attributes : [ { attribute : g_equipAttributes[5] , factor : 10 , additive : 0 },
                           { attribute : g_equipAttributes[6] , factor : 10 , additive : 0 },
                           { attribute : g_equipAttributes[14] , factor : 1 / 20 , additive : 5 },
                           { attribute : g_equipAttributes[21] , factor : 1 / 15 , additive : 10 } ],
            shortMark : 'STAFF'
        },
        {
            index : -1,
            name : '探险者之剑',
            type : 0,
            attributes : [ { attribute : g_equipAttributes[5] , factor : 10 , additive : 0 },
                           { attribute : g_equipAttributes[6] , factor : 10 , additive : 0 },
                           { attribute : g_equipAttributes[16] , factor : 1 , additive : 0 },
                           { attribute : g_equipAttributes[21] , factor : 1 / 15 , additive : 10 } ],
            shortMark : 'SWORD'
        },
        {
            index : -1,
            name : '命师的传承手环',
            type : 1,
            attributes : [ { attribute : g_equipAttributes[1] , factor : 1 / 5 , additive : 1 },
                           { attribute : g_equipAttributes[14] , factor : 1 / 20 , additive : 1 },
                           { attribute : g_equipAttributes[9] , factor : 20 , additive : 0 },
                           { attribute : g_equipAttributes[18] , factor : 1 , additive : 0 } ],
            shortMark : 'BRACELET'
        },
        {
            index : -1,
            name : '秃鹫手环',
            type : 1,
            attributes : [ { attribute : g_equipAttributes[21] , factor : 1 / 15 , additive : 1 },
                           { attribute : g_equipAttributes[21] , factor : 1 / 15 , additive : 1 },
                           { attribute : g_equipAttributes[21] , factor : 1 / 15 , additive : 1 },
                           { attribute : g_equipAttributes[7] , factor : 2 , additive : 0 } ],
            merge : [ [ 0, 1, 2 ], [ 3 ] ],
            shortMark : 'VULTURE'
        },
        {
            index : -1,
            name : '海星戒指',
            type : 1,
            attributes : [ { attribute : g_equipAttributes[16] , factor : 1 / 2 , additive : 0 },
                           { attribute : g_equipAttributes[23] , factor : 1 / 2 , additive : 0 },
                           { attribute : g_equipAttributes[25] , factor : 4 / 5 , additive : 0 },
                           { attribute : g_equipAttributes[24] , factor : 4 / 5 , additive : 0 } ],
            shortMark : 'RING'
        },
        {
            index : -1,
            name : '噬魔戒指',
            type : 1,
            attributes : [ { attribute : g_equipAttributes[23] , factor : 1 / 2 , additive : 0 },
                           { attribute : g_equipAttributes[24] , factor : 4 / 5 , additive : 0 },
                           { attribute : g_equipAttributes[26] , factor : 20 / 25 , additive : 0,
                             calculate : (a, l, p) => Math.trunc(l * p / 100 * a.factor + p / 100 * a.additive) / 10 },
                           { attribute : g_equipAttributes[3] , factor : 70 / 100 , additive : 0,
                             calculate : (a, l, p) => Math.trunc(l * p / 100 * a.factor + p / 100 * a.additive) / 10 } ],
            shortMark : 'DEVOUR'
        },
        {
            index : -1,
            name : '探险者手环',
            type : 1,
            attributes : [ { attribute : g_equipAttributes[5] , factor : 10 , additive : 0 },
                           { attribute : g_equipAttributes[6] , factor : 10 , additive : 0 },
                           { attribute : g_equipAttributes[7] , factor : 2 , additive : 0 },
                           { attribute : g_equipAttributes[8] , factor : 10 , additive : 0 } ],
            shortMark : 'GLOVES'
        },
        {
            index : -1,
            name : '旅法师的灵光袍',
            type : 2,
            attributes : [ { attribute : g_equipAttributes[8] , factor : 10 , additive : 0 },
                           { attribute : g_equipAttributes[11] , factor : 60 , additive : 0 },
                           { attribute : g_equipAttributes[4] , factor : 1 / 5 , additive : 25 },
                           { attribute : g_equipAttributes[9] , factor : 50 , additive : 0 } ],
            shortMark : 'CLOAK'
        },
        {
            index : -1,
            name : '挑战斗篷',
            type : 2,
            attributes : [ { attribute : g_equipAttributes[4] , factor : 1 / 5 , additive : 50 },
                           { attribute : g_equipAttributes[9] , factor : 100 , additive : 0 },
                           { attribute : g_equipAttributes[18] , factor : 1 , additive : 0 },
                           { attribute : g_equipAttributes[20] , factor : 5 , additive : 0 } ],
            shortMark : 'CAPE'
        },
        {
            index : -1,
            name : '战线支撑者的荆棘重甲',
            type : 2,
            attributes : [ { attribute : g_equipAttributes[3] , factor : 1 / 5 , additive : 20 },
                           { attribute : g_equipAttributes[17] , factor : 1 , additive : 0 },
                           { attribute : g_equipAttributes[18] , factor : 1 , additive : 0 },
                           { attribute : g_equipAttributes[22] , factor : 1 / 15 , additive : 10 } ],
            shortMark : 'THORN'
        },
        {
            index : -1,
            name : '复苏战衣',
            type : 2,
            attributes : [ { attribute : g_equipAttributes[3] , factor : 1 / 5 , additive : 50 },
                           { attribute : g_equipAttributes[19] , factor : 5 , additive : 0 },
                           { attribute : g_equipAttributes[20] , factor : 5 , additive : 0 },
                           { attribute : g_equipAttributes[10] , factor : 20 , additive : 0 } ],
            shortMark : 'WOOD'
        },
        {
            index : -1,
            name : '探险者铁甲',
            type : 2,
            attributes : [ { attribute : g_equipAttributes[8] , factor : 20 , additive : 0 },
                           { attribute : g_equipAttributes[17] , factor : 1 , additive : 0 },
                           { attribute : g_equipAttributes[18] , factor : 1 , additive : 0 },
                           { attribute : g_equipAttributes[10] , factor : 10 , additive : 0 } ],
            shortMark : 'PLATE'
        },
        {
            index : -1,
            name : '探险者皮甲',
            type : 2,
            attributes : [ { attribute : g_equipAttributes[8] , factor : 25 , additive : 0 },
                           { attribute : g_equipAttributes[19] , factor : 2 , additive : 0 },
                           { attribute : g_equipAttributes[20] , factor : 2 , additive : 0 },
                           { attribute : g_equipAttributes[10] , factor : 6 , additive : 0 } ],
            shortMark : 'LEATHER'
        },
        {
            index : -1,
            name : '探险者布甲',
            type : 2,
            attributes : [ { attribute : g_equipAttributes[8] , factor : 25 , additive : 0 },
                           { attribute : g_equipAttributes[19] , factor : 2 , additive : 0 },
                           { attribute : g_equipAttributes[20] , factor : 2 , additive : 0 },
                           { attribute : g_equipAttributes[10] , factor : 6 , additive : 0 } ],
            shortMark : 'CLOTH'
        },
        {
            index : -1,
            name : '萌爪耳钉',
            type : 3,
            attributes : [ { attribute : g_equipAttributes[29] , factor : 17 / 2000 , additive : 0 },
                           { attribute : g_equipAttributes[30] , factor : 17 / 2000 , additive : 0 },
                           { attribute : g_equipAttributes[27] , factor : 1 / 30 , additive : 0 },
                           { attribute : g_equipAttributes[28] , factor : 1 / 30 , additive : 0 } ],
            shortMark : 'RIBBON'
        },
        {
            index : -1,
            name : '占星师的耳饰',
            type : 3,
            attributes : [ { attribute : g_equipAttributes[8] , factor : 5 , additive : 0 },
                           { attribute : g_equipAttributes[4] , factor : 1 / 5 , additive : 0 },
                           { attribute : g_equipAttributes[9] , factor : 20 , additive : 0 },
                           { attribute : g_equipAttributes[19] , factor : 2 , additive : 0 } ],
            shortMark : 'TIARA'
        },
        {
            index : -1,
            name : '猎魔耳环',
            type : 3,
            attributes : [ { attribute : g_equipAttributes[24] , factor : 2 / 5 , additive : 0 },
                           { attribute : g_equipAttributes[26] , factor : 2 / 25 , additive : 0 },
                           { attribute : g_equipAttributes[32] , factor : 2 / 25 , additive : 0 },
                           { attribute : g_equipAttributes[3] , factor : 3 / 50 , additive : 0 } ],
            shortMark : 'HUNT'
        },
        {
            index : -1,
            name : '探险者耳环',
            type : 3,
            attributes : [ { attribute : g_equipAttributes[8] , factor : 10 , additive : 0 },
                           { attribute : g_equipAttributes[19] , factor : 2 , additive : 0 },
                           { attribute : g_equipAttributes[20] , factor : 2 , additive : 0 },
                           { attribute : g_equipAttributes[10] , factor : 4 , additive : 0 } ],
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
    const defaultEquipAttributeCalculate = ((a, l, p) => Math.trunc((l * a.factor + a.additive) * (p / 10)) / 10);
    function defaultEquipmentNodeComparer(setting, eqKey, eq1, eq2) {
        let eqMeta = g_equipMap.get(eqKey);
        let delta = [];
        let quality = eq1[2] + eq1[3] + eq1[4] + eq1[5] - eq2[2] - eq2[3] - eq2[4] - eq2[5];
        let majorAdv = 0;
        let majorEq = 0;
        let majorDis = 0;
        let minorAdv = 0;

        eqMeta.attributes.forEach((attr, index) => {
            let calculator = (attr.calculate ?? defaultEquipAttributeCalculate);
            let d = calculator(attr, eq1[0], eq1[index + 1]) - calculator(attr, eq2[0], eq2[index + 1]);
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

    function formatEquipmentAttributes(e, itemSeparator) {
        let text = '';
        if (e?.length > 7) {
            itemSeparator ??= ', ';
            let sp = '';
            console.log(e[0]);
            g_equipMap.get(e[0])?.attributes.forEach((attr, index) => {
                text += `${sp}${attr.attribute.name} +${(attr.calculate ?? defaultEquipAttributeCalculate)
                                                             (attr, e[1], e[index + 4])}${attr.attribute.type == 0 ? '%' : ''}`;
                sp = itemSeparator;
            });
        }
        return text;
    }

    function equipmentVerify(node, e) {
        if ((e ??= equipmentInfoParseNode(node, false)) != null) {
            let error = 0;
            let attrs = node.getAttribute('data-content')?.match(/'>.+\+\d+\.?\d*%?.*?<span/g);
            if (attrs?.length == 4) {
                g_equipMap.get(e[0])?.attributes.forEach((attr, index) => {
                    let eBase = (attr.calculate ?? defaultEquipAttributeCalculate)(attr, parseInt(e[1]), parseInt(e[index + 4]));
                    let disp = attrs[index].match(/\d+\.?\d*/)?.[0];
                    if (eBase.toString() != disp) {
                        console.log(`${e[0]} Lv.${e[1]} #${index}: ${attrs[index].slice(2, -5)} ---> ${eBase}`);
                        error++;
                    }
                });
                return error;
            }
        }
        console.log(`BUG equip: ${node}`);
        return -1;
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
    // equipmentVerifyManual('噬魔戒指', 200, [90, 82, 99, 90], ['90', '131.2', '15.8', '12.6']);

    var g_useOldEquipName = false;
    var g_useThemeEquipName = false;
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

    const g_halos = [
        { index : -1 , id : 101 , name : '启程之誓' , points : 0 , shortMark : 'SHI' },
        { index : -1 , id : 102 , name : '启程之心' , points : 0 , shortMark : 'XIN' },
        { index : -1 , id : 103 , name : '启程之风' , points : 0 , shortMark : 'FENG' },
        { index : -1 , id : 104 , name : '等级挑战' , points : 0 , shortMark : 'TIAO' },
        { index : -1 , id : 105 , name : '等级压制' , points : 0 , shortMark : 'YA' },
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
        { index : -1 , id : 408 , name : '自信回头' , points : 100 , shortMark : 'ZI' }
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
            id : 'maxConcurrentRequests',
            name : `最大并发网络请求（${ConcurrentRequestCount.min} - ${ConcurrentRequestCount.max}）`,
            defaultValue : ConcurrentRequestCount.default,
            value : ConcurrentRequestCount.default,
            tips : '同时向服务器提交的请求的最大数量。过高的设置容易引起服务阻塞或被认定为DDOS攻击从而导致服务器停止服务（HTTP 503）。',
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
            name : '绑定方案切换方式（0：完全，1：差分）',
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
            id : 'openCardSequence',
            name : `一键翻牌次序（整数 ±(1 - 12) 组成的无重复序列或留空）`,
            defaultValue : '',
            value : '',
            tips : '一键翻牌时的开牌次序，此设置留空时（不可留有空格字符，空格不会被判定为空而会判定为随机元素）将不显示一键翻牌相关面板。序列中禁止出现绝对值' +
                   '重复的元素，负数表示排除某张牌，可出现在任意位置且不占位，排除个数须不大于3。由于最多只需翻开9张牌必定会出现三同色，所以正数及随机元素个数' +
                   '须不大于9，不足9时程序将在开牌时按需随机补足。单个元素也可设置为随机，只需将该元素设置为无内容、仅含空格和/或单个“?”即可。' +
                   '例：“?”=“ ? ”=“,”=“ , ”=“ ”=全随机；“-12”=排除绮，其余全随机；“-1,12,,6,-2,  , ? ,+5”=排除舞和默，依次翻开：绮、随机、薇、随机、' +
                   '随机、梦、随机到底。开牌过程中任意时刻出现三同色或错误即终止。',
            validate : ((value) => {
                let seq = value.split(',');
                let abs;
                let inc = 0;
                let exc = 0;
                let dup = [];
                for (let e of seq) {
                    if ((e = e.trim()).length == 0 || e == '?') {
                        if (++inc > 9) {
                            return false;
                        }
                        continue;
                    }
                    else if ((!/^(\+|-)?\d+$/.test(e) || (abs = Math.abs(e = parseInt(e))) < 1 || abs > 12 || dup[abs] != null) ||
                             (e < 0 && ++exc > 3) || (e > 0 && ++inc > 9)) {
                        return false;
                    }
                    dup[abs] = true;
                }
                return true;
            }),
            onchange : ((value) => {
                let seq = value.split(',');
                let abs;
                let inc = 0;
                let exc = 0;
                let dup = [];
                for (let e of seq) {
                    if ((e = e.trim()).length == 0 || e == '?') {
                        if (++inc > 9) {
                            return '';
                        }
                        continue;
                    }
                    else if ((!/^(\+|-)?\d+$/.test(e) || (abs = Math.abs(e = parseInt(e))) < 1 || abs > 12 || dup[abs] != null) ||
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
                   '可能是较为平衡的选择',
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
            name : `宝石工坊挂机轮询周期（1 - ${Math.min(g_gemPollPeriodMinute.max, g_gemMinWorktimeMinute)}分钟，0：禁用挂机）`,
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
        }
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

    function modifyConfig(configIds, title, reload) {
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
                         #config-table th.config-th-name { width:60%; }
                         #config-table th.config-th-button { width:15%; }
                         #config-table button.config-restore-value { width:48%; float:right; margin-left:1px; }
                         table tr.alt { background-color:${g_genericPopupBackgroundColorAlt}; } </style>
                 <div class="${g_genericPopupTopLineDivClass}"><table id="config-table">
                 <tr class="alt"><th class="config-th-name">配置项 （在项名称或值输入框上悬停查看说明）</th><th>值</th>
                 <th class="config-th-button"></th></tr></table><div>`;

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
            let tr = e.target.parentNode.parentNode.parentNode;
            let cfg = g_configMap.get(tr.getAttribute('config-item'));
            tr.style.color = ((cfg.validate?.call(null, e.target.value) ?? true) ? 'black' : 'red');
        }

        configTable.querySelectorAll('button.config-restore-value').forEach((btn) => { btn.onclick = restoreValue; });
        function restoreValue(e) {
            let input = e.target.parentNode.parentNode.children[1].children[0].children[0];
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

    var g_themeLoaded = false;
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

    initiatizeConfig();

    let g_messageBoxObserver = new MutationObserver((mList) => {
        g_messageBoxObserver.disconnect();
        readConfig();

        let btns = mList?.[0]?.target?.querySelectorAll('button.btn.btn-primary');
        btns?.forEach((btn) => {
            if (btn.getAttribute('onclick')?.indexOf('oclick(\'13\',\'1\')') >= 0) {
                if (g_configMap.get('singlePotRecovery')?.value == 0) {
                    btn.disabled = 'disabled';
                    btn.parentNode.innerHTML = btn.outerHTML + '<b style="margin-left:10px;color:red;">（已禁止）</b>';
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
                `<b><div id="user_data_import_tip" style="color:#0000c0;padding:15px 0px 10px;">
                 请将从其它系统中使用同一帐号导出的内容填入文本框中并执行导入操作</div></b>
                 <div style="height:330px;"><textarea id="user_data_persistence_string"
                 style="height:100%;width:100%;resize:none;"></textarea></div>`);

            let btnRead = genericPopupAddButton(
                '从全局存储中读取',
                0,
                ((e) => {
                    btnRead.disabled = btnImport.disabled = 'disabled';
                    genericPopupQuerySelector('#user_data_persistence_string').value = null;//GM_getValue(USER_DATA_xPORT_GM_KEY, '');
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
            btnRead.disabled = 'disabled';

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
                                    if (g_userDataStorageKeyConfig.indexOf(key) >= 0) {
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
                    btnRead.disabled = 'disabled';
                    btnImport.disabled = '';
                }),
                true);
            genericPopupAddCloseButton(80);

            genericPopupSetContentSize(400, 600, false);
            genericPopupShowModal(true);
        }

        function exportUserConfigData() {
            genericPopupSetContent(
                '导出内容',
                `<b><div id="user_data_export_tip" style="color:#0000c0;padding:15px 0px 10px;">
                 请勿修改任何导出内容，将其保存为纯文本在其它系统中使用相同的帐号执行导入操作</div></b>
                 <div style="height:330px;"><textarea id="user_data_persistence_string" readonly="true"
                 style="height:100%;width:100%;resize:none;"></textarea></div>`);

            let btnWrite = genericPopupAddButton(
                '写入全局存储',
                0,
                (() => {
                    btnWrite.disabled = btnCopy.disabled = 'disabled';
                    //GM_setValue(USER_DATA_xPORT_GM_KEY, genericPopupQuerySelector('#user_data_persistence_string').value);
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
            btnWrite.disabled = 'disabled';

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
                        btnWrite.disabled = 'disabled';
                        btnCopy.disabled = '';
                    }), 3000);
                }),
                true);
            genericPopupAddCloseButton(80);

            let userData = [];
            g_userDataStorageKeyConfig.forEach((item) => {
                let value = localStorage.getItem(item);
                if (value != null) {
                    userData.push(`${item}${USER_STORAGE_KEY_VALUE_SEPARATOR}${value}`);
                }
            });
            genericPopupQuerySelector('#user_data_persistence_string').value = userData.join(USER_DATA_xPORT_SEPARATOR);

            genericPopupSetContentSize(400, 600, false);
            genericPopupShowModal(true);
        }

        function clearUserData() {
            if (confirm('这将清除所有用户配置（护符组定义、卡片装备光环护符绑定、沙滩装备筛选配置等等）和数据，要继续吗？')) {
                g_userDataStorageKeyConfig.concat(g_userDataStorageKeyExtra).forEach((item) => {
                    localStorage.removeItem(item);
                });
                alert('用户配置和数据已全部清除！');
                window.location.reload();
            }
        }

        function onekeyOpenCard() {
            readConfig();

            let seq = g_configMap.get('openCardSequence')?.value;
            if (!(seq?.length > 0)) {
                return;
            }

            seq = seq.split(',');
            let abs;
            let inc = 0;
            let exc = 0;
            let rnd = [];
            let dup = [];
            let openSeq = [];
            for (let e of seq) {
                if ((e = e.trim()).length == 0 || e == '?') {
                    if (++inc > 9) {
                        alert('一键翻牌配置错误，请检查。');
                        return;
                    }
                    rnd.push(openSeq.length);
                    openSeq.push(0);
                    continue;
                }
                else if ((!/^(\+|-)?\d+$/.test(e) || (abs = Math.abs(e = parseInt(e))) < 1 || abs > 12 || dup[abs] != null) ||
                         (e < 0 && ++exc > 3) || (e > 0 && ++inc > 9)) {
                    alert('一键翻牌配置错误，请检查。');
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

            const openCardRequest = g_httpRequestMap.get('giftop');
            function beginOpenCard(sequence, fnPostProcess, fnParams) {
                if (sequence?.length > 0) {
                    let id = sequence.shift();
                    genericPopupUpdateProgressMessage(g_roles[id - 1].name + '...');
                    httpRequestBegin(
                        openCardRequest.request,
                        openCardRequest.data.replace('"+id+"', id),
                        (response) => {
                            if (response.responseText?.length > 0) {
                                sequence = null;
                                addUserMessageSingle('一键翻牌', response.responseText);
                            }
                            beginOpenCard(sequence, fnPostProcess, fnParams);
                        });
                }
                else if (fnPostProcess != null) {
                    fnPostProcess(fnParams);
                }
            }

            function closeProcess(fnPostProcess) {
                let asyncObserver = new MutationObserver(() => {
                    asyncObserver.disconnect();
                    if (fnPostProcess != null) {
                        fnPostProcess();
                    }
                });
                asyncObserver.observe(document.getElementById('gifsall'), { childList : true , subtree : true });

                // refresh card state
                indre(10, 'gifsall');
            }

            genericPopupShowProgressMessage();
            beginOpenCard(openSeq, closeProcess, genericPopupCloseProgressMessage);
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
            localStorage.setItem(g_forgeHistoryStorageKey, div.innerHTML);
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
            localStorage.setItem(g_forgeHistoryStorageKey, div.innerHTML);

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
                    px.parentNode.insertBefore(p0, px.nextElementSibling);
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
                configBtn.innerHTML = '设置';
                configBtn.style.height = '30px';
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
                px.parentNode.appendChild(globalDataBtnContainer);

                if (g_configMap.get('openCardSequence')?.value?.trim().length > 0) {
                    let openCardBtnContainer = document.createElement('div')
                    openCardBtnContainer.style.textAlign = 'right';
                    openCardBtnContainer.innerHTML =
                        '<span style="color:blue;font-size:16px;">★ 如果您选择使用一键翻牌功能，表明您完全接受最终结果，否则请选择手动翻牌</span>';

                    let openCardConfigBtn = document.createElement('button');
                    openCardConfigBtn.className = 'btn btn-lg';
                    openCardConfigBtn.innerHTML = '一键翻牌设置';
                    openCardConfigBtn.style.marginLeft = '15px';
                    openCardConfigBtn.style.marginRight = '3px';
                    openCardConfigBtn.onclick = (() => { modifyConfig(['openCardSequence'], '一键翻牌设置'); });
                    openCardBtnContainer.appendChild(openCardConfigBtn);

                    let openCardBtn = document.createElement('button');
                    openCardBtn.className = 'btn btn-lg';
                    openCardBtn.innerHTML = '一键翻牌';
                    openCardBtn.onclick = (() => { onekeyOpenCard(); });
                    openCardBtnContainer.appendChild(openCardBtn);
                    let cardDiv = document.querySelector('#gifsall');
                    cardDiv.parentNode.insertBefore(openCardBtnContainer, cardDiv.nextSibling.nextSibling);
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
                        btn.parentNode.appendChild(forgeHistoryBtn);
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
                loadTheme();

                let panel = document.getElementsByClassName('panel panel-primary')[1];
                let calcBtn = document.createElement('button');
                let calcDiv = document.createElement('div');

                calcBtn.innerText = '导出计算器';
                calcBtn.style.marginLeft = '3px';
                calcBtn.disabled = 'disabled';
                calcBtn.onclick = (() => {});

                panel.insertBefore(calcBtn, panel.children[0]);
                panel.insertBefore(calcDiv, calcBtn);

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
                    asyncObserver.observe(backpacksDiv, { childList : true , subtree : true });

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
                                equips.push(e.getAttribute('original-item').split(','));
                            }
                        });

                        if (equips.length > 0) {
                            genericPopupShowInformationTips(`丢弃装备...（${equips.length}）`, 0);
                            let ids = findEquipmentIds(storeObjects, equips);
                            if (ids.length > 0) {
                                beginMoveObjects(ids, ObjectMovePath.store2beach, refreshContainer, processAmulets);
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
                                genericPopupShowInformationTips(`转换果核...（${amulets.length}）`, 0);
                                if ((bag & 1) == 0) {
                                    bag++;
                                    let ids = findAmuletIds(storeObjects, amulets);
                                    if (ids.length > 0) {
                                        beginPirlObjects(true, ids, refreshContainer, pirlAmulets);
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
                                            beginMoveObjects(ids, ObjectMovePath.bag2store, refreshContainer, pirlAmulets);
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
                          '<li>护符表中被选中的护符会被销毁并转换为果核，此操作不可逆，请谨慎使用</li>' +
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

                    genericPopupQuerySelectorAll('button.btn-group-selection').forEach((btn) => { btn.onclick = batchSelection; });
                    function batchSelection(e) {
                        let selType = parseInt(e.target.getAttribute('select-type'));
                        let selCount = 0;
                        e.target.parentNode.querySelectorAll('input.equip-checkbox').forEach((chk) => {
                            if (chk.checked = (selType == 2 ? !chk.checked : selType == 0)) {
                                selCount++;
                            }
                        });
                        e.target.parentNode.firstElementChild.firstElementChild.innerText = selCount;
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
                    let storeEquips = equipmentNodesToInfoArray(backpacksDiv.querySelectorAll(storeObjectsQueryString));
                    storeEquips.sort((e1, e2) => {
                        if (e1[0] != e2[0]) {
                            return (g_equipMap.get(e1[0]).index - g_equipMap.get(e2[0]).index);
                        }
                        return -equipmentInfoComparer(e1, e2);
                    }).forEach((item) => {
                        let eqMeta = g_equipMap.get(item[0]);
                        let lv = objectGetLevel(item);
                        let tr = document.createElement('tr');
                        tr.style.backgroundColor = g_equipmentLevelBGColor[lv];
                        tr.innerHTML =
                            `<td><input type="checkbox" class="equip-checkbox equip-item" id="equip-${++eqIndex}"
                                        original-item="${item.join(',')}" />
                                 <label for="equip-${eqIndex}" style="margin-left:5px;cursor:pointer;">` +
                                       `${eqMeta.alias} - Lv.${item[1]} （攻.${item[2]} 防.${item[3]}） ` +
                                       `${item[8] == 1 ? ' - [ 神秘 ]' : ''}</label></td>
                             <td>${formatEquipmentAttributes(item, '</td><td>')}</td>`;
                        eq_selectors[eqMeta.type].appendChild(tr);
                    });

                    genericPopupQuerySelectorAll('input.equip-checkbox').forEach((e) => { e.onchange = equipCheckboxStateChange; });
                    function equipCheckboxStateChange(e) {
                        let countSpan = e.target.parentNode.parentNode.parentNode.parentNode.firstElementChild.firstElementChild;
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
                let userInfo = [];
                function restructEquipUI(fnPostProcess, fnParams) {
                    let asyncOperations = 2;
                    if (wishpool.length == 0) {
                        beginReadWishpool(wishpool, null, () => { asyncOperations--; });
                    }
                    else {
                        asyncOperations--;
                    }
                    if (userInfo.length == 0) {
                        beginReadUserInfo(userInfo, () => { asyncOperations--; });
                    }
                    else {
                        asyncOperations--;
                    }
                    let timer = setInterval(() => {
                        if (asyncOperations == 0) {
                            clearInterval(timer);
                            addCollapse(fnPostProcess, fnParams);
                        }
                    }, 200);
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
                                    let tempEQThis=btn.style.backgroundImage;
                                    let equipInfo = equipmentInfoParseNode(btn, true);
                                    let amulet = (new Amulet()).fromNode(btn);
                                    let propInfo = propertyInfoParseNode(btn);
                                    if(equipInfo==null&&tempEQThis.indexOf('/z2')>-1){
                                        let tempEQType,num1,num2,num3,num4,smcheck='0';
                                        let numtemp = btn.getAttribute("data-content").match(/\d+(\.\d)?/g).map(o => +o);
                                        let tempEqLv = btn.innerHTML.match(/\d+(\.\d)?/g).map(o => +o);
                                        let eqid = btn.getAttribute("onclick").match(/\d+(\.\d)?/g).map(o => +o);
                                        if(btn.getAttribute("data-content").indexOf('神秘')>-1){smcheck='1'};
                                        if(tempEQThis.indexOf('/z21')>-1){tempEQType='NEWEQA'}
                                        else if(tempEQThis.indexOf('/z22')>-1){tempEQType='NEWEQB'}
                                        else if(tempEQThis.indexOf('/z23')>-1){tempEQType='NEWEQC'}
                                        else if(tempEQThis.indexOf('/z24')>-1){tempEQType='NEWEQD'}
                                        equipInfo=[tempEQType, tempEqLv[3].toString() , '0' , '0' ,numtemp[1].toString() , numtemp[3].toString() , numtemp[5].toString() , numtemp[7].toString() , smcheck, eqid[0].toString()];
                                    };
                                    let styleClass = g_equipmentLevelStyleClass[objectGetLevel(equipInfo ?? amulet ?? propInfo)];
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

                                    if (equipInfo != null && btn0.lastChild.lastChild?.nodeType != Node.ELEMENT_NODE) {
                                        btn0.lastChild.lastChild?.remove();
                                    }

                                    let ineq;
                                    if (amulet != null) {
                                        ineq = 4;
                                    }
                                    else if (equipInfo != null) {
                                        ineq = g_equipMap.get(equipInfo[0]).type;
                                        btn0.style.minWidth = '240px';
                                        btn0.className += ' btn-equipment';

                                        // debug only
                                        if (equipmentVerify(btn, equipInfo) != 0) {
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
                                });

                                function inputAmuletGroupName(defaultGroupName) {
                                    let groupName = prompt('请输入护符组名称（不超过31个字符，请仅使用大、小写英文字母、数字、连字符、下划线及中文字符）',
                                                           defaultGroupName);
                                    if (amuletIsValidGroupName(groupName)) {
                                        return groupName;
                                    }
                                    else if (groupName != null) {
                                        alert('名称不符合命名规则，信息未保存。');
                                    }
                                    return null;
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

                                    let bagCells = 8 + parseInt(wishpool[0] ?? 0);
                                    if (userInfo?.[4]?.length > 0) {
                                        bagCells += 2;
                                    }
                                    if (userInfo?.[5]?.length > 0) {
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
                                            beginClearBag(backpacksDiv.querySelectorAll(bagObjectsQueryString),
                                                          e.target.getAttribute('amulet-key'),
                                                          refreshEquipmentPage,
                                                          showAmuletGroupsPopup);
                                        }

                                        let saveBagGroupBtn = document.createElement('button');
                                        saveBagGroupBtn.innerText = '保存为护符组';
                                        saveBagGroupBtn.style.float = 'right';
                                        saveBagGroupBtn.onclick = (() => {
                                            let groupName = inputAmuletGroupName('');
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
                                                `<a href="#popup_amulet_group_${i}">${groupArray[i].name} [${groupArray[i].count()}]</a>`;
                                            groupMenu.appendChild(mitem);

                                            let amuletDeleteGroupBtn = document.createElement('button');
                                            amuletDeleteGroupBtn.innerText = '删除';
                                            amuletDeleteGroupBtn.style.float = 'right';
                                            amuletDeleteGroupBtn.onclick = ((e) => {
                                                let groupName = e.target.parentNode.getAttribute('group-name');
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
                                                let groupName = e.target.parentNode.getAttribute('group-name');
                                                modifyAmuletGroup(groupName);
                                            });
                                            groupDiv.appendChild(amuletModifyGroupBtn);

                                            let importAmuletGroupBtn = document.createElement('button');
                                            importAmuletGroupBtn.innerText = '导入';
                                            importAmuletGroupBtn.style.float = 'right';
                                            importAmuletGroupBtn.onclick = ((e) => {
                                                let groupName = e.target.parentNode.getAttribute('group-name');
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
                                            renameAmuletGroupBtn.onclick = ((e) => {
                                                let oldName = e.target.parentNode.getAttribute('group-name');
                                                let groupName = inputAmuletGroupName(oldName);
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
                                                let groupName = e.target.parentNode.getAttribute('group-name');
                                                if (confirm(`用当前饰品栏内容替换 "${groupName}" 护符组预定内容吗？`)) {
                                                    beginSaveBagAsGroup(groupName, true);
                                                }
                                            });
                                            groupDiv.appendChild(updateAmuletGroupBtn);

                                            let unamuletLoadGroupBtn = document.createElement('button');
                                            unamuletLoadGroupBtn.innerText = '入仓';
                                            unamuletLoadGroupBtn.style.float = 'right';
                                            unamuletLoadGroupBtn.onclick = ((e) => {
                                                let groupName = e.target.parentNode.getAttribute('group-name');
                                                genericPopupShowProgressMessage('卸载中，请稍候...');
                                                beginUnloadAmuletGroupFromBag(
                                                    backpacksDiv.querySelectorAll(bagObjectsQueryString),
                                                    groupName, refreshEquipmentPage, showAmuletGroupsPopup);
                                            });
                                            groupDiv.appendChild(unamuletLoadGroupBtn);

                                            let amuletLoadGroupBtn = document.createElement('button');
                                            amuletLoadGroupBtn.innerText = '装备';
                                            amuletLoadGroupBtn.style.float = 'right';
                                            amuletLoadGroupBtn.onclick = ((e) => {
                                                let groupName = e.target.parentNode.getAttribute('group-name');
                                                genericPopupShowProgressMessage('加载中，请稍候...');
                                                beginLoadAmuletGroupFromStore(
                                                    backpacksDiv.querySelectorAll(storeObjectsQueryString),
                                                    groupName, refreshEquipmentPage, showAmuletGroupsPopup);
                                            });
                                            groupDiv.appendChild(amuletLoadGroupBtn);

                                            let groupInfoDiv = document.createElement('div');
                                            groupInfoDiv.innerHTML =
                                                `<hr><ul style="color:#000080;">${groupArray[i].formatBuffSummary('<li>', '</li>', '', true)}</ul>
                                                 <hr><ul>${groupArray[i].formatItems('<li>', '<li style="color:red;">', '</li>', '</li>', '')}</ul>
                                                 <hr><ul><li>AMULET ${groupArray[i].formatBuffShortMark(' ', ' ', false)} ENDAMULET</li></ul>`;
                                            groupDiv.appendChild(groupInfoDiv);

                                            amuletContainer.appendChild(groupDiv);
                                            li += groupArray[i].getDisplayStringLineCount();
                                        }
                                    }

                                    genericPopupQuerySelectorAll('.group-menu')?.forEach((e) => {
                                        e.appendChild(groupMenuDiv.cloneNode(true));
                                    });

                                    if (bagGroup != null) {
                                        gl++;
                                        li += bagGroup.getDisplayStringLineCount();
                                    }

                                    genericPopupAddButton('新建护符组', 0, modifyAmuletGroup, true);
                                    genericPopupAddButton(
                                        '导入新护符组',
                                        0,
                                        (() => {
                                            let groupName = inputAmuletGroupName('');
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
                                        '清空饰品栏',
                                        0,
                                        (() => {
                                            genericPopupShowProgressMessage('处理中，请稍候...');
                                            beginClearBag(backpacksDiv.querySelectorAll(bagObjectsQueryString),
                                                          null, refreshEquipmentPage, showAmuletGroupsPopup);
                                        }),
                                        true);
                                    genericPopupAddCloseButton(80);

                                    genericPopupSetContentSize(Math.min((li * 20) + (gl * 160) + 60, Math.max(window.innerHeight - 200, 400)),
                                                               Math.min(1000, Math.max(window.innerWidth - 100, 600)),
                                                               true);
                                    genericPopupShowModal(true);

                                    if (window.getSelection) {
                                        window.getSelection().removeAllRanges();
                                    }
                                    else if (document.getSelection) {
                                        document.getSelection().removeAllRanges();
                                    }
                                }

                                function modifyAmuletGroup(groupName) {
                                    function divHeightAdjustment(div) {
                                        div.style.height = (div.parentNode.offsetHeight - div.offsetTop - 3) + 'px';
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
                                        divHeightAdjustment(groupAmuletList.parentNode);
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
                                            let from = li.parentNode;
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

                                    amuletList.parentNode.oncontextmenu = groupAmuletList.parentNode.oncontextmenu = (() => false);
                                    amuletList.oncontextmenu = groupAmuletList.oncontextmenu = moveAmuletItem;
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
                                            (() => {
                                                if (!group.isValid()) {
                                                    alert('护符组内容存在错误，请检查！');
                                                    return;
                                                }

                                                let gn = inputAmuletGroupName(groupName);
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
                                        (() => {
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
                                                let gn = inputAmuletGroupName(displayName);
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

                                    divHeightAdjustment(amuletList.parentNode);
                                    divHeightAdjustment(groupAmuletList.parentNode);
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

                                function exportAmulets() {
                                    genericPopupSetContent(
                                        '护符导出',
                                        `<b><div id="amulet_export_tip" style="color:#0000c0;padding:15px 0px 10px;">
                                         请勿修改任何导出内容，将其保存为纯文本在其它相应工具中使用</div></b>
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

                                    let clearAmuletGroupBtn = document.createElement('button');
                                    clearAmuletGroupBtn.innerText = '清除护符组';
                                    clearAmuletGroupBtn.style.width = '100px';
                                    clearAmuletGroupBtn.style.marginRight = '1px';
                                    clearAmuletGroupBtn.onclick = (() => {
                                        if (confirm('要删除全部已保存的护符组信息吗？')) {
                                            amuletClearGroups();
                                            alert('已删除全部预定义护符组信息。');
                                        }
                                    });
                                    amuletButtonsGroupContainer.appendChild(clearAmuletGroupBtn);

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
                                            null, refreshEquipmentPage, () => { genericPopupClose(true, true); });
                                    });
                                    bagButtonsGroupContainer.appendChild(beginClearBagBtn);

                                    let amuletSaveGroupBtn = document.createElement('button');
                                    amuletSaveGroupBtn.innerText = '存为护符组';
                                    amuletSaveGroupBtn.style.width = '100px';
                                    amuletSaveGroupBtn.onclick = (() => {
                                        let groupName = inputAmuletGroupName('');
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
                    let solutionSelector = document.getElementById(g_bindingListSelectorId);
                    let bindingElements = solutionSelector?.value?.split(BINDING_NAME_SEPARATOR);
                    if (bindingElements?.length == 2) {
                        let solution = solutionSelector.options?.[solutionSelector.selectedIndex]?.innerText?.trim();
                        if (solution?.length > 0) {
                            let roleId = g_roleMap.get(bindingElements[0].trim()).id;
                            let udata = loadUserConfigData();
                            if (udata.dataBindDefault[roleId] != solution) {
                                udata.dataBindDefault[roleId] = solution;
                                saveUserConfigData(udata);
                            }
                            genericPopupInitialize();
                            genericPopupShowProgressMessage('读取中，请稍候...');
                            switchBindingSolution(solutionSelector.value, cding);
                            return;
                        }
                    }
                    alert('绑定信息读取失败，无法装备！');
                }

                const BINDING_NAME_DEFAULT = '(未命名)';
                function showBindingPopup() {
                    let role = g_roleMap.get(backpacksDiv.querySelector('div.row > div.col-md-3 > span.text-info.fyg_f24')?.innerText);
                    let cardInfos = backpacksDiv.querySelectorAll('.icon.icon-angle-down.text-primary');
                    let roleLv = cardInfos[0].innerText.match(/\d+/)[0];
                    let roleQl = cardInfos[1].innerText.match(/\d+/)[0];
                    let roleHs = cardInfos[2].innerText.match(/\d+/)[0];
                    let roleGv = (cardInfos[3]?.innerText.match(/\d+/)[0] ?? '0');
                    let rolePt = [];
                    for (let i = 1; i <= 6; i++) {
                        rolePt.push(document.getElementById('sjj' + i).innerText);
                    }
                    if (role == null || roleLv == null || roleQl == null || roleHs == null) {
                        alert('读取卡片信息失败，无法执行绑定操作！');
                        return;
                    }

                    let bind_info = null;
                    let udata = loadUserConfigData();
                    if (udata.dataBind[role.id] != null) {
                        bind_info = udata.dataBind[role.id];
                    }

                    genericPopupInitialize();
                    genericPopupShowProgressMessage('读取中，请稍候...');

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
                    const mainContent =
                        `<style> .equipment_label    { display:inline-block; width:15%; }
                                 .equipment_selector { display:inline-block; width:84%; color:#145ccd; float:right; }
                                  ul > li { cursor:pointer; } </style>
                         <div class="${g_genericPopupTopLineDivClass}" id="role_export_div" style="display:none;">
                         <div style="height:200px;">
                              <textarea id="role_export_string" readonly="true" style="height:100%;width:100%;resize:none;"></textarea></div>
                         <div style="padding:10px 0px 20px 0px;">
                              <button type="button" style="float:right;margin-left:1px;" id="hide_export_div">隐藏</button>
                              <button type="button" style="float:right;" id="copy_export_string">复制导出内容至剪贴板</button></div></div>
                         <div class="${g_genericPopupTopLineDivClass}">
                             <span class="equipment_label">武器装备：</span><select class="equipment_selector"></select><br><br>
                             <span class="equipment_label">手臂装备：</span><select class="equipment_selector"></select><br><br>
                             <span class="equipment_label">身体装备：</span><select class="equipment_selector"></select><br><br>
                             <span class="equipment_label">头部装备：</span><select class="equipment_selector"></select><br></div>
                         <div class="${g_genericPopupTopLineDivClass}"><div id="halo_selector"></div></div>
                         <div class="${g_genericPopupTopLineDivClass}" id="amulet_selector" style="display:block;"><div></div></div>`;

                    genericPopupSetFixedContent(fixedContent);
                    genericPopupSetContent(`${role.name} - ${roleLv} 级`, mainContent);

                    let eq_selectors = genericPopupQuerySelectorAll('select.equipment_selector');
                    let asyncOperations = 4;
                    let haloMax = 0;
                    let haloGroupItemMax = 0;

                    let store = [];
                    beginReadObjects(
                        null,
                        store,
                        () => {
                            let equipment = equipmentNodesToInfoArray(store);
                            equipmentNodesToInfoArray(cardingDiv.querySelectorAll(cardingObjectsQueryString), equipment);

                            equipment.sort((e1, e2) => {
                                if (e1[0] != e2[0]) {
                                    return (g_equipMap.get(e1[0]).index - g_equipMap.get(e2[0]).index);
                                }
                                return -equipmentInfoComparer(e1, e2);
                            });

                            equipment.forEach((item) => {
                                let eqMeta = g_equipMap.get(item[0]);
                                let lv = objectGetLevel(item);
                                let op = document.createElement('option');
                                op.style.backgroundColor = g_equipmentLevelBGColor[lv];
                                op.innerText =
                                    `${eqMeta.alias} Lv.${item[1]} （攻.${item[2]} 防.${item[3]}） - ${item[4]}% ${item[5]}% ` +
                                    `${item[6]}% ${item[7]}% ${item[8] == 1 ? ' - [ 神秘 ]' : ''}`;
                                op.title =
                                    `Lv.${item[1]} - ${item[8] == 1 ? '神秘' : ''}${g_equipmentLevelName[lv]}装备\n` +
                                    `${formatEquipmentAttributes(item, '\n')}`;
                                op.value = item.slice(0, -1).join(',');
                                eq_selectors[eqMeta.type].appendChild(op);
                            });

                            eq_selectors.forEach((eqs) => {
                                eqs.onchange = equipSelectionChange;
                                equipSelectionChange({ target : eqs });
                            });
                            function equipSelectionChange(e) {
                                for (var op = e.target.firstChild; op != null && op.value != e.target.value; op = op.nextSibling);
                                e.target.title = (op?.title ?? '');
                                e.target.style.backgroundColor = (op?.style.backgroundColor ?? 'white');
                            }
                            asyncOperations--;
                        },
                        null);

                    let currentHalo;
                    beginReadHaloInfo(
                        currentHalo = [],
                        () => {
                            haloMax = currentHalo[0];
                            let haloInfo =
                                `天赋点：<span style="color:#0000c0;"><span id="halo_points">0</span> / ${haloMax}</span>，
                                 技能位：<span style="color:#0000c0;"><span id="halo_slots">0</span> / ${roleHs}</span>
                                 <b id="halo_errors" style="display:none;color:red;margin-left:15px;">（光环天赋点数 / 角色卡片技能位不足）</b>`;
                            let haloSelector = genericPopupQuerySelector('#halo_selector');
                            haloSelector.innerHTML =
                                `<style> .halo_group { display:block; width:25%; float:left; text-align:center; border-left:1px solid grey; }
                                         div > a { display:inline-block; width:90px; } </style>
                                 <div>${haloInfo}</div>
                                 <p></p>
                                 <div style="display:table;">
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
                                haloSlots.style.color = (hs <= roleHs ? '#0000c0' : 'red');
                                haloErrors.style.display = (hp <= haloMax && hs <= roleHs ? 'none' : 'inline-block');
                            }

                            haloPoints = genericPopupQuerySelector('#halo_points');
                            haloSlots = genericPopupQuerySelector('#halo_slots');
                            haloErrors = genericPopupQuerySelector('#halo_errors');
                            $('.halo_item').each(function(i, e) {
                                $(e).on('click', selector_halo);
                                $(e).attr('original-item', $(e).text().split(' ')[0]);
                            });
                            asyncOperations--;
                        },
                        null);

                    if (wishpool.length == 0) {
                        beginReadWishpool(wishpool, null, () => { asyncOperations--; }, null);
                    }
                    else {
                        asyncOperations--;
                    }
                    if (userInfo.length == 0) {
                        beginReadUserInfo(userInfo, () => { asyncOperations--; });
                    }
                    else {
                        asyncOperations--;
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
                        let h = parseInt(haloMax);
                        if (sum <= h && halo.length <= parseInt(roleHs)) {
                            let roleInfo = [ role.shortMark, roleLv, userInfo[2], roleHs, roleQl ];
                            if (role.hasG) {
                                roleInfo.splice(1, 0, 'G=' + roleGv);
                            }

                            let amuletArray = [];
                            $('.amulet_item').each(function(i, e) {
                                if ($(e).attr('item-selected') == 1) {
                                    amuletArray[parseInt(e.lastChild.innerText) - 1] = ($(e).attr('original-item'));
                                }
                            });

                            let eqs = [];
                            eq_selectors.forEach((eq) => { eqs.push(eq.value); });

                            return [ roleInfo, wishpool.slice(-14), amuletArray, rolePt, eqs, halo ];
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
                                let a = eq.split(',');
                                a.splice(2, 2);
                                exp.push(a.join(' '));
                            });

                            let halo = [ info[5].length ];
                            info[5].forEach((h) => {
                                halo.push(g_haloMap.get(h).shortMark);
                            });
                            exp.push(halo.join(' '));

                            return exp.join('\n') + '\n';
                        }
                        else {
                            alert('有装备未选或光环天赋选择错误！');
                        }
                        return null;
                    }

                    function unbindAll() {
                        if (confirm('这将清除本卡片全部绑定方案，继续吗？')) {
                            let udata = loadUserConfigData();
                            if (udata.dataBind[role.id] != null) {
                                delete udata.dataBind[role.id];
                            }
                            saveUserConfigData(udata);
                            bindingName.value = BINDING_NAME_DEFAULT;
                            bindingList.innerHTML = '';
                            refreshBindingSelector(role.id);
                            genericPopupShowInformationTips('解除全部绑定成功', 5000);
                        }
                    };

                    function deleteBinding() {
                        if (validateBindingName()) {
                            bindings = [];
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
                                    udata.dataBind[role.id] = bindings.join(BINDING_SEPARATOR);
                                    bindingName.value = bindingList.children[0].innerText;
                                    bi = bindingList.children[0].getAttribute('original-item');
                                }
                                else if(udata.dataBind[role.id] != null) {
                                    delete udata.dataBind[role.id];
                                    bindingName.value = BINDING_NAME_DEFAULT;
                                }
                                saveUserConfigData(udata);
                                refreshBindingSelector(role.id);
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
                                let bind_info = [ info[4][0], info[4][1], info[4][2], info[4][3],
                                                  info[5].join(','), info[2].join(',') ].join(BINDING_ELEMENT_SEPARATOR);
                                let newBinding = true;
                                bindings = [];
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
                                udata.dataBind[role.id] = bindings.join(BINDING_SEPARATOR);
                                saveUserConfigData(udata);
                                refreshBindingSelector(role.id);
                                genericPopupShowInformationTips(bindingName.value + '：绑定成功', 5000);
                            }
                            else {
                                alert('有装备未选或光环天赋选择错误！');
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
                                haloSlots.style.color = (hs <= roleHs ? '#0000c0' : 'red');
                                haloErrors.style.display = (hp <= haloMax && hs <= roleHs ? 'none' : 'inline-block');
                            }
                            selectedAmuletGroupCount = 0;
                            if (elements.length > 5 && amuletCount != null) {
                                let ac = 0;
                                let v = elements[5].split(',');
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
                    let amuletGroups = amuletLoadGroups();
                    let selectedAmuletGroupCount = 0;
                    let bagCells = 8;

                    let amuletGroupCount = (amuletGroups?.count() ?? 0);
                    if (amuletGroupCount > 0) {
                        amuletContainer.innerHTML =
                            '护符组：已选定 <span id="amulet_count">0 / 0</span> 个护符' +
                            '<span style="float:right;margin-right:5px;">加载顺序</span><p /><ul></ul>';
                        amuletCount = genericPopupQuerySelector('#amulet_count');
                        amuletCount.style.color = 'blue';
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
                                '<li>要定义护符组，您需要前往 [ <b style="color:#0000c0;">我的角色 → 武器装备</b> ] 页面，' +
                                    '并在其中使用将饰品栏内容 [ <b style="color:#0000c0;">存为护符组</b> ] 功能，' +
                                    '或在 [ <b style="color:#0000c0;">管理护符组</b> ] 相应功能中进行定义。</li></ul>';
                    }

                    let bindings = null;
                    if (bind_info != null) {
                        bindings = bind_info.split(BINDING_SEPARATOR).sort((a, b) => {
                            a = a.split(BINDING_NAME_SEPARATOR);
                            b = b.split(BINDING_NAME_SEPARATOR);
                            a = a.length > 1 ? a[0] : BINDING_NAME_DEFAULT;
                            b = b.length > 1 ? b[0] : BINDING_NAME_DEFAULT;
                            return a < b ? -1 : 1;
                        });
                    }
                    else {
                        bindings = [];
                    }

                    bindings.forEach((item) => {
                        let elements = item.split(BINDING_NAME_SEPARATOR);
                        let binding = elements[elements.length - 1].split(BINDING_ELEMENT_SEPARATOR);
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
                            elements[elements.length - 1] = binding.join(BINDING_ELEMENT_SEPARATOR);
                        }

                        let op = document.createElement('li');
                        op.className = 'binding-name';
                        op.innerText = (elements.length > 1 ? elements[0] : BINDING_NAME_DEFAULT);
                        op.setAttribute('original-item', elements[elements.length - 1]);
                        bindingList.appendChild(op);
                    });

                    let timer = setInterval(() => {
                        if (asyncOperations == 0) {
                            clearInterval(timer);
                            httpRequestClearAll();

                            bagCells += parseInt(wishpool[0] ?? 0);
                            if (userInfo?.[4]?.length > 0) {
                                bagCells += 2;
                            }
                            if (userInfo?.[5]?.length > 0) {
                                bagCells += 5;
                            }
                            if (amuletCount != null) {
                                amuletCount.innerText = '0 / ' + bagCells;
                                amuletCount.style.color = 'blue';
                            }

                            let solutionSelector = document.getElementById(g_bindingListSelectorId);
                            let selectedOption = solutionSelector?.options?.[solutionSelector.selectedIndex];
                            if (selectedOption != null) {
                                bindingName.value = selectedOption.innerText;
                                representBinding(selectedOption.value?.split(BINDING_NAME_SEPARATOR)?.[1]);
                            }
                            else if (bindingList.children.length > 0) {
                                bindingName.value = bindingList.children[0].innerText;
                                representBinding(bindingList.children[0].getAttribute('original-item'));
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
                                                                                  + (amuletGroupCount > 0 ? 60 : 160) + 260,
                                                                window.innerHeight - 200),
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
                                        genericPopupQuerySelector('#role_export_div').style.display = 'block';
                                    }
                                },
                                false);
                            genericPopupAddCloseButton(80);

                            genericPopupCloseProgressMessage();
                            genericPopupShowModal(true);
                        }
                    }, 200);
                }

                function showCalcConfigGenPopup() {
                    let role = g_roleMap.get(backpacksDiv.querySelector('div.row > div.col-md-3 > span.text-info.fyg_f24')?.innerText);
                    let cardInfos = backpacksDiv.querySelectorAll('.icon.icon-angle-down.text-primary');
                    let roleLv = cardInfos[0].innerText.match(/\d+/)[0];
                    let roleQl = cardInfos[1].innerText.match(/\d+/)[0];
                    let roleHs = cardInfos[2].innerText.match(/\d+/)[0];
                    let roleGv = (cardInfos[3]?.innerText.match(/\d+/)[0] ?? '0');
                    let roleTotalPt = Math.trunc((roleLv * 3 + 6) * (1 + roleQl / 100));
                    let rolePt = [];
                    for (let i = 1; i <= 6; i++) {
                        rolePt.push(document.getElementById('sjj' + i).innerText);
                    }
                    if (role == null || roleLv == null || roleQl == null || roleHs == null) {
                        alert('读取卡片信息失败，无法执行配置生成操作！');
                        return;
                    }

                    genericPopupInitialize();
                    genericPopupShowProgressMessage('读取中，请稍候...');

                    const monsters = [
                        {
                            name : '六边形战士',
                            shortMark : 'LIU'
                        },
                        {
                            name : '铁皮木人',
                            shortMark : 'MU2'
                        },
                        {
                            name : '迅捷魔蛛',
                            shortMark : 'ZHU2'
                        },
                        {
                            name : '魔灯之灵',
                            shortMark : 'DENG2'
                        },
                        {
                            name : '食铁兽',
                            shortMark : 'SHOU2'
                        },
                        {
                            name : '六眼飞鱼',
                            shortMark : 'YU2'
                        },
                        {
                            name : '晶刺豪猪',
                            shortMark : 'HAO2'
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
                                  'table.mon-list th.mon-name { width:25%; text-align:left; } ' +
                                  'table.mon-list th.mon-progress { width:25%; text-align:left; } ' +
                                  'table.mon-list th.mon-level { width:25%; text-align:left; } ' +
                                  'table.mon-list th.mon-baselevel { width:25%; text-align:left; } ' +
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
                          '<table class="mon-list"><tr class="alt"><th class="mon-name">名称</th><th class="mon-progress">段位进度（0% - 100%）</th>' +
                             '<th class="mon-level">进度等级</th><th class="mon-baselevel">基础等级（0%进度）</th></tr></table>';
                    const roleTable =
                          '<table class="role-info" id="role-info"><tr class="alt"><th class="role-item">设置</th>' +
                             '<th class="role-points">力量</th><th class="role-points">敏捷</th><th class="role-points">智力</th>' +
                             '<th class="role-points">体魄</th><th class="role-points">精神</th><th class="role-points">意志</th>' +
                             '<th class="role-operation">操作</th></tr><tr>' +
                             '<td>属性点下限（须大于0）<span id ="role-points-summary" style="float:right;margin-right:5px;"></span></td>' +
                             '<td><input type="text" style="width:90%;" value="1" oninput="value=value.replace(/[^\\d]/g,\'\');" /></td>' +
                             '<td><input type="text" style="width:90%;" value="1" oninput="value=value.replace(/[^\\d]/g,\'\');" /></td>' +
                             '<td><input type="text" style="width:90%;" value="1" oninput="value=value.replace(/[^\\d]/g,\'\');" /></td>' +
                             '<td><input type="text" style="width:90%;" value="1" oninput="value=value.replace(/[^\\d]/g,\'\');" /></td>' +
                             '<td><input type="text" style="width:90%;" value="1" oninput="value=value.replace(/[^\\d]/g,\'\');" /></td>' +
                             '<td><input type="text" style="width:90%;" value="1" oninput="value=value.replace(/[^\\d]/g,\'\');" /></td>' +
                             '<td><button type="button" class="role-points-text-reset" style="width:100%;" value="1">重置</td></tr><tr class="alt">' +
                             '<td>属性点上限（0为无限制）</td>' +
                             '<td><input type="text" style="width:90%;" value="0" oninput="value=value.replace(/[^\\d]/g,\'\');" /></td>' +
                             '<td><input type="text" style="width:90%;" value="0" oninput="value=value.replace(/[^\\d]/g,\'\');" /></td>' +
                             '<td><input type="text" style="width:90%;" value="0" oninput="value=value.replace(/[^\\d]/g,\'\');" /></td>' +
                             '<td><input type="text" style="width:90%;" value="0" oninput="value=value.replace(/[^\\d]/g,\'\');" /></td>' +
                             '<td><input type="text" style="width:90%;" value="0" oninput="value=value.replace(/[^\\d]/g,\'\');" /></td>' +
                             '<td><input type="text" style="width:90%;" value="0" oninput="value=value.replace(/[^\\d]/g,\'\');" /></td>' +
                             '<td><button type="button" class="role-points-text-reset" style="width:100%;" value="0">重置</td>' +
                             '</tr></table>';
                    const equipTable =
                          '<table class="equip-list"><tr class="alt"><th class="equip-name">装备</th><th class="equip-property">属性</th>' +
                             '<th class="equip-property"></th><th class="equip-property"></th><th class="equip-property"></th></tr></table>';
                    const miscTable =
                          '<table class="misc-config"><tr class="alt">' +
                             '<th>计算线程数</th><th>最大组合数</th><th>单组测试次数</th><th>置信区间测试阈值（%）</th><th>输出计算进度</th></tr><tr>' +
                             '<td><input type="text" style="width:90%;" original-item="THREADS" value="4" oninput="value=value.replace(/[^\\d]/g,\'\');" /></td>' +
                             '<td><input type="text" style="width:90%;" original-item="SEEDMAX" value="1000000" oninput="value=value.replace(/[^\\d]/g,\'\');" /></td>' +
                             '<td><input type="text" style="width:90%;" original-item="TESTS" value="1000" oninput="value=value.replace(/[^\\d]/g,\'\');" /></td>' +
                             '<td><input type="text" style="width:90%;" original-item="CITEST" value="1.0" oninput="value=value.replace(/[^\\d.]/g,\'\');" /></td>' +
                             '<td><input type="text" style="width:90%;" original-item="VERBOSE" value="1" oninput="value=value.replace(/[^\\d]/g,\'\');" /></td></tr></table>';
                    const btnGroup =
                          '<button type="button" class="btn-group-selection" select-type="2">反选</button>' +
                          '<button type="button" class="btn-group-selection" select-type="1">全不选</button>' +
                          '<button type="button" class="btn-group-selection" select-type="0">全选</button>';
                    const mainContent =
                        `${mainStyle}
                         <div class="${g_genericPopupTopLineDivClass}" id="mon-div">
                           <b class="group-menu">野怪设置 （选中 <span>0</span>） ▼${menuItems}</b>${btnGroup}<hr>
                             <span class="section-help-text">` +
                             `只有勾选行的野怪信息才会被写入配置，且这些信息与选定角色相关。段位进度和等级必须对应，例如选定卡片当前段位60%进度迅捷魔蛛` +
                             `的等级为200级，则在迅捷魔蛛一行的段位进度栏填60，等级栏填200，程序将自动计算得到0%进度迅捷魔蛛的估计基础等级为167。</span>
                              <hr>${monTable}<hr><b style="display:inline-block;width:100%;text-align:center;">起始进度 ` +
                             `<input type="text" class="mon-batch-data" style="width:40px;" maxlength="3" value="0"
                                     oninput="value=value.replace(/[^\\d]/g,'');" /> %，以 ` +
                             `<input type="text" class="mon-batch-data" style="width:40px;" maxlength="2" value="0"
                                     oninput="value=value.replace(/[^\\d]/g,'');" /> % 进度差或以 ` +
                             `<input type="text" class="mon-batch-data" style="width:40px;" maxlength="3" value="0"
                                     oninput="value=value.replace(/[^\\d]/g,'');" /> 级差为间隔额外生成 ` +
                             `<input type="text" class="mon-batch-data" style="width:40px;" maxlength="1" value="0"
                                     oninput="value=value.replace(/[^\\d]/g,'');" /> 批野怪数据</b><hr>
                              <span class="section-help-text"">此功能可以生成多批阶梯等级的野怪配置，计算器可根据这些信息计算当野怪等级` +
                             `在一定范围内浮动时的近似最优策略。野怪的等级由其基础等级及进度加成共同决定（进度等级=基础等级×（1+（进度÷300））），` +
                             `多批之间的级差可由进度差或绝对级差指定，当进度差和绝对级差同时被指定（均大于0）且需生成多批数据（额外生成大于0）时默认使用` +
                             `进度差进行计算，当进度差和绝对级差同时为0或额外生成为0时将不会生成额外批次数据。需要注意的是（起始进度+（进度差×批次数））` +
                             `允许大于100，因为大于100的进度仍然可以计算得到有效的野怪等级。</span></div>
                         <div class="${g_genericPopupTopLineDivClass}" id="role-div">
                           <b class="group-menu">角色基础设置 （${role.name}，${roleLv}级，${roleQl}%品质，${role.hasG ? `${roleGv}成长值，` : ''}` +
                             `${roleTotalPt}属性点） ▼${menuItems}</b><hr><span class="section-help-text">` +
                             `属性点下限初始值为指定角色当前点数分配方案，直接使用这些值主要用于胜率验证、装备及光环技能选择等情况，全部置1表示由计算器从` +
                             `头开始计算近似最佳点数分配（该行末的重置按钮将属性点下限全部置1）。也可为各点数设置合理的下限值（必须大于0且总和小于等于总` +
                             `可用属性点数）并由计算器分配剩余点数，这一般用于角色升级后可用点数增加、指定加点方案大致方向并进行装备、光环选择等情况，在` +
                             `其它条件相同的情况下，越少的剩余点数将节约越多的计算时间。属性点上限用于指定特定属性点数分配的上限，设为0表示无限制。合理地` +
                             `设置上限可以节约计算时间，典型的应用场景为将某些明确无需加点的属性上限设为1（例如3速角色的敏捷、血量系的精神等，以及通常情况` +
                             `下梦、默仅敏捷、智力、精神为0，其它皆为1，当然特殊加点除外），而将其它设为0（该行末的重置按钮将属性点上限全部置0）。除非上限` +
                             `值设为0（无限制），否则请务必保证相应的下限值不超过上限值，非法设置将导致计算器运行错误。</span><hr>
                              <input type="checkbox" id="role-useWishpool" checked /><label for="role-useWishpool"
                                     style="margin-left:5px;cursor:pointer;">使用许愿池数据</label><hr>${roleTable}</div>
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
                             `在选用的光环技能栏选择基本可以确定使用的的光环技能（例如血量重剑系几乎肯定会带沸血之志而护盾法系及某些反伤系带波澜不惊的` +
                             `可能性非常大），如果设置正确（光环点数未超范围）则计算器只需补齐空闲的技能位，所以这里指定的光环越多则计算所需时间越少。` +
                             `排除的光环用于指定几乎不可能出现在计算结果中的光环（例如护盾系可以排除沸血之志而法系基本可排除破壁之心，在技能位不足的情` +
                             `况下启程系列可以考虑全部排除），计算器在寻找优势方案时不会使用这些光环技能进行尝试，所以在有空闲技能位和光环点数充足的情况` +
                             `下，排除的光环技能越多则所需计算时间越少。选用与排除的技能允许重复，如果发生这种情况将强制选用。</span><hr>
                              <div style="width:100%;font-size:15px;"><div id="halo_selector"></div></div></div>
                         <div class="${g_genericPopupTopLineDivClass}" id ="amulet-div">
                           <b class="group-menu">护符 ▼${menuItems}</b><hr><span class="section-help-text">` +
                             `护符配置可以省略，或由当前饰品栏内容决定，如果有预先定义的护符组也可以使用护符组的组合。使用第二及第三种方式时需考虑饰品栏容` +
                             `量（包括许愿池的饰品栏加成及时限）。</span><hr><div style="font-size:15px;">
                              <input type="radio" class="amulet-config" name="amulet-config" id="amulet-config-none" />
                                  <label for="amulet-config-none" style="cursor:pointer;margin-left:5px;">无</label><br>
                              <input type="radio" class="amulet-config" name="amulet-config" id="amulet-config-bag" checked />
                                  <label for="amulet-config-bag" style="cursor:pointer;margin-left:5px;">当前饰品栏内容（悬停查看）</label><br>
                              <input type="radio" class="amulet-config" name="amulet-config" id="amulet-config-groups" />
                                  <label for="amulet-config-groups" style="cursor:pointer;margin-left:5px;">护符组（在组名称上悬停查看）</label>
                              <div id="amulet_selector" style="display:block;padding:0px 20px 0px 20px;"></div></div></div>
                         <div class="${g_genericPopupTopLineDivClass}" id ="misc-div">
                           <b class="group-menu">其它 ▼${menuItems}</b><hr><span class="section-help-text">` +
                             `除非清楚修改以下配置项将会造成的影响，否则如无特殊需要请保持默认值。</span><ul class="section-help-text">` +
                             `<li>计算线程数：计算所允许使用的最大线程数，较大的值可以提高并行度从而减少计算用时，但超出处理器物理限制将适得其反，` +
                                 `合理的值应小于处理器支持的物理线程数（推荐值：处理器物理线程数-1或-2）</li>` +
                             `<li>最大组合数：如果给定配置所产生的组合数超过此值将会造成精度下降，但过大的值可能会造成内存不足，且过大的组合数需求` +
                                 `通常意味着待定项目过多，计算将异常耗时，请尝试多固定一些装备及光环技能项，多排除一些无用的光环技能项</li>` +
                             `<li>单组测试次数：特定的点数分配、装备、光环等组合与目标战斗过程的模拟次数，较高的值一般会产生可信度较高的结果，但会` +
                                 `消耗较长的计算时间（此设置仅在置信区间测试阈值设为0时生效）</li>` +
                             `<li>置信区间测试阈值：不使用固定的测试次数而以置信区间阈值代替，可有小数部份。当测试结果的置信区间达到此值时计算终止，` +
                                 `此设置生效（不为0）时单组测试次数设置将被忽略</li>` +
                             `<li>输出计算进度：1为计算过程中在命令行窗口中显示计算时间、进度等信息，0为无显示</li></ul><hr>${miscTable}</div>
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

                    genericPopupQuerySelectorAll('button.btn-group-selection').forEach((btn) => { btn.onclick = batchSelection; });
                    function batchSelection(e) {
                        let selType = parseInt(e.target.getAttribute('select-type'));
                        let selCount = 0;
                        e.target.parentNode.querySelectorAll('input.generic-checkbox').forEach((chk) => {
                            if (chk.checked = (selType == 2 ? !chk.checked : selType == 0)) {
                                selCount++;
                            }
                        });
                        e.target.parentNode.firstElementChild.firstElementChild.innerText = selCount;
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
                        () => {
                            let equipment = equipmentNodesToInfoArray(store);
                            equipmentNodesToInfoArray(cardingDiv.querySelectorAll(cardingObjectsQueryString), equipment);

                            let eqIndex = 0;
                            let eq_selectors = genericPopupQuerySelectorAll('table.equip-list');
                            equipment.sort((e1, e2) => {
                                if (e1[0] != e2[0]) {
                                    return (g_equipMap.get(e1[0]).index - g_equipMap.get(e2[0]).index);
                                }
                                return -equipmentInfoComparer(e1, e2);
                            }).forEach((item) => {
                                let eqMeta = g_equipMap.get(item[0]);
                                let lv = objectGetLevel(item);
                                let tr = document.createElement('tr');
                                tr.style.backgroundColor = g_equipmentLevelBGColor[lv];
                                tr.innerHTML =
                                    `<td><input type="checkbox" class="generic-checkbox equip-checkbox equip-item" id="equip-${++eqIndex}"
                                                original-item="${item.slice(0, -1).join(' ')}" />
                                         <label for="equip-${eqIndex}" style="margin-left:5px;cursor:pointer;">
                                                ${eqMeta.alias} - Lv.${item[1]} （攻.${item[2]} 防.${item[3]}） ` +
                                               `${item[8] == 1 ? ' - [ 神秘 ]' : ''}</label></td>
                                     <td>${formatEquipmentAttributes(item, '</td><td>')}</td>`;
                                eq_selectors[eqMeta.type].appendChild(tr);
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
                        currentHalo = [],
                        () => {
                            haloMax = currentHalo[0];
                            let haloInfo =
                                `天赋点：<span style="color:#0000c0;"><span id="halo_points">0</span> / ${haloMax}</span>，` +
                                `技能位：<span style="color:#0000c0;"><span id="halo_slots">0</span> / ${roleHs}</span>` +
                                `<b id="halo_errors" style="display:none;color:red;margin-left:15px;">（光环天赋点数 / 角色卡片技能位不足）</b>`;
                            let haloSelector = genericPopupQuerySelector('#halo_selector');
                            haloSelector.innerHTML =
                                `<style>
                                    .halo_group { display:block; width:25%; float:left; text-align:center; border-left:1px solid grey; }
                                    .halo_group_exclude { display:block; width:25%; float:left; text-align:center; border-left:1px solid grey; }
                                     div > a { display:inline-block; width:90%; } </style>
                                 <b style="margin-right:15px;">选用的光环技能：</b>${haloInfo}
                                 <p />
                                 <div style="display:table;">
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
                                haloSlots.style.color = (hs <= roleHs ? '#0000c0' : 'red');
                                haloErrors.style.display = (hp <= haloMax && hs <= roleHs ? 'none' : 'inline-block');
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

                    if (wishpool.length == 0) {
                        beginReadWishpool(wishpool, null, () => { asyncOperations--; }, null);
                    }
                    else {
                        asyncOperations--;
                    }
                    if (userInfo.length == 0) {
                        beginReadUserInfo(userInfo, () => { asyncOperations--; });
                    }
                    else {
                        asyncOperations--;
                    }

                    let mon_selector = genericPopupQuerySelector('table.mon-list');
                    monsters.forEach((e, i) => {
                        let tr = document.createElement('tr');
                        tr.className = 'mon-row' + ((i & 1) == 0 ? '' : ' alt');
                        tr.setAttribute('original-item', e.shortMark);
                        tr.innerHTML =
                            `<td><input type="checkbox" class="generic-checkbox mon-checkbox mon-item" id="mon-item-${i}"${i == 0 ? ' checked' : ''} />
                                 <label for="mon-item-${i}" style="margin-left:5px;cursor:pointer;">${e.name}</label></td>
                             <td><input type="text" class="mon-textbox" style="width:80%;" maxlength="3" value="0"
                                        oninput="value=value.replace(/[^\\d]/g,'');" /> %</td>
                             <td><input type="text" class="mon-textbox" style="width:80%;" value="1"
                                        oninput="value=value.replace(/[^\\d]/g,'');" /></td>
                             <td>1</td>`;
                        mon_selector.appendChild(tr);
                    });
                    mon_selector.querySelectorAll('input.mon-textbox').forEach((e) => { e.onchange = monDataChange; });
                    function monDataChange(e) {
                        let tr = e.target.parentNode.parentNode;
                        let p = parseInt(tr.children[1].firstChild.value);
                        let l = parseInt(tr.children[2].firstChild.value);
                        if (!isNaN(p) && !isNaN(l) && p >= 0 && p <= 100 && l > 0) {
                            tr.children[3].innerText = Math.ceil(l / (1 + (p / 300)));
                        }
                        else {
                            tr.children[3].innerHTML = '<b style="color:red;">输入不合法</b>';
                        }
                    }
                    countGenericCheckbox('#mon-div');

                    let roleInfo = genericPopupQuerySelector('#role-info');
                    let rolePtsSum = roleInfo.querySelector('#role-points-summary');
                    let textPts = roleInfo.querySelectorAll('input');
                    for (let i = 0; i < 6; i++) {
                        textPts[i].value = rolePt[i];
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
                            e.target.parentNode.parentNode.querySelectorAll('input[type="text"]').forEach((item) => {
                                item.value = e.target.value;
                            });
                            if (e.target.value == '1') {
                                rolePtsChanged();
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
                            monster : { batchData : [] },
                            role : { useWishpool : true , points : [] },
                            equipment : { selected : [] },
                            halo : { selected : [] , excluded : [] },
                            amulet : { selected : -1 , selectedGroups : [] },
                            miscellaneous : {}
                        };
                        mon_selector.querySelectorAll('.mon-row').forEach((tr) => {
                            let row = tr.children;
                            template.monster[tr.getAttribute('original-item')] = {
                                selected : row[0].firstElementChild.checked,
                                progress : row[1].firstElementChild.value,
                                level : row[2].firstElementChild.value
                            };
                        });
                        genericPopupQuerySelectorAll('#mon-div input.mon-batch-data').forEach((e) => {
                            template.monster.batchData.push(e.value);
                        });

                        template.role.useWishpool = genericPopupQuerySelector('#role-useWishpool').checked;
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

                        return template;
                    }

                    function applyTemplate(template) {
                        mon_selector.querySelectorAll('.mon-row').forEach((tr) => {
                            let mon = template.monster[tr.getAttribute('original-item')];
                            if (mon != null) {
                                let row = tr.children;
                                row[0].firstElementChild.checked = mon.selected;
                                row[1].firstElementChild.value = mon.progress;
                                row[2].firstElementChild.value = mon.level;
                                monDataChange({ target : row[1].firstElementChild });
                            }
                        });
                        genericPopupQuerySelectorAll('#mon-div input.mon-batch-data').forEach((e, i) => {
                            e.value = template.monster.batchData[i];
                        });
                        countGenericCheckbox('#mon-div');

                        genericPopupQuerySelector('#role-useWishpool').checked = template.role.useWishpool;
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
                        haloSlots.style.color = (hs <= roleHs ? '#0000c0' : 'red');

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
                    }

                    function collectConfigData() {
                        let cfg = [ haloMax,
                                    '',
                                    `${role.shortMark}${role.hasG ? ' G=' + roleGv : ''} ${roleLv} ${userInfo[2]} ${roleHs} ${roleQl}` ];
                        if (genericPopupQuerySelector('#role-useWishpool').checked) {
                            cfg.push('WISH ' + wishpool.slice(-14).join(' '));
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
                                let a = eqstr.split(' ');
                                a.splice(2, 2);
                                eqstr = a.join(' ');
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

                        let halo = [];
                        $('.halo_item').each(function(i, e) {
                            if ($(e).attr('item-selected') == 1) {
                                halo.push(g_haloMap.get($(e).attr('original-item')).shortMark);
                            }
                        });
                        cfg.push(halo.length > 0 ? halo.length + ' ' + halo.join(' ') : '0');
                        cfg.push('');

                        if (eqsel.length > 0) {
                            cfg.push('GEAR\n    ' + eqsel.flat().join('\n    ') + '\nENDGEAR');
                            cfg.push('');
                        }

                        let monText = genericPopupQuerySelectorAll('#mon-div input.mon-batch-data');
                        let startProg = parseInt(monText[0].value);
                        let progStep = parseInt(monText[1].value);
                        let lvlstep = parseInt(monText[2].value);
                        let batCount = parseInt(monText[3].value);
                        let mon = [];
                        mon_selector.querySelectorAll('input.mon-checkbox.mon-item').forEach((e) => {
                            if (e.checked) {
                                let tr = e.parentNode.parentNode;
                                let baseLvl = parseInt(tr.children[3].innerText);
                                if (!isNaN(baseLvl)) {
                                    mon.push({ mon : tr.getAttribute('original-item'), level : baseLvl });
                                }
                            }
                        });
                        if (mon.length > 0) {
                            cfg.push('NPC');
                            const sp = '        ';
                            mon.forEach((e) => {
                                let bl = Math.trunc(e.level * (1 + startProg / 300));
                                cfg.push('    ' + (e.mon + sp).substring(0, 8) + (bl + sp).substring(0, 8) + '0');
                                if (batCount > 0 && progStep == 0 && lvlstep > 0) {
                                    e.level = bl;
                                }
                            });
                            while (batCount > 0) {
                                cfg.push('');
                                if (progStep > 0) {
                                    startProg += progStep;
                                    mon.forEach((e) => {
                                        cfg.push('    ' + (e.mon + sp).substring(0, 8) +
                                                 (Math.trunc(e.level * (1 + startProg / 300)) + sp).substring(0, 8) + '0');
                                    });
                                }
                                else if (lvlstep > 0) {
                                    mon.forEach((e) => {
                                        cfg.push('    ' + (e.mon + sp).substring(0, 8) +
                                                 ((e.level += lvlstep) + sp).substring(0, 8) + '0');
                                    });
                                }
                                else {
                                    cfg.pop();
                                    break;
                                }
                                batCount--;
                            }
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

                        cfg.push(ptsMax.join(' '));
                        halo = [];
                        $('.halo_item_exclude').each(function(i, e) {
                            if ($(e).attr('item-selected') == 1) {
                                halo.push(g_haloMap.get($(e).attr('original-item')).shortMark);
                            }
                        });
                        if (halo.length > 0) {
                            cfg.push('AURAFILTER ' + halo.join('_'));
                        }

                        return cfg;
                    }

                    let timer = setInterval(() => {
                        if (asyncOperations == 0) {
                            clearInterval(timer);
                            httpRequestClearAll();

                            bagCells += parseInt(wishpool[0] ?? 0);
                            if (userInfo?.[4]?.length > 0) {
                                bagCells += 2;
                            }
                            if (userInfo?.[5]?.length > 0) {
                                bagCells += 5;
                            }
                            amuletCount.innerText = '0 / ' + bagCells;
                            amuletCount.style.color = 'blue';

                            let udata = loadUserConfigData();
                            let template = udata.calculatorTemplatePVE?.[role.id];

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
                                udata.calculatorTemplatePVE[role.id] = template = generateTemplate();
                                saveUserConfigData(udata);

                                btnLoadTemplate.disabled = '';
                                btnDeleteTemplate.disabled = '';
                                genericPopupShowInformationTips('模板已保存');
                            }

                            function deleteTemplate() {
                                delete udata.calculatorTemplatePVE[role.id];
                                saveUserConfigData(udata);

                                template = null;
                                btnLoadTemplate.disabled = 'disabled';
                                btnDeleteTemplate.disabled = 'disabled';
                                genericPopupShowInformationTips('模板已删除');
                            }

                            genericPopupQuerySelectorAll('input.generic-checkbox').forEach((e) => { e.onchange = genericCheckboxStateChange; });
                            function genericCheckboxStateChange(e) {
                                let countSpan = e.target.parentNode.parentNode.parentNode.parentNode.firstElementChild.firstElementChild;
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

                    let udata = loadUserConfigData();
                    let defaultSolution = false;
                    let bindings = null;
                    let bind_info = udata.dataBind[roleId];
                    if (bind_info != null) {
                        bindings = bind_info.split(BINDING_SEPARATOR).sort((a, b) => {
                            a = a.split(BINDING_NAME_SEPARATOR);
                            b = b.split(BINDING_NAME_SEPARATOR);
                            a = a.length > 1 ? a[0] : BINDING_NAME_DEFAULT;
                            b = b.length > 1 ? b[0] : BINDING_NAME_DEFAULT;
                            return a < b ? -1 : 1;
                        });
                    }
                    bindingList.innerHTML = '';
                    if (bindings?.length > 0) {
                        bindings.forEach((item) => {
                            let elements = item.split(BINDING_NAME_SEPARATOR);
                            let op = document.createElement('option');
                            op.value = roleId + BINDING_NAME_SEPARATOR + elements[elements.length - 1];
                            op.innerText = (elements.length > 1 ? elements[0] : BINDING_NAME_DEFAULT);
                            bindingList.appendChild(op);
                            if (udata.dataBindDefault[roleId] == op.innerText) {
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

                function addRoleOperationBtn() {
                    let roleId = g_roleMap.get(backpacksDiv.querySelector('div.row > div.col-md-3 > span.text-info.fyg_f24')?.innerText)?.id;

                    function toolsLinks(e) {
                        if (e.target.id == g_genCalcCfgPopupLinkId) {
                            showCalcConfigGenPopup();
                        }
                        else if (e.target.id == g_bindingPopupLinkId) {
                            showBindingPopup();
                        }
                        else if (e.target.id == g_equipOnekeyLinkId) {
                            equipOnekey();
                        }
                    }

                    let bindingAnchor = backpacksDiv.querySelector('div.row > div.col-md-12').parentNode.nextSibling;
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
                    bindingAnchor.parentNode.insertBefore(toolsContainer, bindingAnchor);

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
                            let container = document.querySelector('ul.nav.nav-secondary.nav-justified').parentNode;
                            container.insertBefore(maskDiv, container.firstElementChild);
                        }
                        maskDiv.style.display = (enabled ? 'none' : 'block');
                    }
                    enableSwitchEquipSubtabs(false);

                    $('.pop_main').hide();
                    calcBtn.disabled = 'disabled';
                    calcBtn.onclick = (() => {});

                    let index = -1;
                    document.querySelectorAll('ul.nav.nav-secondary.nav-justified > li').forEach((e, i) => {
                        if (e.className == 'active') {
                            index = i;
                        }
                    });
                    switch (index) {
                        case 0: {
                            calcBtn.disabled = '';
                            calcBtn.onclick = (() => {
                                let eqon = equipmentNodesToInfoArray(cardingDiv.querySelectorAll(cardingObjectsQueryString));
                                let eqall = equipmentNodesToInfoArray(backpacksDiv.querySelectorAll(storeObjectsQueryString));
                                eqall = eqall.concat(eqon).sort(equipmentInfoComparer);
                                let el = eqall.length;
                                calcDiv.innerHTML =
                                    `<div class="pop_main" style="padding:0px 10px;"><a href="###">× 折叠 ×</a>
                                         <div class="pop_con">
                                         <div style="width:200px;padding:5px;margin-top:10px;margin-bottom:10px;
                                              color:purple;border:1px solid grey;">护符：</div>
                                         <div class="pop_text"></div>
                                         <div style="width:200px;padding:5px;margin-top:10px;margin-bottom:10px;
                                              color:purple;border:1px solid grey">已装备：</div>
                                         <div class="pop_text"></div>
                                         <div class="pop_text"></div>
                                         <div class="pop_text"></div>
                                         <div class="pop_text"></div>
                                         <div style="width:200px;padding:5px;margin-top:10px;margin-bottom:10px;
                                              color:purple;border:1px solid grey;">全部装备：</div>
                                         ${new Array(el).fill('<div class="pop_text"></div>').join('')}<hr></div>
                                         <a href="###">× 折叠 ×</a></div>`;

                                $('.pop_main a').click(() => {
                                    $('.pop_main').hide()
                                })
                                let text = $('.pop_text');
                                let bagAmulets = [];
                                amuletNodesToArray(backpacksDiv.querySelectorAll(bagObjectsQueryString), bagAmulets);
                                let bagGroup = amuletCreateGroupFromArray('temp', bagAmulets);
                                if (bagGroup?.isValid()) {
                                    text[0].innerText = `AMULET ${bagGroup.formatBuffShortMark(' ', ' ', false)} ENDAMULET`;
                                }
                                eqon.forEach((e, i) => {
                                    let a = e.slice(0, -1);
                                    a.splice(2, 2);
                                    text[i + 1].innerText = a.join(' ');
                                });
                                for (let i = 0; i < el; i++) {
                                    let a = eqall[i].slice(0, -1);
                                    a.splice(2, 2);
                                    text[5 + i].innerText = a.join(' ');
                                }
                                $('.pop_main').show();
                            });
                            if (document.getElementById('equipmentDiv') == null) {
                                restructEquipUI(enableSwitchEquipSubtabs, true);
                                return;
                            }
                            else {
                                switchObjectContainerStatus(!equipmentStoreExpand);
                            }
                            break;
                        }
                        case 1: {
                            if (g_roleMap.has(backpacksDiv.querySelector('div.row > div.col-md-3 > span.text-info.fyg_f24')?.innerText)) {
                                addRoleOperationBtn();
                            }
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                    enableSwitchEquipSubtabs(true);
                }

                let backpacksObserver = new MutationObserver(() => {
                    backpacksObserver.disconnect();
                    switchEquipSubtabs();
                    backpacksObserver.observe(backpacksDiv, { childList : true , characterData : true });
                });

                switchEquipSubtabs();
                backpacksObserver.observe(backpacksDiv, { childList : true , characterData : true });

                equipmentNodesToInfoArray(cardingDiv.querySelectorAll(cardingObjectsQueryString));
                new MutationObserver(() => {
                    equipmentNodesToInfoArray(cardingDiv.querySelectorAll(cardingObjectsQueryString));
                }).observe(cardingDiv, { subtree : true, childList : true });
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
               <input type="checkbox" id="beach_BG" style="margin-right:5px;"/>
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
            modifyConfig(['minBeachEquipLevelToAmulet', 'minBeachAmuletPointsToStore', 'clearBeachAfterBatchToAmulet'], '批量转护符设置');
        });

        beachConfigDiv.querySelector('#siftSettings').onclick = (() => {
            loadTheme();

            let fixedContent =
                '<div style="font-size:15px;color:#0000c0;padding:20px 0px 10px;"><b><ul>' +
                '<li>被勾选的装备不会被展开，不会产生与已有装备的对比列表，传奇、史诗及有神秘属性的装备例外</li>' +
                '<li>未勾选的属性被视为主要属性，沙滩装备的任一主要属性值大于已有装备的相应值时即有可能被展开，除非已有装备中至少有一件其各项属性值均不低于沙滩装备</li>' +
                '<li>被勾选的属性被视为次要属性，当且仅当沙滩装备和已有装备的主要属性值完全相等时才会被对比</li>' +
                '<li>不作为筛选依据的已有装备或指定特性不会与沙滩装备直接进行比较，这些装备不会影响沙滩装备的展开与否</li></ul></b></div>';
            let mainContent =
                `<style> #equip-table { width:100%; }
                         #equip-table th { width:17%; text-align:right; }
                         #equip-table th.equip-th-equip { width:32%; text-align:left; }
                         #equip-table td { display:table-cell; text-align:right; }
                         #equip-table td.equip-td-equip { display:table-cell; text-align:left; }
                         #equip-table label.equip-checkbox-label { margin-left:5px; cursor:pointer; }
                         table tr.alt { background-color:${g_genericPopupBackgroundColorAlt}; } </style>
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
                             oninput="value=value.replace(/[^\\d]/g,'');" /> 级的装备</b></div>
                 <div class="${g_genericPopupTopLineDivClass}"><table id="equip-table">
                 <tr class="alt"><th class="equip-th-equip"><input type="checkbox" id="equip-name-check" />
                 <label class= "equip-checkbox-label" for="equip-name-check">装备名称</label></th>
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
                    `<td class="equip-td-equip"><input type="checkbox" class="sift-settings-checkbox" id="${equipId}" />
                         <label class="equip-checkbox-label" for="${equipId}">${equip.alias}</label></td>${attrHTML}`;
                equipTable.appendChild(tr);
            });

            let eqchecks = equipTable.querySelectorAll('input.sift-settings-checkbox');
            for (let i = 0; i < eqchecks.length; i += 5) {
                let abbr = eqchecks[i].parentNode.parentNode.getAttribute('equip-abbr');
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
        beach.parentNode.insertBefore(beachConfigDiv, beach);

        let batbtns = document.querySelector('div.col-md-12 > div.panel > div.panel-heading > div.btn-group > button.btn.btn-danger');
        let toAmuletBtn = document.createElement('button');
        toAmuletBtn.className = batbtns.className;
        toAmuletBtn.innerText = '批量沙滩装备转护符';
        toAmuletBtn.style.marginLeft = '1px';
        toAmuletBtn.onclick = equipToAmulet;
        toAmuletBtn.disabled = 'disabled';
        batbtns.parentNode.appendChild(toAmuletBtn);

        function equipToAmulet() {
            loadTheme();
            readConfig();

            function divHeightAdjustment(div) {
                div.style.height = (div.parentNode.offsetHeight - div.offsetTop - 3) + 'px';
            }

            function moveAmuletItem(e) {
                let li = e.target;
                if (li.tagName == 'LI') {
                    let container = (li.parentNode == amuletToStoreList ? amuletToDestroyList : amuletToStoreList);
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
                            let e = equipmentInfoParseNode(node);
                            if (e != null && parseInt(e[1]) >= beachEquipLevel[lv]) {
                                beach.push(parseInt(e[9]));
                            }
                        }
                    }
                }
            }

            function pirlEquip() {
                genericPopupShowInformationTips('熔炼装备...', 0);
                let ids = [];
                while (originalBeachEquips.length > 0 && ids.length < freeCell) {
                    ids.unshift(originalBeachEquips.pop());
                }
                pirlCount = ids.length;
                beginPirlObjects(false, ids, refreshStore, prepareNewAmulets);
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
                if (window.getSelection) {
                    window.getSelection().removeAllRanges();
                }
                else if (document.getSelection) {
                    document.getSelection().removeAllRanges();
                }
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
                        if (warning > 0 && !confirm(`这将把 ${warning} 个“樱桃／传奇”护符转换成果核，要继续吗？`)) {
                            btnContinue.disabled = '';
                            btnCloseOnBatch.disabled = (originalBeachEquips.length > 0 ? '' : 'disabled');
                            return;
                        }
                        amuletToDestroyList.innerHTML = '';
                        coresCollected += indices.length;
                        pirlCount -= indices.length;
                        genericPopupShowInformationTips('转换果核...', 0);
                        beginPirlObjects(true, ids, refreshStore, processNewAmulets);
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
                    genericPopupQuerySelector('#fixed-tips').innerText = `操作完成，共获得 ${amuletsCollected} 个护符， ${coresCollected} 个果核`;
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
                    '<div style="display:block;width:100%;padding:5px;border-bottom:2px groove #d0d0d0;margin-bottom:10px;">转换果核</div>' +
                    '<div style="position:absolute;display:block;height:1px;width:100%;overflow:scroll;">' +
                      '<ul id="amulet_to_destroy_list" style="cursor:pointer;"></ul></div></div></div>';

            genericPopupSetFixedContent(fixedContent);
            genericPopupSetContent('批量护符转换', mainContent);

            let amuletToStoreList = genericPopupQuerySelector('#amulet_to_store_list');
            let amuletToDestroyList = genericPopupQuerySelector('#amulet_to_destroy_list');
            amuletToStoreList.parentNode.oncontextmenu = amuletToDestroyList.parentNode.oncontextmenu = (() => false);
            amuletToStoreList.oncontextmenu = amuletToDestroyList.oncontextmenu = moveAmuletItem;
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

            divHeightAdjustment(amuletToStoreList.parentNode);
            divHeightAdjustment(amuletToDestroyList.parentNode);
        }

        let asyncOperations = 1;
        let equipExchanged = false;
        let cardingNodes, equipNodes, equipInfos = [];
        let roleInfo;
        beginReadRoleInfo(
            roleInfo = [],
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

                cardingNodes = Array.from(roleInfo[2]).sort(objectNodeComparer);
                if (--asyncOperations < 0) {
                    asyncOperations = 0;
                }
            });

        (new MutationObserver((mlist) => {
            if (!(mlist[0].addedNodes[0]?.className?.indexOf('popover') >= 0 ||
                  mlist[0].removedNodes[0]?.className?.indexOf('popover') >= 0)) {
                let oldNodes = Array.from(mlist[0].removedNodes).sort(objectNodeComparer);
                let newNodes = Array.from(mlist[0].addedNodes).sort(objectNodeComparer);
                let oldInfos = equipmentNodesToInfoArray(oldNodes);
                let newInfos = equipmentNodesToInfoArray(newNodes);
                if (equipExchanged) {
                    equipExchanged = false;
                    let puton = findNewObjects(oldInfos, newInfos, true, false, equipmentInfoComparer);
                    if (puton.length == 1) {
                        let takeoff = findNewObjects(newInfos, oldInfos, true, false, equipmentInfoComparer);
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
                loadTheme();

                analyzeBeachEquips();
                (new MutationObserver(() => { analyzeBeachEquips(); })).observe(document.getElementById('beachall'), { childList : true });

                toAmuletBtn.disabled = '';
            }
        }, 200);

        var analyzingEquipment = false;
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
                            equipInfos = equipmentNodesToInfoArray(equipNodes);
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
                beachall.parentNode.insertBefore(beach_copy, beachall);

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
                let e = equipmentInfoParseNode(btn);
                if (e != null) {
                    let isExpanding = false;
                    let eqLv = objectGetLevel(e);
                    if (forceExpand || eqLv > 2 || e[8] > 0) {
                        isExpanding = true;
                    }
                    else {
                        let setting = (settings[e[0]] ?? defaultSetting);
                        if (!setting[0]) {
                            let isFind = false;
                            let stLv;
                            for (let j = equipInfos.length - 1; j >= 0; j--) {
                                if (equipInfos[j][0] == e[0] &&
                                    !(ignoreMysEquip && equipInfos[j][8] == 1) &&
                                    (stLv = parseInt(equipInfos[j][1])) >= ignoreEquipLevel) {

                                    isFind = true;
                                    let e1 = [ parseInt(e[1]), parseInt(e[4]), parseInt(e[5]), parseInt(e[6]), parseInt(e[7]) ];
                                    let e2 = [ stLv, parseInt(equipInfos[j][4]), parseInt(equipInfos[j][5]),
                                               parseInt(equipInfos[j][6]), parseInt(equipInfos[j][7]) ];
                                    let res = defaultEquipmentNodeComparer(setting, e[0], e1, e2);
                                    if (!ignoreEquipQuality && (res.quality > 0 || (res.quality == 0 && e1[0] > e2[0]))) {
                                        isExpanding = true;
                                        break;
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
                        equipInfos.forEach((eq, i) => {
                            if (e[0] == eq[0]) {
                                let btn1 = document.createElement('button');
                                let styleClass = g_equipmentLevelStyleClass[objectGetLevel(eq)];
                                btn1.className = `btn btn-light popover-${styleClass}`;
                                btn1.style.cssText = 'min-width:220px;padding:0px;box-shadow:none;margin-right:5px;margin-bottom:5px;';
                                btn1.innerHTML =
                                    `<p class="compare-equip-title bg-${styleClass}">Lv.<b>${eq[1]}` +
                                    `（${equipmentQuality(eq)}%, 攻.${eq[2]} 防.${eq[3]}）</b></p>
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
                                if (equipmentVerify(equipNodes[i], eq) != 0) {
                                    btn1.style.border = '5px solid #ff00ff';
                                }
                            }
                        });
                        btn0.setAttribute('data-content', popover.innerHTML);
                        btn0.innerHTML =
                            `<h3 class="popover-title bg-${g_equipmentLevelStyleClass[objectGetLevel(e)]}">${btn.dataset.originalTitle}</h3>
                             <div class="popover-content-show" style="padding:10px 10px 0px 10px;">${btn.dataset.content}</div>`;
                        beach_copy.insertBefore(btn0, btn.nextSibling);
                    }
                    // debug only
                    if (equipmentVerify(btn, e) != 0) {
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
            if (document.querySelector('#pklist')?.firstElementChild != null) {
                clearInterval(timer);

                let pkConfigDiv = document.createElement('div');
                pkConfigDiv.className = 'row';
                pkConfigDiv.innerHTML =
                    `<div class="panel panel-info" style="width:100%;">
                     <div class="panel-heading" id="pk-addin-panel" style="width:100%;display:table;border:none;">
                     <div id="solutionPanel" style="display:none;margin-top:3px;float:left;"
                          data-toggle="tooltip" data-placement="top"
                          data-original-title="如果在其它页面增加、删除或修改了任何绑定方案，请重新刷新本页面或点击“更新列表”链接以获取更新后的方案内容"><b>
                       <a href="###" id="refreshSolutionList"
                          style="margin-top:2px;font-size:15px;text-decoration:underline;float:left;">更新列表</a>
                       <div style="padding-top:1px;margin-left:10px;margin-right:10px;float:left;">
                         <select id="bindingSolutions" style="width:180px;font-size:15px;padding:2px 0px;text-align:center;"></select></div>
                       <a href="###" id="switchSolution"
                          style="display:none;margin-top:2px;font-size:15px;text-decoration:underline;float:left;">应用方案</a></b></div>
                     <div style="margin-top:3px;text-align:right;float:right;">
                       <input type="checkbox" id="showSolutionPanelCheckbox" />
                       <label for="showSolutionPanelCheckbox" style="margin-left:5px;cursor:pointer;">显示方案切换面板</label>
                       <input type="checkbox" id="indexRallyCheckbox" style="margin-left:15px;" />
                       <label for="indexRallyCheckbox" style="margin-left:5px;cursor:pointer;">为攻击回合加注索引</label>
                       <input type="checkbox" id="keepPkRecordCheckbox" style="margin-left:15px;" />
                       <label for="keepPkRecordCheckbox" style="margin-left:5px;cursor:pointer;">暂时保持战斗记录</label>
                     </div></div></div>`;
                let pkAddinPanel = pkConfigDiv.querySelector('#pk-addin-panel');

                let refreshSolutionList = pkConfigDiv.querySelector('#refreshSolutionList');
                refreshSolutionList.onclick = (() => { refreshBindingSolutionList(); });

                let bindingSolutions = pkConfigDiv.querySelector('#bindingSolutions');
                function refreshBindingSolutionList() {
                    bindingSolutions.innerHTML = '';
                    let udata = loadUserConfigData();
                    for (let role in udata.dataBind) {
                        udata.dataBind[role].split(BINDING_SEPARATOR).forEach((s) => {
                            let e = s.split(BINDING_NAME_SEPARATOR);
                            if (e.length == 2) {
                                let op = document.createElement('option');
                                op.value = role + BINDING_NAME_SEPARATOR + e[1];
                                op.innerText = g_roleMap.get(role).name + ' : ' + e[0];
                                bindingSolutions.appendChild(op);
                            }
                        });
                    }
                    switchSolution.style.display = (bindingSolutions.options.length > 0 ? 'inline-block' : 'none');
                }

                let switchSolution = pkConfigDiv.querySelector('#switchSolution');
                switchSolution.onclick = (() => {
                    genericPopupInitialize();
                    genericPopupShowProgressMessage('读取中，请稍候...');
                    switchBindingSolution(bindingSolutions.value);
                });
                refreshBindingSolutionList();

                let showSolutionPanel = setupConfigCheckbox(
                    pkConfigDiv.querySelector('#showSolutionPanelCheckbox'),
                    g_showSolutionPanelStorageKey,
                    (checked) => { solutionPanel.style.display = ((showSolutionPanel = checked) ? 'block' : 'none'); },
                    null);

                let solutionPanel = pkConfigDiv.querySelector('#solutionPanel');
                solutionPanel.style.display = (showSolutionPanel ? 'block' : 'none');

                let indexRally = setupConfigCheckbox(
                    pkConfigDiv.querySelector('#indexRallyCheckbox'),
                    g_indexRallyStorageKey,
                    (checked) => { indexRally = checked; },
                    null);

                let keepPkRecord = setupConfigCheckbox(
                    pkConfigDiv.querySelector('#keepPkRecordCheckbox'),
                    g_keepPkRecordStorageKey,
                    (checked) => { pkRecordDiv.style.display = ((keepPkRecord = checked) ? 'block' : 'none'); },
                    null);

                let pkDiv = document.querySelector('#pk_text');
                pkDiv.parentNode.insertBefore(pkConfigDiv, pkDiv);
                $('#solutionPanel').tooltip();

                let pkRecordDiv = document.createElement('div');
                pkRecordDiv.id = 'pk_record';
                pkRecordDiv.style.marginTop = '5px';
                pkRecordDiv.style.display = (keepPkRecord ? 'block' : 'none');
                pkDiv.parentNode.insertBefore(pkRecordDiv, pkDiv.nextSibling);

                let pkCount = 0;
                let lastPk = null;
                let lastPkTime = null;
                let pkObserver = new MutationObserver(() => {
                    pkObserver.disconnect();
                    if (indexRally) {
                        let turn_l = 0;
                        let turn_r = 0;
                        pkDiv.querySelectorAll('p.bg-default').forEach((e, i) => {
                            let myTurn = (e.parentNode.className.indexOf('fyg_tr') >= 0);
                            let rally = document.createElement('b');
                            rally.className = 'bg-default';
                            rally.innerText = (myTurn ? `${i + 1} （${++turn_l}）` : `（${++turn_r}） ${i + 1}`);
                            rally.style.float = (myTurn ? 'left' : 'right');
                            rally.style.paddingLeft = rally.style.paddingRight = '5px';
                            e.nextElementSibling.appendChild(rally);
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
                            lastPk.style.display = 'none';
                            lastPkTime = pkTime;
                        }
                    }
                    pkObserver.observe(pkDiv, { characterData : true , childList : true });
                });
                pkObserver.observe(pkDiv, { characterData : true , childList : true });

                pkAddinPanel.setAttribute('pk-text-hooked', 'true');
            }
        }, 200);
    }
    else if (window.location.pathname == g_guguzhenWish) {
        //
        // temporary solution
        //

        function getWishPoints() {
            let text = 'WISH';
            for (let i = 2; i <= 15; i++) {
                text += (' ' + (document.getElementById('xyx_' + ('0' + i).slice(-2))?.innerText ?? '0'));
                console.log(text)
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
        xydiv.parentNode.parentNode.insertBefore(div, xydiv.parentNode.nextSibling);

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
            //
            // temporary solution
            //
            calcWishPoints.value = getWishPoints();
        })).observe(xydiv, { subtree : true , childList : true , characterData : true });
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
                             <b>★ 这是一个浏览器挂机功能，对运行环境要求比较苛刻，在很多情形下都不能正常工作，这些情形包括但不限于浏览器窗口最小化、` +
                               `浏览器窗口被其它程序遮挡、本页签为非活动页签及屏幕保护程序运行、屏幕休眠、锁屏等等，不同浏览器的表现可能会有所不同。` +
                               `如果您不能接受这些常见情形所导致的运行问题，请谨慎使用本功能或经常检查网页运行状态以确保不会蒙受意外损失` +
                               `（刚刚是谁说的WebWorker？我闲但我没那么闲）。<hr>` +
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
                btnSetup.onclick = (() => { modifyConfig(['gemPollPeriod', 'gemWorkCompletionCondition'], '宝石工坊挂机设置', true); });

                let div = gemdDiv.parentNode.parentNode;
                div.parentNode.insertBefore(unionDiv, div.nextSibling);

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

                const defaultShiftDelay = 50;
                let shiftDelay = defaultShiftDelay;
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

                    if (shiftDelay > 0) {
                        let timer = setInterval(() => {
                            if (shiftDelay <= 0) {
                                clearInterval(timer);
                                shiftDelay = defaultShiftDelay;
                                beginChangeShift();
                            }
                        }, shiftDelay);
                    }
                    else {
                        shiftDelay = defaultShiftDelay;
                        beginChangeShift();
                    }
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
                    shiftDelay = 0;
                });

                updateGemWorks();
                gemWorksObserver.observe(gemdDiv, { subtree : true , childList : true , characterData : true });
                shiftDelay = 0;
            }
        }, 200);
    }
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
};
$(document).ready(function(e) { gudaq();});
