// ==UserScript==
// @name         Subeta: Morotide Helper
// @namespace    http://tampermonkey.net/
// @version      0.1.6
// @description  try to take over the world!
// @author       AyBeCee
// @match        https://subeta.net/*
// @require      https://code.jquery.com/jquery-1.7.1.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/413784/Subeta%3A%20Morotide%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/413784/Subeta%3A%20Morotide%20Helper.meta.js
// ==/UserScript==

var currentTime = $('#menu-time').text();

var eggCooldownKey;
var eggCooldown = GM_getValue('eggCooldownKey',0);

var eggTargetKey;
var eggTarget = GM_getValue('eggTargetKey',0);

var eggORtpKey;
var eggORtp = GM_getValue('eggORtpKey',0);

var totTargetKey;
var totTarget = GM_getValue('totTargetKey',0);

var closeInventKey;
var closeInvent = GM_getValue('closeInventKey',0);

var leaveWindowOpenKey;
var leaveWindowOpen = GM_getValue('leaveWindowOpenKey',0);

var pumpkinPatchKey;
var pumpkinPatch = GM_getValue('pumpkinPatchKey',0);

var minutes;
var seconds;
var timePLUScountdown;
var reloadCountdown;

var javascriptTime = new Date().getTime();
console.log(`current time: ${javascriptTime}`);
console.log(`egg when: ${eggCooldown}`);

////////////////////////////////// start settings

var eggTimeleftNumber = eggCooldown - javascriptTime;
var min = Math.floor(eggTimeleftNumber / 60000);
var sec = ((eggTimeleftNumber % 60000) / 1000).toFixed(0);
var eggTimeleft = min + ":" + (min < 10 ? '0' : '') + sec;

function flashySaved () {
    $("#savedFade1").fadeIn(500);
    setTimeout(function(){
        $("#savedFade1").fadeOut(500);
    }, 1000);
}

$(`#sidebar-top`).after(`
<div id="moroHelper">
Egg again in ${eggTimeleft}
<br>
  <label for="eggTargetInput">Egg/TP:</label>
  <input type="text" id="eggTargetInput" name="eggTargetInput" value="${eggTarget}">
<br>
<select name="eggORtp" id="eggORtp">
  <option value=""></option>
  <option value="eggOnly">Egg only</option>
  <option value="tpOnly">TP only</option>
  <option value="randomiseEither">Randomise either</option>
</select>
<br>
  <label for="totTargetInput">ToT:</label>
  <input type="text" id="totTargetInput" name="totTargetInput" value="${totTarget}">
<br>
<div id="updateTarget" class="ui button">Update</div>
<br>
 <input type="checkbox" id="closeInvent" name="closeInvent">
  <label for="closeInvent">Close Inventory </label>
<br>
 <input type="checkbox" id="leaveWindowOpen" name="leaveWindowOpen">
  <label for="leaveWindowOpen">Leave window open</label>
<br>
<div id="savedFade1">Saved</div>
</div>
<style>
#moroHelper {
padding: 5px; margin: 5px; background: #e4e5bc; border: 1px solid #95a446;
}
#eggTargetInput, #totTargetInput{
    width: 95px;
}
#savedFade1 {
    text-align: center;
    color: #ffffff;
    background: #4CAF50;
    padding: 2px 8px;
display:none;
margin-top:5px;
}
</style>`)

$(`#updateTarget`).click( function() {
    GM_setValue('eggTargetKey', $(`#eggTargetInput`).val() );
    GM_setValue('totTargetKey', $(`#totTargetInput`).val() );


    eggORtp = $("#eggORtp option:selected").val();
    console.log(eggORtp)
    GM_setValue('eggORtpKey',eggORtp);

    flashySaved ()
});

$('#closeInvent').change(function() {
    if ( $('#closeInvent:checked').length > 0 ) {
        GM_setValue('closeInventKey',true);
    } else {
        GM_setValue('closeInventKey',false);
    }

    flashySaved ()
});

$('#leaveWindowOpen').change(function() {
    if ( $('#leaveWindowOpen:checked').length > 0 ) {
        GM_setValue('leaveWindowOpenKey',true);
    } else {
        GM_setValue('leaveWindowOpenKey',false);
    }

    flashySaved ()
});

$('#eggORtp').change(function() {
    eggORtp = $("#eggORtp option:selected").val();
    console.log(eggORtp)
    GM_setValue('eggORtpKey',eggORtp);

    flashySaved ()
});
// for default form display
if ( closeInvent == true ) {
    $('#closeInvent').prop('checked', true);
}
if ( leaveWindowOpen == true ) {
    $('#leaveWindowOpen').prop('checked', true);
}
$("select#eggORtp").val(eggORtp);

//////////////////////////////////////// end settings

// click on floating pumpkin
if ( $(`.floating_item`).length > 0 ) {
    window.open($(`.floating_item a`).attr("href"), '_blank');
}
// close page after clicking on pumpkin
if ( window.location.href.includes(`/floating.php?act=claim`) ) {
    window.top.close();
}

if ( $(`.sidebar-event small:contains("Alert: You can trick or treat again!")`).length > 0 && leaveWindowOpen == false) {
    console.log(`opening the ToT window`)
    window.open(`/users/${totTarget}`, '_blank');

    $(`.sidebar-event small:contains("Alert: You can trick or treat again!")`).parent().find(`i.ban.circle.icon.small.event-remove`).click();
}
if ( window.location.href.includes(`/users/${totTarget}`) && $(`#header_options`).length > 0 ) {
    window.location.href = $(`a:contains("Trick or Treat!")`).attr("href");
}
if ( window.location.href.includes(`/users/${eggTarget}`) && $(`#header_options`).length > 0 ) {
    if ( eggORtp == "tpOnly" ) {
        window.location.href = $(`a:contains("TP This House!")`).attr("href");
    }
    else if ( eggORtp == "eggOnly" ) {
        window.location.href = $(`a:contains("Egg This House!")`).attr("href");
    }
    else if ( eggORtp == "randomiseEither" ) {
        var random0or1 = Math.floor(Math.random() * 2);

        if ( random0or1 == 0 ) {
            window.location.href = $(`a:contains("TP This House!")`).attr("href");
        } else if ( random0or1 == 1 ) {
            window.location.href = $(`a:contains("Egg This House!")`).attr("href");
        }
    }
}



////////////////////////////// EGG vvvvvvvvvvvvvvvvvvvvv
if ( window.location.href.includes(`?act=egg`) || window.location.href.includes(`?act=tp`) ) {
    // the page has 2 different layouts, depending if you had JUST egged them or if you are in a cooldown
    if ( $(`.container-fluid center:contains('doesn't know it was you!')`).length > 0 && $(`.container-fluid center:contains('second')`).length > 0 ) {
        // JUST egged/TP page
        minutes = parseInt ( $(`.container-fluid center p b`).eq(1).text() );
        seconds = parseInt ( $(`.container-fluid center p b`).eq(2).text() );
    }
    else {
        // in a cooldown page
        minutes = parseInt ( $(`.container-fluid center b`).eq(1).text() );
        seconds = parseInt ( $(`.container-fluid center b`).eq(2).text() );
    }
    console.log(minutes)
    console.log(seconds)

    reloadCountdown = minutes * 60000 + seconds * 1000;
    // add the current time and the cooldown time
    timePLUScountdown = javascriptTime + reloadCountdown;

    GM_setValue('eggCooldownKey',timePLUScountdown);
    console.log(`new egg time: ${timePLUScountdown}`)

    if ( timePLUScountdown > 0 ) {
        // if cooldown exists
        // (sometimes the page doesn't show anything)

        if ( leaveWindowOpen == false ) {
            window.top.close();
        } else if ( leaveWindowOpen == true ) {
            console.log(`tp/Egg again in ${reloadCountdown}ms`)
            setTimeout(function(){
                window.location.href = `/users/${eggTarget}`;
            }, reloadCountdown);
        }
    } else {
        // if the page is bugged and doesn't show anything, refresh in 5 seconds
        setTimeout(function(){
            location.reload();
        }, 5000);
    }

}
if ( eggCooldown < javascriptTime  && eggCooldown !== 0 && leaveWindowOpen == false ) {
    console.log('egg cooldown finished');
    window.open(`/users/${eggTarget}`, '_blank');
    GM_setValue('eggCooldownKey',0);
}
///////////////////////////////// EGG ^^^^^^^^^^^




if ( window.location.href.includes(`/inventory.php`) && closeInvent == true) {
    window.top.close();
}





if ( window.location.href.includes(`/user_shops.php/search/shops/Uncarved+Pumpkin`) || window.location.href.includes(`/user_shops.php/search/shops/Freshly+Picked+Pumpkin`) || window.location.href.includes(`/user_shops.php/search/shops/Carving+Pumpkin`) || window.location.href.includes(`/user_shops.php/search/shops/Pumpkin+on+the+Vine`) || window.location.href.includes(`/user_shops.php/search/shops/Carvable+Pumpkin`) || window.location.href.includes(`/user_shops.php/search/shops/Ready-to-Carve+Pumpkin`) || window.location.href.includes(`/user_shops.php/search/shops/Fresh+Pumpkin`)) {
    var buyingInterval = setInterval(function(){

        var UserPriceComma = $(".ui.grid.middle.aligned.vertically.divided .row:nth-child(2)").find(".three.wide.column.center.aligned:contains('sP')").html();
        var UserPricePure = parseFloat(UserPriceComma.replace(/,/g, ''));
        console.log(UserPricePure);
        if ( UserPricePure < 5000 ) {
            $("button.btn.btn-primary.btn-sm.quick-buy:first").click();
        } else {
            clearInterval(buyingInterval);
        }

    }, 1000);

}




if ( window.location.href.includes(`quick_stock`) ) {

    $(`.ui.message.info:first`).after(`<div id="pumpkinVault" class="ui button tiny">All Pumpkin to vault and everything else to shop</div>`)
    $(`#pumpkinVault`).click( function() {

        $(`input[value="shop"]`).prop("checked", true);

        $(`input[x-itemid="148353"][value="vault"]`).prop("checked", true); // Freshly Picked Pumpkin
        $(`input[x-itemid="5236"][value="vault"]`).prop("checked", true); // Fresh Pumpkin
        $(`input[x-itemid="156653"][value="vault"]`).prop("checked", true); // Pumpkin on the Vine
        $(`input[x-itemid="175436"][value="vault"]`).prop("checked", true); // Ready-to-Carve Pumpkin
        $(`input[x-itemid="135759"][value="vault"]`).prop("checked", true); // Carving Pumpkin
        $(`input[x-itemid="166340"][value="vault"]`).prop("checked", true); // Uncarved Pumpkin
        $(`input[x-itemid="184573"][value="vault"]`).prop("checked", true); // Carvable Pumpkin
    });
}



////////////////////////////  TRICK OR TREAT PAGE
if ( window.location.href.includes(`?act=trickortreat`) ) {
    if ( $(`a:contains("Set an Alert")`).length > 0 && ( leaveWindowOpen == false ) ) {
        window.location.href = $(`a:contains("Set an Alert")`).attr("href");
    } else if ( leaveWindowOpen == false ) {
        setTimeout(function(){
            window.top.close();
        }, 1000);
    } else if ( leaveWindowOpen == true ) {



        minutes =  parseInt ( $(`.container-fluid center b`).eq(1).text() );
        seconds =  parseInt ( $(`.container-fluid center b`).eq(2).text() );
        console.log(minutes)
        console.log(seconds)

        reloadCountdown = minutes * 60000 + seconds * 1000;
        console.log(reloadCountdown);

        if ( reloadCountdown > 0 ) {
            // if cooldown exists
            // (sometimes the page doesn't show anything)

            console.log(`ToT again in ${reloadCountdown}ms`)

            setTimeout(function(){
                console.log(`/users/${totTarget}`);
                window.location.href = `/users/${totTarget}`;
            }, reloadCountdown);

        } else {
            // if the page is bugged and doesn't show anything, refresh in 5 seconds
            setTimeout(function(){
                location.reload();
            }, 5000);
        }


    }
}





if ( window.location.href.includes(`/explore/pumpkins.php`) ) {

    $(`.ui.basic.segment.center.aligned`).append(`<br>
<div style="padding: 15px; border-radius: 15px; box-shadow: 2px 2px 2px #d3d3d3; display: inline-block; margin-left: 25px; background: #e3e3e3;">
<div style="font-size: 20px; text-transform: uppercase; font-weight: bold; margin-bottom: 10px;color:red;">Auto Dailies Script</div>
<div id="pumpkinPatchLog">${pumpkinPatch}</div>
<br><div id="clearpumpkinPatch" class="ui button">Clear history</div>
</div>`)
    $(`#clearpumpkinPatch`).click( function() {
        GM_setValue(`pumpkinPatchKey`, "");
        $(`#pumpkinPatchLog`).hide();
    });



    if ( $(`a.ui.button.blue:contains('Continue to the patch')`).length > 0)  {

         window.location.href = "?act=patch";

    } else if ( $(`.ui.basic.segment.center.aligned b`).length > 0 ) {

        // delete event
        $(`.sidebar-event small:contains("You can venture into the Pumpkin Patch again!")`).parent().find(`i.ban.circle.icon.small.event-remove`).click();

        minutes =  parseInt ( $(`.ui.basic.segment.center.aligned b`).eq(2).text() );
        seconds =  parseInt ( $(`.ui.basic.segment.center.aligned b`).eq(3).text() );
        console.log(minutes)
        console.log(seconds)

        reloadCountdown = minutes * 60000 + seconds * 1000;
        console.log(reloadCountdown);
        setTimeout(function(){
            location.reload()
        }, reloadCountdown);
    }
}
if ( window.location.href.includes(`/explore/pumpkins.php?act=patch`) ) {
    if ( $(`body:contains('A few tricks and treats have been scattered around the fields for your delight and amusement')`).length > 0)  {
        // random integer between 1 - 4 (inclusive)
        var randomNumber = Math.floor(Math.random() * 4) + 1 ;
        window.location.href = "?act=pick&pick=" + randomNumber;

    }
}
if ( window.location.href.includes(`?act=pick&pick=`) ) {

    var patchPrize = $(`.scode-item-name`).text();
    pumpkinPatch += `<b>${currentTime}:</b> ${patchPrize}<br>`;
    GM_setValue('pumpkinPatchKey', pumpkinPatch);
    console.log ( pumpkinPatch );

    if ( $(`a:contains('Leave an Alert')`).length > 0 ) {
        window.location.href = $(`a:contains('Leave an Alert')`).attr("href");
    } else {
        window.location.href = `/explore/pumpkins.php`
    }

    // delete event
    $(`.sidebar-event small:contains("You can venture into the Pumpkin Patch again!")`).parent().find(`i.ban.circle.icon.small.event-remove`).click();
}