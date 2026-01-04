// ==UserScript==
// @name         "Free" Roblox Items
// @version      2025-5-30
// @description  Trick your friends into thinking you can get anything for free!
// @author       Agent Sam
// @match        https://www.roblox.com/bundles/*
// @match        https://www.roblox.com/catalog/*
// @match        https://www.roblox.com/users/*
// @match        https://www.roblox.com/games/*
// @match        https://web.roblox.com/bundles/*
// @match        https://web.roblox.com/catalog/*
// @match        https://web.roblox.com/users/*
// @match        https://web.roblox.com/games/*
// @grant        none
// @license      GNU GPLv2
// @run-at       document-body
// @namespace https://greasyfork.org/users/1476253
// @downloadURL https://update.greasyfork.org/scripts/537605/%22Free%22%20Roblox%20Items.user.js
// @updateURL https://update.greasyfork.org/scripts/537605/%22Free%22%20Roblox%20Items.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener("DOMContentLoaded", () => {
        const urlParams = new URLSearchParams(window.location.search);
        const scriptSkip = urlParams.get('1');

        if (scriptSkip) return;
        if (location.pathname.includes('bundles') || location.pathname.includes('catalog')) {
            const loop = setInterval(() => {
                if (document.querySelector('[class="price-row-container"]')) clearInterval(loop);
                document.querySelector('[class="price-row-container"]').innerHTML = '<div class="price-container-text"><div class="item-first-line">This item is available in your inventory.</div></div><a id="edit-avatar-button" href="/my/avatar" class="btn-control-md"><span class="icon-nav-charactercustomizer"></span></a>';
                document.querySelector('[class="item-details-creator-container"]').innerHTML += '<span class="item-owned"><div class="label-checkmark"><span class="icon-checkmark-white-bold"></span></div><span>Item Owned</span></span>';
                setTimeout(() => {
                    document.querySelector('[class="rbx-popover-content"]').innerHTML = `
                        <ul class="dropdown-menu" role="menu">
                                    <li>
                                        <button class="toggle-profile" role="button" data-toggle="False">
                                            Add to Profile
                                        </button>
                                    </li>
                                    <li>
                                        <a id="report-item" class="abuse-report-modal" href="https://www.roblox.com/abusereport/asset?id=9941658066&amp;RedirectUrl=%2fcatalog%2f9941658066%2fCalico-Cat-Pet-Cute-Chibi">
                                            Report Item
                                        </a>
                                    </li>
                        </ul>
                `;
                }, 200);

                const spin = document.createElement('div');
                spin.setAttribute('class', 'font-header-1 text-subheader text-label text-overflow field-label');
                spin.innerHTML = '<i>Modded by <br>Spin</i>';
                document.getElementById('item-details').appendChild(spin);
            }, 50);
        }
    });

    // needs to be improved
    //if (window.location.href.includes('games')) {
    //    let hasRun = false;
    //    document.getElementById('tab-store').addEventListener('click', function() {
    //        if (hasRun === false) {
    //            setTimeout(function() {
    //                for (var x = 0; x < 999; x++) {
    //                    document.getElementsByClassName('PurchaseButton')[x].setAttribute('data-expected-price', '0');
    //                    document.getElementsByClassName('PurchaseButton')[x].setAttribute('data-button-action', 'get');
    //                    document.getElementsByClassName('PurchaseButton')[x].removeAttribute('data-se');
    //                    console.log(`set prices - ${x}`);
    //                }
    //            }, 600);
    //            hasRun = true;
    //        }
    //    });
    //
    //    document.getElementById('confirm-btn').addEventListener('click', function() {
    //        var click = setInterval(function() {
    //            document.getElementById('simplemodal-overlay').addEventListener('click', function() { clearInterval(click); });
    //            document.getElementById('simplemodal-overlay').click();
    //            console.log('hi');
    //            sessionStorage.setItem(window.location.href, 'itemOwned');
    //        }, 100);
    //        setItemStatus();
    //    });
    //}
})();