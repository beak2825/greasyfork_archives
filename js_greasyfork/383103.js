// ==UserScript==
// @name            Show Price as Hours of your Life
// @description     Gets the price displayed on shopping sites and shows the equivalent hours of your life spent to earn that money.
// @author          navchandar
// @version         2.0
// @license         MIT
// @run-at          document-end
// @homepage        https://navchandar.github.io/
// @homepage        https://github.com/navchandar/
// @homepageURL     https://navchandar.github.io/
// @copyright       2019, navchandar (https://openuserjs.org/users/navchandar)
// @supportURL      https://openuserjs.org/scripts/navchandar/Show_Price_as_Hours_of_your_Life/issues
// @setupURL        https://openuserjs.org/install/navchandar/Show_Price_as_Hours_of_your_Life.user.js
// @icon            data:image/png;base64,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
// @grant           GM_addStyle
// @grant           GM_getValue
// @grant           GM_setValue
// @include         https://play.google.com/store/*
// @include         https://play.google.com/store*
// @include         http://play.google.com/store*
// @match           https://www.google.com/*shop*
// @match           https://google.com/*shop*
// @match           https://www.google.co.in/*shop*
// @match           https://google.co.in/*shop*
// @include         http://www.amazon.com
// @include         https://www.amazon.com
// @include         http://www.amazon.in
// @match           https://www.amazon.in/*
// @include         https://www.flipkart.com*
// @include         http://www.flipkart.com*
// @include         https://paytm.com*
// @include         http://paytm.com*
// @include         https://paytmmall.com*
// @include         http://paytmmall.com*
// @namespace https://greasyfork.org/users/302262
// @downloadURL https://update.greasyfork.org/scripts/383103/Show%20Price%20as%20Hours%20of%20your%20Life.user.js
// @updateURL https://update.greasyfork.org/scripts/383103/Show%20Price%20as%20Hours%20of%20your%20Life.meta.js
// ==/UserScript==

function has(String, search) {
  try {
    if (String.indexOf(search) > -1) {
      return true;
    }
  }
  catch (err) {}
  return false;
}

function updateValuesINR() {
  var approxHourlySalary = Number(GM_getValue("approxAnnualSalary", "")) / (9 * 22 * 12);
  if (!approxHourlySalary) {
    console.log("Error calculating approxHourlySalary.")
  }

  if (approxHourlySalary > 0) {
    var items, separator;
    // These xpaths cover most of the price elements shown. Feel free to comment/fork to update if required.
    var amazonINRxpath = "//span[contains(@class, 'CurrencyINR')]//following-sibling::span" + " | " +
      "//span[@class='currencyINR']/parent::*" + " | " +
      "//*[contains(@class, 'rice')][contains(text(), '₹')]" + " | " +
      "//*[contains(@class, 'price')]//*[contains(text(), '₹')]" + " | " +
      "//*[contains(@class, 'price-whole')]" + " | " +
      "//h2/span[contains(text(), '₹')]" + " | " +
      "//div[@data-id]//h3" + " | " +
      "//*[text() = 'Select Seats']//..//..//..//*[contains(text(), ',')]";

    var amazonUSDxpath = "//*[@class='dealPrice']" + " | " +
      "//*[@class='buyingPrice']" + " | " +
      "//*[contains(@class,'-price-whole')]" + " | " +
      "(//span[@class='dv-conditional-linebreak']//following-sibling::text())[1]" + " | " +
      "(//span[@class='dv-conditional-linebreak']//following-sibling::text())[2]" + " | " +
      "//span[contains(@class, 'price')][contains(text(), '$')]" + " | " +
      "//h2[contains(@class, 'headline') and contains(text(), '₹')]" + " | " +
      "//a[@id='dealTitle']" + " | " + "//div[contains(@class, 'priceBlock')]";

    var flipkartINRxpath = "//*[contains(@title, '₹')]/div[3]" + " | " +
      "//div[contains(text(), '₹')]";

    var paytmINRxpath = "//span/span[contains(text(), 'Rs')]" + " | " +
      "//a//*[contains(@class, 'iconRupess')]//.." + " | " +
      "//*[contains(@class, 'iconRupess')]//..";

    var playStoreINRxpath = "//*[@class='display-price' and contains(text(), '₹')]" + " | " +
      "//button[@jsmodel]//span[contains(text(), '₹')]" + " | " +
      "//button[contains(text(), '₹')]//text()" + " | " +
      "//meta[@itemprop='price']";

    var gShopINRxpath = "//div[contains(@class, 'content')]//*[contains(text(), '₹')]" + " | " +
      "//div[contains(@class, 'result')]//*[contains(text(), '₹')]" + " | " +
      "//a//div[contains(text(), '₹')]";

    var hostURL = window.location.href;
    if (has(hostURL, 'amazon.in')) {
      items = document.evaluate(amazonINRxpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      separator = "&nbsp;";
    }

    else if (has(hostURL, 'amazon.com')) {
      items = document.evaluate(amazonUSDxpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      separator = "&nbsp;";
    }

    else if (has(hostURL, 'flipkart')) {
      items = document.evaluate(flipkartINRxpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      separator = "&nbsp;";
    }

    else if (has(hostURL, 'paytm')) {
      items = document.evaluate(paytmINRxpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      separator = "<br/>";
    }

    else if ((has(hostURL, 'google')) && (has(hostURL, 'details'))) {
      items = document.evaluate(playStoreINRxpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      separator = "&nbsp;";
    }

    else if ((has(hostURL, 'google')) && (has(hostURL, 'store'))) {
      items = document.evaluate(playStoreINRxpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      separator = "<br/>";
    }

    else if ((has(hostURL, 'google.co')) && (has(hostURL, 'shop'))) {
      items = document.evaluate(gShopINRxpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      separator = "&nbsp;";
    }

    else {
      console.log("Show Price Hours script didnt match with the current site.");
    }

    if (!items) {
      console.log("No items found with the xpath in this page.");
    }
    else if (items.snapshotLength <= 0) {
      console.log("No items found with the xpath in this page.");
    }
    else {
      var passCount = 0;
      for (let i = 0; i < items.snapshotLength; i++) {
        var thisitem = items.snapshotItem(i);
        var txt = thisitem.innerText;
        var htm = thisitem.innerHTML;
        if (txt == null | txt == "" | htm == null | htm == "") {
          txt = thisitem.textContent;
        }

        var alreadyUpdated = false;
        try {
          if (has(txt, 'hrs') | has(txt, 'Day') | has(txt, 'Month') | has(txt, 'YEARS')) {
            alreadyUpdated = true;
          }
        }
        catch (err) {}
        try {
          if (has(htm, 'hrs') | has(htm, 'Day') | has(htm, 'Month') | has(htm, 'YEARS')) {
            alreadyUpdated = true;
          }
        }
        catch (err) {}

        if (!alreadyUpdated) {
          try {
            // to remove +10% offers from flipkart
            if (has(txt, '+')) {
              txt = txt.split('+')[0];
            }

            // to remove hidden text from paytm
            if (has(txt, '%') && has(txt, '-')) {
              txt = txt.split('-')[0]
            }

            // to remove 100-200 range from amazon
            if (has(txt, '-')) {
              txt = txt.split('-')[1];
            }
            if (has(txt, 'to')) {
              txt = txt.split('to')[1];
            }
            if (has(txt, 'Buy')) {
              txt = txt.split('Buy')[0];
            }

            // remove unneccessary text and convert to number.
            txt = (txt.replace(/\d+ Used/i, "").replace(/\d+ New/i, "")).replace(/\(\d+%\)/g, "");
            txt = txt.replace(/[a-z]/gi, "");
            txt = txt.replace(",", "").replace("Rs.", "").replace("₹", "").replace("$", "").replace(".00", "").replace(" ", "");
            var amount = Number(txt);
            if (!amount || amount <= 0) {
              amount = Number(((txt.replace(".00", "").replace(/\.\d+/, "")).replace(/\.\d+\./, "")).replace(/\D+/g, ""));
            }
            var appender = "";

            if (amount > 0) {
              var calculated = (amount / approxHourlySalary);
              if (calculated) {
                if (calculated <= 10) {
                  appender = (separator + "<b>(" + (calculated).toFixed(1).toString() + " hrs)</b>");
                  thisitem.innerHTML += appender;
                }
                else if (calculated < 190) {
                  appender = (separator + "<b>(" + (calculated / 9).toFixed(1).toString() + " Days)</b>");
                  thisitem.innerHTML += appender;
                }
                else if (calculated < 2380) {
                  appender = (separator + "<b>(" + (calculated / 198).toFixed(1).toString() + " Months)</b>");
                  thisitem.innerHTML += appender;
                }
                else {
                  appender = (separator + "<b>(" + (calculated / 2376).toFixed(1).toString() + " YEARS)</b>");
                  thisitem.innerHTML += appender;
                }
                passCount++;
              }
              else {
                console.log("Error calculating amount : " + amount);
              }
            }
          }
          catch (err) {}
        }
      }
      console.log("Updated hours to " + passCount + " items.");
      items = "";
    }
  }
}

function ButtonClickAction(zEvent) {
  GM_setValue("approxAnnualSalary", "");
  var approxAnnualSalary = prompt('To calculate how many hours of your life, each item will cost, add an approximate Annual Salary/Wage Amount :', '');
  if (approxAnnualSalary) {
    GM_setValue("approxAnnualSalary", approxAnnualSalary);
    console.log("Stored approxAnnualSalary : " + approxAnnualSalary);
    GM_setValue("UserCancelledPrompt", false);
    self.location.assign(location);
  }
  else {
    GM_setValue("UserCancelledPrompt", true);
    console.log("User Cancelled prompt to update approxAnnualSalary.");
  }
}

function AddButton() {
  // Add a button element on div
  var zNode = document.createElement('div');
  zNode.innerHTML = '<button id="myButton" title="To update your stored wage/salary, Click me" type="button">Reset</button>';
  zNode.setAttribute('id', 'myContainer');
  document.body.appendChild(zNode);

  //--- Activate the newly added button.
  document.getElementById("myButton").addEventListener("click", ButtonClickAction, false);

  //--- Style our newly added element using CSS.
  GM_addStyle(`
#myContainer{position:fixed;bottom:0;left:0;font-size:11px;margin:0;opacity:.75}#myButton{cursor:pointer;background-color:lightgrey;color:black}
#myButton:hover{background-color:#555;color:white;box-shadow:0 2px 6px 0 rgba(0,0,0,.24),0 5px 10px 0 rgba(0,0,0,.19);opacity:1}
`);

}

(function () {
  'use strict';
  //GM_setValue("approxAnnualSalary", ""); // Reset here for test.
  var approxAnnualSalary = GM_getValue("approxAnnualSalary", "");
  var checkPriorCancellation = GM_getValue("UserCancelledPrompt");

  if ((approxAnnualSalary == "" || !approxAnnualSalary) && !checkPriorCancellation) {
    approxAnnualSalary = prompt('To calculate how many hours of your life, each item will cost, add an approximate Annual Salary/Wage Amount :', '');
    if (approxAnnualSalary) {
      GM_setValue("approxAnnualSalary", approxAnnualSalary);
      GM_setValue("UserCancelledPrompt", false);
      console.log("Stored approxAnnualSalary : " + approxAnnualSalary);
    }
    else {
      GM_setValue("UserCancelledPrompt", true);
      console.log("User Cancelled prompt to update approxAnnualSalary.");
    }
  }

  // call this function once
  AddButton();

  // call this every 2 seconds to update according to page load
  setInterval(function () {
    updateValuesINR();
  }, 2000);

})();
