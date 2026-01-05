// ==UserScript==
// @name        Torrentz2 Magnet
// @namespace   tzeumg
// @description Add magnet link to torrentz2
// @include     https://torrentz2.eu/*
// @include     https://torrentz2.me/*
// @include     https://torrentz2.is/*
// @version     2.3
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/21547/Torrentz2%20Magnet.user.js
// @updateURL https://update.greasyfork.org/scripts/21547/Torrentz2%20Magnet.meta.js
// ==/UserScript==

var downloadText = "🔗";

if (/^https:\/\/torrentz2\.(eu|me|is)(\/verified.*|\/search.*|\/my.*)$/.test(document.URL)) {
    var dtlist = document.querySelectorAll('.results > dl> dt');
    for (var i = 0; i < dtlist.length; i++) {
        var linkel = dtlist[i].firstChild;
        var hash = linkel.href.substr(linkel.href.length - 40);
        var dn = linkel.innerHTML;
        var defaulttrackers = `
udp://tracker.sktorrent.net:6969/announce
udp://tracker.coppersurfer.tk:6969/announce
http://www.opentrackr.org/announce
udp://tracker.leechers-paradise.org:6969/announce
udp://tracker.zer0day.to:1337/announce
http://bt.artvid.ru:6969/announce
`;
        defaulttrackers = "&tr=" + defaulttrackers.trim().replace(/\n/g,"&tr=");
        var magneturi = "magnet:?xt=urn:btih:" + hash + "&dn=" + dn + defaulttrackers;

        var magnetlink = document.createElement("a");
        magnetlink.href = magneturi;
        magnetlink.style.fontWeight = "bold";
        magnetlink.innerHTML = downloadText+" ";
        dtlist[i].insertBefore(magnetlink, dtlist[i].firstChild);
    }
} else if (/^https:\/\/torrentz2\.(eu|me|is)\/[a-f0-9]{40}$/.test(document.URL)){
    var hash =  document.querySelector('.trackers > h2:nth-child(1)').childNodes[1].nodeValue.substr(6);
    var dn = document.querySelector('.downlinks > h2:nth-child(2) > span:nth-child(1)').innerText.trim();
    var tr = '';

    var trackers = document.querySelectorAll('.trackers > dl > dt');

    for (var i = 0; i < trackers.length; i++) {
        tr += "&tr=" + trackers[i].innerHTML;
    }

    var magneturi = "magnet:?xt=urn:btih:" + hash + "&dn=" + dn + tr;

    var torrentTitle = document.querySelector(".downlinks > h2:nth-child(2) > span:nth-child(1)");
    var magnetlink = document.createElement("a");
    magnetlink.href = magneturi;
    magnetlink.style.fontWeight = "bold";
    magnetlink.innerHTML = downloadText+" ";
    torrentTitle.insertBefore(magnetlink, torrentTitle.firstChild);
}