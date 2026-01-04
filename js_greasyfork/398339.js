// ==UserScript==
// @name        Edpuzzle no pause
// @namespace    http://tampermonkey.net/
// @version      4.3
// @description  Useful AFK tools for EdPuzzle
// @author       J
// @match        https://edpuzzle.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398339/Edpuzzle%20no%20pause.user.js
// @updateURL https://update.greasyfork.org/scripts/398339/Edpuzzle%20no%20pause.meta.js
// ==/UserScript==
// ==UserScript==
// @name        Edpuzzle no pause
// @namespace    http://tampermonkey.net/
// @version      4.2
// @description  Useful AFK tools for EdPuzzle
// @author       J
// @match        https://edpuzzle.com/*
// @run-at       document-end
// @grant        none
// ==/UserScript==

//(function() {

var beep=document.createElement("audio");
beep.id="beep";
beep.src="https://www.soundjay.com/button/sounds/beep-01a.mp3";
beep.type="audio/mpeg";
var played = false;

setTimeout(function(){
    window.bx=document.createElement("input");
    bx.type="checkbox";
    window.np=document.createElement("input");
    np.type="checkbox";
    window.ctn=document.createElement("input");
    ctn.type="checkbox";
    window.col=document.createElement("input");
    col.type="checkbox";

    document.getElementsByClassName("PNsDTVSfY4")[0].prepend(bx)
    document.getElementsByClassName("PNsDTVSfY4")[0].prepend("Beep on question? ")
    document.getElementsByClassName("PNsDTVSfY4")[0].prepend(np);
    document.getElementsByClassName("PNsDTVSfY4")[0].prepend("No pause? ");
    document.getElementsByClassName("PNsDTVSfY4")[0].prepend(ctn);
    document.getElementsByClassName("PNsDTVSfY4")[0].prepend("Auto continue? ");
    document.getElementsByClassName("PNsDTVSfY4")[0].prepend(col);
    document.getElementsByClassName("PNsDTVSfY4")[0].prepend("RGB? ");
}, 1500)

setInterval(tick,50);

function tick(){
    //No Pause
    try{
        if(document.getElementsByClassName("_3YDzzvzzXC")[0].ariaLabel=="Play"&&np.checked){
            document.getElementsByClassName("_3YDzzvzzXC")[0].click();
        }
    } catch(e){
        //nobody cares!
    }
    //Auto continue
    try{
        if(document.getElementsByClassName("_3pAlsuWUO9 _33wl7jxuFe")[0].innerText!=="Submit"&&ctn.checked){
            document.getElementsByClassName("_3pAlsuWUO9 _33wl7jxuFe")[0].click();
        }
    } catch(e){
        //nobody cares again!
    }
    //Beep on question
    try{
        if(document.getElementsByClassName("_3pAlsuWUO9 _33wl7jxuFe")[0].innerText=="Submit"&&bx.checked){
            if(!played){
                played=true;
                beep.play();
            }
        } else {
            played=false;
        }
    } catch(e){
        played=false;
    }
}


//rgb background epic
function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
};

var i=0;
function increment(){
    let body=document.getElementsByClassName("_34WJAf9uuS")[0];
    let body2=document.getElementsByClassName("_2FSbw7iFcE")[0];
    let body3=document.getElementsByClassName("_2IHelMmD-6")[0];
    let body4=document.getElementsByClassName("_1V1-texXHy")[0];
    if(col.checked){
        i+=0.01;
        if(i>=1){
            i=0;
        };
        let color=HSVtoRGB(i,1,1);
        //console.log(color);
        body.style.backgroundColor="rgb("+color.r+","+color.g+","+color.b+")";
        body2.style.backgroundColor="rgb("+color.r+","+color.g+","+color.b+")";
        body3.style.backgroundColor="rgb("+color.r+","+color.g+","+color.b+")";
        body4.style.backgroundColor="rgb("+color.r+","+color.g+","+color.b+")";
    } else {
        body.style.backgroundColor="#FFFFFF";
        body2.style.backgroundColor="#FFFFFF";
        body3.style.backgroundColor="#FFFFFF";
        body4.style.backgroundColor="#FFFFFF";
    }
}
setInterval(increment,50)


//})();

//})();