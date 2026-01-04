// ==UserScript==
// @name         b站自动点赞投币
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  自动b站点赞投币
// @author       whiteGoose
// @match        https://www.bilibili.com/video/BV*
// @match        https://www.bilibili.com/bangumi/play/*
// @icon         http://www.bilibili.com/favicon.ico
// @require		 https://code.jquery.com/jquery-3.7.1.min.js
// @require		 https://cdn.jsdelivr.net/npm/sweetalert2@11.12.2/dist/sweetalert2.all.min.js
// @license      MIT
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue
// @grant GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/487510/b%E7%AB%99%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E%E6%8A%95%E5%B8%81.user.js
// @updateURL https://update.greasyfork.org/scripts/487510/b%E7%AB%99%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E%E6%8A%95%E5%B8%81.meta.js
// ==/UserScript==

function GetUp() {
    let name = $(".up-avatar").attr("href");
    //    console.log(name);
    if (name != undefined) {
        name = name.split("/")[3];
        return name;
    }
}
function init_config(){
    let config=GM_getValue("config",undefined)
    if(!config){
        GM_setValue("config",{"chase_auto_thumsup":true})
        config=GM_getValue("config",undefined)
    }
    let bangumi_md;
    let video_type=bv.videoType;
    if(video_type=="bangumi"){
        bangumi_md=get_bangumi()
        if(config.chase_auto_thumsup){
            if(is_chasing()){
                if(!GM_getValue(bangumi_md)){
                    GM_setValue(get_bangumi(), [get_bangumi_name(), 0])
                }
            }
        }
    }
    return config
}

function get_bangumi() {
    let url = $("#__next > div.home-container > div.main-container > div.plp-l.sticky > div > div.mediainfo_mediaInfoWrap__nCwhA > a").attr("href")
    // console.log(url.split("/")[5])
    return url.split("/")[5]
}
function get_bangumi_name() {
    let name = $("#__next > div.home-container > div.main-container > div.plp-l.sticky > div > div.mediainfo_mediaInfoWrap__nCwhA > div > a.mediainfo_mediaTitle__Zyiqh").text()
    // console.log(name)
    return name
}

function GetUps() {
    let name = $(".membersinfo-upcard");
    console.log(name.length);
    for (var i = 0; i < name.length; i++) {
        console.log(name[i].children[0].href.split("/")[3]);
    }
    return name;
}
function GetUpName() {
    let name = $("#mirror-vdcon > div.right-container > div > div.up-panel-container > div.up-info-container > div.up-info--right > div.up-info__detail > div > div.up-detail-top > a.up-name")
    name = name.text().trim();
    if (name == "") {
        name = $("#mirror-vdcon > div.right-container.is-in-large-ab > div > div.up-panel-container > div.up-info-container > div.up-info--right > div.up-info__detail > div > div.up-detail-top > a.up-name");
        name = name.text().trim();
    }
    return name;
}
function AddId() {
    let id = GetId();
    GetUpName();
    if (id == "None") {
        if (bv.videoType == "video") {
            GM_setValue(GetUp(), [GetUpName(), 0]);  //数字0,1,2,3.只点赞,投一个币,投两个币,三连
            console.log("已添加");
        } else {
            GM_setValue(get_bangumi(), [get_bangumi_name(), 0])
            console.log("已添加番剧")
        }
        Init();
    }
    //    console.log(id);
}
function GetId() {
    let result;
    if (bv.videoType == "video") {
        result = GM_getValue(GetUp(), "None");
    } else {
        result = GM_getValue(get_bangumi(), "None");
    }
    return result;
}
function DeleteId() {
    if (bv.videoType == "video") {
        let deleteResult = GM_deleteValue(GetUp());
    } else {
        let deleteResult = GM_deleteValue(get_bangumi());
    }
    console.log("已删除");
    Init();
}
function GetListId() {
    console.log(GM_listValues());
}
function GetListName() {
    let list = GM_listValues();
    // console.log(list)
    let data = [];
    for (var i = 0; i < list.length; i++) {
        // console.log(GM_getValue(list[i]),list[i]);
        if(list[i]=="config"){
            continue
        }
        if (bv.videoType == "video") {
            if (list[i].includes("md")) {
                continue
            }
        } else {
            if (!list[i].includes("md")) {
                continue
            }
        }
        let status = GM_getValue(list[i]);
        let result = { 'uid': list[i], 'name': status[0], 'mode': status[1] }
        data.push(result)
    }
    return data;
}
//投币
function toubi(result = null) {
    //    console.log("tou?");
    if(bv.videoType=="video"){
        let dianzanr = $("#arc_toolbar_report > div.video-toolbar-left > div.video-toolbar-left-main > div:nth-child(1) > div").attr("class") == "video-like video-toolbar-left-item on";
        if (dianzanr == true) return false;
        let toubis = $("#arc_toolbar_report > div.video-toolbar-left > div.video-toolbar-left-main > div:nth-child(2) > div");
        toubis.click();
        setTimeout(function () {
            
            if (result[1] == 1) {
                let quantity = $("body > div.bili-dialog-m > div > div > div.mc.clearfix > div.mc-box.left-con");
                quantity.click();
            }
            let confi = $("body > div.bili-dialog-m > div > div > div.coin-bottom > span");
            //    console.log(confi.text());
            confi.click();
        }, 1);
    }else{
        let coin_button=document.querySelector("#ogv_weslie_tool_coin_info")
        let enterEvent = new KeyboardEvent("keydown", {
            key: "w",
            code: "KeyQ",
            bubbles: true
        });
        coin_button.dispatchEvent(enterEvent);
        // 触发 keyup 事件
        let keyUpEvent = new KeyboardEvent("keyup", {
            key: "w",
            code: "KeyQ",
            bubbles: true
        });
        coin_button.dispatchEvent(keyUpEvent);
        setTimeout(function(){
            if (result[1] == 1) {
                let quantity = document.querySelector("#__next > div.home-container > div.main-container > div.dialogcoin_coin_dialog_mask__BEw2o > div > div > div.dialogcoin_mc__JNSq7");
                console.log(quantity.children[0])
                quantity.children[0].dispatchEvent(new MouseEvent("click"))
            }
        },1)
    }
    return true;
}
//点赞
function dianzan() {
    if(bv.videoType=="video"){
        let dianzanr = $("#arc_toolbar_report > div.video-toolbar-left > div.video-toolbar-left-main > div:nth-child(1) > div").attr("class") == "video-like video-toolbar-left-item on";
        // console.log(dianzanr);
        if (dianzanr == true) return true;
        let button = $("#arc_toolbar_report > div.video-toolbar-left > div.video-toolbar-left-main > div:nth-child(1) > div");
        if (button == undefined) return false;
        button.click();
    }else{
        let thumsup_button=document.querySelector(".like");
        // console.log(thumsup_button)
        if(thumsup_button==undefined)return false;
        if(thumsup_button.className=="like on")return true;
        let enterEvent = new KeyboardEvent("keydown", {
            key: "q",
            code: "KeyQ",
            bubbles: true
        });
        thumsup_button.dispatchEvent(enterEvent);
        // 触发 keyup 事件
        let keyUpEvent = new KeyboardEvent("keyup", {
            key: "q",
            code: "KeyQ",
            bubbles: true
        });
        thumsup_button.dispatchEvent(keyUpEvent);
    }
    return true;
}
//初始化按钮
function Init() {
    let button = $("#gooseAdd");
    let button2 = $("#gooseSetting");
    let button3 = $("#gooseInfo");
    // let buttons=$(".gooseCards");
    // if(buttons!="undefined"){
    //     buttons.each((index,element)=>{
    //         $(element).remove();
    //     })
    // }
    button.remove();
    button2.remove();
    button3.remove();
    SetButton();
}
//设置按钮
function SetButton() {
    // let upDiv = $("#mirror-vdcon > div.right-container.is-in-large-ab > div > div.up-panel-container > div.up-info-container > div.up-info--right > div.up-info__btn-panel");
    //关注行
    let upDiv2 = $("#mirror-vdcon > div.right-container.is-in-large-ab > div > div.up-panel-container > div.up-info-container > div.up-info--right > div.up-info__btn-panel > div");
    //up名字行
    let upDiv3 = $("#mirror-vdcon > div.right-container.is-in-large-ab > div > div.up-panel-container > div.up-info-container > div.up-info--right > div.up-info__detail > div > div.up-detail-top");
    let upDiv1 = $("#mirror-vdcon > div.right-container.is-in-large-ab > div > div.up-panel-container > div.up-info-container > div.up-info--left > div > a > div > div > img");
    let now_type = bv.videoType;
    let combinit = $(".membersinfo-upcard");
    let div4 = $("#mirror-vdcon > div.right-container > div > div.up-panel-container");
    let customerDiv = $("<div id='gooseCustomerDiv'></div>");
    if (now_type == "bangumi") {
        div4 = $("#__next > div.home-container > div.main-container > div.plp-l.sticky > div > div.mediainfo_mediaInfoWrap__nCwhA > div > div.mediainfo_mediaToolbar__8Q7bn");
    }
    div4.append(customerDiv);
    let ups = GetId();
    customerDiv.css({
        "text-align": "center",
    })
    let infoButton = InitInfoButton();
    customerDiv.append(infoButton);
    if (combinit.length != 0) {
        console.log(ups)
    } else {
        if (ups != "None") {
            let settingButton = InitSettingButton();
            customerDiv.append(settingButton);
        }
        let button = InitButton();
        customerDiv.append(button);
    }
}
//获取添加的按钮
function InitButton() {
    is_chasing()
    let result = GetId();
    let value = "";
    if (result == "None") {
        value = "添加";
    } else {
        value = "删除";
    }
    let button = document.createElement("input");
    button.setAttribute("id", "gooseAdd");
    button.setAttribute("value", value);
    button.setAttribute("type", "button");
    let styles = "border-radius:6px;border-color:pink;margin-left:10px;height:auto;width:25%;background-color:white;"
    button.setAttribute('style', styles);
    if (bv.videoType == "bangumi") {
        button.style.width = "auto";
    }
    if (value == "添加") {
        $(button).on("click", AddId);
    } else {
        $(button).on("click", DeleteId);
    }
    return button;
}
//获取设置按钮
function InitSettingButton() {
    let result = GetId()[1];
    let value = whatModeIs(result);
    let button = document.createElement("input");
    button.setAttribute("id", "gooseSetting");
    button.setAttribute("value", value);
    button.setAttribute("type", "button");
    let styles = "border-radius:6px;border-color:pink;margin-left:10px;height:auto;width:25%;background-color:white;"
    button.setAttribute('style', styles);
    button.addEventListener("click", setting);
    return button;
}
//获取信息按钮
function InitInfoButton() {
    let button = document.createElement("input");
    button.setAttribute("id", "gooseInfo");
    button.setAttribute("value", "列表");
    button.setAttribute("type", "button");
    let styles = "border-radius:6px;border-color:pink;margin-left:10px;height:auto;width:25%;background-color:white;"
    button.setAttribute('style', styles);
    if (bv.videoType == "bangumi") {
        button.style.width = "auto"
        button.style.height = "31.98px"
    }
    button.addEventListener("click", Info);
    return button;
}
//信息详情
function Info() {
    let text =
    `<input type="checkbox" id="chase_auto_thumsup" name="chase_auto_thumsup" value="chase_auto_thumsup">` +
    `<label for="chase_auto_thumsup">追番自动选择点赞</label>` +
    "<table id='gooseTable'>" +
    "<thead>" +
    "<tr>" +
    `<td>${bv.videoType == "video" ? "uid" : "md"}</td>` +
    `<td>${bv.videoType == "video" ? "up名" : "番剧名"}</td>` +
    "<td>设置</td>" +
    "<td>操作</td>" +
    "</tr>" +
    "</thead>" +
    "<tbody id='gooseUpsBody'>" +
    "</tbody>" +
    "</table>";
    Swal.fire({
        title: '自动点赞的列表',
        html: text,
        showConfirmButton: false,
        showCloseButton: true,
    })
    // console.log($(".like"))
    // console.log($(".like").attr("class"))
    let config=GM_getValue("config");
    $("#chase_auto_thumsup").prop("checked",config.chase_auto_thumsup)
    let data = GetListName();
    data.forEach((element) => {
        let uid = element['uid'];
        let name = element['name'];
        let mode = whatModeIs(element['mode']);
        let tr = `
        <tr>
            <td class="canclick" id="gooseUid">${uid}</td>
            <td class="canclick">${name}</td>
            <td class="canclick" id="gooseMode">${mode}</td>
            <td>删除</td>
        </tr>
        `;
        $("#gooseUpsBody").append(tr);
        $("#gooseTable").css({
            "width": "100%",
            "border-collapse": "collapse",
            "background-color": "#e9e9e9",
        })
        $("#gooseTable thead tr").css({
            "background-color": "lightskyblue",
        })
        $("#gooseTable tr td").css({
            "border": " 1px solid #ccc",
            "cursor": "pointer",
        })
    })
    $("#chase_auto_thumsup").click(function(){
        let conf=GM_getValue("config")
        let now_statu=this.checked
        conf.chase_auto_thumsup=now_statu
        GM_setValue("config",conf)
    })
    $("#gooseTable tbody tr").each((index, element) => {
        let uid = $(element).children()[0];
        let name = $(element).children()[1];
        let mode = $(element).children()[2];
        let del = $(element).children()[3];
        let thisId = $(uid).text()
        let thisName = $(name).text();
        if (thisId == (bv.videoType == "video" ? GetUp() : get_bangumi())) {
            $(element).css({ "background-color": "#bae5ff" })
        }
        $(uid).click(() => {
            // console.log($(uid).text(),$(uid).val())
            if (bv.videoType == "video") {
                window.open("https://space.bilibili.com/" + $(uid).text(), "_blank")
            } else {
                window.open("https://www.bilibili.com/bangumi/media/" + $(uid).text(), "_blank")
            }
        })
        $(name).click(() => {
            if (bv.videoType == "video") {
                window.open("https://space.bilibili.com/" + $(uid).text(), "_blank")
            } else {
                window.open("https://www.bilibili.com/bangumi/media/" + $(uid).text(), "_blank")
            }
        })
        $(mode).click(() => {
            let result = GM_getValue(thisId);
            result[1] = (result[1] + 1) % 3;
            GM_deleteValue(thisId);
            GM_setValue(thisId, [thisName, result[1]]);
            $(mode).text(whatModeIs(result[1]))
            // console.log(result);
            Init();
        })
        $(del).click(() => {
            console.log($(element));
            GM_deleteValue($(uid).text());
            $(element).remove()
            Init();
        })
    })
}
function whatModeIs(id) {
    let mode = "";
    switch (id) {
        case 0:
            mode = bv.videoType=="video"?"只点赞":"点赞";
            break;
        case 1:
            mode = "投一个币";
            break;
        case 2:
            mode = "投两个币";
            break;
        case 3:
            mode = "三连";
            break;
    }
    return mode;
}
//设置 按钮的事件
function setting() {
    let list = GetId()
    list[1] = (list[1] + 1) % 3;
    GM_deleteValue(GetId());
    if (bv.videoType == "video") {
        GM_setValue(GetUp(), [GetUpName(), list[1]]);
    } else {
        GM_setValue(get_bangumi(), [get_bangumi_name(),0]);
    }
    Init();
}
function GetBV() {
    let URL = window.location.href.split("/")[4];
    return URL;
}
function IsJunmping(BV, send) {
    console.log(BV, send);
    console.log(BV != GetBV());
    if (BV == null) {
        console.log("这是刚进网页的时候");
    }
    if (BV == GetBV() && send != 0) {
        console.log("还没跳转哦")
        setTimeout(IsJunmping, 3000, BV, send -= 1)
    }
    if (BV != GetBV()) {
        console.log("跳转啦!")
        setTimeout(PageInit(), 1);
        return true;
    }
    if (send == 0) {
        console.log("你是不是取消了呀?")
        return false;
    }
    console.log("what happend?");
}

function is_chasing() {
    let chase = $("#ogv-weslie-media-info-follow > span").text()
    // console.log(chase)
    return chase == "已追番"
}

let youbian = false;
let alla = false;
let ended = false;
//页面初始化
function PageInit() {
    let mq = new MessageQueue(1000, 10);
    console.log("pageinit running")
    setTimeout(function () {
        mq.Clear()
        let BV = GetBV();
        let video_type=bv.videoType
        let config=GM_getValue("config")
        init_config()
        Init();            //初始化按钮
        //合作视频卡片
        let combinit = $(".membersinfo-upcard");
        let result;
        let max = 0;
        if (combinit.length != 0) {
            console.log("这是合作视频")
            combinit.each((index, element) => {
                let up_uid = $(element.children[1].children[0]).attr("href").split("/")[3]
                let up_value = GM_getValue(up_uid, "None")
                if (up_value != "None") {
                    if (up_value[1] > max) {
                        max = up_value[1]
                    }
                    result = [up_value[0], max]
                }
            })
        } else {
            result = GetId();
        }

        if (result != "None") {    //如果被加入了,则投币
            switch (result[1]) {
                case 0:
                    mq.Add(dianzan);
                    break;
                case 1:
                case 2:
                    mq.Add(function temptou() {
                        toubi(result)
                    });
                    break;
                case 3:
                    break;
            }
        }
        mq.Run();
    }, 4000);
}
class MessageQueue {
    functionArray = [];
    timeouts;
    constructor(timeout, timeouts = 10) {
        this.timeout = timeout;
        this.timeouts = timeouts;
        this.timeouted = 0;
    }
    Add(func) {
        this.functionArray.push(func);
    }
    Print() {
        console.log(this.functionArray);
        // this.functionArray.forEach(element => {
        //     element();
        // });
        // console.log("print is ending");
    }
    async Run() {
        if (this.isRunning) {
            console.log("任务队列已经在运行中，无法重复调用");
            return; // 如果正在运行，则返回
        }
        this.isRunning = true; // 标记为正在运行
        console.log("函数列表:", this.functionArray, "超时计数器:", this.timeouted);
        while (this.functionArray.length > 0) {
            let result;
            const currentFunc = this.functionArray[0];
            result = currentFunc();
            console.log("现在正在运行的函数名为:", currentFunc.name);
            if (result === true || result === 1) {
                this.timeouted = 0;
                this.functionArray.shift(); // 移除已完成的函数
            } else {
                this.timeouted++;
            }
            if (this.timeouted === this.timeouts) {
                console.log("超时!超时的函数为:", currentFunc.name);
                this.isRunning = false; // 结束运行
                this.functionArray = [];
                return false;
            }
            let timeout = (this.timeouted * 150) + 1;
            await this.delay(timeout); // 延时函数
        }

        console.log("所有任务已完成");
        this.isRunning = false; // 结束运行
        return true;
    }
    Clear() {
        this.functionArray = [];
        this.isRunning = false; // 停止运行标志
        this.delay((this.timeouted * 150) + 1)
        this.timeouted = 0; // 重置超时计数器
    }
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

class BVGet {
    bvnow;
    videoType; // {0==番剧}
    constructor() {
        this.reset()
    }
    reset() {
        var now = window.location.pathname.split("/")
        this.videoType = now[1];
        if (this.videoType == "bangumi") {
            this.bvnow = now[3];
        }
        if (this.videoType == "video") {
            this.bvnow = now[2];
        }
        console.log(this.bvnow)
        // console.log(`这个页面的类型是${this.videoType}`)
    }
    bvGet() {
        var bvnow = window.location.pathname.split("/");
        if (this.videoType == "bangumi") {
            bvnow = bvnow[3];
        }
        if (this.videoType == "video") {
            bvnow = bvnow[2];
        }
        // console.log(this.bvnow,bvnow);
        // console.log(bvnow == this.bvnow)
        if (bvnow != this.bvnow) {
            this.isJumping();
        }
    }
    isJumping() {
        let temp = this.bvnow
        this.reset()
        if (temp == '') {
            // console.log("页面初始化!")
            return
        }
        console.log(`bv已经从${temp}跳转:${this.bvnow}`)
        PageInit();
    }
    run() {
        setInterval(() => this.bvGet(), 2000);
    }
}
var bv = new BVGet();
(function () {
    window.onload = function () {
        bv.run();
        PageInit();
        // console.log(GetUp());
    }
})();