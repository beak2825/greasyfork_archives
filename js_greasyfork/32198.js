// ==UserScript==
// @name			Wayback Machine links modifier
// @description		Modifies WM links on a result page to redirect to actual website, not the snapshot
// @include			/http://web\.archive\.org/web/\d{14}/http(|s)://.*$/
// @author			iceman94
// @copyright		2017+, iceman94
// @version			0.1
// @grant			none
// @namespace https://greasyfork.org/users/148290
// @downloadURL https://update.greasyfork.org/scripts/32198/Wayback%20Machine%20links%20modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/32198/Wayback%20Machine%20links%20modifier.meta.js
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

// Modifies WM links on a result page to redirect to the actual website linked, not the snapshot
function rewriteLinks()
{
	var coll = document.getElementsByTagName('a');
	var l = coll.length;
	for (var i=0; i<l; i++)
	{
		if(coll[i].href && coll[i].href.search(/^http:\/\/web\.archive\.org\/web\/\d{14}\/.*/i) != -1)
		{
			//console.log('Matching result: ', coll[i].href);
			coll[i].href = coll[i].href.replace(/^http:\/\/web\.archive\.org\/web\/\d{14}\//i, "");
		}
	}
};


//=======================================================================================================
// Showtime !
//=======================================================================================================

XBLoad(rewriteLinks());
