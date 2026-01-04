// ==UserScript==
// @name         Sticky Snowball Purchaser
// @version      1.0
// @description  Auto-buys Sticky Snowballs every 30-35 minutes
// @author       the real janet yellen @ neopets.com
// @match        http://www.neopets.com/faerieland/springs.phtml
// @require      http://code.jquery.com/jquery-latest.js
// @namespace https://greasyfork.org/users/576416
// @downloadURL https://update.greasyfork.org/scripts/404452/Sticky%20Snowball%20Purchaser.user.js
// @updateURL https://update.greasyfork.org/scripts/404452/Sticky%20Snowball%20Purchaser.meta.js
// ==/UserScript==

function addStyle(styleString) {
    const style = document.createElement('style');
    style.textContent = styleString;
    document.head.append(style);
}

function createButton() {
    // get proper text depending on whether program is running
    var button;
    if (!programRunning) {
         button = `<div id="auto_buyer">
                       <input type="button" class="toggle_buyer" value="Start Buying Sticky Snowballs">
                        <p>Click to begin auto-buying Sticky Snowballs every 30-35 minutes.
                   </div>`;
        $(".content").append(button);
    }
    else {
        button = `<div id="auto_buyer">
                      <input type="button" class="toggle_buyer" value="Stop Buying Sticky Snowballs">
                  </div>`;
        $(".content").append(button);
        purchaseSnowball();
    }

    // press button to start/stop program
    $('.toggle_buyer').click(function() {
        programRunning = !programRunning;
        $("#auto_buyer").remove(); // remove old button and replace with new text
        createButton();
    });
}

function purchaseSnowball() {
    // purchase snowball
    if (programRunning) {
        $.get('http://www.neopets.com/faerieland/process_springs.phtml?obj_info_id=8429')
        // TODO: don't +1 purchases if no snowball is purchased
        snowballsPurchased += 1;
        $("#purchases").remove();
        var message = '<div id="purchases"><p><b>Snowballs Purchased:</b> ' + snowballsPurchased + '<br>Waiting 30-35 minutes.</div>';
        $('#auto_buyer').append(message);
        var waitTime = 1800000 + Math.floor(Math.random() * 300000);
        setTimeout(purchaseSnowball, waitTime);
    }
    return;
}

var programRunning = false;
var snowballsPurchased = 0;

// add CSS
addStyle(`
    #auto_buyer {
        text-align: center;
        font-family: verdana;
        font-size: 10px;
        margin-bottom: 20px;
    }
    #toggle_buyer {
        font-family: verdana;
    }
    `);

createButton();