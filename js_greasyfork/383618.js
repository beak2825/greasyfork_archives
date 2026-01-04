// ==UserScript==
// @name         Yts Altyazı, torrent
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  yts de film sayfasına türkçe altyazı ve torrent için arama bağlantısı ekliyor
// @author       tolga golelcin
// @match        https://yts.lt/movie/*
// @match        https://yts.am/movie/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383618/Yts%20Altyaz%C4%B1%2C%20torrent.user.js
// @updateURL https://update.greasyfork.org/scripts/383618/Yts%20Altyaz%C4%B1%2C%20torrent.meta.js
// ==/UserScript==

var list = document.querySelectorAll ("a[title='IMDb Rating']")[0].href;
var IMDbID = list.split("/")[4];
var IMDbID4TA = IMDbID.replace("tt","");
var spanNOBR = document.querySelector('span.hidden-xs.icon-star');
var Mname = document.querySelectorAll("div.hidden-xs h1")[0].innerHTML;

if (spanNOBR !== null)
  {
    var hr01 = document.createElement('hr');
    hr01.style.margin = 2;
    spanNOBR.appendChild(hr01);

    /*----------------planetdp-----------------*/
    var planetdpLink = document.createElement('a');
    planetdpLink.href = 'https://www.planetdp.org/movie/search?title=' + IMDbID + '/';
    planetdpLink.target = 'planetdp';

    var planetdpIcon = new Image();
    planetdpIcon.src= 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACI0lEQVQ4jZ2TvU8TcRjHf5faF3rX68v17rg2Tk4MxjARBwdjCHEyDE6OxMk4dHI0/gXMDC4uxiZqGpDm+iK9UugrlLZWUhgdvEYiCZTWtvf7fR1ImxgQrMN3eJ48zyd5nuf7EABc/4DMWC3y0KwRHgA3icg4OCDz9JC87jdtT/4PAHCdBlHR4pK0ZWv3m7ZHEwHMGuFPikQCwOGr/Rn27aDNG9/7dcftawG/KuTW4Tpxsrq7Rmv88rig4Wig6QRrODdP846ZvwK6RcciosRm7QnvUXOBVfkfg8rUHACO7k1FUHcDX9wY7Lq2zsr22QuAftH9srJC7MOSuMx2ebAdYaQmAM7UCd8r8AaqAlAVMKzw6V7OdS8aJbZzwLb47mfS76W5QISVPWBFEah4gR3Pvqmfn/YoKTxnZREoi0BFBCuLsIrCYwKAG+Z8ta4RuGllpEUUfEDJR3sZ330AXDvuudvNetso+cEKfrBtP9iWPz/Ii3PjESxDOh0Y8iyyysIw54+N5jtJBD4hLwF5CXRTAs0Gvg2zgYU/dmC+ITzNyLA25KVR8ng9+IoaCpCTwTIyaEZuWxvBSw1GjlalMDLT6MSDEfOj9GCYUnswVLDPKmhKoTQtv7jSB8cflDsspcFKaGCpaYq0BprUYCW1FVNXr/0N0okp8ywRAkuEwPQQLD30thNT1H/+hbNV7Sn0MKx4ON9f0y5125WA3lpoCboWmbRxpN+LnLX+CQnBkgAAAABJRU5ErkJggg==';
	planetdpIcon.alt= 'planetdp.org';
    planetdpIcon.title= 'planetdp.org';
    planetdpIcon.setAttribute('width', '16px');
    planetdpIcon.setAttribute('height', '16px');
    planetdpIcon.style.marginLeft = '15px';

    planetdpLink.appendChild(planetdpIcon);
    spanNOBR.appendChild(planetdpLink);
    /*----------------planetdp-----------------*/

    /*----------------Türkçe Altyazı-----------------*/
    var taLink = document.createElement('a');
    taLink.href = 'http://www.turkcealtyazi.org/mov/' + IMDbID4TA + '/';
    taLink.target = 'ta';


    var taIcon = new Image();
    taIcon.src= ' data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAxlBMVEXs5uDYmFjej0LYlVTs5Nzaq376fAD7fQDapXLdoWbxgRTmlkvpizPsiCfqgyHnlUnnlEb3ewDfoGLnk0X////pwJzptYbcoG327+n38e7udgLv2snveQfotYbppWfkhSz7+ff28e7tdgLnk0Tnn1zppmf5fADpxqjugRfquo/vfQ/qjDPnsYD2egDtegvoxqnmupTvegncoWjjuZXu39Xu39TlsIDarYL4ewD1eQD5ewDaqXjw7Ojao27eoGLao2zu6eT///+9dV4WAAAAQXRSTlMcpbuoIX79/YqW/f39/f39/f2a/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/ZT9/f39e/39/YYUjpqQGHUulP4AAAABYktHRBSS38k1AAAAB3RJTUUH4gEfDA8XrxMePAAAAIlJREFUGNOdzdcOAkEIQFFsoI51xV7Wuvbeu///VcJo4jx7Hwg5IQEgFHaKRCGG5IRxSCSNSaWNlMmaXN4Dr8BcLLFUrnC1ZqHeaCq0/HanK9DjPloYBEN7MRpP6AM0nc0FSN58QVYF+gH9DbhYKqzWFjZEwXan7Q+ocJR5OtsucnyF2/3h9Hy9Acj/Ff/423BoAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE4LTAxLTMxVDEyOjE1OjIzLTA3OjAwC521fwAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOC0wMS0zMVQxMjoxNToyMy0wNzowMHrADcMAAAAASUVORK5CYII=';
    taIcon.alt= 'TurkceAltyazi.org';
    taIcon.title= 'TurkceAltyazi.org';
    taIcon.setAttribute('width', '16px');
    taIcon.setAttribute('height', '16px');
    taIcon.style.marginLeft = '15px';

    taLink.appendChild(taIcon);
    spanNOBR.appendChild(taLink);
    /*----------------Türkçe Altyazı-----------------*/

    /*----------------1337xTorrents-----------------*/
    var torrenttLink = document.createElement('a');
    torrenttLink.href = 'https://1337x.to/search/' + Mname + '/1/';
    torrenttLink.target = '1337x.to';

    var torrenttIcon = new Image();
    torrenttIcon.src= 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB/ElEQVQ4jc2QzW/ScBjHf8JGaetpcQcjcthmgrqZEWIFWlo6M5niBoH4MhIyHIjxhQQlnMXEg/4hetB49ODJiwcPZp0RA9K1/ZUCbSHeTNxi5uPFedkLnozP9ZvP53meL0L/zRhXfWm7GFy3i2HJLLJ1vHyqspPhzGnRLsfe25X4er+61OxlzzzeJWjFvRPG8vQnM89ArxCE7kpANa54jtUQcvQKoZeDyiUYVBehfz+2raUnk3tesbHkWTBXZjetPAPWzRAY13wlNXWCN++K3/sPLsKgughGganVEHLs98mh7nXf814uAN3Vs9DJBdqdVeajVToP/UocenfEOk6dPHpgF0rCM2Nkpr92cgGwiiyYtwWwyzGw7ok/tMTxG39VqJ6eeGLmz4F1iwO7NAdmngE8P/buLUIjQ+EaQg4jM/PMLAShm52FTtILukiDyo421/xofKhAvTA2rye9W/rCEcBRCnCEgPbcYdBFGjSBenQgLE8hQhepNxpPAOYJUHmXpPDEa12kfwvIthxGk/sKWqwzhQVyG0cp0AQSvoSdWTmE/Krg/oYFErBIQ4tzPX2BkHMX/DmEpmTO1diBVZ5orPnReA0hxwZHvMJRClTeDUqE+NkMOxN7btcEStIEUtIEd11mR8t/Mo64rETcHxTOJeEo3ZDDIw+HlvnP5heCh+ZBZ0Cl7QAAAABJRU5ErkJggg==';
    torrenttIcon.alt= '1337x.to';
    torrenttIcon.title= '1337x.to';
    torrenttIcon.setAttribute('width', '16px');
    torrenttIcon.setAttribute('height', '16px');
    torrenttIcon.style.marginLeft = '15px';

    torrenttLink.appendChild(torrenttIcon);
    spanNOBR.appendChild(torrenttLink);
    /*----------------1337xTorrents-----------------*/
  }