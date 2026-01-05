// ==UserScript==
// @name        KAT - Media Number
// @namespace   MediaNumber
// @version     1.04
// @match http://nowimplemented.com
// @description Adds the number of summaries waiting to be checked next to the 'Media' link
// @downloadURL https://update.greasyfork.org/scripts/11225/KAT%20-%20Media%20Number.user.js
// @updateURL https://update.greasyfork.org/scripts/11225/KAT%20-%20Media%20Number.meta.js
// ==/UserScript==

$.get( "https://kat.cr/moderator/media/?ajax=1" ).success(function( data ) 
{
    var html = data.html;
    var count = (html.match(/id="summary/g) || []).length;
    if (count > 0)
    {
        var lastPage = (html.match(/(bigButton|active)">\d+<\/a>/g) || []).length;
        if (lastPage == 0) 
        {
            $('li a[href="/moderator/media/"]').append('<i class="menuValue" style="margin-left:4px">' + count + '</i>');
            console.log("Found " + count + " summaries waiting to be checked");
        }
        else 
        { 
            $.get( "https://kat.cr/moderator/media/?page=" + lastPage + "&ajax=1" ).success(function( data ) 
            {
                var html = data.html;
                var newCount = (html.match(/id="summary/g) || []).length;
                newCount = ((lastPage - 1) * 25 + newCount);
                $('li a[href="/moderator/media/"]').append('<i class="menuValue" style="margin-left:4px">' + newCount + '</i>');
                console.log("Found " + newCount + " summaries waiting to be checked");
            }).error(function(){
                console.log('Could not get media page');    
            });
        }

    }    
}).error(function(){
    console.log('Could not get media page');    
});