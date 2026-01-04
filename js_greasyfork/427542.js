// ==UserScript==
// @name         CS-TableLayouter
// @namespace    jp.gr.java_conf.kyu49.cstl
// @version      1.0.3
// @description  Reshape the score table of New Pokemon Snap page in Cyberscore.
// @author       KYU
// @include      https://cyberscore.me.uk/game/2785*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/427542/CS-TableLayouter.user.js
// @updateURL https://update.greasyfork.org/scripts/427542/CS-TableLayouter.meta.js
// ==/UserScript==
(function(){
    let tables = document.getElementsByClassName("gamelist")[0];
    const pokemonNum = tables.tBodies[0].getElementsByClassName("chart").length;

    let table = document.createElement("table");
    table.classList.add("gamelist");
    let tbody = document.createElement("tbody");
    table.appendChild(tbody);
    for(let i = 0; i < pokemonNum; i++){
        let row = document.createElement("tr");
        row.classList.add("chart");
        tbody.appendChild(row);
    }

    for(let i = 0; i < 4; i++){
        let charts = tables.tBodies[i].getElementsByClassName("chart");
        for(let j = 0; j < charts.length; j++){
            let chart = charts[j];
            let rank = chart.children[0];
            let link = chart.children[1];
            let score = chart.children[2];

            if(i == 0){
                let pokemonName = document.createElement("td");
                pokemonName.appendChild(document.createTextNode(link.innerText.replaceAll(/\s/g,"")));
                tbody.children[j].appendChild(pokemonName);
            }

            let td = document.createElement("td");
            let small = document.createElement("small");
            td.appendChild(small);
            for(let k = 0; k < rank.children.length; k++){
                small.appendChild(rank.children[k].cloneNode(true));
            }
            let newLink = link.getElementsByTagName("a")[0].cloneNode(true);
            newLink.innerText = score.innerText.replace(/\n/g, "");
            td.appendChild(newLink);
            tbody.children[j].appendChild(td);
        }
    }

    let row = document.createElement("tr");
    row.classList.add("group");
    row.classList.add("standard");
    row.appendChild(document.createElement("td"));
    for(let i = 0; i < 4; i++){
        let td = document.createElement("td");
        td.appendChild(document.createTextNode((i+1)+"★"));
        row.appendChild(td);
    }
    tbody.insertBefore(row, tbody.firstChild);

    let pageleft = document.getElementById("pageleft");
    pageleft.insertBefore(table, pageleft.children[4]);
})();