// ==UserScript==a
// @name         </> Kurt & Java Değiştirilebilir Otomatik Mesaj
// @namespace    http://tampermonkey.net/
// @version      12.1
// @description  + İle Çalışır
// @author       Kurt
// @match        zombs.io
// @grant        Ryan Wolf
// @downloadURL https://update.greasyfork.org/scripts/424133/%3C%3E%20Kurt%20%20Java%20De%C4%9Fi%C5%9Ftirilebilir%20Otomatik%20Mesaj.user.js
// @updateURL https://update.greasyfork.org/scripts/424133/%3C%3E%20Kurt%20%20Java%20De%C4%9Fi%C5%9Ftirilebilir%20Otomatik%20Mesaj.meta.js
// ==/UserScript==

// Buradan Değiştirebilirsiniz
addEventListener('keydown', function(e){
    if(e.key == "+"){
Game.currentGame.network.sendRpc({ name: "SendChatMessage", channel: "Local", message: "TC Team Geldi Yatın Aşşa Orospu Evlatları" })
        }
    if(e.key == "+"){
Game.currentGame.network.sendRpc({ name: "SendChatMessage", channel: "Local", message: "TC Team Geldi Yatın Aşşa Orospu Evlatları" })
console.log('invisable')
    }
})// Kurt