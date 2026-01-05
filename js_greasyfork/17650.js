// ==UserScript==
// @name         Shoutbox Notifications
// @namespace    NGU_ShowNotifications
// @version      0.1
// @description  Show a notification whenever your name is mentioned in the shoutbox.
// @author       You
// @match        http://www.nextgenupdate.com/forums/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/17650/Shoutbox%20Notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/17650/Shoutbox%20Notifications.meta.js
// ==/UserScript==

var myUsername = document.getElementsByClassName("userinfo-carat")[0].children[0].innerText;
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
    var lowerHTML = sb_msgs[1].innerHTML.toLowerCase();
    var username = [ myUsername.toLowerCase() ];
    if (username[0].indexOf(" ") > -1)//Name with space(s)
        username = username[0].split(" ");
    for (var i = 0; i < username.length; i++)
    {
        if (sbMentionCheck(sb_msgs, lowerHTML, username[i]))
            break;
    }   
}
function sbMentionCheck(sb_msgs, lowerHTML, username)
{
    
    if (lowerHTML.indexOf(username) > -1)
    {
        var user = sb_msgs[1].children[1].children[0].innerText;
        if (user != myUsername)
        {
            show_notification(user, "Mentioned your name in the shoutbox.", "http://www.nextgenupdate.com/favicon.ico", "");
            alert_audio.play();
            return true;
        }
    }
    return false;
}