// ==UserScript==
// @name         Remove auto news from ixbt.com
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove automobile news from ixbt.com
// @author       RKD
// @match        https://www.ixbt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ixbt.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469253/Remove%20auto%20news%20from%20ixbtcom.user.js
// @updateURL https://update.greasyfork.org/scripts/469253/Remove%20auto%20news%20from%20ixbtcom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var moreArticlesLinks = document.querySelectorAll(".block__newslist>ul>li,.b-block__newslistdefault>ul>li");

    for (var J = moreArticlesLinks.length - 1; J >= 0; --J) {
        var articleLink = moreArticlesLinks[J];
        //--- Case-insensitive search.
        if (/(GM|BMW|Mercedes|Lada|Tesla|Haval|Chery|Камаз|Kamaz|UAZ|УАЗ|автомоби|злектромоби|Renault|Chevrolet|Dacia|Peugeot|Citroen|Stellantis)/i.test(articleLink.textContent) ) {
            console.log("Removed: " + articleLink.textContent);
            articleLink.remove();
        }
        else if (/(Jeep|Kia|Hyundai|автоваз|Volkswagen|Nio|Wuling|Baojun|Mazda|Honda|Toyota|Geely|Volvo|Polestar|Rivian|Lucid|Ford|V8|запас хода|Aion)/i.test(articleLink.textContent) ) {
            console.log("Removed: " + articleLink.textContent);
            articleLink.remove();
        }
    }
})();