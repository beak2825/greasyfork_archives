// ==UserScript==
// @name         Subeta: Auto Quester
// @namespace    https://greasyfork.org/en/users/145271-aybecee
// @version      0.1.6
// @description  Automatically does your quests for you. Shows you the net sP profit (does not take into account discount buffs). Keeps a log of what you buy and get rewarded with. Pick and choose which quest giver you want. If you have too many items in your Inventory, it will automatically deposit your items into the Vault.
// @author       AyBeCee
// @match        https://subeta.net/quests.php*
// @match        https://subeta.net/user_shops.php/search/shops*
// @match        https://subeta.net/shop.php?shopid=*
// @match        https://subeta.net/explore/goddess.php
// @match        https://subeta.net/user_shops.php/mine/*/quick_stock
// @require      https://code.jquery.com/jquery-1.7.1.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/412246/Subeta%3A%20Auto%20Quester.user.js
// @updateURL https://update.greasyfork.org/scripts/412246/Subeta%3A%20Auto%20Quester.meta.js
// ==/UserScript==

Notification.requestPermission();


var minWaitKey;
var minWait = GM_getValue('minWaitKey',0);
var maxWaitKey;
var maxWait = GM_getValue('maxWaitKey',0);

var wait = Math.floor(Math.random() * (maxWait - minWait + 1) + minWait);
console.log(maxWait)
console.log(minWait)
console.log(wait)

// items you need to get
var QuestItemKey;
var QuestItem = GM_getValue('QuestItemKey',0);

// single item you need to buy
var buyThisKey;
var buyThis = GM_getValue('buyThisKey',0);

// to see what items you have bought
var YouHaveKey;
var YouHave = GM_getValue('YouHaveKey',0);

var QuestGiverKey;
var QuestGiver = GM_getValue('QuestGiverKey',0);

var CurrentQuestURLKey;
var CurrentQuestURL = GM_getValue('CurrentQuestURLKey',0);

var QuestLogKey;
var QuestLog = GM_getValue('QuestLogKey',0);

const logTime = $("#menu-time").text();

var moneySpentKey;
var moneySpent = GM_getValue('moneySpentKey',0);

var moneyGainedKey;
var moneyGained = GM_getValue('moneyGainedKey',0);

var whichQuestsArrayKey;
var whichQuestsArray = GM_getValue('whichQuestsArrayKey',0);

var tooPoorKey;
var tooPoor = GM_getValue('tooPoorKey',0);

var netProfit = moneyGained - moneySpent;

$(".col-8").append(`
<div id="toopoor" style="background-color: #f8d7da; border-color: #f5c6cb; padding: 20px; margin-bottom: 10px;">
You can't afford Saggitarius' quests. You need at least 1,500,000 sP.
</div>
<b>Quest log history:</b>
<br>
<div id="hideQuest" style="border: 1px solid #c3d6c1; padding: 0 20px 20px; background: #e1efda; max-height: 300px; overflow: auto;">
${QuestLog}
</div>
<br>
<b>Net sP profit:</b> ${netProfit} sP
<br>
<button id='clearhistory'>Clear log history</button>`);
$(`#toopoor`).hide();

$(".col-4").append(`

<div style="padding: 15px; border-radius: 15px; box-shadow: 2px 2px 2px #d3d3d3; display: inline-block; margin-left: 25px; background: #e3e3e3;text-align:left;" class="autoquest">
<div style="font-size: 20px; text-transform: uppercase; font-weight: bold; margin-bottom: 10px;color:red;">Auto Quester Script</div>
Start at <a href="/explore/goddess.php">Shinwa</a> quests. Once the script has finished Shinwa's quests, the script will navigate to the usual quests (Blue, Carl, etc). If you have too many items in your Inventory, the script will deposit everything in your Vault.
<br><br>
Add a delay on how fast you want the clicks to be (please input values in milliseconds, e.g. 1 second is 1000 ms):
<br>
  <label for="minWait">Min delay time:</label>
  <input type="number" id="minWait" name="minWait" value="${minWait}">
  <br>
  <label for="maxWait">Max delay time:</label>
  <input type="number" id="maxWait" name="maxWait" value="${maxWait}">

<br><br>
Select which person's quests you want to do:
<br>
<input type="checkbox" id="blueLabel" name="blueLabel" value="blue">
<label for="blueLabel">blue</label><br>
<input type="checkbox" id="carlLabel" name="carlLabel" value="carl">
<label for="carlLabel">carl</label><br>
<input type="checkbox" id="cinthiaLabel" name="cinthiaLabel" value="cinthia">
<label for="cinthiaLabel">cinthia</label><br>
<input type="checkbox" id="cursedLabel" name="cursedLabel" value="cursed">
<label for="cursedLabel">cursed</label><br>
<input type="checkbox" id="libraryLabel" name="libraryLabel" value="library">
<label for="libraryLabel">library</label><br>
<input type="checkbox" id="maleriaLabel" name="maleriaLabel" value="maleria">
<label for="maleriaLabel">maleria</label><br>
<input type="checkbox" id="peteLabel" name="peteLabel" value="pete">
<label for="peteLabel">pete</label><br>
<input type="checkbox" id="quentinLabel" name="quentinLabel" value="quentin">
<label for="quentinLabel">quentin</label><br>
<input type="checkbox" id="saggitariusLabel" name="saggitariusLabel" value="saggitarius">
<label for="saggitariusLabel">saggitarius</label><br>
<input type="checkbox" id="sarahLabel" name="sarahLabel" value="sarah">
<label for="sarahLabel">sarah</label><br>
<input type="checkbox" id="wizardLabel" name="wizardLabel" value="wizard">
<label for="wizardLabel">wizard</label><br>
<div id="whichQuests" class="ui button">Update</div>
</div>
`);


$("#whichQuests").click(function(){
    whichQuestsArray = [];

    $('.autoquest input[type="checkbox"]' ).each(function() {
        if ( $(this).prop('checked') == true ) {
            var questName = $(this).val();
            console.log(questName);

            whichQuestsArray.push(questName);
            GM_setValue('whichQuestsArrayKey',whichQuestsArray);
        }
    });

    minWait = Number( $(`#minWait`).val() );
    GM_setValue('minWaitKey',minWait);
    console.log(minWait)
    maxWait = Number( $(`#maxWait`).val() );
    GM_setValue('maxWaitKey',maxWait);

    location.reload();
});

$('.autoquest input[type="checkbox"]' ).each(function() {
    var checkboxValue = $(this).val();

    if ( whichQuestsArray.includes(checkboxValue) ) {
        $(this).prop('checked', true);
    }
});


$("#clearhistory").click(function(){
    GM_setValue('QuestLogKey'," ");
    GM_setValue('moneyGainedKey',0);
    GM_setValue('moneySpentKey',0);
    GM_setValue('tooPoorKey',false);

    $(`#hideQuest`).html("")
});


// https://stackoverflow.com/questions/7837456/how-to-compare-arrays-in-javascript
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});

// Shinwa quests
if (window.location.href.includes("/explore/goddess.php")) {
    if ( $(`h3.card-header:contains('Thank you!')`).length > 0 ) {
        setTimeout( function() {
            window.location.href = $("a.btn.btn-primary").attr("href")
        }, wait );
    }
    else if ( $(`h3.card-header:contains('Thank you so much!')`).length > 0 ) {
        setTimeout( function() {
            window.location.href = $("a.btn.btn-primary").attr("href")
        }, wait );
    }
}

var nextLink;
var nextSibling;
var checkBought;

// Usual quests
setTimeout(function () {
    if (window.location.href.includes("/quests.php")) {

        if (window.location.href.includes("/quests.php/blue") && $(`body:contains('Oh, it looks like you don't have access to the Blue Building.')`).length > 0) {
            window.location.href = "/quests.php/carl"
        }
        if (window.location.href.includes("/quests.php/blue") && $(`body:contains('Oh, it looks like you don't have access to the Blue Building.')`).length > 0) {
            window.location.href = "/quests.php/carl"
        }

        // if has been idle for 1 minute, send a notification
        setTimeout(function () {
            new Notification("Quest has been idle for 1 minute.");
        }, 60000);

        // can't finish because  don't have all the items required
        if (window.location.href.includes("/finish")) {
            if ( $(`body:contains("You don't have all the items required for this quest! You are missing:")`).length > 0 ) {
                new Notification(`Don't have all the items required`)
                console.log(YouHave);
                $(`.alert.alert-danger .wl_item img`).each( function() {
                    var dontHaveThis = $(this).attr("alt");
                    console.log(this)
                    console.log("dontHaveThis" + dontHaveThis)

                    var index = YouHave.indexOf(dontHaveThis);
                    if (index > -1) {
                        YouHave.splice(index, 1);
                    }
                    console.log(YouHave);
                    GM_setValue('YouHaveKey',YouHave);
                });

                window.location.href = CurrentQuestURL;
            }
        }
    }

    const tabName = window.location.href.substr(window.location.href.indexOf("/quests.php/") + 12)
    GM_setValue('QuestGiverKey',tabName);

    // if too poor for saggitarius quest, change the tooPoorKey to true and go to Sarah's quests
    if ( window.location.href.includes("/quests.php/saggitarius") && $(`.alert.alert-danger:contains("I expect a certain amount of sP to be put into my quests.")`).length > 0 ) {
        GM_setValue('tooPoorKey',true);
        $('#toopoor').show();
        window.location.href = "https://subeta.net/quests.php/sarah";
    }
    // else if you can afford saggitarius
    else if ( window.location.href.includes("/quests.php/saggitarius") && $('<input[value="Start Quest!"]').length > 0 ) {
        GM_setValue('tooPoorKey',false);
        $('#toopoor').hide();

    }


    if ( $(`.col-8 h1:contains("Finished")`).length > 0 ) {
        if (window.location.href.includes("/quests.php/blue")) {
            const rewardsGained = $(".col-8 center").text().replace(/AND/g, " + ").replace(/Wishlist/g, "").replace("! You can spend it here!", "").replace("You earned", "").replace("Return this to Shinwa!", "");

            QuestLog += `<br><span style="color:blue"><b>${logTime}:</b> Received ${rewardsGained}</span>`;
            GM_setValue('QuestLogKey',QuestLog);

            // reset all the bought items to nothing
            GM_setValue('YouHaveKey',[]);

            window.location.href = $(`a.ui.button.large:contains("Back to")`).attr("href");
        }
        else if ( $(`body:contains("Return this to Shinwa!")`).length > 0 ) {
            const rewardsGained = $(".col-8 center").text().replace(/AND/g, " + ").replace(/Wishlist/g, "").replace("! You can spend it here!", "").replace("You earned", "").replace("Return this to Shinwa!", "");

            QuestLog += `<br><span style="color:blue"><b>${logTime}:</b> Received ${rewardsGained}</span>`;
            GM_setValue('QuestLogKey',QuestLog);

            // for the net profit data
            const rewardComma = $(".col-8 center p:contains('sP') b").text();
            const rewardPure = parseFloat(rewardComma.replace(/,/g, ''));

            moneyGained += rewardPure;
            GM_setValue('moneyGainedKey',moneyGained);

            console.log(rewardPure);

            // reset all the bought items to nothing
            GM_setValue('YouHaveKey',[]);

            window.location.href = "/explore/goddess.php";

        } else {
            ////////// REWARDS PAGE

            const rewardsGained = $(".col-8 center").text().replace(/AND/g, " + ").replace(/Wishlist/g, "").replace("! You can spend it here!", "").replace("You earned", "");

            QuestLog += `<br><span style="color:blue"><b>${logTime}:</b> Received ${rewardsGained}</span>`;
            GM_setValue('QuestLogKey',QuestLog);

            // for the net profit data
            const rewardComma = $(".col-8 center p:contains('sP') b").text();
            const rewardPure = parseFloat(rewardComma.replace(/,/g, ''));

            moneyGained += rewardPure;
            GM_setValue('moneyGainedKey',moneyGained);

            console.log(rewardPure);

            // reset all the bought items to nothing
            GM_setValue('YouHaveKey',[]);

            window.location.href = $(`a.ui.button.large:contains("Back to")`).attr("href");
        }
    }

    // if the start quest button exists
    else if ( $('<input[value="Start Quest!"]').length > 0 ) {

        console.log(222222222)

        // check if you want to do this person's quests
        if ( whichQuestsArray.includes( tabName ) ) {
            console.log(`want ${tabName}'s quests. Clicking 'Start Quest!'`);

            setTimeout( function() {
                $('<input[value="Start Quest!"]').click();
            }, wait );
        }

        // don't want to do this person's quests
        else {
            console.log(`screw ${tabName}'s quests`);

            // GO TO NEXT PERSON
            // get next sibling of current tab
            nextSibling = $(`.nav-tabs .nav-item a[href$="${tabName}"]`).parent().next();
            console.log(nextSibling);

            // get link of next sibling
            nextLink = nextSibling.find(".nav-link").attr("href");
            console.log(nextLink)

            setTimeout( function() {
                window.location.href = nextLink;
            }, wait );

        }





    }


    else if ( $(`body:contains("left to bring me")`).length > 0 ) {

        // add all items you need to get to requestedItemsArray
        var requestedItemsArray = [];
        $(".col-md-3 .scode-item-name" ).each(function( index ) {
            requestedItemsArray.push($( this ).text());
            console.log(this)
        });
        console.log("she wants: " + requestedItemsArray);
        console.log("you have: " + YouHave);





        // check if the arrays match
        if ( requestedItemsArray.equals(YouHave) ) {
            console.log("you are not missing anything");

            // finish quest
            $("button:contains('Finish Quest')").click();
        }
        else {
            // if the arrays don't match

            ///////////////// to start off the script if first time installing
            if ( YouHave == 0 ) {
                GM_setValue('YouHaveKey',[]);
                YouHave = [];
            }

            //////////////////
            var missingItemsArray = requestedItemsArray.filter(function (a) {


                return YouHave.indexOf(a) === -1;
            });
            console.log( missingItemsArray )

            console.log("you are missing: " + missingItemsArray);


            if ( missingItemsArray[0] == undefined ) {

                console.log("finish quest");
                setTimeout( function() {
                    $("button:contains('Finish Quest')").click();
                }, wait );
            } else {
                // buy the first missing item in the missingItemsArray
                // the item you are buying
                GM_setValue('buyThisKey',missingItemsArray[0]);

                console.log("going to buy " + missingItemsArray[0]);
                setTimeout( function() {
                    window.location.href = "https://subeta.net/user_shops.php/search/shops/" + missingItemsArray[0];
                }, wait );
            }

        }

        // https://stackoverflow.com/questions/1773069/using-jquery-to-compare-two-arrays-of-javascript-objects
        // https://stackoverflow.com/questions/44834269/jquery-compare-arrays-and-display-unmatched-values



        GM_setValue('CurrentQuestURLKey',window.location.href);


    }




    else if ( $(`body:contains("You've completed 15/15 quests today!")`).length > 0 ||
             $(`body:contains("You've completed 10/10 quests today!")`).length > 0 ||
             $(`body:contains("You've completed 5/5 quests today!")`).length > 0 ) {

        const finishedLog = `Finished all <b style="text-transform:capitalize">${tabName}</b> quests`;

        QuestLog += `<br><span style="color:red"><b>${logTime}:</b> ${finishedLog}</span>`;
        GM_setValue('QuestLogKey',QuestLog);

        console.log(finishedLog);


        // GO TO NEXT PERSON
        if ( tabName != "wizard" ) {
            // get next sibling of current tab
            nextSibling = $(`.nav-tabs .nav-item a[href$="${tabName}"]`).parent().next();
            console.log(nextSibling);

            // get link of next sibling
            nextLink = nextSibling.find(".nav-link").attr("href");
            console.log(nextLink)

            setTimeout( function() {
                window.location.href = nextLink;
            }, wait );
        }
        // if you're at the wizard's page, stop the script
        else {
            new Notification("You have completed all quests!");
        }

    }





    if ( window.location.href.includes("/user_shops.php/search/shops")  ) {

        console.log(buyThis)

        if ( $(`#item-search[value='${buyThis}']`).length > 0 ) {

            const UserPriceComma = $("button.btn.btn-primary.btn-sm.quick-buy:first").parent().parent().find(".three.wide.column.center.aligned:contains('sP')").html();
            const UserPricePure = parseFloat(UserPriceComma.replace(/,/g, ''));
            // if your own shop has the item
            if ( $(`.row.shop_highlight.blue`).length > 0 ) {
                $(`button.btn.btn-primary.btn-sm.quick-buy:contains('Move')`).click();

                // updating what you have
                var boughtStatus = YouHave;
                boughtStatus.push(buyThis);
                GM_setValue('YouHaveKey',boughtStatus);

                setTimeout( function() {
                    window.location.href = CurrentQuestURL;
                }, wait );
            } else {

                // if NPC shop exists
                if ( $('.row:nth-child(2) input[value="Buy"]').length > 0 ) {

                    // compare NPC price and user price
                    const NPCPriceComma = $('.row:nth-child(2) input[value="Buy"]').parent().parent().parent().find(".three.wide.column.center.aligned:contains('sP')").html();
                    const NPCPricePure = parseFloat(NPCPriceComma.replace(/,/g, ''));


                    if ( NPCPricePure < UserPricePure ) {
                        console.log(NPCPricePure + " < " + UserPricePure + ". Buying from NPC shop.");

                        QuestLog += `<br><b>${logTime}:</b> Bought ${buyThis} for ${NPCPriceComma}`;
                        GM_setValue('QuestLogKey',QuestLog);

                        moneySpent += NPCPricePure;
                        GM_setValue('moneySpentKey',moneySpent);


                        setTimeout( function() {
                            $('.row:nth-child(2) input[value="Buy"]').click();
                        }, wait );

                    } else {
                        console.log(NPCPricePure + " > " + UserPricePure + ". Buying from User shop.");

                        QuestLog += `<br><b>${logTime}:</b> Bought ${buyThis} for ${UserPriceComma}`;
                        GM_setValue('QuestLogKey',QuestLog);

                        moneySpent += UserPricePure;
                        GM_setValue('moneySpentKey',moneySpent);


                        setTimeout( function() {
                            $("button.btn.btn-primary.btn-sm.quick-buy:first").click();
                        }, wait );
                        checkBought = setInterval( function() {
                            // check that you've purchased > 0 of the item, then go back to quest
                            if ( parseInt ( $(`#numberPurchased`).text() ) > 0 ) {

                                // updating what you have
                                var boughtStatus = YouHave;
                                boughtStatus.push(buyThis);
                                GM_setValue('YouHaveKey',boughtStatus);

                                setTimeout( function() {
                                    window.location.href = CurrentQuestURL;
                                }, wait );
                                clearInterval(checkBought);
                            }
                            else if ( $(`#purchaseFailureReason:contains('Oops, you have too many items in your ')`).length > 0 ) {
                                console.log(`Oops, you have too many items in your inventory`)

                                setTimeout( function() {
                                    window.location.href = $(`#menu-btn-commerce-css .menu-dropdown a:contains('qs')`).attr("href");
                                }, wait );
                            }
                        }, 1000);
                    }


                } else {
                    $("button.btn.btn-primary.btn-sm.quick-buy:first").click();

                    QuestLog += `<br><b>${logTime}:</b> Bought ${buyThis} for ${UserPriceComma}`;
                    GM_setValue('QuestLogKey',QuestLog);

                    moneySpent += UserPricePure;
                    GM_setValue('moneySpentKey',moneySpent);


                    checkBought = setInterval( function() {
                        // check that you've purchased > 0 of the item, then go back to quest
                        if ( parseInt ( $(`#numberPurchased`).text() ) > 0 ) {

                            console.log(`purchased > 0`)
                            // updating what you have
                            var boughtStatus = YouHave;
                            boughtStatus.push(buyThis);
                            GM_setValue('YouHaveKey',boughtStatus);

                            setTimeout( function() {
                                window.location.href = CurrentQuestURL;
                            }, wait );
                            clearInterval(checkBought);
                        }
                        else if ( $(`#purchaseFailureReason:contains('Oops, you have too many items in your ')`).length > 0 ) {
                            console.log(`Oops, you have too many items in your inventory`)

                            window.location.href = $(`#menu-btn-commerce-css .menu-dropdown a:contains('qs')`).attr("href");
                        }
                    }, 1000);
                }

                console.log("Clicked buy");
            }
        }

    }

    // AT NPC SHOP
    if ( window.location.href.includes("/shop.php?shopid=")  ) {
        if ( $(`body:contains('You have too many items in your inventory!')`).length > 0 ) {
            setTimeout( function() {
                window.location.href = $(`#menu-btn-commerce-css .menu-dropdown a:contains('qs')`).attr("href");
            }, wait );
        }
        else if ( $(`body:contains('You can only buy an item every 5 seconds! Give everyone else a chance.')`).length > 0 ) {
            setTimeout( function() {
                window.location.href = CurrentQuestURL;
            }, wait );
        }
        else if ( ( $(`body:contains('${buyThis}')`).length > 0 ) || $(`body:contains('has been put in your items')`).length > 0  || ($(`h1:contains('Subeta Pawn')`).length > 0) ) {

            // updating what you have
            YouHave.push(buyThis);
            GM_setValue('YouHaveKey',YouHave);

            console.log(`successfully bought ${buyThis}`);

            setTimeout( function() {
                window.location.href = CurrentQuestURL;
            }, wait );
        }
    }
    // AT PAWN SHOP

    if (  window.location.href.includes("/pawn.php/shop/buy/") ) {
        // updating what you have
        YouHave.push(buyThis);
        GM_setValue('YouHaveKey',YouHave);

        console.log(`successfully bought ${buyThis}`);
        setTimeout( function() {
            window.location.href = CurrentQuestURL;
        }, wait );
    }
    // QUICK STOCK PAGE

    if (window.location.href.includes("quick_stock")) {
        console.log("she wants: " + requestedItemsArray);
        console.log("you have: " + YouHave);

        $(`button.qs-button.ui.button.tiny[x-type="vault"]`).click();
        console.log(11111)
        for (var item of YouHave) {
            console.log(item)
            $(`.four.wide.column.left.aligned:contains('${item}')`).parent().find(`.five.wide.column.center.aligned:nth-child(1) input[type="radio"]`).prop("checked", true);
        }

        // if items exist
        if ( $(`.row .four.wide.column.left.aligned small`).length > 0 ) {
            console.log('items exist')

            // if there's any non-quest items, then click 'stock'
            $(`.four.wide.column.left.aligned`).each( function() {
                var inventoryItemName = $(this).find(`small`).text();
                console.log(inventoryItemName);
                if ( ! YouHave.includes(inventoryItemName) ) {
                    // YouHave array does NOT have this item (aka it's a non-quest item)
                    setTimeout( function() {
                        $(`input.ui.button.big.green[value="Stock Now"]`).click()
                    }, wait );
                } else {
                    setTimeout( function() {
                        window.location.href = CurrentQuestURL;
                    }, wait );
                }
            });


        } else {
            setTimeout( function() {
                window.location.href = CurrentQuestURL;
            }, wait );
        }
    }



}, 0);







