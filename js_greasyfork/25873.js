// ==UserScript==
// @name         Vertix Show Selected Camo
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Shows the selected camo, and a preview of the camo.
// @author       Supercap
// @match        http://vertix.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25873/Vertix%20Show%20Selected%20Camo.user.js
// @updateURL https://update.greasyfork.org/scripts/25873/Vertix%20Show%20Selected%20Camo.meta.js
// ==/UserScript==

var realClassInfo = [];
realClassInfo.push({
    realName: "Tony Cavalaro",
    prime: "SMG",
    second: "",
    url: "https://b.thumbs.redditmedia.com/3SB6OOt62UmKqsJfaD2NOmV15y6qdEec5hyUXlXIU0s.png"
});
realClassInfo.push({
    realName: "Detective Valentine",
    prime: "Desert Eagle",
    second: "Grenade Launcher",
    url: "https://b.thumbs.redditmedia.com/d0ydWrUlVAXA6wABIQdM5_A1zjdTzFIVVS5NwSTFmUA.png"
});
realClassInfo.push({
    realName: "John Nash",
    prime: "Sniper Rifle",
    second: "Fully-automatic Pistol",
    url: "https://b.thumbs.redditmedia.com/2Uzmgj6pLZKDdbUIn_1YF-eE5dVB8NtBsPqYBJ4V-7M.png"
});

realClassInfo.push({
    realName: "Billy",
    prime: "Toy Blaster",
    second: "",
    url: "https://b.thumbs.redditmedia.com/QjbAlNx5lk0m6G6G9wxyBuwYN-j_Vkcst8pbrtZLjdw.png"
});

realClassInfo.push({
    realName: "Vincent De Vries",
    prime: "Shotgun",
    second: "Grenade Launcher",
    url: "https://b.thumbs.redditmedia.com/SWWX4FlRtlGVcqj_AioVe-edfgXXuV4twVJJah64nbw.png"
});

realClassInfo.push({
    realName: "General Weiss",
    prime: "Rocket Launcher",
    second: "",
    url: "https://b.thumbs.redditmedia.com/2ykC2EWG7I_Var-c6zFhKD0J7bVBoXBZ7JKxiLSs6Kk.png"
});
realClassInfo.push({
    realName: "Hank",
    prime: "Minigun",
    second: "",
    url: "https://b.thumbs.redditmedia.com/BU_G_AyJYAItnngBhMzuzJ-ht7gui9MZT_YXUuIdWoo.png"
});

realClassInfo.push({
    realName: "Aronsit",
    prime: "Flame Thrower",
    second: "",
    url: "https://b.thumbs.redditmedia.com/WomacWBYSl5lVXPthxJG-ab_ZZC9yqBvl1vVRrBtghY.png"
});

realClassInfo.push({
    realName: "Duck",
    prime: "Jump",
    second: "",
    url: "https://b.thumbs.redditmedia.com/8TR5TxMkvbuuP1W1e6FfDACDaKN2U6rv4qm78_xpH-g.png"
});

realClassInfo.push({
    realName: "Nademan",
    prime: "Nade Launcher",
    second: "",
    url: "https://b.thumbs.redditmedia.com/36ecl8FUeDO2IQ717-Q2I68GBkFN5zhRC6mVhrhs4as.png"
});



function showClassInfo() {
    try {
        var classDisplay = document.getElementById("charClass");
        classDisplay.innerHTML = "<b>Secondary:</b><div onclick=\"showClassselector();\" class='hatSelectItem' style='display:inline-block; color:rgba(0, 0, 0, 0.4);'>"+ characterClasses[currentClassID].classN +"<div class='hoverTooltip'><div style='float:left; margin-top:10px; margin-right:10px; width:62px; height:62px; background:url("+ realClassInfo[currentClassID].url +"); background-size:cover; background-repeat:no-repeat; background-position:50% 50%;'></div><div style='color:; font-size:16px; margin-top:5px;'>"+ realClassInfo[currentClassID].realName + "</div><div style='color:#ffd100; font-size:12px; margin-top:0px;'>"+ realClassInfo[currentClassID].prime +"</div><div style='font-size:8px; color:#d8d8d8; margin-top:1px;'>"+ realClassInfo[currentClassID].second +"</div><div style='font-size:12px; margin-top:5px;'></div><div style='font-size:8px; color:#d8d8d8; margin-top:5px;'><i></i></div></div></div>";
    } catch(err) {
    }
}

// weapon skin code
var b=0;

var interval = setInterval(function(){
    if(document.getElementById("playerNameInput").value !== "") {
        showClassInfo();
        ShowCurrentWeaponAll();

        document.getElementById("classItem0").addEventListener("click", showClassInfo, false);
        document.getElementById("classItem1").addEventListener("click", showClassInfo, false);
        document.getElementById("classItem2").addEventListener("click", showClassInfo, false);
        document.getElementById("classItem3").addEventListener("click", showClassInfo, false);
        document.getElementById("classItem4").addEventListener("click", showClassInfo, false);
        document.getElementById("classItem5").addEventListener("click", showClassInfo, false);
        document.getElementById("classItem6").addEventListener("click", showClassInfo, false);
        document.getElementById("classItem7").addEventListener("click", showClassInfo, false);
        document.getElementById("classItem8").addEventListener("click", showClassInfo, false);
        document.getElementById("classItem9").addEventListener("click", showClassInfo, false);
        document.getElementById("charWpn").addEventListener("click",function bzero() {b=0;}, false);
        document.getElementById("charWpn2").addEventListener("click",function bone() {b=1;}, false);
        document.getElementById("camoList").addEventListener("click",ShowCurrentWeapon, false);
        document.getElementById("classList").addEventListener("click",ShowCurrentWeaponAll, false);
        clearInterval(interval);
    }
}, 100);

function ShowCurrentWeaponAll() {
    b=0;
    ShowCurrentWeapon();
    b=1;
    ShowCurrentWeapon();
}

function ShowCurrentWeapon() {
    try {
        var a = characterClasses[currentClassID].weaponIndexes[b]; /* get the weapon id */
        var x=0;
        if(getCookie("wpnSkn"+a) !=getCookie("wpnSknundefined")) { /* if the default weapon is NOT selected */
            while(camoDataList[a][x].id != getCookie("wpnSkn"+a)) { /* find the proper id of the camo */
                x=x+1;
            }
        }
        else { /* if the defualt weapon is selected */
            if(camoDataList[a][x].name != "Art of War") { /* this is a work around to the bug in vertix, Art of War and default have the same id */
                if(b===0) { characterWepnDisplay.innerHTML = "<b>Primary:</b><div class='hatSelectItem' style='display:inline-block'>" + characterClasses[currentClassID].pWeapon + "</div>"; }
                else { characterWepnDisplay2.innerHTML = "<b>Secondary:</b><div class='hatSelectItem' style='display:inline-block'>" + characterClasses[currentClassID].sWeapon + "</div>"; }
                return;
            }
        }
        if(b===0) { characterWepnDisplay.innerHTML = "<b>Primary:</b><div class='hatSelectItem' style='display:inline-block; color:" + getItemRarityColor(camoDataList[a][x].chance) + ";'>" + camoDataList[a][x].name + " x" + (parseInt(camoDataList[a][x].count) + 1) + "<div class='hoverTooltip'><div style='float:left; margin-top:10px; margin-right:10px; width:62px; height:62px; background:url(" + getCamoURL(camoDataList[a][x].id) + "); background-size:cover; background-repeat:no-repeat; background-position:50% 50%;'></div><div style='color:" + getItemRarityColor(camoDataList[a][x].chance) + "; font-size:16px; margin-top:5px;'>" + camoDataList[a][x].name + "</div><div style='color:#ffd100; font-size:12px; margin-top:0px;'>droprate " + camoDataList[a][x].chance + "%</div><div style='font-size:8px; color:#d8d8d8; margin-top:1px;'><i>weapon camo</i></div><div style='font-size:12px; margin-top:5px;'>" + characterClasses[currentClassID].pWeapon + " weapon skin.</div><div style='font-size:8px; color:#d8d8d8; margin-top:5px;'><i></i></div></div></div>"; }
        else { characterWepnDisplay2.innerHTML = "<b>Secondary:</b><div class='hatSelectItem' style='display:inline-block; color:" + getItemRarityColor(camoDataList[a][x].chance) + ";'>" + camoDataList[a][x].name + " x" + (parseInt(camoDataList[a][x].count) + 1) + "<div class='hoverTooltip'><div style='float:left; margin-top:10px; margin-right:10px; width:62px; height:62px; background:url(" + getCamoURL(camoDataList[a][x].id) + "); background-size:cover; background-repeat:no-repeat; background-position:50% 50%;'></div><div style='color:" + getItemRarityColor(camoDataList[a][x].chance) + "; font-size:16px; margin-top:5px;'>" + camoDataList[a][x].name + "</div><div style='color:#ffd100; font-size:12px; margin-top:0px;'>droprate " + camoDataList[a][x].chance + "%</div><div style='font-size:8px; color:#d8d8d8; margin-top:1px;'><i>weapon camo</i></div><div style='font-size:12px; margin-top:5px;'>" + characterClasses[currentClassID].sWeapon + " weapon skin.</div><div style='font-size:8px; color:#d8d8d8; margin-top:5px;'><i></i></div></div></div>"; }
    }
    catch (err) {
    }
}