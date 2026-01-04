// ==UserScript==
// @name         Toyhouse F2E Raffle Roller
// @namespace    http://tampermonkey.net/
// @version      2025-01-06
// @description  Adds a button to character profiles to roll a random user who faved that character.
// @author       You
// @match        https://toyhou.se/*.*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=toyhou.se
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522655/Toyhouse%20F2E%20Raffle%20Roller.user.js
// @updateURL https://update.greasyfork.org/scripts/522655/Toyhouse%20F2E%20Raffle%20Roller.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const hourglass = "<i class='fa fa-hourglass fa-spin'></i>";
    const insert = $('<div class="row fields-field" id="raffle-row"><dt class="raffle-heading field-title col-sm-4">Roll user from faves</dt><dd class="field-value col-sm-8" id="raffle-target"><span class="mr-2" id="raffle-button-wrapper"></span><span id="raffle-result"></span></dd></div>');
    const btn = $("<button class='btn btn-primary'>Roll</button>").on("click", roll);
    insert.find('#raffle-button-wrapper').append(btn);

    const insert2 = $('<div class="row fields-field" id="raffle-input-row"><dt class="raffle-heading field-title col-sm-4">Users with extra tickets<br><span class="small text-muted" style="line-height: 1.2em;">Separate names with spaces or commas. If user has 2 tickets, enter their name twice</span></dt><dd class="field-value col-sm-8"><span class="mr-2" id="raffle-input-wrapper"></span></dd></div>');
    const input = $("<textarea id='raffle-input' class='w-100 h-100 form-control' placeholder='user1 user2 user3...'></textarea>");
    insert2.find("#raffle-input-wrapper").append(input);

    const insert3 = $('<div class="row fields-field"><dt class="raffle-heading field-title col-sm-4">Extra ticket for subscribers</dt><dd class="field-value col-sm-8"><span class="mr-2"><input type="checkbox" id="raffle-sub"></span></dd></div>');

    $(".profile-stats-content").append([insert, insert2, insert3]);

    async function roll(){
        $("#raffle-button").prop("disabled", true).addClass("disabled");
        const favepage = location.href+"/favorites";
        const subspage = $("#dropdownProfile .dropdown-item").attr("href")+"/stats/subscribers";
        let awaits = [];
        let rollable_subs = [];
        let list;

        $("#raffle-result").html([hourglass, " Fetching faves..."]);
        await $.get(favepage, function(d){
            list = $(d).find(".user-name-badge")
                .toArray()
                .map(el => $(el).text().trim());
        });

        if($("#raffle-sub").prop("checked")) {
            $("#raffle-result").html([hourglass, " Fetching subscribers..."]);
            await new Promise(function(resolve, reject){
                $.get(subspage, async function(d){
                    const numbers = $(d).find(".pagination:first .page-item:not(.disabled) .page-link").toArray().map((el) => $(el).text().trim()).filter(i => !isNaN(+i));
                    const earliest = +numbers[0], latest = +numbers[numbers.length-1];
                    for(let i=earliest; i<=latest; i++) {
                        awaits.push( $.get(subspage+"?page="+i, function(d){
                            const pagesubs = $(d).find(".user-name-badge").toArray().map(el=>$(el).text().trim()).filter(sub => list.indexOf(sub) > -1);
                            rollable_subs = rollable_subs.concat(pagesubs);
                        }) )
                    }
                    Promise.all(awaits).then(function(){
                        resolve();
                    });
                });
            });
        }

        list = list.concat(rollable_subs);
        if(input.val().length){
            list = list.concat( input.val().split(/[,\s\t\n]+/).filter(i=>i) );
        }
        list.sort();

        console.log("List", list);
        const winner = list[Math.floor(Math.random() * list.length)];
        $("#raffle-button").prop("disabled", false).removeClass("disabled").text("Roll again");
        $("#raffle-result").html("<b>Winner: <a href='/"+winner+"'>"+winner+"</a>!</b>")
    }
    // Your code here...
})();