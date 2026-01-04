"use strict";
// ==UserScript==
// @name         Kugou Live Show Assistant
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Assistant for Kugou Live Show
// @author       Sean Yu
// @match        https://fanxing.kugou.com/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/407068/Kugou%20Live%20Show%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/407068/Kugou%20Live%20Show%20Assistant.meta.js
// ==/UserScript==
(function () {
    'use strict';
    // debugger;
    if (!/^[1-9]+[0-9]*]*$/.test(location.pathname.substring(1)))
        return;
    // if ($("#fxLogin").length > 0 && $("#fxLogin").is(":visible")) return;
    let btSendMessage = document.getElementById("sendMessageButton");
    if (!btSendMessage)
        return;
    var KLSASettingName = { roomid: "房间号", starid: "主播ID", starkugouid: "主播酷狗ID", starname: "主播名字", livetime: "直播时间", gift: "礼物", iconlength: "图标显示数量" };
    var KLSASettingValue = { starname: "", livetime: "每天晚上9点到凌晨2点，如有时间下午加播一场2点半到6点[/抱拳]", gift: "求礼物", iconlength: 4 };
    var KLSAIconButton = ["84|抱拳", "86|拳头", "69|蛋糕", "43|鼓掌"];
    var KLSAPredefineMessage = [
        "欢迎|欢迎来到{starname}直播间，新人请点关注[/抱拳] 房间号：{roomid}",
        "卡管|本场五万币卡管、送一首歌，十万币或开守护可加微信[/抱拳]",
        "点赞.|感谢大家点赞[/抱拳]",
        "时间|直播时间：{livetime}",
        "下播|谢谢大家的礼物 谢谢大家的陪伴[/抱拳] 各位下次直播再见[/再见]"
    ];
    var KLSACustomMessage = [
        "抖音|点赞、评论、关注璐璐抖音：cherry66666，快手：73438457[/抱拳]"
    ];
    function getRndInteger(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    function formatCeilInteger(value) {
        return value == null ? null : value <= 0 ? 0 : value < 1000 ? value : value <= 9000 ? Math.ceil(value / 1000) + "千" : Math.ceil(value / 10000) + "万";
    }
    function createImgButton(imgSrc, size = 0) {
        let btn = document.createElement("img");
        if (imgSrc.startsWith("http")) {
            btn.src = imgSrc;
            if (size != 0)
                btn.width = size;
            btn.style.margin = "0 2px -4px";
        }
        else {
            btn.src = "https://s4fx.kgimg.com/fxstatic/images/emotion/" + imgSrc + ".gif?8.0.0";
            btn.width = size || 16;
            //btn.style.margin = "0 0 -5px 0";
        }
        return btn;
    }
    function createTextButton(text, backColor = "White", color = "Black", id = "") {
        let btn = document.createElement("input");
        if (Boolean(id))
            btn.id = "KLSA" + id;
        btn.type = "button";
        btn.value = text || "　　";
        btn.style.color = color;
        btn.style.backgroundColor = backColor;
        btn.style.padding = "0 2px 0 1px";
        btn.style.marginRight = "1px";
        btn.style.border = "0";
        return btn;
    }
    function createSelectButton(title, param, privateMode = false, talkObject = 0) {
        let btn = title.startsWith("http") ? createImgButton(title, param) : createTextButton(title, "White");
        btn.onclick = function () {
            $("#chatWithSelectList li:" + (talkObject <= 0 ? "first" : "eq(" + talkObject + ")")).click();
            if (talkObject <= 0 ? false : privateMode)
                $("#privateCheck").addClass("checked");
            $("#inputChatMessage").focus();
        };
        return btn;
    }
    function createSettingsButton() {
        let btn = createImgButton("https://s4fx.kgimg.com/pub2/room/images//room/2019/btn-chat-setup_3771fe1.png");
        btn.onclick = function () {
            if ($("#inputChatMessage").val()) {
                let chatText = $("#inputChatMessage").val();
                if (chatText.endsWith("?") && chatText.length > 1)
                    return showMessage("参数值为'" + getSetting(chatText.substr(0, chatText.length - 1)) + "'", "clear");
                if (chatText.indexOf("=") > 0) {
                    let [settingName, settingParam] = chatText.split("=");
                    return setSetting(settingName.toLowerCase(), settingParam);
                }
            }
            return refreshTaskButton();
        };
        return btn;
    }
    function createIconButton(imgSrc, privateMode = false, appendMode = false, content = null, length = null, sendOut = true) {
        content = content || " ";
        let btn = createImgButton(imgSrc);
        btn.onclick = function () {
            let message = (new Array(eval(length || getSetting("iconlength")) + 1)).join("[/" + content + "]");
            showMessage(appendMode ? $("#inputChatMessage").val() + message : message, sendOut ? "send" : "stay", privateMode);
            return false;
        };
        return btn;
    }
    function createMessageButton(text, backColor = "White", privateMode = false, appendMode = false, content = null, sendOut = true) {
        let btn = createTextButton(text, Boolean(content) ? backColor : "LightGrey");
        if (Boolean(content)) {
            btn.onclick = function () {
                // if (($("#inputChatMessage").val() as string).startsWith("=")) { // 设置按钮信息内容
                //     return false;
                // }
                let message = content.replace(/{roomid}/ig, getSetting("roomid")).replace(/{starname}/ig, getSetting("starname")).replace(/{livetime}/ig, getSetting("livetime")).replace(/{gift}/ig, getSetting("gift"));
                showMessage(appendMode ? $("#inputChatMessage").val() + message : message, sendOut ? "send" : "stay", privateMode);
                return false;
            };
        }
        return btn;
    }
    function refreshTaskButton() {
        $(".currentTaskInfo .title .num").text() == "6" ? $("#KLSAstartask").hide() : $("#KLSAstartask").show(), $("#KLSAstartask").val($(".currentTaskInfo .title .num").text() + "星");
        return false;
    }
    function createStarTaskButton() {
        let btn = createTextButton("星光", "LightGrey", "Black", "startask");
        btn.onclick = function () {
            let currentTaskNo = $(".currentTaskInfo .title .num").text();
            let message;
            if ($(".currentTaskInfo .title").text().substr(4, 2) == "完成") {
                message = "已完成" + currentTaskNo + "星任务[/抱拳]";
            }
            else {
                message = "求完成" + currentTaskNo + "星任务[/抱拳]";
                let taskcoin = $(".currentTaskInfo div.introduce div:eq(0) span.taskProcess").html().split("/");
                if (currentTaskNo == 6) {
                    message += " 缺" + (taskcoin[1] - taskcoin[0]) + "个六星礼物";
                }
                else {
                    let remain = "";
                    if (taskcoin[0] != "已完成")
                        remain = " 需" + formatCeilInteger(taskcoin[1] - taskcoin[0]) + "币";
                    let taskperson = $(".currentTaskInfo div.introduce div:eq(1) span.taskProcess").html().split("/");
                    if (taskperson[0] != "已完成") {
                        remain = Boolean(remain) ? remain + "，" : " 只需";
                        remain += (taskperson[1].substr(0, taskperson[1].length - 1) - taskperson[0]) + "个人头";
                    }
                    message += remain;
                }
            }
            showMessage(message, "send");
            return false;
        };
        return btn;
    }
    function getGiftString(value, shorten = true) {
        if (!value || value.length == 0)
            return "";
        if (shorten)
            return value.join("、").replace("真爱钻戒", "钻戒").replace("酷炫街舞", "街舞").replace("私人飞机", "飞机").replace("梦幻城堡", "城堡").replace("爱的火箭", "火箭").replace("浪漫花车", "花车").replace("爱的旅行", "爱旅");
        return value.join("、");
    }
    function createStar6TaskButton() {
        let btn = createTextButton("6星", "LightGrey", "Black", "star6task");
        btn.onclick = function () {
            $.getJSON("https://fx.service.kugou.com/biz/startask/api/gift_wall/list?anchorId=" + getCurrentStarKugouId() + "&_=" + getRndInteger(10000, 100000000000), function (result) {
                if (!result)
                    return;
                if (result.data.lightedCount == result.data.count) {
                    showMessage("已完成6星任务", "send");
                    return;
                }
                let gift = new Array();
                result.data.list.forEach((element) => { if (element.isLighted == 0)
                    gift.push(element.giftName); });
                gift.reverse();
                let giftcount = result.data.count - result.data.lightedCount;
                if (giftcount <= 5) {
                    showMessage("求6星礼物，只剩" + giftcount + "个：" + getGiftString(gift) + "[/抱拳]", "send");
                }
                else if (giftcount <= 10) {
                    showMessage("求6星礼物，还缺" + giftcount + "个[/抱拳]", "send");
                    showMessage("求六星礼物：" + getGiftString(gift), 3000);
                }
                else {
                    let count0 = Math.ceil(giftcount / 2);
                    showMessage("求6星礼物，还缺" + giftcount + "个[/抱拳]", "send");
                    showMessage("求六星礼物：" + getGiftString(gift.splice(0, count0)), 3000);
                    showMessage("求六星礼物：" + getGiftString(gift), 6000);
                }
            });
            return false;
        };
        return btn;
    }
    function showMessage(message, mode, privateMode = false) {
        if (message == null || message == "")
            return false;
        if (mode == "clear") { // 不发送，5秒后清除
            $("#inputChatMessage").val(message);
            setTimeout('$("#inputChatMessage").val("");', 5000);
        }
        else if (mode == "send") { // 立刻发送
            if (!privateMode)
                $("#chatWithSelectList li:first").click();
            $("#inputChatMessage").val(message);
            // $("#sendMessageButton").hasClass("gray") ? setTimeout('$("#sendMessageButton").click();', 3000) : $("#sendMessageButton").click();
            setTimeout('$("#sendMessageButton").click();', $("#sendMessageButton").hasClass("gray") ? 3000 : 0);
        }
        else if (typeof mode == "number") {
            if (!privateMode)
                $("#chatWithSelectList li:first").click();
            setTimeout('$("#inputChatMessage").val("' + message + '");$("#sendMessageButton").click();', mode);
        }
        else {
            $("#inputChatMessage").val(message);
        }
        $("#inputChatMessage").focus();
        return true;
    }
    function getCurrentRoomId() { return parseInt(location.pathname.substring(1)); }
    ;
    function getCurrentStarId() { return $("#giftReceiverList li:first").attr("_id"); }
    function getCurrentStarKugouId() { return $("#giftReceiverList li:first").attr("_userkugouid"); }
    function getCurrentStarName() { return $('meta[itemprop="name"]').prop("content").split(" ")[0]; } //$("a.starName").text()在页面全部载入后才有
    function getKugouStarInfo(starid) {
        $.getJSON("https://fx.service.kugou.com/VServices/RoomService.RoomService.getStarInfo/" + getCurrentStarId(), function (result) {
            return Boolean(result) ? result.data : null;
        });
        return null;
    }
    function getSetting(param) {
        if (!param)
            return undefined;
        switch (param.toLowerCase()) {
            case "roomid":
                return getCurrentRoomId();
            case "starid":
                return getCurrentStarId();
            case "starkugouid":
                return getCurrentStarKugouId();
            case "starname":
                // return localStorage.getItem(getCurrentRoomId()+"-"+"starname") || KLSASettingValue["starname"] || getCurrentStarName();
                return GM_getValue(getCurrentRoomId() + "-" + "starname") || KLSASettingValue["starname"] || getCurrentStarName();
            case "livetime":
                // return localStorage.getItem(getCurrentRoomId()+"-"+"livetime") || KLSASettingValue["livetime"] || getKugouStarInfo(getCurrentStarId() as number) as {[index:string]:any}["liveTimes"];
                return GM_getValue(getCurrentRoomId() + "-" + "livetime") || KLSASettingValue["livetime"] || getKugouStarInfo(getCurrentStarId());
            default:
                // return localStorage.getItem(getCurrentRoomId()+"-"+param.toLowerCase()) || KLSASettingValue[param.toLowerCase()];
                return GM_getValue(getCurrentRoomId() + "-" + param.toLowerCase()) || KLSASettingValue[param.toLowerCase()];
        }
    }
    function setSetting(param, value = null, showResult = true) {
        param = param.toLowerCase();
        if (!param || !KLSASettingName.hasOwnProperty(param) || ["roomid", "starid", "starkugouid"].indexOf(param) >= 0)
            return false;
        // value == null || value == "" ? localStorage.removeItem(getCurrentRoomId()+"-"+param) : localStorage.setItem(getCurrentRoomId()+"-"+param, value as string);
        value == null || value == "" ? GM_deleteValue(getCurrentRoomId() + "-" + param) : GM_setValue(getCurrentRoomId() + "-" + param, value);
        if (showResult)
            showMessage(value == null || value == "" ? "已清除参数'" + KLSASettingName[param] + "'" : "已设置参数'" + KLSASettingName[param] + "'为：" + value, "clear");
        return true;
    }
    let parent = btSendMessage.parentNode;
    if (parent && $("#inputChatMessage")) {
        KLSAIconButton.forEach(message => {
            let [iconImg, iconText, iconLength] = message.split("|");
            $(".sendMessage .fr").prepend(createIconButton(iconImg, true, true, iconText, iconLength, true));
            //$(".emotion_icon").after(createIconButton(iconImg, true, true, iconText, iconLength, true));
        });
        parent.appendChild(createSelectButton("https://s4fx.kgimg.com/pub2/cterm/img/fans-management_8fb1f1.png", 14, false, 0));
        KLSAPredefineMessage.forEach(message => {
            let [text, content] = message.split("|");
            parent === null || parent === void 0 ? void 0 : parent.appendChild(createMessageButton(text, "Khaki", false, false, content, !text.endsWith(".")));
        });
        KLSACustomMessage.forEach(message => {
            let [text, content] = message.split("|");
            parent === null || parent === void 0 ? void 0 : parent.appendChild(createMessageButton(text, "SandyBrown", false, false, content, !text.endsWith(".")));
        });
        parent.appendChild(createMessageButton("礼物", "Khaki", false, false, "{gift}", true));
        parent.appendChild(createStarTaskButton());
        parent.appendChild(createStar6TaskButton());
        //parent.appendChild(document.createTextNode(" "));
        parent.appendChild(createSelectButton("https://s4fx.kgimg.com/pub2/cterm/img/grade_icon_a78c61.png", 14, true, 1));
        parent.appendChild(createSettingsButton());
        setTimeout(refreshTaskButton, 30000);
        $(".currentTaskInfo .title .num").bind("DOMCharacterDataModified", function (e) { $(e.target).text() == "6" ? $("#KLSAstartask").hide() : $("#KLSAstartask").show(), $("#KLSAstartask").val($(e.target).text() + "星"); });
        $("#inputChatMessage").keydown(function (e) {
            let text = $("#inputChatMessage").val();
            switch (e.which) {
                case 13: //Enter
                    if (!text) {
                        $("#inputChatMessage").val((new Array(eval(getSetting("iconlength")) + 1)).join("[/抱拳]"));
                    }
                    else if (text.startsWith("恭喜")) {
                        $("#inputChatMessage").val($("#inputChatMessage").val() + (text.includes("升") ? (new Array(eval(getSetting("iconlength")) + 1)).join("[/蛋糕]") : "[/抱拳]"));
                    }
                    else if (text.startsWith("感谢") || text.startsWith("求")) {
                        $("#inputChatMessage").val($("#inputChatMessage").val() + "[/抱拳]");
                    }
                    else if (text.startsWith("欢迎")) {
                        $("#inputChatMessage").val($("#inputChatMessage").val() + "[/抱抱]");
                    }
                    break;
                case 9: //Tab
                    $("#inputChatMessage").val(Boolean(text) ? $("#inputChatMessage").val() + "[/抱拳]" : (new Array(eval(getSetting("iconlength")) + 1)).join("[/抱拳]"));
                    return false;
                default:
                    break;
            }
        });
    }
})();
