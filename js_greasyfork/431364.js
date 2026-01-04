// ==UserScript==
// @name         新しい放置ゲームで自動購入と昇段可能通知をする
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自動購入をして、昇段可能になったら背景とダイアログでお知らせします。
// @author       aspi
// @match        https://dem08656775.github.io/newincrementalgame/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431364/%E6%96%B0%E3%81%97%E3%81%84%E6%94%BE%E7%BD%AE%E3%82%B2%E3%83%BC%E3%83%A0%E3%81%A7%E8%87%AA%E5%8B%95%E8%B3%BC%E5%85%A5%E3%81%A8%E6%98%87%E6%AE%B5%E5%8F%AF%E8%83%BD%E9%80%9A%E7%9F%A5%E3%82%92%E3%81%99%E3%82%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/431364/%E6%96%B0%E3%81%97%E3%81%84%E6%94%BE%E7%BD%AE%E3%82%B2%E3%83%BC%E3%83%A0%E3%81%A7%E8%87%AA%E5%8B%95%E8%B3%BC%E5%85%A5%E3%81%A8%E6%98%87%E6%AE%B5%E5%8F%AF%E8%83%BD%E9%80%9A%E7%9F%A5%E3%82%92%E3%81%99%E3%82%8B.meta.js
// ==/UserScript==



var tuutiIsEnable=0;
var tuuti = document.createElement("div");
tuuti.textContent = "昇段可能通知 ";
var tuutiToggle = document.createElement("button");
tuutiToggle.textContent = "OFF";
tuuti.insertBefore(tuutiToggle, null);
var tuutiParent = document.getElementsByClassName("container")[0].childNodes[5];
tuutiParent.insertBefore(tuuti, null);

tuutiToggle.onclick = function () {
    tuutiIsEnable ^= 1;
    if(tuutiToggle.textContent=="OFF") tuutiToggle.textContent="ON";
    else tuutiToggle.textContent="OFF";
};

var data=document.getElementById("app").__vue_app__._instance.ctx;

(function houti() {
    if(((!(data.player.onchallenge && data.player.challenges.includes(0)) && data.player.money.gte('1e18'))
        || data.player.money.gte('1e24')) && tuutiIsEnable){
        document.getElementsByTagName("HTML")[0].style.backgroundColor="#A0FFA0";
        data.resetLevel(false,false);
    }
    else{
        document.getElementsByTagName("HTML")[0].style.backgroundColor="#FFFFFF";
    }


    if(data.player.money.gte(data.player.acceleratorsCost[1])) {
        data.buyAccelerator(1);
    }
    for(let i=7; i>=0; i--){
        while(data.player.money.gte(data.player.generatorsCost[i])) {
            data.buyGenerator(i);
        }
    }
    if(data.player.money.gte(data.player.acceleratorsCost[0])) {
        data.buyAccelerator(0);
    }
    setTimeout(houti, data.player.tickspeed);
})();


