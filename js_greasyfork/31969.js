// ==UserScript==
// @name         Neopets: Kiss The Mortog autoplayer
// @namespace    http://clraik.com/forum/showthread.php?61144-Neopets-Kiss-The-Mortog-autoplayer
// @version      0.3
// @description  Plays Kiss The Mortog until you get the avatar. Compatible with German neopets.
// @author       AyBeCee (clraik)
// @match        www.neopets.com/medieval/kissthemortog.phtml*
// @downloadURL https://update.greasyfork.org/scripts/31969/Neopets%3A%20Kiss%20The%20Mortog%20autoplayer.user.js
// @updateURL https://update.greasyfork.org/scripts/31969/Neopets%3A%20Kiss%20The%20Mortog%20autoplayer.meta.js
// ==/UserScript==

var minToWait=100;
var maxToWait=5000;
var wait=Math.floor(Math.random() * (maxToWait - minToWait + 1)) + minToWait;

if(document.URL.indexOf("medieval/kissthemortog.phtml") != -1) {
    setTimeout(function(){ $(".content table a:last-child img").click();},wait);
    if (document.body.innerHTML.indexOf('At least you only lost 50 Neopoints!') != -1){
        setTimeout(function(){ $("[value='Try again...']").click();},wait);
    }
    if (document.body.innerHTML.indexOf('You have won <b>100 NP</b> so far...') != -1){
        setTimeout(function(){ $("[value='Continue']").click();},wait);
    }
    if (document.body.innerHTML.indexOf('You have won <b>300 NP</b> so far...') != -1){
        setTimeout(function(){ $("[value='Continue']").click();},wait);
    }
    if (document.body.innerHTML.indexOf('You have won <b>1,150 NP</b> so far...') != -1){
        setTimeout(function(){ $("[value='Continue']").click();},wait);
    }
    if (document.body.innerHTML.indexOf('You have won <b>5,900 NP</b> so far...') != -1){
        setTimeout(function(){ $("[value='Collect Your Winnings - 5,900 NP']").click();},wait);
    }
    if (document.body.innerHTML.indexOf('Küsse den Mortog') != -1){
        if (document.body.innerHTML.indexOf('Wenigstens hast du nur 50 Neopunkte verloren!') != -1){
            setTimeout(function(){ $("[value='Versuchs Nochmal...']").click();},wait);
        }
        if (document.body.innerHTML.indexOf('Du hast bis jetzt <b>100 NP</b>...') != -1){
            setTimeout(function(){ $("[value='Weitermachen']").click();},wait);
        }
        if (document.body.innerHTML.indexOf('Du hast bis jetzt <b>300 NP</b>...') != -1){
            setTimeout(function(){ $("[value='Weitermachen']").click();},wait);
        }
        if (document.body.innerHTML.indexOf('Du hast bis jetzt <b>1.150 NP</b>...') != -1){
            setTimeout(function(){ $("[value='Weitermachen']").click();},wait);
        }
        if (document.body.innerHTML.indexOf('Du hast bis jetzt <b>5.900 NP</b>...') != -1){
            setTimeout(function(){ $("[value='Hol deine Gewinne - 5.900 NP']").click();},wait);
        }
    }
}