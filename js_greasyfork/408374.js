// ==UserScript==
// @name        Limetorrents Magnet Links
// @namespace   mnewt
// @description Add magnet links to Limetorrents
// @include     https://www.limetorrents.cc/*
// @include     https://www.limetorrents.info/*
// @version     1.0
// @grant       GM_addStyle
// @inject-into auto
// @downloadURL https://update.greasyfork.org/scripts/408374/Limetorrents%20Magnet%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/408374/Limetorrents%20Magnet%20Links.meta.js
// ==/UserScript==

const linkText = "🧲&nbsp;";
const defaultTrackers = `
udp://wambo.club:1337/announce
udp://tracker.dutchtracking.com:6969/announce
udp://tc.animereactor.ru:8082/announce
udp://tracker.justseed.it:1337/announce
udp://tracker.leechers-paradise.org:6969/announce
udp://tracker.opentrackr.org:1337/announce
https://open.kickasstracker.com:443/announce
udp://tracker.coppersurfer.tk:6969/announce
udp://open.stealth.si:80/announce
http://87.253.152.137/announce
http://91.216.110.47/announce
http://91.217.91.21:3218/announce
http://91.218.230.81:6969/announce
http://93.92.64.5/announce
http://atrack.pow7.com/announce
http://bt.henbt.com:2710/announce
http://bt.pusacg.org:8080/announce
https://tracker.bt-hash.com:443/announce
udp://tracker.leechers-paradise.org:6969
https://182.176.139.129:6969/announce
udp://zephir.monocul.us:6969/announce
https://tracker.dutchtracking.com:80/announce
https://grifon.info:80/announce
udp://tracker.kicks-ass.net:80/announce
udp://p4p.arenabg.com:1337/announce
udp://tracker.aletorrenty.pl:2710/announce
udp://tracker.sktorrent.net:6969/announce
udp://tracker.internetwarriors.net:1337/announce
https://tracker.parrotsec.org:443/announce
https://tracker.moxing.party:6969/announce
https://tracker.ipv6tracker.ru:80/announce
https://tracker.fastdownload.xyz:443/announce
udp://open.stealth.si:80/announce
https://gwp2-v19.rinet.ru:80/announce
https://tr.kxmp.cf:80/announce
https://explodie.org:6969/announce`;

const trackerQuery = defaultTrackers.replace(/\n/g,"&tr=");

document.querySelectorAll('.tt-name').forEach(function(e) {
  a = e.querySelector('a.csprite_dl14');
  if(a) {
    const hash = a.href.match("[0-9A-Fa-f]{40}");
    const description = encodeURIComponent(e.textContent);
    const magnetUri = "magnet:?xt=urn:btih:" + hash + "&dn=" + description + trackerQuery;
    const magnetLink = document.createElement("a");
    magnetLink.href = magnetUri;
    magnetLink.style.fontWeight = "bold";
    magnetLink.innerHTML = linkText;
    e.insertBefore(magnetLink, a);
  }
});
