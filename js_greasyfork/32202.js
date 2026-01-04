// ==UserScript==
// @name        pocketHelper
// @namespace   None
// @version     0.01
// @description Adds formatting options to Pocket viewer
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js
// @include     /^https://getpocket\.com/a/queue/$/
// @include     /^https://getpocket\.com/a/read/[0-9]{1,10}$/
// @grant       none
// @author      iceman94
// @copyright   2015+, iceman94
// @downloadURL https://update.greasyfork.org/scripts/32202/pocketHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/32202/pocketHelper.meta.js
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

    if (window.onload)
    {
        if (verbose == true) { console.log('Javascript loaded using window.onload method'); };
        return window.onload = func;
    }
    else if (window.jQuery)
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
// Miscellaneous functions
//=======================================================================================================

// Function to search a string in an array and, if it matches, returns the according string
function searchStringInArray (str, strArray)
{
    for (var j=0; j<strArray.length; j++) {
        if (strArray[j].match(str)) return strArray[j];
    }
    return -1;
};

// Locates field to be modified by its ID, Tag or Class and sets its CSS (optional)
//function locateTgt (tgtType, tgtVal, tgtCSS, tgtIdx)
function locateTgt (tgtType, tgtVal, tgtIdx)
{
    tgtType = tgtType || 'id';
    tgtVal = tgtVal;
    tgtCSS = tgtCSS || '';
    //tgtIdx = tgtIdx || '';
    console.log('tgtIdx:', tgtIdx);

    console.log('tgtType:', tgtType, ' - tgtVal:', tgtVal, ' - tgtCSS:', tgtCSS, ' - tgtIdx:', tgtIdx);
    switch (tgtType)
    {
        case 'id':
            var tgt = document.getElementById(tgtVal);
            break;
        case 'tag' :
            var tgt = document.getElementsByTagName(tgtVal)[tgtIdx];
            break;
        case 'class':
            var tgt = document.getElementsByClassName(tgtVal)[tgtIdx];
            break;
    };

    console.log('tgt:', tgt, ' - tgtVal:', tgtVal, ' - tgtIdx:', tgtIdx);
    //console.log('tgt:', tgt, ' - tgtVal:', tgtVal, ' - tgtCSS:', tgtCSS, ' - tgtIdx:', tgtIdx);
    //if (tgtCSS !== '')
    //{
    //    setAttr(tgt, 'style', tgtCSS);
    //};
    return tgt;
};

// Sets attributes of a given element
function setAttr (tgt, attrName, attrContent)
{
    console.log('tgt: ', tgt, ' - attrName: ', attrName, ' - attrContent: ', attrContent);
    tgt.setAttribute(attrName, attrContent);
};

// Locates main picture (i.e. comic picture) in a collection of images based on its 'src' attribute
function locatePic (rgx)
{
    var imgColl = document.getElementsByTagName('img');
    for(var i=0; i<imgColl.length; i++)
    {
        if(imgColl[i] && imgColl[i].src.match(rgx))
        {
            return imgColl[i];
        };
    };
}

// Converts base64 code to HTMLImageElement ('<img>' node)
function base64ToImage (b64Code, nodeId)
{
    nodeId = nodeId || '';
    var image = new Image();
    image.src = b64Code;
    image.id = nodeId;
    return image;
}


//=======================================================================================================
// Do stuff
//=======================================================================================================

function doStuff ()
{
    console.log('IN doStuff FUNCTION');
    var tgt = document.getElementsByClassName('text_body')[0];
    setAttr(tgt, 'style', 'text-align: justify;');
}


//=======================================================================================================
// Showtime !
//=======================================================================================================

try
{
    var rgxQueueView = /\/a\/queue\/$/;
    var rgxReadView = /\/a\/read\/\d{1,10}$/;

    var loc = window.location.href;
    if (loc.match(rgxQueueView))
    {
        //DO NOTHING (FOR NOW)
        console.log('MATCH ON QUEUE VIEW');
    }
    else if (loc.match(rgxReadView))
    {
        // Sets Pocket reader attributes
        console.log('MATCH ON READ VIEW');
        //document.getElementsByClassName('text_body')[0];
        //console.log(document.getElementsByClassName('text_body')[0]);
        //XBLoad(console.log(document.getElementsByClassName('text_body')[0]));
        //XBLoad(setAttr(document.getElementsByClassName('text_body')[0], 'style', 'alignText: justify;'), verbose=true);
        //setTimeout(function() { setAttr(document.getElementsByClassName('text_body')[0], 'style', 'alignText: justify;') }, 5000); //WORKS
        //XBLoad(doStuff(), true);
        window.onload = doStuff;
    };
}
catch(err)
{
    switch(err.name)
    {
        case 'NotFoundError':
            throw 'Missing element when building the issues list (' + err.message + ')';
        case 'TypeError':
            throw 'Wrong defined type (' + err.message + ')';
        case 'EvalError':
            throw 'Evaluation Error';
        case 'InternalError':
            throw 'Internal Error';
        case 'RangeError':
            throw 'Range Error';
        case 'ReferenceError':
            throw 'Reference Error';
        case 'SyntaxError':
            throw 'Syntax Error';
        case 'TypeError':
            throw 'Type Error';
        case 'URIError':
            throw 'URI Error';
        //default:
        //    throw err;
    };
};
