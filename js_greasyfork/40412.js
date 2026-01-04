// ==UserScript==
// @name         Steam Game Marker (Humble Bundle)
// @icon         https://humblebundle-a.akamaihd.net/static/hashed/47e474eed38083df699b7dfd8d29d575e3398f1e.ico
// @namespace    jaege
// @version      1.0
// @description  Adds steam links and wishlist/owned/unowned icons to Humble Bundle games. Please login Steam's official website in your broswer first. Based on https://greasyfork.org/scripts/27373-humble-bundle-steam-links-adder and https://greasyfork.org/en/scripts/26273-steam-store-game-owned-checker
// @author       jaege
// @contributor  Royalgamer06
// @include      *://www.humblebundle.com/*
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @connect      api.steampowered.com
// @connect      store.steampowered.com
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/40412/Steam%20Game%20Marker%20%28Humble%20Bundle%29.user.js
// @updateURL https://update.greasyfork.org/scripts/40412/Steam%20Game%20Marker%20%28Humble%20Bundle%29.meta.js
// ==/UserScript==


// ==Configuration==
var selectors = ["em",
                 ".entity-title",
                 ".deal-title",
                 ".product-name",
                 ".text-holder > h2",
                 ".product-title > h2",
                 "h1[data-entity-kind=product]",
                 ".desktop:has(.hb-steam) .dd-image-box-caption",
                 ".humble-original-title",
                 ".game-name > h4",
                 ".sr-key-heading > span",
                 ".heading-text > h4"];
const wishlistIcon = "&#10084;"; //                 HTML entity code for '❤' (default).
const wishlistColor = "hotpink"; //                 Color of the icon for wishlisted apps.
const ownedIcon = "&#10004;"; //                    HTML entity code for '✔' (default).
const ownedColor = "green"; //                      Color of the icon for owned apps and subs.
const unownedIcon = "&#10008;"; //                  HTML entity code for '✘' (default).
const unownedColor = "red"; //                      Color of the icon for unowned apps and subs.
// ==/Configuration==

// ==Code==
this.$ = this.jQuery = jQuery.noConflict(true);

var userdata = [];
var wishlist = [];
var ownedApps = [];
//var ownedPackages = [];
var applist = [];
GM_xmlhttpRequest({
    method: "GET",
    url: "http://store.steampowered.com/dynamicstore/userdata/",
    onload: function(response) {
        userdata = JSON.parse(response.responseText);
        wishlist = userdata.rgWishlist;
        ownedApps = userdata.rgOwnedApps;
        //ownedPackages = userdata.rgOwnedPackages;
        console.log("userdata loaded");

        var selector = selectors.join(":not(.steamified):not(a):not(:has(a)), ") + ":not(.steamified):not(a):not(:has(a))";
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://api.steampowered.com/ISteamApps/GetAppList/v2/",
            onload: function(response) {
                applist = JSON.parse(response.responseText).applist.apps;
                console.log("applist loaded");
                $(document).on("contentchanged", selector, function() {
                    steamify(this);
                }).ready(function() {
                    var domwatcher = setInterval(function() {
                        $(selector).each(function() {
                            steamify(this);
                        }, 100);
                    });
                });
            }
        });
    }
});

function steamify(titleElem) {
    $(titleElem).addClass("steamified");
    setTimeout(function() {
        var title = $(titleElem).text().toLowerCase().replace(/\(early access\)|\(pre\-order\)|\:|\-|\–|\\|\/|\™|\®| |\'|\.|\?|\!/g, "").trim();
        var obj = applist.filter(function(v) { return v.name.toLowerCase().replace(/\:|\-|\–|\\|\/|\™|\®| |\'|\.|\?|\!/g, "").trim() == title; })[0];
        if (obj !== undefined) {
            var appID = obj.appid;
            var lcs = new Date().toLocaleString();
            var icon;
            if (ownedApps.includes(appID)) { //if owned
                icon = "<span style='color: " + ownedColor + "; cursor: help;' title='Game or DLC (" + appID + ") owned on Steam\nLast updated: " + lcs + "'> " + ownedIcon + "</span>"; //✔
            } else { //else not owned
                if (wishlist.includes(appID)) { //if wishlisted
                    icon = "<span style='color: " + wishlistColor + "; cursor: help;' title='Game or DLC (" + appID + ") wishlisted on Steam\nLast updated: " + lcs + "'> " + wishlistIcon + "</span>"; //❤
                } else { //else not wishlisted
                    icon = "<span style='color: " + unownedColor + "; cursor: help;' title='Game or DLC (" + appID + ") not owned on Steam\nLast updated: " + lcs + "'> " + unownedIcon + "</span>"; //✘
                }
            }
            $(titleElem).append(icon);
            $(titleElem).replaceWith("<a href='http://store.steampowered.com/app/" + appID + "/' target='_blank'>" + titleElem.outerHTML + "</a>");
        }
    }, 0);
}

// ==/Code==