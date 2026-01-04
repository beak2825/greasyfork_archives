// ==UserScript==
// @name         Stream Legends Clicker
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Automatically click through fights and delete non raid rewards.
// @author       tehAon
// @match        *://streamlegends.com/*
// @require      https://code.jquery.com/jquery-2.2.4.min.js
// @grant           GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/33820/Stream%20Legends%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/33820/Stream%20Legends%20Clicker.meta.js
// ==/UserScript==

(function() {
    window.running = false;
    var raidXp = 0;
    var raidStartTime = new Date();

    $('body').on('DOMSubtreeModified', '.srpg-content', function() {
        if (window.running === false && $('#srpg-nav-tab-FIGHT').hasClass('nav-selected')) {
            //console.log('AutoFight');
            window.running = true;
            setTimeout(function() {
                AutoFight();
            }, 100);
        }
    });

    $('body').on('click', 'a[title="SELL..."]', function() {
        setTimeout(function() {
            var backpackItems = $('.backpack-item');
            $.each(backpackItems, function(k, backpackItem) {
                if ($(backpackItem).attr('class').indexOf('_tier_4') == -1) {
                    $(backpackItem).trigger('click');
                }
            });
        }, 1000);
    });

    function StartBot() {
        window.timer = setTimeout(function() {
            AutoFight();
        }, 25);
    }

    function StopBot() {
        clearInterval(window.timer);
    }

    function AutoFight() {
        var raidStats = $('.player-contributions .contribution-entry');
        var expiredBtn = $('.srpg-map-actions-expired-button .btn');
        var joinRaidBtn = $('.srpg-map-actions-raid-button .btn');
        var fightBtn = $('.srpg-map-actions-fight-buttons .btn');
        var firstFight = $('.srpg-map-nodes .node-available').first();
        var fightOverBtn = $('.post-fight-button');
        var backToMapBtn = $('.srpg-button-maps.btn');
        var collectRewardBtn = $('.srpg-button-continue');
        var deleteRewardBtn = $('.srpg-button-trash');
        var confirmBtn = $('.ConfirmPopover .btn').first();
        var error = $('.StreamRpgError');
        var rewards = $('.reward-entry');

        var mapList = $('.srpg-map-list');

        if (mapList.is(':visible')) {
            var nodeToClick = $('.srpg-map-list-node').first();
            nodeToClick.click();
        }

        if (error.is(':visible')) {
            error.find('button').click();
        }

        if (raidStats.is(':visible')) {
            var statsStr = raidStats.text();
            var stats = statsStr.match(/(\d+).(\D+)(\d+)/);
            raidXp += 65;
            console.log((Math.round(raidXp / (new Date() - raidStartTime) * 1000 * 60 * 60)) + " XP/Hour");
            //console.log(stats);
        }

        if (expiredBtn.is(':visible')) {
            expiredBtn.click();
        }
        if (joinRaidBtn.is(':visible')) {
            raidXp = 0;
            raidStartTime = new Date();
            joinRaidBtn.click();
        }
        if (true || fightBtn.is(':visible')) {
            firstFight.click();
            fightBtn.click();
        }
        if (fightOverBtn.is(':visible')) {
            fightOverBtn.click();
        }
        if (backToMapBtn.is(':visible')) {
            backToMapBtn.click();
        }

        if (rewards.is(':visible')) {
            if (!rewards.hasClass('raid') && deleteRewardBtn.is(':visible')) {
                window.itemReadyToDelete = true;
                deleteRewardBtn.click();
                confirmBtn = $('.ConfirmPopover .btn').first();
                confirmBtn.click();
            }
            else {
                collectRewardBtn.click();
            }

            if (rewards.hasClass('raid'))
            {
                console.log('Collect Raid Reward');
                window.itemReadyToDelete = false;
            }

            if (window.itemReadyToDelete && confirmBtn.is(':visible')) {
                confirmBtn.click();
                window.itemReadyToDelete = false;
            }
        }

        window.running = false;
        $('.srpg-content').trigger('DOMSubtreeModified');
    }
})();