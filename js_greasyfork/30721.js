// ==UserScript==
// @name        erevMarket
// @description calculate prices according gold rate
// @include     https://www.erevollution.com/*/market/*
// @version     0.0.1
// @grant       none
// @namespace https://greasyfork.org/users/2402
// @downloadURL https://update.greasyfork.org/scripts/30721/erevMarket.user.js
// @updateURL https://update.greasyfork.org/scripts/30721/erevMarket.meta.js
// ==/UserScript==


function getUsage(el) {
    var stars = $(el).find('div.vs108 > i').attr('class')
    var qualityRe = /[\d]+/g
    return parseInt(qualityRe.exec(stars)[0]) * 2

}

function main() {
    var loc = location.href,
        vars = loc.split('/'),
        lang = vars[3],
        country = vars[5],
        industry = vars[6],
        flag = $('.vs312 img').attr('src').split('/')[6].split('.')[0],
        url = "/" + lang + "/monetary-market/" + countryId[flag] + "/0/1";
    setTimeout(function() {
        $.ajax({
                url: url,
            })
            .done(function(c) {
                goldRate = $(c).find('#panel-3 td.vs129:eq(1) strong:eq(1)').text();
                $('div.vsTable table tbody tr').each(function() {
                    quality = getUsage(this);
                    td = $(this).find('td.vs129');
                    price = parseFloat($(td).text().replace(' ', ''));
                    priceInGold = price / goldRate;
                    pcPerGold = goldRate / price;
                    energyPerGold = pcPerGold * quality;
                    $(td).append("<span class='small'><br>" + priceInGold.toFixed(5) + " g</span>");
                    $(td).append("<span class='small'><br>" + pcPerGold.toFixed(2) + " pc/g</span>");
                    industry == 4 && $(td).append("<span class='small'><br>" + energyPerGold.toFixed(2) + " nrg/g</span>");
                })
            })

    }, 1e3)
}

var countryId = {
    "Afghanistan": 75,
    "Albania": 1,
    "Argentina": 2,
    "Armenia": 3,
    "Australia": 4,
    "Austria": 5,
    "Belarus": 6,
    "Belgium": 7,
    "Bolivia": 8,
    "Bosnia and Herzegovina": 9,
    "Brazil": 10,
    "Bulgaria": 11,
    "Canada": 12,
    "Chile": 13,
    "China": 14,
    "Colombia": 15,
    "Croatia": 16,
    "Cuba": 17,
    "Cyprus": 18,
    "Czech Republic": 19,
    "Denmark": 20,
    "Egypt": 21,
    "Estonia": 22,
    "Finland": 23,
    "France": 24,
    "Georgia": 25,
    "Germany": 26,
    "Greece": 27,
    "Hungary": 28,
    "India": 29,
    "Indonesia": 30,
    "Iran": 31,
    "Ireland": 32,
    "Israel": 33,
    "Italy": 34,
    "Japan": 35,
    "Latvia": 36,
    "Lithuania": 37,
    "Malaysia": 38,
    "Mexico": 39,
    "Montenegro": 40,
    "Morocco": 76,
    "Netherlands": 41,
    "New Zealand": 42,
    "Nigeria": 43,
    "North Korea": 44,
    "Norway": 45,
    "Pakistan": 46,
    "Paraguay": 47,
    "Peru": 48,
    "Philippines": 49,
    "Poland": 50,
    "Portugal": 51,
    "Republic of China (Taiwan)": 52,
    "Republic of Macedonia (FYROM)": 53,
    "Republic of Moldova": 54,
    "Romania": 55,
    "Russia": 56,
    "Saudi Arabia": 57,
    "Serbia": 58,
    "Singapore": 59,
    "Slovakia": 60,
    "Slovenia": 61,
    "South Africa": 62,
    "South Korea": 63,
    "Spain": 64,
    "Sweden": 65,
    "Switzerland": 66,
    "Thailand": 67,
    "Turkey": 68,
    "Ukraine": 69,
    "United Arab Emirates": 70,
    "United Kingdom": 71,
    "Uruguay": 72,
    "United States of America": 73,
    "Venezuela": 74,
}

main();