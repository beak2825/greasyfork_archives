// ==UserScript==
// @name        RemoveBigLike
// @namespace   https://greasyfork.org/en/users/15677-tiago
// @include     http://*.facebook.com/*
// @include     https://*.facebook.com/*
// @version     0.1
// @description Remove big like button from the freaking facebook chat
// @match       https://www.facebook.com/*
// @copyright   2015+, tcfaria
// @downloadURL https://update.greasyfork.org/scripts/12475/RemoveBigLike.user.js
// @updateURL https://update.greasyfork.org/scripts/12475/RemoveBigLike.meta.js
// ==/UserScript==

window.setInterval(function(){  
    [].forEach.call(document.getElementsByClassName('_5g2o'), function(e) { e.style.display = "none"; });
}, 333);