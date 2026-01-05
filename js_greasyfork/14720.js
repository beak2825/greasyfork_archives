// ==UserScript==
// @name         It's Not Important
// @namespace    lainscripts_it_is_not_important
// @version      1.5
// @description  At least part of the world will became a bit less important now.
// @author       lainverse
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/14720/It%27s%20Not%20Important.user.js
// @updateURL https://update.greasyfork.org/scripts/14720/It%27s%20Not%20Important.meta.js
// ==/UserScript==
/* jshint esnext: true */

(function(){
    'use strict';

    var imptt = /((display|(margin|padding)(-top|-bottom)?)\s*:[^;!]*)!\s*important/ig,
        rplsf = function(str,grp){return grp;};

    function unimportanter(el, si) {
        if (!imptt.test(si) || el.style.display == 'none')
            return 0; // get out if we have nothing to do here
        if (el.nodeName === 'IFRAME' && el.src &&
            el.src.slice(0,17) === 'chrome-extension:')
            return 0; // Web of Trust uses this method to add their frame
        var so = si.replace(imptt, rplsf), ret = 0;
        if (si != so) {
            ret = 1;
            el.setAttribute('style', so);
        }
        return ret;
    }

    function logger(c) {
        if (c) console.log('Some page elements became a bit less important.');
    }

    function checkTarget(m, c) {
        var si = m.getAttribute ? m.getAttribute('style') : null;
        if (si && si.indexOf('!') > -1)
            c+=unimportanter(m, si);
        return c;
    }

    function checkNodes(m, c) {
        var i = m.length;
        while(i--)
            c = checkTarget(m[i], c);
        return c;
    }

    var observer = new MutationObserver(function(mutations) {
        setTimeout(function(m) {
            var i = m.length, c = 0;
            while(i--) {
                if (m[i].target)
                    c = checkTarget(m[i].target, c);
                if (m[i].addedNodes.length)
                    c = checkNodes(m[i].addedNodes, c);
            }
            logger(c);
        },0,mutations);
    });

    observer.observe(document, { childList : true, attributes : true, attributeFilter : ['style'], subtree : true });

    window.addEventListener ("load", function(){
        var c = 0, imp = document.querySelectorAll('[style*="!"]'), i = imp.length;
        while(i--) {
            c+= checkTarget(imp[i], c);
        }
        logger(c);
    }, false);
})();