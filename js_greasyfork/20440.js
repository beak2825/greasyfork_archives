// ==UserScript==
// @name           RCSLoader
// @description    Autorun RCS on plug.dj
// @author         Radiant Music
// @include	   https://plug.dj/*
// @include        https://*.plug.dj/*
// @exclude        https://plug.dj/_/*
// @exclude        https://plug.dj/@/*
// @exclude        https://plug.dj/ba
// @exclude        https://plug.dj/plot
// @exclude        https://plug.dj/press
// @exclude        https://plug.dj/partners
// @exclude        https://plug.dj/team
// @exclude        https://plug.dj/about
// @exclude        https://plug.dj/jobs
// @exclude        https://plug.dj/purchase
// @exclude        https://plug.dj/subscribe
// @exclude        https://*.plug.dj/_/*
// @exclude        https://*.plug.dj/@/*
// @exclude        https://*.plug.dj/ba
// @exclude        https://*.plug.dj/plot
// @exclude        https://*.plug.dj/press
// @exclude        https://*.plug.dj/partners
// @exclude        https://*.plug.dj/team
// @exclude        https://*.plug.dj/about
// @exclude        https://*.plug.dj/jobs
// @exclude        https://*.plug.dj/purchase
// @exclude        https://*.plug.dj/subscribe

// @version        1.7
// @grant          none
// @namespace https://greasyfork.org/users/48343
// @downloadURL https://update.greasyfork.org/scripts/20440/RCSLoader.user.js
// @updateURL https://update.greasyfork.org/scripts/20440/RCSLoader.meta.js
// ==/UserScript==

(function() {
    
    var loaded = false;

    // Thanks ReAnna for this magic line of code that makes plug.dj load
    window.Intercom = {}, window.amplitude = { __VERSION__: true };
    
    var a = {
        b: function() {
            if (typeof API !== 'undefined' && API.enabled) {
            	this.c();
            }
            else if (!loaded) {
                setTimeout(function() { a.b(); }, 1000);
            }
        },
        c: function() {
            loaded = true;
            console.log('[RCS] AutoLoad enabled!');
            API.chatLog('RCS AutoLoad enabled!');
            $.getScript('https://code.radiant.dj/rcs.min.js');
        }
    };
    a.b();
})();