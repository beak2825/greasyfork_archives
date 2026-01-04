// ==UserScript==
// @name port.hu mozi szűrés
// @namespace mailto:ndavid42@gmail.com
// @version 1.1
// @description port.hu-n a filmek adatlapján lehet szűrni a mozivetítéseket
// @author ndavid42
// @match https://port.hu/adatlap/film/mozi/*
// @icon https://port.hu/favicons24/favicon.png
// @supportURL ha találsz hibát, szólj!
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545607/porthu%20mozi%20sz%C5%B1r%C3%A9s.user.js
// @updateURL https://update.greasyfork.org/scripts/545607/porthu%20mozi%20sz%C5%B1r%C3%A9s.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var mozi = document.querySelector(".mozi");
    var selectBox = document.createElement("div");
    selectBox.style.backgroundColor = "#ef0b0c";
    selectBox.style.color = "white";
    selectBox.style.border = "2px solid #000000";
    selectBox.style.position = "fixed";
    selectBox.style.top = "100px";
    selectBox.style.left = "20px";
    selectBox.style.zIndex = "100";
    selectBox.style.padding = "5px 10px";
    selectBox.style.borderRadius = "16px";

    var ch_f = '<div><input type="checkbox" id="ch_f" style="appearance: auto" checked><label for="ch_f" style="margin-left: 5px">Feliratos / eredeti nyelven</label><br></div>';
    var ch_mb = '<div><input type="checkbox" id="ch_mb" style="appearance: auto" checked><label for="ch_mb" style="margin-left: 5px">Szinkronos</label><br></div>';
    var ch_VIP = '<div><input type="checkbox" id="ch_VIP" style="appearance: auto" checked><label for="ch_VIP" style="margin-left: 5px">VIP</label><br></div>';
    var ch_IMAX = '<div><input type="checkbox" id="ch_IMAX" style="appearance: auto" checked><label for="ch_IMAX" style="margin-left: 5px">IMAX</label><br></div>';
    var ch_4DX = '<div><input type="checkbox" id="ch_4DX" style="appearance: auto" checked><label for="ch_4DX" style="margin-left: 5px">4DX</label><br></div>';
    var ch_3D = '<div><input type="checkbox" id="ch_3D" style="appearance: auto" checked><label for="ch_3D" style="margin-left: 5px">3D</label><br></div>';
    selectBox.innerHTML = '<p>Válaszd ki a műsortípusokat:</p><form>' + ch_f + ch_mb + ch_VIP + ch_IMAX + ch_4DX + ch_3D + '</form>';

    mozi.appendChild(selectBox);

    var ch_f_i = document.querySelector("#ch_f");
    var ch_mb_i = document.querySelector("#ch_mb");
    var ch_VIP_i = document.querySelector("#ch_VIP");
    var ch_IMAX_i = document.querySelector("#ch_IMAX");
    var ch_4DX_i = document.querySelector("#ch_4DX");
    var ch_3D_i = document.querySelector("#ch_3D");

    var events = document.querySelectorAll(".event");

    ch_f_i.addEventListener("change", (event) => showHide(event, "f"));
    ch_f_i.addEventListener("change", (event) => showHide(event, "eny"));
    ch_mb_i.addEventListener("change", (event) => showHide(event, "mb"));
    ch_VIP_i.addEventListener("change", (event) => showHide(event, "VIP"));
    ch_IMAX_i.addEventListener("change", (event) => showHide(event, "IMAX"));
    ch_4DX_i.addEventListener("change", (event) => showHide(event, "4DX"));
    ch_3D_i.addEventListener("change", (event) => showHide(event, "3D"));


    function showHide(event, cat) {
        const isChecked = event.target.checked;
        console.log("checked: " + isChecked);
        events.forEach((e) => {
            if (e.textContent.includes(cat)) {
                if (isChecked) {
                    e.style.display = "flex";
                } else {
                    e.style.display = "none";
                }
            }
        })
    }

})();