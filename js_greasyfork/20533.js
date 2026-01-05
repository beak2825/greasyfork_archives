// ==UserScript==
// @name          Facebook Double
// @author        Niqueish
// @description   Adds doubles to Facebook
// @homepage      https://www.facebook.com/Niqueish
// @version       1.0
// @include       *://*.facebook.com/*
// @grant         none
// @require       http://code.jquery.com/jquery-2.2.1.min.js
// @namespace https://greasyfork.org/users/31125
// @downloadURL https://update.greasyfork.org/scripts/20533/Facebook%20Double.user.js
// @updateURL https://update.greasyfork.org/scripts/20533/Facebook%20Double.meta.js
// ==/UserScript==


//HEX
var highlightColour = "#ffe";








$( document ).on( "mouseover", "html body .userContentWrapper:not(.op_final)", function() {
		
        var post = $(this).find('a._5pcq').attr("href");
		var post_id = post.match("permalink/" + "(.*)" + "/")[1];
		
		var $op_post_id = $(this).find('.op_post_id');
   
	if($op_post_id.length < 1){
		   $(this).find('a._5pcq').parent().append('<span> · </span><span class="op_post_id">No. '+post_id+'</span>');
		   $(this).addClass("op_final");
	}
	
		var xD = $(this).find('span.op_post_id').text();
		var last2 = xD.slice(-2);
		
		function doubleHighlight (str)
		{
			var Fletter = str.substr(0, 1);
			return (str.replace(new RegExp(Fletter, 'g'), "").length === 0);
		}
		
		if(doubleHighlight(last2)){
		 $(this).find('span.op_post_id').css({ "background-color": highlightColour});
		}

		
    });




/////////COMMENTS/////////


$( document ).on( "mouseover", "html body .UFICommentContentBlock:not(.final)", function() {
		
        var post = $(this).find('a.uiLinkSubtle').attr("href");
		var post_id;
		
		if(post.indexOf("reply_comment_id")>-1){
		  post_id = post.match("reply_comment_id=" + "(.*)" + "&comment_tracking")[1];
		}
		else{
		  post_id = post.match("comment_id=" + "(.*)" + "&comment_tracking")[1];
		}
		

        var $post_id = $(this).find('.post_id');

		if($post_id.length < 1){
		   $(this).find('a.uiLinkSubtle').parent().append('<span> · </span><span class="post_id">No. '+post_id+'</span>');
		   $(this).addClass("final");
		}

		var xD = $(this).find('span.post_id').text();
		var last2 = xD.slice(-2);

		function doubleHighlight (str)
		{
			var Fletter = str.substr(0, 1);
			return (str.replace(new RegExp(Fletter, 'g'), "").length === 0);
		}

		if(doubleHighlight(last2)){
		 $(this).find('span.post_id').css({ "background-color": highlightColour});
		}
    });