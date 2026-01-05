// ==UserScript==
// @name         [Erepublik] Extract BBCode of articles
// @match        *://www.erepublik.com/en/article/*
// @version      0.1
// @description  Extracts BBCode of articles
// @author       Mike Ontry
// @grant        none
// @namespace https://greasyfork.org/users/3941
// @downloadURL https://update.greasyfork.org/scripts/17872/%5BErepublik%5D%20Extract%20BBCode%20of%20articles.user.js
// @updateURL https://update.greasyfork.org/scripts/17872/%5BErepublik%5D%20Extract%20BBCode%20of%20articles.meta.js
// ==/UserScript==

var main = jQuery(document).find('div[class="post_content"]').get(0);

jQuery(main).find('h2').before('<a class="std_global_btn smallSize blueColor" style="float:right;" id="extractBB"><span>Extract BBCode</span></a>');

jQuery(document).find('a[id="extractBB"]').on("click", function() {
    var content = jQuery(main).find('div[class="full_content"]').html();
    jQuery(document).find('div[class="holder"]').after('<textarea id="bbCodeCont" rows="20" cols="115">'+ HtmltoBB(content) +'</textarea>');
    location.hash = "bbCodeCont";
});

function HtmltoBB(html) {

	html = html.replace(/<br\s*[\/]?>/gi, "\n\r");
	html = html.replace(/<b>/gi, "[b]");
	html = html.replace(/<i>/gi, "[i]");
	html = html.replace(/<u>/gi, "[u]");
	html = html.replace(/<\/b>/gi, "[/b]");
	html = html.replace(/<\/i>/gi, "[/i]");
	html = html.replace(/<\/u>/gi, "[/u]");
	html = html.replace(/<em>/gi, "[b]");
	html = html.replace(/<\/em>/gi, "[/b]");
	html = html.replace(/<strong>/gi, "[b]");
	html = html.replace(/<\/strong>/gi, "[/b]");
    html = html.replace(/<strike>/gi, "[s]");
	html = html.replace(/<\/strike>/gi, "[/s]");
    html = html.replace(/<sub>/gi, "[sub]");
	html = html.replace(/<\/sub>/gi, "[/sub]");
    html = html.replace(/<sup>/gi, "[sup]");
	html = html.replace(/<\/sup>/gi, "[/sup]");
    html = html.replace(/<hr>/gi, "-----");
    //html = html.replace(/<div(.*?)style="text-align:(.*?)"(.*?)>([\s\S]*?)<\/div>?=*$/gmi, "[$2]$4[/$2]");
	html = html.replace(/<div(.*?)style="(.*?)"(.*?)>/gi, "[center]");
	html = html.replace(/<\/div>/gi, "[/center]");

	html = html.replace(/<img(.*?)src="(.*?)"(.*?)>/gi, "[img]$2[/img]");
	html = html.replace(/<a(.*?)href="(.*?)"(.*?)>(.*?)<\/a>/gi, "[url=$2]$4[/url]");

	html = html.replace(/\/\//gi, "/");
	html = html.replace(/http:\//gi, "http://");

	html = html.replace(/<(?:[^>'"]*|(['"]).*?\1)*>/gmi, "");
	html = html.replace(/\r\r/gi, ""); 
	html = html.replace(/\[img]\//gi, "[img]");
	html = html.replace(/\[url=\//gi, "[url=");

	html = html.replace(/(\S)\n/gi, "$1 ");

	return html;
}