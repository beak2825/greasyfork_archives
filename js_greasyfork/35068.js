// ==UserScript==
// @name           Rozhlas.cz downloader
// @namespace      http://matej.volfik.sweb.cz/userscripts
// @author         mat.volfik@gmail.com
// @description    Přidá odkaz pro stažení k výsledkům hledání na rozhlas.cz
// @description:en Add download link to search results on rozhlas.cz
// @include        http://*.rozhlas.cz/*
// @grant          none
// @version        1.0
// @require        https://cdn.jsdelivr.net/npm/jquery@3.2/dist/jquery.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/35068/Rozhlascz%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/35068/Rozhlascz%20downloader.meta.js
// ==/UserScript==

function process(i, one) {
  one.href = "http://media.rozhlas.cz/_download/" + one.href.split("/")[4] + ".mp3";
  one.style = "background-image: url('http://i.imgur.com/6oGKZT2.gif') !important; background-size: contain;";
  one.children[0].innerHTML = "Stáhnout"
  one.onclick = function() { alert("Stahujete pomocí skriptu Rozhlas.cz downloader. Děkuji že ho používáte!"); };
}

$(".player-archive").each(process);