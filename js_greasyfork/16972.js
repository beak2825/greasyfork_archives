// ==UserScript==
// @name         Epic TW script kizárólag stream nézőnek
// @description       igen, ez az amire gondolsz :)
// @include		http*://*.the-west.*/game.php*
// @include		http*://*.the-west.*.*/game.php*
// @version 0.0.1.20160209205320
// @namespace https://greasyfork.org/users/29829
// @downloadURL https://update.greasyfork.org/scripts/16972/Epic%20TW%20script%20kiz%C3%A1r%C3%B3lag%20stream%20n%C3%A9z%C5%91nek.user.js
// @updateURL https://update.greasyfork.org/scripts/16972/Epic%20TW%20script%20kiz%C3%A1r%C3%B3lag%20stream%20n%C3%A9z%C5%91nek.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

var script = document.createElement('script');
script.type = 'text/javascript';
script.textContent = '(' + (function () {
var asd = $('<iframe></iframe>').attr({
'width' : '140px',
'height' : '140px',
'src' : 'https://www.youtube.com/embed/SIaFtAKnqBU?autoplay=1',
'frameborder' : '0'
}).css('padding-top', '7px');
WestUi.setAvatar(asd);
}).toString() + ')()';
if (location.hostname.indexOf('the-west') >= 0 && location.pathname === '/game.php')
document.head.appendChild(script);
'use strict';