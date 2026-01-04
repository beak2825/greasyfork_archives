// ==UserScript==
// @name         Scrap.tf Helper
// @version      1.3
// @description  When you click on a hat it will check if it is profit or not
// @author       colux
// @match        https://scrap.tf/buy/hats
// @match        https://scrap.tf/buy/items
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/notyf@3/notyf.min.js
// @namespace sth
// @downloadURL https://update.greasyfork.org/scripts/395599/Scraptf%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/395599/Scraptf%20Helper.meta.js
// ==/UserScript==

var ignoreKeywords = ["Black", "BLACK","Gold","GOLD","White", "WHITE", "Pink", "PINK", "Lime", "LIME", "Green", "GREEN",
                      "A Color Similar to Slate", "A Deep Commitment to Purple", "A Distinctive Lack of Hue", "A Mann's Mint",
                      "After Eight", "Aged Moustache Grey", "An Extraordinary Abundance of Tinge", "Australium Gold",
                      "Color No. 216-190-216","Dark Salmon Injustice","Drably Olive", "Indubitably Green", "Mann Co. Orange",
                      "Muskelmannbraun","Noble Hatter's Violet","Peculiarly Drab Tincture","Pink as Hell",
                      "Radigan Conagher Brown","The Bitter Taste of Defeat and Lime","The Color of a Gentlemann's Business Pants",
                      "Ye Olde Rustic Colour","Zepheniah's Greed", "halloween", "Halloween", "Spell", "Spirit", "SPIRIT",
                      "An Air of Debonair","Balaclavas Are Forever", "Cream Spirit", "Operator's Overalls", "Team Spirit",
                      "The Value of Teamwork", "Waterlogged Lab Coat", "Balaclavas","BALACLAVAS", "Teamwork","TEAMWORK","COLORS",
                      "Colors", "DEEP", "Deep", "Purple", "PURPLE"]
var keyPrice = 0;

//A Hacky way to add Notyf's css to the page without using <link> (it's blocked in scrap.tf)
var style = "<style>@-webkit-keyframes notyf-fadeinup{0%{opacity:0;transform:translateY(25%)}to{opacity:1;transform:translateY(0)}}@keyframes notyf-fadeinup{0%{opacity:0;transform:translateY(25%)}to{opacity:1;transform:translateY(0)}}@-webkit-keyframes notyf-fadeinleft{0%{opacity:0;transform:translateX(25%)}to{opacity:1;transform:translateX(0)}}@keyframes notyf-fadeinleft{0%{opacity:0;transform:translateX(25%)}to{opacity:1;transform:translateX(0)}}@-webkit-keyframes notyf-fadeoutright{0%{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(25%)}}@keyframes notyf-fadeoutright{0%{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(25%)}}@-webkit-keyframes notyf-fadeoutdown{0%{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(25%)}}@keyframes notyf-fadeoutdown{0%{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(25%)}}@-webkit-keyframes ripple{0%{transform:scale(0) translateY(-45%) translateX(13%)}to{transform:scale(1) translateY(-45%) translateX(13%)}}@keyframes ripple{0%{transform:scale(0) translateY(-45%) translateX(13%)}to{transform:scale(1) translateY(-45%) translateX(13%)}}.notyf{position:fixed;top:0;left:0;height:100%;width:100%;color:#fff;z-index:9999;display:flex;flex-direction:column;align-items:flex-end;justify-content:flex-end;pointer-events:none;box-sizing:border-box;padding:20px}.notyf__icon--error,.notyf__icon--success{height:21px;width:21px;background:#fff;border-radius:50%;display:block;margin:0 auto;position:relative}.notyf__icon--error:after,.notyf__icon--error:before{content:\"\";background:currentColor;display:block;position:absolute;width:3px;border-radius:3px;left:9px;height:12px;top:5px}.notyf__icon--error:after{transform:rotate(-45deg)}.notyf__icon--error:before{transform:rotate(45deg)}.notyf__icon--success:after,.notyf__icon--success:before{content:\"\";background:currentColor;display:block;position:absolute;width:3px;border-radius:3px}.notyf__icon--success:after{height:6px;transform:rotate(-45deg);top:9px;left:6px}.notyf__icon--success:before{height:11px;transform:rotate(45deg);top:5px;left:10px}.notyf__toast{display:block;overflow:hidden;pointer-events:auto;-webkit-animation:notyf-fadeinup .3s ease-in forwards;animation:notyf-fadeinup .3s ease-in forwards;box-shadow:0 3px 7px 0 rgba(0,0,0,.25);position:relative;padding:0 15px;border-radius:2px;max-width:300px;transform:translateY(25%);box-sizing:border-box}.notyf__toast--disappear{transform:translateY(0);-webkit-animation:notyf-fadeoutdown .3s forwards;animation:notyf-fadeoutdown .3s forwards;-webkit-animation-delay:.25s;animation-delay:.25s}.notyf__toast--disappear .notyf__icon,.notyf__toast--disappear .notyf__message{-webkit-animation:notyf-fadeoutdown .3s forwards;animation:notyf-fadeoutdown .3s forwards;opacity:1;transform:translateY(0)}.notyf__toast--disappear .notyf__dismiss{-webkit-animation:notyf-fadeoutright .3s forwards;animation:notyf-fadeoutright .3s forwards;opacity:1;transform:translateX(0)}.notyf__toast--disappear .notyf__message{-webkit-animation-delay:.05s;animation-delay:.05s}.notyf__toast--upper{margin-bottom:20px}.notyf__toast--lower{margin-top:20px}.notyf__toast--dismissible .notyf__wrapper{padding-right:30px}.notyf__ripple{height:400px;width:400px;position:absolute;transform-origin:bottom right;right:0;top:0;border-radius:50%;transform:scale(0) translateY(-51%) translateX(13%);z-index:5;-webkit-animation:ripple .4s ease-out forwards;animation:ripple .4s ease-out forwards}.notyf__wrapper{display:flex;align-items:center;padding-top:17px;padding-bottom:17px;padding-right:15px;border-radius:3px;position:relative;z-index:10}.notyf__icon{width:22px;text-align:center;font-size:1.3em;opacity:0;-webkit-animation:notyf-fadeinup .3s forwards;animation:notyf-fadeinup .3s forwards;-webkit-animation-delay:.3s;animation-delay:.3s;margin-right:13px}.notyf__dismiss{position:absolute;top:0;right:0;height:100%;width:26px;margin-right:-15px;-webkit-animation:notyf-fadeinleft .3s forwards;animation:notyf-fadeinleft .3s forwards;-webkit-animation-delay:.35s;animation-delay:.35s;opacity:0}.notyf__dismiss-btn{background-color:rgba(0,0,0,.25);border:none;cursor:pointer;transition:opacity .2s ease,background-color .2s ease;outline:none;opacity:.35;height:100%;width:100%}.notyf__dismiss-btn:after,.notyf__dismiss-btn:before{content:\"\";background:#fff;height:12px;width:2px;border-radius:3px;position:absolute;left:calc(50% - 1px);top:calc(50% - 5px)}.notyf__dismiss-btn:after{transform:rotate(-45deg)}.notyf__dismiss-btn:before{transform:rotate(45deg)}.notyf__dismiss-btn:hover{opacity:.7;background-color:rgba(0,0,0,.15)}.notyf__dismiss-btn:active{opacity:.8}.notyf__message{vertical-align:middle;position:relative;opacity:0;-webkit-animation:notyf-fadeinup .3s forwards;animation:notyf-fadeinup .3s forwards;-webkit-animation-delay:.25s;animation-delay:.25s;line-height:1.5em}@media only screen and (max-width:480px){.notyf{padding:0}.notyf__ripple{height:600px;width:600px;-webkit-animation-duration:.5s;animation-duration:.5s}.notyf__toast{max-width:none;border-radius:0;box-shadow:0 -2px 7px 0 rgba(0,0,0,.13);width:100%}.notyf__dismiss{width:56px}}</style>"
document.head.insertAdjacentHTML("beforeend", style);
// Create an instance of Notyf
const notyf = new Notyf({
    duration: 3500,
    position: {
        x: 'right',
        y: 'top',
    },
    types: [
        {
            type: 'success',
            background: 'rgb(61, 199, 99)',
            icon: false
        },
        {
            type: 'error',
            background: 'rgb(237, 61, 61)',
            icon: false
        },
        {
            type: 'info',
            background: '#2c3e50',
            icon: false
        },
        {
            type: 'info2',
            background: '#2980b9',
            icon: false
        }
    ]
});
function EToast(msg)
{
    notyf.open({
        type: 'error',
        message: msg
    });
    // This is bad code
    var toasts = document.getElementsByClassName("notyf__toast");
    for (let item of toasts) {
        item.style.maxWidth="60%"
    }
    var ripple = document.getElementsByClassName("notyf__ripple");
    for (let item of ripple) {
        item.style.width="200%"
    }
}
function IToast(msg)
{
    notyf.open({
        type: 'info',
        message: msg
    });
    // This is bad code
    var toasts = document.getElementsByClassName("notyf__toast");
    for (let item of toasts) {
        item.style.maxWidth="60%"
    }
    var ripple = document.getElementsByClassName("notyf__ripple");
    for (let item of ripple) {
        item.style.width="200%"
    }
}
function I2Toast(msg)
{
    notyf.open({
        type: 'info2',
        message: msg
    });
    // This is bad code
    var toasts = document.getElementsByClassName("notyf__toast");
    for (let item of toasts) {
        item.style.maxWidth="60%"
    }
    var ripple = document.getElementsByClassName("notyf__ripple");
    for (let item of ripple) {
        item.style.width="200%"
    }
}
function SToast(msg)
{
    notyf.open({
        type: 'success',
        message: msg
    });
    // This is bad code
    var toasts = document.getElementsByClassName("notyf__toast");
    for (let item of toasts) {
        item.style.maxWidth="60%"
    }
    var ripple = document.getElementsByClassName("notyf__ripple");
    for (let item of ripple) {
        item.style.width="200%"
    }
}

function stripHtmlFromString(html)
{
    var doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
}
function getItemQualityIndex(classString)
{
    IToast("Trying to get the item's quality index")
    let classArray = classString.split(' ');
    let quality = null;
    classArray.forEach(function(item, index){
        if(item.startsWith("quality"))
        {
            //regex to find the last number on a string ex: quality6 will return 6
            quality = item.match(/\d+$/);
            if (quality == null)
            {
                //Something went terribly wrong, just reload the page
                alert("Something went terribly wrong under the hood while getting the quality index, reloading the page");
                location.reload();
                return null;
            }
        }
    })
    if (quality == null)
    {
        //Something went terribly wrong, just reload the page
        alert("Something went terribly wrong under the hood while getting the quality index, reloading the page");
        location.reload();
        return null;
    }

    return quality[0];
}
function checkIfIsPainted(element)
{
    if(element.getElementsByClassName("paintcolor").length > 0){return true;}
    return false;
}
function checkIfItemIsCraftable(element)
{
    return element.attributes.getNamedItem("class").value.includes("uncraft") ? -1 : 1;
}
function getItemPrice(item)
{
    IToast("Trying to get the item price")
    let value_indicator = item.getElementsByClassName("item-value-indicator")[0];
    let raw_value = value_indicator.textContent;
    let contains_keys = false;
    let contains_refined = false;

    let finalPrice;

    if(raw_value.includes("refined")){contains_refined = true}
    else if(raw_value.includes("keys") || raw_value.includes("key")){contains_keys = true}
    else
    {
        alert("Could not find the price of the item");
        location.reload();
        return;
    }

    if(contains_keys)
    {
        IToast("Converting item price to backpack.tf format")
        let separated = raw_value.split(" ");
        if(separated.includes("ref"))
        {
            finalPrice = [parseFloat(separated[0]), parseFloat(separated[2])]
        }
        else{
            finalPrice = [parseFloat(separated[0]), 0]
        }
        return finalPrice;
    }
    if(contains_refined)
    {
        IToast("Converting item price to backpack.tf format")
        let separated = raw_value.split(" ");
        finalPrice = [0,parseFloat(separated[0])];
        return finalPrice;
    }
}
function bptfFetchResponse(rspObj, itemV, itema, CUrl)
{
    SToast("Got a response from backpack.tf")
    let toBuy = rspObj.response.buy;
    if(toBuy.total == 0){alert("There are no listings for this item"); location.reload(); return;}

    let proxK = 0;
    let proxR = 0;
    //also bad code
    let foundProfitable = false;
    let ignore_count = 0;
    toBuy.listings.forEach(function(item, index){
        if(foundProfitable){return;}
        //full of bad code :D
        let ignore = false;
        //TODO: Ignore if keyword present
        ignoreKeywords.forEach(function(keyword, index){
            let lower = keyword.toLowerCase();
            let caps = keyword.toUpperCase();
            let firstcaps = keyword[0].toUpperCase() + keyword.slice(1);

            let desc = item.details;

            if(desc.includes(keyword) || desc.includes(lower) || desc.includes(caps) || desc.includes(firstcaps))
            {
                ignore = true;
                ignore_count++;
            }
        })
        if(ignore){ignore = false; return;}
        if(item.automatic != 1){return;}
        let priceKeys = item.currencies.keys;
        //bptf does not return 0 if the value in keys is 0, it just removes it from the json causing it to return "undefined"
        if(priceKeys == undefined){priceKeys = 0}
        let priceRef = item.currencies.metal;



        let scrapTfsum = itemV[0] * 54.33 + itemV[1];
        let bptfsum = priceKeys * 54.33 + priceRef;
        if(priceKeys > proxK){proxK = priceKeys}
        if(priceRef > proxR){proxR = priceRef}
        if(scrapTfsum < bptfsum)
        {
            //Profitable
            foundProfitable = true;
            SToast('Current item is profitable!  ' + itemV[0] + " keys " + itemV[1] + "refs  <  " + priceKeys + " keys " + priceRef + " refs");
            window.open(CUrl)
            console.log("Ignored " + ignore_count + " listings.")
            return;
        }
        itema.click();
    })
    console.log("Ignored " + ignore_count + " listings.")
    if(foundProfitable){foundProfitable = false;return;}
    EToast("Couldn't find a profitable listing. " + "The closest we got: " + proxK + " keys / " + proxR + " refs")
}
function bptfFetchError(rspObj)
{
    let error = `Backpack.tf fetch error: ${rspObj.status}!  ${rspObj.statusText}`;
    EToast(error)
}

GM_xmlhttpRequest ( {
    method:         "GET",
    url:            "https://backpack.tf/api/IGetCurrencies/v1?key=5df94e39098f906db93eacb3",
    responseType:   "json",
    onload:         function(obj){keyPrice = obj.response.response.currencies.keys.price.value; SToast("Updated key value")},
    onabort:        bptfFetchError,
    onerror:        bptfFetchError,
    ontimeout:      bptfFetchError
} );

// Callback function to execute when a item is selected
const ObserverCallback = function(mutationsList, observer) {
    for(let mutation in mutationsList)
    {
        mutationsList[mutation].addedNodes.forEach(function(item, index){
            const apiTemplate = "https://backpack.tf/api/classifieds/search/v1?item_names=1&item={n}&quality={q}&key=5df94e39098f906db93eacb3&killstreak_tier=0&&craftable={c}"
            const classifiedsTemplate = "https://backpack.tf/classifieds?craftable={c}&item={n}&quality={q}&killstreak_tier=0"
            let apiUrl = ""
            let classifiedsUrl = "";
            let itemName;
            let itemCraftable;
            let itemNameEncoded;
            let itemValue;
            let itemQualityIndex;
            try
            {
                itemName = item.attributes.getNamedItem("data-title").value;
                //for some reason stranges have html tags in their names >:(
                let itemNameOld = itemName;
                itemName = stripHtmlFromString(itemName)
                if(itemNameOld != itemName){
                    itemName = itemName.replace("Strange ", "");
                }
                itemCraftable = checkIfItemIsCraftable(item);
                itemNameEncoded = encodeURI(itemName);
                //Get the item price formatted for backpack.tf
                itemValue = getItemPrice(item);
                I2Toast(itemName + " " + itemValue[0] + " keys / " + itemValue[1] + " refs");
                itemQualityIndex = getItemQualityIndex(item.attributes.getNamedItem("class").value);
                let painted = checkIfIsPainted(item);
                //Ignore item if it's painted
                if(painted == true){alert("Painted items are not supported right now."); item.click(); return;}

                apiUrl = apiTemplate.replace("{n}", itemNameEncoded);
                apiUrl = apiUrl.replace("{q}", itemQualityIndex);
                apiUrl = apiUrl.replace("{c}", itemCraftable);
                classifiedsUrl = classifiedsTemplate.replace("{n}", itemNameEncoded);
                classifiedsUrl = classifiedsUrl.replace("{q}", itemQualityIndex);
                classifiedsUrl = classifiedsUrl.replace("{c}", itemCraftable);

                //Do info logging
                console.clear();
                console.log("--------------------")
                console.log("Got item");
                console.log("Name: " + itemName);
                console.log("Name (URI Encoded): " + itemNameEncoded);
                console.log("Backpack.tf api url: " + apiUrl);
                console.log("Price: " + itemValue[0] + " keys, " + itemValue[1] + " refined");
                console.log("Item quality index: " + itemQualityIndex);
                console.log("Craftable: " + itemCraftable)
                console.log("--------------------")

            }
            catch(e)
            {
                item.click();
                alert(e.stack)
                alert("Reloading page...");
                location.reload();
                return;
            }
            IToast("Trying to get item data from backpack.tf")
            GM_xmlhttpRequest ( {
                method:         "GET",
                url:            apiUrl,
                responseType:   "json",
                onload:         function(obj){bptfFetchResponse(obj, itemValue, item, classifiedsUrl)},
                onabort:        bptfFetchError,
                onerror:        bptfFetchError,
                ontimeout:      bptfFetchError
            } );

        })
    }
};

//Observe the selected item div
const observer = new MutationObserver(ObserverCallback);
observer.observe(document.querySelector("#buy-selected-container > div.buy-selected-items.items-container"), { attributes: false, childList: true, subtree: false });