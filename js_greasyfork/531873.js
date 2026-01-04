// ==UserScript==
// @name         reddit.com/r/quietStorm
// @namespace    https://greasyfork.org/en/scripts/506662-posts
// @version      1.0
// @description  curated QuietStorm
// @license      MIT
// @author       You
// @match        https://old.reddit.com/r/QuietStorm/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531873/redditcomrquietStorm.user.js
// @updateURL https://update.greasyfork.org/scripts/531873/redditcomrquietStorm.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let comb = function() {

        Object.entries(document.querySelectorAll(".entry")).reduce(function(res, item) {

            let author = item[1].querySelector(".author").innerText;
            if(author.includes("Ensemblist")) {
                item[1].parentNode.remove();
            } else if(author.includes("Consistent_Edge9211")) {
                item[1].parentNode.remove();
            }

            return true;
        });



        return true;

    };

    setInterval(comb, 500);


})();