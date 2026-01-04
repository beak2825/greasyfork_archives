// ==UserScript==
// @name        JURN on Google Search
// @description Adds a link to the open-access search tool JURN just before the "more" button, on Google Search.
// @namespace   https://greasyfork.org/en/scripts/368234-jurn-on-google-search
// @include     http*://google.*
// @include     http*://www.google.*
// @include     https://encrypted.google.*
// @version     1.1
// @author      dhaden with thanks to sergio91pt
// @license     GPLv3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/368234/JURN%20on%20Google%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/368234/JURN%20on%20Google%20Search.meta.js
// ==/UserScript==

var jurnUrl = 'https://cse.google.com/cse/publicurl?cx=017986067167581999535:rnewgrysmpe#gsc.tab=0&gsc.q=';
var jurnEleId = 'hdtb-us-jurn';
var appendEleId = 'hdtb-msb-vis';

var createJurnElement = function() {
    var wrapper = document.createElement('div');
    wrapper.id = jurnEleId;
    wrapper.classList.add('hdtb-mitem');
    wrapper.classList.add('hdtb-imb');

    var anchor = document.createElement('a');
    var anchorClasses = anchor.classList;
    anchorClasses.add('q');
    anchorClasses.add('qs');
    anchor.textContent = 'Jurn';

    wrapper.appendChild(anchor);
    return wrapper;
};

var getSearchQuery = function(href) {
    var results = /[\\?&]q=([^&#]*)/.exec(href);
    return (results) ? results[1] : '';
};

var updateJurnHref = function(wrapper, jurnEle) {
    var otherHref = wrapper.querySelector('a').getAttribute('href');
    var query = getSearchQuery(otherHref);
    var anchor = jurnEle.firstChild;
    anchor.setAttribute('href', jurnUrl + query);
};

var addJurnLink = function() {
    var wrapper = document.getElementById(appendEleId);
    if (wrapper) {
        var jurnEle = createJurnElement();
        updateJurnHref(wrapper, jurnEle);
        wrapper.appendChild(jurnEle);
    }
};

var watchJurnLink = function() {
    // Whenever the query changes without changing the window href, our node
    // is removed, so use a MutationObserver to update and put us back.
    new MutationObserver(function(mutations) {
        var len = mutations.length;
        for (var i = 0; i < len; i++) {
            // Normally the link bar is removed then added, along
            // with search results, so just check additions.
            if (mutations[i].addedNodes) {
                if (!document.getElementById(jurnEleId)) {
                    addJurnLink();
                }
                break;
            }
        }
    }).observe(document.body, {'childList': true, 'subtree': true});
};

addJurnLink();
watchJurnLink();