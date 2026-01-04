// ==UserScript==
// @name         [Mountyhall] infos suivants
// @namespace    Mountyhall
// @description  ajoute les points de vie et le dernier ordre en cours sur la page des suivants
// @author       Zul
// @version      0.1.0.0
// @include      *mountyhall*
// @downloadURL https://update.greasyfork.org/scripts/370356/%5BMountyhall%5D%20infos%20suivants.user.js
// @updateURL https://update.greasyfork.org/scripts/370356/%5BMountyhall%5D%20infos%20suivants.meta.js
// ==/UserScript==

function get_information(link, fol, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", link, true);
    xhr.responseType = "document";
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            callback(fol, xhr.responseXML);
        }
    };
    xhr.send(null);
}

function decorateFollowers() {

    var followers = document.getElementsByClassName("mh_titre3");
    for (i = 0; i < followers.length; i++) {

        var follower = followers[i];
        link = follower.getElementsByTagName('a')[0].getAttribute('href');
        get_information(link, follower, function(f, text) {
            manageFollower(text, f);
        });
      
        var id = follower.getElementsByTagName('a')[0].getAttribute('href').replace("../MH_Follower/FO_Profil.php?ai_IdFollower=", "");  
        var ordersLink = document.location.origin + "/mountyhall/MH_Follower/FO_Ordres.php?ai_IdFollower=" + id;
        get_information(ordersLink, follower, function(f, text) {
            manageFollowerOrders(text, f);
        });
    }
}

function manageFollower(page_profil, tdF) {
    var pvActuels = getPVActuels(page_profil);
    var pvMax = getPVMax(page_profil);
    var newCell = tdF.parentNode.insertCell(-1);
    var newText = document.createTextNode(pvActuels + "/" + pvMax);
    newCell.appendChild(newText);
}

function manageFollowerOrders(page_ordres, tdF) {
    console.log(page_ordres);
    var ordre = getOrdre1(page_ordres);
    var newCell = tdF.parentNode.insertCell(-1);
    var newText = document.createTextNode(ordre);
    newCell.appendChild(newText);
}

function getOrdre1(page_ordres) {
    var td = page_ordres.evaluate('//*[@id="mhPlay"]/table[2]/tbody/tr[2]/td[3]', page_ordres, null, 9, null).singleNodeValue;;
    var ordre = td.textContent;
    return ordre;
}

function getPVActuels(page_profil) {
    var td = page_profil.evaluate("//table[@class='mh_tdborder_fo']/descendant::td[contains(./text(),'Actuels')]", page_profil, null, 9, null).singleNodeValue;
    var pvActuels = td.textContent.match(/\d+/)[0];
    return pvActuels;
}

function getPVMax(page_profil) {
    var td = page_profil.evaluate("//table[@class='mh_tdborder_fo']/descendant::td[contains(./text(),'Actuels')]", page_profil, null, 9, null).singleNodeValue; 
    var pvMax = td.textContent.match(/: (\d+)/)[1];
    return pvMax;
}

function isPage(url) {
    return window.location.pathname.indexOf("/mountyhall/" + url) == 0;
}

try {
    if (isPage("MH_Play/Play_e_follo.php")) {
        decorateFollowers();
    }

} catch (e) {
    alert(e);
}