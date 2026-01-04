// ==UserScript==
// @name         Twitter Traduko Esperanto
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  On tweets tagged with #Esperanto hashtag, adds a link that translates the tweet on Google Translate, opening it in a new tab
// @author       nulll
// @license      Artistic-2.0
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?domain=twitter.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467818/Twitter%20Traduko%20Esperanto.user.js
// @updateURL https://update.greasyfork.org/scripts/467818/Twitter%20Traduko%20Esperanto.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // heavly inspired by
    // https://greasyfork.org/it/scripts/429954-twitter-1-click-tranlsate/

    let observer;
    const interval = setInterval(init, 500);
    const lang = document.getElementsByTagName('html')[0].getAttribute('lang');

    function init() {

        const el = document.querySelectorAll('div[data-testid="primaryColumn"] section article');

        if (el && el.length > 0) {
            clearInterval(interval);

            //add links to already exisiting articles
            observer = new MutationObserver(newTweets);
            observer.observe(document.body, {
                childList: true,
                attributes: false,
                subtree: true,
                characterData: false
            });

            el.forEach(article => {
                createLink(article);
            });
        }
    }

    function newTweets(mutationList, observer) {

        mutationList.forEach(mut => {

            if (mut.addedNodes.length > 0) {

                mut.addedNodes.forEach(node => {

                    if (node.innerHTML && node.innerHTML.indexOf('<article ') > -1) {

                        createLink(node.querySelector('article'));

                    }
                });
            }

        });
    }

    function createLink(article) {

        // Translate link appears only on tweets having the #Esperanto hashtag
        const htag = article.querySelector('a[href*="/hashtag/Esperanto"]');

        if (htag) {
            let tweet = article.querySelector('[data-testid="tweetText"]');

            let gt_url = "https://translate.google.com/?sl=eo&tl=" + encodeURIComponent(lang) + "&op=translate&text=" + encodeURIComponent(tweet.textContent);

            let link = document.createElement("a");
            link.href = gt_url;
            link.target = '_blank';
            link.textContent = '💚 traduki el Esperanto';

            let css = window.getComputedStyle(htag);
            Array.from(css).forEach(key => link.style.setProperty(key, css.getPropertyValue(key), css.getPropertyPriority(key)));
            link.style.textDecoration = 'none';

            let div = document.createElement("div");
            div.style.marginTop = '1em';
            div.style.marginBottom = '1em';
            div.appendChild(link);

            tweet.after(div);
        }
    }

})();