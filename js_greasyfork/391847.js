// ==UserScript==
// @name         Torn Mug Predictor for Proxima
// @namespace    https://www.torn.com/profiles.php?XID=2029670
// @version      1.3
// @description  Predicts mug amounts
// @author       MikePence [2029670]
// @match        https://www.torn.com/imarket.php
// @match        https://www.torn.com/bazaar.php*
// @requires     https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/391847/Torn%20Mug%20Predictor%20for%20Proxima.user.js
// @updateURL https://update.greasyfork.org/scripts/391847/Torn%20Mug%20Predictor%20for%20Proxima.meta.js
// ==/UserScript==

// You can change these variables
var mugPercent = 0.08;
var updateInterval = 100; // Milliseconds

// Probably don't change anything below
$(document).ready(function(){
    if(window.location.href.includes("imarket.php")){
        var imInterval = window.setInterval(imFunction, updateInterval);
        function imFunction(){
            $(".buy-item-info-wrap").each(function(parentIndex, parentElement){
                $(parentElement).children().eq(1).children().each(function(childIndex, childElement){
                    var priceElement = $(childElement).children(".item").first().children(".cost").first().children(".cost-price").first();
                    if(!priceElement.text().includes("Mug")){
                        var stockElement = $(childElement).children(".item").first().children(".item-name").first().children(".item-t").first().children(".t-gray-9").first();
                        var stockElementText = stockElement.text().replace("(", "").replace(" in stock)", "");
                        var mugAmount = Math.floor(parseFloat(priceElement.text().replace("$", "").replace(/,/g, "")) * parseFloat(stockElementText.replace(/,/g, "")) * mugPercent).toLocaleString();
                        var originalHtml = priceElement.html();
                        var newHtml = "Mug: $" + mugAmount;
                        priceElement.parent().hover(function(){
                            priceElement.html(newHtml);
                            priceElement.css("color", "red");
                        }, function(){
                            priceElement.html(originalHtml);
                            priceElement.css("color", "black");
                        });
                    }
                });
                $(parentElement).children().eq(3).children().each(function(childIndex, childElement){
                    var priceElement = $(childElement).children(".item").first().children(".cost").first();
                    var priceElementText = priceElement.text().replace(/(\r\n|\n|\r)/gm, "").replace("Price:", "").trim();
                    if(!priceElementText.includes("Mug")){
                        var mugAmount = Math.floor(parseFloat(priceElementText.replace("$", "").replace(/,/g, "")) * mugPercent).toLocaleString();
                        var originalHtml = priceElement.html();
                        var newHtml = "Mug: $" + mugAmount;
                        priceElement.hover(function(){
                            priceElement.html(newHtml);
                            priceElement.css("color", "red");
                        }, function(){
                            priceElement.html(originalHtml);
                            priceElement.css("color", "black");
                        });
                    }
                });
            });
        }
    }
    else if(window.location.href.includes("bazaar.php")){
        var bazaarInterval = window.setInterval(bazaarFunction, updateInterval);
        function bazaarFunction(){
            $(".confirm").each(function(index, element){
                var priceElement = $(element).children("span").first().children("p").first().children(".msg").first().children(".total").first();
                if(priceElement.text() && !priceElement.parent().text().includes("Mug")){
                    var mugAmount = Math.floor(parseFloat(priceElement.text().replace(/,/g, "")) * mugPercent).toLocaleString();
                    priceElement.parent().append("<span class='msg' style='color:red'>Mug: $" + mugAmount + "</span>");
                }
            });
        }
    }
});