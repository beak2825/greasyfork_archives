// ==UserScript==
// @name Back to Top | KinoGo
// @namespace -
// @version 0.2
// @description creates "back to top" button.
// @author NotYou
// @match *kinogo.la/*
// @match *kinogoo.by/*
// @match *kinogo.biz/*
// @match *kinogo.film/*
// @match *kinogo.name/*
// @match *kinogo.cx/*
// @match *kinogo.zone/*
// @match *kinogo2.zone/*
// @match *kinogo-film.xyz/*
// @match *kinogo.eu/*
// @match *kinogo.cc/*
// @match *kinogoo.cc/*
// @match *kinogo.appspot.com/*
// @run-at document-body
// @require https://code.jquery.com/jquery-3.3.1.min.js
// @license GPL-3.0-or-later
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/440413/Back%20to%20Top%20%7C%20KinoGo.user.js
// @updateURL https://update.greasyfork.org/scripts/440413/Back%20to%20Top%20%7C%20KinoGo.meta.js
// ==/UserScript==

/*

﹀ Change Log ﹀

0.2 Version:
- Better Animations

*/

// HTML + CSS //
$("body").append(`
<style>
#backtotop {
background: rgb(36, 36, 36) none repeat scroll 0% 0%;
outline: rgb(17, 17, 17) solid 1px;
border: 1px solid rgb(64, 64, 64);
padding: 10px 14px;
text-decoration: none;
margin-left: 4px;
cursor: pointer;
color: silver;
position: fixed;
left: 88%;
top: 90%;
border-radius: 8px;
transition: 300ms;
z-index: 999;
}
#backtotop:hover {
color: silver;
background-color: rgb(56, 56, 56);
}
#backtotop::after {
content: "▲";
}
</style>
<span id="backtotop"></span>
`);

// jQuery + JavaScript //

$('#backtotop').css('opacity','0')

document.getElementById('backtotop').addEventListener("click", function(){
    document.body.scrollIntoView({behavior: "smooth", block: "start", inline: "start"});
});

var scrollCheck = 0;
$(window).scroll(function(event){
   var cheker = $(this).scrollTop();
   if (cheker > scrollCheck){
       $('#backtotop').css('opacity','1')
   } else {
       $('#backtotop').css('opacity','0')
   }
});


















