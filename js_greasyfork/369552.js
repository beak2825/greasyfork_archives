// ==UserScript==
// @name         AutoReblog2Queue
// @namespace    https://github.com/KeyWeeUsr/Userscripts
// @version      1.0
// @description  Make your Tumblr queue in a single key press.
// @author       Peter Badida
// @copyright    2018+, Peter Badida
// @license      GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @homepage     https://github.com/KeyWeeUsr/Userscripts/tree/master/AutoReblog2Queue
// @supportURL   https://github.com/KeyWeeUsr/Userscripts/issues
// @icon         https://assets.tumblr.com/images/favicons/favicon.ico
// @include      https://www.tumblr.com/dashboard*
// @include      https://www.tumblr.com/dashboard/*
// @grant        unsafeWindow
// @contributionURL https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=ACVM74AYCXVWQ
// @downloadURL https://update.greasyfork.org/scripts/369552/AutoReblog2Queue.user.js
// @updateURL https://update.greasyfork.org/scripts/369552/AutoReblog2Queue.meta.js
// ==/UserScript==
'use strict';

/**
 * Autoreblog to Queue
 *
 * Userscript for Tumblr Dashboard which automatically changes the reblogging
 * option to "Add to queue" and reblogs it immediately.
 *
 * Basically this little script takes an advantage of the already available
 * behavior of Tumblr keyboard shortcuts i.e. navigating via J and K keys
 * together with R for reblogging. The script works in the background, checks
 * whether the modal window is present (waits if not), changes the reblogging
 * options and then presses the "Queue" button (changed "Reblog" button).
 *
 * Just use these navigation keys: J (up), K (down), L (heart), R (reblog).
 *
 * You can toggle the autoreblogging script on/off with the Ctrl + Q keys.
 * It's turned on by default.
 *
 * Also, if you deactivated the script and pressed R (reblog), you can always
 * activate it back with Ctrl + Q keys and the script will automatically add
 * the current post you are reblogging to the queue.
 *
 * Notify me if there's something missing/undesirable.
 */

var DEBUG = false;

/* how often to check for reblog modal */
var INTERVAL = 500;


function sleep(ms) {
    var i;
    var start = new Date().getTime();

    while (i < 1e7) {
        if ((new Date().getTime() - start) > ms) {
            break;
        }
        i++;
    }
}


function reblog_to_queue() {
    var modal;
    var button;
    var arrow;
    var menu;
    var items;
    var i;

    /* find the modal window and wait if not available */
    modal = document.getElementsByClassName("post-forms-modal")[0];
    button = modal.getElementsByClassName("post-form--save-button");
    if (!button.length) {
        return;
    }

    /* modal window is available, reblog button is found, open the options */
    button = button[0];
    arrow = button.getElementsByClassName("icon_arrow_carrot_down")[0];
    arrow.click();

    /* find the options menu element and pull the items out */
    menu = modal.getElementsByClassName("pop-menu")[0];
    items = menu.getElementsByClassName("item-option");

    /* find the "Add to queue" option in the reblog options and select it */
    for (i = 0; i < items.length; i++) {
        if (items[i].innerText !== "Add to queue") {
            continue;
        }
        items[i].click();
        break;
    }

    /* press the reblog button */
    button.getElementsByTagName("button")[0].click();

    /**
     * and remove it from parent to prevent duplicates in the queue
     * from pressing the button multiple times via interval
     */
    button.parentNode.removeChild(button);
}


function bind_CtrlQ_keys() {
    var key;

    document.body.addEventListener("keydown", function(eve) {
        if (DEBUG) {
            console.log(window.autoreblogscript);
            console.log(eve);
        }

        /* get keycode from event */
        key = eve.which || eve.keyCode;

        /* check if Q and Ctrl are pressed */
        if (eve.ctrlKey && key == 81) {
            if (window.autoreblogscript) {
                /* toggle off */
                clearInterval(window.autoreblogscript);
                window.autoreblogscript = null;
                /* make sure the interval is really stopped */
                console.log("[AutoReblog2Queue] off");
            } else {
                /* toggle on */
                window.autoreblogscript = setInterval(
                    reblog_to_queue, INTERVAL
                );
                console.log("[AutoReblog2Queue] on");
            }
        }
    });
}


bind_CtrlQ_keys();
window.autoreblogscript = setInterval(reblog_to_queue, INTERVAL);
