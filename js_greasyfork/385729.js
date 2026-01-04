// ==UserScript==
// @name         FGO Servant Column Layout
// @version      0.1.1
// @description  2-column layout for GamePress servant pages.
// @author       Rukako
// @namespace    rukako
// @match        https://grandorder.gamepress.gg/servant/*
// @grant        none
// @require      https://unpkg.com/crel@4.0.1/crel.min.js
// @downloadURL https://update.greasyfork.org/scripts/385729/FGO%20Servant%20Column%20Layout.user.js
// @updateURL https://update.greasyfork.org/scripts/385729/FGO%20Servant%20Column%20Layout.meta.js
// ==/UserScript==

/* globals $, $$, crel */

(function() {
    'use strict';
    const toArray = (x) => Array.prototype.slice.call(x, 0);
    const $ = (a, b) => typeof b == 'undefined' ? document.querySelector(a) : a.querySelector(b);
    const $$ = (a, b) => toArray(typeof b == 'undefined' ? document.querySelectorAll(a) : a.querySelectorAll(b));

    const servantLayout = $('.servant-new-layout');
    //servantLayout.classList.add('pure-g');

    // un-nest these divs because each section needs to be a direct child of .servant-new-layout.
    ['status', 'analysis', 'profile'].map(x => $('#'+x)).map(el => [el, Array.from(el.children)])
    .forEach( ([el, children]) => {
        children.forEach(c => {
            el.parentNode.insertBefore(c, el);
        });
    });

    // group by titles so we can use a grid layout.
    // this ensures a section's text is placed with its section header.
    const newGridDiv = () => crel('div');//, {'class': 'pure-u-1-2'});
    let currentSection = newGridDiv();
    Array.from(servantLayout.childNodes).forEach((el) => {
        if (el.classList && el.classList.contains('main-title')) {
            // if this is a header and the previous section is non-empty
            if (currentSection.children.length || currentSection.textContent.trim() !== '') {
                // and it is not an inline table of contents
                if (!/^table-of-contents-/.test(currentSection.id) || currentSection.id == 'table-of-contents-0')
                    servantLayout.appendChild(currentSection);
                    // insert the section.
            }
            currentSection = newGridDiv();
            currentSection.id = el.id; // move the ID attribute from the heading to the div.
            el.removeAttribute('id');
        }
        currentSection.appendChild(el);
    });
    servantLayout.appendChild(currentSection);

    // set each element's row height based on its actual height.
    Array.from(servantLayout.children).forEach(el => {
        if (el.id == 'section-overview')
            el.style.gridColumn = '1';
        el.style.gridRow = 'span ' + (Math.round(el.clientHeight / 200));
    });

    // display the main TOC inserted by better servant pages.
    $$('.better-toc').forEach(el => el.classList.remove('hidden'));

    // warning if supporting userscript not loaded.
    if (!window.BETTER_GAMEPRESS_FGO) {
        $('#block-gamepressbase-content > article').insertAdjacentHTML('afterbegin',`
<div id="userscript-warning" style="background-color: #ffe0e0;"><h2 class="main-title" style="background-color: #bd5700;    border-left-color: #770000;">Userscript Warning (Servant Column Layout)</h2>
<div style="margin: 8px;">
<p>The userscript "Servant Column Layout" has been loaded without a compatible version of "Better GamePress FGO". </p>
<p>This is <b>not supported</b> and functionality is likely broken.</p>
<p>&#x25B6; Please double-check Better GamePress FGO is installed
<a href="https://greasyfork.org/en/scripts/384559-better-gamepress">from Greasy Fork</a> and up-to-date.
If you already have it installed, make sure it is loaded before this script (<a href="https://i.imgur.com/2g8Nvsf.png">see here</a>).</p>
<p>If you are still having trouble, ask in <a href="https://community.gamepress.gg/t/better-table-of-contents/19049">the thread</a> or message <a href="https://community.gamepress.gg/u/Rukako/">me (Rukako)</a>.</p>
</div>
</div>`);
    }

    const css = `
@media only screen and (min-width: 1270px) {
    .outer-wrapper {
        max-width: unset;
        width: 99%;
    }

    main.outer-wrapper {
        display: flex;
        justify-content: space-between;
    }

    main.outer-wrapper::after {
        display: none;
    }

    #sidebar-second {
        width: 220px;
    }

    section#content {
        flex: 1;
    }

    #page-title h1 {
        font-size: 27pt;
        margin-top: 0;
    }

    .servant-new-layout {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        grid-column-gap: 10px;
        align-items: start;
        /*grid-auto-rows: 1fr;*/
        grid-auto-flow: row;
    }

    .servant-new-layout > div {
        margin-bottom: 15px;
    }

    .servant-new-layout .main-title {
        margin-top: 0;
    }

    #table-of-contents-0 > h2:first-of-type { display: none; }
    #table-of-contents-0 > .servant-tabs { display: none; }
    #table-of-contents-1, #table-of-contents-2, #table-of-contents-3, #table-of-contents-4 { display: none; }


    #block-views-block-latest-featured-content-block-1, #block-quicklinks {
        width: 550px;
        margin: 0 auto;
    }
}


    .main-toc {
        display: grid;
        grid-template-columns: 9em minmax(0, 1fr);
        grid-column-gap: 6px;
        grid-row-gap: 10px;
        margin-bottom: 10px;

    }

    .main-toc-section {
        display: grid;
        vertical-align: middle;
        grid-template-columns: repeat(auto-fill, minmax(10em, 1fr));
        grid-gap: 10px;
        align-items: center;
        padding: 4px;
    }

    .main-toc a {
        width: 100%;
        border: 1px solid #5e71c7;
        display: block;
        color: #5e71c7;
        text-align: center;
        border-radius: 2px;
        cursor: pointer;
        padding: 8px;
        transition: color 150ms ease;

        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }

    .main-toc a:hover {
        color: white;
        background: #5e71c7;
    }

    .main-toc > a {
        height: 100%;
        display: table;
        font-size: 110%;
    }

    .main-toc > a > span {
        display: table-cell;
        vertical-align: middle;

    }

    .main-toc-section a {
        padding: 4px;
/*         height: 2.2em; */
/*         line-height: 2.2em; */
    }
`;
    document.head.appendChild(crel('style', css));



})();