// ==UserScript==
// @name         Iaomai unblock
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  watch2gether ads remove
// @author       Flejta
// @include https://www.iaomai.app/app*
// @include https://www.iaomai.app/app/v1_2/index.html
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452244/Iaomai%20unblock.user.js
// @updateURL https://update.greasyfork.org/scripts/452244/Iaomai%20unblock.meta.js
// ==/UserScript==

setInterval(function() {modMeridiani () }, 1000);
setInterval(function() {modPatologie () }, 2000);
setInterval(function() {modTeoria () }, 2000);
setInterval(function() {abilitaStampa () }, 2000);
setInterval(function() {aggiungiTastoCopy () }, 2000);
setInterval(function() {abilitaVecchiaVer () }, 1000);

function aggiungiTastoCopy(){
    try {
        if (document.getElementById('menuScheda') == null){return;}
        if (document.getElementById('BcopiaTesto') != null){return;}
        var buttonEl = document.createElement("div");
        buttonEl.innerText = "Copia il testo";
        //buttonEl.addEventListener("click", fcopyToClipboard);
        buttonEl.onclick = "fcopyToClipboard()";
        buttonEl.id = "BcopiaTesto";
        var e = document.getElementById("menuScheda");
        e.appendChild(buttonEl);
    }
    catch(err) {
        alert (err);
    }
};

function fcopyToClipboard() {
    try {
        var copyText = document.getElementById("scheda_testo").innerText;
        navigator.clipboard.writeText(copyText).then(() => {
        alert("testo copiato");
        });
    }
    catch(err) {
    }
}

function abilitaStampa(){
    try {
        DB.login.data.auths.push("Flejta");
        //DB.login.data.TOKEN = "Flejta";
        var element = document.getElementById('notLogged');
        element.remove();
    }
    catch(err) {
    }
}

function modMeridiani(){
    try {
        MODULO_MERIDIANI.MERIDIANI_free = [ "LR", "GB", "BL", "KI", "ST", "SP", "SI", "HT", "TE", "PC", "CV", "GV", "LI", "LU" ];
    }
    catch(err) {
    }
};

function modPatologie(){
    try {
        MODULO_PATOLOGIE.PATOLOGIE_free = [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140 ];
    }
    catch(err) {
    }
};

function modTeoria(){
    try {
        MODULO_TEORIA.TEORIA_free = [ "0_0", "0_1", "0_2", "0_3", "0_4", "0_5", "0_6", "0_7",
                                     "0_8",
                                     "0_9",
                                     "0_10",
                                     "1_0",
                                     "1_1",
                                     "1_2",
                                     "1_3",
                                     "1_4",
                                     "1_5",
                                     "1_6",
                                     "1_7",
                                     "1_8",
                                     "1_9",
                                     "1_10",
                                     "1_11",
                                     "1_12",
                                     "1_13",
                                     "2_0",
                                     "2_1",
                                     "2_2",
                                     "2_3",
                                     "2_4",
                                     "2_5",
                                     "2_6",
                                     "2_7",
                                     "2_8",
                                     "2_9",
                                     "2_10",
                                     "2_11",
                                     "2_12",
                                     "2_13",
                                     "2_14",
                                     "2_15",
                                     "2_16",
                                     "3_0",
                                     "3_1",
                                     "3_2",
                                     "3_3",
                                     "3_4",
                                     "3_5",
                                     "3_6",
                                     "3_7",
                                     "3_8",
                                     "3_9",
                                     "3_10",
                                     "3_11",
                                     "3_12",
                                     "4_0",
                                     "4_1",
                                     "4_2",
                                     "4_3",
                                     "4_4",
                                     "4_5",
                                     "4_6",
                                     "4_7",
                                     "4_8",
                                     "5_0",
                                     "5_1",
                                     "5_2",
                                     "5_3",
                                     "5_4",
                                     "5_5",
                                     "5_6",
                                     "5_7",
                                     "5_8",
                                     "5_9",
                                     "5_10",
                                     "5_11",
                                     "5_12",
                                     "5_13",
                                     "6_0",
                                     "6_1",
                                     "6_2",
                                     "6_3",
                                     "6_4",
                                     "6_5",
                                     "6_6",
                                     "6_7",
                                     "6_8",
                                     "6_9",
                                     "7_0",
                                     "7_1",
                                     "7_2",
                                     "7_3",
                                     "7_4",
                                     "7_5",
                                     "7_6",
                                     "7_7",
                                     "7-8",
                                     "7_9",
                                     "8_0",
                                     "8_1",
                                     "8_2",
                                     "8_3"
                                    ];
    }
    catch(err) {
        //alert(err.message);
    }
};
function abilitaVecchiaVer () {
    onlineVersion = true;
}





