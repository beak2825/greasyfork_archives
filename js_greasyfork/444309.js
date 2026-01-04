// ==UserScript==
// @name         Steam, Booster Pack Price List
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Display price list
// @author       You
// @match        https://steamcommunity.com/tradingcards/boostercreator/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steamcommunity.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444309/Steam%2C%20Booster%20Pack%20Price%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/444309/Steam%2C%20Booster%20Pack%20Price%20List.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var timer = setInterval(() => {
        if (window.CBoosterCreatorPage) {
            clearInterval(timer);
            var $ = window.jQuery;

            var style = `<style>
            #boosterpackpricelist span {
            display: inline-block;
            }
            #boosterpackpricelist li:nth-child(2n) {
            background: #aaa1;
            }
            #boosterpackpricelist .appid {
            width: 70px;
            }
            #boosterpackpricelist .name {
            width: 370px
            }
            #boosterpackpricelist .price {
            width: 60px;
            }
            </style>`;
            var list = `<ul id="boosterpackpricelist">`;
            for (var appid in window.CBoosterCreatorPage.sm_rgBoosterData) {
                var app = window.CBoosterCreatorPage.sm_rgBoosterData[appid];
                list += `<li><span class="appid">${app.appid}</span><span class="name">${app.name}</span><span class="price">${app.price}</span></li>`;
            }
            list += "</ul>";
            $(".booster_creator_area").append(style + list);

            $("#boosterpackpricelist li").click(function(e) {
                $("#booster_game_selector").val($(".appid", this).text()).trigger("change");
                $(window).scrollTop($("#booster_game_selector").offset().top)
            });
        }
    }, 1000);
    // Your code here...
})();