// ==UserScript==
// @name         Neopets Lottery Autobuyer
// @namespace    shiftasterisk
// @version      0.4
// @description  Autobuys 20 random lottery ticket links on neopets
// @author       shiftasterisk
// @match        http://www.neopets.com/games/lottery.phtml
// @include      https://code.jquery.com/jquery-3.1.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26171/Neopets%20Lottery%20Autobuyer.user.js
// @updateURL https://update.greasyfork.org/scripts/26171/Neopets%20Lottery%20Autobuyer.meta.js
// ==/UserScript==
$('input[type="submit"][value="Buy a Lottery Ticket!"]').parent().append("<input id='buyTwenty' type='button' value='Buy 20 Quick Picks'>");
$('input[type="submit"][value="Buy a Lottery Ticket!"]').parent().parent().parent().append("<div id='linkContainer'></div>");

var numberOfTickets = 20;
var tickets = [];

$('#buyTwenty').click(function() {
    alert("Auto buying tickets, just wait for the page to refresh (about 20 seconds)");
    tickets = [];
    $("#linkContainer").empty();
    selectTickets();
    buyTickets();
});

function buyTickets() {
    for (x = 0; x < tickets.length; x++) {
        url = 'http://www.neopets.com/games/process_lottery.phtml?one=' + tickets[x][0] + '&two=' + tickets[x][1] + '&three=' + tickets[x][2] + '&four=' + tickets[x][3] + '&five=' + tickets[x][4] + '&six=' + tickets[x][5];
        $(document).queue('tickets', createTicket(url));
    }

    $(document).queue('tickets', function() {
        console.log("finished buying tickets");
        location.reload();
    });

    $(document).dequeue('tickets');
}

function createTicket(ticket) {
    return function(next) {
        buyTicket(ticket, next);
    };
}

function buyTicket(ticket, next) {
    setTimeout(function() {
        $.ajax({
            url: ticket,
            async: false,
            success: function(result) {
                console.log("bought ticket");
            }
        });
        next();
    }, 1000);
}

function selectTickets() {
    var ticketsAdded = 0;
    while (ticketsAdded < numberOfTickets) {
        currentTicket = [];
        for (y = 0; y < 6; y++) {
            currentTicket = addNumberToTicket(currentTicket);
        }
        if (!isDuplicateTicket(currentTicket)) {
            tickets.push(currentTicket);
            ticketsAdded++;
            console.log("totalTickets - " + ticketsAdded);
        } else {
            currentTicket = [];
        }
    }
}

function addNumberToTicket(currentTicket) {
    var lotteryNumber = Math.round(Math.random() * 29) + 1;
    console.log(currentTicket);
    console.log(lotteryNumber);
    if (currentTicket.includes(lotteryNumber)) {
        console.log("duplicate number - going in again");
        currentTicket = addNumberToTicket(currentTicket);
    } else {
        currentTicket.push(lotteryNumber);
    }
    return currentTicket;
}

function isDuplicateTicket(currentTicket) {
    for (x = 0; x < tickets.length; x++) {
        if (JSON.stringify(currentTicket.sort()) === JSON.stringify(tickets[x].sort())) {
            console.log("duplicate ticket");
            return true;
        }
    }
    return false;
}