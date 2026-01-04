// ==UserScript==
// @name         YouTube Custom Watch Page UI
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Modify YouTube watch page UI to match provided layout
// @author       You
// @match        *://www.youtube.com/watch*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/515839/YouTube%20Custom%20Watch%20Page%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/515839/YouTube%20Custom%20Watch%20Page%20UI.meta.js
// ==/UserScript==

GM_addStyle(`
    /* Center video player */
    #player {
        max-width: 60%;
        margin: auto;
        padding-top: 20px;
    }

    /* Style video title, align it centrally */
    #container h1.title {
        font-size: 1.5rem;
        text-align: center;
        color: white;
    }

    /* Hide sidebar recommendations */
    #secondary {
        display: none !important;
    }

    /* Expand main content to fill space left by sidebar */
    #primary {
        width: 100% !important;
    }

    /* Style the comments section to resemble the image */
    #comments {
        background-color: #1a1a1a;
        color: white;
        padding: 15px;
        border-radius: 8px;
        margin-top: 20px;
    }

    /* Adjust the comment text and spacing */
    #comments #sections {
        padding: 10px 20px;
    }
    ytd-comment-renderer #content-text {
        color: #ddd !important;
    }

    /* Styling recommendation thumbnails to align horizontally */
    #related {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        background-color: #111;
        padding: 10px;
    }
    #related ytd-compact-video-renderer {
        width: 180px;
        margin: 5px;
    }

    /* Custom style for the sidebar logo */
    ytd-video-primary-info-renderer .ytd-video-primary-info-renderer {
        background-image: url('https://your-image-url-here.png');
        background-repeat: no-repeat;
        background-position: center;
        padding: 50px;
        margin-bottom: 20px;
    }

    /* Hide irrelevant page elements for a cleaner look */
    #info-contents, #meta, ytd-merch-shelf-renderer, ytd-watch-next-secondary-results-renderer, ytd-masthead-ad-v3, #below {
        display: none !important;
    }

    /* Darken background color */
    body, #page-manager, ytd-app {
        background-color: #181818 !important;
        color: white !important;
    }
    
    /* Thumbnail image adjustments for recommended videos */
    ytd-thumbnail img {
        border-radius: 10px;
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
    }
`);
