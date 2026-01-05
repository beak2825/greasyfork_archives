// ==UserScript==
// @name        youtube_ex
// @namespace   http://userscripts.org/users/
// @include     https://www.youtube.com/*
// @version     0.2
// @grant	none
// @description enhanced youtube
// @downloadURL https://update.greasyfork.org/scripts/16821/youtube_ex.user.js
// @updateURL https://update.greasyfork.org/scripts/16821/youtube_ex.meta.js
// ==/UserScript==

//======  common ========

function parseQueryStringToDictionary(queryString)
{
	var dictionary = {};

	var pos=queryString.indexOf('?');
	if (pos>=0)
	{
		queryString = queryString.substr(pos+1);
	}

	var parts = queryString.split('&');

	for(var i = 0; i < parts.length; i++)
	{
		var keyValuePair = parts[i].split('=');
		var key = keyValuePair[0];
		var value = keyValuePair[1];

		value = decodeURIComponent(value);
		value = value.replace(/\+/g, ' ');

		dictionary[key] = value;
	}

	return dictionary;
}


var obv_cfg={attributes: false, childList: true, characterData: false};

function observer_factory(callback, isforeach=true)
{
	var cb=isforeach ? function(mutations) {mutations.forEach(callback);} : callback;
	return new MutationObserver(cb);
}

function simpleRemoveElement(sel)
{
	var sep=sel.indexOf("##");
	var selector=sep>=0 ? sel.substr(sep+2) : sel;
	var node=document.querySelector(selector);
	if (node) node.parentNode.removeChild(node);
}

function killElementAttribute(attrname)
{
	var nodes=document.querySelectorAll('['+attrname+']');
	for (var i=0;i<nodes.length;i++)
	{
		nodes[i].removeAttribute(attrname);
	}
}

//======= end of common =========

function trackless()
{
	observer_factory(function (stub) {
		killElementAttribute("data-sessionlink");
		killElementAttribute("data-visibility-tracking");
	},false).observe(document.body, obv_cfg);
}


trackless();

function norecommend()
{
	Array.prototype.slice.call(document.querySelectorAll("span.view-count")).filter(function (node){
		return /Recommended for you/i.test(node.innerHTML);
	}).forEach(function (node){
		var pnode=node.parentNode;
		while (pnode.tagName.toLowerCase()!="a" || Array.prototype.slice.call(pnode.classList).indexOf("content-link")<0){
			if (pnode==document.body) return;
			pnode=pnode.parentNode;
		}
		var recommend_link=pnode.href;
		while (pnode.tagName.toLowerCase()!="li" || Array.prototype.slice.call(pnode.classList).indexOf("video-list-item")<0){
			if (pnode==document.body) return;
			pnode=pnode.parentNode;
		}
		pnode.parentNode.removeChild(pnode);
		var vid=parseQueryStringToDictionary(recommend_link).v;
		//Array.prototype.slice.call(document.querySelectorAll('a#ytp-suggestion-set[href*="'+vid+'"]'));
	});
}

norecommend();
