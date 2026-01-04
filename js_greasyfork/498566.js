// ==UserScript==
// @name         Neopets Inventory Overhauls
// @namespace    http://neopat.ch
// @license      GNU GPLv3
// @version      2.02
// @description  Adds quick stock features directly into the inventory screen, including on stacked items, and removes the forced refresh when performing actions on items.
// @author       You
// @match        https://www.neopets.com/inventory.phtml*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498566/Neopets%20Inventory%20Overhauls.user.js
// @updateURL https://update.greasyfork.org/scripts/498566/Neopets%20Inventory%20Overhauls.meta.js
// ==/UserScript==

(function() {

    // Function to check for grid items
    function checkForGridItems() {
        const gridItems = document.querySelectorAll('.grid-item');
        if (gridItems.length > 0) {

            //Check if inventory is in stacked mode or not
            var parentDiv = document.getElementById('invStack');
            var firstChildDiv = parentDiv.getElementsByClassName('stack-icon-container')[0];
            var isStacked = firstChildDiv.classList.contains('invfilter-active');
            if (isStacked) {
                //Stacked inventory
                var arrayindex = 1;
                for (let i = 0; i < gridItems.length; i++) {
                    // Find the first div with class 'item-img' inside the current grid-item
                    const itemImg = gridItems[i].querySelector('.item-img');

                    //Get Item name
                    const itemName = itemImg.getAttribute('data-itemname');


                    //Check radio input element count
                    if (gridItems[i].querySelector('input[type="radio"]')) {
                        radios = gridItems[i].querySelector('input[type="radio"]').length
                    } else {
                        radios = 0;
                    }
                    //Stop adding radios if already added
                    if (radios < window.itemsById[itemName].length) {
                        //Loop over unstacked item data by item name
                        for (let j = 0; j < window.itemsById[itemName].length; j++) {
                            dataObjId = window.itemsById[itemName][j];
                            //build first set of radio inputs
                            if (j < 1) {
                                document.getElementsByClassName('item-subname')[i].innerHTML += `<input type="hidden" name="id_arr[` + arrayindex + `]" value="` + dataObjId + `">
            <center>Quick Stock:<br>
            <img src=https://lel.wtf/shop.png width=15 height=15><input onclick="document.querySelectorAll('input[type=radio].` + itemName.replace(/\s+/g, '-') + `-stock').forEach(radio => radio.checked = true);" class="` + itemName.replace(/\s+/g, '-') + `-stock"  type="radio" name="radio_arr[` + arrayindex + `]" value="stock" ondblclick="this.checked = false; document.querySelectorAll('input[type=radio].` + itemName.replace(/\s+/g, '-') + `-stock').forEach(radio => radio.checked = false);">
            <img src=https://lel.wtf/sdb.png width=15 height=15><input onclick="document.querySelectorAll('input[type=radio].` + itemName.replace(/\s+/g, '-') + `-deposit').forEach(radio => radio.checked = true);" class="` + itemName.replace(/\s+/g, '-') + `-deposit" type="radio" name="radio_arr[` + arrayindex + `]" value="deposit" ondblclick="this.checked = false;  document.querySelectorAll('input[type=radio].` + itemName.replace(/\s+/g, '-') + `-deposit').forEach(radio => radio.checked = false);">
            <img src=https://lel.wtf/discard.png width=15 height=15><input onclick="document.querySelectorAll('input[type=radio].` + itemName.replace(/\s+/g, '-') + `-discard').forEach(radio => radio.checked = true);" class="` + itemName.replace(/\s+/g, '-') + `-discard" type="radio" name="radio_arr[` + arrayindex + `]" value="discard" ondblclick="this.checked = false; document.querySelectorAll('input[type=radio].` + itemName.replace(/\s+/g, '-') + `-discard').forEach(radio => radio.checked = false);">
            </center>`


                                ;

                            } else {
                                //build all other hidden radio inputs
                                document.getElementsByClassName('item-subname')[i].innerHTML += `<input type="hidden" name="id_arr[` + arrayindex + `]" value="` + dataObjId + `">

            <input style="display:none" class="` + itemName.replace(/\s+/g, '-') + `-stock" type="radio" name="radio_arr[` + arrayindex + `]" value="stock" ondblclick="this.checked = false; checkall[0].checked = false;">
            <input style="display:none" class="` + itemName.replace(/\s+/g, '-') + `-deposit" type="radio" name="radio_arr[` + arrayindex + `]" value="deposit" ondblclick="this.checked = false; checkall[0].checked = false;">
            <input style="display:none" class="` + itemName.replace(/\s+/g, '-') + `-discard" type="radio" name="radio_arr[` + arrayindex + `]" value="discard" ondblclick="this.checked = false; checkall[0].checked = false;">
           `;



                            }

                            arrayindex += 1;
                        }
                    }

                }
            } else {

                //Non stacked inventory
                for (let i = 0; i < gridItems.length; i++) {
                    // Find the first div with class 'item-img' inside the current grid-item
                    const itemImg = gridItems[i].querySelector('.item-img');


                    const dataObjId = itemImg.getAttribute('data-objid');

                    arrayindex = i + 1;
                    if (!gridItems[i].querySelector('input[type="radio"]')) {
                        document.getElementsByClassName('item-subname')[i].innerHTML += `<input type="hidden" name="id_arr[` + arrayindex + `]" value="` + dataObjId + `">
            <center>Quick Stock:<br>
            <img src=https://lel.wtf/shop.png width=15 height=15><input type="radio" name="radio_arr[` + arrayindex + `]" value="stock" ondblclick="this.checked = false; checkall[0].checked = false;">
            <img src=https://lel.wtf/sdb.png width=15 height=15><input type="radio" name="radio_arr[` + arrayindex + `]" value="deposit" ondblclick="this.checked = false; checkall[0].checked = false;">
            <img src=https://lel.wtf/discard.png width=15 height=15><input type="radio" name="radio_arr[` + arrayindex + `]" value="discard" ondblclick="this.checked = false; checkall[0].checked = false;">
            </center>`;
                    }

                }




            }




        }
    }

    function quickerstock() {
        //Check if inventory is stacked or unstacked
        var parentDiv = document.getElementById('invStack');
        var firstChildDiv = parentDiv.getElementsByClassName('stack-icon-container')[0];
        var isStacked = firstChildDiv.classList.contains('invfilter-active');
        if (isStacked) {

            //Ajax request for unstacked inventory data pulled from https://images.neopets.com/themes/h5/common/js/inventory.js with modified success function
            //Initiated once per click of "quicker stock" to populate needed stack data
            $.ajax({
                type: "POST",
                url: "https://www.neopets.com/np-templates/ajax/inventory.php?itemType=np&alpha=&itemStack=0&action=",
                success: function(response) {

                    var htmlString = response;


                    // Turn HTML string into traversable DOM
                    var parser = new DOMParser();
                    var doc = parser.parseFromString(htmlString, 'text/html');

                    // Find all div elements with the class 'item-img'
                    var items = doc.querySelectorAll('.item-img');

                    // Initialize an empty object
                    window.itemsById = {};

                    // Loop through each item and extract data
                    items.forEach(item => {
                        var itemName = item.getAttribute('data-itemname');
                        var objId = item.getAttribute('data-objid');

                        // Check if the item name key already exists
                        if (!window.itemsById[itemName]) {
                            window.itemsById[itemName] = [];
                        }

                        // Push the objId into the array for the corresponding item name
                        window.itemsById[itemName].push(objId);
                    });

                    //If invisible frames and submit button not already added
                    if (!document.getElementById('updateframe')) {
                        //Add invisible frame for form to POST to and submit button
                        document.getElementsByClassName('inv-items')[0].innerHTML = `
                                <iframe id="updateframe" name="updateframe" style="display:none"></iframe><form name="update" id="update" action="inventory.phtml" target="updateframe"><input type=hidden name=refresh></input></form><form name="quickstock" action="process_quickstock.phtml" method="post" target="refreshframe"><input type="hidden" name="buyitem" value="0">
                                <input class="button-default__2020 button-yellow__2020 btn-single__2020" type="submit" value="Submit">` + document.getElementsByClassName('inv-items')[0].innerHTML;
                    }


                    // Set an interval to repeatedly check for the elements
                    intervalId = setInterval(checkForGridItems, 500); // checks every 500 milliseconds (half a second)
                }
            });

        } else {
            //If invisible frames and submit button not already added
            if (!document.getElementById('updateframe')) {
                //Add invisible frame to POST to and submit button
                document.getElementsByClassName('inv-items')[0].innerHTML = `
                                <iframe id="updateframe" name="updateframe" style="display:none"></iframe><form name="update" id="update" action="inventory.phtml" target="updateframe"><input type=hidden name=refresh></input></form><form name="quickstock" action="process_quickstock.phtml" method="post" target="refreshframe"><input type="hidden" name="buyitem" value="0">
                                <input class="button-default__2020 button-yellow__2020 btn-single__2020" type="submit" value="Submit">` + document.getElementsByClassName('inv-items')[0].innerHTML;
            }


            // Set an interval to repeatedly check for the elements
            intervalId = setInterval(checkForGridItems, 500); // checks every 1000 milliseconds (1 second)
        }
    }



    //Minor style fix so that the three radio buttons all fit on one line
    var style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = `
       .grid-item {
    width: 130px;
    }

      `;

    document.getElementsByTagName("head")[0].appendChild(style);




    //If running in top window
    if (window.self === window.top) {
        //Create Iframe
        var refreshframe = document.createElement("iframe");
        refreshframe.name = "refreshframe";
        refreshframe.id = "refreshframe";
        refreshframe.src = "https://none"
        refreshframe.style.display = 'none';
        document.getElementsByTagName("body")[0].appendChild(refreshframe);

        document.getElementsByClassName('inv-menulinks')[0].innerHTML = `
          <li>
			<a id="quickerstock" style="cursor: pointer;">Quicker Stock</a>
		</li>` + document.getElementsByClassName('inv-menulinks')[0].innerHTML;



        document.getElementById('quickerstock').addEventListener('click', function() {
            quickerstock();
        });



        // Function to attach the load event listener to the iframe
        function attachLoadListener() {
            refreshframe = document.getElementById('refreshframe');
            // Ensure the iframe is provided and it's not null
            if (!refreshframe) return;
            // Attach the load event listener to the iframe
            refreshframe.addEventListener('load', function() {
                //If iframe is in the inventory page
                if (document.getElementById('refreshframe').contentWindow.document.location != "https://none") {
                    //Update inventory when iframe has loaded
                    if (document.getElementById('refreshframe').contentWindow.document.location == "https://www.neopets.com/inventory.phtml") {

                        setTimeout(updateInvTab2, 1000);
                        //Then check for REs
                        setTimeout(findre, 1200);
                        intervalId = setInterval(checkForGridItems, 1000); // checks every 1000 milliseconds (1 second)

                    } else {

                        document.getElementById('update').submit();
                        setTimeout(updateInvTab2, 1000);
                        //Then check for REs
                        setTimeout(findre, 1200);
                        intervalId = setInterval(checkForGridItems, 500); // checks every 1000 milliseconds (1 second)
                    }

                    document.getElementById('refreshframe').contentWindow.document.location = 'https://none';
                }
            });




        }
        //Attach event listener to iframe
        refreshframe = document.getElementById('refreshframe');
        attachLoadListener(refreshframe);
    }
    //Point existing refresh links to iframe to avoid the use of fetch();
    document.querySelector("#refreshshade__2020").target = "refreshframe";
    document.querySelector("#invResult > div.popup-header__2020 > a").target = "refreshframe";
    //Function to populate item div background images since the built-in function likes to fail for NC item tabs
    function genimages() {
        var divs = document.querySelectorAll('div.item-img');
        //Loop over items
        divs.forEach(function(div) {
            //If it doesn't have a gif set as the background image
            if (!div.style.backgroundImage.includes('.gif')) {
                //set one based on the data-src attribute
                var dataSrc = div.getAttribute('data-src');
                div.setAttribute('style', "background-image: url('" + dataSrc + "');");
            }
        });
    }
    //Function to detect REs in the iframe and display them on the top page
    function findre() {
        //if RE is found
        if (document.getElementById('refreshframe').contentWindow.document.getElementsByClassName("randomEvent")[0] || document.getElementById('refreshframe').contentWindow.document.getElementById("shh_prem_bg") || document.getElementById('refreshframe').contentWindow.document.getElementById("shh_prem_bg")) {
            //Grab all HTML associated with the RE
            var restylesheet = document.getElementById('refreshframe').contentWindow.document.getElementById('navsub-buffer__2020').nextElementSibling;
            var restyle = restylesheet.nextElementSibling;
            var rescript = restyle.nextElementSibling;
            var replaceholder = rescript.nextElementSibling;
            var remain = replaceholder.nextElementSibling;
            var rehtml = restylesheet.outerHTML + restyle.outerHTML + rescript.outerHTML + replaceholder.outerHTML + remain.outerHTML;
            //Inject the RE into the top page
            document.getElementById('navsub-buffer__2020').insertAdjacentHTML('afterend', '<div id="injectedre">' + rehtml + '</div>');
        }
        //if RE is found
        if (document.getElementById('updateframe').contentWindow.document.getElementsByClassName("randomEvent")[0] || document.getElementById('updateframe').contentWindow.document.getElementById("shh_prem_bg") || document.getElementById('updateframe').contentWindow.document.getElementById("shh_prem_bg")) {
            //Grab all HTML associated with the RE
            var restylesheet = document.getElementById('refreshframe').contentWindow.document.getElementById('navsub-buffer__2020').nextElementSibling;
            var restyle = restylesheet.nextElementSibling;
            var rescript = restyle.nextElementSibling;
            var replaceholder = rescript.nextElementSibling;
            var remain = replaceholder.nextElementSibling;
            var rehtml = restylesheet.outerHTML + restyle.outerHTML + rescript.outerHTML + replaceholder.outerHTML + remain.outerHTML;
            //Inject the RE into the top page
            document.getElementById('navsub-buffer__2020').insertAdjacentHTML('afterend', '<div id="injectedre">' + rehtml + '</div>');
        }
    }
    //Cleanup stuff
    function cleanup() {
        //Remove any previously injected REs
        if (document.querySelector("#injectedre")) {
            document.querySelector("#injectedre").remove();
        }
        //Remove modal and shade overlay
        document.querySelector("#invResult").style.display = 'none';
        document.querySelector("#refreshshade__2020 > div").style.visibility = 'hidden';
    }
    //Call the cleanup function when the close button or shade is clicked
    document.querySelector("#refreshshade__2020").addEventListener('click', function() {
        cleanup();
    });
    document.getElementsByClassName('inv-popup-exit')[1].addEventListener('click', function() {
        cleanup();
    });
    //Check item images for proper background images 5 times per second
    setInterval(genimages, 200);



})();