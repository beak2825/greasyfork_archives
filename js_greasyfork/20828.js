// ==UserScript==
// @name          Facebook Double Beta
// @author        Niqueish
// @description   Adds doubles to Facebook
// @homepage      https://www.facebook.com/Niqueish
// @version       1.0
// @include       *://*.facebook.com/*
// @grant         none
// @run-at        document-start
// @require       http://code.jquery.com/jquery-2.2.1.min.js
// @namespace https://greasyfork.org/users/31125
// @downloadURL https://update.greasyfork.org/scripts/20828/Facebook%20Double%20Beta.user.js
// @updateURL https://update.greasyfork.org/scripts/20828/Facebook%20Double%20Beta.meta.js
// ==/UserScript==


/* KOLOR PODŚWIETLENIA W HEX*/

var highlightColour = "#ffe";

/* KOLOR PODŚWIETLENIA W HEX*/







function waitForKeyElements(e,t,n,a){var r,o;r="undefined"==typeof a?$(e):$(a).contents().find(e),r&&r.length>0?(o=!0,r.each(function(){var e=$(this),n=e.data("alreadyFound")||!1;if(!n){var a=t(e);a?o=!1:e.data("alreadyFound",!0)}})):o=!1;var l=waitForKeyElements.controlObj||{},i=e.replace(/[^\w]/g,"_"),d=l[i];o&&n&&d?(clearInterval(d),delete l[i]):d||(d=setInterval(function(){waitForKeyElements(e,t,n,a)},300),l[i]=d),waitForKeyElements.controlObj=l}

waitForKeyElements ("._4-u2.mbm._5v3q._4-u8", op);

function op (jNode) {

	    $timestamp = $(jNode).find('a._5pcq');
	
	    var post;
	
	    if($($timestamp).is("[href]")){
			post = $timestamp.attr("href");
		}

	if (typeof post !== 'undefined') {
		
	    var post_id;
	
	    if (post.indexOf("permalink") > -1){
			
		  post_id = post.replace(/\//g, "");
		  post_id = post_id.split("permalink", 2)[1];

		  $(jNode).find('a._5pcq').parent().append('<span> · </span><span class="op_post_id">No. '+post_id+'</span>');
		}


		var xD = $(jNode).find('span.op_post_id').text();
		var last2 = xD.slice(-2);
		
		doubleHighlight = function (str){
			
			var Fletter = str.substr(0, 1);
			return (str.replace(new RegExp(Fletter, 'g'), "").length === 0);
			
		};

		if(doubleHighlight(last2)){
			
		 $(jNode).find('span.op_post_id').css({ "background-color": highlightColour});

		}

	}

}


/////////COMMENTS/////////



waitForKeyElements (".UFICommentContentBlock", comment);

function comment (jNode) {


        var post = $(jNode).find('a.uiLinkSubtle').attr("href");

if (typeof post !== 'undefined') {
		var post_id;

		if(post.indexOf("reply_comment_id") > -1){
			
		  post_id = post.match("reply_comment_id=" + "(.*)" + "&comment_tracking")[1];
		
		}
		else if (post.indexOf("reply_comment_id") == -1 && post.indexOf("comment_id") > -1){
		
			post_id = post.match("comment_id=" + "(.*)" + "&comment_tracking")[1];
		
		}


		$(jNode).find('a.uiLinkSubtle').parent().append('<span> · </span><span class="post_id">No. '+post_id+'</span>');


		var xD = $(jNode).find('span.post_id').text();
		var last2 = xD.slice(-2);

		doubleHighlight = function (str){
			
			var Fletter = str.substr(0, 1);
			return (str.replace(new RegExp(Fletter, 'g'), "").length === 0);
		
		};

		if(doubleHighlight(last2)){
			
		 $(jNode).find('span.post_id').css({ "background-color": highlightColour});
		
		}
}

}