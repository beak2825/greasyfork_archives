// ==UserScript==
// @name         Grundo's Cafe Plushie Helper
// @namespace    github.com/windupbird144/
// @version      0.6
// @description  Show plushies needed on pet plushies page
// @author       windupbird (edited by rowan + wine)
// @match        https://www.grundos.cafe/plushies/?pet_name=*
// @match        https://grundos.cafe/plushies/?pet_name=*
// @icon         https://www.grundos.cafe/static/images/favicon.66a6c5f11278.ico
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js

// @downloadURL https://update.greasyfork.org/scripts/454154/Grundo%27s%20Cafe%20Plushie%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/454154/Grundo%27s%20Cafe%20Plushie%20Helper.meta.js
// ==/UserScript==

/* globals $ */

const plushiesUrl = `https://raw.githubusercontent.com/rowanberryyyy/plushies/main/plushies.json`;

// Get the list of plushies your pet has
const getPlushies = () =>
    Array.from(document.querySelectorAll(".center > table > tbody > tr:nth-of-type(n+2)")).map(e => e.childNodes[3].childNodes[0].textContent.trim().replace(" (","").toUpperCase())


// Filter plushies that haven't been played with
const filterPlayedPlushies = (listOfPlushies, plushiesPlayed) => {
    return listOfPlushies.filter(([name, _]) => !plushiesPlayed.includes(name.toUpperCase()));
};

// Sort plushies by rarity
const byRarity = ([_, rarity1], [__, rarity2]) => rarity1 - rarity2;

// Toggle plushie list display
function togglePlushies() {
    $("#plushies-to-play").toggle();
}

// Generate HTML for plushies
const html = (plushies) => `
<div class="center">
    <p><button id='viewplushies'>Your pet has ${plushies.length} plushies left to play with!</button></p>
</div>
<div id="plushies-to-play" style="display:none">
    <div class="plushies">
        <ul>
            ${plushies.sort(byRarity).map(([name, rarity]) => `
                <li>
                    <span style="user-select:all">${name}</span> (<b>r${rarity})</b> <br>
                    <a href="/market/wizard/?query=${name}" target="_plushieSearch"><img width="15px" src="https://s3.us-west-2.amazonaws.com/cdn.grundos.cafe/misc/wiz.png"></a>
                    <a href="/island/tradingpost/browse/?query=${name}" target="_plushieSearch"><img width="15px" src="https://s3.us-west-2.amazonaws.com/cdn.grundos.cafe/misc/tp.png"></a>
                    <a href="/safetydeposit/?page=1&category=&type=&query=${name}" target="_plushieSearch"><img width="15px" src="https://s3.us-west-2.amazonaws.com/cdn.grundos.cafe/misc/sdb.gif"></a>
                </li>`).join("")}
        </ul>
    </div>
</div>`;

// Append custom CSS to the page
const customCSS = `
.plushies {
    height: 800px;
    overflow: auto;
    line-height: 20px;
    text-align: left;
}
.plushies ul {
    column-count: 2;
}
.plushies li {
    width: 95%;
}
.plushies li:nth-of-type(2n) {
    background: var(--grid_select);
}`;

$("<style>").prop("type", "text/css").html(customCSS).appendTo("head");

async function main() {
    const listOfPlushies = await $.getJSON(plushiesUrl);
    const toPlay = filterPlayedPlushies(listOfPlushies, getPlushies());
    $("main div.center").prepend(html(toPlay));
    // Attach the togglePlushies function to the button click event
    $("#viewplushies").on("click", togglePlushies);
}

main().then();
