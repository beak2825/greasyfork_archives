// ==UserScript==
// @name     POSRearrange
// @description ReArrange the POS of a particular website
// @version  1.1
// @grant    unsafewindow
// @run-at   document-end
// @match https://b1101334.simplyswim.net.au/newpos.php*
// *
// @require http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @namespace https://greasyfork.org/users/1088091
// @downloadURL https://update.greasyfork.org/scripts/467592/POSRearrange.user.js
// @updateURL https://update.greasyfork.org/scripts/467592/POSRearrange.meta.js
// ==/UserScript==
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}


//POSItemButton is all POS buttons
addGlobalStyle('.POSItemButton { display: flex;}');
addGlobalStyle('.POSItemButton { justify-content: center !important;}');
addGlobalStyle('.POSItemButton { flex-direction: column !important;}');
addGlobalStyle('.POSItemButton { border-radius: 10px !important;}');
addGlobalStyle('.POSItemButton { width: 100px !important;}');
addGlobalStyle('.POSItemButton { height: 100px !important;}');

//AddPOS is the the for sale item Buttons
addGlobalStyle('[onclick*="AddPOS"] {background-color:whitesmoke !important;}');
addGlobalStyle('[onclick*="AddPOS"] {clear:left !important;}');
addGlobalStyle('[onclick*="AddPOS"]~[onclick*="AddPOS"] {clear:none !important;}');
addGlobalStyle('[onclick*="AddPOS"] {background-repeat:no-repeat !important;}');
addGlobalStyle('[onclick*="AddPOS"] {background-size:contain !important;}');
addGlobalStyle('[onclick*="AddPOS"] {background-position:center !important;}');


//Ice Cream Images
addGlobalStyle('[onclick*="AddPOSItem(29,8)"] {text-indent:-10000px !important;}');
addGlobalStyle('[onclick*="AddPOSItem(29,8)"] {background-image:url("https://i.postimg.cc/QMfLxptX/Choc-Bar.jpg") !important;}');
addGlobalStyle('[onclick*="AddPOSItem(30,8)"] {text-indent:-10000px !important;}');
addGlobalStyle('[onclick*="AddPOSItem(30,8)"] {background-image:url("https://i.postimg.cc/Vk3p8R1r/Fruju-Orange-Small.png") !important;}');
addGlobalStyle('[onclick*="AddPOSItem(31,8)"] {text-indent:-10000px !important;}');
addGlobalStyle('[onclick*="AddPOSItem(31,8)"] {background-image:url("https://i.postimg.cc/jjHLV03W/GG-Gumdrops-Small.png") !important;}');
addGlobalStyle('[onclick*="AddPOSItem(32,8)"] {text-indent:-10000px !important;}');
addGlobalStyle('[onclick*="AddPOSItem(32,8)"] {background-image:url("https://i.postimg.cc/ZRmv0KvF/Jelly-Tip-Small.png") !important;}');
//Skipping Maxi
//addGlobalStyle('[onclick*="AddPOSItem(33,8)"] {text-indent:-10000px !important;}');
//addGlobalStyle('[onclick*="AddPOSItem(33,8)"] {background-image:url("https://i.postimg.cc/QMfLxptX/Choc-Bar.jpg") !important;}');
addGlobalStyle('[onclick*="AddPOSItem(34,8)"] {text-indent:-10000px !important;}');
addGlobalStyle('[onclick*="AddPOSItem(34,8)"] {background-image:url("https://i.postimg.cc/tCc1WzVg/Memphis-Gooey-Caramel-Small.png") !important;}');
//Skipping Pineapple
//addGlobalStyle('[onclick*="AddPOSItem(35,8)"] {text-indent:-10000px !important;}');
//addGlobalStyle('[onclick*="AddPOSItem(35,8)"] {background-image:url("https://i.postimg.cc/QMfLxptX/Choc-Bar.jpg") !important;}');
addGlobalStyle('[onclick*="AddPOSItem(36,8)"] {text-indent:-10000px !important;}');
addGlobalStyle('[onclick*="AddPOSItem(36,8)"] {background-image:url("https://i.postimg.cc/gjkwqSDx/Fruity-Tube-Small.png") !important;}');
addGlobalStyle('[onclick*="AddPOSItem(37,8)"] {text-indent:-10000px !important;}');
addGlobalStyle('[onclick*="AddPOSItem(37,8)"] {background-image:url("https://i.postimg.cc/Qtq97GpL/Popsicle-Lemonade-Small.png") !important;}');
addGlobalStyle('[onclick*="AddPOSItem(38,8)"] {text-indent:-10000px !important;}');
addGlobalStyle('[onclick*="AddPOSItem(38,8)"] {background-image:url("https://i.postimg.cc/cJw8s8CL/Rocky-Road-Small.png") !important;}');
addGlobalStyle('[onclick*="AddPOSItem(39,8)"] {text-indent:-10000px !important;}');
addGlobalStyle('[onclick*="AddPOSItem(39,8)"] {background-image:url("https://i.postimg.cc/T17KkV7C/Slushy-Small.png") !important;}');
addGlobalStyle('[onclick*="AddPOSItem(40,8)"] {text-indent:-10000px !important;}');
addGlobalStyle('[onclick*="AddPOSItem(40,8)"] {background-image:url("https://i.postimg.cc/MG2vrK52/Trumpt-Small.png") !important;}');
addGlobalStyle('[onclick*="AddPOSItem(41,8)"] {text-indent:-10000px !important;}');
addGlobalStyle('[onclick*="AddPOSItem(41,8)"] {background-image:url("https://i.postimg.cc/8zr7Hrhm/Peanut-Slab-Small.png") !important;}');
addGlobalStyle('[onclick*="AddPOSItem(83,8)"] {text-indent:-10000px !important;}');
addGlobalStyle('[onclick*="AddPOSItem(83,8)"] {background-image:url("https://i.postimg.cc/YqGCTDB8/oreo-Sandwich-Small.png") !important;}');

//End of Ice Cream Images


//Food Images
addGlobalStyle('[onclick*="AddPOSItem(1,1)"] {text-indent:-10000px !important;}');
addGlobalStyle('[onclick*="AddPOSItem(1,1)"] {background-image:url("https://i.postimg.cc/prq3MMXR/Bumper-Bar-Apricot-Small.png") !important;}');
addGlobalStyle('[onclick*="AddPOSItem(23,1)"] {text-indent:-10000px !important;}');
addGlobalStyle('[onclick*="AddPOSItem(23,1)"] {background-image:url("https://i.postimg.cc/m2g0Nk8D/Power-Cookie-Bar-Oat-Small.png") !important;}');
addGlobalStyle('[onclick*="AddPOSItem(24,1)"] {text-indent:-10000px !important;}');
addGlobalStyle('[onclick*="AddPOSItem(24,1)"] {background-image:url("https://i.postimg.cc/ZYcGdpP2/Power-Cookie-Choc-Small.png") !important;}');
addGlobalStyle('[onclick*="AddPOSItem(25,1)"] {text-indent:-10000px !important;}');
addGlobalStyle('[onclick*="AddPOSItem(25,1)"] {background-image:url("https://i.postimg.cc/43VMN9N8/OSM-Choc-Small.png") !important;}');
addGlobalStyle('[onclick*="AddPOSItem(26,1)"] {text-indent:-10000px !important;}');
addGlobalStyle('[onclick*="AddPOSItem(26,1)"] {background-image:url("https://i.postimg.cc/RZ3yy8rx/Orginal-Craft-Bar-Choc-Small.png") !important;}');
addGlobalStyle('[onclick*="AddPOSItem(22,1)"] {text-indent:-10000px !important;}');
addGlobalStyle('[onclick*="AddPOSItem(22,1)"] {background-image:url("https://i.postimg.cc/qMDWmr5G/Vegan-Cookie-Small.png") !important;}');

//End of Food images


//drink Images
addGlobalStyle('[onclick*="AddPOSItem(63,3)"] {text-indent:-10000px !important;}');
addGlobalStyle('[onclick*="AddPOSItem(63,3)"] {background-image:url("https://i.postimg.cc/YSg7Dd2b/Juice-Small.png") !important;}');
addGlobalStyle('[onclick*="AddPOSItem(62,3)"] {text-indent:-10000px !important;}');
addGlobalStyle('[onclick*="AddPOSItem(62,3)"] {background-image:url("https://i.postimg.cc/4dTLf56L/Calci-Yum-Small.png") !important;}');
addGlobalStyle('[onclick*="AddPOSItem(81,3)"] {text-indent:-10000px !important;}');
addGlobalStyle('[onclick*="AddPOSItem(81,3)"] {background-image:url("https://i.postimg.cc/rF3QFSjX/Just-Juice-Box-small.png") !important;}');
addGlobalStyle('[onclick*="AddPOSItem(3,3)"] {text-indent:-10000px !important;}');
addGlobalStyle('[onclick*="AddPOSItem(3,3)"] {background-image:url("https://i.postimg.cc/0NgRS7Gm/pump-750.png") !important;}');
//end of Drink Images


//goggle images
addGlobalStyle('[onclick*="AddPOSItem(42,4)"] {text-indent:-10000px !important;}');
addGlobalStyle('[onclick*="AddPOSItem(42,4)"] {background-image:url("https://i.postimg.cc/wvQpg3mN/Junior-Blue-Small.png") !important;}');

//end of goggle images



//Cap Images
addGlobalStyle('[onclick*="AddPOSItem(51,6)"] {text-indent:-10000px !important;}');
addGlobalStyle('[onclick*="AddPOSItem(51,6)"] {background-image:url("https://i.postimg.cc/50nqDYJy/Aqualine-Adult-Lycra-small.png") !important;}');
addGlobalStyle('[onclick*="AddPOSItem(52,6)"] {text-indent:-10000px !important;}');
addGlobalStyle('[onclick*="AddPOSItem(52,6)"] {background-image:url("https://i.postimg.cc/Kj1LV0Qp/Aqualine-Junior-lycra-blue-Small.png") !important;}');
addGlobalStyle('[onclick*="AddPOSItem(54,6)"] {text-indent:-10000px !important;}');
addGlobalStyle('[onclick*="AddPOSItem(54,6)"] {background-image:url("https://i.postimg.cc/dV2CzkmF/CSS-Cap-small.png") !important;}');
addGlobalStyle('[onclick*="AddPOSItem(54,0)"] {text-indent:-10000px !important;}');
addGlobalStyle('[onclick*="AddPOSItem(54,0)"] {background-image:url("https://i.postimg.cc/dV2CzkmF/CSS-Cap-small.png") !important;}');
addGlobalStyle('[onclick*="AddPOSItem(61,6)"] {text-indent:-10000px !important;}');
addGlobalStyle('[onclick*="AddPOSItem(61,6)"] {background-image:url("https://i.postimg.cc/NFF7tsG4/Zoggs-deluxe-stretch-cap-small.png") !important;}');
addGlobalStyle('[onclick*="AddPOSItem(55,6)"] {text-indent:-10000px !important;}');
addGlobalStyle('[onclick*="AddPOSItem(55,6)"] {background-image:url("https://i.postimg.cc/Hn99xhvv/Aqauline-Elite-Full.png") !important;}');

//end of cap Images


//Increases font size, want to click a button to enable/disable this
//addGlobalStyle('td {font-size:14pt !important;}');
//addGlobalStyle('input {font-size:12pt !important;}');


//GoTo is the item catergories


// want to try add background image to this

//For family
addGlobalStyle('.title_wrapper a { background-color:dodgerblue !important;}');
addGlobalStyle('.title_wrapper a { border-radius: 10px !important;}');
addGlobalStyle('.title_wrapper a { border-style: solid !important;}');
addGlobalStyle('.title_wrapper a { border-color: dodgerblue !important;}');

//for Passes
addGlobalStyle('[title="View Pass"] { border-style: solid !important;}');
addGlobalStyle('[title="View Pass"] { margin: 5px !important;}');
addGlobalStyle('[title="View Pass"] { padding: 2px !important;}');
addGlobalStyle('[title="View Pass"] { border-radius: 5px !important;}');
addGlobalStyle('[title="View Pass"] { display: inline-block !important;}');
addGlobalStyle('[title="View Pass"] { width: 20px !important;}');
addGlobalStyle('[title="View Pass"] { height: 20px !important;}');
addGlobalStyle('[title="View Pass"] { background-color:dodgerblue !important;}');

addGlobalStyle('[title="Top-up Pass"] { border-style: solid !important;}');
addGlobalStyle('[title="Top-up Pass"] { margin: 5px !important;}');
addGlobalStyle('[title="Top-up Pass"] { padding: 2px !important;}');
addGlobalStyle('[title="Top-up Pass"] { border-radius: 5px !important;}');
addGlobalStyle('[title="Top-up Pass"] { display: inline-block !important;}');
addGlobalStyle('[title="Top-up Pass"] { width: 20px !important;}');
addGlobalStyle('[title="Top-up Pass"] { height: 20px !important;}');
addGlobalStyle('[title="Top-up Pass"] { background-color:dodgerblue !important;}');


function displayPricesForItems() {
  // Select all div elements with posbuttontype="Item"
  var itemButtons = document.querySelectorAll('div[posbuttontype="Item"]');

  // Iterate over the matched elements
  itemButtons.forEach(function(button) {
    // Extract the price from the element's attributes
    var price = button.getAttribute('positemprice');

    // Create a new div element for the price and append it to the button element
    var priceDiv = document.createElement('div');
    priceDiv.textContent = '$' + price;
    button.appendChild(priceDiv);

    // Apply styles to the price div
    priceDiv.style.textAlign = 'center';
    priceDiv.style.fontSize = '14px';
    priceDiv.style.margin = 'auto';
    priceDiv.style.textIndent = '0px';
    priceDiv.style.backgroundColor = 'rgba(245, 245, 245, 0.7)';
    priceDiv.style.width = '60%';
    priceDiv.style.borderRadius = '20px';
    priceDiv.style.marginBottom = '5px';
  });
}

// Call the function to display prices for items
displayPricesForItems();


(function() {
  // Select the button element
  var button = document.querySelector('.POSItemButton');

  // Check if the button element exists
  if (button) {
    // Get the text content of the button
    var buttonText = button.innerText.trim();

    // Check if the text overflows the button
    if (button.scrollWidth > button.clientWidth) {
      // Create a new text container element
      var textContainer = document.createElement('div');
      textContainer.style.textAlign = 'center';
      textContainer.style.width = '100%';

      // Create a new span element for the text
      var textSpan = document.createElement('span');
      textSpan.textContent = buttonText;

      // Append the text span to the text container
      textContainer.appendChild(textSpan);

      // Empty the button and append the modified text container
      button.textContent = '';
      button.appendChild(textContainer);

      // Reduce the font size to fit the text inside the button
      var fontSize = 14; // Starting font size
      while (textSpan.scrollWidth > textContainer.clientWidth) {
        fontSize--;
        textSpan.style.fontSize = fontSize + 'px';
      }
    }
  }
})();
