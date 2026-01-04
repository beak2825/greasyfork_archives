// ==UserScript==
// @name               视翰自动弹幕 AutoClick
// @namespace          视翰自动弹幕 AutoClick
// @description        shihan AutoClick
// @description:zh-cn  视翰自动弹幕 AutoClick
// @copyright          ysz
// @version            0.4
// @include            http://mp.meeting.shine.com.cn/*
// @include            /chat/
// @require            https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @run-at             document-end
// @grant              window.close
// @grant              window.focus
// @downloadURL https://update.greasyfork.org/scripts/416842/%E8%A7%86%E7%BF%B0%E8%87%AA%E5%8A%A8%E5%BC%B9%E5%B9%95%20AutoClick.user.js
// @updateURL https://update.greasyfork.org/scripts/416842/%E8%A7%86%E7%BF%B0%E8%87%AA%E5%8A%A8%E5%BC%B9%E5%B9%95%20AutoClick.meta.js
// ==/UserScript==


try{
document.getElementById("loginBtn").click();
}catch(e){};

var time = 1000;
var textList = [

]
async function echo(params){
    if(textList.length == 0) return;
    for (const key in params) {
        await sleep(time);
        sendMessage(params[key]);
        if (key == params.length - 1){
            return echo(textList);
        }
    }
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function sendMessage(d) {
    $("#dope").val(d);
    document.querySelector('button').click();
}
echo(textList)

