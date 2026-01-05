// ==UserScript==
// @name        instagram_ex
// @description  enable save instagram images
// @namespace   http://userscripts.org/users/
// @match     https://www.instagram.com/*
// @version     0.2
// @grant	none
// @downloadURL https://update.greasyfork.org/scripts/18356/instagram_ex.user.js
// @updateURL https://update.greasyfork.org/scripts/18356/instagram_ex.meta.js
// ==/UserScript==

var instagram_mode={
	get isPicture () {
		return /https:\/\/www.instagram.com\/p\//i.test(location.href);
	},
	get isProfile () {
		return /https:\/\/www.instagram.com\/[^\/]+\/[^\/]*$/i.test(location.href);
	},
	get isHomePage () {
		return 'https://www.instagram.com/'==location.href;
	},
};

if (instagram_mode.isPicture)
{
	var pid = _sharedData.entry_data.PostPage[0].media.id;
	var profile_url = document.querySelector('header a.notranslate').href;
	var position_node = document.querySelector('section > a > time').parentNode;
	var node = document.createElement('a');
	node.href = profile_url;
	node.search = '?max_id=' + pid;

	node.className = position_node.className;
	node.text = 'GoAsTop';

	position_node.parentNode.insertBefore(node, position_node);
}

HTMLElement.prototype.observe=function (func)
{
	var ts=this;
	var obs_config={attributes: true, childList: true, subtree: true};
	var observer=null;
	var masked=function (){obs.disconnect();func();obs.observe(ts,obs_config);};
	obs=new (window.MutationObserver||window.WebKitMutationObserver)(masked);
	ts.addEventListener("unload", function(event){
		obs.disconnect();
	});
	obs.observe(ts, obs_config);
}

HTMLElement.prototype.killElementAttribute=function (selector, attrname)
{
	Array.prototype.forEach.call(this.querySelectorAll(selector), function(node){
		if (node.hasAttribute(attrname)) node.removeAttribute(attrname);
	});
}

HTMLElement.prototype.removeSelf=function()
{
	this.parentNode.removeChild(this);
}

document.onreadystatechange = function () {
	if (document.readyState == "complete") {
		clean_insta();
		if (document.body) document.body.observe(clean_insta);
	}
}

function clean_insta()
{
	var pimg=document.querySelectorAll('img[id^="pImage_"][src^="http"]');
	Array.prototype.forEach.call(pimg, function(node){
		var loader_id=node.id.replace("pImage_", "pImageLoader_");
		if (document.getElementById(loader_id)) return;
		node.killElementAttribute("*", "data-reactid");
		node.style="";
		var pnode=node.parentNode;
		while (pnode.nextElementSibling)
		{
			pnode.nextElementSibling.removeSelf();
		}
	});
}