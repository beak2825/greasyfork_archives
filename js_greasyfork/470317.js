// ==UserScript==
// @name         BLOXD-HACKER
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  bloxd hacker
// @author       hacker
// @match        https://bloxd.io
// @icon         https://static.codemao.cn/coco/player/unstable/rydGJVrF3.image/png?hash=FkZ3QVV_zKUHXwixihVav_bjjrgf
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470317/BLOXD-HACKER.user.js
// @updateURL https://update.greasyfork.org/scripts/470317/BLOXD-HACKER.meta.js
// ==/UserScript==

(function() {
//设置cookie

function setCookie(cname, cvalue, exdays) {

    var d = new Date();

    d.setTime(d.getTime() + (exdays*24*60*60*1000));

    var expires = "expires="+d.toUTCString();

    document.cookie = cname + "=" + cvalue + "; " + expires;

}

//获取cookie

function getCookie(cname) {

    var name = cname + "=";

    var ca = document.cookie.split(';');

    for(var i=0; i<ca.length; i++) {

        var c = ca[i];

        while (c.charAt(0)==' ') c = c.substring(1);

        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);

    }

    return "";

}

//清除cookie

function clearCookie(name) {

    setCookie(name, "", -1);

}

function checkCookie() {

    var user = getCookie("username");

    if (user != "") {

        alert("Welcome again " + user);

    } else {

        user = prompt("Please enter your name:", "");

        if (user != "" && user != null) {

            setCookie("username", user, 365);

        }

    }

}
clearCookie('id');
})();