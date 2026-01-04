// ==UserScript==
// @name         ic.byteglow.com/champions - Item-Levels
// @namespace    http://tampermonkey.net/
// @version      0.6
// @license      MIT
// @description  Item-Levels and more for ic.byteglow.com/champions
// @author       Verjigorm
// @match        https://ic.byteglow.com/*
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.listValues
// @downloadURL https://update.greasyfork.org/scripts/443747/icbyteglowcomchampions%20-%20Item-Levels.user.js
// @updateURL https://update.greasyfork.org/scripts/443747/icbyteglowcomchampions%20-%20Item-Levels.meta.js
// ==/UserScript==

const gridStyleClass = "." + document.querySelector('#root > div > div > div > div > div > div:nth-of-type(2)').className.replace(' ', '.');
const maxRowCount = document.querySelectorAll('#root > div > div > div > div > div > div:nth-of-type(2) > div:first-of-type > div').length;

const columnStyleClass = document.querySelector('#root > div > div > div > div > div > div:nth-of-type(2) > div').className;
const columnStyleClass1 = columnStyleClass.split(' ')[0];
const columnStyleClass2 = columnStyleClass.split(' ')[1];

const divStyleClass = document.querySelector('#root > div > div > div > div > div > div:nth-of-type(2) > div > div:nth-of-type(2)').className;
const divStyleClass1 = divStyleClass.split(' ')[0];
const divStyleClass2 = divStyleClass.split(' ')[1];

function init() {
    'use strict';

    setTimeout(init, 1000);

    if(location.href !== 'https://ic.byteglow.com/champions' || document.querySelector('#userScriptMarker')) {
        return;
    }

    let lastRowElement;
    let lastColumnElement;
    let lastRowIndex = 0;
    let lastColumnIndex = 0;
    let spaltenSumme = 0;
    let zeilenSumme = [];
    let anzahlAlleHelden = 0;
    let anzahlSpaltenHelden = 0;

    document.querySelectorAll('div.' + columnStyleClass1 + '.' + columnStyleClass2).forEach(function(column, index) {
        spaltenSumme = 0;
        lastColumnElement = column;
        lastColumnIndex = index;
        lastRowIndex = 0;
        anzahlSpaltenHelden = 0;
        //console.log(column);

        column.querySelectorAll('div.' + divStyleClass1 + '.' + divStyleClass2).forEach(function(element, row) {
            let wert = parseInt(element.textContent);
            if (!isNaN(wert)) {
                spaltenSumme += wert;
            }
            lastRowElement = element;
            lastRowIndex = row;
            //console.log(element);
            zeilenSumme[row] = wert + (typeof zeilenSumme[row] == 'undefined' ? 0 : zeilenSumme[row]);
            anzahlAlleHelden++;
            anzahlSpaltenHelden++;
        });

        while(lastRowIndex < maxRowCount - 2) {
            let emptyDiv = createDiv(false, true);
            lastRowElement.after(emptyDiv);
            lastRowIndex++;
            lastRowElement = emptyDiv;
        }

        let div = createDiv(true, false);
        div.textContent = spaltenSumme;
        lastRowElement.after(div);
        lastRowElement = div;

        div = createDiv(true, false);
        div.textContent = Number(spaltenSumme / anzahlSpaltenHelden).toFixed(2);
        lastRowElement.after(div);
    });

    let summenSpalte = document.createElement("div");
    summenSpalte.setAttribute('class', columnStyleClass1 + ' ' + columnStyleClass2);
    summenSpalte.setAttribute('style', ' min-width: 65px;');
    let summenHeader = document.createElement("div");
    summenHeader.setAttribute('style', 'height: 33px; min-width: 65px; text-align: center');
    summenHeader.textContent = "Sum";
    summenSpalte.appendChild(summenHeader);
    lastColumnElement.after(summenSpalte);

    let durchSchnittSpalte = document.createElement("div");
    durchSchnittSpalte.setAttribute('class', columnStyleClass1 + ' ' + columnStyleClass2);
    durchSchnittSpalte.setAttribute('style', ' min-width: 65px;');
    let durchSchnittHeader = document.createElement("div");
    durchSchnittHeader.setAttribute('style', 'height: 33px; white-space: pre; text-align: center');
    durchSchnittHeader.innerHTML = "Average";
    durchSchnittSpalte.appendChild(durchSchnittHeader);

    summenSpalte.after(durchSchnittSpalte);

    zeilenSumme.forEach(function(wert, index) {
        let summenDiv = createDiv(true, true);
        summenDiv.textContent = wert;
        summenSpalte.appendChild(summenDiv);

        let durchschnittDiv = createDiv(true, true);
        durchschnittDiv.textContent = Number(wert / 12).toFixed(2);
        durchSchnittSpalte.appendChild(durchschnittDiv);
    });

    let letztesDiv = createDiv(true, false);
    letztesDiv.setAttribute('id', 'userScriptMarker');
    const sum = zeilenSumme.reduce((partialSum, a) => partialSum + a, 0);
    letztesDiv.textContent = sum;
    summenSpalte.appendChild(letztesDiv);

    let durchSchnittAlle = Number(sum / anzahlAlleHelden).toFixed(2);
    let durchSchnittDiv = createDiv(true, false);
    durchSchnittDiv.textContent = 'Average(all): ' + sum + ' / ' + anzahlAlleHelden + ' = ' + durchSchnittAlle;
    document.querySelector(gridStyleClass).after(durchSchnittDiv);

    var today = new Date().toJSON().slice(0, 10).replace('T', ' ');
    GM.setValue(today, durchSchnittAlle);

    let br = createBr();
    durchSchnittDiv.after(br);

    let uebersicht = document.createElement("div");
    br.after(uebersicht);

    (async function() {
        (await GM.listValues()).slice().reverse().forEach(async function(key) {
            let inhalt = document.createElement("div");
            inhalt.textContent += key + ': ' + await GM.getValue(key);
            uebersicht.appendChild(inhalt);
        });
    })();

    function createBr() {
        return document.createElement("br");
    }

    function createDiv(isTextAlignRight, isHeight){
        let div = document.createElement("div");
        div.setAttribute('class', divStyleClass1 + ' ' + divStyleClass2);

        let style = isTextAlignRight ? 'text-align: right; ' : '';
        style += isHeight ? 'height: 71px; line-height: 71px;' : '';
        div.setAttribute('style', style);

        return div;
    }

}
init();