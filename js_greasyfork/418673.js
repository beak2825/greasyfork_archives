// ==UserScript==
// @name         [hwm]_quick_change_fraction
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @include       https://www.heroeswm.ru/*
// @include       https://www.lordswm.com/*
// @include       https://178.248.235.15/*
// @exclude       https://www.heroeswm.ru/radio_files/*
// @exclude       https://178.248.235.15/radio_files/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418673/%5Bhwm%5D_quick_change_fraction.user.js
// @updateURL https://update.greasyfork.org/scripts/418673/%5Bhwm%5D_quick_change_fraction.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let url = new URL(window.location.href);
    let lang = url.hostname.includes(".com");
    let xmlHttp = new XMLHttpRequest();

    let classId = 0;


    let factions =
        lang ? [ {id: 1, name:"Knight"},
                {id: 101, name:"Holy Knight"},
                {id: 2, name:"Necromancer"},
                {id: 102, name:"Unholy Necromancer"},
                {id: 3, name:"Wizard"},
                {id: 103, name:"Battlewise Wizard"},
                {id: 4, name:"Elf"},
                {id: 104, name:"Charmer Elf"},
                {id: 5, name:"Barbarian"},
                {id: 105, name:"Fury Barbarian"},
                {id: 205, name:"Shadow Barbarian"},
                {id: 6, name:"Dark Elf"},
                {id: 106, name:"Tamer Elf"},
                {id: 7, name:"Demon"},
                {id: 107, name:"Dark Demon"},
                {id: 8, name:"Dwarf"},
                {id: 108, name:"Fire Dwarf"},
                {id: 9, name:"Tribal"},
                {id: 10, name:"Pharaoh"}
               ]
        : [ {id: 1, name:"Рыцарь"},
                {id: 101, name:"Рыцарь Света"},
                {id: 2, name:"Некромант"},
                {id: 102, name:"Некромант - повелитель смерти"},
                {id: 3, name:"Маг"},
                {id: 103, name:"Маг-разрушитель"},
                {id: 4, name:"Эльф"},
                {id: 104, name:"Эльф-заклинатель"},
                {id: 5, name:"Варвар"},
                {id: 105, name:"Варвар крови"},
                {id: 205, name:"Варвар-шаман"},
                {id: 6, name:"Тёмный Эльф"},
                {id: 106, name:"Темный эльф-укротитель"},
                {id: 7, name:"Демон"},
                {id: 107, name:"Демон тьмы"},
                {id: 8, name:"Гном"},
                {id: 108, name:"Гном огня"},
                {id: 9, name:"Степной Варвар"},
                {id: 10, name:"Фараон"}
               ]
    ;
    init();
    function init(){
        findAndInsertFactionsSpan();
        fillFactionsSpan();
    }
    function send(method, url, params, afterSend) {
        xmlHttp.open(method, url, true);
        if (method == "POST") {
            xmlHttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        }
        xmlHttp.overrideMimeType('text/plain; charset=windows-1251');
        xmlHttp.onreadystatechange = afterSend;
        xmlHttp.send(params);
    }
    function afterSend() {
        if (xmlHttp.readyState == 4) {
            if (xmlHttp.status == 200) {
                if (classId > -1) {
                    send("POST", url.origin + "/castle.php", "classid=" + classId, afterSend);
                    classId = -1;
                } else {
                    location.href = url.origin + "/home.php";
                }
            }
        }
    }
    function findAndInsertFactionsSpan(){
        let tables = document.getElementsByTagName("table");

        for (let table_id in tables){ //if user has not set any custom links
            let table = tables[table_id];
            if (table.innerHTML && table.parentNode.tagName == "CENTER" && table.innerHTML.indexOf('height="6px"') > -1){
                table.innerHTML = "<tr><td><span style='position: relative;' id='factionsSpan'></span></td></tr>";
                break;
            }
        }

        let factionsSpan = document.getElementById("factionsSpan");

        if (factionsSpan == null){ //if user has set custom links
            let centers = document.getElementsByTagName("center");
            for (let center_id in centers){
                let center = centers[center_id].innerHTML;
                if (center && (center.indexOf('<a href="skillwheel.php" class="pi">Talents <font style="font-size:8px;">▼</font></a>') > -1 || center.indexOf('<a href="skillwheel.php" class="pi">Навыки <font style="font-size:8px;">▼</font></a>') > -1)){ //check if player has the talents option from shortcuts enabled.
                    if (centers[center_id].children[0].children[0].children[0].tagName == "TR"){
                        centers[center_id].children[0].children[0].children[0].innerHTML += "<td> | <span style='position: relative;display: inline-block;' id='factionsSpan'></span></td>";
                    } else { //if new design of header need to move down 1 extra child.
                        centers[center_id].children[0].children[0].children[0].children[0].innerHTML += "<td> | <span style='position: relative;display: inline-block;' id='factionsSpan'></span></td>";
                    }
                    break;
                }//no talents set for next one
                else if (center && (center.indexOf("center>") < 0 || centers[center_id].children[0].tagName == "DIV") && center.indexOf("<a ") > -1 && center.indexOf("sh_container") < 0){
                    if (centers[center_id].children[0].tagName == "DIV"){ //if new design of header, need to move down 1 again
                        centers[center_id].children[0].innerHTML = centers[center_id].children[0].innerHTML + " | <span style='position: relative;display: inline-block;' id='factionsSpan'></span>";
                    } else {
                        centers[center_id].innerHTML = center + " | <span style='position: relative;display: inline-block;' id='factionsSpan'></span>";
                    }
                    break;
                }
            }
        }

        factionsSpan = document.getElementById("factionsSpan");
        let factionsDropdownContentCss = "display: none;position: absolute;background-color: grey;z-index:100;overflow-y: auto;padding-right: 13px; max-height: 300px;";
        factionsSpan.innerHTML = `<a class='pi' href='castle.php'>${lang ? "Factions" : "Фракции"}</a>
                                  <div id='factionsDropdownContent' style='${factionsDropdownContentCss}'></div>`;
    }

    function fillFactionsSpan(){
        let factionsDropdownContent = document.getElementById("factionsDropdownContent");
        let factionsMenu = "<table style='border-collapse: collapse;cursor: pointer;'>";
        factions.forEach(faction => {
            factionsMenu += `<tr data-factionId='${faction.id}' id='factionSelectId_${faction.id}' class='factionSelectLine' style='background-color: #6b6c6a;'>
                                  <td data-factionId='${faction.id}' class='factionIcon' style='padding: 2px;'>
                                       <img data-factionId='${faction.id}' width='15px' height='15px' src='https://dcdn.heroeswm.ru/i/f/r${faction.id}.png'/>
                                  </td>
                                  <td data-factionId='${faction.id}' class='factionName' style='padding: 2px;color: #ffd875; white-space: nowrap;'>
                                       ${faction.name}
                                  </td>
                             </tr>`
                         });
        factionsDropdownContent.innerHTML = factionsMenu;
        //decoratory
        let factionsSpan = document.getElementById("factionsSpan");
        factionsSpan.addEventListener("mouseover", () => {
            factionsDropdownContent.style.display = "block";
        });
        factionsSpan.addEventListener("mouseleave", () => {
            factionsDropdownContent.style.display = "none";
        });
        Array.from(document.getElementsByClassName("factionSelectLine")).forEach(function(element){
            element.addEventListener('mouseover', function(event){
                event.target.parentNode.tagName === 'TR'? event.target.parentNode.style = 'background-color: #757575' : event.target.parentNode.parentNode.style = 'background-color: #757575';
            });
            element.addEventListener('mouseleave', function(event){
                event.target.style = 'background-color: #6b6c6a';
            });
            //end of decoratory
            element.addEventListener('click', function(event){
                let factionId = event.target.dataset.factionid;
                if (factionId / 100 >= 1){
                    classId = Math.floor(factionId / 100);
                    factionId = factionId - (classId * 100);
                }
                element.children[1].innerHTML += "<img width='10px' height='10px' src='http://dcdn2.heroeswm.ru/i/loading.gif'/>";
                send ("POST", url.origin + "/castle.php", "fract=" + factionId, afterSend);
            });
        });
        console.log(url);
    }
})();