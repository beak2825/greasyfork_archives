// ==UserScript==
// @version 7.8.7
// @icon https://js.obot.it/images/logo.png
// @name oBot
// @namespace https://obot.it
// @description OGame: Miglioramento giocabilità  con funzioni automatiche e di controllo
// @author info@tryus.it
// @creator Tryus
// @copyright 2020, Tryus
// @license 0BSD
// @grant unsafeWindow
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_deleteValue
// @grant GM_xmlhttpRequest
// @grant GM_getResourceURL
// @include *://*.ogame.gameforge.com*
// @connect obot.it
// @connect api.telegram.org

// @downloadURL https://update.greasyfork.org/scripts/390838/oBot.user.js
// @updateURL https://update.greasyfork.org/scripts/390838/oBot.meta.js
// ==/UserScript==
(function() {
    unsafeWindow.debugoBot = false;
    function b() {
        let a = {
            'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
        };
        let url = unsafeWindow.libsPathDomain + '/compress.php?v=' + unsafeWindow.versionSBI;
        if (unsafeWindow.debugoBot) url += "&debugger=true";
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            ignoreCache: unsafeWindow.debugoBot,
            headers: a,
            onload: function(b) {
                if (b.responseText.indexOf('<head>') !== -1) {
                    unsafeWindow.erroroBot || (unsafeWindow.erroroBot = !0, alert('This version is not supported, please update the bot by downloading it from the site: ' + unsafeWindow.pathDomain));
                } else {
                    c(b.responseText);
                }
            },
            onerror: function(a) {
                a && a.error && a.error.indexOf('404') !== -1 && !unsafeWindow.sendErrorMessage && (unsafeWindow.sendErrorMessage = 1, alert('This version is not supported, please update the bot by downloading it from the site: ' + unsafeWindow.pathDomain))
            }
        })
    }
    function c(text){
        let a = document.createElement('script');
        a.innerHTML = text;
        if(!unsafeWindow.debugoBot) GM_setValue('OBOT_SAVE', text);
        document.body.appendChild(a);
    }
    if (location.href.indexOf('api') === -1 && location.href.indexOf('ajax=1') === -1 && location.href.indexOf('board') === -1 && location.href.indexOf('allianceInfo') === -1) {
        unsafeWindow.debugoBot = unsafeWindow.debugoBot || sessionStorage.getItem('oBot_debug_clean') ? true : unsafeWindow.debugoBot;
        sessionStorage.removeItem('oBot_debug_clean');
        unsafeWindow.TOKEN_USER = GM_getValue('TOKEN_USER', null);
        unsafeWindow.pathDomain = 'https://obot.it';
        unsafeWindow.libsPathDomain = 'https://js.obot.it';
        unsafeWindow.webservicePath = 'https://ws.obot.it';
        unsafeWindow.versionSBI = GM_info.script.version;
        unsafeWindow.GM_xmlhttpRequest = GM_xmlhttpRequest;
        unsafeWindow.GM_deleteValue = GM_deleteValue;
        unsafeWindow.GM_setValue = GM_setValue;
        unsafeWindow.GM_getValue = GM_getValue;
        let botSave = GM_getValue('OBOT_SAVE',null);
        if(unsafeWindow.debugoBot || null === botSave || "undefined" === botSave) b();
        else c(botSave);
        if (typeof $ !== undefined && window.player && window.player.hasCommander) {
            $('#mmonetbar,#banner_skyscraper,#promotionCountdownBox').hide();
        }
        if (!unsafeWindow.debugoBot) {
            setTimeout(function() {
                if (!unsafeWindow.obotLoaded && unsafeWindow.sendErrorMessage !== 1) location.reload();
                else console.log("obotLoaded controlpass");
            }, 1000 * 60 * 5); //5 m
        }
    }

}());