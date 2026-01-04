// ==UserScript==
// @name         "Free" Roblox Items
// @namespace    https://spin.rip
// @version      2024-6-29
// @description  Trick your friends into thinking you can get anything for free!
// @author       Spinfal
// @match        https://www.roblox.com/bundles/*
// @match        https://www.roblox.com/game-pass/*
// @match        https://www.roblox.com/catalog/*
// @match        https://www.roblox.com/users/*
// @match        https://www.roblox.com/games/*
// @match        https://web.roblox.com/bundles/*
// @match        https://web.roblox.com/game-pass/*
// @match        https://web.roblox.com/catalog/*
// @match        https://web.roblox.com/users/*
// @match        https://web.roblox.com/games/*
// @grant        none
// @license      GNU GPLv2
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/521884/%22Free%22%20Roblox%20Items.user.js
// @updateURL https://update.greasyfork.org/scripts/521884/%22Free%22%20Roblox%20Items.meta.js
// ==/UserScript==

(function() {
    document.addEventListener("DOMContentLoaded", () => {
        const urlParams = new URLSearchParams(window.location.search);
        console.log(urlParams);
        const scriptSkip = urlParams.get('1');

        console.log('not scriptSkip')
        if (location.pathname.includes('bundles') || location.pathname.includes('catalog')) {
            console.log('confirmed')
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

            }, 50);
        }
        else if (location.pathname.includes('game-pass')) {
            console.log('confirmed')
            document.querySelector("#item-container > div.section-content.top-section.remove-panel > div.border-bottom.item-name-container > div").innerHTML += '<span class="item-owned"><div class="label-checkmark"><span class="icon-checkmark-white-bold"></span></div><span>Item Owned</span></span>';
            const loop = setInterval(() => {
                if (document.querySelector('[class="price-row-container"]')) clearInterval(loop);
                document.querySelector("#item-details > div.clearfix.price-container").innerHTML = '<div class="price-container-text"><div class="item-first-line">This item is available in your inventory.</div></div><a id="inventory-button" href="https://www.roblox.com/users/970040772/inventory" class="btn-fixed-width-lg btn-control-md" data-button-action="inventory">Inventory</a>';
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

            }, 50);
        }
    });

    // needs to be improved
    //if (window.location.href.includes('games')) {
    //    let hasRun = false;
    //    document.getElementById('tab-store').addEventListener('click', function() {
    //        if (hasRun === false) {
    //            var spincred = document.createElement('p');
    //            spincred.innerHTML = '<i>Modded by Spin</i>';
    //            document.getElementsByClassName('col-xs-12')[2].append(spincred);
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