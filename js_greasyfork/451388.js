// ==UserScript==
// @name         (new, Diep.io)Mario kart
// @description  a new game mode that consists of racing with your friends PS:new update will come
// @version      0.1
// @author       tariteur#2358
// @match        *://diep.io/*
// @grant        none
// @require      https://greasyfork.org/scripts/433681-diepapi/code/diepAPI.js?version=1012053
// @namespace
// @namespace https://greasyfork.org/users/870564
// @downloadURL https://update.greasyfork.org/scripts/451388/%28new%2C%20Diepio%29Mario%20kart.user.js
// @updateURL https://update.greasyfork.org/scripts/451388/%28new%2C%20Diepio%29Mario%20kart.meta.js
// ==/UserScript==
//I use diep API by cazka
'use strict';
const { Vector, arenaScaling, player, game, entityManager } = window.diepAPI;
const ctx = document.getElementById('canvas').getContext('2d');
const canvas = document.getElementById('canvas');
const colors = ["#E8B18A", "#E666EA", "#9566EA", "#6690EA", "#E7D063", "#EA6666", "#92EA66", "#808080"];
////////////////////rose////////violet/////bleu///////jaune//////rouge//////vert///////bleu clair//gris////
const textShadow = 'text-shadow:black 0.18vh 0, black -0.18vh 0, black 0 -0.18vh, black 0 0.18vh, black 0.18vh 0.18vh, black -0.18vh 0.18vh, black 0.18vh -0.18vh, black -0.18vh -0.18vh, black 0.09vh 0.18vh, black -0.09vh 0.18vh, black 0.09vh -0.18vh, black -0.09vh -0.18vh, black 0.18vh 0.09vh, black -0.18vh 0.09vh, black 0.18vh -0.09vh, black -0.18vh -0.09vh'
let coords1;
let coords2;
var timerON = false;
var trial = 0;
var Color;

  const html = `
<body>
<label for="color-select">Choose a color:</label>

  <select id="color-select" onchange="colourFunction()">
    <option value="">--choose an color--</option>
    <option class="pink" value="pink">Pink</option>
    <option class="purple" value="purple">Purple</option>
    <option class="blue" value="blue">Blue</option>
    <option class="yellow" value="yellow">Yellow</option>
    <option class="red" value="red">Red</option>
    <option class="green" value="green">Green</option>
    <option class="gray" value="gray">Gray</option>
  </select>
<label for="time-select">Choose a time:</label>

  <select id="time-select" onchange="timeFunction()">
    <option value="">- ⬇ Best Try ⬇ -</option>
  </select>

  <h1 id="test"><time>00:00:00</time></h1>
  <button id="strt">start</button>
  <button id="stp">stop</button>
  <button id="rst">reset</button>

</body>
`
  const css = `
  <style>
#time-select
{
cursor:pointer;
idth:5vw;
height:4vh;
border-radius: 0.5vw;
font-family:Ubuntu;
position: absolute;
display: none;
background:
}
#tool-select
{
cursor:pointer;
idth:5vw;
height:4vh;
border-radius: 0.5vw;
font-family:Ubuntu;
position: absolute;
display: block;
background:
top: 5%;
left: 1%;
}
#block
{
position: absolute;
      top: 1%;
      left: 240px;
      display: block;
}
#sphere
{
position: absolute;
      top: 1%;
      left: 280px;
      display: block;
}
#text
{
position: absolute;
      top: 1%;
      left: 320px;
      display: block;
}
#retour
{
position: absolute;
      top: 1%;
      left: 360px;
      display: block;
}
.white {background:white;}
.pink {background:pink;}
.purple {background:purple;}
.blue {background:blue;}
.yellow {background:yellow;}
.red {background:red;}
.green {background:green}
.gray {background:gray}
#color-select
{
cursor:pointer;
idth:5vw;
height:4vh;
border-radius: 0.5vw;
font-family:Ubuntu;
position: absolute;
display: none;
background:
}
</style>`;

  canvas.insertAdjacentHTML('afterend', css);
  canvas.insertAdjacentHTML('afterend', html);


function drawZones() {
        let img = new Image(); // Crée un nouvel élément Image
    img.src = 'https://cdn.discordapp.com/attachments/937831925484228690/1021459145771204648/channels4_profile.jpg'; // Définit le chemin vers sa source
    let img2 = new Image(); // Crée un nouvel élément Image
    img2.src = 'https://pbs.twimg.com/media/FcPVr3kX0AMhHwv?format=png&name=small'; // Définit le chemin vers sa source
    let img3 = new Image(); // Crée un nouvel élément Image
    img3.src = 'https://pbs.twimg.com/media/FcSiuCMXgAA9rUf?format=png&name=240x240'; // Définit le chemin vers sa source
    let img4 = new Image(); // Crée un nouvel élément Image
    img4.src = 'https://pbs.twimg.com/media/FcVAfmrXoAE1pAa?format=png&name=360x360'; // Définit le chemin vers sa source

    var mylist = document.getElementById("color-select");
    let Color = mylist.options[mylist.selectedIndex].text;
    document.getElementById("color-select").style.background = mylist.options[mylist.selectedIndex].text;
    coords1 = arenaScaling.toScreenPos(new Vector(-2000, -2500));
    document.getElementById("color-select").style.top = coords1.y + "px";
    document.getElementById("color-select").style.left = coords1.x + "px";
    coords1 = arenaScaling.toScreenPos(new Vector(-1350, -2500));
    document.getElementById("time-select").style.top = coords1.y + "px";
    document.getElementById("time-select").style.left = coords1.x + "px";
    document.getElementById('color-select').style.display = "block";
    document.getElementById('test').style.display = "block";
    document.getElementById('time-select').style.display = "block";
    ctx.save();

    ctx.globalAlpha = 0.5;

    coords1 = arenaScaling.toScreenPos(new Vector(-2500, -2500));
    coords2 = arenaScaling.toScreenPos(new Vector(-3000, -2000));
    ctx.drawImage(img, coords1.x, coords1.y, coords2.x - coords1.x, coords2.y - coords1.y);

    coords1 = arenaScaling.toScreenPos(new Vector(-2500, -2000));
    coords2 = arenaScaling.toScreenPos(new Vector(-3000, -1900));
    ctx.drawImage(img2, coords1.x, coords1.y, coords2.x - coords1.x, coords2.y - coords1.y);

    coords1 = arenaScaling.toScreenPos(new Vector(-1500, -1500));
    coords2 = arenaScaling.toScreenPos(new Vector(-1000, -1350));
    ctx.drawImage(img3, coords1.x, coords1.y, coords2.x - coords1.x, coords2.y - coords1.y);

    coords1 = arenaScaling.toScreenPos(new Vector(-2500, -1500));
    coords2 = arenaScaling.toScreenPos(new Vector(-2000, -1350));
    ctx.drawImage(img3, coords1.x, coords1.y, coords2.x - coords1.x, coords2.y - coords1.y);

    coords1 = arenaScaling.toScreenPos(new Vector(-3000, -1500));
    coords2 = arenaScaling.toScreenPos(new Vector(-2500, -1350));
    ctx.drawImage(img3, coords1.x, coords1.y, coords2.x - coords1.x, coords2.y - coords1.y);

    coords1 = arenaScaling.toScreenPos(new Vector(-2000, -2500));
    coords2 = arenaScaling.toScreenPos(new Vector(-2500, -2100));
    ctx.drawImage(img4, coords1.x, coords1.y, coords2.x - coords1.x, coords2.y - coords1.y);

    coords1 = arenaScaling.toScreenPos(new Vector(-2500, -1500));
    ctx.textAlign = "center"
    ctx.font = '48px serif';
    ctx.strokeText('Start', coords1.x, coords1.y);

    coords1 = arenaScaling.toScreenPos(new Vector(-1250, -1500));
    ctx.textAlign = "center"
    ctx.font = '48px serif';
    ctx.strokeText('Finish', coords1.x, coords1.y);

    coords1 = arenaScaling.toScreenPos(new Vector(-2250, -2000));
    ctx.textAlign = "center"
    ctx.font = '30px serif';
    ctx.strokeText('created by', coords1.x, coords1.y);
    ctx.strokeText('tariteur#2358', coords1.x, coords1.y+25);

    coords1 = arenaScaling.toScreenPos(new Vector(3000, -3000));
    coords2 = arenaScaling.toScreenPos(new Vector(-3000, -2500));
    ctx.fillStyle = Color;
    ctx.fillRect(coords1.x, coords1.y, coords2.x - coords1.x, coords2.y - coords1.y);

    coords1 = arenaScaling.toScreenPos(new Vector(-2000, -1500));
    coords2 = arenaScaling.toScreenPos(new Vector(-1500, 1500));
    ctx.fillStyle = Color;
    ctx.fillRect(coords1.x, coords1.y, coords2.x - coords1.x, coords2.y - coords1.y);

    coords1 = arenaScaling.toScreenPos(new Vector(-1000, -2500));
    coords2 = arenaScaling.toScreenPos(new Vector(-500, 500));
    ctx.fillStyle = Color;
    ctx.fillRect(coords1.x, coords1.y, coords2.x - coords1.x, coords2.y - coords1.y);

    coords1 = arenaScaling.toScreenPos(new Vector(-3500, -3000));
    coords2 = arenaScaling.toScreenPos(new Vector(-3000, 3000));
    ctx.fillStyle = Color;
    ctx.fillRect(coords1.x, coords1.y, coords2.x - coords1.x, coords2.y - coords1.y);

    coords1 = arenaScaling.toScreenPos(new Vector(-3000, 2500));
    coords2 = arenaScaling.toScreenPos(new Vector(2500, 3000));
    ctx.fillStyle = Color;
    ctx.fillRect(coords1.x, coords1.y, coords2.x - coords1.x, coords2.y - coords1.y);

    coords1 = arenaScaling.toScreenPos(new Vector(-1500, 1000));
    coords2 = arenaScaling.toScreenPos(new Vector(1500, 1500));
    ctx.fillStyle = Color;
    ctx.fillRect(coords1.x, coords1.y, coords2.x - coords1.x, coords2.y - coords1.y);

    coords1 = arenaScaling.toScreenPos(new Vector(0, -2000));
    coords2 = arenaScaling.toScreenPos(new Vector(500, 1000));
    ctx.fillStyle = Color;
    ctx.fillRect(coords1.x, coords1.y, coords2.x - coords1.x, coords2.y - coords1.y);

    coords1 = arenaScaling.toScreenPos(new Vector(500, -1500));
    coords2 = arenaScaling.toScreenPos(new Vector(2000, -1000));
    ctx.fillStyle = Color;
    ctx.fillRect(coords1.x, coords1.y, coords2.x - coords1.x, coords2.y - coords1.y);

    coords1 = arenaScaling.toScreenPos(new Vector(3000, -2500));
    coords2 = arenaScaling.toScreenPos(new Vector(3500, 1000));
    ctx.fillStyle = Color;
    ctx.fillRect(coords1.x, coords1.y, coords2.x - coords1.x, coords2.y - coords1.y);

    coords1 = arenaScaling.toScreenPos(new Vector(1500, -500));
    coords2 = arenaScaling.toScreenPos(new Vector(3000, 0));
    ctx.fillStyle = Color;
    ctx.fillRect(coords1.x, coords1.y, coords2.x - coords1.x, coords2.y - coords1.y);

    coords1 = arenaScaling.toScreenPos(new Vector(2500, 1000));
    coords2 = arenaScaling.toScreenPos(new Vector(3500, 1500));
    ctx.fillStyle = Color;
    ctx.fillRect(coords1.x, coords1.y, coords2.x - coords1.x, coords2.y - coords1.y);

    coords1 = arenaScaling.toScreenPos(new Vector(2500, 1500));
    coords2 = arenaScaling.toScreenPos(new Vector(3000, 3000));
    ctx.fillStyle = Color;
    ctx.fillRect(coords1.x, coords1.y, coords2.x - coords1.x, coords2.y - coords1.y);

    ctx.restore();
}

game.once('ready', () => {
    game.on('frame', () => {
        if (!player.isDead) drawZones();
    });
});

function bestTime() {
        trial ++;
        var x = document.getElementById("time-select");
        var option = document.createElement("option");
        option.text = h1.textContent + ", try: "+ trial;
         x.add(option);
    sortList();
    }

function sortList() {
  var list, i, switching, b, shouldSwitch;
  list = document.getElementById("time-select");
  switching = true;

  while (switching) {
    switching = false;
    b = list.getElementsByTagName("option");
    for (i = 0; i < (b.length - 1); i++) {
      shouldSwitch = false;
      if (b[i].innerHTML.toLowerCase() > b[i + 1].innerHTML.toLowerCase()) {
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      b[i].parentNode.insertBefore(b[i + 1], b[i]);
      switching = true;
    }
  }
}
function getPlayer(){
        const me = entityManager.entities.filter(
            (ent) =>
                ent.type == 0 && Vector.distance(ent.position, player.position) < 28
        );

        return me[0];
    }

game.once('ready', () => {
    game.on('frame', () => {
        if (!player.isDead){
                let ple = getPlayer();
                let margin = ple.extras.radius;
                let px = player.position.x;
                let py = player.position.y;
            if ((-1500 - margin < px &&
            px < -1000 + margin &&
            -1500 - margin < py &&
            py < -1350 + margin)
            ){
                if (timerON) {
                document.getElementById("stp").click();
                bestTime();
                timerON = false;
                }
            };
            if ((-3000 - margin < px &&
            px < -2000 + margin &&
            -1500 - margin < py &&
            py < -1350 + margin)
            ){
                if (!timerON) {
                document.getElementById("strt").click();
                timerON = true;
                } else {
                document.getElementById("rst").click();
                }
            };
            if ((-3000 - margin < px &&
            px < -2500 + margin &&
            -2500 - margin < py &&
            py < -2000 + margin)
            ){
                window.open("https://www.youtube.com/channel/UCT6nOb6Zsjz8Thrse6Nuimw","nom_de_la_fenetre","options_nouvelle_fenetre");
                input.keyDown(40);
             } else {
                input.keyUp(40);
             }
        }
    });
});

var h1 = document.getElementsByTagName('h1')[0];
var start = document.getElementById('strt');
var stop = document.getElementById('stp');
var reset = document.getElementById('rst');
var sec = 0;
var min = 0;
var hrs = 0;
var t;
var sec2;
var min2;
var hrs2;



function tick(){
    sec++;
    if (sec >= 60) {
        sec = 0;
        min++;
        if (min >= 60) {
            min = 0;
            hrs++;
        }
    }
}
function add() {
    tick();
    h1.textContent = (hrs > 9 ? hrs : "0" + hrs)
        	 + ":" + (min > 9 ? min : "0" + min)
       		 + ":" + (sec > 9 ? sec : "0" + sec);
    timer();
}
function timer() {
    t = setTimeout(add, 10);

}

start.onclick = timer;
stop.onclick = function() {
    clearTimeout(t);
}
reset.onclick = function() {
    h1.textContent = "00:00:00";
    sec = 0; min = 0; hrs = 0;
}