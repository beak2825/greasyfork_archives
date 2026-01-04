// ==UserScript==
// @name        Escapist webcomics viewer
// @namespace   None
// @description Allows navigation to next picture (chronologically) on The Escapist webcomics
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js
// @include     /^http://www\.escapistmagazine\.com/articles/view/comicsandcosplay/comics/.*/.*$/
// @grant       none
// @author      iceman94
// @version     0.01
// @copyright   2015+, iceman94
// @downloadURL https://update.greasyfork.org/scripts/32201/Escapist%20webcomics%20viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/32201/Escapist%20webcomics%20viewer.meta.js
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
function locateTgt (tgtType, tgtVal, tgtCSS, tgtIdx)
{
    tgtType = tgtType || 'id';
    tgtVal = tgtVal;
    tgtCSS = tgtCSS || '';
    tgtIdx = tgtIdx || '';

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

    if (tgtCSS !== '')
    {
        setAttr(tgt, 'style', tgtCSS);
    };
    return tgt;
};

// Locates main picture (i.e. comic picture) in a collection of images based on its 'src' attribute
function locatePic (rgx)
{
    var imgColl = document.getElementsByTagName('img');
    for(var i=0; i<imgColl.length; i++)
    {
        if(imgColl[i] && imgColl[i].src.match(rgx) && imgColl[i].height > 120)
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
// Allows navigation to next picture as specified by the 'Next' node 
// on any comic page just by clicking on the main picture
//=======================================================================================================

function showtime ()
{
    //Arrow pointer converted to base64
    //Src : https://openclipart.org/image/36px/svg_to_png/191324/cyberscooty-fleche-verte.png
    var picB64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAYCAMAAAClZq98AAAACXBIWXMAAAsTAAALEwEAmpwYAAABI1BMVEUAAAAzgAA5cQA2eQA1dQszego5cQk3dgk1cgk3dQc1ggY9egY7gQQ/gQQ8gwQ9gQRAhgdAhQY7gQg/hghCjQU+hQdAiAdBhglAiQhBighDjAlCigdBighBiwhBiQdBiwdBjAdCjAdDjAdAhwdBiwhCiwZCiAdCiQdBiQdDjgdHlAhJlwhJlwlHlghHlghHlghLnghMoQhFkQhMoAlRpgpPpglPqAlVqxBcshdSrwlXuApXuApjvxdvxStavwpexgttziCE1kFhzAthzQtk0wxm1wxn2Qxo2wxv3RZx3Rtz2iCB4TSC2D+I4EGM202O5EqQ5EyQ5U2T3VmV5FWX5lia512b32We6GOe6GSf6GWg6Gav7H6+8Je/8JjJ8qjO87D////03ckAAAAAQ3RSTlMAChITGBkbHB0lKy5BQURHTFhfYWVvb3Z7hZWbpKmtra2tr7PDyM7S1NnZ2trb3ODg4OHh4+Xl5ufr8PHz9fb7/P3+7RRtNQAAAAFiS0dEYMW3fBAAAADESURBVCjPjdPVDgIxEEDR4u7u7u6ui7u7/P9fsMACISk73LdJTtKknSKESyVEcI6YHEb2UV4PItvmWrFAyLq4Xho+3ntm8TG5JufzaRmWvZAnhCkxPpKtczoKRbb7V7tP+8O9VdlModn8d9O6l/1AQ9oGQfEd9enrpTUk6kIVjX+gjBpEnagEPK7p5yAIVZ3Pe6IzBQP1LBFMqfbDxBXUszC5mFwESVoBEf2qkKjmZiAIlUzg0hFZLbi+1qQU/ghKwdd4A8oUdYndVNudAAAAAElFTkSuQmCC';
    
    // Creates hidden node w/ mouse cursor picture converted from base64 to remove external dependencies
    var hiddenDiv = base64ToImage(picB64);
    
    // Regex to match main picture node 'src'
    var rgx = /^.*\/media\/global\/images\/library\/.*(jpg|png|gif)$/;
    
    // Locates 'Next' node
    var next = locateTgt('class', 'folder_nav_next', null, '0');
    // Locates main picture node
    var pic = locatePic(rgx);
    
    if (next && next.href && pic && pic.src && pic.src.match(rgx))
    {
        pic.style.cursor = "url('" + hiddenDiv.src + "'), auto";
        pic.setAttribute('onclick', "javascript:window.location='" + next.href + "';");
        
        // Makes sure there is no event or link for parent node
        if (pic.parentNode && pic.parentNode.onclick)
        {
            pic.parentNode.removeAttribute('onclick');
        };
        if (pic.parentNode && pic.parentNode.href)
        {
            pic.parentNode.removeAttribute('href');
        };
    };
};


//=======================================================================================================
// Showtime !
//=======================================================================================================

XBLoad(showtime);