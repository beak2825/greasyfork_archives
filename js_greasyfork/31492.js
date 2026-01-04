// ==UserScript==
// @name         Find Similar Posts to Your New Post on Steemit.com
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Finds Steemit posts that are similar to your new post, for research purposes. You can make sure you aren't duplicating the work of others and also post comments under similar posts to inform others of your new post.
// @author       https://steemit.com/@ura-soul
// @match        https://steemit.com/*
// @grant        WTFPL
// @copyright    2017, Ura Soul (https://www.ureka.org)
// @homepageURL  https://www.ureka.org
// @downloadURL https://update.greasyfork.org/scripts/31492/Find%20Similar%20Posts%20to%20Your%20New%20Post%20on%20Steemitcom.user.js
// @updateURL https://update.greasyfork.org/scripts/31492/Find%20Similar%20Posts%20to%20Your%20New%20Post%20on%20Steemitcom.meta.js
// ==/UserScript==

function findClass(element, className) {
    var foundElement = null, found;
    function recurse(element, className, found) {
        for (var i = 0; i < element.childNodes.length && !found; i++) {
            var el = element.childNodes[i];
            var classes = el.className != undefined? el.className.split(" ") : [];
            for (var j = 0, jl = classes.length; j < jl; j++) {
                if (classes[j] == className) {
                    found = true;
                    foundElement = element.childNodes[i];
                    break;
                }
            }
            if(found)
                break;
            recurse(element.childNodes[i], className, found);
        }
    }
    recurse(element, className, false);
    return foundElement;
}

function buildSearchString_CreatePost()
{
    var title,
        categories,
        searchString,
        categoryInput,
        titleInput;

    categoryInput = document.getElementsByName("category");
    titleInput = document.getElementsByName("title");
    categories = categoryInput[0].value;
    title = titleInput[0].value;

    if ((title !== '')||(categories !== ''))
    {
        searchString = encodeURIComponent(title + ' ' + categories);
        searchString = 'https://duckduckgo.com/?q=site:steemit.com ' + searchString;
    }
    else
        searchString = '';
    return searchString;
}

function buildSearchString_FullPost()
{
    var postFull,
        title,
        categories,
        tags,
        searchString;

    postFull = document.getElementsByClassName("PostFull__header");

    title = findClass(postFull[0], "entry-title");
    searchString = title.innerText + ' ';

    categories = document.getElementsByClassName("TagList__horizontal");
    tags = categories[0].childNodes;
    if (tags.length > 0)
    {
        for (i = 0; i < tags.length; i++) {
            searchString += tags[i].text + ' ';
        }
    }
    searchString = encodeURIComponent(searchString);
    searchString = 'https://duckduckgo.com/?q=site:steemit.com ' + searchString;

    return searchString;
}

function insertSearchBtn_CreatePost()
{
    var link = document.createElement("a");
    link.id = "similarLink";
    link.target = "_blank";
    link.text = 'Show Similar Posts';

    var buttonDestination = document.getElementsByClassName('secondary');
    buttonDestination[0].appendChild(link);
    updateSearchBtn_CreatePost();
}

function updateSearchBtn_CreatePost()
{
    var link = document.getElementById('similarLink'),
        searchString;

    searchString = buildSearchString_CreatePost();
    if (searchString === '')
    {
        link.href = '';
        link.style = 'margin-left:1rem; pointer-events: none; cursor: default; opacity:0.5;';
    }
    else
    {
        link.href = buildSearchString_CreatePost();
        link.style = 'margin-left:1rem; pointer-events: all; cursor: pointer; opacity:1;';
    }
}

function submit_post_init(){
    insertSearchBtn_CreatePost();

    var categoryInput,
        titleInput;

    categoryInput = document.getElementsByName("category");
    categoryInput[0].onkeyup = function(){
        updateSearchBtn_CreatePost();
    };

    titleInput = document.getElementsByName("title");
    titleInput[0].onkeyup = function(){
        updateSearchBtn_CreatePost();
    };
}

function post_page_init(){
    var link = document.createElement("a");
    link.id = "similarLink";
    link.target = "_blank";
    link.text = 'Show Similar Posts';
    link.href = buildSearchString_FullPost();
    link.style = "float:right;";
    var buttonDestination = document.getElementsByClassName('PostFull__header');
    buttonDestination[0].insertBefore(link, buttonDestination[0].childNodes[1]);
    
    var voteBar = document.getElementsByClassName('PostFull__time_author_category_large');
    voteBar[0].style = "margin-top:3rem;";
}

/*--- Note, gmMain () will fire under all these conditions:
    1) The page initially loads or does an HTML reload (F5, etc.).
    2) The scheme, host, or port change.  These all cause the browser to
       load a fresh page.
    3) AJAX changes the URL (even if it does not trigger a new HTML load).
*/
var fireOnHashChangesToo    = true;
var pageURLCheckTimer       = setInterval (
    function () {
        if (this.lastPathStr  !== location.pathname || this.lastQueryStr !== location.search || (fireOnHashChangesToo && this.lastHashStr !== location.hash) ) {
            this.lastPathStr  = location.pathname;
            this.lastQueryStr = location.search;
            this.lastHashStr  = location.hash;
            if (location.pathname.indexOf('submit.html') >= 0)
            {
                submit_post_init();
            }
            else//  if (location.pathname.indexOf('/steemit/@') === 0)
            {
                post_page_init();
            }
        }
    }, 111
);