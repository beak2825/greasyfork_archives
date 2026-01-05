// ==UserScript==
// @name       V3rmillion Modifier
// @namespace  www.v3rmillion.net
// @version    1.3.4
// @description  Changes the font on V3rmillion.net to something better, in my opinion.
// @match      http://*.v3rmillion.net/*
// @match      v3rmillion.net/*
// @copyright  2014+, Dylan Evans
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/1804/V3rmillion%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/1804/V3rmillion%20Modifier.meta.js
// ==/UserScript==

$('document').ready(function () {
    var username = "Radio"; //Change this to your Vermillion username
    var usernameColour = "aquamarine"; //Change this to the colour you want your username
    var usernameGlowColour = "#6BFFD3"; //Change this to the colour you want the glow around your username to be
    var customCursor = true; // Set to false to disable custom cursor
   //var font = 'Yanone+Kaffeesatz::latin' //Change this to the font you want Vermillion Links to be in (use Google Fonts API)
   //var fontSize = "16.5px"; //Change this to make the font look normal
   // Remove the '/*' and the '*/ ' around the code below and remove the '//' on the 2 above statements to use the font modifier.
   /* WebFontConfig = {
        google: {
            families: [font]
        }
    };
    (function () {
        var wf = document.createElement('script');
        wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
            '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
        wf.type = 'text/javascript';
        wf.async = 'true';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(wf, s);
    })();
    $('a').css("font-family", "Lobster Two");
    $('a').css("font-size", fontSize); */
    
	function changeCSS(name, colour, glowColour)
	{
		$('.largetext').each(function () {
			if (this.innerText == name) {
				$(this).css("-webkit-stroke-width", "5.3px");
				$(this).css(" -webkit-stroke-color", "#FFFFFF");
				$(this).css("-webkit-fill-color", "#FFFFFF");
				$(this).css("text-shadow", "1px 1px 6px" + glowColour);
				$(this).css("-webkit-transition", "width 0.3s");
				$(this).css("transition", "width 0.3s;");
				$(this).css("color", colour);
			}
		})
		$('a').each(function () {
			if (this.innerText == name) {
				$(this).css("-webkit-stroke-width", "5.3px");
				$(this).css(" -webkit-stroke-color", "#FFFFFF");
				$(this).css("-webkit-fill-color", "#FFFFFF");
				$(this).css("text-shadow", "1px 1px 6px" + glowColour);
				$(this).css("-webkit-transition", "width 0.3s");
				$(this).css("transition", "width 0.3s;");
				$(this).css("color", colour);
			}
		})
		$('span').each(function () {
			if(this.innerText == name)
			{
				$(this).css("-webkit-stroke-width", "5.3px");
				$(this).css(" -webkit-stroke-color", "#FFFFFF");
				$(this).css("-webkit-fill-color", "#FFFFFF");
				$(this).css("text-shadow", "1px 1px 6px" + glowColour);
				$(this).css("-webkit-transition", "width 0.3s");
				$(this).css("transition", "width 0.3s;");
				$(this).css("color", colour);
			}
		})
        if (customCursor) {
        	$('body').css({'cursor': 'url(http://download2160.mediafire.com/9aw3mems3aeg/0d0gcs0mb1ih0j8/vermillion.cur), default'});
        }
	}
    changeCSS(username, usernameColour, usernameGlowColour);
});