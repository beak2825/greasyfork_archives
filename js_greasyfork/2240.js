// ==UserScript==
// @name           Facebook Mobile Timeline Cleaner
// @namespace      https://github.com/wassname/fbmtimelinecleaner
// @description    Facebook Mobile Timeline Cleaner is an activity log scrubber that lets you take back control of your Facebook Timeline! It deletes your facebook comments/posts/likes etc in bulk. 
// @include        https://*m.facebook.com/*/allactivity*
// @require        http://code.jquery.com/jquery-1.8.3.min.js
// @grant GM_xmlhttpRequest
// @grant GM_getValue
// @grant GM_setValue
// @version	0.40
// @downloadURL https://update.greasyfork.org/scripts/2240/Facebook%20Mobile%20Timeline%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/2240/Facebook%20Mobile%20Timeline%20Cleaner.meta.js
// ==/UserScript==
/* Changelog:

0.10 (2014.06.9) 
First release.

Description:
Facebook Mobile Timeline Cleaner. Take back control of your Facebook Timeline with this activity log scrubber! This script deletes your facebook comments/posts/likes etc. 
This works on  https://m.facebook.com/<yourname>/allactivity and bulk deletes, hides, or unlikes
content to clean up your facebook. To use it, install greasemonkey on firefox or tampermonkey on
chrome. Then navigate to your activity log page (profile -> "View activity log"). If the script
is working it will add a new button call Open All Time, just after "Friends". Click this and many
tabs will open and begin deleting, hiding, and unliking.

Inspired by:
Facebook Timeline Cleaner: http://userscripts-mirror.org/scripts/show/151426, https://github.com/oneduality/fbtimelinecleaner
Absterge: http://userscripts-mirror.org/scripts/show/122073
Perl script; http://rmonteux.wordpress.com/2011/01/05/how-to-delete-all-your-facebook-wall-posts-as-required-by-facebook-prior-to-deletingdeactivating-your-account/
https://gist.github.com/pssdbt/941770
fb_delete.js: https://gist.github.com/ryancastro/9218749
ActLogPubLikes.js: https://gist.github.com/OllieTerrance/c5078439a255e61a0bf2

TODO
Make openall work on all years, not just all months
Sometimes the script freezes and needs to be rerun, fix this
*/

unsafeWindow.console.log(console.log);


window.addEventListener('load', function()  {

    function openAll() 
    {
        //a function to open all months
        var links = document.getElementsByClassName('aps')
        for (var i = 0; i < links.length; ++i) 
        {
            //expand all times by opening in new windows
            var link=links[i].children[0];
            if (link.parentNode.id.contains("month"||"year"))
            {
                link.setAttribute('target',"_blank") // this will make it open in a new tab
                link.click()
            }
        }

    }


    function addButton()
    {
        //Adds a button which allows the user to open all timespans on the facebook activitylog
        var element = document.createElement("button");
        element.setAttribute("type", "button");
        element.setAttribute("href", "#");
        element.textContent="Open all Times";
        element.id="openAll";
        var headers = document.getElementsByClassName('inv');
        headers[headers.length-1].parentNode.appendChild(element);
        element.addEventListener('click', openAll);

    }
    addButton();

    function deleteIt() {
        //The main function which hides, deleteds, and unlikes content
        var links = document.getElementsByClassName('sec')
        if (links.length==0)
        {

        }
        for (var i = 0; i < links.length; ++i) 
        {
            if (links[i].innerHTML=="Hide from Timeline")
            {
                links[i].click();
                console.log("Hide");
            }
            else if (links[i].innerHTML=="Delete")
            {
                links[i].click();
                console.log("Delete");
            }
            else if (links[i].innerHTML=="Unlike")
            {
                links[i].click();
                console.log("Unlike");
            }

        }
    };
    
    // wait for jQuery to load up.
    setTimeout(deleteIt, 100);
});