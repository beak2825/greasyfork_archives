// ==UserScript==
// @name         EnemyIntel_w24
// @description  Enemy Information
// @copyright    Kalish 2020
// @namespace    http://tampermonkey.net/
// @version      2.1
// @license      MIT
// @author       Kalish - adapted by yankoe & Swiftfall 2021
// @match        https://w24.crownofthegods.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429959/EnemyIntel_w24.user.js
// @updateURL https://update.greasyfork.org/scripts/429959/EnemyIntel_w24.meta.js
// ==/UserScript==

/* jshint esversion:6 */

(function() {
    'use strict';
    const World = "W24";
    function LoadSheet(sheet) {
        return fetch(sheet)
            .then((response) => {return response.text();})
            .then((html) => {
            let nome, data = new Array(), planilha = new DOMParser().parseFromString(html, "text/html");
            planilha.querySelectorAll(".waffle > tbody").forEach(function(tbody, tabela) {
                nome = planilha.querySelector("#sheet-menu") ? planilha.querySelectorAll("#sheet-menu > li > a")[tabela].innerHTML : planilha.querySelector("#doc-title > span").innerHTML.split(": ")[1];
                data[nome] = [];
                tbody.querySelectorAll("tr").forEach(function(tr, linha) {
                    data[nome].push([]);
                    tr.querySelectorAll("td").forEach(function(td, coluna) {
                        if(td.innerHTML) data[nome][linha].push(td.innerHTML);
                        else data[nome][linha].push("");
                    });
                });
            });
            return data;
        });
    }
    $("#cityplayerInfo").append("<div class='smallredheading'><small><p id='IntelInfo'></p><p id='FormLinkIntel'></p></small></div>");
    const ObservarCidade = new MutationObserver(function() {
        LoadSheet("https://docs.google.com/spreadsheets/d/1ohck_HddwzYwRR2npvq8STBRaGzjrZxQqyAdCXahD08/pubhtml?gid=599684398&single=true").then(data => {
            let EnemyTropasInfo;
            data[Object.keys(data)[0]].forEach(function(entrada, index) {
                if ($("#citycoords").text() == entrada[1]) EnemyTropasInfo = entrada;
            });
            (EnemyTropasInfo != null) ? $("#IntelInfo").text(World+"-"+EnemyTropasInfo[0].split("/")[1]+"/"+EnemyTropasInfo[0].split("/")[0]+": "+EnemyTropasInfo[2]) : $("#IntelInfo").text(World+"-"+"No info");
            $("#FormLinkIntel").html("<a href='https://docs.google.com/forms/d/1H2GOnW-xVTGDAbeU7HkaYlge_SiD4euzwA4eTKiAm9c/viewform?entry.2081734940="+$('#citycoords').text()+"' target='_blank'>Open in form</a>");

        });
    });
    ObservarCidade.observe(document.querySelector("#citycoords"), {childList: true});
})();
