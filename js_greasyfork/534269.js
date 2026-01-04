// ==UserScript==
// @name         Flight Rising: 'Share Dragon' Widgets & Sales Listings (Chimaera's Edit)
// @namespace    chimaera
// @license      MIT
// @version      0.1
// @description  Generate forum sales listings for dragons, from the 'share' popup on a dragon's) page
// @author       You
// @match        https://www1.flightrising.com/dragon/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534269/Flight%20Rising%3A%20%27Share%20Dragon%27%20Widgets%20%20Sales%20Listings%20%28Chimaera%27s%20Edit%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534269/Flight%20Rising%3A%20%27Share%20Dragon%27%20Widgets%20%20Sales%20Listings%20%28Chimaera%27s%20Edit%29.meta.js
// ==/UserScript==

const geneRegex = /(\s*<[^<>]*>\s*)+/ig;
const ancientGeneRegex = /(\s*\([^\(\)]*\)\s*)+/ig;
const urlParamsRegex = /\?.*/ig;
const whitespaceRegex = /\s*  \s*/ig;

var forumCode;
var smallWidgetCode;
var coliWidgetCode;

function copyForumCode()
{
    navigator.clipboard.writeText(forumCode);
}

function copySmallWidgetCode()
{
    navigator.clipboard.writeText(smallWidgetCode);
}

function copyColiWidgetCode()
{
    navigator.clipboard.writeText(coliWidgetCode);
}

(function() {
    'use strict';

    var primaryHTML = document.querySelectorAll("#dragon-profile-primary-gene")[0].innerHTML;
    var primaryStrings = primaryHTML.replaceAll(geneRegex, ',').split(',');

    var secondaryHTML = document.querySelectorAll("#dragon-profile-secondary-gene")[0].innerHTML;
    var secondaryStrings = secondaryHTML.replaceAll(geneRegex, ',').split(',');

    var tertiaryHTML = document.querySelectorAll("#dragon-profile-tertiary-gene")[0].innerHTML;
    var tertiaryStrings = tertiaryHTML.replaceAll(geneRegex, ',').split(',');

    `[columns][right][emoji=primary gene size=1][/right][nextcol][b]${primaryStrings[0]}[/b][br]${primaryStrings[1]}[/columns][columns][right][emoji=secondary gene size=1][/right][nextcol][b]${secondaryStrings[0]}[/b][br]${secondaryStrings[1]}[/columns][columns][right][emoji=tertiary gene size=1][/right][nextcol][b]${tertiaryStrings[0]}[/b][br]${tertiaryStrings[1]}[/columns]`

    var dragonImageNode = document.querySelectorAll("#dragon-profile-dragon-frame > img")[0];
    var dragonImageURL = dragonImageNode.getAttribute("src");
    dragonImageURL = dragonImageURL.replaceAll(urlParamsRegex, '');

    var id = document.querySelectorAll("#dragon-profile-send-report")[0].getAttribute("data-did");

    var gender = document.querySelectorAll("#dragon-profile-icon-sex-tooltip > strong")[0].innerHTML.toLowerCase();

    var eyeElementHTML = document.querySelectorAll("#dragon-profile-physical > div > div:nth-child(2) > div:nth-child(6) > div > div > div.dragon-profile-stat-icon-value")[0].innerHTML;
    var eyeStrings = eyeElementHTML.replaceAll(geneRegex, ',').split(',');
    var eyeElement = eyeStrings[0].trim();
    var eyeType = eyeStrings[1].trim();

    var buyButton = `[url=http://www1.flightrising.com/auction-house/buy-dragon/${id}][img]http://flightrising.com/images/layout/button_buyauction.png[/img][/url]`;
    var maybePriceIcon = document.querySelectorAll("#dragon-profile-icon-for-sale-tooltip > img");
    var maybePrice = document.querySelectorAll("#dragon-profile-icon-for-sale-tooltip > strong:nth-child(3)");

    if (maybePrice.length > 0)
    {
        var price = maybePrice[0].innerHTML;

        if (maybePriceIcon.length > 0)
        {
            var imageUrl = maybePriceIcon[0].getAttribute("src");
            if (imageUrl.includes("treasure"))
            {
                price = price / 1000;
            }
        }

        buyButton = `[emoji=treasure size=1] ${price}k / ${price} [emoji=gem size=1][br][br]${buyButton}`
    }

    var birthday = document.querySelector("#dragon-profile-physical > div > :nth-child(2) > :nth-child(2) strong");

    forumCode =
        `[columns]
            [url=http://flightrising.com/main.php?dragon=${id}][img]http://flightrising.com${dragonImageURL}[/img][/url]
        [nextcol]
            [color=transparent]........[/color]
        [nextcol]
            [quote=${eyeElement}]
                [center]Born ${birthday.innerHTML}
                    [br][br][img]http://flightrising.com/images/icons/small_${gender}.png[/img]
                    [br][emoji=normal eyes size=1] ${eyeType} [color=transparent].[/color][emoji=${eyeElement} rune size=1]
                [/center]
                [br]
                    [columns]
                        [emoji=primary gene size=1]
                    [nextcol]
                        [b]${primaryStrings[0]}[/b][br]${primaryStrings[1].replaceAll(ancientGeneRegex, "")}
                    [/columns]
                    [columns]
                        [emoji=secondary gene size=1]
                    [nextcol]
                        [b]${secondaryStrings[0]}[/b][br]${secondaryStrings[1].replaceAll(ancientGeneRegex, "")}
                    [/columns]
                    [columns]
                        [emoji=tertiary gene size=1]
                    [nextcol]
                        [b]${tertiaryStrings[0]}[/b][br]${tertiaryStrings[1].replaceAll(ancientGeneRegex, "")}
                    [/columns]
                [br][br][url=https://www1.flightrising.com/scrying/predict/${id}][emoji=crystal ball size=1] Click to Scry [/url]
                [br][br][center]
                    ${buyButton}
                [/center]
            [/quote]
        [/columns]`

    forumCode = forumCode.replaceAll(whitespaceRegex, "");

    var forSaleOption = document.createElement("div");
    forSaleOption.classList.add("dragon-profile-share-option");
    forSaleOption.innerHTML =
            `<div class="dragon-profile-share-option">
                 <div class="dragon-profile-share-label"> Sale Listing: </div>
                 <div class="dragon-profile-share-field">
                     <input type="text" size="10" value="${forumCode}">
                 </div>
                 <span id="for-sale-copy" class="dragon-profile-share-icon">
                     <img id="dragon-profile-share-widget" src="/static/layout/copy.png">
                 </span>
             </div>`;

    forSaleOption.querySelector("#for-sale-copy").onclick = () => copyForumCode();

    var largeWidgetStringInput = document.querySelector("#dragon-profile-share-dialog > div:nth-child(4) > div.dragon-profile-share-field > input[type=text]");
    smallWidgetCode = largeWidgetStringInput.value;
    smallWidgetCode = smallWidgetCode.replace("/350/", "/avatars/");
    smallWidgetCode = smallWidgetCode.replace("_350.png", ".png");
    coliWidgetCode = largeWidgetStringInput.value;
    coliWidgetCode = coliWidgetCode.replace("/350/", "/coliseum/portraits/");
    coliWidgetCode = coliWidgetCode.replace("_350.png", ".png");



    var smallWidgetOption = document.createElement("div");
    smallWidgetOption.classList.add("dragon-profile-share-option");
    smallWidgetOption.innerHTML =
            `<div class="dragon-profile-share-option">
                 <div class="dragon-profile-share-label"> Small Widget: </div>
                 <div class="dragon-profile-share-field">
                     <input type="text" size="10" value="${smallWidgetCode}">
                 </div>
                 <span id="small-widget-copy" class="dragon-profile-share-icon">
                     <img id="dragon-profile-share-widget" src="/static/layout/copy.png">
                 </span>
             </div>`;

smallWidgetOption.querySelector("#small-widget-copy").onclick = () => copySmallWidgetCode();

 var coliWidgetOption = document.createElement("div");
    coliWidgetOption.classList.add("dragon-profile-share-option");
    coliWidgetOption.innerHTML =
            `<div class="dragon-profile-share-option">
                 <div class="dragon-profile-share-label"> Coli Portrait: </div>
                 <div class="dragon-profile-share-field">
                     <input type="text" size="10" value="${coliWidgetCode}">
                 </div>
                 <span id="coli-widget-copy" class="dragon-profile-share-icon">
                     <img id="dragon-profile-share-widget" src="/static/layout/copy.png">
                 </span>
             </div>`;

    coliWidgetOption.querySelector("#coli-widget-copy").onclick = () => copyColiWidgetCode();

    var shareDialog = document.querySelector("#dragon-profile-share-dialog");
    shareDialog.appendChild(smallWidgetOption);
    shareDialog.appendChild(coliWidgetOption);
    shareDialog.appendChild(forSaleOption);
})();