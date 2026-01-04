// ==UserScript==
// @name         Fair Game QoL v1
// @namespace    https://fair.kaliburg.de/#
// @version      0.500
// @description  Fair Game QOL Enhancements
// @author       Aqualxx
// @match        https://fair.kaliburg.de/
// @include      *kaliburg.de*
// @run-at       document-end
// @icon         https://www.google.com/s2/favicons?domain=kaliburg.de
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438250/Fair%20Game%20QoL%20v1.user.js
// @updateURL https://update.greasyfork.org/scripts/438250/Fair%20Game%20QoL%20v1.meta.js
// ==/UserScript==

// Script made by aqualxx#5004 and maintained by Lynn#6969

// Features include:
// Larger ladder size
// Indicators
// Keybinds
// 🍇🍇🍇
// Time estimates

//////////////////////
//      Options     //
//////////////////////


if (typeof unsafeWindow !== 'undefined') {
    window = unsafeWindow;
}

window.qolOptions = {
    expandedLadder: {
        enabled: false,
        size: 30
    },
    scrollableLadder: false,
    keybinds: false,
    scrollablePage: false,
    promotePoints: true,
    multiLeader: {
        "default": "Both", // <--- Change this value to save between refreshs
        "Disabled": false,
        "Both": "[NUMBER xSTATUS]",
        "Square": "[xSTATUS]",
        "Number": "[NUMBER]",
    },
}


//////////////////////////////////////
//      DO NOT EDIT BEYOND HERE     //
//////////////////////////////////////

window.subscribeToDomNode = function(id, callback) {
    let input = $("#"+id)[0];
    if (input) {
        input.addEventListener("change", callback);
    } else {
        console.log(`Id ${id} was not found subscribing to change events`);
    }
}

document.addEventListener("keyup", event => {
    if (!qolOptions.keybinds) return;
    if (!event.target.isEqualNode($("body")[0])) return;
    if (event.key === "b") {
        event.preventDefault()
        //buyBias(event);
    }
    if (event.key === "m") {
        event.preventDefault();
        //buyMulti(event);
    }
});

if (qolOptions.expandedLadder.enabled) {
    $('#infoText').parent().parent().removeClass('col-7').addClass('col-12');
    $('#infoText').parent().parent().next().hide();
}

clientData.ladderAreaSize = 1;

$('body').css("line-height", 1);
clientData.ladderPadding = qolOptions.expandedLadder.size / 2;

function addTableColumns() {
    $("#ladderBody").parent().find("thead").html(`
        <tr class="thead-light">
            <th>#</th>
            <th>Stats</th>
            <th>Username</th>
            <th class="text-end">Power</th>
            <th class="text-end">ETA to #1</th>
            <th class="text-end">ETA to You</th>
            <th class="text-end">Points</th>
        </tr>
    `);
}
addTableColumns();

numberFormatter = new numberformat.Formatter({
    format: 'hybrid',
    sigfigs: 6,
    flavor: 'short',
    minSuffix: 1e10,
    maxSmall: 0
});

window.secondsToHms = function(d) {
    d = Number(d);
    if (d === 0) return "0s";
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    let s = d % 3600 % 60;

    if (h == 0 && m == 0 && s !== 0 && Math.abs(s) < 1) {
        return "<1s";
    } else {
        s = Math.floor(s);
    }
    var hDisplay = h > 0 ? h + "h " : "";
    var mDisplay = m > 0 ? m + "m " : "";
    var sDisplay = s > 0 ? s + "s " : "";
    return hDisplay + mDisplay + sDisplay;
}


// returns positive minimal positive solution or "Inf"
window.solveQuadratic = function(a, b, c) {
    if (a == 0) {
        return -c / b > 0 ? (-c / b).toFixed(2) : "Inf";
    } else {
        let discriminant = b * b - 4 * a * c;
        if (discriminant < 0) return "Inf";
        const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
        const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
        if (root1 > 0 && root2 > 0) {
            return Math.min(root1, root2).toFixed(2);
        } else {
            let maxRoot = Math.max(root1, root2).toFixed(2);
            if (maxRoot < 0) return "Inf";
            else return maxRoot;
        }
    }
}

window.getAcc = function(ranker) {
    if (ranker.rank === 1 || !ranker.growing) return 0;
    return (ranker.bias + ranker.rank  - 1) * ranker.multiplier;
}

window.writeNewRow = function(body, ranker) {
    let row = body.insertRow();
    const myAcc = getAcc(ladderData.yourRanker);
    const theirAcc = getAcc(ranker);
    const a = (theirAcc - myAcc) * 0.5;
    const b = (ranker.growing ? ranker.power : 0) - ladderData.yourRanker.power;
    const c = ranker.points - ladderData.yourRanker.points;

    let timeLeft = solveQuadratic(a, b, c);
    timeLeft = secondsToHms(timeLeft);

    if (timeLeft == '') {
        timeLeft = "Never";
    }

    const pointsToFirst = ladderData.firstRanker.points.sub(ranker.points);
    const firstPowerDifference = ranker.power - (ladderData.firstRanker.growing ? ladderData.firstRanker.power : 0);
    const pointsLeftPromote = infoData.pointsForPromote.mul(ladderData.currentLadder.number) - ranker.points;
    let timeToFirst = "";
    if (ladderData.firstRanker.points.lessThan(infoData.pointsForPromote.mul(ladderData.currentLadder.number))) {
        // Time to reach minimum promotion points of the ladder
        timeToFirst = 'L' + secondsToHms(solveQuadratic(theirAcc/2, ranker.power, -pointsLeftPromote));
    } else {
        // time to reach first ranker
        timeToFirst =  secondsToHms(solveQuadratic(theirAcc/2, firstPowerDifference, -pointsToFirst));
    }

    if (!ranker.growing || (ranker.rank === 1 && ladderData.firstRanker.points.greaterThan(infoData.pointsForPromote.mul(ladderData.currentLadder.number)))) timeToFirst = "";

    if (ladderData.yourRanker.rank == ranker.rank) {
        timeLeft = "";
    }

    let assholeTag = (ranker.timesAsshole < infoData.assholeTags.length) ?
        infoData.assholeTags[ranker.timesAsshole] : infoData.assholeTags[infoData.assholeTags.length - 1];
    let rank = (ranker.rank === 1 && !ranker.you && ranker.growing && ladderData.rankers.length >= Math.max(infoData.minimumPeopleForPromote, ladderData.currentLadder.number) &&
                ladderData.firstRanker.points.cmp(infoData.pointsForPromote.mul(ladderData.currentLadder.number)) >= 0 && ladderData.yourRanker.vinegar.cmp(getVinegarThrowCost()) >= 0) ?
        '<a href="#" style="text-decoration: none" onclick="throwVinegar(event)">🍇</a>' : ranker.rank;

    let multiPrice = ""
    if ((ranker.rank === 1 && ranker.growing) && qolOptions.multiLeader[$("#leadermultimode")[0].value]) {
        multiPrice = qolOptions.multiLeader[$("#leadermultimode")[0].value]
            .replace("NUMBER",`${numberFormatter.format(Math.pow(ladderData.currentLadder.number+1, ranker.multiplier+1))}`)
            .replace("STATUS", `${(ranker.power >= Math.pow(ladderData.currentLadder.number+1, ranker.multiplier+1)) ? "🟩" : "🟥"}`)
    }
    row.insertCell(0).innerHTML = rank + " " + assholeTag;
    row.insertCell(1).innerHTML = `[+${ranker.bias.toString().padStart(2,"0")} x${ranker.multiplier.toString().padStart(2,"0")}]`;
    row.insertCell(2).innerHTML = `${ranker.username}`;
    row.cells[2].style.overflow = "hidden";
    row.insertCell(3).innerHTML = `${multiPrice} ${numberFormatter.format(ranker.power)} ${ranker.growing ? ranker.rank != 1 ? "(+" + numberFormatter.format((ranker.rank - 1 + ranker.bias) * ranker.multiplier) + ")" : "" : "(Promoted)"}`;
    row.cells[3].classList.add('text-end');
    row.insertCell(4).innerHTML = timeToFirst;
    row.cells[4].classList.add('text-end');
    row.insertCell(5).innerHTML = timeLeft;
    row.cells[5].classList.add('text-end');
    row.insertCell(6).innerHTML = `${numberFormatter.format(ranker.points)}`;
    row.cells[6].classList.add('text-end');

    if (ranker.you) {
        row.classList.add('table-active');
    } else if (!ranker.growing) {
        row.style['background-color'] = "#C0C0C0";
    } else if ((ranker.rank < ladderData.yourRanker.rank && timeLeft != 'Never') || (ranker.rank > ladderData.yourRanker.rank && timeLeft == 'Never')) {
        row.style['background-color'] = "#A0EEA0";
    } else if ((ranker.rank < ladderData.yourRanker.rank && timeLeft == 'Never') || (ranker.rank > ladderData.yourRanker.rank && timeLeft != 'Never')) {
        row.style['background-color'] = "#EEA0A0";
    }
}

window.updateLadder = function() {
    let size = ladderData.rankers.length;
    let rank = ladderData.yourRanker.rank;
    let ladderArea = Math.floor(rank / clientData.ladderAreaSize);

    let startRank = (ladderArea * clientData.ladderAreaSize) - clientData.ladderPadding;
    let endRank = startRank + clientData.ladderAreaSize - 1 + (2 * clientData.ladderPadding);

    let body = document.getElementById("ladderBody");
    body.innerHTML = "";
    if (startRank > 1) writeNewRow(body, ladderData.firstRanker);
    for (let i = 0; i < ladderData.rankers.length; i++) {
        let ranker = ladderData.rankers[i];
        if ((ranker.rank >= startRank && ranker.rank <= endRank)) writeNewRow(body, ranker);
    }

    let tag1 = '<span>', tag2 = '</span>';
    if (ladderData.yourRanker.vinegar.cmp(getVinegarThrowCost()) >= 0) {
        tag1 = '<span style="color: plum">'
        tag2 = '</span>'
    }

    let grapesTimeLeft = secondsToHms((getVinegarThrowCost() - ladderData.yourRanker.vinegar) / ladderData.yourRanker.grapes);
    const fillsPerHour = (new Decimal(3600)).div(getVinegarThrowCost().div(ladderData.yourRanker.grapes));

    if (grapesTimeLeft == '') {
        if (ladderData.yourRanker.grapes > 0) {
            grapesTimeLeft = "0s";
        } else {
            grapesTimeLeft = "infinite time";
        }
    }
    $('#infoText').html(`<p>Grapes: ${numberFormatter.format(ladderData.yourRanker.grapes)}<\p>`+
                        `<p>${tag1} Vinegar:  ${numberFormatter.format(ladderData.yourRanker.vinegar)}/${numberFormatter.format(getVinegarThrowCost())} (+${numberFormatter.format(ladderData.yourRanker.grapes)} per/s) ${tag2}<\p>`+
                        `<p>There is ${grapesTimeLeft} left until you can throw vinegar at #1, fills per hour: ` + fillsPerHour.toFixed(2) + "<\p><p><br><br><br><\p>");

    $('#usernameLink').html(ladderData.yourRanker.username);
    $('#usernameText').html("+" + ladderData.yourRanker.bias + "   x" + ladderData.yourRanker.multiplier);

    $('#rankerCount').html("Rankers: " + ladderStats.growingRankerCount + "/" + ladderData.rankers.length);
    $('#ladderNumber').html("Ladder # " + ladderData.currentLadder.number);

    if (qolOptions.promotePoints) {
        $('#manualPromoteText').show()
        $('#manualPromoteText').html("Points needed for "
                                     + ((ladderData.currentLadder.number === infoData.assholeLadder) ? "being an asshole" : "manually promoting")
                                     + ": " + numberFormatter.format(ladderStats.pointsNeededForManualPromote));
    } else {
        $('#manualPromoteText').hide()
    }

    let offCanvasBody = $('#offCanvasBody');
    offCanvasBody.empty();
    for (let i = 1; i <= ladderData.currentLadder.number; i++) {
        let ladder = $(document.createElement('li')).prop({
            class: "nav-link"
        });

        let ladderLinK = $(document.createElement('a')).prop({
            href: '#',
            innerHTML: 'Chad #' + i,
            class: "nav-link h5"
        });

        ladderLinK.click(async function () {
            changeChatRoom(i);
        })

        ladder.append(ladderLinK);
        offCanvasBody.prepend(ladder);
    }

    showButtons();
}

window.showButtons = function() {
    let biasButton = $('#biasButton');
    let multiButton = $('#multiButton');

    let biasCost = getUpgradeCost(ladderData.yourRanker.bias + 1);
    if (ladderData.yourRanker.points.cmp(biasCost) >= 0) {
        biasButton.prop("disabled", false);
    } else {
        biasButton.prop("disabled", true);
    }

    let multiCost = getUpgradeCost(ladderData.yourRanker.multiplier + 1);
    if (ladderData.yourRanker.power.cmp(new Decimal(multiCost)) >= 0) {
        multiButton.prop("disabled", false);
    } else {
        multiButton.prop("disabled", true);
    }

    const myAcc = getAcc(ladderData.yourRanker);

    let nextMultiTime = ladderData.yourRanker.power.lessThan(multiCost) ? (multiCost-ladderData.yourRanker.power)/myAcc : 0;
    // Payback is the time it takes for the difference between new and old growth functions to gain current points.
    // Rank changes are not taken into account so this estimate is conservative.
    // For multi payback you will need to solve accel_diff / 2 * t^2 - power * t - points = 0
    let nextMultiPayback = 0;
    if (nextMultiTime > 0) {
        // If you don't have the required power calculate cost with future values
        const targetPoints = ladderData.yourRanker.points.add(ladderData.yourRanker.power.times(nextMultiTime)).add(myAcc * myAcc * nextMultiTime / 2);
        nextMultiPayback = solveQuadratic((ladderData.yourRanker.rank - 1 + ladderData.yourRanker.bias)/2, -multiCost, -targetPoints);
    } else {
        nextMultiPayback = solveQuadratic((ladderData.yourRanker.rank - 1 + ladderData.yourRanker.bias)/2, -ladderData.yourRanker.power, -ladderData.yourRanker.points);
    }
    nextMultiTime = secondsToHms(nextMultiTime);
    nextMultiPayback = secondsToHms(nextMultiPayback);

    let nextBiasTime = ladderData.yourRanker.points.lessThan(biasCost) ? solveQuadratic(myAcc/2, ladderData.yourRanker.power, -biasCost) : 0;
    // For bias payback you will need to solve accel_diff / 2 * t^2 - points = 0
    let nextBiasPayback = 0;
    if (nextBiasTime > 0) {
        // If you don't have the required points calculate cost with future value
        nextBiasPayback = solveQuadratic(ladderData.yourRanker.multiplier/2, 0, -biasCost);
    } else {
        nextBiasPayback = solveQuadratic(ladderData.yourRanker.multiplier/2, 0, -ladderData.yourRanker.points);
    }
    nextBiasTime = secondsToHms(nextBiasTime);
    nextBiasPayback = secondsToHms(nextBiasPayback);

    $('#biasTooltip').attr('data-bs-original-title', `${nextBiasTime}/${nextBiasPayback} ` + numberFormatter.format(biasCost) + ' Points');
    $('#multiTooltip').attr('data-bs-original-title', `${nextMultiTime}/${nextMultiPayback} ` + numberFormatter.format(multiCost) + ' Power');

    let promoteButton = $('#promoteButton');
    let assholeButton = $('#assholeButton');
    let ladderNumber = $('#ladderNumber');

    if (ladderData.firstRanker.you && ladderData.firstRanker.points.cmp(ladderStats.pointsNeededForManualPromote) >= 0) {
        if (ladderData.currentLadder.number === infoData.assholeLadder) {
            promoteButton.hide()
            ladderNumber.hide()
            assholeButton.show()
        } else {
            assholeButton.hide()
            ladderNumber.hide()
            promoteButton.show()
        }
    } else {
        assholeButton.hide()
        promoteButton.hide()
        ladderNumber.show()
    }

    // Auto-Promote Button
    let autoPromoteButton = $('#autoPromoteButton');
    let autoPromoteTooltip = $('#autoPromoteTooltip');
    let autoPromoteCost = getAutoPromoteGrapeCost(ladderData.yourRanker.rank);
    if (!ladderData.yourRanker.autoPromote && ladderData.currentLadder.number >= infoData.autoPromoteLadder
        && ladderData.currentLadder.number !== infoData.assholeLadder) {
        autoPromoteButton.show();
        if (ladderData.yourRanker.grapes.cmp(autoPromoteCost) >= 0) {
            autoPromoteButton.prop("disabled", false);
        } else {
            autoPromoteButton.prop("disabled", true);
        }
        autoPromoteTooltip.attr('data-bs-original-title', numberFormatter.format(autoPromoteCost) + ' Grapes');
    } else {
        autoPromoteButton.hide();
    }
}

window.setLadderRows = function() {
    var input = Number($("#rowsInput")[0].value);
    if (isNaN(input)) {
        $("#rowsInput")[0].value = '';
        return;
    }
    if (input < 10) {
        $("#rowsInput")[0].value = '10';
        return;
    }
    qolOptions.expandedLadder.size = input;
    clientData.ladderPadding = qolOptions.expandedLadder.size / 2;
}

window.expandLadder = function(enabled) {
    var ladder = document.querySelector(".ladder-container");
    if (!enabled && ladder) {
        ladder.outerHTML = ladder.innerHTML;
        return;
    }
    if (document.getElementsByClassName("ladder-container").length > 0) {
        return;
    }
    if(!enabled) {
        return;
    }
    var ladder = document.querySelector(".caption-top");
    var ladderParent = ladder.parentElement;
    var ladderContainer = document.createElement("div");
    ladderContainer.className = "ladder-container";
    ladderContainer.style.width = "100%";
    ladderContainer.style.height = "64vh";
    ladderContainer.style.overflow = "auto";
    ladderContainer.style.border = "gray solid 2px";
    ladderParent.replaceChild(ladderContainer, ladder);
    ladderContainer.appendChild(ladder);
}

window.addOption = function(optionElement) {
    $("#offcanvasOptions").children(".offcanvas-body")[0].appendChild(optionElement);
}

window.addOptionDevider = function() {
    var optionElement = document.createElement("hr");
    addOption(optionElement);
}

window.addNewSection = function(name) {
    addOptionDevider();
    var optionElement = document.createElement("h4");
    optionElement.innerHTML = name;
    addOption(optionElement);
}

window.baseOptionDiv = function(content = "") {
    var newDiv = document.createElement("div");
    newDiv.style = "display: block; padding: 0.5rem; font-size:1.25rem"
    newDiv.innerHTML = content;
    return newDiv;
}

window.ButtonOption = function(name, id) {
    var newDiv = baseOptionDiv();
    var button = document.createElement("button");
    button.className = "btn btn-primary";
    button.innerHTML = name;
    button.id = id;
    newDiv.appendChild(button);
    return newDiv;
}

window.SliderOption = function(name, id, min, max, step, value) {
    var newDiv = baseOptionDiv();
    var slider = document.createElement("input");
    slider.type = "range";
    slider.min = min;
    slider.max = max;
    slider.step = step;
    slider.value = value;
    slider.style = "width: 100%";
    slider.id = id;
    var sliderLabel = document.createElement("label");
    slider.oninput = function() {
        sliderLabel.innerHTML = name + ": " + slider.value;
    }
    sliderLabel.innerHTML = name + ": " + slider.value;
    newDiv.appendChild(sliderLabel);
    newDiv.appendChild(slider);
    return newDiv;
}


window.SelectOption = function(title, id, values) {
    //values is an array of objects with display and value properties
    return baseOptionDiv
    (`<span>${title}</span>
      <select name="fonts" id="${id}" class="form-select">
            ${values.map(function(value) {
                return `<option value="${value.value}">${value.display}</option>`
            }).join("")}
      </select>`);
}

window.TextInputOption = function(title, id, placeholder, maxlength, onclick) {
    return baseOptionDiv
    (`<span>${title}</span>
      <div class="input-group">
         <input class="form-control shadow-none" id="${id}" maxlength="${maxlength}" placeholder="${placeholder}" type="text">
         <button class="btn btn-primary shadow-none" id="rowsButton" onclick="${onclick}">Set</button>
      </div>`);
}

window.CheckboxOption = function(title, optionID, defaultChecked=false) {
    return baseOptionDiv(`<input type="checkbox" ${defaultChecked?"checked='checked'" : ""} id="${optionID}"><span style="padding: 10px">${title}</span>`);
}

// Holy crap this took me way too long
$(".navbar-toggler")[0].style['border-color'] = "rgba(0,0,0,0.5)";
$(".navbar-toggler")[0].style['width'] = "5%";
$(`<button aria-controls="offcanvasNavbar" class="navbar-toggler" data-bs-target="#offcanvasOptions" data-bs-toggle="offcanvas" type="button col" style="border-color: rgba(0, 0, 0, 0.5); width: 5%; height: 40px;"><span class="bi bi-gear-fill fs-3 mb-3"></span></button>`).insertBefore(".navbar-toggler");
$("#offcanvasNavbar").clone().attr("id", "offcanvasOptions").width("400px").insertAfter("#offcanvasNavbar");
$("#offcanvasOptions").children(".offcanvas-header").children("#offcanvasNavbarLabel").html("Options");
$("#offcanvasOptions").children(".offcanvas-body").children().remove();

addOption(SelectOption("Ladder Font", "ladderFonts", [
    {display: "Default", value: ""},
    {display: "BenchNine", value: "BenchNine"},
    {display: "Roboto", value: "Roboto"},
    {display: "Lato", value: "Lato"},
]))
addOption(TextInputOption("Ladder Rows", "rowsInput", "# of rows, min 10, default 30", "4", "setLadderRows()"))
addOption(CheckboxOption("Full scrollable ladder", "scrollableLadder", qolOptions.scrollableLadder))
addOption(CheckboxOption("Expand ladder size", "expandedLadder", qolOptions.expandedLadder.enabled))
//addOption(CheckboxOption("Keybinds", "keybinds", qolOptions.keybinds))
addOption(CheckboxOption("Make page scrollable", "scrollablePage", qolOptions.scrollablePage))
addOption(CheckboxOption("Show points for promotion", "promotePoints", qolOptions.promotePoints))
addOption(SelectOption("Leader Multi Requirement", "leadermultimode", [
    {display: "[524288 x🟩]", value: "Both"},
    {display: "[x🟩 / x🟥]", value: "Square"},
    {display: "[524288]", value: "Number"},
    {display: "Disabled", value: "Disabled"},
]))

if (qolOptions.scrollablePage) document.body.style.removeProperty('overflow-y');
if (qolOptions.scrollableLadder) expandLadder(true)

$("#leadermultimode")[0].value = qolOptions.multiLeader["default"]

$("#expandedLadder")[0].addEventListener("change", (event)=>{
    let boxChecked = $("#expandedLadder")[0].checked;
    qolOptions.expandedLadder.enabled = boxChecked;
    if (boxChecked) {
        $('#infoText').parent().parent().removeClass('col-7').addClass('col-12');
        $('#infoText').parent().parent().next().hide();
    } else {
        $('#infoText').parent().parent().addClass('col-7').removeClass('col-12');
        $('#infoText').parent().parent().next().show();
    }
});

$("#scrollablePage")[0].addEventListener("change", (event)=>{
    let boxChecked = $("#scrollablePage")[0].checked;
    qolOptions.scrollablePage = boxChecked;
    if (boxChecked) {
        document.body.style.removeProperty('overflow-y');
    } else {
        document.body.style.setProperty('overflow-y', 'hidden');
    }
});

$("#scrollableLadder")[0].addEventListener("change", (event)=>{
    let boxChecked = $("#scrollableLadder")[0].checked;
    qolOptions.scrollableLadder = boxChecked;
    expandLadder(qolOptions.scrollableLadder)
})

function updateOptions(id, option) {
    let input = $("#"+id)[0];
    if (input) {
        input.addEventListener("change", (event)=>{
            let boxChecked = $("#"+id)[0].checked;
            qolOptions[option] = boxChecked;
        });
    } else {
        console.log(`Id ${id} was not found when linking options`);
    }
}

updateOptions('promotePoints','promotePoints');

var linkTag = document.createElement('link');
linkTag.rel = "stylesheet";
linkTag.href = "https://fonts.googleapis.com/css2?family=BenchNine:wght@400&display=swap"
document.body.appendChild(linkTag);

document.querySelector("#ladderFonts").addEventListener('change',function(){
    var input = document.querySelector("#ladderFonts").value;
    switch (input) {
        case "BenchNine":
            $("table.table.table-sm.caption-top.table-borderless").css("font-family","'BenchNine', sans-serif");
            break;
        case "Roboto":
            $("table.table.table-sm.caption-top.table-borderless").css("font-family","'Roboto', sans-serif");
            break;
        case "Lato":
            $("table.table.table-sm.caption-top.table-borderless").css("font-family","'Lato', sans-serif");
            break;
        default:
            $("table.table.table-sm.caption-top.table-borderless").css("font-family","");
            break;
    }
});