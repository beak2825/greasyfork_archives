// ==UserScript==
// @name         SGK Toplu Onay
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  try to take over the world!
// @author       You
// @include        https://ebildirge.sgk.gov.tr/EBildirgeV*
// @grant        none
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/372900/SGK%20Toplu%20Onay.user.js
// @updateURL https://update.greasyfork.org/scripts/372900/SGK%20Toplu%20Onay.meta.js
// ==/UserScript==
/*jshint esversion: 6 */

(function() {
    'use strict';
    debugger;
    OnayBekleyenlerSayfasinda();
    SifreGirisSayfasinda();
    AnaSayfada();
    SubeSayfasinda();
})();

function OnayBekleyenlerSayfasinda()
{
    if(!window.BaslikVarMi("Onay Bekleyen Bildirge Listesi")){
        return;
    }

    DugmeleriOlustur();

    if(localStorage.TriggerTumOnay === "true")
    {
        localStorage.TriggerTumKontrol = "false";
        SonuncuyuOnayla();
    }

    if(localStorage.TriggerTumKontrol === "true")
    {
        CheckNext();
    }
}

function DugmeleriOlustur()
{
    let btnTumOnay = document.createElement("input");
    btnTumOnay.type = "button";
    btnTumOnay.value = "Tümünü Onayla";
    btnTumOnay.id = "btnTumOnay";
    btnTumOnay.onclick = Basla;
    btnTumOnay.style.position = "fixed";
    btnTumOnay.style.top = "240px";
    btnTumOnay.style.left = "40px";
    btnTumOnay.style.width = "222px";
    btnTumOnay.style.height = "30px";
    btnTumOnay.style.border = "1px green solid";
    document.body.appendChild(btnTumOnay);
    window.btnTumOnay = btnTumOnay;

    let edOnayParola = document.createElement("input");
    edOnayParola.type = "text";
    edOnayParola.value = localStorage.onayParola === undefined ? "" : localStorage.onayParola;
    edOnayParola.placeholder = "İşyeri Parolası";
    edOnayParola.title = "İşyeri Parolası";
    edOnayParola.id = "edOnayParola";
    edOnayParola.style.position = "fixed";
    edOnayParola.style.top = "200px";
    edOnayParola.style.left = "40px";
    edOnayParola.style.width = "200px";
    edOnayParola.style.height = "25px";
    edOnayParola.style.border = "2px green solid";
    document.body.appendChild(edOnayParola);

    let btTopluKontrol = document.createElement("input");
    btTopluKontrol.type = "button";
    btTopluKontrol.value = "Toplu Kontrol HUS";
    btTopluKontrol.id = "btTopluKontrol";
    btTopluKontrol.onclick = TopluKontrolHus;
    btTopluKontrol.style.position = "fixed";
    btTopluKontrol.style.top = "300px";
    btTopluKontrol.style.left = "40px";
    btTopluKontrol.style.width = "222px";
    btTopluKontrol.style.height = "30px";
    btTopluKontrol.style.border = "1px green solid";
    document.body.appendChild(btTopluKontrol);
    window.btTopluKontrol = btTopluKontrol;
}

function Basla()
{
    localStorage.TriggerTumOnay = "true";
    localStorage.onayParola = document.getElementById("edOnayParola").value;
    SonuncuyuOnayla();
}

function TopluKontrolHus()
{
    localStorage.TriggerTumKontrol = "true";
    localStorage.currentDugme = 0;
    CheckNext();
}

function CheckNext()
{
    let dugmeler = document.querySelectorAll("input[type='radio']");
    let dugmeSay = dugmeler.length;
    
    if (!localStorage.currentDugme || localStorage.currentDugme == "0") {
        localStorage.currentDugme = 0;
    }
    let currentDugme = Number(localStorage.currentDugme);
    window.btTopluKontrol.value = "Toplu Kontrol: " + currentDugme + "/" + dugmeSay;

    if (currentDugme > (dugmeSay - 1)) {
        window.btTopluKontrol.value = "Toplu Kontrol: Tamamlandı";
        localStorage.TriggerTumKontrol = "false";
        localStorage.currentDugme = 0;
        return;
    }
    
    dugmeler[currentDugme].click();
    setTimeout(function() {
        document.getElementById("topluKontrolId").click();
    }, window.TikDelay);
    
    localStorage.currentDugme++;
}

function SonuncuyuOnayla()
{
    if(localStorage.OnaylaSayfasindan === "true"){
        alert("Hata. Sayfa değişmedi.");
        localStorage.TriggerTumOnay = "false";
        return;
    }

    let dugmeler = document.querySelectorAll("input[type='radio']");
    if (dugmeler.length < 2) {
        window.btnTumOnay.value = "Tümünü Onayla - OK";
        localStorage.TriggerTumOnay = "false";
        return;
    }
    
    window.btnTumOnay.value = "Tümünü Onayla - " + dugmeler.length / 2 + " kaldı";
    dugmeler[dugmeler.length - 2].click();
    setTimeout(function() {
        localStorage.OnaylaSayfasindan = "true";
        document.getElementById("tahakkukOnayId").click();
    }, window.TikDelay);
}

function SifreGirisSayfasinda()
{
    if(localStorage.TriggerTumOnay !== "true") {
        return;
    }

    let sifreBox = document.getElementById("tilesislemTamam_isyeri_sifre");
    if(sifreBox === null){
        return;
    }

    if(localStorage.SifreGirisYapti === "true"){
        alert("Hata. Sayfa değişmedi.");
        localStorage.TriggerTumOnay = "false";
        return;
    }

    sifreBox.value = localStorage.onayParola;
    document.getElementById("tilesislemTamam_onayChk").checked = true;
    setTimeout(function() {
        localStorage.SifreGirisYapti = "true";
        document.getElementById("tilesislemTamam_tahakkukonaylaInternet").click();
    }, window.TikDelay);
}

function AnaSayfada()
{
    localStorage.SifreGirisYapti = "false";
    localStorage.OnaylaSayfasindan = "false";

    if(localStorage.TriggerTumOnay !== "true") {
        return;
    }

    if(!window.BaslikVarMi("ANASAYFA")){
        return;
    }

    let links = document.querySelectorAll("#contentContainer a");
    links[3].click();
}

function GetTodayTR(daDate)
{
    let dd = daDate.getDate();
    let mm = daDate.getMonth() + 1; //January is 0!
    let yyyy = daDate.getFullYear();

    if(dd < 10) {
        dd = '0' + dd
    } 
    
    if(mm < 10) {
        mm = '0' + mm
    }
    
    return dd + '.' + mm + '.' + yyyy;
}

function SubeSayfasinda()
{
    if(!window.BaslikVarMi("Şube Onay İşlem Yapılan Belgeler") && !window.BaslikVarMi("Şube Onay İşlem Yapılan Belge Durum Bilgisi Girişi")){
        return;
    }
    
    document.querySelectorAll('table.gradienttable td').forEach(e => e.style.background = 'white');
    document.getElementById("datepicker_baslangicTarihi").value = "01.01.2010";
    document.getElementById("datepicker_bitisTarihi").value = GetTodayTR(new Date());
}