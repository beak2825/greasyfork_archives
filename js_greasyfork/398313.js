// ==UserScript==
// @name          Logviewer
// @namespace     rokdd
// @author        rokondo
// @description   Scroll down, reload and notify at changes
// @include       *.log$
// @include       *log.html$
// @version       005
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_notification
// @license     CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-sa/4.0/legalcode
// @grant       window.focus
// @require https://code.jquery.com/jquery-2.1.4.min.js
// @homepageURL https://www.rokdd.xyz
// @downloadURL https://update.greasyfork.org/scripts/398313/Logviewer.user.js
// @updateURL https://update.greasyfork.org/scripts/398313/Logviewer.meta.js
// ==/UserScript==


// ==OpenUserJS==
// @author        rokondo
// @license     CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-sa/4.0/legalcode
// ==/OpenUserJS==
//notification script based on: https://stackoverflow.com/questions/36779883/userscript-notifications-work-on-chrome-but-not-firefox


var duration = 1;
var count_chars=2000;

$("html, body").animate({ scrollTop: $(document).height() });

function injectStylesheet(url) {
    $('head').append('<link rel="stylesheet" href="'+url+'" type="text/css" />');
}

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
    }
}

(function() {
    'use strict';

    $(document).ready(function()  {

        injectStylesheet("https://cdn.rawgit.com/kamranahmedse/jquery-toast-plugin/bd761d335919369ed5a27d1899e306df81de44b8/dist/jquery.toast.min.css");
        var time = new Date().getTime();
        $(document.body).bind("mousemove keypress", function(e) {
            time = new Date().getTime();
        });

        function refresh() {
            if(new Date().getTime() - time >= 60000)
                window.location.reload(true);
            else
                setTimeout(refresh, 30000);
        }

        shim_GM_notification ();
        // store current content in a variable
        var eurk = $("html").children(":visible").text();

        // compare local storage with current content to make alarm
        if (GM_getValue('eurkLoc-'+document.location.href,"")!="" && GM_getValue('eurkLoc-'+document.location.href,"") != eurk.substring(eurk.length-count_chars,count_chars)) {

            var url=document.location.href;
            var notificationDetails = {
                text:       'Content changed. Click to change tab!',
                title:      ''+url.replace(/^.*\/|\.[^.]*$/g, ''),
                timeout:    6000,
                onclick:    function () {

                    window.focus ();
                }
            };
            GM_notification (notificationDetails);

        }
        else
        {

        }
        GM_setValue('eurkLoc-'+document.location.href, eurk.substring(eurk.length-count_chars,count_chars));
        function resetFunction() {
            localStorage.setItem('eurn kLoc', eurk);
        };
    });
    //inject jqtoast
})();