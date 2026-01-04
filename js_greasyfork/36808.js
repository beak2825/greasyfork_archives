// ==UserScript==
// @name        hinum009_tumblr.com Extra blog buttons
// @description add extra navigation buttons to the upper left corner tumblr blogs
// @icon        http://38.media.tumblr.com/avatar_fee7ff3e9d6a_48.png
// @version     0.1.5.002
// @license     GNU General Public License v3
// @copyright   2015, Nickel
// @grant       GM_addStyle
// @include     *://*.tumblr.com/*
// @exclude     *://*.tumblr.com/archive*
// @exclude     *://*.tumblr.com/image*
// @exclude     *://www.tumblr.com/*
// @namespace https://greasyfork.org/users/14505
// @downloadURL https://update.greasyfork.org/scripts/36808/hinum009_tumblrcom%20Extra%20blog%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/36808/hinum009_tumblrcom%20Extra%20blog%20buttons.meta.js
// ==/UserScript==

/* TODO
var foo = document.getElementById("tumblr_controls");
window.getComputedStyle(foo, null).width
*/


(function(){

// don't run in frames/iframes
if( frameElement ){ return; }
//if( window.self !== window.top ){ return; }

// don't run without tumblr elements
if( (! document.getElementById('tumblr_controls')) && document.getElementsByClassName('tmblr-iframe').length==0 ){ return; }

// fallback (Chrome lacks GM functions)
if( typeof GM_addStyle != 'function' ) {
	function GM_addStyle(css) {
		var head, style;
		head = document.getElementsByTagName('head')[0];
		if( !head ){ return; }
		style = document.createElement('style');
		style.type = 'text/css';
		style.innerHTML = css;
		head.appendChild(style);
	}
}

// origin
var origin = document.createElement("div");
origin.id = "userscript-extra-buttons";
document.body.appendChild(origin);

GM_addStyle("#userscript-extra-buttons {position:fixed; width:160px; height:20px; top:4px; left:5px; z-index:2147483647;}");
GM_addStyle("#userscript-extra-buttons a {display:block; float:left; margin-right:3px; width:21px; height:100%; border-radius:2px; outline:0;}");

var splitUrl=window.location.href.split("/");
var blogname = window.location.host.split(".")[0];


    // add dashblog (TODO: open in dash/blog)
    var elm = document.createElement("a");
	elm.setAttribute( "style", "background:url(http://assets.tumblr.com/images/posts/nipple.png) repeat-x #222; width:28px;" );
	elm.href = "https://www.tumblr.com/blog/" + blogname;
	elm.title = "Locate on Dashboard";
	origin.appendChild( elm );


// add dash button (TODO: check if following/own blog)
if ( splitUrl[3] == "post" ) {
	var pid = splitUrl[4];
	pid = Number(pid)+1;

	var elm = document.createElement("a");
	elm.setAttribute( "style", "background:url(http://assets.tumblr.com/images/posts/nipple.png) repeat-x #222; width:28px;" );
	elm.href = "http://www.tumblr.com/dashboard/1000/" + pid + "?lite";
	elm.title = "Locate on Dashboard";
	origin.appendChild( elm );
}

// add liked-by button	(TODO: check if main blog)
var elm = document.createElement("a");
elm.setAttribute( "style", "background:url(http://assets.tumblr.com/images/iframe_like_alpha.png) no-repeat #222;" );
elm.href = "http://www.tumblr.com/liked/by/" + blogname;
elm.title = "Liked by " + blogname;
origin.appendChild( elm );

// add archive button
var elm = document.createElement("a");
//elm.setAttribute( "style", "background:url(http://assets.tumblr.com/themes/redux/button-archive.png) no-repeat #222;" );
elm.setAttribute( "style", "background:url(http://static.tumblr.com/vr9xgox/VT4nf8tvk/button-archive.png) no-repeat #222;" );
elm.href = "http://" + blogname + ".tumblr.com/archive";
elm.title = "Blog Archive";
origin.appendChild( elm );

// add Home Button
var elm = document.createElement("a");
elm.setAttribute( "style", "background:url(http://assets.tumblr.com/images/iframe_dashboard_alpha.png) no-repeat #222;" );
elm.href = "http://" + blogname + ".tumblr.com";
elm.title = "Blog Home";
origin.appendChild( elm );

// add prev/next page buttons
var page = -1;
var lastPage = 1000;	// TODO

if( splitUrl[splitUrl.length-2] == "page" ){
	page = Number(splitUrl[splitUrl.length-1]);
}
else if( splitUrl[3] == "" || splitUrl[3] == "tagged" || splitUrl[3] == "search" ){
	page = 1;
}

if( page > 1 ){
	var elm = document.createElement("a");
	elm.setAttribute( "style", "background:url(http://assets.tumblr.com/images/dashboard_controls_arrow_left.png) 50% no-repeat #222;" );
	elm.href = window.location.href.replace( /\/$/, "" ).replace( /\/page\/[0-9]+$/, "" ) + "/page/" + (page-1);
	elm.title = "prev page";
	origin.appendChild( elm );
}

if( page > -1 && page < lastPage ){
	var elm = document.createElement("a");
	elm.setAttribute( "style", "background:url(http://assets.tumblr.com/images/dashboard_controls_arrow_right.png) 50% no-repeat #222;" );
	elm.href = window.location.href.replace( /\/$/, "" ).replace( /\/page\/[0-9]+$/, "" ) + "/page/" + (page+1);
	elm.title = "next page";
	origin.appendChild( elm );

	var elm = document.createElement("a");
	elm.setAttribute( "style", "background:url(http://assets.tumblr.com/images/dashboard_controls_arrow_first_page.png) 50% no-repeat #222; width:24px; transform:scaleX(-1);" );
	elm.href = window.location.href.replace( /\/$/, "" ).replace( /\/page\/[0-9]+$/, "" ) + "/page/" + (page+10); //TODO: lastPage
	elm.title = "jump ahead 10 pages";
	origin.appendChild( elm );
}

})();