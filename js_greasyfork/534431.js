// ==UserScript==
// @name           LSPD Forum Activity Logger Helper
// @namespace      http://tampermonkey.net/
// @version        1.5
// @license MIT
// @description    Adds button to log posts to personal thread (generates monthly template on new reply, edits last post). Opens in new tab.
// @author         Sebz
// @match          *://lspd.gta.world/viewtopic.php*
// @match          *://lspd.gta.world/posting.php*
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_deleteValue
// @grant          GM_registerMenuCommand
// @grant          GM_addStyle
// @grant          GM_xmlhttpRequest
// @require        https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @connect        lspd.gta.world
// @downloadURL https://update.greasyfork.org/scripts/534431/LSPD%20Forum%20Activity%20Logger%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/534431/LSPD%20Forum%20Activity%20Logger%20Helper.meta.js
// ==/UserScript==

/* globals $, GM_setValue, GM_getValue, GM_deleteValue, GM_registerMenuCommand, GM_addStyle, GM_xmlhttpRequest, DOMParser */

(function() {
    'use strict';

    // --- Configuration ---
    const CONFIG_KEY = 'personalLogThreadUrl_LSPD';
    const REPLY_TEXTAREA_SELECTOR = '#message';
    const BUTTON_INSERTION_POINT_SELECTOR = '.btn-toolbar';
    const POST_CONTAINER_SELECTOR = 'div[id^="p"]';
    const MAIN_CONTENT_AREA_SELECTOR = '#page-body'; // *** ADJUST THIS if needed (e.g., #content, .main-content) ***
    const BUTTON_TEXT = 'Log Post';
    const SINGLE_EVENT_BBCODE_FORMAT = '[url={URL}]{DATE} - {DESCRIPTION}[/url]'; // Format for the single log line
    const DEFAULT_DESCRIPTION = 'EDIT_DESCRIPTION';
    const DATE_PLACEHOLDER = '??/???/????';
    const GM_ACTIVITY_LOGGER_DATA_KEY = 'lspdActivityLoggerData_temp'; // Changed from SESSION_STORAGE_KEY

    // --- NEW: Monthly Template ---
    const MONTHLY_TEMPLATE = `[divbox2=transparent][center][size=120]METROPOLITAN DIVISION[/size]
[size=150][b]MONTHLY ACTIVITY LOG ({MONTH}, {YEAR})[/b][/size][hr]
[color=transparent].[/color]
[b][size=120]PATROLS / FIELD SEARCHES[/size][/b]
[justify][center]

[/center][/justify]
[br][/br]
[b][size=120]DEPLOYMENTS[/size][/b]
[justify][center]

[/center][/justify]
[br][/br]
[b][size=120]TOTAL ACTIVITY POINTS[/size][/b]
00
[/center][/divbox2]`;


    // --- Styling ---
    GM_addStyle(`
        .log-activity-button-group { margin-left: 5px; }
        .log-activity-button i { margin-right: 3px; }
        .activity-logger-loading { cursor: wait; opacity: 0.7; }
    `);

    // --- Helper Functions ---
    function getConfiguredUrl() { return GM_getValue(CONFIG_KEY, null); }

    function configureUrl() {
        const currentUrl = getConfiguredUrl();
        const newUrl = prompt('Enter the FULL URL of your personal activity log thread (Personnel File - viewtopic.php URL):', currentUrl || 'https://lspd.gta.world/viewtopic.php?f=XXX&t=YYYYY');
        if (newUrl && newUrl.trim() !== '' && newUrl.includes('lspd.gta.world/viewtopic.php') && newUrl.match(/[?&]t=\d+/)) {
            GM_setValue(CONFIG_KEY, newUrl.trim()); alert('Personal log thread URL saved!');
        } else if (newUrl !== null) { alert('Invalid URL entered. Please enter the full viewtopic.php URL for your personnel file, including f= and t= parameters. Configuration not changed.');
        } else { alert('Configuration cancelled.'); }
    }

    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search); return urlParams.get(param);
    }
    function getParamFromUrlString(param, url) {
        if (!url) return null; const match = url.match(new RegExp('[?&]' + param + '=(\\d+)')); return match ? match[1] : null;
    }

    function getPermalinkForPost(postElement) {
        if (!postElement) return null;
        const postDiv = $(postElement).closest(POST_CONTAINER_SELECTOR);
        const postId = postDiv.attr('id');
        if (postId && postId.startsWith('p') && /^p\d+$/.test(postId)) {
            const postIdNumber = postId.substring(1); return `./viewtopic.php?p=${postIdNumber}#${postId}`;
        }
        console.warn('Activity Logger: Could not determine valid permalink for post:', postElement); return '#';
    }

    function parsePostDate(postElement) {
        try {
            const postDiv = $(postElement).closest(POST_CONTAINER_SELECTOR);
            let dateElement = postDiv.find('.postbody .post-date time').first();
            if (!dateElement.length) dateElement = postDiv.find('.author time').first();
            if (!dateElement.length) dateElement = postDiv.find('.post-time').first();
            if (!dateElement.length) dateElement = postDiv.find('.postbody .post-date').first();
            if (!dateElement.length) dateElement = postDiv.find('.author').contents().filter(function() { return this.nodeType === 3 && /\w{3}\s+\d{1,2},\s+\d{4}/i.test(this.textContent); }).first();

            if (dateElement.length > 0) {
                let dateText = dateElement.attr('datetime') || dateElement.text(); dateText = dateText.replace(/[,.]/g, '').replace(/-/g,'').trim();
                const dateObj = new Date(dateText);
                if (!isNaN(dateObj.getTime())) {
                    const day = String(dateObj.getDate()).padStart(2, '0');
                    const month = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
                    const year = dateObj.getFullYear(); return `${day}/${month}/${year}`;
                } else { console.warn('Activity Logger: Could not parse date text:', dateText, 'from element:', dateElement); }
            } else { console.warn('Activity Logger: Could not find date element for post.'); }
        } catch (e) { console.error('Activity Logger: Error parsing date:', e); }
        return DATE_PLACEHOLDER;
    }

    // --- Button Click Handler (Updated New Reply Logic) ---
    function handleLogButtonClick(event) {
        event.preventDefault();
        const logThreadUrl = getConfiguredUrl();

        if (!logThreadUrl) { alert('Personal log thread URL is not configured!'); configureUrl(); return; }

        const forumId = getParamFromUrlString('f', logThreadUrl);
        const topicId = getParamFromUrlString('t', logThreadUrl);

        if (!forumId || !topicId) { alert('Error: Could not extract forum/topic ID from configured URL.'); return; }

        const clickedButton = $(this);
        clickedButton.addClass('activity-logger-loading');

        const permalink = getPermalinkForPost(clickedButton[0]);
        const postDate = parsePostDate(clickedButton[0]);
        const singleEventLink = SINGLE_EVENT_BBCODE_FORMAT.replace('{URL}', permalink)
                                                         .replace('{DATE}', postDate)
                                                         .replace('{DESCRIPTION}', DEFAULT_DESCRIPTION);

        if (!permalink || permalink === '#') {
            alert('Error: Could not determine permalink for this post.');
            clickedButton.removeClass('activity-logger-loading'); return;
        }

        const isNewReply = confirm("Add to a NEW monthly reply? (Click OK)\n\nOr EDIT your LAST post in this thread? (Click Cancel)");

        let finalBbCodeToStore;

        if (isNewReply) {
            const now = new Date();
            const currentMonth = now.toLocaleString('en-US', { month: 'long' }).toUpperCase();
            const currentYear = now.getFullYear();
            const populatedTemplate = MONTHLY_TEMPLATE.replace('{MONTH}', currentMonth).replace('{YEAR}', currentYear);
            finalBbCodeToStore = populatedTemplate + '\n\n' + singleEventLink;
            const replyPageUrl = `./posting.php?mode=reply&f=${forumId}&t=${topicId}`;

            console.log('Activity Logger: Generating new month template and opening new reply page in new tab:', replyPageUrl);
            GM_setValue(GM_ACTIVITY_LOGGER_DATA_KEY, JSON.stringify({ bbCode: finalBbCodeToStore }));
            window.open(replyPageUrl, '_blank');
            clickedButton.removeClass('activity-logger-loading'); // Remove loading as action is done from this tab's perspective
        } else {
            finalBbCodeToStore = singleEventLink;
            console.log('Activity Logger: Attempting to find last post ID to edit...');
            GM_xmlhttpRequest({
                method: "GET",
                url: logThreadUrl,
                onload: function(response) {
                    try {
                        if (response.status >= 200 && response.status < 300) {
                            const parser = new DOMParser();
                            const doc = parser.parseFromString(response.responseText, "text/html");
                            const specificSelector = MAIN_CONTENT_AREA_SELECTOR + ' ' + POST_CONTAINER_SELECTOR;
                            let postElements = doc.querySelectorAll(specificSelector);

                            if (!postElements || postElements.length === 0) {
                                console.warn(`Activity Logger: Specific selector '${specificSelector}' failed, using fallback: '${POST_CONTAINER_SELECTOR}'`);
                                postElements = doc.querySelectorAll(POST_CONTAINER_SELECTOR);
                            }

                            if (postElements && postElements.length > 0) {
                                let lastValidPostId = null;
                                for (let i = postElements.length - 1; i >= 0; i--) {
                                    const potentialPost = postElements[i]; const potentialId = potentialPost.id;
                                    if (potentialId && /^p\d+$/.test(potentialId)) {
                                        lastValidPostId = potentialId; console.log('Activity Logger: Found last valid post element:', potentialPost); break;
                                    } else if (potentialId) { console.log('Activity Logger: Skipping element with invalid ID format:', potentialPost); }
                                }
                                if (lastValidPostId) {
                                    const lastPostIdNumber = lastValidPostId.substring(1);
                                    const editUrl = `./posting.php?mode=edit&f=${forumId}&p=${lastPostIdNumber}`;
                                    console.log(`Activity Logger: Found last post ID: ${lastPostIdNumber}. Opening edit page in new tab: ${editUrl}`);
                                    GM_setValue(GM_ACTIVITY_LOGGER_DATA_KEY, JSON.stringify({ bbCode: finalBbCodeToStore }));
                                    window.open(editUrl, '_blank');
                                } else {
                                    throw new Error(`Could not find a valid post ID (like p123456) among ${postElements.length} potential elements.`);
                                }
                            } else { throw new Error(`No post container elements found using selector: '${specificSelector}' or fallback '${POST_CONTAINER_SELECTOR}'.`); }
                        } else { throw new Error(`HTTP status ${response.status}`); }
                    } catch (error) {
                        console.error('Activity Logger: Error fetching/parsing personal log thread:', error);
                        alert('Error finding last post to edit. Falling back to creating a new reply. Check console for details.');
                        const replyPageUrl = `./posting.php?mode=reply&f=${forumId}&t=${topicId}`;
                        GM_setValue(GM_ACTIVITY_LOGGER_DATA_KEY, JSON.stringify({ bbCode: singleEventLink })); // Store single link for fallback
                        window.open(replyPageUrl, '_blank');
                    } finally { clickedButton.removeClass('activity-logger-loading'); }
                }, // End onload
                onerror: function(error) {
                    console.error('Activity Logger: Network error fetching personal log thread:', error);
                    alert('Network error trying to find last post. Falling back to creating a new reply.');
                    const replyPageUrl = `./posting.php?mode=reply&f=${forumId}&t=${topicId}`;
                    GM_setValue(GM_ACTIVITY_LOGGER_DATA_KEY, JSON.stringify({ bbCode: singleEventLink })); // Store single link for fallback
                    window.open(replyPageUrl, '_blank');
                    clickedButton.removeClass('activity-logger-loading');
                }
            }); // End GM_xmlhttpRequest
        } // End if/else (isNewReply)
    } // End handleLogButtonClick

    // --- Populate Text Area (Appends whatever is in GM storage) ---
    function populateReplyBox() {
        const storedDataJson = GM_getValue(GM_ACTIVITY_LOGGER_DATA_KEY, null);
        if (!storedDataJson) {
            // console.log('Activity Logger: No temp data found in GM storage for populating.');
            return;
        }
        console.log('Found activity data in GM storage:', storedDataJson);

        try {
            const { bbCode } = JSON.parse(storedDataJson);
            const replyBox = $(REPLY_TEXTAREA_SELECTOR);

            if (replyBox.length > 0 && bbCode) {
                const currentContent = replyBox.val(); let newContent;
                if (currentContent.trim() === '') { newContent = bbCode;
                } else if (currentContent.endsWith('\n\n')) { newContent = currentContent + bbCode;
                } else if (currentContent.endsWith('\n')) { newContent = currentContent + '\n' + bbCode;
                } else { newContent = currentContent + '\n\n' + bbCode; }

                replyBox.val(newContent + '\n');
                console.log('Activity Logger: Appended BBCode to reply box.');
                replyBox.focus(); replyBox.scrollTop(replyBox[0].scrollHeight);
            } else if (replyBox.length === 0) { console.error('Activity Logger: Could not find reply text area:', REPLY_TEXTAREA_SELECTOR); }
        } catch (e) { console.error('Activity Logger: Error processing stored GM data', e);
        } finally {
            GM_deleteValue(GM_ACTIVITY_LOGGER_DATA_KEY); // Always clear the data after attempting to use it
            console.log('Cleared GM_ACTIVITY_LOGGER_DATA_KEY from GM storage.');
        }
    }

    // --- Add Buttons ---
    function addLogButtonsToPosts() {
        const postContainers = $(POST_CONTAINER_SELECTOR);
        if (postContainers.length > 0) {
            postContainers.each(function() {
                const toolbar = $(this).find(BUTTON_INSERTION_POINT_SELECTOR);
                if (toolbar.length > 0 && toolbar.find('.log-activity-button').length === 0) {
                    const logButtonGroup = $('<div class="btn-group btn-group-sm log-activity-button-group" role="group"></div>');
                    const logButton = $(`<a href="#" class="btn btn-default btn-sm log-activity-button" title="Log post to personal file" role="button"></a>`);
                    logButton.html('<i class="fa fa-clipboard"></i> ' + BUTTON_TEXT);
                    logButton.on('click', handleLogButtonClick);
                    logButtonGroup.append(logButton); toolbar.append(logButtonGroup);
                }
            });
        }
    }

    // --- Main Execution Logic ---
    GM_registerMenuCommand('Set Personal Log Thread URL (LSPD)', configureUrl);

    const personalUrl = getConfiguredUrl();
    const currentPath = window.location.pathname;

    if (currentPath.endsWith('posting.php')) {
        const tempDataJson = GM_getValue(GM_ACTIVITY_LOGGER_DATA_KEY, null);

        if (tempDataJson) {
            const mode = getQueryParam('mode');
            const currentTopicId = getQueryParam('t');
            const currentPostId = getQueryParam('p');
            const personalTopicId = getParamFromUrlString('t', personalUrl);

            const isTargetReplyPage = (mode === 'reply' && currentTopicId && personalTopicId && currentTopicId === personalTopicId);
            const isTargetEditPage = (mode === 'edit' && currentPostId);

            if (isTargetReplyPage || isTargetEditPage) {
                console.log('Activity Logger: On relevant posting page with temp data, attempting to populate reply box.');
                $(document).ready(populateReplyBox); // populateReplyBox will use GM_getValue and then GM_deleteValue
            } else {
                console.log('Activity Logger: On a posting page with temp data, but not the identified target. Clearing temp data.');
                GM_deleteValue(GM_ACTIVITY_LOGGER_DATA_KEY);
            }
        }
    } else if (currentPath.endsWith('viewtopic.php')) {
        $(document).ready(addLogButtonsToPosts);
    }

})();