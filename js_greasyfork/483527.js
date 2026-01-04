// ==UserScript==
// @name         Set qBittorrent Queue order
// @namespace    http://tampermonkey.net/
// @version      v0.3
// @description  Set torrents queue order by sort on column attribute in qBittorrent.
// @author       me
// @match        http://localhost:8080/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.localhost
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483527/Set%20qBittorrent%20Queue%20order.user.js
// @updateURL https://update.greasyfork.org/scripts/483527/Set%20qBittorrent%20Queue%20order.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a button element
    var button = document.createElement("button");

    // Set button attributes and styles
    button.innerHTML = "<b>Set Queue Order</b> <br /> As your current ordered table";
    button.style.position = "fixed";
    button.style.width = "250px";
    button.style.right = "10px"; // Adjust the number of pixels from the right
    button.style.top = "20%"; // Vertical alignment in the middle
    button.style.transform = "translateY(-50%)";
    button.style.border = "2px solid red";
    button.style.backgroundColor = "orange";
    button.style.padding = "30px";
    button.style.cursor = "pointer";

    // Add click event listener
    button.addEventListener("click", sortTable);

    // Append the button to the body
    document.body.appendChild(button);


    // Function to sort the queue order by the current sorted table. Be aware that the sorting uses the bottom of the queue, so if let's say you have 100 torrents in multiple categories, and you want to sort just e.g. 40 torrents in a category
    // their queue order will be 41, 42, 43, ..., 100, if you want to move them at the top of the queue just select all of them and click the "Move to the top of the queue" Button  in the Qbittorrent top toolbar.
    function sortTable(){
        // creates  a sorting status div element
        var sortingNotification = document.createElement("div");
        sortingNotification.innerHTML = "<b>Setting queue order... [0]</b>";
        sortingNotification.style.position = "fixed";
        sortingNotification.style.width = "250px";
        sortingNotification.style.right = "10px"; // Adjust the number of pixels from the right
        sortingNotification.style.top = "26%"; // Vertical alignment in the middle
        sortingNotification.style.color = "black";
        sortingNotification.style.backgroundColor = "yellow";
        sortingNotification.style.padding = "20px 0 20px 0";
        sortingNotification.style.textAlign = "center";

        // Append status div to the body
        document.body.appendChild(sortingNotification);
        // Gets current table rows
        var tableRows = document.querySelectorAll("#torrentsTableDiv > table > tbody > tr");
        // Loops over each row
        tableRows.forEach(function(row, index, array){
            // Qbittorrent move to bottom of queue button
            const orderButton = document.querySelector("#bottomPrioButton");

            setTimeout(function(){
                sortingNotification.innerHTML = "<b>Setting queue order... [" + (array.length - index) + "]</b>";
                row.click();
                orderButton.click();

                if(index === array.length - 1){
                sortingNotification.innerHTML = "<b>DONE!</b>";
                sortingNotification.style.backgroundColor = "lime";
            }

            },index * 300);


        });
    }
})();