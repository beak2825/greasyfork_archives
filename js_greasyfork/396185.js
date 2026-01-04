// ==UserScript==
// @name        𝓜ｓｖ🏆 Clan Official Ext
// @namespace    Made by AshZz
// @version      1.0
// @description  Made for 𝓜ｓｖ🏆 Clan by AshZz
// @author       AshZz
// @match        http://tricksplit.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396185/%F0%9D%93%9C%EF%BD%93%EF%BD%96%F0%9F%8F%86%20Clan%20Official%20Ext.user.js
// @updateURL https://update.greasyfork.org/scripts/396185/%F0%9D%93%9C%EF%BD%93%EF%BD%96%F0%9F%8F%86%20Clan%20Official%20Ext.meta.js
// ==/UserScript==
window.onload = function() {

    var ctx = document.getElementById("canvas").getContext("2d")

$("h3").replaceWith('<h3 style="color:orange;">𝓜ｓｖ🏆</h3>');
$("span").replaceWith('<span class="lbTitle" , style="color:orange;">𝓜ｓｖ🏆 Ext</span>')
     var child = document.getElementsByClassName("holder")
$(child).remove("#overlays > div.menu > div:nth-child(2)")
 var mainAd = document.getElementsByClassName("ad")
$(mainAd).remove("#overlays > div.menu > div:nth-child(2) > div.main > div")
     var topAd = document.getElementsByClassName("adLong")
$(topAd).remove("#overlays > div.menu > div.adMiddle > div")
     var adText = document.getElementsByClassName("advText")
$(adText).remove("#overlays > div.menu > div.adMiddle > p")
$(adText).remove("#overlays > div.menu > div:nth-child(2) > div.main > p")
   document.getElementById("nick").placeholder = "Made By AshZz";
var mainColor =document.getElementsByClassName("main")
document.querySelector('.main').style.backgroundColor = '#ffa5007a';
    document.querySelector('.serversPanel').style.backgroundColor = '#ffa5007a';
    document.querySelector('.socialPanel').style.backgroundColor = '#ffa5007a';
    var referralPanel =document.getElementsByClassName('referralPanel')
$(referralPanel).remove("#overlays > div.menu > div:nth-child(3) > div:nth-child(3)")
var mySocials = document.getElementsByClassName('socialPanel');
mySocials[0].innerHTML = '"<a href="https://www.facebook.com/Cellzio-212619392658971/" target="_blank" class="social"><i class="fab fa-facebook-square"></i></a><a href="https://twitter.com/AshZz19" target="_blank" class="social"><i class="fab fa-twitter-square"></i>	</a><a href="https://discord.gg/pNX9xz2" target="_blank" class="social"><i class="fab fa-discord"></i>	</a><a href="/blog" target="_blank" class="social"><i class="fab fa-blogger"></i>	</a>"';

}
