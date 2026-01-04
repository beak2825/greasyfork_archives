// ==UserScript==
// @name         Neopets: Training Helper
// @version      0.1
// @description  Automatically clicks the appropriate buttons when finishing a course.
// @author       AyBeCee (clraik)
// @match        http://www.neopets.com/pirates/academy.phtml?type=courses
// @match        http://www.neopets.com/island/training.phtml?type=courses
// @match        http://www.neopets.com/pirates/academy.phtml?type=status
// @match        http://www.neopets.com/island/training.phtml?type=status
// @match        http://www.neopets.com/pirates/process_academy.phtml
// @match        http://www.neopets.com/island/process_training.phtml
// @grant        GM_setValue
// @grant        GM_getValue

// @namespace https://greasyfork.org/users/145271
// @downloadURL https://update.greasyfork.org/scripts/33192/Neopets%3A%20Training%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/33192/Neopets%3A%20Training%20Helper.meta.js
// ==/UserScript==

// change to your petname with exact capitalisation
var trainPet1 = "Petname1";
var trainPet2 = "Petname2";
var trainPet3 = "Petname3";
var trainPet4 = "Petname4";
var trainPet5 = "Petname5";

if(document.URL.indexOf("?type=status") != -1) {
    var BDstats = document.getElementById("content").getElementsByClassName("content")[0].getElementsByTagName("div")[2].getElementsByTagName("table")[0].innerHTML;
    GM_setValue('BDstats2',BDstats);
    if (document.body.innerHTML.indexOf('Course Finished!') != -1){
        setTimeout(function(){ $("[value='Complete Course!']").click();});
    }
}
if(document.URL.indexOf("?type=courses") != -1) {
    var statTable = document.createElement("table");
    document.getElementsByClassName("content")[0].getElementsByTagName("div")[2].appendChild(statTable);
    statTable.setAttribute("id", "tableStat");
    statTable.innerHTML = GM_getValue('BDstats2',0) + '<style>#tableStat img{float:left;text-align:left;margin-right:15px;width:100px;height:100px}#tableStat td:nth-child(2){display:none}#tableStat td:nth-child(1){text-align:left !important;width:650px !important}</style>';
}
if(document.URL.indexOf("/pirates/process_academy.phtml") != -1) {
    if (document.body.innerHTML.indexOf('Congratulations') != -1){
        window.location.href = "http://www.neopets.com/pirates/academy.phtml?type=courses";
    }
}
if(document.URL.indexOf("/island/process_training.phtml") != -1) {
    if (document.body.innerHTML.indexOf('Congratulations') != -1){
        window.location.href = "http://www.neopets.com/island/training.phtml?type=courses";
    }
}
if (document.body.innerHTML.indexOf(trainPet1) != -1){
    $("select option[value=" + trainPet1 + "]").prop("selected","selected");
}
if (document.body.innerHTML.indexOf(trainPet2) != -1){
    $("select option[value=" + trainPet2 + "]").prop("selected","selected");
}
if (document.body.innerHTML.indexOf(trainPet3) != -1){
    $("select option[value=" + trainPet3 + "]").prop("selected","selected");
}
if (document.body.innerHTML.indexOf(trainPet4) != -1){
    $("select option[value=" + trainPet4 + "]").prop("selected","selected");
}
if (document.body.innerHTML.indexOf(trainPet5) != -1){
    $("select option[value=" + trainPet5 + "]").prop("selected","selected");
}