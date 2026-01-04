// ==UserScript==
// @name         Nyaa Magnet Catcher
// @namespace    https://greasyfork.org/zh-CN/scripts/377643
// @version      0.1
// @description  列表页批量选择复制磁力链接，适合配合aria2等下载软件导入批量任务
// @author       luminisward
// @match        https://*.nyaa.si/
// @match        https://*.nyaa.si/?*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js
// @downloadURL https://update.greasyfork.org/scripts/377643/Nyaa%20Magnet%20Catcher.user.js
// @updateURL https://update.greasyfork.org/scripts/377643/Nyaa%20Magnet%20Catcher.meta.js
// ==/UserScript==

(function() {
  "use strict";
  function insertCheckbox() {
    var headRow = $(".table thead tr");
    headRow.prepend(
      $("<tr>").append(
        $('<input type="checkbox" id="checkall" />')
          .attr("checked", true)
          .change(function() {
            $("tbody input").prop("checked", this.checked);
          })
      )
    );

    var bodyRows = $(".table tbody tr");
    bodyRows.prepend(
      $("<tr>").append($('<input type="checkbox" />').attr("checked", true))
    );
  }

  function getCheckedList() {
    var checkboxList = $("tbody input");
    return $.map(checkboxList, x => x.checked);
  }

  function getMagnetLinks() {
    var bodyRows = $("tbody a");
    var links = $.map(bodyRows, x => x.href);
    return links.filter(link => link.includes("magnet:"));
  }

  function insertCopyButton() {
    var navBar = $("ul.nav");
    var button = document.createElement("li");
    var a = document.createElement("a");
    $(a)
      .attr("href", "#")
      .attr("id", "copyMagnet")
      .text("Copy All MagnetLink")
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
      var checkedList = getCheckedList();

      links = links.filter(function(val, i) {
        return checkedList[i];
      });
      return links.join("\n");
    }
  });
})();
