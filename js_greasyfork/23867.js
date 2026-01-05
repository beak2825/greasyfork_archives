// ==UserScript==
// @name OGARio No Name
// @namespace No Name.v1
// @version 1.0
// @description Edition Of OGARio By szymy
// @author No Name// @match http://agar.io/*
// @updateURL
// @run-at document-start
// @grant GM_xmlhttpRequest
// @connect agar.io// ==/UserScript==
// Copyright © 2016 ogario.ovh
if (location.host == "agar.io" && location.pathname == "/") {location.href = "http://agar.io/ogario" + location.hash;return;}var ogarioJS = '';var ogarioSniffJS = '';var ogarioCSS = '';var cpickerJS = '';var cpickerCSS = '';var toastrJS = '';var toastrCSS = '';function inject(page) {var _page = page.replace("", cpickerCSS + toastrCSS + ogarioCSS + cpickerJS + toastrJS + ogarioSniffJS + "");page = page.replace(/[\s]*?.*?window\.NREUM[\s\S]*?<\/script>/, "");page = page.replace(/<\/script>/, "");page = page.replace("", ogarioJS + "");return _page;}window.stop();document.documentElement.innerHTML = "";GM_xmlhttpRequest({method : "GET",url : "http://agar.io/",onload : function(e) {var doc = inject(e.responseText);document.open();document.write(doc);nuevoScript();document.close();}});function nuevoScript() {window.onload = function() {inicio();}}f