// ==UserScript==
// @name         onaylar
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  b2b görünüm ve renk onayları
// @author       You
// @match        https://b2b.defacto.com.tr/web/Productization/SupplyManagement/SupplyManagementConsole
// @icon         https://www.google.com/s2/favicons?sz=64&domain=defacto.com.tr
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449941/onaylar.user.js
// @updateURL https://update.greasyfork.org/scripts/449941/onaylar.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var parent = document.createElement('div')
    parent.className = "parent"
    parent.style.display = "flex"
    var node = document.querySelector("#pageMainContent > div > div > div:nth-child(5) > div.portlet-body.form > div > div:nth-child(1) > div > div.col-md-9")
    node.appendChild(parent)

    var node1 = document.querySelector(".parent")
    var gorunum = document.createElement('div')
    gorunum.className = "gorunum"
    gorunum.innerHTML = "<h5><b>Görünüm Onayı Olan Renkler</b></h5>"
    gorunum.style.color = "blue"
    gorunum.style.paddingLeft = "15px"
    gorunum.style.flexGrow = "1"
    node1.appendChild(gorunum)

    if(document.body.contains(document.getElementById('openLicenceProductionApproval'))){
        var lisans = document.createElement('div')
        lisans.className = "lisans"
        lisans.innerHTML = "<h5><b>Lisans Onayı</b></h5>"
        lisans.style.color = "red"
        lisans.style.flexGrow = "1"
        node1.appendChild(lisans)}


    function ekle(e){
        var cont = document.querySelector(".gorunum");
        var renkli = document.createElement('li');
        renkli.innerText = e
        renkli.style.paddingLeft = "15px"
        renkli.style.color = "black"
        cont.appendChild(renkli)}

    function lisansEkle(l){
        var cont = document.querySelector(".lisans");
        var renkli = document.createElement('li');
        renkli.innerText = l
        renkli.style.paddingLeft = "15px"
        renkli.style.color = "black"
        cont.appendChild(renkli)}



    fetch('https://b2b.defacto.com.tr/web/Productization/SupplyManagement/ReadGoldSealVisualValues')
        .then(response =>response.json())
        .then(data => {
        var dt = data.Data
        dt.forEach(d => ekle(d.ColorCode))
    })

    fetch('https://b2b.defacto.com.tr/web/Productization/SupplyManagement/LicenceProductionApprovalView')
        .then(response =>response.text())
        .then(text => {
        if (text === "İlgili lisanslı model için lisans üretim onayı alınmamıştır. Lütfen tedarik sorumlusu ile görüşünüz."){
            lisansEkle("İlgili lisanslı model için lisans üretim onayı alınmamıştır. Lütfen tedarik sorumlusu ile görüşünüz.")
        }

        else{
            var parser = new DOMParser();
            var doc = parser.parseFromString(text, 'text/html');
            lisansEkle( doc.querySelector('span').innerText);}
    })
        .catch(err=>console.log("hata"))
})();