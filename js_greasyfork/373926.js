// ==UserScript==
// @icon            https://turkerhub.com/data/avatars/l/1/1637.jpg?1513481491
// @author          LLL
// @namespace       https://greasyfork.org/en/users/155391-lll
// @version         1.0.1
// @description     A sidebar for common links.
// @name            !!![mturk] - Sidebar with auto fade and keyboard shortcut
// @include         https://worker.mturk.com/*
// @include         https://turkerhub.com/daily_work.php
// @exclude         https://worker.mturk.com/?psycho_forker
// @exclude         https://worker.mturk.com/psychowatch
// @require         https://code.jquery.com/jquery-3.2.1.min.js
// @grant           GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/373926/%21%21%21%5Bmturk%5D%20-%20Sidebar%20with%20auto%20fade%20and%20keyboard%20shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/373926/%21%21%21%5Bmturk%5D%20-%20Sidebar%20with%20auto%20fade%20and%20keyboard%20shortcut.meta.js
// ==/UserScript==

/* globals $ */

$("body").append ( `
    <div id="gmRightSideBar">
        <p>(F9) to Toggle Visibility</p>
        <ul>
          <button type="button" class="btn btn-sm btn-primary"><a href="https://worker.mturk.com/dashboard">Dashboard</a></button>
          <button type="button" class="btn btn-sm btn-primary"><a href="https://worker.mturk.com/tasks">Hits Queue</a></button>
          <button type="button" class="btn btn-sm btn-secondary"><a href="https://worker.mturk.com/?psycho_forker">Hit Forker</a></button>
          <button type="button" class="btn btn-sm btn-secondary"><a href="https://worker.mturk.com/psychowatch">Over Watch<a/></button>
          <button type="button" class="btn btn-sm btn-secondary"><a href="https://worker.mturk.com/?filters[search_term]=pandacrazy=on">Panda Crazy</button>
          <button type="button" class="btn btn-sm btn-primary"><a href="https://turkerhub.com/daily_work.php">Daily Work Log</a></button>
        </ul>
    </div>
` );
// Future add-on...    <button type="button" class="btn btn-sm btn-primary ml-1"><a id="test">Settings</a></button>

// Fade panel when not in use
var kbShortcutFired = false;
var rightSideBar = $('#gmRightSideBar');
rightSideBar.hover (
    function () {
        $(this).stop (true, false).fadeTo (50, 1);
        kbShortcutFired = false;
    },
    function () {
        if ( ! kbShortcutFired ) {
            $(this).stop (true, false).fadeTo (900, 0.1);
        }
        kbShortcutFired = false;
    }
);
rightSideBar.fadeTo (2900, 0.1);

// Keyboard shortcut to show/hide our sidebar
$(window).keydown (keyboardShortcutHandler);

function keyboardShortcutHandler (zEvent) {
    // On F9, Toggle our panel's visibility
    if (zEvent.which == 120) { // F9
        kbShortcutFired = true;

        if (rightSideBar.is (":visible") ) {
            rightSideBar.stop (true, false).hide ();
        }
        else {
            // Reappear opaque to start
            rightSideBar.stop (true, false).show ();
            rightSideBar.fadeTo (0, 1);
            rightSideBar.fadeTo (2900, 0.1);
        }

        zEvent.preventDefault ();
        zEvent.stopPropagation ();
        return false;
    }
}

// I plan to add a modal here with features/settings. Including auto search for Google and toggles to turn on/off common scritps.
/*
const testt = document.getElementById('test');
testt.onclick = function() {
    console.log('Yes, it worked.');
}
*/

GM_addStyle ( `
    #gmRightSideBar {
        position:               fixed;
        top:                    0;
        right:                  0;
        margin:                 1ex;
        padding:                0.5em;
        background:             grey;
        width:                  500px;
        z-index:                6666;
        opacity:                0.7;
    }
    #gmRightSideBar p {
        font-size:              80%;
    }
    #gmRightSideBar ul {
        margin:                 0ex;
    }
    #gmRightSideBar a {
        color:                  blue;
    }
` );