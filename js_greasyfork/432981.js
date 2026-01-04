// ==UserScript==
// @name         csgoclicker.net custom chat font
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  changes the font you type in chat
// @author       sdoma
// @match        https://csgoclicker.net/*
// @icon         https://lh3.googleusercontent.com/ogw/ADea4I6J5Me0wfUtMT4o6e5nHVaKyCFzVxsp1eT2aVxkWw=s83-c-mo
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432981/csgoclickernet%20custom%20chat%20font.user.js
// @updateURL https://update.greasyfork.org/scripts/432981/csgoclickernet%20custom%20chat%20font.meta.js
// ==/UserScript==
(function() {
    'use strict';
    // Add Another key-value pair in the object below if you want to replace a different expression/character
     var characterreplacementobject = {
         "A": "𝘼",
         "B": "𝘽",
         "C": "𝘾",
         "D": "𝘿",
         "E": "𝙀",
         "F": "𝙁",
         "G": "𝙂",
         "H": "𝙃",
         "I": "𝙄",
         "J": "𝙅",
         "K": "𝙆",
         "L": "𝙇",
         "M": "𝙈",
         "N": "𝙉",
         "O": "𝙊",
         "P": "𝙋",
         "Q": "𝙌",
         "R": "𝙍",
         "S": "𝙎",
         "T": "𝙏",
         "U": "𝙐",
         "V": "𝙑",
         "W": "𝙒",
         "X": "𝙓",
         "Y": "𝙔",
         "Z": "𝙕",
         "a": "𝗮",
         "b": "𝗯",
         "c": "𝗰",
         "d": "𝗱",
         "e": "𝗲",
         "f": "𝗳",
         "g": "𝗴",
         "h": "𝗵",
         "i": "𝗶",
         "j": "𝗷",
         "k": "𝗸",
         "l": "𝗹",
         "m": "𝗺",
         "n": "𝗻",
         "o": "𝗼",
         "p": "𝗽",
         "q": "𝗾",
         "r": "𝗿",
         "s": "𝘀",
         "t": "𝘁",
         "u": "𝘂",
         "v": "𝘃",
         "w": "𝘄",
         "x": "𝘅",
         "y": "𝘆",
         "z": "𝘇"
     }
     var addedchatinputlistener = false
     var attachchatlistener = setInterval(function() {
         var chatinput = document.querySelector("#chatInput")
         if (chatinput.getAttribute('listening') !== null) return clearInterval(attachchatlistener); console.log('Attached listener successfullly.')
         chatinput.addEventListener("input", () => {
             var chatinput = document.querySelector("#chatInput")
             var chatvalarray = document.querySelector("#chatInput").value.split('')
             var inputtospecial = chatvalarray.reduce(function (accumulator, currentValue) {
                 if (Object.keys(characterreplacementobject).find(item => item === currentValue)) {
                     accumulator += characterreplacementobject[currentValue]
                     return accumulator
                 } else {
                     accumulator += currentValue
                     return accumulator
                 }
             }, "")
             document.querySelector("#chatInput").value = inputtospecial
         })
         console.log('Attempted to attach listener.')
         chatinput.setAttribute('listening', true)
     }, 1000)
})();