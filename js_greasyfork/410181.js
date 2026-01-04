// ==UserScript==
// @name       Steam que via keyboard.
// @namespace  https://github.com/Plaer1/SteamQueKeyboardShortcuts/
// @version    0.3
// @description  lets you navigate you steam queue via keybaord, specifically the arrow keys
// @match      https://store.steampowered.com/*
// @copyright  Gnu GPL V2
// @downloadURL https://update.greasyfork.org/scripts/410181/Steam%20que%20via%20keyboard.user.js
// @updateURL https://update.greasyfork.org/scripts/410181/Steam%20que%20via%20keyboard.meta.js
// ==/UserScript==

(function(){
document.addEventListener('keydown', function(e) {
    'use strict';
    switch (e.keyCode) {

        //left
        case 37:

            if(document.querySelector("#add_to_wishlist_area").style.display == "none") {
                document.querySelector("#add_to_wishlist_area_success > a > span").click();
            }

            else {
                document.querySelector("#add_to_wishlist_area > a > span").click();
            }

            break;

        //up
        case 38:

                if (document.querySelector("body > div.responsive_page_frame.with_header > div.responsive_page_content > div.responsive_page_template_content > div.game_page_background.game > div.page_content_ctn > div.block > div.queue_overflow_ctn > div > div > div.queue_control_button.queue_btn_follow > div.btnv6_blue_hoverfade.btn_medium.queue_btn_active").style.display == "none") {
                     // click to follow
                    document.querySelector("body > div.responsive_page_frame.with_header > div.responsive_page_content > div.responsive_page_template_content > div.game_page_background.game > div.page_content_ctn > div.block > div.queue_overflow_ctn > div > div > div.queue_control_button.queue_btn_follow > div.btnv6_blue_hoverfade.btn_medium.queue_btn_inactive").click();
                } else {
                    //Click to UNfollow
                    document.querySelector("body > div.responsive_page_frame.with_header > div.responsive_page_content > div.responsive_page_template_content > div.game_page_background.game > div.page_content_ctn > div.block > div.queue_overflow_ctn > div > div > div.queue_control_button.queue_btn_follow > div.btnv6_blue_hoverfade.btn_medium.queue_btn_active").click();
                }

            break;

        //right
        case 39:

            //if the que needs refreshed, refresh it bb
            if (document.querySelector("#refresh_queue_btn > span") != null) {
                if (document.querySelector("body > div.responsive_page_frame.with_header > div.responsive_page_content > div.responsive_page_template_content > div.page_header_ctn > div.page_content_ctn.discovery_queue_content_ctn > div > div.discovery_queue_apps > div.discover_queue_empty").style.display != "none") {
                    document.querySelector("#refresh_queue_btn").click();
                    window.setTimeout(location.reload(), 45678);
                    break;
                }
            }

            //if the que needs resumed, resume it bb
            if (document.querySelector("#discovery_queue_start_link") != null){
                console.log("logb");
                document.querySelector("#discovery_queue_start_link").click();
                break;
            }

            //if you aren't in the que, hop in bb.
            if (document.querySelector("body > div.responsive_page_frame.with_header > div.responsive_page_content > div.responsive_page_template_content > div.game_page_background.game > div.page_content_ctn > div.block > div.queue_overflow_ctn > div > div > a") != null){
                document.querySelector("body > div.responsive_page_frame.with_header > div.responsive_page_content > div.responsive_page_template_content > div.game_page_background.game > div.page_content_ctn > div.block > div.queue_overflow_ctn > div > div > a").click();
                break;
            }

            if (document.querySelector("body > div.responsive_page_frame.with_header > div.responsive_page_content > div.responsive_page_template_content > div.game_page_background.game > div.page_content_ctn > div.block > div.queue_overflow_ctn > div > div.queue_actions_ctn > div.next_in_queue_area > div.btn_next_in_queue.btn_next_in_queue_trigger") != null){

                document.querySelector("body > div.responsive_page_frame.with_header > div.responsive_page_content > div.responsive_page_template_content > div.game_page_background.game > div.page_content_ctn > div.block > div.queue_overflow_ctn > div > div.queue_actions_ctn > div.next_in_queue_area > div.btn_next_in_queue.btn_next_in_queue_trigger").click();
                break;
            }

            //if all else fails refresh the damn page
            location.reload();
            break;

        //down
        case 40:
            //if not in que & a game
            if (document.querySelector("body > div.responsive_page_frame.with_header > div.responsive_page_content > div.responsive_page_template_content > div.game_page_background.game > div.page_content_ctn > div.block > div.queue_overflow_ctn > div > div > a") != null && document.querySelector("#game_area_purchase > div.game_area_bubble.game_area_dlc_bubble") == null) {
                if (document.querySelector("body > div.responsive_page_frame.with_header > div.responsive_page_content > div.responsive_page_template_content > div.game_page_background.game > div.page_content_ctn > div.block > div.queue_overflow_ctn > div > div > div:nth-child(6) > div.queue_control_button.queue_btn_ignore > div.btnv6_blue_hoverfade.btn_medium.queue_btn_active").style.display == "none") {
                    document.querySelector("body > div.responsive_page_frame.with_header > div.responsive_page_content > div.responsive_page_template_content > div.game_page_background.game > div.page_content_ctn > div.block > div.queue_overflow_ctn > div > div > div:nth-child(6) > div.queue_control_button.queue_btn_ignore > div.btnv6_blue_hoverfade.btn_medium.queue_btn_inactive").click();
                }
                else {
                    document.querySelector("body > div.responsive_page_frame.with_header > div.responsive_page_content > div.responsive_page_template_content > div.game_page_background.game > div.page_content_ctn > div.block > div.queue_overflow_ctn > div > div > div:nth-child(6) > div.queue_control_button.queue_btn_ignore > div.btnv6_blue_hoverfade.btn_medium.queue_btn_active").click();
                }
            }
            //if not in a que & dlc
            if (document.querySelector("body > div.responsive_page_frame.with_header > div.responsive_page_content > div.responsive_page_template_content > div.game_page_background.game > div.page_content_ctn > div.block > div.queue_overflow_ctn > div > div > a") != null) {
                if (document.querySelector("body > div.responsive_page_frame.with_header > div.responsive_page_content > div.responsive_page_template_content > div.game_page_background.game > div.page_content_ctn > div.block > div.queue_overflow_ctn > div > div > div:nth-child(5) > div.queue_control_button.queue_btn_ignore > div.btnv6_blue_hoverfade.btn_medium.queue_btn_active").style.display == "none") {
                    document.querySelector("body > div.responsive_page_frame.with_header > div.responsive_page_content > div.responsive_page_template_content > div.game_page_background.game > div.page_content_ctn > div.block > div.queue_overflow_ctn > div > div > div:nth-child(5) > div.queue_control_button.queue_btn_ignore > div.btnv6_blue_hoverfade.btn_medium.queue_btn_inactive").click();
                }
                else {
                    document.querySelector("body > div.responsive_page_frame.with_header > div.responsive_page_content > div.responsive_page_template_content > div.game_page_background.game > div.page_content_ctn > div.block > div.queue_overflow_ctn > div > div > div:nth-child(5) > div.queue_control_button.queue_btn_ignore > div.btnv6_blue_hoverfade.btn_medium.queue_btn_active").click();
                }
            }
            //if a game
            if (document.querySelector("body > div.responsive_page_frame.with_header > div.responsive_page_content > div.responsive_page_template_content > div.game_page_background.game > div.page_content_ctn > div.block > div.queue_overflow_ctn > div > div.queue_actions_ctn > div:nth-child(8) > div.queue_control_button.queue_btn_ignore") != null) {
                if (document.querySelector("body > div.responsive_page_frame.with_header > div.responsive_page_content > div.responsive_page_template_content > div.game_page_background.game > div.page_content_ctn > div.block > div.queue_overflow_ctn > div > div.queue_actions_ctn > div:nth-child(8) > div.queue_control_button.queue_btn_ignore > div.btnv6_blue_hoverfade.btn_medium.queue_btn_active").style.display == "none"){
                    document.querySelector("body > div.responsive_page_frame.with_header > div.responsive_page_content > div.responsive_page_template_content > div.game_page_background.game > div.page_content_ctn > div.block > div.queue_overflow_ctn > div > div.queue_actions_ctn > div:nth-child(8) > div.queue_control_button.queue_btn_ignore > div.btnv6_blue_hoverfade.btn_medium.queue_btn_inactive").click();
                }
                else {
                    document.querySelector("body > div.responsive_page_frame.with_header > div.responsive_page_content > div.responsive_page_template_content > div.game_page_background.game > div.page_content_ctn > div.block > div.queue_overflow_ctn > div > div.queue_actions_ctn > div:nth-child(8) > div.queue_control_button.queue_btn_ignore > div.btnv6_blue_hoverfade.btn_medium.queue_btn_active").click();
                }
            }
            //if DLC
            else {
                if (document.querySelector("body > div.responsive_page_frame.with_header > div.responsive_page_content > div.responsive_page_template_content > div.game_page_background.game > div.page_content_ctn > div.block > div.queue_overflow_ctn > div > div.queue_actions_ctn > div:nth-child(7) > div.queue_control_button.queue_btn_ignore > div.btnv6_blue_hoverfade.btn_medium.queue_btn_active").style.display == "none"){
                    document.querySelector("body > div.responsive_page_frame.with_header > div.responsive_page_content > div.responsive_page_template_content > div.game_page_background.game > div.page_content_ctn > div.block > div.queue_overflow_ctn > div > div.queue_actions_ctn > div:nth-child(7) > div.queue_control_button.queue_btn_ignore > div.btnv6_blue_hoverfade.btn_medium.queue_btn_inactive").click();
                }
                else {
                    document.querySelector("body > div.responsive_page_frame.with_header > div.responsive_page_content > div.responsive_page_template_content > div.game_page_background.game > div.page_content_ctn > div.block > div.queue_overflow_ctn > div > div.queue_actions_ctn > div:nth-child(7) > div.queue_control_button.queue_btn_ignore > div.btnv6_blue_hoverfade.btn_medium.queue_btn_active").click();
                }
            }
            break;

        default:
            //quit
            break;

    }
}, false);
})();