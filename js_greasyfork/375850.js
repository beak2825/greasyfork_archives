// ==UserScript==
// @name        ENGY 1.3
// @namespace   Normagyujtemeny
// @description Építési Normagyűjtemény ÉNGY kódok
// @include     https://e-kerelem.mvh.allamkincstar.gov.hu/enter/webform/emva/engy/EngyMain.xhtml
// @require     https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/375850/ENGY%2013.user.js
// @updateURL https://update.greasyfork.org/scripts/375850/ENGY%2013.meta.js
// ==/UserScript==

var elvalaszto = "---";
var elozo_adat = [];
var tab = "\t";
var adatszam = 0;

$("body").append (' <div id="new_place"> </div>');
$("#new_place").css( {"border":"3px solid red", "width" : "800px" , "height": "500px" });
$("#new_place").css( {"position":"absolute", "left" : "1040px" , "top": "50px" });

var button1=document.createElement("button");
button1.innerHTML = "Tétel kiírása (q)";
button1.onclick = AdatKiirasSzovegmezobe;
button1.style.height = "50px";
button1.id ="kiiras_gomb";
$(button1).appendTo ("#new_place");

var torles=document.createElement("button");
torles.innerHTML ="Adatok törlése";
torles.onclick = AdatTorles;
torles.style.height = "50px";
torles.id ="torles_gomb";
$(torles).appendTo ("#new_place");

var szamlalo=document.createElement("button");
szamlalo.innerHTML =adatszam;
//torles.onclick = AdatTorles;
szamlalo.style.height = "50px";
szamlalo.id ="szamlalo";
$(szamlalo).appendTo ("#new_place");

var szovegdoboz=document.createElement("TEXTAREA");
szovegdoboz.type="button";
szovegdoboz.readOnly = true;
szovegdoboz.name = "post";
szovegdoboz.maxLength = "35000";
szovegdoboz.cols = "111";
szovegdoboz.rows = "29";
szovegdoboz.onclick=kimasol;
szovegdoboz.id = 'szovegdobozID';
$(szovegdoboz).appendTo ("#new_place");

billerzekeles_hozzarendeles ();

function billerzekeles_hozzarendeles() {
    document.getElementById("engyForm:tree").addEventListener("keydown", billerzekeles , false );
}

function billerzekeles (e) {
    if (e.keyCode == "81") {
      AdatKiirasSzovegmezobe ();
    }
}

$(document).ready(function() {
$("#new_place" ).resizable();
$("#new_place" ).draggable();
});

function kimasol() {
    $("#szovegdobozID").select();
    document.execCommand('copy');
}

function AdatTorles(){
    $("#szovegdobozID").val("");
    adatszam = 0;
    szamlalo.innerHTML =adatszam;
     elozo_adat = [];
}

function AdatKiirasSzovegmezobe() {
    var engytext = document.getElementById("engyForm:leirasPanel_content").innerHTML;
    var szoveg = "";
    var sorok = engytext.split ('<br>');
    var i;

    for (i = 0; i < sorok.length; i++) {
    sorok[i] = sorok[i].replace (/&nbsp;/g, ""); // szóköz nbsp
    sorok[i] = sorok[i].replace(/(?:\r\n|\r|\n)/g, ''); // sortörések
    sorok[i] = sorok[i].replace(/<[^>]+>/g, ''); // html elemek
}

    var empty_row, rowcount;
    do{ // üres sorok törlése a stringből
        rowcount = sorok.length;
        empty_row = false;
        for ( i = 0; i <rowcount; i++) {
            if (sorok [i].length == 0) {
                sorok.splice(i, 1);
                empty_row = true;
                i = rowcount + 1; }
        }
    }
    while (empty_row);

    var ssz = sorok.length-1;
    szoveg += sorok[0].replace ("ÉNGY kód: ", "") + tab;
    szoveg += sorok[1].replace ("Kód: ", "") + tab;
    szoveg += sorok[2].replace ("Verzió: ", "") + tab;

    var k = Math.min(ssz,elozo_adat.length-1) - 7;
    var ii = -1;

    for (i = 0; i <= k; i++) {
        if (elozo_adat [i+3] == sorok[i+3])
            { ii = i; }
        else { break;}
    }

    for (i = 3 + ii; i < ssz-5; i++) { szoveg += sorok[1+i] + elvalaszto;}
    if ( (i > 3 + ii) && (i <= ssz-5 )) { szoveg = szoveg.substr (0, szoveg.length - elvalaszto.length);}

    szoveg += tab + sorok[ssz-4] + tab;
    elozo_adat = JSON.parse(JSON.stringify( sorok )); // elmenti a sorokat, a későbbi ellenőrzéshez

    // árak
    var regex = /: (.*?) /;
    var regex2 = / Ft\/(.*)/;
    var refar = regex.exec (sorok[ssz-3])[1];
    var anyagar = regex.exec (sorok[ssz-2])[1];
    var gepklt = regex.exec (sorok[ssz-1])[1];
    var rezsi = regex.exec (sorok[ssz-0])[1];
    var egyseg = regex2.exec (sorok[ssz-3])[1];
    szoveg += tab + egyseg + tab + refar + tab + anyagar + tab + gepklt + tab + rezsi;
    document.getElementById('szovegdobozID').value += szoveg + "\n";
    adatszam += 1;
    szamlalo.innerHTML =adatszam;

    billerzekeles_hozzarendeles ();
}
