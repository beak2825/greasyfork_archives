// ==UserScript==
// @name        Clear ImageBoard (development version)
// @description This script disables the AdBlock killer, fixes the thumbnails if the thumbnails lazyloader doesn't run, and removes all adverts on gelbooru
// @namespace   https://greasyfork.org/users/155308
// @include     *://gelbooru.com*
// @include     *://*.sankakucomplex.com*
// @include     *://yande.re*
// @include     *://youhate.us*
// @version     1.0.4
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/373238/Clear%20ImageBoard%20%28development%20version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/373238/Clear%20ImageBoard%20%28development%20version%29.meta.js
// ==/UserScript==

(function(){
	window.abvertDar = '';
	sessionStorage.setItem('babn', (Math.random() + 1) * 1000 );
	document.addEventListener('readystatechange', main, false );
	function main()
	{
		if( this.readyState === 'interactive' )
		{
			fixThumbs();
			removeAds();
		}
	}
	function removeAds()
	{
		hide( document.querySelector('#nup') );
		hide( document.querySelector('#tup') );
		hide( document.querySelector('#toop') );
		hide( document.querySelector('[id^="motd"]') );
		hide( document.querySelector('.contain-push > .hidden-xs') );
		var timerId = setInterval( __removeAds, 500 );
		function __removeAds()
		{
			this.iter = this.iter || 0;
			++this.iter;
			var iframes = document.getElementsByTagName('iframe');
			for( var i = 0; i < iframes.length; ++i )
				remove(iframes[i]);
			var srch = window.location.search,
				paginator = document.querySelector('#paginater');
			if( !/s\=view/.test(srch) && paginator )
			{
				var elm = paginator.parentNode;
				[].forEach.call(elm.children, function(child){
					if( child.id != 'paginater' && child.className )
						hide(child);
				});
			}
			if( this.iter > 1000 )
				clearInterval( timerId );
		}
	}
	function remove(elm)
	{
		if( elm && elm.parentNode )
			return elm.parentNode.removeChild(elm);
	}
	function hide( elm )
	{
		if( elm )
			elm.style.display = 'none';
	}
	function fixThumbs()
	{
		var thumbs = document.querySelectorAll('img.lazyload[data-original]');
		for( var i = 0, len = thumbs.length, thumb; i < len; ++i )
		{
			thumb = thumbs[i];
			thumb.classList.remove('lazyload');
			thumb.src = thumb.dataset.original;
			thumb.parentNode.parentNode.removeAttribute('class');
		}
		var imgs = document.querySelectorAll('img.preview');
		for( i = 0, len = imgs.length; i < len; ++i )
			imgs[i].parentNode.parentNode.parentNode.classList.remove('javascript-hide');
	}
})();