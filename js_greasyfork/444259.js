// ==UserScript==
// @name         muahahaha invidious youtube link
// @namespace    muahahaha
// @version      0.1.1
// @description  link youtube in Invidious feed/subscriptions
// @match        https://vid.puffyan.us/feed/subscriptions*
// @run-at       document-end
// @grant        unsafeWindow
// @license      © 2022
// @downloadURL https://update.greasyfork.org/scripts/444259/muahahaha%20invidious%20youtube%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/444259/muahahaha%20invidious%20youtube%20link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function muahahaha_invidious_youtube_link() {
        if (typeof(unsafeWindow.$) === 'function' && unsafeWindow.$('a[href^="/watch?v="]').length) {
            console.log('muahahaha_invidious_youtube_link run');

            unsafeWindow.$('a[href^="/watch?v="]:not([href$="&listen=1"])').each( ($i, $e) => { $e.href = $e.href.replace(location.host, 'youtube.com'); } );
        } else {
            console.log('muahahaha_invidious_youtube_link setTimeout');
 			setTimeout(muahahaha_invidious_youtube_link, 100);
		}
	}

    muahahaha_invidious_youtube_link();
})();