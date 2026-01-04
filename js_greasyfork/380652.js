// ==UserScript==
// @name DarwinCount
// @description Compte le nombre de fois que josephine est la copine de Darwin
// @version  0.0.4
// @grant none
// @match https://s1.abyssus.games/*
// @include https://s1.abyssus.games/*
// @namespace https://greasyfork.org/users/184736
// @downloadURL https://update.greasyfork.org/scripts/380652/DarwinCount.user.js
// @updateURL https://update.greasyfork.org/scripts/380652/DarwinCount.meta.js
// ==/UserScript==

if (getCookie("DarwinCount") == "") setCookie("DarwinCount", 0, 7);

if (location.href.indexOf("cgnew") * location.href.indexOf("chat") < 0) main();
function main(){
    try {
        var msg = document.getElementById("message").value;
        var msgLow = msg.toLowerCase();
        if ((msgLow.match(/jos(e|é)phine/g)) && msgLow.indexOf("copine") != -1) {
            if (msgLow.match(/\([0-9]+\)/g)) {
                setTimeout(main, 5000);
                return;
            }
            var count = getCookie("DarwinCount");
            count++;
            msg += " [size=1](" + count + ")[/size]";
            document.getElementById("message").value = msg;
            setCookie("DarwinCount", count, 7);
            setTimeout(main, 5000);
            return;
        }
    } catch (e) {}
    setTimeout(main, 500);
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}