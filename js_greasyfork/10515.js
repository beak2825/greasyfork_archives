// ==UserScript==
// @name        pootscript + castamp fix unofficial
// @namespace   asdf
// @description Pootscript ~ image / webm parser for webirc + castamp fix
// @include     http*://*.mibbit.com/*
// @include     http*://*.castamp.com/*
// @include     http*://*.leton.tv/*
// @require     https://code.jquery.com/jquery-2.1.3.min.js
// @version     1.07.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10515/pootscript%20%2B%20castamp%20fix%20unofficial.user.js
// @updateURL https://update.greasyfork.org/scripts/10515/pootscript%20%2B%20castamp%20fix%20unofficial.meta.js
// ==/UserScript==
 
window.get_type = function(thing){
    if(thing===null)return "[object Null]"; // special case
       return Object.prototype.toString.call(thing);
}
 
jQuery.noConflict();
(function( $ ) {
  $(function() {
    //wait for the chat to load
    var asd = window.setInterval(window.findChat = function(){
        if ($("#chats").find('div > table:first').length) {
            clearInterval(asd);
            $("#chats").find('div > table:first > tbody').on('DOMNodeInserted', function(ev){
                if ($(ev.target).is("#chats div > table:first > tbody > tr td:last-child")) {
                    $("#chats div > table:first").parent().scrollTop($("#chats div > table:first").height()); 
                }
                if (get_type(ev.target) == '[object HTMLAnchorElement]') {
                    var link = $(ev.target).prop('href');
                    var imgRegex = /.+(\.jpg|\.gif|\.png|\.jpeg|\.bmp)/gi;
                    var videoRegex = /.+(\.webm|\.mp4)/gi;
                    var imgMatches = imgRegex.exec(link);
                    var videoMatches = videoRegex.exec(link);
                    if (imgMatches !== null) {
                        $(ev.target).replaceWith("<a href='"+link+"' target='_blank'><img style='max-height:80px;max-width:99%;' src='"+link+"' /></a>");
                        $("#chats div > table:first > tbody img:last").unbind('load');
                        $("#chats div > table:first > tbody img:last").on('load', function(){
                            $("#chats div > table:first").parent().scrollTop($("#chats div > table:first").height()); 
                        })
                    } else if (videoMatches !== null) {
                        $(ev.target).replaceWith("<video controls style='max-height:185px;max-width:99%;'><source src='"+link+"' /></video>");
                    }
                }
            });
        } else {
           window.findChat;   
        }
    }, 1000);
  });
})(jQuery);
 
(function() {var css = "";
if (false || (new RegExp("^http://(www.)?iwannabethestream.com.*$")).test(document.location.href))
	css += [
		".install-style-ad {",
		"        display: none;",
		"    }"
	].join("\n");
if (false || (new RegExp("^http://(www.)?castamp.com/embed.php.*$")).test(document.location.href))
	css += [
		"#player_wrapper {height: 0!important;}",
		"    #player {position: fixed;}"
	].join("\n");
if (false || (new RegExp("^http://(www.)?veemi.com/embed.php.*$")).test(document.location.href))
	css += "body {overflow: hidden;}";
if (false || (new RegExp("^http://(www.)?webcaston.com/embed.php.*$")).test(document.location.href))
	css += [
		"embed {",
		"        position: fixed;",
		"        width: 100%;",
		"        height: 100%;",
		"    }"
	].join("\n");
if (false || (new RegExp("^https?://(www.)?connectcast.tv/stream/embed/.*$")).test(document.location.href))
	css += [
		"#jw-player {",
		"        position: fixed !important;",
		"        width: 100% !important;",
		"        height: 100% !important;",
		"    }"
	].join("\n");
if (false || (new RegExp("^https?://(www.)?leton.tv/player.php?.*$")).test(document.location.href))
	css += [
		"#my-video {",
		"        position: fixed;",
		"        top: 0;",
		"        left: 0;",
		"        width: 100%;",
		"        height: 100%;",
		"    }"
	].join("\n");
if (typeof GM_addStyle != "undefined") {
	GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
	PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
	addStyle(css);
} else {
	var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node); 
	} else {
		// no head yet, stick it whereever
		document.documentElement.appendChild(node);
	}
}
})();
