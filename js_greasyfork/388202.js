// ==UserScript==
// @name         掛圖廚
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  將自身化為所附之圖中角色，使用其語氣、台詞以及口吻，有時藉角色名義來耍廚。
// @author       雪花喵喵
// @match        https://wootalk.today/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388202/%E6%8E%9B%E5%9C%96%E5%BB%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/388202/%E6%8E%9B%E5%9C%96%E5%BB%9A.meta.js
// ==/UserScript==

var scriptElem = document.createElement('script');
window.sendCheck = function(){
    var e = $("#messageInput").val().substring(0, 500);
    if(e.match("https://i.imgur.com/")!==null){
        sendImage(count, e, 1, 1, 0);
        count += 1;}
    else{sendMessage();}};
document.body.appendChild(scriptElem);

var count = 1993;

var inner = '<div><div>';
inner += '<div id="changeButton"><input value="離開" onclick="changePerson()" type="button"></div>';
inner += '<div id="changeButton" onclick="changePerson();"><i class="material-icons">&#xE14C;</i></div>';
inner += '<div id="moreButton" onclick="insertToolbar();"><i class="material-icons">&#xE03B;</i></div>';
inner += '<div id="textBox"><input type="text" id="messageInput" placeholder="輸入訊息" autocomplete="off"></div>';
inner += '<div id="sendButton">';
inner += '<input type="button" value="傳送！" onclick="sendCheck(); return false;"></div></div></div>';

document.getElementById("toolbar").style.display = "inline";
document.getElementById("sendBox").innerHTML = inner;