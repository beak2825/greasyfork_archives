// ==UserScript==
// @name         Turnip Exchange Sorter
// @namespace    com.timatlee.turnip.exchange.filter
// @version      0.0.3
// @description  Sorts the Turnip Exchange by sale price (and queue length?)
// @author       Tim AtLee
// @match        https://turnip.exchange/island*
// @resource     cssjqui https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/405740/Turnip%20Exchange%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/405740/Turnip%20Exchange%20Sorter.meta.js
// ==/UserScript==

let HTMLDialog = `
<div id="dialog" title="Turnip Filters">
  <p><label for="price_min">Low Price:</label><input type="number" id="price_min" class="text ui-widget-content ui-corner-all" name="price_min"/></p>
</div>
`;

var jqUI_CssSrc = GM_getResourceText("cssjqui");
GM_addStyle(jqUI_CssSrc);

let bells_regexp = new RegExp(/(\d{2,3}) Bells/);
let queue_regexp = new RegExp(/Waiting: (\d{1,3})\/(\d{1,3})/);
let title_regexp = new RegExp(/You are \#(\d{1,3}) of (\d{1,3}) in the queue\./); //You are #81 of 126 in the queue.

(function() {
    'use strict';

    console.log("Hello.  Starting Turnip Exchange Sorter");
    console.log("jQuery version I think loaded: ", $().jquery);

    if (/island\/\w*/.test(location.pathname)) {
        // We're on an island.
        console.log("On an island.");
        let ifQueueSize = false;
        let queueChecker = setInterval(() => {
            /*
            if (ifQueueSize) {
                clearInterval(queueChecker);
                return;
            }
            */
            let queue_length = $("span.text-center").text().match(title_regexp);
            if (queue_length !== null) {
                // console.log(queue_length);
                ifQueueSize = true;
                let newtitle = queue_length[1] + "/" + queue_length[2];
                $(document).attr('title', newtitle);
            }
        }, 1000);
    }

    // parseCards needs to be in the global space so we can call it from button presses.
    // Sorts and applies filters to the cards.
    unsafeWindow.parseCards = function() {
        // Try to find price cards
        let cards = $("div[data-turnip-code]");
        // If we have cards on the screen..
        if (cards.length > 3) {
            // Get a filter price.
            const price_min = localStorage.getItem('price_min');
            if (!price_min) {
                localStorage.setItem('price_min', 300);
                $("#price_min").val(300);
            } else {
                $("#price_min").val(price_min);
            }

            // Iterate over the cards
            cards.each(function() {
                // Try to find the price node
                let PriceNode = $(this).find("div > p").filter(function() {
                    return $(this).text().match(bells_regexp);
                });

                // Try to find the waiting queue line
                let QueueNode = $(this).find("div > p").filter(function() {
                    return $(this).text().match(queue_regexp);
                });

                // Add an element to hide this card.
                //QueueNode.before("<a class=\"removecard\" href=\"https://www.google.ca\">Remove</a>");

                // Parse up all the data, and append it to the DOM.
                let price = parseInt(PriceNode.text().match(bells_regexp)[1]);
                let queue_now = parseInt(QueueNode.text().match(queue_regexp)[1]);
                let queue_max = parseInt(QueueNode.text().match(queue_regexp)[2]);

                $(this).attr('data-price', price);
                $(this).attr('data-queue', (queue_now/queue_max));

                // Show all the elements first, then hide if they don't meet criteria.
                $(this).show();
                if (price <= price_min) {
                    $(this).hide();
                }
            });
        } else {
            return false;
        }

        // Sort the cards by price.
        cards.sort(function (a, b) {
            var contentA =parseInt( $(a).attr('data-price'));
            var contentB =parseInt( $(b).attr('data-price'));
            return (contentA < contentB) ? 1 : (contentA > contentB) ? -1 : 0;
        }).appendTo(cards.parent());

        return true;
    } // end parseCards

    // Handles unhiding cards we've hidden.
    unsafeWindow.unHideCards = function() {
        localStorage.removeItem("hidden_cards");
    } // end unHideCards

    let ifReplaced = false;
    // Periodically check the page for cards.
    let checker = setInterval(() => {
        // If we have found cards, stop polling the page.
        if (ifReplaced) {
            clearInterval(checker);
            return;
        }

        // If this returns true, then there are cards and we can make things change on screen.
        if (parseCards()) {
            ifReplaced = true

            // Add the dialog box to the DOM.  Do this early so we can prefill some values.
            $("body").append(HTMLDialog);

            // Get the saved price from local storage, and apply it to the dialog box.
            const price_min = localStorage.getItem('price_min');
            if (!price_min) {
                localStorage.setItem('price_min', 300);
                $("#price_min").val(300);
            } else {
                $("#price_min").val(price_min);
            }

            // Show the dialog
            $( "#dialog" ).dialog({
                position: { my: "left", at: "left top", of: "#app" },
                buttons: {
                    //"Unhide Cards": unHideCards,
                    "Apply Filter": parseCards,

                },
            });

            // Change handler for minimum price.
            $("#price_min").change(function() {
                localStorage.setItem("price_min",$(this).val());
            });

            $("#removecard").click(function(){
                event.stopPropagation();
                console.log("Hello.");
            });
        } // end of if(parseCards)
    }, 1000);
})();
