// ==UserScript==
// @name         Lottery Ticket Generator
// @description  Generates 6 random numbers
// @match        http://www.neopets.com/games/lottery.phtml
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @version 0.0.1.20210120014716
// @namespace https://greasyfork.org/users/569667
// @downloadURL https://update.greasyfork.org/scripts/420416/Lottery%20Ticket%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/420416/Lottery%20Ticket%20Generator.meta.js
// ==/UserScript==

$("form[action='process_lottery.phtml'] table").css({"width" : "auto"}).find("tbody tr").append(`&nbsp;<td style="padding:10px;"><button id="randomTicket" type="button">Random</button></td>`);

$("input[value='Buy a Lottery Ticket!']").after(`&nbsp;<input id="buyAll" type="button" value="Buy 20 tickets">`);

const genNum = (min, max) => Math.floor(Math.random() * max) + min;

const genTicket = () => {
    let ticket = [];
    for (let i = 0; i < 6; i++) {
        let randomNumber;
        do {
            randomNumber = genNum(1, 30);
        } while (ticket.includes(randomNumber));
        ticket.push(randomNumber);
    }
    ticket.sort((a, b) => a - b);
    return ticket;
};

$("#randomTicket").on("click", function () {
    const ticket = genTicket();
    $("form[action='process_lottery.phtml'] table input").each(function (index, element) {
        $(element).val(ticket[index]);
    });
}).click();

$("#buyAll").on("click", async function () {
    $(this).prop("disabled", true);
    for (let i = 0; i < 20; i++) {
        const buy = await (function () {
            return new Promise(resolve => {
                const ticket = genTicket();
                const ticketString = ticket.toString().replace(/,/g, " ")
                $.ajax({
                    type : "POST",
                    url : "/games/process_lottery.phtml",
                    data : {
                        _ref_ck : $("input[name='_ref_ck']").val(),
                        one : ticket[0],
                        two : ticket[1],
                        three : ticket[2],
                        four : ticket[3],
                        five : ticket[4],
                        six : ticket[5]
                    },
                    success : data => {
                        const response = $.parseHTML(data); // jQuery 1.8 onwards only. Old neopets uses 1.7.1
                        let message;
                        if ($(response).find(".errormess").length) {
                            message = `Ticket ${i + 1} (${ticketString}): error`;
                            i = 20; // break
                        } else {
                            message = `Ticket ${i + 1} (${ticketString}): success`;
                        }
                        resolve(message);
                    }
                });
            })
        })();
        console.log(buy);
    }
    location.replace(location.href);
});