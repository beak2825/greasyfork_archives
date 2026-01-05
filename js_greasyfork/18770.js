// ==UserScript==
// @name         bonus
// @name:ru      bonus
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @description:ru  try to take over the world!
// @author       Ivankalyada
// @match        http://catch-bonus.ru/*
// @match        https://catch-bonus.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18770/bonus.user.js
// @updateURL https://update.greasyfork.org/scripts/18770/bonus.meta.js
// ==/UserScript==


if (window.location.href == "https://catch-bonus.ru/account" || window.location.href == "http://catch-bonus.ru/account") {
    setInterval(function(){ window.open('https://catch-bonus.ru/account/bonus1', '_blank'); }, 80*1000);
    setInterval(function(){ window.open('https://catch-bonus.ru/account/bonus2', '_blank'); }, 5*65*1000);
    setInterval(function(){ window.open('https://catch-bonus.ru/account/bonus3', '_blank'); }, 10*65*1000);
    setInterval(function(){ window.open('https://catch-bonus.ru/account/bonus4', '_blank'); }, 30*65*1000);
    setInterval(function(){ window.open('https://catch-bonus.ru/account/bonus5', '_blank'); }, 60*65*1000);
    setInterval(function(){ window.open('https://catch-bonus.ru/account/bonus6', '_blank'); }, 180*65*1000);
}
else if (window.location.href == "https://catch-bonus.ru/account/bonus1") { // 1 minute bonus
    var satisfy = document.getElementsByName('bonus')[0];
    if (satisfy) setTimeout(function(){ satisfy.click(); }, 3000);
    else window.close();
} 
else if (window.location.href == "https://catch-bonus.ru/account/bonus2") { // 5 minute bonus
    var satisfy = document.getElementsByName('bonus')[0];
    if (satisfy) setTimeout(function(){ satisfy.click(); }, 3000);
    else window.close();
} 
else if (window.location.href == "https://catch-bonus.ru/account/bonus3") { // 10 minute bonus
    var satisfy = document.getElementsByName('bonus')[0];
    if (satisfy) setTimeout(function(){ satisfy.click(); }, 3000);
    else window.close();
} 
else if (window.location.href == "https://catch-bonus.ru/account/bonus4") { // 30 minute bonus
    var satisfy = document.getElementsByName('bonus')[0];
    if (satisfy) setTimeout(function(){ satisfy.click(); }, 3000);
    else window.close();
} 
else if (window.location.href == "https://catch-bonus.ru/account/bonus5") { // 1 hour bonus
    var satisfy = document.getElementsByName('bonus')[0];
    if (satisfy) setTimeout(function(){ satisfy.click(); }, 3000);
    else window.close();
} 
else if (window.location.href == "https://catch-bonus.ru/account/bonus6") { // 3 hour bonus
    var satisfy = document.getElementsByName('bonus')[0];
    if (satisfy) setTimeout(function(){ satisfy.click(); }, 3000);
    else window.close();
} 