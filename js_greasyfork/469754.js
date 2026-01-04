// ==UserScript==
// @name         Reddit CSS
// @namespace    https://www.reddit.com
// @version      7.4
// @description  New Design with new functionalities
// @author       Agreasyforkuser
// @match        https://old.reddit.com/*
// @match        https://rapidsave.com/*
// @exclude      https://new.reddit.com/*
// @icon         https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/469754/Reddit%20CSS.user.js
// @updateURL https://update.greasyfork.org/scripts/469754/Reddit%20CSS.meta.js
// ==/UserScript==

/////////////////// add CSS styles ////////////////////////////////////////////////////////////////////////

(function() {
    'use strict';

    GM_addStyle(`

             :root {
                     --theme-color-new: #cee3f8;
                     --tab-text-color: #336699;
                     --tab-text-color-selected: #ff4500;
                     --action-button-color: #000000c7;
                     --action-button-background: #0000000d;
                     --general-text-background: white;
                     --video-background: white;
                   }



             #header, #header:hover                      {background-color: var(--theme-color-new)}
             #header-bottom-right                        {background: var(--theme-color-new)}
             #header-bottom-right:hover                  {background: var(--general-text-background)}
             #header-bottom-right a:not(.message-count), .userkarma  {color: var(--tab-text-color) !important}
             #header-bottom-right:not(:hover) .user a                {opacity: 0 !important}
             #header-bottom-right:not(:hover) .user a.login-required {opacity: 1 !important}
             .user .userkarma                            {font-weight: normal}
             .user                                       {color: var(--tab-text-color)}
             #sr-more-link                               {background-color: var(--theme-color-new)}
             #sr-header-area                             {background-color: var(--theme-color-new) !important}
             #sr-header-area a                           {background-color: var(--theme-color-new) !important; color: var(--tab-text-color) !important}
             .selected.title                             {color: var(--tab-text-color) !important}
             .media-gallery .gallery-nav-bar             {color:var(--tab-text-color)}
             .media-gallery .gallery-nav-next,
             .media-gallery .gallery-nav-prev,
             .media-gallery .gallery-nav-back            {border:1px solid var(--tab-text-color);background:var(--theme-color-new)}
             .nav-buttons                                {border: 3px solid var(--theme-color-new); background-color: var(--theme-color-new)}
             #header .tabmenu li a                       {color: var(--tab-text-color); background: var(--theme-color-new) !important}
             #header .tabmenu li.selected a              {color:var(--tab-text-color-selected); background-color: var(--general-text-background) !important}
             #header .tabmenu li a:hover                 {background: var(--general-text-background) !important; color: var(--tab-text-color)}
             body.with-listing-chooser #header .pagename {color: var(--general-text-background)}
             .pagename                                   {background-color: var(--general-text-background) !important}
             .pagename a                                 {color: black !important}
             body, body > .content                       {background: var(--general-text-background)}
             .thing.even, .thing.odd                     {background: var(--general-text-background) !important}
             .side                                       {background-color: var(--general-text-background)}
             .entry .buttons li a                        {color: var(--action-button-color)}
             .entry .buttons li                          {background: var(--action-button-background)}
             .reddit-video-player-root                   {background: var(--video-background) !important}



            /* Adjust the size of the thumbnails */

            .thumbnail, .thumbnail img, .link .thumbnail img{
                width: 200px !important;
                height: auto !important;
                position: relative;
                margin-bottom: 0;
            }

            .comments-page .thumbnail, .comments-page .thumbnail img  {width: 50px !important; height: auto !important; max-height: 50px !important}

            /* Hide weird empty thumbnail placeholders on textposts or other posts */

            .thumbnail.invisible-when-pinned.self.may-blank,
            .thumbnail.invisible-when-pinned.default.may-blank.outbound,
            .thumbnail.invisible-when-pinned.nsfw.may-blank,
            .thumbnail.invisible-when-pinned.nsfw.may-blank.outbound  {display: none !important}

            /* similar thing on search page */
            .combined-search-page .may-blank.thumbnail.self,.combined-search-page .may-blank.thumbnail.default {height: 50px !important}



            .expando-button          {opacity: 0.1 !important; float:right !important}

            /* Visibility of text posts */
            .expando-button.selftext {opacity:0.1; height:50px !important; width:200px !important; float:left !important; background-image:none !important;background-color: black !important}



             /* search page */
             /*.search-result :link {display:inline-table !important}*/
             .search-result :link:not(a.option.remove) {display: inline-table !important}
             .search-result-group {max-width: none}
             .search-header-menus {float: none}
             .search-header-label {display: none}
             .combined-search-page .raisedbox h4 {opacity: 0}


            /* Video Controls for Mobile */
            video::-webkit-media-controls-panel {background: none; opacity: 1}
            video::-webkit-media-controls-overlay-play-button {opacity: 0}

            /* Video controls for Desktop */
            .reddit-video-controller-root.playback-controls       {background: rgba(0,0,0,0.75) !important; border-radius: 50px !important}
            .reddit-video-controller-root.playback-controls:hover {background: rgba(0,0,0,0.95) !important}
            .reddit-video-controller-root.playback-controls a.permalink {display: none !important}
            .reddit-video-controller-root.ended-controls, .reddit-video-controller-root.buffering-controls {background: none !important}
            .reddit-video-controller-root.ended-controls .centered span.replay-video {display: none !important}
            .reddit-video-controller-root.playback-controls .reddit-video-seek-bar-root .seek-bar-thumb {opacity: 1 !important}
            .reddit-video-controller-root.playback-controls .time-label {font-weight: bold}

            /* Video Duration Info */
            .duration-overlay {font-size: 10pt; font-weight: bold; width:auto !important; padding:2px; right:0}


            /* Stamps */
            .nsfw-stamp    {background: #d10023; color:white; font-weight:bold !important; border: 2px solid #d10023 !important;}
            .spoiler-stamp {background: black;   color:white; font-weight:bold !important; border: 2px solid black   !important;}



            /* Subreddit Name */
            body.with-listing-chooser #header .pagename {position:inherit}
            .pagename a {margin-left:4px; margin-right:4px; padding:0}
            .pagename {font-variant: normal; border-radius:0px; margin: 0 !important; padding: 0 !important}
            /* match pagename height with subreddit logo */
            .pagename   {display: inline-grid !important; height: 35px !important; align-content: center !important}
            .pagename a {vertical-align: middle !important}


            /* no margin left for expanded media */
            .entry {margin-left:0}

            /* size videos correctly */
            .no-constraints-when-pinned {min-width:0 !important; min-height: 0 !important;}

            /* OP indicator */
            .tagline .submitter, .search-result-meta .submitter {color: #228822}

            /* sort menu*/
            .menuarea {border:none}
            .dropdown.lightdrop .selected {text-decoration: none; background-image: none}

            /* Post */
            .thing .title                                  {font-weight: normal !important; color: black !important}
            .link .subreddit                               {font-weight: bold   !important}
            .link .flat-list                               {font-weight: normal !important; font-size: medium !important}
            .entry .buttons li a                           {font-weight: normal !important}

            /*revert graying-out function on hover*/
            .entry .buttons li:hover                       {opacity:1 !important}


            /* Text Posts Background/Fontcolor/Border */
            .link .usertext-body .md {color: black !important; background: none !important; border-color: var(--theme-color-new)}




            /* Space between Posts */
            .link {margin-bottom: 0px;}

            /* Expanded Post Margins */
            .expando {margin: 0}

            /* hide some buttons */
            .domain                               {display: none}
            .reportbtn                            {display: none}
            .post-crosspost-button                {display: none}
            .post-sharing-button                  {display: none}
            .buttons .give-gold.gold-give-gold    {display: none}
            .hide-button                          {display: none !important}
            .comments-page .reportbtn             {display: block}
            .profile-page  .reportbtn             {display: block}
            .comments-page .post-crosspost-button {display: block}
            .comments-page a.comments             {display: none}
            .comments-page a.embed-comment        {display: none}
            .comments-page .sendreplies-button    {display: none !important}
            .comments-page .bylink                {display: none !important}
            .comments-page .stamp                 {display: none !important}


            /* Gallery Buttons */
            .media-gallery .gallery-nav-bar         {font-size:large; display:grid}
            .media-gallery .gallery-nav-next        {text-align: right !important}
            .media-gallery .gallery-nav-prev        {text-align: left !important}
            .media-gallery .gallery-nav-back        {text-align: center !important}
            .media-gallery .gallery-nav-next:after  {content:" ▶"}
            .media-gallery .gallery-nav-prev:before {content:"◀ "}
            .gallery-navigation                     {border: none}
            .gallery-nav-disabled                   {opacity:0 !important}

            /* Rank / Scores */
            .link .rank       {display: none}
            .link .arrow.up   {display: none}
            .link .arrow.down {display: none}

            /* Header Font Size and Icon */
            #header-bottom-left                                   {font-size: large}
            #header-bottom-left                                   {margin-top: 0}
            .comments-page #header-img:not(:hover)                {opacity: 0}
            .comments-page #header-img.default-header:not(:hover) {opacity: 0}
            #header-img, #header-img.default-header               {vertical-align: bottom; margin: 0}
            #header-img                                           {max-width: 32px; max-height: 32px}

            /* Upper Bars */
            #sr-header-area                      {border-bottom: none}
            #sr-header-area .redesign-beta-optin {display:none}
            .pref-lang                           {font-weight: normal}
            #header-bottom-right                 {border-radius:0; border: none !important}
            #header-bottom-right                 {font-size: larger}
            #header                              {border:none}
            .separator                           {color: transparent}
            .tabmenu li a                        {font-weight: normal;opacity:1 !important}
            .tabmenu li.selected a               {opacity:1; font-weight: bold; border: none}



            /* Sidebar */
            .sidecontentbox .content {border: none; background: none}
            .sidebox .spacer         {display: none}
            .premium-banner          {display: none}
            .giftgold                {display: none}
            .titlebox .bottom        {border:none}
            #searchexpando, .linkinfo, .linkinfo .shortlink input  {border: none}
            .morelink .nub  {display: none}
            .morelink       {border: none; background: #eff7ff;background-image:none}
            .subscription-box:not(:hover) {opacity: 0}


            /* Comment Page */
            .comments-page .tabmenu a.choice[href*="comments"] {display:none !important}
            .panestack-title                            {padding-bottom: 0px; border-bottom: none}
            .panestack-title .title                     {font-size: large !important}
            .panestack-title::after                     {font-size: large !important}
            .commentarea .menuarea                      {font-size: large !important}
            .comments-page .dropdown-title.lightdrop    {display: none}
            .comments-page .comment .author             {font-size: unset; float: left !important; margin-right: 5px !important}
            .comments-page .comment .score              {font-size: unset; float: left !important; margin-right: 5px !important}
            .comments-page .comment .tagline .userattrs {font-size: unset; float: left !important; margin-right: 5px !important}
            .comments-page .comment .tagline time       {font-size: unset; float: left !important; margin-right: 5px !important; margin-left: 0px}
            .comments-page .comment .tagline            {margin-bottom: 26px}
            .comments-page .numchildren                 {font-size: unset; float: left !important}
            .comments-page .comment .flair              {font-size: unset; float: left !important}
            .comments-page .comment           .expand   {font-size: unset; float: left !important; margin: 0 !important; padding: 0 !important; opacity: 0.09}
            .comments-page .comment.collapsed .expand   {opacity:1}
                           .comment .midcol             {z-index:9999}
                           .comment .child              {border-left: 3px solid var(--theme-color-new)}
            .commentarea   .entry:not(:hover) .buttons  {opacity: 0}
            .comments-page #siteTable .thing            {display: flex !important;border: none}


            /* text-area */
            .commentarea > .usertext textarea {max-width: 95vw !important; height: 40px}
                           .usertext-edit     {max-width: 95vw !important; margin: 0 !important}
            .commentarea > .usertext button                               {margin: 0 !important}
            .commentarea   .md                                            {margin: 0 !important}



            .comments-page .comment .score   {visibility: visible; margin-right: 0}
            .comments-page .link .arrow.up   {display:block}
            .comments-page .link .arrow.down {display:block}
            .pinnable-content.pinned   {background-color: #FFFFFFF7 !important;box-shadow: none !important}
            .reddiquette               {display: none}
            .edited-timestamp          {color: red}

            .comments-page   .expando-button  {opacity: 1 !important}
            /* without this voting comments on mobile is impossible */
            .comments-page  .entry           {margin-left:4px}



            /* mark controversial comments even when logged-out */
            .comment.controversial>.entry .score:after {content: "†"; position: relative; top: -2px}

            /* bigger profile picture next to post */
            /* .link .reddit-profile-picture {width: 33px !important; height: 33px !important} */


            /* submissions */
            .formtabs-content .infobar   {border:none}
            .content.submit .info-notice {display: none}
            #items-required              {display: none}


            /* Bottom Page */
            .footer        {display:none}
            .footer-parent {opacity:0}
            .debuginfo     {display:none}
            .bottommenu    {display:none}

            /* Navbar */
            .nav-buttons {
             position: fixed;
             display:table;
             bottom: 0 !important;
             right: 0 !important;
             text-align: center !important;
             font-size: larger;
             z-index: 1000000 !important;
             }
            .nextprev a {background:none !important}


            /* promoted posts/ads */
            .link.promotedlink.promoted, .link.promotedlink.external {display:none !important}
            .mobile-web-redirect-bar                                 {display:none !important}


            .email-collection-banner, .email-verification-tooltip, #eu-cookie-policy {display:none !important}
            .infobar.listingsignupbar, .infobar.commentsignupbar {display: none !important;}
            .infobar, .timeout-infobar {border:none}
            .help-hoverable {display:none}
            /*.reddit-infobar.with-icon {min-height: 35px !important;padding: 0 0 0 55px !important;height: 35px !important;}*/
            /*.reddit-infobar.with-icon:not(:hover) {min-height: 0 !important;padding: 0 0 0 55px !important;margin: 0 !important;height: 9px !important;opacity:0 !important}*/

             /* chat window */
             .chat-app-window.regular {width: 100%; height: 70%}
             .chat-app-window {right: 0; border: none; border-radius: 0}


             /* Turn off custom subreddit styles */
             #header, #header:hover   {background-image: none !important}
             .link          {padding: 0}
             .thumbnail, .thumbnail img {max-width: none; max-height: none; transform: none}
             .link .entry .buttons li a.comments {color:#000000c7 !important}
             .link.odd, .link.even {padding: 0 !important; margin-right: 0px !important}
             body > .content {max-width: none !important}
             html body div#header div#header-bottom-left span.pagename a {font-size: 1.2em !important; padding: 0; padding-right: 0; height: 0}
             span.hover.pagename.redditname {font-size: 1.2em !important}
             #header-bottom-left #header-img-a {margin: 0}
             .pagename a {line-height: 0px; background: none}
             .pagename a {border: none}
             #header .pagename a {line-height: 0px}
             #header .pagename > a {color: black !important}
             .link > .thumbnail {border-radius:0 !important}
             * {text-shadow: none !important}
             .title {color:black !important}
             .thing.link .title a.title {color: black !important}
             body {border: none}
             .tabmenu li.selected a {opacity: 1 !important;color: #ff4500 !important; border: none !important}
             #header-bottom-left .tabmenu {left: 0 !important}
             #header {margin: 0 !important}
             #header .tabmenu li a {border: none}
        `);
    //////////////////////////////// over 18 button ///////////////////////////////////////////////////////

    const button = document.querySelector('button.c-btn.c-btn-primary[type="submit"][name="over18"][value="yes"]');
    if (button) {button.click();}

    //////////////////////////////// auto-click on NSFW-disclaimers ////////////////////////////////////////

    (function() {
        'use strict';
        // Function to click on elements with class 'expando-gate__show-once'
        function clickExpandoGate() {
            var elements = document.querySelectorAll('.expando-gate.expando-gate--overlay, .expando-gate.expando-gate--interstitial');
            elements.forEach(function(element) {
                if (!element.dataset.expandoClicked) {
                    element.click();
                    element.dataset.expandoClicked = true;
                }
            });
        }
        // Create a MutationObserver to watch for changes in the DOM
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                // Check if the target node or its descendants have elements with class 'expando-gate__show-once'
                if (mutation.target.matches('.expando-gate.expando-gate--overlay') || mutation.target.querySelector('.expando-gate.expando-gate--overlay')) {clickExpandoGate();}
                // embedded youtube-videos need this
                if (mutation.target.matches('.expando-gate.expando-gate--interstitial') || mutation.target.querySelector('.expando-gate.expando-gate--interstitial')) {clickExpandoGate();}
            });
        });
        // Define the configuration for the MutationObserver
        var config = { subtree: true, childList: true };
        // Start observing the document with the specified configuration
        observer.observe(document.body, config);
        // Initial click on elements with class 'expando-gate__show-once'
        clickExpandoGate();
    })();

    GM_addStyle(`.expando-gate.expando-gate--overlay {display:none !important}`);

    /////////////////////////////// auto-click download link after opening the rapidsave page ///////////////
    const dbutton = document.querySelector('.downloadbutton');
    if (dbutton) {
        dbutton.click();
    }

})();

////////////////////////////////////// comments page //////////////////////////////////

var commentpage = /https:\/\/.*\.reddit\.com\/.*\/comments\/.*/;
if (commentpage.test(window.location.href)) {


    ////////////////////////////////// Download Button ////////////////////////////////////

    'use strict';

    function downloadVideo() {
        var postUrl = window.location.href;
        var baseUrl = 'https://rapidsave.com/info?url=';
        var downloadUrl = baseUrl + encodeURIComponent(postUrl);
        window.open(downloadUrl, '_blank');
    }

    function createDownloadButton() {
        var listItem = document.createElement('li');
        listItem.classList.add('reddit-video-download-button');

        var button = document.createElement('button');
        button.innerHTML = 'download ⤓';
        button.style.color = 'var(--action-button-color)';
        button.style.background = 'none';
        button.style.border = 'none';
        button.style.fontSize = 'inherit';
        button.style.margin = 'inherit';
        button.style.padding = 'inherit';
        // button.style.borderRadius = '10px';
        button.style.fontWeight = 'inherit';
        button.style.height = 'inherit';
        button.style.textTransform = 'none';
        button.onclick = downloadVideo;

        listItem.appendChild(button);

        var buttonsList = document.querySelector('ul.buttons');
        if (buttonsList) {
            buttonsList.appendChild(listItem);
        }
    }

    createDownloadButton();


    /////////////////////add profile pictures next to comments ///////////////////////

//     const addAvatars = async (root = document) => {
//         Array.from(root.querySelectorAll('.thing:not(.morechildren)')).forEach(async (thing) => {
//             if (!thing) return;
//             if (thing.hasAttribute('data-reddit-profile-picture')) return;
//             const img = document.createElement('img');
//             img.classList.add('reddit-profile-picture');
//             img.style.height = '22px';
//             img.style.width = '22px';
//             img.style.float = 'left';
//             img.style.margin = '0px';
//             thing.insertBefore(img, thing.querySelector('.entry'));
//             thing.setAttribute('data-reddit-profile-picture', 1);
//             if (!thing.id) return;
//             const authorElement = thing.querySelector('.author');
//             if (authorElement && authorElement.href) {
//                 const xhr = new XMLHttpRequest();
//                 xhr.open('GET', `${authorElement.href}/about.json`);
//                 xhr.addEventListener('load', async () => {
//                     if (xhr.status === 200) {
//                         try {
//                             const profile = JSON.parse(xhr.responseText).data;
//                             const ta = document.createElement('textarea');
//                             ta.innerHTML = profile.icon_img;
//                             img.src = ta.value;
//                         } catch (error) {
//                             // Error parsing JSON or extracting URL
//                             console.error('Error parsing JSON or extracting URL:', error);
//                             removeAvatar(img);
//                         }
//                     } else {
//                         // Non-200 status, handle error
//                         console.error('Error fetching user data:', xhr.status, xhr.statusText);
//                         removeAvatar(img);
//                     }
//                 });
//                 xhr.addEventListener('error', () => {
//                     // Network error
//                     console.error('Network error while fetching user data.');
//                     removeAvatar(img);
//                 });
//                 xhr.send();
//             }
//         });
//     };

//     const removeAvatar = (imgElement) => {
//         if (imgElement && imgElement.parentNode) {
//             imgElement.parentNode.removeChild(imgElement);
//         }
//     };

//     addAvatars();

//     const mo = new MutationObserver((muts) => {
//         muts.forEach((mut) => {
//             Array.from(mut.addedNodes).forEach((node) => {
//                 if (node instanceof HTMLElement) {
//                     addAvatars();
//                 }
//             });
//         });
//     });
//     mo.observe(document.body, { childList: true, subtree: true });
 };

////////////////////////////// userpage ///////////////////////////////////////////////////////////////////

var userpage = /https:\/\/.*\.reddit\.com\/user\/.*/;
if (userpage.test(window.location.href)) {

    GM_addStyle(`.comment, .content .details {border-bottom: 2px solid var(--theme-color-new) !important}`);

    const addProfilePictures = async (root = document) => {
        Array.from(root.querySelectorAll('.pagename')).forEach(async (pagename) => {
            if (!pagename) return;
            if (pagename.hasAttribute('data-reddit-profile-picture')) return;

            const username = pagename.textContent.trim();
            if (!username) return;

            const img = document.createElement('img');
            img.classList.add('reddit-profile-picture');
            img.style.height = '35px';
            img.style.width = '35px';
            img.style.verticalAlign = 'middle';


            pagename.parentNode.insertBefore(img, pagename.nextSibling);

            pagename.setAttribute('data-reddit-profile-picture', 1);

            const xhr = new XMLHttpRequest();
            xhr.open('GET', `https://www.reddit.com/user/${username}/about.json`);
            xhr.addEventListener('load', async () => {
                const profile = JSON.parse(xhr.responseText).data;
                const ta = document.createElement('textarea');
                ta.innerHTML = profile.icon_img;
                img.src = ta.value;
            });
            xhr.send();
        });
    };

    addProfilePictures();

    const mo = new MutationObserver((muts) => {
        muts.forEach((mut) => {
            Array.from(mut.addedNodes).forEach((node) => {
                if (node instanceof HTMLElement) {
                    addProfilePictures(node);
                }
            });
        });
    });

    mo.observe(document.body, { childList: true, subtree: true });

};


//////////////////////////////////////////// red numbers if score is less than one //////////////////////////////////////

if (userpage.test(window.location.href) || commentpage.test(window.location.href)) {
    (function() {
        'use strict';

        // Function to check if the text starts with a "-" or "0"
        function startsWithNegativeSymbolOrZero(text) {
            return text.trim().startsWith('-') || text.trim().startsWith('0');
        }

        // Get all elements with class "score likes"
        var scoreElements = document.querySelectorAll('.comment .score');

        // Iterate over each score element using forEach
        scoreElements.forEach(function(scoreElement) {
            var scoreText = scoreElement.textContent.trim();

            // Check if the score starts with a "-" or "0"
            if (startsWithNegativeSymbolOrZero(scoreText)) {
                // Change the color to red
                scoreElement.style.color = 'red';
                scoreElement.style.fontWeight = 'bold';
            } else if (parseFloat(scoreText) > 1) {
                // Change the color to green
                scoreElement.style.color = 'green';
                scoreElement.style.fontWeight = 'bold';
            }
        });
    })();
}
////////////////////////////// open links in new tab, sorts comments by new, gray-out comments button if there are no comments /////////////////////////////////
if (!commentpage.test(window.location.href)) {
    'use strict';

    const removeCommentsCount = element => {
        const text = element.textContent.trim();
        if (!isNaN(parseInt(text.charAt(0), 10))) return;
        element.closest('.entry .buttons li a').style.opacity = '0.1';
    };

    const openInNewTab = element => {
        element.setAttribute('target', '_blank');
    };

    const modifyCommentLink = element => {
        element.addEventListener('click', event => {
            event.preventDefault(); // Prevent the default action (navigation) for now
            const url = new URL(element.href); // Parse the current URL
            url.searchParams.set('sort', 'new'); // Add or update the "sort=new" parameter
            window.open(url.toString(), '_blank'); // Open the updated URL in a new tab
        });
    };

    const commentElements = document.querySelectorAll('a.comments');
    const postTitleElements = document.querySelectorAll('.thing .title');
    const postLinkElements = document.querySelectorAll('.link .title');
    const postauthorElements = document.querySelectorAll('.author');
    const subredditElements = document.querySelectorAll('.subreddit');

    commentElements.forEach(removeCommentsCount);
    commentElements.forEach(modifyCommentLink);
    postTitleElements.forEach(openInNewTab);
    postLinkElements.forEach(openInNewTab);
    postauthorElements.forEach(openInNewTab);
    subredditElements.forEach(openInNewTab);

    const observer = new MutationObserver(mutationsList => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const newCommentElements = mutation.addedNodes;
                newCommentElements.forEach(node => {
                    if (node instanceof HTMLElement) {
                        const element = node.querySelector('a.comments');
                        const element2 = node.querySelector('.author');
                        const element3 = node.querySelector('.subreddit');
                        if (element) {
                            removeCommentsCount(element);
                            modifyCommentLink(element); // Apply modification for new comment links
                        }
                        if (element2) {openInNewTab(element2);}
                        if (element3) {openInNewTab(element3);}
                    }
                });
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

/////////////////////////////////////////////////Thumbnail Click Functionality //////////////////

// Custom CSS for the clicked thumbnail
const customCSS = `
      /* Makes Clicking Easier */
      .thumbnail {z-index:99}

      .thumbnail.clicked {
        width:  80px !important;
        height: 80px !important;
        opacity:0.5;
      }

      .thumbnail.clicked img {
        width:  80px !important;
        height: 80px !important;
      }

      .thing.clicked  .arrow.up {display: block}
      .thing.clicked  .arrow.down {display:block}
    `;

function expandPostOnElementClick(element) {
    const expandoButton = element.closest('.thing').querySelector('.expando-button');

    if (expandoButton) {
        expandoButton.click();
    }
}

function handleElementClick(event) {
    event.stopPropagation();
    event.preventDefault();

    const element = event.currentTarget;
    const thumbnail = element.closest('.thumbnail');
    const thing = element.closest('.thing');

    // Check if the thumbnail has the 'clicked' class
    const isClicked = thumbnail.classList.contains('clicked');

    if (isClicked) {
        // Remove the 'clicked' class to revert the changes
        thumbnail.classList.remove('clicked');
        thing.classList.remove('clicked');
    } else {
        // Add 'clicked' class to the thumbnail
        thumbnail.classList.add('clicked');
        thing.classList.add('clicked');
    }

    expandPostOnElementClick(element);
}

function attachClickListenersToElements() {
    const elements = document.querySelectorAll('.thumbnail, img[src*="external-preview.redd.it"]');

    elements.forEach((element) => {
        element.addEventListener('click', handleElementClick);
    });
}

// Add custom CSS styles
GM_addStyle(customCSS);

// Attach click listeners to elements initially
attachClickListenersToElements();

// Create a MutationObserver to monitor the page for changes
const observer = new MutationObserver(() => {
    // Attach click listeners to elements whenever new content is added to the page
    attachClickListenersToElements();
});

// Start observing the document for changes
observer.observe(document, { childList: true, subtree: true });


////////////////////////////////////// Subreddit Icon next to Subreddit name /////////////////////////

// (function() {
//     'use strict';

//     function setSubredditIcon() {
//         const pagenameLink = document.querySelector('.pagename');
//         const subredditIcon = document.createElement('img');
//         subredditIcon.style.verticalAlign = 'middle';
//         subredditIcon.style.width = 'auto';
//         subredditIcon.style.height = '35px';
//         subredditIcon.classList.add('subreddit-icon');

//         const srName = getSrName();

//         const srDataUrl = `https://www.reddit.com/r/${srName}/about.json`;
//         fetch(srDataUrl)
//             .then(response => response.json())
//             .then(data => {
//             const communityIcon = cleanUpCommunityIcon(data.data.community_icon);
//             const iconUrl = communityIcon || data.data.icon_img || data.data.header_img;
//             if (!iconUrl || iconUrl.length === 0)
//             {
//                 return;
//             }
//             subredditIcon.src = iconUrl;
//             pagenameLink.parentNode.insertBefore(subredditIcon, pagenameLink.nextSibling);
//         })
//     }
//     function getSrName() {
//         const srNameRegex = /https:[/][/](www|old|new)[.]reddit[.]com[/]r[/](\w+)/g;
//         const match = srNameRegex.exec(document.location.href);

//         return match[2];
//     }
//     function cleanUpCommunityIcon(url) {
//         if (!url || url.length === 0) {
//             return url;
//         }
//         function htmlDecode(input) {
//             const doc = new DOMParser().parseFromString(input, 'text/html');
//             return doc.documentElement.textContent;
//         }
//         const decodedUrl = htmlDecode(url);
//         return decodedUrl;
//     }
//     setSubredditIcon();
// })();
//////////////////////////////// add button that redirects to the new.reddit.com version of the page //////////////////////////

function changeUrl() {
    // Replace "old" with "new" in the current URL
    var oldUrl = window.location.href;
    var newUrl = oldUrl.replace('old', 'new');
    // Open the new URL in the same window
    window.location.href = newUrl;
}

function createChangeUrlButton() {
    var button = document.createElement('button');
    button.innerHTML = 'new.reddit';
    button.style.color = 'var(--tab-text-color)';
    button.style.background = 'transparent';
    button.style.border = 'none';
    button.style.fontSize = 'inherit';
    button.onclick = changeUrl;
    // Add the button to the document body
    document.body.appendChild(button);
}

// Call the function to create the "Change URL" button
createChangeUrlButton();

/////////////////////////////////////////// sort subreddits by new ///////////////////////////////////////////
(function() {
    'use strict';
    const re = /https?:\/\/(?:www\.|old\.|new\.)?reddit\.com/i;
    for (var i=0, l=document.links.length; i<l; i++) {
        if (re.test(document.links[i].href)) {
            var path = document.links[i].pathname;
            if (path === '/' || path.startsWith('/r/')) {
                var pathlen = path.split('/').length - 1 - (path.endsWith('/') ? 1 : 0);
                if ((pathlen <= 2) && (document.links[i].closest('.tabmenu') === null)) {
                    document.links[i].href += path.endsWith('/') ? 'new/' : '/new/';
                }
            }
        }
    }
})();