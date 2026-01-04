// ==UserScript==
// @name        Chrome Extension Downloader
// @namespace   https://greasyfork.org/users/174399-firestein
// @description downloader for chrome extensions
// @include     https://chrome.google.com/webstore/*
// @version     1.0.0-beta.4.0
// @connect     google.com
// @connect     googleusercontent.com
// @grant       GM_xmlhttpRequest
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/368260/Chrome%20Extension%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/368260/Chrome%20Extension%20Downloader.meta.js
// ==/UserScript==

var DEBUG = false,
	log = console.log,
	clog = DEBUG ? log : function(){},
	extension = {};
window.MutationObserver = window.MutationObserver || window.WebkitMutationObserver;
(function(){
	window.addEventListener("message", messageHandler);
	DOMReady(function(){
		checkExtensionName();
	});
})();
function messageHandler(ev)
{
	log("message: ", JSON.stringify({origin: ev.origin, data: ev.data}, null, 2) );
	if( ev.origin !== location.origin )
		return;
	var source = ev.source;
	log("source: ", source);
	log("source.GM_xmlhttpRequest: ", source.GM_xmlhttpRequest);
	var ext = getExtensionInstByID(ev.data.id);
	if( isComplete(ext) )
		return;
	else if( hasResource(ext) && hasName(ext) )
	{
		isComplete(ext, true);
		downloadFile(ext.resource, ext.name + " " + ext.fileName );
		setTimeout(function(){
			URL.revokeObjectURL(ext.resource);
			ext.resource = null;
		}, 3e5);
	}
	else if( hasURL(ext) )
	{
		isComplete(ext, true);
		downloadFile( ext.url, ext.name + " " + ext.fileName );
	}
	setTimeout(function(){
		isComplete(ext, false);
		if( isStarted(ext) )
			isStarted(ext, false);
	}, 5e3);
}
function getExtensionName(doc)
{
	var elm = query("h1.e-f-w", doc);
	return elm ? elm.innerHTML : null;
}
function getExtensionRating(doc)
{
	return getMeta( query('span[itemprop="aggregateRating"]', doc) );
}
function getExtensionVersion(doc)
{
	return getMeta( query("div.e-f > span", doc) );
}
function checkExtensionName(doc)
{
	doc = doc || document;
	var divClasses = ["F-ia-k", "S-ph", "S-pb-qa"],
		location = doc.location || window.location;
	var obs = new MutationObserver(function(mutations, observer){
		for(var m of mutations)
		{
			for(var node of m.addedNodes)
			{
				if( node.nodeType == 1 && divClasses.some(cl => node.classList.contains(cl)) )
				{
					var extClasses = ["sf-f", "f-rd"];
					var obs2 = new MutationObserver(function(ms){
						var name, version, rating;
						for(var m of ms)
						{
							for(var n of m.addedNodes)
							{
								if( n.nodeType == 1 && extClasses.some(cl => n.classList.contains(cl)) )
								{
									if( !(version = getExtensionVersion(n)) && !(name = getExtensionName(n)) )
										continue;
									var ext = getExtensionInstByURL(location.href);
									if( version )
										ext = extend(ext, version);
									else if( name )
										ext = extend(ext, {name: name});
									hasName(ext, true);
									log("extension-(info|name): ", (version || name) );
									rating = getExtensionRating(n);
									if( rating )
									{
										ext = extend(ext, rating);
										log("extension-rating: ", rating);
									}
									downloadExtension(location.href, doc);
								}
							}
						}
					});
					obs2.observe(node, {
						childList: true,
						subtree: true,
					});
					observer.disconnect();
				}
			}
		}
	});
	obs.observe(doc.body, {
		childList: true,
		subtree: true,
	});
	return null;
}
function downloadExtension(webstoreURL, doc)
{
	var id = getExtensionID(webstoreURL);
	log("extension-id  : ", id);
	var ext = getExtensionInstByID(id);
	ext = extend(ext, {
		id: id,
		webstoreURL: webstoreURL,
	});
	// status (bits):
	// 0 - is started downloading
	// 1 - is downloading complete
	// 2 - has resource
	// 3 - has name
	log("status: ", showBits(ext.status));
	if( isStarted(ext) || isComplete(ext) || hasResource(ext) )
	{
		window.postMessage(ext, "*");
		return Promise.resolve();
	}
	isStarted(ext, true);
	log("start loading: ", showBits(ext.status));
	log("status: ", showBits(ext.status));
	return getExtensionURL(webstoreURL).then(function(url){
		var id = getExtensionID(webstoreURL),
			ext = extension[id];
		ext.url = url;
		hasURL(ext, true);
		ext.urlTimer = setTimeout(function(){
			window.postMessage(ext, "*");
			ext.urlTimer = null;
		}, 1e4);
		return getFileSize(ext.url).then(function(bytes){
			if( ext.urlTimer )
			{
				clearTimeout(ext.urlTimer);
				ext.urlTimer = null;
			}
			ext.size = bytes;
			ext.MiB = bytes / (1024 * 1024);
			return ext;
		});
	}).then(function(ex){
		var ext = extension[ex.id];
		ext.urlTimer = setTimeout(function(){
			window.postMessage(ext, "*");
			ext.urlTimer = null;
		}, 1e4);
		if( ext.MiB && ext.MiB > 5 )
		{
			window.postMessage(ext, "*");
			return;
		}
		return xmlHttpRequest({
			url: ext.url,
			responseType: "blob",
		}).then(function(t){
			if( ext.urlTimer )
			{
				clearTimeout(ext.urlTimer);
				ext.urlTimer = null;
			}
			ext.resource = getURL(t.response);
			hasResource(ext, true);
			window.postMessage(ext, "*");
		}).catch(function(e){
			window.postMessage(ext, "*");
		});
	}).catch(function(e){
		console.error(e);
	});
}
function getFileSize( url )
{
	return xmlHttpRequest({
		url: url,
		method: "HEAD",
	}).then(function(t){
		var respHeads = getObject(t.responseHeaders, /\r?\n/, ":");
		log("responseHeaders: ", respHeads);
		var len = respHeads["Content-Length"];
		if( len )
		{
			log("length: ", len/(1024 * 1024));
			return len;
		}else{
			log("length not found");
			return 0;
		}
	});
}

function getExtensionBlob(webstoreURL)
{
	return getExtensionURL(webstoreURL).then(function(url){
		log("getting extensionBlob ..");
		return xmlHttpRequest({
			url: url,
			responseType: "blob",
		}).then(function(t){
			return t.response;
		});
	});
}
function getExtensionURL(webstoreURL)
{
	var id = getExtensionID(webstoreURL),
		url = "https://clients2.google.com/service/update2/crx" + getExtensionSearch(id);
	log("getting extensionURL ..");
	return xmlHttpRequest({
		url: url,
		method: "GET",
	}).then(function(t){
		var source = t.finalUrl;
		log("extension-url : ", source);
		extension[id] = extend(extension[id], {
			id: id,
			url: source,
			webstoreURL: webstoreURL,
			fileName: getExtensionFilename(source),
		});
		return source;
	}).catch(function(e){
		console.error(e);
	});
}
function getExtensionSearch(id)
{
	var obj = {
		response: "redirect",
		prodversion: "49.0",
		x: encodeURIComponent("id=" + id + "&installsource=ondemand&uc"),
	};
	return "?" + getSearchStr(obj);
}
function getExtensionFilename(extensionURL)
{
	return getLink(extensionURL, "pathname").match(/[^\/]+$/)[0];
}
function getExtensionID(webstoreURL)
{
	return getLink((webstoreURL || location.href), "pathname").match(/[^/]+$/)[0];
}
function getExtensionInstByID(id)
{
	// always returns an object
	var ext = extension[id] = extension[id] || {};
	ext.status = ext.status || 0;
	return ext;
}
function getExtensionInstByURL(webstoreURL)
{
	// always returns an object
	return getExtensionInstByID( getExtensionID(webstoreURL) );
}
function getLink(url, prop)
{
	if( !url )
		return null;
	window.link = window.link || document.createElement("a");
	link.href = url;
	return link[prop||"href"];
}
function getSearchStr(obj)
{
	var s = "";
	for(var k in obj)
		s += k + "=" + obj[k] + "&";
	return s.slice(0, -1);
}
function getObject( str, propDelim, keyDelim )
{
	if( !str )
		return {};
	propDelim = propDelim || "&";
	keyDelim = keyDelim	|| "=";
	var arr = str.split(propDelim), obj = {};
	for(var elm of arr)
	{
		elm = elm.split(keyDelim);
		obj[elm[0].trim()] = elm[1] ? elm[1].trim() : null;
	}
	return obj;
}
function getMeta( elm, itemprop, content )
{
	if( !elm )
		return null;
	itemprop = itemprop || "itemprop";
	content = content || "content";
	var meta = queryAll("meta", elm), obj;
	if( !meta.length )
		return null;
	obj = {};
	for( m of meta )
		obj[m.getAttribute(itemprop)] = m.getAttribute(content);
	return obj;
}
function xmlHttpRequest(details)
{
	details.method = details.method || "GET";
	return new Promise(function(resolve, reject){
		clog("request: ", JSON.stringify(details, null, 2));
		details.onreadystatechange = function(t){
			if(t.status == 200 && t.readyState == 4)
			{
				clog("response: ", JSON.stringify(t, null, 2));
				resolve(t);
			}
		};
		details.onerror = function(t){
			var e = {};
			e.error = "network error";
			e.status = t.status;
			e.statusText = t.statusText;
			reject(e);
		};
		GM_xmlhttpRequest(details);
	});
}
function getURL(blob)
{
	window.URL = window.URL || window.webkitURL;
	return URL.createObjectURL(blob);
}
function downloadFile(source, name)
{
	var link = document.createElement("a");
	link.href = source;
	link.download = name || "";
	link.target = "_blank";
	link.innerHTML = "<b>CLICK HERE</b>";
	document.body.appendChild(link);
	log("link: ", source);
	log("name: ", name);
	link.click();
	link.parentNode.removeChild(link);
}
function DOMReady(callback, doc)
{
	doc = doc || document;
	var exec = null;
	switch(doc.readyState)
	{
		case "loading":
		exec = function(){
			callback.call(this);
			this.removeEventListener("DOMContentLoaded", exec);
		};
		doc.addEventListener("DOMContentLoaded", exec);
		break;
		case "interactive":
		case "complete":
		callback.call(doc);
		break;
	};
}
function extend(t, o)
{
	t = t || {};
	for(var k in o)
	{
		if( o.hasOwnProperty(k) )
			t[k] = o[k];
	}
	return t;
}
function isStarted  (ext, val){return extensionStatusBit(ext, 0, val); }
function isComplete (ext, val){return extensionStatusBit(ext, 1, val); }
function hasResource(ext, val){return extensionStatusBit(ext, 2, val); }
function hasName    (ext, val){return extensionStatusBit(ext, 3, val); }
function hasURL     (ext, val){return extensionStatusBit(ext, 4, val); }
function extensionStatusBit(ext, offset, val)
{
	if( val === undefined )
		return getBit(ext.status, offset);
	ext.status = setBit(ext.status, offset, val);
	return ext.status;
}
function setBit(num, offset, val)
{
	num = num || 0;
	val = val ? 1 : 0;
	if( val )
		return num | (val << offset);
	else
		return num & (~(1 << offset));
}
function getBit(num, offset)
{
	return (num & (1 << offset)) >> offset;
}
function showBits(num, max)
{
	max = max || 5;
	var s = "";
	for(var i = 0, mask = 1; i < max; ++i, mask <<= 1)
		s += (num & mask ? 1 : 0);
	return s;
}
function query(selector, context){return (context || document).querySelector(selector);}
function queryAll(selector, context){return (context || document).querySelectorAll(selector);}