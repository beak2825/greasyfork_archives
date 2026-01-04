// ==UserScript==
// @name Torn Race Stats
// @description Shows Car stats in numbers on the "Your Cars" page.
// @namespace http://www.browserscripts.blogger.com
// @include *torn.com/loader.php?sid=racing
// @version 0.1
// @require http://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/382577/Torn%20Race%20Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/382577/Torn%20Race%20Stats.meta.js
// ==/UserScript==

//-Race Stats
$("a[href$='loader.php?sid=racing&tab=cars'],a[href$='loader.php?sid=racing&tab=parts'],a[href$='changeRacingCar']").click(function(){window.setTimeout(function(){carStats();},1000);});
$("a[href$='loader.php?sid=racing&tab=race']").click(function(){window.setTimeout(function(){carLookLink();},1000);});

function carLookLink () {
if ($("div.car-selected.left").length){
$("a[href$='changeRacingCar']").click(function(){window.setTimeout(function(){carStats();},1000);});
}
else {window.setTimeout(function(){carLookLink();},1000);}
}

function carParts() {
if ($("div.cont-black.bottom-round").length){
var hold=$("ul.properties-wrap>li");
var clrSt=$("div.bar-color-wrap-d");
var grySt=$("div.bar-gray-light-wrap-d");
var hC=0;
while (grySt[hC])
{
var cStatN=$(clrSt).eq(hC).attr("style");
cStatN=cStatN.replace(/[^0-9.]/g,"").substr(0,6);
if (cStatN=="0"){
cStatN=$(grySt).eq(hC).attr("style");
cStatN=cStatN.replace(/[^0-9.]/g,"").substr(0,6);}
var top=$(grySt).eq(hC).parents("li:first").find("div.name");
$(top).css("height","40px");
if ($(top).text().search(cStatN)<0){
$(top).append("<br/>"+cStatN);}
hC++;

}}
else{window.setTimeout(function(){carParts();},1000);}
}

function carStats () {
if ($("div.enlist-wrap.enlisted-wrap").length){
$("div.gallery-wrapper.pagination.m-top10.left a,a[href$='changeRacingCar'],a[href$='sid=racing&tab=parts'],div.gallery-wrapper.pagination.m-top10.left>a").click(function(){window.setTimeout(function(){carStats();},1000);});
$("div.remove-info>a").click(function(){window.setTimeout(function(){carParts();}, 1000);});
var holder=$("ul.enlist-bars>li");
var cStat=$("div.bar-color-wrap-d");
var dStat=$("div.bar-gray-light-wrap-d");
var hC=0;
var sC=0;
while (holder[hC])
{
if ($(holder).eq(hC).hasClass("clear")===false){
var cStatN=$(cStat).eq(sC).attr("style");
cStatN=cStatN.replace(/[^0-9.]/g,"").substr(0,6);
if (cStatN=="0"){
cStatN=$(dStat).eq(sC).attr("style");
cStatN=cStatN.replace(/[^0-9.]/g,"").substr(0,6);}
if ($(holder).eq(hC).text().search(cStatN)<0){
$(holder).eq(hC).prepend(cStatN);}
sC++;}
hC++;

}}
else{window.setTimeout(function(){carStats();},1000);}
}
//--End Race Stats