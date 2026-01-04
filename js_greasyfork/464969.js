// ==UserScript==
// @name         Rule34 Save Search
// @description  Save search queries
// @namespace    User_314159_R34SS
// @version      0.55
// @author       User_314159
// @license      MIT
// @match        https://rule34.xxx/index.php?page=post&s=list*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rule34.xxx
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464969/Rule34%20Save%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/464969/Rule34%20Save%20Search.meta.js
// ==/UserScript==

// display logic
function get_search() {
    let contents = document.getElementById("content");
    if (contents.getElementsByClassName("image-list")[0] != undefined) {
        let search_bar = contents.querySelector('input[name="tags"]');
        if (search_bar.value != "") {
            return [true, search_bar.value];
        }
    }
    return [false, ""];
}

//io
function getSavedSearches() { // gets the localstorage array and parses it into an actual array, creates a new one if there is no key in localStorage
    let artists;
    if (localStorage.getItem('rule34SavedSearches') === null) {
        console.log('generated new saved array');
        artists = [];
        saveSearches(artists);
    }
    else {
        artists = JSON.parse(localStorage.getItem('rule34SavedSearches'));
    }
    return artists;
}

function deleteSearch(search) { // deletes the specified search out of the array and saves it
    let artists = getSavedSearches();
    let target = artists.indexOf(search);
    artists.splice(target, 1);
    saveSearches(artists);
    console.log('Deleted ' + search);
}

function saveSearches(searches) { // saves an updated version of the searches to local storage
    localStorage.setItem('rule34SavedSearches', JSON.stringify(searches));
}
function addSearch(search) {
    let searches = getSavedSearches();
    search = sortStr(search);
    if(searches.includes(search)) {
        return;
    }
    searches.push(search);
    searches.sort();
    saveSearches(searches);
}

function exportSearches() { // gets the local storage and logs it to the console as a string
    let searches = localStorage.getItem('rule34SavedSearches');
    console.log(searches); // Don't need to stringify here the localstorage got it stringified
    navigator.clipboard.writeText(searches);
    alert("Copied searches to clipboard");
}

function importSearches() { // takes an inputted array string and overwrites the local storage with it
    let input = window.prompt("Enter previously exported searches"); // window.prompt seems to return a double-escaped string
    let data = JSON.parse(input); // due to this, we need to de-escape twice to get the actual json
    let current_searches = getSavedSearches();
    for(let index = 0; index < data.length; index++) {
        if(current_searches.includes(data[index])) {
            continue;
        } else {
            current_searches.push(data[index]);
            console.log("New search: " + data[index]);
        }
    }
    localStorage.setItem('rule34SavedSearches', JSON.stringify(current_searches));
}

//sorting
function sortStr(string) {
    //this btw relies on the fact that rule34 only has lowercase tags cuz it sorts all uppercase before the lowercase letters (i.e. I, X, a, b, ...)
    let split_str = string.split(' ');
    let sortable = [];
    let non_sortable = [];
    let bracketed = false;
    for(let i = 0; i < split_str.length; i++) { // this iterates over each token (thing separated by a space) and if its contained in brackets, it won't get sorted
        switch (split_str[i]) {
            case "(":
                bracketed = true;
                non_sortable.push(split_str[i]);
                break;
            case ")":
                bracketed = false;
                non_sortable.push(split_str[i]);
                break;
            default:
                if(bracketed){
                    non_sortable.push(split_str[i]);
                } else {
                    sortable.push(split_str[i]);
                }
                break;
        }
    }
    return sortable.sort().join(' ') + ' ' + non_sortable.join(' ');
}
// button logic
function createButton(name, width) {
    let button = document.createElement("button");
    button.innerHTML = name;
    button.style.width = width;
    return button;
}
function createA(target) {
    let href = createLink(target);
    let a = document.createElement("a");
    a.href = href;
    a.innerHTML = target;
    a.style.overflow = "hidden";
    return a;
}
function createLink(target) {
    return "index.php?page=post&s=list&tags=" + target + "&is_saved_search";
}
function createAddButton(search) {
    let button = createButton("Save search", "100%");

    button.addEventListener("click", function() {
        addSearch(search);
        //window.location.href = createLink(search);
    });
    return button;
}
function createDeleteButton(search) {
    let button = createButton("Delete search", "100%");

    button.addEventListener("click", function() {
        deleteSearch(search);
        window.location.href = createLink(search).replace("&is_saved_search", "");
    });
    return button;
}
function createExportButton() {
    let button = createButton("Export", "100%");

    button.addEventListener("click", function() {
        exportSearches();
    });
    return button;
}
function createImportButton() {
    let button = createButton("Import", "100%");

    button.addEventListener("click", function() {
        importSearches();
    });
    return button;
}
function createDeleteAllButton() {
    let button = createButton("Delete all", "100%");

    button.addEventListener("click", function() {
        if(window.confirm("WARNING: This will delete all saved searches and cannot be undone")) {
            if(window.confirm("Are you sure?")) {
                localStorage.removeItem("rule34SavedSearches");
                console.log("removed localStorage 'rule34SavedSearches' key");
                return;
            }
        }
        console.log("Reset was aborted");
    });
    return button;
}

function generateSearchList() {
    let collapsable = document.createElement("details");
    let collapsable_name = document.createElement("summary");
    collapsable_name.innerHTML = "Saved";
    collapsable.style.maxHeight = "50vh";
    collapsable.style.overflow = "hidden scroll";
    collapsable.style.textOverflow = "ellipsis";
    collapsable.style.whiteSpace = "nowrap";
    collapsable.style.scrollbarWidth = "thin";
    collapsable.appendChild(collapsable_name);

    let searches = getSavedSearches();
    let linebreak = document.createElement("br");
    for (let i = 0; i < searches.length; i++) {
        collapsable.appendChild(createA(searches[i]));
        collapsable.appendChild(linebreak.cloneNode());
    }
    return collapsable;
}
function generateDevOptions() {
    let collapsable = document.createElement("details");
    let collapsable_name = document.createElement("summary");
    collapsable_name.innerHTML = "Dev Options";
    collapsable.style.overflow = "hidden scroll";
    collapsable.style.textOverflow = "ellipsis";
    collapsable.style.whiteSpace = "nowrap";
    collapsable.style.scrollbarWidth = "thin";
    collapsable.appendChild(collapsable_name);

    let linebreak = document.createElement("br");
    collapsable.appendChild(createImportButton());
    collapsable.appendChild(linebreak.cloneNode());
    collapsable.appendChild(createExportButton());
    collapsable.appendChild(linebreak.cloneNode());
    collapsable.appendChild(createDeleteAllButton());
    collapsable.appendChild(linebreak.cloneNode());
    return collapsable;
}

(function() {
    'use strict';
    let [search_not_empty, search_value] = get_search();
    let search_bar = document.getElementsByClassName("tag-search")[0];

    let collapsable = generateSearchList();

    if (search_not_empty && !window.location.href.includes("&is_saved_search")) {
        let addButton = createAddButton(search_value);
        search_bar.append(addButton);
    }
    if (window.location.href.includes("&is_saved_search")) {
        let deleteButton = createDeleteButton(search_value);
        search_bar.append(deleteButton);
    }

    let tag_sidebar = document.getElementById("tag-sidebar");
    tag_sidebar.append(generateDevOptions());
    search_bar.append(collapsable);
})();