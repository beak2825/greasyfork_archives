// ==UserScript==
// @name         「蜜柑计划」列表过滤（简繁/画质）
// @namespace    https://www.wdssmq.com/
// @version      1.0.3
// @author       沉冰浮水
// @description  过滤蜜柑计划列表，仅保留匹配规则的条目
// @license      MIT
// @null         ----------------------------
// @contributionURL    https://github.com/wdssmq#%E4%BA%8C%E7%BB%B4%E7%A0%81
// @contributionAmount 5.93
// @null         ----------------------------
// @link         https://github.com/wdssmq/userscript
// @link         https://afdian.com/@wdssmq
// @link         https://greasyfork.org/zh-CN/users/6865-wdssmq
// @null         ----------------------------
// @noframes
// @run-at       document-end
// @match        https://mikanani.me/Home/Bangumi/*
// @match        https://mikanime.tv/Home/Bangumi/*
// @match        https://feedly.com/i/subscription/feed*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/447975/%E3%80%8C%E8%9C%9C%E6%9F%91%E8%AE%A1%E5%88%92%E3%80%8D%E5%88%97%E8%A1%A8%E8%BF%87%E6%BB%A4%EF%BC%88%E7%AE%80%E7%B9%81%E7%94%BB%E8%B4%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/447975/%E3%80%8C%E8%9C%9C%E6%9F%91%E8%AE%A1%E5%88%92%E3%80%8D%E5%88%97%E8%A1%A8%E8%BF%87%E6%BB%A4%EF%BC%88%E7%AE%80%E7%B9%81%E7%94%BB%E8%B4%A8%EF%BC%89.meta.js
// ==/UserScript==

/* eslint-disable */
/* jshint esversion: 6 */

(function () {
  'use strict';

  const gm_name = "Mikan_Proj";

  // ---------------------------------------------------
  const _log = (...args) => console.log(`[${gm_name}]|`, ...args);
  function $na(e) {
    return document.querySelectorAll(e);
  }

  const _config = {
    data: {},
    dataDef: {
      pickRules: [
        {
          name: "Kirara Fantasia",
          regex: "Baha\\s",
        },
        {
          name: "漫猫字幕组&爱恋字幕组",
          regex: "1080p.+(简中|简日)",
        },
        {
          name: "华盟字幕社&千夏字幕组",
          regex: "简体",
        },
        {
          name: "北宇治字幕组",
          regex: "简日内嵌",
        },
        {
          name: "喵萌奶茶屋",
          regex: [
            "简体",
            "简日",
          ],
        },
        {
          name: "动漫国字幕组",
          regex: [
            "简体",
            "简日",
          ],
        },
      ],
      // 记录是否为第一次运行
      firstRun: true,
    },
    // 获取指定规则
    getRule: (name) => {
      return _config.data.pickRules.find(rule => rule.name === name);
    },
    // 更新指定规则
    updateRule: (name, regex) => {
      // _log("updateRule() ", name, regex);
      const index = _config.data.pickRules.findIndex(rule => rule.name === name);
      if (index !== -1) {
        _config.data.pickRules[index] = { name, regex };
      }
      else {
        _config.data.pickRules.push({ name, regex });
      }
      _config.save();
    },
    save: () => {
      GM_setValue("config", _config.data);
    },
    load: () => {
      _config.data = GM_getValue("config", _config.dataDef);
      // 初始化配置
      if (_config.data.firstRun) {
        _log("首次运行，初始化配置");
        _config.data.firstRun = false;
        _config.save();
      }
    },
  };

  _config.load();

  // // 过滤磁力链接中的 tr
  // function fnRemoveTracker(magnet) {
  //   const regex = /&tr=.+?(?=&|$)/g;
  //   return magnet.replace(regex, "");
  // }

  // 通过正则表达式筛选文本
  function fnPickByRegex(text, regex = null) {
    // 如果没有正则表达式，直接返回 true
    if (!regex) {
      return true;
    }
    regex = Array.isArray(regex) ? regex.join("|") : regex;
    const oRegex = new RegExp(regex, "i");
    // _log("fnPickByRegex() oRegex\n", oRegex);
    return oRegex.test(text);
  }

  // 绑定指定组的规则设置
  function setRuleBinding(groupName, $subscribed) {
    if ($subscribed) {
      // 添加一个文本框到 $subscribed 后边
      const $input = document.createElement("input");
      $input.type = "button";
      $input.value = "点击设置规则";
      $input.className = "btn btn-default btn-xs";
      $subscribed.insertAdjacentElement("afterend", $input);
      $input.addEventListener("click", () => {
        const curRule = _config.getRule(groupName);
        const userInput = prompt(`请输入发布组 "${groupName}" 的筛选规则（多个规则用 | 分隔）：`, curRule ? (Array.isArray(curRule.regex) ? curRule.regex.join("|") : curRule.regex) : "");
        if (userInput !== null) {
          const newRegex = userInput.split("|").map(item => item.trim());
          console.log(userInput, newRegex);
          _config.updateRule(groupName, newRegex.length === 1 ? newRegex[0] : newRegex);
        }
      });
    }
  }

  function _pick (group) {
    const { name, $table, $subscribed } = group;
    // 获取当前规则
    const curRule = _config.getRule(name);
    // 绑定规则设置按钮
    setRuleBinding(name, $subscribed);

    // _log("_pick() group: ", group);
    // _log("_pick() curRule: ", curRule);
    // _log("_pick() name: ", name);
    // _log("_pick() -----\n", "-----");
    if (!curRule) {
      return;
    }
    const $listTr = $table.querySelectorAll("tr");
    // _log($listTr.length);

    $listTr.forEach(($tr, _i) => {
      // _log("_pick()", i, $listTr.length);

      const $curA = $tr.querySelector(".magnet-link-wrap");
      if (!$curA) {
        return;
      }
      const curText = $curA.textContent.toLowerCase();

      if (!fnPickByRegex(curText, curRule.regex)) {
        $tr.remove();
      }
    });
  }

  // 遍历 nodeList
  function fnEachNodeList(nodeList, fn) {
    // 倒序遍历
    for (let i = nodeList.length - 1; i >= 0; i--) {
      fn(nodeList[i], i);
    }
  }

  // 按发布组获取信息
  function fnGetGroupInfo() {
    const arrGroup = [];
    // 获取全部 div.subgroup-text
    const $listGroup = $na(".subgroup-text");
    fnEachNodeList($listGroup, ($group, _i) => {
      const $groupTitle = $group.querySelector("div.dropdown-toggle span") || $group.querySelector("a");
      const $subscribed = $group.querySelector(".subscribed");

      const groupName = $groupTitle.textContent;
      const $groupTable = $group.nextElementSibling;
      arrGroup.push({
        name: groupName,
        $table: $groupTable,
        $subscribed,
      });
    });
    return arrGroup;
  }

  // main
  function fnMain() {
    const arrGroup = fnGetGroupInfo();
    // _log("arrGroup", arrGroup);
    arrGroup.forEach((group) => {
      _pick(group);
      // _log("group", group);
    });
  }

  // 自动展开更多
  function fnAutoExpand() {
    const $more = $na(".js-expand-episode");
    const moreLen = $more.length;

    // 定义一个计数，用于记录点击的按钮数量
    let clickCount = 0;

    // 判断每个按钮是否为 display: none
    const isVisible = el => el.offsetParent !== null;
    fnEachNodeList($more, ($btn, _i) => {
      if (isVisible($btn)) {
        $btn.click();
      }
      else {
        clickCount++;
      }
    });
    if (clickCount === moreLen) {
      fnMain();
      return;
    }
    setTimeout(() => {
      fnAutoExpand();
    }, 2000);
  }

  fnAutoExpand();

})();
