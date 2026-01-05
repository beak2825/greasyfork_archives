// ==UserScript==
// @name        redditmod2
// @namespace   derv82
// @description Dark themes, inline posts/comments, endless scrolling, subreddit filters, and other improvements for reddit.com
// @include     http://*.reddit.com/*
// @include     https://*.reddit.com/*
// @version     2.2.5
// @grant       GM.getValue
// @grant       GM.setValue
// @grant       GM.xmlHttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_xmlhttpRequest
// @connect     reddit.com
// @connect     www.reddit.com
// @connect     imgur.com
// @connect     mercury.postlight.com
// @connect     gfycat.com
// @connect     redgifs.com
// @connect     soundcloud.com
// @connect     explosm.net
// @connect     imgflip.com
// @connect     streamable.com
// @connect     instagram.com
// @connect     deviantart.com
// @connect     xkcd.com
// @run-at      document-start
// @require     https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @downloadURL https://update.greasyfork.org/scripts/29724/redditmod2.user.js
// @updateURL https://update.greasyfork.org/scripts/29724/redditmod2.meta.js
// ==/UserScript==

/** TODO
 * Delete filter button.
 * Support domains: giphy, flickr, prnt.sc, questionablecontent
 * Can't collapse/expand comments provided by RedditPromise for some reason... need to hijack onclick?
 * Can't click links in inline-comments (should be target=_blank).
 * Clicking bottom of inline-comment (marked as hovered) doesn't expand/collapse.
 * Voting on posts expands/collapses.
 * Can't vote on expanded comments.
 * Setting toggle: Shrink images to screen height
 * "Options" bar @ top: Fit to window, overflow-y:scroll ?
 */

(() => {
  'use strict';

  const DEBUG = false; // TODO: Change to false for release.

  /** Helper/Wrapper around console.log -- includes stack trace. */
  function debug() {
    if (!DEBUG) return;
    const args = ['[Redditmod@'
      + (new Error()).stack.replace(/.*\?id=[a-f0-9\-]*:/g, '').replace(/@.*[^\r\n]/g, '').replace(/\n\n/g, '').replace(/\n$/g, '').replace(/\n/g, ' <- ')
      + ']'];
    for (let i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    console.log.apply(console.log, args);
  }

  /** Helper function for preventing event bubbling. */
  function stopEvent(event) {
    if (event && event.stopPropagation) event.stopPropagation();
    if (event && event.preventDefault) event.preventDefault();
  }


  /**
   * Promises accessors to a loaded configuration.
   */
  const CONFIG = (() => {
    const BASE_STYLE = '.thing.gilded:hover,.thing:hover{background:linear-gradient(to right,var(--bg-2),var(--bg) 50%,var(--bg-2));box-shadow:0 0 5px rgba(0,0,0,.5)}body>.content .link .rank{width:auto!important}.thing{padding:3px 10px;border-radius:10px;transition:height .2s ease-in-out}#header-img.default-header{width:30px}.redditmod-filter-subreddit-button{border:none;background-color:var(--fg-link);color:var(--bg)!important;font-weight:900;border-radius:15px;padding:0 1.9px .5px;margin-left:5px;box-shadow:0 0 5px rgba(0,0,0,.5)}.redditmod-filter-subreddit-button:hover{text-decoration:none!important;box-shadow:0 0 2px rgba(0,0,0,.5)}';
    const THEMED_STYLE = '#header-bottom-right,.ProfileSidebar__titleContainer,.ProfileTemplate.m-updated,.content,.link,.listing-chooser li.selected,.side,.tabmenu li.selected a,.user-subreddit-banner,body,body.with-listing-chooser .listing-chooser .grippy,html{background-color:var(--bg)}#header,#sr-drop-down,#sr-header-area,.BlueBar,.Media.m-profile.m-image,.Post,.Post__pinInfo,.Post__stickiedDivider,.ProfileBarDropdown__list,.SubscriptionBar,.author-tooltip__head,.authorized-app,.crosspost-preview,.drop-choices,.explore-comment .explore-label,.explore-discovery .explore-label,.explore-hot .explore-label,.explore-rising .explore-label,.gold-accent,.hover-bubble,.infobar,.link .usertext-body .md,.linkinfo,.listing-chooser li,.liveupdate-listing li.liveupdate time::before,.liveupdate-listing li.separator time,.message .subject .correspondent,.message.new>.entry,.modal-content,.nextprev a:hover,.raisedbox,.report-modal .modal-content,.roundfield,.searchpane,.server-seconds,.sr-interest-bar,.sr-interest-bar .bubble,.subreddit .usertext .md,.tabmenu li a,.trophy-area .content,body.with-listing-chooser .listing-chooser,div.link.self:hover,main[role=main]{background-color:var(--bg-2)}#newlink-with-image-upload #new-link-preview,#newlink-with-image-upload .image-upload-drop-target,#sr-more-link,.BlueBar__account,.goldvertisement a,.infobar.profilebetabar,.link .md :not(pre)>code,.link .md pre,.link.promotedlink.promoted,.md code,.md pre,.nextprev a,.tabmenu li a:hover,.usertable tr:hover,.usertext.border .usertext-body,.white-field,oddrow{background-color:var(--bg-odd)}.form-control,.hover-bubble.multi-selector .create-multi input[type=text],.morelink,.morelink .nub,.morelink a,button.expand-summary,button.report-button,input,input[type=password],input[type=text],select,textarea{background-color:var(--bg-input);color:var(--fg-input)}.form-control:focus,.goldvertisement a:hover,.hover-bubble.multi-selector .create-multi input[type=text]:focus,.listing-chooser li:hover,.morelink:hover,.morelink:hover .nub,.morelink:hover a,body.with-listing-chooser .listing-chooser .grippy:hover::after,body.with-listing-chooser.listing-chooser-collapsed .listing-chooser .grippy::before,button.expand-summary:hover,input:focus,input[type=password]:focus,input[type=text]:focus,select:focus,textarea:focus{background-color:var(--bg-input-hover);color:var(--fg-input-hover)}.explore-comment .comment-fade,.form-control,.infobar.onboardingbar,.listing-chooser li.selected,.morelink,.morelink .nub,.morelink:hover,.morelink:hover .nub,.navbar,.search-expando.collapsed::before,.sidebox.hohoho .morelink,body,body.with-listing-chooser .listing-chooser .grippy:hover::after,body.with-listing-chooser.listing-chooser-collapsed .listing-chooser .grippy::before,input[type=text],select,textarea{background-image:none}.hover-bubble.multi-selector label:hover,.icon-menu a,.morelink .nub,.side ul.content,.sidebox .spacer,.titlebox form.toggle,aside.sidebar #discussions li,div.link.self{background-color:transparent}.ProfileBarDropdown__listItem:hover,.drop-choices a.choice:hover,.flair,.linkflairlabel,.wiki-page .pageactions .wikiaction:hover,a.message-count{background-color:var(--fg-link);color:var(--bg)!important}.tagline .flair{background-color:var(--fg-muted);color:var(--bg)}.md hr,.tabmenu.formtab .selected a{background-color:var(--border-color)}.Post__pinInfo,.TabMenu__tab.m-active,.card a,.gold-accent,.goldvertisement,.hover-bubble,.liveupdate-listing li.separator time,.md,.message.message-parent>.entry .md,.message.recipient>.entry,.report-modal .modal-header-title,.report-modal .report-form-bottom-panel .report-form-content-policy p,.report-modal .report-form-last-step-text-custom-rules,.report-modal .report-reason-item .report-reason-display,.search-result-group footer .info,.side .titlebox .md ul li,.titlebox,.titlebox h1 a,.trophy-name,.user-subreddit-public-description,body,html,main[role=main] h1,main[role=main] h2,main[role=main] p{color:var(--fg)}.Post__score,.TrendingProfilesSidebar__header,.TrophyCaseSidebar__header,.UserModeratedSubredditsSidebar__header,.UserSpecialsListSidebar__header,.author-tooltip__credentials-list strong,.brand,.dropdown.srdrop .selected,.gold-accent th,.gold-expiration-info .karma,.goldvertisement .progress p,.hover-bubble.multi-selector strong,.link .md :not(pre)>code,.link .rank,.listing-chooser h3,.search-result :link>mark,.search-result-group-header,.server-seconds em,.sidecontentbox .title h1,.titlebox h1 a:first-child,.wiki-page .wikititle,.wiki-page-content .md h1,.wiki-page-content .md h2,.wiki-page-content .md h3,.wiki-page-content .md h4,.wiki-page-content .md h5,aside.sidebar .md h2,aside.sidebar section,dl>dt,h1,h2,h3,h4,h5{color:var(--fg-2)}#sr-header-area .selected a,#sr-more-link,.Post__authorLink,.Post__authorLink:visited,.Post__flatListItem:link,.Post__source .Post__sourceLink,.Post__tagline,.ProfileSidebar__counters,.ProfileSidebar__description,.ProfileSidebar__displayName,.SubredditListItem__subscribers,.TrophyCaseSidebar__trophyDescription,.TrophyCaseSidebar__trophyTitle,.UserSpecialsListSidebar__date,.UserSpecialsListSidebar__title,.bottommenu,.dropdown.lightdrop .selected,.entry .buttons li a,.explore-comment .comment-link,.explore-item .explore-sr-details,.flat-list li.selected a,.flat-vert.title,.footer,.gray,.gray-buttons button,.listing-chooser li a .description,.liveupdate-listing li.liveupdate time,.md blockquote,.md del,.message .search-result-meta,.message .tagline,.message.message-parent.recipient>.entry .head,.message.message-parent>.entry .head,.message.message-reply.recipient>.entry .head,.multi-details h3,.muted,.nextprev,.preftable .details,.report-modal .report-form-block-user .report-form-action-desc p,.search-expando-button,.search-result .author:link,.search-result .search-subreddit-link:link,.search-result-meta,.separator,.sidebox .subtitle,.sidecontentbox .more a,.sr-list a:link,.sr-list a:link:hover,.sr-list a:visited,.subscription-box .title:visited,.tagline,.tagline .expand,.tagline>a.author,.titlebox .bottom,.titlebox form.toggle,.trophy-description,.user,.redditmod-visited a.title,aside.sidebar #discussions li,dl>dd,label.disabled,span.domain>a{color:var(--fg-muted)}.BlueBar__logout,.ProfileBarDropdown__title,.listing-chooser .create button,.liveupdate-listing li.liveupdate a.author,.liveupdate-listing li.liveupdate:hover time,.report-modal .report-form-bottom-panel .report-form-content-policy a,.search-result :link,.subscription-box .title,.tabmenu li.selected a,.tagline a.subreddit,.thing .title,a,a:link{color:var(--fg-link)}#sr-header-area .selected a:hover,.BlueBar__logout:hover,.Post__authorLink:hover,.Post__stickied-title:hover,.Post__subredditLink:hover,.ProfileBarDropdown__title.m-opened,.author-tooltip__head a:hover,.author-tooltip__link-list a:hover,.flat-list li.selected a:hover,.liveupdate-listing li.liveupdate:hover a.author,.report-modal .report-form-bottom-panel .report-form-content-policy a:hover,.search-result :link:hover,.sidecontentbox .more a:hover,.subscription-box .title:hover,.tabmenu li a:hover,.tagline a.subreddit,.thing .title:hover,a:hover,a:visited:hover{color:var(--fg-link-hover)}.search-result :link:visited,.tabmenu li a,.tagline a.subreddit:visited,.thing .title:visited,a:visited{color:var(--fg-link-visited)}.morelink>a,.spoiler-stamp,a.TrendingProfilesSidebar__follow,a.c-btn-primary{color:#fff}.tagline .submitter{color:#4af}.Post__moderatorFlair,.green,.tagline .moderator,.tagline .pinned-tagline,.tagline .stickied-tagline,.thing.stickied.link a.title,.thing.sticky-pinned.link a.title{color:#3a3}input[style*="color:black"]{color:var(--fg-input)!important}.trophy-name{color:var(--fg-2)!important}hr{color:var(--border-color)}#header,#liveupdate-statusbar.complete,#sr-header-area,.Post.m-profile,.Post__scoreDisplay,.content,.crosspost-preview,.explore-comment .explore-label,.explore-discovery .explore-label,.explore-hot .explore-label,.explore-rising .explore-label,.flair,.footer,.infobar.profilebetabar,.link,.linkflairlabel,.linkinfo,.navbar,.organic-listing,.permission-summary,.reddit-infobar,div.link.self,noborder{border:none}button.expand-summary,button.report-button,custom-border,hr,input,select{border:var(--border)}#compose-message .roundfield select,#header,#header hr,#sr-header-area,.BlueBar,.author-tooltip__credentials-list li,.author-tooltip__head,.author-tooltip_self .author-tooltip__head,.authorized-app,.c-form-control,.drop-choices,.explore-comment .comment,.filtered-details form.add-sr .sr-name,.footer .col,.formtabs-content,.hover-bubble,.hover-bubble.multi-selector .create-multi input[type=text],.infobar,.link .md pre,.link .usertext-body .md,.listing-chooser li,.listing-chooser li.selected,.liveupdate-listing li.separator::before,.md code,.md pre,.md td,.md th,.menuarea,.message.new>.entry,.morelink,.multi-details form.add-sr .sr-name,.nextprev a,.raisedbox,.report-modal .modal-content,.roundfield input[type=text],.roundfield textarea,.search-result-group-header,.sidebox.hohoho .morelink,.sidecontentbox .content,.subreddit .usertext .md,.subscription-box .box-separator,.titlebox .bottom,.wiki-page .pageactions,.wiki-page .wiki-page-content .wiki>.toc>ul,.wiki-page .wiki-page-content .wiki>.toc>ul ul,body.with-listing-chooser .listing-chooser .grippy,body.with-listing-chooser .listing-chooser .grippy::after,body.with-listing-chooser.listing-chooser-collapsed .listing-chooser .grippy::after,hr,input,select,textarea{border-color:var(--border-color)}.tabmenu li.selected a{border-color:transparent}#header-bottom-right{border-bottom:solid 1px var(--bg)}.goldvertisement a,.listing-chooser .create button{border-color:var(--fg-link)}.nextprev .separator{border-color:var(--fg-muted)}.author-tooltip.hover-bubble.anchor-bottom-left::before,.author-tooltip.hover-bubble.anchor-bottom-right::before{border-top-color:var(--bg-2)}.ProfileBarDropdown__title.m-arrow.m-opened::after,.ProfileBarDropdown__title.m-arrow::after,.TabMenu__tab.m-active::after{border-top-color:var(--fg-muted)}.comment .child{border-left:solid 5px var(--border-color)}.hover-bubble.anchor-right::after{border-left-color:var(--bg-2)}#liveupdate-statusbar.complete,success,success a{background-color:var(--bg-success);color:var(--fg-success)}.archived-infobar.with-icon::before,.content.submit .info-notice,.reddit-infobar,.reddit-infobar .md,info,info a{background-color:var(--bg-info);color:var(--fg-info)}.app-scope,warning{background-color:var(--bg-warning);color:var(--fg-warning)}error,error a{background-color:var(--bg-error);color:var(--fg-error)}disabled{background-color:var(--bg-disabled);color:var(--fg-disabled)}pre{background-color:var(--syntax-bg);color:var(--syntax-fg)}.infobar.profilebetabar,.organic-listing,.toc>ul{box-shadow:0 0 5px rgba(0,0,0,1)}.crosspost-preview,.listing-chooser li.selected{box-shadow:30px 0 30px -15px rgba(255,255,255,.1) inset,0 2px 6px -1px rgba(0,0,0,.2)}.goldvertisement,.report-flow-form.thing:hover{box-shadow:none;background-image:none}label.disabled{cursor:not-allowed}.subreddit-subscribe:before{filter:saturate(0) brightness(150%)}.subreddit-subscribe:hover:before{filter:saturate(100%)}.add-sr button.add,.multi-details button.add,.multi-details button.remove-sr.remove-sr,img[src*="start_chat.png"]{filter:invert(200%)}';

    const CSS_NO_ADS = '.goldvertisement, .thing.promoted, [id^="ad_"], #siteTable_organic {display:none!important}';
    const CSS_NO_CHAT = '#chat-app, #chat, #chat + span {display:none!important}';
    const CSS_NO_SUBLIST = '.sr-list > *:not(:first-child) {display:none!important}';
    const CSS_NO_FOOTER = '.footer, .footer-parent {display:none!important}';
    const CSS_NO_HEADER_IMAGE = '#header-img, .hohoho {display:none!important} body.with-listing-chooser #header .pagename{position:relative; bottom:0}';
    const CSS_COLLAPSE_SIDEBAR = '.side{position:absolute;transition:right .2s ease-in-out;box-shadow:-5px 0 3px 0 rgba(0,0,0,.1);padding-left:10px;right:-305px;width:300px;z-index:1}' +
                                 'body{overflow-x:hidden}' +
                                 '.side:hover{right:-5px}' +
                                 '.side .nub{opacity:0}' +
                                 '.side:hover .nub{opacity:1}';
    const CSS_DIM_GALLERY_NAV = '.gallery-nav-disabled{visibility:hidden}.media-gallery .gallery-nav-back{float:left;margin-left:20px;padding-left:20px}';

    // Existing values are the *default*
    const config = {
      subreddits: [],
      filteredSubreddits: {},
      texts: [],
      filteredTexts: {},
      theme: 'obsidian',
      nsfwFilterState: 'show',
      themes: {
        none: '',
        obsidian: ':root{--fg:#E0E2E4;--bg:#293134;--bg-odd:#303a3d;--fg-2:#678CB1;--bg-2:#3F4B4E;--fg-muted:#999;--fg-input:#A7CCF1;--bg-input:#293134;--fg-input-hover:#E0E2E4;--bg-input-hover:#536364;--border:solid 0.5px #678CB1;--border-color:#678CB1;--fg-link:#EC7600;--fg-link-hover:#FC8610;--fg-link-visited:#BA4400;--fg-disabled:#ddd;--bg-disabled:#777;--fg-error:#fff;--fg-warning:#000;--fg-info:#fff;--fg-success:#fff;--bg-error:#600;--bg-warning:#fa4;--bg-info:#14a;--bg-success:#151;--syntax-fg:#F1F2F3;--syntax-fg-2:#E8E2B7;--syntax-bg:#293134;--syntax-bg-2:#3F4B4E;--syntax-comment:#66747B;--syntax-builtin:#93C763;--syntax-function:#678CB1;--syntax-keyword:#7CCADD;--syntax-number:#FFCD22;--syntax-string:#EC7600;--syntax-font-family:"Menlo","Liberation Mono","Consolas","DejaVu Sans Mono","Ubuntu Mono","Courier New","andale mono","lucida console",monospace;--selection-fg:#000}',
        monokai:  ':root{--fg:#f8f8f2;--bg:#29281E;--bg-odd:#2f2f24;--fg-2:#66d9ef;--bg-2:#39382E;--fg-muted:#999;--fg-input:#fd971f;--bg-input:#2f2f24;--fg-input-hover:#fd971f;--bg-input-hover:#252520;--border:solid 0.5px #777;--border-color:#777;--fg-link:#f92672;--fg-link-hover:#d90652;--fg-link-visited:#fd971f;--fg-disabled:#ddd;--bg-disabled:#777;--fg-error:#fff;--fg-warning:#000;--fg-info:#fff;--fg-success:#fff;--bg-error:#600;--bg-warning:#fa4;--bg-info:#14a;--bg-success:#151;--syntax-fg:#f8f8f2;--syntax-fg-2:#f8f8f2;--syntax-bg:#272822;--syntax-bg-2:#373832;--syntax-comment:#75715e;--syntax-builtin:#f92672;--syntax-function:#a6e22e;--syntax-keyword:#76d9e6;--syntax-number:#ae81ff;--syntax-string:#e6db74;--syntax-font-family:"Menlo","Liberation Mono","Consolas","DejaVu Sans Mono","Ubuntu Mono","Courier New","andale mono","lucida console",monospace;--selection-fg:#000}',
        blue:     ':root{--fg:#ccc;--bg:#192833;--bg-odd:#243237;--fg-2:#F39200;--bg-2:#293843;--fg-muted:#999;--fg-input:#fff;--bg-input:#334247;--fg-input-hover:#fff;--bg-input-hover:#394853;--border:solid 0.5px #495863;--border-color:#495863;--fg-link:#28c;--fg-link-hover:#6cf;--fg-link-visited:#8af;--fg-disabled:#ddd;--bg-disabled:#777;--fg-error:#fff;--fg-warning:#000;--fg-info:#fff;--fg-success:#fff;--bg-error:#600;--bg-warning:#fa4;--bg-info:#14a;--bg-success:#151;--syntax-fg:#839496;--syntax-fg-2:#eee8d5;--syntax-bg:#002b36;--syntax-bg-2:#073642;--syntax-comment:#75715e;--syntax-builtin:#268bd2;--syntax-function:#cb4b16;--syntax-keyword:#b58900;--syntax-number:#6c71c4;--syntax-string:#2aa198;--syntax-font-family:"Menlo","Liberation Mono","Consolas","DejaVu Sans Mono","Ubuntu Mono","Courier New","andale mono","lucida console",monospace;--selection-fg:#000}',
        black:    ':root{--fg:#ccc;--bg:#101010;--bg-odd:#191919;--fg-2:#aab;--bg-2:#202020;--fg-muted:#999;--fg-input:#aaa;--bg-input:#000;--fg-input-hover:#fff;--bg-input-hover:#151515;--border:solid 0.5px #353535;--border-color:#353535;--fg-link:#369;--fg-link-hover:#47a;--fg-link-visited:#96a;--fg-disabled:#ddd;--bg-disabled:#777;--fg-error:#fff;--fg-warning:#000;--fg-info:#fff;--fg-success:#fff;--bg-error:#600;--bg-warning:#fa4;--bg-info:#14a;--bg-success:#151;--syntax-fg:#f5f5f5;--syntax-fg-2:#ffffff;--syntax-bg:#000000;--syntax-bg-2:#202020;--syntax-comment:#b0b0b0;--syntax-builtin:#fb0120;--syntax-function:#6fb3d2;--syntax-keyword:#d381c3;--syntax-number:#fc6d24;--syntax-string:#a1c659;--syntax-font-family:"Menlo","Liberation Mono","Consolas","DejaVu Sans Mono","Ubuntu Mono","Courier New","andale mono","lucida console",monospace;--selection-fg:#000}',
        dark:     ':root{--fg:#E0E2E4;--bg:#121212;--bg-odd:#303a3d;--fg-2:#678CB1;--bg-2:#232323;--fg-muted:#999;--fg-input:#A7CCF1;--bg-input:#293134;--fg-input-hover:#E0E2E4;--bg-input-hover:#536364;--border:solid 0.5px #678CB1;--border-color:#678CB1;--fg-link:hsla(0,0%,100%,0.8);--fg-link-hover:hsla(0,0%,100%,0.9);--fg-link-visited:hsla(0,0%,100%,0.7);--fg-disabled:#ddd;--bg-disabled:#777;--fg-error:#fff;--fg-warning:#000;--fg-info:#fff;--fg-success:#fff;--bg-error:#600;--bg-warning:#fa4;--bg-info:#14a;--bg-success:#151;--syntax-fg:#F1F2F3;--syntax-fg-2:#E8E2B7;--syntax-bg:#293134;--syntax-bg-2:#3F4B4E;--syntax-comment:#66747B;--syntax-builtin:#93C763;--syntax-function:#678CB1;--syntax-keyword:#7CCADD;--syntax-number:#FFCD22;--syntax-string:#EC7600;--syntax-font-family:"Menlo","Liberation Mono","Consolas","DejaVu Sans Mono","Ubuntu Mono","Courier New","andale mono","lucida console",monospace;--selection-fg:#000}'
      },
      tweaks: {
        autoAlign: true,
        infiniteScrolling: true,
        loadPostsInline: true,
        noAds: true,
        noChat: true,
        noSublist: true,
        noFooter: true,
        noHeaderImage: true,
        collapseSidebar:true
      },
      visitedThings: {}
    };

    return new Promise(resolve => {
      const keys = Object.keys(config);
      Promise.all(keys.map(key => GM.getValue('redditmod-' + key)))
        .then(values => {
          // Load config
          values.forEach((value, keyIndex) => {
            if (value !== undefined) {
              config[keys[keyIndex]] = JSON.parse(value);
            }
          });

          // Clear visited for the past day
          flushVisited();

          // Expose public methods
          resolve({
            getThemes, setTheme, getThemeCSS, getTheme,
            getTweaks, setTweak, getTweakCSS, isTweakEnabled,
            getSubreddits, setSubredditFilter, setAllSubredditFilters, isSubredditFiltered, removeSubreddit,
            getNsfwState, setNsfwState,
            getTexts, setTextFilter, isTextFiltered, removeText, shouldFilterTextblock,
            addVisitedThing, isVisited, flushVisited
          });
        });
    });

    /* optionalKey: if given, only saves that key of the config. */
    function _save(optionalKey) {
      const keys = optionalKey !== undefined ? [optionalKey] : Object.keys(config);
      return new Promise(resolve => {
        Promise.all(keys.map(key => GM.setValue('redditmod-' + key, JSON.stringify(config[key]))))
                .then(resolve);
      });
    }

    // ==============================================
    // Themes
    function getTheme() { return config.theme; }
    function getThemes() { return Object.keys(config.themes); }

    function setTheme(theme) {
      const promises = [];
      theme = (theme === undefined) ? 'none' : theme;
      if (config.theme !== theme) {
        config.theme = theme;
        promises.push(_save('theme'));
      }
      return Promise.all(promises);
    }

    function getThemeCSS() {
      if (config.theme === 'none' || config.themes[config.theme] === undefined) {
        return BASE_STYLE;
      } else {
        return config.themes[config.theme] + BASE_STYLE + THEMED_STYLE;
      }
    }

    // =========================================
    // Tweaks
    function isTweakEnabled(tweakID) { return (config.tweaks[tweakID] === true); }

    function getTweaks() {
      return [
        { name: 'Infinite Scrolling',    id: 'infiniteScrolling', enabled: config.tweaks.infiniteScrolling, title: "Load next page when you reach the bottom" },
        { name: 'Load Pages Inline',     id: 'loadPostsInline',   enabled: config.tweaks.loadPostsInline, title: "Add the next page of posts to the bottom of the current page (ignored when 'Infinite Scrolling' is enabled)." },
        { name: 'Auto-align on expand',  id: 'autoAlign',         enabled: config.tweaks.autoAlign, title: "Scroll so the clicked post is at the top of the screen." },
        { name: 'No Ads',                id: 'noAds',             enabled: config.tweaks.noAds, title: "Don't display ads disguised as posts" },
        { name: 'No Chat',               id: 'noChat',            enabled: config.tweaks.noChat, title: "Don't show anything related to Reddit's Chat feature" },
        { name: 'No Sublist',            id: 'noSublist',         enabled: config.tweaks.noSublist, title: "Don't show subreddit list at top of page" },
        { name: 'No Footer',             id: 'noFooter',          enabled: config.tweaks.noFooter, title: "Don't show footer at bottom of page" },
        { name: 'No Header Image',       id: 'noHeaderImage',     enabled: config.tweaks.noHeaderImage, title: "Don't show reddit icon at top of page" },
        { name: 'Collapse Sidebar',      id: 'collapseSidebar',   enabled: config.tweaks.collapseSidebar, title: "Hide the sidebar -- visible on hover" }
      ];
    }

    function getTweakCSS() {
      const results = [];
      if (config.tweaks.noAds)           { results.push(CSS_NO_ADS); }
      if (config.tweaks.noChat)          { results.push(CSS_NO_CHAT); }
      if (config.tweaks.noSublist)       { results.push(CSS_NO_SUBLIST); }
      if (config.tweaks.noFooter)        { results.push(CSS_NO_FOOTER); }
      if (config.tweaks.noHeaderImage)   { results.push(CSS_NO_HEADER_IMAGE); }
      if (config.tweaks.collapseSidebar) { results.push(CSS_COLLAPSE_SIDEBAR); }
      results.push(CSS_DIM_GALLERY_NAV);
      return results.join('');
    }

    function setTweak(tweakID, enabled) {
      const promises = [];
      config.tweaks[tweakID] = enabled;
      promises.push(_save('tweaks'));
      return Promise.all(promises);
    }

    // ==============================================
    // Subreddit Filters
    function getSubreddits() { return config.subreddits; }
    function isSubredditFiltered(subreddit) { return (config.filteredSubreddits[subreddit] === true); }

    function setAllSubredditFilters(enabled) {
      config.subreddits.forEach(subreddit => {
        config.filteredSubreddits[subreddit] = enabled;
      });
      return _save('filteredSubreddits');
    }

    function setSubredditFilter(subreddit, enabled) {
      const promises = [];
      if (!config.subreddits.includes(subreddit)) {
        config.subreddits.push(subreddit);
        promises.push(_save('subreddits'));
      }
      if (config.filteredSubreddits[subreddit] !== enabled) {
        config.filteredSubreddits[subreddit] = enabled;
        promises.push(_save('filteredSubreddits'));
      }
      return Promise.all(promises);
    }

    function removeSubreddit(subreddit) {
      const promises = [];
      if (config.subreddits.includes(subreddit)) {
        config.subreddits = config.subreddits.filter(sub => subreddit !== sub);
        promises.push(_save('subreddits'));
      }
      Promise.all(promises);
    }

    // ==============================================
    // Text Filters
    function getTexts() { return config.texts; }
    function isTextFiltered(text) { return config.filteredTexts[text] === true; }

    function shouldFilterTextblock(textblock) {
      const reasons = [];
      Object.keys(config.filteredTexts).forEach(filteredText => {
        if (isTextFiltered(filteredText) && textblock.toLowerCase().includes(filteredText.toLowerCase())) {
          reasons.push('TEXT("' + filteredText + '")');
        }
      });
      return reasons.length === 0 ? false : reasons.join(', ');
    }

    function setTextFilter(text, enabled) {
      const promises = [];
      if (!config.texts.includes(text)) {
        config.texts.push(text);
        promises.push(_save('texts'));
      }
      if (config.filteredTexts[text] !== enabled) {
        config.filteredTexts[text] = enabled;
        promises.push(_save('filteredTexts'));
      }
      return Promise.all(promises);
    }

    function removeText(text) {
      const promises = [];
      if (config.texts.includes(text)) {
        config.texts = config.texts.filter(txt => text !== txt);
        promises.push(_save('texts'));
      }
      Promise.all(promises);
    }

    // ==============================================
    // Nsfw Filter
    function getNsfwState() {
      return config.nsfwFilterState;
    }

    function setNsfwState(state) {
      config.nsfwFilterState = state;
      return _save('nsfwFilterState');
    }

    // ==============================================
    // Visited
    function addVisitedThing(thingId) {
      config.visitedThings[thingId] = new Date().getTime();
      return _save('visitedThings');
    }

    function isVisited(thingId) {
      return config.visitedThings[thingId] > 0;
    }

    function flushVisited() {
      const yesterday = new Date().getTime() - 86400000;
      Object.entries(config.visitedThings)
        .filter(([thingId, timestamp]) => (timestamp < yesterday))
        .forEach(([thingId, timestamp]) => {
          delete config.visitedThings[thingId];
        });
      return _save('visitedThings');
    }

  })();

  /**
   * All things CSS & DOM (applying/removing CSS rules, waiting for DOM elements);
   */
  const CSS = (() => {
    const onHead = _onNode('head'); /* Wait for <head> to appear. */
    const onBody = _onNode('body'); /* Wait for <body> to appear. */

    return {onDOM, onHead, applyStyle, removeStyle};

    /** Promises a child node immediately under the root `document`. Waits if node is not found. */
    function _onNode(documentKey) {
      return new Promise(resolve => {
        const timer = setInterval(promiseNode, 50);
        function promiseNode() {
          if (document[documentKey]) {
            clearInterval(timer);
            resolve(document[documentKey]);
          }
        }
      });
    }

    /** Promises /when/ the DOM is loaded & ready. */
    function onDOM() {
      return new Promise(resolve => {
        if (document.readyState === 'interactive' || document.readyState === 'complete') {
          resolve();
        } else {
          document.addEventListener('DOMContentLoaded', function(event) {
            document.removeEventListener('DOMContentLoaded', event.callee);
            resolve();
          });
        }
      });
    }

    /**
     * Waits for <head> to appear, then applies CSS rules to the page.
     * Removes existing CSS Rules that match the given ID.
     * @param {String} id The identifier for this style.
     * @param {String} css The CSS rules in text/string format.
     * @return Promise for when style is applied.
     */
    function applyStyle(id, css) {
      return new Promise(resolve => {
        onHead.then(head => {
          let style = head.querySelector('.redditmod-style#' + id);
          if (style !== null && style.firstChild) {
            style.removeChild(style.firstChild);
          } else {
            style = document.createElement('style');
            Object.assign(style, { id:id, type:'text/css', className:'redditmod-style' });
          }
          style.appendChild(document.createTextNode(css));
          head.appendChild(style);
          resolve(head);
        });
      });
    }

    /** @param {String} id The style ID, set when `applyStyle` is called. */
    function removeStyle(id) {
      const style = document.head.querySelector('style#' + id);
      if (style) style.parentNode.removeChild(style);
    }
  })();


  /** */
  const MENU = (() => {
    const MENU_STYLE_ID = 'redditmod-menu-style';
    const MENU_STYLE = '.redditmod-menu-header{margin:3px 5px 3px 5px}';

    let isInitialized = false;
    let config;
    return {init};

    function init(theConfig) {
      config = theConfig;
      return new Promise(resolve => {
        if (isInitialized) {
          resolve({updateMenuSection});
        } else {
          CSS.onDOM().then(() => {
            resetMenu();
            CSS.applyStyle(MENU_STYLE_ID, MENU_STYLE);
            isInitialized = true;
            resolve({updateMenuSection});
          });
        }
      });
    }

    function resetMenu() {
      const menu = document.querySelector('.dropdown.srdrop .selected');
      if (menu) menu.textContent = 'OPTIONS';
      const dropdown = document.querySelector('.drop-choices.srdrop');
      if (dropdown) dropdown.innerHTML = '';
    }

    function create(tag, props, parentToAppendTo) {
      const node = document.createElement(tag);
      if (props) Object.assign(node, props);
      if (parentToAppendTo) parentToAppendTo.appendChild(node);
      return node;
    }

    function updateMenuSection(title, id, anchorsProps) {
      const dropdown = document.querySelector('.drop-choices.srdrop');
      if (!dropdown) return;

      if (document.querySelector('.drop-choices.srdrop .redditmod-menu-header') !== null && document.querySelector('#' + id) === null) {
        create('hr',  {className:'redditmod-menu-spacer'}, dropdown);
      }

      const section = document.querySelector('#' + id) || create('div', {id}, dropdown);
      const header  =  section.querySelector('.redditmod-menu-header') || create('h3',  {className:'redditmod-menu-header'}, section);
      const links   =  section.querySelector('.redditmod-menu-links')  || create('div', {className:'redditmod-menu-links'},  section);

      header.textContent = title;
      links.innerHTML = '';
      anchorsProps.forEach(props => {
        if (!props.href) props.href = '#';
        create('a', props, links).className = 'choice';
      });
    }
  })();

  const MEDIA = (() => {
    const CLASS_MEDIA_EXPANDED = 'redditmod-media-expanded',
          CLASS_COMMENTS_EXPANDED = 'redditmod-comments-expanded',
          CLASS_MEDIABOX = 'redditmod-media-box',
          CLASS_COMMENTS = 'redditmod-comments-box',
          CLASS_MEDIA    = 'redditmod-media',
          CLASS_SPINNER  = 'redditmod-media-spinner',
          CLASS_ERROR    = 'redditmod-media-error',
          MEDIA_STYLE_ID = 'redditmod-media-style',
          MEDIA_STYLE_CSS = '.redditmod-media-box, .redditmod-comments-box{max-height:0; height:0; overflow:hidden; transition: height linear 0.2s, max-height linear 0.2s}' +
                            '.redditmod-media{}' + // ???
                            '.redditmod-media-expanded .redditmod-media-box, .redditmod-comments-expanded .redditmod-comments-box{max-height:10000px; height:auto}' +
                            '.redditmod-media-spinner,.redditmod-media-spinner:after{border-radius:50%;width:10em;height:10em}.redditmod-media-spinner{margin:60px auto;font-size:10px;position:relative;text-indent:-9999em;border-top:1.1em solid rgba(255,255,255,.2);border-right:1.1em solid rgba(255,255,255,.2);border-bottom:1.1em solid rgba(255,255,255,.2);border-left:1.1em solid #fff;-webkit-transform:translateZ(0);-ms-transform:translateZ(0);transform:translateZ(0);-webkit-animation:load8 1.1s infinite linear;animation:load8 1.1s infinite linear}@-webkit-keyframes load8{0%{-webkit-transform:rotate(0);transform:rotate(0)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}@keyframes load8{0%{-webkit-transform:rotate(0);transform:rotate(0)}100%{-webkit-transform:rotate(360deg);transform:rotate(360deg)}}' +
                            '.redditmod-media-error{background-color:rgba(255,0,0,0.3); color:#fff; text-shadow:1px 1px #000}';

    CSS.applyStyle(MEDIA_STYLE_ID, MEDIA_STYLE_CSS);

    return {postClick};

    function postClick(thing, event) {
      const target = event.target;
      const thingAnchor = thing.querySelector('a.title');
      const thingHref = thing.getAttribute('data-url');
      const thingUrl = thingHref || thingAnchor && thingAnchor.href;

      if (!thing.classList.contains('redditmod-visited')) {
        thing.classList.add('redditmod-visited');
        CONFIG.then(config => config.addVisitedThing(thing.dataset.fullname));
      }

      if (target.classList.contains('gallery-navigation')) {
        return true;
      } else if (target.tagName === 'IMG') {
        if (target.parentNode.tagName === 'A' && target.parentNode.classList.contains('gallery-item-thumbnail-link')) {
          if (target.hasAttribute('oldwidth')) {
            return true;
          } else {
            var href = target.parentNode.getAttribute('href');
            href = href.replace('preview.redd.it', 'i.redd.it');
            href = href.replace(/\?.*/g, '');
            target.parentNode.setAttribute('href', href);
            target.src = href;
            target.setAttribute('oldwidth', target.width);
            target.setAttribute('oldheight', target.height);
            target.removeAttribute('width');
            target.removeAttribute('height');
          }
        }
        event.stopPropagation();
        event.preventDefault();
        return false;
      } else if (target.tagName === 'A' && target.classList.contains('comments')) {
        stopEvent(event);
        _fetchCommentsbox(thing, target.href)._toggle();
        return false;

      } else if (_shouldUseExpando(thing, thingUrl)) {
        if (target.classList.contains('expando-button')) {
          return true;
        }
        const expandoButton = thing.querySelector('.expando-button');
        if (expandoButton) {
          expandoButton.click(event);
          return false;
        }
        else {
          const commentTarget = thing.querySelector('.comments');
          if (commentTarget) {
            _fetchCommentsbox(thing, commentTarget.href)._toggle();
          }
        }
        return true;

      } else if ((target.tagName === 'A') ||
                 (target.tagName === 'VIDEO' && target.controls === 'true') ||
                 (target.classList.contains('expando-button'))) {
        return true; // Pass-through

      } else {
        _fetchMediabox(thing, thingUrl).click(event); // Fetch/Contruct mediabox & click it.
        return false;
      }
    }

    function _shouldUseExpando(thing, thingUrl) {
      var result = false;
      if (thing.classList.contains('self')) {
        result = true;
      } else if (/https?:\/\/(\w+\.)*(v\.redd\.it|clips\.twitch\.tv|reddituploads\.com|vimeo\.com|youtube\.com|youtu\.be|old\.reddit\.com|reddit.com)\/.*$/.test(thingUrl)) {
        result = true;
      } else if (/$\/r\/.*$/.test(thingUrl)) {
        result = true;
      }
      debug('_shouldUseExpando(thing=' + thing + ', thingUrl=' + thingUrl + ') = ' + result);
      return result;
    }

    function _fetchCommentsbox(thing, thingUrl) {
      const existing = thing.querySelector('.' + CLASS_COMMENTS);
      if (existing) {
        return existing;
      }

      const commentsBox = _create('div', {className:CLASS_COMMENTS}, thing);
      commentsBox.onclick = stopEvent;
      commentsBox._toggle = () => {
        thing.classList.remove(CLASS_MEDIA_EXPANDED);
        thing.classList.toggle(CLASS_COMMENTS_EXPANDED);
      };

      const spinner = _create('div', {className:CLASS_SPINNER}, commentsBox);
      RedditCommentsPromise(thingUrl)
        .then(container => {
          commentsBox.removeChild(spinner);
          commentsBox.appendChild(container);
        }).catch(reason => {
          debug('RedditCommentsPromise rejected, reason:', reason);
        });

      return commentsBox;
    }

    function _fetchMediabox(thing, thingUrl) {
      // Use existing mediabox
      const existingMediabox = thing.querySelector('.' + CLASS_MEDIABOX);
      if (existingMediabox) return existingMediabox;

      // Create a custom mediabox
      const mediaBox = _create('div', {className:CLASS_MEDIABOX}, thing);
      mediaBox.onclick = event => {
        stopEvent(event);
        thing.classList.remove(CLASS_COMMENTS_EXPANDED);
        thing.classList.toggle(CLASS_MEDIA_EXPANDED);
        const media = thing.querySelector('.' + CLASS_MEDIA);
        if (thing.classList.contains(CLASS_MEDIA_EXPANDED)) {
          if (media && media._onshow) media._onshow();
        } else {
          if (media && media._onhide) media._onhide();
        }
        CONFIG.then(config => {
          if (config.isTweakEnabled('autoAlign')) {
            thing.scrollIntoView({block: 'start', inline: 'nearest', behavior:'smooth'});
          }
        })
      };

      const spinner = _create('div', {className:CLASS_SPINNER}, mediaBox);

      mediaBoxPromise(thingUrl)
        .then(media => {
          media.classList.add(CLASS_MEDIA);
          mediaBox.removeChild(spinner);
          mediaBox.appendChild(media);
        }).catch(reason => {
          debug('mediaboxPromise rejected, reason:', reason);
          mediaBox.removeChild(spinner);
          const errorBox = _create('div', {className:CLASS_ERROR}, mediaBox);
          errorBox.textContent = reason;
        });
      return mediaBox;
    }

    function mediaBoxPromise(urlText) {
      return new Promise((resolve, reject) => {
        const url = new URL(urlText);
        const domain = url.hostname.replace(/^(?:.*\.)?(\w+\.\w+)$/, '$1');
        let promise;
        switch(domain) {
          case 'imgur.com':      promise = ImgurMediaPromise(url);   break;
          case 'gfycat.com':     promise = GfycatMediaPromise(url);  break;
          case 'soundcloud.com': promise = SoundcloudPromise(url);   break;
          case 'explosm.net':    promise = ExplosmPromise(url);      break;
          case 'imgflip.com':    promise = ImgflipPromise(url);      break;
          case 'streamable.com': promise = StreamablePromise(url);   break;
          case 'instagram.com':  promise = InstagramPromise(url);    break;
          case 'deviantart.com': promise = DeviantartPromise(url);   break;
          case 'xkcd.com':       promise = XkcdPromise(url);         break;
          case 'redgifs.com':    promise = RedgifsPromise(url);      break;
          case 'reddit.com':     promise = RedditPromise(url);       break;
          default:               promise = GenericMediaPromise(url); break;
        }
        promise.then(resolve).catch(reject);
      });
    }

    function _create(tag, props, parentNode) {
      const node = document.createElement(tag);
      if (props) {
        Object.assign(node, props);
      }
      if (parentNode) {
        parentNode.appendChild(node);
      }
      return node;
    }

    function _getJSON(url, headers, use_GM_XHR) {
      return new Promise((resolve, reject) => {
        if (!headers) {
          headers = {'Accept': 'application/json'};
        } else if (!headers.Accept) {
          headers.Accept = 'application/json';
        }
        _getWEB(url, headers, use_GM_XHR)
          .then(responseText => {
            try {
              resolve(JSON.parse(responseText));
            } catch (err) {
              debug('_getJSON error. url:', url.toString(), 'responseText', responseText);
              reject('[MEDIA._getJSON] Error parsing JSON text from ' + url.toString() + ' : ' + responseText);
            }
          })
          .catch(reason => {
            reject('[Media._getJSON] Error fetching JSON from url ' + url.toString() + ' reason: ' + reason);
          });
      });
    }

    function _getWEB(url, headers, use_GM_XHR) {
      return new Promise(function(resolve, reject) {
        if (!headers) {
          headers = {};
        }
        if (use_GM_XHR) {
          debug('MEDIA._getWEB() via GM.xmlHttpRequest(), fetching url:', url, 'with headers', headers);
          GM.xmlHttpRequest({
            method: 'GET',
            url: url,
            headers: headers,
            onabort: onError,
            onerror: onError,
            onload: function(response) {
              debug('MEDIA._getWEB() got GM.xmlHttpRequest response (' + response.responseText.length.toLocaleString() + ' bytes)');
              resolve(response.responseText);
            }
          });
        } else {
          debug('MEDIA._getWEB() via XMLHttpRequest(), fetching url:', url, 'with headers', headers);
          const xhr = new XMLHttpRequest();
          xhr.onload = function(response) {
            debug('MEDIA._getWEB() got response (' + response.target.responseText.length.toLocaleString() + ' bytes)');
            resolve(response.target.responseText);
          };
          xhr.onerror = onError;
          xhr.onabort = onError;
          xhr.open('GET', url, true);
          Object.keys(headers).forEach(key => {
            xhr.setRequestHeader(key, headers[key]);
          });
          xhr.send(null);
        }

        function onError(reason) {
          debug('MEDIA._getWEB error. url:', url.toString(), 'reason:', reason);
          reject('[MEDIA._getWEB] Error fetching data from ' + url + ' Reason: ' + reason.error);
        }
      });
    }

    function _getDocument(url, headers, use_GM_XHR) {
      return new Promise((resolve, reject) => {
        _getWEB(url, headers, use_GM_XHR)
          .then(responseText => {
            const html = document.createElement('html');
            html.innerHTML = responseText;
            resolve(html);
          })
          .catch(reject);
      });
    }

    function GenericMediaPromise(url) {
      return new Promise((resolve, reject) => {
        const urlText = url.toString();
        if (/\.(jpe?g|gif|png|mp4)(\?.*)?$/i.test(urlText)) {
          GenericImagePromise([urlText]).then(resolve).catch(reject);
        } else {
          PostlightMediaPromise(urlText).then(resolve).catch(reject);
        }
      });
    }

    function PostlightMediaPromise(url) {
      return new Promise((resolve, reject) => {
        const postlightUrl = 'https://mercury.postlight.com/parser?url=' + encodeURIComponent(url);
        const headers = {'X-api-key': 'NtFdFjTYzQXF4WUWBivfsnTj0zXZyvwCKbSQeuAB'};
        _getJSON(postlightUrl, headers, true)
          .then(resp => {
            if (resp.content === '<body></body>') {
              reject('[PostlightMediaProimse] Postlight returned empty content for ' + url);
            } else {
              resolve(_create('div', {innerHTML:resp.content, className:'redditmod-media-other'}));
            }
          })
          .catch(reject);
      });
    }

    function GenericImagePromise(urls) {
      return new Promise((resolve, reject) => {
        if (urls.length === 0) {
          debug('GenericImagePromise error. No URLs given:', urls);
          reject('[GenericImagePromise] No URLs given');
          return;
        }
        let index = 0;
        const container   = _create('div');
        const nav         = _create('div',  {}, container);
        const navPrev     = _create('a',    {textContent:'<',href:'#'}, nav);
        const navCurrent  = _create('span', {textContent:'1'}, nav);
        const navSep      = _create('span', {textContent:'/'}, nav);
        const navTotal    = _create('span', {textContent:urls.length}, nav);
        const navNext     = _create('a',    {textContent:'>',href:'#'}, nav);
        const imageDiv    = _create('div',  {}, container);
        const image       = _create('img',  {
          src: urls[0],
          style: 'max-width:100%; max-height:100%; object-fit:scale-down'
        }, imageDiv);
        if (urls.length === 1) {
          nav.style.display = 'none';
        } else {
          container._click = navNext.click;
        }
        navPrev.onclick = event => {
          stopEvent(event);
          if (--index < 0) index = urls.length - 1;
          navCurrent.textContent = (index + 1).toString().padStart(urls.length.toString().length, '0');
          image.removeAttribute('src');
          image.src = urls[index];
          return false;
        };
        navNext.onclick = event => {
          stopEvent(event);
          if (++index === urls.length) index = 0;
          navCurrent.textContent = (index + 1).toString().padStart(urls.length.toString().length, ' ');
          image.removeAttribute('src');
          setTimeout(() => {
            image.src = urls[index];
          }, 10);
          return false;
        };
        resolve(container);
      });
    }

    function GenericVideoPromise(urls) {
      return new Promise(resolve => {
        const video = _create('video', {
          controls: false,
          autoplay: true,
          loop: true,
          style: 'display:block; width:' + (window.innerWidth-75) + 'px; height:' + (window.innerHeight-75) + 'px',
        });
        video._onhide = video.pause;
        video._onshow = video.load;
        urls.forEach(url => _create('source', {src:url}, video));
        resolve(video);
      });
    }

    function ImgurMediaPromise(url) {
      return new Promise((resolve, reject) => {
        let urlText = url.toString();
        const albumIdMatches = urlText.match(/imgur\.com\/(?:gallery|a|r\/[^\/]+)\/(\w+)/i);
        debug('ImgurMediaPromise: url: ' + url + ', albumIdMatches:', albumIdMatches);
        if (albumIdMatches) {
          // Album: Extract images
          _getJSON('https://imgur.com/ajaxalbums/getimages/' + albumIdMatches[1] + '/hit.json', {}, true)
            .then(resp => {
              if (!resp.data.images) {
                debug('ImgurMediaPromise: No resp.data.images, assuming single image:', albumIdMatches[1] + '.jpg');
                GenericImagePromise(['https://i.imgur.com/' + albumIdMatches[1] + '.jpg']).then(resolve).catch(reject);
              } else {
                debug('ImgurMediaPromise: Got ' + resp.data.images.length + ' images from album');
                GenericImagePromise(resp.data.images.map(image => 'https://i.imgur.com/' + image.hash + image.ext)).then(resolve).catch(reject);
              }
            });
        } else if (/\.(gifv?|mp4)$/.test(url)) {
          // Video
          debug('ImgurMediaPromise: gifv/mp4');
          urlText = urlText.replace(/\.gifv?$/, '.mp4');
          GenericVideoPromise([urlText]).then(resolve).catch(reject);
        } else {
          // Image?
          urlText = urlText.replace(/[^/]*\.imgur\.com/, 'i.imgur.com');
          urlText = urlText.replace(/\/\w+\//, '');
          urlText = urlText.replace(/_[a-z]\./, '.');
          urlText = urlText.replace(/\.(gif|jpg|jpeg|png)$/i, '');
          urlText = urlText + '.jpg';
          debug('ImgurMediaPromise: Unknown type, generated/mangled URL:', urlText);
          GenericImagePromise([urlText]).then(resolve).catch(reject);
        }
      });
    }

    function GfycatMediaPromise(url) {
      return new Promise((resolve, reject) => {
        let gfycatUrl = url.href;
        const shortCode = url.href.match(/gfycat\.com\/(?:.*\/)?([a-z0-9]*)/i);
        if (shortCode) {
            gfycatUrl = 'https://gfycat.com/' + shortCode[1];
        }
        _getDocument(gfycatUrl, {}, true)
          .then(doc => {
            let video = doc.querySelector('#mp4Source');
            if (!video) {
              video = doc.querySelector('.video.media source[type="video/mp4"]');
            }
            if (!video || !video.src) {
              reject('[GfycatMediaPromise] Could not find video at ' + gfycatUrl + ' body: ' + doc.innerHTML);
            } else {
              GenericVideoPromise([video.src]).then(resolve);
            }
          })
          .catch(reject);
      });
    }

    function RedgifsPromise(url) {
      debug('RedgifsPromise(url);', url);
      return new Promise((resolve, reject) => {
        let redgifsUrl = url.href;
        _getDocument(redgifsUrl, {}, true)
          .then(doc => {
            let source = doc.querySelector('meta[property="og:video"]');
            debug('[RedgifsPromise] source =', source);
            if (!source) {
              reject('[RedgifsPromise] Could not find video at ' + redgifsUrl + ' body: ' + doc.innerHTML);
            } else {
              debug('[RedgifPromise] source.content =', source.content);
              GenericVideoPromise([source.content]).then(resolve);
            }
          })
          .catch(reject);
      });
    }

    function RedditPromise(url) {
      const urlText = url.toString();
      return new Promise((resolve, reject) => {
        if (/reddit\.com.*\/comments\/.*/.test(urlText)) {
          RedditCommentsPromise(urlText).then(resolve).catch(reject);
        } else {
          debug('RedditPromise error. Unable to load non-comments Reddit page', urlText);
          reject('[RedditPromise] Unable to load non-comments Reddit page ' + urlText);
        }
      });
    }

    function RedditCommentsPromise(url) {
      return new Promise((resolve, reject) => {
        _getDocument(url, {}, false)
          .then(doc => {
            const commentArea = doc.querySelector('.commentarea .sitetable');
            const container = _create('div', {className:'redditmod-media-comments-area'});
            commentArea.querySelectorAll('.entry').forEach(entry => {
              entry.onclick = event => {
                if (event && event.target && event.target.tagName === 'A') {
                  return true; // Pass-through
                } else {
                  // Expand/collapse comment tree
                  stopEvent(event);
                  entry.querySelector('a.expand').click();
                  return false;
                }
              };
            });
            container.appendChild(commentArea);
            container._click = () => {};
            resolve(container);
          })
          .catch(reject);
      });
    }

    function SoundcloudPromise(url) {
      return new Promise((resolve, reject) => {
        _getWEB(url.toString(), {}, true)
          .then(responseText => {
            let matches = responseText.match(/meta itemprop="embedUrl" content="([^"]*)"/);
            if (!matches) {
              matches = responseText.match(/meta property="twitter:player" content="([^"]*)"/);
            }
            if (matches && matches.length > 0) {
              const iframe = _create('iframe', {
                style: 'width:100%; height:' + (window.innerHeight / 2) + 'px',
                src: matches[1]
              });
              resolve(iframe);
            } else {
              reject('[SoundcloudPromise] No soundcloud data found at ' + url.toString());
            }
          })
          .catch(reject);
      });
    }

    function ExplosmPromise(url) {
      return new Promise(function(resolve, reject) {
        _getDocument(url.toString(), {}, true)
          .then(doc => {
            const imageMeta = doc.querySelector('img#main-comic');
            if (imageMeta) {
              GenericImagePromise([imageMeta.src]).then(resolve, reject);
            } else {
              reject('[ExplosmPromise] No images found at ' + url.toString());
            }
          })
          .catch(reject);
      });
    }

    function ImgflipPromise(url) {
      return new Promise(function(resolve, reject) {
        const urlText = url.toString();
        if (/\.(jpg|jpeg|png)$/i.test(urlText)) {
          GenericImagePromise([urlText]).then(resolve).catch(reject);
        }
        _getDocument(urlText, {}, true)
          .then(doc => {
            const imageMeta = doc.querySelector('img#im');
            if (imageMeta) {
              GenericImagePromise([imageMeta.src]).then(resolve, reject);
            } else {
              reject('[ImgflipPromise] No images found at ' + urlText);
            }
          })
          .catch(reject);
      });
    }

    function StreamablePromise(url) {
      return new Promise((resolve, reject) => {
        const matches = url.href.match(/streamable\.com\/([a-zA-Z0-9]*)/);
        if (!matches) reject('[StreamablePromise] No Streamable ID found in url ' + url.toString());
        const apiUrl = 'https://api.streamable.com/videos/' + matches[1];
        _getJSON(apiUrl, {}, true)
          .then(json => {
            GenericVideoPromise([json.files.mp4.url]).then(resolve, reject);
          }).catch(reject);
      });
    }

    function InstagramPromise(url) {
      const urlText = url.toString();
      const matches = urlText.match(/instagram\.com\/p\/([a-zA-Z0-9_\-]*)/);
      const apiUrl = 'https://instagram.com/p/' + matches[1] + '/';
      return new Promise((resolve, reject) => {
        if (!matches) {
          reject('[InstagramPromise] InstagramPromise error. No images found at', urlText);
          return;
        }
        _getDocument(apiUrl, {}, true).then(doc => {
          const videoMeta = doc.querySelector('meta[property="og:video"]');
          const imageMeta = doc.querySelector('meta[property="og:image"]');
          if (videoMeta) {
            GenericVideoPromise([videoMeta.content]).then(resolve, reject);
          } else if (imageMeta) {
            GenericImagePromise([imageMeta.content]).then(resolve, reject);
          } else {
            reject('[InstagramPromise] Error: No images found at ' + apiUrl);
          }
        }).catch(reject);
      });
    }

    function DeviantartPromise(url) {
      return new Promise(function(resolve, reject) {
        _getDocument(url.toString(), {}, true).then(doc => {
          const fullImg = doc.querySelector('img[dev-content-full]');
          const smallImg = doc.querySelector('meta[property="og:image"]');
          if (fullImg) {
            GenericImagePromise([fullImg.src]).then(resolve, reject);
          } else if (smallImg) {
            GenericImagePromise([smallImg.content]).then(resolve, reject);
          } else {
            reject('[DeviantartPromise] Error: No images found at ' + url.toString());
          }
        }).catch(reject);
      });
    }

    function XkcdPromise(url) {
      return new Promise((resolve, reject) => {
        const matches = url.href.match(/xkcd\.com\/([0-9]+)/);
        if (matches) {
          _getJSON("https://xkcd.com/" + matches[1] + "/info.0.json", {}, true).then(json => {
            const xkcdDiv = document.createElement("div");
            const h3 = document.createElement("h3");
            const img = document.createElement("img");
            const h5 = document.createElement("h5");
            h3.textContent = json.title;
            img.src = json.img;
            img.title = json.alt;
            h5.textContent = json.alt;
            xkcdDiv.appendChild(h3);
            xkcdDiv.appendChild(img);
            xkcdDiv.appendChild(h5);
            resolve(xkcdDiv);
          }).catch(reject)
        } else if (/\.(png|gif|jpe?g)$/i.test(url.href)) {
          GenericImagePromise([url.toString()]).then(resolve).catch(reject);
        } else {
          reject('Failed to find XKCD metadata from ' + url.toString());
        }
      });
    }
  })();

  function Filters(config, menuPromise) {
    const CLASS_PROCESSED = 'redditmod-thing-processed';
    const CLASS_FILTERED = 'redditmod-thing-filtered';

    // CSS specific to filtering
    const CSS_FILTER = '' +
      '.redditmod-thing-filtered {' +
        'margin:0!important;' +
        'padding:0!important;' +
        'max-height:0!important;' +
        'overflow:hidden!important;' +
        'background-color:var(--bg)' +
      '}' +
      '.thing {' +
        'transition:background-color linear 0.2s' +
      '}' +
      '.redditmod-filter-subreddit-button {' +
        'border:none;' +
        'background-color:var(--fg-link);' +
        'color:var(--bg)!important;' +
        'font-weight:900;' +
        'border-radius:15px;' +
        'padding:0 1.9px .5px;' +
        'margin-left:5px' +
      '}' +
      '.redditmod-filter-subreddit-button:hover {' +
        'text-decoration:none!important;' +
        'box-shadow: 0 0 5px rgba(0,0,0,0.5)' +
      '}';

    // Only apply filters on URLs that match:
    const URL_FILTER_REGEX = /^.*\/r\/(all|popular)\/.*$/i;
    const filters = {};

    return new Promise(resolve => {
      CSS.applyStyle('redditmod-thing-style', CSS_FILTER);
      menuPromise.then(menu => {
        filters.nsfw = NsfwFilter(menu);
        filters.text = TextFilter(menu);
        filters.subreddit = SubredditFilter(menu);
        processPosts();
        resolve({filters, processPost, processPosts});
      });
    });

    function processPosts() {
      document.querySelectorAll('#siteTable .thing').forEach(thing => processPost(thing));
    }

    function processPost(thing) {
      if (!thing.classList.contains(CLASS_PROCESSED)) {
        thing.classList.add(CLASS_PROCESSED);
        filters.subreddit.addFilterButton(thing);

        // Hide/Show media when post is clicked
        thing.addEventListener('click', event => MEDIA.postClick(thing, event));

        // Visited
        if (config.isVisited(thing.dataset.fullname)) {
          thing.classList.add('redditmod-visited');
        }

        // Remove tracking from links if user did not specify in preferences.
        thing.querySelectorAll('a[data-outbound-url], a[data-outbound-expiration], a[data-inbound-url]')
          .forEach(anchor => {
            if (anchor.dataset) {
              if (anchor.dataset.outboundUrl) delete anchor.dataset.outboundUrl;
              if (anchor.dataset.outboundExpiration) delete anchor.dataset.outboundExpiration;
              if (anchor.dataset.inboundUrl) delete anchor.dataset.inboundUrl;
            }
          });
      }

      if (_shouldFilterThisPage()) {
        const reasons = [];
        const activeFilters = Object.entries(filters).map(
            ([name, filter]) => {
              const filterReason = filter.shouldFilter(thing);
              if (filterReason !== false) {
                reasons.push(filterReason);
              }
            });

        if (reasons.length > 0 && !thing.classList.contains(CLASS_FILTERED)) {
          thing.classList.add(CLASS_FILTERED);
        } else if (reasons.length === 0 && thing.classList.contains(CLASS_FILTERED)) {
          thing.classList.remove(CLASS_FILTERED);
        }
      }
    }

    function _shouldFilterThisPage() {
      return URL_FILTER_REGEX.test(window.location.pathname);
    }

    ///////////////////////////////////////////
    function NsfwFilter(menu) {
      updateMenu();
      return {shouldFilter};

      function shouldFilter(thing) {
        const state = config.getNsfwState();
        const isOver18 = thing.classList.contains('over18');
        let reason = false;
        if (state === 'hide' && isOver18) {
          reason = 'NSFW';
        } else if (state === 'always' && !isOver18) {
          reason = 'Not NSFW';
        }
        return reason;
      }

      function updateMenu() {
        const submenus = [_nsfwMenu('hide'), _nsfwMenu('show'), _nsfwMenu('always')];
        menu.updateMenuSection('nsfw filter', 'redditmod-menu-filter-nsfw', submenus);
      }

      // `verb` is either "hide" or "show"
      function _nsfwMenu(state) {
        const currentState = config.getNsfwState();
        const isChecked = currentState === state;

        let msg;
        switch (state) {
          case 'hide':
            msg = 'hide all nsfw posts';
            break;
          case 'show':
            msg = 'allow nsfw posts';
            break;
          case 'always':
            msg = 'only show nsfw posts';
            break;
        }
        return {
          href:'#',
          innerHTML: (isChecked ? '&#9745; ' : '&#9744; ') + msg,
          onclick: _onNsfwMenuClick
        };
        function _onNsfwMenuClick(event) {
          stopEvent(event);
          config.setNsfwState(state);
          updateMenu();
          processPosts();
        }
      }
    }

    ///////////////////////////////////////////
    function SubredditFilter(menu) {
      updateMenu();
      return {shouldFilter, addFilterButton};

      function addFilterButton(thing) {
        const subreddit = thing && thing.dataset && thing.dataset.subreddit;
        const subredditLink = thing.querySelector('a.subreddit');
        if (!subreddit || !subredditLink) return;
        const filterButton = document.createElement('a');
        Object.assign(filterButton, {
          innerHTML: '&times;',
          href: '#',
          className: 'redditmod-filter-subreddit-button',
          title: 'Filter /r/' + subreddit + ' from appearing',
          onclick: event => _toggleSubreddit(subreddit, event)
        });
        subredditLink.parentNode.appendChild(filterButton);
      }

      function shouldFilter(thing) {
        let reason = false;
        if (config.isSubredditFiltered(thing.dataset.subreddit)) {
          reason = 'SUBREDDIT';
        }
        return reason;
      }

      function updateMenu() {
        const subreddits = config.getSubreddits();
        const submenus = subreddits.map(subreddit => _subredditMenuProps(subreddit));
        submenus.unshift({
          textContent: 'select none',
          onclick: event => _toggleAllSubreddits(false, event)
        });
        submenus.unshift({
          textContent: 'select all',
          onclick: event => _toggleAllSubreddits(true, event)
        });
        menu.updateMenuSection(
          'filtered subreddits (' + subreddits.length + ')',
          'redditmod-menu-filter-subreddits',
          submenus);
      }

      function refresh() {
        updateMenu();
        processPosts();
      }

      function _toggleSubreddit(subreddit, event) {
        stopEvent(event);
        const enabled = !config.isSubredditFiltered(subreddit);
        config.setSubredditFilter(subreddit, enabled).then(refresh);
      }

      function _toggleAllSubreddits(enabled, event) {
        stopEvent(event);
        config.setAllSubredditFilters(enabled).then(refresh);
      }

      function _subredditMenuProps(subreddit) {
        return {
          innerHTML: (config.isSubredditFiltered(subreddit) ? '&#9745; ' : '&#9744; ') + subreddit,
          onclick: event => _toggleSubreddit(subreddit, event)
        };
      }
    }

    ///////////////////////////////////////////
    function TextFilter(menu) {
      updateMenu();
      return {shouldFilter};

      function shouldFilter(thing) {
        let reason = false;
        const title = thing.querySelector('a.title');
        if (title) {
          reason = config.shouldFilterTextblock(title.textContent);
        }
        return reason;
      }

      function updateMenu() {
        const texts = config.getTexts();
        const submenus = texts.map(text => _textMenuProps(text));
        submenus.unshift({
          textContent: 'add a text filter',
          onclick: _addTextFilter
        });
        menu.updateMenuSection('filtered text (' + texts.length + ')', 'redditmod-menu-filter-texts', submenus);
      }

      function refresh() {
        updateMenu();
        processPosts();
      }

      function _addTextFilter(event) {
        stopEvent(event);
        const text = prompt(
          '"Text Filter" will hide reddit posts that contain a word or phrase in the post title.' +
          '\n\nYou can enter multiple words/phrases by separating them with a Comma ( , )' +
          '\n\n(Text-matching is case-insensitive)' +
          '\n\nEnter text to filter:', 'Example: trump, sanders, clinton');
        if (text === null) return;
        text.split(/\s*,\s/).forEach(word => {
          config.setTextFilter(word.toLowerCase(), true);
        });
        refresh();
      }

      function _textMenuProps(text) {
        return {
          innerHTML: (config.isTextFiltered(text) ? '&#9745; ' : '&#9744; ') + text,
          onclick: event => {
            stopEvent(event);
            _toggleText(text);
          }
        };
      }

      function _toggleText(text) {
        const enabled = !config.isTextFiltered(text);
        config.setTextFilter(text, enabled);
        refresh();
      }
    }
  }

  function Navigation(filters) {
    let loading = false;

    CSS.onDOM().then(() => {
      overrideNextButton();
      scrollListener();
      addScrollListener();
    });

    return {scrollListener, addScrollListener};

    function scrollListener(event) {
      const evt = event || {pageY:0};
      if (document.body.clientHeight - (window.scrollY + window.innerHeight) < 200) {
        CONFIG.then(config => {
          if (config.isTweakEnabled('infiniteScrolling')) {
            loadMorePosts();
          }
        });
      }
    }

    function addScrollListener()    { window.addEventListener('scroll',    scrollListener); }
    function removeScrollListener() { window.removeEventListener('scroll', scrollListener); }

    function loadMorePosts() {
      const nextButton = document.querySelector('.next-button a');
      if (loading || !nextButton) {
        return;
      }

      loading = true;
      removeScrollListener();

      debug('[Navigation.loadMorePosts] Fetching URL (via nextButton.href):', nextButton.href);
      const xhr = new XMLHttpRequest();
      xhr.onload = function(response) {
        _injectPosts(response.target);
      };
      xhr.onerror = _onError;
      xhr.onabort = _onError;
      xhr.open('GET', nextButton.href, true);
      xhr.send(null);
      /*GM.xmlHttpRequest({
        method: "GET",
        url: nextButton.href,
        onabort: _onError,
        onerror: _onError,
        onload: _injectPosts
      });*/

      const parentNode = nextButton.parentNode.parentNode;
      parentNode.style.backgroundColor = '#aaa';
      parentNode.opacity = '0.5';
      parentNode.cursor = 'not-allowed';
      parentNode.childNodes.forEach(child => {
        if (child.style) {
          child.style.display = 'none';
        }
      });

      function _onError(response) {
        debug('Navigation.loadMorePosts() error. url:', nextButton.href, 'response:', response);
        const errDiv = document.createElement('div');
        errDiv.className = 'redditmod-media-error';
        errDiv.textContent = 'Navigation.loadMorePosts() error. URL: ' + nextButton.href + ' Reason: ' + (response.error || response.responseText);
        nextButton.parentNode.parentNode.appendChild(errDiv);
      }
    }

    function _injectPosts(response) {
      debug('[Navigation.loadMorePosts._injectPosts] Got response (' + response.responseText.length.toLocaleString() + ' bytes)');
      const previousNav = document.querySelector('.nav-buttons');
      const html = document.createElement('html');
      html.innerHTML = response.responseText;
      html.querySelectorAll('#siteTable > *').forEach(thing => {
        if (thing.classList.contains('clearleft')) return;
        if (!thing.id) {
          previousNav.parentNode.insertBefore(thing, previousNav);
        } else if (!document.querySelector('#' + thing.id)) {
          filters.processPost(thing);
          previousNav.parentNode.insertBefore(thing, previousNav);
        } else {
          debug('[Navigation.loadMorePosts._injectPosts] Ignoring duplicate post. thing.id:', thing.id);
        }
      });
      previousNav.parentNode.removeChild(previousNav);

      // Re-enable features on the "new page".
      overrideNextButton();
      addScrollListener();
      loading = false;
      setTimeout(scrollListener, 250);
    }

    function overrideNextButton() {
      const nextButton = document.querySelector('.next-button a');
      if (!nextButton) return;
      nextButton.addEventListener('click', event => {
        CONFIG.then(config => {
          if (config.isTweakEnabled('loadPostsInline')) {
            stopEvent(event);
            loadMorePosts();
          }
        });
      });
    }
  }

  function Tweaks(config, menuPromise) {
    const TWEAK_STYLE_ID = 'redditmod-tweak-style';

    return new Promise(resolve => {
      // Apply tweaks CSS before MENU loads
      _applyTweakCSS();

      menuPromise.then(menu => {
        updateMenu(menu);
        resolve({
          updateMenu: () => updateMenu(menu)
        });
      });
    });

    function _applyTweakCSS() {
      CSS.applyStyle(TWEAK_STYLE_ID, config.getTweakCSS());
    }

    function _tweakLinkProps(tweak, menu) {
      return {
        innerHTML: (tweak.enabled ? '&#9745; ' : '&#9744; ') + tweak.name,
        title: tweak.title,
        onclick: event => {
          stopEvent(event);
          config.setTweak(tweak.id, !config.isTweakEnabled(tweak.id))
            .then(() => {
              _applyTweakCSS();
              updateMenu(menu);
            });
        }
      };
    }

    function updateMenu(menu) {
      if (!menu) return;
      menu.updateMenuSection(
        'tweaks', 'redditmod-menu-tweaks',
        config.getTweaks().map(tweak => _tweakLinkProps(tweak, menu))
      );
    }
  }

  function Themes(config, menuPromise) {
    const THEME_STYLE_ID = 'redditmod-theme-style';

    return new Promise(resolve => {
      // Apply theme CSS before MENU loads
      applyThemeCSS();

      menuPromise.then(menu => {
        updateMenu(menu);
        resolve({
          applyThemeCSS,
          updateMenu: () => updateMenu(menu)
        });
      });
    });

    function applyThemeCSS() {
      CSS.applyStyle(THEME_STYLE_ID, config.getThemeCSS());
    }

    function updateMenu(menu) {
      if (!menu) return;
      const submenus = config.getThemes().map(themeName => ({
        innerHTML: (config.getTheme() === themeName ? '&#9745; ' : '&#9744; ') + themeName,
        onclick: event => {
          stopEvent(event);
          config.setTheme(themeName).then(() => {
            applyThemeCSS();
            updateMenu(menu);
          });
        }
      }));
      menu.updateMenuSection('themes', 'redditmod-menu-themes', submenus);
    }
  }

  //debug('Startup: config');
  CONFIG.then(config => {
    //debug('Startup: menuPromise (config:', config, ')');
    const menuPromise = MENU.init(config);

    //debug('Startup: theme, tweak, & filters (menuPromise:', menuPromise, ')');
    Promise.all([
      Themes(config, menuPromise),
      Tweaks(config, menuPromise),
      Filters(config, menuPromise)
    ]).then(([themes, tweaks, filters]) => {
      //debug('Startup: navigation (themes:', themes, 'tweaks:', tweaks, 'filters', filters, ')');
      const navigation = Navigation(filters);
      //debug('Startup: COMPLETE (navigation:', navigation, ')');
    });

  });
})();
