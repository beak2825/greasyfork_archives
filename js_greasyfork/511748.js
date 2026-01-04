// ==UserScript==
// @name         SAP Community CSS Modifier
// @namespace    http://tampermonkey.net/
// @version      v0.1.9
// @description  Modify layout and styling on SAP Community pages
// @author       Marian
// @homepage     https://github.com/marianfoo/sap-community-css/blob/main/tampermonkey.js
// @match        https://community.sap.com/*
// @exclude      https://community.sap.com/t5/forums/editpage*
// @exclude      https://community.sap.com/t5/forums/postpage*
// @exclude      https://community.sap.com/t5/blogs/blogworkflowpage*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511748/SAP%20Community%20CSS%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/511748/SAP%20Community%20CSS%20Modifier.meta.js
// ==/UserScript==

(function () {
  'use strict';

   const style = new CSSStyleSheet();
  
   // insert the CSS into the stylesheet
   style.replaceSync( `
        #boardmanagementtaplet {
            display: none !important;
        }

        .lia-quilt-column.lia-quilt-column-08.lia-quilt-column-right.lia-quilt-column-side-content {
            display: none !important;
        }

        @media (min-width: 1024px) {
            .lia-quilt-column-16,
            .lia-quilt-view-profile-hero .lia-quilt-column-profile-hero-center {
                width: 100% !important;
            }
        }

        @media (min-width: 1024px) {
            .lia-quilt-column-08,
            .KudosLeaderboardPage .TopUsersLeaderBoard .UserSearchItemContainer,
            .lia-user-search-results-list-container > .UserSearchItemContainer,
            .TkbPage .lia-tkb-article-entry {
                width: 100% !important;
                margin-top: -2%; /* offset back inline with avatar */
            }
        }

        p {
            margin: 0 0 7px !important;
        }

        #producttaglist {
            display: none !important;
        }

        .AddMessageTags.lia-message-tags.lia-component-message-view-widget-tags {
            display: none !important;
        }

        #kudosButtonV2 {
            margin-top: unset !important;
        }

        #bodyDisplay {
            margin-bottom: unset !important;
        }

        .lia-quilt-column-alley.lia-quilt-column-alley-right {
            font-size: small;
        }

        .lia-quilt-notification-feed-item .lia-quilt-column-alley.lia-quilt-column-alley-right {
            display: block;
            justify-content: initial;
            flex-direction: initial;
            font-size: initial;
            margin: initial;
        }

        .lia-quilt-column.lia-quilt-column-16.lia-quilt-column-right.lia-quilt-column-message-footer-right {
            width: 100% !important;
            .lia-quilt-column-alley.lia-quilt-column-alley-right {
                text-align: center !important;
                .footer-top {
                    width: 100% !important;
                }
            }
        }
    `);

  // add the styles to the document
  document.adoptedStyleSheets.push(style);

  // Think of the scene in Shaun Of The Dead when Philip, having turned
  // into a zombie in the car, and is still bothered by the loud music,
  // manages to turn it off by reaching over to the front console, before
  // emitting a zombie sigh of relief ...
  // https://www.youtube.com/watch?v=L5pTPWnoq74&t=229s
  const blogpostify = (x) => x.replace(/Blogs|blogs/g, 'Blog Posts');

  document.title = blogpostify(document.title);

  const headertitle = document.getElementsByClassName(
    'lia-node-header-title'
  )[0];
  headertitle.textContent = blogpostify(headertitle.textContent);

  // Function to loop through elements and apply blogpostify if "Blogs" or "blogs" is found
  const replaceBlogsInElements = (className) => {
    const elements = document.getElementsByClassName(className);
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i];
      if (/Blogs|blogs/.test(element.textContent)) {
        element.textContent = blogpostify(element.textContent);
      }
    }
  };

  // Check for 'lia-breadcrumb-forum', 'custom-tile-category-board', and 'lia-node-header-description'
  replaceBlogsInElements('lia-breadcrumb-forum');
  replaceBlogsInElements('custom-tile-category-board');
  replaceBlogsInElements('lia-node-header-description');

  // Target the 'custom-tiled-node-navigation' section
  const customTileNavigation = document.querySelectorAll(
    '.custom-tiled-node-navigation h3 a'
  );
  customTileNavigation.forEach((link) => {
    if (/Blogs|blogs/.test(link.textContent)) {
      link.textContent = blogpostify(link.textContent);
    }
  });

  // Check for 'lia-breadcrumb-forum', 'custom-tile-category-board', and 'lia-node-header-description'
  replaceBlogsInElements('lia-breadcrumb-forum');
  replaceBlogsInElements('custom-tile-category-board');
  replaceBlogsInElements('lia-node-header-description');

  // Check for 'lia-breadcrumb-forum', 'custom-tile-category-board', and 'lia-node-header-description'
  replaceBlogsInElements('lia-breadcrumb-forum');
  replaceBlogsInElements('custom-tile-category-board');
  replaceBlogsInElements('lia-node-header-description');
})();
