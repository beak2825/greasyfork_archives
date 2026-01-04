// ==UserScript==
// @name         sadeceses için teşekkür, altyazı ve torrent
// @namespace    http://tampermonkey.net/
// @version      1
// @description  sadeceses.com sitesine 2 altyazı, 2 torrent sitesini ekler ve formundaki hızlı cevap altına teşekkürler butonu ekler.
// @author       tolga
// @match        http://www.sadeceses.com/*
// @require     http://code.jquery.com/jquery-3.4.1.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401981/sadeceses%20i%C3%A7in%20te%C5%9Fekk%C3%BCr%2C%20altyaz%C4%B1%20ve%20torrent.user.js
// @updateURL https://update.greasyfork.org/scripts/401981/sadeceses%20i%C3%A7in%20te%C5%9Fekk%C3%BCr%2C%20altyaz%C4%B1%20ve%20torrent.meta.js
// ==/UserScript==
setTimeout(function(){

var Kontrol = document.querySelector("div.blockfoot.actionbuttons div.group");

var IMDBul = document.querySelector("span.imdbRatingPlugin.imdbRatingStyle4");

// Altyazı torrnet

if (IMDBul !== null ){

var IMDBLink = document.querySelectorAll("span.imdbRatingPlugin.imdbRatingStyle4 > a")[0].href;
var IMDbID = IMDBLink.split("/")[4];
var IMDbID4TA = IMDbID.replace("tt","");
var MYear = document.querySelectorAll("span.threadtitle")[0].innerText.match(/\d+/g)[0];
var MName = document.querySelectorAll("span.threadtitle")[0].innerText.split(MYear)[0];

    /*----------------planetdp-----------------*/
    var planetdpLink = document.createElement('a');
    planetdpLink.href = 'https://www.planetdp.org/movie/search?title=' + IMDbID;
    planetdpLink.target = 'planetdp';
    var planetdpIcon = new Image();
    planetdpIcon.src= 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACI0lEQVQ4jZ2TvU8TcRjHf5faF3rX68v17rg2Tk4MxjARBwdjCHEyDE6OxMk4dHI0/gXMDC4uxiZqGpDm+iK9UugrlLZWUhgdvEYiCZTWtvf7fR1ImxgQrMN3eJ48zyd5nuf7EABc/4DMWC3y0KwRHgA3icg4OCDz9JC87jdtT/4PAHCdBlHR4pK0ZWv3m7ZHEwHMGuFPikQCwOGr/Rn27aDNG9/7dcftawG/KuTW4Tpxsrq7Rmv88rig4Wig6QRrODdP846ZvwK6RcciosRm7QnvUXOBVfkfg8rUHACO7k1FUHcDX9wY7Lq2zsr22QuAftH9srJC7MOSuMx2ebAdYaQmAM7UCd8r8AaqAlAVMKzw6V7OdS8aJbZzwLb47mfS76W5QISVPWBFEah4gR3Pvqmfn/YoKTxnZREoi0BFBCuLsIrCYwKAG+Z8ta4RuGllpEUUfEDJR3sZ330AXDvuudvNetso+cEKfrBtP9iWPz/Ii3PjESxDOh0Y8iyyysIw54+N5jtJBD4hLwF5CXRTAs0Gvg2zgYU/dmC+ITzNyLA25KVR8ng9+IoaCpCTwTIyaEZuWxvBSw1GjlalMDLT6MSDEfOj9GCYUnswVLDPKmhKoTQtv7jSB8cflDsspcFKaGCpaYq0BprUYCW1FVNXr/0N0okp8ywRAkuEwPQQLD30thNT1H/+hbNV7Sn0MKx4ON9f0y5125WA3lpoCboWmbRxpN+LnLX+CQnBkgAAAABJRU5ErkJggg==';
    planetdpIcon.alt= 'planetdp.org';
    planetdpIcon.title= 'planetdp.org';
    planetdpIcon.setAttribute('width', '20px');
    planetdpIcon.setAttribute('height', '20px');
    planetdpIcon.style.marginLeft = '10px';
    planetdpLink.appendChild(planetdpIcon);
    IMDBul.append(planetdpLink);
    /*----------------planetdp-----------------*/
    
    /*----------------Türkçe Altyazı-----------------*/
    var taLink = document.createElement('a');
    taLink.href = 'http://www.turkcealtyazi.org/mov/' + IMDbID4TA + '/';
    taLink.target = 'ta';
    
    var taIcon = new Image();
    taIcon.src= ' data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAxlBMVEXs5uDYmFjej0LYlVTs5Nzaq376fAD7fQDapXLdoWbxgRTmlkvpizPsiCfqgyHnlUnnlEb3ewDfoGLnk0X////pwJzptYbcoG327+n38e7udgLv2snveQfotYbppWfkhSz7+ff28e7tdgLnk0Tnn1zppmf5fADpxqjugRfquo/vfQ/qjDPnsYD2egDtegvoxqnmupTvegncoWjjuZXu39Xu39TlsIDarYL4ewD1eQD5ewDaqXjw7Ojao27eoGLao2zu6eT///+9dV4WAAAAQXRSTlMcpbuoIX79/YqW/f39/f39/f2a/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/ZT9/f39e/39/YYUjpqQGHUulP4AAAABYktHRBSS38k1AAAAB3RJTUUH4gEfDA8XrxMePAAAAIlJREFUGNOdzdcOAkEIQFFsoI51xV7Wuvbeu///VcJo4jx7Hwg5IQEgFHaKRCGG5IRxSCSNSaWNlMmaXN4Dr8BcLLFUrnC1ZqHeaCq0/HanK9DjPloYBEN7MRpP6AM0nc0FSN58QVYF+gH9DbhYKqzWFjZEwXan7Q+ocJR5OtsucnyF2/3h9Hy9Acj/Ff/423BoAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE4LTAxLTMxVDEyOjE1OjIzLTA3OjAwC521fwAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOC0wMS0zMVQxMjoxNToyMy0wNzowMHrADcMAAAAASUVORK5CYII=';
    taIcon.alt= 'TurkceAltyazi.org';
    taIcon.title= 'TurkceAltyazi.org';
    taIcon.setAttribute('width', '20px');
    taIcon.setAttribute('height', '20px');
    taIcon.style.marginLeft = '15px';
   
    taLink.appendChild(taIcon);
    IMDBul.append(taLink);
    /*----------------Türkçe Altyazı-----------------*/
    
        /*----------------X1337-----------------*/
    var X1337Link = document.createElement('a');
    X1337Link.href = 'https://1337x.to/search/' + MName + ' ' + MYear + '/1/';
    X1337Link.target = 'X1337';
    var X1337Icon = new Image();
    X1337Icon.src= 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAB/ElEQVQ4jc2QzW/ScBjHf8JGaetpcQcjcthmgrqZEWIFWlo6M5niBoH4MhIyHIjxhQQlnMXEg/4hetB49ODJiwcPZp0RA9K1/ZUCbSHeTNxi5uPFedkLnozP9ZvP53meL0L/zRhXfWm7GFy3i2HJLLJ1vHyqspPhzGnRLsfe25X4er+61OxlzzzeJWjFvRPG8vQnM89ArxCE7kpANa54jtUQcvQKoZeDyiUYVBehfz+2raUnk3tesbHkWTBXZjetPAPWzRAY13wlNXWCN++K3/sPLsKgughGganVEHLs98mh7nXf814uAN3Vs9DJBdqdVeajVToP/UocenfEOk6dPHpgF0rCM2Nkpr92cgGwiiyYtwWwyzGw7ok/tMTxG39VqJ6eeGLmz4F1iwO7NAdmngE8P/buLUIjQ+EaQg4jM/PMLAShm52FTtILukiDyo421/xofKhAvTA2rye9W/rCEcBRCnCEgPbcYdBFGjSBenQgLE8hQhepNxpPAOYJUHmXpPDEa12kfwvIthxGk/sKWqwzhQVyG0cp0AQSvoSdWTmE/Krg/oYFErBIQ4tzPX2BkHMX/DmEpmTO1diBVZ5orPnReA0hxwZHvMJRClTeDUqE+NkMOxN7btcEStIEUtIEd11mR8t/Mo64rETcHxTOJeEo3ZDDIw+HlvnP5heCh+ZBZ0Cl7QAAAABJRU5ErkJggg==';
    X1337Icon.alt= '1337x.to';
    X1337Icon.title= '1337x.to';
    X1337Icon.setAttribute('width', '20px');
    X1337Icon.setAttribute('height', '20px');
    X1337Icon.style.marginLeft = '15px';
    X1337Link.appendChild(X1337Icon);
    IMDBul.append(X1337Link);
    /*----------------X1337-----------------*/
    
    /*----------------yts-----------------*/
    var ytsLink = document.createElement('a');
    ytsLink.href = 'https://yts.mx/browse-movies/' + MName + '/all/all/0/latest';
    ytsLink.target = 'yts';
    var ytsIcon = new Image();
    ytsIcon.src=  'data:image/png;base64,AAABAAEAEBAAAAAAAABoBQAAFgAAACgAAAAQAAAAIAAAAAEACAAAAAAAAAEAAAAAAAAAAAAAAAEAAAAAAAAAvwAAHjMdABpTFgAeKxsAAMUAAAqdDQAhKxsAAMsAABZfFgAFtQQAHjQbACQfHAALmAsAEX8PAA2UDgAjHh8AICEfACAlHAAWZRYAAbACAAOwAgAQdhAAAagAABhdFAAcHx0ACqgIABw1GQAWYBQAHh8dAB4xHAAYYBQAA8sBABo7GQAfHiAAIR4gACMeIAAWbBQAEYkNABwgGwACtgMAIyAbAAqrCQASXBAAE1QWACEfHgAMmQoAAMAAABlRFgAExwUACqAHACMfHgAHnwoAJB8eABdQGQAhIh4ADYkOACAoHgADwgMACaUKABRzEgAHrAcAAMwAAAPXAgAfIBwAHR8fABw5GAAhIBwAHjEeAB8fHwAXURcAIR8fAB4mHAAZWxQAB5cJABCJDwAVcBMAHEEbAAK6AgAfIx0AEIAQAAmcDAAVWBUAEHERAAyKDQAfKR0AAr8FAASxAwAEtQAAFV4VABN3EQALlwoAFmEVACEhGwAdIB4AEowQAB8gHgAGuQYAE3ESAB8sHgAdMxsAALsBACAdHwACvgEAIiAfAA6IDAAPhA8AJCAfAAydCwAVahYABMQBAAK1AgAHqggAGkkYAAqmCwAgHh0AB7EFAAO4AgAiHh0ACpsJACAhHQAWZRQAICAgACIgIAADvQUAGVUYAAerBgAgKh0ACJkHACAfGwAcHh4AG0YZABJ0FAAdMB0AALwAAB4eHgAgHh4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARIcjJk4kfTlte2sXZ4csREY/LFgJPToNYTtpKTwvQDIhC4MuM3BGcoZ5XYYIUAJqcluFXiwiVEwdgDJGHIRKQzhudkYmPyA+BV+HMix1BlFSTQEjRF9nMHtjRF9GhmVib2gmRBAyHHEfKkJlX0JGclYeRFwyRl8lB1pdEEZ1RkQTRV8PLECGLQRVGodGRCxGFDVCh19EEWBmABk2h3IcXzEbh3ksNCsAJ3N0FRgiLEYSWXccQmUOFgxBV2RILCIsR1N+LHlfN0l4LEt/T4ZfXyx8bEYsQnIoRiGBHCwscjREdUWCRCwsRj9yMiEsh3qGX3oyCgMsRkBfEA8sX19dXwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=';
    ytsIcon.alt= 'yts.mx';
    ytsIcon.title= 'yts.mx';
    ytsIcon.setAttribute('width', '20px');
    ytsIcon.setAttribute('height', '20px');
    ytsIcon.style.marginLeft = '15px';
    ytsLink.appendChild(ytsIcon);
    IMDBul.append(ytsLink);
    /*----------------yts-----------------*/
}

// Teşekkür Butonu 

	if (Kontrol !== null ){
		var HCevap = $("div.blockfoot.actionbuttons div.group");
		var ekle = $("#cke_contents_vB_Editor_QR_editor > textarea.cke_source.cke_enable_context_menu");
		
		HCevap.append('<span class="thanks">Teşekkürler</span>');
		$("span.thanks").click(function(){
		ekle.val( "Teşekkürler." );
		});
	}

}, 3000);

// style

GM_addStyle(`
	span.thanks{
		padding: 2px 5px; margin-left: 5px; background-image: linear-gradient(whitesmoke, #dedede); border: 1px solid #a8a8a8; color:#424242; cursor:pointer; font:bold 11px Tahoma, Calibri, Verdana, Geneva, sans-serif;
	}
`)
