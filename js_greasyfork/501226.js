// ==UserScript==
// @name         Sort For PaknSave
// @namespace    Zafpyr/SortForPaknSave
// @version      0.01
// @run-at       document-load
// @description  A few improvements for the paknsave website: Add product sorting on the search page and remember sorting preferences for the search and deals pages, aswell as add a search box to the deals page.
// @author       Zafpyr
// @match        https://www.paknsave.co.nz/shop/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=paknsave.co.nz
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501226/Sort%20For%20PaknSave.user.js
// @updateURL https://update.greasyfork.org/scripts/501226/Sort%20For%20PaknSave.meta.js
// ==/UserScript==

const default_preferences = {
    'sorting': {
        'search': {},
        'deals': {}
    }
}

let preferences = localStorage.SortForPaknSave ? JSON.parse(localStorage.SortForPaknSave) : default_preferences;

let loc = window.location;
let url = new URL(loc);
let path = loc.pathname;
let doc = document;

const injectCSS = css => {
  let el = document.createElement('style');
  el.type = 'text/css';
  el.innerText = css;
  document.head.appendChild(el);
  return el;
};

const injectHTML = (parent, elem, id, _class, html, before) => {
    let el = document.createElement(elem);
    // el.type = 'text/css';
    if (typeof id !== 'undefined'){
        el.id = id;
    }
    if (typeof _class !== 'undefined'){
        el.className = _class;
    }
    if (typeof html !== 'undefined'){
        el.innerHTML = html;
    }
    if (before){
        parent.insertBefore(el, before);
    }
    else {
        parent.appendChild(el);
    }
    return el;
};

function setSelect(elem, val, data_sort, index) {
    if (typeof index !== 'undefined'){
        elem.selectedIndex = index;
    }
    else if (typeof val !== 'undefined'){
        for (let o of elem.options){
            if (typeof o !== 'undefined'){
                if (typeof data_sort !== 'undefined' & o.value === val & Number(o.getAttribute('data-sort')) === data_sort){
                    elem.selectedIndex = o.index;
                    return o;
                }
                else if (o.value === val & typeof data_sort === 'undefined'){
                    elem.selectedIndex = o.index;
                    return o;
                }
            }
        }
    }
}

const setParamsAndNav = (url, params, feat, cont) => {
    preferences = localStorage.SortForPaknSave ? JSON.parse(localStorage.SortForPaknSave) : default_preferences;
    for (let [name, val] of Object.entries(params)){
        if (typeof val !== 'undefined'){
            if (val !== ''){
                url.searchParams.set(name, val);
                    preferences[feat][cont][name] = val;
                    console.log(val);
            }
            localStorage.SortForPaknSave = JSON.stringify(preferences);
            window.location = url;
        }
    }
}


(function() {
    'use strict';
    const cont = 'search';
    const urlParams = new URLSearchParams(window.location.search);
    if (path.startsWith('/shop/search')){
        // Fetch URL object
        loc = window.location;
        url = new URL(loc);

        // Restore product sorting prefs
        if (!url.searchParams.has('sortBy')){
            if (preferences.sorting[cont].hasOwnProperty('sortBy')){
                setParamsAndNav(url, {'sortBy': preferences.sorting[cont].sortBy}, 'sorting', cont);
            }
        }

        // Hide redundant 'SortedBy' p element
        injectCSS('#search .c2r5a38 > .zp4phe7 > p { display: none }');

        // Styling for 'select' element options
        injectCSS(`option {
            font-weight: normal;
            display: block;
            min-height: 1.2em;
            padding: 0px 2px 1px;
            background-color: transparent;
            white-space: nowrap;
        }`);

        // Styling for 'select' element
        injectCSS(`.c-select {
            padding: 10px 40px 10px 16px;
            background-color: transparent;
            transition: .3s border-color, .3s color;
        }`);

        // Setup select options HTML
        let options = `
        <option value="prod-online-pns-products-index-popularity">Popularity</option>
        <option value="prod-online-pns-products-index-avg-price-asc">Price Low to High</option>
        <option value="prod-online-pns-products-index-avg-price-desc">Price High to Low</option>
        `
        const DOMready = new AbortController();
        document.querySelector('#search').addEventListener('DOMNodeInserted', async function (ev){
            let target = ev.target;
            if (target.className === 'c2r5a30'){
                // Relevant element found, so stop searching
                DOMready.abort();

                // Inject select 'dropdown' element + parent element
                injectHTML(document.querySelector('#search .c2r5a38 > .zp4phe7'), 'div', undefined, 'c-select-wrapper');
                injectHTML(document.querySelector('#search .c2r5a38 > .zp4phe7 > .c-select-wrapper'), 'select', undefined, 'c-select js-product-filter-dropdown', options);


                // Set select 'dropdown' option based on url parameter content
                let selectElem = document.querySelector('.c-select-wrapper > select');
                let sortval = urlParams.get('sortBy');
                setSelect(selectElem, sortval);


                selectElem.addEventListener('change', async function (ev){
                    let target = ev.target;
                    let val = target.value;

                    loc = window.location;
                    url = new URL(loc);

                    setParamsAndNav(url, {'sortBy': val}, 'sorting', cont);
                });
            }
        },{ signal: DOMready.signal });

    }
    else if (path.startsWith('/shop/deals')){
        const cont = 'deals';

        // Restore product sorting prefs
        let iterCount = 0;
        let params = {};
        for (let param of ['s','sd']){
            if (!url.searchParams.has(param)){
                if (preferences.sorting.deals.hasOwnProperty(param)){
                    params[param] = preferences.sorting.deals[param];
                    iterCount++;
                }
            }
        }
        if (iterCount === 2){
            setParamsAndNav(url, params, 'sorting', cont);
        }

        // Inject search text input box + parent elements
        let selectElem = document.querySelector('.c-select-wrapper > select');
        let prodFilters = document.querySelector('.fs-product-filter__group.fs-product-filter__group--right');
        let searchDivElem = injectHTML(injectHTML(injectHTML(prodFilters,
                  'div', undefined, 'fs-product-filter__item', '', prodFilters.lastElementChild),
                  'div', undefined, 'fs-search-autocomplete  ', undefined),
                  'div', undefined, 'fs-search-autocomplete__input-wrapper', undefined
        );
        let searchInputElem = injectHTML(searchDivElem, 'input', 'search_deals', 'fs-search-autocomplete__input');
        searchInputElem.setAttribute('type', 'text');

        // Listen for search text input
        document.querySelector('#search_deals').addEventListener('change', (ev)=>{
            if (ev.target.value){
                let value = ev.target.value;
                loc = window.location;
                url = new URL(loc);
                setParamsAndNav(url, {'q': value}, 'sorting', cont);
            }
        });

        // Set select dropdown based on url content
        let sortval = urlParams.get('s') ? urlParams.get('s') : 'popularity';
        let sortdir = urlParams.get('sd') ? Number(urlParams.get('sd')) : 0;
        if (typeof sortval !== 'undefined'){
            setSelect(selectElem, sortval, sortdir);
        }

        // Listen for 'select' dropdown changes
        selectElem.addEventListener('change', async function (ev){
            let target = selectElem;
            let val = target.value;
            let selectedIndex = Number(target.selectedIndex);
            let dir = target.options[selectedIndex].getAttribute('data-sort') ? target.options[selectedIndex].getAttribute('data-sort') : 0;

            loc = window.location;
            url = new URL(loc);

            // Set url params and navigate to url
            setParamsAndNav(url, {'s': val, 'sd': dir}, 'sorting', cont);
        });
    }
})();
