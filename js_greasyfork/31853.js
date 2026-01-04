// ==UserScript==
// @name        Sibnet remove Adverts
// @description Убирает рекламу с шапки сайта
// @namespace   https://greasyfork.org/ru/users/136230-iron-man
// @include     *://*.sibnet.ru/*
// @include     *://sibnet.ru/*
// @version     1.0
// @author      Iron_man
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/31853/Sibnet%20remove%20Adverts.user.js
// @updateURL https://update.greasyfork.org/scripts/31853/Sibnet%20remove%20Adverts.meta.js
// ==/UserScript==

function getAdsContainer()
{
	var elms = document.querySelectorAll('div'), parent = null;
	for( var i = 0, item; i < elms.length; ++i )
	{
		item = elms[i];
		if( item.id && item.id.search(/\d+_div/) != -1 )
			return item.parentNode;
	}
	return null;
}
function adsInBlock( ads_container )
{
	return [].every.call( ads_container.children, function(item){
		return (item.tagName === 'DIV' && item.id && item.id.search(/\d+_div/) != -1);
	});
}
function hideAds()
{
	var ads_container = getAdsContainer();
	if( !ads_container )
	{
		console.error("[hideAds] can't find adverts");
		return;
	}
	if( adsInBlock( ads_container ) )
	{
		console.log('Ads in separate block => remove block');
		ads_container.parentNode.removeChild( ads_container );
		return;
	}
	console.log('Ads embeded to main page => hide them all');
	[].forEach.call( ads_container.children, function(item){
		if( item.id && item.id.search(/\d+_div/) != -1 )
		{
			console.log('ads.id: ' + item.id );
			item.setAttribute('style', 'display:none;');
		}
	});
}
document.addEventListener('DOMContentLoaded', function(event){
	try{
		hideAds();
		setTimeout( hideAds, 1000 );
	}catch(error){
		console.error("[DOMContentLoaded] ", error);
	}
}, false);