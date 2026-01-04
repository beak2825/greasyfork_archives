// ==UserScript==
// @name         WoD 物品批量发送
// @icon         http://info.world-of-dungeons.org/wod/css/WOD.gif
// @namespace    https://www.wannaexpresso.com
// @description  Exchange items among heroes in one view!
// @author       DotIN13
// @include      http*://*.world-of-dungeons.org/wod/spiel/hero/items.php?*
// @include      http*://*.wannaexpresso.com/wod/spiel/hero/items.php?*
// @grant        none
// @modifier     Christophero
// @version      2022.08.21.1
// @downloadURL https://update.greasyfork.org/scripts/520631/WoD%20%E7%89%A9%E5%93%81%E6%89%B9%E9%87%8F%E5%8F%91%E9%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/520631/WoD%20%E7%89%A9%E5%93%81%E6%89%B9%E9%87%8F%E5%8F%91%E9%80%81.meta.js
// ==/UserScript==

(function () {
  "use strict";

  var queryData;
  var queryURL;

  window.addEventListener("load", function () {
    if (
      $('input[name="view"]').val() == "cellar" ||
      $('input[name="view"]').val() == ""
    ) {
      $("input[name='ok']")
        .parent()
        .append(
          "<a class='move_item button' href='#'>移动物品</a>",
          "<div class='move_progress'></div>"
        );
      getSelect();
      $(".move_item").click(function () {
        $(".move_progress").html("开始移动物品。");
        var progress = 0;
        var task = 0;
        $(".send-target").each(function () {
          if ($(this).val() != "none") task++;
        });
        $(".send-target").each(function () {
          if ($(this).val() != "none") {
            var target = $(this).val();
            var params = $(this)
              .parent()
              .siblings()
              .find("a")
              .attr("href")
              .match(/item_instance_id=(\d+)&type=\d&name=([^&]*)/);
            var data =
              queryData
                .replace(/&id=\d+/g, "&id=" + params[1])
                .replace(/&name=[^&]*/, "&name=" + params[2])
                .replace(/&send_to=[^&]*/, "&send_to=" + target) +
              "&send_to_exec=√";
            $(this).parent().parent().remove();
            console.log(queryURL, data);
            $.ajax({
              type: "POST",
              url: queryURL,
              data: data,
              success: function () {
                progress++;
                $(".move_progress").html(
                  "已移动" + progress + "/" + task + "个物品。"
                );
                if (progress == task) {
                  $(".move_progress").html("已移动全部物品。");
                }
              },
            });
          }
        });
      });
    }
  });

  function getSelect() {
    $(".move_progress").html("正在获取物品移动下拉菜单...");
    var firstItemURL = null;
    $(".layout_clear .content_table a[href*='item_instance_id']").each(
      function () {
        firstItemURL = $(this).attr("href");
        if (!$(this).html().match("!")) {
          return false;
        }
      }
    );
    if (firstItemURL) {
      $.ajax({
        type: "GET",
        url: firstItemURL,
      }).done(function (html) {
        var fullSelect =
          "<select class='send-target'><option value='none'>不移动</option>" +
          $('select[name="send_to"] optgroup', html).first().prop("outerHTML") +
          $('select[name="send_to"] optgroup', html).last().prop("outerHTML") +
          "</select>";
        var groupSelect =
          "<select class='send-target'><option value='none'>不移动</option>" +
          $('select[name="send_to"] optgroup', html).last().prop("outerHTML") +
          "</select>";
        $(".layout_clear .content_table thead tr.header")
          .add($(".layout_clear .content_table tfoot tr.header"))
          .append(
            "<th>移动物品<input type='checkbox' class='send-all'>" +
              fullSelect.replace("send-target", "send-template") +
              "</th>"
          );
        $(".layout_clear .content_table a[href*='item_instance_id']").each(
          function (index) {
            if ($(this).html().match("!")) {
              $(this)
                .parent()
                .parent()
                .append(
                  "<td>" +
                    groupSelect +
                    "<input type='checkbox' class='check-to-move'></td>"
                );
            } else {
              $(this)
                .parent()
                .parent()
                .append(
                  "<td>" +
                    fullSelect +
                    "<input type='checkbox' class='check-to-move'></td>"
                );
            }
          }
        );
        queryData = $("form", html).serialize();
        queryURL = $("form", html).attr("action");
        $(".send-template").change(function () {
          $("input.check-to-move:checked").prev().val($(this).val());
        });
        $(".send-all").change(function () {
          $("input.check-to-move").prop("checked", $(this).prop("checked"));
        });
        $(".move_progress").html("");
      });
    } else {
      $(".move_progress").html("请至少放置一件物品在这间储藏室里。");
    }
  }
})();
