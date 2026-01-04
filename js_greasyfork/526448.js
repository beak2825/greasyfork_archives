// ==UserScript==
// @name         Old YouTube Studio Restorer (Pre-Jun 2021)
// @namespace    https://greasyfork.org/en/users/1028674-yacine-book
// @version      1.0.1
// @license      MIT
// @description  Restores YouTube Studio's Material 2 UI before the Jun 2021 overhaul
// @author       Yacine Book
// @match        *://studio.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526448/Old%20YouTube%20Studio%20Restorer%20%28Pre-Jun%202021%29.user.js
// @updateURL https://update.greasyfork.org/scripts/526448/Old%20YouTube%20Studio%20Restorer%20%28Pre-Jun%202021%29.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    var customStyles = document.createElement("style");
    customStyles.textContent = `
ytcp-button[type="outline-filled"] {
    padding-left: 16px;
    padding-right: 16px;
}
ytcp-header:not([modern]) #create-icon.ytcp-header {
    color: var(--ytcp-text-primary-inverse);
}
#create-icon paper-ripple.ytcp-button {
    color: var(--ytcp-call-to-action-raised-ripple);
}
ytcp-comment-action-buttons[modern] #reply-button.ytcp-comment-action-buttons {
    --yt-button-padding: 4px 8px;
    --yt-paper-button-min-width: 36px;
    margin-left: -8px;
    margin-right: 24px;
}
ytcp-comment-action-buttons[modern] #reply-button.ytcp-comment-action-buttons:has(~#show-replies-button).ytcp-comment-action-buttons {
    margin-right: 24px;
}
ytcp-button.ytcp-comment-button {
    padding: var(--yt-button-padding,.7em .57em);
    --yt-button-color: var(--ytcp-text-secondary);
    color: var(--yt-button-color,inherit);
    height: unset;
}
.ytcp-comment-button .label.ytcp-button {
    padding: 0;
    line-height: 24px;
}
.ytcp-comment-button:hover .label.ytcp-button {
    color: var(--ytcp-call-to-action);
}
ytcp-icon-button.ytcp-comment-toggle-button {
    line-height: 1;
    padding: var(--yt-button-icon-padding, 8px);
    width: var(--yt-button-icon-size, var(--yt-icon-width, 40px));
    height: var(--yt-button-icon-size, var(--yt-icon-height, 40px));
    box-sizing: border-box;
}
ytcp-icon-button.ytcp-comment-toggle-button tp-yt-iron-icon.ytcp-icon-button {
    width: var(--yt-icon-button-icon-width, 100%);
    height: var(--yt-icon-button-icon-height, 100%);
}
#show-replies-button.ytcp-comment-action-buttons .label, #show-replies-button.ytcp-comment-action-buttons tp-yt-iron-icon.inline.ytcp-button {
    color: var(--yt-button-color, inherit);
    padding: 0;
}
#show-replies-button.ytcp-comment-action-buttons {
    padding: 0;
    height: 32px;
}
ytcp-comment-toggle-button ytcp-icon-button.ytcp-comment-toggle-button {
    --color-regular: var(--ytcp-icon-inactive);
}
ytcp-button#show-replies-button tp-yt-iron-icon.ytcp-button {
    --icon-standard-length: 18px;
}
ytcp-icon-button.ytcp-comment-button {
    line-height: 1;
    padding: var(--yt-button-icon-padding, 8px);
    width: var(--yt-button-icon-size, var(--yt-icon-width, 40px));
    height: var(--yt-button-icon-size, var(--yt-icon-height, 40px));
    box-sizing: border-box;
}
#show-replies-button.ytcp-comment-action-buttons tp-yt-iron-icon.ytcp-button {
    margin-left: var(--yt-button-icon-padding, 8px);
}
ytcp-comment-toggle-button {
    --yt-icon-active-color: var(--ytcp-themed-blue);
}
ytcp-comment-toggle-button[active] ytcp-icon-button.ytcp-comment-toggle-button {
    color: var(--yt-icon-active-color);
}
ytcp-author-comment-badge:not([modern]) {
    --ytcp-author-comment-badge-background-color: var(--ytcp-brand-background-solid-inverse);
    --ytcp-author-comment-badge-hover-background-color: var(--ytcp-themed-blue);
    --ytcp-author-comment-badge-name-color: var(--ytcp-text-primary-inverse);
    --ytcp-author-comment-badge-hover-text-color: var(--ytcp-text-primary-inverse);
    padding: 0 6px;
}
ytcp-commentbox ytcp-button.ytcp-comment-button {
    color: inherit;
}
`;
    customStyles.classList.add("custom-yt-studio-styles");
    customStyles.type = "text/css";
    document.querySelector("html").appendChild(customStyles);
 
    var ytStudioInterval = setInterval(function(){ytStudioIntervalFunc();}, 10);
 
    function ytStudioIntervalFunc(){
    Array.from(document.querySelectorAll("[modern]")).forEach(function(item){
      if (item.tagName !== "YTCP-COMMENT-BUTTON" && item.tagName !== "YTCP-COMMENT-TOGGLE-BUTTON" && item.tagName !== "YTCP-COMMENT-ACTION-BUTTONS") {
      if (item.hasAttribute("modern")){
      item.removeAttribute("modern");
      }
      }
    });
    };
})();