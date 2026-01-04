// ==UserScript==
// @name         animevost playlist exporter
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  playlist exporter
// @author       You
// @match        https://*.vost.pw/*
// @license MIT
// @icon         https://www.google.com/s2/favicons?domain=animevost.org
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/433225/animevost%20playlist%20exporter.user.js
// @updateURL https://update.greasyfork.org/scripts/433225/animevost%20playlist%20exporter.meta.js
// ==/UserScript==

function last_list() {
    var lne = window.location.href.split("-")[0].split("/");
    var id = lne[lne.length-1];
    return id;
}

function gen_name() {
    var lne = window.location.href.split("/");
    var id = lne[lne.length-1].replace(".html","").replace("-","_");
    return id;
}

window.onload = function(){

    var lnk = '<a href="data:application/octet-stream,';
    var button = document.querySelector("div.bottomProblem");
    button.innerHTML = '<a class="fastPunkt">загрузка</a>';

    GM_xmlhttpRequest({
        method: "POST",
        url: "https://api.animevost.org/v1/playlist",
        data: "id="+last_list(),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        responseType: "json",
        onload: function(response) {
            var data = response.response;
            data.sort(function(a, b){return Number(a.name.split(" ")[0]) - Number(b.name.split(" ")[0])});
            data.forEach(function(hd){
                var url = hd.hd;
                var seria = hd.name;
                var f = seria.split(' ')[0];
                lnk += encodeURIComponent(pl.replace('{f}', f).replace('{seria}', seria).replace('{url}', url));
            });
            lnk += `" download="${gen_name()}.m3u8" class="fastPunkt">скачать плейлист</a>`;
            button.innerHTML = lnk;
        }
    });

};

const pl = '#EXTINF:-1 , {f} {seria}\n{url}\n';
