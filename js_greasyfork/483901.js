// ==UserScript==
// @name         HLTB in Backloggd Lists
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  HLTB times in Backloggd
// @author       Siev
// @license      MIT
// @match        *://www.backloggd.com/*
// @match        *://backloggd.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=backloggd.com
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/483901/HLTB%20in%20Backloggd%20Lists.user.js
// @updateURL https://update.greasyfork.org/scripts/483901/HLTB%20in%20Backloggd%20Lists.meta.js
// ==/UserScript==

// TODO: fix the sorting in lists to be across pages

let hltbUrl = "https://howlongtobeat.com/api/search/";

function sortList() {
    let getNodeTime = node => $(node).data('hltbTime');
    let sortFunc = $("#sort-direction-btn > .fad").hasClass('fa-sort-down') ?
        (a,b) => getNodeTime(b) - getNodeTime(a)
      : (a,b) => getNodeTime(a) - getNodeTime(b);
    let arr = $('.toggle-fade').children().toArray().toSorted(sortFunc);
    $('.toggle-fade').append($(arr));
}

// add the options for sorting the list by time
$('[id=nav-interactables]').eq(1)
    .find('li.nav-item').last()
    .after(function() { return $(this).clone() })
    .next()
    .click(function () {
        $("#sort-direction-btn")
            .click(function () {
                $('i', this).toggleClass(['fa-sort-up', 'fa-sort-down']);
                sortList();
            })
            .attr('href','javascript: void(0);');
       $(this).parent().prev().contents().first()[0].data = ' HLTB Time ';
       sortList();
    })
    .find('a')
    .text('HLTB Time')
    .attr('href','javascript: void(0);');


// get time from HLTB
function lookupGame(gameName, context, callback) {
    let hltbQuery = '{"searchType":"games","searchTerms":["'+gameName+'"],"size":100}';
    GM_xmlhttpRequest({
        context: context,
        method: "POST",
        url: hltbUrl,
        data: hltbQuery,
        headers: {
            "Content-Type": "application/json",
            "origin": "https://howlongtobeat.com",
            "referer": "https://howlongtobeat.com"
        },
        onload: function (response) {
            var rawTime;
            var hltbTime;
            let game = response.context;
            // Grab response
            let hltb = JSON.parse(response.responseText);

                //Determine if data is present in response by checking the page count.  If no data, set default HLTB button.
                let hltbPages = hltb['pageTotal'];
                if(hltbPages == 0) {
                    hltbTime = "?";
                } else {
                    let hltbstring = JSON.stringify(hltb);

                    //Make sure you have the right game_name (if possible, otherwise just use first result from response)
                    let n = 0;
                    let loop = hltb['count'];
                    for (let i = 0; i < loop; i++) {
                        let hltbName = hltb['data'][i]['game_name'];
                        if (hltbName.toLowerCase() == gameName.toLowerCase()) {
                            n = i;
                            break;
                        }
                    }

                    // convert and format time
                    rawTime = hltb['data'][n]['comp_plus'];
                    hltbTime = rawTime;
                    hltbTime = hltbTime/60/60;                            // Convert to hours
                    hltbTime = Math.round(hltbTime*2)/2;                  // Round to closes .5
                    hltbTime = hltbTime.toString().replace(".5","½");    // Convert .5 to ½ to be consistent with HLTB
                    if (hltbTime[0] == '0') hltbTime = hltbTime.substr(1);
                }

            callback(rawTime, hltbTime, response.context);
        }
    });
}

// showing the time under game cards
$('.card').not('.overlay-hide').filter(function (i) {
    return !$(this).parent().parent().next().hasClass('coming-details')
}).each(function (i, game) {
    let gameName = $('img', this).attr('alt');
    lookupGame(gameName, game, function (raw, fmt, game) {
        //$(game).parent().parent().parent().data('hltbTime', raw);
        $(game).parents('.toggle-fade > div').data('hltbTime', raw);
        $(game).after("<div>" + fmt + " Hours</div>").next().css({ fontSize: '0.9rem', paddingLeft: '0.15rem' });
    })
});

// showing the time in the game page
let gameName = $("#title > div.col-12.pr-0 > div > div > h1").text();
lookupGame(gameName, 0, function (raw, fmt, context) {
    // clone the average score panel and change it to hltb time
    var panel = $('.side-section').eq(1).children().first().before(function(i) { return $(this).clone() }).prev();
    panel.find('p').text('HLTB Time');
    panel.find('h1').text(fmt);
});