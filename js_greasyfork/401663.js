// ==UserScript==
// @name         TWShortcuts+
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Custom TW shortcuts
// @author       manko
// @require      https://craig.global.ssl.fastly.net/js/mousetrap/mousetrap.min.js?a4098
// @include      https://pt*.tribalwars.com.pt/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401663/TWShortcuts%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/401663/TWShortcuts%2B.meta.js
// ==/UserScript==

//reports
Mousetrap.bind('r', function(){window.location.href = 'https://pt72.tribalwars.com.pt/game.php?village=*&screen=report';})

//tribe
Mousetrap.bind('t', function(){window.location.href = 'https://pt72.tribalwars.com.pt/game.php?village=*&screen=forum';})

//farm assistant
Mousetrap.bind('f', function(){window.location.href = 'https://pt72.tribalwars.com.pt/game.php?village=*&screen=am_farm';})

//barracks
Mousetrap.bind('q', function(){window.location.href = 'https://pt72.tribalwars.com.pt/game.php?village=*&screen=barracks';})

//stable
Mousetrap.bind('e', function(){window.location.href = 'https://pt72.tribalwars.com.pt/game.php?village=*&screen=stable';})

//main building
Mousetrap.bind('x', function(){window.location.href = 'https://pt72.tribalwars.com.pt/game.php?village=*&screen=main';})

//Rally Point
Mousetrap.bind('p', function (){window.location.href = 'https://pt72.tribalwars.com.pt/game.php?village=*&screen=place';})