// ==UserScript==
// @name           Gelbooru fullscreen image viewer
// @description    Auto loads original version of any picture on Gelbooru website
// @exclude        /^https?://gelbooru\.com/index\.php\?page=post\&s=view\&id=\d{1,99}#$/
// @include        /^https?://gelbooru\.com/index\.php\?page=post\&s=view\&id=\d{1,99}$/
// @include        /^https?://gelbooru\.com/index\.php\?page=post\&s=view\&id=\d{1,99}\&pool_id=\d{1,99}$/
// @require        https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js
// @author         iceman94
// @copyright      2015+, iceman94
// @version        0.02
// @grant          none
// @namespace https://greasyfork.org/users/148290
// @downloadURL https://update.greasyfork.org/scripts/32195/Gelbooru%20fullscreen%20image%20viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/32195/Gelbooru%20fullscreen%20image%20viewer.meta.js
// ==/UserScript==

//https://gelbooru.com/index.php?page=post&s=view&id=3646928
//http://gelbooru\.com/index\.php\?page=post\&s=view\&id=\d{1,99}$

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
function loadOriginal ()
{
	var coll = document.getElementsByTagName('a');
	var collL = coll.length;
	for (var i=0; i<collL; i++)
	{
		if (coll[i] && coll[i].textContent == 'Original image')
		{
			editLocation();
			window.location = coll[i].href;
		}
	}
}
// function loadOriginal ()
// {
	// if (document.getElementById('image') && document.getElementById('image').src)
	// {
		// $('body').load( document.getElementById('image').src);
	// }
// }

// Appends pound ('#') symbol to actual URI to avoid endless redirecting
function editLocation ()
{
	window.location.replace(window.location.href + "#");
}


//=======================================================================================================
// Showtime !
//=======================================================================================================

XBLoad(loadOriginal());
