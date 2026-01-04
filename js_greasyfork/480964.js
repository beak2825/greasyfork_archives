// ==UserScript==
// @name        Smartschoolfunny
// @namespace   Violentmonkey Scripts
// @match       *://*.smartschool.be/*
// @grant       none
// @version     1.0
// @author      Deckorten
// @description 28/11/2023, 18:03:59
// @downloadURL https://update.greasyfork.org/scripts/480964/Smartschoolfunny.user.js
// @updateURL https://update.greasyfork.org/scripts/480964/Smartschoolfunny.meta.js
// ==/UserScript==

const pictures = ["https://static.tnn.in/thumb/msid-103559760,thumbsize-1705823,width-1280,height-720,resizemode-75/103559760.jpg",
                  "https://media.tenor.com/9glrQrHmKR8AAAAC/hog-rider-coc.gif",
                  "https://s5.gifyu.com/images/SRY6K.gif",
                  "https://preview.redd.it/br8t6it68l171.jpg?auto=webp&s=98c66683d272f94e20819a3693e0ba2b7cee07d6",
                  "https://staticg.sportskeeda.com/editor/2022/10/f39fe-16648863556544-1920.jpg"];

document.querySelector(".js-hero-image").innerHTML = `<img style='max-width: 1040px; min-height:100%' src='${pictures[Math.floor(Math.random()*pictures.length)]}' />`;