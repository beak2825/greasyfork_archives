// ==UserScript==
// @name           Facebook - Custom Colors / Vlastné Farby
// @namespace      Facebook Colors
// @description    User can define custom facebook colors / Užívateľ si môže definovať vlastné farby
// @include        http://*.facebook.com/*
// @include        https://*.facebook.com/*
// @icon           https://www.facebook.com/rsrc.php/yl/r/H3nktOa7ZMg.ico
// @require        https://cdn.jsdelivr.net/jquery.spectrum/1.3.3/spectrum.js
// @author         Matúš Matthew Paulovič
// @version        1.1
// @date           2017-February-10
// @downloadURL https://update.greasyfork.org/scripts/27242/Facebook%20-%20Custom%20Colors%20%20Vlastn%C3%A9%20Farby.user.js
// @updateURL https://update.greasyfork.org/scripts/27242/Facebook%20-%20Custom%20Colors%20%20Vlastn%C3%A9%20Farby.meta.js
// ==/UserScript==

// Získanie uložených hodnôt farieb z Cookies
var cookieFBBlueBar = document.cookie.replace(/(?:(?:^|.*;\s*)FBBlueBar\s*\=\s*([^;]*).*$)|^.*$/, "$1");
var cookieFBBackGround = document.cookie.replace(/(?:(?:^|.*;\s*)FBBackGround\s*\=\s*([^;]*).*$)|^.*$/, "$1");

// Ak užívateľ už má uložený štýl - načítanie
if(cookieFBBlueBar)
{
var x = document.getElementsByClassName('_2s1y'); var i; for (i = 0; i < x.length; i++) { x[i].style.backgroundColor = '#' + cookieFBBlueBar; }
var x = document.getElementsByClassName('_53jh'); var i; for (i = 0; i < x.length; i++) { x[i].style.backgroundImage = 'none'; x[i].style.backgroundColor = '#' + cookieFBBlueBar; }
}
if(cookieFBBackGround)
{
var x = document.getElementsByClassName('_5vb_'); var i; for (i = 0; i < x.length; i++) { x[i].style.backgroundColor = '#' + cookieFBBackGround; }
}

// Vytvorenie grafickeho rozhrania
var blueBar = document.getElementsByClassName("_2t-f")[0];

// PickerA - Lišta
var pickerA = document.createElement("button");
var pickerAA = document.createElement("input");
pickerA.className = "jscolor {valueElement:'valueElementA', onFineChange:'update(valueElementA)'}";
pickerA.setAttribute("title", "Farba lišty");
pickerA.style.height = "10px";
pickerA.style.width = "13px";
pickerA.style.marginTop = "14px";
pickerA.style.marginLeft = "5px";
pickerA.style.borderWidth = "1px";
pickerA.style.cursor = "pointer";
pickerAA.setAttribute("id", "valueElementA");
pickerAA.setAttribute("value", cookieFBBlueBar);
pickerAA.setAttribute("type", "hidden");
pickerAA.setAttribute("onChange", "var x = document.getElementsByClassName('_2s1y'); var i; for (i = 0; i < x.length; i++) { x[i].style.backgroundColor = '#' + valueElementA.value; document.cookie = 'FBBlueBar=' + valueElementA.value + '; expires=Thu, 30 Dec 2020 23:00:00 UTC'; }");
blueBar.appendChild(pickerAA);
blueBar.appendChild(pickerA);

// PickerB - Pozadie
var pickerB = document.createElement("button");
var pickerBB = document.createElement("input");
pickerB.className = "jscolor {valueElement:'valueElementB', onFineChange:'update(valueElementB)'}";
pickerB.setAttribute("title", "Farba pozadia");
pickerB.style.height = "10px";
pickerB.style.width = "13px";
pickerB.style.marginTop = "14px";
pickerB.style.marginLeft = "5px";
pickerB.style.borderWidth = "1px";
pickerB.style.cursor = "pointer";
pickerBB.setAttribute("id", "valueElementB");
pickerBB.setAttribute("value", cookieFBBackGround);
pickerBB.setAttribute("type", "hidden");
pickerBB.setAttribute("onChange", "var x = document.getElementsByClassName('_5vb_'); var i; for (i = 0; i < x.length; i++) { x[i].style.backgroundColor = '#' + valueElementB.value; document.cookie = 'FBBackGround=' + valueElementB.value + '; expires=Thu, 30 Dec 2020 23:00:00 UTC'; }");
blueBar.appendChild(pickerBB);
blueBar.appendChild(pickerB);