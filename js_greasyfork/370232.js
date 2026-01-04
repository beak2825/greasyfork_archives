// ==UserScript==
// @name         Bilibili Auto Blacklist
// @name:zh      Bilibili自动黑名单
// @name:zh-CN   Bilibili自动黑名单
// @namespace    taoqqqqqqiiiiii
// @version      1.4.1
// @description  Try to block any user that sending the same danmaku many times
// @description:zh      自动拉黑刷弹幕的用户，广告触发关键词直接720
// @description:zh-CN   自动拉黑刷弹幕的用户，广告触发关键词直接720
// @author       taoqqqqqqiiiiii
// @icon         data:image/gif;base64,R0lGODlhWgBaALMOAHR0dAICAnd3dwEBAXh4eAMDAwkJCQ0NDQsLCxwcHA4ODggICHl5eQAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTMyIDc5LjE1OTI4NCwgMjAxNi8wNC8xOS0xMzoxMzo0MCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpiYWE1ODg5ZS1jN2RmLTRmZmUtYjkzOS0wMmVkMTZhNmNjZDIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6M0I2ODI2NjA1NzhGMTFFNkEyMEVDNzhEOUY1RkQxRjgiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6M0I2ODI2NUY1NzhGMTFFNkEyMEVDNzhEOUY1RkQxRjgiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUuNSAoTWFjaW50b3NoKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjljYjgzNjY2LWYxYWUtNGMyZi1hMGEwLThhODJmYjIxM2U0MyIgc3RSZWY6ZG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmU1NDE3YzFmLTllODAtMTE3OS04NjdiLWUy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
// @match        *://live.bilibili.com/*
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370232/Bilibili%20Auto%20Blacklist.user.js
// @updateURL https://update.greasyfork.org/scripts/370232/Bilibili%20Auto%20Blacklist.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var activateRooms = [155,39936]; //这是启动的房间号，如果是*的话表示所有的房间，但不建议这么设置
    var savedNumber = 15; //这是保存弹幕的数量，这决定新弹幕会跟之前的多少条弹幕对比，默认15
    var percentage = 0.82; //这是弹幕的相似度，可以修改以改变自动黑名单的严格程度，默认82%
    var blacklistCount = 4; //如果满足以上相似度的弹幕大于这个数字，自动加入黑名单，默认4
    var hours = 2; //这是禁言的小时数，默认2
    var keyHours = 720; // 这是触发关键词禁言的小时数，默认720
    var whiteList = ['谢谢', '感谢','666','233']; //这是白名单，包含以下关键字的都不会被禁言
    var labels = ['奈不怂']; //当用户佩戴列表中的勋章时不会被禁言
    var reg = /([ЬＢb][ÀAα＠aㅇ][iīl1]|[百白咟佰皕]|[渡镀]|[趪簧磺黄潢]|[嶶葳威伟荱尾唯微]|相|操|[直播]+[摸抠]|╱)+.*(Cha|查|私处|[搜嗖]|[博薄]|[ｄＤВd]|([d]+[ǔu])|度(?=>|＜|\{|\[|【)|＜|[渡剫]|[娘俍]|扸|站|群|波|铯|冊|校花|啪)+/i; //这是拉黑名单的关键字，用正则表达式表示
    var lowLvl = 0;

    var charList = document.getElementById('chat-history-list');
    var $ = window.jQuery;

    var arrayI = 0;
    var danmakuArray = [];
    var roomId = null;
    var similarDanmaku = [];

    var path = window.location.pathname;
    var xml = new XMLHttpRequest();
    xml.onreadystatechange = function(){
        if (xml.readyState == 4 && xml.status == 200) {
            var obj = JSON.parse(xml.responseText);
            if (obj.code !== 0 || obj.message != "ok" || obj.msg != "ok"){
                console.log("Something wrong: " + obj);
            }
            else{
                roomId = obj.data.room_id;
                if (activateRooms[0] === '*' || activateRooms.includes(roomId) || activateRooms.includes(path.substr(1))){
                    console.log("自动黑名单启动");
                    if (charList.addEventListener){
                        charList.addEventListener('DOMNodeInserted', function (ev) {
                            // console.log(ev.target, ev.target.nodeValue, ev.timeStamp);
                            var danmakuObj = $('#chat-history-list').children().last();
                            var userName = danmakuObj.attr('data-uname');
                            var uid = danmakuObj.attr('data-uid');
                            var danmaku = danmakuObj.attr('data-danmaku');
                            var inner = $.trim(danmakuObj.text());
                            var lvlReg = /UL ([0-9]+)/g;
                            var level = lvlReg.exec(inner);
                            if (userName && danmaku){
                                var newObj;
                                if(level !== null && level.length > 1){
                                    newObj = {user:userName,userId:uid,userLvl:level[1],danmaku:danmaku,innerText:inner};
                                }
                                else{
                                    newObj = {user:userName,userId:uid,userLvl:level,danmaku:danmaku,innerText:inner};
                                }
                                danmakuArray[arrayI] = newObj;
                                if (arrayI >= (savedNumber - 1)){
                                    arrayI = -1;
                                }
                                arrayI++;
                                check(newObj);
                            }
                        }, false);
                    }
                }
            }
        }
    };
    xml.open("GET", "https://api.live.bilibili.com/room/v1/Room/room_init?id=" + path.substr(1), true);
    xml.send(null);


    function check(newObj){
        for (var l = 0; l < labels.length; l++){
            if(newObj.innerText.startsWith(labels[l]) === true){
                //console.log("%s 触发勋章白名单：%s",newObj.innerText,labels[l]);
                return true;
            }
        }
        for (var w = 0; w < whiteList; w++){
            if(newObj.danmaku.indexOf(whiteList[w]) !== -1){
                //console.log("%s 触发关键词白名单：%s",newObj.danmaku,whiteList[w]);
                return true;
            }
        }
        /*
        var res = newObj.danmaku.match(reg);
        if (res !== null){
            console.log('%c%s：\"%s\"%c触发关键词禁言条件：%c%s',"color:blue", newObj.user, newObj.danmaku, "color:black", "color:blue", res.toString());
            blacklistUser(newObj.userId, keyHours);
            return true;
        }
        */

        if (newObj.userLvl !== null && newObj.userLvl <= lowLvl && similarDanmaku.length > 0){
            for (var s = 0; s < similarDanmaku.length; s++) {
                if (similarity(similarDanmaku[s], newObj.danmaku) > percentage){
                    console.log('%s级用户%c%s：\"%s\"%c触发类似弹幕禁言：%c%s',newObj.userLvl,"color:blue", newObj.user, newObj.danmaku, "color:black", "color:blue", similarDanmaku.toString());
                    blacklistUser(newObj.userId, keyHours);
                    return true;
                }
            }
        }

        var danmakuFromSameUser = [];
        var lowLvlDanmaku = [];
        var highLvlDanmaku = [];
        for (var n =0; n < danmakuArray.length; n++) {
            if (danmakuArray[n].user == newObj.user){
                danmakuFromSameUser.push(danmakuArray[n].danmaku);
            }
            if (danmakuArray[n].userLvl && danmakuArray[n].userLvl <= lowLvl){
                lowLvlDanmaku.push(danmakuArray[n].danmaku);
            }
            else{
                highLvlDanmaku.push(danmakuArray[n].danmaku);
            }
        }
        if(highLvlDanmaku.length === 0){
            console.log("low level: %s", lowLvlDanmaku.toString());
            console.log("high level: %s", highLvlDanmaku.toString());
        }
        walkThrough(danmakuFromSameUser, newObj, hours);
        if(newObj.userLvl && newObj.userLvl <= lowLvl && !highLvlDanmaku.includes(newObj.danmaku)){
            var stock = walkThrough(lowLvlDanmaku, newObj, keyHours);
            if (stock){
                similarDanmaku.push(newObj.danmaku);
                console.log("added to similarDanmaku: ",similarDanmaku.toString());
            }
        }

    }

    function walkThrough(danmakuList, object, blacklistHours){
        if (danmakuList.length > blacklistCount){
            var sameCount = 0;
            for (var d = 0; d < danmakuList.length; d++) {
                if (similarity(danmakuList[d], object.danmaku) > percentage){
                    sameCount++;
                }
            }
            if (sameCount > blacklistCount) {
                console.log('%c%s：\"%s\"%c大于%d次...%c%d', "color:blue", object.user, object.danmaku, "color:black", blacklistCount, "color:blue", sameCount);
                console.log(danmakuList);
                blacklistUser(object.userId, blacklistHours);
                return true;
            }
        }
        return false;
    }

    function blacklistUser(uid,hour){

        if(roomId === null){
            var path = window.location.pathname;
            var xml = new XMLHttpRequest();
            xml.onreadystatechange = function(){
                if (xml.readyState == 4 && xml.status == 200) {
                    var obj = JSON.parse(xml.responseText);
                    if (obj.code !== 0 || obj.message != "ok" || obj.msg != "ok"){
                        console.log("Something wrong: " + obj);
                    }
                    else{
                        roomId = obj.data.room_id;
                        sendRequest(uid, hour);
                    }
                }
            };
            xml.open("GET", "https://api.live.bilibili.com/room/v1/Room/room_init?id=" + path.substr(1), true);
            xml.send(null);
        }
        else{
            sendRequest(uid, hour);
        }
    }

    function sendRequest(uid, hour){
        console.log('正在对UID\"%c%s%c\"进行黑名单%s小时处理', "color:blue", uid, "color:black",hour);
        if(roomId === null){
            console.log("room-id is not ready");
            return false;
        }
        var details = {
            'roomid': roomId,
            'type': 1,
            'content': uid,
            'hour': hour,
            'csrf_token': getCookie("bili_jct")
        };
        var formBody = [];
        for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");

        fetch('https://api.live.bilibili.com/liveact/room_block_user', {
            credentials: 'include',
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formBody
        }).then(function(response){
            response.json().then(function(data){
                console.log(data);
            });
        });
    }

    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    }

    // use Levenshtein distance to calculate the similarity of two string
    // solution from the answer of stack overflow:
    // https://stackoverflow.com/questions/10473745/compare-strings-javascript-return-of-likely
    function similarity(s1, s2) {
        var longer = s1;
        var shorter = s2;
        if (s1.length < s2.length) {
            longer = s2;
            shorter = s1;
        }
        var longerLength = longer.length;
        if (longerLength === 0) {
            return 1.0;
        }
        return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
    }

    function editDistance(s1, s2) {
        s1 = s1.toString().toLowerCase();
        s2 = s2.toString().toLowerCase();
        var costs = [];
        for (var i = 0; i <= s1.length; i++) {
            var lastValue = i;
            for (var j = 0; j <= s2.length; j++) {
                if (i === 0) {
                    costs[j] = j;
                }
                else {
                    if (j > 0) {
                        var newValue = costs[j - 1];
                        if (s1.charAt(i - 1) != s2.charAt(j - 1)) {
                            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                        }
                        costs[j - 1] = lastValue;
                        lastValue = newValue;
                    }
                }
            }
            if (i > 0) {
                costs[s2.length] = lastValue;
            }
        }
        return costs[s2.length];
    }
})();