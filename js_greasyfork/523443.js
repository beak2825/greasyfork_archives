// ==UserScript==
// @name         xivanalysis-zh
// @name:zh      xivanalysis 中文补全
// @namespace    http://tanimodori.com/
// @version      0.0.4
// @description  Fill in the missing Chinese translations for xivanalysis 
// @description:zh 为 xivanalysis 填补缺失的中文翻译
// @author       Tanimodori
// @match        https://xivanalysis.com/*
// @include      https://xivanalysis.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523443/xivanalysis-zh.user.js
// @updateURL https://update.greasyfork.org/scripts/523443/xivanalysis-zh.meta.js
// ==/UserScript==
(function() {
  "use strict";
  const origFetch = window.fetch;
  const injectFetch = (injector) => {
    window.fetch = async (...args) => {
      let response = await origFetch(...args);
      try {
        const pkg = {
          url: args[0].toString(),
          response,
          json: await response.clone().json()
        };
        response = await injector(pkg);
      } catch (err) {
        console.error(err);
      }
      return response;
    };
  };
  const injectedStyle = "span.alternative {\r\n  background-color: rgba(255, 255, 255, 0.1);\r\n  cursor: pointer;\r\n  text-decoration: underline;\r\n}\r\n\r\nspan.highlight {\r\n  color: rgba(255, 123, 26, 1);\r\n}\r\n\r\nspan.highlight-yellow {\r\n  color: rgba(255, 255, 102, 1);\r\n}\r\n\r\nspan.highlight-green {\r\n  color: rgba(0, 204, 34, 1);\r\n}\r\n";
  const incrementAltContainer = (container, increment) => {
    const alts = container.querySelectorAll("span.alternative");
    const length = alts.length;
    let index = parseInt(container.style.getPropertyValue("--display-nth"));
    if (isNaN(index)) {
      index = increment;
    } else {
      index = (index + increment) % length;
    }
    container.style.setProperty("--display-nth", index.toString());
    for (let i = 0; i < length; i++) {
      const alt = alts[i];
      if (alt instanceof HTMLElement) {
        alt.style.display = i === index ? "inline" : "none";
      }
    }
  };
  const injectWindowElement = (node) => {
    const applyToContainers = () => {
      const altContainers = node.querySelectorAll("div span.alternative-container");
      for (const altContainer of altContainers) {
        incrementAltContainer(altContainer, 0);
      }
    };
    applyToContainers();
    const observer = new MutationObserver(applyToContainers);
    observer.observe(node, { attributes: true, attributeFilter: ["class"], childList: true, subtree: true });
    node.addEventListener("click", (event) => {
      let target = event.target;
      while (target instanceof HTMLElement) {
        if (target.tagName.toLowerCase() === "span" && target.classList.contains("alternative")) {
          const container = target.parentElement;
          incrementAltContainer(container, 1);
          break;
        }
        target = target.parentElement;
      }
    });
  };
  const injectWindow = () => {
    window.addEventListener("load", () => {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.addedNodes.length === 0) {
            return;
          }
          const node = mutation.addedNodes[0];
          if (node.tagName.toLowerCase() === "div" && node.id.toLowerCase() !== "root" && node.style.position.toLowerCase() === "absolute" && node.style.top.toLowerCase() === "0px" && node.style.left.toLowerCase() === "0px") {
            injectWindowElement(node);
          }
        });
      });
      observer.observe(document.body, { attributes: true, childList: true, subtree: false });
    });
  };
  const injectCss = () => {
    const styleSheet = document.createElement("style");
    styleSheet.setAttribute("type", "text/css");
    styleSheet.innerHTML = injectedStyle;
    document.head.appendChild(styleSheet);
  };
  const injectStyle = () => {
    injectCss();
    injectWindow();
  };
  const actionCatagoryPolyfill = {
    1: "自动攻击",
    2: "魔法",
    3: "战技",
    4: "能力",
    5: "道具",
    6: "采集能力",
    7: "制作能力",
    8: "任务",
    9: "极限技",
    10: "系统",
    11: "系统",
    12: "坐骑",
    13: "特殊技能",
    14: "道具操作",
    15: "极限技",
    16: "",
    17: "弩炮"
  };
  const addonTextPolyfill = {
    699: "即时",
    701: "咏唱时间",
    702: "复唱时间",
    703: "复唱工次",
    704: "消耗体力",
    705: "消耗魔力",
    706: "消耗技力",
    707: "消耗制作力",
    708: "消耗采集力",
    709: "距离",
    710: "范围",
    711: "习得条件：",
    712: "适应职业："
  };
  const classJobPolyfill = {
    0: ["冒险者", "ADV", ""],
    1: ["剑术师", "GLA", "剑"],
    2: ["格斗家", "PGL", "格"],
    3: ["斧术师", "MRD", "斧"],
    4: ["枪术师", "LNC", "枪"],
    5: ["弓箭手", "ARC", "弓"],
    6: ["幻术师", "CNJ", "幻"],
    7: ["咒术师", "THM", "咒"],
    8: ["刻木匠", "CRP", "木"],
    9: ["锻铁匠", "BSM", "锻"],
    10: ["铸甲匠", "ARM", "甲"],
    11: ["雕金匠", "GSM", "雕"],
    12: ["制革匠", "LTW", "革"],
    13: ["裁衣匠", "WVR", "裁"],
    14: ["炼金术士", "ALC", "炼"],
    15: ["烹调师", "CUL", "烹"],
    16: ["采矿工", "MIN", "矿"],
    17: ["园艺工", "BTN", "园"],
    18: ["捕鱼人", "FSH", "鱼"],
    19: ["骑士", "PLD", "骑"],
    20: ["武僧", "MNK", "僧"],
    21: ["战士", "WAR", "战"],
    22: ["龙骑士", "DRG", "龙"],
    23: ["吟游诗人", "BRD", "诗"],
    24: ["白魔法师", "WHM", "白"],
    25: ["黑魔法师", "BLM", "黑"],
    26: ["秘术师", "ACN", "秘"],
    27: ["召唤师", "SMN", "召"],
    28: ["学者", "SCH", "学"],
    29: ["双剑师", "ROG", "双"],
    30: ["忍者", "NIN", "忍"],
    31: ["机工士", "MCH", "机"],
    32: ["暗黑骑士", "DRK", "暗"],
    33: ["占星术士", "AST", "占"],
    34: ["武士", "SAM", "武"],
    35: ["赤魔法师", "RDM", "赤"],
    36: ["青魔法师", "BLU", "青"],
    37: ["绝枪战士", "GNB", "绝"],
    38: ["舞者", "DNC", "舞"],
    39: ["钐镰客", "RPR", "钐"],
    40: ["贤者", "SGE", "贤"],
    41: ["蝰蛇剑士", "VPR", "蛇"],
    42: ["绘灵法师", "PCT", "绘"]
  };
  const classJobCategoryPolyfill = {
    0: "",
    1: "所有职业",
    2: "剑术师",
    3: "格斗家",
    4: "斧术师",
    5: "枪术师",
    6: "弓箭手",
    7: "幻术师",
    8: "咒术师",
    9: "刻木匠",
    10: "锻铁匠",
    11: "铸甲匠",
    12: "雕金匠",
    13: "制革匠",
    14: "裁衣匠",
    15: "炼金术士",
    16: "烹调师",
    17: "采矿工",
    18: "园艺工",
    19: "捕鱼人",
    20: "骑士",
    21: "武僧",
    22: "战士",
    23: "龙骑士",
    24: "吟游诗人",
    25: "白魔法师",
    26: "黑魔法师",
    27: "秘术师",
    28: "召唤师",
    29: "学者",
    30: "战斗精英",
    31: "魔法导师",
    32: "大地使者",
    33: "能工巧匠",
    34: "战斗精英 魔法导师",
    35: "能工巧匠 大地使者",
    36: "剑术师之外的战斗精英",
    37: "剑术师 格斗家 斧术师 枪术师 弓箭手 双剑师 幻术师 咒术师 秘术师 骑士 战士 暗黑骑士",
    38: "剑术师 骑士",
    39: "剑术师 格斗家 斧术师 枪术师 弓箭手 双剑师 骑士 战士 暗黑骑士",
    40: "剑术师 格斗家 斧术师 枪术师 弓箭手 双剑师 幻术师 咒术师 秘术师 武僧 战士 龙骑士 吟游诗人 忍者",
    41: "格斗家 武僧",
    42: "剑术师 格斗家 斧术师 枪术师 弓箭手 双剑师 武僧 战士 龙骑士 吟游诗人 忍者",
    43: "剑术师 格斗家 斧术师 枪术师 弓箭手 双剑师 幻术师 咒术师 秘术师 骑士 武僧 战士 龙骑士 暗黑骑士",
    44: "斧术师 战士",
    45: "剑术师 格斗家 斧术师 枪术师 弓箭手 双剑师 骑士 武僧 战士 龙骑士 暗黑骑士",
    46: "剑术师 格斗家 斧术师 枪术师 弓箭手 双剑师 幻术师 咒术师 秘术师 武僧 龙骑士 吟游诗人 忍者 机工士",
    47: "枪术师 龙骑士",
    48: "剑术师 格斗家 斧术师 枪术师 弓箭手 双剑师 武僧 龙骑士 吟游诗人 忍者 机工士",
    49: "剑术师 格斗家 斧术师 枪术师 弓箭手 双剑师 幻术师 咒术师 秘术师 吟游诗人 黑魔法师 召唤师 机工士",
    50: "弓箭手 吟游诗人",
    51: "剑术师 格斗家 斧术师 枪术师 弓箭手 双剑师 吟游诗人 机工士",
    52: "剑术师 格斗家 斧术师 枪术师 弓箭手 双剑师 幻术师 咒术师 秘术师 骑士 白魔法师 学者 占星术士",
    53: "幻术师 白魔法师",
    54: "剑术师 格斗家 斧术师 枪术师 弓箭手 双剑师 幻术师 咒术师 秘术师 白魔法师 黑魔法师 召唤师 学者 占星术士",
    55: "咒术师 黑魔法师",
    56: "剑术师 幻术师 咒术师 骑士 白魔法师 黑魔法师",
    57: "剑术师 咒术师 骑士 黑魔法师",
    58: "剑术师 幻术师 骑士 白魔法师",
    59: "剑术师 斧术师 骑士 战士 暗黑骑士 绝枪战士",
    60: "剑术师 斧术师 枪术师 骑士 战士 龙骑士 暗黑骑士 绝枪战士 钐镰客",
    61: "幻术师 咒术师 秘术师 白魔法师 学者 占星术士",
    62: "幻术师 咒术师 秘术师 白魔法师 黑魔法师 召唤师 学者 占星术士",
    63: "咒术师 秘术师 黑魔法师 召唤师 赤魔法师 青魔法师 绘灵法师",
    64: "幻术师 白魔法师 学者 占星术士 贤者",
    65: "格斗家 武僧 武士",
    66: "弓箭手 吟游诗人 机工士 舞者",
    67: "剑术师 格斗家 斧术师 枪术师 双剑师 武僧 龙骑士 忍者",
    68: "秘术师 召唤师 学者",
    69: "秘术师 召唤师",
    70: "烹调师之外的能工巧匠",
    71: "剑术师 格斗家 斧术师 枪术师 弓箭手 双剑师 幻术师 咒术师 秘术师 白魔法师 黑魔法师 召唤师 学者",
    72: "幻术师 咒术师 秘术师 白魔法师 黑魔法师 召唤师 学者",
    73: "幻术师 白魔法师 学者 占星术士 贤者",
    74: "",
    75: "",
    76: "枪术师 龙骑士 钐镰客",
    77: "",
    78: "",
    79: "",
    80: "",
    81: "",
    82: "",
    83: "",
    84: "格斗家 枪术师 武僧 龙骑士 武士 钐镰客",
    85: "战斗精英 魔法导师 特职专用",
    86: "骑士 战士 暗黑骑士 绝枪战士 武僧 龙骑士 忍者 武士",
    87: "吟游诗人 机工士 舞者 黑魔法师 召唤师 赤魔法师 白魔法师 学者 占星术士",
    88: "剑术师 斧术师 格斗家 枪术师 弓箭手 双剑师 骑士 武僧 战士 龙骑士 吟游诗人 忍者 暗黑骑士 机工士",
    89: "黑魔法师 召唤师 赤魔法师",
    90: "弓箭手 幻术师 咒术师 秘术师 白魔法师 吟游诗人 黑魔法师 召唤师 学者 机工士 占星术士",
    91: "双剑师",
    92: "忍者",
    93: "双剑师 忍者",
    94: "剑术师 格斗家 斧术师 枪术师 弓箭手 双剑师 忍者",
    95: "剑术师 格斗家 斧术师 枪术师 双剑师 忍者",
    96: "机工士",
    97: "格斗家 枪术师 弓箭手 双剑师 武僧 龙骑士 吟游诗人 忍者 机工士",
    98: "暗黑骑士",
    99: "占星术士",
    100: "弓箭手 双剑师 吟游诗人 忍者 机工士",
    101: "格斗家 枪术师 双剑师 武僧 龙骑士 忍者",
    102: "格斗家 双剑师 武僧 忍者 武士 蝰蛇剑士",
    103: "双剑师 忍者 蝰蛇剑士",
    104: "",
    105: "弓箭手 双剑师 吟游诗人 忍者 机工士 舞者 蝰蛇剑士",
    106: "剑术师 格斗家 斧术师 枪术师 弓箭手 双剑师 吟游诗人",
    107: "骑士 武僧 战士 龙骑士 吟游诗人 白魔法师 黑魔法师 召唤师 学者 忍者 机工士 暗黑骑士 占星术士",
    108: "战斗精英 魔法导师",
    109: "",
    110: "战斗精英 魔法导师 特职专用",
    111: "武士",
    112: "赤魔法师",
    113: "剑术师 斧术师 骑士 战士 暗黑骑士 绝枪战士",
    114: "格斗家 枪术师 武僧 龙骑士 双剑师 忍者 武士 钐镰客 蝰蛇剑士",
    115: "弓箭手 吟游诗人 机工士 舞者",
    116: "咒术师 黑魔法师 秘术师 召唤师 赤魔法师 青魔法师 绘灵法师",
    117: "幻术师 白魔法师 学者 占星术士 贤者",
    118: "格斗家 枪术师 弓箭手 武僧 龙骑士 吟游诗人 双剑师 忍者 机工士 武士 舞者 钐镰客 蝰蛇剑士",
    119: "格斗家 枪术师 咒术师 武僧 龙骑士 黑魔法师 秘术师 召唤师 双剑师 忍者 武士 赤魔法师 青魔法师 钐镰客 蝰蛇剑士 绘灵法师",
    120: "幻术师 咒术师 白魔法师 黑魔法师 秘术师 召唤师 学者 占星术士 赤魔法师 青魔法师 贤者 绘灵法师",
    121: "骑士 战士 暗黑骑士 绝枪战士",
    122: "武僧 龙骑士 忍者 武士 钐镰客 蝰蛇剑士",
    123: "吟游诗人 机工士 舞者",
    124: "黑魔法师 召唤师 赤魔法师 青魔法师 绘灵法师",
    125: "白魔法师 学者 占星术士 贤者",
    126: "武僧 龙骑士 吟游诗人 忍者 机工士 武士 舞者 钐镰客 蝰蛇剑士",
    127: "武僧 龙骑士 黑魔法师 召唤师 忍者 武士 赤魔法师 青魔法师 钐镰客 蝰蛇剑士 绘灵法师",
    128: "白魔法师 黑魔法师 召唤师 学者 占星术士 赤魔法师 青魔法师 贤者 绘灵法师",
    129: "青魔法师",
    130: "所有（除设限特职）",
    131: "武僧 龙骑士 吟游诗人 黑魔法师 召唤师 忍者 机工士 武士 赤魔法师 舞者 钐镰客 蝰蛇剑士 绘灵法师",
    132: "武僧 龙骑士 吟游诗人 白魔法师 黑魔法师 召唤师 学者 忍者 机工士 占星术士 武士 赤魔法师 舞者 钐镰客 贤者 蝰蛇剑士 绘灵法师",
    133: "白魔法师 学者 占星术士 贤者",
    134: "骑士 战士 暗黑骑士 绝枪战士",
    135: "骑士 武僧 战士 龙骑士 吟游诗人 黑魔法师 召唤师 忍者 机工士 暗黑骑士 武士 赤魔法师 绝枪战士 舞者 钐镰客 蝰蛇剑士 绘灵法师",
    136: "骑士 战士 白魔法师 学者 暗黑骑士 占星术士 绝枪战士 贤者",
    137: "骑士 武僧 战士 龙骑士 吟游诗人 白魔法师 黑魔法师 召唤师 学者 忍者 机工士 暗黑骑士 占星术士 武士 赤魔法师 绝枪战士 舞者 钐镰客 贤者 蝰蛇剑士 绘灵法师",
    138: "骑士 武僧 战士 龙骑士 忍者 暗黑骑士 武士 绝枪战士 钐镰客 蝰蛇剑士",
    139: "吟游诗人 机工士 舞者",
    140: "白魔法师 黑魔法师 召唤师 学者 占星术士 赤魔法师 贤者 绘灵法师",
    141: "骑士 武僧 战士 龙骑士 吟游诗人 白魔法师 黑魔法师 召唤师 学者 机工士 暗黑骑士 占星术士 武士 赤魔法师 绝枪战士 舞者 钐镰客 贤者 蝰蛇剑士 绘灵法师",
    142: "战斗精英和魔法导师（除设限特职）",
    143: "战斗精英（除设限特职）",
    144: "魔法导师（除设限特职）",
    145: "骑士 武僧 战士 龙骑士 吟游诗人 忍者 机工士 暗黑骑士 武士 绝枪战士 舞者 钐镰客 蝰蛇剑士",
    146: "战斗精英 魔法导师 特职专用（除设限特职）",
    147: "黑魔法师 召唤师 赤魔法师 绘灵法师",
    148: "武僧 龙骑士 忍者 武士 钐镰客 蝰蛇剑士",
    149: "绝枪战士",
    150: "舞者",
    151: "锻铁匠、铸甲匠、雕金匠",
    152: "刻木匠、制革匠、裁衣匠",
    153: "炼金术士、烹调师",
    154: "采矿工、园艺工",
    155: "捕鱼人",
    156: "防护职业（设限特职除外）",
    157: "治疗职业（设限特职除外）",
    158: "物理进攻职业（设限特职除外）",
    159: "魔法进攻职业（设限特职除外）",
    160: "秘术师 学者",
    161: "剑术师 格斗家 斧术师 枪术师 弓箭手 骑士 武僧 战士 龙骑士 吟游诗人 双剑师 忍者 机工士 暗黑骑士 武士 绝枪战士 舞者 钐镰客 蝰蛇剑士",
    162: "骑士 武僧 战士 龙骑士 吟游诗人 白魔法师 黑魔法师 召唤师 学者 <hex:02100103>忍者 机工士 暗黑骑士 占星术士 武士 赤魔法师 绝枪战士 舞者",
    163: "武僧 龙骑士 吟游诗人 黑魔法师 召唤师 忍者 机工士 武士 赤魔法师 舞者 钐镰客 蝰蛇剑士 绘灵法师",
    164: "武僧 龙骑士 吟游诗人 白魔法师 黑魔法师 召唤师 学者 忍者 机工士 占星术士 武士 赤魔法师 舞者 钐镰客 贤者 蝰蛇剑士 绘灵法师",
    165: "白魔法师 学者 占星术士 贤者",
    166: "骑士 战士 暗黑骑士 绝枪战士",
    167: "骑士 武僧 战士 龙骑士 吟游诗人 黑魔法师 召唤师 忍者 机工士 暗黑骑士 武士 赤魔法师 绝枪战士 舞者 钐镰客 蝰蛇剑士 绘灵法师",
    168: "骑士 战士 白魔法师 学者 暗黑骑士 占星术士 绝枪战士 贤者",
    169: "骑士 武僧 战士 龙骑士 吟游诗人 白魔法师 黑魔法师 召唤师 学者 忍者 机工士 暗黑骑士 占星术士 武士 赤魔法师 绝枪战士 舞者 钐镰客 贤者 蝰蛇剑士 绘灵法师",
    170: "骑士 武僧 战士 龙骑士 忍者 暗黑骑士 武士 绝枪战士 钐镰客 蝰蛇剑士",
    171: "吟游诗人 机工士 舞者",
    172: "白魔法师 黑魔法师 召唤师 学者 占星术士 赤魔法师 贤者 绘灵法师",
    173: "骑士 武僧 战士 龙骑士 吟游诗人 白魔法师 黑魔法师 召唤师 学者 机工士 暗黑骑士 占星术士 武士 赤魔法师 绝枪战士 舞者 钐镰客 贤者 蝰蛇剑士 绘灵法师",
    174: "骑士 武僧 战士 龙骑士 吟游诗人 忍者 机工士 暗黑骑士 武士 绝枪战士 舞者 钐镰客 蝰蛇剑士",
    175: "黑魔法师 召唤师 赤魔法师 绘灵法师",
    176: "武僧 龙骑士 忍者 武士 钐镰客 蝰蛇剑士",
    177: "武僧 龙骑士 吟游诗人 忍者 机工士 武士 舞者 钐镰客 蝰蛇剑士",
    178: "骑士 战士 黑魔法师 召唤师 暗黑骑士 赤魔法师 绝枪战士 绘灵法师",
    179: "白魔法师 召唤师 学者 占星术士 赤魔法师 贤者 绘灵法师",
    180: "钐镰客",
    181: "贤者",
    182: "",
    183: "",
    184: "",
    185: "",
    186: "防护职业（设限特职除外）",
    187: "治疗职业（设限特职除外）",
    188: "近战职业（设限特职除外）",
    189: "远程物理进攻职业（设限特职除外）",
    190: "远程魔法进攻职业（设限特职除外）",
    191: "骑士 武僧 战士 龙骑士 吟游诗人 白魔法师 黑魔法师 召唤师 学者 忍者 机工士 暗黑骑士 占星术士 武士 赤魔法师 绝枪战士 舞者 钐镰客 贤者",
    192: "战斗精英和魔法导师（除设限特职）",
    193: "格斗家 枪术师 弓箭手 双剑师 幻术师 咒术师 秘术师 武僧 龙骑士 吟游诗人 白魔法师 黑魔法师 召唤师 学者 忍者 机工士 占星术士 武士 赤魔法师 舞者 钐镰客 贤者 蝰蛇剑士 绘灵法师",
    194: "剑术师 斧术师 幻术师 骑士 战士 白魔法师 学者 暗黑骑士 占星术士 绝枪战士 贤者",
    195: "剑术师 格斗家 斧术师 枪术师 弓箭手 双剑师 咒术师 秘术师 骑士 武僧 战士 龙骑士 吟游诗人 黑魔法师 召唤师 忍者 机工士 暗黑骑士 武士 赤魔法师 绝枪战士 舞者 钐镰客 蝰蛇剑士 绘灵法师",
    196: "蝰蛇剑士",
    197: "绘灵法师",
    198: "咒术师 黑魔法师 秘术师 召唤师 赤魔法师 绘灵法师",
    199: "幻术师 咒术师 白魔法师 黑魔法师 秘术师 召唤师 学者 占星术士 赤魔法师 贤者 绘灵法师"
  };
  const translateAddon = async (obj) => {
    const id = obj.row_id;
    obj.fields.Text = addonTextPolyfill[id];
    return obj;
  };
  const useCache = (fetcher) => {
    const cache = /* @__PURE__ */ new Map();
    const fetch = (params) => {
      if (cache.has(params)) {
        return cache.get(params);
      }
      const promise = fetcher(params);
      cache.set(params, promise);
      return promise;
    };
    return {
      cache,
      fetch
    };
  };
  const _fetchAction = async (id) => {
    const response = await origFetch(`https://www.garlandtools.cn/db/doc/Action/chs/2/${id}.json`);
    const { action } = await response.json();
    return action;
  };
  const { fetch: fetchAction, cache: actionCache } = useCache(_fetchAction);
  const translateAction = async (obj) => {
    const id = obj.row_id;
    const action = await fetchAction(id);
    obj.fields.Name = action.name;
    return obj;
  };
  const translateActionRich = async (obj) => {
    const id = obj.row_id;
    const action = await fetchAction(id);
    obj.fields.Name = action.name;
    if (obj.fields.ClassJob.value !== -1) {
      obj.fields.ClassJob.fields.Abbreviation = classJobPolyfill[obj.fields.ClassJob.row_id][0];
    } else {
      if (obj.fields.ClassJob.fields === void 0) {
        obj.fields.ClassJob.fields = {};
      }
      obj.fields.ClassJob.fields.Abbreviation = "";
    }
    obj.fields.ClassJobCategory.fields.Name = classJobCategoryPolyfill[obj.fields.ClassJobCategory.row_id];
    obj.fields.ActionCategory.fields.Name = actionCatagoryPolyfill[obj.fields.ActionCategory.row_id];
    obj.transient["Description@as(html)"] = action.description;
    return obj;
  };
  const _fetchItem = async (id) => {
    const response = await origFetch(`https://www.garlandtools.cn/db/doc/Item/chs/3/${id}.json`);
    const { item } = await response.json();
    return item;
  };
  const { fetch: fetchItem, cache: itemCache } = useCache(_fetchItem);
  const translateItem = async (obj) => {
    const id = obj.row_id;
    const item = await fetchItem(id);
    obj.fields.Name = item.name;
    obj.fields["Description@as(html)"] = item.description;
    return obj;
  };
  const _fetchSearch = async (text) => {
    const response = await origFetch(
      `https://www.garlandtools.cn/api/search.php?text=${encodeURIComponent(text)}&lang=en`
    );
    const items = await response.json();
    return items;
  };
  const { fetch: fetchSearch, cache: searchCache } = useCache(_fetchSearch);
  const _fetchStatus = async (id) => {
    const response = await origFetch(`https://www.garlandtools.cn/db/doc/Status/chs/2/${id}.json`);
    const { status } = await response.json();
    return status;
  };
  const { fetch: fetchStatus, cache: statusCache } = useCache(_fetchStatus);
  const translateStatus = async (obj) => {
    const id = obj.row_id;
    const status = await fetchStatus(id);
    obj.fields.Name = status.name;
    obj.fields["Description@as(html)"] = status.description;
    return obj;
  };
  const _fetchTimeline = async (text) => {
    let items = await fetchSearch(text);
    items = items.filter((item) => {
      if (item.obj.n.toLowerCase() !== text.toLowerCase()) {
        return false;
      }
      if (item.type !== "action" && item.type !== "status" && item.type !== "item") {
        return false;
      }
      return true;
    });
    const translations = /* @__PURE__ */ new Map();
    for (const item of items) {
      try {
        let translatedText;
        if (item.type === "action") {
          const result = await fetchAction(item.id);
          translatedText = result.name;
        } else if (item.type === "status") {
          const result = await fetchStatus(item.id);
          translatedText = result.name;
        } else {
          const result = await fetchItem(item.id);
          translatedText = result.name;
        }
        const count = translations.get(translatedText) || 0;
        translations.set(translatedText, count + 1);
      } catch (e) {
        console.error(e);
      }
    }
    let maxCount = 0;
    let translation = text;
    for (const [key, value] of translations.entries()) {
      if (value > maxCount) {
        maxCount = value;
        translation = key;
      }
    }
    return translation;
  };
  const { fetch: fetchTimeline, cache: timelineCache } = useCache(_fetchTimeline);
  const blmAFUI = (el) => {
    el.innerHTML = "";
    el.appendChild(document.createTextNode("星极火和"));
    el.appendChild(document.createElement("br"));
    el.appendChild(document.createTextNode("灵极冰"));
  };
  const timelineCacheInitials = [
    // originally translated
    ["资源", "资源"],
    ["职业量谱", "职业量谱"],
    ["触发", "触发"],
    // terms
    ["Raid Buffs", "团辅"],
    ["GCD", "GCD"],
    // == AST ==
    ["Arcanum", "奥秘卡"],
    // Neutral Sect/中间学派
    // https://garlandtools.cn/db/#status/1892
    ["Neutral Sect (Healing Potency)", "中间学派（治疗增益）"],
    // Neutral Sect/中间学派
    // https://garlandtools.cn/db/#status/1921
    ["Neutral Sect (Barrier)", "中间学派（血盾）"],
    // Wheel of Fortune/命运之轮
    // https://garlandtools.cn/db/#status/1206
    ["Wheel Of Fortune", "命运之轮（HoT）"],
    // Collective Unconscious (Mitigation)/命运之轮
    // https://garlandtools.cn/db/#status/849
    ["Collective Unconscious (Mitigation)", "命运之轮（减伤）"],
    // == WHM ==
    // Confession/告解
    // https://garlandtools.cn/db/#status/1219
    ["Confession", "告解"],
    // == SCH ==
    ["Autos", "自动技能"],
    ["Commands", "手动技能"],
    // Expedience/疾风之计
    // https://garlandtools.cn/db/#status/2712
    ["Expedience", "疾风之计"],
    // == DRK ==
    ["Esteem", "英雄的掠影"],
    // == DRG ==
    // Enhanced Piercing Talon/???(未实装)
    // https://www.garlandtools.cn/db/#status/1870
    // == SMN ==
    // "Energy Drain/Siphon"/"能量吸收/抽取"
    // https://garlandtools.cn/db/#action/16508
    // https://garlandtools.cn/db/#action/16510
    ["Energy Drain/Siphon", "能量吸收/抽取"],
    // Crimson Strike Ready/???(未实装)
    // https://www.garlandtools.org/db/#status/4400
    ["Pet", "召唤兽"],
    ["Demi", "亚灵神"],
    // == BRD ==
    ["Songs", "战歌"],
    // == BLM ==
    ["Ley Lines Buffs", "黑魔纹增益"],
    ["Astral Fire andUmbral Ice", blmAFUI],
    // == SAM ==
    // Tengentsu/天眼通 (misspelled)
    // https://www.garlandtools.cn/db/#status/3853
    ["Tengetsu", "天眼通"]
  ];
  timelineCacheInitials.forEach(([text, translation]) => {
    timelineCache.set(text, Promise.resolve(translation));
  });
  const translateTimeline = async (text) => {
    return fetchTimeline(text);
  };
  const injectTimeline = () => {
    const className = "Timeline-module_content";
    const selector = `[class^="${className}"], [class*=" ${className}"]`;
    const observer = new MutationObserver((mutations) => {
      var _a;
      const found = [];
      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          for (const node of mutation.addedNodes) {
            if (node instanceof HTMLElement) {
              if (node.matches(selector)) {
                found.push(node);
              } else {
                const children = node.querySelectorAll(selector);
                for (const child of children) {
                  if (child instanceof HTMLElement) {
                    found.push(child);
                  }
                }
              }
            }
          }
        }
      }
      for (const node of found) {
        const gridColumnStart = (_a = node.parentElement) == null ? void 0 : _a.style.gridColumnStart;
        if (gridColumnStart === "-3") {
          continue;
        }
        const text = node.textContent;
        if (text) {
          fetchTimeline(text).then((translation) => {
            if (typeof translation === "function") {
              translation(node);
            } else {
              node.textContent = translation;
            }
          });
        }
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  };
  const iconCache = /* @__PURE__ */ new Map();
  const fetchIcon = async (url, name) => {
    const iconId = parseInt(url.match(/ui\/icon\/\d+\/(\d+)/)[1]);
    if (isNaN(iconId)) {
      return;
    }
    if (iconCache.has(iconId)) {
      return iconCache.get(iconId);
    }
    const searchItems = await fetchSearch(name);
    for (const searchItem of searchItems) {
      if (searchItem.obj.c !== iconId) {
        continue;
      }
      if (searchItem.type === "action") {
        const action = await fetchAction(searchItem.id);
        iconCache.set(iconId, action.name);
        return action.name;
      } else if (searchItem.type === "status") {
        const status = await fetchStatus(searchItem.id);
        iconCache.set(iconId, status.name);
        return status.name;
      } else {
        const item = await fetchItem(searchItem.id);
        iconCache.set(iconId, item.name);
        return item.name;
      }
    }
    return translateTimeline(name);
  };
  const translateIcon = async (element) => {
    const name = element.alt;
    const translated = await fetchIcon(element.src, name);
    if (translated) {
      if (typeof translated === "function") {
        translated(element);
      } else {
        element.alt = translated;
        element.title = translated;
      }
    }
  };
  const injectIcon = () => {
    const className = "Timeline-module_item";
    const selector = `[class^="${className}"] img, [class*=" ${className}"] img`;
    const observer = new MutationObserver((mutations) => {
      const found = [];
      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          for (const node of mutation.addedNodes) {
            if (node instanceof HTMLElement) {
              if (node.matches(selector)) {
                found.push(node);
              } else {
                const children = node.querySelectorAll(selector);
                for (const child of children) {
                  found.push(child);
                }
              }
            }
          }
        }
      }
      for (const node of found) {
        if (node instanceof HTMLImageElement) {
          translateIcon(node);
        }
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  };
  const isXIVPackage = (pkg) => {
    const url = new URL(pkg.url);
    const params = new URLSearchParams(url.search);
    const language = params.get("language");
    if (url.hostname.endsWith("xivapi.com")) {
      if (!url.pathname.startsWith("/api/")) {
        return null;
      }
      if (url.pathname.endsWith("/sheet/Action")) {
        if (params.get("transient") === "Description@as(html)") {
          const data = pkg.json;
          return {
            type: "ActionRich",
            rows: data.rows,
            language
          };
        } else {
          const data = pkg.json;
          return {
            type: "Action",
            rows: data.rows,
            language
          };
        }
      } else if (url.pathname.endsWith("/sheet/Item")) {
        const data = pkg.json;
        return {
          type: "Item",
          rows: data.rows,
          language
        };
      } else if (url.pathname.endsWith("/sheet/Status")) {
        const data = pkg.json;
        return {
          type: "Status",
          rows: data.rows,
          language
        };
      } else if (url.pathname.endsWith("/sheet/Addon")) {
        const data = pkg.json;
        return {
          type: "Addon",
          rows: data.rows,
          language
        };
      }
    }
    return null;
  };
  const processPackage = async (pkg) => {
    const identifier = isXIVPackage(pkg);
    if (!identifier) {
      return pkg.response;
    }
    const { type, rows } = identifier;
    const safeMap = (source, fn) => {
      const safeFn = (obj) => {
        try {
          return fn(obj);
        } catch (e) {
          console.error(e);
          return Promise.resolve(obj);
        }
      };
      return Promise.all(source.map(safeFn));
    };
    let newRows;
    if (type === "Action") {
      newRows = await safeMap(rows, translateAction);
    } else if (type === "ActionRich") {
      newRows = await safeMap(rows, translateActionRich);
    } else if (type === "Addon") {
      newRows = await safeMap(rows, translateAddon);
    } else if (type === "Item") {
      newRows = await safeMap(rows, translateItem);
    } else if (type === "Status") {
      newRows = await safeMap(rows, translateStatus);
    }
    const result = {
      ...pkg.json,
      rows: newRows
    };
    return new Response(JSON.stringify(result));
  };
  injectFetch(processPackage);
  injectStyle();
  injectTimeline();
  injectIcon();
})();
