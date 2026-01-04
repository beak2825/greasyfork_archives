// ==UserScript==
// @name        Autoiskola Dark Theme
// @namespace    http://tampermonkey.net/
// @version      0.22
// @description  Dark theme for a driving school webpage
// @author       Balint Sotanyi
// @match        https://servisi.euprava.gov.rs/autoskole/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403310/Autoiskola%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/403310/Autoiskola%20Dark%20Theme.meta.js
// ==/UserScript==

(function(){
    var g = document.getElementsByClassName('page-content')[0];
    if (g) {
        g.style.background = "black";
        g.style.color = "white";
        g.style.minHeight = "100vh";
    }
    var c = document.getElementById("examNavigationBar");
    if (c) {
        c.style.background = "#333";
        c.style.border = "2px solid #999";
        c.style.borderRadius = "20px";
    }
    var m = document.getElementById("main-container");
    if (m) {
        m.style.background = "black";
        m.style.color = "white";
    }
    var u = document.getElementsByClassName("form-actions")[0];
    if (u && u.id != "examNavigationBar") {
        u.style.background = "black";
        u.style.height = "50vh";
    }
    var k = document.getElementById("divOuter");
    if (k) {
        k.style.background = "black";
    }
    var p = document.getElementById("divConfirmStart");
    if (p) {
        p.style.background = "linear-gradient(to bottom right, #111, #444)";
    }
    var q = document.getElementById("divChooseLang");
    if (q) {
        q.style.background = "linear-gradient(to bottom right, #111, #444)";
    }
    var y = document.getElementsByTagName("table")[0];
    if (y) {
        y.classList.remove('table-hover');
        y.classList.remove('table-striped');
    }
    var userdata = document.getElementsByClassName("profile-info-value");
    for (var i = 0; i < userdata.length; i++) {
        userdata[i].style.color = "black";
    }
    var bigg = document.createElement('div');
    bigg.style.background = "#530";
    bigg.style.opacity = "0.1";
    bigg.style.position = "fixed";
    bigg.style.width = "100vw";
    bigg.style.height = "100vh";
    bigg.style.top = "0";
    bigg.style.left = "0";
    bigg.id = "bigg";
    bigg.style.zIndex = "874586536";
    bigg.style.pointerEvents = "none";
    document.body.appendChild(bigg);
    var cont = document.createElement("span");
    cont.style.display = "block";
    cont.style.padding = "5px";
    cont.style.background = "rgba(200,200,0,0.5)";
    cont.style.color = "white";
    cont.style.border = "3px solid white";
    cont.style.position = "fixed";
    cont.style.right = "2px";
    cont.style.fontWeight = "bold";
    cont.style.userSelect = "none";
    cont.style.cursor = "pointer";
    cont.style.borderRadius = "5px";
    cont.style.bottom = "2px";
    cont.innerHTML = "Change filter (0.1)";
    document.body.appendChild(cont);
    cont.addEventListener("click",function () {
    	var o = parseFloat(bigg.style.opacity);
    	o += 0.1;
    	o = o.toFixed(1);
    	if (o > 0.7) { o = 0; }
    	bigg.style.opacity = o + "";
    	console.log(bigg.style.opacity);
    	cont.innerHTML = "Change filter (" + o + ")";
    });
})();