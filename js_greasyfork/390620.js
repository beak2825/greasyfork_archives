// ==UserScript==
// @name         bypass
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  shows how to use coffeescript compiler
// @author       You
// @match        http://agario.tv
// @match        http://agar.tv
// @name           Site - CoffeeScript
// @description    CoffeeScript script
// @author         Benjamin
// @namespace      http://spiralx.org/
// @icon           http://tampermonkey.net/favicon.ico
// @match          <$URL$>
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/390620/bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/390620/bypass.meta.js
// ==/UserScript==
 
const chat = document.querySelector("#chat_textbox");
var swears2 = [
    "hitler",
    "fuck",
    "io",
    "com",
    "pussy",
    "bitch",
    "gay",
    "nigger",
    "fag",
    "cunt",
    "cock",
    "dick",
    "shit",
    "porn",
    "isis",
    "am",
    "got"
];
 
function addTxt(word, chr) {
    let st = "";
    for (let i = 0; i < word.length; i++) {
        st += word.charAt(i) + chr;
    }
    return st;
}
 
function bypass(str) {
    try {
        str = str.split(" ");
    } catch (e) {
 
    }
    var chr = "\u200B";
 
    var empt = "";
    str.forEach(word => {
        for (let i = 0; i < swears2.length; i++) {
            const swear = swears2[i];
            if (word.toLowerCase().indexOf(swear.toLowerCase()) !== -1) {
                empt += addTxt(word, chr) + " ";
                return;
            }
        }
        empt += word + " ";
 
    })
    return empt;
}
 
// Chat stuff
chat.setAttribute('maxlength', 999999);
window.alert = function () {
    return null;
}
chat.addEventListener("keypress", function (ev) {
    console.log("Bypassing");
    if (ev.key == " ") {
        const val = bypass(chat.value);
        chat.value = val.substr(0, val.length - 1);
        return;
    }
})