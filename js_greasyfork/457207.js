// ==UserScript==
// @name         B2B
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  B2b'de buton ekler
// @author       You
// @match        https://b2b.defacto.com.tr/web/Productization/SupplyManagement/SupplyManagementConsole
// @icon         https://www.google.com/s2/favicons?sz=64&domain=defacto.com.tr
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457207/B2B.user.js
// @updateURL https://update.greasyfork.org/scripts/457207/B2B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let btn = document.createElement("button");
    btn.innerHTML = "Resim indir";
    btn.className = "resimindir";
    btn.id = "resimindir";
    btn.type = "submit";
    btn.className = 'class="k-button k-button-icontext Colored-ListButtonContextButtonParent';
    btn.style.marginLeft = "10px"

    let excel = document.createElement("button");
    excel.innerHTML = "Excel indir";
    excel.className = "excelindir";
    excel.id = "excelindir";
    excel.type = "submit";
    excel.className = 'class="k-button k-button-icontext Colored-ListButtonContextButtonParent';
    excel.style.marginLeft = "10px"

    let btntf = document.createElement("button");
    btntf.innerHTML = "Resim ve Excel indir";
    btntf.className = "resimindirtf";
    btntf.id = "resimindirtf";
    btntf.type = "submit";
    btntf.className = 'class="k-button k-button-icontext Colored-ListButtonContextButtonParent';
    btntf.style.marginLeft = "10px"

    let tfveolcu = document.createElement("button");
    tfveolcu.innerHTML = "TF ve Ölçü Tablosu indir";
    tfveolcu.className = "tfveolcu";
    tfveolcu.id = "tfveolcu";
    tfveolcu.type = "submit";
    tfveolcu.className = 'class="k-button k-button-icontext Colored-ListButtonContextButtonParent';
    tfveolcu.style.marginLeft = "10px"

    let olcuveresim = document.createElement("button");
    olcuveresim.innerHTML = "Ölçü Tablosu ve Resim indir";
    olcuveresim.className = "olcuveresim";
    olcuveresim.id = "olcuveresim";
    olcuveresim.type = "submit";
    olcuveresim.className = 'class="k-button k-button-icontext Colored-ListButtonContextButtonParent';
    olcuveresim.style.marginLeft = "10px"


    document.querySelector("#pageMainContent > div > div > div:nth-child(5) > div.portlet-body.form").appendChild(btn);
    document.querySelector("#pageMainContent > div > div > div:nth-child(5) > div.portlet-body.form").appendChild(excel);
    document.querySelector("#pageMainContent > div > div > div:nth-child(5) > div.portlet-body.form").appendChild(btntf);
    document.querySelector("#pageMainContent > div > div > div:nth-child(5) > div.portlet-body.form").appendChild(tfveolcu);
    document.querySelector("#pageMainContent > div > div > div:nth-child(5) > div.portlet-body.form").appendChild(olcuveresim);






    function img_find() {
        var imgs = document.getElementsByClassName("img-responsive")
        var imgSrcs = [];

        for (var i = 0; i < imgs.length; i++) {
            imgSrcs.push(imgs[i].src);
        }

        return imgSrcs;
    };

    function resim() {
        var model = document.querySelector("#StyleCode").getAttribute("value")


        var link = img_find()

        window.URL = window.URL || window.webkitURL;

        var xhr = new XMLHttpRequest(),
            a = document.createElement('a'), file;

        xhr.open('GET', link, true);
        xhr.responseType = 'blob';
        xhr.onload = function () {
            file = new Blob([xhr.response], { type : 'application/octet-stream' });
            a.href = window.URL.createObjectURL(file);
            a.download = model+'.png';  // Set to whatever file name you want
            // Now just click the link you created
            // Note that you may have to append the a element to the body somewhere
            // for this to work in Firefox
            a.click();
        };
        xhr.send();

    };

    function resimtf() {
        resim();

        var link = "https://b2b.defacto.com.tr/web/Productization/SupplyManagement/DownloadSummaryTable";

        window.open(link);


    };

    function excelfunc() {

        var file = "https://b2b.defacto.com.tr/web/Productization/SupplyManagement/DownloadSummaryTable";

        window.open(file);


    };

    function tfveolcufun() {

        var id = document.querySelector("#StyleSeasonId").value;
        var olcu = "https://b2b.defacto.com.tr/web/DocumentManagement/MeasurementChartAndPosition/MeasurementChart?styleSeasonId="+id;
        window.open(olcu);

        var tf = 'https://b2b.defacto.com.tr/web/DocumentManagement/TechnicalSheetContent/ManagementConsole?styleSeasonId='+id+'&isFabricDetailsVisible=True&isDesignSketchesVisible=True&isVariantsVisible=True&isTrimsVisible=True&isLabelHangtagVisible=True&isDesignGraphicsVisible=True'
        window.open(tf);

    };

    function olcuveresimfunc() {

        var id = document.querySelector("#StyleSeasonId").value;
        var olcu = "https://b2b.defacto.com.tr/web/DocumentManagement/MeasurementChartAndPosition/MeasurementChart?styleSeasonId="+id;
        window.open(olcu);
        resim();

    };


    const resimindirbtn = document.getElementById("resimindir");
    resimindirbtn.addEventListener("click",resim);

    const excelbtn = document.getElementById("excelindir");
    excelbtn.addEventListener("click",excelfunc);

    const resimindirtfbtn = document.getElementById("resimindirtf");
    resimindirtfbtn.addEventListener("click",resimtf);

    const tfveolcubtn = document.getElementById("tfveolcu");
    tfveolcu.addEventListener("click",tfveolcufun);

    const olcuveresimbtn = document.getElementById("olcuveresim");
    olcuveresim.addEventListener("click",olcuveresimfunc)
})();