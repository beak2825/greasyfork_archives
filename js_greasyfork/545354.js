// ==UserScript==
// @name         Lotto Auto
// @namespace    request
// @version      1337.69
// @description  Generates 6 random numbers
// @match        https://www.neopets.com/games/lottery.phtml
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545354/Lotto%20Auto.user.js
// @updateURL https://update.greasyfork.org/scripts/545354/Lotto%20Auto.meta.js
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