// ==UserScript==
// @name          Reddit Old Mobile 📱
// @description   Mobile-friendly design for Reddit Old
// @author        Agreasyforkuser
// @match         https://old.reddit.com/*
// @match         https://www.reddit.com/*
// @match         https://www.redditmedia.com/mediaembed/*
// @exclude       https://new.reddit.com/*
// @exclude-match https://old.reddit.com/chat/*
// @version       6.0
// @license       MIT
// @icon          https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png
// @namespace     tampermonkey
// @downloadURL https://update.greasyfork.org/scripts/469760/Reddit%20Old%20Mobile%20%F0%9F%93%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/469760/Reddit%20Old%20Mobile%20%F0%9F%93%B1.meta.js
// ==/UserScript==

if(window.location.hostname === 'old.reddit.com'){
    {
        const metaViewportElement = document.createElement('meta');
        metaViewportElement.setAttribute('name', 'viewport');
        metaViewportElement.setAttribute('content', 'width=device-width, initial-scale=1');
        document.head.appendChild(metaViewportElement);
    }
    {
        const styles = new CSSStyleSheet();
        // language=CSS
        styles.replaceSync(`html,
             
               body                 {background: var(--theme-color-new) !important}
               body > .content      {background: white !important}

                                     #search                    {margin-left: 5px; margin-right: 5px}
                                     #search input[type="text"] {border-color: var(--theme-color-new) !important}
                                     #search input[type="text"] {border-radius: 15px}
               .combined-search-page #search input[type="text"] {border-color: black !important}

               /* Top Header */
               #header                     {border: none}
               #header-bottom-right        {border: none; position: initial !important}
               #header-bottom-left         {padding-left: 0 !important}
               /* hide scrollbar */
               #sr-header-area .sr-list    {overflow: hidden !important}



                /* Search and fixes for search page */
                                      
                .combined-search-page .searchpane                {padding-left: 0px}
                                      .search-result-group       {padding-left: 10px; padding-right: 10px}
                .combined-search-page .search-submit-button      {margin-left: 0px !important}
                .combined-search-page .subreddit-icon            {display: none}
                .combined-search-page #sr-header-area            {display: none}

                /* Expanded Media UNDER the post */
               .entry {overflow:visible;}

               /* Centering Expanded Video Posts */
               .thing .media-preview-content, .thing .media-preview-content video {max-width: 100%; height: auto !important}

               /* Centered Action Buttons */
                              .link .flat-list {text-align:center}
               /* Centering this too for aesthetics */
                              .link .tagline {text-align: center}
                              .link .tagline {margin-bottom:  10px; margin-top:  10px}
               .comments-page .link .tagline {margin-bottom: unset; margin-top: unset}

               /* Border between Posts */
                              .link          {border-bottom:1px solid black}
                              .link          {padding-left: 0}
                 .linklisting .md            {margin-bottom: 0px}


               /* Upvote Scores On Thumbnails */
                                    .midcol {margin: 0}
                              .link .midcol {background-color:rgba(0, 0, 0, 0.6); width:auto !important}
                              .link .midcol {position: absolute; z-index:999; font-size: x-small}
               .comments-page .link .midcol {background: none}
                              .link .arrow  {filter: brightness(100)}
               .comments-page .link .arrow  {filter: none !important}
               .arrow.upmod, .arrow.downmod {filter: none !important}
                              .link .score  {color: white}
               .comments-page .link .score  {color: #c6c6c6}
               .comments-page .link .title  {margin-left: 5px; margin-right: 0}



               /* No Overlapping with Text-Only-Posts */
               .link .title                  {text-align: center;font-size:large; margin-bottom: 1px; margin-right: 0 !important}
               .link .reddit-profile-picture {display:none !important}


               /* Comment Page */
               .comments-page #sr-header-area {display:none}
               .panestack-title {text-align:center}
                              #noresults                    {margin-right: 0px !important; text-align: center}
               .comments-page .thumbnail                    {display:none !important}
                              .commentarea .menuarea        {display: flow-root !important; text-align: center}
               .comments-page .menuarea .spacer             {margin-right: 0}
               .comments-page .dropdown.lightdrop .selected {padding-right: 0}
               /* bigger posts, title gets the whole page width */
               /* firefox */
               .comments-page .entry                   {width: -moz-available !important}
               /* chromium */
               .comments-page .entry                   {width: -webkit-fill-available !important}
               .comments-page .expando-button.expanded {opacity: 0}
               .comments-page .expando-button          {margin: 0}


               /* error messages */
               .comments-page #noresults                    {display: none}
               #noresults                    {margin-right: 0px !important; text-align: center}


                /* gallery navbar */
               .media-gallery .gallery-nav-back {padding:0}

               /* Navbar */
               .nav-buttons         {width:98%;border-top-right-radius: 50px !important; border-top-left-radius: 50px !important}
               .nextprev a          {display:inline-block;width:49%; padding:0 !important}
               .nextprev .separator {display:none}



               /* Give the page a "mobile"-feel */
               .pagename                                             {border-radius: 5px}
               .tabmenu li a                                         {border-radius: 5px; padding: 0}
               #header img, .subreddit-icon, .reddit-profile-picture {border-radius: 5px}
               .entry .buttons li                                    {border-radius: 5px !important}
               .expando-button.selftext                              {border-radius: 5px !important}



               .subscription-box:not(:hover) {opacity: 1}

                body {
                    overflow-x: hidden;
                }
                .listing-chooser,
                #redesign-beta-optin-btn {
                    display: none;
                }
                #sr-header-area {
                    height: auto;
                }
                #sr-header-area .width-clip {
                    display: flex;
                }
                #sr-header-area .width-clip,
                #sr-header-area .sr-list,
                #sr-more-link,
                #header-bottom-right {position: inherit;}
                #sr-header-area .sr-list {
                    overflow: auto;
                }
                .tabmenu {
                    max-width: 100%;
                    overflow: auto;
                }
                .side {
                    z-index: 1001;
                    position: absolute;
                    top: 0;
                    left: 0;
                    margin: var(--header-height) 0 0 0;
                    width: 0;
                    overflow-x: hidden;
                }

                /* fix for custom subreddit styles */
                .side         {opacity:0}
                .side--active {opacity:1}

                .side--active {
                    width: 100%;
                }
                .side--active ~ .content {
                    height: var(--sidebar-height);
                }
                .content {
                    margin: 0 !important;
                    width: 100% !important;
                    overflow-x: auto;
                    overflow-y: hidden;
                }
                .comments-page #siteTable .thing {
                    display: grid;
                    grid-template-columns: auto 1fr;
                    grid-template-areas:
                        'score thumbnail'
                        'main  main';
                    grid-gap: 5px;
                }
                .comments-page #siteTable .thing:not(:has(.thumbnail)) {
                    grid-template-areas:
                        'score main'
                        '.     main';
                }
                .comments-page #siteTable .thing .midcol {
                    grid-area: score;
                }
                .comments-page #siteTable .thing .thumbnail {
                    grid-area: thumbnail;
                }
                .comments-page #siteTable .thing .entry {
                    grid-area: main;
                }
                .comments-page #siteTable .thing .media-embed {
                    width: 100%;
                    height: auto;
                }
                .infobar,
                .searchpane,
                .wiki-page .wiki-page-content,
                .panestack-title,
                .commentarea .menuarea {
                    margin: 5px;
                }
                /* comment this out because of centering */
                /*.commentarea .menuarea {display: flex}*/
                #search input[type=text],
                .roundfield,
                .formtabs-content {
                    width: 100%;
                }
                .subreddit .midcol {
                    width: auto !important;
                }
                .roundfield,
                .roundfield * {
                    box-sizing: border-box;
                }
                .roundfield input,
                .roundfield textarea,
                .roundfield select {
                    max-width: 100%;
                }
                .usertext,
                .menuarea {
                    overflow: auto;
                }
                .combined-search-page #search {
                    padding: 0;
                    display: grid;
                    grid-template-columns: 1fr auto;
                    grid-template-areas:
                        'query             submit'
                        'advanced          advanced'
                        'restrictSubreddit restrictSubreddit'
                        'nsfw              nsfw';
                }
                .combined-search-page #search input[type=text] {
                    grid-area: query;
                    min-width: auto;
                }
                .combined-search-page #search .search-submit-button {
                    grid-area: submit;
                }
                .combined-search-page #search label:has([name="restrict_sr"]) {
                    grid-area: restrictSubreddit;
                }
                .combined-search-page #search label:has([name="include_over_18"]) {
                    grid-area: nsfw;
                }
                .combined-search-page #search p:has(#search_showmore) {
                    grid-area: advanced;
                }
                .search-result-group {
                    width: 100% !important;
                    min-width: auto !important;
                    box-sizing: border-box;
                }
                .search-result-subreddit .search-result-meta {
                    padding: 0.5rem 0;
                    display: flex;
                    flex-direction: column;
                    row-gap: 0.5rem;
                }
                .search-result-subreddit .search-result-meta .stamp {
                    align-self: flex-start;
                }
                .search-link,
                .search-result-body a {
                    overflow-wrap: anywhere;
                    white-space: normal;
                }
            `);
        document.adoptedStyleSheets = [...document.adoptedStyleSheets, styles];
    }

    {
        const sidebarElement = document.querySelector('.side');
        if(sidebarElement){
            const
            menuElement = document.querySelector('.tabmenu'),
                  sidebarButtonContainerElement = document.createElement('li'),
                  sidebarButtonElement = document.createElement('a');
            sidebarButtonElement.textContent = 'sidebar';
            sidebarButtonElement.setAttribute('href', '#');
            sidebarButtonElement.addEventListener(
                'click',
                event => {
                    event.preventDefault();
                    const extraHeaderHeight = document.querySelector('.submit-page')
                    ? window.$('.content > h1').outerHeight(true) + window.$(menuElement).outerHeight(true) + 10
                    : 0;
                    document.documentElement.style.setProperty(
                        '--header-height',
                        `${$('#header').outerHeight(true) + extraHeaderHeight}px`
                        // this doesn't work on Firefox browsers:
                        //`${window.$('#header').outerHeight(true) + extraHeaderHeight}px`
                    );
                    sidebarButtonContainerElement.classList.toggle(
                        'selected',
                        sidebarElement.classList.toggle('side--active')
                    );
                    document.documentElement.style.setProperty(
                        '--sidebar-height',
                        `${sidebarElement.offsetHeight + extraHeaderHeight}px`
                    );
                }
            );
            sidebarButtonContainerElement.appendChild(sidebarButtonElement);
            menuElement.appendChild(sidebarButtonContainerElement);
        }
    }
}
else if(window.location.hostname === 'www.redditmedia.com'){
    const styles = new CSSStyleSheet();
    // language=CSS
    styles.replaceSync(`
            .embedly-embed {
                width: 100%;
            }
        `);
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, styles];
}

////////////////////////// Move Searchbar, make some space on the Comments Page//////////////////////////////////////////////////
var excludedPattern = /https:\/\/.*\.reddit\.com\/.*\/comments\/.*/;
if (!excludedPattern.test(window.location.href) ) {
    // Get the search form element

    var searchForm = document.getElementById('search');

    // Get the tab menu element
    var tabMenu = document.querySelector('.tabmenu');

    // Move the search form to the right of the tab menu
    if (searchForm && tabMenu) {
        tabMenu.parentNode.insertBefore(searchForm, tabMenu.nextSibling);
    }
};
///////////////// remove "view more:" text from navbar //////////////////////////////////
var nextPrevSpan = document.querySelector("span.nextprev");
if (nextPrevSpan){nextPrevSpan.firstChild.nodeValue = ""}
