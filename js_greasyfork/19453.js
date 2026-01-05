// ==UserScript==
// @name          OoCites Missing Resource Fixer
// @namespace     DoomTay
// @description   Attempts to fix missing resources on OoCities by drawing from Wayback Machine
// @include       http://www.oocities.org/*
// @exclude       http://www.oocities.org/js_source/header.html
// @exclude       http://www.oocities.org/js_source/side.html
// @exclude       http://www.oocities.org/js_source/side2.html
// @exclude       http://www.oocities.org/js_source/side3.html
// @version       1.2.0
// @grant         GM_xmlhttpRequest
// @run-at        document-start

// @downloadURL https://update.greasyfork.org/scripts/19453/OoCites%20Missing%20Resource%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/19453/OoCites%20Missing%20Resource%20Fixer.meta.js
// ==/UserScript==

var pics = document.images;
var timestamp = "20091026194848";
var lastModifiedRegex = /(?:last (?:updated|modified)(?: on |: ?)|since )([^\n]+)\n?/i;
var scannedImages = [];
var substitutionTable = {};

function zeroPad(str,len) {
	return "0".repeat(len - str.toString().length) + str.toString();
}

function dateToTimestamp(date) {
	return date.getUTCFullYear() +
		zeroPad(date.getUTCMonth()+1,2) +
		zeroPad(date.getUTCDate()+1,2) +
		zeroPad(date.getUTCHours(),2) +
		zeroPad(date.getUTCMinutes(),2) +
		zeroPad(date.getUTCSeconds(),2);
}

document.addEventListener('DOMContentLoaded', function() {
	
	if(document.contentType == "text/plain")
	{
		var decodedCode = decodeHTML(document.body.innerHTML).replace(/geocities/g,"oocities");
		if(decodedCode.includes("<html>") && decodedCode.includes("</html>")) decodedCode = decodedCode.substring(decodedCode.indexOf("<html>") + 6,decodedCode.indexOf("</html>"));
		if(decodedCode.includes("<head>") && decodedCode.includes("</head>"))
		{
			document.head.innerHTML = decodedCode.substring(decodedCode.toLowerCase().indexOf("<head>") + 6,decodedCode.toLowerCase().indexOf("</head>"));
			document.body.outerHTML = decodedCode.substring(decodedCode.toLowerCase().indexOf("</head>") + 7);
		}
		else document.documentElement.innerHTML = decodedCode;
	}
	if(document.title.includes("<body>"))
	{
		var decodedCode = decodeHTML(document.body.innerHTML).replace(/geocities/g,"oocities");
		if(decodedCode.includes("<title>") && decodedCode.includes("</title>"))
		{
			decodedCode = decodedCode.replace("</title>","");
			decodedCode = decodedCode.replace("<title>","<title></title>");
		}
		document.documentElement.innerHTML = decodedCode;
		
		Array.prototype.forEach.call(document.scripts,function(script){
			var newScript = document.createElement("script");
			newScript.type = "text/javascript";
			if(script.innerHTML)
			{
				newScript.innerHTML = script.innerHTML;
				script.parentNode.replaceChild(newScript,script);
			}
			else if(script.src)
			{
				newScript.src = script.src;
				script.parentNode.replaceChild(newScript,script);
			}
		});
	}

	var scriptsToRemove = document.querySelectorAll("script[src*='div03.js'],link[href*='div.css']");

	for(var s = scriptsToRemove.length - 1; s >= 0; s--)
	{
		scriptsToRemove[s].parentNode.removeChild(scriptsToRemove[s]);
	}

	if(!window.eval("top").document.title) window.eval("top").document.title = document.title;
	
	if(lastModifiedRegex.test(document.body.textContent))
	{
		var modifiedDate = document.body.textContent.match(lastModifiedRegex)[1];
		if(modifiedDate.endsWith(".")) modifiedDate = modifiedDate.substring(0, modifiedDate.length - 1);
		if(!isNaN(Date.parse(modifiedDate)))
		{
			timestamp = dateToTimestamp(new Date(modifiedDate));
			scanResources();
		}
	}

	if(timestamp == "20091026194848")
	{
		getTimestamp(window.location.href.includes("?") ? window.location.href.substring(0,window.location.href.indexOf("?")) : window.location.href).then(function(timestamp)
		{
			if(document.body.background && timestamp == "20091026194848") return getTimestamp(document.body.background);
			else return timestamp;
		}).then(function(timestamp)
		{
			if(pics[0] && timestamp == "20091026194848") return getTimestamp(pics[0].src);
			else return timestamp;
		}).then(function(timestamp)
		{
			if(pics[1] && timestamp == "20091026194848") return getTimestamp(pics[1].src);
			else return timestamp;
		}).then(function(finalTimestamp)
		{
			timestamp = finalTimestamp;
			scanResources();
		});
	}
});

function scanResources()
{
	var embeds = document.embeds;
	
	for(var i = 0; i < pics.length; i++)
	{
		if(!pics[i].src.startsWith("file://"))
		{
			if(pics[i].complete && pics[i].naturalWidth == 0) attemptReplacement(pics[i]);
			pics[i].addEventListener("error", function(e) { attemptReplacement(e.target); }, true);
		}
	}
	
	for(var j = 0; j < embeds.length; j++)
	{
		attemptReplacement(embeds[j]);
	}
		
	if(document.body.background)
	{
		GM_xmlhttpRequest({
			url: document.body.background,
			method: "HEAD",
			onload: function(response) {
				if(response.status == 404)
				{
					testResource(this.url).then(function(response) {
						document.body.background = response.finalUrl;
					},function(error) { });
				}
			}
		});
	}
}

function decodeHTML(text) {
    var textarea = document.createElement("textarea");
    textarea.innerHTML = text;
    return textarea.value;
}

function testResource(url)
{
	var promise = new Promise(function(resolve,reject) {
		GM_xmlhttpRequest({
			url: "http://web.archive.org/web/" + timestamp + "/" + url.replace(/oocities\.(org|com)/,"geocities.com"),
			method: "HEAD",
			onload: function(response) {
				if(response.status == 200) resolve(response);
				else reject(response.status + " " + response.statusText);
			}
		});
	});
	return promise;
}

function getTimestamp(url)
{
	var promise = new Promise(function(resolve,reject) {
		testResource(url).then(function(response) {
			var timestamp = "20091026194848";
			if(response.responseHeaders.includes("X-Archive-Orig-last-modified"))
			{
				var headers = response.responseHeaders;
				var lastModified = new Date(headers.substring(headers.indexOf("X-Archive-Orig-last-modified: ") + 30,headers.indexOf("\n",headers.indexOf("X-Archive-Orig-last-modified: "))));
				timestamp = dateToTimestamp(lastModified);
			}
			resolve(timestamp);
		}, function(e) { resolve("20091026194848"); });
	});
	return promise;
}

function attemptReplacement(pic)
{
	if(!scannedImages.includes(pic.src))
	{
		scannedImages.push(pic.src);
		
		getSubstitute().then(substitute =>
		{
			var matchingPics = Array.prototype.filter.call(pics,otherPic => otherPic.src == pic.src);
			for(var p = 0; p < matchingPics.length; p++)
			{
				matchingPics[p].src = substitute;
			}
		})
		
		function getSubstitute()
		{
			var promise = new Promise(function(resolve) {
				GM_xmlhttpRequest({
					url: pic.src,
					method: "GET",
					onload: function(response) {
						if(response.status == 404)
						{
							var originalSrc = this.url;
							APITest(originalSrc.replace(/oocities\.(org|com)/,"geocities.com")).then(function(result){
								if(result !== null)
								{
									//Adding the image with the original source so the mutation observer can swap it in manually next time. This is mainly for mouseover events and the like so that we won't be making XHR calls every time the user mouses over the element
									substitutionTable[originalSrc] = result;
									resolve(result);
								}
							});
						}
						else if(response.responseText.includes("The document has moved"))
						{
							testResource(new DOMParser().parseFromString(response.responseText, "text/html").links[0].href).then(function(response) {
								resolve(response.finalUrl);
							});
						}
					}
				});
			});
			return promise;
		}
	}
	
	function APITest(url)
	{
		return new Promise(function(resolve)
		{
			GM_xmlhttpRequest({
				url: "http://archive.org/wayback/available?url=" + encodeURI(url) + "&timestamp=" + timestamp,
				method: "GET",
				headers: {"Accept": "application/json"},
				responseType: "json",
				onload: function(response) {
					if(response.status == 503) resolve(APITest(url));
					else if(response.response.archived_snapshots.closest !== undefined)
					{
						resolve(response.response.archived_snapshots.closest.url);
					}
					else resolve(null);
				}
			});
		}).catch(function(e) { console.log(e); });
	}
}

var observer = new MutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {
		if(mutation.type == "attributes" && mutation.attributeName == "src" && substitutionTable.hasOwnProperty(mutation.target.src))
		{
			observer.disconnect();
			mutation.target.src = substitutionTable[mutation.target.src];
			observer.observe(document, config);
		}
		else if(mutation.removedNodes.length > 0)
		{
			var nodeContainingTitle = Array.prototype.find.call(mutation.removedNodes,node => node.nodeType == 1 && node.getElementsByTagName("title")[0]);
			if(nodeContainingTitle)
			{
				var lostTitle = nodeContainingTitle.getElementsByTagName("title")[0].textContent;
				observer.disconnect();
				document.title = lostTitle;
				if(!window.eval("top").document.title) window.eval("top").document.title = document.title;
				observer.observe(document, config);
			}
		}
	});
});

var config = { attributes: true, subtree: true, childList: true };
observer.observe(document, config);