// ==UserScript==
// @name         Custom Dictionary(自製字典庫)
// @namespace    http://tampermonkey.net/
// @description  Custom Dictionary(自製字典庫)：設定自己的字典庫，可在任意網頁幫助查找，貼上。
// @version      0.1
// @author       papago89
// @match        https://*/*
// @match        http://*/*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @require      https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @include      @
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445712/Custom%20Dictionary%28%E8%87%AA%E8%A3%BD%E5%AD%97%E5%85%B8%E5%BA%AB%29.user.js
// @updateURL https://update.greasyfork.org/scripts/445712/Custom%20Dictionary%28%E8%87%AA%E8%A3%BD%E5%AD%97%E5%85%B8%E5%BA%AB%29.meta.js
// ==/UserScript==

let dictionaryJSON = {
    "ControlKeyPage1": {
        "name": "Control key Page 1",
        "data": [
            {
                "value": "CTRL + ↓",
                "description": "will select next row"
            },
            {
                "value": "CTRL + ↑",
                "description": "will select previous row"
            },
            {
                "value": "CTRL + →",
                "description": "will select next category"
            },
            {
                "value": "CTRL + your mouse primary button(通常是左鍵)",
                "description": "will show now selected row value to search bar"
            },
            {
                "value": "enter",
                "description": "will paste now selected row value to your browser focus element"
            }
        ]
    },
    "ControlKeyPage2": {
        "name": "Control key Page 2",
        "data": [
            {
                "value": "CTRL + ←",
                "description": "will select previous category"
            }
        ]
    },
    "record-2": {
        "name": "test-2",
        "data": [
            {
                "value": "this is test-1 value",
                "description": "simple description"
            },
            {
                "value": "this is test-2 value, don't set the description"
            }
        ]
    },
    "record-3": {
        "name": "test-3",
        "data": [
            {
                "value": "127.0.0.1",
                "description": "just test regexp find IP"
            }
        ]
    },
    "record-4": {
        "name": "test-4",
        "data": [
            {
                "value": "blablabla\n            \n            blablabla",
                "description": "data can put newline."
            }
        ]
    },
    "record-5": {
        "name": "this data from website json file",
        "url": "https://cdn.jsdelivr.net/gh/papago89/temp/fav-json"
    }
};

// 控制快捷鍵計數
let ctrlClickCounter = 0;
let ctrlCleanTimeout = null;

// overlay 相關控制
let isShowOverlay = false;
let xPlace = null;
let yPlace = null;

// 保留原先關注的元素便於回覆
let originActiveElement = null;

// 紀錄現在應該指在哪一格資料上
let xActive = 0;
let yActive = 0;

// 符合現在條件的資料
let matchKeyData = {};

(function () {
    'use strict';
    GM_addStyle("table.dicionary {background:inherit;table-layout:fixed;overflow:hidden;}}");
    GM_addStyle("tbody.dicionary,thead.dicionary,tr.dicionary {background:inherit;overflow:hidden;}");
    GM_addStyle("table.dicionary th {padding:5px;text-align:center;background:inherit;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}");
    GM_addStyle("table.dicionary td {padding:5px;background:inherit;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}");
    GM_addStyle("table.dicionary td.active,table.dicionary th.active {border:1px solid blue;font-weight:bold;color:yellow;background:rgba(255,10,20,0.5);}");
    GM_addStyle("table.dicionary td:hover {white-space:normal;overflow:auto}");

    $(document).keyup(e => {
        if (17 == e.keyCode) {
            ++ctrlClickCounter;
            if (null != ctrlCleanTimeout) {
                clearTimeout(ctrlCleanTimeout)
            }
            if (3 == ctrlClickCounter) {
                generateOverlayWhenNotExists();
                if (!isShowOverlay) {
                    displayOverlay();
                } else {
                    undisplayOverlay();
                }
                ctrlClickCounter = 0;
            } else {
                ctrlCleanTimeout = setTimeout(() => ctrlClickCounter = 0, 350);
            }
        }
    });

    $(document).mousemove(e => {
        xPlace = e.pageX;
        yPlace = e.pageY;
    });
})();

function init() {
    let gmJSON = GM_getValue('dictionaryJSON');
    if (null != gmJSON) {
        processDictionaryJSON(gmJSON);
    }
}

function processDictionaryJSON(originalJSON) {
    let promiseList = [];
    for (let key of Object.keys(originalJSON)) {
        if (null != originalJSON[key].url) {
            promiseList.push(new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: originalJSON[key].url,
                    headers: {
                        'User-Agent': 'Mozilla/5.0',
                        'Accept': 'text/json',
                        'Content-Type': 'application/json'
                    },
                    responseType: 'json',
                    onload: function (response) {
                        let tempJSON = Object.assign({}, originalJSON[key]);
                        delete tempJSON['url'];
                        tempJSON.data = response.response;
                        resolve({ 'key': key, 'obj': tempJSON });
                    }
                });
            }));
        }
    }
    if (promiseList.length > 0) {
        Promise.all(promiseList).then(values => {
            for (let value of values) {
                originalJSON[value.key] = value.obj;
            }
            dictionaryJSON = originalJSON;
            $('#dictionarySearchKey')[0].focus();
            searchKeyChangeTrigger($('#dictionarySearchKey')[0].value);
        });
    } else {
        dictionaryJSON = originalJSON;
        $('#dictionarySearchKey')[0].focus();
        searchKeyChangeTrigger($('#dictionarySearchKey')[0].value);
    }
}

function startSetting() {
    let top = (window.screen.height / 2) - 425;
    let left = (window.screen.width / 2) - 540;
    $('body').append(
        '  <div id="dictionarySetting" style="left: ' + left + 'px; top: ' + top + 'px; width: 680px; height: 550px; background: rgba(0, 161, 155, 0.5); color: #ffffff; z - index: 9998; position: fixed; padding: 5px; text - align: center; border - bottom - left - radius: 4px; border - bottom - right - radius: 4px; border - top - left - radius: 4px; border - top - right - radius: 4px;">\n' +
        '    <button id="saveThenCloseBtton" style="height: 40px;">點擊保存並關閉</button>\n' +
        '    <textarea id="dictionarySettingContent" style="top:40px; width: 680px; height: 510px; overflow-y: scroll; z - index: 9999; background: rgba(0, 171, 164, 0.5); color: #ffffff;"></textarea>\n' +
        '  </div>'
    );
    let gmValue = GM_getValue('dictionaryJSON');

    if (null == gmValue) {
        gmValue = dictionaryJSON;
    }

    $('#dictionarySettingContent')[0].value = JSON.stringify(gmValue);

    $('#saveThenCloseBtton').click(saveThenClose);
}

function saveThenClose() {
    let originalJSON = JSON.parse($('#dictionarySettingContent')[0].value);
    GM_setValue('dictionaryJSON', originalJSON);
    processDictionaryJSON(originalJSON);
    $('#dictionarySetting').remove();
}

/**
* 產生 Overlay
*/
function generateOverlayWhenNotExists() {
    if (null != $('#dictionaryOverlay')[0]) {
        return;
    }
    init();
    let top = (window.screen.height / 2) - 425;
    let left = (window.screen.width / 2) - 540;
    $('body').append(
        '  <div id="dictionaryOverlay" style="left: ' + left + 'px; top: ' + top + 'px; width: 680px; height: 550px; display:none; background: rgba(0, 161, 155, 0.5); color: #ffffff; overflow: hidden; z - index: 9998; position: fixed; padding: 5px; text - align: center; border - bottom - left - radius: 4px; border - bottom - right - radius: 4px; border - top - left - radius: 4px; border - top - right - radius: 4px;">\n' +
        '    <button id="dictionarySettingButton" style="font-size: 10px; height: 20px;">設定字典</button>\n' +
        '    <textarea id="dictionarySearchKey" style="top: 20px; width: 680px; height: 20px; background: rgba(0, 171, 164, 0.5); color: #ffffff;"></textarea>\n' +
        '    <div id="dictionaryMain" style="top: 40px; width: 680px; height: 510px; overflow-y: scroll;"></div>\n' +
        '  </div>'
    );

    $('#dictionarySettingButton').click(startSetting);

    matchKeyData = dictionaryJSON;
    generateTableByMatchKeyData();

    $(document).keydown(e => {

        debounce(() => {
            if (isShowOverlay && e.ctrlKey) {
                reCalculate(e);
                rePosition();
            }
        }, 100)();

    });

    $('#dictionarySearchKey').on('input propertychange keyup', e => {
        if (13 == e.keyCode) {
            undisplayOverlay();
            let activeValue = $('#dictionaryData tr td.value.active')[0];
            if (null != activeValue && null != originActiveElement.value) {
                originActiveElement.value += decodeURI(activeValue.dataset.value);
            }
        } else {
            let searchKey = e.currentTarget.value;

            debounce(() => searchKeyChangeTrigger(searchKey), 750)();
        }
    });
}

function debounce(func, delay) {
    // timeout 初始值
    let timeout = null;
    return function () {
        let context = this;  // 指向 myDebounce 這個 input
        let args = arguments;  // KeyboardEvent
        clearTimeout(timeout)

        timeout = setTimeout(function () {
            func.apply(context, args)
        }, delay);
    };
}


/**
 * 根據 searchKey 的變更重新處理相關作業
 */
function searchKeyChangeTrigger(searchKey) {
    if (null != searchKey.match(/^\/(.*)\//)) {
        searchKey = searchKey.match(/^\/(.*)\//)[1];
    } else {
        searchKey = searchKey.replace(/([.(){}\[\]*+\\])/g, '\\$1')
    }
    filterData(new RegExp('.*' + searchKey + '.*'));
    generateTableByMatchKeyData();
}

/**
 * 篩選資料
 */
function filterData(regexp) {
    let temp = {};
    for (let key of Object.keys(dictionaryJSON)) {
        let tempCategory = Object.assign({}, dictionaryJSON[key]);
        tempCategory.data = tempCategory?.data?.filter(data => null != data.value.match(regexp) || null != data?.description?.match(regexp));
        if (tempCategory?.data?.length > 0) {
            temp[key] = tempCategory;
        }
    }
    matchKeyData = temp;
}

/**
 * 根據符合現行條件的內容產生資料
 */
function generateTableByMatchKeyData() {
    $('#dictionaryMain')[0].innerHTML = '';

    if (xActive >= Object.keys(matchKeyData).length) {
        xActive = 0;
    }

    let activeKey = Object.keys(matchKeyData)[xActive];

    if (yActive > matchKeyData[activeKey]?.data?.length) {
        yActive = 0;
    }

    let categoryHTML = '<table id="dictionaryCategory" class="dicionary" style="width:100%;"><thead><tr>';
    for (let key of Object.keys(matchKeyData)) {
        categoryHTML += `<th>${matchKeyData[key].name}</th>`;
    }
    categoryHTML += '</tr></thead></table>';
    $('#dictionaryMain').append(categoryHTML);

    let dataHTML = '<table id="dictionaryData" class="dicionary" style="width:100%;"><tbody>';

    for (let i in matchKeyData[activeKey]?.data) {
        let data = matchKeyData[activeKey]?.data[i];
        dataHTML += `<tr data-x-position="${xActive}" data-y-position="${i}"><td class="value" data-value="${encodeURI(data.value)}" style="width:70%;">${data.value}</td><td style="width:30%;">${null != data.description ? data.description : ''}</td></tr>`;
    }
    dataHTML += '</tbody></table>';
    $('#dictionaryMain').append(dataHTML);

    rePosition();
    $('#dictionaryData tr').click(e => {
        if (!isShowOverlay) {
            return;
        }
        xActive = parseInt(e.currentTarget.dataset.xPosition);
        yActive = parseInt(e.currentTarget.dataset.yPosition);
        rePosition();

        let activeValue = $('#dictionaryData tr td.value.active')[0];
        let decodedValue = decodeURI(activeValue.dataset.value);
        if (e.button == 0 && e.ctrlKey) {
            $('#dictionarySearchKey')[0].value = decodedValue;
            $('#dictionarySearchKey')[0].focus();
            searchKeyChangeTrigger(decodedValue);
        } else if (e.button == 0) {
            undisplayOverlay();
            if (null != originActiveElement.value) {
                originActiveElement.value += decodedValue;
            }
        }
    });
}

/**
 * 顯示 Overlay
 */
function displayOverlay() {
    $('#dictionaryOverlay')[0].style.display = '';
    $('#dictionaryOverlay')[0].style.left = xPlace + 'px';
    $('#dictionaryOverlay')[0].style.top = yPlace + 'px';
    $('#dictionaryOverlay')[0].style.top = yPlace + 'px';
    originActiveElement = document.activeElement;
    $('#dictionarySearchKey')[0].focus();
    isShowOverlay = !isShowOverlay;
}

/**
 * 隱藏 Overlay
 */
function undisplayOverlay() {
    $('#dictionaryOverlay')[0].style.display = 'none';
    $('#dictionarySearchKey')[0].value = '';
    originActiveElement.focus();
    isShowOverlay = !isShowOverlay;
}

/**
 * 計算現在有效索引的資料
 */
function reCalculate(e) {
    let dataCount = $('#dictionaryData tr').length;
    let categoryCount = Object.keys(matchKeyData).length;
    let switchCategory = false;

    if (37 == e.keyCode) { //move left or wrap
        if (xActive > 0) {
            xActive = xActive - 1;
            switchCategory = true;
        }
    }
    if (38 == e.keyCode) { // move up
        yActive = (yActive > 0) ? yActive - 1 : yActive;
    }
    if (39 == e.keyCode) { // move right or wrap
        if (xActive < categoryCount - 1) {
            xActive = xActive + 1;
            switchCategory = true;
        }
    }
    if (40 == e.keyCode) { // move down
        yActive = (yActive < dataCount - 1) ? yActive + 1 : yActive;
    }

    if (switchCategory) {
        generateTableByMatchKeyData();
    }
}

/**
 * 根據有效定位上色
 */
function rePosition() {
    $('.active').removeClass('active');
    $('#dictionaryData tr td').eq(yActive * 2).addClass('active');
    $('#dictionaryData tr td').eq(yActive * 2 + 1).addClass('active');
    $('#dictionaryMain tr th').eq(xActive).addClass('active');
    let calcTop = $('#dictionaryCategory')[0].offsetHeight + yActive * ($('#dictionaryData')[0].offsetHeight / $('#dictionaryData tr').length);
    if (calcTop - 255 > 0) {
        $('#dictionaryMain')[0].scrollTop = calcTop - 255;
    } else {
        $('#dictionaryMain')[0].scrollTop = 0;
    }
}