// ==UserScript==
// @name        ETI Image Redirector
// @namespace   pendevin
// @description changes images from linking to their imagemap to their image page
// @include     http://boards.endoftheinter.net/showmessages.php*
// @include     http://archives.endoftheinter.net/showmessages.php*
// @include     http://endoftheinter.net/inboxthread.php*
// @include     https://boards.endoftheinter.net/showmessages.php*
// @include     https://archives.endoftheinter.net/showmessages.php*
// @include     https://endoftheinter.net/inboxthread.php*
// @require     http://code.jquery.com/jquery-2.1.4.min.js
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11289/ETI%20Image%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/11289/ETI%20Image%20Redirector.meta.js
// ==/UserScript==

//ll breaks without noconflict jquery
this.$ = this.jQuery = jQuery.noConflict(true);

//livelinks compatiblity *JQUERY
//calls the function on each message-container in a document, including ones added by livelinks
//place is an optional specialized location
function livelinks(func, extraParams, place) {
    if (extraParams == undefined) {
        extraParams = null;
    }
    if (place == undefined) {
        place = '.message-container';
    }
    //run the function on the message-containers currently on the page
    $('#u0_1 ' + place).each(function(i, container) {
        func(container, extraParams);
    });
    //make mutationobserver to run junk on matches
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            $(mutation.addedNodes).find(place).each(function(i, container) {
                func(container, extraParams);
            });
        });
    });
    //run mutationobserver
    observer.observe(document.querySelector('#u0_1'), {
        childList: true
    });
}

//runs on all the images hahahaha
function redirect(img) {
    var link = img.parentNode;
    //imagemap case
    if (link.href.search(/^https?\:\/\/images/) == 0) {
        link.href = link.href.replace(/\/imap\//, '/img/');
    }
    //direct links case
    //lmao even if you have direct links on, avatars still point to the imagemap. lg pls
    else {
        link.href = link.href.replace(/i\d\./, 'images.').replace(/\/i\/[nt]\//, '/img/');
    }
}

//this should mess with images before they load
//only compatible with imagenorator version 3.1+
livelinks(redirect, null, 'span.img-placeholder');
