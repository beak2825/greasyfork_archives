// ==UserScript==
// @name            TM hide scouts and show skills CN
// @version         2.6.6
// @description     隐藏球探并显示球探报告中的球探信息，点击球员信息中球探报告标签下方的第一行启用。适用于球探太多的俱乐部。  Click to hide unavailable scouts (for those who have a lot of scouts) and show scouts' skills in the reports
// @author          Andrizz aka Banana aka Jimmy il Fenomeno ，汉化 by 太原龙城足球俱乐部
// @include			https://trophymanager.com/players/*
// @include			*trophymanager.com/players/*
// @exclude			*trophymanager.com/players/
// @exclude			https://fb.trophymanager.com/players/
// @exclude			*trophymanager.com/players/compare/*
// @exclude			https://fb.trophymanager.com/players/compare/*
// @license         MIT
// @namespace https://greasyfork.org/users/15590
// @downloadURL https://update.greasyfork.org/scripts/377184/TM%20hide%20scouts%20and%20show%20skills%20CN.user.js
// @updateURL https://update.greasyfork.org/scripts/377184/TM%20hide%20scouts%20and%20show%20skills%20CN.meta.js
// ==/UserScript==

///////////////////////////////////////////////////////////////////////////
// SCRIPT OPTIONS: answer "yes" or "no"
var showStars = "yes"; // show gold and silver stars instead of 19 and 20
var addREC = "yes"; // add REC potential to the report
var addSkills = "yes"; // add scout's skills to the report
var countAvailable = "yes"; // count available scouts
var countReports = "yes"; // count total reports
var countInterested = "yes"; // count interested clubs
var hideUnavailable = "yes"; // hide unavailable scouts
///////////////////////////////////////////////////////////////////////////

document.getElementById("player_scout_new").addEventListener("click", function () { ScoutSkills(); HideScouts(); });
function ScoutSkills() {
    var sheet = window.document.styleSheets[0];
    sheet.insertRule('#player_scout_new tr:hover{background:#333333;}', sheet.cssRules.length);
    var elencoScout = document.getElementById("player_scout_new").getElementsByTagName("table")[0].rows;
    var scoutSkills = document.getElementById("player_scout_new").getElementsByTagName("td");
    if (showStars == "yes") {
        for (var z = 1; z<scoutSkills.length; z++) {
            if (scoutSkills[z].innerHTML == 20) scoutSkills[z].innerHTML = "<img src='/pics/star.png' alt='20' title='20' style='vertical-align: baseline; margin-bottom:-2px;'>";
            if (scoutSkills[z].innerHTML == 19) scoutSkills[z].innerHTML = "<img src='/pics/star_silver.png' alt='19' title='19' style='vertical-align: baseline; margin-bottom:-1px;'>";
        }
    }
    var Scoutata = document.getElementById("player_scout_new").getElementsByTagName("strong");
    for (var j = 0; j<Scoutata.length; j++) {
         if (addREC == "yes") {
             var Reports = Scoutata[j].parentNode.parentNode;
             var StOro = Reports.getElementsByClassName("megastar recomendation");
             var StOroVerde = Reports.getElementsByClassName("megastar recomendation_potential");
             var StVerde = Reports.getElementsByClassName("megastar potential");
             var MezStVerde = Reports.getElementsByClassName("megastar potential_half");
             var Stelle = 1*StOro.length+1*StOroVerde.length+1*StVerde.length+0.5*MezStVerde.length;
             var PotNum = Reports.childNodes[3].innerHTML.match(/\d+/);
             Reports.childNodes[3].innerHTML = Reports.childNodes[3].innerHTML.replace(/\(\d+\)/, "("+PotNum+"/"+Stelle+"*)");
         }
         if (addSkills == "yes") {
             var nome = Scoutata[j].textContent;
             var sk1 = elencoScout[0].cells[1].textContent;
             var sk2 = elencoScout[0].cells[2].textContent;
             var sk3 = elencoScout[0].cells[3].textContent;
             var sk4 = elencoScout[0].cells[4].textContent;
             var sk5 = elencoScout[0].cells[5].textContent;
             var sk6 = elencoScout[0].cells[6].textContent;
             var sk7 = elencoScout[0].cells[7].textContent;
             for (var i = 1; i<elencoScout.length; i++) {
                 var scout = elencoScout[i].cells[0].textContent;
                 if (scout == nome) {
                     var Sen = elencoScout[i].cells[1].innerHTML;
                     var Yth = elencoScout[i].cells[2].innerHTML;
                     var Phy = elencoScout[i].cells[3].innerHTML;
                     var Tac = elencoScout[i].cells[4].innerHTML;
                     var Tec = elencoScout[i].cells[5].innerHTML;
                     var Dev = elencoScout[i].cells[6].innerHTML;
                     var Psy = elencoScout[i].cells[7].innerHTML;
                     var skill = "<span class='subtle'>"+sk1+":</span>"+Sen+"<span class='subtle'> "+sk2+":</span>"+Yth+"<span class='subtle'> "+sk3+":</span>"+Phy+"<span class='subtle'> "+sk4+":</span>"+Tac+"<span class='subtle'> "+sk5+":</span>"+Tec+"<span class='subtle'> "+sk6+":</span>"+Dev+"<span class='subtle'> "+sk7+":</span>"+Psy;
                     var $div = $("<span style='font-weight:normal;text-transform:capitalize;'><br>"+skill+"</span>").appendTo(Scoutata[j]);
                 }
             }
         }
     }
     var indisponibili = document.getElementById("player_scout_new").getElementsByClassName("button disabled");
     var rimasti = (elencoScout.length) - (indisponibili.length) -1;
     var totScout = (elencoScout.length) -1;
     var slotTot = document.getElementById("player_scout_new").getElementsByTagName("table")[0].rows[0].cells[8];
     if (countAvailable == "yes") {
         slotTot.textContent = " Tot: "+rimasti+"/"+totScout;
     }
     var totScoutate = document.getElementById("tabplayer_scout_new").getElementsByTagName("div")[0];
     if (countReports == "yes") {
         if (totScoutate.textContent.indexOf(":") == (-1)) {
             totScoutate.textContent += ": "+Scoutata.length;
             } else {
                 var numScoutate = totScoutate.textContent.match(/\d+/);
                 if (numScoutate != Scoutata.length) {
                     totScoutate.textContent = totScoutate.textContent.replace(/\d+/, Scoutata.length);
                 }
             }
     }
     if (countInterested == "yes") {
         if (document.getElementById("player_scout_new").getElementsByClassName("zebra interested_clubs")[0] != null) {
             var totInteressati = document.getElementById("player_scout_new").getElementsByClassName("zebra interested_clubs")[0].rows.length;
             var Interessati = document.getElementById("player_scout_new").getElementsByTagName("h3")[0];
             if (Interessati.textContent.indexOf(":") == (-1)) {
                 Interessati.textContent += ": "+totInteressati;
             }
         }
     }
}
function HideScouts() {
    if (hideUnavailable == "yes") {
        var indisponibili = document.getElementById("player_scout_new").getElementsByClassName("button disabled");
        for (var y = 0; y<indisponibili.length; y++) {
            var pulisci = indisponibili[y].parentNode.parentNode;
            pulisci.style.display = "none";
        }
        var tabScout = document.getElementById("player_scout_new").getElementsByTagName("table")[0];
        $(tabScout).each(function() {
        $(this).find("tr").filter(":visible").removeClass("odd");
        $(this).find("tr").filter(":visible:odd").addClass("odd");
        });
    }
}