// ==UserScript==
// @name         Wish.com - Price filter & more edited.
// @namespace    http://tampermonkey.net/
// @version      4.0.SOD
// @description  Filtering by min/max price, allow hidding nsfw products, see reviews. Edited by Son_Of_Diablo, adding option to exclude shipping for prices and disable console logging.
// @original-author       Shuunen
// @author       Son_Of_Diablo
// @match        https://*.wish.com/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368540/Wishcom%20-%20Price%20filter%20%20more%20edited.user.js
// @updateURL https://update.greasyfork.org/scripts/368540/Wishcom%20-%20Price%20filter%20%20more%20edited.meta.js
// ==/UserScript==

(function() {
    'use strict';

    log('wish price filter : init');

    var $ = jQuery.noConflict(true);
    var minPrice = parseInt(localStorage.abwMinPrice) || 0;
    var maxPrice = parseInt(localStorage.abwMaxPrice) || 1000;
    var minStars = parseInt(localStorage.abwMinStars) || 1;
    var hideNsfw = localStorage.abwHideNsfw !== 'false';
    // --- Added by Son_Of_Diablo --- //
    var enableLogging = localStorage.abwEnableLogging !== 'false';
    var includeShipping = localStorage.abwIncludeShipping !== 'false';
    // --- Added by Son_Of_Diablo --- //

    // Returns a function, that, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds. If `immediate` is passed, trigger the function on the
    // leading edge, instead of the trailing.
    function debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this;
            var args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    function fetchData(id, productEl, originalPicture) {
        log('will get data for', id);
        const url = 'https://www.wish.com/c/' + id;
        log('getting data for', id);
        fetch(url)
            .then((r) => r.text())
            .then((html) => {
            const dataMatches = html.match(/"aggregateRating" : ([\w\W\n]+"\n}),/gi);
            const dataStr = dataMatches[0];
            const data = JSON.parse('{' + dataStr.replace('},', '}').replace(/\n/g, '') + '}');
            const ratings = Math.round(data.aggregateRating.ratingValue * 100) / 100;
            const count = Math.round(data.aggregateRating.ratingCount);
            log(id, ': found a rating of', ratings, 'over', count, 'reviews :)');
            let roundedRatings = Math.round(ratings);
            let ratingsStr = '';
            while (roundedRatings--) {
                ratingsStr += '<img class="abw-star" src="https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678064-star-20.png" />';
            }
            if (count > 0) {
                ratingsStr += '<hr> over ' + count + ' reviews';
            } else {
                ratingsStr = 'no reviews !';
            }
            productEl.find('.feed-details-row2').css('display', 'flex').css('align-items', 'center').html(ratingsStr);
            const shippingMatches = html.match(/"localized_shipping":\s{"localized_value":\s(\d)/i);
            const shippingFees = parseInt(shippingMatches[1]);
            log(id, ': shipping fees', shippingFees);
            const priceMatches = productEl.find('.feed-actual-price').text().match(/\d+/);
            const price = parseInt(priceMatches && priceMatches.length ? priceMatches[0] : 0);
            log(id, ': base price', price);
            const totalPrice = price + shippingFees;
            const priceEl = productEl.find('.feed-actual-price');
            if(includeShipping){
                priceEl.html(totalPrice + ' ' + getCurrency());
            }else{
                priceEl.html(price + ' ' + getCurrency());
            }
            const nsfwMatches = html.match(/sex|lingerie|crotch|masturbat|vibrator|bdsm|bondage|nipple/gi);
            if (nsfwMatches && nsfwMatches.length) {
                productEl.addClass('abw-nsfw');
            }
            showHideProduct(productEl, originalPicture);
        })
            .catch((error) => {
            log('did not managed to found ratings for product "' + id + '"' + error, true);
        });
    }

    var currency = null;
    function getCurrency(){
        if(currency){
            return currency;
        }
        $('.feed-actual-price').each(function(index, el){
            if(currency) {
                return;
            }
            var arr = el.textContent.replace(/\d+/, '_').split('_');
            if(arr.length === 2){
                log('currency found at iteration', index);
                currency = arr[1];
            }
        });
        log('detected currency :', currency);
        return currency;
    }

    var loadedUrl = '//main.cdn.wish.com/fd9acde14ab5/img/ajax_loader_16.gif?v=13';

    function getData(element) {
        const productEl = $(element.tagName ? element : element.currentTarget);
        if (productEl.hasClass('abw-with-data')) {
            log('product has already data');
            return;
        }
        productEl.addClass('abw-with-data');
        const image = productEl.find('a.display-pic');
        if (!image || !image[0]) {
            log('did not found image on product' + productEl, true);
            return;
        }
        var href = image.attr('href');
        if (!href) {
            log('did not found href on product' + productEl, true);
            return;
        }
        const id = href.split('/').reverse()[0];
        const originalPicture = image[0].style.backgroundImage;
        image[0].style.backgroundImage = 'url(' + loadedUrl + ')';
        image[0].style.backgroundSize = '10%';
        fetchData(id, productEl, originalPicture);
    }

    function getNextData() {
        const amount = 10;
        log('getting next', amount, 'items data');
        $('.feed-product-item:visible:not(.abw-with-data):lt(' + amount + ')').each((index, element) => {
            setTimeout(() => getData(element), index * 300);
        });
    }

    function showHideProduct(element, originalPicture) {
        const productEl = $(element);
        const priceEl = productEl.find('.feed-actual-price');
        var price = priceEl.text().replace(/\D/g, '');
        var nbStars = productEl.find('img.abw-star').size();
        var priceOk = price <= maxPrice;
        if(!price){
            log(productEl, true);
        }
        if (minPrice && minPrice > 0) {
            priceOk = priceOk && price >= minPrice;
        }

        if (priceOk && minStars && minStars > 0 && productEl.hasClass('abw-with-data')) {
            priceOk = nbStars >= minStars;
        }
        if (priceOk && hideNsfw && productEl.hasClass('abw-nsfw')) {
            priceOk = false;
        }
        if (originalPicture) {
            const image = productEl.find('a.display-pic');
            if (!image || !image[0]) {
                log('did not found image on product' + productEl, true);
                return;
            }
            image[0].style.backgroundImage = originalPicture;
            image[0].style.backgroundSize = '100%';
        }
        if (priceOk) {
            productEl.show('fast');
            if (!productEl.hasClass('abw-on-hover')) {
                productEl.addClass('abw-on-hover');
                productEl.hover(getData);
            }
        } else {
            productEl.hide('fast');
        }
    }

    function showHideProducts(event) {
        log('wish price filter : showHideProducts');
        setTimeout(hideUseless, 100);
        setTimeout(getNextData, 100);
        $('.feed-product-item').each((index, element) => {
            showHideProduct(element);
        });
    }

    // prepare a debounced function
    var showHideProductsDebounced = debounce(showHideProducts, 100);

    // activate when window is scrolled
    window.onscroll = showHideProductsDebounced;

    function hideUseless() {
        // hide products that can't be rated in order hsitory
        $('.transaction-expanded-row-item .rate-button').parents('.transaction-expanded-row-item').addClass('abw-has-rate');
        $('.transaction-expanded-row-item:not(.abw-has-rate)').remove();
        // delete useless marketing stuff
        $('.discount-banner, .product-name + .error, .urgency-inventory, .product-boost-rect, .header-hello, .badge-details, .faster-shipping-wrapper, #footer-like, #FixedNavBarWrapper').remove();
        // delete fake original prices
        $('.feed-crossed-price, .original-price, [class*="CrossedPrice"]').remove()
        // delete sms reminders
        $('.transaction-opt-in-banner, .sms-div, .sms-notification-request').remove()
    }

    setTimeout(hideUseless, 100);

    var html = '<div id="wish_tweaks_config" style="float:left; white-space: nowrap; margin-right:10px;display:flex;justify-content:space-between;align-items:center;font-weight: bold;font-size: 13px;font-family: sans-serif;color: white;background-color: steelblue;padding:6px 12px;border-radius: 5px;">';
    html += 'Min / Max Price : <input id="wtc_min_price" type="text" style="width: 30px; text-align: center; margin-left: 5px;">&nbsp;/<input id="wtc_max_price" type="text" style="width: 30px; text-align: center; margin-left: 5px; margin-right: 10px;">';
    html += 'Min stars : <input id="wtc_min_stars" type="text" style="width: 20px; text-align: center; margin: 0 5px;">&nbsp;';
    html += 'Hide nsfw : <input id="wtc_hide_nsfw" type="checkbox" checked style="margin: 0; height: 16px; width: 16px; margin: 0 5px;">';
    // --- Added by Son_Of_Diablo --- //
    html += 'Include Shipping : <input id="wtc_include_shipping" type="checkbox" checked style="margin: 0; height: 16px; width: 16px; margin: 0 5px;">';
    html += 'Enable logging : <input id="wtc_enable_logging" type="checkbox" checked style="margin: 0; height: 16px; width: 16px; margin: 0 5px;">';
    // --- Added by Son_Of_Diablo --- //
    html += '</div>';

    if ($('#header-left').length) {
        // insert controllers in v1 header
        $('#mobile-app-buttons').remove();
        $('#nav-search-input-wrapper').width(320);
        $('#header-left').after(html);
    } else if ($('.left.feed-v2').length) {
        // insert controllers in v2 header
        $('.left.feed-v2').before(html);
    } else {
        log('failed at inserting controllers', true)
    }

    // get elements
    var hideNsfwCheckbox = $('#wtc_hide_nsfw');
    var minStarsInput = $('#wtc_min_stars');
    var minPriceInput = $('#wtc_min_price');
    var maxPriceInput = $('#wtc_max_price');
    // --- Added by Son_Of_Diablo --- //
    var includeShipppingCheckbox = $('#wtc_include_shipping');
    var enableLoggingCheckbox = $('#wtc_enable_logging');
    // --- Added by Son_Of_Diablo --- //

    // restore previous choices
    hideNsfwCheckbox.attr('checked', hideNsfw);
    minStarsInput.val(minStars);
    // --- Added by Son_Of_Diablo --- //
    minPriceInput.val(minPrice);
    maxPriceInput.val(maxPrice);
    includeShipppingCheckbox.attr('checked', includeShipping);
    enableLoggingCheckbox.attr('checked', enableLogging);
    // --- Added by Son_Of_Diablo --- //

    // start filtering by default
    setTimeout(() => {
        showHideProductsDebounced();
        getNextData();
    }, 1000);

    // when input value change
    hideNsfwCheckbox.change((event) => {
        hideNsfw = event.currentTarget.checked;
        localStorage.abwHideNsfw = hideNsfw;
        log('hideNsfw is now', hideNsfw);
        showHideProductsDebounced();
    });
    // --- Added by Son_Of_Diablo --- //
    includeShipppingCheckbox.change((event) => {
        includeShipping = event.currentTarget.checked;
        localStorage.abwIncludeShipping = includeShipping;
        log('includeShipping is now', includeShipping);
        showHideProductsDebounced();
    });
    enableLoggingCheckbox.change((event) => {
        enableLogging = event.currentTarget.checked;
        localStorage.abwEnableLogging = enableLogging;
        log('enableLogging is now', enableLogging);
        showHideProductsDebounced();
    });
    // --- Added by Son_Of_Diablo --- //
    minPriceInput.change((event) => {
        minPrice = parseInt(event.currentTarget.value) || 0;
        // --- Added by Son_Of_Diablo --- //
        localStorage.abwMinPrice = minPrice;
        // --- Added by Son_Of_Diablo --- //
        log('minPrice is now', minPrice);
        showHideProductsDebounced();
    });
    maxPriceInput.change((event) => {
        maxPrice = parseInt(event.currentTarget.value) || 1000;
        // --- Added by Son_Of_Diablo --- //
        localStorage.abwMaxPrice = maxPrice;
        // --- Added by Son_Of_Diablo --- //
        log('maxPrice is now', maxPrice);
        showHideProductsDebounced();
    });
    minStarsInput.change((event) => {
        minStars = parseInt(event.currentTarget.value);
        localStorage.abwMinStars = minStars;
        log('minStars is now', minStars);
        showHideProductsDebounced();
    });

    // --- Added by Son_Of_Diablo --- //
    function log(message, error) {
        if(enableLogging){
        	if(!error){
        		console.log(message);
        	}else{
        		console.error(message);
        	}
    	}
    }
    // --- Added by Son_Of_Diablo --- //

})();
