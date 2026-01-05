// ==UserScript==
// @name         Website Sidebar
// @locale       English (en)
// @namespace    COMDSPDSA
// @version      22
// @description  Gets rid of ads on Facebook, adds non-distracting "column view"
// @author       Dan Overlander
// @include      *facebook*com*
// @include      *twitter*com*
// @include      *minds*com*
// @include      *gab*com*
// @include      *feedly*com*
// @include      *dissenter*com*
// @include      *washingtonpost*com*
// @//require    https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require	     https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min.js
// @require      https://greasyfork.org/scripts/23115-tampermonkey-support-library/code/Tampermonkey%20Support%20Library.js?version=730858
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25482/Website%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/25482/Website%20Sidebar.meta.js
// ==/UserScript==

// Since v22: null check added. Removed Mastodon
// Since v21: New way of hiding sponsored posts.  REALLY PROBABLY hides more than just sponsored posts, but whatever.
// Since v20: Added Washingtonpost, Dissenter, Mastodon. Removes Tamper Global script dependency.
// Since v18: hides stories on FB. Tamperlibrary link updated.  Added Twitter.
// Since v17: Added Feedly
// Since v16: Hides laugh icons on Facebook. Moving to multi-site mode; covering FB, Minds, Gab...
// Since v15: Removed the chat on column mode
// Since v14: fiddling with ad remover. sigh.
// Since v13: fixed the count of removed ads/tmLogo better.
// Since v12: re-enabled tm logo, adds count of removed ads to its text
// Since v11: added userContentWrapper back to sponsored class identifiers, removed logging
// Since v11: added fbUserStory to sponsored class identifiers
// Since v10: updated sponsored class identifier; adds null/undefined check for fbUserPost and if so, uses fbUserContent
// Since v09: updated sponsored class identifier.
// Since v08: Scales images and MAYBE videos to single-column width
// Since v07: Adjusts most CSS changes, adding media rule to apply them only during "column view", including making the font smaller.
// Since v06: Creates "skinny hidden reading" mode; when page is at smallest-width, it also sets images to 20% opacity unless rolled over.
//            Changes ad-hiding algorithm; it seems FB changed their class names. I suppose they do that occasionally for scripts like this.
// Since v05: hides notifiction jewel at smallest width/resolution
// Since v04: different algorithm again
// Since v03: makes fewer log statements
//          : different way of trying to identify ads
// Since v02: hides notifications
// Since v01: hides ads during scrolling
// Since v00: initial script

/*
 * tm is an object included via @require from DorkForce's Tampermonkey Assist script
 */

(function() {
    'use strict';

    var global =
        {
            ids: {
                scriptName: 'Website Sidebar',
                prefsName: 'sidebarPrefs'
            },
            prefs: {},
            handlePrefsLocally: true,
            adsRemoved: 0,
            TIMEOUT: 750,
            targets:[
                {
                    titleElement: 'pagelet_bluebar',
                    initializeOnElement: 'globalContainer'
                }
            ],
        },
        toggle = {
            isResetting: undefined,
            isScrollInitialized: false,
            areClassesAdded: false
        },
        pages = [
            {
                initialize: function () {
                    setTimeout(function () {
                        tm.addClasses();
                        pages[0].addClasses();
                        pages[0].setTamperIcon(global);
                        utils.processFacebook();
                        if (document.URL.indexOf('washingtonpost') > -1) {
                            pages[0].parseWashPost();
                        }
                        pages[0].scrollTrigger();
                    }, global.TIMEOUT);
                },
                addClasses: function () {
                    if (!toggle.areClassesAdded) {
                        toggle.areClassesAdded = true;

                        // tampermonkey script identifier
                        tm.addGlobalStyle('.tamperlabel { position: absolute; z-index: 999; top: 8px; left: 8px; text-align: center; width:25px; height:25px; background-color:cornsilk; cursor:pointer; font-size:0.5em; font-weight:normal; color:goldenrod; line-height:25px }');

                        if (document.URL.indexOf('feedly') > -1) {
                            tm.addGlobalStyle('@media only screen and (max-width: 32em) { ' +
                                              '.entryBody { padding-left:20px; }' +
                                              'iframe, img, .entryHeader, .entryBody { max-width:340px !important; }' +
                                              'img, .visual { opacity: .2 !important; } img:hover, .visual:hover { opacity: 1 !important; }' +
                                              '.visual { margin-right:0px; }' +
                                              '.entry .content { max-width:190px; }' +
                                              '.entry .content .summary, .entry .content .metadata { font-size:xx-small; }' +
                                              '.entry .content .title { font-size:small; }' +
                                              '}');
                        }

                        if (document.URL.indexOf('dissenter') > -1) {
                            tm.log('THIS DOES NOT WORK');
                            tm.addGlobalStyle('@media only screen and (max-width: 32em) { ' +
                                              '.comment-container, .dissent-home, .card, .comment-page-list, .comment-composer-container, .nav, .domain-name { max-width:340px !important; }' +
                                              'img, .preview-image, .embed-responsive { opacity: .2 !important; } img:hover, .preview-image:hover, .embed-responsive:hover { opacity: 1 !important; }' +
                                              '}');
                        }

                        if (document.URL.indexOf('twitter') > -1) {
                            tm.addGlobalStyle('@media only screen and (max-width: 32em) { ' +
                                              '.entryBody { padding-left:20px; }' +
                                              '.stream-items { max-width:440px !important; }' +
                                              'img { opacity: .2 !important; } img:hover { opacity: 1 !important; }' +
                                              '}');
                        }
                        if (document.URL.indexOf('facebook') > -1) {
                            // limit feed width
                            tm.addGlobalStyle('@media only screen and (max-width: 32em) { div[aria-label="News Feed"] { max-width:380px; }}');
                            // hide stories
                            tm.addGlobalStyle('@media only screen and (max-width: 32em) { #stories_pagelet_below_composer { display: none !important; }}');
                            // hide page sidebars
                            tm.addGlobalStyle('@media only screen and (max-width: 32em) { #entity_sidebar { display: none !important; }}');
//                             tm.addGlobalStyle('@media only screen and (max-width: 32em) { #content_container { position:relative; left:-185px; }}');
                            tm.addGlobalStyle('@media only screen and (max-width: 32em) { #pagelet_timeline_main_column { max-width:360px; }}');
                            // hide notifications icon
                            tm.addGlobalStyle('@media only screen and (max-width: 32em) { #fbNotificationsJewel { display: none !important; }}');
                            // resize images for single column
                            tm.addGlobalStyle('@media only screen and (max-width: 32em) { video, .mtm img, .uiScaledImageContainer { max-width: 343px !important }');
                            // fade images / reveal on rollover
                            tm.addGlobalStyle('@media only screen and (max-width: 32em) { .mtm { opacity: .2 !important; } .mtm:hover { opacity: 1 !important; }}');
                            // hide leftcol
                            tm.addGlobalStyle('@media only screen and (max-width: 32em) {#stream_pagelet { width: 360px !important; } #leftCol { display: none !important; } .homeWiderContent { left: -20px; }}');
                            // global small font
                            tm.addGlobalStyle('@media only screen and (max-width: 32em) {* { font-size: 10px !important; }}');
                            // hide chat
                            tm.addGlobalStyle('@media only screen and (max-width: 32em) {.fbDockWrapperRight { display:none; }}');
                        }

                        if (document.URL.indexOf('minds.com') > -1) {
                            tm.addGlobalStyle('@media only screen and (max-width: 32em) {.m-page img { opacity: .2 !important; } .m-page img:hover { opacity: 1 !important; }}');
                            tm.addGlobalStyle('@media only screen and (max-width: 32em) {.m-newsfeed { max-width:360px; margin:0px; }}');
                        }

                        if (document.URL.indexOf('gab.com') > -1) {
                            tm.addGlobalStyle('@media only screen and (max-width: 32em) {.account__avatar,      .page__columns img,       .page__columns video       { opacity: .2 !important; }}');
                            tm.addGlobalStyle('@media only screen and (max-width: 32em) {account__avatar:hover, .page__columns img:hover, .page__columns video:hover { opacity: 1  !important; }}');
                            tm.addGlobalStyle('@media only screen and (max-width: 32em) {.media-gallery { min-height:220px; }  .media-gallery:hover { min-height:280px; }}');
                            tm.addGlobalStyle('@media only screen and (max-width: 32em) {.page__columns { max-width:375px; }}');
                            tm.addGlobalStyle('@media only screen and (max-width: 32em) {.tabs-bar { max-width:390px; }}');
                        }

                        if (document.URL.indexOf('washingtonpost') > -1) {
                            tm.addGlobalStyle('@media only screen and (max-width: 32em) { ' +
                                              'article { padding:20px; max-width:350px; }' +
                                              'img { opacity: .2 !important; } img:hover { opacity: 1 !important; }' +
                                              '}');
                        }
                    }
                },
                setTamperIcon: function () {
                    // Add Tampermonkey Icon with label to identify this script
                    if (!toggle.isResetting) {
                        var myLabel = utils.getByClass('tamperlabel');
                        if (myLabel != null) {
                            myLabel.parentNode.removeChild(myLabel);
                        }

                        toggle.isResetting = setTimeout(function() {
                            var myLabel = utils.getByClass('tamperlabel');
                            if(myLabel != null) {
                                myLabel.setAttribute('title', myLabel.title + ' | ' + global.ids.scriptName);
                            } else {
                                var newdiv = document.createElement('DIV');
                                newdiv.setAttribute('class', 'tamperlabel');
                                newdiv.setAttribute('title', 'Tampermonkey scripts: ' + global.ids.scriptName);
                                newdiv.appendChild(document.createTextNode('tm'));
                                document.body.appendChild(newdiv);
                            }
                            toggle.isResetting = undefined;
                        }, global.TIMEOUT*2);
                    }
                },
                hideLaughs: function () {
                    var laughs = document.querySelectorAll('[aria-label*="Haha"]');
                    _.each(laughs, (laugh) => {
                        laugh.style.display = 'none';
                    });
                    laughs = document.getElementsByClassName('_3j7o');
                    _.each(laughs, (laugh) => {
                        utils.closest(laugh, 'span').style.display = 'none';
                    });


//                     laughs = document.querySelectorAll('img'); // doesnt work
//                     _.each(laughs, (laugh) => {
//                         if (laugh.src.indexOf('yzxDz4ZUD49.png' > 0)) {
//                             var thisParent = utils.closest(laugh, '.anchorContainer');
//                             thisParent.style.display = 'none';
//                         }
//                     });
                },
                hideAds: function () {
                    var pEl;
                    utils.getElements('i', 'class', 'lock', (tag) => {
                        pEl = utils.closest(tag, '.userContentWrapper');
                        if (pEl != null && pEl.style != null) {
                            pEl.style.display = 'none';
                        }
                    });
                },
                parseWashPost: function () {
                    $('script').remove();
                    $('article').removeClass('paywall');
                    $('article').prependTo('head');
                    $('body div').remove();
                    $('.grey-bg').remove();
                    $('article').prependTo('body');
                },
                scrollTrigger: function () {
                    if (!toggle.isScrollInitialized) {
                        toggle.isScrollInitialized = true;

                        var didScroll = false,
                            doThisStuffOnScroll = function () {
                                didScroll = true;
                                utils.processFacebook();
                                var tmLabel = utils.getByClass('tamperlabel');
                                var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                                if (tmLabel != null) {
                                    tmLabel.style.top = (scrollTop+8) + 'px';
                                }
                            };

                        window.onscroll = doThisStuffOnScroll;

                        setInterval(function() {
                            if(didScroll) {
                                didScroll = false;
                                //console.log('You scrolled');
                            }
                        }, global.TIMEOUT);
                    }
                },
                resetTitle: function () {
                    // hide notifications from window title
                    window.document.title = 'Facebook';
                    setTimeout(pages[0].resetTitle, global.TIMEOUT );
                }
            }
        ],
        utils = {
            processFacebook: function() {
                if (document.URL.indexOf('facebook') > -1) {
                    pages[0].resetTitle();
                    pages[0].hideLaughs();
                    //pages[0].hideAds();
                }
            },
            getElements: function(tagName, attribute, value, callback) {
                var tags = window.document.getElementsByTagName(tagName);
                for (var i=0; i < tags.length; i++) {
                    var tag = tags[i];
                    if (attribute === 'class') {
                        if (tag.getAttribute(attribute) != null && tag.getAttribute(attribute).indexOf(value) > -1) {
                            callback(tag);
                        }
                    } else {
                        if (tag.getAttribute(attribute) === value) {
                            callback(tag);
                        }
                    }
                };
            },
            getByClass: function(classname) {
                return document.getElementsByClassName(classname)[0];
            },
            closest: function (el, selector) {
                var matchesFn;

                // find vendor prefix
                ['matches','webkitMatchesSelector','mozMatchesSelector','msMatchesSelector','oMatchesSelector'].some(function(fn) {
                    if (typeof document.body[fn] == 'function') {
                        matchesFn = fn;
                        return true;
                    }
                    return false;
                });

                var parent;

                // traverse parents
                while (el) {
                    parent = el.parentElement;
                    if (parent && parent[matchesFn](selector)) {
                        return parent;
                    }
                    el = parent;
                }

                return null;
            }
        };

    /*
     * Global functions
     */

    setTimeout(loopMain, global.TIMEOUT);

    function loopMain () {
        pages[0].initialize();
    }

    window.onclick = function () {
        loopMain();
    };

})();