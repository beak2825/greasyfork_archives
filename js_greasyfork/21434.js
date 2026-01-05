// ==UserScript==
// @name           YouTube Auto-Like Videos [fixed]
// @namespace      http://userscripts.org/users/23652
// @description    Automatically clicks the 'Like' button
// @include        http://*.youtube.com/watch*v=*
// @include        http://youtube.com/watch*v=*
// @include        https://*.youtube.com/watch*v=*
// @include        https://youtube.com/watch*v=*
// @copyright      JoeSimmons
// @version        1.1.03
// @license        GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @require        https://greasyfork.org/scripts/1884-gm-config/code/GM_config.js?version=4836
// @require        https://greasyfork.org/scripts/1885-joesimmons-library/code/JoeSimmons'%20Library.js?version=7915
// @require        https://greasyfork.org/scripts/2104-youtube-button-container-require/code/YouTube%20-%20Button%20Container%20(@require).js?version=5493
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/21434/YouTube%20Auto-Like%20Videos%20%5Bfixed%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/21434/YouTube%20Auto-Like%20Videos%20%5Bfixed%5D.meta.js
// ==/UserScript==

/* CHANGELOG

    1.1.03 (7/17/2016)
        - fixed script

    1.1.02 (6/7/2015)
        - fixed script

    1.1.01 (3/14/2015)
        - fixed bug of it liking all videos when username list was empty

    1.1.0 (3/13/2015)
        - added a new option to allow auto-liking of videos from subscribed channels

    1.0.40 (3/12/2015)
        - adapted to YouTube changing like/dislike buttons' classes

    1.0.39 (1/26/2015)
        - changed the timeout of the script so it waits a real 30 seconds, not X amout of intervals
            should be more accurate, especially on weaker computers whose browsers freeze and the intervals overlap

    1.0.38 (1/19/2015)
        - adapted to page change (different class name of author link)

    1.0.37 (9/8/2014)
        - adapted to new YouTube style
        - fixed an issue with channel names with punctuation in them not getting "liked"

    1.0.36 (12/17/2013)
        - added a user-script command for the options

    1.0.35 (12/14/2013)
        - started using YouTube Button Container
        - made code more readable by using JSL and @requires

    1.0.34
        - added compatibility for Opera & Chrome

*/



(function () {
    'use strict';

    var t = 0, tMax = 30,
        spaceRegex = /([ \t]+)|(\n[ \r\n\r]+\n)/g,
        newlineRegex = /\n/g,
        uRegex = /\/user\/(\w+)/i,
        spaces = /\s+/g,
        rBlank = /^\s*$/,
        rVideoId = /[&?]v=([a-zA-Z0-9-_]+)/,
        rSubscribed = /^true$/i,
        rUnclicked = /like-button-renderer-(dis)?like-button-unclicked/,
        intv, pass, auto_like_list, timeStart, likeSubscribedChannels;

    // click by JoeSimmons
    function click(element, type) {
        var eventObject = document.createEvent('MouseEvents');
            element = typeof element === 'string' ? document.getElementById(element) : element;
            type =  typeof type === 'string' ? type : 'click';

        if (element.isJSL === true) {
            element = element[0];
        }

        if (element) {
            eventObject.initMouseEvent(type, true, true, document.window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            element.dispatchEvent(eventObject);
        }
    }

    function waitForShare() {
        var shareBox = JSL('#watch-action-panels'),
            shareCloseButton = JSL('#action-panel-dismiss');
        
        // close the Share box after it appears
        if (shareBox.visible) {
            window.setTimeout(click, 750, shareCloseButton);
        } else {
            window.setTimeout(waitForShare, 250);
        }
    }

    function isPressed(e) {
        return e.attribute('class').match(rUnclicked) === null;
    }

    function doLike() {
        var author = JSL('#watch7-user-header .yt-user-info a.g-hovercard'),
            like = JSL('#watch8-sentiment-actions button.like-button-renderer-like-button'),
            dislike = JSL('#watch8-sentiment-actions button.like-button-renderer-dislike-button'),
            subBox = JSL('#watch7-subscription-container span .yt-uix-subscription-button'),
            authorHref = '',
            authorText = '',
            usernameHref = '',
            usernameText = '';

        // quit trying to auto-like after 15 seconds
        if ( (Date.now() - timeStart) >  15000) {
            JSL.clearInterval(intv);
            // throw new Error('Warning: 30 seconds elapsed; failed to auto-like video id: ' + window.location.href.match(rVideoId)[1] );
        }

        // check if author link, like button, or sub box don't exist
        if (!author.exists || !like.exists || !subBox.exists) {
            throw new Error('Error: Either the Author link, Like button, or Sub Box does not exist.');
        }

        // grab the author text and href
        authorText = author.text();
        authorHref = author.prop('href');

        // figure out the username of the video author
        if ( authorHref.match(uRegex) ) {
            usernameHref = authorHref.match(uRegex)[1];
        }
        usernameText = authorText.replace(spaces, '');

        // try to click like
        if ( GM_config.get('auto') === true || ( auto_like_list.match(rBlank) === null && ( usernameHref.match(pass) || usernameText.match(pass) ) ) ||
               (likeSubscribedChannels === true && subBox.attribute('data-is-subscribed').match(rSubscribed) ) ) {
            if ( !isPressed(like) && !isPressed(dislike) ) {
                window.setTimeout(click, 750, like);
                JSL.clearInterval(intv);

                // if enabled, close the "share" box that appears after liking a video
                if (GM_config.get('closeShare') === true) {
                    window.setTimeout(waitForShare, 3500);
                }
            }
        }
    }

    // make sure the page is not in a frame
    if (window.frameElement || window !== window.top) { return; }

    if (typeof GM_registerMenuCommand === 'function') {
        GM_registerMenuCommand('YouTube Auto-Like Options', GM_config.open);
    }

    GM_config.init('YouTube Auto-Like Options', {
        auto : {
            section : ['Main Options'],
            label : 'Auto-like ALL videos?',
            type : 'checkbox',
            'default' : true,
            title : 'Enabling this will make you "Like" all videos'
        },
        closeShare : {
            label : 'Auto-close Share Box After Liking',
            type : 'checkbox',
            'default' : false,
            title : 'Enabling this will close the Share box after the video gets "Liked"'
        },
        likeSubscribedChannels : {
            label : 'Auto-like Videos From Subscribed Channels',
            type : 'checkbox',
            'default' : false,
            title : 'If a video was uploaded by a channel you\'re subscribed to, it will like it'
        },
        list : {
            section : ['Specific Usernames'],
            label : 'List the usernames of the users\' videos you want to auto-like.',
            type : 'textarea',
            cols : 80,
            rows : 20,
            'default' : 'Write usernames here separated by lines',
            title : 'This feature will be enabled if the previous feature is disabled.'
        }
    });

    Object.defineProperty(String.prototype, 'prepareRegex', {
        enumerable : false,
        value : function () {
            return this.replace(/[*^&$.()?+{}|\[\]\/\\]/g, '\\$&');
        }
    });

    auto_like_list = GM_config.get('list');
    likeSubscribedChannels = GM_config.get('likeSubscribedChannels');

    // convert the list of channel names to a regular expression
    pass = new RegExp('(' + auto_like_list.trim().replace(spaceRegex, '').prepareRegex().replace(newlineRegex, '|') + ')', 'i');

    // Run a function when the page is fully loaded
    JSL.runAt('end', function() {
        addButtonToContainer('Auto-Like Options', GM_config.open);

        // try to 'like' the video for 30 seconds max
        window.setTimeout(function () {
            timeStart = Date.now();

            intv = JSL.setInterval(function () {
                doLike();
            }, 750);
        }, 1000);
    });

}());