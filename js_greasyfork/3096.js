// ==UserScript==
// @name        mmmturkeybacon Avatar Switcheroo
// @author      mmmturkeybacon
// @description Add the username and new avatar to the associative array to 
//              replace a user's avatar. Automatically turns users without
//              avatars into robots.
// @namespace   http://userscripts.org/users/523367
// @match       http://www.mturkgrind.com/threads/*
// @match       http://www.mturkgrind.com/showthread.php?*
// @require     http://code.jquery.com/jquery-latest.min.js
// @version     1.65
// @grant       GM_log
// @downloadURL https://update.greasyfork.org/scripts/3096/mmmturkeybacon%20Avatar%20Switcheroo.user.js
// @updateURL https://update.greasyfork.org/scripts/3096/mmmturkeybacon%20Avatar%20Switcheroo.meta.js
// ==/UserScript==

// Set this to true to give all users without an avatar a unique robot avatar.
var AVATARS_FOR_ALL = true;

// Put the username and avatar in userdict to give that user a new avatar whether
// they have one already or not. Use 'robot' in place of an avatar image to
// assign a specific user a robot avatar.
var userdict = {};
userdict['Da_Tax_Man'] = 'http://i.imgur.com/9c1YkKb.jpg';
//userdict['justmerob'] = 'robot';

$(window).load(function()
{
    $('div.userinfo > div.username_container').each(function()
    {
        var username = $(this).find('a[id][title][href^="members/"]').text().trim();
        //var username_URL = $(this).find('a[id][title][href^="members/"]').attr('href');;
        //var username = username_URL.substring(username_URL.indexOf('-')+1);

        if (userdict[username])
        {
            $(this).parent().find('a.postuseravatar').remove();
            if (userdict[username] == 'robot')
            {
                var avatar = 'http://robohash.org/'+username+'png?size=100x100';
                $(this).parent().find('hr').before('<a class="postuseravatar"><img src="'+avatar+'"></a>');
            }
            else
            {
                $(this).parent().find('hr').before('<a class="postuseravatar"><img src="'+userdict[username]+'"></a>');
            }
        }
        else if (AVATARS_FOR_ALL && $(this).parent().find('a.postuseravatar').length == 0)
        { // username is not in userdict and user doesn't have an avatar
            var avatar = 'http://robohash.org/'+username+'png?size=100x100';
            $(this).parent().find('hr').before('<a class="postuseravatar"><img src="'+avatar+'"></a>');
        }
    });
});
