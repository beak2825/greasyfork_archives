// ==UserScript==
// @name         Ticketscript tracker
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Track if there are tickets available from the currently selected shop3.ticketscript.com page. Usage: keep the ticketsscript page open on the desired event.
// @author       HIJOROCI
// @match        https://shop3.ticketscript.com/channel/html/get-products/rid/*/eid/*/date/*/tsid/*/sid/*/language/nl?referrer=&sourcepageurl=*
// @match        https://shop3.ticketscript.com/channel/html/get-products/rid/*/eid/*/date/*/tsid/*/sid/0/language/nl*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      api.pushover.net
// @downloadURL https://update.greasyfork.org/scripts/34716/Ticketscript%20tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/34716/Ticketscript%20tracker.meta.js
// ==/UserScript==


// settings
// Should the messages be sent to pushover?
var pushtopushover = true;

// Show an alert on desktop?
var desktopnotify  = true;

// Pushover settings:
// Create an account and an app on https://pushover.net/ to receive push messages on your mobile
var token ="";
var userkey = "";

function notify(source, userName, status) {

    var dt = new Date();
    var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
    var message = source +" | " + userName +" | " + time + " | "+ status;
    if(desktopnotify)
    {
        if (Notification.permission !== "granted")
            Notification.requestPermission();
        else {
            var n = new Notification(time, {
                icon: 'https://cdn.sstatic.net/stackexchange/img/logos/so/so-icon.png',
                body: status,
                silent: false
            });
            playSound();

        }
    }

    // also push to pushover if status contains a user
    if(!!userName && pushtopushover && !!token && !!userkey)
    {
        var title= userName +": " + status;
        pushToPushOver(title, message);
    }
}

function pushToPushOver(title,message)
{
    var json_data=JSON.stringify ({
        token   : token,
        user    : userkey,
        message : message,
        title   : title});

    GM_xmlhttpRequest({
        method:     "POST",
        url:        "https://api.pushover.net/1/messages.json",
        data:       json_data,
        headers:    {
            "Content-Type": "application/json"
        },
        onload:     function (response) {
            console.log ("post response: " + response.responseText);
        }
    });
}


function playSound()
{
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    context = new AudioContext();

    var o = context.createOscillator();
    o.type = 'sine';
    o.frequency.value = 261.63;
    o.connect(context.destination);

    o.start(0);
    setTimeout(function() {
        o.stop(0);
        context.close();
    }, 100);
}


function refreshPage() {
        window.location.reload(true);
}

(function() {
    'use strict';

    // request permission on page load
    document.addEventListener('DOMContentLoaded', function () {
        if (!Notification) {
            alert('Desktop notifications not available in your browser. Try Chromium.');
            return;
        }

        if (Notification.permission !== "granted")
            Notification.requestPermission();
    });

    //if (window.top === window.self) {
    //--- Script is on domain_B.com when/if it is the MAIN PAGE.
    //}
    //else {
        //--- Script is on domain_B.com when/if it is IN AN IFRAME.
        if($(".tickets .ticket").length > 0 )
        {
            var done= false;
             $(".tickets .ticket").each(function(){
                if(!$(this).hasClass('inactive'))
                {
                    done=true;
                    notify("TS","TicketScript","Tickets Available");
                }
             });

            if(!done)
            {
                setTimeout(refreshPage, 10000);
            }
        }else
        {
            // no tickets available, refresh

            setTimeout(refreshPage, 10000);
        }
    //}
})();