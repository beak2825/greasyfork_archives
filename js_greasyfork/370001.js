// ==UserScript==
// @name         Fucking with people
// @namespace    https://github.com/ashkitten
// @version      1.1.0
// @description  inserts random hair spaces into your toots to fuck with people
// @author       ashkitten
// @match        https://sleeping.town/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370001/Fucking%20with%20people.user.js
// @updateURL https://update.greasyfork.org/scripts/370001/Fucking%20with%20people.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

// checks if we're in the process of typing a mention or emoji
// mostly stolen from my girlfriend: https://github.com/rustodon/rustodon/blob/master/lib/posticle/src/regexes.rs
// this is needlessly overcomplicated but it was fun so yeah
const PARTIAL_MENTION_OR_EMOJI = /(?:@(?:[a-zA-Z0-9_]{1,32})?(?:[@](?:(?:(?:(?:[^-_!\"#$%&\'()*+,./:;<=>?@\[\]^`{|}~\x00-\x1F\x7F\ufffe\ufeff\uffff\u202a-\u202e\t-\r \u0085\u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u202f\u205f\u3000](?:[^!\"#$%&\'()*+,./:;<=>?@\[\]^`{|}~\x00-\x1F\x7F\ufffe\ufeff\uffff\u202a-\u202e\t-\r \u0085\u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]*[^-_!\"#$%&\'()*+,./:;<=>?@\[\]^`{|}~\x00-\x1F\x7F\ufffe\ufeff\uffff\u202a-\u202e\t-\r \u0085\u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u202f\u205f\u3000])?)\.)*(?:[^-_!\"#$%&\'()*+,./:;<=>?@\[\]^`{|}~\x00-\x1F\x7F\ufffe\ufeff\uffff\u202a-\u202e\t-\r \u0085\u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u202f\u205f\u3000](?:[^!\"#$%&\'()*+,./:;<=>?@\[\]^`{|}~\x00-\x1F\x7F\ufffe\ufeff\uffff\u202a-\u202e\t-\r \u0085\u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]*[^-_!\"#$%&\'()*+,./:;<=>?@\[\]^`{|}~\x00-\x1F\x7F\ufffe\ufeff\uffff\u202a-\u202e\t-\r \u0085\u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u202f\u205f\u3000])?)\.(?:[^-_!\"#$%&\'()*+,./:;<=>?@\[\]^`{|}~\x00-\x1F\x7F\ufffe\ufeff\uffff\u202a-\u202e\t-\r \u0085\u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]?[^-_!\"#$%&\'()*+,./:;<=>?@\[\]^`{|}~\x00-\x1F\x7F\ufffe\ufeff\uffff\u202a-\u202e\t-\r \u0085\u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\d](?:[^!\"#$%&\'()*+,./:;<=>?@\[\]^`{|}~\x00-\x1F\x7F\ufffe\ufeff\uffff\u202a-\u202e\t-\r \u0085\u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]{1,60}[^-_!\"#$%&\'()*+,./:;<=>?@\[\]^`{|}~\x00-\x1F\x7F\ufffe\ufeff\uffff\u202a-\u202e\t-\r \u0085\u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]|[^-_!\"#$%&\'()*+,./:;<=>?@\[\]^`{|}~\x00-\x1F\x7F\ufffe\ufeff\uffff\u202a-\u202e\t-\r \u0085\u00a0\u1680\u180e\u2000-\u200a\u2028\u2029\u202f\u205f\u3000])?))))?|(?<=[^:]|\n|^):[a-zA-Z0-9_]*:?)$/;

(function() {
    'use strict';

    // callback function to execute when mutations are observed
    // we can't use an arrow function here because we need the `this` object
    new MutationObserver(function(mutations) {
        // target the composer textarea
        let textarea = document.querySelector(".composer--textarea .textarea");
        // check if it exists
        if (textarea) {
            textarea.addEventListener("input", e => {
                // check if we're inserting a single character
                if (e.data && e.data.length === 1) {
                    // check that we're not @mentioning someone or typing out an :emoji:
                    if (textarea.value.slice(0, textarea.selectionStart).search(PARTIAL_MENTION_OR_EMOJI) === -1) {
                        // a 1 in 5 chance works pretty well
                        if (Math.random() < 0.2) {
                            // insert a hair space
                            textarea.value = `${textarea.value.slice(0, textarea.selectionStart)}\u200a${textarea.value.slice(textarea.selectionStart)}`;
                            textarea.setSelectionRange(textarea.selectionStart + 1, textarea.selectionStart + 1);
                        }
                    }
                }
            });
            // disconnect the MutationObserver so it won't get called again
            this.disconnect();
        }
    }).observe(document.body, { childList: true, subtree: true });
})();