// ==UserScript==
// @name Popup YouTube Player
// @description Popup play YouTube video
// @author Mio
// @version 0.0.0.3
// @date 2016-03-12
// @namespace http://
// @include http://www.youtube.com/*
// @include https://www.youtube.com/*
// @exclude http://www.youtube.com/embed/*
// @exclude https://www.youtube.com/embed/*
// @match http://www.youtube.com/*
// @match https://www.youtube.com/*
// @match http://s.ytimg.com/yts/jsbin/html5player*
// @match https://s.ytimg.com/yts/jsbin/html5player*
// @match http://manifest.googlevideo.com/*
// @match https://manifest.googlevideo.com/*
// @match http://*.googlevideo.com/videoplayback*
// @match https://*.googlevideo.com/videoplayback*
// @match http://*.youtube.com/videoplayback*
// @match https://*.youtube.com/videoplayback*
// @connect-src googlevideo.com
// @connect-src ytimg.com
// @run-at document-end
// @license MIT License
// @downloadURL https://update.greasyfork.org/scripts/17918/Popup%20YouTube%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/17918/Popup%20YouTube%20Player.meta.js
// ==/UserScript==

(function()
{
	start();

	function start()
	{
		var player = document.getElementById("watch7-content");
		if( player )
		{
			var item = player.querySelector('[itemprop=embedURL]');
			var link = item.getAttribute("href");
			item = player.querySelector('[itemprop=width]');
			var width = item.getAttribute("content");
			item = player.querySelector('[itemprop=height]');
			var height = item.getAttribute("content");

//			window.open(link, "YouTube", 'width=800,height=450');
			WinOpen( link, "detail", width, height);
		}
	}
	
    function WinOpen(wurl, wtarget, wwidth, wheight)
    {
        var szResult;
        if(window.navigator.userAgent.indexOf("SV1") != -1)
            szResult = "SV1";
        else if(window.navigator.userAgent.indexOf("MSIE 7.0") != -1)
            szResult =  "IE7";
        else
            szResult = "";

        try
        {
            if(szResult == "SV1")
                add_sp = 15;
            else if(szResult == "IE7")
                add_sp = 15;
            else
                add_sp = 0;
        }
        catch(e)
        {
            Trace("SelfResize2() error:"+e.description);
        }

        wheight		= parseInt(wheight) + add_sp;
        var nleft	= (screen.availWidth / 2) - (wwidth / 2);
        var ntop	= (screen.availHeight / 2) - (wheight / 2);

        window.open(wurl, wtarget, "toolbar=no,menubar=no,location=no,directories=no,scrollbars=no,status=no, width="+ wwidth +", height="+ wheight +",left="+nleft+",top="+ntop);
    }
})();