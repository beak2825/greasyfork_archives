// ==UserScript==
// @name        gamekultHelper
// @version     0.1
// @description	Gives options on Factornews website (remove users comments...)
// @include     /http://www\.gamekult\.com/(actu|video|jeux|materiel)/.*\.html(|\#.*)$/
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js
// @grant       none
// @author      iceman94
// @copyright   2016+, iceman94
// @namespace https://greasyfork.org/users/148290
// @downloadURL https://update.greasyfork.org/scripts/32194/gamekultHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/32194/gamekultHelper.meta.js
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

// Locates all types of comments sections within the page
function getComBlocks()
{
	var comArr = ['comments', 'article-comments'];
	
	return comArr;
};

// Removes the comment section from appropriate pages
function remComBlocks(input)
{
	var arrL = input.length;
    for (var i=0; i<arrL; i++)
	{
		if(document.getElementById(input[i]))
		{
			console.log('Found ID: ' + input[i]);
			var tgt = document.getElementById(input[i]);
			tgt.parentNode.removeChild(tgt);
		};
	};
};

// Converts comma-separated string to array
function strToArr(input)
{
    if (input)
    {
        return input.split(',');
    };
};


//=======================================================================================================
// Showtime !
//=======================================================================================================

XBLoad(remComBlocks(getComBlocks()));
