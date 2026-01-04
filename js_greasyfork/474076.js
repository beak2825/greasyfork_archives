// ==UserScript==
// @name         巡检车助手
// @namespace    https://www.cdzero.cn
// @author       Zero
// @version      1.3.0
// @description  巡检车助手，量级查询、本地计量系统！
// @icon         data:image/x-icon;base64,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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMpgLADIYS4KzF8qkcxfKo3IYS4JymAsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/////D/////////4H/////////AP////////4Af////////gB////////+AP////////+B/////////8P////////H5+P//////4P/wf//////Af+A//////4A/wB//////gB+AH/////+ADwAf/////8AGAD//////4AAAf/////HwAAD4////4PgAAfB////gfAAD4D///4A8AAfAH///ABgAD4AP//8AAAAfAA///wAAAD4AD///gAAgfAAf///AAHD4AD//5+AA+fAAfn/D8AB/4AD8P4H4AB/AAfgfgP4AH4AD8A4AfgAPAAfgBAA/AAYAD8AAAA/AAAAfgAAAD8AAAD8AAAAHgAAAfgACAAMAAAD8AAcAAAAAAfgAD4AAAAAD8AAfwAACAAfgAD/gAAcAD8AAf/gAD4AfgAD/+AAPwD8AAf/8AAfgfgAD//4AAfD8AAf//wAB+fgAD///gAD/8AAf///AAH/gAD///+AAP8AAf///8AAfgAD////4AA8AAf////wABgAD/////wAAAAf/////AAAAD/////+AAAAf/////8AAAD//////4AAAf//////wAAD///////gAAf///////AAD///////+AAf///////8AD////////4Af////////wD/////////gf/////////D////8=
// @match        http://scanner.firston-tech.com:8800/*
// @connect      www.cdzero.cn
// @connect      10.10.0.150
// @connect      101.201.38.12
// @connect      greasyfork.org
// @connect      localhost
// @require      https://unpkg.com/vue@2.7.15/dist/vue.min.js
// @require      https://unpkg.com/element-ui@2.15.10/lib/index.js
// @resource     elementCSS https://unpkg.com/element-ui@2.15.10/lib/theme-chalk/index.css
// @run-at       document-start
// @grant        GM_info
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474076/%E5%B7%A1%E6%A3%80%E8%BD%A6%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/474076/%E5%B7%A1%E6%A3%80%E8%BD%A6%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(async function () {
    "use strict";
    // 重写GM_addStyle函数
    const newGM_addStyle = GM_addStyle;
    GM_addStyle = function (css) {
        const allStyles = document.querySelectorAll("style");
        for (const styleDom of allStyles) {
            if (styleDom.textContent === css) {
                return false;
            }
        }
        newGM_addStyle(css);
    }
    unsafeWindow.ymfApiOrigin = "http://10.10.0.150:6080";
    // unsafeWindow.ymfApiOrigin = "http://localhost:3000";
    // 自动解析验证码
    Plug_autoCaptcha();
    // 主页
    const userName = await Plug_getUserName();
    Plug_autoPlate();
    Plug_homePage(userName);
    Plug_homeQcPage(userName);
})();

async function Plug_getUserName() {
    const { HTTP_XHR, GetCookie } = Plug_fnClass();
    let userName = (GetCookie("username") || "");
    if (!userName) {
        const getToken = (resolve) => {
            const token = GetCookie("Admin-Token");
            if (token) {
                resolve(token);
            } else {
                setInterval(() => getToken(resolve), 1000);
            }
        }
        const adminToken = await new Promise(getToken);
        await HTTP_XHR({
            method: "GET",
            url: "http://101.201.38.12:8080/getInfo",
            header: {
                Authorization: `Bearer ${adminToken}`
            }
        }).then((xhr) => {
            if (xhr.status === 200) {
                const objData = JSON.parse(xhr.responseText);
                if (objData.code === 200) {
                    userName = objData.user.userName;
                }
            }
        });
    }
    return userName.toLowerCase().replace(/^\s+|\s+$/g, "");
}

// 主页看板，数据拦截推送逻辑
Plug_homePageCSS();
async function Plug_homePage(userName) {
    const { GET_DATA, SET_DATA, AddDOM, ThrottleOver, FormatTime, MessageTip, GM_XHR, SwitchPrompt, GetCookie, WaylayHTTP, AwaitSelectorShow } = Plug_fnClass();
    //let upCardData = SwitchPrompt("每30S获取数据", "upCardData");
    // 初始化常量、变量
    const getServerUrl = `${unsafeWindow.ymfApiOrigin}/api/car/get-data`;
    const postServerUrl = `${unsafeWindow.ymfApiOrigin}/api/car/add-data`;
    let diffTimeMs = 0;

    // 初始化存储器
    let loadData = GET_DATA("MY_DATA_ALL") || [];
    let shortData = GET_DATA("SHORT_DATA") || [];
    let submitData = GET_DATA("UBMIT_DATA") || [];
    let plugConfig = GET_DATA("PLUG_CONFIG") || {};

    // 获取服务器时间
    function getNowTime() {
        diffTimeMs = plugConfig.diffTime || 0;
        const toTime = (new Date()).getTime();
        if (!plugConfig.diffTime || toTime - plugConfig.upDiffTime >= 1000 * 60 * 10) {
            CAR_XHR({
                "how": "GET",
                "url": "http://101.201.38.12:8080/getTime"
            }, async (xhr, time) => {
                if (xhr.status === 404) {
                    const objData = await JSON.parse(xhr.responseText);
                    if (objData.status === 404) {
                        const newTime = new Date(objData.timestamp).getTime() + time / 2;
                        const loadTime = new Date().getTime();
                        plugConfig.diffTime = newTime - loadTime;
                        plugConfig.upDiffTime = toTime;
                        diffTimeMs = plugConfig.diffTime || 0;
                        SET_DATA("PLUG_CONFIG", plugConfig);
                    }
                }
            })
        }
    }
    getNowTime();

    // 格式化当前时间
    function getFormatDate(format) {
        const nowTime = new Date(new Date().getTime() + diffTimeMs);
        if (format === "date") {
            return nowTime
        }
        return FormatTime(format, nowTime);
    }

    // 网络请求方法
    function CAR_XHR({ how, url, data, header }, fun) {
        function addHeaders(xhr) {
            xhr.setRequestHeader("Content-Type", "application/json");
            for (let head in header) {
                if (header.hasOwnProperty(head)) {
                    xhr.setRequestHeader(head, header[head]);
                }
            }
        }
        try {
            data = !!data ? data : null;
            let xhr = new XMLHttpRequest()
            if (!!fun) {
                const startTime = new Date().getTime(); // 记录开始时间
                xhr.open(how, url, true);
                addHeaders(xhr);
                xhr.send(data);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState == 4) {
                        const endTime = new Date().getTime(); // 记录结束时间
                        const time = endTime - startTime; // 计算使用时间
                        fun(xhr, time);
                    }
                }
            } else {
                xhr.open(how, url, false);
                addHeaders(xhr);
                xhr.send(data);
                return xhr.responseText;
            }
        } catch (err) {
            return err;
        }
    }

    // 数组数据大小限制器
    async function arrDataSlicer(data, size = 2) {
        // 最大存储限制，单位为字节
        const maxSize = size * 1024 * 1024;
        const newData = data;
        const newString = JSON.stringify(newData).length;
        if (newString > maxSize) {
            // 超过存储限制，删除数组第一项
            newData.shift();
            return await arrDataSlicer(newData, size);
        }
        return newData;
    }

    // 用户名称
    let getUserName = userName;
    // 接口超时测试
    let isTimeout = true;

    // 数据看板 /**********************************************************************/
    DataBoard();
    async function DataBoard() {
        const sidebar = await AwaitSelectorShow(".sidebar-container.has-logo");
        const loadImg = "data:image/gif;base64,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"
        const querySidebar = await AddDOM({
            addNode: sidebar,
            addData: [{
                name: "div",
                id: "querySidebar",
                add: [{
                    name: "img",
                    className: "getLoad",
                    src: loadImg
                }, {
                    name: "div",
                    id: "postShort",
                    add: [{
                        name: "img",
                        className: "postLoad",
                        src: loadImg
                    }, {
                        name: "span",
                        title: "本地缓存（未同步数据）",
                        className: "shortSpan"
                    }]
                }, {
                    name: "div",
                    className: "top",
                    innerHTML: "巡检车助手"
                }, {
                    name: "div",
                    id: "formInput",
                    add: [{
                        name: "input",
                        className: "date",
                        autocomplete: "off",
                        type: "date",
                        value: getFormatDate("YYYY-MM-DD"),
                        function: (e) => {
                            e.addEventListener("input", () => {
                                document.DataTableLook(e);
                                getQueryData();
                            });
                        }
                    }, {
                        name: "button",
                        innerHTML: "今天",
                        className: "today",
                        click: (e) => {
                            const dateDoc = querySidebar.querySelector("#formInput .date");
                            if (dateDoc.value !== getFormatDate("YYYY-MM-DD")) {
                                dateDoc.value = getFormatDate("YYYY-MM-DD");
                                document.DataTableLook(e);
                                getQueryData();
                            }
                        }
                    }]
                }, {
                    name: "div",
                    id: "formInput",
                    add: [{
                        name: "input",
                        className: "user",
                        autocomplete: "off",
                        placeholder: "全部数据...",
                        type: "text",
                        value: getUserName || "",
                        function: (e) => {
                            const timeOutBackQuery = ThrottleOver(() => {
                                document.DataTableLook(e);
                                getQueryData();
                            }, 1000);
                            e.addEventListener("input", timeOutBackQuery);
                        }
                    }, {
                        name: "button",
                        innerHTML: "自己",
                        className: "getdata",
                        click: (e) => {
                            const userDoc = querySidebar.querySelector("#formInput .user");
                            if (userDoc.value !== getUserName) {
                                userDoc.value = getUserName;
                                document.DataTableLook(e);
                                getQueryData();
                            }
                        }
                    }, {
                        name: "button",
                        innerHTML: "查询",
                        className: "getdata",
                        click: (e) => {
                            document.DataTableLook(e);
                            getQueryData();
                        }
                    }]
                }, {
                    name: "table",
                    id: "doneTable",
                    add: [{
                        name: "tr",
                        add: [{
                            name: "th",
                            innerHTML: "类型",
                            width: "50%"
                        }, {
                            name: "th",
                            innerHTML: "完成量",
                            width: "50%"
                        }]
                    }]
                }, {
                    name: "table",
                    id: "residTable",
                    style: "display: none",
                    add: [{
                        name: "tr",
                        add: [{
                            name: "th",
                            innerHTML: "类型",
                            width: "50%"
                        }, {
                            name: "th",
                            innerHTML: "超时量",
                            width: "50%"
                        }]
                    }]
                }]
            }]
        }, 0)

        // 初始化表格
        const tableObj = [{
            "入场完成": "carPark",
            "出场完成": "carExit",
        }, {
            "审核超时(15)": "parkTime",
            "出场超时(45)": "exitTime"
        }];

        // 创建表格内容
        await addTableTd({
            addDoc: querySidebar.querySelector("#doneTable"),
            index: 0
        })
        await addTableTd({
            addDoc: querySidebar.querySelector("#residTable"),
            index: 1
        })
        async function addTableTd({ addDoc, index }) {
            for (let key in tableObj[index]) {
                await AddDOM({
                    addNode: addDoc,
                    addData: [{
                        name: "tr",
                        add: [{
                            name: "td",
                            innerHTML: key
                        }, {
                            name: "td",
                            id: tableObj[index][key],
                            innerHTML: 0
                        }]
                    }]
                })
            }
            await AddDOM({
                addNode: addDoc,
                addData: [{
                    name: "tr",
                    add: [{
                        name: "th",
                        innerHTML: "合计"
                    }, {
                        name: "th",
                        id: `sumPark${index}`,
                        innerHTML: 0
                    }]
                }]
            })
            if (index === 1) {
                const tdName = addDoc.querySelectorAll("td:nth-child(1)");
                tdName[0].title = "7:00~19:00超15分钟，其他时段超30分钟";
                tdName[1].title = "7:00~19:00超45分钟，其他时段超150分钟";
            }
        }
        versionPlug(querySidebar);

        // 接口有效性检测
        isTimeoutBack();
        function isTimeoutBack() {
            GM_XHR({
                method: "GET",
                url: getServerUrl,
                anonymous: true,
                timeout: 1000
            }, async (xhr) => {
                if (xhr.response === "" || xhr.response === undefined) {
                    isTimeout = false;
                    setTimeout(() => { isTimeoutBack() }, 10000);
                } else {
                    isTimeout = true;
                }
                getQueryData();
                pushServer();
            })
        }
    }

    // 超时判断函数
    function DataTimeout(dataLoad, type) {
        let parkTimeout = null;
        let exitTimeout = null;
        const parkTime = [15, 30];
        const exitTime = [45, 150];
        // 审核超时计算
        const date1 = new Date(dataLoad.createTime);
        const date2 = getFormatDate("date");
        const parkDiff = Math.abs(date2.getTime() - date1.getTime());
        const parkDiffMinutes = parkDiff / (1000 * 60);
        // 出场超时计算
        let exitDiffMinutes = 0;
        let hours2 = 0;
        if (type.dataType === "出场") {
            const data3 = new Date(dataLoad.lastConfirmTime);
            hours2 = data3.getHours();
            const exitDiff = Math.abs(date2.getTime() - data3.getTime());
            exitDiffMinutes = exitDiff / (1000 * 60);
        }
        // 获取小时数
        let hours = date1.getHours();
        if (hours >= 7 && hours < 19 && parkDiffMinutes >= parkTime[0]) {
            parkTimeout = "超时";
        } else if (parkDiffMinutes >= parkTime[1]) {
            parkTimeout = "超时";
        }
        if (hours2 >= 7 && hours2 < 19 && exitDiffMinutes >= exitTime[0]) {
            exitTimeout = "超时";
        } else if (exitDiffMinutes >= exitTime[1]) {
            exitTimeout = "超时";
        }
        return {
            "overTime": parkTimeout,
            "exitTime": exitTimeout
        };
    }

    // 数据拦截 /********************************************************************/
    WaylayHTTP([{
        // 入场拦截
        url: /\/(quickEvaluationInConfirm|quickEvaluationInDiscard|quickEvaluationInParking)/,
        stop: true,
        callback(params) {
            const open_obj = ["quickEvaluationInConfirm", "quickEvaluationInParking"];
            const url = params.openParam[1]; // 请求的URL
            const key = url.match(/([^/]+)$/)[1];
            if (open_obj.includes(key)) {
                if (params.sendBody) {
                    const sendBody = JSON.parse(params.sendBody) || {};
                    if (sendBody.plateColor === 5 || sendBody.plateColor === 6) {
                        if (sendBody.plateNumber.length < 8) {
                            const msgDiv = MessageTip("❌", [{
                                name: "span",
                                innerText: "绿牌少于8位无法提交"
                            }, {
                                name: "a",
                                style: "margin-left: 5px;",
                                innerText: "直接提交",
                                click() {
                                    params.send().then(DataIntercept);
                                    msgDiv.remove(0);
                                }
                            }], 5);
                            return false;
                        }
                    }
                }
            }
            params.send().then(DataIntercept);
        }
    }, {
        // 入场拦截
        url: /\/(quickParkingCheckOutByIn|quickConfirmOutProofToParking|quickEvaluationOutDiscard|quickEvaluationOutConfirm)/,
        callback: DataIntercept
    }])

    // 推送器 /**********************************************************************/
    function DataIntercept(params) {
        const open_obj = {
            "quickEvaluationInConfirm": { "dataType": "入场", "dataState": "通过" },
            "quickEvaluationInDiscard": { "dataType": "入场", "dataState": "作废" },
            "quickEvaluationInParking": { "dataType": "入场", "dataState": "在停" },
            "quickParkingCheckOutByIn": { "dataType": "出场", "dataState": "按入出场" },
            "quickConfirmOutProofToParking": { "dataType": "出场", "dataState": "确认在停" },
            "quickEvaluationOutDiscard": { "dataType": "出场", "dataState": "作废出场" },
            "quickEvaluationOutConfirm": { "dataType": "出场", "dataState": "确认驶离" }
        };
        // 请求的载荷
        const loads = JSON.parse(params.sendBody) || {};
        if (!loads || !loads.lockedBy || !loads.lockTime) {
            return false;
        }
        const url = params.openParam[1]; // 请求的URL
        const key = url.match(/([^/]+)$/)[1];
        // 查询是否为指定接口的数据
        if (!open_obj[key]) {
            return false;
        }
        const response = JSON.parse(params.data.responseText); // 响应数据
        if (response.msg.includes("已处理")) {
            return MessageTip("❌", `数据已被处理...`, 3);
        }
        if (response.code === 200) {
            // 拦截重复提交的数据
            const { parkingActId, createTime, dataType, lockedBy } = loads;
            const oldData = submitData.find((item) => item.parkingActId === parkingActId && item.createTime === createTime && item.dataType === dataType && item.lockedBy === lockedBy);
            if (!!oldData) {
                MessageTip("❌", `数据重复提交...`, 3);
                return false;
            }
            if (submitData.length >= 100) {
                submitData.shift();
            }
            submitData.push(loads);
            SET_DATA("UBMIT_DATA", submitData);
            // 处理、推送数据
            const timeOut = DataTimeout(loads, open_obj[key]);
            Processing({
                "dataLoad": loads,
                "dataInfo": open_obj[key],
                "timeOut": timeOut
            });
            pushServer({
                "dataLoad": loads,
                "dataInfo": open_obj[key],
                "dataOther": {
                    "submitTime": getFormatDate("YYYY-MM-DD hh:mm:ss"),
                    ...timeOut
                }
            })
        }

        // 处理数据
        async function Processing({ dataLoad, dataInfo, timeOut }) {
            const { overTime, exitTime } = timeOut;
            const dataType = dataInfo.dataType;
            const nowTime = getFormatDate("YYYY-MM-DD");
            let AllData = loadData.find((item) => item.time === nowTime && item.name === dataLoad.lockedBy);
            if (!!AllData) {
                let userData = AllData.data.find(({ type }) => type === dataType);
                if (!!userData) {
                    userData.total += 1;
                    userData.overTime += !!overTime ? 1 : 0;
                    userData.exitTime += !!exitTime ? 1 : 0;
                } else {
                    userData = {
                        "type": dataType,
                        "total": 1,
                        "overTime": !!overTime ? 1 : 0,
                        "exitTime": !!exitTime ? 1 : 0
                    }
                    AllData.data.push(userData);
                }
            } else {
                AllData = {
                    "time": nowTime,
                    "name": dataLoad.lockedBy,
                    "data": [{
                        "type": dataType,
                        "total": 1,
                        "overTime": !!overTime ? 1 : 0,
                        "exitTime": !!exitTime ? 1 : 0
                    }]
                };
                loadData.push(AllData);
            }
            loadData = await arrDataSlicer(loadData, 0.2);
            SET_DATA("MY_DATA_ALL", loadData);
            document.DataTableLook();
        }
    }

    // 推送数据
    let pushServerRun = true;
    async function pushServer(data) {
        if (!!data) {
            shortData.push({ ...data.dataLoad, ...data.dataInfo, ...data.dataOther });
        }
        shortData = await arrDataSlicer(shortData, 3);
        SET_DATA("SHORT_DATA", shortData);
        const postShort = document.querySelector("#querySidebar #postShort");
        if (!pushServerRun || !shortData || shortData.length === 0 || !isTimeout) {
            lookShort();
            return false;
        }
        pushServerRun = false;
        postShort.className = "loadBlock";
        // 显示缓存数
        function lookShort() {
            const short = document.querySelector("#querySidebar .shortSpan");
            if (shortData.length > 0) {
                postShort.className = "shortBlock";
                short.innerHTML = shortData.length;
            } else {
                postShort.className = "";
            }
        }
        GM_XHR({
            method: "POST",
            url: postServerUrl,
            data: JSON.stringify(shortData.slice(0, 100)),
            anonymous: true,
            header: {
                "car-token": GetCookie("Admin-Token")
            }
        }, async (xhr) => {
            if (xhr.status == 200) {
                const xhrData = JSON.parse(xhr.responseText);
                for (const list of xhrData.content || []) {
                    // 使用filter()方法查找并删除指定对象
                    shortData = await shortData.filter(obj => obj.parkingActId !== list.parkingActId || obj.lockedBy !== list.lockedBy || obj.lockTime !== list.lockTime);
                }
                SET_DATA("SHORT_DATA", shortData);
                if (!!shortData && shortData.length > 0) {
                    setTimeout(() => {
                        pushServer();
                    }, 300)
                }
            }
            pushServerRun = true;
            lookShort();
        })
    }

    // 从数据库查询数据
    let queryRun = true;
    function getQueryData() {
        if (!isTimeout) {
            return false;
        }
        if (!queryRun) {
            return MessageTip("❌", `请勿频繁操作，查询中...`, 3);
        }
        queryRun = false;
        const loading = document.querySelector("#querySidebar .getLoad");
        loading.style = "display: block";
        const userName = document.querySelector("#formInput .user").value;
        const timeValue = document.querySelector("#formInput .date").value;
        const query = `?data_name=${userName}&time_start=${timeValue + " 00:00:00"}&time_end=${timeValue + " 23:59:59"}`;
        GM_XHR({
            method: "GET",
            url: getServerUrl + query,
            anonymous: true,
            timeout: 5000,
            header: {
                "car-token": GetCookie("Admin-Token")
            }
        }, async (xhr) => {
            loading.style = "";
            queryRun = true;
            if (xhr.status !== 200) {
                return MessageTip("❌", `查询数据失败...`, 3);
            }
            if (xhr.status == 200) {
                let { carPark, carExit, overTime, exitTime } = JSON.parse(xhr.responseText).content;
                if (!carPark && !carExit) {
                    return false;
                }
                if (shortData.length > 0) {
                    const dataArr = shortData.filter(obj => obj.submitTime.split(" ")[0] === timeValue && obj.lockedBy === userName);
                    carPark += dataArr.filter(obj => obj.dataType === "入场").length;
                    carExit += dataArr.filter(obj => obj.dataType === "出场").length;
                    overTime += dataArr.filter(obj => obj.overTime === "超时").length;
                    exitTime += dataArr.filter(obj => obj.exitTime === "超时").length;
                }
                let oldData = loadData.find((item) => item.name === userName && item.time === timeValue);
                if (!!oldData) {
                    oldData.data = [{
                        type: "入场",
                        total: carPark,
                        overTime: !!overTime ? overTime : 0,
                        exitTime: !!exitTime ? exitTime : 0
                    }, { type: "出场", total: carExit }];
                } else {
                    loadData.push({
                        name: userName,
                        time: timeValue,
                        data: [{
                            type: "入场",
                            total: carPark,
                            overTime: !!overTime ? overTime : 0,
                            exitTime: !!exitTime ? exitTime : 0
                        }, { type: "出场", total: carExit }]
                    });
                }
                loadData = await arrDataSlicer(loadData, 0.2);
                SET_DATA("MY_DATA_ALL", loadData);
                document.DataTableLook();
            }
        })
    }

    // 数据显示
    document.DataTableLook = async (nodeDoc) => {
        const userName = document.querySelector("#formInput .user").value;
        const timeValue = document.querySelector("#formInput .date").value;
        let sumPark0 = 0;
        [{
            "key": "入场",
            "doc": document.querySelector("#carPark")
        }, {
            "key": "出场",
            "doc": document.querySelector("#carExit")
        }].forEach(({ key, doc }) => {
            outData(doc);
            try {
                const dataArr = loadData
                    .filter(obj => {
                        return obj.time.split(" ")[0] === timeValue && obj.name === userName;
                    })
                    .flatMap(obj => {
                        if (typeof obj.data === "string") {
                            obj.data = JSON.parse(obj.data);
                        }
                        return obj.data.filter(({ type: list }) => list == key);
                    })
                let outNum = dataArr.reduce((acc, cur) => acc + cur.total, 0);
                outData(doc, outNum);
            } catch {
                outData(doc, 0);
            }
        })
        function outData(doc, total) {
            if (total === undefined) {
                doc.style = "";
                return false;
            }
            sumPark0 += total;
            doc.innerHTML = total;
            if (total >= 1000) {
                doc.style = `color: #00aa00;font-weight: bold;`;
            }
            document.querySelector("#sumPark0").innerHTML = sumPark0;
        }
        // 超时统计
        let TimeDoc = [document.querySelector("#parkTime"), document.querySelector("#exitTime")];
        (() => {
            outTimeData();
            try {
                const dataArr = loadData
                    .filter(obj => {
                        return obj.time.split(" ")[0] === timeValue && obj.name === userName;
                    })[0].data
                const overTime = dataArr.reduce((acc, cur) => { acc += cur.overTime || 0; return acc }, 0);
                const exitTime = dataArr.reduce((acc, cur) => { acc += cur.exitTime || 0; return acc }, 0);
                outTimeData(overTime, exitTime);
            } catch {
                outTimeData(0, 0);
            }
        })();
        function outTimeData(overTime, exitTime) {
            if (overTime === undefined) {
                TimeDoc[0].style = "";
                TimeDoc[1].style = "";
                return false;
            }
            TimeDoc[0].innerHTML = overTime;
            TimeDoc[1].innerHTML = exitTime;
            if (overTime >= 50) {
                TimeDoc[0].style = `color: #F44336;font-weight: bold;`;
            }
            if (exitTime >= 50) {
                TimeDoc[1].style = `color: #F44336;font-weight: bold;`;
            }
            document.querySelector("#sumPark1").innerHTML = overTime + exitTime;
        }
    }

    // 版本控制器
    function versionPlug(children) {
        const plugConfig = GET_DATA("GM_CONFIG", {});
        const plugName = GM_info.script.name;
        const version = GM_info.script.version;
        const plugId = "474076";
        const plugUpDateUrl = `https://www.cdzero.cn/greasyfork/${plugId}/${plugName}.user.js`;
        const plugVersionsUrl = `https://greasyfork.org/scripts/${plugId}-${plugName}/versions`;
        AddDOM({
            addNode: children,
            addData: [{
                name: "div",
                id: "MyPlugVer",
                add: [{
                    name: "span",
                    innerHTML: `版本：${version}`
                }, {
                    name: "span",
                    id: "click",
                    innerHTML: "初始化",
                    function: (element) => {
                        clickPlug(element);
                    },
                    click: (e) => {
                        clickPlug(e.target, true);
                    }
                }, {
                    name: "a",
                    href: plugVersionsUrl,
                    target: "_blank",
                    innerHTML: "版本信息"
                }]
            }]
        })
        let loading = null;
        document.myUpVisible = () => {
            if (!!loading) {
                return MessageTip("❌", "新版插件下载中，请稍后...", 3);
            }
            const toTime = (new Date()).getTime();
            loading = window.open(plugUpDateUrl + "?time=" + toTime);
            document.addEventListener("visibilitychange", function () {
                if (document.visibilityState === "visible") {
                    location.reload();
                }
            })
        }
        function clickPlug(element, click) {
            if (element.innerText === "有更新") {
                return document.myUpVisible();
            }
            if (element.innerText === "检测中") {
                return MessageTip("❌", "正在检测中，请稍后...", 3);
            }
            element.style = "color: red;";
            element.innerText = "检测中";
            return updatesPlug(element, click);
        }
        function checkPlug(element, obj, click) {
            if (!obj) {
                isNew();
                return MessageTip("❌", `${plugName}检测更新失败！`, 3);
            }
            const oldVer = Number(version.replace(/[\s.]+/g, ""));
            const newVer = Number(obj.plugver.replace(/[\s.]+/g, ""));
            if (!!obj.plugver && newVer > oldVer) {
                isUpdata();
                MessageTip("❌", `${plugName}发现新的版本：${obj.plugver} <a onclick="document.myUpVisible();">更新助手</a>`, 6);
            } else if (!!obj.plugver) {
                isNew();
                !!click && MessageTip("✔️", `${plugName}已经是最新版本！`, 3);
            }
            function isNew() {
                element.style = "";
                element.innerText = "最新版";
            }
            function isUpdata() {
                element.style = "color: red;";
                element.innerText = "有更新";
            }
        }
        function updatesPlug(element, click) {
            const toTime = (new Date()).getTime();
            if (!plugConfig.plugver || toTime - plugConfig.plugtime >= 1000 * 60 * 60 * 12 || !!click) {
                GM_XHR({
                    method: "GET",
                    url: plugUpDateUrl + "?time=" + toTime,
                    timeout: 10000
                }).then((xhr) => {
                    const regex = /\/\/\s*@version\s*(\d+\.\d+\.\d+)/g;
                    const newVer = regex.exec(xhr.responseText)[1];
                    plugConfig.plugtime = toTime;
                    plugConfig.plugver = newVer;
                    checkPlug(element, plugConfig, true);
                }).catch(() => {
                    checkPlug(element, null, true);
                }).finally(() => {
                    SET_DATA("GM_CONFIG", plugConfig);
                })
            } else {
                checkPlug(element, plugConfig);
            }
        }
    }
}
// AI识别车牌号
function Plug_autoPlate() {
    const { ObserverDOM, ThrottleOver, GM_XHR, AddDOM, MessageTip, WaylayHTTP } = Plug_fnClass();
    const config = {
        loading: false,
        plateNumber: null,
        plateColor: null,
        picPlate: null,
        parkingActId: null,
    };
    WaylayHTTP([{
        url: /quickEvaluationIn/i,
        callback(params) {
            const data = JSON.parse(params.data.responseText).data || {};
            config.plateNumber = data.plateNumber || null;
            config.plateColor = data.plateColor || null;
            config.picPlate = data.picPlate || null;
            config.parkingActId = data.parkingActId || null;
        }
    }]);
    const observer = ObserverDOM(ThrottleOver(runCode, 100));
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
    async function runCode() {
        const detailInfoAll = document.querySelectorAll(".detail-info,.btn-group");
        for (const detailInfo of detailInfoAll) {
            if (!/作废确认/.test(detailInfo.innerText) || detailInfo.querySelector(".gm-ai-plate")) {
                continue;
            }
            detailInfo.style.display = "flex";
            detailInfo.style.alignItems = "center";
            AddDOM({
                addData: [{
                    name: "button",
                    className: [config, "loading", () => `el-button el-button--success el-button--medium is-plain gm-ai-plate ${config.loading ? "loading" : ""}`],
                    innerText: "AI识别",
                    click: clickRun
                }]
            }).then((button) => {
                detailInfo.insertBefore(button, detailInfo.firstChild);
            });
        }
    }
    // 点击运行
    async function clickRun() {
        if (config.loading) {
            return MessageTip("❌", "正在识别中，请稍后...", 3);
        }
        const img = document.querySelector(".pic-plate img");
        if (!img || !img.getAttribute("src") || !/^http/.test(img.src)) {
            return MessageTip("❌", "获取图片失败", 3);
        }
        const plateNum = document.querySelector("input[name=plate-number]");
        const colorLabel = document.querySelectorAll("#plate-color>label");
        if (!plateNum || !colorLabel.length) {
            return MessageTip("❌", "未找到车牌号输入框", 3);
        }
        const plate = await getPlate(img.src);
        if (!plate) {
            return MessageTip("❌", "识别图片失败", 3);
        }
        console.log(plate);
        plateNum.value = plate.plate;
        plateNum.dispatchEvent(new Event("input"));
        for (const label of colorLabel) {
            if (label.innerText === plate.color) {
                label.click();
                break;
            }
        }
    }
    // 识别车牌号
    async function getPlate(img) {
        config.loading = true;
        const data = {
            img: img
        };
        const match = img.match(/[^/]+$/);
        if (match && config.picPlate.includes(match[0])) {
            data.type = "car-info";
            data.plate = config.plateNumber;
            data.color = config.plateColor;
            data.parkingActId = config.parkingActId;
        }
        return GM_XHR({
            timeout: 5000,
            method: "POST",
            url: `${unsafeWindow.ymfApiOrigin}/api/ai/plate`,
            data: data,
        }).then((xhr) => {
            const data = JSON.parse(xhr.response);
            if (data.code === 200) {
                return data.data;
            }
            throw "获取失败";
        }).catch((error) => {
            console.error(error);
            return null;
        }).finally(() => {
            config.loading = false;
        });
    }
    GM_addStyle(`
        .gm-ai-plate {
            display: block !important;
            margin-right: auto !important;
            position: relative !important;
            padding: 10px 16px !important;
        }
        .gm-ai-plate.loading {
            cursor: not-allowed;
            padding-left: 28px !important;
        }
        .gm-ai-plate.loading::before {
            top: calc(50% - 8px);
            left: 8px;
            position: absolute;
            content: "";
            display: inline-block;
            width: 16px;
            height: 16px;
            margin-right: 5px;
            border: 2px solid rgba(0,0,0,0);
            border-top-color: #67C23A;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            animation-play-state: running;
            vertical-align: middle;
        }
        .gm-ai-plate.loading:focus::before,
        .gm-ai-plate.loading:hover::before {
            border-top-color: #ffffff;
        }
        @keyframes spin {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }
    `);
}
function Plug_homePageCSS() {
    GM_addStyle(`
        /* 隐藏面包屑 */
        .breadcrumb-container {
            display: none !important;
        }
    `);
    GM_addStyle(`
        #querySidebar {
            position: absolute;
            bottom: 0;
            width: 100%;
            font-size: 14px;
            white-space: nowrap;
            background: #ffffff;
            color: rgba(0,0,0,.65);
            border-radius: 10px 10px 0 0;
            display: flex;
            align-items: center;
            flex-direction: column;
            font-family: "微软雅黑";
        }
        #querySidebar .top {
            height: 26px;
            line-height: 26px;
            font-weight: bold;
        }
        #querySidebar .getLoad {
            width: 16px;
            display: none;
            right: 5px;
        }
        #querySidebar #postShort {
            line-height: 16px;
            left: 5px;
        }
        #querySidebar .getLoad,
        #querySidebar #postShort {
            position: absolute;
            height: 16px;
            top: 5px;
        }
        #querySidebar .postLoad {
            width: 16px;
            display: none;
        }
        #querySidebar .shortSpan {
            border-radius: 8px;
            background: red;
            padding: 0 5px;
            color: #fff;
            font-weight: bolder;
            display: none;
        }
        #querySidebar .loadBlock .postLoad,
        #querySidebar .shortBlock .shortSpan {
            display: block;
        }

        /*输入框*/
        #formInput {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            gap: 5px;
            width: 100%;
        }
        #formInput input {
            width: 100%;
            border-radius: 3px;
            outline: none;
            border: 1px solid #767676;
            color: inherit;
            line-height: 1;
            font-size: inherit;
            font-family: inherit;
            padding: 0 6px;
        }
        #formInput input:hover {
            border: 1px solid #40a9ff;
        }
        #formInput input:focus-visible {
            border: 1px solid #ff0000;
        }

        /*按钮*/
        #formInput button {
            background: #6bbbff;
            color: white;
            outline: none;
            border-radius: 3px;
            border: 0 solid #6bbbff;
            transition: all ease-in 0.2s;
            cursor: pointer;
            height: 25px;
            min-width: 25%;
            text-align: center;
        }
        #formInput button:hover {
            background: #1890ff;
        }
        #formInput button:active {
            transition: all ease-in 0.1s;
            background: #41a4ff;
        }

        /*表格样式*/
        #querySidebar table {
            width: 100%;
            border-spacing: 0;
            text-align: center;
            border-collapse: collapse;
            margin-bottom: 5px;
        }
        #querySidebar table th {
            height: 25px;
            font-size: 14.5px;
            background: #6bbbFF;
            color: rgba(0,0,0,0.9);
            border: 0.1px solid #000000;
        }
        #querySidebar table td {
            height: 21px;
            line-height: 20px;
            color: rgba(0,0,0,0.9);
            border: 0.1px solid #000000;
        }

        /*隐藏侧边栏样式*/
        .hideSidebar #querySidebar .top{
            opacity: 0;
        }
        .hideSidebar #querySidebar #formInput,
        .hideSidebar #querySidebar #MyPlugVer,
        .hideSidebar #querySidebar #doneTable tr>th:nth-child(1),
        .hideSidebar #querySidebar #doneTable tr>td:nth-child(1) {
            display: none;
        }

        /*date时间输入框样式*/
        ::-webkit-datetime-edit-year-field,::-webkit-datetime-edit-month-field,::-webkit-datetime-edit-day-field {
            cursor:pointer;
            transition: background-color ease-in 0.2s, color ease-in 0.2s;
        }
        ::-webkit-datetime-edit-year-field:hover,::-webkit-datetime-edit-month-field:hover,::-webkit-datetime-edit-day-field:hover{
            color: #fff;
            background-color:#faad14;
        }
        ::-webkit-calendar-picker-indicator {
            cursor:pointer;
            margin-right: 2px;
            border-radius: 4px;
            transition:background-color ease-in 0.2s;
            background-image: url("data:image/svg+xml;utf8,<svg viewBox='60 64 896 896' xmlns='http://www.w3.org/2000/svg'><path d='M880 184H712v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H384v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H144c-17.7 0-32 14.3-32 32v664c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V216c0-17.7-14.3-32-32-32zm-40 656H184V460h656v380zM184 392V256h128v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h256v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h128v136H184z' style='fill:hsla(0, 0%, 0%, 0.62)' ></path></svg>");
        }
        ::-webkit-calendar-picker-indicator:hover {
            background-color:#faad14;
            background-image: url("data:image/svg+xml;utf8,<svg viewBox='60 64 896 896' xmlns='http://www.w3.org/2000/svg'><path d='M880 184H712v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H384v-64c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v64H144c-17.7 0-32 14.3-32 32v664c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V216c0-17.7-14.3-32-32-32zm-40 656H184V460h656v380zM184 392V256h128v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h256v48c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8v-48h128v136H184z' style='fill:hsl(0, 0%, 100%)' ></path></svg>");
        }

        /*插件信息*/
        #MyPlugVer {
            font-size: 12px;
            font-weight: bold;
            display: flex;
            align-items: center;
            margin-bottom: 5px;
            justify-content: center;
        }
        #MyPlugVer #click {
            cursor: pointer;
            color: green;
        }
        #MyPlugVer a,
        #MyPlugVer span {
            border-radius: 3px;
            padding: 2px 3px;
            line-height: 1;
            transition: 0.3s ease-in-out;
        }
        #MyPlugVer a:hover,
        #MyPlugVer #click:hover {
            background: #1890ff !important;
            color: #fff !important;
        }
        a {
            cursor: pointer;
            color: #1890ff;
            transition: color .3s ease-in-out;
        }
        a:hover {
            color: #40a9ff;
        }
        a:active {
            color: #096dd9;
        }
    `)
}

// 主页质检显示
async function Plug_homeQcPage(userName) {
    Plug_homeQcPageCSS();
    const { AddDOM, FormatTime, GM_XHR, GetCookie, GetApiCache, AwaitSelectorShow } = Plug_fnClass();

    const [pinUser] = await Promise.all([
        GetApiCache({
            method: "POST",
            url: `${unsafeWindow.ymfApiOrigin}/api/car/get/config`,
            data: {
                name: "car-user",
                type: "GET",
                token: GetCookie("Admin-Token")
            }
        }, "CAR-PIN-USER"),
    ]);
    if (!pinUser || !pinUser.pin) {
        return false;
    }

    function getPinUser(name) {
        const config = pinUser || {};
        const isChinese = /^[\u4e00-\u9fa5]/.test(name);
        const indexParam = isChinese ? "user" : "pin";
        const configParam = isChinese ? "pin" : "user";
        const index = config[indexParam] && config[indexParam].indexOf(name);
        if (index >= 0) {
            return config[configParam] ? config[configParam][index] : name;
        }
        return name;
    }

    function accuracyCount(qcError, total) {
        if (total === 0) {
            return 0;
        }
        let accuracy = (1 - qcError / total) * 100;
        if (isNaN(accuracy)) {
            accuracy = 100;
        }
        return accuracy.toFixed(2);
    }

    const adminUrl = `${unsafeWindow.ymfApiOrigin}/admin/car/car-park`;
    const adminBoardUrl = `${unsafeWindow.ymfApiOrigin}/admin/car/car-board`;

    AddDOM({
        addNode: await AwaitSelectorShow(".main-container .navbar"),
        addData: [{
            name: "div",
            className: "inner-qc",
            add: [{
                name: "div",
                className: "user",
                innerText: getPinUser(userName)
            }, {
                name: "div",
                className: "pending",
                innerHTML: `
                    <el-tooltip effect="dark" content="近三十天待处理" placement="bottom">
                        <el-button size="medium" :type="type" @click="toAdmin">{{ title }}</el-button>
                    </el-tooltip>

                    <el-tooltip effect="dark" content="当月的抽检数据" placement="bottom">
                        <el-button size="medium" :type="boardType" class="accuracy" @click="toAdminBoard">
                            <span v-if="!sumList.accuracy">{{boardTitle}}</span>
                            <div v-if="sumList.accuracy" class="accuracy-div">
                                <div>
                                    <span style="font-size: 10px;">错误</span>
                                    <span>{{sumList.qcError}}</span>
                                </div>
                                <div>
                                    <span style="font-size: 10px;">低级</span>
                                    <span>{{sumList.qcLow}}</span>
                                </div>
                                <div>
                                    <span style="font-size: 10px;">准确率</span>
                                    <span>{{sumList.accuracy}}</span>
                                </div>
                            </div>
                        </el-button>
                    </el-tooltip>

                    <el-button style="width: 36px;height: 36px;" size="medium" :loading="loading" icon="el-icon-search" circle @click="clickQuery"></el-button>
                `,
                function(div) {
                    new Vue({
                        el: div,
                        data() {
                            return {
                                title: "获取中",
                                type: "primary",
                                boardTitle: "获取中",
                                boardType: "primary",
                                sumList: {},
                                loading: false,
                                boardLoading: false,
                            }
                        },
                        mounted() {
                            // 聚焦时查询待处理数据
                            // const loopGet = async () => {
                            //     if (this.loading) {
                            //         return false;
                            //     }
                            //     const visible = document.visibilityState === "visible";
                            //     if (visible) {
                            //         await this.getAppeal();
                            //     }
                            // }
                            // loopGet();
                            // this.getBoard();
                            // document.addEventListener("visibilitychange", loopGet);
                            this.getBoard();
                            this.getAppeal();
                        },
                        methods: {
                            toAdmin() {
                                window.open(`${adminUrl}?user=${userName}&qcState=["错误","低级错"]&appealState=["未申诉","申诉驳回"]`, "_blank");
                            },
                            toAdminBoard() {
                                const now = new Date();
                                const year = now.getFullYear();
                                const month = now.getMonth();
                                const firstDay = FormatTime("YYYY-MM-DD 00:00:00", new Date(year, month, 1));
                                const lasttDay = FormatTime("YYYY-MM-DD 23:59:59");
                                window.open(`${adminBoardUrl}?submitTime=["${firstDay}","${lasttDay}"]`, "_blank");
                            },
                            clickQuery() {
                                if (this.loading) {
                                    return false;
                                }
                                this.getBoard();
                                this.getAppeal();
                            },
                            getKpiColor(value) {
                                const conicColors = {
                                    0: "danger",
                                    99.8: "warning",
                                    99.9: "success",
                                };
                                const keys = Object.keys(conicColors);
                                for (let index = keys.length - 1; index >= 0; index--) {
                                    const key = keys[index];
                                    if (Number(value) >= Number(key)) {
                                        return conicColors[key];
                                    }
                                }
                                return "primary";
                            },
                            async getBoard() {
                                if (!this.boardLoading) {
                                    this.boardLoading = true;
                                    return getDataBoard().then((data) => {
                                        if (!data) {
                                            this.sumList = {};
                                            this.boardType = "danger";
                                            this.boardTitle = "获取失败";
                                            return false;
                                        }
                                        const { total, qcError, qcLow } = data;
                                        if (!total) {
                                            this.sumList = {};
                                            this.boardType = "success";
                                            this.boardTitle = "无数据";
                                            return false;
                                        }
                                        const accuracyNum = accuracyCount(qcError, total);
                                        this.sumList = {
                                            qcError: qcError,
                                            qcLow: qcLow,
                                            accuracy: `${accuracyNum}%`,
                                        };
                                        this.boardType = this.getKpiColor(accuracyNum);
                                    }).finally(() => {
                                        this.boardLoading = false;
                                    })
                                }
                            },
                            async getAppeal() {
                                if (!this.loading) {
                                    this.loading = true;
                                    return getWarnTotal().then((data) => {
                                        if (data === null) {
                                            this.type = "danger";
                                            this.title = "获取失败";
                                        } else if (data.total > 0) {
                                            this.type = "danger";
                                            this.title = `内检待处理 ${data.total} 条`;
                                        } else {
                                            this.type = "success";
                                            this.title = "无内检待处理";
                                        }
                                        return data;
                                    }).finally(() => {
                                        this.loading = false;
                                    })
                                }
                            }
                        }
                    })
                }
            }]
        }]
    })
    function getWarnTotal() {
        const token = GetCookie("Admin-Token");
        return GM_XHR({
            method: "GET",
            url: `${unsafeWindow.ymfApiOrigin}/api/car/get/warn-info?token=${token}`
        }).then((xhr) => {
            const data = JSON.parse(xhr.response);
            if (data.code === 200) {
                return data.data;
            }
            throw "获取失败";
        }).catch((error) => {
            console.error(error);
            return null;
        })
    }
    function getDataBoard() {
        const token = GetCookie("Admin-Token");
        return GM_XHR({
            method: "GET",
            url: `${unsafeWindow.ymfApiOrigin}/api/car/get/accuracy?token=${token}`
        }).then((xhr) => {
            const data = JSON.parse(xhr.response);
            if (data.code === 200) {
                return data.data;
            }
            throw "获取失败";
        }).catch((error) => {
            console.error(error);
            return null;
        })
    }
}
function Plug_homeQcPageCSS() {
    const elementCSS = GM_getResourceText("elementCSS");
    const newCss = elementCSS.replace(/fonts\/element-icons/g, "https://unpkg.com/element-ui@2.15.10/lib/theme-chalk/fonts/element-icons");
    GM_addStyle(newCss);
    GM_addStyle(`
        .inner-qc {
            float: left;
            line-height: 50px;
            margin-left: 8px;
            gap: 8px;
            display: inline-flex;
            align-items: center;
        }
        .inner-qc .user {
            font-size: 20px;
            font-weight: bold;
            color: #ff0000;
        }
        .inner-qc .pending {
            display: flex;
            align-items: center;
        }
        .inner-qc .accuracy {
            height: 36px;
        }
        .inner-qc .accuracy-div {
            height: 36px;
        }
        .inner-qc .accuracy-div {
            height: 100%;
            gap: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .inner-qc accuracy-div>div {
            gap: 2px;
            display: flex;
            flex-direction: column;
        }
        .inner-qc .accuracy-div>div {
            gap: 2px;
            display: flex;
            flex-direction: column;
        }
    `)
}

// 自动解析验证码
function Plug_autoCaptcha() {
    const { ObserverDOM, ThrottleOver, GM_XHR } = Plug_fnClass();
    const config = {
        img: "",
    };
    const observer = ObserverDOM(ThrottleOver(runCode, 100));
    observer.observe(document.body, { childList: true, subtree: true, attributes: true });
    async function runCode() {
        const img = document.querySelector(".code-input-group img");
        const input = document.querySelector(".code-input-group input");
        if (!img || !input) {
            return false;
        }
        if (config.img === img.src || !/^data\:image/i.test(img.src)) {
            return false;
        }
        config.img = img.src;
        img.parentNode.classList.add("get-captcha-loading");
        const data = await getCaptcha();
        img.parentNode.classList.remove("get-captcha-loading");
        if (data && config.img === img.src) {
            input.value = data.captcha;
            input.dispatchEvent(new Event("input"));
        }
    }
    async function getCaptcha() {
        return GM_XHR({
            method: "POST",
            url: `${unsafeWindow.ymfApiOrigin}/api/ai/captcha`,
            data: {
                img: config.img
            },
        }).then((xhr) => {
            const data = JSON.parse(xhr.response);
            if (data.code === 200) {
                return data.data;
            }
            throw "获取失败";
        }).catch((error) => {
            console.error(error);
            return null;
        })
    }
    GM_addStyle(`
        .get-captcha-loading::before {
            content: "AI识别中...";
            top: 100%;
            position: absolute;
            text-align: center;
            line-height: initial;
            pointer-events: none;
            color: rgba(255, 0, 0, .7);
        }
    `)
}

// 常用方法
function Plug_fnClass() {
    class Plug_Plug {
        constructor() {
            Object.getOwnPropertyNames(this.constructor.prototype)
                .filter(name => name !== "constructor" && typeof this[name] === "function")
                .forEach(methodName => this[methodName] = this[methodName].bind(this));
        }

        /**
         * 插件开关设置
         * @param {string | object} name 开关名称
         * @param {string} saveName 开关键名（key）
         * @param {number} initial 默认开、关，不设置为1（开）
         * @param {boolean} click 点击标识，反转开关（不可传参）
         * @returns 返回当前开关状态
         */
        SwitchPrompt = (name, saveName, initial = true, click) => {
            const self = this;
            const state = ["❌ ", "✔️ "];
            const isOpen = GM_getValue(saveName, initial);
            let configName = state[Number(isOpen)] + name;
            if (typeof name === "object") {
                configName = name[Number(isOpen)];
            }
            GM_registerMenuCommand(configName, () => { self.SwitchPrompt(name, saveName, isOpen, true) });
            if (!!click) {
                GM_setValue(saveName, !initial);
                location.reload();
            }
            return isOpen;
        }

        /**
         * 读取存储
         * @param {string} name 存储的键名
         * @param {object} def 为空的默认返回内容，不填返回undefined
         * @returns 返回GET的值
         */
        GET_DATA = (name, def = undefined) => {
            if (!name) {
                return def;
            }
            return JSON.parse(localStorage.getItem(name)) || def;
        }

        /**
         * 存储写入
         * @param {string} name 存储的键名
         * @param {object} data 存储的内容
         * @returns 返回写入的值
         */
        SET_DATA = (name, data) => {
            if (!name) {
                return data;
            }
            if (name === "GM_CONFIG") {
                const oldData = this.GET_DATA(name);
                data = { ...oldData, ...data };
            }
            localStorage.setItem(name, JSON.stringify(data));
            return data;
        }

        /**
         * 格式化时间
         * @param {string} format 时间格式，默认YYYY-MM-DD
         * @param {Date} date （可选）传入一个时间对象
         * @returns 返回格式化后的时间格式
         */
        FormatTime(format = "YYYY-MM-DD", date) {
            const time = date && new Date(date) || new Date();
            const year = time.getFullYear();
            const month = (time.getMonth() + 1).toString().padStart(2, "0");
            const day = time.getDate().toString().padStart(2, "0");
            const hour = time.getHours().toString().padStart(2, "0");
            const minute = time.getMinutes().toString().padStart(2, "0");
            const second = time.getSeconds().toString().padStart(2, "0");
            const formattedDate = format
                .replace("YYYY", year)
                .replace("MM", month)
                .replace("DD", day)
                .replace("HH", hour)
                .replace("hh", hour)
                .replace("mm", minute)
                .replace("ss", second);
            return formattedDate;
        }

        /**
         * 获取Cookie
         * @param {string} cookieName Cookie键名
         * @returns 返回对应键值的名称
         */
        GetCookie(cookieName) {
            const cookieRegex = new RegExp("(?:(?:^|.*;\\s*)" + cookieName + "\\s*\\=\\s*([^;]*).*$)|^.*$");
            const cookieValue = document.cookie.replace(cookieRegex, "$1");
            return cookieValue;
        }

        /**
         * 跨域的网络请求
         * @param {object} config 请求配置
         * @param {function} fun 请求的回调
         * @returns 使用then方法获取结果或者await
         */
        GM_XHR({ method, url, data, header, timeout = 10000, cookie = "", anonymous = false }, fun = () => { }) {
            const headers = {}
            headers["Content-Type"] = "application/json";
            for (const head in header) {
                if (header.hasOwnProperty(head)) {
                    headers[head] = header[head];
                }
            }
            return new Promise(function (resolve, reject) {
                GM_xmlhttpRequest({
                    method: method || "GET",
                    url: url,
                    data: typeof data === "object" ? JSON.stringify(data) : data,
                    headers: header,
                    timeout: timeout,
                    cookie: cookie,
                    anonymous: anonymous,
                    onload: function (data) {
                        if (data.readyState == 4) {
                            fun(data);
                            resolve(data);
                        }
                    },
                    onerror: function (error) {
                        fun(error);
                        reject(error);
                    },
                    ontimeout: function (out) {
                        fun(out);
                        reject(out);
                    },
                })
            })
        }

        /**
         * XMLHttpRequest方法
         * @param {object} config 请求配置
         * @param {function} callback 请求的回调
         * @returns 使用then方法获取结果或者await
         */
        HTTP_XHR({ method, url, data = null, header, isWith = false, controller = () => { } }, callback = () => { }) {
            return new Promise(function (resolve, reject) {
                try {
                    const xhr = new XMLHttpRequest();
                    xhr.withCredentials = isWith;
                    xhr.open(method || "GET", url, true);
                    for (const headKey in header) {
                        if (header.hasOwnProperty(headKey)) {
                            xhr.setRequestHeader(headKey, header[headKey]);
                        }
                    }
                    // 添加信号到xhr请求
                    xhr.upload.onabort = () => {
                        reject("请求被用户取消");
                        callback("请求被取消");
                    };
                    xhr.upload.onerror = (e) => {
                        reject(e);
                        callback(e);
                    };
                    xhr.onload = function () {
                        if (xhr.status >= 200 && xhr.status < 300 || xhr.readyState === 4) {
                            resolve(xhr);
                        } else {
                            reject(xhr);
                        }
                        callback(xhr);
                    }
                    xhr.onerror = function () {
                        reject(xhr);
                        callback(xhr);
                    };
                    xhr.send(typeof data === "object" ? JSON.stringify(data) : data);
                    controller(xhr);
                } catch (err) {
                    console.error(err);
                    callback(err);
                    reject({ msg: "失败" });
                }
            })
        }

        /**
         * 从网络请求数据并缓存到浏览器，缓存时间30分钟
         * @param {object} webConfig 网络请求的配置，和GM_XHR一致
         * @param {string} lsName 缓存的key字段
         * @returns 返回的数据
         */
        GetApiCache = async (webConfig, lsName) => {
            const cachedData = this.GET_DATA(lsName) || {};
            const currentTime = Date.now();
            // 30 分钟
            const thirtyMinutes = 30 * 60 * 1000;
            // 检查缓存数据是否存在，并且小于 30 分钟
            if (cachedData && cachedData.data && cachedData.time && currentTime - parseInt(cachedData.time) < thirtyMinutes) {
                return Promise.resolve(cachedData.data);
            }
            // 如果不满足条件，发起网络请求
            return this.GM_XHR(webConfig).then((xhr) => {
                const data = JSON.parse(xhr.response);
                if (data.code === 200) {
                    this.SET_DATA(lsName, {
                        data: data.data,
                        time: currentTime
                    });
                    return data.data;
                }
                return cachedData.data || {};
            }).catch((error) => {
                console.error(error);
                return cachedData.data || {};
            });
        }

        /**
         * 等待元素出现在页面中
         * @param {string} nodeData 选择器元素的名称，或者函数
         * @param {boolean} showType （可选）是否启用窗口在前台才继续？默认关闭
         * @param {function} callback （可选）由函数控制元素是否应该加载，无法保证返回元素，返回一个结束函数，传入true则完成等等
         * @returns 返回Promise，成功则返回等待的元素
         */
        AwaitSelectorShow = (nodeData, showType, callback) => {
            const ObserverDOM = this.ObserverDOM;
            const config = {
                type: !showType,
                node: undefined,
                observer: null,
                over: false,
                callback: null
            }
            callback && (config.callback = callback);
            return new Promise(function (resolve, reject) {
                function _over(params) {
                    config.over = true;
                    config.node = params || null;
                    return _backRun();
                }
                queryNode();
                async function queryNode() {
                    const node = typeof nodeData === "function" ? await nodeData() : document.querySelector(nodeData);
                    if (node) {
                        if (config.callback) {
                            return config.callback(_over, node);
                        }
                        _over(node);
                    } else if (!config.observer) {
                        config.observer = ObserverDOM(queryNode).observe(document, {
                            childList: true,
                            subtree: true,
                            attributes: true
                        });
                    }
                }
                showNode();
                function showNode() {
                    const visible = document.visibilityState === "visible";
                    if (visible) {
                        document.removeEventListener("visibilitychange", showNode);
                        config.type = visible;
                        return _backRun();
                    } else if (!config.typeEvent) {
                        config.typeEvent = true;
                        document.addEventListener("visibilitychange", showNode);
                    }
                }
                function _backRun() {
                    if (!!config.over && !!config.type) {
                        config.observer && config.observer.stop();
                        resolve(config.node);
                    }
                }
            })
        }

        /**
         * 气泡提示
         * @param {string} ico 提示气泡的emoji
         * @param {string} text 提示文字
         * @param {number} time 气泡显示时间
         * @param {number} place 气泡的位置
         * @returns 返回创建的气泡，以及修改气泡位置的回调函数
         */
        MessageTip = (ico, text, time, place = 1) => {
            const RemoveDom = this.RemoveDom;
            if (ico === undefined) {
                let msgTip = null;
                return (ico, text, time, place) => {
                    if (msgTip && msgTip.ico) {
                        msgTip.ico(ico);
                        msgTip.text(text);
                    } else {
                        msgTip = this.MessageTip(ico, text, null, place);
                    }
                    msgTip.remove(time);
                    return msgTip;
                }
            }
            const openEnd = [
                "margin-left: 0;margin-top: 0;",//左上
                "margin-top: 0;margin-top: 0;",//居中
                "margin-right: 0;",//右上
                "margin-right: 0;margin-bottom: 0;",//右下
                "margin-left: 0;margin-bottom: 0;",//左下
            ][place];
            const middle = [
                "margin-left: 30px;margin-top: 15px;",//左上
                "margin-top: 15px;",//居中
                "margin-right: 30px;margin-top: 15px;",//右上
                "margin-right: 30px;margin-bottom: 15px;",//右下
                "margin-left: 30px;margin-bottom: 15px;",//左下
            ][place];
            const inRunFrame = this.RunFrame;
            const createTip = async (addNode) => {
                const className = "gm-message-place-" + place;
                const tipDom = addNode.querySelector(`:scope>.${className}`);
                if (tipDom) { return tipDom };
                return this.AddDOM({
                    addNode: addNode,
                    addData: [{
                        name: "div",
                        className: "gm-message " + className
                    }]
                });
            }
            const createBody = async (addNode, body) => {
                return createTip(addNode).then(tipDiv => {
                    if (body instanceof HTMLElement) {
                        tipDiv.appendChild(body);
                        display(body);
                        return body;
                    } else {
                        return this.AddDOM({
                            addNode: tipDiv,
                            addData: body
                        }).then(div => {
                            display(div);
                            return div;
                        })
                    }
                })
            }
            const msgDem = createBody(document.body, [{
                name: "div",
                className: "gm-message-main",
                style: "opacity: 1;height: 30px;",
                add: [{
                    name: "div",
                    className: "gm-message-body",
                    add: [{
                        name: "div",
                        className: "gm-message-ico",
                        innerHTML: ico
                    }, {
                        name: "div",
                        className: "gm-message-text",
                        innerHTML: typeof text === "string" ? text : "",
                        add: Array.isArray(text) ? text : [],
                    }]
                }]
            }])
            const callObj = {
                node: msgDem,
                remove: (time) => remove(time),
                open: (element) => msgDem.then(div => createBody(element, div)),
                text: (data) => editDom(data, ".gm-message-text"),
                ico: (data) => editDom(data, ".gm-message-ico")
            };
            let clearTime = null;
            time && remove(time);
            function display(div) {
                div.style = "height: auto;";
                const height = div.clientHeight;
                div.style = `opacity: 0;${openEnd}`;
                inRunFrame(() => {
                    div.style = `opacity: 1;height: ${height}px;${middle}`;
                })
            }
            async function remove(reTime = 0.6) {
                const fadeTime = 300; // 淡出动画时间
                const totalTime = reTime * 1000; // 总延迟转换为毫秒
                const fadeOutDelay = totalTime > fadeTime ? totalTime - fadeTime : 0;
                const div = await msgDem;
                clearTimeout(clearTime);
                clearTime = setTimeout(() => {
                    div.style = `opacity: 0;${openEnd}`;
                    RemoveDom(div, "all", fadeTime + 50);
                    Object.keys(callObj).forEach((key) => delete callObj[key]);
                }, fadeOutDelay);
            }
            function editDom(params, className) {
                msgDem.then(div => {
                    const textDom = div.querySelector(className);
                    if (Array.isArray(params)) {
                        textDom.innerHTML = "";
                        this.AddDOM({
                            addNode: textDom,
                            addData: params
                        })
                    } else {
                        textDom.innerHTML = params;
                    }
                })
            }
            return callObj;
        }

        /**
         * 节点创建函数
         * @param {object} nodeObject - 需要创建的元素结构 { addNode, addData }
         * @param {object[]} nodeObject.addData - 元素结构，值中传入数组可解析成动态数据 [对象, 对象索引, 自定义函数]
         * @param {HTMLElement} [nodeObject.addNode] - 可选，添加到对应元素内部
         * @param {number} [index] - 可选，返回元素的配置，默认返回第一个元素，传入下标则返回指定元素，"true"为所有元素
         * @returns {Promise<HTMLElement|HTMLElement[]>} - 返回指定下标的元素（或全部）
         */
        async AddDOM({ addNode, addData }, index = 0) {
            const ObjectProperty = this.ObjectProperty;
            const All = [];
            for (const node of addData) {
                if (typeof node === "object" && node.name) {
                    const removeBackArr = [];
                    const elem = document.createElement(node.name); // 创建元素
                    elem._remove = () => {
                        removeBackArr.forEach((callback) => callback());
                        elem.remove();
                    }
                    if (!!addNode) {
                        addNode.appendChild(elem);
                    }
                    const setRule = {
                        function: async (key) => {
                            await node[key](elem);
                        },
                        click: (key) => {
                            const callback = (e) => { node[key](e, elem) };
                            elem.addEventListener("click", callback, false);
                        },
                        default: (key) => {
                            if (key !== "add") {
                                const values = node[key];
                                if (Array.isArray(values) && typeof values[0] === "object") {
                                    if (!Array.isArray(values[1])) {
                                        values[1] = [values[1]];
                                    }
                                    for (const item of values[1]) {
                                        let isAddRemove = false;
                                        ObjectProperty(values[0], item, (params) => {
                                            if (!isAddRemove) {
                                                isAddRemove = true;
                                                removeBackArr.push(params.stop);
                                            }
                                            if (typeof values[2] === "function") {
                                                return setValue(values[2](params.value));
                                            }
                                            if (params.value !== undefined && params.value !== null) {
                                                setValue(params.value);
                                            } else {
                                                setValue("");
                                            }
                                        })
                                    }
                                } else {
                                    setValue(values);
                                }
                            }
                            function setValue(value) {
                                if (elem[key] === undefined) {
                                    elem.setAttribute(key, value);
                                } else {
                                    elem[key] = value;
                                }
                            }
                        }
                    }
                    const keys = Object.keys(node);
                    for (const key of keys) {
                        if (key !== "name") {
                            const ruleBack = setRule[key];
                            if (ruleBack) {
                                await ruleBack(key);
                            } else {
                                setRule.default(key);
                            }
                        }
                    }
                    // 递归创建子元素
                    if (!!node.add && node.add.length > 0) {
                        await this.AddDOM({
                            addNode: elem,
                            addData: node.add
                        });
                    }
                    All.push(elem);
                }
            }
            if (index === true) {
                return All;
            }
            return All[index];
        }

        /**
         * 节点清除器
         * @param {element} element 需求移除的元素
         * @param {string} params 需要移除的选项"all"表示包括当前元素，"child"移除其子元素，默认只移除子元素
         * @param {number} reTime 延迟删除，单位ms
         */
        RemoveDom = (element, params = "child", reTime) => {
            if (!element) {
                return false;
            }
            function removeList(list) {
                if (list && list.children) {
                    Array.from(list.children).forEach((item) => {
                        removeList(item);
                        item._remove ? item._remove() : item.remove();
                    })
                }
            }
            function run() {
                removeList(element);
                if (params.toLowerCase() === "all") {
                    element._remove ? element._remove() : element.remove();
                }
                element = null;
            }
            if (!reTime) {
                run();
            } else {
                setTimeout(run, reTime);
            }
        }

        /**
         * 对象变化监听
         * @param {Object} obj 需要监听的对象
         * @param {string} property 监听的键名
         * @param {Function} callback 变化时的回调
         */
        ObjectProperty(obj, property, callback) {
            if (typeof property === "string") {
                property = [property];
            }
            const objArr = property.map((objKey) => {
                // 如果还没有为该属性创建回调数组，则初始化为空数组
                const callbacksKey = `__${objKey}_callbacks`;
                if (!obj.hasOwnProperty(callbacksKey)) {
                    Object.defineProperty(obj, callbacksKey, {
                        value: [],
                        enumerable: false,
                        writable: true
                    })
                    let value = obj[objKey];
                    Object.defineProperty(obj, objKey, {
                        get: function () {
                            return value;
                        },
                        set: function (newValue) {
                            value = newValue;
                            // 当属性值改变时，遍历并执行所有回调函数
                            obj[callbacksKey].forEach((callObj) => {
                                callObj.callback({
                                    name: objKey,
                                    value: newValue,
                                    stop: () => stop(callObj.uuid)
                                })
                            })
                        }
                    })
                }
                function stop(uuid) {
                    const taskObj = obj[callbacksKey].filter(item => item.uuid !== uuid);
                    obj[callbacksKey] = taskObj;
                }
                const callObj = { callback, uuid: crypto.randomUUID() };
                // 将新的回调添加到回调数组中
                obj[callbacksKey].push(callObj);
                // 立即执行回调函数
                callback({
                    name: objKey,
                    value: obj[objKey],
                    stop: () => stop(callObj.uuid)
                });
                // 返回当前的属性值
                return {
                    name: objKey,
                    value: obj[objKey]
                }
            })
            return objArr;
        }

        /**
         * 节流器，指定时间内频繁触发，只运行最后一次
         * @param {Function} callback 节流的回调函数
         * @param {number} delay 节流时间
         * @returns 返回节流器的触发函数
         */
        ThrottleOver = (callback, delay) => {
            let timer = null;
            function runCallback() {
                if (delay === undefined) {
                    return false;
                }
                const context = this;
                const args = arguments;
                if (timer) {
                    clearTimeout(timer);
                }
                timer = setTimeout(function () {
                    callback.apply(context, args);
                    timer = null;
                }, delay || 300);
            }
            runCallback.time = (time) => {
                delay = time;
            }
            return runCallback;
        }

        /**
         * 网络请求监听器
         * @param {object} params 传入一个配置对象，键名：[{ method, url | body: regex | string | function, callback, stop}]
         * @returns callback({ type: "send", data, sendBody, stop })
         */
        WaylayHTTP(params) {
            const win = unsafeWindow;
            if (!win.waylayHTTPConfig) {
                win.waylayHTTPConfig = [];
                // 重写xhr，监听网络请求
                const originalXMLHttpRequest = win.XMLHttpRequest;
                win.XMLHttpRequest = rewriteRequest;
                window.XMLHttpRequest = rewriteRequest;
                function rewriteRequest() {
                    const xhr = new originalXMLHttpRequest();
                    // 重写 open 方法
                    const XMLopen = xhr.open;
                    let openParam = [];
                    xhr.open = function () {
                        openParam = arguments;
                        XMLopen.apply(this, arguments);
                    };
                    // 重写 send 方法
                    const XMLsend = xhr.send;
                    xhr.send = function (sendBody) {
                        const self = this;
                        const config = win.waylayHTTPConfig;
                        let runIndex = 0;
                        for (const list of config) {
                            if (!list.method || list.method === "*" || list.method === openParam[0]) {
                                if (isWaylay(list, openParam[1], sendBody)) {
                                    const backData = {
                                        type: "stop",
                                        sendBody: sendBody,
                                        data: self,
                                        openParam: openParam,
                                        stop: () => stop(list),
                                        back: back,
                                        send: async () => {
                                            XMLsend.apply(self, arguments);
                                            return new Promise((resolve, reject) => addLoad(resolve));
                                        }
                                    }
                                    if (!!list.stop) {
                                        runIndex++;
                                        list.callback(backData);
                                        continue;
                                    }
                                    addLoad(list.callback);
                                    function addLoad(callback) {
                                        function loadOver() {
                                            callback({ ...backData, data: this });
                                            self.removeEventListener("load", loadOver);
                                        }
                                        self.addEventListener("load", loadOver);
                                    }
                                }
                            }
                        }
                        if (runIndex === 0) {
                            XMLsend.apply(self, arguments);
                        }
                    };
                    // 重写返回值
                    function back(backObj = {}) {
                        const xhrObj = {
                            // readyState: 4,
                            status: 200,
                            ...backObj
                        };
                        if (backObj.response) {
                            xhrObj.responseText = backObj.response;
                        } else if (backObj.responseText) {
                            xhrObj.response = backObj.responseText;
                        }
                        for (const key of Object.keys(xhrObj)) {
                            const value = xhrObj[key];
                            Object.defineProperty(xhr, key, {
                                get: function () {
                                    if (["response", "responseText"].includes(key)) {
                                        return typeof value === "object" ? JSON.stringify(value) : value;
                                    }
                                    return value;
                                },
                                configurable: true,
                                enumerable: true
                            });
                        }
                        if (xhr.onreadystatechange) xhr.onreadystatechange();
                        if (xhr.onload) xhr.onload();
                    }
                    return xhr;
                };
                // 停止监听
                function stop(list) {
                    const taskObj = win.waylayHTTPConfig.filter(item => item.uuid !== list.uuid);
                    win.waylayHTTPConfig = taskObj;
                }
                // 判断是否需要拦截
                function isWaylay(obj, urlStr, bodyStr) {
                    const { url, body } = obj;
                    const testUrl = paramTest(url, urlStr);
                    const testBody = paramTest(body, bodyStr);
                    return !!testUrl && !!testBody ? true : false;
                }
                function paramTest(value, data) {
                    if (!value || !data) {
                        return true;
                    }
                    if (typeof value === "string") {
                        return data.includes(value);
                    }
                    if (value instanceof RegExp) {
                        return value.test(data);
                    }
                    if (typeof value === "function") {
                        try {
                            return value(data);
                        } catch (error) {
                            console.error(error);
                        }
                    }
                }
            }
            for (const list of params) {
                win.waylayHTTPConfig.push({ ...list, uuid: crypto.randomUUID() });
            }
        }

        /**
         * 页面渲染时运行函数
         * @param {function} callback 回调函数
         * @param {number} index 运行帧，默认直接（0）
         */
        RunFrame = (callback, index = 0) => {
            return new Promise((resolve, reject) => {
                let count = 0;
                function frame() {
                    if (count === index || index < 0) {
                        resolve(callback());
                    } else if (count < index) {
                        count++;
                        requestAnimationFrame(frame);
                    } else {
                        reject(new Error("Index超过帧数"));
                    }
                }
                requestAnimationFrame(frame);
            })
        }

        /**
         * 元素变化观察器         * 
         * @param {function} runback 需要运行的回调（mutation）
         * @returns {{observe:ObserveMethod, stop:function, callback:function}} - 返回实例功能
         * - observe(element, config) 开始观察
         * - stop() 停止观察
         * - callback(callback) 回调函数
         * @typedef {(element: HTMLElement, config: ObserveConfig) => void} ObserveMethod
         * @typedef {object} ObserveConfig
         * @property {boolean} config.attributes - 监视属性的变化
         * @property {boolean} config.childList - 监视子节点的变化
         * @property {boolean} config.subtree - 监视整个子树
         * @property {boolean} config.characterData - 监视节点内容或文本的变化
         * @property {boolean} config.attributeOldValue - 记录属性变化前的值
         * @property {boolean} config.characterDataOldValue - 记录文本内容变化前的值
         */
        ObserverDOM(runback = () => { }) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(runback);
            })
            const result = {
                /**
                 * 开始观察元素变化
                 * @param {*} element 观察的元素
                 * @param {*} config 观察配置
                 * @returns 返回实例功能
                 */
                observe: (element, config) => {
                    observer.observe(element, config);
                    return result;
                },
                stop: () => {
                    observer.disconnect();
                    return result;
                },
                callback: (callback) => {
                    runback = callback;
                    return result;
                }
            }
            return result;
        }
    }
    // uuid函数覆盖
    crypto.randomUUID = crypto.randomUUID || (() => {
        // RFC4122 version 4 form
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
            const r = (crypto.getRandomValues(new Uint8Array(1))[0] % 16) | 0;
            const v = c === "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        })
    })
    // 气泡消息
    GM_addStyle(`
        .gm-message {
            position: fixed;
            display: flex;
            z-index: 2000000;
            pointer-events: none;
            font-size: 16px;
        }
        .gm-message-place-0,
        .gm-message-place-2 {
            top: 0;
            left: 0;
            flex-direction: column;
        }
        .gm-message-place-2 {
            right: 0;
        }
        .gm-message-place-3,
        .gm-message-place-4 {
            bottom: 0;
            left: 0;
            flex-direction: column-reverse;
            margin-bottom: 30px;
        }
        .gm-message-place-3 {
            right: 0;
        }
        .gm-message-place-1 {
            top: 0;
            left: 0;
            right: 0;
            align-items: center;
            flex-direction: column;
        }
        .gm-message-main {
            opacity: 0;
            margin: auto;
            height: 0;
            transition: 0.3s;
            overflow: hidden;
            border-radius: 6px;
            box-shadow: 0 1px 6px rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
        }
        .gm-message-body {
            display: flex;
            padding: 12px 12px;
            text-align: center;
            line-height: 1;
            color: #000000;
            background: #ffffff;
            pointer-events: auto;
            user-select: text;
        }
        .gm-message-ico,
        .gm-message-text {
            top: 0;
            bottom: 0;
            margin: auto;
            padding: 0 5px;
        }
        .gm-message-text {
            font-size: 16px;
            line-height: 1.2;
        }
    `)
    const plug = new Plug_Plug();
    Plug_fnClass = () => plug;
    return plug;
}