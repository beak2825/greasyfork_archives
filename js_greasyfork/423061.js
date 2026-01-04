// ==UserScript==
// @name         Firebase authentication console - Remove all users on page
// @namespace    1N07
// @version      0.1
// @description  Automates removing all users (one page) in the Firebase authentication console
// @author       1N07
// @match        https://console.firebase.google.com/project/*/authentication/users
// @icon         https://i.imgur.com/w8CLVkE.png
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423061/Firebase%20authentication%20console%20-%20Remove%20all%20users%20on%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/423061/Firebase%20authentication%20console%20-%20Remove%20all%20users%20on%20page.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(function(){

        let interval = setInterval(() => {
            const place = $("user-search-bar > .search-bar-actions");
            if(place.length)
            {
                place.append(`<button class="mat-focus-indicator mat-raised-button mat-button-base mat-primary" style="background-color: red;" id="delete-all-users">DELETE ALL</button>`);
                $("#delete-all-users").click(function(){
                    if(confirm("Are you sure you want to delete all users?"))
                    {
                        $(".auth-user-table edit-account-menu").each(function(index){
                            let x = $(this);
                            setTimeout(function(){
                                x.find("button").click();
                                setTimeout(function(){$(".mat-menu-panel:visible button.mat-menu-item:contains('Delete account')").click();}, 50);
                                setTimeout(function(){$("authentication-edit-account-dialog button.confirm-button").click();}, 100);
                                setTimeout(function(){$(".users-page-content").click();}, 150);
                            }, 300*index);
                        });
                    }
                });
                clearInterval(interval);
            }
        }, 200);
    });
})();