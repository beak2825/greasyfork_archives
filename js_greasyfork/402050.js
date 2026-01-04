// ==UserScript==
// @name            控制网页使用限制 单独域名版
// @namespace       http://tampermonkey.net/
// @version         0.9
// @description     可以记录在不同的网站的使用时间，设置每个网站的可用时间，如果到达了指定的时间，页面会被遮挡而无法正常
// @author          lavaf
// @match 		    https://*/*
// @match		    http://*/*
// @grant           GM.setValue
// @grant           GM.getValue
// @grant           GM.deleteValue
// @grant           GM.listValues
// @grant           window.close
// @noframes
// @require         https://cdn.bootcss.com/jquery/3.4.1/jquery.js
// @require         https://cdn.bootcss.com/jqueryui/1.12.1/jquery-ui.js
// @downloadURL https://update.greasyfork.org/scripts/402050/%E6%8E%A7%E5%88%B6%E7%BD%91%E9%A1%B5%E4%BD%BF%E7%94%A8%E9%99%90%E5%88%B6%20%E5%8D%95%E7%8B%AC%E5%9F%9F%E5%90%8D%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/402050/%E6%8E%A7%E5%88%B6%E7%BD%91%E9%A1%B5%E4%BD%BF%E7%94%A8%E9%99%90%E5%88%B6%20%E5%8D%95%E7%8B%AC%E5%9F%9F%E5%90%8D%E7%89%88.meta.js
// ==/UserScript==


(async function () {
    'use strict';
    //region load css
    addStyle("@import 'https://cdn.bootcss.com/jqueryui/1.12.1/jquery-ui.css'");
    addStyle(".web-page-usage-input-item input{width: 80%}")
    /**
     * 添加style 标签到页面
     * @param style
     * @return {HTMLElement}
     */
    function addStyle(style) {
        const head = document.getElementsByTagName("HEAD")[0];
        const ele = head.appendChild(window.document.createElement('style'));
        ele.innerHTML = style;
        return ele;
    }

    //endregion load css
    //region function data
    let usage;

    /**
     * 删除数据
     * @return {Promise<void>}
     */
    async function deleteData() {
        try {
            // noinspection JSUnresolvedVariable
            if (GM !== undefined && GM.deleteValue !== undefined && typeof GM.deleteValue == 'function') {
                // noinspection JSUnresolvedVariable,JSUnresolvedFunction
                await GM.deleteValue(realKey);
            }
        } catch (e) {
            // console.log(log_key, 'error', e)
        }
    }

    /**
     * @param index {String}
     * @returns {Promise<null|String>}
     */
    async function getData(index = realKey) {
        try {
            // noinspection JSUnresolvedVariable
            if (GM !== undefined && GM.getValue !== undefined) {
                // noinspection JSUnresolvedVariable,JSCheckFunctionSignatures
                let data = await GM.getValue(index).catch((reason => {
                    console.log(log_key, 'error in promise catch', reason);
                }));
                if (data === undefined) {
                    console.log(log_key,'getData data undefined')
                    return null;
                }
                let dataObject=JSON.parse(data);
                if (dataObject.statistics.merge === undefined) {
                    return data;
                } else {
                    return await getData(dataObject.statistics.merge);
                }
            }
        } catch (e) {
            console.log(log_key, 'error in try-catch getData', e)
        }
        return null;
    }

    /**
     *
     * @param key {String}
     * @return {Promise<null|String|>}
     */
    async function getRealKey(key) {
        console.log(log_key,"getRealKey param:key",key)
        try {
            // noinspection JSUnresolvedVariable
            if (GM !== undefined && GM.getValue !== undefined) {
                // noinspection JSUnresolvedVariable,JSCheckFunctionSignatures
                let valueString = await GM.getValue(key).catch((reason => {
                    console.log(log_key, 'error in promise catch', reason);
                }));
                if (valueString === undefined) {
                    return key;
                }
                console.log(log_key,"getRealKey valueString",valueString)
                let valueObject=JSON.parse(valueString);
                if (valueObject.statistics.merge === undefined) {
                    console.log(log_key,'getRealKey 没有继续合并')
                    return key;
                } else {
                    if (valueObject.statistics.merge.indexOf(key_base) >= 0) {
                        if (valueObject.statistics.merge===key){
                            throw new Error("出现回环")
                        }
                        return await getRealKey(valueObject.statistics.merge);
                    } else {
                        throw new Error("存储数据时出错，导致获取的key 非法")
                    }
                }
            }
        } catch (e) {
            console.log(log_key, 'error in try-catch getRealKey', e)
        }
        return null;
    }
    /**
     * 获取其他域的数据
     * @param key 保存数据的键
     * @returns {Promise<null|JSON>}
     */
    async function getOtherData(key) {
        // console.log(log_key, 'getOtherData called:key:', key);
        try {
            // console.log(log_key,'getOtherData current key',newVar)
            // noinspection JSUnresolvedVariable
            if (GM !== undefined && GM.getValue !== undefined) {
                // noinspection JSUnresolvedVariable
                let valueString = await GM.getValue(key).catch((reason => {
                    console.log(log_key, 'error in promise catch', reason);
                }));
                let ob=JSON.parse(valueString);
                if (valueString != null) {
                    if (ob.statistics.merge === undefined)
                        return ob;
                    else
                        return await getOtherData(ob.statistics.merge);
                }
            }
        } catch (e) {
            console.log(log_key, 'error in try-catch getOtherData', e)
        }
        return null;
    }

    /**
     * 保存数据
     * @param remedy 保存时是否修复差距，比如还有一个页面写入这个内容，获取他的数据，然后添加自己的数据，基本上这样会叫上2 秒
     * @returns {Promise<void>}
     */
    async function saveData(remedy = true) {
        console.log(log_key, "savedData called")
        if (remedy)
            await remedyTimeDiff();
        let value = JSON.stringify(usage);
        try {
            // noinspection JSUnresolvedVariable
            if (GM !== undefined && GM.setValue !== undefined && typeof GM.setValue == 'function') {
                // noinspection JSUnresolvedVariable,JSUnresolvedFunction
                await GM.setValue(realKey, value);
            }
        } catch (e) {
            // console.log(log_key, 'error', e)
        }
    }

    /**
     *
     * @returns {Promise<null|Array>}
     */
    async function getList() {
        try {
            // noinspection JSUnresolvedVariable
            if (GM !== undefined && GM.listValues !== undefined && typeof GM.listValues == 'function') {
                // noinspection JSUnresolvedVariable,JSUnresolvedFunction
                return await GM.listValues();
            }
        } catch (e) {
            // console.log(log_key, 'error', e)
        }
        return null;
    }

    /**
     * 新建一个对象
     * @return {{restrict: {single: undefined, domain, limit: undefined, interval: undefined}, statistics: {single: {date: undefined, time: number}|null, data: [], domain}}}
     */
    function newObject() {
        return {
            'restrict': {'domain': current_domain, 'limit': undefined, single: undefined, "interval": undefined},
            'statistics': {
                'domain': current_domain,
                'data': [],
                "single": {'time': 0, "date": undefined},
                'merge': undefined
            }
        };
    }

    /**
     * 获取数据，解析成json对象
     * @return {{'restrict':{'domain':String,'limit':Number,'single':Number},statistics:{'domain':String,'data':[{year:Number,month:Number,day:Number,time:Number}]}}}
     */
    async function getUsage(save = false) {
        let data = await getData();
        // console.log(log_key, 'data:', data);
        if (data == null) {
            console.log(log_key, "initUsage", "getData return null，可能是合并的数据被删除，此时需要重置合并选项，填写-1，点击确认即可");
            let usage = newObject();
            if (save)
                await saveData();
            return usage;
        } else {
            let parse = JSON.parse(data);
            if (parse.restrict === undefined || parse.statistics === undefined) {
                console.log(log_key, 'script data is null');
                let usage = newObject();
                if (save)
                    await saveData();
                return usage;
            }
            return parse;
        }
    }

    async function initUsage() {
        usage = await getUsage();
        //console.log(log_key, 'after initUsage usage:', usage);
    }

    //endregion function data
    //let message = "web_page_usage_init";
    if (window.top !== window.self) {
        //console.log(message,"Current environment is frame")
        return;
    }
    let webPageUsage = "web_page_usage";
    console.log(webPageUsage, 'start');


    //region init key-url
    let current_h_href = location.href;
    //console.log(message, "current_h_href", current_h_href);
    let reg = new RegExp(/^(?:(?:ftp|http[s]?)?:\/\/)?(?:[\dA-Za-z-]+\.)+[\dA-Za-z-]+(?::[\d]{1,4})*/);
    let reg_localhost = new RegExp(/^(?:(?:ftp|http[s]?)?:\/\/)?localhost(?::[\d]{1,4})*/);
    let result = reg.exec(current_h_href);
    if (result == null) {
        //console.log(message, 'reg 不匹配');
        result = reg_localhost.exec(current_h_href);
        if (result == null) {
            //console.log(message, "result is null");
            return
        }
    }
    // console.log(log_key, "result:", result);
    let current_domain = result[0];
    // let url_part = current_domain.split(".");
    // current_domain=url_part[url_part.length-2]+"."+url_part[url_part.length-1]
    // console.log(log_key,current_domain);

    let log_key = webPageUsage + "->" + current_domain;
    let key_base = "f-usage-data-";
    let key = key_base + current_domain;
    let realKey=await getRealKey(key);
    if (realKey.indexOf(key_base)!=0) {
        realKey=key_base+realKey;
    }
    console.log(log_key,"key",key,'realKey',realKey);
    //endregion key-url
    await initUsage();
    if (usage === undefined) {
        //console.log(log_key, "usage is null");
        usage = {};
    }
    let statistics_data = usage.statistics;
    let restrict_data = usage.restrict;
    let current_statistics = getDomainStatisticsTimeObject();
    //console.log(log_key, 'current_statistics', current_statistics);
    let statisticsTimer;
    let checkTimer;
    let counter = 0;
    let printTimer;
    //region ui
    let manager_panel = $("<div>", {id: "web_page_usage_manager_panel_id", 'translate': 'no'});
    manager_panel.appendTo('body');
    let web_page_usage_z_index = 10000001;
    let dialog_z_index = '10000001';
    let curtain_z_index = 10000000;
    manager_panel.css({
        'position': 'fixed',
        'left': '0',
        'top': '50%',
        'z-index': web_page_usage_z_index,
        'background-color': 'white',
        'border': '1px solid black'
    });

    //region statistics
    let statistics_panel = $('<div>');
    let totalTimeWasteLabel = $("<p>");
    totalTimeWasteLabel.appendTo(statistics_panel);
    let statistics_ol = $('<ol>', {id: "web-page-usage-statistics-ol"});
    statistics_ol.css({'height': "100px", 'overflow-y': 'scroll'});
    statistics_ol.appendTo(statistics_panel);
    let currentSecond = $("<span>");
    currentSecond.appendTo(statistics_panel);
    currentSecond.title = "当前计算时间的秒数 当前页面从打开直到现在的秒数"
    let clear_data_button = $("<button>");
    clear_data_button.text("clear");
    clear_data_button.click(async function () {
        clearInterval(statisticsTimer);
        clearInterval(checkTimer);
        await deleteData();
        await initUsage();
        statistics_data = usage.statistics;
        restrict_data = usage.restrict;
        current_statistics = getDomainStatisticsTimeObject();
        startTimer();
    });
    clear_data_button.appendTo(statistics_panel);

    //endregion statistics
    statistics_panel.appendTo(manager_panel);
    let color = manager_panel.css('color');
    // console.log(color);
    let b = color === 'white' || color === 'rgb(255, 255, 255)';
    if (b) {
        manager_panel.css('color', 'black');
    }
    //region dialog
    let dialog = $("<div>", {id: 'web-page-usage-usage-dialog'});
    dialog.css("display", 'none')
    let dialog_ol = $("<ol>");
    dialog_ol.appendTo(dialog);
    dialog.appendTo('body');
    //endregion dialog
    //region restrictPanel
    let restrictPanelString = `<div id="web-page-usage-restrictPanel">
        <div id="web-page-usage-top"></div>
        <div id="web-page-usage-center">
            <button id="web-page-usage-view" class="notranslate" translate="no">查看数据</button>
            <button id="web-page-usage-import" class="notranslate" translate="no">导入</button>
            <button id="web-page-usage-export" class="notranslate" translate="no">导出</button>
        </div>
    </div>`;
    $("#web-page-usage-export").click(function () {
        console.log(log_key, '复制后面的内容用于以后导入', usage)
    });
    let restrictPanel = $($.parseHTML(restrictPanelString));
    let dialog_string =
        `<div style="display: none">
            到达单次使用限制了
        </div>`;
    let singleDialog = $($.parseHTML(dialog_string));
    singleDialog.css('display', 'none');
    singleDialog.appendTo('body');
    restrictPanel.appendTo(manager_panel);
    let top = $('div#web-page-usage-top');
    let input_string = `<div style="display: block">
			<div class="web-page-usage-input-item">
				<label for="add_input_data">url:</label>
				<input type="url" id="add_input_data">
			</div>
			<div class="web-page-usage-input-item">
			    <label for="add_input_merger">merger:</label>
			    <input type="url" id="add_input_merger">
            </div>
            <button id="saveMergerButton">保存</button>
			<div class="web-page-usage-input-item">
				<label for="add_input_limit_time">time:</label>
				<input type="number" id="add_input_limit_time">
			</div>
			<button id="saveLimitButton">保存总时长使用限制</button>
			<div class="web-page-usage-input-item">
			    <label for="add_input_single_limit">single:</label>
			    <input type="number" id="add_input_single_limit">
            </div>
            <button id="save_single_limit">保存单次使用限制</button>
            <div class="web-page-usage-input-item">
                <label for="add_input_time_interval">interval:</label>
                <input id="add_input_time_interval" type="number">
            </div>
            <button id="save_single_interval">保存单次使用间隔</button>
		</div>`;

    let input_div = $($.parseHTML(input_string));
    input_div.appendTo(top);
    let saveButton = $("#saveLimitButton");
    let input_url = $("#add_input_data");
    input_url.val(current_domain);
    let input_limit = $("#add_input_limit_time");
    input_limit.val(restrict_data.limit);
    let inputSingleLimit = $("#add_input_single_limit");
    inputSingleLimit.val(restrict_data.single);
    let interval = $("#add_input_time_interval")
    interval.val(restrict_data.interval)
    let saveSingleInterval = $("#save_single_interval")
    let inputUrlMerger=$("#add_input_merger")
    let saveMergerButton=$("#saveMergerButton")

    if (key === realKey) {
        inputUrlMerger.val(-1);
    } else {
        inputUrlMerger.val(realKey)
    }
    saveMergerButton.click(async function (){
        stopTimer()
        let merge = inputUrlMerger.val();
        if (merge == "-1") {
            statistics_data.merge = undefined;
        } else {
            let realKey1 = await getRealKey(key_base+merge);
            statistics_data.merge= realKey1;
            await saveData();//存储当前的merger
            alert("请刷新页面")
            // console.log(log_key,'update merger','merger',merge,realKey1," ",realKey)
        }
        // await afterUpdateConfig();
    })

    saveButton.click(async function () {
        stopTimer();
        //获取input 中的内容
        let url = input_url.val();
        console.log(log_key, "添加限制", url, input_limit.val());
        let limit = parseInt(input_limit.val());
        if (limit === Number.NaN || limit === -1) {
            restrict_data.limit = undefined;
        } else {
            // noinspection JSValidateTypes
            restrict_data.limit = limit;
            console.log(log_key, "保存", limit, restrict_data);
        }

        await afterUpdateConfig();
    });
    let saveSingleButton = $("#save_single_limit");
    saveSingleButton.click(async function () {
        stopTimer();
        //获取input 中的内容
        //let url = input_url.val();
        // noinspection JSValidateTypes8
        let single = parseInt(inputSingleLimit.val());
        if (single === Number.NaN || single === -1) {
            restrict_data.single = undefined;
        } else {
            restrict_data.single = single;
        }
        await afterUpdateConfig();
    });

    saveSingleInterval.click(async function () {
        stopTimer();
        let interval1 = parseInt(interval.val());
        if (interval1 === Number.NaN || interval1 === -1) {
            restrict_data.interval = undefined;
        } else {
            restrict_data.interval = interval1;
        }
        await saveData();
        startTimer();
        printList();
    })
    // let center = $('div#center');
    let viewStatisticsButton = $('button#web-page-usage-view');
    viewStatisticsButton.click(async function () {
        dialog_ol.children().remove();
        let list = await getList();
        console.log(log_key, 'list', list, 'type', typeof list);
        let space = 0;
        for (let index = 0; index < list.length; index++) {
            let k = list[index];
            let realKey=await getRealKey(k);
            if (realKey !== k) {
                space+=" merge to "+realKey;
                continue;
            }
            let temp = await getOtherData(k);
            space += JSON.stringify(temp).length;
            // console.log(log_key, 'temp', temp);
            let domain_item = temp.statistics.domain;
            let ol_div = $("<details>");
            let ol_div_ol = $("<ol>");
            let timeData = temp.statistics['data'];
            if (timeData == null) {
                continue;
            }
            let timeSum = 0;
            for (let day = 0; day < timeData.length; day++) {
                let ol_div_ol_p = $("<p>");
                let todayTimeData = timeData[day];
                let time = todayTimeData['time'];
                timeSum += time;
                ol_div_ol_p.text(`${todayTimeData['year']}-${todayTimeData['month']}-${todayTimeData['day']}: ${format(time)}`);
                ol_div_ol_p.appendTo(ol_div_ol);
            }
            let ol_div_legend = $("<summary>", {text: domain_item + " " + format(timeSum) + (temp.restrict.limit !== undefined ? " ⌛" + temp.restrict.limit : "")});
            ol_div_legend.appendTo(ol_div);
            ol_div_ol.appendTo(ol_div);
            /**
             *
             * @type {Object}
             */
            let position = null;
            for (let y = 0; y < dialog_ol.children().length; y++) {
                let $1 = $(dialog_ol.children().get(y));
                if (parseInt($1.attr('data-timeData-sum')) < timeSum) {
                    position = $1;
                    break;
                }
            }
            if (position != null) {
                position.before(ol_div);
            } else
                ol_div.appendTo(dialog_ol);
            ol_div.attr('data-timeData-sum', timeSum);
        }

        if (dialog.dialog == null || typeof dialog.dialog !== "function") {
            dialog.dialog = function () {
                console.log(log_key, "启动对话框失败");
            }
        }
        dialog.dialog({
            title: '所有数据:数据占用空间' + space,
            modal: true,
            height: document.body.clientHeight / 2,
            width: document.body.clientWidth / 2,
            'minWidth': '300',
            open: function (event, ui) {

            },
            buttons: {
                'close': function () {
                    $(this).dialog("close");
                }
            }
        });
        let elementsByClassName = document.getElementsByClassName('ui-dialog');
        for (let i = 0; i < elementsByClassName.length; i++) {
            if (elementsByClassName[i].innerText.indexOf("所有数据") >= 0)
                elementsByClassName[i].style.zIndex = dialog_z_index
        }
    });
    viewStatisticsButton.dblclick(function () {
        clearInterval(statisticsTimer);
    });
    let bottom = $('<div>', {
        "id": "web-page-usage-bottom"
    });
    bottom.css({'height': "100px"});
    let ol = $("<ol>", {
        id: 'web-page-usage-restrictPanel-ol'
    });
    ol.appendTo(bottom);
    bottom.appendTo(restrictPanel);
    printList();

    //endregion restrictPanel


    //region button
    let button = $('<button>', {
        id: 'web-page-usage-toggle',
        text: '打开',
        'translate': 'no',
        'class': 'notranslate'
    });
    button.css({
        'position': 'fixed',
        'top': '50%',
        'left': 0,
        'z-index': web_page_usage_z_index
    });
    let show = true;

    function showOrHide() {
        if (!show) {
            //let top = button.css('top');
            //let height = button.css('height');
            let height2 = innerHeight;
            let left = button.css('width')
            // console.log(log_key,'showOrHide',top,height);
            manager_panel.css('left', left);
            let height3 = parseInt(manager_panel.css('height'));
            //console.log(log_key, "height2", height2, "height3", height3)
            manager_panel.css('top', (height2 - height3) / 2);
            manager_panel.show();
            show = true;
        } else {
            manager_panel.hide();
            show = false
        }
    }

    button.click(function () {
        showOrHide();
        if (show) {
            printToday();
            addPrintTimer();
        } else {
            clearInterval(printTimer);
        }
    });
    button.appendTo('body');
    //endregion button
    let curtain = $('<div>', {
        height: '100%',
        width: '100%',
    });

    curtain.css({
        'background-color': 'black',
        'position': 'fixed',
        'top': 0,
        'left': 0,
        'z-index': curtain_z_index,
        'color': 'white',
        "text-align": "center",
        'display': 'grid',
        'align-items': 'center',
        'font-size': '50px'
    });
    // curtain.text("超时");
    curtain.appendTo('body');
    curtain.hide();
    showOrHide();
    console.log(log_key, 'single.time', statistics_data.single.time, 'single', restrict_data.single, 'interval', restrict_data.interval)
    let lastDate = new Date(statistics_data.single.date);
    let currentDate = new Date();
    if (statistics_data.single.time >= restrict_data.single && restrict_data.interval != null) {
        console.log(log_key, "current", currentDate, "last", lastDate)
        let past = (currentDate - lastDate) / 1000;
        console.log(log_key, "差", past);
        if (past < restrict_data.interval) {
            curtain.text("超时,请等待" + format(restrict_data.interval - past));
            reachTimeLimit();
            // console.log(log_key, "请等待一段时间之后");
            return;
        } else {
            statistics_data.single.time = 0;
            statistics_data.single.date = new Date();
            await saveData(false);
        }
    } else {
        console.log(log_key, "未进入时间检查阶段");
        if (lastDate.getDate() < currentDate.getDate()) {
            //新的一天
            statistics_data.single.time = 0;
            statistics_data.single.date = new Date();
            await saveData(false);
        } else if (lastDate.getDate() > currentDate.getDate()) {
            console.log(log_key, "出现了错误,如果不是修改了系统时间，可以与作者联系")
        }
    }
    //endregion ui
    //region start timer

    startTimer();


    //endregion start timer
    /**
     * 获取已经添加到ol列表中的域名，然后从数据中获取当天的消息，然后打印出来，只会做已经打印出来的，后面添加的消息不会处理，除非重新打开
     */
    function addPrintTimer() {
        //console.log(log_key, 'addPrintTimer called');
        printTimer = setInterval(async function () {
            let child = statistics_ol.children();
            for (let j = 0; j < child.length; j++) {
                // console.log(log_key, 'printToday:local_usage:', local_usage);
                let item_li = $(child[j]);
                let domain_ui = item_li.children().get(0);
                let local_usage = await getOtherData(key_base + domain_ui.innerText);
                if (local_usage.statistics === undefined || local_usage.restrict === undefined) {
                    continue;
                }
                let today = getTodayStatisticsTimeObject(local_usage);
                if (today == null) {
                    continue;
                }
                let todayElement = today.time;
                let currentTime = format(todayElement);
                let time_ui = $(item_li.children().get(1));
                if (time_ui.text() !== currentTime) {
                    time_ui.text(currentTime);
                }
                // noinspection EqualityComparisonWithCoercionJS
                if (item_li.attr('data-time') != todayElement) {
                    time_ui.animate({'background-color': 'red'}, '500');
                    time_ui.animate({'background-color': 'white'}, '500');
                    item_li.attr('data-time', todayElement);
                }
            }
        }, 2000);
    }
    function printList() {
        if (ol.children().length !== 0)
            ol.children().remove();
        if (restrict_data.limit != null) {
            let li = $('<li>');
            li.text(restrict_data['domain'] + " limit:" + format(restrict_data.limit) + " " + restrict_data.limit + "s");
            li.appendTo(ol)
        }
        if (restrict_data.single != null) {
            let li = $('<li>');
            li.text(restrict_data['domain'] + " single:" + format(restrict_data.single) + " " + restrict_data.single + "s");
            li.appendTo(ol)
        }
        if (restrict_data.interval != null) {
            let li = $("<li>")
            li.text(restrict_data['domain'] + " interval:" + format(restrict_data.interval) + " " + restrict_data.interval + "s")
            li.appendTo(ol);
        }
    }

    /**
     * 更新了配置之后调用
     * @return {Promise<void>}
     */
    async function afterUpdateConfig() {
        console.log(log_key,'afterUpdateConfig called')
        await saveData();
        curtain.hide();
        startTimer();
        printList();
        console.log(log_key,'afterUpdateConfig return')
    }
    /**
     * 监听当前页面
     */
    function addStatisticTimer() {
        //console.log(log_key, 'addStatisticTimer called');
        statisticsTimer = setInterval(async function () {
            // console.log(log_key, "over-all called");
            current_statistics.time++;
            counter++;
            // console.log(log_key,'before',statistics_data.single)
            // noinspection JSIncompatibleTypesComparison
            if (statistics_data.single == null) {
                alert("版本问题，需要卸载当前脚本，重新安装")
            } else {
                statistics_data.single.time++;
                statistics_data.single.date = new Date();
            }
            // console.log(log_key,'after',statistics_data.single)

            await saveData();
            let current = format(current_statistics.time);
            if (button.text() !== current)
                button.text(current + ":" + statistics_data.single.time);
            if (navigator.userAgent.indexOf('Android') < 0) {
                button.animate({'opacity': (current_statistics.time % 10) / 20 + 0.5}, '500');
                button.animate({'opacity': 1}, '500');
            }
            if (show) {
                currentSecond.text("秒数:" + current_statistics.time % 60 + " 计时:" + (counter) + " 连续使用计时:" + statistics_data.single.time);
            }
        }, 1000);
    }

    function reachTimeLimit() {
        curtain.show();
        stopTimer();
    }

    /**
     * 检测当前页面是否超时
     */
    function addCheckRestrictTimer() {
        //console.log(log_key, "addCheckRestrictTimer called");
        checkTimer = setInterval(function () {
            if (restrict_data.limit != null) {
                if (current_statistics.time >= restrict_data.limit) {
                    console.log(log_key, "超时");
                    curtain.text("超过设定的" + format(restrict_data.limit) + "限制")
                    // GM_notification(current_domain+"超时了",function () {
                    //     window.close();
                    // })
                    reachTimeLimit();
                    return;
                }
            }
            //console.log(log_key, "restrict single", restrict_data.single, "statistics single", statistics_data.single.time)
            if (restrict_data.single !== undefined && statistics_data.single.time >= restrict_data.single) {
                let value = "超过连续使用限制" + format(restrict_data.single) + " 请等待" + format(restrict_data.interval);
                console.log(log_key, "到达连续使用限制", value);
                curtain.text(value);

                singleDialog.dialog({
                    resizable: false,
                    height: "auto",
                    width: 400,
                    modal: true,
                    buttons: {
                        "continue": async function () {
                            console.log(log_key, 'interval', restrict_data.interval);
                            if (restrict_data.interval != null) {
                                $(this).dialog("close");
                                window.close();
                                // let sc=document.createElement("script")
                                // sc.innerText="window.close();"
                                // document.body.appendChild(sc)
                            } else {
                                $(this).dialog("close");
                                curtain.hide();
                                statistics_data.single.time = 0;
                                statistics_data.single.date = new Date();
                                //console.log(log_key, "restrict single", restrict_data.single, "statistics single", statistics_data.single.time)
                                await saveData(false);
                                //console.log(log_key, "restrict single", restrict_data.single, "statistics single", statistics_data.single.time)
                                startTimer();
                            }
                        },
                        'close': function () {
                            $(this).dialog("close");
                            window.close();
                        }
                    }
                });

                // GM_notification({'title':"管理","text":current_domain+"超过单次使用限制"}, function () {
                //     window.close();
                // })
                let elementsByClassName = document.getElementsByClassName('ui-dialog');
                for (let i = 0; i < elementsByClassName.length; i++) {
                    if (elementsByClassName[i].innerHTML.indexOf("到达") >= 0)
                        elementsByClassName[i].style.zIndex = dialog_z_index;
                }
                reachTimeLimit();
            }
        }, 1000)

    }

    function startTimer() {
        //console.log(log_key, "startTimer called");
        addStatisticTimer();
        addCheckRestrictTimer();
    }

    function stopTimer() {
        console.log(log_key, 'stopTimer called');
        if (statisticsTimer != null)
            clearInterval(statisticsTimer);
        if (checkTimer != null) {
            clearInterval(checkTimer);
        }
    }

    async function printToday() {
        statistics_ol.children().remove();
        let list = await getList();
        let total = 0;

        for (let i = 0; i < list.length; i++) {
            let temp = await getOtherData(list[i]);
            // console.log(log_key, 'printToday:temp:', temp);
            if (temp.statistics === undefined || temp.restrict === undefined) {
                continue;
            }
            let domainName = list[i].substr(list[i].indexOf("http"));
            let today = getTodayStatisticsTimeObject(temp);
            if (today == null) {
                continue;
            }
            let todayTime = today.time;
            total += todayTime;
            let currentTimeString = format(todayTime);
            let li_string =
                `<li id="li-${i}" style="padding: 5px">
                    <span style="margin-right: 50px">${domainName}</span>
                    <span style="float: right">${currentTimeString}</span>
                    <span style="font-size: 10px !important;">${temp.statistics.domain}</span>
                </li>`;
            let item_li = $($.parseHTML(li_string));
            /**
             *
             * @type {Object}
             */
            let position = null;
            for (let y = 0; y < statistics_ol.children().length; y++) {
                let $1 = $(statistics_ol.children().get(y));
                if (parseInt($1.attr('data-time')) < todayTime) {
                    position = $1;
                    break;
                }
            }
            if (position != null) {
                position.before(item_li);
            } else
                // ol_div.appendTo(dialog_ol);
                item_li.appendTo(statistics_ol);
            item_li.attr('data-time', todayTime);
            item_li.attr('title', todayTime)
        }
        totalTimeWasteLabel.text("今天所有的网页的时间总和:" + format(total))
    }

    function format(time) {
        if (time === undefined) {
            return "unknown";
        }
        let unit = ['秒', '分钟', '小时'];
        //let unit = ['s', 'm', 'h'];
        let flag = 0;
        while (time >= 60) {
            time = time / 60;
            flag++;
        }
        return time.toFixed(1) + " " + unit[flag];
    }

    // /**
    //  * 获取time limit 的对象
    //  * @param domain
    //  * @return {null|number}
    //  */
    // function getCurrentRestrictLimit(domain) {
    //     if (restrict_data.limit !== undefined) {
    //         return restrict_data.limit;
    //     }
    //     return null;
    // }

    async function remedyTimeDiff() {
        // console.log(log_key,'current1',statistics_data.single)
        // console.log(log_key, 'remedyTimeDiff called');
        let data = await getUsage();
        // console.log(log_key,'current2',statistics_data.single)

        // console.log(log_key, 'data:', data);
        if (data == null) {
            console.log(log_key, 'saveData failed due to getUsage failed');
            return null;
        } else {
            // console.log(log_key,'current3',statistics_data.single)
            let remote = getTodayStatisticsTimeObject(data);
            if (remote == null) {
                console.log(log_key, 'remote is null')
                return;
            }
            // console.log(log_key,'current4',statistics_data.single)
            if (remote.time > current_statistics.time) {
                current_statistics.time += (remote.time - current_statistics.time);
            }
            // console.log(log_key,'远程',data.statistics.single,'current',statistics_data.single)
            // noinspection JSIncompatibleTypesComparison
            if (data.statistics.single == null) {
                console.log(log_key, 'single is null')
                return;
            }
            // console.log(log_key,'single.time',data.statistics.single.time,'current',statistics_data.single,statistics_data.single.time)
            if (data.statistics.single.time > statistics_data.single.time) {
                // console.log(log_key,'执行修复')
                statistics_data.single.time += (data.statistics.single.time - statistics_data.single.time);
            }
        }
    }

    /**
     *
     * @param usage
     * @return {null|JSON}
     */
    function getTodayStatisticsTimeObject(usage) {
        let data = usage.statistics.data;
        if (data === undefined) {
            return null;
        }
        //检查今天的是否存在
        let today = new Date();
        for (let j = 0; j < data.length; j++) {
            let time_day = data[j];
            if (time_day.year === today.getFullYear() &&
                time_day.month === today.getMonth() + 1
                && time_day.day === today.getDate()) {
                // statistics_data.single.time=0
                // statistics_data.single.date=undefined
                return time_day;
            }
        }
        return null;
    }

    /**
     * 获取当前域的统计信息，没有就新建一个返回
     */
    function getDomainStatisticsTimeObject() {
        let dataSource = statistics_data.data;
        let j;
        for (j = 0; j < dataSource.length; j++) {
            let time_day = dataSource[j];
            let today = new Date();
            if (time_day.year === today.getFullYear() &&
                time_day.month === today.getMonth() + 1
                && time_day.day === today.getDate()) {
                return time_day;
            }
        }
        if (j === dataSource.length) {
            let date = new Date();
            let current_statistics = {
                "year": date.getFullYear(),
                "month": date.getMonth() + 1,
                "day": date.getDate(),
                "time": 0
            };
            console.log(log_key, "新建当天统计对象", current_domain, current_statistics);
            statistics_data.data.push(current_statistics);
            return current_statistics;
        }
    }

    window.addEventListener("visibilitychange", async function () {
        if (document.visibilityState === "visible") {
            //console.log(log_key, "visible");
            //重新获取了数据
            await initUsage();
            if (usage === undefined) {
                //console.log(log_key, "usage is undefined");
                usage = {};
            } else {
                //console.log(log_key, "usage isn't undefined");
            }
            statistics_data = usage.statistics;
            restrict_data = usage.restrict;
            //更新统计，因为在别的页面可能也可能增加了时间
            current_statistics = getDomainStatisticsTimeObject();
            // current_statistics = getDomainStatisticsTimeObject(statistics_data.data, current_domain);
            if (restrict_data.limit == null) {
                //console.log(log_key, "addStatisticTimer currentRestrict is null");
            } else {
                //console.log(log_key, 'current:', current_statistics.time, 'limit:', restrict_data.limit);
                if (current_statistics.time >= restrict_data.limit) {
                    //console.log(log_key, "已经超时，不在启动计时");
                    curtain.text("超过" + format(restrict_data.limit) + '时间限制')
                    curtain.show();
                    return
                }
            }
            startTimer();
        } else {
            //console.log(log_key, "invisible");
            //暂停计时更能
            stopTimer();
        }
    });
    //测试功能
    document.body.onfullscreenchange = function (ev) {
        console.log(ev)
    }
})();
