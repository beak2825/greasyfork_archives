// ==UserScript==
// @name         Fish Tally
// @namespace    fishTally
// @version      2024-06-26
// @description  Be sure to set 'run at' to 'document-body' in the settings!
// @author       Mimico Ylva(Hali)
// @match        https://ff14fish.carbuncleplushy.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=carbuncleplushy.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499083/Fish%20Tally.user.js
// @updateURL https://update.greasyfork.org/scripts/499083/Fish%20Tally.meta.js
// ==/UserScript==

addScriptNode(null, null, overwriteFunction);

//For every row,
//get the 6th <td> node, then get the first <span> in that one - this is the baitSpan.
//If it contains a link, then it's not a spearfishing fish.
function overwriteFunction() {
    window.tally = function tally() {
        const map = new Map();

        const rows = document.getElementById("fishes").getElementsByClassName("fish-entry");
        console.log("total rows: " + rows.length);
        for (var i = 0; rows[i]; i++) {
            let fishIcon = rows[i].getElementsByClassName("fish-icon")[0].outerHTML;

            let baitSpan = rows[i].getElementsByTagName("td")[5].getElementsByTagName("span")[0];
            if (baitSpan.getElementsByTagName("a").length > 0) {
                let anchorNode = baitSpan.getElementsByTagName("a")[0];
                //get the title of the first div inside the link - this is the bait's name
                let baitName = anchorNode.getElementsByTagName("div")[0].getAttribute("title");

                if (!map.has(baitName)) {
                    const bait = {link: anchorNode.outerHTML, fishes: new Set()};
                    bait.name = baitName;
                    map.set(bait.name, bait)
                }
                map.get(baitName).fishes.add(fishIcon);//id
            }


        }
        let tableText = "<table class='ui selectable striped very basic very compact unstackable table inverted'><th colspan=2>Bait</th><th>Count</th><th>Fishes</th>"

        map.forEach (function(value, key) {
            tableText += `<tr><td>${value.link}</td><td>${value.name}</td><td>${value.fishes.size}</td><td>${printSet(value.fishes)}</td></tr>`;
        })

        tableText += "</table>";
        document.getElementById('baitTallyDiv').innerHTML = tableText;

        console.log("end tally " + map.size);

        function printSet(set) {
            let output = ""
            for (const id of set) {
                output += id + " "
            }
            return output
        }
    }
}

main();

function addScriptNode(text, s_URL, funcToRun) {
    var scriptNode = document.createElement('script');
    scriptNode.type = "text/javascript";
    if(text) scriptNode.textContent = text;
    if(s_URL) scriptNode.src = s_URL;
    if(funcToRun) scriptNode.textContent = '(' + funcToRun.toString() + ')()';
    (document.getElementsByTagName('head')[0] || document.body || document.documentElement).appendChild(scriptNode);
}

function main() {
    document.getElementById('fish-table-container').innerHTML =
        `<h2>Bait tally</h2>
        <p>This is a tally of the number of fishes currently being displayed below (including intuition fishes) and the baits they require.<br />
        Fish from spearfishing are not included.</p>
<div id="baitTallyDiv"></div>
<button type="button" onclick="tally('')">Refresh tally</button>`
        + document.getElementById('fish-table-container').innerHTML;
}










