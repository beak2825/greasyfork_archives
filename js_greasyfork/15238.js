// ==UserScript==
// @name        CH Jared
// @author      clickhappier
// @namespace   clickhappier
// @description Resize Jet/Jared/Nova 'Categorize a product.' images.
// @version     1.0c
// @include     https://www.mturkcontent.com/dynamic/hit*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM_log
// @downloadURL https://update.greasyfork.org/scripts/15238/CH%20Jared.user.js
// @updateURL https://update.greasyfork.org/scripts/15238/CH%20Jared.meta.js
// ==/UserScript==

$('img[src^="https://jetnovaimages.blob.core.windows.net/"]').eq(0).attr('width',200);
$('img[src^="https://jetnovaimages.blob.core.windows.net/"]').eq(0).css('width','200px');
$('img[src^="https://jetnovaimages.blob.core.windows.net/"]').eq(0).css('height','200px');

$('img[src^="https://static.zentail.com/pi/"]').eq(0).attr('width',200);
$('img[src^="https://static.zentail.com/pi/"]').eq(0).css('width','200px');
$('img[src^="https://static.zentail.com/pi/"]').eq(0).css('height','200px');

$('img[src^="http://c0024989.cdn1.cloudfiles.rackspacecloud.com/"]').eq(0).attr('width',200);
$('img[src^="http://c0024989.cdn1.cloudfiles.rackspacecloud.com/"]').eq(0).css('width','200px');
$('img[src^="http://c0024989.cdn1.cloudfiles.rackspacecloud.com/"]').eq(0).css('height','200px');

$('img[src^="https://prodspidermanstorage.blob.core.windows.net/"]').eq(0).attr('width',200);
$('img[src^="https://prodspidermanstorage.blob.core.windows.net/"]').eq(0).css('width','200px');
$('img[src^="https://prodspidermanstorage.blob.core.windows.net/"]').eq(0).css('height','200px');

$('img[src^="http://216.14.116.59/"]').eq(0).attr('width',200);
$('img[src^="http://216.14.116.59/"]').eq(0).css('width','200px');
$('img[src^="http://216.14.116.59/"]').eq(0).css('height','200px');