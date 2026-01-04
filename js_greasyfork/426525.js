// ==UserScript==
// @name                WME Permalink Loader
// @namespace           http://userscripts.org/users/419370
// @description         Loads permalinks in an existing editor
// @author              Timbones
// @include             https://www.waze.com/*/editor*
// @include             https://www.waze.com/editor*
// @include             https://beta.waze.com/*
// @include             https://waze.cryosphere.co.uk/*
// @exclude             https://www.waze.com/*user/*editor/*
// @version             2.03
// @grant               GM_setValue
// @grant               GM_getValue
// @grant               GM_addValueChangeListener
// @grant               window.focus
// @run-at              document-idle
// @downloadURL https://update.greasyfork.org/scripts/426525/WME%20Permalink%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/426525/WME%20Permalink%20Loader.meta.js
// ==/UserScript==

/* HOW IT WORKS
 * pages that are not WME will detect clicks on links and ping them to WME
 * if WME is loaded with #PLL in URL, it will listen for permalinks
 * WME will then navigate to the permalink, and mark it as done
 * if origin page does not see confirmation it will open a new tab
 */

(function () {
    'use strict';

    var globalTargetId = Date.now();

    function upgradePermalinks(container) {
        container.querySelectorAll('a').forEach(function (a) {
            if (a.href.match(/waze\.com.*\/editor/) && !a.href.match(/waze\.com\/user\/editor/)) {
                a.onclick1 = a.onclick; // preserve any existing onclick event handler
                a.onclick = function () { this.onclick1 && this.onclick1(); return loadPermalink(a); };
            }
        });
    }

    function loadPermalink(permalink) {
        // can pass in 'a' element
        if (permalink.tagName == 'A' && permalink.href) {
            permalink = permalink.href;
        }

        // Send the url to WME Permalink Loader script
        console.log("WME Permalink Loader: Sending permalink to WME");
        GM_setValue('wmePermalinkTrigger', permalink);

        // set up a fallback that will open it the old way if loader doesn't work
        window.setTimeout(function () {
            if (GM_getValue('wmePermalinkTrigger') !== true) {
                console.error("WME Permalink Loader: Permalink failed to load, opening new tab instead");
                window.open(permalink + "#PLL");
                // TODO set different targets for each page?
            }
        }, 503);

        return false;
    }

    function permalinkListener(keyName, oldValue, newValue, remote) {
        // keyName will be wmePermalinkTrigger

        if (!remote) {
            return; // ignore writes by same tab
        }

        if (typeof newValue != "string") {
            return; // ignore invalid values
        }

        if (GM_getValue('wmePermalinkTarget') !== globalTargetId) {
            return; // ignore if not the most recently opened tab
        }

        if (newValue.indexOf(window.location.hostname) < 0) {
            return true; // open new tab when switching to beta WME
        }

        console.log("WME Permalink Loader: received permalink for target #" + globalTargetId);
        GM_setValue('wmePermalinkTrigger', true);

        try {
            W.map.getLayerByName("Closure Monitor Helper").destroyFeatures();
        }
        catch (error) {
            // ignore error
        }

        try {
            // check that Waze haven't changed the _restore() function
            if (W.map.mapState._restore.toString().length != 153) {
                console.warn("WME Permalink Loader: _restore() function has changed and may not work as expected!");
            }

            // clear previous state
            W.selectionManager.unselectAll();
            var closePanels = document.getElementsByClassName("close-panel");
            if (closePanels.length >= 1) {
                closePanels[0].click(); // close any open panel
            }

            // ask WME to restore the state from the permalink
            W.map.mapState.urlParams = getParams(newValue);

            // copied from W.map.mapState._restore()
            W.map.mapState._restoreMapLocation();
            W.map.mapState._restoreMarker();
            W.map.mapState._restoreSelection();
            W.map.mapState._restoreLayerVisibility();
            W.map.mapState._setupMap();
        }
        catch (error) {
            // failed to load permalink
            GM_setValue('wmePermalinkTrigger', false);
            console.error(error);
            return;
        }


        // success!
        window.focus();

        // ensure all the data is loaded, and then select features from permalinks
        W.controller.reloadData().then((()=>{
            // detect GUIDs and pass them on to Closure Monitor Helper
            if ('guid' in W.map.mapState.urlParams) {
                window.dispatchEvent(new CustomEvent("closuremonitor", { detail: W.map.mapState.urlParams.guid }));
            }

            W.map.initMapSelection();
            W.map.initMapIssuesSelection();
        }));
    }

    // helper function to turn parameters into object
    function getParams(urlString) {
        var params = {};
        var url = new URL(urlString);
        for (const [key, value] of url.searchParams.entries()) {
            if (value.match(/,/)) {
                params[key] = value.split(',');
            }
            else {
                params[key] = value;
            }
        }
        return params;
    }

    if (window.location.toString().match(/waze\.com.*\/editor/)) {
        if (window.location.hash == "#PLL") {
            // listen for future messages
            console.log("WME Permalink Loader: listening for permalinks");
            GM_addValueChangeListener("wmePermalinkTrigger", permalinkListener);

            // point to the most recently opened tab as the target for permalinks
            GM_setValue('wmePermalinkTarget', globalTargetId);
        }
    }

    else {
        // modifying all links on this page to use this feature
        console.log("WME Permalink Loader: upgrading permalinks on page");
        upgradePermalinks(document.body);

        // listen for new links being added dynamically
        var obs = new MutationObserver(function(mutations, observer) {
            for(var i=0; i<mutations.length; ++i) {
                for(var j=0; j<mutations[i].addedNodes.length; ++j) {
                    if (mutations[i].addedNodes[j].nodeType === Node.ELEMENT_NODE) {
                        upgradePermalinks(mutations[i].addedNodes[j]);
                    }
                }
            }
        });

        obs.observe(document.documentElement || document.body, { childList: true, subtree: true });
    }
})();
