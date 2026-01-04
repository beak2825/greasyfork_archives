// ==UserScript==
// @name         TagCoins Enhancement
// @version      4.2
// @description  Enhance your TagCoins Experience!
// @author       Ko
// @icon         https://raw.githubusercontent.com/wilcooo/TagCoins-Enhancement/master/three_coins.png
// @download     https://raw.githubusercontent.com/wilcooo/TagCoins-Enhancement/master/tce.user.js
// @match        http://tagpro.lol/*
// @match        http://tagcoins.lol/*
// @supportURL   https://www.reddit.com/message/compose/?to=Wilcooo
// @website      https://redd.it/no-post-yet
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @run-at       document-idle
// @license      MIT
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @namespace https://greasyfork.org/users/152992
// @downloadURL https://update.greasyfork.org/scripts/36650/TagCoins%20Enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/36650/TagCoins%20Enhancement.meta.js
// ==/UserScript==




////////////////////////////////////////////////////////////////////////////////////////////
//     Please consinder to donate :)             Looking for the options? Scroll down!    //
////////////////////////////////////////////////////////////////////////////////////////  //
                                                                                      //  //
// This script is free to use forever! If, however, you really want to support me,    //  //
// it will be highly valued if you donated. You can do so by changing the values      //  //
// below to what is right for you.                                                    //  //
                                                                                      //  //
// change false to true if you want to activate donation                              //  //
const DONATION_ENABLED = false;                                                        //  //
                                                                                      //  //
// How often would you like to donate?                                                //  //
// 1 means   'every time you visit tagpro.lol'                                        //  //
// 0.5 means 'half of the time you visit tagpro.lol'                                  //  //
// any other value between 0 and 1 will work too                                      //  //
// choose 0 if you want your donation to only be given once                           //  //
const DONATION_FREQUENCY = 0.7 ;                                                      //  //
                                                                                      //  //
// What amount would you like to donate at a time?                                    //  //
const DONATION_AMOUNT = 3 ;                                                           //  //
                                                                                      //  //
// What should be the 'reason' of your donation?                                      //  //
const DONATION_REASON = 'Donation for the "TagCoins Enhancement" script!';            //  //
                                                                                      //  //
////////////////////////////////////////////////////////////////////////////////////////  //
//                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////////////////////
//     ### --- OPTIONS --- ###                                                            //
////////////////////////////////////////////////////////////////////////////////////////  //
                                                                                      //  //
// Show a notification whenever a transaction occurs.                                 //  //
// Also works when the browser window is minimized!                                   //  //
const NOTIFY_TRANSACTION = true;                                                      //  //
                                                                                      //  //
// Show a timestamp next to every transaction that happens *after* you opened         //  //
// or refreshed the page. (timestamps of earlier transactions are impossible to know) //  //
const SHOW_TIMESTAMP = true;                                                          //  //
                                                                                      //  //
// When on someones personal transactions overview page, clicking on his or her big   //  //
// black bouncing name will get you to the connected profile on a TagPro server       //  //
const LINK_PROFILE = true;                                                            //  //
                                                                                      //  //
// Show the transaction ID next to every transaction that occurred *after* you opened //  //
// or refreshed.                                                                      //  //
const SHOW_ID = true;                                                                 //  //
                                                                                      //  //
// Show the amount of coins everyone has next to their name!                          //  //
// The amount shown is the capital someone had *before* that transaction              //  //
// This can make the loading of the page slow, and uses some more data.               //  //
const SHOW_CAPITAL = true;                                                            //  //
                                                                                      //  //
// Update your own capital (at the top of the page) whenever you send or receive.     //  //
const UPDATE_OWN_CAPITAL = true;                                                      //  //
                                                                                      //  //
// See whenever someone buys a ticket. Normally this is hidden.                       //  //
const SPY_PURCHASES = true;                                                           //  //
                                                                                      //  //
// The number of coins gets roughly multiplied by this number.                        //  //
const MOAR_COINS = 3;                                                                 //  //
                                                                                      //  //
// Don't allow the same transaction to be send twice (without re-entering it)         //  //
// Also known as the 'double-spend bug'                                               //  //
const FIX_DOUBLE_SPEND = true;                                                        //  //
                                                                                      //  //
// Show a notification whenever the lottery info gets updated.                        //  //
// (not yet recommended because it doesn't work well yet)                             //  //
const NOTIFY_LOTTERY = false;                                                         //  //
                                                                                      //  //
// Hide the lottery statement while it's the same as it has been for a month now.     //  //
// (as of january 2018)                                                               //  //
const HIDE_LOTTERY_STATEMENT = false;                                                 //  //
                                                                                      //  //
// Replace 'for now' by 'forever' in the text on the top left, because it seems       //  //
// to be more accurate                                                                //  //
const LOTTERY_IS_DEAD = true;                                                         //  //
                                                                                      //  //
// Don't forget to save by pressing Ctrl S  (or click the save icon)                  //  //
// Got any other recomendations? Let me know!                                         //  //
                                                                                      //  //
////////////////////////////////////////////////////////////////////////////////////////  //
//                                                     ### --- END OF OPTIONS --- ###     //
////////////////////////////////////////////////////////////////////////////////////////////






//////////////////////////////////////
// SCROLL FURTHER AT YOUR OWN RISK! //
//////////////////////////////////////







console.log('START: ' + GM_info.script.name + ' (v' + GM_info.script.version + ' by ' + GM_info.script.author + ')');

// The data of each transaction (of everyone) will be sent to a sheet (at tiny.cc/tagcoins)
// This way I try to get a history of TagCoins, public to anyone!
// No personal data will be send. Check this scripts code to confirm for yourself just a bit after line 264 :)
// Please don't send false data to this URL.

const DataDropURL = 'https://script.google.com/macros/s/AKfycbznkUUI6B9nPjgU9XCBSPFdYwBqNEv3fv6nQc79YrDGZOkdhfaP/exec';


// Auto Donator: only works if DONATION_ENABLED is true.
// If you fear for your TagCoins, ask a second opinion from someone who can read
// computer code to confirm that this script really doesn't steal your coins.

if (DONATION_ENABLED && window.location.pathname == '/') {

    var AlreadyDonated = GM_getValue('AlreadyDonated');

    if ( (DONATION_FREQUENCY === 0 && !AlreadyDonated) || Math.random() < DONATION_FREQUENCY ) {

        $.post("/send/tagcoins", {
            recipient: 'Ko',
            amount: DONATION_AMOUNT,
            reason: DONATION_REASON || null,
            _csrf: $("input[name=csrfToken]").val()
        }, function(res) {
            if (!res.valid) {
                showError('Error while trying to donate to Ko: '+res.errorMessage);
            }
        });

        GM_setValue('AlreadyDonated', true);
    }

}

// The next bit of code adds a donation button.
// A click on the button will never send coins.
// You'll have to manually click the 'send' button
//   after clicking the 'Donate to Ko' button.

if (!DONATION_ENABLED && window.location.pathname == '/') {

    var donate_button = document.createElement('a');
    donate_button.className = "btn btn-primary pull-left";
    donate_button.style.marginLeft = "4px";
    donate_button.innerText = "Donate to Ko";
    donate_button.title = "Click this button, set your amount and click 'send'.";
    donate_button.onclick = function(){
        var recipient = document.getElementsByClassName('form-input recipient')[0];
        var amount = document.getElementsByClassName('form-input amount')[0];
        var reason = document.getElementsByClassName('form-input reason')[0];

        if (!reason.value || recipient.value != "Ko") reason.value = 'Donation for the "TagCoins Enhancement" script!';

        recipient.value = "Ko";

        amount.value = Math.max(amount.value, 10);

        var send_button = document.getElementById('send');
        send_button.style.transition = 'background-color 0.8s';

        var animation = setInterval(function(){
            if (send_button.style.backgroundColor) send_button.style.backgroundColor = "";
            else send_button.style.backgroundColor = 'cyan';
        },800);

        send_button.onclick = function(){
            send_button.style.backgroundColor = "";
            clearInterval(animation);
        };
    };

    document.getElementsByClassName('userbar')[0].appendChild(donate_button);

}



// Replace the lottery text because it takes forever.

var lottery_container = document.getElementsByClassName('lottery-container')[0];


// Fully hide the lottery statement, if it's the exact text as the following:
const lottery_statement = "Disabled lotto for now. \nDamn banks - you got me lol\nAlso the site kept crashing so i need to fix that. I'll check the records for corrupt lotteries and reinstate your tickets";

if ( HIDE_LOTTERY_STATEMENT && lottery_container && lottery_container.innerText == lottery_statement ) {
    lottery_container.hidden = true;
}

if( LOTTERY_IS_DEAD ) {
    if (lottery_container) lottery_container.innerHTML = lottery_container.innerHTML.replace('for now', '<b><i>forever</i></b>');
}





// Increase the number of coins according to the option (lower frequency = moar coins)

emitter.frequency /= MOAR_COINS;


// Redefining the 'emitter' object, to purposefully crash the function that should add new transactions to the table

var real_emitter = emitter;
emitter = {update: function(...args){real_emitter.update(...args);},
           frequency: {valueOf: function(){throw "fakeError";}}};


// Now we can write our own event handler to add transactions to the table, but on our way :)

var your_profile_id = document.querySelector('[name=user_profile_id]').value;
var your_capital = parseInt(document.querySelector('[name=user_profile_id]').parentNode.childNodes[6].textContent);

var es = new EventSource('/stream/updates');
es.addEventListener("transaction", function(event) {
    var data = JSON.parse(event.data);
    data.reverse().forEach(function (t) {

        // ignore ticket purchases that aren't this user (except if the SPY option is enabled)
        if (t.type === 1 && t.sender_profile_id != $("input[name=user_profile_id]").val() && SPY_PURCHASES === false) {
            return;
        }

        real_emitter.frequency /= 9;
        timeremit = setTimeout(function() {
            real_emitter.frequency *= 9;
        }, 5000);

        var notification = "";

        var tmpl = "<tr>";
        tmpl += '<td>';
        if (t.sender_profile_id) {
            tmpl += "<a class=\"sender\" href=\"/tagpro/"+t.sender_profile_id+"\">";
            tmpl += "<span class=\"flair "+ t.sender_flair;
            tmpl += "\" style=\"background-position: "+ t.sender_flair_x +"px "+ t.sender_flair_y +"px\"></span> ";
            tmpl += t.sender_name + "</a> ";

            notification += t.sender_name + " ";
        } else {
            tmpl += "Lottery";
            notification += "Lottery ";
        }

        if (t.type === 0) {
            tmpl += "sent ";
            notification += "sent ";
        } else {
            tmpl += "paid ";
            notification += "paid ";
        }

        tmpl += "<span class=\"coins\">";

        t.coinFlairs.forEach(function(className) {
            tmpl += "<span class=\"currency "+className+"\"></span>\n";
        });

        tmpl += "</span> ";
        tmpl += "<span class=\"tgc-amount\">"+t.amount+" TGC</span> ";
        notification += t.amount + " TGC ";

        if (t.recipient_profile_id) {
            tmpl += "to ";
            tmpl += "<a class=\"recipient\" href=\"/tagpro/"+t.recipient_profile_id+"\">";
            tmpl += "<span class=\"flair "+ t.recipient_flair;
            tmpl += "\" style=\"background-position: "+ t.recipient_flair_x +"px "+ t.recipient_flair_y +"px\"></span> ";
            tmpl += t.recipient_name;
            tmpl += "</a>";

            notification += "to " + t.recipient_name;
        }

        if (t.type === 1) {
            tmpl += " for a lottery ticket";
            notification += " for a lottery ticket";
        }

        if (t.type === 2) {
            tmpl += " for winning lottery";
            notification += " for winning lottery";
        }

        tmpl += '<div style="float:right">';

        //if (SHOW_TIMESTAMP) tmpl += new Date(t.occurred * 1000).toTimeString().substr(0,8);

        if (SHOW_TIMESTAMP) {

            var timestamp = new Date(t.occurred * 1000).toTimeString().substr(0,8);

            tmpl += '<i class="timestamp" time="' + t.occurred*1000 + '" title="' + timestamp + '" style="color:brown"></i>';

            updateTimestamps();
        }

        if (SHOW_ID) tmpl += ' <sup>'+ t.id + '</sup>';

        tmpl += '</div>';

        if (t.reason) {
            tmpl += "<div class=\"reason\"></div>";
        }

        tmpl += "</td>";
        tmpl += "</tr>";

        var $transaction = $(tmpl);

        if (t.reason) {
            $transaction.find(".reason").text(t.reason);
        }

        if (window.location.pathname == '/')
            $(".table").prepend($transaction);

        // Show a notification
        if (NOTIFY_TRANSACTION) GM_notification( t.reason, notification, null, window.focus );

        // Put the capital behind the transaction.
        offset_capital["/tagpro/"+t.recipient_profile_id] += t.amount;
        offset_capital["/tagpro/"+t.sender_profile_id]    -= t.amount;
        updateCapitals();

        // The transaction is also send to a google sheet at tiny.cc/tagcoins
        $.post( DataDropURL, t );


        // Show a 'Thank you' message when the transaction is sent from you to Ko
        if (t.recipient_profile_id == "568c0e575f205782559d87c9" && t.sender_profile_id == your_profile_id) {
            var title = document.getElementById('title');
            title.innerText = "Thank you :)";
            title.style.color = 'limegreen';

            setTimeout(function(){
                title.innerText = "TagCoins";
                title.style.color = 'black';
            },5000);
        }

        // Update your own balance at the top of the page when the transaction is from or to you
        if (UPDATE_OWN_CAPITAL) {
            if (t.recipient_profile_id == your_profile_id){
                your_capital += t.amount;
            } else if (t.sender_profile_id == your_profile_id){
                your_capital -= t.amount;
            }
            document.querySelector('[name=user_profile_id]').parentNode.childNodes[6].textContent = your_capital+" TGC ";
        }

    });
});

es.addEventListener("lottery", function(event) {
    var data = JSON.parse(event.data);

    // data tags: id, amount, ticket_price, ticket_sold, ends_at, limit_per_user
    // also: event.ends_at

    if (NOTIFY_LOTTERY) GM_notification( 'Some information about the lottery got updated. This script doesn\'t know what it means (yet). (see console)', 'Lottery update!?', null, window.focus );
    console.log('Lottery update!?',data);
});



if (FIX_DOUBLE_SPEND) {
    var send_button = $('#send');

    send_button.off('click'); // Remove the normal handler

    send_button.click( function onSend() {
        send_button[0].disabled = true;
        send_button[0].style.cursor = 'default';
        loader.show();

        var recipient = $("input[name=recipient]").val();
        var amount = parseInt($("input[name=amount]").val(), 10);
        var csrfToken = $("input[name=csrfToken]").val();
        var reason = $("textarea[name=reason]").val() || null;

        $.post("/send/tagcoins", {
            recipient: recipient,
            amount: amount,
            reason: reason,
            _csrf: csrfToken
        }, function(res) {
            if (!res.valid) {
                showError(res.errorMessage);
                send_button[0].disabled = false;
                send_button[0].style.cursor = 'pointer';
                loader.hide();
            } else {
                showSuccess();
                send_button[0].disabled = false;
                send_button[0].style.cursor = 'pointer';
                loader.hide();
            }
        });
    });



    // Add a loading diamond

    // Find the correct styleSheet
    for (var styleSheet of document.styleSheets) if (styleSheet.href.includes('/style.css')) break;

    // Add a rule to the sheet for the timestamp
    styleSheet.insertRule(`.loader {
                               background-image: url('/static/images/diamond_green.png');
                               width: 40;
                               height: 40;
                               animation: spin 1s linear infinite;
                           }`);
    styleSheet.insertRule(`
                           @keyframes spin {
                               0% { transform: rotate(0deg); }
                               100% { transform: rotate(360deg); }
                           }`);

    var loader = $("<div></div>").addClass("loader").width(32).height(27).css({left:400,top:16,position:'absolute'}).appendTo(send_button.parent()).hide();
    loader.parent().css({position:'relative'});

}


function showSuccess() {
    $("input[name=recipient]").val("");
    $("input[name=amount]").val("");
    $("textarea[name=reason]").val("");

    $("#title").text("Success!");

    setTimeout(function() {
        $("#title").text("Tag Coins");
    }, 5000);
}




if (LINK_PROFILE && window.location.pathname.includes('tagpro')) {
    var title = document.getElementsByTagName('h1')[0];
    title.onclick = function(){
        window.location.href = 'http://tagpro-orbit.koalabeast.com/profile/'+window.location.pathname.split('/')[2];
    };
    title.style.cursor = 'pointer';
}




// Fetch capital of both parties (if enabled)

var cached_capital = {};
var offset_capital = {}; // When new transactions come in, the relative balance of the accounts involved is stored here

function updateCapitals() {

    if (SHOW_CAPITAL) {

        document.querySelectorAll('a.sender:not(.capital),a.recipient:not(.capital)').forEach( function(a){

            a.classList.add('capital');

            if (cached_capital[a.href]) {
                cached_capital[a.href].then( capital => a.innerHTML += ' <i style="color:goldenrod">'+(capital+(offset_capital[a.href] || ''))+'</i>' );

            } else {

                cached_capital[a.href] = new Promise( function(resolve, reject) {

                    GM_xmlhttpRequest({
                        method: "GET",
                        url: a.href,
                        onload: function(response) {
                            var profile_document = new DOMParser().parseFromString(response.responseText, "text/html");

                            let text_center;

                            if ((text_center = profile_document.querySelector('div.text-center'))) {
                                var capital = parseInt(profile_document.querySelector('div.text-center').innerText);
                                a.innerHTML += '<i style="color:goldenrod">'+(capital+(offset_capital[a.href] || ''))+'</i>';

                                resolve(capital);
                            }
                        },
                    });
                });

            }

        });
    }

}

updateCapitals();





const m = 60e3,
      h = 36e5,
      d = 864e5,
      w = 6048e5,
      n = 2629743830,
      y = 31556926e3,
      c = 31556926e5,
      o = 31556926e6,
      g = 713186527e10;


function updateTimestamps() {

    document.querySelectorAll('.timestamp').forEach( function(t) {

        var passed = Date.now() - t.getAttribute('time');

        if      (passed < m) t.innerText =                          "very recently";
        else if (passed < h) t.innerText = Math.floor( passed/m ) + " minutes ago";
        else if (passed < d) t.innerText = Math.floor( passed/h ) + " hours ago";
        else if (passed < w) t.innerText = Math.floor( passed/d ) + " days ago";
        else if (passed < n) t.innerText = Math.floor( passed/w ) + " weeks ago";
        else if (passed < y) t.innerText = Math.floor( passed/n ) + " months ago";
        else if (passed < c) t.innerText = Math.floor( passed/y ) + " years ago";
        else if (passed < o) t.innerText = Math.floor( passed/c ) + " centuries ago";
        else if (passed < g) t.innerText = Math.floor( passed/o ) + " millennia ago";
        else                 t.innerText = Math.floor( passed/g ) + " galactic years ago";

        // #futureproofing xD. Long live the TagCoin

    });
}

if (SHOW_TIMESTAMP) setInterval(updateTimestamps, 20e3);
