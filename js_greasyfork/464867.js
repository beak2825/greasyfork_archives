// ==UserScript==
// @name              快乐ChatGPT
// @description       使用本脚本可以避免在免费版ChatGPT使用过程中经常性的报错问题，从此再也不用反复刷新网页，直逼plus版本的体验。
// @version           0.0.1
// @author            亿千个太阳
// @namespace         https://b23.tv/dESTNzK
// @supportURL        https://b23.tv/dESTNzK
// @license           GPL-2.0-only
// @match             https://chat.openai.com/*
// @grant             GM_addStyle
// @grant             GM_addElement
// @grant             GM_setValue
// @grant             GM_getValue
// @grant             unsafeWindow
// @run-at            document-idle
// @downloadURL https://update.greasyfork.org/scripts/464867/%E5%BF%AB%E4%B9%90ChatGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/464867/%E5%BF%AB%E4%B9%90ChatGPT.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = (Selector, el) => (el || document).querySelector(Selector);
    var u = `/api/auth/session`;
    var sp_class_1 = 'nav>a.flex';
    var sp_class_2 = 'button.justify-center';
    var $$ = (Selector, el) => (el || document).querySelectorAll(Selector);
    var formatDate = function(d) {
        return (new Date(d)).toLocaleString();
    };
    var autoPingChatPGT = function() {
        fetch(u).then((response) => {
            response.text().then((data) => {
                try {
                    var contentType = response.headers.get('Content-Type');
                    if (contentType.indexOf("application/json") > -1 && response.status !== 403 && data.indexOf(`"expires":"`) > -1) {
                        console.log(`快乐ChatGPT: FETCH: Expire date: ${formatDate(JSON.parse(data).expires)}`);
                    }
                } catch (e) {
                    console.log(`快乐ChatGPT: FETCH: ERROR: ${e},\nERROR RESPONSE:\n${data}`);
                }
            })
        });
    }
    var gdAuditModerations = function(action) {
        if (typeof _fetch == 'undefined') {
            var _fetch = fetch;
        }
        if (action == true) {
            unsafeWindow.fetch = new Proxy(fetch, {
                apply: function (target, thisArg, argumentsList) {
                    var n = {};
                    n.json = function() {return {};};
                    return argumentsList[0].includes('moderations') ? Promise.resolve(n) : target.apply(thisArg, argumentsList);
                }
            });
        } else {
            unsafeWindow.fetch = _fetch;
        }
    };

    var gdConversationNotFound = function(action) {
        if (typeof _fetch == 'undefined') {
            var _fetch = fetch;
        }
        if (action == true) {
            unsafeWindow.fetch = new Proxy(_fetch, {
                apply: function (target, thisArg, argumentsList) {
                    try {
                        if (argumentsList[0].includes('conversation')) {
                            var post_body = JSON.parse(argumentsList[1].body);
                            post_body.conversation_id = location.href.match(/\/c\/(.*)/)[1];
                            argumentsList[1].body = JSON.stringify(post_body);
                        }
                    } catch (e) {}
                    return target.apply(thisArg, argumentsList);
                }
            });
        } else {
            unsafeWindow.fetch = _fetch;
        }
    };
    setInterval(function() {
        if ($(sp_class_1) || $(sp_class_2)) {
            autoPingChatPGT();
        }
    }, 1000 * (10 + Math.floor(Math.random()*7)));
    gdConversationNotFound(true);
})();
