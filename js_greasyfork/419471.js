// ==UserScript==
// @name sqwok.im hydar's dark theme
// @namespace http://www.w3.org/1999/xhtml
// @version 0.0.16
// @description A simple theme to give a dark look to sqwok while keeping the original design language. Currently still work in progress.
// @license CC-BY-4.0
// @grant GM_addStyle
// @run-at document-start
// @include https://sqwok.im*/*
// @downloadURL https://update.greasyfork.org/scripts/419471/sqwokim%20hydar%27s%20dark%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/419471/sqwokim%20hydar%27s%20dark%20theme.meta.js
// ==/UserScript==

(function() {
let css = `
    :root {
        --bg-lightest:      #333745;
        --bg-lighter:       #22242c;
        --bg-color:         #17191f;
        --border-color:     #778;
        --accent-color:     #00B0F4;
        --accent-darker:    #213548;
        --link-color:       #00B0F4;
        --sqwok-light:      #F7F7F8;
        --ui-main-text:     #fefefe;
        --test:             #f00;
        
    }
    
    /* main stuff */
    main {
        background-color: var(--bg-color);
        color: #fefefe
    }
    
    a {
        border-color: var(--border-color);
    }
    
    
    /* ettor 404 "back to sqwok" button */
    
    .bm a {
        background-color: #F7F7F8;
        color: #000;
    }
    .bm a:hover {
        background-color: #EAECF0;
        color: #333;
    }

    /* homepage loading */
    
    .__25a55__container {
        border-color: var(--border-color)
    }
    
    
    /* top header */
    .__a6d36 {
        background-color: var(--bg-lighter);
        box-shadow: none
    }


    /* right panel */
    .__83412__panel {
        color: #fefefe;
        border-color: var(--border-color);
        overflow: hidden
    }


    /* left panel */
    .__6fb92 {
        overflow: hidden;
    }


    /* "following" panel */
    .__d4fc5__list {
        overflow: hidden
    }

    .__d4fc5__header,
    .__d4fc5__item {
        color: #ddd
    }

    .__d4fc5__item-subtitle {
        color: #888
    }


    /* "hello friend" panel */
    .__6fb92__cta,
    .__6fb92__cta--inverse,
    .__6fb92__cta h1,
    .__6fb92__cta p {
        background-color: var(--bg-lighter);
        color: #ddd
    }

    /* "spice things up." panel */
    .__d4fc5__cta h1,
    .__d4fc5__cta p {
        color: #ddd
    }




    /* * * HOMEPAGE / PROFILE SPECIFIC * * */
    /* homepage sorting header */
    .__1fca0__controls {
        color: #eee;
        border-color: var(--border-color)
    }


    /* homepage thread list */
    .__1fca0__post {
        border-style: solid;
        border-width: 1px 0px;
        border-color: transparent
    }

    .__1fca0__post:active,
    .__1fca0__post:focus,
    .__1fca0__post:hover,
    .__1fca0__post:target {
        background-color: #252831;
        border-style: solid;
        border-width: 1px 0px;
        border-color: var(--border-color)
    }


    .__1fca0__post-title {
        color: #fefefe;
    }

    .__1fca0__post-title a {
        color: var(--link-color);
    }

    .__1fca0__post-title a:visited {
        color: var(--link-color);
    }


    .__1fca0__meta,
    .__1fca0__meta a {
        color: #888;
    }


    /* copy url menu */
    .__4ed84__trigger {
        background-color: var(--bg-color);
        border-color: #555;
        color: #fff;
        box-shadow: none
    }

    .__4ed84__trigger:active,
    .__4ed84__trigger:focus,
    .__4ed84__trigger:hover,
    .__4ed84__trigger:target {
        background-color: var(--bg-color);
        border-color: var(--border-color);
        color: #fff;
        box-shadow: none
    }

    .__4ed84__menu button {
        background-color: #F7F7F8;
        color: #000
    }

    /* profile view and post creation */
    .__1fca0__submit {
        border-color: var(--border-color)
    }

    .__665b3__textarea {
        color: #fff
    }
    

    .__665b3--inline .__665b3__button {
        background-color: #f7f7f8;
        color: #000
    }
    


    /* * * POSTS SPECIFIC * * */
    
    
    .__6b231__media-container {
        border-top: solid 1px var(--border-color);
        border-bottom: solid 1px var(--border-color)
    }
    
    .__6b231__text a{
        color: var(--link-color)
        
    }
    .__6b231__meta p {
        color: #eee;
    }

    .__6b231__meta h1 {
        color: #fff
    }

    .__6b231__meta-publisher span {
        color: #888
    }

    .__6b231__subtitle {
        color: #888
    }




    /* * * CHAT SPECIFIC * * */

    
    .__808a6__intro-text {
        color: #ddd
    }
    
    .__808a6__intro-text button {
        color: var(--accent-color)
    }
    
    
    .__808a6__submit-richtext {
        color: #eee
    }


    .__808a6__jump-to-bottom {
        color: #000;
        background-color: #F8F8F9
    }

    .__808a6__jump-to-bottom:hover {
        color: #000;
        background-color: #EAECF0
    }
    
    
    .__808a6__typing--active {
        background-color: var(--bg-color);
        color: #bbb
    }

    .__808a6__message:active,
    .__808a6__message:focus,
    .__808a6__message:hover,
    .__808a6__message:target {
        background-color: var(--bg-lighter);
    }
    
    /* chat content */
    .__808a6__message-text {
        color: #ddd
    }

    .__808a6__message-mention {
        background-color: var(--accent-darker);
        color: var(--accent-color)
    }

    .__665b3__mention {
        background-color: var(--accent-darker);
        color: var(--accent-color)
    }

    .__808a6__message-blockquote {
        color: #aaa
    }

    .__808a6__message-url {
        color: var(--link-color)
    }

    .__808a6__message-blob {
        color: #eeeeee;
        background-color: var(--bg-lighter);
        border-color: #3D4352
    }
    
    /* Mention panel */
    .__3e201__list {
        background-color: var(--bg-lighter)
    }
    
    .__3e201__button--selected, .__3e201__button:hover {
        background-color: var(--bg-lightest)
    }
    
    .__3e201__button--selected
    .__3e201__button-cta,
    .__3e201__button:hover
    .__3e201__button-cta {
        background-color: var(--bg-lighter);
        color: #fff
    }

    /* right "people" panel */
    .__cb89e__list {
        overflow: hidden;
    }



    /* * * MOBILE SPECIFIC * * */
    .__83412__tabs {
        background-color: var(--bg-color);
        border-color: var(--border-color)
    }


    .__83412__tab {
        color: #bbb
    }

    .__83412__tab--active,
    .__83412__tab:hover {
        color: #eee
    }

    .__1fca0__post--active {
        background-color: #252831
    }
    
    .__1fca0__post--active::before,
    .__1fca0__post:active::before,
    .__1fca0__post:hover::before {
        background-color: var(--sqwok-light)
        
    }
    
    .__1fca0__post {
        border-style: solid;
        border-width: 1px 0px;
        border-color: transparent;
    }


    /* * * FOOTER * * */
    .__10012 {
        box-shadow: none
    }
    
    .__10012:after {
        font-weight: 700;
        font-size: var(--font-smallest);
        font-family: var(--font-primary);
        line-height: 130%;
        color: #AFB1B6;
        content: "    hydar's dark theme v0.1.16"   
    }
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
