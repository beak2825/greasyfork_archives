// ==UserScript==
// @name GitHub - single-column repository page with important info on the top
// @namespace myfonj
// @version 1.17.17
// @description Pulls Readme above files list and moves sidebar content as foremost horizontal row before content.
// @author myf
// @license CC0
// @grant GM_addStyle
// @run-at document-start
// @match *://*.github.com/*
// @include /^(?:^https?://github.com/[^?#]*?/(discussions|pull)/.*)$/
// @include /^(?:^https?://github.com/[^?#]*?/(issues|pull)/.*)$/
// @include /^(?:^https?://github.com/(?!password_reset|settings)([^#?/]+)/([^#?/]+)/?([#?].*)?$)$/
// @downloadURL https://update.greasyfork.org/scripts/406729/GitHub%20-%20single-column%20repository%20page%20with%20important%20info%20on%20the%20top.user.js
// @updateURL https://update.greasyfork.org/scripts/406729/GitHub%20-%20single-column%20repository%20page%20with%20important%20info%20on%20the%20top.meta.js
// ==/UserScript==

(function() {
let css = "";
if ((location.hostname === "github.com" || location.hostname.endsWith(".github.com"))) {
  css += `
  /*
    https://userstyles.world/style/5069/github-repository-page-in-single-column-with-important-info-on-the-top
    https://greasyfork.org/en/scripts/406729/versions/new
   Changelog
    1.17.17 (2025-09-14) - Another Issues issue fix.
    1.17.16 (2025-09-08) - Pull: fix sidebar to header swap.
    1.17.15 (2025-09-05) - Issues: max paragraph length limit.
    1.17.14 (2025-08-20) - Issues: Notificiations: hide explanatory message and fix layout a bit.
    1.17.13 (2025-08-07) - Another issues sidebar structure adaptation.
    1.17.12 (2025-06-20) - Shrink "Security" anchor link.
    1.17.11 (2025-06-11) - scope Relationship cell issues fix, so it does not break stuff outside.
    1.17.10 (2025-05-27) - fix the Relationship cell issues.
    1.17.9 (2025-05-07) - Mode subtle "⚠ Report repository". (Fix namely because it clashed with my own Segoe->twemoji mozilla remapper.)
    1.17.8 (2025-02-07) - Show single license fix. Vertical align still wonky.
    1.17.7 (2025-02-04) - Show licenses when multiple (in details), compress "Report repository" to ⚠; vertical align still not perfect.
    1.17.6 (2024-11-27) - Issues new structure.
    1.17.5 (2024-08-29) - Commits counts first before last commit details.
    1.17.4 (2024-08-20) - Fix non-truncated naked link in sponsor box.
    1.17.3 (2024-08-13) - Fix narrow "sidebar" width in "new issue" (and presumably elsewhere).
    1.17.2 (2024-07-03) - Fix broken header width (my fault, sorry folks).
    1.17.1 (2024-06-21) - Fix "last commit" content order: count and "last" to the start.
    1.17.0 (2024-05-30) - Also for pull request conversations
    1.16.3 (2024-04-05) - Issue Notification button box fixed width, so it will not cause shift after init.
    1.16.2 (2024-04-04) - Flex-shrink for the issues header; allows wrapping content inside items, but will not overflow.
    1.16.1 (2024-04-03) - Max-width for labels in issues
    1.16.0 (2024-03-26) - Preliminary support for single-column discussions.
    1.15.3 (2024-03-23) - Issue comment header content narrower, to match max line length better
    1.15.2 (2024-03-21) - Better align with issues header
    1.15.1 (2024-03-21) - Issues Subscription reason prose into hover/focus po-pup to reduce height
    1.15.0 (2024-03-20) - Preliminary single-columning of Issue pages
    1.14.1 (2024-03-12) - "Last commit" back left.
    1.14.0 (2024-02-28) - shrink "contributors" and "used by" lists' height, unless hovered
    1.13.0 (2024-02-14) - adapt to a new structure, yet again
    1.12.4 (2023-12-13) - fix last commit "…" more info dropdown position
    1.12.3 (2023-12-13) - total commit count and last commit time pulled to the left edge
    1.12.2 (2023-12-12) - also rushed pulling of "last commit" info, for now above readme - license - (...) - edit - menu line
    1.12.0 (2023-12-12) - rushed hotfix for new main content structure, readme is back up. Ton of dead code remains.
    1.11.1 (2023-11-15) - restore compacting stuff under tags (license, CoC, ... icons) after structure change (new wrapper)
    1.11.0 (2023-09-25) - Hide redundant ☆ / 👁 / 🜉 + counts under tags.
    1.10.0 (2023-09-25) - Hide "No releases published" / "No packages published" boxes
    1.9.4 (2023-09-20) - prevent links under tags wrapping between words
    1.9.3 (2023-09-07) - wider "About" box, narrower rest, icons-(+ counts)-only footer
    1.9.2 (2023-08-15) - max-width for header
    1.9.1 (2023-07-13) - fix superfluous line break in resources (\`include-fragment\`)
    1.9.0 (2023-06-22) - readme pulled to top even on subpages; requires modern Chromium or Firefox with \`layout.css.has-selector.enabled\` pref
    1.8.4 (2023-03-03) - hopefully applied even for "turbopages"
    1.8.3 (2022-08-11) - just name and info changes
   */
   /* just for categorisation */
   /* … and this little photo zoom */
   .Popover .avatar-user {
    min-width: 240px;
    min-height: 240px;
    /* image-rendering: crisp-edges */
   }
   /* make transparent avatars more contrasting */
   .avatar-user {
    filter:drop-shadow(0 0 1px canvastext)
   }
   /* … and pulling the readme at code pages deeper */
   main div:has(> #readme) {
    /* wohohoo, new era of usestyling just arrived. */
    order: -1;
   }
  `;
}
if (new RegExp("^(?:^https?://github.com/[^?#]*?/(discussions|pull)/.*)\$").test(location.href)) {
  css += `


  /*
   § Discussions: pull sidebar up as well
   gosh, why every page has completely different layout structure??
   */
   #discussion_bucket {
    :has(#partial-discussion-header) {
     order: -2;
    }
    #partial-discussion-sidebar {
     order: -1;
     display: flex;
     width: 100%;
     gap: 2ch;
     .discussion-sidebar-item {
      margin: 0;
      padding: 0;
      border: none;
     }
     & create-branch {
      /*
      shrinking long "Successfully merging this pull request may close these issues."
      */
      max-width: 25ch
     }
    }
   }
   /*
   pull layout 2025-09-08
   https://github.com/web-platform-tests/wpt/pull/54658
   */
   [class~="Layout"]:has(
    > [class="Layout-main"]:first-child
    + [class="Layout-sidebar"]:last-child
   ) {
    display: flex;
    flex-direction: column;
    & > [class="Layout-main"]:first-child {
     order: 1;
    }
   }

  `;
}
if (new RegExp("^(?:^https?://github.com/[^?#]*?/(issues|pull)/.*)\$").test(location.href)) {
  css += `
  /*
  2025-05-27 Relationships cell issues
  */
  [data-testid="sidebar-section"] {
   & [class^="prc-ActionList-ItemLabel"] *,
   & [data-component="ActionList.Description"] {
     word-break: normal !important;
     overflow-wrap: normal !important;
   }
   & [class^="prc-ActionList-ActionListContent"],
   & [class^="prc-ActionList-ActionListSubContent"] {
     display: flex;
     flex-direction: column;
   }
  }
  /*
   § Issue: pull sidebar up as well
   */
   [data-testid="issue-viewer-metadata-container"] {
    width: auto;
   }
   *:has(> [data-testid="issue-viewer-metadata-container"]) {
    flex-direction: column-reverse;
    & *:has(> [data-testid="sidebar-section"] ) ,
    & [data-testid="issue-viewer-metadata-pane"] > h2 ~ div:last-child {
     display: flex !important;
     flex-direction: row
    }
   }
   [class^="SubscriptionSection-module__container"] {
    flex-direction: column
   }
   [class^="SubscriptionSection-module__header"] {
    position: static;
    align-self: flex-start;
    padding-left: 8px;
   }
   #issue-viewer-subscription-description {
    display: none;
   }

   /*
   § limit comment line length (crude preliminary)
   */
   .comment-body {
    &  p,
    & > :is(ul,ol) > li {
     max-width: 80ch
    }
   }
   /*
   § limit comment header content length, so it does not dangle
   */
   .timeline-comment-header {
    justify-content: left;
    h3 { max-width: 80ch !important}
   }
   /*
   § REVIEW sweep reactions aside so they do not add vertical space?
   it seems it is not possible to make them vertical
   since they watch width and collapse them to button when narrow (?)
   */
   :has(>.pr-review-reactions) {
    > .pr-review-reactions {
     > .comment-reactions{
     }
     .js-comment-reactions-options{
     }
    }
   }
   /*
   § max-line limit
   */
   .markdown-body {
    width: max-content;
    /* margin-inline: auto; */
    & :is(p, li) {
     max-width: 80ch;
     font-size: 1rem;
     line-height: 1.8;
    }
   }
  `;
}
if (new RegExp("^(?:^https?://github.com/(?!password_reset|settings)([^#?/]+)/([^#?/]+)/?([#?].*)?\$)\$").test(location.href)) {
  css += `
   /*
   examples
   https://github.com/mmulet/code-relay
    few contributors, many columns
   https://github.com/mozilla/readability
    used by ..
   https://github.com/GoogleChromeLabs/dark-mode-toggle
    many tags, much everything
   https://github.com/WebReflection/sqlite-worker
    five columns
   https://github.com/rilwis/bamboo
    fork, just two columns
   https://github.com/mozilla/standards-positions
    no about, no tags
   https://github.com/mcmilk/7-Zip-zstd/
    sponsor
   https://github.com/clauseggers/Playfair
    super long sponsor naked URL
   https://github.com/mdn/mdn-minimalist
    no readme TOC
   
   \`.repository-content\` class is actually unreliable, since it is not present for ajaxified turbonavigations
   using \`#repository-container-header + *\` instead
   that \`*\` seems like
  <turbo-frame id="repo-content-turbo-frame" target="_top" data-turbo-action="advance" class="">
        <div id="repo-content-pjax-container" class="repository-content ">
   */
   /* header block nentred
   */
   .AppHeader > * {
    max-width: 1280px;
    margin: auto;
   }
   /* unify main max width and centering of the main blocks
   */
   main > div {
    max-width: none !important;
    max-width: 80rem !important;
    max-width: 90rem !important;
    margin-left: auto;
    margin-right: auto;
   }
   /* main "columns" wrapper (files | sidebar) - convert to reversed rows */
   #repository-container-header + * .Layout {
    display: flex !important;
    flex-direction: column-reverse !important;
   }
   /* Files, Sidebar - now rows*/
   #repository-container-header + * .Layout > div {
    width: auto;
   }
   /*
    main column - wrapper of:
    - file navigation (branches, tags left, goto, file right)
    - files (moved to bottom, except for 1. "row" with latest commit positioned to file navigation)
    - readme (moved under file navigation)
   */
   #repository-container-header + * .Layout > .Layout-main {
    position: relative;
    display: flex;
    flex-direction: column;
   }
   #repository-container-header + * .Layout > .Layout-main > .file-navigation {
    order: -2;
   }
   /*
   Readme - move before files files
   there are two kinds of readme blocks:
   - "fancy" readme-toc component with kebab menu of headings (introduced around 2021-03-26)
     - see e.g. https://github.com/SerenityOS/serenity
   - "normal" div#readme
     - see e.g. https://github.com/mozilla/readability
   */
   #repository-container-header + * .Layout > .Layout-main > readme-toc,
   #repository-container-header + * .Layout > .Layout-main > #readme {
    order: -1;
   }
   /* sticky "README.md" heading / TOC box make simple button */
   #repository-container-header + * .Layout > .Layout-main > readme-toc > #readme > :first-child {
    display: inline-flex !important;
    border: none !important;
    background-color: transparent !important/**/
   }
   /* "readme.md" label/link heading after TOC button: hide */
   #repository-container-header + * .Layout > .Layout-main > readme-toc > #readme > :first-child h2 {
    display: none;
   }
   /* actual readme box: push up into place freed by heading / TOC box */
   #repository-container-header + * .Layout > .Layout-main > readme-toc > #readme > :last-child {
    margin-top: -3rem
   }
   /* readme - line length limit (originnaly 1012px through .container-lg) */
   #repository-container-header + * .Layout > .Layout-main > readme-toc > #readme article.markdown-body.entry-content {
    max-width: 80ch;
   }
   /*
   sidebar - now top content
   for god's sake, THIS div should be MAIN and should be near H1 or something
   not suffocated at the end of the document in sidebar
   */
   #repository-container-header + * .Layout > .Layout-sidebar > div {
    display: flex;
    flex-direction: row;
    /* let's try without
    flex-wrap: wrap;
    now */
    padding-bottom: 1rem;
   }
   /* all main flex items (about .. languages)*/
   #repository-container-header + * .Layout > .Layout-sidebar > div > * {
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: 0;
    border-left: 1px solid var(--color-border-secondary);
    border-left: none;
    padding-left: .5rem;
    padding-right: .5rem;
    padding-bottom: 1rem;
   }
   /*
    first "about" cell
   */
   #repository-container-header + * .Layout > .Layout-sidebar > div:first-child > div:first-child {
    flex-basis: 50ch;
    flex-grow: 2;
    max-width: 80ch;
    border-left: none;
    padding-left: 0;
   }
   /* 📖 Readme ⚖️ License : condense, icons-(+ counts)-only footer */
   /* those h3 are .sr-only, preceding divs and \`include-fragment\` */
   #repository-container-header + * .Layout > .Layout-sidebar > div:first-child > div:first-child > div h3 ~ * {
    display: inline;
    font-size: 0;
    & a::after {
     content: '\\A0';
     font-size: var(--body-font-size, 14px);
    }
    & strong,
    & a[href$="/LICENSE"],
    & :is(summary,a:not([href="#security-ov-file"])):has(.octicon-law),
    & a:not(:has(svg)) {
     font-size: var(--body-font-size, 14px);
     white-space: nowrap !important;
    }
    /*
    § compress "Report repository"
    */
    & a[href^="/contact/report-content?"] {
     font-size: 0;
     width: 1em;
     display: inline-block;
     overfow: visible;
     &::before {
      content: '⚠\\FE0E';
      font-family: Segoe UI Symbol, system-ui;
      font-size: 1rem;
      filter: grayscale(1) opacity(.5);
     }
     &:hover {
      font-size: 1rem !important;
     }
     &:hover::before {
      filter: none;
     }
    }
    &:has(svg)::after {
     content: '';
     font-size: 1rem;
    }
    /* 
     Hide redundant ☆ / 👁 / 🜉 + counts under tags.
     They are present in the header already, and better.
    */
    &:has( a[href$="/stargazers"],
    a[href$="/watchers"],
    a[href$="/forks"]) {
     display: none !important
    }
   }
   /* unnecessary 🔗 link icon, may cause wrap, hide */
   #repository-container-header + * .Layout > .Layout-sidebar > div:first-child > div:first-child .octicon-link {
    display: none;
   }
   /* last "(programming) languages" cell */
   #repository-container-header + * .Layout > .Layout-sidebar > div:first-child > div:last-child {
    /*
    flex-shrink: 100;
    flex-grow: 0;
    /* let's try without limiting */
   }
   /* Contributors "grid" min three in rows (to not get a two or single row skyscraper) */
   #repository-container-header + * .Layout > .Layout-sidebar > div:first-child h2 + ul {
    min-width: 8rem !important;
   }
   /* no border nor paddings */
   #repository-container-header + * .Layout > .Layout-sidebar > div > div > div {
    border: none;
    padding: 0;
   }
   /* headings  */
   #repository-container-header + * .Layout > .Layout-sidebar > div > div > div > h2,
   #repository-container-header + * .Layout > .Layout-sidebar > div > div > div > h2 > a {
    white-space: nowrap !important;
   }
   /* tags in about cell - restack and dim */
   #repository-container-header + * .Layout > .Layout-sidebar > div:first-child > div .f6:not(:hover) {
    opacity: 0.5;
   }
   #repository-container-header + * .Layout > .Layout-sidebar > div:first-child > div .f6 {
    display: flex;
    flex-wrap: wrap;
   }
   #repository-container-header + * .Layout > .Layout-sidebar > div:first-child > div .f6 > * {
    flex-grow: 1;
    text-align: center;
   }
   /* "used by 108" - make 8 avatars wrap */
   .hx_flex-avatar-stack {
    flex-wrap: wrap;
    max-width: 10rem;
    padding-right: .8rem;
   }
   /* allowing wrap of counter under "used by" avatars */
   #repository-container-header + * .Layout > .Layout-sidebar > div:first-child > div .d-flex.flex-items-center {
    flex-wrap: wrap;
   }
   /*
   un-truncating everything to allow wrapping of long (esp. in "releases" cell
   affects "releases", but whatever
   */
   #repository-container-header + * .Layout > .Layout-sidebar > div > * * {
    white-space: normal !important;
   }
   /* un-flexing latest release */
   #repository-container-header + * .Layout > .Layout-sidebar > div > * .Link--primary.d-flex * {
    display: block !important
   }

   /* superfluous link icon in "sponsor this project" */
   #repository-container-header + * .Layout > .Layout-sidebar > div > * [style="min-width:32px;height:32px;"] {
    display: none !important;
    & + * {
     /*
      Naked "sponsor" link:
      As we are un-trucatining this content, we have to fix it back.
      Instad of ellipsis, let it just break to lines.
      Break all looks better, but with this one the host stands out better.
     */
     word-break: break-word;
    }
   }
   /* environments "active" tag below text */
   #repository-container-header + * .Layout > .Layout-sidebar > div > * h2 + .list-style-none li .Label {
    display: block;
   }

   /*
  § Hide "No releases published" / "No packages published" boxes.
  */
   #repository-container-header + * .Layout > .Layout-sidebar > div > div.BorderGrid-row:has( > .BorderGrid-cell:only-child > h2:first-child/* :has( a[href$="/releases"]) */
   + div.text-small.color-fg-muted:last-child) {
    display: none;
   }

   /*
   § contributors tentatively wider
   */
   .BorderGrid-row:has(h2 :link[href$="/contributors"]) {
    flex-basis: 25% !important;
    xflex-grow: 40;
    xflex-shrink: 30;
    xoutline: #0FF6 solid;
    xoutline-offset: -2px;
   }

   /*
  § shrink "contributors" and "used by" lists' height, unless hovered
  */
   .BorderGrid-cell ul {
    max-height: 100vh;
    transition-property: max-height, overflow;
    transition-duration: 200ms;
    transition-delay: 500ms;
    overflow: hidden;
   }
   .BorderGrid-cell ul:not(:hover) {
    max-height: 5rem !important;
   }

   /* unnecesary non-TOC "readme.md" heading box */
   #repository-container-header + * .Layout > .Layout-main > [id="readme"] > .Box-header:first-child {
    display: none !important;
   }
   /* hide hash */
   #repository-container-header + * .Layout > .Layout-main .Box-header .text-mono {
    display: none !important
   }
   /* reverse order so commit count ends up beside tag count */
   #repository-container-header + * .Layout > .Layout-main .Box-header > div > :last-child {
    order: -1;
    padding-right: 1rem;
   }
   /* hide "commits" text (lave icon) (more space for last commit msg) */
   #repository-container-header + * .Layout > .Layout-main .Box-header > div > :last-child .color-text-secondary {
    display: none !important;
   }
   /* hide "branches" and "tags" text (lave icons) (more space for last commit msg) */
   .file-navigation .color-text-tertiary {
    display: none;
   }
   /*
   hide word "commits", "tags", "branches" after counts 
  */
   svg[aria-hidden="true"]:first-child + strong:not(:hover) + span:last-child {
    font-size: 0;
   }
   svg[aria-hidden="true"]:first-child + span:last-child:not(:hover) > strong:first-child + span:last-child {
    font-size: 0;
   }

   /*
   (just trying) see wide tables without scrolling them
  */
   .markdown-body table {
    overflow: visible;
   }


   /**
  2023-12-11
  new structure, totally turdy
  rushed hotfix
  readme first
  **/
   [data-selector="repos-split-pane-content"] {
    margin: 0;
    max-width: none;
    & div:has(>div>h2#folders-and-files) {
     order: 1;
    }
   }


   /*
    "last commit" info: pull between header and readme
   */
   table[aria-labelledby="folders-and-files"] > tbody > tr:first-child > td:only-child > div:has([data-testid="latest-commit"]) {
    position: absolute;
    top: -2.2rem;
    left: 0rem;
    padding-inline: 0;
    /*
    commit count and "Last commit" to the start
    */
    & > :has([data-testid="latest-commit-details"]) {
     order: -1;
     & relative-time,
     & :has(>[aria-label="Commit history"]),
     & [aria-label="Commit history"] {
      order: -2;
      color: var(--color-fg-default);
      font-weight: 600;
     }
     [data-testid="latest-commit-details"] {
      order: 1;
     }
    }
    /*
     that "~more info" dropdown opened by "…" button
    */
    & + div {
     position: absolute;
     top: 0;
     right: 20%;
     max-width: 80%;
    }
    /*
     fix separators and spacing
    */
    & [aria-label="Commit history"] {
     margin-left: -12px;
    }
    & :has(> relative-time) {
     /* removing the ' · ' */
     font-size: 0;
     /* and put it back; */
     & > * {
      font-size: var(--body-font-size, 0.875rem);
     }
     & relative-time {
      &::before,
      &::after {
       color: var(--color-fg-muted);
       font-weight: normal;
      }
      &::before {
       content: 'Last commit: ';
      }
      &::after {
       content: '; ';
      }
     }
    }
   }

   /*
   2024-02-13 new structure again, "yaaaay".
  */
   [partial-name="repos-overview"] {
    & > * > * > * {
     display: flex;
     & > *:has([id="folders-and-files"]) {
      order: 1;
     }
    }
   }


   /* END */
  `;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
