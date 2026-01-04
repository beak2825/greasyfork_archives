// ==UserScript==
// @name        Clear All LinkedIn Notifications
// @description Clears all your LinkedIn Notifications so you can have a clean slate!
// @match       https://www.linkedin.com/notifications/
// @license MIT
// @version 0.0.1.20220623163210
// @namespace https://greasyfork.org/users/928592
// @downloadURL https://update.greasyfork.org/scripts/446922/Clear%20All%20LinkedIn%20Notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/446922/Clear%20All%20LinkedIn%20Notifications.meta.js
// ==/UserScript==

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function init(){
    var notification_area = document.querySelector("#main > div > div > div > div > section");
    var buttons = notification_area.querySelectorAll("button[aria-label=\"Settings menu\"]");
    if (buttons.length != 0) { /* do something with counter element */
        for (let element of buttons) {
            var element_id = element.id;
            
            element.click();
            
            await sleep(500);
            
            var delete_button_div = element.nextElementSibling;
            
           delete_button_div.querySelector("button").click();
        }
        
        window.scrollTo(0, document.body.scrollHeight);
        
        await sleep(200);
        
        buttons = notification_area.querySelectorAll("button[aria-label=\"Settings menu\"]");
        
        if (buttons.length != 0) {
            init();
        } else {
            console.log("DONE!")
        }
    } else { 
        setTimeout(await init, 0);
    }
};

init();