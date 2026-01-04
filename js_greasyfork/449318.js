// ==UserScript==
// @name         resetera-twitter-embed-quick-fix
// @namespace    https://greasyfork.org/en/users/123852-johndoe
// @version      1.7
// @description  Quick Fix for Broken Embed Tweets
// @author       John Doe
// @match        https://www.resetera.com/threads/*
// @grant        GM.xmlHttpRequest
// @license      CC0 (Creative Commons Zero)
// @downloadURL https://update.greasyfork.org/scripts/449318/resetera-twitter-embed-quick-fix.user.js
// @updateURL https://update.greasyfork.org/scripts/449318/resetera-twitter-embed-quick-fix.meta.js
// ==/UserScript==

// ####################################################################################################################################
/* jshint esversion: 8 */

/* ------------------------------ */
(function() {
    var _debug = 0;
    var _methods = [
        "assert", "clear", "count", "countReset", "debug", "dir", "dirxml", "error",
        "exception", "group", "groupCollapsed", "groupEnd", "info", "log",
        "profile", "profileEnd", "table", "time", "timeEnd",
        "timeLog", "timeStamp", "trace", "warn"
    ];
    var _console = (window.console = window.console || {});
    _methods.forEach(method => {
        if (!_debug) {
            _console[method] = function() {};
        } else {
            if (!_console[method]) {
                _console[method] = function() {};
            }
        }
    });
    var logger = _console;

    var head = document.head || document.getElementsByTagName('head')[0]
    var num_nodes_replaced = 0;
    var num_tags_found = 0;
    var tweets_data = [];
    var tweets_ids = [];
    var css_style = `
        <style id="js-style-twitter" type="text/css">
            .js-twitter-fix a:link {
                color: hsl(204, 88%, 53%);
            }
            .js-twitter-fix a:visited {
                color: hsl(204, 88%, 53%);
            }
            .js-twitter-fix a:any-link {
                color: hsl(204, 88%, 53%);
            }
        </style>
        `;

    function isNumeric(value) {
        return /^-?\d+$/.test(value);
    }
    function get_tweet_data(id) {
        logger.log("get data for downloaded tweed id", id);
        let obj = tweets_data.find(o => o.id === id);
        return obj;
    }

    function get_tweet_template_element(tweet) {
        let div = document.createElement("div");
        div.classList = "js-twitter-fix";
        div.style.cssText = 'color:black;background-color:white;max-width: 400px;padding: 5px; border-radius: 15px; border-color:rgb(29, 155, 240); border-style: solid;}';
        div.innerHTML = `
            Author: <a href="${tweet.data.author_url}">${tweet.data.author_name}</a>
            <hr>
            ${tweet.data.html}
            <hr>
            <a href="${tweet.data.url}">twitter</a>
            `;
        return div;

    }

    async function find_tweet_ids() {
        let spans = document.querySelectorAll(`SPAN[data-s9e-mediaembed="twitter"]`);
        let iframes = document.querySelectorAll(`IFRAME[data-s9e-mediaembed="twitter"]`);
        if (typeof(spans) != 'undefined' && spans != null) {
            spans.forEach(function(el) {
                let json_data = JSON.parse(el.dataset.s9eMediaembedIframe)
                let src = json_data[json_data.indexOf('src')+1];
                let regex = /(\/status\/|twitter\.min\.html#)([0-9]{18,20})/;
                let m = regex.exec(src);
                if (m !=null && isNumeric(m[2])){
                    tweets_ids.push(m[2]);
                }
            });
        }
        if (typeof(iframes) != 'undefined' && iframes != null) {
            iframes.forEach(function(el) {
                let src = el.src;
                let regex = /(\/status\/|twitter\.min\.html#)([0-9]{18,20})/;
                let m = regex.exec(src);
                console.log("m", m);
                if (m !=null && isNumeric(m[2])){
                    tweets_ids.push(m[2]);
                }
            });
        }
        num_tags_found = tweets_ids.length;
        logger.log("%d tags found", num_tags_found);
        tweets_ids = tweets_ids.filter(function(item, pos) {
            return tweets_ids.indexOf(item) == pos;
        })
        logger.log("%d unique ids", tweets_ids.length);
        return tweets_ids;
    }

    async function fetch_tweet_api(tweet_id) {
        // https://developer.twitter.com/en/docs/twitter-for-websites/oembed-api
        let url = 'https://publish.twitter.com/oembed?omit_script=true&dnt=true&url=https://twitter.com/user/status/' + tweet_id;
        logger.log("fetch api url", url);
        GM.xmlHttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                if (response.readyState === 4) {
                    if(response.status === 200) {
                        logger.log("dowloaded %s", tweet_id)
                        let data = JSON.parse(response.responseText);
                        tweets_data.push({
                            id: tweet_id,
                            html: data.html,
                            data: data
                        });
                    }
                    if (response.status === 404){
                        logger.error("Tweet %s not found at %s", tweet_id, url)
                    }
                    if (response.status === 500){
                        logger.error("Server error", tweet_id, url)
                    }
                }
            },
            onerror: function(event){
                logger.error("tweet %s download failed", tweet_id, event);
            }
        });
    }

    async function replace_twitter_nodes() {
        let counter = 0;
        // https://s9e.github.io/iframe/2/twitter.min.html#1559520901443510274#theme=dark
        document.querySelectorAll(`IFRAME[data-s9e-mediaembed="twitter"]`).forEach(async function(el) {
            let src= el.src;
            let m = /(\/status\/|twitter\.min\.html#)([0-9]{18,20})/.exec(src);
            if (m != null && isNumeric(m[2])){
                let tweet = get_tweet_data(m[2]);
                if (typeof(tweet) != 'undefined' && tweet != null) {
                    el.insertAdjacentElement('afterend', get_tweet_template_element(tweet));
                    el.remove();
                    num_nodes_replaced++;
                    counter++;
                }
            }
        });
        if (counter > 0) {
            logger.log("this round: %d / replaced: %d / total found: %d", counter, num_nodes_replaced, num_tags_found);
        }
    }

    function loop_replacing() {
        let num_spans = document.querySelectorAll(`SPAN[data-s9e-mediaembed="twitter"]`).length;
        let num_iframes = document.querySelectorAll(`IFRAME[data-s9e-mediaembed="twitter"]`).length;
        if ((num_spans + num_iframes) > 0) {
            logger.log("task scheduled", num_nodes_replaced, "of", num_tags_found);
            setTimeout(()=>{
                replace_twitter_nodes();
                loop_replacing();
            }, 3000);
        } else {
            logger.log("no more taskes required");
        }
    }

    async function main() {
        let promises = [];
        await find_tweet_ids();
        logger.table(tweets_ids);
        if (tweets_ids.length > 0) {
            head.insertAdjacentHTML("beforeend", css_style);
            tweets_ids.forEach((tweet_id) => {
                promises.push(fetch_tweet_api(tweet_id));
            });
            Promise.all(promises)
                .then(() => {
                    logger.log("schedule task");
                    loop_replacing();
                })
                .catch((e) => {
                    logger.error("promise error:", e);
                });

        }
    }


    main();

})();
