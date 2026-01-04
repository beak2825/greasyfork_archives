// ==UserScript==
// @name         Akichan Resurrect
// @description  Přidává na web Akichan.moe možnost stahovat titulky k anime, doramě a neanime z jiných stránek.
// @namespace    https://preklady.izzak.eu/
// @version      0.0.7
// @author       Izzak
// @match        https://akichan.moe/*
// @match        https://*.akichan.moe/*
// @icon         data:image/png;base64,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
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443748/Akichan%20Resurrect.user.js
// @updateURL https://update.greasyfork.org/scripts/443748/Akichan%20Resurrect.meta.js
// ==/UserScript==
var hlavni_stranka = "https://preklady.izzak.eu/";
var akichan_url_filtr = "akichan-filtr";
var akichan_js = "akichan";
var spustit_skript = false;
const http = new XMLHttpRequest()
http.open("GET", hlavni_stranka+akichan_url_filtr+"?"+Date.now())
http.send()
http.onload = () => {
  var filtry = http.responseText.split("\r\n");
  for (var i = 0, len = filtry.length; i < len; i++) {
    var filtr = new RegExp(filtry[i], )
    if (filtr.test(window.location)) spustit_skript = true;
  }
  if (spustit_skript) {
  	http.open("GET", hlavni_stranka+akichan_js+"?"+Date.now())
    http.send()
    http.onload = () => {
      var script = document.createElement('script');
      script.textContent = http.responseText;
      (document.head || document.documentElement).appendChild(script);
    }
  }
}