// ==UserScript==
// icon https://wad.ojooo.com/img/icons/favicon-96x96.png?2
// @name Ojooo
// @namespace https//moneybot24.com/
// @version 1.2
// @description Sign up: http://goo.gl/x3jCD4 - Login, Click "Paid to click ads" or "Ojooo Grid", bots start automatically
// @Author MoneyBot24.com
// @match http://wad.ojooo.com/*
// @downloadURL https://update.greasyfork.org/scripts/387284/Ojooo.user.js
// @updateURL https://update.greasyfork.org/scripts/387284/Ojooo.meta.js
// ==/UserScript==

(function() {
if(window.location.href.indexOf("http://wad.ojooo.com/cks.php?cdk=flase&cointoss=") > -1)
{
console.log('close grid');
setInterval(function(){
var len = $('.close_window').length;
if(len > 0)
{
window.close();
}
},1000);
}
else if(window.location.href.indexOf("http://wad.ojooo.com/cks.php?k=") > -1)
{
setInterval(function(){
if ((document.documentElement.innerText.indexOf('Ihr Klick wurde bestätigt') > -1) ||(document.documentElement.innerText.indexOf('Your click has been validated') > -1))
{
location.href = 'http://wad.ojooo.com/ads.php';
}
else if((document.documentElement.innerText.indexOf('You have already viewed this advertisement, please come back after 24h.') > -1))
{
location.href = 'http://wad.ojooo.com/ads.php';
}
},1000);
}
else if(window.location.href.indexOf("http://wad.ojooo.com/cointoss.php") > -1)
{
console.log('grid');
var changes = parseInt($("tr:contains('/10')").find('td:eq(1)').text().split('/')[0]);
console.log('Changes:' + changes);
if(changes !== 0)
{
var random1 = Math.floor((Math.random() * 20) + 1);
var random2 = Math.floor((Math.random() * 28) +1);
console.log('Random1: ' + random1 + ' Random2: ' + random2);
$('#' + random1).attr('name', random2).click();
}
loadNew();
}
else if(window.location.href.indexOf("http://wad.ojooo.com/ads.php") > -1)
{
var el = $(".tile:not(.viewed):not(.only_mobile_box)").parent().not('.ChillTip_ads');
var len = el.length;
if(len > 0)
{
var href = el.attr('href');
window.open(href, '_self');
}
else
{
location.href = 'http://wad.ojooo.com/cointoss.php';
}
}
})();