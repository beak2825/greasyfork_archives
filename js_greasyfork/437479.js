// ==UserScript==
// @name         Base Record & Rebuild
// @namespace    http://tampermonkey.net/
// @version      2.2
// @author       Havy
// @description  Record Base
// @match        zombs.io
// @icon         https://cdn-icons-png.flaticon.com/512/599/599063.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437479/Base%20Record%20%20Rebuild.user.js
// @updateURL https://update.greasyfork.org/scripts/437479/Base%20Record%20%20Rebuild.meta.js
// ==/UserScript==

let css2 = `
.button {
  background-color: #99FF33;
  font-size: 16px;
  border: none;
  color: black;
  padding: 14px 40px;
  border-radius: 8px;
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
  text-align: center;
}
.hud-menu-zipp4 {
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
display: none;
position: fixed;
padding: 20px;
width: 640px;
height: 460px;
background: rgba(0, 0, 0, 0.6);
color: #eee;
z-index: 5;
}
.hud-menu-zipp4 .hud-zipp-grid4 {
margin: auto;
display: block;
width: 100%;
height: 100%;
background: rgba(0, 0, 0, 0.2);
}
.hud-spell-icons .hud-spell-icon[data-type="Zippity4"]::before {
background-image: url("https://cdn-icons-png.flaticon.com/512/599/599063.png");
}
.hud-menu-zipp4 .hud-the-tab:hover {
background: rgba(0, 0, 0, 0.2);
color: #eee;
}
`;
let styles = document.createElement("style");
styles.appendChild(document.createTextNode(css2));
document.head.appendChild(styles);
styles.type = "text/css";

let spell = document.createElement("div");
spell.classList.add("hud-spell-icon");
spell.setAttribute("data-type", "Zippity4");
spell.classList.add("hud-zipp4-icon");
document.getElementsByClassName("hud-spell-icons")[0].appendChild(spell);

let modHTML = `
<div class="hud-menu-zipp4">
<div class="hud-zipp-grid4">
</div>
</div>
`;
document.querySelector('#hud').insertAdjacentHTML("afterbegin", modHTML);
let zipz123 = document.getElementsByClassName("hud-menu-zipp4")[0];

document.getElementsByClassName("hud-zipp4-icon")[0].addEventListener("click", () => {
    if(["none", ""].includes(zipz123.style.display)) {
        zipz123.style.display = "block";
        for(let i of Array.from(document.getElementsByClassName("hud-menu"))) {
            i.style.display = "none";
        };
    } else {
        zipz123.style.display = "none";
    };
});

for (let i of Array.from(document.getElementsByClassName("hud-menu-icon"))) {
    i.addEventListener('click', function() {
        if (document.getElementsByClassName("hud-menu-zipp4")[0].style.display == "block") {
            document.getElementsByClassName("hud-menu-zipp4")[0].style.display = "none";
        };
    });
};

for (let i of Array.from(document.getElementsByClassName("hud-spell-icon"))) {
    if (i.dataset.type !== "HealTowersSpell" && i.dataset.type !== "TimeoutItem" && i.dataset.type !== "Zippity4") {
        i.addEventListener('click', function() {
            if (document.getElementsByClassName("hud-menu-zipp4")[0].style.display == "block") {
                document.getElementsByClassName("hud-menu-zipp4")[0].style.display = "none";
            };
        });
    };
};

document.addEventListener("keyup", e => {
    if (document.activeElement.tagName.toLowerCase() !== "input" && document.activeElement.tagName.toLowerCase() !== "textarea") {
        if (e.key === "o" || e.key === "p" || e.key === "b" || e.key === "/" || e.keyCode == 27) {
            if (zipz123.style.display == "block") {
                zipz123.style.display = "none";
            }
        }
    }
})

document.getElementsByClassName("hud-zipp-grid4")[0].innerHTML = `
<div style="text-align:center"><br>
<button class="button" onclick="recordBase(1);">Record Base 1</button>
<button class="button" onclick="buildRecordedBase(1);">Build Base 1</button>
<button class="button" onclick="deleteRecordedBase(1);">Delete Base 1</button>

<button class="button" onclick="recordBase(2);">Record Base 2</button>
<button class="button" onclick="buildRecordedBase(2);">Build Base 2</button>
<button class="button" onclick="deleteRecordedBase(2);">Delete Base 2</button>

<button class="button" onclick="recordBase(3);">Record Base 3</button>
<button class="button" onclick="buildRecordedBase(3);">Build Base 3</button>
<button class="button" onclick="deleteRecordedBase(3);">Delete Base 3</button>

<button class="button" onclick="recordBase(4);">Record Base 4</button>
<button class="button" onclick="buildRecordedBase(4);">Build Base 4</button>
<button class="button" onclick="deleteRecordedBase(4);">Delete Base 4</button>

<button class="button" onclick="recordBase(5);">Record Base 5</button>
<button class="button" onclick="buildRecordedBase(5);">Build Base 5</button>
<button class="button" onclick="deleteRecordedBase(5);">Delete Base 5</button>

<button class="button" onclick="recordBase(6);">Record Base 6</button>
<button class="button" onclick="buildRecordedBase(6);">Build Base 6</button>
<button class="button" onclick="deleteRecordedBase(6);">Delete Base 6</button>

<button class="button" onclick="recordBase(7);">Record Base 7</button>
<button class="button" onclick="buildRecordedBase(7);">Build Base 7</button>
<button class="button" onclick="deleteRecordedBase(7);">Delete Base 7</button>

<button class="button" onclick="recordBase(8);">Record Base 8</button>
<button class="button" onclick="buildRecordedBase(8);">Build Base 8</button>
<button class="button" onclick="deleteRecordedBase(8);">Delete Base 8</button>
`;

var towerCodes = ["Wall", "Door", "SlowTrap", "ArrowTower", "CannonTower", "MeleeTower", "BombTower", "MagicTower", "GoldMine", "Harvester"];

function getGoldStash() {
    return Object.values(Game.currentGame.ui.buildings).find(building => building.type == "GoldStash");
}

window.recordBase = function (num) {
    Game.currentGame.ui.getComponent("PopupOverlay").showConfirmation("Are you sure you want to record base " + num + "? If you recorded it twice, the first recorded base will be overwrite.", 1e4, function() {
        let baseStr = "";
        for (let i in game.ui.buildings) {
            const building = game.ui.buildings[i];
            if (towerCodes.indexOf(building.type) < 0) continue;

            let yaw = 0;

            if (["Harvester", "MeleeTower"].includes(building.type)) {
                if (game.world.entities[building.uid] !== undefined) yaw = game.world.entities[building.uid].targetTick.yaw;
            }
            baseStr += `${towerCodes.indexOf(building.type)},${getGoldStash().x - building.x},${getGoldStash().y - building.y},${yaw};`;
        }
        localStorage.setItem(num, baseStr)
    })
}

window.buildRecordedBase = function (num) {
    function BuildBase(design) {
        if (getGoldStash() === undefined) {
            game.ui.getComponent('PopupOverlay').showHint("You must have a gold stash to be able to use this.");
            throw new Error("You must have a gold stash to be able to use this.");
        }
        const towers = design.split(";");

        for (let towerStr of towers) {
            const tower = towerStr.split(",");

            if (tower[0] === "") continue;
            if (tower.length < 4) {
                throw new Error(`${JSON.stringify(tower)} contains an issue that must be fixed before this design can be replicated.`);
                game.ui.getComponent('PopupOverlay').showHint("You haven't recorded base " + num);
            }
            Game.currentGame.network.sendRpc({
                name: "MakeBuilding",
                type: towerCodes[parseInt(tower[0])],
                x: getGoldStash().x - parseInt(tower[1]),
                y: getGoldStash().y - parseInt(tower[2]),
                yaw: parseInt(tower[3])
            });
        }
    }
    BuildBase(localStorage.getItem(num));
}
window.deleteRecordedBase = function(num) {
    Game.currentGame.ui.getComponent("PopupOverlay").showConfirmation("Are you sure you want to delete base " + num + "?", 1e4, function() {
        game.ui.components.PopupOverlay.showHint("Base " + num + " has been successfully deleted!");
        localStorage.setItem(num, null);
    })
}