// ==UserScript==
// @name         Bandcamp - Display Prices on Wishlist
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Simply display a price tag on each item in the wishlist
// @author       Romain Racamier-Lafon
// @match        https://bandcamp.com/*/wishlist
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375932/Bandcamp%20-%20Display%20Prices%20on%20Wishlist.user.js
// @updateURL https://update.greasyfork.org/scripts/375932/Bandcamp%20-%20Display%20Prices%20on%20Wishlist.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var app = {
        id: "bcp-sp"
    };

    app.debug = false;

    var cls = {
        price: app.id + '-price',
        handled: app.id + '-handled'
    };

    var selectors = {
        product: 'li[data-trackid]:not(.' + cls.handled + ')'
    };

    function findOne(selector, context, dontYell) {
        context = context || document;
        var item = context.querySelector(selector);
        if (item && app.debug) {
            console.log(app.id, ': found element matching "' + selector + '"');
        } else if (!item && !dontYell) {
            console.warn(app.id, ': found no element for selector "' + selector + '"');
        }
        return item;
    }

    function findFirst(selector, context) {
        return findAll(selector, context)[0];
    }

    function findAll(selector, context, dontYell) {
        if (!selector || !selector.length || selector.length === 1) {
            console.error(app.id, ': incorrect selector : ', selector);
        }
        context = context || document;
        var items = Array.prototype.slice.call(context.querySelectorAll(selector));
        if (items.length && app.debug) {
            console.log(app.id, ': found', items.length, 'elements matching "' + selector + '"');
        } else if (!items.length && !dontYell) {
            console.warn(app.id, ': found no elements for selector "' + selector + '"');
        }
        return items;
    }

    function debounce(func, wait, immediate) {
        var timeout;
        return function () {
            var context = this;
            var args = arguments;
            var later = function later() {
                timeout = null;
                if (!immediate) {
                    func.apply(context, args);
                }
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) {
                func.apply(context, args);
            }
        };
    }

    function cleanPrevious() {
        findAll('[class^="' + cls.price + '"]', document, true).forEach(function (node) {
            return node.remove();
        });
    }

    function displayPrice(product, price) {
        var tag = document.createElement('div');
        tag.innerHTML = price.value + ' <small>' + price.currency + '</small>';
        tag.style = 'position: absolute; top: 0; right: 0; background-color: green; color: white;';
        tag.classList.add(cls.price, 'col-edit-box');
        product.appendChild(tag);
        if (price.value > 2) {
            product.style.filter = 'grayscale(1) opacity(.5)';
        }
        product.classList.add(cls.handled);
    }

    function displayPrices() {
        findAll(selectors.product, document, true).forEach(function (product) {
            var trackid = parseInt(product.getAttribute('data-trackid'));
            if (trackid) {
                if (app.debug) {
                    console.log(app.id, ': adding price for', trackid);
                }
                if (!app.tracks.hasOwnProperty(trackid)) {
                    throw new Error('failed at gettting track price');
                }
                var price = app.tracks[trackid];
                displayPrice(product, price);
            }
        });
    }

    function setTracksFromList(list) {
        if (!app.tracks) {
            app.tracks = {};
        }
        var added = 0;
        list.map(function (track) {
            var trackid = track.track_id;
            if (!app.tracks.hasOwnProperty(trackid)) {
                app.tracks[trackid] = {
                    value: Math.round(track.price),
                    currency: track.currency
                };
                added++;
            }
        });
        console.log(app.id, ': added', added, 'tracks to local db :D');
    }

    function getDataFromApi() {
        fetch('https://bandcamp.com/api/fancollection/1/wishlist_items', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fan_id: app.userid,
                older_than_token: app.token
            })
        }).then(function (json) {
            return json.json();
        }).then(function (data) {
            app.token = data.last_token;
            setTracksFromList(data.track_list);
            if (data.more_available) {
                getDataFromApi();
            }
        });
    }

    function getDataFromPage() {
        var dataEl = findOne('#pagedata');
        var data = JSON.parse(dataEl.getAttribute('data-blob'));
        setTracksFromList(data.track_list);
        app.token = data.wishlist_data.last_token;
        app.userid = data.fan_data.fan_id;
    }

    function process() {
        displayPrices();
    }

    function init() {
        console.log(app.id, ': init !');
        cleanPrevious();
        getDataFromPage();
        getDataFromApi();
        process();
    }

    init();

    var processDebounced = debounce(process, 500);
    document.addEventListener('scroll', processDebounced);

})();