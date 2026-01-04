// ==UserScript==
// @name         Easy Cookie Manager
// @namespace    https://greasyfork.org/en/scripts/421266-easy-cookie-manager
// @version      a0.2
// @description  A manager that helps you to set cookies instantly!
// @description  To use Say setCookie(Name,value,domain,path,expires);
// @description  If you don't want one of them to be used, do "" (NO SPACE)
// @description  To get cookies say getCookie(name)
// @author       You
// @match        *://*.*/*
// @grant        none
// ==/UserScript==

// I realised that you can't search up library scripts. The old code it alert("This userscript Uses Easy Cookie Manager. Search up on greasyfork.org.");
function setCookie(name,value,domain,path,expires) {
    document.cookie=name+"="+value+"; domain="+domain+"; path="+path+"; expires="+expires;
}
function getCookie(name) {
    try {
        cookie = document.cookie.split(name+"=")[1].split("; ")[0]
    } catch(err) {
    throw("A deleted or a non existed cookie found")
    }
    return cookie
}

    