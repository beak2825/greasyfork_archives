// ==UserScript==
// @name         Sploop.io - KeyStroks, Hats, No grids, Better shop
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  random desc
// @author       You
// @match        *://sploop.io/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457061/Sploopio%20-%20KeyStroks%2C%20Hats%2C%20No%20grids%2C%20Better%20shop.user.js
// @updateURL https://update.greasyfork.org/scripts/457061/Sploopio%20-%20KeyStroks%2C%20Hats%2C%20No%20grids%2C%20Better%20shop.meta.js
// ==/UserScript==

var transformhatshop = document.getElementById('hat-menu');
transformhatshop.style.width = "500px";
transformhatshop.style.height = "500px";

document.getElementById("homepage").style.backgroundImage = "url('https://klike.net/uploads/posts/2019-11/1574605225_2.jpg')"

document.getElementById('lostworld-io_300x250_1').remove();
document.getElementById('lostworld-io_300x250_2').remove();
document.getElementById('lostworld-io_970x250').remove();

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
    if (e.keyCode == 82) {document.getElementById("keyR").style.backgroundColor = "white";}
    if (e.keyCode == 70) {document.getElementById("keyF").style.backgroundColor = "white";}
    if (e.keyCode == 69 && document.activeElement.tagName !== "INPUT") {
    if ($("#keyE").css("backgroundColor") == "rgba(0, 0, 0, 0.4)") {
        $("#keyE").css("backgroundColor", "white");
    } else {
        $("#keyE").css("backgroundColor", "rgba(0, 0, 0, 0.4)");
    }
    }
    if (e.keyCode == 81) {document.getElementById("keyQ").style.backgroundColor = "white";}
    if (e.keyCode == 65) {document.getElementById("keyA").style.backgroundColor = "white";}
    if (e.keyCode == 83) {document.getElementById("keyS").style.backgroundColor = "white";}
    if (e.keyCode == 68) {document.getElementById("keyD").style.backgroundColor = "white";}
})
document.addEventListener('keyup', (e)=>{
    if (e.keyCode == 32) {document.getElementById("SpaceBar").style.backgroundColor = "rgba(0, 0, 0, 0.4)";}
    if (e.keyCode == 87) {document.getElementById("keyW").style.backgroundColor = "rgba(0, 0, 0, 0.4)";}
    if (e.keyCode == 82) {document.getElementById("keyR").style.backgroundColor = "rgba(0, 0, 0, 0.4)";}
    if (e.keyCode == 70) {document.getElementById("keyF").style.backgroundColor = "rgba(0, 0, 0, 0.4)";}
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
<div id="keyQ">Q</div>
<div id="keyW">W</div>
<div id="keyR">R</div>
<div id="keyF">F</div>
<div id="keyE">E</div>
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

#keyR {
    position: absolute;
    width: 50px;
    height: 45px;
    top: 0;
    left: 100px;
    background-color: rgba(0, 0, 0, 0.4);
    box-shadow: 0 0 2px #6dd1ff,0 0 0 4px #353535, 0 0 0 5px #3e3e3e, inset 0 0 10px rgba(0, 0, 0, 1), 0 5px 20px rgba(0,0,0,.5), inset 0 0 15px rgba(0,0,0,.2);
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    z-index: -1;
}

#keyF {
    position: absolute;
    width: 50px;
    height: 45px;
    top: 45px;
    left: 154px;
    background-color: rgba(0, 0, 0, 0.4);
    box-shadow: 0 0 2px #6dd1ff,0 0 0 4px #353535, 0 0 0 5px #3e3e3e, inset 0 0 10px rgba(0, 0, 0, 1), 0 5px 20px rgba(0,0,0,.5), inset 0 0 15px rgba(0,0,0,.2);
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    z-index: -1;
}

#keyE {
    position: absolute;
    width: 50px;
    height: 45px;
    top: 0;
    left: 150px;
    background-color: rgba(0, 0, 0, 0.4);
    box-shadow: 0 0 2px #6dd1ff,0 0 0 4px #353535, 0 0 0 5px #3e3e3e, inset 0 0 10px rgba(0, 0, 0, 1), 0 5px 20px rgba(0,0,0,.5), inset 0 0 15px rgba(0,0,0,.2);
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
    z-index: -1;
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

document.getElementById('hat-menu').style.background = "rgba(0,0,0,0)"
document.getElementById("hat_menu_content").style.background = "rgba(0,0,0,0)"
var styleItem1 = document.createElement("style");
styleItem1.type = "text/css";
styleItem1.appendChild(document.createTextNode(`
.green-button {
	background-color: rgba(0, 0, 0, 0.5);
	box-shadow:none;
}
.green-button:hover {
	background-color: rgba(0, 0, 0);
	box-shadow:none;
}
.menu .content .menu-item {
	border-bottom: none;
}
#hat-menu {
	border: none;
	opacity: 0.9;
}
.header {
  opacity: 0.4;
}
.description {
  opacity: 0.4;
}
`))
document.head.appendChild(styleItem1);

setInterval(() => {
    if (cps > Mcps) Mcps = cps
    Hue += Math.random() * .4
  var styleItem1 = document.createElement("style");
  styleItem1.type = "text/css";
  styleItem1.appendChild(document.createTextNode(`
#hat-menu .green-button {
  color: hsl(${Hue}, 100%, 70%);
}
`))
})

    const HATS = {
        BUSH_HAT: 0,
        BERSERKER: 1,
        JUNGLE_GEAR: 2,
        CRYSTAL_GEAR: 3,
        SPIKE_GEAR: 4,
        IMMUNITY_GEAR: 5,
        BOOST_HAT: 6,
        APPLE_HAT: 7,
        SCUBA_GEAR: 8,
        HOOD: 9,
        DEMOLIST: 10
    };

    const KEYBINDS = {
        [HATS.BUSH_HAT]: "",
        [HATS.BERSERKER]: "KeyG",
        [HATS.JUNGLE_GEAR]: "",
        [HATS.CRYSTAL_GEAR]: "KeyT",
        [HATS.SPIKE_GEAR]: "KeyJ",
        [HATS.IMMUNITY_GEAR]: "Semicolon",
        [HATS.BOOST_HAT]: "KeyM",
        [HATS.APPLE_HAT]: "",
        [HATS.SCUBA_GEAR]: "KeyK",
        [HATS.HOOD]: "KeyY",
        [HATS.DEMOLIST]: "KeyV"
    };

    // HAT EQUIP LOGIC GOES BELOW



    const log = console.log;
    const storage = {
        get(key) {
            const value = localStorage.getItem(key);
            return value === null ? null : JSON.parse(value);
        },
        set(key, value) {
            localStorage.setItem(key, JSON.stringify(value));
        }
    };

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function isInput() {
        return document.activeElement.tagName === "INPUT";
    }

    function inGame() {
        const homepage = document.querySelector("#homepage");
        return homepage && homepage.style.display !== "flex";
    }

    function canEquip() {
        return !isInput() && inGame();
    }

    function createKeyboardEvent(type, code) {
        return new Proxy(new KeyboardEvent(type), {
            get(target, prop) {
                if (prop === "isTrusted") return true;
                if (prop === "target") return document.body;
                if (prop === "code") return code;
                return target[prop];
            }
        })
    }

    function keypress(code) {
        const keydown = createKeyboardEvent("keydown", code);
        const keyup = createKeyboardEvent("keyup", code);
        window.onkeydown(keydown);
        window.onkeyup(keyup);
    }

    function mouseup(target) {
        target.onmouseup(new Proxy(new MouseEvent("mouseup"), {
            get(target, prop) {
                if (prop === "isTrusted") return true;
                if (prop === "target") return target;
                return target[prop];
            }
        }));
    }

    let equipToggle = false;
    async function equipHat(index) {
        if (!canEquip() || equipToggle) return;
        equipToggle = true;

        const hatActionButton = document.querySelectorAll(".hat_action_button")[index];
        if (!hatActionButton) throw new Error("Failed to find hat with index: " + index);

        const keybinds = storage.get("keybinds");
        const OpenShopKey = keybinds && keybinds[18] || "KeyN";

        keypress(OpenShopKey);
        await sleep(150);
        if (hatActionButton.textContent === "BUY") {
            mouseup(hatActionButton);
        }
        mouseup(hatActionButton);
        await sleep(150);
        keypress(OpenShopKey);

        await sleep(1500);
        equipToggle = false;
    }

    window.addEventListener("keydown", function(event) {
        if (event.repeat) return;

        for (const key in KEYBINDS) {
            if (event.code === KEYBINDS[key]) {
                equipHat(key);
                break;
            }
        }
    })

            const grids = document.querySelector("#grid-toggle");
setInterval(() => {
            if (grids.checked){grids.click();}
}, 0);