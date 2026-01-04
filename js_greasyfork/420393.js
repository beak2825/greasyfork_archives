// ==UserScript==
// @name          MagentaTV - Remove Banner
// @description   Entfernt störende Banner im MagentaTV EPG
// @author        TheRealHawk
// @license       MIT
// @namespace     https://greasyfork.org/en/users/18936-therealhawk
// @match         https://web.magentatv.de/*
// @version       1.5
// @require       https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant         GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/420393/MagentaTV%20-%20Remove%20Banner.user.js
// @updateURL https://update.greasyfork.org/scripts/420393/MagentaTV%20-%20Remove%20Banner.meta.js
// ==/UserScript==

// Workaround to get rid of "'$' is not defined" warnings
var $ = window.jQuery;

function waitForEl(selector, callback, maxtries = false, interval = 100) {
    const poller = setInterval(() => {
        const el = $(selector)
        const retry = maxtries === false || maxtries-- > 0
        if (retry && el.length < 1) return
        clearInterval(poller)
        callback(el || null)
    }, interval)
}

function mutationHandler (mutationRecords) {
    mutationRecords.forEach ( function (mutation) {
        var target = $(mutation.target);

        if (target.hasClass('_2DlFY')) {
            target.remove();
        }

        if (target.attr('id') == 'PARAGRAPH-BUTTON-1') {
            target.remove();
        }
    } );
}

var targetNodes = $(':root');
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
var myObserver = new MutationObserver (mutationHandler);
var obsConfig = { childList: true, attributes: true, characterData: true, subtree: true };

targetNodes.each ( function () {
    myObserver.observe (this, obsConfig);
} );

waitForEl ('div[style*="height: 96px"]', function () {
    $('div[style*="height: 96px"]').remove();
}, 10, 500)
