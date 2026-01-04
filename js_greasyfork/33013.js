// ==UserScript==
// @name         Neodeck Adder
// @version      0.1
// @description  Automatically adds Collectable Cards from your inventory into your Neodeck. 
// @author       AyBeCee (clraik)
// @match        http://www.neopets.com/inventory.phtml
// @match        http://www.neopets.com/iteminfo.phtml?*
// @match        http://www.neopets.com/useobject.phtml*
// @require      https://code.jquery.com/jquery-1.7.1.min.js
// @namespace https://greasyfork.org/users/145271
// @downloadURL https://update.greasyfork.org/scripts/33013/Neodeck%20Adder.user.js
// @updateURL https://update.greasyfork.org/scripts/33013/Neodeck%20Adder.meta.js
// ==/UserScript==

var itemImage = "tradingcardback";

if (document.body.innerHTML.indexOf("tradingcardback") !== -1){
    var itemID = $('a img[src*=' + itemImage + ']').parent().attr('onclick').substring(8,18); // finds the item that matches the image url and grabs the item ID number to open the link in the iframe
    var topBox=$("[id='invNav']")[0];
    var a = document.createElement("p");
    a.setAttribute('id', 'giftFrame');
    topBox.appendChild(a);
    var ShowFrame=$("[id='giftFrame']")[0];
    ShowFrame.innerHTML = '<iframe src="http://www.neopets.com/iteminfo.phtml?obj_id=' + itemID + '" style="width: 500px;height: 400px" id="giveFrame"></iframe>'; // added an iframe via innerHTML
    $('#giveFrame').load(function(){
        $('#giveFrame').contents().find("select[name=action] option[value=neodeck]").prop("selected","selected"); // selects the correct pet to feed
        $('#giveFrame').contents().find("[value='Submit']").click(); // clicks the submit button
    });
    $('#giveFrame').ready(function() {
        setTimeout(function(){location.reload();},2000); // waits 4 seconds and refreshes the page
    });
}