// ==UserScript==
// @name     TTD Sticky Notes
// @namespace TTD Sticky Notes
// @include  https://online.tirupatibalaji.ap.gov.in/*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant    GM_addStyle
// @version 1.0
// @description TTD Sticky Notes TTD Sticky Notes TTD Sticky Notes
// @downloadURL https://update.greasyfork.org/scripts/450088/TTD%20Sticky%20Notes.user.js
// @updateURL https://update.greasyfork.org/scripts/450088/TTD%20Sticky%20Notes.meta.js
// ==/UserScript==
// $(document).ready(function(){
//     $("#dam_return td").click(function(){
//         var value = $(this).html();
//         var input = $('#0');
//         var i = 0;
// var txt = input.val(value);
// var speed = 10;

// function typeWriter() {
//   if (i < txt.length) {
//     document.getElementById("0").innerHTML += txt.charAt(i);
//     i++;
//     setTimeout(typeWriter, speed);
//   }
// }

//     });
// });

$("body").append ( '                                                \
    <div id="gmRightSideBar">                                       \
<table border="0" ><tr><th><b>Name</th><th><b>Age</th><th><b>ID Card No</th></tr>\
<tr><td class="selectable">XXXXXXXXXXXXXXX</td><td>	26	</td> <td class="selectable" >9999999999999999</td></tr>\
<tr><td class="selectable">XXXXXXXXXXXXXXX</td><td>	26	</td> <td class="selectable" >9999999999999999</td></tr>\
<tr><td class="selectable">XXXXXXXXXXXXXXX</td><td>	26	</td> <td class="selectable" >9999999999999999</td></tr>\
<tr><td class="selectable">XXXXXXXXXXXXXXX</td><td>	26	</td> <td class="selectable" >9999999999999999</td></tr>\
<tr><td class="selectable">XXXXXXXXXXXXXXX</td><td>	26	</td> <td class="selectable" >9999999999999999</td></tr>\
<tr><td class="selectable">XXXXXXXXXXXXXXX</td><td>	26	</td> <td class="selectable" >9999999999999999</td></tr>\
<tr><td class="selectable">XXXXXXXXXXXXXXX</td><td>	26	</td> <td class="selectable" >9999999999999999</td></tr>\
<tr><td class="selectable">XXXXXXXXXXXXXXX</td><td>	26	</td> <td class="selectable" >9999999999999999</td></tr>\
<tr><td class="selectable">XXXXXXXXXXXXXXX</td><td>	26	</td> <td class="selectable" >9999999999999999</td></tr>\
<tr><td class="selectable">XXXXXXXXXXXXXXX</td><td>	26	</td> <td class="selectable" >9999999999999999</td></tr>\
</td></table>\
' );

//-- Fade panel when not in use
var kbShortcutFired = false;
var rightSideBar    = $('#gmRightSideBar');
rightSideBar.hover (
    function () {
        $(this).stop (true, false).fadeTo (50,  1000  );
        kbShortcutFired = false;
    },
    function () {
        if ( ! kbShortcutFired ) {
            $(this).stop (true, false).fadeTo (900, 1000);
        }
        kbShortcutFired = false;
    }
);
rightSideBar.fadeTo (2900, 2000);

//-- Keyboard shortcut to show/hide our sidebar
$(window).keydown (keyboardShortcutHandler);

function keyboardShortcutHandler (zEvent) {
    //--- On F9, Toggle our panel's visibility
    if (zEvent.which == 120) {  // F9
        kbShortcutFired = true;

        if (rightSideBar.is (":visible") ) {
            rightSideBar.stop (true, false).hide ();
        }
        else {
            //-- Reappear opaque to start
            rightSideBar.stop (true, false).show ();
            rightSideBar.fadeTo (0, 1000);
            rightSideBar.fadeTo (2900, 2000);
        }

        zEvent.preventDefault ();
        zEvent.stopPropagation ();
        return false;
    }
}

GM_addStyle ( "                                                     \
    #gmRightSideBar {                                               \
        position:               fixed;                              \
        top:                    0;                                  \
        left:                  0;                                  \
        margin:                 1ex;                                \
        padding:                1em;                                \
        background:             orange;                             \
        width:                  auto;                              \
        z-index:                6666;                               \
        opacity:                100%;                                \
    }                                                               \
    #gmRightSideBar p {                                             \
        font-size:              80%;                                \
    }                                                               \
    #gmRightSideBar ul {                                            \
        margin:                 0ex;                                \
    }                                                               \
    #gmRightSideBar a {                                             \
        color:                  blue;                               \
    }                                                               \
           .selectable{                                               \
    -webkit-touch-callout: all; /* iOS Safari */                                               \
    -webkit-user-select: all; /* Safari */                                               \
    -khtml-user-select: all; /* Konqueror HTML */                                               \
    -moz-user-select: all; /* Firefox */                                               \
    -ms-user-select: all; /* Internet Explorer/Edge */                                               \
    user-select: all; /* Chrome and Opera */                                               \
}                                               \
" );