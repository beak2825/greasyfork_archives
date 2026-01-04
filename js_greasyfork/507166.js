// ==UserScript==
// @name         moomoo.io esp
// @description  gives you magical powers
// @version      1
// @author       Wealthy
// @match        *://*.moomoo.io/*
// @grant        none
// @icon         https://moomoo.io/img/animals/cow_1.png
// @namespace https://greasyfork.org/users/1347888
// @downloadURL https://update.greasyfork.org/scripts/507166/moomooio%20esp.user.js
// @updateURL https://update.greasyfork.org/scripts/507166/moomooio%20esp.meta.js
// ==/UserScript==

localStorage.setItem("moofoll", true);

const players = [], animals = [];

const property = "team";

Object.defineProperty(Object.prototype, property, {
    get: function() {
        if(this.isPlayer) {
            const player = players.find(player => player.id === this.id);

            !player && players.push(this);
        } else {
            const animal = animals.find(animal => animal.sid === this.sid && animal.src === this.src);

            !animal && animals.push(this);
        }

        return this[`_${property}`];
    },
    set: function(value) {
        this[`_${property}`] = value;
    },
    configurable: true
});

const check = {
    tribe: (owner, { team, sid }) => (owner.sid !== sid && owner.team && owner.team === team),
    owner: ({ wood, stone, food, points }) => (wood || stone || food || points)
}

let ctx, camX, camY, xOffset, yOffset;

const showHealth = (x, y, health, maxHealth) => {
    const text = `HP:${Math.round(health)}/${maxHealth}`;

    ctx.fillStyle = "#fff";
    ctx.lineJoin = "round";
    ctx.font = "20px Hammersmith One";
    ctx.lineWidth = 6;
    ctx.strokeText(text, x - xOffset, y - yOffset);
    ctx.fillText(text, x - xOffset, y - yOffset);
}

const showLine = (x1, y1, x2,y2, stroke = "black", width = 3) => {
    ctx.lineCap = "round";
    ctx.strokeStyle = stroke;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x1 - xOffset, y1 - yOffset);
    ctx.lineTo(x2 - xOffset, y2 - yOffset);
    ctx.stroke();
}

const getDistance = (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1);
const getDirection = (x1, y1, x2, y2) => Math.atan2(y1 - y2, x1 - x2);

const checked = (name) => document.getElementById(`${name}Box`)?.checked;

let owner, tribe, enemies;

const esp = (delta) => {
    if(!players.length) return;

    if(!ctx) {
        const gameCanvas = document.getElementById("gameCanvas");
        ctx = gameCanvas.getContext("2d");
    }

    if(!ctx) return;

    owner = null;
    tribe = [];
    enemies = [];

    for(let player of players) {
        if(player.visible) {
            if(check.owner(player)) {
                owner = player;
            } else if(owner && check.tribe(owner, player)) {
                tribe.push(player);
            } else enemies.push(player);
        }
    }

    if(!owner) return;

    let tmpDist = getDistance(camX, camY, owner.x, owner.y);
    let tmpDir = getDirection(owner.x, owner.y, camX, camY);
    let camSpd = Math.min(tmpDist * 0.01 * delta, tmpDist);

    if (tmpDist > 0.05) {
        camX += camSpd * Math.cos(tmpDir);
        camY += camSpd * Math.sin(tmpDir);
    } else {
        camX = owner.x;
        camY = owner.y;
    }

    xOffset = camX - (1920 / 2);
    yOffset = camY - (1080 / 2);

    if(checked("health")) {
        showHealth(owner.x, owner.y + owner.scale + 66.5, owner.health, owner.maxHealth);

        for(let animal of animals) animal.visible && showHealth(animal.x, animal.y + animal.scale + 66.5, animal.health, animal.maxHealth);
        for(let enemy of enemies) showHealth(enemy.x, enemy.y + enemy.scale + 66.5, enemy.health, enemy.maxHealth);
    }

    if(checked("animal")) for(let animal of animals) animal.visible && showLine(owner.x, owner.y, animal.x, animal.y, "#221abf");
    if(checked("enemy")) for(let enemy of enemies) showLine(owner.x, owner.y, enemy.x, enemy.y, "#000000");
}

let lastUpdate;

const frame = () => {
    requestAnimationFrame(frame);

    let delta = Date.now() - lastUpdate;
    lastUpdate = Date.now();

    esp(delta);
}

frame()

let html = document.createElement("div");
html.innerHTML = `<div class=modal id=simpleModal><div class=modal-content><div class=modal-header><span class=closeBtn>×</span><h2 style=font-size:17px>Settings</h2></div><div class=modal-body style=font-size:15px><div class=flexControl><label class=container>Enemy Radar <input id=enemyBox type=checkbox> <span class=checkmark></span></label> <label class=container>Animal Radar <input id=animalBox type=checkbox> <span class=checkmark></span></label> <label class=container>Show HP <input id=healthBox type=checkbox> <span class=checkmark></span></label></div></div><div class=modal-footer></div></div></div>`
document.body.appendChild(html);

let style = document.createElement("style");
style.type = "text/css";
style.appendChild(document.createTextNode(`.keyPressLow,.menuPrompt{color:#4a4a4a;text-align:center}.keyPressLow{margin-left:8px;font-size:16px;margin-right:8px;height:25px;width:50px;background-color:#fcfcfc;border-radius:3.5px;border:.5px solid #f2f2f2}.menuPrompt{font-size:17px;font-family:"Hammersmith One";flex:0.2;margin-top:10px;display:inline-block}.modal{display:none;position:fixed;z-index:1;left:0;top:0;overflow:auto;height:100%;width:100%}.container,.container input:checked~.checkmark:after{display:block}.modal-content{margin:10% auto;width:40%;box-shadow:0 5px 8px 0 rgba(0,0,0,.2),0 7px 20px 0 rgba(0,0,0,.17);font-size:14px;line-height:1.6}.modal-footer h3,.modal-header h2{margin:0}.modal-header{background:#000;padding:15px;color:#fff;border-top-left-radius:5px;border-top-right-radius:5px}.modal-body{padding:10px 20px;background:#fff}.modal-footer{background:#000;padding:10px;color:#fff;text-align:center;border-bottom-left-radius:5px;border-bottom-right-radius:5px}.closeBtn{float:right;font-size:30px;color:red}.closeBtn:focus,.closeBtn:hover{color:#000;text-decoration:none;cursor:pointer}.container{position:relative;padding-left:35px;margin-bottom:12px;cursor:pointer;font-size:16px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.container input{position:absolute;opacity:0;cursor:pointer;height:0;width:0}.checkmark{position:absolute;top:0;left:0;height:25px;width:25px;background-color:#000}.container:hover input~.checkmark{background-color:#ccc}.container input:checked~.checkmark{background-color:#000}.checkmark:after{content:"";position:absolute;display:none}.container .checkmark:after{left:9px;top:5px;width:5px;height:10px;border:solid #fff;border-width:0 3px 3px 0;-webkit-transform:rotate(45deg);-ms-transform:rotate(45deg);transform:rotate(45deg)}`))
document.head.appendChild(style);

document.addEventListener("keydown", function(e) {
    if ([113, 27].includes(e.keyCode)){
        if (modal.style.display === "none") {
            modal.style.display = "block";
        } else modal.style.display = "none";
    }
});

let modal = document.getElementById("simpleModal");
let closeBtn = document.getElementsByClassName("closeBtn")[0];

closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

window.addEventListener("click", (event) => {
    if(event.target == modal) modal.style.display = "none";
});
