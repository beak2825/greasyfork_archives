// ==UserScript==
// @name         hitomi.la url catcher
// @version      0.1
// @description  Copy shown content's URL and name to clipboard, maintained for JDownloader2. like https://URL%Packagename=name, and based nyaa magnet catcher thank you very much for based coder.
// @author       luminisward, aPirateAnonymous.
// @license      CC0 PublicDomain
// @match        https://hitomi.la/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js
// @namespace https://greasyfork.org/users/2810
// @downloadURL https://update.greasyfork.org/scripts/473134/hitomila%20url%20catcher.user.js
// @updateURL https://update.greasyfork.org/scripts/473134/hitomila%20url%20catcher.meta.js
// ==/UserScript==

(function() {
  "use strict";
  function insertCheckbox() {
    var headRow = $("div.top-content");
    headRow.prepend(
      $("<tr>").append(
        $('<input type="checkbox" id="checkall" />')
          .attr("checked", true)
          .change(function() {
            $("tbody input").prop("checked", this.checked);
          })
      )
    );

    var bodyRows = $("div.gallery-content");
    bodyRows.prepend(
      $("<tr>").append($('<input type="checkbox" />').attr("checked", true))
    );
  }

  function getCheckedList() {
    var checkboxList = $("div.gallery-content");
    return $.map(checkboxList, x => true);
  }

  function getMagnetLinks() {
    var bodyRows = $("div.gallery-content div h1 a");
    var links = $.map(bodyRows, x => x.href + "#packagename=" + x.firstChild.data);
    return links.filter(link => link.includes(".html"));
  }

  /* function getName() {
    var bodyRows = $("div.gallery-content div.dj h1 a");
    return links = $.map(bodyRows, x => x.firstChild.data );
  } */

  function insertCopyButton() {//sounyuu the CopyButton to top panel
    var navBar = $("div.top-content")
    var button = document.createElement("li");
    var a = document.createElement("a");
    $(a)
      .attr("href", "#")
      .attr("id", "copyMagnet")
      .text("Copy All Links")
      .click(e => {
        e.preventDefault();
      });
    button.append(a);
    navBar[0].append(button);
  }

  insertCopyButton();
  insertCheckbox();

  new ClipboardJS("#copyMagnet", {
    text: function() {
      var links = getMagnetLinks();
      //var names = getName();
      var checkedList = getCheckedList();

      /* links = links.filter(function(val, i) {
        return checkedList[i];
      }); */
      return links.join("\n");
    }
  });
})();
