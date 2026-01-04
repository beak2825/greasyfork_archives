// ==UserScript==
// @name         Grundo's Cafe Gourmet Helper
// @namespace    github.com/windupbird144/
// @version      0.6
// @description  Show gourmets needed on gourmet page
// @author       You
// @match        https://www.grundos.cafe/gourmet_club/?pet_name=*
// @icon         https://www.grundos.cafe/static/images/favicon.66a6c5f11278.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454267/Grundo%27s%20Cafe%20Gourmet%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/454267/Grundo%27s%20Cafe%20Gourmet%20Helper.meta.js
// ==/UserScript==
/* globals $ */

const gourmetsUrl = `https://raw.githubusercontent.com/rowanberryyyy/gourmets/main/gourmets.json`

/**
 * Analyse the document to find out which gourmets your pet has Eaten
 *
 * @returns string[] title of gourmet your pets has Eaten
 */
const getEatengourmets = () =>
Array.from(document.querySelectorAll("img[title]")).map(e => e.title.toUpperCase())


/**
 * Return a list of gourmets your pet has not Eaten
 * TODO: Use a more efficient algorithm
 *
 * @param {[string, number][]} listOfgourmets
 * @param {string[]} gourmetsEaten
 *
 * @returns {[string, number][]} the gourmets your pet has not Eaten
 */
const filterEatengourmets = (listOfgourmets, gourmetsEaten) => {
    return listOfgourmets.filter(([name,_]) => !gourmetsEaten.includes(name.toUpperCase()))
}


// callback to sort gourmets by rarity by rarity
const byRarity = ([_,rarity1],[__,rarity2]) => rarity1 - rarity2

// Add on-click toggle for gourmet list
function toggleGourmets() {
    $("#gourmets-to-eat").toggle();
}

const html = (gourmets) => `
<div class="center"><p><button id='viewgourmets'>Your pet has ${gourmets.length} gourmets left to eat!</button></p></div>
<div id="gourmets-to-eat" style="display:none">
    <div class="gourmets">
    <ul>
${
    gourmets.sort(byRarity).map(([name, rarity]) => `<li><span style="user-select:all">${name}</span> (<b>r${rarity})</b> <br>
    <a href="/market/wizard/?query=${name}" target="_gourmetSearch"><img width="15px" src="https://s3.us-west-2.amazonaws.com/cdn.grundos.cafe/misc/wiz.png">
<a href="/island/tradingpost/browse/?query=${name}" target="_gourmetSearch"><img width="15px" src="https://s3.us-west-2.amazonaws.com/cdn.grundos.cafe/misc/tp.png"></a>
    <a href="/safetydeposit/?page=1&category=&type=&query=${name}" target="_gourmetSearch"><img width="15px" src="https://s3.us-west-2.amazonaws.com/cdn.grundos.cafe/misc/sdb.gif"></a></a>
    </li>`).join("")
}
</ul>
</div>`;

// Append CSS to the page
let customCSS = `
.gourmets {
    height: 800px;
    overflow: auto;
    line-height: 20px;
    text-align: left;
    margin-bottom: 20px;
}
.gourmets ul {
    column-count: 2;
}
.gourmets li {
    width: 95%;
}
.gourmets li:nth-of-type(2n) {
    background: var(--grid_select);
}
`;

$("<style>").prop("type", "text/css").html(customCSS).appendTo("head");

async function main() {
    const listOfgourmets = await fetch(gourmetsUrl).then(res => res.json())
    const toEat = filterEatengourmets(listOfgourmets, getEatengourmets())
    $("main div.center").prepend(html(toEat));

    // Attach the toggleGourmets function to the button click event
    $("#viewgourmets").on("click", toggleGourmets);
}

main().then()
