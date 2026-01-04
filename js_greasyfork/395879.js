// ==UserScript==
// @name         Fetching resturant rating
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Google help u.
// @author       You
// @match        https://www.ubereats.com/*
// @grant       GM_xmlhttpRequest
// @require http://code.jquery.com/jquery-3.4.1.min.js

// @downloadURL https://update.greasyfork.org/scripts/395879/Fetching%20resturant%20rating.user.js
// @updateURL https://update.greasyfork.org/scripts/395879/Fetching%20resturant%20rating.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    console.log('start fetching rating');
    let GET = (url, headers) => {
        return new Promise((resolve, reject) => {
            let req = GM_xmlhttpRequest({
                method:"GET",
                url: url,
                headers: headers,
                fetch: true,
                onerror: ()=>reject(`fetch ${url} failed`),
                onload: (e)=>resolve(e.responseText)
            });
        });
    };

    function waitForEl(selector, callback) {
        if (jQuery(selector).length) {
            callback();
        } else {
            setTimeout(function() {
                waitForEl(selector, callback);
            }, 100);
        }
    };

    const getResturantInfo = async (restaurant) => {
      const shortRestaurantName = encodeURIComponent(restaurant);
      const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${shortRestaurantName}&sensor=true&key=AIzaSyDoVUPuS1-dBT3jMsAWH8jxvyZmxiC3uZI`;
      const raw = await GET(url);
      const data = JSON.parse(raw);

      return data.results;
    };

    const getRatingByRestaurant = async (restaurant) => {
        const results = await getResturantInfo(restaurant);
        const firstResult = results[0];
        const { name, rating, user_ratings_total } = firstResult;
        return {
          name,
          rating,
          user_ratings_total,
        };
    };

    const selectorOfRestaurantName = '#wrapper > main > div.an.ao.ap.aq.ar > div.es.et.eu.ev.ew.ex > div:nth-child(1) > section > div.f5.au.f6.f7.f8 > ul > li:nth-child(1) > div > div > div > div:nth-child(3) > div.au.fw.aw > div.au.bp.d5.fx.ey > h3';
    $(document).ready(async function() {
        waitForEl(selectorOfRestaurantName, () => {
            document.querySelectorAll(selectorOfRestaurantName).forEach(async elem => {
                const ratingText = document.createElement('p')
                ratingText.style.cssText = 'display: block; margin-top: 8px; padding: 0 8px; line-height: 24px; font-size: 14px; color: #fff; background-color: black; height: 24px;';
                const { name, rating, user_ratings_total } = await getRatingByRestaurant(elem.innerHTML);
                ratingText.innerHTML = `${name}: ${rating} (${user_ratings_total})`;
                elem.appendChild(ratingText)
            })
        });
    });
})();