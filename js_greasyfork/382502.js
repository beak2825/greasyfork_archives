// ==UserScript==
// @name        Torrentz2 Magnet Links
// @namespace   mnewt
// @description Add magnet links to Torrentz2 search results
// @include     https://torrentz2.eu/*
// @include     https://torrentz2.me/*
// @include     https://torrentz2.is/*
// @include     https://torrentzwealmisr.onion.ly/*
// @version     1.2
// @grant       GM_addStyle
// @inject-into auto
// @downloadURL https://update.greasyfork.org/scripts/382502/Torrentz2%20Magnet%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/382502/Torrentz2%20Magnet%20Links.meta.js
// ==/UserScript==

const linkText = "🧲&nbsp;";
const defaultTrackers = `
udp://tracker.opentrackr.org:1337/announce
udp://tracker.internetwarriors.net:1337/announce
udp://exodus.desync.com:6969/announce
udp://tracker.cyberia.is:6969/announce
http://explodie.org:6969/announce
udp://opentracker.i2p.rocks:6969/announce
udp://47.ip-51-68-199.eu:6969/announce
http://open.acgnxtracker.com:80/announce
udp://open.stealth.si:80/announce
udp://www.torrent.eu.org:451/announce
udp://tracker.torrent.eu.org:451/announce
udp://tracker.tiny-vps.com:6969/announce
udp://tracker.ds.is:6969/announce
udp://retracker.lanta-net.ru:2710/announce
udp://tracker.moeking.me:6969/announce
udp://tracker.dler.org:6969/announce
udp://ipv4.tracker.harry.lu:80/announce
http://rt.tace.ru:80/announce
udp://valakas.rollo.dnsabr.com:2710/announce
udp://opentor.org:2710/announce
`;

const trackerQuery = defaultTrackers.replace(/\n/g,"&tr=");

document.querySelectorAll('dl dt a').forEach(function(a) {
  const hash = a.href.substr(a.href.length - 40);
  const magnetUri = "magnet:?xt=urn:btih:" + hash + "&dn=" + a.textContent + trackerQuery;
  const magnetLink = document.createElement("a");
  magnetLink.href = magnetUri;
  magnetLink.style.fontWeight = "bold";
  magnetLink.innerHTML = linkText;
  a.parentNode.insertBefore(magnetLink, a);
});