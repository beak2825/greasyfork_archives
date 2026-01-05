// ==UserScript==
// @name        Selective Quote - Idea by Vegas
// @author      Hash G.
// @description Only quote the text selected by your cursor.
// @namespace   HF
// @include     *hackforums.net/showthread.php?tid=*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @version     0.23
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/14412/Selective%20Quote%20-%20Idea%20by%20Vegas.user.js
// @updateURL https://update.greasyfork.org/scripts/14412/Selective%20Quote%20-%20Idea%20by%20Vegas.meta.js
// ==/UserScript==

window.onload = function() {
	settings = GM_getValue("settings", 0);
	
	
	$(".post_management_buttons.float_right").each(function(e) {
		$(this).prepend("<a class='bitButton' data-nb="+e+" title='Quote selected text' href='javascript:void(0);' rel='nofollow' id='selectiveQuote'>Quote selected text</a> ");
	});
	
	
	$("body").append("<div id='popup_SQSettings' style='background-color: #333333; bottom: auto; border: 1px solid rgb(0, 0, 0); height: 20%; left: 182px; margin: 0px; max-height: 95%; max-width: 95%; opacity: 1; padding: 0px; position: fixed; right: auto; top: 128px; width: 75%; display: none;'><h4>Selective Quote Settings</h4><br><input type='radio' data-input='0' name='settings'>Open in a new tab<br><input type='radio' data-input='1' name='settings'>Add to your message<br><input type='radio' data-input='2' name='settings'>Add to your message and scroll<br><br><button class='bitButton' id='SQClose'>Close</button> <button class='bitButton' id='SQSaveSettings'>Save</button></div>");
	
	$(".post_management_buttons.float_right a[title*='Quote selected']").on("click", function() {
		quote = parseText(getSelectionText());
		if (quote === "" || quote.length == 0 || !quote) {
			callSettings(settings);
		} else {
			name = $(this).parent().parent().parent().parent().find(".post_author strong span[class*='group']").html();
			pid = $(this).parent().find("a[href*='newreply.php?tid=']").attr("href").substr(33);
			
			if (settings == 0) {
				$("#message").html("[quote="+name+" pid="+pid+"]\n"+quote+"\n\n[/quote]");
				$("#quick_reply_form").attr("target", "_blank");
				$("input.button:nth-child(2)").click();				
			} else if (settings == 1) {
				$("#message").html("[quote="+name+" pid="+pid+"]\n"+quote+"\n\n[/quote]");
				
			} else if (settings == 2) {
				$("#message").html("[quote="+name+" pid="+pid+"]\n"+quote+"\n\n[/quote]");
				window.scrollTo(0,document.body.scrollHeight);
			}
		}
	});
	
	$("#SQClose").on("click", function() {
		$("#popup_SQSettings").css("display", "none");
	});
	
	$("#SQSaveSettings").on("click", function() {
		GM_setValue("settings", $("#popup_SQSettings input:checked").attr("data-input"));
		settings = GM_getValue("settings", 0);
		$("#popup_SQSettings").css("display", "none");
	});
	
	
	
	function getSelectionText() {
		var sel = unsafeWindow.getSelection();
		if (sel.rangeCount) {
			var container = document.createElement("div");
			for (var i = 0, len = sel.rangeCount; i < len; ++i) {
				container.appendChild(sel.getRangeAt(i).cloneContents());
			}
			text = container.innerHTML;
		}
		return text;
	}
	
	function callSettings(settings) {
		$("#popup_SQSettings").css("display", "block");
		if (settings == 0) {
			$("#popup_SQSettings input[data-input=0]").attr("checked", "checked");
		} else if (settings == 1) {
			$("#popup_SQSettings input[data-input=1]").attr("checked", "checked");		
		} else if (settings == 2) {
			$("#popup_SQSettings input[data-input=2]").attr("checked", "checked");				
		}
	}
	
	
	function parseText(quote) {
		for (var i = 0; i < 5; i++) {
			quote = quote.replace(/<span style="text-decoration: underline;">(.*?[\S\s]*?)<\/span>/ig, '[u]$1[/u]');
			quote = quote.replace(/<span style="font-weight: bold;">(.*?[\S\s]*?)<\/span>/ig, '[b]$1[/b]');
			quote = quote.replace(/<span style="font-style: italic;">(.*?[\S\s]*?)<\/span>/ig, '[i]$1[/i]');
			quote = quote.replace(/<span style="color: (.*?);">(.*?[\S\s]*?)<\/span>/ig, '[color=$1]$2[/color]');
			quote = quote.replace(/<div style="text-align: (.*?);">(.*?[\S\s]*?)<\/div>/ig, '[align=$1]$2[/align]');
			quote = quote.replace(/<ol type="1">(.*?[\S\s]*?)<\/ol>/ig, '[list=1]$1[/list]');
			quote = quote.replace(/<ul>(.*?[\S\s]*?)<\/ul>/ig, '[list]$1[/list]');
			quote = quote.replace(/<li>(.*?[\S\s]*?)<\/li>/ig, '[*]$1');
			quote = quote.replace('<a href="javascript:void(0);" onclick="javascript:if(parentNode.parentNode.getElementsByTagName(\'div\')[1].style.display==\'block\'){parentNode.parentNode.getElementsByTagName(\'div\')[1].style.display=\'none\';this.innerHTML=\'(Click to View)\';}else {parentNode.parentNode.getElementsByTagName(\'div\')[1].style.display=\'block\';this.innerHTML=\'(Click to Hide)\';}">(Click to Hide)<\/a>', '');
			quote = quote.replace(/<div><div class="spoiler_header">(.*?[\S\s]*?)<\/div><div class="spoiler_body" style="display: block;">(.*?[\S\s]*?)<\/div><\/div>/ig, '[sp=$1]$2[/sp]');
			quote = quote.replace(/<a href="(.*?)" target="_blank">(.*?[\S\s]*?)<\/a>/ig, '[url=$1]$2[/url]');
			quote = quote.replace(/<img src="(.*?)" alt="(.*?)" border="0">/ig, '[img]$1[/img]');
			quote = quote.replace(/<span style="font-family: (.*?);">(.*?[\S\s]*?)<\/span>/ig, '[font=$1]$2[/font]');
			quote = quote.replace(/<span style="font-size: (.*?);">(.*?[\S\s]*?)<\/span>/ig, '[size=$1]$2[/size]');
			quote = quote.replace(/<br>/ig, '');
			quote = quote.replace(/<hr>/ig, '[hr]');
			quote = quote.replace(/<hr>/ig, '[hr]');
		}
		return quote;
	}

	
}
