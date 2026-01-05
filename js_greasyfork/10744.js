// ==UserScript==
// @name          dissident revived theme
// @namespace     http://hackforums.net   
// @version       1.0
// @description   no
// @include       http://www.hackforums.net/*
// @include       http://hackforums.net/*
// @include       http://nsfw.hackforums.net/*
// @include       http://www.nsfw.hackforums.net/*
// @author        grin
// @resource      MainCSS https://gist.githubusercontent.com/dissypoo/5672c0796be7a3169aa0/raw/c574e0d14420e0f34ef1b440a765451a4c3db814/gistfile1.css
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js
// @grant         GM_addStyle
// @grant         GM_getResourceText
// @run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/10744/dissident%20revived%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/10744/dissident%20revived%20theme.meta.js
// ==/UserScript==

(function ( $ ) {
$.fn.alterClass = function ( removals, additions ) {
	var self = this;
	if ( removals.indexOf( '*' ) === -1 ) {
		self.removeClass( removals );
		return !additions ? self : self.addClass( additions );
	}
	var patt = new RegExp( '\\s' + 
			removals.
				replace( /\*/g, '[A-Za-z0-9-_]+' ).
				split( ' ' ).
				join( '\\s|\\s' ) + 
			'\\s', 'g' );
	self.each( function ( i, it ) {
		var cn = ' ' + it.className + ' ';
		while ( patt.test( cn ) ) {
			cn = cn.replace( patt, ' ' );
		}
		it.className = $.trim( cn );
	});
	return !additions ? self : self.addClass( additions );
};
})( jQuery );

/*
 * Document Begins
 */


var MainCSS = GM_getResourceText ("MainCSS");
GM_addStyle (MainCSS);

$(window).load(function(){
    var cp = $("<div class='cp'/>");
    var select = $("<div class='select'/>");
    $("body").append(cp, select);
    var colours = {'black':'#393939', 'blue':'#619ECB', 'green':'#7ECB61', 'orange':'#D29C2D', 'purple':'#724FAD', 'red':'#CB6161'};
    if(!localStorage.getItem('theme')) 
    	localStorage.setItem('theme', 'cl-' + Object.keys(colours)[0]);
    $("body").addClass(localStorage.getItem('theme') ? localStorage.getItem('theme') : 'cl-' + Object.keys(colours)[0]);
    $(".cp").css("background", colours[$("body").attr('class').split(" ")[0].substring(3, $("body").attr('class').split(" ")[0].length)]);
    $.each(colours, function(key, value) {
        select.append($("<div class='part' style='background: " + value + " !important;' cid='" + key + "'/>"));
    });
    $(".cp").click(function(){
        $(".select").toggleClass("show");
    });
    $(".part").click(function(){
        var cl = "cl-" + $(this).attr('cid');
        $(".cp").css("background", colours[$(this).attr('cid')]);
        $("body").alterClass('cl-*', cl);
        localStorage.setItem('theme', cl);
    });
});

/*
 *Javascript Editing
 */
$(document).ready(function(){
    $('span:contains("Moderated")').addClass("sevenpad");
});
/*
$(document).ready(function(){
    $('[div:contains("Group Leader Notice:")][.pm_alert]').attr('id', 'group-alert');
    $('#group-alert').removeClass("pm_alert").addClass("group_alert");
});
*/

$(document).ready(function(){
    $('#pm_notice').removeClass("pm_alert").addClass("pm_alert2");
});

$(document).ready(function(){
    $('.button').removeClass("button").addClass("button2");
});
