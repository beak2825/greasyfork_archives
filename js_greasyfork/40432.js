// ==UserScript==
// @name         Amazon Wishlist Exporter (April 2018)
// @namespace    ShadyThGod
// @version      1.2
// @description  Export Amazon Wishlist as JSON
// @author       ShadyThGod
// @author       m1m1k (improvements)
// @include      http*://*.amazon.*/hz/wishlist/ls*
// @include      http*://*.amazon.*/gp/registry/wishlist*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40432/Amazon%20Wishlist%20Exporter%20%28April%202018%29.user.js
// @updateURL https://update.greasyfork.org/scripts/40432/Amazon%20Wishlist%20Exporter%20%28April%202018%29.meta.js
// ==/UserScript==

(function() {
    'use strict';


function CreateAmazonButton() {
var button = document.createElement("span");
button.id = "amWEx";
button.className = "a-button a-button-primary";
button.setAttribute("style","cursor: pointer; float: right; margin-top: 1em;");
button.innerHTML = '<span class="a-button-inner"><span class="a-button-text">Export wishlist ðŸ”½</span></span>'
var topOfList = document.getElementById("wl-list-info");
topOfList.insertBefore(button, topOfList.firstChild);
    return button;
}
var button = CreateAmazonButton();


function AddButtonOnClickSpinner(button) {
button.addEventListener("click", function() {
  button.className += " a-button-disabled";
  var spinner = document.createElement("img");
  spinner.src = "https://images-na.ssl-images-amazon.com/images/G/01/amazonui/loading/loading-2x-gray._V1_.gif";
  spinner.id = "gm-spinner";
  spinner.setAttribute("style","float: right;")
  button.parentNode.insertBefore(spinner, button.nextSibling);
  GetWishlistItems();
});
}
AddButtonOnClickSpinner(button);


function CreateLoadingModal() {
        var alreadyExists = document.getElementById('amWExModalContainer');
        if (!alreadyExists) {
     var amWExModal = document.createRange().createContextualFragment(`<div id="amWExModalContainer">
<div id="amWExModalBg" style="background: #111111aa; width: 100%; height: 100%; position: fixed; top: 0; left: 0; z-index: 200"></div>
<div id="amWExModal" style="text-align: center; background: #FFFFFF; width: 50vw; position: fixed; top: 50%; left: 50%; transform: translateX(-50%) translateY(-50%); padding: 10px; z-index: 210;">
<h1>Loading...</h1>
</div>
</div>`); //Adds a modal containing text "Loading..."
            document.body.appendChild(amWExModal); //Adds a modal containing text "Loading..."
        }
}

function GetWishlistItems() {
        var wishlist = document.getElementById('g-items'); //Gets the node containing the wishlist items
        if (!document.getElementById('endOfListMarker')) {
            CreateLoadingModal();
            window.scrollTo(0, document.body.scrollHeight); //Scrolls to the bottom of the page to load all the items in the wishlist
            setTimeout(GetWishlistItems, 1000); //Runs the main callback function after 2.5 seconds
        } else { //Runs if there are less than 10 items in the wishlist
            Callback(); // Directly runs the callback function without waiting.
        }
}




    function Callback() { //The main callback function
        if (document.getElementById('amWExModalContainer')) {
            document.getElementById('amWExModalContainer').remove(); //Removes the "Loading..." modal
        }
        var wishlist_name = document.getElementById('profile-list-name').innerHTML.replace(/(\'|\.)/ig, ''); //Gets the name of the wishlist
        wishlist_name = wishlist_name.replace(/\s/ig, '-'); //Replaces spaces in the wishlist name with '-'
        var wishlist_items = document.querySelectorAll('.g-item-sortable'); //Gets all the items in the wishlist
        var wishlistJSON = []; //Defining an empty array to generate our JSON in
        for (var item of wishlist_items) { //Looping through all the items
            var item_details = item.querySelector('.g-item-details > .a-row > .a-column'); //Gets the node containing the details of the item
            var item_asin = JSON.parse(item.getAttribute('data-reposition-action-params')).itemExternalId.replace('ASIN:', '').replace(/\|.*/ig, ''); //Gets the ASIN of the item

            var item_name = item_details.querySelector('*[id*="itemName"]')
            var item_name_string = item_name.innerHTML.toString(); //Gets the name of the item
            var item_link = item_details.querySelector('h5 a');
            if(item_link != null)
            {
                item_link = item_link.getAttribute('href');
            }
            var item_image = item.querySelector('img').getAttribute('src');

            var item_price = item_details.querySelector('.a-price'); //Gets the price of the item
            var item_dateAdded = item.querySelector('.dateAddedText span').innerText; //Gets the date when the item was added to the list
            var item_price_int, item_price_float, item_prime; //Initializing the various price variables
            if (item_price != null) { // Runs if a price is defined on Amazon
                item_price_int = parseInt(item.getAttribute('data-price')); //Gets an integer value of the price
                item_price_float = parseFloat(item.getAttribute('data-price')); //Gets a floating point value of the price
                item_prime = Boolean(item_price.getElementsByClassName('.a-icon-prime') != null || item_price.getElementsByClassName('.a-icon-prime') != undefined); //Gets a boolean whether the prime service is available for the item
                item_price = item.getAttribute('data-price').toString(); //Gets a string value of the price
            } else { //Runs if no price is defined on Amazon
                item_price_int = null;
                item_price_float = null;
                item_price = 'N/A';
                item_prime = false;
            }
            var itemJSON = {
                name: item_name_string,
                image: item_image,
                link: item_link,
                priceString: item_price,
                priceInt: item_price_int,
                priceFloat: item_price_float,
                hasPrime: item_prime,
                ASIN: item_asin,
                dateAdded: item_dateAdded,
                dateAddedISO: (new Date(item_dateAdded)).toJSON()
            }; //Generating a JSON Object for the item
            wishlistJSON.push(itemJSON); //Adding the item's JSON object to the wishlist's JSON
        }
        wishlistJSON = JSON.stringify(wishlistJSON, null, ' '); //Stringifying the wishlist's JSON
        var amWExModal = document.createRange().createContextualFragment(`<div id="amWExModalContainer">
<div id="amWExModalBg" style="background: #111111aa; width: 100%; height: 100%; position: fixed; top: 0; left: 0; z-index: 200"></div>
<div id="amWExModal" style="background: #FFFFFF; width: 70vw; height: 80vh; position: fixed; top: 10%; left: 15%; padding: 10px; z-index: 210">
<h1 style="display: inline">${wishlist_name.replace('-', ' ')}</h1>
<a href="" id="amWExModalClose" style="font-family: sans-serif; font-weight: 600; font-size: 2.2rem; text-decoration: none; float: right; margin: 10px;">&times;</a>
<textarea id="amWExJSONText" style="height: 85%; font-size: 1rem; font-family: 'Inconsolata', 'Monaco', monospace, sans-serif"></textarea>
<div id="amWExSaveDialog" style="margin: 5px">
<span>Save As:</span>
<input type="text" id="amWExSaveFileName" value="${wishlist_name}.json">
<a id="amWExSave" class="a-button"><span class="a-button-inner"><span class="a-button-text">Save</span></span></a>
<a id="amWExSave" class="a-button" href="https://konklone.io/json/"><span class="a-button-inner"><span class="a-button-text">
Convert to Excel or CSV</span></span></a>
</div>
</div>
</div>`); //Defining the final output modal
        document.body.appendChild(amWExModal); //Adding the output modal to the screen
        document.getElementById('amWExJSONText').innerHTML = wishlistJSON; //Setting the text of the textarea to the wishlist's JSON
        document.getElementById('amWExSave').href = window.URL.createObjectURL(new Blob([wishlistJSON], {
            'type': 'application/json'
        })); //Setting the href of the save button to the wishlist's JSON for downloading capabilities
        document.getElementById('amWExSave').download = '_' + wishlist_name + '.json'; //Sets the filename for the download
        document.getElementById('amWExSaveFileName').addEventListener('change', function() {
            document.getElementById('amWExSave').download = document.getElementById('amWExSaveFileName').value; //Sets the filename for the download
        });
    }


    function RemoveJSONContainer(e) {
        if (e.target.id == "amWExModalBg") {
            document.getElementById('amWExModalContainer').remove(); //Removes the modal
        } else if (e.target.id == "amWExModalClose") {
            e.preventDefault();
            document.getElementById('amWExModalContainer').remove(); //Removes the modal
        }
        window.scrollTo(0, 0); //top,left
    }

    document.body.addEventListener('click', RemoveJSONContainer(e));
})();