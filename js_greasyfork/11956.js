// ==UserScript==
// @name         Better JCA Beta
// @namespace    http://mikebranski.com/
// @version      0.3.0
// @description  A better Jive Cloud Admin experience.
// @author       Mike Branski
// @match        https://cloud.jivesoftware.com/admin/portal.html
// @grant        none
// @homepage     https://github.com/mikebranski/userscripts
// @downloadURL https://update.greasyfork.org/scripts/11956/Better%20JCA%20Beta.user.js
// @updateURL https://update.greasyfork.org/scripts/11956/Better%20JCA%20Beta.meta.js
// ==/UserScript==

(function(window, undefined) {

    var jcaHomepageUrl,
        instanceUrl,
        selectedOption,
        homepageIframe,
        d;

    // Handy-dandy little debugging class.
    function Debugger() {
        // Need to see what's going on? Switch this to true.
        this.enabled = false;

        // Basically a pass-through for console.log(),
        // but will only fire if this.enabled is true.
        this.log = function() {
            if (this.enabled) {
                console.log.apply(console, arguments);
            }
        }
    }

    // You could have multiple instances of Debugger if you wanted
    // to break them out by type, but for now we just need one.
    d = new Debugger;

    // Note: You must include the #, otherwise Jive will just load whatever tab this script is being ran on.
    jcaHomepageUrl = window.location.href.replace(window.location.hash, "") + "#";

    window.addEventListener('load', init);

    document.querySelector("#installation-dropdown").addEventListener("change", function() {
        // @todo: Clean this up. :D
        document.querySelector("#installation-section").removeChild(document.querySelector("#installation-section a"));
        setTimeout(init, 500);
    });

    function init() {

        if (!window.location.hash) {
            // No hash? We're on the home page and can get the instance's URL from here.
            // Conveniently accessible with its own ID.
            var el = document.querySelector("#current-installation-url");

            if (!el) {
                // UI not loaded yet; delaying.
                window.setTimeout(init, 100);
                return;
            }

            instanceUrl = el.innerHTML.trim();

            enhanceUI();
        } else {
            // The ask: get the instance URL that is only available on the homepage.
            // The problem: being requested via an http request, the JS won't load, meaning we won't be able to get the URL anyway.
            // The solution: load the homepage into an iframe, wait a sec, and grab the instance URL from there.
            createAndParseIframe();
        }
    }

    function createAndParseIframe() {
        d.log("Attempting to parse the homepage embedded in an iframe");

        var targetContainer = document.querySelector("body");

        homepageIframe = document.createElement("iframe");

        if (d.enabled === false) {
            // Hide the iframe if debugging is disabled.
            homepageIframe.style.display = "none";
        } else {
            // Otherwise, add some styles so we can see the contents of the iframe.
            homepageIframe.style.marginTop = "100px";
            homepageIframe.style.border = "3px solid #333";
            homepageIframe.width = "100%";
            homepageIframe.height = "400px";
        }

        homepageIframe.src = jcaHomepageUrl;

        homepageIframe.addEventListener("load", iframeLoaded);

        targetContainer.insertBefore(homepageIframe, targetContainer.firstChild);
    }

    function iframeLoaded() {
        d.log("iframe has loaded");
        getInstanceUrlFromIframe();
    }

    function getInstanceUrlFromIframe() {
        var el = homepageIframe.contentWindow.document.querySelector("#current-installation-url"),
            homeLink,
            currentPageLink;

        // Check for the instance URL.
        if (!el) {

            homeLink = homepageIframe.contentWindow.document.querySelector('#breadcrumb a:first-child');
            d.log("homeLink:", homeLink);

            // If the dashboard link is there, click it so it loads the info we need, then delay.
            if (homeLink) {
                homeLink.click();
            }

            // if (numberOfTries = maximumTries) {
            //     console.log("Nothing more we can do here.");
            //     return false;
            // }

            // The UI hasn't loaded inside the iframe yet, so delay.
            var delay = 1000;

            d.log("Delaying for", delay);

            window.setTimeout(getInstanceUrlFromIframe, delay);

            return;

            /*
            // If it isn't there, try activating the dashboard tab.
            if (homepageIframe.contentWindow.portalShell) {
                console.log("Nothing more we can do here.");
                return false;
            }

            console.log("Activating the dashboard link manually");

            // Tell Jive's script to show the homepage manually.
            homepageIframe.contentWindow.portalShell.activateLink("dashboard");
            */
        }

        d.log('We got something!', el, el.innerHTML.trim());

        instanceUrl = el.innerHTML.trim();

        enhanceUI();

        // All good? Great; remove the iframe to keep things tidy, but first change the source back
        // to the current tab we're on. We do this because JCA remembers what the last tab we
        // accessed was, and loads that regardless of what's in the URL. This means that if
        // the user refreshes the page, it will always show the homepage until they
        // manually navigate back to where they were.
        homepageIframe.removeEventListener("load", iframeLoaded);

        d.log("Resetting the iframe to", window.location.href);

        // Find the link we need to activate.
        currentPageLink = homepageIframe.contentWindow.document.querySelector(".home-action a[href='" + window.location.hash + "']");

        if (currentPageLink) {
            currentPageLink.click();
        }

        // Remove the iframe.
        document.querySelector("body").removeChild(homepageIframe);
    }

    function enhanceUI() {
        d.log("Enhancing the UI!");
        markCurrentInstanceAsSelected();
        addInstanceInfoToNavigation();
    }

    function markCurrentInstanceAsSelected() {
        var label;

        label = document.querySelector("#installation-name").innerHTML.trim();

        selectedOption = document.querySelector("#installation-dropdown option[data-url='" + instanceUrl + "']");

        if (!selectedOption) {
            return false;
        }

        selectedOption.selected = true;
    }

    function addInstanceInfoToNavigation() {
        var targetContainer,
            instanceURLElement,
            role;

        targetContainer = document.querySelector("#installation-section");

        if (!targetContainer) {
            return false;
        }

        // Check for the nested property of `role`.
        // Magic courtesy of SO, of course.
        // http://stackoverflow.com/a/4034468/157385
        //role = ((selectedOption || {}).dataset || {}).role;

        //console.log(role);

        instanceUrlLink = document.createElement("a");

        instanceUrlLink.href = instanceUrl;
        instanceUrlLink.innerHTML = instanceUrl.split("://").pop();
        //if (role) {
        //    instanceUrlLink.innerHTML += " (" + role.toLowerCase() + ")";
        //}
        instanceUrlLink.target = "_blank";

        instanceUrlLink.style.color = "#ffffff";
        instanceUrlLink.style.marginLeft = "1em";

        targetContainer.appendChild(instanceUrlLink);
    }

})(window);
