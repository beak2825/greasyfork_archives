// ==UserScript==
// @name         喵国建设者资源修改器
// @version      0.9
// @description  可以添加任意数量的资源，注意，这将极大地破坏您的游戏体验。在 选项—> mewScript处使用。You can add as many resources as you like in the game, and this will greatly ruin your gaming experience.
// @author       tampermonkey
// @match        https://kittensgame.com/web*
// @license      GNU General Public License v3.0 or later
// @namespace    http://tampermonkey.net/
// @require      https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js#sha384=vk5WoKIaW/vJyUAd9n/wmopsmNhiy+L2Z+SBxGYnUkunIxVxAv/UtMOhba/xskxh
// @run-at       document-end
// @grant        unsafeWindow
// @grant        GM_addStyle

// @downloadURL https://update.greasyfork.org/scripts/530274/%E5%96%B5%E5%9B%BD%E5%BB%BA%E8%AE%BE%E8%80%85%E8%B5%84%E6%BA%90%E4%BF%AE%E6%94%B9%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/530274/%E5%96%B5%E5%9B%BD%E5%BB%BA%E8%AE%BE%E8%80%85%E8%B5%84%E6%BA%90%E4%BF%AE%E6%94%B9%E5%99%A8.meta.js
// ==/UserScript==
(function () {
  "use strict";
  var game = unsafeWindow.game;
  var $ = unsafeWindow.jQuery || window.jQuery;

  function InsertInputElement(inputArea, res) {
    var $row = $("<div class='resCheat'>").css("padding", "0px 10px");
    var $span = $("<span>").text(res.title);
    var $Buttons = $("<div class='cheatbuttons'>").html(`
      <button data-resname="${res.name}" data-bf="+10">+10</button>
      <button data-resname="${res.name}" data-bf="+1k">+1k</button>
      <button data-resname="${res.name}" data-bf="+10k">+10k</button>
      <button data-resname="${res.name}" data-bf="MAX">MAX</button>
      <button data-resname="${res.name}" data-bf="X10">X10</button>
      <button data-resname="${res.name}" data-bf="X1000">X1000</button>
    `);
    $row.append($span).append($Buttons);
    inputArea.append($row);
  }

  function ElementCheat(resName, value) {
    switch (value) {
      case "+10":
        game.resPool.get(resName).value += 10;
        break;
      case "+1k":
        game.resPool.get(resName).value += 1000;
        break;
      case "+10k":
        game.resPool.get(resName).value += 10000;
        break;
      case "MAX":
        var mv = game.resPool.get(resName).maxValue;
        game.resPool.get(resName).value = mv > 0 ? mv : 1e6;
        break;
      case "X10":
        game.resPool.get(resName).value *= 10;
        break;
      case "X1000":
        game.resPool.get(resName).value *= 1000;
        break;
      default:
        break;
    }
  }

  function CheatEvent() {
    game = unsafeWindow.game;
    //console.log("------------InitCheatEventUI");
    if (!game || !game.resPool || $("#optionsDiv").length === 0) {
      setTimeout(CheatEvent, 1777);
      return;
    }
    InitCheatEventUI();
    if ($("#CheatEventUI").length === 0) {
      setTimeout(CheatEvent, 1777);
      return;
    }
    if ($(".resCheat").length > 0) {
      return;
    }
    var $inputArea = $("#CheatEventUI");
    $.each(game.resPool.resources, function (_, res) {
      InsertInputElement($inputArea, res);
    });
    $(".cheatbuttons").delegate("button", "click", (e) => {
      e.preventDefault();
      const resName = $(e.target).data("resname");
      const bf = $(e.target).data("bf");
      ElementCheat(resName, bf);
    });
    //setInterval(`document.querySelector("#fastHuntContainer a").click()`, 1666);
    setInterval(`$("#observeBtn").click()`, 3666);
  }

  //初始化作弊界面
  function InitCheatEventUI() {
    const optionHtml = `<div id="CheatEventUI"></div>`;
    const optionsDiv = $("#optionsDiv");
    if (optionsDiv.length === 0 || $("#CheatEventUI").length > 0) return;
    const originalContent = optionsDiv.html();
    const tabsHtml = `
        <a id="optionsDialogClose" href="#" class="close" onclick="game.closeOptions()" style="position: absolute; top: 10px; right: 15px;">关闭</a>
        <div class="mew-tabs-header" style="margin: 10px 0;">
            <a href="#" class="mew-tab mew-active" data-tab="mew-game">游戏选项</a>
            <a href="#" class="mew-tab" data-tab="mew-mew">mewScript</a>
        </div>
        <div class="mew-tab-content" id="mew-gameTab" style="display: block;">
            ${originalContent}
        </div>
        <div class="mew-tab-content" id="mew-mewTab" style="display: none;">
            <!-- 添加更多mewScript选项 -->
            ${optionHtml}
        </div>`;
    $("#optionsDiv").html(tabsHtml);
    $(".mew-tab").on("click", function (e) {
      e.preventDefault();
      const targetTab = $(this).data("tab");
      $(".mew-tab").removeClass("mew-active");
      $(this).addClass("mew-active");
      $(".mew-tab-content").hide();
      $(`#${targetTab}Tab`).show();
    });
    const OPTION_STYLES = `
    .mew-tabs-header {
      border-bottom: 1px solid #999;
      margin-bottom: 15px;
    }
    .mew-tab {
      display: inline-block;
      padding: 5px 15px;
      margin-right: 5px;
      text-decoration: none;
      color: inherit;
    }
    .mew-tab.mew-active {
      border: 1px solid #999;
      border-bottom: none;
      background: #fff;
    }
    .resCheat span{
      width: 90px;
      display: inline-block;
      text-align : center;
    }
    .resCheat div{
      display: inline-block;
    }
    `;
    GM_addStyle(OPTION_STYLES);
  }
  $(window).on("load", CheatEvent);
})();
