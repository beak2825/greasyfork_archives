// ==UserScript==
// @name         Subeta: Major Drills Auto Quester
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  try to take over the world!
// @author       AyBeCee
// @match        https://subeta.net/explore/major_drills.php
// @match        https://subeta.net/user_shops.php/search/shops/*
// @match        https://subeta.net/inventory.php*
// @match        https://subeta.net/explore/trapped.php*
// @match        https://subeta.net/explore/survivor_memorial.php?act=kiss
// @match        https://subeta.net/shop.php?shopid=*
// @match        https://subeta.net/explore/asmodeus.php*
// @match        https://subeta.net/explore/farmers_market.php?act=minion*
// @match        https://subeta.net/explore/festival/goat.php?act=feed
// @match        https://subeta.net/games/seashell_spotter.php*
// @match        https://subeta.net/games/scratchcards.php*
// @match        https://subeta.net/games/battleship.php*
// @match        https://subeta.net/vending.php*
// @match        https://subeta.net/explore/pawn.php/sell*
// @match        https://subeta.net/games/2048.php
// @match        https://subeta.net/games/slots.php
// @match        https://subeta.net/explore/fragmentizer.php
// @match        https://subeta.net/games/potion_lottery.php*
// @match        https://subeta.net/explore/freefood.php?act=donate*
// @match        https://subeta.net/explore/gifts.php/choose/random
// @match        https://subeta.net/user_shops.php/mine/*
// @match        https://subeta.net/item.php?itemid=*&act=food&petid=*
// @match        https://subeta.net/item.php?itemid=*&act=toy&petid=*
// @require      https://code.jquery.com/jquery-1.7.1.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/416177/Subeta%3A%20Major%20Drills%20Auto%20Quester.user.js
// @updateURL https://update.greasyfork.org/scripts/416177/Subeta%3A%20Major%20Drills%20Auto%20Quester.meta.js
// ==/UserScript==

var feedItemKey;
var feedItem = GM_getValue('feedItemKey',0);

var playWithKey;
var playWith = GM_getValue('playWithKey',0);

var minionAmountKey;
var minionAmount = GM_getValue('minionAmountKey',0);

var minionItemKey;
var minionItem = GM_getValue('minionItemKey',0);

var maxMinionFeedKey;
var maxMinionFeed = GM_getValue('maxMinionFeedKey',0);

var maxMinionFeedPriceKey;
var maxMinionFeedPrice = GM_getValue('maxMinionFeedPriceKey',0);

var vendAmountKey;
var vendAmount = GM_getValue('vendAmountKey',0);

var restockFromQuestKey;
var restockFromQuest = GM_getValue('restockFromQuestKey',0);

var questLogKey;
var questLog = GM_getValue('questLogKey',0);

var haveItemsKey;
var haveItems = GM_getValue('haveItemsKey',0);

var autumnWantKey;
var autumnWant = GM_getValue('autumnWantKey',0);

var hitLeviathansKey;
var hitLeviathans = GM_getValue('hitLeviathansKey',0);

var hitSoFarKey;
var hitSoFar = GM_getValue('hitSoFarKey',0);

var scratchSomethingKey;
var scratchSomething = GM_getValue('scratchSomethingKey',0);

var slotsRequirementKey;
var slotsRequirement = GM_getValue('slotsRequirementKey',0);

var asmodeus1Key;
var asmodeus1 = GM_getValue('asmodeus1Key',0);
var asmodeus2Key;
var asmodeus2 = GM_getValue('asmodeus2Key',0);

var beat2048Key;
var beat2048 = GM_getValue('beat2048Key',0);

var fragAmountKey;
var fragAmount = GM_getValue('fragAmountKey',0);

var shopIDKey;
var shopID = GM_getValue('shopIDKey',0);

var pawnKey;
var pawn = GM_getValue('pawnKey',0);

var potionKey;
var potion = GM_getValue('potionKey',0);

var restockShopKey;
var restockShop = GM_getValue('restockShopKey',0);

var skipHustlerStickKey;
var skipHustlerStick = GM_getValue('skipHustlerStickKey',0);

var deleteAmountKey;
var deleteAmount = GM_getValue('deleteAmountKey',0);

var hideKey;
var hide = GM_getValue('hideKey',0);

var checkBought;


function shopSearchBuy ( item, destination ) {


    console.log( item );
    console.log(`item.length ${item.length}`);

    var lastCharacter = item.substring( item.length - 1, item.length );

    console.log( `last character: ${lastCharacter}` );
    if ( lastCharacter == " " ) {
        item = item.substring( 0, item.length - 1)
    }

    if (window.location.href.includes("/user_shops.php/search/shops/") ) {


        if ( $(`#item-search[value='${item}']`).length > 0 ) {

            console.log(`yes`);

            var UserPriceComma = $("button.btn.btn-primary.btn-sm.quick-buy:first").parent().parent().find(".three.wide.column.center.aligned:contains('sP')").html();
            var UserPricePure = parseFloat(UserPriceComma.replace(/,/g, ''));

            // if NPC shop exists
            if ( $('.row:nth-child(2) input[value="Buy"]').length > 0 ) {

                // compare NPC price and user price
                var NPCPriceComma = $('.row:nth-child(2) input[value="Buy"]').parent().parent().parent().find(".three.wide.column.center.aligned:contains('sP')").html();
                var NPCPricePure = parseFloat(NPCPriceComma.replace(/,/g, ''));


                if ( NPCPricePure < UserPricePure ) {
                    console.log(NPCPricePure + " < " + UserPricePure + ". Buying from NPC shop.");

                    $('.row:nth-child(2) input[value="Buy"]').click();

                } else {
                    console.log(NPCPricePure + " > " + UserPricePure + ". Buying from User shop.");

                    $("button.btn.btn-primary.btn-sm.quick-buy:first").click();

                    checkBought = setInterval( function() {
                        // check that you've purchased > 0 of the item, then go back to quest
                        if ( parseInt ( $(`#numberPurchased`).text() ) > 0 ) {

                            GM_setValue('haveItemsKey',item);

                            window.location.href = destination;
                            clearInterval(checkBought);
                        }
                        else if ( $(`#purchaseFailureReason:contains('Oops, you have too many items in your ')`).length > 0 ) {
                            console.log(`Oops, you have too many items in your inventory`)
                        }
                    }, 1000);
                }


            } else {
                $("button.btn.btn-primary.btn-sm.quick-buy:first").click();

                checkBought = setInterval( function() {
                    // check that you've purchased > 0 of the item, then go back to quest
                    if ( parseInt ( $(`#numberPurchased`).text() ) > 0 ) {

                        console.log(`purchased > 0`)

                        window.location.href = destination;
                        clearInterval(checkBought);
                    }
                    else if ( $(`#purchaseFailureReason:contains('Oops, you have too many items in your ')`).length > 0 ) {
                        console.log(`Oops, you have too many items in your inventory`)
                    }
                }, 1000);

            }
        }
    }

    //     if (window.location.href.includes("/shop.php?shopid=")
    //         && == item ) {

    //     }



}
function directNewTab ( url, containsText ) {
    if ( numberofTasks == 1 ) {
        window.location.href = url;
    } else if ( $(`.d-inline-block.align-middle.p-3 b:contains('THEN')`).length > 0 ) {
        if ( $(`.d-inline-block.align-middle.p-3.m-3.border.rounded:contains('${containsText}') span[style="color: red;"]`) !==
            $(`.d-inline-block.align-middle.p-3.m-3.border.rounded:first span[style="color: red;"]`) ) {
            console.log(`${containsText} is not first`)
        }

    } else {
        window.open( url, "_blank")
    }
}


function flashySaved () {
    $("#savedFade5").fadeIn(500);
    setTimeout(function(){
        $("#savedFade5").fadeOut(500);
    }, 1000);
}

$(`.container-fluid`).prepend(`
<div id="majorDrills">
<div style="font-size: 20px; text-transform: uppercase; font-weight: bold; margin-bottom: 10px;color:red;">Major Drills Auto Quester</div>
<div id="expand" class="ui button">Expand</div>
<div id="collapse" class="ui button">Collapse</div>
<div id="windowContents">
<br>
<label for="maxMinionFeed">Maximum minions to feed</label>
  <input type="number" name="maxMinionFeed" id="maxMinionFeed" value="${maxMinionFeed}">
<br>
<label for="maxMinionFeedPrice">Maximum price to feed minions</label>
  <input type="number" name="maxMinionFeedPrice" id="maxMinionFeedPrice" value="${maxMinionFeedPrice}">
<br>
<label for="asmodeus1">Asmodeus item 1</label>
  <input type="text" name="asmodeus1" id="asmodeus1" value="${asmodeus1}">
<br>
<label for="asmodeus2">Asmodeus item 2</label>
  <input type="text" name="asmodeus2" id="asmodeus2" value="${asmodeus2}">
<br>
<label for="shopID">shopID</label>
  <input type="number" name="shopID" id="shopID" value="${shopID}">
<br>
<br>Autumn dragon wants: ${autumnWant}
<br>
Feed <b>${minionAmount}</b> trapped minions. Feeding trapped minion ${minionItem}.
<div id="minionFeeder"></div>
<br>
feedItem: ${feedItem}
<br>
playWith: ${playWith}
<br>
Need to hit Levithians: ${hitLeviathans}. Hit so far: ${hitSoFar}
<br>
vendAmount: ${vendAmount}
<br>
haveItems: ${haveItems}
<br>
beat2048: ${beat2048}
<br>
deleteAmount: ${deleteAmount}
<br>
pawn: ${pawn}
<br>
fragAmount: ${fragAmount}
<br>
slotsRequirement: ${slotsRequirement}
<br>
restockFromQuest: ${restockFromQuest}
<br>
 <input type="checkbox" id="skipHustlerStick" name="skipHustlerStick">
  <label for="skipHustlerStick">skipHustlerStick</label>
<br>
${questLog}
<div id="savedFade5">Saved</div>
</div>
</div>
<style>
#majorDrills {
padding: 15px; border-radius: 15px; box-shadow: 2px 2px 2px #d3d3d3; display: inline-block; margin-left: 25px; background: #e3e3e3;
}
#savedFade5 {
    text-align: center;
    color: #ffffff;
    background: #4CAF50;
    padding: 2px 8px;
display:none;
margin-top:5px;
}
</style>`)
$(`#expand`).hide();
$(`#collapse`).show();


$(`#collapse`).click( function() {

    $(`#expand`).show();
    $(`#collapse`).hide();

    $(`#windowContents`).hide();
    GM_setValue('hideKey', true );

});

$(`#expand`).click( function() {

    $(`#collapse`).show();
    $(`#expand`).hide();

    $(`#windowContents`).show();
    GM_setValue('hideKey', false );

});

if ( hide == true) {

    $(`#expand`).show();
    $(`#collapse`).hide();

    $(`#windowContents`).hide();
}
if ( hide == false) {

    $(`#collapse`).show();
    $(`#expand`).hide();

    $(`#windowContents`).show();
}

$('#maxMinionFeed').change(function() {
    GM_setValue('maxMinionFeedKey', parseInt($(this).val()));
    flashySaved ()
});
$('#maxMinionFeedPrice').change(function() {
    GM_setValue('maxMinionFeedPriceKey', parseInt( $(this).val() ) );
    flashySaved ()
});
$('#asmodeus1').change(function() {
    GM_setValue('asmodeus1Key',$(this).val());
    flashySaved ()
});
$('#asmodeus2').change(function() {
    GM_setValue('asmodeus2Key',$(this).val());
    flashySaved ()
});
$('#shopID').change(function() {
    GM_setValue('shopIDKey', parseInt( $(this).val() ) );
    flashySaved ()
});

$('#skipHustlerStick').change(function() {
    if ( $('#skipHustlerStick:checked').length > 0 ) {
        GM_setValue('skipHustlerStickKey',true);
    } else {
        GM_setValue('skipHustlerStickKey',false);
    }

    flashySaved ()
});
// for default form display
if ( skipHustlerStick == true ) {
    $('#skipHustlerStick').prop('checked', true);
}
if (window.location.href.includes("/explore/major_drills.php")) {
    // reset requirements to 0
    GM_setValue('restockFromQuestKey',false);
    GM_setValue('minionItemKey',0);
    GM_setValue('minionAmountKey',0);
    GM_setValue('feedItemKey',0);
    GM_setValue('playWithKey',0);
    GM_setValue('hitLeviathansKey',0);
    GM_setValue('hitSoFarKey',0);
    GM_setValue('scratchSomethingKey',false);
    GM_setValue('pawnKey',false);
    GM_setValue('hitSoFarKey',0);
    GM_setValue('vendAmountKey',0);
    GM_setValue('fragAmountKey',0);
    GM_setValue('beat2048Key',0);
    GM_setValue('slotsRequirementKey',0);
    GM_setValue('autumnWantKey',0);
    GM_setValue('deleteAmountKey',0);
    GM_setValue('potionKey',false);


    var numberofTasks = $(`.d-inline-block.align-middle.p-3.m-3.border.rounded`).length;
    console.log(numberofTasks);

    $(`input.btn.btn-secondary[value="Give Up"]`).attr("onclick","")
    $(`input.btn.btn-lg.btn-success[value="SIR, YES SIR!"]`).click()
    $(`input.btn.btn-danger[value="Out of Time!"]`).click()
    if ( $(`body:contains('Since we don't put funds into silly things like prizes, we have this stockpile over in the corner of donated prizes. You can have this one - I guess you've earned it.')`).length > 0 ) {
        window.location.href = "/explore/major_drills.php"
    }
    if (    $(`input.btn.btn-success[value="Finished!"]`).length > 0 ) {
        console.log(`Click Finished! button`)
        $(`input.btn.btn-success[value="Finished!"]`).click()
    }

    else if ( ( $(`.d-inline-block.align-middle.p-3.m-3.border.rounded:contains('Get the Hustler to add a sticker to your collection') span[style="color: red;"]`).length > 0 )
             && skipHustlerStick == true
             &&
             ( numberofTasks == 1
              || $(`.d-inline-block.align-middle.p-3 b:contains('THEN')`).length > 0
              || $(`.d-inline-block.align-middle b:contains('AND')`).length > 0 ) ) {

        $(`input.btn.btn-secondary[value="Give Up"]`).click();
    }
    else {



        if ($(`.d-inline-block.align-middle.p-3.m-3.border.rounded:contains('Leviathans in Leviathan Harpooning') span[style="color: red;"]`).length > 0 ) {
            hitLeviathans = $(`.d-inline-block.align-middle.p-3.m-3.border.rounded:contains('Leviathans in Leviathan Harpooning') span[style="color: red;"]`).text();
            hitLeviathans = parseInt( hitLeviathans.substring( 1 ) );
            console.log(hitLeviathans);
            GM_setValue('hitLeviathansKey',hitLeviathans);
            GM_setValue('hitSoFarKey',0);

            directNewTab ("/games/battleship.php", "Leviathans in Leviathan Harpooning")
        }
        if ($(`.d-inline-block.align-middle.p-3.m-3.border.rounded:contains('worry') span[style="color: red;"]`).length > 0 ) {
            directNewTab ("/explore/festival/goat.php?act=feed", "worry")
        }
        if ($(`.d-inline-block.align-middle.p-3.m-3.border.rounded:contains('tile in 2048!') span[style="color: red;"]`).length > 0 ) {
            beat2048 = $(`.d-inline-block.align-middle.p-3.m-3.border.rounded:contains('tile in 2048!')`).text();
            beat2048 = parseInt( beat2048.substring( 10 ) );
            GM_setValue('beat2048Key',beat2048);
            directNewTab ("/games/2048.php", "ffftile in 2048!fffffff")
        }
        if ($(`.d-inline-block.align-middle.p-3.m-3.border.rounded:contains('Play Slots until you win ') span[style="color: red;"]`).length > 0 ) {
            var slotsText = $(`.d-inline-block.align-middle.p-3.m-3.border.rounded:contains('Play Slots until you win ')`).text();
            if ( slotsText.includes("book") ) {
                GM_setValue('slotsRequirementKey',"book");
                directNewTab ( "/games/slots.php", "Play Slots until you win ")
            }
            else if ( slotsText.includes("Play Slots until you win a total of") ) {

                slotsText = parseInt ( slotsText.substring( 36 ) );
                console.log(slotsText);
                GM_setValue('slotsRequirementKey',slotsText);
                directNewTab ( "/games/slots.php", "Play Slots until you win ")
            }

        }
        if ($(`.d-inline-block.align-middle.p-3.m-3.border.rounded:contains('Mystery Box') span[style="color: red;"]`).length > 0 ) {
            directNewTab (`/explore/mystery_box.php`, "Mystery Box")
        }
        if ($(`.d-inline-block.align-middle.p-3.m-3.border.rounded:contains('Vend ') span[style="color: red;"]`).length > 0 ) {
            console.log(111)
            vendAmount =  $(`.d-inline-block.align-middle.p-3.m-3.border.rounded:contains('Vend ') span[style="color: red;"]`).text();

            vendAmount = parseInt ( vendAmount.substring(
                vendAmount.lastIndexOf("Vend") + 4) );

            console.log(vendAmount)
            GM_setValue('vendAmountKey',vendAmount);
            directNewTab ("/vending.php/oceandepths", "Vend ")
        }
        if ($(`.d-inline-block.align-middle.p-3.m-3.border.rounded:contains('Play a game of Saheric Slide') span[style="color: red;"]`).length > 0 ) {
            directNewTab (`/games/sliding_puzzle.php`, "Play a game of Saheric Slide")
        }
        if ($(`.d-inline-block.align-middle.p-3.m-3.border.rounded:contains('Survivor Memorial') span[style="color: red;"]`).length > 0 ) {
            directNewTab (`/explore/survivor_memorial.php?act=kiss`, "Play a game of Saheric Slide")
        }
        if ($(`.d-inline-block.align-middle.p-3.m-3.border.rounded:contains('Potion Lottery') span[style="color: red;"]`).length > 0 ) {
    GM_setValue('potionKey',true);
            directNewTab ( "/games/potion_lottery.php", "Potion Lottery")
        }
        if ($(`.d-inline-block.align-middle.p-3.m-3.border.rounded:contains('Play a game of Seashell Spotter') span[style="color: red;"]`).length > 0 ) {
            directNewTab ( "/games/seashell_spotter.php", "Play a game of Seashell Spotter")
        }
        if ($(`.d-inline-block.align-middle.p-3.m-3.border.rounded:contains('Pawn an item.') span[style="color: red;"]`).length > 0 ) {
            GM_setValue('pawnKey',true);
            directNewTab ( "/explore/pawn.php/sell", "Pawn an item.")
        }
        if ($(`.d-inline-block.align-middle.p-3.m-3.border.rounded:contains('Send a gift through the Gift Wrapping') span[style="color: red;"]`).length > 0 ) {
            directNewTab (`/explore/gifts.php`, "Send a gift through the Gift Wrapping")
        }
        if ($(`.d-inline-block.align-middle.p-3.m-3.border.rounded:contains('Recycle Beast') span[style="color: red;"]`).length > 0 ) {
            directNewTab (`/explore/recycle_beast.php?act=items`, "Recycle Beast")
        }
        if ($(`.d-inline-block.align-middle.p-3.m-3.border.rounded:contains('Win a game of Subeku') span[style="color: red;"]`).length > 0 ) {
            directNewTab (`/games/subeku/index.php`, "Win a game of Subeku")
        }
        if ( ( $(`.d-inline-block.align-middle.p-3.m-3.border.rounded:contains('Add a sticker to a friend') span[style="color: red;"]`).length > 0 ) ) {
            directNewTab (`/user_shops.php/mine/${shopID}?name=&stocked_operator=eq&stocked=&category=&price_operator=lt&price=10000&rarity=&use=sticker`, "Add a sticker to a friend")
        }
        if ($(`.d-inline-block.align-middle.p-3.m-3.border.rounded:contains("Feed a harvest dragon at the Farmer's Market") span[style="color: red;"]`).length > 0 ) {
            directNewTab (`/explore/farmers_market.php?act=minion`, "Feed a harvest dragon at the Farmer's Market")
        }
        if ($(`.d-inline-block.align-middle.p-3.m-3.border.rounded:contains('Restock something from ') span[style="color: red;"]`).length > 0 ) {

            GM_setValue('restockFromQuestKey',true);

            var restockFrom = $(`.d-inline-block.align-middle.p-3.m-3.border.rounded:contains('Restock something from ') span[style="color: red;"]`).parent().clone().children().remove().end().text();

            restockFrom = restockFrom.substring( restockFrom.lastIndexOf(" something from ") + 16             );


            var shopList = { "Accessory Bin": "/shop.php?shopid=32",
                            "All That Glitters": "/shop.php?shopid=41",
                            "Apocalyptic Apothecary": "/shop.php?shopid=36",
                            "Atebus Shop": "/shop.php?shopid=17",
                            "Beach Shack": "/shop.php?shopid=20",
                            "Bean Me Up": "/shop.php?shopid=6",
                            "Bits and Bytes": "/shop.php?shopid=26",
                            "Book Nook": "/shop.php?shopid=9",
                            "Candy Shack": "/shop.php?shopid=5",
                            "Carnival Stand": "/shop.php?shopid=19",
                            "Cavern of Curios": "/shop.php?shopid=47",
                            "Clothing Rack": "/shop.php?shopid=11",
                            "Defend and Conquer": "/shop.php?shopid=31",
                            "Food Market": "/shop.php?shopid=2",
                            "Get Mugged!": "/shop.php?shopid=22",
                            "Grooming Parlor": "/shop.php?shopid=14",
                            "Half Baked": "/shop.php?shopid=46",
                            "Home Appliances": "/shop.php?shopid=23",
                            "Icy Goods": "/shop.php?shopid=25",
                            "Minions Market": "/shop.php?shopid=21",
                            "Music Shop": "/shop.php?shopid=12",
                            "Paw Naturel": "/shop.php?shopid=95",
                            "Philosopher's Store": "/shop.php?shopid=44",
                            "Plushie Parlor": "/shop.php?shopid=29",
                            "Quick Bites": "/shop.php?shopid=49",
                            "Rathskeller Inn": "/shop.php?shopid=40",
                            "Seedlings": "/shop.php?shopid=27",
                            "Sole Train": "/shop.php?shopid=34",
                            "Spells Galore": "/shop.php?shopid=28",
                            "Stick it to the Man!": "/shop.php?shopid=37",
                            "The Bake Stop": "/shop.php?shopid=24",
                            "The Lost Skeleton": "/shop.php?shopid=45",
                            "The Sable Smithy": "/shop.php?shopid=39",
                            "Thimble &amp; Co.": "/shop.php?shopid=42",
                            "Toy Box": "/shop.php?shopid=4",
                            "Trading Card Center": "/shop.php?shopid=16",
                            "Weapons Warehouse": "/shop.php?shopid=30" };

            directNewTab ( shopList[restockFrom] , "Restock something from ")
            GM_setValue('restockShopKey',shopList[restockFrom]);
        }
        if ($(`.d-inline-block.align-middle.p-3.m-3.border.rounded:contains('Win a game of Divine Discs') span[style="color: red;"]`).length > 0 ) {

            directNewTab (`/games/divine_discs.php`, "Win a game of Divine Discs")
        }
        if ($(`.d-inline-block.align-middle.p-3.m-3.border.rounded:contains('Donate any food item to ') span[style="color: red;"]`).length > 0 ) {

            directNewTab (`/explore/freefood.php?act=donate`, "Donate any food item to ")
        }
        if ($(`.d-inline-block.align-middle.p-3.m-3.border.rounded:contains('Play a Carnival Game') span[style="color: red;"]`).length > 0 ) {

            directNewTab (`/explore/carnival_mallarchypond.php`, "Play a Carnival Game")
        }
        if ($(`.d-inline-block.align-middle.p-3.m-3.border.rounded:contains('Create any item at the Asmodeus Genetech Lab') span[style="color: red;"]`).length > 0 ) {
            window.open(`/user_shops.php/search/shops/${asmodeus1}`, `_blank`)
            window.open(`/user_shops.php/search/shops/${asmodeus2}`, `_blank`)
        }
        if ($(`.d-inline-block.align-middle.p-3.m-3.border.rounded:contains('Galaxan Wastelands') span[style="color: red;"]`).length > 0 ) {

            minionAmount = $(`.d-inline-block.align-middle.p-3.m-3.border.rounded:contains('Galaxan Wastelands')`).text();
            minionAmount = parseInt( minionAmount.substring(
                minionAmount.lastIndexOf("Feed ") + 5,
                minionAmount.lastIndexOf(" minions trapped in the ")
            ) );
            GM_setValue('minionAmountKey',minionAmount);

            if ( minionAmount <= maxMinionFeed || $(`.d-inline-block.align-middle.p-3 b:contains('OR')`).length > 0 ) {
                window.open( `/explore/trapped.php`, "_blank")
            }
            else {
                $(`input.btn.btn-secondary[value="Give Up"]`).click();
            }
        }
        if ($(`.d-inline-block.align-middle.p-3.m-3.border.rounded:contains('Scratch a Scratchcard') span[style="color: red;"]`).length > 0 ) {
            GM_setValue('scratchSomethingKey',true);
            directNewTab (`/games/scratchcards.php`, "Scratch a Scratchcard")
        }
        if ($(`.d-inline-block.align-middle.p-3.m-3.border.rounded:contains(' crystal(s) from the fragmentizer') span[style="color: red;"]`).length > 0 ) {

            fragAmount = $(`.d-inline-block.align-middle.p-3.m-3.border.rounded:contains(' crystal(s) from the fragmentizer')`).text();
            fragAmount = parseInt ( fragAmount.substring(4) );
            GM_setValue('fragAmountKey',fragAmount);
            directNewTab (`/explore/fragmentizer.php`, " crystal(s) from the fragmentizer")
        }
        if ($(`.d-inline-block.align-middle.p-3.m-3.border.rounded:contains('Play a game of Pete Says') span[style="color: red;"]`).length > 0 ) {

            directNewTab (`/games/pete_says.php`, "Play a game of Pete Says")
        }
        if ($(`.d-inline-block.align-middle.p-3.m-3.border.rounded:contains('Delete') span[style="color: red;"]`).length > 0 ) {


            deleteAmount = $(`.d-inline-block.align-middle.p-3.m-3.border.rounded:contains('Delete')`).text();
            deleteAmount = parseInt( deleteAmount.substring( 6) ) ;
            GM_setValue('deleteAmountKey',deleteAmount);
            directNewTab (`/user_shops.php/mine/${shopID}?name=&stocked_operator=eq&stocked=&category=&price_operator=lt&price=1500&rarity=&use=`, "Delete")
        }
        if ($(`.d-inline-block.align-middle.p-3.m-3.border.rounded:contains('Donate any item to the Donation Center!') span[style="color: red;"]`).length > 0 ) {

            directNewTab (`/user_shops.php/mine/${shopID}?name=&stocked_operator=eq&stocked=&category=&price_operator=lt&price=1500&rarity=&use=`, "Donate any item to the Donation Center!")
        }
        if ($(`.d-inline-block.align-middle.p-3.m-3.border.rounded:contains('Feed your pet a') span[style="color: red;"]`).length > 0 ) {
            feedItem = $(`.d-inline-block.align-middle.p-3.m-3.border.rounded:contains('Feed your pet a')`).text();
            feedItem = feedItem.substring(
                feedItem.lastIndexOf("Feed your pet a ") + 16,
                feedItem.lastIndexOf("(") - 1
            );
            GM_setValue('feedItemKey',feedItem);
            directNewTab (`/user_shops.php/search/shops/${feedItem}`, "Feed your pet a")
        }
        if ( $(`body:contains('to play with')`).length > 0 ) {
            playWith = $(`.d-inline-block.align-middle.p-3.m-3.border.rounded:contains('to play with')`).text();
            playWith = playWith.substring(
                playWith.lastIndexOf("Give your pet a ") + 16,
                playWith.lastIndexOf("to play with") - 1
            );
            GM_setValue('playWithKey',playWith);
            directNewTab (`/user_shops.php/search/shops/${playWith}`, "to play with")
        }
    }
}


if ( window.location.href.includes(`/vending.php`) ) {
    var vendIteration = 0;

    var vendInterval =setInterval(function(){
        if ( vendIteration < vendAmount ) {
            vendIteration++
            console.log('vend')
            $(`.vending_image`).click();
        } else {

            window.location.href = `/explore/major_drills.php`;
            clearInterval(vendInterval);
        }

    },1000);

}
if ( window.location.href.includes(`/games/battleship.php`) ) {
    if ( $(`h1:contains('Good Job!')`).length > 0 ) {
        hitSoFar++
        GM_setValue('hitSoFarKey',hitSoFar);
    }
}
if ( window.location.href.includes(`/games/scratchcards.php`)
    && $(`b:contains('Finished!')`).length > 0
    && scratchSomething == true ) {
    window.location.href = `/explore/major_drills.php`;
}
if ( window.location.href.includes(`/explore/pawn.php/sell_item/`) && pawn == true ) {
    GM_setValue('pawnKey',false);
    window.location.href = `/explore/major_drills.php`;

}
if ( window.location.href.includes(`/explore/pawn.php/sell`) && pawn == true
    && $(`body:contains("Of course I'll take those normal items")`).length > 0 ) {
    var totalPawnItems = $(`.itembox a`).length;
    console.log(totalPawnItems)

    function cheapestPawn ( childNumber ) {
        var itemID = $(`.itembox a:eq(${childNumber})`).attr(`href`);
        itemID = itemID.substring( 28 );
        console.log(itemID)
        $(`body`).append(`<iframe src="/hover_item.php?itemid=${itemID}" id="iframe${itemID}"></iframe>`);

        $(`#iframe${itemID}`).on("load", function () {

            // get the price from the iframe
            var iframeContents = $(`#iframe${itemID}`).contents().text().replace(/,/g, '');

            var iframeName = $(`#iframe${itemID}`).contents().find(`h5.ui.dividing.header`).text();

            var recentPrice = parseInt (iframeContents.substring(
                iframeContents.lastIndexOf(`Recent Price: `) + 14,
                iframeContents.lastIndexOf(`Account Search`)
            ));

            $(`h1:contains("Regular Items")`).after(`
<br>${iframeName}: ${recentPrice}`)

            if ( childNumber <= totalPawnItems ) {
                console.log(22222)
                cheapestPawn(childNumber + 1)
            }
        });

    }
    cheapestPawn(5)

}
if ( window.location.href.includes(`/explore/fragmentizer.php`) && $(`body:contains('The fragmentizer makes strange noises, and here is the result:')`).length > 0 ) {
    window.location.href = `/explore/major_drills.php`;
}

if ( window.location.href.includes(`/explore/pawn.php/sell_item/`) && $(`body:contains('Thanks for the item! Here is your ')`).length > 0 ) {
    window.location.href = `/explore/major_drills.php`;
}
if ( window.location.href.includes(`/games/potion_lottery.php`) && $(`body:contains('tickets have been sold for today's drawing.')`).length > 0
   && potion == true ) {
    $(`input.btn.btn-primary[value="Buy a Single Ticket (500 sP)"]`).click();
}
if ( window.location.href.includes(`/games/potion_lottery.php?act=purchase`) && $(`body:contains('Thanks for purchasing a Angelic Potion ticket!')`).length > 0 ) {
    window.location.href = `/explore/major_drills.php`;
}
if ( window.location.href.includes(`/explore/gifts.php/choose/random`) && $(`body:contains('You sent these items to your friend ')`).length > 0 ) {
    window.location.href = `/explore/major_drills.php`;
}

// charity
if ( window.location.href.includes(`/explore/freefood.php?act=donate`) ) {
    if (  $(`body:contains('Thank you so much! Why, I could just hug you right now. In fact, I think I will!')`).length > 0 ) {
        window.location.href = `/explore/major_drills.php`;
    }
    else if ( $(`body:contains('Oh, you want to donate? We'll take any of these items!')`).length > 0 ) {


        $(`p:contains("Oh, you want to donate? We'll take any of these items!")`).after(`<div id="cheapFood">
<div id="charityButton" class="ui button small">Generate food price list</div>
</div>`)

        var totalFoodItems = $(`.col-12.text-center a`).length - 2;

        function cheapestFood ( childNumber ) {
            var itemID = $(`.col-12.text-center a:eq(${childNumber})`).attr(`href`);
            itemID = itemID.substring(
                itemID.lastIndexOf(`?act=donate&itemid=`) + 19
            );
            $(`body`).append(`<iframe src="/hover_item.php?itemid=${itemID}" id="iframe${itemID}"></iframe>`);

            $(`#iframe${itemID}`).on("load", function () {

                // get the price from the iframe
                var iframeContents = $(`#iframe${itemID}`).contents().text().replace(/,/g, '');

                var iframeName = $(`#iframe${itemID}`).contents().find(`h5.ui.dividing.header`).text();

                var recentPrice = parseInt (iframeContents.substring(
                    iframeContents.lastIndexOf(`Recent Price: `) + 14,
                    iframeContents.lastIndexOf(`Account Search`)
                ));

                $(`p:contains("Oh, you want to donate? We'll take any of these items!")`).append(`
<br>${iframeName}: ${recentPrice}`)

                if ( childNumber < totalFoodItems ) {
                    cheapestFood(childNumber + 1)
                }
            });

        }
        $(`#charityButton`).click( function() {
            cheapestFood(1)
        });

    }
}

if ( window.location.href.includes(`/explore/asmodeus.php`) && $(`body:contains('You created a')`).length > 0 ) {
    window.location.href = `/explore/major_drills.php`;
}

if (window.location.href.includes("/inventory.php") && feedItem !== 0) {
    $(`.two.wide.column.text_center:contains('${feedItem}')`).attr("style","border: 10px solid red;")
    window.location.href = $(`.two.wide.column.text_center:contains('${feedItem}')`).find(`a`).attr(`href`)
}
if (window.location.href.includes("/inventory.php") && playWith !== 0) {
    $(`.two.wide.column.text_center:contains('${playWith}')`).attr("style","border: 10px solid red;")
    console.log($(`.two.wide.column.text_center:contains('${playWith}')`))
    console.log($(`.two.wide.column.text_center:contains('${playWith}')`).find(`a`))
    console.log($(`.two.wide.column.text_center:contains('${playWith}')`).find(`a`).attr(`href`))
 //   window.location.href = $(`.two.wide.column.text_center:contains('${playWith}')`).find(`a`).attr(`href`)
}
if (window.location.href.includes("/item.php?itemid=")
    && window.location.href.includes("&act=food&petid=")
    && $(`h3.card-title`) == feedItem ) {
    window.location.href = `/explore/major_drills.php`;
}
if (window.location.href.includes("/item.php?itemid=")
    && window.location.href.includes("&act=toy&petid=")
    && $(`h3.card-title`) == playWith ) {
    window.location.href = `/explore/major_drills.php`;

}



if ( window.location.href.includes(`/explore/festival/goat.php?act=feed`) ) {
    window.location.href = `/explore/major_drills.php`;
}
if (window.location.href.includes(`/explore/survivor_memorial.php?act=kiss`) ) {
    window.location.href = `/explore/major_drills.php`;
}

if (window.location.href.includes("/shop.php?shopid=24") ) {
    $(`h1`).after(`<a href="/explore/freefood.php?act=donate">Charity</a>`)
}
if (window.location.href.includes("/games/seashell_spotter.php") ) {

    if ( ($('body:contains("Your current daily win streak is ")').length > 0) && ($('body:contains("for selecting the right seashell!")').length > 0) ) {
        window.location.href = `/explore/major_drills.php`;
    }

}

if (window.location.href.includes("/explore/farmers_market.php?act=minion") ) {
    if ($(`i:contains("Could you spare a ")`).length > 0) {

        // if you already have bought the item
        if ( haveItems == autumnWant  && autumnWant !== 0) {
            console.log(`${haveItems} == ${autumnWant}`);
            GM_setValue('haveItemsKey',0);

            $(`input.btn.btn-success`).click()

        }
        else {
            autumnWant = $(`i:contains("Could you spare a ") b`).text();
            GM_setValue('autumnWantKey',autumnWant);

            window.location.href = $(`button.btn.btn-outline.btn-info`).parent().attr("href");
        }
    }
    else if ( $(`body:contains("Oh my! That certainly helped!")`).length > 0 ) {
        window.location.href = "/explore/major_drills.php";
    }
}

// TRAPPED MINIONS
if (window.location.href.includes("/explore/trapped.php?act=feed&id=") &&
    $(`body:contains("Thank you for volunteering to feed these starving minions. Hopefully their rescue pod will arrive soon!")`).length > 0 ) {
    GM_setValue('haveItemsKey',"");
    window.location.href = "/explore/trapped.php"
}
if (window.location.href.includes("/explore/trapped.php") ) {
    console.log(`minionAmount: ${minionAmount}`);

    $(`.eleven.wide.column`).after(`
<style>
.cheapMinionFood {
color:red;
}
</style>
`)
    var feedableMinions = $(".container-fluid tr td").length;
    console.log(`feedableMinions: ${feedableMinions}`);


    // if you already have bought the item
    if ( haveItems == minionItem) {
        console.log(`${haveItems} == ${minionItem}`)
        window.location.href = $(`img[alt="${minionItem}"]`).parent().parent().parent().attr("href")
        GM_setValue('haveItemsKey',"none");
    }
    else {

        var possibleFoodArray = []
        // put all possible foods into an array
        $(`.container-fluid tr td .test .wl_item`).each( function() {
            var itemID = $(this).attr(`data-itemid`);
            possibleFoodArray.push(itemID)
        });

        // loop through possible foods until you find an affordable food

        var i = 0;
        function findCheapFood ( foodID ) {
            $(`body`).append(`<iframe src="/hover_item.php?itemid=${foodID}" id="iframe${foodID}"></iframe>`);
            $(`#iframe${foodID}`).on("load", function () {

                minionItem = $(`#iframe${foodID}`).contents().find(`h5.ui.dividing.header`).text();

                // get the price from the iframe
                var iframeContents = $(`#iframe${foodID}`).contents().text().replace(/,/g, '');

                var recentPrice = parseInt (iframeContents.substring(
                    iframeContents.lastIndexOf(`Recent Price: `) + 14,
                    iframeContents.lastIndexOf(`Account Search`)
                ));

                GM_setValue('minionItemKey',minionItem);
                console.log(minionItem)
                console.log(recentPrice)

                if ( recentPrice < maxMinionFeedPrice ) {
                    $(`#minionFeeder`).append(`
<div class="cheapMinionFood">
${minionItem} costs ${recentPrice}.
<br>
<a href="/user_shops.php/search/shops/${minionItem}">Shop search</a>
</div>`)
                    GM_setValue('minionItemKey',minionItem);
                }
                else {
                    i++
                    findCheapFood ( possibleFoodArray[i] )
                }
            });
        }
        setTimeout( function() {
            findCheapFood ( possibleFoodArray[0] )
        }, 1000)
    }
}

if ( autumnWant !== 0 ) { shopSearchBuy ( autumnWant, `/explore/farmers_market.php?act=minion` ) }
if ( minionItem !== 0 ) { shopSearchBuy ( minionItem, `/explore/trapped.php` ) }
if ( feedItem !== 0 ) { shopSearchBuy ( feedItem, `/inventory.php` ) }
if ( playWith !== 0 ) { shopSearchBuy ( playWith, `/inventory.php` ) }


if (window.location.href.includes("/shop.php?shopid=") ) {

    if ( $(`h1:contains('Purchased ${minionItem}')`).length > 0 ) {
        GM_setValue('haveItemsKey',minionItem);
        console.log(`you have the major drills item`)
        window.location.href = `/explore/trapped.php`;
    }
    else if ( $(`h1:contains('Purchased ${autumnWant}')`).length > 0 ) {
        GM_setValue('haveItemsKey',autumnWant);
        console.log(`you have the major drills item`)
        window.location.href = `/explore/farmers_market.php?act=minion`;
    }
    else if ( $(`h1:contains('Purchased ${feedItem}')`).length > 0 ) {
        GM_setValue('haveItemsKey',feedItem);
        console.log(`you have the major drills item`)
        window.location.href = `/inventory.php`;
    }
    else if ( $(`h1:contains('Purchased ${playWith}')`).length > 0 ) {
        GM_setValue('haveItemsKey',playWith);
        console.log(`you have the major drills item`)
        window.location.href = `/inventory.php`;
    }
    // restcok quest
    else if ( $(`h1:contains('Purchased')`).length > 0 && restockFromQuest == true ) {
        GM_setValue('restockFromQuestKey',false);
        window.location.href = `/explore/major_drills.php`;
    }
}

if (window.location.href.includes("/explore/mystery_box.php") ) {
    var mysteryPrice = parseInt ( $(`div[style="width: 80%; margin: auto; text-align: center"] p:contains('Price')`).text().replace(/,/g, '').replace(/Price:/g, '') );
    console.log(mysteryPrice);
    if ( mysteryPrice < 3000 ) {
        window.location.href = "/explore/mystery_box.php?act=buy"
    }
}
if (window.location.href.includes("/games/slots.php") ) {
    if ( $(`h1:contains("Winner winner, chicken dinner!")`).next().next().text() == `You won the book "The Slots!"`
       && slotsRequirement == "book" ) {
        window.location.href = "/explore/major_drills.php";
    }
}


if (window.location.href.includes("/explore/asmodeus.php") ) {
    $(`td[width="20%"] center label:contains("${asmodeus1}"):first`).find(`input[type="checkbox"]`).prop('checked', true);
    $(`td[width="20%"] center label:contains("${asmodeus2}"):first`).find(`input[type="checkbox"]`).prop('checked', true);


    $(`td[width="20%"] center label:contains("${asmodeus1}"):first`).attr("style","border:10px solid red")
    $(`td[width="20%"] center label:contains("${asmodeus2}"):first`).attr("style","border:10px solid red")

    if ( $(`td[width="20%"] center label:contains("${asmodeus1}"):first`).length > 0
        && $(`td[width="20%"] center label:contains("${asmodeus2}"):first`).length > 0 ) {
        $(`input.ui.blue.button[value="Combine those molecules!"]`).click()
    }
}

if (window.location.href.includes("/explore/recycle_beast.php?act=items") ) {
    function convertEachItem ( childNumber ) {
        var itemID = $(`.p-2.col-md-4.col-lg-4.text_center:nth-child(${childNumber}) a`).attr(`href`);
        itemID= iframeContents.substring(
            iframeContents.lastIndexOf(`?act=give_item&itemid=`) + 22
        );
        $(`body`).append(`<iframe src="/hover_item.php?itemid=${itemID}" id="iframe${itemID}"></iframe>`);

        $(`#iframe${itemID}`).on("load", function () {

            minionItem = $(`#iframe${itemID}`).contents().find(`h5.ui.dividing.header`).text();

            // get the price from the iframe
            var iframeContents = $(`#iframe${itemID}`).contents().text().replace(/,/g, '');

            var recentPrice = parseInt (iframeContents.substring(
                iframeContents.lastIndexOf(`Recent Price: `) + 14,
                iframeContents.lastIndexOf(`Account Search`)
            ));

            GM_setValue('minionItemKey',minionItem);
            console.log(minionItem)
            console.log(recentPrice)
            if ( recentPrice < 5000 ) {
                // window.location.href = `/user_shops.php/search/shops/${minionItem}`
            } else {
                convertEachItem(childNumber + 1)
            }
        });

    }
    convertEachItem(1)
}



if (window.location.href.includes("/shop.php?shopid=") ) {

    // not purchased yet
    var priceItemObject = {};
    $(`.two.wide.column`).each( function() {
        var itemName =  $(this).find(`form[method="post"]`)
        .clone()    //clone the element
        .children() //select all the children
        .remove()   //remove all the children
        .end()  //again go back to selected element
        .text().replace(/(\r\n|\n|\r)/gm,"");
        //         console.log(itemName);
        var price = parseInt ( $(this).find(`font[style="font-size:10px;"] b`).text().replace(",","").replace(" sP","") );
        //         console.log(price);

        priceItemObject[itemName] = {};
        priceItemObject[itemName] = price;
        //         console.log(priceItemObject)
    });


    // get cheapest item
    // https://stackoverflow.com/questions/11142884/fast-way-to-get-the-min-max-values-among-properties-of-object
    let arr = Object.values(priceItemObject);
    let min = Math.min(...arr);
    let max = Math.max(...arr);

    $(`h1:first`).append(`<br>Min value: ${min}` );


    if ( restockFromQuest == true ) {

        for (var key in priceItemObject) {
            if ( priceItemObject[key] == min ) {
                console.log(key)
                var cheapestItemName = key;
                $(`.two.wide.column[style="margin-top:0.4rem; margin-bottom:0.4rem;"]:contains('${cheapestItemName}')`).find(`input[type="image"]`).click();

                questLog =+ `Bought ${cheapestItemName} for ${min}`
                GM_setValue('questLogKey',questLog);
            }
        }

    }
}


