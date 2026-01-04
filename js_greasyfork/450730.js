// ==UserScript==
// @name         West Wiki Helper Quests
// @version      0.1
// @description  Export quests from admintools
// @author       Thathanka Iyothanka <thathanka.tw@gmail.com>
// @include		 https://*.the-west.*/admin.php?screen=quest_view*
// @license      GPLv3 - http://www.gnu.org/licenses/gpl-3.0.txt
// @grant        none
// @namespace https://greasyfork.org/users/13941
// @downloadURL https://update.greasyfork.org/scripts/450730/West%20Wiki%20Helper%20Quests.user.js
// @updateURL https://update.greasyfork.org/scripts/450730/West%20Wiki%20Helper%20Quests.meta.js
// ==/UserScript==
/*
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */
(function (fn) {
  var script = document.createElement("script");
  script.setAttribute("type", "application/javascript");
  script.textContent = "(" + fn + ")();";
  document.body.appendChild(script);
  document.body.removeChild(script);
})(function () {
  //var base_url="http://localhost:8080";
  var base_url = "https://wiki.west-tools.fr";
  //Run script if all quests are shown
  function update(locale, version) {
    $("#update_result").html("Processing...");
    $.post(
      base_url + "/update_quests",
      { locale: locale, version: version, content: content },
      function (res) {
        $("#update_result").html(res);
      }
    );
  }

  var version = /.*?current version is (.*)/.exec(
    $("#logged").text().replace(/\n/g, "")
  )[1];
  var split_host = window.location.host.split(".");
  var locale = split_host[split_host.length - 1];
  if (locale=="net"){
      locale="gb";
  }
  var content = $("html").html();
  $('tbody th[colspan="8"]').each(function () {
    var text = $(this).text();
    var quest_id = /Quest Group: .*? \(ID : ([0-9]*?)\)/.exec(text)[1];
    $(this).append(
      '<a target="_blank" href="' +
        base_url +
        "/quest/" +
        locale +
        "/" +
        quest_id +
        '"> [Link]</a>'
    );
  });
  if ($('a[name="2043375"]').length > 0) {
    $.get(base_url + "/quests_version/" + locale, function (res) {
      var button = $('<a href="#">Update</a>').on("click", function () {
        update(locale, version);
      });
      var panel = $(
        "<div style='position:fixed;bottom:0;right:0;margin:20px;padding:15px;border:1px solid black;background:whitesmoke;box-shadow:1px 1px 3px 0px #1b1b1b6e;'>Version: " +
          res +
          "<br>Current version: " +
          version +
          "</div>"
      )
        .append("<br><br>")
        .append(button)
        .append('<div id="update_result"></div>');
      $("body").append(panel);
    });
  } else {
    console.log("Please show all quests");
  }
});