// ==UserScript==
// @name         Webex Teams Plus
// @version      0.1.0
// @namespace    https://github.com/nottheswimmer
// @match        https://teams.webex.com/*
// @license      MIT
// @author       Michael Phelps
// @description  a script that tries to make Webex Teams better!
// @grant        GM_addStyle
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @icon        https://teams.webex.com/images/webex-teams-logo-881018cdbe9ae05cff97b96e5f3614d8.svg
// @downloadURL https://update.greasyfork.org/scripts/400792/Webex%20Teams%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/400792/Webex%20Teams%20Plus.meta.js
// ==/UserScript==

const styling = `
.md-list-item--space {
    height: 28px;
}

.md-avatar.md-avatar--40 {
    width: 20px;
    height: 20px;
}

.resizer {
    width: 220px;
    min-width: 220px !important;
}

#spacesLabel, #peopleLabel {
    color: #fff;
}

.activity-threading-reply {
    visibility: hidden;
    height: 0;
    padding-top: 0 !important;
}

.activity-reply-thread-section {
    margin: 0 0 5px 4.1rem !important;
}

.activity-threading-list-section > .activity-threading-reply {
    visibility: visible;
    height: auto;
    padding-top: 4px !important;
    margin-left: 0;
}

.activity-item--message {
    font-size: 15px;
}

.activity-reply-thread-btn {
    box-shadow: none !important;
    font-size: 13px;
}

.activity-threading-overlay, .activity-threading-wrapper {
    position: absolute;
    height: 100%;
    width: max(calc(40% - 16px), 422px);
    left: calc(100% - max(calc(40% - 32px), 422px));
}

.activity-threading-section {
    height: 100%;
    max-height: 100%;
}

.activity-threading-list-section {
    overflow-y: auto;
    height: calc(100% - 190px);
}

.wtp-next-to-thread {
    width: calc(100% - max(calc(40% - 50px), 422px)) !important;
}

#activities .activity-item.activity-threading-reply {
    border-left: 0 !important;
    border-radius: 2px !important;
    padding-left: .3125rem !important;
    padding-right: 1.25rem !important;
    margin-left: 1.25rem !important;
}
`

const peopleLabelHtml = `
<div aria-level="1"
aria-label="People"
id="peopleLabel"
data-qa="virtual-list-item"
style="padding-left: 15px;">
<strong>People</strong>
</div>
`

const spacesLabelHtml = `
<div aria-level="1"
aria-label="Spaces"
id="spacesLabel"
data-qa="virtual-list-item"
style="padding-left: 15px;">
<strong>Spaces</strong>
</div>
`

const sContainer = '#conversation-list';
const sSpaces = sContainer + ' > div.space-list-item-wrapper';
const sViewOlderSpacesButton = '.convo-list-load-more';
const sWTPPerson = '.wtp-person';
const sWTPSpace = '.wtp-space';
const sWTPDMLabel = '#peopleLabel';
const sWTPSpacesLabel = '#spacesLabel';

async function updateReplyCount() {
    $('.activity-reply-thread-btn').each(function (index) {
        // Get their parent (same level as a reply)
        let parent = $(this).parent();
        // All the replies before it up until a main post
        // "the replies are all activity items prior to this button until you get to an item that is an activity item but is not a reply"
        let replies = $($(parent).prevUntil(':not(.activity-threading-reply).activity-item')).filter('.activity-item');
        // Count the number of replies
        let numReplies = replies.length;
        // Get the thread the replies are to
        let thread = replies.prev();
        // Get the date of that thread's last reply
        let prevReplyDateMarker = $(thread).find('.activity-item-last-reply-date');
        // Hide and get that date we're moving it
        if (prevReplyDateMarker.is(":visible")) {
            prevReplyDateMarker.hide();
        }
        let prevReplyDate = prevReplyDateMarker.text();
        // Plan what the new HTML will be...
        let newHtml = '<a href="#"><strong>' + numReplies + (numReplies === 1 ? ' reply' : ' replies') + '</strong></a> ' + prevReplyDate;

        // Update the reply button text
        if ($(this).html() !== newHtml) {
            $(this).html('<a href="#"><strong>' + numReplies + (numReplies === 1 ? ' reply' : ' replies') + '</strong></a> ' + prevReplyDate);
        }
    });
}


async function spacesThenContacts() {
    // If the spaces area exists...
    if ($(sContainer)) {
        let updated = false;
        // Get an original copy of the spaces in it
        let original = $(sSpaces)
        // Create a sorted version (contacts first then spaces)
        let sorted = original.sort(
            function (a, b) {
                let aIsPerson = $(a).find('.md-avatar--group').length === 1 ? 0 : 1
                let bIsPerson = $(b).find('.md-avatar--group').length === 1 ? 0 : 1

                if (aIsPerson === 1) {
                    $(a).addClass(sWTPPerson.substr(1));
                } else {
                    $(a).addClass(sWTPSpace.substr(1));
                }

                if (bIsPerson === 1) {
                    $(b).addClass(sWTPPerson.substr(1));
                } else {
                    $(b).addClass(sWTPSpace.substr(1));
                }

                let sortVal = (aIsPerson < bIsPerson) ? -1 : (aIsPerson > bIsPerson) ? 1 : 0;

                // If the order changes (sortVal is -1), set updated to true
                if (sortVal === -1) {
                    updated = true;
                }
                return sortVal;
            });

        // if updated was set to true by the sorted function update the DOM
        if (updated) {
            sorted.appendTo($(sContainer));
            if ($(sViewOlderSpacesButton)) {
                $(sViewOlderSpacesButton).appendTo($(sContainer));
            }

            // Put direct messages above first person
            let peopleLabel = $(sWTPDMLabel);
            let firstPerson = $(sWTPPerson + ':first');
            if (firstPerson.length > 0) {
                if (peopleLabel.length > 0) {
                    firstPerson.prepend($(peopleLabel));
                } else {
                    firstPerson.prepend(peopleLabelHtml);
                }
            }

            // Put spaces above first space
            let spacesLabel = $(sWTPSpacesLabel);
            let firstSpace = $(sWTPSpace + ':first');
            if (firstSpace.length > 0) {
                if (spacesLabel.length > 0) {
                    firstSpace.prepend($(spacesLabel));
                } else {
                    firstSpace.prepend(spacesLabelHtml);
                }
            }

        }
    }
}

let lastActivityUpdate = 0;
function activityUpdates() {
    lastActivityUpdate = Date.now();
    updateReplyCount().catch((e) =>
        console.log(e)
    );

    // If a thread is open, add a class to the main body.
    if ($('.activity-threading-wrapper').length !== 0) {
        $('.activity-body').addClass("wtp-next-to-thread");
    } else {
        $('.activity-body').removeClass("wtp-next-to-thread");
    }
}

let lastConversationListUpdate = 0;
function conversationUpdates() {
    lastConversationListUpdate = Date.now();
    spacesThenContacts().catch((e) =>
        console.log(e)
    );
}

(function () {
    // Add styling
    GM_addStyle(styling);

    // Once the document is ready...
    $(document).ready(function () {

        // Bind an event to occur every time #activities is modified
        $(document).on("DOMSubtreeModified", '#activities', function () {
            if (Date.now() - lastActivityUpdate > 100) {
                activityUpdates();
            }
        });

        // Bind an event to occur every time #conversation-list is modified
        $(document).on("DOMSubtreeModified", '#conversation-list', function () {
            if (Date.now() - lastConversationListUpdate > 100) {
                conversationUpdates();
            }
        });

        // Run the binded events above every two seconds to ensure missed events
        // are still triggered
        setInterval(function(){
            conversationUpdates();
            activityUpdates();
        }, 2000);

    });
})
();