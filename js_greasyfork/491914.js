// ==UserScript==
// @name         DrrrkariHelperTools
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  汚いコードで作られたヘルパーツール
// @author       Zel9278 (https://c30.life)
// @match        *://drrrkari.com/room*
// @icon         https://www.google.com/s2/favicons?domain=drrrkari.com
// @grant        none
// @require      https://unpkg.com/axios/dist/axios.min.js
// @downloadURL https://update.greasyfork.org/scripts/491914/DrrrkariHelperTools.user.js
// @updateURL https://update.greasyfork.org/scripts/491914/DrrrkariHelperTools.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var playingTime = 0;

    var $ = window.$;
    var { post } = axios;

    var parsed={};
    var menu = document.querySelector(".menu");
    var messageBoxInner = document.querySelector(".message_box_inner");
    var drrrHelperTools = document.createElement("li");
    var childTools = document.createElement("u");
    var childToolsHTML = document.createElement("span");

    var input = document.querySelector("#message .inputarea textarea");
    var submit = document.querySelector("#message .submit input");

    childTools.innerText = "Helper";

    drrrHelperTools.setAttribute("class", "drrrHelperTools");
    childTools.setAttribute("class", "helperTools");
    childToolsHTML.style.display = "none";

    childTools.onclick = (e) => {
        childToolsHTML.style.display === "none"?
        childToolsHTML.style.display = "block":
        childToolsHTML.style.display = "none";
    };

    document.cookie.split('; ').forEach(a=>{
        const cookie=a.split("=");
        parsed[cookie[0]]=cookie[1];
    });

    console.log(`Your cookie is ${parsed["durarara-like-chat1"]}`);
    childToolsHTML.style.margin = "0";
    childToolsHTML.style.padding = "0";
    childToolsHTML.innerHTML = `\
      <span>durarara-like-chat1: </span><span class="dlc">${parsed["durarara-like-chat1"]}</span><br/>\
      <span>playing: </span><span class="playing">idk</span><br/>\
      <input type="checkbox" class="roomkeeper" name="roomkeeper"><label for="roomkeeper">RoomKeeper</label>\
    `;


    messageBoxInner.appendChild(childToolsHTML);
    drrrHelperTools.appendChild(childTools);
    menu.insertBefore(drrrHelperTools, menu.firstChild)

    var dlc = document.querySelector(".dlc");
    dlc.onclick = e => {
        copyFn(e.target.innerText);
        var copied = document.createElement("span");
        copied.innerText = "[Copied!]";
        copied.setAttribute("class", "copied");
        if (document.querySelector(".copied") == null) {
            e.target.appendChild(copied)
            setTimeout(() => childToolsHTML.removeChild(copied), 2000);
        }
    }

    var playing = document.querySelector(".playing");
    playing.onclick = e => {
        sendChat(e.target.innerText);
        var sended = document.createElement("span");
        sended.innerText = "[Sended!]";
        sended.setAttribute("class", "sended");
        if (document.querySelector(".sended") == null) {
            e.target.appendChild(sended)
            setTimeout(() => childToolsHTML.removeChild(sended), 2000);
        }
    }

    setInterval(()=>{
        document.querySelector(".playing").innerText = timestampToDate((playingTime++) * 1024);
    }, 1000);

    var roomKeeper = document.querySelector(".roomkeeper");
    var latestStr = "";
    setInterval(()=>{
        if (!roomKeeper.checked) return;
        var strs = [",", ".", "あ", "、"].filter(a => a != latestStr);
        var rndStr = strs[Math.floor(Math.random() * strs.length)];
        latestStr = rndStr;
        sendChat(rndStr);
    }, 300000);

    function copyFn(text) {
        var ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        ta.parentElement.removeChild(ta);
    }

    function timestampToDate(unixTimestamp) {
        let totalSeconds = unixTimestamp / 1000;
        let days = Math.floor(totalSeconds / 86400);
        totalSeconds %= 86400;
        let hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let minutes = Math.floor(totalSeconds / 60);
        totalSeconds %= 60;
        let seconds = Math.floor(totalSeconds);
        return `${days}日${hours}時間${minutes}分${seconds}秒`;
    }

    function sendChat(text) {
        if (!text) return;
        input.value = text;
        submit.click();
        console.log("send: ", text);
    }
})();

