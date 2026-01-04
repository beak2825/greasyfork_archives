// ==UserScript==
// @name         muahahaha youtube popup
// @namespace    muahahaha
// @version      0.1.1
// @description  popup embed
// @match        https://www.youtube.com/watch?v=*
// @run-at       document-end
// @grant        unsafeWindow
// @license      © 2022
// @downloadURL https://update.greasyfork.org/scripts/453013/muahahaha%20youtube%20popup.user.js
// @updateURL https://update.greasyfork.org/scripts/453013/muahahaha%20youtube%20popup.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function muahahaha_youtube_popup() {
        var sel_tit = 'h1.style-scope.ytd-watch-metadata';

        if (typeof(unsafeWindow.$) === 'function' && unsafeWindow.$(sel_tit).length) {
            console.log('muahahaha_youtube_popup run');

            unsafeWindow.$(sel_tit)
                .prepend('<button type="button">[↗]</button>')
                .click( function () { open(unsafeWindow.$('meta[property="og:video:secure_url"]').prop('content'), null, 'popup'); } )
            ;
        } else {
            console.log('muahahaha_youtube_popup setTimeout');

            setTimeout(muahahaha_youtube_popup, 100);
		}
	}

    muahahaha_youtube_popup();
})();