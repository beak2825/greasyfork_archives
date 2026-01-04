// ==UserScript==
// @name         Alpine Hack Menu
// @namespace    ae86
// @version      1
// @description  ad block & big shop & background
// @author       Alpine A110
// @match       https://sploop.io
// @icon        https://cdn.create.vista.com/api/media/medium/198498842/stock-photo-purple-spiritual-smoke-black-background?token=
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444393/Alpine%20Hack%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/444393/Alpine%20Hack%20Menu.meta.js
// ==/UserScript==
//SUB TO ALPINE IS LEGIT

//better shop
var trans = document.getElementById('hat-menu');
trans.style.opacity = "0.9";
trans.style.filter = 'alpha(opacity=90)';
trans.style.width = "500px"
trans.style.height = "700px"
window.alert = function() {};
//better shop

document.getElementById("homepage").style.backgroundImage = "url('https://media.discordapp.net/attachments/946130464211628032/962697597494120478/standard.gif')";//link for bacground

//adblock
document.getElementById('game-right-main').style = "display:none;"
document.getElementById('logo').style = "display:none;"
document.getElementById('da-bottom').style = "display:none;"
document.getElementById('bottom-content').style = "display:none;"
document.getElementById('da-left').style = "display:none;"
document.getElementById('game-left-main').style = "display:none;"
document.getElementById('left-content').style = "display:none;"
document.getElementById('alsoTryLink').style = "display:none;"
document.getElementById('right-content').style = "display:none;"
document.getElementById('cross-promo').style = "display:none;"
document.getElementById('google_play').style = "display:none;"
document.getElementById('iogames').style = "display:none;"
//adblock