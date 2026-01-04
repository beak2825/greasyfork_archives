// ==UserScript==
// @name         AutoClicker(GSRHackZ & Quinn Brittain)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto Clicker for Browsers!!
// @author       thc282 ori:GSRHackZ & Quinn Brittain
// @match        *://*/*
// @grant        none
// @icon         https://image.flaticon.com/icons/svg/99/99188.svg
// @license                  MIT
// @compatible               chrome
// @compatible               firefox
// @compatible               opera
// @compatible               safari
// @downloadURL https://update.greasyfork.org/scripts/446437/AutoClicker%28GSRHackZ%20%20Quinn%20Brittain%29.user.js
// @updateURL https://update.greasyfork.org/scripts/446437/AutoClicker%28GSRHackZ%20%20Quinn%20Brittain%29.meta.js
// ==/UserScript==

let x,y,set,cps=10;

document.addEventListener('keydown',function(evt){
    if(evt.keyCode==77&&evt.altKey){
        if(!set==true){
            set=true;
            let inp=prompt("How many clicks would you like per second? \nRecommended Max : 100,000 cps");
            if(!isNaN(inp)&&inp.trim().length>0){
                if(inp>100000){
                    let check=confirm(`${inp} clicks per second may crash your browser! Are you sure you would like to continue?`)
                    if(check){
                        alert("Ok whatever you say...");
                        console.warn("Idiot...");
                        cps=inp;
                    }
                    else{
                        set=false;
                        alert("Thanks for understanding. Please click Alt + m to try again.")
                    }
                }else if(inp < 0){
                    cps=1
                }else{
                    cps=inp;
                }
            }
            alert(`AutoClick now set to ${cps} cps.\nYou may now press \` to Autoclick. Have fun !!`);

            function AutoClick(){
                if (window.attachEvent) {
                    document.attachEvent("onmousemove", MouseMv);
                } else {
                    document.addEventListener("mousemove", MouseMv, false);
                }
                document.addEventListener('keydown', KeyDown);

                function MouseMv(e) {
                    if (!e) e = window.event;

                    if (typeof e.pageY == 'number') {
                        x = e.pageX;
                        y = e.pageY;
                    } else {
                        x = e.clientX;
                        y = e.clientY;
                    }
                }

                function KeyDown(e) {
                    if (e.type == 'keydown') {
                        var char = e.key
                        if (char == '`' || char == '~') {
                            let autoClick=setTimeout(function(){
                                if(x!==undefined&&y!==undefined&&set==true){
                                    for(let i=0;i<cps;i++){
                                        click(x,y);
                                    }
                                }
                            },1)
                        }
                    }
                }
            }
            setInterval(AutoClick(), 1)
        }
        else{
                alert("Auto Click canceled! Press Alt+M to set again.")
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