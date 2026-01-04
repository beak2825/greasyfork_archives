// ==UserScript==
// @name        Veoh HTML5
// @namespace   DoomTay
// @description Replaces Veoh's Flash content with HTML5
// @include     http://www.veoh.com/*
// @require     https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.9-1/crypto-js.js
// @version     0.9.0
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/370469/Veoh%20HTML5.user.js
// @updateURL https://update.greasyfork.org/scripts/370469/Veoh%20HTML5.meta.js
// ==/UserScript==

var observer = new MutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {
		mutation.addedNodes.forEach(findVideoScript);
	});
});

var config = { childList: true, subtree: true };
observer.observe(document, config);

for(var i = 0; i < document.scripts.length; i++)
{
	findVideoScript(document.scripts[i]);
}

function findVideoScript(start)
{
	if(start.nodeName == "SCRIPT" && (start.src.includes("script/watch") || start.src.includes("AFrontend")))
	{
		observer.disconnect();

		start.addEventListener("load",function()
		{
			var oldLoadScript = window.FL.prototype.load;
			window.FL.prototype.load = function(id, containerID, version, params, style)
			{
				var container = document.getElementById(containerID);

				if(id == "SPL")
				{
					var newVideo = document.createElement("video");
					newVideo.id = id;
					newVideo.controls = true;
					newVideo.autoplay = params.autoplay;
					newVideo.style.width = style.width ? style.width + "px" : "100%";
					newVideo.style.height = style.height ? style.height + "px" : "100%";
					newVideo.style.backgroundColor = "black";
					container.appendChild(newVideo);

					if(window.__watch)
					{
						var vidData = JSON.decode(__watch.videoDetailsJSON);

						newVideo.src = vidData.fullHashPathHigh + decryptHash(vidData.fullHashPathTokenHigh);
						newVideo.poster = vidData.highResImage;
					}
					else
					{
						getVideoData(params.permalinkid).then(function(videoNode)
						{
							newVideo.src = videoNode.getAttribute("fullHashPathHigh") + decryptHash(videoNode.getAttribute("fullHashPathTokenHigh"));
							newVideo.poster = videoNode.getAttribute("highResImage");
						})
					}
				}
				else oldLoadScript.apply(this, arguments);
			}
		})
	}
}

function getVideoData(permalinkid)
{
	return new Promise(function(resolve,reject)
	{
		var config = new XMLHttpRequest();
		config.onload = function()
		{
			if(this.status == 200) resolve(this.response.querySelector("video"));
		};
		config.onerror = reject;
		config.open("GET", "http://www.veoh.com/api/findByPermalink?permalink=" + permalinkid, true);
		config.responseType = "document";
		config.send();
	});
}

function decryptHash(hash)
{
	var key = CryptoJS.enc.Hex.parse("8694dfcdd864caaac8902d7ebd04edae");
	var iv = CryptoJS.enc.Hex.parse("ff57cec30aeea89a0f50db4164a1da72");

	var data = CryptoJS.enc.Base64.parse(hash);

	var decrypted = CryptoJS.AES.decrypt(hash, key, { mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7, iv: iv  });

	return decrypted.toString(CryptoJS.enc.Utf8);
}