// ==UserScript==
// @name TOTAL DE TROPAS A CAMINHO DE ALDEIA
// @description Shows the total incoming troops (support and attack) in the village info screen
// @author FunnyPocketBook
// @version 0.4.3
// @date 2019-07-02
// @namespace FunnyPocketBook
// @include      https://**.tribalwars.com.*/game.php?**&screen=info_village*
// @downloadURL https://update.greasyfork.org/scripts/442044/TOTAL%20DE%20TROPAS%20A%20CAMINHO%20DE%20ALDEIA.user.js
// @updateURL https://update.greasyfork.org/scripts/442044/TOTAL%20DE%20TROPAS%20A%20CAMINHO%20DE%20ALDEIA.meta.js
// ==/UserScript==

/**
 * name Incoming Troops Count
 * description Shows total number of troops incoming if shared commands enabled
 * author FunnyPocketBook
 * version 0.4.2
 */

 /**
  * Name: Inc Counter
  * Description: Adds all known incoming troops (attack and support) together in the village info
  * Author: FunnyPocketBook
  * Version: 0.4.2
  */

let titleParent = $("#content_value > table:nth-child(3) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(2)");
let unitConfig =
    `<h4>Incoming support</h4><span id="supportText"></span>
<table id="incSupportTable" style="margin-bottom: 10px" class="vis" width="100%">
    <tbody>
        <tr>
            <th style="text-align:center" width="35">
                <a href="#" class="unit_link" data-unit="spear"><img src="https://dsen.innogamescdn.com/asset/10d39b3d/graphic/unit/unit_spear.png" title="Spear fighter" alt="" class=""></a>
            </th>
            <th style="text-align:center" width="35">
                <a href="#" class="unit_link" data-unit="sword"><img src="https://dsen.innogamescdn.com/asset/10d39b3d/graphic/unit/unit_sword.png" title="Swordsman" alt="" class=""></a>
            </th>
            <th style="text-align:center" width="35">
                <a href="#" class="unit_link" data-unit="axe"><img src="https://dsen.innogamescdn.com/asset/10d39b3d/graphic/unit/unit_axe.png" title="Axeman" alt="" class=""></a>
            </th>
            <th style="text-align:center" width="35">
                <a href="#" class="unit_link" data-unit="archer"><img src="https://dsen.innogamescdn.com/asset/10d39b3d/graphic/unit/unit_archer.png" title="Archer" alt="" class=""></a>
            </th>
            <th style="text-align:center" width="35">
                <a href="#" class="unit_link" data-unit="spy"><img src="https://dsen.innogamescdn.com/asset/10d39b3d/graphic/unit/unit_spy.png" title="Scout" alt="" class=""></a>
            </th>
            <th style="text-align:center" width="35">
                <a href="#" class="unit_link" data-unit="light"><img src="https://dsen.innogamescdn.com/asset/10d39b3d/graphic/unit/unit_light.png" title="Light cavalry" alt="" class=""></a>
            </th>
            <th style="text-align:center" width="35">
                <a href="#" class="unit_link" data-unit="marcher"><img src="https://dsen.innogamescdn.com/asset/10d39b3d/graphic/unit/unit_marcher.png" title="Mounted archer" alt="" class=""></a>
            </th>
            <th style="text-align:center" width="35">
                <a href="#" class="unit_link" data-unit="heavy"><img src="https://dsen.innogamescdn.com/asset/10d39b3d/graphic/unit/unit_heavy.png" title="Heavy cavalry" alt="" class=""></a>
            </th>
            <th style="text-align:center" width="35">
                <a href="#" class="unit_link" data-unit="ram"><img src="https://dsen.innogamescdn.com/asset/10d39b3d/graphic/unit/unit_ram.png" title="Ram" alt="Ram" class=""></a>
            </th>
            <th style="text-align:center" width="35">
                <a href="#" class="unit_link" data-unit="catapult"><img src="https://dsen.innogamescdn.com/asset/10d39b3d/graphic/unit/unit_catapult.png" title="Catapult" alt="" class=""></a>
            </th>
            <th style="text-align:center" width="35">
                <a href="#" class="unit_link" data-unit="knight"><img src="https://dsen.innogamescdn.com/asset/10d39b3d/graphic/unit/unit_knight.png" title="Paladin" alt="" class=""></a>
            </th>
            <th style="text-align:center" width="35">
                <a href="#" class="unit_link" data-unit="snob"><img src="https://dsen.innogamescdn.com/asset/10d39b3d/graphic/unit/unit_snob.png" title="Nobleman" alt="" class=""></a>
            </th>
        </tr>
        <tr id="unitAmnt">
            <td class="unit-item unit-item-spear hidden">0</td>
            <td class="unit-item unit-item-sword hidden">0</td>
            <td class="unit-item unit-item-axe hidden">0</td>
            <td class="unit-item unit-item-archer hidden">0</td>
            <td class="unit-item unit-item-spy hidden">0</td>
            <td class="unit-item unit-item-light hidden">0</td>
            <td class="unit-item unit-item-marcher hidden">0</td>
            <td class="unit-item unit-item-heavy hidden">0</td>
            <td class="unit-item unit-item-ram hidden">0</td>
            <td class="unit-item unit-item-catapult hidden">0</td>
            <td class="unit-item unit-item-knight hidden">0</td>
            <td class="unit-item unit-item-snob hidden">0</td>
        </tr>
    </tbody>
</table>
<h4>Incoming attack</h4><span id="attackText"></span>
<table id="incAttackTable" style="margin-bottom: 10px" class="vis" width="100%">
    <tbody>
        <tr>
            <th style="text-align:center" width="35">
                <a href="#" class="unit_link" data-unit="spear"><img src="https://dsen.innogamescdn.com/asset/10d39b3d/graphic/unit/unit_spear.png" title="Spear fighter" alt="Spear" class=""></a>
            </th>
            <th style="text-align:center" width="35">
                <a href="#" class="unit_link" data-unit="sword"><img src="https://dsen.innogamescdn.com/asset/10d39b3d/graphic/unit/unit_sword.png" title="Swordsman" alt="Sword" class=""></a>
            </th>
            <th style="text-align:center" width="35">
                <a href="#" class="unit_link" data-unit="axe"><img src="https://dsen.innogamescdn.com/asset/10d39b3d/graphic/unit/unit_axe.png" title="Axeman" alt="Axe" class=""></a>
            </th>
            <th style="text-align:center" width="35">
                <a href="#" class="unit_link" data-unit="archer"><img src="https://dsen.innogamescdn.com/asset/10d39b3d/graphic/unit/unit_archer.png" title="Archer" alt="Archer" class=""></a>
            </th>
            <th style="text-align:center" width="35">
                <a href="#" class="unit_link" data-unit="spy"><img src="https://dsen.innogamescdn.com/asset/10d39b3d/graphic/unit/unit_spy.png" title="Scout" alt="Scout" class=""></a>
            </th>
            <th style="text-align:center" width="35">
                <a href="#" class="unit_link" data-unit="light"><img src="https://dsen.innogamescdn.com/asset/10d39b3d/graphic/unit/unit_light.png" title="Light cavalry" alt="Light Cavalry" class=""></a>
            </th>
            <th style="text-align:center" width="35">
                <a href="#" class="unit_link" data-unit="marcher"><img src="https://dsen.innogamescdn.com/asset/10d39b3d/graphic/unit/unit_marcher.png" title="Mounted archer" alt="Mounted Archer" class=""></a>
            </th>
            <th style="text-align:center" width="35">
                <a href="#" class="unit_link" data-unit="heavy"><img src="https://dsen.innogamescdn.com/asset/10d39b3d/graphic/unit/unit_heavy.png" title="Heavy cavalry" alt="Heavy Cavalry" class=""></a>
            </th>
            <th style="text-align:center" width="35">
                <a href="#" class="unit_link" data-unit="ram"><img src="https://dsen.innogamescdn.com/asset/10d39b3d/graphic/unit/unit_ram.png" title="Ram" alt="" class="Ram"></a>
            </th>
            <th style="text-align:center" width="35">
                <a href="#" class="unit_link" data-unit="catapult"><img src="https://dsen.innogamescdn.com/asset/10d39b3d/graphic/unit/unit_catapult.png" title="Catapult" alt="Catapult" class=""></a>
            </th>
            <th style="text-align:center" width="35">
                <a href="#" class="unit_link" data-unit="knight"><img src="https://dsen.innogamescdn.com/asset/10d39b3d/graphic/unit/unit_knight.png" title="Paladin" alt="Paladin" class=""></a>
            </th>
            <th style="text-align:center" width="35">
                <a href="#" class="unit_link" data-unit="snob"><img src="https://dsen.innogamescdn.com/asset/10d39b3d/graphic/unit/unit_snob.png" title="Nobleman" alt="Noble" class=""></a>
            </th>
        </tr>
        <tr id="unitAmnt">
            <td class="unit-item unit-item-spear hidden">0</td>
            <td class="unit-item unit-item-sword hidden">0</td>
            <td class="unit-item unit-item-axe hidden">0</td>
            <td class="unit-item unit-item-archer hidden">0</td>
            <td class="unit-item unit-item-spy hidden">0</td>
            <td class="unit-item unit-item-light hidden">0</td>
            <td class="unit-item unit-item-marcher hidden">0</td>
            <td class="unit-item unit-item-heavy hidden">0</td>
            <td class="unit-item unit-item-ram hidden">0</td>
            <td class="unit-item unit-item-catapult hidden">0</td>
            <td class="unit-item unit-item-knight hidden">0</td>
            <td class="unit-item unit-item-snob hidden">0</td>
        </tr>
    </tbody>
</table>`;
titleParent.append($(unitConfig));

class Units {
    constructor(spear, sword, axe, archer, spy, light, marcher, heavy, ram, catapult, knight, snob) {
        this.spear = spear;
        this.sword = sword;
        this.axe = axe;
        this.archer = archer;
        this.spy = spy;
        this.light = light;
        this.marcher = marcher;
        this.heavy = heavy;
        this.ram = ram;
        this.catapult = catapult;
        this.knight = knight;
        this.snob = snob;
    }
}


let attackIncs = []; // Store shared incoming attacks
let supportIncs = []; // Store shared incoming supports
let sharedSupport = false; // true if one incoming support is shared
let sharedAttack = false; // true if one incoming attack is shared

let table = document.querySelector(".commands-container table:nth-child(1)"); // Incoming commands table
// Evaluate every incoming command
for (let i = 2; i <= table.rows.length; i++) {
    let inc = table.querySelector("tr.command-row:nth-child(" + i + ") > td:nth-child(1) > span:nth-child(1) > span:nth-child(1) > a:nth-child(1) > span:nth-child(1) > span:nth-child(1)");
    if (inc.attributes["data-command-type"] == undefined) { // Don't store incoming command if not shared
        continue;
    } else if (inc.attributes["data-command-type"].value === "support") {
        supportIncs.push(inc);
        sharedSupport = true;
    } else if (inc.attributes["data-command-type"].value === "attack") {
        attackIncs.push(inc);
        sharedAttack = true;
    }
}

if (sharedAttack) {
    getUnits(attackIncs);
}
if (sharedSupport) {
    getUnits(supportIncs);
}

/**
 * Calculates total amount of incoming troops
 * @param {String[]} incomings Array of incoming commands
 */
function getUnits(incomings) {
    let type;
    if (incomings[0].attributes["data-command-type"].value == "support") {
        type = "support";
    } else {
        type = "attack";
    }
    let counterGetAmnt = 0; // Counts amount of processed commands
    let incUnits = new Units(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    let timeout = 2000;
    if (incomings.length === 0) {
        return;
    }
    // Get units of each incoming command
    incomings.forEach(function (ele) {
        let id = ele.getAttribute("data-command-id"); // Get command ID
        timeout += Math.random() * 70 + 40;
        // Get request for command details and extract amount of troops
        setTimeout(function() {
            $.get(window.location.origin + "/game.php?village=" + game_data.village.id + "&screen=info_command&ajax=details&id=" + id, function (r) {
                let responseUnits = r.units;
                counterGetAmnt++;
                if (type === "attack") {
                    document.getElementById("attackText").innerText = "Processing " + counterGetAmnt + "/" + incomings.length + " commands";
                } else {
                    document.getElementById("supportText").innerText = "Processing " + counterGetAmnt + "/" + incomings.length + " commands";
                }
                // Add the units from the response together
                Object.keys(responseUnits).forEach((key) => {
                    incUnits[key] += parseInt(responseUnits[key].count);
                });
                // If all incoming commands have been processed, write the total number of troops into the table
                if (counterGetAmnt == incomings.length) {
                    writeUnits(incomings, incUnits);
                }
            });
        }, timeout)
    });
}

function writeUnits(incomings, incUnits) {
    let table;
    if (incomings[0].attributes["data-command-type"].value == "support") {
        table = document.getElementById("incSupportTable");
    } else {
        table = document.getElementById("incAttackTable");
    }
    Object.keys(incUnits).forEach((key) => {
        table.getElementsByClassName("unit-item-" + key)[0].innerText = incUnits[key];
        if (incUnits[key] > 0) {
            table.getElementsByClassName("unit-item-" + key)[0].classList.remove("hidden");
        }
    });
}