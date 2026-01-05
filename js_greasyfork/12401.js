// ==UserScript==
// @name          iframe killer
// @description   deletes all iframes
// @version       1.0
// @namespace     https://greasyfork.org/en/users/7449-the-ottoman-slap
// @include       *xxxxxxxxxx.com/*
// @exclude       *blogger.com/*
// @exclude       *google.com/*
// @exclude       */clixgrid.php?do=surf&x=*
// @downloadURL https://update.greasyfork.org/scripts/12401/iframe%20killer.user.js
// @updateURL https://update.greasyfork.org/scripts/12401/iframe%20killer.meta.js
// ==/UserScript==



/*==============iframe Killer==============*/

while((el=document.getElementsByTagName('iframe')).length){el[0].parentNode.removeChild(el[0]);}



/*==============Anti Focus=================*/

document.hasFocus = function () {return true;};

