// ==UserScript==
// @name           Clean and Simple FilesTube
// @namespace      Clean-and-Simple-FilesTube
// @require        http://code.jquery.com/jquery.min.js
// @author         DarkSkul
// @description    Show directly the links and their source and remove All the Ads and unnecessary items from Filestube.to
// @include        http://www.filestube.to/*
// @grant          GM_addStyle
// @grant		    GM_xmlhttpRequest
// @grant		    GM_setClipboard
// @version        9.3
// @source         

// @downloadURL https://update.greasyfork.org/scripts/3659/Clean%20and%20Simple%20FilesTube.user.js
// @updateURL https://update.greasyfork.org/scripts/3659/Clean%20and%20Simple%20FilesTube.meta.js
// ==/UserScript==

var idnb = 1;
function replaceURLWithHTMLLinks(text) {
	var exp = /((https?|ftp|file):\/\/[^\n\r]+)/ig;
	return text.replace(exp,"<a style='text-decoration:none;' href='$1'><font color=red>$1</font></a><br>"); 
}

function RemoveBoldTag(strg) {
	strg=strg.replace(/<span style="font-weight:bold;">/g,"");
	strg=strg.replace(/<\/span>/g,"");
	strg=strg.replace(/<\/*b>/g,"");
	return strg;
}

function getLinks(loadUrl,resultLink) {
	GM_xmlhttpRequest({
		method: "GET",
		url: loadUrl,
		onload: function(response) {
			code = response.responseText;
			
			//Get source
			source = $(code).find('.fSrc').html();
			
			//Get dl links
			var nbLines=0;
			var urls = "";
			$(code).find(".file-link-main").each(function(){
				urls = urls + $(this).attr('href') + "\n";
				nbLines=nbLines+1;
			});
			
			//Add copy button
			copyId = 'successCopy' + idnb;
			$(resultLink)
				.nextAll("br:first")
				.replaceWith("<button id='"+ copyId + "' type='button' >Copy links</button><br>");
			jcopyId = "#" + copyId;
			$(jcopyId).click(function() {
				GM_setClipboard(urls);
				$(this).after("<span> Links copied! </span>");
			});
			
			//Add DL links
			if(nbLines < 6)
				$(resultLink).parent().append(replaceURLWithHTMLLinks(urls));
			else
				$(resultLink).parent().append("<div style='height:130px;max-height:130px;overflow-y:scroll;width:700px;'>"+replaceURLWithHTMLLinks(urls)+"</div>");
			
			//Add source link
			$(resultLink).parent().append("<a  href='" + source + "' style='text-decoration:none;'><font color=green>" + source + "</font></a>");
			
			idnb = idnb+1;
		}
	});
}

str = location.href;
$(document).ready(function(){
	if( str.search(/filestube.to\/?$/ig) !== -1 ) { // Home page	
		//style
		$(".logo").css("margin-top","50px");
		
		//Hide unwanted items
		GM_addStyle(".hB, .mcl {\ndisplay:none !important;\n}");
	}
	
	else if( (str.search(/filestube.to\/[^\/]+\/.+/ig) !== -1) || (str.search(/query\.html/ig) !== -1) ) { // Results page		
		//style
		$("#results-holder").css("padding-left", "5%");
		$("#results").css("width", "100%");
		$(".iRss").clone().css("margin-right", "10%").css("padding", "0px 10px").appendTo(".cf");
		$("#pager").css("padding", "0");
                
		//links & source
		$("a.rL").each(function(){
			url = $(this).attr('href');
			getLinks(url, $(this));
		});
		
		//Hide unwanted items
		GM_addStyle("#most-popular-topics, .rBvi, #spla, .rQ, .rB, .spL, .rSt, .rS, .rate, .alt_button, #recent {\ndisplay:none !important;\n}");
	}
	
	else { // Download page
		
		//smaller title
		title = $(".fH > h1").html();
		$(".fH > h1").replaceWith("<h3>" + title + "</h3>");
		
		//Hide unwanted items
		$("#disqus_thread").remove();
		GM_addStyle(".dsq-brlink, .lS, #ac_form, .sr, #ajx_rate, H2, .fSl, .rl > DL ~ * {\ndisplay:none !important;\n}");
		
		//source
		sourcelink=$('.fSrc').html();
		$('.fSrc').attr('href',sourcelink);
	}
	
	//global ads
	GM_addStyle("#stkTgl, #uB, .fBx, .ft, .ftP, .fdb, .rr, .spF {\ndisplay:none !important;\n}");
});
