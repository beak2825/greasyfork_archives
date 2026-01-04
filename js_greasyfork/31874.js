// ==UserScript==
// @name         Osu Kama MOD
// @namespace    OsuKM
// @version      0.4
// @description  Mods para la página de Osu!
// @author       Kamasado
// @include      https://osu.ppy.sh/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/31874/Osu%20Kama%20MOD.user.js
// @updateURL https://update.greasyfork.org/scripts/31874/Osu%20Kama%20MOD.meta.js
// ==/UserScript==

/*-----------------------
- OSU DIRECT VENEZOLANO -
-----------------------*/
if (!document.referrer && window.location.href.includes('/b/')) {
    var url;
    var id;
    var apiurl;
    url = window.location.href;
    document.write('Enlace captado por KamaMOD.<br>Descargando...');
    url = url.replace('n', '');
    id = url.slice(url.lastIndexOf('/') + 1, url.lenght);
    apiurl = 'https://osu.ppy.sh/api/get_beatmaps?';
    apiurl += 'k=56eb2d11b3264f69212726901767b3fdc01e7e5e&b=' + id;

    $.getJSON(apiurl, function(json, textStatus) {
        var bmsetid = json[0].beatmapset_id;
        var downlink = 'https://osu.ppy.sh/d/' + bmsetid + 'n';
        window.location.href = downlink;
    });
}
//-----------------------