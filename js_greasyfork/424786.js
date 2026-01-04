// ==UserScript==
// @name         EnemyIntel_w23
// @description  Enemy Information
// @copyright    Kalish, 2020
// @namespace    http://tampermonkey.net/
// @version      2.0
// @license      MIT
// @author       Kalish - adapted by yankoe 2021
// @match        https://w23.crownofthegods.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424786/EnemyIntel_w23.user.js
// @updateURL https://update.greasyfork.org/scripts/424786/EnemyIntel_w23.meta.js
// ==/UserScript==

/* jshint esversion:6 */

(function() {
    'use strict';
    const World = "W23";
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
        LoadSheet("https://docs.google.com/spreadsheets/d/e/2PACX-1vQwpUv7jZ3U_1fS7dp8WhlAjArCQliipK5ks5WMIak9e3Mqb--2pQmIKVQopapaqUeyvuLEJhWJHMEY/pubhtml?gid=1307941942&single=true").then(data => {
            let EnemyTropasInfo;
            data[Object.keys(data)[0]].forEach(function(entrada, index) {
                if ($("#citycoords").text() == entrada[1]) EnemyTropasInfo = entrada;
            });
            (EnemyTropasInfo != null) ? $("#IntelInfo").text(World+"-"+EnemyTropasInfo[0].split("/")[1]+"/"+EnemyTropasInfo[0].split("/")[0]+": "+EnemyTropasInfo[2]) : $("#IntelInfo").text(World+"-"+"No info");
            $("#FormLinkIntel").html("<a href='https://docs.google.com/forms/d/e/1FAIpQLSfh7KTKJemNE1ou1cegX6X7ak_shO6vc5cHB4dwiTl-laXPbw/viewform?entry.2081734940="+$('#citycoords').text()+"' target='_blank'>Open in form</a>");

        });
    });
    ObservarCidade.observe(document.querySelector("#citycoords"), {childList: true});
})();
