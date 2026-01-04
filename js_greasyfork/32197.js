// ==UserScript==
// @name		SankakuComplex image blurring removal
// @description		Removes censoring "blur" on SankakuComplex image search page
// @include		https://chan.sankakucomplex.com/*
// @author		iceman94
// @copyright		2017+, iceman94
// @version		0.01
// @grant		none
// @namespace https://greasyfork.org/users/148290
// @downloadURL https://update.greasyfork.org/scripts/32197/SankakuComplex%20image%20blurring%20removal.user.js
// @updateURL https://update.greasyfork.org/scripts/32197/SankakuComplex%20image%20blurring%20removal.meta.js
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

// Removes censoring "blur" from SankakuComplex image search page
function removeBlur()
{
	if (document.getElementsByTagName('span'))
	{
		var coll = document.getElementsByTagName('span');
		var l = coll.length;
		for (var i=0; i<l; i++)
		{
			if(coll[i].classList && coll[i].classList.contains('blacklisted'))
			{
				coll[i].classList.remove('blacklisted');
			}
		}
	}
}


//=======================================================================================================
// Showtime !
//=======================================================================================================

XBLoad(removeBlur());
