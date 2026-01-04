// ==UserScript==
// @name         Krunker Market Tweaks
// @namespace    http://tampermonkey.net/
// @version      v1.5
// @description  Tweaks the krunker market
// @author       Catten
// @include        https://krunker.io/social.html
// @include        https://krunker.io/social.html?p=*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/522014/Krunker%20Market%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/522014/Krunker%20Market%20Tweaks.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //Hide popup when ESC is pressed or clicking away
    document.addEventListener("keydown", function(e) {
        if(e.key == "Escape") {
            hideElementById("popupHolder");
        } else if(e.key === "r") {
            toggleHideRepeats();
        }
    });
    let popup = document.getElementById("popupHolder");
    popup.addEventListener("click", () => {
        //Only hide the elements if not hovering over them, so that it doesn't hide a button you're trying to press
        let popup = document.getElementById("popupHolder");
        let hoveringOnButton = false;
        for(let i = 0; i < popup.children.length; i++) {
            if(popup.children[i].matches(":hover")) {
                hoveringOnButton = true;
                break;
            }
        }
        if(popup.matches(":hover") && !hoveringOnButton) {
            hideElementById("popupHolder");
        }
    });

    let pageType = getPageType(document.URL);
    if(pageType == "main") {
        //Only play the music on the normal market tab, because otherwise there could be multiple going at the same time
        playMusic();
    } else if(pageType == "item") {
        //Wait for kr amount to be loaded for auto-filling krunkflip
        let krLoaded = false;
        const krInterval = setInterval(function(){
            const profileKR = document.getElementById("profileKR");
            if(profileKR) {
                clearInterval(krInterval);
                krLoaded = true;
            }
        }, 100);

        //Wait for item container div to be loaded for placing krunkflip
        let itemLoaded = false;
        const itemInterval = setInterval(function(){
            const itemDiv = document.getElementById("itemsalesList");
            if(itemDiv) {
                clearInterval(itemInterval);
                itemLoaded = true;
            }
        }, 100);

        //Wait for page to load important stuff before doing things
        const loadInterval = setInterval(function(){
            if(krLoaded && itemLoaded) {
                clearInterval(loadInterval);
                afterItemLoad();
            }
        }, 100);
    }
})();

function getPageType(url) {
    if(document.URL == "https://krunker.io/social.html") {
        return "main";
    } else if(document.URL.includes("https://krunker.io/social.html?p=itemsales&i=")) {
        return "item";
    } else {
        return "unknown";
    }
}

function afterItemLoad() {
    createKrunkFlip();
    setInterval(function(){
        runKrunkFlip()
    }, 100);
}

function hideElementById(id) {
    const element = document.getElementById(id);
    element.style.display = "none";
}

function toggleHideElement(element) {
    if(element.style.display == "none") {
        element.style.display = "inline-block";
    } else {
        element.style.display = "none";
    }
}

function playMusic() {
    const music = new Audio("https://CattenWithGun.github.io/Krunker-Market-Tweaks/marketplace.mp3");
    music.loop = true;
    music.play();
}

class MarketItem {
    constructor(itemCard) {
        this.itemCard = itemCard;
        this.itemId = itemCard.getAttribute("data-index");
        let priceToParse = itemCard.querySelector(".marketPrice").textContent;
        this.price = parseFloat(parseKR(priceToParse));
    }
}

function toggleHideRepeats() {
    let itemCardList = document.getElementById("marketList").children;
    let itemList = [];
    for(let i = 0; i < itemCardList.length; i++) {
        if(itemCardList[i].nodeName == "STYLE") {
            continue;
        }
        let currentItem = new MarketItem(itemCardList[i]);
        itemList.push(currentItem);
    }
    itemList.sort((a, b) => a.price - b.price);
    let usedIds = [];
    for(let i = 0; i < itemList.length; i++) {
        if(usedIds.includes(itemList[i].itemId)) {
            toggleHideElement(itemList[i].itemCard);
        } else {
            usedIds.push(itemList[i].itemId);
        }
    }
}

function runKrunkFlip() {
    cycleColor(2, 0, 30);

    const krBox = document.getElementById("kr");
    const costBox = document.getElementById("cost");
    const priceBox = document.getElementById("price");

    const profitOutput = document.getElementById("profit");
    const markupOutput = document.getElementById("markup");
    const verdictOutput = document.getElementById("verdict");

    if(isNullOrEmpty(krBox.value) || isNullOrEmpty(costBox.value) || isNullOrEmpty(priceBox.value)) {
        if(verdictOutput.innerText !== "Not enough info") {
            profitOutput.innerText = "";
            markupOutput.innerText = "";
            verdictOutput.innerText = "Not enough info";
        }
        return;
    }

    const kr = parseFloat(krBox.value);
    const cost = parseFloat(costBox.value);
    const price = parseFloat(priceBox.value);

    const krTaxForListing = Math.ceil(price * 0.10);
    const profit = price - cost - krTaxForListing;
    const markup = price / cost * 100 - 100;

    if(kr - krTaxForListing - cost < 0) {
        verdictOutput.innerHTML = "Can't pay fees";
        return;
    }

    if(markup >= 20 && profit > 0) {
        verdictOutput.innerHTML = "Stonks";
    } else {
        verdictOutput.innerHTML = "Not stonks";
    }

    profitOutput.innerHTML = round(profit);
    markupOutput.innerHTML = round(markup);
}

let hue = 0;
let adding = true;
function cycleColor(speed, hueMin, hueMax) {
    const krunkFlipContainer = document.getElementById("krunkFlipContainer");
    const title = document.getElementById("title");
    krunkFlipContainer.style.borderColor = `hsl(${hue}, 100%, 50%)`;
    title.style.color = `hsl(${hue}, 100%, 50%)`;
    if(adding) {
        if(hue + speed > hueMax) {
            adding = false;
        } else {
            hue += speed;
        }
    } else {
        if(hue - speed < hueMin) {
            adding = true;
        } else {
            hue -= speed;
        }
    }
}

function round(num) {
    return Math.ceil(num * 100) / 100;
}

function isNullOrEmpty(string) {
    if(typeof(string) === "string" && string.length === 0) {
        return true
    } else if(string === null) {
        return true
    } else {
        return false;
    }
}

function parseKR(string) {
    return string.substring(0, string.length - 3).replace(/,/g, '');
}

function createKrunkFlip() {
    const itemsalesList = document.getElementById("itemsalesList");
    const krunkFlipContainer = document.createElement("div");
    krunkFlipContainer.id = "krunkFlipContainer";
    const krunkFlipContainerSpace = document.createElement("br");
    itemsalesList.appendChild(krunkFlipContainerSpace);
    itemsalesList.appendChild(krunkFlipContainer);
    document.getElementById("krunkFlipContainer").innerHTML = `
<style>
#krunkFlipContainer {
  font-family: 'GameFont';
  vertical-align: bottom;
  font-size: 20px;
  margin-bottom: 20px;
  padding: 20px;
  width: 680px;
  text-align: left;
  background-color: #292929;
  display: inline-block;
  border: medium solid orange;
  border-radius: 12px;
}
#title {
  padding: 10px
}
.text {
  font-family: 'GameFont';
  color:rgba(255,255,255,0.4);
}
.smallText {
  font-family: 'GameFont';
  color:rgba(255,255,255,0.4);
  font-size: 14px;
}
.smallLightText {
  font-family: 'GameFont';
  color:rgba(255,255,255,0.8);
  font-size: 14px;
}
.tiny {
  font-family: 'GameFont';
  color:rgba(255,255,255,0.4);
  font-size: 9px;
  text-align: left;
  horizontal-align: left;
  vertical-align: bottom;
  position: relative;
  display: block;
}
input {
  horizontal-align: left;
  width: 67%;
  background: rgba(255,255,255,0.3);
  color: rgba(255,255,255,0.6);
}
::placeholder {
  color: rgba(255,255,255,0.3);
}
</style>

<div id="title" class="text"; style="max-width: fit-content; margin-left: auto; margin-right: auto;">KrunkFlip</div>
<div id="lhs" style="float:left; background-color: rgba(0, 0, 0, 0.2); border-radius: 12px; padding: 20px; width: 43%;">
  <div id="krDiv">
    <input id="kr" type="number" min="0" placeholder="KR Owned"/>
    <label class="smallLightText">KR</label>
  </div>
  <div id="costDiv">
    <input id="cost" type="number" min="0" placeholder="Cost of cosmetic"/>
    <label class="smallLightText">KR</label>
    <label class="smallText">Cost</label>
  </div>
  <div id="priceDiv">
    <input id="price" type="number" min="0" placeholder="Sell price"/>
    <label class="smallLightText">KR</label>
    <label class="smallText">Price</label>
  </div>
</div>
<div id="rhs" style="float:right; background-color: rgba(0, 0, 0, 0.2); border-radius: 12px; padding: 20px; width: 43%;">
  <div id="profitsDiv">
    <label class="smallText">Profit:</label>
    <label id="profit" class="smallText"></label>
    <label class="smallLightText">KR</label>
  </div>
  <div id="markupDiv">
    <label class="smallText">Markup:</label>
    <label id="markup" class="smallText"></label>
    <label class="smallLightText" for="markup">%</label>
  </div>
  <div id="verdictDiv">
    <label id="verdict" class="smallText">Not enough info</label>
  </div>
</div>
<!--No clue why I need so many line breaks to get the thing off of rhs, (or why I need any to begin with) but it does work-->
<br>
<br>
<br>
<br>
<br>
<div id="detailsDiv">
  <p class="tiny" style="display: inline;">Made by CattenWithGun - v1.5</p>
</div>
`;
    const inputKRBox = document.getElementById("kr");
    const currentKR = document.getElementById("profileKR").textContent;
    const parsedKR = parseKR(currentKR);
    inputKRBox.value = parsedKR;
}