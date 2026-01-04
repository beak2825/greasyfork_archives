// ==UserScript==
// @name         Item Auto Gifter
// @namespace    http://clraik.com/forum/showthread.php?62343
// @version      0.4
// @description  Automatically gifts items to a neofriend and until you no longer have the selected item in your inventory. You must keep your inventory open in a tab while you use this. Thi script will also auto accept everything from the Item Transfer Log.
// @author       AyBeCee (clraik)
// @match        http://www.neopets.com/inventory.phtml
// @match        http://www.neopets.com/iteminfo.phtml?*
// @match        http://www.neopets.com/useobject.phtml*
// @match        http://www.neopets.com/items/transfer_list.phtml*
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://code.jquery.com/jquery-1.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/34231/Item%20Auto%20Gifter.user.js
// @updateURL https://update.greasyfork.org/scripts/34231/Item%20Auto%20Gifter.meta.js
// ==/UserScript==

var itemName3 = GM_getValue('itemName2',0);
var giveFriend3 = GM_getValue('giveFriend2',0);
var startGift3 = GM_getValue('startGift2');

var topBox=$("[id='invNav']")[0];
var itemSetting = document.createElement("p");
topBox.appendChild(itemSetting);
itemSetting.innerHTML = '<font color="red">Gift all items containing <input type="text" id="item_name" value="'+ itemName3 + '"> to <input type="text" id="friend_name" value="'+ giveFriend3 + '">.</font> <input type="button" id="updateSet" value="Start gifting">';

$(updateSet).click(function(){
    var itemName = $("#item_name").val(); // any item that contains the phrase (case sensitive)
    GM_setValue('itemName2',itemName);
    var giveFriend = $("#friend_name").val(); // neofriend account name
    GM_setValue('giveFriend2',giveFriend);

    var startGift = true;
    GM_setValue('startGift2',startGift);
    location.reload();
});

if (startGift3)  {
    var itemID = $('.inventory td:contains(' + itemName3 + ') a').attr('onclick').substring(8,18); // finds the cell that contains the item name and grabs the item ID number to open the link in the iframe

    var a = document.createElement("p");
    a.setAttribute('id', 'giftFrame');
    topBox.appendChild(a);
    var ShowFrame = $("[id='giftFrame']")[0];
    ShowFrame.innerHTML = '<iframe src="http://www.neopets.com/iteminfo.phtml?obj_id=' + itemID + '" style="width: 500px;height: 400px" id="giveFrame"></iframe>'; // added an iframe via innerHTML
    $('#giveFrame').load(function(){
        $('#giveFrame').contents().find("select[name=action] option[value=give]").prop("selected","selected"); // selects the gifting option
        $('#giveFrame').contents().find("[value='Submit']").click(); // clicks the submit button
        $('#giveFrame').contents().find("input[name=or_name]").val(giveFriend3); // enters the friend name
        $('#giveFrame').contents().find("[value='Give Item!']").click(); // clicks the give item button
    });
    $('#giveFrame').ready(function() {
        setTimeout(function(){location.reload();},3000); // waits 3 seconds and refreshes the page
    });

    itemSetting.innerHTML = '<font color="red">Currently gifting all items containing <b>"'+ itemName3 + '"</b> to <b>"'+ giveFriend3 + '"</b>.</font> <input type="button" id="stopGift" value="Stop gifting">';

    $(stopGift).click(function(){
        var startGift = false;
        GM_setValue('startGift2',startGift);
        location.reload();
    });
}

// auto accept items
if (document.URL.indexOf("/items/transfer_list.phtml") != -1) {
    $('.itemTable #accept').prop('checked', 'checked');
    $("input[value='Submit']").click();
}