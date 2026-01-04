// ==UserScript==
// @name          RES Companion for Mobile
// @description   Fixes some minor annoyances with RES usage on Firefox Mobile
// @author        asleepysamurai, Agreasyforkuser
// @match         https://old.reddit.com/*
// @match         https://www.reddit.com/*
// @match         https://www.redditmedia.com/mediaembed/*
// @exclude       https://new.reddit.com/*
// @exclude-match https://old.reddit.com/chat/*
// @version       20
// @license       MIT
// @icon          https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png
// @namespace
// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/487134/RES%20Companion%20for%20Mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/487134/RES%20Companion%20for%20Mobile.meta.js
// ==/UserScript==

if(window.location.hostname === 'old.reddit.com'){
    {
            const styles = new CSSStyleSheet();
    // language=CSS
    styles.replaceSync(`
            .res-gallery .res-step-container .res-step::after {
                width: 25px;
                font: normal 25px/25px Batch;
            }

            .res-gallery .res-step-container .res-gallery-to-filmstrip {
                display: none;
            }

            .expando-button {
               width: 50px !important;
               height: 50px !important;
               background-size: cover !important;
               float: inline-end;
               margin-top: -10px;
            }

            .expando-button.selftext, .expando-button.video, .expando-button.crosspost {
              background-size: 92px 1208px !important;
            }

            .expando-button.selftext.collapsed {
              background-position: 0 -1098px;
            }

            .expando-button.selftext.collapsed:hover {
              background-position: 0 -1040px;
            }

            .expando-button.expanded.video, .expando-button.expanded.selftext, .expando-button.expanded.crosspost {
               background-position: 0 -866px;
            }

            .expando-button.expanded.video:hover, .expando-button.expanded.selftext:hover, .expando-button.expanded.crosspost:hover {
               background-position: 0 -808px;
            }

            .expando-button.collapsed.video {
               background-position: 0 -982px;
            }

            .expando-button.collapsed.video:hover {
               background-position: 0 -924px;
            }

            .link .flat-list .comments {
               font-size: 0.9rem; display: block; padding: 5px 0;
            }

            .link .flat-list li:has(> .comments) {
                display: inline-block;
                float: inline-end;
                padding-right: 10px;
            }

            .thumbnail + .entry{
                margin-right:-2vw;
            }

            .entry{
               display: inline;
               padding: 0 !important;
               margin: 0 !important;
            }

            .entry .top-matter .title {
                display: block;
            }

           .listingsignupbar.infobar {display: none !important}
           .mobile-web-redirect-bar {display: none !important}
           .panestack-title {margin-right: 0px}

      	  	#header {overflow: auto !important;}
      	  	.side {display: none !important;}
      	  	.sitetable {width: 100% !important;}
  	        body>div.content {width: 98% !important;}

            .comment .expand {
              font-size: 1.5rem;
              float: inline-end;
            }

            .sitetable.linklisting .link:not(:first-child) {
               border-top: 1px dotted gray;
            }

            .sitetable.linklisting .link {
               padding-top: 8px;
               width: 99vw;
            }
        `);
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, styles];

        const metaViewportElement = document.createElement('meta');
        metaViewportElement.setAttribute('name', 'viewport');
        metaViewportElement.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1');
        document.head.appendChild(metaViewportElement);
        metaViewportElement.setAttribute('content', 'width=device-width, initial-scale=1');
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
                        `${window.$('#header').outerHeight(true) + extraHeaderHeight}px`
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
