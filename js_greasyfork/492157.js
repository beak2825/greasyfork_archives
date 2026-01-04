// ==UserScript==
// @name         Tournament Entrant Filter
// @namespace    https://alwaysberunning.net/
// @version      2024-04-10
// @description  Filter tournaments by range of entrants
// @author       Utati
// @match        https://alwaysberunning.net/results*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=alwaysberunning.net
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492157/Tournament%20Entrant%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/492157/Tournament%20Entrant%20Filter.meta.js
// ==/UserScript==

const style = document.createElement("style");
style.innerText = `
  .-hidden-tournament {
    display: none;
  }
`;

document.head.appendChild(style);

function addForm(){
    console.log("Adding form");
    var entrants_filter_form = '<div id="filter-by-entrants">'+
        '<input id="filter-by-entrants-checkbox" name="entrantscheckbox" type="checkbox">'+
        '<label for="entrantscheckbox">Filter by entrants</label>'+
        '<br>'+
        '<input id="min-entrants" name="minentrants" type="number" value=10>'+
        '<label for="minentrants">Min Entrants</label>'+
        '<input id="max-entrants" name="maxentrants type="number" value=50>'+
        '<label for"maxentrants>max Entrants</label>';
    document.querySelector('#results-page').insertAdjacentHTML("beforebegin",entrants_filter_form);
    document.querySelector('#filter-by-entrants-checkbox').onclick = function(){console.log("checkbox clicked");checkTourneys();};
    document.querySelector('#min-entrants').oninput = function(){console.log("min updated");checkTourneys();};
    document.querySelector('#max-entrants').oninput = function(){console.log("max clicked");checkTourneys();};
}

var check_tourney_mutation_observer = (new MutationObserver(checkTourneys))
check_tourney_mutation_observer.observe(document.querySelector("#results > tbody:first-of-type"),{childList:true, subtree:true});

function checkTourneys() {
    check_tourney_mutation_observer.disconnect()
    if(
        document.getElementById("filter-by-entrants") != null &&
        document.querySelector("#min-entrants") != null &&
        document.querySelector("#max-entrants") != null ){

        var filter_by_entrants = document.querySelector("#filter-by-entrants-checkbox").checked
        var min_entrants = document.querySelector("#min-entrants").value
        var max_entrants = document.querySelector("#max-entrants").value
        // your code here
        'use strict';
        console.log("Trying to filter tournaments");
        console.log(filter_by_entrants);
        console.log(min_entrants);
        console.log(max_entrants);

        var result_table_entries = document.querySelector("#results > tbody:first-of-type").children;
        var i = 0;
        console.log("Starting Iteration: " + result_table_entries.length);
        while( i < result_table_entries.length){
            var result_entry = result_table_entries[i];
            var entrants_text = result_entry.children[5].outerText;
            var entrants_int = parseInt(entrants_text);
            if(filter_by_entrants && (entrants_int < min_entrants || entrants_int > max_entrants)){
                console.log("HIT")
                result_entry.classList.add("-hidden-tournament")
            } else{
                result_entry.classList.remove("-hidden-tournament")
            }
            i++;
        }
    }
    check_tourney_mutation_observer.observe(document.querySelector("#results > tbody:first-of-type"),{childList:true, subtree:true});
}

console.log("test");
addForm();
