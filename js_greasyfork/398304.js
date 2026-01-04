// ==UserScript==
// @name         Random Deliveroo Recomendation
// @namespace    https://lou.best/
// @version      0.1
// @description  Highlights one random restaurant and one random meal per category
// @author       Hidjy
// @match        https://deliveroo.fr/*
// @grant        none
// @require      https://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/398304/Random%20Deliveroo%20Recomendation.user.js
// @updateURL https://update.greasyfork.org/scripts/398304/Random%20Deliveroo%20Recomendation.meta.js
// ==/UserScript==

/* globals $ */
/* jshint esversion: 6 */

const color = "palegreen";

let list = $("li[class*='HomeFeedGrid']");
if (list.length > 0)
{
    let randRestaurant = Math.floor((Math.random() * list.length));
    list[randRestaurant].style["background-color"] = color
}

let categories = $("ul.menu-index-page__items");
categories.each(function(){
    let items = $(this).find("li.menu-index-page__item");
    if (items.length > 0) {
        let randItem = Math.floor((Math.random() * items.length));
        items[randItem].style["background-color"] = color;
    }
})
