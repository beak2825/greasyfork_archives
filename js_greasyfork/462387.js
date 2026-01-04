// ==UserScript==
// @name         poe.com AI Chat improver
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  Removes social crap, makes the chat display bigger and more comfortable to use
// @author       You
// @match        https://poe.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=poe.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462387/poecom%20AI%20Chat%20improver.user.js
// @updateURL https://update.greasyfork.org/scripts/462387/poecom%20AI%20Chat%20improver.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addStyle(css) {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        document.head.appendChild(style);
    }

    // make chat display big
    addStyle("[class^='InfiniteScroll_scrollContainerReverse'] { width: 97em !important; }");
    addStyle("[class^='PageWithSidebarLayout_leftSidebar'] { max-width: 300px !important; }");

    // border in chat display
    addStyle("[class^='PageWithSidebarLayout_mainSection'] { border-style:none; }");

    // left align user messages
    addStyle("[class^='Message_row'] { flex-direction:row-reverse; }");

    // make prompt input box bigger
    addStyle("[class^='ChatMessageInputView_textInput'] { width: 97em; max-height: 1000px; resize: auto; }");

    // remove useless ui
    addStyle("[class^='ChatMessageFeedbackButtons_feedbackButtonsContainer'] { display: none; }");
    addStyle("[class^='ChatMessageSuggestedReplies_suggestedRepliesContainer'] { display: none; }");

    // position sendbutton to the right
    addStyle("[class^='ChatMessageInputView_sendButtonWrapper'] { left: 95em; }");

    // some chats have a useless right sidebar?
    addStyle("[class^='PageWithSidebarLayout_rightSidebar'] { z-index:-1; }");

	// make header nicer
	addStyle("[class^='PageWithSidebarNavbar_navbar'] { width: 97em; }");

	// hide twitter, app store and feedback link
	addStyle(" a[href='https://apps.apple.com/app/apple-store/id1640745955?pt=660924&mt=8'] { display:none }");
    addStyle(" a[href='/contact'] { display:none }");
	addStyle("[class^='ChatPageFollowTwitterLink_followLink'] { display:none; }");

    // make chats wide again
    addStyle("[class^='Message_botMessageBubble'] { width: 100% !important; }");
    addStyle("[class^='PageWithSidebarLayout_mainSection'] { width: 100% !important; max-width: 100% !important; }");


})();