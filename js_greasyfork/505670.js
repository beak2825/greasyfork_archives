// ==UserScript==
// @name         Gplinks Bypass
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Bypassing gplinks.co
// @match        *://*/*
// @author     Jayasurya Mailsamy
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505670/Gplinks%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/505670/Gplinks%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // Function to remove scripts from the head
    function removeHeadScripts() {
        const head = document.head || document.getElementsByTagName('head')[0];
        const scripts = head.querySelectorAll('script');

        scripts.forEach(script => {
            script.parentNode.removeChild(script);
        });
    }

    // Function to set up a MutationObserver to detect script tags being added to the head
    function observeHeadForScripts() {
        const head = document.head || document.getElementsByTagName('head')[0];

        // Create a MutationObserver to watch for changes in the head element
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.tagName === 'SCRIPT') {
                        node.parentNode.removeChild(node);
                    }
                });
            });
        });

        // Observe the head element for child list changes
        observer.observe(head, {
            childList: true
        });

        // Also remove existing script elements immediately
        removeHeadScripts();
    }

    // Function to check for the specific script tag
    function checkForScript() {
        const scriptSrc = 'https://api.gplinks.com/track/js/main.js?2.7';
        const scripts = document.getElementsByTagName('script');

        for (let i = 0; i < scripts.length; i++) {
            if (scripts[i].src === scriptSrc) {

                // Proceed to make POST requests and redirect
                makePostRequestsAndRedirect();
                break;
            }
        }
    }

    // Function to get the value of a specific cookie
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    // Function to alert selected cookies
    function alertSelectedCookies() {
        const lid = getCookie("lid");
        const pid = getCookie("pid");
        const plid = getCookie("plid");
        const vid = getCookie("vid");

        let message = 'Cookies:\n';
        if (lid) message += `lid: ${lid}\n`;
        if (pid) message += `pid: ${pid}\n`;
        if (plid) message += `plid: ${plid}\n`;
        if (vid) message += `vid: ${vid}\n`;

        if (message === 'Cookies:\n') {
            message = 'No relevant cookies found.';
        }

        alert(message);
    }

    // Function to make POST requests
    function setVisitor(status, impressions, visitorId) {
        return $.ajax({
            type: "POST",
            url: "https://gplinks.com/track/data.php",
            data: {
                request: "setVisitor",
                status: status,
                imps: impressions,
                vid: visitorId,
            },
            dataType: "json",
        });
    }

    // Function to handle POST requests and redirect
    function makePostRequestsAndRedirect() {
        const vid = getCookie("vid"); // Assuming you want to use the cookie value for visitorId
        const cookie_pub_id = getCookie("pid");
        const cookie_link_id = getCookie("lid");
        if (!vid || !cookie_pub_id || !cookie_link_id) {
            alert('Missing required cookies for POST requests and redirect.');
            return;
        }

        // Perform three POST requests with different parameters
        $.when(
            setVisitor(1, 2, vid),
            setVisitor(2, 4, vid),
            setVisitor(3, 6, vid)
        ).done(function() {
            // Construct the target URL after POST requests are done
            const target_final = `https://gplinks.co/${cookie_link_id}/?pid=${cookie_pub_id}&vid=${vid}`;
            // Redirect to the target URL
            window.location.href = target_final;
        }).fail(function() {
            alert('One or more POST requests failed.');
        });
    }

    // Load jQuery if not already present
    function loadJQuery(callback) {
        const script = document.createElement('script');
        script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
        script.onload = callback;
        document.head.appendChild(script);
    }
    // Function to remove <script> tags from <head>
    function removeScriptTagsFromHead() {
        // Select all <script> tags within <head>
        const scriptTags = document.querySelectorAll('head script');

        // Remove each script tag
        scriptTags.forEach(script => {
            script.remove();
            console.log('Removed script tag:', script.src || 'inline script');
        });
    }

    // Function to modify the counter_value in app_vars
    function modifyCounterValue() {
        // Ensure the app_vars object is available
        if (window.app_vars) {
            // Check if counter_value exists in app_vars
            if ('counter_value' in window.app_vars) {
                // Modify counter_value to 0
                window.app_vars.counter_value = null;

            } else {
                console.error('counter_value not found in app_vars');
            }
        } else {
            console.error('app_vars not found on the page');
        }
    }

    // Function to check if an element exists
    function elementExists(selector) {
        return $(selector).length > 0;
    }

    // Redirect function
    function redirect(url) {
        window.location.href = url;
    }
// Function to copy text to clipboard and redirect
function handleRedirect(data) {
    // Copy URL to clipboard
    navigator.clipboard.writeText(data.url).then(() => {
        console.log('URL copied to clipboard');

        // Redirect after copying
        window.location.href = data.url;
    }).catch(err => {
        console.error('Failed to copy URL: ', err);
    });
}

 $(document).ready(function() {

    if (window.jQuery) {
        checkForScript();
    } else {
        loadJQuery(checkForScript);
    }
     observeHeadForScripts();
        removeScriptTagsFromHead();
        modifyCounterValue();
 if (elementExists('form[id=go-link]')) {
            var form = $('form[id=go-link]');

            // Unbind any existing submit handlers
            form.unbind().submit(function(e) {
                e.preventDefault(); // Prevent the default form submission

                // AJAX request
                $.ajax({
                    type: 'POST',
                    async: true,
                    url: form.attr('action'),
                    data: form.serialize(),
                    dataType: 'json',
                    success: function(data) {
                        if (data.url) {
                            handleRedirect(data);
                            redirect(data.url); // Redirect based on server response
                        } else {
                            console.error('No URL returned in response');
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error('AJAX request failed:', status, error);
                    }
                });
            });
        }
});

    // Check if jQuery is already loaded

})();
