// ==UserScript==
// @name        Youtube comments remover and description expander
// @description Removes comments section from Youtube video pages and auto expand description section
// @include     /^http(|s)://www\.youtube\.com/watch\?v=.*$/
// @grant       none
// @author      iceman94
// @copyright   2015+, iceman94
// @version     0.01
// @grant       none
// @namespace   38a3e9648fc5260c75446e376a8dabb3
// @downloadURL https://update.greasyfork.org/scripts/32199/Youtube%20comments%20remover%20and%20description%20expander.user.js
// @updateURL https://update.greasyfork.org/scripts/32199/Youtube%20comments%20remover%20and%20description%20expander.meta.js
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

// Searches for string in a given array and returns an object comprised of an index and its content
function searchStringInArray (str, arr)
{
    var obj = {};
    for (var i=0; i<arr.length; i++)
    {
        if (arr[i].match(str))
        {
            obj.idx = i;
            obj.content = arr[i];
            return obj;
        }
    }
    return -1;
}

// Deletes a DOM node based of its type (id, tag or class)
function delElement (elmt_type, elmt_name)
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

// Deletes index from a given array by value
function delIdxFromArrayByValue (str, arr)
{
    if (searchStringInArray(str, arr))
    {
        arr.splice(searchStringInArray(str, arr).idx, 1);
    }
}

// Wrapper comprised of all functions to be called by the GM/TM script
function showtime ()
{
    delElement('id', 'watch-discussion');
    
    var dscNode = document.getElementById('action-panel-details');
    var dscClassesArr = dscNode.className.split(' ');
    delIdxFromArrayByValue('yt-uix-expander-collapsed', dscClassesArr);
    dscNode.className = dscClassesArr.join(' ');
}


//=======================================================================================================
// Showtime !
//=======================================================================================================

XBLoad(showtime());