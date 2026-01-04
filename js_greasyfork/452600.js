// ==UserScript==
// @name         Unit Price Helper
// @namespace    https://github.com/yzhu27/UnitPriceHelper/
// @version      0.1
// @description  Automatically generate unit price for applicable items when shopping online.
// @copyright    @yzhu27, @Internationale-NCSU, @Lognam-Huang, @MZWANGgg, @IsleZhu
// @match        http://www.harristeeter.com/*
// @include      http://www.harristeeter.com/*
// @match        https://www.harristeeter.com/*
// @include      https://www.harristeeter.com/*
// @match        http://www.costco.com/*
// @include      http://www.costco.com/*
// @match        https://www.costco.com/*
// @include      https://www.costco.com/*
// @match        http://www.target.com/*
// @include      http://www.target.com/*
// @match        https://www.target.com/*
// @include      https://www.target.com/*
// @require      https://code.jquery.com/jquery-3.6.1.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452600/Unit%20Price%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/452600/Unit%20Price%20Helper.meta.js
// ==/UserScript==


const RULE_SET = {
    'https://www.harristeeter.com/p/': {
        price_label: "data",
        capacity_label: "span[id=ProductDetails-sellBy-unit]",
        function: harrisConverter,
        label_type: 'value',
        append_function: appendForHarris,
        website_type: 'static'
    },
    'https://www.harristeeter.com/pl/': {
        price_label: "data",
        capacity_label: "span[class='kds-Text--s text-neutral-more-prominent']",
        function: harrisConverter,
        label_type: 'value',
        append_function: appendForHarris,
        website_type: 'static'
    },
    'https://www.harristeeter.com/search': {
        price_label: "data",
        capacity_label: "span[class='kds-Text--s text-neutral-more-prominent']",
        function: harrisConverter,
        label_type: 'value',
        append_function: appendForHarris,
        website_type: 'static'
    },
    'https://www.costco.com/': {
        price_label: 'div[class=price]',
        capacity_label: 'span[class=description]',
        function: costcoConverter,
        label_type: 'text',
        append_function: appendForCostco,
        website_type: 'static'
    },
    'https://www.target.com/s': {
        price_label: "span[data-test=current-price]",
        capacity_label: "div[class='Truncate-sc-10p6c43-0 dWgRjr']",
        function: costcoConverter, // target could share the converter with costco.
        label_type: 'text',
        append_function: appendForTarget,
        website_type: 'dynamic'
    },
    'https://www.wholefoodsmarket.com/search': {
        price_label: "span[class=regular_price]",
        capacity_label: "h2[data-testid=product-tile-name]",
        //function: targetConverter,
        label_type: 'text',
        append_function: appendForTarget,
        website_type: 'dynamic'
    }
};
const TARGET_URL_PREFIX = [
    'https://www.harristeeter.com/p/',
    'https://www.harristeeter.com/search',
    'https://www.costco.com/',
    'https://www.target.com/s',
    'https://www.wholefoodsmarket.com/search',
    'https://www.harristeeter.com/pl/'
];
const REGEX = {
    unit : 'gal|g|kg|lbs|lb|fl oz|oz|qt|fl. oz|ml|litter|Litter|l|L',
    quant : 'ct|pack|count',
    float : "\\d+\\.?\\d*?(?:\\s*-\\s*\\d+\\.?\\d*?)?"
};
(function () {
    var host = window.location.host.toLowerCase();
    window.priceTipEnabled = true;
    console.log(host)
    var url = window.location.href.toLowerCase();
    for (let i = 0; i < TARGET_URL_PREFIX.length; i++) {
        if (url.startsWith(TARGET_URL_PREFIX[i])) {
            if (RULE_SET[TARGET_URL_PREFIX[i]].website_type == 'static') {
                addListPriceTips(TARGET_URL_PREFIX[i])
            } else if (RULE_SET[TARGET_URL_PREFIX[i]].website_type == 'dynamic') {
                window.addEventListener("wheel", event => {
                    addListPriceTips(TARGET_URL_PREFIX[i])
                })
            }
        }
    }
})();
/**
 * @property {Function}addListPriceTips Acts like an controller. Designated different converter 
 *                                      and append function for 'addTipsHelper()' according to 'url_prefix' 
 * @param {string} url_prefix the unique identifier prefix of target url.
 * @returns no return value
 */
function addListPriceTips(url_prefix) {
    console.log('addListPriceTips_ is called:' + url_prefix);
    // query didn't work for 'Target' website
    //console.log(document);
    var totalPrice = document.querySelectorAll(RULE_SET[url_prefix].price_label);
    var totalVolumn = document.querySelectorAll(RULE_SET[url_prefix].capacity_label);
    //console.log(RULE_SET[url_prefix].price_label);
    //console.log('len: '+totalPrice.length);
    //console.log('price: ' + totalPrice[0].textContent);
    //console.log('volume: ', totalVolumn[0].textContent);

    var labelType = RULE_SET[url_prefix].label_type;
    var len = totalPrice.length;

    for (let i = 0; i < len; i++) {
        if (totalPrice[i] === null || totalVolumn[i] === null) {
            continue;
        }
        if (labelType === 'value') {
            addTipsHelper(totalPrice[i].value, totalVolumn[i].textContent, RULE_SET[url_prefix].function, RULE_SET[url_prefix].append_function, i);
        } else if (labelType === 'text') {
            addTipsHelper(totalPrice[i].textContent, totalVolumn[i].textContent, RULE_SET[url_prefix].function, RULE_SET[url_prefix].append_function, i);
        }
    }
    console.log(len);
    return len;
}
/**
 * @property {Function}addTipsHelper Acts like an executor. Finished the unit calculating and converting according to the given params.
 * @param {string} price the raw price value extracted from labels
 * @param {string} title the raw title value extracted from labels. Volumn is matched using regex from title.
 * @returns no return value
 */
function addTipsHelper(price, title, func, appendFun, index) {
    var convertedResult = func(price, title);
    if (convertedResult != null) {
        console.log(convertedResult.finalPrice + '/' + convertedResult.finalUnit);
        appendFun(convertedResult, index);
    }

}
function appendForCostco(convertedResult, index) {
    console.log('unit price:' + convertedResult.finalPrice, 'unit: ' + convertedResult.finalUnit);
    var priceSpan = "[" + convertedResult.finalPrice + " / " + convertedResult.finalUnit + "]";
    document.getElementsByClassName('price')[index].append(priceSpan);
}
function appendForHarris(convertedResult, index) {
    var priceSpan = document.createElement('span');
    priceSpan.innerHTML = "[" + convertedResult.finalPrice + " / " + convertedResult.finalUnit + "]";
    priceSpan.className = 'kds-Price-promotional-dropCaps';
    //left border/margin fails to work
    priceSpan.style = "font-size: 16px; left-margin: 20px";

    //following line is originally working
    //document.getElementsByClassName('kds-Price-promotional kds-Price-promotional--decorated')[index].appendChild(priceSpan);

    //following is trying to solve discount item issue, still require testing
    //use the length of testResult to check whether the price/unit is already provided by the website
    //if it is provided, the length should be 1 - only has finalPrice as the result
    //otherwise, the length is 2 - finalPrice and finalUnit
    if (Object.keys(convertedResult).length == 2) {
        priceSpan.innerHTML = "[$" + convertedResult.finalPrice + " / " + convertedResult.finalUnit + "]";

        priceSpan.className = 'kds-Price-promotional-dropCaps';
        //left border/margin fails to work
        priceSpan.style = "font-size: 16px; left-margin: 20px";

        //not elegant, but works
        //use the length of class name to determine whether the item is having discount
        //if the item is having discount, the length should be 54
        //if the item is not having discount, the length should be 83
        var insertedTag = document.getElementsByClassName('kds-Price-promotional kds-Price-promotional--decorated')[index];
        if (insertedTag.className.length == 54) {
            insertedTag.appendChild(priceSpan);
        } else if (insertedTag.className.length == 83) {
            insertedTag.appendChild(priceSpan);
        } else {
            alert("ERROR: not tag to insert span");
        }


        //try to change CSS, this need to use append(), but failed because is regarded as string
        // var priceSpan = "<span class=\"kds-Price-promotional-dropCaps\">"+testResult.finalPrice+" / "+testResult.finalUnit+"</span>";
        // document.getElementsByClassName('kds-Price-promotional kds-Price-promotional--plain kds-Price-promotional--decorated')[0].append(priceSpan);

    } else {
        console.log("Price/unit is already provided.")
    }
}
function appendForTarget(convertedResult, index) {
    var priceSpan = "[" + convertedResult.finalPrice + " / " + convertedResult.finalUnit + "]";
    if (!document.querySelectorAll('span[data-test=current-price]')[index].textContent.endsWith('.')) {
        document.querySelectorAll('span[data-test=current-price]')[index].append(priceSpan + '.');
    }
}
function harrisConverter(price, title) {
    //solve if the price/unit is already provided by the website
    var itemFinalUnit = '';
    if (title[0] == '$') {
        itemFinalUnit = title;
        return {
            finalPrice: itemFinalUnit
        }
    } else {
        //quantity cannot solve 1/2 yet
        //quantity can already solve 0.5 by yZhu
        var itemQuantity = title.match(/([1-9]\d*\.?\d*)|(0\.\d*[1-9])/)[0];
        //console.log(itemQuantity);

        //optimize to solve special cases as '20 ct 0.85'
        var itemUnit = title.match(/\s((([a-zA-Z]*\s?[a-zA-Z]+)*))/)[1];
        //console.log(itemUnit);
        var itemPriceByUnit = parseFloat(price) / parseFloat(itemQuantity);
        //cut long tails after digit
        itemPriceByUnit = itemPriceByUnit.toFixed(3);
        //console.log(itemPriceByUnit);


        switch (itemUnit) {
            case 'gal': itemFinalUnit = 'gal';
                break;
            case 'oz': itemFinalUnit = 'oz';
                break;
            case 'fl oz': itemFinalUnit = 'oz';
                break;
            case 'ct': itemFinalUnit = 'count';
                break;
            case 'lb': itemFinalUnit = 'lb';
                break;
            case 'pack': itemFinalUnit = 'pack';
                break;
            case 'pk': itemFinalUnit = 'pack';
                break;
            case 'bottles': itemFinalUnit = 'Bottle';
                break;
            case 'cans': itemFinalUnit = 'can';
                break;
            case 'L': itemFinalUnit = 'L';
                break;
            case 'l': itemFinalUnit = 'L';
                break;
            case 'ml': itemFinalUnit = 'ml';
                break;
            case 'unit': itemFinalUnit = 'unit';
                break;
            case 'box': itemFinalUnit = 'box';
                break;
            case 'boxes': itemFinalUnit = 'box';
                break;
            case 'suit': itemFinalUnit = 'suit';
                break;
            case 'suits': itemFinalUnit = 'suit';
                break;
            case 'bag': itemFinalUnit = 'bag';
                break;
            case 'bags': itemFinalUnit = 'bag';
                break;
            //may be some other units else?

            default: itemFinalUnit = 'unknown unit';
        }

        if (itemPriceByUnit > 1000 || itemPriceByUnit < 0) {
            return null;
        }
        else {
            //console.log("Hihi");
            return {
                finalPrice: itemPriceByUnit,
                finalUnit: itemFinalUnit
            };
        }
    }
}

function costcoConverter(price, title) {
    title = title.trim().toLowerCase();
    console.log('title: ' + title);
    price = parseFloat(price.trim().substring(1));
    var regQuant = REGEX.quant;
    var regUnit = REGEX.unit;
    var regFloat = REGEX.float;
    var unitMatcher = new RegExp('(' + regFloat + ')-?\\s*?' + '('+ regUnit + ')');
    var quantMatcher = new RegExp('(' + regFloat + ')-?\\s*?' + '('+ regQuant + ')');
    var matchQuant = null;
    var matchUnit = null;
    matchQuant = quantMatcher.exec(title);
    matchUnit = unitMatcher.exec(title);
    var unit = ' ';
    var count = 'count';
    var quant = 1;
    var capacity = 1;
    if(matchQuant!=null){
        console.log(matchQuant[0]);
        count = matchQuant[2];
        quant = parseFloat(matchQuant[1]);
    }
    if(matchUnit!=null){
        console.log(matchUnit[0]);
        unit = matchUnit[2];
        capacity = parseFloat(matchUnit[1]);
    }
    var unitPrice = parseFloat(price) / (capacity*quant);
    if(unit === ' ' ){
        unit = count;
    }
    return {
        finalUnit: unit,
        finalPrice: Math.round(unitPrice * 100) / 100,
    };

}

if (typeof process === "object" && typeof require === "function") {
    module.exports={
        addListPriceTips,
        harrisConverter,
        costcoConverter,
        appendForHarris,
        appendForCostco,
        appendForTarget
    };
}