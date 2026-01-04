// ==UserScript==
// @name         WoD 竞技场增强
// @icon         http://info.world-of-dungeons.org/wod/css/WOD.gif
// @namespace    http://tampermonkey.net/
// @description  竞技场管理员辅助工具合集
// @author       Christophero
// @version      2023.06.04.3
// @match        http*://*.world-of-dungeons.org/*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      https://code.jquery.com/ui/1.13.2/jquery-ui.min.js
// @require      https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520635/WoD%20%E7%AB%9E%E6%8A%80%E5%9C%BA%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/520635/WoD%20%E7%AB%9E%E6%8A%80%E5%9C%BA%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
  ("use strict");

  main();

  /**
   * 插件主入口
   */
  function main() {
    initStyle();
    initJQUIStyle();
    addOptBtn();
    addExportLeagueBtn();
    addBatchInvite();
    addBatchAccept();
    addBatchLeague();
    addBatchChangeLeagueCat();
  }

  /**
   * 插入Css样式
   * @param {*} select
   * @param {*} styles
   */
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

  /**
   * 初始化样式表
   */
  function initStyle() {
    insertCss(".bp-wrapper", {
      display: "flex",
    });
    insertCss(".bp-container", {
      margin: "5px",
    });
    insertCss(".bp-container input", {
      width: "100%",
      paddingRight: "0",
    });
  }

  /**
   * 初始化JqueryUI的样式表
   */
  function initJQUIStyle() {
    let $toolbarCss = $("<link>");
    $("head").prepend($toolbarCss);
    $toolbarCss.attr({
      rel: "stylesheet",
      type: "text/css",
      href: "https://code.jquery.com/ui/1.13.2/themes/humanity/jquery-ui.css",
    });
    document.querySelector("style").textContent +=
      ".ui-dialog { height: 600px !important; } " +
      ".ui-dialog .ui-dialog-content { height: 90% !important; } " +
      "@media (min-width:1px) { .ui-dialog { width: 95% !important; } } " +
      "@media (min-width: 768px) { .ui-dialog { max-width:900px !important; width:95% !important; } }";
  }

  const getHeroInfo = async (heroName) => {
    const response = await fetch(
      `${location.origin}/wod/spiel/hero/profile.php?name=${encodeURIComponent(
        heroName
      )}&IS_POPUP=1&is_popup=1`
    );
    const text = await response.text();
    const jq = $(text);
    $("#heroCurrent").text(parseInt($("#heroCurrent").text()) + 1);
    if (jq.find('h1:contains("没有找到")').length) {
      // 没有找到英雄
      return { hero: heroName, exist: false };
    }
    const $groupTd = jq.find("td:contains('团队:')");
    const $clanTd = jq.find("td:contains('联盟:')");
    const group = $groupTd.next().text().trim();
    const clan = $clanTd.next().text().trim();
    // console.log(group);
    // console.log(clan);
    return { hero: heroName, group, clan, exist: true };
  };

  /**
   * 添加操作按钮
   */
  function addOptBtn() {
    const $analysisBtn = $(
      '<input type="button" name="analysisBtn" value="进行英雄团队分析" class="button clickable">'
    );

    const $baseInput = $(".gadget.hero.lang-cn");
    $baseInput.after($analysisBtn);
    $analysisBtn.click(showAnalysisDialog);
  }

  function length(str) {
    return str.replace(/[^\x00-\xff]/g, "aa").length;
  }

  function getHeroList(str) {
    return str
      .split("\n")
      .map((name) => name.trim())
      .filter((name) => name);
  }

  function addPointMap(pointMap, index) {
    const p = $("#bonusPoints" + index).val();
    const t = $("#bpTextarea" + index).val();
    for (let s of getHeroList(t)) {
      pointMap[s] = p;
    }
  }

  function showAnalysisDialog() {
    let $analysisForm = $("div#analysisForm");
    if (!$analysisForm.length) {
      let $container = $(
        `<div style="visibility: hidden;">
            <div id="analysisForm">
              <div>
                <label for="heroTextarea">输入要分析的英雄列表，每行一个英雄名称</label>
                <textarea id="heroTextarea" name="heroTextarea" style="width: 100%;" rows="10" />
              </div>
              <div><span id="heroTotal">0</span>/<span id="heroCurrent">0</span></div>
              <div class="bp-wrapper">
              </div>
            </div>
          </div>`
      );
      const $bpWrapper = $container.find(".bp-wrapper");
      for (let i = 1; i <= 7; i++) {
        $bpWrapper.append(
          $(`<div class="bp-container">
                  <div>
                    <label for="bonusPoints${i}">分组${i}</label>
                    <input type="number" name="bonusPoints${i}" id="bonusPoints${i}" value="100" placeholder="number" />
                  </div>
                  <div>
                    <textarea id="bpTextarea${i}" name="bpTextarea${i}" style="width: 100%;" rows="10" />
                  </div>
                </div>`)
        );
      }
      $("body:first").append($container);
      $analysisForm = $("div#analysisForm");
    }
    $analysisForm.dialog({
      autoOpen: true, // 是否自动弹出窗口
      modal: true, // 设置为模态对话框
      resizable: true,
      width: 540, //弹出框宽度
      height: 620, //弹出框高度
      title: "输入", //弹出框标题
      position: { my: "center", at: "center", of: window }, //窗口显示的位置
      buttons: {
        关闭: function () {
          $(this).dialog("close");
        },
        分析: function () {
          const text = $("#heroTextarea").val();
          let arr = text.split("\n").filter((name) => name.trim());
          $("#heroTotal").text(arr.length);
          $("#heroCurrent").text(0);
          let list = [];
          for (let name of arr) {
            if (!name) continue;
            list.push(getHeroInfo(name.trim()));
          }
          const pointMap = {};
          for (let i = 1; i <= 7; i++) {
            addPointMap(pointMap, i);
          }

          Promise.all(list)
            .then((result) => {
              console.log(result); //['成功了', 'success']
              let notExistArr = result.filter((obj) => !obj.exist);
              let aloneArr = result.filter(
                (obj) => obj.exist && !obj.clan && !obj.group
              );
              let groupArr = result.filter(
                (obj) => obj.exist && !obj.clan && obj.group
              );
              let clanArr = result.filter(
                (obj) => obj.exist && obj.clan && obj.group
              );
              console.log("不存在的角色");
              console.log(notExistArr);
              console.log("独行的角色");
              console.log(aloneArr);
              console.log("仅有团队的角色");
              console.log(groupArr);
              console.log("存在联盟的角色");
              console.log(clanArr);

              let data = "";

              let clanMap = {};
              for (let obj of clanArr) {
                clanMap[obj.clan] = clanMap[obj.clan] || [];
                clanMap[obj.clan].push(obj.hero);
              }
              data += "=====================================================\n";
              data += `按联盟分角色(${Object.keys(clanMap).length})\n`;
              for (let clanName of Object.keys(clanMap)) {
                data +=
                  clanName.padEnd(20) +
                  `(${clanMap[clanName].length})` +
                  ":" +
                  clanMap[clanName].join(",") +
                  "\n";
              }
              data += "\n\n";

              let groupMap = {};
              for (let obj of groupArr) {
                groupMap[obj.group] = groupMap[obj.group] || [];
                groupMap[obj.group].push(obj.hero);
              }
              for (let obj of clanArr) {
                groupMap[obj.group] = groupMap[obj.group] || [];
                groupMap[obj.group].push(obj.hero);
              }

              data += "=====================================================\n";
              data += `按团队分角色(${Object.keys(groupMap).length})\n`;
              for (let groupName of Object.keys(groupMap)) {
                const heroArr = groupMap[groupName];
                const len = length(groupName);
                const padSpace = len ? " ".repeat(50 - len) : "";
                const numStr = "人数：" + heroArr.length;
                const pointArr = heroArr.map((hero) => pointMap[hero]);
                const totalPoint = pointArr.reduce(
                  (prev, cur) => prev + parseInt(cur) || 0
                );
                const pointStr =
                  "积分：" +
                  heroArr.map((hero) => pointMap[hero]).join("+") +
                  "=" +
                  totalPoint;
                const gname = groupName.padEnd(20);
                const heroes = heroArr.join(",");
                data += `${gname}(${numStr})「${pointStr}」:${heroes}\n`;
              }
              data += "\n\n";

              data += "=====================================================\n";
              data += "以下角色不存在\n";
              data += notExistArr.map((obj) => obj.hero).join("\n");
              data += "\n\n";
              // data += "以下角色是独行角色(没有团队)\n";
              // data += aloneArr.map((obj) => obj.hero).join("\n");
              // data += "\n\n";
              data += "=====================================================\n";
              data += "以下角色仅有团队，没有联盟\n";
              data += groupArr.map((obj) => obj.hero).join("\n");
              data += "\n\n";
              data += "=====================================================\n";
              data += "以下角色存在联盟\n";
              data += clanArr.map((obj) => obj.hero).join("\n");
              data += "\n\n";
              exportFile(data);
            })
            .catch((error) => {
              console.log(error);
            });
        },
      },
    });
  }

  /**
   * 导出文件的方法，导出并直接进行下载
   *
   * @param {String} 传入导出文件的数据, 格式为字符串
   * @param {String}  导出文件的文件名称
   */
  const exportFile = (
    text = "",
    filename = "分析内容.txt",
    exportCsv = false
  ) => {
    let blob;
    // 导出数据
    if (exportCsv) {
      blob = new Blob(["\ufeff" + text], {
        type: "text/csv;charset=utf-8;",
      });
    } else {
      blob = new Blob([text]);
    }
    const e = new MouseEvent("click");
    const a = document.createElement("a");

    a.download = filename;
    a.href = window.URL.createObjectURL(blob);
    a.dispatchEvent(e);
  };

  function addExportLeagueBtn() {
    if (!["/wod/spiel/arena/index.php"].includes(location.pathname)) return;
    const $btn = $(
      '<button type="button" class="button clickable">导出参与者</button>'
    ).click(function () {
      const $activeSubTab = $(
        '.label.selected:visible:contains("联赛排行榜"), .label.selected:visible:contains("参加者")'
      );
      if (!$activeSubTab.length) {
        alert("请先切换到联赛排行榜或参加者分页再执行导出操作");
        return;
      }
      const subTabTitle = $activeSubTab.text().trim();
      let reservedCnt = parseInt(prompt("请输出每组提取前多少(默认全部)", "0"));
      if (isNaN(reservedCnt)) {
        return;
      }

      const leagueName = $(
        '[id^="smarttabs__league_"]:not([id$="inner"]):visible ul li.selected'
      )
        .text()
        .trim();

      // 追加子联赛逻辑
      const $matchTables = $(
        '[id^="arena_league_details"][id$="_inner"]:visible .content_table'
      );
      let result = [];
      $matchTables.each((i, e) => {
        const $table = $(e);
        let subMatchName = $table.prevAll("h3:first").text();
        if (!subMatchName) {
          subMatchName = $table.prevAll("h2:first")[0].firstChild.textContent;
        }
        const $heroes = $table.find(
          'a[href^="/wod/spiel/hero/profile.php?"],a[href^="/wod/spiel/dungeon/group.php?"]'
        );
        const lines = [];
        $heroes.each((i, e) => {
          if (reservedCnt != 0 && i >= reservedCnt) return;
          const points = $(e).parents("td:first").next("td").text().trim();
          const line = `${subMatchName ? subMatchName + "," : ""}${
            i + 1
          },${e.textContent.trim()},${'"' + points + '"'}`;
          lines.push(line + "\n");
        });
        result.push(lines.join(""));
      });
      exportFile(result.join(",,\n"), leagueName + ".csv", true);
    });
    const $tabs = $('[id^="smarttabs__league_"]:not([id$="inner"]) ul');
    $tabs.append($btn);
  }

  /**
   * 批量邀请
   */
  function addBatchInvite() {
    if (!["/wod/spiel/tournament/duell.php"].includes(location.pathname))
      return;
    // 1. 添加批量邀请防御方和批量邀请挑战方
    const $batchAddChallenger = $(
      '<button id="inviteChallenger" type="button" class="button">批量挑战方</button>'
    );
    const $batchAddDefender = $(
      '<button id="inviteDefender" type="button" class="button">批量防御方</button>'
    );
    $batchAddChallenger.click(function () {
      createInviteHeroesDialog(false);
    });
    $batchAddDefender.click(function () {
      createInviteHeroesDialog(true);
    });
    $('input[value="发出邀请"]').after($batchAddChallenger, $batchAddDefender);
  }

  function getTargetsDialog() {
    return $(
      `<div>
          <div id="inviteForm">
            <div>
              <label for="targetTextarea">输入要邀请的目标列表，每行一个名称</label>
              <textarea id="targetTextarea" name="targetTextarea" style="width: 100%;" rows="20" />
            </div>
            <div style="font-size: 20px; margin-top: 5px;">
              <span>当前进度：</span><span id="targetTotal">0</span>/<span id="targetCurrent">0</span>
            </div>
          </div>
        </div>`
    );
  }

  function createInviteHeroesDialog(isInviteDefender) {
    getTargetsDialog().dialog({
      autoOpen: true, // 是否自动弹出窗口
      modal: true, // 设置为模态对话框
      resizable: true,
      closeOnEscape: true,
      width: 540, //弹出框宽度
      height: 540, //弹出框高度
      title: `批量邀请${isInviteDefender ? "防御方" : "进攻方"}`, //弹出框标题
      position: { my: "center", at: "center", of: window }, //窗口显示的位置
      close: function (event, ui) {
        $(this).dialog("destroy");
      },
      buttons: {
        关闭: function () {
          $(this).dialog("close");
        },
        邀请: function () {
          //扩展jquery的格式化方法
          $.fn.parseForm = function () {
            const serializeObj = {};
            const array = this.serializeArray();
            let str = this.serialize();
            $(array).each(function () {
              if (serializeObj[this.name]) {
                if ($.isArray(serializeObj[this.name])) {
                  serializeObj[this.name].push(this.value);
                } else {
                  serializeObj[this.name] = [
                    serializeObj[this.name],
                    this.value,
                  ];
                }
              } else {
                serializeObj[this.name] = this.value;
              }
            });
            return serializeObj;
          };
          const targetsText = $("#targetTextarea").val();
          const targets = targetsText.split("\n").filter((name) => name.trim());
          const $inviteForm = $(
            'form[action^="/wod/spiel/tournament/duell.php"]'
          );
          const duellUrl = $inviteForm.attr("action");
          const params = $inviteForm.parseForm();

          const inviteFetchList = [];
          let completeFetch = 0;
          for (const hero of targets) {
            const inviteParam = Object.assign({}, params);
            if (isInviteDefender) {
              inviteParam["search[rk_verteidiger]"] = hero;
              inviteParam["invite[rk_verteidiger]"] = "选择";
            } else {
              inviteParam["search[rk_angreifer]"] = hero;
              inviteParam["invite[rk_angreifer]"] = "选择";
            }
            inviteFetchList.push(
              fetch(
                `${location.origin}/wod/spiel/tournament/duell.php?DuellId=${inviteParam["DuellId"]}&is_popup=1`,
                {
                  headers: {
                    accept:
                      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                    "content-type": "application/x-www-form-urlencoded",
                  },
                  method: "POST",
                  body: new URLSearchParams(
                    Object.entries(inviteParam)
                  ).toString(),
                }
              ).then((response) => {
                completeFetch++;
                $("#targetCurrent").text(completeFetch);
                return new Promise((resolve, reject) => {
                  resolve(response);
                });
              })
            );
          }
          $("#targetTotal").text(targets.length);
          Promise.all(inviteFetchList).then((responseArr) => {
            fetch(
              `${location.origin}/wod/spiel/tournament/duell.php?DuellId=${params["DuellId"]}&is_popup=1`,
              {
                headers: {
                  accept:
                    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                  "content-type": "application/x-www-form-urlencoded",
                },
                method: "POST",
                body: new URLSearchParams(Object.entries(params)).toString(),
              }
            )
              .then((response) => {
                return response.text();
              })
              .then((text) => {
                // 统计哪些目标未能成功添加进挑战列表
                const jq = $(text);
                const $currentTargets = jq
                  .find(`.content_table:eq(${isInviteDefender ? 1 : 0})`)
                  .find(
                    'a[href^="/wod/spiel/hero/profile.php?"], a[href^="/wod/spiel/dungeon/group.php?"]'
                  );
                const currentTargets = $currentTargets
                  .map((i, e) => e.textContent)
                  .get();
                const unprocessedHeroes = targets.filter(
                  (h) => !currentTargets.includes(h)
                );
                if (unprocessedHeroes.length) {
                  exportFile(
                    unprocessedHeroes.join("\n"),
                    "未能成功操作的目标请手工确认.txt"
                  );
                }
              })
              .finally(() => {
                $inviteForm.submit();
              });
          });
        },
      },
    });
  }

  function batchAcceptOrReject(isAccept) {
    let $btns;
    if (isAccept) {
      $btns = $('input[name^="accept["]');
      if (!$btns.length) {
        alert("没有可以接受的决斗！");
        return;
      }
    } else {
      $btns = $('input[name^="reject["]');
      if (!$btns.length) {
        alert("没有可以拒绝的决斗！");
        return;
      }
    }

    const opts = $btns.map((i, e) => e.name).get();
    const $duellForm = $('form[action^="/wod/spiel/tournament/duell.php"]');
    const actionUrl = $duellForm.attr("action");
    const duellParams = new URLSearchParams("?" + $duellForm.serialize());
    for (let opt of opts) {
      duellParams.set(opt, isAccept ? "开始" : "拒绝");
    }
    console.log(duellParams.toString());
    fetch(actionUrl, {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "content-type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      body: duellParams.toString(),
    }).then((resp) => {
      alert("已处理，刷新页面");
      location.reload();
    });
  }

  function addBatchAccept() {
    if (!["/wod/spiel/tournament/duell.php"].includes(location.pathname))
      return;
    // 1. 添加批量接受和批量拒绝
    const $batchAccept = $(
      '<button id="batchAccept" type="button" class="button">全部接受</button>'
    );
    const $batchReject = $(
      '<button id="batchReject" type="button" class="button">全部拒绝</button>'
    );
    $batchAccept.click(function () {
      batchAcceptOrReject(true);
    });
    $batchReject.click(function () {
      batchAcceptOrReject(false);
    });

    $('a.button:contains("配置决斗选项")').after($batchAccept, $batchReject);
  }

  /**
   * 批量添加比赛(Bo3/Bo5)
   */
  function addBatchLeague() {
    if (!["/wod/spiel/arena/index.php"].includes(location.pathname)) return;
    const $createLeagueBtn = $('a:contains("创建联赛/比赛")');
    let $batchLeagueBtn = $(
      '<a href="#" class="clickanchor">批量联赛/比赛</a>'
    );
    $batchLeagueBtn.insertAfter($createLeagueBtn).click(function () {
      fetchLeagueBaseInfo();
    });
  }

  function getAllHiddenParams() {
    const searchParams = new URLSearchParams();
    $("input:hidden").each(function () {
      const $this = $(this);
      searchParams.set($this.attr("name"), $this.val());
    });
    return searchParams;
  }

  function getBaseLeagueParams() {
    const allParams = getAllHiddenParams().toString();
    const searchParams = new URLSearchParams();
    searchParams.set("wod_post_id", params.get("wod_post_id"));
    searchParams.set("session_hero_id", params.get("session_hero_id"));
    searchParams.set("session_player_id", params.get("session_player_id"));
    return searchParams;
  }

  async function getNameCheckPromise(params, name) {
    const nameCheckParam = new URLSearchParams();
    nameCheckParam.set("wod_post_id", params.get("wod_post_id"));
    nameCheckParam.set("session_hero_id", params.get("session_hero_id"));
    nameCheckParam.set("session_player_id", params.get("session_player_id"));
    nameCheckParam.set("spieler_id", params.get("spieler_id"));
    nameCheckParam.set("table", "arena_league");
    nameCheckParam.set("postname", "league_name");
    nameCheckParam.set("league_name", name);
    nameCheckParam.set("ajax", "1");
    return await fetch(`${location.origin}/wod/ajax/validateName.php`, {
      headers: {
        accept: "*/*",
        "accept-language": "zh-CN,zh;q=0.9",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "x-requested-with": "XMLHttpRequest",
      },
      body: nameCheckParam.toString(),
      method: "POST",
      mode: "cors",
      credentials: "include",
    });
  }

  async function batchCheckLeagueName(params, namePrev, cnt) {
    const $nameErrSpan = $('input[name="league_name"]~#NameInputDiv');
    $nameErrSpan.html('<img src="wod/css/img/ajax-loader.gif"');
    let nameCheckPromiseArr = [];
    let nameArr = [];
    if (cnt == 1) {
      nameCheckPromiseArr.push(getNameCheckPromise(params, namePrev));
      nameArr.push(namePrev);
    } else {
      for (let i = 1; i <= cnt; i++) {
        const leagueName = namePrev + "bo" + i;
        nameCheckPromiseArr.push(
          getNameCheckPromise(params, namePrev + "bo" + i)
        );
        nameArr.push(leagueName);
      }
    }
    let responseArr = await Promise.all(nameCheckPromiseArr);
    for (let response of responseArr) {
      const ret = await response.text();
      if (ret.includes("名称不可用或已被使用，请重新输入")) {
        $nameErrSpan.html(
          '<span class="message_error">名称不可用或已被使用，请重新输入！</span>'
        );
        _ajaxStopWaiting("ajax_editor");
        return;
      }
    }
    $nameErrSpan.html("正在创建联赛，请稍候...");
    return nameArr;
  }

  async function createLeague(params, name) {
    let createLeagueParam = new URLSearchParams(params.toString());
    createLeagueParam.set("league_name", name);
    return await fetch(
      `${location.origin}/wod/spiel/arena/league_edit_ajax.php`,
      {
        headers: {
          accept: "*/*",
          "accept-language": "zh-CN,zh;q=0.9",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "x-requested-with": "XMLHttpRequest",
        },
        body: createLeagueParam.toString(),
        method: "POST",
        mode: "cors",
        credentials: "include",
      }
    );
  }

  async function fetchLeagueId(leagueNameArr, leagueCatId, sessionHeroId) {
    const response = await fetch(
      `${location.origin}/wod/spiel/arena/index.php?menukey=arena&is_popup=1&session_hero_id=${sessionHeroId}`,
      { method: "GET" }
    );
    const html = await response.text();
    const $leagueDoc = $(html);

    const $leagueList = $leagueDoc.find(
      `#div_league_list_${leagueCatId} a[href^="/wod/spiel/arena/index.php?"]`
    );
    return $leagueList
      .filter((i, e) => leagueNameArr.includes($(e).text()))
      .map((i, e) =>
        new URLSearchParams(e.href.split("?")[1]).get("show_league_id")
      )
      .get();
  }

  async function addHeroes(params) {
    const addHeroParams = new URLSearchParams();
    addHeroParams.set("wod_post_id", params.get("wod_post_id"));
    addHeroParams.set("session_hero_id", params.get("session_hero_id"));
    addHeroParams.set("session_player_id", params.get("session_player_id"));
    addHeroParams.set("ajax_class_name", "ArenaLeagueMembers");
    addHeroParams.set("ajax_object_id", params.get("ajax_object_id"));
    addHeroParams.set("add_members", params.get("add_members"));
    addHeroParams.set("ajax", 1);

    const response = await fetch(`${location.origin}/wod/ajax/render.php`, {
      headers: {
        accept: "*/*",
        "accept-language": "zh-CN,zh;q=0.9",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "x-requested-with": "XMLHttpRequest",
      },
      body: addHeroParams.toString(),
      method: "POST",
      mode: "cors",
      credentials: "include",
    });
    return response.text();
  }

  async function autoLeagueGroup(params) {
    const response = await fetch(`${location.origin}/wod/ajax/render.php`, {
      headers: {
        accept: "*/*",
        "accept-language": "zh-CN,zh;q=0.9",
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "x-requested-with": "XMLHttpRequest",
      },
      body: params.toString(),
      method: "POST",
      mode: "cors",
      credentials: "include",
    });
    return response.text();
  }

  async function fetchLeagueBaseInfo() {
    const targetId = "ajax_editor";
    _ajaxCreateDialogDirect(
      targetId,
      null,
      "批量联赛/比赛",
      true,
      async function (event) {
        if (event == "ok") {
          console.log("提交");
          ajaxAlert("开始批处理...");
          const params = getAllHiddenParams();
          const league_name = $('input[name="league_name"]').val();
          const league_owner_id = $('input[name="league_owner_id"]').val();
          const league_cat_id = $('select[name="league_cat_id"]').val();
          const league_engine = $('select[name="league_engine"]').val();
          const league_start_season = $(
            'input[name="league_start_season"]'
          ).val();
          const league_round_length_seconds = $(
            'select[name="league_round_length_seconds"]'
          ).val();
          const league_start_hour = $('select[name="league_start_hour"]').val();
          const league_reward_type = $(
            'select[name="league_reward_type"]'
          ).val();
          const league_ref_type = $('select[name="league_ref_type"]').val();
          const league_is_only_one_member_per_player =
            $('input[name="league_is_only_one_member_per_player"]').prop(
              "checked"
            ) + 0;
          const league_hero_class_id = $(
            'input[name="league_hero_class_id"]'
          ).val();
          const league_duels_for_ranking = $(
            'input[name="league_duels_for_ranking"]:checked'
          ).val();
          const league_closed = $('input[name="league_closed"]:checked').val();
          const league_list_position = $(
            'input[name="league_list_position"]'
          ).val();
          const league_description = $(
            'textarea[name="league_description"]'
          ).val();
          const league_comment = $('textarea[name="league_comment"]').val();
          const bo_count = $('input[name="bo_count"]').val();
          const attack_group = $('textarea[name="attack_group"]').val();
          const defense_group = $('textarea[name="defense_group"]').val();
          const wod_post_id = params.get("wod_post_id");
          const session_hero_id = params.get("session_hero_id");
          const session_player_id = params.get("session_player_id");

          const attackHeroArr = attack_group.split("\n").filter((hero) => hero);
          const defenseHeroArr = defense_group
            .split("\n")
            .filter((hero) => hero);

          if (attackHeroArr.length != defenseHeroArr.length) {
            ajaxAlert("攻击方与防守方人数不一致，请检查!");
            _ajaxStopWaiting(targetId);
            return false;
          }
          ajaxAlert("1/4 进行名称检查...");
          // 检查比赛名称
          const leagueNameArr = await batchCheckLeagueName(
            params,
            league_name,
            bo_count
          );

          ajaxAlert("2/4 开始创建比赛...");
          // 开始创建比赛
          const createLeagueParam = new URLSearchParams();
          createLeagueParam.set("league_owner_id", league_owner_id);
          createLeagueParam.set("league_cat_id", league_cat_id);
          createLeagueParam.set("league_engine", league_engine);
          createLeagueParam.set("league_start_season", league_start_season);
          createLeagueParam.set(
            "league_round_length_seconds",
            league_round_length_seconds
          );
          createLeagueParam.set("league_start_hour", league_start_hour);
          createLeagueParam.set("league_reward_type", league_reward_type);
          createLeagueParam.set("league_ref_type", league_ref_type);
          createLeagueParam.set(
            "league_is_only_one_member_per_player",
            league_is_only_one_member_per_player
          );
          createLeagueParam.set("league_hero_class_id", league_hero_class_id);
          createLeagueParam.set(
            "league_duels_for_ranking",
            league_duels_for_ranking
          );
          createLeagueParam.set("league_closed", league_closed);
          createLeagueParam.set("league_list_position", league_list_position);
          createLeagueParam.set("league_description", league_description);
          createLeagueParam.set("league_comment", league_comment);
          createLeagueParam.set("wod_post_id", wod_post_id);
          createLeagueParam.set("session_hero_id", session_hero_id);
          createLeagueParam.set("session_player_id", session_player_id);
          createLeagueParam.set("id", "new");
          createLeagueParam.set("event", "save");

          const promiseArr = [];
          for (let leagueName of leagueNameArr) {
            promiseArr.push(createLeague(createLeagueParam, leagueName));
          }
          await Promise.all(promiseArr);
          // 获取比赛列表，找到新创建的比赛，获得leagueId
          let ajaxObjIdArr = await fetchLeagueId(
            leagueNameArr,
            league_cat_id,
            session_hero_id
          );

          ajaxAlert("3/4 添加参赛人员...");
          // 添加人员
          const addHeroParams = new URLSearchParams(params.toString());

          const addMembers = [...attackHeroArr, ...defenseHeroArr]
            .filter((hero) => hero)
            .join("\n");
          addHeroParams.set("add_members", addMembers);
          const addHeroesPromiseArr = [];
          for (let objId of ajaxObjIdArr) {
            addHeroParams.set("ajax_object_id", objId);
            addHeroesPromiseArr.push(addHeroes(addHeroParams));
          }
          const respArr = await Promise.all(addHeroesPromiseArr);
          console.log(respArr);

          ajaxAlert("4/4 自动对决分组...");
          // 自动对决分组
          const text = respArr[0];
          const $jq = $("<div></div>").append($(`<div>${text}</div>`));
          const $heroes = $jq.find(
            '.content_table_mainline a[href^="/wod/spiel/hero/profile.php?"]'
          );

          const autoLeagueGroupParam = new URLSearchParams();
          autoLeagueGroupParam.set("wod_post_id", wod_post_id);
          autoLeagueGroupParam.set("session_hero_id", session_hero_id);
          autoLeagueGroupParam.set("session_player_id", session_player_id);
          autoLeagueGroupParam.set("ajax_class_name", "ArenaLeagueMembers");
          autoLeagueGroupParam.set("LeagueMember_league_save", "1");
          $heroes.each((i, e) => {
            const $hero = $(e);
            const hero = $hero.text();
            const selectId = $hero
              .parents("tr:first")
              .find('select[name^="LeagueMember_league"]')
              .attr("name");
            const attackIndex = attackHeroArr.indexOf(hero);
            const defenseIndex = defenseHeroArr.indexOf(hero);
            const leagueIndex =
              (attackIndex >= 0 ? attackIndex : defenseIndex) + 1;
            autoLeagueGroupParam.set(selectId, leagueIndex);
          });
          const autoLeagueGroupPromiseArr = [];
          for (let objId of ajaxObjIdArr) {
            autoLeagueGroupParam.set("ajax_object_id", objId);
            autoLeagueGroupPromiseArr.push(
              autoLeagueGroup(autoLeagueGroupParam)
            );
          }
          await Promise.all(autoLeagueGroupPromiseArr);

          ajaxAlert("批量创建比赛已完成！");
          updateLeagueList(league_cat_id);
          _ajaxStopWaiting(targetId);
          return true;
        } else {
          console.log("取消");
          _ajaxStopWaiting(targetId);
          _ajaxCloseModalDialog("ajax_editor");
          return true;
        }
      },
      function () {
        console.log("init");
      }
    );

    _ajaxStartWaiting(targetId);
    // ajaxMsgBox("批量联赛/比赛", "", true, "console.log(111)");
    let params = getAllHiddenParams();
    let response = await fetch(
      `${location.origin}/wod/spiel/arena/league_edit_ajax.php?is_popup=1`,
      {
        body: `wod_post_id=${params.get(
          "wod_post_id"
        )}&session_hero_id=${params.get(
          "session_hero_id"
        )}&session_player_id=${params.get("session_player_id")}&id=new&ajax=1`,
        method: "POST",
        mode: "cors",
      }
    );
    const text = await response.text();
    const $jq = $("<div></div>").append($(`<div>${text}</div>`));
    const $table = $jq.find("table");
    $table
      .find('input[name="league_name"]')
      .removeAttr("onkeyup")
      .removeAttr("onchange")
      .parent()
      .prev()
      .text("联赛名称(前缀):");
    $table.append(
      $(
        '<tr><td>比赛轮次:</td><td><input name="bo_count" value="1" type="number" min="1" max="5"><button class="button" id="btn_bo3">Bo3</button></td></tr>'
      )
    );
    $table.append(
      $(
        '<tr><td>进攻方:</td><td><div class="resizeable default"><textarea onmouseover="attachResizer(this)" name="attack_group" cols="40" rows="4" placeholder="每行一个"></textarea></div></td></tr>'
      )
    );
    $table.append(
      $(
        '<tr><td>防守方:</td><td><div class="resizeable default"><textarea onmouseover="attachResizer(this)" name="defense_group" cols="40" rows="4" placeholder="每行一个，与进攻方一一对应"></textarea></div><button class="button" id="btn_shuffle">乱序</button></td></tr>'
      )
    );
    $("#ajax_editor_content").append($table);
    $("#btn_bo3").click(function () {
      $('input[name="bo_count"]').val(3);
    });
    $("#btn_shuffle").click(function () {
      const $attackTa = $('textarea[name="attack_group"]');
      const $defenseTa = $('textarea[name="defense_group"]');
      let attackHeroArr = $('textarea[name="attack_group"]')
        .val()
        .split("\n")
        .filter((hero) => hero);
      let defenseHeroArr = $('textarea[name="defense_group"]')
        .val()
        .split("\n")
        .filter((hero) => hero);
      defenseHeroArr = _.shuffle(defenseHeroArr);
      if (!attackHeroArr.length) {
        [attackHeroArr, defenseHeroArr] = _.chunk(
          defenseHeroArr,
          Math.ceil(defenseHeroArr.length / 2)
        );
        $attackTa.val(attackHeroArr.join("\n"));
      }
      $defenseTa.val(defenseHeroArr.join("\n"));
    });
    _ajaxStopWaiting(targetId);
  }

  function addBatchChangeLeagueCat() {
    if (!["/wod/spiel/arena/index.php"].includes(location.pathname)) return;
    const $btn = $(
      '<button type="button" class="button clickable">批量修改标签</button>'
    ).click(async function () {
      // 获得所有分组内联赛
      const leagueList = [];
      $(
        '[id^="div_league_list"]:visible:first a[href^="/wod/spiel/arena/index.php?"]:visible'
      ).each((i, e) => {
        const params = new URLSearchParams(e.href.split("?")[1]);
        leagueList.push({
          id: params.get("show_league_id"),
          name: $(e).text(),
        });
      });
      if (!leagueList.length) {
        ajaxAlert("页面内没有比赛/联赛！");
        return;
      }
      // 打开处理页面
      const $container = $(
        '<div><input type="hidden" id="leagueCkProcess"><table><tbody></tbody></table></div>'
      );
      const targetId = "ajax_editor";
      _ajaxCreateDialogDirect(
        targetId,
        null,
        "批量修改显示标签",
        true,
        async function (event) {
          if (event == "ok") {
            console.log("提交");
            ajaxAlert("开始批处理...");
            const leagueIds = $container
              .find('input:checkbox[id^="leagueCk"]:checked')
              .map((i, e) => e.id.replace("leagueCk", ""))
              .get();
            const leagueCatId = $container
              .find('select[name="league_cat_id"]')
              .val();
            await batchChangeLeagueCat(leagueIds, leagueCatId);
            _ajaxStopWaiting(targetId);
            return true;
          } else {
            console.log("取消");
            _ajaxStopWaiting(targetId);
            _ajaxCloseModalDialog("ajax_editor");
            return true;
          }
        },
        function () {
          console.log("init");
        }
      );

      _ajaxStartWaiting(targetId);
      // 获得所有分组名称
      let params = getAllHiddenParams();
      const wod_post_id = params.get("wod_post_id");
      const session_hero_id = params.get("session_hero_id");
      const session_player_id = params.get("session_player_id");
      let response = await fetch(
        `${location.origin}/wod/spiel/arena/league_edit_ajax.php?is_popup=1`,
        {
          headers: {
            accept: "*/*",
            "accept-language": "zh-CN,zh;q=0.9",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "x-requested-with": "XMLHttpRequest",
          },
          body: `wod_post_id=${wod_post_id}&session_hero_id=${session_hero_id}&session_player_id=${session_player_id}&id=${leagueList[0].id}&ajax=1`,
          method: "POST",
          mode: "cors",
          credentials: "include",
        }
      );
      const text = await response.text();
      const $jq = $("<div></div>").append($(`<div>${text}</div>`));
      const $select = $jq.find('select[name="league_cat_id"]');

      const $tbody = $container.find("tbody");
      const $leagueListRow = $(
        '<tr><td colspan="2">显示标签:</td><td></td></tr>'
      );
      $leagueListRow.find("td:last").append($select);
      $tbody.append($leagueListRow);
      for (let i = 1; i <= leagueList.length; i++) {
        const league = leagueList[i - 1];
        $tbody.append(
          `<tr><td style="text-align: right;">${i}</td><td style="text-align: center;"><input id="leagueCk${league.id}" type="checkbox"></td><td><label for="leagueCk${league.id}">${league.name}</label></td></tr>`
        );
      }
      $("#ajax_editor_content").append($container);
      _ajaxStopWaiting(targetId);
    });
    const $tabs = $('[id^="smarttabs__league_"]:not([id$="inner"]) ul');
    $tabs.append($btn);
  }

  async function changeLeagueCat(updateParams, total) {
    let response = await fetch(
      `${location.origin}/wod/spiel/arena/league_edit_ajax.php?is_popup=1`,
      {
        headers: {
          accept: "*/*",
          "accept-language": "zh-CN,zh;q=0.9",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "x-requested-with": "XMLHttpRequest",
        },
        body: updateParams.toString(),
        method: "POST",
        mode: "cors",
        credentials: "include",
      }
    );
    const $leagueCkProcess = $("#leagueCkProcess");
    $leagueCkProcess.val(parseInt($leagueCkProcess.val()) + 1);
    ajaxAlert(`目前进度：${$leagueCkProcess.val()}/${total}`);
    return response.text();
  }

  async function batchChangeLeagueCat(leagueIds, leagueCatId) {
    let params = getAllHiddenParams();
    const wod_post_id = params.get("wod_post_id");
    const session_hero_id = params.get("session_hero_id");
    const session_player_id = params.get("session_player_id");
    const updateParams = new URLSearchParams();
    updateParams.set("wod_post_id", wod_post_id);
    updateParams.set("session_hero_id", session_hero_id);
    updateParams.set("session_player_id", session_player_id);
    updateParams.set("event", "save");
    updateParams.set("ajax", "1");
    updateParams.set("league_cat_id", leagueCatId);
    $("#leagueCkProcess").val(0);
    let promiseArr = [];
    for (let leagueId of leagueIds) {
      updateParams.set("id", leagueId);
      promiseArr.push(changeLeagueCat(updateParams, leagueIds.length));
    }
    const respArr = await Promise.all(promiseArr);
    const currentCatId = $('[id^="div_league_list_"]:visible:first')[0]
      .id.replace("div_league_list_", "")
      .replace("_container", "");
    updateLeagueList(currentCatId);
    updateLeagueList(leagueCatId);
    ajaxAlert("处理完成!");
    console.log(respArr);
  }
})();
