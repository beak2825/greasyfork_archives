// ==UserScript==
// @name         Karakterkalkulator
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Se gjennomsnittskarakter i fsweb!
// @author       You
// @match        https://fsweb.no/studentweb/resultater.jsf
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fsweb.no
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459826/Karakterkalkulator.user.js
// @updateURL https://update.greasyfork.org/scripts/459826/Karakterkalkulator.meta.js
// ==/UserScript==

function fractConverter(fract)
{
    if(fract==0 || Math.abs(fract) < 0.33333)
    {
        return "";
    }
    else if (fract < 0)
    {
        return "-";
    }
    return "+";
}

function main()
{
    const rows = document.querySelectorAll(".resultatTop");
    let weigthSum = 0;
    let gradeAvg = 0;
    let gradeLookup = {"A":5,"B":4,"C":3,"D":2,"E":1,"F":0};
    let gradeLookup2 = {5:"A",4:"B",3:"C",2:"D",1:"E",0:"F"};

    for(let row of rows)
    {
        try{

            var gradeEl = row.querySelector("td.col6Resultat.textAlignRight > div.infoLinje > span");
            var weightEl = row.querySelector("td.col7Studiepoeng.textAlignRight > span");

            var grade = gradeEl.innerHTML;
            var weigth = weightEl.innerHTML;

            grade = gradeLookup[grade];
            weigth = Number(weigth)

            weigthSum += weigth
            gradeAvg += weigth*grade;
        }catch(e){continue;}
    }
    gradeAvg /= weigthSum;
    gradeAvg = gradeAvg.toFixed(2);
    const rounded = Math.round(gradeAvg);
    const prefix = gradeLookup2[rounded];
    const suffix = fractConverter(gradeAvg-rounded);
    const gradeLetter = prefix + suffix;
    const el = document.querySelector("p.table-footer");
    el.innerHTML += "<span style=\"padding-left: 30px;\">Gjennomsnitt: "+gradeLetter+" ("+gradeAvg+"GPA)</span>";
}

(function() {
    'use strict';

    window.onload = main;
})();