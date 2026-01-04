// ==UserScript==
// @name        Viki PLUS
// @namespace   Violentmonkey Scripts
// @match       https://fr.vikidia.org/wiki/*
// @match       https://fr.vikidia.org/w/*
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       unsafeWindow
// @version     1.0
// @author      Astro
// @description Débloquez de nouvelles fonctionnalités
// @downloadURL https://update.greasyfork.org/scripts/406030/Viki%20PLUS.user.js
// @updateURL https://update.greasyfork.org/scripts/406030/Viki%20PLUS.meta.js
// ==/UserScript==

eval(atob("dW5zYWZlV2luZG93LmJsYWNrbGlzdCA9IFsiSnMybHlvbiIsICJHYWxkcmFkIiwgIkd1cyBJbGRpcmltIiwgIkd1cyBJbGRyaW0iLCAiTGVkIFplcGd1cyIsICJOaW5pUGF0YWxvMjAwNSIsICJWaXZpLTEiLCAiTGF1cmVudCBOZ3V5ZW4iXQ=="))

if (GM_getValue("vkpls_vllogo") == null){
  GM_setValue("vkpls_vllogo",0)
}

function vkpls_addli(iul, ili) {
  iul.innerHTML = iul.innerHTML + "<li style='list-style-type:none;list-style-image:none;'>" + ili + "</li>"
}

setTimeout(function(){
  try {
    var username = document.querySelector("#pt-userpage a").innerHTML
    var vkpls_optionbox = document.querySelector("div#mw-navigation div#mw-head div#p-personal ul")
    console.log(vkpls_optionbox)
    vkpls_addli(vkpls_optionbox, "<b><a href='https://fr.vikidia.org/wiki/Utilisateur:" + username + "/common.js'>common.js</a></b>")
  } catch(error) {}
    var vkpls_navig = document.querySelector("#p-Navigation .body ul")
    vkpls_addli(vkpls_navig, "<b><a href='https://fr.wikimini.org/wiki/Accueil'><span style='color:#ff0000;'>V</span><span style='color:#ff7f00;'>i</span><span style='color:#d0d000;'>k</span><span style='color:#68c600;'>i</span><span style='color:#00bc00;'>l</span><span style='color:#1ac1c1;'>a</span><span style='color:#0000ff;'>n</span><span style='color:#8b00ff;'>d</span></a></b>")
    vkpls_addli(vkpls_navig, "<a href='https://fr.vikidia.org/wiki/Vikidia:Pages_%C3%A0_supprimer'>PàS</a>")
    vkpls_addli(vkpls_navig, "<a href='https://fr.vikidia.org/wiki/Vikidia:Prise_de_d%C3%A9cision'>PrsDD</a>")
    vkpls_addli(vkpls_navig, "<a href='https://fr.vikidia.org/wiki/Vikidia:Alerte'>Alerte</a>")
    vkpls_addli(vkpls_navig, "<a href='https://fr.vikidia.org/wiki/Vikidia:Demandes_aux_bureaucrates'>DmAB</a>")
    vkpls_addli(vkpls_navig, "<a href='https://fr.vikidia.org/wiki/Vikidia:Bulletin_des_administrateurs'>BltDA</a>")
    vkpls_addli(vkpls_navig, "<a href='https://fr.vikidia.org/wiki/Vikidia:Bulletin_des_patrouilleurs'>BltDP</a>")
}, 3500);

function vkpls_tl_vl() {
  if (GM_getValue("vkpls_vllogo") == 0) {
    GM_setValue("vkpls_vllogo", 1)
    location.reload()
  }
  else if (GM_getValue("vkpls_vllogo") == 1) {
    GM_setValue("vkpls_vllogo", 0)
    location.reload()
  }
}

function vkpls_vl() {
  var vkpls_wikilogo = document.querySelector(".mw-wiki-logo")
  vkpls_wikilogo.removeAttribute("class")
  vkpls_wikilogo.setAttribute("style","background-image:url(https://download.vikidia.org/vikidia/fr/images/9/9a/FAVICON_HD.png)")
}

function vkpls_options() {
  GM_unregisterMenuCommand("[1]Options")
  var vkpls_mwcontent = document.querySelector(".mw-body")
  document.querySelector(".mw-body").innerHTML = "<button id='vkpls_tl_vl'>Logo Vikiland</button>"
  document.getElementById('vkpls_tl_vl').addEventListener('click', function (event) {
    vkpls_tl_vl()
  });
}

var vkpls_vkcod_t = 0

function vkpls_vkcod() {
  var vkpls_vkcod_username = document.querySelector("#pt-userpage a").innerHTML
  if (unsafeWindow.blacklist.includes(vkpls_vkcod_username)) {
    alert("Veuillez vous deconnecter pendant 24h pour pouvoir utiliser le vikicodage, ne marche pas sans déconnexion")
  }
  else {
  vkpls_vkcod_c1 = window.prompt("Voulez vous vikicoder ou vikidécoder? (V ou O)")
  if (vkpls_vkcod_c1 == "V") {
    vkpls_vkcod_c2 = window.prompt("Votre message")
    alert(btoa(vkpls_vkcod_c2))
  }
  else if (vkpls_vkcod_c1 == "O") {
    vkpls_vkcod_c2 = window.prompt("Votre message")
    alert(atob(vkpls_vkcod_c2))
  }
  }
}

GM_unregisterMenuCommand("[1]Options")
GM_registerMenuCommand("[1]Options", vkpls_options)
GM_unregisterMenuCommand("[2]Vikicodage")
GM_registerMenuCommand("[2]Vikicodage", vkpls_vkcod)


if (GM_getValue("vkpls_vllogo") == 1) {
  vkpls_vl()
}