// ==UserScript==
// @name         Add beer scores to Beer & Beyond beer pages
// @namespace    http://tampermonkey.net/
// @version      0.25
// @description  Improve ease of looking through beer scores on beer&beyond page
// @author       Ilya
// @license       Apache License, Version 2.0, see https://www.apache.org/licenses/LICENSE-2.0
// @match        https://beerandbeyond.com/collections/all-beers*
// @match        https://beerandbeyond.com/collections/new-beers*
// @grant        GM.xmlHttpRequest
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @connect      beta.ratebeer.com
// @connect      127.0.0.1
// @connect      untappd.com
// @downloadURL https://update.greasyfork.org/scripts/419505/Add%20beer%20scores%20to%20Beer%20%20Beyond%20beer%20pages.user.js
// @updateURL https://update.greasyfork.org/scripts/419505/Add%20beer%20scores%20to%20Beer%20%20Beyond%20beer%20pages.meta.js
// ==/UserScript==

var debug = false;

function appendTitle(link, mainTitle, appendage) {
    if(link.title) {
        link.title += "\n\n" + appendage;
    }
    else {
        link.title = mainTitle + "\n\n" + appendage;
    }
}

function getScoreString(score) {
    return (score ? String(parseInt(score)) : "Score not available");
}

function getScoreFromRateBeerResponse(response) {
    if(response.status != 200) {
        return "Error";
    }
    var responseJson = JSON.parse(response.response);
    var results = responseJson.data.results;
    if(debug) {
        console.log(results);
    }

    if(results.totalCount == 0) {
        return "Not Found";
    }
    var beer = results.items[0].beer;
    var name = beer.name;
    var overallScore = getScoreString(beer.overallScore);
    var styleScore = getScoreString(beer.styleScore);
    var result = "Name: " + name + "\nOverall: " + overallScore + "\nStyle: " + styleScore;
    if(debug) {
        console.log("SurD Result: " + result);
    }
    return result;
}


var apiURL = "https://beta.ratebeer.com/v1/api/graphql/";
//var apiURL = "http://127.0.0.1:8000/v1/api/graphql/";
function setRatebeerScoreByName(beerName, link) {
    if(debug) {
        console.log("SurD Submitting: " + beerName);
    }
    var jdata = {"operationName":"SearchResultsBeer","variables":{"query":beerName,"order":"MATCH","includePurchaseOptions":true,"latlng":[31.80405044555664,35.15789031982422]},"query":"query SearchResultsBeer($includePurchaseOptions: Boolean!, $latlng: [Float!]!, $query: String, $order: SearchOrder, $first: Int, $after: ID) {\n  results: beerSearch(query: $query, order: $order, first: $first, after: $after) {\n    totalCount\n    last\n    items {\n      review {\n        id\n        score\n        likedByMe\n        updatedAt\n        createdAt\n        __typename\n      }\n      beer {\n        id\n        name\n        style {\n          id\n          name\n          __typename\n        }\n        overallScore\n        styleScore\n        averageQuickRating\n        abv\n        ibu\n        brewer {\n          id\n          name\n          country {\n            id\n            code\n            __typename\n          }\n          __typename\n        }\n        contractBrewer {\n          id\n          name\n          country {\n            id\n            code\n            __typename\n          }\n          __typename\n        }\n        ratingsCount\n        imageUrl\n        isRetired\n        isAlias\n        purchaseOptions(options: {latlng: $latlng}) @include(if: $includePurchaseOptions) {\n          items {\n            productId\n            price\n            currency\n            currencySymbol\n            priceValue\n            store {\n              id\n              __typename\n            }\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n"};
    var xdata = JSON.stringify(jdata);
    GM.xmlHttpRequest({
        method: "POST",
        url: apiURL,
        data: xdata,

        headers:{
            "accept": "*/*",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en,en-US;q=0.9,he;q=0.8,ru;q=0.7",
            "content-length": String(xdata.length),
            "content-type": "application/json",
            "locale": "en",
            "origin": "https://www.ratebeer.com",
            "referer": "https://www.ratebeer.com/",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36"
        },

        onload: function(response) {
            try {
               var score = getScoreFromRateBeerResponse(response);
               appendTitle(link, beerName, "Ratebeer\n" + score);
            } catch(err) {
                console.log("Error parsing " + beerName);
                console.log("Response: " + response);
                appendTitle(link, beerName, "Ratebeer\nFailed to get score");
            }
        }
    });
}

function getNameFromTitle(beerTitle) {
    return beerTitle.split(' - ')[1]
}

function setRatebeerScoreFromTitle(beerTitle, link) {
    var beerName = getNameFromTitle(beerTitle);
    setRatebeerScoreByName(beerName, link);
    setUntappdScore(beerName, link);
    return beerName;
}

var untappdApiURL = "https://untappd.com/search?q=";

function setUntappdScore(beerName, link) {
    var queryUrl = untappdApiURL + encodeURI(beerName);
    if(debug) {
        console.log("query url: " + queryUrl);
    }
    GM.xmlHttpRequest({
        method: "GET",
        url: queryUrl,
        headers:{
            "accept": "*/*",
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en,en-US;q=0.9,he;q=0.8,ru;q=0.7",
            "locale": "en",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.66 Safari/537.36"
        },

        onload: function(response) {
            if(debug) {
                console.log("-----");
            }
            var parser = new DOMParser();
            var doc = parser.parseFromString(response.responseText, "text/html");
            var beerItems = doc.getElementsByClassName("beer-item");
            try {
                var score = getUntappdScoreFromBeerItems(beerItems);
                if(debug) {
                    console.log(score);
                }
                appendTitle(link, beerName, "Untappd\n" + score);
            } catch(err) {
                console.log("Error parsing " + beerName);
                console.log("Response: " + response);
                appendTitle(link, beerName, "Untappd\nFailed to get score");
            }
        }
    });

}

function getUntappdScoreFromBeerItems(beerItems) {
    if(beerItems.length == 0) {
        return "Not Found";
    }
    var beerItem = beerItems[0];
    var name = beerItem.getElementsByClassName("beer-details")[0].getElementsByClassName("name")[0].firstChild.firstChild.textContent;
    var brewery = beerItem.getElementsByClassName("beer-details")[0].getElementsByClassName("brewery")[0].firstChild.firstChild.textContent
    var scoreString = beerItem.getElementsByClassName("details beer")[0].getElementsByClassName("rating")[0].getElementsByClassName("num")[0].firstChild.textContent;
    var scoreFloat = parseFloat(scoreString.slice(1, -1));
    return ["Name: " + name, "Brewery: " + brewery, "Score: " + String(scoreFloat)].join('\n');
}


(function() {
    'use strict';
    var links = document.getElementsByClassName('grid-product__title grid-product__title--heading');
    for (var i = 0; i < links.length; i++) {
        setRatebeerScoreFromTitle(links[i].innerText, links[i]);
    }

})();