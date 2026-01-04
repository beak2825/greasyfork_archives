// ==UserScript==
// @name         2048-预览
// @version      1.4.12
// @namespace    https://sleazyfork.org/zh-CN/users/1461640-%E6%98%9F%E5%AE%BF%E8%80%81%E9%AD%94
// @author       星宿老魔
// @description  2048核基地·预览图片·自动签到·搜索过滤
// @include      *://hjd2048.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=https://bbs.djqot.com/
// @license      GPL-3.0
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/539571/2048-%E9%A2%84%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/539571/2048-%E9%A2%84%E8%A7%88.meta.js
// ==/UserScript==

!function() {
  "use strict";
  class Storage {
    static get(key, defaultValue = null) {
      try {
        const value = GM_getValue(key);
        if (null == value) return defaultValue;
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      } catch (error) {
        return defaultValue;
      }
    }
    static set(key, value) {
      try {
        const jsonValue = JSON.stringify(value);
        return GM_setValue(key, jsonValue), !0;
      } catch (error) {
        return !1;
      }
    }
    static delete(key) {
      try {
        return GM_deleteValue(key), !0;
      } catch (error) {
        return !1;
      }
    }
    static listKeys() {
      try {
        return GM_listValues();
      } catch (error) {
        return [];
      }
    }
    static migrateFromLocalStorage(key, deleteAfterMigration = !0) {
      try {
        const localValue = localStorage.getItem(key);
        if (null !== localValue) {
          try {
            const parsed = JSON.parse(localValue);
            this.set(key, parsed);
          } catch {
            GM_setValue(key, localValue);
          }
          return deleteAfterMigration && localStorage.removeItem(key), !0;
        }
        return !1;
      } catch (error) {
        return !1;
      }
    }
  }
  const CONFIG = {
    PREVIEW_IMAGE_HEIGHT: 300,
    PREVIEW_COUNT: 4,
    getPreviewCount() {
      return this.PREVIEW_COUNT;
    },
    getExcludedForums() {
      try {
        return Storage.get("EXCLUDED_FORUMS", []) ?? [];
      } catch (error) {
        return [];
      }
    },
    setExcludedForums(forums) {
      try {
        Storage.set("EXCLUDED_FORUMS", forums);
      } catch (error) {}
    },
    getHideThumb() {
      try {
        return Storage.get("HIDE_THUMB", !0) ?? !0;
      } catch (error) {
        return !0;
      }
    },
    setHideThumb(hide) {
      try {
        Storage.set("HIDE_THUMB", hide);
      } catch (error) {}
    },
    selectors: {
      threadRows: "tr.tr3.t_one",
      threadLinks: 'a[target="_self"], a[target="_blank"]',
      contentSelectors: [ "#read_tpc", ".tpc_content", ".f14.cc", 'div[id="read_tpc"]', ".t_f" ],
      searchLink: '#nav-pc a[href="/search.php"]',
      navSearch: "#nav-s",
      searchResultTable: ".t table",
      searchResultRows: 'tr[id^="search_"]',
      searchResultHeader: ".t table .h",
      previewRows: "tr.imagePreviewTr",
      imgSelectors: [ "#read_tpc img", ".tpc_content img", ".f14.cc img", 'div[id="read_tpc"] img' ],
      magnetTextarea: "textarea[readonly], textarea#copytext",
      magnetLink: 'a[href^="magnet:?xt=urn:btih:"]',
      ed2kLink: 'a[href^="ed2k://"]',
      btLink: 'a[href*="bt.ivcbt.com/list.php?name="], a[href*="bt.bxmho.cn/list.php?name="]'
    },
    regex: {
      threadUrl: /read\.php\?tid=/,
      searchUrl: /search\.php/,
      searchRowId: /^search_(\d+)_(\d+)$/,
      magnetHash: /([A-F0-9]{40})/i,
      thunder: /thunder:\/\/[A-Za-z0-9+\/=]+/i,
      ed2k: /ed2k:\/\/\|file\|[^|]+\|\d+\|[A-F0-9]{32}\|\//i,
      magnetLink: /magnet:\?xt=urn:btih:[a-zA-Z0-9]+/,
      copyText: /magnet:\?xt=urn:btih:/
    },
    btSites: [ {
      name: "bxmho",
      pattern: /(?:\/\/bt\.bxmho\.cn\/list\.php\?name=|userscript\.html\?name=)([0-9a-z]+)/i,
      url: "https://bt.bxmho.cn/list.php",
      method: "GET",
      getHash: match => {
        const hashMatch = match.match(/([0-9a-z]+)$/i);
        return hashMatch ? hashMatch[1] : "";
      }
    }, {
      name: "82bt",
      pattern: /\/\/www\.82bt\.com\/(?:cao\.php|dlink\.php)\?hash=([0-9a-z]+)/i,
      url: "https://www.82bt.com/downt-m.php",
      method: "POST",
      paramName: "code",
      referer: "https://www.82bt.com",
      getHash: match => {
        const hashMatch = match.match(/hash=([0-9a-z]+)/i);
        return hashMatch ? hashMatch[1] : "";
      }
    } ]
  }, Utils = {
    copyToClipboard(text, event) {
      navigator.clipboard.writeText(text).then(() => {
        this.showClickTip("已复制", event);
      }).catch(() => {
        this.fallbackCopyTextToClipboard(text, event);
      });
    },
    fallbackCopyTextToClipboard(text, event) {
      const textArea = document.createElement("textarea");
      textArea.value = text, textArea.style.position = "fixed", textArea.style.top = "-1000px", 
      textArea.style.left = "-1000px", document.body.appendChild(textArea), textArea.focus(), 
      textArea.select();
      try {
        document.execCommand("copy"), this.showClickTip("已复制", event);
      } catch (err) {
        this.showClickTip("复制失败", event);
      }
      document.body.removeChild(textArea);
    },
    showClickTip(text, event) {
      const e = event;
      let tip = document.querySelector(".click-tip");
      tip && tip.remove(), tip = document.createElement("div"), tip.className = "click-tip", 
      tip.textContent = text, document.body.appendChild(tip), tip.style.left = `${e.clientX}px`, 
      tip.style.top = `${e.clientY}px`, setTimeout(() => {
        tip.style.opacity = "1";
      }, 10), setTimeout(() => {
        tip.style.opacity = "0", setTimeout(() => {
          tip.parentElement && tip.remove();
        }, 200);
      }, 1e3);
    },
    collapseRules() {
      try {
        const collapseHeader = document.querySelector(".collapse-header");
        if (!collapseHeader) return;
        const ruleContainer = collapseHeader.closest("div, section, .rule-container, .collapse-container");
        if (!ruleContainer) return;
        if (ruleContainer.querySelector(".rule-collapse-btn")) return;
        const ruleContent = ruleContainer.querySelector(".collapse-content, .rule-content");
        if (ruleContent) ruleContent.style.display = "none", this.createCollapseButton(collapseHeader, ruleContent); else {
          const contentElements = Array.from(ruleContainer.children).filter(child => !child.classList.contains("collapse-header"));
          if (0 === contentElements.length) return;
          const wrapper = document.createElement("div");
          wrapper.className = "rule-content-wrapper", wrapper.style.display = "none", contentElements.forEach(el => wrapper.appendChild(el)), 
          ruleContainer.appendChild(wrapper), this.createCollapseButton(collapseHeader, wrapper);
        }
      } catch (e) {}
    },
    createCollapseButton(header, content) {
      const btn = document.createElement("span");
      btn.className = "rule-collapse-btn", btn.textContent = "▼ 展开版规", btn.style.cssText = "\n      cursor: pointer;\n      margin-left: 10px;\n      color: #0066cc;\n      font-size: 12px;\n      user-select: none;\n      transition: color 0.2s;\n    ", 
      btn.onmouseenter = () => {
        btn.style.color = "#ff6600";
      }, btn.onmouseleave = () => {
        btn.style.color = "#0066cc";
      };
      let isCollapsed = !0;
      btn.onclick = e => {
        e.preventDefault(), e.stopPropagation(), isCollapsed = !isCollapsed, isCollapsed ? (content.style.display = "none", 
        btn.textContent = "▼ 展开版规") : (content.style.display = "", btn.textContent = "▲ 折叠版规");
      }, header.appendChild(btn);
    },
    isContentPage: () => CONFIG.regex.threadUrl.test(window.location.href),
    getBaseUrl() {
      const {protocol: protocol, hostname: hostname, port: port, pathname: pathname} = window.location, portStr = port ? `:${port}` : "";
      return pathname.startsWith("/2048/") || "/2048" === pathname ? `${protocol}//${hostname}${portStr}/2048` : `${protocol}//${hostname}${portStr}`;
    },
    safeQuerySelector(selector, context = document) {
      try {
        return context.querySelector(selector);
      } catch (error) {
        return null;
      }
    },
    safeQuerySelectorAll(selector, context = document) {
      try {
        return Array.from(context.querySelectorAll(selector));
      } catch (error) {
        return [];
      }
    }
  }, _ForumData = class {
    static getForumById(id) {
      return this.FORUM_SECTIONS.find(forum => forum.id === id);
    }
    static getChildForums(parentId) {
      return this.FORUM_SECTIONS.filter(forum => forum.parent === parentId);
    }
    static getMainCategories() {
      return this.FORUM_SECTIONS.filter(forum => 2 === forum.level && "1" === forum.parent);
    }
    static getDisplayName(forum) {
      return `${"　".repeat(Math.max(0, forum.level - 2))}${forum.name}`;
    }
    static getForumTree() {
      const result = [];
      return this.getMainCategories().forEach(category => {
        result.push(category), this.getChildForums(category.id).forEach(subCategory => {
          result.push(subCategory), this.getChildForums(subCategory.id).forEach(subSubCategory => {
            result.push(subSubCategory);
            const subSubSubCategories = this.getChildForums(subSubCategory.id);
            result.push(...subSubSubCategories);
          });
        });
      }), result;
    }
  };
  _ForumData.FORUM_SECTIONS = [ {
    id: "all",
    name: "全部版块分类",
    level: 0
  }, {
    id: "1",
    name: "总板块",
    level: 1
  }, {
    id: "2",
    name: "新片速递",
    level: 2,
    parent: "1"
  }, {
    id: "3",
    name: "最新合集",
    level: 3,
    parent: "2"
  }, {
    id: "4",
    name: "亞洲無碼",
    level: 3,
    parent: "2"
  }, {
    id: "5",
    name: "日本騎兵",
    level: 3,
    parent: "2"
  }, {
    id: "13",
    name: "歐美新片",
    level: 3,
    parent: "2"
  }, {
    id: "15",
    name: "國內原創",
    level: 3,
    parent: "2"
  }, {
    id: "16",
    name: "中字原創",
    level: 3,
    parent: "2"
  }, {
    id: "18",
    name: "三級寫真",
    level: 3,
    parent: "2"
  }, {
    id: "343",
    name: "实时ＢＴ",
    level: 3,
    parent: "2"
  }, {
    id: "326",
    name: "本站高清影院",
    level: 3,
    parent: "2"
  }, {
    id: "7",
    name: "图片专区",
    level: 2,
    parent: "1"
  }, {
    id: "23",
    name: "網友自拍",
    level: 3,
    parent: "7"
  }, {
    id: "24",
    name: "亞洲激情",
    level: 3,
    parent: "7"
  }, {
    id: "25",
    name: "歐美激情",
    level: 3,
    parent: "7"
  }, {
    id: "26",
    name: "熟女专图",
    level: 3,
    parent: "7"
  }, {
    id: "27",
    name: "高跟絲襪",
    level: 3,
    parent: "7"
  }, {
    id: "28",
    name: "卡通漫畫",
    level: 3,
    parent: "7"
  }, {
    id: "345",
    name: "图你所图",
    level: 3,
    parent: "7"
  }, {
    id: "135",
    name: "原創达人",
    level: 3,
    parent: "7"
  }, {
    id: "273",
    name: "美图秀秀",
    level: 2,
    parent: "1"
  }, {
    id: "21",
    name: "唯美清純",
    level: 3,
    parent: "273"
  }, {
    id: "275",
    name: "亞洲正妹",
    level: 3,
    parent: "273"
  }, {
    id: "276",
    name: "素人正妹",
    level: 3,
    parent: "273"
  }, {
    id: "277",
    name: "角色扮演",
    level: 3,
    parent: "273"
  }, {
    id: "278",
    name: "A I 智能",
    level: 3,
    parent: "273"
  }, {
    id: "320",
    name: "优质图片",
    level: 3,
    parent: "273"
  }, {
    id: "333",
    name: "明星合成",
    level: 3,
    parent: "273"
  }, {
    id: "29",
    name: "动态图片",
    level: 3,
    parent: "273"
  }, {
    id: "92",
    name: "精品收录",
    level: 2,
    parent: "1"
  }, {
    id: "295",
    name: "原创首发",
    level: 3,
    parent: "92"
  }, {
    id: "94",
    name: "稀有首發",
    level: 3,
    parent: "92"
  }, {
    id: "329",
    name: "藏精阁 — 2017-2024",
    level: 4,
    parent: "94"
  }, {
    id: "283",
    name: "网络见闻",
    level: 3,
    parent: "92"
  }, {
    id: "111",
    name: "主播實錄",
    level: 3,
    parent: "92"
  }, {
    id: "99",
    name: "國產主播",
    level: 4,
    parent: "111"
  }, {
    id: "324",
    name: "自购主播区",
    level: 4,
    parent: "111"
  }, {
    id: "323",
    name: "国产主播2区",
    level: 4,
    parent: "111"
  }, {
    id: "322",
    name: "国产主播3区",
    level: 4,
    parent: "111"
  }, {
    id: "131",
    name: "名站同步",
    level: 3,
    parent: "92"
  }, {
    id: "314",
    name: "真实街拍",
    level: 3,
    parent: "92"
  }, {
    id: "341",
    name: "原档115",
    level: 3,
    parent: "92"
  }, {
    id: "213",
    name: "国产主播同步",
    level: 4,
    parent: "341"
  }, {
    id: "342",
    name: "VR視頻2023-2025",
    level: 4,
    parent: "341"
  }, {
    id: "290",
    name: "日本4K超清",
    level: 4,
    parent: "341"
  }, {
    id: "303",
    name: "高清有碼",
    level: 4,
    parent: "341"
  }, {
    id: "302",
    name: "AI視界",
    level: 4,
    parent: "341"
  }, {
    id: "304",
    name: "外掛字幕",
    level: 4,
    parent: "341"
  }, {
    id: "306",
    name: "FC2視頻",
    level: 4,
    parent: "341"
  }, {
    id: "307",
    name: "S-cute / Mywife",
    level: 4,
    parent: "341"
  }, {
    id: "305",
    name: "亞洲SM",
    level: 4,
    parent: "341"
  }, {
    id: "321",
    name: "补档申请",
    level: 3,
    parent: "92"
  }, {
    id: "75",
    name: "免空網盤",
    level: 2,
    parent: "1"
  }, {
    id: "72",
    name: "网盘二区",
    level: 3,
    parent: "75"
  }, {
    id: "272",
    name: "网盘三区",
    level: 3,
    parent: "75"
  }, {
    id: "195",
    name: "优质 B T",
    level: 3,
    parent: "75"
  }, {
    id: "280",
    name: "国产精选",
    level: 3,
    parent: "75"
  }, {
    id: "76",
    name: "多挂原创",
    level: 3,
    parent: "75"
  }, {
    id: "55",
    name: "有声小说",
    level: 3,
    parent: "75"
  }, {
    id: "180",
    name: "实用漫画",
    level: 3,
    parent: "75"
  }, {
    id: "113",
    name: "原档收藏",
    level: 3,
    parent: "75"
  }, {
    id: "116",
    name: "有碼.HD",
    level: 4,
    parent: "113"
  }, {
    id: "114",
    name: "亞洲SM.HD",
    level: 4,
    parent: "113"
  }, {
    id: "96",
    name: "日韓VR/3D",
    level: 4,
    parent: "113"
  }, {
    id: "119",
    name: "S-cute / Mywife / G-area",
    level: 4,
    parent: "113"
  }, {
    id: "41",
    name: "綜合資源",
    level: 2,
    parent: "1"
  }, {
    id: "43",
    name: "E D 2 K",
    level: 3,
    parent: "41"
  }, {
    id: "315",
    name: "原档字幕",
    level: 3,
    parent: "41"
  }, {
    id: "318",
    name: "磁链迅雷",
    level: 3,
    parent: "41"
  }, {
    id: "316",
    name: "包罗万象",
    level: 3,
    parent: "41"
  }, {
    id: "271",
    name: "聚合1区",
    level: 4,
    parent: "316"
  }, {
    id: "281",
    name: "聚合2区",
    level: 4,
    parent: "316"
  }, {
    id: "284",
    name: "聚合3区",
    level: 4,
    parent: "316"
  }, {
    id: "313",
    name: "远古资源",
    level: 4,
    parent: "316"
  }, {
    id: "319",
    name: "聚合5区",
    level: 4,
    parent: "316"
  }, {
    id: "325",
    name: "聚合6区 WK",
    level: 4,
    parent: "316"
  }, {
    id: "327",
    name: "聚合7区",
    level: 4,
    parent: "316"
  }, {
    id: "332",
    name: "司机社",
    level: 4,
    parent: "316"
  }, {
    id: "335",
    name: "套图学院",
    level: 4,
    parent: "316"
  }, {
    id: "334",
    name: "游戏下载",
    level: 4,
    parent: "316"
  }, {
    id: "340",
    name: "韩国主播",
    level: 4,
    parent: "316"
  }, {
    id: "344",
    name: "美足踩踏",
    level: 4,
    parent: "316"
  }, {
    id: "346",
    name: "套图百晓生",
    level: 4,
    parent: "316"
  }, {
    id: "348",
    name: "街拍精品",
    level: 4,
    parent: "316"
  }, {
    id: "67",
    name: "正片大片",
    level: 3,
    parent: "41"
  }, {
    id: "66",
    name: "H-GAME",
    level: 3,
    parent: "41"
  }, {
    id: "291",
    name: "快播影院",
    level: 3,
    parent: "41"
  }, {
    id: "293",
    name: "快播1号",
    level: 4,
    parent: "291"
  }, {
    id: "294",
    name: "快播2号",
    level: 4,
    parent: "291"
  }, {
    id: "296",
    name: "快播3号",
    level: 4,
    parent: "291"
  }, {
    id: "299",
    name: "快播4号",
    level: 4,
    parent: "291"
  }, {
    id: "300",
    name: "快播5号",
    level: 4,
    parent: "291"
  }, {
    id: "301",
    name: "快播6号",
    level: 4,
    parent: "291"
  }, {
    id: "308",
    name: "快播7号",
    level: 4,
    parent: "291"
  }, {
    id: "309",
    name: "快播频道",
    level: 4,
    parent: "291"
  }, {
    id: "311",
    name: "快播10号",
    level: 4,
    parent: "291"
  }, {
    id: "312",
    name: "快播11号",
    level: 4,
    parent: "291"
  }, {
    id: "331",
    name: "本站破解资源",
    level: 3,
    parent: "41"
  }, {
    id: "102",
    name: "文学欣赏",
    level: 2,
    parent: "1"
  }, {
    id: "328",
    name: "在线速听",
    level: 3,
    parent: "102"
  }, {
    id: "48",
    name: "综合小说",
    level: 3,
    parent: "102"
  }, {
    id: "49",
    name: "激情都市",
    level: 4,
    parent: "48"
  }, {
    id: "51",
    name: "青春校园",
    level: 4,
    parent: "48"
  }, {
    id: "52",
    name: "武侠虚幻",
    level: 4,
    parent: "48"
  }, {
    id: "105",
    name: "另类其他",
    level: 4,
    parent: "48"
  }, {
    id: "103",
    name: "人妻意淫",
    level: 3,
    parent: "102"
  }, {
    id: "50",
    name: "乱伦迷情",
    level: 3,
    parent: "102"
  }, {
    id: "54",
    name: "长篇连载",
    level: 3,
    parent: "102"
  }, {
    id: "100",
    name: "文学作者",
    level: 3,
    parent: "102"
  }, {
    id: "109",
    name: "TXT小说打包",
    level: 3,
    parent: "102"
  }, {
    id: "297",
    name: "2008-2024大集合",
    level: 4,
    parent: "109"
  }, {
    id: "110",
    name: "TXT小说綜合一区",
    level: 4,
    parent: "109"
  }, {
    id: "189",
    name: "TXT小说綜合二区",
    level: 4,
    parent: "109"
  }, {
    id: "193",
    name: "同人小说",
    level: 4,
    parent: "109"
  }, {
    id: "336",
    name: "耽美小说",
    level: 4,
    parent: "109"
  }, {
    id: "192",
    name: "言情小说",
    level: 4,
    parent: "109"
  }, {
    id: "338",
    name: "常规小说",
    level: 4,
    parent: "109"
  }, {
    id: "190",
    name: "都市校园",
    level: 4,
    parent: "109"
  }, {
    id: "191",
    name: "武侠小说",
    level: 4,
    parent: "109"
  }, {
    id: "93",
    name: "TXT小说網盤區",
    level: 4,
    parent: "109"
  }, {
    id: "56",
    name: "网友互动",
    level: 2,
    parent: "1"
  }, {
    id: "57",
    name: "聚友客栈",
    level: 3,
    parent: "56"
  }, {
    id: "61",
    name: "求片专版",
    level: 3,
    parent: "56"
  }, {
    id: "206",
    name: "重金求片区（米粒悬赏）限侠客以上",
    level: 4,
    parent: "61"
  }, {
    id: "218",
    name: "成人信息",
    level: 3,
    parent: "56"
  }, {
    id: "220",
    name: "北京性息",
    level: 4,
    parent: "218"
  }, {
    id: "237",
    name: "上海性息",
    level: 4,
    parent: "218"
  }, {
    id: "238",
    name: "广州性息",
    level: 4,
    parent: "218"
  }, {
    id: "239",
    name: "深圳性息",
    level: 4,
    parent: "218"
  }, {
    id: "287",
    name: "赚米专区",
    level: 3,
    parent: "56"
  }, {
    id: "136",
    name: "坛友自售",
    level: 3,
    parent: "56"
  }, {
    id: "289",
    name: "破解软件",
    level: 3,
    parent: "56"
  }, {
    id: "339",
    name: "包养情报",
    level: 3,
    parent: "56"
  }, {
    id: "128",
    name: "问题建议/举报申诉",
    level: 3,
    parent: "56"
  }, {
    id: "292",
    name: "解禁忏悔区/丢失找回",
    level: 4,
    parent: "128"
  } ];
  let ForumData = _ForumData;
  const _ModernSettingsPanel = class {
    static init() {
      this.initialized || (this.addSimpleButtons(), this.initialized = !0);
    }
    static addSimpleButtons() {
      const navPc = document.getElementById("nav-pc");
      if (navPc) {
        const filterLi = document.createElement("li"), filterBtn = document.createElement("a");
        filterBtn.href = "javascript:;", filterBtn.textContent = "搜索过滤", filterBtn.onclick = () => !1, 
        filterLi.appendChild(filterBtn), navPc.appendChild(filterLi);
        const filterPanel = this.createSearchFilterPanel();
        filterBtn.addEventListener("click", e => {
          e.preventDefault(), filterPanel.show();
        });
      }
    }
    static createSearchFilterPanel() {
      document.body.insertAdjacentHTML("beforeend", '\n      <dialog id="search-filter-panel" class="clean-search-panel script-container">\n        <header>\n          <span>搜索过滤设置</span>\n          <button id="search-close-settings-btn" class="close-x">×</button>\n        </header>\n        <main id="search-forum-list" class="clean-forum-tree"></main>\n        <footer>\n          <div class="filter-controls">\n            <button id="search-clear-all-filters" class="secondary">清除全部</button>\n            <button id="search-select-all-forums" class="secondary">全选</button>\n          </div>\n          <button id="search-save-settings-btn">保存设置</button>\n        </footer>\n      </dialog>\n      <div id="search-filter-overlay" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.5); z-index:10000;"></div>\n    ');
      const panel = document.getElementById("search-filter-panel"), overlay = document.getElementById("search-filter-overlay");
      return this.generateCleanSearchForumList(), this.loadSearchFilterSettings(), setTimeout(() => {
        overlay && this.setupSearchFilterEventListeners(panel, overlay);
      }, 50), {
        show: () => {
          panel.style.display = "block", overlay.style.display = "block";
        }
      };
    }
    static generateCleanSearchForumList() {
      const container = document.getElementById("search-forum-list");
      if (!container) return;
      const forums = ForumData.getForumTree();
      forums.filter(f => 2 === f.level).forEach(mainForum => {
        const groupCard = document.createElement("div");
        groupCard.className = "clean-forum-card";
        const headerDiv = document.createElement("div");
        headerDiv.className = "clean-card-header";
        const mainCheckbox = document.createElement("input");
        mainCheckbox.type = "checkbox", mainCheckbox.id = `search-forum-${mainForum.id}`, 
        mainCheckbox.value = mainForum.id, mainCheckbox.className = "main-forum-checkbox";
        const titleSpan = document.createElement("span");
        titleSpan.className = "main-forum-title", titleSpan.textContent = mainForum.name, 
        headerDiv.appendChild(mainCheckbox), headerDiv.appendChild(titleSpan), groupCard.appendChild(headerDiv);
        const contentDiv = document.createElement("div");
        contentDiv.className = "clean-card-content", this.addCleanSubForums(forums, mainForum.id, contentDiv, mainForum.id), 
        groupCard.appendChild(contentDiv), container.appendChild(groupCard), mainCheckbox.addEventListener("change", () => {
          this.handleSearchFilterParentToggle(mainForum.id, mainCheckbox.checked);
        });
      });
    }
    static addCleanSubForums(forums, parentId, container, rootParentId) {
      const subForums = forums.filter(f => f.parent === parentId && 3 === f.level);
      if (0 !== subForums.length) if (subForums.some(subForum => forums.some(f => 4 === f.level && f.parent === subForum.id))) subForums.forEach(subForum => {
        const subSection = document.createElement("div");
        subSection.className = "clean-sub-section";
        const subHeader = document.createElement("div");
        subHeader.className = "clean-sub-header";
        const subCheckbox = document.createElement("input");
        subCheckbox.type = "checkbox", subCheckbox.id = `search-forum-${subForum.id}`, subCheckbox.value = subForum.id, 
        subCheckbox.className = "sub-forum-checkbox", subCheckbox.dataset.parent = rootParentId;
        const subTitle = document.createElement("span");
        subTitle.className = "sub-forum-title", subTitle.textContent = subForum.name, subHeader.appendChild(subCheckbox), 
        subHeader.appendChild(subTitle), subSection.appendChild(subHeader), subCheckbox.addEventListener("change", () => {
          this.handleLevel3Toggle(subForum.id, subCheckbox.checked);
        });
        const level4Forums = forums.filter(f => 4 === f.level && f.parent === subForum.id);
        if (level4Forums.length > 0) {
          const level4Grid = document.createElement("div");
          level4Grid.className = "clean-level4-grid", level4Forums.forEach(level4Forum => {
            const level4Item = document.createElement("label");
            level4Item.className = "clean-level4-item";
            const level4Checkbox = document.createElement("input");
            level4Checkbox.type = "checkbox", level4Checkbox.id = `search-forum-${level4Forum.id}`, 
            level4Checkbox.value = level4Forum.id, level4Checkbox.className = "level4-forum-checkbox", 
            level4Checkbox.dataset.parent = rootParentId, level4Checkbox.dataset.level3Parent = subForum.id;
            const level4Span = document.createElement("span");
            level4Span.textContent = level4Forum.name, level4Item.appendChild(level4Checkbox), 
            level4Item.appendChild(level4Span), level4Grid.appendChild(level4Item);
          }), subSection.appendChild(level4Grid);
        }
        container.appendChild(subSection);
      }); else {
        const compactGrid = document.createElement("div");
        compactGrid.className = "clean-compact-grid", subForums.forEach(subForum => {
          const compactItem = document.createElement("label");
          compactItem.className = "clean-compact-item";
          const compactCheckbox = document.createElement("input");
          compactCheckbox.type = "checkbox", compactCheckbox.id = `search-forum-${subForum.id}`, 
          compactCheckbox.value = subForum.id, compactCheckbox.className = "compact-forum-checkbox", 
          compactCheckbox.dataset.parent = rootParentId;
          const compactSpan = document.createElement("span");
          compactSpan.textContent = subForum.name, compactItem.appendChild(compactCheckbox), 
          compactItem.appendChild(compactSpan), compactGrid.appendChild(compactItem);
        }), container.appendChild(compactGrid);
      }
    }
    static loadSearchFilterSettings() {
      CONFIG.getExcludedForums().forEach(forumId => {
        const checkbox = document.getElementById(`search-forum-${forumId}`);
        checkbox && (checkbox.checked = !0);
      });
    }
    static setupSearchFilterEventListeners(panel, overlay) {
      const saveBtn = document.getElementById("search-save-settings-btn");
      saveBtn && saveBtn.addEventListener("click", () => this.saveSearchFilterSettings());
      const closePanel = () => {
        panel.style.display = "none", overlay.style.display = "none";
      }, closeBtn = document.getElementById("search-close-settings-btn");
      closeBtn && closeBtn.addEventListener("click", closePanel), overlay.addEventListener("click", closePanel);
      const clearBtn = document.getElementById("search-clear-all-filters"), selectBtn = document.getElementById("search-select-all-forums");
      clearBtn && clearBtn.addEventListener("click", () => this.clearAllSearchFilters()), 
      selectBtn && selectBtn.addEventListener("click", () => this.selectAllSearchForums());
    }
    static saveSearchFilterSettings() {
      const checkboxes = document.querySelectorAll('.clean-search-panel input[type="checkbox"]:checked'), excludedForums = Array.from(checkboxes).map(cb => cb.value);
      CONFIG.setExcludedForums(excludedForums), window.location.reload();
    }
    static handleSearchFilterParentToggle(parentId, checked) {
      document.querySelectorAll(`[data-parent="${parentId}"]`).forEach(checkbox => {
        checkbox.checked = checked;
      });
    }
    static handleLevel3Toggle(parentId, checked) {
      document.querySelectorAll(`[data-level3-parent="${parentId}"]`).forEach(checkbox => {
        checkbox.checked = checked;
      });
    }
    static clearAllSearchFilters() {
      document.querySelectorAll('.clean-search-panel input[type="checkbox"]').forEach(cb => cb.checked = !1);
    }
    static selectAllSearchForums() {
      document.querySelectorAll('.clean-search-panel input[type="checkbox"]').forEach(cb => cb.checked = !0);
    }
  };
  _ModernSettingsPanel.initialized = !1;
  let ModernSettingsPanel = _ModernSettingsPanel;
  const _UltraMinimalStyleManager = class {
    static injectStyles() {
      const existingStyle = document.getElementById(this.styleElementId);
      existingStyle && existingStyle.remove();
      const style = document.createElement("style");
      style.id = this.styleElementId, style.textContent = ".click-tip{position:fixed;background:rgba(0,0,0,0.8);color:#fff;padding:6px 12px;border-radius:4px;font-size:13px;z-index:10000}.thread-title-highlighted{background:#e8f4fd!important;border-radius:4px 4px 0 0}.preview-container{margin:0 0 10px 0;border:1px solid #dee2e6;border-top:none;border-radius:0 0 4px 4px;padding:16px;background:#f8f9fa}.preview-images{display:flex;gap:12px;margin-bottom:16px}.preview-image-wrapper{height:300px;flex:0 0 auto;border-radius:4px;cursor:pointer;overflow:hidden}.preview-image{width:100%;height:100%;object-fit:cover}.preview-magnet{font-size:13px;word-break:break-all;cursor:pointer;padding:10px 12px;background:#f0f9ff;border:1px solid #e0f2fe;border-radius:4px;margin-bottom:10px}.content-magnet-block{margin:12px 0 18px;padding:12px 16px;background:#eff6ff;border:1px solid #dbeafe;border-radius:10px;box-shadow:0 1px 2px rgba(15,23,42,0.06)}.content-magnet-title{font-size:14px;font-weight:600;color:#1d4ed8;margin-bottom:6px}.content-magnet-text{font-size:13px;color:#0f172a;word-break:break-all;background:#fff;border:1px dashed #bfdbfe;border-radius:6px;padding:10px 12px;cursor:pointer;transition:background 0.2s}.content-magnet-text:hover{background:#dbeafe}.lightbox{position:fixed;inset:0;background:rgba(0,0,0,0.9);display:flex;align-items:center;justify-content:center;z-index:9999;opacity:0;visibility:hidden}.lightbox.active{opacity:1;visibility:visible}.lightbox-image{border-radius:8px;display:block;object-fit:contain}.lightbox-prev,.lightbox-next,.lightbox-close{position:absolute;color:#fff;cursor:pointer;background:rgba(0,0,0,0.5);border-radius:50%;display:flex;align-items:center;justify-content:center}.lightbox-prev,.lightbox-next{top:50%;transform:translateY(-50%);font-size:36px;width:60px;height:60px}.lightbox-close{top:20px;right:20px;font-size:24px;width:40px;height:40px}.lightbox-prev{left:20px}.lightbox-next{right:20px}.simple-toggle-btn{color:#007bff;text-decoration:none;font-size:13px;cursor:pointer}.simple-toggle-btn:hover{color:#0056b3;text-decoration:underline}.clean-search-panel{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10001;background:#fff;border:1px solid #ddd;border-radius:8px;font-family:system-ui,sans-serif;width:750px;max-height:80vh;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.2)}.clean-search-panel header{position:relative;padding:16px 20px;border-bottom:1px solid #e5e7eb;background:#f8f9fa;border-radius:8px 8px 0 0;font-size:15px;font-weight:600;color:#374151}.clean-forum-tree{padding:20px;max-height:500px;overflow-y:auto}.clean-forum-card{margin-bottom:20px;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;background:#fff}.clean-forum-card:last-child{margin-bottom:0}.clean-card-header{padding:12px 16px;background:#f1f5f9;border-bottom:1px solid #e5e7eb;display:flex;align-items:center;gap:10px}.main-forum-title{font-weight:600;font-size:14px;color:#1f2937;cursor:pointer}.main-forum-checkbox{margin:0;transform:scale(1.1)}.clean-card-content{padding:16px}.clean-sub-section{margin-bottom:16px;border-left:3px solid #e5e7eb;padding-left:12px}.clean-sub-section:last-child{margin-bottom:0}.clean-sub-header{display:flex;align-items:center;gap:8px;margin-bottom:12px}.sub-forum-title{font-weight:500;font-size:13px;color:#4b5563;cursor:pointer}.sub-forum-checkbox{margin:0}.clean-level4-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:8px;margin-left:20px}.clean-level4-item{display:flex;align-items:center;gap:6px;padding:8px 12px;background:#f9fafb;border:1px solid #f3f4f6;border-radius:6px;cursor:pointer;font-size:12px;color:#6b7280}.clean-level4-item:hover{background:#f3f4f6}.level4-forum-checkbox{margin:0;transform:scale(0.9)}.clean-compact-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px;padding:12px}.clean-compact-item{display:flex;align-items:center;gap:6px;padding:10px 12px;background:#fff;border:1px solid #e5e7eb;border-radius:6px;cursor:pointer;font-size:13px;color:#4b5563}.clean-compact-item:hover{background:#f9fafb}.compact-forum-checkbox{margin:0;transform:scale(1.05)}.filter-controls{display:flex;gap:10px}.clean-search-panel footer{padding:16px 20px;background:#f8f9fa;border-top:1px solid #e5e7eb;border-radius:0 0 8px 8px;display:flex;justify-content:space-between;align-items:center}.clean-search-panel button{padding:8px 16px;border:1px solid #d1d5db;border-radius:6px;background:#fff;color:#374151;cursor:pointer;font-size:13px;font-weight:500}.clean-search-panel button.secondary{background:#f9fafb}.clean-search-panel #search-save-settings-btn{background:#3b82f6;border-color:#3b82f6;color:#fff}.flex{display:flex}.items-center{align-items:center}.justify-center{justify-content:center}.gap-2{gap:0.5rem}.mb-3{margin-bottom:0.75rem}.p-3{padding:0.75rem}.text-center{text-align:center}.cursor-pointer{cursor:pointer}.close-x{position:absolute;top:12px;right:16px;width:24px;height:24px;border:none;background:none;color:#999;font-size:18px;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1}.close-x:hover{color:#666}.search-img-group,.search-thumb-toggle .form-label-tip{display:none!important}", 
      document.head.appendChild(style);
    }
    static setImageGridWidth(container, count) {
      let imageWidth;
      imageWidth = 1 === count ? "50%" : `calc((100% - ${12 * (count - 1)}px) / ${count})`, 
      Array.from(container.children).forEach(child => {
        child.style.width = imageWidth, child.style.flex = "0 0 auto";
      });
    }
  };
  _UltraMinimalStyleManager.styleElementId = "ultra-minimal-styles";
  let UltraMinimalStyleManager = _UltraMinimalStyleManager;
  class AdRemover {
    static removeAds() {
      this.removeStickyPosts(), this.removeAdButtons(), this.removeNavGridAds();
    }
    static removeGlobalAds() {
      this.removeAdButtons(), this.removeSponsorAds(), this.removeNavGridAds();
    }
    static removeStickyPosts() {
      document.querySelectorAll(CONFIG.selectors.threadRows).forEach(tr => {
        const tdContent = tr.querySelector("td.tal");
        tdContent && tdContent.innerHTML.includes("headtopic_3.gif") && tr.remove();
      });
    }
    static removeAdButtons() {
      [ "td_ID144", "td_ID86", "td_ID139" ].forEach(id => {
        const adButton = document.getElementById(id);
        if (adButton) {
          const parentLi = adButton.closest("li");
          parentLi ? parentLi.remove() : adButton.remove();
        }
      });
    }
    static removeSponsorAds() {
      document.querySelectorAll(".recs-wrapper").forEach(ad => ad.remove());
    }
    static removeNavGridAds() {
      const adLinks = document.querySelectorAll('a[name="temp_ad_adcontrol"]'), adContainers = new Set;
      adLinks.forEach(link => {
        const navContainer = link.closest(".nav-container");
        navContainer && adContainers.add(navContainer);
        const navGrid = link.closest(".nav-grid");
        navGrid && adContainers.add(navGrid);
        const navItem = link.closest(".nav-item");
        navItem && adContainers.add(navItem);
      }), adContainers.forEach(container => {
        const textContent = container.textContent || "";
        (textContent.includes("赞助") || textContent.includes("广告") || container.querySelector('a[name="temp_ad_adcontrol"]')) && container.remove();
      }), adLinks.forEach(link => {
        document.contains(link) && link.remove();
      }), document.querySelectorAll("style").forEach(styleTag => {
        const content = styleTag.textContent || "";
        content.includes(".nav-container") && content.includes("temp_ad_adcontrol") && styleTag.remove();
      });
    }
  }
  class DataExtractor {
    static extractImages(doc) {
      const MAX_PREVIEW_IMAGES = CONFIG.getPreviewCount();
      let imgElements = [];
      for (const selector of CONFIG.selectors.imgSelectors) if (imgElements = Array.from(doc.querySelectorAll(selector)), 
      imgElements.length > 0) break;
      let imgSrcsWithPriority = imgElements.filter(img => {
        const imgStyle = img.getAttribute("style") || "";
        return !imgStyle.includes("display: none") && !imgStyle.includes("display:none");
      }).map(img => ({
        src: img.getAttribute("data-original") || img.getAttribute("src") || "",
        img: img
      })).filter(item => !(!item.src || item.src.length < 4));
      return imgSrcsWithPriority.sort((a, b) => {
        const aIsMain = /\.(jpg|jpeg|png)$/i.test(a.src), bIsMain = /\.(jpg|jpeg|png)$/i.test(b.src);
        return aIsMain && !bIsMain ? -1 : !aIsMain && bIsMain ? 1 : 0;
      }), imgSrcsWithPriority.map(item => item.src).slice(0, MAX_PREVIEW_IMAGES);
    }
    static isPaidContent(doc) {
      if (doc.querySelector('input[value*="购买"], a[href*="buythread"], a[href*="action=buy"]')) return !0;
      const pageText = doc.body.textContent || "";
      return !!(pageText.includes("本帖隐藏的内容需要付费") || pageText.includes("需付费购买后才可查看") || pageText.includes("购买精华帖"));
    }
    static extractMagnet(doc) {
      let magnetText = doc.querySelector(CONFIG.selectors.magnetTextarea);
      if (magnetText) {
        const val = magnetText.value.trim();
        if (val.startsWith("magnet:?xt=urn:btih:")) return val;
        const hashMatch = val.match(CONFIG.regex.magnetHash);
        if (hashMatch && hashMatch[1]) return `magnet:?xt=urn:btih:${hashMatch[1]}`;
      }
      let magnetA = doc.querySelector(CONFIG.selectors.magnetLink);
      if (magnetA) {
        const magnet = magnetA.getAttribute("href") || "";
        if (magnet) return magnet;
      }
      if (this.isPaidContent(doc)) return "";
      for (const selector of CONFIG.selectors.contentSelectors) {
        const contentEl = doc.querySelector(selector);
        if (contentEl) {
          const hashMatch = contentEl.innerHTML.match(CONFIG.regex.magnetHash);
          if (hashMatch && hashMatch[1]) return `magnet:?xt=urn:btih:${hashMatch[1]}`;
        }
      }
      return "";
    }
    static extractEd2k(doc) {
      let ed2k = "";
      const ed2kLink = doc.querySelector(CONFIG.selectors.ed2kLink);
      if (ed2kLink && (ed2k = ed2kLink.getAttribute("href") || "", ed2k)) return ed2k;
      if (this.isPaidContent(doc)) return "";
      for (const selector of CONFIG.selectors.contentSelectors) {
        const contentEl = doc.querySelector(selector);
        if (contentEl) {
          const ed2kMatch = contentEl.innerHTML.match(CONFIG.regex.ed2k);
          if (ed2kMatch && ed2kMatch[0]) return ed2kMatch[0];
        }
      }
      return ed2k;
    }
    static extractThunder(doc) {
      if (this.isPaidContent(doc)) return "";
      for (const selector of CONFIG.selectors.contentSelectors) {
        const contentEl = doc.querySelector(selector);
        if (contentEl) {
          const thunderMatch = contentEl.innerHTML.match(CONFIG.regex.thunder);
          if (thunderMatch && thunderMatch[0]) return thunderMatch[0];
        }
      }
      return "";
    }
  }
  class ExternalMagnetExtractor {
    static async extractFromPage(pageContent) {
      try {
        for (const site of CONFIG.btSites) {
          const btMatch = pageContent.match(site.pattern);
          if (btMatch) {
            const hash = site.getHash(btMatch[0]), externalMagnet = await this.fetchFromBtSite(site, hash);
            if (externalMagnet) return this.cleanMagnetLink(externalMagnet);
          }
        }
        return null;
      } catch (error) {
        return null;
      }
    }
    static cleanMagnetLink(magnetLink) {
      const match = magnetLink.match(/magnet:\?xt=urn:btih:([a-f0-9]{40})/i);
      return match ? `magnet:?xt=urn:btih:${match[1]}` : magnetLink;
    }
    static async fetchFromBtSite(site, hash) {
      try {
        return new Promise(resolve => {
          const requestConfig = {
            method: site.method,
            url: "GET" === site.method ? `${site.url}?name=${hash}` : site.url,
            headers: {
              Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
              "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
              "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
              DNT: "1",
              Connection: "keep-alive",
              "Upgrade-Insecure-Requests": "1"
            },
            onload: response => {
              if (response.status >= 200 && response.status < 300) try {
                const doc = (new DOMParser).parseFromString(response.responseText, "text/html"), magnetInput = doc.querySelector("#magnetInput");
                if (magnetInput) {
                  const value = magnetInput.value || magnetInput.getAttribute("value");
                  if (value) {
                    const magnet = value.replace(/&amp;/g, "&");
                    return void resolve(magnet);
                  }
                }
                const magnetBox = doc.querySelector(".magnet-box input");
                if (magnetBox) {
                  const value = magnetBox.getAttribute("value") || magnetBox.value;
                  if (value) {
                    const magnet = value.replace(/&amp;/g, "&");
                    return void resolve(magnet);
                  }
                }
                const magnetMatch = response.responseText.match(/magnet:\?xt=urn:btih:[a-f0-9]{40}[^"'\s]*/i);
                if (magnetMatch) {
                  const magnet = magnetMatch[0].replace(/&amp;/g, "&");
                  return void resolve(magnet);
                }
                resolve(null);
              } catch (parseError) {
                resolve(null);
              } else resolve(null);
            },
            onerror: () => resolve(null),
            ontimeout: () => resolve(null)
          };
          if ("POST" === site.method) {
            requestConfig.headers["Content-Type"] = "application/x-www-form-urlencoded", requestConfig.headers.Referer = site.referer, 
            requestConfig.headers.Origin = site.referer;
            const paramData = {};
            paramData[site.paramName] = hash, requestConfig.data = new URLSearchParams(paramData).toString();
          }
          GM_xmlhttpRequest(requestConfig);
        });
      } catch (e) {
        return null;
      }
    }
  }
  const _Lightbox = class {
    static init() {
      this.overlay || (this.overlay = document.createElement("div"), this.overlay.style.cssText = "\n      position: fixed;\n      top: 0;\n      left: 0;\n      width: 100%;\n      height: 100%;\n      background: rgba(0, 0, 0, 0.95);\n      z-index: 999999;\n      display: none;\n      align-items: center;\n      justify-content: center;\n    ", 
      this.img = document.createElement("img"), this.img.style.cssText = "\n      width: 80vw;\n      height: 80vh;\n      max-width: 90%;\n      max-height: 90%;\n      object-fit: contain;\n      border-radius: 4px;\n    ", 
      this.counter = document.createElement("div"), this.counter.style.cssText = "\n      position: absolute;\n      top: 20px;\n      left: 50%;\n      transform: translateX(-50%);\n      color: white;\n      background: rgba(0, 0, 0, 0.6);\n      padding: 8px 16px;\n      border-radius: 20px;\n      font-size: 14px;\n    ", 
      this.prevBtn = this.createNavButton("‹", "left"), this.nextBtn = this.createNavButton("›", "right"), 
      this.closeBtn = this.createCloseButton(), this.overlay.appendChild(this.img), this.overlay.appendChild(this.counter), 
      this.overlay.appendChild(this.prevBtn), this.overlay.appendChild(this.nextBtn), 
      this.overlay.appendChild(this.closeBtn), document.body.appendChild(this.overlay), 
      this.setupEvents());
    }
    static createNavButton(content, position) {
      const btn = document.createElement("button");
      return btn.innerHTML = "‹" === content ? '<svg viewBox="0 0 24 24" fill="white" width="50" height="50"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>' : '<svg viewBox="0 0 24 24" fill="white" width="50" height="50"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>', 
      btn.style.cssText = `\n      position: fixed;\n      ${position}: 20px;\n      top: 50%;\n      transform: translateY(-50%);\n      width: 60px;\n      height: 240px;\n      background: rgba(255, 255, 255, 0.1);\n      border-radius: 30px;\n      border: none;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      color: white;\n      cursor: pointer;\n      user-select: none;\n      z-index: 10002;\n      transition: all 0.3s;\n      backdrop-filter: blur(4px);\n    `, 
      btn.onmouseover = () => {
        btn.style.background = "rgba(255, 255, 255, 0.2)", btn.style.width = "70px";
      }, btn.onmouseout = () => {
        btn.style.background = "rgba(255, 255, 255, 0.1)", btn.style.width = "60px";
      }, btn;
    }
    static createCloseButton() {
      const btn = document.createElement("button");
      return btn.innerHTML = '<svg viewBox="0 0 24 24" fill="white" width="30" height="30"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>', 
      btn.style.cssText = "\n      position: fixed;\n      right: 20px;\n      top: 20px;\n      width: 50px;\n      height: 50px;\n      background: rgba(255, 255, 255, 0.2);\n      border-radius: 50%;\n      border: none;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      cursor: pointer;\n      user-select: none;\n      z-index: 10002;\n      transition: background 0.2s;\n    ", 
      btn.onmouseover = () => {
        btn.style.background = "rgba(255, 255, 255, 0.3)";
      }, btn.onmouseout = () => {
        btn.style.background = "rgba(255, 255, 255, 0.2)";
      }, btn;
    }
    static setupEvents() {
      this.overlay.onclick = () => {
        this.close();
      }, this.prevBtn.onclick = e => {
        e.stopPropagation(), this.prev();
      }, this.nextBtn.onclick = e => {
        e.stopPropagation(), this.next();
      }, this.closeBtn.onclick = e => {
        e.stopPropagation(), this.close();
      }, document.addEventListener("keydown", e => {
        "flex" === this.overlay?.style.display && ("Escape" === e.key ? this.close() : "ArrowLeft" === e.key ? this.prev() : "ArrowRight" === e.key && this.next());
      });
    }
    static show(images, index = 0) {
      this.init(), this.images = images, this.currentIndex = index, this.updateImage(), 
      this.overlay.style.display = "flex";
    }
    static close() {
      this.overlay && (this.overlay.style.display = "none");
    }
    static prev() {
      this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length, 
      this.updateImage();
    }
    static next() {
      this.currentIndex = (this.currentIndex + 1) % this.images.length, this.updateImage();
    }
    static updateImage() {
      const url = this.images[this.currentIndex];
      this.img.style.display = "none", this.img.src = "", this.counter.textContent = `${this.currentIndex + 1} / ${this.images.length}`, 
      this.images.length <= 1 ? (this.prevBtn.style.display = "none", this.nextBtn.style.display = "none", 
      this.counter.style.display = "none") : (this.prevBtn.style.display = "flex", this.nextBtn.style.display = "flex", 
      this.counter.style.display = "block"), this.img.onload = () => {
        this.img.style.display = "block";
      }, this.img.onerror = () => {
        this.img.alt = "图片加载失败";
      }, this.img.src = url;
    }
  };
  _Lightbox.overlay = null, _Lightbox.img = null, _Lightbox.counter = null, _Lightbox.prevBtn = null, 
  _Lightbox.nextBtn = null, _Lightbox.closeBtn = null, _Lightbox.images = [], _Lightbox.currentIndex = 0;
  let Lightbox = _Lightbox;
  class UIComponents {
    static buildPreviewUI(tr, previewData) {
      const {imgSrcs: imgSrcs, magnet: magnet, ed2k: ed2k, thunder: thunder} = previewData;
      if (tr.nextElementSibling && tr.nextElementSibling.classList.contains("imagePreviewTr")) return;
      tr.classList.add("thread-title-highlighted");
      const newTr = document.createElement("tr");
      newTr.className = "imagePreviewTr";
      const newTd = document.createElement("td");
      newTd.colSpan = tr.children.length, newTd.style.cssText = "padding: 15px 20px; background: #fafafa;", 
      imgSrcs.length && newTd.appendChild(this.createImageSection(imgSrcs)), magnet && newTd.appendChild(this.createInfoSection(magnet)), 
      ed2k && newTd.appendChild(this.createEd2kSection(ed2k)), thunder && newTd.appendChild(this.createThunderSection(thunder)), 
      newTr.appendChild(newTd), tr.parentNode.insertBefore(newTr, tr.nextSibling);
    }
    static createImageSection(imgSrcs) {
      const validImgSrcs = imgSrcs.filter(src => src && src.startsWith("http"));
      if (0 === validImgSrcs.length) return document.createElement("div");
      const imgContainer = document.createElement("div");
      return imgContainer.style.cssText = "\n      display: flex !important;\n      gap: 12px !important;\n      width: 100% !important;\n      margin-bottom: 16px !important;\n    ", 
      validImgSrcs.forEach((src, index) => {
        const wrapper = document.createElement("div");
        wrapper.style.cssText = "\n        flex: 1 !important;\n        min-width: 0 !important;\n        height: 200px !important;\n        background: #f5f5f5 !important;\n        border-radius: 4px !important;\n        overflow: hidden !important;\n        cursor: pointer !important;\n        display: flex !important;\n        align-items: center !important;\n        justify-content: center !important;\n      ";
        const img = document.createElement("img");
        img.src = src, img.loading = "lazy", img.style.cssText = "\n        max-width: 100% !important;\n        max-height: 100% !important;\n        width: auto !important;\n        height: auto !important;\n        object-fit: contain !important;\n        display: block !important;\n      ", 
        wrapper.onclick = e => {
          e.preventDefault(), e.stopPropagation(), Lightbox.show(validImgSrcs, index);
        }, wrapper.appendChild(img), imgContainer.appendChild(wrapper);
      }), imgContainer;
    }
    static createInfoSection(magnet) {
      const linkDiv = document.createElement("div");
      return linkDiv.style.cssText = "\n      font-size: 13px;\n      word-break: break-all;\n      cursor: pointer;\n      padding: 10px 12px;\n      background: #f0f9ff;\n      border: 1px solid #e0f2fe;\n      border-radius: 4px;\n      margin-bottom: 10px;\n    ", 
      linkDiv.textContent = magnet, linkDiv.title = "点击链接可复制", linkDiv.onclick = function(e) {
        Utils.copyToClipboard(magnet, e);
      }, linkDiv;
    }
    static createEd2kSection(ed2k) {
      const linkDiv = document.createElement("div");
      return linkDiv.style.cssText = "\n      font-size: 13px;\n      word-break: break-all;\n      cursor: pointer;\n      padding: 10px 12px;\n      background: #f0f9ff;\n      border: 1px solid #e0f2fe;\n      border-radius: 4px;\n      margin-bottom: 10px;\n    ", 
      linkDiv.textContent = ed2k, linkDiv.title = "点击ed2k链接可复制", linkDiv.onclick = function(e) {
        Utils.copyToClipboard(ed2k, e);
      }, linkDiv;
    }
    static createThunderSection(thunder) {
      const linkDiv = document.createElement("div");
      return linkDiv.style.cssText = "\n      font-size: 13px;\n      word-break: break-all;\n      cursor: pointer;\n      padding: 10px 12px;\n      background: #f0f9ff;\n      border: 1px solid #e0f2fe;\n      border-radius: 4px;\n      margin-bottom: 10px;\n    ", 
      linkDiv.textContent = thunder, linkDiv.title = "点击迅雷链接可复制", linkDiv.onclick = function(e) {
        Utils.copyToClipboard(thunder, e);
      }, linkDiv;
    }
  }
  const _SearchFilter = class {
    static init() {
      this.initialized || this.isSearchResultPage() && (this.filterSearchResults(), this.removeNativePreviews(), 
      this.updateResultStats(), this.initialized = !0);
    }
    static isSearchResultPage() {
      if (!window.location.href.includes("search.php")) return !1;
      const searchTable = document.querySelector(".t table"), searchRows = document.querySelectorAll('tr[id^="search_"]');
      return !!(searchTable && searchRows.length > 0);
    }
    static extractForumId(row) {
      const id = row.getAttribute("id");
      if (id && id.startsWith("search_")) {
        const parts = id.split("_");
        if (parts.length >= 2) return parts[1];
      }
      return null;
    }
    static getExcludedForums() {
      return CONFIG.getExcludedForums();
    }
    static removeNativePreviews() {
      const nativeCheckbox = document.querySelector('input[name="hide_thumb"]');
      nativeCheckbox && !nativeCheckbox.checked && (nativeCheckbox.checked = !0);
      const nativePreviews = document.querySelectorAll(".search-img-group");
      nativePreviews.length > 0 && nativePreviews.forEach(el => el.remove());
    }
    static filterSearchResults() {
      const excludedForums = this.getExcludedForums();
      if (0 === excludedForums.length) return;
      const searchRows = document.querySelectorAll('tr[id^="search_"]');
      this.totalCount = searchRows.length;
      let hiddenCount = 0;
      searchRows.forEach(row => {
        const forumId = this.extractForumId(row);
        if (forumId && excludedForums.includes(forumId)) {
          row.style.display = "none";
          const nextRow = row.nextElementSibling;
          nextRow && nextRow.classList.contains("imagePreviewTr") && (nextRow.style.display = "none"), 
          hiddenCount++;
        }
      }), this.filteredCount = hiddenCount;
    }
    static updateResultStats() {
      if (0 === this.filteredCount) return;
      const headerCell = document.querySelector(".t table .h");
      if (headerCell) {
        const originalText = headerCell.textContent || "主题列表", visibleCount = this.totalCount - this.filteredCount;
        headerCell.textContent = `${originalText} (显示 ${visibleCount}/${this.totalCount} 条结果，已过滤 ${this.filteredCount} 条)`, 
        headerCell.setAttribute("title", `已根据设置隐藏${this.filteredCount}条不相关结果`);
      }
    }
    static reapplyFilter() {
      this.isSearchResultPage() && (document.querySelectorAll('tr[id^="search_"], tr.imagePreviewTr').forEach(row => {
        row.style.display = "";
      }), this.filteredCount = 0, this.filterSearchResults(), this.updateResultStats());
    }
    static getFilterStats() {
      return {
        total: this.totalCount,
        filtered: this.filteredCount,
        visible: this.totalCount - this.filteredCount
      };
    }
    static clearAllFilters() {
      CONFIG.setExcludedForums([]), this.reapplyFilter();
    }
    static addExcludedForum(forumId) {
      const currentExcluded = this.getExcludedForums();
      currentExcluded.includes(forumId) || (currentExcluded.push(forumId), CONFIG.setExcludedForums(currentExcluded), 
      this.reapplyFilter());
    }
    static removeExcludedForum(forumId) {
      const newExcluded = this.getExcludedForums().filter(id => id !== forumId);
      CONFIG.setExcludedForums(newExcluded), this.reapplyFilter();
    }
    static toggleForumExclusion(forumId) {
      this.getExcludedForums().includes(forumId) ? this.removeExcludedForum(forumId) : this.addExcludedForum(forumId);
    }
    static shouldFilterRow(row) {
      const forumId = this.extractForumId(row), excludedForums = this.getExcludedForums();
      return !!forumId && excludedForums.includes(forumId);
    }
  };
  _SearchFilter.initialized = !1, _SearchFilter.filteredCount = 0, _SearchFilter.totalCount = 0;
  let SearchFilter = _SearchFilter;
  class PreviewProcessor {
    static async processThreadLink(link) {
      const threadURL = link.href;
      if (!threadURL || !CONFIG.regex.threadUrl.test(threadURL)) return;
      const tr = link.closest("tr");
      if (tr && !tr.querySelector('img[src*="headtopic"]') && !SearchFilter.shouldFilterRow(tr)) try {
        const response = await fetch(threadURL), pageContent = await response.text(), doc = (new DOMParser).parseFromString(pageContent, "text/html"), isPaid = DataExtractor.isPaidContent(doc);
        let magnet = DataExtractor.extractMagnet(doc);
        magnet || isPaid || (magnet = await ExternalMagnetExtractor.extractFromPage(pageContent) || "");
        const previewData = {
          imgSrcs: DataExtractor.extractImages(doc),
          magnet: magnet || "",
          ed2k: DataExtractor.extractEd2k(doc),
          thunder: DataExtractor.extractThunder(doc)
        };
        if (!(previewData.imgSrcs.length || previewData.magnet || previewData.ed2k || previewData.thunder)) return;
        UIComponents.buildPreviewUI(tr, previewData);
      } catch (e) {}
    }
  }
  const _Toast = class {
    static initContainer() {
      return this.container || (this.container = document.createElement("div"), this.container.id = "toast-container", 
      Object.assign(this.container.style, {
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: "99999",
        pointerEvents: "none"
      }), document.body.appendChild(this.container)), this.container;
    }
    static show(message, type = "info", duration = 4e3) {
      const container = this.initContainer(), toast = document.createElement("div");
      return toast.textContent = message, Object.assign(toast.style, {
        padding: "12px 20px",
        marginBottom: "10px",
        borderRadius: "6px",
        color: "white",
        boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
        opacity: "0",
        transform: "translateX(100%)",
        transition: "all 0.3s ease-out",
        fontSize: "14px",
        fontWeight: "400",
        maxWidth: "300px",
        wordWrap: "break-word",
        pointerEvents: "auto",
        cursor: "pointer"
      }), toast.style.backgroundColor = {
        success: "#10B981",
        error: "#EF4444",
        warning: "#F59E0B",
        info: "#3B82F6"
      }[type], toast.addEventListener("click", () => {
        this.removeToast(toast);
      }), container.appendChild(toast), setTimeout(() => {
        toast.style.opacity = "1", toast.style.transform = "translateX(0)";
      }, 10), duration > 0 && setTimeout(() => {
        this.removeToast(toast);
      }, duration), toast;
    }
    static removeToast(toast) {
      toast.style.opacity = "0", toast.style.transform = "translateX(100%)", setTimeout(() => {
        toast.parentNode && toast.remove();
      }, 300);
    }
    static success(message, duration = 4e3) {
      return this.show(message, "success", duration);
    }
    static error(message, duration = 5e3) {
      return this.show(message, "error", duration);
    }
    static warning(message, duration = 4e3) {
      return this.show(message, "warning", duration);
    }
    static info(message, duration = 3e3) {
      return this.show(message, "info", duration);
    }
  };
  _Toast.container = null;
  let Toast = _Toast;
  const _AutoCheckIn = class {
    static get CHECK_IN_URL() {
      return `${Utils.getBaseUrl()}/hack.php?H_name=qiandao`;
    }
    static get FORUM_URL() {
      return `${Utils.getBaseUrl()}/thread.php?fid=${this.FORUM_ID}`;
    }
    static syncStatusFromCache(buttonElement) {
      try {
        const cache = this.getStatusCache(), today = this.getTodayDate();
        cache && cache.date === today && cache.signed ? this.updateButtonStatus(buttonElement, !0) : buttonElement && (buttonElement.textContent = "自动签到", 
        buttonElement.title = "点击自动签到");
      } catch (error) {
        buttonElement && (buttonElement.textContent = "自动签到", buttonElement.title = "点击自动签到");
      }
    }
    static async initStatusCheck(buttonElement) {
      try {
        const today = this.getTodayDate(), stats = await this.getCheckInStats();
        if (!stats) return void this.updateButtonStatus(buttonElement, !1);
        const signed = this.parseSignDate(stats.lastSignTime) === today;
        this.setStatusCache(signed, stats.lastSignTime), this.updateButtonStatus(buttonElement, signed);
      } catch (error) {}
    }
    static async execute(buttonElement) {
      try {
        const today = this.getTodayDate();
        Toast.show("正在检查签到状态...", "info", 2e3);
        const stats = await this.getCheckInStats();
        let alreadySigned = !1;
        if (stats && (alreadySigned = this.parseSignDate(stats.lastSignTime) === today, 
        alreadySigned)) return Toast.show("✅ 今天已经签到过了", "success", 2e3), this.setStatusCache(!0, stats.lastSignTime), 
        void this.updateButtonStatus(buttonElement, !0);
        const replyStatus = this.getReplyStatus();
        if (replyStatus && replyStatus.date === today && replyStatus.replied) Toast.show("今日已回帖，直接进入签到...", "info", 2e3); else {
          Toast.show("开始自动回复帖子...", "info", 2e3);
          try {
            await this.autoReply(), this.setReplyStatus(!0), Toast.show("✅ 回帖成功！等待2秒后打开签到页...", "success", 2e3), 
            await this.sleep(2e3);
          } catch (error) {
            return void Toast.show("回复帖子失败: " + error.message, "error", 3e3);
          }
        }
        const moods = [ "kx", "fd", "yl" ], selectedMood = moods[Math.floor(Math.random() * moods.length)];
        await this.sleep(500), await this.checkHasCaptcha() ? (Toast.show("检测到验证码，请完成验证", "info", 2e3), 
        this.openCheckInPopup(buttonElement, selectedMood)) : (Toast.show("正在自动签到...", "info", 2e3), 
        await this.autoCheckInWithoutCaptcha(selectedMood) ? (Toast.show("✅ 签到成功！", "success", 3e3), 
        this.setStatusCache(!0, ""), this.updateButtonStatus(buttonElement, !0), setTimeout(() => window.location.reload(), 1500)) : Toast.show("❌ 签到失败，请重试", "error", 3e3));
      } catch (error) {
        Toast.show("自动签到失败: " + error.message, "error", 3e3);
      }
    }
    static async getCheckInStats() {
      try {
        const response = await fetch(this.CHECK_IN_URL, {
          credentials: "include",
          cache: "no-cache"
        }), html = await response.text(), doc = (new DOMParser).parseFromString(html, "text/html");
        if (html.includes("slider_captcha") || html.includes("sliderbox") || html.includes("verify_token") || html.includes("验证码") || html.includes("captcha") || html.includes("verifycode")) {
          const selectors = [ ".stats", ".signarea .stats", ".qiandao_text", ".sign-info", 'div[class*="stat"]', 'div[class*="sign"]' ];
          let statsDiv = null;
          for (const selector of selectors) if (statsDiv = doc.querySelector(selector), statsDiv) break;
          if (!statsDiv) {
            const totalMatch2 = html.match(/累计签到[：:]\s*(\d+)\s*天/), monthMatch2 = html.match(/本月[：:]\s*(\d+)\s*天/), timeMatch2 = html.match(/上次签到[：:]\s*(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2})/);
            return totalMatch2 || monthMatch2 || timeMatch2 ? {
              totalDays: totalMatch2 ? parseInt(totalMatch2[1]) : 0,
              monthDays: monthMatch2 ? parseInt(monthMatch2[1]) : 0,
              lastSignTime: timeMatch2 ? timeMatch2[1] : ""
            } : null;
          }
          const statsText = statsDiv.textContent || "", totalMatch = statsText.match(/累计签到[：:]\s*(\d+)\s*天/), totalDays = totalMatch ? parseInt(totalMatch[1]) : 0, monthMatch = statsText.match(/本月[：:]\s*(\d+)\s*天/), monthDays = monthMatch ? parseInt(monthMatch[1]) : 0, timeMatch = statsText.match(/上次签到[：:]\s*(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2})/);
          return {
            totalDays: totalDays,
            monthDays: monthDays,
            lastSignTime: timeMatch ? timeMatch[1] : ""
          };
        }
        {
          const tacTd = doc.querySelector("td.tac") || doc.querySelector('td[class*="tac"]');
          if (!tacTd) {
            const totalMatch2 = html.match(/您累计已签到[：:]\s*<b>(\d+)<\/b>\s*天/), monthMatch2 = html.match(/您本月已累计签到[：:]\s*<b>(\d+)<\/b>\s*天/), timeMatch2 = html.match(/您上次签到时间[：:]\s*<font[^>]*>(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2})<\/font>/);
            return totalMatch2 || monthMatch2 || timeMatch2 ? {
              totalDays: totalMatch2 ? parseInt(totalMatch2[1]) : 0,
              monthDays: monthMatch2 ? parseInt(monthMatch2[1]) : 0,
              lastSignTime: timeMatch2 ? timeMatch2[1] : ""
            } : null;
          }
          const tacText = tacTd.textContent || "", tacHtml = tacTd.innerHTML || "", totalMatch = tacHtml.match(/您累计已签到[：:]\s*<b>(\d+)<\/b>\s*天/) || tacText.match(/您累计已签到[：:]\s*(\d+)\s*天/), totalDays = totalMatch ? parseInt(totalMatch[1]) : 0, monthMatch = tacHtml.match(/您本月已累计签到[：:]\s*<b>(\d+)<\/b>\s*天/) || tacText.match(/您本月已累计签到[：:]\s*(\d+)\s*天/), monthDays = monthMatch ? parseInt(monthMatch[1]) : 0, timeMatch = tacHtml.match(/您上次签到时间[：:]\s*<font[^>]*>(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2})<\/font>/) || tacText.match(/您上次签到时间[：:]\s*(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2})/);
          return {
            totalDays: totalDays,
            monthDays: monthDays,
            lastSignTime: timeMatch ? timeMatch[1] : ""
          };
        }
      } catch (error) {
        return null;
      }
    }
    static parseSignDate(signTime) {
      if (!signTime) return "";
      const match = signTime.match(/(\d{4}-\d{2}-\d{2})/);
      return match ? match[1] : "";
    }
    static async checkHasCaptcha() {
      try {
        const response = await fetch(this.CHECK_IN_URL, {
          credentials: "include",
          cache: "no-cache"
        }), html = await response.text(), hasSlider = html.includes("slider_captcha") || html.includes("sliderbox") || html.includes("verify_token") || html.includes("slider") || html.includes("captcha"), hasCaptchaInput = html.includes("验证码") || html.includes("captcha") || html.includes("verifycode");
        return hasSlider || hasCaptchaInput;
      } catch (error) {
        return !0;
      }
    }
    static getCurrentUsername() {
      try {
        const userLink = document.querySelector('#td_userinfomore[href*="u.php?action=show"]');
        if (userLink) {
          const username = userLink.textContent?.trim() || userLink.querySelector("span")?.textContent?.trim();
          if (username) return username;
        }
        const usernameElements = document.querySelectorAll('a[href*="u.php?action=show"]');
        for (const el of usernameElements) {
          const text = el.textContent?.trim();
          if (text && text.length > 0 && text.length < 50) return text;
        }
        return null;
      } catch (error) {
        return null;
      }
    }
    static checkLoginStatus() {
      const userLink = document.querySelector('#td_userinfomore[href*="u.php?action=show"]'), loginLink = document.querySelector('a[href="login.php"]');
      return !!userLink && !loginLink;
    }
    static async autoCheckInWithoutCaptcha(mood) {
      try {
        const isLoggedIn = this.checkLoginStatus();
        if (this.getCurrentUsername(), !isLoggedIn) return !1;
        const pageResponse = await fetch(this.CHECK_IN_URL, {
          credentials: "include",
          cache: "no-cache"
        }), pageHtml = await pageResponse.text(), parser = new DOMParser, doc = parser.parseFromString(pageHtml, "text/html");
        let hycodeInput = doc.querySelector("#input_bbb"), hyrandstrInput = doc.querySelector("#randstr_bbb");
        hycodeInput || (hycodeInput = doc.querySelector('input[name="hycode"]')), hyrandstrInput || (hyrandstrInput = doc.querySelector('input[name="hyrandstr"]'));
        const hycode = hycodeInput?.value || "", hyrandstr = hyrandstrInput?.value || "", form = doc.querySelector("form"), allHiddenInputs = form ? Array.from(form.querySelectorAll('input[type="hidden"]')) : [], formData = new URLSearchParams;
        formData.append("action", "qiandao"), formData.append("qdxq", mood);
        for (const input of allHiddenInputs) {
          const name = input.name, value = input.value;
          name && formData.append(name, value);
        }
        formData.has("method") || formData.append("method", "AND"), formData.has("sch_area") || formData.append("sch_area", "0"), 
        formData.has("f_fid") || formData.append("f_fid", "0"), formData.has("sch_time") || formData.append("sch_time", "all"), 
        formData.append("hycode", hycode), formData.append("hyrandstr", hyrandstr);
        const response = await fetch(this.CHECK_IN_URL, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: formData.toString()
        }), html = await response.text(), hasSuccess = html.includes("签到成功") || html.includes("恭喜你签到成功"), hasTodayAlready = html.includes("今天已签到") || html.includes("今日已签到"), needEmail = html.includes("必须绑定邮箱") || html.includes("绑定邮箱");
        if (html.includes("提示信息") || html.includes("错误"), needEmail) return !1;
        if (!hasSuccess && !hasTodayAlready) {
          const responseDoc = parser.parseFromString(html, "text/html");
          let errorMsg = "";
          const msgDiv = responseDoc.querySelector('div[class*="msg"], div[class*="tip"], div[class*="error"]');
          if (msgDiv && (errorMsg = msgDiv.textContent?.trim() || ""), !errorMsg) {
            const title = responseDoc.querySelector("title");
            title && title.textContent?.includes("提示") && (errorMsg = title.textContent);
          }
          if (!errorMsg) {
            const patterns = [ /<div[^>]*class="[^"]*msg[^"]*"[^>]*>([^<]+)<\/div>/i, /<div[^>]*class="[^"]*tip[^"]*"[^>]*>([^<]+)<\/div>/i, /<div[^>]*class="[^"]*error[^"]*"[^>]*>([^<]+)<\/div>/i, /alert\(['"]([^'"]+)['"]\)/i, /提示[：:]\s*([^<\n]+)/i, /错误[：:]\s*([^<\n]+)/i ];
            for (const pattern of patterns) {
              const match = html.match(pattern);
              if (match && match[1]) {
                errorMsg = match[1].trim();
                break;
              }
            }
          }
        }
        return hasSuccess || hasTodayAlready;
      } catch (error) {
        return !1;
      }
    }
    static async openCheckInPopup(buttonElement, selectedMood) {
      Toast.show("🎯 请完成滑块验证", "info", 2e3);
      try {
        const modal = document.createElement("div");
        modal.id = "checkin-slider-modal", modal.style.cssText = "\n        position: fixed;\n        top: 120px;\n        right: 20px;\n        background: #fff;\n        border-radius: 16px;\n        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);\n        padding: 20px;\n        z-index: 99999;\n        animation: slideIn 0.3s;\n        width: 380px;\n      ";
        const header = document.createElement("div");
        header.style.cssText = "\n        display: flex;\n        justify-content: space-between;\n        align-items: center;\n        margin-bottom: 16px;\n      ";
        const title = document.createElement("div");
        title.textContent = "🎯 签到验证", title.style.cssText = "\n        font-size: 16px;\n        font-weight: 600;\n        color: #333;\n      ";
        const closeBtn = document.createElement("button");
        closeBtn.textContent = "✕", closeBtn.style.cssText = "\n        width: 28px;\n        height: 28px;\n        border: none;\n        border-radius: 50%;\n        background: #f0f0f0;\n        color: #666;\n        font-size: 18px;\n        cursor: pointer;\n        transition: 0.2s;\n      ", 
        closeBtn.onmouseover = () => closeBtn.style.background = "#e0e0e0", closeBtn.onmouseout = () => closeBtn.style.background = "#f0f0f0", 
        closeBtn.onclick = () => modal.remove(), header.appendChild(title), header.appendChild(closeBtn);
        const iframeContainer = document.createElement("div");
        iframeContainer.style.cssText = "\n        position: relative;\n        width: 360px;\n        height: 300px;\n        overflow: hidden;\n        border-radius: 8px;\n        background: #fafafa;\n      ";
        const iframe = document.createElement("iframe");
        iframe.src = this.CHECK_IN_URL, iframe.style.cssText = "\n        width: 1200px;\n        height: 2000px;\n        border: none;\n        position: absolute;\n        top: -600px;\n        left: -420px;\n        transform: scale(1);\n      ", 
        iframeContainer.appendChild(iframe), modal.appendChild(header), modal.appendChild(iframeContainer), 
        document.body.appendChild(modal), iframe.onload = () => {
          try {
            try {
              const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
              if (iframeDoc) {
                const sliderEl = iframeDoc.querySelector("#slider_captcha, .sliderbox");
                if (sliderEl) {
                  const rect = sliderEl.getBoundingClientRect();
                  iframe.style.top = `-${rect.top - 10}px`, iframe.style.left = `-${rect.left - 20}px`, 
                  Toast.show("✅ 验证加载完成，请拖动滑块", "success", 2e3);
                } else Toast.show("⚠️ 请在下方完成滑块验证", "info", 2e3);
              }
            } catch (e) {
              Toast.show("✅ 验证加载完成，请拖动滑块", "success", 2e3);
            }
            const checkInterval = setInterval(() => {
              try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                if (!iframeDoc) return;
                const tokenInput = iframeDoc.querySelector("#verify_token");
                if (tokenInput && tokenInput.value) {
                  clearInterval(checkInterval);
                  const token = tokenInput.value;
                  Toast.show("✅ 验证成功，正在签到...", "info", 2e3), modal.remove(), this.submitCheckInWithToken(token, selectedMood).then(success => {
                    success ? (Toast.show("✅ 签到成功！", "success", 3e3), this.setStatusCache(!0, ""), this.updateButtonStatus(buttonElement, !0), 
                    setTimeout(() => window.location.reload(), 1500)) : Toast.show("❌ 签到失败，请重试", "error", 3e3);
                  });
                }
              } catch (e) {}
            }, 500);
            setTimeout(() => clearInterval(checkInterval), 6e4);
          } catch (error) {}
        };
        const style = document.createElement("style");
        style.textContent = "\n        @keyframes slideIn {\n          from {\n            transform: translateX(400px);\n            opacity: 0;\n          }\n          to {\n            transform: translateX(0);\n            opacity: 1;\n          }\n        }\n      ", 
        document.querySelector("#checkin-slider-animation") || (style.id = "checkin-slider-animation", 
        document.head.appendChild(style));
      } catch (error) {
        Toast.show("❌ 加载失败: " + error.message, "error", 3e3);
      }
    }
    static async submitCheckInWithToken(token, mood) {
      try {
        const formData = new URLSearchParams;
        formData.append("action", "qiandao"), formData.append("qdxq", mood), formData.append("verify_token", token);
        const response = await fetch(this.CHECK_IN_URL, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: formData.toString()
        }), html = await response.text(), hasSuccess = html.includes("签到成功") || html.includes("恭喜你签到成功"), hasTodayAlready = html.includes("今天已签到") || html.includes("今日已签到");
        return hasSuccess || hasTodayAlready;
      } catch (error) {
        return !1;
      }
    }
    static getTodayDate() {
      const now = new Date;
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    }
    static getStatusCache() {
      try {
        return Storage.get(this.STATUS_CACHE_KEY, null);
      } catch {
        return null;
      }
    }
    static setStatusCache(signed, lastSignDate = "") {
      try {
        const cache = {
          date: this.getTodayDate(),
          signed: signed,
          lastSignDate: lastSignDate,
          timestamp: Date.now()
        };
        Storage.set(this.STATUS_CACHE_KEY, cache);
      } catch (error) {}
    }
    static getReplyStatus() {
      try {
        return Storage.get(this.REPLY_CACHE_KEY, null);
      } catch {
        return null;
      }
    }
    static setReplyStatus(replied) {
      try {
        const cache = {
          date: this.getTodayDate(),
          replied: replied,
          timestamp: Date.now()
        };
        Storage.set(this.REPLY_CACHE_KEY, cache);
      } catch (error) {}
    }
    static updateButtonStatus(buttonElement, signed) {
      buttonElement && (signed ? (buttonElement.textContent = "今日已签 ✓", buttonElement.style.opacity = "0.6", 
      buttonElement.style.cursor = "not-allowed", buttonElement.style.pointerEvents = "none", 
      buttonElement.title = "今天已经签到过了") : (buttonElement.textContent = "自动签到", buttonElement.style.opacity = "1", 
      buttonElement.style.cursor = "pointer", buttonElement.style.pointerEvents = "", 
      buttonElement.title = "点击自动签到"));
    }
    static async autoReply() {
      const threads = await this.getRecentThreads();
      if (0 === threads.length) throw new Error("未找到可回复的帖子（两天内无新帖）");
      const unReplied = await this.findUnrepliedThread(threads);
      if (!unReplied) throw new Error("未找到可回复的帖子（所有帖子都已回复）");
      await this.replyThread(unReplied);
    }
    static async getRecentThreads() {
      try {
        const response = await fetch(this.FORUM_URL, {
          credentials: "include"
        }), html = await response.text(), doc = (new DOMParser).parseFromString(html, "text/html"), threads = [], twoDaysAgo = new Date((new Date).getTime() - 1728e5), rows = doc.querySelectorAll("tr.tr3.t_one");
        for (const row of Array.from(rows)) {
          if (row.querySelector('img[src*="headtopic"]')) continue;
          const allLinks = row.querySelectorAll('a[href*="read.php?tid="]');
          let link = null;
          for (const l of Array.from(allLinks)) if ((l.textContent?.trim() || "").length > 3) {
            link = l;
            break;
          }
          if (!link) continue;
          const title = link.textContent?.trim() || "";
          if (!title || "⊙" === title) continue;
          const url = link.href, tidMatch = url.match(/tid=(\d+)/);
          if (!tidMatch) continue;
          const tid = tidMatch[1], dateText = row.querySelector("td:last-child")?.textContent?.trim() || "";
          this.isWithinTwoDays(dateText, twoDaysAgo) && threads.push({
            tid: tid,
            title: title,
            url: url,
            date: dateText
          });
        }
        return threads;
      } catch (error) {
        return [];
      }
    }
    static isWithinTwoDays(dateText, twoDaysAgo) {
      return !!(dateText.includes("小时前") || dateText.includes("分钟前") || dateText.includes("今天") || "昨天" === dateText) || !!dateText.match(/(\d{4})-(\d{2})-(\d{2})/) && new Date(dateText) >= twoDaysAgo;
    }
    static async findUnrepliedThread(threads) {
      const repliedTids = this.getRepliedThreads();
      for (const thread of threads) if (!repliedTids.includes(thread.tid)) return thread;
      return threads[0] || null;
    }
    static async replyThread(thread) {
      try {
        const response = await fetch(thread.url, {
          credentials: "include"
        }), html = await response.text(), form = (new DOMParser).parseFromString(html, "text/html").querySelector('form[name="FORM"]');
        if (!form) throw new Error("未找到回复表单");
        const replyContent = this.getRandomReply(), formData = new FormData;
        formData.append("step", "2"), formData.append("tid", thread.tid), formData.append("atc_content", replyContent), 
        formData.append("atc_title", "RE: " + thread.title.substring(0, 50)), form.querySelectorAll('input[type="hidden"]').forEach(input => {
          const name = input.name, value = input.value;
          name && value && formData.append(name, value);
        });
        const replyResponse = await fetch(`${Utils.getBaseUrl()}/post.php?`, {
          method: "POST",
          credentials: "include",
          body: formData
        }), replyResult = await replyResponse.text();
        if (!replyResponse.ok || replyResult.includes("错误") || replyResult.includes("失败")) throw new Error("回复请求失败");
        this.saveRepliedThread(thread.tid);
      } catch (error) {
        throw error;
      }
    }
    static getRandomReply() {
      return this.REPLY_POOL[Math.floor(Math.random() * this.REPLY_POOL.length)];
    }
    static getRepliedThreads() {
      try {
        const sevenDaysAgo = Date.now() - 6048e5, recent = (Storage.get("REPLIED_THREADS_TIME", []) || []).filter(item => item.time > sevenDaysAgo);
        return Storage.set("REPLIED_THREADS_TIME", recent), recent.map(item => item.tid);
      } catch {
        return [];
      }
    }
    static saveRepliedThread(tid) {
      try {
        const stored = Storage.get("REPLIED_THREADS_TIME", []) || [];
        stored.push({
          tid: tid,
          time: Date.now()
        }), Storage.set("REPLIED_THREADS_TIME", stored);
      } catch (error) {}
    }
    static sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  };
  _AutoCheckIn.FORUM_ID = "57", _AutoCheckIn.REPLY_CACHE_KEY = "DAILY_REPLY_STATUS_V3", 
  _AutoCheckIn.STATUS_CACHE_KEY = "CHECK_IN_STATUS_V3", _AutoCheckIn.REPLY_POOL = [ "楼主辛苦了，内容很棒！", "感谢分享，内容很有价值！", "楼主辛苦了，非常感谢分享！", "内容不错，感谢楼主分享！", "感谢楼主的分享！", "楼主辛苦了，收藏了！", "感谢分享，非常有用！", "楼主辛苦了，谢谢分享！", "内容很棒，感谢楼主！", "感谢分享，收藏了！", "非常感谢楼主的分享！", "内容不错，谢谢分享！" ];
  let AutoCheckIn = _AutoCheckIn;
  class CheckInInfoPanel {
    static async waitForElement(selector, timeout = 5e3) {
      const startTime = Date.now();
      for (;Date.now() - startTime < timeout; ) {
        const element = document.querySelector(selector);
        if (element) return element;
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      return null;
    }
    static async init() {
      try {
        const selectors = [ "#head #banner", "#banner", "td#banner", 'td[id="banner"]', "#head table td:last-child", '#head table td[align="right"]' ];
        let bannerTd = null;
        for (const selector of selectors) if (bannerTd = await this.waitForElement(selector, 2e3), 
        bannerTd) break;
        if (!bannerTd) return void document.querySelector("#head, head");
        const stats = await AutoCheckIn.getCheckInStats();
        if (!stats) return;
        this.createInfoPanel(bannerTd, stats);
      } catch (error) {}
    }
    static createInfoPanel(container, stats) {
      container.innerHTML = "";
      const today = this.getTodayDate(), isToday = this.parseSignDate(stats.lastSignTime) === today, statusIcon = isToday ? "✅" : "⏰", statusText = isToday ? "今日已签" : "待签到", statusColor = isToday ? "rgba(144, 238, 144, 0.9)" : "rgba(255, 215, 0, 0.9)", panel = document.createElement("div");
      panel.className = "checkin-info-panel", panel.style.cssText = '\n      display: inline-flex;\n      align-items: center;\n      gap: 16px;\n      padding: 10px 20px;\n      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\n      border-radius: 10px;\n      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);\n      font-family: "PingFang SC", "Microsoft YaHei", sans-serif;\n      color: #fff;\n      font-size: 13px;\n      line-height: 1.5;\n    ';
      const totalDiv = document.createElement("div");
      totalDiv.style.cssText = "\n      text-align: center;\n      border-right: 1px solid rgba(255, 255, 255, 0.25);\n      padding-right: 16px;\n    ", 
      totalDiv.innerHTML = `\n      <div style="font-size: 10px; opacity: 0.85; margin-bottom: 2px;">累计</div>\n      <div style="font-size: 18px; font-weight: 700;">\n        ${stats.totalDays}<span style="font-size: 11px; opacity: 0.9; margin-left: 2px;">天</span>\n      </div>\n    `;
      const monthDiv = document.createElement("div");
      monthDiv.style.cssText = "\n      text-align: center;\n      border-right: 1px solid rgba(255, 255, 255, 0.25);\n      padding-right: 16px;\n    ", 
      monthDiv.innerHTML = `\n      <div style="font-size: 10px; opacity: 0.85; margin-bottom: 2px;">本月</div>\n      <div style="font-size: 18px; font-weight: 700;">\n        ${stats.monthDays}<span style="font-size: 11px; opacity: 0.9; margin-left: 2px;">天</span>\n      </div>\n    `;
      const lastDiv = document.createElement("div");
      lastDiv.style.cssText = "\n      text-align: center;\n      border-right: 1px solid rgba(255, 255, 255, 0.25);\n      padding-right: 16px;\n      max-width: 140px;\n    ", 
      lastDiv.innerHTML = `\n      <div style="font-size: 10px; opacity: 0.85; margin-bottom: 2px;">上次签到</div>\n      <div style="font-size: 11px; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">\n        ${stats.lastSignTime || "暂无"}\n      </div>\n    `;
      const actionDiv = document.createElement("div");
      actionDiv.style.cssText = "\n      display: flex;\n      align-items: center;\n      gap: 10px;\n    ";
      const statusDiv = document.createElement("div");
      statusDiv.style.cssText = `\n      font-size: 12px;\n      font-weight: 600;\n      color: ${statusColor};\n      white-space: nowrap;\n    `, 
      statusDiv.textContent = `${statusIcon} ${statusText}`;
      const checkInBtn = document.createElement("button");
      checkInBtn.textContent = isToday ? "已签到" : "签到", checkInBtn.style.cssText = `\n      padding: 6px 16px;\n      background: ${isToday ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.95)"};\n      color: ${isToday ? "rgba(255, 255, 255, 0.6)" : "#667eea"};\n      border: none;\n      border-radius: 6px;\n      font-size: 13px;\n      font-weight: 600;\n      cursor: ${isToday ? "not-allowed" : "pointer"};\n      transition: all 0.2s;\n      white-space: nowrap;\n      box-shadow: ${isToday ? "none" : "0 2px 6px rgba(0, 0, 0, 0.1)"};\n    `, 
      isToday || (checkInBtn.onmouseover = () => {
        checkInBtn.style.background = "#fff", checkInBtn.style.transform = "translateY(-1px)", 
        checkInBtn.style.boxShadow = "0 3px 10px rgba(0, 0, 0, 0.15)";
      }, checkInBtn.onmouseout = () => {
        checkInBtn.style.background = "rgba(255, 255, 255, 0.95)", checkInBtn.style.transform = "translateY(0)", 
        checkInBtn.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.1)";
      }, checkInBtn.onclick = () => {
        AutoCheckIn.execute(checkInBtn);
      }), actionDiv.appendChild(statusDiv), actionDiv.appendChild(checkInBtn), panel.appendChild(totalDiv), 
      panel.appendChild(monthDiv), panel.appendChild(lastDiv), panel.appendChild(actionDiv), 
      container.appendChild(panel);
      const style = document.createElement("style");
      style.textContent = "\n      @media (max-width: 768px) {\n        .checkin-info-panel {\n          flex-direction: column !important;\n          gap: 12px !important;\n          padding: 10px 16px !important;\n          font-size: 12px !important;\n        }\n        .checkin-info-panel > div {\n          border-right: none !important;\n          padding-right: 0 !important;\n          border-bottom: 1px solid rgba(255, 255, 255, 0.3);\n          padding-bottom: 10px;\n        }\n        .checkin-info-panel > div:last-child {\n          border-bottom: none !important;\n          padding-bottom: 0 !important;\n        }\n      }\n    ", 
      document.head.appendChild(style);
    }
    static getTodayDate() {
      const now = new Date;
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    }
    static parseSignDate(signTime) {
      if (!signTime) return "";
      const match = signTime.match(/(\d{4}-\d{2}-\d{2})/);
      return match ? match[1] : "";
    }
  }
  const _ContentPageEnhancer = class {
    static async init() {
      if (document.querySelector(`.${this.CLASS_NAME}`)) return;
      const titleEl = document.querySelector("#subject_tpc") || document.querySelector("h1");
      if (!titleEl) return;
      if (DataExtractor.isPaidContent(document)) return;
      let magnet = DataExtractor.extractMagnet(document);
      if (!magnet) {
        const pageContent = document.documentElement.outerHTML;
        magnet = await ExternalMagnetExtractor.extractFromPage(pageContent) || "";
      }
      if (!magnet) return;
      const container = document.createElement("div");
      container.className = this.CLASS_NAME;
      const label = document.createElement("div");
      label.className = "content-magnet-title", label.textContent = "磁力链接";
      const magnetRow = document.createElement("div");
      magnetRow.className = "content-magnet-text", magnetRow.textContent = magnet, magnetRow.title = "点击复制磁力链接", 
      magnetRow.addEventListener("click", event => Utils.copyToClipboard(magnet, event)), 
      container.appendChild(label), container.appendChild(magnetRow), titleEl.insertAdjacentElement("afterend", container);
    }
  };
  _ContentPageEnhancer.CLASS_NAME = "content-magnet-block";
  let ContentPageEnhancer = _ContentPageEnhancer;
  class App2048 {
    static initHideThumbMemory() {
      const checkbox = document.querySelector('input[name="hide_thumb"]');
      if (!checkbox) return;
      const savedState = CONFIG.getHideThumb();
      checkbox.checked = savedState, checkbox.addEventListener("change", () => {
        CONFIG.setHideThumb(checkbox.checked);
      });
    }
    static isLoggedIn() {
      if (document.querySelector('#td_userinfomore[href*="u.php?action=show"]')) return !0;
      const loginLink = document.querySelector('a[href="login.php"]');
      if (loginLink && loginLink.textContent?.includes("登录")) return !1;
      const registerLink = document.querySelector('a[href="register.php"]');
      return registerLink && registerLink.textContent?.includes("注册"), !1;
    }
    static is2048Site() {
      const title = document.title;
      return !(!title.includes("2048") && !title.includes("人人为我")) || !!document.querySelector('a[href="/2048"] img[src="/2048/logo.png"], a[href*="hack.php?H_name=qiandao"], .tr3.t_one, .f14.cc, #read_tpc');
    }
    static async displayThreadImages() {
      if (Utils.isContentPage()) return;
      Utils.collapseRules();
      const postLinks = Utils.safeQuerySelectorAll(CONFIG.selectors.threadLinks);
      postLinks.length && await Promise.all(postLinks.map(link => PreviewProcessor.processThreadLink(link)));
    }
    static isSearchPage() {
      return CONFIG.regex.searchUrl.test(window.location.href) && null !== document.querySelector(CONFIG.selectors.searchResultTable);
    }
    static async main() {
      if (this.is2048Site()) try {
        ModernSettingsPanel.init(), UltraMinimalStyleManager.injectStyles(), this.initHideThumbMemory();
        const pathname = window.location.pathname, href = window.location.href;
        if (("/" === pathname || "/index.php" === pathname || "/2048" === pathname || "/2048/" === pathname || "/2048/index.php" === pathname || !pathname || "" === pathname || "/index.php" === pathname && !href.includes("?") || pathname.endsWith("/") && !href.includes("thread") && !href.includes("read")) && this.isLoggedIn() && CheckInInfoPanel.init().catch(err => {}), 
        Utils.isContentPage()) return void ContentPageEnhancer.init();
        this.isSearchPage() ? (SearchFilter.init(), await this.displayThreadImages()) : (AdRemover.removeAds(), 
        await this.displayThreadImages());
      } catch (error) {}
    }
  }
  AdRemover.removeGlobalAds(), "loading" === document.readyState ? document.addEventListener("DOMContentLoaded", () => {
    AdRemover.removeGlobalAds(), App2048.main();
  }) : (AdRemover.removeGlobalAds(), App2048.main()), window.addEventListener("load", () => {
    AdRemover.removeGlobalAds();
  });
}();
