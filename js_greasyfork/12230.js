// ==UserScript==
// @name         PicartoTV Chat Link parsing fix
// @namespace    Wolvan_PicartoTV_HTTP_Parsefix
// @version      1.0
// @description  Fix HTTP links not being recognized as links
// @author       Wolvan
// @match        *://*.picarto.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/12230/PicartoTV%20Chat%20Link%20parsing%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/12230/PicartoTV%20Chat%20Link%20parsing%20fix.meta.js
// ==/UserScript==

$ = window.$;
parseLinks = window.parseLinks;
addMsgOld = window.addMsg;

window.addMsg = function(msgObj,msgType) {
    addMsgOld(msgObj, msgType);
    $("#msgs").trigger("addMsg", {
        messageObject: msgObj,
        messageType: msgType
    })
}

$("#msgs").on("addMsg", function(event) {
    var elem = $(this).find("span:not(.timestamp, .my_timestamp):last");
    elem.html(parseLinks(elem.html()));
});