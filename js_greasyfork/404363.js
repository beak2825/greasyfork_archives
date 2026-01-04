// ==UserScript==
// @name		汉化组常用漫画网站去广告
// @description	Make your experience better when finding mangas.Support Websites:Hanascan Rawdevart Comic-Walker MangaReader
// @version		1.141
// @author		Tinyblack
// @namespace	http://tampermonkey.net/
// @namespace	http://greasyfork.org/
// @include		*://hanascan.com/*
// @include		*://comic-walker.com/*
// @include		*://rawdevart.com/*
// @include		*://www.mangareader.net/*
// @require		https://code.jquery.com/jquery-3.5.1.min.js
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/404363/%E6%B1%89%E5%8C%96%E7%BB%84%E5%B8%B8%E7%94%A8%E6%BC%AB%E7%94%BB%E7%BD%91%E7%AB%99%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/404363/%E6%B1%89%E5%8C%96%E7%BB%84%E5%B8%B8%E7%94%A8%E6%BC%AB%E7%94%BB%E7%BD%91%E7%AB%99%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==
(function () {
    var web = window.location.href;
	function importjquery() {
		var ele = document.createElement("script");
		ele.setAttribute("type", "text/javascript");
		ele.setAttribute("src", "https://code.jquery.com/jquery-3.5.1.min.js");
		document.head.appendChild(ele);
	}
    importjquery();
    function resetimg(){
		$('.lazy').each(function(){
			$(this).css('width','90');
			$(this).css('height','100%');
		});
		return 0;
	}
	$(window).bind('load',function() {

	var web = window.location.href;
	if(web.match('mangareader')!==null)			//is mangareader
	{
		$('iframe').each(function(){
			console.log("Removed iframe element :"+$(this));
			$(this).remove();
		});
		$('div').each(function(){
			if($(this).attr('id') !== undefined)				//element's id is defined
			{
				if($(this).attr('id').match('admain') !== null)		//is ad div element
				{
					console.log("Removed div ad element :"+$(this));
					$(this).remove();
				}
			}
		});
		$('div').each(function(){
			if($(this).attr('class') !== undefined)
			{
				if($(this).attr('class').match('c[0,1,2,3,4,5,6,7,8,9,10,11]')!==null)
				{
					console.log("Removed div ad element :"+$(this));
					$(this).remove();
				}
			}
		});
		console.log("Removed div ad element :"+$('#adfooter'));
		$('#adfooter').remove();
		$('img').each(function(){
			if($(this).attr('src').match('c.bebi.com')!==null)
			{
				console.log("Removed img ad element :"+$(this));
				$(this).remove();
			}
		});
	}
	if(web.match('comic-walker')!==null)		//is comic-walker
		{
			console.log("Element:"+$('#right_bottom_banner')+"has removed.");
			$('#right_bottom_banner').remove();
			console.log("Element:"+$('#right_top_banner')+"has removed.");
			$('#right_top_banner').remove();
		}
	if(web.match('hanascan')!==null)			//is hanascan
		{
			$('iframe').remove();
			resetimg();
		}
	if(web.match('rawdevart')!==null)			//is rawdevart
		{
			var matchele;
			for(var eles = 1 ; eles <= 2 ; eles ++)
			{
				if(eles == 1){matchele = 'div';}
				if(eles == 2){matchele = 'iframe';}
				$(matchele).children().each(function(){
					var eleid = $(this).attr('id');
					var eleclass = $(this).attr('class');
					if( eleid !== undefined )
					{
						if( eleid.match('adtruefr')!==null )	//is ad element
						{
							console.log("Removed AD element's id:"+eleid);
							$(this).remove();
						}
					}
					if( eleclass !== undefined)
					{
						if( eleclass.match('runative-banner')!==null || eleclass.match('rn_ad_native')!==null)	//is ad element
						{
							console.log("Removed AD element's class:"+eleclass);
							$(this).remove();
						}
					}
				});
			}
		}
	}

	);
})();