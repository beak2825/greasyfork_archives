// ==UserScript==
// @name         YouTube Premium Logo
// @namespace    https://github.com/eCxb3/cps
// @version      2077v.2.0.1
// @description  Changes the youtube logo to premium.
// @author       ezX 「CYBERPSYCHOOOOOS」
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/455504/YouTube%20Premium%20Logo.user.js
// @updateURL https://update.greasyfork.org/scripts/455504/YouTube%20Premium%20Logo.meta.js
// ==/UserScript==

/*
_________        ___.                                     __
\_   ___ \___.__.\_ |__   _________________  __ __  ____ |  | __
/    \  \<   |  | | __ \_/ __ \_  __ \____ \|  |  \/    \|  |/ /
\     \___\___  | | \_\ \  ___/|  | \/  |_> >  |  /   |  \    <
 \______  / ____| |___  /\___  >__|  |   __/|____/|___|  /__|_ \
        \/\/          \/     \/      |__|              \/     \/
                                             _________ __
                                            /   _____//  |_  ____   ___________  ______
                                            \_____  \\   __\/ __ \_/ __ \_  __ \/  ___/
                                            /        \|  | \  ___/\  ___/|  | \/\___ \
                                           /_______  /|__|  \___  >\___  >__|  /____  >
                                                   \/           \/     \/           \/
*/

(function() {
    'use strict';
    const $ = jQuery.noConflict(true);

    let logo = $('#logo-icon').empty();
    let imglogo = document.createElement('img');

    if ($('html').is('[dark]')) {
        $(logo).append($('<img>', {src: 'https://i.imgur.com/m3TlTOK.png', style: 'width: 94px'}));
    } else {
        $(logo).append($('<img>', {src: 'https://i.imgur.com/k3guVls.png', style: 'width: 94px'}));
    }
})();
