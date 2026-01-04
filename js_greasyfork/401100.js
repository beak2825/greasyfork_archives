// ==UserScript==
// @name         MoveBuy
// @author       realfakedoorz [2302156]
// @match        https://www.torn.com/imarket.php*
// @match        https://www.torn.com/pmarket.php*

// @description  Moves the "Yes" button on Torn item listings for speedy purchases
// @version 0.0.7
// @namespace https://greasyfork.org/users/517405
// @downloadURL https://update.greasyfork.org/scripts/401100/MoveBuy.user.js
// @updateURL https://update.greasyfork.org/scripts/401100/MoveBuy.meta.js
// ==/UserScript==


const hideSuccess = true; // Hides success box if true

const callbackIMarket = function() {
    if(document.contains(document.querySelector(".items > .active"))){

        var container = document.querySelector (".items > .active");
        var firstTargDiv = container.querySelector (".yes-buy");
        var lastTargDiv = container.querySelector (".buy-link");
        //-- Swap last to first.

        if (firstTargDiv){
            try {
                lastTargDiv.replaceWith(firstTargDiv);
            } catch(error) {
                return
            }
        }
        var endLink = container.querySelector(".yes-buy");
        if (endLink){
            endLink.classList.remove("m-left10");
        }

        if (hideSuccess){
            var succ = container.querySelector(".success-buy");
            succ.style.display = "none";
        }
    }
}

const callbackPMarket = function() {
        if(document.contains(document.querySelector(".ui-state-active"))){

        var container = document.querySelector (".ui-state-active").parentNode;
        var firstTargDiv = container.querySelector (".yes");
        var lastTargDiv = container.querySelector (".wai-btn");
        //-- Swap last to first.

        if (firstTargDiv){
            try {
                lastTargDiv.replaceWith(firstTargDiv);
            } catch(error) {
                return
            }
        }
    }
}

var observerIMarket = new MutationObserver(callbackIMarket);
var observerPMarket = new MutationObserver(callbackPMarket);

var items = document.getElementById("item-market-main-wrap");
var points = document.getElementsByClassName("users-point-sell")[0];

var config = { attributes: true, childList: true, subtree: true };

if (window.location.href.indexOf("imarket") > -1) {
    console.log('Observing for active item selection');
    observerIMarket.observe(items, config);
} else {
    console.log('Changed points market links');
    //observerPMarket.observe(points, config);
    for (var i = 0; i < document.getElementsByClassName("expander").length; i++){
        var hrefTo = (document.getElementsByClassName("expander")[i].getAttribute("href")).split("&")
        var btn = document.getElementsByClassName("expander")[i].getElementsByClassName("action")[0]

        btn.className = "yes wai-support"
        btn.setAttribute("href", (hrefTo[0] + "1&" + hrefTo[1]))

        btn.style.marginTop = "-1px"
        btn.style.paddingTop = "1px"
        btn.style.marginBottom = "-1px"
        btn.style.paddingBottom = "1px"

        var btnInner = btn.getElementsByTagName("button")[0]
        btnInner.className = ""
        btnInner.style.border = "None"
        btnInner.style.background = "Transparent"
}

}