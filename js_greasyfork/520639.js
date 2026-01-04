// ==UserScript==
// @name         WoD 获取话题参与者用户及角色
// @icon         http://info.world-of-dungeons.org/wod/css/WOD.gif
// @namespace    http://tampermonkey.net/
// @description  获取话题参与者用户及角色
// @author       Christophero
// @version      2023.03.24.1
// @match        http*://*.world-of-dungeons.org/*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      https://code.jquery.com/ui/1.13.2/jquery-ui.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520639/WoD%20%E8%8E%B7%E5%8F%96%E8%AF%9D%E9%A2%98%E5%8F%82%E4%B8%8E%E8%80%85%E7%94%A8%E6%88%B7%E5%8F%8A%E8%A7%92%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/520639/WoD%20%E8%8E%B7%E5%8F%96%E8%AF%9D%E9%A2%98%E5%8F%82%E4%B8%8E%E8%80%85%E7%94%A8%E6%88%B7%E5%8F%8A%E8%A7%92%E8%89%B2.meta.js
// ==/UserScript==

(function () {
  ("use strict");

  main();

  /**
   * 插件主入口
   */
  function main() {
    initBtn();
  }

  function initBtn() {
    const $btn = $('<button type="button" class="button">参与者统计</button>');
    const $per = $('<span id="calcPer"></span>');
    $(".boardspacer:first tr:first td:eq(2)").prepend($btn).prepend($per);
    $btn.click(fetchTopicParticipant);
  }

  async function fetchTopicParticipant() {
    // 查看有多少页
    const $lastPageAnchor = $(
      'tr.boardhead a[href^="/wod/spiel/forum/viewtopic.php?"]:last'
    );
    const total = parseInt($lastPageAnchor.text()) || 1;
    // 获得话题ID
    const searchParams = new URLSearchParams(
      (total == 1 ? location.search : $lastPageAnchor.attr("href")).split(
        "?"
      )[1]
    );
    const topicId = searchParams.get("id");
    const board = searchParams.get("board");
    // 遍历页面获得用户及英雄
    let finishCnt = 0;
    const partMap = new Map();
    const $per = $("#calcPer");
    $per.text(`0/${total}`);
    for (let i = 0; i < total; i++) {
      await fetch(
        `${location.protocol}//delta.world-of-dungeons.org/wod/spiel/forum/viewtopic.php?id=${topicId}&board=${board}&p=${i}&IS_POPUP=1`
      )
        .then((response) => {
          return response.text();
        })
        .then((html) => {
          finishCnt += 1;
          $per.text(`${finishCnt}/${total}`);
          const $doc = $(html);
          const $heros = $doc.find(".boardheadline");
          $heros.each(async (i, e) => {
            let heroName = $(e).text().trim();
            let player = $(e)
              .parents("td:first")
              .find('a[href^="/wod/spiel/profiles/player.php?"]')
              .text()
              .trim();
            if (player == "") {
              player = await fetchPlayerByHero(heroName);
              heroName = heroName + "【可能转职】";
            }
            if (player == "") {
              player = heroName + "【异常】";
            }
            if (!partMap.has(player)) {
              partMap.set(player, new Set());
            }
            partMap.get(player).add(heroName);
          });
          return new Promise((resolve, reject) => {
            resolve(true);
          });
        });
    }
    $per.text("统计完成");
    outputResult(partMap);
  }

  /**
   * 根据英雄名称获得用户名
   * @param {*} heroName
   * @returns
   */
  async function fetchPlayerByHero(heroName) {
    const response = await fetch(
      `${
        location.protocol
      }//delta.world-of-dungeons.org/wod/spiel/hero/profile.php?name=${encodeURIComponent(
        heroName
      )}&IS_POPUP=1&is_popup=1`
    );
    const text = await response.text();
    const jq = $(text);
    $("#heroCurrent").text(parseInt($("#heroCurrent").text()) + 1);
    if (jq.find('h1:contains("没有找到")').length) {
      // 没有找到英雄
      return "";
    }
    const player = jq
      .find('a[href^="/wod/spiel/profiles/player.php?"]')
      .text()
      .trim();
    return player;
  }

  function outputResult(partMap) {
    let result = "用户,英雄\n";
    partMap.forEach((heroes, player) => {
      result += `${player},${[...heroes].join("|")}\n`;
    });
    console.log(result);
    exportFile(result, "分析内容.csv");
  }

  /**
   * 导出文件的方法，导出并直接进行下载
   *
   * @param {String} 传入导出文件的数据, 格式为字符串
   * @param {String}  导出文件的文件名称
   */
  const exportFile = (text = "", filename = "分析内容.txt") => {
    // 导出数据
    const blob = new Blob([text]);
    const e = new MouseEvent("click");
    const a = document.createElement("a");

    a.download = filename;
    a.href = window.URL.createObjectURL(blob);
    a.dispatchEvent(e);
  };
})();
