// ==UserScript==
// @name         Lottery Ticket Generator
// @namespace    neopets
// @version      2020.01.18.2
// @description  Generates 6 random numbers
// @match        https://www.neopets.com/games/lottery.phtml
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/465814/Lottery%20Ticket%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/465814/Lottery%20Ticket%20Generator.meta.js
// ==/UserScript==
 
$("form[action='process_lottery.phtml'] table").css({"width" : "auto"}).find("tbody tr").append(`&nbsp;<td style="padding:10px;"><button id="randomTicket" type="button">Random</button></td>`);
 
const genNum = (min, max) => Math.floor(Math.random() * max) + min;
 
const genTicket = () => {
    let ticket = [];
    for (let i = 0; i < 6; i++) {
        let randomNumber = genNum(1, 30);
        while (ticket.includes(randomNumber)) {
            randomNumber = genNum(1, 30);
        }
        ticket.push(randomNumber);
    }
    ticket.sort((a, b) => a - b);
    return ticket;
};
 
$("#randomTicket").on("click", function (event) {
    event.preventDefault();
    const ticket = genTicket();
    $("form[action='process_lottery.phtml'] table input").each(function (index, element) {
        $(element).val(ticket[index]);
    });
}).click();