// ==UserScript==
// @name         yoshikei-rakuraku-recipe
// @namespace    loupe.page
// @version      2024-01-23
// @description  ヨシケイ楽々webのレシピを普通のaタグに置き換え&注文画面の数量に1を入れておく
// @author       mikan loupe
// @match        https://yoshikei-rakurakuweb.com/order/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yoshikei-rakurakuweb.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485648/yoshikei-rakuraku-recipe.user.js
// @updateURL https://update.greasyfork.org/scripts/485648/yoshikei-rakuraku-recipe.meta.js
// ==/UserScript==

(function() {
    'use strict';

    jQuery('input[data-before_suryo]').val(1)
    setInterval(function(){
        jQuery('.recipe_page_open[data-recipe_url]').wrap(function(){
            return "<a href='" + this.dataset.recipe_url + "' target='_blank'></a>";
        }).removeClass('recipe_page_open');
    },500)
})();