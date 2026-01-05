// ==UserScript==
// @name         Picarto Username Changer
// @namespace    Wolvan_PicartoTV_Username_Modifier
// @version      1.0
// @description  Change your name, at least temporarily!
// @author       Wolvan
// @match        *://*.picarto.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/16898/Picarto%20Username%20Changer.user.js
// @updateURL https://update.greasyfork.org/scripts/16898/Picarto%20Username%20Changer.meta.js
// ==/UserScript==

// Get Picarto's jQuery instance, no need to polute it with our own
var $ = window.jQuery;

// A function to inject CSS into the site
function changeName(name) {
    $.post("/process/channel", {
        setusername: name
    }).done(function (resp) {
        switch (resp) {
            case "ok":
                location.reload();
                break;
            case "userNameRegEx":
                window.displayNotificationMsg(10);
                break;
            case "userNameExists":
                window.displayNotificationMsg(13);
                break;
            case "userNameTooLong":
                window.displayNotificationMsg(11);
                break;
        }
    });
}

$("body").keydown(function(e) {
    if (e.which === 81 && e.ctrlKey) {
        var name = prompt("Please choose a username");
        if (name) changeName(name);
    }
});