// ==UserScript==
// @name         9GAG Likes Page Filter Tool
// @namespace    ptommasi@users.noreply.github.com
// @version      0.2
// @description  A tool which allows to filter the 9GAG upvotes / likes personal page only on the tags you are interested into (e.g. funny, gaming, pcmr, etc...).
// @author       Pierpaolo Tommasi
// @match        *://9gag.com/u/*/likes
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457269/9GAG%20Likes%20Page%20Filter%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/457269/9GAG%20Likes%20Page%20Filter%20Tool.meta.js
// ==/UserScript==

// This is a set containg the tags currently filtered on
let activeFilters;
// A map where the key is the tag and the value is an array of article ID (strings)
let tagToArticles;
// A map where the key is the article ID and the value is the array of tags (strings)
let articleToTags;
// The count hide option (how many articles should a tag have in order to be displayed)
let hidesCount;
// Which sorting should be applied on the discovered tags
let sorting;

// Query the current view and return a map where the key are the tags and
// the values are the articles with the given tag.
function getNewArticles() {

    const _articleToTags = { };

    const listView = document.getElementById("list-view-2");
    const articles = [ ... listView.querySelectorAll("article") ];

    articles.forEach(a => {
        const articleId = a.getAttribute("id");
        if (!articleToTags.has(articleId)) {
            _articleToTags[articleId] = [ ... a.querySelectorAll(".ui-post-tags a") ].map(a => a.innerText);
        }
    });

    return _articleToTags;

}


// Remove the existing menu, to repaint a new one
function cleanMenu() {
    const menu = document.getElementById("tags_extra_menu");
    menu && menu.remove();
}

function createFilteredTagButton(tag, count) {
    const tagElement = document.createElement("div");
    tagElement.innerHTML = `${tag} (${count})`;
    tagElement.setAttribute("style", "display: inline-block; margin: 2px 4px; padding: 4px 2px 4px 4px; background-color: powderblue; border-radius: 2px;");
    const addElement = document.createElement("span");
    addElement.innerHTML = `Clear`;
    addElement.setAttribute("style", "cursor: pointer; margin: 2px 0px 2px 8px; padding: 2px; background-color: mediumslateblue; border-radius: 2px;");
    tagElement.appendChild(addElement);
    addElement.onclick = () => {
        if(activeFilters.has(tag)) {
            activeFilters.delete(tag);
            repaintMenu("clear link -> onclick");
            updateFilters();
        }
    };
    return tagElement;
}

function createTagButton(tag, count) {
    const tagElement = document.createElement("div");
    tagElement.innerHTML = `${tag} (${count})`;
    tagElement.setAttribute("style", "display: inline-block; margin: 2px 4px; padding: 4px 2px 4px 4px; background-color: powderblue; border-radius: 2px;");
    const addElement = document.createElement("span");
    addElement.innerHTML = `Add`;
    addElement.setAttribute("style", "cursor: pointer; margin: 2px 0px 2px 8px; padding: 2px; background-color: mediumslateblue; border-radius: 2px;");
    tagElement.appendChild(addElement);
    addElement.onclick = () => {
        if(!activeFilters.has(tag)) {
            activeFilters.add(tag);
            repaintMenu("add link -> onclick");
            updateFilters();
        }
    };
    return tagElement;
}

function createFiltersMenu() {

    const filtersMenu = document.createElement("div");

    const filtersLabel = document.createElement("div");
    filtersLabel.innerHTML = "Only posts with one of these tags will be displayed:";
    filtersMenu.appendChild(filtersLabel);

    if (activeFilters.size > 0) {
        activeFilters.forEach(tag => {
            filtersMenu.appendChild(createFilteredTagButton(tag, tagToArticles.get(tag).length));
        });
    } else {
        const noFilters = document.createElement("div");
        noFilters.innerHTML = "No selection yet.";
        filtersMenu.appendChild(noFilters);
    }

    return filtersMenu;

}

function createTagOptionsMenu() {

    const tagOptionsMenu = document.createElement("div");

    //------ Sub menu with the tags count

    const countLabelSubMenu = document.createElement("div");

    const countLabelBefore = document.createElement("span");
    countLabelBefore.innerHTML = "Only tags with at least ";

    const countLabelInput = document.createElement("input");
    countLabelInput.setAttribute("type", "number");
    countLabelInput.setAttribute("min", "1");
    countLabelInput.setAttribute("max", "99");
    countLabelInput.setAttribute("value", hidesCount);
    countLabelInput.onchange = () => {
        const newHidesCount = parseInt(countLabelInput.value);
        if (!isNaN(newHidesCount)) {
            hidesCount = newHidesCount;
            repaintMenu("input hides count -> onchange");
        }
    };

    const countLabelAfter = document.createElement("span");
    countLabelAfter.innerHTML = " posts will be displayed.";

    countLabelSubMenu.appendChild(countLabelBefore);
    countLabelSubMenu.appendChild(countLabelInput);
    countLabelSubMenu.appendChild(countLabelAfter);

    tagOptionsMenu.appendChild(countLabelSubMenu);

    //------ Sub menu with the sorting

    const sortTagSubMenu = document.createElement("div");
    sortTagSubMenu.setAttribute("style", "margin-top: 3px;");

    const sortLabel = document.createElement("span");
    sortLabel.innerHTML = "Sort tags by ";
    const sortInput = document.createElement("select");
    sortInput.setAttribute("style", "height: inherit; padding: inherit; font-weight: normal; margin: 0; display: inline-block;");

    const unsortedOpt = document.createElement("option");
    unsortedOpt.innerHTML = "Unsorted";
    unsortedOpt.setAttribute("value", "unsorted");
    if (sorting === "unsorted") {
        unsortedOpt.setAttribute("selected", "true");
    }
    sortInput.appendChild(unsortedOpt);

    const articlesCountOpt = document.createElement("option");
    articlesCountOpt.innerHTML = "Articles count";
    articlesCountOpt.setAttribute("value", "count");
    if (sorting === "count") {
        articlesCountOpt.setAttribute("selected", "true");
    }
    sortInput.appendChild(articlesCountOpt);

    const alphabeticOpt = document.createElement("option");
    alphabeticOpt.innerHTML = "Alphabetic order";
    alphabeticOpt.setAttribute("value", "alphabetic");
    if (sorting === "alphabetic") {
        alphabeticOpt.setAttribute("selected", "true");
    }
    sortInput.appendChild(alphabeticOpt);

    sortInput.onchange = () => {
        sorting = sortInput.value;
        repaintMenu("select sorting -> onchange");
    };

    sortTagSubMenu.appendChild(sortLabel);
    sortTagSubMenu.appendChild(sortInput);

    tagOptionsMenu.appendChild(sortTagSubMenu);

    //------ Sub menu for custom tags

    const manualAddSubMenu = document.createElement("div");
    manualAddSubMenu.setAttribute("style", "margin-top: 3px;");

    const addLabel = document.createElement("span");
    addLabel.innerHTML = "Manually add a tag: ";

    const addTextInput = document.createElement("input");
    addTextInput.setAttribute("type", "text");
    addTextInput.setAttribute("style", "height: inherit; padding: inherit; display: inline; margin: inherit; width: 60px;");
    const addButton = document.createElement("button");
    addButton.innerHTML = "Add";

    addButton.onclick = () => {
        if (addTextInput.value) {
            activeFilters.add(addTextInput.value);
            if(!tagToArticles.has(addTextInput.value)) {
                tagToArticles.set(addTextInput.value, []);
            }
            repaintMenu("add tag -> onclick");
            updateFilters();
        }
    }

    manualAddSubMenu.appendChild(addLabel);
    manualAddSubMenu.appendChild(addTextInput);
    manualAddSubMenu.appendChild(addButton);

    tagOptionsMenu.appendChild(manualAddSubMenu);

    //------

    return tagOptionsMenu;

}

function createTagsMenu() {

    const tagsMenu = document.createElement("div");

    const tagLabel = document.createElement("div");
    tagLabel.innerHTML = "Tags discovered so far:";
    tagsMenu.appendChild(tagLabel);

    const getSortedTags = () => {
        const tags = [ ... tagToArticles.keys() ];
        switch(sorting) {
            case "unsorted":
                return tags;
            case "alphabetic":
                return tags.sort((t1, t2) => t1.toLocaleLowerCase().localeCompare(t2.toLocaleLowerCase()));
            case "count":
                return tags.sort((t1, t2) => tagToArticles.get(t2).length - tagToArticles.get(t1).length);
            default:
                return tags;
        }
    }

    getSortedTags().forEach(tag => {
        const count = tagToArticles.get(tag).length;
        if (count >= hidesCount) {
            tagsMenu.appendChild(createTagButton(tag, count));
        }
    });

    return tagsMenu;

}

function repaintMenu(caller) {

    cleanMenu();

    // console.log("Repainting menu after call from ", caller);

    const menu = document.createElement("div");
    menu.setAttribute("id", "tags_extra_menu");
    menu.setAttribute("style", "position: fixed; right: calc(var(--main-margin) - 60px); top: 42px; bottom: 0px; overflow-y: scroll; width: 360px; margin: 10px; padding: 6px; background-color: white; z-index: 100;");
    document.querySelector("#page").before(menu);

    menu.appendChild(createFiltersMenu());
    menu.appendChild(document.createElement("hr"));
    menu.appendChild(createTagOptionsMenu());
    menu.appendChild(document.createElement("hr"));
    menu.appendChild(createTagsMenu());

}

function shouldHide(articleId) {
    if (activeFilters.size == 0) {
        return false;
    }
    const tags = articleToTags.get(articleId);
    let hide = true;
    tags.forEach(t => {
        if(activeFilters.has(t)) {
            hide = false;
        }
    });
    return hide;
}

function updateFilters(delta) {

    const updateArticle = (articleId) => {
        const el = document.getElementById(articleId);
        if (shouldHide(articleId)) {
            el.setAttribute("style", "display: none");
        } else {
            el.removeAttribute("style");
        }
    }

    if (delta == undefined) {
        for (const articleId of articleToTags.keys()) {
            updateArticle(articleId);
        }
    } else {
        for (const articleId in delta) {
            updateArticle(articleId);
        }
    }

}

(function() {
    'use strict';

    console.log("9gag like filter activated!");

    const addDelta = (newArticleToTags) => {

        for (const articleId in newArticleToTags) {
            if (!articleToTags.has(articleId)) {
                const tags = newArticleToTags[articleId];
                articleToTags.set(articleId, tags);
                tags.forEach(tag => {
                    if(tagToArticles.has(tag)) {
                        tagToArticles.get(tag).push(articleId);
                    } else {
                        tagToArticles.set(tag, [articleId]);
                    }
                });
            }
        }

        repaintMenu("addDelta");
        updateFilters(newArticleToTags);

    }

    // 9gag.com/u/<anything>/likes/
    const likePage = /9gag\.com\/u\/\w*\/likes/;

    let isFilterActive = false;

    setInterval(() => {

        if (likePage.test(window.location.href)) {
            if (!isFilterActive) {
                console.log("Activating tag filter menu in /likes page");
                isFilterActive = true;
                activeFilters = new Set();
                tagToArticles = new Map();
                articleToTags = new Map();
                hidesCount = 1;
                sorting = "unsorted";
            }
        } else {
            if (isFilterActive) {
                console.log("De-activating tag filter menu in /likes page");
                isFilterActive = false;
                cleanMenu();
            }
        }

        if (isFilterActive) {
            const newArticleToTags = getNewArticles();
            if (Object.keys(newArticleToTags).length > 0) {
                addDelta(newArticleToTags);
            }
        }

    }, 500);

})();
