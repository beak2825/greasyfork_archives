// ==UserScript==
// @name         Show Usernames in Fiverr Buyer Requests
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  This script will help to show usernames in Buyer Requests page on Fiverr.com
// @author       MS-Jahan
// @match        *://*.fiverr.com/users/*/requests*
// @icon         https://www.google.com/s2/favicons?domain=fiverr.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/450864/Show%20Usernames%20in%20Fiverr%20Buyer%20Requests.user.js
// @updateURL https://update.greasyfork.org/scripts/450864/Show%20Usernames%20in%20Fiverr%20Buyer%20Requests.meta.js
// ==/UserScript==

function main_task(){
    // console.log("main_task() started");
    var main_table = document.getElementsByTagName("tbody")[0];
    var all_trs = main_table.getElementsByTagName("tr");
    var all_see_more_btn = document.getElementsByClassName("btn-see-more");
    // click on all see more buttons
    for(var i=0; i<all_see_more_btn.length; i++){
        all_see_more_btn[i].click();
    }

    for(var i = all_trs.length; i >= 1; i--){
        // console.log("main_task() loop started, i = " + i);
        var selector = "tr:nth-child(" + i + ") > td:nth-child(3) > a.fbr_name_tag";
        
        if(main_table.querySelector(selector) == null){
            var username = "";
            try{
                selector = "tr:nth-child(" + i + ") > td:nth-child(6) > div > a"
                var userdata = JSON.parse(main_table.querySelector(selector).getAttribute("data-meta"));
                username = userdata.username;
            }
            catch(e){
                try{
                    // console.log("main_task() error: " + e);
                    username = main_table.querySelector("tr:nth-child(" + i + ") > td:nth-child(2) > span > img").getAttribute("alt");
                }
                catch(e){
                    console.log("main_task() error: " + e);
                    continue;
                }
            }
            
            var user_url = "https://www.fiverr.com/" + username;
            var user_link_tag = "<a href='" + user_url + "' class='fbr_name_tag' target='_blank' style='font-weight:bold;'>" + username + "</a><br>";
            var main_html = main_table.querySelector("tr:nth-child(" + i + ") > td:nth-child(3)").innerHTML;
            main_html = user_link_tag + main_html;
            main_table.querySelector("tr:nth-child(" + i + ") > td:nth-child(3)").innerHTML = main_html;
        }
        else{
            break;
        }
    }
}

setInterval(main_task, 2000);