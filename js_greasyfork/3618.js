// ==UserScript==
// @name        Steam Price Comparison - Unpowered edition
// @version     2.5.1
// @namespace   http://steamunpowered.eu/comparison-script/
// @description Displays prices from all regions in the Steam store and convert them to your local currency
// @copyright   2011+, KindDragon; 2010+, Zuko; Original author: Tor (http://code.google.com/p/steam-prices/)
// @homepage    https://greasyfork.org/scripts/3618-steam-price-comparison-unpowered-edition
// @update  2.5.1 Several CSS rules fixed.
// @update  2.5.0 Support Indonesia, Malaysia, Philippines, Singapore, Thailand, Canada, Korea, Mexico, Norway and Turkey prices.
// @update  2.4.6 Support Japan prices. New option "yourBaseCountry".
// @update  2.4.4 Russian price detection fixed. Settings now stored in GM settings.
// @update  2.4.3 Price "N/A" fixed. Opera support improved.
// @update  2.4.1 Page price detection fixed.
// @update  2.4.0 Support for CIS countries added. Code highly refactored. Auto-detecting used price in page.
// @update  2.3.3 Brazilian prices support added.
// @update  2.3.2 Sale page support added.
// @update  2.3.1 Page formating fixed in some cases.
// @update  2.3.0 Script fixed after site changes.
// @icon        data:image/gif;base64,R0lGODlhIAAgAPcAAAAAAAAAAQEAAgIAAwACAAECAQECAgICAwEABAIBBQMCBAICBQIDBgAEAwMEBgIEBwQDBQQEBgYGBgQGBwIDCQQFCAUECQYFCgUHCAQGCQYHCgYHCwYHDAQHDgUHDwMIDQcJCQYICwcKCgcIDAcIDQUJDgYJDwYLDQkHCQoGCgwFCQ8GDQgJDAgIDQkIDgYJEAQJEQcKEAYMFQQPGAoKEggLFQoMEQkNEwgMFAsOFAkPGAoQFQkQFwoRGAoRGQgQGgwTGw8VHxATHxEUGhMXHBYXHg4RIA8YIg4bLBEaIxEZJhIaJhUZIBQYIRccIRYcKhocJBIgMBooMiYTHCoVHCUbIz0ZJiEjJyImKiIlLSInLCYmKiQnKygqLyQpMScvOyksMiksMykvNy0vNS4wNS8wNygxPCswPiwzOzE0OjI2OzI3PTU3OzQ6PyQxQi86RTM5QjY7QDQ8RTg8QDk8RDs+RjE/UD1ARz9CRz5ERz9BSD9CSjxDSzlIWUoiLUgqOVggNUA/R3ErQ0BDS0FFTUJGTkVIT0ZKT0ZJUEBPX0ZPW0pOVEpOVk1QVU5RV09SV09RWlFWWVZTWVVZXFZZXVVaXVVaXlZcXUVSY0lZZ05edlJXY1VYYFVZZFVfa1lcZFpdZVpeZVtfZl9ial9kal5lb1pndFtsfF9sfGBjamFkamBka2Blbmpxe21ye3NyeXJ1fHR3fnF4e3R4fW15i3V7hnl8hH1/iXuBhX2AhnyAh32BiH2CiIGGioGEjYGIj4OLlI6Vmo+WnZeYnZKaoZWcpqevuKWvuqiutKWwt62zuq20vK22vrKyubO2vbC3vrS2vba6vrW8vrO3wrW7w7e8wra8xrq9w7m/w7m/xbrAwrnAx8LFzMDFzsPM0dLW29ba3Nfd39jZ2djb3NTa4OLk6OXn6+fo5+Lo6ubp6e7z8/X29gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAP8ALAAAAAAgACAAAAj/ACUEAECwoMGDCBMGEJiwoUOEAx9KnEixosWLGDNq3Mix4QAEAUKKFClAQMSRBEeGTClgwICSARAkSFDyYwKQAFyaDDDAQICWB0oCQEAjzyUtJeJYqhQph4lGlCaBWXCgyKEYBjLoAfPByaMwXS4EWKCK3DFiOlx5S5esiRJz25htctChlbovDXxokxYFGLo3hiwIgNDLmiYpJWSg6oaEwhJztDIdMWAkm7haHoBgW3eq3LkQEBYIWOClGLdpQx54gvYjQJJv1IxBYXAmnKRoQnoocwZu2bgIIheIsdPnGRMKiobNGBCkWSI3RGCUioasmhkewUwJw3QtQkoFhHzxsmJkwwIaUi8i7JCF69YdHKzkLOnE54YoODWe5FqQksGeMXMQcsUWeAQyBRVWVAFJGWvUgYgaWCzSBheOsMAGGWlMUFAFsYRBhy2cfPLLK4D4IcgfqXACCiy2hDLILqsUoksWozAyCwYFHSACBxuQMAIJLpywAgoqpPBACEhqkEEIGmzQggskcDACCAYUFAABBhVQQEhaEqCSSAV0JOaYZJZp5plopqnmmmtGdOZCbpK5UEAAOw==
// @license     MIT License; http://www.opensource.org/licenses/mit-license.php
// @include     http://store.steampowered.com/app/*
// @include     https://store.steampowered.com/app/*
// @include     http://store.steampowered.com/sub/*
// @include     https://store.steampowered.com/sub/*
// @include     http://store.steampowered.com/sale/*
// @include     https://store.steampowered.com/sale/*
// @match       http://store.steampowered.com/app/*
// @match       https://store.steampowered.com/app/*
// @match       http://store.steampowered.com/sub/*
// @match       https://store.steampowered.com/sub/*
// @match       http://store.steampowered.com/sale/*
// @match       https://store.steampowered.com/sale/*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/3618/Steam%20Price%20Comparison%20-%20Unpowered%20edition.user.js
// @updateURL https://update.greasyfork.org/scripts/3618/Steam%20Price%20Comparison%20-%20Unpowered%20edition.meta.js
// ==/UserScript==

// To install save script to disk under name CompareSteamPrices.user.js and then open this file in Firefox

// Russian, Brazilian, CIS and others prices added by KindDragon (https://github.com/KindDragon)

/*
 * Configuration
 * If you want to modify the parameters of the script,
 * please make your changes here.
 */
if (!this.GM_getValue || (this.GM_getValue.toString && this.GM_getValue.toString().indexOf("not supported") > -1)) {
    this.GM_getValue = function(key, def) {
        return localStorage[key] || def;
    };
    this.GM_setValue = function(key, value) {
        return localStorage[key] = value;
    };
    this.GM_deleteValue = function(key) {
        return delete localStorage[key];
    };
}

var defaultCountriesList = ['US', 'AU', 'BR', 'CA', 'CIS', 'EU', 'ID', 'JP',
    'MX', 'MY', 'NO', 'PH', 'RU', 'SG', 'TH', 'TR', 'UK'
];

// first time init, you can changes this values in about:config page
if (GM_getValue("showYourLocalCurrency") === undefined) {
    GM_setValue("showYourLocalCurrency", true);
    GM_setValue("showPricesForCountries", JSON.stringify(defaultCountriesList));
    GM_setValue("usVat", 0);
}

//If set to true, prices converted to your local currency will be displayed
var showYourLocalCurrency = GM_getValue("showYourLocalCurrency", true);
var yourLocalCurrency = GM_getValue("yourLocalCurrency");
//yourLocalCurrency = "UAH";
var yourBaseCountry = GM_getValue("yourBaseCountry", "US");

/*
 * If set to [], show prices for all regions
 *
 * If set to 'EU', the script will display prices from both of Valve's
 * price regions, or "tiers". If without 'EU', the script will show only your
 * country's prices. More details on the tiers can be found here:
 * http://steamunpowered.eu/page.php?id=139
 * For games where prices are equal in all regions, the script will display
 * only one value no matter what this setting is configured to.
 */
var showPricesForCountries = JSON.parse(GM_getValue("showPricesForCountries", JSON.stringify([])));
if (showPricesForCountries.length == 0) {
    showPricesForCountries = defaultCountriesList;
}

//These parameters contain one country code from each of the European tiers.
var tier1cc = "se";
var tier2cc = "pl";
//These parameters contain one country code from CIS countries.
var CIScc = "kz";
//Change this parameter to add VAT to the US price displayed.
//E.g. if set to 19, the script will increase US prices by 19%.
var usVat = GM_getValue("usVat", 0);

var usdValuePattern = new RegExp(/&#36;([\d\.]+)(?: USD)?/i);
var settings = {
    "US": {
        "country": [{
            "name": "US",
            "code": "us"
        }],
        "currencyCode": "USD",
        "valuePattern": /&#36;([\d\.]+)/i,
        "replaceVal": ["", ""],
        "vat": usVat
    },
    "UK": {
        "country": [{
            "name": "UK",
            "code": "uk"
        }],
        "currencyCode": "GBP",
        "valuePattern": /&#163;([\d\.]+)/i,
        "replaceVal": ["", ""],
        "vat": 0
    },
    "EU": {
        "country": [{
            "name": "EU Tier 1",
            "code": tier1cc
        }, {
            "name": "EU Tier 2",
            "code": tier2cc
        },],
        "currencyCode": "EUR",
        "valuePattern": /([\d,-]+)&#8364;/i,
        "replaceVal": ["--", "00"],
        "vat": 0
    },
    "AU": {
        "country": [{
            "name": "AU",
            "code": "au"
        }],
        "currencyCode": "USD",
        "valuePattern": usdValuePattern,
        "replaceVal": ["", ""],
        "vat": 0
    },
    "RU": {
        "country": [{
            "name": "RU",
            "code": "ru"
        }],
        "currencyCode": "RUB",
        "valuePattern": /([\d\.,]+) p&#1091;&#1073;\./i,
        "replaceVal": ["", ""],
        "vat": 0
    },
    "CIS": {
        "country": [{
            "name": "CIS",
            "code": CIScc
        }],
        "currencyCode": "USD",
        "valuePattern": usdValuePattern,
        "replaceVal": ["", ""],
        "vat": 0
    },
    "BR": {
        "country": [{
            "name": "BR",
            "code": "br"
        }],
        "currencyCode": "BRL",
        "valuePattern": /&#82;&#36; ([\d,]+)/i,
        "replaceVal": ["", ""],
        "vat": 0
    },
    "JP": {
        "country": [{
            "name": "JP",
            "code": "jp"
        }],
        "currencyCode": "JPY",
        "valuePattern": /&#165; ([\d,]+)/i,
        "replaceVal": [",", ""],
        "vat": 0
    },

    "ID": {
        "country": [{
            "name": "ID",
            "code": "id"
        }],
        "currencyCode": "IDR",
        "valuePattern": /Rp (\d+(?: \d+)*)/i,
        "replaceVal": [" ", ""],
        "vat": 0
    },
    "MY": {
        "country": [{
            "name": "MY",
            "code": "my"
        }],
        "currencyCode": "MYR",
        "valuePattern": /RM([\d\.]+)/i,
        "replaceVal": ["", ""],
        "vat": 0
    },
    "PH": {
        "country": [{
            "name": "PH",
            "code": "ph"
        }],
        "currencyCode": "PHP",
        "valuePattern": /P([\d\.,]+)/i,
        "replaceVal": [",", ""],
        "vat": 0
    },
    "SG": {
        "country": [{
            "name": "SG",
            "code": "sg"
        }],
        "currencyCode": "SGD",
        "valuePattern": /S&#36;([\d\.]+)/i,
        "replaceVal": ["", ""],
        "vat": 0
    },
    "TH": {
        "country": [{
            "name": "TH",
            "code": "th"
        }],
        "currencyCode": "THB",
        "valuePattern": /&#x0e3f;([\d\.,]+)/i,
        "replaceVal": [",", ""],
        "vat": 0
    },
    "CA": {
        "country": [{
            "name": "CA",
            "code": "ca"
        }],
        "currencyCode": "CAD",
        "valuePattern": /CDN&#36; ([\d\.]+)/i,
        "replaceVal": ["", ""],
        "vat": 0
    },
    "KO": {
        "country": [{
            "name": "KO",
            "code": "ko"
        }],
        "currencyCode": "USD",
        "valuePattern": usdValuePattern,
        "replaceVal": ["", ""],
        "vat": 0
    },
    "MX": {
        "country": [{
            "name": "MX",
            "code": "mx"
        }],
        "currencyCode": "MXN",
        "valuePattern": /Mex&#36; ([\d\.]+)/i,
        "replaceVal": ["", ""],
        "vat": 0
    },
    "NO": {
        "country": [{
            "name": "NO",
            "code": "no"
        }],
        "currencyCode": "NOK",
        "valuePattern": /([\d\,]+) kr/i,
        "replaceVal": ["", ""],
        "vat": 0
    },
    "TR": {
        "country": [{
            "name": "TR",
            "code": "tr"
        }],
        "currencyCode": "TRY",
        "valuePattern": /([\d\,]+) TL/i,
        "replaceVal": ["", ""],
        "vat": 0
    }
};

function CurrencyPattern(valuePattern, currencyCode) {
    this.pattern = valuePattern;
    this.currency = currencyCode;
}

var valuepatterns = [
    new CurrencyPattern(new RegExp(/\u00A3([\d\.]+)/i), 'GBP'),
    new CurrencyPattern(new RegExp(/([\d,-]+)\u20AC/i), 'EUR'),
    new CurrencyPattern(new RegExp(/\$([\d\.]+) USD/i), 'USD'),
    new CurrencyPattern(new RegExp(/([\d\.]+) p\u0443\u0431./i), 'RUB'),
    new CurrencyPattern(new RegExp(/R\$ ([\d,]+)/i), 'BRL'),
    new CurrencyPattern(new RegExp(/\u00A5 ([\d,]+)/i), 'JPY'),
    new CurrencyPattern(new RegExp(/Rp (\d+(?: \d+)*)/i), 'IDR'),
    new CurrencyPattern(new RegExp(/RM([\d\.]+)/i), 'MYR'),
    new CurrencyPattern(new RegExp(/P([\d\.]+)/i), 'PHP'),
    new CurrencyPattern(new RegExp(/S\$([\d\.]+)/i), 'SGD'),
    new CurrencyPattern(new RegExp(/฿([\d\.]+)/i), 'THB'),
    new CurrencyPattern(new RegExp(/CDN$ ([\d\.]+)/i), 'CAD'),
    new CurrencyPattern(new RegExp(/Mex$ ([\d\.]+)/i), 'MXN'),
    new CurrencyPattern(new RegExp(/([\d\,]+) kr/i), 'NOK'),
    new CurrencyPattern(new RegExp(/([\d\,]+) TL/i), 'TRY'),
    new CurrencyPattern(new RegExp(/\$([\d\.]+)/i), 'USD')
];

/*
 * End of configuration area
 * Don't make changes below this line unless you know what you're doing.
 */

var urlGamePattern = new RegExp(/^https?:\/\/store\.steampowered\.com\/(?:app|sub)\/\d+\/?(?:\?(?:(?!cc)\w+=[^&]*&?)*)?$/i);
var urlSalePattern = new RegExp(/^https?:\/\/store\.steampowered\.com\/sale\/\w+\/?(?:\?(?:(?!cc)\w+=[^&]*&?)*)?$/i);
//var urlGenrePattern = new RegExp(/^https?:\/\/store\.steampowered\.com\/genre\/.+\/?/i);

var pricenodes = [];
var pricenodes_conly = [];
var originalprices = [];
var originalprices_conly = [];
var someNode;
var exchangerateScripts = {};

var baseCountry = null;
var baseCurrency = "";

//var tier1text = "Albania, Andorra, Austria, Belgium, Denmark, Finland, " +
//                "France, Germany, Ireland, Liechtenstein, Luxembourg, Macedonia, " +
//                "Netherlands, Sweden, Switzerland";
//var tier2text = "Bosnia and Herzegovina, Bulgaria, Croatia, Cyprus, " +
//                "Czech Republic, Estonia, Greece, Hungary, Italy, Latvia, Lithuania, " +
//                "Malta, Monaco, Montenegro, Norway, Poland, Portugal, Romania, San Marino, " +
//                "Serbia, Slovakia, Slovenia, Spain, Vatican City";
//var cistext   = "Armenia, Azerbaijan, Belarus, Georgia, Kazakhstan, Kyrgyzstan, " +
//                "Moldova, Tajikistan, Turkmenistan, Uzbekistan, Ukraine";

function AddExchangeRateScript(fromCurrency, toCurrency, skipEqual) {
    if (skipEqual && fromCurrency === toCurrency) {
        return;
    }
    var key = fromCurrency + toCurrency;
    if (exchangerateScripts[key] === undefined) {
        var script = document.createElement("script");
        script.setAttribute("type", "text/javascript");
        script.setAttribute("src",
            "http://javascriptexchangerate.appspot.com/?from=" + fromCurrency + "&to=" + toCurrency);
        document.body.insertBefore(script, someNode);
        exchangerateScripts[key] = script;
    }
}

function SteamPage(countryName, countryCode, currencyCode, valuePattern, replaceVal, vat, globalCountryName, dependedPage) {
    this.countryName = countryName;
    this.countryCode = countryCode;
    this.currencyCode = currencyCode;
    this.valuePattern = valuePattern;
    this.replaceVal = replaceVal;
    this.vat = vat === undefined ? 0 : vat;
    this.globalCountryName = globalCountryName;
    this.dependedPage = dependedPage;
    this.http = null;

    this.getCountryPageUrl = function() {
        var pos = document.documentURI.indexOf('?');
        if (pos < 0) {
            return document.documentURI + "?cc=" + this.countryCode;
        } else {
            return document.documentURI + "&cc=" + this.countryCode;
        }
    };

    this.findPrice = function() {
        //Search ExpandedItem the price information in the downloaded HTML documents
        try {
            this.priceHtml = this.pricepattern.exec(this.http.responseText)[1];
            this.price = parseFloat(this.valuePattern.exec(this.priceHtml)[1]
                .replace(replaceVal[0], replaceVal[1]).replace(",", "."));
            if (this.vat > 0) {
                this.price = this.price * (1 + (this.vat / 100));
                this.priceHtml = "$" + this.price.toFixed(2);
            }
        } catch (err) {
            //Prevent search from looping around and starting at the beginning
            if (err.message.search("responseText\\) is null") !== -1) {
                this.http = null;
                this.priceHtml = "N/A";
            } else if (!this.priceHtml || this.priceHtml.length == 0)
                this.priceHtml = "N/A";
            //else
            //    this.priceHtml = null;
            this.price = null;
        }
    };

    this.processPrice = function(i, pricenode, first) {
        var tiersEqual = false;
        if (this.dependedPage) {
            tiersEqual = this.price == this.dependedPage.price;
            if (tiersEqual)
                this.dependedPage.priceHtml = null;
        }
        var countryName = tiersEqual ? this.globalCountryName : this.countryName;
        var spanId = this.countryCode + "_" + i;
        var html = countryName + ": " + this.priceHtml;
        if (this.price) {
            if (this.vat > 0)
                html += " (inc. " + this.vat + "% VAT)";
            if (showYourLocalCurrency)
                html += " <span id='" + spanId + "' style='font-weight: bold;'>" +
                (this.currencyCode != yourLocalCurrency ? this.price : "") + "</span>";
        }
        if (first)
            pricenode.innerHTML = html;
        else
            pricenode.innerHTML += "<br>\n" + html;
        if (this.price) {
            if (showYourLocalCurrency && this.currencyCode != yourLocalCurrency) {
                var tmp0 = document.createElement("script");
                tmp0.setAttribute("type", "text/javascript");
                tmp0.innerHTML = "var node = document.getElementById('" + spanId + "');" +
                    "node.innerHTML = \"(\" + " + getConvFunction(this.currencyCode, "node") + " + \" " + yourLocalCurrency;
                if (this.vat > 0)
                    tmp0.innerHTML += " inc. " + this.vat + "% VAT";
                tmp0.innerHTML += ")\";";
                document.body.insertBefore(tmp0, someNode);
            }
            if (baseCountry.countryCode != this.countryCode)
                createGetDifferenceScript(spanId, this.currencyCode, baseCountry.price, this.price);
        }
    };
}

var pageCurrency = null;

var pages = [];
if (showPricesForCountries.indexOf(yourBaseCountry) == -1) {
    yourBaseCountry = "US";
    if (showPricesForCountries.indexOf(yourBaseCountry) == -1) {
        showPricesForCountries.push(yourBaseCountry);
    }
}

for (var i = 0; i < showPricesForCountries.length; i++) {
    var countryName = showPricesForCountries[i];
    if (countryName in settings) {
        var regionSettings = settings[countryName];
        var country = regionSettings.country;
        var firstPage = new SteamPage(country[0]["name"], country[0]["code"],
            regionSettings["currencyCode"], regionSettings["valuePattern"],
            regionSettings["replaceVal"], regionSettings["vat"], countryName, null);
        if (countryName === yourBaseCountry)
        {
            baseCountry = firstPage;
            baseCurrency = firstPage.currencyCode;
        }
        for (var j = 1; j < country.length; ++j) {
            var page = new SteamPage(country[j]["name"], country[j]["code"],
                regionSettings["currencyCode"], regionSettings["valuePattern"],
                regionSettings["replaceVal"], regionSettings["vat"], countryName, firstPage);
            if (countryName === yourBaseCountry)
            {
                baseCountry = page;
                baseCurrency = page.currencyCode;
            }
            pages.push(page);
        }
        pages.push(firstPage);
    }
}

if (baseCurrency == null) {
    console.log("Unrecognized base currency");
}

function detectCurrency(price) {
    if (pageCurrency != null)
        return;
    price = price.replace(/^\s+|\s+$/g, "");
    for (var i = 0; i < valuepatterns.length; i++)
        if (valuepatterns[i].pattern.exec(price)) {
            pageCurrency = valuepatterns[i].currency;
            if (yourLocalCurrency == null)
                yourLocalCurrency = pageCurrency;
            return;
        }
}

//Test the URL to see if we're on a game page
if (urlGamePattern.test(document.documentURI) || urlSalePattern.test(document.documentURI)) {
    if (document.body)
        init()
    else
        window.addEventListener('DOMContentLoaded', init, false);
}

var pricesStyle;

function init() {
    someNode = document.getElementById("global_header");

    var game_purchase_price = false;
    var discount_final_price = false;
    //Test to see if the game has a price
    divnodes = document.getElementsByTagName("div");
    for (i = 0; i < divnodes.length; i++) {
        if (divnodes[i].getAttribute("class") == "game_purchase_price price") {
            game_purchase_price = true;
            pricenodes.push(divnodes[i]);
            originalprices.push(divnodes[i].innerHTML);
            detectCurrency(divnodes[i].innerHTML);
            divnodes[i].innerHTML +=
                "<br/><span style='color: rgb(136, 136, 136);'>Collecting data...</span>"
            divnodes[i].style.textAlign = "left";
        }
        if ((divnodes[i].getAttribute("class") == "game_area_dlc_price") && (divnodes[i].innerHTML.indexOf("discount_final_price") == -1)) {
            if (showYourLocalCurrency && pageCurrency != yourLocalCurrency) {
                pricenodes_conly.push(divnodes[i]);
                originalprices_conly.push(divnodes[i].innerHTML);
                detectCurrency(divnodes[i].innerHTML);
                divnodes[i].innerHTML +=
                    "<span style='color: rgb(136, 136, 136);'>Collecting data...</span>"
                divnodes[i].style.textAlign = "left";
            }
        } else if ((divnodes[i].getAttribute("class") == "discount_final_price") && (divnodes[i].innerHTML.indexOf("<") == -1)) {
            if (divnodes[i - 4].parentNode.className != 'game_area_dlc_price') {
                discount_final_price = true;
                pricenodes.push(divnodes[i]);
                originalprices.push(divnodes[i].innerHTML);
                detectCurrency(divnodes[i].innerHTML);
                divnodes[i].innerHTML +=
                    "<br/><span style='color: rgb(136, 136, 136);'>Collecting data...</span>"
                divnodes[i].style.textAlign = "left";
            } else if (showYourLocalCurrency && pageCurrency != yourLocalCurrency) {
                pricenodes_conly.push(divnodes[i]);
                originalprices_conly.push(divnodes[i].innerHTML);
                detectCurrency(divnodes[i].innerHTML);
                divnodes[i].innerHTML +=
                    "<span style='color: rgb(136, 136, 136);'>Collecting data...</span>"
                divnodes[i].style.textAlign = "right";
            }
        }
    }
    if (pageCurrency == null) {
        console.log("Unrecognized currency");
    }

    //For security reasons, JavaScript code isn't allowed to fetch data from
    //external websites. Instead, we insert a HTML <script> tag that fetches
    //external javascript files. These will help with currency conversion.

    for (var i = 0; i < pages.length; i++)
        AddExchangeRateScript(baseCurrency, pages[i].currencyCode, false);

    if (showYourLocalCurrency) {
        for (var i = 0; i < pages.length; i++)
            AddExchangeRateScript(pages[i].currencyCode, yourLocalCurrency, true);
        AddExchangeRateScript(pageCurrency, yourLocalCurrency, true);
    }

    //If the current page contains a price,
    //start downloading regional versions of this page
    if ((pricenodes.length > 0) || (pricenodesdlc.length > 0)) {
        //Create cookie that prevents the age verification
        //dialog from breaking the script
        if (document.cookie.indexOf("birthtime") < 0) { //Check if cookie exists
            var date = new Date();
            date.setTime(date.getTime() + (365 * 24 * 60 * 60 * 1000)); //Expires in 365 days
            document.cookie = "birthtime=1; expires=" //birthtime is set to 1 Jan 1900
            + date.toGMTString() + "; path=/"
        }

        //Set up HTTP requests
        for (var i = 0; i < pages.length; i++) {
            var http = new window.XMLHttpRequest();
            http.onreadystatechange = stateChanged;
            http.open("GET", pages[i].getCountryPageUrl(), true);
            http.send(null);
            pages[i].http = http;
        }

        var style = document.createElement("style");
        style.type = "text/css";
        style.title = 'compareSteamPrices';
        document.getElementsByTagName('head')[0].appendChild(style);

        // Get stylesheet object
        for (i in document.styleSheets)
            if (document.styleSheets[i].title == 'compareSteamPrices')
                pricesStyle = document.styleSheets[i];

        if (game_purchase_price)
            pricesStyle.insertRule(".game_area_purchase_game .game_purchase_action{height:auto;bottom:auto}", pricesStyle.cssRules.length);
        if (discount_final_price)
            pricesStyle.insertRule(".game_purchase_discount{height:auto;padding-bottom:8px}", pricesStyle.cssRules.length);
        pricesStyle.insertRule(".game_purchase_action .game_purchase_price{height:auto;padding-bottom:8px}", pricesStyle.cssRules.length);
        pricesStyle.insertRule(".game_purchase_action.game_purchase_action_bg{height:auto}", pricesStyle.cssRules.length);

        var margin = 14 + 16 * pages.length;
        pricesStyle.insertRule(".game_area_purchase_game,.sale_page_purchase_package{margin-bottom:" + margin + "px!important}", pricesStyle.cssRules.length);
        pricesStyle.insertRule(".block.block_content{margin-bottom:" + margin + "px!important}", pricesStyle.cssRules.length);
        var padding = 14 * pages.length;
        pricesStyle.insertRule(".tab_item{padding-bottom:" + padding + "px}", pricesStyle.cssRules.length);
    }
}

function getConvFunction(currency, id) {
    if (currency != yourLocalCurrency)
        return "Math.round(" + currency + "to" + yourLocalCurrency + "(" + id + ".innerHTML * 100))/100";
    else
        return id + ".innerHTML";
}

//Extracts prices from the downloaded HTML and displays them
function stateChanged() {
    //Check to see of all scripts have completed
    for (var i = 0; i < pages.length; i++)
        if (!pages[i].http || pages[i].http.readyState != 4)
            return;
        //All requests completed, good to go

        //The pattern variables can't be reused because it's global, so just duplicate
    for (var i = 0; i < pages.length; i++) {
        pages[i].pricepattern = new RegExp(/<div class="(?:game_purchase_price price|discount_final_price)"[^>]*>([^<]+?)<\/div>/gi);
    }

    var conversionCode = "  if (currency == '" + baseCurrency + "') {convertedToLocal = basePrice;}\n";
    for (var currencyCode in exchangerateScripts) {
        if (currencyCode.substring(0, 3) == baseCurrency && currencyCode.substring(3, 6) != baseCurrency) {
            var code = currencyCode.substring(3, 6);
            conversionCode += "  else if (currency == '" + code + "') {convertedToLocal = " + baseCurrency + "to" + code + "(basePrice);}\n";
        }
    }

    var calcscript = "function getDifference(currency, basePrice, localPrice) " +
        "{\n" +
        "  var convertedToLocal; var lessmore; var diff;\n" +
        conversionCode +
        "  diff = Math.abs((localPrice/convertedToLocal)*100-100);\n" +

        "  if (localPrice == convertedToLocal) {lessmore = '<img src=\"http://www.steamunpowered.eu/orangebar.png\" width=\"9\" height=\"5\" border=\"0\">';}\n" +
        "  else if (localPrice > convertedToLocal) {lessmore = '<img src=\"http://www.steamunpowered.eu/uparrow.png\" width=\"7\" height=\"9\" border=\"0\">';}\n" +
        "  else {lessmore = '<img src=\"http://www.steamunpowered.eu/downarrow.png\" width=\"7\" height=\"9\" border=\"0\">';}\n" +

        " if (localPrice == convertedToLocal) {return ' <span style=\"color: #ac9b09; font-weight: normal\">(' + lessmore + ')</span>';}\n" +
        " else if (localPrice > convertedToLocal) {return '  <span style=\"color: #f00; font-weight: normal\">(' + Math.round(diff) + '% ' + lessmore + ')</span>'}\n" +
        " else return ' <span style=\"color: #4fc20f; font-weight: normal\">(' + Math.round(diff) + '% ' + lessmore + ')</span>';}\n";

    var calcscript_opera = "function getDifference(currency, basePrice, localPrice) " +
        "{\n" +
        "  var convertedToLocal; var lessmore; var diff;\n" +
        conversionCode +
        "  diff = Math.abs((localPrice/convertedToLocal)*100-100);\n" +

        "  if (localPrice == convertedToLocal) {lessmore = 'prices are equal'; return ' (' + lessmore + ')';} \n" +
        "  else if (localPrice > convertedToLocal) {lessmore = 'higher';}\n" +
        "  else {lessmore = 'lower';}\n" +
        "  return ' (' + Math.round(diff) + '% ' + lessmore + ')';}\n";

    var calculatescript = document.createElement("script");
    calculatescript.setAttribute("type", "text/javascript");
    //Shitty Opera browser detection
    if (window.navigator.appName == "Opera") {
        calculatescript.innerHTML = calcscript_opera;
    } else {
        calculatescript.innerHTML = calcscript;
    }
    document.body.insertBefore(calculatescript, someNode);

    if (showYourLocalCurrency && pageCurrency != yourLocalCurrency) {
        //For DLC on game page
        var mypriceHtml_conly;
        var myprice_conly;

        for (i = 0; i < pricenodes_conly.length; i++) {
            try {
                var myvaluepattern_conly = new RegExp(/([\d]+([,\.](\d\d|--))?)/i);
                mypriceHtml_conly = originalprices_conly[i];
                myprice_conly = parseFloat(myvaluepattern_conly.exec(originalprices_conly[i])[1]
                    .replace(",", ".").replace("--", "00"));
            } catch (err) {
                if (!mypriceHtml_conly || mypriceHtml_conly.length == 0)
                    mypriceHtml_conly = "N/A";
                myprice_conly = null;
            }
            if (showYourLocalCurrency) {
                pricenodes_conly[i].innerHTML = mypriceHtml_conly + " <span id='dlc" + i +
                    "' style='font-weight: bold; color: rgb(136, 136, 136);'>" + myprice_conly + "</span>";
                var dlc00 = document.createElement("script");
                dlc00.setAttribute("type", "text/javascript");
                dlc00.innerHTML = "var dlc = document.getElementById('dlc" + i + "');" +
                    "dlc.innerHTML = \"(\" + " + getConvFunction(pageCurrency, "dlc") + " + \" " + yourLocalCurrency + ")\";";
                document.body.insertBefore(dlc00, someNode);
            }
        }
    }

    var mypriceHtml;
    var myprice;

    for (i = 0; i < pricenodes.length; i++) {
        try {
            var myvaluepattern = new RegExp(/([\d]+([,\.](\d\d|--))?)/i);
            mypriceHtml = originalprices[i];
            myprice = parseFloat(myvaluepattern.exec(originalprices[i])[1].replace(",", ".").replace("--", "00"));
        } catch (err) {
            if (!mypriceHtml || mypriceHtml.length == 0)
                mypriceHtml = "N/A";
            myprice = null;
        }
        for (var j = 0; j < pages.length; j++)
            pages[j].findPrice();
        var first = true;
        var displayOnlyBase = true;
        for (var j = 0; j < pages.length; j++)
            if (pages[j].priceHtml) {
                pages[j].processPrice(i, pricenodes[i], first);
                if (baseCountry.countryCode != pages.countryCode)
                    displayOnlyBase = false;
                first = false;
            }
        if (displayOnlyBase) { //Ignore country codes, only display price for YOUR region
            var html;
            if (showYourLocalCurrency && (myprice != null)) {
                html = mypriceHtml + " <span id='myprice" + i + "' style='font-weight: bold;'>" + myprice + "</span>";
                var tmp1 = document.createElement("script");
                tmp1.setAttribute("type", "text/javascript");
                tmp1.innerHTML = "var myprice = document.getElementById('myprice" + i + "');" +
                    "myprice.innerHTML = \"(\" + " + getConvFunction(baseCountry.currencyCode, "myprice") + " + \" " +
                    yourLocalCurrency + ")\";";
                document.body.insertBefore(tmp1, someNode);
                createGetDifferenceScript("myprice" + i, baseCountry.currencyCode, baseCountry.price, myprice);
            } else {
                html = mypriceHtml + " <span id='myprice" + i + "'></span>";
                createGetDifferenceScript("myprice" + i, baseCountry.currencyCode, baseCountry.price, myprice);
            }
            if (first)
                pricenodes[i].innerHTML = html;
            else
                pricenodes[i].innerHTML += "<br>\n" + html;
        }
    }

    //Remove cookie that may store the wrong currency for this region
    document.cookie = "fakeCC=; expires=Fri, 27 Jul 2001 02:47:11 UTC; path=/";
}

function createGetDifferenceScript(elementid, currencystring, basePrice, localPrice) {
    if (basePrice && localPrice) {
        var getdiff = document.createElement("script");
        getdiff.setAttribute("type", "text/javascript");
        getdiff.innerHTML += "var node = document.getElementById('" + elementid + "');" + "if (node)" +
            "node.innerHTML += getDifference('" + currencystring + "', " + basePrice +
            ", " + localPrice + ");";
        document.body.insertBefore(getdiff, someNode);
    }
}
