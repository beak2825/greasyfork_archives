// ==UserScript==
// @name Facebook Ad Amount Spent Scraper
// @namespace Violentmonkey Script
// @match https://business.facebook.com/home/accounts?business_id=10153058354765891
// @grant none
// @description Scrapes The Amount Spent This Month on Facebook Ads For Each Account
// @version 1
// @locale USA
// @downloadURL https://update.greasyfork.org/scripts/392746/Facebook%20Ad%20Amount%20Spent%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/392746/Facebook%20Ad%20Amount%20Spent%20Scraper.meta.js
// ==/UserScript==

window.onload = setTimeout(scrape, 4000);

function scrape() {
  // creates text area to add scraped information
  var o = document.createElement("textarea");
  o.style.cssText =
    "position:fixed;top:2%;padding:15px;left:3%;width:90%;height:70%;max-height:80%;z-index:999999 !important;border:4px solid #888;overflow-y:scroll;background-color:#f0f0f0;color:#000;font-size:10px;";
  o.innerHTML = "";

  // returns name of Ad Account have to loop and provide array length and index number
  function getName(index) {
    let name = document
      .getElementsByClassName("_5h92")[1]
      .getElementsByClassName("_4r1j")
      [index].getElementsByClassName("ellipsis")[1].innerText;
    return name;
  }

  // returns amount spent must provide array lenght and index number
  function getAmount(index) {
    let amount = document
      .getElementsByClassName("_5h92")[1]
      .getElementsByClassName("_4r1j")
      [index].getElementsByClassName("__0t __0u __10 __13")[0]
      .getElementsByTagName("span")[0].innerText;
    return amount;
  }

  // loop over array add to text area
  const seeMore = function() {
    // clicks see more button
    if (
      document
        .getElementsByClassName("_5h92")[1]
        .getElementsByClassName("_57sb _57sc")[0]
    ) {
      let seeMoreButton = document
        .getElementsByClassName("_5h92")[1]
        .getElementsByClassName("_57sb _57sc")[0];
      seeMoreButton.click();
    } else {
      let array = document
        .getElementsByClassName("_5h92")[1]
        .getElementsByClassName("_4r1j");
      loopArray(array);
    }
  };

  var timer = setInterval(seeMore, 2000);

  function loopArray(array) {
    var items = new Array();
    var itemsOrdered = new Array();
    var theOrder = [
      "Goostree Law Group",
      "Newland",
      "Winters Salzetta",
      "Tedone Morton",
      "Pullano",
      "Jach",
      "Devadoss",
      "Pearson",
      "Bettersworth",
      "Weiner",
      "Ventresca",
      "OVC Photography",
      "Martoccio",
      "Elite Lawyer Ads"
    ];
    var itemsPositions = new Array();

    for (let i = 0; i < array.length; i++) {
      var name = getName(i);
      var amount = getAmount(i);
      items.push(name);
      items.push(amount);
    }
    for (var z = 0; z < items.length; z++) {
      if (items.indexOf(theOrder[z]) > -1) {
        itemsOrdered.push(theOrder[z]);
        let position = items.indexOf(theOrder[z]) + 1;
        itemsPositions.push(position);
      }
    }
    for (var x = 0; x < itemsOrdered.length; x++) {
      let item = itemsOrdered[x];
      let number = itemsPositions[x];
      let amount = items[number];
      o.innerHTML = o.innerHTML + item + ";" + amount + "\r\n";
    }

    if (o.innerHTML != "") {
      document.body.appendChild(o);
      clearInterval(timer);
      alert("Done");
    }
  }
}
