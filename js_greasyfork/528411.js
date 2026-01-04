// ==UserScript==
// @name            Freebitcoin Auto Roll
// @description     Freebitcoin Auto Roll for Premium User
// @version         1.2.2
// @author          Antoine Simmons
// @match           https://freebitco.in/*
// @namespace       https://greasyfork.org/en/users/1441178-antoine-simmons
// @homepage        https://https://mail.google.com/mail/u/0/?ogbl&sw=2#inbox
// @homepageURL     https://freebitco.in/?r=54022807
// @copyright       Antoine Simmons - 2025
// @require         http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @license         GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/528411/Freebitcoin%20Auto%20Roll.user.js
// @updateURL https://update.greasyfork.org/scripts/528411/Freebitcoin%20Auto%20Roll.meta.js
// ==/UserScript==
 
/*
// Changelog
All notable changes to this script will be written here.
 
## [1.2.2] - 2024-01-23
### Added
- Added a check for reward.points between 45000 and 55000 to redeem different products
- Added Free WOF and FP Bonus to redeem RPProduct on certain point condition
- Used setInterval to run the checkRewardPoints function every second
- Moved the checkRewardPoints and runCheckRewardPoints functions outside the reward object
### Fixed
- Rewrote the logic of redeeming points
- Changed the RedeemRPProduct function
- Changed the @description for UserScript
- Removed the unnecessary console.log statements
- Removed the unnecessary long description inside the script
- Fixed spelling
 
## [1.2.1] - 2024-01-19
### Added
- Changelog information
- Fix the description
- Decrease the amount of RP neede to claim bonus
### Fixed
- Bonus claim is working now
- Nothing so far. Please let me know if there's a bug or error while using this script
 
## [1.0.0] - 2024-01-11
- Initial release of the script
*/
 
(function() {
    'use strict';
var body = $('body');
var points = {};
var count_min = 1;
var reward = {};
    reward.select = function() {
        reward.points = parseInt($('.user_reward_points').text().replace(',',""));
        reward.bonustime = {};
        if ($("#bonus_container_free_points").length != 0) {
            reward.bonustime.text = $('#bonus_span_free_points').text();
            reward.bonustime.hour = parseInt(reward.bonustime.text.split(":")[0]);
            reward.bonustime.min = parseInt(reward.bonustime.text.split(":")[1]);
            reward.bonustime.sec = parseInt(reward.bonustime.text.split(":")[2]);
            reward.bonustime.current = reward.bonustime.hour * 3600 + reward.bonustime.min * 60 + reward.bonustime.sec;
        } else
            reward.bonustime.current = 0;
        console.log(reward.bonustime.current);
        if (reward.bonustime.current !== 0) {
            console.log(reward.bonustime.current);
        } else {
            if (reward.points < 45000) {
                console.log("waiting for points to reach 50000");
            }
            else if (reward.points >= 50000 && reward.points < 51000) {
                    console.log("redeeming fun_token_2");
                    RedeemRPProduct('fun_token_2');
                }
            else if (reward.points >= 51000 && reward.points < 52000) {
                    console.log("redeeming fun_token_3");
                    RedeemRPProduct('fun_token_3');
                }
            else if (reward.points >= 52000 && reward.points < 53000) {
                    console.log("redeeming fun_token_4");
                    RedeemRPProduct('fun_token_4');
                }
            else if (reward.points >= 53000 && reward.points < 54000) {
                    console.log("redeeming fun_token_5");
                    RedeemRPProduct('fun_token_5');
                }
            else if (reward.points >= 54000 && reward.points < 55000) {
                    console.log("redeeming fp_bonus_1000");
                    RedeemRPProduct('fp_bonus_1000');
                }
            else {
                console.log("redeeming free_wof_5");
                RedeemRPProduct('free_wof_5');
            }
            if ($('#bonus_span_fp_bonus').length === 0)
                if (reward.points >= 55000)
                    RedeemRPProduct('fp_bonus_1000');
        }
    };
    body.prepend(
        $('<div/>').attr('style',"position:fixed;top:45px;left:0;z-index:999;width:350px;background-color:black;color: white; text-align: left;")
            .append(
                $('<div/>').attr('id','autofaucet')
                    .append($('<p/>').attr('style','text-decoration:underline;').text("Freebitcoin Auto Roll"))
                    .append($('<p/>').text("Freebitcoin Auto Roll for Premium User"))
                    .append($('<p/>').text("1Q2MmeCyRjoHhGmBNRwiYBY4ZBQ4cmyJyw"))
                    .append($('<p/>').text("(Click to copy and donate some satoshi for me!)"))
                    .append($('<p/>')
                    )
            ).click(function(){
            var $temp = $('<input>').val("1Q2MmeCyRjoHhGmBNRwiYBY4ZBQ4cmyJyw");
            body.append($temp);
            $temp.select();
            document.execCommand("copy");
            $temp.remove();
        })
    ).prepend($('<style/>')
        .text("#autofaucet p { margin: 0; margin-left: 2px;  text-align: left; }")
)
    setTimeout(reward.select,1000);
    setInterval(reward.select,60000);
$(document).ready(function(){
    console.log("Status: Page loaded.");
    setTimeout(function(){
        $('#free_play_form_button').click();
        console.log("Status: Button ROLL clicked.");
    }, random(2000,4000));
    setInterval(function(){
        console.log("Status: Elapsed time " + count_min + " minutes");
        count_min = count_min + 1;
    }, 60000);
    setTimeout(function(){
        $('.close-reveal-modal')[0].click();
        console.log("Status: Button CLOSE POPUP clicked.");
    }, random(12000,18000));
    setInterval(function(){
        $('#free_play_form_button').click();
        console.log("Status: Button ROLL clicked again.");
    }, random(3605000,3615000));
});
function random(min,max){
   return min + (max - min) * Math.random();
}
})();