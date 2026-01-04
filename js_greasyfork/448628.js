// ==UserScript==
// @name         MyAnonamouse Forum Gifter
// @version      0.4
// @description  Add 1000 gift button next to name on forum topics list
// @author       Guillermo
// @match        https://www.myanonamouse.net/f*
// @icon         https://cdn.myanonamouse.net/favicon.ico
// @grant        none
// @license      MIT
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/448628/MyAnonamouse%20Forum%20Gifter.user.js
// @updateURL https://update.greasyfork.org/scripts/448628/MyAnonamouse%20Forum%20Gifter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // New CSS
    var css = `
    /* Specify styles */
    span.gift-button {
        cursor: pointer;
    }
    span.gift-button::before {
        content: "🎁";
        margin-left: 0.5em;
        
    }
    span.gift-button.loading-gift::before {
        content: "⌛";    
    }
    span.gift-button:hover {
        text-decoration: underline;
    }

    
    `;
    var style = document.createElement('style');
    style.innerHTML = css;
    document.head.appendChild(style);

    // GIFT LOGIC
    const GIFT_AMOUNT = 1000;

    function send_gift(user_id){
        // Make a new XMLHttpRequest
        var xhr = new XMLHttpRequest();
        // get timestamp
        var timestamp = new Date().getTime();
        // Set the request method to GET
        xhr.open("GET",
        "https://www.myanonamouse.net/json/bonusBuy.php/"+timestamp+"?spendtype=gift&amount="+GIFT_AMOUNT+"&timestamp="+timestamp+"&giftTo="+user_id,
        true);
        // Set the request header to application/json
        xhr.setRequestHeader("Content-Type", "application/json");

        // Promise to return
        var promise = new Promise((resolve, reject)=>{
            // Handle the response
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4 && xhr.status == 200 ) {
                    // parse response text
                    var response = JSON.parse(xhr.responseText);
                    // check if response is ok
                    if(response.success == true){
                        resolve(response);
                        return;
                    }
                    // reject promise
                    reject(response);
                }
            }
        });
        // Send the request
        xhr.send();
        return promise;
    }

    const IDS_KEY = "gifted_ids";
    function get_user_count_localstorage(user_id){
        var ids = localStorage.getItem(IDS_KEY);
        if(ids == null){
            return 0;
        }
        ids = JSON.parse(ids);
        var user_id_count = ids[user_id];
        if(user_id_count == null){
            return 0;
        }
        return user_id_count;
    }

    function increase_user_count_localstorage(user_id){
        var ids = localStorage.getItem(IDS_KEY);
        if(ids == null){
            ids = {};
        }
        else{
            ids = JSON.parse(ids);
        }
        if(ids[user_id] == null){
            ids[user_id] = 0;
        }
        ids[user_id]++;
        localStorage.setItem(IDS_KEY, JSON.stringify(ids));
    }

    function format_user_count_innerText(user_id){
        return "(" + get_user_count_localstorage(user_id)*GIFT_AMOUNT + ")"
    }

    function update_bonus(ammount){
        var bonus = document.getElementById("tmBP");
        bonus.innerText = "Bonus: " + ammount.toFixed();
    }
    // Select every 5th td in the table
    var td_list = document.querySelectorAll('table.forumViewTable td:nth-child(5)');
    // Loop through the list of td's
    for (var i = 0; i < td_list.length; i++) {
        // Get the current td
        var td = td_list[i];
        // Get the current link
        var link = td.querySelector('a');
        // Get the current href ("/u/userid")
        var href = link.getAttribute('href');
        // Get the user id
        var user_id = href.substring(3);
        // Create new button
        var new_button = document.createElement('span');
        // Add css class
        new_button.className = "gift-button";
        // Set the text
        new_button.innerText = format_user_count_innerText(user_id);
        new_button.setAttribute('user_id', user_id);
        // Set the onclick function
        new_button.onclick = function(){
            // add class loading-gift
            this.className = this.className + " loading-gift";          
            var this_user_id = this.getAttribute('user_id');

            send_gift(this_user_id)
                .then((response)=>{
                    // Increase counter on local storage ids dictionary
                    increase_user_count_localstorage(this_user_id);
                    // Update the button text
                    this.innerText = format_user_count_innerText(this_user_id);
                    // remove class loading-gift
                    this.className = this.className.replaceAll("loading-gift", "");
                    // Update current bonus
                    var bonus = response.seedbonus;
                    update_bonus(bonus);
                })
                .catch((response)=>{
                    console.log(response);
                });
        }
        // Add next to the current alink
        td.appendChild(new_button);
    }
})();