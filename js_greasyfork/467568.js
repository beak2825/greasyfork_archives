// ==UserScript==
// @name GOG additional buttons and downloads
// @homepageURL https://gog-games.com/
// @description Add GOG DB and GOG Games links to the GOG store
// @version 4.1.1
// @author Wizzergod
// @license MIT
// @namespace GOG additional buttons and downloads
// @icon https://www.google.com/s2/favicons?sz=64&domain=www.gog.com
// @run-at document-end
// @match https://www.gog.com/*/game/*
// @match https://www.gog.com/game/*
// @match https://web.archive.org/web/*
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/467568/GOG%20additional%20buttons%20and%20downloads.user.js
// @updateURL https://update.greasyfork.org/scripts/467568/GOG%20additional%20buttons%20and%20downloads.meta.js
// ==/UserScript==


(function() {
  var productcardData = unsafeWindow.productcardData;
  var product_id = productcardData.cardProductId;
  var product_slug = productcardData.cardProductSlug;
  var product_title = productcardData.cardProduct.title;

  var separator_element = document.createTextNode(" ");

  function addLink(text, href, className, targetElement) {
    var link_element = document.createElement("a");
    link_element.textContent = text;
    link_element.setAttribute("href", href);
    link_element.className = className;
    link_element.setAttribute("target", "_blank");
    link_element.style = "margin: 5px 0 5px 0 !important; padding: 5px 10px 5px 10px;";

    targetElement.parentNode.insertBefore(separator_element.cloneNode(true), targetElement.nextSibling);
    targetElement.parentNode.insertBefore(link_element, targetElement.nextSibling);
  }

  var mainButtonDeciderElement = document.querySelector("div[main-button-decider].ng-scope");
  if (mainButtonDeciderElement) {

//Forums
    addLink("View on SteamDB", "https://steamdb.info/search/?a=app&q=" + product_title, "button button--big go-to-library-button", mainButtonDeciderElement);
    addLink("View on forum - f95zone", "https://f95zone.to/search/search?keywords=" + product_title, "button button--big install-button ng-scope", mainButtonDeciderElement);
    addLink("View on forum - cs.rin.ru", "https://cs.rin.ru/forum//search.php?st=0&sk=t&sd=d&sr=topics&terms=any&sf=titleonly&keywords=" + product_title, "button button--big install-button ng-scope", mainButtonDeciderElement);

//Another
    addLink("Download Free from - 1337x.to", "https://1337x.to/search//1/?search=" + product_title, "button button--big cart-button ng-scope", mainButtonDeciderElement);
    addLink("Download Free from - nnmclub.to", "https://nnmclub.to/forum/tracker.php?nm=" + product_title, "button button--big cart-button ng-scope", mainButtonDeciderElement);
    addLink("Download Free from - igrovaya.org", "https://igrovaya.org/?do=search&story=" + product_title, "button button--big cart-button ng-scope", mainButtonDeciderElement);
    addLink("Download Free from - rutracker.org", "https://rutracker.org/forum/tracker.php?nm=" + product_title, "button button--big cart-button ng-scope", mainButtonDeciderElement);
    addLink("Download Free from - catorrent.org", "https://catorrent.org/index.php?do=search&story=" + product_title, "button button--big cart-button ng-scope", mainButtonDeciderElement);
    addLink("Download Free from - thelastgame.ru", "https://thelastgame.ru/?s=" + product_title, "button button--big cart-button ng-scope", mainButtonDeciderElement);
    addLink("Download Free from - thelastgame.org", "https://thelastgame.org/?do=search&subaction=search&story=" + product_title, "button button--big cart-button ng-scope", mainButtonDeciderElement);
    addLink("Download Free from - thepiratebay.org", "https://thepiratebay.org/search.php?cat=401&q=" + product_title, "button button--big cart-button ng-scope", mainButtonDeciderElement);
    addLink("Download Free from - limetorrents.lol", "https://www.limetorrents.lol/search/games/" + product_title, "button button--big cart-button ng-scope", mainButtonDeciderElement);
    addLink("Download Free from - thelastgame.club", "https://s1.thelastgame.club/?do=search&subaction=search&story=" + product_title, "button button--big cart-button ng-scope", mainButtonDeciderElement);
    addLink("Download Free from - torrentdownload.info", "https://www.torrentdownload.info/search?q=" + product_title, "button button--big cart-button ng-scope", mainButtonDeciderElement);
    addLink("Download Free from - torrentdownloads.pro", "https://www.torrentdownloads.pro/search/?search=" + product_title, "button button--big cart-button ng-scope", mainButtonDeciderElement);
//Gog
    addLink("Download Free from - FreeGogPcGames", "https://freegogpcgames.com/?s=" + product_title, "button button--big cart-button ng-scope", mainButtonDeciderElement);
    addLink("Download Free from - GoGUnlocked", "https://gogunlocked.com/?s=" + product_title, "button button--big cart-button ng-scope", mainButtonDeciderElement);
    addLink("Download Free from - Gog-Games", "https://gog-games.to/search/" + product_title, "button button--big cart-button ng-scope", mainButtonDeciderElement);
    addLink("View on GOGDB", "https://www.gogdb.org/product/" + product_id, "button button--big go-to-library-button", mainButtonDeciderElement);
  }


        element.style = "margin: 5px 0 5px 0 !important; padding: 5px 10px 5px 10px;";

})();
