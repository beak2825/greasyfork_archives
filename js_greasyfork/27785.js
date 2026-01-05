// ==UserScript==
// @name         9gag remember position
// @description  If you scroll down and then close your browser, you lose your scrolling progress. This script adds one magical button, that remembers the position for you as bookmarkable link. Easily allowing you to continue where you left off.
// @author       Bladito
// @version      0.2.8
// @homepageURL  https://greasyfork.org/en/users/55159-bladito
// @match        *://9gag.com/*
// @namespace    Bladito/9gag
// @require      http://code.jquery.com/jquery-latest.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/27785/9gag%20remember%20position.user.js
// @updateURL https://update.greasyfork.org/scripts/27785/9gag%20remember%20position.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    detectAdditionInDOM($('.main-wrap').get(0), function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes && $(mutation.addedNodes.item(0)).hasClass('list-stream')) {
                const allArticles = $('.list-stream').find('article[id]');
                allArticles.each(function(index, article) {
                    if (index > 2) {
                        addRememberButton($(article), $(allArticles[index-1]), $(allArticles[index-2]), $(allArticles[index-3]));
                    }
                });
            }
        });
    });

    function addRememberButton($target, prev1, prev2, prev3) {
        const getId = (el) => el.attr('id').replace('jsid-post-', '');
        const url = [location.protocol, '//', location.host, location.pathname].join('');
        const params = '?id='+getId(prev1)+'%2C'+getId(prev2)+'%2C'+getId(prev3)+'&c=10';
        $target.find('.share.right:not(:has(.b9g-remember-btn)) ul')
            .prepend(`<li class="btn-vote"><a class="b9g-remember-btn" title="Remember position" href="${url+params}" rel="nofollow" onClick="setTimeout(()=>window.location.reload(true))"></a></li>`);
    }

    function detectAdditionInDOM(node, callback) {
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
        if (node) {
            if (MutationObserver) {
                var obs = new MutationObserver(function(mutations, observer) {
                    if(mutations[0].addedNodes.length) {
                        callback(mutations);
                    }
                });
                obs.observe(node, { childList:true, subtree:true });
            } else if (window.addEventListener) {
                node.addEventListener('DOMNodeInserted', callback, false);
            }
        }
    }
    GM_addStyle('.b9g-remember-btn:after {' +
                'position: absolute;' +
                'content: " ";' +
                'width: 30px;' +
                'height: 30px;' +
                'left: 50%;' +
                'top: 50%;' +
                'margin-top: -15px;' +
                'margin-left: -15px;' +
                'background: url(https://assets-9gag-fun.9cache.com/s/fab0aa49/a5edd735f6a943e46bc0ff39b700ae2a28d123de/static/dist/web6/img/sprite.png) -87px -12px no-repeat;' +
                'background-size: 700px 220px;' +
                '}');

})(window.jQuery);
