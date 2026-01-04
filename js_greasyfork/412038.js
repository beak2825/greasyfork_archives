// ==UserScript==
// @name         哔哩哔哩直播间舰长列表新增减少检测
// @version      1.0.4
// @description  看看是哪个小宝贝过期了2333
// @author       Sonic853
// @namespace    https://blog.853lab.com
// @include      https://live.bilibili.com/*
// @run-at       document-end
// @license      MIT License
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/412038/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%E9%97%B4%E8%88%B0%E9%95%BF%E5%88%97%E8%A1%A8%E6%96%B0%E5%A2%9E%E5%87%8F%E5%B0%91%E6%A3%80%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/412038/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%E9%97%B4%E8%88%B0%E9%95%BF%E5%88%97%E8%A1%A8%E6%96%B0%E5%A2%9E%E5%87%8F%E5%B0%91%E6%A3%80%E6%B5%8B.meta.js
// ==/UserScript==
// 
// 律师函收到之日，即是我死期到来之时。
// 学写代码学到现在也不过是一枚棋子，随用随弃。
// ：）
// 
// https://api.live.bilibili.com/xlive/app-room/v2/guardTab/topList?roomid=15667&page=1&ruid=1968333&page_size=29
(function () {
    'use strict';

    const DEV_Log = Boolean(localStorage.getItem("Dev-853"));
    const localItem = "Lab8A";
    const NAME = "舰长检测";
    const Console_log = function (text) {
        let d = new Date().toLocaleTimeString();
        console.log("[" + NAME + "][" + d + "]: " + text);
    };
    const Console_Devlog = function (text) {
        let d = new Date().toLocaleTimeString();
        DEV_Log && (console.log("[" + NAME + "][" + d + "]: " + text));
    };
    const Console_error = function (text) {
        let d = new Date().toLocaleTimeString();
        console.error("[" + NAME + "][" + d + "]: " + text);
    };
    let dateFormat = function (fmt, date) {
        let ret;
        const opt = {
            "Y+": date.getFullYear().toString(),        // 年
            "m+": (date.getMonth() + 1).toString(),     // 月
            "d+": date.getDate().toString(),            // 日
            "H+": date.getHours().toString(),           // 时
            "M+": date.getMinutes().toString(),         // 分
            "S+": date.getSeconds().toString()          // 秒
            // 有其他格式化字符需求可以继续添加，必须转化成字符串
        };
        for (let k in opt) {
            ret = new RegExp("(" + k + ")").exec(fmt);
            if (ret) {
                fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
            };
        };
        return fmt;
    }

    if (typeof GM_xmlhttpRequest === 'undefined' && typeof GM_registerMenuCommand === 'undefined' && typeof GM_setValue === 'undefined' && typeof GM_getValue === 'undefined' && typeof GM_addStyle === 'undefined') {
        Console_error("GM is no Ready.");
    } else {
        Console_log("GM is Ready.");
    };

    let BLab8A = class {
        constructor() {
            this.data = this.load();
        }
        load() {
            Console_log("正在加载数据");
            let newj = "{\"Roomid\":\"15667\",\"ruid\":\"1968333\",\"GList\":[],\"Lost\":[],\"New\":[],\"Check_date\":\"1997-07-22\",\"auto\":false,\"first_use\":true,\"HL\":[],\"History\":{}}";
            if (typeof GM_getValue !== 'undefined') {
                let gdata = JSON.parse(GM_getValue(localItem, newj));
                return gdata;
            } else {
                let ldata = JSON.parse(localStorage.getItem(localItem) === null ? newj : localStorage.getItem(localItem));
                return ldata;
            }
        };
        save(d) {
            Console_log("正在保存数据");
            d === undefined ? (d = this.data) : (this.data = d);
            typeof GM_getValue != 'undefined' ? GM_setValue(localItem, JSON.stringify(d)) : localStorage.setItem(localItem, JSON.stringify(d));
            return this;
        };
    };
    let bLab8A = new BLab8A();

    let window = unsafeWindow;

    !DEV_Log && GM_addStyle(`#Bili8-UI{position:fixed;left:0;bottom:0;z-index:9999;background-color:white;border:1px solid black;width:400px;height:300px;}#Bili8-UI .Close{position:absolute;top:-25px;height:25px;right:0;}#Bili8-UI .State{position:absolute;top:2px;height:20px;line-height:20px;left:2px;right:2px;}#Bili8-UI .MainList{position:absolute;top:22px;bottom:44px;left:2px;right:2px;border:1px solid black;overflow-y:auto;}#Bili8-UI .ListNew{position:absolute;width:calc(30% - 3px);top:0;bottom:0;left:0;right:calc(70% - 3px);resize:none;}#Bili8-UI .ListNow{position:absolute;top:0;bottom:0;width:40%;left:30%;resize:none;}#Bili8-UI .ListLost{position:absolute;width:calc(30% - 3px);top:0;bottom:0;left:calc(70% - 3px);right:0;resize:none;}#Bili8-UI .MainBottom{position:absolute;bottom:2px;left:2px;right:2px;height:40px;}#Bili8-UI .MainBottom .MBtn{position:absolute;display:block;height:20px;padding:0;box-sizing:border-box;}#Bili8-UI .MainBottom .MBRID{top:20px;left:0;width:100px;}#Bili8-UI .MainBottom .MBTAuto{top:20px;left:100px;width:50px;line-height:20px;}#Bili8-UI .MainBottom .MBAuto{top:20px;left:150px;width:20px;}#Bili8-UI .MainBottom .MBSaveSetting{top:20px;left:170px;}#Bili8-UI .MainBottom .LoadList{bottom:0;right:0;height:28px;width:70px;}#Bili8-UI .MainBottom .MBTNew{top:0;left:0;}#Bili8-UI .MainBottom .MBTLost{top:0;right:0;}`);
    let HTTPsend = function (url, method, Type, successHandler, errorHandler) {
        Console_Devlog(url);
        if (typeof GM_xmlhttpRequest != 'undefined') {
            GM_xmlhttpRequest({
                method: method,
                url: url,
                responseType: Type,
                onerror: function (response) {
                    Console_Devlog(response.status);
                    errorHandler && errorHandler(response.status);
                },
                onload: function (response) {
                    let status;
                    if (response.readyState == 4) { // `DONE`
                        status = response.status;
                        if (status == 200) {
                            Console_Devlog(response.response);
                            successHandler && successHandler(response.response);
                        } else {
                            Console_Devlog(status);
                            errorHandler && errorHandler(status);
                        }
                    }
                },
            });
        } else {
            let xhr = new XMLHttpRequest();
            xhr.open(method, url, true);
            xhr.withCredentials = true;
            xhr.responseType = Type;
            xhr.onreadystatechange = function () {
                let status;
                if (xhr.readyState == 4) { // `DONE`
                    status = xhr.status;
                    if (status == 200) {
                        Console_log(xhr.response);
                        successHandler && successHandler(xhr.response);
                    } else {
                        Console_log(status);
                        errorHandler && errorHandler(status);
                    }
                }
            };
            xhr.send();
        }
    };
    let JSON_parse = function (data) {
        let rdata;
        try {
            rdata = JSON.parse(data);
        } catch (error) {
            Console_Devlog("JSON已解析，直接跳过");
            rdata = result;
        }
        return rdata;
    }

    let GLC = class {
        constructor() {
            this.List = new Array();
            this.old_List = bLab8A.data.GList;
            this.page = this.now = 1;
            this.first_use = bLab8A.data.first_use;
            this.cdate = dateFormat("YYYY-mm-dd", new Date());
            this.runing = false;
        }
        check_room() {
            if (window.location.pathname != "/" + bLab8A.data.Roomid) {
                if (window.location.pathname != "/blanc/" + bLab8A.data.Roomid) {
                    Console_log("检测到当前直播间并非在执行范围内：" + window.location.pathname);
                    return false;
                }
                return true;
            }
            return true;
        }
        change_rid(Roomid) {
            if (Roomid === undefined) {
                Roomid = bLab8A.data.Roomid;
            } else {
                if (bLab8A.data.Roomid != Roomid) {
                    bLab8A.data.GList = bLab8A.data.New = bLab8A.data.Lost = this.old_List = this.List = new Array();
                    bLab8A.data.first_use = this.first_use = true;
                }
                bLab8A.data.Roomid = Roomid;
            }
            HTTPsend("https://api.live.bilibili.com/xlive/web-room/v1/index/getInfoByUser?room_id=" + Roomid, "GET", "", (result) => {
                let rdata = JSON_parse(result);
                if (rdata.code == 0) {
                    bLab8A.data.ruid = rdata.data.medal.up_medal.uid.toString();
                    bLab8A.save();
                    Console_log("保存成功。");
                } else {
                    Console_error("保存出错。");
                }
            });
        }
        first_check() {
            this.cdate = dateFormat("YYYY-mm-dd", new Date());
            if (bLab8A.data.Check_date != this.cdate) {
                (bLab8A.data.HL.indexOf(bLab8A.data.Check_date) == -1) && bLab8A.data.HL.push(bLab8A.data.Check_date);
                bLab8A.data.History[bLab8A.data.Check_date] = { New: [], Lost: [] }
                bLab8A.data.History[bLab8A.data.Check_date]["New"] = bLab8A.data.New;
                bLab8A.data.History[bLab8A.data.Check_date]["Lost"] = bLab8A.data.Lost;
                // console.log(bLab8A.data);
                bLab8A.save();
            }
            this.List = new Array();
            this.old_List = bLab8A.data.GList;
            this.now = 1;
            this.runing = true;
            this.check(this.now);
        }
        check(page) {
            // 获得当前的舰长列表
            if (page === undefined) {
                this.now = page = 1 + this.now;
            } else {
                this.now = page;
            }
            HTTPsend("https://api.live.bilibili.com/xlive/app-room/v2/guardTab/topList?roomid=" + bLab8A.data.Roomid + "&page=" + page + "&ruid=" + bLab8A.data.ruid + "&page_size=29", "GET", "", (result) => {
                let rdata = JSON_parse(result);
                if (rdata.code == 0) {
                    this.page = rdata.data.info.page;
                    rdata.data.list.forEach(e => {
                        this.List.push({
                            uid: e.uid,
                            username: e.username,
                            face: e.face,
                            guard_level: e.guard_level
                        });
                    });
                    if (rdata.data.info.page > page) {
                        setTimeout(() => { this.check(); }, 300);
                    } else {
                        // this.cdate = dateFormat("YYYY-mm-dd",new Date());
                        if (this.first_use) {
                            bLab8A.data.first_use = this.first_use = false;
                        } else {
                            this.check_lost();
                            this.check_new();
                        }
                        bLab8A.data.GList = this.old_List = this.List;
                        bLab8A.data.Check_date = this.cdate;
                        this.runing = false;
                        bLab8A.save();
                    }
                }
            });
        }
        check_lost() {
            // 丢失了多少舰长
            // 旧列表 - 新列表 = 丢失的舰长
            let ll = this.check_list(this.old_List, this.List);
            if (bLab8A.data.Check_date != this.cdate) {
                bLab8A.data.Lost = ll;
            } else {
                bLab8A.data.Lost.concat(ll);
            }
        }
        check_new() {
            // 新增了多少舰长
            // 新列表 - 旧列表 = 新增的舰长
            let nl = this.check_list(this.List, this.old_List);
            if (bLab8A.data.Check_date != this.cdate) {
                bLab8A.data.New = nl;
            } else {
                bLab8A.data.New.concat(nl);
            }
        }
        check_list(list1, list2) {
            // 以上两个列表对比，没有相同的数据，放到 tmp_List 里
            let tmp_List = new Array();
            for (let i = 0; i < list1.length; i++) {
                let not_new = false;
                const e = list1[i];
                for (let k = 0; k < list2.length; k++) {
                    const d = list2[k];
                    if (e.uid == d.uid) {
                        not_new = true;
                        break;
                    }
                }
                !not_new && tmp_List.push(e);
            }
            return tmp_List;
        }
    }
    let gLC = new GLC();
    let CreactUI = function () {
        if (document.getElementById("Bili8-UI")) {
            // lists.Set("加载中。。。");
            // lists.BG("normal");
            document.getElementById("Bili8-UI").style.display = "block";
        } else {
            let Panel_ui = document.createElement("div");
            Panel_ui.classList.add("Bili8-UI", "Panel");
            Panel_ui.id = "Bili8-UI";

            let PanelClose_ui = document.createElement("button");
            PanelClose_ui.classList.add("Close");
            PanelClose_ui.innerText = "关闭";

            let StateText_ui = document.createElement("div");
            StateText_ui.innerHTML = "";
            StateText_ui.classList.add("State");

            let MainList_ui = document.createElement("div");
            MainList_ui.classList.add("MainList");

            let List_ui = document.createElement("textarea");
            List_ui.classList.add("ListNew");
            List_ui.readOnly = true;

            let List_ui2 = document.createElement("textarea");
            List_ui2.classList.add("ListLost");
            List_ui2.readOnly = true;

            let List_ui3 = document.createElement("textarea");
            List_ui3.classList.add("ListNow");
            List_ui3.readOnly = true;

            let MainBottom_ui = document.createElement("div");
            MainBottom_ui.classList.add("MainBottom");

            let RIDInput_ui = document.createElement("input");
            RIDInput_ui.title = "主播房间ID";
            RIDInput_ui.placeholder = "主播房间ID";
            RIDInput_ui.type = "text";
            RIDInput_ui.value = bLab8A.data.Roomid;
            RIDInput_ui.classList.add("MBtn", "MBRID");

            let AutoInput_ui = document.createElement("input");
            AutoInput_ui.title = "自动查询";
            AutoInput_ui.type = "checkbox";
            AutoInput_ui.checked = bLab8A.data.auto;
            AutoInput_ui.classList.add("MBtn", "MBAuto");

            let AutoText_ui = document.createElement("div");
            AutoText_ui.innerHTML = "自动查询";
            AutoText_ui.classList.add("MBtn", "MBTAuto");

            let NewText_ui = document.createElement("div");
            NewText_ui.innerHTML = "新增";
            NewText_ui.classList.add("MBtn", "MBTNew");

            let LostText_ui = document.createElement("div");
            LostText_ui.innerHTML = "失去";
            LostText_ui.classList.add("MBtn", "MBTLost");

            let SaveSetting_ui = document.createElement("button");
            SaveSetting_ui.classList.add("MBtn", "MBSaveSetting");
            SaveSetting_ui.innerText = "保存设置";

            let LoadList_ui = document.createElement("button");
            LoadList_ui.classList.add("MBtn", "LoadList");
            LoadList_ui.innerText = "开始查询";
            // LoadList_ui.disabled = true;

            Panel_ui.appendChild(PanelClose_ui);
            Panel_ui.appendChild(StateText_ui);
            MainList_ui.appendChild(List_ui);
            MainList_ui.appendChild(List_ui3);
            MainList_ui.appendChild(List_ui2);
            Panel_ui.appendChild(MainList_ui);
            MainBottom_ui.appendChild(RIDInput_ui);
            MainBottom_ui.appendChild(AutoText_ui);
            MainBottom_ui.appendChild(AutoInput_ui);
            MainBottom_ui.appendChild(NewText_ui);
            MainBottom_ui.appendChild(LostText_ui);
            MainBottom_ui.appendChild(SaveSetting_ui);
            MainBottom_ui.appendChild(LoadList_ui);
            Panel_ui.appendChild(MainBottom_ui);
            document.body.appendChild(Panel_ui);

            SaveSetting_ui.addEventListener("click", () => {
                (bLab8A.data.Roomid != RIDInput_ui.value) && confirm("确定要改变监听的直播间吗？改变后将清空之前保存的舰长列表！") && gLC.change_rid(RIDInput_ui.value);
                bLab8A.data.auto = AutoInput_ui.checked;
                bLab8A.save();
                lists.Set("设置已保存");
            });
            LoadList_ui.addEventListener("click", () => {
                if (!gLC.runing) {
                    if (!gLC.check_room()) {
                        confirm("当前直播间并不在设置的直播间内，是否先回到设置的直播间？") && (window.location.href = "/" + bLab8A.data.Roomid);
                        return;
                    }
                    lists.BG("running");
                    lists.Set("正在查询");
                    gLC.first_check();
                    let t2 = setInterval(() => {
                        if (!gLC.runing) {
                            load_list();
                            lists.BG("normal");
                            lists.Set("新增：" + bLab8A.data.New.length + "，失去：" + bLab8A.data.Lost.length);
                            clearInterval(t2);
                        }
                    }, 100);
                } else {
                    lists.Set("请求已经发送过去了，请勿重复点击！");
                }
            });
            PanelClose_ui.addEventListener("click", () => {
                document.getElementById("Bili8-UI").style.display = "none";
            });
        }
    };
    let Lists = class {
        Get(obj) {
            if (obj === undefined) {
                obj = document.getElementById("Bili8-UI").getElementsByClassName("State")[0];
            }
            return obj.innerHTML;
        };
        Set(text, obj) {
            if (obj === undefined) {
                obj = document.getElementById("Bili8-UI").getElementsByClassName("State")[0];
            }
            obj.innerHTML = text;
        };
        Add(text, obj) {
            if (obj === undefined) {
                obj = document.getElementById("Bili8-UI").getElementsByClassName("List")[0];
            }
            if (obj.innerHTML == "") {
                obj.innerHTML = text;
            } else {
                obj.innerHTML += "\n" + text;
            }
        };
        Clear(obj) {
            if (obj === undefined) {
                obj = document.getElementById("Bili8-UI").getElementsByClassName("List")[0];
            }
            obj.innerHTML = "";
        };
        BG(status, obj) {
            if (obj === undefined) {
                obj = document.getElementById("Bili8-UI").getElementsByClassName("State")[0];
            }
            let color = "#FFFFFF";
            switch (status) {
                case "normal":
                    color = "#FFFFFF";
                    break;
                case "running":
                    color = "#FFCC80";
                    break;
                case "success":
                    color = "#91FFC2";
                    break;
                case "error":
                    color = "#F45A8D";
                    break;
                default:
                    color = "#FFFFFF";
                    break;
            }
            obj.style.backgroundColor = color;
        }
    };
    let lists = new Lists();

    let load_list = function () {
        let List_ui = document.getElementById("Bili8-UI").getElementsByClassName("ListNew")[0];
        lists.Clear(List_ui);
        if (bLab8A.data.New.length > 0) {
            bLab8A.data.New.forEach(e => {
                lists.Add(e.username + "：" + e.uid, List_ui);
            });
        }
        let List_ui2 = document.getElementById("Bili8-UI").getElementsByClassName("ListLost")[0];
        lists.Clear(List_ui2);
        if (bLab8A.data.Lost.length > 0) {
            bLab8A.data.Lost.forEach(e => {
                lists.Add(e.username + "：" + e.uid, List_ui2);
            });
        }
        let List_ui3 = document.getElementById("Bili8-UI").getElementsByClassName("ListNow")[0];
        lists.Clear(List_ui3);
        if (bLab8A.data.GList.length > 0) {
            bLab8A.data.GList.forEach(e => {
                lists.Add(e.username + "：" + e.uid, List_ui3);
            });
        }
    }


    let CreactMenu = function () {
        let Creact_G = function (Mode) {
            if (Mode == 1) {
                if (!gLC.check_room()) {
                    confirm("当前直播间并不在设置的直播间内，是否先回到设置的直播间？") && (window.location.href = "/" + bLab8A.data.Roomid);
                    return;
                }
                lists.BG("running");
                lists.Set("正在查询");
                gLC.first_check();
                let t2 = setInterval(() => {
                    if (!gLC.runing) {
                        load_list();
                        lists.BG("normal");
                        lists.Set("新增：" + bLab8A.data.New.length + "，失去：" + bLab8A.data.Lost.length);
                        clearInterval(t2);
                    }
                }, 100);
            }
            CreactUI();
        }
        GM_registerMenuCommand("打开面板", () => { Creact_G(0) });
        GM_registerMenuCommand("开始查询", () => { Creact_G(1) });
    };

    CreactMenu();
    gLC.check_room() && CreactUI();
    document.getElementById("Bili8-UI").style.display = "none";

    gLC.check_room() && bLab8A.data.auto && gLC.first_check();
    if (gLC.runing) {
        let t2 = setInterval(() => {
            if (!gLC.runing) {
                load_list();
                lists.Set("新增：" + bLab8A.data.New.length + "，失去：" + bLab8A.data.Lost.length);
                clearInterval(t2);
            }
        }, 100);
    }
})();
