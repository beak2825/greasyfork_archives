// ==UserScript==
// @name         Preferred language setter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Bored from codeforces changing your language? Use this
// @author       SuperJava
// @match        http://codeforces.com/*/submit
// @match        http://codeforces.com/*/submit?*
// @match        http://codeforces.com/*/*/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40382/Preferred%20language%20setter.user.js
// @updateURL https://update.greasyfork.org/scripts/40382/Preferred%20language%20setter.meta.js
// ==/UserScript==

var z = document.getElementsByName('programTypeId')[0];
if(checkCookie('preflang')){
    z.value = getCookie('preflang');
}
$('<button type="button" id="SuperJava" style="margin-left:10px;">Save Option</button><span id="norsq" style="margin-left:10px;"> </span>').insertAfter(z);
$('#SuperJava').click(function(){
    setCookie('preflang',z.value,30);
    $('#norsq').text('Updated!');
    setTimeout(function(){$('#norsq').text('');},2000);
});

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
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

function checkCookie(cname) {
    var username = getCookie(cname);
    if (username != "") {
        return true;
    } else {
        return false;
    }
}