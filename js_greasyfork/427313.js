// ==UserScript==
// @name         West Wiki Helper
// @version      0.2
// @description  West Wiki Helper Updater
// @author       Thathanka Iyothanka
// @include		   http*://*.the-west.*/game.php*
// @include		   http*://*.the-west.*.*/game.php*
// @grant        none
// @namespace https://greasyfork.org/users/13941
// @downloadURL https://update.greasyfork.org/scripts/427313/West%20Wiki%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/427313/West%20Wiki%20Helper.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function sendWWHData(locale, items, sets) {
    const base_url = "https://wiki.west-tools.fr";
    const data = {
      locale: locale,
      items: JSON.stringify(items),
      sets: JSON.stringify(sets),
    };
    $("div#wwh-update-result").text("Processing...");
    $.post(base_url + "/update", data, function (res) {
      const el = $("div#wwh-update-result");
      if (res.success == false) {
        el.text("An error occurred");
      } else {
        if (res.update) {
          el.text("Successful update");
        } else {
          el.text("Already up to date");
        }
      }
    });
  }

  function openWWHWindow() {
    const content = $('<div style="padding:10px;"></div>');
    const locale = Game.locale.substring(0, 2);
    content.append('<div style="margin:5px;">Locale: ' + locale + "</div>");
    content.append(
      new west.gui.Button("Sync data")
        .click(function () {
          const sets = west.storage.ItemSetManager._setArray;
          const items = ItemManager.getAll();
          sendWWHData(locale, items, sets);
        })
        .getMainDiv()
    );
    content.append('<div id="wwh-update-result" style="margin:5px;"></div>');
    wman
      .open("west-wwh", null, "west-wwh")
      .setSize(350, 220)
      .setTitle("West Wiki Helper")
      .setMiniTitle("WWH")
      .appendToContentPane(content);
  }
  function createWWHButton() {
    var icon = $("<div></div>")
      .attr({
        class: "menulink",
        title: "West Wiki Helper",
      })
      .css({
        background: "url(https://i.imgur.com/YwiGkpX.png)",
        "background-position": "0px 0px",
      })
      .mouseleave(function () {
        $(this).css("background-position", "0px 0px");
      })
      .mouseenter(function (e) {
        $(this).css("background-position", "25px 0px");
      })
      .click(function () {
        openWWHWindow();
      });
    var bottom = $("<div></div>").attr({
      class: "menucontainer_bottom",
    });
    $("#ui_menubar .ui_menucontainer:last").after(
      $("<div></div>")
        .attr({
          class: "ui_menucontainer",
          id: "WWH",
        })
        .append(icon)
        .append(bottom)
    );
  }
  createWWHButton();
})();
