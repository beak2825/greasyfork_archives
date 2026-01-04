// ==UserScript==
// @name        Binary Search - passthepopcorn.me
// @namespace   kannibalox
// @match       https://passthepopcorn.me/*
// @grant       none
// @version     1.1
// @author      kannibalox
// @description Allow binary searching on search pages
// @license WTFPL
// @downloadURL https://update.greasyfork.org/scripts/446872/Binary%20Search%20-%20passthepopcornme.user.js
// @updateURL https://update.greasyfork.org/scripts/446872/Binary%20Search%20-%20passthepopcornme.meta.js
// ==/UserScript==
function currentPage() {
    var searchableStr = document.URL + '&';
    var page = searchableStr.match(/[\?\&]page=([^\&\#]+)[\&\#]/i);
    if (page === null) {
        return 1;
    } else {
        return parseInt(page[1]);
    }
}

function lastPage() {
    return parseInt(document.querySelectorAll('.pagination__link--last')[0].href.split("=")[1])
}

function prevPages() {
    if (document.URL.split("#").length != 2) {
        return null
    }
    var anchors = document.URL.split("#")[1].split(',')
    if (anchors.length != 2) {
        return null
    }
    return [parseInt(anchors[0]), parseInt(anchors[1])]
}

function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

function createElement(str, raw = false) {
    var tmp = document.implementation.createHTMLDocument('');
    tmp.body.innerHTML = str;
    if (raw) {
        return tmp.body.children;
    } else {
        return tmp.body.children[0];
    }
};

function generateUrl(page, anchor) {
    var suffix = 'page=' + page + '#' + anchor
    if (window.location.search.includes("page=")) {
       return window.location.pathname + window.location.search.replace(/&?page=\d+/, '&' + suffix);
    };
    return window.location.pathname + window.location.search + '?' + suffix;
}

ready(function () {
    el_class = 'pagination__link pagination__link--page';
    if (document.querySelectorAll('.pagination').length == 0) {
        return;
    }
    if (prevPages() === null) {
        Array.prototype.forEach.call(document.querySelectorAll('.pagination__link--last'), function(el, i){
            var page = Math.floor((currentPage() + lastPage()) / 2);
            var binStart = createElement('<a href="'+generateUrl(page, currentPage()+','+lastPage())+'" class="'+el_class+'"> Start bisect >>></a>')
            el.parentNode.appendChild(binStart)
        });
    } else {
        if (prevPages().includes(currentPage())) {
            alert("Bisection finished!");
            return
        }
        Array.prototype.forEach.call(document.querySelectorAll('.pagination__link--last'), function(el, i){
            var forwardBisectPage = Math.floor((currentPage() + prevPages()[1]) / 2);
            var forwardBisectEl = createElement('<a href="'+generateUrl(forwardBisectPage, currentPage()+','+prevPages()[1])+'" class="'+el_class+'"> Bisect forward >>></a>')
            el.parentNode.appendChild(forwardBisectEl)
        });        
        Array.prototype.forEach.call(document.querySelectorAll('.pagination__link--first'), function(el, i){
            var backwardBisectPage = Math.floor((currentPage() + prevPages()[0]) / 2);
            var backwardBisectEl = createElement('<a href="'+generateUrl(backwardBisectPage, prevPages()[0]+','+currentPage())+'" class="'+el_class+'"><<< Bisect backward </a>');
            el.parentNode.insertBefore(backwardBisectEl, el.parentNode.firstChild);
        });        
    }
});
