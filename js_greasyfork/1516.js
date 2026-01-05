// ==UserScript==
// @name           TrocaHTTPporHTTPS
// @namespace      http://userscripts.org/scripts/show/77703
// @author         RASG
// @description    [PT] Troca o protocolo 'http' por 'https' (seguro) para TODOS os sites (se este nao tiver uma versao segura, causa erro)
// @include        http://*
// @version        2012.01.01
// @downloadURL https://update.greasyfork.org/scripts/1516/TrocaHTTPporHTTPS.user.js
// @updateURL https://update.greasyfork.org/scripts/1516/TrocaHTTPporHTTPS.meta.js
// ==/UserScript==

(function() {
    var url = window.location.href;

    if (url.indexOf("http:")==0) {
        window.location.replace(location.href.replace(location.protocol, "https:"));
    }

    if (url.indexOf("https:")==0) {
        for (var i=0,link; (link=document.links[i]); i++) {
            if (link.href.indexOf("http:")==0) link.href = link.href.replace(location.protocol, "https:");
        }
    }

}
)();