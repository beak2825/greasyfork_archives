// ==UserScript==
// @name       Read Wattpad full screen
// @version    0.7
// @match      http://www.wattpad.com/*
// @require http://code.jquery.com/jquery-latest.js
// @description read wattpad full screen. remove all but text. distraction free.
// @namespace https://greasyfork.org/users/5241
// @downloadURL https://update.greasyfork.org/scripts/5003/Read%20Wattpad%20full%20screen.user.js
// @updateURL https://update.greasyfork.org/scripts/5003/Read%20Wattpad%20full%20screen.meta.js
// ==/UserScript==

$(document).ready(function() {

	//alert("ok");
    //debugger;

    var text = $('#storyText');
    if (!text.length) return;

    $(window).unbind();
    text.attr("style","padding:15%;margin-right:10%;");
    
    var body = $('body');
    var pagingButtons=$('#pagingButtons');
    var nextChapter=$('#nextChapter');
    var action_bar=$('#action_bar');

    action_bar.find("#library_manage").remove();
    action_bar.find("#share_story").remove();
    action_bar.find("#big_vote_button").append("Vote");
    var style='color:#808080; text-decoration:none; padding:20px;';
    action_bar.attr('style',style).find('a').attr('style',style);
    
    nextChapter.css("margin-right","20%");
    nextChapter.find('a').attr('style','font-weight: bold;color: #808080;text-decoration: none;');
    
    
    pagingButtons
    	.css('margin-right','inherit')
    	.find(".paging_input")
    		.css({
                border: "none",
                "font-size": "19px",
                "text-align": "right",
                "font-family": "Verdana, Helvetica, Arial, sans-serif",
                background: "#FFF",
                color: "#000"
            });

    pagingButtons
    	.find(".prev_page")
    		.css({
                "padding-right": "3px",
                "position": "absolute",
                "margin-left": "-20px",
                "margin-top": "3px"
            });
    
    body.html('<div id=wrapper></div>');
    
    //alert('ok');
    document.open();
    document.write(body.html());
    document.close();
    $.cache = {};
   
    $('#wrapper')
    	.css('width',"110%")
    	.css('overflow-y',"scroll")
    	.css('margin-right',"20%")
        .append(text)
        .append(pagingButtons)
    	.append(nextChapter)
    	.append('<a href=/library style="float:right; text-decoration:none; color:gray; margin-right:inherit">Library</a>')
    	.append(action_bar)

    
    body = $('body');
    body.css({
		"line-height": "150%",
		"word-break": "break-word",
		"text-align": "justify",
		"font-family": "Verdana, Helvetica, Arial, sans-serif",
        "font-size": "larger"
    });

    
    $('#pagingButtons')
       .find("a").attr('onclick','body.animate({scrollTop:0},1000);return nextPageClick();');

    //pgi.replaceWith(pgi.val());
    
    
});
    