// ==UserScript==
// @name         CBC Radio: Download Podcast MP3
// @namespace    http://tampermonkey.net/
// @version      1
// @description  try to take over the world!
// @author       You
// @match        http://www.cbc.ca/radio/thedebaters*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35149/CBC%20Radio%3A%20Download%20Podcast%20MP3.user.js
// @updateURL https://update.greasyfork.org/scripts/35149/CBC%20Radio%3A%20Download%20Podcast%20MP3.meta.js
// ==/UserScript==


var generateDownloadLinks = function() {
	var links = document.querySelectorAll('[data-mediaid]');
	Array.prototype.forEach.call(links, function(a) {
		var mediaId = a.getAttribute('data-mediaid');

		if (a.getAttribute('data-mediaid-checked'))
			return;

		a.setAttribute('data-mediaid-checked', true);

		// var url = 'http://tpfeed.cbc.ca/f/ExhSPC/vms_5akSXx4Ng_Zn?q=*&byGuid=2685890384';
		var url = 'http://tpfeed.cbc.ca/f/ExhSPC/vms_5akSXx4Ng_Zn?q=*&byGuid=' + mediaId;
		fetch(url).then(function(response) {
			return response.text();
		}).then(function(str) {
			var data = JSON.parse(str);
			var url = data.entries[0].content[0].url;
			console.log(url);

			// var url = 'http://link.theplatform.com/s/ExhSPC/SoLpbrWpmDBa/meta.smil?feed=Player%20Selector%20-%20Prod&format=smil&mbr=true';
			fetch(url).then(function(response) {
				return response.text();
			}).then(function(xmlStr) {
				var xml = new DOMParser().parseFromString(xmlStr, "text/html");
				var ref = xml.querySelector('audio ref');
				console.log(ref.getAttribute('src'));
				console.log(ref.getAttribute('title'));
				console.log(ref.getAttribute('abstract'));
				var title = ref.getAttribute('title');
				var mp3Url = ref.getAttribute('src');
				// var mp3Url = 'http://mp3.cbc.ca/radio/CBC_Radio_VMS/39/23/thedebaters1_20160326_20857_uploaded.mp3';
				function download(url) {
					var a = document.createElement('a');
					a.href = url;
					a.click();
				}
				// download(mp3Url);

				var a2 = document.querySelector('a');
				a2.href = mp3Url;
				a2.innerText = '[MP3]' + title;
				a2.style.display = 'block';
				if (a.classList.contains('media-play')) {
					a2.className = "media";
				}
				a2.download = true;
				a.parentNode.insertBefore(a2, a);
				a2.parentNode.insertBefore(a, a2);
			});
		});
	});

}

setInterval(generateDownloadLinks, 1000);



