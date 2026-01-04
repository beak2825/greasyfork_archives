// ==UserScript==
// @name        StormyPo Show Only HIT Posts
// @version     1.17
// @description Show only posts that contain links to mturk.
// @author      StormyPo
// @namespace   http://userscripts.org/users/523367
// @match       http://mturkgrind.com/threads/*
// @match       http://www.mturkgrind.com/threads/*
// @match       http://mturkgrind.com/showthread.php?*
// @match       http://www.mturkgrind.com/showthread.php?*
// @match       http://mturkforum.com/showthread.php?*
// @match       http://www.mturkforum.com/showthread.php?*
// @match       http://turkernation.com/showthread.php?*
// @match       http://www.turkernation.com/showthread.php?*
// @match       http://mturkcrowd.com/threads/*
// @match       http://www.mturkcrowd.com/threads/*
// @match       http://mturkcrowd.com/showthread.php?*
// @match       http://www.mturkcrowd.com/showthread.php?*
// @match       https://turkerhub.com/showthread.php?*
// @match       https://turkerhub.com/threads/*
// @exclude     http://mturkgrind.com/threads/*#post*
// @exclude     http://www.mturkgrind.com/threads/*#post*
// @exclude     http://mturkgrind.com/showthread.php?*post*
// @exclude     http://www.mturkgrind.com/showthread.php?*post*
// @exclude     http://mturkforum.com/showthread.php?*post*
// @exclude     http://www.mturkforum.com/showthread.php?*post*
// @exclude     http://turkernation.com/showthread.php?*post*
// @exclude     http://www.turkernation.com/showthread.php?*post*
// @exclude     http://mturkcrowd.com/threads/*#post*
// @exclude     http://www.mturkcrowd.com/threads/*#post*
// @exclude     http://mturkcrowd.com/showthread.php?*post*
// @exclude     http://www.mturkcrowd.com/showthread.php?*post*
// @exclude     https://turkerhub.com/showthread.php?*post*
// @exclude     https://turkerhub.com/threads/*#post*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/32806/StormyPo%20Show%20Only%20HIT%20Posts.user.js
// @updateURL https://update.greasyfork.org/scripts/32806/StormyPo%20Show%20Only%20HIT%20Posts.meta.js
// ==/UserScript==


$(document).ready(function()
{
    function show_only_hits()
    {
        $('li[id^="post_"], li[id^="post-"]').not('li[id^="post_thanks_box_"], li[id^="likes-post"], li[id^="ln_thanks_box"]').each(function()
        {
            if ($(this).find('a[href^="https://www.mturk.com/mturk/preview"]').length == 0)
            {
                var $this = $(this);
                $this.hide();
                $this.attr('hidden_post', 'true');
                var $thanks = $this.next('li[id^="post_thanks_box_"], li[id^="likes-post"][style!="display:none"], li[id^="ln_thanks_box"][style!="display:none"]');
                $thanks.hide();
                $thanks.attr('hidden_post', 'true');
            }
        });
    }

    function toggle_hidden()
    {
        if (toggle_button.textContent == 'Show Only HITs')
        {
            toggle_button.textContent = 'Show All Posts';
            GM_setValue('toggle_button.textContent', 'Show All Posts');

            show_only_hits();
        }
        else if(toggle_button.textContent == 'Show All Posts')
        {
            toggle_button.textContent = 'Show Only HITs';
            GM_setValue('toggle_button.textContent', 'Show Only HITs');

            $('li[id^="post_"], li[id^="post-"][hidden_post="true"]').not('li[id^="post_thanks_box_"], li[id^="likes-post"], li[id^="ln_thanks_box"]').each(function()
            {
                var $this = $(this);
                $this.show();
                $this.next('li[id^="post_thanks_box_"], li[id^="likes-post"][hidden_post="true"], li[id^="ln_thanks_box"][hidden_post="true"]').show();
            });

        }
    }

    var top_offset = (document.domain.indexOf('turkernation.com') > -1) ? '150px' : '10px';
    var button_holder = document.createElement('DIV');
    button_holder.style.cssText = 'position: fixed; top: '+top_offset+'; left: 10px; z-index: 1899999; font-size: 15px';
    var toggle_button = document.createElement('BUTTON');
    toggle_button.textContent = GM_getValue('toggle_button.textContent', 'Show Only HITs');
    toggle_button.onclick = function(){toggle_hidden();};
 
    if (toggle_button.textContent == 'Show All Posts')
    {
        show_only_hits();
    }
 
    document.body.insertBefore(button_holder, document.body.firstChild);
    button_holder.appendChild(toggle_button);
});