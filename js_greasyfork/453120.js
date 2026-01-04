// ==UserScript==
// @name         Pikabu detailed comments rating
// @namespace    http://pikabu.ru/
// @version      0.2
// @description  Shows pluses and minuses
// @author       Rhoads
// @license      CC-BY-SA-4.0
// @match        https://pikabu.ru/*
// @icon         https://cs14.pikabu.ru/avatars/2609/m2609364-1795047659.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453120/Pikabu%20detailed%20comments%20rating.user.js
// @updateURL https://update.greasyfork.org/scripts/453120/Pikabu%20detailed%20comments%20rating.meta.js
// ==/UserScript==

(function(){
    'use strict';

    function findComments()
    {
        document.querySelectorAll(`div.comments__container .comment`).forEach((comment) => {
            rewriteComment(comment);
        });
    }

    function rewriteComment(comment)
    {
        let cHdr = comment.querySelector(".comment__body > .comment__header");
        let rateCount = cHdr?.querySelector("div.comment__rating-count");
        let rateLabel = rateCount?.getAttribute("aria-label");

        if (!rateLabel)
            return;

        let userName = cHdr?.querySelector("div.comment__user")?.getAttribute("data-name");

        let matches = rateLabel.match(/^(\d+) плюс.*? \/ (\d+) минус.*?$/);
        let result = matches ? (`+${matches[1]} -${matches[2]}`) : "";

        //console.log(`[PIKABU - LIKES] user: ${userName} aria-label: ${rateLabel}, ${result}`);

        if (matches)
        {
            rateCount.textContent = result;
            rateCount.removeAttribute("aria-label");
        }
    }

    findComments();

    // Ajax listener
    !function(send)
    {
        XMLHttpRequest.prototype.send = function(body)
        {
            //console.log(`[PIKABU - LIKES] Request: ${body}`);

            send.call(this, body);

            if (body)
            if (body.includes('get_comments_by_ids')
                || body.includes('get_comments_subtree')
                || body.includes('vote'))
            {
                //console.log(`[PIKABU - LIKES] Request get_comments: ${body}`);

                setTimeout(() => findComments(), 1000);
            }
        };
    }(XMLHttpRequest.prototype.send);
})();