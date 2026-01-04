// ==UserScript==
// @name         Discord (Chrome Dark Theme Fixes)
// @version      1.1
// @description  Chrome dark theme messes up the new message indicator color.  Make it orange instead! Also added some fixes like moving search pagination to top of the search (where it should be).
// @author       Threeskimo
// @match        https://discord.com/*
// @icon         https://www.freepnglogos.com/uploads/discord-logo-png/discord-logo-logodownload-download-logotipos-1.png
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      MIT
// @namespace https://greasyfork.org/users/695986
// @downloadURL https://update.greasyfork.org/scripts/447929/Discord%20%28Chrome%20Dark%20Theme%20Fixes%29.user.js
// @updateURL https://update.greasyfork.org/scripts/447929/Discord%20%28Chrome%20Dark%20Theme%20Fixes%29.meta.js
// ==/UserScript==

var $app = false;

var dostuff = function() {
    //Assign orange indicator (and orange channel names) for new messages
    $('[class^=item-2LIpTv]').css({"background-color": "orange", 'color': 'white'});
    $('[class^=unread-]').css({"background-color": "orange", 'color': 'white'});
    //$('[class^=unread-] + div > a > [class^=name] > [class^=channelName]').css('color', 'orange');

    //Move Search pagination to top of search
    $('[class^=pageControl-]').prependTo('[class*=thin-]:eq(1)');
    $('[class^=pageControl-]:not(:last)').remove();

};

setInterval(dostuff, 1000); // call every 1000 milliseconds