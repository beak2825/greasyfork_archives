// ==UserScript==
// @name         Meme Tray
// @icon         https://i.imgur.com/bVawMh1.png
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  Add custom images to smilies tray
// @author       oh
// @match        *www.ignboards.com/forums/*
// @match        *www.ignboards.com/threads/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403212/Meme%20Tray.user.js
// @updateURL https://update.greasyfork.org/scripts/403212/Meme%20Tray.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //Add/Remove images to array here
    var images = [
        'https://cdn.discordapp.com/emojis/648264600466358284.png',
        'https://cdn.discordapp.com/emojis/701437557564506134.png',
        'https://cdn.discordapp.com/emojis/644005343105646615.png',
        'https://cdn.discordapp.com/emojis/659109406507532288.png',
        'https://cdn.discordapp.com/emojis/524058861519503360.png',
        'https://cdn.discordapp.com/emojis/508027293323755531.png',
        'https://cdn.discordapp.com/emojis/436389505625227274.png',
        'https://cdn.discordapp.com/emojis/254536132488855552.png',
        'https://cdn.discordapp.com/emojis/436854914531065866.png',
        'https://cdn.discordapp.com/emojis/589223415735648316.png',
        'https://cdn.discordapp.com/emojis/524070538776150027.png',
        'https://i.kym-cdn.com/photos/images/newsfeed/001/564/945/0cd.png',
        'https://cdn.discordapp.com/emojis/524089449039003668.png',
        'https://cdn.discordapp.com/emojis/589225358625341440.png',
        'https://i.imgur.com/UiS4Au0.jpg',
        'https://i.imgur.com/4Q7Y4jC.jpg',
        'https://i.imgur.com/BKFm2Tb.png',
        'https://i.imgur.com/7HalIG2.jpg',
        'https://i.imgur.com/jvn6U0W.png',
        'https://i.imgur.com/nA61zaL.png',
        'https://cdn.discordapp.com/emojis/433472219495006208.png',
        'https://i.imgur.com/ZU014ft.gif',
        'https://cdn.discordapp.com/emojis/524073297152049152.png',
        'https://i.imgur.com/P8omwja.gif'
    ]

    var tray_made = 0;

    function make_tray(){
        if (tray_made == 0) {

            function insert_img(a){
                var list2 = document.getElementsByClassName('fr-element fr-view')
                list2[0].childNodes[0].innerHTML += a.innerHTML
            }

            var list = document.getElementsByClassName('menu-row js-recentBlock')
            var t_header = document.createElement('h3')

            t_header.className = 'menu-header'
            t_header.innerText = 'Memes'
            list[0].parentNode.insertBefore(t_header, list[0].nextSibling)

            var tray = document.createElement('div')
            tray.className = 'menu-row'

            var tray_loc = list[0].nextSibling
            tray_loc.parentNode.insertBefore(tray, tray_loc.nextSibling)

            var ul = document.createElement('ul')
            ul.className = 'emojiList js-emojiList'

            var x;

            for( x = 0; x < images.length; x++){
                (function(x){
                    var li = document.createElement('li')
                    var a = document.createElement('a')
                    a.className = 'js-emoji'
                    a.innerHTML = '<img src="'+images[x]+'">'
                    a.addEventListener('click', function(){insert_img(a);})
                    li.appendChild(a)
                    ul.appendChild(li)
                }(x))

            }

            tray.appendChild(ul)
            tray_made += 1

        }
    }
 var delay = 2000;

 function smlisten(){
      setTimeout( function() {
      document.getElementById('xfSmilie-1').addEventListener ('click', function() {make_tray();});
     }, delay);

 }
 if(document.getElementById('xfSmilie-1') == null) {
   document.getElementsByClassName('js-prefixContainer')[0].addEventListener('click', function() {smlisten();})
 } else{
   document.getElementById('xfSmilie-1').addEventListener ('click', function() {make_tray();})
 }


})();