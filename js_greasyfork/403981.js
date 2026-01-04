// ==UserScript==
// @name         Gelbooru Favorites Search
// @namespace    http://tampermonkey.net/
// @version      3.0.2
// @description  Adds a search bar to Favorites pages to search for tags.
// @author       Xerodusk
// @homepage     https://greasyfork.org/en/users/460331-xerodusk
// @license      GPL-3.0-or-later
// @match        https://gelbooru.com/index.php*page=favorites*
// @grant        none
// @icon         https://gelbooru.com/favicon.png
// @downloadURL https://update.greasyfork.org/scripts/403981/Gelbooru%20Favorites%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/403981/Gelbooru%20Favorites%20Search.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

function GetUserID() {
    'use strict';

    // Get all paremeters for current URL
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('id')) { // Get the user id if exists
        return searchParams.get('id');
    } else { // otherwise cancel
        return -1;
    }
}

function CreateSearchField(userID) {
    'use strict';

    // Create form elements
    const searchForm = document.createElement('form');
    searchForm.classList.add('searchform');
    searchForm.action = '/index.php';
    searchForm.method = 'get';

    const searchParameterPage = document.createElement('input');
    searchParameterPage.type = 'hidden';
    searchParameterPage.name = 'page';
    searchParameterPage.value = 'post';

    const searchParameterS = document.createElement('input');
    searchParameterS.type = 'hidden';
    searchParameterS.name = 's';
    searchParameterS.value = 'list';

    const searchBar = document.createElement('input');
    searchBar.classList.add('searchbar');
    searchBar.id = 'tags-search';
    searchBar.name = 'tags';
    searchBar.type = 'text';
    searchBar.placeholder = 'Search Example: video black_hair';
    searchBar.required = true;
    searchBar.setAttribute('data-autocomplete', 'tag-query');

    const searchButton = document.createElement('input');
    searchButton.classList.add('searchbutton');
    searchButton.type = 'submit';
    searchButton.value = 'Search';

    searchForm.onsubmit = function() {
        searchBar.classList.add('submitted');
        searchBar.value = 'fav:' + userID + ' ' + searchBar.value;
    }

    searchForm.appendChild(searchParameterPage);
    searchForm.appendChild(searchParameterS);
    searchForm.appendChild(searchBar);
    searchForm.appendChild(searchButton);
    // Insert before images
    document.body.querySelector('.thumb').before(searchForm);

    // Style the searchbar
    const css = document.createElement('style');

    css.appendChild(document.createTextNode(`
        .searchform {
            padding: 0 15px 15px 15px;
            width: 100%;
            box-sizing: border-box;
        }
        input[type='hidden'] {
            padding: 0;
        }
        .searchbar {
            padding: 7px;
            width: calc(100% - 175px);
            border: 1px solid #e0e0e0;
            box-sizing: border-box;
        }
        .searchbar:focus {
            background-color: initial !important;
        }
        .searchbar.submitted {
            color: transparent;
        }
        .searchbutton {
            cursor: pointer;
            padding: 8px 15px;
            margin: 0 4px;
            width: 120px;
            color: #fff;
            font-weight: bold;
            border: 0px;
            background: #0773fb;
            box-sizing: border-box;
        }
        .searchbutton:hover {
            background: #fbb307;
        }
        .ui-autocomplete {
            font-family: Arial, Helvetica, sans-serif;
            font-size: 12px;
        }
        .post-count {
            color: #bbb !important;
        }
    `));

    document.head.appendChild(css);
}

function InitializeAutocomplete() {
    'use strict';

    const keypressHandling = document.createElement('script');
    keypressHandling.src = 'https://gelbooru.com//script/jquery-hotkeys.js';
    document.head.appendChild(keypressHandling);

    const autocomplete = document.createElement('script');
    autocomplete.src='https://gelbooru.com/script/autocomplete3.js';
    document.head.appendChild(autocomplete);

    const css = document.createElement('style');
    css.appendChild(document.createTextNode(`
        a.tag-type-tag {
            color: #337ab7 !important;
        }

        a.tag-type-artist {
            color: #A00 !important;
        }

        a.tag-type-character  {
            color: #0A0 !important;
        }

        a.tag-type-copyright  {
            color: #A0A !important;
        }

        a.tag-type-metadata  {
            color: #F80 !important;
        }

        a.tag-type-deprecated  {
            color: #c0c0c0 !important;
            text-decoration: line-through;
        }
    `));
    document.head.appendChild(css);
}

(function() {
    'use strict';
    const userID = GetUserID();
    if (userID >= 0) {
        CreateSearchField(userID);
        InitializeAutocomplete();
    }
})();
