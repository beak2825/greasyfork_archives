// ==UserScript==
// @name         Minds Show Impressions
// @namespace    http://www.minds.com/
// @version      0.1
// @description  Shows the number of impressions/views on all posts.
// @author       You
// @match        https://www.minds.com/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/371311/Minds%20Show%20Impressions.user.js
// @updateURL https://update.greasyfork.org/scripts/371311/Minds%20Show%20Impressions.meta.js
// ==/UserScript==

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) {
        return parts.pop().split(";").shift();
    }
}

function http(method, url, payload, callback) {
    $.ajax({
        method: method,
        url: url,
        headers: {
            'x-xsrf-token': getCookie('XSRF-TOKEN')
        }
    }).done(function(ret) {
        callback(ret);
    });
}

function getImpressions(id, callback) {
    http('GET', 'https://www.minds.com/api/v1/newsfeed/single/'+ id, '', function(ret) {callback(ret.activity.impressions)});
}

var hash = []
function updateViews() {
    var pl = document.getElementsByClassName('permalink');
    for(var i = 0; i < pl.length; i++) {
        if (hash.indexOf(pl[i]) != -1) {
            continue;
        }
        hash.push(pl[i]);

        // Needed to create separate closures or will
        // otherwise capture the same element.
        var ff = function(el) {
            return function(views) {
                el.childNodes[0].innerHTML += `<br>${views} views<br>`;
            };
        }

        var match = /\/([^\/]*)$/.exec(pl[i].href);
        if (match != null) {
            var id = match[1];
            getImpressions(id, ff(pl[i]));
        }
    }
}
// A simple callback on document or window load is not enough, because
// Minds loads content dynamically and subsequently loaded posts would
// be loaded unnoticed by this script. Therefor, we the following will
// need an observer to notify it of document changes. But we must hash
// the elements observed or this will cause an inifite loop as changes
// to the DOM cause renewed triggers of the observer.
var callback = function(mutationsList) {
    mutationsList.forEach((mutation) => {
        if (mutation.type == 'childList') {
            updateViews();
        }
    });
};
var observer = new MutationObserver(callback);
observer.observe(document.body, { childList: true, subtree: true });