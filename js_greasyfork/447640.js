// ==UserScript==
// @name        Roll
// @namespace   InGame
// @author      Odul, MockingJay
// @match       https://www.dreadcast.net/Main
// @version     1.2
// @grant       none
// @description Faire des jets avec prise en compte des stats via des compétences
// @downloadURL https://update.greasyfork.org/scripts/447640/Roll.user.js
// @updateURL https://update.greasyfork.org/scripts/447640/Roll.meta.js
// ==/UserScript==

// Alias de commandes, utiliser le format suivant:
// alias: "commande",
const aliases = {
    for: "force",
    agi: "agilite",
    res: "resistance",
    per: "perception",
    fur: "furtivite",
    fufu: "furtivite",
    info: "informatique",
    inf: "informatique",
    med: "medecine",
    inge: "ingenierie",
    ing: "ingenierie",
}

// Pour ajouter des formules personnalisées:
// - Le nom doit être en minuscules, sans accents si espaces, underscores autorisés
// - Les coefficients sont dans l'ordre: force, agilité, résistance, perception, furtivité, informatique, médecine, ingénierie
const formulas = {
    force: [1, 0, 0, 0, 0, 0, 0, 0],
    agilite: [0, 1, 0, 0, 0, 0, 0, 0],
    resistance: [0, 0, 1, 0, 0, 0, 0, 0],
    perception: [0, 0, 0, 1, 0, 0, 0, 0],
    furtivite: [0, 0, 0, 0, 1, 0, 0, 0],
    informatique: [0, 0, 0, 0, 0, 1, 0, 0],
    medecine: [0, 0, 0, 0, 0, 0, 1, 0],
    ingenierie: [0, 0, 0, 0, 0, 0, 0, 1],
    dpasse: [1, 2, 0, 1, 0, 0, 0, 0],
    drecep: [1, 1, 0, 2, 0, 0, 0, 0],
    dplaque: [3, 1, 0, 0, 0, 0, 0, 0],
    dfeinte: [1, 1, 0, 1, 0, 0, 0, 0],
    dinter: [0, 1, 0, 1, 0, 0, 0, 0],
    dtir: [1, 1, 0, 0, 0, 0, 0, 0],
    darret: [1, 0, 0, 3, 0, 0, 0, 0],
    hack: [0, 1, 0, 0, 0, 16, 0, 3],
    programmation: [0, 0, 0, 0, 0, 9, 0, 1],
    diag_meca: [0, 0, 0, 2, 0, 1, 0, 2],
    cablage: [0, 0, 0, 0, 0, 3, 0, 7],
    assemblage: [0, 0, 0, 1, 0, 0, 0, 4],
    desassemblage: [1, 0, 0, 0, 0, 0, 0, 4],
    reparation: [1, 0, 0, 0, 0, 0, 0, 4],
    soudure: [1, 0, 0, 3, 0, 0, 0, 6],
    crochetage: [0, 1, 0, 0, 0, 0, 0, 3],
    desamorcer: [0, 1, 0, 3, 0, 0, 0, 16],
    diag_medical: [0, 0, 0, 1, 0, 0, 4, 0],
    chirurgie: [0, 1, 0, 1, 0, 0, 3, 0],
    massage_cardiaque: [3, 0, 0, 0, 0, 0, 7, 0],
    perfusion: [0, 1, 0, 2, 0, 0, 2, 0],
    desinfecter: [0, 3, 0, 0, 0, 0, 2, 0],
    garot: [1, 0, 0, 0, 0, 0, 1, 0],
    tir: [0, 1, 0, 4, 0, 0, 0, 0],
    parade: [0, 4, 0, 1, 0, 0, 0, 0],
    esquive: [1, 9, 0, 0, 0, 0, 0, 0],
    liberation: [4, 5, 0, 0, 0, 0, 0, 1],
    immobilisation: [1, 0, 1, 0, 0, 0, 0, 0],
    equilibre: [0, 4, 1, 0, 0, 0, 0, 0],
    volonte: [4, 2, 9, 1, 1, 1, 1, 1],
    blessure: [0, 1, 9, 0, 0, 0, 0, 0],
    enfoncer: [7, 0, 3, 0, 0, 0, 0, 0],
    mensonge: [0, 3, 0, 0, 5, 0, 2, 0],
    dmensonge: [0, 3, 0, 5, 0, 0, 2, 0],
    maquillage: [0, 8, 0, 2, 0, 0, 0, 0],
    musique: [0, 3, 0, 2, 0, 0, 0, 0],
    accorder: [0, 0, 0, 2, 0, 0, 0, 3],
    fee_lation: [0, 6, 0, 1, 0, 0, 4, 0],
    orgasme: [0, 1, 1, 0, 0, 0, 0, 0],
    skype: [0, 0, 0, 0, 0, 0, 2, 0],
    fee_niasse: [0, 1, 1, 0, 0, 0, 0, 0],
    overflow: [1, 1, 1, 1, 1, 1, 1, 1],
}

// CORE FNS //

const getStats = function() {
    let stats = [];

    for (let i = 1; i <= 8; i++) {
        stats.push(parseInt($('#statistiques .infos .stat_' + i + '_entier').text()));
    }

    return stats;
}

const computeValue = function(skillName){
    if (!formulas[skillName]) {
        return null;
    }

    const stats = getStats();
    const totalWeight = formulas[skillName].reduce(((total, weight) => total + weight), 0);
    const skillPoints = stats.reduce(((total, stat, i) => total + stat * formulas[skillName][i]), 0);

    return 100 - Math.floor((skillPoints / totalWeight) / 6);
}

const retrieveValue = function(facesde, comp, diff)
{
    const ligne = $("#chatContent > .msg.hrp > em").last().text();

    if (!ligne) {
        return;
    }

    if (ligne.includes($("txt_pseudo").text() + " lance 1 dé de " + facesde + " et fait")) {
        let result = parseInt(ligne.substring(ligne.indexOf("et fait") + 7).trim()) + (100 - facesde);
        let threshold = 0;

        switch(diff) {
            case "f":
            case "facile":
                threshold = 25;
                diff = "facile";
                break;
            case "m":
            case "moyen":
                threshold = 50;
                diff = "moyen";
                break;
            case "d":
            case "difficile":
                threshold = 75;
                diff = "difficile";
                break;
            default:
                threshold = parseInt(diff) || 0;
        }

        let textResult = "";

        if (!threshold) {
            textResult += "/me [couleur=jaune]fait "+ result +" à son jet de " + comp + "[/couleur]";
        }
        else if (["facile", "moyen", "difficile"].includes(diff)) {
            textResult += result >= threshold ?
                "/me [couleur=vert]réussit[/couleur] " :
            "/me [couleur=rouge]rate[/couleur] ";
            textResult += "[couleur=jaune]un jet " + diff + " de " + comp + " et fait " + result + "[/couleur]";
        }
        else {
            textResult += result >= threshold ?
                "/me [couleur=vert]réussit[/couleur] " :
            "/me [couleur=rouge]rate[/couleur] ";
            textResult += "[couleur=jaune]un jet de " + comp + " en faisant " + result + " contre un seuil de " + threshold + "[/couleur]";
        }

        $("#chatForm .text_chat").val(textResult);
        nav.getChat().send();
    }

}

const jetDes = function(e) {
    let value = $("#chatForm .text_chat").val();

    if (!value.match(/^\/roll [a-zA-Z]+/)) {
        return; // Ne traiter que l'envoi de /roll avec commande (ignore également les XdY)
    }

    value = value.replace(/[àâ]/g, "a").replace(/[éèê]/g, "e").replace(/[î]/g, "i").replace(/[ô]/g, "o").replace(/[ûù]/g, "u");
    // Essayer d'ignorer les accents

    let comp = value.trim().split(" ")[1].toLowerCase();
    const diff = value.trim().split(" ")[2];

    comp = aliases[comp] || comp;
    const facesde = computeValue(comp);

    if (facesde) {
        value = '/roll 1d' + facesde;
        setTimeout(function() {
            retrieveValue(facesde, comp, diff)
        }, 500);
    }
    else {
        e.preventDefault(); // Empêche l'envoi d'un roll mal écrit
    }

    $("#chatForm .text_chat").val(value);
}

// GUI //

$("body").append(`<style>
#rollPanel {
	position: absolute;
	right: -220px;
	bottom: 20px;
	z-index: 999999;
	display: flex;
}

#rollPanel button, #rollPanel input, #rollPanel select {
	background-color: #8ab6e4;
}

#rollToggle {
	background-color: #6ea0d3;
	height: fit-content;
}

#rollToggle button {
	height: 50px;
	width: 50px;
}

#rollOptions {
	background-color: #6ea0d3;
	padding: 10px;
	width: 200px;
}

#rollOptions label, #rollHasThreshold {
	vertical-align: middle;
}

#rollType, #rollThreshold, .rollPresetDiff {
	height: 30px;
}

.rollPresetDiff {
	flex: 1;
}

#rollType {
	max-width: 160px;
}

#rollThreshold {
	-moz-appearance: textfield;
	text-align: center;
}

#rollThreshold::-webkit-outer-spin-button,
#rollThreshold::-webkit-inner-spin-button {
	-webkit-appearance: none;
 	margin: 0;
}

#rollPresetDiffs {
	display: flex;
}

#rollSubmit {
	width: 100%;
    height: 40px;
    font-size: 18px;
}
</style>`);

$("body").append(`
<div id="rollPanel">
  <div id="rollToggle">
    <button>&lt; Roll</button>
  </div>
  <div id="rollOptions">
    <label for="rollType">Test:</label>

    <select name="rollType" id="rollType">
        <option value="">Standard (1d100)</option>
    </select>

    <br><br>

    <input type="checkbox" name="rollHasThreshold" id="rollHasThreshold">
    <label for="rollHasThreshold">Seuil de réussite</label>
    <input type="number" name="rollThreshold" id="rollThreshold" min="0" max="100" value="0" disabled>

    <br><br>

    <div id="rollPresetDiffs">
      <button id="rollSetEasy" class="rollPresetDiff" value="25" disabled>Facile</button>
      <button id="rollSetMedium" class="rollPresetDiff" value="50" disabled>Moyen</button>
      <button id="rollSetHard" class="rollPresetDiff" value="75" disabled>Difficile</button>
    </div>

    <br>

    <button id="rollSubmit">Lancer</button>
  </div>
</div>
`);

for (let formula in formulas) {
    $("#rollType").append(`<option value="${formula}">${formula}</option>`);
}

let showGUI = false;

$("#rollToggle button").click(function() {
    if (showGUI) {
        $("#rollPanel").css("right", "-220px");
        $("#rollToggle button").text("< Roll");
        showGUI = false;
    }
    else {
        $("#rollPanel").css("right", "0px");
        $("#rollToggle button").text("> Roll");
        showGUI = true;
    }
});

$("#rollHasThreshold").change(function() {
    if ($("#rollHasThreshold").attr("checked")) {
        $(".rollPresetDiff, #rollThreshold").prop("disabled", false);
        $("#rollThreshold").select();
    }
    else {
        $(".rollPresetDiff, #rollThreshold").prop("disabled", true);
    }
});

$(".rollPresetDiff").click(function() {
    $("#rollThreshold").val($(this).attr("value")).select();
});

$("#rollSubmit").click(function() {

    const rollType = $("#rollType").val();
    let roll = "/roll ";

    if (!rollType) {
        roll += "1d100";
    } else {
        roll += rollType;
        if ($("#rollHasThreshold").attr("checked")) {
            roll += " ";
            const threshold = parseInt($("#rollThreshold").val());
            switch (threshold) {
                case 25:
                    roll += "f";
                break;
                case 50:
                    roll += "m";
                break;
                case 75:
                    roll += "d";
                break;
                default:
                    roll += threshold;
            }
        }
    }

    $("#chatForm .text_chat").val(roll);
    $("#chatForm .text_valider").click();

    $("#rollPanel").css("right", "-220px");
    $("#rollToggle button").text("< Roll");
    showGUI = false;
});


// MAIN //

document.addEventListener('keypress', (e) => {
    if (e.keyCode == 13) {
        jetDes(e);
    }
}, false);

$("#chatForm .text_valider").click(jetDes);

console.log("Script Roll - Actif.");