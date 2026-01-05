// ==UserScript==
// @name         handsoff
// @namespace    http://112358.sinaapp.com/tampermonkey/
// @version      1.0
// @match        http://*.dorcel-handsoff.com
// @grant        none
// @description  解放双手，空格暂停，回车播放
// @downloadURL https://update.greasyfork.org/scripts/13848/handsoff.user.js
// @updateURL https://update.greasyfork.org/scripts/13848/handsoff.meta.js
// ==/UserScript==
AutoClick = {};
AutoClick.keydown = function(k) {
    var oEvent = document.createEvent('KeyboardEvent');

    Object.defineProperty(oEvent, 'keyCode', {
        get : function() {
            return this.keyCodeVal;
        }
    });     
    Object.defineProperty(oEvent, 'which', {
        get : function() {
            return this.keyCodeVal;
        }
    });     

    if (oEvent.initKeyboardEvent) {
        oEvent.initKeyboardEvent("keydown", true, true, document.defaultView, false, false, false, false, k, k);
    } else {
        oEvent.initKeyEvent("keydown", true, true, document.defaultView, false, false, false, false, k, 0);
    }

    oEvent.keyCodeVal = k;

    if (oEvent.keyCode !== k) {
        alert("keyCode mismatch " + oEvent.keyCode + "(" + oEvent.which + ")");
    }


    document.dispatchEvent(oEvent);
};
AutoClick.run=setInterval(function(){
        AutoClick.keydown(76); // l
        AutoClick.keydown(80); // p
        AutoClick.keydown(81); // q
        AutoClick.keydown(83); // s
},200);

//window.document.onkeydown = disableRefresh;
function disableRefresh(e){
    e = (e) ? e : window.event;
    if (evt.keyCode) {
        if(evt.keyCode == 32){
            AutoClick.run();
            //do something
        }
    }
}
