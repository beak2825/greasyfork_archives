// ==UserScript==
// @name         Wikipedia Expand Headings
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Expands all collapsed headings inside a Wikipedia page. Useful on mobile to search a text inside all article
// @author       nulll
// @license      Artistic-2.0
// @match        https://*.m.wikipedia.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474878/Wikipedia%20Expand%20Headings.user.js
// @updateURL https://update.greasyfork.org/scripts/474878/Wikipedia%20Expand%20Headings.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Button to expand all headers
    const btn = document.createElement('a');
    btn.role = 'button';
    btn.href = '#';
    btn.className = 'cdx-button cdx-button--size-large cdx-button--fake-button cdx-button--fake-button--enabled cdx-button--icon-only cdx-button--weight-quiet edit-page menu__item--page-actions-edit';
    btn.addEventListener('click', e => {
        e.preventDefault();
        const els = document.querySelectorAll('.section-heading button');
        els.forEach(el => { el.click(); });
    })

    // Button icon
    const img = document.createElement('img');
    img.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAPFBMVEVHcEwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACHr/7WAAAAE3RSTlMANDXHr/4MR9gaFJ+hDhAK9gfWdzlIPwAAAQRJREFUSMflVdkSgyAMBAQEwTP//6+Vo+V2pD6aUdENS3YkJAi91qYxGIkdJHJMET4CMDD3+WQ44NiC/hozwkCdKR5wrj045ATGmJBtyVKcE9IIg4A2Q57OIZNEZZthXTSTRE3YOsM5aCaJohbDh6ZQEFBV1RcsJaFqjB9UkVSLEYCapJIRfaYEAjqXkNMVJEmGOSoZCZnjq21dzct+wFW6RIxjW8w4b/fmn0vPblzWF5WEdXHjvN+bL8Vmf9OyHfe2QcBhl16vTm2cGnAjNQhT9eQLH5qRJ+ndf4D+O6K9RaBZZixcRmiWPl/IHpbK7mLcX+5DQ9FxQ1GthtLbsrqb4svsAy7lE9GmfkdxAAAAAElFTkSuQmCC";
    img.alt = 'Expand headings';
    img.height = 20;
    btn.append(img);

    // all buttons are inside one `<ul>`
    const li = document.createElement('li');
    li.className = 'page-actions-menu__list-item';
    li.style.cssText = '';
    li.append(btn);

    // place the button in the "toolbar" where other buttons are (change lang, edit page, ecc...)
    document.querySelector('#page-actions-edit').after(li);
})();