// ==UserScript==
// @name         Punycode detector
// @namespace    https://github.com/Shifterovich
// @version      1.1
// @description  Prevent homograph attacks.
// @author       Samuel Shifterovich (https://github.com/Shifterovich)
// @include      /xn--/
// @include      /[^\x00-\x7F]/
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/29127/Punycode%20detector.user.js
// @updateURL https://update.greasyfork.org/scripts/29127/Punycode%20detector.meta.js
// ==/UserScript==

shim_GM_notification();

var notificationDetails = {
    text:       'This website has Punycode in its domain name!',
    title:      'PUNYCODE DETECTED!',
    timeout:    10000,
    onclick:    function () {
        window.focus ();
    }
  };

// Cross-browser Shim code
function shim_GM_notification () {
    if (typeof GM_notification === "function") {
        return;
    }
    window.GM_notification = function (ntcOptions) {
        checkPermission ();

        function checkPermission () {
            if (Notification.permission === "granted") {
                fireNotice ();
            }
            else if (Notification.permission === "denied") {
                alert ("User has denied notifications for this page/site!");
                return;
            }
            else {
                Notification.requestPermission ( function (permission) {
                    console.log ("New permission: ", permission);
                    checkPermission ();
                } );
            }
        }

        function fireNotice () {
            if ( ! ntcOptions.title) {
                console.log ("Title is required for notification");
                return;
            }
            if (ntcOptions.text  &&  ! ntcOptions.body) {
                ntcOptions.body = ntcOptions.text;
            }
            var ntfctn  = new Notification (ntcOptions.title, ntcOptions);

            if (ntcOptions.onclick) {
                ntfctn.onclick = ntcOptions.onclick;
            }
            if (ntcOptions.timeout) {
                setTimeout ( function() {
                    ntfctn.close ();
                }, ntcOptions.timeout);
            }
        }
    };
}

if (window.location.hostname.indexOf("xn--") != -1 || /[^\x00-\x7F]/.test(location.hostname)){
    GM_notification(notificationDetails);
}