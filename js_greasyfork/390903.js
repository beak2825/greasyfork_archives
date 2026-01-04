// ==UserScript==
// @name            aditya's reddit old new shuffle button
// @namespace       testinfg-fojjjjr-that-script
// @description      reddit old new shuffle button
// @icon http://i.imgur.com/FHNlzN4.jpg?1
// @version         1.0
// @grant GM_addStyle
// @include         *.reddit.com/*
// @grant GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/390903/aditya%27s%20reddit%20old%20new%20shuffle%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/390903/aditya%27s%20reddit%20old%20new%20shuffle%20button.meta.js
// ==/UserScript==

if (window.top != window.self)//don't run on frames or iframes
{
    //Optional: GM_log ('In frame');
    return;
}

/*--- Create a button in a container div.  It will be styled and positioned with CSS.
*/
var zNode = document.createElement ('input');
zNode.setAttribute ('id', 'suButton');
zNode.setAttribute( 'type', 'image' );
zNode.setAttribute( 'src', 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRSFhejfg1n_wP1b_ZVbxdHX-IOr2D975qoDeuOY2efga9MtMKGUg' );
document.body.appendChild (zNode);
zNode.addEventListener ("click", ButtonClickAction, true);

//--- Activate the newly added button and add rollover image handling.

function ButtonClickAction ()
{
var url = window.location.toString("suButton");
window.location = url.replace('www', 'old');
}

//--- Style our newly added elements using CSS.
GM_addStyle ( "                                             \
    #suButton {                                             \
        position:               fixed;                      \
        top:                 0px;                        \
        left:                   0px;                        \
        margin:                 0px 0px 0px 0px;           \
        opacity:                0.9;                        \
		cursor:                 url(C:\buttercup_06.cur),url(http://www.creativeadornments.com/nephco/powerpuffgirls/cursors/ppg_01anim.gif),url(myBall.cur),pointer; \
        border:                 0px outset red;             \
        z-index:                222;                        \
        padding:                5px 5px;                    \
	}\
" );

//=============================================================================
/*--- Create a button in a container div.  It will be styled and positioned with CSS.
*/
var zNode2 = document.createElement ('input');
zNode2.setAttribute ('id', 'suButton2');
zNode2.setAttribute( 'type', 'image' );
zNode2.setAttribute( 'src', 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRSFhejfg1n_wP1b_ZVbxdHX-IOr2D975qoDeuOY2efga9MtMKGUg' );
document.body.appendChild (zNode2);
zNode2.addEventListener ("click", ButtonClickAction2, true);

//--- Activate the newly added button and add rollover image handling.

function ButtonClickAction2 ()
{
var url = window.location.toString("suButton2");
window.location = url.replace('old', 'www');
}

//--- Style our newly added elements using CSS.
GM_addStyle ( "                                             \
    #suButton2 {                                             \
        position:               fixed;                      \
        top:                 0px;                        \
        left:                   30px;                        \
        margin:                 0px 0px 0px 0px;           \
        opacity:                0.9;                        \
		cursor:                 url(C:\buttercup_06.cur),url(http://www.creativeadornments.com/nephco/powerpuffgirls/cursors/ppg_01anim.gif),url(myBall.cur),pointer; \
        border:                 0px outset red;             \
        z-index:                222;                        \
        padding:                5px 5px;                    \
	}\
" );
