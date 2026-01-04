// ==UserScript==
// @name         Rule34 Favorites Search Gallery
// @namespace    bruh3396
// @version      1.20.5
// @description  Search, View, and Play Rule34 Favorites (Desktop/Android/iOS)
// @author       bruh3396
// @compatible   Chrome
// @compatible   Edge
// @compatible   Firefox
// @compatible   Safari
// @compatible   Opera
// @match        https://rule34.xxx/index.php?page=favorites&s=view&id=*
// @match        https://rule34.xxx/index.php?page=post&s=list*

// @downloadURL https://update.greasyfork.org/scripts/504184/Rule34%20Favorites%20Search%20Gallery.user.js
// @updateURL https://update.greasyfork.org/scripts/504184/Rule34%20Favorites%20Search%20Gallery.meta.js
// ==/UserScript==
"use strict";
(() => {
  function getCookie(key, defaultValue) {
    const nameEquation = `${key}=`;
    const cookies = document.cookie.split(";").map((cookie) => cookie.trimStart());
    for (const cookie of cookies) {
      if (cookie.startsWith(nameEquation)) {
        return cookie.substring(nameEquation.length, cookie.length);
      }
    }
    return defaultValue;
  }
  function setCookie(key, value) {
    let cookieString = `${key}=${value ?? ""}`;
    const expirationDate = /* @__PURE__ */ new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);
    cookieString += `; expires=${expirationDate.toUTCString()}`;
    cookieString += "; path=/";
    document.cookie = cookieString;
  }
  function getUserId() {
    return getCookie("user_id", "");
  }
  function getFavoritesPageId() {
    const match = /(?:&|\?)id=(\d+)/.exec(window.location.href);
    return match ? match[1] : null;
  }
  function isUserIsOnTheirOwnFavoritesPage() {
    return getUserId() === getFavoritesPageId();
  }
  function getTagBlacklist() {
    let tags = getCookie("tag_blacklist", "") ?? "";
    for (let i = 0; i < 3; i += 1) {
      tags = decodeURIComponent(tags).replace(/(?:^| )-/, "");
    }
    return tags;
  }
  var ON_SEARCH_PAGE = location.href.includes("page=post&s=list");
  var ON_FAVORITES_PAGE = location.href.includes("page=favorites");
  var ON_POST_PAGE = location.href.includes("page=post&s=view");
  var USING_FIREFOX = navigator.userAgent.toLowerCase().includes("firefox");
  var ON_MOBILE_DEVICE = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  var ON_DESKTOP_DEVICE = !ON_MOBILE_DEVICE;
  var USER_IS_ON_THEIR_OWN_FAVORITES_PAGE = isUserIsOnTheirOwnFavoritesPage();
  var STORAGE_KEY = "preferences";
  function readAll() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  }
  function get(key) {
    return readAll()[key];
  }
  function set(key, value) {
    const preferences = readAll();
    preferences[key] = value;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  }
  var Preference = class {
    defaultValue;
    key;
    constructor(key, defaultValue) {
      this.key = key;
      this.defaultValue = defaultValue;
    }
    get value() {
      return get(this.key) ?? this.defaultValue;
    }
    set(value) {
      set(this.key, value);
    }
  };
  var Preferences = {
    savedSearchesVisible: new Preference("savedSearchVisibility", false),
    savedSearchSuggestionsEnabled: new Preference("savedSearchSuggestions", false),
    savedSearchTutorialEnabled: new Preference("savedSearchTutorial", false),
    captionsVisible: new Preference("showCaptions", false),
    tooltipsVisible: new Preference("showTooltip", false),
    showOnHoverEnabled: new Preference("showOnHover", false),
    tagAliasingEnabled: new Preference("tagAliasing", false),
    allowedRatings: new Preference("allowedRatings", 7),
    favoriteFinderId: new Preference("findFavorite", ""),
    searchPagesEnabled: new Preference("enableOnSearchPages", false),
    performanceProfile: new Preference("performanceProfile", 0 /* NORMAL */),
    favoritesLayout: new Preference("layout", "column"),
    searchPageLayout: new Preference("searchPageLayout", "column"),
    excludeBlacklistEnabled: new Preference("excludeBlacklist", false),
    resultsPerPage: new Preference("resultsPerPage", 200),
    sortAscendingEnabled: new Preference("sortAscending", false),
    sortingMethod: new Preference("sortingMethod", "default"),
    optionsVisible: new Preference("showOptions", false),
    columnCount: new Preference("columnCount", ON_MOBILE_DEVICE ? 3 : 6),
    searchPageColumnCount: new Preference("searchPageColumnCount", ON_MOBILE_DEVICE ? 3 : 6),
    rowSize: new Preference("rowSize", 7),
    searchPageRowSize: new Preference("searchPageRowSize", 7),
    dockGalleryMenuLeft: new Preference("dockGalleryMenuLeft", ON_DESKTOP_DEVICE),
    uiVisible: new Preference("showUI", true),
    infiniteScrollEnabled: new Preference("infiniteScroll", false),
    galleryMenuPinned: new Preference("galleryMenuPinned", ON_MOBILE_DEVICE),
    galleryMenuEnabled: new Preference("galleryMenuEnabled", ON_MOBILE_DEVICE),
    removeButtonsVisible: new Preference("showRemoveFavoriteButtons", false),
    addButtonsVisible: new Preference("showAddFavoriteButtons", false),
    searchPageAddButtonsVisible: new Preference("showSearchPageAddFavoriteButtons", false),
    hintsEnabled: new Preference("showHints", false),
    headerEnabled: new Preference("showHeader", true),
    colorScheme: new Preference("colorScheme", "black"),
    backgroundOpacity: new Preference("backgroundOpacity", "1"),
    videoVolume: new Preference("videoVolume", 1),
    videoMuted: new Preference("videoMuted", false),
    autoplayActive: new Preference("autoplayActive", false),
    autoplayPaused: new Preference("autoplayPaused", false),
    autoplayImageDuration: new Preference("autoplayImageDuration", 3e3),
    autoplayMinimumVideoDuration: new Preference("autoplayMinimumVideoDuration", 5e3),
    autoplayForward: new Preference("autoplayForward", true),
    downloadBatchSize: new Preference("downloadBatchSize", 250),
    downloadButtonsVisible: new Preference("showDownloadButtons", false),
    mobileGalleryEnabled: new Preference("mobileGalleryEnabled", true),
    upscaleThumbsOnSearchPage: new Preference("upscaleSearchPageThumbs", ON_DESKTOP_DEVICE),
    searchPageInfiniteScrollEnabled: new Preference("searchPageInfiniteScroll", false)
  };
  var FAVORITES_SEARCH_GALLERY_ENABLED = ON_FAVORITES_PAGE || ON_SEARCH_PAGE && Preferences.searchPagesEnabled.value;
  var FAVORITES_SEARCH_GALLERY_DISABLED = !FAVORITES_SEARCH_GALLERY_ENABLED;
  var GALLERY_ENABLED = (ON_FAVORITES_PAGE || ON_SEARCH_PAGE) && (Preferences.performanceProfile.value === 0 /* NORMAL */ || Preferences.performanceProfile.value === 3 /* MEDIUM */);
  var GALLERY_DISABLED = !GALLERY_ENABLED;
  var TOOLTIP_ENABLED = (ON_FAVORITES_PAGE || ON_SEARCH_PAGE) && ON_DESKTOP_DEVICE && Preferences.performanceProfile.value !== 2 /* POTATO */;
  var TOOLTIP_DISABLED = !TOOLTIP_ENABLED;
  var TAG_MODIFIER_ENABLED = ON_FAVORITES_PAGE && ON_DESKTOP_DEVICE;
  var TAG_MODIFIER_DISABLED = !TAG_MODIFIER_ENABLED;
  var CAPTIONS_ENABLED = ON_FAVORITES_PAGE && ON_DESKTOP_DEVICE && Preferences.performanceProfile.value !== 2 /* POTATO */;
  var CAPTIONS_DISABLED = !CAPTIONS_ENABLED;
  var SAVED_SEARCHES_ENABLED = ON_FAVORITES_PAGE && ON_DESKTOP_DEVICE;
  var SAVED_SEARCHES_DISABLED = !SAVED_SEARCHES_ENABLED;
  var AUTOCOMPLETE_ENABLED = ON_FAVORITES_PAGE;
  var AUTOCOMPLETE_DISABLED = !AUTOCOMPLETE_ENABLED;
  var DOWNLOADER_ENABLED = ON_FAVORITES_PAGE;
  var DOWNLOADER_DISABLED = !DOWNLOADER_ENABLED;
  var DEFAULT_DIMENSIONS_2D = { width: 100, height: 100 };
  var DIMENSIONS_2D_REGEX = /^(\d+)(?:x|\/)(\d+)$/;
  var OR_GROUP_REGEX = /(?:^|\s+)\(\s+((?:\S+)(?:(?:\s+~\s+)\S+)*)\s+\)/g;
  function removeExtraWhiteSpace(text) {
    return text.trim().replace(/\s\s+/g, " ");
  }
  function getDimensions2D(dimensionString) {
    const match = dimensionString.match(DIMENSIONS_2D_REGEX);
    if (match) {
      return {
        width: parseInt(match[1]),
        height: parseInt(match[2])
      };
    }
    return DEFAULT_DIMENSIONS_2D;
  }
  function isEmptyString(text) {
    return text.trim().length === 0;
  }
  function escapeParenthesis(text) {
    return text.replace(/([()])/g, "\\$&");
  }
  function prepareSearchQuery(searchQuery2) {
    return removeExtraWhiteSpace(searchQuery2).toLowerCase();
  }
  function extractOrGroups(searchQuery2) {
    return Array.from(searchQuery2.matchAll(OR_GROUP_REGEX)).map((orGroup) => orGroup[1].split(" ~ "));
  }
  function extractRemainingTags(searchQuery2) {
    return removeExtraWhiteSpace(searchQuery2.replace(OR_GROUP_REGEX, "")).split(" ").filter((tag) => tag !== "");
  }
  function extractTagGroups(searchQuery2) {
    searchQuery2 = prepareSearchQuery(searchQuery2);
    return {
      orGroups: extractOrGroups(searchQuery2),
      remainingTags: extractRemainingTags(searchQuery2)
    };
  }
  function getContentType(tags) {
    if (typeof tags === "string") {
      tags = convertToTagSet(tags);
    }
    if (tags.has("video") || tags.has("mp4")) {
      return "video";
    }
    if (tags.has("gif") || tags.has("animated")) {
      return "gif";
    }
    return "image";
  }
  function removeNonNumericCharacters(text) {
    return text.replace(/\D/g, "");
  }
  function negateTags(tags) {
    return tags.replace(/(\S+)/g, "-$1");
  }
  function isOnlyDigits(text) {
    return /^\d+$/.test(text);
  }
  function convertToTagSet(tagString) {
    tagString = removeExtraWhiteSpace(tagString);
    if (tagString === "") {
      return /* @__PURE__ */ new Set();
    }
    return new Set(tagString.split(" ").sort());
  }
  function convertToTagString(tagSet) {
    if (tagSet.size === 0) {
      return "";
    }
    return Array.from(tagSet).sort().join(" ");
  }
  function capitalize(word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }
  function removeFirstAndLastLines(text) {
    const lines = text.split("\n").filter((line) => line.trim() !== "");
    if (lines.length <= 2) {
      return "";
    }
    return lines.slice(1, -1).join("\n").trim();
  }
  function removeLeadingHyphens(tag) {
    return tag.replace(/^[-*]*/, "");
  }
  var PRIVATE_SERVER_ORIGIN = "https://favorites-search-gallery-api.onrender.com";
  var PRIVATE_API_BASE_URL = `${PRIVATE_SERVER_ORIGIN}/?userId=${getUserId()}`;
  var PRIVATE_API_TAG_URL = `${PRIVATE_API_BASE_URL}&type=tag&name=`;
  var PRIVATE_API_POST_URL = `${PRIVATE_API_BASE_URL}&type=post&id=`;
  var PUBLIC_SERVER_ORIGIN = "https://api.rule34.xxx/index.php?page=dapi";
  var PUBLIC_API_BASE_URL = PUBLIC_SERVER_ORIGIN;
  var PUBLIC_API_POST_URL = `${PUBLIC_API_BASE_URL}&s=post&q=index&id=`;
  var PUBLIC_API_TAG_URL = `${PUBLIC_API_BASE_URL}&s=tag&q=index&name=`;
  var FINAL_API_POST_URL = PRIVATE_API_POST_URL;
  var FINAL_API_TAG_URL = PRIVATE_API_TAG_URL;
  var ORIGIN = "https://rule34.xxx";
  var POST_PAGE_URL = `${ORIGIN}/index.php?page=post&s=view&id=`;
  var SEARCH_PAGE_URL = `${ORIGIN}/index.php?page=post&s=list&tags=`;
  var FAVORITES_PAGE_URL = `${ORIGIN}/index.php?page=favorites&s=view&id=${getFavoritesPageId()}`;
  var PROFILE_PAGE_URL = `${ORIGIN}/index.php?page=account&s=profile&id=`;
  var POST_VOTE_URL = `${ORIGIN}/index.php?page=post&s=vote&type=up&id=`;
  var REMOVE_FAVORITE_URL = `${ORIGIN}/index.php?page=favorites&s=delete&id=`;
  var ADD_FAVORITE_URL = `${ORIGIN}/public/addfav.php?id=`;
  var CSS_URL = `${ORIGIN}//css/`;
  var MULTI_POST_API_URL = `${PRIVATE_SERVER_ORIGIN}/multi-post`;
  function createPostPageURL(id) {
    return `${POST_PAGE_URL}${id}`;
  }
  function createSearchPageURL(searchQuery2) {
    return `${SEARCH_PAGE_URL}${encodeURIComponent(searchQuery2)}`;
  }
  function createFavoritesPageURL(pageNumber) {
    return `${FAVORITES_PAGE_URL}&pid=${pageNumber}`;
  }
  function createProfilePageURL(id) {
    return `${PROFILE_PAGE_URL}${id}`;
  }
  function createPostAPIURL(id) {
    return `${FINAL_API_POST_URL}${id}`;
  }
  function createTagAPIURL(tagName) {
    return `${FINAL_API_TAG_URL}${encodeURIComponent(tagName)}`;
  }
  function createPostVoteURL(id) {
    return `${POST_VOTE_URL}${id}`;
  }
  function createRemoveFavoriteURL(id) {
    return `${REMOVE_FAVORITE_URL}${id}`;
  }
  function createAddFavoriteURL(id) {
    return `${ADD_FAVORITE_URL}${id}`;
  }
  function getStyleSheetURL(useDark) {
    return `${CSS_URL}${ON_MOBILE_DEVICE ? "mobile" : "desktop"}${useDark ? "-dark" : ""}.css?44`;
  }
  function getServerTestURL() {
    return `${PRIVATE_API_POST_URL}50`;
  }
  var AUTOPLAY_HTML = `
<div id="autoplay-container">
  <style>
    #autoplay-container {
      visibility: hidden;
    }

    #autoplay-menu {
      position: fixed;
      left: 50%;
      transform: translate(-50%);
      bottom: 5%;
      padding: 0;
      margin: 0;
      /* background: rgba(40, 40, 40, 1); */
      background: var(--gallery-menu-background);
      border-radius: 4px;
      white-space: nowrap;
      z-index: 10000;
      opacity: 0;
      transition: opacity .25s ease-in-out;

      &.visible {
        opacity: 1;
      }

      &.persistent {
        opacity: 1 !important;
        visibility: visible !important;
      }

      >div>img {
        color: red;
        position: relative;
        height: 75px;
        cursor: pointer;
        background-color: rgba(128, 128, 128, 0);
        margin: 5px;
        background-size: 10%;
        z-index: 3;
        border-radius: 4px;


        &:hover {
          background-color: rgba(200, 200, 200, .5);
        }
      }
    }

    .autoplay-progress-bar {
      position: absolute;
      top: 0;
      left: 0;
      width: 0%;
      height: 100%;
      background-color: steelblue;
      z-index: 1;

      /* position: fixed !important;
      top: 0;
      left: 0;
      width: 0;
      height: 4px;
      background: #ff5733;
      z-index: 1; */
    }

    body.autoplay::before {
      content: "";
      position: fixed;
      top: 0;
      left: 0;
      width: 0;
      height: 4px;
      background: #ff5733;
      animation: progress 5s linear forwards;
      z-index: 9999;
    }

    @keyframes progress {
      from {
        width: 0;
      }

      to {
        width: 100%;
      }
    }


    #autoplay-video-progress-bar {
      background-color: royalblue;
    }

    #autoplay-settings-menu {
      visibility: hidden;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate(-50%, -105%);
      border-radius: 4px;
      font-size: 10px !important;
      background: var(--gallery-menu-background);

      &.visible {
        visibility: visible;
      }

      >div {
        font-size: 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px 10px;
        color: white;


        >label {
          padding-right: 20px;
        }

        >.number {
          background: none;
          outline: 2px solid white;

          >hold-button,
          >button {
            &::after {
              width: 200%;
              height: 130%;
            }
          }

          >input[type="number"] {
            color: white;
            width: 7ch;
          }
        }
      }

      select {
        /* height: 25px; */
        font-size: larger;
        width: 10ch;
      }
    }

    #autoplay-settings-button.settings-menu-opened {
      filter: drop-shadow(6px 6px 3px #0075FF);
    }


    #autoplay-change-direction-mask {
      filter: drop-shadow(2px 2px 3px #0075FF);
    }

    #autoplay-play-button:active {
      filter: drop-shadow(2px 2px 10px #0075FF);
    }

    #autoplay-change-direction-mask-container {
      pointer-events: none;
      opacity: 0.75;
      height: 75px;
      width: 75px;
      margin: 5px;
      border-radius: 4px;
      right: 0;
      bottom: 0;
      z-index: 4;
      position: absolute;
      clip-path: polygon(0% 0%, 0% 100%, 100% 100%);

      &.upper-right {
        clip-path: polygon(0% 0%, 100% 0%, 100% 100%);
      }
    }

    .autoplay-settings-menu-label {
      pointer-events: none;
    }
  </style>
  <div id="autoplay-menu" class="not-highlightable gallery-sub-menu">
    <div id="autoplay-buttons">
      <img id="autoplay-settings-button" title="Autoplay settings">
      <img id="autoplay-play-button" title="Pause autoplay">
      <img id="autoplay-change-direction-button" title="Change autoplay direction">
      <div id="autoplay-change-direction-mask-container">
        <img id="autoplay-change-direction-mask" title="Change autoplay direction">
      </div>
    </div>
    <div id="autoplay-image-progress-bar" class="autoplay-progress-bar"></div>
    <div id="autoplay-video-progress-bar" class="autoplay-progress-bar"></div>
    <div id="autoplay-settings-menu">
      <div>
        <label for="autoplay-image-duration-input">Image/GIF Duration</label>
        <span class="number">
          <hold-button class="number-arrow-down" pollingtime="50"><span>&lt;</span></hold-button>
          <input type="number" id="autoplay-image-duration-input" min="1" max="60" step="1">
          <hold-button class="number-arrow-up" pollingtime="50"><span>&gt;</span></hold-button>
        </span>
      </div>
      <div>
        <label for="autoplay-minimum-video-duration-input">Minimum Video Duration</label>
        <span class="number">
          <hold-button class="number-arrow-down" pollingtime="50"><span>&lt;</span></hold-button>
          <input type="number" id="autoplay-minimum-animated-duration-input" min="0" max="60" step="1">
          <hold-button class="number-arrow-up" pollingtime="50"><span>&gt;</span></hold-button>
        </span>
      </div>
    </div>
  </div>
</div>
`;
  var CAPTION_HTML = `
<style>
  .caption {
    overflow: hidden;
    pointer-events: none;
    background: rgba(0, 0, 0, .75);
    z-index: 15;
    position: absolute;
    width: 100%;
    height: 100%;
    top: -100%;
    left: 0px;
    top: 0px;
    text-align: left;
    transform: translateX(-100%);
    /* transition: transform .3s cubic-bezier(.26,.28,.2,.82); */
    transition: transform .35s ease;
    padding-top: 0.5ch;
    padding-left: 7px;

    h6 {
      display: block;
      color: white;
      padding-top: 0px;
    }

    li {
      width: fit-content;
      list-style-type: none;
      display: inline-block;
    }

    &.active {
        transform: translateX(0%);
    }

    &.transition-completed {
      .caption-tag {
        pointer-events: all;
      }
    }
  }

  .caption.hide {
    display: none;
  }

  .caption.inactive {
    display: none;
  }

  .caption-tag {
    pointer-events: none;
    color: #6cb0ff;
    word-wrap: break-word;

    &:hover {
      text-decoration-line: underline;
      cursor: pointer;
    }
  }

  .artist-tag {
    color: #f0a0a0;
  }

  .character-tag {
    color: #f0f0a0;
  }

  .copyright-tag {
    color: #EFA1CF;
  }

  .metadata-tag {
    color: #8FD9ED;
  }

  .caption-wrapper {
    pointer-events: none;
    position: absolute !important;
    overflow: hidden;
    top: -1px;
    left: -1px;
    width: 102%;
    height: 102%;
    display: block !important;
  }
</style>
`;
  var COMMON_HTML = `
<style>
  body {
    overflow-x: hidden;

    &:fullscreen,
    &::backdrop {
      background-color: var(--c-bg);
    }
  }

  .light-green-gradient {
    background: linear-gradient(to bottom, #aae5a4, #89e180);
    color: black;
  }

  .dark-green-gradient {
    background: linear-gradient(to bottom, #5e715e, #293129);
    color: white;
  }

  img {
    border: none !important;
  }

  .not-highlightable {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  input[type=number] {
    border: 1px solid #767676;
    border-radius: 2px;
  }

  .size-calculation-div {
    position: absolute !important;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    visibility: hidden;
    transition: none !important;
    transform: scale(1.05, 1.05);
  }

  .number {
    white-space: nowrap;
    position: relative;
    margin-top: 5px;
    border: 1px solid;
    padding: 0;
    border-radius: 20px;
    background-color: white;

    >hold-button,
    button {
      position: relative;
      top: 0;
      left: 0;
      font-size: inherit;
      outline: none;
      background: none;
      cursor: pointer;
      border: none;
      margin: 0px 8px;
      padding: 0;

      &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 200%;
        height: 100%;
        /* outline: 1px solid greenyellow; */
        /* background-color: hotpink; */
      }

      &:hover {
        >span {
          color: #0075FF;
        }
      }

      >span {
        font-weight: bold;
        font-family: Verdana, Geneva, Tahoma, sans-serif;
        position: relative;
        pointer-events: none;
        border: none;
        outline: none;
        top: 0;
        z-index: 5;
        font-size: 1.2em !important;
      }

      &.number-arrow-up {
        >span {
          transition: left .1s ease;
          left: 0;
        }

        &:hover>span {
          left: 3px;
        }
      }

      &.number-arrow-down {
        >span {
          transition: right .1s ease;
          right: 0;
        }

        &:hover>span {
          right: 3px;
        }
      }
    }

    >input[type="number"] {
      font-size: inherit;
      text-align: center;
      width: 2ch;
      padding: 0;
      margin: 0;
      font-weight: bold;
      padding: 3px;
      background: none;
      border: none;

      &:focus {
        outline: none;
      }
    }

    >input[type="number"]::-webkit-outer-spin-button,
    >input[type="number"]::-webkit-inner-spin-button {
      -webkit-appearance: none;
      appearance: none;
      margin: 0;
    }

    input[type=number] {
      appearance: textfield;
      -moz-appearance: textfield;
    }
  }

  .fullscreen-icon {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10010;
    pointer-events: none;
    width: 30vw;
  }

  input[type="checkbox"] {
    accent-color: #0075FF;
  }

  .thumb {
    >a {
      pointer-events: none;

      >img {
        pointer-events: all;
      }
    }
  }

  .blink {
    animation: blink 0.35s step-start infinite;
  }

  @keyframes blink {
    0% {
      opacity: 1;
    }

    50% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  /* html::before {
    content: "";
    position: fixed;
    z-index: 10000;
    opacity: 0;
    background: black;
    transition: opacity 0.2s linear;
    pointer-events: none;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  } */

  html.fullscreen-effect::before {
    opacity: 1;
  }

  html.transition-disabled::before {
    transition: none;
  }

  body.dialog-opened {
    overflow: hidden;
  }

  dialog::backdrop {
    background: rgba(0, 0, 0, 0.7);
  }

  .indented {
    ul {
      padding-left: 20px;
    }
  }

  .mobile-tap-control {
    position: fixed;
    top: 50% !important;
    height: 80vh;
    width: 30vw;
    background: red;
    z-index: 9999;
    color: red;
    transform: translateY(-50%);
    pointer-events: all !important;
    opacity: 0;
  }

  #left-mobile-tap-control {
    left: 0 !important;
    right: unset !important;
  }

  #right-mobile-tap-control {
    right: 0 !important;
    left: unset !important;
  }

  #mobile-symbol-container {
    display: flex;
    gap: 10px;
    text-align: center;
    height: 0;
    overflow: hidden;
    width: 100%;
    /* transition: height .2s ease; */
    margin-bottom: 5px;

    >button {
      font-size: 20px;
      padding: 0;
      margin: 0;
      font-weight: bold;
      text-align: center;
      flex: 1;
      height: 100% !important;
      border: none;
      border-radius: 4px;
    }

    &.active {
      height: 30px;
    }
  }
</style>
`;
  var CONTENT_HTML = `
<style>
  html {
    width: 100vw;
  }

  #favorites-search-gallery-content {
    --radius: 7px;
    padding: 0px 20px 30px 20px;
    margin-right: 15px;

    &.grid,
    &.square {
      display: grid !important;
      grid-template-columns: repeat(10, 1fr);
      grid-gap: 0.5cqw;

      .utility-button {
        width: 30%;
      }
    }

    &.square {
      .favorite, thumb {
        border-radius: var(--radius) !important;
        overflow: hidden;
        aspect-ratio: 1;

        >a,
        >div {
          width: 100%;
          height: 100%;

          >img:first-child,
          >canvas {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
      }
    }

    &.row {
      display: flex;
      flex-wrap: wrap;

      .favorite, .thumb {

        &.last-row {
          flex: 0 1 auto;
          /* opacity: 0.1; */
        }

        height: 300px;
        flex: 1 1 auto;
        border-radius: var(--radius);
        overflow: hidden;
      }

      .favorite, .thumb {

        >a,
        >div {

          width: 100%;
          height: 100%;

          >img:first-child {
            object-fit: cover;
            width: 100%;
            height: 100%;
            vertical-align: middle;
          }

          >canvas {
            height: 100%;
            object-fit: cover;
          }
        }
      }

      .utility-button {
        height: 30%;
      }
    }

    &.column {
      display: grid;
      grid-template-columns: repeat(10, 1fr);

      .favorites-column {
        display: flex;
        flex-direction: column;
        flex: 0 0 25%;

        .favorite, .thumb {
          border-radius: var(--radius);
          overflow: hidden;
        }
      }

      .utility-button {
        width: 30%;
      }
    }

    &.native {
      display: flex;
      flex-flow: wrap;
      gap: 25px 10px;

      .utility-button {
        width:  70px;
        aspect-ratio: 1;
      }
    }
  }

  .favorite, .thumb {
    position: relative;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    >a,
    >div {
      display: block;
      overflow: hidden;
      position: relative;
      cursor: default;

      >img:first-child {
        width: 100%;
        z-index: 1;
      }

      >a>div {
        height: 100%;
      }

      >canvas {
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        pointer-events: none;
        z-index: 1;
      }
    }

    &.hidden {
      display: none;
    }
  }

  .utility-button {
    cursor: pointer;
    position: absolute;
    left: 0;
    top: 0;
    font-weight: bold;
    background: none;
    border: none;
    z-index: 2;
    filter: grayscale(70%);

    &:active,
    &:hover {
      filter: none !important;
    }
  }

  .download-button {
    top: 0 !important;
    right: 0 !important;
    left: unset !important;
    top: unset !important;
  }

  img {
    -webkit-user-drag: none;
    -khtml-user-drag: none;
    -moz-user-drag: none;
    -o-user-drag: none;
  }
</style>
`;
  var CONTROLS_HTML = `
<style>
  #controls-guide {
    display: none;
    z-index: 99999;
    --tap-control: blue;
    --swipe-down: red;
    --swipe-up: green;
    top: 0;
    left: 0;
    background: lightblue;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    flex-direction: column;
    position: fixed;

    &.active {
      display: flex;
    }
  }

  #controls-guide-image-container {
    background: black;
    width: 100%;
    height: 100%;
  }

  #controls-guide-sample-image {
    background: lightblue;
    position: relative;
    top: 50%;
    left: 0;
    width: 100%;
    transform: translateY(-50%);
  }

  #controls-guide-top {
    position: relative;
    flex: 3;
  }

  #controls-guide-bottom {
    flex: 1;
    min-height: 25%;
    padding: 10px;
    font-size: 20px;
    align-content: center;
  }

  #controls-guide-tap-container {
    width: 100%;
    height: 100%;
    position: absolute;
  }

  .controls-guide-tap {
    color: white;
    font-size: 50px;
    position: absolute;
    top: 50%;
    height: 65%;
    width: 15%;
    background: var(--tap-control);
    z-index: 9999;
    transform: translateY(-50%);
    writing-mode: vertical-lr;
    text-align: center;
    opacity: 0.8;
  }

  #controls-guide-tap-right {
    right: 0;
  }

  #controls-guide-tap-left {
    left: 0;
  }

  #controls-guide-swipe-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    svg {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      width: 25%;
    }
  }

  #controls-guide-swipe-down {
    top: 0;
    color: var(--swipe-down);
    fill: var(--swipe-down);
  }

  #controls-guide-swipe-up {
    bottom: 0;
    color: var(--swipe-up);
    fill: var(--swipe-up);
  }
</style>

<div id="controls-guide">
  <div id="controls-guide-top">
    <div id="controls-guide-tap-container">
      <div id="controls-guide-tap-left" class="controls-guide-tap">
        Previous
      </div>
      <div id="controls-guide-tap-right" class="controls-guide-tap">
        Next
      </div>
    </div>
    <div id="controls-guide-image-container">
      <img id="controls-guide-sample-image" src="https://rule34.xxx/images/header2.png">
    </div>
    <div id="controls-guide-swipe-container">
      <svg id="controls-guide-swipe-down" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
        <path
          d="M180-360 40-500l42-42 70 70q-6-27-9-54t-3-54q0-82 27-159t78-141l43 43q-43 56-65.5 121.5T200-580q0 26 3 51.5t10 50.5l65-64 42 42-140 140Zm478 233q-23 8-46.5 7.5T566-131L304-253l18-40q10-20 28-32.5t40-14.5l68-5-112-307q-6-16 1-30.5t23-20.5q16-6 30.5 1t20.5 23l148 407-100 7 131 61q7 3 15 3.5t15-1.5l157-57q31-11 45-41.5t3-61.5l-55-150q-6-16 1-30.5t23-20.5q16-6 30.5 1t20.5 23l55 150q23 63-4.5 122.5T815-184l-157 57Zm-90-265-54-151q-6-16 1-30.5t23-20.5q16-6 30.5 1t20.5 23l55 150-76 28Zm113-41-41-113q-6-16 1-30.5t23-20.5q16-6 30.5 1t20.5 23l41 112-75 28Zm8 78Z" />
      </svg>
      <svg id="controls-guide-swipe-up" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
        <path
          d="M245-400q-51-64-78-141t-27-159q0-27 3-54t9-54l-70 70-42-42 140-140 140 140-42 42-65-64q-7 25-10 50.5t-3 51.5q0 70 22.5 135.5T288-443l-43 43Zm413 273q-23 8-46.5 7.5T566-131L304-253l18-40q10-20 28-32.5t40-14.5l68-5-112-307q-6-16 1-30.5t23-20.5q16-6 30.5 1t20.5 23l148 407-100 7 131 61q7 3 15 3.5t15-1.5l157-57q31-11 45-41.5t3-61.5l-55-150q-6-16 1-30.5t23-20.5q16-6 30.5 1t20.5 23l55 150q23 63-4.5 122.5T815-184l-157 57Zm-90-265-54-151q-6-16 1-30.5t23-20.5q16-6 30.5 1t20.5 23l55 150-76 28Zm113-41-41-113q-6-16 1-30.5t23-20.5q16-6 30.5 1t20.5 23l41 112-75 28Zm8 78Z" />
      </svg>
    </div>
  </div>
  <div id="controls-guide-bottom">
    <ul style="text-align: center; list-style: none;">
      <li style="color: var(--tap-control);">Tap edges to traverse gallery</li>
      <li style="color: var(--swipe-down);">Swipe down to exit gallery</li>
      <li style="color: var(--swipe-up);">Swipe up to open autoplay menu</li>
    </ul>
  </div>
</div>
`;
  var DARK_THEME_HTML = `
<style>
  input[type=number] {
    background-color: #303030;
    color: white;
  }

  .number {
    background-color: #303030;

    >hold-button,
    button {
      color: white;
    }
  }

  #favorites-pagination-container {
    >button {
      border: 1px solid white !important;
      color: white !important;
    }
  }
</style>
`;
  var DESKTOP_HTML = `
<style>
  .checkbox {
    cursor: pointer;

    &:hover {
      color: #000;
      background: #93b393;
      text-shadow: none;
    }

    input[type="checkbox"] {
      width: 20px;
      height: 20px;
    }
  }

  #sort-ascending-checkbox {
    width: 20px;
    height: 20px;
  }

  #favorites-pagination-container>button {
    height: 32px;
  }

  .gallery-menu-button {
    &:hover {
      opacity: 1;
      transform: scale(1.25);
    }
  }

  .gallery-menu-button::after {
    content: attr(data-hint);
    position: absolute;
    top: 50%;
    left: 100%;
    transform: translateY(-50%);
    background: black;
    padding: 2px 6px;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    font-size: larger;
    transition: opacity 0.35s ease-in-out;
    border-radius: 3px;
    pointer-events: none;
  }

  .gallery-menu-button:hover::after {
    opacity: 1;
    visibility: visible;
  }

  #bottom-panel-4 {
    flex: 0 0 15% !important;
  }
</style>
`;
  var DOWNLOADER_HTML = `
<style>
  #download-menu {
    background: transparent;

    border: none;
    gap: 10px;
    padding: 0;
    overflow: hidden;

    * {
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
  }

  #download-menu-container {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 100%;
    gap: 10px;
    border-radius: 10px;
  }

  #download-menu-container-wrapper {
    display: flex;
    width: 450px;
    height: 150px;
    flex-direction: column;
    gap: 2px;
  }

  #download-menu-container-wrapper-inner {
    display: flex;
    padding: 10px;
    border-radius: 8px;
    height: 100%;
  }

  #download-menus button {
    width: 100%;
    height: 4rem;
    border-radius: 8px;
    font-size: large;
  }

  #download-menu.downloading #download-menu-buttons-start-download {
    display: none;
  }

  #download-menu.downloading #download-menu-options {
    display: none;
  }

  #download-menu.downloading #download-menu-status {
    flex: 1 1 100%;
  }

  #download-menu-options {
    flex: 1 0 25%;
    text-align: center;
  }

  #download-menu-options select {
    width: 150px !important;
    font-size: 40px;
    height: 60px;
    cursor: pointer;
  }


  #download-menu-buttons {
    display: flex;
    gap: 10px;
    flex-direction: column;
    flex: 1 0 15%;
  }

  #download-menu-buttons button {
    flex: 1 1 100%;
  }

  #download-menu-status {
    flex: 0 0 0%;
    display: flex;
    flex-direction: column;
    gap: 2px;
    /* transition: flex 0.15s linear; */
  }

  #download-menu-status-header {
    text-align: center;
    margin: 0;
    background: transparent;
  }

  #download-menu-status-header {
    color: white;
  }

  #download-menu-status span {
    font-size: medium;
  }

  #download-menu p {
    color: black;
  }


  #download-menu-warning-container button {
    margin: auto;
    border-radius: 8px;
  }

  #download-menu-warning-container {
    text-align: center;
  }

  #download-menu-help {
    display: flex;
    flex: 0 0 5%;
    align-items: center;
    justify-content: center;
  }

  #download-menu-help button {
    background: transparent;
    width: 100%;
    aspect-ratio: 1;
    border: none;
    position: relative;
  }

  #download-menu-help button:hover {
    background: rgba(0, 0, 0, 0.1);
  }

  #download-menu-help svg {
    background: transparent !important;
    position: absolute;
    left: 50%;
    top: 50%;
    width: 100%;
    height: 100%;
    transform: translate(-50%, -50%);
  }

  #download-menu-help svg.dark-green-gradient {
    fill: white;
  }

  #download-menu-help-text {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 500px;
    transform: translateY(100%);
    background: gray;
    color: black;
  }

  #download-menu-options-batch-size-container>span {
    font-size: x-large;
  }
</style>

<div id="download-menus">
  <dialog id="download-menu">
    <div id="download-menu-container-wrapper">
      <h1 id="download-menu-status-header" class="light-green-gradient">Download</h1>
      <div id="download-menu-container-wrapper-inner" class="light-green-gradient">
        <div id="download-menu-container">
          <div id="download-menu-buttons">
            <button id="download-menu-buttons-start-download">Download</button>
            <button id="download-menu-buttons-cancel-download">Cancel</button>
          </div>
          <div id="download-menu-options" class="download-menu-setup">
            <div id="download-menu-options-batch-size-container">
              <span>Batch Size</span>
              <select id="download-menu-options-batch-size">
                <option value="50">50</option>
                <option value="100">100</option>
                <option value="250">250</option>
                <option value="500">500</option>
                <option value="1000">1000</option>
                <option value="2500">2500</option>
                <option value="5000">5000</option>
              </select>
            </div>
          </div>
          <div id="download-menu-status">
          </div>
          <!-- <div id="download-menu-help">
            <button>
              <svg class="light-green-gradient" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                <path
                  d="M478-240q21 0 35.5-14.5T528-290q0-21-14.5-35.5T478-340q-21 0-35.5 14.5T428-290q0 21 14.5 35.5T478-240Zm-36-154h74q0-33 7.5-52t42.5-52q26-26 41-49.5t15-56.5q0-56-41-86t-97-30q-57 0-92.5 30T342-618l66 26q5-18 22.5-39t53.5-21q32 0 48 17.5t16 38.5q0 20-12 37.5T506-526q-44 39-54 59t-10 73Zm38 314q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
              </svg>
            </button>
          </div> -->
        </div>
      </div>
    </div>
    <!-- <div id="download-menu-help-text">
      <p>
        This is some text that will be displayed in the download menu. It can be used to provide information or instructions to the user.
      </p>
    </div> -->
  </dialog>
  <dialog id="download-menu-warning" class="light-green-gradient">
    <div id="download-menu-warning-container">
      <h1>Wait for all favorites to load before downloading</h1>
      <form method="dialog"><button>Close</button></form>
    </div>
  </dialog>
</div>
`;
  var FAVORITES_HTML = `
<div id="favorites-search-gallery-menu" class="light-green-gradient not-highlightable">
  <style>
    #favorites-search-gallery-menu {
      position: sticky;
      top: -1px;
      /* padding: 10px; */
      padding: 5px;
      z-index: 30;
      margin-bottom: 10px;

      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        appearance: none;
        margin: 0;
      }

      select {
        cursor: pointer;
        min-height: 25px;
        width: 150px;
        margin-top: 2px;
      }
    }

    #favorites-search-gallery-menu-panels {
      >div {
        flex: 1;
      }
    }

    #left-favorites-panel {
      flex: 10 !important;
    }

    #left-favorites-panel-top-row {
      margin-bottom: 5px;

      >label {
        align-content: center;
        margin-right: 5px;
        margin-top: 4px;
      }

      >button {
        height: 35px;
        border: none;
        border-radius: 4px;

        &:hover {
          filter: brightness(140%);
        }

        &:not(:last-of-type) {
          margin-right: 5px;
        }
      }

      >button[disabled] {
        filter: none !important;
        cursor: wait !important;
      }
    }

    #right-favorites-panel {
      flex: 9 !important;
      margin-left: 30px;
      display: none;
    }

    textarea {
      max-width: 100%;
      height: 50px;
      width: 98%;
      padding: 10px;
      border-radius: 6px;
      resize: vertical;
    }

    button,
    input[type="checkbox"] {
      cursor: pointer;
    }

    .checkbox {
      display: block;
      padding: 2px 6px 2px 0px;
      border-radius: 4px;
      margin-left: -3px;
      height: 27px;

      >input {
        vertical-align: -5px;
      }
    }

    #column-count-container {
      >div {
        align-content: center;
      }
    }

    #favorite-finder {
      margin-top: 7px;

      >button {
        white-space: nowrap;
        /* border-radius: 4px; */
        /* height: 30px; */
      }

      >button:last-of-type {
        margin-left: 2px;
        margin-bottom: 5px;
      }

      >input {
        width: 75px;
        /* border-radius: 6px;
        height: 35px;
        border: 1px solid; */
      }
    }

    #favorites-pagination-container {
      /* padding: 0px 10px 0px 10px; */

      >button {
        background: transparent;
        margin: 0px 2px;
        padding: 2px 6px;
        border: 1px solid black;
        font-size: 14px;
        color: black;
        font-weight: normal;
        width: 6ch;

        &:hover {
          background-color: #93b393;
        }

        &.selected {
          border: none !important;
          font-weight: bold;
          pointer-events: none;
        }

        &[disabled] {
          background-color: transparent !important;
        }
      }
    }



    #help-links-container {
      >a:not(:last-child)::after {
        content: " |";
      }

      /* display: flex;
      flex-direction: column;

      >a {
        font-size: x-large;
      }

      margin-top: 17px; */
    }

    #whats-new-link {
      cursor: pointer;
      padding: 0;
      position: relative;
      font-weight: bolder;
      font-style: italic;
      background: none;
      text-decoration: none !important;

      &.hidden:not(.persistent)>div {
        display: none;
      }

      &.persistent,
      &:hover {
        &.light-green-gradient {
          color: black;
        }

        &:not(.light-green-gradient) {
          color: white;
        }
      }
    }


    #whats-new-container {
      z-index: 10;
      top: 20px;
      right: 0;
      transform: translateX(25%);
      font-style: normal;
      font-weight: normal;
      white-space: nowrap;
      max-width: 100vw;
      padding: 5px 20px;
      position: absolute;
      pointer-events: none;
      text-shadow: none;
      border-radius: 2px;

      &.light-green-gradient {
        outline: 2px solid black;

      }

      &:not(.light-green-gradient) {
        outline: 1.5px solid white;
      }
    }

    .hotkey {
      font-weight: bolder;
      color: orange;
    }

    #left-favorites-panel-bottom-row {
      display: flex;
      /* margin-top: 10px; */
      flex-wrap: nowrap;

      >div {
        flex: 1;
      }

      .number {
        font-size: 18px;

        >input {
          width: 5ch;
        }
      }
    }

    #additional-favorite-options {
      >div:not(:last-child) {
        margin-bottom: 10px;
      }
    }

    .number-label-container {
      display: inline-block;
      min-width: 130px;
    }

    #show-ui-container.ui-hidden {
      label {
        text-align: center;
      }

      max-width: 100vw;
      text-align: center;
      align-content: center;
    }

    #rating-container {
      white-space: nowrap;
    }

    #allowed-ratings {
      margin-top: 5px;
      font-size: 12px;

      >label {
        outline: 1px solid;
        padding: 3px;
        cursor: pointer;
        opacity: 0.5;
        position: relative;
      }

      >label[for="explicit-rating"] {
        border-radius: 7px 0px 0px 7px;
        margin-right: 2px;
      }

      >label[for="questionable-rating"] {
        margin-right: 2px;
      }

      >label[for="safe-rating"] {
        border-radius: 0px 7px 7px 0px;
      }

      >input[type="checkbox"] {
        display: none;

        &:checked+label {
          background-color: #0075FF;
          color: white;
          opacity: 1;
        }
      }
    }


    #favorites-load-status {
      >label {
        display: inline-block;
        min-width: 100px;
        margin-right: 20px;
      }
    }

    #main-favorite-options-container {
      display: flex;
      flex-wrap: wrap;
      flex-direction: row;

      >div {
        flex-basis: 45%;
      }
    }

    #sort-ascending {
      position: absolute;
      top: 18px;
      left: 150px;
      width: 20px;
      height: 20px;
    }

    #favorite-finder-input {
      border: none !important;
    }

    div#header {
      margin-bottom: 0 !important;
    }

    body {
      overflow-x: hidden;
    }

    #goto-page-input {
      width: 5ch;
    }


    #sort-container {
      position: relative;
    }

    .toggle-switch {
      position: relative;
      display: block;
      width: 60px;
      height: 34px;
      transform: scale(.75);
      align-content: center;
    }

    .toggle-switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      -webkit-transition: .4s;
      transition: .4s;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 26px;
      width: 26px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      -webkit-transition: .4s;
      transition: .4s;
    }

    input:checked+.slider {
      background-color: #0075FF;
    }

    input:focus+.slider {
      box-shadow: 0 0 1px #0075FF;
    }

    input:checked+.slider:before {
      -webkit-transform: translateX(26px);
      -ms-transform: translateX(26px);
      transform: translateX(26px);
    }

    .slider.round {
      border-radius: 34px;
    }

    .slider.round:before {
      border-radius: 50%;
    }

    .toggle-switch-label {
      margin-left: 60px;
      margin-top: 20px;
      font-size: 16px;
    }

    .inline-option-container {
      >div {
        display: inline-block;
      }
    }

    #sorting-method-id {
      display: none;
    }

    textarea#favorites-search-box {
      margin-top: 5px;
    }

    #favorites-load-status-label.hidden {
      display: none;
    }

    #favorites-bottom-navigation-buttons {
      display: flex;
      margin-top: auto;

      &>button {
        font-size: xx-large;
        height: 50px;
        flex: 1;
      }
    }

    #performance-profile {
      width: 160px !important;
    }

    #show-ui-label {
      margin-right: 15px;
    }
  </style>
  <div id="favorites-search-gallery-menu-panels" style="display: flex;">
    <div id="left-favorites-panel">
      <h2 style="display: inline;" id="search-header">Search Favorites</h2>
      <span id="favorites-load-status" style="margin-left: 5px;">
        <label id="match-count-label"></label>
        <label id="favorites-load-status-label"></label>
      </span>
      <div id="left-favorites-panel-top-row">
        <span id="favorites-pagination-placeholder"></span>
      </div>
      <div id="left-favorites-panel-bottom-row">
        <div id="bottom-panel-1">
          <div class="options-container">
            <div id="main-favorite-options-container">
              <div id="favorite-options-left">
              </div>
              <div id="favorite-options-right">
              </div>
            </div>
          </div>
        </div>

        <div id="bottom-panel-2">
          <div id="additional-favorite-options-container" class="options-container">
            <div id="additional-favorite-options">
              <div id="layout-sort-container" class="inline-option-container">
                <div id="layout-container">
                  <label>Layout</label>
                  <br>
                </div>
                <div id="sort-container" title="Change sorting order of search results">
                  <span id="sort-labels">
                    <label style="margin-right: 22px;" for="sorting-method">Sort By</label>
                    <label style="margin-left:  22px;" for="sort-ascending">Ascending</label>
                  </span>
                  <div id="sort-inputs">
                  </div>
                </div>
              </div>
              <div id="results-columns-container" class="inline-option-container">
                <div id="results-per-page-container"
                  title="Set the maximum number of search results to display on each page
Lower numbers improve responsiveness">
                  <span class="number-label-container">
                    <label id="results-per-page-label" for="results-per-page-input">Results per Page</label>
                  </span>
                  <br>
                </div>
                <div id="column-count-container" title="Set the number of favorites per row">
                  <div>
                    <span class="number-label-container">
                      <label id="column-count-label">Columns</label>
                    </span>
                    <br>
                  </div>
                </div>
                <div id="row-size-container" title="Set the height of each row">
                  <div>
                    <span class="number-label-container">
                      <label id="row-size-label">Row height</label>
                    </span>
                    <br>
                  </div>
                </div>
              </div>
              <div id="rating-container" title="Filter search results by rating">
              </div>
              <div id="performance-profile-container" title="Improve performance by disabling features">
                <label for="performance-profile">Performance Profile</label>
                <br>
              </div>
            </div>
          </div>
        </div>

        <div id="bottom-panel-3">

        </div>

        <div id="bottom-panel-4">
          <div id="show-ui-wrapper">
          </div>
          <div class="options-container">
          </div>
        </div>
      </div>
    </div>
    <div id="right-favorites-panel"></div>
  </div>
</div>
`;
  var GALLERY_HTML = `
<style>
  html {
    width: 100vw;
  }

  body {
    overflow-x: hidden;
  }

  video::-webkit-media-controls-panel {
    background: transparent !important;
  }

  video::-webkit-media-controls-enclosure {
    background: transparent !important;
  }

  #gallery-container {
    pointer-events: none;
    z-index: 9000;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;

    * {
      top: 0;
      left: 0;
      position: fixed;
      -webkit-user-drag: none;
      -khtml-user-drag: none;
      -moz-user-drag: none;
      -o-user-drag: none;
    }
  }

  .fullscreen-image-container {
    width: 100%;
    height: 100%;
    pointer-events: none;
    position: relative;



    &.zoomed-in {
      overflow: scroll;
      pointer-events: all;

      &.zooming {
        cursor: zoom-out;
      }

      .fullscreen-image {
        height: 250%;
        left: 0 !important;
        top: 0 !important;
        transform: none !important;
      }
    }
  }

  .fullscreen-image {
    position: relative !important;
    pointer-events: none;
    height: 100%;
    margin: 0;
    left: 50% !important;
    top: 50% !important;
    transform: translate(-50%, -50%);
  }

  a.hide {
    cursor: default;
  }

  option {
    font-size: 15px;
  }

  #gallery-background {
    background: black;
    z-index: -1;
    pointer-events: none;
    cursor: none;
    width: 100vw;
    height: 100vh;

    &.show-on-hover {
      display: block;
    }

    &.in-gallery {
      display: block;
      pointer-events: all;
    }

    &.zooming {
      cursor: zoom-in !important;

      &.zoomed-in {
        pointer-events: none;
      }
    }
  }

  :root {
    /* --gallery-menu-background: rgba(0, 0, 0, 0.75); */
    --gallery-menu-background: rgba(0, 0, 0, 1);
    --gallery-menu-size: 80px;
  }

  #gallery-menu {
    pointer-events: none;
    position: fixed;
    display: flex;
    justify-content: flex-end;
    top: 0;
    left: 0;
    width: 100vw;
    height: var(--gallery-menu-size);
    z-index: 20;
    background: transparent;
    transform: translateY(-100%);
    opacity: 0;
    transition: transform 0.4s cubic-bezier(0, 0, 0.25, 1), opacity 0.25s cubic-bezier(0, 0, 0.25, 1);

    #dock-gallery {

      >img,
      >svg {
        transform: rotateZ(-90deg) !important;
      }
    }


    &.active,
    &.persistent,
    &.pinned {
      opacity: 1;
      transform: translateY(0%);
    }

    &.dock-left {
      width: var(--gallery-menu-size);
      height: 100vh;
      top: 0;
      left: 0;
      transform: translateX(-100%);

      &.active,
      &.persistent,
      &.pinned {
        opacity: 1;
        transform: translateX(0%);
      }

      #dock-gallery {

        >img,
        >svg {
          transform: none !important;
        }
      }

      #gallery-menu-button-container {
        max-width: 100%;
        flex-direction: column;
        justify-content: flex-start;
        margin: 0;
      }

      .gallery-menu-button {
        max-width: 100%;
        margin: 0;

        >img,
        svg {
          width: 75% !important;
          height: auto;
        }
      }
    }

    &.pinned {
      #pin-gallery {

        >img,
        >svg {
          /* fill: #0075FF; */
          transform: rotateZ(90deg) !important;
        }
      }
    }

    * {
      position: static;
      -webkit-user-drag: none;
      -khtml-user-drag: none;
      -moz-user-drag: none;
      -o-user-drag: none;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
  }

  #gallery-menu-button-container {
    display: flex;
    justify-content: center;
    height: 100%;
    /* margin: 0px 20px 0px 0px; */
    width: fit-content;
    background: var(--gallery-menu-background);
  }

  .gallery-menu-button {
    pointer-events: all;
    display: inline-block;
    align-content: center;
    text-align: center;
    aspect-ratio: 1;
    cursor: pointer;
    filter: grayscale(50%);
    opacity: 0.75;
    transition: transform 0.25s cubic-bezier(0, 0, 0.25, 1);

    >img,
    svg {
      pointer-events: none;
      height: 75% !important;
      transform: none !important;
      transition: transform 0.25s ease;
    }
  }


  :root {
    --rainbow: linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet);
  }


  #add-favorite-gallery {
    >svg {
      fill: white;
    }

  }

  @keyframes glowSwipe {
    0% {
      left: -100%;
    }

    100% {
      left: 100%;
    }
  }

  #gallery-menu-background-color-picker {
    position: absolute;
    visibility: hidden;
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
  }

  #gallery-mobile-menu {
    position: fixed;
    pointer-events: all;
    top: 0;
    left: 0;
    width: 100vw !important;
    height: 100vh !important;
    z-index: 10000;
    background: rgba(0, 0, 0, 0.75);
  }
</style>
`;
  var HELP_HTML = `
<span id="help-links-container">
  <a href="https://github.com/bruh3396/favorites-search-gallery/#controls" target="_blank">Help</a>
  <!-- <a href="https://sleazyfork.org/en/scripts/504184-rule34-favorites-search-gallery/feedback" target="_blank">Feedback</a> -->
  <a href="https://github.com/bruh3396/favorites-search-gallery/issues" target="_blank">Report
    Issue</a>
  <a id="whats-new-link" href="" class="hidden light-green-gradient">What's new?
    <div id="whats-new-container" class="light-green-gradient indented">
      <h2>v1.20.1</h2>
      <ul>
        <li>Added sort by duration</li>
        <ul>
          <li>Images anf GIFs have a duration of 0</li>
        </ul>
        <li>Added search by duration</li>
        <ul>
          <li>Examples:</li>
          <ul>
            <li>0 Second videos: "duration:&lt;1 video"</li>
            <li>2 Minute+ videos: "duration:&gt;120 video"</li>
            <li>30-60 Second videos: "duration:&gt;30 duration:&lt;30 video"</li>
          </ul>
        </ul>
      </ul>
      <h2>v1.20</h2>
      <ul>
        <li>Added layouts, upscaling, and infinite scroll to search pages</li>
      </ul>
      <h2>v1.19.1</h2>
      <ul>
        <li>Fixed mass downloads slowing down over time</li>
        <li>Fixed Firefox gallery not opening</li>
      </ul>
    </div>
  </a>
</span>
`;
  var MOBILE_HTML = `
<style>
  #performance-profile-container,
  #show-hints-container,
  #whats-new-link,
  #show-ui-div,
  #search-header,
  #fullscreen-gallery,
  #exit-gallery,
  #background-color-gallery,
  #left-favorites-panel-top-row,
  #layout-select-row,
  #favorite-finder {
    display: none !important;
  }

  #favorites-pagination-container>button {

    &:active,
    &:focus {
      background-color: slategray;
    }

    &:hover {
      background-color: transparent;
    }
  }

  .thumb,
  .favorite {
    >div>canvas {
      display: none;
    }
  }

  #more-options-label {
    margin-left: 6px;
  }

  .checkbox {
    margin-bottom: 8px;

    input[type="checkbox"] {
      margin-right: 10px;
    }
  }

  #mobile-container {
    position: fixed !important;
    z-index: 30;
    width: 100vw;
    top: 0px;
    left: 0px;
  }

  #favorites-search-gallery-menu-panels {
    display: block !important;
  }

  #right-favorites-panel {
    margin-left: 0px !important;
  }

  #left-favorites-panel-bottom-row {
    margin: 4px 0px 0px 0px !important;
  }

  #additional-favorite-options-container {
    margin-right: 5px;
  }

  #favorites-search-gallery-content {
    grid-gap: 1.2cqw;
    padding: 0px 5px 20px 5px !important;
    margin-right: 0px !important;
  }

  #favorites-search-gallery-menu {
    padding: 7px 5px 5px 5px;
    top: 0;
    left: 0;
    width: 100vw;


    &.fixed {
      position: fixed;
      margin-top: 0;
    }
  }

  #favorites-load-status-label {
    display: inline;
  }

  textarea {
    border-radius: 0px;
    height: 50px;
    padding: 8px 0px 8px 10px !important;
  }

  select {
    width: 120px !important;
    min-height: 30px !important;
    margin-bottom: 2px;
  }

  body {
    width: 100% !important;
  }

  #favorites-pagination-container>button {
    text-align: center;
    font-size: 16px;
    height: 30px;
  }

  #goto-page-input {
    top: -1px;
    position: relative;
    height: 25px;
    width: 1em !important;
    text-align: center;
    font-size: 16px;
  }

  #goto-page-button {
    display: none;
    height: 36px;
    position: absolute;
    margin-left: 5px;
  }

  #additional-favorite-options {
    .number {
      display: none;
    }
  }

  #results-per-page-container {
    margin-bottom: 10px;
  }

  #bottom-panel-3,
  #bottom-panel-4 {
    flex: none !important;
  }

  #bottom-panel-2 {
    padding-top: 8px;
  }

  #rating-container {
    position: relative;
    left: -5px;
    top: -2px;
    display: none;
  }

  #favorites-pagination-container>button {
    &[disabled] {
      opacity: 0.25;
      pointer-events: none;
    }
  }

  html {
    -webkit-tap-highlight-color: transparent;
    -webkit-text-size-adjust: 100%;
  }

  #additional-favorite-options {
    select {
      width: 120px;
    }
  }

  .utility-button {
    filter: none;
    width: 60%;
  }

  #left-favorites-panel-bottom-row {
    overflow: hidden;
    /* -webkit-transition: height 0.2s ease;
    -moz-transition: height 0.2s ease;
    -ms-transition: height 0.2s ease;
    -o-transition: height 0.2s ease;
    transition: height 0.2s ease; */
    height: 270px;

    &.hidden {
      height: 0px;
    }
  }

  #favorites-search-gallery-content.sticky-menu-shadow {
    /* transition: margin 0.2s ease; */
  }

  #favorites-search-gallery-content.sticky-menu {
    margin-top: 340px !important;
  }

  #autoplay-settings-menu {
    >div {
      font-size: 14px !important;
    }
  }

  #results-columns-container {
    margin-top: -6px;
  }

  #mobile-toolbar-row {
    display: flex;
    align-items: center;
    background: none;

    svg {
      fill: black;
      -webkit-transition: none;
      transition: none;
      transform: scale(0.85);
    }

    input[type="checkbox"]:checked+label {
      svg {
        fill: #0075FF;
      }

      color: #0075FF;
    }

    .dark-green-gradient {
      svg {
        fill: white;
      }
    }
  }

  .search-bar-container {
    align-content: center;
    width: 100%;
    height: 40px;
    border-radius: 50px;
    padding-left: 10px;
    padding-right: 10px;
    flex: 1;

    &.light-green-gradient {
      background: white !important;
    }

    &.dark-green-gradient {
      background: #303030;
    }
  }

  .search-bar-items {
    display: flex;
    align-items: center;
    height: 100%;
    width: 100%;

    >div {
      flex: 0;
      min-width: 40px;
      width: 100%;
      height: 100%;
      display: block;
      align-content: center;
    }
  }

  .search-icon-container {
    flex: 0;
    min-width: 40px;
  }

  .search-bar-input-container {
    flex: 1 !important;
    display: flex;
    width: 100%;
    height: 100%;
  }

  .search-bar-input {
    flex: 1;
    border: none;
    box-sizing: content-box;
    height: 100%;
    padding: 0;
    margin: 0;
    outline: none !important;
    border: none !important;
    font-size: 14px !important;
    width: 100%;

    &:focus,
    &:focus-visible {
      background: none !important;
      border: none !important;
      outline: none !important;
    }
  }

  .search-clear-container {
    visibility: hidden;

    svg {
      transition: none !important;
      transform: scale(0.6) !important;
    }
  }

  .circle-icon-container {
    padding: 0;
    margin: 0;
    align-content: center;
    border-radius: 50%;

    &:active {
      background-color: #0075FF;
    }
  }

  #options-checkbox {
    display: none;
  }

  .mobile-toolbar-checkbox-label {
    width: 100%;
    height: 100%;
    display: block;
  }

  #reset-button {
    transition: none !important;
    height: 100%;

    >svg {
      transition: none !important;
      transform: scale(0.65);
    }

    &:active {
      svg {
        fill: #0075FF;
      }
    }
  }

  #help-button {
    height: 100%;

    >svg {
      transform: scale(0.75);
    }
  }

  #sort-ascending-toggle-switch {
    transform: scale(0.6) !important;
  }

  #sort-inputs>.toggle-switch {
    display: inline-block;
  }

  #sort-inputs {
    margin-top: -5px;
  }

  #layout-sort-container {
    margin-bottom: 4px !important;
  }

  #mobile-footer {
    padding-top: 4px;
    z-index: 10;

    position: fixed;
    width: 100%;
    bottom: -1px;
    left: 0;
    /* padding: 4px 0px; */

    >div {
      text-align: center;
    }

    &.light-green-gradient {
      background: linear-gradient(to top, #aae5a4, #89e180);
    }

    &.dark-green-gradient {
      background: linear-gradient(to top, #5e715e, #293129);

    }
  }

  #mobile-footer-top {
    margin-bottom: 4px;
  }

  #mobile-footer-bottom {
    margin-bottom: 5px;
  }

  #favorites-load-status {
    font-size: 12px !important;

    >span {
      margin-right: 10px;
    }

    >span:nth-child(odd) {
      font-weight: bold;
    }

    >label {
      /* width: 300px; */
      min-width: unset !important;
    }
  }

  #favorites-load-status-label {
    padding-left: 0 !important;
  }

  #pagination-number:active {
    opacity: 0.5;
  }

  #favorites-pagination-container>button {
    min-width: 30px !important;
    width: unset !important;
  }

  #results-per-page-container {
    margin-bottom: unset !important;
  }

  #gallery-menu {
    justify-content: center !important;
  }

  #download-button {
    font-size: large;
    border-radius: 4px;
    border: none;
  }

  #download-menu-container-wrapper {
    width: unset !important;
  }

  #download-menu-options select {
    font-size: 30px !important;
  }

  input[type="text"] {
    font-size: 16px !important;
  }
</style>
`;
  var SAVED_SEARCHES_HTML = `
<div id="saved-searches">
  <style>
    #saved-searches-container {
      margin: 0;
      display: flex;
      flex-direction: column;
      padding: 0;
    }

    #saved-searches-input-container {
      margin-bottom: 10px;
    }

    #saved-searches-input {
      flex: 15 1 auto;
      margin-right: 10px;
    }

    #savedSearches {
      max-width: 100%;

      button {
        flex: 1 1 auto;
        cursor: pointer;
      }
    }

    #saved-searches-buttons button {
      margin-right: 1px;
      margin-bottom: 5px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      height: 35px;

      &:hover {
        filter: brightness(140%);
      }
    }

    #saved-search-list-container {
      direction: rtl;
      max-height: 200px;
      overflow-y: auto;
      overflow-x: hidden;
      margin: 0;
      padding: 0;
    }

    #saved-search-list {
      direction: ltr;
      >li {
        display: flex;
        flex-direction: row;
        cursor: pointer;
        background: rgba(0, 0, 0, .1);

        &:nth-child(odd) {
          background: rgba(0, 0, 0, 0.2);
        }

        >div {
          padding: 4px;
          align-content: center;

          svg {
            height: 20px;
            width: 20px;
          }
        }
      }
    }

    .save-search-label {
      flex: 1000 30px;
      text-align: left;

      &:hover {
        color: white;
        background: #0075FF;
      }
    }

    .edit-saved-search-button {
      text-align: center;
      flex: 1 20px;

      &:hover {
        color: white;
        background: slategray;
      }
    }

    .remove-saved-search-button {
      text-align: center;
      flex: 1 20px;

      &:hover {
        color: white;
        background: #f44336;
      }
    }

    .move-saved-search-to-top-button {
      text-align: center;

      &:hover {
        color: white;
        background: steelblue;
      }
    }

    /* .tag-type-saved>a,
    .tag-type-saved {
      color: lightblue;
    } */
  </style>
  <h2>Saved Searches</h2>
  <div id="saved-searches-buttons">
    <button title="Save custom search" id="save-custom-search-button">Save</button>
    <button id="stop-editing-saved-search-button" style="display: none;">Cancel</button>
    <span>
      <button title="Export all saved searches" id="export-saved-search-button">Export</button>
      <button title="Import saved searches" id="import-saved-search-button">Import</button>
    </span>
    <button title="Save result ids as search" id="save-results-button">Save Results</button>
  </div>
  <div id="saved-searches-container">
    <div id="saved-searches-input-container">
      <textarea id="saved-searches-input" spellcheck="false" style="width: 97%;"
        placeholder="Save Custom Search"></textarea>
    </div>
    <div id="saved-search-list-container">
      <ul id="saved-search-list"></ul>
    </div>
  </div>
</div>
<script>
<\/script>
`;
  var SEARCH_PAGE_HTML = `
<div id="search-page-menu">
  <style>
    #postListDisplayOptsForm>h3,
    .postListSidebarRight {
      display: none;
    }

    #favorites-search-gallery-content {
      margin: 0;
      padding: 0;
    }

    .content {
      flex: 1;
    }

    .search-page-option {
      display: flex;
      justify-content: space-between;

      input[type="checkbox"] {
        transform: scale(1.3);
        cursor: pointer;
      }
    }

    #search-page-menu {
      margin-top: 20px;
    }

    #search-page-menu select {
      min-width: 80px;
    }

    #search-page-options {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
  </style>
  <h6>Favorites Search Gallery</h6>
  <hr>
  <div id="search-page-options">
    <div id="search-page-upscale-thumbs" class="search-page-option"><label>Upscale</label></div>
    <div id="search-page-infinite-scroll" class="search-page-option"><label>Infinite Scroll</label></div>
    <div id="search-page-autoplay" class="search-page-option"><label>Autoplay</label></div>
    <div id="search-page-add-favorite-buttons" class="search-page-option"><label>Favorite Buttons</label></div>
    <div id="search-page-gallery-menu" class="search-page-option"><label>Gallery Menu</label></div>
    <div id="search-page-performance-profile" class="search-page-option"><label>Profile</label></div>
    <div id="search-page-layout" class="search-page-option"><label>Layout</label></div>
    <div id="search-page-column-count" class="search-page-option"><label>Columns</label></div>
    <div id="search-page-row-size" class="search-page-option"><label>Row Size</label></div>
  </div>
  <hr>
</div>
`;
  var SEARCH_PAGE_INFINITE_SCROLL_HTML = `
<style>
  #paginator {
    display: none !important;
  }
</style>
`;
  var SKELETON_HTML = `
<style>
  .skeleton-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 10px;
    padding: 0px 30px;
  }

  .skeleton-column {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .skeleton-item {
    /* width: 100%; */
    /* aspect-ratio: 1/3; */
    background: #555;
    overflow: hidden;
  }

  .skeleton-item.pulse {
    animation: pulse var(--skeleton-animation-duration, 1s) infinite ease-in-out;
    animation-delay: var(--skeleton-animation-delay, 0s);
  }

  .skeleton-item.shine::after {
    background-image: linear-gradient(90deg, rgba(0, 0, 0, 0), rgba(255, 255, 255, 0.08), rgba(0, 0, 0, 0));
    content: "";
    position: absolute;
    transform: translateX(-100%);
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    animation: shine var(--skeleton-animation-duration, 1s) linear infinite;
    animation-delay: var(--skeleton-animation-delay, 0s);
  }

  @keyframes pulse {
    0% {
      opacity: 1;
    }

    50% {
      opacity: 0.5;
    }

    100% {
      opacity: 1;
    }
  }

  @keyframes shine {
    0% {
      transform: translateX(-100%);
    }
    /* 100% {
      transform: translateX(100%);
    } */

    50% {
      transform: translateX(100%);
    }

    100% {
      transform: translateX(-100%);
    }
  }
</style>
`;
  var TAG_MODIFIER_HTML = `
<div id="tag-modifier-container">
  <style>
    #tag-modifier-ui-container {
      display: none;

      >* {
        margin-top: 10px;
      }
    }

    #tag-modifier-ui-textarea {
      width: 80%;
    }

    .favorite.tag-modifier-selected {
      outline: 2px dashed white !important;

      >div, >a {
        opacity: 1;
        filter: grayscale(0%);
      }
    }

    #tag-modifier-ui-status-label {
      visibility: hidden;
    }

    .tag-type-custom>a,
    .tag-type-custom {
      color: hotpink;
    }
  </style>
  <div id="tag-modifier-option-container">
    <label class="checkbox" title="Add or remove custom or official tags to favorites">
      <input type="checkbox" id="tag-modifier-option-checkbox">Modify Tags<span class="option-hint"></span>
    </label>
  </div>
  <div id="tag-modifier-ui-container">
    <label id="tag-modifier-ui-status-label">No Status</label>
    <textarea id="tag-modifier-ui-textarea" placeholder="tags" spellcheck="false"></textarea>
    <div id="tag-modifier-buttons">
      <span id="tag-modifier-ui-modification-buttons">
        <button id="tag-modifier-ui-add" title="Add tags to selected favorites">Add</button>
        <button id="tag-modifier-remove" title="Remove tags from selected favorites">Remove</button>
      </span>
      <span id="tag-modifier-ui-selection-buttons">
        <button id="tag-modifier-ui-select-all" title="Select all favorites for tag modification">Select all</button>
        <button id="tag-modifier-ui-un-select-all" title="Unselect all favorites for tag modification">Unselect
          all</button>
      </span>
    </div>
    <div id="tag-modifier-ui-reset-button-container">
      <button id="tag-modifier-reset" title="Reset tag modifications">Reset</button>
    </div>
    <div id="tag-modifier-ui-configuration" style="display: none;">
      <button id="tag-modifier-import" title="Import modified tags">Import</button>
      <button id="tag-modifier-export" title="Export modified tags">Export</button>
    </div>
  </div>
</div>
`;
  var TOOLTIP_HTML = `
<div id="tooltip-container">
  <style>
    #tooltip {
      max-width: 750px;
      border: 1px solid black;
      padding: 0.25em;
      position: absolute;
      box-sizing: border-box;
      z-index: 25;
      pointer-events: none;
      visibility: hidden;
      opacity: 0;
      transition: visibility 0s, opacity 0.25s linear;
      font-size: 1.05em;
    }

    #tooltip.visible {
      visibility: visible;
      opacity: 1;
    }

    /* .favorite {
      overflow: unset !important;
    } */

    .favorite::after {
      opacity: 0;
      transition: visibility 0s, opacity 0.25s linear;
      content: attr(data-tooltip);
      position: absolute;
      font-size: 12px;
      z-index: 1000;
      background: gray;
      padding: 5px;
      color: white;
      left: 0;
      top: 100%;
      min-width: 500px;
      pointer-events: none;

    }

    .favorite.tooltip::after {
      opacity: 1;
    }
  </style>
</div>
`;
  var GeneralSettings = {
    rowSizeBounds: {
      min: 1,
      max: 10
    },
    columnCountBounds: {
      min: 2,
      max: 25
    },
    apiTimeout: 3e3,
    throttledMetadataAPIRequestDelay: 5,
    throttledExtensionAPIRequestDelay: 2,
    bruteForceImageExtensionRequestDelay: 75,
    imageRequestDelay: 35,
    postPageRequestDelayWhileFetchingFavorites: 3e4,
    postPageRequestDelayAfterFavoritesLoaded: 400,
    searchPagePostPageRequestDelay: 400,
    preloadThumbnails: true,
    galleryMenuOptionEnabled: true,
    thumbnailSpacing: 6,
    rightContentMargin: 15,
    skeletonAnimationClasses: "pulse",
    randomSkeletonAnimationTiming: true,
    infiniteScrollMargin: "75%"
  };
  var PromiseTimeoutError = class extends Error {
  };
  var DownloadAbortedError = class extends Error {
  };
  function sleep(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }
  function yield1() {
    return sleep(0);
  }
  function debounceAfterFirstCall(fn, delay) {
    let timeoutId;
    let firstCall = true;
    let calledDuringDebounce = false;
    return (...args) => {
      if (firstCall) {
        Reflect.apply(fn, this, args);
        firstCall = false;
      } else {
        calledDuringDebounce = true;
      }
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (calledDuringDebounce) {
          Reflect.apply(fn, this, args);
          calledDuringDebounce = false;
        }
        firstCall = true;
      }, delay);
    };
  }
  function debounceAlways(fn, delay) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        Reflect.apply(fn, this, args);
      }, delay);
    };
  }
  function throttle(fn, delay) {
    let throttling = false;
    return (...args) => {
      if (!throttling) {
        fn(...args);
        throttling = true;
        setTimeout(() => {
          throttling = false;
        }, delay);
      }
    };
  }
  function withTimeout(promise, milliseconds) {
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new PromiseTimeoutError()), milliseconds));
    return Promise.race([promise, timeout]);
  }
  var DO_NOTHING = () => {
  };
  function getMainStyleSheetElement() {
    return Array.from(document.querySelectorAll("link")).filter((link) => link.rel === "stylesheet")[0];
  }
  function setStyleSheet(url) {
    getMainStyleSheetElement()?.setAttribute("href", url);
  }
  function toggleDarkStyleSheet(useDark) {
    setStyleSheet(getStyleSheetURL(useDark));
  }
  function toggleLocalDarkStyles(useDark) {
    const currentTheme = useDark ? "light-green-gradient" : "dark-green-gradient";
    const targetTheme = useDark ? "dark-green-gradient" : "light-green-gradient";
    for (const element of Array.from(document.querySelectorAll(`.${currentTheme}`))) {
      element.classList.remove(currentTheme);
      element.classList.add(targetTheme);
    }
  }
  function setupVideoAndGifOutlines() {
    const size = ON_MOBILE_DEVICE ? 1 : 2;
    const videoSelector = "&:has(img.video)";
    const gifSelector = "&:has(img.gif)";
    const videoRule = `${videoSelector} {outline: ${size}px solid blue}`;
    const gifRule = `${gifSelector} {outline: ${size}px solid hotpink}`;
    insertStyleHTML(`
    #favorites-search-gallery-content {
      &.row,
      &.square,
      &.column
      {
        .favorite {
          ${videoRule}
          ${gifRule}
        }
      }

      &.grid,
      &.native
      {
        .favorite {
          >a,
          >div {
            ${videoRule}
            ${gifRule}
          }
        }
      }
    }

    .thumb {
      >a,
      >div {
        ${videoRule}
        ${gifRule}
      }
    }
    `, "video-gif-borders");
  }
  async function toggleDarkTheme(useDark) {
    await yield1();
    insertStyleHTML(useDark ? DARK_THEME_HTML : "", "dark-theme");
    toggleDarkStyleSheet(useDark);
    toggleLocalDarkStyles(useDark);
    setCookie("theme", useDark ? "dark" : "light");
  }
  function insertStyleHTML(html, id = void 0) {
    const style = document.createElement("style");
    style.textContent = html.replace("<style>", "").replace("</style>", "");
    if (id !== void 0) {
      id += "-fsg-style";
      const oldStyle = document.getElementById(id);
      if (oldStyle !== null) {
        oldStyle.remove();
      }
      style.id = id;
    }
    document.head.appendChild(style);
  }
  function usingDarkTheme() {
    return getCookie("theme", "") === "dark";
  }
  function getCurrentThemeClass() {
    return usingDarkTheme() ? "dark-green-gradient" : "light-green-gradient";
  }
  function insertHTMLAndExtractStyle(element, position, html) {
    const dom = new DOMParser().parseFromString(html, "text/html");
    const styles = Array.from(dom.querySelectorAll("style"));
    for (const style of styles) {
      insertStyleHTML(style.innerHTML);
      style.remove();
    }
    element.insertAdjacentHTML(position, dom.body.innerHTML);
  }
  function setupCommonStyles() {
    insertStyleHTML(SKELETON_HTML, "skeleton-style");
    insertStyleHTML(COMMON_HTML, "common-style");
    toggleDarkTheme(usingDarkTheme());
    setupVideoAndGifOutlines();
    addTilerStyles();
  }
  function setGalleryBackgroundColor(color) {
    insertStyleHTML(`
        #gallery-background,
        #gallery-menu,
        #gallery-menu-button-container,
        #autoplay-menu,
        #autoplay-settings-menu {
          background: ${color} !important;
        }

        .gallery-menu-button:not(:hover) {
          >svg {
              fill: ${color} !important;
              filter: invert(100%);
            }
        }
      `, "gallery-background-color");
  }
  function setColorScheme(color) {
    setGalleryBackgroundColor(color);
    Preferences.colorScheme.set(color);
  }
  function addTilerStyles() {
    const style = `
    #favorites-search-gallery-content {
      &.row, &.column, &.column .favorites-column, &.square, &.grid {
        gap: ${GeneralSettings.thumbnailSpacing}px;
      }

      &.column {
        margin-right: ${ON_DESKTOP_DEVICE ? GeneralSettings.rightContentMargin : 0}px;
      }
    }`;
    insertStyleHTML(style, "tiler-style");
  }
  var TYPEABLE_INPUTS = /* @__PURE__ */ new Set(["color", "email", "number", "password", "search", "tel", "text", "url", "datetime"]);
  var ITEM_CLASS_NAME = "favorite";
  var ITEM_SELECTOR = ".favorite, .thumb";
  var IMAGE_SELECTOR = ".favorite img";
  function getClosestItem(element) {
    return element.closest(ITEM_SELECTOR);
  }
  function getImageFromThumb(thumb) {
    return thumb.querySelector("img");
  }
  function getThumbFromImage(image) {
    return getClosestItem(image);
  }
  function getPreviewURL(item) {
    if (item instanceof HTMLElement) {
      const image = getImageFromThumb(item);
      return image ? image.src : null;
    }
    return item.thumbURL;
  }
  function getThumbUnderCursor(event) {
    if (!(event.target instanceof HTMLElement) || event.target.matches(".caption-tag")) {
      return null;
    }
    const image = event.target.matches(IMAGE_SELECTOR) ? event.target : null;
    return image === null ? null : getThumbFromImage(image);
  }
  function isHotkeyEvent(event) {
    return !event.repeat && event.target instanceof HTMLElement && !isTypeableInput(event.target) && !event.ctrlKey;
  }
  function isTypeableInput(element) {
    const tagName = element.tagName.toLowerCase();
    return tagName === "textarea" || tagName === "input" && TYPEABLE_INPUTS.has(element.getAttribute("type") ?? "");
  }
  function insideOfThumb(element) {
    return element instanceof HTMLElement && getClosestItem(element) !== null;
  }
  function waitForDOMToLoad() {
    if (document.readyState !== "loading") {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      Events.document.domLoaded.on(() => {
        resolve();
      }, {
        once: true
      });
    });
  }
  function imageIsLoaded(image) {
    return image.complete || image.naturalWidth !== 0;
  }
  function imageIsLoading(image) {
    return !imageIsLoaded(image);
  }
  function originalGetAllThumbs() {
    return Array.from(document.querySelectorAll(ITEM_SELECTOR)).filter((thumb) => thumb instanceof HTMLElement);
  }
  var getAllThumbs = originalGetAllThumbs;
  function changeGetAllThumbsImplementation(newGetAllThumbs) {
    getAllThumbs = newGetAllThumbs;
  }
  function resetGetAllThumbsImplementation() {
    getAllThumbs = originalGetAllThumbs;
  }
  function waitForAllThumbnailsToLoad() {
    const unloadedImages = getAllThumbs().map((thumb) => getImageFromThumb(thumb)).filter((image) => image instanceof HTMLImageElement).filter((image) => image.dataset.preload !== "true" && imageIsLoading(image));
    return Promise.all(unloadedImages.map((image) => new Promise((resolve) => {
      image.addEventListener("load", resolve, {
        once: true
      });
      image.addEventListener("error", resolve, {
        once: true
      });
    })));
  }
  function getIdFromThumb(thumb) {
    const id = thumb.getAttribute("id");
    if (id !== null) {
      return removeNonNumericCharacters(id);
    }
    const anchor = thumb.querySelector("a");
    if (anchor !== null && anchor.hasAttribute("id")) {
      return removeNonNumericCharacters(anchor.id);
    }
    if (anchor !== null && anchor.hasAttribute("href")) {
      const match2 = /id=(\d+)$/.exec(anchor.href);
      if (match2 !== null) {
        return match2[1];
      }
    }
    const image = thumb.querySelector("img");
    if (image === null) {
      return "NA";
    }
    const match = /\?(\d+)$/.exec(image.src);
    return match === null ? "NA" : match[1];
  }
  function scrollToTop() {
    window.scrollTo(0, ON_MOBILE_DEVICE ? 10 : 0);
  }
  function hasTagName(element, tagName) {
    return element instanceof HTMLElement && element.tagName !== void 0 && element.tagName.toLowerCase() === tagName;
  }
  function getRectDistance(rect1, rect2) {
    const x1 = rect1.left + rect1.width / 2;
    const y1 = rect1.top + rect1.height / 2;
    const x2 = rect2.left + rect2.width / 2;
    const y2 = rect2.top + rect2.height / 2;
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  }
  function toggleFullscreen() {
    const html = document.documentElement;
    if (document.fullscreenElement === null) {
      html.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }
  function overGalleryMenu(event) {
    if (!(event.target instanceof HTMLElement)) {
      return false;
    }
    return event.target.classList.contains(".gallery-sub-menu") || event.target.closest(".gallery-sub-menu") !== null;
  }
  function toggleGalleryMenuEnabled(value) {
    insertStyleHTML(`
        #gallery-menu {
          visibility: ${value ? "visible" : "hidden"} !important;
        }`, "enable-gallery-menu");
  }
  function showFullscreenIcon(svg, duration = 500) {
    const svgDocument = new DOMParser().parseFromString(svg, "image/svg+xml");
    const svgElement = svgDocument.documentElement;
    const svgOverlay = document.createElement("div");
    svgOverlay.classList.add("fullscreen-icon");
    svgOverlay.innerHTML = new XMLSerializer().serializeToString(svgElement);
    document.body.appendChild(svgOverlay);
    setTimeout(() => {
      svgOverlay.remove();
    }, duration);
  }
  function blurCurrentlyFocusedElement() {
    const activeElement = document.activeElement;
    if (activeElement instanceof HTMLElement) {
      activeElement.blur();
    }
  }
  function reloadWindow() {
    window.location.reload();
  }
  var EXIT_KEYS = /* @__PURE__ */ new Set(["Escape", "Delete", "Backspace"]);
  var NAVIGATION_KEYS = /* @__PURE__ */ new Set(["a", "A", "ArrowLeft", "d", "D", "ArrowRight"]);
  var FORWARD_NAVIGATION_KEYS = /* @__PURE__ */ new Set(["d", "D", "ArrowRight"]);
  var METADATA_COMPARATORS = /* @__PURE__ */ new Set([":", ":<", ":>"]);
  var SEARCHABLE_METADATA_METRICS = /* @__PURE__ */ new Set(["score", "width", "height", "id", "duration"]);
  var TAG_CATEGORIES = /* @__PURE__ */ new Set(["general", "artist", "unknown", "copyright", "character", "metadata"]);
  function isExitKey(value) {
    return EXIT_KEYS.has(value);
  }
  function isNavigationKey(value) {
    return NAVIGATION_KEYS.has(value);
  }
  function isForwardNavigationKey(value) {
    return FORWARD_NAVIGATION_KEYS.has(value);
  }
  function isSearchableMetadataMetric(value) {
    return SEARCHABLE_METADATA_METRICS.has(value);
  }
  function isMetadataComparator(value) {
    return METADATA_COMPARATORS.has(value);
  }
  function isTagCategory(value) {
    return TAG_CATEGORIES.has(value);
  }
  var FavoritesKeyboardEvent = class {
    key;
    originalEvent;
    isHotkey;
    constructor(event) {
      this.originalEvent = event;
      this.key = event.key.toLowerCase();
      this.isHotkey = isHotkeyEvent(event);
    }
  };
  function convertTouchEventToMouseEvent(touchEvent, type) {
    const touch = touchEvent.changedTouches[0];
    return new MouseEvent(type, {
      clientX: touch.clientX,
      clientY: touch.clientY,
      screenX: touch.screenX,
      screenY: touch.screenY,
      button: 0 /* LEFT */
    });
  }
  var FavoritesMouseEvent = class {
    originalEvent;
    leftClick;
    rightClick;
    middleClick;
    ctrlKey;
    shiftKey;
    thumb;
    insideOfThumb;
    constructor(event) {
      if (!(event instanceof MouseEvent)) {
        event = convertTouchEventToMouseEvent(event, "mousedown");
      }
      this.originalEvent = event;
      this.leftClick = event.button === 0 /* LEFT */;
      this.rightClick = event.button === 2 /* RIGHT */;
      this.middleClick = event.button === 1 /* MIDDLE */;
      this.ctrlKey = event.ctrlKey;
      this.shiftKey = event.shiftKey;
      this.thumb = getThumbUnderCursor(event);
      this.insideOfThumb = this.thumb !== null || insideOfThumb(this.originalEvent.target);
    }
  };
  var FavoritesWheelEvent = class {
    originalEvent;
    direction;
    constructor(event) {
      this.originalEvent = event;
      this.direction = event.deltaY > 0 ? "ArrowRight" : "ArrowLeft";
    }
    get isForward() {
      return isForwardNavigationKey(this.direction);
    }
  };
  var EventEmitter = class {
    listeners;
    oneTimeListeners;
    enabled;
    constructor(enabled = true) {
      this.listeners = /* @__PURE__ */ new Set();
      this.oneTimeListeners = /* @__PURE__ */ new Set();
      this.enabled = enabled;
    }
    get disabled() {
      return !this.enabled;
    }
    on(callback, options = void 0) {
      if (this.disabled) {
        return;
      }
      this.listeners.add(callback);
      if (options === void 0) {
        return;
      }
      if (options.once) {
        this.oneTimeListeners.add(callback);
      }
      if (options.signal) {
        options.signal.addEventListener("abort", () => {
          this.off(callback);
        });
      }
    }
    off(callback) {
      this.listeners.delete(callback);
    }
    emit(argument) {
      if (this.disabled) {
        return;
      }
      for (const callback of this.listeners.keys()) {
        callback(argument);
      }
      this.removeOneTimeListeners();
    }
    timeout(milliseconds) {
      return new Promise((resolve, reject) => {
        const timer2 = setTimeout(() => {
          this.off(listener);
          reject(new PromiseTimeoutError());
        }, milliseconds);
        const listener = (args) => {
          this.off(listener);
          clearTimeout(timer2);
          resolve(args);
        };
        this.on(listener, {
          once: true
        });
      });
    }
    toggle(value = void 0) {
      this.enabled = value === void 0 ? !this.enabled : value;
    }
    removeOneTimeListeners() {
      this.listeners = this.listeners.difference(this.oneTimeListeners);
      this.oneTimeListeners.clear();
    }
  };
  var FAVORITES_SEARCH_GALLERY_CONTAINER = document.createElement("div");
  FAVORITES_SEARCH_GALLERY_CONTAINER.id = "favorites-search-gallery";
  function insertFavoritesSearchGalleryContainer() {
    if (document.body !== null) {
      document.body.appendChild(FAVORITES_SEARCH_GALLERY_CONTAINER);
      return;
    }
    Events.document.domLoaded.on(() => {
      document.body.appendChild(FAVORITES_SEARCH_GALLERY_CONTAINER);
    }, { once: true });
  }
  var THRESHOLD = 90;
  var TOUCH_START = { x: 0, y: 0 };
  var TOUCH_END = { x: 0, y: 0 };
  function getXDelta() {
    return TOUCH_END.x - TOUCH_START.x;
  }
  function getYDelta() {
    return TOUCH_END.y - TOUCH_START.y;
  }
  function swipedDown() {
    return getYDelta() > THRESHOLD;
  }
  function swipedUp() {
    return getYDelta() < -THRESHOLD;
  }
  function swipedRight() {
    return getXDelta() > THRESHOLD;
  }
  function swipedLeft() {
    return getXDelta() < -THRESHOLD;
  }
  function onlySwipedDown() {
    return swipedDown() && !swipedUp() && !swipedLeft() && !swipedRight();
  }
  function onlySwipedUp() {
    return swipedUp() && !swipedDown() && !swipedLeft() && !swipedRight();
  }
  function onlySwipedRight() {
    return swipedRight() && !swipedLeft() && !swipedUp() && !swipedDown();
  }
  function onlySwipedLeft() {
    return swipedLeft() && !swipedRight() && !swipedUp() && !swipedDown();
  }
  function setTouchStart(event) {
    TOUCH_START.x = event.changedTouches[0].screenX;
    TOUCH_START.y = event.changedTouches[0].screenY;
  }
  function setTouchEnd(event) {
    TOUCH_END.x = event.changedTouches[0].screenX;
    TOUCH_END.y = event.changedTouches[0].screenY;
  }
  function onTouchEnd(event) {
    setTouchEnd(event);
    if (onlySwipedUp()) {
      Events.mobile.swipedUp.emit();
      return;
    }
    if (onlySwipedDown()) {
      Events.mobile.swipedDown.emit();
      return;
    }
    if (onlySwipedLeft()) {
      Events.mobile.swipedLeft.emit();
      return;
    }
    if (onlySwipedRight()) {
      Events.mobile.swipedRight.emit();
    }
  }
  function didSwipe() {
    return swipedDown() || swipedUp() || swipedLeft() || swipedRight();
  }
  function setupSwipeEvents() {
    Events.document.touchStart.on(setTouchStart);
    Events.document.touchEnd.on(onTouchEnd);
  }
  var timer;
  var THRESHOLD2 = 300;
  function stopHoldTimer() {
    if (timer !== void 0) {
      clearTimeout(timer);
      timer = void 0;
    }
  }
  function startHoldTimer(event) {
    if (timer === void 0) {
      timer = setTimeout(() => {
        Events.mobile.touchHold.emit(event);
      }, THRESHOLD2);
    }
  }
  function setupTouchHoldEvents() {
    Events.document.touchStart.on(startHoldTimer);
    Events.document.touchEnd.on(stopHoldTimer);
  }
  var CONTAINER = ON_FAVORITES_PAGE ? FAVORITES_SEARCH_GALLERY_CONTAINER : document.documentElement;
  var favorites = {
    searchStarted: new EventEmitter(true),
    searchBoxUpdated: new EventEmitter(true),
    pageChanged: new EventEmitter(true),
    pageSelected: new EventEmitter(true),
    relativePageSelected: new EventEmitter(true),
    findFavoriteStarted: new EventEmitter(true),
    findFavoriteInAllStarted: new EventEmitter(true),
    favoritesLoadedFromDatabase: new EventEmitter(true),
    favoritesLoaded: new EventEmitter(true),
    startedStoringAllFavorites: new EventEmitter(true),
    startedFetchingFavorites: new EventEmitter(true),
    searchResultsUpdated: new EventEmitter(true),
    favoriteRemoved: new EventEmitter(true),
    newFavoritesFoundOnReload: new EventEmitter(true),
    favoritesAddedToCurrentPage: new EventEmitter(true),
    missingMetadataFound: new EventEmitter(true),
    favoritesResized: new EventEmitter(true),
    captionsReEnabled: new EventEmitter(true),
    resultsPerPageChanged: new EventEmitter(true),
    allowedRatingsChanged: new EventEmitter(true),
    columnCountChanged: new EventEmitter(true),
    rowSizeChanged: new EventEmitter(true),
    layoutChanged: new EventEmitter(true),
    sortingMethodChanged: new EventEmitter(true),
    performanceProfileChanged: new EventEmitter(true),
    showOnHoverToggled: new EventEmitter(true),
    tooltipsToggled: new EventEmitter(true),
    autoplayToggled: new EventEmitter(true),
    hintsToggled: new EventEmitter(true),
    optionsToggled: new EventEmitter(true),
    removeButtonsToggled: new EventEmitter(true),
    addButtonsToggled: new EventEmitter(true),
    downloadButtonsToggled: new EventEmitter(true),
    uiToggled: new EventEmitter(true),
    darkThemeToggled: new EventEmitter(true),
    headerToggled: new EventEmitter(true),
    captionsToggled: new EventEmitter(true),
    sortAscendingToggled: new EventEmitter(true),
    galleryMenuToggled: new EventEmitter(true),
    blacklistToggled: new EventEmitter(true),
    infiniteScrollToggled: new EventEmitter(true),
    savedSearchesToggled: new EventEmitter(true),
    downloadButtonClicked: new EventEmitter(true),
    searchSubsetClicked: new EventEmitter(true),
    stopSearchSubsetClicked: new EventEmitter(true),
    invertButtonClicked: new EventEmitter(true),
    shuffleButtonClicked: new EventEmitter(true),
    searchButtonClicked: new EventEmitter(true),
    clearButtonClicked: new EventEmitter(true),
    resetButtonClicked: new EventEmitter(true),
    resetConfirmed: new EventEmitter(true)
  };
  var gallery = {
    favoriteToggled: new EventEmitter(true),
    showOnHoverToggled: new EventEmitter(true),
    enteredGallery: new EventEmitter(true),
    exitedGallery: new EventEmitter(true),
    visibleThumbsChanged: new EventEmitter(true),
    galleryMenuButtonClicked: new EventEmitter(true),
    videoEnded: new EventEmitter(true),
    videoDoubleClicked: new EventEmitter(true),
    rightTap: new EventEmitter(true),
    leftTap: new EventEmitter(true)
  };
  var caption = {
    idClicked: new EventEmitter(true),
    searchForTag: new EventEmitter(true)
  };
  var searchBox = {
    appendSearchBox: new EventEmitter(true)
  };
  var searchPage = {
    searchPageReady: new EventEmitter(true),
    layoutChanged: new EventEmitter(true),
    searchPageCreated: new EventEmitter(true),
    upscaleToggled: new EventEmitter(true),
    infiniteScrollToggled: new EventEmitter(true),
    moreResultsAdded: new EventEmitter(true),
    pageChanged: new EventEmitter(true)
  };
  var mobile = {
    swipedUp: new EventEmitter(true),
    swipedDown: new EventEmitter(true),
    swipedLeft: new EventEmitter(true),
    swipedRight: new EventEmitter(true),
    touchHold: new EventEmitter(true)
  };
  var tagModifier = {
    resetConfirmed: new EventEmitter(true)
  };
  var document1 = {
    domLoaded: new EventEmitter(true),
    postProcess: new EventEmitter(true),
    mouseover: new EventEmitter(true),
    click: new EventEmitter(true),
    mousedown: new EventEmitter(true),
    touchStart: new EventEmitter(true),
    touchEnd: new EventEmitter(true),
    keydown: new EventEmitter(true),
    keyup: new EventEmitter(true),
    wheel: new EventEmitter(true),
    contextmenu: new EventEmitter(true),
    mousemove: new EventEmitter(true)
  };
  var window1 = {
    focus: new EventEmitter(true),
    blur: new EventEmitter(true),
    orientationChange: new EventEmitter(true)
  };
  function setupDocumentEvents() {
    CONTAINER.addEventListener("click", (event) => {
      Events.document.click.emit(event);
    });
    CONTAINER.addEventListener("mousedown", (event) => {
      Events.document.mousedown.emit(event);
    });
    document.addEventListener("keydown", (event) => {
      Events.document.keydown.emit(new FavoritesKeyboardEvent(event));
    });
    document.addEventListener("keyup", (event) => {
      Events.document.keyup.emit(new FavoritesKeyboardEvent(event));
    });
    CONTAINER.addEventListener("mouseover", (event) => {
      Events.document.mouseover.emit(new FavoritesMouseEvent(event));
    }, { passive: true });
    CONTAINER.addEventListener("mousemove", (event) => {
      Events.document.mousemove.emit(event);
    }, { passive: true });
    document.addEventListener("wheel", (event) => {
      Events.document.wheel.emit(new FavoritesWheelEvent(event));
    }, { passive: true });
    CONTAINER.addEventListener("contextmenu", (event) => {
      Events.document.contextmenu.emit(event);
    });
    CONTAINER.addEventListener("touchstart", (event) => {
      Events.document.touchStart.emit(event);
    }, { passive: false });
    CONTAINER.addEventListener("touchend", (event) => {
      Events.document.touchEnd.emit(event);
    });
  }
  function setupWindowEvents() {
    window.addEventListener("focus", (event) => {
      window1.focus.emit(event);
    });
    window.addEventListener("blur", (event) => {
      window1.focus.emit(event);
    });
    window.addEventListener("orientationchange", (event) => {
      Events.window.orientationChange.emit(event);
    });
  }
  function setupMobileEvents() {
    if (ON_DESKTOP_DEVICE) {
      return;
    }
    setupTouchHoldEvents();
    setupSwipeEvents();
  }
  function toggleGlobalInputEvents(value) {
    for (const event of Object.values(Events.document)) {
      event.toggle(value);
    }
  }
  function broadcastDOMLoad() {
    document.addEventListener("DOMContentLoaded", () => {
      Events.document.domLoaded.emit();
    }, { once: true });
  }
  var Events = {
    favorites,
    gallery,
    caption,
    searchBox,
    searchPage,
    document: document1,
    window: window1,
    mobile,
    tagModifier,
    toggleGlobalInputEvents
  };
  function setupEvents() {
    broadcastDOMLoad();
    setupDocumentEvents();
    setupWindowEvents();
    setupMobileEvents();
  }
  function addAwesompleteToGlobalScope() {
    !function() {
      function t(t2) {
        const e2 = Array.isArray(t2) ? {
          label: t2[0],
          value: t2[1]
        } : typeof t2 === "object" && t2 != null && "label" in t2 && "value" in t2 ? t2 : {
          label: t2,
          value: t2
        };
        this.label = e2.label || e2.value, this.value = e2.value, this.type = e2.type;
      }
      function e(t2, e2, i2) {
        for (const n2 in e2) {
          const s2 = e2[n2], r2 = t2.input.getAttribute(`data-${n2.toLowerCase()}`);
          typeof s2 === "number" ? t2[n2] = parseInt(r2) : false === s2 ? t2[n2] = r2 !== null : s2 instanceof Function ? t2[n2] = null : t2[n2] = r2, t2[n2] || t2[n2] === 0 || (t2[n2] = n2 in i2 ? i2[n2] : s2);
        }
      }
      function i(t2, e2) {
        return typeof t2 === "string" ? (e2 || document).querySelector(t2) : t2 || null;
      }
      function n(t2, e2) {
        return o.call((e2 || document).querySelectorAll(t2));
      }
      function s() {
        n("input.awesomplete").forEach((t2) => {
          new r(t2);
        });
      }
      var r = function(t2, n2) {
        const s2 = this;
        this.isOpened = false, this.input = i(t2), this.input.setAttribute("autocomplete", "off"), this.input.setAttribute("aria-autocomplete", "list"), n2 = n2 || {}, e(this, {
          minChars: 2,
          maxItems: 20,
          autoFirst: false,
          data: r.DATA,
          filter: r.FILTER_CONTAINS,
          sort: false !== n2.sort && r.SORT_BYLENGTH,
          item: r.ITEM,
          replace: r.REPLACE
        }, n2), this.index = -1, this.container = i.create("div", {
          className: "awesomplete",
          around: t2
        }), this.ul = i.create("ul", {
          hidden: "hidden",
          inside: this.container
        }), this.status = i.create("span", {
          className: "visually-hidden",
          role: "status",
          "aria-live": "assertive",
          "aria-relevant": "additions",
          inside: this.container
        }), this._events = {
          input: {
            input: this.evaluate.bind(this),
            blur: this.close.bind(this, {
              reason: "blur"
            }),
            keypress(t3) {
              const e2 = t3.keyCode;
              if (s2.opened) {
                switch (e2) {
                  case 13:
                    if (s2.selected == true) {
                      t3.preventDefault();
                      s2.select();
                      break;
                    }
                  case 66:
                    break;
                  case 27:
                    s2.close({
                      reason: "esc"
                    });
                    break;
                }
              }
            },
            keydown(t3) {
              const e2 = t3.keyCode;
              if (s2.opened) {
                switch (e2) {
                  case 9:
                    if (s2.selected == true) {
                      t3.preventDefault();
                      s2.select();
                      break;
                    }
                  case 38:
                    t3.preventDefault();
                    s2.previous();
                    break;
                  case 40:
                    t3.preventDefault();
                    s2.next();
                    break;
                }
              }
            }
          },
          form: {
            submit: this.close.bind(this, {
              reason: "submit"
            })
          },
          ul: {
            mousedown(t3) {
              let e2 = t3.target;
              if (e2 !== this) {
                for (; e2 && !/li/i.test(e2.nodeName); ) e2 = e2.parentNode;
                e2 && t3.button === 0 && (t3.preventDefault(), s2.select(e2, t3.target));
              }
            }
          }
        }, i.bind(this.input, this._events.input), i.bind(this.input.form, this._events.form), i.bind(this.ul, this._events.ul), this.input.hasAttribute("list") ? (this.list = `#${this.input.getAttribute("list")}`, this.input.removeAttribute("list")) : this.list = this.input.getAttribute("data-list") || n2.list || [], r.all.push(this);
      };
      r.prototype = {
        set list(t2) {
          if (Array.isArray(t2)) this._list = t2;
          else if (typeof t2 === "string" && t2.indexOf(",") > -1) this._list = t2.split(/\s*,\s*/);
          else if ((t2 = i(t2)) && t2.children) {
            const e2 = [];
            o.apply(t2.children).forEach((t3) => {
              if (!t3.disabled) {
                const i2 = t3.textContent.trim(), n2 = t3.value || i2, s2 = t3.label || i2;
                n2 !== "" && e2.push({
                  label: s2,
                  value: n2
                });
              }
            }), this._list = e2;
          }
          document.activeElement === this.input && this.evaluate();
        },
        get selected() {
          return this.index > -1;
        },
        get opened() {
          return this.isOpened;
        },
        close(t2) {
          this.opened && (this.ul.setAttribute("hidden", ""), this.isOpened = false, this.index = -1, i.fire(this.input, "awesomplete-close", t2 || {}));
        },
        open() {
          this.ul.removeAttribute("hidden"), this.isOpened = true, this.autoFirst && this.index === -1 && this.goto(0), i.fire(this.input, "awesomplete-open");
        },
        destroy() {
          i.unbind(this.input, this._events.input), i.unbind(this.input.form, this._events.form);
          const t2 = this.container.parentNode;
          t2.insertBefore(this.input, this.container), t2.removeChild(this.container), this.input.removeAttribute("autocomplete"), this.input.removeAttribute("aria-autocomplete");
          const e2 = r.all.indexOf(this);
          e2 !== -1 && r.all.splice(e2, 1);
        },
        next() {
          const t2 = this.ul.children.length;
          this.goto(this.index < t2 - 1 ? this.index + 1 : t2 ? 0 : -1);
        },
        previous() {
          const t2 = this.ul.children.length, e2 = this.index - 1;
          this.goto(this.selected && e2 !== -1 ? e2 : t2 - 1);
        },
        goto(t2) {
          const e2 = this.ul.children;
          this.selected && e2[this.index].setAttribute("aria-selected", "false"), this.index = t2, t2 > -1 && e2.length > 0 && (e2[t2].setAttribute("aria-selected", "true"), this.status.textContent = e2[t2].textContent, this.ul.scrollTop = e2[t2].offsetTop - this.ul.clientHeight + e2[t2].clientHeight, i.fire(this.input, "awesomplete-highlight", {
            text: this.suggestions[this.index]
          }));
        },
        select(t2, e2) {
          if (t2 ? this.index = i.siblingIndex(t2) : t2 = this.ul.children[this.index], t2) {
            const n2 = this.suggestions[this.index];
            i.fire(this.input, "awesomplete-select", {
              text: n2,
              origin: e2 || t2
            }) && (this.replace(n2), this.close({
              reason: "select"
            }), i.fire(this.input, "awesomplete-selectcomplete", {
              text: n2
            }));
          }
        },
        evaluate() {
          const e2 = this, i2 = this.input.value;
          i2.length >= this.minChars && this._list.length > 0 ? (this.index = -1, this.ul.innerHTML = "", this.suggestions = this._list.map((n2) => {
            return new t(e2.data(n2, i2));
          }).filter((t2) => {
            return e2.filter(t2, i2);
          }), false !== this.sort && (this.suggestions = this.suggestions.sort(this.sort)), this.suggestions = this.suggestions.slice(0, this.maxItems), this.suggestions.forEach((t2) => {
            e2.ul.appendChild(e2.item(t2, i2));
          }), this.ul.children.length === 0 ? this.close({
            reason: "nomatches"
          }) : this.open()) : this.close({
            reason: "nomatches"
          });
        }
      }, r.all = [], r.FILTER_CONTAINS = function(t2, e2) {
        return RegExp(i.regExpEscape(e2.trim()), "i").test(t2);
      }, r.FILTER_STARTSWITH = function(t2, e2) {
        return RegExp(`^${i.regExpEscape(e2.trim())}`, "i").test(t2);
      }, r.SORT_BYLENGTH = function(t2, e2) {
        return t2.length !== e2.length ? t2.length - e2.length : t2 < e2 ? -1 : 1;
      }, r.ITEM = function(t2, e2) {
        return i.create("li", {
          innerHTML: e2.trim() === "" ? t2 : t2.replace(RegExp(i.regExpEscape(e2.trim()), "gi"), "<mark>$&</mark>"),
          "aria-selected": "false"
        });
      }, r.REPLACE = function(t2) {
        this.input.value = t2.value;
      }, r.DATA = function(t2) {
        return t2;
      }, Object.defineProperty(t.prototype = Object.create(String.prototype), "length", {
        get() {
          return this.label.length;
        }
      }), t.prototype.toString = t.prototype.valueOf = function() {
        return `${this.label}`;
      };
      var o = Array.prototype.slice;
      i.create = function(t2, e2) {
        const n2 = document.createElement(t2);
        for (const s2 in e2) {
          const r2 = e2[s2];
          if (s2 === "inside") i(r2).appendChild(n2);
          else if (s2 === "around") {
            const o2 = i(r2);
            o2.parentNode.insertBefore(n2, o2), n2.appendChild(o2);
          } else s2 in n2 ? n2[s2] = r2 : n2.setAttribute(s2, r2);
        }
        return n2;
      }, i.bind = function(t2, e2) {
        if (t2) for (const i2 in e2) {
          var n2 = e2[i2];
          i2.split(/\s+/).forEach((e3) => {
            t2.addEventListener(e3, n2);
          });
        }
      }, i.unbind = function(t2, e2) {
        if (t2) for (const i2 in e2) {
          var n2 = e2[i2];
          i2.split(/\s+/).forEach((e3) => {
            t2.removeEventListener(e3, n2);
          });
        }
      }, i.fire = function(t2, e2, i2) {
        const n2 = document.createEvent("HTMLEvents");
        n2.initEvent(e2, true, true);
        for (const s2 in i2) n2[s2] = i2[s2];
        return t2.dispatchEvent(n2);
      }, i.regExpEscape = function(t2) {
        return t2.replace(/[-\\^$*+?.()|[\]{}]/g, "\\$&");
      }, i.siblingIndex = function(t2) {
        for (var e2 = 0; t2 = t2.previousElementSibling; e2++) ;
        return e2;
      }, typeof Document !== "undefined" && (document.readyState !== "loading" ? s() : document.addEventListener("DOMContentLoaded", s)), r.$ = i, r.$$ = n, typeof self !== "undefined" && (self.Awesomplete_ = r), typeof module === "object" && module.exports;
    }();
  }
  var IMAGE_SOURCE_CLEANUP_REGEX = /^([^.]*\/\/)?(?:[^.]+\.)*rule34/;
  var THUMB_SOURCE_COMPRESSION_REGEX = /thumbnails\/+([0-9]+)\/+thumbnail_([0-9a-f]+)/;
  var SAMPLE_REGEX = /\/([^/]+)$/;
  var EXTENSION_REGEX = /\.(png|jpg|jpeg|gif|mp4)/;
  function cleanImageSource(source) {
    return source.replace(IMAGE_SOURCE_CLEANUP_REGEX, "$1rule34");
  }
  function decompressPreviewSource(compressedSource) {
    const splitSource = compressedSource.split("_");
    return `https://wimg.rule34.xxx/thumbnails//${splitSource[0]}/thumbnail_${splitSource[1]}.jpg`;
  }
  function compressPreviewSource(source) {
    const match = source.match(THUMB_SOURCE_COMPRESSION_REGEX);
    return match === null ? "" : match.splice(1).join("_");
  }
  function convertPreviewURLToImageURL(thumbURL) {
    return cleanImageSource(thumbURL).replace("thumbnails", "images").replace("thumbnail_", "").replace("us.rule34", "rule34");
  }
  function convertImageURLToSampleURL(imageURL) {
    return imageURL.replace("images", "samples").replace(SAMPLE_REGEX, "/sample_$1").replace(EXTENSION_REGEX, ".jpg");
  }
  function removeIdFromImageURL(imageURL) {
    return imageURL.replace(/\?\d+/, "");
  }
  function createEmptyPost() {
    return {
      id: "",
      height: 0,
      score: 0,
      fileURL: "",
      parentId: "",
      sampleURL: "",
      sampleWidth: 0,
      sampleHeight: 0,
      previewURL: "",
      rating: "",
      tags: "",
      width: 0,
      change: 0,
      md5: "",
      creatorId: "",
      hasChildren: false,
      createdAt: "",
      status: "",
      source: "",
      hasNotes: false,
      hasComments: false,
      previewWidth: 0,
      previewHeight: 0
    };
  }
  function createPostFromRawFavorite(object) {
    if (object instanceof HTMLElement) {
      return createPostFromFavoritesPageThumb(object);
    }
    return createPostFromDatabaseRecord(object);
  }
  function clearPost(post) {
    post.id = "";
    post.height = 0;
    post.score = 0;
    post.fileURL = "";
    post.parentId = "";
    post.sampleURL = "";
    post.sampleWidth = 0;
    post.sampleHeight = 0;
    post.previewURL = "";
    post.rating = "";
    post.tags = "";
    post.width = 0;
    post.change = 0;
    post.md5 = "";
    post.creatorId = "";
    post.hasChildren = false;
    post.createdAt = "";
    post.status = "";
    post.source = "";
    post.hasNotes = false;
    post.hasComments = false;
    post.previewWidth = 0;
    post.previewHeight = 0;
  }
  function createPostFromDatabaseRecord(record) {
    const post = createEmptyPost();
    post.id = record.id;
    post.height = record.metadata.height;
    post.width = record.metadata.width;
    post.previewURL = decompressPreviewSource(record.src);
    return post;
  }
  function createPostFromFavoritesPageThumb(element) {
    const post = createEmptyPost();
    post.id = getIdFromThumb(element);
    const image = getImageFromThumb(element);
    if (image === null) {
      return post;
    }
    const source = image.src || image.getAttribute("data-cfsrc") || "";
    post.previewURL = source;
    post.tags = preprocessTags(image, post.id);
    return post;
  }
  function preprocessTags(image, id) {
    if (image === null) {
      return "";
    }
    const tags = image.title || image.getAttribute("tags") || "";
    const tagsWithIdAdded = `${tags} ${id}`;
    return removeExtraWhiteSpace(tagsWithIdAdded).split(" ").sort().join(" ");
  }
  var ApiParseError = class extends Error {
  };
  var PARSER = new DOMParser();
  function parseNumber(attribute, post) {
    return Number(post.getAttribute(attribute) ?? 0);
  }
  function parseString(attribute, post) {
    return String(post.getAttribute(attribute) ?? "");
  }
  function parseBoolean(attribute, post) {
    return post.getAttribute(attribute) === "true";
  }
  function createPostFromAPIElement(element) {
    return {
      id: parseString("id", element),
      height: parseNumber("height", element),
      score: parseNumber("score", element),
      fileURL: parseString("file_url", element),
      parentId: parseString("parent_id", element),
      sampleURL: parseString("sample_url", element),
      sampleWidth: parseNumber("sample_width", element),
      sampleHeight: parseNumber("sample_height", element),
      previewURL: parseString("preview_url", element),
      rating: parseString("rating", element),
      tags: parseString("tags", element),
      width: parseNumber("width", element),
      change: parseNumber("change", element),
      md5: parseString("md5", element),
      creatorId: parseString("creator_id", element),
      hasChildren: parseBoolean("has_children", element),
      createdAt: parseString("created_at", element),
      status: parseString("status", element),
      source: parseString("source", element),
      hasNotes: parseBoolean("has_notes", element),
      hasComments: parseBoolean("has_comments", element),
      previewWidth: parseNumber("preview_width", element),
      previewHeight: parseNumber("preview_height", element)
    };
  }
  function extractPostFromAPI(html) {
    const post = PARSER.parseFromString(html, "text/html").querySelector("post");
    if (post === null) {
      throw new ApiParseError();
    }
    return createPostFromAPIElement(post);
  }
  function extractPostFromAPISafe(html) {
    try {
      return extractPostFromAPI(html);
    } catch {
      return createEmptyPost();
    }
  }
  var ConcurrencyLimiter = class {
    constructor(limit) {
      this.limit = limit;
    }
    activeCount = 0;
    queue = [];
    async run(fn) {
      if (this.activeCount >= this.limit) {
        await new Promise((resolve) => this.queue.push(resolve));
      }
      this.activeCount += 1;
      try {
        return await fn();
      } finally {
        this.activeCount -= 1;
        if (this.queue.length > 0) {
          this.queue.shift()();
        }
      }
    }
    async runAll(items, task) {
      const results = new Array(items.length);
      await Promise.all(items.map((item, i) => this.run(async () => {
        results[i] = await task(item, i);
      })));
      return results;
    }
  };
  var FavoritesSettings = {
    resultsPerPageBounds: {
      min: 1,
      max: 1e4
    },
    favoritesPageFetchDelay: 200,
    resultsPerPageStep: 25,
    maxPageNumberButtons: ON_MOBILE_DEVICE ? 5 : 5,
    useSearchIndex: true,
    buildIndexAsynchronously: true,
    infiniteScrollBatchSize: 25,
    infiniteScrollPreloadCount: 100,
    favoriteFinderEnabled: false,
    bottomNavigationButtonsEnabled: false,
    fetchMultiplePostWhileFetchingFavorites: true
  };
  var PARSER2 = new DOMParser();
  function extractFavoritesCount(html) {
    const favoritesURL = Array.from(PARSER2.parseFromString(html, "text/html").querySelectorAll("a")).find((a) => a.href.includes("page=favorites&s=view"));
    if (favoritesURL === void 0 || favoritesURL.textContent === null) {
      return 0;
    }
    return parseInt(favoritesURL.textContent);
  }
  var PARSER3 = new DOMParser();
  var PARSER4 = new DOMParser();
  var STATISTICS_REGEX = /(\S+):\s+(\S+)/g;
  function getStatistics(dom) {
    const stats = dom.querySelector("#stats");
    if (stats === null) {
      return {};
    }
    const textContent = removeExtraWhiteSpace(stats.textContent || "");
    const matches = Array.from(textContent.matchAll(STATISTICS_REGEX));
    const entries = matches.map((match) => [match[1].toLowerCase(), match[2]]);
    return Object.fromEntries(entries);
  }
  function getFileURL(dom) {
    const image = dom.querySelector("#image");
    return image instanceof HTMLImageElement ? cleanImageSource(image.src) : "";
  }
  function getTags(dom) {
    return removeExtraWhiteSpace(Array.from(dom.querySelectorAll(".tag>a")).filter((anchor) => anchor instanceof HTMLAnchorElement && anchor.textContent !== "?").map((anchor) => (anchor.textContent || "").replaceAll(" ", "_")).join(" ") || "");
  }
  function getRating(statistics) {
    if (statistics.rating === void 0 || statistics.rating === "") {
      return "e";
    }
    return statistics.rating.charAt(0).toLowerCase();
  }
  function hasComments(dom) {
    return Array.from(dom.querySelectorAll("#comments>div")).length > 0;
  }
  function parsePostFromPostPage(html) {
    const dom = PARSER4.parseFromString(html, "text/html");
    const statistics = getStatistics(dom);
    const fileURL = getFileURL(dom);
    const tags = getTags(dom);
    const rating = getRating(statistics);
    const dimensions = getDimensions2D(statistics.size);
    const hasNotes = statistics.notes !== void 0 && statistics.notes !== "0";
    const hasCommentsValue = hasComments(dom);
    return {
      id: statistics.id,
      height: dimensions.height,
      score: Number(statistics.score),
      fileURL,
      parentId: "",
      sampleURL: "",
      sampleWidth: 0,
      sampleHeight: 0,
      previewURL: "",
      rating,
      tags,
      width: dimensions.width,
      change: 0,
      md5: "",
      creatorId: "",
      hasChildren: false,
      createdAt: statistics.posted,
      status: "active",
      source: statistics.source,
      hasNotes,
      hasComments: hasCommentsValue,
      previewWidth: 0,
      previewHeight: 0
    };
  }
  var USER_ID = getUserId();
  var POST_PAGE_LIMITER = new ConcurrencyLimiter(1);
  var MULTI_POST_LIMITER = new ConcurrencyLimiter(4);
  var POST_LIMITER = new ConcurrencyLimiter(250);
  var TAG_LIMITER = new ConcurrencyLimiter(100);
  var FAVORITES_PAGE_LIMITER = new ConcurrencyLimiter(2);
  async function getHTML(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    return response.text();
  }
  function fetchPostFromAPI(id) {
    return POST_LIMITER.run(async () => {
      return extractPostFromAPI(await getHTML(createPostAPIURL(id)));
    });
  }
  function fetchPostFromAPISafe(id) {
    return fetchPostFromAPI(id).catch(() => {
      return fetchPostFromPostPage(id);
    });
  }
  function fetchMultiplePostsFromAPIInOne(ids) {
    return MULTI_POST_LIMITER.run(async () => {
      const response = await fetch(MULTI_POST_API_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids, userId: USER_ID }) });
      const data = await response.json();
      const result = {};
      for (const [id, html] of Object.entries(data)) {
        result[id] = extractPostFromAPISafe(html);
      }
      return result;
    });
  }
  function fetchMultiplePostsFromAPIIteratively(ids) {
    const result = {};
    return Promise.all(ids.map(async (id) => {
      result[id] = await fetchPostFromAPI(id);
    })).then(() => {
      return result;
    });
  }
  function fetchMultiplePostsFromAPI(ids) {
    if (FavoritesSettings.fetchMultiplePostWhileFetchingFavorites) {
      return fetchMultiplePostsFromAPIInOne(ids);
    }
    return fetchMultiplePostsFromAPIIteratively(ids);
  }
  async function fetchMultiplePostsFromAPISafe(ids) {
    const posts = await fetchMultiplePostsFromAPI(ids);
    for (const [id, post] of Object.entries(posts)) {
      if (post.width === 0 && post.height === 0) {
        posts[id] = await fetchPostFromPostPage(id);
      }
    }
    return posts;
  }
  function fetchPostPage(id) {
    return POST_PAGE_LIMITER.run(async () => {
      await sleep(200);
      return getHTML(createPostPageURL(id));
    });
  }
  async function fetchPostFromPostPage(id) {
    return parsePostFromPostPage(await fetchPostPage(id));
  }
  function fetchFavoritesPage(pageNumber) {
    return getHTML(createFavoritesPageURL(pageNumber));
  }
  function fetchTagFromAPI(tagName) {
    return TAG_LIMITER.run(() => {
      return getHTML(createTagAPIURL(tagName));
    });
  }
  async function addFavorite(id) {
    fetch(createPostVoteURL(id));
    const status = await getHTML(createAddFavoriteURL(id));
    return parseInt(status);
  }
  function removeFavorite(id) {
    return fetch(createRemoveFavoriteURL(id), { method: "GET", redirect: "manual" });
  }
  function getFavoritesCount(id) {
    return getHTML(createProfilePageURL(id)).then(extractFavoritesCount).catch(null);
  }
  function pingServer() {
    fetch(getServerTestURL());
  }
  var CUSTOM_TAGS = loadCustomTags();
  var PARSER5 = new DOMParser();
  function loadCustomTags() {
    return new Set(JSON.parse(localStorage.getItem("customTags") || "[]"));
  }
  async function setCustomTags(tags) {
    for (const tag of removeExtraWhiteSpace(tags).split(" ")) {
      if (tag === "" || CUSTOM_TAGS.has(tag)) {
        continue;
      }
      const isAnOfficialTag = await isOfficialTag(tag);
      if (!isAnOfficialTag) {
        CUSTOM_TAGS.add(tag);
      }
    }
    localStorage.setItem("customTags", JSON.stringify(Array.from(CUSTOM_TAGS)));
  }
  function clearCustomTags() {
    CUSTOM_TAGS.clear();
    localStorage.removeItem("customTags");
  }
  async function isOfficialTag(tagName) {
    try {
      const html = await fetchTagFromAPI(tagName);
      const dom = PARSER5.parseFromString(html, "text/html");
      const columnOfFirstRow = dom.getElementsByClassName("highlightable")[0].getElementsByTagName("td");
      return columnOfFirstRow.length === 3;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  function addCustomTagsToAutocomplete(officialTags, searchQuery2) {
    const customTags = Array.from(CUSTOM_TAGS);
    const officialTagValues = new Set(officialTags.map((officialTag) => officialTag.value));
    const mergedTags = officialTags;
    for (const customTag of customTags) {
      if (!officialTagValues.has(customTag) && customTag.startsWith(searchQuery2)) {
        mergedTags.unshift({
          label: `${customTag} (custom)`,
          value: customTag,
          type: "custom"
        });
      }
    }
    return mergedTags;
  }
  var DEFAULT_BOUNDARIES = { start: 0, end: 0 };
  function isNegatedLeftTagBoundary(text, index) {
    return text[index] === "-" && (text[index - 1] === " " || text[index - 1] === void 0);
  }
  function isLeftTagBoundary(text, index) {
    return index < 0 || text[index] === " " || isNegatedLeftTagBoundary(text, index);
  }
  function isRightTagBoundary(text, index) {
    return index >= text.length || text[index] === " ";
  }
  function getLeftTagBoundary(selectionStart, text) {
    let boundary = selectionStart - 1;
    while (!isLeftTagBoundary(text, boundary)) {
      boundary -= 1;
    }
    return boundary + 1;
  }
  function getRightTagBoundary(selectionStart, text) {
    let boundary = selectionStart;
    while (!isRightTagBoundary(text, boundary)) {
      boundary += 1;
    }
    return boundary;
  }
  function getTagBoundary(text, selectionStart) {
    if (selectionStart < 0 || selectionStart > text.length || text.length === 0) {
      return DEFAULT_BOUNDARIES;
    }
    return {
      start: getLeftTagBoundary(selectionStart, text),
      end: getRightTagBoundary(selectionStart, text)
    };
  }
  function getQueryWithTagReplaced(text, selectionStart, replacement) {
    if (selectionStart < 0 || selectionStart > text.length) {
      return { result: text, selectionStart };
    }
    const { start, end } = getTagBoundary(text, selectionStart);
    const firstHalf = text.slice(0, start);
    const secondHalf = text.slice(end, text.length);
    const result = `${firstHalf}${replacement}${secondHalf}`;
    return {
      result,
      selectionStart: firstHalf.length + replacement.length
    };
  }
  function getSavedSearches() {
    return Array.from(document.getElementsByClassName("save-search-label")).filter((element) => element instanceof HTMLElement).map((element) => element.innerText);
  }
  var SUGGESTION_LIMIT = 5;
  var MIN_TAG_LENGTH = 3;
  function getSavedSearchTagList(savedSearch) {
    return removeExtraWhiteSpace(savedSearch.replace(/[~())]/g, "")).split(" ");
  }
  function createAwesompleteSuggestion(searchTag, savedSearch) {
    return {
      label: savedSearch,
      value: `${searchTag}_saved_search ${savedSearch}`,
      type: "saved"
    };
  }
  function savedSearchMatchesSearchTag(searchTag, savedSearch) {
    return getSavedSearchTagList(savedSearch).some((tag) => tag.startsWith(searchTag));
  }
  function getSavedSearchesSuggestions(searchTag) {
    if (searchTag.length < MIN_TAG_LENGTH) {
      return [];
    }
    return getSavedSearches().filter((savedSearch) => savedSearchMatchesSearchTag(searchTag, savedSearch)).slice(0, SUGGESTION_LIMIT).map((savedSearch) => createAwesompleteSuggestion(searchTag, savedSearch));
  }
  function getAwesompleteFromInput(input2) {
    const awesomplete = input2.parentElement;
    if (awesomplete === null || awesomplete.className !== "awesomplete") {
      return null;
    }
    return awesomplete;
  }
  function hideAwesomplete(input2) {
    const awesomplete = getAwesompleteFromInput(input2);
    if (awesomplete !== null) {
      awesomplete.querySelector("ul")?.setAttribute("hidden", "");
    }
  }
  function awesompleteIsVisible(input2) {
    const awesomplete = getAwesompleteFromInput(input2);
    if (awesomplete === null) {
      return false;
    }
    const awesompleteSuggestions = awesomplete.querySelector("ul");
    return awesompleteSuggestions !== null && !awesompleteSuggestions.hasAttribute("hidden");
  }
  function awesompleteIsUnselected(input2) {
    const awesomplete = getAwesompleteFromInput(input2);
    if (awesomplete === null) {
      return true;
    }
    if (!awesompleteIsVisible(input2)) {
      return true;
    }
    const searchSuggestions = Array.from(awesomplete.querySelectorAll("li"));
    if (searchSuggestions.length === 0) {
      return true;
    }
    const somethingIsSelected = searchSuggestions.map((li) => li.getAttribute("aria-selected")).some((element) => element === "true");
    return !somethingIsSelected;
  }
  var DUMMY_ELEMENT = document.createElement("div");
  var AUTOCOMPLETE_API_URL = "https://ac.rule34.xxx/autocomplete.php?q=";
  function decodeEntities(encodedString) {
    encodedString = encodedString.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, "");
    encodedString = encodedString.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, "");
    encodedString = encodedString.replace(/\w+_saved_search\s*/, "");
    DUMMY_ELEMENT.innerHTML = encodedString;
    encodedString = DUMMY_ELEMENT.textContent ?? "";
    DUMMY_ELEMENT.textContent = "";
    return encodedString;
  }
  function getAutocompleteSuggestions(prefix) {
    return getHTML(`${AUTOCOMPLETE_API_URL}${prefix}`);
  }
  function getFinalAutocompleteSuggestions(html, prefix) {
    const suggestions = addCustomTagsToAutocomplete(JSON.parse(html), prefix);
    return Preferences.savedSearchSuggestionsEnabled.value ? suggestions.concat(getSavedSearchesSuggestions(prefix)) : suggestions;
  }
  async function populateAwesompleteList(inputId, prefix, awesomplete) {
    if (isEmptyString(prefix)) {
      return;
    }
    prefix = removeLeadingHyphens(prefix);
    const html = await getAutocompleteSuggestions(prefix);
    awesomplete.list = getFinalAutocompleteSuggestions(html, prefix);
  }
  function getCurrentTag(input2) {
    return getLastTag(input2.value.slice(0, input2.selectionStart ?? 0));
  }
  function getLastTag(searchQuery2) {
    const lastTag = searchQuery2.match(/[^ -]\S*$/);
    return lastTag === null ? "" : lastTag[0];
  }
  function getLastTagWithHyphen(searchQuery2) {
    const lastTag = searchQuery2.match(/[^ ]*$/);
    return lastTag === null ? "" : lastTag[0];
  }
  function getCurrentTagWithHyphen(input2) {
    const selectionStart = input2.selectionStart ?? void 0;
    return getLastTagWithHyphen(input2.value.slice(0, selectionStart));
  }
  function insertSuggestion(input2, suggestion) {
    const result = getQueryWithTagReplaced(input2.value, input2.selectionStart ?? -1, suggestion);
    input2.value = result.result;
    input2.selectionStart = result.selectionStart;
    input2.selectionEnd = result.selectionStart;
  }
  function createAwesompleteInstance(input2) {
    const awesomplete = new Awesomplete_(input2, {
      minChars: 1,
      list: [],
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      filter: (suggestion, _) => {
        return Awesomplete_.FILTER_STARTSWITH(suggestion.value, getCurrentTag(awesomplete.input).replaceAll("*", ""));
      },
      sort: false,
      item: (suggestion, tags) => {
        const html = isEmptyString(tags) ? suggestion.label : suggestion.label.replace(RegExp(Awesomplete_.$.regExpEscape(tags.trim()), "gi"), "<mark>$&</mark>");
        return Awesomplete_.$.create("li", {
          innerHTML: html,
          "aria-selected": "false",
          className: `tag-type-${suggestion.type}`
        });
      },
      replace: (suggestion) => {
        insertSuggestion(awesomplete.input, decodeEntities(suggestion.value));
        Events.favorites.searchBoxUpdated.emit();
      }
    });
    return awesomplete;
  }
  function addAwesompleteToInput(input2) {
    addEventListenersToInput(input2, createAwesompleteInstance(input2));
  }
  function addEventListenersToInput(input2, awesomplete) {
    input2.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "Tab":
          if (!awesomplete.isOpened || awesomplete.suggestions.length === 0) {
            return;
          }
          awesomplete.next();
          awesomplete.select();
          event.preventDefault();
          break;
        case "Escape":
          hideAwesomplete(input2);
          break;
        default:
          break;
      }
    });
    input2.oninput = () => {
      populateAwesompleteList(input2.id, getCurrentTagWithHyphen(input2), awesomplete);
    };
  }
  function addAwesompleteToAllInputs() {
    for (const input2 of document.querySelectorAll("textarea, input[needs-autocomplete]")) {
      addAwesompleteToInput(input2);
    }
  }
  function setupAutocomplete() {
    if (AUTOCOMPLETE_DISABLED) {
      return;
    }
    addAwesompleteToGlobalScope();
    addAwesompleteToAllInputs();
  }
  var BatchExecutor = class {
    limit;
    timeout;
    executor;
    pollingInterval;
    lastAddTime = 0;
    poller = void 0;
    batch = [];
    constructor(limit, timeout, executor) {
      this.limit = limit;
      this.timeout = timeout;
      this.executor = executor;
      this.pollingInterval = this.getPollingInterval();
    }
    get overLimit() {
      return this.batch.length >= this.limit;
    }
    get timeSinceLastAdd() {
      return performance.now() - this.lastAddTime;
    }
    get overTimeout() {
      return this.timeSinceLastAdd >= this.timeout;
    }
    add(item) {
      this.batch.push(item);
      this.lastAddTime = performance.now();
      if (this.overLimit) {
        this.execute();
        return;
      }
      if (this.poller !== void 0) {
        return;
      }
      this.poller = setInterval(() => {
        if (this.overTimeout) {
          this.execute();
        }
      }, this.pollingInterval);
    }
    reset() {
      clearInterval(this.poller);
      this.poller = void 0;
      this.batch = [];
    }
    execute() {
      this.executor(this.batch);
      this.reset();
    }
    getPollingInterval() {
      return Math.round(Math.max(10, this.timeout / 5));
    }
  };
  var LockedDatabaseError = class extends Error {
  };
  var Database = class {
    name;
    defaultObjectStoreName;
    version;
    locked;
    constructor(name, defaultObjectStoreName, version = 1) {
      this.name = name;
      this.defaultObjectStoreName = defaultObjectStoreName;
      this.version = version;
      this.locked = false;
    }
    async load(objectStoreName = void 0) {
      const database = await this.open(objectStoreName ?? this.defaultObjectStoreName);
      return this.getAllRecords(database, objectStoreName ?? this.defaultObjectStoreName);
    }
    async store(records, objectStoreName = void 0) {
      if (this.locked) {
        return Promise.reject(new LockedDatabaseError());
      }
      objectStoreName = objectStoreName ?? this.defaultObjectStoreName;
      const database = await this.open(objectStoreName);
      const transaction = database.transaction(objectStoreName, "readwrite");
      const objectStore = transaction.objectStore(objectStoreName);
      return new Promise((resolve, reject) => {
        transaction.onerror = reject;
        records.forEach((record) => this.putRecord(objectStore, record));
        transaction.oncomplete = () => {
          database.close();
          resolve();
        };
      });
    }
    async update(records, objectStoreName = void 0) {
      if (this.locked) {
        return Promise.reject(new LockedDatabaseError());
      }
      objectStoreName = objectStoreName ?? this.defaultObjectStoreName;
      const database = await this.open(objectStoreName);
      const transaction = database.transaction(objectStoreName, "readwrite");
      const objectStore = transaction.objectStore(objectStoreName);
      const index = objectStore.index("id");
      return new Promise((resolve, reject) => {
        transaction.onerror = reject;
        records.forEach((record) => {
          this.updateRecord(index, record, objectStore);
          transaction.oncomplete = () => {
            database.close();
            resolve();
          };
        });
      });
    }
    async deleteRecords(ids, objectStoreName = void 0) {
      objectStoreName = objectStoreName || this.defaultObjectStoreName;
      const database = await this.open(objectStoreName);
      const transaction = database.transaction(objectStoreName, "readwrite");
      const objectStore = transaction.objectStore(objectStoreName);
      const index = objectStore.index("id");
      for (const id of ids) {
        await this.deleteRecord(index, id, objectStore);
      }
    }
    async delete() {
      this.lock();
      await yield1();
      indexedDB.deleteDatabase(this.name);
    }
    updateRecord(index, record, objectStore) {
      index.getKey(record.id).onsuccess = (indexEvent) => {
        const target = indexEvent.target;
        this.putRecord(objectStore, record, target.result);
      };
    }
    putRecord(objectStore, record, key = void 0) {
      if (this.locked) {
        throw new LockedDatabaseError();
      }
      objectStore.put(record, key);
    }
    deleteRecord(index, id, objectStore) {
      return new Promise((resolve) => {
        const request = index.getKey(id);
        request.onsuccess = (event) => {
          const target = event.target;
          const primaryKey = target.result;
          if (primaryKey !== void 0) {
            objectStore.delete(primaryKey);
          }
          resolve();
        };
        request.onerror = () => {
          console.error(request.error);
          resolve();
        };
      });
    }
    open(objectStoreName) {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.name, this.version);
        request.onsuccess = () => {
          const database = request.result;
          if (!database.objectStoreNames.contains(objectStoreName)) {
            database.close();
            this.version += 1;
            this.open(objectStoreName).then(resolve, reject);
            return;
          }
          resolve(database);
        };
        request.onupgradeneeded = () => this.createObjectStore(request.result, objectStoreName);
        request.onerror = () => {
          if (request.error instanceof DOMException && request.error.name === "VersionError") {
            this.version += 1;
            this.open(objectStoreName).then(resolve, reject);
            return;
          }
          reject(request.error);
        };
      });
    }
    getAllRecords(database, objectStoreName) {
      const transaction = database.transaction(objectStoreName, "readwrite");
      const objectStore = transaction.objectStore(objectStoreName);
      return new Promise((resolve, reject) => {
        transaction.onerror = (event) => {
          reject(event);
        };
        const getAllRequest = objectStore.getAll();
        getAllRequest.onsuccess = () => {
          database.close();
          resolve(getAllRequest.result.reverse());
        };
        getAllRequest.onerror = (event) => {
          database.close();
          reject(event);
        };
      });
    }
    createObjectStore(database, objectStoreName) {
      if (database.objectStoreNames.contains(objectStoreName)) {
        return;
      }
      const objectStore = database.createObjectStore(objectStoreName, {
        autoIncrement: true
      });
      objectStore.createIndex("id", "id", {
        unique: true
      });
    }
    lock() {
      this.locked = true;
    }
    unlock() {
      this.locked = false;
    }
  };
  var METRIC_PATTERN = Array.from(SEARCHABLE_METADATA_METRICS).join("|");
  var FavoriteMetadataSearchExpression = class _FavoriteMetadataSearchExpression {
    static regex = new RegExp(`^-?(${METRIC_PATTERN})(:[<>]?)(\\d+|${METRIC_PATTERN})$`);
    metric;
    operator;
    hasRightHandMetric;
    rightHandMetric;
    rightHandValue;
    constructor(searchTag) {
      const extractedExpression = this.extractExpression(searchTag);
      const value = extractedExpression.value;
      this.metric = extractedExpression.metric;
      this.operator = extractedExpression.operator;
      if (isSearchableMetadataMetric(value)) {
        this.hasRightHandMetric = true;
        this.rightHandMetric = value;
        this.rightHandValue = 0;
      } else {
        this.hasRightHandMetric = false;
        this.rightHandMetric = "id";
        this.rightHandValue = value;
      }
    }
    extractExpression(searchTag) {
      const extractedExpression = _FavoriteMetadataSearchExpression.regex.exec(searchTag);
      if (extractedExpression === null || extractedExpression.length !== 4) {
        return {
          metric: "width",
          operator: ":",
          value: 0
        };
      }
      const metric = isSearchableMetadataMetric(extractedExpression[1]) ? extractedExpression[1] : "id";
      const operator = isMetadataComparator(extractedExpression[2]) ? extractedExpression[2] : ":";
      const value = isSearchableMetadataMetric(extractedExpression[3]) ? extractedExpression[3] : Number(extractedExpression[3]);
      return {
        metric,
        operator,
        value
      };
    }
  };
  var SearchTag = class {
    value;
    negated;
    originalMatches;
    constructor(searchTag) {
      this.negated = searchTag.startsWith("-") && searchTag.length > 1;
      this.value = this.negated ? searchTag.substring(1) : searchTag;
      this.originalMatches = this.matches;
      this.matches = this.negated ? this.matchesNegated : this.matches;
    }
    get finalCost() {
      return this.negated ? this.cost + 1 : this.cost;
    }
    get cost() {
      return 0;
    }
    matches(item) {
      return item.tags.has(this.value);
    }
    matchesNegated(item) {
      return !this.originalMatches(item);
    }
  };
  var MetadataSearchTag = class extends SearchTag {
    expression;
    constructor(searchTag) {
      super(searchTag);
      this.expression = new FavoriteMetadataSearchExpression(this.value);
    }
    get cost() {
      return 0;
    }
    matches(item) {
      const { metric, operator, value } = this.getExpressionValues(item);
      switch (operator) {
        case ":":
          return metric === value;
        case ":<":
          return metric < value;
        case ":>":
          return metric > value;
        default:
          return false;
      }
    }
    getExpressionValues(item) {
      const metricItem = item;
      const metric = metricItem.metrics[this.expression.metric];
      const operator = this.expression.operator;
      const value = this.expression.hasRightHandMetric ? metricItem.metrics[this.expression.rightHandMetric] : this.expression.rightHandValue;
      return { metric, operator, value };
    }
  };
  var UNMATCHABLE_REGEX = /^\b$/;
  var STARTS_WITH_REGEX = /^[^*]*\*$/;
  var CONTAINS_REGEX = /^\*[^*]*\*$/;
  var WildcardSearchTag = class extends SearchTag {
    getMatchingTags;
    matchRegex;
    matchType;
    startsWithPrefix;
    containsSubstring;
    constructor(searchTag) {
      super(searchTag);
      this.value = this.removeDuplicateAsterisks(this.value);
      this.matchRegex = this.createWildcardRegex();
      this.startsWithPrefix = this.value.slice(0, -1);
      this.containsSubstring = this.value.slice(1, -1);
      this.matchType = this.getMatchType();
      this.matches = this.getMatchFunction();
      this.getMatchingTags = this.getMatchingTagsFunction();
    }
    get cost() {
      return this.matchType.valueOf();
    }
    matchesSingleTag(tag) {
      return this.matchRegex.test(tag);
    }
    getMatchingTagsFunction() {
      return {
        [10 /* STARTS_WITH */]: this.getMatchingTagsStartsWith,
        [15 /* CONTAINS */]: this.getMatchingTagsContains,
        [20 /* DEFAULT */]: this.getMatchingTagsRegex
      }[this.matchType] ?? this.getMatchingTagsRegex;
    }
    getMatchType() {
      if (STARTS_WITH_REGEX.test(this.value)) {
        return 10 /* STARTS_WITH */;
      }
      if (CONTAINS_REGEX.test(this.value)) {
        return 15 /* CONTAINS */;
      }
      return 20 /* DEFAULT */;
    }
    getMatchFunction() {
      return {
        [10 /* STARTS_WITH */]: this.matchesStartsWith,
        [15 /* CONTAINS */]: this.matchesContains,
        [20 /* DEFAULT */]: this.matchesRegex
      }[this.matchType] ?? this.matchesRegex;
    }
    getMatchingTagsStartsWith(tags) {
      const matchingTags = [];
      for (const tag of tags) {
        if (tag.startsWith(this.startsWithPrefix)) {
          matchingTags.push(tag);
          continue;
        }
        if (matchingTags.length > 0) {
          break;
        }
      }
      return matchingTags;
    }
    getMatchingTagsContains(tags) {
      return tags.filter((tag) => tag.includes(this.containsSubstring));
    }
    getMatchingTagsRegex(tags) {
      return tags.filter((tag) => this.matchRegex.test(tag));
    }
    matchesStartsWith(item) {
      for (const tag of item.tags.values()) {
        if (tag.startsWith(this.startsWithPrefix)) {
          return !this.negated;
        }
        if (this.startsWithPrefix < tag) {
          break;
        }
      }
      return this.negated;
    }
    matchesContains(item) {
      for (const tag of item.tags.values()) {
        if (tag.includes(this.containsSubstring)) {
          return !this.negated;
        }
      }
      return this.negated;
    }
    matchesRegex(item) {
      for (const tag of item.tags.values()) {
        if (this.matchRegex.test(tag)) {
          return !this.negated;
        }
      }
      return this.negated;
    }
    removeDuplicateAsterisks(value) {
      return value.replace(/\*+/g, "*");
    }
    createWildcardRegex() {
      try {
        const regex = escapeParenthesis(this.value.replace(/\*/g, ".*"));
        return new RegExp(`^${regex}$`);
      } catch {
        return UNMATCHABLE_REGEX;
      }
    }
  };
  function isWildcardSearchTag(tag) {
    return tag.includes("*");
  }
  function isMetadataSearchTag(tag) {
    return FavoriteMetadataSearchExpression.regex.test(tag);
  }
  function createSearchTag(tag) {
    if (isWildcardSearchTag(tag)) {
      return new WildcardSearchTag(tag);
    }
    if (isMetadataSearchTag(tag)) {
      return new MetadataSearchTag(tag);
    }
    return new SearchTag(tag);
  }
  function createSearchTagGroup(tags) {
    const searchTags = Array.from(new Set(tags)).map((tag) => createSearchTag(tag));
    return sortSearchTagGroup(searchTags);
  }
  function sortSearchTagGroup(searchTags) {
    return searchTags.sort((a, b) => {
      return a.finalCost - b.finalCost;
    });
  }
  var SearchCommand = class {
    orGroups = [];
    remainingTags = [];
    isEmpty;
    details;
    query;
    constructor(searchQuery2) {
      this.query = searchQuery2;
      this.isEmpty = isEmptyString(searchQuery2);
      this.details = this.getSearchCommandMetadata();
      if (this.isEmpty) {
        return;
      }
      const { orGroups, remainingTags } = extractTagGroups(searchQuery2);
      this.orGroups = orGroups.map((orGroup) => createSearchTagGroup(orGroup));
      this.remainingTags = createSearchTagGroup(remainingTags);
      this.simplifyOrGroupsWithOnlyOneTag();
      this.sortOrGroupsByLength();
      this.details = this.getSearchCommandMetadata();
    }
    get negatedTags() {
      return new Set(this.remainingTags.filter((tag) => tag.negated).map((tag) => tag.value));
    }
    get nonNegatedTags() {
      return this.remainingTags.filter((tag) => !tag.negated).map((tag) => tag.value);
    }
    get tagGroups() {
      return {
        orGroups: this.orGroups,
        remainingTags: this.remainingTags
      };
    }
    getSearchResults(items) {
      return this.isEmpty ? items : items.filter((item) => this.matches(item));
    }
    getSearchCommandMetadata() {
      const normalTags = [];
      const wildcardTags = [];
      const metadataTags = [];
      for (const tag of this.remainingTags) {
        if (tag instanceof WildcardSearchTag) {
          wildcardTags.push(tag);
        } else if (tag instanceof MetadataSearchTag) {
          metadataTags.push(tag);
        } else if (!tag.negated) {
          normalTags.push(tag);
        }
      }
      for (const orGroup of this.orGroups) {
        for (const tag of orGroup) {
          if (tag instanceof WildcardSearchTag) {
            wildcardTags.push(tag);
          } else if (tag instanceof MetadataSearchTag) {
            metadataTags.push(tag);
          }
        }
      }
      return {
        normalTags,
        wildcardTags,
        metadataTags,
        hasNormalTag: normalTags.length > 0,
        hasWildcardTag: wildcardTags.length > 0,
        hasMetadataTag: metadataTags.length > 0,
        hasOrGroup: this.orGroups.length > 0
      };
    }
    matches(item) {
      return this.matchesAllRemainingTags(item) && this.matchesAllOrGroups(item);
    }
    matchesAllRemainingTags(item) {
      return this.remainingTags.every((tag) => tag.matches(item));
    }
    matchesAllOrGroups(item) {
      return this.orGroups.every((orGroup) => orGroup.some((tag) => tag.matches(item)));
    }
    simplifyOrGroupsWithOnlyOneTag() {
      this.orGroups = this.orGroups.filter((orGroup) => {
        if (orGroup.length === 1) {
          this.remainingTags.push(orGroup[0]);
          return false;
        }
        return true;
      });
      sortSearchTagGroup(this.remainingTags);
    }
    sortOrGroupsByLength() {
      this.orGroups.sort((a, b) => {
        return a.length - b.length;
      });
    }
  };
  var ExpandedSearchCommand = class extends SearchCommand {
    hasNoMatches;
    indexedTags;
    constructor(searchQuery2, indexedTags) {
      super(searchQuery2);
      this.indexedTags = indexedTags;
      this.hasNoMatches = false;
      this.expandRemainingWildcardTags();
      this.expandAllOrGroupWildcardTags();
    }
    expandRemainingWildcardTags() {
      const newRemainingTags = [];
      for (const tagToExpand of this.remainingTags) {
        if (!(tagToExpand instanceof WildcardSearchTag)) {
          newRemainingTags.push(tagToExpand);
          continue;
        }
        const expandedTags = this.expandWildcardTag(tagToExpand);
        if (tagToExpand.negated) {
          for (const expandedNegatedTag of expandedTags) {
            this.remainingTags.push(expandedNegatedTag);
          }
          continue;
        }
        if (expandedTags.length === 0) {
          this.setAsUnmatchable();
          return;
        }
        if (expandedTags.length === 1) {
          newRemainingTags.push(expandedTags[0]);
          continue;
        }
        this.orGroups.push(expandedTags);
      }
      this.remainingTags = newRemainingTags;
    }
    expandAllOrGroupWildcardTags() {
      const newOrGroups = [];
      for (const orGroup of this.orGroups) {
        const newOrGroup = [];
        for (const tag of orGroup) {
          if (!(tag instanceof WildcardSearchTag)) {
            newOrGroup.push(tag);
            continue;
          }
          for (const expandedTag of this.expandWildcardTag(tag)) {
            newOrGroup.push(expandedTag);
          }
        }
        if (newOrGroup.length === 1) {
          this.remainingTags.push(newOrGroup[0]);
          continue;
        }
        if (newOrGroup.length === 0) {
          this.setAsUnmatchable();
          return;
        }
        newOrGroups.push(newOrGroup);
      }
      this.orGroups = newOrGroups;
    }
    setAsUnmatchable() {
      this.hasNoMatches = true;
      this.remainingTags = [];
      this.orGroups = [];
    }
    expandWildcardTag(wildcardTag) {
      return wildcardTag.getMatchingTags(this.indexedTags).map((matchingTag) => new SearchTag(wildcardTag.negated ? `-${matchingTag}` : matchingTag));
    }
  };
  var SortedArray = class {
    array = [];
    isSorted = true;
    get length() {
      return this.array.length;
    }
    toArray() {
      return this.isSorted ? this.array : this.sort();
    }
    insert(value) {
      this.array.splice(this.getSortedIndex(value), 0, value);
    }
    push(value) {
      this.isSorted = false;
      this.array.push(value);
    }
    sort() {
      this.isSorted = true;
      return this.array.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
    }
    getSortedIndex(value) {
      let low = 0;
      let high = this.array.length;
      while (low < high) {
        const mid = low + high >>> 1;
        if (this.array[mid] < value) {
          low = mid + 1;
        } else {
          high = mid;
        }
      }
      return low;
    }
  };
  function intersection(A, B) {
    const result = /* @__PURE__ */ new Set();
    if (A.size === 0 || B.size === 0) {
      return result;
    }
    if (A.size < B.size) {
      for (const a of A) {
        if (B.has(a)) {
          result.add(a);
        }
      }
      return result;
    }
    for (const b of B) {
      if (A.has(b)) {
        result.add(b);
      }
    }
    return result;
  }
  var InvertedSearchIndex = class {
    allSortedTags = new SortedArray();
    allItems = /* @__PURE__ */ new Set();
    tagItemMap = /* @__PURE__ */ new Map();
    sortTagsOnAdd = false;
    get allTags() {
      return this.allSortedTags.toArray();
    }
    add(item) {
      this.allItems.add(item);
      for (const tag of item.tags) {
        let indexedItems = this.tagItemMap.get(tag);
        if (indexedItems === void 0) {
          indexedItems = /* @__PURE__ */ new Set();
          this.tagItemMap.set(tag, indexedItems);
          this.addTag(tag);
        }
        indexedItems.add(item);
      }
    }
    remove(item) {
      for (const tag of item.tags) {
        const indexedItems = this.tagItemMap.get(tag);
        if (indexedItems !== void 0) {
          indexedItems.delete(item);
        }
      }
    }
    getSearchResults(searchCommand2, items) {
      return this.getSearchResultsUsingIndex(searchCommand2.query, items);
    }
    keepIndexedTagsSorted(value) {
      this.sortTagsOnAdd = value;
    }
    sortTags() {
      this.allSortedTags.toArray();
    }
    getSearchResultsUsingIndex(searchQuery2, itemsToSearch) {
      const expandedCommand = new ExpandedSearchCommand(searchQuery2, this.allTags);
      if (expandedCommand.isEmpty) {
        return itemsToSearch;
      }
      if (expandedCommand.hasNoMatches) {
        return [];
      }
      const negatedItems = this.getNegatedItems(expandedCommand);
      let resultItems = this.filterByNonNegatedTags(this.allItems, expandedCommand);
      if (resultItems.size === 0) {
        return [];
      }
      resultItems = this.filterByOrGroups(resultItems, expandedCommand);
      if (resultItems.size === 0) {
        return [];
      }
      return itemsToSearch.filter((item) => resultItems.has(item) && !negatedItems.has(item));
    }
    addTag(tag) {
      if (this.sortTagsOnAdd) {
        this.allSortedTags.insert(tag);
      } else {
        this.allSortedTags.push(tag);
      }
    }
    getNegatedItems(command) {
      const negatedItems = /* @__PURE__ */ new Set();
      for (const negatedTag of command.negatedTags) {
        const itemsWithNegatedTag = this.tagItemMap.get(negatedTag);
        if (itemsWithNegatedTag === void 0) {
          continue;
        }
        for (const item of itemsWithNegatedTag) {
          negatedItems.add(item);
        }
      }
      return negatedItems;
    }
    filterByNonNegatedTags(currentResult, command) {
      let result = currentResult;
      const itemSets = command.nonNegatedTags.map((tag) => this.tagItemMap.get(tag));
      if (itemSets.some((set3) => set3 === void 0)) {
        return /* @__PURE__ */ new Set();
      }
      for (const itemSet of itemSets.sort((a, b) => a.size - b.size)) {
        result = intersection(itemSet, result);
        if (result.size === 0) {
          return /* @__PURE__ */ new Set();
        }
      }
      return result;
    }
    filterByOrGroups(currentResult, command) {
      let result = currentResult;
      for (const orGroup of command.orGroups) {
        result = intersection(this.getAllItemsInOrGroup(orGroup), result);
        if (result.size === 0) {
          return /* @__PURE__ */ new Set();
        }
      }
      return result;
    }
    getAllItemsInOrGroup(orGroup) {
      const allItemsInOrGroup = /* @__PURE__ */ new Set();
      for (const tag of orGroup) {
        const itemsWithTag = this.tagItemMap.get(tag.value);
        if (itemsWithTag === void 0) {
          continue;
        }
        for (const item of itemsWithTag) {
          allItemsInOrGroup.add(item);
        }
      }
      return allItemsInOrGroup;
    }
  };
  var ThrottledQueue = class {
    queue;
    delay;
    draining;
    paused;
    unblocked;
    constructor(delay, unblocked = false) {
      this.queue = [];
      this.delay = delay;
      this.draining = false;
      this.paused = false;
      this.unblocked = unblocked;
    }
    wait() {
      if (this.unblocked) {
        return Promise.resolve();
      }
      return new Promise((resolve) => {
        this.queue.push(resolve);
        this.startDraining();
      });
    }
    setDelay(newDelay) {
      this.delay = newDelay;
    }
    reset() {
      this.queue = [];
      this.draining = false;
      this.paused = false;
    }
    async startDraining() {
      if (this.draining) {
        return;
      }
      this.draining = true;
      await this.drain();
      this.draining = false;
    }
    async drain() {
      while (this.queue.length > 0) {
        const resolve = this.queue.shift();
        if (resolve === void 0) {
          continue;
        }
        resolve();
        await sleep(this.delay);
        if (this.paused) {
          break;
        }
      }
    }
  };
  var internalSeed = 100;
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }
  function getRandomPositiveInteger(maximum) {
    return Math.floor(Math.random() * maximum);
  }
  function getRandomPositiveIntegerInRange(min, max) {
    return getRandomPositiveInteger(max - min) + min;
  }
  function seededRandom(seed) {
    const x = Math.sin(seed) * 4051.2948;
    return x - Math.floor(x);
  }
  function getSeededRandomPositiveInteger(maximum) {
    internalSeed += 1;
    return Math.floor(seededRandom(internalSeed) * maximum);
  }
  function getSeededRandomPositiveIntegerInRange(min, max) {
    return getSeededRandomPositiveInteger(max - min) + min;
  }
  function mapRange(value, fromMin, fromMax, toMin, toMax) {
    return Math.round(toMin + (value - fromMin) / (fromMax - fromMin) * (toMax - toMin));
  }
  function roundToTwoDecimalPlaces(value) {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }
  function millisecondsToSeconds(milliseconds) {
    return roundToTwoDecimalPlaces(milliseconds / 1e3);
  }
  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }
  function indexInBounds(array, index) {
    return index >= 0 && index < array.length;
  }
  function shuffleArray(array) {
    let maxIndex = array.length;
    let randomIndex;
    while (maxIndex > 0) {
      randomIndex = getRandomPositiveInteger(maxIndex);
      maxIndex -= 1;
      [
        array[maxIndex],
        array[randomIndex]
      ] = [
        array[randomIndex],
        array[maxIndex]
      ];
    }
    return array;
  }
  function getNumbersAround(number, count, min, max) {
    if (count <= 0) {
      return [];
    }
    if (min > max) {
      return [];
    }
    const numbers = [number];
    let i = 1;
    while (numbers.length < count) {
      const left = number - i;
      const right = number + i;
      const leftInBounds = left >= min && left <= max;
      const rightInBounds = right >= min && right <= max;
      const bothOutOfBounds = !leftInBounds && !rightInBounds;
      if (bothOutOfBounds) {
        break;
      }
      if (leftInBounds) {
        numbers.push(left);
      }
      if (rightInBounds && numbers.length < count) {
        numbers.push(right);
      }
      i += 1;
    }
    return numbers.sort((a, b) => a - b);
  }
  function getElementsAroundIndex(array, startIndex, limit) {
    if (!indexInBounds(array, startIndex) || limit === 0) {
      return [];
    }
    const result = [array[startIndex]];
    let i = 1;
    while (result.length < limit) {
      const leftIndex = startIndex - i;
      const rightIndex = startIndex + i;
      const leftIndexInBounds = indexInBounds(array, leftIndex);
      const rightIndexInBounds = indexInBounds(array, rightIndex);
      const bothIndexesOutOfBounds = !leftIndexInBounds && !rightIndexInBounds;
      if (bothIndexesOutOfBounds) {
        break;
      }
      if (leftIndexInBounds) {
        result.push(array[leftIndex]);
      }
      if (rightIndexInBounds && result.length < limit) {
        result.push(array[rightIndex]);
      }
      i += 1;
    }
    return result;
  }
  function getWrappedElementsAroundIndex(array, startIndex, limit) {
    if (!indexInBounds(array, startIndex) || limit === 0) {
      return [];
    }
    const result = [array[startIndex]];
    let i = 1;
    while (result.length < limit && result.length < array.length) {
      const leftIndex = (startIndex - i + array.length) % array.length;
      const rightIndex = (startIndex + i) % array.length;
      result.push(array[leftIndex]);
      if (result.length < limit && result.length < array.length) {
        result.push(array[rightIndex]);
      }
      i += 1;
    }
    return result;
  }
  function splitIntoChunks(array, chunkSize) {
    const result = [];
    if (chunkSize <= 0) {
      return [array];
    }
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    return result;
  }
  function getNumberRange(start, end) {
    const result = [];
    for (let i = start; i <= end; i += 1) {
      result.push(i);
    }
    return result;
  }
  var BATCH_SIZE = 750;
  var BATCH_SLEEP_TIME = 0;
  var FavoritesSearchIndex = class extends InvertedSearchIndex {
    ready = false;
    asyncBuildStarted = false;
    batchExecutor = new BatchExecutor(BATCH_SIZE, 100, this.addBatch.bind(this));
    addQueue = new ThrottledQueue(BATCH_SLEEP_TIME);
    asyncItemsToAdd = /* @__PURE__ */ new Set();
    cachedAsyncItemsToAdd = [];
    constructor() {
      super();
      if (!FavoritesSettings.useSearchIndex) {
        this.add = DO_NOTHING;
        return;
      }
      if (FavoritesSettings.buildIndexAsynchronously) {
        this.add = this.cacheAdditionsWhileFavoritesAreLoading;
        return;
      }
      this.ready = true;
    }
    async buildIndexAsynchronously() {
      if (!FavoritesSettings.useSearchIndex || this.asyncBuildStarted) {
        return;
      }
      this.asyncBuildStarted = true;
      await sleep(50);
      this.keepIndexedTagsSorted(false);
      this.add = this.addAsynchronously;
      this.emptyAdditionsCache();
    }
    buildIndexSynchronously() {
      this.add = super.add;
      this.ready = true;
    }
    emptyAdditionsCache() {
      const chunks = splitIntoChunks(this.cachedAsyncItemsToAdd, BATCH_SIZE);
      for (const chunk of chunks) {
        for (const item of chunk) {
          this.asyncItemsToAdd.add(item);
        }
      }
      for (const chunk of chunks) {
        this.addBatch(chunk);
      }
    }
    cacheAdditionsWhileFavoritesAreLoading(item) {
      this.cachedAsyncItemsToAdd.push(item);
    }
    addAsynchronously(item) {
      this.ready = false;
      this.asyncItemsToAdd.add(item);
      this.batchExecutor.add(item);
    }
    async addBatch(batch) {
      await this.addQueue.wait();
      for (const item of batch) {
        super.add(item);
        this.asyncItemsToAdd.delete(item);
      }
      this.ready = this.asyncItemsToAdd.size === 0;
      if (this.ready) {
        this.add = super.add;
        this.keepIndexedTagsSorted(true);
        this.sortTags();
      }
    }
  };
  var FAVORITES_SEARCH_INDEX = new FavoritesSearchIndex();
  var DELETE = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>';
  var EDIT = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>';
  var UP_ARROW = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-arrow-up"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>';
  var HEART_PLUS = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FF69B4"><path d="M440-501Zm0 381L313-234q-72-65-123.5-116t-85-96q-33.5-45-49-87T40-621q0-94 63-156.5T260-840q52 0 99 22t81 62q34-40 81-62t99-22q81 0 136 45.5T831-680h-85q-18-40-53-60t-73-20q-51 0-88 27.5T463-660h-46q-31-45-70.5-72.5T260-760q-57 0-98.5 39.5T120-621q0 33 14 67t50 78.5q36 44.5 98 104T440-228q26-23 61-53t56-50l9 9 19.5 19.5L605-283l9 9q-22 20-56 49.5T498-172l-58 52Zm280-160v-120H600v-80h120v-120h80v120h120v80H800v120h-80Z"/></svg>';
  var HEART_MINUS = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FF0000"><path d="M440-501Zm0 381L313-234q-72-65-123.5-116t-85-96q-33.5-45-49-87T40-621q0-94 63-156.5T260-840q52 0 99 22t81 62q34-40 81-62t99-22q84 0 153 59t69 160q0 14-2 29.5t-6 31.5h-85q5-18 8-34t3-30q0-75-50-105.5T620-760q-51 0-88 27.5T463-660h-46q-31-45-70.5-72.5T260-760q-57 0-98.5 39.5T120-621q0 33 14 67t50 78.5q36 44.5 98 104T440-228q26-23 61-53t56-50l9 9 19.5 19.5L605-283l9 9q-22 20-56 49.5T498-172l-58 52Zm160-280v-80h320v80H600Z"/></svg>';
  var HEART_CHECK = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#51b330"><path d="M718-313 604-426l57-56 57 56 141-141 57 56-198 198ZM440-501Zm0 381L313-234q-72-65-123.5-116t-85-96q-33.5-45-49-87T40-621q0-94 63-156.5T260-840q52 0 99 22t81 62q34-40 81-62t99-22q81 0 136 45.5T831-680h-85q-18-40-53-60t-73-20q-51 0-88 27.5T463-660h-46q-31-45-70.5-72.5T260-760q-57 0-98.5 39.5T120-621q0 33 14 67t50 78.5q36 44.5 98 104T440-228q26-23 61-53t56-50l9 9 19.5 19.5L605-283l9 9q-22 20-56 49.5T498-172l-58 52Z"/></svg>';
  var ERROR = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FF0000"><path d="M480-280q17 0 28.5-11.5T520-320q0-17-11.5-28.5T480-360q-17 0-28.5 11.5T440-320q0 17 11.5 28.5T480-280Zm-40-160h80v-240h-80v240Zm40 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>';
  var WARNING = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#DAB600"><path d="m40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Zm40-100Z"/></svg>';
  var BULB = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FFFFFF"><path d="M480-80q-26 0-47-12.5T400-126q-33 0-56.5-23.5T320-206v-142q-59-39-94.5-103T190-590q0-121 84.5-205.5T480-880q121 0 205.5 84.5T770-590q0 77-35.5 140T640-348v142q0 33-23.5 56.5T560-126q-12 21-33 33.5T480-80Zm-80-126h160v-36H400v36Zm0-76h160v-38H400v38Zm-8-118h58v-108l-88-88 42-42 76 76 76-76 42 42-88 88v108h58q54-26 88-76.5T690-590q0-88-61-149t-149-61q-88 0-149 61t-61 149q0 63 34 113.5t88 76.5Zm88-162Zm0-38Z"/></svg>';
  var PLAY = '<svg id="autoplay-play-button" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="white"><path d="M320-200v-560l440 280-440 280Zm80-280Zm0 134 210-134-210-134v268Z" /></svg>';
  var PAUSE = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="white"><path d="M520-200v-560h240v560H520Zm-320 0v-560h240v560H200Zm400-80h80v-400h-80v400Zm-320 0h80v-400h-80v400Zm0-400v400-400Zm320 0v400-400Z"/></svg>';
  var CHANGE_DIRECTION = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="white"><path d="M280-160 80-360l200-200 56 57-103 103h287v80H233l103 103-56 57Zm400-240-56-57 103-103H440v-80h287L624-743l56-57 200 200-200 200Z"/></svg>';
  var CHANGE_DIRECTION_2 = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#0075FF"><path d="M280-160 80-360l200-200 56 57-103 103h287v80H233l103 103-56 57Zm400-240-56-57 103-103H440v-80h287L624-743l56-57 200 200-200 200Z"/></svg>';
  var TUNE = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="white"><path d="M440-120v-240h80v80h320v80H520v80h-80Zm-320-80v-80h240v80H120Zm160-160v-80H120v-80h160v-80h80v240h-80Zm160-80v-80h400v80H440Zm160-160v-240h80v80h160v80H680v80h-80Zm-480-80v-80h400v80H120Z"/></svg>';
  var EXIT = '<svg xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF" viewBox="0 -960 960 960"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>';
  var FULLSCREEN_ENTER = '<svg xmlns="http://www.w3.org/2000/svg" fill="#FFFFFF" viewBox="0 -960 960 960"><path d="M120-120v-200h80v120h120v80H120Zm520 0v-80h120v-120h80v200H640ZM120-640v-200h200v80H200v120h-80Zm640 0v-120H640v-80h200v200h-80Z"/></svg>';
  var OPEN_IN_NEW = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FFFFFF"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z"/></svg>';
  var DOWNLOAD = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FFFFFF"><path d="M480-320 280-520l56-58 104 104v-326h80v326l104-104 56 58-200 200ZM240-160q-33 0-56.5-23.5T160-240v-120h80v120h480v-120h80v120q0 33-23.5 56.5T720-160H240Z"/></svg>';
  var IMAGE = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FFFFFF"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z"/></svg>';
  var PIN = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FFFFFF"><path d="m640-480 80 80v80H520v240l-40 40-40-40v-240H240v-80l80-80v-280h-40v-80h400v80h-40v280Zm-286 80h252l-46-46v-314H400v314l-46 46Zm126 0Z"/></svg>';
  var DOCK = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FFFFFF"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm440-80h120v-560H640v560Zm-80 0v-560H200v560h360Zm80 0h120-120Z"/></svg>';
  var SEARCH = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FFFFFF"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg>';
  var PALETTE = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#FFFFFF"><path d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 32.5-156t88-127Q256-817 330-848.5T488-880q80 0 151 27.5t124.5 76q53.5 48.5 85 115T880-518q0 115-70 176.5T640-280h-74q-9 0-12.5 5t-3.5 11q0 12 15 34.5t15 51.5q0 50-27.5 74T480-80Zm0-400Zm-220 40q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm120-160q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm200 0q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm120 160q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17ZM480-160q9 0 14.5-5t5.5-13q0-14-15-33t-15-57q0-42 29-67t71-25h70q66 0 113-38.5T800-518q0-121-92.5-201.5T488-800q-136 0-232 93t-96 227q0 133 93.5 226.5T480-160Z"/></svg>';
  function getTagAttributeFromImage(image) {
    return image.hasAttribute("tags") ? "tags" : "title";
  }
  function getTagsFromItemOnSearchPage(thumb) {
    if (!(thumb instanceof HTMLElement)) {
      return "";
    }
    const image = getImageFromThumb(thumb);
    if (image === null) {
      return "";
    }
    const tagAttribute = getTagAttributeFromImage(image);
    return image.getAttribute(tagAttribute) || "";
  }
  function getTagSetFromItemOnSearchPage(thumb) {
    return convertToTagSet(getTagsFromItemOnSearchPage(thumb));
  }
  function getTagSetFromItemOnFavoritesPage(item) {
    const favorite = getFavorite(item.id);
    return favorite === void 0 ? /* @__PURE__ */ new Set() : new Set(favorite.tags);
  }
  var getTagSetFromItem = ON_FAVORITES_PAGE ? getTagSetFromItemOnFavoritesPage : getTagSetFromItemOnSearchPage;
  function getContentTypeFromThumb(thumb) {
    return getContentType(getTagSetFromItem(thumb));
  }
  function moveTagsFromTitleToTagsAttribute(thumb) {
    const image = getImageFromThumb(thumb);
    if (image === null || !image.hasAttribute("title")) {
      return;
    }
    image.setAttribute("tags", image.title);
    image.removeAttribute("title");
  }
  function isFavoriteContentType(favorite, contentType) {
    return getContentType(favorite.tags) === contentType;
  }
  function isThumbContentType(thumb, contentType) {
    const image = getImageFromThumb(thumb);
    return image !== null && getContentType(getTagSetFromItem(thumb)) === contentType;
  }
  function isContentType(item, contentType) {
    if (item instanceof HTMLElement) {
      return isThumbContentType(item, contentType);
    }
    return isFavoriteContentType(item, contentType);
  }
  var isVideo = (item) => isContentType(item, "video");
  var isGif = (item) => isContentType(item, "gif");
  var isImage = (item) => isContentType(item, "image");
  function forceImageContentType(thumb) {
    if (!ON_SEARCH_PAGE) {
      return;
    }
    const tagSet = getTagSetFromItem(thumb);
    tagSet.delete("video");
    tagSet.delete("gif");
    tagSet.delete("mp4");
    tagSet.delete("animated");
    thumb.classList.remove("gif");
    thumb.classList.remove("video");
    const image = getImageFromThumb(thumb);
    if (image === null) {
      return;
    }
    image.classList.remove("gif");
    image.classList.remove("video");
    image.setAttribute("tags", convertToTagString(tagSet));
  }
  var DATABASE_NAME = "ImageExtensions";
  var OBJECT_STORE_NAME = "extensionMappings";
  var EXTENSION_MAP = /* @__PURE__ */ new Map();
  var DATABASE = new Database(DATABASE_NAME, OBJECT_STORE_NAME);
  var DATABASE_WRITE_SCHEDULER = new BatchExecutor(100, 2e3, DATABASE.update.bind(DATABASE));
  var EXTENSIONS = ["jpg", "png", "jpeg"];
  var BRUTE_FORCE_LIMITER = new ConcurrencyLimiter(3);
  async function loadExtensions() {
    for (const mapping of await DATABASE.load()) {
      EXTENSION_MAP.set(mapping.id, mapping.extension);
    }
  }
  function transferExtensionsFromLocalStorageToIndexedDB() {
    const extensionMappingsString = localStorage.getItem("imageExtensions");
    if (extensionMappingsString === null) {
      return;
    }
    const extensionMappings = JSON.parse(extensionMappingsString);
    const extensionDecodings = {
      0: "jpg",
      1: "png",
      2: "jpeg",
      3: "gif",
      4: "mp4"
    };
    for (const [id, extensionEncoding] of Object.entries(extensionMappings)) {
      const extension = extensionDecodings[extensionEncoding];
      if (extension !== void 0) {
        set2(id, extensionDecodings[extensionEncoding]);
      }
    }
    localStorage.removeItem("imageExtensions");
  }
  function getExtensionFromPost(post) {
    return getExtensionFromURL(post.fileURL);
  }
  function getExtensionFromURL(url) {
    const match = EXTENSION_REGEX.exec(url);
    return match === null ? null : match[1];
  }
  function has(id) {
    return EXTENSION_MAP.has(id);
  }
  function get2(id) {
    return EXTENSION_MAP.get(id);
  }
  function set2(id, extension) {
    if (has(id) || extension === "mp4" || extension === "gif") {
      return;
    }
    EXTENSION_MAP.set(id, extension);
    if (ON_FAVORITES_PAGE) {
      DATABASE_WRITE_SCHEDULER.add({ id, extension });
    }
  }
  function getExtension(item) {
    if (isVideo(item)) {
      return Promise.resolve("mp4");
    }
    if (isGif(item)) {
      return Promise.resolve("gif");
    }
    return withTimeout(getExtensionFromId(item.id), GeneralSettings.apiTimeout).catch((error) => {
      if (error instanceof PromiseTimeoutError) {
        return tryAllPossibleExtensions(item);
      }
      throw error;
    });
  }
  function tryAllPossibleExtensions(item) {
    return BRUTE_FORCE_LIMITER.run(() => {
      return tryAllPossibleExtensionsHelper(item);
    });
  }
  async function tryAllPossibleExtensionsHelper(item) {
    const baseURL = getOriginalImageURLWithJPGExtension(item);
    for (const extension of EXTENSIONS) {
      if (await tryPossibleExtension(baseURL, extension)) {
        set2(item.id, extension);
        return extension;
      }
    }
    return "jpg";
  }
  async function tryPossibleExtension(url, extension) {
    const response = await fetch(url.replace(".jpg", `.${extension}`));
    return response.ok;
  }
  async function getExtensionFromId(id) {
    if (has(id)) {
      return get2(id);
    }
    const post = await fetchPostFromAPISafe(id);
    const extension = getExtensionFromPost(post);
    if (extension !== null) {
      set2(id, extension);
      return extension;
    }
    return "jpg";
  }
  function setExtensionFromPost(post) {
    const extension = getExtensionFromPost(post);
    if (extension !== null) {
      set2(post.id, extension);
    }
  }
  function deleteExtensionsDatabase() {
    DATABASE.delete();
  }
  function setupExtensions() {
    transferExtensionsFromLocalStorageToIndexedDB();
    loadExtensions();
  }
  async function fetchImageBitmap(url, abortController2) {
    const response = await fetch(url, { signal: abortController2?.signal });
    const blob = await response.blob();
    return createImageBitmap(blob);
  }
  async function fetchImageBitmapFromThumb(thumb, abortController2) {
    return fetchImageBitmap(await getOriginalImageURL(thumb), abortController2);
  }
  async function fetchSampleImageBitmapFromThumb(thumb, abortController2) {
    return fetchImageBitmap(convertImageURLToSampleURL(await getOriginalImageURL(thumb)), abortController2).catch(() => {
      return fetchImageBitmapFromThumb(thumb, abortController2);
    });
  }
  async function getOriginalImageURL(item) {
    return (await getOriginalContentURL(item)).replace(".mp4", ".jpg");
  }
  async function getOriginalContentURL(item) {
    return getOriginalImageURLWithJPGExtension(item).replace(".jpg", `.${await getExtension(item)}`);
  }
  function getOriginalImageURLWithJPGExtension(item) {
    return removeIdFromImageURL(convertPreviewURLToImageURL(getPreviewURL(item) ?? ""));
  }
  function openPostPage(id) {
    window.open(createPostPageURL(id), "_blank");
  }
  function openSearchPage(searchQuery2) {
    window.open(createSearchPageURL(searchQuery2));
  }
  async function openOriginal(thumb) {
    window.open(await getOriginalContentURL(thumb), "_blank");
  }
  function createObjectURLFromSvg(svg) {
    const blob = new Blob([svg], {
      type: "image/svg+xml"
    });
    return URL.createObjectURL(blob);
  }
  var REMOVE_FAVORITE_IMAGE_HTML = `<img class="remove-favorite-button utility-button" src=${createObjectURLFromSvg(HEART_MINUS)}>`;
  var ADD_FAVORITE_IMAGE_HTML = `<img class="add-favorite-button utility-button" src=${createObjectURLFromSvg(HEART_PLUS)}>`;
  var DOWNLOAD_IMAGE_HTML = `<img class="download-button utility-button" src=${createObjectURLFromSvg(DOWNLOAD.replace("FFFFFF", "0075FF"))}>`;
  function downloadBlob(blob, filename) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
  }
  async function download(url, filename) {
    const response = await fetch(url);
    const blob = await response.blob();
    downloadBlob(blob, filename);
  }
  async function downloadFromThumb(thumb) {
    const originalContentURL = await getOriginalContentURL(thumb);
    const extension = getExtensionFromURL(originalContentURL) ?? "jpg";
    const filename = `${thumb.id}.${extension}`;
    download(originalContentURL, filename);
  }
  var htmlTemplate;
  function createFavoriteItemHTMLTemplates() {
    createPostHTMLTemplate();
  }
  function createDownloadButtonHTMLTemplate() {
    return `<img class="download-button utility-button" src=${createObjectURLFromSvg(DOWNLOAD.replace("FFFFFF", "0075FF"))}>`;
  }
  function createPostHTMLTemplate() {
    htmlTemplate = new DOMParser().parseFromString("", "text/html").createElement("div");
    htmlTemplate.className = ITEM_CLASS_NAME;
    htmlTemplate.innerHTML = `
        <a>
          <img>
          ${USER_IS_ON_THEIR_OWN_FAVORITES_PAGE ? REMOVE_FAVORITE_IMAGE_HTML : ADD_FAVORITE_IMAGE_HTML}
          ${createDownloadButtonHTMLTemplate()}
          ${GALLERY_DISABLED ? "" : "<canvas></canvas>"}
        </a>
    `;
  }
  var FavoriteHTMLElement = class {
    root;
    container;
    image;
    favoriteButton;
    downloadButton;
    constructor(post) {
      this.root = htmlTemplate.cloneNode(true);
      this.container = this.root.children[0];
      this.image = this.root.children[0].children[0];
      this.favoriteButton = this.root.children[0].children[1];
      this.downloadButton = this.root.children[0].children[2];
      this.downloadButton.onmousedown = this.download.bind(this);
      this.populateAttributes(post);
      this.setupFavoriteButton(USER_IS_ON_THEIR_OWN_FAVORITES_PAGE);
      this.openPostInNewTabOnClick();
      this.presetCanvasDimensions(post);
    }
    get thumbURL() {
      return this.image.src;
    }
    swapFavoriteButton() {
      const isRemoveButton = this.favoriteButton.classList.contains("remove-favorite-button");
      this.favoriteButton.outerHTML = isRemoveButton ? ADD_FAVORITE_IMAGE_HTML : REMOVE_FAVORITE_IMAGE_HTML;
      this.favoriteButton = this.root.children[0].children[1];
      this.setupFavoriteButton(!isRemoveButton);
    }
    populateAttributes(post) {
      this.image.src = post.previewURL;
      this.image.classList.add(getContentType(post.tags));
      this.root.id = post.id;
    }
    setupFavoriteButton(isRemoveButton) {
      this.favoriteButton.onmousedown = (event) => {
        event.stopPropagation();
        if (event.button !== 0 /* LEFT */) {
          return;
        }
        if (isRemoveButton) {
          this.removeFavorite();
        } else {
          this.addFavorite();
        }
      };
    }
    removeFavorite() {
      Events.favorites.favoriteRemoved.emit(this.root.id);
      removeFavorite(this.root.id);
      this.swapFavoriteButton();
    }
    addFavorite() {
      addFavorite(this.root.id);
      this.swapFavoriteButton();
    }
    openPostInNewTabOnClick() {
      if (ON_DESKTOP_DEVICE) {
        this.openPostInNewTabOnClickDesktop();
      } else {
        this.openPostInNewTabOnClickMobile();
      }
    }
    openPostInNewTabOnClickDesktop() {
      this.container.onclick = (event) => {
        if (event.ctrlKey) {
          openOriginal(this.root);
        }
      };
      this.container.addEventListener("mousedown", (event) => {
        if (event.ctrlKey) {
          return;
        }
        const middleClick = event.button === 1 /* MIDDLE */;
        const leftClick = event.button === 0 /* LEFT */;
        const shiftClick = leftClick && event.shiftKey;
        if (middleClick || shiftClick || leftClick && GALLERY_DISABLED) {
          event.preventDefault();
          openPostPage(this.root.id);
        }
      });
    }
    openPostInNewTabOnClickMobile() {
      this.container.href = createPostPageURL(this.root.id);
    }
    presetCanvasDimensions(post) {
      const canvas = this.root.querySelector("canvas");
      if (canvas === null || post.height === 0 || post.width === 0) {
        return;
      }
      canvas.dataset.size = `${post.width}x${post.height}`;
    }
    download(event) {
      event.stopPropagation();
      downloadFromThumb(this.root);
    }
  };
  var FAVORITES_PER_PAGE = 50;
  var POSTS_PER_SEARCH_PAGE = 42;
  var CONCURRENCY = 3;
  var VIDEO_LIMITER = new ConcurrencyLimiter(CONCURRENCY);
  var METADATA_BYTE_RANGES = [5e5, 1e6, 2e6, 4e6];
  var VIDEO_POOL = Array.from({ length: CONCURRENCY }, () => {
    const v = document.createElement("video");
    v.preload = "metadata";
    return v;
  });
  function getVideoDurationFromFavorite(favorite) {
    return getVideoDuration(getOriginalImageURLWithJPGExtension(favorite).replace(".jpg", ".mp4"));
  }
  function getVideoDuration(url) {
    return VIDEO_LIMITER.run(() => {
      return getVideoDurationWithIncreasingByteRanges(url);
    });
  }
  function getVideoDurationWithIncreasingByteRanges(url) {
    let chain = Promise.reject(new Error("start chain"));
    for (const range of METADATA_BYTE_RANGES) {
      chain = chain.catch(() => getVideoDurationForRange(url, range));
    }
    return chain.catch(() => Promise.reject(new Error(`Unable to read video duration for ${url} after trying ${METADATA_BYTE_RANGES.map((b) => `${b / 1e3}KB`).join(", ")}`)));
  }
  async function getVideoDurationForRange(url, range) {
    const response = await fetch(url, { headers: { Range: `bytes=0-${range}` } });
    if (!response.ok && response.status !== 206) {
      throw new Error("Server does not support range requests or fetch failed.");
    }
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const video = VIDEO_POOL.find((v) => !v.dataset.busy);
      video.dataset.busy = "true";
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        video.dataset.busy = "";
        resolve(video.duration);
      };
      video.onerror = () => {
        video.dataset.busy = "";
        reject(new Error("Failed to load video metadata"));
      };
      video.src = URL.createObjectURL(blob);
    });
  }
  var FETCH_UPDATE_QUEUE = [];
  var READY_UPDATE_QUEUE = [];
  var databaseWritten = false;
  var startedWritingDatabase = false;
  function decodeRating(rating) {
    return {
      "Explicit": 4 /* EXPLICIT */,
      "E": 4 /* EXPLICIT */,
      "e": 4 /* EXPLICIT */,
      "Questionable": 2 /* QUESTIONABLE */,
      "Q": 2 /* QUESTIONABLE */,
      "q": 2 /* QUESTIONABLE */,
      "Safe": 1 /* SAFE */,
      "S": 1 /* SAFE */,
      "s": 1 /* SAFE */
    }[rating] ?? 4 /* EXPLICIT */;
  }
  function onStartedStoringAllFavorites() {
    startedWritingDatabase = true;
  }
  async function updateMissingMetadata() {
    databaseWritten = true;
    for (const metadata of READY_UPDATE_QUEUE) {
      metadata.updateDatabase();
    }
    const chunks = splitIntoChunks(FETCH_UPDATE_QUEUE, FAVORITES_PER_PAGE).filter((chunk) => chunk.length > 0);
    if (chunks.length === 0) {
      return;
    }
    await Promise.all(chunks.map((chunk) => {
      return fetchMultiplePostsFromAPISafe(chunk.map((metadata) => metadata.id)).then((posts) => chunk.forEach((metadata) => metadata.processPost(posts[metadata.id])));
    }));
  }
  var FavoriteMetadata = class {
    metrics;
    id;
    rating;
    isDeleted;
    constructor(id, record) {
      this.metrics = {
        id: parseInt(id),
        width: 0,
        height: 0,
        score: 0,
        creationTimestamp: 0,
        lastChangedTimestamp: 0,
        default: 0,
        random: 0,
        duration: 0
      };
      this.id = id;
      this.rating = 4 /* EXPLICIT */;
      this.isDeleted = false;
      this.populate(record);
    }
    get isEmpty() {
      return this.metrics.width === 0 && this.metrics.height === 0;
    }
    get json() {
      return JSON.stringify(this.databaseRecord);
    }
    get databaseRecord() {
      return {
        width: this.metrics.width,
        height: this.metrics.height,
        score: this.metrics.score,
        rating: this.rating,
        create: this.metrics.creationTimestamp,
        change: this.metrics.lastChangedTimestamp,
        deleted: this.isDeleted,
        duration: this.metrics.duration
      };
    }
    get pixelCount() {
      return this.metrics.width * this.metrics.height;
    }
    populate(object) {
      if (object instanceof HTMLElement) {
        if (!FavoritesSettings.fetchMultiplePostWhileFetchingFavorites) {
          this.populateFromAPI();
        }
        this.setDuration();
        return;
      }
      if (object.metadata === void 0) {
        FETCH_UPDATE_QUEUE.push(this);
        return;
      }
      this.populateFromDatabase(object);
      this.setDurationFromRecord();
      if (this.isEmpty) {
        FETCH_UPDATE_QUEUE.push(this);
      }
    }
    async populateFromAPI() {
      this.processPost(await fetchPostFromAPISafe(this.id));
    }
    processPost(post) {
      this.populateFromPost(post);
      if (this.isEmpty) {
        return false;
      }
      if (databaseWritten) {
        this.updateDatabase();
      } else if (startedWritingDatabase) {
        READY_UPDATE_QUEUE.push(this);
      }
      setExtensionFromPost(post);
      validateTags(post);
      return true;
    }
    updateDatabase() {
      Events.favorites.missingMetadataFound.emit(this.id);
    }
    populateFromPost(post) {
      this.metrics.width = post.width;
      this.metrics.height = post.height;
      this.metrics.score = post.score;
      this.metrics.creationTimestamp = Date.parse(post.createdAt);
      this.metrics.lastChangedTimestamp = post.change;
      this.rating = decodeRating(post.rating);
    }
    populateFromDatabase(record) {
      this.metrics.width = record.metadata.width;
      this.metrics.height = record.metadata.height;
      this.metrics.score = record.metadata.score;
      this.rating = record.metadata.rating;
      this.metrics.creationTimestamp = record.metadata.create;
      this.metrics.lastChangedTimestamp = record.metadata.change;
      this.metrics.duration = record.metadata.duration ?? 0;
      this.isDeleted = record.metadata.deleted;
    }
    async setDuration() {
      const favorite = getFavorite(this.id);
      if (favorite !== void 0 && isVideo(favorite) && this.metrics.duration === 0) {
        this.metrics.duration = await getVideoDurationFromFavorite(favorite);
        return true;
      }
      return false;
    }
    async setDurationFromRecord() {
      if (await this.setDuration()) {
        this.updateDatabase();
      }
    }
  };
  var TAG_MODIFICATIONS = /* @__PURE__ */ new Map();
  var DATABASE2 = new Database("AdditionalTags", "additionalTags", 12);
  async function loadTagModifications() {
    (await DATABASE2.load()).forEach((record) => TAG_MODIFICATIONS.set(record.id, record.tags));
  }
  function getAdditionalTags(id) {
    return TAG_MODIFICATIONS.get(id);
  }
  function storeTagModifications() {
    DATABASE2.update(getDatabaseRecords());
  }
  function getDatabaseRecords() {
    return Array.from(TAG_MODIFICATIONS.entries()).map((entry) => ({ id: entry[0], tags: entry[1] }));
  }
  function resetTagModifications() {
    if (!confirm("Are you sure you want to delete all tag modifications?")) {
      return;
    }
    indexedDB.deleteDatabase("AdditionalTags");
    Events.tagModifier.resetConfirmed.emit();
    clearCustomTags();
  }
  function getCorrectTags(post) {
    const correctTags = convertToTagSet(post.tags);
    correctTags.add(post.id);
    if (post.fileURL.endsWith("mp4")) {
      correctTags.add("video");
    } else if (post.fileURL.endsWith("gif")) {
      correctTags.add("gif");
    } else if (!correctTags.has("animated_png")) {
      correctTags.delete("video");
      correctTags.delete("animated");
    }
    return correctTags;
  }
  var FavoriteTags = class {
    // @ts-expect-error not directly defined in constructor
    tags;
    id;
    additionalTags = /* @__PURE__ */ new Set();
    constructor(post, record) {
      this.id = post.id;
      this.set(record instanceof HTMLElement ? post.tags : record.tags);
      post.tags = "";
    }
    get tagString() {
      return convertToTagString(this.tags);
    }
    get originalTagSet() {
      return this.tags.difference(this.additionalTags);
    }
    get additionalTagString() {
      return convertToTagString(this.additionalTags);
    }
    set(tags) {
      this.tags = tags instanceof Set ? tags : convertToTagSet(tags);
      const additionalTags = getAdditionalTags(this.id);
      this.correctVideTag(tags);
      if (additionalTags !== void 0) {
        this.additionalTags = convertToTagSet(additionalTags);
        this.combineOriginalAndAdditionalTagSets();
      }
    }
    update(tags) {
      this.set(tags);
    }
    tagsAreEqual(post) {
      const correctTags = getCorrectTags(post);
      const difference = this.tags.symmetricDifference(correctTags);
      const equal = difference.size === 0 || difference.size === 1 && difference.has(post.id);
      if (equal) {
        return true;
      }
      post.tags = convertToTagString(correctTags);
      return false;
    }
    addAdditionalTags(newTagString) {
      const newTags = convertToTagSet(newTagString).difference(this.tags);
      if (newTags.size > 0) {
        this.additionalTags = this.additionalTags.union(newTags);
        this.combineOriginalAndAdditionalTagSets();
      }
      return this.additionalTagString;
    }
    removeAdditionalTags(tagsToRemove) {
      const tagsToRemoveSet = convertToTagSet(tagsToRemove).intersection(this.additionalTags);
      if (tagsToRemoveSet.size > 0) {
        this.tags = this.tags.difference(tagsToRemoveSet);
        this.additionalTags = this.additionalTags.difference(tagsToRemoveSet);
      }
      return this.additionalTagString;
    }
    resetAdditionalTags() {
      if (this.additionalTags.size === 0) {
        return;
      }
      this.additionalTags = /* @__PURE__ */ new Set();
      this.combineOriginalAndAdditionalTagSets();
    }
    combineOriginalAndAdditionalTagSets() {
      const union = this.originalTagSet.union(this.additionalTags);
      this.tags = new Set(Array.from(union).sort());
    }
    correctVideTag(tags) {
      if (typeof tags === "string") {
        if (this.tags.has("vide") && this.tags.has("animated")) {
          this.tags.delete("vide");
          this.tags.add("video");
        }
      }
    }
  };
  var ALL_FAVORITES = /* @__PURE__ */ new Map();
  function getFavorite(id) {
    return ALL_FAVORITES.get(id);
  }
  function validateTags(post) {
    const favorite = getFavorite(post.id);
    if (favorite !== void 0) {
      favorite.validateTags(post);
    }
  }
  function registerFavorite(favorite) {
    if (!ALL_FAVORITES.has(favorite.id)) {
      ALL_FAVORITES.set(favorite.id, favorite);
      FAVORITES_SEARCH_INDEX.add(favorite);
    }
  }
  var FavoriteItem = class {
    id;
    post;
    element;
    favoriteTags;
    metadata;
    constructor(object) {
      this.id = object instanceof HTMLElement ? getIdFromThumb(object) : object.id;
      this.post = createPostFromRawFavorite(object);
      this.element = null;
      this.favoriteTags = new FavoriteTags(this.post, object);
      registerFavorite(this);
      this.metadata = new FavoriteMetadata(this.id, object);
    }
    get tags() {
      return this.favoriteTags.tags;
    }
    get root() {
      if (this.element === null) {
        this.post.tags = this.favoriteTags.tagString;
        this.element = new FavoriteHTMLElement(this.post);
      }
      clearPost(this.post);
      return this.element.root;
    }
    get thumbURL() {
      return this.element === null ? this.post.previewURL : this.element.thumbURL;
    }
    get metrics() {
      return this.metadata.metrics;
    }
    get databaseRecord() {
      return {
        id: this.id,
        tags: this.tags,
        src: compressPreviewSource(this.thumbURL),
        metadata: this.metadata.databaseRecord
      };
    }
    withinRating(rating) {
      return (this.metadata.rating & rating) > 0;
    }
    validateTags(post) {
      if (!this.favoriteTags.tagsAreEqual(post)) {
        this.updateTags(post.tags);
      }
    }
    swapFavoriteButton() {
      if (this.element !== null) {
        this.element.swapFavoriteButton();
      }
    }
    processPost(post) {
      this.metadata.processPost(post);
    }
    addAdditionalTags(newTags) {
      FAVORITES_SEARCH_INDEX.remove(this);
      const result = this.favoriteTags.addAdditionalTags(newTags);
      FAVORITES_SEARCH_INDEX.add(this);
      return result;
    }
    removeAdditionalTags(tagsToRemove) {
      FAVORITES_SEARCH_INDEX.remove(this);
      const result = this.favoriteTags.removeAdditionalTags(tagsToRemove);
      FAVORITES_SEARCH_INDEX.add(this);
      return result;
    }
    resetAdditionalTags() {
      FAVORITES_SEARCH_INDEX.remove(this);
      this.favoriteTags.resetAdditionalTags();
      FAVORITES_SEARCH_INDEX.add(this);
    }
    updateTags(tags) {
      FAVORITES_SEARCH_INDEX.remove(this);
      this.favoriteTags.update(tags);
      FAVORITES_SEARCH_INDEX.add(this);
    }
  };
  var importantTagCategories = /* @__PURE__ */ new Set([
    "copyright",
    "character",
    "artist",
    "metadata"
  ]);
  var template = `
    <ul id="caption-list">
        <li id="caption-id" style="display: block;"><h6>ID</h6></li>
        ${getCategoryHeaderHTML()}
    </ul>
  `;
  var TAG_CATEGORY_MAPPINGS = {};
  var PENDING_REQUESTS = /* @__PURE__ */ new Set();
  var SETTINGS = {
    tagFetchDelayAfterFinishedLoading: 35,
    tagFetchDelayBeforeFinishedLoading: 100,
    maxPendingRequestsAllowed: 100
  };
  var FLAGS = {
    finishedLoading: false
  };
  var TAG_CATEGORY_DECODINGS = {
    0: "general",
    1: "artist",
    2: "unknown",
    3: "copyright",
    4: "character",
    5: "metadata"
  };
  var DATABASE3 = new Database("TagCategories", "tagMappings");
  var DATABASE_WRITE_SCHEDULER2 = new BatchExecutor(500, 2e3, saveTagCategories);
  var captionWrapper;
  var caption2;
  var currentThumb = null;
  var problematicTags;
  var currentThumbId = null;
  var abortController;
  function getCategoryHeaderHTML() {
    let html = "";
    for (const category of importantTagCategories) {
      const capitalizedCategory = capitalize(category);
      const header = capitalizedCategory === "Metadata" ? "Meta" : capitalizedCategory;
      html += `<li id="caption${capitalizedCategory}" style="display: none;"><h6>${header}</h6></li>`;
    }
    return html;
  }
  function saveTagCategories(mappings) {
    DATABASE3.store(mappings);
  }
  function isHidden() {
    return caption2.classList.contains("hide") || caption2.classList.contains("disabled") || caption2.classList.contains("remove");
  }
  function getTagFetchDelay() {
    if (FLAGS.finishedLoading) {
      return SETTINGS.tagFetchDelayAfterFinishedLoading;
    }
    return SETTINGS.tagFetchDelayBeforeFinishedLoading;
  }
  function initializeFields() {
    loadTagCategoryMappings();
    problematicTags = /* @__PURE__ */ new Set();
    abortController = new AbortController();
  }
  function createHTMLElement() {
    captionWrapper = document.createElement("div");
    captionWrapper.className = "caption-wrapper";
    caption2 = document.createElement("div");
    caption2.className = "caption inactive not-highlightable";
    captionWrapper.appendChild(caption2);
    document.head.appendChild(captionWrapper);
    caption2.innerHTML = template;
  }
  function insertHTML() {
    insertStyleHTML(CAPTION_HTML, "caption");
  }
  function toggleVisibility(value) {
    if (value === void 0) {
      value = caption2.classList.contains("disabled");
    }
    if (value) {
      caption2.classList.remove("disabled");
    } else if (!caption2.classList.contains("disabled")) {
      caption2.classList.add("disabled");
    }
    Preferences.captionsVisible.set(value);
  }
  function addEventListeners() {
    addCommonEventListeners();
    addFavoritesPageEventListeners();
  }
  function addCommonEventListeners() {
    caption2.addEventListener("transitionend", () => {
      if (caption2.classList.contains("active")) {
        caption2.classList.add("transition-completed");
      }
      caption2.classList.remove("transitioning");
    });
    caption2.addEventListener("transitionstart", () => {
      caption2.classList.add("transitioning");
    });
    Events.favorites.captionsToggled.on((value) => {
      toggleVisibility(value);
      if (currentThumb !== null && !caption2.classList.contains("remove")) {
        if (value) {
          attachToThumbHelper(currentThumb);
        } else {
          removeFromThumbHelper(currentThumb);
        }
      }
    });
    Events.document.mouseover.on((mouseOverEvent) => {
      if (mouseOverEvent.insideOfThumb) {
        const insideOfDifferentThumb = currentThumb !== null && mouseOverEvent.thumb !== null && currentThumb.id !== mouseOverEvent.thumb.id;
        if (insideOfDifferentThumb) {
          removeFromThumb(currentThumb);
        }
        attachToThumb(mouseOverEvent.thumb);
        currentThumb = mouseOverEvent.thumb;
      } else {
        if (currentThumb !== null) {
          removeFromThumb(currentThumb);
        }
        currentThumb = null;
      }
    });
  }
  function addFavoritesPageEventListeners() {
    Events.favorites.favoritesLoaded.on(() => {
      FLAGS.finishedLoading = true;
    }, {
      once: true
    });
    Events.favorites.favoritesLoadedFromDatabase.on(() => {
      FLAGS.finishedLoading = true;
    }, {
      once: true
    });
    Events.favorites.pageChanged.on(debounceAfterFirstCall(() => {
      abortAllRequests("Changed Page");
      abortController = new AbortController();
      setTimeout(() => {
      }, 600);
    }, 2e3));
    Events.favorites.captionsReEnabled.on(() => {
      if (currentThumb !== null) {
        attachToThumb(currentThumb);
      }
    });
    Events.favorites.resetConfirmed.on(() => {
      DATABASE3.delete();
    });
  }
  function attachToThumb(thumb) {
    if (isHidden() || thumb === null) {
      return;
    }
    attachToThumbHelper(thumb);
  }
  function attachToThumbHelper(thumb) {
    thumb.querySelectorAll(".caption-wrapper-clone").forEach((element) => element.remove());
    caption2.classList.remove("inactive");
    caption2.innerHTML = template;
    captionWrapper.removeAttribute("style");
    const captionIdHeader = caption2.querySelector("#caption-id");
    const captionIdTag = document.createElement("li");
    captionIdTag.className = "caption-tag";
    captionIdTag.textContent = thumb.id;
    captionIdTag.onclick = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    captionIdTag.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      event.stopPropagation();
    });
    captionIdTag.onmousedown = (event) => {
      event.preventDefault();
      event.stopPropagation();
      tagOnClick(thumb.id, event);
      Events.caption.idClicked.emit(thumb.id);
    };
    captionIdHeader?.insertAdjacentElement("afterend", captionIdTag);
    thumb.children[0].appendChild(captionWrapper);
    populateTags(thumb);
  }
  function removeFromThumb(thumb) {
    if (isHidden() || thumb === null) {
      return;
    }
    removeFromThumbHelper(thumb);
  }
  function removeFromThumbHelper(thumb) {
    animateRemoval(thumb);
    caption2.classList.add("inactive");
    animate(false);
    caption2.classList.remove("transition-completed");
  }
  function animateRemoval(thumb) {
    const captionWrapperClone = captionWrapper.cloneNode(true);
    if (!(captionWrapperClone instanceof HTMLElement)) {
      return;
    }
    const captionClone = captionWrapperClone.children[0];
    thumb.querySelectorAll(".caption-wrapper-clone").forEach((element) => element.remove());
    captionWrapperClone.classList.add("caption-wrapper-clone");
    captionWrapperClone.querySelectorAll("*").forEach((element) => element.removeAttribute("id"));
    if (!(captionClone instanceof HTMLElement)) {
      return;
    }
    captionClone.ontransitionend = () => {
      captionWrapperClone.remove();
    };
    thumb.children[0].appendChild(captionWrapperClone);
    setTimeout(() => {
      captionClone.classList.remove("active");
    }, 4);
  }
  function resizeFont(thumb) {
    const columnInput = document.getElementById("column-count");
    const heightCanBeDerivedWithoutRect = thumbMetadataExists(thumb) && columnInput !== null;
    const image = getImageFromThumb(thumb);
    let height = 200;
    if (heightCanBeDerivedWithoutRect && columnInput instanceof HTMLInputElement) {
      height = estimateThumbHeightFromMetadata(thumb, columnInput);
    } else if (image !== null) {
      height = image.getBoundingClientRect().height;
    }
    const captionListRect = caption2.children[0].getBoundingClientRect();
    const ratio = height / captionListRect.height;
    const scale = ratio > 1 ? Math.sqrt(ratio) : ratio * 0.85;
    if (caption2 !== null && caption2.parentElement !== null) {
      caption2.parentElement.style.fontSize = `${roundToTwoDecimalPlaces(scale)}em`;
    }
  }
  function thumbMetadataExists(thumb) {
    if (ON_SEARCH_PAGE) {
      return false;
    }
    const favorite = getFavorite(thumb.id);
    if (favorite === void 0) {
      return false;
    }
    if (favorite.metrics.width <= 0 || favorite.metrics.width <= 0) {
      return false;
    }
    return true;
  }
  function estimateThumbHeightFromMetadata(thumb, columnInput) {
    const favorite = getFavorite(thumb.id);
    if (favorite === void 0) {
      return 200;
    }
    const gridGap = 16;
    const columnCount = Math.max(1, parseInt(columnInput.value));
    const thumbWidthEstimate = (window.innerWidth - columnCount * gridGap) / columnCount;
    const thumbWidthScale = favorite.metrics.width / thumbWidthEstimate;
    return favorite.metrics.height / thumbWidthScale;
  }
  function addTag(tagCategory, tagName) {
    if (!importantTagCategories.has(tagCategory)) {
      return;
    }
    const header = document.getElementById(getCategoryHeaderId(tagCategory));
    const tag = document.createElement("li");
    if (header === null) {
      return;
    }
    tag.className = `${tagCategory}-tag caption-tag`;
    tag.textContent = replaceUnderscoresWithSpaces(tagName);
    header.insertAdjacentElement("afterend", tag);
    header.style.display = "block";
    tag.onmouseover = (event) => {
      event.stopPropagation();
    };
    tag.onclick = (event) => {
      event.stopPropagation();
      event.preventDefault();
    };
    tag.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      event.stopPropagation();
    });
    tag.onmousedown = (event) => {
      event.preventDefault();
      event.stopPropagation();
      tagOnClick(tagName, event);
    };
  }
  async function loadTagCategoryMappings() {
    const mappings = await DATABASE3.load();
    for (const mapping of mappings) {
      TAG_CATEGORY_MAPPINGS[mapping.id] = mapping.category;
    }
  }
  function tagOnClick(tagName, event) {
    switch (event.button) {
      case 0 /* LEFT */:
        if (event.shiftKey && isOnlyDigits(tagName)) {
          Events.favorites.findFavoriteInAllStarted.emit(tagName);
        } else {
          tagOnClickHelper(tagName, event);
        }
        break;
      case 1 /* MIDDLE */:
        Events.caption.searchForTag.emit(tagName);
        break;
      case 2 /* RIGHT */:
        tagOnClickHelper(`-${tagName}`, event);
        break;
      default:
        break;
    }
  }
  function tagOnClickHelper(value, mouseEvent) {
    if (ON_SEARCH_PAGE) {
      return;
    }
    if (mouseEvent.ctrlKey) {
      openSearchPage(value);
      return;
    }
    Events.searchBox.appendSearchBox.emit(value);
  }
  function replaceUnderscoresWithSpaces(tagName) {
    return tagName.replaceAll(/_/gm, " ");
  }
  function replaceSpacesWithUnderscores(tagName) {
    return tagName.replaceAll(/\s/gm, "_");
  }
  function animate(value) {
    caption2.classList.toggle("active", value);
  }
  function getCategoryHeaderId(tagCategory) {
    return `caption${capitalize(tagCategory)}`;
  }
  function populateTags(thumb) {
    const tagNames = getTagSetFromItem(thumb);
    tagNames.delete(thumb.id);
    const unknownThumbTags = Array.from(tagNames).filter((tagName) => tagCategoryIsUnknown(thumb, tagName));
    currentThumbId = thumb.id;
    if (allTagsAreProblematic(unknownThumbTags)) {
      correctAllProblematicTagsFromThumb(thumb, () => {
        addTags(tagNames, thumb);
      });
      return;
    }
    if (unknownThumbTags.length > 0) {
      findTagCategories(unknownThumbTags, () => {
        addTags(tagNames, thumb);
      }, 3);
      return;
    }
    addTags(tagNames, thumb);
  }
  function addTags(tags, thumb) {
    if (currentThumbId !== thumb.id) {
      return;
    }
    if (thumb.getElementsByClassName("caption-tag").length > 1) {
      return;
    }
    for (const tagName of Array.from(tags).reverse()) {
      const category = getTagCategory(tagName);
      addTag(category, tagName);
    }
    resizeFont(thumb);
    setTimeout(() => {
      animate(true);
    }, 0);
  }
  function getTagCategory(tagName) {
    return TAG_CATEGORY_MAPPINGS[tagName] ?? "general";
  }
  function allTagsAreProblematic(tags) {
    for (const tag of tags) {
      if (!problematicTags.has(tag)) {
        return false;
      }
    }
    return tags.length > 0;
  }
  function correctAllProblematicTagsFromThumb(thumb, onProblematicTagsCorrected) {
    fetchPostPage(thumb.id).then((html) => {
      const tagCategoryMap = getTagCategoryMapFromPostPage(html);
      for (const [tagName, tagCategory] of tagCategoryMap.entries()) {
        addTagCategoryMapping(tagName, isTagCategory(tagCategory) ? tagCategory : "general");
        problematicTags.delete(tagName);
      }
      onProblematicTagsCorrected();
    }).catch((error) => {
      console.error(error);
    });
  }
  function getTagCategoryMapFromPostPage(html) {
    const dom = new DOMParser().parseFromString(html, "text/html");
    return Array.from(dom.querySelectorAll(".tag")).reduce((map, element) => {
      const tagCategory = element.classList[0].replace("tag-type-", "");
      const tagName = replaceSpacesWithUnderscores(element.children[1].textContent ?? "");
      map.set(tagName, tagCategory);
      return map;
    }, /* @__PURE__ */ new Map());
  }
  function setAsProblematic(tag) {
    if (TAG_CATEGORY_MAPPINGS[tag] === void 0) {
      problematicTags.add(tag);
    }
  }
  function abortAllRequests(reason) {
    abortController.abort(reason);
    abortController = new AbortController();
    PENDING_REQUESTS.clear();
  }
  async function findTagCategories(tagNames, onAllCategoriesFound, fetchDelay) {
    const parser = new DOMParser();
    const lastTagName = tagNames[tagNames.length - 1];
    const uniqueTagNames = new Set(tagNames);
    for (const tagName of uniqueTagNames) {
      if (isOnlyDigits(tagName) && tagName.length > 5) {
        addTagCategoryMapping(tagName, "general");
        continue;
      }
      if (PENDING_REQUESTS.size > SETTINGS.maxPendingRequestsAllowed) {
        abortAllRequests(`Too many pending requests: ${PENDING_REQUESTS.size}`);
        return;
      }
      if (tagName.includes("'")) {
        setAsProblematic(tagName);
      }
      if (problematicTags.has(tagName)) {
        if (tagName === lastTagName) {
          onAllCategoriesFound();
        }
        continue;
      }
      try {
        PENDING_REQUESTS.add(tagName);
        fetch(createTagAPIURL(tagName), {
          signal: abortController.signal
        }).then((response) => {
          if (response.ok) {
            return response.text();
          }
          throw new Error(response.statusText);
        }).then((html) => {
          PENDING_REQUESTS.delete(tagName);
          const dom = parser.parseFromString(html, "text/html");
          const encoding = dom.getElementsByTagName("tag")[0].getAttribute("type");
          if (encoding === "array") {
            setAsProblematic(tagName);
            return;
          }
          addTagCategoryMapping(tagName, decodeTagCategory(parseInt(encoding ?? "0")));
          if (tagName === lastTagName) {
            onAllCategoriesFound();
          }
        }).catch(() => {
          onAllCategoriesFound();
        });
      } catch (error) {
        PENDING_REQUESTS.delete(tagName);
        console.error(error);
      }
      await sleep(fetchDelay ?? getTagFetchDelay());
    }
  }
  function tagCategoryIsUnknown(thumb, tagName) {
    return tagName !== thumb.id && TAG_CATEGORY_MAPPINGS[tagName] === void 0;
  }
  function decodeTagCategory(encoding) {
    return TAG_CATEGORY_DECODINGS[encoding] ?? "general";
  }
  function addTagCategoryMapping(id, category) {
    if (TAG_CATEGORY_MAPPINGS[id] !== void 0) {
      return;
    }
    TAG_CATEGORY_MAPPINGS[id] = category;
    DATABASE_WRITE_SCHEDULER2.add({
      id,
      category
    });
  }
  function setupCaptions() {
    if (CAPTIONS_DISABLED) {
      return;
    }
    initializeFields();
    createHTMLElement();
    insertHTML();
    toggleVisibility(Preferences.captionsVisible.value);
    addEventListeners();
  }
  var DownloadRequest = class {
    id;
    url;
    extension;
    constructor(id, url, extension) {
      this.id = id;
      this.url = url;
      this.extension = extension;
    }
    get filename() {
      return `${this.id}.${this.extension}`;
    }
    async blob() {
      const response = await fetch(this.url);
      return response.blob();
    }
  };
  async function createDownloadRequest(favorite) {
    let extension;
    if (isVideo(favorite)) {
      extension = "mp4";
    } else if (isGif(favorite)) {
      extension = "gif";
    } else {
      extension = await getExtension(favorite);
    }
    const url = await getOriginalContentURL(favorite);
    return new DownloadRequest(favorite.id, url, extension);
  }
  var FETCH_LIMITER = new ConcurrencyLimiter(3);
  var aborted = false;
  var currentlyDownloading = false;
  function setupFavoritesDownloader() {
    loadZipJS();
  }
  async function loadZipJS() {
    await new Promise((resolve, reject) => {
      if (typeof zip !== "undefined") {
        resolve(zip);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/gh/gildas-lormeau/zip.js/dist/zip-full.min.js";
      script.onload = () => resolve(zip);
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  async function startDownloading(favorites3, progressCallback) {
    if (currentlyDownloading) {
      return;
    }
    currentlyDownloading = true;
    aborted = false;
    await downloadFavorites(favorites3, progressCallback);
  }
  async function downloadFavorites(favorites3, progressCallback) {
    downloadBlob(await createTotalFavoriteBlob(favorites3, progressCallback), "download.zip");
    currentlyDownloading = false;
  }
  async function createTotalFavoriteBlob(favorites3, progressCallback) {
    const blobWriter = new zip.BlobWriter("application/zip");
    const zipWriter = new zip.ZipWriter(blobWriter);
    await Promise.all(favorites3.map((favorite) => createFavoriteBlob(favorite, zipWriter, progressCallback)));
    stopIfAborted();
    return zipWriter.close();
  }
  async function createFavoriteBlob(favorite, zipWriter, progressCallback) {
    try {
      stopIfAborted();
      const request = await createDownloadRequest(favorite);
      stopIfAborted();
      const response = await FETCH_LIMITER.run(() => {
        return fetch(request.url);
      });
      stopIfAborted();
      const blob = await response.blob();
      stopIfAborted();
      await zipFile(zipWriter, request, blob);
      stopIfAborted();
      progressCallback?.(request);
      stopIfAborted();
    } catch (error) {
      stopIfAborted();
      console.error(error);
    }
  }
  async function zipFile(zipWriter, request, blob) {
    const reader = new zip.BlobReader(blob);
    await zipWriter.add(request.filename, reader, {
      compression: "STORE"
    });
  }
  function stopIfAborted() {
    if (aborted) {
      throw new DownloadAbortedError();
    }
  }
  function abort() {
    aborted = true;
  }
  function reset() {
    currentlyDownloading = false;
  }
  var CrossFeatureRequest = class {
    handler;
    constructor(defaultValue) {
      this.handler = () => defaultValue;
    }
    request(value) {
      return this.handler(value);
    }
    setHandler(handler) {
      this.handler = handler;
    }
  };
  var CrossFeatureRequests = {
    inGallery: new CrossFeatureRequest(false),
    loadNewSearchPagesInGallery: new CrossFeatureRequest(null),
    loadNewFavoritesInGallery: new CrossFeatureRequest(false),
    latestFavoritesSearchResults: new CrossFeatureRequest([]),
    latestSearchPageThumbs: new CrossFeatureRequest([])
  };
  var dialog;
  var warningDialog;
  var downloadButton;
  var cancelButton;
  var statusContainer;
  var statusHeader;
  var favoritesLoaded;
  function setupDownloadMenu() {
    if (DOWNLOADER_DISABLED) {
      return;
    }
    setupFavoritesDownloader();
    insertHTMLAndExtractStyle(FAVORITES_SEARCH_GALLERY_CONTAINER, "beforeend", DOWNLOADER_HTML);
    dialog = getDialog("download-menu");
    warningDialog = getDialog("download-menu-warning");
    downloadButton = getDownloadButton();
    cancelButton = getCancelButton();
    statusContainer = getStatusContainer();
    statusHeader = getStatusHeader();
    favoritesLoaded = false;
    addEventListeners2();
  }
  function getDialog(id) {
    const newDialog = document.getElementById(id);
    return newDialog instanceof HTMLDialogElement ? newDialog : document.createElement("dialog");
  }
  function getDownloadButton() {
    const button = document.getElementById("download-menu-buttons-start-download");
    if (!(button instanceof HTMLButtonElement)) {
      return document.createElement("button");
    }
    button.addEventListener("click", () => {
      button.disabled = true;
      downloadFavorites2(CrossFeatureRequests.latestFavoritesSearchResults.request());
    });
    return button;
  }
  function getCancelButton() {
    const button = document.getElementById("download-menu-buttons-cancel-download");
    if (!(button instanceof HTMLButtonElement)) {
      return document.createElement("button");
    }
    button.addEventListener("click", () => {
      dialog.close();
    });
    return button;
  }
  function getStatusContainer() {
    const container3 = document.getElementById("download-menu-status");
    if (!(container3 instanceof HTMLElement)) {
      return document.createElement("div");
    }
    return container3;
  }
  function getStatusHeader() {
    const header = document.getElementById("download-menu-status-header");
    if (!(header instanceof HTMLElement)) {
      return document.createElement("div");
    }
    return header;
  }
  function createStatusTextRow() {
    const row = document.createElement("span");
    row.classList.add("download-menu-status-row");
    statusContainer.appendChild(row);
    return row;
  }
  function addEventListeners2() {
    enableAfterFavoritesLoad();
    openWhenDownloadButtonClicked();
    setupMenuCancelHandler();
    setupMenuCloseHandler();
    setupMenuOptions();
  }
  function enableAfterFavoritesLoad() {
    Events.favorites.favoritesLoaded.on(() => {
      favoritesLoaded = true;
    }, {
      once: true
    });
  }
  function openWhenDownloadButtonClicked() {
    Events.favorites.downloadButtonClicked.on(() => {
      if (favoritesLoaded) {
        downloadButton.disabled = false;
        dialog.showModal();
        statusHeader.textContent = `Download ${CrossFeatureRequests.latestFavoritesSearchResults.request().length} Results`;
      } else {
        warningDialog.showModal();
      }
      Events.toggleGlobalInputEvents(false);
      document.body.classList.add("dialog-opened");
    });
  }
  function setupMenuCancelHandler() {
    dialog.addEventListener("cancel", (event) => {
      event.preventDefault();
    });
  }
  function setupMenuCloseHandler() {
    dialog.addEventListener("close", async () => {
      cancelButton.textContent = "Cancel";
      Events.toggleGlobalInputEvents(true);
      await yield1();
      document.body.classList.remove("dialog-opened");
      dialog.classList.remove("downloading");
      abort();
      clearStatusTextRows();
      downloadButton.disabled = true;
      await sleep(2e3);
      downloadButton.disabled = false;
      reset();
    });
    warningDialog.addEventListener("close", () => {
      document.body.classList.remove("dialog-opened");
      Events.toggleGlobalInputEvents(true);
    });
  }
  function setupMenuOptions() {
    setupMenuBatchSizeSelect();
  }
  function setupMenuBatchSizeSelect() {
    const batchSizeSelect = document.getElementById("download-menu-options-batch-size");
    if (!(batchSizeSelect instanceof HTMLSelectElement)) {
      return;
    }
    batchSizeSelect.value = String(Preferences.downloadBatchSize.value);
    batchSizeSelect.addEventListener("change", () => {
      Preferences.downloadBatchSize.set(parseInt(batchSizeSelect.value));
    });
  }
  function clearStatusTextRows() {
    const rows = Array.from(statusContainer.querySelectorAll(".download-menu-status-row"));
    for (const row of rows) {
      row.remove();
    }
  }
  async function downloadFavorites2(favorites3) {
    const favoriteCount = favorites3.length;
    if (favoriteCount === 0) {
      finishDownload();
      return;
    }
    dialog.classList.add("downloading");
    statusHeader.textContent = `Downloading ${favoriteCount} Results`;
    const batches = splitIntoChunks(favorites3, Preferences.downloadBatchSize.value);
    const totalProgressRow = createStatusTextRow();
    const batchProgressRow = createStatusTextRow();
    const fileNameRow = createStatusTextRow();
    let totalCount = 0;
    const progressCallback = (request) => {
      totalCount += 1;
      totalProgressRow.textContent = `Downloading: ${totalCount} / ${favoriteCount}`;
      fileNameRow.textContent = `${request.filename}`;
    };
    for (let i = 0; i < batches.length; i += 1) {
      const batch = batches[i];
      batchProgressRow.textContent = `Batch: ${i + 1} / ${batches.length}`;
      totalProgressRow.textContent = `Total ${batch.length} posts`;
      await startDownloading(batch, progressCallback);
    }
    statusHeader.textContent = `Downloaded ${favoriteCount} Results`;
    finishDownload();
  }
  function finishDownload() {
    clearStatusTextRows();
    createStatusTextRow().textContent = "Finished";
    cancelButton.textContent = "Exit";
  }
  var SCHEMA_VERSION = 1;
  var SCHEMA_VERSION_LOCAL_STORAGE_KEY = "favoritesSearchGallerySchemaVersion";
  var DATABASE4 = new Database("Favorites", `user${getFavoritesPageId()}`);
  var METADATA_UPDATER = new BatchExecutor(100, 1e3, updateFavorites);
  function updateFavorites(favorites3) {
    DATABASE4.update(favorites3.map((favorite) => favorite.databaseRecord));
  }
  function convertToFavorites(records) {
    return records.map((record) => new FavoriteItem(record));
  }
  function getSchemaVersion() {
    const version = localStorage.getItem(SCHEMA_VERSION_LOCAL_STORAGE_KEY);
    return version === null ? null : parseInt(version);
  }
  function setSchemaVersion(version) {
    localStorage.setItem(SCHEMA_VERSION_LOCAL_STORAGE_KEY, version.toString());
  }
  function usingCorrectSchema(records) {
    return getSchemaVersion() === SCHEMA_VERSION && records.length > 0 && records[0].tags instanceof Set;
  }
  function updateRecord(record) {
    return {
      ...record,
      tags: convertToTagSet(record.tags),
      metadata: JSON.parse(record.metadata)
    };
  }
  function updateRecords(records) {
    return records.map((record) => updateRecord(record));
  }
  async function updateRecordsIfNeeded(records) {
    if (records.length === 0) {
      setSchemaVersion(SCHEMA_VERSION);
      return Promise.resolve(records);
    }
    if (usingCorrectSchema(records)) {
      return Promise.resolve(records);
    }
    const updatedRecords = updateRecords(records);
    await DATABASE4.update(updatedRecords);
    setSchemaVersion(SCHEMA_VERSION);
    return updatedRecords;
  }
  async function loadAllFavorites() {
    const records = await DATABASE4.load();
    const updatedRecords = await updateRecordsIfNeeded(records);
    return convertToFavorites(updatedRecords);
  }
  function storeFavorites(favorites3) {
    return DATABASE4.store(favorites3.slice().reverse().map((favorite) => favorite.databaseRecord));
  }
  function updateMetadata(id) {
    const favorite = getFavorite(id);
    if (favorite !== void 0) {
      METADATA_UPDATER.add(favorite);
    }
  }
  function deleteFavorite(id) {
    return DATABASE4.deleteRecords([id]);
  }
  function deleteDatabase() {
    return DATABASE4.delete();
  }
  var queue = [];
  var mostRecentlyDequeuedPageNumber = -1;
  var dequeuing = false;
  var onDequeue = DO_NOTHING;
  function getSmallestEnqueuedPageNumber() {
    return queue[0].pageNumber;
  }
  function getNextPageNumberToDequeue() {
    return mostRecentlyDequeuedPageNumber + 1;
  }
  function allPreviousPagesWereDequeued() {
    return getNextPageNumberToDequeue() === getSmallestEnqueuedPageNumber();
  }
  function isEmpty() {
    return queue.length === 0;
  }
  function canDequeue() {
    return !isEmpty() && allPreviousPagesWereDequeued();
  }
  function sortByLowestPageNumber() {
    queue.sort((request1, request2) => request1.pageNumber - request2.pageNumber);
  }
  function drain() {
    if (dequeuing) {
      return;
    }
    dequeuing = true;
    while (canDequeue()) {
      dequeue();
    }
    dequeuing = false;
  }
  function dequeue() {
    mostRecentlyDequeuedPageNumber += 1;
    const request = queue.shift();
    const favorites3 = request?.favorites ?? [];
    onDequeue(favorites3);
  }
  function setDequeueCallback(callback) {
    onDequeue = callback;
  }
  function enqueue(request) {
    queue.push(request);
    sortByLowestPageNumber();
    drain();
  }
  var FavoritesPageRequest = class {
    pageNumber;
    favorites = [];
    retryCount;
    constructor(pageNumber) {
      this.pageNumber = pageNumber;
      this.retryCount = 0;
    }
    get url() {
      return createFavoritesPageURL(this.pageNumber * FAVORITES_PER_PAGE);
    }
    get fetchDelay() {
      return 7 ** this.retryCount + FavoritesSettings.favoritesPageFetchDelay;
    }
    get realPageNumber() {
      return this.pageNumber * FAVORITES_PER_PAGE;
    }
    retry() {
      this.retryCount += 1;
    }
  };
  var PARSER6 = new DOMParser();
  function extractFavoriteElements(favoritesPageHTML) {
    const dom = PARSER6.parseFromString(favoritesPageHTML, "text/html");
    const thumbs = Array.from(dom.querySelectorAll(".thumb"));
    if (thumbs.length > 0) {
      return thumbs.filter((thumb) => thumb instanceof HTMLElement);
    }
    return Array.from(dom.querySelectorAll("img")).filter((image) => image.src.includes("thumbnail_")).map((image) => image.parentElement).filter((thumb) => thumb !== null);
  }
  function extractFavorites(favoritesPageHTML) {
    return extractFavoriteElements(favoritesPageHTML).map((element) => new FavoriteItem(element));
  }
  var PENDING_REQUEST_PAGE_NUMBERS = /* @__PURE__ */ new Set();
  var FAILED_REQUESTS = [];
  var storedFavoriteIds = /* @__PURE__ */ new Set();
  var currentPageNumber = 0;
  var fetchedAnEmptyPage = false;
  function hasFailedRequests() {
    return FAILED_REQUESTS.length > 0;
  }
  function hasPendingRequests() {
    return PENDING_REQUEST_PAGE_NUMBERS.size > 0;
  }
  function allRequestsHaveStarted() {
    return fetchedAnEmptyPage;
  }
  function someRequestsArePending() {
    return hasPendingRequests() || hasFailedRequests();
  }
  function noRequestsArePending() {
    return !someRequestsArePending();
  }
  function allRequestsHaveCompleted() {
    return allRequestsHaveStarted() && noRequestsArePending();
  }
  function someRequestsAreIncomplete() {
    return !allRequestsHaveCompleted();
  }
  function oldestFailedFetchRequest() {
    return FAILED_REQUESTS.shift() ?? null;
  }
  function getNewFetchRequest() {
    const request = new FavoritesPageRequest(currentPageNumber);
    PENDING_REQUEST_PAGE_NUMBERS.add(request.realPageNumber);
    currentPageNumber += 1;
    return request;
  }
  function nextFetchRequest() {
    if (hasFailedRequests()) {
      return oldestFailedFetchRequest();
    }
    if (!allRequestsHaveStarted()) {
      return getNewFetchRequest();
    }
    return null;
  }
  async function fetchNextFavoritesPage() {
    const request = nextFetchRequest();
    if (request === null) {
      await sleep(200);
      return;
    }
    await fetchFavoritesPageHelper(request);
  }
  async function fetchFavoritesPageHelper(request) {
    fetchFavoritesPage(request.realPageNumber).then((html) => {
      onFavoritesPageRequestSuccess(request, html);
    }).catch((error) => {
      onFavoritesPageRequestError(request, error);
    });
    await sleep(request.fetchDelay);
  }
  function onFavoritesPageRequestSuccess(request, html) {
    request.favorites = extractFavorites(html);
    populateMultipleMetadataFromAPI(request.favorites);
    PENDING_REQUEST_PAGE_NUMBERS.delete(request.realPageNumber);
    const favoritesPageIsEmpty = request.favorites.length === 0;
    fetchedAnEmptyPage = fetchedAnEmptyPage || favoritesPageIsEmpty;
    if (!favoritesPageIsEmpty) {
      enqueue(request);
    }
  }
  function onFavoritesPageRequestError(request, error) {
    console.error(error);
    request.retry();
    FAILED_REQUESTS.push(request);
  }
  async function populateMultipleMetadataFromAPI(favorites3) {
    if (!FavoritesSettings.fetchMultiplePostWhileFetchingFavorites) {
      return;
    }
    const favoriteMap = favorites3.reduce((map, favorite) => {
      map[favorite.id] = favorite;
      return map;
    }, {});
    const postMap = await fetchMultiplePostsFromAPI(Array.from(Object.keys(favoriteMap)));
    for (const [id, post] of Object.entries(postMap)) {
      favoriteMap[id].processPost(post);
    }
  }
  function fetchNewFavoritesOnReloadHelper() {
    return fetchFavoritesPage(getNewFetchRequest().realPageNumber).then((html) => {
      return extractNewFavorites(html);
    });
  }
  function extractNewFavorites(html) {
    const newFavorites = [];
    const fetchedFavorites = extractFavorites(html);
    let allNewFavoritesFound = fetchedFavorites.length === 0;
    for (const favorite of fetchedFavorites) {
      if (storedFavoriteIds.has(favorite.id)) {
        allNewFavoritesFound = true;
        break;
      }
      newFavorites.push(favorite);
    }
    return {
      allNewFavoritesFound,
      newFavorites
    };
  }
  async function fetchAllFavorites(onFavoritesFound) {
    setDequeueCallback(onFavoritesFound);
    while (someRequestsAreIncomplete()) {
      await fetchNextFavoritesPage();
    }
  }
  async function fetchNewFavoritesOnReload(ids) {
    await sleep(100);
    storedFavoriteIds = ids;
    let favorites3 = [];
    while (true) {
      const { allNewFavoritesFound, newFavorites } = await fetchNewFavoritesOnReloadHelper();
      populateMultipleMetadataFromAPI(newFavorites);
      favorites3 = favorites3.concat(newFavorites);
      if (allNewFavoritesFound) {
        storedFavoriteIds.clear();
        return favorites3;
      }
    }
  }
  var allFavorites = [];
  var useSearchSubset = false;
  var subsetFavorites = [];
  function getAllFavoriteIds() {
    return new Set(Array.from(allFavorites.values()).map((favorite) => favorite.id));
  }
  async function loadAllFavoritesFromDatabase() {
    allFavorites = await loadAllFavorites();
    return allFavorites;
  }
  function fetchAllFavorites2(onFavoritesFound) {
    const onFavoritesFoundHelper = (favorites3) => {
      allFavorites = allFavorites.concat(favorites3);
      return onFavoritesFound(favorites3);
    };
    return fetchAllFavorites(onFavoritesFoundHelper);
  }
  async function fetchNewFavoritesOnReload2() {
    const newFavorites = await fetchNewFavoritesOnReload(getAllFavoriteIds());
    allFavorites = newFavorites.concat(allFavorites);
    return newFavorites;
  }
  function getAllFavorites() {
    return useSearchSubset ? subsetFavorites : allFavorites;
  }
  function storeAllFavorites() {
    return storeFavorites(allFavorites);
  }
  function storeNewFavorites(newFavorites) {
    return storeFavorites(newFavorites);
  }
  function updateMetadata2(id) {
    updateMetadata(id);
  }
  function deleteFavorite2(id) {
    return deleteFavorite(id);
  }
  function setSearchSubset(searchResults) {
    useSearchSubset = true;
    subsetFavorites = searchResults;
  }
  function stopSearchSubset() {
    useSearchSubset = false;
    subsetFavorites = [];
  }
  function deleteDatabase2() {
    deleteDatabase();
  }
  var currentPageNumber2 = 1;
  var resultsPerPage = Preferences.resultsPerPage.value;
  var favorites2 = [];
  function getPageCount() {
    const favoriteCount = favorites2.length;
    if (favoriteCount === 0) {
      return 1;
    }
    const pageCount = favoriteCount / resultsPerPage;
    if (favoriteCount % resultsPerPage === 0) {
      return pageCount;
    }
    return Math.floor(pageCount) + 1;
  }
  function onFirstPage() {
    return currentPageNumber2 === 1;
  }
  function onFinalPage() {
    return currentPageNumber2 === getPageCount();
  }
  function onlyOnePage() {
    return onFirstPage() && onFinalPage();
  }
  function getPaginationParameters() {
    const { start, end } = getCurrentPageRange();
    return { currentPageNumber: currentPageNumber2, finalPageNumber: getPageCount(), favoritesCount: favorites2.length, startIndex: start, endIndex: end };
  }
  function paginate(newFavorites) {
    favorites2 = newFavorites;
  }
  function changePage(pageNumber) {
    currentPageNumber2 = clamp(pageNumber, 1, getPageCount());
  }
  function gotoFirstPage() {
    changePage(1);
  }
  function gotoLastPage() {
    changePage(getPageCount());
  }
  function getFavoritesOnCurrentPage() {
    return getFavoritesOnPage(currentPageNumber2);
  }
  function getFavoritesOnNextPage() {
    return getFavoritesOnPage(currentPageNumber2 + 1);
  }
  function getFavoritesOnPreviousPage() {
    return getFavoritesOnPage(currentPageNumber2 - 1);
  }
  function getFavoritesOnPage(pageNumber) {
    const { start, end } = getPageRange(pageNumber);
    return favorites2.slice(start, end);
  }
  function getCurrentPageRange() {
    return getPageRange(currentPageNumber2);
  }
  function getPageRange(pageNumber) {
    return {
      start: resultsPerPage * (pageNumber - 1),
      end: resultsPerPage * pageNumber
    };
  }
  function changeResultsPerPage(newResultsPerPage) {
    resultsPerPage = newResultsPerPage;
  }
  function gotoAdjacentPage(direction) {
    const forward = isForwardNavigationKey(direction);
    if (onlyOnePage()) {
      return false;
    }
    if (onFinalPage() && forward) {
      gotoFirstPage();
    } else if (onFirstPage() && !forward) {
      gotoLastPage();
    } else {
      changePage(forward ? currentPageNumber2 + 1 : currentPageNumber2 - 1);
    }
    return true;
  }
  function gotoRelativePage(relation) {
    if (onlyOnePage()) {
      return false;
    }
    switch (relation) {
      case "previous":
        if (onFirstPage()) {
          return false;
        }
        gotoAdjacentPage("ArrowLeft");
        return true;
      case "first":
        if (onFirstPage()) {
          return false;
        }
        gotoFirstPage();
        return true;
      case "next":
        if (onFinalPage()) {
          return false;
        }
        return gotoAdjacentPage("ArrowRight");
      case "final":
        if (onFinalPage()) {
          return false;
        }
        gotoLastPage();
        return true;
      default:
        return false;
    }
  }
  function gotoPageWithFavorite(id) {
    const favoriteIds = favorites2.map((favorite) => favorite.id);
    const index = favoriteIds.indexOf(id);
    const favoriteNotFound = index === -1;
    if (favoriteNotFound) {
      return false;
    }
    const pageNumber = Math.floor(index / resultsPerPage) + 1;
    const favoriteOnDifferentPage = currentPageNumber2 !== pageNumber;
    if (favoriteOnDifferentPage) {
      changePage(pageNumber);
      return true;
    }
    return false;
  }
  var NEGATED_TAG_BLACKLIST = negateTags(getTagBlacklist());
  var searchQuery = "";
  var useTagBlacklist = !USER_IS_ON_THEIR_OWN_FAVORITES_PAGE || Preferences.excludeBlacklistEnabled.value;
  var allowedRatings = Preferences.allowedRatings.value;
  var searchCommand = updateSearchCommand();
  function allRatingsAreAllowed() {
    return allowedRatings === 7;
  }
  function getFinalSearchQuery() {
    return useTagBlacklist ? `${searchQuery} ${NEGATED_TAG_BLACKLIST}` : searchQuery;
  }
  function updateSearchCommand() {
    searchCommand = new SearchCommand(getFinalSearchQuery());
    return searchCommand;
  }
  function shouldUseIndex(favorites3) {
    return FavoritesSettings.useSearchIndex && FAVORITES_SEARCH_INDEX.ready && !searchCommand.details.hasMetadataTag && favorites3.length > FAVORITES_PER_PAGE;
  }
  function filter(favorites3) {
    const results = shouldUseIndex(favorites3) ? FAVORITES_SEARCH_INDEX.getSearchResults(searchCommand, favorites3) : searchCommand.getSearchResults(favorites3);
    return filterByRating(results);
  }
  function filterByRating(favorites3) {
    return allRatingsAreAllowed() ? favorites3 : favorites3.filter((result) => result.withinRating(allowedRatings));
  }
  function filterOutBlacklisted(favorites3) {
    return USER_IS_ON_THEIR_OWN_FAVORITES_PAGE ? favorites3 : new SearchCommand(NEGATED_TAG_BLACKLIST).getSearchResults(favorites3);
  }
  function setSearchQuery(newSearchQuery) {
    searchQuery = newSearchQuery;
    updateSearchCommand();
  }
  function toggleBlacklistFiltering(value) {
    useTagBlacklist = value;
    updateSearchCommand();
  }
  function setAllowedRatings(newAllowedRating) {
    allowedRatings = newAllowedRating;
  }
  var useAscendingOrder = Preferences.sortAscendingEnabled.value;
  var sortingMethod = Preferences.sortingMethod.value;
  function setAscendingOrder(value) {
    useAscendingOrder = value;
  }
  function setSortingMethod(value) {
    sortingMethod = value;
  }
  function sortFavorites(favorites3) {
    const toSort = favorites3.slice();
    if (sortingMethod === "random") {
      return shuffleArray(toSort);
    }
    toSort.sort((a, b) => b.metrics[sortingMethod] - a.metrics[sortingMethod]);
    return useAscendingOrder ? toSort.reverse() : toSort;
  }
  function getMoreResults(favorites3) {
    const result = [];
    for (const favorite of favorites3) {
      if (document.getElementById(favorite.id) === null) {
        result.push(favorite.root);
      }
      if (result.length >= FavoritesSettings.infiniteScrollBatchSize) {
        break;
      }
    }
    return result;
  }
  function hasMoreResults(favorites3) {
    return getMoreResults(favorites3).length > 0;
  }
  function getFirstResults(favorites3) {
    return favorites3.slice(0, FavoritesSettings.infiniteScrollBatchSize);
  }
  function getThumbURLsToPreload(favorites3) {
    const result = [];
    for (const favorite of favorites3) {
      if (document.getElementById(favorite.id) === null) {
        result.push(favorite.thumbURL);
      }
      if (result.length >= FavoritesSettings.infiniteScrollPreloadCount) {
        break;
      }
    }
    return result;
  }
  var CONTENT_CONTAINER = document.createElement("div");
  CONTENT_CONTAINER.id = "favorites-search-gallery-content";
  function insertFavoritesSearchGalleryContentContainer() {
    insertStyleHTML(CONTENT_HTML);
    FAVORITES_SEARCH_GALLERY_CONTAINER.insertAdjacentElement("beforeend", CONTENT_CONTAINER);
  }
  var latestSearchResults = [];
  async function loadAllFavoritesFromDatabase2() {
    await loadAllFavoritesFromDatabase();
    return getAllFavorites2().length === 0 ? [] : getSearchResults("");
  }
  function fetchAllFavorites3(onSearchResultsFound) {
    const onFavoritesFound = (favorites3) => {
      latestSearchResults = latestSearchResults.concat(filter(favorites3));
      return onSearchResultsFound();
    };
    return fetchAllFavorites2(onFavoritesFound);
  }
  async function fetchNewFavoritesOnReload3() {
    const newFavorites = await fetchNewFavoritesOnReload2();
    const newSearchResults = filter(newFavorites);
    latestSearchResults = newSearchResults.concat(latestSearchResults);
    return {
      newFavorites,
      newSearchResults,
      allSearchResults: latestSearchResults
    };
  }
  function storeNewFavorites2(newFavorites) {
    return storeNewFavorites(newFavorites);
  }
  function getAllFavorites2() {
    return getAllFavorites();
  }
  function storeAllFavorites2() {
    return storeAllFavorites();
  }
  function getLatestSearchResults() {
    return latestSearchResults;
  }
  function getSearchResults(searchQuery2) {
    setSearchQuery(searchQuery2);
    return getSearchResultsFromLatestQuery();
  }
  function getSearchResultsFromLatestQuery() {
    const favorites3 = filter(getAllFavorites2());
    latestSearchResults = sortFavorites(favorites3);
    return latestSearchResults;
  }
  function getShuffledSearchResults() {
    return shuffleArray(latestSearchResults);
  }
  function invertSearchResults() {
    const searchResultIds = new Set(latestSearchResults.map((favorite) => favorite.id));
    const invertedSearchResults = getAllFavorites2().filter((favorite) => !searchResultIds.has(favorite.id));
    const ratingFilteredInvertedSearchResults = filterByRating(invertedSearchResults);
    latestSearchResults = filterOutBlacklisted(ratingFilteredInvertedSearchResults);
  }
  function paginate2(searchResults) {
    paginate(searchResults);
  }
  function changePage2(pageNumber) {
    changePage(pageNumber);
  }
  function getFavoritesOnCurrentPage2() {
    return getFavoritesOnCurrentPage();
  }
  function getFavoritesOnNextPage2() {
    return getFavoritesOnNextPage();
  }
  function getFavoritesOnPreviousPage2() {
    return getFavoritesOnPreviousPage();
  }
  function gotoAdjacentPage2(direction) {
    return gotoAdjacentPage(direction);
  }
  function gotoRelativePage2(relation) {
    return gotoRelativePage(relation);
  }
  function gotoPageWithFavoriteId(id) {
    return gotoPageWithFavorite(id);
  }
  function getPaginationParameters2() {
    return getPaginationParameters();
  }
  function onFinalPage2() {
    return onFinalPage();
  }
  function toggleBlacklist(value) {
    toggleBlacklistFiltering(value);
  }
  function changeAllowedRatings(allowedRatings2) {
    setAllowedRatings(allowedRatings2);
  }
  function setSortingMethod2(sortingMethod2) {
    setSortingMethod(sortingMethod2);
  }
  function toggleSortAscending(value) {
    setAscendingOrder(value);
  }
  function updateMetadata3(id) {
    updateMetadata2(id);
  }
  function changeResultsPerPage2(resultsPerPage2) {
    changeResultsPerPage(resultsPerPage2);
  }
  function getMoreResults2() {
    return getMoreResults(latestSearchResults);
  }
  function hasMoreResults2() {
    return hasMoreResults(latestSearchResults);
  }
  function getThumbURLsToPreload2() {
    return getThumbURLsToPreload(latestSearchResults);
  }
  function getFirstResults2() {
    return getFirstResults(latestSearchResults);
  }
  function deleteFavorite3(id) {
    return deleteFavorite2(id);
  }
  function setSearchSubset2() {
    setSearchSubset(latestSearchResults);
  }
  function stopSearchSubset2() {
    stopSearchSubset();
  }
  function deleteDatabase3() {
    deleteDatabase2();
  }
  function keepIndexedTagsSorted() {
    FAVORITES_SEARCH_INDEX.keepIndexedTagsSorted(true);
  }
  function buildSearchIndexAsynchronously() {
    FAVORITES_SEARCH_INDEX.buildIndexAsynchronously();
  }
  function buildSearchIndexSynchronously() {
    FAVORITES_SEARCH_INDEX.buildIndexSynchronously();
  }
  function noFavoritesAreVisible() {
    return CONTENT_CONTAINER.querySelector(ITEM_SELECTOR) === null;
  }
  function updateMissingMetadata2() {
    return updateMissingMetadata();
  }
  function onStartedStoringFavorites() {
    onStartedStoringAllFavorites();
  }
  function swapFavoriteButton(id) {
    getFavorite(id)?.swapFavoriteButton();
  }
  function resetTagModifications2() {
    getAllFavorites2().forEach((favorite) => {
      favorite.resetAdditionalTags();
    });
  }
  function changeItemSizeOnShiftScroll(wheelEvent) {
    if (!wheelEvent.originalEvent.shiftKey || getCurrentLayout() === "native") {
      return;
    }
    const usingRowLayout = getCurrentLayout() === "row";
    const id = usingRowLayout ? "row-size" : "column-count";
    const input2 = document.getElementById(id);
    if (!(input2 instanceof HTMLInputElement) && !(input2 instanceof HTMLSelectElement)) {
      return;
    }
    const inGallery2 = CrossFeatureRequests.inGallery.request();
    if (inGallery2) {
      return;
    }
    let delta = wheelEvent.isForward ? 1 : -1;
    if (usingRowLayout) {
      delta = -delta;
    }
    let value = parseInt(input2.value) + delta;
    if (input2 instanceof HTMLSelectElement) {
      const smallestOption = parseInt(input2.querySelector("option")?.value ?? "1");
      const largestOption = parseInt(input2.querySelector("option:last-child")?.value ?? "1");
      value = clamp(value, smallestOption, largestOption);
    }
    input2.value = String(value);
    input2.dispatchEvent(new KeyboardEvent("keydown", {
      key: "Enter",
      bubbles: true
    }));
    input2.dispatchEvent(new Event("change", {
      bubbles: true
    }));
  }
  async function hideUnusedLayoutSizer(layout) {
    await sleep(10);
    const rowSizeContainer = document.querySelector("#row-size-container, #search-page-row-size");
    const columnCountContainer = document.querySelector("#column-count-container, #search-page-column-count");
    if (!(columnCountContainer instanceof HTMLElement) || !(rowSizeContainer instanceof HTMLElement)) {
      return;
    }
    if (layout === "native") {
      columnCountContainer.style.display = "none";
      rowSizeContainer.style.display = "none";
      return;
    }
    const usingRowLayout = layout === "row";
    columnCountContainer.style.display = usingRowLayout ? "none" : "";
    rowSizeContainer.style.display = usingRowLayout ? "" : "none";
  }
  var LOCAL_STORAGE_KEY = "aspectRatios";
  var ASPECT_RATIOS = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || "[]");
  function getAspectRatio(width, height) {
    return `${width}/${height}`;
  }
  async function collectAspectRatios() {
    await waitForAllThumbnailsToLoad();
    const thumbs = getAllThumbs();
    const images = thumbs.map((thumb) => getImageFromThumb(thumb)).filter((image) => image !== null).slice(0, 50);
    const sizes = images.map((image) => getAspectRatio(image.naturalWidth, image.naturalHeight));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sizes.reverse()));
  }
  function getNextAspectRatio() {
    return ASPECT_RATIOS.pop();
  }
  function getRandomAnimationDelay() {
    return roundToTwoDecimalPlaces(randomBetween(0, 0.3));
  }
  function getRandomAnimationDuration() {
    return roundToTwoDecimalPlaces(randomBetween(0.75, 1.5));
  }
  function getPredictedAspectRatio() {
    return getNextAspectRatio() ?? `10/${getSeededRandomPositiveIntegerInRange(5, 20)}`;
  }
  function getPredictedDiscreteDimensions() {
    const aspectRatio = getNextAspectRatio();
    if (aspectRatio !== void 0) {
      return getDimensions2D(aspectRatio);
    }
    const maximizeWidth = Math.random() < 0.5;
    const randomDimension = getRandomPositiveIntegerInRange(125, 250);
    return { width: maximizeWidth ? 250 : randomDimension, height: maximizeWidth ? randomDimension : 250 };
  }
  var SkeletonItem = class {
    element;
    constructor(style) {
      this.element = document.createElement("div");
      this.setStyle(style);
    }
    setStyle(style) {
      if (Object.keys(style).includes("native")) {
        this.setDiscreteDimensions();
      } else {
        this.setAspectRatio();
        this.setCustomStyle(style);
      }
      this.setAnimation();
      this.setClassName();
    }
    setDiscreteDimensions() {
      const dimensions = getPredictedDiscreteDimensions();
      this.element.style.setProperty("width", `${dimensions.width}px`);
      this.element.style.setProperty("height", `${dimensions.height}px`);
    }
    setAnimation() {
      if (GeneralSettings.randomSkeletonAnimationTiming) {
        this.element.style.setProperty("--skeleton-animation-delay", `${getRandomAnimationDelay()}s`);
        this.element.style.setProperty("--skeleton-animation-duration", `${getRandomAnimationDuration()}s`);
      }
    }
    setAspectRatio() {
      this.element.style.setProperty("aspect-ratio", getPredictedAspectRatio());
    }
    setCustomStyle(style) {
      for (const [key, value] of Object.entries(style)) {
        this.element.style.setProperty(key, value);
      }
    }
    setClassName() {
      this.element.className = `skeleton-item favorite ${GeneralSettings.skeletonAnimationClasses}`;
    }
  };
  var Skeleton = class {
    items;
    constructor(style) {
      this.items = this.createItems(style);
    }
    get elements() {
      return this.items.map((item) => item.element);
    }
    get itemCount() {
      return Math.min(Preferences.resultsPerPage.value, 200);
    }
    createItems(style) {
      return Array.from({ length: this.itemCount }, () => new SkeletonItem(style));
    }
  };
  var BaseTiler = class {
    container;
    constructor() {
      this.container = CONTENT_CONTAINER;
    }
    showSkeleton() {
      this.tile(new Skeleton(this.skeletonStyle).elements);
    }
    tile(items) {
      const fragment = document.createDocumentFragment();
      for (const item of items) {
        fragment.appendChild(item);
      }
      this.container.innerHTML = "";
      this.container.appendChild(fragment);
    }
    setColumnCount(columnCount) {
      insertStyleHTML(`
        #favorites-search-gallery-content.${this.className} {
          grid-template-columns: repeat(${columnCount}, 1fr) !important;
        }
        `, `${this.className}-column-count`);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setRowSize(rowSize) {
    }
    addItemsToTop(items) {
      for (const item of items.reverse()) {
        this.container.insertAdjacentElement("afterbegin", item);
      }
    }
    addItemsToBottom(items) {
      for (const item of items) {
        this.container.appendChild(item);
      }
    }
  };
  var ColumnTiler = class extends BaseTiler {
    className = "column";
    skeletonStyle = {
      "width": "100%"
    };
    columns;
    columnCount;
    constructor() {
      super();
      this.columns = [];
      this.columnCount = ON_SEARCH_PAGE ? Preferences.searchPageColumnCount.value : Preferences.columnCount.value;
    }
    get active() {
      return this.container.classList.contains(this.className);
    }
    get inactive() {
      return !this.active;
    }
    tile(items) {
      this.clearContainer();
      this.deleteColumns();
      this.createColumns();
      this.addItemsToColumns(items);
      this.addColumnsToContainer();
      this.updateGetAllThumbsImplementation();
    }
    addItemsToTop(items) {
      if (this.active) {
        this.onDeactivate();
      }
      this.tile(items.concat(getAllThumbs()));
    }
    addItemsToBottom(items) {
      if (this.inactive) {
        this.tile(items);
        return;
      }
      this.addNewItemsToColumns(items);
    }
    setColumnCount(columnCount) {
      super.setColumnCount(columnCount);
      if (columnCount === this.columnCount) {
        return;
      }
      if (this.inactive) {
        this.columnCount = columnCount;
        return;
      }
      const items = this.getAllItems();
      this.columnCount = columnCount;
      this.tile(items);
    }
    onActivate() {
      this.tile(getAllThumbs());
    }
    onDeactivate() {
      const items = this.getAllItems();
      this.container.innerHTML = "";
      super.tile(items);
      resetGetAllThumbsImplementation();
    }
    createColumns() {
      for (let i = 0; i < this.columnCount; i += 1) {
        const column = document.createElement("div");
        column.classList.add("favorites-column");
        this.columns.push(column);
      }
    }
    deleteColumns() {
      for (const column of this.columns) {
        column.remove();
      }
      this.columns = [];
    }
    addItemsToColumns(items) {
      for (let i = 0; i < items.length; i += 1) {
        this.addItemToColumn(i, items[i]);
      }
    }
    addItemToColumn(itemIndex, item) {
      this.columns[itemIndex % this.columnCount].appendChild(item);
    }
    clearContainer() {
      this.container.innerHTML = "";
    }
    addColumnsToContainer() {
      for (const column of this.columns) {
        this.container.appendChild(column);
      }
    }
    getAllItems() {
      const itemCount = Array.from(document.querySelectorAll(ITEM_SELECTOR)).length;
      const result = [];
      const matrix = this.columns.map((column) => Array.from(column.querySelectorAll(ITEM_SELECTOR)));
      for (let i = 0; i < itemCount; i += 1) {
        const column = i % this.columnCount;
        const row = Math.floor(i / this.columnCount);
        const item = matrix[column][row];
        if (item instanceof HTMLElement) {
          result.push(item);
        }
      }
      return result;
    }
    updateGetAllThumbsImplementation() {
      changeGetAllThumbsImplementation(this.getAllItems.bind(this));
    }
    addNewItemsToColumns(items) {
      const columnIndexOffset = this.getIndexOfNextAvailableColumn();
      for (let i = 0; i < items.length; i += 1) {
        this.addItemToColumn(i + columnIndexOffset, items[i]);
      }
    }
    getIndexOfNextAvailableColumn() {
      const columnLengths = this.columns.map((column) => column.children.length);
      const minColumnLength = Math.min(...columnLengths);
      const firstIndexWithMinimumLength = columnLengths.findIndex((length) => length === minColumnLength);
      return firstIndexWithMinimumLength === -1 ? 0 : firstIndexWithMinimumLength;
    }
  };
  var GridTiler = class extends BaseTiler {
    className = "grid";
    skeletonStyle = {
      "width": "100%"
    };
    onActivate() {
    }
    onDeactivate() {
    }
  };
  var NativeTiler = class extends BaseTiler {
    className = "native";
    skeletonStyle = {
      "native": ""
    };
    onActivate() {
    }
    onDeactivate() {
    }
  };
  var RowTiler = class extends BaseTiler {
    className = "row";
    skeletonStyle = {};
    currentlyMarkingLastRow = false;
    tile(items) {
      super.tile(items);
      this.markItemsOnLastRow();
    }
    addItemsToBottom(items) {
      super.addItemsToBottom(items);
      this.markItemsOnLastRow();
    }
    setColumnCount() {
    }
    setRowSize(rowSize) {
      const minWidth = Math.floor(window.innerWidth / 20);
      const maxWidth = Math.floor(window.innerWidth / 4);
      const pixelSize = Math.round(mapRange(rowSize, GeneralSettings.rowSizeBounds.min, GeneralSettings.rowSizeBounds.max, minWidth, maxWidth));
      insertStyleHTML(`
      #favorites-search-gallery-content.row {
        .favorite {
          height: ${pixelSize}px;
        }
      }
    `, "row-size");
      this.markItemsOnLastRow();
    }
    onActivate() {
      this.markItemsOnLastRow();
    }
    onDeactivate() {
    }
    async markItemsOnLastRow() {
      if (this.currentlyMarkingLastRow) {
        return;
      }
      this.currentlyMarkingLastRow = true;
      await waitForAllThumbnailsToLoad();
      const items = getAllThumbs();
      if (items.length === 0) {
        return;
      }
      this.unMarkAllItemsAsLastRow(items);
      this.markItemsAsLastRow(this.getItemsOnLastRow(items));
      this.currentlyMarkingLastRow = false;
    }
    unMarkAllItemsAsLastRow(items) {
      for (const item of items) {
        item.classList.remove("last-row");
      }
    }
    markItemsAsLastRow(items) {
      for (const item of items) {
        item.classList.add("last-row");
      }
    }
    getItemsOnLastRow(items) {
      items = items.slice().reverse();
      const itemsOnLastRow = [];
      const lastRowY = items[0].offsetTop;
      for (const item of items) {
        if (item.offsetTop !== lastRowY) {
          break;
        }
        itemsOnLastRow.push(item);
      }
      return itemsOnLastRow;
    }
  };
  var SquareTiler = class extends BaseTiler {
    className = "square";
    skeletonStyle = {
      "width": "100%",
      "height": "100%",
      "aspect-ratio": "1/1"
    };
    onActivate() {
    }
    onDeactivate() {
    }
  };
  var TILERS = [
    new ColumnTiler(),
    new GridTiler(),
    new RowTiler(),
    new SquareTiler(),
    new NativeTiler()
  ];
  var currentLayout = ON_FAVORITES_PAGE ? Preferences.favoritesLayout.value : Preferences.searchPageLayout.value;
  function getCurrentTiler() {
    return TILERS.find((tiler) => tiler.className === currentLayout) ?? TILERS[0];
  }
  function getCurrentLayout() {
    return currentLayout;
  }
  function tile(items) {
    getCurrentTiler().tile(items);
  }
  function addItemsToBottom(items) {
    getCurrentTiler().addItemsToBottom(items);
  }
  function addItemsToTop(items) {
    getCurrentTiler().addItemsToTop(items);
  }
  function changeLayout(layout) {
    if (currentLayout === layout) {
      return;
    }
    getCurrentTiler().onDeactivate();
    CONTENT_CONTAINER.className = layout;
    currentLayout = layout;
    getCurrentTiler().onActivate();
  }
  function updateColumnCount(columnCount) {
    for (const tiler of TILERS) {
      tiler.setColumnCount(columnCount);
    }
  }
  function updateRowSize(rowSize) {
    for (const tiler of TILERS) {
      tiler.setRowSize(rowSize);
    }
  }
  function showSkeleton() {
    getCurrentTiler().showSkeleton();
  }
  function addTilerEventListeners() {
    Events.document.wheel.on(changeItemSizeOnShiftScroll);
    Events.favorites.columnCountChanged.on(updateColumnCount);
    Events.favorites.rowSizeChanged.on(updateRowSize);
    Events.favorites.layoutChanged.on(hideUnusedLayoutSizer);
    Events.searchPage.layoutChanged.on(hideUnusedLayoutSizer);
  }
  function setupTiler() {
    CONTENT_CONTAINER.className = currentLayout;
    updateColumnCount(ON_SEARCH_PAGE ? Preferences.searchPageColumnCount.value : Preferences.columnCount.value);
    updateRowSize(ON_SEARCH_PAGE ? Preferences.searchPageRowSize.value : Preferences.rowSize.value);
    addTilerEventListeners();
  }
  var EMPTY_FAVORITES_PAGINATION_PARAMETERS = {
    currentPageNumber: 1,
    finalPageNumber: 1,
    favoritesCount: 0,
    startIndex: 0,
    endIndex: 0
  };
  var CONTAINER2 = createContainer();
  var RANGE_INDICATOR = document.createElement("label");
  var PAGE_NUMBER_REGEX = /favorites-page-(\d+)/;
  RANGE_INDICATOR.id = "pagination-range-label";
  function createContainer() {
    const menu = document.createElement("span");
    menu.id = "favorites-pagination-container";
    return menu;
  }
  function insertMenu() {
    if (ON_DESKTOP_DEVICE) {
      const placeToInsert = document.getElementById("favorites-pagination-placeholder");
      if (placeToInsert !== null) {
        placeToInsert.insertAdjacentElement("afterend", CONTAINER2);
        placeToInsert.remove();
      }
      return;
    }
    const footerBottom = document.getElementById("mobile-footer-bottom");
    if (footerBottom !== null) {
      footerBottom.insertAdjacentElement("afterbegin", CONTAINER2);
    }
  }
  function insert() {
    const matchCountLabel = document.getElementById("match-count-label");
    if (matchCountLabel !== null) {
      matchCountLabel.insertAdjacentElement("afterend", RANGE_INDICATOR);
    }
    insertMenu();
  }
  function create(parameters) {
    CONTAINER2.innerHTML = "";
    updateRangeIndicator(parameters.startIndex, parameters.endIndex, parameters.favoritesCount);
    createNumberTraversalButtons(parameters.currentPageNumber, parameters.finalPageNumber);
    createArrowTraversalButtons(parameters);
    createGotoSpecificPageInputs(parameters.finalPageNumber);
  }
  function update(parameters) {
    const pageNumberButtons = Array.from(document.getElementsByClassName("pagination-number"));
    const atMaxPageNumberButtons = pageNumberButtons.length >= FavoritesSettings.maxPageNumberButtons;
    if (!atMaxPageNumberButtons) {
      create(parameters);
      return;
    }
    const middlePageNumberButton = pageNumberButtons[Math.floor(pageNumberButtons.length / 2)];
    if (!(middlePageNumberButton instanceof HTMLElement)) {
      create(parameters);
      return;
    }
    const middlePageNumberMatch = PAGE_NUMBER_REGEX.exec(middlePageNumberButton.id);
    if (middlePageNumberMatch === null) {
      create(parameters);
      return;
    }
    const middlePageNumber = parseInt(middlePageNumberMatch[1]);
    if (parameters.currentPageNumber <= middlePageNumber) {
      return;
    }
    create(parameters);
  }
  function updateRangeIndicator(start, end, count) {
    end = Math.min(count, end);
    RANGE_INDICATOR.textContent = end === 0 ? "" : `${start + 1} - ${end}`;
  }
  function createNumberTraversalButtons(currentPageNumber4, finalPageNumber) {
    const pageNumbers = getNumbersAround(currentPageNumber4, FavoritesSettings.maxPageNumberButtons, 1, finalPageNumber);
    for (const pageNumber of pageNumbers) {
      createNumberTraversalButton(currentPageNumber4, pageNumber);
    }
  }
  function createNumberTraversalButton(currentPageNumber4, pageNumber) {
    const button = document.createElement("button");
    const selected = currentPageNumber4 === pageNumber;
    button.id = `favorites-page-${pageNumber}`;
    button.title = `Goto page ${pageNumber}`;
    button.className = "pagination-number";
    button.classList.toggle("selected", selected);
    button.onclick = () => {
      Events.favorites.pageSelected.emit(pageNumber);
    };
    CONTAINER2.appendChild(button);
    button.textContent = String(pageNumber);
  }
  function createArrowTraversalButtons(parameters) {
    const previous = createArrowTraversalButton("previous", "<", "afterbegin");
    const first = createArrowTraversalButton("first", "<<", "afterbegin");
    const next = createArrowTraversalButton("next", ">", "beforeend");
    const final = createArrowTraversalButton("final", ">>", "beforeend");
    updateArrowTraversalButtonInteractability(previous, first, next, final, parameters);
  }
  function createArrowTraversalButton(name, textContent, position) {
    const button = document.createElement("button");
    button.id = `${name}-page`;
    button.title = `Goto ${name} page`;
    button.textContent = textContent;
    button.onclick = () => {
      Events.favorites.relativePageSelected.emit(name);
    };
    CONTAINER2.insertAdjacentElement(position, button);
    return button;
  }
  function createGotoSpecificPageInputs(finalPageNumber) {
    if (finalPageNumber === 1) {
      return;
    }
    const container3 = document.createElement("span");
    const input2 = document.createElement("input");
    const button = document.createElement("button");
    container3.title = "Goto specific page";
    input2.type = "number";
    input2.placeholder = "#";
    input2.id = "goto-page-input";
    button.textContent = "Go";
    button.id = "goto-page-button";
    button.onclick = () => {
      if (isOnlyDigits(input2.value)) {
        Events.favorites.pageSelected.emit(Number(input2.value));
      }
    };
    input2.onkeydown = (event) => {
      if (event.key === "Enter") {
        button.click();
      }
    };
    container3.appendChild(input2);
    container3.appendChild(button);
    CONTAINER2.appendChild(container3);
  }
  function updateArrowTraversalButtonInteractability(previousPage, firstPage, nextPage, finalPage, parameters) {
    if (parameters.currentPageNumber === 1) {
      previousPage.disabled = true;
      firstPage.disabled = true;
    }
    if (parameters.currentPageNumber === parameters.finalPageNumber) {
      nextPage.disabled = true;
      finalPage.disabled = true;
    }
  }
  function toggle(value) {
    const html = `
      #favorites-pagination-container,
      #results-per-page-container,
      #favorite-finder,
      #pagination-range-label,
      #favorites-bottom-navigation-buttons
      {
        display: none !important;
      }
    `;
    insertStyleHTML(value ? "" : html, "pagination-menu-enable");
  }
  function setupFavoritesPaginationMenu() {
    insert();
    create(EMPTY_FAVORITES_PAGINATION_PARAMETERS);
    toggle(!Preferences.infiniteScrollEnabled.value);
  }
  function preloadThumbnails(favorites3) {
    preloadImages(favorites3.map((favorite) => favorite.thumbURL));
  }
  async function preloadImages(urls) {
    await waitForAllThumbnailsToLoad();
    for (const url of urls) {
      await sleep(3);
      preloadImage(url);
    }
  }
  function preloadImage(url) {
    const img = new Image();
    img.src = url;
  }
  var matchCountIndicator;
  var statusIndicator;
  var expectedTotalFavoritesCount = null;
  var statusTimeout;
  var TEMPORARY_STATUS_TIMEOUT = 1e3;
  var FETCHING_STATUS_PREFIX = ON_MOBILE_DEVICE ? "" : "Favorites ";
  function setStatus(text) {
    clearTimeout(statusTimeout);
    statusIndicator.classList.remove("hidden");
    statusIndicator.textContent = text;
  }
  function clearStatus() {
    statusIndicator.textContent = "";
    statusIndicator.classList.add("hidden");
  }
  function setTemporaryStatus(text) {
    setStatus(text);
    clearTimeout(statusTimeout);
    statusTimeout = setTimeout(clearStatus, TEMPORARY_STATUS_TIMEOUT);
  }
  function setMatchCount(value) {
    matchCountIndicator.textContent = `${value} ${value === 1 ? "Result" : "Results"}`;
  }
  function updateStatusWhileFetching(searchResultsCount, favoritesFoundCount) {
    let statusText = `Fetching ${FETCHING_STATUS_PREFIX}${favoritesFoundCount}`;
    if (expectedTotalFavoritesCount !== null) {
      statusText = `${statusText} / ${expectedTotalFavoritesCount}`;
    }
    setStatus(statusText);
    setMatchCount(searchResultsCount);
  }
  function notifyNewFavoritesFound(newFavoritesCount) {
    if (newFavoritesCount > 0) {
      setStatus(`Found ${newFavoritesCount} new favorite${newFavoritesCount > 1 ? "s" : ""}`);
    }
  }
  async function setExpectedTotalFavoritesCount() {
    expectedTotalFavoritesCount = await getFavoritesCount(getFavoritesPageId() ?? "");
  }
  function setupFavoritesStatus() {
    setExpectedTotalFavoritesCount();
    matchCountIndicator = FAVORITES_SEARCH_GALLERY_CONTAINER.querySelector("#match-count-label") ?? document.createElement("label");
    statusIndicator = FAVORITES_SEARCH_GALLERY_CONTAINER.querySelector("#favorites-load-status-label") ?? document.createElement("label");
  }
  function toggleAddOrRemoveButtons(value) {
    insertStyleHTML(`
        .remove-favorite-button, .add-favorite-button {
          visibility: ${value ? "visible" : "hidden"} !important;
        }
    `, "add-or-remove-button-visibility");
  }
  function toggleDownloadButtons(value) {
    insertStyleHTML(`
        .download-button {
          visibility: ${value ? "visible" : "hidden"} !important;
        }
    `, "download-button-visibility");
  }
  function toggleHeader(value) {
    insertStyleHTML(`#header {display: ${value ? "block" : "none"}}`, "header");
  }
  function setStatus2(message) {
    setStatus(message);
  }
  function setTemporaryStatus2(message) {
    setTemporaryStatus(message);
  }
  function updateStatusWhileFetching2(searchResultCount, totalFavoritesCount) {
    updateStatusWhileFetching(searchResultCount, totalFavoritesCount);
  }
  function insertNewSearchResults(thumbs) {
    addItemsToBottom(thumbs);
  }
  function insertNewSearchResultsOnReload(results) {
    addItemsToTop(results.newSearchResults.map((favorite) => favorite.root));
    notifyNewFavoritesFound(results.newFavorites.length);
  }
  function changeLayout2(layout) {
    changeLayout(layout);
  }
  function showSearchResults(searchResults) {
    tile(searchResults.map((result) => result.root));
    scrollToTop();
  }
  function setMatchCount2(matchCount) {
    setMatchCount(matchCount);
  }
  function createPageSelectionMenu(parameters) {
    create(parameters);
  }
  function createPageSelectionMenuWhileFetching(parameters) {
    update(parameters);
  }
  async function revealFavorite(id) {
    await waitForAllThumbnailsToLoad();
    const thumb = document.getElementById(id);
    if (thumb === null || thumb.classList.contains("blink")) {
      return;
    }
    thumb.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
    thumb.classList.add("blink");
    await sleep(1500);
    thumb.classList.remove("blink");
  }
  function togglePaginationMenu(value) {
    toggle(value);
  }
  function setupFavoritesView() {
    createFavoriteItemHTMLTemplates();
    collectAspectRatios();
    setupFavoritesStatus();
    setupTiler();
    showSkeleton();
    hideUnusedLayoutSizer(Preferences.favoritesLayout.value);
    setupFavoritesPaginationMenu();
    toggleAddOrRemoveButtons(USER_IS_ON_THEIR_OWN_FAVORITES_PAGE ? Preferences.removeButtonsVisible.value : Preferences.addButtonsVisible.value);
    toggleDownloadButtons(Preferences.downloadButtonsVisible.value);
  }
  function preloadThumbnails2(favorites3) {
    if (GeneralSettings.preloadThumbnails) {
      preloadThumbnails(favorites3);
    }
  }
  function preloadURLs(urls) {
    if (GeneralSettings.preloadThumbnails) {
      preloadImages(urls);
    }
  }
  var PageBottomObserver = class {
    intersectionObserver;
    onBottomReached;
    constructor(onBottomReached) {
      this.onBottomReached = onBottomReached;
      this.intersectionObserver = this.createIntersectionObserver();
    }
    disconnect() {
      this.intersectionObserver.disconnect();
    }
    refresh() {
      this.disconnect();
      this.observeBottomElements();
    }
    createIntersectionObserver() {
      return new IntersectionObserver(this.onIntersectionChanged.bind(this), {
        threshold: [0.1],
        rootMargin: `0% 0% ${GeneralSettings.infiniteScrollMargin} 0%`
      });
    }
    observeBottomElements() {
      const bottomElements = Array.from(CONTENT_CONTAINER.querySelectorAll(`.${ITEM_CLASS_NAME}:last-child`));
      for (const element of bottomElements) {
        this.intersectionObserver.observe(element);
      }
    }
    onIntersectionChanged(entries) {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          this.onBottomReached();
          this.disconnect();
          return;
        }
      }
    }
  };
  var InfiniteScrollFlow = class {
    pageBottomObserver;
    constructor() {
      this.pageBottomObserver = new PageBottomObserver(this.showMoreResults.bind(this));
    }
    present() {
      this.showFirstResults();
      Events.favorites.pageChanged.emit();
    }
    onLayoutChanged() {
      this.pageBottomObserver.refresh();
    }
    reset() {
      this.pageBottomObserver.disconnect();
    }
    handleNewSearchResults() {
      if (noFavoritesAreVisible()) {
        this.showMoreResults();
      }
    }
    revealFavorite() {
    }
    loadNewFavoritesInGallery() {
      if (!ON_FAVORITES_PAGE || !hasMoreResults2()) {
        return false;
      }
      this.showMoreResults();
      return true;
    }
    async showMoreResults() {
      if (!ON_FAVORITES_PAGE) {
        return false;
      }
      const moreResults = getMoreResults2();
      if (moreResults.length === 0) {
        return false;
      }
      insertNewSearchResults(moreResults);
      Events.favorites.favoritesAddedToCurrentPage.emit(moreResults);
      await waitForAllThumbnailsToLoad();
      const urlsToPreload = getThumbURLsToPreload2();
      preloadURLs(urlsToPreload);
      this.pageBottomObserver.refresh();
      return true;
    }
    async showFirstResults() {
      showSearchResults(getFirstResults2());
      await waitForAllThumbnailsToLoad();
      this.pageBottomObserver.refresh();
      await sleep(50);
    }
  };
  var FavoritesInfiniteScrollFlow = new InfiniteScrollFlow();
  var PaginationFlow = class {
    addedFirstResults = false;
    present(results) {
      paginate2(results);
      changePage2(1);
      this.showCurrentPage();
    }
    gotoPage(pageNumber) {
      changePage2(pageNumber);
      this.showCurrentPage();
    }
    gotoRelativePage(relativePage) {
      if (gotoRelativePage2(relativePage)) {
        this.showCurrentPage();
      }
    }
    showCurrentPage() {
      showSearchResults(getFavoritesOnCurrentPage2());
      createPageSelectionMenu(getPaginationParameters2());
      preloadThumbnails2(getFavoritesOnNextPage2());
      preloadThumbnails2(getFavoritesOnPreviousPage2());
      Events.favorites.pageChanged.emit();
    }
    onLayoutChanged() {
    }
    revealFavorite(id) {
      if (gotoPageWithFavoriteId(id)) {
        this.showCurrentPage();
      }
      revealFavorite(id);
    }
    loadNewFavoritesInGallery(direction) {
      this.gotoAdjacentPage(direction);
      return true;
    }
    reset() {
    }
    handleNewSearchResults() {
      paginate2(getLatestSearchResults());
      createPageSelectionMenuWhileFetching(getPaginationParameters2());
      this.addNewlyFetchedSearchResultsToCurrentPage();
      Events.favorites.searchResultsUpdated.emit();
    }
    addNewlyFetchedSearchResultsToCurrentPage() {
      if (!onFinalPage2() && this.addedFirstResults) {
        return;
      }
      const newFavorites = getFavoritesOnCurrentPage2().filter((favorite) => document.getElementById(favorite.id) === null);
      if (newFavorites.length > 0) {
        this.addedFirstResults = true;
      }
      const thumbs = newFavorites.map((favorite) => favorite.root);
      insertNewSearchResults(thumbs);
      Events.favorites.favoritesAddedToCurrentPage.emit(thumbs);
    }
    gotoAdjacentPage(direction) {
      if (gotoAdjacentPage2(direction)) {
        this.showCurrentPage();
      }
    }
  };
  var FavoritesPaginationFlow = new PaginationFlow();
  function getPresentationFlow() {
    return Preferences.infiniteScrollEnabled.value ? FavoritesInfiniteScrollFlow : FavoritesPaginationFlow;
  }
  function present(favorites3) {
    getPresentationFlow().present(favorites3);
  }
  function clear() {
    getPresentationFlow().present([]);
  }
  function revealFavorite2(id) {
    getPresentationFlow().revealFavorite(id);
  }
  function handleNewSearchResults() {
    getPresentationFlow().handleNewSearchResults();
  }
  function loadNewFavoritesInGallery(direction) {
    return getPresentationFlow().loadNewFavoritesInGallery(direction);
  }
  function showSearchResults2(searchResults) {
    Events.favorites.searchResultsUpdated.emit();
    setMatchCount2(searchResults.length);
    present(searchResults);
  }
  function searchFavorites(searchQuery2) {
    showSearchResults2(getSearchResults(searchQuery2));
  }
  function searchFavoritesUsingLatestQuery() {
    showSearchResults2(getSearchResultsFromLatestQuery());
  }
  function showLatestSearchResults() {
    showSearchResults2(getLatestSearchResults());
  }
  function showAllFavorites() {
    searchFavorites("");
  }
  function shuffleSearchResults() {
    showSearchResults2(getShuffledSearchResults());
  }
  function invertSearchResults2() {
    invertSearchResults();
    showLatestSearchResults();
  }
  function findFavoriteInAll(id) {
    showAllFavorites();
    revealFavorite2(id);
  }
  async function loadAllFavorites2() {
    await loadAllFavoritesFromDatabase3();
    if (hasFavorites()) {
      Events.favorites.favoritesLoadedFromDatabase.emit();
      showLoadedFavorites();
      await loadNewFavorites();
    } else {
      await fetchAllFavorites4();
      Events.favorites.startedStoringAllFavorites.emit();
      await saveAllFavorites();
    }
    Events.favorites.favoritesLoaded.emit();
  }
  async function loadAllFavoritesFromDatabase3() {
    setStatus2("Loading favorites");
    await loadAllFavoritesFromDatabase2();
  }
  function hasFavorites() {
    return getAllFavorites2().length > 0;
  }
  async function fetchAllFavorites4() {
    clear();
    Events.favorites.startedFetchingFavorites.emit();
    await fetchAllFavorites3(processFetchedFavorites);
  }
  async function saveAllFavorites() {
    setStatus2("Saving favorites");
    await storeAllFavorites2();
    setTemporaryStatus2("All favorites saved");
  }
  function showLoadedFavorites() {
    setTemporaryStatus2("Favorites loaded");
    showLatestSearchResults();
  }
  function processFetchedFavorites() {
    updateStatusWhileFetching2(getLatestSearchResults().length, getAllFavorites2().length);
    Events.favorites.searchResultsUpdated.emit();
    handleNewSearchResults();
  }
  async function loadNewFavorites() {
    const results = await fetchNewFavoritesOnReload3();
    if (results.newSearchResults.length === 0) {
      return;
    }
    insertNewSearchResultsOnReload(results);
    saveNewFavorites(results.newFavorites);
    paginate2(getLatestSearchResults());
    Events.favorites.newFavoritesFoundOnReload.emit(results.newSearchResults);
    Events.favorites.searchResultsUpdated.emit();
  }
  async function saveNewFavorites(newFavorites) {
    await storeNewFavorites2(newFavorites);
    setTemporaryStatus2("New favorites saved");
  }
  function updateMissingMetadata3() {
    updateMissingMetadata2();
  }
  function onFavoritesLoaded() {
    updateMissingMetadata3();
    collectAspectRatios();
    buildSearchIndexAsynchronously();
  }
  function onFavoritesLoadedFromDatabase() {
    keepIndexedTagsSorted();
  }
  function onStartedFetchingFavorites() {
    keepIndexedTagsSorted();
    buildSearchIndexSynchronously();
  }
  function onStartedStoringAllFavorites2() {
    onStartedStoringFavorites();
  }
  function changeLayout3(layout) {
    changeLayout2(layout);
  }
  function toggleInfiniteScroll(value) {
    FavoritesInfiniteScrollFlow.reset();
    togglePaginationMenu(!value);
    showLatestSearchResults();
  }
  function toggleBlacklist2(value) {
    toggleBlacklist(value);
    searchFavoritesUsingLatestQuery();
  }
  function changeSortingMethod(sortingMethod2) {
    setSortingMethod2(sortingMethod2);
    searchFavoritesUsingLatestQuery();
  }
  function toggleSortAscending2(value) {
    toggleSortAscending(value);
    searchFavoritesUsingLatestQuery();
  }
  function changeAllowedRatings2(ratings) {
    changeAllowedRatings(ratings);
    searchFavoritesUsingLatestQuery();
  }
  function changeResultsPerPage3(resultsPerPage2) {
    changeResultsPerPage2(resultsPerPage2);
    showLatestSearchResults();
  }
  function resetFavorites() {
    deleteDatabase3();
    deleteExtensionsDatabase();
  }
  function updateShowOnHoverOptionTriggeredFromGallery(value) {
    const showOnHoverCheckbox = document.getElementById("show-on-hover");
    if (showOnHoverCheckbox !== null && showOnHoverCheckbox instanceof HTMLInputElement) {
      showOnHoverCheckbox.checked = value;
      Preferences.showOnHoverEnabled.set(value);
    }
  }
  function toggleOptionHotkeyHints(value) {
    insertStyleHTML(value ? "" : ".option-hint {display:none;}", "option-hint-visibility");
  }
  function toggleUI(value) {
    const menu = document.getElementById("favorites-search-gallery-menu");
    const panels = document.getElementById("favorites-search-gallery-menu-panels");
    const header = document.getElementById("header");
    const container3 = document.getElementById("show-ui-container");
    const bottomPanel4 = document.getElementById("bottom-panel-4");
    if (menu === null || panels === null || container3 === null || bottomPanel4 === null) {
      return;
    }
    if (value) {
      if (header !== null) {
        header.style.display = "";
      }
      bottomPanel4.insertAdjacentElement("afterbegin", container3);
      panels.style.display = "flex";
      menu.removeAttribute("style");
    } else {
      menu.appendChild(container3);
      if (header !== null) {
        header.style.display = "none";
      }
      panels.style.display = "none";
      menu.style.background = getComputedStyle(document.body).background;
    }
    container3.classList.toggle("ui-hidden", !value);
  }
  function toggleFavoritesOptions(value) {
    if (ON_MOBILE_DEVICE) {
      document.getElementById("left-favorites-panel-bottom-row")?.classList.toggle("hidden", !value);
      insertStyleHTML(`
            #mobile-button-row {
              display: ${value ? "block" : "none"};
            }
            `, "options");
      return;
    }
    insertStyleHTML(`
        .options-container {
          display: ${value ? "block" : "none"};
        }
        `, "options");
  }
  function addFavoritesEventsListeners() {
    Events.favorites.favoritesLoadedFromDatabase.on(onFavoritesLoadedFromDatabase, { once: true });
    Events.favorites.startedFetchingFavorites.on(onStartedFetchingFavorites, { once: true });
    Events.favorites.startedStoringAllFavorites.on(onStartedStoringAllFavorites2, { once: true });
    Events.favorites.favoritesLoaded.on(onFavoritesLoaded, { once: true });
    Events.favorites.searchStarted.on(searchFavorites);
    Events.favorites.shuffleButtonClicked.on(shuffleSearchResults);
    Events.favorites.invertButtonClicked.on(invertSearchResults2);
    Events.favorites.pageSelected.on(FavoritesPaginationFlow.gotoPage.bind(FavoritesPaginationFlow));
    Events.favorites.relativePageSelected.on(FavoritesPaginationFlow.gotoRelativePage.bind(FavoritesPaginationFlow));
    Events.favorites.searchSubsetClicked.on(setSearchSubset2);
    Events.favorites.stopSearchSubsetClicked.on(stopSearchSubset2);
    Events.favorites.resetConfirmed.on(resetFavorites);
    Events.favorites.favoriteRemoved.on(deleteFavorite3);
    Events.favorites.missingMetadataFound.on(updateMetadata3);
    Events.favorites.findFavoriteStarted.on(revealFavorite2);
    Events.favorites.findFavoriteInAllStarted.on(findFavoriteInAll);
    Events.gallery.showOnHoverToggled.on(updateShowOnHoverOptionTriggeredFromGallery);
    Events.gallery.favoriteToggled.on(swapFavoriteButton);
    Events.tagModifier.resetConfirmed.on(resetTagModifications2);
    Events.favorites.infiniteScrollToggled.on(toggleInfiniteScroll);
    Events.favorites.blacklistToggled.on(toggleBlacklist2);
    Events.favorites.layoutChanged.on(changeLayout3);
    Events.favorites.sortAscendingToggled.on(toggleSortAscending2);
    Events.favorites.sortingMethodChanged.on(changeSortingMethod);
    Events.favorites.allowedRatingsChanged.on(changeAllowedRatings2);
    Events.favorites.resultsPerPageChanged.on(changeResultsPerPage3);
    CrossFeatureRequests.loadNewFavoritesInGallery.setHandler(loadNewFavoritesInGallery);
    CrossFeatureRequests.latestFavoritesSearchResults.setHandler(getLatestSearchResults);
  }
  function createFooter() {
    const footer = document.createElement("div");
    const footerHeader = document.createElement("div");
    const footerTop = document.createElement("div");
    const footerBottom = document.createElement("div");
    footer.id = "mobile-footer";
    footerHeader.id = "mobile-footer-header";
    footerTop.id = "mobile-footer-top";
    footerBottom.id = "mobile-footer-bottom";
    footer.className = "dark-green-gradient";
    footer.appendChild(footerHeader);
    footer.appendChild(footerTop);
    footer.appendChild(footerBottom);
    FAVORITES_SEARCH_GALLERY_CONTAINER.appendChild(footer);
  }
  function moveStatusToFooter() {
    const status = document.getElementById("favorites-load-status");
    const footerTop = document.getElementById("mobile-footer-top");
    if (status === null || footerTop === null) {
      return;
    }
    footerTop.appendChild(status);
  }
  async function createControlsGuide() {
    insertHTMLAndExtractStyle(FAVORITES_SEARCH_GALLERY_CONTAINER, "beforeend", CONTROLS_HTML);
    const controlGuide = document.getElementById("controls-guide");
    if (controlGuide === null) {
      return;
    }
    const anchor = document.createElement("a");
    anchor.textContent = "Controls";
    anchor.href = "#";
    anchor.onmousedown = (event) => {
      event.preventDefault();
      event.stopPropagation();
      controlGuide.classList.toggle("active", true);
    };
    controlGuide.ontouchstart = (event) => {
      event.preventDefault();
      event.stopPropagation();
      controlGuide.classList.toggle("active", false);
    };
    await sleep(0);
    const helpLinksContainer = document.getElementById("help-links-container");
    if (helpLinksContainer === null) {
      return;
    }
    helpLinksContainer.insertAdjacentElement("afterbegin", anchor);
    controlGuide.onmousedown = () => {
      controlGuide.classList.toggle("active", false);
    };
  }
  var DEFAULT_MENU_ELEMENT = {
    parentId: "",
    id: "",
    enabled: true,
    title: "bruh",
    position: "afterbegin",
    textContent: "",
    event: null,
    function: DO_NOTHING,
    triggerOnCreation: false
  };
  function createCheckboxTemplate(partial) {
    return {
      ...DEFAULT_MENU_ELEMENT,
      savePreference: true,
      event: null,
      defaultValue: false,
      hotkey: "",
      function: DO_NOTHING,
      preference: null,
      triggerOnCreation: false,
      ...partial
    };
  }
  function createCheckboxElement(partial) {
    const template2 = createCheckboxTemplate(partial);
    const parent = document.getElementById(template2.parentId);
    if (parent === null) {
      return;
    }
    const checkbox = document.createElement("input");
    checkbox.id = template2.id;
    checkbox.type = "checkbox";
    checkbox.checked = template2.preference === null ? template2.defaultValue : template2.preference.value;
    const onChange = () => {
      if (template2.savePreference && template2.preference !== null) {
        template2.preference.set(checkbox.checked);
      }
      if (template2.event !== null) {
        template2.event.emit(checkbox.checked);
      }
      template2.function(checkbox.checked);
    };
    if (template2.triggerOnCreation) {
      onChange();
    }
    checkbox.addEventListener("change", onChange);
    parent.insertAdjacentElement(template2.position, checkbox);
    if (template2.hotkey === "") {
      return;
    }
    Events.document.keydown.on((event) => {
      if (!event.isHotkey || event.key.toLowerCase() !== template2.hotkey.toLowerCase()) {
        return;
      }
      const inGallery2 = CrossFeatureRequests.inGallery.request();
      if (inGallery2) {
        return;
      }
      checkbox.checked = !checkbox.checked;
      onChange();
    });
  }
  function createToggleSwitch(partial) {
    const template2 = createCheckboxTemplate(partial);
    const parent = document.getElementById(template2.parentId);
    if (parent === null) {
      return;
    }
    const toggleSwitchId = `${template2.id}-toggle-switch`;
    const switchHTML = `
    <label id="${toggleSwitchId}" class="toggle-switch" title="${template2.title}">
        <span class="slider round"></span>
        <span class="toggle-switch-label">${template2.textContent}</span>
    </label>`;
    parent.insertAdjacentHTML(template2.position, switchHTML);
    template2.position = "afterbegin";
    template2.parentId = toggleSwitchId;
    createCheckboxElement(template2);
    const checkbox = document.getElementById(template2.id);
    if (checkbox !== null) {
      checkbox.style.width = "0";
      checkbox.style.height = "0";
      checkbox.style.opacity = "0";
    }
  }
  function createCheckboxOption(partial) {
    const parent = document.getElementById(partial.parentId || "not-an-id");
    if (parent === null) {
      return;
    }
    const container3 = document.createElement("div");
    const label = document.createElement("label");
    const span = document.createElement("span");
    const hint = document.createElement("span");
    const labelId = `${partial.id}-label`;
    container3.id = `${partial.id}-container`;
    label.id = labelId;
    label.className = "checkbox";
    label.title = partial.title ?? "";
    span.textContent = `${partial.textContent ?? "Missing text"}`;
    hint.className = "option-hint";
    hint.textContent = ` (${partial.hotkey ?? "Missing hotkey"})`;
    container3.appendChild(label);
    label.appendChild(span);
    if (partial.hotkey !== "" && partial.hotkey !== void 0) {
      label.appendChild(hint);
    }
    parent.insertAdjacentElement(partial.position ?? "afterbegin", container3);
    partial.parentId = labelId;
    createCheckboxElement(partial);
  }
  function createButtonTemplate(partial) {
    return {
      ...DEFAULT_MENU_ELEMENT,
      event: null,
      hotkey: "",
      function: DO_NOTHING,
      triggerOnCreation: false,
      rightClickEnabled: false,
      ...partial
    };
  }
  function createButtonElement(partial) {
    const template2 = createButtonTemplate(partial);
    const parent = document.getElementById(template2.parentId);
    if (!template2.enabled || parent === null) {
      return;
    }
    const button = document.createElement("button");
    parent.insertAdjacentElement(template2.position, button);
    button.id = template2.id;
    button.title = template2.title;
    button.textContent = template2.textContent;
    if (template2.event === null) {
      return;
    }
    const eventEmitter = template2.event;
    button.onclick = (event) => {
      template2.function(event);
      eventEmitter.emit(event);
    };
    if (template2.rightClickEnabled) {
      button.oncontextmenu = (event) => {
        eventEmitter.emit(event);
      };
    }
  }
  var HoldButton = class _HoldButton extends HTMLElement {
    static defaultPollingTime = 100;
    static minPollingTime = 40;
    static maxPollingTime = 500;
    intervalId;
    timeoutId;
    pollingTime = _HoldButton.defaultPollingTime;
    holdingDown = false;
    static {
      customElements.define("hold-button", _HoldButton);
    }
    connectedCallback() {
      if (ON_MOBILE_DEVICE) {
        return;
      }
      this.addEventListeners();
      this.initializePollingTime();
    }
    attributeChangedCallback(name, _, newValue) {
      switch (name) {
        case "pollingtime":
          this.setPollingTime(newValue);
          break;
        default:
          break;
      }
    }
    onmousehold() {
    }
    onMouseLeaveWhileHoldingDown() {
    }
    initializePollingTime() {
      const pollingTime = this.getAttribute("pollingtime");
      if (pollingTime !== null) {
        this.setPollingTime(pollingTime);
      }
    }
    setPollingTime(newValue) {
      this.stopPolling();
      const pollingTime = parseFloat(newValue) ?? _HoldButton.defaultPollingTime;
      this.pollingTime = clamp(Math.round(pollingTime), _HoldButton.minPollingTime, _HoldButton.maxPollingTime);
    }
    addEventListeners() {
      this.addEventListener("mousedown", (event) => {
        if (event.button === 0) {
          this.holdingDown = true;
          this.startPolling();
        }
      });
      this.addEventListener("mouseup", (event) => {
        if (event.button === 0) {
          this.holdingDown = false;
          this.stopPolling();
        }
      });
      this.addEventListener("mouseleave", () => {
        if (this.holdingDown) {
          this.onMouseLeaveWhileHoldingDown();
          this.holdingDown = false;
        }
        this.stopPolling();
      });
    }
    startPolling() {
      this.timeoutId = setTimeout(() => {
        this.intervalId = setInterval(() => {
          this.onmousehold();
        }, this.pollingTime);
      }, this.pollingTime);
    }
    stopPolling() {
      clearTimeout(this.timeoutId);
      clearInterval(this.intervalId);
    }
  };
  var NumberComponent = class {
    input;
    upArrow;
    downArrow;
    stepSize;
    range;
    defaultValue;
    constructor(element) {
      this.input = element.querySelector("input") ?? document.createElement("input");
      this.upArrow = element.querySelector(".number-arrow-up") ?? new HoldButton();
      this.downArrow = element.querySelector(".number-arrow-down") ?? new HoldButton();
      this.stepSize = 1;
      this.range = { min: 0, max: 100 };
      this.defaultValue = 1;
      this.initializeFields();
      this.addEventListeners();
    }
    initializeFields() {
      this.stepSize = Math.round(parseFloat(this.input.getAttribute("step") ?? "1"));
      if (this.input.onchange === null) {
        this.input.onchange = () => {
        };
      }
      this.range = {
        min: parseFloat(this.input.getAttribute("min") ?? "0"),
        max: parseFloat(this.input.getAttribute("max") ?? "100")
      };
      this.defaultValue = parseFloat(this.input.getAttribute("defaultValue") ?? "1");
      this.setValue(this.defaultValue);
    }
    addEventListeners() {
      this.upArrow.onmousehold = () => {
        this.increment();
      };
      this.downArrow.onmousehold = () => {
        this.decrement();
      };
      this.upArrow.addEventListener("mousedown", (event) => {
        if (event.button === 0) {
          this.increment();
        }
      });
      this.downArrow.addEventListener("mousedown", (event) => {
        if (event.button === 0) {
          this.decrement();
        }
      });
      this.upArrow.addEventListener("mouseup", () => {
        this.onChange();
      });
      this.downArrow.addEventListener("mouseup", () => {
        this.onChange();
      });
      this.upArrow.onMouseLeaveWhileHoldingDown = () => {
        this.onChange();
      };
      this.downArrow.onMouseLeaveWhileHoldingDown = () => {
        this.onChange();
      };
      this.input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          this.setValue(Number(this.input.value));
        }
      });
    }
    onChange() {
      this.input.dispatchEvent(new Event("change"));
    }
    increment() {
      this.setValue(this.getSnapMax(this.getSanitizedValue()));
    }
    decrement() {
      const value = this.getSanitizedValue();
      if (value % this.stepSize === 0) {
        this.setValue(value - this.stepSize);
        return;
      }
      this.setValue(this.getSnapMin(value));
    }
    setValue(value) {
      this.input.value = String(clamp(value, this.range.min, this.range.max));
    }
    getSnapMin(value) {
      return Math.floor(value / this.stepSize) * this.stepSize;
    }
    getSnapMax(value) {
      return this.getSnapMin(value) + this.stepSize;
    }
    getSanitizedValue() {
      const value = parseFloat(this.input.value);
      return isNaN(value) ? this.range.min : value;
    }
  };
  function createNumberTemplate(partial) {
    return {
      ...DEFAULT_MENU_ELEMENT,
      savePreference: false,
      event: null,
      function: DO_NOTHING,
      triggerOnCreation: false,
      preference: null,
      min: 0,
      max: 100,
      step: 1,
      defaultValue: 10,
      pollingTime: 50,
      ...partial
    };
  }
  function createNumberComponent(partial) {
    const template2 = createNumberTemplate(partial);
    const parent = document.getElementById(template2.parentId);
    if (parent === null) {
      return;
    }
    const numberComponentId = `${template2.id}-number`;
    const defaultValue = template2.preference === null ? 1 : template2.preference.value;
    const html = `
    <span class="number" id="${numberComponentId}">
      <hold-button class="number-arrow-down" pollingtime="${template2.pollingTime}">
        <span>&lt;</span>
      </hold-button>
      <input id="${template2.id}" type="number" min="${template2.min}" max="${template2.max}" step="${template2.step}" defaultValue="${defaultValue}">
      <hold-button class="number-arrow-up" pollingtime="${template2.pollingTime}">
        <span>&gt;</span>
      </hold-button>
    </span>
  `;
    parent.insertAdjacentHTML(template2.position, html);
    const element = document.getElementById(numberComponentId);
    if (element === null) {
      return;
    }
    const numberComponent = new NumberComponent(element);
    const numberInput = numberComponent.input;
    const emitEvent = () => {
      const value = parseFloat(numberInput.value);
      if (template2.event !== null) {
        template2.event.emit(value);
      }
      if (template2.preference !== null) {
        template2.preference.set(value);
      }
    };
    if (numberInput === null) {
      return;
    }
    numberInput.value = String(defaultValue);
    numberInput.dispatchEvent(new KeyboardEvent("keydown", {
      key: "Enter",
      bubbles: true
    }));
    if (template2.triggerOnCreation) {
      Events.document.postProcess.on(() => {
        emitEvent();
      });
    }
    numberInput.onchange = () => {
      emitEvent();
      template2.preference?.set(parseFloat(numberInput.value));
    };
  }
  function createSelectTemplate(partial) {
    return {
      ...DEFAULT_MENU_ELEMENT,
      options: /* @__PURE__ */ new Map(),
      savePreference: false,
      defaultValue: "",
      event: null,
      function: DO_NOTHING,
      triggerOnCreation: false,
      preference: null,
      isNumeric: false,
      ...partial
    };
  }
  function createSelectElement(partial) {
    const template2 = createSelectTemplate(partial);
    const parent = document.getElementById(template2.parentId);
    if (parent === null) {
      return;
    }
    const select2 = document.createElement("select");
    select2.id = template2.id;
    select2.title = template2.title;
    for (const [value, text] of template2.options) {
      const option = document.createElement("option");
      option.id = `${template2.id}-${value}`;
      option.value = value;
      option.textContent = text;
      select2.appendChild(option);
    }
    parent.insertAdjacentElement(template2.position, select2);
    const onChange = () => {
      const value = template2.isNumeric ? Number(select2.value) : select2.value;
      if (template2.event !== null) {
        template2.event.emit(value);
      }
      if (template2.preference !== null) {
        template2.preference.set(value);
      }
      template2.function(value);
    };
    if (template2.preference === null) {
      select2.value = Object.keys(template2.options)[0];
    } else {
      select2.value = String(template2.preference.value);
    }
    select2.onchange = onChange;
  }
  function prepareDynamicElements(elements) {
    return elements.reverse().filter((e) => e.enabled !== false);
  }
  var PERSISTENT_LOCAL_STORAGE_KEYS = /* @__PURE__ */ new Set(["customTags", "savedSearches"]);
  var DESKTOP_RESET_PROMPT_SUFFIX = "\nTag modifications and saved searches will be preserved.";
  var RESET_PROMPT = `Are you sure you want to reset? This will delete all cached favorites, and preferences.${ON_MOBILE_DEVICE ? "" : DESKTOP_RESET_PROMPT_SUFFIX}`;
  function clearLocalStorage() {
    Object.keys(localStorage).forEach((key) => {
      if (!PERSISTENT_LOCAL_STORAGE_KEYS.has(key)) {
        localStorage.removeItem(key);
      }
    });
  }
  function tryResetting() {
    if (confirm(RESET_PROMPT)) {
      clearLocalStorage();
      Events.favorites.resetConfirmed.emit();
    }
  }
  var BUTTONS = [
    {
      id: "search-button",
      parentId: "left-favorites-panel-top-row",
      title: "Search favorites\nctrl+click/right-click: Search all of rule34 in a new tab",
      position: "afterbegin",
      textContent: "Search",
      rightClickEnabled: true,
      event: Events.favorites.searchButtonClicked
    },
    {
      id: "shuffle-button",
      parentId: "left-favorites-panel-top-row",
      textContent: "Shuffle",
      title: "Randomize order of search results",
      event: Events.favorites.shuffleButtonClicked
    },
    {
      id: "invert-button",
      parentId: "left-favorites-panel-top-row",
      textContent: "Invert",
      title: "Show results not matched by latest search",
      event: Events.favorites.invertButtonClicked
    },
    {
      id: "clear-button",
      parentId: "left-favorites-panel-top-row",
      textContent: "Clear",
      title: "Empty the search box",
      event: Events.favorites.clearButtonClicked
    },
    {
      id: "download-button",
      parentId: "left-favorites-panel-top-row",
      textContent: "Download",
      title: "Download search results (experimental)",
      event: Events.favorites.downloadButtonClicked
    },
    {
      id: "subset-button",
      parentId: "left-favorites-panel-top-row",
      textContent: "Set Subset",
      title: "Make the current search results the entire set of results to search from",
      enabled: false,
      event: Events.favorites.searchSubsetClicked
    },
    {
      id: "stop-subset-button",
      parentId: "left-favorites-panel-top-row",
      textContent: "Stop Subset",
      title: "Stop subset and return entire set of results to all favorites",
      enabled: false,
      event: Events.favorites.stopSearchSubsetClicked
    },
    {
      id: "reset-button",
      parentId: "left-favorites-panel-top-row",
      textContent: "Reset",
      title: "Delete cached favorites and reset preferences",
      function: tryResetting,
      event: Events.favorites.resetButtonClicked
    }
  ];
  var CHECKBOXES = [
    {
      id: "options",
      parentId: "bottom-panel-1",
      textContent: "More Options",
      title: "Show more options",
      preference: Preferences.optionsVisible,
      hotkey: "O",
      function: toggleFavoritesOptions,
      triggerOnCreation: true,
      event: Events.favorites.optionsToggled
    },
    {
      id: "show-ui",
      parentId: "show-ui-wrapper",
      textContent: "UI",
      title: "Toggle UI",
      preference: Preferences.uiVisible,
      hotkey: "U",
      function: toggleUI,
      triggerOnCreation: true,
      event: Events.favorites.uiToggled
    },
    {
      id: "enhance-search-pages",
      parentId: "favorite-options-left",
      textContent: "Enhance Search Pages",
      title: "Enable gallery and other features on search pages",
      preference: Preferences.searchPagesEnabled,
      hotkey: "",
      savePreference: true
    },
    {
      id: "infinite-scroll",
      parentId: "favorite-options-left",
      textContent: "Infinite Scroll",
      title: "Use infinite scroll (waterfall) instead of pages",
      preference: Preferences.infiniteScrollEnabled,
      hotkey: "",
      event: Events.favorites.infiniteScrollToggled
    },
    {
      id: "show-remove-favorite-buttons",
      parentId: "favorite-options-left",
      textContent: "Remove Buttons",
      title: "Toggle remove favorite buttons",
      enabled: USER_IS_ON_THEIR_OWN_FAVORITES_PAGE,
      preference: Preferences.removeButtonsVisible,
      hotkey: "R",
      function: toggleAddOrRemoveButtons,
      event: Events.favorites.removeButtonsToggled
    },
    {
      id: "show-add-favorite-buttons",
      parentId: "favorite-options-left",
      textContent: "Add Favorite Buttons",
      title: "Toggle add favorite buttons",
      enabled: !USER_IS_ON_THEIR_OWN_FAVORITES_PAGE,
      preference: Preferences.addButtonsVisible,
      function: toggleAddOrRemoveButtons,
      hotkey: "R",
      event: Events.favorites.addButtonsToggled
    },
    {
      id: "show-download-buttons",
      parentId: "favorite-options-left",
      textContent: "Download Buttons",
      title: "Toggle download buttons",
      enabled: true,
      preference: Preferences.downloadButtonsVisible,
      hotkey: "",
      function: toggleDownloadButtons,
      event: Events.favorites.downloadButtonsToggled
    },
    {
      id: "exclude-blacklist",
      parentId: "favorite-options-left",
      textContent: "Exclude Blacklist",
      title: "Exclude favorites with blacklisted tags from search",
      enabled: USER_IS_ON_THEIR_OWN_FAVORITES_PAGE,
      preference: Preferences.excludeBlacklistEnabled,
      hotkey: "",
      event: Events.favorites.blacklistToggled
    },
    {
      id: "show-hints",
      parentId: "favorite-options-left",
      textContent: "Hotkey Hints",
      title: "Show hotkeys",
      preference: Preferences.hintsEnabled,
      hotkey: "H",
      event: Events.favorites.hintsToggled,
      triggerOnCreation: true,
      function: toggleOptionHotkeyHints
    },
    {
      id: "enable-autoplay",
      parentId: "favorite-options-right",
      textContent: "Autoplay",
      title: "Enable autoplay in gallery",
      enabled: GALLERY_ENABLED,
      preference: Preferences.autoplayActive,
      hotkey: "",
      event: Events.favorites.autoplayToggled
    },
    {
      id: "show-on-hover",
      parentId: "favorite-options-right",
      textContent: "Fullscreen on Hover",
      title: "View full resolution images or play videos and GIFs when hovering over a thumbnail",
      enabled: GALLERY_ENABLED,
      preference: Preferences.showOnHoverEnabled,
      hotkey: "",
      event: Events.favorites.showOnHoverToggled
    },
    {
      id: "show-tooltips",
      parentId: "favorite-options-right",
      textContent: "Tooltips",
      title: "Show tags when hovering over a thumbnail and see which ones were matched by a search",
      enabled: TOOLTIP_ENABLED,
      preference: Preferences.tooltipsVisible,
      hotkey: "T",
      event: Events.favorites.tooltipsToggled
    },
    {
      id: "show-captions",
      parentId: "favorite-options-right",
      textContent: "Details",
      title: "Show details when hovering over thumbnail",
      enabled: CAPTIONS_ENABLED,
      preference: Preferences.captionsVisible,
      hotkey: "D",
      event: Events.favorites.captionsToggled
    },
    {
      id: "toggle-header",
      parentId: "favorite-options-right",
      textContent: "Header",
      title: "Toggle site header",
      preference: Preferences.headerEnabled,
      hotkey: "",
      event: Events.favorites.headerToggled,
      triggerOnCreation: true,
      function: toggleHeader
    },
    {
      id: "dark-theme",
      parentId: "favorite-options-right",
      textContent: "Dark Theme",
      title: "Toggle dark theme",
      defaultValue: usingDarkTheme(),
      hotkey: "",
      event: Events.favorites.darkThemeToggled,
      function: toggleDarkTheme
    },
    {
      id: "use-aliases",
      parentId: "favorite-options-right",
      textContent: "Aliases",
      title: "Alias similar tags",
      enabled: false,
      preference: Preferences.tagAliasingEnabled,
      hotkey: "A"
    },
    {
      id: "show-saved-search-suggestions",
      parentId: "favorite-options-right",
      textContent: "Saved Suggestions",
      title: "Show saved search suggestions in autocomplete dropdown",
      enabled: false,
      preference: Preferences.savedSearchSuggestionsEnabled,
      hotkey: "",
      savePreference: true
    },
    {
      id: "show-saved-searches",
      parentId: "bottom-panel-2",
      textContent: "Saved Searches",
      title: "Show saved searches",
      enabled: true,
      preference: Preferences.savedSearchesVisible,
      event: Events.favorites.savedSearchesToggled
    },
    {
      id: "enable-gallery-menu",
      parentId: "favorite-options-left",
      textContent: "Gallery Menu",
      title: "Show menu in gallery",
      enabled: GALLERY_ENABLED && GeneralSettings.galleryMenuOptionEnabled,
      function: toggleGalleryMenuEnabled,
      preference: Preferences.galleryMenuEnabled,
      event: Events.favorites.galleryMenuToggled
    }
  ];
  var SIMPLE_CHECKBOXES = [
    {
      id: "sort-ascending",
      parentId: "sort-inputs",
      position: "beforeend",
      preference: Preferences.sortAscendingEnabled,
      event: Events.favorites.sortAscendingToggled
    }
  ];
  var SELECTS = [
    {
      id: "sorting-method",
      parentId: "sort-inputs",
      title: "Change sorting order of search results",
      position: "beforeend",
      preference: Preferences.sortingMethod,
      event: Events.favorites.sortingMethodChanged,
      options: /* @__PURE__ */ new Map([
        ["default", "Default"],
        ["score", "Score"],
        ["width", "Width"],
        ["height", "Height"],
        ["creationTimestamp", "Date Uploaded"],
        ["lastChangedTimestamp", "Date Changed"],
        ["duration", "Duration"],
        ["id", "ID"],
        ["random", "Random"]
      ])
    },
    {
      id: "layout-select",
      parentId: "layout-container",
      title: "Change layout",
      position: "beforeend",
      preference: Preferences.favoritesLayout,
      event: Events.favorites.layoutChanged,
      function: hideUnusedLayoutSizer,
      options: /* @__PURE__ */ new Map([
        ["column", "Waterfall"],
        ["row", "River"],
        ["square", "Square"],
        ["grid", "Legacy"],
        ["native", "Native"]
      ])
    },
    {
      id: "performance-profile",
      parentId: "performance-profile-container",
      title: "Improve performance by disabling features",
      position: "beforeend",
      preference: Preferences.performanceProfile,
      event: Events.favorites.performanceProfileChanged,
      function: reloadWindow,
      isNumeric: true,
      options: /* @__PURE__ */ new Map([
        [0 /* NORMAL */, "Normal"],
        [3 /* MEDIUM */, "Medium (no upscaling)"],
        [1 /* LOW */, "Low (no gallery)"],
        [2 /* POTATO */, "Potato (only search)"]
      ])
    }
  ];
  var NUMBERS = [
    {
      id: "column-count",
      parentId: "column-count-container",
      position: "beforeend",
      preference: Preferences.columnCount,
      min: GeneralSettings.columnCountBounds.min,
      max: GeneralSettings.columnCountBounds.max,
      step: 1,
      pollingTime: 50,
      triggerOnCreation: true,
      event: Events.favorites.columnCountChanged
    },
    {
      id: "row-size",
      parentId: "row-size-container",
      position: "beforeend",
      preference: Preferences.rowSize,
      min: GeneralSettings.rowSizeBounds.min,
      max: GeneralSettings.rowSizeBounds.max,
      step: 1,
      pollingTime: 50,
      triggerOnCreation: true,
      event: Events.favorites.rowSizeChanged
    },
    {
      id: "results-per-page",
      parentId: "results-per-page-container",
      position: "beforeend",
      preference: Preferences.resultsPerPage,
      min: FavoritesSettings.resultsPerPageBounds.min,
      max: FavoritesSettings.resultsPerPageBounds.max,
      step: FavoritesSettings.resultsPerPageStep,
      pollingTime: 50,
      triggerOnCreation: false,
      event: Events.favorites.resultsPerPageChanged
    }
  ];
  function createButtons() {
    for (const button of prepareDynamicElements(BUTTONS)) {
      createButtonElement(button);
    }
  }
  function createCheckboxes() {
    for (const checkbox of prepareDynamicElements(CHECKBOXES)) {
      createCheckboxOption(checkbox);
    }
  }
  function createSelects() {
    for (const select2 of prepareDynamicElements(SELECTS)) {
      createSelectElement(select2);
    }
  }
  function createNumbers() {
    for (const number of prepareDynamicElements(NUMBERS)) {
      createNumberComponent(number);
    }
  }
  function createSimpleCheckboxes() {
    for (const checkbox of prepareDynamicElements(SIMPLE_CHECKBOXES)) {
      createCheckboxElement(checkbox);
    }
  }
  function createDynamicFavoritesDesktopMenuElements() {
    createButtons();
    createCheckboxes();
    createSimpleCheckboxes();
    createSelects();
    createNumbers();
  }
  var BUTTONS2 = [
    {
      id: "download-button",
      parentId: "additional-favorite-options",
      textContent: "Download",
      title: "Download search results",
      event: Events.favorites.downloadButtonClicked,
      position: "beforeend"
    }
  ];
  var TOGGLE_SWITCHES = [
    {
      id: "infinite-scroll",
      parentId: "favorite-options-left",
      textContent: "Infinite Scroll",
      title: "Use infinite scroll (waterfall) instead of pages",
      preference: Preferences.infiniteScrollEnabled,
      hotkey: "",
      event: Events.favorites.infiniteScrollToggled
    },
    {
      id: "show-remove-favorite-buttons",
      parentId: "favorite-options-left",
      textContent: "Remove Buttons",
      title: "Toggle remove favorite buttons",
      enabled: USER_IS_ON_THEIR_OWN_FAVORITES_PAGE,
      preference: Preferences.removeButtonsVisible,
      hotkey: "R",
      function: toggleAddOrRemoveButtons,
      event: Events.favorites.removeButtonsToggled
    },
    {
      id: "show-add-favorite-buttons",
      parentId: "favorite-options-left",
      textContent: "Add Favorite Buttons",
      title: "Toggle add favorite buttons",
      enabled: !USER_IS_ON_THEIR_OWN_FAVORITES_PAGE,
      preference: Preferences.addButtonsVisible,
      function: toggleAddOrRemoveButtons,
      hotkey: "R",
      event: Events.favorites.addButtonsToggled
    },
    {
      id: "show-download-buttons",
      parentId: "favorite-options-left",
      textContent: "Download Buttons",
      title: "Toggle download buttons",
      enabled: true,
      preference: Preferences.downloadButtonsVisible,
      hotkey: "",
      function: toggleDownloadButtons,
      event: Events.favorites.downloadButtonsToggled
    },
    {
      id: "exclude-blacklist",
      parentId: "favorite-options-left",
      textContent: "Exclude Blacklist",
      title: "Exclude favorites with blacklisted tags from search",
      enabled: USER_IS_ON_THEIR_OWN_FAVORITES_PAGE,
      preference: Preferences.excludeBlacklistEnabled,
      hotkey: "",
      event: Events.favorites.blacklistToggled
    },
    {
      id: "enable-autoplay",
      parentId: "favorite-options-left",
      textContent: "Autoplay",
      title: "Enable autoplay in gallery",
      enabled: GALLERY_ENABLED,
      preference: Preferences.autoplayActive,
      hotkey: "",
      event: Events.favorites.autoplayToggled
    },
    {
      id: "toggle-header",
      parentId: "favorite-options-left",
      textContent: "Header",
      title: "Toggle site header",
      preference: Preferences.headerEnabled,
      hotkey: "",
      enabled: false,
      event: Events.favorites.headerToggled,
      triggerOnCreation: true,
      function: toggleHeader
    },
    {
      id: "dark-theme",
      parentId: "favorite-options-left",
      textContent: "Dark Theme",
      title: "Toggle dark theme",
      defaultValue: usingDarkTheme(),
      hotkey: "",
      event: Events.favorites.darkThemeToggled,
      function: toggleDarkTheme
    },
    {
      id: "enhance-search-pages",
      parentId: "favorite-options-left",
      textContent: "Search Page Gallery",
      title: "Enable gallery and other features on search pages",
      preference: Preferences.searchPagesEnabled,
      hotkey: "",
      savePreference: true
    },
    {
      id: "sort-ascending",
      parentId: "sort-inputs",
      position: "beforeend",
      enabled: true,
      preference: Preferences.sortAscendingEnabled,
      event: Events.favorites.sortAscendingToggled
    },
    {
      id: "mobile-gallery",
      parentId: "favorite-options-left",
      textContent: "Gallery",
      title: "Enable gallery",
      position: "beforeend",
      enabled: true,
      preference: Preferences.mobileGalleryEnabled
    }
  ];
  var SELECTS2 = [
    {
      id: "sorting-method",
      parentId: "sort-inputs",
      title: "Change sorting order of search results",
      position: "beforeend",
      preference: Preferences.sortingMethod,
      event: Events.favorites.sortingMethodChanged,
      options: /* @__PURE__ */ new Map([
        ["default", "Default"],
        ["score", "Score"],
        ["width", "Width"],
        ["height", "Height"],
        ["creationTimestamp", "Date Uploaded"],
        ["lastChangedTimestamp", "Date Changed"],
        ["id", "ID"],
        ["random", "Random"],
        ["duration", "Duration"]
      ])
    },
    {
      id: "layout-select",
      parentId: "layout-container",
      title: "Change layout",
      position: "beforeend",
      preference: Preferences.favoritesLayout,
      event: Events.favorites.layoutChanged,
      function: hideUnusedLayoutSizer,
      options: /* @__PURE__ */ new Map([
        ["column", "Waterfall"],
        ["row", "River"],
        ["square", "Square"],
        ["grid", "Legacy"]
        // ["native", "Native"]
      ])
    },
    {
      id: "results-per-page",
      parentId: "results-per-page-container",
      title: "Change results per page",
      position: "beforeend",
      triggerOnCreation: true,
      preference: Preferences.resultsPerPage,
      event: Events.favorites.resultsPerPageChanged,
      options: /* @__PURE__ */ new Map([
        [5, "5"],
        [10, "10"],
        [20, "20"],
        [50, "50"],
        [100, "100"],
        [200, "200"],
        [500, "500"],
        [1e3, "1000"]
      ])
    },
    {
      id: "column-count",
      parentId: "column-count-container",
      position: "beforeend",
      preference: Preferences.columnCount,
      triggerOnCreation: true,
      event: Events.favorites.columnCountChanged,
      options: /* @__PURE__ */ new Map([
        [1, "1"],
        [2, "2"],
        [3, "3"],
        [4, "4"],
        [5, "5"],
        [6, "6"],
        [7, "7"],
        [8, "8"],
        [9, "9"],
        [10, "10"]
      ])
    },
    {
      id: "row-size",
      parentId: "row-size-container",
      position: "beforeend",
      preference: Preferences.rowSize,
      triggerOnCreation: true,
      event: Events.favorites.rowSizeChanged,
      options: /* @__PURE__ */ new Map([
        [1, "1"],
        [2, "2"],
        [3, "3"],
        [4, "4"],
        [5, "5"],
        [6, "6"],
        [7, "7"]
      ])
    }
  ];
  function createButtons2() {
    for (const button of prepareDynamicElements(BUTTONS2)) {
      createButtonElement(button);
    }
  }
  function createToggleSwitches() {
    for (const checkbox of prepareDynamicElements(TOGGLE_SWITCHES)) {
      createToggleSwitch(checkbox);
    }
  }
  function createSelects2() {
    for (const select2 of prepareDynamicElements(SELECTS2)) {
      createSelectElement(select2);
    }
  }
  function createDynamicFavoritesMobileMenuElements() {
    createSelects2();
    createToggleSwitches();
    createButtons2();
  }
  var dialog2;
  function insertHelpHTML() {
    const parent = document.getElementById(ON_MOBILE_DEVICE ? "mobile-footer-header" : "left-favorites-panel-top-row");
    if (parent !== null) {
      parent.insertAdjacentHTML("beforeend", HELP_HTML);
    }
  }
  function createWhatsNewMenu() {
    const whatsNew = document.getElementById("whats-new-link");
    if (whatsNew === null) {
      return;
    }
    if (ON_MOBILE_DEVICE) {
      whatsNew.remove();
      return;
    }
    createDialogWhatsNewMenu(whatsNew);
  }
  function createDialogWhatsNewMenu(menu) {
    dialog2 = document.createElement("dialog");
    dialog2.id = "whats-new-dialog";
    dialog2.style.padding = "5px 10px";
    dialog2.style.fontSize = "large";
    dialog2.classList.add(getCurrentThemeClass());
    FAVORITES_SEARCH_GALLERY_CONTAINER.appendChild(dialog2);
    const whatsNewContainer = menu.querySelector("#whats-new-container");
    if (whatsNewContainer === null) {
      return;
    }
    whatsNewContainer.removeAttribute("id");
    dialog2.appendChild(whatsNewContainer);
    const closeButton = document.createElement("button");
    closeButton.textContent = "X";
    closeButton.style.position = "absolute";
    closeButton.style.top = "1em";
    closeButton.style.right = "1em";
    closeButton.addEventListener("click", () => dialog2.close());
    dialog2.appendChild(closeButton);
    menu.onmousedown = () => {
      dialog2.showModal();
      return false;
    };
    dialog2.onclick = () => {
      dialog2.close();
    };
  }
  function createFavoritesHelpMenu() {
    insertHelpHTML();
    createWhatsNewMenu();
  }
  var parent1;
  var container;
  var findButton;
  var findInAllButton;
  var input;
  function insertFavoritesFinder() {
    if (ON_MOBILE_DEVICE || !FavoritesSettings.favoriteFinderEnabled) {
      return;
    }
    const foundParent = document.querySelector("#left-favorites-panel-top-row");
    if (!(foundParent instanceof HTMLElement)) {
      return;
    }
    parent1 = foundParent;
    createElements();
    addEventListeners3();
    appendElements();
  }
  function createElements() {
    container = document.createElement("span");
    container.id = "favorite-finder";
    findButton = document.createElement("button");
    findButton.id = "favorite-finder-button";
    findButton.title = "Find favorite favorite using its ID";
    findButton.textContent = "Find";
    findInAllButton = document.createElement("button");
    findInAllButton.id = "favorite-finder-in-all-button";
    findInAllButton.title = "Find favorite favorite using its ID in all Favorites";
    findInAllButton.textContent = "Find in All";
    input = document.createElement("input");
    input.id = "favorite-finder-input";
    input.type = "number";
    input.value = Preferences.favoriteFinderId.value;
    input.placeholder = "ID";
  }
  function find() {
    Events.favorites.findFavoriteStarted.emit(input.value);
  }
  function findInAll() {
    Events.favorites.findFavoriteInAllStarted.emit(input.value);
  }
  function setFinderValue(value) {
    input.value = value;
    Preferences.favoriteFinderId.set(input.value);
  }
  function addEventListeners3() {
    const setValue = debounceAfterFirstCall((value) => {
      setFinderValue(value);
    }, 1e3);
    findButton.onclick = find;
    findInAllButton.onclick = findInAll;
    input.onkeydown = (event) => {
      if (event.key === "Enter") {
        find();
      }
    };
    input.oninput = (event) => {
      setValue(event.target.value);
    };
    Events.caption.idClicked.on(setValue);
  }
  function appendElements() {
    container.appendChild(input);
    container.appendChild(findButton);
    parent1.appendChild(container);
  }
  var parentContainer = document.createElement("div");
  var CONTAINER3 = createContainer2();
  var EXPLICIT = createRatingElement("explicit");
  var QUESTIONABLE = createRatingElement("questionable");
  var SAFE = createRatingElement("safe");
  function insertFavoritesRatingFilter() {
    if (ON_MOBILE_DEVICE) {
      return;
    }
    parentContainer = document.getElementById("rating-container") ?? parentContainer;
    parentContainer.appendChild(createLabel());
    parentContainer.appendChild(document.createElement("br"));
    parentContainer.appendChild(CONTAINER3);
    changeWhichRatingsAreSelected(Preferences.allowedRatings.value);
    addEventListeners4();
  }
  function createContainer2() {
    const container3 = document.createElement("div");
    container3.id = "allowed-ratings";
    container3.className = "not-highlightable";
    return container3;
  }
  function createLabel() {
    const label = document.createElement("label");
    label.htmlFor = "allowed-ratings";
    label.textContent = "Rating";
    return label;
  }
  function createRatingElement(ratingName) {
    const input2 = document.createElement("input");
    const label = document.createElement("label");
    input2.type = "checkbox";
    input2.id = `${ratingName}-rating`;
    label.htmlFor = input2.id;
    label.textContent = capitalize(ratingName);
    CONTAINER3.appendChild(input2);
    CONTAINER3.appendChild(label);
    return {
      input: input2,
      label
    };
  }
  function addEventListeners4() {
    CONTAINER3.onclick = (event) => {
      if (event.target === null || hasTagName(event.target, "label")) {
        return;
      }
      const rating = getCurrentRating();
      Events.favorites.allowedRatingsChanged.emit(rating);
      preventAllRatingsFromBeingUnselected();
      Preferences.allowedRatings.set(rating);
    };
  }
  function getCurrentRating() {
    const rating = 4 * Number(EXPLICIT.input.checked) + 2 * Number(QUESTIONABLE.input.checked) + Number(SAFE.input.checked);
    return rating;
  }
  function changeWhichRatingsAreSelected(rating) {
    EXPLICIT.input.checked = (rating & 4) === 4;
    QUESTIONABLE.input.checked = (rating & 2) === 2;
    SAFE.input.checked = (rating & 1) === 1;
    preventAllRatingsFromBeingUnselected();
  }
  function preventAllRatingsFromBeingUnselected() {
    switch (getCurrentRating()) {
      case 4:
        EXPLICIT.label.style.pointerEvents = "none";
        break;
      case 2:
        QUESTIONABLE.label.style.pointerEvents = "none";
        break;
      case 1:
        SAFE.label.style.pointerEvents = "none";
        break;
      default:
        for (const element of [EXPLICIT, QUESTIONABLE, SAFE]) {
          element.label.removeAttribute("style");
        }
        break;
    }
  }
  var SearchHistory = class {
    lastEditedQuery;
    history;
    index;
    depth;
    constructor(depth) {
      this.index = -1;
      this.history = this.loadSearchHistory();
      this.lastEditedQuery = this.loadLastEditedQuery();
      this.depth = depth;
    }
    get selectedQuery() {
      if (indexInBounds(this.history, this.index)) {
        return this.history[this.index];
      }
      return this.lastEditedQuery;
    }
    add(searchQuery2) {
      if (isEmptyString(searchQuery2)) {
        return;
      }
      const searchHistory = this.history.slice();
      const cleanedSearchQuery = removeExtraWhiteSpace(searchQuery2);
      const searchHistoryWithoutQuery = searchHistory.filter((search) => search !== cleanedSearchQuery);
      const searchHistoryWithQueryAtFront = [searchQuery2].concat(searchHistoryWithoutQuery);
      const truncatedSearchHistory = searchHistoryWithQueryAtFront.slice(0, this.depth);
      this.history = truncatedSearchHistory;
      localStorage.setItem("searchHistory", JSON.stringify(this.history));
    }
    updateLastEditedSearchQuery(searchQuery2) {
      this.lastEditedQuery = searchQuery2;
      this.resetIndex();
      localStorage.setItem("lastEditedSearchQuery", this.lastEditedQuery);
    }
    navigate(direction) {
      if (direction === "ArrowUp") {
        const selectedQuery = this.selectedQuery;
        this.incrementIndex();
        const queryHasNotChanged = this.selectedQuery === selectedQuery;
        if (queryHasNotChanged) {
          this.incrementIndex();
        }
        return;
      }
      this.decrementIndex();
    }
    loadSearchHistory() {
      return JSON.parse(localStorage.getItem("searchHistory") || "[]");
    }
    loadLastEditedQuery() {
      return localStorage.getItem("lastEditedSearchQuery") || "";
    }
    resetIndex() {
      this.index = -1;
    }
    incrementIndex() {
      this.index = Math.min(this.index + 1, this.history.length - 1);
    }
    decrementIndex() {
      this.index = Math.max(this.index - 1, -1);
    }
  };
  function createDesktopSearchBar(id, parentId, initialValue) {
    const searchBox3 = document.createElement("textarea");
    searchBox3.id = id;
    searchBox3.placeholder = "Search Favorites";
    searchBox3.spellcheck = false;
    searchBox3.value = initialValue ?? "";
    const parent = document.getElementById(parentId);
    if (parent !== null) {
      parent.insertAdjacentElement("beforeend", searchBox3);
    }
    return searchBox3;
  }
  function createMobileSearchBar(id, parentId, onClick2) {
    insertMobileSearchBar(id, parentId);
    const searchButton = document.getElementById("search-button");
    const searchBar = document.getElementById(id);
    const clearButton = document.querySelector(".search-clear-container");
    const resetButton = document.getElementById("reset-button");
    if (!(searchBar instanceof HTMLInputElement) || searchButton === null || !(clearButton instanceof HTMLElement) || !(resetButton instanceof HTMLElement)) {
      return document.createElement("input");
    }
    searchButton.onclick = onClick2;
    searchBar.addEventListener("input", () => {
      const clearButtonContainer = document.querySelector(".search-clear-container");
      if (clearButtonContainer === null) {
        return;
      }
      const clearButtonIsHidden = getComputedStyle(clearButtonContainer).visibility === "hidden";
      const searchBarIsEmpty = searchBar.value === "";
      const styleId = "search-clear-button-visibility";
      if (searchBarIsEmpty && !clearButtonIsHidden) {
        insertStyleHTML(".search-clear-container {visibility: hidden}", styleId);
      } else if (!searchBarIsEmpty && clearButtonIsHidden) {
        insertStyleHTML(".search-clear-container {visibility: visible}", styleId);
      }
    });
    clearButton.onclick = () => {
      searchBar.value = "";
      searchBar.dispatchEvent(new Event("input"));
    };
    resetButton.onclick = tryResetting;
    const options = document.getElementById("options-checkbox");
    if (!(options instanceof HTMLInputElement)) {
      return searchBar;
    }
    let headerIsVisible = true;
    toggleFavoritesOptions(Preferences.optionsVisible.value);
    options.checked = Preferences.optionsVisible.value;
    options.addEventListener("change", () => {
      Preferences.optionsVisible.set(options.checked);
      toggleFavoritesOptions(options.checked);
      if (!headerIsVisible) {
        CONTENT_CONTAINER.classList.toggle("sticky-menu", options.checked);
      }
    });
    const stickyMenuHTML = `
     #favorites-search-gallery-content {
        margin-top: 65px;
        margin-bottom: 65px;
      }
      #favorites-search-gallery-menu {
          position: fixed;
          margin-top: 0;
      }`;
    const header = document.getElementById("header");
    const onHeaderVisibilityChange = async (headerVisible) => {
      headerIsVisible = headerVisible;
      insertStyleHTML(headerVisible ? "" : stickyMenuHTML, "sticky-menu");
      const optionsMenu = document.getElementById("left-favorites-panel-bottom-row");
      CONTENT_CONTAINER.classList.remove("sticky-menu");
      CONTENT_CONTAINER.classList.remove("sticky-menu-shadow");
      if (optionsMenu === null) {
        return;
      }
      const menuIsOpen = !optionsMenu.classList.contains("hidden");
      if (!headerVisible) {
        if (menuIsOpen) {
          CONTENT_CONTAINER.classList.add("sticky-menu");
        }
        await sleep(30);
        CONTENT_CONTAINER.classList.add("sticky-menu-shadow");
      }
    };
    if (header !== null) {
      const observer = new IntersectionObserver((entries) => {
        onHeaderVisibilityChange(entries[0].isIntersecting);
      }, { threshold: 0 });
      observer.observe(header);
    }
    createMobileSymbolRow(searchBar);
    return searchBar;
  }
  function insertMobileSearchBar(id, parentId) {
    const html = `
      <div id="mobile-toolbar-row" class="light-green-gradient">
          <div class="search-bar-container light-green-gradient">
              <div class="search-bar-items">
                  <div>
                      <div class="circle-icon-container">
                          <svg class="search-icon" id="search-button" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                            <path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/>
                          </svg>
                      </div>
                  </div>
                  <div class="search-bar-input-container">
                      <input type="text" id="${id}" class="search-bar-input" needs-autocomplete placeholder="Search Favorites">
                  </div>
                  <div class="toolbar-button search-clear-container">
                      <div class="circle-icon-container">
                          <svg id="clear-button" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                            <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/>
                          </svg>
                      </div>
                  </div>
                  <div>
                      <input type="checkbox" id="options-checkbox" data-action="toggleOptions">
                      <label for="options-checkbox" class="mobile-toolbar-checkbox-label">
                        <svg id="options-menu-icon" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#5f6368">
                          <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/>
                        </svg>
                      </label>
                  </div>
                  <div>
                        <div id="reset-button">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
                            <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-84 31.5-156.5T197-763l56 56q-44 44-68.5 102T160-480q0 134 93 227t227 93q134 0 227-93t93-227q0-67-24.5-125T707-707l56-56q54 54 85.5 126.5T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm-40-360v-440h80v440h-80Z"/>
                          </svg>
                        </div>
                  </div>
                  <div style="display: none;">
                        <div id="">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor">
                            <path d="M424-320q0-81 14.5-116.5T500-514q41-36 62.5-62.5T584-637q0-41-27.5-68T480-732q-51 0-77.5 31T365-638l-103-44q21-64 77-111t141-47q105 0 161.5 58.5T698-641q0 50-21.5 85.5T609-475q-49 47-59.5 71.5T539-320H424Zm56 240q-33 0-56.5-23.5T400-160q0-33 23.5-56.5T480-240q33 0 56.5 23.5T560-160q0 33-23.5 56.5T480-80Z"/>
                          </svg>
                        </div>
                  </div>
              </div>
          </div>
      </div>
        `;
    const parent = document.getElementById(parentId);
    if (parent !== null) {
      parent.insertAdjacentHTML("afterend", html);
    }
  }
  function createMobileSymbolRow(searchBox3) {
    if (ON_DESKTOP_DEVICE) {
      return;
    }
    const placeToInsert = document.getElementById("left-favorites-panel");
    if (placeToInsert === null) {
      return;
    }
    const symbolContainer = document.createElement("div");
    symbolContainer.id = "mobile-symbol-container";
    symbolContainer.innerHTML = `
            <button>-</button>
          <button>*</button>
          <button>_</button>
          <button>(</button>
          <button>)</button>
          <button>~</button>
  `;
    placeToInsert.insertAdjacentElement("afterbegin", symbolContainer);
    for (const button of Array.from(symbolContainer.querySelectorAll("button"))) {
      button.addEventListener("blur", async () => {
        await sleep(0);
        if (document.activeElement === null || document.activeElement.id !== "favorites-search-box" && !symbolContainer.contains(document.activeElement)) {
          symbolContainer.classList.toggle("active", false);
        }
      });
      button.addEventListener("click", () => {
        const value = searchBox3.value;
        const selectionStart = searchBox3.selectionStart ?? 0;
        searchBox3.value = value.slice(0, selectionStart) + button.textContent + value.slice(selectionStart);
        searchBox3.selectionStart = selectionStart + 1;
        searchBox3.selectionEnd = selectionStart + 1;
        searchBox3.focus();
      }, {
        passive: true
      });
    }
    searchBox3.addEventListener("focus", () => {
      symbolContainer.classList.toggle("active", true);
    }, {
      passive: true
    });
    searchBox3.addEventListener("blur", async () => {
      await sleep(10);
      if (document.activeElement === null || document.activeElement.id !== "favorites-search-box" && !symbolContainer.contains(document.activeElement)) {
        symbolContainer.classList.toggle("active", false);
      }
    });
  }
  var SEARCH_BOX;
  var PARENT_ID = "left-favorites-panel-top-row";
  var ID = "favorites-search-box";
  var SEARCH_HISTORY = new SearchHistory(30);
  function addEventListenersToSearchBox() {
    Events.caption.searchForTag.on((tag) => {
      SEARCH_BOX.value = tag;
      startSearch();
    });
    Events.searchBox.appendSearchBox.on((text) => {
      const initialSearchBoxValue = SEARCH_BOX.value;
      const optionalSpace = initialSearchBoxValue === "" ? "" : " ";
      const newSearchBoxValue = `${initialSearchBoxValue}${optionalSpace}${text}`;
      SEARCH_BOX.value = newSearchBoxValue;
      SEARCH_HISTORY.add(newSearchBoxValue);
      updateLastEditedSearchQuery();
    });
    Events.favorites.searchButtonClicked.on(onSearchButtonClicked);
    Events.favorites.clearButtonClicked.on(() => {
      SEARCH_BOX.value = "";
    });
    Events.favorites.searchBoxUpdated.on(() => {
      updateLastEditedSearchQuery();
    });
    SEARCH_BOX.addEventListener("keydown", (event) => {
      if (!(event instanceof KeyboardEvent)) {
        return;
      }
      if (event.key === "Enter") {
        if (!event.repeat && awesompleteIsUnselected(SEARCH_BOX)) {
          event.preventDefault();
          startSearch();
        }
        return;
      }
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        if (!awesompleteIsVisible(SEARCH_BOX)) {
          event.preventDefault();
          SEARCH_HISTORY.navigate(event.key);
          SEARCH_BOX.value = SEARCH_HISTORY.selectedQuery;
        }
      }
    });
    updateLastEditedSearchQueryOnInput();
  }
  function updateLastEditedSearchQueryOnInput() {
    SEARCH_BOX.addEventListener("keyup", debounceAfterFirstCall((event) => {
      if (!(event instanceof KeyboardEvent)) {
        return;
      }
      if (event.key.length === 1 || event.key === "Backspace" || event.key === "Delete") {
        updateLastEditedSearchQuery();
      }
    }, 500));
  }
  function updateLastEditedSearchQuery() {
    SEARCH_HISTORY.updateLastEditedSearchQuery(SEARCH_BOX.value);
  }
  function onSearchButtonClicked(event) {
    const mouseEvent = new FavoritesMouseEvent(event);
    if (mouseEvent.rightClick || mouseEvent.ctrlKey) {
      openSearchPage(SEARCH_BOX.value);
      return;
    }
    startSearch();
  }
  function startSearch() {
    SEARCH_HISTORY.add(SEARCH_BOX.value);
    updateLastEditedSearchQuery();
    hideAwesomplete(SEARCH_BOX);
    Events.favorites.searchStarted.emit(SEARCH_BOX.value);
  }
  function setupFavoritesSearchBox() {
    SEARCH_BOX = ON_MOBILE_DEVICE ? createMobileSearchBar(ID, PARENT_ID, startSearch) : createDesktopSearchBar(ID, PARENT_ID, SEARCH_HISTORY.lastEditedQuery);
    addEventListenersToSearchBox();
  }
  function createStaticFavoritesMenuElements() {
    insertFavoritesFinder();
    createFavoritesHelpMenu();
    insertFavoritesRatingFilter();
    setupFavoritesSearchBox();
  }
  function buildFavoritesMenu() {
    insertFavoritesMenuHTML();
    if (ON_DESKTOP_DEVICE) {
      buildDesktopFavoritesMenu();
    } else {
      buildMobileFavoritesMenu();
    }
    createStaticFavoritesMenuElements();
  }
  function insertFavoritesMenuHTML() {
    insertStyleHTML(ON_MOBILE_DEVICE ? MOBILE_HTML : DESKTOP_HTML, "favorites-menu-style");
    insertHTMLAndExtractStyle(FAVORITES_SEARCH_GALLERY_CONTAINER, "afterbegin", FAVORITES_HTML);
  }
  function buildDesktopFavoritesMenu() {
    createDynamicFavoritesDesktopMenuElements();
  }
  function buildMobileFavoritesMenu() {
    createFooter();
    moveStatusToFooter();
    createControlsGuide();
    createDynamicFavoritesMobileMenuElements();
  }
  function getOriginalFavoritesContent() {
    return document.querySelector("#content, div:has(.thumb)");
  }
  function clearOriginalFavoritesContent() {
    getOriginalFavoritesContent()?.remove();
  }
  function removeUnusedFavoritesPageScripts() {
    for (const script of document.querySelectorAll("script")) {
      if (/(?:fluidplayer|awesomplete)/.test(script.src ?? "")) {
        script.remove();
      }
    }
  }
  async function cleanOriginalFavoritesPage() {
    await waitForDOMToLoad();
    await sleep(20);
    clearOriginalFavoritesContent();
    removeUnusedFavoritesPageScripts();
  }
  async function setupFavoritesBottomNavigationButtons() {
    if (ON_MOBILE_DEVICE || !FavoritesSettings.bottomNavigationButtonsEnabled) {
      return;
    }
    const container3 = document.createElement("div");
    const previousButton = document.createElement("button");
    const nextButton = document.createElement("button");
    container3.id = "favorites-bottom-navigation-buttons";
    previousButton.id = "favorites-bottom-previous-button";
    nextButton.id = "favorites-bottom-next-button";
    previousButton.disabled = true;
    nextButton.disabled = true;
    previousButton.textContent = "Previous";
    nextButton.textContent = "Next";
    previousButton.title = "Next page";
    nextButton.title = "Previous page";
    previousButton.onclick = () => {
      Events.favorites.relativePageSelected.emit("previous");
    };
    nextButton.onclick = () => {
      Events.favorites.relativePageSelected.emit("next");
    };
    Events.favorites.pageChanged.on(() => {
      const previousMenuButton = document.getElementById("previous-page");
      const nextMenuButton = document.getElementById("next-page");
      if (!(previousMenuButton instanceof HTMLButtonElement) || !(nextMenuButton instanceof HTMLButtonElement)) {
        return;
      }
      previousButton.disabled = previousMenuButton.disabled;
      nextButton.disabled = nextMenuButton.disabled;
    });
    insertStyleHTML(`
    body {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    #favorites-search-gallery {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  `);
    container3.appendChild(previousButton);
    container3.appendChild(nextButton);
    await yield1();
    CONTENT_CONTAINER.insertAdjacentElement("afterend", container3);
  }
  function buildFavoritesPage() {
    cleanOriginalFavoritesPage();
    buildFavoritesMenu();
    setupFavoritesBottomNavigationButtons();
  }
  function setupFavorites() {
    if (!ON_FAVORITES_PAGE) {
      return;
    }
    buildFavoritesPage();
    setupFavoritesView();
    addFavoritesEventsListeners();
    loadAllFavorites2();
  }
  async function addFavoriteInGallery(thumb) {
    if (thumb === void 0) {
      return Promise.resolve(0 /* ERROR */);
    }
    const status = await addFavorite(thumb.id);
    if (status === 3 /* SUCCESSFULLY_ADDED */) {
      Events.gallery.favoriteToggled.emit(thumb.id);
    }
    return status;
  }
  function removeFavoriteInGallery(thumb) {
    if (thumb === void 0) {
      return Promise.resolve(0 /* ERROR */);
    }
    const removeFavoriteButton = thumb.querySelector(".remove-favorite-button");
    const showRemoveFavoriteCheckbox = document.getElementById("show-remove-favorite-buttons");
    if (removeFavoriteButton === null || showRemoveFavoriteCheckbox === null) {
      return Promise.resolve(0 /* ERROR */);
    }
    const allowedToRemoveFavorites = showRemoveFavoriteCheckbox instanceof HTMLInputElement && showRemoveFavoriteCheckbox.checked;
    if (!allowedToRemoveFavorites) {
      return Promise.resolve(1 /* FORBIDDEN */);
    }
    removeFavorite(thumb.id);
    Events.gallery.favoriteToggled.emit(thumb.id);
    Events.favorites.favoriteRemoved.emit(thumb.id);
    return Promise.resolve(2 /* SUCCESSFULLY_REMOVED */);
  }
  var currentState = getStartState();
  function getCurrentState() {
    return currentState;
  }
  function changeState(state) {
    currentState = state;
    onStateChange();
  }
  function getStartState() {
    if (Preferences.showOnHoverEnabled.value) {
      return 1 /* SHOWING_CONTENT_ON_HOVER */;
    }
    return 0 /* IDLE */;
  }
  function onStateChange() {
    switch (currentState) {
      case 0 /* IDLE */:
        break;
      case 1 /* SHOWING_CONTENT_ON_HOVER */:
        break;
      case 2 /* IN_GALLERY */:
        break;
      default:
        break;
    }
  }
  var GallerySettings = {
    mainCanvasResolutions: {
      search: "3840x2160",
      favorites: "7680x4320",
      mobile: "1920x1080"
    },
    get mainCanvasResolution() {
      if (ON_MOBILE_DEVICE) {
        return GallerySettings.mainCanvasResolutions.mobile;
      }
      return ON_SEARCH_PAGE ? GallerySettings.mainCanvasResolutions.search : GallerySettings.mainCanvasResolutions.favorites;
    },
    imageMegabyteLimit: ON_MOBILE_DEVICE ? 0 : 850,
    searchPagePreloadedImageCount: ON_MOBILE_DEVICE ? 4 : POSTS_PER_SEARCH_PAGE,
    minimumPreloadedImageCount: ON_MOBILE_DEVICE ? 3 : 5,
    preloadedVideoCount: ON_MOBILE_DEVICE ? 2 : 2,
    preloadedGifCount: ON_MOBILE_DEVICE ? 2 : 2,
    preloadContentDebounceTime: 150,
    preloadingEnabled: true,
    visibleThumbsDownwardScrollPixelGenerosity: 50,
    visibleThumbsDownwardScrollPercentageGenerosity: 100,
    navigationThrottleTime: 250,
    maxImagesToRenderAroundInGallery: ON_MOBILE_DEVICE ? 3 : 50,
    idleInteractionDuration: 1e3,
    menuVisibilityTime: ON_MOBILE_DEVICE ? 2e3 : 1e3,
    maxVisibleThumbsBeforeStoppingPreload: 175,
    galleryNavigationDelay: 100,
    useOffscreenThumbUpscaler: false,
    fetchImageBitmapsInWorker: true,
    get sendImageBitmapsToWorker() {
      return !this.fetchImageBitmapsInWorker;
    },
    createImageAccentColors: false,
    galleryMenuMonoColor: true,
    preloadOutsideGalleryOnSearchPage: true,
    gifPreloadingEnabled: false,
    upscaleEverythingOnSearchPage: false
  };
  var thumbsOnCurrentPage = [];
  var enumeratedThumbs = /* @__PURE__ */ new Map();
  function getThumbsOnCurrentPage() {
    return thumbsOnCurrentPage;
  }
  function indexCurrentPageThumbs(thumbs) {
    thumbsOnCurrentPage = thumbs;
    enumerateCurrentPageThumbs();
  }
  function enumerateCurrentPageThumbs() {
    for (let i = 0; i < thumbsOnCurrentPage.length; i += 1) {
      enumeratedThumbs.set(removeNonNumericCharacters(thumbsOnCurrentPage[i].id), i);
    }
  }
  function getIndexFromThumb(thumb) {
    return enumeratedThumbs.get(thumb.id) ?? 0;
  }
  function getFavoritesPageSearchResultsAround(thumb, limit = 50) {
    const latestFavoritesPageSearchResults = CrossFeatureRequests.latestFavoritesSearchResults.request();
    const startIndex = latestFavoritesPageSearchResults.findIndex((post) => post.id === thumb.id);
    const adjacentSearchResults = getWrappedElementsAroundIndex(latestFavoritesPageSearchResults, startIndex, limit);
    return adjacentSearchResults.map((favorite) => favorite.root);
  }
  function getSearchPageThumbsAround(thumb) {
    const latestSearchPageThumbs = CrossFeatureRequests.latestSearchPageThumbs.request();
    const index = latestSearchPageThumbs.findIndex((t) => t.id === thumb.id);
    if (index === -1) {
      return [];
    }
    return getElementsAroundIndex(latestSearchPageThumbs, index, 100);
  }
  var currentIndex = 0;
  var recentlyExitedGallery = false;
  function hasRecentlyExitedGallery() {
    return recentlyExitedGallery;
  }
  function getCurrentThumb() {
    return getThumbsOnCurrentPage()[currentIndex];
  }
  function getCurrentState2() {
    return getCurrentState();
  }
  function inGallery() {
    return getCurrentState() === 2 /* IN_GALLERY */;
  }
  function showOnHoverEnabled() {
    return getCurrentState() === 1 /* SHOWING_CONTENT_ON_HOVER */;
  }
  function isViewingVideo() {
    if (getCurrentState() !== 2 /* IN_GALLERY */) {
      return false;
    }
    const currentThumb3 = getCurrentThumb();
    return currentThumb3 !== void 0 && isVideo(currentThumb3);
  }
  function enterGallery(thumb) {
    currentIndex = getIndexFromThumb(thumb);
    changeState(2 /* IN_GALLERY */);
  }
  function exitGallery() {
    changeState(0 /* IDLE */);
    recentlyExitedGallery = true;
    setTimeout(() => {
      recentlyExitedGallery = false;
    }, 500);
  }
  function toggleShowContentOnHover() {
    if (getCurrentState() === 1 /* SHOWING_CONTENT_ON_HOVER */) {
      changeState(0 /* IDLE */);
      return;
    }
    changeState(1 /* SHOWING_CONTENT_ON_HOVER */);
  }
  function navigate(direction) {
    const nextIndex = isForwardNavigationKey(direction) ? currentIndex + 1 : currentIndex - 1;
    setCurrentIndex(nextIndex);
    return getBoundary(nextIndex);
  }
  function navigateRight() {
    setCurrentIndex(currentIndex + 1);
  }
  function getBoundary(index) {
    if (index < 0) {
      return 1 /* AT_LEFT_BOUNDARY */;
    }
    if (index >= getThumbsOnCurrentPage().length) {
      return 2 /* AT_RIGHT_BOUNDARY */;
    }
    return 0 /* IN_BOUNDS */;
  }
  function navigateToPreviousPage() {
    setCurrentIndex(getThumbsOnCurrentPage().length - 1);
  }
  function navigateToNextPage() {
    setCurrentIndex(0);
  }
  function getThumbsAround(thumb) {
    if (ON_FAVORITES_PAGE) {
      return getFavoritesPageSearchResultsAround(thumb);
    }
    return getSearchPageThumbsAround(thumb);
  }
  function indexCurrentPageThumbs2() {
    indexCurrentPageThumbs(getAllThumbs());
  }
  function openPostInNewTab() {
    const currentThumb3 = getCurrentThumb();
    if (currentThumb3 !== void 0) {
      openPostPage(currentThumb3.id);
    }
  }
  function openOriginalInNewTab() {
    const currentThumb3 = getCurrentThumb();
    if (currentThumb3 !== void 0) {
      openOriginal(currentThumb3);
    }
  }
  function downloadInGallery() {
    const currentThumb3 = getCurrentThumb();
    if (currentThumb3 !== void 0) {
      downloadFromThumb(currentThumb3);
    }
  }
  function addFavoriteInGallery2() {
    return addFavoriteInGallery(getCurrentThumb());
  }
  function removeFavoriteInGallery2() {
    return removeFavoriteInGallery(getCurrentThumb());
  }
  function setCurrentIndex(value) {
    currentIndex = clamp(value, 0, getThumbsOnCurrentPage().length - 1);
  }
  var visibleThumbs = /* @__PURE__ */ new Map();
  var centerThumb = null;
  var intersectionObserver = createIntersectionObserver(getInitialFavoritesMenuHeight());
  var bypassDebounce = true;
  var broadcastDebounceAlways = debounceAlways((entries) => {
    Events.gallery.visibleThumbsChanged.emit(entries);
  }, GallerySettings.preloadContentDebounceTime);
  function broadcastVisibleThumbsChanged(entries) {
    if (bypassDebounce) {
      bypassDebounce = false;
      Events.gallery.visibleThumbsChanged.emit(entries);
    } else {
      broadcastDebounceAlways(entries);
    }
  }
  function onVisibleThumbsChanged(entries) {
    updateVisibleThumbs(entries);
    broadcastVisibleThumbsChanged(entries);
  }
  function updateVisibleThumbs(entries) {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        visibleThumbs.set(entry.target.id, entry);
      } else {
        visibleThumbs.delete(entry.target.id);
      }
    }
  }
  function getInitialFavoritesMenuHeight() {
    return -200;
  }
  function createIntersectionObserver(topMargin = 0) {
    if (ON_MOBILE_DEVICE) {
      return null;
    }
    if (ON_SEARCH_PAGE && !GallerySettings.upscaleEverythingOnSearchPage) {
      return null;
    }
    return new IntersectionObserver(onVisibleThumbsChanged, {
      root: null,
      rootMargin: getFinalRootMargin(topMargin),
      threshold: [0.1]
    });
  }
  function getFinalRootMargin(topMargin) {
    return `${topMargin}px 0px ${GallerySettings.visibleThumbsDownwardScrollPercentageGenerosity}% 0px`;
  }
  function sortByDistanceFromCenterThumb(entries) {
    if (centerThumb === null) {
      return entries;
    }
    const centerEntry = visibleThumbs.get(centerThumb.id);
    return centerEntry === void 0 ? entries : sortByDistance(centerEntry, entries);
  }
  function sortByDistance(centerEntry, entries) {
    return entries.sort((a, b) => {
      const distanceA = getRectDistance(centerEntry.boundingClientRect, a.boundingClientRect);
      const distanceB = getRectDistance(centerEntry.boundingClientRect, b.boundingClientRect);
      return distanceA - distanceB;
    });
  }
  function bypassDebounceAlwaysOnPageChange() {
    Events.favorites.pageChanged.on(() => {
      bypassDebounce = true;
    });
  }
  function observe(thumbs) {
    if (intersectionObserver === null) {
      return;
    }
    for (const thumb of thumbs) {
      intersectionObserver.observe(thumb);
    }
  }
  async function observeAllThumbsOnPage() {
    if (intersectionObserver === null) {
      return;
    }
    intersectionObserver.disconnect();
    visibleThumbs.clear();
    await waitForAllThumbnailsToLoad();
    observe(getAllThumbs());
  }
  function setCenterThumb(thumb) {
    centerThumb = thumb;
  }
  function resetCenterThumb() {
    centerThumb = null;
  }
  function getVisibleThumbs() {
    const entries = Array.from(visibleThumbs.values());
    return sortByDistanceFromCenterThumb(entries).map((entry) => entry.target).filter((target) => target instanceof HTMLElement);
  }
  function setupVisibleThumbObserver() {
    bypassDebounceAlwaysOnPageChange();
    if (ON_SEARCH_PAGE) {
      observeAllThumbsOnPage();
    }
  }
  var GALLERY_CONTAINER = document.createElement("div");
  GALLERY_CONTAINER.id = "gallery-container";
  GALLERY_CONTAINER.style.display = "none";
  function insertGalleryContainer() {
    insertStyleHTML(GALLERY_HTML);
    FAVORITES_SEARCH_GALLERY_CONTAINER.insertAdjacentElement("beforeend", GALLERY_CONTAINER);
  }
  var GalleryBaseRenderer = class {
    container;
    constructor() {
      this.container = document.createElement("div");
      GALLERY_CONTAINER.appendChild(this.container);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    display(element) {
      this.container.style.display = "block";
    }
    hide() {
      this.container.style.display = "none";
    }
  };
  function getGIFSource(thumb) {
    const tags = getTagSetFromItem(thumb);
    const extension = tags.has("animated_png") ? "png" : "gif";
    return getOriginalImageURLWithJPGExtension(thumb).replace("jpg", extension);
  }
  var GifRenderer = class extends GalleryBaseRenderer {
    gif;
    preloadedGIFs;
    constructor() {
      super();
      this.container.id = "gif-container";
      this.gif = document.createElement("img");
      this.container.className = "fullscreen-image-container";
      this.gif.className = "fullscreen-image";
      this.preloadedGIFs = [];
      this.container.appendChild(this.gif);
    }
    display(element) {
      super.display(element);
      this.gif.src = "";
      this.gif.src = getGIFSource(element);
    }
    hide() {
      super.hide();
      this.gif.src = "";
    }
    preload(elements) {
      if (!GallerySettings.gifPreloadingEnabled) {
        return;
      }
      const gifSources = elements.filter((element) => isGif(element)).slice(0, GallerySettings.preloadedGifCount).map((element) => getGIFSource(element));
      for (const source of gifSources) {
        const gif = new Image();
        gif.src = source;
        this.preloadedGIFs.push(gif);
      }
    }
    handlePageChange() {
    }
    handlePageChangeInGallery() {
    }
  };
  var GalleryGifRenderer = new GifRenderer();
  function drawScaledCanvas(context, imageBitmap) {
    if (context === null) {
      return;
    }
    const canvas = context.canvas;
    const ratio = Math.min(canvas.width / imageBitmap.width, canvas.height / imageBitmap.height);
    const centerShiftX = (canvas.width - imageBitmap.width * ratio) / 2;
    const centerShiftY = (canvas.height - imageBitmap.height * ratio) / 2;
    context.drawImage(
      imageBitmap,
      0,
      0,
      imageBitmap.width,
      imageBitmap.height,
      centerShiftX,
      centerShiftY,
      imageBitmap.width * ratio,
      imageBitmap.height * ratio
    );
  }
  function drawScaledCanvasAfterClearing(context, imageBitmap) {
    if (context !== null) {
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      drawScaledCanvas(context, imageBitmap);
    }
  }
  var CANVAS = document.createElement("canvas");
  var CONTEXT = CANVAS.getContext("2d") ?? new CanvasRenderingContext2D();
  var LANDSCAPE_STYLE = `
  .fullscreen-image {
      height: 100vh !important;
      width: auto !important;
  }
  `;
  var PORTRAIT_STYLE = `
  .fullscreen-image {
      width: 100vw !important;
      height: auto !important;
  }
  `;
  var container2;
  function insertGalleryCanvas(newContainer) {
    newContainer.id = "canvas-container";
    newContainer.className = "fullscreen-image-container";
    newContainer.appendChild(CANVAS);
    container2 = newContainer;
  }
  function correctOrientation() {
    if (ON_DESKTOP_DEVICE) {
      return;
    }
    const usingLandscape = window.screen.orientation.angle === 90 || window.screen.orientation.angle === 270;
    const usingCorrectOrientation = usingLandscape && CANVAS.width > CANVAS.height || !usingLandscape && CANVAS.width < CANVAS.height;
    if (usingCorrectOrientation) {
      return;
    }
    insertStyleHTML(usingLandscape ? LANDSCAPE_STYLE : PORTRAIT_STYLE, "gallery-canvas-orientation");
    const tempWidth = CANVAS.width;
    CANVAS.width = CANVAS.height;
    CANVAS.height = tempWidth;
  }
  function setupGalleryCanvas(newContainer) {
    CANVAS.className = "fullscreen-image";
    const dimensions = getDimensions2D(GallerySettings.mainCanvasResolution);
    CANVAS.width = dimensions.width;
    CANVAS.height = dimensions.height;
    correctOrientation();
    insertGalleryCanvas(newContainer);
  }
  function draw(bitmap) {
    if (bitmap !== null) {
      drawScaledCanvasAfterClearing(CONTEXT, bitmap);
    }
  }
  function clear2() {
    CONTEXT.clearRect(0, 0, CANVAS.width, CANVAS.height);
  }
  function zoomToPoint(x, y) {
    const xPercentage = clamp(roundToTwoDecimalPlaces(x / window.innerWidth), 0, 1);
    const yPercentage = clamp(roundToTwoDecimalPlaces(y / window.innerHeight), 0, 1);
    container2.scrollLeft = (container2.scrollWidth - container2.clientWidth) * xPercentage;
    container2.scrollTop = (container2.scrollHeight - container2.clientHeight) * yPercentage;
  }
  var IMAGE_BITMAP_CLOSE_QUEUE = new ThrottledQueue(100);
  function getFavoritePixelCount(id) {
    const favorite = getFavorite(id);
    if (favorite === void 0) {
      return 0;
    }
    return favorite.metrics.width * favorite.metrics.height;
  }
  var ImageRequest = class {
    id;
    thumbURL;
    thumb;
    bitmap;
    abortController;
    cancelled;
    contentType;
    accentColor;
    constructor(thumb) {
      this.id = thumb.id;
      this.thumbURL = getPreviewURL(thumb) ?? "";
      this.thumb = thumb;
      this.bitmap = null;
      this.abortController = new AbortController();
      this.cancelled = false;
      this.contentType = getContentTypeFromThumb(thumb);
      this.accentColor = null;
    }
    get megabytes() {
      return getFavoritePixelCount(this.id) / 22e4;
    }
    get isImage() {
      return this.contentType === "image";
    }
    get isAnimated() {
      return !this.isImage;
    }
    get isIncomplete() {
      return this.bitmap === null;
    }
    get hasCompleted() {
      return !this.isIncomplete;
    }
    get isOriginalResolution() {
      return true;
    }
    complete(bitmap) {
      this.bitmap = bitmap;
    }
    stop() {
      this.cancelled = true;
      this.abortController.abort();
    }
    async close() {
      if (this.bitmap instanceof ImageBitmap) {
        await IMAGE_BITMAP_CLOSE_QUEUE.wait();
        this.bitmap.close();
      }
    }
  };
  var LowResolutionImageRequest = class extends ImageRequest {
    get isOriginalResolution() {
      return false;
    }
  };
  var ANIMATED_REQUEST_IDS = /* @__PURE__ */ new Set();
  var IMAGE_REQUESTS = /* @__PURE__ */ new Map();
  var FETCH_QUEUE = new ThrottledQueue(10);
  var onImageCreated = DO_NOTHING;
  function completeImageRequest(request) {
    if (IMAGE_REQUESTS.has(request.id) && request.isImage) {
      IMAGE_REQUESTS.set(request.id, request);
    }
    onImageCreated(request);
  }
  function getTruncatedImageRequests(thumbs) {
    return truncateImageRequests(thumbs.map((thumb) => new ImageRequest(thumb)));
  }
  function truncateImageRequests(requests) {
    if (ON_FAVORITES_PAGE) {
      return truncateImagesOnFavoritesPage(requests);
    }
    return truncateImagesOnSearchPage(requests);
  }
  function truncateImagesOnFavoritesPage(requests) {
    return truncateImagesExceedingMemoryLimit(requests);
  }
  function truncateImagesExceedingMemoryLimit(requests) {
    const truncatedRequests = [];
    let accumulatedMegabytes = 0;
    let i = 0;
    while (i < requests.length && (accumulatedMegabytes < GallerySettings.imageMegabyteLimit || truncatedRequests.length < GallerySettings.minimumPreloadedImageCount)) {
      accumulatedMegabytes += requests[i].isImage ? requests[i].megabytes : 0;
      truncatedRequests.push(requests[i]);
      i += 1;
    }
    return truncatedRequests;
  }
  function truncateImagesOnSearchPage(requests) {
    return requests.slice(0, GallerySettings.searchPagePreloadedImageCount).filter((request) => Preferences.upscaleThumbsOnSearchPage || !request.isAnimated);
  }
  function removeOutdatedRequestsFromCache(newRequests) {
    const idsToCache = new Set(newRequests.map((thumb) => thumb.id));
    for (const [id, request] of IMAGE_REQUESTS.entries()) {
      if (!idsToCache.has(id)) {
        removeRequest(request);
      }
    }
  }
  function removeRequest(request) {
    request.close();
    request.stop();
    IMAGE_REQUESTS.delete(request.id);
  }
  function filterAlreadyStartedRequests(requests) {
    return requests.filter((request) => !ANIMATED_REQUEST_IDS.has(request.id) && !IMAGE_REQUESTS.has(request.id));
  }
  async function createImages(requests) {
    for (const request of requests) {
      await FETCH_QUEUE.wait();
      createImage(request);
    }
  }
  async function createImage(request) {
    if (request.cancelled) {
      return;
    }
    const bitmap = await fetchImageBitmapFromThumb(request.thumb, request.abortController).catch((error) => {
      if (!(error instanceof DOMException) || error.name !== "AbortError") {
        throw error;
      }
    });
    if (bitmap instanceof ImageBitmap) {
      request.complete(bitmap);
      completeImageRequest(request);
    }
  }
  function saveRequests(requests) {
    for (const request of requests) {
      saveRequest(request);
    }
  }
  function saveRequest(request) {
    if (request.isImage) {
      IMAGE_REQUESTS.set(request.id, request);
    } else {
      ANIMATED_REQUEST_IDS.add(request.id);
    }
  }
  function clearAnimatedImages() {
    ANIMATED_REQUEST_IDS.clear();
  }
  function setupGalleryImageCache(creationCallback) {
    onImageCreated = creationCallback;
  }
  function cacheImages(thumbs) {
    const newRequests = getTruncatedImageRequests(thumbs);
    removeOutdatedRequestsFromCache(newRequests);
    const finalRequests = filterAlreadyStartedRequests(newRequests);
    saveRequests(finalRequests);
    createImages(finalRequests);
  }
  function clear3() {
    for (const request of IMAGE_REQUESTS.values()) {
      removeRequest(request);
    }
    IMAGE_REQUESTS.clear();
    clearAnimatedImages();
  }
  function getImageRequests() {
    return Array.from(IMAGE_REQUESTS.values());
  }
  function getImageRequest(thumb) {
    return IMAGE_REQUESTS.get(thumb.id);
  }
  function createLowResolutionImage(thumb) {
    const image = getImageFromThumb(thumb);
    if (image === null || image.naturalWidth === 0 || image.naturalHeight === 0) {
      return;
    }
    const lowResolutionRequest = new LowResolutionImageRequest(thumb);
    createImageBitmap(image).then((bitmap) => {
      const originalResolutionRequest = IMAGE_REQUESTS.get(thumb.id);
      if (originalResolutionRequest === void 0 || originalResolutionRequest.isIncomplete) {
        lowResolutionRequest.complete(bitmap);
        completeImageRequest(lowResolutionRequest);
      }
    });
  }
  function createImageFromThumb(thumb) {
    forceImageContentType(thumb);
    const request = new ImageRequest(thumb);
    createImage(request);
    saveRequest(request);
  }
  var SharedGallerySettings = {
    upscaledThumbCanvasWidth: 1200,
    maxUpscaledThumbCanvasHeight: 16e3,
    upscaleUsingSamples: false
  };
  var TRANSFERRED_CANVAS_IDS = /* @__PURE__ */ new Set();
  function getImageBitmapClone(imageRequest) {
    if (GallerySettings.fetchImageBitmapsInWorker) {
      return Promise.resolve(null);
    }
    if (!(imageRequest.bitmap instanceof ImageBitmap)) {
      throw new Error("Tried to create upscale request without image bitmap");
    }
    return createImageBitmap(imageRequest.bitmap);
  }
  async function getUpscaleRequest(imageRequest) {
    const bitmapClone = await getImageBitmapClone(imageRequest);
    const imageURL = await getOriginalImageURL(imageRequest.thumb);
    return new OffscreenUpscaleRequest(imageRequest.thumb, bitmapClone, imageURL);
  }
  var OffscreenUpscaleRequest = class {
    id;
    action;
    hasDimensions;
    offscreenCanvas;
    bitmap;
    imageURL;
    sampleURL;
    constructor(thumb, bitmap, imageURL) {
      this.id = thumb.id;
      this.action = "upscale";
      this.hasDimensions = false;
      this.offscreenCanvas = this.getOffscreenCanvas(thumb);
      this.bitmap = bitmap;
      this.imageURL = imageURL;
      this.sampleURL = isImage(thumb) ? convertImageURLToSampleURL(imageURL) : imageURL;
    }
    get transferable() {
      return this.offscreenCanvas === null ? [] : [this.offscreenCanvas];
    }
    getOffscreenCanvas(thumb) {
      if (TRANSFERRED_CANVAS_IDS.has(this.id)) {
        return null;
      }
      TRANSFERRED_CANVAS_IDS.add(this.id);
      const canvas = thumb.querySelector("canvas");
      if (canvas === null) {
        throw new Error("Tried to create upscale request with null canvas");
      }
      this.hasDimensions = canvas.dataset.size !== void 0;
      return canvas.transferControlToOffscreen();
    }
  };
  var GalleryBaseThumbUpscaler = class {
    upscaledIds;
    constructor() {
      this.upscaledIds = /* @__PURE__ */ new Set();
    }
    upscale(request) {
      if (this.enabled() && this.requestIsValid(request)) {
        this.finishUpscale(request);
        this.upscaledIds.add(request.id);
      }
    }
    handlePageChange() {
      this.clear();
      this.presetCanvasDimensions(getAllThumbs());
    }
    clear() {
      this.upscaledIds.clear();
    }
    presetCanvasDimensions(thumbs) {
      if (!ON_FAVORITES_PAGE) {
        return;
      }
      for (const item of this.getCanvasDimensions(thumbs)) {
        if (TRANSFERRED_CANVAS_IDS.has(item.id)) {
          continue;
        }
        this.setThumbCanvasDimensions(item.canvas, item.width, item.height);
      }
    }
    getCanvasDimensions(thumbs) {
      return thumbs.map((thumb) => ({
        id: thumb.id,
        canvas: thumb.querySelector("canvas") || new HTMLCanvasElement()
      })).filter((item) => item.canvas.dataset.size !== void 0).map((item) => {
        const dimensions = getDimensions2D(item.canvas.dataset.size);
        return {
          id: item.id,
          canvas: item.canvas,
          width: dimensions.width,
          height: dimensions.height
        };
      });
    }
    setThumbCanvasDimensions(canvas, width, height) {
      const maxHeight = SharedGallerySettings.maxUpscaledThumbCanvasHeight;
      let targetWidth = SharedGallerySettings.upscaledThumbCanvasWidth;
      let targetHeight = targetWidth / width * height;
      if (targetWidth > width) {
        targetWidth = width;
        targetHeight = height;
      }
      if (height > maxHeight) {
        targetWidth *= maxHeight / height;
        targetHeight = maxHeight;
      }
      canvas.width = targetWidth;
      canvas.height = targetHeight;
    }
    requestIsValid(request) {
      const thumbIsOnPage = document.getElementById(request.id) !== null;
      return thumbIsOnPage && request.isOriginalResolution && request.hasCompleted && !this.upscaledIds.has(request.id);
    }
    enabled() {
      if (ON_SEARCH_PAGE && !Preferences.upscaleThumbsOnSearchPage.value) {
        return false;
      }
      return Preferences.performanceProfile.value === 0 /* NORMAL */;
    }
  };
  var GalleryNormalThumbUpscaler = class extends GalleryBaseThumbUpscaler {
    canvases = /* @__PURE__ */ new Map();
    finishUpscale(request) {
      if (SharedGallerySettings.upscaleUsingSamples) {
        this.upscaleSampleImageRequest(request);
      } else {
        this.upscaleImageRequest(request);
      }
    }
    upscaleImageRequest(request) {
      const canvas = request.thumb.querySelector("canvas");
      if (!(canvas instanceof HTMLCanvasElement) || !(request.bitmap instanceof ImageBitmap)) {
        return;
      }
      this.canvases.set(request.id, canvas);
      this.setCanvasDimensionsFromImageBitmap(canvas, request.bitmap);
      drawScaledCanvas(canvas.getContext("2d"), request.bitmap);
      if (request.isAnimated) {
        request.close();
      }
    }
    async upscaleSampleImageRequest(request) {
      const bitmap = isImage(request.thumb) ? await fetchSampleImageBitmapFromThumb(request.thumb) : await fetchImageBitmapFromThumb(request.thumb);
      request.complete(bitmap);
      this.upscaleImageRequest(request);
      request.close();
    }
    clear() {
      super.clear();
      for (const canvas of this.canvases.values()) {
        this.clearCanvas(canvas);
      }
      this.canvases.clear();
    }
    setCanvasDimensionsFromImageBitmap(canvas, bitmap) {
      if (canvas.dataset.size === void 0) {
        this.setThumbCanvasDimensions(canvas, bitmap.width, bitmap.height);
      }
    }
    clearCanvas(canvas) {
      const context = canvas.getContext("2d");
      if (context !== null) {
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
      canvas.width = 0;
      canvas.height = 0;
    }
    upscaleBatch(requests) {
      for (const request of requests) {
        this.upscaleImageRequest(request);
      }
    }
  };
  var gallery_offscreen_thumbnail_upscaler_default = '(() => {\n  const OFFSCREEN_CANVASES = /* @__PURE__ */ new Map();\n  async function createImageBitmapFromRequest(request) {\n    const url = SharedGallerySettings.upscaleUsingSamples ? request.sampleURL : request.imageURL;\n    let response = await fetch(url);\n    if (!response.ok) {\n      response = await fetch(request.imageURL);\n    }\n    return createImageBitmap(await response.blob());\n  }\n  function getImageBitmapFromRequest(request) {\n    return request.bitmap instanceof ImageBitmap ? Promise.resolve(request.bitmap) : createImageBitmapFromRequest(request);\n  }\n  function drawOffscreenCanvas(context, bitmap) {\n    if (context === null) {\n      return;\n    }\n    const offscreenCanvas = context.canvas;\n    const ratio = Math.min(offscreenCanvas.width / bitmap.width, offscreenCanvas.height / bitmap.height);\n    const centerShiftX = (offscreenCanvas.width - bitmap.width * ratio) / 2;\n    const centerShiftY = (offscreenCanvas.height - bitmap.height * ratio) / 2;\n    context.drawImage(\n      bitmap,\n      0,\n      0,\n      bitmap.width,\n      bitmap.height,\n      centerShiftX,\n      centerShiftY,\n      bitmap.width * ratio,\n      bitmap.height * ratio\n    );\n    bitmap.close();\n  }\n  function clearOffscreenCanvas(offscreenCanvas) {\n    const width = offscreenCanvas.width;\n    const height = offscreenCanvas.height;\n    const context = offscreenCanvas.getContext("2d");\n    if (context instanceof OffscreenCanvasRenderingContext2D) {\n      context.clearRect(0, 0, width, height);\n    }\n    offscreenCanvas.width = 0;\n    offscreenCanvas.height = 0;\n    setTimeout(() => {\n      offscreenCanvas.width = width;\n      offscreenCanvas.height = height;\n    }, 20);\n  }\n  function setOffscreenCanvasDimensions(request, bitmap) {\n    if (request.hasDimensions || request.offscreenCanvas === null) {\n      return;\n    }\n    const maxHeight = SharedGallerySettings.maxUpscaledThumbCanvasHeight;\n    const width = bitmap.width;\n    const height = bitmap.height;\n    let targetWidth = SharedGallerySettings.upscaledThumbCanvasWidth;\n    let targetHeight = targetWidth / width * height;\n    if (targetWidth > width) {\n      targetWidth = width;\n      targetHeight = height;\n    }\n    if (height > maxHeight) {\n      targetWidth *= maxHeight / height;\n      targetHeight = maxHeight;\n    }\n    request.offscreenCanvas.width = targetWidth;\n    request.offscreenCanvas.height = targetHeight;\n  }\n  function handleMessage(message) {\n    const request = message.data;\n    switch (request.action) {\n      case "upscale":\n        upscale(request.request);\n        break;\n      case "clear":\n        clear();\n        break;\n      default:\n        break;\n    }\n  }\n  async function upscale(request) {\n    const bitmap = await getImageBitmapFromRequest(request);\n    collectOffscreenCanvas(request, bitmap);\n    drawOffscreenCanvasFromRequest(request, bitmap);\n  }\n  function collectOffscreenCanvas(request, bitmap) {\n    if (!OFFSCREEN_CANVASES.has(request.id) && request.offscreenCanvas !== null) {\n      OFFSCREEN_CANVASES.set(request.id, request.offscreenCanvas);\n      setOffscreenCanvasDimensions(request, bitmap);\n    }\n  }\n  function drawOffscreenCanvasFromRequest(request, bitmap) {\n    const offscreenCanvas = OFFSCREEN_CANVASES.get(request.id);\n    if (offscreenCanvas === void 0) {\n      return;\n    }\n    drawOffscreenCanvas(offscreenCanvas.getContext("2d"), bitmap);\n  }\n  function clear() {\n    for (const offscreenCanvas of OFFSCREEN_CANVASES.values()) {\n      clearOffscreenCanvas(offscreenCanvas);\n    }\n  }\n  onmessage = handleMessage;\n})();\n';
  var gallery_shared_settings_default = "(() => {\n  const SharedGallerySettings = {\n    upscaledThumbCanvasWidth: 1200,\n    maxUpscaledThumbCanvasHeight: 16e3,\n    upscaleUsingSamples: false\n  };\n})();\n";
  function createWebWorker(script) {
    const blob = new Blob([script], { type: "application/javascript" });
    return new Worker(URL.createObjectURL(blob));
  }
  var GalleryOffscreenThumbnailUpscalerWrapper = class extends GalleryBaseThumbUpscaler {
    worker;
    upscaleQueue;
    constructor() {
      super();
      this.worker = createWebWorker(`${removeFirstAndLastLines(gallery_shared_settings_default)}
${gallery_offscreen_thumbnail_upscaler_default}`);
      this.upscaleQueue = new ThrottledQueue(25);
    }
    async finishUpscale(request) {
      const upscaleRequest = await getUpscaleRequest(request);
      await this.upscaleQueue.wait();
      this.sendRequestToWorker(upscaleRequest);
    }
    clear() {
      super.clear();
      this.upscaleQueue.reset();
      this.worker.postMessage({
        action: "clear"
      });
    }
    sendRequestToWorker(request) {
      this.worker.postMessage({
        action: "upscale",
        request
      }, request.transferable);
    }
  };
  var UpscaleImageRequest = class extends ImageRequest {
    get isIncomplete() {
      return false;
    }
  };
  var UPSCALER = GallerySettings.useOffscreenThumbUpscaler ? new GalleryOffscreenThumbnailUpscalerWrapper() : new GalleryNormalThumbUpscaler();
  var UPSCALE_QUEUE = new ThrottledQueue(20, !USING_FIREFOX);
  var ImageRenderer = class extends GalleryBaseRenderer {
    lastShownId;
    constructor() {
      super();
      setupGalleryImageCache(this.onImageCreated.bind(this));
      setupGalleryCanvas(this.container);
      this.lastShownId = "";
    }
    display(thumb) {
      super.display(thumb);
      this.draw(thumb);
    }
    preload(thumbs) {
      cacheImages(thumbs);
    }
    async upscale(thumbs) {
      for (const thumb of thumbs) {
        await UPSCALE_QUEUE.wait();
        UPSCALER.upscale(new UpscaleImageRequest(thumb));
      }
    }
    handlePageChange() {
      clear3();
      UPSCALER.handlePageChange();
    }
    handlePageChangeInGallery() {
      clearAnimatedImages();
      setTimeout(() => {
        UPSCALER.handlePageChange();
        this.upscaleCachedImageThumbs();
      }, 10);
    }
    handleFavoritesAddedToCurrentPage(thumbs) {
      UPSCALER.presetCanvasDimensions(thumbs);
    }
    upscaleCachedImageThumbs() {
      getImageRequests().forEach((request) => UPSCALER.upscale(request));
    }
    exitGallery() {
      if (USING_FIREFOX) {
        clear2();
      }
    }
    onImageCreated(request) {
      UPSCALER.upscale(request);
      if (request.id === this.lastShownId) {
        this.draw(request.thumb);
      }
    }
    toggleZoom(value) {
      return this.container.classList.toggle("zoomed-in", value);
    }
    toggleZoomCursor(value) {
      this.container.classList.toggle("zooming", value);
    }
    zoomToPoint(x, y) {
      zoomToPoint(x, y);
    }
    correctOrientation() {
      correctOrientation();
      this.redrawOnOrientationChange();
    }
    downscaleAll() {
      UPSCALER.clear();
      clearAnimatedImages();
    }
    redrawOnOrientationChange() {
      const thumb = document.getElementById(this.lastShownId);
      if (thumb === null) {
        return;
      }
      const imageRequest = getImageRequest(thumb);
      if (imageRequest === void 0 || imageRequest.isIncomplete) {
        return;
      }
      this.draw(thumb);
    }
    draw(thumb) {
      this.lastShownId = thumb.id;
      const imageRequest = getImageRequest(thumb);
      if (imageRequest === void 0) {
        createImageFromThumb(thumb);
        createLowResolutionImage(thumb);
        return;
      }
      if (imageRequest.isIncomplete) {
        createLowResolutionImage(thumb);
        return;
      }
      draw(imageRequest.bitmap);
    }
  };
  var GalleryImageRenderer = new ImageRenderer();
  var VIDEO_PLAYERS = [];
  var VIDEO_CLIPS = /* @__PURE__ */ new Map();
  var VIDEO_CONTAINER = document.createElement("div");
  VIDEO_CONTAINER.id = "video-container-inner";
  function createVideoPlayer(volume, muted) {
    const video = document.createElement("video");
    video.setAttribute("width", "100%");
    video.setAttribute("height", "100%");
    video.autoplay = true;
    video.volume = volume;
    video.muted = muted;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute("controlsList", "nofullscreen");
    video.setAttribute("webkit-playsinline", "");
    VIDEO_PLAYERS.push(video);
    VIDEO_CONTAINER.appendChild(video);
  }
  function createVideoPlayers() {
    const volume = Preferences.videoVolume.value;
    const muted = Preferences.videoMuted.value;
    createVideoPlayer(volume, muted);
    for (let i = 0; i < GallerySettings.preloadedVideoCount; i += 1) {
      createVideoPlayer(volume, muted);
    }
  }
  function preventVideoPlayersFromFlashingWhenLoaded() {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (context !== null) {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
    canvas.toBlob((blob) => {
      if (blob === null) {
        return;
      }
      const videoBackgroundURL = URL.createObjectURL(blob);
      for (const video of VIDEO_PLAYERS) {
        video.setAttribute("poster", videoBackgroundURL);
      }
    });
  }
  function preventDefaultBehaviorWhenControlKeyIsPressed() {
    VIDEO_CONTAINER.onclick = (event) => {
      if (!event.ctrlKey) {
        event.preventDefault();
      }
    };
  }
  function addEventListenersToVideoContainer() {
    preventDefaultBehaviorWhenControlKeyIsPressed();
  }
  function insertVideoContainer(container3) {
    container3.appendChild(VIDEO_CONTAINER);
  }
  function setupVideoController(container3) {
    insertVideoContainer(container3);
    createVideoPlayers();
    preventVideoPlayersFromFlashingWhenLoaded();
    addEventListenersToVideoContainer();
    addEventListenersToVideoPlayers();
    loadVideoClips();
  }
  function addEventListenersToVideoPlayers() {
    for (const video of VIDEO_PLAYERS) {
      addEventListenerToVideoPlayer(video);
    }
  }
  function addEventListenerToVideoPlayer(video) {
    revealControlsWhenMouseMoves(video);
    pauseWhenClicked(video);
    updateVolumeOfOtherVideoPlayersWhenVolumeChanges(video);
    broadcastEnding(video);
    broadcastDoubleClick(video);
    revealControlsWhenTouched(video);
  }
  function revealControlsWhenMouseMoves(video) {
    if (ON_MOBILE_DEVICE) {
      return;
    }
    video.addEventListener("mousemove", () => {
      if (!video.hasAttribute("controls")) {
        video.setAttribute("controls", "");
      }
    }, {
      passive: true
    });
  }
  function pauseWhenClicked(video) {
    video.addEventListener("click", (event) => {
      if (event.ctrlKey) {
        return;
      }
      toggleVideoPause(video);
    }, {
      passive: true
    });
  }
  function toggleVideoPause(video) {
    if (video.paused) {
      video.play().catch(() => {
      });
    } else {
      video.pause();
    }
  }
  function toggleVideoMute() {
    getActiveVideoPlayer().muted = !getActiveVideoPlayer().muted;
    Preferences.videoMuted.set(getActiveVideoPlayer().muted);
  }
  function updateVolumeOfOtherVideoPlayersWhenVolumeChanges(video) {
    video.addEventListener("volumechange", (event) => {
      if (!(event.target instanceof HTMLVideoElement)) {
        return;
      }
      if (event.target === null || !event.target.hasAttribute("active")) {
        return;
      }
      Preferences.videoVolume.set(video.volume);
      Preferences.videoMuted.set(video.muted);
      for (const v of getInactiveVideoPlayers()) {
        v.volume = video.volume;
        v.muted = video.muted;
      }
    }, {
      passive: true
    });
  }
  function broadcastEnding(video) {
    video.addEventListener("ended", () => {
      Events.gallery.videoEnded.emit();
    }, {
      passive: true
    });
  }
  function broadcastDoubleClick(video) {
    video.addEventListener("dblclick", (event) => {
      Events.gallery.videoDoubleClicked.emit(event);
    });
  }
  function revealControlsWhenTouched(video) {
    if (ON_DESKTOP_DEVICE) {
      return;
    }
    video.addEventListener("touchend", () => {
      toggleVideoControls(true);
    }, {
      passive: true
    });
  }
  function loadVideoClips() {
    setTimeout(() => {
      let storedVideoClips;
      try {
        storedVideoClips = JSON.parse(localStorage.getItem("storedVideoClips") || "{}");
        for (const [id, videoClip] of Object.entries(storedVideoClips)) {
          VIDEO_CLIPS.set(id, videoClip);
        }
      } catch (error) {
        console.error(error);
      }
    }, 50);
  }
  function getActiveVideoPlayer() {
    return VIDEO_PLAYERS.find((video) => video.hasAttribute("active")) || VIDEO_PLAYERS[0];
  }
  function getInactiveVideoPlayers() {
    return VIDEO_PLAYERS.filter((video) => !video.hasAttribute("active"));
  }
  function playVideo(thumb) {
    setActiveVideoPlayer(thumb);
    toggleVideoContainer(true);
    stopAllVideos();
    const video = getActiveVideoPlayer();
    return new Promise((resolve, reject) => {
      video.onloadedmetadata = () => resolve();
      video.onerror = () => {
        video.src = "";
        reject(new Error("Video failed to load"));
      };
      setVideoSource(video, thumb);
      video.style.display = "block";
      video.play().catch(() => {
      });
      toggleVideoControls(true);
    });
  }
  function stopAllVideos() {
    for (const video of VIDEO_PLAYERS) {
      stopVideo(video);
    }
  }
  function stopVideo(video) {
    video.style.display = "none";
    pauseVideo(video);
  }
  function pauseVideo(video) {
    video.pause();
    video.removeAttribute("controls");
  }
  function preloadVideoPlayers(thumbs) {
    const activeVideoPlayer = getActiveVideoPlayer();
    const inactiveVideoPlayers = getInactiveVideoPlayers();
    const videoThumbsAroundInitialThumb = thumbs.filter((thumb) => isVideo(thumb) && !videoPlayerHasSource(activeVideoPlayer, thumb)).slice(0, inactiveVideoPlayers.length);
    const loadedVideoSources = new Set(inactiveVideoPlayers.map((video) => video.src).filter((src) => src !== ""));
    const videoSourcesAroundInitialThumb = new Set(videoThumbsAroundInitialThumb.map((thumb) => getVideoSource(thumb)));
    const videoThumbsNotLoaded = videoThumbsAroundInitialThumb.filter((thumb) => !loadedVideoSources.has(getVideoSource(thumb)));
    const freeInactiveVideoPlayers = inactiveVideoPlayers.filter((video) => !videoSourcesAroundInitialThumb.has(video.src));
    for (let i = 0; i < freeInactiveVideoPlayers.length && i < videoThumbsNotLoaded.length; i += 1) {
      setVideoSource(freeInactiveVideoPlayers[i], videoThumbsNotLoaded[i]);
      pauseVideo(freeInactiveVideoPlayers[i]);
    }
  }
  function videoPlayerHasSource(video, thumb) {
    return video.src === getVideoSource(thumb);
  }
  function getVideoSource(thumb) {
    return convertPreviewURLToImageURL(getPreviewURL(thumb) ?? "").replace("jpg", "mp4");
  }
  function setVideoSource(video, thumb) {
    if (videoPlayerHasSource(video, thumb)) {
      return;
    }
    createVideoClip(video, thumb);
    video.src = getVideoSource(thumb);
  }
  function createVideoClip(video, thumb) {
    const videoClip = VIDEO_CLIPS.get(thumb.id);
    if (videoClip === void 0) {
      video.ontimeupdate = null;
      return;
    }
    video.ontimeupdate = () => {
      if (video.currentTime < videoClip.start || video.currentTime > videoClip.end) {
        video.removeAttribute("controls");
        video.currentTime = videoClip.start;
      }
    };
  }
  function setActiveVideoPlayer(thumb) {
    for (const video of VIDEO_PLAYERS) {
      video.removeAttribute("active");
    }
    for (const video of VIDEO_PLAYERS) {
      if (videoPlayerHasSource(video, thumb)) {
        video.setAttribute("active", "");
        return;
      }
    }
    VIDEO_PLAYERS[0].setAttribute("active", "");
  }
  function toggleVideoControls(value) {
    const video = getActiveVideoPlayer();
    if (ON_MOBILE_DEVICE) {
      if (value) {
        video.setAttribute("controls", "");
      }
    } else {
    }
    if (!value) {
      video.removeAttribute("controls");
    }
  }
  function clearVideoSources() {
    for (const video of VIDEO_PLAYERS) {
      video.src = "";
    }
  }
  function toggleVideoLooping(value) {
    for (const video of VIDEO_PLAYERS) {
      video.toggleAttribute("loop", value);
    }
  }
  function toggleVideoContainer(value) {
    VIDEO_CONTAINER.style.display = value ? "block" : "none";
  }
  function toggleActiveVideoPause() {
    if (document.activeElement !== getActiveVideoPlayer()) {
      toggleVideoPause(getActiveVideoPlayer());
    }
  }
  function restartActiveVideo() {
    getActiveVideoPlayer().play().catch();
  }
  var VideoRenderer = class extends GalleryBaseRenderer {
    constructor() {
      super();
      this.container.id = "video-container";
      setupVideoController(this.container);
    }
    display(thumb) {
      super.display(thumb);
      return playVideo(thumb);
    }
    hide() {
      super.hide();
      stopAllVideos();
    }
    handlePageChange() {
      clearVideoSources();
    }
    handlePageChangeInGallery() {
    }
    preload(thumbs) {
      preloadVideoPlayers(thumbs);
    }
    toggleVideoLooping(value) {
      toggleVideoLooping(value);
    }
    restartVideo() {
      restartActiveVideo();
    }
    toggleVideoPause() {
      toggleActiveVideoPause();
    }
    toggleVideoMute() {
      toggleVideoMute();
    }
  };
  var GalleryVideoRenderer = new VideoRenderer();
  function getRenderers() {
    return [GalleryGifRenderer, GalleryVideoRenderer, GalleryImageRenderer];
  }
  function render(thumb) {
    if (isVideo(thumb)) {
      return startRenderer(GalleryVideoRenderer, thumb);
    }
    if (isGif(thumb)) {
      return startRenderer(GalleryGifRenderer, thumb);
    }
    return startRenderer(GalleryImageRenderer, thumb);
  }
  function startRenderer(targetRenderer, thumb) {
    for (const renderer of getRenderers()) {
      if (targetRenderer === renderer) {
        renderer.display(thumb);
      } else {
        renderer.hide();
      }
    }
  }
  function hide() {
    for (const renderer of getRenderers()) {
      renderer.hide();
    }
  }
  function exitGallery2() {
    getRenderers().forEach((renderer) => renderer.hide());
    GalleryImageRenderer.exitGallery();
  }
  function preloadContentOutOfGallery(thumbs) {
    GalleryImageRenderer.preload(thumbs);
  }
  function preloadContentInGallery(thumbs) {
    getRenderers().forEach((renderer) => renderer.preload(thumbs));
  }
  function handlePageChange() {
    getRenderers().forEach((renderer) => renderer.handlePageChange());
  }
  function handlePageChangeInGallery() {
    getRenderers().forEach((renderer) => renderer.handlePageChangeInGallery());
  }
  function handleFavoritesAddedToCurrentPage(thumbs) {
    GalleryImageRenderer.handleFavoritesAddedToCurrentPage(thumbs);
  }
  function toggleVideoLooping2(value) {
    GalleryVideoRenderer.toggleVideoLooping(value);
  }
  function restartVideo() {
    GalleryVideoRenderer.restartVideo();
  }
  function toggleVideoPause2() {
    GalleryVideoRenderer.toggleVideoPause();
  }
  function toggleVideoMute2() {
    GalleryVideoRenderer.toggleVideoMute();
  }
  function toggleZoom(value) {
    return GalleryImageRenderer.toggleZoom(value);
  }
  function toggleZoomCursor(value) {
    GalleryImageRenderer.toggleZoomCursor(value);
  }
  function zoomToPoint2(x, y) {
    GalleryImageRenderer.zoomToPoint(x, y);
  }
  function correctOrientation2() {
    GalleryImageRenderer.correctOrientation();
  }
  function downscaleAll() {
    GalleryImageRenderer.downscaleAll();
  }
  function upscaleCachedImageThumbs() {
    GalleryImageRenderer.upscaleCachedImageThumbs();
  }
  var background = document.createElement("div");
  background.id = "gallery-background";
  background.style.opacity = Preferences.backgroundOpacity.value;
  var lastVisitedThumb = null;
  function usingColumnLayout() {
    return document.querySelector("#favorites-search-gallery-content.column") !== null;
  }
  function setupGalleryUI() {
    GALLERY_CONTAINER.appendChild(background);
    toggleVideoPointerEvents(false);
    toggleGalleryMenuVisibility(false);
  }
  function enterGallery2(thumb) {
    setLastVisitedThumb(thumb);
    blurCurrentlyFocusedElement();
    toggleBackgroundInteractability(true);
    toggleScrollbar(false);
    toggleVideoPointerEvents(true);
    toggleGalleryMenuVisibility(true);
  }
  function exitGallery3() {
    toggleBackgroundInteractability(false);
    toggleScrollbar(true);
    scrollToLastVisitedThumb();
    toggleVideoPointerEvents(false);
    toggleCursor(true);
    toggleGalleryMenuVisibility(false);
  }
  function scrollToLastVisitedThumb() {
    waitForAllThumbnailsToLoad().then(() => {
      if (lastVisitedThumb !== null && usingColumnLayout()) {
        scrollToThumb(lastVisitedThumb);
      }
    });
  }
  function toggleVideoPointerEvents(value) {
    insertStyleHTML(`
      video {
        pointer-events: ${value ? "auto" : "none"}
      }
      `, "video-pointer-events");
  }
  function toggleBackgroundInteractability(value) {
    background.classList.toggle("in-gallery", value);
  }
  function toggleBackgroundOpacity() {
    const opacity = parseFloat(background.style.opacity);
    if (opacity < 1) {
      updateBackgroundOpacity(1);
    } else {
      updateBackgroundOpacity(0);
    }
  }
  function show() {
    toggleScrollbar(false);
  }
  function hide2() {
    toggleScrollbar(true);
  }
  function toggleScrollbar(value) {
    document.body.style.overflowY = value ? "auto" : "hidden";
  }
  function updateUIInGallery(thumb) {
    setLastVisitedThumb(thumb);
    if (usingColumnLayout() || USING_FIREFOX) {
      return;
    }
    scrollToThumb(thumb);
  }
  function updateBackgroundOpacityFromEvent(event) {
    let opacity = parseFloat(Preferences.backgroundOpacity.value);
    opacity -= event.deltaY * 5e-4;
    opacity = clamp(opacity, 0, 1);
    updateBackgroundOpacity(roundToTwoDecimalPlaces(opacity));
  }
  function updateBackgroundOpacity(opacity) {
    const opacityString = String(opacity);
    background.style.opacity = opacityString;
    Preferences.backgroundOpacity.set(opacityString);
  }
  function showAddedFavoriteStatus(status) {
    const icon = {
      [1 /* ALREADY_ADDED */]: HEART_CHECK,
      [3 /* SUCCESSFULLY_ADDED */]: HEART_PLUS,
      [0 /* ERROR */]: ERROR,
      [2 /* NOT_LOGGED_IN */]: ERROR
    }[status] ?? ERROR;
    showFullscreenIcon(icon);
  }
  function showRemovedFavoriteStatus(status) {
    switch (status) {
      case 2 /* SUCCESSFULLY_REMOVED */:
        showFullscreenIcon(HEART_MINUS);
        break;
      case 1 /* FORBIDDEN */:
        showFullscreenIcon(WARNING, 1e3);
        setTimeout(() => {
          alert('The "Remove Buttons" option must be checked to use this hotkey');
        }, 20);
        break;
      default:
        break;
    }
  }
  function setLastVisitedThumb(thumb) {
    lastVisitedThumb = thumb;
  }
  function scrollToThumb(thumb) {
    thumb.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }
  function toggleCursor(value) {
    background.style.cursor = value ? "default" : "none";
  }
  function toggleGalleryMenuVisibility(value) {
    insertStyleHTML(`
      #gallery-menu {
        display: ${value ? "flex" : "none"} !important;
      }
      `, "gallery-menu-visibility");
  }
  function toggleZoomCursor2(value) {
    background.classList.toggle("zooming", value);
  }
  function showContentInGallery(thumb) {
    display(thumb);
    updateUIInGallery(thumb);
  }
  function display(thumb) {
    toggleVisibility2(true);
    render(thumb);
    show();
    toggleZoom(false);
  }
  function hide3() {
    toggleVisibility2(false);
    hide();
    hide2();
  }
  function enterGallery3(thumb) {
    render(thumb);
    enterGallery2(thumb);
    toggleVisibility2(true);
  }
  function exitGallery4() {
    exitGallery2();
    exitGallery3();
    toggleVisibility2(false);
    toggleZoomCursor3(false);
    upscaleCachedImageThumbs();
  }
  function toggleVisibility2(value) {
    GALLERY_CONTAINER.style.display = value ? "" : "none";
  }
  function preloadContentOutOfGallery2(thumbs) {
    preloadContentOutOfGallery(thumbs);
  }
  function preloadContentInGallery2(thumbs) {
    preloadContentInGallery(thumbs);
  }
  function handlePageChange2() {
    handlePageChange();
  }
  function handlePageChangeInGallery2() {
    handlePageChangeInGallery();
  }
  function handleMouseMoveInGallery() {
    toggleCursor2(true);
  }
  function toggleBackgroundOpacity2() {
    toggleBackgroundOpacity();
  }
  function updateBackgroundOpacity2(event) {
    updateBackgroundOpacityFromEvent(event);
  }
  function showAddedFavoriteStatus2(status) {
    showAddedFavoriteStatus(status);
  }
  function showRemovedFavoriteStatus2(status) {
    showRemovedFavoriteStatus(status);
  }
  function toggleCursor2(value) {
    toggleCursor(value);
  }
  function toggleVideoLooping3(value) {
    toggleVideoLooping2(value);
  }
  function restartVideo2() {
    restartVideo();
  }
  function toggleVideoPause3() {
    toggleVideoPause2();
  }
  function toggleVideoMute3() {
    toggleVideoMute2();
  }
  function handleFavoritesAddedToCurrentPage2(thumbs) {
    handleFavoritesAddedToCurrentPage(thumbs);
  }
  function toggleZoomCursor3(value) {
    toggleZoomCursor2(value);
    toggleZoomCursor(value);
  }
  function toggleZoom2(value = void 0) {
    return toggleZoom(value);
  }
  function zoomToPoint3(x, y) {
    zoomToPoint2(x, y);
  }
  function correctOrientation3() {
    correctOrientation2();
  }
  function downscaleAll2() {
    downscaleAll();
  }
  function upscaleCachedImageThumbs2() {
    upscaleCachedImageThumbs();
  }
  function setupGalleryView() {
    setupGalleryUI();
  }
  function executeFunctionBasedOnGalleryState(executors, args) {
    const executor = {
      [0 /* IDLE */]: executors.idle,
      [1 /* SHOWING_CONTENT_ON_HOVER */]: executors.hover,
      [2 /* IN_GALLERY */]: executors.gallery
    }[getCurrentState2()];
    if (executor) {
      executor(args);
    }
  }
  function onUpscaleToggled(value) {
    if (value) {
      const thumbs = getAllThumbs();
      const notUsingInfiniteScroll = thumbs.length <= POSTS_PER_SEARCH_PAGE;
      if (notUsingInfiniteScroll) {
        preloadContentOutOfGallery2(thumbs);
      }
      upscaleCachedImageThumbs2();
    } else {
      downscaleAll2();
    }
  }
  function onSearchPageCreated() {
    executeFunctionBasedOnGalleryState({
      idle: () => {
        if (GallerySettings.preloadOutsideGalleryOnSearchPage) {
          preloadContentOutOfGallery2(getAllThumbs());
        }
      }
    });
  }
  function handleResultsAddedToSearchPage(thumbs) {
    indexCurrentPageThumbs2();
    observe(thumbs);
  }
  var Timer = class {
    waitTime;
    onTimerEnd;
    timeout;
    constructor(waitTime) {
      this.waitTime = waitTime;
      this.onTimerEnd = DO_NOTHING;
      this.timeout = void 0;
    }
    get isRunning() {
      return this.timeout !== void 0;
    }
    get isStopped() {
      return !this.isRunning;
    }
    restart() {
      this.stop();
      this.start();
    }
    stop() {
      clearTimeout(this.timeout);
      this.timeout = void 0;
    }
    start() {
      this.timeout = setTimeout(() => {
        this.timeout = void 0;
        this.onTimerEnd();
      }, this.waitTime);
    }
  };
  var MENU_ICONS = {
    play: createObjectURLFromSvg(PLAY),
    pause: createObjectURLFromSvg(PAUSE),
    changeDirection: createObjectURLFromSvg(CHANGE_DIRECTION),
    changeDirectionAlt: createObjectURLFromSvg(CHANGE_DIRECTION_2),
    tune: createObjectURLFromSvg(TUNE)
  };
  var CONFIG = {
    imageViewDuration: Preferences.autoplayImageDuration.value,
    minimumVideoDuration: Preferences.autoplayMinimumVideoDuration.value,
    menuVisibilityDuration: ON_MOBILE_DEVICE ? 1500 : 1e3,
    get imageViewDurationInSeconds() {
      return millisecondsToSeconds(this.imageViewDuration);
    },
    get minimumVideoDurationInSeconds() {
      return millisecondsToSeconds(this.minimumVideoDuration);
    }
  };
  var ui;
  var events;
  var eventListenersAbortController;
  var currentThumb2;
  var imageViewTimer;
  var menuVisibilityTimer;
  var videoViewTimer;
  var active;
  var paused;
  var menuIsPersistent;
  var menuIsVisible;
  function setupAutoplay(inEvents) {
    initializeFields2();
    initializeEvents(inEvents);
    initializeTimers();
    insertHTML2();
    configureMobileUi();
    extractUiElements();
    setMenuIconImageSources();
    setupNumberComponents();
    addEventListeners5();
    loadAutoplaySettingsIntoUI();
  }
  function isPaused() {
    return paused;
  }
  function isActive() {
    return active;
  }
  function initializeFields2() {
    ui = {
      settingsMenu: {},
      changeDirectionMask: {}
    };
    eventListenersAbortController = new AbortController();
    currentThumb2 = null;
    active = Preferences.autoplayActive.value;
    paused = Preferences.autoplayPaused.value;
    menuIsPersistent = false;
    menuIsVisible = false;
  }
  function getDirection() {
    return Preferences.autoplayForward.value ? "ArrowRight" : "ArrowLeft";
  }
  function initializeEvents(inEvents) {
    events = inEvents;
    const onComplete = events.onComplete;
    events.onComplete = () => {
      if (active && !paused) {
        onComplete(getDirection());
      }
    };
  }
  function initializeTimers() {
    imageViewTimer = new Timer(CONFIG.imageViewDuration);
    menuVisibilityTimer = new Timer(CONFIG.menuVisibilityDuration);
    videoViewTimer = new Timer(CONFIG.minimumVideoDuration);
    imageViewTimer.onTimerEnd = () => {
    };
    menuVisibilityTimer.onTimerEnd = () => {
      hideMenu();
      setTimeout(() => {
        if (!menuIsPersistent && !menuIsVisible) {
          toggleSettingMenu(false);
        }
      }, 100);
    };
  }
  function insertHTML2() {
    insertMenuHTML();
    insertImageProgressHTML();
    insertVideoProgressHTML();
  }
  function insertMenuHTML() {
    FAVORITES_SEARCH_GALLERY_CONTAINER.insertAdjacentHTML("afterbegin", AUTOPLAY_HTML);
  }
  function insertImageProgressHTML() {
    insertStyleHTML(`
      #autoplay-image-progress-bar.animated {
          transition: width ${CONFIG.imageViewDurationInSeconds}s linear;
          width: 100%;
      }

      body.autoplay::before {
        animation: progress ${CONFIG.imageViewDurationInSeconds}s linear forwards
      }
      `, "autoplay-image-progress-bar-animation");
  }
  function insertVideoProgressHTML() {
    insertStyleHTML(`
      #autoplay-video-progress-bar.animated {
          transition: width ${CONFIG.minimumVideoDurationInSeconds}s linear;
          width: 100%;
      }
      `, "autoplay-video-progress-bar-animation");
  }
  function extractUiElements() {
    ui.container = document.getElementById("autoplay-container");
    ui.menu = document.getElementById("autoplay-menu");
    ui.settingsButton = document.getElementById("autoplay-settings-button");
    ui.settingsMenu.container = document.getElementById("autoplay-settings-menu");
    ui.settingsMenu.imageDurationInput = document.getElementById("autoplay-image-duration-input");
    ui.settingsMenu.minimumVideoDurationInput = document.getElementById("autoplay-minimum-animated-duration-input");
    ui.playButton = document.getElementById("autoplay-play-button");
    ui.changeDirectionButton = document.getElementById("autoplay-change-direction-button");
    ui.changeDirectionMask.container = document.getElementById("autoplay-change-direction-mask-container");
    ui.changeDirectionMask.image = document.getElementById("autoplay-change-direction-mask");
    ui.imageProgressBar = document.getElementById("autoplay-image-progress-bar");
    ui.videoProgressBar = document.getElementById("autoplay-video-progress-bar");
  }
  function configureMobileUi() {
    if (ON_DESKTOP_DEVICE) {
      return;
    }
    createViewDurationSelects();
  }
  function createViewDurationSelects() {
    const imageViewDurationSelect = createDurationSelect(1, 60);
    const videoViewDurationSelect = createDurationSelect(0, 60);
    const imageViewDurationInput = document.getElementById("autoplay-image-duration-input").parentElement;
    const videoViewDurationInput = document.getElementById("autoplay-minimum-animated-duration-input").parentElement;
    imageViewDurationSelect.value = String(CONFIG.imageViewDurationInSeconds);
    videoViewDurationSelect.value = String(CONFIG.minimumVideoDurationInSeconds);
    imageViewDurationInput.insertAdjacentElement("afterend", imageViewDurationSelect);
    videoViewDurationInput.insertAdjacentElement("afterend", videoViewDurationSelect);
    imageViewDurationInput.remove();
    videoViewDurationInput.remove();
    imageViewDurationSelect.id = "autoplay-image-duration-input";
    videoViewDurationSelect.id = "autoplay-minimum-animated-duration-input";
  }
  function createDurationSelect(minimum, maximum) {
    const select2 = document.createElement("select");
    for (let i = minimum; i <= maximum; i += 1) {
      const option = document.createElement("option");
      switch (true) {
        case i <= 5:
          break;
        case i <= 20:
          i += 4;
          break;
        case i <= 30:
          i += 9;
          break;
        default:
          i += 29;
          break;
      }
      option.value = String(i);
      option.innerText = String(i);
      select2.append(option);
    }
    select2.ontouchstart = () => {
      select2.dispatchEvent(new Event("mousedown"));
    };
    return select2;
  }
  function setMenuIconImageSources() {
    ui.playButton.src = paused ? MENU_ICONS.play : MENU_ICONS.pause;
    ui.settingsButton.src = MENU_ICONS.tune;
    ui.changeDirectionButton.src = MENU_ICONS.changeDirection;
    ui.changeDirectionMask.image.src = MENU_ICONS.changeDirectionAlt;
    ui.changeDirectionMask.container.classList.toggle("upper-right", Preferences.autoplayForward.value);
  }
  function loadAutoplaySettingsIntoUI() {
    ui.settingsMenu.imageDurationInput.value = String(CONFIG.imageViewDurationInSeconds);
    ui.settingsMenu.minimumVideoDurationInput.value = String(CONFIG.minimumVideoDurationInSeconds);
  }
  function setupNumberComponents() {
    for (const input2 of [ui.settingsMenu.imageDurationInput, ui.settingsMenu.minimumVideoDurationInput]) {
      const element = input2.closest(".number");
      if (element instanceof HTMLElement) {
        new NumberComponent(element);
      }
    }
  }
  function addEventListeners5() {
    addMenuEventListeners();
    addSettingsMenuEventListeners();
    addFavoritesPageEventListeners2();
  }
  function addMenuEventListeners() {
    addDesktopMenuEventListeners();
    addMobileMenuEventListeners();
  }
  function addDesktopMenuEventListeners() {
    if (ON_MOBILE_DEVICE) {
      return;
    }
    ui.settingsButton.onclick = () => {
      toggleSettingMenu();
    };
    ui.playButton.onclick = () => {
      pause();
    };
    ui.changeDirectionButton.onclick = () => {
      toggleDirection();
    };
    ui.menu.onmouseenter = () => {
      toggleMenuPersistence(true);
    };
    ui.menu.onmouseleave = () => {
      toggleMenuPersistence(false);
    };
  }
  function addMobileMenuEventListeners() {
    if (ON_DESKTOP_DEVICE) {
      return;
    }
    ui.settingsButton.ontouchstart = () => {
      toggleSettingMenu();
      const settingsMenuIsVisible = ui.settingsMenu.container.classList.contains("visible");
      toggleMenuPersistence(settingsMenuIsVisible);
      menuVisibilityTimer.restart();
    };
    ui.playButton.ontouchstart = () => {
      pause();
      menuVisibilityTimer.restart();
    };
    ui.changeDirectionButton.ontouchstart = () => {
      toggleDirection();
      menuVisibilityTimer.restart();
    };
  }
  function addSettingsMenuEventListeners() {
    ui.settingsMenu.imageDurationInput.onchange = () => {
      setImageViewDuration();
      if (currentThumb2 !== null && isImage(currentThumb2)) {
        startViewTimer(currentThumb2);
      }
    };
    ui.settingsMenu.minimumVideoDurationInput.onchange = () => {
      setMinimumVideoViewDuration();
      if (currentThumb2 !== null && !isImage(currentThumb2)) {
        startViewTimer(currentThumb2);
      }
    };
  }
  function addFavoritesPageEventListeners2() {
    Events.favorites.autoplayToggled.on((value) => {
      toggle2(value);
    });
  }
  function toggleDirection() {
    Preferences.autoplayForward.set(!Preferences.autoplayForward.value);
    ui.changeDirectionMask.container.classList.toggle("upper-right", Preferences.autoplayForward.value);
  }
  function toggleMenuPersistence(value) {
    menuIsPersistent = value;
    ui.menu.classList.toggle("persistent", value);
  }
  function toggleMenuVisibility(value) {
    menuIsVisible = value;
    ui.menu.classList.toggle("visible", value);
  }
  function toggleSettingMenu(value) {
    if (value === void 0) {
      ui.settingsMenu.container.classList.toggle("visible");
      ui.settingsButton.classList.toggle("settings-menu-opened");
    } else {
      ui.settingsMenu.container.classList.toggle("visible", value);
      ui.settingsButton.classList.toggle("settings-menu-opened", value);
    }
  }
  function toggle2(value) {
    Preferences.autoplayActive.set(value);
    active = value;
    if (value) {
      events.onEnable();
    } else {
      events.onDisable();
    }
  }
  function setImageViewDuration() {
    let durationInSeconds = parseFloat(ui.settingsMenu.imageDurationInput.value);
    if (isNaN(durationInSeconds)) {
      durationInSeconds = CONFIG.imageViewDurationInSeconds;
    }
    const duration = Math.round(clamp(durationInSeconds * 1e3, 1e3, 6e4));
    Preferences.autoplayImageDuration.set(duration);
    CONFIG.imageViewDuration = duration;
    imageViewTimer.waitTime = duration;
    ui.settingsMenu.imageDurationInput.value = String(CONFIG.imageViewDurationInSeconds);
    insertImageProgressHTML();
  }
  function setMinimumVideoViewDuration() {
    let durationInSeconds = parseFloat(ui.settingsMenu.minimumVideoDurationInput.value);
    if (isNaN(durationInSeconds)) {
      durationInSeconds = CONFIG.minimumVideoDurationInSeconds;
    }
    const duration = Math.round(clamp(durationInSeconds * 1e3, 0, 6e4));
    Preferences.autoplayMinimumVideoDuration.set(duration);
    CONFIG.minimumVideoDuration = duration;
    videoViewTimer.waitTime = duration;
    ui.settingsMenu.minimumVideoDurationInput.value = String(CONFIG.minimumVideoDurationInSeconds);
    insertVideoProgressHTML();
  }
  function startViewTimer(thumb) {
    if (thumb === null) {
      return;
    }
    currentThumb2 = thumb;
    if (!active || paused) {
      return;
    }
    if (isVideo(thumb)) {
      startVideoViewTimer();
    } else {
      startImageViewTimer();
    }
  }
  function startImageViewTimer() {
    stopVideoProgressBar();
    stopVideoViewTimer();
    startImageProgressBar();
    imageViewTimer.restart();
  }
  function stopImageViewTimer() {
    imageViewTimer.stop();
    stopImageProgressBar();
  }
  function startVideoViewTimer() {
    stopImageViewTimer();
    stopImageProgressBar();
    startVideoProgressBar();
    videoViewTimer.restart();
  }
  function stopVideoViewTimer() {
    videoViewTimer.stop();
    stopVideoProgressBar();
  }
  function startAutoplay(thumb) {
    if (!active) {
      return;
    }
    addAutoplayEventListeners();
    ui.container.style.visibility = "visible";
    showMenu();
    startViewTimer(thumb);
  }
  function stopAutoplay() {
    ui.container.style.visibility = "hidden";
    removeAutoplayEventListeners();
    stopImageViewTimer();
    stopVideoViewTimer();
    forceHideMenu();
  }
  function pause() {
    paused = !paused;
    Preferences.autoplayPaused.set(paused);
    if (paused) {
      ui.playButton.src = MENU_ICONS.play;
      ui.playButton.title = "Resume Autoplay";
      stopImageViewTimer();
      stopVideoViewTimer();
      events.onPause();
    } else {
      ui.playButton.src = MENU_ICONS.pause;
      ui.playButton.title = "Pause Autoplay";
      startViewTimer(currentThumb2);
      events.onResume();
    }
  }
  function onVideoEnded() {
    if (!active || paused) {
      return;
    }
    if (videoViewTimer.isRunning) {
      events.onVideoEndedBeforeMinimumViewTime();
    } else {
      events.onComplete();
    }
  }
  function addAutoplayEventListeners() {
    imageViewTimer.onTimerEnd = () => {
      events.onComplete();
    };
    Events.document.mousemove.on(throttle(() => {
      showMenu();
    }, 250), {
      signal: eventListenersAbortController.signal
    });
    Events.document.keydown.on((event) => {
      if (!event.isHotkey) {
        return;
      }
      switch (event.key) {
        case "p":
          showMenu();
          pause();
          break;
        case " ":
          if (currentThumb2 !== null && !isVideo(currentThumb2)) {
            showMenu();
            pause();
          }
          break;
        default:
          break;
      }
    }, {
      signal: eventListenersAbortController.signal
    });
  }
  function removeAutoplayEventListeners() {
    imageViewTimer.onTimerEnd = () => {
    };
    eventListenersAbortController.abort();
    eventListenersAbortController = new AbortController();
  }
  function showMenu() {
    toggleMenuVisibility(true);
    menuVisibilityTimer.restart();
  }
  function hideMenu() {
    toggleMenuVisibility(false);
  }
  function forceHideMenu() {
    toggleMenuPersistence(false);
    toggleMenuVisibility(false);
    toggleSettingMenu(false);
  }
  function startImageProgressBar() {
    stopImageProgressBar();
    setTimeout(() => {
      ui.imageProgressBar.classList.add("animated");
    }, 20);
  }
  function stopImageProgressBar() {
    ui.imageProgressBar.classList.remove("animated");
    document.body.classList.remove("autoplay");
  }
  function startVideoProgressBar() {
    stopVideoProgressBar();
    setTimeout(() => {
      ui.videoProgressBar.classList.add("animated");
    }, 20);
  }
  function stopVideoProgressBar() {
    ui.videoProgressBar.classList.remove("animated");
  }
  function handlePageChange3() {
    reIndexThumbs();
    executeFunctionBasedOnGalleryState({
      idle: handlePageChange2,
      hover: handlePageChange2,
      gallery: handlePageChangeInGallery2
    });
  }
  function reIndexThumbs() {
    resetCenterThumb();
    observeAllThumbsOnPage();
    indexCurrentPageThumbs2();
  }
  function handleFavoritesAddedToCurrentPage3(results) {
    observe(results);
    indexCurrentPageThumbs2();
    handleFavoritesAddedToCurrentPage2(results);
  }
  function handleNewFavoritesFoundOnReload() {
    observeAllThumbsOnPage();
    indexCurrentPageThumbs2();
  }
  async function addFavoriteInGallery3() {
    showAddedFavoriteStatus2(await addFavoriteInGallery2());
  }
  async function removeFavoriteInGallery3() {
    showRemovedFavoriteStatus2(await removeFavoriteInGallery2());
  }
  function preloadContentInGalleryAround(thumb) {
    if (thumb !== null && GallerySettings.preloadingEnabled) {
      preloadContentInGallery2(getThumbsAround(thumb));
    }
  }
  function preloadVisibleContentAround(thumb) {
    if (ON_FAVORITES_PAGE && !hasRecentlyExitedGallery() && thumb !== null) {
      setCenterThumb(thumb);
      preloadVisibleContent();
    }
  }
  function canPreloadOutsideGallery(thumbs) {
    return GallerySettings.preloadingEnabled && thumbs.length < GallerySettings.maxVisibleThumbsBeforeStoppingPreload && thumbs.length > 0;
  }
  function preloadVisibleContent() {
    if (Preferences.performanceProfile.value === 3 /* MEDIUM */) {
      return;
    }
    if (inGallery()) {
      return;
    }
    const thumbs = getVisibleThumbs();
    if (canPreloadOutsideGallery(thumbs)) {
      preloadContentOutOfGallery2(thumbs);
    }
  }
  function usingInfiniteScrollOnSearchPage() {
    return Preferences.searchPageInfiniteScrollEnabled.value;
  }
  function usingInfiniteScrollOnFavoritesPage() {
    return Preferences.infiniteScrollEnabled.value;
  }
  var usingInfiniteScroll = ON_FAVORITES_PAGE ? usingInfiniteScrollOnFavoritesPage : usingInfiniteScrollOnSearchPage;
  function navigate2(direction) {
    switch (navigate(direction)) {
      case 1 /* AT_LEFT_BOUNDARY */:
        navigateAtLeftBoundary();
        break;
      case 2 /* AT_RIGHT_BOUNDARY */:
        navigateAtRightBoundary();
        break;
      default:
        finishNavigation();
        break;
    }
  }
  async function navigateAtLeftBoundary() {
    if (!usingInfiniteScroll() && await loadMoreResults("ArrowLeft")) {
      navigateToPreviousPage();
      finishNavigation();
    }
  }
  async function navigateAtRightBoundary() {
    if (await loadMoreResults("ArrowRight")) {
      if (usingInfiniteScroll()) {
        navigateRight();
      } else {
        navigateToNextPage();
      }
      finishNavigation();
    }
  }
  async function loadMoreResults(direction) {
    if (ON_FAVORITES_PAGE) {
      return CrossFeatureRequests.loadNewFavoritesInGallery.request(direction);
    }
    return await CrossFeatureRequests.loadNewSearchPagesInGallery.request(direction) !== null;
  }
  function finishNavigation() {
    const thumb = getCurrentThumb();
    showContentInGallery(thumb);
    startViewTimer(thumb);
    preloadContentInGalleryAround(thumb);
  }
  function toggleGalleryImageZoom(value = void 0) {
    const zoomedIn = toggleZoom2(value);
    Events.document.wheel.toggle(!zoomedIn);
    return zoomedIn;
  }
  var InteractionTracker = class {
    onInteractionStopped;
    onMouseMoveStopped;
    onScrollingStopped;
    onNoInteractionOnStart;
    idleDuration;
    mouseTimeout;
    scrollTimeout;
    interactionOnStartTimeout;
    mouseIsMoving;
    scrolling;
    abortController;
    constructor(idleDuration, onInteractionStopped, onMouseMoveStopped, onScrollingStopped, onNoInteractionOnStart) {
      this.idleDuration = idleDuration;
      this.onInteractionStopped = onInteractionStopped;
      this.onMouseMoveStopped = onMouseMoveStopped;
      this.onScrollingStopped = onScrollingStopped;
      this.onNoInteractionOnStart = onNoInteractionOnStart;
      this.mouseIsMoving = false;
      this.scrolling = false;
      this.abortController = new AbortController();
    }
    start() {
      this.toggle(true);
    }
    stop() {
      this.toggle(false);
    }
    toggle(value) {
      if (value) {
        this.abortController = new AbortController();
        this.startInteractionOnStartTimer();
        this.trackMouseMove();
        this.trackScroll();
        return;
      }
      this.abortController.abort();
    }
    startInteractionOnStartTimer() {
      this.interactionOnStartTimeout = setTimeout(() => {
        this.onNoInteractionOnStart();
      }, this.idleDuration);
    }
    trackMouseMove() {
      Events.document.mousemove.on(this.onMouseMove.bind(this), {
        passive: true,
        signal: this.abortController.signal
      });
    }
    trackScroll() {
      window.addEventListener("scroll", this.onScroll.bind(this), {
        passive: true,
        signal: this.abortController.signal
      });
    }
    onMouseMove() {
      this.mouseIsMoving = true;
      clearTimeout(this.interactionOnStartTimeout);
      clearTimeout(this.mouseTimeout);
      this.mouseTimeout = setTimeout(() => {
        this.mouseIsMoving = false;
        this.onMouseMoveStopped();
        if (!this.scrolling) {
          this.onInteractionStopped();
        }
      }, this.idleDuration);
    }
    onScroll() {
      this.scrolling = true;
      clearTimeout(this.interactionOnStartTimeout);
      clearTimeout(this.scrollTimeout);
      this.scrollTimeout = setTimeout(() => {
        this.scrolling = false;
        this.onScrollingStopped();
        if (!this.mouseIsMoving) {
          this.onInteractionStopped();
        }
      }, this.idleDuration);
    }
  };
  var GalleryInteractionTracker = null;
  function createGalleryInteractionTracker() {
    if (ON_MOBILE_DEVICE) {
      return null;
    }
    const hideCursor = () => {
      executeFunctionBasedOnGalleryState({
        gallery: () => {
          toggleCursor2(false);
        }
      });
    };
    return new InteractionTracker(
      GallerySettings.idleInteractionDuration,
      DO_NOTHING,
      hideCursor,
      DO_NOTHING,
      hideCursor
    );
  }
  function setupGalleryInteractionTracker() {
    if (ON_DESKTOP_DEVICE) {
      GalleryInteractionTracker = createGalleryInteractionTracker();
    }
  }
  function enterGallery4(thumb) {
    enterGallery(thumb);
    enterGallery3(thumb);
    GalleryInteractionTracker?.start();
    startAutoplay(thumb);
    preloadContentInGalleryAround(thumb);
    Events.gallery.showOnHoverToggled.emit(false);
    Events.gallery.enteredGallery.emit();
  }
  function exitGallery5() {
    exitGallery();
    exitGallery4();
    GalleryInteractionTracker?.stop();
    stopAutoplay();
    toggleGalleryImageZoom(false);
    Events.gallery.exitedGallery.emit();
  }
  function toggleShowContentOnHover2() {
    toggleShowContentOnHover();
    Events.gallery.showOnHoverToggled.emit(showOnHoverEnabled());
  }
  function onKeyDownInGallery(keyboardEvent) {
    const event = keyboardEvent.originalEvent;
    if (isNavigationKey(event.key)) {
      event.stopImmediatePropagation();
      navigate2(event.key);
      return;
    }
    if (isExitKey(event.key)) {
      exitGallery5();
      return;
    }
    if (event.shiftKey) {
      toggleZoomCursor3(true);
      return;
    }
    const currentThumb3 = getCurrentThumb();
    switch (event.key.toLowerCase()) {
      case "b":
        toggleBackgroundOpacity2();
        break;
      case "e":
        addFavoriteInGallery3();
        break;
      case "x":
        removeFavoriteInGallery3();
        break;
      case "f":
        toggleFullscreen();
        break;
      case "g":
        openPostInNewTab();
        break;
      case "q":
        openOriginalInNewTab();
        break;
      case "s":
        downloadInGallery();
        break;
      case "m":
        toggleVideoMute3();
        break;
      case " ":
        if (currentThumb3 !== void 0 && isVideo(currentThumb3)) {
          toggleVideoPause3();
        }
        break;
      default:
        break;
    }
  }
  function onKeyDownOutsideGallery(event) {
    if (!event.isHotkey) {
      return;
    }
    switch (event.key.toLowerCase()) {
      case "f":
        toggleFullscreen();
        break;
      default:
        break;
    }
  }
  var onKeyDownNoThrottle = (event) => {
    executeFunctionBasedOnGalleryState({
      idle: onKeyDownOutsideGallery,
      hover: onKeyDownOutsideGallery,
      gallery: onKeyDownInGallery
    }, new FavoritesKeyboardEvent(event));
  };
  var onKeyDownThrottled = throttle(onKeyDownNoThrottle, GallerySettings.galleryNavigationDelay);
  function onKeyUpInGallery(event) {
    if (event.key === "shift") {
      toggleZoomCursor3(false);
    }
  }
  function onKeyDown(keyboardEvent) {
    const event = keyboardEvent.originalEvent;
    if (event.repeat) {
      onKeyDownThrottled(event);
    } else {
      onKeyDownNoThrottle(event);
    }
  }
  function onKeyUp(event) {
    executeFunctionBasedOnGalleryState({
      gallery: onKeyUpInGallery
    }, event);
  }
  function onGalleryMenuAction(action) {
    switch (action) {
      case "exit":
        exitGallery5();
        break;
      case "openPost":
        openPostInNewTab();
        break;
      case "openOriginal":
        openOriginalInNewTab();
        break;
      case "download":
        downloadInGallery();
        break;
      case "addFavorite":
        addFavoriteInGallery3();
        break;
      case "removeFavorite":
        removeFavoriteInGallery3();
        break;
      case "toggleBackground":
        toggleBackgroundOpacity2();
        break;
      case "none":
        break;
      default:
        break;
    }
  }
  function onMouseOverWhileHoverEnabled(thumb) {
    if (thumb === null) {
      hide3();
      return;
    }
    display(thumb);
    preloadVisibleContentAround(thumb);
  }
  function onMouseOverWhileIdle(thumb) {
    if (thumb === null || !ON_FAVORITES_PAGE) {
      return;
    }
    preloadVisibleContentAround(thumb);
  }
  function onMouseDownInGallery(mouseEvent) {
    if (mouseEvent.ctrlKey || overGalleryMenu(mouseEvent.originalEvent)) {
      return;
    }
    if (mouseEvent.shiftKey) {
      if (toggleGalleryImageZoom()) {
        zoomToPoint3(mouseEvent.originalEvent.x, mouseEvent.originalEvent.y);
      }
      return;
    }
    const zoomedIn = mouseEvent.originalEvent.target instanceof HTMLElement && mouseEvent.originalEvent.target.closest(".zoomed-in") !== null;
    if (mouseEvent.leftClick && !zoomedIn && !isViewingVideo()) {
      exitGallery5();
      return;
    }
    if (mouseEvent.rightClick) {
      return;
    }
    if (mouseEvent.middleClick) {
      openPostInNewTab();
    }
  }
  function onMouseDownOutsideGallery(mouseEvent) {
    if (mouseEvent.leftClick && mouseEvent.thumb !== null && !mouseEvent.ctrlKey) {
      mouseEvent.originalEvent.preventDefault();
      enterGallery4(mouseEvent.thumb);
      return;
    }
    if (mouseEvent.middleClick && mouseEvent.thumb === null) {
      mouseEvent.originalEvent.preventDefault();
      toggleShowContentOnHover2();
    }
  }
  function onClickInGallery(mouseEvent) {
    if (mouseEvent.ctrlKey) {
      openOriginalInNewTab();
    }
  }
  function onContextMenuInGallery(mouseEvent) {
    mouseEvent.preventDefault();
    exitGallery5();
  }
  function onWheelWhileHoverEnabled(wheelEvent) {
    updateBackgroundOpacity2(wheelEvent.originalEvent);
  }
  function onWheelInGallery(wheelEvent) {
    if (!wheelEvent.originalEvent.shiftKey && !wheelEvent.originalEvent.ctrlKey) {
      navigate2(wheelEvent.direction);
    }
  }
  var onMouseMove = throttle(() => {
    executeFunctionBasedOnGalleryState({
      gallery: handleMouseMoveInGallery
    });
  }, 250);
  function onMouseOver(mouseEvent) {
    executeFunctionBasedOnGalleryState({
      hover: onMouseOverWhileHoverEnabled,
      idle: onMouseOverWhileIdle
    }, mouseEvent.thumb);
  }
  function onClick(mouseEvent) {
    executeFunctionBasedOnGalleryState({
      gallery: onClickInGallery
    }, mouseEvent);
  }
  function onMouseDown(event) {
    executeFunctionBasedOnGalleryState({
      hover: onMouseDownOutsideGallery,
      idle: onMouseDownOutsideGallery,
      gallery: onMouseDownInGallery
    }, new FavoritesMouseEvent(event));
  }
  function onContextMenu(mouseEvent) {
    executeFunctionBasedOnGalleryState({
      gallery: onContextMenuInGallery
    }, mouseEvent);
  }
  function onWheel(wheelEvent) {
    executeFunctionBasedOnGalleryState({
      hover: onWheelWhileHoverEnabled,
      gallery: onWheelInGallery
    }, wheelEvent);
  }
  function onSwipeDown() {
    executeFunctionBasedOnGalleryState({
      gallery: exitGallery5
    });
  }
  function galleryEnabled() {
    return ON_FAVORITES_PAGE && Preferences.mobileGalleryEnabled.value || ON_SEARCH_PAGE && Preferences.searchPagesEnabled.value;
  }
  function onMouseDownOutsideGallery2(mouseEvent) {
    if (mouseEvent.thumb !== null && galleryEnabled()) {
      mouseEvent.originalEvent.preventDefault();
      mouseEvent.originalEvent.stopPropagation();
      mouseEvent.originalEvent.stopImmediatePropagation();
      enterGallery4(mouseEvent.thumb);
    }
  }
  function onTouchStartInGallery(event) {
    if (event.target instanceof HTMLElement && event.target.closest("#gallery-menu") !== null) {
      return;
    }
    event.preventDefault();
  }
  function onMouseDown2(event) {
    executeFunctionBasedOnGalleryState({
      hover: onMouseDownOutsideGallery2,
      idle: onMouseDownOutsideGallery2
    }, new FavoritesMouseEvent(event));
  }
  function onTouchStart(event) {
    executeFunctionBasedOnGalleryState({
      gallery: onTouchStartInGallery
    }, event);
  }
  function onLeftTap() {
    if (didSwipe()) {
      return;
    }
    executeFunctionBasedOnGalleryState({
      gallery: () => {
        navigate2("ArrowLeft");
      }
    });
  }
  function onRightTap() {
    if (didSwipe()) {
      return;
    }
    executeFunctionBasedOnGalleryState({
      gallery: () => {
        navigate2("ArrowRight");
      }
    });
  }
  function addGalleryEventListeners() {
    addFavoritesEventListeners();
    addGalleryEventListeners2();
    addPlatformDependentEventListeners();
    addSearchPageEventListeners();
    addCrossFeatureRequestHandlers();
  }
  function addFavoritesEventListeners() {
    Events.favorites.newFavoritesFoundOnReload.on(handleNewFavoritesFoundOnReload, { once: true });
    Events.favorites.pageChanged.on(handlePageChange3);
    Events.favorites.favoritesAddedToCurrentPage.on(handleFavoritesAddedToCurrentPage3);
    Events.favorites.showOnHoverToggled.on(toggleShowContentOnHover);
  }
  function addGalleryEventListeners2() {
    Events.gallery.visibleThumbsChanged.on(preloadVisibleContent);
    Events.gallery.videoEnded.on(onVideoEnded);
    Events.gallery.videoDoubleClicked.on(exitGallery5);
    Events.gallery.galleryMenuButtonClicked.on(onGalleryMenuAction);
  }
  function addSearchPageEventListeners() {
    Events.searchPage.upscaleToggled.on(onUpscaleToggled);
    Events.searchPage.searchPageCreated.on(onSearchPageCreated);
    Events.searchPage.moreResultsAdded.on(handleResultsAddedToSearchPage);
    Events.searchPage.infiniteScrollToggled.on(reIndexThumbs);
    Events.searchPage.pageChanged.on(handlePageChange3);
  }
  function addCrossFeatureRequestHandlers() {
    CrossFeatureRequests.inGallery.setHandler(inGallery);
  }
  function addPlatformDependentEventListeners() {
    if (ON_DESKTOP_DEVICE) {
      addDesktopEventListeners();
    } else {
      addMobileEventListeners();
    }
  }
  function addDesktopEventListeners() {
    Events.document.mouseover.on(onMouseOver);
    Events.document.click.on(onClick);
    Events.document.mousedown.on(onMouseDown);
    Events.document.contextmenu.on(onContextMenu);
    Events.document.mousemove.on(onMouseMove);
    Events.document.wheel.on(onWheel);
    Events.document.keydown.on(onKeyDown);
    Events.document.keyup.on(onKeyUp);
  }
  function addMobileEventListeners() {
    Events.gallery.leftTap.on(onLeftTap);
    Events.gallery.rightTap.on(onRightTap);
    Events.document.mousedown.on(onMouseDown2);
    Events.document.touchStart.on(onTouchStart);
    Events.mobile.swipedDown.on(onSwipeDown);
    Events.mobile.swipedUp.on(showMenu);
    Events.window.orientationChange.on(correctOrientation3);
  }
  function setupAutoplay2() {
    const events2 = {
      onEnable: () => {
        toggleVideoLooping3(false);
      },
      onDisable: () => {
        toggleVideoLooping3(true);
      },
      onPause: () => {
        toggleVideoLooping3(true);
      },
      onResume: () => {
        toggleVideoLooping3(false);
      },
      onComplete: (direction) => {
        executeFunctionBasedOnGalleryState({
          gallery: navigate2
        }, direction);
      },
      onVideoEndedBeforeMinimumViewTime: () => {
        restartVideo2();
      }
    };
    setupAutoplay(events2);
    toggleVideoLooping3(isPaused() || !isActive());
  }
  var BUTTONS3 = [
    { id: "exit-gallery", icon: EXIT, action: "exit", enabled: true, hint: "Exit (Escape, Right-Click)", color: "red" },
    { id: "fullscreen-gallery", icon: FULLSCREEN_ENTER, action: "fullscreen", enabled: true, hint: "Toggle Fullscreen (F)", color: "#0075FF" },
    { id: "open-in-new-gallery", icon: OPEN_IN_NEW, action: "openPost", enabled: true, hint: "Open Post (Middle-Click, G)", color: "lightgreen" },
    { id: "open-image-gallery", icon: IMAGE, action: "openOriginal", enabled: true, hint: "Open Original (Ctrl + Left-Click, Q)", color: "magenta" },
    { id: "download-gallery", icon: DOWNLOAD, action: "download", enabled: true, hint: "Download (S)", color: "lightskyblue" },
    { id: "add-favorite-gallery", icon: HEART_PLUS, action: "addFavorite", enabled: true, hint: "Add Favorite (E)", color: "hotpink" },
    { id: "remove-favorite-gallery", icon: HEART_MINUS, action: "removeFavorite", enabled: false, hint: "Remove Favorite (X)", color: "red" },
    { id: "dock-gallery", icon: DOCK, action: "toggleDockPosition", enabled: false, hint: "Change Position", color: "" },
    { id: "toggle-background-gallery", icon: BULB, action: "toggleBackground", enabled: true, hint: "Toggle Background (B)", color: "gold" },
    { id: "search-gallery", icon: SEARCH, action: "search", enabled: false, hint: "Search", color: "cyan" },
    { id: "background-color-gallery", icon: PALETTE, action: "changeBackgroundColor", enabled: true, hint: "Background Color", color: "orange" },
    { id: "pin-gallery", icon: PIN, action: "pin", enabled: true, hint: "Pin Menu", color: "#0075FF" }
  ];
  var MENU = document.createElement("div");
  var throttledReveal = throttle(() => {
    reveal();
  }, 250);
  var menuVisibilityTimeout;
  MENU.id = "gallery-menu";
  MENU.className = "gallery-sub-menu";
  function loadPreferences() {
    if (Preferences.dockGalleryMenuLeft.value) {
      toggleDockPosition();
    }
    if (Preferences.galleryMenuPinned.value) {
      togglePin();
    }
    toggleGalleryMenuEnabled(Preferences.galleryMenuEnabled.value);
  }
  function addEventListeners6() {
    Events.document.mousemove.on(throttledReveal);
    Events.document.mouseover.on((mouseOverEvent) => {
      togglePersistence(mouseOverEvent.originalEvent);
    });
  }
  function handleGalleryMenuAction(action) {
    switch (action) {
      case "fullscreen":
        toggleFullscreen();
        break;
      case "pin":
        togglePin();
        break;
      case "toggleDockPosition":
        toggleDockPosition();
        break;
      default:
        break;
    }
  }
  function createButtons3() {
    const buttonContainer = document.createElement("div");
    buttonContainer.id = "gallery-menu-button-container";
    for (const template2 of BUTTONS3) {
      if (template2.enabled) {
        buttonContainer.appendChild(createButton(template2));
      }
    }
    MENU.appendChild(buttonContainer);
  }
  function createButton(template2) {
    const button = document.createElement("span");
    button.innerHTML = template2.icon;
    button.id = template2.id;
    button.className = "gallery-menu-button";
    button.dataset.hint = template2.hint;
    button.onclick = () => {
      handleGalleryMenuAction(template2.action);
      Events.gallery.galleryMenuButtonClicked.emit(template2.action);
    };
    if (GallerySettings.galleryMenuMonoColor) {
      template2.color = "#0075FF";
    }
    if (template2.color !== "") {
      insertStyleHTML(`
        #${template2.id}:hover {
          &::after {
            outline: 2px solid ${template2.color};
          }

          color: ${template2.color};

          >svg {
            fill: ${template2.color};
          }
        }
      `, template2.id);
    }
    return button;
  }
  function createColorPicker() {
    const button = document.getElementById("background-color-gallery");
    if (!(button instanceof HTMLElement)) {
      return;
    }
    const colorPicker = document.createElement("input");
    colorPicker.type = "color";
    colorPicker.id = "gallery-menu-background-color-picker";
    button.onclick = () => {
      colorPicker.click();
    };
    colorPicker.oninput = () => {
      setColorScheme(colorPicker.value);
    };
    if (Preferences.colorScheme.defaultValue !== Preferences.colorScheme.value) {
      setColorScheme(Preferences.colorScheme.value);
    }
    button.insertAdjacentElement("afterbegin", colorPicker);
  }
  function reveal() {
    MENU.classList.add("active");
    clearTimeout(menuVisibilityTimeout);
    menuVisibilityTimeout = setTimeout(() => {
      hide4();
    }, GallerySettings.menuVisibilityTime);
  }
  function hide4() {
    MENU.classList.remove("active");
  }
  function togglePersistence(event) {
    MENU.classList.toggle("persistent", event.target instanceof HTMLElement && MENU.contains(event.target));
  }
  function togglePin() {
    if (ON_MOBILE_DEVICE) {
      MENU.classList.add("pinned");
      Preferences.galleryMenuPinned.set(true);
      return;
    }
    Preferences.galleryMenuPinned.set(MENU.classList.toggle("pinned"));
  }
  function toggleDockPosition() {
    if (ON_MOBILE_DEVICE) {
      MENU.classList.remove("dock-left");
      Preferences.dockGalleryMenuLeft.set(false);
      return;
    }
    Preferences.dockGalleryMenuLeft.set(MENU.classList.toggle("dock-left"));
  }
  function setupDesktopGalleryMenu() {
    if (!GeneralSettings.galleryMenuOptionEnabled) {
      return;
    }
    GALLERY_CONTAINER.appendChild(MENU);
    loadPreferences();
    createButtons3();
    createColorPicker();
    addEventListeners6();
  }
  function setupGalleryMobileTapControls() {
    if (ON_DESKTOP_DEVICE) {
      return;
    }
    const tapControlContainer = document.createElement("div");
    const leftTap = document.createElement("div");
    const rightTap = document.createElement("div");
    tapControlContainer.id = "tap-control-container";
    leftTap.className = "mobile-tap-control";
    rightTap.className = "mobile-tap-control";
    leftTap.id = "left-mobile-tap-control";
    rightTap.id = "right-mobile-tap-control";
    tapControlContainer.appendChild(leftTap);
    tapControlContainer.appendChild(rightTap);
    GALLERY_CONTAINER.appendChild(tapControlContainer);
    leftTap.ontouchend = async () => {
      await yield1();
      Events.gallery.leftTap.emit();
    };
    rightTap.ontouchend = async () => {
      await yield1();
      Events.gallery.rightTap.emit();
    };
  }
  function setupGallery() {
    if (GALLERY_DISABLED) {
      return;
    }
    if (ON_SEARCH_PAGE) {
      Events.searchPage.searchPageReady.on(setupGalleryHelper, { once: true });
      return;
    }
    setupGalleryHelper();
  }
  function setupGalleryHelper() {
    indexCurrentPageThumbs2();
    insertGalleryContainer();
    setupVisibleThumbObserver();
    setupGalleryMobileTapControls();
    setupGalleryInteractionTracker();
    setupGalleryView();
    setupGalleryMenu();
    addGalleryEventListeners();
    setupAutoplay2();
    if (ON_SEARCH_PAGE) {
      onSearchPageCreated();
    }
  }
  function setupGalleryMenu() {
    if (ON_MOBILE_DEVICE) {
    } else {
      setupDesktopGalleryMenu();
    }
  }
  function setupGlobals() {
    pingServer();
    setupEvents();
    setupExtensions();
    setupCommonStyles();
    loadTagModifications();
    insertFavoritesSearchGalleryContainer();
    insertFavoritesSearchGalleryContentContainer();
  }
  var textarea;
  var savedSearchesList;
  var stopEditingButton;
  var saveButton;
  var importButton;
  var exportButton;
  var saveSearchResultsButton;
  function setupSavedSearches() {
    if (SAVED_SEARCHES_DISABLED) {
      return;
    }
    insertHTML3();
    extractHTMLElements();
    addEventListeners7();
    loadSavedSearches();
    toggleSavedSearchesVisibility(Preferences.savedSearchesVisible.value);
  }
  function insertHTML3() {
    insertHTMLAndExtractStyle(document.getElementById("right-favorites-panel") || document.createElement("div"), "beforeend", SAVED_SEARCHES_HTML);
  }
  function extractHTMLElements() {
    saveButton = document.getElementById("save-custom-search-button");
    textarea = document.getElementById("saved-searches-input");
    savedSearchesList = document.getElementById("saved-search-list");
    stopEditingButton = document.getElementById("stop-editing-saved-search-button");
    importButton = document.getElementById("import-saved-search-button");
    exportButton = document.getElementById("export-saved-search-button");
    saveSearchResultsButton = document.getElementById("save-results-button");
  }
  function addEventListeners7() {
    saveButton.onclick = () => {
      saveSearch(textarea.value.trim());
      storeSavedSearches();
    };
    textarea.addEventListener("keydown", (event) => {
      switch (event.key) {
        case "Enter":
          if (awesompleteIsUnselected(textarea)) {
            event.preventDefault();
            saveButton.click();
            textarea.blur();
            setTimeout(() => {
              textarea.focus();
            }, 100);
          }
          break;
        case "Escape":
          if (awesompleteIsUnselected(textarea) && stopEditingButton.style.display === "block") {
            stopEditingButton.click();
          }
          break;
        default:
          break;
      }
    }, {
      passive: true
    });
    exportButton.onclick = () => {
      exportSavedSearches();
    };
    importButton.onclick = () => {
      importSavedSearches();
    };
    saveSearchResultsButton.onclick = () => {
      saveSearchResultsAsCustomSearch();
    };
    Events.favorites.savedSearchesToggled.on(toggleSavedSearchesVisibility);
  }
  function toggleSavedSearchesVisibility(value) {
    insertStyleHTML(`
      #right-favorites-panel {
        display: ${value ? "block" : "none"};
      }
    `, "saved-searches-visibility");
    Preferences.savedSearchesVisible.set(value);
  }
  function saveSearch(newSavedSearch) {
    if (newSavedSearch === "" || newSavedSearch === void 0) {
      return;
    }
    const newListItem = document.createElement("li");
    const savedSearchLabel = document.createElement("div");
    const editButton = document.createElement("div");
    const removeButton = document.createElement("div");
    const moveToTopButton = document.createElement("div");
    savedSearchLabel.innerText = newSavedSearch;
    editButton.innerHTML = EDIT;
    removeButton.innerHTML = DELETE;
    moveToTopButton.innerHTML = UP_ARROW;
    editButton.title = "Edit";
    removeButton.title = "Delete";
    moveToTopButton.title = "Move to top";
    savedSearchLabel.className = "save-search-label";
    editButton.className = "edit-saved-search-button";
    removeButton.className = "remove-saved-search-button";
    moveToTopButton.className = "move-saved-search-to-top-button";
    newListItem.appendChild(removeButton);
    newListItem.appendChild(editButton);
    newListItem.appendChild(moveToTopButton);
    newListItem.appendChild(savedSearchLabel);
    savedSearchesList.insertBefore(newListItem, savedSearchesList.firstChild);
    savedSearchLabel.onclick = () => {
      navigator.clipboard.writeText(savedSearchLabel.innerText);
      Events.searchBox.appendSearchBox.emit(savedSearchLabel.innerText);
    };
    removeButton.onclick = () => {
      if (inEditMode()) {
        alert("Cancel current edit before removing another search");
        return;
      }
      if (confirm(`Remove saved search: ${savedSearchLabel.innerText} ?`)) {
        savedSearchesList.removeChild(newListItem);
        storeSavedSearches();
      }
    };
    editButton.onclick = () => {
      if (inEditMode()) {
        alert("Cancel current edit before editing another search");
      } else {
        editSavedSearches(savedSearchLabel);
      }
    };
    moveToTopButton.onclick = () => {
      if (inEditMode() || newListItem.parentElement === null) {
        alert("Cancel current edit before moving this search to the top");
        return;
      }
      newListItem.parentElement.insertAdjacentElement("afterbegin", newListItem);
      storeSavedSearches();
    };
    stopEditingButton.onclick = () => {
      stopEditingSavedSearches(newListItem);
    };
    textarea.value = "";
  }
  function editSavedSearches(savedSearchLabel) {
    textarea.value = savedSearchLabel.innerText;
    saveButton.textContent = "Save Changes";
    textarea.focus();
    exportButton.style.display = "none";
    importButton.style.display = "none";
    stopEditingButton.style.display = "";
    saveButton.onclick = () => {
      savedSearchLabel.innerText = textarea.value.trim();
      storeSavedSearches();
      stopEditingButton.click();
    };
  }
  function stopEditingSavedSearches(newListItem) {
    saveButton.textContent = "Save";
    saveButton.onclick = () => {
      saveSearch(textarea.value.trim());
      storeSavedSearches();
    };
    textarea.value = "";
    exportButton.style.display = "";
    importButton.style.display = "";
    stopEditingButton.style.display = "none";
    newListItem.style.border = "";
  }
  function storeSavedSearches() {
    localStorage.setItem("savedSearches", JSON.stringify(getSavedSearches()));
  }
  function loadSavedSearches() {
    const savedSearches = JSON.parse(localStorage.getItem("savedSearches") ?? "[]");
    const firstUse = Boolean(Preferences.savedSearchTutorialEnabled.value);
    Preferences.savedSearchTutorialEnabled.set(false);
    if (firstUse && savedSearches.length === 0) {
      createTutorialSearches();
      return;
    }
    for (let i = savedSearches.length - 1; i >= 0; i -= 1) {
      saveSearch(savedSearches[i]);
    }
  }
  function createTutorialSearches() {
    const searches = [];
    Events.favorites.startedFetchingFavorites.on(async () => {
      await sleep(1e3);
      const postIds = getAllThumbs().map((thumb) => thumb.id);
      shuffleArray(postIds);
      const exampleSearch = `( EXAMPLE: ~ ${postIds.slice(0, 9).join(" ~ ")} ) ( male* ~ female* ~ 1boy ~ 1girls )`;
      searches.push(exampleSearch);
      for (let i = searches.length - 1; i >= 0; i -= 1) {
        saveSearch(searches[i]);
      }
      storeSavedSearches();
    }, {
      once: true
    });
  }
  function inEditMode() {
    return stopEditingButton.style.display !== "none";
  }
  function exportSavedSearches() {
    const savedSearchString = Array.from(document.getElementsByClassName("save-search-label")).map((search) => search.innerText).join("\n");
    navigator.clipboard.writeText(savedSearchString);
    alert("Copied saved searches to clipboard");
  }
  function importSavedSearches() {
    const doesNotHaveSavedSearches = savedSearchesList.querySelectorAll("li").length === 0;
    if (doesNotHaveSavedSearches || confirm("Are you sure you want to import saved searches? This will overwrite current saved searches.")) {
      const savedSearches = textarea.value.split("\n");
      savedSearchesList.innerHTML = "";
      for (let i = savedSearches.length - 1; i >= 0; i -= 1) {
        saveSearch(savedSearches[i]);
      }
      storeSavedSearches();
    }
  }
  function saveSearchResultsAsCustomSearch() {
    const latestSearchResults2 = CrossFeatureRequests.latestFavoritesSearchResults.request();
    const searchResultIds = latestSearchResults2.map((favorite) => favorite.id);
    if (searchResultIds.length === 0) {
      return;
    }
    if (searchResultIds.length > 300) {
      if (!confirm(`Are you sure you want to save ${searchResultIds.length} ids as one search?`)) {
        return;
      }
    }
    const customSearch = `( ${searchResultIds.join(" ~ ")} )`;
    saveSearch(customSearch);
    storeSavedSearches();
  }
  function prepareSearchPageThumbs(thumbs) {
    thumbs.forEach((thumb) => prepareThumb(thumb));
    return thumbs;
  }
  function extractSearchPageThumbs(dom) {
    return Array.from(dom.querySelectorAll(".thumb")).filter((thumb) => thumb instanceof HTMLElement);
  }
  function prepareThumb(thumb) {
    moveTagsFromTitleToTagsAttribute(thumb);
    assignContentType(thumb);
    addAddFavoriteButton(thumb);
    addCanvas(thumb);
    thumb.id = removeNonNumericCharacters(getIdFromThumb(thumb));
    thumb.classList.remove("thumb");
    thumb.classList.add("favorite");
    if (ON_MOBILE_DEVICE) {
      prepareMobileThumb(thumb);
    }
  }
  function addAddFavoriteButton(thumb) {
    const anchor = thumb.querySelector("a");
    if (anchor === null) {
      return;
    }
    anchor.insertAdjacentHTML("beforeend", ADD_FAVORITE_IMAGE_HTML);
    const button = anchor.querySelector(".add-favorite-button");
    if (!(button instanceof HTMLElement)) {
      return;
    }
    button.onmousedown = (event) => {
      event.stopPropagation();
      if (event.button === 0 /* LEFT */) {
        addFavorite(thumb.id);
        button.remove();
      }
    };
  }
  function addCanvas(thumb) {
    if (GALLERY_DISABLED || thumb.querySelector("canvas") !== null) {
      return;
    }
    const anchor = thumb.querySelector("a");
    if (anchor !== null) {
      anchor.appendChild(document.createElement("canvas"));
    }
  }
  function assignContentType(thumb) {
    thumb.classList.remove("image");
    thumb.classList.remove("video");
    thumb.classList.remove("gif");
    const image = getImageFromThumb(thumb);
    if (image === null) {
      return;
    }
    const tags = image.getAttribute("tags") ?? "";
    image.classList.add(getContentType(tags));
  }
  function prepareMobileThumb(thumb) {
    for (const script of thumb.querySelectorAll("script")) {
      script.remove();
    }
    const image = getImageFromThumb(thumb);
    if (image === null) {
      return;
    }
    image.removeAttribute("style");
    const altSource = image.getAttribute("data-cfsrc");
    if (altSource !== null) {
      image.setAttribute("src", altSource);
      image.removeAttribute("data-cfsrc");
    }
  }
  async function findSearchPageExtensions(ids) {
    const posts = await fetchMultiplePostsFromAPI(Array.from(ids));
    for (const post of Object.values(posts)) {
      if (post.width > 0) {
        setExtensionFromPost(post);
        correctMediaTags(post);
      }
    }
  }
  function correctMediaTags(post) {
    if (!ON_SEARCH_PAGE) {
      return;
    }
    const thumb = document.getElementById(post.id);
    if (thumb === null) {
      return;
    }
    const tagSet = convertToTagSet(post.tags);
    const isVideo2 = post.fileURL.endsWith("mp4");
    const isGif2 = post.fileURL.endsWith("gif");
    const isImage2 = !isVideo2 && !isGif2;
    const documentThumb = document.getElementById(thumb.id);
    if (isImage2) {
      removeAnimatedTags(tagSet);
      removeAnimatedAttributes(thumb);
      removeAnimatedAttributes(documentThumb);
    } else if (isVideo2) {
      tagSet.add("video");
    } else if (isGif2) {
      tagSet.add("gif");
    }
    const tagString = convertToTagString(tagSet);
    setThumbTagsOnSearchPage(thumb, tagString);
    setThumbTagsOnSearchPage(documentThumb, tagString);
  }
  function setThumbTagsOnSearchPage(thumb, tags) {
    if (thumb === null) {
      return;
    }
    const image = getImageFromThumb(thumb);
    if (image === null) {
      return;
    }
    image.setAttribute("tags", tags);
  }
  function removeAnimatedTags(tagSet) {
    tagSet.delete("animated");
    tagSet.delete("video");
    tagSet.delete("mp4");
    tagSet.delete("gif");
  }
  function removeAnimatedAttributes(thumb) {
    if (thumb === null) {
      return;
    }
    thumb.classList.remove("video");
    thumb.classList.remove("gif");
    const image = getImageFromThumb(thumb);
    if (image === null) {
      return;
    }
    image.classList.remove("video");
    image.classList.remove("gif");
  }
  var PARSER7 = new DOMParser();
  var SearchPage = class {
    thumbs;
    paginator;
    ids;
    pageNumber;
    isFinalPage;
    constructor(pageNumber, content) {
      if (typeof content === "string") {
        const dom = PARSER7.parseFromString(content, "text/html");
        this.thumbs = prepareSearchPageThumbs(extractSearchPageThumbs(dom));
        this.paginator = dom.getElementById("paginator");
      } else {
        this.thumbs = content;
        this.paginator = document.getElementById("paginator");
      }
      this.pageNumber = pageNumber;
      this.ids = new Set(this.thumbs.map((thumb) => thumb.id));
      this.isFinalPage = this.thumbs.length < POSTS_PER_SEARCH_PAGE;
      findSearchPageExtensions(this.ids);
    }
    get isEmpty() {
      return this.thumbs.length === 0;
    }
    get isLast() {
      return this.thumbs.length < POSTS_PER_SEARCH_PAGE;
    }
    get isFirst() {
      return this.pageNumber === 0;
    }
  };
  var SEARCH_PAGE_FETCH_LIMITER = new ConcurrencyLimiter(2);
  var SEARCH_PAGE_PREFETCH_LENGTH = 6;
  var searchPages;
  var fetchedPageNumbers;
  var initialPageNumber;
  var currentPageNumber3;
  var initialURL = getInitialURL();
  var allThumbs = [];
  function setupSearchPageLoader() {
    searchPages = /* @__PURE__ */ new Map();
    fetchedPageNumbers = /* @__PURE__ */ new Set();
    initialPageNumber = getInitialPageNumber();
    currentPageNumber3 = initialPageNumber;
    initialURL = getInitialURL();
    setAllThumbs(Array.from(getAllThumbs()));
    const searchPage2 = new SearchPage(initialPageNumber, allThumbs);
    searchPages.set(initialPageNumber, searchPage2);
    preloadSearchPages();
    Events.searchPage.searchPageCreated.emit(searchPage2);
  }
  function navigateSearchPages(direction) {
    const nextPageNumber = getAdjacentSearchPageNumber(direction);
    const searchPage2 = searchPages.get(nextPageNumber);
    if (nextPageNumber < 0) {
      return null;
    }
    if (searchPage2 === void 0 || searchPage2.isEmpty) {
      fetchedPageNumbers.delete(nextPageNumber);
      searchPages.delete(nextPageNumber);
      loadSearchPage(nextPageNumber);
      return null;
    }
    currentPageNumber3 = nextPageNumber;
    preloadSearchPages();
    return searchPage2;
  }
  function getAdjacentSearchPageNumber(direction) {
    const forward = isForwardNavigationKey(direction);
    return forward ? currentPageNumber3 + 1 : currentPageNumber3 - 1;
  }
  function preloadSearchPages() {
    loadSearchPage(currentPageNumber3);
    for (let i = 1; i < SEARCH_PAGE_PREFETCH_LENGTH; i += 1) {
      loadSearchPage(currentPageNumber3 - i);
      loadSearchPage(currentPageNumber3 + i);
    }
  }
  function loadSearchPage(pageNumber) {
    if (pageHasAlreadyBeenFetched(pageNumber) || pageNumber < 0) {
      return Promise.resolve();
    }
    fetchedPageNumbers.add(pageNumber);
    return SEARCH_PAGE_FETCH_LIMITER.run(() => {
      return fetchSearchPage(pageNumber).then((html) => {
        registerNewPage(pageNumber, html);
        updateAllThumbs();
      }).catch(() => {
        fetchedPageNumbers.delete(pageNumber);
        searchPages.delete(pageNumber);
      });
    });
  }
  function pageHasAlreadyBeenFetched(pageNumber) {
    return searchPages.has(pageNumber) || fetchedPageNumbers.has(pageNumber);
  }
  function registerNewPage(pageNumber, html) {
    searchPages.set(pageNumber, new SearchPage(pageNumber, html));
  }
  function fetchSearchPage(pageNumber) {
    return fetch(getSearchPageURL(pageNumber)).then((response) => {
      if (response.ok) {
        return response.text();
      }
      throw new Error(String(response.status));
    });
  }
  function getSearchPageURL(pageNumber) {
    return `${initialURL}&pid=${POSTS_PER_SEARCH_PAGE * pageNumber}`;
  }
  function updateAllThumbs() {
    const sortedPageNumbers = Array.from(searchPages.keys()).sort();
    let thumbs = [];
    for (const pageNumber of sortedPageNumbers) {
      const page = searchPages.get(pageNumber);
      if (page !== void 0) {
        thumbs = thumbs.concat(page.thumbs);
      }
    }
    setAllThumbs(thumbs);
  }
  function getInitialPageNumber() {
    const match = /&pid=(\d+)/.exec(location.href);
    return match === null ? 0 : Math.round(parseInt(match[1]) / POSTS_PER_SEARCH_PAGE);
  }
  function getInitialURL() {
    return location.href.replace(/&pid=(\d+)/, "");
  }
  function setAllThumbs(thumbs) {
    allThumbs = thumbs;
  }
  function getAllSearchPageThumbs() {
    return allThumbs;
  }
  async function getMoreResults3() {
    const currentSearchPage = searchPages.get(currentPageNumber3);
    if (currentSearchPage === void 0) {
      console.error(`Current search page undefined ${currentPageNumber3}`);
      return [];
    }
    if (currentSearchPage.isFinalPage) {
      return [];
    }
    currentPageNumber3 += 1;
    let nextSearchPage = searchPages.get(currentPageNumber3);
    if (nextSearchPage === void 0) {
      await loadSearchPage(currentPageNumber3);
    }
    for (let attempts = 1; attempts < 8; attempts += 1) {
      if (nextSearchPage === void 0) {
        loadSearchPage(currentPageNumber3);
        await sleep(500);
      } else {
        break;
      }
      nextSearchPage = searchPages.get(currentPageNumber3);
    }
    if (nextSearchPage === void 0) {
      console.error(`Could not load next search page ${currentPageNumber3}`);
      return [];
    }
    loadSearchPage(currentPageNumber3 + 1);
    return nextSearchPage.thumbs;
  }
  function getInitialPageThumbs() {
    const searchPage2 = getInitialSearchPage() ?? void 0;
    return searchPage2 === void 0 ? [] : searchPage2.thumbs;
  }
  function getInitialSearchPage() {
    return searchPages.get(initialPageNumber) ?? null;
  }
  function resetCurrentPageNumber() {
    currentPageNumber3 = initialPageNumber;
  }
  function setupSearchPageModel() {
    setupSearchPageLoader();
  }
  function navigateSearchPages2(direction) {
    return navigateSearchPages(direction);
  }
  function getMoreResults4() {
    return getMoreResults3();
  }
  function getInitialPageThumbs2() {
    return getInitialPageThumbs();
  }
  function resetCurrentPageNumber2() {
    resetCurrentPageNumber();
  }
  function getAllSearchPageThumbs2() {
    return getAllSearchPageThumbs();
  }
  function updatePaginator(searchPage2) {
    if (searchPage2.paginator === null) {
      return;
    }
    const currentPaginator = document.getElementById("paginator");
    const placeToInsert = currentPaginator;
    if (placeToInsert === null) {
      return;
    }
    placeToInsert.insertAdjacentElement("afterend", searchPage2.paginator);
    if (currentPaginator !== null) {
      currentPaginator.remove();
    }
  }
  function updateAddressBar(searchPage2) {
    const baseURL = location.origin + location.pathname;
    const searchFragment = `${location.search.replace(/&pid=\d+/g, "")}&pid=${searchPage2.pageNumber * POSTS_PER_SEARCH_PAGE}`;
    window.history.replaceState(null, "", baseURL + searchFragment);
  }
  function createSearchPage(searchPage2) {
    tile(searchPage2.thumbs);
    updatePaginator(searchPage2);
    updateAddressBar(searchPage2);
  }
  function toggleInfiniteScroll2(value) {
    insertStyleHTML(value ? SEARCH_PAGE_INFINITE_SCROLL_HTML : "", "search-page-infinite-scroll");
  }
  function setupSearchPageView() {
    setupTiler();
    tile(getAllThumbs());
    hideUnusedLayoutSizer(Preferences.searchPageLayout.value);
    toggleInfiniteScroll3(Preferences.searchPageInfiniteScrollEnabled.value);
  }
  function createSearchPage2(searchPage2) {
    createSearchPage(searchPage2);
  }
  function changeLayout4(layout) {
    changeLayout(layout);
  }
  function insertNewSearchResults2(thumbs) {
    addItemsToBottom(thumbs);
  }
  function toggleInfiniteScroll3(value) {
    toggleInfiniteScroll2(value);
  }
  var pageBottomObserver;
  function setupInfiniteScroll() {
    pageBottomObserver = new PageBottomObserver(showMoreResults);
    Events.searchPage.searchPageReady.on(() => {
      if (Preferences.searchPageInfiniteScrollEnabled.value) {
        pageBottomObserver.refresh();
      }
    }, { once: true });
  }
  function disableInfiniteScroll() {
    pageBottomObserver.disconnect();
  }
  function enableInfiniteScroll() {
    pageBottomObserver.refresh();
  }
  async function showMoreResults() {
    if (!Preferences.searchPageInfiniteScrollEnabled.value) {
      return false;
    }
    const moreResults = await getMoreResults4();
    if (moreResults.length > 0 && Preferences.searchPageInfiniteScrollEnabled.value) {
      insertNewSearchResults2(moreResults);
      Events.searchPage.moreResultsAdded.emit(moreResults);
      pageBottomObserver.refresh();
      return true;
    }
    return false;
  }
  function navigateSearchPages3(direction) {
    if (Preferences.searchPageInfiniteScrollEnabled.value) {
      showMoreResults();
      return null;
    }
    const searchPage2 = navigateSearchPages2(direction);
    if (searchPage2 !== null) {
      createSearchPage2(searchPage2);
      Events.searchPage.pageChanged.emit(searchPage2);
    }
    return searchPage2;
  }
  function toggleInfiniteScroll4(value) {
    if (value) {
      enableInfiniteScroll();
      showMoreResults();
    } else {
      resetCurrentPageNumber2();
      disableInfiniteScroll();
      tile(getInitialPageThumbs2());
    }
    toggleInfiniteScroll3(value);
  }
  function addSearchPageEventListeners2() {
    CrossFeatureRequests.loadNewSearchPagesInGallery.setHandler(navigateSearchPages3);
    CrossFeatureRequests.latestSearchPageThumbs.setHandler(getAllSearchPageThumbs2);
    Events.searchPage.layoutChanged.on(changeLayout4);
    Events.searchPage.infiniteScrollToggled.on(toggleInfiniteScroll4);
  }
  var CHECKBOXES2 = [
    {
      id: "search-page-upscale",
      parentId: "search-page-upscale-thumbs",
      position: "beforeend",
      title: "Upscale thumbnails on search pages",
      preference: Preferences.upscaleThumbsOnSearchPage,
      event: Events.searchPage.upscaleToggled,
      textContent: "",
      enabled: ON_DESKTOP_DEVICE,
      defaultValue: false
    },
    {
      id: "search-page-inf-scroll",
      parentId: "search-page-infinite-scroll",
      position: "beforeend",
      title: "Enable infinite scroll",
      preference: Preferences.searchPageInfiniteScrollEnabled,
      event: Events.searchPage.infiniteScrollToggled,
      textContent: "",
      defaultValue: false
    },
    {
      id: "enable-autoplay",
      parentId: "search-page-autoplay",
      position: "beforeend",
      textContent: "Autoplay",
      title: "Enable autoplay in gallery",
      enabled: GALLERY_ENABLED,
      preference: Preferences.autoplayActive,
      hotkey: "",
      event: Events.favorites.autoplayToggled
    },
    {
      id: "show-add-favorite-buttons",
      parentId: "search-page-add-favorite-buttons",
      textContent: "Add Favorite Buttons",
      title: "Toggle add favorite buttons",
      position: "beforeend",
      preference: Preferences.searchPageAddButtonsVisible,
      function: toggleAddOrRemoveButtons,
      hotkey: "R",
      event: Events.favorites.addButtonsToggled
    },
    {
      id: "enable-gallery-menu",
      parentId: "search-page-gallery-menu",
      textContent: "Gallery Menu",
      title: "Show menu in gallery",
      position: "beforeend",
      enabled: GALLERY_ENABLED && GeneralSettings.galleryMenuOptionEnabled,
      function: toggleGalleryMenuEnabled,
      preference: Preferences.galleryMenuEnabled,
      event: Events.favorites.galleryMenuToggled
    }
  ];
  var SELECTS3 = [
    {
      id: "layout-select",
      parentId: "search-page-layout",
      title: "Change layout",
      position: "beforeend",
      preference: Preferences.searchPageLayout,
      event: Events.searchPage.layoutChanged,
      options: /* @__PURE__ */ new Map([
        ["native", "Native"],
        ["column", "Waterfall"],
        ["row", "River"],
        ["square", "Square"],
        ["grid", "Legacy"]
      ])
    },
    {
      id: "column-count",
      parentId: "search-page-column-count",
      position: "beforeend",
      preference: Preferences.searchPageColumnCount,
      event: Events.favorites.columnCountChanged,
      options: new Map(getNumberRange(2, ON_DESKTOP_DEVICE ? 25 : 10).map((n) => [n, String(n)]))
    },
    {
      id: "row-size",
      parentId: "search-page-row-size",
      position: "beforeend",
      preference: Preferences.searchPageRowSize,
      event: Events.favorites.rowSizeChanged,
      options: new Map(getNumberRange(1, 10).map((n) => [n, String(n)]))
    },
    {
      id: "performance-profile",
      parentId: "search-page-performance-profile",
      title: "Improve performance by disabling features",
      position: "beforeend",
      preference: Preferences.performanceProfile,
      event: Events.favorites.performanceProfileChanged,
      function: reloadWindow,
      enabled: ON_DESKTOP_DEVICE,
      isNumeric: true,
      options: /* @__PURE__ */ new Map([
        [0 /* NORMAL */, "Normal"],
        [3 /* MEDIUM */, "Medium"],
        [1 /* LOW */, "Low"],
        [2 /* POTATO */, "Potato"]
      ])
    }
  ];
  var NUMBERS2 = [];
  function createCheckboxes2() {
    for (const checkbox of prepareDynamicElements(CHECKBOXES2)) {
      createCheckboxElement(checkbox);
    }
  }
  function createNumbers2() {
    for (const number of prepareDynamicElements(NUMBERS2)) {
      createNumberComponent(number);
    }
  }
  function createSelects3() {
    for (const select2 of prepareDynamicElements(SELECTS3)) {
      createSelectElement(select2);
    }
  }
  function createDynamicSearchPageMenuElements() {
    createCheckboxes2();
    createSelects3();
    createNumbers2();
  }
  async function prepareAllThumbsOnSearchPage() {
    await waitForDOMToLoad();
    await waitForAllThumbnailsToLoad();
    const thumbs = getAllThumbs();
    prepareSearchPageThumbs(thumbs);
    Events.searchPage.searchPageReady.emit();
  }
  function styleSearchPageMenu() {
    const hiddenSelectors = /* @__PURE__ */ new Set();
    if (GALLERY_DISABLED) {
      hiddenSelectors.add("#search-page-upscale-thumbs");
      hiddenSelectors.add("#search-page-autoplay");
    }
    if (ON_MOBILE_DEVICE) {
      hiddenSelectors.add("#search-page-upscale-thumbs");
      hiddenSelectors.add("#search-page-performance-profile");
      hiddenSelectors.add("#search-page-autoplay");
      hiddenSelectors.add(".utility-button");
      hiddenSelectors.add("#search-page-add-favorite-buttons");
      hiddenSelectors.add("#search-page-gallery-menu");
    }
    if (Preferences.performanceProfile.value !== 0 /* NORMAL */) {
      hiddenSelectors.add("#search-page-upscale-thumbs");
    }
    if (hiddenSelectors.size > 0) {
      insertStyleHTML(`
      ${[...hiddenSelectors].join(",\n")} {
        display: none !important;
      }
    `);
    }
  }
  function removeOriginalSearchPageThumbs() {
    const thumbContainer = document.querySelector(".image-list");
    if (thumbContainer !== null) {
      thumbContainer.innerHTML = "";
    }
  }
  function insertContentContainer() {
    const content = document.querySelector(".content");
    if (content !== null) {
      content.insertAdjacentElement("afterbegin", CONTENT_CONTAINER);
    }
  }
  function insertSearchPageHTML() {
    const displayOptions = document.getElementById("displayOptions");
    if (displayOptions === null) {
      return;
    }
    const listItem = document.createElement("li");
    displayOptions.appendChild(listItem);
    insertHTMLAndExtractStyle(listItem, "beforeend", SEARCH_PAGE_HTML);
    if (ON_MOBILE_DEVICE) {
      insertStyleHTML(`#search-page-upscale-thumbs {
      display: none;
    }`);
    }
  }
  async function buildSearchPage() {
    await waitForDOMToLoad();
    removeOriginalSearchPageThumbs();
    insertSearchPageHTML();
    insertContentContainer();
    createDynamicSearchPageMenuElements();
    prepareAllThumbsOnSearchPage();
    styleSearchPageMenu();
    toggleAddOrRemoveButtons(Preferences.searchPageAddButtonsVisible.value);
  }
  function setupSearchPage() {
    if (!ON_SEARCH_PAGE || !Preferences.searchPagesEnabled.value) {
      return;
    }
    buildSearchPage();
    setupSearchPageModel();
    setupSearchPageView();
    addSearchPageEventListeners2();
    setupInfiniteScroll();
  }
  var SELECTED = /* @__PURE__ */ new Set();
  var UI = {};
  var FAVORITES_OPTION = {};
  var tagEditModeAbortController = new AbortController();
  var atLeastOneFavoriteIsSelected = false;
  function setupTagModifier() {
    if (TAG_MODIFIER_DISABLED) {
      return;
    }
    insertHTML4();
    addEventListeners8();
  }
  function insertHTML4() {
    if (!ON_FAVORITES_PAGE) {
      return;
    }
    insertHTMLAndExtractStyle(document.getElementById("bottom-panel-3"), "beforeend", TAG_MODIFIER_HTML);
    FAVORITES_OPTION.container = document.getElementById("tag-modifier-container");
    FAVORITES_OPTION.checkbox = document.getElementById("tag-modifier-option-checkbox");
    UI.container = document.getElementById("tag-modifier-ui-container");
    UI.statusLabel = document.getElementById("tag-modifier-ui-status-label");
    UI.textarea = document.getElementById("tag-modifier-ui-textarea");
    UI.add = document.getElementById("tag-modifier-ui-add");
    UI.remove = document.getElementById("tag-modifier-remove");
    UI.reset = document.getElementById("tag-modifier-reset");
    UI.selectAll = document.getElementById("tag-modifier-ui-select-all");
    UI.unSelectAll = document.getElementById("tag-modifier-ui-un-select-all");
    UI.import = document.getElementById("tag-modifier-import");
    UI.export = document.getElementById("tag-modifier-export");
  }
  function addEventListeners8() {
    if (!ON_FAVORITES_PAGE) {
      return;
    }
    FAVORITES_OPTION.checkbox.onchange = (event) => {
      if (event.target instanceof HTMLInputElement) {
        toggleTagEditMode(event.target.checked);
      }
    };
    UI.selectAll.onclick = selectAll;
    UI.unSelectAll.onclick = unSelectAll;
    UI.add.onclick = addTagsToSelected;
    UI.remove.onclick = removeTagsFromSelected;
    UI.reset.onclick = resetTagModifications;
    UI.import.onclick = DO_NOTHING;
    UI.export.onclick = DO_NOTHING;
    Events.favorites.searchResultsUpdated.on(() => {
      unSelectAll();
    });
    Events.favorites.pageChanged.on(() => {
      highlightSelectedThumbsOnPageChange();
    });
  }
  function getSelectedFavoritesOnPage() {
    const results = CrossFeatureRequests.latestFavoritesSearchResults.request();
    return results.filter((favorite) => document.getElementById(favorite.id) !== null && isSelected(favorite));
  }
  function highlightSelectedThumbsOnPageChange() {
    if (atLeastOneFavoriteIsSelected) {
      for (const favorite of getSelectedFavoritesOnPage()) {
        toggleOutline(favorite, true);
      }
    }
  }
  function toggleTagEditMode(value) {
    toggleThumbInteraction(value);
    toggleUI2(value);
    toggleTagEditModeEventListeners(value);
    UI.unSelectAll.click();
  }
  function toggleThumbInteraction(value) {
    let html = "";
    if (value) {
      html = `
      .favorite  {
        cursor: pointer;
        outline: 1px solid black;

        > div,
        >a
        {
          outline: none !important;

          > img {
            outline: none !important;
          }

          pointer-events:none;
          opacity: 0.6;
          filter: grayscale(40%);
          transition: none !important;
        }
      }
    `;
    }
    insertStyleHTML(html, "tag-edit-mode");
  }
  function toggleUI2(value) {
    UI.container.style.display = value ? "block" : "none";
  }
  function getFavorite2(id) {
    return CrossFeatureRequests.latestFavoritesSearchResults.request().find((favorite) => favorite.id === id);
  }
  function toggleTagEditModeEventListeners(value) {
    if (!value) {
      tagEditModeAbortController.abort();
      tagEditModeAbortController = new AbortController();
      return;
    }
    Events.document.click.on((event) => {
      if (!(event.target instanceof HTMLElement) || !event.target.classList.contains(ITEM_CLASS_NAME)) {
        return;
      }
      const favorite = getFavorite2(event.target.id);
      if (favorite !== void 0) {
        select(favorite);
      }
    }, {
      signal: tagEditModeAbortController.signal
    });
  }
  function showStatus(text) {
    UI.statusLabel.style.visibility = "visible";
    UI.statusLabel.textContent = text;
    setTimeout(() => {
      const statusHasNotChanged = UI.statusLabel.textContent === text;
      if (statusHasNotChanged) {
        UI.statusLabel.style.visibility = "hidden";
      }
    }, 1e3);
  }
  function unSelectAll() {
    if (!atLeastOneFavoriteIsSelected) {
      return;
    }
    for (const favorite of SELECTED) {
      select(favorite, false);
    }
    atLeastOneFavoriteIsSelected = false;
  }
  function selectAll() {
    for (const favorite of CrossFeatureRequests.latestFavoritesSearchResults.request()) {
      select(favorite, true);
    }
  }
  function select(favorite, value) {
    atLeastOneFavoriteIsSelected = true;
    if (value === void 0) {
      value = !SELECTED.has(favorite);
    }
    if (value) {
      SELECTED.add(favorite);
    } else {
      SELECTED.delete(favorite);
    }
    toggleOutline(favorite, value);
  }
  function toggleOutline(favorite, value) {
    if (document.getElementById(favorite.id) !== null || !value) {
      favorite.root.classList.toggle("tag-modifier-selected", value);
    }
  }
  function isSelected(favorite) {
    return SELECTED.has(favorite);
  }
  function removeContentTypeTags(tags) {
    return tags.replace(/(?:^|\s*)(?:video|animated|mp4)(?:$|\s*)/g, "");
  }
  function addTagsToSelected() {
    modifyTagsOfSelected(false);
  }
  function removeTagsFromSelected() {
    modifyTagsOfSelected(true);
  }
  function modifyTagsOfSelected(remove) {
    const tags = UI.textarea.value.toLowerCase();
    const tagsWithoutContentTypes = removeContentTypeTags(tags);
    const tagsToModify = removeExtraWhiteSpace(tagsWithoutContentTypes);
    const statusPrefix = remove ? "Removed tag(s) from" : "Added tag(s) to";
    let modifiedTagsCount = 0;
    if (tagsToModify === "") {
      return;
    }
    for (const favorite of SELECTED) {
      const additionalTags = remove ? favorite.removeAdditionalTags(tagsToModify) : favorite.addAdditionalTags(tagsToModify);
      TAG_MODIFICATIONS.set(favorite.id, additionalTags);
      modifiedTagsCount += 1;
    }
    if (modifiedTagsCount === 0) {
      return;
    }
    if (tags !== tagsWithoutContentTypes) {
      alert("Warning: video, animated, and mp4 tags are unchanged.\nThey cannot be modified.");
    }
    showStatus(`${statusPrefix} ${modifiedTagsCount} favorite(s)`);
    dispatchEvent(new Event("modifiedTags"));
    setCustomTags(tagsToModify);
    storeTagModifications();
  }
  var tooltip;
  var defaultTransition;
  var visible;
  var searchTagColorCodes;
  var searchBox2;
  var previousSearch;
  var currentImage;
  function setupTooltip() {
    if (TOOLTIP_DISABLED) {
      return;
    }
    visible = Preferences.tooltipsVisible.value;
    FAVORITES_SEARCH_GALLERY_CONTAINER.insertAdjacentHTML("afterbegin", TOOLTIP_HTML);
    tooltip = createTooltip();
    defaultTransition = tooltip.style.transition;
    searchTagColorCodes = {};
    currentImage = null;
    addEventListeners9();
    assignColorsToMatchedTags();
  }
  function createTooltip() {
    const t = document.createElement("span");
    const container3 = document.getElementById("tooltip-container");
    t.className = "light-green-gradient";
    t.id = "tooltip";
    if (container3 !== null) {
      container3.appendChild(t);
    }
    return t;
  }
  function addEventListeners9() {
    addCommonEventListeners2();
    addFavoritesPageEventListeners3();
  }
  function addCommonEventListeners2() {
    addMouseOverEventListener();
  }
  function addFavoritesPageEventListeners3() {
    if (!ON_FAVORITES_PAGE) {
      return;
    }
    Events.favorites.tooltipsToggled.on((value) => {
      toggleVisibility3(value);
      if (ON_FAVORITES_PAGE) {
        if (currentImage === null) {
          return;
        }
        if (visible) {
          show2(currentImage);
        } else {
          hide5();
        }
        return;
      }
      if (ON_SEARCH_PAGE) {
        toggleVisibility3();
        if (currentImage !== null) {
          hide5();
        }
      }
    });
  }
  function addMouseOverEventListener() {
    Events.document.mouseover.on((mouseOverEvent) => {
      if (mouseOverEvent.thumb === null) {
        hide5();
        currentImage = null;
        return;
      }
      const image = getImageFromThumb(mouseOverEvent.thumb);
      if (image === null) {
        return;
      }
      currentImage = image;
      if (visible) {
        show2(image);
      }
    });
  }
  function assignColorsToMatchedTags() {
    if (ON_SEARCH_PAGE) {
      assignColorsToMatchedTagsOnSearchPage();
      return;
    }
    const newSearchBox = document.getElementById("favorites-search-box");
    if (!(newSearchBox instanceof HTMLTextAreaElement)) {
      return;
    }
    searchBox2 = newSearchBox;
    assignColorsToMatchedTagsOnFavoritesPage();
    searchBox2.addEventListener("input", () => {
      assignColorsToMatchedTagsOnFavoritesPage();
    });
    Events.favorites.searchResultsUpdated.on(() => {
      assignColorsToMatchedTagsOnFavoritesPage();
    });
  }
  function setPosition(image) {
    const imageContainer = image.parentElement;
    const sizeCalculationDiv = document.createElement("div");
    sizeCalculationDiv.className = "size-calculation-div";
    imageContainer.appendChild(sizeCalculationDiv);
    const rect = sizeCalculationDiv.getBoundingClientRect();
    sizeCalculationDiv.remove();
    const offset = 7;
    let tooltipRect;
    tooltip.style.top = `${rect.bottom + offset + window.scrollY}px`;
    tooltip.style.left = `${rect.x - 3}px`;
    tooltip.classList.toggle("visible", true);
    tooltipRect = tooltip.getBoundingClientRect();
    const toolTipIsClippedAtBottom = tooltipRect.bottom > window.innerHeight;
    if (!toolTipIsClippedAtBottom) {
      return;
    }
    tooltip.style.top = `${rect.top - tooltipRect.height + window.scrollY - offset}px`;
    tooltipRect = tooltip.getBoundingClientRect();
    const menu = document.getElementById("favorites-search-gallery-menu");
    const elementAboveTooltip = menu === null ? document.getElementById("header") : menu;
    if (elementAboveTooltip === null) {
      return;
    }
    const elementAboveTooltipRect = elementAboveTooltip.getBoundingClientRect();
    const toolTipIsClippedAtTop = tooltipRect.top < elementAboveTooltipRect.bottom;
    if (!toolTipIsClippedAtTop) {
      return;
    }
    const tooltipIsLeftOfCenter = tooltipRect.left < window.innerWidth / 2;
    tooltip.style.top = `${rect.top + window.scrollY + rect.height / 2 - offset}px`;
    if (tooltipIsLeftOfCenter) {
      tooltip.style.left = `${rect.right + offset}px`;
    } else {
      tooltip.style.left = `${rect.left - 750 - offset}px`;
    }
  }
  function show2(image) {
    tooltip.innerHTML = formatHTML(getTags2(image));
    setPosition(image);
  }
  function hide5() {
    tooltip.style.transition = "none";
    tooltip.classList.toggle("visible", false);
    setTimeout(() => {
      tooltip.style.transition = defaultTransition;
    }, 5);
  }
  function getTags2(image) {
    const thumb = getThumbFromImage(image);
    if (thumb === null) {
      return "";
    }
    const tags = getTagSetFromItem(thumb);
    if (searchTagColorCodes[thumb.id] === void 0) {
      tags.delete(thumb.id);
    }
    return convertToTagString(tags);
  }
  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i += 1) {
      if (i === 2 || i === 3) {
        color += "0";
      } else {
        color += letters[Math.floor(Math.random() * letters.length)];
      }
    }
    return color;
  }
  function formatHTML(tags) {
    let unmatchedTagsHTML = "";
    let matchedTagsHTML = "";
    const tagList = removeExtraWhiteSpace(tags).split(" ");
    for (let i = 0; i < tagList.length; i += 1) {
      const tag = tagList[i];
      const tagColor = getColorCode(tag);
      const tagWithSpace = `${tag} `;
      if (tagColor === null) {
        unmatchedTagsHTML += tagWithSpace;
      } else {
        matchedTagsHTML += `<span style="color:${tagColor}"><b>${tagWithSpace}</b></span>`;
      }
    }
    const html = matchedTagsHTML + unmatchedTagsHTML;
    if (html === "") {
      return tags;
    }
    return html;
  }
  function assignTagColors(searchQuery2) {
    searchQuery2 = removeNotTags(searchQuery2);
    const { orGroups, remainingTags } = extractTagGroups(searchQuery2);
    searchTagColorCodes = {};
    assignColorsToOrGroupTags(orGroups);
    assignColorsToRemainingTags(remainingTags);
  }
  function assignColorsToOrGroupTags(orGroups) {
    for (const orGroup of orGroups) {
      const color = getRandomColor();
      for (const tag of orGroup) {
        addColorCodedTag(tag, color);
      }
    }
  }
  function assignColorsToRemainingTags(remainingTags) {
    for (const tag of remainingTags) {
      addColorCodedTag(tag, getRandomColor());
    }
  }
  function removeNotTags(tags) {
    return tags.replace(/(?:^| )-\S+/gm, "");
  }
  function sanitizeTags(tags) {
    return tags.toLowerCase().trim();
  }
  function addColorCodedTag(tag, color) {
    tag = sanitizeTags(tag);
    if (searchTagColorCodes[tag] === void 0) {
      searchTagColorCodes[tag] = color;
    }
  }
  function getColorCode(tag) {
    if (searchTagColorCodes[tag] !== void 0) {
      return searchTagColorCodes[tag];
    }
    for (const searchTag of Object.keys(searchTagColorCodes)) {
      if (tagsMatchWildcardSearchTag(searchTag, tag)) {
        return searchTagColorCodes[searchTag];
      }
    }
    return null;
  }
  function tagsMatchWildcardSearchTag(searchTag, tag) {
    try {
      const wildcardRegex = new RegExp(`^${searchTag.replace(/\*/g, ".*")}$`);
      return wildcardRegex.test(tag);
    } catch {
      return false;
    }
  }
  function toggleVisibility3(value) {
    if (value === void 0) {
      value = !visible;
    }
    Preferences.tooltipsVisible.set(value);
    visible = value;
  }
  function assignColorsToMatchedTagsOnSearchPage() {
    const searchQuery2 = document.getElementsByName("tags")[0].getAttribute("value");
    assignTagColors(searchQuery2 ?? "");
  }
  function assignColorsToMatchedTagsOnFavoritesPage() {
    if (searchBox2.value === previousSearch) {
      return;
    }
    previousSearch = searchBox2.value;
    assignTagColors(searchBox2.value);
  }
  function runFavoritesSearchGallery() {
    if (FAVORITES_SEARCH_GALLERY_DISABLED) {
      return;
    }
    setupGlobals();
    setupFavorites();
    setupSearchPage();
    setupGallery();
    setupSavedSearches();
    setupTagModifier();
    setupAutocomplete();
    setupTooltip();
    setupCaptions();
    setupDownloadMenu();
  }
  runFavoritesSearchGallery();
})();
