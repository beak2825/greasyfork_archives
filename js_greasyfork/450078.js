// ==UserScript==
// @name         Super Auto Clicker
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Dominate the web with your auto clicking powers! Install this script and this power is yours! Click Alt+M on a webpage to enable the autoclicker. Press Alt+M again to turn it off. You need this extension to use Super Auto Clicker: https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=en
// @author       Super Coder
// @match        *://*/*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=autoclicker.org
// @license                  MIT
// @grant        GM.registerMenuCommand
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.xmlHttpRequest
// @grant        GM.info
// @downloadURL https://update.greasyfork.org/scripts/450078/Super%20Auto%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/450078/Super%20Auto%20Clicker.meta.js
// ==/UserScript==
 
let x,y,set,cps=10;
 
document.addEventListener('keyup',function(evt){
    if(evt.keyCode==77&&evt.altKey){
        if(!set==true){
            set=true;
            let inp=prompt("Please set your CPS value. Do not include symbols/letters in your response. Recommended Max : 100,000 cps");
            if(!isNaN(inp)&&inp.trim().length>0){
                if(inp>100000){
                    let check=confirm(`${inp} CPS may crash your browser! Are you sure you would like to continue?`)
                    if(check){
                        alert("The CPS value has been set. Please note that this CPS value may crash your browser.");
                        console.warn("Please note that this CPS value may crash your browser.");
                        cps=inp;
                    }
                    else{
                        set=false;
                        alert("Click Alt+M to set the CPS setting again.")
                    }
                }
                else if(inp<1000){
                    cps=1000;
                }
                else{
                    cps=inp;
                }
            }
            alert("You may now click on any point in this tab to lock the autoclicker to it. Click Alt+M to turn off the autoclicker.");
            onmousedown = function(e){
                x=e.clientX;
                y=e.clientY;
            };
            let autoClick=setInterval(function(){
                if(x!==undefined&&y!==undefined&&set==true){
                    for(let i=0;i<cps/1000;i++){
                        click(x,y);
                    }
                }
            },1)}
        else{
            set=false
        }
    }
})
 
 
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
 
 
 