// ==UserScript==
// @name         WME User's Forum Links
// @description  Add user's forum links when selecting a segment/venue/big junction
// @namespace    https://greasyfork.org/users/gad_m/wme_user_forum
// @version      0.1.14
// @author       gad_m
// @license      MIT
// @include 	 /^https:\/\/(www|beta)\.waze\.com\/(?!user\/)(.{2,6}\/)?editor.*$/
// @exclude      https://www.waze.com/user/*editor/*
// @exclude      https://www.waze.com/*/user/*editor/*
// @icon         data:image/gif;base64,R0lGODlhDQAMANUgAPLy8vz8/PDw8Pb29vX19ezs7Pj4+Ojo6O3t7ff39/n5+d7e3vPz8+Hh4dTU1Orq6vHx8e/v7/r6+t3d3fT09OXl5fv7+9zc3OTk5O7u7uPj4+np6efn51WkzgN9uv///8rc6wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAACAALAAAAAANAAwAAAZPQJBQ2PF0hkii52NMKj/QJrIIPUSPz0/EUbiCqB/AYnIRXJefAaeC0TQAZ48BUXhsDgSPdMkAQAQZTEhLBgkDBBSCQ0sBARYSCopKepRSQQA7
// @downloadURL https://update.greasyfork.org/scripts/425897/WME%20User%27s%20Forum%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/425897/WME%20User%27s%20Forum%20Links.meta.js
// ==/UserScript==

/* global W */
/* global jQuery */

(function() {

    let usersMap = new Map();

    if (typeof W !== 'undefined' && W['userscripts'] && W['userscripts']['state'] && W['userscripts']['state']['isInitialized']) {
        console.debug('wme-user-forum: WME is initialized.');
        init();
    } else {
        console.debug('wme-user-forum: WME is not initialized. adding event listener.');
        document.addEventListener("wme-initialized", init, {
            once: true,
        });
    }

    function init() {
        console.info("wme-user-forum: init()");
        W['selectionManager']['events'].register("selectionchanged", null ,objectSelectionChanged);
    } // end init()

    function objectSelectionChanged(event) {
        let selectedObjects = W['selectionManager'].getSelectedDataModelObjects();
        if (selectedObjects.length === 1) {
            selectedObjects.forEach(function(element) {
                let objectType = element.type;
                let isResidential = element.attributes['residential'];
                if (objectType === 'segment' || (objectType === 'venue' && !isResidential) || objectType === 'bigJunction' || objectType === 'mapComment') {
                    let createdBy = element.attributes['createdBy'];
                    let updatedBy = element.attributes['updatedBy'];
                    console.info('wme-user-forum: segmentSelectionChanged() element is segment/venue(not residential)/big junction/comment');
                    if (createdBy) {
                        updateForumUser(createdBy);
                    }
                    // not new and different from
                    if (updatedBy && updatedBy !== createdBy) {
                        updateForumUser(updatedBy);
                    }
                } else {
                    console.debug("wme-user-forum: selected not supported: '" + objectType + "'");
                }
            });
        }
    }

    function waitForElm(selector) {
        console.debug("wme-user-forum: waitForElm()");
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    function getCsrfToken(cb) {
        Promise.resolve(W.loginManager._getCsrfToken()).then(function(csrfToken) {
            if (csrfToken) {
                console.info("wme-user-forum: Got CSRF token: " + csrfToken);
                cb(csrfToken);
            } else {
                console.error("wme-user-forum: Failed getting CSRF token");
            }
        });
    }

    function getUserForumID(userName, cb) {
        if (usersMap[userName]) {
            console.debug("wme-user-forum: getUserForumID(): " + userName + " from cache: " + usersMap[userName]);
            cb(usersMap[userName]);
        } else {
            getCsrfToken(function (csrfToken) {
                let url = "https://www.waze.com/forum/memberlist.php?mode=searchuser&username=" + userName;//"https://" + document.location.host + W.Config.paths.features;
                //console.debug("wme-user-forum: getUserForumID() url: " + url);
                jQuery.ajax({
                    method: "GET",
                    url: url,
                    headers: {
                        "Accept":"text/html"
                    },
                    success: function (data, textStatus, jqXHR) {
                        const array = [...data.matchAll(/.*viewprofile&amp;u=(\d*)".*/g)];
                        if (array && array.length ===2 && array[1] && array[1].length === 2) {
                            let userForumID = array[1][1];
                            console.info("wme-user-forum: Got user forum ID: '" + userForumID + "'");
                            usersMap[userName] = userForumID;
                            cb(userForumID);
                        } else {
                            console.error("wme-user-forum: getUserForumID(): regexp: " + array + " not found. returning 'null' for user: '" + userName + "'. Search URL: " + url);
                            cb(null);
                        }
                    }, error: function (data, textStatus, jqXHR) {
                        console.error("wme-user-forum: Failed getting forum user ID for user: '" + userName + "'. URL: '" + url + "' Data:\n"+ JSON.stringify(data, null, 4));
                    }
                });
            });
        }
    }

    function updateForumUser(userIdWme) {
        let userName = W.model.users.objects[userIdWme].userName;
        let q = "wz-a[href*='user/editor/" + userName + "']";
        console.info("wme-user-forum: For user ID in WME: " + userIdWme + " user name is: " + userName);
        waitForElm(q).then((elm) => {
            getUserForumID(userName, function (userForumID) {
                console.info("wme-user-forum: For user name '" + userName + "' Got user forum ID: '" + userForumID + "'");
                let userNameLinks = jQuery(q);
                console.info("wme-user-forum: For user name '" + userName + "' Number of user links: " + userNameLinks.length + " (jQuery(\"" + q + "\").length)");
                userNameLinks.each(function () {
                    if (userForumID) {
                        jQuery(this).after("&nbsp;<wz-a href=\"https://www.waze.com/forum/search.php?keywords=" + userName + "\" target=\"_blank\" style=\"text-decoration: none\" title=\"Search the user name in forum\">search</wz-a>&nbsp;|");
                        jQuery(this).after("&nbsp;<wz-a href=\"https://www.waze.com/forum/search.php?sr=posts&author_id=" + userForumID + "\" target=\"_blank\" style=\"text-decoration: none\" title=\"Search for user's posts\">posts</wz-a>&nbsp;|");
                        jQuery(this).after("&nbsp;&nbsp;<wz-a href=\"https://www.waze.com/forum/memberlist.php?mode=viewprofile&u=" + userForumID + "\" target=\"_blank\" style=\"text-decoration: none\" title=\"View user profile in forum\">profile</wz-a>&nbsp;|");
                        jQuery(this).after("<br/>");
                        jQuery(this).after(userName + ":");
                        jQuery(this).after("<br/>");
                    } else {
                        console.info("wme-user-forum: For user name '" + userName + "' userForumID not found");
                        jQuery(this).after("&nbsp;&nbsp;N/A");
                    }
                });
            });
        });
    }

}.call(this));