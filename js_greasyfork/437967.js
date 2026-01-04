// ==UserScript==
// @name        Sploop.io: Shows CPS and FPS (UPDATED)
// @namespace    -
// @version     0.5
// @description -
// @author      hi
// @match        *://sploop.io/*
// @match        *://zombsroyale.io/*
// @grant        none
// @antifeature tracking
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/437967/Sploopio%3A%20Shows%20CPS%20and%20FPS%20%28UPDATED%29.user.js
// @updateURL https://update.greasyfork.org/scripts/437967/Sploopio%3A%20Shows%20CPS%20and%20FPS%20%28UPDATED%29.meta.js
// ==/UserScript==
var FPS,cps = 0,Mcps = 0,Hue = 0;
(function() {
    var UPDATE_DELAY = 700;
    var lastUpdate = 0;
    var frames = 0;
    function updateCounter() {
        var now = Date.now();
        var elapsed = now - lastUpdate;
        if (elapsed < UPDATE_DELAY) {
            ++frames;
        } else {
            FPS = Math.round(frames / (elapsed / 1000));
            frames = 0;
            lastUpdate = now;
        }
        requestAnimationFrame(updateCounter);
    }
    lastUpdate = Date.now();
    requestAnimationFrame(updateCounter);
})();
document.addEventListener("mousedown", click, false);
document.addEventListener("mouseup", endclick, false);
function click(e) {
    if ((e.button == 0 || 1 || 2) || e.keycode == 32) {
        cps++
        setTimeout(() => {
            cps--
        }, 900);
    }
    if (e.button == 0) { document.getElementById("LeftClick").style.backgroundColor = "white";}
    if (e.button == 2) { document.getElementById("RightClick").style.backgroundColor = "white";}
}
function endclick(e) {
    if (e.button == 0) {document.getElementById("LeftClick").style.backgroundColor = "rgba(0, 0, 0, 0.4)";}
    if (e.button == 2) {document.getElementById("RightClick").style.backgroundColor = "rgba(0, 0, 0, 0.4)";}
}
document.addEventListener('keydown', (e)=>{
    if (e.keyCode == 32) {document.getElementById("SpaceBar").style.backgroundColor = "white";
                         cps++
        setTimeout(() => {
            cps--
        }, 900);}
    if (e.keyCode == 87) {document.getElementById("keyW").style.backgroundColor = "white";}
    if (e.keyCode == 81) {document.getElementById("keyQ").style.backgroundColor = "white";}
    if (e.keyCode == 65) {document.getElementById("keyA").style.backgroundColor = "white";}
    if (e.keyCode == 83) {document.getElementById("keyS").style.backgroundColor = "white";}
    if (e.keyCode == 68) {document.getElementById("keyD").style.backgroundColor = "white";}
})
document.addEventListener('keyup', (e)=>{
    if (e.keyCode == 32) {document.getElementById("SpaceBar").style.backgroundColor = "rgba(0, 0, 0, 0.4)";}
    if (e.keyCode == 87) {document.getElementById("keyW").style.backgroundColor = "rgba(0, 0, 0, 0.4)";}
    if (e.keyCode == 81) {document.getElementById("keyQ").style.backgroundColor = "rgba(0, 0, 0, 0.4)";}
    if (e.keyCode == 65) {document.getElementById("keyA").style.backgroundColor = "rgba(0, 0, 0, 0.4)";}
    if (e.keyCode == 83) {document.getElementById("keyS").style.backgroundColor = "rgba(0, 0, 0, 0.4)";}
    if (e.keyCode == 68) {document.getElementById("keyD").style.backgroundColor = "rgba(0, 0, 0, 0.4)";}
})
setInterval(() => {
    if (cps > Mcps) Mcps = cps
    Hue += Math.random() * .4
    Show.style.color = `hsl(${Hue}, 100%, 70%)`
    Panel.style.color = `hsl(${Hue}, 100%, 70%)`
    Show.innerHTML = `${FPS}FPS<br>${cps}CPS<br>${Mcps}MCPS`
}, 0);
let Show = document.createElement("div");
Show.id = "SHOW"
document.body.prepend(Show);
let Panel = document.createElement("div");
Panel.innerHTML = `
<div id="Panel">
<div id="keyW">W</div>
<div id="keyQ">Q</div>
<div id="keyA">A</div>
<div id="keyS">S</div>
<div id="keyD">D</div>
<div id="LeftClick">LMB</div>
<div id="RightClick">RMB</div>
<div id="SpaceBar">________</div>
</div>
`
document.body.appendChild(Panel)

var styleItem = document.createElement("style");
styleItem.type = "text/css";
styleItem.appendChild(document.createTextNode(`
#SHOW {
    font-size: 18px;
    position: absolute;
    width: 90px;
    height: 75px;
    top:30px;
    left:10px;
    z-index:1000000;
    display: block;
    text-align: center;
    border-radius: 20px;
    background-color: rgba(0, 0, 0, 0.4);
    box-shadow: 0 0 2px #6dd1ff,0 0 0 4px #353535, 0 0 0 5px #3e3e3e, inset 0 0 10px rgba(0, 0, 0, 1), 0 5px 20px rgba(0,0,0,.5), inset 0 0 15px rgba(0,0,0,.2);
}

#Panel {
    position: relative;
    width: 150px;
    height: 180px;
    top: 120px;
    left: 10px;
    z-index: 1000000;
    display: block;
    text-align: center;
}


#keyW {
    position: absolute;
    width: 50px;
    height: 45px;
    top: 0;
    left: 50px;
    background-color: rgba(0, 0, 0, 0.4);
    box-shadow: 0 0 2px #6dd1ff,0 0 0 4px #353535, 0 0 0 5px #3e3e3e, inset 0 0 10px rgba(0, 0, 0, 1), 0 5px 20px rgba(0,0,0,.5), inset 0 0 15px rgba(0,0,0,.2);
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
}

#keyQ {
    position: absolute;
    width: 50px;
    height: 45px;
    top: 0;
    left: 0px;
    background-color: rgba(0, 0, 0, 0.4);
    box-shadow: 0 0 2px #6dd1ff,0 0 0 4px #353535, 0 0 0 5px #3e3e3e, inset 0 0 10px rgba(0, 0, 0, 1), 0 5px 20px rgba(0,0,0,.5), inset 0 0 15px rgba(0,0,0,.2);
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
}

#keyA {
    position: absolute;
    width: 50px;
    height: 45px;
    top: 45px;
    left: 0;
    background-color: rgba(0, 0, 0, 0.4);
    box-shadow: 0 0 2px #6dd1ff,0 0 0 4px #353535, 0 0 0 5px #3e3e3e, inset 0 0 10px rgba(0, 0, 0, 1), 0 5px 20px rgba(0,0,0,.5), inset 0 0 15px rgba(0,0,0,.2);
    border-top-left-radius: 10px;
}

#keyS {
    position: absolute;
    width: 50px;
    height: 45px;
    top: 45px;
    left: 50px;
    background-color: rgba(0, 0, 0, 0.4);
    box-shadow: 0 0 2px #6dd1ff,0 0 0 4px #353535, 0 0 0 5px #3e3e3e, inset 0 0 10px rgba(0, 0, 0, 1), 0 5px 20px rgba(0,0,0,.5), inset 0 0 15px rgba(0,0,0,.2);
}

#keyD {
    position: absolute;
    width: 50px;
    height: 45px;
    top: 45px;
    right: 0;
    background-color: rgba(0, 0, 0, 0.4);
    box-shadow: 0 0 2px #6dd1ff,0 0 0 4px #353535, 0 0 0 5px #3e3e3e, inset 0 0 10px rgba(0, 0, 0, 1), 0 5px 20px rgba(0,0,0,.5), inset 0 0 15px rgba(0,0,0,.2);
    border-top-right-radius: 10px;
}

#LeftClick {
    position: absolute;
    width: 75px;
    height: 45px;
    top: 90px;
    left: 0;
    background-color: rgba(0, 0, 0, 0.4);
    box-shadow: 0 0 2px #6dd1ff,0 0 0 4px #353535, 0 0 0 5px #3e3e3e, inset 0 0 10px rgba(0, 0, 0, 1), 0 5px 20px rgba(0,0,0,.5), inset 0 0 15px rgba(0,0,0,.2);
}

#RightClick {
    position: absolute;
    width: 75px;
    height: 45px;
    top: 90px;
    right: 0;
    background-color: rgba(0, 0, 0, 0.4);
    box-shadow: 0 0 2px #6dd1ff,0 0 0 4px #353535, 0 0 0 5px #3e3e3e, inset 0 0 10px rgba(0, 0, 0, 1), 0 5px 20px rgba(0,0,0,.5), inset 0 0 15px rgba(0,0,0,.2);
}

#SpaceBar {
    position: absolute;
    width: 150px;
    height: 45px;
    bottom: 0;
    left: 0;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    background-color: rgba(0, 0, 0, 0.4);
    box-shadow: 0 0 2px #6dd1ff,0 0 0 4px #353535, 0 0 0 5px #3e3e3e, inset 0 0 10px rgba(0, 0, 0, 1), 0 5px 20px rgba(0,0,0,.5), inset 0 0 15px rgba(0,0,0,.2);
}

`))
document.head.appendChild(styleItem);
document.getElementById("SHOW").addEventListener('mousedown', function (e) {

    let prevX = e.clientX;
    let prevY = e.clientY;

    window.addEventListener('mousemove', mousemove);
    window.addEventListener('mouseup', mouseup);
    function mousemove(e) {
        let newX = prevX - e.clientX;
        let newY = prevY - e.clientY;


        const rect = document.getElementById("SHOW").getBoundingClientRect();

        document.getElementById("SHOW").style.left = rect.left - newX + 'px';
        document.getElementById("SHOW").style.top = rect.top - newY + 'px';

        prevX = e.clientX;
        prevY = e.clientY;
    }
    function mouseup() {
        window.removeEventListener('mousemove', mousemove);
        window.removeEventListener('mouseup', mouseup);
    }
});
document.getElementById("Panel").addEventListener('mousedown', function (e) {

    let prevX = e.clientX;
    let prevY = e.clientY;

    window.addEventListener('mousemove', mousemove);
    window.addEventListener('mouseup', mouseup);
    function mousemove(e) {
        let newX = prevX - e.clientX;
        let newY = prevY - e.clientY;


        const rect = document.getElementById("Panel").getBoundingClientRect();

        document.getElementById("Panel").style.left = rect.left - newX + 'px';
        document.getElementById("Panel").style.top = rect.top - newY + 'px';

        prevX = e.clientX;
        prevY = e.clientY;
    }
    function mouseup() {
        window.removeEventListener('mousemove', mousemove);
        window.removeEventListener('mouseup', mouseup);
    }
});