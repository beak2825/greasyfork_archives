// ==UserScript==
// @name         Steam Purblisher Support Email
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  try to take over the world!
// @icon         https://store.steampowered.com/favicon.ico
// @author       Bisumaruko
// @include      https://store.steampowered.com/app/*
// @include      https://store.steampowered.com/search/*
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      help.steampowered.com
// @run-at       document_ready
// @downloadURL https://update.greasyfork.org/scripts/383212/Steam%20Purblisher%20Support%20Email.user.js
// @updateURL https://update.greasyfork.org/scripts/383212/Steam%20Purblisher%20Support%20Email.meta.js
// ==/UserScript==

GM_addStyle(`
    .steam_support_email {
        width: 940px;
        margin: 0 auto;
        padding-bottom: 20px;
    }
    .steam_support_email--search {
        display: inline-block;
        padding-bottom: 10px;
    }
`);

const $ = unsafeWindow.$J;
const request = options => new Promise((resolve, reject) => {
    options.onerror = reject;
    options.ontimeout = reject;
    options.onload = resolve;

    GM_xmlhttpRequest(options);
});
const fetchSuportEmail = async function fetchSuportEmail(appID, callback) {
    if (!isNaN(appID)) {
        let email = '';
        const res = await request({
            method: 'GET',
            url: `https://help.steampowered.com/en/wizard/HelpWithGameTechnicalIssue?appid=${appID}`,
        });

        if (res.status === 200) {
            if (res.responseText.length > 0) {
                try {
                    const parser = new DOMParser();
                    const tempEmails = [];
                    const root = parser.parseFromString(res.responseText, 'text/html').querySelector('.help_official_box');
                    const nodeIterator = document.createNodeIterator(root, NodeFilter.SHOW_TEXT);
                    let textNode;

                    while ((textNode = nodeIterator.nextNode())) {
                        if (textNode.textContent.includes('@')) {
                            tempEmails.push(textNode.textContent.trim().split(' ').pop());
                        }
                    }

                    email = tempEmails.join(', ');
                } catch (e) {
                    console.log(e);
                    email = 'Failed to extract publisher support email.';
                }
            } else email = 'Empty response HTML';
        } else email = 'Failed to fetch publisher support email.';

        if (email.length > 0) callback(email);
    }
};

$(() => {
    if (location.pathname.startsWith('/app/')) {
        const appID = location.pathname.match(/\/(\d+?)\//)[1];

        fetchSuportEmail(appID, (email) => {
            $('.queue_overflow_ctn').after(`
                <div class="steam_support_email">
                    <p>Support Email: ${email}</p>
                </div>
            `);
        });
    } else if (location.pathname.startsWith('/search/')) {
        const searchResultHandler = function searchResultHandler(index, a) {
            fetchSuportEmail(a.dataset.dsAppid, (email) => {
                $(a).after(`
                    <span class="steam_support_email--search">Support Email: ${email}</span>
                `);
            });
        };

        $('#search_result_container a[data-ds-appid]').each(searchResultHandler);

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                Array.from(mutation.addedNodes).forEach((addedNode) => {
                    const $addedNode = $(addedNode);

                    if ($addedNode.is('a[data-ds-appid]')) $addedNode.each(searchResultHandler);
                });
            });
        });

        observer.observe($('#search_result_container')[0], {
            childList: true,
            subtree: true,
        });
    }
});
