// ==UserScript==
// @name        mmmturkeybacon Bad Link Fixer
// @author      mmmturkeybacon
// @description Sometimes requesters will leave off the protocol at the beginning of a URL; for example, www.example.com instead of http://www.example.com. This results in bad links that look like https://www.mturkcontent.com/dynamic/www.example.com. This script prepends "http://" to links that don't start with "http" or "/". I'm not sure if it makes sense for any HIT to use relative links. It's possible this script might break valid links. It's best to leave it disabled until you need it.
// @namespace   http://userscripts.org/users/523367
// @match       https://s3.amazonaws.com/mturk_bulk/hits*
// @match       https://www.mturkcontent.com/dynamic/hit?*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @version     1.02
// @grant       GM_log
// @downloadURL https://update.greasyfork.org/scripts/3116/mmmturkeybacon%20Bad%20Link%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/3116/mmmturkeybacon%20Bad%20Link%20Fixer.meta.js
// ==/UserScript==


var $bad_link = $('a:not([href^="http"], [href^="/"], [href^="javascript:"])');
$bad_link.each(function()
{
    $(this).attr('href', 'http://'+$(this).attr('href'));
});
