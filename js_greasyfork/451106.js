// ==UserScript==
// @name        visvaris helper
// @namespace   Zigmar's Scripts
// @match       https://visvaris.zzdats.lv/Card/EditUser/*
// @grant       none
// @version     1.2
// @author      Zigmars
// @description aizpilda personas dzimšanas apliecības datus
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/451106/visvaris%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/451106/visvaris%20helper.meta.js
// ==/UserScript==

/* jshint esversion:8 */
setTimeout(fix1, 100);
var jaunakarteobjekts;
var dokumentaobjekts;
var fixed3 = false;
var processing = false;
var mekletpoga;

function fix1() {
    tmp = document.getElementById('userEditContent');
    tmp = tmp.children.item(0).children.item(0).children.item(3);
    tmp = tmp.getElementsByClassName('row')[1];
    tmp = tmp.children.item(0);
    tmp.children.item(0).style.display = "none";
    jaunakarteobjekts = tmp;

    var newA = document.createElement('a');
    newA.setAttribute('href', "#");
    newA.innerHTML = "Jauna e-karte ++";
    newA.className = "link";
    newA.onclick = function() {
        fix2();
        return false;
    };

    tmp.appendChild(newA);
}

function fix2(el) {
    jaunakarteobjekts.children.item(0).click();
    setTimeout(fix3, 3000);
}

function fix3() {
    if (fixed3) return false;

    tmp = document.getElementsByClassName('zzdats-card-add')[0];
    tmp = tmp.children.item(0);
    tmp = tmp.getElementsByClassName('col-xs-12')[0];
    dokumentaobjekts = tmp;

    var newA = document.createElement('a');
    newA.setAttribute('href', "#");
    newA.innerHTML = "Meklēt VIIS";
    newA.className = "link";
    newA.onclick = function() {
        meklet_viis_datus();
        return false;
    };
    tmp.children.item(0).children.item(1).children.item(0).appendChild(newA);
    mekletpoga = newA;
    fixed3 = true;
}

function meklet_viis_datus() {
    if (processing) return;
    document.body.style.cursor = "progress";
    mekletpoga.style.cursor = "progress";
    processing = true;
    tmp = document.getElementsByClassName('panel-body')[0];
    tmp = tmp.getElementsByTagName("input")[0];
    pk = tmp.value;
    rez = doRequest(pk);
}

function aizpildit_datus(dati) {

    viis_dati = JSON.parse(dati);
    bloks = dokumentaobjekts.children.item(0).children.item(1);
    if (viis_dati.veids == 'Dzimšanas apliecība') {
        dokumentaveidaselekts = bloks.children.item(0).children.item(1).children.item(0);
        if (dokumentaveidaselekts.children.item(0).innerHTML == 'Dzimšanas apliecība') selectvalue = 0;
        if (dokumentaveidaselekts.children.item(1).innerHTML == 'Dzimšanas apliecība') selectvalue = 1;
        if (dokumentaveidaselekts.children.item(2).innerHTML == 'Dzimšanas apliecība') selectvalue = 2;
        if (dokumentaveidaselekts.children.item(3).innerHTML == 'Dzimšanas apliecība') selectvalue = 3;

        dokumentaveidaselekts.value = dokumentaveidaselekts.children.item(selectvalue).value;

        //var event1 = new Event('change');
        //var event2 = new Event('change');      
        bloks.children.item(0).children.item(1).children.item(0).dispatchEvent(new Event('change'));
        bloks.children.item(1).children.item(1).children.item(0).value = viis_dati.numurs;
        bloks.children.item(1).children.item(1).children.item(0).dispatchEvent(new Event('change'));
        bloks.children.item(2).children.item(1).children.item(0).value = viis_dati.izdevejs;
        bloks.children.item(2).children.item(1).children.item(0).dispatchEvent(new Event('change'));
        bloks.children.item(3).children.item(1).children.item(0).value = viis_dati.datums;
        bloks.children.item(3).children.item(1).children.item(0).dispatchEvent(new Event('change'));

    }
    document.body.style.cursor = "default";
    mekletpoga.style.cursor = "pointer";
    processing = false;
}


async function doRequest(pk) {

    url = 'https://dzaplpk.zigis.id.lv';
    data = {
        'pk': pk
    };

    res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
    });

    if (res.ok) {

        dati = await res.text();
        aizpildit_datus(dati);

    } else {
        alert('http error');
        document.body.style.cursor = "default";
        mekletpoga.style.cursor = "pointer";
        processing = false;
    }
}