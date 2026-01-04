// ==UserScript==
// @name         Worldometers COVID deaths percentage
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Changes "total tests" column to "percentage deaths"
// @author       Andreas Opferkuch
// @match        https://www.worldometers.info/coronavirus/
// @icon         https://www.google.com/s2/favicons?domain=worldometers.info
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426913/Worldometers%20COVID%20deaths%20percentage.user.js
// @updateURL https://update.greasyfork.org/scripts/426913/Worldometers%20COVID%20deaths%20percentage.meta.js
// ==/UserScript==
/*jshint esversion: 6 */

(function() {
    'use strict';
    let sorting = 'none';

    const rows=document.querySelectorAll("#main_table_countries_today tbody tr")
    for(let row of rows){
        const died = parseInt(row.querySelectorAll("td")[4].textContent.split(",").join(""), 10) || 0
        const recovered = parseInt(row.querySelectorAll("td")[6].textContent.split(",").join(""), 10)
        const element = row.querySelectorAll("td")[11]
        element.innerHTML= ((died / (died + recovered)) * 100).toFixed(2)
    }

    const header=document.querySelectorAll("#main_table_countries_today thead th")[11]
    header.innerHTML = "Percentage deaths"
    header.onclick = () => {
        const rows=Array.from(document.querySelectorAll("#main_table_countries_today tbody:first-of-type tr")).slice()
        if (sorting === "asc"){
            rows.sort((a, b) => parseFloat(a.querySelectorAll("td")[11].textContent, 10) - parseFloat(b.querySelectorAll("td")[11].textContent, 10))
            sorting = "desc"
        } else {
            rows.sort((a, b) => parseFloat(b.querySelectorAll("td")[11].textContent, 10) - parseFloat(a.querySelectorAll("td")[11].textContent, 10))
            sorting = "asc"
        }
        rows.forEach((row) => {
            document.querySelector("#main_table_countries_today tbody:first-of-type").appendChild(row)
        })
    }
})();