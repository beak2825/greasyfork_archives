// ==UserScript==
// @name         星聚会KTV价格计划程序
// @namespace    https://www.chiro.work/
// @version      0.5
// @description  方便您自动管理KTV价格！
// @author       Chiro
// @match        https://e.dianping.com/fun/ktv/solutiondetail?solutionId=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421311/%E6%98%9F%E8%81%9A%E4%BC%9AKTV%E4%BB%B7%E6%A0%BC%E8%AE%A1%E5%88%92%E7%A8%8B%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/421311/%E6%98%9F%E8%81%9A%E4%BC%9AKTV%E4%BB%B7%E6%A0%BC%E8%AE%A1%E5%88%92%E7%A8%8B%E5%BA%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var progDesc = `
<h3 style="font-size: 20px">程序说明</h3>
<ol>
<li><p>1. 程序安装方法</p>
<ol>
<li>1.1 安装火狐浏览器</li>
<li>1.2 在火狐浏览器的插件中心(<a href="https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/" target="_blank" class="url">https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/</a>)安装油猴脚本插件</li>
<li>1.3 打开脚本链接(<a href="https://greasyfork.org/zh-CN/scripts/421311-%E6%98%9F%E8%81%9A%E4%BC%9Aktv%E4%BB%B7%E6%A0%BC%E8%AE%A1%E5%88%92%E7%A8%8B%E5%BA%8F" target="_blank" class="url">https://greasyfork.org/zh-CN/scripts/421311-%E6%98%9F%E8%81%9A%E4%BC%9Aktv%E4%BB%B7%E6%A0%BC%E8%AE%A1%E5%88%92%E7%A8%8B%E5%BA%8F</a>)安装脚本</li>
<li>1.4 打开后台网页(<a href="https://e.dianping.com" target="_blank" class="url">https://e.dianping.com</a>) -&gt; 交易管理 -&gt; KTV预定 -&gt; 预定价格管理 -&gt; 查看详情 即可。</li>
</ol>
</li>
<li><p>2. 使用说明</p>
<ol>
<li><p>2.1 程序使用流程</p>
<ol>
<li>2.1.1 打开后台网页后，等待程序加载完毕</li>
<li>2.1.2 点击价目表下方的黄色按钮可以选择日期</li>
<li>2.1.3 在每个项目右侧点击<code>计划</code>可以打开当前项目计划窗口</li>
<li>2.1.4 在窗口中可以添加、删除计划</li>
<li>2.1.5 程序会在计划的基础上调整价格</li>
</ol>
</li>
<li><p>2.2 其他说明</p>
<ol>
<li><p>2.2.1 界面说明</p>
<ol>
<li>2.2.1.1 最上方是程序运行日志，指示当前运行信息</li>
<li>2.2.1.2 下方是说明信息</li>
<li>2.2.1.3 再下方是一些操作按钮</li>
</ol>
</li>
<li><p>2.2.2 时间说明</p>
<ol>
<li>2.2.2.1 时间输入格式必须为<code>HH:MM</code>/<code>HH:MM+X</code>/<code>HH:MM-X</code></li>
<li>2.2.2.2 其中X为小于7的整数，表示向前推进(+)或者向后回溯(-)X天，但是不建议使用(-)，可能导致逻辑混乱（指自己看着乱）。</li>
</ol>
</li>
<li><p>2.2.3 不推荐使用</p>
<ol>
<li>2.2.3.1 不推荐在使用本程序调整价格之后再使用原来的“提价”/“恢复”按钮，有可能导致后端信息出错</li>
<li>2.2.3.2 不要在表格内容还未变化之时点击按钮，可能会出现意料之外的结果</li>
</ol>
</li>
</ol>
</li>
</ol>
</li>
</ol>`;
    // 全局变量
    var solutionId = "1834526";
    var shopId = 581990543;
    var table = [];
    // 格式：plan-${week}-${periodId}-${roomType}-${itemName} => []
    var plan = {};
    var week_now = 0;
    var logs_global = [];
    var timmer_running = false;
    for (let i = 0; i < 7; i++) table.push([]);
    var api = 'https://e.dianping.com/sku/api/merchant/ktvreserve/';
    function getQueryString(name) {
        let querys = window.location.href.split('?')[1].split('&');
        for (let q of querys) {
            let qs = q.split('=');
            if (qs.length <= 1) continue;
            if (qs[0] === name) return qs[1];
        }
        return null;
    }
    function removeArray(arr, val) {
        for(var i = 0; i < arr.length; i++) {
            if(arr[i] == val) {
                arr.splice(i, 1);
                break;
            }
        }
    }
    function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }
    function fetchApi(url, args) {
        if (!args) args = {};
        args.credentials = "include";
        args.method = "GET";
        args.mode = "cors";
        return fetch(api + url, args);
    }
    function clearData() {
        plan = {};
        Object.keys(localStorage).forEach(item => item.indexOf('plan') !== -1 ? localStorage.removeItem(item) : '');
    }
    function initData() {
        plan = {};
        // 检查每一个项目
        for (let week = 0; week <= 6; week++) {
            let t = getDataDay(week);
            if (!t) continue;
            let data = t.data;
            for (let d of data) {
                let periodId = d.periodId;
                for (let roomType in d.roomMapItemEntry) {
                    for (let item of d.roomMapItemEntry[roomType]) {
                        let itemName = item.foodDesc;
                        let query = `plan-${week}-${periodId}-${roomType}-${itemName}`;
                        let got = localStorage.getItem(query);
                        if (got === null) continue;
                        plan[query] = JSON.parse(got);
                    }
                }
            }
        }
    }
    function saveData() {
        // 删除plan字段
        Object.keys(localStorage).forEach(item => item.indexOf('plan') !== -1 ? localStorage.removeItem(item) : '');
        for (let query in plan) {
            localStorage.setItem(query, JSON.stringify(plan[query]));
        }
    }
    function insertData(periodId, roomType, itemName, price, week, time) {
        let query = `plan-${week}-${periodId}-${roomType}-${itemName}`;
        let save = {
            time: time,
            price: price
        };
        if (!plan[query]) plan[query] = [];
        if (findData(periodId, roomType, itemName, week, time)) {
            updateData(periodId, roomType, itemName, price, week, time);
            return;
        }
        plan[query].push(save);
        saveData();
    }
    function findData(periodId, roomType, itemName, week, time) {
        let data = getData(periodId, roomType, itemName, week);
        if (!data) return undefined;
        for (let d of data) {
            if (d.time == time) {
                return d;
            }
        }
    }
    function getData(periodId, roomType, itemName, week) {
        let query = `plan-${week}-${periodId}-${roomType}-${itemName}`;
        return plan[query];
    }
    function removeData(periodId, roomType, itemName, week, time) {
        if (!findData(periodId, roomType, itemName, week, time)) return;
        let query = `plan-${week}-${periodId}-${roomType}-${itemName}`;
        for (let i = 0; i < plan[query].length; i++) {
            if (plan[query][i].time === time) {
                removeArray(plan[query], plan[query][i]);
                break;
            }
        }
        saveData();
    }
    function updateData(periodId, roomType, itemName, price, week, time) {
        let now = findData(periodId, roomType, itemName, week, time);
        if (!now) insertData(periodId, roomType, itemName, price, week, time);
        let query = `plan-${week}-${periodId}-${roomType}-${itemName}`;
        let data = plan[query];
        if (!data) return;
        let select = undefined;
        for (let i = 0; i < data.length; i++) {
            if (data[i] == now) {
                select = i;
                break;
            }
        }
        if (select !== undefined) {
            data[select] = {
                time: time,
                price: price
            }
            plan[query] = data;
            saveData();
            return;
        }
    }
    // 请先初始化好table
    function getTimestamp(day=0) {
        return table[day].timestamp;
    }
    function getWeek(timestamp) {
        if (!timestamp) timestamp = new Date().getTime();
        return new Date(timestamp).getDay();
    }
    async function getShopId(solution) {
        return (await(await fetchApi(`solutionshops.json?solutionid=${solution}`)).json()).data[0].shopId;
    }
    async function getReserveDate() {
        table = (await (await fetchApi("queryreservedate.json")).json()).data;
        for (let i = 0; i < table.length; i++) table[i].week = getWeek(table[i].timestamp);
        return table;
    }
    async function getReserveTable() {
        for (let i = 0; i < table.length; i++) {
            let reserveTable = (await (await fetchApi(`queryreservetable.json?shopid=${shopId}&timestamp=${getTimestamp(i)}`)).json()).data.periodList;
            // 注意isSpecialDate可能产生不明确的后果
            table[i].data = reserveTable;
        }
        return table;
    }
    async function updatePrice(itemId, type, price) {
        let result = await (await (fetchApi(`updateprice.json?shopid=${shopId}&itemid=${itemId}&type=${type}&price=${price}`))).json();
        if (result.code != 200) {
            log(`价格调整失败(${result.code})：${result.msg}`);
            await sleep(1500);
            if (result.code != 500) return false;
        }
        // 调整显示的价格
        let btn = $(`[itemid=${itemId}]`);
        if (!btn) return true;
        let disp = $(btn).prev();
        disp.children().get(1).text(price);
        return true;
    }

    function makePlanItem(week, time, price, callback_remove) {
        let weekText = [
            "周日", "周一", "周二", "周三", "周四", " 周五", "周六"
        ];
        let item = document.createElement("div");
        item.className = "plan-item";
        let content = document.createElement("span");
        content.className = "plan-content";
        content.appendChild(document.createTextNode("在"));
        let span_week = document.createElement("span");
        span_week.style = "margin-right: 3px";
        span_week.className = "plan-week";
        week = getTimeDay(time);
        if (week == 7) week = 0;
        span_week.appendChild(document.createTextNode(weekText[week]));
        content.appendChild(span_week);
        let span_time = document.createElement("span");
        span_time.style = "margin-right: 3px";
        span_time.className = "plan-time";
        span_time.appendChild(document.createTextNode(getTimeTime(time)));
        content.appendChild(span_time);
        content.appendChild(document.createTextNode("设置价格为"));
        let span_price = document.createElement("span");
        span_price.style = "margin-left: 3px";
        span_price.className = "plan-price";
        span_price.appendChild(document.createTextNode(`${price}`));
        content.appendChild(span_price);

        let operate = document.createElement("span");
        operate.className = "plan-operate";
        // let button2 = document.createElement("button");
        // button2.className = "btn-operate-modify";
        // button2.appendChild(document.createTextNode("修改"));
        // button2.onclick = callback_modify;
        // operate.appendChild(button2);
        let button = document.createElement("button");
        button.className = "btn-operate-remove";
        button.style = "margin: 10px";
        button.appendChild(document.createTextNode("删除"));
        button.onclick = callback_remove;
        operate.appendChild(button);

        item.appendChild(content);
        item.appendChild(operate);

        return item;
    }

    function updateDialog(periodId, itemId, itemName, roomType) {
        // 查询数据
        let week = week_now;
        let plan_items = getData(periodId, roomType, itemName, week);
        let plan_list = document.querySelector(".plan-list");
        plan_list.innerText = "没有价格调整任务";
        if (plan_items && plan_items.length != 0) {
            plan_list.innerHTML = "";
            for (let plan_item of plan_items) {
                let item_dom = makePlanItem(week, plan_item.time, plan_item.price, () => {
                    // remove
                    removeData(periodId, roomType, itemName, week, plan_item.time);
                    updateDialog(periodId, itemId, itemName, roomType);
                });
                plan_list.appendChild(item_dom);
            }
        }
    }

    function showDialog(periodId, itemId, itemName, roomType) {
        let week = week_now;
        if (!periodId) return;
        let el = document.createElement("div");
        if (document.querySelector(".popup-sty")) el = document.querySelector(".popup-sty");
        el.className = "popup-sty";
        el.style = "z-index: 2300; width: 450px; height: auto; top: 215.9px; left: 285.9px; position: fixed;";
        el.innerHTML = `
<div>
  <div class="pop-close">
    <a class="plan-close">关闭</a>
  </div>
  <div class="inner">
    <h3>设置计划时段</h3>
    <div class="mbox-content">
      <div id="j-modal-1612579177659">
        <div class="branchlist">
          <div class="plan-info" style="display: none;">
            <div>shopId: <span>${shopId}</span></div>
            <div>periodId: <span>${periodId}</span></div>
            <div>week: <span>${week}</span></div>
            <div>itemId: <span>${itemId}</span></div>
            <div>itemName: <span>${itemName}</span></div>
            <div>roomType: <span>${roomType}</span></div>
          </div>
          <div style="width: 100%">
            <div class="plan-list" style="width: 68%; margin: 0 auto;">
            </div>
          </div>
          <br/>
          <div>
            时间：<span><input class="plan-input-time" type="text"></span>
            调整价格到：<span><input class="plan-input-price" type="text"></span><br/>
            <span><button class="btn-operate-add">添加计划</button></span>
          </div>
          <br/>
        </div>
      </div>
    </div>
  </div>
</div>
`;
        el.querySelector(".plan-close").onclick = hideDialog;
        el.querySelector(".btn-operate-add").onclick = () => {
            let time = document.querySelector(".plan-input-time").value;
            let price = document.querySelector(".plan-input-price").value;
            if (!checkTime(time)) {
                alert("时间格式错误！");
                return;
            }
            if (!checkNumber(price)) {
                alert("价格格式错误！");
                return;
            }
            console.log('Add:', periodId, roomType, itemName, price, week, time);
            insertData(periodId, roomType, itemName, price, week, time);
            updateDialog(periodId, itemId, itemName, roomType);
        }
        // console.log('el', el);
        document.body.appendChild(el);
        updateDialog(periodId, itemId, itemName, roomType);
    }

    function hideDialog() {
        document.querySelector(".popup-sty").remove();
        updateButtons();
    }

    function updateButtonsOnClick() {
        let btns = document.querySelectorAll("a.btn-plan");
        for (let i = 0; i < btns.length; i++) {
            btns[i].onclick = function(event) {
                // console.log("event", event);
                let data = JSON.parse(event.target.attributes.data.value);
                // console.log(data)
                showDialog(data.periodId, data.itemId, data.foodDesc, data.roomType);
            }
        }
    }

    function getDataDay(week) {
        for (let t of table) {
            if (week === t.week) {
                return t;
            }
        }
        return undefined;
    }

    function updateButtons() {
        // 检查现在在那个选项卡
        let tab = $("li.nav-item.active").text();
        let week = -1;
        let data = {};
        for (let t of table) {
            if (tab === t.display) {
                week = t.week;
                data = t.data;
                break;
            }
        }
        // console.log('tab now', week);
        week_now = week;
        if (week === -1) {
            console.error("cannot find tab!");
            return;
        }
        // 删掉原来的按钮
        let btns_old = document.querySelectorAll(".btn-plan");
        for (let i = 0; i < btns_old.length; i++) btns_old[i].remove();
        // 逐个搜索时段信息
        let trs = document.querySelectorAll("tbody>tr");
        for (let i = 0; i < trs.length; i++) {
            let tr = trs[i];
            let btns_ = tr.querySelectorAll(".btn-change-price");
            let btns = [];
            for (let btn of btns_) {
                if (btn.innerText.includes('提价')) {
                    btns.push(btn);
                } else if (btn.innerText.includes('恢复')) {
                    btn.style = "background: white; color: gray; text-decoration:line-through; border: 0px";
                }
            }
            let d = data[i];
            if (!d) break;
            // console.log(i, d);
            let roomTypes = {
                "小包": 0,
                "中包": 1,
                "大包": 2
            };
            let btns_index = 0;
            for (let room in d.roomMapItemEntry) {
                // console.log(room);
                for (let j = 0; j < d.roomMapItemEntry[room].length; j++) {
                    let temp = document.createElement("a");
                    let data_ = getData(d.periodId, room, d.roomMapItemEntry[room][j].foodDesc, week);
                    if (data_ && data_.length > 0) {
                        temp.className = "btn btn-change-price btn-plan";
                        temp.appendChild(document.createTextNode(`计划${data_.length}`));
                    } else {
                        temp.className = "btn btn-primary btn-change-price btn-plan";
                        temp.appendChild(document.createTextNode("计划"));
                    }
                    let data_in = d.roomMapItemEntry[room][j];
                    data_in.periodId = d.periodId;
                    data_in.roomType = room;
                    // debugger;
                    temp.setAttribute("data", JSON.stringify(data_in));
                    temp.setAttribute("itemid", d.roomMapItemEntry[room][j].itemId);
                    btns[btns_index].parentElement.insertBefore(temp, btns[btns_index]);
                    // 然后设置这个按钮的状态
                    btns[btns_index].style = "background: white; color: gray; text-decoration:line-through; border: 0px";
                    // console.log("b", temp);
                    // console.log("btn", btns[j + roomTypes[room] * d.roomMapItemEntry[room].length]);
                    btns_index++;
                }
            }
        }
        updateButtonsOnClick();
    }

    function waitTableUpdate() {
        // 等待表格加载
        /*
        return (function() {
            return new Promise((resolve) => {
                // 选择将观察突变的节点
                var targetNode = document.querySelectorAll(".table-wrapper")[0];
                // 观察者的选项(要观察哪些突变)
                var config = { attributes: false, childList: true, subtree: true };
                // 当观察到突变时执行的回调函数
                let done = false;
                var callback = function(mutationsList) {
                    if (done) return;
                    done = true;
                    setTimeout(resolve, 400);
                    // 停止观察
                    observer.disconnect();
                };
                // 创建一个链接到回调函数的观察者实例
                var observer = new MutationObserver(callback);
                // 开始观察已配置突变的目标节点
                observer.observe(targetNode, config);
            });
        })();*/
        return sleep(1700);
    }

    function updateNavClick() {
        let onclick = function() {
            (async function() {
                await waitTableUpdate();
                updateButtons();
                updateNavClick();
            })();
        }
        let lis = document.querySelectorAll("li.nav-item");
        for (let li of lis) {
            li.onclick = onclick;
        }
        // console.log('lis', lis);
    }

    function initInfo() {
        let info = document.createElement("div");
        info.className = "plan-info";
        let log = document.createElement("div");
        let b = document.createElement("b");
        log.className = "plan-log";
        log.style = "font-size: 32px";
        b.appendChild(log);
        let baseInfo = document.querySelector(".baseinfo");
        baseInfo.parentElement.insertBefore(b, baseInfo);
        let desc = document.createElement("div");
        desc.innerHTML = progDesc;
        info.appendChild(desc);
        info.appendChild(document.createElement("br"));
        info.appendChild(document.createTextNode(`星聚会KTV价格自动调整脚本 version 0.1 by Chiro. 技术支持：Chiro2001@163.com、TEL/wx:18178816481`));

        let tipWrapper = document.querySelector(".tips-wrapper");
        tipWrapper.parentElement.insertBefore(info, tipWrapper);
    }

    function showFunctions() {
        let funs = document.createElement("div");
        funs.className = "plan-funs";
        let fun = document.createElement("button");
        fun.className = "btn-funs";
        fun.style = "background-color: #f63; color: #fff; border-color: #f63; border: 1px solid; padding: 5px; font-size: 11px; width: 82px; "
        fun.innerText = "清空计划数据";
        fun.onclick = () => {
            (async function() {
                timmer_running = false;
                await sleep(700);
                clearData();
                log("数据清空成功");
                alert("数据清空成功");
                await sleep(2000);
                location.reload();
            })();
        };
        funs.appendChild(fun);
        // let baseInfo = document.querySelector(".baseinfo");
        // baseInfo.parentElement.insertBefore(funs, baseInfo);
        let tipWrapper = document.querySelector(".tips-wrapper");
        tipWrapper.parentElement.insertBefore(funs, tipWrapper);
    }

    function log(text, record=true) {
        let el = document.querySelector(".plan-log");
        if (!el) return;
        el.innerText = text;
        if (record) logs_global.push(text);
        // console.log('log', text);
    }

    function checkNumber(num) {
        for (let n of num) {
            if (!(('0' <= n && n <= '9') || n === '.')) {
                return false;
            }
        }
        return true;
    }

    function checkTime(time) {
        if (!time) return false;
        let dayOffset = 0;
        try {
            if (time.includes('+')) {
                let split0 = time.split("+");
                time = split0[0];
                dayOffset = parseInt(split0[1]);
            } else if (time.includes('-')) {
                let split0 = time.split("-");
                time = split0[0];
                dayOffset = -parseInt(split0[1]);
            }
        } catch (e) { return false; }
        if (!(-6 <= dayOffset && dayOffset <= 6)) return false;
        let split = time.split(":");
        if (split.length != 2) return false;
        if (!(checkNumber(split[0]) && checkNumber(split[1]))) return false;
        let hour = parseInt(split[0]), minute = parseInt(split[1]);
        if (!(0 <= hour && hour <= 24 && 0 <= minute && minute <= 60)) return false;
        return true;
    }

    function parseTime(time) {
        if (!checkTime(time)) return new Date().getTime();
        let dayOffset = 0;
        if (time.includes('+')) {
            let split0 = time.split("+");
            time = split0[0];
            dayOffset = parseInt(split0[1]);
        } else if (time.includes('-')) {
            let split0 = time.split("-");
            time = split0[0];
            dayOffset = -parseInt(split0[1]);
        }
        let split = time.split(":");
        let hour = parseInt(split[0]), minute = parseInt(split[1]);
        let date = new Date();
        date.setHours(hour);
        date.setMinutes(minute);
        date.setSeconds(0);
        date.setMilliseconds(0);
        let timestamp = date.getTime();
        if (dayOffset) timestamp += 24 * 60 * 60 * 1000 * dayOffset;
        return timestamp;
    }

    function getTimeDay(time) {
        if (!checkTime(time)) return new Date().getDay();
        let dayOffset = 0;
        if (time.includes('+')) {
            let split0 = time.split("+");
            time = split0[0];
            dayOffset = parseInt(split0[1]);
        } else if (time.includes('-')) {
            let split0 = time.split("-");
            time = split0[0];
            dayOffset = -parseInt(split0[1]);
        }
        let split = time.split(":");
        let hour = parseInt(split[0]), minute = parseInt(split[1]);
        let date = new Date();
        date.setHours(hour);
        date.setMinutes(minute);
        date.setSeconds(0);
        date.setMilliseconds(0);
        let timestamp = date.getTime();
        if (dayOffset) timestamp += 24 * 60 * 60 * 1000 * dayOffset;
        return new Date(timestamp).getDay();
    }

    function getTimeTime(time) {
        if (!checkTime(time)) return time;
        let dayOffset = 0;
        if (time.includes('+')) {
            let split0 = time.split("+");
            time = split0[0];
            dayOffset = parseInt(split0[1]);
        } else if (time.includes('-')) {
            let split0 = time.split("-");
            time = split0[0];
            dayOffset = -parseInt(split0[1]);
        }
        return time;
    }

    async function timer() {
        log("Timmer线程开始运行！");
        timmer_running = true;
        let adjusted = localStorage.getItem('plan-adjusted');
        if (!adjusted) adjusted = {};
        try {
            adjusted = JSON.parse(adjusted);
        } catch(e) {
            adjusted = {};
        }
        while (timmer_running) {
            let week = new Date().getDay();
            let line = [];
            let t = getDataDay(week);
            if (!t) continue;
            let data = t.data;
            for (let d of data) {
                let periodId = d.periodId;
                for (let roomType in d.roomMapItemEntry) {
                    for (let item of d.roomMapItemEntry[roomType]) {
                        let itemName = item.foodDesc;
                        let got = getData(periodId, roomType, itemName, week);
                        if (!got || got.length == 0) continue;
                        for (let k = 0; k < got.length; k++) {
                            got[k].periodId = periodId;
                            got[k].roomType = roomType;
                            got[k].itemName = itemName;
                            got[k].week = week;
                            got[k].itemId = item.itemId;
                            got[k].originPrice = item.price;
                            line.push(got[k]);
                        }
                    }
                }
            }
            // 按照time排序
            line.sort((a, b) => {
                return a.time > b.time;
            });
            let stamp = new Date().getTime();
            while (line.length != 0) {
                let item = line[0];
                let target = parseTime(item.time);
                if (target >= stamp) break;
                line.shift();
            }
            let top = line[0];
            let logText = `现在是${new Date(stamp).toLocaleString()}`;
            let deltaStamp = 24 * 60 * 60 * 1000;
            if (top && line.length > 0) {
                deltaStamp = parseTime(top.time) - stamp;
                logText += `，距离下一次调整【${top.periodId}-${top.roomType}-${top.itemName.slice(0, 4) + (top.itemName.length > 4 ? "..." : "")}->${top.price}元】于${new Date(parseTime(top.time)).toLocaleString()}还有${(parseInt(deltaStamp / 1000 / 60 / 60) == 0 ? "" : ("" + parseInt(deltaStamp / 1000 / 60 / 60))) + (deltaStamp > 1000 * 60 * 60 ? "小时" : "")}${(parseInt(deltaStamp / 1000 / 60) % 60) == 0 ? "" : ("" + parseInt(deltaStamp / 1000 / 60) % 60) + ((parseInt(deltaStamp / 1000 / 60) % 60) == 0 ? "" : "分钟")}${parseInt(deltaStamp / 1000) % 60}秒`;
            } else {
                logText += "，最近没有价格调整任务";
            }
            logText += "。";
            log(logText, false);
            // console.log('line', line);
            await sleep(500);
            // 到达调整时间，调整价格
            if (top && parseInt(deltaStamp / 1000) == 0) {
                while (top && parseInt(deltaStamp / 1000 / 60) == 0 && !adjusted[JSON.stringify(top)]) {
                    // 一次调整完一分钟之内的，防止因为刷新而遗漏
                    log(`调整价格：【${top.periodId}-${top.roomType}-${top.itemName.slice(0, 4) + (top.itemName.length > 4 ? "..." : "")}->${top.price}元】`);
                    adjusted[JSON.stringify(top)] = true;
                    localStorage.setItem('plan-adjusted', JSON.stringify(adjusted));
                    // await updatePrice(top.itemId, parseInt(top.price) > parseInt(top.originPrice) ? 1 : 2, top.price);
                    await updatePrice(top.itemId, 1, top.price);
                    updateButtons();
                    line.shift();
                    if (line.length == 0) break;
                    top = line.shift();
                    let deltaStamp = parseTime(top.time) - stamp;
                    await sleep(1000);
                }
                // location.reload();
            }
        }
    }

    async function main() {
        // 初始化参数
        log("初始化参数...");
        solutionId = getQueryString("solutionId");
        console.log('solutionId', solutionId);
        shopId = await getShopId(solutionId);
        console.log('shopId', shopId);
        console.log('table loading done');
        // 请求时间表
        log("请求时间表...");
        console.log('table time', await getReserveDate());
        // 请求价目表
        log("请求价目表...");
        console.log('table data', await getReserveTable());
        // 初始化储存数据
        log("初始化储存数据...");
        initData();
        log("等待表格加载...");
        await waitTableUpdate();
        // 添加按钮
        updateButtons();
        updateNavClick();
        // 开始运行timer线程
        timer();
    }

    async function start() {
        initInfo();
        showFunctions();
        try {
            await main();
        } catch(e) {
            log(`发生错误！请刷新页面！如果影响到程序的使用请尽快联系开发者。错误信息：${e}，程序日志：${logs_global}`);
        }
    }

    start();
})();