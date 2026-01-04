//-----------------------------------------------------------------------------
// [WoD] Item type / skill bonus auto completion
// Copyright (c) Jim Zhai
//-----------------------------------------------------------------------------
// ==UserScript==
// @name          Wod 自动完成下拉框
// @icon          http://info.world-of-dungeons.org/wod/css/WOD.gif
// @author        Jim Zhai
// @namespace     org.toj
// @description   Add auto completion text field for item type and skill bonus selector
// @include       http*://*.world-of-dungeons.*/wod/spiel/trade/trade.php*
// @include       http*://*.world-of-dungeons.*/wod/spiel/hero/items.php*
// @include       http*://*.world-of-dungeons.*/wod/spiel/tournament/duell.php*
// @include       http*://*.world-of-dungeons.*/wod/spiel/hero/skillconf_nojs.php*
// @include       http*://*.world-of-dungeons.*/wod/spiel/hero/skillconf.php*
// @include       http*://*.world-of-dungeons.*/wod/spiel/hero/skillconfig.php*
// @include       http*://zhao.world-of-dungeons.*
// @require       https://code.jquery.com/jquery-3.3.1.min.js
// @require       https://unpkg.com/select2@4.0.13/dist/js/select2.min.js
// @require       https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js
// @modifier      Christophero
// @version       2023.08.01.1
// @downloadURL https://update.greasyfork.org/scripts/520637/Wod%20%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90%E4%B8%8B%E6%8B%89%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/520637/Wod%20%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90%E4%B8%8B%E6%8B%89%E6%A1%86.meta.js
// ==/UserScript==

$(function () {
  ("use strict");

  let styleinitialized = false;

  function insertCss(select, styles) {
    if (document.styleSheets.length === 0) {
      //如果没有style标签,则创建一个style标签
      var style = document.createElement("style");
      document.head.appendChild(style);
    }
    var styleSheet = document.styleSheets[document.styleSheets.length - 1]; //如果有style 标签.则插入到最后一个style标签中
    var str = select + " {"; //插入的内容必须是字符串,所以得把obj转化为字符串
    for (var prop in styles) {
      str +=
        prop.replace(/([A-Z])/g, function (item) {
          //使用正则把大写字母替换成 '-小写字母'
          return "-" + item.toLowerCase();
        }) +
        ":" +
        styles[prop] +
        ";";
    }
    str += "}";
    styleSheet.insertRule(str, styleSheet.cssRules.length); //插入样式到最后一个style标签中的最后面
  }

  let $toolbarCss = $("<link>");
  $("head").prepend($toolbarCss);
  $toolbarCss.attr({
    rel: "stylesheet",
    type: "text/css",
    href: "https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/css/select2.min.css",
  });

  let minOptionCount = 13;
  let ignoreFields = [/^EquipItem\[\d+\]$/i, /^sndgrp\d*\[\d+\]$/i];
  const ignoreIds = [
    "xaerodegreaz_userscript_hero_select",
    "changeHeroGroupSelect",
  ];

  function needSelect2($this) {
    return (
      minOptionCount > 0 &&
      $this.find("option").length > minOptionCount &&
      nameCheck($this.prop("name")) &&
      idCheck($this.attr("id"))
    );
  }

  function addHideClass() {
    let $this = $(this);
    if (!needSelect2($this)) return;
    $this.addClass("select2-hidden-accessible");
  }

  function fullAddHideClass() {
    $("#orders select").each(addHideClass);
  }

  function fullReSelect2() {
    console.log("销毁并重构");
    // 先销毁所有select2
    $("#orders select").each(function (i, e) {
      if ($(this).next(".select2-container").length) {
        $(this).select2("destroy");
      }
    });
    // 移除所有隐藏类
    $("#orders select").removeClass("select2-hidden-accessible");
    // 对所有可见的select构建select2的下拉框
    $("#orders select:visible").each(function (i, e) {
      let $this = $(this);
      if (!needSelect2($this)) return;
      $this.find("option").each(function () {
        if (!this.text) {
          this.text = "　";
        }
      });
      $this
        .select2({
          width: "resolve",
          language: {
            noResults: function (params) {
              return "暂无数据";
            },
          },
        })
        .on("select2:select", function () {
          deFullReSelect2();
        });
    });
  }

  const deFullReSelect2 = _.debounce(fullReSelect2, 50, {
    leading: true,
    trailing: false,
  });
  const deFullAddHideClass = _.debounce(fullAddHideClass, 50, {
    leading: true,
    trailing: false,
  });

  function prepareSelect2() {
    // 初始化select2样式
    initSelect2Style();

    if (
      [
        "/wod/spiel/hero/skillconf_nojs.php",
        "/wod/spiel/hero/skillconf.php",
        "/wod/spiel/hero/skillconfig.php",
      ].includes(location.pathname)
    ) {
      // 选择技能时会导致页面显示刷新，将select2的隐藏class移除，这里需要加回来
      $("#orders select").on("change", function () {
        // fullAddHideClass();
        deFullAddHideClass();
        if (!$(this).next(".select2-container").length) {
          // fullReSelect2();
          deFullReSelect2();
        }
      });
      // 点击行动时会根据行动重新生成右侧select，这时select2还是之前数据，需要销毁重新生成
      // 点击地城/决斗/一般分页也会导致页面刷新，追加
      // 点击侧面按钮也会导致页面刷新
      $(
        '#orders .wod-list-items, .wod-tabs li[id^="wod-orders-tab-"], .wod-list-buttons img, .wod-list-buttons button'
      ).click(function () {
        deFullReSelect2();
      });

      deFullReSelect2();

      $("#main_content select").each(function (i, select) {
        let $this = $(select);
        let previousValue = select.style.display;
        // 监听select的style变化，这里在select显示隐藏发生变化时进行处理
        const observer = new MutationObserver(function (mutations) {
          mutations.forEach(function (mutation) {
            if (mutation.attributeName !== "style") return;
            const currentValue = mutation.target.style.display;
            if (currentValue !== previousValue) {
              // select 显示
              if (previousValue === "none" && currentValue !== "none") {
                console.log("display none has just been removed!");
                if (!needSelect2($this)) return;
                $this.find("option").each(function () {
                  if (!this.text) {
                    this.text = "　";
                  }
                });
                // 选中选项时，需要重新刷新select2状态
                $this
                  .select2({
                    width: "resolve",
                    language: {
                      noResults: function (params) {
                        return "暂无数据";
                      },
                    },
                  })
                  .on("select2:select", function () {
                    deFullAddHideClass();
                    // setTimeout(fullReSelect2, 50);
                  });
              } else if (previousValue !== "none" && currentValue === "none") {
                try {
                  $this.select2("destroy");
                } catch (e) {}
              }

              previousValue = mutation.target.style.display;
            }
          });
        });
        observer.observe(select, { attributes: true });
      });
    } else {
      // 非设置页面直接进行select2设置就行了
      $("select").each(function () {
        let $this = $(this);
        if (!needSelect2($this)) return;
        $this.find("option").each(function () {
          if (!this.text) {
            this.text = "　";
          }
        });

        $this.select2({
          width: "resolve",
          language: {
            noResults: function (params) {
              return "暂无数据";
            },
          },
        });
      });
    }
  }

  /**
   *
   * @returns 初始化select2下拉框样式，从第一个select上获得高度，颜色等
   */
  function initSelect2Style() {
    if (styleinitialized) return;
    let $this = $(".main_content select:visible:first");
    let dummy = false;
    if (!$this.length) {
      const $dummySelect = $("<select><option>DUMMY SELECT</option></select>");
      $(".main_content").append($dummySelect);
      $this = $dummySelect;
      dummy = true;
    }
    const height = $this.css("height");
    const outerHeight = $this.outerHeight() + "px";
    const backgroundColor = $this.css("background-color");
    const fontColor = $this.css("color");
    const border = $this.css("border");
    const fontSize =
      ((parseFloat($this.css("font-size")) * 72.0) / 96.0).toFixed() + "pt";
    const borderRadius = $this.css("border-radius");
    initStyle({
      outerHeight,
      border,
      borderRadius,
      backgroundColor,
      height,
      fontSize,
      fontColor,
    });
    if (dummy) {
      $this.remove();
    }
  }

  function initStyle({
    outerHeight,
    border,
    borderRadius,
    backgroundColor,
    height,
    fontSize,
    fontColor,
  }) {
    if (styleinitialized) return;
    insertCss(".select2-results__option", { padding: "2px 5px" });
    insertCss(
      ".select2-container--default .select2-results>.select2-results__options",
      { maxHeight: "60vh", borderRadius: "0 0 5px 5px" }
    );
    insertCss(".select2-container .select2-selection--single", {
      height: outerHeight,
      border,
      borderRadius,
      backgroundColor,
    });
    insertCss(
      ".select2-container--default .select2-selection--single .select2-selection__rendered, .select2-container--default .select2-selection--multiple .select2-selection__rendered",
      {
        fontSize,
        color: fontColor,
        paddingLeft: "5px",
        lineHeight: "1.5",
        textOverflow: "inherit",
      }
    );
    insertCss(
      ".select2-container--default .select2-selection--single .select2-selection__rendered",
      {
        height,
      }
    );
    insertCss(
      ".select2-container--default .select2-selection--single .select2-selection__arrow",
      { height }
    );
    insertCss(
      ".select2-container--default .select2-selection--single, .select2-container--default .select2-selection--multiple",
      {
        backgroundColor,
        fontSize,
        color: fontColor,
        border,
      }
    );
    insertCss(".select2-dropdown", {
      backgroundColor,
      fontSize,
      color: fontColor,
      border,
    });
    insertCss(".select2-selection", {
      backgroundColor,
      fontSize,
    });
    insertCss(".select2-results__option", {
      backgroundColor,
      color: fontColor,
    });
    const arrowColor =
      backgroundColor == "rgb(255, 255, 255)" ? "#000" : "#fff";
    insertCss(
      ".select2-container--default .select2-selection--single .select2-selection__arrow b, .select2-container--default .select2-selection--multiple .select2-selection__arrow b",
      { borderColor: `${arrowColor} transparent transparent transparent` }
    );
    insertCss(
      ".select2-container--default.select2-container--open .select2-selection--single .select2-selection__arrow b, .select2-container--default.select2-container--open .select2-selection--multiple .select2-selection__arrow b",
      { borderColor: `transparent transparent ${arrowColor} transparent` }
    );
    if (
      backgroundColor == "rgb(102, 91, 71)" &&
      fontColor == "rgb(255, 255, 255)"
    ) {
      insertCss(
        ".select2-container--default .select2-selection--multiple .select2-selection__choice",
        {
          backgroundColor: "rgb(99 71 19)",
        }
      );
    }
  }

  /**
   * 跳过名称符合正则的下拉框
   * @param {*} field
   * @returns
   */
  function nameCheck(field) {
    if (ignoreFields.length <= 0) {
      return true;
    }

    let flag = true;
    $.each(ignoreFields, function (index, pattern) {
      if (field.search(pattern) != -1) {
        flag = false;
      }
    });
    return flag;
  }

  /**
   * 跳过ID在列表中的下拉框
   * @param {*} id
   * @returns
   */
  function idCheck(id) {
    if (ignoreIds.includes(id)) {
      return false;
    }
    return true;
  }

  prepareSelect2();
});
