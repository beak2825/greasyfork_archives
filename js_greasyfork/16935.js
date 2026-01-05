// ==UserScript==
// @author mkdante381
// @name Disable SPF Youtube
// @namespace https://greasyfork.org/users/9905
// @description Disables red bar aka SPF on youtube. This userscript is needed to work properly other userscripts on youtube site. This script must be first to be executed, example before Youtube+ or other good userscripts.
// @homepageURL https://greasyfork.org/scripts/16935
// @icon data:image/png;base64,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
// @domain      youtube.com
// @domain      www.youtube.com
// @domain      gdata.youtube.com
// @domain      apis.google.com
// @domain      plus.googleapis.com
// @domain      googleapis.com
// @domain      s.ytimg.com
// @match       *://*.youtube.com/*
// @match       *://*.googlevideo.com/*
// @match       *://s.ytimg.com/yts/jsbin/*
// @match       *://*.ytimg.com/yts/jsbin/*
// @include     http://www.youtube.com/watch*
// @include     https://www.youtube.com/watch*
// @include     *://www.youtube.com/*
// @include     *youtube.com/*
// @include     *://*googlevideo.com/*
// @include     *googlevideo.com/*
// @include     http*://*.googlevideo.com/*
// @include     http*://*---*.googlevideo.com/*
// @include     http*://*s.ytimg*
// @include     http*://*s.img*
// @include     http*://s.ytimg*
// @include     http*://s.img*
// @include     *.ytimg.com*
// @version     1.0.3.2
// @grant       unsafeWindow
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/16935/Disable%20SPF%20Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/16935/Disable%20SPF%20Youtube.meta.js
// ==/UserScript==
// Ensure unsafeWindow object is available both in firefox and chrome
//

function installUnsafewindowPolyfill()
{
	if (typeof unsafeWindow === 'undefined')
	{
		if (typeof XPCNativeWrapper === 'function' && typeof XPCNativeWrapper.unwrap === 'function')
			unsafeWindow = XPCNativeWrapper.unwrap(window);
		else if (window.wrappedJSObject)
			unsafeWindow = window.wrappedJSObject;
	}
}
// Disable SPF (Structured Page Fragments), which prevents properly attaching to page load events when navigation occurs 
// Will also disable the red loading bar.

function disableSPF()
{
	if (unsafeWindow._spf_state && unsafeWindow._spf_state.config)
	{
		unsafeWindow._spf_state.config['navigate-limit'] = 0;
		unsafeWindow._spf_state.config['navigate-part-received-callback'] = function (targetUrl) { location.href = targetUrl; }
	}
	
	setTimeout(disableSPF, 50);
}

/** TIME FOR SOME ACTION! **/

// get rid of SPF
installUnsafewindowPolyfill();
disableSPF();

