// ==UserScript==
// @name Bandcamp Random Album
// @version 1.0.0
// @description Add link to random album from collection or wishlist
// @namespace bandcamp-random-album
// @license 0BSD
// @match http*://bandcamp.com/*
// @include http*://bandcamp.com/*
// @grant GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/439646/Bandcamp%20Random%20Album.user.js
// @updateURL https://update.greasyfork.org/scripts/439646/Bandcamp%20Random%20Album.meta.js
// ==/UserScript==

if (!document.querySelector('.collection-container')) {
    return;
}

var collectionSummary;
var pageData;
var isOwner = document.querySelector('#fan-banner').classList.contains('owner');
var LOAD_URL_FORMAT = "https://bandcamp.com/api/fancollection/1/{}_items";
var pageTypes = ['collection', 'wishlist'];
var items = pageTypes.reduce((acc, type) => {
    acc[type] = [];
    return acc;
}, []);
var started = {};

var get = function(url, cb) {
    var opts = {
        method: 'GET',
        url: url,
        onload: function (res) {
            cb(res.status, res.responseText, res.finalUrl || url);
        }
    };
    GM_xmlhttpRequest(opts);
};

var post = function(url, data, cb) {
    var opts = {
        method: 'POST',
        url: url,
        data: data,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        onload: function (res) {
            cb(res.status, res.responseText, res.finalUrl || url);
        }
    };
    GM_xmlhttpRequest(opts);
};

var getNext = function(fan_id, older_than_token, type) {
    var url = LOAD_URL_FORMAT.replace('{}', type);
    post(url, '{"fan_id":'+fan_id+',"older_than_token":"'+older_than_token+'","count":100}', function(status, res, url) {
        if (status != 200) {
            console.error("failed to get next " + type, status, res, url);
            return;
        }
        var parsed = JSON.parse(res);
        if (parsed.error) {
            console.error("error when getting next " + type, parsed.error_message, parsed);
            return;
        }
        items[type].push(...parsed.items);
        if (parsed.more_available) {
            // we should be able to use parsed.last_token here, but there is currently a bug
            // in the collection_items endpoint in that it always gives the 20th item's token
            // in last_token even if count is different than 20, so we need to get the actual
            // last item's token
            var last_token = parsed.items[parsed.items.length - 1].token;
            getNext(fan_id, last_token, type);
        } else {
            var button = document.querySelector(`#${type}-search div button`);
            var spinner = document.querySelector(`#${type}-search div span`);
            spinner.style.display = 'none';
            button.style.display = 'block';
        }
    });
};

window.onload = function() {
    console.log('sup');
    pageTypes.forEach((type) => {
        if (!started[type]) {
            if (!pageData) {
                pageData = JSON.parse(document.querySelector('#pagedata').getAttribute('data-blob'));
            }
            var start = function() {
                var now = Math.floor(Date.now()/1000);
                var nowToken = pageData[type+'_data'].last_token.replace(/^\d+/, now);
                getNext(pageData.fan_data.fan_id, nowToken, type);
            };
            if (!collectionSummary) {
                get('https://bandcamp.com/api/fan/2/collection_summary', function(status, res, url) {
                    if (status != 200) {
                        console.warn("unexpected response from " + url, status, res);
                    }
                    var parsedRes = JSON.parse(res);
                    if (parsedRes.error) {
                        console.log(parsedRes.error_message);
                    } else {
                        collectionSummary = parsedRes.collection_summary;
                    }
                    start();
                });
            } else {
                start();
            }
            started[type] = true;
        }
    })
};

var onclick = function(type, e) {
    const randomItem = items[type].sort(function() {return 0.5 - Math.random()})[0];
    window.open(randomItem.item_url, '_blank');
};

pageTypes.forEach(function(type) {
    var searchContainer = document.querySelector(`#${type}-search`);
    searchContainer.style.display = 'flex';
    searchContainer.style.alignItems = 'baseline';
    var buttonContainer = document.createElement('div');
    buttonContainer.className = 'search searching';
    buttonContainer.style.display = 'inline-block';
    var spinner = document.createElement('span');
    spinner.innerHTML = `<svg class="search-spinner" style="position: inherit" width="14px" height="14px" viewBox="0 0 14 14"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#search-spinner"></use></svg>`;
    spinner.style.marginLeft = '12px';
    var button = document.createElement('button');
    button.innerHTML = 'Open Random Album';
    button.style.marginLeft = '12px';
    button.style.display = 'none';
    button.style.border = 'none';
    button.style.background = 'transparent';
    button.addEventListener('click', onclick.bind(null, type));
    searchContainer.appendChild(buttonContainer);
    buttonContainer.appendChild(spinner);
    buttonContainer.appendChild(button);
    console.log('hello ' + type);
});