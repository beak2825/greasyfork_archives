// ==UserScript==
// @name           SankakuComplex fullscreen image viewer
// @namespace   037bf0d24a9def775f1f7d44a9ccf181
// @description    Auto loads original version of any picture on SankakuComplex website
// @exclude        /https://chan\.sankakucomplex\.com/post/show/.*#$/
// @include         /https://chan\.sankakucomplex\.com/post/show/.*$/
// @author          iceman94
// @copyright      2015+, iceman94
// @version         0.01
// @grant            none
// @downloadURL https://update.greasyfork.org/scripts/32196/SankakuComplex%20fullscreen%20image%20viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/32196/SankakuComplex%20fullscreen%20image%20viewer.meta.js
// ==/UserScript==


//=======================================================================================================
// Cross-browsers load function
// Tests in this order :
// -support for jQuery API
// |-uses $(window).load method if available
// |-uses $(window).ready method if available
// -support for DOMContentLoaded event (compatible only with the following browsers :
// Chrome >= 0.2; Firefox >= 1.0; IE >= 9.0; Opera >= 9.0; Safari >= 3.1)
// -support for document.attachEvent
// -uses setTimeout w/ 5000ms delay
//=======================================================================================================

function XBLoad (func, verbose)
{
    verbose = verbose || false;

    if (window.jQuery)
    {
        if ($(window).load)
        {
            if (verbose == true) { console.log('Javascript loaded using $(window).load method'); };
            return $(window).load(function() { func(); });
        }
        else if ($(window).ready)
        {
            if (verbose == true) { console.log('Javascript loaded using $(window).ready method'); };
            return $(window).ready(function() { func(); });
        };        
    }
    else if (document.addEventListener)
    {
        if (verbose == true) { console.log('Javascript loaded using document.addEventListener method'); };
        document.addEventListener('DOMContentLoaded', function(event)
        {
            return func();
        });
    }
    else if (document.attachEvent)
    {
        if (verbose == true) { console.log('Javascript loaded using document.attachEvent method'); };
        document.attachEvent('load', function()
        {
            return func();
        });
    }
    else
    {
        if (verbose == true) { console.log('Javascript loaded using setTimeout method'); };
        return setTimeout(function() { func(); }, 5000);
    };
};


//=======================================================================================================
// Setting up functions
//=======================================================================================================

// Loads original (high resolution) version of any picture if available
function loadOriginal()
{
	if (document.getElementById('highres'))
	{
		if (document.getElementById('highres').href)
		{
			editLocation();
			var tgt = document.getElementById('highres');
			var uri = tgt.href;
			window.location = uri;
		}
	}
}

// Appends pound ('#') symbol to actual URI to avoid endless redirecting
function editLocation()
{
	window.location.replace(window.location.href + "#");
}


//=======================================================================================================
// Showtime !
//=======================================================================================================

XBLoad(loadOriginal());
