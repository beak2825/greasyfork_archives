// ==UserScript==
// @name        Clear ImageBoard
// @description This script disables the AdBlock killer, fixes the thumbnails if the thumbnails lazyloader doesn't run, and removes all adverts
// @namespace   https://greasyfork.org/users/155308
// @include     *://gelbooru.com*
// @version     1.0.1
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/34097/Clear%20ImageBoard.user.js
// @updateURL https://update.greasyfork.org/scripts/34097/Clear%20ImageBoard.meta.js
// ==/UserScript==

(function(){
	window.abvertDar = '';
	document.addEventListener('readystatechange', main, false );
	function main()
	{
		if( this.readyState === 'interactive' )
		{
			removeAds();
			fixThumbs();
		}
	}
	function removeAds()
	{
		hide( document.querySelector('#nup') );
		hide( document.querySelector('#tup') );
		hide( document.querySelector('#motd') );
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
			if( this.iter > 10 )
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
	}
})();