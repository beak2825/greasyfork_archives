// ==UserScript==
// @name         Auto Save Draft to Slowly
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自動保存Slowly信件內容。
// @author       Y
// @match        https://web.getslowly.com/friend/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390606/Auto%20Save%20Draft%20to%20Slowly.user.js
// @updateURL https://update.greasyfork.org/scripts/390606/Auto%20Save%20Draft%20to%20Slowly.meta.js
// ==/UserScript==
var __autoSaveSlowlyConfig={
    lastValueLength:0,
    lastTime:0,
    //定時檢測時間,默認500毫秒
    autoSaveTime:500,
    //設置多久自動保存，默認為30秒，0秒表示去除自動保存，由於自動保存影響體驗，暫時默認去除
    time:0//30*1000
};
var inputFlag=false;
window.addEventListener('load', function () {
    setInterval(function(){
        var text = document.querySelectorAll(".textarea");
        if(!text||text.length<=0||text[0].ownerDocument.activeElement!=text[0])
        {
            autoSave(true);
        }
        if(__autoSaveSlowlyConfig.time>0 && text&&text.length>0&&text[0].value){
            var time=new Date().getTime();
            if(text[0].value.length==__autoSaveSlowlyConfig.lastValueLength&&(time-__autoSaveSlowlyConfig.lastTime)>__autoSaveSlowlyConfig.time){
                autoSave(true);
                __autoSaveSlowlyConfig.lastTime=time;
                __autoSaveSlowlyConfig.lastValueLength=text[0].value.length;
            }
            __autoSaveSlowlyConfig.lastValueLength=text[0].value.length;
        }
    },__autoSaveSlowlyConfig.autoSaveTime);
}, false);

function autoSave(notShow){
    var saveBtn = document.querySelectorAll(".btn-outline-dark");
    if(saveBtn&&saveBtn.length>0){
        saveBtn[0].click();
        if(!notShow) alert('auto saved');
        else{
            var text = document.querySelectorAll(".textarea");
            if(text&&text.length>0) text[0].focus();
        }
    }
}
if (typeof history !== "undefined") {
    var _wr = function (type) {
        var orig = history[type];
        return function () {
            var rv = orig.apply(this, arguments);
            var e = new Event(type);
            e.arguments = arguments;
            window.dispatchEvent(e);
            return rv;
        };
    };
    history.pushState = _wr('pushState');
    history.replaceState = _wr('replaceState');
}
window.onhashchange = autoSave;
window.onpopstate = autoSave;
window.addEventListener('replaceState', autoSave);
window.addEventListener('pushState', autoSave);
window.onunload = autoSave;
window.onpagehide = autoSave;
window.onclose = autoSave;
window.onbeforeunload = autoSave;