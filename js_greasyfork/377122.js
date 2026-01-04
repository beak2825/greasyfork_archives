// ==UserScript==
// @name			Gitlab Mods
// @namespace		COMDSPDSA
// @version			5.18
// @description		Adds colored sections, extra functionality, and avatars to Gitlab. For avatars, detects locally-running image server to use for replacements of avatars. Use http-server (https://www.npmjs.com/package/http-server) for node.js for simple image hosting. Recommend image size of 100x100.
// @author			Dan Overlander
// @include			*/gitlab.dell.com*
// @require			https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require         https://greasyfork.org/scripts/23115-tampermonkey-support-library/code/Tampermonkey%20Support%20Library.js?version=907043
// @require		    https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min.js
// @require         https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment-with-locales.min.js
// @require         https://greasyfork.org/scripts/40055-libraryjquerygrowl/code/libraryJQueryGrowl.js
// @require         https://cdnjs.cloudflare.com/ajax/libs/showdown/1.9.1/showdown.min.js
// @require         https://unpkg.com/popper.js@1
// @require         https://unpkg.com/tippy.js@4
// @resource        https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css
// @grant           GM_setValue
// @grant           GM_getValue

// @downloadURL https://update.greasyfork.org/scripts/377122/Gitlab%20Mods.user.js
// @updateURL https://update.greasyfork.org/scripts/377122/Gitlab%20Mods.meta.js
// ==/UserScript==

// TODO: account for breadcrumbs with two+ expansions
// TODO: Make *hourly* reminders show only once no matter how many tabs for Gitlab are open.
// TODO: Fix bugs in global.mems.mergeRequestNotes for working across multiple tabs: When global.mems is saved in each tab, they can get overwritten, I think, if updated in one tab and not in another tab.
// TODO: Maybe? Fixed resolved/unresolved thread coloration in MR's (now, only the top-most headline container changes color, not the children.)

// Since v05.18: Updated MR (Merge Request) Angular Commit Format validation
// Since v05.17: Updated "open review app" element identifier.
// Since v05.16: Shrinks pipeline stage indicators. Updated debug-logging again.  Removing the "My Checklist" button from the MR list page. Highlight/grays-out Draft MRs in the MR list.  Applies background pattern to merges in /compare/ pages that match global.prefs.mrPrefixes. Replacing Gravatars with custom avatars if selected.
// Since v05.15: Adjusts aside appearance to allow for more icons at lower resolution without scrolling.  Added more default PivotalMaps. Always fixed scrollAfterCollapsed. Nullcheck for matchedCite. Tweaked color of Top/Act/View buttons. Tweaked debug logging. Fixed member list avatars. Made copy-title-as-markdown into a single copy (previously copied text then as-markdown).  Updated class for finding MR title and pipeline-log-scroll-to-line method, to match Gitlab's changes. Added option to use non-draft MR's as TODO count. No more avatar flicker when using a localhost source.
// Since v05.14: Debug/fix for pivotal.defineProject method.  Added avatars to dashboard.  MoreTools styles fixed to expand labeling visibility.
// Since v05.13: Increased min-height of .note-header to prevent activity lines from wrapping. reduced margin on favorites buttons. Finding some default colors for Gitlab Dark Mode. PivotalTracker-integration bug fixes. Added prefix warning/reminder for MRs.
// Since v05.12: Added ability to change font size of pipelineLogFilters. Tweaked the re:subject in initiating a Teams message from an MR. Breadcrumb prevented from expanding twice. *Important: Reconnects PivotalTracker after Gitlab UI updates.
// Since v05.11: Removing "Review%20requested%20from%20M" from avatar names. Removed MR NOTES EMPTY growl.
// Since v05.10: Compatibility updates with Gitlab changes.
// Since v05.90: Fixed bug in start-Teams-chat method. Fixed bug in display of anchor tags within user comments. Fixed bug in pipeline log filtering. Prefs window now easier to use (proper JSON display. boolean-toggle buttons.).
//               Pipeline job details; collapsing "Getting from git repository" folder by default.  Pipeline jobs pages collapse redundant sections by default, but automatically open when taking the shortcut to highlighted lines within them.
//               Added Slack and email integration to user popups. Functional stage flyout menu no longer needs scrolling for 10 items. Bug fixes for merge request note-taking feature.
//               Fixed two "X" icons from showing in dismiss-announcement area.  NOW, the merge request console-log scanner is fixed - AND is customizable via user prefs.  ALL logging moved behind debugMode=true.
//               Added growl notifications for "previously approved's". Hide the "Some changes are not shown" div by default because who needs that and it takes up space.
// Since v05.80: Allows repetitive Pivotal Description lines to be condensed to ellipses.  Adds popover user menus to all avatars. View Site should now appear more accurately (it WAS showing even after the Review Site had expired). Adds a restart-pipeline button to regnerate the ENTIRE pipeline on an MR (requires that you create/use an API key for Gitlab)
// Since v05.70: cleans MR page of any links targeting "PASTEHERE" - TODO: can be upgraded with better enhancements and null-checks. Fixed bug with UserFaves. New tamperlibrary with copy preferences button. Linked "Chat" icon in merge request list to show chats (comments on MR) in a modal window rather than navigating to that page. Added copy title as Markdown for MRs. Added "Gather Release" button for Merged MR page.
// Since v05.60: ADDS Pivotal Story Details to Gitlab MR scren.  Moved utils to be defined at top, so as to include methods previously required to be defined earlier.  Unified definition of default avatar images. Allowing user preferences to be defined as true objects, not objects-as-strings (no longer will users have to reset preferences to accept new preference definitions).  Code Cleanup; moving globally-declared identifying information to global.ids object. Removed getStoryActivity as that was dumb and we dont need story history here. Colorized the required/remaining Approval Rules on the MR list screen; colors are set via user prefs. Updated Tamperlibrary to prevent tampericon unbind/bind event action. Improved MR-screen image lightbox interface.
// Since v05.50: Working on remembering Pivotal Tracker review-type choice/preference; Redesigned log highlighter including user color preference.  Added POST comment for Pivotal Tracker.  Collapsible sidebar tools area to shove aside portions we never use. Expanded breadcrumb font size matches pre-expanded size. Automatically sets pivotal story to started if unstarted (can be disabled via preference).
// Since v05.40: Increased delay/amount of delayUntil chances. Increased initial delay of script - suspected interference with display of SVGs from Gitlab.  Added icon for ally-req PT review type. Added "Show Needed Approvals" button on Merge Request page. Renamed "Filter Merges" button to "My Checklist"
// Since v05.30: Bug fixes. Mousemove no longer inits page while prefs window is open. Tampericon changed to remove website img. added filter merges button.
// Since v05.20: Unrestricting inline view to 925px; now allowed to show full browser width. dimApprovedRequests.  Added Pivotal Tracker API integration.  User Popup has link to Teams chat. Probably many other small upgrades.  Semi-beta version, here.
// Since v05.10: Added View Site shortcut to top nav bar. update PT title linker
// Since v05.00: Added pipeline error growl notifications, colorized notes on code reviews that are not associated with line numbers.
// Since v04.99: Changed PT linking.
// Since v04.98: Fixed the alert-wrapper problem.
// Since v04.97: Moving alert removal to alert-wrapper. May need further investigation
// Since v04.96: Added remove-alert button.  Figure out why some notes are not colored
// Since v04.95: Added bisque color for active tabs; partial.
// Since v04.90: Modified the "Act" button to first click the Overview tab before scrolling to the Approve link.
// Since v04.80: Realized Gitlab's new navigation can lead to moments where the Approve button is nowhere near the top, so split main nav new button into two, "Act", and "Top"
// Since v04.70: Altered "Discussions" button to be "Top" button.  Added a reset-timeout for adding the Changes tab's font-size and collapse/expand buttons.
// Since v04.60: Updated unresolved locator to match Gitlab-changed text
// Since v04.50: Fixed TODO default prompt for new users
// Since v04.40: Added visual indicator of TODO count activity (badge count background color change). Updated to latest tamperlibrary script version.  .. Some setPrefs extra line / bug line removed. Removes dependency on Tamper Global script.
// Since v04.30: Adjusted todo element identifier to match update from Gitlab, fixing TODO monitor.
// Since v04.20: Removed identicon from breadcrumb trail as without an image it looked weird. Important - TODO bugfix for undefined error!
// Since v04.10: Fixed the hourlies reminders.  Added user option to hide "err" code background color.
// Since v04.00: Resovled intermittent (?) avatar photo failures, allowing back in a XX second timer for reinitialization.  Added ability to reset page memory. If the TODOS count changes and you're on the TODO page, auto-reload.
// Since v03.91: User Preferences to control main functions of plugin! Avatar name tweaks.
// Since v03.90: Added comments to AT SOME POINT figure out why the Collapse All buttons are not working all the time. Added other avatar locations. Made a default broken-image "no avatar" avatar. System stops attempting to replace missing avatars if not found on the local server. TODO monitoring no longer requires a separate page to be open, and automatically updates the indicator on every page.
// Since v03.80: Expanded bot detection to include array created via regex
// Since v03.70: Optimized avatar location methods
// Since v03.60: Button bug fixes. Renamed comparisonSize. Moved default- and small- font sizes to userprefs. Hides the "nothing here block" divs. Scrolls to collapsed div when tall divs are collapsed. All states moved to global.states.  Avatar ping functionality disabled if server isn't running.
// Since v03.50: argh. They change the DOM, breaking the expand/collapse functions. Fixed and in a more flexible manner.
// Since v03.30: Gitlab changed a classname, which broke the Discussions button. Fixed in a more flexible manner.
// Since v03.20: Moving .fingery class to global script. Moving out setTamperIcon
// Since v03.10: Made comparisonSize font alteration more inclusive. Filtering out "Americas" from avatar names. Removes vertical margin from fingery class
// Since v03.00: Set title TFS/PT scan to use case-insensivite checks
// Since v02.20: Links TFS and PT values in title to their respective URLs. Adds Font+/- button for comparison text
// Since v02.10: Since Gitlab removed their Expand All button (?!), this adds it back in...
// Since v02.00: Altered the logic of colorizing discussions to search for a more universal pass-fail value. Changes Discussions buttons from icon to text (and is therefore larger)
// Since v01.81: Removed old coffee cup button code. Added Collapse All Button with diff-collapsing function. Bug tweaks.
// Since v01.80: Some conversations were not being colorized.
// Since v01.75: Removes coffee-cup as it is native functionality, now. Yay Gitlab! Fixes a name-finding method that sometimes forgot to add a comma after spaces, for avatar images.
// Since v01.7: Fixes the click functionality of the tamperlabel, also makes it look clickable
// Since v01.6: Adds ability to hide header messages. Adds ability to erase Gitlab Mods memory by clicking on Tampermonkey icon (on this page, a battery in the lower-right corner)
// Since v01.5: Added a conditional close-footer button, close broadcast message button.  Adds memory states for these buttons (only for messages already seen!) as well as the close-tree (coffee) button. Expands breadcrumb dropdown.
// Since v01.4: Linked the notifications to the TODO page. Removed a log statement. Resets TODO page title when timer runs out if reload is cancelled. Slows down reminder by 1 hour (up to 8 times) because coming back to your computer after an extended period and receiving TONS of notifications is annoying
// Since v01.3: Re-enables the Tampericon
// Since v01.2: Adds "hide tree" button (looks like a coffee cup)
// Since v01.1: Updates document title with countdown timer indication.  Adds hourly reminder of existing TODOs. Removes conversation button from non-conversation pages.
// Since v01.0: Added the countdown indicator to the page title for TODO indication; cancelling reverts the title to original
// Since v00.0: init, copying from GIT Avatars script

/*
 * tm is an object included via @require from DorkForce's Tampermonkey Assist script
 */

(function() {
    var utils = {
		debug: function(msg) {
            let userSelectedIgnore = global.prefs.debugIgnores.includes(utils.debug.caller.name);
			if (global.prefs.debugMode && !userSelectedIgnore) {
                if (typeof msg === 'object') {
                    let hasSource = false;
                    if (msg.constructor === Array) {
                        msg.includes("iAm") && (hasSource = true);
                        userSelectedIgnore = global.prefs.debugIgnores.includes(msg.find(id => id === "iAm"));
                    } else {
                        const keys = Object.keys(msg);
                        keys.forEach((key, index) => {
                            !hasSource && (hasSource = key === "iAm");
                        });
                        userSelectedIgnore = global.prefs.debugIgnores.includes(msg.iAm);
                    }
                    if (hasSource) {
                        !userSelectedIgnore && console.log(msg);
                    } else {
                        console.log({'iAm': utils.debug.caller.name, ...msg});
                    }
                } else {
                    console.log({'iAm': utils.debug.caller.name, 're': msg});
                }
			}
		},
        capitalizeFirstLetter: function(string) {
            if (!string) {
                return;
            }
            return string.charAt(0).toUpperCase() + string.slice(1);
        },
        getElementByTextContent: function (str, partial, parentNode, onlyLast) {
            var filter = function(elem) {
                var isLast = onlyLast ? !elem.children.length : true;
                var contains = partial ? elem.textContent.indexOf(str) > -1 :
                elem.textContent === str;
                if (isLast && contains) {
                    return NodeFilter.FILTER_ACCEPT;
                }
            };
            filter.acceptNode = filter; // for IE
            var treeWalker = document.createTreeWalker(
                parentNode || document.documentElement,
                NodeFilter.SHOW_ELEMENT, {
                    acceptNode: filter
                },
                false
            );
            var nodeList = [];
            while (treeWalker.nextNode()) nodeList.push(treeWalker.currentNode);
            return nodeList;
        },
        delayUntil: function (id, condition, callback) {
            var repeat = function(id, co, ca) {
                setTimeout(() => {
                    utils.delayUntil(id, co, ca);
                }, TIMEOUT*2);
            }
            if (!global.states.delays.find((x) => x.delayId === id)) {
                global.states.delays.push({
                    delayId: id,
                    delayCount: 0
                });
            }
            global.states.delays.find((x) => x.delayId === id).delayCount++;
            if (global.states.delays.find((x) => x.delayId === id).delayCount > 20) {
                global.states.delays.find((x) => x.delayId === id).delayCount === 0;
                return;
            }
            try {
                if (!condition()) {
                    utils.debug('delay WAIT called by ' + id);
                    repeat(id, condition, callback);
                } else {
                    utils.debug('delay PASS for ' + id);
                    callback();
                }
            } catch (e) {
                utils.debug('delay WAIT called by ' + id + ' TRIED\n   ' + e);
                repeat(id, condition, callback);
            }
        },
        getPivotalStoryId: function () {
            var indexOfId,
                qsQuery = '.merge-request a[href^="https://www.pivotal"]';
            if (!document.querySelector(qsQuery)) {
                return;
            }
            var pivotalStoryIds = [];
            _.each(document.querySelectorAll(qsQuery), (storyEl) => {
                var thisHref = storyEl.href;
                indexOfId = thisHref.lastIndexOf('/') + 1;
                thisHref = thisHref.substr(indexOfId, thisHref.length - indexOfId);
                pivotalStoryIds.push(thisHref);
            });
            return pivotalStoryIds[0];
        },
        isNumeric: function(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        },
        initScript: function () {
            _.each(global.ids.triggerElements, (trigger) => {
                tm.getContainer({
                    'el': trigger,
                    'max': 100,
                    'spd': 1000
                }).then(function($container){
                    page.initialize();
                });
            });
        },
        listenOnce: function(element, event, handler) {
            element.addEventListener(
                event,
                function tempHandler(e) {
                    handler(e);
                    element.removeEventListener(event, tempHandler, false);
                },
                false
            );
        },
        getSlackId: function(thisNameFirst, thisNameLast) {
            var slackFind = global.prefs.slackMaps.find((x) => x.nameFirst === thisNameFirst && x.nameLast === thisNameLast.replace(/_/g, ''));
            if (slackFind) {
                slackFind = slackFind.slackId;
                return slackFind;
            } else {
                return null;
            }
        },
        pivotalHoursElapsed: function(timerId, howMany) {
            if (!global.mems.pivotalData.timers) {
                $.growl.notice({
                    message: 'Reset your app memory. global.mems.pivotalData.timers must be defined.',
                    size: 'large',
                    delayOnHover: true,
                    duration: 3200 // 3200 is default
                });
                return false;
            }
            utils.debug({'timers': global.mems.pivotalData.timers, 'timerId': timerId});
            if (!global.mems.pivotalData.timers.find((x) => x.id === timerId)) {
                global.mems.pivotalData.timers.push({
                    id: timerId,
                    expires: moment().subtract(48, 'hours')
                });
            }
            var duration = moment.duration(moment().diff(global.mems.pivotalData.timers.find((x) => x.id === timerId).expires)),
                hours = duration.asHours();
            if (hours >= howMany) {
                global.mems.pivotalData.timers.find((x) => x.id === timerId).expires = moment();
                return true;
            } else {
                return false;
            }
        },
        savedMems: function() {
            return JSON.parse(GM_getValue(global.ids.memsName));
        },
        scrollAfterCollapse: function() {
            if ($(this).offset().top < $(window).scrollTop() + 125) {
                utils.debug('scrollAfterCollapse --> should scroll');
                $('html, body').animate({ scrollTop: $(this).offset().top-160 }, 1000);
            } else {
                utils.debug('scrollAfterCollapse --> not needed');
            }
        },
        showGrowls: function(growlLow, growlMed, growlHigh) {
            if (growlLow && growlLow.length > 0) {
                $.growl.notice({
                    message: '<div class="growlMessage">' + growlLow + '</div>',
                    size: 'large',
                    delayOnHover: true,
                    duration: 3200 // 3200 is default
                });
            }
            if (growlMed && growlMed.length > 0) {
                $.growl.warning({
                    message: '<div class="growlMessage">' + growlMed + '</div>',
                    size: 'large',
                    delayOnHover: true,
                    duration: 6400 // 3200 is default
                });
            }
            if (growlHigh && growlHigh.length > 0) {
                $.growl.error({
                    message: '<div class="growlMessage">' + growlHigh + '</div>',
                    size: 'large',
                    delayOnHover: true,
                    duration: 9600 // 3200 is default
                });
            }
        },
        xhrAction: function(iAm, xhrType, urlPath, callback, alwaysCallback, params) {
            if (global.prefs.pivotalToken.length === 0) {
                return;
            }
            if (!iAm || !xhrType || !urlPath || !callback) {
                utils.debug('improper xhr setup');
                return;
            }
            utils.debug({'iAm': iAm, 'xhrType': xhrType, 'urlPath': urlPath, 'callback': callback, 'alwaysCallback': alwaysCallback, 'params': params});
            if (urlPath.indexOf('PIVOTALSTORYID') > 0) {
                var pivotalStoryId = utils.getPivotalStoryId();
                if (pivotalStoryId) {
                    urlPath = urlPath.replace('PIVOTALSTORYID', pivotalStoryId);
                } else if (global.prefs.debugMode) {
                    utils.debug(iAm + ' FAILED: Pivotal Story ID could not be determined.');
                    return;
                }
            }
            // Set up our HTTP request
            var xhr = new XMLHttpRequest();

            // Setup our listener to process completed requests
            xhr.onload = function () {
                global.states.xhrBusy = false;

                // Process our return data
                if (xhr.status >= 200 && xhr.status < 300) {
                    // What do when the request is successful

                    var resp = xhr.response;
                    if (resp) {
                        // resp = JSON.parse(resp).slice().reverse();
                        utils.debug({'iAm': 'xhrAction', 're': {'urlPath': urlPath, ...JSON.parse(resp)}});
                        callback(resp);
                    }
                } else {
                    // What do when the request fails
                    utils.debug('XHR Call for ' + iAm + ' failed!');
                }
                if (alwaysCallback) {
                    alwaysCallback();
                }
            };

            if (global.ids.pivotal.gitlabRelation != null) {
                var xhrUrl = 'https://www.pivotaltracker.com/services/v5/';
                if (urlPath === 'me') {
                    xhrUrl += urlPath;
                } else {
                    xhrUrl += 'projects/' + parseInt(global.ids.pivotal.gitlabRelation.project_id) + '/' + urlPath;
                }
                global.states.xhrBusy = true;
                xhr.open(xhrType, xhrUrl);
                xhr.setRequestHeader('X-TrackerToken', global.prefs.pivotalToken);
                if (params != null) {
                    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                    xhr.send(JSON.stringify(params));
                } else {
                    xhr.send();
                }
            } else if (global.prefs.debugMode) {
                utils.debug('Pivotal Settings Not Populated');
            }
        },
        gitlabXhr: function(xhrType, iAm, urlPath, callback) {
            var xhr = new XMLHttpRequest(); // define request
            xhr.onload = function () { // define listener for completion of request
                global.states.xhrBusy = false;
                // analyze the return
                if (xhr.status >= 200 && xhr.status < 300) { // successful request
                    var resp = xhr.response;
                    if (resp) {
                        resp = JSON.parse(resp);
                        callback(resp);
                    }
                } else { // failure
                    utils.debug('XHR for ' + iAm + ' failed!');
                }
            };
            xhr.open(xhrType, 'https://gitlab.dell.com/api/v4/projects/' + document.querySelector('body').getAttribute('data-project-id') + urlPath);
            if (global.prefs.gitlabToken) {
                xhr.setRequestHeader('PRIVATE-TOKEN', global.prefs.gitlabToken);
            }
            xhr.send();
        },
        userChatAction: function (idName, messageName) {
            // go to teams
            var chatLink = 'slack://user?team=T6R1XCQJ3&id=';
            if (idName.indexOf('_') > -1) {
                idName = idName + '@dell.com';
                chatLink = 'https://teams.microsoft.com/l/chat/0/0?users=';
            }
            var message = messageName ? '&message=' + messageName : '';
            window.open(chatLink + idName + message);
        },
        properName: function(thisName) {
            if (!thisName) {
                return;
            }
            var firstName = '',
                lastName = '',
                midName = '';

            thisName = thisName
                .replace('https://gitlab.dell.com/', '')
                .replace(' - Dell Team', '')
                .replace('\'s avatar', '')
                .replace('Assigned to ', '')
                .replace('Avatar for ', '')
                .replace(/dell\.com/gi, '')
                .replace(/dellteam\.com/gi, '')
                .replace('@', '')
                .replace(/@/g, '')
                .replace(/\//g, '')
                .replace(/Review requested from /g, '')
                .replace(/_/g, '-');
            firstName = thisName.substring(0, thisName.indexOf('-'));
            lastName = thisName.substring(thisName.indexOf('-')+1, thisName.length);
            if ((firstName.length === 0 && lastName.length === 0)) {
                return;
            }
            if (firstName.length > 0 && lastName.length > 0 && thisName.indexOf(',') < 0) {
                thisName = lastName + ', ' + firstName;
            }
            if (thisName.indexOf('-') > 0) {
                midName = thisName.substring(0, thisName.indexOf('-'));
                thisName = thisName.substring(thisName.indexOf('-')+1, thisName.length);
                thisName = thisName + ' ' + midName;
            }
            while (thisName.indexOf('  ') > 0) {
                thisName = thisName.replace(/\s\s/, ''); // no double spaces
            }
            thisName = thisName
                .replace(/(\r\n\t|\n|\r\t)/gm,'') // no line breaks or tabs
                .replace(/ ,/, ',') // no spaces before commas
                .replace(/\%20/, '') // no %20 characters
                .replace(/Americas/g, '')
                .trim(); // seriously, no extra spaces
            thisName = thisName.replace(',', ', ').replace('  ', ' '); // there's probably a less-stupid way of REALLY making sure it's always "COMMA SPACE"
            return thisName;
        },
        updateImg: function(img, thisName) {
            if (thisName != null) {
                if (thisName.length > 0 && thisName !== ', ') {
                    if ($(img).prop('src').indexOf('!none') <= 0 && ($(img).prop('src').indexOf('gitlab') > -1 || $(img).prop('src').indexOf('gravatar') > -1)) {
                        var nameDivider = (thisName.indexOf(',') < 0) ? ' ' : ', ';
                        var thisNameSpaceIndex = thisName.indexOf(' ') + 1;
                        var thisNameFirst = thisName.indexOf(' ') < 0 ? thisName : nameDivider === ' ' ? thisName.substr(0, thisName.indexOf(thisNameSpaceIndex)-1) : thisName.substr(thisNameSpaceIndex, thisName.length - thisNameSpaceIndex);
                        if (thisNameFirst.length === 0) {
                            thisNameFirst = thisName;
                        }
                        var thisNameLast = thisName.indexOf(' ') < 0 ? '' : nameDivider === ' ' ? '_' + thisName.replace(thisNameFirst + ' ', '') : '_' + thisName.replace(', ' + thisNameFirst, '');
                        var emailAddy;
                        if ($(img).attr('data-email') && $(img).attr('data-email').length > 0) {
                            emailAddy = $(img).attr('data-email');
                        } else {
                            emailAddy = thisNameFirst + thisNameLast;
                        }
                        var slackFind = utils.getSlackId(thisNameFirst, thisNameLast);
                        var tippyId = 'tippy' + thisNameFirst + thisNameLast + '-' + Math.floor(Math.random() * 999999999) + 1;
                        tippyId = tippyId.replace(/ /g, '');
                        var dataSubject;
                        if (document.querySelector('.qa-title')) {
                            dataSubject = 're: [' + document.querySelector('.qa-title').textContent + '](' + document.URL + ')'.replace('#', '');
                        }
                        if (global.states.avatarPingFailed === false && global.prefs.avatarPreference[0] === 'localhost' ) {
                            // look at why there's a difference handling localhost vs. the other avatar servers
                            $(img).prop('src', 'http://' + avatarHost + thisName + imageExt);
                        } else if (global.prefs.avatarPreference[0] !== 'localhost'){
                            var templateSrc = global.templates.default.replace(/IMGID/g, thisName).replace(/IMGALT/g, thisName);
                            templateSrc = encodeURI(templateSrc.substr(templateSrc.indexOf('http'), (templateSrc.indexOf('alt=') - templateSrc.indexOf('http'))-2));
                            $(img).prop('src', templateSrc);
                        }
                        var emailSubject = document.querySelector('.qa-title') ? document.querySelector('.qa-title').textContent : ' ';
                        var slackLink = slackFind ? '<li>' + thisNameFirst + ' on Slack: <span class="mycon instantUserChatLink outlined fingery" data-chatid="' + slackFind + '" data-subject="' + dataSubject + '" style="font-weight:bold;">🤙🏻</span></li>' : ''; // fa-hashtag
                        $(img)
                            .attr('data-tippy-id', tippyId)
                            .attr('data-content', '<ul class="userPopMenu">' +
                                  '<li>' + thisNameFirst + ' on Teams: <span class="mycon instantUserChatLink outlined fingery" data-chatid="' + emailAddy + '" data-subject="' + dataSubject + '" style="font-weight:bold;">📣</span></li>' + // fa-bullhorn
                                  slackLink +
                                  '<li><a style="text-decoration:none; color:inherit;" href="mailto:' + (emailAddy.match(/@/g) ? emailAddy : emailAddy+'@dell.com') + '?subject=' + emailSubject + '&body=ref- ' + document.URL + '">Email ' + thisNameFirst + ': <span class="mycon outlined fingery" style="font-weight:bold;">📧</span></a></li>' + // fa-envelope
                                 '</ul>');
                        if($(img).attr('class').split(' ').indexOf('modAdded') < 0) {
                            $(img).addClass('modAdded'); // do this ONCE per modded image
                            tippy('[data-tippy-id=' + tippyId + ']', {
                                content: $('[data-tippy-id=' + tippyId + ']').attr('data-content'),
                                interactive: true,
                                placement: 'left',
                                onShown: function() {
                                    $('.instantUserChatLink').bind('click', (e) => {
                                        utils.debug(e.target.dataset);
                                        utils.userChatAction(e.target.dataset.chatid, e.target.dataset.subject.replace(/#(?<=#)[^\]]+]/g, '').replace(/📰/g, ''));
                                    });
                                },
                                onHide: function() {
                                    $('.instantUserChatLink').unbind('click');
                                }
                            })
                        }
                    }
                } else {
                    utils.debug('updateImg: invalid user name for ' + img.src + ': ' + thisName + '(' + thisName.length + ' chars)');
                }
            }
        }
    };
    var TIMEOUT = 750,
        activityTimestamp = moment(),
        avatarHost = 'localhost:8675/', // for setPhoto
        pingPhoto = '!none', // pinging for setPhoto
        imageExt = '.png',
        global = {
            ids: {
                scriptName: 'Gitlab Mods',
                prefsName: 'gitlabPrefs',
                memsName: 'gitlabMems', // using this as a system-memory kind of thing.  Like the prefs but the user doesn't see them
                triggerElements: ['.content', '#root', '.ide-view'],
                gitlabUserId: null,
                listeners: [],
                pivotal: {
                    project: undefined,
                    story: undefined,
                    gitlabRelation: undefined
                }
            },
            states: {
                appendClickProcessed: false,
                areClassesAdded: false,
                arePrButtonsAdded: false,
                areFavesAdded: false,
                isBreadcrumbExpanded: false,
                areInterfaceButtonsAdded: false,
                delays: [],
                todoMonitorInitialized: false,
                titlesLinked: false,
                isMouseMoved: false,
                avatarPingFailed: null,
                arePipelinesChecked: false,
                xhrBusy: false,
                mergeRequestScanned: false,
                mergeRequestScanAndFound: false
//                 isFinallyDone: false
            },
            prefs: {},
            mems: undefined,
            reload: {
                lapsed: 0,
                timespan: 10000,
                title: document.title,
                todoTimer: undefined
            },
            templates: {
                default: null,
                localhost: '<img src="http://' + avatarHost + 'IMGID.png" alt="IMGALT" title="IMGALT" class="avatar s40" data-email="">',
                // adorable: '<img src="https://api.adorable.io/avatars/285/IMGID.png" alt="IMGALT" title="IMGALT" class="avatar s40" data-email="">',
                dicebear: '<img src="https://avatars.dicebear.com/api/bottts/IMGID.svg" alt="IMGALT" title="IMGALT" class="avatar s40" data-email="">',
                pivotalComment: '  <div class="sidebar-collapsed-icon dont-change-state">' +
                '    <button class="btn btn-clipboard btn-transparent">' +
                '      <span aria-hidden="true" data-hidden="true" style="margin-right:0;" class="mycon">💬</span>' + // fa-comments
                '      <span id="pivotalParticipants"></span>' +
                '    </button>' +
                '  </div>'
            }
        },
        page = {
            initialize: function () {
                setTimeout(function () {
                    page.setPrefs();
                    page.setMems();
                    tm.setTamperIcon(global);
                    tm.initNotes(global);
                    tm.addClasses();
                    page.addClasses();
                    page.setGitlabUserId();
                    page.pivotal.defineProject();
                    page.pivotal.getMembers();
                    page.pivotal.getMe();
                    page.pivotal.getReviewTypes();
                    page.pivotal.getStory();
                    page.adjustStyles();
                    page.addElements();
                    page.adjustMarkdown();
                    page.appendClickFunctions();
                    page.expandBreadcrumb();
                    page.setAvatars();
                    page.scanMergeRequest();
                    page.monitorTodos();
                    page.linkWorkItems();
                    page.checkForInactivity();
                    page.highlightComparisons();
                    page.dimApprovedRequests();
                    page.addChatsOnMrList();
                    page.addNotesToMergeRequests();
                    page.addFaves();
                    page.monitorPipelines();
                    page.collapseSidebarLowPriorities();
                    page.cleanMrTemplate();
                }, TIMEOUT);
            },
            setPrefs: function() {
                var currentPrefs = GM_getValue(global.ids.prefsName),
                    setDefaultPrefs = function() {
                        if (global.prefs.debugMode == null)                global.prefs.debugMode = false;
                        if (global.prefs.debugIgnores == null)             global.prefs.debugIgnores = [];
                        if (global.prefs.todosAreMrs == null)              global.prefs.todosAreMrs = false;
                        if (global.prefs.autohideNotification == null)     global.prefs.autohideNotification = true;
                        if (global.prefs.minimizeMetaInfo == null)         global.prefs.minimizeMetaInfo = true;
                        if (global.prefs.useLocalAvatars == null)          global.prefs.useLocalAvatars = false;
                        if (global.prefs.autoStartPivotalStories == null)  global.prefs.autoStartPivotalStories = false;
                        if (global.prefs.autoFinishPivotalStories == null) global.prefs.autoFinishPivotalStories = false;
                        if (global.prefs.mrPrefixes == null)               global.prefs.mrPrefixes = ['test', 'style', 'revert', 'refactor', 'perf', 'fix', 'feat', 'docs', 'chore', 'ci', 'build'];
                        if (global.prefs.avatarPreference == null)         global.prefs.avatarPreference = ['dicebear', 'localhost']; // ['dicebear', 'adorable', 'localhost']
                        if (global.prefs.colorsInterface == null)          global.prefs.colorsInterface = [
                            { 'element': 'mrHeadline', 'color': 'cornflowerblue' },
                            { 'element': 'mrActiveTab', 'color': 'bisque' },
                            { 'element': 'mrResolved', 'color': 'palegreen' },
                            { 'element': 'mrUnresolved', 'color': 'orange' },
                            { 'element': 'navButton', 'color': 'burlywood' },
                            { 'element': 'approvedRequestsDim1', 'color': 'lightgrey' },
                            { 'element': 'approvedRequestsDim2', 'color': 'aliceblue' },
                            { 'element': 'mrListBackground', 'color': 'bisque' }
                        ];
                        if (global.prefs.colorsRules == null)              global.prefs.colorsRules = [
                            { "ruleName": "Ready to Merge", "hexName": "limegreen" },
                            { "ruleName": "All Members", "hexName": "gold" },
                            { "ruleName": "Design", "hexName": "chocolate" },
                            { "ruleName": "Code", "hexName": "coral" },
                            { "ruleName": "Copied to Alpha", "hexName": "sandybrown" }
                        ];
                        if (global.prefs.useThumbnailImages == null)       global.prefs.useThumbnailImages = true;
                        if (global.prefs.hideCodeErrClass == null)         global.prefs.hideCodeErrClass = true;
                        if (global.prefs.pipelineLogFilters == null)       global.prefs.pipelineLogFilters = [
                            {"name": "failedTest", "key": "?", "background": "darkgoldenrod", "severity": "medium"}, // String.fromCodePoint(10005)
                            {"name": "error", "key": "error", "background": "red", "color": "white", "severity": "high"},
                            {"name": "weblink", "key": "http", "background": "green", "severity": "low"}
                        ];
                        if (global.prefs.pivotalToken == null)             global.prefs.pivotalToken = '';
                        if (global.prefs.gitlabToken == null)              global.prefs.gitlabToken = '';
                        if (global.prefs.pivotalMaps == null)              global.prefs.pivotalMaps = [
                            {
                                "project_id": "2203130",
                                "reference": "koa/ui-core/Themes/Documentation"
                            },
                            {
                                "project_id": "2203130",
                                "reference": "dao/dell-digital-design/design-language-system/systems/dls-1.0"
                            },
                            {
                                "project_id": "2448496",
                                "reference": "dao/dell-digital-design/design-language-system/systems/dls-2.0-data-vis"
                            },
                            {
                                "project_id": "2448496",
                                "reference": "dao/dell-digital-design/design-language-system/systems/dds-2.0-core"
                            },
                            {
                                "project_id": "2448496",
                                "reference": "dao/dell-digital-design/design-language-system/systems/dds-2.0-components"
                            },
                            {
                                "project_id": "2448496",
                                "reference": "dao/dell-digital-design/design-language-system/systems/dds-2.0-web-components"
                            },
                            {
                                "project_id": "2451317",
                                "reference": "dao/dell-digital-design/design-language-system/experiment/dls-2.0-alpha"
                            },
                            {
                                "project_id": "2203130",
                                "reference": "dao/dell-digital-design/design-language-system/examples/angular"
                            },
                            {
                                "project_id": "2457561",
                                "reference": "/dell-digital-design/design-language-system/support-sys/wagtail-cms"
                            }
                        ];
                        if (global.prefs.userFaves == null)                global.prefs.userFaves = [
                            {
                                "name": "Docs",
                                "url": "https://gitlab.dell.com/koa/ui-core/Themes/Documentation/-/merge_requests"
                            },
                            {
                                "name": "1.0",
                                "url": "https://gitlab.dell.com/dao/dell-digital-design/design-language-system/systems/dls-1.0/-/merge_requests"
                            },
                            {
                                "name": "2.0",
                                "url": "https://gitlab.dell.com/dao/dell-digital-design/design-language-system/systems/dls-2.0/-/merge_requests"
                            },
                            {
                                "name": "CMS",
                                "url": "https://gitlab.dell.com/dao/dell-digital-design/design-language-system/support-sys/-/merge_requests"
                            }
                        ];
                        if (global.prefs.pivotalDescriptionIgnores == null)  global.prefs.pivotalDescriptionIgnores = [];
                        if (global.prefs.offendingCode == null)              global.prefs.offendingCode = ['console.log'];
                        if (global.prefs.slackMaps == null)                  global.prefs.slackMaps = [];
                    };

                if (currentPrefs == null || _.isEmpty(JSON.parse(currentPrefs))) {
                    global.prefs = {};
                    setDefaultPrefs();
                    tm.savePreferences(global.ids.prefsName, global.prefs);
                } else {
                    global.prefs = JSON.parse(currentPrefs);
                    setDefaultPrefs();
                    for (var key in global.prefs) {
                        try {
                            if (global.prefs[key] === 'true' || global.prefs[key] === 'false') {
                                global.prefs[key] = (global.prefs[key] == 'true')
                            } else {
                                global.prefs[key] = JSON.parse(global.prefs[key]);
                            }
                        } catch (e) {
                            global.prefs[key] = global.prefs[key];
                        }
                    }
                }
                switch (global.prefs.avatarPreference[0]) {
                    // case 'adorable':
                    //     global.templates.default = global.templates.adorable;
                    //     break;
                    case 'dicebear':
                        global.templates.default = global.templates.dicebear;
                        break;
                    default:
                        global.templates.default = global.templates.localhost;
                        break;
                }
                // global.templates.default = global.prefs.avatarPreference[0] === 'adorable' ? global.templates.adorable : global.templates.dicebear;
            },
            setMems: function() {
                var currentMems = GM_getValue(global.ids.memsName);
                if (currentMems == null || _.isEmpty(JSON.parse(currentMems))) {
                    global.mems = {};
                    global.mems.todosCount = 0;
                    global.mems.todosTimestamp = moment();
                    global.mems.manyTabTimestamp = moment();
                    global.mems.manyTabReminderTime = moment();
                    global.mems.reloadTimesReminded = '0';
                    global.mems.reloadReminderCount = '0';
                    global.mems.archivedMessages = [];
                    global.mems.archivedBroadcasts = [];
                    global.mems.archivedAlerts = [];
                    global.mems.mergeRequestNotes = [];
                    global.mems.mrNoteState = 'auto';
                    global.mems.currentFontSize = global.defaultLineSize;
                    global.mems.defaultLineSize = '12px';
                    global.mems.smallLineSize = '10px';
                    global.mems.avatarPingTimer = global.mems.avatarPingTimer || undefined;
                    global.mems.pivotalData = {
                        states: {
                            storyExpanded: false
                        },
                        projects: [],
                        timers: []
                    };
                    tm.savePreferences(global.ids.memsName, global.mems);
                } else {
                    global.mems = JSON.parse(currentMems);
                }
                $('.line, .line span').css('font-size', global.mems.currentFontSize);
            },
            setGitlabUserId () {
                tm.getContainer({
                    'el': '.header-user-dropdown-toggle',
                    'max': 100,
                    'spd': 1000
                }).then(function($container){
                    var myHref = document.querySelector('.header-user-dropdown-toggle').href;
                    global.ids.gitlabUserId = myHref.substr(myHref.lastIndexOf('/')+1, myHref.length - myHref.lastIndexOf('/')-1);
                });
            },
            addClasses: function () {
                if (!global.states.areClassesAdded) {
                    global.states.areClassesAdded = true;

                    /*
                    aliceblue -> dimgray
                    palegreen -> darkgreen
                    cornflowerblue -> linear-gradient(45deg, black, transparent)
                    burlywood -> darkcyan
                    bisque -> darkslategray
                    */
                    // generic
                    if (global.prefs.hideCodeErrClass) tm.addGlobalStyle('.err { background-color: inherit !important; }');
                    tm.addGlobalStyle('.tamperlabel { cursor: pointer; }');
                    tm.addGlobalStyle('.btn-headerly, .btn-headerly-alt { font-size:0.7rem; padding:3px 6px; height:30px; margin-top:5px !important; margin-left:0px !important; margin-right: 5px !important; background:steelblue; border-color:darkslategray; color:white !important; }');
                    tm.addGlobalStyle('.btn-headerly:hover, .btn-headerly-alt:hover { background-color:aliceblue; border-color:black; color:blue !important; }');
                    tm.addGlobalStyle('.btn-headerly-alt { background-color:darkcyan; }');
                    tm.addGlobalStyle('.mycon { cursor:default; filter: grayscale(50%); }');
                    tm.addGlobalStyle('.fingery { cursor:pointer !important; }');
                    tm.addGlobalStyle('.nav-sidebar-inner-scroll { overflow-y: auto !important; }');
                    tm.addGlobalStyle('.qa-project-sidebar li { max-height: 2.4rem; }');

                    // breadcrumb
                    tm.addGlobalStyle('.js-breadcrumb-item-text { font-size:0.625rem; }');

                    // colored backgrounds
                    tm.addGlobalStyle('.merge-request-tabs-container {background:' + global.prefs.colorsInterface.find((x) => x.element === 'mrListBackground').color + '; }');
                    tm.addGlobalStyle('.merge-request-tabs {background:' + global.prefs.colorsInterface.find((x) => x.element === 'navButton').color + '; }');
                    tm.addGlobalStyle('.mr-widget-content {background:' + global.prefs.colorsInterface.find((x) => x.element === 'mrHeadline').color + '; }');
                    // tm.addGlobalStyle('.active {background:' + global.prefs.colorsInterface.find((x) => x.element === 'mrActiveTab').color + '; }');

                    // UI-sizing
                    tm.addGlobalStyle('.diff-files-holder.container-limited { max-width: inherit !important; }');
                    tm.addGlobalStyle('.approvals-required-text .avatar {width:24px; height:24px; }');
                    if (global.prefs.minimizeMetaInfo) {
                        tm.addGlobalStyle('.note-text ul {margin:0px !important; }');
                        tm.addGlobalStyle('.system-note {font-size:0.7em; padding:0; margin:0px !important; }');
                        tm.addGlobalStyle('.timeline-entry:hover {background:aliceblue; }');
                        tm.addGlobalStyle('.note-text .gfm-merge_request:not("a") {background:aliceblue; padding:10px; float:right; position:relative; top:-23px; margin-bottom:-28px; }');
                    }
                    tm.addGlobalStyle('#lessImportant { width:270px; overflow:auto; background-color:azure; }');
                    tm.addGlobalStyle('.lessImportantCollapsed { max-height:30px; width:260px !important; overflow:hidden !important; }');

                    tm.addGlobalStyle('.tamperNewIcon {position:relative; top:-10px; }');

                    tm.addGlobalStyle('.nothing-here-block {display: none;}');

                    tm.addGlobalStyle('.beepboop { background-color:powderblue !important;}');

                    // pipelines
                    _.each(global.prefs.pipelineLogFilters, (filter) => {
                        tm.addGlobalStyle('.pipelineLog-' + filter.name.replace(/ /g, '') + ' { ' +
                                          (filter.background ? 'background-color:' + filter.background + ';' : '') +
                                          (filter.color ? 'color:' + filter.color + ';' : '') +
                                          (filter.size ? 'font-size:' + filter.size + ';' : '') +
                                          ' padding-right:1rem; }');
                    });
                    tm.addGlobalStyle('.growl { opacity:0.9; }');
                    tm.addGlobalStyle('.growlMessage { overflow-y:auto; max-height:350px; background:white; color:black; }');
                    //minimize pipelines
                    tm.addGlobalStyle('.gl-pipeline-job-width { width:10rem; }');
                    tm.addGlobalStyle('.ci-job-component { max-width:10rem; }');
                    tm.addGlobalStyle('.gl-px-6 { padding-left:inherit; padding-right:inherit; }');
                    tm.addGlobalStyle('.js-pipeline-graph-job-link { padding:4px 5px; }');
                    tm.addGlobalStyle('.ci-job-name-component { font-size:0.7rem; }');

                    // merge requests
                    tm.addGlobalStyle('.mrNeeds { position:absolute; right:11.875rem; top:2rem; min-width:18.75rem; text-align:right; }');
                    tm.addGlobalStyle('.mrNeed { float:right; margin-left:0.625rem; border-radius:25px; border:1px solid ' + global.prefs.colorsInterface.find((x) => x.element === 'mrHeadline').color + '; padding:0 1rem; }');
                    _.each(global.prefs.colorsRules, (colorRule) => {
                        tm.addGlobalStyle('.mr' + colorRule.ruleName.replace(/ /g, '') + ' { background:' + colorRule.hexName + '; }');
                    });
                    tm.addGlobalStyle('.mrNote { z-index:10; transition: all .25s linear; position:absolute; right:-0.8rem; background:linear-gradient(90deg, thistle 0%, thistle 45%, rgba(255,255,255,0.15) 100%); width:1rem; top:0.2rem; height:3.6rem; overflow-x:hidden; overflow-y:hidden; border-top-left-radius:25px; border-bottom-left-radius:25px; }');
                    tm.addGlobalStyle('.mrNoteText { visibility:hidden; width:24rem; border:0; background:linear-gradient(90deg, lavender 0%, lavender 45%, rgba(255,255,255,0.15) 100%); resize:none; border-top-left-radius:10px; border-bottom-left-radius:10px; }');
                    tm.addGlobalStyle('.mrNoteExpanded { width: 26.5rem; padding:.25rem 0.75rem .25rem 1.5rem; right:1.8rem; } ' +
                                      '.mrNoteExpanded .mrNoteText { visibility:visible; cursor:auto; }');
                    tm.addGlobalStyle('.mrNoteEmpty { background:linear-gradient(90deg, darkgrey 0%, darkgrey 45%, rgba(255,255,255,0.15) 100%); }' +
                                     '.mrNoteEmpty .mrNoteText { background:linear-gradient(90deg, lightgrey 0%, lightgrey 45%, rgba(255,255,255,0.15) 100%); }');
                    tm.addGlobalStyle('.mrNoteOutOfDate { position:absolute; left:4px; top:7px; }' +
                                     '.merge-request-tabs-container .mrNoteOutOfDate { top:5px; }');
                    tm.addGlobalStyle('.mrNoteDelete { position:absolute; left:-8px; top:27px; display:none; }' +
                                      '.merge-request-tabs-container .mrNoteDelete { top:21px; }' +
                                     '.mrNoteExpanded .mrNoteDelete { display:block; }' +
                                     '.mrNoteEmpty .mrNoteDelete { display:none; }');
                    tm.addGlobalStyle('.merge-request-tabs-container .mrNote { top:0rem; height:3rem; }');
                    tm.addGlobalStyle('.merge-request-tabs-container .mrNoteText { height:2.5rem; width:22.5rem; }');
                    tm.addGlobalStyle('.merge-request-tabs-container .mrNoteExpanded { right:-2rem; }');
                    tm.addGlobalStyle('.mrChatLessImportant { font-size:smaller; font-style:italic; color:grey; line-height:1rem; padding-left:3rem; margin-bottom:1rem; }' +
                                     '.mrChatLessImportant ul { margin:0; }' +
                                     '.mrChatLessImportant p { margin-bottom:0.3125rem; }');
                    tm.addGlobalStyle('.chatImg { max-width:200px; max-height:200px; }');
                    tm.addGlobalStyle('.restartPipeline { border-radius: 25px; border: 1px solid green; padding: 0.1rem 0.2rem 0.1rem 0.1rem; background: white; color: cornflowerblue; font-size: 1rem; top: 0.25rem; position: relative;  }');
                    tm.addGlobalStyle('.big-pipeline-graph-dropdown-menu, .mini-pipeline-graph-dropdown-menu { height:unset !important; max-height:none !important; width:210px; }' +
                                     'li.scrollable-menu, .js-builds-dropdown-list { max-height:none !important; }' +
                                     '.pipeline-visualization { max-height:none; height:700px;}' +
                                     '.big-pipeline-graph-dropdown-menu button { top:20px !important; }');
                    tm.addGlobalStyle('.notes .system-note .note-header { min-height: 18px; }');
                    tm.addGlobalStyle('.hatched {background:url( data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAHCAYAAADEUlfTAAAAAXNSR0IArs4c6QAAABtJREFUGFdjTKi+7cuAAzCCJBe0qm7GJj/oJAGwGxoLJP3XYQAAAABJRU5ErkJggg== ) repeat;}');

                    // Comparison related
                    tm.addGlobalStyle('.prefixed {background:url( data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAAXNSR0IArs4c6QAAABtJREFUGFdjZGBgaIBiBhBgBJNIAFkArBJDBQBS7gIFD7CQWgAAAABJRU5ErkJggg== ) repeat;}');

                    // Pivotal Tracker-related
                    tm.addGlobalStyle('.ptComment { padding: 0.2rem; margin-bottom: 0.625rem; max-width: 17rem; }');
                    tm.addGlobalStyle('.ptTimestamp { font-size: 0.625rem; margin-left: 3rem; }');
                    tm.addGlobalStyle('.reviewsEl { flex:1 0 auto; }');
                    tm.addGlobalStyle('.reviewEl { float:right; margin-right:0.125rem; border-radius:1rem; border:2px solid white; padding:.25rem; }');
                    tm.addGlobalStyle('.ptIcon { margin-right:8px; color:white; }');
                    tm.addGlobalStyle('.userTeamsLink { height:34px; padding:10px; margin:0; background:beige; border-radius:25px; }');
                    tm.addGlobalStyle('#pivotalStoryDescription { float:right; width:190px; overflow:hidden; height:30px; margin:1rem 0 0 1rem; ' +
                                      '    border-width:2px 2px 2px 16px; border-style:solid; border-color:' + global.prefs.colorsInterface.find((x) => x.element === 'navButton').color +'; ' +
                                      '    position:relative; transition: all .25s linear; z-index:1; border-radius:25px; }');
                    tm.addGlobalStyle('.pivotalStoryDescriptionExpanded { width:50% !important; height:inherit !important; max-height:350px; overflow-y:auto !important; padding:1rem; border-top-right-radius:0 !important; border-bottom-right-radius:0 !important; }');
                    tm.addGlobalStyle('.pivotalStoryDescriptionText { display:none; cursor:auto; }' +
                                      '.pivotalStoryDescriptionExpanded .pivotalStoryDescriptionText { display:block; }');
                    tm.addGlobalStyle('.pivotalStoryTitle { position:absolute; bottom:3px; right:10px; }' +
                                      '.pivotalStoryDescriptionExpanded .pivotalStoryTitle { position:relative; top:-16px; left:20px; padding:0 10px; border-bottom-left-radius:10px; border-bottom-right-radius:10px; background-color:' + global.prefs.colorsInterface.find((x) => x.element === 'navButton').color + '; width:90%; }');
                    if (global.prefs.pivotalToken.length > 0) {
                        tm.addGlobalStyle('[data-qa-selector="approvals_summary_content"] { max-width:22rem; }');
                        tm.addGlobalStyle('.ptReply { margin-left:5px; font-family: Andale Mono; font-size:10px; text-transform:uppercase; text-decoration:underline; }');
                    }
                    tm.addGlobalStyle('.ignoreTip { color:lightgray; }');

                    // Avatar-related
                    tm.addGlobalStyle('.userPopMenu { margin:0; padding:1rem; }' +
                                      '.userPopMenu li { list-style-type: none; }');
                }
            },
            addFaves: function() { // adds shorcut buttons to your favorite projects
                // if areFavesAdded is false
                if (!global.states.areFavesAdded) {
                    global.states.areFavesAdded = true;
                    if (global.prefs.userFaves.length === 0) {
                        return;
                    }
                    try {
                        global.prefs.userFaves = global.prefs.userFaves.replace(/\s\s+/g, '').split(';');
                        tm.savePreferences(global.ids.prefsName, global.prefs);
                    } catch(e) {
                        utils.debug('Safe fail on parse userFaves');
                    }
                    // for each Fave
                    global.prefs.userFaves.forEach((fave) => {
                        // add a button
                        var titleContainer = $('header .title-container');
                        var slashPosition = fave.url.lastIndexOf('/')+1;
                        var faveName = fave.name ? fave.name : fave.url.substr(slashPosition, fave.url.length-slashPosition);
                        titleContainer.append('<a id="fave' + faveName + '" href="' + fave.url + '" class="btn btn-default btn-headerly fingery">' + faveName + '</a>');
                    });
                }
            },
            addChatsOnMrList: function() {
                var isListPage = document.querySelector('.merge-requests-holder') != null;
                if (!isListPage || (document.querySelector('.issuable-comments .has-tooltip') && document.querySelector('.issuable-comments .has-tooltip').id !== '')) {
                    return;
                }
                var merges = document.querySelectorAll('.issuable-reference'),
                    thisMergeId;
                    _.each(merges, (thisMerge) => {
                        thisMergeId = thisMerge.innerText.replace(/( |\!)/g, '');
                        $(thisMerge).closest('.merge-request').find('.issuable-comments .has-tooltip').attr('id', "mergeId-" + thisMergeId);
                    });

                $('.issuable-comments').click( function(e) {
                    e.preventDefault();
                    var iAm = 'showChats';
                    thisMergeId = e.target.closest('a').id.replace('mergeId-', '');
                    utils.gitlabXhr('GET', 'showChats', '/merge_requests/' + thisMergeId + '/notes', function(chats) {
                        if (!chats.find((x) => x.system === false)) {
                            $.growl.warning({
                                message: 'No Chats Found',
                                size: 'small',
                                delayOnHover: false,
                                duration: 1200 // 3200 is default
                            });
                        } else {
                            // chats = chats.slice().reverse();
                            var modalBody = '<style>' +
                                '.popupDetailTitle, .tamperModalClose { display:none; } ' +
                                '.popupDetailWindow { ' +
                                '      width:95%; ' +
                                '      height:inherit; ' +
                                '      max-height:90%; ' +
                                '      background-color: #fff;' +
                                '      background-image:' +
                                '            linear-gradient(90deg, transparent 79px, #abced4 79px, #abced4 81px, transparent 81px),' +
                                '            linear-gradient(#eee .1em, transparent .1em);' +
                                '      background-size: 100% 1.2em;' +
                                '      padding-left:100px;' +
                                '}' +
                                '</style>';
                            modalBody += '<button class="tBtn" style="width:100%;" onclick="$(this).parent().remove()">Close</button>';
                            _.each(chats, (chat) => {
                                var chatClass = '';
                                if (chat.system) {
                                    chatClass = 'mrChatLessImportant';
                                }
                                var converter = new showdown.Converter(),
                                    text = chat.body,
                                    html = converter.makeHtml(text);
                                html = html.replace(/\/uploads/g, document.URL.substr(0, document.URL.indexOf('merge_requests')).replace('-/', '') + 'uploads');
                                html = html.replace(/img src/g, 'img class="chatImg" src');
                                modalBody += '<div class="' + chatClass + '"><b>' + chat.author.name + '</b><span style="font-size:smaller; padding:0 0.625rem;">' + moment(chat.created_at).fromNow() + '</span>' + html + '</div>';
                            });
                            modalBody += '<button class="tBtn" style="width:100%;" onclick="$(this).parent().remove()">Close</button>';
                            tm.showModal('mrChats', modalBody);
                        }
                    });
                });

            },
            addNotesToMergeRequests: function () {
                var isListPage = document.querySelector('.merge-requests-holder') != null;
                var docAnchor = document.querySelector('.merge-requests-holder') || document.querySelector('.merge-request-tabs-container');
                if (!docAnchor || document.querySelector('.mrNote') != null) {
                    return;
                }
                var thisMergeId,
                    thisNote,
                    thisNoteUpdated,
                    thisNoteText,
                    emptyClass,
                    expandedClass,
                    duration,
                    hours,
                    outOfDate,
                    deleteNoteBtn,
                    getNoteData = function() {
                        thisNote = global.mems.mergeRequestNotes.find((x) => x.noteId === thisMergeId);
                        thisNoteText = thisNote ? utils.capitalizeFirstLetter(thisNote.noteText) : '';
                        thisNoteUpdated = thisNote ? thisNote.noteUpdated : null;
                        emptyClass = !thisNote ? 'mrNoteEmpty' : '';
                        expandedClass = (emptyClass == '' && global.mems.mrNoteState === 'auto') || global.mems.mrNoteState === 'on' ? 'mrNoteExpanded' : '';
                        deleteNoteBtn = '<span title="Delete this note" id="mrNoteDelete' + thisMergeId + '" class="mrNoteDelete fingery" data-target="mrNote' + thisMergeId + '" data-noteId="' + thisMergeId + '">&#128163;</span>'; // bomb icon
                    },
                    mrNoteDeleteAction = function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        var $noteEl = $('#' + $(e.target).attr('data-target'));
                        var updateNoteId = $(e.target).attr('data-noteId');
                        var existingNote = global.mems.mergeRequestNotes.find((x) => x.noteId === updateNoteId);
                        $noteEl.val('');
                        $noteEl.parent().removeClass('mrNoteExpanded').addClass('mrNoteEmpty');
                        $noteEl.parent().find('.mrNoteOutOfDate').remove();
                        global.mems.mergeRequestNotes.splice(global.mems.mergeRequestNotes.indexOf(existingNote), 1);
                        tm.savePreferences(global.ids.memsName, global.mems);
                    }
                if (isListPage) {
                    var merges = document.querySelectorAll('.issuable-reference');
                    _.each(merges, (thisMerge) => {
                        thisMergeId = thisMerge.innerText.replace(/( |\!)/g, '');
                        getNoteData();
                        duration = moment.duration(moment($(thisMerge).closest('.issuable-info-container').find('.merge_request_updated_ago').attr('datetime')).diff(thisNoteUpdated));
                        hours = duration.asHours();
                        outOfDate = hours > 0 ? '<span title="This request has been updated since this note was written." class="mycon mrNoteOutOfDate">&#128338;</span>' : ''; // fa-hourglass-end
                        $(thisMerge).closest('li.merge-request').css('position', 'relative');
                        $(thisMerge).closest('li.merge-request').append('<div class="mrNote fingery ' + expandedClass + ' ' + emptyClass + '">' + outOfDate + deleteNoteBtn + '<textarea id="mrNote' + thisMergeId + '" class="mrNoteText">' + thisNoteText + "</textarea></div>");
                        $('#mrNoteDelete' + thisMergeId).on('click', (e) => {
                            mrNoteDeleteAction(e);
                        });
                    });
                } else if (document.querySelector('cite')){
                    thisMergeId = document.querySelector('cite').innerText.replace(/\n|\r/g, '');
                    thisMergeId = thisMergeId.substr(thisMergeId.indexOf('!')+1, thisMergeId.length - thisMergeId.indexOf('!')+1)
                    getNoteData();
                        duration = moment.duration(moment($('time').eq($('time').length-1).attr('datetime')).diff(thisNoteUpdated));
                        hours = duration.asHours();
                        outOfDate = hours > 0 ? '<span title="This request has been updated since this note was written." class="mycon mrNoteOutOfDate">&#128338;</span>' : ''; // fa-hourglass-end
                    $(docAnchor).append('<div class="mrNote fingery ' + (thisNote ? global.mems.mrNoteState === 'auto' ? 'mrNoteExpanded' : '' : 'mrNoteEmpty') + '">' + outOfDate + deleteNoteBtn + '<textarea id="mrNote' + thisMergeId + '" class="mrNoteText">' + thisNoteText + "</textarea></div>");
                    $('#mrNoteDelete' + thisMergeId).on('click', (e) => {
                        mrNoteDeleteAction(e);
                    });
                }
                $('.mrNoteText').on('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                });
                $('.mrNoteText').on('blur', function(e) {
                    var thisVal = $(this).val();
                    var updateNoteId = $(this).attr('id').replace('mrNote', '');
                    var existingNote = global.mems.mergeRequestNotes.find((x) => x.noteId === updateNoteId);
                    $(this).closest('.mrNote').find('.mrNoteOutOfDate').remove();
                    if (existingNote) {
                        if (thisVal) {
                            global.mems.mergeRequestNotes.find((x) => x.noteId === updateNoteId).noteText = thisVal;
                            global.mems.mergeRequestNotes.find((x) => x.noteId === updateNoteId).noteUpdated = moment();
                        } else {
                            global.mems.mergeRequestNotes.splice(global.mems.mergeRequestNotes.indexOf(existingNote), 1);
                        }
                    } else {
                        if (thisVal) {
                            global.mems.mergeRequestNotes.push(
                                {
                                    'noteId': updateNoteId,
                                    'noteText': thisVal,
                                    'noteCreated': moment(),
                                    'noteUpdated': moment()
                                }
                            );
                        }
                    }
                    tm.savePreferences(global.ids.memsName, global.mems);
                    if (thisVal == null || thisVal === '') {
                        $(this).parent().addClass('mrNoteEmpty');
                        if (global.mems.mrNoteState !== 'on') {
                            $(this).closest('.mrNote').removeClass('mrNoteExpanded');
                        }
                    } else {
                        $(this).parent().removeClass('mrNoteEmpty');
                    }
                });
                $('.mrNote').on('click', function(e) {
                    if ($(this).hasClass('mrNoteExpanded')) {
                        $(this).removeClass('mrNoteExpanded');
                    } else {
                        $(this).addClass('mrNoteExpanded');
                        $(this).find('textarea').focus();
                    }
                });
            },
            adjustStyles: function() { // adjusts colors of discussions based on whether that discussion is resolved or not
                var lePass = global.prefs.colorsInterface.find((x) => x.element === 'mrResolved').color,
                    leFail = global.prefs.colorsInterface.find((x) => x.element === 'mrUnresolved').color,
                    botDivs = [],
                    botDivsRegex = new RegExp("Gitbot|ServiceCOMTeamCity");

                botDivs = $(".discussion-notes .timeline-content").filter(function () {
                    return botDivsRegex.test($(this).text());
                });

                botDivs.each(function(discussion) {
                    if ($(this).closest('.card').find('button:contains("Resolve")').length > 0) {
                        $(this).css('background-color', leFail);
                    } else {
                        if ($(this).text().indexOf('Resolved') > 0) {
                            $(this).css('background-color', lePass);
                        }
                    }
                });

                $('.timeline-entry .discussion-header').each(function(discussion) {
                    //
                    $(this).closest('.timeline-entry :contains("Resolve")').find('.discussion-header').css('background-color', leFail);
                    $(this).closest('.timeline-entry :contains("Resolved")').css('background-color', lePass);
                });

                var intX = 0;
                $('.notes').each(function(discussion) {
                    if (intX > 1 && intX < $('.notes').length-1) {
                        if ($(this).find('.discussion-resolved-text').length > 0 || $(this).find('button[title^="Resolved by"]').length > 0) {
                            $(this).find('li').eq(0).css('background-color', lePass);
                        } else {
                            $(this).find('li').eq(0).css('background-color', leFail);
                        }
                    }
                    intX++;
                });

//                 // clean-up.  could be done better, I'm sure
//                 document.querySelectorAll(".timeline-entry").forEach(function(te) {
//                     var thisChild = te.querySelector(".timeline-entry");
//                     if (thisChild) {
//                         $(thisChild).css('background-color', 'inherit');
//                     }
//                 });
            },
            addElements: function() {
                $('button:contains("Expand all")').hide();
                var topScrollTarget = $('.group-path');
                var conversationScrollTarget = $('.js-mr-approvals').length > 0 ? $('.js-mr-approvals') :
                $('button:contains("Approve")').parent().length > 0 ? $('button:contains("Approve")').parent() :
                $('strong:contains("Merge request approved")').parent().parent();
                var idTop = 'idTop',
                    idConversations = 'idConversations',
                    idViewSite = 'idViewSite',
                    conversationsClass = '.header-new',
                    addConversationsButton = function () {
                        var buttonAnchor = $(conversationsClass),
                            topAction = function () {
                                $('html, body').animate({ scrollTop: topScrollTarget.offset().top -100 }, 500);
                                return false;
                            },
                            conversationsAction = function () {
                                var event,
                                    eventType = 'click';
                                if (window.CustomEvent && typeof window.CustomEvent === 'function') {
                                    event = new CustomEvent(eventType, {detail: {some: 'data'}});
                                } else {
                                    event = document.createEvent('CustomEvent');
                                    event.initCustomEvent(eventType, true, true, {some: 'data'});
                                }
                                var el = document.getElementsByClassName('notes-tab')[0].querySelector('a');
                                el.dispatchEvent(event);
                                $('html, body').animate({ scrollTop: conversationScrollTarget.offset().top -100 }, 500);
                            },
                            viewSiteAction = function () {
                                document.querySelector('[data-track-action="open_review_app"]').click();
                                return false;
                            };

                        // Conditionally add View Site Button
                        tm.getContainer({
                            'el': '[data-track-action="open_review_app"]',// [aria-label="deploy-reviewapp: passed"]', data-track-action="open_review_app"
                            'max': 100,
                            'spd': 250
                        }).then(function($container){
                            buttonAnchor.before('<a id="' + idViewSite + '" class="btn btn-default btn-headerly-alt fingery">View</a>'); // --- VIEW SITE BUTTON
                            $('#' + idViewSite).click(viewSiteAction);
                        });
                        buttonAnchor.before('<a id="' + idConversations + '" class="btn btn-default btn-headerly-alt fingery">Act</a>'); // --- ACT BUTTON
                        $('#' + idConversations).click(conversationsAction);
                        buttonAnchor.before('<a id="' + idTop + '" class="btn btn-default btn-headerly-alt fingery">Top</a>'); // --- TOP BUTTON
                        $('#' + idTop).click(topAction);
                    },
                    addCollapseExpandButtonToDom = function(bId, bAnchor, bAction, bText) {
                        bAnchor.after('<a id="' + bId + '" class="btn btn-default append-right-8 fingery">' + bText + '</a>');
                        $('#' + bId).unbind('click').click(bAction);
                    },

                    idCollapse = 'idCollapse',
                    collapseClass = '.is-compare-versions-header',
                    addCollapseButton = function() {
                        var addCollapseButtonToDom = function () {
                            addCollapseExpandButtonToDom(idCollapse, buttonAnchor, collapseAction, 'Collapse All');
                        },
                            buttonAnchor = $(collapseClass),
                            collapseAction = function () {
                                _.each($('.diff-content'), (diff) => {
                                    if ($(diff).height() > 0) {
                                        $(diff).closest('.diff-file').find('.file-title').click();
                                    }
                                });
                                $(this).remove();
                                addExpandButton();
                            };
                        addCollapseButtonToDom();
                        $('a:contains("Expand all")').hide();
                    },

                    idExpand = 'idExpand',
                    expandClass = '.is-compare-versions-header',
                    addExpandButton = function() {
                        var addExpandButtonToDom = function () {
                            addCollapseExpandButtonToDom(idExpand, buttonAnchor, expandAction, 'Expand All');
                        },
                            buttonAnchor = $(expandClass),
                            expandAction = function () {
                                _.each($('.diff-collapsed'), (diff) => {
                                    $(diff).closest('.diff-file').find('.file-title').click();
                                });
                                $(this).remove();
                                addCollapseButton();
                            };
                        addExpandButtonToDom();
                    },

                    idComparisonFont = 'idComparisonFont',
                    comparisonFontClass = '.is-compare-versions-header',
                    addComparisonFontButton = function() {
                        var buttonAnchor = $(comparisonFontClass),
                            comparisonFontAction = function () {
                                var buttonText = $('#' + idComparisonFont).text();
                                if (global.mems.currentFontSize === global.mems.defaultLineSize) {
                                    global.mems.currentFontSize = global.mems.smallLineSize;
                                    $('#' + idComparisonFont).text(buttonText.replace('-', '+'));
                                } else {
                                    global.mems.currentFontSize = global.mems.defaultLineSize;
                                    $('#' + idComparisonFont).text(buttonText.replace('+', '-'));
                                    // actual setting of font size done during monitoring of page, so mouse movement can trigger it
                                }
                                tm.savePreferences(global.ids.memsName,global.mems);
                            };
                        buttonAnchor.after('<a id="' + idComparisonFont + '" class="btn btn-default append-right-8 fingery">Font -</a>'); //  Font +- button
                        $('#' + idComparisonFont).unbind('click').click( comparisonFontAction);
                        if (global.mems.currentFontSize !== global.mems.defaultLineSize) { // to fix UI if button was previously saved in alternate setting
                            global.mems.currentFontSize = global.mems.defaultLineSize;
                            comparisonFontAction();
                        }
                    },

                    idHeader = 'idHeader',
                    headerClass = '.header-message',
                    addHeaderButton = function() {
                        var buttonAnchor = $(headerClass),
                            headerAction = function () {
                                var msg = $(headerClass + ' p').text();
                                if (!_.contains(global.mems.archivedMessages, msg)) {
                                    global.mems.archivedMessages.push(msg);
                                    tm.savePreferences(global.ids.memsName,global.mems);
                                }
                                buttonAnchor.hide();
                                // special for header
                                $('.navbar').css('top', '0px');
                                $('.nav-sidebar').css('top', '40px');
                                $('.content-wrapper').css('margin-top', '40px');
                                return false;
                            };
                        buttonAnchor.prepend('<span id="' + idHeader + '" class="mycon outlined fingery">❌</span>'); // fa-times
                        $('#' + idHeader).click(headerAction);
                        // if a previously-hidden header message is showing again
                        if ($(headerClass).css('display') !== 'none') {
                            _.each(global.mems.archivedMessages, function(msg) {
                                if ($(headerClass + ' p').text() == msg) {
                                    headerAction();
                                }
                            });
                        }
                    },

                    idFooter = 'idFooter',
                    footerClass = '.footer-message',
                    addFooterButton = function() {
                        var buttonAnchor = $(footerClass),
                            footerAction = function () {
                                var msg = $(footerClass + ' p').text();
                                if (!_.contains(global.mems.archivedMessages, msg)) {
                                    global.mems.archivedMessages.push(msg);
                                    tm.savePreferences(global.ids.memsName,global.mems);
                                }
                                buttonAnchor.hide();
                                return false;
                            };
                        buttonAnchor.prepend('<span id="' + idFooter + '" class="mycon outlined fingery">❌</span>'); // fa-times
                        $('#' + idFooter).click(footerAction);
                        // if a previously-hidden footer message is showing again
                        if ($(footerClass).css('display') !== 'none') {
                            _.each(global.mems.archivedMessages, function(msg) {
                                if ($(footerClass + ' p').text() == msg) {
                                    footerAction();
                                }
                            });
                        }
                    },

                    idBroadcast = 'idBroadcast',
                    broadcastClass = '.broadcast-message',
                    addBroadcastButton = function() {
                        var buttonAnchor = $(broadcastClass),
                            broadcastAction = function () {
                                var msg = $(broadcastClass + ' p').text();
                                if (!_.contains(global.mems.archivedBroadcasts, msg)) {
                                    global.mems.archivedBroadcasts.push(msg);
                                    tm.savePreferences(global.ids.memsName,global.mems);
                                }
                                buttonAnchor.hide();
                                return false;
                            };
                        buttonAnchor.prepend('<span id="' + idBroadcast + '" class="mycon outlined fingery">❌</span>'); // fa-times
                        $('#' + idBroadcast).click( broadcastAction);
                        // if a previously-hidden  broadcast message is showing again
                        if ($( broadcastClass).css('display') !== 'none') {
                            _.each(global.mems.archivedBroadcasts, function(msg) {
                                if ($( broadcastClass + ' p').text() == msg) {
                                    broadcastAction();
                                }
                            });
                        }
                    },

                    idUserTeams = 'idUserTeams',
                    userTeamsClass = '.user-popover',
                    addUserTeamsButton = function() {
                        var buttonAnchor = $(userTeamsClass);
                        buttonAnchor.append('<span id="' + idUserTeams + '" class="mycon userTeamsLink outlined fingery" style="font-weight:bold;">📣</span>'); // fa-bullhorn
                        buttonAnchor.append('<span id="' + idUserTeams + 'Slack" class="mycon userTeamsLink outlined fingery" style="font-weight:bold;">🤙🏻</span>'); // fa-hashtag (Slack)
                        var emailName = document.querySelector(userTeamsClass).querySelector('.text-secondary').innerText.replace('@', '');
                        var thisFirstName = emailName.substr(0, emailName.indexOf('_'));
                        var thisLastName = emailName.replace(thisFirstName + '_', '');
                        var slackFind = utils.getSlackId(thisFirstName, thisLastName);
                        $('#' + idUserTeams).click( function() {
                            utils.userChatAction(emailName);
                        });
                        $('#' + idUserTeams + 'Slack').click(function () {
                            utils.userChatAction(slackFind);
                        });
                    },

                    idCopyTitle = 'idCopyTitle',
                    copyTitleClass = '.detail-page-description .title',
                    addCopyTitleButton = function() {
                        var buttonAnchor = $(copyTitleClass);
                        buttonAnchor.append('<span title="Copy \'Linked Title\' as Markdown" class="mycon fingery" style="font-size:1rem; position:relative; top:-0.2rem;" id="' + idCopyTitle + '">📰</span>'); // fa-copy
                        $('#' + idCopyTitle).click( function(e) {
                            var textToCopy = e.target.parentElement.innerText;
                            textToCopy = '[' + textToCopy.substr(0, textToCopy.length-2) + '](' + document.URL + ')';
                            tm.copyTextToClipboard(textToCopy);
                        });
                    },

                    idReleaseMerges = 'idReleaseMerges',
                    releaseMergesClass = '.top-area .nav-controls',
                    addReleaseMergesButton = function() {
                        if (document.URL.indexOf('state=merged') < 0) {
                            return;
                        }
                        var buttonAnchor = $(releaseMergesClass);
                        buttonAnchor.prepend('<button id="' + idReleaseMerges + '" class="btn append-right-10">Gather Release</button>'); // RELEASE MERGES (gather released merge list for documentation)
                        $('#' + idReleaseMerges).click( function() {
                            var mergeRequests = document.querySelectorAll('.merge-request-title a');
                            var modalBody = '<div style="clear:both; padding-left:2rem;">';
                            _.each(mergeRequests, (mr) => {
                                modalBody += '<a href="' + mr.href + '">' + mr.innerText + '</a><br />';
                            });
                            modalBody += '</div>';
                            tm.showModal('mergedRequest', modalBody);
                        });
                    },

                    idMrNoteStates = 'idMrNoteStates',
                    mrNoteStatesClass = '.top-area .nav-controls',
                    addMrNoteStatesButton = function() {
                        var buttonAnchor = $(mrNoteStatesClass);
                        buttonAnchor.prepend('<button id="' + idMrNoteStates + '" class="btn append-right-10">Notes: <span id="idMrNoteState">' + utils.capitalizeFirstLetter(global.mems.mrNoteState) + '</span></button>');
                        $('#' + idMrNoteStates).click( function() {
                            if (global.mems.mrNoteState === 'auto') {
                                global.mems.mrNoteState = 'off';
                                $('.mrNoteExpanded').removeClass('mrNoteExpanded');
                                $('#idMrNoteState').text('Off');
                            } else if (global.mems.mrNoteState === 'off') {
                                global.mems.mrNoteState = 'on';
                                $('.mrNote').addClass('mrNoteExpanded');
                                $('#idMrNoteState').text('On');
                            } else if (global.mems.mrNoteState === 'on') {
                                $('.mrNote').addClass('mrNoteExpanded');
                                $('.mrNoteEmpty').removeClass('mrNoteExpanded');
                                global.mems.mrNoteState = 'auto';
                                $('#idMrNoteState').text('Auto');
                            }
                            tm.savePreferences(global.ids.memsName,global.mems);
                        });
                    },

                    idShowNeeds = 'idShowNeeds',
                    showNeedsClass = '.top-area .nav-controls',
                    addShowNeedsButton = function() {
                        var buttonAnchor = $(showNeedsClass);
                        buttonAnchor.prepend('<button id="' + idShowNeeds + '" class="btn append-right-10">Show Needs</button>'); // NEEDED APPROVALS

                        $('#' + idShowNeeds).click( function() {
                            var iAm = 'showNeeds',
                                merges = document.querySelectorAll('.issuable-reference');
                            _.each(merges, (thisMerge) => {
                                var thisMergeId = thisMerge.innerText.replace(/( |\!)/g, '');
                                utils.gitlabXhr('GET', 'showNeedsGetApprovals', '/merge_requests/' + thisMergeId + '/approvals', function(remainingRules) {
                                    remainingRules = remainingRules.approval_rules_left.slice().reverse();
                                    var mrNeeds;
                                    if (remainingRules.length > 0) {
                                        mrNeeds = '<div class="mrNeeds">Approval needed from: ';
                                    } else {
                                        mrNeeds = '<div class="mrNeeds"><div class="mrNeed mrReadytoMerge">Ready to Merge</div>';
                                    }
                                    _.each(remainingRules, (remainingRule) => {
                                        mrNeeds += '<div class="mrNeed mr' + remainingRule.name.replace(/ /g, '') + '">' + remainingRule.name + '</div>';
                                    });
                                    mrNeeds += '</div>';
                                    $('.issuable-reference:contains("!' + thisMergeId + '")').closest('.issuable-info-container').append(mrNeeds);
                                });
                            });
                        });
                    },

                    idAlert = 'idAlert',
                    alertClass = '.broadcast-banner-message',
                    addAlertButton = function() {
                        var buttonAnchor = $(alertClass),
                            alertAction = function () {
                                var msg = $(alertClass + ' p').text();
                                if (!_.contains(global.mems.archivedAlerts, msg)) {
                                    global.mems.archivedAlerts.push(msg);
                                    tm.savePreferences(global.ids.memsName,global.mems);
                                }
                                buttonAnchor.hide().attr("style", "display: none !important");;
                                return false;
                            };
                        if ((buttonAnchor).find('#idBroadcast').length === 0) {
                            buttonAnchor.prepend('<span id="' + idAlert + '" class="mycon outlined fingery">❌</span>'); // fa-times
                            $('#' + idAlert).click(alertAction);
                        }
                        // if a previously-hidden alert message is showing again
                        if ($( alertClass).css('display') !== 'none') {
                            _.each(global.mems.archivedAlerts, function(msg) {
                                if ($( alertClass + ' p').text() == msg) {
                                    alertAction();
                                }
                            });
                        }
                    },

                    idPiper = 'idPiper',
                    piperClass = '.mr-widget-pipeline-graph',
                    addPiperButton = function() {
                        var buttonAnchor = $(piperClass),
                            piperAction = function () {
                                var branchName = document.querySelector('.js-source-branch a').text; // was document.querySelector('.js-source-branch').dataset.originalTitle
                                if (branchName) {
                                $.growl.notice({
                                    message: 'One Moment...',
                                    size: 'small',
                                    delayOnHover: false,
                                    duration: 1000 // 3200 is default
                                });
                                utils.gitlabXhr('POST', 'restartPipeline', '/pipeline?ref=' + branchName, function() {
                                    $.growl.notice({
                                        message: 'Pipeline Restarted for ' + branchName,
                                        size: 'large',
                                        delayOnHover: true,
                                        duration: 3200 // 3200 is default
                                    });
                                })
                                } else {
                                    $.growl.error({
                                        message: 'Sorry! I could not find the branch name.',
                                        size: 'small',
                                        delayOnHover: false,
                                        duration: 1000 // 3200 is default
                                    });
                                }
                                return false;
                            };
                        buttonAnchor.prepend('<span id="' + idPiper + '" class="mycon fingery restartPipeline" data-tippy="Restart Pipeline">♻</span>'); // "Pipeline" (Tools) button
                        tippy(document.getElementById(idPiper), { content: document.getElementById(idPiper).dataset.tippy, arrow: true });
                        $('#' + idPiper).click(piperAction);
                    },

                    idPivotal = 'idPivotalComments',
                    pivotalAnchor = '.issuable-sidebar',
                    addPivotalButton = function () {
                        var buttonAnchor = $(pivotalAnchor),
                            pivotalAction = function () {
                                $('.participants .sidebar-collapsed-icon').click();
                            };

                        buttonAnchor.append('<div id="' + idPivotal + '" class="block pivotal-reference">' +
                                            global.templates.pivotalComment +
                                            '</div>'); // --- PIVOTAL BUTTON


                        $('#' + idPivotal).click(pivotalAction);
                    };

                if (document.URL.indexOf('merge_requests') < 0) {
                    $('#' + idConversations).remove();
                    $('#' + idCollapse).remove();
                    $('#' + idExpand).remove();
                    $('#' + idPivotal).remove();
                    $('#' + idCopyTitle).remove();
                    $('#' + idReleaseMerges).remove();
                    $('#' + idMrNoteStates).remove();
                    $('#' + idShowNeeds).remove();
                    $('#' + idPiper).remove();
                    global.states.arePrButtonsAdded = false;
                } else {
                    if (!document.getElementById(idCollapse)) {
                        tm.getContainer({
                            'el': collapseClass,
                            'max': 100,
                            'spd': 1000
                        }).then(function($container){
                            addComparisonFontButton();
                            addCollapseButton();
                        });
                    }
                    if (!global.states.arePrButtonsAdded) {
                        global.states.arePrButtonsAdded = true;

                        tm.getContainer({
                            'el': showNeedsClass,
                            'max': 100,
                            'spd': 1000
                        }).then(function($container){
                            addShowNeedsButton();
                        });

                        tm.getContainer({
                            'el': mrNoteStatesClass,
                            'max': 100,
                            'spd': 1000
                        }).then(function($container){
                            addMrNoteStatesButton();
                        });

                        tm.getContainer({
                            'el': copyTitleClass,
                            'max': 100,
                            'spd': 1000
                        }).then(function($container){
                            addCopyTitleButton();
                        });

                        tm.getContainer({
                            'el': releaseMergesClass,
                            'max': 100,
                            'spd': 1000
                        }).then(function($container){
                            addReleaseMergesButton();
                        });

                        tm.getContainer({
                            'el': conversationsClass,
                            'max': 100,
                            'spd': 1000
                        }).then(function($container){
                            addConversationsButton();
                        });

                        if (document.URL.indexOf('merge_requests/') > -1) { // we are on a specific merge review, not the index of reviews, when it has the slash
                            page.pivotal.getReviews();
                            tm.getContainer({
                                'el': pivotalAnchor,
                                'max': 100,
                                'spd': 1000
                            }).then(function($container){
                                addPivotalButton();
                            });

                            tm.getContainer({
                                'el': piperClass,
                                'max': 100,
                                'spd': 1000
                            }).then(function($container){
                                addPiperButton();
                            });
                        }
                    }

                    // outside of arePrButtonsAdded check for xhr allowance
                    if (document.URL.indexOf('merge_requests/') > -1) { // only process when on a specific merge_request
                        if (!global.states.xhrBusy && !$('.ptComment').length > 0) {
                            tm.getContainer({
                                'el': pivotalAnchor,
                                'max': 100,
                                'spd': 1000
                            }).then(function($container){
                                page.pivotal.getComments();
                            });
                        }
                    }
                }


                // Constantly poll for user profile popup
                setTimeout(function() {
                    if (document.querySelector(userTeamsClass) != null && document.querySelector('.userTeamsLink') == null) {
                        addUserTeamsButton();
                    }
                }, TIMEOUT*2);

                if (!global.states.areInterfaceButtonsAdded) {
                    global.states.areInterfaceButtonsAdded = true;
                    tm.getContainer({
                        'el': headerClass,
                        'max': 100,
                        'spd': 1000
                    }).then(function($container){
                        addHeaderButton();
                    });

                    tm.getContainer({
                        'el': footerClass,
                        'max': 100,
                        'spd': 1000
                    }).then(function($container){
                        addFooterButton();
                    });

                    tm.getContainer({
                        'el': broadcastClass,
                        'max': 100,
                        'spd': 1000
                    }).then(function($container){
                        addBroadcastButton();
                    });

                    tm.getContainer({
                        'el': alertClass,
                        'max': 100,
                        'spd': 1000
                    }).then(function($container){
                        addAlertButton();
                    });
                }

            },
            adjustMarkdown: function () {
                if (!global.prefs.useThumbnailImages) {
                    return;
                }
                if ($('.mdImg').length > 0) {
                    return;
                }
                tm.addGlobalStyle('.md img { max-width:25% !important; }');
                _.each($('.md img'), (mdImg) => {
                    $(mdImg).parent().addClass('mdImg');
                });
                $('.mdImg').click(function(e) {
                    e.preventDefault();
                    var modalBody = '<img id="tsImgPreview" src="' + e.target.src + '" onclick="$(this).parent().remove()" />' +
                        '<style>' +
                        '.popupDetailTitle, .tamperModalClose { display:none; } ' +
                        '.popupDetailWindow { width:95%; height:inherit; max-height:90%; ' +
                        'background-image:' +
                        '      linear-gradient(45deg, #EEE 25%, transparent 25%),' +
                        '      linear-gradient(45deg, transparent 75%, #EEE 75%),' +
                        '      linear-gradient(45deg, transparent 75%, #EEE 75%),' +
                        '      linear-gradient(45deg, #EEE 25%, transparent 25%);' +
                        'background-size:100px 100px;' +
                        'background-position:0 0, 0 0, -50px -50px, 50px 50px;' +
                        '}' +
                        '.popupDetailWindow img { ' +
                        'max-width:100%; ' +
                        'max-height:' + $(document).height() + 'px; ' +
                        'display:block; ' +
                        'margin:auto; ' +
                        '}' +
                        '</style>';
                    tm.showModal('imgCloseup', modalBody);
                });
            },
            appendClickFunctions: function () {
                if (!document.querySelector('.tm-approveButton') && document.URL.indexOf('merge_requests') > 0 && global.ids.pivotal.project != null) {
                    var approveSelector = '[data-qa-selector="approve_button"]'; // this is the GITLAB "Approve/Revoke Approval" button
                    tm.getContainer({
                        'el': approveSelector,
                        'max': 100,
                        'spd': 1000
                    }).then(function($container){
                        var approveButton = document.querySelector(approveSelector);
                        var reviewerId;
                        approveButton.classList.add('tm-approveButton');
                        approveButton.addEventListener('click', function approveAppendActions() {
                            if (!approveButton.classList.contains('btn-inverted')) { // YET TO APPROVE OR RE-APPROVE *on gitlab* (don't need to check if it(approveButton) exists because after getContainer it definitely does)
                                // approveButton.removeEventListener('click', approveAppendActions);
                                reviewerId = global.ids.pivotal.project.me.id;
                                utils.debug('POST CHECK: I am ' + reviewerId +
                                            ' and my review does ' +
                                            (document.querySelector('[data-reviewer_id="' + reviewerId + '"]') ? '' : 'not') + ' exist.');
                                if (document.querySelector('[data-reviewer_id="' + reviewerId + '"]')) { // already exists on PT; don't add another
                                    return;
                                }
                                var review_type_id;
                                if (global.mems.pivotalData.my_review_type_id) {
                                    page.pivotal.postReview(global.mems.pivotalData.my_review_type_id);
                                } else {
                                    var modalBody = '<div style="text-align:center; padding:2rem;"><p>Copying this to Pivotal Tracker.  Is this a CODE or DESIGN review?</p>' +
                                        '<p><button id="confirmCode" class="confirmReviewType" value="Code">CODE</button>&nbsp;&nbsp;&nbsp;' +
                                        '<button id="confirmDesign" class="confirmReviewType" value="Design Review">DESIGN</button></p>' +
                                        '<p><input id="checkRememberReviewType" type="checkbox">Remember my choice</input></p>' +
                                        '</div>' +
                                        '<style>.popupDetailTitle, .tamperModalClose { display:none; } .popupDetailWindow { width:95%; min-height:85% height:inherit; max-height:95%; }</style>';
                                    tm.showModal('confirmReviewType', modalBody);
                                    _.each(document.querySelectorAll('.confirmReviewType'), (confirmTypeButton) => {
                                        utils.listenOnce(confirmTypeButton, 'click', (e) => {
                                            review_type_id = JSON.parse(global.ids.pivotal.project.review_types).review_types.find((x) => x.name === e.target.value).id;
                                            if (document.getElementById('checkRememberReviewType').checked) {
                                                utils.debug('Remembering your choice... ' + review_type_id);
                                                global.mems.pivotalData.my_review_type_id = review_type_id;
                                                tm.savePreferences(global.ids.memsName, global.mems);
                                            }
                                            $('#confirmReviewType').remove();
                                            page.pivotal.postReview(review_type_id);
                                        });
                                    });
                                }
                            } else { // HAS BEEN APPROVED, so when un-approving, do this:
                                var review_id = parseInt(document.querySelector('[data-reviewer_id="' + global.ids.pivotal.project.me.id + '"]').getAttribute('data-review_id'));
                                $('[data-reviewer_id="' + global.ids.pivotal.project.me.id + '"]').remove();
                                page.pivotal.deleteReview(review_id);
                            }
                        });
                    });
                }

                if (!document.querySelector('.tm-mergeButton') &&
                    document.URL.indexOf('merge_requests') > 0 &&
                    global.ids.pivotal.project != null &&
                    global.prefs.pivotalToken.length > 0 &&
                    global.ids.pivotal.story && global.ids.pivotal.story.current_state.toLowerCase() !== 'finished' &&
                    global.prefs.autoFinishPivotalStories) {
                    // post to change the Pivotal Story to finished

                    var mergeSelector = '[data-qa-selector="merge_button"]'; // this is the GITLAB "Merge MR" button
                    tm.getContainer({
                        'el': mergeSelector,
                        'max': 100,
                        'spd': 1000
                    }).then(function($container){
                        var mergeButton = document.querySelector(mergeSelector);
                        mergeButton.classList.add('tm-mergeButton');
                        mergeButton.addEventListener('click', function mergeAppendActions() {
                            utils.debug('PUT Pivotal Story to finished');
                            page.pivotal.putStoryState('finished');
                        });
                    });
                }

                $('.file-title:not(.clickAppended)').on('click', utils.scrollAfterCollapse).addClass('clickAppended');

            },
            cleanMrTemplate: function () {
                var dirtyLinks = document.querySelectorAll('a[href*="PASTEHERE"]');
                _.each(dirtyLinks, function (dirtyLink) {
                    $(dirtyLink).closest('a').prev().prop('checked', false);
                    $(dirtyLink).closest('a').css('text-decoration', 'line-through').removeAttr('href');
                });
            },
            collapseSidebarLowPriorities: function () {
                if (document.getElementById('lessImportant') != null || global.ids.pivotal.project == null) {
                    return;
                }
                $('.qa-assignee-block').css('border-bottom', '0px');
                $('.qa-assignee-block').after('<div id="lessImportant" class="lessImportantCollapsed"><button id="lessImpToggle" class="btn btn-default hide-collapsed" style="width:100%;">Show Tools</button><div id="aHackySpacer" style="width:100%; height:30px; background:#fafafa;"></div></div>');
                document.getElementById('lessImportant').appendChild(document.querySelector('.milestone'));
                document.getElementById('lessImportant').appendChild(document.querySelector('[data-testid="time-tracker"]').parentElement);
                document.getElementById('lessImportant').appendChild(document.querySelector('.labels'));
                document.getElementById('lessImportant').appendChild(document.querySelector('#js-lock-issue-data'));
                document.getElementById('lessImportant').appendChild(document.querySelector('.lock'));
                document.getElementById('lessImportant').appendChild(document.querySelector('.project-reference'));
                document.getElementById('lessImpToggle').onclick = function(e) {
                    e.preventDefault();
                    if (document.getElementById('lessImportant').classList.contains('lessImportantCollapsed')) {
                        e.target.innerText = 'Hide Tools';
                        document.getElementById('lessImportant').classList.remove('lessImportantCollapsed');
                        $('#aHackySpacer').hide();
                    } else {
                        e.target.innerText = 'Show Tools';
                        document.getElementById('lessImportant').classList.add('lessImportantCollapsed');
                        $('#aHackySpacer').show();
                    }
                };
            },
            highlightComparisons: function() {
                if (!document.URL.indexOf('/compare/') > 0) {
                    return;
                }
                Array.from(document.querySelectorAll('li.commit a')).forEach((el) => {
                    global.prefs.mrPrefixes.forEach((prefix) => {
                        const regMatch = new RegExp(prefix + ':', 'gi');
                        if (el.textContent.match(regMatch) && !el.classList.contains('prefixed')) {
                            $(el).closest('li').addClass('prefixed');
                        }
                    });
                })
            },
            dimApprovedRequests: function () {
                if (!document.URL.indexOf('/merge_requests/') > 0) {
                    return;
                }
                _.each($('use[*|href*="approval-solid"]'), (svg) => {
                    if (document.URL.indexOf('only=me') > 0) {
                        $(svg).closest('.merge-request').hide();
                    } else {
                        $(svg).closest('.merge-request').css('background-color', global.prefs.colorsInterface.find((x) => x.element === 'approvedRequestsDim1').color);
                    }
                });
                _.each($('a[data-qa-selector="assignee_link"]'), (assignee) => {
                    if (assignee.href.indexOf(global.ids.gitlabUserId) > -1) {
                        $(assignee).closest('.merge-request').css('background-color', global.prefs.colorsInterface.find((x) => x.element === 'approvedRequestsDim2').color);
                    }
                });
                Array.from(document.querySelectorAll('.merge-request-title-text a')).forEach((el) => {
                    if (el.textContent.match(/draft/gi) && !el.classList.contains('hatched')) {
                        $(el).closest('li').addClass('hatched');
                    }
                })
                document.querySelectorAll('a[data-qa-selector="assignee_link"]').forEach((assignee) => {
                    if (assignee.href.indexOf(global.ids.gitlabUserId) > -1) {
                        $(assignee).closest('.merge-request').css('background-color', global.prefs.colorsInterface.find((x) => x.element === 'approvedRequestsDim2').color);
                    }
                });
            },
            expandBreadcrumb: function () {
                if (global.states.isBreadcrumbExpanded) {
                    return;
                }
                global.states.isBreadcrumbExpanded = true;
                $('.breadcrumbs .dropdown li').prependTo('.breadcrumbs-list .dropdown');
                $('.breadcrumbs-list .identicon').hide();
                $('.breadcrumbs-list .dropdown button').hide();
            },
            pivotal: {
                defineProject: function () {
                    utils.debug('begin');
                    if (global.ids.pivotal.project) {
                        utils.debug('abort; already defined');
                        return;
                    }
                    global.ids.pivotal.gitlabRelation = {};
                    var cite;
                    cite = utils.getElementByTextContent('Reference: ', true);
                    if (cite.length > 0) {
                        utils.debug('cite found');
                        cite[cite.length-4].classList.add('project-reference');
                        cite = cite[cite.length-1].innerText.replace(/\n|\r/g, '');
                        cite = cite
                            .substr(cite, cite.indexOf('!'))
                            .replace(/Reference: /g, '')
                            .replace(/ /g, '');
                        var matchedCite = global.prefs.pivotalMaps.find((x) => x.reference === cite)
                        if (matchedCite) {
                            global.ids.pivotal.gitlabRelation = matchedCite;
                            utils.debug({'re': 'setting gitlabRelation from ', 'matchedCite': matchedCite})
                        } else {
                            utils.debug({'re': 'FAILURE - cite not matched ', 'searching pivotalMaps': global.prefs.pivotalMaps, 'seeking cite': cite})
                        }
                    } else {
                        utils.debug('FAILURE - cite not found in DOM');
                    }
                    if (cite && global.ids.pivotal.gitlabRelation != null) {
                        if (global.mems.pivotalData.projects.length > 0) {
                            try {
                                global.ids.pivotal.project = global.mems.pivotalData.projects.find((x) => x.project_id === parseInt(global.ids.pivotal.gitlabRelation.project_id));
                                utils.debug('pivotal.project set');
                            } catch(e) {
                                utils.debug({
                                    're': 'failed to set pivotal.project',
                                    'pivotalData.projects': global.mems.pivotalData.projects,
                                    'gitlabRelation.project_id': global.ids.pivotal.gitlabRelation.project_id,
                                    'reminder': 'Check your global.mems.pivotalData.timers'
                                });
                            }
                        } else {
                            utils.debug({'re': 'PivotalObject FAILURE: pivotalData.projects is empty!', 'global.mems': global.mems.pivotalData});
                            global.mems.pivotalData.timeUpdated = null;
                            page.pivotal.getMembers();
                        }
                    }
                    utils.debug({'re': {
                        'global.mems.pivotalData.projects.length': global.mems.pivotalData.projects.length,
                        'cite': cite,
                        'global.ids.pivotal.gitlabRelation': {
                            'project_id': global.ids.pivotal.gitlabRelation.project_id,
                            'reference': global.ids.pivotal.gitlabRelation.reference
                        },
                        'global.ids.pivotal.project [object Object]': global.ids.pivotal.project}
                                });
                },
                deleteReview: function(review_id) {
                    var iAm = 'deleteReview';
                    var whenDataReceived = function (resp) {
                        // does not call on a delete
                    };
                    utils.xhrAction(iAm, 'DELETE', 'stories/PIVOTALSTORYID/reviews/' + review_id, whenDataReceived);
                },
                getMe: function() {
                    var iAm = 'getMe';
                    if (!utils.pivotalHoursElapsed(iAm, 24)) {
                        return;
                    }
                    var whenDataReceived = function (resp) {
                        resp = JSON.parse(resp);
                        global.ids.pivotal.project.me = global.mems.pivotalData.projects.find(x => x.project_id === global.ids.pivotal.project.project_id).me = resp;
                    };
                    var finallyDoThis = function() {
                        tm.savePreferences(global.ids.memsName, global.mems);
                    };
                    utils.delayUntil(iAm, () => {return global.ids.pivotal.project != null;}, () => {
                        utils.xhrAction(iAm, 'GET', 'me', whenDataReceived, finallyDoThis);
                    });
                },
                getMembers: function () {
                    var iAm = 'getMembers';
                    if (!utils.pivotalHoursElapsed(iAm, 2)) {
                        return;
                    }
                    utils.debug('pushing to pivotalData.projects');
                    var whenDataReceived = function (resp) {
                        resp = JSON.parse(resp).slice().reverse();

                        if (!global.mems.pivotalData.projects.find(x => x.project_id === resp[0].project_id)) {
                            global.mems.pivotalData.projects.push(
                                {
                                    'project_id': resp[0].project_id,
                                    'members': resp
                                }
                            );
                        } else {
                            global.mems.pivotalData.projects.find(x => x.project_id === resp[0].project_id).members = resp;
                        }
                    };
                    var finallyDoThis = function() {
                        tm.savePreferences(global.ids.memsName, global.mems);
                    };
                    utils.xhrAction(iAm, 'GET', 'memberships', whenDataReceived, finallyDoThis); // DO NOT DELAY UNTIL global.ids.pivotal.project is defined. THIS DEFINES IT.
                },
                getComments: function () {
                    if (global.ids.pivotal.project == null || global.ids.pivotal.project.members == null || utils.getPivotalStoryId() == null) {
                        utils.debug('getComments failed; global.ids.pivotal.project must be defined.');
                        return;
                    }
                    var whenDataReceived = function (resp) {
                        var iAm = 'ptCommentary';
                        var comTitle = document.createElement('div');
                        comTitle.innerHTML = '<h5 class="hide-collapsed ptComment">Pivotal Tracker Comments</h5>';
                        document.querySelector('#idPivotalComments').appendChild(comTitle);

                        var comInput = document.createElement('div');
                        comInput.className = 'ptCommentInput hide-collapsed';
                        comInput.innerHTML = '<textarea id="ptSayText" style="width:250px; height:100px;"></textarea><br /><button id="ptSaySubmit" type="submit" class="btn btn-default" style="margin-left:184px;">Submit</button>';
                        document.querySelector('#idPivotalComments').appendChild(comInput);
                        document.getElementById('ptSaySubmit').onclick = function () {
                            if (document.getElementById('ptSayText').value.length > 0) {
                                var whenDataReceived = function(resp) {
                                    $('#idPivotalComments').html(global.templates.pivotalComment);
                                    page.pivotal.getComments();
                                };
                                utils.xhrAction(iAm, 'POST', 'stories/PIVOTALSTORYID/comments', whenDataReceived, null, {
                                    "text": document.getElementById('ptSayText').value,
                                    "person_id": global.ids.pivotal.project.me.id
                                });
                            }
                        };

                        var commentTop = document.getElementById('ptSayText').getBoundingClientRect().top - 100;

                        resp = JSON.parse(resp).slice().reverse();
                        var commentTotal = 0;
                        _.each(resp, (comment) => {
                            commentTotal++;
                            var person = global.ids.pivotal.project.members.find((x) => x.person.id === comment.person_id).person;
                            var comDiv = document.createElement('div');
                            comDiv.className = 'ptComment hide-collapsed';
                            comDiv.innerHTML = '<div class="ptTimestamp" title="' + moment(comment.updated_at).format('MMMM Do YYYY, h:mm:ss a') + '">' + moment(comment.updated_at).fromNow() + '</div>';
                            if (global.templates.default === global.templates.localhost) {
                                comDiv.innerHTML += global.templates.default.replace(/IMGID/g, utils.properName(person.email)).replace(/IMGALT/g, person.name).replace('data-email=""', 'data-email="' + person.email + '"');
                            } else {
                                comDiv.innerHTML += global.templates.default.replace(/IMGID/g, comment.person_id).replace(/IMGALT/g, person.name).replace('data-email=""', 'data-email="' + person.email + '"');
                            }
                            comDiv.innerHTML += '<b>' + person.name + '</b> says:<br />' + comment.text;
                            if (global.ids.pivotal.project.me && person.username != global.ids.pivotal.project.me.username) {
                                comDiv.innerHTML += '<a href="javascript:void(0);" onclick="document.getElementById(\'ptSayText\').value+=\' @' + person.username + ' \';  document.querySelector(\'.issuable-sidebar\').scrollTo({top: ' + commentTop + ', behavior: \'smooth\'}); document.getElementById(\'ptSayText\').focus();" class="ptReply">Reply</a>';
                            }
                            if (comment.text && comment.text.indexOf('@') > -1) {
                                var replyAll = comment.text.match(/\B\@\w+/g);
                                if (replyAll.indexOf('@' + global.ids.pivotal.project.me.username) > -1) {
                                    replyAll.splice(replyAll.indexOf('@' + global.ids.pivotal.project.me.username), 1);
                                }
                                if (global.ids.pivotal.project.me && person.username != global.ids.pivotal.project.me.username) {
                                    replyAll.push('@' + person.username);
                                }
                                replyAll = replyAll.toString().replace(/,/g, ' ');
                                comDiv.innerHTML += '<a href="javascript:void(0);" onclick="document.getElementById(\'ptSayText\').value+=\' ' + replyAll + ' \'; document.querySelector(\'.issuable-sidebar\').scrollTo({top: ' + commentTop + ', behavior: \'smooth\'}); document.getElementById(\'ptSayText\').focus();" class="ptReply">Reply All</a>';
                            }
                            document.querySelector('#idPivotalComments').appendChild(comDiv);
                        });
                        if (commentTotal > 0) {
                            document.getElementById('pivotalParticipants').innerText = commentTotal;
                        }
                    };
                    utils.xhrAction('getComments', 'GET', 'stories/PIVOTALSTORYID/comments', whenDataReceived);
                },
                getReviews: function () {
                    var iAm = 'getReviews';
                    if ($('.reviewsEl').length > 0) {
                        return;
                    }
                    var whenDataReceived = function (resp) {
                        var reviewsEl = '<div class="reviewsEl">',
                            reviewEl = '';
                        resp = JSON.parse(resp);
                        if (resp.length === 0) {
                            reviewEl = '<div class="reviewEl"><span class="mycon ptIcon">💬</span></div>'; // fa-comment
                            reviewsEl += reviewEl;
                        }
                        _.each(resp, (review) => {
                            reviewEl += '<div class="reviewEl" data-review_id="' + review.id + '">';
                            if (review.reviewer_id) {
                                reviewEl = reviewEl.replace('class="', 'data-reviewer_id="' + review.reviewer_id + '" class="');
                                var person = global.ids.pivotal.project.members.find((x) => x.person.id === review.reviewer_id).person;
                                var imgAlt = person ? person.name : review.reviewer_id;
                                var friendlyName = person ? utils.properName(person.email) : pingPhoto;
                                if (global.templates.default === global.templates.localhost) {
                                    reviewEl += global.templates.default.replace(/IMGID/g, friendlyName).replace(/IMGALT/g, imgAlt).replace('s40', 's20');
                                } else {
                                    reviewEl += global.templates.default.replace(/IMGID/g, review.reviewer_id).replace(/IMGALT/g, imgAlt).replace('s40', 's20');
                                }
                                utils.debug({
                                    'iAm': 'getReviews-whenDataReceived',
                                    'review': review,
                                    'person': person,
                                    'imgAlt': imgAlt,
                                    'global.templates.default': global.templates.default,
                                });
                            }
                            var reviewTypeName = JSON.parse(global.ids.pivotal.project.review_types).review_types.find((x) => x.id === review.review_type_id).name;
                            switch (reviewTypeName) {
                                case 'Code':
                                    reviewEl += '<span title="' + reviewTypeName + '" class="mycon ptIcon" style="font-weight:bold;">👩🏻‍💻</span>'; // fa-code
                                    break;
                                case 'Design Review':
                                    reviewEl += '<span title="' + reviewTypeName + '" class="mycon ptIcon">🎨</span>'; // fa-crop (design)
                                    break;
                                case 'Al11y Reqs':
                                    reviewEl += '<span title="' + reviewTypeName + '" class="mycon ptIcon">♿</span>'; // fa-universal-access
                                    break;
                            }
                            if (review.status === 'pass') {
                                reviewEl += '<span title="PASS" class="mycon ptIcon pt' + reviewTypeName.replace(/ /g, '') + '" style="color:' + global.prefs.colorsInterface.find((x) => x.element === 'mrResolved').color + '" data-review_type_id="' + review.review_type_id + '">👍🏻</span>'; // fa-thumbs-up
                            } else if (review.status === 'fail') {
                                reviewEl += '<span title="FAIL" class="mycon ptIcon pt' + reviewTypeName.replace(/ /g, '') + '" style="color:' + global.prefs.colorsInterface.find((x) => x.element === 'mrUnresolved').color + '" data-review_type_id="' + review.review_type_id + '">👎🏻</span>'; // fa-thumbs-down
                            } else {
                                reviewEl += '<span title="UNSTARTED" class="mycon ptIcon pt' + reviewTypeName.replace(/ /g, '') + ' ptUnstarted">⌛</span>'; // fa-hourglass-start
                            }
                            reviewEl += '</div>';
                            reviewsEl += reviewEl;
                            reviewEl = '';
                        });
                        reviewsEl += '</div>';
                        tm.getContainer({
                            'el': '.js-mr-approvals',
                            'max': 100,
                            'spd': 1000
                        }).then(function($container){
                            $('.js-mr-approvals').append(reviewsEl);
                        });
                    };
                    utils.delayUntil(iAm, () => {return (global.ids.pivotal.project != null && global.ids.pivotal.project.project_id != null && global.ids.pivotal.project.review_types != null);}, () => {
                        utils.xhrAction(iAm, 'GET', 'stories/PIVOTALSTORYID/reviews', whenDataReceived);
                    });
                },
                getReviewTypes: function () {
                    var iAm = 'getReviewTypes';
                    if (!utils.pivotalHoursElapsed(iAm, 1) || global.ids.pivotal.gitlabRelation == null) {
                        return;
                    }
                    var whenDataReceived = function (resp) {
                        global.mems.pivotalData.projects.find(x => x.project_id === parseInt(global.ids.pivotal.gitlabRelation.project_id)).review_types = resp;
                        global.ids.pivotal.project.review_types = resp;
                    };
                    var finallyDoThis = function() {
                        tm.savePreferences(global.ids.memsName, global.mems);
                    };
                    utils.delayUntil(iAm, () => {return global.ids.pivotal.project != null;}, () => {
                        utils.xhrAction(iAm, 'GET', '?fields=review_types', whenDataReceived, finallyDoThis);
                    });
                },
                getStory: function () {
                    var iAm = 'getStory';
                    if (!utils.getPivotalStoryId() || global.ids.pivotal.story != null) {
                        utils.debug('no need');
                        return;
                    }
                    var whenDataReceived = function (resp) {
                        resp = JSON.parse(resp);
                        global.ids.pivotal.story = resp;
                        if (!document.getElementById('pivotalStoryDescription')) {
                            var ignoreIndex = 0;
                            var friendlyDescription = function(fdesc) {
                                if (!fdesc) {
                                    utils.debug('ERROR in friendlyDescription; fdesc must be defined!');
                                    return;
                                }
                                fdesc = fdesc.replace(/\*/g, '');
                                _.each(global.prefs.pivotalDescriptionIgnores, (ignoreMe) => {
                                    ignoreMe = ignoreMe.replace(/\*/g, '').replace(/ - /g, '').replace(/- /g, '');
                                    fdesc = fdesc.replace(ignoreMe, '<span id="ignoreTip' + ignoreIndex + '" class="mycon fingery ignoreTip" data-tippy="' + ignoreMe.replace(' ', '&nbsp;') + '">🍩</span>') // fa-ellipsis-h (donut)
                                    ignoreIndex++;
                                });
                                fdesc = fdesc.replace(/<\/i>\n/g, '</span>').replace(/ - /g, '').replace(/- /g, '');
                                return fdesc.replace(/\n/g, '<br />');
                            }
                            $('.issuable-discussion .detail-page-description').prepend('<div id="pivotalStoryDescription" class="fingery ' + (global.mems.pivotalData.states.storyExpanded ? 'pivotalStoryDescriptionExpanded' : '') + '">' +
                                                                                       '<div class="pivotalStoryTitle">Pivotal Story Description</div><div class="pivotalStoryDescriptionText">' + friendlyDescription(global.ids.pivotal.story.description) + '</div></div>');
                            $('.issuable-discussion .detail-page-description').append('<div style="clear:both;"></div>');
                            ignoreIndex = 0;
                            _.each(global.prefs.pivotalDescriptionIgnores, (ignore) => {
                                if(document.getElementById('ignoreTip' + ignoreIndex)) {
                                    tippy(document.getElementById('ignoreTip' + ignoreIndex), { content: document.getElementById('ignoreTip' + ignoreIndex).dataset.tippy });
                                }
                                ignoreIndex++;
                            });
                            $('.pivotalStoryDescriptionText').on('click', function(e) {
                                e.preventDefault();
                                e.stopPropagation();
                            });
                            $('#pivotalStoryDescription').on('click', function () {
                                if ($('#pivotalStoryDescription').hasClass('pivotalStoryDescriptionExpanded')) {
                                    $('#pivotalStoryDescription').removeClass('pivotalStoryDescriptionExpanded');
                                    global.mems.pivotalData.states.storyExpanded = false;
                                } else {
                                    $('#pivotalStoryDescription').addClass('pivotalStoryDescriptionExpanded');
                                    global.mems.pivotalData.states.storyExpanded = true;
                                }
                                tm.savePreferences(global.ids.memsName, global.mems);
                            });
                        }
                        if (global.ids.pivotal.story.current_state.toLowerCase() == 'unstarted' && global.prefs.autoStartPivotalStories) {
                            page.pivotal.putStoryState('started');
                        }
                    };
                    utils.delayUntil(iAm, () => {return global.ids.pivotal.project != null;}, () => {
                        utils.xhrAction(iAm, 'GET', 'stories/PIVOTALSTORYID/', whenDataReceived);
                    });
                },
                postReview: function (review_type_id) {
                    var iAm = 'postReview';
                    var whenDataReceived = function (resp) {
                        resp = JSON.parse(resp);
                        // remove an unstarted review of this type, since we just added one.
                        var reviewTypeName = JSON.parse(global.ids.pivotal.project.review_types).review_types.find((x) => x.id === resp.review_type_id).name;
                        if ($('.pt' + reviewTypeName + '.ptUnstarted').length > 0) {
                            var removeId = $('.pt' + reviewTypeName + '.ptUnstarted').parent().attr('data-review_id');
                            page.pivotal.deleteReview(removeId);
                            setTimeout(() => {
                                $('.reviewsEl').remove();
                                page.pivotal.getReviews();
                            }, TIMEOUT);
                            //                             var approveButton = document.querySelector(approveSelector);
                            //                             approveButton.classList.remove('tm-approveButton');
                        } else {
                            $('.reviewsEl').remove();
                            page.pivotal.getReviews();
                        }
                    };
                    utils.xhrAction(iAm, 'POST', 'stories/PIVOTALSTORYID/reviews?review_type_id=' + review_type_id + '&reviewer_id=' + global.ids.pivotal.project.me.id + '&status=Pass', whenDataReceived);
                },
                putStoryState: function(toState) {
                    var iAm = 'postStory';
                    if (!utils.getPivotalStoryId()) {
                        return;
                    }
                    var whenDataReceived = function (resp) {
                        resp = JSON.parse(resp);
                        var rememberActivity = global.ids.pivotal.story.activity;
                        global.ids.pivotal.story = resp;
                        global.ids.pivotal.story.activity = rememberActivity; // TODO: This is stupid. Do it better.
                    };
                    var params;
                    if (global.ids.pivotal.story.owner_ids.indexOf(global.ids.pivotal.project.me.id) > -1) {
                        params = {'current_state': toState};
                    } else {
                        global.ids.pivotal.story.owner_ids.push(global.ids.pivotal.project.me.id);
                        params = {
                            'current_state': toState,
                            'owner_ids': global.ids.pivotal.story.owner_ids
                        }
                    };
                    utils.delayUntil(iAm, () => {return global.ids.pivotal.project != null;}, () => {
                        utils.xhrAction(iAm, 'PUT', 'stories/PIVOTALSTORYID/', whenDataReceived, null, params);
                    });
                }
            },
            scanMergeRequest() {
                if (document.URL.indexOf('merge_requests/') < 0) {
                    return;
                }
                if (global.prefs.mrPrefixes.length > 0) {
                    let prefixes = [ ...global.prefs.mrPrefixes ];
                    const isTagged = function(commitMessage) {
                        const regPrefixes = `(${prefixes.join('|')})`;
                        let angularCommitRegex = new RegExp(`^(draft\: ?|wip\: ?)?(${regPrefixes})\\(?.*\\)?\: ?`, `i`);
                        if (commitMessage.match(angularCommitRegex)) {
                            return true;
                        }
                        return false;
                    }
                    var pWarn = document.createElement('div');
                    pWarn.setAttribute('id', 'prefixWarning');
                    pWarn.innerText = 'Please ensure the title begins with one of the following and a colon: [' + prefixes.join(`, `) + ']';
                    pWarn.style.color = 'red';
                    var mrTitle = document.getElementById('merge_request_title') || document.querySelector('.detail-page-description .title');
                    if (mrTitle) {
                        var mrTitleVal = mrTitle.innerText.length === 0 ? mrTitle.value : mrTitle.innerText;

                        if (!isTagged(mrTitleVal)) {
                            if (!document.getElementById('prefixWarning')) {
                                mrTitle.parentElement.appendChild(pWarn);
                            }
                        } else {
                            if (document.getElementById('prefixWarning')) {
                                document.getElementById('prefixWarning').remove();
                            }
                        }
                    }
                }

                if (!global.states.mergeRequestScanned && !global.states.mergeRequestScanAndFound) {
                    global.states.mergeRequestScanned = true;
                    var lineCount = 0;
                    var foundOffenses = [];
                    document.querySelectorAll('.line').forEach((line) => {
                        global.prefs.offendingCode.forEach((offense) => {
                            var regexr = new RegExp(offense, "gi");
                            if (line.innerText.match(regexr)) {
                                global.states.mergeRequestScanAndFound = true;
                                foundOffenses.indexOf(offense) === -1 && foundOffenses.push(offense);
                                lineCount++;
                            };
                        });
                    });
                    if (lineCount > 0) {
                        $.growl.error({'message': 'Found ' + lineCount + ' code violations including instances of ' + foundOffenses.join(', ')});
                    }
                }
                tm.getContainer({
                    'el': '.timeline-entry-inner',
                    'max': 100,
                    'spd': 1000
                }).then(function($container){
                    if (!global.states.mergeRequestApprovalsScanned && !global.states.mergeRequestApprovalsScanAndFound) {
                        global.states.mergeRequestApprovalsScanned = true;
                        var lineCount2 = 0;
                        var previousApprovers = [];
                        var searchThreadsFor = ['approved this']
                        searchThreadsFor.forEach((scound) => {
                            _.each($('span:contains("' + scound + '")'), (el) => {
                                global.states.mergeRequestApprovalsScanAndFound = true;
                                if ($(el) && ($(el).parent().find('.author-username').length > 0 || $(el).parent().find('.author-name-link').length > 0)) {
                                    var authorName = $(el).parent().find('.author-username').length > 0 ? $(el).parent().find('.author-username').find('span').text() : $(el).parent().find('.author-name-link').find('span').text();
                                    previousApprovers.indexOf(authorName) === -1 && previousApprovers.push(authorName);
                                    lineCount2++;
                                }
                            });
                        });
                        if (lineCount2 > 0) {
                            $.growl.notice({'message': 'Previously approved: ' + previousApprovers.join(', ')});
                        }
                    }
                });
                tm.getContainer({
                    'el': 'h4:contains("Some changes are not shown")',
                    'max': 100,
                    'spd': 1000
                }).then(function($container){
                    $('h4:contains("Some changes are not shown")').closest('div[role="alert"]').hide()
                });
                // ONLY PROCESS THE FOLLOWING ON A CREATE-MERGE REQUEST PAGE:
                if (mrTitle && global.prefs.mrPrefixes.length > 0) {
                    if (document.URL.indexOf('/edit') < 0 && document.URL.indexOf('/new') < 0) {
                        return;
                    }
                    var shouldDisableSubmit = true;
                    prefixes.forEach((pfix) => {
                        if (isTagged(mrTitleVal, pfix)) {
                            shouldDisableSubmit = false;
                        }
                    });
                    if (shouldDisableSubmit) {
                        document.querySelector('input[type="submit"]').disabled = true;
                        if (!document.getElementById('prefixWarning')) {
                            document.querySelector('input[type="submit"]').parentElement.appendChild(pWarn);
                        }
                    } else {
                        document.querySelector('input[type="submit"]').disabled = false;
                        if (document.getElementById('prefixWarning')) {
                            document.getElementById('prefixWarning').remove();
                        }
                    }
                }
            },
            setAvatars: function () {
                if (!(global.prefs.useLocalAvatars)) {
                    return;
                }

                if (!global.states.avatarPingFailed && pingPhoto != null && global.prefs.avatarPreference[0] === 'localhost') {
                    tm.ping(avatarHost + pingPhoto + imageExt, function callback (response) {
                        if (response === 'responded') {
                            global.states.avatarPingFailed = false;
                        } else {
                            global.states.avatarPingFailed = true;
                        }
                        global.mems.avatarPingTimer = moment();
                        tm.savePreferences(global.ids.memsName, global.mems);
                    });
                }

                var avatarArray = [],
                    thisName = 'none';

                // gitlab
                var avatars = [
                    {
                        element: '.header-user-avatar', // main header (user) image
                        getImgSource: null,
                        getNameSource: function(el) { return $('.user-name').text(); }
                    },{
                        element: '.btn-link .author', // right side-bar (collapsed) author
                        getImgSource: function(el) { return $(el).parent().find('img'); },
                        getNameSource: function(el) { return $(el).next().text(); }
                    },{
                        element: '.participants-author img', // right side-bar, list of participants
                        getImgSource: null,
                        getNameSource: function(el) { return $(el).next().find('div').text(); }
                    },{
                        element: '.issuable-meta .author-link img', // Opened X hours ago by...
                        getImgSource: null,
                        getNameSource: function(el) { return $(el).next().text(); }
                    },{
                        element: '.author-link.inline img', // Merged by...
                        getImgSource: null,
                        getNameSource: function(el) { return $(el).parent().prop('title'); }
                    },{
                        element: '.user-avatar-link img', // Approvers
                        getImgSource: null,
                        getNameSource: function(el) { return $(el).prop('alt').length > 0 ? $(el).prop('alt') : $(el).closest('a').prop('href'); }
                    },{
                        element: '.pipeline-triggerer', // Pipeline Triggerers
                        getImgSource: function(el) { return $(el).find('img'); },
                        getNameSource: function(el) {
                            function getBaseUrl() {
                                var re = new RegExp(/^.*\//);
                                return re.exec(window.location.href);
                            }
                            return $(el).closest('a').prop('href').replace(getBaseUrl(), '');
                        }
                    },{
                        element: '.header-user-dropdown-global img',
                        getImgSource: null,
                        getNameSource: function(el) { return $(el).parent().prop('href'); }
                    },{
                        element: '.avatar-cell img',
                        getImgSource: null,
                        getNameSource: function(el) { return $(el).prop('title'); }
                    },{
                        element: '.avatar-holder img',
                        getImgSource: null,
                        getNameSource: function(el) { return $(el).parent().parent().next().find('.cover-title').text(); }
                    },{
                        element: '.list-item-name img',
                        getImgSource: null,
                        getNameSource: function(el) { return $(el).next().find('.member').text(); }
                    },{
                        element: '.user-popover img',
                        getImgSource: null,
                        getNameSource: function(el) { return $(el).parent().parent().next().find('h5').text(); }
                    },{
                        element: '.system-note-image img',
                        getImgSource: null,
                        getNameSource: function(el) { return $(el).parent().prop('href'); }
                    },{
                        element: '.assignee .author-link img', // right side-bar, assigned-to
                        getImgSource: null,
                        getNameSource: function(el) { return $(el).next().text(); }
                    },{
                        element: '.js-pipeline-url-user img', // Pipelines tab on merge request
                        getImgSource: null,
                        getNameSource: function(el) { return $(el).next().find('div').text(); }
                    },{
                        element: '.issuable-meta .author-link img', // project's Merge Request page list
                        getImgSource: null,
                        getNameSource: function(el) { return $(el).parent().prop('title'); }
                    },{
                        element: '.todo-avatar img', // TODO: page avatars
                        getImgSource: null,
                        getNameSource: function(el) { return $(el).prop('alt').replace('\'s avatar', ''); }
                    },{
                        element: '.search-token-assignee img', // Merge Request list page
                        getImgSource: null,
                        getNameSource: function(el) { return $(el).parent().text(); }
                    },{
                        element: '.ptComment img', // Merge Request page Pivotal Tracker Comments
                        getImgSource: null,
                        getNameSource: function(el) { return $(el).prop('alt'); }
                    },{
                        element: '.sidebar-collapsed-icon .avatar', // Merge Request page sidebar collapsed assigned-to
                        getImgSource: null,
                        getNameSource: function(el) { return $(el).prop('alt').replace("'s avatar", ''); }
                    },{
                        element: '.hide-collapsed .gl-link .avatar-inline:not(.js-lazy-loaded)', // Merge Request page sidebar expanded assigned-to
                        getImgSource: null,
                        getNameSource: function(el) { return $(el).prop('alt').replace("'s avatar", ''); }
                    },{
                        element: '.author-link img.js-lazy-loaded', // Merge Request page sidebar expanded participants
                        getImgSource: null,
                        getNameSource: function(el) { return $(el).parent().parent().prop('href'); }
                    },{
                        element: '.reviewEl img', // Merge Request page sidebar expanded participants
                        getImgSource: null,
                        getNameSource: function(el) { return $(el).prop('alt'); }
                    },{
                        element: '.gl-avatar', // members list
                        getImgSource: null,
                        getNameSource: function(el) { return el.parentElement.querySelector('.gl-avatar-labeled-label').innerText; }
                    }
                ];

                avatars.forEach(avatar => {
                    tm.getContainer({
                        'el': avatar.element
                    }).then(function($container){
                        var iter = $(avatar.element).is('img') ? $(avatar.element) : avatar.getImgSource(avatar.element);
                        _.each(iter, function (img) {
                            thisName = utils.properName(avatar.getNameSource(img));
                            utils.debug({'iAm': 'avatars.forEach', 'avatar': avatar, 'thisName': thisName});
                            thisName && utils.updateImg(img, thisName);
                        });
                    });
                });

                $('img').each(function() {
                    var img = new Image(),
                        self = this;

                    img.onerror = function(){
                        $(self).prop('src', 'http://' + avatarHost + '!none' + imageExt);
                    }

                    if (this.src.indexOf('avatar_url') < 0) {
                        img.src = this.src;
                    }
                });

            },
            monitorPipelines: function () {
                if (document.URL.indexOf('/jobs/') < 0 || $('.js-line span').length === 0) {
                    return;
                }
                var growlHigh = '',
                    growlMed = '',
                    growlLow = '';
                _.each($('.js-line span'), (jsLine) => {
                    var lineContent = jsLine.innerHTML,
                        offset = $(jsLine).offset();
                    _.each(global.prefs.pipelineLogFilters, (pFilter) => {
                        var inlineClassName = pFilter.name.replace(/ /g, '');
                        if (lineContent.toLowerCase().indexOf(pFilter.key.toLowerCase()) > -1 && $(jsLine).closest('.ws-pre-wrap').find('.pipelineLog-' + inlineClassName).length === 0) {
                            if ($(jsLine).closest('.js-line').find('.pipelineLog-' + inlineClassName).length === 0) {
                                jsLine.innerHTML = '<span class="pipelineLog-' + inlineClassName + '">' + jsLine.innerHTML + '</span>';
                                var lineMessage = '<b><a style="color:black;" href="javascript:void(0)" onclick="$(\'.log-line [data-testid=angle-right-icon]\').parent().click(); setTimeout(function() {window.scrollTo({top: ' + (offset.top - 80) + ', behavior: \'smooth\'})}, 50);">See this line</a></b>' + lineContent;
                            if (pFilter.severity === "high" ) {
                                growlHigh += lineMessage + '<br /><br />';
                            } else if (pFilter.severity === "medium" ){
                                growlMed += lineMessage + '<br /><br />';
                            } else if (pFilter.severity === "low" ) {
                                growlLow += lineMessage + '<br /><br />';
                            }
                        }
                        }
                    });
                });
                var collapseInits = function() {
                    // collapse these as we really don't NEED to look at their contents that much
                    $('span:contains("Getting source from Git repository")').closest('[role="button"]').click();
                    $('span:contains("Preparing environment")').closest('[role="button"]').click();
                    $('span:contains("kubernetes")').closest('[role="button"]').click();
                };
                if (document.getElementById('showGrowls') == null) {
                    $('.blocks-container').append('<div id="growlLow" style="display:none;">' + growlLow + '</div');
                    $('.blocks-container').append('<div id="growlMed" style="display:none;">' + growlMed + '</div');
                    $('.blocks-container').append('<div id="growlHigh" style="display:none;">' + growlHigh + '</div');
                    $('.blocks-container').prepend('<button id="collapseInits" class="btn btn-default" style="margin-right:0.625rem;">Toggle Inits</button>');
                    $('.blocks-container').prepend('<button id="showGrowls" class="btn btn-default" style="margin:0.3125rem;">Show Highlights</button>');
                    $('#showGrowls').on('click', () => {
                        var texts = [
                            document.getElementById('growlLow') ? document.getElementById('growlLow').innerHTML : null,
                            document.getElementById('growlMed') ? document.getElementById('growlMed').innerHTML : null,
                            document.getElementById('growlHigh') ? document.getElementById('growlHigh').innerHTML : null
                        ];
                        utils.showGrowls(texts[0], texts[1], texts[2])
                    });
                    $('#collapseInits').on('click', () => {
                        collapseInits();
                    });
                }
                if (!global.states.arePipelinesChecked) {
                    global.states.arePipelinesChecked = true;
                    utils.showGrowls(growlLow, growlMed, growlHigh);
                    collapseInits();
                }
            },
            monitorTodos: function () {
                if ($('#timerStats').length === 0) {
                    $('body').append('<span id="timerStats" style="display:none;"></span>');
                }
                if ($('#timerHiddenCount').length === 0) {
                    $('body').append('<span id="timerHiddenCount" style="display:none;"></span>');
                }
                var todoElement = '[aria-label="To-Do List"] .badge';
                var indicateSecondsTimer,
                    todosText = $(todoElement).eq(0).text().replace(/(\r\n\t|\n|\r\t)/gm,''),
                    todosCount = todosText == null || todosText.length === 0 ? 0 : Number(todosText),
                    notificationIcon = 'https://gitlab.dell.com/assets/favicon-7901bd695fb93edb07975966062049829afb56cf11511236e61bcf425070e36e.png',
                    indicateSeconds = function() {
                        var secondsRemaining = (Math.floor(global.reload.timespan/1000) - global.reload.lapsed);
                        $('#timerStats').text(todosCount + ' : (' + secondsRemaining + ')');
                        global.reload.lapsed++;
                        if (secondsRemaining > 0) {
                            indicateSecondsTimer = setTimeout(indicateSeconds, 1000);
                        } else {
                            $('#timerStats').text(global.reload.title);
                        }
                    },
                    triggerNotification = function(notifyMessage) {
                        var notification = new Notification(notifyMessage, {
                            icon: notificationIcon,
                            requireInteraction: todosCount === 0 ? false : !(global.prefs.autohideNotification),
                            body: todosCount
                        });
                        notification.onclick = function () {
                            window.open('https://gitlab.dell.com/dashboard/todos');
                        };
                        if (document.URL.indexOf('todos') > -1) {
                            window.location.reload(false);
                        }
                    }
                if (Notification.permission === 'default') {
                    Notification.requestPermission();
                } else {
                    if (!global.states.todoMonitorInitialized) {
                        global.states.todoMonitorInitialized = true;
                        global.reload.lapsed = 0;

                        var duration = moment.duration(moment().diff(global.mems.todosTimestamp)),
                            hours = duration.asHours(),
                            diffSeconds = duration.asSeconds();

                        if (Number(todosCount) > 0 && hours > 1) {
                            utils.debug({
                                '1reason': 'Been a while. Incrementing reloadTimesReminded',
                                '2mems': global.mems,
                                '3savedMems': utils.savedMems()
                            });
                            global.mems.todosTimestamp = moment();
                            global.mems.reloadTimesReminded = Number(global.mems.reloadTimesReminded) + 1;
                            if (global.mems.reloadTimesReminded > Number(utils.savedMems().reloadTimesReminded)) {
                                tm.savePreferences(global.ids.memsName, global.mems);
                                global.mems = utils.savedMems();
                            }
                        }

                        var currentMems = utils.savedMems();
                        var seconds;
//                         utils.debug({
//                             "hours": hours,
//                             "mems": currentMems
//                         });
                        if (todosCount !== global.mems.todosCount) {
                            // trigger notification on todo count change
                            if (currentMems != null && !_.isEmpty(currentMems)) {
                                global.mems.manyTabTimestamp = currentMems.manyTabTimestamp;
                            }
                            duration = moment.duration(moment().diff(global.mems.manyTabTimestamp));
                            seconds = Math.round(duration.asSeconds());
                            if (seconds > 30) { // to prevent multiple GitLab tabs all opening a notification each
                                utils.debug('Todos / Todos in memory: ' + todosCount + ':' + global.mems.todosCount);
                                global.mems.manyTabTimestamp = moment();
                                tm.savePreferences(global.ids.memsName,global.mems);
                                triggerNotification('TODOs on GitLab:');
                            }
                        } else if (Number(todosCount) > 0 && hours > 1 && Number(currentMems.reloadTimesReminded) > Number(currentMems.reloadReminderCount)) {
                            setTimeout(function () {
                                duration = moment.duration(moment().diff(global.mems.manyTabReminderTime));
                                seconds = Math.round(duration.asSeconds());
                                if (seconds > 30) {
                                    utils.debug('Time to remind user about existing Todos...');
                                    global.mems.manyTabReminderTime = moment();
                                    tm.savePreferences(global.ids.memsName,global.mems); // shouldn't hurt to do this twice "in a row"
                                    // trigger notification on hourly timeout if there ARE any
                                    global.mems.reloadTimesReminded = 0;
                                    global.mems.reloadReminderCount = Number(global.mems.reloadReminderCount) + 1;
                                    triggerNotification('Reminder- GitLab TODOs:');
                                    global.mems.todosTimestamp = moment();
                                    if (Number(global.mems.reloadReminderCount) > 8) {
                                        global.mems.reloadReminderCount = 0;
                                        global.mems.reloadTimesReminded = 0;
                                    }
                                    tm.savePreferences(global.ids.memsName,global.mems);
                                }
                            }, Math.floor(Math.random() * 500) + 50);
                        }

                        // update stored count
                        if(todosCount !== global.mems.todosCount) {
                            global.mems.todosCount = todosCount;
                            global.mems.reloadReminderCount = 0;
                            global.mems.reloadTimesReminded = 0;
                            tm.savePreferences(global.ids.memsName,global.mems);
                        }

                        // Reload in X seconds
                        global.reload.todoTimer = setTimeout(function() {
                            // "reload" the page
                            if (!global.prefs.todosAreMrs) { // if prefs are set to check default TODO list
                                $('#timerHiddenCount').load( "https://gitlab.dell.com/dashboard/todos .todos-pending .badge", function(responseTxt, statusTxt, xhr){
                                    if(statusTxt === 'success') {
                                        // External content loaded successfully
                                        if ($(todoElement).length > 0) {
                                            $(todoElement).text($('#timerHiddenCount').text()).removeClass('hidden');
                                            $(todoElement).addClass('beepboop');
                                            setTimeout(() => {
                                                $(todoElement).removeClass('beepboop');
                                            }, 250);
                                        }
                                        timeoutElement();
                                        global.states.todoMonitorInitialized = false;
                                        setTimeout(page.monitorTodos, TIMEOUT);
                                    }
                                    if(statusTxt === 'error') {
                                        utils.debug('Error: ' + xhr.status + ': ' + xhr.statusText);
                                    }
                                });
                            } else { // if prefs are set to check non-draft MR's
                                var mergeRequestUrl = document.location.href;
                                if (mergeRequestUrl.indexOf('/-/') > -1) {
                                    mergeRequestUrl = mergeRequestUrl.substr(0, mergeRequestUrl.indexOf('/-/'));
                                }
                                $('#timerHiddenCount').load( mergeRequestUrl + '/-/merge_requests?scope=all&utf8=%E2%9C%93&state=opened&draft=no .merge-request', function(responseTxt, statusTxt, xhr){
                                    if(statusTxt === 'success') {
                                        // External content loaded successfully
                                        if ($(todoElement).length > 0) {
                                            $(todoElement).text($('#timerHiddenCount').find('.merge-request').length);
                                            $(todoElement).removeClass('hidden');
                                            $(todoElement).addClass('beepboop');
                                            setTimeout(() => {
                                                $(todoElement).removeClass('beepboop');
                                            }, 250);
                                        }
                                        timeoutElement();
                                        global.states.todoMonitorInitialized = false;
                                        setTimeout(page.monitorTodos, TIMEOUT);
                                    } else if(statusTxt === 'error') {
                                        utils.debug('Error: ' + xhr.status + ': ' + xhr.statusText);
                                    }
                                });
                            }
                        }, global.reload.timespan);

                        var buttonAnchor = $('.page-title');
                        var buttonCancelReload = 'Cancel-Reload';
                        var timeoutElement = function () {
                            clearTimeout(global.reload.todoTimer);
                            clearTimeout(indicateSecondsTimer);
                            $('#' + buttonCancelReload).css('display', 'none');
                            $('#timerStats').text(global.reload.title);
                            return false;
                        };
                        //buttonAnchor.after('<button id="' + buttonCancelReload + '" style="margin-left:50px; border-radius:15px; border:0px; background:lightgoldenrodyellow; padding:5px 15px; ">' + buttonCancelReload + '</button>');
                        //$('#' + buttonCancelReload).click(timeoutElement);

                        var buttonNotifyMe = 'Notify-Me';
                        var notifyMe = function() {
                            if (Notification.permission !== "granted") {
                                Notification.requestPermission();
                            } else {
                                var notification = new Notification('Permission Granted', {
                                    icon: notificationIcon,
                                    body: "Notifications have been allowed.",
                                });
                            }
                            $('#' + buttonNotifyMe).css('display', 'none');
                            return false;
                        }

                        if (Notification.permission !== 'granted') {
                            buttonAnchor.after('<button id="' + buttonNotifyMe + '" style="margin-left:50px; border-radius:15px; border:0px; background:lightgrey; padding:5px 15px; ">' + buttonNotifyMe + '</button>');
                            $('#' + buttonNotifyMe).click(notifyMe);
                        }

                        setTimeout(indicateSeconds, 1000);

                    }
                }
            },
            linkWorkItems: function () {
                if (!global.states.titlesLinked) {
                    global.states.titlesLinked = true;
                    var linkText, linkHref,
                        titleText = $('h2.title').text();
                    if (titleText.toUpperCase().indexOf('PT#') > -1) {
                        linkText = titleText.match(/PT#[0-9]*/gi).toString().split(',');
                        linkText.forEach(thisLink => {
                            if (utils.isNumeric(thisLink.substr(thisLink.length-1, 1))) {
                                linkHref = '<a href="https://www.pivotaltracker.com/story/show/' + thisLink.replace(/PT\#/gi, '') + '" target="blank">' + thisLink + '</a>';
                                titleText = titleText.replace(thisLink, linkHref);
                            }
                        });
                    }
                    if (titleText.toUpperCase().indexOf('TFS#') > -1) {
                        linkText = titleText.match(/TFS#[0-9]*/gi).toString().split(',');
                        linkText.forEach(thisLink => {
                            if (utils.isNumeric(thisLink.substr(thisLink.length-1, 1))) {
                                linkHref = '<a href="http://tfs2.dell.com:8080/tfs/eDell/eDellPrograms/_workitems?id=' + thisLink.replace(/TFS\#/gi, '') + '" target="blank">' + thisLink + '</a>';
                                titleText = titleText.replace(thisLink, linkHref);
                            }
                        });
                    }
                    $('h2.title').html(titleText);
                }
            },
            checkForInactivity: function () {
                let duration = moment.duration(moment().diff(global.activityTimestamp));
                let seconds = Math.round(duration.asSeconds())
                if (seconds > 300) {
                    global.states.arePrButtonsAdded = false;
                }
            }
        };

    setTimeout(function() {
        utils.initScript();
        document.addEventListener('mousemove', function handleMouseEvent () {
            if (!global.states.isMouseMoved) {
                global.states.isMouseMoved = true;
                setTimeout(function() {
                    global.states.isMouseMoved = false;
                }, TIMEOUT * 2);
                if (document.getElementById('GitlabModsOptions') == null) { // don't re-init the script when a popup is open
                    utils.initScript();
                    if ($('.line_content').length > 0) {
                        global.states.mergeRequestScanned = false;
                    };

                }
            }
            //             if (global.mems != null & global.states.avatarPingFailed) { // reset ping timer every 15 seconds, I guess
            //                 var duration = moment.duration(moment().diff(global.mems.avatarPingTimer));
            //                 if (global.mems.avatarPingTimer != null && Math.round(duration.asSeconds()) > 15) {
            //                     global.states.avatarPingFailed = false;
            //                     global.mems.avatarPingTimer = null;
            //                     tm.savePreferences(global.memsName, global.mems);
            //                 }
            //             }
        });
    }, TIMEOUT);

})();