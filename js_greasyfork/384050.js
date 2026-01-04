// ==UserScript==
// @name        Reddit: Hide/Show NSFW posts
// @description Adds dropdown list, allowing to select prefferable way of watching Reddit: Show All Posts, Hide NSFW Posts or Show Only NSFW Posts.
// @include     http://*.reddit.com/*
// @include     https://*.reddit.com/*
// @version     1.2
// @require	    http://cdnjs.cloudflare.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @run-at      document-end
// @author      Delmor_S
// @grant       none
// @namespace   https://greasyfork.org/users/4638
// @downloadURL https://update.greasyfork.org/scripts/384050/Reddit%3A%20HideShow%20NSFW%20posts.user.js
// @updateURL https://update.greasyfork.org/scripts/384050/Reddit%3A%20HideShow%20NSFW%20posts.meta.js
// ==/UserScript==

function showAllPosts() {

    $('article.w-full.m-0.block').each(function() {

        $(this).css('display', 'block');
    });

}

function hideNSFWPosts() {

    $('article.w-full.m-0.block').each(function() {
        const nsfwPost = $(this).find('shreddit-post[nsfw=""]');
        if (nsfwPost.length > 0) {
            $(this).css('display', 'none');
        }
    });

}

function showOnlyNSFWposts() {

    $('article.w-full.m-0.block').each(function() {
        const nsfwPost = $(this).find('shreddit-post[nsfw=""]');
        if (nsfwPost.length > 0) {
            $(this).css('display', 'block');
        }
        else {
            $(this).css('display', 'none');
        }
    });

}

function createEl(elementName, id /*optional*/ , attrArr /*optional*/ , parentEl /*optional*/ ) {

    var el = document.createElement(elementName);
    if (id) {
        el.id = id;
    }
    if (attrArr) {
        for (var attr in attrArr) {
            el.setAttribute(attr, attrArr[attr]);
        }
    }
    if (parentEl) {
        parentEl.appendChild(el);
    }
    return el;
}

function createText(txt) {

    return document.createTextNode(txt);
}

function appendCSS(obj) {

    var cssString = "",
        propString = "",
        eachSelector = "",
        style = createEl("style");
    for (var selector in CSS) {
        eachSelector = CSS[selector];
        propString = "";
        for (var property in eachSelector) {
            propString += property + ":" + eachSelector[property] + ";";
        }
        cssString += selector + "{" + propString + "}";
    }
    style.appendChild(createText(cssString));
    document.head.appendChild(style);
}


var nsfwSelect = document.createElement('select');
nsfwSelect.id = 'nsfwSelect';
document.body.appendChild(nsfwSelect);

var nsfwShowAll = document.createElement('option');
nsfwShowAll.value = 'Show All Posts';
nsfwShowAll.innerHTML = 'Show All Posts';
nsfwSelect.appendChild(nsfwShowAll);

var nsfwHideNSFW = document.createElement('option');
nsfwHideNSFW.value = 'Hide NSFW Posts';
nsfwHideNSFW.innerHTML = 'Hide NSFW Posts';
nsfwSelect.appendChild(nsfwHideNSFW);

var nsfwShowOnlyNSFW = document.createElement('option');
nsfwShowOnlyNSFW.value = 'Show Only NSFW Posts';
nsfwShowOnlyNSFW.innerHTML = 'Show Only NSFW Posts';
nsfwSelect.appendChild(nsfwShowOnlyNSFW);

var timer = setInterval(
    function() {

        if (nsfwSelect.options[nsfwSelect.selectedIndex].text == "Hide NSFW Posts") {
            hideNSFWPosts();
        } else if (nsfwSelect.options[nsfwSelect.selectedIndex].text == "Show Only NSFW Posts") {

            showOnlyNSFWposts();
        } else {
            showAllPosts();
        }
    },
    1000

);

var CSS = {
    '#nsfwSelect': {
        'position': 'fixed',
        'bottom': '20px',
        'left': '3px',
        'z-index': '999'
    }
};

appendCSS(CSS);
