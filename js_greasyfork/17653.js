// ==UserScript==
// @name         Auto Embed Images/Youtube
// @namespace    NGU_AutoEmbed
// @version      0.1
// @description  This makes all shouts with an image/youtube video in show embedded.
// @author       You
// @match        http://www.nextgenupdate.com/forums/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/17653/Auto%20Embed%20ImagesYoutube.user.js
// @updateURL https://update.greasyfork.org/scripts/17653/Auto%20Embed%20ImagesYoutube.meta.js
// ==/UserScript==

iboxoshouts.update_shouts = function(shouts)
{
    iboxoshouts.shoutframe.innerHTML = '';
    iboxoshouts.shoutframe.innerHTML = shouts;

    if (iboxoshouts.newestbottom && iboxoshouts.shoutframe.scrollTop < iboxoshouts.shoutframe.scrollHeight)
    {
        iboxoshouts.shoutframe.scrollTop = iboxoshouts.shoutframe.scrollHeight;
    }
    shoutBoxCheck();
}

function shoutBoxCheck()
{
    var sb = document.getElementById("shoutbox_frame");
    var sb_msgs = sb.children;
    
    for (var i = 1; i < sb.children.length; i++)
    {
        sbEmbedImage(sb_msgs[i]);
    } 
}

function sbEmbedImage(msgs)
{
    try
    {
        msg = msgs.children[2];
        while (msg.children.length > 0)
        {
            msg = msg.children[0];
        }
        if (msg.tagName == "IMG" || msg.tagName == "A")
            msg = msg.parentElement;
        var thtml = msg.innerHTML;
        var resp = thtml.match('(.*)<a href="(.*)\.(jpg|gif|png)" target="_blank">(.*)</a>(.*)');
        if (resp != null)
        {
            var result = resp[1] + '<img src="' + resp[2] + '.' + resp[3] + '" alt="' + resp[4] + '" style="max-height: 250px;">' + resp[5];
            msg.innerHTML = result;
        }
        
        thtml = msg.innerHTML;
        resp = thtml.match('(.*)<a href\="https\://www\.youtube\.com/watch\\?v\=(.*)" target\="_blank">(.*)</a>(.*)');
        if (resp != null)
        {
            result = resp[1] + '<iframe width="560" height="315" src="https://www.youtube.com/embed/' + resp[2] + '" frameborder="0" allowfullscreen></iframe>' + resp[4];
            msg.innerHTML = result;
        }
    }
    catch (Exception)
    {

    }
}