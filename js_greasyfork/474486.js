// ==UserScript==
// @name              Steam Easy Currency
// @namespace         https://github.com/Ostrichbeta/steam-easy-currency
// @version           0.96
// @description       Show your local currency on the price tag while you are abroad.
// @author            Ostrichbeta Chan
// @license           MIT License
// @match             https://store.steampowered.com/*
// @match             https://steamcommunity.com/*
// @exclude           https://store.steampowered.com/cart/*
// @exclude           https://store.steampowered.com/checkout/*
// @icon              data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require           https://code.jquery.com/jquery-3.7.1.min.js
// @connect           apilayer.net
// @connect           store.steampowered.com
// @grant             GM_xmlhttpRequest
// @grant             GM_getResourceText
// @grant             GM_addStyle
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_deleteValue
// @run-at            document-end
// @downloadURL https://update.greasyfork.org/scripts/474486/Steam%20Easy%20Currency.user.js
// @updateURL https://update.greasyfork.org/scripts/474486/Steam%20Easy%20Currency.meta.js
// ==/UserScript==

(async function() {

    function makeGetRequest(url, returnJSON) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function(response) {
                    if (returnJSON) {
                        resolve(JSON.parse(response.responseText));
                    } else {
                        resolve(response.responseText);
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    function engineeringNotation(num, digits) {
        let notations = {Q: 1e30, R: 1e27, Y: 1e24, Z: 1e21, 
                        E: 1e18, P: 1e15, T: 1e12, G: 1e9,
                        M: 1e6, k: 1e3
                        };
        for (const key in notations) {
            if (num / notations[key] > 1) {
                let intlen = Math.floor(Math.log10(num / notations[key]));
                return (num / notations[key]).toFixed(digits - intlen).toString() + key;
            }
        }
        return num.toString();
    }

    function appendPrice(priceObjList, currencyJSON, appendBr) {
        for (let i = 0; i < priceObjList.length; i++) {
            var item = priceObjList[i];
            if (! $(item).text().replaceAll(/\s/g,'').match(/[\d,]+(?:\.\d+)?/)) {
                // When there are no price tags, e.g. free contents.
                continue;
            }
            if ($(item).children().length > 0 && (! $(item).children().first().hasClass("your_price_label"))) {
                // When the price tag is embedded inside the div
                continue;
            }

            if ($(item).children().first().hasClass("your_price_label")) {
                // When the price tag is embedded inside the div
                item = $(item).children().eq(1);
            }

            if ($(item).hasClass("price-appended")) {
                continue;
            }

            var currentPrice = parseFloat($(item).text().replaceAll(/\s/g,'').replaceAll(/,/g, '').match(/[\d,]+(?:\.\d+)?/)[0]);
            
            var preferCurrency = GM_getValue("sec-currency", "USD");
            let priceTag = currencyJSON["source"];
            if (preferCurrency == priceTag) {
                var convertRate = 1;
                return
            } else {
                if (!(currencyJSON['quotes']).hasOwnProperty(priceTag + preferCurrency)) {
                    alert("Invalid currency mark " + preferCurrency + ".");
                    break;
                }
                
                var convertRate = currencyJSON['quotes'][priceTag + preferCurrency];
            }
            
            let hideOriginalPrice = GM_getValue("sec-hide-original", "0");
            if (hideOriginalPrice == "0") {
                $(item).append(" " + "(" + ((convertRate * currentPrice > 1e5) ? engineeringNotation(convertRate * currentPrice, 4) : (convertRate * currentPrice).toFixed(2).toString()) + "&nbsp;" + preferCurrency + ")");
            } else {
                $(item).text("");
                $(item).append((convertRate * currentPrice).toFixed(2) + " " + preferCurrency);
            }
            $(item).addClass("price-appended");
        }
    }

    function addCurrencyHint(currencyJSON) {
        var discountNumList = $(".discount_final_price")
        if (window.location.href.match(/^https\:\/\/store\.steampowered\.com\/search\/.*$/)) {
            appendPrice(discountNumList, currencyJSON, true);
            $(discountNumList).css("text-align", "right");
        } else {
            appendPrice(discountNumList, currencyJSON, false);
        }

        var priceList = $(".price")
        appendPrice(priceList, currencyJSON, false);

        var dlcPriceList = $(".game_area_dlc_price")
        appendPrice(dlcPriceList, currencyJSON, false);

        var salesPrice = $(".salepreviewwidgets_StoreSalePriceBox_Wh0L8")
        appendPrice(salesPrice, currencyJSON, false);

        var searchSubtitle = $(".match_subtitle").filter(function () {
            return ($(this).parent().hasClass("match_app"));
        })
        appendPrice(searchSubtitle, currencyJSON, false);
    }

    async function initData() {
        try {
            const steamWebPage = await makeGetRequest("https://store.steampowered.com/app/304430/INSIDE/", false) // For fetching the priceTag
            const jqSteamPage = $($.parseHTML(steamWebPage));
            const priceObj = jqSteamPage.find("meta[itemprop=\"priceCurrency\"]");
            if (priceObj.length < 1) {
                throw new Error("Could not find the price tag!");
            }
            const priceTag = $(priceObj[0]).attr("content");
            console.log("Your currency in Steam is " + priceTag + ".");
            if (GM_getValue("sec-currency-apikey") == undefined && GM_getValue("sec-no-key-provided") == undefined) {
                alert("You haven't set the API key to get currencies. Please visit https://currencylayer.com/ to get one. This alert will not shown again.");
                GM_setValue("sec-no-key-provided", true);
            }

            let currencyJSON = {};
            let refreshCurrency = false;

            // Check cached data to reduce API call
            try{
                if (GM_getValue("sec-currency-json-cache") != undefined){
                    let cachedOBJ = JSON.parse(GM_getValue("sec-currency-json-cache"));
                    if (Math.floor(new Date().getTime() / 1000) - cachedOBJ['timestamp'] < 28800 && cachedOBJ["source"] == priceTag) {
                        // Cache the currency data for 8 hours
                        currencyJSON = cachedOBJ;
                    } else {
                        refreshCurrency = true;
                    }
                } else {
                    refreshCurrency = true;
                }
            } catch (error) {
                console.error(error);
                refreshCurrency = true;
            }

            if (refreshCurrency) {
                currencyJSON = await makeGetRequest("http://apilayer.net/live?access_key=" + GM_getValue("sec-currency-apikey", "") + "&source=" + priceTag, true);
                GM_setValue("sec-currency-json-cache", JSON.stringify(currencyJSON));
                console.log("Currency data refeshed.");
            }

            
            if (!currencyJSON["success"]) {
                try {
                    let error_type = currencyJSON["error"]["type"];
                    if (error_type == "invalid_access_key") {
                        alert("Invalid API key provided. Please get a new one from https://currencylayer.com/.");
                        GM_deleteValue("sec-currency-apikey");
                        location.reload();
                    }
                } catch (error) {
                    console.error(error);
                }
            }
            

            $(".sec-options").click(function (e) { 
                e.preventDefault();

                if (GM_getValue("sec-currency-apikey") == undefined) {
                    let apiKey = prompt("Input your API key, you can get a free one from https://currencylayer.com/");
                    if (apiKey == "") {
                        alert("Invalid input.");
                        return;
                    } else {
                        GM_setValue("sec-currency-apikey", apiKey);
                        location.reload();
                    }
                } else {
                    let currency = prompt("Step 1: Enter new currency: ", GM_getValue("sec-currency", "USD"));
                    let settingChanged = false;
                    let currencyQuotes = Object.keys(currencyJSON['quotes']);
                    currencyQuotes.forEach((element, index, thisarray) => {
                        thisarray[index] = element.replace(priceTag, "");
                    });
                    currencyQuotes.push(priceTag);
                    if (currency != null) {
                        if (!currencyQuotes.includes(currency)) {
                            alert("Invalid currency tag, avaliable input is " + currencyQuotes.join(", ") + ".");
                        } else {
                            GM_setValue("sec-currency", currency);
                            settingChanged = true;
                        }
                    }
                    let hideOriginalPrice = prompt("Step 2: Hide the original price or not? Input 1 to agree.", GM_getValue("sec-hide-original", "0"));
                    if (hideOriginalPrice != null) {
                        switch (hideOriginalPrice) {
                            case "1":
                                //hide

                            case "0":
                                GM_setValue("sec-hide-original", hideOriginalPrice);
                                settingChanged = true;
                                //show
                                break
                        
                            default:
                                alert("Invalid input.");
                                break;
                        }
                    }
                    let apiKey = prompt("Step 3: Modify your API key if needed, for more details, check https://currencylayer.com/.", GM_getValue("sec-currency-apikey", ""));
                    if (apiKey == "") {
                        alert("Invalid input.");
                    } else if (apiKey != null) {
                        GM_setValue("sec-currency-apikey", apiKey);
                        settingChanged = true;
                    }
                    if (settingChanged) {
                        location.reload();
                    }
                }
            });
            
            return currencyJSON;

        } catch (error) {
            console.error("An error occurred while fetching data.", error)
        }
    }

    const sec_options_caption = GM_getValue("sec-currency-apikey") == undefined ? "SET SEC API KEY" : "SEC OPTIONS";

    $("div.popup_menu").append("<a class=\"popup_menu_item sec-options\"  href=\"#\"> " + sec_options_caption + " </a>");
    $("div.minor_menu_items").append("<a class=\"menuitem sec-options\" href=\"#\"> " + sec_options_caption + " </a>");
    const currencyJSON = await initData();
    if (currencyJSON["base"] != GM_getValue("sec-currency", "USD")) {
        setInterval(addCurrencyHint, 500, currencyJSON);
    } else {
        console.log("The currency of your account is the same as the one you wanna display, abort.");
    }
})();
