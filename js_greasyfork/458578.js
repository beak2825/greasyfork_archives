// ==UserScript==
// @name         B直播快捷弹幕
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  b站直播间内使用悬浮列表快捷输入弹幕，保存一条弹幕历史，弹幕内容添加拼音发送
// @author       RecursiveMaple
// @match        https://live.bilibili.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://cdn.staticfile.org/jquery/3.6.3/jquery.min.js
// @require      https://cdn.staticfile.org/jquery-cookie/1.4.1/jquery.cookie.min.js
// @require      https://unpkg.com/pinyin-pro@3.12.0/dist/index.js
// @license      GNU General Public License v3.0 or later
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/458578/B%E7%9B%B4%E6%92%AD%E5%BF%AB%E6%8D%B7%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/458578/B%E7%9B%B4%E6%92%AD%E5%BF%AB%E6%8D%B7%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

var htmlText = `
<div class="blds-main-window">
    <li class="blds-shotcuts-list"></li>
    <hr>
    <li class="blds-util-list">
        <ul>
            <span>🕑</span>
            <input type="button" id="blds-input-history" value="">
        </ul>
        <ul>
            <span>➕</span>
            <input type="text" id="blds-input-add" maxlength="20" placeholder="添加快捷弹幕(限长20)">
            <button id="blds-btn-add">+</button>
        </ul>
        <ul>
            <span>py</span>
            <input type="text" id="blds-input-py" maxlength="20" placeholder="词语添加拼音(限长20)例:'雫露露1'">
            <button id="blds-btn-py">↵</button>
        </ul>
    </li>
</div>
`;
var cssText = `
.blds-main-window {
    all: initial;
    z-index: 100;
    display: none;
    position: absolute;
    bottom: 100%;
    right: 0%;
    width: 100%;
    border: 2px solid black;
    background-color: lightgray;
    font-size: 14px;
    counter-reset: shortcut-list;
}

.blds-main-window li {
    display: block;
    width: 100%;
    border: none;
    width: 100%;
}

.blds-main-window hr {
    border: none;
    border-top: 3px double black;
    margin: 1px;
}

.blds-main-window ul {
    display: flex;
    border-bottom: 1px solid black;
    padding: 2px;
}

.blds-main-window span {
    width: 23px;
    height: 23px;
    text-align: center;
    font-weight: bold;
    border-right: 1px dashed black;
}

.blds-shotcuts-list {
    max-height: 25em;
    overflow-y: scroll;
    overscroll-behavior: contain;
    scrollbar-width: thin;
}

.blds-shotcuts-list span::before {
    counter-increment: shortcut-list;
    content: counter(shortcut-list) ".";
}

.blds-main-window input {
    flex: auto;
    margin-left: 3px;
    text-align: left;
    font-size: 10px;
}

.blds-main-window button {
    margin: 0px 3px;
    width: 23px;
    height: 23px;
    padding: 0px;
}
`;


/*---------- 快捷弹幕数组相关操作 ----------*/
// templateVarIndex由css自动填写
// templateString不能动态更新，这里用函数填写模板
function getListItem(value) {
    return `
    <ul>
        <span></span>
        <input type="button" value=${value}>
        <button class="blds-btn-del">−</button>
    </ul>
    `;
}
var shortcutList = [];
function initList() {
    $(".blds-shotcuts-list").empty();
    for (var i in shortcutList) {
        // js的for in是以字符串形式的数字作索引!?你妈的为什么。。。
        $(".blds-shotcuts-list").append(getListItem(shortcutList[i]));
    }
}
function addListItem(value) {
    shortcutList.push(value);
    saveList();
    $(".blds-shotcuts-list").append(getListItem(value));
}
function delListItem($ul) {
    // 接受jquery对象，找到下标删除
    var index = $ul.index();
    shortcutList.splice(index, 1);
    saveList();
    $ul.remove();
}
function loadList() {
    shortcutList = GM_getValue("shortcutList", []);
}
function saveList() {
    GM_setValue("shortcutList", shortcutList);
}
/*---------- vvvvvvvvvv ----------*/

/*---------- 拼音转换相关操作 ----------*/
// 引入拼音转换模块
var { pinyin } = pinyinPro;
// 正则格式：中文词语后加数字串(可选)
var regex = /(^[\u4E00-\u9FA5]+)([0-9]*$)/;
function addPinyin(str) {
    // 读入中文词语，判字符串形式
    var resStr = "";
    if (!regex.test(str)) return resStr;
    var regObj = str.match(regex);
    var words = regObj[1];
    var numbers = regObj[2];
    var wordsList = words.split('');
    var numbersList = numbers.split('').map(Number);
    // var resList = pinyin(words, { type: 'array' });//这种形式会被吞弹幕
    var resList = pinyin(words, { toneType: 'num', type: 'array' });
    var mode = numbers == "" ? "FULL" : "PARTIAL";

    for (var i = 0; i < wordsList.length; i++) {
        resStr += wordsList[i];
        if (mode == "FULL" || numbersList.includes(i + 1)) {
            resStr += resList[i];
        }
    }
    return resStr;
}
function setPinyinHint(hintStr) {
    if (hintStr == "") {
        $("#blds-input-add").attr("placeholder", "添加快捷弹幕(限长20)");
    }
    else {
        $("#blds-input-add").attr("placeholder", hintStr);
    }
}
/*---------- vvvvvvvvvv ----------*/

/*---------- 脚本发送弹幕 ----------*/
var postUrl = "https://api.live.bilibili.com/msg/send";
var data = {
    fontsize: "25",
    csrf: "",
    csrf_token: "",
    roomid: "",
    mode: "1",//默认滚动，
    color: "16777215",//默认白色
    bubble: "0",// TODO 弹幕背景气泡，不知道怎么获取，0是无气泡，5是舰长气泡？
    //以上为初始化时一次性填入，以下为每次发送弹幕时填入
    rnd: "",
    msg: "",
}
var danmakuPositionMap = { "滚动": "1", "底部": "4", "顶部": "5" };
function rgbToDecimal(rgbText) {
    // 输入例："rgb(88, 193, 222)"
    // 输出例："5816798"
    var colorRegex = /([0-9]+)/g;
    var regObj = rgbText.match(colorRegex);
    var hexStr = regObj.map(function (decimalStr) {
        return parseInt(decimalStr).toString(16);
    }).join("");
    var decimalStr = parseInt(hexStr, 16).toString();
    return decimalStr;
}
function initDataBlock() {
    // 要保证在网页资源加载后执行！
    data.csrf = $.cookie('bili_jct');
    data.csrf_token = data.csrf;
    var roomUrl = $(location).attr('href');
    var roomIdRegex = /.com\/([0-9]+)/;
    data.roomid = roomUrl.match(roomIdRegex)[1];
    $("#control-panel-ctnr-box").one("DOMNodeInserted", function (event) {
        var t = event.target;
        if (!$(t).hasClass("danmakuPreference")) return;
        // console.log("进入DOMNodeInserted处理");//TODO DEBUG
        $(t).hide();
        // 等待加载动画播放完，目标元素动态插入
        var elemSearchCount = 0;
        var timer = setInterval(function () {
            elemSearchCount++;
            if ($(t).find(".dot-wrapper.active").length > 0) {
                clearInterval(timer);
                var modeStr = $(t).find(".danmaku-position-item.active").attr("title");
                data.mode = danmakuPositionMap[modeStr];
                var colorStr = $(t).find(".dot-wrapper.active span").css("background-color");
                data.color = rgbToDecimal(colorStr);
                console.log("Danmaku preference loaded. Mode=", data.mode, ",Color=", data.color);//INFO
                $(this).unbind("DOMNodeInserted");
                $("#control-panel-ctnr-box span[title='弹幕设置']").click();
            }
            else if (elemSearchCount >= 30) {
                clearInterval(timer);
                console.log("Loading danmaku preference element failed. [in function initDataBlock()]");//INFO
                $(this).unbind("DOMNodeInserted");
                $("#control-panel-ctnr-box span[title='弹幕设置']").click();
            }
        }, 100)
    });
    $("#control-panel-ctnr-box span[title='弹幕设置']").click();
}
function sendDanmaku(msg) {
    data.rnd = parseInt(Date.now() / 1000);
    data.msg = msg;
    // console.log(data);//DEBUG
    // 不用ajax发送表单，可能会被吞弹幕，改用formdata
    var formData = new FormData();
    formData.append("bubble", data.bubble);
    formData.append("msg", data.msg);
    formData.append("color", data.color);
    formData.append("mode", data.mode);
    formData.append("fontsize", data.fontsize);
    formData.append("rnd", data.rnd);
    formData.append("roomid", data.roomid);
    formData.append("csrf", data.csrf);
    formData.append("csrf_token", data.csrf_token);
    // $.post()不支持加cookie
    $.ajax({
        type: 'POST',
        url: postUrl,
        // data: data,
        data: formData,
        xhrFields: {
            withCredentials: true // 请求加入cookie
        },
        contentType: false,
        processData: false,
        success: function (data) {
            // console.log(data);//DEBUG
            if (data.msg == "") {
                // 发送成功，保存为历史
                $("#blds-input-history").val(msg);
            }
        },
    });
}
/*---------- vvvvvvvvvv ----------*/

/*---------- 注入窗口、初始化设置、添加按钮逻辑、添加鼠标悬浮事件等 ----------*/
var selWhereInsertHTMLBefore = "textarea.chat-input";
var selWhereGetWinWidth = ".chat-input-ctnr";
var selWhereDetectMouseHover = ".chat-input-ctnr div:last-child";
var selWhereSendDanmaku = "#control-panel-ctnr-box .bl-button";
function main() {
    // 弃用$(".chat-input-ctnr div:last-child").css({"position":"relative","display":"inline-block"});
    // 插入html
    $(selWhereInsertHTMLBefore).before(htmlText);
    if ($(".blds-main-window").length == 0) {
        console.log("Inserting HTML failed. [in function main()]");
        return;
    }
    // 插入css，调整窗口大小
    GM_addStyle(cssText);
    var blds_main_window_width = $(selWhereGetWinWidth).width();
    $(".blds-main-window").css("width", blds_main_window_width);
    // 初始化装入list项
    loadList();
    initList();
    // 抓取弹幕设置
    initDataBlock();

    //按钮：删除快捷弹幕
    $(".blds-shotcuts-list").on("click", "button", function (event) {
        //给未来元素自动绑定事件用on，先绑定到子元素数量变化的父元素
        var t = event.target;
        delListItem($(t).parent());
    });
    // 按钮：添加快捷弹幕
    $("#blds-btn-add").click(function () {
        var value = $("#blds-input-add").val();
        if (value.trim() != "") addListItem(value);
        $("#blds-input-add").val("");// 清空input
    });
    // 按钮：转拼音
    $("#blds-btn-py").click(function () {
        var value = $("#blds-input-py").val();
        var rev = addPinyin(value);
        if (rev != "") {
            sendDanmaku(rev);
            $("#blds-input-py").val("");// 清空input
            setPinyinHint("");// 清空预览
        }
    });
    // 检测输入内容改变，显示拼音预览
    $("#blds-input-py").on("input", function (event) {
        var value = $("#blds-input-py").val();
        var rev = addPinyin(value);
        setPinyinHint(rev);
    });
    // 发送弹幕按钮，要求未来元素自动绑定
    $(".blds-main-window").on("click", "input[type='button']", function (event) {
        var t = event.target;
        var msg = $(t).val();
        sendDanmaku(msg);
    });
    // 检测输入框按下回车键
    $(".blds-main-window input[type='text']").keypress(function (event) {
        if (event.which == '13') {
            // console.log("按下回车");//DEBUG
            // next元素是按钮
            $(this).next().click();
        }
    });

    // 监听B站发送弹幕按钮，将内容转存到历史记录
    // 由于只能在原click事件之后绑定，value会被原事件处理函数清空
    // 也要考虑用回车发弹幕的情况，决定用input事件监视输入框
    // B站发送弹幕后清空输入框不会触发input
    var tempValue = "";
    $(selWhereInsertHTMLBefore).on("input", function (event) {
        tempValue = event.target.value;
    });
    $(selWhereSendDanmaku).click(function () {
        if (tempValue.trim() != "") {
            $("#blds-input-history").val(tempValue);
            // console.log("内容转存到历史记录:",tempValue);//TODO DEBUG
        }
        tempValue = "";
    });
    // B站弹幕输入框响应不了keypress,focus等事件，你妈的为什么
    $(selWhereInsertHTMLBefore).keydown(function (event) {
        if (event.which == '13') {
            // console.log("按下回车");//DEBUG
            if (tempValue.trim() != "") {
                $("#blds-input-history").val(tempValue);
                // console.log("内容转存到历史记录:",tempValue);//TODO DEBUG
            }
            tempValue = "";
        }
    });

    // 控制显示和隐藏窗口
    $(selWhereDetectMouseHover).hover(
        function () {
            // 每次进入后重置输入框
            if ($(".blds-main-window input[type='text']:focus").length == 0) {
                $(".blds-main-window input[type='text']").val("");
            }
            $(".blds-main-window").css("display", "block");
        },
        function () {
            // timer处理hover被输入法界面遮挡的情况
            var timer = setInterval(function () {
                if ($(selWhereDetectMouseHover + ":hover").length > 0) {
                    clearInterval(timer);
                }
                else if ($(".blds-main-window input[type='text']:focus").length == 0) {
                    $(".blds-main-window").css("display", "none");
                    clearInterval(timer);
                }
            }, 100)
        }
    );
}
/*---------- vvvvvvvvvv ----------*/

(function () {
    'use strict';
    // Your code here...
    //最外层$("#chat-control-panel-vm .chat-input-ctnr")
    //上层$(".chat-input-ctnr div:last-child")
    //本层$("textarea.chat-input")

    var maxRetry = 20;
    var elemSearchCount = 0;
    var timer = setInterval(function () {
        elemSearchCount++;
        if ($(selWhereInsertHTMLBefore).length > 0) {
            console.log("Ready after", elemSearchCount, "tries");
            clearInterval(timer);
            main();
        }
        else if (elemSearchCount >= maxRetry) {
            console.log("Searching failed after", elemSearchCount, "tries");
            clearInterval(timer);
        }
    }, 500)
})();