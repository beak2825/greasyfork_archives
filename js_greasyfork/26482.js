// ==UserScript==
// @name         IndieGala: Check giveaways if won
// @version      1.1.0
// @description  Check won giveaways the fast & convenient way
// @author       Hafas (https://github.com/Hafas/)
// @match        https://www.indiegala.com/profile*
// @grant        none
// @namespace https://greasyfork.org/users/56087
// @downloadURL https://update.greasyfork.org/scripts/26482/IndieGala%3A%20Check%20giveaways%20if%20won.user.js
// @updateURL https://update.greasyfork.org/scripts/26482/IndieGala%3A%20Check%20giveaways%20if%20won.meta.js
// ==/UserScript==
(function () {
  var $completedTab = $(".giveaway-completed").parent();
  $completedTab.prepend("<button/>");
  var $myButton = $("button", $completedTab).first();
  activateButton();
  $myButton.on("click", function () {
    deactivateButton();
    checkAllIfWon().then(function (html) {
      printSummary(html);
      activateButton();
    });
  });

  function activateButton () {
    $myButton.html("Check all if won");
    $myButton.css({
      background: "#CC001D",
      color: "white",
      float: "right",
      marginLeft: "2px",
      padding: "9px"
    });
    $myButton.attr("disabled", false);
  }

  function deactivateButton () {
    $myButton.html("Checking ...");
    $myButton.css({background: "#999"});
    $myButton.attr("disabled", true);
  }

  function getCompleted () {
    return $.ajax({
      url: "/giveaways/library_completed",
      dataType: "json"
    }).then(null, function (error) {
      //retry in 10s
      return delay(getCompleted, 10000);
    });
  }

  function checkAllIfWon (entryIds) {
    return $.ajax({
      url: "/giveaways/check_if_won_all"
    }).then(null, function () {
      //retry in 10s
      return delay(checkAllIfWon, 10000);
    });
  }

  function printSummary (html) {
    alert($(html).text().trim());
  }

  function delay (fn, timeout) {
    return $.Deferred(function (d) {
      setTimeout(function () {
        fn().then(function (value) {
          d.resolve(value);
        });
      }, timeout);
    });
  }
})();
