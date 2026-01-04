// ==UserScript==
// @name           Danbooru fullscreen image viewer
// @description    Auto loads original version of any picture on Danbooru website
// @exclude        /^https?://danbooru\.donmai\.us/posts/\d{1,99}#$/
// @include        /^https?://danbooru\.donmai\.us/posts/\d{1,99}$/
// @require        https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js
// @author         iceman94
// @copyright      2017+, iceman94
// @version        0.01
// @grant          none
// @namespace https://greasyfork.org/users/148290
// @downloadURL https://update.greasyfork.org/scripts/32191/Danbooru%20fullscreen%20image%20viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/32191/Danbooru%20fullscreen%20image%20viewer.meta.js
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

function XBLoad(func, verbose)
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

// Loads original (high resolution) version of any picture if available or uses default picture as such
function locateOriginal()
{
	var obj = new Object;
	if (document.getElementById('image-resize-link'))
	{
		obj['element'] = document.getElementById('image-resize-link');
		obj['tag'] = 'href';
	} else 	if (document.getElementById('image'))
	{
		obj['element'] = document.getElementById('image');
		obj['tag'] = 'src';
	} else
	{
		obj['element'] = null;
		obj['tag'] = null;
	}
	
	return obj;
}

// Appends pound ('#') symbol to the current URI to avoid endless redirecting
function editLocation()
{
	window.location.replace(window.location + "#");
}

// Edits the page using the necessary functions
function editPage(obj)
{
	editLocation();
	switch (obj['tag'])
    {
        case 'href':
            window.location = obj['element'].href;
            break;
        case 'src':
            window.location = obj['element'].src;
            break;
        default:
            console.log("Wrong type detected in editPage function");
            return -1;
    }
}


//=======================================================================================================
// Showtime !
//=======================================================================================================

XBLoad(editPage(locateOriginal()));
