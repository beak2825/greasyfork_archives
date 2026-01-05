// ==UserScript==
// @name          Wayback Machine Small Bug Fixes
// @namespace     DoomTay
// @description   Fixes encoded ampersands on Wayback Machine's captures graph and problems that arise when trailing slashes are missing in an URL and other small issues universally present in all crawled sites
// @version       1.4.0
// @include       http://web.archive.org/web/*
// @include       http://wayback.archive.org/web/*
// @include       https://web.archive.org/web/*
// @include       https://wayback.archive.org/web/*
// @run-at        document-start
// @exclude       /\*/
// @grant         none

// @downloadURL https://update.greasyfork.org/scripts/15718/Wayback%20Machine%20Small%20Bug%20Fixes.user.js
// @updateURL https://update.greasyfork.org/scripts/15718/Wayback%20Machine%20Small%20Bug%20Fixes.meta.js
// ==/UserScript==

var lastFolder = window.location.href.substring(window.location.href.lastIndexOf("/") + 1);
var pics = document.images;
var backgrounds = document.querySelectorAll("[background]");
var shouldHaveTrailingSlash = (window.location.href.lastIndexOf(".") < window.location.href.lastIndexOf("/") || window.location.href.substring(window.location.href.lastIndexOf("//") + 2) == lastFolder) && !lastFolder.includes("?");
var hasTrailingSlash = window.location.href.endsWith("/");
var domain = window.location.href.substring(0,window.location.href.indexOf("/",window.location.href.lastIndexOf("//") + 2));
var isInDomain = window.location.href == domain || window.location.href == domain + "/";
var timestamp = /web\/(\d{1,14})/.exec(window.location.href)[1];

if(!document.getElementsByTagName("base")[0])
{
	var base = document.createElement("base");
	if(shouldHaveTrailingSlash && !hasTrailingSlash) base.href = window.location.href + "/";
	else if((!hasTrailingSlash && !shouldHaveTrailingSlash) || hasTrailingSlash) base.href = document.baseURI;
	else base.href = domain + "/";
	document.head.appendChild(base);
}

function relativeToAbsolute(URL)
{
	var link = document.createElement("a");
    link.href = URL;
	return link.href;
}

function fixURL(URL)
{
	var fixedURL = URL;
	if(URL.includes("//archive.org")) return URL;
	if(URL.includes("archive.org")) fixedURL = URL.substring(URL.indexOf(document.domain) + document.domain.length);
	else if(URL.startsWith("//") && !URL.startsWith("/web/")) fixedURL = "/web/" + timestamp + "/" + document.location.protocol + URL;
	else if(URL.startsWith("/") && !URL.startsWith("/web/")) fixedURL = domain + URL;
	else if(URL.startsWith("../") && isInDomain) fixedURL = URL.substring(3);
	else if(URL.startsWith("/save/_embed/") && isInDomain) fixedURL = URL.replace("/save/_embed/","/web/" + timestamp + "/");
	else if(!URL.includes("//archive.org")) fixedURL = domain.substring(0,domain.indexOf("/http") + 1) + URL.substring(URL.indexOf("/http") + 1);
	return fixedURL;
}

function fixImage(pic)
{
	var oldSrc = pic.getAttribute("src");
	if(!oldSrc) return;
	pic.setAttribute("src",fixURL(oldSrc));
}

function fixBackground(node)
{
	if(node.background) node.background = fixURL(node.background);
	else if(node.getAttribute("background")) node.setAttribute("background",fixURL(node.getAttribute("background")));
}

var observer = new MutationObserver(function(mutations) {
	mutations.forEach(function(mutation) {
		checkMutations(mutation.target);
		for(var i = 0; i < mutation.addedNodes.length; i++) 
		{
			if(mutation.addedNodes[i].nodeName == "BASE" && mutation.addedNodes[i] != base && document.title != "Internet Archive Wayback Machine")
			{
				if(base) document.head.removeChild(base);
				Array.prototype.forEach.call(pics, function(pic) {
					pic.src = pic.src;
				});
				Array.prototype.forEach.call(backgrounds, function(background) {
					background.setAttribute("background",background.getAttribute("background"));
				});
			}
			else if(mutation.addedNodes[i].nodeName == "SCRIPT" && mutation.addedNodes[i].innerHTML.includes("__wm.bt()"))
			{
				//As far as we're concerned, it's guaranteed that the script we're trying to find here is immediately two nodes before this one, but I'm not sure how else to go about finding it 
				var toolbarScript = Array.prototype.find.call(document.scripts,node => node.innerHTML.includes("wbCurrentUrl") && node.innerHTML.includes("&amp;"));
				if(toolbarScript)
				{
					var replacement = document.createElement("script");
					replacement.type = toolbarScript.type;
					var currentURL = toolbarScript.innerHTML.match(/wbCurrentUrl = "(.+)";/)[1];
					replacement.innerHTML = toolbarScript.innerHTML.replace(currentURL,decodeHTML(currentURL));
					toolbarScript.parentNode.replaceChild(replacement,toolbarScript);
				}
			}
			else
			{
				checkMutations(mutation.addedNodes[i]);
				if(mutation.addedNodes[i].nodeType == 1)
				{
					var children = mutation.addedNodes[i].getElementsByTagName("*");
					for(var c = 0; c < children.length; c++)
					{
						checkMutations(children[c]);
					}
				}
			}
		}
	});
});

function decodeHTML(text) {
    var textarea = document.createElement("textarea");
    textarea.innerHTML = text;
    return textarea.value;
}

function checkMutations(node)
{
	if(document.getElementById("wm-ipp") && document.getElementById("wm-ipp").contains(node)) return;
	if(node.nodeType == 1)
	{
		if(node.nodeName == "IMG" && ((!node.src.includes("/web/") && !node.src.includes("data:")) || node.getAttribute("src").startsWith("../")))
		{
			observer.disconnect();
			fixImage(node);
			observer.observe(document, config);
		}
		var bg = node.background || node.getAttribute("background");
		if(bg && !relativeToAbsolute(bg).includes(document.domain + "/web"))
		{
			observer.disconnect();
			fixBackground(node);
			observer.observe(document, config);
		}
		if((node.nodeName == "A" || node.nodeName == "AREA") && node.href && node.textContent != "Save this url in the Wayback Machine")
		{
			if(node.href.includes("/http://web.archive.org/web/")) node.href = node.href.substring(node.href.indexOf("/http://web.archive.org/web/") + 1);
		}
		for(var i = 0; i < node.attributes.length; i++)
		{
			if((node.attributes[i].value.startsWith("http") || node.attributes[i].value.startsWith("/")) && !relativeToAbsolute(node.attributes[i].value).includes("archive.org") && node.nodeName != "INPUT")
			{
				observer.disconnect();
				node.setAttribute(node.attributes[i].name,"/web/" + timestamp + "/" + node.attributes[i].value);
				observer.observe(document, config);
			}
			else if(node.attributes[i].value.startsWith("//") && !relativeToAbsolute(node.attributes[i].value).includes("archive.org") && node.nodeName != "INPUT")
			{
				console.log("Issue:",node,node.attributes[i]);
				observer.disconnect();
				node.setAttribute(node.attributes[i].name,"/web/" + timestamp + "/" + window.location.protocol + node.attributes[i].value);
				observer.observe(document, config);
			}
			else if(node.attributes[i].value.startsWith("/") && !node.attributes[i].value.startsWith("/static/") && !node.attributes[i].value.startsWith("/web/"))
			{
				observer.disconnect();
				node.setAttribute(node.attributes[i].name,fixURL(node.attributes[i].value));
				observer.observe(document, config);
			}
		}
	}
}

var config = { attributes: true, childList: true, subtree: true };
observer.observe(document, config);