// ==UserScript==
// @name         youtube直播自动评论机器人
// @namespace    http://www.youtube.com/
// @version      0.4
// @description  youtube直播自动评论机器人 Auto live comment bot for youtube
// @author       lanxiuying
// @match        *.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400156/youtube%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E8%AF%84%E8%AE%BA%E6%9C%BA%E5%99%A8%E4%BA%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/400156/youtube%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E8%AF%84%E8%AE%BA%E6%9C%BA%E5%99%A8%E4%BA%BA.meta.js
// ==/UserScript==


//需要发送的评论
var contentArr = [];
contentArr.push('别吵了');
contentArr.push('love & peace');
//评论时间间隔(频道回复自带一分钟多的CD时间)
var intervalTime = 90 * 1000;
var timer = 0;
var cLength = contentArr.length;

window.inputValue = function (dom, st) {

    var evt = new InputEvent('input', {
        inputType: 'insertText',
        data: st,
        dataTransfer: null,
        isComposing: false
    });
    dom.innerHTML = st;
    dom.dispatchEvent(evt);
}

setInterval(function () {
    var cIndex = timer % cLength;
    var shtml = document.querySelectorAll("#input");
    var commentInput = shtml[1];
    if(commentInput){
        window.inputValue(commentInput, contentArr[cIndex]);
        commentInput.focus();
        commentInput.click();
        var buttons = document.querySelectorAll("#send-button");
        if (buttons && buttons.length > 0) {
            var button = buttons[0];
            var childNodes = button.childNodes;
            var childNode = childNodes[0];
            childNode.click();
            timer++;
        }
    }else{
        console.log("油猴脚本错误：");
        console.log(commentInput);
    }
}, intervalTime);

