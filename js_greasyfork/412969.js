// ==UserScript==
// @name         Subeta: Auto Dailies
// @namespace    https://greasyfork.org/en/users/145271-aybecee
// @version      0.1.7
// @description  try to take over the world!
// @author       AyBeCee
// @match        https://subeta.net/*
// @require      https://code.jquery.com/jquery-1.7.1.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/412969/Subeta%3A%20Auto%20Dailies.user.js
// @updateURL https://update.greasyfork.org/scripts/412969/Subeta%3A%20Auto%20Dailies.meta.js
// ==/UserScript==

Notification.requestPermission();
if ( $(`#cf-wrapper`).length > 0 ) {
    location.reload();
}
var SeashellURLKey;
var SeashellURL = GM_getValue('SeashellURLKey', 0);
var seashellKey;
var seashell = GM_getValue('seashellKey', 0);

var ringTossKey;
var ringToss = GM_getValue('ringTossKey', 0);

var decanterKey;
var decanter = GM_getValue('decanterKey', 0);

var donationKey;
var donation = GM_getValue('donationKey', 0);

var fishingKey;
var fishing = GM_getValue('fishingKey', 0);

var cryptKey;
var crypt = GM_getValue('cryptKey', 0);

var iceFieldsKey;
var iceFields = GM_getValue('iceFieldsKey', 0);

var trashKey;
var trash = GM_getValue('trashKey', 0);

var mallarchyKey;
var mallarchy = GM_getValue('mallarchyKey', 0);

var itemName;
var currentTime = $('#menu-time').text();

var autoDailiesKey;
var autoDailies = GM_getValue('autoDailiesKey', 0);

function wait() {
    return Math.floor(Math.random() * 1001) + 1000;
}
//  return Math.floor(Math.random() * (max - min + 1)) + min;

function logHistory ( container, prizename, notKey ) {
    $(container).append(`<br>
<div style="padding: 15px; border-radius: 15px; box-shadow: 2px 2px 2px #d3d3d3; display: inline-block; margin-left: 25px; background: #e3e3e3;">
<div style="font-size: 20px; text-transform: uppercase; font-weight: bold; margin-bottom: 10px;color:red;">Auto Dailies Script</div>
<div id="${prizename}Log">${notKey}</div>
<br><div id="clear${prizename}" class="ui button">Clear history</div>
</div>`)
    $(`#clear${prizename}`).click( function() {
        GM_setValue(`${prizename}Key`, "");
        $(`#${prizename}Log`).hide();
    });
}

function deleteEvent ( containsText ) {
    $(`.sidebar-event small:contains("${containsText}")`).parent().find(`i.ban.circle.icon.small.event-remove`).click();
}


$(`#sidebar-top`).after(`
<div id="dailiesHelper">
<div id="dailiesButton" class="ui button">Start dailies</div>
<br>
 <input type="checkbox" id="nextDaily" name="nextDaily">
  <label for="nextDaily">Auto next daily</label>
<div id="savedFade2">Saved</div>
</div>
<style>
#dailiesHelper {
padding: 5px; margin: 5px; background: #e4e5bc; border: 1px solid #95a446;
}
#savedFade2 {
    text-align: center;
    color: #ffffff;
    background: #4CAF50;
    padding: 2px 8px;
display:none;
margin-top:5px;
}
</style>`)

function flashySaved () {
    $("#savedFade2").fadeIn(500);
    setTimeout(function(){
        $("#savedFade2").fadeOut(500);
    }, 1000);
}

$(`#dailiesButton`).click( function() {
    window.location.href = "/explore/rift/index.php";
});
$('#nextDaily').change(function() {
    if ( $('#nextDaily:checked').length > 0 ) {
        GM_setValue('autoDailiesKey',true);
    } else {
        GM_setValue('autoDailiesKey',false);
    }

    flashySaved ()
});
// for default form display
if ( autoDailies == true ) {
    $('#nextDaily').prop('checked', true);
}

$(`i[x-ev-group="Achievements"]`).parent().parent().append(`
<a href="https://subeta.net/forums.php/read/906552/Whats-your-Newest-Achievement-V3/76/#64857168">Public</a>
`)
$(`#sidebar-inner-events`).append(`
<center><div id="deleteAll" class="ui button">Delete all events</div></center>`)

$(`#deleteAll`).click( function() {
    $(`i.circular.white.icon.trash.event-remove-cat`).click();
});



// Bathhouse
if (window.location.href.includes("/explore/shengui_guo/bathhouse/pools.php") && $("a:contains('Take a Dip!')").length > 0) {
    window.location.href = $("a:contains('Take a Dip!')").attr("href");
};
if (window.location.href.includes("/explore/shengui_guo/bathhouse/pools.php?act=dip") && ( autoDailies == true ) ) {
    window.location.href = "/explore/hustler.php";
};



///// CODA CAVES
if ($(`.x-js-widget-codacave:contains('Dig in the Coda Caves.')`).length > 0) {
    //  window.open('https://subeta.net/explore/codacaves.php', '_blank');
    //  new Notification("Dig in the Coda Caves!");
}
if (window.location.href.includes("/explore/codacaves.php")) {
    if ($(`body:contains("I suppose you should try and find something useful while you're breathing all of our air..")`).length > 0) {
        // Returns a random number between min (inclusive) and max (exclusive)
        // random number between 1 and 13, inclusive
        var randoNum = Math.random() * 13 + 1;
        console.log(randoNum)
        window.location.href = `https://subeta.net/explore/codacaves.php?act=dig&spot=${randoNum}`
    }
    else if ($(`body:contains("Thank you for helping. While digging you found")`).length > 0) {
        window.location.href = $(`a:contains('Make an Alert')`).attr("href")
    }
};



// CRYPTS
if (window.location.href.includes("/explore/crypts.php")) {
    logHistory ( `center[style="width: 600px; margin: auto;"]`, 'crypt', crypt )

    if ($('body:contains("You take a wrong turn into a dead end")').length > 0 || $('body:contains("stumble back upon the entrance")').length > 0 || $('body:contains("Blake at the beginning. He shrugs bemusedly.")').length > 0) {
        // finished the game

        deleteEvent ( "The Crypts" )

        var newCrypt = `<br>${currentTime}: Nothing`
        console.log(newCrypt);
        crypt += newCrypt
        GM_setValue('cryptKey', crypt);

        window.location.href = $("a:contains('Set Alert')").attr("href");

    } else if ($('body:contains("Oh, and watch out for booby traps. I mentioned those, right?")').length > 0) {
        // starting the game
        window.location.href = "?act=start";

    } else if ($('body:contains("If you want to back out now, you will get")').length > 0) {
        // during the game

        $('map[name="crypts_map"] area:first').click();

    } else if ($('body:contains("You have already played in the past hour.")').length > 0) {
        // during the cooldown

        deleteEvent ( "The Crypts" )

        var refreshTime;
        refreshTime = parseInt($(`.container-fluid center b`).text()) + 1;
        console.log(refreshTime)

        setTimeout(function () {
            window.location.href = "/explore/crypts.php";
        }, refreshTime * 60000);
    }
};



// Decanter of Indestructibility

if (window.location.href.includes("/games/decanter.php")) {

    // append winnings history
    logHistory ( `.card-body:first`, 'decanter', decanter )


    if ($(`input[value='I Will Try (Costs: 500 sP)'`).length > 0) {
        // start the game
        $(`input[value='I Will Try (Costs: 500 sP)'`).click();
    }

    else if ($('body:contains("You may play again")').length > 0 && $('a:contains("Set Alert")').length > 0) {
        // finished the game
        console.log("what did you win?");

        // item name
        var prizeName = $(".col-12.col-sm-10.col-md-8.col-lg-6.mx-auto.p-3 .wl_item.non_wishlist img").attr("alt");
        $(`.wl_item.non_wishlist`).after(`<br>[item=${prizeName}]<br>`);


        var newWinnings = `<br>${currentTime}: ${prizeName}`
        console.log(newWinnings);
        decanter += newWinnings
        GM_setValue('decanterKey', decanter);

        window.location.href = $('a:contains("Set Alert")').attr("href");

    }
    else if (!$('body:contains("You may play again")').length > 0) {
        // in the midst of the game

        console.log("pick an ingredient");
        // put ingredients into an array
        var ingredientsArray = [];
        $(".col.p-2.text-center a").each(function (index) {
            ingredientsArray.push($(this).attr("href"));
        });
        // get number of ingredients
        console.log(ingredientsArray.length);

        // randomise and pick an ingredient
        window.location.href = "?act=" + Math.floor((Math.random() * ingredientsArray.length) + 1);
    }
    else {
        // cooldown period for next game
        refreshTime = $(`.card-body b:contains('You may play again in ')`).text();
        var minutes = parseInt(refreshTime.substring(refreshTime.lastIndexOf(" min") - 2, refreshTime.lastIndexOf(" min")));
        console.log(`refreshing in ${(minutes + 1) * 60000} milliseconds`)


        deleteEvent ( "You can play Decanter of Indestructibility again!" )

        setTimeout(function () {
            window.location.href = "/games/decanter.php";
        }, (minutes + 1) * 60000);
    }

};

// DARA
if (window.location.href.includes("/explore/shengui_guo/dara.php") ) {

    if ( $(`a[href="?act=interact"]`).length > 0 ) {
        window.location.href = "?act=interact"
    } else {
        new Notification (`fin dailyes`)
    }

}

// Donation Corner
if (window.location.href.includes("/explore/donation.php") ) {
    logHistory ( `.container-fluid center`, 'donation', donation )

    var secondBold = $(`.container-fluid center b`).eq(1).html();

    if ( $(`.container-fluid center:contains('You can receive another item in')`).length > 0 ) {
        var donationCooldown = parseInt(secondBold) * 60000;
        console.log(`refreshing in ${donationCooldown}ms`)
        setTimeout ( function() {
            window.location.href = "/explore/donation.php"
        }, donationCooldown );
    }

    else if ( window.location.href.includes("?item=") && $(`.container-fluid center:contains('You receive')`).length > 0 ) {

        secondBold = `${currentTime}: ${secondBold}<br>`

        donation += secondBold
        GM_setValue('donationKey', donation);

        console.log(`refreshing in 5min`)
        // 5 minute cooldown
        setTimeout ( function() {
            window.location.href = "/explore/donation.php"
        }, 300000);
    }


    else if ( $(`table[width="100%"][colspan="4"]`).length > 0 ) {

        var allItemsArray = []

        $(`table[width="100%"][colspan="4"] td`).each( function() {
            var potentialItemURL = $(this).find(`a`).eq(0).attr("href");
            allItemsArray.push(potentialItemURL)
        });


        // randomise and pick an item
        window.location.href = allItemsArray[Math.floor(Math.random() * allItemsArray.length)];
    }
};



// Fishing

if (window.location.href.includes("/games/fishing.php")) {
    logHistory ( '.container-fluid center:first', 'fishing', fishing )


    if ( $(`body:contains('You can play again in ')`).length > 0 ) {
        var minutesLeft = $(`.container-fluid b:contains('minute')`).text();
        minutesLeft = parseInt ( minutesLeft.substring( 0, 2 ) ) ;
        var secondsLeft = $(`.container-fluid b:contains('second')`).text();
        secondsLeft = parseInt ( secondsLeft.substring(    secondsLeft.lastIndexOf(", and ") + 6,     secondsLeft.lastIndexOf("second") ) );
        console.log(secondsLeft);

        setTimeout(function () {
            window.location.href = "/games/fishing.php";
        }, minutesLeft * 60000 + secondsLeft * 1000);
    };
    if (window.location.href.includes("?act=finish")) {
        deleteEvent ( `You can fish again!` )

        var fishingText = $('.container-fluid center').clone().children().remove().end().text()
        .replace("You Win:","")
        .replace("You were nowhere near it!","")
        .replace("How did you manage to get that far away from the treasure?","")
        .replace("If you had just gotten a little closer!","")
        .replace(" -","")

        fishing += `<b>${currentTime}:</b> ${fishingText}<br>`;
        GM_setValue('fishingKey', fishing);
        console.log ( fishing );

        window.location.href = $("a:contains('Set Alert')").attr("href");
    };
    if ( $("a:contains('Pick another spot!')").length > 0) {
        window.location.href = $("a:contains('Pick another spot!')").attr("href");
    };
    if ( $(`input[value="Start A Game"]`).length > 0) {
        $(`input[value="Start A Game"]`).click();
    };
    if (window.location.href.includes("?act=game")) {
        $(`img[src='https://img.subeta.net/fishing_map.png']`).click();
    };
}



// GARDENS
if ( window.location.href.includes("/explore/gardens.php") ) {
    if ( $('body:contains("Pick a seed that you would like to plant below.")').length > 0 )  {
        window.location.href = $(`.ui.table a:first`).attr("href")
    }
    else if ( $(`body:contains("lease return tomorrow to water it again")`).length > 0 )  {
        console.log(`can't water`)

        if  ( autoDailies == true )  {
            window.location.href = `/explore/shengui_guo/dara.php`
        };
    }
    else if ( $('body:contains("Welcome back, it seems as though your seed has matured into a plant.")').length > 0 )  {
        $(`input[value="Pick from Garden"]`).click();
    }
    else if ( $('body:contains("You receive the following plant:")').length > 0 )  {
        window.location.href = `/explore/gardens.php`
    }
    else if ( $('body:contains("Below is your current seed, choose what you would like to do.")').length > 0 )  {
        $(`input[value="Water Seed"]`).click();
    }
}


///// HUSTLER
if (window.location.href.includes("/explore/hustler.php") && !$('body:contains("Thank you for your purchase!")').length > 0) {
    window.location.href = "/explore/hustler.php?act=buy&item=1";
}
if (window.location.href.includes("/explore/hustler.php?act=buy&item=1")) {
    itemName = $(`.hover-item.tpd-delegation-uid-3`).attr("alt");
    $(`.hover-item.tpd-delegation-uid-3`).after(`[item=${itemName}]`);


    if  ( autoDailies == true )  {
        window.location.href = "/explore/job_agency.php";
    };
}


// Ice Fields
if (window.location.href.includes("/explore/ice_fields.php")) {

    logHistory ( `.container-fluid center`, 'iceFields', iceFields )

    if ($('body:contains("You have some time left before you can start exploring again!")').length > 0) {
        //  window.location.href = $("a:contains('Set Alert')").attr("href");

        // refresh every hour?
        setTimeout(function () {
            window.location.href = '/explore/ice_fields.php';
        }, 3600000 );
    } else if ($(`a[href="?move=East"]`).length > 0) {
        window.location.href = '?move=East';
    } else if ($(`a[href="?move=West"]`).length > 0) {
        window.location.href = '?move=North';
    } else if ($(`a[href="?move=North"]`).length > 0) {
        window.location.href = '?move=North';
    } else if ($(`a[href="?move=continue"]`).length > 0) {
        window.location.href = '?move=continue';
    } else if ($('body:contains("but apparently you stray too close and it lunges at you!")').length > 0 || $('body:contains("determined to be better prepared before you set out again.")').length > 0) {

        $(`div[style="width:500px; text-align:justify;"]`).text();

        iceFields += `<b>${currentTime}:</b> Nothing<br>`;
        GM_setValue('iceFieldsKey', iceFields);
        console.log ( iceFields );

        window.location.href = '/explore/ice_fields.php';
    }
};

// ITEM HUNT

var gotItemKey;
var gotItem = GM_getValue('gotItemKey', 0);
var getThisItemKey;
var getThisItem = GM_getValue('getThisItemKey', 0);

if ( window.location.href.includes("/games/hunt.php") ) {

    $(`input.btn.btn-primary.btn-lg[value*="Click to start Level"]`).click();
    if ( $(`input[value="Start Searching for Items!"]`).length > 0 ) {    // if at Start Searching for Items! page
        GM_setValue('gotItemKey', false);
        $(`input[value="Start Searching for Items!"]`).click();
    }

    if ( $(`button.btn.btn-sm.btn-danger`).length > 0 ) {    // if at item hunt request page

        var itemHuntName = $(`.scode-item-name`).text();
        GM_setValue('getThisItemKey', itemHuntName);

        if ( gotItem == true ) {
            console.log(`gotten item`)
            $(`button.btn.btn-success.btn-lg:contains("I've got the ")`).click();
        } else {
            window.location.href = `/user_shops.php/search/shops/${itemHuntName}`;
        }
    }

    else if ( $(`i:contains("Come back tomorrow to play again!")`).length > 0 && autoDailies == true) { // finished item hunt
        window.location.href = "/explore/gardens.php"
    }
    else if ( $(`body:contains("You don't have my item! Come back when you do!")`).length > 0 || $(`body:contains("Thank you for helping me! For all that work, you get:")`).length > 0 ) {
        GM_setValue('gotItemKey', false);
    }


}
if ( window.location.href.includes("/user_shops.php/search/shops/") && ( $(`strong:contains('${getThisItem}')`).length > 0 )  ){

    console.log(`buying ${getThisItem} for item hunt`)


    const UserPriceComma = $("button.btn.btn-primary.btn-sm.quick-buy:first").parent().parent().find(".three.wide.column.center.aligned:contains('sP')").html();
    const UserPricePure = parseFloat(UserPriceComma.replace(/,/g, ''));

    // if NPC shop exists
    if ( $('.row:nth-child(2) input[value="Buy"]').length > 0 ) {

        // compare NPC price and user price
        const NPCPriceComma = $('.row:nth-child(2) input[value="Buy"]').parent().parent().parent().find(".three.wide.column.center.aligned:contains('sP')").html();
        const NPCPricePure = parseFloat(NPCPriceComma.replace(/,/g, ''));

        if ( NPCPricePure < UserPricePure ) {
            console.log(NPCPricePure + " < " + UserPricePure + ". Buying from NPC shop.");

            $('.row:nth-child(2) input[value="Buy"]').click();

        } else {
            console.log(NPCPricePure + " > " + UserPricePure + ". Buying from User shop.");

            $("button.btn.btn-primary.btn-sm.quick-buy:first").click();
            GM_setValue('gotItemKey', true);
            window.location.href = `/games/hunt.php`;
        }


    } else {
        $("button.btn.btn-primary.btn-sm.quick-buy:first").click();
        GM_setValue('gotItemKey', true);
        window.location.href = `/games/hunt.php`;
    }
}
if ( window.location.href.includes("/shop.php?shopid=") && ( $(`h1:contains('${getThisItem}')`).length > 0 )  ){
    GM_setValue('gotItemKey', true);
    window.location.href = `/games/hunt.php`;
}

// item scramble
if ( window.location.href.includes("/games/scramble.php")   ){

    if ( $(`[value="Guess!"]`).length > 0 ) {
        $(`input[type="text"][placeholder="Unscrambled Item Name"]`).each( function() {
            var scrambleID = $(this).attr("name");
            scrambleID = scrambleID.substring(
                scrambleID.lastIndexOf("[") + 1,
                scrambleID.lastIndexOf("]")
            );
            $(`h1.dividing.header`).append(`<iframe src="/hover_item.php?itemid=${scrambleID}" id="iframe${scrambleID}"></iframe>`);
            $(`#iframe${scrambleID}`).on("load", function () {
                // get the name from the iframe
                var iframeName = $(`#iframe${scrambleID}`).contents().find(`h5.ui.dividing.header`).text();
                console.log(iframeName);
                $(`input[name="uguess[${scrambleID}]"]`).val(iframeName)
                //          $(`[value="Guess!"]`).click();
            })
        });
    }
    else if ( $(`body:contains('Congratulations, you win!')`) && ( $(`a.ui.button.blue:contains('Next Round')`).length > 0 ) ) {
        console.log(`next round?`)
        window.location.href = "?act=play"
    }
}




// JOB AGENCY
if (window.location.href.includes("/explore/job_agency.php")) {
    $(`a:contains('Collect Income')`).each( function() {
        window.open( $(this).attr("href") , '_blank')
    } )

    if (window.location.href.includes("&view=collect")) {
        window.top.close();
    }
}
if (window.location.href.includes("/explore/job_agency.php") && ! window.location.href.includes("&view=collect") ) {
    if ( autoDailies == true) {
        setTimeout( function() {
            window.location.href = "/games/mind_reader.php";
        }, 1000);
    }

}





// Mallarchy Pond

if (window.location.href.includes("/explore/carnival_mallarchypond.php")) {

    logHistory ( `.container-fluid center`, 'mallarchy', mallarchy )

    if ($(`b:contains("Your Mallarchy")`).length > 0) {
        // finished game
        // stop if finished 1st place
        if (!$(`img[src="https://img.subeta.net/game_mallarchypond_duck_red.png"]`).length > 0) {
            //        window.location.href = $(`a:contains('Set Alert)`).attr("href")
            var mallarchyPrize = $(`.container-fluid center`).html();
            mallarchyPrize = mallarchyPrize.substring(
                mallarchyPrize.lastIndexOf("<b>You Win</b>") + 19,
                mallarchyPrize.lastIndexOf(`<a href="carnival_mallarchypond.php">Back</a>`) - 4
            );
            mallarchy += `<b>${currentTime}:</b> ${mallarchyPrize}`;
            GM_setValue('mallarchyKey', mallarchy);
            console.log ( mallarchy );

            // refresh in 12 minutes
            setTimeout(function(){
                window.location.href = "/explore/carnival_mallarchypond.php"
            }, 720000 );
        }
    }
    else if ( !$(`body:contains("You've already played recently. Come back later!")`).length > 0 ) {
        // starting game
        var random25 = Math.floor(Math.random() * 25 + 1);
        console.log(random25);
        window.location.href = `https://subeta.net/explore/carnival_mallarchypond.php?duck=${random25}`

        // delete event
        $(`.sidebar-event small:contains("You can pick another mallarchy from the pond!")`).parent().find(`i.ban.circle.icon.small.event-remove`).click();
    }
}


// Mind Reader

if (window.location.href.includes("/games/mind_reader.php")) {

    if ($('body:contains("So are you ready to play?")').length > 0) {
        window.location.href = "?action=start_game";
    }
    else if ($('body:contains("You are moving up to")').length > 0) {
        window.location.href = "/games/mind_reader.php";
    }
    else if ($(`.container-fluid:contains("Round: ")`).length > 0) {
        window.location.href = $('.container-fluid table td:first a').attr("href");
    }
    else if ($('.container-fluid:contains("Would you like to start a new game?")').length > 0) {
        window.location.href = "?action=start_game";
    }
    else if ($('.container-fluid:contains("Play again tomorrow!")').length > 0 && ( autoDailies == true ) ) {
        window.location.href = "/games/hunt.php";
    }
};



// Rift
if (window.location.href.includes("/explore/rift/index.php")) {
    if (window.location.href.includes("?in=sP")) {
        $(`input.form-control.col-sm-3.col-md-2.d-inline-block`).val(250000)
        $(`[value="Toss in the sP!"]`).click()
    }
    else if ( autoDailies == true) {        // finish rift toss
        if ($('body:contains("You toss")').length > 0 || $('body:contains("bravely steps into the Rift")').length > 0 || $('body:contains("You may only visit the Rift once per day.")').length > 0) {
            // finish rift toss
            window.location.href = "/explore/carnival/ruffie_raffle.php";
        }
    }
}


// RING TOSS
if (window.location.href.includes("/explore/carnival_ringtoss.php")) {
    //  window.location.href = "/explore/carnival_ringtoss.php?227,149"
};

// Rock, Paper, Scissors
if (window.location.href.includes("/games/rps.php")) {

    // https://stackoverflow.com/questions/4550505/getting-a-random-value-from-a-javascript-array
    // pick a random choice
    const randomOptions = ["r", "p", "s"];
    const randomPick = Math.floor(Math.random() * randomOptions.length);

    if ($('body:contains("Make Your Choice")').length > 0) {
        window.location.href = "?act=choose&c=" + randomOptions[randomPick];
    }
    if (window.location.href.includes("/games/rps.php?act=choose&c=")) {
        $('input[value="Play Again"]').click()
    };

};

// Ruffie Raffle
if (window.location.href.includes("/explore/carnival/ruffie_raffle.php")) {
    var random6 = Math.floor((Math.random() * 6) + 1);
    $(`#choices .col-6.col-md-4.rr-ticket:nth-child(${random6})`).click();


    if ( autoDailies == true) {
        setTimeout( function() {
            if ($('body:contains("Make sure to come back tomorrow to see what else you win!")').length > 0 || $(`body:contains("You've already selected a ticket for today. Come back tomorrow!")`).length > 0 ) {
                // finish raffle
                window.location.href = "/explore/tree.php";
            }
        }, 2000);
    }
}


// Seashell spotter
if (window.location.href.includes("/games/seashell_spotter.php")) {

    logHistory ( '.container-fluid center', 'seashell', seashell )

    if ($('body:contains("This beach is full of shells from all kinds of species of mollusk!")').length > 0) {
        console.log("starting Seashell spotter");

        window.location.href = `?start=true`;
    }

    // delay between 10 seconds and 5 seconds to simulate memorisation
    setTimeout(function () {
        if ($('body:contains("You are looking for this shell in the sand:")').length > 0) {
            const seashellImage = $(".container-fluid center div:eq(1)").css("background-image");

            // get the number of the seashellImage
            var seashellNumber = seashellImage.substring(seashellImage.length - 7, seashellImage.length - 6);

            GM_setValue('SeashellURLKey', seashellNumber);

            console.log("memorising seashell " + seashellNumber);
            window.location.href = `/games/seashell_spotter.php`;

        }
    }, 0);
    //  return Math.floor(Math.random() * (max - min + 1)) + min;

    // delay between 10 seconds and 5 seconds to simulate looking for the shell
    setTimeout(function () {
        if ($('body:contains("Do you see the shell anywhere in the sand?")').length > 0) {
            console.log("go to seashell " + SeashellURL);

            window.location.href = `?guess=${SeashellURL}`;
        }
    }, 0 );
    //  return Math.floor(Math.random() * (max - min + 1)) + min;


    if ( ($('body:contains("Your current daily win streak is ")').length > 0) && ($('body:contains("for selecting the right seashell!")').length > 0) ) {
        console.log("restarting game ");

        var seashellText = $('.container-fluid center').clone().children().remove().end().html();

        var seashellSP = seashellText.substring(
            seashellText.lastIndexOf("You receive ") + 12,
            seashellText.lastIndexOf(" sP for selecting the right seashell!")
        );

        seashellSP = parseFloat(seashellSP.replace(/,/g, ''));

        seashell += seashellSP;
        GM_setValue('seashellKey', seashellSP);

        window.location.href = `/games/seashell_spotter.php`;
    }
};

// Trash Can
if (window.location.href.includes("/explore/trash_can.php")) {
    $('input[value="Look inside the Trash Can"]').click();

    logHistory ( `.col-md-10.col-lg-6.mx-auto.text-center`, `trash`, trash )

};
if (window.location.href.includes("/explore/trash_can.php?act=look")) {
    var trashText = $(`.col-md-10.col-lg-6.mx-auto.text-center`).text();
    var trashTextFixed = trashText.substring(
        trashText.lastIndexOf("Trash Can") + 9,
        trashText.lastIndexOf("Back to the Park")
    );
    trash += `<b>${currentTime}:</b> ${trashTextFixed}<br>`;
    GM_setValue('trashKey', trash);
    console.log ( trash );

    // refresh in 30 mins
    setTimeout(function(){ location.reload() }, 1800000);
};


// Tree
if (window.location.href.includes("/explore/tree.php")) {
    $("input[value='Pick something from Ikumoradeekanox']").click()
};

if (window.location.href.includes("/explore/tree.php?act=take")) {

    if ( autoDailies == true) {
        window.location.href = "/explore/shengui_guo/bathhouse/pools.php";
    }

};


// Underground Spring

if (window.location.href.includes("/explore/underground/fishing.php") && !$(`img[src="//img.subeta.net/npc_zombie_benjamin.png"]`).length > 0) {
    window.location.href = $(`map[name="spring_map"] area[shape="circle"]:first`).attr("href");

} else if ($(`img[src="//img.subeta.net/npc_zombie_benjamin.png"]`).length > 0) {
    // item name
    var prizeName1 = $(".container-fluid .wl_item.non_wishlist img").attr("alt");
    $(`.wl_item.non_wishlist`).after(`<br><a href="https://subeta.net/forums.php/read/911898/Underground-Spring-what-did-you-catch-v6/28">[item=${prizeName1}]</a>`);
}

// Vending
if (window.location.href.includes("/vending.php") ) {
    $(`.col-md-6`).prepend(`
<div style="padding: 15px; border-radius: 15px; box-shadow: 2px 2px 2px #d3d3d3; display: inline-block; margin-left: 25px; background: #e3e3e3;">
<div style="font-size: 20px; text-transform: uppercase; font-weight: bold; margin-bottom: 10px;color:red;">Vending Script</div>

  <label for="vendsLeft">Vend until how many vends left?</label>
  <input type="number" id="vendsLeft" name="vendsLeft">
<br><div id="startVend" class="ui button">Start vending</div>
`)
    $(`#startVend`).click( function() {
        var vend = setInterval( function() {
            if ( parseInt( $(`p:contains(' vends left today out of a total of ') b:nth-child(1)`).text() ) > 0 ) {
                window.location.href = $(`a.machine`).attr("href");
            } else {
                clearInterval(vend);
            }
        }, 1000);
        $(this).removeAttr('id');
    });
}
