// ==UserScript==
// @name            Flickr Pinterest: PIN without limitations

// @namespace       https://greasyfork.org/users/8-decembre?sort=updated
// @description     Bypass the nopin meta on Flickr
// @version         1
// @author          decembre
// @icon            http://www.gravatar.com/avatar/317bafeeda69d359e34f813aff940944?r=PG&s=48&default=identicon
// @license         GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @include         https://www.flickr.com*
// @require         http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/4728/Flickr%20Pinterest%3A%20PIN%20without%20limitations.user.js
// @updateURL https://update.greasyfork.org/scripts/4728/Flickr%20Pinterest%3A%20PIN%20without%20limitations.meta.js
// ==/UserScript==

// Use the jQuery contains selector to find content to remove.
 
 $('meta[content="nopin"]').remove();