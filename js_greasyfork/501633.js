// ==UserScript==
// @name         米游社关键词屏蔽
// @namespace    http://hplzh.cn/
// @version      24.07.0004
// @description  屏蔽包含特定关键词的米游社文章/评论
// @author       hplzh
// @match        *://*.miyoushe.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501633/%E7%B1%B3%E6%B8%B8%E7%A4%BE%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/501633/%E7%B1%B3%E6%B8%B8%E7%A4%BE%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

'use strict';

var kwarr = [];
var kwarr0 = ["🤓", "👆", "高洁", "😋", "3°", "三度", "🤣", "😃", "☔", "🐶", "🌂", "☂️", "😡😡", "🤘😫🤘", "证书", "成品号"];

var settingDiv = document.createElement("div");
settingDiv.setAttribute("class", "mhy-account-center-content-container");
settingDiv.innerHTML = `
    <div class="mhy-account-center__subheader">屏蔽关键词设置</div>
    <div class="mhy-privacy__content">
        <div class="mhy-input">
            <div class="mhy-input__container"><textarea id="cn-hplzh-kwfilter-text" placeholder="每行一个屏蔽关键词"></textarea>
            </div>
        </div>
        <div style="
        margin-top: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    ">
            <div class="mhy-button mhy-button-outlined" style="
        height: 35px;
        width: 90px;
        margin-inline: 20px;
    "><button class="mhy-button__button" id="cn-hplzh-kwfilter-save">保存</button></div>
            <div class="mhy-button mhy-button-normal" style="
        height: 35px;
        width: 90px;
        margin-inline: 20px;
    "><button class="mhy-button__button" id="cn-hplzh-kwfilter-reset">加载默认值</button></div>
        </div>
    </div>
`

function loadKws() {
    var v = localStorage["cn-hplzh-mys-kwfilter-kwarr"];
    if (v == undefined) {
        kwarr = kwarr0;
        return;
    }
    var varr = String(v).replace("\r\n", "\n").split("\n");
    kwarr = varr.filter((str) => str.length > 0);
}

function saveKws() {
    var text = document.getElementById("cn-hplzh-kwfilter-text");
    localStorage["cn-hplzh-mys-kwfilter-kwarr"] = text.value;
    loadKws();
    loadKwT();
}

function resetKws() {
    if(confirm("确定重置屏蔽关键词列表？")){
        localStorage.removeItem("cn-hplzh-mys-kwfilter-kwarr");
        loadKws();
        loadKwT();
    }   
}

function insertSetting() {
    try {
        var chkItem = document.getElementById("cn-hplzh-mys-kwfilter-settinglink");
        if (chkItem) {
            return;
        }
        var moreList = document.getElementsByClassName("header__navitem--show")[0];
        var lastItem = moreList.lastChild;
        var newItem = document.createElement("li");
        newItem.innerHTML = '<a id="cn-hplzh-mys-kwfilter-settinglink" href="/dby/accountCenter/privacy" class="mhy-router-link header__navmore">屏蔽设置</a>';
        lastItem.appendChild(newItem);
    } catch (error) {
        // console.log(error);
        setTimeout(insertSetting, 200);
        return;
    }
}

function insertSetting2() {
    if (location.pathname == "/dby/accountCenter/privacy") {
        try {
            var target1 = document.getElementsByClassName("mhy-container mhy-account-center-content")[0];
            target1.appendChild(settingDiv);
            insertSetting2_1();
        } catch (error) {
            // console.log(error);
            setTimeout(insertSetting2, 200);
            return;
        }
        loadKwT();
    }
}

function insertSetting2_1() {
    if (location.pathname == "/dby/accountCenter/privacy") {
        try {
            var text = document.getElementById("cn-hplzh-kwfilter-text");
            var save = document.getElementById("cn-hplzh-kwfilter-save");
            var reset = document.getElementById("cn-hplzh-kwfilter-reset");
            save.onclick = saveKws;
            reset.onclick = resetKws;
            text.addEventListener('input', function () {
                this.style.height = 'auto';
                this.style.height = this.scrollHeight + 'px';
            });
        } catch (error) {
            // console.log(error);
            setTimeout(insertSetting2_1, 200);
        }
    }
}

function loadKwT() {
    var text = document.getElementById("cn-hplzh-kwfilter-text");
    text.value = kwarr.join("\r\n");
    resizeKwT();
}

function resizeKwT() {
    var text = document.getElementById("cn-hplzh-kwfilter-text");
    text.style.height = 'auto';
    text.style.height = text.scrollHeight + 'px';
}

function checkContent(content) {
    var inner = content.innerHTML;
    for (var i = 0; i < kwarr.length; i++) {
        if (inner.includes(kwarr[i])) {
            return true;
        }
    }
    return false;
}

function getArticleCards() {
    return document.getElementsByClassName("mhy-article-card__link");
}

function getReplies() {
    return document.getElementsByClassName("reply-card__content");
}

function getInnerReplies() {
    return document.getElementsByClassName("reply-card-inner-reply__content");
}

function getNotificationsText(){
    return document.getElementsByClassName("notifications-common-card__content--text");
}

function replaceContent(content) {
    content.innerHTML = "<p>内容已被屏蔽</p>";
}

function checkAndReplace(content) {
    if (checkContent(content)) {
        replaceContent(content);
    }
}

function forEachIn(arr, func) {
    for (var i = 0; i < arr.length; i++) {
        func(arr[i]);
    }
}

function main() {
    forEachIn(getArticleCards(), checkAndReplace);
    forEachIn(getReplies(), checkAndReplace);
    forEachIn(getInnerReplies(), checkAndReplace);
    forEachIn(getNotificationsText(), checkAndReplace);
}


insertSetting();
loadKws();
insertSetting2();
setInterval(main, 1000);
setInterval(insertSetting, 2000);