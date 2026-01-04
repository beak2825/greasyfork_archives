// ==UserScript==
// @name         Auto Clicker
// @namespace    https://greasyfork.org/en/users/988790
// @version      1.6
// @description  Auto Clicker for Browsers!!
// @author       pixxy
// @match        *://*/*
// @grant        none
// @icon         https://image.flaticon.com/icons/svg/99/99188.svg
// @compatible               chrome
// @compatible               firefox
// @compatible               opera
// @compatible               safari
// @downloadURL https://update.greasyfork.org/scripts/455959/Auto%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/455959/Auto%20Clicker.meta.js
// ==/UserScript==

let x,y,set,cps=10;

document.addEventListener('keyup',function(evt){
    if(evt.keyCode==77&&evt.altKey){
        if(!set==true){
            set=true;
            let inp=prompt("How many clicks would you like per second? Recommended Max : 100,000 cps");
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
                        alert("Thanks for understanding. Please click ctrl + m to try again.")
                    }
                }
                else if(inp<1000){
                    cps=1000;
                }
                else{
                    cps=inp;
                }
            }
            alert("You may now click on any point in this tab to set the autoclicker to it. Have fun !!");
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


