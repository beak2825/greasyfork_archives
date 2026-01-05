// ==UserScript==
// @name         Camo Tab view
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  view camo in tab
// @author       meatman2tasty
// @match        http://vertix.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25915/Camo%20Tab%20view.user.js
// @updateURL https://update.greasyfork.org/scripts/25915/Camo%20Tab%20view.meta.js
// ==/UserScript==

var WeaponNames = ["Machine Gun","Desert Eagle","Sniper","Grenade Launcher","Rocket Launcher","Machine Pistol","Minigun","Flamethrower"];

var b=0;
document.getElementById("charWpn").addEventListener("click",function bzero() {b=0;}, false);
document.getElementById("charWpn2").addEventListener("click",function bone() {b=1;}, false);
document.getElementById("camoList").addEventListener("click",ShowCurrentWeapon, false);     

function ShowCurrentWeapon() {
        var a = characterClasses[currentClassID].weaponIndexes[b]; /* get the weapon id */
        var x=0;
        while(camoDataList[a][x].id != getCookie("wpnSkn"+a)) { /* find the proper id of the camo */
            x=x+1;
        }
        if(b===0) { characterWepnDisplay.innerHTML = "<b>Primary:</b><div class='hatSelectItem' style='display:inline-block; color:" + getItemRarityColor(camoDataList[a][x].chance) + ";'>" + camoDataList[a][x].name + " x" + (parseInt(camoDataList[a][x].count) + 1) + "<div class='hoverTooltip'><div style='float:left; margin-top:10px; margin-right:10px; width:62px; height:62px; background:url(" + getCamoURL(camoDataList[a][x].id) + "); background-size:cover; background-repeat:no-repeat; background-position:50% 50%;'></div><div style='color:" + getItemRarityColor(camoDataList[a][x].chance) + "; font-size:16px; margin-top:5px;'>" + camoDataList[a][x].name + "</div><div style='color:#ffd100; font-size:12px; margin-top:0px;'>droprate " + camoDataList[a][x].chance + "%</div><div style='font-size:8px; color:#d8d8d8; margin-top:1px;'><i>weapon camo</i></div><div style='font-size:12px; margin-top:5px;'>" + WeaponNames[a] + " weapon skin.</div><div style='font-size:8px; color:#d8d8d8; margin-top:5px;'><i></i></div></div></div>"; }
        else { characterWepnDisplay2.innerHTML = "<b>Secondary:</b><div class='hatSelectItem' style='display:inline-block; color:" + getItemRarityColor(camoDataList[a][x].chance) + ";'>" + camoDataList[a][x].name + " x" + (parseInt(camoDataList[a][x].count) + 1) + "<div class='hoverTooltip'><div style='float:left; margin-top:10px; margin-right:10px; width:62px; height:62px; background:url(" + getCamoURL(camoDataList[a][x].id) + "); background-size:cover; background-repeat:no-repeat; background-position:50% 50%;'></div><div style='color:" + getItemRarityColor(camoDataList[a][x].chance) + "; font-size:16px; margin-top:5px;'>" + camoDataList[a][x].name + "</div><div style='color:#ffd100; font-size:12px; margin-top:0px;'>droprate " + camoDataList[a][x].chance + "%</div><div style='font-size:8px; color:#d8d8d8; margin-top:1px;'><i>weapon camo</i></div><div style='font-size:12px; margin-top:5px;'>" + WeaponNames[a] + " weapon skin.</div><div style='font-size:8px; color:#d8d8d8; margin-top:5px;'><i></i></div></div></div>"; }

}
