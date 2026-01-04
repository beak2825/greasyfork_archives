// ==UserScript==
// @name        Ebay Country Filter
// @namespace   /
// @include     /^https://www.ebay(\.com?)?\.[a-z]{2,3}/sch/i.html.*$/
// @version     2.3
// @description Filter results by country
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/394842/Ebay%20Country%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/394842/Ebay%20Country%20Filter.meta.js
// ==/UserScript==

const string_compare = new Intl.Collator(undefined, {sensitivity: 'base'}).compare;

var countries = new Set();
var countries_to_hide = new Set();
var results_loaded = 0;


function create_country_filter_sidebar_div() {

    let country_filter_sidebar_div = document.createElement('li');
    country_filter_sidebar_div.id = 'country_filter';
    country_filter_sidebar_div.classList.add('x-refine__main__list');
    country_filter_sidebar_div.innerHTML = `
    <li class="x-refine__main__list ">
        <div role="button"
             class="x-refine__item--toggle"
             aria-controls="x-refine__Country_Filter"
             aria-expanded="true"
             onclick="this.setAttribute('aria-expanded', this.getAttribute('aria-expanded')==='false');"
         >
            <h3 class="x-refine__item">Country</h3>
            <div class="x-refine-toggle">
                <svg focusable="false"><use xlink:href="#svg-icon-chevron-down"></use></svg>
            </div>
        </div>
        <div class="x-refine__group">
            <ul id="Countries" class="x-refine__main__value" style="clear:both"></ul>
        </div>
    </li>
    `;

    return country_filter_sidebar_div;
}


function make_country_checkbox_object(country) {
  
    let country_li = document.createElement('li');
    country_li.className = "x-refine__main__list--value";
    country_li.dataset.country = country;
    country_li.innerHTML = `
        <div class="x-refine__multi-select">
            <a class="cbx x-refine__multi-select-link" data-country="${country}" onclick="filter_country(this);">
                <input type="checkbox" class="cbx x-refine__multi-select-checkbox" checked>
                <span class="cbx x-refine__multi-select-cbx">${country}</span>
            </a>
        </div>
    `;

    if (countries_to_hide.has(country))
        country_li.getElementsByTagName('input')[0].checked = false;

    return country_li;
}


function insert_country_checkbox_into_sidebar(country) {

    let country_filter_sidebar_div = document.getElementById('country_filter');
    let country_filter_list = country_filter_sidebar_div.getElementsByTagName('ul')[0];

    for (let existing_country_li of country_filter_list.children) {

        let existing_country = existing_country_li.dataset.country;

        // Compare country names alphabetically
        let order_comparison = string_compare(country, existing_country);

        // Skip adding already existing countries
        if (order_comparison === 0)
            return;

        // Found the correct position alphabetically
        if (order_comparison == -1) {
            let new_country_li = make_country_checkbox_object(country);
            country_filter_list.insertBefore(new_country_li, existing_country_li);
            return;
        }
    }

    // Add to the end if it hasn't already been added
    let new_country_li = make_country_checkbox_object(country);
    country_filter_list.appendChild(new_country_li);
}


function parse_item_country(item_country) {

    let item = item_country.closest('li.s-item');
    let country = item_country.innerText.replace(/^[^ ]+ /, '');

    if (countries.has(country)) {
        if (countries_to_hide.has(country))
            item.style.display = 'none';

        return;
    }

    countries.add(country);

    // Remember whether this country was hidden
    if (sessionStorage.getItem('country_filter/'+country) === 'unchecked') {
        countries_to_hide.add(country);
        item.style.display = 'none';
    }

    insert_country_checkbox_into_sidebar(country);
}


function insert_country_filter_into_sidebar(mutations, self) {

    // Wait until sidebar has loaded
    let sidebar = document.getElementsByClassName('x-refine__left__nav')
    if (sidebar.length===0)
        return;

    sidebar = sidebar[0];
    let country_filter_sidebar_div = create_country_filter_sidebar_div();
    sidebar.insertBefore(country_filter_sidebar_div, sidebar.firstChild);
  
    observe(as_item_results_load);
    self.disconnect();
}


function as_item_results_load(mutations, self) {

    // Get newly added item countries
    let item_countries = document.getElementsByClassName('s-item__itemLocation');
    let new_item_countries = [...item_countries].slice(results_loaded);
    if (new_item_countries.length === 0)
        return;

    results_loaded = item_countries.length;

    for (let item_country of new_item_countries)
        parse_item_country(item_country);

    if (document.readyState === 'complete')
        self.disconnect();
}


// Insert show/hide functions into document
function insert_script_into_document(mutations, self) {

    if (document.body === null)
        return;

    let script = document.createElement('script');
    script.innerHTML = `
    function filter_country(a) {
        let country = a.dataset.country;    
        let display;

        if (a.children[0].checked)
            show_country(country);
        else
            hide_country(country);
    }

    function show_country(country) {
        sessionStorage.setItem('country_filter/'+country, 'checked');
        for (item_country of document.getElementsByClassName('s-item__itemLocation'))
            if (item_country.innerText.includes(country))
                item_country.closest('li.s-item').style.display = 'block';
    }

    function hide_country(country) {
        sessionStorage.setItem('country_filter/'+country, 'unchecked');
        for (item_country of document.getElementsByClassName('s-item__itemLocation'))
            if (item_country.innerText.includes(country))
                item_country.closest('li.s-item').style.display = 'none';
    }
    `;

    document.body.append(script);
    self.disconnect();
}


observe(insert_country_filter_into_sidebar);
observe(insert_script_into_document);


function observe(func) {
    new MutationObserver(func).observe(document, {childList:true, subtree:true});
}
