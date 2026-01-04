// ==UserScript==
// @name         igg on store pages
// @namespace    my-web-site.cyleja1234.repl.co/
// @version      3.0
// @description  open game on igg-games (other game store platforms coming soon!)[steam epic games oprigin]
// @author       Unknown81311#6616 (discord)
// @license      GPL-3.0-or-later
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @match        *store.steampowered.com/app/*
// @match        https://www.epicgames.com/store/*
// @match        https://www.origin.com/*
// @icon url     https://store.steampowered.com/favicon.ico
// @icon         https://store.steampowered.com/favicon.ico
// @copyright    2020, unknown81311 (https://openuserjs.org/users/unknown81311)
// @downloadURL https://update.greasyfork.org/scripts/409821/igg%20on%20store%20pages.user.js
// @updateURL https://update.greasyfork.org/scripts/409821/igg%20on%20store%20pages.meta.js
// ==/UserScript==
var hostname = window.location.origin; //find curent domain
if ("https://store.steampowered.com" === window.location.origin) { //for steam
  var name = $(".apphub_AppName").text(),
    appName = name.replace(/ /g, "-").replace(/[^a-zA-Z0-9 -]/g, ""),
    el1 = document.querySelector("#game_area_purchase > div.game_area_purchase_game_wrapper > div > div.game_purchase_action > div.game_purchase_action_bg > div.btn_addtocart"); //get game name
  //set clone target elemnt
  $(el1).clone().prependTo(".game_purchase_action").css({float: "right",display: "inline-block","background-color": "#000000",padding: "2px 2px 2px 0px"}); //clone originall button and add style
  var link = "https://igg-games.com/" + appName + "-free-download.html",
    target = "#game_area_purchase > div.game_area_purchase_game_wrapper > div > div.game_purchase_action > div.btn_addtocart > a"; //setlink
  //set targettred elemnt
  $(target).attr("href", link), //change link
    $(target).attr("target", "_blank"), //redirect to new tab
    $(target + " > span").text("Free"), //rename to free
    $("#dlc_purchase_action > div:nth-child(1)").remove(), //remove bug
    $("#game_area_purchase > div:nth-child(2) > div > div.game_purchase_action > div.btn_addtocart").remove()// remove bug
}
if ("https://www.epicgames.com" === window.location.origin) { //for epic games
$( "<div class=\"css-14i612r-PurchaseButton-styles__ctaButtons\"><button aria-label=\"\" class=\"css-zc5dwj-Button-styles__main\" id=\"\" title=\"\" type=\"button\" data-component=\"Button\"><span><span data-component=\"Message\">Buy Now</span></span></button><button aria-label=\"\" class=\"css-zc5dwj-Button-styles__main\" id=\"\" title=\"\" type=\"button\" data-component=\"Button\"><span><span data-component=\"Message\">Free</span></span></button><div class=\"css-m8gssx-WishButton-styles__main\" data-component=\"WishButton\"><div class=\"css-1mgfzks-Tooltip-styles__main\" data-component=\"Tooltip\"><div class=\"css-10ugua8-Tooltip-styles__trigger\"><button aria-label=\"\" class=\"css-1tfnj6c-Button-styles__main-WishButton-styles__wishButton\" id=\"\" title=\"\" type=\"button\" data-component=\"Button\"><span><span class=\"css-1hnny0b-Icon__wrapper\" aria-hidden=\"true\" data-component=\"Icon\"><svg xmlns=\"http://www.w3.org/2000/svg\" class=\"svg css-wpyjus-Icon__svg\" viewBox=\"0 0 12 11\"><g id=\"Wishlist\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\"><g id=\"Wishlist-/-02-Saving-a-game-02\" transform=\"translate(-1330.000000, -820.000000)\" fill=\"\"><rect id=\"Rectangle\" x=\"1311\" y=\"800\" width=\"50\" height=\"50\"></rect><path d=\"M1336.00128,830.325288 L1336.5339,829.844527 C1339.46452,827.18378 1340.38107,826.240535 1341.02068,825.051328 C1341.34306,824.451936 1341.5,823.882344 1341.5,823.297003 C1341.5,821.726925 1340.27196,820.5 1338.7,820.5 C1337.81967,820.5 1336.95098,820.907926 1336.38053,821.577201 L1336,822.023657 L1335.61947,821.577201 C1335.04902,820.907926 1334.18033,820.5 1333.3,820.5 C1331.72804,820.5 1330.5,821.726925 1330.5,823.297003 C1330.5,823.884854 1330.65829,824.456837 1330.98349,825.058898 C1331.62496,826.246473 1332.5479,827.194722 1335.46642,829.838828 L1336.00128,830.325288 Z\" id=\"Path\" stroke=\"#F4F4F4\" fill-rule=\"nonzero\"></path></g></g></svg></span></span></button></div></div></div></div>" ).appendTo( "#dieselReactWrapper > div > div.css-igz6h5-AppPage__bodyContainer > main > div > div > div.ProductDetails-wrapper_2d124844 > div > div.ProductDetailHeader-wrapper_e0846efc > div:nth-child(2) > div > div > div.Description-ctaWrapper_e8d00c38 > div > div > div > div.css-wgi9q7" );// add free buttons
$("#dieselReactWrapper > div > div.css-igz6h5-AppPage__bodyContainer > main > div > div > div.ProductDetails-wrapper_2d124844 > div > div.ProductDetailHeader-wrapper_e0846efc > div:nth-child(2) > div > div > div.Description-ctaWrapper_e8d00c38 > div > div > div > div.css-wgi9q7 > div:nth-child(1)").remove();// remove old buttons

var el2 = $("#dieselReactWrapper > div > div.css-igz6h5-AppPage__bodyContainer > main > div > nav.css-1v9fujt-PageNav__topNav-PageNav__desktopNav-PageNav__themed > div > nav > div > div.css-eizwrh-NavigationBar__contentPrimary > ul > li:nth-child(2) > a > h2 > span").text().replace(/ /g, "-").replace(/[^a-zA-Z0-9 -]/g, "");// get link
var link2 = "https://igg-games.com/" + el2 + "-free-download.html"
$("#dieselReactWrapper > div > div.css-igz6h5-AppPage__bodyContainer > main > div > div > div.ProductDetails-wrapper_2d124844 > div > div.ProductDetailHeader-wrapper_e0846efc > div:nth-child(2) > div > div > div.Description-ctaWrapper_e8d00c38 > div > div > div > div.css-wgi9q7 > div > button").wrap("<a target='_blank' href='#'></a>");
$("#dieselReactWrapper > div > div.css-igz6h5-AppPage__bodyContainer > main > div > div > div.ProductDetails-wrapper_2d124844 > div > div.ProductDetailHeader-wrapper_e0846efc > div:nth-child(2) > div > div > div.Description-ctaWrapper_e8d00c38 > div > div > div > div.css-wgi9q7 > div > a:nth-child(2)").attr("href", link2);// set new link
}


if ("https://www.origin.com" === window.location.origin) { // for origin, in proggress...
    var name3 = document.querySelector("#storecontent > section:nth-child(21) > div > origin-store-osp-termsandconditions > div > otkex-legal > div > strong").text();// get game name
alert(name3);
}