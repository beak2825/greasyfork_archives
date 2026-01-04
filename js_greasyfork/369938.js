// ==UserScript==
// @name            Xanax Vault Withdraw
// @author          FATU [1482556]
// @description     Withdraws enough money for the cheapest Xanax in a bazaar when you type "xan" in the withdraw field of your property vault
// @version	    1.0
// @include         https://www.torn.com/properties.php
// @require         https://code.jquery.com/jquery-3.3.1.min.js
// @namespace       https://greasyfork.org/users/191331
// @downloadURL https://update.greasyfork.org/scripts/369938/Xanax%20Vault%20Withdraw.user.js
// @updateURL https://update.greasyfork.org/scripts/369938/Xanax%20Vault%20Withdraw.meta.js
// ==/UserScript==

$(window).on("load", function() {
  var inputHidden = $(".input-money:hidden");
  var inputText = $(".input-money:text");

  // IMPORTANT
  // Paste your API key inside the quotes! Make sure there are no spaces, just the letters and numbers.
  var apiKey = "";

  // Check if API key variable is empty.
  if (apiKey == "") {
    alert("Xanax Withdrawer Script:\n\nYou haven't set up your API key.\nIf you're stuck, please follow the guide on the forum post.");
  }

  // Call API bazaar data.
  function getCheapestPrice() {
    return $.ajax({
      dataType: "json",
      url: "https://api.torn.com/market/206",
      data: {
        selections: "bazaar",
        key: apiKey
      }
    });
  }

  // Run through all API results and find the cheapest Xanax.
  function parsePrice(result) {
    var cheapest = null;

    // Run through all results and return the cheapest.
    $.each(result["bazaar"], function(key, val) {
      var cost = val["cost"];

      if (cheapest == null || cost < cheapest) {
        cheapest = cost;
      }
    });

    return cheapest;
  }

  // Check if value of hidden input is "xan", then replace with price.
  function checkXanQuery(element, price) {
    if (inputHidden.attr("value") == "xan") {
      element.val(price);

      // Stripping bullshit error classes from the input & withdraw button.
      if (element.val(price) && element.parent().hasClass("error")) {
        element.parent().removeClass("error").addClass("success");
        element.closest(".cont").find("span.btn-wrap").removeClass("disable");
      }
    }
  }

  // If "xan" has been entered into the withdraw field, withdraw amount for cheapest Xanax.
  function checkXan(element) {
    if (inputHidden.attr("value") == "xan") {

      // When API has been called fully, run checkXanQuery.
      $.when(getCheapestPrice()).done(function(result) {
        var cheapest = parsePrice(result);

        checkXanQuery(element, cheapest);
        console.log("API is up, $" + cheapest + " withdrawn");
      });

      // Fail-safe in case API is down.
      $(document).ajaxError(function(event, jqxhr, settings, thrownError) {

        // If the API call has failed, withdraw a default of $860,000.
        if (settings.url == "https://api.torn.com/market/206?selections=bazaar&key=" + apiKey) {
          if (inputHidden.attr("value") == "xan") {
            checkXanQuery(element, "860,000");
            console.log("API is down, $860000 withdrawn");
          }
        }
      });
    }
  }

  // Check for main input being changed.
  inputText.on("input", function() {
    // Change the value of hidden input whilst typing.
    inputHidden.attr("value", $(this).val());

    // Run all that shit.
    checkXan($(this));
  });
});
