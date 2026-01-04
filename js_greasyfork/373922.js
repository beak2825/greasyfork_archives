// ==UserScript==
// @icon            https://turkerhub.com/data/avatars/l/1/1637.jpg?1513481491
// @author          LLL
// @version         1.0.0
// @description     Adds buttons for commonly used links.
// @namespace       https://greasyfork.org/en/users/155391-lll
// @name            Sidebar with auto fade and keyboard shortcut
// @include         https://worker.mturk.com/*
// @grant           GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/373922/Sidebar%20with%20auto%20fade%20and%20keyboard%20shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/373922/Sidebar%20with%20auto%20fade%20and%20keyboard%20shortcut.meta.js
// ==/UserScript==

/* globals $ */

$("body").append ( `
    <div id="gmRightSideBar">
        <p>(F9) to Toggle Visibility</p>
        <ul>
          <a class="btn btn-primary" href="https://worker.mturk.com/dashboard">Dashboard</a>
          <a class="btn btn-primary" href="https://worker.mturk.com/tasks">Hits Queue</a>
          <a class="btn btn-secondary" href="https://worker.mturk.com/?hit_forker">Hit Forker</a>
          <a class="btn btn-secondary" href="https://worker.mturk.com/overwatch">Over Watch</a>
          <a class="btn btn-secondary" href="https://worker.mturk.com/?filters[search_term]=pandacrazy=on">Panda Crazy</a>
          <a class="btn btn-primary" href="https://worker.mturk.com/earnings">Transfer Earnings</a>
       </ul>
    </div>
` );

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

GM_addStyle ( `
    #gmRightSideBar {
        position:               fixed;
        top:                    0;
        right:                  0;
        margin:                 1ex;
        padding:                1em;
        background:             grey;
        width:                  645px;
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