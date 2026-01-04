// ==UserScript==
// @name         vue文档修改阅读背景
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  vue文档修改阅读背景颜色
// @author       You
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.2.1/jquery.min.js
// @require      https://code.jquery.com/ui/1.13.2/jquery-ui.js
// @icon         https://s1.ax1x.com/2022/09/05/v7FgKO.jpg
// @match        https://vuex.vuejs.org/*
// @match        https://cn.vuejs.org/*
// @match        https://cn.vitejs.dev/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/453835/vue%E6%96%87%E6%A1%A3%E4%BF%AE%E6%94%B9%E9%98%85%E8%AF%BB%E8%83%8C%E6%99%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/453835/vue%E6%96%87%E6%A1%A3%E4%BF%AE%E6%94%B9%E9%98%85%E8%AF%BB%E8%83%8C%E6%99%AF.meta.js
// ==/UserScript==

(function () {
  "use strict";
  var cssContent = {
    "div#CL_Console": {
      "-moz-user-select": "none",
      "-webkit-user-select": "none",
      "-ms-user-select": "none",
      "-khtml-user-select": "none",
      "user-select": "none",
      position: "fixed",
      top: "30%",
      left: "2px",
      "z-index": "99",
    },
    "img#CL_img": {
      width: "35px",
      "border-radius": "20px",
      cursor: "pointer",
    },
    ".none": {
      display: "none",
    },
    ".block": {
      display: "block",
    },
    "div#CL_OperationPanel": {
      width: "300px",
      height: "300px",
      background: "rgb(232 240 255 / 70%)",
      "backdrop-filter": "blur(3px)",
      position: "absolute",
      top: "20px",
      left: "35px",
      "box-shadow": "1px 1px 4px 0px #747698",
      "border-radius": "6px",
      padding: "10px",
    },
    "div#color-box": {
      height: "100px",
      width: "250px",
      margin: "auto",
      display: "flex",
      "justify-content": "space-evenly",
    },
    ".pink": {
      height: "50px",
      width: "50px",
      background: "red",
    },
    "input#yellow": {
      height: "50px",
      width: "50px",
      background: "rgb(36, 12, 15)",
    },
    "input#black": {
      height: "50px",
      width: "50px",
      background: "rgb(233, 172, 152)",
    },
    "div#a": {
      height: "50px",
      width: "50px",
      "border-radius": "50%",
      "background-color": "antiquewhite",
      "text-align": "center",
      "line-height": "50px",
    },
    "div#b": {
      height: "50px",
      width: "50px",
      "border-radius": "50%",
      "background-color": "lightblue",
      "text-align": "center",
      "line-height": "50px",
    },
    "div#c": {
      height: "50px",
      width: "50px",
      "border-radius": "50%",
      "background-color": "beige",
      "text-align": "center",
      "line-height": "50px",
    },
  };

  //   加载控制面板
  $("body").append(
    $('<div id="CL_Console">')
      .append(
        $(
          '<img id="CL_img" src="https://s1.ax1x.com/2022/09/05/v7FgKO.jpg" title="控制中心"/>'
        )
      )
      .append(
        $('<div id="CL_OperationPanel" class="none">')
          .append($("<div>阅读背景</div>"))
          .append(
            $(`
          <div id="color-box">
          <div id="a">A</div>
          <div id="b">B</div>
          <div id="c">C</div>
        </div>
          
          `)
          )
      )
  );
  for (var selector in cssContent) {
    $(selector).css(cssContent[selector]);
  }

  $(document).on("click", "#CL_img", function () {
    $("#CL_OperationPanel").toggle(200);
  });

  //监听按钮的拖动
  $(function () {
    $("#CL_Console").draggable();
    console.log(9999);
  });

  var localHost = location.host;
  $("#a").on("click", this, function () {
    $(this).css("border", "1px solid rgb(66, 62, 62)");
    $("#b").css("border", "");
    $("#c").css("border", "");
    if (localHost === "vuex.vuejs.org") {
      $(".container").eq(0).css("background-color", "antiquewhite");
    } else if (localHost === "cn.vuejs.org") {
      $(".container").eq(1).css("background-color", "antiquewhite");
    } else if (localHost === "cn.vitejs.dev") {
      $(".container").eq(2).css("background-color", "antiquewhite");
    }
  });

  $("#b").on("click", this, function () {
    $(this).css("border", "1px solid rgb(66, 62, 62)");
    $("#a").css("border", "");
    $("#c").css("border", "");
    if (localHost === "vuex.vuejs.org") {
      $(".container").eq(0).css("background-color", "lightblue");
    } else if (localHost === "cn.vuejs.org") {
      $(".container").eq(1).css("background-color", "lightblue");
    } else if (localHost === "cn.vitejs.dev") {
      $(".container").eq(2).css("background-color", "lightblue");
    }
  });
  $("#c").on("click", this, function () {
    $(this).css("border", "1px solid rgb(66, 62, 62)");
    $("#a").css("border", "");
    $("#b").css("border", "");
    console.log($(".container").length);
    if (localHost === "vuex.vuejs.org") {
      $(".container").eq(0).css("background-color", "beige");
    } else if (localHost === "cn.vuejs.org") {
      $(".container").eq(1).css("background-color", "beige");
    } else if (localHost === "cn.vitejs.dev") {
      $(".container").eq(2).css("background-color", "beige");
    }
  });
})();
