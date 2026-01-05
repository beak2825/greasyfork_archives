// ==UserScript==
// @name        Popop DoD
// @namespace   hiddenfield
// @description Popop de rappel DoD
// @include     http://tfs.grics.qc.ca:8080/tfs/Grics/*/*/_backlogs/taskboard/*
// @grant       none
// @version 0.0.1.20150623185443
// @downloadURL https://update.greasyfork.org/scripts/10561/Popop%20DoD.user.js
// @updateURL https://update.greasyfork.org/scripts/10561/Popop%20DoD.meta.js
// ==/UserScript==
//Activé = 1
//Désactivé = 0
var ConfigPopopDoD = 1;

var refreshTime = 1000;
setCookie('NbTacheTermine', "", 1);

window.setInterval(function() {    
    if (ConfigPopopDoD == 1) {
        PopopDoD();
    }
}, refreshTime);

// Faire un alert Vérifier DoD de tâche quand on fini une Tâche.
function PopopDoD() {
    var NbTacheTermineAncien = parseInt(getCookie('NbTacheTermine'));
    var NbTacheTermine = parseInt($('.taskboard-row .taskboard-cell:nth-child(5) .tbTileContent').length);
    setCookie('NbTacheTermine', NbTacheTermine, 1);
    if (NbTacheTermine > NbTacheTermineAncien) {
        alert ('Vérifier DoD de tâche quand on fini une Tâche.');
    }
}

function setCookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname+"="+cvalue+"; "+expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}




