// ==UserScript==
// @name         fast buy
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  blooket click
// @author       me
// @match        *://*/*
// @grant        none
// @icon         none
// @license                  MIT
// @downloadURL https://update.greasyfork.org/scripts/440987/fast%20buy.user.js
// @updateURL https://update.greasyfork.org/scripts/440987/fast%20buy.meta.js
// ==/UserScript==

document.addEventListener('keyup',function(evt){
    if(evt.keyCode==67){ click(540,180)
                         click(570,320);
    }});
document.addEventListener('keyup',function(evt){
    if(evt.keyCode==68){ click(700,180)
                         click(570,320);
    }});
document.addEventListener('keyup',function(evt){
    if(evt.keyCode==69){ click(880,180)
                         click(570,320);
    }});

function click(x, y){
    let ev = new MouseEvent('click', {
        'view': window,
        'bubbles': true,
        'cancelable': true,
        'screenX': x,
        'screenY': y
    });

    let el = document.elementFromPoint(x, y);
    el.dispatchEvent(ev);
}
