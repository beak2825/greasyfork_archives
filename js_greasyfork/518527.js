// ==UserScript==
// @name         OWOT & BonziWorld Chat Download NEW
// @namespace    OurWorldText&BonziWorld
// @version      2024-11-22
// @description  Allows you to download the chat logs of Our World of Text and BonziWorld. 100% working.
// @author       Sabrina
// @match        *://*.ourworldoftext.com/*
// @match        *://*.bonziworld.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ourworldoftext.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518527/OWOT%20%20BonziWorld%20Chat%20Download%20NEW.user.js
// @updateURL https://update.greasyfork.org/scripts/518527/OWOT%20%20BonziWorld%20Chat%20Download%20NEW.meta.js
// ==/UserScript==

window.downloadLiveChat = function() {
    const link = document.createElement("a");
    const file = new Blob([document.getElementById("global_chatfield").innerHTML], { type: 'text/plain' });
    link.href = URL.createObjectURL(file);
    link.download = "owot"+new Date().getTime()+".html";
    link.click();
    URL.revokeObjectURL(link.href);
}

window.downloadBonziChat = function() {
    const link = document.createElement("a");
    const file = new Blob([document.getElementById("log_body").innerHTML], { type: 'text/plain' });
    link.href = URL.createObjectURL(file);
    link.download = "bonzi"+new Date().getTime()+".html";
    link.click();
    URL.revokeObjectURL(link.href);
}

document.addEventListener("keydown", function(e) {
    if(e.keyCode == 116) {
        e.preventDefault();
        if(window.location.href.indexOf("ourworldoftext") > -1) {
            downloadLiveChat();
        } else {
            downloadBonziChat();
        }
    }
});

if(window.location.href.indexOf("ourworldoftext") > -1) {
    setTimeout(() => {
        chatHistoryLimit = Infinity;
    }, 5000);

    w.on("chatMod", function(e) {
        console.log(e.id);
    })
} else {
    setInterval(() => {
        document.getElementById("log_body").scrollTo(0, document.getElementById("log_body").scrollHeight);
    }, 1000);
}

window.onbeforeunload = function(e) {
    e.preventDefault();
}