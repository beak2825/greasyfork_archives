// ==UserScript==
// @name         Skurk Wardrobe
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @run-at       document-start
// @author       Skurk52 [2632461]
// @match        https://www.torn.com/item.php
// @description  A place to try on new clothes :)
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @grant        unsafeWindow
// @license      MIT
// @sandbox      JavaScript
// @downloadURL https://update.greasyfork.org/scripts/515418/Skurk%20Wardrobe.user.js
// @updateURL https://update.greasyfork.org/scripts/515418/Skurk%20Wardrobe.meta.js
// ==/UserScript==

let equipped_items, title_div, main_section, model_view, skurk_inner_container
const delay = ms => new Promise(res => setTimeout(res, ms));

function init_open_state() {
}
function toggle_state() {

}
function add_main_ui() {
    // Create the main container div for Quick Items
    const SkurkWardrobeDiv = document.createElement('div');
    SkurkWardrobeDiv.id = 'skurkWardrobe';
    SkurkWardrobeDiv.className = 'tt-container collapsible rounding spacer compact skurk-wardrobe-bg';

    // Create the title section
    const title_div = document.createElement('div');
    title_div.className = 'title';

    const textDiv = document.createElement('div');
    textDiv.className = 'text';
    textDiv.textContent = 'Skurk Wardrobe';

    const icon = document.createElement('i');
    icon.className = 'icon fas fa-caret-right';

    title_div.appendChild(textDiv);
    title_div.appendChild(icon);

    // Create the main content section (initially hidden)
    const main_section = document.createElement('main');
    main_section.className = 'background';

    // Create inner content with a sample item
    skurk_inner_container = document.createElement('div');
    skurk_inner_container.className = 'inner-content';

    // Create the response-wrap div
    const responseWrapDiv = document.createElement('div');
    responseWrapDiv.className = 'response-wrap';

    // Assemble the main section
    main_section.appendChild(skurk_inner_container);
    main_section.appendChild(responseWrapDiv);

    // Assemble the main container
    SkurkWardrobeDiv.appendChild(title_div);
    SkurkWardrobeDiv.appendChild(main_section);

    // Insert the new element before the equipped-items-wrap element
    equipped_items.insertAdjacentElement('beforebegin', SkurkWardrobeDiv);

    // Toggle visibility of the main section on click
    title_div.addEventListener('click', () => {
        main_section.classList.toggle('expanded');
        if (main_section.classList.contains('expanded')) {
            icon.className = 'icon fas fa-caret-down';
        } else {
            icon.className = 'icon fas fa-caret-right';
        }
    });
}
function create_item() {
    const item_div = document.createElement('div');
    item_div.className = 'item';
    item_div.draggable = true;
    item_div.setAttribute('data-id', '931');
    item_div.setAttribute('title', 'Head Item');

    const picDiv = document.createElement('div');
    picDiv.className = 'pic';
    picDiv.style.backgroundImage = "url('/images/items/931/medium.png')";

    const itemTextDiv = document.createElement('div');
    itemTextDiv.className = 'text';
    itemTextDiv.textContent = 'Head Item';

    item_div.appendChild(picDiv);
    item_div.appendChild(itemTextDiv);

    skurk_inner_container.appendChild(item_div);
}

(function() {
    'use strict'; console.log(`%cSkurk%c Wardrobe`, "font-size: 19px; font-weight: 600; color: #0d55c9;","font-size: 19px; font-weight: 900;");
    window.addEventListener("load", async function() {
        await delay(25)
        equipped_items = document.querySelector('.equipped-items-wrap');
        model_view = document.getElementsByClassName('model___fOj3M')[0]
        add_main_ui();
        create_item();
        create_item();
        init_open_state();
    })
})();

GM_addStyle (`
    .skurk-wardrobe-bg .title {
        color: #fff;
        background: repeating-linear-gradient(90deg, #2b6bd1c4, #2b6bd1c4 2px, #3e6db9e6 0, #3e6db9e6 4px);
        border-radius: 5px 5px 0 0
    }
    #skurkWardrobe main {
        display: none;
    }
    #skurkWardrobe main.expanded {
        display: block;
    }
    #skurkWardrobe .inner-content {
        width: 100%;
        box-sizing: border-box;
        padding: 0px 5px 5px;
    }
    body.dark-mode #skurkWardrobe .inner-content .item {
        background-color: rgb(51, 51, 51);
        border-width: 1px;
        border-style: solid;
        border-color: rgb(68, 68, 68);
        border-image: initial;
    }
    #skurkWardrobe .inner-content .item {
        display: inline-block;
        cursor: pointer;
        position: relative;
        padding: 5px;
        border-radius: 5px;
        margin: 5px 5px 0px 0px;
    }
    #skurkWardrobe .inner-content .item .pic {
        width: 60px;
        height: 30px;
        background-size: cover;
        margin: auto;
    }
    #skurkWardrobe .inner-content .item .text {
        text-align: center;
    }
    #skurkWardrobe .inner-content .item .tt-close-icon {
        opacity: 0;
        position: absolute;
        top: 3px;
        right: 3px;
        color: rgb(167, 167, 167);
    }
    body:not(.dark-mode) #skurkWardrobe .inner-content .item {
        background-color: white;
        border-width: 1px;
        border-style: solid;
        border-color: lightgray;
        border-image: initial;
    }
`);