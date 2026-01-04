// ==UserScript==
// @name         Vertix store custom name after refresh vertix.io
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Keeps track of your name
// @author       Supercap
// @match        http://vertix.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31018/Vertix%20store%20custom%20name%20after%20refresh%20vertixio.user.js
// @updateURL https://update.greasyfork.org/scripts/31018/Vertix%20store%20custom%20name%20after%20refresh%20vertixio.meta.js
// ==/UserScript==


document.getElementById("playerNameInput").onchange = function () {
    setCook("inputName",document.getElementById("playerNameInput").value,100);
};
var interval2 = setInterval(function(){
    if(document.getElementById("playerNameInput").value !== "") {
        document.getElementById("playerNameInput").value = getCook("inputName");
        clearInterval(interval2);
    }
}, 100);

function setCook(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCook(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
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