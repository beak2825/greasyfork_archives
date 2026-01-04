// ==UserScript==
// @name         Lizaonair
// @version      0.3
// @match        https://lizaonair.com/giveaway/*
// @description  Predictable winner generation for https://lizaonair.com/giveaway/
// @author       Kaimi
// @homepage     https://kaimi.io/2016/01/tampering-vk-contest-results/
// @namespace    https://greasyfork.org/users/228137
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/438204/Lizaonair.user.js
// @updateURL https://update.greasyfork.org/scripts/438204/Lizaonair.meta.js
// ==/UserScript==

// Instagram winner username (probably will also work for VK, YouTube)
// Winner should fit contest criteria (e.g. could be the possible winner)

var winner_username = 'kaimi_ru';


var p_pick_random_item = pick_random_item;

pick_random_item = function(original_array, show_stats)
{
    var winner_id = 0;
    var winner_obj = null;

    if(original_array[0].hasOwnProperty('text'))
    {
        console.log("Picking from 'comments'");

        original_array.some
        (
            function(obj)
            {
                if(obj.hasOwnProperty('owner') && obj.owner.username == winner_username)
                {
                    winner_obj = obj;
                    return true;
                }

                return false;
            }
        );

        original_array = original_array.map(obj => winner_obj);
    }
    else
    {
        console.log("Picking from 'likes'");

        OPTIONS.users.some
        (
            function(obj)
            {
                if
                (
                    (obj.hasOwnProperty('u') && obj.u == winner_username)
                    ||
                    (obj.hasOwnProperty('name') && obj.name == winner_username)
                )
                {
                    winner_id = obj.id;
                    return true;
                }

                return false;
            }
        );

        if(winner_id)
        {
            original_array.forEach
            (
                function(obj)
                {
                    obj.id = winner_id;
                }
            );
        }
    }

    return p_pick_random_item(original_array, show_stats);
}
