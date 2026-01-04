// ==UserScript==
// @name         日本語ModデータベースのR18を常時表示
// @namespace    com.mikan-megane.moddatabaser18
// @version      0.2
// @description  広告ブロックなどしてからご利用ください。
// @author       mikan-megane
// @match        https://*.2game.info/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430488/%E6%97%A5%E6%9C%AC%E8%AA%9EMod%E3%83%87%E3%83%BC%E3%82%BF%E3%83%99%E3%83%BC%E3%82%B9%E3%81%AER18%E3%82%92%E5%B8%B8%E6%99%82%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/430488/%E6%97%A5%E6%9C%AC%E8%AA%9EMod%E3%83%87%E3%83%BC%E3%82%BF%E3%83%99%E3%83%BC%E3%82%B9%E3%81%AER18%E3%82%92%E5%B8%B8%E6%99%82%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
  "use strict";

  jQuery(".mainSection .mainDesc .character span.pink").each((i, elm) => {
    var $dd = jQuery(elm).closest("dd");
    console.debug([i, elm, $dd]);
    $dd
      .find(".mainDesc")
      .load($dd.prev("dt").find('a[href^="/detail.php"]').attr("href") + " #modDesc .desc", () => {
        $dd.find("character").unwrap();
        // サイトに合わせるため、/js/common.jsよりほぼ引用
        var moreOff = localStorage.getItem("moreOff");
        var agent = navigator.userAgent;
        var sp = false;
        if (agent.search(/iPhone/) != -1 || agent.search(/iPod/) != -1 || (agent.indexOf('Android') > 0 && agent.indexOf('Mobile') > 0)) {
          sp = true;
        }
        if (!sp && $('#page_detail').size()) {
          moreOff = 1;
        }
        if (moreOff == "0" || !moreOff) {
          var thisH = $dd.find(".character").height();
          var baseH = 292;
          if (agent.indexOf('chrome') != -1) {
            baseH = 304;
          }
          if (agent.search(/iPhone/) != -1 || agent.search(/iPod/) != -1 || agent.search(/iPad/) != -1) {
            baseH = 284;
          }

          if (thisH > (baseH + 50)) {
            $dd.find(".character").css("height", baseH + "px").css("overflow", "hidden").after('<div class="more"><span>▼　続　き　を　読　む</span></div>');
            $dd.find(".more").click(function () {
              $(this).hide().prev().css("height", "auto").css("overflow", "visible");
            });
          }
        }
        // 引用ここまで
        $dd.find(".lazy").each((j, img) => {
          jQuery(img).lazyload();
        });
      }
      );
  });
})();