// ==UserScript==
// @name         v站增强
// @namespace    https://www.yffjglcms.com/
// @version      0.1.1.20210402
// @description  v2ex站点增强插件.增强评论查看模式。
// @author       yffjglcms
// @match        https://v2ex.com/t/*
// @match        https://www.v2ex.com/t/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423708/v%E7%AB%99%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/423708/v%E7%AB%99%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // Your code here...

  let config = {
    replyMode: -1 //1 对应楼层；-1对应用户
  };
  // 获取数据
  let data = [];

  // 作者数据map
  let map = new Map();

  // 楼层数据map
  let floorMap = new Map();

  let boxName = "v2Box";
  let boxNameSelector = ".v2Box";
  let v2BtnName = "v2Btn";
  let v2BtnSelector = ".v2Btn";
  let v2Style = `<style>
    ${v2BtnSelector}{
        border: none; background-color: white; color: grey; margin: 0px 0 5px 0; padding-bottom: 5px; width: 100%; border-bottom: 1px solid #c5c5c5;
    }
    ${v2BtnSelector}:focus{
        outline: none;
    }
    ${v2BtnSelector}:hover{
        cursor: pointer;
    }

    ${boxNameSelector}{
       position: absolute;width: 270px; padding: 5px 8px;overflow-y:scroll; max-height: 80%;
    }

    </style>`;
  let msgBox = `<div class='box ${boxName}'></div>`;

  loadV2Style();
  fetchData();

  function loadV2Style() {
    $("head").append(v2Style);
  }

  function fetchData() {
    $(".cell strong a").each((idx, e) => {
      let _this = $(e);
      let _cell = _this.parents(".cell");

      let author = _this.html();
      let no = _cell.find(".no").html();

      // console.log(author);
      // console.log(no);

      if (!map.has(author)) {
        map.set(author, []);
      }

      floorMap.set(no, _cell.html());

      map.get(author).push(_cell.html());
    });

    // console.log(map);

    // console.log(floorMap);
  }

  function getSwitchTable() {
    return `<button class='${v2BtnName}'>${
      config.replyMode > 0 ? "本页对应楼层评论" : "本页所有评论"
    }</button>`;
  }

  // 绑定事件
  $(".reply_content a").hover(
    (e) => {
      let _this = $(e.currentTarget);
      let parent = _this.parents(".cell");
      let author = _this.html();

      if ($(boxNameSelector).length > 0) {
        $(boxNameSelector).remove();
      }

      // 包装一下 nodeType 为 Text 的文本，方便选择
      $(parent)
        .find(".reply_content")
        .contents()
        .filter(function () {
          return this.nodeType == 3;
        })
        .wrap("<span></span>");
      let next = $(_this).next().html();
      let floor = next?.match(/(#)(\d+)/)?.[2];
      // console.log(next);
      // console.log(floor);

      let _content =
        config.replyMode > 0 && floor ? floorMap.get(floor) : map.get(author);

      if (!_content) return;

      $(parent).before(msgBox);

      $(boxNameSelector).css("left", Rightbar.offsetLeft);
      $(boxNameSelector).html(_content);
      $(boxNameSelector).prepend(getSwitchTable());
      $(v2BtnSelector).data("floor", floor);
      $(v2BtnSelector).data("author", author);
    },
    () => {
      // console.log("2-1");
      // $(boxNameSelector).remove();
      // console.log("2-2");
    }
  );

  // 绑定切换事件
  $("#Main").on("click", ".v2Btn", function () {
    config.replyMode = -config.replyMode;
    let author = $(this).data("author");
    let floor = $(this).data("floor");
    let _content =
      config.replyMode > 0 && floor ? floorMap.get(floor) : map.get(author);

    if (!_content) return;
    $(boxNameSelector).html(_content);
    $(boxNameSelector).prepend(getSwitchTable());
    $(v2BtnSelector).data("floor", floor);
    $(v2BtnSelector).data("author", author);
  });
})();
