// ==UserScript==
// @name         [BETA] Zelenka Fire
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  hello
// @author       Unito
// @match        *.zelenka.guru/*
// @match        *.lzt.market/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469662/%5BBETA%5D%20Zelenka%20Fire.user.js
// @updateURL https://update.greasyfork.org/scripts/469662/%5BBETA%5D%20Zelenka%20Fire.meta.js
// ==/UserScript==

const account_username = $(".accountUsername span").text()
var rainbow_nick = 'background-image: url(https://media.tenor.com/AnYzIUOQbO0AAAAC/pride-rainbow.gif); -webkit-background-clip: text; -webkit-text-fill-color: transparent;'

function updNicks () {
    Array.from($(".username span")).forEach((item)=>{
        item = $(item)
        if(item.text() == account_username){
            item.removeAttr('class')
            item.attr('style', rainbow_nick)
        }
    })
}

updNicks()

(document).ready(()=>{
    updNicks()
})