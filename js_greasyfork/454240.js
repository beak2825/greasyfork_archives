// ==UserScript==
// @name         Home Office Liste Script
// @namespace    merkur.at
// @version      1.1.0
// @description  Erweiterungen für die Home Office Liste
// @author       Herbert Legenstein & Julian Fiechtl
// @match        https://confluence.merkur.net/display/BO/Home+Office+MG-O
// @match        https://confluence.merkur.net/pages/viewpage.action?spaceKey=BO&title=Home+Office+MG-O
// @icon         https://www.google.com/s2/favicons?sz=64&domain=merkur.net
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454240/Home%20Office%20Liste%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/454240/Home%20Office%20Liste%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const username = document.getElementsByName("ajs-user-display-name")[0]?.content;
    const rows = document.querySelectorAll("table tbody tr");

    for(let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if(row.cells[0]?.innerText.toLowerCase().includes(username?.split(" ")[1].toLowerCase())) {
            row.style.backgroundColor = "yellow";
        }
    }

    const tipId = 'homeOfficeTipId';

    document.addEventListener("mousemove", function(evt) {
        let tip = document.getElementById(tipId);
        let showHint = false;
        if (evt && evt.srcElement) {
            let td = findTd(evt.srcElement);
            if (td) {
                let tr = td.parentElement;
                let tds = tr.getElementsByTagName('td');
                if (tds && tds.length > 0) {
                    let person = tds[0].innerText;
                    let index = Array.from(tds).findIndex((element) => element === td);
                    if (index >= 0) {
                        let tbody = tr.parentElement;
                        let trs = tbody.getElementsByTagName('tr');
                        if (trs && trs.length > 0) {
                            // Finde Datum zur gewählten Zelle
                            let firstRowTds = trs[0].getElementsByTagName('td');
                            let date = firstRowTds[index].innerText;

                            // Suche nach allen selektierten Checkboxen der O30 an diesem Tag
                            let isO30 = false;
                            let o30Counter = 0;
                            Array.from(trs).forEach((row) => {
                                let cols = row.getElementsByTagName('td');
                                let text = cols[0].innerText || '';
                                if (/O\/30/.test(text)) {
                                    isO30 = true;
                                } else if (/Betriebliche Organisation/.test(text)) {
                                    isO30 = false;
                                }
                                if (isO30) {
                                    if(date == getDateString()) {
                                        cols[index].style.backgroundColor = "yellow";
                                    }
                                    // Zähle Eintrag, wenn Checkbox selektiert
                                    let checkedTags = cols[index].getElementsByClassName('checked');
                                    if (checkedTags && checkedTags.length>0 && checkedTags[0].nodeName=='LI') {
                                        o30Counter++;
                                    }
                                }
                            });
                            showHint = true;
                            if ( ! tip) {
                                // erstelle tip
                                tip = document.createElement('div');
                                tip.id = tipId;
                                tip.style.position = 'absolute';
                                document.body.appendChild(tip);
                            }
                            tip.style.left = evt.pageX + 'px';
                            tip.style.top = (evt.pageY + 20) + 'px';
                            tip.style.display = '';
                            tip.style.backgroundColor = o30Counter > 23 ? 'red' : '#AAFFAA';
                            tip.innerHTML = '<b>'+person+' '+date+'<br>Anzahl O30 an diesem Tag: '+o30Counter+'</b>';
                        }
                    }
                }
            }
            if ( (!showHint) && tip) {
                tip.parentElement.removeChild(tip);
            }
        }
    });

    let cleanUpFunction = function(evt) {
        let tip = document.getElementById(tipId);
        if (tip) {
            tip.parentElement.removeChild(tip);
        }
    };

    document.addEventListener("scroll", cleanUpFunction);
    document.addEventListener("mousedown", cleanUpFunction);

    function findTd(element) {
        if (element) {
            if ('TD' === element.nodeName) {
                return element;
            }
            return findTd(element.parentNode);
        }
        return null;
    }

    function getDateString(date = new Date()) {
        const d = date.getDate();
        const m = date.getMonth()+1;
        const y = date.getFullYear();

        return `${d > 9 ? d : "0" + d}.${m > 9 ? m : "0" + m}.${y}`;
    }
})();