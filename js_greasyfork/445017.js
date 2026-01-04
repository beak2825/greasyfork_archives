// ==UserScript==
// @name         HoH night gang
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  A dark/night mode for neorice.com, which also follows a more contemporary design.
// @author       EveVon
// @match        http://neorice.com/*
// @icon         none
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445017/HoH%20night%20gang.user.js
// @updateURL https://update.greasyfork.org/scripts/445017/HoH%20night%20gang.meta.js
// ==/UserScript==
/* jshint esversion: 6 */
(function() {
    'use strict';

    const OLD_HEAD = document.head.innerHTML;

    const IMPORTS = `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Alef&display=swap" rel="stylesheet">`

    const STYLE = `<style type ="text/css">
    * {
        background-color: rgba(0,0,0, 0) !important;
        color: white !important;
        font-family: 'Alef', sans-serif;
        font-size: 18px;
        line-height: 1.6;
        border: none !important;
    }

    button, input[type=submit] {
        cursor: pointer;
        background-color: rgba(50, 62, 75, 1) !important;
        padding: 0.4em 0.6em;
        border-radius: 5px;
    }

    button:hover, button:focus, input[type=submit]:hover, input[type=submit]:focus {
        background-color: #e8a31e !important;
    }

    a:hover, a:focus {
        color: #e8a31e !important;
    }

    body {
        background-color: rgba(8, 9, 11, 1) !important;
        display: flex;
        flex-direction: column;
    }

    body > div {
        display: flex;
    }

    .hidden {
        display: none;
    }

    #top_container {
        min-height: fit-content;
        min-width: fit-content;
        flex-direction: column-reverse;
        margin-bottom: 2em;
    }

    #top_container * {
        display: flex;
    }

    #top_nav {
        justify-content: center;
    }

    #top {
        height: fit-content;
        width: fit-content;
        margin-bottom: 1em !important;
    }

    #container {
        display: flex;
        width: 100%;
    }

    #left_side {
        top: 50px;
        position: fixed;
    }

    #ads {
         display: none;
    }

    #nav li {
        padding-top: 5px;
        padding-bottom: 5px;
    }

    #fold_left_menu {
        margin-top: 1em;
        margin-left: 30px;
    }

    #main_content {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    #main_content > h2 > img {
        display: none;
    }

    .news_post {
        width: 900px;
        margin-bottom: 10em;
    }

    .news_post > .top {
        position: relative;
        padding-bottom: 2em;
        margin-bottom: 1em;
        background: none;
    }
    .news_post > .top > h3 {
        font-size: 25px;
    }
    .news_post > .top > .content {
        position: absolute;
        top: 3em;
        padding-top: 1em;
    }

     .news_post > .top > img {
         position: absolute;
         top: 1.5em;
         padding-top: 1em;
     }

     #comments {
         width: 900px;
     }
     .comment {
         margin-bottom: 2em;
         padding: 1em;
         border: 2px solid white !important;
         border-radius: 5px;
     }

     #comment_form {
        margin-top: 3em;
        margin-bottom: 50px;
     }

     input[type=text], textarea {
         background-color: white !important;
         border-radius: 5px;
         margin-top: 0.5em;
         margin-bottom: 0.5em;
         color: black !important;
     }

     textarea {
         width: 900px;
         height: 150px;
     }
</style>`;
    const NEW_HEAD = IMPORTS + OLD_HEAD + STYLE;

    document.head.innerHTML = NEW_HEAD;

    const LEFT_NAV = document.querySelector('#left_side');
    const LEFT_NAV_MENU = LEFT_NAV.querySelector('#nav');
    const foldButton = document.createElement('button');
    foldButton.id = 'fold_left_menu';
    foldButton.innerText = 'Fold menu';
    foldButton.addEventListener('click', () => {
        LEFT_NAV_MENU.classList.toggle('hidden');
    });

    LEFT_NAV.appendChild(foldButton);
})();