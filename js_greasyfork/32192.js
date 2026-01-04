// ==UserScript==
// @name        Escapist video section cleaner
// @version     0.04
// @description Resizes a video on the Escapist's video section, centers it and autoplays it
// @include     /^http://www\.escapistmagazine\.com/videos/view/.*/.*$/
// @grant       none
// @author      iceman94
// @copyright   2014+, iceman94
// @namespace 8f39a87d8081774a9cbd024879f09787
// @downloadURL https://update.greasyfork.org/scripts/32192/Escapist%20video%20section%20cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/32192/Escapist%20video%20section%20cleaner.meta.js
// ==/UserScript==


//=======================================================================================================
// Cross-browsers load function
// Accepts a JS Object containing optional parameters:
// |-mode: 'auto'|'jqload'|'jqready'|'atchevt'|'evtlist'|'timeout' (default: 'auto')
// |-verbose: true|false (default: false)
// |-timeoutval: integer in milliseconds USED ONLY by the timeout mode (default: 5000)
//
// Script loading modes are tested in this order :
// |-support for jQuery API
// |--uses $(window).load method if available
// |--uses $(window).ready method if available
// |-support for DOMContentLoaded event (compatible only with the following browsers :
//   Chrome >= 0.2; Firefox >= 1.0; IE >= 9.0; Opera >= 9.0; Safari >= 3.1)
// |-support for document.attachEvent
// |-uses setTimeout w/ custom delay
//
// Usage: XBLoad(function_to_call_wo_parenthesis, {mode: 'MODE', verbose: true|false, timeoutval:7500})
//=======================================================================================================

function XBLoad(func, options)
{
	var options = options || new Object();
    var verbose = (typeof options.verbose !== 'undefined') ? options.verbose : false;
	var mode = (typeof options.mode !== 'undefined') ? options.mode : 'auto';
	var timeoutval = (typeof options.timeoutval !== 'undefined') ? options.timeoutval : 5000;
	
	switch(mode)
	{
		case 'auto':
			if (window.jQuery)
			{
				if ($(window).load)
				{
					if (verbose == true) { console.log('Javascript loaded using $(window).load mode through option', mode); };
					return $(window).load(function() { func(); });
				}
				else if ($(window).ready)
				{
					if (verbose == true) { console.log('Javascript loaded using $(window).ready mode through option', mode); };
					return $(window).ready(function() { func(); });
				};        
			}
			else if (document.addEventListener)
			{
				if (verbose == true) { console.log('Javascript loaded using document.addEventListener mode through option', mode); };
				document.addEventListener('DOMContentLoaded', function(event)
				{
					return func();
				});
			}
			else if (document.attachEvent)
			{
				if (verbose == true) { console.log('Javascript loaded using document.attachEvent mode through option', mode); };
				document.attachEvent('load', function()
				{
					return func();
				});
			}
			else
			{
				if (verbose == true) { console.log('Javascript loaded using setTimeout method through option', mode, 'and timeout value of', timeoutval); };
				return setTimeout(function() { func(); }, timeoutval);
			};
			break;
		case 'jqload':
			if (verbose == true) { console.log('Javascript loaded using $(window).load mode through option', mode); };
			return $(window).load(function() { func(); });
			break;
		case 'jqready':
			if (verbose == true) { console.log('Javascript loaded using $(window).ready mode through option', mode); };
			return $(window).ready(function() { func(); });
			break;
		case 'evtlist':
			if (verbose == true) { console.log('Javascript loaded using document.addEventListener mode through option', mode); };
			document.addEventListener('DOMContentLoaded', function(event)
			{
				return func();
			});
			break;
		case 'atchevt':
			if (verbose == true) { console.log('Javascript loaded using document.attachEvent mode through option', mode); };
			document.attachEvent('load', function()
			{
				return func();
			});
			break;
		case 'timeout':
			if (verbose == true) { console.log('Javascript loaded using setTimeout mode through option', mode, 'and timeout value of', timeoutval); };
			return setTimeout(function() { func(); }, timeoutval);
			break;
		default:
			console.log('[XBLoad] Wrong script loading mode [', mode, '] passed to function. Please investigate.');
			break;
	};
};

// Locates video player DOM node
function locateVideo()
{
    return document.getElementsByTagName('video')[0];
}

// Deletes a DOM node based of its type (id, tag or class)
function delElement(elmt_type, elmt_name)
{
    switch (elmt_type)
    {
        case 'id':
            var tgt = document.getElementById(elmt_name);
            break;
        case 'tag':
            var tgt = document.getElementsByTagName(elmt_name)[0];
            break;
        case 'class':
            var tgt = document.getElementsByClassName(elmt_name)[0];
            break;
        default:
            console.log("delElement syntax error\nUsage:\n  delElement(<[id|tag|class]>, <elmt_name>)");
            return -1;
    }
    tgt.parentNode.removeChild(tgt);
}

// Sets video player size attributes w/ reserved width and height percentages
function setVideoAttr(browserWidth, browserHeight, reservedWidth, reservedHeight)
{
    var obj = {};
    var videoWidth = reservedWidth * browserWidth / 100;
    obj.width = browserWidth - videoWidth;
    var videoHeight = reservedHeight * browserWidth / 100;
    obj.height = browserHeight - videoHeight;

    return obj;
}

// Wraps all previous code for... showtime !
function showtime()
{
	// Delete page top navigation bar to make some head room
	delElement('id', 'site_menu');
	
    // Object containing reserved browser's width and height values in percentage
    var reservedSpace = {};
    reservedSpace.widthInPct = 8;
    reservedSpace.heightInPct = 8;
    
    // Sets video player attributes
    var browserSize = setVideoAttr(window.screen.availWidth, window.screen.availHeight, reservedSpace.widthInPct, reservedSpace.heightInPct);
    
    // Locates video player and its parent element
    var videoElmt = locateVideo();
    var videoElmtParent = videoElmt.parentElement;
    
    // Sets video player style
	videoElmtParent.setAttribute('style', ('width:' + browserSize.width + 'px;' + 'height:' + browserSize.height + 'px'));
	
    // Sets video's parent's parent element style
    videoElmtParent.parentElement.setAttribute('style', ('position: absolute; left: -17%; top: -22%'));
	
    // Bug: If the video player "loading spinner" stays visible after modifying the page, we remove it
    if(document.getElementsByClassName('vjs-loading-spinner'))
	{
		delElement ("class", "vjs-loading-spinner");
	}
	
	// Autoplays the video
	videoElmt.play()
}


//=======================================================================================================
// Showtime !
//=======================================================================================================

XBLoad(showtime, {mode:'timeout', timeoutval:'2500'});