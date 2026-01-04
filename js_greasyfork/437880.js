// ==UserScript==
// @name         muahahaha youtube (mig 2 Invidious)
// @namespace    muahahaha
// @version      0.1.2
// @description  enlace a Invidious en los canales de youtube
// @include      https://www.youtube.com/c/*
// @include      https://www.youtube.com/channel/*
// @include      https://www.youtube.com/user/*
// @include      https://www.youtube.com/feed/channels
// @run-at       document-end
// @grant        unsafeWindow
// @license      © 2022
// @downloadURL https://update.greasyfork.org/scripts/437880/muahahaha%20youtube%20%28mig%202%20Invidious%29.user.js
// @updateURL https://update.greasyfork.org/scripts/437880/muahahaha%20youtube%20%28mig%202%20Invidious%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function muahahaha_yt2inv() {
        if (typeof(unsafeWindow.$) === 'function' && typeof(unsafeWindow.ytCommand.browseEndpoint.browseId) === 'string') {
            var $ = unsafeWindow.$;

            if (unsafeWindow.location.pathname === '/feed/channels') {
                $('#grid-container').before('<div id="jmdz-contador-suscripciones" style="text-align:center;color:white">' + $('ytd-subscribe-button-renderer').length + '</div>');
            } else {
                let container = '#primary-links';

                if (unsafeWindow.$(container).length) {
                    let url_web = 'https://vid.puffyan.us/channel/' + unsafeWindow.ytCommand.browseEndpoint.browseId;

                    let url_img = 'https://vid.puffyan.us/favicon-16x16.png';

                    $(container).prepend(''
                        + '<a'
                            + ' class="yt-simple-endpoint container style-scope ytd-c4-tabbed-header-renderer"'
                            + ' style="padding-right: 0px;"'
                            + ' title="Invidious"'
                            + ' href="' + url_web + '"'
                        + '>'
                            + '<div'
                                + ' class="icon-container style-scope ytd-c4-tabbed-header-renderer"'
                            + '>'
                                + '<img'
                                    + ' class="style-scope yt-img-shadow"'
                                    + ' width="16"'
                                    + ' height="16"'
                                    + ' src="' + url_img + '"'
                                + '/>'
                            + '</div>'
                        + '</a>'
                    );

                    console.log('muahahaha_yt2inv');
                } else {
                    setTimeout(muahahaha_yt2inv, 100);
                }
            }
        } else {
            setTimeout(muahahaha_yt2inv, 100);
        }
    }

    muahahaha_yt2inv();
})();