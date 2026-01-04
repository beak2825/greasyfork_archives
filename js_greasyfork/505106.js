// ==UserScript==
// @name          KoGaMa Bypass Paste Protection
// @namespace    KoGaMa Bypass Paste Protection
// @version     5.5
// @description  Simple script to disable "paste" event listener.
// @author       Simon
// @match                https://www.kogama.com/*
// @match                https://kogama.com.br/*
// @match                https://friends.kogama.com/*
// @icon         https://cdn.discordapp.com/attachments/1038338241201455175/1038720338814578698/1f8828d0fae79cc99ef6943306e0b2b1.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505106/KoGaMa%20Bypass%20Paste%20Protection.user.js
// @updateURL https://update.greasyfork.org/scripts/505106/KoGaMa%20Bypass%20Paste%20Protection.meta.js
// ==/UserScript==

(function() {
   var allowPaste = function(e){
  e.stopImmediatePropagation();
  return true;
};
document.addEventListener('paste', allowPaste, true);
})();



{setTimeout(() => {
const ConsoleStyle = Object.freeze({
    HEADING: "background-color:#d25858;font-size:70px;font-weight:bold;color:white;",
    NORMAL : "font-size:20px;",
    URGENT : "font-size:25px;font-weight:bold;color:red;"
});

   console.log(`%c Chill, Cowboy! `,    ConsoleStyle.HEADING);
        console.log("%c" + "If someone told you to copy/paste something here, it's likely you're being scammed.",     ConsoleStyle.NORMAL);
        console.log("%c" + "Pasting anything in here could give attackers access to your KoGaMa account.",    ConsoleStyle.URGENT);
        console.log("%c" + "Unless you know exactly what you're doing, close this window and stay safe.",  ConsoleStyle.NORMAL);
        console.log("%c" + "You might want to consider reporting the user who told you to open it.", ConsoleStyle.NORMAL);
}, "1000")
}
    