// ==UserScript==
// @name           XTube Hide Sponsor Videos
// @description    Hides all videos from the users "xtubehouse", xtube_sponsor, xxxvids
// @author         xtubetrix
// @include        http://www.xtube.com/search*
// @require        //cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @run-at document-end
// @version 0.0.1.20151223084959
// @namespace https://greasyfork.org/users/4819
// @downloadURL https://update.greasyfork.org/scripts/15450/XTube%20Hide%20Sponsor%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/15450/XTube%20Hide%20Sponsor%20Videos.meta.js
// ==/UserScript==


$("a[href*='/community/profile.php?user=xtube_sponsor']").parent().parent().hide();
$("a[href*='/community/profile.php?user=xtubehouse']").parent().parent().hide();
$("a[href*='/community/profile.php?user=xxxvids']").parent().parent().hide();