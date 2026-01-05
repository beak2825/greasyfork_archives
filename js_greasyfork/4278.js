// ==UserScript==
// @name        KAT - Shorten Achievement Names
// @namespace   ShortenAcv
// @version     1.03
// @description Shortens the names of the achievements into acronyms
// @match     http://kat.cr/user/*
// @match     https://kat.cr/user/*
// @downloadURL https://update.greasyfork.org/scripts/4278/KAT%20-%20Shorten%20Achievement%20Names.user.js
// @updateURL https://update.greasyfork.org/scripts/4278/KAT%20-%20Shorten%20Achievement%20Names.meta.js
// ==/UserScript==

// Available modes:
// 0 - Shorten and show (Default)
// 1 - Shorten, but hide automatically (Toggle can be used to show them)
// 2 - Do not shorten, just hide

var mode = 0;

if (mode != 2)
{
$('a[href^="/achievements/"][href!="/achievements/"]').each(function(){ 
    var temp = $(this).text().replace("-", " ");
    var arr = temp.split(" ");
    var result = "";
    for (var x=0; x<arr.length; x++)
    if (/201\d/.test(arr[x]))
    {
        result+="'1" + arr[x].substring(3) + ' ';     
    }
        else if (/^\d+$/.test(arr[x]))
    {
        result+= arr[x];
    }
    else
    {
        result+=arr[x].substring(0,1).toUpperCase();
        if (arr.length == 1) { result+=arr[x].substring(1,2).toLowerCase(); }
    } 
    $(this).text(result.substring(0, result.length));
});
}

$("h2:contains('User Achievements')").append('<a onclick="$(\'.achTable > tbody\').toggle();return false;" title="toggle achievements" class="smallButton siteButton" style="margin-left:10px;"><span>toggle achievements</span></a>');

if (mode != 0) 
{
	$('.achTable > tbody').hide();    
}