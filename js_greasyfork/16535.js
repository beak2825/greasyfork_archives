// ==UserScript==
// @name          Lightsaber Escape QR Code Display
// @namespace     DoomTay
// @description   Adds a QR Code of the "lightsaber URL" to the front page of Lightsaber Escape
// @version       1.2.0
// @include       https://lightsaber.withgoogle.com/
// @grant         GM_xmlhttpRequest

// @downloadURL https://update.greasyfork.org/scripts/16535/Lightsaber%20Escape%20QR%20Code%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/16535/Lightsaber%20Escape%20QR%20Code%20Display.meta.js
// ==/UserScript==

var observer = new MutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {
		var lightsaberURL = "";
		if(mutation.type == "characterData" && mutation.target.parentNode.id == "url") lightsaberURL = mutation.target.textContent;
		else if(mutation.type == "childList" && mutation.target.id == "url" && Array.prototype.some.call(mutation.addedNodes,node => node.textContent.includes("g.co"))) lightsaberURL = Array.prototype.find.call(mutation.addedNodes,node => node.textContent.includes("g.co")).textContent;
		if(lightsaberURL)
		{
			observer.disconnect();
			//Using GM_xmlhttpRequest because this site doesn't like off-domain images
			GM_xmlhttpRequest({
				method: "GET",
				url: "https://chart.googleapis.com/chart?chs=120x120&cht=qr&chl=" + lightsaberURL + "&chld=L|1&choe=UTF-8",
				overrideMimeType: "text/plain; charset=x-user-defined",
				onload: function(response) {
					var QRCode = new Image();
					QRCode.id = "LSCode";
					
					var arr = Uint8Array.from(response.responseText,thing => thing.charCodeAt(0) & 0xFF);
					var imageData = new Blob([arr.buffer],{type:"image/png"});
					QRCode.src = window.URL.createObjectURL(imageData);
					document.getElementsByClassName("centered")[0].insertBefore(QRCode,document.getElementsByClassName("connection-url-wrapper style-scope sw-page-landing")[0]);
					QRCode.style.position = "absolute";
					if(innerHeight >= 1024)
					{
						QRCode.style.left = "45%";
						QRCode.style.bottom = "-35px";
					}
					else
					{
						QRCode.style.left = "75%";
						QRCode.style.bottom = "150px";
					}
				}
			});
		}
	});
});
var config = { attributes: true, childList: true, characterData: true, subtree: true };
observer.observe(document.getElementById("app"), config);