// ==UserScript==
// @name         WoD 左下角跳转框增强
// @icon         http://info.world-of-dungeons.org/wod/css/WOD.gif
// @namespace    github.com/DotIN13
// @description  Easier jumpbox search
// @author       DotIN13
// @match        http*://*.world-of-dungeons.org/*
// @grant        none
// @modifier     Christophero
// @version      2022.08.21.2
// @downloadURL https://update.greasyfork.org/scripts/520625/WoD%20%E5%B7%A6%E4%B8%8B%E8%A7%92%E8%B7%B3%E8%BD%AC%E6%A1%86%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/520625/WoD%20%E5%B7%A6%E4%B8%8B%E8%A7%92%E8%B7%B3%E8%BD%AC%E6%A1%86%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
  "use strict";

  //get jumpboxSpan
  var jumpboxSpan = document.getElementById("jumpbox_center");

  if (jumpboxSpan) {
    var addItemList = function () {
      var itemList = [
          "item",
          "set",
          "hero",
          "player",
          "skill",
          "npc",
          "post",
          "group",
          "clan",
          "auction",
          "class",
        ],
        itemChn = [
          "物品",
          "套装",
          "角色",
          "玩家",
          "技能",
          "NPC",
          "帖子",
          "团队",
          "联盟",
          "拍卖",
          "职业",
        ];
      for (var i = 0; i < itemList.length; i++) {
        var option = document.createElement("option");
        option.value = itemList[i];
        option.text = itemChn[i];
        jumpboxSelObj.add(option);
      }
    };

    window.jumper = function () {
      var jumpbox = document.querySelector(
        '#jumpbox_center>form>input[name="link"]'
      );
      var jumpboxValue = jumpbox.value;
      var regtest = /^\s*\[\s*([^:]+?)\s*:\s*(.+?)\s*\]\s*$/;
      var indicator = regtest.test(jumpboxValue);
      if (indicator) {
        wodlink(jumpboxValue);
      } else {
        var jumplink = "[" + jumpboxSelObj.value + ":" + jumpboxValue + "]";
        wodlink(jumplink);
      }
      jumpbox.value = "";
    };

    //edit tooltip
    document
      .querySelector("#jumpbox_center>form>span")
      .setAttribute(
        "onmouseover",
        "return wodToolTip(this,'输入代码或名称，选择相应类型<br>然后点按搜索，查询详情<br>输入[*:*]时，自动无视类型选择<br><br>Jumpbox Enhanced By DotIN13');"
      );

    //create jumpboxSelect
    var jumpboxSelect = document.createElement("select");
    jumpboxSelect.id = "jumpboxSelect";
    jumpboxSelect.style =
      "width: 62px;margin-left: 25px;padding: 1px;margin-top: 1px;";
    jumpboxSpan.parentElement.appendChild(jumpboxSelect);

    //add select options
    var jumpboxSelObj = document.getElementById("jumpboxSelect");

    addItemList();

    //reroute jumpbox Button
    var jumpboxBtn = document.querySelectorAll(
      "#jumpbox_center>form>span>input"
    );
    var jumpbox = document.querySelector(
      '#jumpbox_center>form>input[name="link"]'
    );
    jumpboxBtn[0].setAttribute("onclick", "window.jumper();return false;");
  }
})();
