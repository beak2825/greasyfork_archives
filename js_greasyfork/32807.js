// ==UserScript==
// @name        StormyPo Remove Embedded Video
// @version     1.16
// @author      StormyPo
// @description Removes embedded videos from mturk forums and replaces them with links to the videos.
// @namespace   http://userscripts.org/users/523367
// @match       http://mturkforum.com/showthread.php?*
// @match       http://www.mturkgrind.com/showthread.php?*
// @match       http://www.mturkgrind.com/threads/*
// @match       http://mturkgrind.com/threads/*
// @match       http://mturkcrowd.com/threads/*
// @match       http://www.mturkcrowd.com/threads/*
// @match       http://www.mturkcrowd.com/showthread.php?*
// @match       http://turkernation.com/showthread.php?*
// @match       https://turkerhub.com/threads/*
// @match       https://turkerhub.com/showthread.php?*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant       GM_log
// @downloadURL https://update.greasyfork.org/scripts/32807/StormyPo%20Remove%20Embedded%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/32807/StormyPo%20Remove%20Embedded%20Video.meta.js
// ==/UserScript==

$(document).ready(function()
{
    var $vid_embed = $('iframe[src^="//www.youtube.com"],iframe[src*="gifv"]');
    $vid_embed.each(function()
    {
        var $this = $(this);
        var vid_url = $this.attr('src');
        $this.after('<br><a href="'+vid_url+'" target="_blank"><b>Video removed by Remove Embedded Video. Click to view in a new tab.</b></a>');
        $this.remove();
    });
});