// ==UserScript==
// @name        WaniKani Customize Wrap Up
// @namespace   http://alsanchez.es/
// @include     /^https?://(www\.)?wanikani\.com/review/session/?$/
// @version     4
// @grant       none
// @description Customize the number of wrap-up items
// @downloadURL https://update.greasyfork.org/scripts/24931/WaniKani%20Customize%20Wrap%20Up.user.js
// @updateURL https://update.greasyfork.org/scripts/24931/WaniKani%20Customize%20Wrap%20Up.meta.js
// ==/UserScript==


(function($)
{
  var numberOfItems = localStorage.getItem("wanikani-addon-number-of-wrap-up-items") || 10;
  var wrapUpActive = false;

  let observer = new MutationObserver(function(mutations)
  {
      for(let mutation of mutations)
      {
          if(mutation.target.id === "loading")
          {
              initialize();
              observer.disconnect();
              break;
          }
      }
  });

  observer.observe(document.querySelector("#loading"), {
      attributes: true
  });

  function initialize()
  {
    createIcon();

    var wrapUp = document.getElementById("option-wrap-up");
    wrapUp.addEventListener("click", function()
    {
      wrapUpActive = !wrapUpActive;

      if(wrapUpActive)
      {
        updateQueues(numberOfItems);
      }

      // Force available-count update
      $.jStorage.set("activeQueue", $.jStorage.get("activeQueue"));
    });
  }

  function createIcon()
  {
    var container = $('<span style="cursor: pointer;">');
    container.append($('<i class="icon-time"></i>'));
    var numberOfItemsLabel = $("<span>").html(numberOfItems);
    container.append(numberOfItemsLabel);
    container.click(function()
    {
      var answer = prompt("Number of items");
      if(answer !== null)
      {
        numberOfItems = answer;
        numberOfItemsLabel.html(numberOfItems);
        localStorage.setItem("wanikani-addon-number-of-wrap-up-items", numberOfItems);
      }
    });

    $("#stats").prepend(container);
  }

  function updateQueues(numberOfItems)
  {
    var activeQueue = getSortedActiveQueue();
    var reviewQueue = $.jStorage.get("reviewQueue");
    var newQueue = getSortedActiveQueue().concat(reviewQueue);
    numberOfItems = Math.min(numberOfItems, newQueue.length);
    $.jStorage.set("activeQueue", newQueue.slice(0, numberOfItems));
    $.jStorage.set("reviewQueue", newQueue.slice(numberOfItems));
  }

  function getSortedActiveQueue()
  {
    var currentItem = $.jStorage.get("currentItem");
    var otherItems = $.jStorage.get("activeQueue").filter(function(item)
    {
      return item.id !== currentItem.id;
    });

    return [ currentItem ].concat(otherItems);
  }
})(window.jQuery);