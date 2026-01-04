// ==UserScript==
// @name         1Password 1-click archive & delete
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Adds a 1-Click Delete & Archive Buttons for entries
// @namespace    https://greasyfork.org/en/users/807108-jeremy-r
// @author       JRem
// @match        https://*.1password.com/vaults/*/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=1password.com
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require      https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457420/1Password%201-click%20archive%20%20delete.user.js
// @updateURL https://update.greasyfork.org/scripts/457420/1Password%201-click%20archive%20%20delete.meta.js
// ==/UserScript==

(function() {
    // Customizable timeout for re-adding buttons after use
    const timeout = "1500";
    // Wait for the buttons to be visible before starting
    waitForKeyElements (
        "#item-details",
        addBtn
    );
    waitForKeyElements (
        "#top-bar-notifications",
        topBtn
    );
    // CSS Style to put both of the new buttons on the same line
    var css = '.clickarchive {margin-left:3px!important;}';
        css += 'div#divdelarc {display: inline-flex !important;margin-left: 0px !important;align-content: center !important;}';
        css += '#topdiv {display: inline-flex !important;}';
    GM_addStyle(css);

    function topBtn() {
        var tdparent = document.querySelector('div[id="title-container"]');
        var topdiv = document.createElement("div");
            topdiv.id = "topdiv";

        tdparent.appendChild(topdiv);

        var topbtn = document.createElement("button");
            topbtn.innerHTML = "Add Buttons";
            topbtn.className= "item-detail-button clickadd";
            topbtn.id= "clickadd";
            topbtn.style.background = "red";
            topbtn.onclick= function(){
                addBtn();
            }
        var div1=document.querySelector('div[id="topdiv"]');
        div1.appendChild(topbtn);
    }

    // Function to add buttons
    function addBtn() {
        // Define Delete Button
        var delbtn = document.createElement("button");
        delbtn.innerHTML = "Delete";
        delbtn.className= "item-detail-button clickdelete";
        delbtn.id= "clickdelete";
        delbtn.style.background = "red";
        delbtn.onclick= function(){
            document.querySelector('button[data-testid="toolbar-edit"]').click();
            document.querySelector('button[data-testid="toolbar-delete"]').click();
            document.querySelector('button[id="submit"]').click();
            // When the buttons are used, the page gets reloaded, however since its using websocket it cant re-add the buttons without help
            // This just tells it to re-add the button 1.5 seconds after it has been clicked.
            // If the buttons are not visible after being used, increase the timeout var at the top
            setTimeout(function(){
                addBtn();
            }, timeout);
        }
        var div = document.querySelector('button[class="item-detail-button"]');

        // Define new DIV to put buttons in
        var newdiv = document.createElement("div");
            newdiv.id = "divdelarc";
        // Append DIV to page
        div.parentElement.appendChild(newdiv);
        // Add Delete button
        newdiv.appendChild(delbtn);

        // Define Archive button
        var archivebtn = document.createElement("button");
            archivebtn.innerHTML = "Archive";
            archivebtn.className= "item-detail-button clickarchive";
            archivebtn.id= "clickarchive";
            archivebtn.style.background = "red";
            archivebtn.onclick= function(){
                document.querySelector('button[data-testid="toolbar-edit"]').click();
                document.querySelector('button[data-testid="toolbar-archive"]').click();
                document.querySelector('button[id="archive-selected-item"]').click();
                // When the buttons are used, the page gets reloaded, however since its using websocket it cant re-add the buttons without help
                // This just tells it to re-add the button 1.5 seconds after it has been clicked.
                // If the buttons are not visible after being used, increase the timeout var at the top
                setTimeout(function(){
                    addBtn();
                }, timeout);
           }
        // Add Archive button to page
        newdiv.appendChild(archivebtn);
    }

})();