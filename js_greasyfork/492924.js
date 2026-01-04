// ==UserScript==
// @name         A-90
// @namespace    http://tampermonkey.net/
// @version      2024-04-18
// @description  A-90 spawns randomly
// @author       Terraria Tree, KingTortle
// @match        *://*/*
// @icon https://file.garden/ZgYUwIo9YF7EdBbu/stop.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/492924/A-90.user.js
// @updateURL https://update.greasyfork.org/scripts/492924/A-90.meta.js
// ==/UserScript==
setTimeout(()=>{
let chance=0.001;
let cooldown=true;
let start = new Audio('https://file.garden/ZgYUwIo9YF7EdBbu/spawn.ogg');
let jumpscare = new Audio('https://file.garden/ZgYUwIo9YF7EdBbu/jumpscare.ogg');
setInterval(()=>{
if(cooldown&&Math.random()<chance){
[...document.body.getElementsByClassName('ballsack')].forEach(b=>b.remove());
[...document.body.getElementsByClassName('ballsack2')].forEach(b=>b.remove());
clearInterval(globalThis.ll);
clearInterval(globalThis.ll2);
cooldown=false;
chance = 0.001;
let a90 = document.createElement("img");
let stop = document.createElement("img");
let static = document.createElement("img");
a90.className='ballsack'
stop.className='ballsack2'
a90.width=a90.height=stop.width=stop.height=100;
let p=0;
let shift=()=>{p===0?r(a90.width+1,a90.height,p++):p===1?r(a90.width-1,a90.height,p++):p===2?r(a90.width,a90.height-1,p++):p===3?r(a90.width,a90.height+1,p=0):p=0};
stop.src = "https://file.garden/ZgYUwIo9YF7EdBbu/stop.png";
a90.src = "https://file.garden/ZgYUwIo9YF7EdBbu/regular.png";
static.src = "https://file.garden/ZgYUwIo9YF7EdBbu/redded.gif";
static.style.imageRendering=`pixelated`;
static.style.zIndex=`997`;
static.style.position=`absolute`;
static.style.top=scrollY+'px';
static.style.left=scrollX+'px';
static.width=innerWidth;
static.height=innerHeight;
let HESGOINGTOKILLYOU;
o = function(){
    HESGOINGTOKILLYOU = 1;
}
a90.style=`image-rendering: pixelated;z-index: 999;position: absolute;top: ${~~(Math.random()*(innerHeight-a90.height))+scrollY}px; left: ${~~(Math.random()*(innerWidth-a90.width))+scrollX}px;`;
r=(x,y)=>{
    a90.style.imageRendering=`pixelated`;
    a90.style.zIndex=`998`;
    a90.style.position=`absolute`
    a90.style.top=`${(innerHeight/2)-(y / 2)+scrollY}px`;
    a90.style.left=`${(innerWidth/2)-(x / 2)+scrollX}px`
};
start.currentTime = 0;
start.play();
document.body.append(a90);
setTimeout(()=>{
    a90.style=`image-rendering: pixelated;z-index: 998;position: absolute;top: ${(innerHeight/2)-(a90.height / 2)+scrollY}px; left: ${(innerWidth/2)-(a90.width / 2)+scrollX}px;`;
    document.body.append(static);
    document.body.style.overflow='hidden';
    document.body.style.height='100%';
    static.style.filter='sepia(1000000%) hue-rotate(700deg) saturate(2500%) brightness(0%)'
    setTimeout(()=>{
        static.style.filter='sepia(1000000%) hue-rotate(700deg) saturate(2500%) brightness(25%)'
        setTimeout(()=>{
            static.style.filter='sepia(1000000%) hue-rotate(700deg) saturate(2500%) brightness(25%) opacity(75%)'
            setTimeout(()=>{
                static.style.filter='sepia(1000000%) hue-rotate(700deg) saturate(2500%) brightness(50%)'
            }, 116)
        }, 66)
    }, 66)
}, 500)
setTimeout(()=>{
    stop.style=`image-rendering: pixelated;z-index: 999;position: absolute;top: ${(innerHeight/2)-(a90.height / 2)+scrollY}px; left: ${(innerWidth/2)-(a90.width / 2)+scrollX}px;`;
    document.body.append(stop);
    onmousemove=onmousedown=onkeydown=o;
}, 600);
setTimeout(()=>{
    stop.remove();
    ll=setInterval(shift,33);
    ll2=setInterval(()=>{
        a90.style.filter?a90.style.filter='':a90.style.filter='sepia(100%) hue-rotate(300deg) saturate(100000%)'
    },166)
},966)

setTimeout(()=>{
    a90.remove();
    onmousemove=onmousedown=onkeydown=null;
    static.remove();
    setTimeout(()=>{
        start.pause();
        if (HESGOINGTOKILLYOU == 1){
            setTimeout(()=>{
                document.body.append(a90);
                jumpscare.currentTime = 0;
                jumpscare.play();
                document.body.append(static);
                clearInterval(ll);
                setTimeout(()=>{
                    a90.src = "https://file.garden/ZgYUwIo9YF7EdBbu/jumpscare.png";
                    setTimeout(()=>{
                        a90.width = 400;
                        a90.height = 400;
                        setTimeout(()=>{
                            document.body.outerHTML = ''
                        }, 900)
                    }, 33);
                    ll=setInterval(shift,33);

                }, 200)
            }, 83)
        } else {
cooldown=true;
document.body.style.overflow='';
document.body.style.height='';
        }
    }, 100);
},1166)
} else {
chance+=0.00005
}
}, 100)
},500)