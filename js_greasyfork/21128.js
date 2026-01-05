// ==UserScript==
// @name         Automatyczny atak...
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Atakuje moby (Championy i Elity z klawisza R) (Legendarne z klawisza G)
// @author       Vomar
// @match        https://kosmiczni.pl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21128/Automatyczny%20atak.user.js
// @updateURL https://update.greasyfork.org/scripts/21128/Automatyczny%20atak.meta.js
// ==/UserScript==

function check() {
var source = document.documentElement.innerHTML;
var champion = source.indexOf("Champion");
var elite = source.indexOf("Elita");
var legend = source.indexOf("Legendarny");
var epic = source.indexOf("Epicki");
if (legend !== -1)
{
var g = $.Event("keydown", { keyCode: 71});
$("body").trigger(g);
}
/*if (elite !== -1)
{
var r = $.Event("keydown", { keyCode: 80});
$("body").trigger(p);
}
if (champion !== -1)
{
var r = $.Event("keydown", { keyCode: 85});
$("body").trigger(u);
}
if (epic !== -1)
{
alert("Epik");
}
*/
if (elite !== -1 || champion !== -1)
{
var r = $.Event("keydown", { keyCode: 82});
$("body").trigger(r);
}
}
setInterval(check,1);
