// ==UserScript==
// @name        twitter_ex
// @description  twitter enhanced
// @namespace   http://userscripts.org/users/
// @match     https://twitter.com/*
// @match     https://www.twitter.com/*
// @version     0.4
// @grant	none
// @downloadURL https://update.greasyfork.org/scripts/17646/twitter_ex.user.js
// @updateURL https://update.greasyfork.org/scripts/17646/twitter_ex.meta.js
// ==/UserScript==


HTMLDocument.prototype.createElementHTML=function (content)
{
	var mock=this.createElement("div");
	mock.innerHTML=content;
	return mock.firstChild;
}

HTMLElement.prototype.observe=function (func)
{
	var ts=this;
	var trigger={
		timer : null,
		callback : func,
		ontrig : function(){
			var t=this;
			if (!t.timer)
			{
				t.timer=setTimeout(function(){
					clearTimeout(t.timer);
					t.timer=null;
					t.callback();
				}, 300, false);
			}
		},
	};
	var obs=new (window.MutationObserver||window.WebKitMutationObserver)(trigger.ontrig.bind(trigger));
	window.addEventListener("unload", function(event){
		obs.disconnect();
	});
	obs.observe(ts, {attributes: true, childList: true, subtree: true});
}

HTMLElement.prototype.removeSelf=function()
{
	this.parentNode.removeChild(this);
}


function new_topbar()
{
	var glbnav=document.querySelector("ul#global-actions");
	if (glbnav)
	{
		var html_fav='<li id="global-nav-fav" data-global-action="fav"> <a data-original-title="" class="js-nav js-tooltip js-dynamic-tooltip" data-placement="bottom" href="/i/likes" data-nav="favorites"> <span class="text">Favorites</span> </a> </li>';
		var html_adv_search='<li id="global-nav-advsearch" data-global-action="advsearch"> <a data-original-title="" class="js-nav js-tooltip js-dynamic-tooltip" data-placement="bottom" href="/search-advanced" data-nav="advsearch"> <span class="text">Advanced Search</span> </a> </li>';
		glbnav.appendChild(document.createElementHTML(html_fav));
		glbnav.appendChild(document.createElementHTML(html_adv_search));
	}
	var mmt=document.querySelector(".js-moments-tab");
	if (mmt) mmt.removeSelf();
}

function unshort_links()
{
	Array.prototype.forEach.call(document.querySelectorAll('a[data-expanded-url]'), function (link){
		link.href=link.getAttribute('data-expanded-url');
		link.removeAttribute("data-expanded-url");
	});
}



new_topbar();
unshort_links();
document.body.observe(unshort_links);
