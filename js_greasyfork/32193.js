// ==UserScript==
// @name        factornewsHelper
// @version     0.3
// @description	Gives options on Factornews website (remove users comments...)
// @include     /^http(|s)://www\.factornews\.com/(actualites|article|preview|test|enbref)/.*\.html$/
// @grant       none
// @author      iceman94
// @copyright   2014+, iceman94
// @namespace 30bffff65b7330aeec839b096aa3d2ab
// @downloadURL https://update.greasyfork.org/scripts/32193/factornewsHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/32193/factornewsHelper.meta.js
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

// Retrieves all comments for a given user
function getComBlocks(user)
{
    var coll = document.getElementsByTagName('div');
    var l = coll.length;
    var resArr = new Array;
    for (var i=0; i<l; i++)
    {
        if(coll[i].className == 'comsItemPseudo' && coll[i].textContent == user)
        {
            resArr.push(coll[i]);
        };
    };

    return resArr;
};

// Replaces all comments by a custom message
function remComBlocks(comBlocks, msg)
{
    var coll = comBlocks;
    var l = coll.length;
    for (var i=0; i<l; i++)
    {
        var tgt = coll[i].parentNode.parentNode.getElementsByClassName('comsItemContent')[0];
        tgt.innerHTML = '<i>' + msg + '</i>';
    };
};

// Wrapper for getComBlocks and remComBlocks for a collection of users
function manageUsers(usersColl, msg)
{
    var l = usersColl.length;
    for (var i=0; i<l; i++)
    {
        remComBlocks(getComBlocks(usersColl[i]), msg);
    };
};

// Displays dialog to add users to ban and, if modifications occurs, reloads the page
function askWhomToBan()
{
    if (localStorage.getItem('usersToBan'))
    {
        var users = window.prompt('Enter comma-separated users to ban:', localStorage.getItem('usersToBan'));
    }
    else
    {
        var users = window.prompt('Enter comma-separated users to ban:', 'user1,user2,user3');
    };
    
    if (users !== null)
    {
        localStorage.setItem('usersToBan', users);
        if (localStorage.getItem('usersToBan'))
        {
            location.reload();
            manageUsers(strToArr(localStorage.getItem('usersToBan')), 'MESSAGE REDACTED');
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

// Adds tag to page to run askWhomToBan
function addTag(tag)
{
    var newTag = document.createElement('a');
    newTag.id = 'banTag';
	newTag.className = 'factorNavBarBtn';
    newTag.textContent = ' ';
    newTag.href = 'javascript:void(0);';
    newTag.onclick = function() { askWhomToBan(); };
    tag.appendChild(newTag);
};


//=======================================================================================================
// Showtime !
//=======================================================================================================

XBLoad(addTag(document.getElementById('userPanel')));
if (localStorage.getItem('usersToBan'))
{
    XBLoad(manageUsers(strToArr(localStorage.getItem('usersToBan')), 'MESSAGE REDACTED'));
};
