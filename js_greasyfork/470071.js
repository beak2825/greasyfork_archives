// ==UserScript==
// @name         Ekşi - Avatar ve nick büyüteç
// @namespace    http://tampermonkey.net/
// @version      1
// @description  "avatar ve nickin boyutunu ve font size ını büyütür." En sevdiğiniz gözünüz kör mü oldu ? astigmat dereceniz penis boyunuzu mu geçti ? Sorun değil artık Ekşi - Avatar ve nick büyüteç'i var.
// @author       angusyus
// @include      *eksisozluk*

// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470071/Ek%C5%9Fi%20-%20Avatar%20ve%20nick%20b%C3%BCy%C3%BCte%C3%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/470071/Ek%C5%9Fi%20-%20Avatar%20ve%20nick%20b%C3%BCy%C3%BCte%C3%A7.meta.js
// ==/UserScript==

try {
    var avatars = document.getElementsByClassName("avatar")
    for (let avatar of avatars) {
        avatar.style.width = "80px";
        avatar.style.height = "80px";
    }
} catch {}

try {
    var avatars2 = document.getElementsByClassName("logo avatar")
    for (let avatar of avatars2) {
        avatar.style.width = "160px";
        avatar.style.height = "160px";
    }
} catch {}

try {
    var nicks = document.getElementsByClassName("entry-author")
    for (let nick of nicks) {
        nick.style.setProperty('font-size', '16px', 'important');
    }
} catch {}


