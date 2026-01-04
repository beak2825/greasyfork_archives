// ==UserScript==
// @name         Neolodge - send all pets
// @namespace    np
// @version      2021.03.25
// @description  Because you can never be too lazy. Sends all your neopets to the lodge with just one click!
// @author       wtmeow
// @match        http://www.neopets.com/neolodge.phtml
// @grant        none
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/416592/Neolodge%20-%20send%20all%20pets.user.js
// @updateURL https://update.greasyfork.org/scripts/416592/Neolodge%20-%20send%20all%20pets.meta.js
// ==/UserScript==

$("form[action='book_neolodge.phtml']").after(`<br><p><b>Step 5.</b> Or alternatively, fuck all of the above and just click on this button instead.</p><br><div style="text-align: center"><button id="book-all" type="button" style="font-family: Verdana, Arial, Helvetica, sans-serif; font-size: 9pt; padding: 10px;">I'm a fucking terrible owner.<br> Please send all my slaves to die in<br>Cockroach Towers for 28 nights.</div><br><br><div id="sad-pets" style="text-align: center;"></div><br><div style="text-align:center;"><i>Don't do this to us!</i></div>`);

const username = appInsightsUserName || $(".user a[href*='/userlookup']").text();
let pets = [];
$("select[name='pet_name']").find("option").each(function (index, element) {
    if (index !== 0) {
        pets.push($(element).text().trim());
    }
});

/***********************************************************************************/
// This part can be deleted :)
let imgs = "";
let imgTitle = [
    "Time to find a new owner!",
    `Fuck you, ${username}!`,
    "I have a huge phobia of cockroaches!",
    "Is it too late to uncreate myself?",
    "I thought you loved me </3",
    `Am I really just worth 140NP to you, ${username}?`
];
for (let i = 0; i < pets.length; i++) {
    imgs += `<img style="width: 100px; height: 100px;" src="http://pets.neopets.com/cpn/${pets[i]}/2/2.png" alt="" title="${imgTitle[Math.floor(Math.random() * imgTitle.length)]}">`;
}
$("#sad-pets").html(imgs);
/***********************************************************************************/

$("#book-all").on("click", function () {
    return new Promise(resolve => {
        $(this).prop("disabled", true);
        for (let i = 0; i < pets.length; i++) {
            setTimeout(function () {
                $.ajax({
                    type: "POST",
                    url: "/book_neolodge.phtml",
                    async: false,
                    data: {
                        "pet_name": pets[i],
                        "hotel_rate": "5",
                        "nights": "28"
                    },
                    success: function (data, status, xhr) {
                        console.log({
                            "pet": pets[i],
                            "status": status
                        });
                        if (i === pets.length - 1) {
                            location.href = "/quickref.phtml";
                        }
                    }
                });
            }, 1000);
        }
    })
});