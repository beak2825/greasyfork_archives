// ==UserScript==
// @name         Anti-Entropy VN scroll fix
// @namespace    http://tampermonkey.net/
// @version      0.21
// @description  fixes the scrolling for the Anti-Entropy visual novel
// @author       Kur0
// @match        https://zklm.github.io/honkai-vn-antientropy/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.io
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443106/Anti-Entropy%20VN%20scroll%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/443106/Anti-Entropy%20VN%20scroll%20fix.meta.js
// ==/UserScript==
GM_addStyle ( `
::-webkit-scrollbar {
    display: none;
}
` );

function loop(){
var parent = document.querySelector("#all > div.galgame-content > div.dialog.dialog_article > div.dialog-padding > div");
var child = document.querySelector("#all > div.galgame-content > div.dialog.dialog_article > div.dialog-padding > div > div");
var overflow = document.querySelector(".dialog-overflow");
if (typeof(child) != 'undefined' && child != null)
{
//console.log(`parent height: ${parent.scrollHeight}\nchild height: ${child.scrollHeight}`)
if (child.scrollHeight > parent.scrollHeight){
child.style.height = 'inherit';
}else{
child.style.height = 'auto';
}

child.style.overflowY = 'visible'
}

if (typeof(overflow) != 'undefined' && overflow != null)
{
    overflow.style.overflowY = 'visible'
}

setTimeout(loop, 250);
}

loop();
