// ==UserScript==
// @name         Percent Comp Work Shower
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Shows work for Percent Comp
// @author       Mikerific
// @match        http://www.chemhaven.org/che101/tools/percentcomp/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376957/Percent%20Comp%20Work%20Shower.user.js
// @updateURL https://update.greasyfork.org/scripts/376957/Percent%20Comp%20Work%20Shower.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var elements = document.getElementsByTagName("tr");
    var length = elements.length-2;
    var work = "";
    var title = document.createElement('td');
    title.innerText = 'Fraction';
    elements[0].appendChild(title);
    for(var i = 1; i <= length; i++) {
        var number = parseInt(elements[i].childNodes[2].textContent);
        var mass = parseFloat(elements[i].childNodes[3].textContent);
        var percent = parseFloat(elements[i].childNodes[4].textContent);
        var total = parseFloat(elements[length+1].childNodes[1].textContent.split('= ')[1]);
        if(i == length) {
            work = work + number*mass + "=" + total;
        } else {
            work = work + number*mass + "+";
        }
        var fraction = document.createElement('td');
        fraction.innerText = number*mass + "/" + total + " = " + Math.round(percent*10)/10 + "%";
        elements[i].appendChild(fraction);
    }
    var formula = document.createElement('tr');
    formula.innerHTML = '<td width="250px" class="title">Formula = '+work+'</td>';
    var table = document.getElementsByTagName("tbody")[1];
    table.appendChild(formula);
})();