// ==UserScript==
// @name         YouTube - Force compact channel header UI
// @version      2025.10.08
// @description  This script will force the classic channel header UI with old non-compact tabs.
// @author       xX_LegendCraftd_Xx
// @icon         https://www.youtube.com/favicon.ico
// @namespace    https://greasyfork.org/en/users/933798
// @license      MIT
// @match        *://www.youtube.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/504835/YouTube%20-%20Force%20compact%20channel%20header%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/504835/YouTube%20-%20Force%20compact%20channel%20header%20UI.meta.js
// ==/UserScript==
// Enable strict mode to catch common coding mistakes
"use strict";

// Define the flags to assign to the EXPERIMENT_FLAGS object
const flagsToAssign = {
  // Revert old tabs (patched since Q1 2025)
  web_modern_tabs: false
};

const updateFlags = () => {
  // Check if the EXPERIMENT_FLAGS object exists in the window.yt.config_ property chain
  const expFlags = window?.yt?.config_?.EXPERIMENT_FLAGS;

  // If EXPERIMENT_FLAGS is not found, exit the function
  if (!expFlags) return;

  // Assign the defined flags to the EXPERIMENT_FLAGS object
  Object.assign(expFlags, flagsToAssign);
};

// Create a MutationObserver that calls the updateFlags function when changes occur in the document's subtree
const mutationObserver = new MutationObserver(updateFlags);
mutationObserver.observe(document, { subtree: true, childList: true });

(function() {
let css = `
[page-subtype="channels"] .page-header-view-model-wiz__page-header-description,
[page-subtype="channels"] .yt-page-header-view-model__page-header-description {
margin-top: 0px !important;
max-width: 236px !important
}

[page-subtype="channels"] yt-description-preview-view-model .truncated-text-wiz__truncated-text-content:before,
[page-subtype="channels"] .yt-page-header-view-model__page-header-description .yt-truncated-text__truncated-text-content:before {
content: "More about this channel >   ";
font-weight: 500 !important
}

#avatar.ytd-c4-tabbed-header-renderer,
.yt-spec-avatar-shape__button--button-giant {
width: 80px !important;
height: 80px !important;
margin: 0 24px 0 0 !important;
flex: none !important;
overflow: hidden !important
}

.yt-spec-avatar-shape__button--button-giant,
.yt-spec-avatar-shape--avatar-size-giant,
.yt-spec-avatar-shape__button--button-extra-extra-large,
.yt-spec-avatar-shape--avatar-size-extra-extra-large {
width: 80px !important;
height: 80px !important;
margin-right: 0px !important
}

#avatar-editor.ytd-c4-tabbed-header-renderer {
--ytd-channel-avatar-editor-size: 80px !important
}

#channel-name.ytd-c4-tabbed-header-renderer {
margin-bottom: 0 !important
}

#channel-header-container.ytd-c4-tabbed-header-renderer {
padding-top: 0 !important;
align-items: center !important
}

#inner-header-container.ytd-c4-tabbed-header-renderer {
margin-top: 0 !important;
align-items: center !important
}

.yt-content-metadata-view-model-wiz--inline .yt-content-metadata-view-model-wiz__metadata-row {
margin-top: 0 !important
}

.meta-item.ytd-c4-tabbed-header-renderer {
display: block !important
}

span.delimiter.style-scope.ytd-c4-tabbed-header-renderer,
[page-subtype="channels"] ytd-tabbed-page-header .yt-content-metadata-view-model-wiz__delimiter,
[page-subtype="channels"] ytd-tabbed-page-header .yt-content-metadata-view-model__delimiter,
[page-subtype="channels"] ytd-tabbed-page-header button.truncated-text-wiz__absolute-button,
[page-subtype="channels"] ytd-tabbed-page-header .yt-truncated-text__absolute-button,
yt-formatted-string#channel-pronouns.style-scope.ytd-c4-tabbed-header-renderer,
#videos-count,
#channel-header-links.style-scope.ytd-c4-tabbed-header-renderer,
.page-header-view-model-wiz__page-header-attribution,
.yt-page-header-view-model__page-header-attribution {
display: none !important
}

ytd-c4-tabbed-header-renderer[use-page-header-style] #channel-name.ytd-c4-tabbed-header-renderer,
[page-subtype="channels"] .page-header-view-model-wiz__page-header-title--page-header-title-large,
[page-subtype="channels"] .yt-page-header-view-model__page-header-title--page-header-title-large {
font-size: 2.4em !important;
font-weight: 400 !important;
line-height: var(--yt-channel-title-line-height, 3rem) !important;
margin: 0 !important
}

#meta.style-scope.ytd-c4-tabbed-header-renderer {
width: auto !important
}

ytd-c4-tabbed-header-renderer[use-page-header-style] #inner-header-container.ytd-c4-tabbed-header-renderer {
flex-direction: row !important
}

.page-header-banner.style-scope.ytd-c4-tabbed-header-renderer {
margin-left: 0px !important;
margin-right: 8px !important;
border-radius: 0px !important
}

[has-inset-banner] #page-header-banner.ytd-tabbed-page-header {
padding-left: 0 !important;
padding-right: 0 !important
}

ytd-c4-tabbed-header-renderer[use-page-header-style] .page-header-banner.ytd-c4-tabbed-header-renderer,
.yt-image-banner-view-model-wiz--inset,
.ytImageBannerViewModelInset {
border-radius: 0px !important
}

[page-subtype="channels"] .yt-content-metadata-view-model-wiz__metadata-text,
[page-subtype="channels"] .yt-content-metadata-view-model--medium-text .yt-content-metadata-view-model__metadata-text {
margin-right: 8px !important
}

[page-subtype="channels"] .yt-content-metadata-view-model-wiz__metadata-text,
[page-subtype="channels"] .truncated-text-wiz,
[page-subtype="channels"] .truncated-text-wiz__absolute-button,
[page-subtype="channels"] .yt-content-metadata-view-model__metadata-text,
[page-subtype="channels"] .yt-truncated-text {
font-size: 1.4rem !important
}

[page-subtype="channels"] .yt-content-metadata-view-model-wiz__metadata-row--metadata-row-inline,
[page-subtype="channels"] .yt-content-metadata-view-model__metadata-row--metadata-row-inline {
display: flex
}

[page-subtype="channels"] ytd-tabbed-page-header .yt-content-metadata-view-model-wiz__metadata-text:last-of-type,
[page-subtype="channels"] .yt-content-metadata-view-model--medium-text .yt-content-metadata-view-model__metadata-text:last-of-type,
[page-subtype="channels"] span.yt-core-attributed-string--link-inherit-color:last-of-type {
display: none
}

ytd-browse[page-subtype="channels"] ytd-tabbed-page-header .yt-content-metadata-view-model-wiz__metadata-text:first-of-type,
[page-subtype="channels"] .yt-content-metadata-view-model--medium-text .yt-content-metadata-view-model__metadata-text:first-of-type,
[page-subtype="channels"] span.yt-core-attributed-string--link-inherit-color:first-of-type {
display: flex
}

[page-subtype="channels"] .yt-core-attributed-string--white-space-pre-wrap:nth-of-type(1) {
display: flex;
flex-direction: row
}

ytd-browse[page-subtype="channels"] .yt-flexible-actions-view-model-wiz--inline {
flex-direction: row-reverse
}

ytd-browse[page-subtype="channels"] .page-header-view-model-wiz__page-header-flexible-actions,
ytd-browse[page-subtype="channels"] .ytFlexibleActionsViewModelInline {
margin-top: -56px;
flex-direction: row-reverse
}

ytd-browse[page-subtype="channels"] .yt-flexible-actions-view-model-wiz__action-row {
margin-top: 60px
}

ytd-browse[page-subtype="channels"] .yt-flexible-actions-view-model-wiz__action,
.ytFlexibleActionsViewModelAction {
padding-right: 8px;
padding-left: 0px
}

ytd-browse[page-subtype="channels"] span.yt-core-attributed-string--link-inherit-color {
font-weight: 400 !important
}

ytd-browse[page-subtype="channels"] .page-header-view-model-wiz__page-header-headline-info,
ytd-browse[page-subtype="channels"] .yt-page-header-view-model__page-header-headline {
margin-bottom: 8px
}

.yt-tab-shape-wiz,
.yt-tab-shape {
padding: 0 32px !important;
margin-right: 0 !important
}

.yt-tab-shape-wiz__tab,
.yt-tab-shape__tab {
font-size: 14px !important;
font-weight: 500 !important;
letter-spacing: var(--ytd-tab-system-letter-spacing) !important;
text-transform: uppercase !important
}

.yt-tab-group-shape-wiz__slider {
display: none !important
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
