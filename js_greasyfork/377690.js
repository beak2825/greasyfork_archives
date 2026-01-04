// ==UserScript==
// @name            Xhamster (NewTEST) - AUTO Delete Our Deleted Favs (videos/Users/FriensOnly- PB)   v.7 - DEV - NEW
// @version         v.7
// @description	    AUTO Delete Our Deleted Favs (videos/Users/FriensOnly)(author of the Library in use: Brock Adams)
//
// @namespace https://greasyfork.org/fr/users/7434-janvier56
// @homepage https://greasyfork.org/fr/users/7434-janvier56


// @include       https://*xhamster.com/my/favorites/videos/*
// @include       https://*xhamster.com/my/favorites/*

// @require http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @autor Brock Adams

// @run-at document-start

// @grant GM_addStyle
// @license       unlicense

// @downloadURL https://update.greasyfork.org/scripts/377690/Xhamster%20%28NewTEST%29%20-%20AUTO%20Delete%20Our%20Deleted%20Favs%20%28videosUsersFriensOnly-%20PB%29%20%20%20v7%20-%20DEV%20-%20NEW.user.js
// @updateURL https://update.greasyfork.org/scripts/377690/Xhamster%20%28NewTEST%29%20-%20AUTO%20Delete%20Our%20Deleted%20Favs%20%28videosUsersFriensOnly-%20PB%29%20%20%20v7%20-%20DEV%20-%20NEW.meta.js
// ==/UserScript==

// FROM a script of Brock Adams (Thanks to him!)
// in stackoverflow :
// http://stackoverflow.com/questions/12252701/how-do-i-click-on-this-button-with-greasemonkey?lq=1
// with :
// https://gist.github.com/raw/2625891/waitForKeyElements.js

/*- The @grant directive is needed to work around a major design change
introduced in GM 1.0.
It restores the sandbox.
*/


/*--- waitForKeyElements():

FIND IT HERE :
https://gist.github.com/raw/2625891/waitForKeyElements.js

A utility function, for Greasemonkey scripts,
that detects and handles AJAXed content.

Usage example:

waitForKeyElements (
"div.comments"
, commentCallbackFunction
);

//--- Page-specific function to do what we want when the node is found.
function commentCallbackFunction (jNode) {
jNode.text ("This comment changed by waitForKeyElements().");
}

IMPORTANT: This function requires your script to have loaded jQuery.
*/
function waitForKeyElements (
selectorTxt, /* Required: The jQuery selector string that
specifies the desired element(s).
*/
actionFunction, /* Required: The code to run when elements are
found. It is passed a jNode to the matched
element.
*/
bWaitOnce, /* Optional: If false, will continue to scan for
new elements even after the first match is
found.
*/
iframeSelector /* Optional: If set, identifies the iframe to
search.
*/
) {
var targetNodes, btargetsFound;

if (typeof iframeSelector == "undefined")
targetNodes = $(selectorTxt);
else
targetNodes = $(iframeSelector).contents ()
.find (selectorTxt);

if (targetNodes && targetNodes.length > 0) {
btargetsFound = true;
/*--- Found target node(s). Go through each and act if they
are new.
*/
targetNodes.each ( function () {
var jThis = $(this);
var alreadyFound = jThis.data ('alreadyFound') || false;
if (!alreadyFound) {
//--- Call the payload function.
var cancelFound = actionFunction (jThis);
if (cancelFound)
btargetsFound = false;
else
jThis.data ('alreadyFound', true);
}
} );
}
else {
btargetsFound = false;
}

//--- Get the timer-control variable for this selector.
var controlObj = waitForKeyElements.controlObj || {};
var controlKey = selectorTxt.replace (/[^\w]/g, "_");
var timeControl = controlObj [controlKey];

//--- Now set or clear the timer as appropriate.
if (btargetsFound && bWaitOnce && timeControl) {
//--- The only condition where we need to clear the timer.
clearInterval (timeControl);
delete controlObj [controlKey]
}
else {
//--- Set a timer, if needed.
if ( ! timeControl) {
timeControl = setInterval ( function () {
waitForKeyElements ( selectorTxt,
actionFunction,
bWaitOnce,
iframeSelector
);
},
1000
);
controlObj [controlKey] = timeControl;
}
}
waitForKeyElements.controlObj = controlObj;
}



//--- Note that contains() is CASE-SENSITIVE.
//waitForKeyElements ("a.simplebutton:contains('follow')", clickOnFollowButton);
// .view-all-contexts-of-type>a


// FROM : Greasemonkey script to automatically replay finshed songs in youtube
// https://gist.github.com/aniket91/7d1da89190beb1446a3c7bcf53b181b7

// DEL FAVS
/* OLD - DELETED BUTTON for GM */
/* .user-page.favorites-page .thumb-list__item.video-thumb  a.thumb-image-container.disabled + .video-thumb-info .video-thumb__trigger i.xh-icon.dots-menu */

//NEW - FIND/click 3 dots
/* .user-page.favorites-page .thumb-list__item.video-thumb  a.thumb-image-container.disabled + .video-thumb-info .video-thumb__trigger i.xh-icon.dots-menu */
// NEW - without NOT ERROR LOADING - .user-page.favorites-page .thumb-list__item.video-thumb a.video-thumb__image-container.role-pop.thumb-image-container.disabled:not([href^="https://xhamster.com/videos/"])  + .video-thumb-info .video-thumb__trigger i.xh-icon.dots-menu

// FIND 3 dots

/* FIND OK - TEST4 - DELETED (No href)  / ERROR LOADING (href) / ONLY FRIEND (href) / NOT AVAIBLE (no href) - .user-page.favorites-page .thumb-list__item.video-thumb a.video-thumb__image-container.role-pop.thumb-image-container.disabled  + .video-thumb-info .video-thumb__trigger i.xh-icon.dots-menu */

(function(){
function actionDOTSbutton(node){
//console.log ("DELETED. Clicking it!");
console.log ("DOTS. Clicking it!");
//node.click();
var clickEvent = document.createEvent ('MouseEvents');
clickEvent.initEvent ('click', true, true);
node[0].dispatchEvent (clickEvent);
return true;
}
//console.log ("Waiting for DELETEDbutton");
console.log ("Waiting for DOTSbutton");
//waitForKeyElements(".item.video .thumb-container.reset-cursor img.deleted + .info-line + .info-line-top button.edit-link.remove", actionDELETEDbutton);
waitForKeyElements(".user-page.favorites-page .thumb-list__item.video-thumb a.video-thumb__image-container.role-pop.thumb-image-container.disabled  + .video-thumb-info .video-thumb__trigger i.xh-icon.dots-menu", actionDOTSbutton);
})();


// NOT AVAIBLE - actionDOTSbutton2
(function(){
function actionDOTSbutton2(node){
//console.log ("DELETED. Clicking it!");
console.log ("DOTS. Clicking it!");
//node.click();
var clickEvent = document.createEvent ('MouseEvents');
clickEvent.initEvent ('click', true, true);
node[0].dispatchEvent (clickEvent);
return true;
}
//console.log ("Waiting for DELETEDbutton");
console.log ("Waiting for DOTSbutton2");
//waitForKeyElements(".item.video .thumb-container.reset-cursor img.deleted + .info-line + .info-line-top button.edit-link.remove", actionDELETEDbutton);
waitForKeyElements(".user-page.favorites-page .thumb-list__item.video-thumb .thumb-plug.thumb-plug_video .video-thumb-info .video-thumb__trigger i.xh-icon.dots-menu", actionDOTSbutton2);
})();
// DELL actionDOTSbutton2
(function(){
function actionDELbutton2(node){
console.log ("DEL. Clicking it!");
//node.click();
var clickEvent = document.createEvent ('MouseEvents');
clickEvent.initEvent ('click', true, true);
node[0].dispatchEvent (clickEvent);
return true;
}
console.log ("Waiting for DELbutton2");
//waitForKeyElements(".item.video .thumb-container.reset-cursor img.deleted + .info-line + .info-line-top button.edit-link.remove", actionDELETEDbutton);
waitForKeyElements(".user-page.favorites-page .thumb-list__item.video-thumb .thumb-plug.thumb-plug_video .video-thumb-info  .xh-dropdown .dropdown.position-right.open span:only-of-type .xh-icon.bucket", actionDELbutton2);
})();

// DEL

// DEL - OK - TEST 4 - NEW - ERROR LOAD (href + preview + span)+ DELETED (no href + no preview + span) + Not AVAIABLE (no href + no preview + span) + ONLY  FRIEND (href + preview + span)
/* .user-page.favorites-page .thumb-list__item.video-thumb  a.thumb-image-container.disabled:not([data-previewvideo]) + .video-thumb-info .xh-dropdown .dropdown.position-right.open span:only-of-type .xh-icon.bucket */

(function(){
function actionDELbutton(node){
console.log ("DEL. Clicking it!");
//node.click();
var clickEvent = document.createEvent ('MouseEvents');
clickEvent.initEvent ('click', true, true);
node[0].dispatchEvent (clickEvent);
return true;
}
console.log ("Waiting for DELbutton");
//waitForKeyElements(".item.video .thumb-container.reset-cursor img.deleted + .info-line + .info-line-top button.edit-link.remove", actionDELETEDbutton);
waitForKeyElements(".user-page.favorites-page .thumb-list__item.video-thumb  a.thumb-image-container.disabled:not([data-previewvideo]) + .video-thumb-info .xh-dropdown .dropdown.position-right.open span:only-of-type .xh-icon.bucket", actionDELbutton);
})();



// OLD USER DELETED ?
/*
(function(){
function actionDELETEDuserbutton(node){
console.log ("DELETED. Clicking it!");
//node.click();
var clickEvent = document.createEvent ('MouseEvents');
clickEvent.initEvent ('click', true, true);
node[0].dispatchEvent (clickEvent);
return true;
}
console.log ("Waiting for DELETEDuserbutton");
waitForKeyElements(".image-container[data-tooltip='User is retired'] + .info .controls.friends .remove-favorite", actionDELETEDuserbutton);
})();
*/


// CONFIRM

// OLD CONFIR DELETE - .user-page.favorites-page  .xh-modal-wrapper.old.opened .xh-modal.small.xh-confirm-dialog .xh-button.red.large.remove

// CONFIRM DELETE - OK - TEST 4 - NEW - .dialog-desktop-container.desktop-dialog-open .dialog-desktop-container__content.dlg-content .favorites-remove-collection .xh-button.button.red.large.square
(function(){
function actionCONFIMdel(node){
//console.log ("OLDdesign. Clicking it!");
console.log ("NEWdesign. Clicking it!");
//node.click();
var clickEvent = document.createEvent ('MouseEvents');
clickEvent.initEvent ('click', true, true);
node[0].dispatchEvent (clickEvent);
return true;
}
console.log ("Waiting for actionCONFIMdel");
//waitForKeyElements(".user-page.favorites-page  .xh-modal-wrapper.old.opened .xh-modal.small.xh-confirm-dialog .xh-button.red.large.remove", actionCONFIMdel);
waitForKeyElements(".dialog-desktop-container.desktop-dialog-open .dialog-desktop-container__content.dlg-content .favorites-remove-collection .xh-button.button.red.large.square", actionCONFIMdel);
})();

