// ==UserScript==
// @name         AliExpress userscript
// @namespace    sami@kankaristo.fi
// @version      0.6.1
// @description  Some improvements to AliExpress
// @author       sami@kankaristo.fi
// @match        https://*.aliexpress.com/*
// @grant        none
// @require      https://greasyfork.org/scripts/405927-utillibrary/code/UtilLibrary.js
// @downloadURL https://update.greasyfork.org/scripts/396598/AliExpress%20userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/396598/AliExpress%20userscript.meta.js
// ==/UserScript==


Util.LOGGING_ID = "AliExpress userscript";


///
/// Get the sum of all prices on the page.
///
function GetSumOfAllPrices(queryString) {
    queryString = queryString || ".alisuperstar-frame-content";
    
    var sum = 0.0;
    
    var elements = document.querySelectorAll(queryString);
    
    for (const element of elements) {
        //Util.Log(element.textContent);
        sum += Util.ParseFloatFromString(element.textContent);
    }
    
    return sum;
}


///
/// Continuous loop on AliExpress.
///
function AliExpressLoop() {
    //Util.Log("AliExpressLoop()");
    
    // Show actual due date for deliveries, instead of "withing xx days"
    var orderStatusInfoWithinDays = document.querySelector(".order-status-info > span");
    if (orderStatusInfoWithinDays != null) {
        var withinText = orderStatusInfoWithinDays.textContent;
        //Util.Log("Within text: " + withinText);
        var withinDays = parseFloat(withinText);
        //Util.Log("Within days: " + withinDays);
        var date = new Date();
        date = new Date(date.setDate(date.getDate() + withinDays + 1));
        var beforeDateString = date.toISOString().substring(0, 10);
        //Util.Log("Before: " + beforeDateString);
        orderStatusInfoWithinDays.textContent = (
            withinDays + " days (before " + beforeDateString + ")"
        );
    }
    
    var productPriceElement = document.querySelector(".product-price");
    if (productPriceElement != null) {
        var lotCountElement = document.querySelector(".product-number-picker :nth-child(2) > input");
        var lotCount = (
            (lotCountElement != null)
            ? Util.ParseFloatFromString(lotCountElement.value)
            : 1.0
        );
        
        var totalPriceElement = productPriceElement.querySelector(".totalPrice");
        
        if (totalPriceElement == null) {
            totalPriceElement = document.createElement("div");
            totalPriceElement.className = "totalPrice";
            productPriceElement.append(totalPriceElement);
        }
        
        var shippingPriceElement = document.querySelector(".product-shipping-price");
        
        if (shippingPriceElement != null) {
            var productPrice = Util.ParseFloatFromString(productPriceElement.textContent);
            var shippingPrice = Util.ParseFloatFromString(shippingPriceElement.textContent);
            var totalPrice = (productPrice * lotCount) + shippingPrice;
            
            var lotCountString = " (" + lotCount.toFixed(0).toString() + " lots)";
            
            if (lotCount == 1) {
                lotCountString = "";
            }
            
            totalPriceElement.textContent = (
                "Total price: " + totalPrice.toFixed(2) + lotCountString
            );
            
            var productTitleElement = document.querySelector(".product-title-text");
            var productTitle = (
                (productTitleElement != null)
                ? productTitleElement.textContent
                : ""
            );
            
            // Get number of items in one lot
            var pcs = 1;
            if (productTitle.toLowerCase().indexOf("pcs") != -1) {
                var pcsRegex = /(\d+)\w?pcs/i;
                var match = productTitle.match(pcsRegex);
                if ((match != null)) {
                    pcs = Util.ParseFloatFromString(match[1]);
                }
            }
            
            // Calculate and display price per item
            var pricePerItem = totalPrice / (pcs * lotCount);
            totalPriceElement.innerHTML = (
                totalPriceElement.textContent
                + "<br />"
                + pricePerItem.toFixed(2) + " / item"
            );
        }
    }
    
    const urlParams = new URLSearchParams(window.location.search);
    const showReceipt = (urlParams.get("receipt") == "true");
    
    if (showReceipt) {
        Util.Log("Showing in 'receipt' mode");
        
        var elementSelectors = {
            // The very top of the page
            ".top-lighthouse": "none",
            // Top navigation+search (next to AliExpress logo)
            ".header-wrap > .hm-right": "none",
            ".header-wrap > .hm-middle": "none",
            // Breadcrumbs
            ".me-ui-box > :nth-child(1)": "none",
            ".me-ui-box > :nth-child(2)": "none",
            // "Reminder" and "Add To Cart"
            "#reminder-section > div > :nth-child(3)": "none",
            "#reminder-section > div > :nth-child(4)": "none",
            // Shipping section (not necessary for a receipt)
            "#shipping-section": "none",
            // "Contact Seller"
            ".im-contact-seller": "none",
            // Tooltip that appears next to "Contact Seller"
            ".im-contact-tips": "none",
            // Tabs
            ".ui-tab-nav": "none",
            // No idea what this is supposed to be (broken image)
            "#_umfp": "none",
            // Footer
            ".site-footer": "none",
            // "Copywrite" footer
            ".footer-copywrite": "none",
            // "Eva" bot
            "#J_xiaomi_dialog": "none",
            
            // Force showing of both info tabs
            "#order-pnl": "block",
            "#fund-pnl": "block"
        };
        
        for (const [elementSelector, displayValue] of Object.entries(elementSelectors)) {
            //Util.Log("Hiding '" + elementSelector + "'");
            var element = document.querySelector(elementSelector);
            
            if (element == null) {
                Util.Log("Could not find '" + elementSelector + "'");
                
                continue;
            }
            
            element.style.display = displayValue;
        }
        
        document.body.style.backgroundColor = "white";
        document.querySelector(".header-wrap").style.marginLeft = "30px";
    }
    
    setTimeout(AliExpressLoop, 1000);
}


///
/// Initialize.
///
function Init() {
    setTimeout(AliExpressLoop, 200);
    
    window.AliExpress_AddAllPricesToTotalAmount = function (queryString) {
        var totalAmount = parseFloat(localStorage.getItem("AliExpress_totalAmount") || "0.0");
        
        Util.Log("AliExpress_totalAmount before: " + totalAmount);
        
        totalAmount += GetSumOfAllPrices(queryString);
        
        Util.Log("AliExpress_totalAmount after: " + totalAmount);
        
        localStorage.setItem("AliExpress_totalAmount", totalAmount.toString());
    };
    
    window.AliExpress_SetTotalAmount = function (amount) {
        localStorage.setItem("AliExpress_totalAmount", amount.toString());
    };
    
    window.AliExpress_AdjustTotalAmount = function (adjustAmount) {
        if (adjustAmount == null) {
            Util.Log("Missing parameter: `adjustAmount`");
            
            return;
        }
        
        var amount = parseFloat(localStorage.getItem("AliExpress_totalAmount") || "0.0");
        Util.Log("old amount:    " + amount);
        Util.Log("adjust amount: " + adjustAmount);
        amount += adjustAmount;
        Util.Log("new amount:    " + amount);
        
        localStorage.setItem("AliExpress_totalAmount", amount.toString());
        Util.Log("localStorage item: " + localStorage.getItem("AliExpress_totalAmount"));
    };
    
    setTimeout(
        function () {
            Util.Log("To set the sum, run:     AliExpress_SetTotalAmount(0.0);");
            Util.Log("To adjust the sum, run:  AliExpress_AdjustTotalAmount(0.0);");
            Util.Log("To add all prices, run:  AliExpress_AddAllPricesToTotalAmount();");
        },
        3000
    );
}


(
    function () {
        "use strict";
        
        Init();
    }
)();
