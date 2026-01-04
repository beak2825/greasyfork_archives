// ==UserScript==
// @name           tab scholar & youtube
// @namespace      https://google.com/
// @version        1.1
// @description    ajout tab scholar & youtube
// @homepage       https://greasyfork.org/fr/scripts/35115-tab-scholar-youtube
// @homepageURL    https://gist.github.com/Fabulo92/7fb28e68578c5710789f507dc529a9b3
// @supportURL     https://productforums.google.com/forum/#!home
// @contributionURL https://www.paypal.com/
// @icon           https://icons.duckduckgo.com/ip2/google.com.ico
// @copyright      Fabulo92
// @author         Fabulo92
// @secure         Fabulo92
// @license        GPLv3
// @compatible     firefox
// @compatible     chrome
// @compatible     opera
// @compatible     Safari
// @match          http://*/*
// @require        https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @resource       _css https://gist.github.com/Fabulo92/tab scholar & youtube/css/tab scholar & youtube.css?v=1.1
// @include        http://www.google.com/search?*q=*
// @include        https://www.google.com/search?*q=*
// @include        http*://google.*
// @include        http*://www.google.*
// @include        https://encrypted.google.*
// @grant          none
// @grant          unsafeWindow
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_addStyle
// @grant          GM_getResourceText
// @grant          GM_xmlhttpRequest
// @grant          GM_registerMenuCommand
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/35310/tab%20scholar%20%20youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/35310/tab%20scholar%20%20youtube.meta.js
// ==/UserScript==

(function () {
    var videosLink = document.querySelector('#hdtb-msb .hdtb-mitem a[href*="&tbm=vid"]'),
        intv;

    function changeLink() {
        if (videosLink.firstChild.data === 'YouTube' && videosLink.href.indexOf('youtube.com') !== -1) {
            return window.clearInterval(intv);
        }

        // change the link's text
        videosLink.firstChild.data = 'YouTube';

        // change the link's url
        videosLink.href = 'https://www.youtube.com/results?search_query=' + location.href.match(/[?&]?q=([^&]*)/)[1];
    }

    // make sure the page is not in a frame
    // and if there is a "Videos" link
    if (window.frameElement || window !== window.top || !videosLink) { return; }

    // change the link's text
    // keep changing it until it actually changes... sometimes it doesn't work right away

    intv =  window.setInterval(changeLink, 500);
}());

var scholarUrl = 'https://scholar.google.com/scholar?q=';
var scholarEleId = 'hdtb-us-scholar';
var appendEleId = 'hdtb-msb-vis';

var createScholarElement = function() {
    var wrapper = document.createElement('div');
    wrapper.id = scholarEleId;
    wrapper.classList.add('hdtb-mitem');
    wrapper.classList.add('hdtb-imb');

    var anchor = document.createElement('a');
    var anchorClasses = anchor.classList;
    anchorClasses.add('q');
    anchorClasses.add('qs');
    anchor.textContent = 'Scholar';

    wrapper.appendChild(anchor);
    return wrapper;
};

var getSearchQuery = function(href) {
    var results = /[\\?&]q=([^&#]*)/.exec(href);
    return (results) ? results[1] : '';
};

var updateScholarHref = function(wrapper, scholorEle) {
    var otherHref = wrapper.querySelector('a').getAttribute('href');
    var query = getSearchQuery(otherHref);
    var anchor = scholorEle.firstChild;
    anchor.setAttribute('href', scholarUrl + query);
};

var addScholarLink = function() {
    var wrapper = document.getElementById(appendEleId);
    if (wrapper) {
        var scholarEle = createScholarElement();
        updateScholarHref(wrapper, scholarEle);
        wrapper.appendChild(scholarEle);
    }
};

var watchScholarLink = function() {
    // Whenever the query changes without changing the window href, our node
    // is removed, so use a MutationObserver to update and put us back.
    new MutationObserver(function(mutations) {
        var len = mutations.length;
        for (var i = 0; i < len; i++) {
            // Normally the link bar is removed then added, along
            // with search results, so just check additions.
            if (mutations[i].addedNodes) {
                if (!document.getElementById(scholarEleId)) {
                    addScholarLink();
                }
                break;
            }
        }
    }).observe(document.body, {'childList': true, 'subtree': true});
};

addScholarLink();
watchScholarLink();