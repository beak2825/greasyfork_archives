// ==UserScript==
// @name        General Discussion Noob Filter
// @description Hides all posts from players with an ID that's greater than specified from General Discussions.
// @version     1.0.2
// @author      NichtGersti [3380912]
// @namespace   tampermonkey.com
// @match       https://www.torn.com/forums.php*
// @run-at      document-end
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/536541/General%20Discussion%20Noob%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/536541/General%20Discussion%20Noob%20Filter.meta.js
// ==/UserScript==

(function () {

    //vvvvvvvvvvvvvvvvvvvv
    //vvvvvvvvvvvvvvvvvvvv
    const hideId = 3600000
    //^^^^^^^^^^^^^^^^^^^^
    //^^^^^^^^^^^^^^^^^^^^

    const forumObserver = new MutationObserver((mutationList, observer) => {
        if (/(f=2&)|(f=2$)/.test(document.location.href)) {
            const wrap = document.querySelector(".forums-committee-wrap");
            if (wrap) {
                console.log("Filtering noob posts:");
                [...wrap.querySelectorAll(".threads-list > li")].filter(e => {
                    return (e.querySelector(".starter > .user.name").href.match(/\d+/)[0] >= hideId)
                }).forEach(e => {
                    e.style.display = "none"
                    console.log("Hid a post from: " + e.querySelector(".starter > .user.name").href.match(/\d+/)[0])
                });
            };
        };
    });

    forumObserver.observe(document.querySelector("#forums-page-wrap"), {
        childList: true,
    });

})();

