// ==UserScript==
// @name           	DotDReloader 
// @description         Reloads game or chat individually. Requires Mutik to be installed first.
// @namespace      	tag://kongregate
// @author         	Anarcho
// @version        	1.1.50
// @grant          	GM_xmlhttpRequest
// @grant          	GM_setValue
// @grant          	GM_getValue
// @grant          	unsafeWindow
// @include        	http://www.kongregate.com/games/5thPlanetGames/dawn-of-the-dragons*
// @include        	*50.18.191.15/kong/?DO_NOT_SHARE_THIS_LINK*
// @hompage        	http://www.dotdraids.pl
// @downloadURL https://update.greasyfork.org/scripts/12691/DotDReloader.user.js
// @updateURL https://update.greasyfork.org/scripts/12691/DotDReloader.meta.js
// ==/UserScript==

if (window.location.host == "www.kongregate.com") {
    function main() {
        window.DotDReloader = {
            gui: {
                load: function() {
        console.log('[DotDReloader] Initializing GUI ' + window.SRDotDX);
                    if ($("hideWCtxt") !== null) {
                        window.SRDotDX.c('li').set({
                            class: 'rate'
                        }).html('<a class="spritegame" href="#" onclick="DotDReloader.reloadChat(); return false;">Reload Chat</a>', false).attach('after', 'quicklinks_favorite_block');
                        window.SRDotDX.c('li').set({
                            class: 'rate'
                        }).html('<a class="spritegame" href="#" onclick="DotDReloader.reloadGame(); return false;">Reload Main</a>', false).attach('after', 'quicklinks_favorite_block');
                    } else {
                        setTimeout(DotDReloader.gui.load, 500)
                    }
                },
            },
            reloadChat: function() {
                window.SRDotDX.util.extEcho('Reloading Chat, please wait...');
                window.SRDotDX.gframe('DotDReloader.chat#');
            },
            reloadGame: function() {
                window.SRDotDX.util.extEcho('Reloading Game, please wait...');
                window.SRDotDX.gframe('DotDReloader.game#');
            },
            fails: 0,
            load: function() {
        console.log('[DotDReloader] Waiting for mutik ' + window.SRDotDX + " " + window.DotDReloader);
                if (window.SRDotDX !== undefined) {
                    DotDReloader.gui.load();
                    setTimeout(function() {
                        delete DotDReloader.load
                    }, 100);
                } else if (++DotDReloader.fails < 20) {
                    console.log('[DotDReloader] Missing needed Kong resources (try:' + DotDReloader.fails + '), retrying in 0.75 second...');
                    setTimeout(DotDReloader.load, 750);
                } else {
                    console.log('[DotDReloader] Unable to locate required Kong resources. Loading aborted');
                    setTimeout(function() {
                        delete DotDReloader
                    }, 1);
                }
            }
        };
        console.log('[DotDReloader] Loading ' + window.DotDReloader);
        DotDReloader.load();
    }

    console.log('[DotDReloader] Injecting in main');
    scr = document.createElement('script');
    scr.appendChild(document.createTextNode('(' + main + ')()'));
    document.head.appendChild(scr);
} else if (window.location.host === '50.18.191.15') {
    window.onmessage = function(e) {
        var c = e.data.split('#');
        if (c[0].indexOf('DotDReloader') !== -1) {
            if (c[0].indexOf('chat') !== -1) {
                console.log("[DotDReloader] reloading chat ");
                document.getElementById('chatdiv').parentNode.innerHTML = document.getElementById('chatdiv').parentNode.innerHTML;
            }
            if (c[0].indexOf('game') !== -1) {
                console.log("[DotDReloader] reloading game ");
                document.getElementById('swfdiv').parentNode.innerHTML = document.getElementById('swfdiv').parentNode.innerHTML;
            }
        }
    };
    console.log("[DotDReloader] Injected code into GameFrame");
}