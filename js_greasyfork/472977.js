// ==UserScript==
// @name         Twitter Antibot
// @name:ru      Twitter Antibot
// @description The script highlights the Kremlin's bots in the Russian-language segment of Twitter
// @description:ru  Подсвечивает ботов в твиттере.
// @namespace    twitter
// @version      0.2.10
// @license MIT 
// @description  antibot for twitter
// @author       codeninja_ru
// @match               *://twitter.com/*
// @match               *://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant    GM.xmlHttpRequest
// @grant    GM.addStyle
// @grant    GM.getValue
// @grant    GM.setValue
// @grant    GM.deleteValue
// @grant    GM_xmlHttpRequest
// @grant    GM_addStyle
// @grant    GM_getValue
// @grant    GM_setValue
// @grant    GM_deleteValue
// @connect raw.githubusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/472977/Twitter%20Antibot.user.js
// @updateURL https://update.greasyfork.org/scripts/472977/Twitter%20Antibot.meta.js
// ==/UserScript==


const BOT_DB_URL = 'https://raw.githubusercontent.com/antibot4navalny/accounts_labelled/main/labels.json';
const BOT_DB_MANUAL_URL = 'https://raw.githubusercontent.com/antibot4navalny/accounts_labelled/main/labels_manual.json';


const gmDeleteValue = typeof GM.deleteValue == 'function' ? GM.deleteValue : GM_deleteValue;
const gmSetValue = typeof GM.setValue == 'function' ? GM.setValue : GM_setValue;
const gmGetValue = typeof GM.getValue == 'function' ? GM.getValue : GM_getValue;
const gmXmlHttpRequest = typeof GM_xmlHttpRequest == 'function' ? GM_xmlHttpRequest : GM.xmlHttpRequest;
const gmAddStyle = typeof GM.addStyle == 'function' ? GM.addStyle : GM_addStyle;

gmAddStyle(`article[data-bot] {
        background: #FEE !important;
    }

    article[data-bot] [data-bot-name]:before {
         color: red !important;
         content: 'БОТ:';
         display: inline;
    }

    article[data-bot=red] [data-bot-name]:before {
        content: 'БОТ:';
    }

    article[data-bot=yellow] [data-bot-name]:before {
        content: '⚠️';
    }

    @media (prefers-color-scheme: dark) {
        article[data-bot] {
           background: #4b3333 !important;
        }
    }
`);

function watchOnTweets(newTweetCallback) {
    var targetNode = document.body;
    if (targetNode) {
        var config = { childList: true, subtree: true };
        // Callback function to execute when mutations are observed
        var callback = function(mutationsList, observer) {
            for(var mutation of mutationsList) {
                if (mutation.type == 'childList') {
                    var tweets = [];
                    Array.prototype.filter.call(mutation.addedNodes, function(node) {
                        return node instanceof Element;
                    })
                        .forEach(function(element) {
                        selectAllTweets(element).forEach(function(tweet) {
                            tweets.push(tweet);
                        });
                    });

                    if (tweets.length > 0) {
                        newTweetCallback(tweets);
                    }
                }

            }
        };

        // Create an observer instance linked to the callback function
        var observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(targetNode, config);
    }
}

function getUserName(tweet) {
    const firstLink = tweet.querySelector('a[href]');
    if (firstLink) {
        return firstLink.getAttribute('href')
            .substring(1);
    }
}

function getGmValue(name, defaultValue = undefined) {
    const value = gmGetValue(name, defaultValue);

    // GM.set/getValue in  Violentmonkey are sync, in most other enginese they are async
    if (value instanceof Promise) {
        return value;
    } else {
        return Promise.resolve(value);
    }
}

function xFetch(url) {
    const fetchUrl = function(url) {
        return new Promise(function(resolve, reject) {
            gmXmlHttpRequest({
                method: "GET",
                anonymous: true,
                url: url,
                onload: function(response) {
                    resolve(JSON.parse(response.responseText));
                },
                onerror: function(err) {
                    reject(err);
                }
            });
        });
    };
    if (typeof fetch == 'function') {
        // xmlHttpRequest is not working on some platforms, so fetch is called first
        // see https://github.com/Tampermonkey/tampermonkey/issues/1838
        // TODO remove fetch once the issue is fixed
        return fetch(url)
            .then((resp) => resp.json())
            .catch(err => {
                return fetchUrl(url);
            });
    } else {
        return fetchUrl(url);
    }
}

var botDb = {};

function loadBotDb(url) {
    return getGmValue(url).then(cache => {
        if (cache && cache.value && cache.last_update) {
            if (Date.now() - cache.last_update < 3600000 * 24) {
                console.log(`the db ${url} has been loaded from the cache`);
                return cache.value;
            }
        }
        gmDeleteValue(url);

        return xFetch(url);
    }).then(db => {
        botDb = Object.assign(botDb, db);
        gmSetValue(url, {
            last_update: Date.now(),
            value: db,
        });
        return db;
    }).catch(err => {
        alert(`Could not load the db from url: ${url}, err: ${err}`);
    });

}

function checkIfBot(userName, botCallback) {
    if (botDb[userName] !== undefined) {
        botCallback(botDb[userName]);
    }
}

function processTweet(tweet) {
    const userName = getUserName(tweet);
    if (userName) {
        checkIfBot(userName, function(botInfo) {
            console.log("bot's message found, userName: " + userName);
            tweet.dataset.bot = botInfo;
            tweet.querySelector('span').dataset.botName = 1;
        });
    }
}

function selectAllTweets(element) {
    return element.querySelectorAll('article[role=article]');
}

Promise.all([
    loadBotDb(BOT_DB_URL),
    loadBotDb(BOT_DB_MANUAL_URL)
]).then(function() {
    console.log('bots db has been loaded');
    selectAllTweets(document).forEach(processTweet);
    watchOnTweets(function(tweets) {
        tweets.forEach(processTweet);
    });
});

console.log('Twitter Antibot has started');