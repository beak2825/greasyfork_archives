// ==UserScript==
// @name        Lemmy post utilities - Filter posts by title
// @namespace   Violentmonkey Scripts
// @description Filters posts on any lemmy instance by text in the title. It can also auto-open image posts, unblur thumbnails, and other things.
// @match       https://*lemmy*.*/*
// @include     https://lemy.nl/*
// @include     https://burggit.moe/*
// @include     https://lemmit.online/*
// @include     https://yiffit.net/*
// @include     https://reddthat.com/*
// @include     https://sh.itjust.works/*
// @exclude     https://lemmyverse.net/*
// @exclude     https://lemmy-status.org/*
// @exclude     https://search-lemmy.com/*
// @exclude     https://join-lemmy.org/*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_setClipboard
// @version     2.2.10
// @icon        data:image/png;base64,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
// @author      Xynoth
// @license     GPT-3
// @date        14/7/2023, 20:15:03
// @downloadURL https://update.greasyfork.org/scripts/470852/Lemmy%20post%20utilities%20-%20Filter%20posts%20by%20title.user.js
// @updateURL https://update.greasyfork.org/scripts/470852/Lemmy%20post%20utilities%20-%20Filter%20posts%20by%20title.meta.js
// ==/UserScript==

//----------------------------------------
// CONSTANTS
//----------------------------------------

// Key constants
const BLOCKED_TAGS_KEY = "blockedTags";
const BLOCKED_CASE_SENSITIVE_TAGS_KEY = "blockedCaseSensitiveTags";
const AUTO_OPEN_MEDIA_POSTS_KEY = "autoOpenMediaPosts";
const UNBLUR_THUMBNAILS_KEY = "unblurThumbs";
const SHOW_FILTERED_STUBS_KEY = "showFilteredStubs";
const COMMAS_AS_SEPARATORS_KEY = "useCommasAsSeparators";
const CASE_SENSITIVE_KEY = "caseSensitiveTag";
const WIDGET_HEIGHT_KEY = "widgetHeight";
const FIX_BROKEN_VIDEO_PREVIEWS_KEY = "fixBrokenVideoPreviews";
const MARK_POSTS_AS_NSFW_KEY = "markNewPostsAsNSFW";

// Constant selectors
const postsContainerClass = "post-listings";
const profileContainerClass = "person-details";
const searchContainerClass = "search"
const postContainer = "post-listing";
const loadingSpinnerSelector = ".icon.spin"; // This is the "creators" select in the search page
const postCommunityContainer = ".community-link";
const postCommunityNameContainer = `${postCommunityContainer} > span`;
const postSrcLink = `div:nth-of-type(2) p a`;
const fixedPreviewContainerClass = "fixed-preview";
const fixedPreviewVideoClass = "fixed-preview-video";
const postAsNSFW = "#post-nsfw[type='checkbox']";
const createPostContainerId = "createPostForm";
const editPostClass = "post-form";

// GUI main elements
const settingsWidgetId = "settings-widget";
const blockedTagsDialogId = "tags-dialog";
const dialogBgId = "dialog-bg";
const settingsWidgetContainerId = "widget-container";
const blockTagListId = "blocked-insensitive-tag-list";
const csBlockTagListId = "blocked-sensitive-tags-list";
const openedPostChecker = "already-opened";
const filteredPostChecker = "filter-checked";
const processedPageChecker = "processed-page";

// CSS Color constants
const caseInsensitiveTagColor = "#dd2222";
const caseSensitiveTagColor = "#2052b3";
const primaryBtnColor = "#0052cc";
const primaryBtnHoverColor = "#0066ff";
const primaryBtnActiveColor = "#0047b3";
const widgetBgColor = "#1a1a1b";
const errorToastColor = "#f94b4b";
const errorToastBgColor = "#2f0808";

// Other constants
const logoImg = GM_info.script.icon;
const namedRegex = "regex\\((.*?)\\):";

// HTML content constants
const bottomWidgetContent = `
<div id="${settingsWidgetContainerId}">
  <h1><span id="widget-logo"></span>Lemmy post utilities</h1>
  <div class="form-entry">
    <label>Blocked tags: </label>
    <div class="btn-container">
      <button id="block-tag-btn" type="button">🖊</button>
    </div>
  </div>
  <div class="form-entry">
    <label>
      Show stubs on filter:
    </label>
    <div class="btn-container">
      <span class="switch" id="show-stub-swt">
        <input type="checkbox">
        <span class="slider round"></span>
      </span>
    </div>
  </div>
  <div class="form-entry">
    <label>
      Fix broken video previews:
    </label>
    <div class="btn-container">
      <span class="switch" id="fix-video-previews-swt">
        <input type="checkbox">
        <span class="slider round"></span>
      </span>
    </div>
  </div>
  <div class="form-entry">
    <label>
      Auto open media previews:
    </label>
    <div class="btn-container">
      <span class="switch" id="auto-open-swt">
        <input type="checkbox">
        <span class="slider round"></span>
      </span>
    </div>
  </div>
  <div class="form-entry">
    <label>
      Unblur NSFW thumbnails:
    </label>
    <div class="btn-container">
      <span class="switch" id="unblur-swt">
        <input type="checkbox">
        <span class="slider round"></span>
      </span>
    </div>
  </div>
  <div class="form-entry">
    <label>
      Mark new posts as NSFW:
    </label>
    <div class="btn-container">
      <span class="switch" id="default-nsfw-posts-swt">
        <input type="checkbox">
        <span class="slider round"></span>
      </span>
    </div>
  </div>
</div>
`;

const tagsDialogContent = `
<div id="blocked-tags-dialog-container">
  <div id ="blocked-tags-dialog-head">
    <h1>Blocked tags editor</h1>
    <button type="button" class="close-dialog-btn">⨯</button>
  </div>
  <div>
    <p>Any tag added here will hide any post that contains the word in its title.</p>
    <p>You can also use some advanced filtering options like the following:</p>
    <ul>
      <li>Use <a href="https://regex101.com/">regex</a> starting a tag with <code>regex:</code></li>
      <li>Create a named regex starting a tag with <code>regex(your-regex-name):</code></li>
      <li>Filter by linked source instead of title starting a tag with <code>source:</code></li>
      <li>Combine <code>source:</code> with any variant of <code>regex:</code></li>
      <li>You can click any tag to copy it's raw value.</li>
    </ul>
    <p>These are the blocked tags you have for this instance:</p>
    <div id="blocked-tags-field-container">
      <div id="blocked-tags-field">
        <p id="empty-blocked-tags">You haven't blocked anything yet.</p>
        <ul id="${blockTagListId}" class="blocked-tags-list" hidden>
        </ul>
        <hr id="blocked-tags-separator" hidden>
        <ul id="${csBlockTagListId}" class="blocked-tags-list" hidden>
        </ul>
      </div>
      <div id="blocked-tags-field-legend">
        <span id="tag-case-insensitive-legend" class="tag-legend">
          <span class="tag-color-legend"></span>
          <small class="tag-label-legend">Case insensitive tag</small>
        </span>
        <span id="tag-case-sensitive-legend" class="tag-legend">
          <span class="tag-color-legend"></span>
          <small class="tag-label-legend">Case sensitive tag</small>
        </span>
      </div>
    </div>
    <p id="clipboard-notice" hidden>Tag value copied to the clipboard!</p>
    <div class="switch-container">
      <label>
        Use commas as tag separators:
      </label>
      <div class="btn-container">
        <span class="switch" id="use-commas-swt">
          <input type="checkbox">
          <span class="slider round"></span>
        </span>
      </div>
    </div>
    <div class="switch-container">
      <label>
        Add tags as case sensitive:
      </label>
      <div class="btn-container">
        <span class="switch" id="case-sensitive-swt">
          <input type="checkbox">
          <span class="slider round"></span>
        </span>
      </div>
    </div>
    <div id="tag-input-container">
      <input type="text" id="tag-input" placeholder="Add your tags">
      <button type="button" id="tag-save-btn">Save</button>
    </div>
    <label id="blocked-tags-input-error" hidden>Tag must be longer than 1 non-whitespace character!</label>
  </div>
</div>
`;

const tagContent = `
<span title="TOOLTIP-CONTENT">
  <label>TAG-NAME</label>
  <button type="button">⨯</button>
</span>
`;

const filteredPostStubContent = `
<div class="hidden-post-stub-meta-container">
  <p>This post was hidden because it contained the tag 'TAG'.</p>
  <span class="hidden-post-stub-btn-container">
    <button class="show-hidden-post-title-btn" type="button">Show title</button>
    <button class="show-hidden-post-btn" type="button">Show post</button>
  </span>
</div>
<span class="stub-hidden-post-title" hidden>
  <br>
  <p>Post title was '<b>POST-TITLE</b>' from <a class="stub-hidden-post-community-link">POST-COMMUNITY</a> community.</p>
</span>
`;

const videoSourceContent = `
<source src="VIDEO-SOURCE" type="video/VIDEO-TYPE">
`;

// CSS to add to style elements
const initialCSS = getInitialCSS();

const guiCSS = () => `

/* Fix for stubs leaving empty space at the bottom of the page for some reason */
html {
  overflow-y: auto;
}

body {
  overflow-y: clip;
  scrollbar-width: none;
}

/* The settings widget */
#${settingsWidgetId} {
  display: flex;
  float: right;
  bottom: 0;
  right: 0.8rem;
  max-width: 15rem;
  position: fixed;
  transform: translateY(${getData(WIDGET_HEIGHT_KEY) ?? storeData(WIDGET_HEIGHT_KEY, "21rem")});
  transition: 200ms ease-in-out transform;
}

#${settingsWidgetId}:hover {
  transform: translateY(1px);
}

/* The container for the widget */
#widget-container {
  flex-direction: column;
  border: 1px solid #333;
  font-size: 0.9rem;
  background-color: ${widgetBgColor};
  width: 100%;
  padding: 1rem;
  border-radius: .5rem .5rem 0 0;
  margin-top: 50px; /* This is the space that will allow showing the popup when hovering over it */
}

#widget-container:hover {
  margin-top: 0;
}

/* Widget title */
#widget-container > h1 {
  font-size: 1rem;
  font-weight: bold;
  height: 1rem;
}

#widget-logo {
  display: inline-block;
  background-image: url('${logoImg}');
  height: 1rem;
  width: 1rem;
  background-size: contain;
  background-repeat: no-repeat;
  margin-right: 0.5rem;
}

/* Widget block button */
#block-tag-btn {
  appearance: none;
  color: #ddd;
  background: rgba(255,255,255,0.1);
  border: none;
  border-radius: 2rem;
  padding: .3rem .5rem;
}

/* The layout for each label + form control */
.form-entry {
  display: inline-flex;
}

.form-entry:not(:first-child) {
  margin-top: 0.8rem;
}

.form-entry > label {
  display: flex;
	align-items: center;
	justify-content: left;
  width: 10rem;
}

.btn-container {
  display: grid;
	place-items: center;
}

/* The dialog to filter tags */
#${blockedTagsDialogId} {
  appearance: none;
  border: none;
  background-color: ${widgetBgColor};
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 0 20px 5px rgba(255,255,255,0.2);
  position: fixed;
  top: 50%;
  bottom: 50%;
  z-index: 1001;
  max-width: 36.5rem;
}

#dialog-bg {
  display: none;
  background-color: rgba(0,0,0,.5); /* For browsers that don't support backdrop-filter */
  position: fixed;
  height: 100vh;
  width: 100vw;
  backdrop-filter: blur(2px);
  top: 0;
  left: 0;
  z-index: 1000;
}

#blocked-tags-separator {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  border-top: 2px solid #666;
  margin-top: .5rem;
  margin-bottom: .5rem;
}

#blocked-tags-dialog-head {
  display: flex;
}

#blocked-tags-dialog-head > h1 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: #fff;
}

#tag-input-container {
  margin-top: 1rem;
  margin-bottom: 1rem;
  display: flex;
}

#blocked-tags-input-error {
  color: ${errorToastColor};
  font-size: 0.8rem;
  background-color: ${errorToastBgColor};
  padding: .4rem;
  border-radius: .5rem;
  font-weight: bold;
}

#blocked-tags-field-container {
  margin-bottom: 1rem;
}

#blocked-tags-field {
  display: grid;
  padding: 1rem;
  max-height: 20rem;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  place-items: center;
  border: 1px solid #555;
  border-radius: 0.3rem;
}

#empty-blocked-tags {
  color: #666;
  margin: 0;
  padding: 1rem;
}

#clipboard-notice {
  color: #2f2;
  font-size: 0.8rem;
  width: 100%;
  text-align: center;
}

#tag-input {
  border: none;
  flex-grow: 100;
  background-color: #333;
  border-radius: .5rem;
  padding: .5rem 1rem;
  width: 80%;
  margin-right: 1rem;
  color: #ddd;
}

#tag-save-btn {
  appearance: none;
  border: none;
  background-color: ${primaryBtnColor};
  color: #ddd;
  padding: .5rem 1rem;
  border-radius: 0.3rem;
}

#tag-save-btn:hover {
  background-color: ${primaryBtnHoverColor};
  color: #fff;
}

#tag-save-btn:active {
  background-color: ${primaryBtnActiveColor};
  color: #fff;
}

#tag-case-insensitive-legend > span {
  background-color: ${caseInsensitiveTagColor};
}

#tag-case-sensitive-legend > span {
  background-color: ${caseSensitiveTagColor};
}

#blocked-tags-field-legend {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.close-dialog-btn {
  appearance: none;
  color: #fff;
  font-weight: bold;
  background-color: transparent;
  border: none;
  padding: 0.2rem 0.6rem;
  position: absolute;
  right: 0;
  top: 0;
  transition: 200ms all;
}

.close-dialog-btn:hover {
  border-radius: 6rem;
  background-color: rgba(255,255,255,0.2);
}

.switch-container {
  width: 100%;
  display: flex;
}

.switch-container > label {
  width: 16rem;
  margin-right: 1rem;
}

.blocked-tags-list {
  display: flex;
  flex-wrap: wrap;
  max-width: 35.5rem;
  margin-bottom: 0;
  padding: 0;
}

.blocked-tags-list > li {
  display: inline-flex;
  list-style-type: none;
}

.tag-legend {
  margin-right: 1rem;
}

.tag-color-legend {
  display: inline-block;
  width: 7px;
  height: 7px;
}

.tag-label-legend {
  font-size: 0.6rem;
}

.blocked-tag {
  border-radius: 0.4rem;
  font-size: 0.8rem;
  color: #fff;
  margin: .2rem;
  cursor: grab;
}

.blocked-tag[data-dragged-item] {
  cursor: grabbing;
  opacity: 0.7;
}

.blocked-tag label {
  padding-left: .5rem;
  white-space: pre-wrap;
  cursor: grab;
}

.blocked-tag button {
  appearance: none;
  color: #fff;
  background: transparent;
  border: none;
  border-radius: .4rem;
}

.blocked-tag button:hover {
  background-color: rgba(255,255,255,0.2);
}

.case-insensitive-tag {
  background-color: ${caseInsensitiveTagColor};
}

.case-sensitive-tag {
  background-color: ${caseSensitiveTagColor};
}

/* The filtered post stubs */
.filtered-post-stub p {
  margin-bottom: 0;
}

.hidden-post-stub-meta-container {
  display: flex;
}

.hidden-post-stub-btn-container {
  margin-left: auto;
}

.hidden-post-stub-btn-container > button {
  appearance: none;
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: #3498db;
  margin-right: 1rem;
}

.hide-post-btn {
  appearance: none;
  color: #f22;
  font-weight: bold;
  font-size: 2rem;
  line-height: 1rem;
  width: 1.8rem;
  background-color: transparent;
  border: none;
  padding: 0.2rem 0.6rem;
  height: 0;
  float: right;
  transition: 200ms all;
}

/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: 30px;
  height: 16px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #777;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 12px;
  width: 12px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(12px);
  -ms-transform: translateX(12px);
  transform: translateX(12px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

`;

const unblurCSS = `

/* Unblurs thumbnails */
.img-blur {
    filter: none !important;
}

`

//----------------------------------------
// GUI AND INITIAL SETUP
//----------------------------------------

// Load initial settings and store defaults if they didn't exist
console.info(`Loading data for domain '${document.location.host}'.`);

const blockedTitleTags = getData(BLOCKED_TAGS_KEY) ?? storeData(BLOCKED_TAGS_KEY, []);
const csBlockedTitleTags = getData(BLOCKED_CASE_SENSITIVE_TAGS_KEY) ?? storeData(BLOCKED_CASE_SENSITIVE_TAGS_KEY, []);
const expandMediaPosts = getData(AUTO_OPEN_MEDIA_POSTS_KEY) ?? storeData(AUTO_OPEN_MEDIA_POSTS_KEY, false);
const unblurThumbnails = getData(UNBLUR_THUMBNAILS_KEY) ?? storeData(UNBLUR_THUMBNAILS_KEY, false);
const useCommasAsSeparators = getData(COMMAS_AS_SEPARATORS_KEY) ?? storeData(COMMAS_AS_SEPARATORS_KEY, true);
const showStubsForFilteredPosts = getData(SHOW_FILTERED_STUBS_KEY) ?? storeData(SHOW_FILTERED_STUBS_KEY, true);
const fixPostVideoPreviews = getData(FIX_BROKEN_VIDEO_PREVIEWS_KEY) ?? storeData(FIX_BROKEN_VIDEO_PREVIEWS_KEY, true);
const caseSensitiveTags = getData(CASE_SENSITIVE_KEY) ?? storeData(CASE_SENSITIVE_KEY, false);
const markNewPostsAsNSFW = getData(MARK_POSTS_AS_NSFW_KEY) ?? storeData(MARK_POSTS_AS_NSFW_KEY, false);

if (blockedTitleTags.length > 0 || csBlockedTitleTags.length > 0)
  console.info("Waiting for page to fully load to block tags: ", blockedTitleTags, csBlockedTitleTags);

// Add the GUI to control the settings to the document
const settingWidget = addElement(document.body, "DIV", settingsWidgetId, bottomWidgetContent);
const tagsDialog = addElement(document.body, "DIALOG", blockedTagsDialogId, tagsDialogContent);
const dialogBg = addElement(document.body, "DIV", dialogBgId);

// Add initial CSS changes
updateCSS();

// Load tags into the dialog window
updateVisibleTags();

// Reflect boolean values of settings on GUI
document.querySelector("#show-stub-swt > input").checked = showStubsForFilteredPosts;
document.querySelector("#auto-open-swt > input").checked = expandMediaPosts;
document.querySelector("#unblur-swt > input").checked = unblurThumbnails;
document.querySelector("#use-commas-swt > input").checked = useCommasAsSeparators;
document.querySelector("#case-sensitive-swt > input").checked = caseSensitiveTags;
document.querySelector("#fix-video-previews-swt > input").checked = fixPostVideoPreviews;
document.querySelector("#default-nsfw-posts-swt > input").checked = markNewPostsAsNSFW;

// --------- Add event listeners ---------

// Blocked list dialog button
document.getElementById("block-tag-btn").onclick = () => {
  openDialog(tagsDialog);
}

// Close dialog button
tagsDialog.getElementsByClassName("close-dialog-btn")[0].onclick = () => {
  closeDialog(tagsDialog);
}

// Close dialog on clicking outside the dialog
dialogBg.onclick = (event) => {
  event.stopPropagation();
  closeDialog(tagsDialog);
}

// Show stubs on filtering posts
document.getElementById("show-stub-swt").onclick = (event) => {
  const showStubs = storeData(SHOW_FILTERED_STUBS_KEY, toggleCheckbox(event));
  const postsContainer = getPostContainer();

  if (postsContainer)
    postsContainer.getElementsByClassName(postContainer).forEach(post => {
      let siblingNode = post.nextElementSibling;
      if (showStubs && post.hasAttribute("hidden")) {
        // Show sibling separator as well
        if (siblingNode && siblingNode.tagName == "HR")
          siblingNode.removeAttribute("hidden");

        // Show post with the stub
        post.removeAttribute("hidden");
      } else if (post.getElementsByClassName("filtered-post-stub")[0]) {

        // Remove separator if it exists
        if (siblingNode && siblingNode.tagName == "HR")
          siblingNode.setAttribute("hidden", true);

        // Hide post completelly
        post.setAttribute("hidden", true);
      }
    })
}

// Fix some broken video previews
document.getElementById("fix-video-previews-swt").onclick = (event) => {
  const fixVideoPreviews = storeData(FIX_BROKEN_VIDEO_PREVIEWS_KEY, toggleCheckbox(event));
  const fixedPreviewContainers = document.getElementsByClassName(fixedPreviewContainerClass);
  const fixedPreviewVideos = document.getElementsByClassName(fixedPreviewVideoClass);
  const postsContainer = getPostContainer();
  const wasProcessed = postsContainer.id === processedPageChecker;

  if (!postsContainer)
    return;

  if (!wasProcessed)
    postsContainer.setAttribute("id", processedPageChecker);

  if (fixVideoPreviews) {
    if (fixedPreviewContainers.length > 0 || fixedPreviewVideos.length > 0) {
      for(let i = 0; i < fixedPreviewContainers.length; i++) {
        fixedPreviewContainers[i].querySelector("picture").setAttribute("hidden", true);
        fixedPreviewVideos[i].removeAttribute("hidden");
      }
    } else {
      fixBrokenVideoPreviews(postsContainer);
    }
  } else if (fixedPreviewContainers.length > 0 || fixedPreviewVideos.length > 0) {
      for(let i = 0; i < fixedPreviewContainers.length; i++) {
        fixedPreviewContainers[i].querySelector("picture").removeAttribute("hidden");
        fixedPreviewVideos[i].setAttribute("hidden", true);
      }
  }
}

// Auto-open tags on page reload
document.getElementById("auto-open-swt").onclick = (event) => {
  const openMediaPosts = storeData(AUTO_OPEN_MEDIA_POSTS_KEY, toggleCheckbox(event));
  const postsContainer = getPostContainer();
  const wasProcessed = postsContainer.id === processedPageChecker;

  if (!postsContainer)
    return;

  if (!wasProcessed)
    postsContainer.setAttribute("id", processedPageChecker);

  // Open posts if they weren't already
  if (openMediaPosts) {
    openPosts(postsContainer);
  }
}

// Unblur setting
document.getElementById("unblur-swt").onclick = (event) => {
  storeData(UNBLUR_THUMBNAILS_KEY, toggleCheckbox(event));

  // Update CSS of site after having changed the setting
  updateCSS();
}

// Mark new posts as NSFW by default
document.getElementById("default-nsfw-posts-swt").onclick = (event) => {
  const markAsNSFW = storeData(MARK_POSTS_AS_NSFW_KEY, toggleCheckbox(event));
  const NSFWCheckbox = document.querySelector(postAsNSFW);
  const createPostForm = document.getElementById(createPostContainerId);

  if (NSFWCheckbox && !NSFWCheckbox.checked && markAsNSFW && createPostForm)
    NSFWCheckbox.click();
}

// Auto-open tags on page reload
document.getElementById("use-commas-swt").onclick = (event) => {
  storeData(COMMAS_AS_SEPARATORS_KEY, toggleCheckbox(event));
}

// Auto-open tags on page reload
document.getElementById("case-sensitive-swt").onclick = (event) => {
  storeData(CASE_SENSITIVE_KEY, toggleCheckbox(event));
}

// Accept pressing enter while in some input to send the data
document.getElementById("tag-input").onkeydown = (event) => {
  if(event.keyCode === 13){
    document.getElementById("tag-save-btn").click();
  }
}

// Event for tag save on button click or enter on input of tag blocking
document.getElementById("tag-save-btn").onclick = () => {
  const tagInput = document.getElementById("tag-input");
  const errorEl = document.getElementById("blocked-tags-input-error");
  const clipboardNoticeEl = document.getElementById("clipboard-notice");
  const tagsToSubmit = document.getElementById("tag-input").value;
  clipboardNoticeEl.setAttribute("hidden", true);

  if (tagsToSubmit.trim().length > 1) {
    const isCaseSensitive = getData(CASE_SENSITIVE_KEY);
    const splitOnCommas = getData(COMMAS_AS_SEPARATORS_KEY);
    let tagsAsArray = getTagsAsArray(tagsToSubmit, splitOnCommas);
    let tagsKey;

    if (isCaseSensitive)
      tagsKey = BLOCKED_CASE_SENSITIVE_TAGS_KEY;
    else
      tagsKey = BLOCKED_TAGS_KEY;

    const oldTags = getData(tagsKey);

    tagsAsArray = tagsAsArray.filter(tag => !oldTags.includes(tag));

    for(let i = 0; i < tagsAsArray.length; i++) {
      const keywordStart = /^(regex:|source:(regex(\((.*?)\):|:))*|regex\((.*?)\):)/ig;
      console.log(tagsAsArray[i].replace(keywordStart, ""));
      if (tagsAsArray[i].replace(keywordStart, "").trim().length === 0) {
        errorEl.removeAttribute("hidden");
        return;
      }
    }

    // Hide the error message if it was visible
    if (errorEl.hasAttribute("hidden"))
      errorEl.setAttribute("hidden", true);

    if (tagsAsArray.length > 0) {
      // Get the old array of tags and concatenate the new one
      const allTags = oldTags.concat(tagsAsArray);

      // Store the new array of tags and update the tags to show
      storeData(tagsKey, allTags);
      addTagsToDialog(tagsAsArray, tagsKey);

      // Hide empty tags element if it was visible and show the tags
      const blockedTagsListContainer = document.getElementById(blockTagListId);
      const csBlockedTagsListContainer = document.getElementById(csBlockTagListId);

      // Update tag section visibility if required
      checkForEmptyTags(getData(BLOCKED_TAGS_KEY), getData(BLOCKED_CASE_SENSITIVE_TAGS_KEY));
    }

    // Clear input
    tagInput.value = "";
  } else {
    errorEl.removeAttribute("hidden");
  }
}

//----------------------------------------
// MAIN METHODS
//----------------------------------------

// Wait for page to fully load to start doing things
window.onload = () => {
  const baseContainer = document.getElementById("app");
  let NSFWCheckbox = document.querySelector(postAsNSFW);
  let createPostForm = document.getElementById(createPostContainerId);
  let searchContainer = document.getElementsByClassName(searchContainerClass)[0];
  let postsContainer = getPostContainer();

  if (NSFWCheckbox && !NSFWCheckbox.checked && markNewPostsAsNSFW && createPostForm)
    NSFWCheckbox.click();

  // Make sure that the widget height is correct
  updateWidgetHeightCSS();

  // If there is a posts container in the page
  if (postsContainer) {

     // Perform first filter
    if (blockedTitleTags.length > 0 || csBlockedTitleTags.length > 0) {
      console.info("Page loaded, filtering tags...");
      filterPosts(postsContainer);
    }

    // Open remaining posts if enabled
    if (expandMediaPosts)
      openPosts(postsContainer);

    // Fix video previews if there was any post
    if (fixPostVideoPreviews)
      fixBrokenVideoPreviews(postsContainer);

    document.getElementsByClassName(postsContainer.className)[0].setAttribute("id", processedPageChecker);
  }

  // Observe the changes of the page to know when to rethrow the filter method when the user changes the page
  const observer = new MutationObserver((e) => {
    if (document.getElementById(processedPageChecker))
      return;

    const blockedTags = getData(BLOCKED_TAGS_KEY);
    const csBlockedTags = getData(BLOCKED_CASE_SENSITIVE_TAGS_KEY);
    const autoOpenMedia = getData(AUTO_OPEN_MEDIA_POSTS_KEY);
    const fixVideoPreviews = getData(FIX_BROKEN_VIDEO_PREVIEWS_KEY);
    const markAsNSFW = getData(MARK_POSTS_AS_NSFW_KEY);

    searchContainer = document.getElementsByClassName(searchContainerClass)[0];
    NSFWCheckbox = document.querySelector(postAsNSFW);
    createPostForm = document.getElementById(createPostContainerId);
    postsContainer = getPostContainer();

    // If on the creation post page, mark as NSFW the post
    if (NSFWCheckbox && !NSFWCheckbox.checked && markAsNSFW && createPostForm)
      NSFWCheckbox.click();

    for (let i = 0; i < e.length; i++) {
      if (e[i].target.getElementsByClassName(editPostClass)[0])
        return;

      let postEdit = e[i].target.getElementsByClassName("form-control")[0];
      let filteredPostStub = e[i].target.getElementsByClassName("filtered-post-stub")[0];
      let filteredPostBtn = e[i].target.getElementsByClassName("hide-post-btn")[0];

      // Prevent filtering to retrigger if editting a post
      if (postEdit && searchContainer)
        return;

      // If a post was already filtered don't add stubs again
      if (filteredPostBtn || filteredPostStub)
        continue;

      // Perform actions if on one of the pages
      if (postsContainer) {

        if (blockedTags.length > 0 || csBlockedTags.length > 0) {
          console.info("Page reloaded, filtering new posts...");
          filterPosts(postsContainer);
        }

        if (autoOpenMedia)
          openPosts(postsContainer);

        if (fixVideoPreviews)
          fixBrokenVideoPreviews(postsContainer);

        // Mark page as already processed
        document.getElementsByClassName(postsContainer.className)[0].setAttribute("id", processedPageChecker);
        break;
      }
    }
  });

  observer.observe(baseContainer, {subtree: true, childList: true});
}

// Gets initial CSS content
function getInitialCSS() {
  let style = document.head.getElementsByTagName("style")[0];
  if (!style) {
    style = document.createElement('style');
    document.head.appendChild(style);
    return "";
  }

  return style.innerHTML;
}

// Gets the CSS from the script to be in effect
function getEffectiveCSS() {
  let fullCSS = guiCSS();

  // Check each setting that changes CSS apart from the GUI
  if (getData(UNBLUR_THUMBNAILS_KEY))
    fullCSS += unblurCSS;

  return fullCSS;
}

// Splits tags on commas if necessary
function getTagsAsArray(tagsString, splitOnCommas=true) {
  if (splitOnCommas) {
    return tagsString.split(",");
  }
  return [tagsString];
}

// Gets the current page posts container
function getPostContainer() {
  return document.getElementsByClassName(postsContainerClass)[0] ||
      document.getElementsByClassName(profileContainerClass)[0] ||
      document.getElementsByClassName(searchContainerClass)[0] ||
      document.querySelector(".post");
}

// Adds an element to the document
function addElement(parentEl, elementTag, elementId, html="", idAsClass=false) {
  let p = parentEl;
  let newElement = document.createElement(elementTag);
  if (idAsClass)
    newElement.className = elementId;
  else
    newElement.setAttribute('id', elementId);
  newElement.innerHTML = html;
  p.appendChild(newElement);
  return newElement;
}

// Adds the new tags to the dialog
function addTagsToDialog(tagArray, tagsType) {
  let tagsContainerSelector = csBlockTagListId;

  if (tagsType === BLOCKED_TAGS_KEY)
    tagsContainerSelector = blockTagListId;

  const blockedTagsListEl = document.getElementById(tagsContainerSelector);

  tagArray.forEach(tag => {
    addTagElement(tag, tagsType, blockedTagsListEl);
  });
}

// Adds a tag element to the dialog
function addTagElement(tag, tagType, tagListElement) {

  // Get the specific css class for tag type
  let tagSpecificClass = "case-sensitive-tag";

  if (tagType === BLOCKED_TAGS_KEY)
    tagSpecificClass = "case-insensitive-tag";

  // Add the element to the dialog and bind the button event
  const newTag = addElement(tagListElement,
               "LI",
               `blocked-tag ${tagSpecificClass}`,
               tagContent
                 .replace("TAG-NAME", parseTagName(tag))
                 .replace("TAG-TYPE", tagType)
                 .replace("TOOLTIP-CONTENT", `'${tag}' (${tagSpecificClass})`),
               true);

  newTag.getElementsByTagName("button")[0].onclick = () => {
    onRemoveBlockedTag(tagType, tag, newTag);
  }

  newTag.getElementsByTagName("label")[0].onclick = () => {
    GM_setClipboard(tag);
    document.getElementById("clipboard-notice").removeAttribute("hidden");
  }

  // Mark element as draggable
  newTag.setAttribute("draggable", true);

  // Handle drag & drop events
  newTag.ondragstart = (e) => {
    newTag.setAttribute("data-dragged-item", true);
  }

  newTag.ondragover = (e) => {
    e.preventDefault();
  }

  newTag.ondragend = () => {
    newTag.removeAttribute("data-dragged-item");
  }

  newTag.ondrop = (e) => {
    const target = e.target;
    const targetTag = target.nodeName === "LABEL" || target.nodeName == "BUTTON" ?
          target.parentNode.parentNode : target.parentNode;
    const draggedItem = document.querySelector('li[data-dragged-item]');
    const nextTagName = targetTag.getElementsByTagName("label")[0].innerHTML;
    const movedTagName = draggedItem.getElementsByTagName("label")[0].innerHTML;
    let movedTagParentId = targetTag.parentNode.id;
    let draggedTagType = BLOCKED_TAGS_KEY;

    if (draggedItem.className.includes("case-sensitive-tag"))
      draggedTagType = BLOCKED_CASE_SENSITIVE_TAGS_KEY;

    // Only accept dropping it in the same area
    if (draggedItem.parentNode.id === movedTagParentId) {

      // Update order of tags
      let tags = getData(draggedTagType);

      // We need to change a bit the logic depending on the position of the element
      if (tags.indexOf(nextTagName) > tags.indexOf(movedTagName)) {
        tags.splice(tags.indexOf(nextTagName) + 1, 0, null);
        targetTag.parentNode.insertBefore(draggedItem, targetTag.nextSibling);
      } else {
        tags.splice(tags.indexOf(nextTagName), 0, null);
        targetTag.parentNode.insertBefore(draggedItem, targetTag);
      }

      tags.splice(tags.indexOf(movedTagName), 1);
      tags[tags.indexOf(null)] = movedTagName;

      storeData(draggedTagType, tags);
    }
    newTag.removeAttribute('data-dragged-item');
  }
}

// Updates the CSS of the site
function updateCSS() {
  let style = document.head.getElementsByTagName("style")[0];
  if (!style) {
    style = document.createElement('style');
    style.innerHTML = css;
    document.head.appendChild(style);
    return;
  }

  // Update the CSS with the initial one + the settings CSS
  style.innerHTML = initialCSS + getEffectiveCSS();
}

// Update the visible part of the settings widget
function updateWidgetHeightCSS() {
  const widget = document.getElementById(settingsWidgetContainerId);
  const widgetHeight = widget.getBoundingClientRect().height;
  const visibleTopHeight = 10;
  if (widgetHeight > 0 && widgetHeight - visibleTopHeight > 0) {
    const oldHeight = getData(WIDGET_HEIGHT_KEY);
    let updatedHeight = (widgetHeight - visibleTopHeight) + "px";
    if (oldHeight != updatedHeight) {
      storeData(WIDGET_HEIGHT_KEY, (widgetHeight - visibleTopHeight) + "px");
      updateCSS();
    }
  }
}

// Updates the visible tags in the blocked tags dialog
function updateVisibleTags() {
  const csBlockedTags = getData(BLOCKED_CASE_SENSITIVE_TAGS_KEY);
  const blockedTags = getData(BLOCKED_TAGS_KEY);
  const blockedTagsListEl = document.getElementById(blockTagListId);
  const csBlockedTagsListEl = document.getElementById(csBlockTagListId);

  // Reset list
  blockedTagsListEl.innerHTML = "";
  csBlockedTagsListEl.innerHTML = "";

  blockedTags.forEach(tag => {
    addTagElement(tag, BLOCKED_TAGS_KEY, blockedTagsListEl);
  });

  csBlockedTags.forEach(tag => {
    addTagElement(tag, BLOCKED_CASE_SENSITIVE_TAGS_KEY, csBlockedTagsListEl);
  });

  checkForEmptyTags(blockedTags, csBlockedTags);
}

// Parses the tag name if it's a named regex
function parseTagName(tag) {
  if ((tag.toLowerCase().startsWith("regex(") || tag.toLowerCase().startsWith("source:regex(")) && new RegExp(namedRegex, "i").test(tag)) {
    let regexName = getRegexNameFromTag(tag);
    if (regexName != null) {
      return tag.replace(new RegExp(namedRegex + ".*", "i"), `regex: ${regexName}`);
    }
    // If the named regex wasn't correctly formatted we just return the regular tag however it was typed
    return tag;
  }
  return tag;
}

// Gets the regex name from a named regex tab
function getRegexNameFromTag(tag) {
  let regexMatch = new RegExp(namedRegex).exec(tag);
  if (regexMatch != null) {
    return regexMatch[1];
  }
  return null;
}

// Toggles checkboxes on sliders inside the onclick event
function toggleCheckbox(event) {
  let checkbox = event.target.parentNode.getElementsByTagName("input")[0];
  checkbox.checked = !checkbox.checked;
  return checkbox.checked;
}

// Opens a dialog box
function openDialog(dialogSelector) {
  dialogSelector.show();
  dialogBg.style.display = "block";
}

// Closes the dialog box
function closeDialog(dialogSelector) {
  dialogSelector.close();
  dialogBg.style.display = "none";
  document.getElementById("blocked-tags-input-error").setAttribute("hidden", true);
  document.getElementById("clipboard-notice").setAttribute("hidden", true);
}

// Adds the notice for no blocked tag if necessary
function checkForEmptyTags(blockedTags, csBlockedTags) {
  const emptyTagsEl = document.getElementById("empty-blocked-tags");
  const blockedTagsListEl = document.getElementById(blockTagListId);
  const csBlockedTagsListEl = document.getElementById(csBlockTagListId);
  const tagsSeparatorEl = document.getElementById("blocked-tags-separator");
  const hasAnyBlockedTag = blockedTags.length > 0;
  const hasAnyCsBlockedTag = csBlockedTags.length > 0;
  const hasAnyTag = hasAnyBlockedTag || hasAnyCsBlockedTag;
  const isBlockedTagsListHidden = blockedTagsListEl.hasAttribute("hidden");
  const isCsBlockedTagsListHidden = csBlockedTagsListEl.hasAttribute("hidden");

  // Check if any has tags
  if (hasAnyTag) {
    emptyTagsEl.setAttribute("hidden", true);
    if (hasAnyBlockedTag)
      blockedTagsListEl.removeAttribute("hidden");
    else
      blockedTagsListEl.setAttribute("hidden", true);

    if (hasAnyCsBlockedTag)
      csBlockedTagsListEl.removeAttribute("hidden");
    else
      csBlockedTagsListEl.setAttribute("hidden", true);

    // Either both have tags or at least one has tags
    if (hasAnyBlockedTag && hasAnyCsBlockedTag)
      tagsSeparatorEl.removeAttribute("hidden");
    else
      tagsSeparatorEl.setAttribute("hidden", true);

  // If it has no tags
  } else if (!hasAnyTag) {
    emptyTagsEl.removeAttribute("hidden");
    blockedTagsListEl.setAttribute("hidden", true);
    tagsSeparatorEl.setAttribute("hidden", true);
    csBlockedTagsListEl.setAttribute("hidden", true);
  }
}

// Checks if the page is loading
function checkIfPageIsLoading(postsContainer, posts) {
  const searchContainer = document.getElementsByClassName(searchContainerClass)[0];
  const emptyResultsContainer = document.querySelector(loadingSpinnerSelector);
  return posts.length === 0 && postsContainer === searchContainer && emptyResultsContainer;
}

// Removes a tag from the view and the storeData
function onRemoveBlockedTag(tagType, tagToRemove, tagElement) {
  // Remove the actual tag element
  tagElement.parentNode.removeChild(tagElement);

  // Update the storage
  let allTags = getData(tagType);
  let tagIndex = allTags.indexOf(tagToRemove);

  if (tagIndex != -1)
    allTags.splice(tagIndex, 1);

  storeData(tagType, allTags);

  // Toggle visibility of the elements where the tag was removed if they are empty
  checkForEmptyTags(getData(BLOCKED_TAGS_KEY), getData(BLOCKED_CASE_SENSITIVE_TAGS_KEY));
}

// Filters posts by words from the title as specified by the user
function filterPosts(postsContainer) {
  let posts = postsContainer.getElementsByClassName(postContainer);

  if (checkIfPageIsLoading(postsContainer, posts)) {
    let intervalCount = 0;

    // Check for posts in 1 second intervals
    const checkInterval = setInterval(() => {
      posts = document.getElementsByClassName(postContainer);
      // Finish interval checking the search finished or 30 seconds passed
      if (posts.length > 0 || intervalCount > 30 || !document.querySelector(loadingSpinnerSelector)) {
        clearInterval(checkInterval);
        filterPostsInPage(posts);
      }
      intervalCount++;
    }, 1000);

    return;
  }

  filterPostsInPage(posts);
}

// Filters the posts in the current page
function filterPostsInPage(postsList) {
  const showStubs = getData(SHOW_FILTERED_STUBS_KEY);
  const blockedTags = getData(BLOCKED_TAGS_KEY);
  const csBlockedTags = getData(BLOCKED_CASE_SENSITIVE_TAGS_KEY);

  const blockedTagsByType = {
    byTitle: [],
    bySource: []
  }

  const csBlockedTagsByType = {
    byTitle: [],
    bySource: []
  }

  // Get type of filter for each tag first to avoid unnecesary iterations
  blockedTags.forEach(tag => {
    if (tag.startsWith("source:"))
      blockedTagsByType.bySource.push(tag);
    else
      blockedTagsByType.byTitle.push(tag);
  })

  csBlockedTags.forEach(tag => {
    if (tag.startsWith("source:"))
      csBlockedTagsByType.bySource.push(tag);
    else
      csBlockedTagsByType.byTitle.push(tag);
  })

  // Filter every post
  Array.from(postsList).forEach(post => {
    if (post.getElementsByClassName(editPostClass)[0])
      return;

    post.setAttribute(filteredPostChecker, true);
    const communityEl = post.querySelector(postCommunityNameContainer);
    const communityLinkEl = post.querySelector(postCommunityContainer);
    const sourceEl = post.querySelector(postSrcLink)
    let titleEl = post.querySelector(".post-title h1 span");
    let source = null;
    let community;
    let communityLink;
    let title;

    // Make sure we get a valid title selector
    if (!titleEl)
      titleEl = post.querySelector(".post-title h1 a");
    title = titleEl.innerHTML;

    // Make sure community info is in post, otherwise get from page assuming the user
    // is in the community view instead, where the community isn't in the posts but the page
    if (!communityEl) {
      community = document.querySelector(postCommunityNameContainer).innerHTML;
      communityLink = document.querySelector(postCommunityContainer).href;
    } else {
      community = communityEl.innerHTML;
      communityLink = communityLinkEl.href;
    }

    if (sourceEl)
      source = sourceEl.href;

    const postInfo = {
      post: post,
      title: title,
      communityName: community,
      communityLink: communityLink,
      source: source
    }

    // Filter posts by title first
    const wasFiltered = filterPost(blockedTagsByType.byTitle, csBlockedTagsByType.byTitle, showStubs, postInfo);

    // Filter posts by source after if it wasn't already filtered by title
    if (!wasFiltered && source)
      filterPost(blockedTagsByType.bySource, csBlockedTagsByType.bySource, showStubs, postInfo, true);
  })
}

function filterPost(blockedTags, csBlockedTags, showStubs, postInfo, filterBySource=false) {
  // Filter posts using case insensitive tags
  if (blockedTags.length > 0) {
    for(let i = 0; i < blockedTags.length; i++) {
      let tag = blockedTags[i];

      if (filterBySource)
        tag = tag.substring(7);

      const regex = new RegExp(escapeRegex(tag), "i");
      if (regex.test(filterBySource ? postInfo.source : postInfo.title)) {
        removePost(postInfo, blockedTags[i], showStubs);

        return true;
      }
    }
  }

  // Filter posts using case sensitive tags
  if (csBlockedTags.length > 0) {
    for(let i = 0; i < csBlockedTags.length; i++) {
      const tag = csBlockedTags[i];

      if (filterBySource)
        tag = tag.substring(7);

      const regex = new RegExp(escapeRegex(tag));
      if (regex.test(filterBySource ? postInfo.source : postInfo.title)) {
        removePost(postInfo, csBlockedTags[i], showStubs);
        return true;
      }
    }
  }
}

// Escapes the special characters entered by a user
function escapeRegex(regex) {
  // Escape \'s in regex with double \\ if it's a regex to be used in "new RegExp()" method
  if (regex.toLowerCase().startsWith("regex:"))
    return regex.substring(6).replace("\\", "\\");

  // If it's a named regex
  else if (regex.toLowerCase().startsWith("regex(") && new RegExp(namedRegex, "i").test(regex)) {
    const regStart = `regex(${getRegexNameFromTag(regex)}):`;
    return regex.substring(regStart.length).replace("\\", "\\");
  }
  return regex.replace(/([()[{*+.$^\\|?])/g, '\\$1');

}

// Filters out a post
function removePost(postInfo, tag, showStubs) {
  const post = postInfo.post;

  // Hide the content of the children and add a stub by default
  post.style.display = "none";
  addFilterStubToPost(postInfo, tag)

  // If the setting to show stubs is disabled we hide the post completelly
  if (!showStubs) {
    // Removes the posts from the body completelly and logs it to the console
    console.info(`Removing post with title ${postInfo.title} from community ${postInfo.communityName} because the post contained the tag ${parseTagName(tag)}.`);
    post.setAttribute("hidden", true);

    let siblingNode = post.nextElementSibling;

    // Remove separator if it exists
    if (siblingNode && siblingNode.tagName == "HR")
      siblingNode.setAttribute("hidden", true);
  }
}

// Adds a filter stub after filtering a post
function addFilterStubToPost(postInfo, tag) {
  let stub = addElement(postInfo.post, "DIV", "filtered-post-stub",
                          filteredPostStubContent.replace("TAG", parseTagName(tag))
                            .replace("POST-TITLE", postInfo.title)
                            .replace("POST-COMMUNITY", postInfo.communityName), true);
  stub.getElementsByClassName("stub-hidden-post-community-link")[0].href = postInfo.communityLink;

  // Add actions for the buttons
  stub.getElementsByClassName("show-hidden-post-title-btn")[0].onclick = () => {
    stub.getElementsByClassName("stub-hidden-post-title")[0].removeAttribute("hidden");
    stub.getElementsByClassName("show-hidden-post-title-btn")[0].setAttribute("hidden", true);
  }

  // Add theming and add it before the filtered post
  stub.classList.add("post-listing");
  postInfo.post.parentNode.insertBefore(stub, postInfo.post);

  stub.getElementsByClassName("show-hidden-post-btn")[0].onclick = () => {
    stub.setAttribute("hidden", true);
    postInfo.post.style= "";

    // Make sure the title button element is hidden
    stub.getElementsByClassName("stub-hidden-post-title")[0].setAttribute("hidden", true);
    stub.getElementsByClassName("show-hidden-post-title-btn")[0].removeAttribute("hidden");

    // Prepend the post re-remover if it didn't exist yet
    let postRemoveEl = postInfo.post.getElementsByClassName("hide-post-btn")[0];
    if (!postInfo.post.getElementsByClassName("hide-post-btn")[0]) {
      postRemoveEl = document.createElement("BUTTON");
      postRemoveEl.className = "hide-post-btn";
      postRemoveEl.innerHTML = "🗶";
      postRemoveEl.setAttribute("type", "button");
      postInfo.post.prepend(postRemoveEl);

      postRemoveEl.onclick = () => {
        stub.removeAttribute("hidden");
        postRemoveEl.setAttribute("hidden", true);
        postInfo.post.style.display = "none";
      }
    } else
      postRemoveEl.removeAttribute("hidden");


    for (let i = 0; i < postInfo.post.children.length; i++) {
      postInfo.post.children[i].style = "";
    }
  }
}

// Opens media posts so that the image or video is shown for all posts in the current page of the timeline
function openPosts(postsContainer) {
  let posts = postsContainer.getElementsByClassName(postContainer);

  if (checkIfPageIsLoading(postsContainer, posts)) {
    let intervalCount = 0;

    // Check for posts in 1 second intervals
    const checkInterval = setInterval(() => {
      posts = document.getElementsByClassName(postContainer);

      // Finish interval checking the search finished or 30 seconds passed
      if (posts.length > 0 || intervalCount > 30 || !document.querySelector(loadingSpinnerSelector)) {
        clearInterval(checkInterval);
        clickPostsThumbnail(posts);
      }
      intervalCount++;
    }, 1000);

    return;
  }

  clickPostsThumbnail(posts)
}

// Clicks the thumbnail of the post to open it
function clickPostsThumbnail(posts) {
   Array.from(posts).forEach(post => {

    const postHasMedia = post.querySelector("picture, video");
    let clickableThumbnail = post.querySelector("button.thumbnail");
    if (postHasMedia) {
      if (!clickableThumbnail)
        clickableThumbnail = post.querySelector("a.text-body[href$='.mp4'] .thumbnail, a.text-body[href$='.webm'] .thumbnail, a.text-body[href^='https://www.redgifs.com/watch'] .thumbnail")

      if (clickableThumbnail && !post.getElementsByClassName("filtered-post-stub")[0]){
        let intervalCount = 0;
        const checkInterval = setInterval(() => {
          const postChildren = post.children;
          clickableThumbnail.click();

          // Check that the post opened within 5 tries
          if (postChildren.length > 2 || intervalCount > 5)
            clearInterval(checkInterval);

          intervalCount++;
        }, 1000);
      }

      post.setAttribute(openedPostChecker, true);
    }
  })
}

// Fixes imgur previews showing as jpg instead of the actual video
function fixBrokenVideoPreviews(postsContainer) {
  let posts = postsContainer.getElementsByClassName(postContainer);

  if (checkIfPageIsLoading(postsContainer, posts)) {
    let intervalCount = 0;

    // Check for posts in 1 second intervals
    const checkInterval = setInterval(() => {
      posts = document.getElementsByClassName(postContainer);
      // Finish interval checking the search finished or 30 seconds passed
      if (posts.length > 0 || intervalCount > 30 || !document.querySelector(loadingSpinnerSelector)) {
        clearInterval(checkInterval);
        checkVideoPreviews(postsContainer);
      }
      intervalCount++;
    }, 1000);

    return;
  }

  checkVideoPreviews(postsContainer);
}

// Updates the video previews when needed so that they work again
function checkVideoPreviews(postsContainer) {
  setTimeout(() => {
    const posts = postsContainer.getElementsByClassName(postContainer);
    updateVideoPreviews(posts);
  }, 500);
}

// Updates the video previews
function updateVideoPreviews(posts) {
  Array.from(posts).forEach(post => {
    const postSourceLinkEl = post.querySelector(postSrcLink);
    const imageLinkContainer = post.querySelectorAll("div:nth-of-type(3) > a:not(.btn)");

    if (postSourceLinkEl && imageLinkContainer.length > 0) {
      const postSourceLink = postSourceLinkEl.href;
      let newSrc = postSourceLink;

      if (postSourceLink.includes("i.imgur.com") && postSourceLink.endsWith(".gifv"))
        newSrc = postSourceLink.replace(".gifv", ".mp4");
      else if (!postSourceLink.includes("i.imgur.com") && postSourceLink.includes("imgur.com"))
        newSrc = postSourceLink.replace("imgur.com", "i.imgur.com") + ".mp4";
      else if (imageLinkContainer.length >= 1 && (postSourceLink != imageLinkContainer[0].href) && imageLinkContainer[0].href.endsWith(".webm") || imageLinkContainer[0].href.endsWith(".mp4")) {
        newSrc = imageLinkContainer[0].href;
      }

      // Only apply changes if the src was suposed to be different
      if (newSrc != postSourceLink) {

        imageLinkContainer.forEach(imageContainer => {
          let pictureContainer = imageContainer.querySelector("picture");
          if (pictureContainer) {
            pictureContainer.setAttribute("hidden", true);
            let videoElement = addElement(post.querySelector("div:nth-child(3).my-2"), "VIDEO",
                                          `embed-responsive-item ${fixedPreviewVideoClass} col-12`,
                                          videoSourceContent.replace("VIDEO-SOURCE", newSrc)
                                            .replace("VIDEO-TYPE", newSrc.split(".").at(-1)),
                                          true)
            videoElement.setAttribute("controls", "");
            videoElement.setAttribute("loop", "");
            videoElement.parentNode.classList.add("embed-responsive", fixedPreviewContainerClass);
          }
        });
      }
    }
  });
}
//----------------------------------------
// STORAGE METHODS
//----------------------------------------

// Composes the key with the current instance name to store data per-instance
function composeInstanceKey(key) {
  return document.location.host + "->" + key;
}

// Saves data to the storage of the userscript
function storeData(key, value) {
  const instanceKey = composeInstanceKey(key);
  let treatedValue = value;
  if (typeof value === "array" || typeof value === "object")
    treatedValue = JSON.stringify(value);
  GM_setValue(instanceKey, treatedValue);
  return treatedValue;
}

// Gets data from the userscript storage
function getData(key) {
  const instanceKey = composeInstanceKey(key);
  let value = GM_getValue(instanceKey);

  if (value === null || value === undefined)
    return null;

  if (typeof value === "string") {
    let isValueArray = value.startsWith("[") && value.endsWith("]");
    let isValueObject = value.startsWith("{") && value.endsWith("}");
    if (isValueArray || isValueObject)
        return JSON.parse(value);
  }
  return value;
}
