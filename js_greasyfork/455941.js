// ==UserScript==
// @name         Takipçi Kontrol
// @namespace    https://eksisozluk.com/
// @version      0.2.3
// @description  Ekşi Sözlük'te yeni gelen takipçileri ve takipten çıkanları gösteriyor.
// @author       You
// @match        https://eksisozluk.com/takipci/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=eksisozluk.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455941/Takip%C3%A7i%20Kontrol.user.js
// @updateURL https://update.greasyfork.org/scripts/455941/Takip%C3%A7i%20Kontrol.meta.js
// ==/UserScript==
var takipEdilenYazar = localStorage.getItem('yazar');
function createButton(id, text) {
  let button = document.createElement("button");
  button.innerText = text;
  button.id = id;
  return button;
}
function onButtonClick (zEvent) {
    alert (takipEdilenYazar + " nickli yazar takipten çıkıldı. Takip etmek istediğiniz yeni yazarın profilini açıp takipçiler bölümüne tıklamanız gereklidir.");
    localStorage.removeItem('yazar');
}
window.addEventListener('load', function() {
    const yazarHeader = document.querySelector("#content-body > h1 > a")
    var yazar = document.querySelector("#content-body > h1 > a").innerHTML;
    const followerTab = document.querySelector("#follow-tabs");
    var x = document.querySelectorAll("#follows-nick");
    var i;
    const takipciler = [];
    for (i = 0; i < x.length; i++) {
        takipciler.push(x[i].innerHTML);
    }
    if (yazar==takipEdilenYazar){
        const unfollowButton = followerTab.append(createButton("dontfollow", "Bu hesabın takipçilerini izlemeyi bırak"));
        document.querySelector("#dontfollow").addEventListener("click", onButtonClick);
        if(takipciler !== null){
            const storedTakipciler = JSON.parse(localStorage.getItem('takipciler'));
            let gelenler = takipciler.filter(x => !storedTakipciler.includes(x));
            let gidenler = storedTakipciler.filter(x => !takipciler.includes(x));
            if(gelenler.length>0){
                window.alert("Yeni gelen takipçiler: " + gelenler.join(", "));
            }
            if(gidenler.length>0){
                window.alert("Takipten çıkan takipçiler: " + gidenler.join(", "));
            }
            localStorage.setItem('takipciler', JSON.stringify(takipciler));
        }
    } else if (localStorage.getItem('yazar') == null) {
        localStorage.setItem('yazar', yazar);
        localStorage.setItem('takipciler', JSON.stringify(takipciler));
    }

}, false);
