// ==UserScript==
// @name        Tumblr hide without blocking
// @namespace   https://github.com/holyspiritomb
// @match       https://www.tumblr.com/*
// @grant       GM_getValue
// @grant		GM_setValue
// @grant       GM_addStyle
// @grant		GM_listValues
// @version     0.0.5
// @author      holyspiritomb
// @run-at      document-end
// @require     https://code.jquery.com/jquery-latest.min.js
// @require     https://greasyfork.org/scripts/446257-waitforkeyelements-utility-function/code/waitForKeyElements%20utility%20function.js?version=1059316
// @inject-into page
// @icon        https://www.google.com/s2/favicons?domain=tumblr.com
// @description Hides conversations in the messages dialog with specific users, and stops those users from appearing as suggested recipients of posts when you click share.
// @downloadURL https://update.greasyfork.org/scripts/449908/Tumblr%20hide%20without%20blocking.user.js
// @updateURL https://update.greasyfork.org/scripts/449908/Tumblr%20hide%20without%20blocking.meta.js
// ==/UserScript==

let valueArrayList = GM_listValues();

function inList(itemToTest, someList) {
    let itemIndex = someList.indexOf(itemToTest);
    if (itemIndex == -1) {
        return false;
    } else {
        return true;
    }
}

function annotateConversations() {
    $('button[aria-label=Conversation] div.pTvJc').each(function() {
        let friendName = $(this)[0].innerText;
        let conversation = $(this).closest('button');
        let convClasses = Array.from(conversation[0].classList);
        if (convClasses.indexOf(friendName) == -1) {
            conversation.addClass(friendName);
            console.log(`added ${friendName} as class to a conversation`);
        }
    });
}

if (valueArrayList) {

    console.log("get value of key hiddenRecipients");
    let hiddenRecipients = Array.from(GM_getValue("hiddenShareRecipients"));

    if (hiddenRecipients[0] != "hiddenfriend") {
        console.log("processing array of hidden recipients in share popup");
        for (friend of hiddenRecipients) {
            console.log(`adding css to hide ${friend} from share popup`);
            GM_addStyle(`button[aria-label="Select ${friend}"]{display:none;}`);
        };
    } else {
        console.log("no one to hide in the share popup");
    }

    let hiddenConversations = Array.from(GM_getValue("hiddenConversations"));

    if (hiddenConversations[0] != "hiddenfriend") {
        for (hiddenConversationPartner of hiddenConversations) {
            //console.log(`adding css rule to hide ${hiddenConversationPartner} in conversations`);
            GM_addStyle(`button[aria-label=Conversation].${hiddenConversationPartner}{display:none;}`);
        };
        let currentPage = document.location.href;
        if (currentPage == "https://www.tumblr.com/messaging") {
            waitForKeyElements("button[aria-label='Conversation'] div.pTvJc", function() {
                annotateConversations();
            }, false, 1000, 20);
        } else {
            waitForKeyElements("button[aria-label='Conversation'] div.pTvJc", function() {
                annotateConversations();
            }, false, 300, -1);
        }
    } else {
        console.log("no conversations to hide");
    }

} else {
    console.log("No values stored. making default keys now");
    GM_setValue("hiddenShareRecipients", ["hiddenfriend"]);
    GM_setValue("hiddenConversations", ["hiddenfriend"]);
}
