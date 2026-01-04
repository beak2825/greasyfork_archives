// ==UserScript==
// @name         Wod增强
// @namespace    https://github.com/knight000/Wod_Script
// @description  提供如下功能：1.自动荣誉投票 2.自动减少地城探索时间 3.链接替换为新窗口打开 4.登录失效自动返回登录页面 5.显示技能类别提示
// @author       knight000
// @match        http*://*.world-of-dungeons.org/*
// @require      https://cdn.jsdelivr.net/npm/dayjs@1.11.5/dayjs.min.js
// @require      https://cdn.jsdelivr.net/npm/dayjs@1.11.5/plugin/customParseFormat.js
// @require      https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js
// @icon         http://info.world-of-dungeons.org/wod/css/WOD.gif
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        GM_addStyle
// @modifier     Christophero
// @version      2023.12.21.1
// @downloadURL https://update.greasyfork.org/scripts/520643/Wod%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/520643/Wod%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

const WOD_ENHANCE_CONFIG = "WOD_ENHANCE_CONFIG";
let funArr = [];
let $panelBody = null;
const baseParams = [
  "session_hero_id",
  "wod_post_id",
  "wod_post_world",
  "klasse_id",
  "klasse_name",
  "rasse_id",
  "rasse_name",
  "gruppe_id",
  "gruppe_name",
  "clan_id",
  "clan_name",
  "stufe",
  "heldenname",
  "spielername",
];
const attrEnMap = {
  力量: "st",
  体质: "ko",
  智力: "in",
  灵巧: "ge",
  魅力: "ch",
  敏捷: "sn",
  感知: "wa",
  意志: "wi",
};
let globalSteps = 0;
let globalCurSteps = 0;

(function () {
  "use strict";
  // 相关模块，注释掉来取消使用
  addControlPanel();
  funControl("autoVote", "自动投票", autoVote, false);
  funControl("autoReduce", "加速探索", autoReduce, true);
  funControl("replaceLink", "链接新窗口", replaceLink, true);
  funControl("autoGotoLogin", "自动跳转登录", autoGotoLogin, true);
  funControl("showSkillTypeTips", "技能类别提示", showSkillTypeTips, true);
  funControl("forceDisplayTip", "手机强制提示", forceDisplayTip, true);
  funControl("chaseWarning", "反抗军追击警告", chaseWarning, true);
  funControl("easySelling", "出售增强", easySelling, true);
  funControl("quickViewDrop", "地城掉落", quickViewDrop, true);
  funControl("styleEnhance", "样式优化", styleEnhance, true);
  funControl("calcNpcPrice", "交易物品总N价", calcNpcPrice, true);
  funControl("resetSkillPoint", "技能重置", resetSkillPoint, false);
  funControl("refreshSkill", "刷新技能数值", refreshSkill, false);
  funControl("smartSelect", "批量框选", smartSelect, false);
  funControl("cancelDungeon", "取消探险", cancelDungeon, true);
  funControl("battlePreCheck", "耗材检查", battlePreCheck, true);
  funControl("multiTombola", "彩票十连", multiTombola, true);
  funControl("sibebarDungeon", "侧边选地城", sibebarDungeon, true);
  funControl("easyAttrVal", "简易属性提升", easyAttrVal, false);
  funControl("easyChangeSkill", "简易技能等级", easyChangeSkill, false);
  funControl("importHeroTemplate", "导入英雄模版", importHeroTemplate, false);
  funControl("batchDelProfile", "批量删除设置", batchDelProfile, true);
  funControl("batchChangeOwner", "物品归属变更", batchChangeOwner, true);
  funControl("autoCleanWarehouse", "自动清仓", autoCleanWarehouse, false);
  funControl("viewFullScreen", "主体切换全屏", viewFullScreen, false);
})();

function addControlPanel() {
  const $main = $(
    `
    <br>
    <div class="spoilerbox">
      <input type="button" class="spoilerbutton" value="+" onclick="this.value=this.value=='+'?'-':'+';">
      <span class="spoilerheader"><b>Wod增强控制面板</b></span>
      <div class="spoiler">
        <div>
          <button id="saveEnhanceConfig" class="button clickable" title="仅启用勾选功能">仅启用勾选功能</button><br>
        </div>
      </div>
    </div>`
  );
  $("#gadgettable-left").append($main);
  try {
    $panelBody = $main.find(".spoiler>div");
  } catch (error) {
    console.log(error);
  }

  $("#saveEnhanceConfig").click(function () {
    if (confirm("是否仅启用当前勾选功能？")) {
      const config = loadConfig();
      $panelBody.find("input:checkbox").each((i, e) => {
        config[$(e).attr("name")] = $(e).is(":checked");
      });
      saveConfig(config);
      alert("保存完毕");
    }
  });
}

function funControl(name, label, fun, defStatus) {
  let config = loadConfig();
  if (!config.hasOwnProperty(name)) {
    config[name] = defStatus;
    saveConfig(config);
  }
  const $chk = $(`<input type="checkbox" name="${name}">`);
  $chk.prop("checked", config[name]);
  $panelBody.append($chk).append(label).append("<br>");
  if (config[name]) {
    fun();
  } else {
    console.log(label + " 功能未启用");
  }
}

function loadConfig() {
  let configJson = localStorage.getItem(WOD_ENHANCE_CONFIG);
  try {
    return JSON.parse(configJson) || {};
  } catch (ex) {
    return {};
  }
}

function saveConfig(config) {
  localStorage.setItem(WOD_ENHANCE_CONFIG, JSON.stringify(config));
}

/**
 * @function 自动投票模块
 */
function autoVote() {
  const $voteBanner = $(".vote.banner > a");
  const $voteReward = $(".vote.reward");
  // 如果有$(".vote.banner")就表明是投票页面进行操作
  if ($voteBanner.length != 0) {
    // 移除链接，这样就不会弹出窗口了
    $voteBanner.removeAttr("href");
    for (let i = 0; i < $voteBanner.length; i++) {
      console.log("[Wod增强]正在检测投票链接" + i);
      let $voteSpan;
      try {
        // 把投票链接后的说明提取出来，以此判定是否已投票，正则把多余的"去除
        $voteSpan = $voteReward[i]
          .getElementsByTagName("span")[0]
          .innerHTML.replace(/"/g, "");
      } catch (ex) {
        continue;
      }
      // 如果是5或者3荣誉就进行点击
      if (($voteSpan && $voteSpan[0] == "5") || $voteSpan[0] == "3") {
        $voteBanner[i].click();
        break;
      }
    }
    console.log("[Wod增强]全部投票完毕");
  } else {
    // 非投票页面检测未投票就打开投票窗口，如果默认设置拦截弹出窗口的话就打不开了
    if ($("center:contains('点链接获5')").length != 0) {
      window.open(
        $("a[href^='/wod/spiel/rewards/vote.php?']:last").attr("href")
      );
      console.log("[Wod增强]非投票页面，未投票，已跳转");
    } else {
      console.log("[Wod增强]非投票页面，已投票");
    }
  }
}

/**
 * @function 自动减少地域探索时间模块
 */
function autoReduce() {
  let $reduce = $('[name="reduce_dungeon_time"]');
  // 有这个按钮就按一下
  if ($reduce.length) {
    $reduce[0].click();
    console.log("[Wod增强]已自动减少地域时间");
  } else {
    console.log("[Wod增强]无需自动减少地域时间");
  }
}

/**
 * @function 链接替换为新窗口打开模块
 */
function replaceLink() {
  // 团队说明的快速链接
  $("div.gadget.groupmsg.lang-cn a[target!='_blank']").attr("target", "_blank");
  // 物品链接
  $("a.item_unique[target!='_blank']").attr("target", "_blank");
  // 拍卖详情
  $("a:contains('详情')[target!='_blank']").attr("target", "_blank");
  // 英雄详情
  $("a.hero_active,a.hero_inactive").attr("target", "_blank");
  console.log("[Wod增强]链接替换为新窗口打开");
}

/**
 * @function 自动跳转登录页面
 */
function autoGotoLogin() {
  if (document.title && document.title.endsWith(" OR cookies disabled.")) {
    window.location = location.origin;
  }
}

/**
 * @function 显示技能类别提示
 */
function showSkillTypeTips() {
  const genAuctionAnchor = (skillName) => {
    let skillDisplayUrl = `/wod/spiel/hero/skill.php?name=${skillName}&IS_POPUP=1`;
    return `<a href=\\"${skillDisplayUrl}\\" target=\\"_blank\\" onclick=\\"return wo(\\'${skillDisplayUrl}\\');\\">${skillName}</a>`;
  };

  // 添加全局技能类别查看
  function renderSkillTips(skillMap) {
    let $tds = $('td.content_table:contains("类别的所有技能")');
    $tds.each(function (i) {
      const type = $(this).find("i").text();
      const skillList = skillMap[type];
      if (!skillList) {
        $(this).attr(
          "onmouseover",
          `wodToolTip(this, "<b>目前尚未收录 ${type} 类别的技能</b>")`
        );
        return;
      }
      let str = "<b>" + type + " 类别包含以下技能</b><br>";
      str += skillList
        .map((skillName) => genAuctionAnchor(skillName))
        .join("<br>");
      $(this).attr("onmouseover", `wodToolTip(this, "${str}")`);
      $(this).click(function () {
        window.open(
          `https://www.christophero.xyz/skill?type=${encodeURIComponent(type)}`,
          "_blank"
        );
      });
    });
  }
  const SKILL_MAP_KEY = "skillMap";
  const SKILL_MAP_VERSION = "skillMapVersion";
  let skillMapStr = localStorage.getItem(SKILL_MAP_KEY);
  let skillMapVer = localStorage.getItem(SKILL_MAP_VERSION);
  let skillMap = {};
  let nowTime = new Date().getTime();
  if (
    skillMapStr &&
    skillMapVer &&
    nowTime - skillMapVer < 7 * 24 * 60 * 60 * 1000
  ) {
    skillMap = JSON.parse(skillMapStr);
    renderSkillTips(skillMap);
  } else {
    // 获取技能信息
    fetch("https://www.christophero.xyz/wod/skill/all", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        if (!(res && res.code === 200)) {
          return;
        }
        const data = res.data;
        for (let skill of data) {
          if (!skillMap.hasOwnProperty(skill.type)) {
            skillMap[skill.type] = [skill.name];
          } else {
            skillMap[skill.type].push(skill.name);
          }
        }
        localStorage.setItem(SKILL_MAP_KEY, JSON.stringify(skillMap));
        localStorage.setItem(SKILL_MAP_VERSION, nowTime);
        renderSkillTips(skillMap);
      });
  }
}

/**
 *
 * @returns 返回是否是移动端
 */
function isMobile() {
  const userAgentInfo = navigator.userAgent;

  const mobileAgents = [
    "Android",
    "iPhone",
    "SymbianOS",
    "Windows Phone",
    "iPad",
    "iPod",
  ];

  let mobileFlag = false;

  //根据userAgent判断是否是手机
  for (let v = 0; v < mobileAgents.length; v++) {
    if (userAgentInfo.indexOf(mobileAgents[v]) > 0) {
      mobileFlag = true;
      break;
    }
  }

  const screen_width = window.screen.width;
  const screen_height = window.screen.height;

  //根据屏幕分辨率判断是否是手机
  if (screen_width < 500 && screen_height < 800) {
    mobileFlag = true;
  }

  return mobileFlag;
}

/**
 * 强制显示提示，重写了部分显示代码
 */
function forceDisplayTip() {
  if (isMobile()) {
    if (typeof GM_addStyle == "undefined") {
      function GM_addStyle(styles) {
        var S = document.createElement("style");
        S.type = "text/css";
        var T = "" + styles + "";
        T = document.createTextNode(T);
        S.appendChild(T);
        document.body.appendChild(S);
        return;
      }
    }

    GM_addStyle(`
        .tooltip {
          min-width: 150px;
          min-height: 90px;
        }
      `);

    $('[src$="images/icons/inf.gif"]').click(function () {
      return false;
    });

    window._wodTooltipSetSize = function (content) {
      var offsetX, offsetY, screenWidth, screenHeight;

      if (self.pageYOffset) {
        offsetX = self.pageXOffset;
        offsetY = self.pageYOffset;
      } else if (
        document.documentElement &&
        document.documentElement.scrollTop
      ) {
        offsetX = document.documentElement.scrollLeft;
        offsetY = document.documentElement.scrollTop;
      } else if (document.body) {
        offsetX = document.body.scrollLeft;
        offsetY = document.body.scrollTop;
      }

      if (self.innerHeight) {
        screenWidth = self.innerWidth;
        screenHeight = self.innerHeight;
      } else if (
        document.documentElement &&
        document.documentElement.clientHeight
      ) {
        screenWidth = document.documentElement.clientWidth;
        screenHeight = document.documentElement.clientHeight;
      } else if (document.body) {
        screenWidth = document.body.clientWidth;
        screenHeight = document.body.clientHeight;
      }

      if (typeof screenWidth == "undefined" || screenWidth <= 10)
        screenWidth = 800;

      if (typeof screenHeight == "undefined" || screenHeight <= 10)
        screenHeight = 600;

      var top;
      var bottom;
      var left;
      var right;

      if (
        wodToolTipCurrentMouseY + wodToolTip_OffY + content.offsetHeight >
        screenHeight - wodToolTip_ScrollBarWidth
      ) {
        bottom = wodToolTip_OffY;

        if (
          content.offsetHeight <
          screenHeight - 2 * wodToolTip_ScrollBarWidth
        ) {
          top =
            screenHeight -
            content.offsetHeight -
            wodToolTip_ScrollBarWidth -
            wodToolTip_OffY;
        } else top = wodToolTip_OffY;
      } else {
        top = wodToolTipCurrentMouseY + wodToolTip_OffY;
        bottom =
          screenHeight -
          (wodToolTipCurrentMouseY +
            wodToolTip_OffY +
            content.offsetHeight +
            wodToolTip_ScrollBarWidth);
      }

      if (
        wodToolTipCurrentMouseX + wodToolTip_OffX + content.offsetWidth >
        screenWidth - wodToolTip_ScrollBarWidth
      ) {
        right = wodToolTip_OffX;

        if (content.offsetWidth < screenWidth - 2 * wodToolTip_ScrollBarWidth) {
          left =
            screenWidth -
            content.offsetWidth -
            wodToolTip_ScrollBarWidth -
            wodToolTip_OffX;
        } else left = wodToolTip_OffX;
      } else {
        left = wodToolTipCurrentMouseX + wodToolTip_OffX;

        right =
          screenWidth -
          (wodToolTipCurrentMouseX +
            wodToolTip_OffX +
            content.offsetWidth +
            wodToolTip_ScrollBarWidth);
      }

      var is_absolut_position = isSafari2() || isIE6() || isChrome();
      if (is_absolut_position) {
        top += offsetY;
        bottom -= offsetY;
        left += offsetX;
        right -= offsetX;
      }

      content.style.top = top + "px";
      content.style.left = left + "px";
    };
  }
}

/**
 * 反抗军追击警告
 */
function chaseWarning() {
  const $dungeons = $(
    '.gadget.nextdungeon a.menu, form[action^="/wod/spiel/dungeon/dungeon.php"] table.top .content_table>tbody>tr:visible>td:first-child'
  );
  if (!$dungeons.length) return;
  const day = new Date().getDay();
  $dungeons.each(function (i, e) {
    const $dungeon = $(e);
    const dungeonName = $dungeon.text().trim();
    const chuyunfeiHauntDungeons = [
      "发狂的炼金术士",
      "格兰斯凯巴的生命之水",
      "银刺",
      "竞技比赛的前夜",
    ];
    const guangtoHauntDungeons = ["尤里佛的一天", "冰冷大地"];
    const liyunlongHauntDungeons = [
      "阴影之心",
      "图书馆的一夜",
      "冰冷大地",
      "血腥之手",
      "尤里佛的一天",
      "一场公平的决斗",
      "笼罩缇琳的阴云",
      "父债子偿",
    ];

    if (
      chuyunfeiHauntDungeons.includes(dungeonName) ||
      guangtoHauntDungeons.includes(dungeonName) ||
      liyunlongHauntDungeons.includes(dungeonName)
    ) {
      $dungeon.css({ color: "#FF8C27" });
      let tip = "";
      if ("冰冷大地" == dungeonName) {
        if ([0, 1, 3, 5].includes(day)) {
          tip += "星期一三五七该地城3层房间2将与<b>强大的阿瑞露</b>为敌！<br>";
        } else {
          tip +=
            "星期二四六该地城3层房间2将与阿瑞露一起对抗<b>顺劈骑士团</b>！<br>";
        }
      }
      tip += "携带反抗军装备时，<br>";
      if (chuyunfeiHauntDungeons.includes(dungeonName)) {
        tip += "该地城有<b>林云</b>出没<br>";
      }
      if (guangtoHauntDungeons.includes(dungeonName)) {
        tip += "该地城有<b>光头</b>出没<br>";
      }
      // 周日圣女放假
      if (liyunlongHauntDungeons.includes(dungeonName)) {
        tip += "除周日外该地城有<b>圣女</b>出没<br>";
      }

      tip +=
        '查看<a href="https://www.christophero.xyz/itemList?categoryName=%E5%8D%A1%E6%B4%9B%E6%96%AF%E5%8F%8D%E6%8A%97%E5%86%9B%E6%94%B9%E8%89%AF%E5%85%B5%E5%99%A8" target="_blank" >反抗军武器</a><br>';
      tip +=
        '重点关注: 【<a href="/wod/spiel/hero/item.php?name=%E7%81%B0%E6%9A%AE%E4%B9%8B%E5%BD%A2&is_popup=1" target="_blank" >灰暮之形</a>】【<a href="/wod/spiel/hero/item.php?name=%E6%96%A9%E6%96%AD%E5%9B%A0%E6%9E%9C%E7%9A%84%E5%87%8C%E5%86%BD%E6%B3%95%E5%88%83&is_popup=1" target="_blank" >斩断因果的凌冽法刃</a>】';
      $dungeon.mouseenter(function () {
        wodToolTip(e, tip);
      });
      // $dungeon.parent().attr("onmouseover", `wodToolTip(this, "${tip}")`);
    }
  });
}

/**
 * 增强出售操作，更方便移除物品
 * @returns
 */
function easySelling() {
  let pathName = location.pathname;
  if (pathName !== "/wod/spiel/hero/items.php") {
    return;
  }
  if (
    !(
      $('h1:contains("请确认")').length ||
      $('p:contains("物品现在将以NPC价出售")').length
    )
  ) {
    return;
  }
  const $tip = $('p:contains("物品现在将以NPC价出售")');
  $('p:contains("物品现在将以NPC价出售")~table').on(
    "click",
    "td>img:first-child",
    function () {
      const $a = $(this).nextAll("a:first");
      const itemName = $a.text();
      const params = $a.attr("href").split("?")[1];
      const instanceId = new URLSearchParams(params).get("item_instance_id");
      const $sellids = $('input[name="sellids"]');
      if ($a.css("text-decoration-line") != "line-through") {
        if (confirm(`是否将物品[${itemName}]从出售列表移除`)) {
          let idArr = $sellids
            .val()
            .split(",")
            .filter((id) => id);
          idArr = idArr.filter((id) => id != instanceId);
          $sellids.val(idArr.join(","));
          $a.css({ "text-decoration-line": "line-through" });
          $tip.text(`以下${idArr.length}件物品现在将以NPC价出售:`);
        }
      } else if ($a.css("text-decoration-line") != "none") {
        if (confirm(`是否将物品[${itemName}]加入出售列表`)) {
          let idArr = $sellids
            .val()
            .split(",")
            .filter((id) => id);
          idArr.push(instanceId);
          $sellids.val(idArr.join(","));
          $a.css({ "text-decoration-line": "none" });
          $tip.text(`以下${idArr.length}件物品现在将以NPC价出售:`);
        }
      }
    }
  );
}

/**
 * 查看地城掉落
 * @returns
 */
function quickViewDrop() {
  // 右下角地城添加快速链接
  const $quickViewDropBtn = $(
    '<button type="button" class="button clickable" title="查看地城掉落">查看地城掉落</button>'
  );
  const $curConfigAnchor = $(
    "div.nextdungeon div[id^='CombatDungeonConfigSelector'], form[action^='/wod/spiel/quests/quests.php'] div[id^='CombatDungeonConfigSelector'], form[action^='/wod/spiel/dungeon/dungeon.php'] div[id^='CombatDungeonConfigSelector']"
  );

  $quickViewDropBtn.click(function () {
    let url = "https://www.christophero.xyz/groupDungeon/";
    let curDungeonName = "";
    const $that = $(this);
    if ($that.parents("div.nextdungeon").length) {
      // 侧边
      curDungeonName = $that
        .parent()
        .find(
          'a[href^="/wod/spiel/dungeon/dungeon.php"],a[href^="/wod/spiel/quests/quests.php"]'
        )
        .text()
        .trim();
    } else if ($that.parents("tr[class^='row']").length) {
      // 地城列表
      curDungeonName = $that
        .parents("tr[class^='row']:first")
        .find("td:first")
        .text()
        .trim();
    } else if (
      $('h1:contains("任务: ")').length &&
      $that.parents('form[action^="/wod/spiel/quests/quests.php"]')
    ) {
      let res = null;
      // 任务已经在执行了
      if ($("#progressBar1_txt1").length) {
        const reg = /^地城:\s*(.+)$/g;
        curDungeonName = $that
          .parents("form:first")
          .find("h2:first")
          .text()
          .trim();
        res = reg.exec(curDungeonName);
      } else {
        // 任务
        const reg = /^\d+\.\s*(.+)$/g;
        curDungeonName = $that
          .parents("tr[class^='row']:first")
          .find("h3:first")
          .text()
          .trim();
        res = reg.exec(curDungeonName);
      }
      if (res) {
        curDungeonName = res[1];
      }
    } else if (
      $that.parents("table:first").prev(".progressBar_container").length
    ) {
      curDungeonName = $that
        .parents("table:first")
        .prevAll("p:first")
        .find("b:nth-child(2)")
        .text()
        .trim();
    }
    url += encodeURIComponent(curDungeonName);
    url += `?groupId=${$('input[name="gruppe_id"]').val()}`;
    window.open(url, "_blank");
  });
  $curConfigAnchor.after($quickViewDropBtn);
}

function calcNpcPrice() {
  if (
    ![
      "/wod/spiel/trade/exchange_details.php",
      "/wod/module/search/select_item.php",
    ].includes(location.pathname)
  )
    return;
  const $tradeTds = $('td[valign="top"][align="center"]:not([colspan])');
  if (!$tradeTds.length) return;
  $tradeTds.each((i, e) => {
    let gold = parseInt($(e).find('input[name="gold"]').val());
    if (isNaN(gold)) {
      gold = parseInt(e.childNodes[0].textContent.trim());
    }
    const $tbody = $(e).find("tbody");
    const $trs = $tbody.find("tr");
    let ntotal = 0;

    let promiseArr = [];
    for (const tr of Array.from($trs)) {
      let price = 0;
      if (i == 1) {
        promiseArr.push(
          fetchNpcPrice(location.origin + $(tr).find("a").attr("href"), tr)
        );
      } else {
        price = parseInt($(tr).find("td:eq(3)").text().trim());
      }
      if (price) ntotal += price;
    }
    Promise.all(promiseArr).then((priceArr) => {
      ntotal += priceArr.reduce((t, c) => t + c, 0);
      const total = ntotal + gold;
      $tbody.append(
        `<tr><td align="right"></td><td valign="top" nowrap>小计</td><td valign="top" nowrap></td><td nowrap>${ntotal} <img alt="" border="0" src="/wod/css//skins/skin-4/images/icons/lang/cn/gold.gif" title="金币"></td></tr>
      <tr><td align="right"></td><td valign="top" nowrap>合计</td><td valign="top" nowrap></td><td nowrap>${total} <img alt="" border="0" src="/wod/css//skins/skin-4/images/icons/lang/cn/gold.gif" title="金币"></td></tr>`
      );
    });
  });
}

function fetchNpcPrice(url, tr) {
  return fetch(url, {
    headers: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "content-type": "application/x-www-form-urlencoded",
    },
    method: "GET",
  }).then(async (response) => {
    let price = 0;
    if (response.status === 200) {
      const text = await response.text();
      const $priceTd = $(text).find(
        '#details td:contains("NPC价/全新时NPC价") +td'
      );
      price = parseInt($priceTd[0].childNodes[0].textContent.trim());
      if (isNaN(price)) price = 0;
    }
    $(tr).append(
      `<td></td><td>${price} <img alt="" border="0" src="/wod/css//skins/skin-4/images/icons/lang/cn/gold.gif" title="金币"></td>`
    );
    return new Promise((resolve, reject) => {
      resolve(price);
    });
  });
}

function resetSkillPoint() {
  if (location.pathname !== "/wod/spiel/hero/skills.php") return;
  $('<button class="button clickable" type="button">技能重置</button>')
    .insertBefore('input[name="hide_all"],input[name="show_all"]')
    .click(function () {
      $('input[name^="undo["][src$="undo_steigern_enabled.gif"]').each(
        (i, e) => {
          let currentCnt = parseInt(
            $(e)
              .parents("tr:first")
              .find('div[id^="skill_rang_"]')
              .text()
              .trim()
          );
          let skillId = $(e)
            .prop("name")
            .match(/undo\[(\d+)\]/)[1];
          const deltaRang = -1 * currentCnt;
          if (isAbleToChange(skillId, deltaRang)) {
            advanceSkill(skillId, deltaRang);
            hero["stufe"] = engineLevelGainedForEps(
              hero["fc_ep"],
              hero["fc_ep"] - hero["ep"]
            );
            if (hero["stufe"] < hero["stufe_orig"])
              hero["stufe"] = hero["stufe_orig"];
            updateSkills(skillId);
          }
        }
      );
      alert("技能已重置");
    });
}

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

function styleEnhance() {
  insertCss(".orders_top_row, .orders_top_row > *", {
    "vertical-align": "unset",
  });
}

function refreshSkill() {
  if (
    location.pathname !== "/wod/spiel/hero/skills.php" &&
    !$('h1:contains("装备着的物品")').length
  )
    return;

  const $btn = $(
    '<button class="button clickable" type="button">刷新套装加成</button>'
  ).click(function () {
    let $btn = $(this);
    let baseUrl = location.origin + "/wod/spiel/hero/attributes.php?is_popup=1";
    const searchParams = getBaseSearchParams();
    searchParams.set("do_reset", "");
    searchParams.set("levelup_warned", "0");
    searchParams.set("geschlecht", "f");
    searchParams.set("change_gender", "更改");
    searchParams.set("amor_details", "关闭");
    $btn.text("处理中请稍候...");
    const heroId = searchParams.get("session_hero_id");
    baseUrl += "&session_hero_id=" + heroId;
    fetch(baseUrl, {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "content-type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      body: searchParams.toString(),
    }).then((resp) => {
      $btn.text("处理完成刷新页面");
      if (location.pathname == "/wod/spiel/hero/items.php") {
        location.replace(
          location.pathname +
            "?menukey=hero_gear&view=gear&session_hero_id=" +
            heroId
        );
      } else {
        location.replace(location.href);
      }
    });
  });
  if (location.pathname === "/wod/spiel/hero/skills.php") {
    $btn.insertBefore('input[name="hide_all"],input[name="show_all"]');
  } else {
    $btn.insertAfter('input[name="ok"][value="应用改动"]');
  }
}

function smartSelect() {
  // is dragging active
  let isDragging = false;

  // the rectangle to show while dragging
  var rectangle = undefined;

  // rectangle object specify the selected range
  let rec = {
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
  };

  // rectangle object to draw the box upon dragging
  let recDraw = {
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    style:
      "position:absolute;border: 2px dotted black;background: white; opacity:0.5;z-index:200000000;font-size: 0px",
  };

  document.addEventListener("mousedown", (e) => {
    // start dragging-mode if shift key is pressed
    if (e.shiftKey || e.altKey) {
      isDragging = true;
      rec.startX = rec.endX = recDraw.startX = recDraw.endX = e.pageX;
      rec.startY = rec.endY = recDraw.startY = recDraw.endY = e.pageY;
      e.preventDefault();
    }
  });

  document.addEventListener("mousemove", (e) => {
    // show dragging rectangle is drag mode is activated
    if ((e.shiftKey || e.altKey) && isDragging) {
      rectangle.style.visibility = "visible";
      e.preventDefault();

      // Take care that the rectangle is displayed also with negative x or y values
      if (e.pageX >= rec.startX && e.pageY >= rec.startY) {
        //console.log("right bottom")
        recDraw.endX = e.pageX;
        recDraw.endY = e.pageY;
      } else if (e.pageX < rec.startX && e.pageY >= rec.startY) {
        //console.log("left bottom - negative X")
        recDraw.startX = e.pageX;
        recDraw.endX = rec.startX;
        recDraw.endY = e.pageY;
      } else if (e.pageX >= rec.startX && e.pageY < rec.startY) {
        //console.log("right top - negative Y")
        recDraw.endY = rec.startY;
        recDraw.startY = e.pageY;
        recDraw.endX = e.pageX;
      } else if (e.pageX < rec.startX && e.pageY < rec.startY) {
        //console.log("left top - negative X + negative Y")
        recDraw.startY = e.pageY;
        recDraw.startX = e.pageX;
        recDraw.endX = rec.startX;
        recDraw.endY = rec.startY;
      }

      drawRectangle();
    }
  });

  document.addEventListener("mouseup", (e) => {
    // stop dragging mode if mouse button is released
    if (isDragging) {
      rec.endX = e.pageX;
      rec.endY = e.pageY;
      isDragging = false;
      rectangle.style.visibility = "hidden";
      if (e.shiftKey) {
        checkCheckboxes();
      } else if (e.altKey) {
        batchSelectOrEdit();
      }
    }
  });

  //////// Functions ////////

  function drawRectangle() {
    rectangle.style.left = `${recDraw.startX}px`;
    rectangle.style.top = `${recDraw.startY}px`;
    rectangle.style.width = `${recDraw.endX - recDraw.startX}px`;
    rectangle.style.height = `${recDraw.endY - recDraw.startY}px`;
  }

  function checkCheckboxes() {
    let left = rec.startX;
    let right = rec.endX;
    let top = rec.startY;
    let bottom = rec.endY;
    if (left > right) {
      [left, right] = [right, left];
    }
    if (top > bottom) {
      [top, bottom] = [bottom, top];
    }
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((ele) => {
      const $ele = $(ele);
      const eleOffset = $(ele).offset();
      const eleTop = eleOffset.top;
      const eleLeft = eleOffset.left;
      const eleBottom = eleTop + $ele.height();
      const eleRight = eleLeft + $ele.width();
      const verticalCenter = (eleTop + eleBottom) / 2;
      const horizonCenter = (eleLeft + eleRight) / 2;

      // 中心点在矩形范围内就勾选
      if (
        left <= horizonCenter &&
        horizonCenter <= right &&
        top <= verticalCenter &&
        verticalCenter <= bottom
      ) {
        // toggle status of the checkbox in range
        $(ele).click();
        // ckbox.checked ? (ckbox.checked = false) : (ckbox.checked = true);
      }
    });
  }

  // 批量选择下拉框
  function batchSelectOrEdit() {
    let left = rec.startX;
    let right = rec.endX;
    let top = rec.startY;
    let bottom = rec.endY;
    if (left > right) {
      [left, right] = [right, left];
    }
    if (top > bottom) {
      [top, bottom] = [bottom, top];
    }
    const $eles = $("select:visible,input:visible");
    const opts = [];
    const boxedSels = [];
    const boxedInputs = [];
    $eles.each((i, ele) => {
      const $ele = $(ele);
      const eleOffset = $(ele).offset();
      const eleTop = eleOffset.top;
      const eleLeft = eleOffset.left;
      const eleBottom = eleTop + $ele.height();
      const eleRight = eleLeft + $ele.width();
      const verticalCenter = (eleTop + eleBottom) / 2;
      const horizonCenter = (eleLeft + eleRight) / 2;

      // 中心点在矩形范围内就选择
      if (
        left <= horizonCenter &&
        horizonCenter <= right &&
        top <= verticalCenter &&
        verticalCenter <= bottom
      ) {
        if (ele.tagName == "SELECT") {
          boxedSels.push(ele);
          // 设置选项
          $(ele)
            .find("option")
            .each((i, opt) => {
              const text = opt.textContent;
              const value = opt.value;
              if (
                opts.some((opt) => opt.text === text && opt.value === value)
              ) {
                return;
              }
              opts.push({ text, value });
            });
        } else if (ele.tagName == "INPUT") {
          boxedInputs.push(ele);
        }
      }
    });

    // 没有框选到任何下拉框则不弹出选项
    if (!boxedSels.length && !boxedInputs.length) return;

    // 展示批量选择框
    const targetId = "ajax_dialog";
    const innerHtml =
      '<select id="batchSelect" style="visibility:hidden;"></select><input type="text" id="batchInput" style="visibility:hidden;">';
    _ajaxCreateDialogDirect(
      targetId,
      innerHtml,
      boxedSels.length > boxedInputs.length
        ? "批量选择下拉框选值"
        : "批量修改输入框数值",
      AJAX_YES | AJAX_CLOSE,
      async function (event) {
        if (event == "yes") {
          if (boxedSels.length > boxedInputs.length) {
            const selectedVal = $("#batchSelect").val();
            boxedSels.forEach((select) => {
              $(select).val(selectedVal).trigger("change");
            });
          } else {
            const inputVal = $("#batchInput").val();
            boxedInputs.forEach((input) => {
              input.value = inputVal;
            });
          }
        }
        _ajaxStopWaiting(targetId);
        _ajaxCloseModalDialog(targetId);
      },
      function () {
        altDown = false;
        document.querySelector(`#${targetId}_buttons button`).innerText =
          "确定";
        if (boxedSels.length > boxedInputs.length) {
          const $batchSelect = $("#batchSelect");
          for (let opt of opts) {
            const $opt = $("<option></option>");
            $opt.attr("value", opt.value).text(opt.text);
            $batchSelect.append($opt);
          }
          $("#batchSelect").css("visibility", "visible");
        } else {
          $("#batchInput").css("visibility", "visible");
        }
      }
    );
  }

  function initCheckboxSelector() {
    // create div which is used for showing the rectangle and initialize it
    rectangle = document.createElement("div");
    rectangle.style.cssText = recDraw.style;
    document.body.appendChild(rectangle);
  }

  initCheckboxSelector();
}

function cancelDungeon() {
  const $nextDungeonDiv = $('.block_inner:contains("下一个地城：")');
  if (!$nextDungeonDiv.length) return;
  const $cancelDungeonBtn = $(
    '<button id="cancelDungeon" class="button clickable" title="取消探险">取消探险</button>'
  );
  $nextDungeonDiv.append($cancelDungeonBtn);
  $cancelDungeonBtn.click(function () {
    if (!confirm("确定要取消当前探险吗？")) return;
    let $btn = $(this);
    let baseUrl = location.origin + "/wod/spiel/dungeon/dungeon.php?is_popup=1";
    const searchParams = getBaseSearchParams();
    const groupLv = searchParams.get("stufe");
    searchParams.set("TABLE_DEFAULT_SORT_DIR", "DESC");
    searchParams.set("TABLE_DEFAULT_SORT_COL", "7");
    searchParams.set("TABLE_DEFAULT_PAGE", "1");
    searchParams.set("TABLE_DEFAULT_PSNR[1]", "20");
    searchParams.set("TABLE_DEFAULT_PSNR[2]", "20");
    searchParams.set("TABLE_DATED_SORT_DIR", "ASC");
    searchParams.set("TABLE_DATED_SORT_COL", "14");
    searchParams.set("TABLE_DATED_PAGE", "1");

    searchParams.set("dungeon_1name", "不可能存在的地城");
    searchParams.set(
      "profile_data_dungeon_1_profile_data",
      "HogNB0ny8I/FjaOg6FXrzZvwI0A1hZgI77jjRYoCRE27wTAWqILHdEzHicsmJZl6X7ZRBEIW822E5+rsUoHjcPHJM1dTqbJE0c1Ad4c6gLXcUjcGy5WB8H0lm1qobBxf"
    );
    searchParams.set(
      "callback_js_code_dungeon_1_callback_js_code",
      "9hAUpnwetF8TrxnkIxgBdD27k4isavkaEEd/PwhJTLL8yf4MvBsSYedcxPRse51t2x6Aw2bcXKHHlyCszAStN2nnub0CncNJMDrZQePru5mpXW3It99S/D+JypTOewMQ/T9+eXLlhJZ7vK+j9IAKgKVS+EFJPGzy61GBgu60fBk="
    );
    searchParams.set("dungeon_1level", "99");
    searchParams.set("dungeon_1level_to", "99");
    searchParams.set("dungeon_1level_allowed", "99");
    searchParams.set("dungeon_1level_allowed_to", "99");
    searchParams.set("dungeon_1groupLevel", groupLv);
    searchParams.set("dungeon_1profile_id", "0");
    searchParams.set("dungeon_1is_open", "1");
    searchParams.set("dungeon_2name", "不可能存在的地城");
    searchParams.set(
      "profile_data_dungeon_1_profile_data",
      "HogNB0ny8I/FjaOg6FXrzZvwI0A1hZgI77jjRYoCRE26Yi3zTNw4kxlf3EBWtEk1b6aVuW+FUuN8kSMRggg8h3JkxoL2NsUxavZXWRdyOxUUEMX5AKRE3eAUHOs1WJk3"
    );
    searchParams.set(
      "callback_js_code_dungeon_1_callback_js_code",
      "hjeqjpM+qZ3O91mfrGQpvhGIqpJEtjGwgXlmEmXfIQzBrxMpR69Guzy7+7UjXgADJMzqeXDJhCUPVMr4x2KfpOKujjttFf22twLrAnOMemRyC0FkOn1zx6YBUufUkR7Ckg4pf2y/2z74zxDx8svUS6Kwihgpc54Xeb1xFKyGmQQ="
    );
    searchParams.set("dungeon_2level", "99");
    searchParams.set("dungeon_2level_to", "99");
    searchParams.set("dungeon_2level_allowed", "99");
    searchParams.set("dungeon_2level_allowed_to", "99");
    searchParams.set("dungeon_2groupLevel", groupLv);
    searchParams.set("dungeon_2profile_id", "0");
    searchParams.set("dungeon_2is_open", "1");

    searchParams.set("unvisit", "取消探险");
    $btn.text("取消中请稍候...");
    fetch(baseUrl, {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "content-type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      body: searchParams.toString(),
    }).then((resp) => {
      $btn.text("处理完成刷新页面");
      location.reload();
    });
  });
}

/**
 * 战斗耗材预检查
 * @returns
 */
function battlePreCheck() {
  const $nextDungeonDiv = $('.block_inner:contains("下一个地城：")');
  if (!$nextDungeonDiv.length) return;
  const $preCheckBtn = $(
    '<button id="battlePreCheck" class="button clickable" title="耗材检查">耗材检查</button>'
  );
  $nextDungeonDiv.append($preCheckBtn);
  $preCheckBtn.click(function () {
    let $btn = $(this);
    // 1. 获得团员列表
    let baseUrl = location.origin + "/wod/spiel/dungeon/group.php?is_popup=1";
    const searchParams = getBaseSearchParams();
    $btn.text("获取团员列表中...");
    fetch(baseUrl, {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "content-type": "application/x-www-form-urlencoded",
      },
      method: "POST",
      body: searchParams.toString(),
    })
      .then((resp) => {
        return resp.text();
      })
      .then((text) => {
        // 2. 获取所有人装备与耗材检查页面
        $btn.text("分析成员设置中...");
        $("#ajax_editor_container").show();
        $("#ajax_editor_title").append("<span>耗材检查</span>");
        $('<button class="button clickable" title="关闭">关闭</button>')
          .appendTo($("#ajax_editor_buttons"))
          .click(function () {
            $("#ajax_editor_container").hide();
            $(
              "#ajax_editor_title, #ajax_editor_content, #ajax_editor_buttons"
            ).empty();
          });
        $btn.text("耗材检查");
        const $doc = $(text);
        const $heroRows = $doc.find(
          "#smarttabs__members_inner .content_table [class^=row]"
        );
        const searchParams = new URLSearchParams();
        const wodPostId = $doc.find('input[name="wod_post_id"]').val();
        const heroId = $doc.find('input[name="sessionHeroId"]').val();
        const playerId = $doc.find('input[name="session_player_id"]').val();
        searchParams.set("wod_post_id", wodPostId);
        searchParams.set("session_hero_id", heroId);
        searchParams.set("session_player_id", playerId);
        searchParams.set("ajax_class_name", "RenderHeroItemViewer");
        searchParams.set("RenderHeroItemViewer_dialogStatus", "open");
        searchParams.set("ajax", 1);
        $heroRows.each(function () {
          const $row = $(this);
          const itemViewParams = $row
            .find("[id^=HeroItemViewer]")
            .attr("id")
            .replace("HeroItemViewer", "");
          searchParams.set("ajax_object_id", itemViewParams);
          let renderUrl = location.origin + "/wod/ajax/render.php";
          fetch(renderUrl, {
            headers: {
              accept: "*/*",
              "content-type": "application/x-www-form-urlencoded",
              "x-requested-with": "XMLHttpRequest",
            },
            method: "POST",
            body: searchParams.toString(),
          })
            .then((resp) => {
              return resp.text();
            })
            .then((text) => {
              // 3. 将所有检查结果显示在页面上
              const $render = $("<div></div>").append($(`<div>${text}</div>`));
              const $errDiv = $render.find(
                'div[id^="CombatConfigErrorViewer"]'
              );
              const $heroName = $render.find(
                'a[href^="/wod/spiel/hero/profile.php?"]'
              );
              $("#ajax_editor_content")
                .append($heroName)
                .append($errDiv)
                .append("<br>");
            });
        });
      });
  });
}

async function tombolaOnce(params, times) {
  let response = await fetch(
    `${location.origin}/wod/spiel/rewards/tombola.php?is_popup=1`,
    // `${location.origin}?is_popup=1`,
    {
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "content-type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
      method: "POST",
      mode: "cors",
      credentials: "include",
    }
  );
  let text = await response.text();
  const $tombolaProgress = $("#tombolaProgress");
  $tombolaProgress.val(parseInt($tombolaProgress.val()) + 1);
  ajaxAlert(`目前进度：${$tombolaProgress.val()}/${times}`);

  const $jq = $(text);
  const $p = $jq.find(".content_block p:last");
  if ($p.length) {
    $("#tombolaDetailContainer").append($p);
  } else {
    $("#tombolaDetailContainer").append(
      "<p>没有找到获奖信息，请检查彩票是否耗尽或者当日次数已达限制</p>"
    );
  }
  return new Promise((resolve, reject) => {
    resolve(text);
  });
}

async function autoTombola(times) {
  ajaxAlert(`即将开始兑换奖券...`);
  $("#tombolaProgress").val(0);
  $("#tombolaDetailContainer").empty();
  const params = getAllHiddenParams();
  params.set("exec", "和克劳斯.钱袋兑换一张奖券");
  const promiseArr = [];
  for (let i = 0; i < times; i++) {
    promiseArr.push(tombolaOnce(params, times));
  }
  const respArr = await Promise.all(promiseArr);
  _ajaxStopWaiting("ajax_editor");
  ajaxAlert("兑换奖券完毕！");
  setTimeout(function () {
    _ajaxCloseModalDialog("ajax_dialog");
  }, 800);
}

/**
 * 彩票一键N连
 * @returns
 */
function multiTombola() {
  const $drawBtn = $('input[name="exec"][value="和克劳斯.钱袋兑换一张奖券"]');
  if (!$drawBtn.length) return;
  $(
    '<input type="button" name="multiTombola" value="一键50连" class="button clickable">'
  )
    .click(function () {
      if (confirm("是否进行一键50连？")) {
        createTombolaDialog(50);
      }
    })
    .insertAfter($drawBtn);
  $(
    '<input type="button" name="multiTombola" value="一键十连" class="button clickable">'
  )
    .click(function () {
      if (confirm("是否进行一键十连？")) {
        createTombolaDialog(10);
      }
    })
    .insertAfter($drawBtn);
}

function createTombolaDialog(times) {
  const targetId = "ajax_editor";
  _ajaxCreateDialogDirect(
    targetId,
    null,
    "抽奖记录",
    AJAX_YES | AJAX_CLOSE,
    async function (event) {
      if (event == "yes") {
        autoTombola(times);
      } else {
        _ajaxStopWaiting(targetId);
        _ajaxCloseModalDialog("ajax_editor");
      }
    },
    function () {
      document.querySelector("#ajax_editor_buttons button").innerText =
        "再来一次";
      console.log("init");
    }
  );

  _ajaxStartWaiting(targetId);

  $("#ajax_editor_content")
    .append('<input type="hidden" id="tombolaProgress">')
    .append('<div id="tombolaDetailContainer"></div>');
  autoTombola(times);
}

function getAllHiddenParams() {
  const searchParams = new URLSearchParams();
  $("input:hidden").each(function () {
    const $this = $(this);
    searchParams.set($this.attr("name"), $this.val());
  });
  return searchParams;
}

function getBaseSearchParams() {
  const searchParams = new URLSearchParams();
  $("input:hidden").each(function () {
    const $this = $(this);
    const key = $this.attr("name");
    if (baseParams.includes(key)) {
      searchParams.set($this.attr("name"), $this.val());
    }
  });
  return searchParams;
}

function sibebarDungeon() {
  const DUNGEON_LIST_KEY = "dungeonList";
  const DUNGEON_LIST_VERSION = "dungeonListVersion";
  // 每天更新一次地城信息
  let dungeonListStr = localStorage.getItem(DUNGEON_LIST_KEY);
  let dungeonListVer = localStorage.getItem(DUNGEON_LIST_VERSION);
  let dungeonList = {};
  const today = dayjs();
  const todayStr = today.format("YYYYMMDD");
  if (dungeonListStr && dungeonListVer && todayStr == dungeonListVer) {
    dungeonList = JSON.parse(dungeonListStr);
    renderDungeonSelector(dungeonList);
  } else {
    // 获取技能信息
    fetch("https://www.christophero.xyz/wod/dungeon/listCommon", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        if (!(res && res.code === 200)) {
          return;
        }
        const dungeonList = res.data;
        localStorage.setItem(DUNGEON_LIST_KEY, JSON.stringify(dungeonList));
        localStorage.setItem(DUNGEON_LIST_VERSION, todayStr);
        renderDungeonSelector(dungeonList);
      });
  }
}

function renderDungeonSelector(dungeonList) {
  // 将地城划分为常驻和限时地城
  let normalList = [];
  let limitList = [];
  const now = dayjs();
  const heroLv = parseInt($('input[name="stufe"]:hidden').val());
  for (let d of dungeonList) {
    if (d.type == "P" && d.minLevel <= heroLv && d.maxLevel >= heroLv) {
      d.desc = "常";
      normalList.push(d);
    } else if (d.type == "L" && d.minLevel <= heroLv && d.maxLevel >= heroLv) {
      const startTime = dayjs(d.startTime);
      const endTime = dayjs(d.endTime);
      if (startTime.isBefore(now) && endTime.isAfter(now)) {
        d.desc = "今";
        limitList.push(d);
      } else if (
        now.isBefore(startTime) &&
        now.add(7, "hour").isAfter(startTime)
      ) {
        d.desc = "明";
        limitList.push(d);
      }
    }
  }
  // 将地城插入侧边栏
  const $groupCrashBox = $(".gadget.group_cash_box");
  const $fastDungeonContaner = $(`
  <div class="gadget fast_dungeon lang-cn">
    <div class="gadget_inner">
      <div class="gadget_body" style="white-space: normal">
        <div class="block">
          <div class="block_body">
            <div class="background"></div>
            <div class="border-top"></div>
            <div class="border-bottom"></div>
            <div class="block_inner">
              <div class="blockHeadline">
                <a href="/wod/spiel/dungeon/dungeon.php?session_hero_id=115817">
                  <span class="font_Block_Headline">快捷地城</span>
                </a>
              </div>
              <div class="blockParagraph fast_dungeon">
                <div>
                  <label><input type="radio" name="fast_dungeon_type" checked value="normal" />常规</label>
                  <label><input type="radio" name="fast_dungeon_type" value="limit" />限时</label>
                  <button id="gotoTravel" class="button clickable" title="出发">出发</button>
                </div>
                <div>
                  <select name="fast_dungeon_select">
                    <option value="" selected="selected">&nbsp;</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `);
  $groupCrashBox.before($fastDungeonContaner);
  rebuildDungeonSelect("normal", normalList, limitList);
  $fastDungeonContaner
    .find('input[name="fast_dungeon_type"]')
    .change(function () {
      console.log($(this).val());
      rebuildDungeonSelect($(this).val(), normalList, limitList);
    });
  $fastDungeonContaner.find("#gotoTravel").click(function () {
    let dungeonId = $('select[name="fast_dungeon_select"]').val();
    console.log(dungeonId);
    if (!dungeonId) return;
    gotoTravel(dungeonId);
  });
}

function rebuildDungeonSelect(dungeonType, normalList, limitList) {
  let list = dungeonType == "normal" ? normalList : limitList;
  list = list.sort((d1, d2) => {
    let timeDiff = dayjs(d1.startTime).diff(dayjs(d2.startTime));
    let lvDiff = d2.minLevel - d1.minLevel;
    return timeDiff || lvDiff;
  });
  const $select = $('select[name="fast_dungeon_select"]');
  $select
    .empty()
    .append('<option value="" selected="selected">&nbsp;</option>');
  for (let dungeon of list) {
    let name = "";
    if (dungeon.name.startsWith("巨兽讨伐战-")) {
      name = dungeon.name.replace("巨兽讨伐战-", "");
    } else {
      name = dungeon.name.length > 8 ? dungeon.name.substring(0, 4) + "..." +
            dungeon.name.substring(dungeon.name.length - 4)
          : dungeon.name;
    }
    $select.append(
      $("<option>&nbsp;</option>")
        .attr("value", dungeon.sysId)
        .text(`${dungeon.desc}|${name}`)
    );
  }
}

function gotoTravel(sysId) {
  let baseUrl = location.origin + "/wod/spiel/dungeon/dungeon.php?";
  const searchParams = getBaseSearchParams();
  const groupLv = searchParams.get("stufe");
  searchParams.set("TABLE_DEFAULT_SORT_DIR", "DESC");
  searchParams.set("TABLE_DEFAULT_SORT_COL", "7");
  searchParams.set("TABLE_DEFAULT_PAGE", "1");
  searchParams.set("TABLE_DEFAULT_PSNR[1]", "20");
  searchParams.set("TABLE_DEFAULT_PSNR[2]", "20");
  searchParams.set("TABLE_DATED_SORT_DIR", "ASC");
  searchParams.set("TABLE_DATED_SORT_COL", "14");
  searchParams.set("TABLE_DATED_PAGE", "1");

  searchParams.set("dungeon_1name", "不可能存在的地城");
  searchParams.set(
    "profile_data_dungeon_1_profile_data",
    "HogNB0ny8I/FjaOg6FXrzZvwI0A1hZgI77jjRYoCRE27wTAWqILHdEzHicsmJZl6X7ZRBEIW822E5+rsUoHjcPHJM1dTqbJE0c1Ad4c6gLXcUjcGy5WB8H0lm1qobBxf"
  );
  searchParams.set(
    "callback_js_code_dungeon_1_callback_js_code",
    "9hAUpnwetF8TrxnkIxgBdD27k4isavkaEEd/PwhJTLL8yf4MvBsSYedcxPRse51t2x6Aw2bcXKHHlyCszAStN2nnub0CncNJMDrZQePru5mpXW3It99S/D+JypTOewMQ/T9+eXLlhJZ7vK+j9IAKgKVS+EFJPGzy61GBgu60fBk="
  );
  searchParams.set("dungeon_1level", "99");
  searchParams.set("dungeon_1level_to", "99");
  searchParams.set("dungeon_1level_allowed", "99");
  searchParams.set("dungeon_1level_allowed_to", "99");
  searchParams.set("dungeon_1groupLevel", groupLv);
  searchParams.set("dungeon_1profile_id", "0");
  searchParams.set("dungeon_1is_open", "1");
  searchParams.set(`visit[${sysId}]`, "探索");
  searchParams.set("dungeon_2name", "不可能存在的地城");
  searchParams.set(
    "profile_data_dungeon_1_profile_data",
    "HogNB0ny8I/FjaOg6FXrzZvwI0A1hZgI77jjRYoCRE26Yi3zTNw4kxlf3EBWtEk1b6aVuW+FUuN8kSMRggg8h3JkxoL2NsUxavZXWRdyOxUUEMX5AKRE3eAUHOs1WJk3"
  );
  searchParams.set(
    "callback_js_code_dungeon_1_callback_js_code",
    "hjeqjpM+qZ3O91mfrGQpvhGIqpJEtjGwgXlmEmXfIQzBrxMpR69Guzy7+7UjXgADJMzqeXDJhCUPVMr4x2KfpOKujjttFf22twLrAnOMemRyC0FkOn1zx6YBUufUkR7Ckg4pf2y/2z74zxDx8svUS6Kwihgpc54Xeb1xFKyGmQQ="
  );
  searchParams.set("dungeon_2level", "99");
  searchParams.set("dungeon_2level_to", "99");
  searchParams.set("dungeon_2level_allowed", "99");
  searchParams.set("dungeon_2level_allowed_to", "99");
  searchParams.set("dungeon_2groupLevel", groupLv);
  searchParams.set("dungeon_2profile_id", "0");
  searchParams.set("dungeon_2is_open", "1");
  baseUrl += "session_hero_id=" + searchParams.get("session_hero_id");
  ajaxAlert("切换中，请稍候...");
  fetch(baseUrl, {
    headers: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "content-type": "application/x-www-form-urlencoded",
    },
    method: "POST",
    body: searchParams.toString(),
  })
    .then((resp) => {
      // location.replace(location.href);
      return resp.text();
    })
    .then((html) => {
      console.log(html);
      let $curT = $("#gadgetNextdungeonTime");
      if (!$curT.length) {
        // 处理偶尔出现的刷新后英雄变化的问题
        let [baseUrl, params] = location.href.split("?");
        const urlParams = new URLSearchParams(params);
        if (!urlParams.has("session_hero_id")) {
          urlParams.set("session_hero_id", searchParams.get("session_hero_id"));
          params = urlParams.toString();
        }
        location.replace(baseUrl + "?" + params);
        return;
      }
      let $curB = $curT.prevAll("b:first");
      let $curC = $curT.nextAll("div[id^=CombatDungeonConfigSelector]:first");
      let $newT = $(html).find("#gadgetNextdungeonTime");
      let $newB = $newT.prevAll("b:first");
      let $newC = $newT.nextAll("div[id^=CombatDungeonConfigSelector]:first");
      $curT.replaceWith($newT);
      $curB.replaceWith($newB);
      $curC.replaceWith($newC);
      ajaxAlert("已切换！");
      setTimeout(function () {
        _ajaxCloseModalDialog("ajax_dialog");
      }, 800);
    });
}

/**
 * 简易属性控制
 */
function easyAttrVal() {
  const urls = ["/wod/spiel/hero/attributes.php"];
  if (!urls.includes(location.pathname) || location.host.startsWith("zhao")) {
    return;
  }
  // 添加便捷属性
  $(
    '<img src="/wod/css/skins/skin-7/images/icons/reset.gif" style="cursor:pointer;width:20px;height:20px;"/>'
  )
    .insertAfter(
      $('input[name^="improve[at_"], img[src$="icons/steigern_disabled.gif"]')
    )
    .click(async function () {
      const urlParams = getBaseSearchParams();
      let targetVal = prompt("请输入目标数值", 10);
      if (targetVal == null) return;
      targetVal = parseNum(targetVal);
      if (targetVal > 30) {
        alert("目标数值不能大于30！");
        return;
      }
      const attrName = $(this)
        .parents("tr:eq(1)")
        .find("td:first")
        .text()
        .trim();
      ajaxAlert("正在处理，请稍候...");
      await attrChangeBatch(urlParams, attrName, targetVal);
      ajaxAlert("处理完成，即将刷新页面");
      setTimeout(function () {
        _ajaxCloseModalDialog("ajax_dialog");
        location.replace(location.origin + "/wod/spiel/hero/attributes.php");
      }, 800);
    });

  // 添加高手低手全13配置
  const $attrTableTd = $(
    '#main_content h1:contains("属性与特性") +table:first td:first'
  );
  $('<input type="button" value="成为高手" class="button clickable">')
    .appendTo($attrTableTd)
    .click(async function () {
      ajaxAlert("正在处理，请稍候...");
      await allAttrTo(urlParams, 2);
      ajaxAlert("处理完成，即将刷新页面");
      setTimeout(function () {
        _ajaxCloseModalDialog("ajax_dialog");
        location.replace(location.origin + "/wod/spiel/hero/attributes.php");
      }, 800);
    });

  $('<input type="button" value="变成低手" class="button clickable">')
    .appendTo($attrTableTd)
    .click(async function () {
      ajaxAlert("正在处理，请稍候...");
      await allAttrTo(urlParams, 10);
      ajaxAlert("处理完成，即将刷新页面");
      setTimeout(function () {
        _ajaxCloseModalDialog("ajax_dialog");
        location.replace(location.origin + "/wod/spiel/hero/attributes.php");
      }, 800);
    });

  $('<input type="button" value="八徽章" class="button clickable">')
    .appendTo($attrTableTd)
    .click(async function () {
      ajaxAlert("正在处理，请稍候...");
      await allAttrTo(urlParams, 13);
      ajaxAlert("处理完成，即将刷新页面");
      setTimeout(function () {
        _ajaxCloseModalDialog("ajax_dialog");
        location.replace(location.origin + "/wod/spiel/hero/attributes.php");
      }, 800);
    });
}

function easyChangeSkill() {
  const urls = ["/wod/spiel/hero/skills.php"];
  if (!urls.includes(location.pathname) || location.host.startsWith("zhao")) {
    return;
  }
  const urlParams = getBaseSearchParams();
  $(
    '<img src="/wod/css/skins/skin-7/images/icons/reset.gif" style="cursor:pointer;width:20px;height:20px;"/>'
  )
    .insertAfter($('input[id^="button_steigern_"]'))
    .click(async function () {
      const urlParams = getBaseSearchParams();
      let btnId = $(this).prev('input[id^="button_steigern_"]').attr("id");
      const skillId = /button_steigern_(\d+)/.exec(btnId)[1];
      const skillLv =
        parseInt(
          $(this).parents("tr:first").find("div[id^=skill_rang]").text().trim()
        ) || 0;
      let targetVal = prompt("请输入目标技能等级", skillLv);
      if (targetVal == null) return;
      targetVal = parseNum(targetVal);
      changeSkillBatch(skillId, skillLv, targetVal, true);
    });
}

/**
 * 快速变更技能等级
 * @param {*} skillId
 * @param {*} curLv
 * @param {*} targetLv
 * @param {*} force
 * @returns
 */
function changeSkillBatch(skillId, curLv, targetLv, force) {
  if (targetLv > 50 || targetLv < 0) {
    alert("目标技能等级只能在0到50之间！");
    return;
  }
  const diff = Math.abs(targetLv - curLv);
  for (let i = 0; i < diff; i++) {
    change_skill(skillId, curLv > targetLv ? "-" : "+", force);
  }
}

/**
 * 属性变更
 * @param {*} urlParams
 * @param {*} attrName
 * @param {*} improve
 * @returns
 */
async function attrChange(urlParams, attrName, improve) {
  if (!improve) return;
  const pname = `${improve ? "improve" : "undo"}[at_${attrEnMap[attrName]}]`;
  const params = new URLSearchParams(urlParams.toString());
  params.set(pname + ".x", 10);
  params.set(pname + ".y", 10);
  params.set("do_reset", "");
  params.set("levelup_warned", "0");
  params.set("geschlecht", "f");
  params.set("amor_details", "关闭");
  const url = `${
    location.origin
  }/wod/spiel/hero/attributes.php?is_popup=1&session_hero_id=${params.get(
    "session_hero_id"
  )}`;
  const response = await fetch(url, {
    headers: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "content-type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
    method: "POST",
  });
  globalCurSteps++;
  ajaxAlert(`${attrName}变更进度： ${globalCurSteps}/${globalSteps}`);
  return await response.text();
}

/**
 * 属性批量变更
 * @param {*} urlParams
 * @param {*} attrName
 * @param {*} targetVal
 */
async function attrChangeBatch(urlParams, attrName, targetVal) {
  const curVal = getAttrVal(attrName);
  await attrChangeBatchWithInitial(urlParams, attrName, curVal, targetVal);
}

/**
 * 属性批量变更(手动指定初始属性)
 * @param {*} urlParams
 * @param {*} attrName
 * @param {*} curVal
 * @param {*} targetVal
 */
async function attrChangeBatchWithInitial(
  urlParams,
  attrName,
  curVal,
  targetVal
) {
  globalCurSteps = 0;
  globalSteps = Math.abs(targetVal - curVal);
  let improve = true;
  if (curVal > targetVal) {
    improve = false;
  }
  for (let i = 0; i < globalSteps; i++) {
    await attrChange(urlParams, attrName, improve);
  }
}

/**
 * 获得角色属性数值
 * @param {*} attr
 * @returns
 */
function getAttrVal(attr, $context) {
  $context = $context || $(document);
  let val = $context
    .find(`td:contains("${attr}")`)
    .next()
    .find("td:eq(1)")[0]
    .childNodes[0].textContent.trim();
  val = parseInt(val);
  return val;
}

function parseNum(numStr) {
  let num = 1;
  try {
    num = parseInt(numStr);
  } catch (ex) {
    num = 1;
  }
  if (isNaN(num) || num < 0) {
    num = 1;
  }
  return num;
}

// 导入英雄模版
function importHeroTemplate() {
  // 只在技能页面生效
  const urls = ["/wod/spiel/hero/skills.php"];
  if (!urls.includes(location.pathname) || location.host.startsWith("zhao")) {
    return;
  }
  // 技能列表页面添加导入英雄模版按钮
  const $btn = $(
    '<button class="button clickable" type="button">导入英雄模版</button>'
  )
    .insertBefore('input[name="hide_all"]')
    .click(async function () {
      const urlParams = getBaseSearchParams();
      // 1. 获取人物卡
      // 2. 分析人物卡
      // 3. 获取8属性数值
      // 4. 比较属性差异，升级或者降级属性
      // 5. 比较技能差异，升级或者降级技能

      createInputHeroCardDialog(urlParams, analyseHeroCard);
    });
}

function createInputHeroCardDialog(urlParams, callback) {
  const targetId = "ajax_editor";
  const innerHtml =
    '<div id="heroCardContainer" contentEditable="true" style="height: 100%;"></div>';
  _ajaxCreateDialogDirect(
    targetId,
    innerHtml,
    "请在下方输入人物卡，不要有多余文本",
    AJAX_YES | AJAX_CLOSE,
    async function (event) {
      if (event == "yes") {
        let heroCard = document.getElementById("heroCardContainer").textContent;
        callback(urlParams, heroCard);
      } else {
        _ajaxStopWaiting(targetId);
        _ajaxCloseModalDialog("ajax_editor");
      }
    },
    function () {
      console.log("init");
      document.querySelector("#ajax_editor_buttons button").innerText = "导入";
    }
  );
}

async function analyseHeroCard(urlParams, heroCard) {
  try {
    heroCard = heroCard
      .replace(/\[\d+\]/g, "")
      .replace(/:g\w:/g, "")
      .replace(/\[test\]/g, "")
      .replace(/\[clone\]/g, "")
      .replace(/\[/g, "<")
      .replace(/\]/g, ">")
      .replace(/[\r\n]/g, "")
      .replace(
        /<skill:\s*(.+?)\s*>/g,
        (fullHtml, skillName) => `<skill>${skillName}</skill>`
      )
      .replace(
        /<item:\s*(.+?)\s*>/g,
        (fullHtml, itemName) => `<item>${itemName}</item>`
      )
      .replace(/color=orange/g, "orange");
  } catch (error) {
    ajaxAlert("浏览器版本过低，不能使用replaceAll函数");
    return;
  }
  let $heroCard;
  try {
    $heroCard = $(heroCard);
  } catch (error) {
    ajaxAlert("人物卡格式可能存在问题，不能正确分析");
    return;
  }
  const attrNameList = Object.keys(attrEnMap);
  ajaxAlert("1. 分析人物卡属性清单");
  // 获取属性清单
  const targetAttrMap = {};
  $heroCard
    .find(attrNameList.map((attr) => `orange:contains("${attr}")`).join(","))
    .each(function (i, e) {
      const attrVal = $(e).parent().next().text();
      const attrName = e.textContent;
      targetAttrMap[attrName] = parseInt(attrVal);
    });
  ajaxAlert("2. 分析人物卡技能清单");
  // 获取技能等级一览
  const skillLvMap = {};
  $heroCard.find("skill").each(function (i, e) {
    const skillLv = $(e).parent().next().text();
    const skillName = e.textContent;
    skillLvMap[skillName] = parseInt(skillLv);
  });
  ajaxAlert("3. 分析人物卡装备清单");
  // 获取装备物品一览
  const equipItems = [];
  $heroCard.find("item").each((i, e) => equipItems.push(e.textContent));
  console.log(targetAttrMap);
  console.log(skillLvMap);
  console.log(equipItems);

  if (confirm("是否使属性保持一致(注意不会使用重置点进行属性回退)？")) {
    const currentAttrMap = await getHeroAttrs(urlParams);
    ajaxAlert("4. 开始进行属性变更");
    // 变更属性
    for (let attrName of attrNameList) {
      await attrChangeBatchWithInitial(
        urlParams,
        attrName,
        currentAttrMap[attrName],
        targetAttrMap[attrName]
      );
    }
  }

  ajaxAlert("5. 开始变更当前技能等级");
  // 变更页面上的技能等级
  for (let skillName of Object.keys(skillLvMap)) {
    const $skillAnchor = $(
      `a[href^="/wod/spiel/hero/skill.php"]:contains("${skillName}")`
    );
    if (!$skillAnchor.length) continue;
    const $skillRang = $skillAnchor
      .parent("td:first")
      .next()
      .find('[id^="skill_rang_"]');
    if (!$skillRang.length) continue;
    const skillId = $skillRang.attr("id").replace("skill_rang_", "");
    const skillLv = parseInt($skillRang.text().trim()) || 0;
    changeSkillBatch(skillId, skillLv, skillLvMap[skillName], true);
  }
  ajaxAlert("处理完毕！");
  setTimeout(function () {
    _ajaxStopWaiting("ajax_editor");
  }, 800);
}

async function getHeroAttrs(urlParams) {
  ajaxAlert("正在获取英雄当前属性");
  const shId = urlParams.get("session_hero_id");
  const url =
    location.origin +
    "/wod/spiel/hero/attributes.php?is_popup=1&session_hero_id=" +
    shId;
  const response = await fetch(url, {
    headers: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "content-type": "application/x-www-form-urlencoded",
    },
    body: urlParams.toString(),
    method: "POST",
  });
  const text = await response.text();
  const $context = $(text);
  const attrMap = {
    力量: getAttrVal("力量", $context),
    体质: getAttrVal("体质", $context),
    智力: getAttrVal("智力", $context),
    灵巧: getAttrVal("灵巧", $context),
    魅力: getAttrVal("魅力", $context),
    敏捷: getAttrVal("敏捷", $context),
    感知: getAttrVal("感知", $context),
    意志: getAttrVal("意志", $context),
  };
  console.log(attrMap);
  ajaxAlert(
    `英雄当前属性已获取：<br>
    力量：${attrMap["力量"]}<br>
    体质：${attrMap["体质"]}<br>
    智力：${attrMap["智力"]}<br>
    灵巧：${attrMap["灵巧"]}<br>
    魅力：${attrMap["魅力"]}<br>
    敏捷：${attrMap["敏捷"]}<br>
    感知：${attrMap["感知"]}<br>
    意志：${attrMap["意志"]}`
  );
  return attrMap;
}

/**
 * 批量删除设置
 */
function batchDelProfile() {
  // 只在技能页面生效
  const urls = ["/wod/spiel/hero/skillconfig.php"];
  if (!urls.includes(location.pathname)) {
    return;
  }
  $('<input type="button" value="批量删除">')
    .insertAfter('input[value="删除"]')
    .click(function () {
      const urlParams = getBaseSearchParams();
      urlParams.set("SELECTED_TAB", $('input[name="SELECTED_TAB"]').val());
      urlParams.set("SELECTED_LVL", $('input[name="SELECTED_LVL"]').val());
      urlParams.set("SELECTED_DUEL", $('input[name="SELECTED_DUEL"]').val());
      urlParams.set("fig_type", $('input[name="fig_type"]').val());
      urlParams.set("fig_id", $('input[name="fig_id"]').val());
      urlParams.set("world", $('input[name="world"]').val());
      urlParams.set("orig_profile", $('input[name="orig_profile"]').val());
      urlParams.set("is_popup", "1");
      urlParams.set("action", "delete");
      createDelProfileDialog(urlParams);
    });
}

function createDelProfileDialog(urlParams) {
  const targetId = "ajax_editor";
  const innerHtml =
    '<div id="delProfileContainer" style="height: 100%;"></div>';
  _ajaxCreateDialogDirect(
    targetId,
    innerHtml,
    "请勾选需要删除的设置(默认和决斗不在此列)",
    AJAX_YES | AJAX_CLOSE,
    async function (event) {
      if (event == "yes") {
        console.log($('input:checked[id^="profile_"]'));
        const profileList = $('input:checked[id^="profile_"]')
          .map((i, e) => e.value)
          .get();
        if (!profileList.length) {
          ajaxAlert(`没有勾选任何设置！`);
          setTimeout(function () {
            _ajaxStopWaiting(targetId);
          });
          return;
        }
        if (confirm(`是否删除这${profileList.length}条设置？`)) {
          globalCurSteps = 0;
          globalSteps = profileList.length;
          let promiseArr = [];
          for (const profileId of profileList) {
            promiseArr.push(delProfile(urlParams, profileId));
          }
          ajaxAlert(`删除进度：${globalCurSteps}/${globalSteps}`);
          Promise.all(promiseArr).then((responseArr) => {
            _ajaxStopWaiting(targetId);
            ajaxAlert(`删除完成，即将刷新页面`);
            setTimeout(function () {
              location.replace(
                location.origin + "/wod/spiel/hero/skillconfig.php"
              );
            }, 800);
          });
        } else {
          setTimeout(function () {
            _ajaxStopWaiting(targetId);
          });
        }
      } else {
        _ajaxStopWaiting(targetId);
        _ajaxCloseModalDialog("ajax_editor");
      }
    },
    function () {
      console.log("init");
      document.querySelector("#ajax_editor_buttons button").innerText =
        "开始删除";
      const $container = $("#delProfileContainer");
      for (let option of THE_ORDERS.profileDropdown.options) {
        const userObj = option.userObject;
        if (userObj.active || userObj.id < 1) continue;
        $container.append(
          `<input type="checkbox" value="${userObj.id}" id="profile_${userObj.id}"/><label for="profile_${userObj.id}">${userObj.name}</label><br>`
        );
      }
    }
  );
}

async function delProfile(urlParams, profileId) {
  const shId = urlParams.get("session_hero_id");
  const url =
    location.origin +
    "/wod/spiel/hero/skillconfig.php?is_popup=1&session_hero_id=" +
    shId;
  urlParams.set("profile", profileId);
  const response = await fetch(url, {
    headers: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "content-type": "application/x-www-form-urlencoded",
    },
    body: urlParams.toString(),
    method: "POST",
  });
  globalCurSteps++;
  ajaxAlert(`删除进度：${globalCurSteps}/${globalSteps}`);
  return response.text();
}

function batchChangeOwner() {
  // 只在物品列表页面生效
  const urls = ["/wod/spiel/hero/items.php"];
  if (!urls.includes(location.pathname)) {
    return;
  }
  // 没找到拥有者则退出
  let $itemOwnerSelect = $(
    'select[name="item_4owner"],select[name="item_5owner"],select[name="item_6owner"]'
  );
  if (!$itemOwnerSelect.length) {
    return;
  }
  const $changeOwnerBtn = $(
    '<button type="button" class="button clickable" title="变更物品归属">变更物品归属</button>'
  )
    .insertAfter($('input[value="应用改动"]'))
    .click(function () {
      createChangeOwnerDialog($itemOwnerSelect);
    });
}

function createChangeOwnerDialog($itemOwnerSelect) {
  const pageSize = 20;
  let idx = $itemOwnerSelect
    .prop("name")
    .replace("item_", "")
    .replace("owner", "");
  const urlParams = getBaseSearchParams();
  urlParams.set("ok", "应用改动");
  urlParams.set("IS_POPUP", 1);
  urlParams.set(
    "pay_from_group_cash_box",
    $('input[name="pay_from_group_cash_box"]').val()
  );
  urlParams.set("put_purchases_to", $('input[name="put_purchases_to"]').val());
  urlParams.set("view", $('input[name="view"]').val());
  urlParams.set("common_cellar", $('input[name="common_cellar"]').val());
  urlParams.set("marketview", $('input[name="marketview"]').val());
  urlParams.set("ITEMS_KELLER_SORT_DIR", "ASC");
  urlParams.set("ITEMS_KELLER_SORT_COL", 2);
  urlParams.set("ITEMS_KELLER_PAGE", 1);
  urlParams.set(`item_${idx}name`, $(`input[name="item_${idx}name"]`).val());
  urlParams.set(
    `profile_data_item_${idx}_profile_data`,
    $(`input[name="profile_data_item_${idx}_profile_data"]`).val()
  );
  urlParams.set(
    `callback_js_code_item_${idx}_callback_js_code`,
    $(`input[name="callback_js_code_item_${idx}_callback_js_code"]`).val()
  );
  urlParams.set(`item_${idx}hero_class`, 0);
  urlParams.set(`item_${idx}hero_race`, 0);
  urlParams.set(`item_${idx}location`, "");
  urlParams.set(`item_${idx}unique`, "");
  urlParams.set(`item_${idx}bonus_attr`, "NULL");
  urlParams.set(`item_${idx}item_class`, 0);
  urlParams.set(`item_${idx}any_skill`, 0);
  urlParams.set(`item_${idx}skill`, "");
  urlParams.set(`item_${idx}any_skillclass`, 0);
  urlParams.set(`item_${idx}set`, 0);
  urlParams.set(`item_${idx}item_condition`, 0);
  urlParams.set(`item_${idx}sockets`, "NULL");
  urlParams.set(`item_${idx}item_conditionMax`, 6);
  urlParams.set(`item_${idx}usage_item`, "");
  urlParams.set(`item_${idx}hero_level_enabled_posted`, 1);
  urlParams.set(`item_${idx}hero_level`, 40);
  urlParams.set(`item_${idx}hero_level_stored`, 40);
  urlParams.set(`item_${idx}group_item`, "");
  urlParams.set(`item_${idx}attribute_name`, "eff_at_st");
  urlParams.set(`item_${idx}attribute_value`, "");
  urlParams.set(`item_${idx}profile_id`, 0);
  urlParams.set(`item_${idx}is_open`, 1);
  urlParams.set(`ITEMS_KELLER_JPNR[1]:`, 1);
  urlParams.set(`ITEMS_KELLER_PSNR[1]`, pageSize);
  urlParams.set(`dummy`, "");
  urlParams.set(`ITEMS_KELLER_JPNR[2]:`, 1);
  urlParams.set(`ITEMS_KELLER_PSNR[2]`, pageSize);
  $itemOwnerSelect = $itemOwnerSelect.clone().attr("id", "owner-select");
  $itemOwnerSelect[0].removeChild($itemOwnerSelect.find(".option_")[0]);
  $itemOwnerSelect[0].removeChild(
    $itemOwnerSelect.find(
      `option[value="${urlParams.get("session_hero_id")}"]`
    )[0]
  );
  const targetId = "ajax_dialog";
  const innerHtml = $itemOwnerSelect.prop("outerHTML");
  _ajaxCreateDialogDirect(
    targetId,
    innerHtml,
    "请选择需要转移物品归属的拥有者",
    AJAX_YES | AJAX_CLOSE,
    async function (event) {
      if (event == "yes") {
        let targetVal = prompt("请输入转移物品数量", 1000);
        if (targetVal == null) return;
        targetVal = parseNum(targetVal);
        if (targetVal < 0) {
          alert("目标数值不能小于0");
          return;
        }
        urlParams.set(`item_${idx}owner`, $("#owner-select").val());
        let goLagerArr = [];
        let goBackArr = [];
        let remainCnt = targetVal;
        while (remainCnt) {
          const lastGoLagerArr = [...goLagerArr];
          goLagerArr = await changItemsOwner(urlParams, goLagerArr, goBackArr);
          goBackArr = lastGoLagerArr;
          if (remainCnt <= 0 || goLagerArr.length == 0) break;
          remainCnt -= goLagerArr.length;
          ajaxAlert(`处理进度：${targetVal - remainCnt}/${targetVal}`);
        }
        await changItemsOwner(urlParams, [], goBackArr);
        ajaxAlert("处理完成！");
      } else {
        _ajaxStopWaiting(targetId);
        _ajaxCloseModalDialog(targetId);
      }
    },
    function () {
      document.querySelector(`#${targetId}_buttons button`).innerText = "确定";
    }
  );
}

async function changItemsOwner(urlParams, goLagerArr, goBackArr) {
  const params = new URLSearchParams(urlParams.toString());
  const shId = urlParams.get("session_hero_id");
  const goWhere = urlParams.get("backWhere");
  for (let id of goLagerArr) {
    params.set(id, "go_lager");
  }
  for (let id of goBackArr) {
    params.set(id, goWhere);
  }
  const url =
    location.origin +
    "/wod/spiel/hero/items.php?is_popup=1&session_hero_id=" +
    shId;
  const response = await fetch(url, {
    headers: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "content-type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
    method: "POST",
  });
  const text = await response.text();
  const $context = $(text);
  const $firstOption = $context.find(
    'select[name^=EquipItem] option[value^="-go"]:first'
  );
  if ($firstOption.length) {
    const backWhere = $firstOption.val().replace("-", "");
    urlParams.set("backWhere", backWhere);
  }
  return $context
    .find("select[name^=EquipItem]")
    .filter((i, e) => $(e).find("option[value*=go_group]").length)
    .map((i, e) => e.name)
    .get();
}

function viewFullScreen() {
  const $fcBtn = $(
    '<button type="button" class="button" style="position: absolute;right: 0;top: 0;">切换全屏</button>'
  );
  const $main = $("#main_content");
  GM_addStyle(`div#main_content:fullscreen {overflow: scroll;}`);
  $fcBtn.prependTo($main).click(function () {
    const isFullscreen =
      document.fullScreen ||
      document.mozFullScreen ||
      document.webkitIsFullScreen;
    if (isFullscreen) {
      exitFullScreen($main[0]);
    } else {
      fullScreen($main[0]);
    }
  });
}

function fullScreen(el) {
  let rfs =
    el.requestFullScreen ||
    el.webkitRequestFullScreen ||
    el.mozRequestFullScreen ||
    el.msRequestFullScreen;
  $(el).css("overflow", "scroll");
  if (typeof rfs != "undefined" && rfs) {
    rfs.call(el);
    return;
  }
  if (typeof window.ActiveXObject != "undefined") {
    const wscript = new ActiveXObject("WScript.Shell");
    if (wscript) {
      wscript.SendKeys("{F11}");
    }
  }
}
// 定义退出全屏
function exitFullScreen() {
  const el = document;
  const cfs =
    el.cancelFullScreen ||
    el.webkitCancelFullScreen ||
    el.mozCancelFullScreen ||
    el.exitFullScreen;
  $(el).css("overflow", "unset");
  if (typeof cfs != "undefined" && cfs) {
    cfs.call(el);
    return;
  }
  if (typeof window.ActiveXObject != "undefined") {
    const wscript = new ActiveXObject("WScript.Shell");
    if (wscript != null) {
      wscript.SendKeys("{F11}");
    }
  }
}

let totalPage = 0;
let currentPage = 0;

function autoCleanWarehouse() {
  // 只在物品列表页面生效
  const urls = ["/wod/spiel/hero/items.php"];
  if (!urls.includes(location.pathname)) {
    return;
  }
  const view = $('input[name="view"]').val();
  if (!["cellar", "groupcellar_2"].includes(view)) return;
  let pagePrefix = "GROUPCELLAR";
  if (view === "groupcellar_2") {
    pagePrefix = "GROUPCELLAR";
  } else if (view === "cellar") {
    pagePrefix = "KELLER";
  }
  const $cleanWarehouseBtn = $(
    '<button type="button" class="button clickable" title="按指定规则自动清仓">自动清仓</button>'
  )
    .insertAfter($('input[value="应用改动"]'))
    .click(async function () {
      // 1. 获取第一页内容，并且获得总页数
      // 2. 遍历所有页，获得物品列表，目前只清理耗材，生成类似下面的数据结构
      // {冰晶:[{cnt: 30, id: 10}, {cnt: 45, id: 12}], 硫磺: [{cnt: 30, id: 21}, {cnt: 45, id: 22}]}
      // 3. 将物品按剩余次数从小向下排序，增加合计，然后按照预设的清仓数量从小到大进行标记
      // 4. 将所有标记的数据提取到列表中，然后200个一组依次出售
      ajaxAlert(`处理开始，请稍候...`);
      totalPage = 1;
      currentPage = 0;
      let firstPage = await fetchConsumablesPage(1, pagePrefix);
      let coll = {};
      let $doc = $(firstPage);
      totalPage = $doc
        .find(`input[name^="ITEMS_${pagePrefix}_PAGE"]:last`)
        .val()
        .trim();
      buildColl(coll, firstPage);
      const promiseArr = [];
      for (let pageIndex = 2; pageIndex <= totalPage; pageIndex++) {
        promiseArr.push(fetchConsumablesPage(pageIndex, pagePrefix));
      }
      Promise.all(promiseArr).then(async (textArr) => {
        for (let text of textArr) {
          buildColl(coll, text);
        }
        console.log(coll);
        ajaxAlert(`已分析全部数据，开始出售物品！`);

        const settings = loadCleanWarehouseSettings();
        if (!settings) {
          ajaxAlert(`没有预设清仓列表，请设置后重试`);
          return;
        }
        let keepMap = settings["normal"];
        let sellList = [];
        for (let name of Object.keys(keepMap)) {
          if (!coll[name]) continue;
          const curTotal = coll[name].total || 0;
          const max = keepMap[name];
          if (curTotal <= max) continue;
          const sellCnt = curTotal - max;
          let markedCnt = 0;
          for (let item of coll[name].list) {
            markedCnt += item.cnt;
            if (markedCnt <= sellCnt) {
              sellList.push(item);
            } else {
              break;
            }
          }
        }
        console.log(sellList);

        const chunkSellList = _.chunk(sellList, 200);

        for (let i = 0; i < chunkSellList.length; i++) {
          let list = chunkSellList[i];
          ajaxAlert(`出售进度：${i}/${chunkSellList.length}`);
          await sellItems(
            list.map((i) => i.id),
            pagePrefix
          );
        }
        ajaxAlert(`处理完成！`);
      });
    });
}

/**
 * 根据类型和页数获取消耗品列表
 * @param {*} pageIndex
 * @param {*} type
 */
async function fetchConsumablesPage(pageIndex, pagePrefix) {
  const pageSize = 200;
  let idx = 5;
  if (pagePrefix === "GROUPCELLAR") {
    idx = 5;
  } else if (pagePrefix === "KELLER") {
    idx = 4;
  }
  const urlParams = getBaseSearchParams();
  const shId = urlParams.get("session_hero_id");
  urlParams.set("IS_POPUP", 1);
  urlParams.set(
    "pay_from_group_cash_box",
    $('input[name="pay_from_group_cash_box"]').val()
  );
  urlParams.set("put_purchases_to", $('input[name="put_purchases_to"]').val());
  urlParams.set("view", $('input[name="view"]').val());
  urlParams.set("common_cellar", $('input[name="common_cellar"]').val());
  urlParams.set("marketview", $('input[name="marketview"]').val());
  urlParams.set(`ITEMS_${pagePrefix}_SORT_DIR`, "ASC");
  urlParams.set(`ITEMS_${pagePrefix}_SORT_COL`, 2);
  urlParams.set(`ITEMS_${pagePrefix}_PAGE`, 1);
  urlParams.set(`item_${idx}name`, $(`input[name="item_${idx}name"]`).val());
  urlParams.set(
    `profile_data_item_${idx}_profile_data`,
    $(`input[name="profile_data_item_${idx}_profile_data"]`).val()
  );
  urlParams.set(
    `callback_js_code_item_${idx}_callback_js_code`,
    $(`input[name="callback_js_code_item_${idx}_callback_js_code"]`).val()
  );
  urlParams.set(`item_${idx}hero_class`, 0);
  urlParams.set(`item_${idx}hero_race`, 0);
  urlParams.set(`item_${idx}location`, "");
  urlParams.set(`item_${idx}unique`, "");
  urlParams.set(`item_${idx}bonus_attr`, "NULL");
  urlParams.set(`item_${idx}item_class`, 0);
  urlParams.set(`item_${idx}any_skill`, 0);
  urlParams.set(`item_${idx}skill`, "");
  urlParams.set(`item_${idx}any_skillclass`, 0);
  urlParams.set(`item_${idx}set`, 0);
  urlParams.set(`item_${idx}item_condition`, 0);
  urlParams.set(`item_${idx}sockets`, "NULL");
  urlParams.set(`item_${idx}item_conditionMax`, 6);
  urlParams.set(`item_${idx}usage_item`, "yes");
  urlParams.set(`item_${idx}hero_level_enabled_posted`, 1);
  urlParams.set(`item_${idx}hero_level`, 40);
  urlParams.set(`item_${idx}hero_level_stored`, 40);
  urlParams.set(`item_${idx}group_item`, "no");
  urlParams.set(`item_${idx}attribute_name`, "eff_at_st");
  urlParams.set(`item_${idx}attribute_value`, "");
  urlParams.set(`item_${idx}profile_id`, 0);
  urlParams.set(`item_${idx}is_open`, 1);
  urlParams.set(`dummy`, "");
  urlParams.set(`ITEMS_${pagePrefix}_PAGE[${pageIndex}]:`, pageIndex);
  urlParams.set(`ITEMS_${pagePrefix}_JPNR[1]:`, 1);
  urlParams.set(`ITEMS_${pagePrefix}_PSNR[1]`, pageSize);
  urlParams.set(`ITEMS_${pagePrefix}_JPNR[2]:`, 1);
  urlParams.set(`ITEMS_${pagePrefix}_PSNR[2]`, pageSize);
  const url =
    location.origin +
    "/wod/spiel/hero/items.php?is_popup=1&session_hero_id=" +
    shId;
  const response = await fetch(url, {
    headers: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "content-type": "application/x-www-form-urlencoded",
    },
    body: urlParams.toString(),
    method: "POST",
  });
  const text = await response.text();
  currentPage++;
  ajaxAlert(`目前进度：${currentPage}/${totalPage}`);
  return text;
}

/**
 * 构建物品映射
 * @param {*} coll
 * @param {*} text
 */
function buildColl(coll, text) {
  let $doc = $(text);
  $doc.find('a[href^="/wod/spiel/hero/item.php?"]').each(function (i, e) {
    const $e = $(e);
    const name = $e.text();
    const text = $e.parent().text();
    const reResult = text.match(/(.+)\((\d+)\/(\d+)\)/);
    if (!reResult) {
      console.error(text);
      return;
    }
    const url = $e.attr("href");
    const searchParams = new URLSearchParams(url.split("?")[1]);
    const itemId = searchParams.get("item_instance_id");
    const count = parseInt(reResult[2]);
    const max = parseInt(reResult[3]);
    console.log(
      `【${name}】: ${reResult[2]}/${reResult[3]}  with ID: ${itemId}`
    );
    if (!coll[name]) {
      coll[name] = {
        total: count,
        list: [{ cnt: count, id: itemId, name, max }],
      };
    } else {
      coll[name].total += count;
      coll[name].list.push({ cnt: count, id: itemId, name, max });
    }
  });
}

/**
 * 出售物品
 * @param {*} itemIds
 * @param {*} pagePrefix
 * @returns
 */
async function sellItems(itemIds, pagePrefix) {
  const pageSize = 200;
  let idx = 5;
  if (pagePrefix === "GROUPCELLAR") {
    idx = 5;
  } else if (pagePrefix === "KELLER") {
    idx = 4;
  }
  const urlParams = getBaseSearchParams();
  const shId = urlParams.get("session_hero_id");
  urlParams.set("IS_POPUP", 1);
  urlParams.set(
    "pay_from_group_cash_box",
    $('input[name="pay_from_group_cash_box"]').val()
  );
  urlParams.set("put_purchases_to", $('input[name="put_purchases_to"]').val());
  urlParams.set("view", $('input[name="view"]').val());
  urlParams.set("common_cellar", $('input[name="common_cellar"]').val());
  urlParams.set("marketview", $('input[name="marketview"]').val());
  urlParams.set(`ITEMS_${pagePrefix}_SORT_DIR`, "ASC");
  urlParams.set(`ITEMS_${pagePrefix}_SORT_COL`, 2);
  urlParams.set(`ITEMS_${pagePrefix}_PAGE`, 1);
  urlParams.set(`item_${idx}name`, "不可能存在的物品");
  urlParams.set(
    `profile_data_item_${idx}_profile_data`,
    $(`input[name="profile_data_item_${idx}_profile_data"]`).val()
  );
  urlParams.set(
    `callback_js_code_item_${idx}_callback_js_code`,
    $(`input[name="callback_js_code_item_${idx}_callback_js_code"]`).val()
  );
  urlParams.set(`item_${idx}hero_class`, 0);
  urlParams.set(`item_${idx}hero_race`, 0);
  urlParams.set(`item_${idx}location`, "");
  urlParams.set(`item_${idx}unique`, "");
  urlParams.set(`item_${idx}bonus_attr`, "NULL");
  urlParams.set(`item_${idx}item_class`, 0);
  urlParams.set(`item_${idx}any_skill`, 0);
  urlParams.set(`item_${idx}skill`, "");
  urlParams.set(`item_${idx}any_skillclass`, 0);
  urlParams.set(`item_${idx}set`, 0);
  urlParams.set(`item_${idx}item_condition`, 0);
  urlParams.set(`item_${idx}sockets`, "NULL");
  urlParams.set(`item_${idx}item_conditionMax`, 6);
  urlParams.set(`item_${idx}usage_item`, "yes");
  urlParams.set(`item_${idx}hero_level_enabled_posted`, 1);
  urlParams.set(`item_${idx}hero_level`, 40);
  urlParams.set(`item_${idx}hero_level_stored`, 40);
  urlParams.set(`item_${idx}group_item`, "no");
  urlParams.set(`item_${idx}attribute_name`, "eff_at_st");
  urlParams.set(`item_${idx}attribute_value`, "");
  urlParams.set(`item_${idx}profile_id`, 0);
  urlParams.set(`item_${idx}is_open`, 1);
  urlParams.set(`dummy`, "");
  urlParams.set(`ITEMS_${pagePrefix}_PAGE[1]:`, 1);
  urlParams.set(`ITEMS_${pagePrefix}_JPNR[1]:`, 1);
  urlParams.set(`ITEMS_${pagePrefix}_PSNR[1]`, pageSize);
  urlParams.set(`ITEMS_${pagePrefix}_JPNR[2]:`, 1);
  urlParams.set(`ITEMS_${pagePrefix}_PSNR[2]`, pageSize);
  urlParams.set(`sellids`, itemIds.join(","));
  urlParams.set(`sellconfirm`, "   OK   ");

  const url =
    location.origin +
    "/wod/spiel/hero/items.php?is_popup=1&session_hero_id=" +
    shId;
  const response = await fetch(url, {
    headers: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "content-type": "application/x-www-form-urlencoded",
    },
    body: urlParams.toString(),
    method: "POST",
  });
  const text = await response.text();
  return text;
}

const CLEAN_WARE_HOUSE_KEY = "cleanWareHouseSettings";
/**
 * 加载设置
 */
function loadCleanWarehouseSettings() {
  let settings = {};
  const textSettings = localStorage.getItem(CLEAN_WARE_HOUSE_KEY);
  if (!textSettings) {
    settings = JSON.parse(JSON.stringify(defaultMap));
  } else {
    settings = JSON.parse(textSettings);
  }
  return settings;
}
