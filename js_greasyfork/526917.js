// ==UserScript==
// @name         Autodarts Lobbyfilter
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  A Improved Lobby Filter System for Autodart
// @author       stormax
// @match        https://play.autodarts.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=autodarts.io
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @license      MIT
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/526917/Autodarts%20Lobbyfilter.user.js
// @updateURL https://update.greasyfork.org/scripts/526917/Autodarts%20Lobbyfilter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        #gamemode, #avgmenu {
            min-width: 160px;
            padding: 8px;
            border-radius: 6px;
            border: none;
            background-color: #2d4584;
            color: white;
            font-size: 14px;
            outline: none;
            cursor: pointer;
        }
        #gamemode option, #avgmenu option {
            background-color: #2d4584;
            color: white;
        }
        .tm_menu_container {
            display: flex;
            gap: 15px;
            margin-bottom: 10px;
        }
        .tm_menu_label {
            font-weight: bold;
            margin-right: 5px;
            color: white;
        }
        .hide { display: none !important; }
    `);

    let gamemode = 'All';
    let minavg = 'All';

    function updateLobbies() {
        $(".hide").removeClass("hide"); // Erst alle anzeigen

        $('.chakra-card').each(function() {
            let avg = parseInt($(this).find(".chakra-badge").eq(0).text().slice(0, -1)) || 0;
            let hasGameMode = $(this).html().includes(gamemode) || gamemode === 'All';
            let matchesAvg = minavg === 'All' || avg === parseInt(minavg);

            if (!hasGameMode || !matchesAvg) {
                $(this).addClass('hide');
            }
        });
    }

    setInterval(() => {
        if (window.location.href.includes("lobbies") && !window.location.href.includes("lobbies/")) {
            updateLobbies();
        }

        if (!$("#gamemode").length && window.location.href.includes("lobbies") && !window.location.href.includes("lobbies/new/")) {
            $(".chakra-heading").after(`
                <div class="tm_menu_container">
                    <div>
                        <span class="tm_menu_label">Gametype:</span>
                        <select id="gamemode">
                            <option value="All">All</option>
                            <option value="501">501</option>
                            <option value="301">301</option>
                            <option value="CountUp">CountUp</option>
                            <option value="Cricket">Cricket</option>
                            <option value="Random Checkout">Random Checkout</option>
                        </select>
                    </div>
                    <div>
                        <span class="tm_menu_label">Minimum AVG:</span>
                        <select id="avgmenu">
                            <option value="All">All</option>
                            <option value="20">20</option>
                            <option value="25">25</option>
                            <option value="30">30</option>
                            <option value="35">35</option>
                            <option value="40">40</option>
                            <option value="45">45</option>
                            <option value="50">50</option>
                            <option value="55">55</option>
                            <option value="60">60</option>
                            <option value="65">65</option>
                            <option value="70">70</option>
                        </select>
                    </div>
                </div>
            `);
        }
    }, 1000);

    $(document).on('change', '#gamemode', function() {
        gamemode = $(this).val();
        updateLobbies();
        console.log('Gamemode:', gamemode);
    });

    $(document).on('change', '#avgmenu', function() {
        minavg = $(this).val();
        updateLobbies();
        console.log('min-avg:', minavg);
    });
})();
