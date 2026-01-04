// ==UserScript==
// @name            hinatazaka46.com-design-fix
// @namespace       https://greasyfork.org/ja/users/1328592-naoqv
// @version         0.78
// @description:en  Hinatazaka46 website Look and Feel sleek
// @description:ja  日向坂46 デザインフィックス
// @license         MIT
// @icon            https://cdn.hinatazaka46.com/files/14/hinata/img/favicons/favicon-32x32.png
// @match           https://www.hinatazaka46.com/s/official/*
// @grant           GM_info
// @grant           GM_xmlhttpRequest
// @compatible      Chrome
// @compatible      Firefox
// @description 日向坂46ルックアンドフィール
// @downloadURL https://update.greasyfork.org/scripts/532856/hinatazaka46com-design-fix.user.js
// @updateURL https://update.greasyfork.org/scripts/532856/hinatazaka46com-design-fix.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  (function() {
    const CookieUtils = {
getCookie: (cookieName) => {
        if (cookieName == "" || cookieName == null) {
          console.error("CookieUtils.getCookie：引数に値を設定してください。");
          throw new Error("無効なCookieの取得が試みられました。");
        } else {
          var replace = "(?:(?:^|.*s*)" + cookieName + "s*=s*([^;]*).*$)|^.*$";
          var cookieValue = document.cookie.replace(new RegExp(replace), "$1");
          return cookieValue;
        }
      },
setCookie: (cookieName, cookieValue, cookieDays = 30) => {
        const cookieDomain = location.hostname;
        const cookieTime = 60 * 60 * 24 * cookieDays;
        if (cookieName == "" || cookieName == null) {
          console.log("CookieUtils.setCookie：引数を設定してください。");
        } else {
          document.cookie = cookieName + "=" + cookieValue + ";domain=" + cookieDomain + ";path=/;max-age=" + cookieTime;
        }
      },
removeCookie: (cookieName) => {
        if (cookieName == "" || cookieName == null) {
          console.log("CookieUtils.removeCookie：引数を設定してください。");
        } else {
          CookieUtils.setCookie(cookieName, "", 0);
        }
      }
    };
    const KEY_COLOR_MODE = "color_mode";
    const setColorMode = (mode) => {
      if (mode !== DEFAULT_COLOR && mode !== DARK_COLOR) {
        throw new Error("Illegal parameter error. [HinatazakaSigthtStyleUtils#setColorMode]");
      }
      const lang = CookieUtils.getCookie("wovn_selected_lang");
      if (CookieUtils.getCookie(KEY_COLOR_MODE)) {
        CookieUtils.setCookie(KEY_COLOR_MODE, mode);
      } else if (sessionStorage.getItem(KEY_COLOR_MODE)) {
        sessionStorage.setItem(KEY_COLOR_MODE, mode);
      } else if (!CookieUtils.getCookie(KEY_COLOR_MODE) && !sessionStorage.getItem(KEY_COLOR_MODE)) {
        if (confirm(
          lang == "ja" ? "カラーモードの設定を保持するには Cookie に値を保存する必要があります。よろしいですか？" : "To retain your color mode settings, we need to store the value in a cookie. Is that okay?"
        )) {
          CookieUtils.setCookie(KEY_COLOR_MODE, mode);
        } else {
          alert(lang == "ja" ? "カラーモードの設定は保持されません。" : "Color mode settings are not stored.");
          sessionStorage.setItem(KEY_COLOR_MODE, mode);
        }
      }
    };
    const toggleColorMode = () => {
      const mode = ((parseInt(getColorMode()) + 1) % 2).toString();
      setColorMode(mode);
      return mode;
    };
    const getColorMode = () => {
      return ((x) => x ? x : ((y) => y ? y : DEFAULT_COLOR)(sessionStorage.getItem(KEY_COLOR_MODE)))(CookieUtils.getCookie(KEY_COLOR_MODE));
    };
    const DEFAULT_FONT_CL = "#8babab";
    const DEFAULT_TITLE_FONT_CL = "#abbaba";
    const DARK_FONT_CL = "#eeeeee";
    const DARK_BG_CL = "#0a2040";
    const DARK_MENU_CL = "#204070";
    const DARK_SVG_CL = "#eeeeee";
    const DARK_IMG_BG_CL = "#eeeeee";
    const HOVER_BG_UPPER_CL = "#ecf0f9";
    const HOVER_BG_LOWER_CL = "#eff4fd";
    const HOVER_BORDER_CL = "#5bbee4";
    const DARK_HOVER_BG_UPPER_CL = "#20cccc";
    const DARK_HOVER_BG_LOWER_CL = "#202050";
    const DARK_PAST_BG_CL = "#303040";
    const DARK_TODAY_UPPER_CL = "#30aaaa";
    const DARK_TODAY_LOWER_CL = "#303050";
    const DARK_HOVER_BORDER_CL = "#79fcfc";
    const DARK_STRONG_FONT_CL = "crimson";
    const DARK_STRONG_BG_CL = "aquamarine";
    const DARK_FC_TEXT_CL = "rgb(99, 103, 103)";
    const KEY = {
      BACKGROUND: "backGround",
      MENUBAR: "manuBar",
      BREADCRUMB: "breadcrumb",
      LIST: "list",
      ARTICLE: "article",
      PASTDAY: "pastday",
      TODAY: "today",
      MEMBER_PROP: "memberProp",
      SVG_PATH: "svgPath",
      BLOG: "blog",
      STRONG: "strong",
      DISCO: "disco",
      AFTER: "after",
      BIOGRAPHY: "biography",
      FC_LOGO: "fc_logo",
      FC_TEXT: "fc_text"
    };
    const SELECTOR_DIC = {
      [KEY.BACKGROUND]: ".pages, .module-modal.js-member-filter .mordal-box, .l-container, .schedule__list-future",
      [KEY.MENUBAR]: ".l-header, .p-header-wrap, .p-header-wrap.is-fixed",
      [KEY.BREADCRUMB]: ".p-page-breadcrumb__list, .c-page-breadcrumb__item:last-child span",
      [KEY.LIST]: ".l-container, .p-news__list ",
      [KEY.ARTICLE]: ".c-blog-main__title, .c-blog-main__date, .c-article__title, .p-article__text, .p-article__text span, .c-blog-article__text div *, .c-blog-article__text p span, .tbcms_program-detail__inner p, .c-tv-backnumber-kiji-time, .c-tv-backnumber-kiji-text",
      [KEY.PASTDAY]: ".schedule__list-pastday",
      [KEY.TODAY]: ".schedule__list-today",
      [KEY.MEMBER_PROP]: ".c-member__name, .c-member__name--info, .c-member__info-td__text, .c-blog-member__name, .c-blog-member__info-td__text, .c-mamber__category_title span, .c-section-title--member-name",
      [KEY.SVG_PATH]: ".c-member__info-td__text a svg path",
      [KEY.BLOG]: ".l-maincontents--blog, .p-blog-entry__group, .p-blog-entry__list, .s-blog__index, .p-blog-group, .p-blog-entry__list",
      [KEY.STRONG]: ".p-article__text strong span, .p-article__text span strong",
      [KEY.DISCO]: ".formation_image li i, .c-page-breadcrumb__item, .c-disco__title, .c-disco__date, .c-video-detail__title, .formation_image li i",
      [KEY.AFTER]: ".l-other-contents--blog",
      [KEY.BIOGRAPHY]: ".p-biography__text",
      [KEY.FC_LOGO]: ".fc-logo",
      [KEY.FC_TEXT]: ".fc-contents .text"
    };
    const CSS_DIC = {
      [KEY.BACKGROUND]: ["background-color"],
      [KEY.MENUBAR]: ["background-color"],
      [KEY.BREADCRUMB]: ["color"],
      [KEY.LIST]: ["color"],
      [KEY.ARTICLE]: ["color"],
      [KEY.PASTDAY]: ["background-color"],
      [KEY.TODAY]: ["background"],
      [KEY.MEMBER_PROP]: ["color"],
      [KEY.SVG_PATH]: ["fill"],
      [KEY.BLOG]: ["color", "background-color"],
      [KEY.STRONG]: ["color", "background-color"],
      [KEY.DISCO]: ["color"],
      [KEY.AFTER]: ["color", "--bg-color"],
      [KEY.BIOGRAPHY]: ["color"],
      [KEY.FC_LOGO]: ["background-color"],
      [KEY.FC_TEXT]: ["color"]
    };
    const DEFAULT_COLOR_CONFIG = {};
    const DARK_COLOR_CONFIG = {
      [KEY.BACKGROUND]: { "background-color": DARK_BG_CL },
      [KEY.MENUBAR]: { "background-color": DARK_MENU_CL },
      [KEY.BREADCRUMB]: { "color": DARK_FONT_CL },
      [KEY.LIST]: { "color": DARK_FONT_CL },
      [KEY.ARTICLE]: { "color": DARK_FONT_CL },
      [KEY.PASTDAY]: { "background-color": DARK_PAST_BG_CL },
      [KEY.TODAY]: { "background": `linear-gradient(${DARK_TODAY_UPPER_CL}, 10%, ${DARK_TODAY_LOWER_CL})` },
      [KEY.MEMBER_PROP]: { "color": DARK_FONT_CL },
      [KEY.SVG_PATH]: { "fill": DARK_SVG_CL },
      [KEY.BLOG]: { "color": DARK_FONT_CL, "background-color": DARK_BG_CL },
      [KEY.STRONG]: { "color": DARK_STRONG_FONT_CL, "background-color": DARK_STRONG_BG_CL },
      [KEY.DISCO]: { "color": DARK_FONT_CL },
      [KEY.AFTER]: { "color": DARK_FONT_CL, "--bg-color": DARK_BG_CL },
      [KEY.BIOGRAPHY]: { "color": DARK_FONT_CL },
      [KEY.FC_LOGO]: { "background-color": DARK_IMG_BG_CL },
      [KEY.FC_TEXT]: { "color": DARK_FC_TEXT_CL }
    };
    const getSelectorStyle = (selector, cssProperty) => ((element, cssProperty2) => element != null ? getComputedStyle(element).getPropertyValue(cssProperty2) : "rgb(0, 0, 0)")(document.querySelector(selector), cssProperty);
    const getBeforeFirstComma = (str) => {
      const index = str.indexOf(",");
      return index !== -1 ? str.slice(0, index) : str;
    };
    const COLOR_CONFIGS = [];
    const analyzeDefaultColor = () => {
      Array.prototype.forEach.call(Object.values(KEY), (k) => {
        DEFAULT_COLOR_CONFIG[k] = {};
        Array.prototype.forEach.call(CSS_DIC[k], (c) => {
          DEFAULT_COLOR_CONFIG[k][c] = getSelectorStyle(getBeforeFirstComma(SELECTOR_DIC[k]), c);
        });
      });
      COLOR_CONFIGS.push(DEFAULT_COLOR_CONFIG, DARK_COLOR_CONFIG);
    };
    const setHoveredFontColor = (itemSelector, titleSelector, datetimeSelector) => {
      Array.prototype.forEach.call(document.querySelectorAll(itemSelector), (x) => {
        x.addEventListener("mouseover", () => {
          if (getColorMode() === DARK_COLOR) {
            x.querySelector(titleSelector).style.color = DARK_FONT_CL;
            const datetime = x.querySelector(datetimeSelector);
            if (datetime) {
              datetime.style.color = DARK_FONT_CL;
            }
          } else {
            x.querySelector(titleSelector).style.color = DEFAULT_FONT_CL;
            const datetime = x.querySelector(datetimeSelector);
            if (datetime) {
              datetime.style.color = DEFAULT_FONT_CL;
            }
          }
        });
      });
      Array.prototype.forEach.call(document.querySelectorAll(itemSelector), (x) => {
        x.addEventListener("mouseout", () => {
          x.querySelector(titleSelector).style.color = DEFAULT_TITLE_FONT_CL;
          const datetime = x.querySelector(datetimeSelector);
          if (datetime) {
            datetime.style.color = DEFAULT_FONT_CL;
          }
        });
      });
    };
    const setHoveredFontAndBgColor = (itemSelector, textSelector) => {
      Array.prototype.forEach.call(document.querySelectorAll(itemSelector), (x) => {
        x.addEventListener("mouseover", () => {
          if (getColorMode() === DARK_COLOR) {
            x.style.background = `linear-gradient(${DARK_HOVER_BG_UPPER_CL}, 20%, ${DARK_HOVER_BG_LOWER_CL})`;
            x.style.outline = `1px solid ${DARK_HOVER_BORDER_CL}`;
            x.style.color = DARK_FONT_CL;
            x.children[0].style.color = DARK_FONT_CL;
            const text = x.querySelector(textSelector);
            if (text) {
              text.style.color = DARK_FONT_CL;
            }
          } else {
            x.style.background = `linear-gradient(${HOVER_BG_UPPER_CL}, 10%, ${HOVER_BG_LOWER_CL})`;
            x.style.outline = `0.5px solid ${HOVER_BORDER_CL}`;
            x.style.color = DEFAULT_FONT_CL;
            x.children[0].style.color = DEFAULT_FONT_CL;
            const text = x.querySelector(textSelector);
            if (text) {
              text.style.color = DEFAULT_FONT_CL;
            }
          }
        });
      });
      Array.prototype.forEach.call(document.querySelectorAll(itemSelector), (x) => {
        x.addEventListener("mouseout", () => {
          x.style.background = "transparent";
          x.style.outline = "1px solid transparent";
          x.style.color = DEFAULT_FONT_CL;
          x.children[0].style.color = DEFAULT_FONT_CL;
          const text = x.querySelector(textSelector);
          if (text) {
            text.style.color = DEFAULT_FONT_CL;
          }
        });
      });
    };
    const setColor = (pageType, colorMode) => {
      const configIndex = parseInt(colorMode);
      Array.prototype.forEach.call(Object.values(KEY), (k) => {
        Array.prototype.forEach.call(document.querySelectorAll(SELECTOR_DIC[k]), (e) => {
          Array.prototype.forEach.call(CSS_DIC[k], (c) => {
            e.style.setProperty(c, COLOR_CONFIGS[configIndex][k][c]);
          });
        });
      });
      Array.prototype.forEach.call(document.querySelectorAll(".p-page-breadcrumb__list .c-page-breadcrumb__item:not(:last-child)"), (x) => {
        x.addEventListener("mouseover", () => {
          x.children[0].style.color = getColorMode() === DARK_COLOR ? "lightcyan" : "#5d5d5d";
        });
        x.addEventListener("mouseout", () => {
          x.children[0].style.color = getColorMode() === DARK_COLOR ? "lightcyan" : "#a9a9a9";
        });
      });
      switch (pageType) {
        case "news":
        case "media":
          setLinkFontColor(".cale_prev a, .cale_month a, .cale_next a, .cale_table tbody tr td a");
          setHoveredFontAndBgColor(".p-news__item, .p-other__item, .p-schedule__item", "time");
          break;
        case "artist":
          setHoveredFontAndBgColor(".p-news__item", ".c-news__date");
          break;
        case "diary/member":
          setHoveredFontColor(".p-blog-top__item", ".c-blog-top__title", ".c-blog-top__date");
          break;
        case "diary/detail":
        case "diary/member/list":
          setLinkFontColor(".cale_prev a, .cale_month a, .cale_next a, .cale_table tbody tr td a");
          setHoveredFontAndBgColor(".p-blog-entry__item", ".c-blog-entry__title");
          setHoveredFontAndBgColor(".d-article", ".s-article-title");
          break;
case "video":
        case "contents":
          Array.prototype.forEach.call(document.querySelectorAll(".p-video__item.p-video__item--medium"), (x) => {
            x.addEventListener("mouseover", () => {
              x.children[1].children[0].style.color = getColorMode() === DARK_COLOR ? "lightcyan" : "#5d5d5d";
            });
            x.addEventListener("mouseout", () => {
              x.children[1].children[0].style.color = "#a9a9a9";
            });
          });
          break;
        case "event":
          Array.prototype.forEach.call(document.getElementsByClassName("p-shakehands__item"), (x) => {
            x.addEventListener("mouseover", () => {
              if (getColorMode() === DARK_COLOR) {
                x.children[1].children[1].style.color = "lightcyan";
                x.children[1].children[2].style.color = "lightcyan";
              } else {
                x.children[1].children[1].style.color = "#5d5d5d";
                x.children[1].children[2].style.color = "#5d5d5d";
              }
            });
            x.addEventListener("mouseout", () => {
              x.children[1].children[1].style.color = DEFAULT_FONT_CL;
              x.children[1].children[2].style.color = DEFAULT_FONT_CL;
            });
          });
          Array.prototype.forEach.call(document.getElementsByClassName("p-other__item"), (x) => {
            x.addEventListener("mouseover", () => {
              x.children[0].style.color = getColorMode() === DARK_COLOR ? "lightcyan" : "#5d5d5d";
            });
            x.addEventListener("mouseout", () => {
              x.children[0].style.color = DEFAULT_FONT_CL;
            });
          });
          Array.prototype.forEach.call(document.querySelectorAll(".c-pager__item--count a"), (x) => {
            x.addEventListener("mouseover", () => {
              x.style.color = getColorMode() === DARK_COLOR ? "lightcyan" : "#5d5d5d";
            });
            x.addEventListener("mouseout", () => {
              x.style.color = DEFAULT_FONT_CL;
            });
          });
          break;
      }
    };
    const leftPosition = (colorMode) => colorMode === DEFAULT_COLOR ? "-3px" : "36px";
    const createSwitchButton = (colorMode) => {
      const switchButton = document.createElement("div");
      switchButton.classList.add("switch_button");
      const left = leftPosition(colorMode);
      switchButton.style.cssText = `left: ${left};
      margin-top: -5px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      position: absolute;
      background-color: white;
      box-shadow: 1px 1px 7px #B7B7B7, -1px -1px 4px #CECECE inset;
      transition: left .3s ease-in-out;`;
      return switchButton;
    };
    const initializeColorToggle = (colorMode) => {
      const menuList = document.querySelector(".p-menu__list");
      if (menuList && !document.querySelector(".color_toggle")) {
        const colorToggle = document.createElement("div");
        colorToggle.classList.add("color_toggle");
        menuList.appendChild(colorToggle);
        colorToggle.style.cssText = `margin-top: 2px;
        margin-left: 16px;
        width: 60px;
        height: 18px;
        border: solid 2px gray;
        border-radius: calc(infinity * 1px);
        background: linear-gradient(to right, #fff 0%, #fefefe 30%, #606080 70%, #404060 80%, #202040 100%);
        position: relative;
        cursor: pointer;
        transition: background-color .2s ease-in-out;`;
        const switchButton = createSwitchButton(colorMode);
        colorToggle.appendChild(switchButton);
        colorToggle.addEventListener("click", () => {
          const colorMode2 = toggleColorMode();
          switchButton.style.left = leftPosition(colorMode2);
          setColor(getPageType(), colorMode2);
        });
        return true;
      } else {
        return false;
      }
    };
    const HINATA_BLUE = "#8cc8d1";
    const DEFAULT_COLOR = "0";
    const DARK_COLOR = "1";
    const PAGE_TYPE_ERROR_MSG = "Processing of out-of-scope pages. Check the settings @match.";
    const pageTypeMatch = (x = location.href) => x.match(/(news|media|detail|search|formation|diary\/member\/list|diary\/member|diary\/detail|artist\/00|artist|greeting|biography|video|contents|discography|aimashou|event|about_fanclub)/);
    const getPageType = (x = location.href) => x.match(/contents_list/) ? "contents" : ((y) => y ? y[0] : "other")(pageTypeMatch(x));
    const isMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor;
      const mobileRegex = /Android|iPhone|iPad|iPod|BlackBerry|Windows Phone|Opera Mini|IEMobile/i;
      return mobileRegex.test(userAgent) || window.matchMedia("only screen and (max-width: 768px)").matches;
    };
    document.appendStyle = (id, styleText) => {
      if (document.getElementById(id)) return;
      document.head.insertAdjacentHTML("beforeend", `<style id="${id}" rel="stylesheet">${styleText}</style>`);
    };
    const setLinkFontColor = (selector, originColor = HINATA_BLUE) => {
      Array.prototype.forEach.call(document.querySelectorAll(selector), (x) => {
        x.style.color = originColor;
        x.addEventListener("mouseover", () => {
          x.style.color = getColorMode() === DARK_COLOR ? "#e0ffff" : "#5d5d5d";
        });
        x.addEventListener("mouseout", () => {
          x.style.color = originColor;
        });
      });
    };
    let timeout;
    let count = 0;
    const replaceLang = () => {
      const langSelect = document.getElementById("wovn-translate-widget");
      if (count >= 10) {
        clearInterval(timeout);
      }
      if (langSelect) {
        langSelect.style.top = "5px";
        document.querySelector(".wovn-lang-selector").style.height = "25px";
        document.querySelector(".wovn-lang-selector-links").style.paddingTop = "3px";
        const planet = document.querySelector("#wovn-logo-planet");
        planet.style.left = "6px";
        planet.style.top = "40%";
        clearInterval(timeout);
      }
      count++;
    };
    const doProcess = (proc) => {
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => executeFunc(proc));
      } else {
        executeFunc(proc);
      }
    };
    const executeFunc = (proc) => {
      handleException(proc);
      handleException(() => {
        const colorMode = getColorMode();
        initializeColorToggle(colorMode);
        analyzeDefaultColor();
        setColor(getPageType(), colorMode);
      });
      timeout = setInterval(replaceLang, 200);
    };
    const handleException = (proc) => {
      try {
        const divElem = document.querySelector("html body div");
        if (divElem == null || divElem.innerText == null || divElem.innerText.includes("メンテナンス中")) {
          return;
        }
        proc();
      } catch (e) {
        console.error(e);
        const lang = CookieUtils.getCookie("wovn_selected_lang");
        switch (lang) {
          case "ja":
            alert(`userscriptの処理中にエラーが発生しました。
「Hinatazaka46-lookandfeel」のuserscriptを無効にしてください。`);
            break;
          case "en":
          case "zh-Hans":
          case "zh-Hant":
          case "ko":
          default:
            alert(`An error occurred while processining userscript.
Please disable the userscript: "Hinatazaka46-lookandfeel".`);
        }
      }
    };
    class Hinatazaka46 {
    }
    __publicField(Hinatazaka46, "MEMBERS", {
      "ポカ": "000",
      "井口 眞緒": "1",
      "潮紗 理菜": "2",
      "柿崎 芽実": "3",
      "影山 優佳": "4",
      "加藤 史帆": "5",
      "齊藤 京子": "6",
      "佐々木 久美": "7",
      "佐々木 美玲": "8",
      "高瀬 愛奈": "9",
      "高本 彩花": "10",
      "東村 芽依": "11",
      "金村 美玖": "12",
      "河田 陽菜": "13",
      "小坂 菜緒": "14",
      "富田 鈴花": "15",
      "丹生 明里": "16",
      "濱岸 ひより": "17",
      "松田 好花": "18",
      "宮田 愛萌": "19",
      "渡邉 美穂": "20",
      "上村 ひなの": "21",
      "髙橋 未来虹": "22",
      "森本 茉莉": "23",
      "山口 陽世": "24",
      "石塚 瑶季": "25",
      "岸 帆夏": "26",
      "小西 夏菜実": "27",
      "清水 理央": "28",
      "正源司 陽子": "29",
      "竹内 希来里": "30",
      "平尾 帆夏": "31",
      "平岡 海月": "32",
      "藤嶌 果歩": "33",
      "宮地 すみれ": "34",
      "山下 葉留花": "35",
      "渡辺 莉奈": "36",
      "大田 美月": "37",
      "大野 愛実": "38",
      "片山 紗希": "39",
      "蔵盛 妃那乃": "40",
      "坂井 新奈": "41",
      "佐藤 優羽": "42",
      "下田 衣珠季": "43",
      "高井 俐香": "44",
      "鶴崎 仁香": "45",
      "松尾 桜": "46",
      "日向坂46": "00",
      "五期生リレー": "3000"
    });
    __publicField(Hinatazaka46, "MEMBER_PROPERTIES", [
      { "no": "000", "nm": "ポカ", "kn": "", "gen": "0", "ico": "🐦️", "bd": "43824", "bt": "", "cl": [0, 0], "end": "" },
      { "no": "1", "nm": "井口 眞緒", "kn": "いぐち まお", "gen": "1", "ico": "🍷", "bd": "35013", "bt": "AB", "cl": [8, 7], "end": "200330", "img": "986/eeac9663692558ffd0aecb18fe7e3", "lnk": "instagram.com/iguchi.mao" },
      { "no": "2", "nm": "潮 紗理菜", "kn": "うしお さりな", "gen": "1", "ico": "🍀", "bd": "35790", "bt": "O", "cl": [13, 6], "end": "231231", "img": "bb8/60972360af21e201cd8fc36813faa", "lnk": "ushiosarina.com" },
      { "no": "3", "nm": "柿崎芽実", "kn": "かきざき めみ", "gen": "1", "ico": "🐱", "bd": "37227", "bt": "A", "cl": [4, 4], "end": "190811", "img": "f58/a6c42b4b0cae08ee929ca32764d32" },
      { "no": "4", "nm": "影山 優佳", "kn": "かげやま ゆうか", "gen": "1", "ico": "⚽", "bd": "37019", "bt": "O", "cl": [8, 8], "end": "230723", "img": "04d/7577c4908a69515ec91c9dd0c2159", "lnk": "kageyamayuka.com" },
      { "no": "5", "nm": "加藤 史帆", "kn": "かとう しほ", "gen": "1", "ico": "🐻", "bd": "35828", "bt": "A", "cl": [15, 15], "end": "241225", "img": "610/d713c2e65eee8fa173ef6c62d0d49", "lnk": "shihokato.com" },
      { "no": "6", "nm": "齊藤 京子", "kn": "さいとう きょうこ", "gen": "1", "ico": "🍜", "bd": "35678", "bt": "A", "cl": [9, 9], "end": "240405", "img": "93d/28ddf8afcf0f3360c267eb0232ebd", "lnk": "toho-ent.co.jp/actor/96610" },
      { "no": "7", "nm": "佐々木 久美", "kn": "ささき くみ", "gen": "1", "ico": "🦒", "bd": "35086", "bt": "O", "cl": [1, 13], "end": "250406", "img": "4f1/2d700f34ba47f7c556c4f9b0080b5", "lnk": "kumisasaki.com" },
      { "no": "8", "nm": "佐々木 美玲", "kn": "ささき みれい", "gen": "1", "ico": "🍞", "bd": "36511", "bt": "O", "cl": [6, 6], "end": "250405", "img": "0df/18fcfe112bdc514260a599f15ca6d", "lnk": "mireisasaki.officialfc.jp" },
      { "no": "9", "nm": "高瀬 愛奈", "kn": "たかせ まな", "gen": "1", "ico": "🐶", "bd": "36058", "bt": "A", "cl": [9, 11], "end": "250501", "img": "f26/b28c840b2702129a0e128157f2fd2", "lnk": "instagram.com/mana_takase_" },
      { "no": "10", "nm": "高本 彩花", "kn": "たかもと あやか", "gen": "1", "ico": "🍒", "bd": "36101", "bt": "B", "cl": [1, 10], "end": "240731", "img": "99c/0c9b9b9eb6857ee825edde1adaeb8", "lnk": "instagram.com/ayacheri._.official" },
      { "no": "11", "nm": "東村 芽依", "kn": "ひがしむら めい", "gen": "1", "ico": "🍓", "bd": "36030", "bt": "O", "cl": [10, 10], "end": "250125", "img": "e8d/6d3443d32d21af5b4250cae4dfe98", "lnk": "instagram.com/mei.higashimura" },
      { "no": "12", "nm": "金村 美玖", "kn": "かねむら みく", "gen": "2", "ico": "🍣", "bd": "37509", "bt": "O", "cl": [6, 1], "end": "" },
      { "no": "13", "nm": "河田 陽菜", "kn": "かわた ひな", "gen": "2", "ico": "🐼", "bd": "37095", "bt": "B", "cl": [10, 6], "end": "251119", "img": "b91/c85a566828c5b52b392ead7cb9d35", "lnk": "www.instagram.com/hina17_kawata" },
      { "no": "14", "nm": "小坂 菜緒", "kn": "こさか なお", "gen": "2", "ico": "🦕", "bd": "37506", "bt": "O", "cl": [14, 9], "end": "" },
      { "no": "15", "nm": "富田 鈴花", "kn": "とみた すずか", "gen": "2", "ico": "🚙", "bd": "36909", "bt": "A", "cl": [13, 13], "end": "250805", "img": "a3d/3354f4c554914640f4017cd4a1fa8", "lnk": "instagram.com/suzy.tomita" },
      { "no": "16", "nm": "丹生 明里", "kn": "にぶ あかり", "gen": "2", "ico": "🐸", "bd": "36937", "bt": "AB", "cl": [7, 7], "end": "250131", "img": "9bd/04f076fd4bb2a2133af488e5a4732", "lnk": "akarinibu.com" },
      { "no": "17", "nm": "濱岸 ひより", "kn": "はまぎし ひより", "gen": "2", "ico": "🐣", "bd": "37527", "bt": "A", "cl": [7, 9], "end": "241205", "img": "afc/00d2a3192ea32e11b16094ab3eff5", "lnk": "horipro.co.jp/hamagishihiyori" },
      { "no": "18", "nm": "松田 好花", "kn": "まつだ このか", "gen": "2", "ico": "🐙", "bd": "36277", "bt": "A", "cl": [10, 4], "end": "" },
      { "no": "19", "nm": "宮田 愛萌", "kn": "みやた まなも", "gen": "2", "ico": "⛩️", "bd": "35913", "bt": "A", "cl": [8, 10], "end": "221218", "img": "355/57e4a69c67e61eef9bce39cf3b4b3", "lnk": "farminc.co.jp/ranch-%E5%AE%AE%E7%94%B0%E6%84%9B%E8%90%8C" },
      { "no": "20", "nm": "渡邉 美穂", "kn": "わたなべ みほ", "gen": "2", "ico": "🏀", "bd": "36580", "bt": "A", "cl": [9, 1], "end": "220731", "img": "d65/46d3f83f40270879eb6eb890e7d40", "lnk": "mihowatanabe.jp" },
      { "no": "21", "nm": "上村 ひなの", "kn": "かみむら ひなの", "gen": "3", "ico": "⚫️🔻⚫️", "bd": "38089", "bt": "AB", "cl": [8, 2], "end": "" },
      { "no": "22", "nm": "髙橋 未来虹", "kn": "たかはし みくに", "gen": "3", "ico": "🌈", "bd": "37891", "bt": "B", "cl": [3, 13], "end": "" },
      { "no": "23", "nm": "森本 茉莉", "kn": "もりもと まりぃ", "gen": "3", "ico": "🐨", "bd": "38040", "bt": "A", "cl": [7, 15], "end": "" },
      { "no": "24", "nm": "山口 陽世", "kn": "やまぐち はるよ", "gen": "3", "ico": "⚾", "bd": "38040", "bt": "O", "cl": [4, 6], "end": "" },
      { "no": "25", "nm": "石塚 瑶季", "kn": "いしづか たまき", "gen": "4", "ico": "💎", "bd": "38205", "bt": "A", "cl": [10, 7], "end": "" },
      { "no": "26", "nm": "岸 帆夏", "kn": "きし ほのか", "gen": "4", "ico": "⛵", "bd": "38214", "bt": "O", "cl": [6, 9], "end": "2023127", "img": "ed0/52d7641fa4dcbafe9d087ad44bed3" },
      { "no": "27", "nm": "小西 夏菜実", "kn": "こにし ななみ", "gen": "4", "ico": "🍳", "bd": "38263", "bt": "B", "cl": [13, 15], "end": "" },
      { "no": "28", "nm": "清水 理央", "kn": "しみず りお", "gen": "4", "ico": "🫶", "bd": "38367", "bt": "AB", "cl": [1, 11], "end": "" },
      { "no": "29", "nm": "正源司 陽子", "kn": "しょうげんじ ようこ", "gen": "4", "ico": "🤛", "bd": "39127", "bt": "B", "cl": [7, 8], "end": "" },
      { "no": "30", "nm": "竹内 希来里", "kn": "たけうち きらり", "gen": "4", "ico": "🧖‍♀️", "bd": "38768", "bt": "AB", "cl": [6, 8], "end": "" },
      { "no": "31", "nm": "平尾 帆夏", "kn": "ひらお ほのか", "gen": "4", "ico": "⚔️", "bd": "37833", "bt": "A", "cl": [1, 7], "end": "" },
      { "no": "32", "nm": "平岡 海月", "kn": "ひらおか みつき", "gen": "4", "ico": "🪼", "bd": "37355", "bt": "A", "cl": [15, 6], "end": "" },
      { "no": "33", "nm": "藤嶌 果歩", "kn": "ふじしま かほ", "gen": "4", "ico": "🐏", "bd": "38936", "bt": "X", "cl": [10, 15], "end": "" },
      { "no": "34", "nm": "宮地 すみれ", "kn": "みやち すみれ", "gen": "4", "ico": "💄", "bd": "38717", "bt": "x", "cl": [14, 8], "end": "" },
      { "no": "35", "nm": "山下 葉留花", "kn": "やました はるか", "gen": "4", "ico": "🌱", "bd": "37761", "bt": "O", "cl": [9, 2], "end": "" },
      { "no": "36", "nm": "渡辺 莉奈", "kn": "わたなべ りな", "gen": "4", "ico": "🎧️", "bd": "39851", "bt": "A", "cl": [15, 9], "end": "" },
      { "no": "37", "nm": "大田 美月", "kn": "おおた みづき", "gen": "5", "ico": "🩷", "bd": "39058", "bt": "A", "cl": [10, 11], "end": "" },
      { "no": "38", "nm": "大野 愛実", "kn": "おおの まなみ", "gen": "5", "ico": "🦀", "bd": "39207", "bt": "B", "cl": [8, 8], "end": "" },
      { "no": "39", "nm": "片山 紗希", "kn": "かたやま さき", "gen": "5", "ico": "🐰", "bd": "39077", "bt": "A", "cl": [1, 1], "end": "" },
      { "no": "40", "nm": "蔵盛 妃那乃", "kn": "くらもり ひなの", "gen": "5", "ico": "🪭", "bd": "38740", "bt": "B", "cl": [10, 8], "end": "" },
      { "no": "41", "nm": "坂井 新奈", "kn": "さかい にいな", "gen": "5", "ico": "🩰", "bd": "39886", "bt": "A", "cl": [9, 9], "end": "" },
      { "no": "42", "nm": "佐藤 優羽", "kn": "さとう ゆう", "gen": "5", "ico": "🪽", "bd": "38970", "bt": "AB", "cl": [2, 2], "end": "" },
      { "no": "43", "nm": "下田 衣珠季", "kn": "しもだ いずき", "gen": "5", "ico": "🏓", "bd": "39077", "bt": "A", "cl": [1, 2], "end": "" },
      { "no": "44", "nm": "高井 俐香", "kn": "たかい りか", "gen": "5", "ico": "🎠", "bd": "39295", "bt": "O", "cl": [13, 6], "end": "" },
      { "no": "45", "nm": "鶴崎 仁香", "kn": "つるさき にこ", "gen": "5", "ico": "🍡", "bd": "38073", "bt": "B", "cl": [6, 7], "end": "" },
      { "no": "46", "nm": "松尾 桜", "kn": "まつお さくら", "gen": "5", "ico": "🐧", "bd": "38511", "bt": "A", "cl": [10, 9], "end": "" },
      { "no": "00", "nm": "日向坂46", "kn": "", "gen": "1", "ico": "", "bd": "43551", "bt": "", "cl": [0, 0], "end": "" },
      { "no": "3000", "nm": "五期生リレー", "kn": "", "gen": "-1", "ico": "五", "bd": "", "bt": "", "cl": [0, 0], "end": "" }
    ]);
    __publicField(Hinatazaka46, "PENLIGHT", [
      { "nm": "skyblue", "cd": "#5bbee4" },
      { "nm": "pastel blue", "cd": "#49bdf0" },
      { "nm": "emerald green", "cd": "#50c878" },
      { "nm": "green", "cd": "#00ff00" },
      { "nm": "pearl green", "cd": "#b4ddc0" },
      { "nm": "light green", "cd": "#90ee90" },
      { "nm": "yellow", "cd": "#ffff00" },
      { "nm": "orange", "cd": "#ffa500" },
      { "nm": "red", "cd": "#ff0000" },
      { "nm": "white", "cd": "#ffffff" },
      { "nm": "sakura pink", "cd": "#ffc0c9" },
      { "nm": "pink", "cd": "#ffc0cb" },
      { "nm": "passion pink", "cd": "#fc0fc0" },
      { "nm": "purple", "cd": "#800080" },
      { "nm": "violet", "cd": "#ee82ee" },
      { "nm": "blue", "cd": "#0000ff" }
    ]);
    const initializeAccordion = (details, opt = { gridTemplateRows: null, gridTemplateColumns: null }) => {
      const summary = details.querySelector(".p-blog-face__title");
      const panel = details.querySelector(".p-blog-face__group");
      if (!(details && summary && panel)) {
        return;
      }
      let isTransitioning = false;
      const onOpen = () => {
        if (details.classList.contains("open") || isTransitioning) {
          return;
        }
        isTransitioning = true;
        panel.style.gridTemplateRows = "0fr";
        details.classList.add("open");
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            panel.style.gridTemplateRows = opt.gridTemplateRows ? opt.gridTemplateRows : "repeat(5, 200px)";
            panel.style.gridTemplateColumns = opt.gridTemplateColumns ? opt.gridTemplateColumns : "repeat(7, 160px)";
            panel.style.height = "auto";
            panel.style.width = "auto";
          });
        });
        panel.addEventListener(
          "transitionend",
          () => {
            isTransitioning = false;
          },
          { once: true }
        );
      };
      const onClose = () => {
        if (!details.classList.contains("open") || isTransitioning) {
          return;
        }
        isTransitioning = true;
        details.classList.remove("open");
        panel.style.gridTemplateRows = "0fr";
        panel.style.gridTemplateColumns = "0fr";
        panel.style.height = "0";
        panel.style.width = "0";
        panel.addEventListener(
          "transitionend",
          () => {
            panel.style.gridTemplateRows = "";
            isTransitioning = false;
          },
          { once: true }
        );
      };
      summary.addEventListener("click", (event) => {
        event.preventDefault();
        if (details.classList.contains("open")) {
          onClose();
        } else {
          onOpen();
        }
      });
    };
    const last2digitsFromYear = (year) => ((str) => str.substring(str.length - 2))(year.toString());
    const NOW = new Date();
    const weekDay = {
      0: "Sun.",
      1: "Mon.",
      2: "Tue.",
      3: "Wed.",
      4: "Thu.",
      5: "Fri.",
      6: "Sat."
    };
    const shortenYearWithDay = (yearSelector, isShowElasped = false) => {
      Array.prototype.forEach.call(document.querySelectorAll(yearSelector), (x) => {
        const text = x.innerText;
        const match = text.match(/(\d{4})\.(\d{1,2})\.(\d{1,2})(\s(\d{2}):(\d{2}))?/);
        if (match && match[3]) {
          const date = new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]), match[5] ? parseInt(match[5]) : 0, match[6] ? parseInt(match[6]) : 0, 0, 0);
          if (match[5]) {
            x.innerText = text.replace(/\d{4}\.\d{1,2}\.\d{1,2}\s\d{2}:\d{2}/, `'${last2digitsFromYear(date.getFullYear())} ${date.getMonth() + 1}/${date.getDate()} ${weekDay[date.getDay()]} ${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`);
          } else {
            x.innerText = text.replace(/\d{4}\.\d{1,2}\.\d{1,2}/, `'${last2digitsFromYear(date.getFullYear())} ${date.getMonth() + 1}/${date.getDate()} ${weekDay[date.getDay()]}`);
          }
        } else {
          x.innerText = text.replace(/^(?!')\d{2}(\d{2}\.)/, "'$1");
        }
        if (isShowElasped) {
          x.innerText = x.innerText + " （" + createElasped(text) + " ago）";
        }
      });
    };
    const createElasped = (timeString) => {
      const elaspedSeconds = (NOW.getTime() - new Date(timeString).getTime()) / 1e3;
      let elasped;
      if (elaspedSeconds < 60 * 60) {
        elasped = Math.floor(elaspedSeconds / 60) + "min.";
      } else if (elaspedSeconds < 24 * 60 * 60) {
        elasped = Math.floor(elaspedSeconds / (60 * 60)) + "h";
      } else if (elaspedSeconds < 7 * 24 * 60 * 60) {
        elasped = Math.floor(elaspedSeconds / (24 * 60 * 60)) + "d";
      } else {
        elasped = Math.floor(elaspedSeconds / (7 * 24 * 60 * 60)) + "w";
      }
      return elasped;
    };
    const excelSerialToDate = (serial) => {
      const msPerDay = 24 * 60 * 60 * 1e3;
      const excelEpochOffset = 25569;
      const date = new Date((parseInt(serial) - excelEpochOffset) * msPerDay);
      return date;
    };
    const ZODIAC = {
      ARIES: "おひつじ座",
      TAURUS: "おうし座",
      GEMINI: "ふたご座",
      CANCER: "かに座",
      LEO: "しし座",
      VIRGO: "おとめ座",
      LIBRA: "てんびん座",
      SCORPIO: "さそり座",
      SAGITTARIUS: "いて座",
      CAPRICORN: "やぎ座",
      AQUARIUS: "みずがめ座",
      PISCES: "うお座"
    };
    const getZodiacSign = (date) => {
      const month = date.getMonth() + 1;
      const day = date.getDate();
      if (month === 1 && day >= 20 || month === 2 && day <= 18) return ZODIAC.AQUARIUS;
      if (month === 2 && day >= 19 || month === 3 && day <= 20) return ZODIAC.PISCES;
      if (month === 3 && day >= 21 || month === 4 && day <= 19) return ZODIAC.ARIES;
      if (month === 4 && day >= 20 || month === 5 && day <= 20) return ZODIAC.TAURUS;
      if (month === 5 && day >= 21 || month === 6 && day <= 20) return ZODIAC.GEMINI;
      if (month === 6 && day >= 21 || month === 7 && day <= 22) return ZODIAC.CANCER;
      if (month === 7 && day >= 23 || month === 8 && day <= 22) return ZODIAC.LEO;
      if (month === 8 && day >= 23 || month === 9 && day <= 22) return ZODIAC.VIRGO;
      if (month === 9 && day >= 23 || month === 10 && day <= 22) return ZODIAC.LIBRA;
      if (month === 10 && day >= 23 || month === 11 && day <= 21) return ZODIAC.SCORPIO;
      if (month === 11 && day >= 22 || month === 12 && day <= 21) return ZODIAC.SAGITTARIUS;
      return ZODIAC.CAPRICORN;
    };
    String.prototype.toDateFormat = function() {
      return this !== "undefined" ? this.replace(/([0-9]{4})([0-1][0-9])([0-3][0-9])/, "$1-$2-$3") : "";
    };
    String.prototype.toMonthAndDayFormat = function() {
      return this.replace(/([0-1][0-9])([0-3][0-9])/, "$1/$2");
    };
    String.prototype.toTimeFormat = function() {
      return this.replace(/([0-2][0-9])([0-5][0-9])/, "$1:$2");
    };
    const getNextMonth = (currentMonth) => {
      const year = parseInt(currentMonth.substring(0, 4));
      const month = parseInt(currentMonth.substring(4, 6));
      const nextDate = new Date(year, month, 1);
      const nextMonth = `${nextDate.getFullYear()}${String(nextDate.getMonth() + 1).padStart(2, "0")}`;
      return nextMonth;
    };
    function openModal(src) {
      const modal2 = document.createElement("div");
      modal2.innerHTML = `<img src="${src}">`;
      modal2.classList.add("modal--photo");
      modal2.style.display = "flex";
      modal2.addEventListener("click", () => {
        closeModal$1(modal2);
      });
      document.body.appendChild(modal2);
    }
    function closeModal$1(modal2) {
      modal2.style.animation = "modalFadeOut 0.3s forwards";
      modal2.addEventListener("animationend", () => {
        modal2.style.display = "none";
        document.body.removeChild(modal2);
      });
    }
    const setModalEvent = (imgSelector) => {
      document.appendStyle("modal-photo", `
    .modal--photo {
      display: none;
      position: fixed;
      z-index: 20000;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      background-color: rgb(0,0,0);
      background-color: rgba(0,0,0,0.9);
      align-items: center;
      justify-content: center;
      animation: modalFadeIn 0.3s;

      img {
        max-width: 90%;  /* 画像の最大幅を親要素(modal)の90%に制限し、画面内に収まるようにする */
        max-height: 100vh;  /* 画像の最大高さをビューポートの高さ(100vh)に制限し、画面内に収まるようにする  */
        object-fit: contain;  /* 画像の比率を保持しつつ、指定された高さと幅に収める */
      
        &:hover {
          cursor: zoom-out;  /* モーダル内の画像にホバー時にカーソルをズームアウトのアイコンに変更 */
        }
      }
    }
    @keyframes modalFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes modalFadeOut {
      from { opacity: 1; }
    }`);
      Array.prototype.forEach.call(document.querySelectorAll(imgSelector), (image) => {
        image.style.cssText = image.style.cssText.replace("cursor: defalut; ", "");
        image.classList.add("clickable-image");
        image.onclick = () => {
          openModal(image.src);
        };
        image.onmouseover = () => {
          image.style.cursor = "-woz-zoom-in";
          image.style.cursor = "-webkit-zoom-in";
          image.style.cursor = "zoom-in";
        };
        image.onmouseout = () => {
          image.style.cursor = "default";
        };
        image.oncontextmenu = () => {
        };
        image.onmousedown = () => {
        };
        image.onselectstart = () => {
        };
      });
    };
    var _GM_info = (() => typeof GM_info != "undefined" ? GM_info : void 0)();
    var _GM_xmlhttpRequest = (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
    const GREEN_BUTTON = "linear-gradient(to right, #50a0f0 0%, #32edae 100%)";
    const CLASS_FORMER_MM = "former_mm";
    const CLASS_FORMER_ON = "former_on";
    const IMG_PREFIX = "https://cdn.hinatazaka46.com/images/14/";
    const IMG_SUFFIX = "/800_800_102400.jpg";
    const _5TH_GEN_RELAY_BLOG_PHOTO = "https://cdn.hinatazaka46.com/images/14/fa2/dcd3c79b9d66efeed5a13af038129.jpg";
    const createGeneration = (gen) => {
      const fragment = document.createDocumentFragment();
      const sub = document.createElement("div");
      sub.classList.add("p-page-head-sub", CLASS_FORMER_MM);
      const subtitle = document.createElement("h2");
      subtitle.classList.add("c-page-subtitle", "en");
      const gens = { "1": "一期生", "2": "二期生", "3": "三期生", "4": "四期生", "5": "五期生" };
      subtitle.append(document.createTextNode(gens[gen]));
      sub.appendChild(subtitle);
      fragment.append(sub);
      const lcontents = document.createElement("div");
      lcontents.classList.add("l-contents");
      const lmaincontents = document.createElement("div");
      lmaincontents.classList.add("l-maincontents");
      const pmemberlist = document.createElement("div");
      pmemberlist.classList.add("p-member__list");
      lmaincontents.appendChild(pmemberlist);
      lcontents.appendChild(lmaincontents);
      fragment.append(lcontents);
      return fragment;
    };
    const appendNmKn = (anchor, nameInfo) => {
      if (anchor.tagName != "A") {
        console.error("this anchor is wrong. tagName: '", anchor.tagName, "'");
        return;
      }
      const memberName = nameInfo.name;
      const memberKana = nameInfo.kana;
      const name = document.createElement("div");
      name.classList.add("c-member__name");
      name.append(document.createTextNode(memberName));
      anchor.appendChild(name);
      const kana = document.createElement("div");
      kana.classList.add("c-member__kana");
      kana.append(document.createTextNode(memberKana));
      anchor.appendChild(kana);
    };
    const DATE_OPTIONS = {
      year: "numeric",
      month: "short",
      day: "numeric"
    };
    const appendBd = (anchor, birthInfo) => {
      if (anchor.tagName != "A") {
        console.error("this anchor is wrong. tagName: '", anchor.tagName, "'");
        return;
      }
      const memberName = birthInfo.name;
      const nameElement = document.createElement("div");
      nameElement.classList.add("c-member__name");
      nameElement.append(document.createTextNode(memberName));
      anchor.appendChild(nameElement);
      const birthElement = document.createElement("div");
      birthElement.classList.add("c-member__birth");
      birthElement.append(document.createTextNode(birthInfo.birth.toLocaleDateString("ja-JP", DATE_OPTIONS)));
      anchor.appendChild(birthElement);
    };
    const createMemberElement = (number, imgUrl, linkUrl, appendElemFunc, memberData) => {
      const li = document.createElement("li");
      li.classList.add("p-member__item", CLASS_FORMER_MM);
      li.dataset.member = number;
      const anchor = document.createElement("a");
      const thumb = document.createElement("div");
      thumb.classList.add("c-member__thumb");
      thumb.style.position = "relative";
      const img = document.createElement("img");
      img.setAttribute("src", IMG_PREFIX + imgUrl + IMG_SUFFIX);
      thumb.appendChild(img);
      if (linkUrl) {
        img.style.cursor = "pointer";
        const linkButton = document.createElement("a");
        linkButton.append(document.createTextNode("Open Link in New Tab"));
        linkButton.classList.add("open-link-button");
        linkButton.style.display = "none";
        linkButton.setAttribute("href", "https://" + linkUrl);
        linkButton.setAttribute("target", "_blank");
        img.addEventListener("click", () => {
          linkButton.style.display = linkButton.style.display == "none" ? "flex" : "none";
        });
        linkButton.addEventListener("click", (event) => {
          event.stopPropagation();
        });
        thumb.appendChild(linkButton);
      }
      anchor.appendChild(thumb);
      appendElemFunc(anchor, memberData);
      li.appendChild(anchor);
      return li;
    };
    const constructGroup = (list, groups, sortTop, headers) => {
      let lastAdded;
      list.forEach((x) => {
        if (!groups[x]) return;
        const groupMembers = Array.prototype.sort.call(groups[x], (a, b) => a.kn.localeCompare(b.kn, "ja"));
        const unorderedList = document.createElement("ul");
        unorderedList.classList = "p-member__list";
        groupMembers.forEach((m) => {
          const current = sortTop.querySelector(`[data-member="${m.no}"]`);
          if (current) {
            current.style.display = "block";
            unorderedList.appendChild(current);
          } else {
            const og = createMemberElement(m.no, m.img, m.lnk, appendBd, { "name": m.nm, "birth": m.birth });
            unorderedList.appendChild(og);
          }
        });
        let header = Array.prototype.find.call(headers, (h) => h.children[0].innerText.trim() == x);
        if (header) {
          header.nextSibling.nextSibling.children[0].replaceChild(unorderedList, header.nextSibling.nextSibling.children[0].children[0]);
          lastAdded = header.nextSibling.nextSibling;
        } else {
          header = document.createElement("div");
          header.classList.add("p-page-head-sub", CLASS_FORMER_MM);
          const headSubHeader = document.createElement("h2");
          headSubHeader.classList.add("c-page-subtitle", "en");
          headSubHeader.append(document.createTextNode(x));
          header.appendChild(headSubHeader);
          sortTop.insertBefore(header, lastAdded.nextSibling);
          const lContents = document.createElement("div");
          lContents.className = "l-contents";
          lContents.appendChild(unorderedList);
          const lMainContents = document.createElement("div");
          lMainContents.className = "l-maincontents";
          lContents.appendChild(lMainContents);
          sortTop.insertBefore(lContents, header.nextSibling);
          lastAdded = lContents;
        }
      });
    };
    HTMLElement.prototype.setPenlightColor = function(color_01, color_02, thickness, intensity, base = 2, white = 2) {
      this.style.borderLeftColor = color_01;
      this.style.borderTopColor = color_01;
      this.style.borderRightColor = color_02;
      this.style.borderBottomColor = color_02;
      this.style.boxShadow = `
    -${thickness}px 0               ${thickness}px -4px ${color_01},
    0               -${thickness}px ${thickness}px -4px ${color_01},
    ${thickness}px  0               ${thickness}px -4px ${color_02},
    0               ${thickness}px  ${thickness}px -4px ${color_02},

    inset 0    ${white}px  ${white * 2}px white,
    inset 2px  0           ${white * 2}px white,
    inset 0    -${white}px ${white * 2}px white,
    inset -2px 0           ${white * 2}px white,

    inset 0               ${base * 2}px  ${base * 2}px ${color_01},
    inset ${base * 2}px   0              ${base * 2}px ${color_01},
    inset 0               -${base * 2}px ${base * 2}px ${color_02},
    inset -${base * 2}px  0              ${base * 2}px ${color_02},

    inset 0                 ${thickness}px  ${base * 2}px rgb(from ${color_01} calc(r + ${intensity}) calc(g + ${intensity}) calc(b + ${intensity})),
    inset ${thickness}px    ${base * 2}px   4px           rgb(from ${color_01} calc(r + ${intensity}) calc(g + ${intensity}) calc(b + ${intensity})),
    inset 0                 -${thickness}px ${base * 2}px rgb(from ${color_02} calc(r + ${intensity}) calc(g + ${intensity}) calc(b + ${intensity})),
    inset -${thickness}px   0               ${base * 2}px rgb(from ${color_02} calc(r + ${intensity}) calc(g + ${intensity}) calc(b + ${intensity})),

    -${white * 2}px 0              ${white * 2}px -${white * 2}px white,
    0              -${white * 2}px ${white * 2}px -${white * 2}px white,
    ${white * 2}px  0              ${white * 2}px -${white * 2}px white,
    0              ${white * 2}px  ${white * 2}px -${white * 2}px white,

    -${base * 2}px 0px            ${base * 2}px -${base * 2}px rgb(from ${color_01} calc(r + ${intensity}) calc(g + ${intensity}) calc(b + ${intensity})),
    0              -${base * 2}px ${base * 2}px -${base * 2}px rgb(from ${color_01} calc(r + ${intensity}) calc(g + ${intensity}) calc(b + ${intensity})),
    ${base * 2}px  0px            ${base * 2}px -${base * 2}px rgb(from ${color_02} calc(r + ${intensity}) calc(g + ${intensity}) calc(b + ${intensity})),
    0              ${base * 2}px  ${base * 2}px -${base * 2}px rgb(from ${color_02} calc(r + ${intensity}) calc(g + ${intensity}) calc(b + ${intensity}))
    `;
    };
    const toggleFormerMM = (checkbox, classFormer, classOn) => {
      if (checkbox.checked) {
        Array.prototype.forEach.call(document.getElementsByClassName(classFormer), (ex) => {
          ex.classList.add(classOn);
        });
      } else {
        Array.prototype.forEach.call(document.getElementsByClassName(classFormer), (ex) => {
          ex.classList.remove(classOn);
        });
      }
    };
    const scriptElem$1 = document.createElement("script");
    scriptElem$1.setAttribute("type", "text/javascript");
    scriptElem$1.textContent = "const toggleFormerMM = " + toggleFormerMM.toString();
    document.head.appendChild(scriptElem$1);
    const doProcessMember = () => {
      document.appendStyle("members", CSS_MEMBERS);
      const filter = document.querySelector(".p-member-filter");
      const checkboxFormerMM = `<div id="toggle__ex-members">Former Members&nbsp;&nbsp;<input type="checkbox" onclick="javascript:toggleFormerMM(this, '${CLASS_FORMER_MM}', '${CLASS_FORMER_ON}');" /></div>`;
      filter?.insertAdjacentHTML("afterend", checkboxFormerMM);
      const currentNumberSet = new Set();
      Array.prototype.forEach.call(document.querySelectorAll(".p-member__item"), (m) => {
        if (window.getComputedStyle(m).display !== "none") {
          currentNumberSet.add(m.dataset.member);
        }
      });
      Array.prototype.forEach.call(Hinatazaka46.MEMBER_PROPERTIES, (m) => {
        if (m.bd) {
          m.birth = excelSerialToDate(m.bd);
        }
      });
      const alltimeMMNumberSet = new Set();
      const alltimeMembers = Array.prototype.filter.call(Hinatazaka46.MEMBER_PROPERTIES, (m) => {
        const intNo = parseInt(m.no);
        const isPerson = intNo > 0 && intNo < 1e3;
        if (isPerson) {
          alltimeMMNumberSet.add(m.no);
        }
        return isPerson;
      });
      const formerMMNumberSet = alltimeMMNumberSet.difference(currentNumberSet);
      const formerMembers = Array.prototype.filter.call(Hinatazaka46.MEMBER_PROPERTIES, (m) => {
        return formerMMNumberSet.has(m.no);
      });
      const defaultMM = document.querySelector(".sorted.sort-default.current .p-member__list");
      if (defaultMM) {
        const newSortedByName = document.createElement("ul");
        newSortedByName.className = "p-member__list";
        const nameOrderMM = Array.prototype.sort.call(alltimeMembers.slice(), (a, b) => a.kn.localeCompare(b.kn, "ja"));
        Array.prototype.forEach.call(nameOrderMM, (m) => {
          if (m.gen === "5") return;
          const current = defaultMM.querySelector(`[data-member="${m.no}"]`);
          if (current) {
            current.style.display = "block";
            newSortedByName.appendChild(current);
          } else {
            const og = createMemberElement(m.no, m.img, m.lnk, appendNmKn, { "name": m.nm, "kana": m.kn });
            newSortedByName.appendChild(og);
          }
        });
        defaultMM.parentNode.replaceChild(newSortedByName, defaultMM);
      }
      const membersGroupedByGen = document.querySelector(".sorted.sort-syllabary");
      if (membersGroupedByGen) {
        const generations = {};
        Array.prototype.forEach.call(formerMembers, (m) => {
          if (!generations[m.gen]) {
            generations[m.gen] = createGeneration(m.gen);
          }
          const genTree = generations[m.gen];
          const list = genTree.querySelector(".p-member__list");
          if (list) {
            const memberElement = createMemberElement(m.no, m.img ? m.img : "", m.lnk ? m.lnk : "", appendNmKn, { "name": m.nm, "kana": m.kn });
            list.appendChild(memberElement);
          }
        });
        Array.prototype.forEach.call(Object.values(generations), (g) => {
          membersGroupedByGen.appendChild(g);
        });
      }
      const newSortedByBirth = document.createElement("ul");
      newSortedByBirth.className = "p-member__list";
      const sortedByBirth = document.querySelector(".sort-birth .p-member__list");
      const birthOrderMM = Array.prototype.sort.call(alltimeMembers.slice(), (a, b) => {
        const aBrthDay = parseInt(a.bd);
        const bBrthDay = parseInt(b.bd);
        if (aBrthDay > bBrthDay) {
          return -1;
        } else if (aBrthDay == bBrthDay) {
          return a.kn > b.kn ? 1 : -1;
        } else {
          return 1;
        }
      });
      Array.prototype.forEach.call(birthOrderMM, (m) => {
        const current = sortedByBirth.querySelector(`[data-member="${m.no}"]`);
        if (current) {
          current.style.display = "block";
          newSortedByBirth.appendChild(current);
        } else {
          const og = createMemberElement(m.no, m.img, m.lnk, appendBd, { "name": m.nm, "birth": m.birth });
          newSortedByBirth.appendChild(og);
        }
      });
      sortedByBirth.parentNode.replaceChild(newSortedByBirth, sortedByBirth);
      const zodiacGroups = Object.groupBy(alltimeMembers, ({ birth }) => getZodiacSign(birth));
      const zodiacTop = document.querySelector(".sort-constellation");
      const zodiacHeaders = document.querySelectorAll(".sort-constellation .p-page-head-sub");
      constructGroup(Object.values(ZODIAC), zodiacGroups, zodiacTop, zodiacHeaders);
      const BLOOD_TYPES = ["A型", "B型", "O型", "AB型", "不明"];
      const bloodGroups = Object.groupBy(alltimeMembers, ({ bt }) => {
        switch (bt) {
          case "A":
          case "B":
          case "O":
          case "AB":
            return bt + "型";
          case "X":
          default:
            return "不明";
        }
      });
      const bloodTop = document.querySelector(".sort-blood");
      const bloodHeaders = document.querySelectorAll(".sort-blood .p-page-head-sub");
      constructGroup(BLOOD_TYPES, bloodGroups, bloodTop, bloodHeaders);
      Array.prototype.forEach.call(document.querySelectorAll(".p-member__item"), (m) => {
        const color_set = Hinatazaka46.MEMBER_PROPERTIES[parseInt(m.dataset.member)].cl;
        const code_01 = Hinatazaka46.PENLIGHT[color_set[0]].cd;
        const code_02 = Hinatazaka46.PENLIGHT[color_set[1]].cd;
        const img = m.children[0].children[0].children[0];
        img.setPenlightColor(code_01, code_02, 4, 64);
        m.addEventListener("mouseover", () => {
          img.setPenlightColor(code_01, code_02, 12, 128);
        });
        m.addEventListener("mouseout", () => {
          img.setPenlightColor(code_01, code_02, 4, 64);
        });
      });
      Array.prototype.forEach.call(document.querySelectorAll("." + CLASS_FORMER_MM), (ex) => {
        ex.style.cssText += "display: none;";
      });
    };
    const doProcessMemberDetail = () => {
      document.appendStyle("member-detail", CSS_MEMBER_DETAIL);
      const close_button = document.querySelector(".c-btn-member-greeting-popup-close");
      close_button.style.setProperty("--color", DEFAULT_FONT_CL);
      shortenYearWithDay(".c-news__date");
      const img = document.querySelector(".c-member__thumb > img:nth-child(1)");
      if (img) {
        const ct = location.href.match(/artist\/([0-9]{1,2})/);
        if (ct) {
          const color_set = Hinatazaka46.MEMBER_PROPERTIES[parseInt(ct[1])].cl;
          const color_01 = Hinatazaka46.PENLIGHT[color_set[0]].cd;
          const color_02 = Hinatazaka46.PENLIGHT[color_set[1]].cd;
          img.setPenlightColor(color_01, color_02, 8, 64);
        }
      }
    };
    const doProcessGreeting = () => {
      document.appendStyle(
        "greeting",
        `
      .card, .member_thumb { cursor: pointer; }
      div.card {
        transition: transform 0.3s ease, z-index 0.3s ease;
        transform-origin: center center;
      }
      div.card:hover {
        transform: scale(1.05) translateZ(10px);
        z-index: 10;
      }`
      );
      Array.prototype.forEach.call(document.querySelectorAll('[class^="card_"]'), (c) => {
        const cardNo = c.classList[0].match(/[0-9]{1,2}/)[0];
        const member = c.querySelector(".member_thumb");
        member.addEventListener("click", () => {
          location.href = "https://www.hinatazaka46.com/s/official/artist/" + cardNo + "?ima=0000";
        });
        c.addEventListener("mouseover", () => {
          const menberName = c.querySelector(".name");
          if (getColorMode() === DARK_COLOR) {
            menberName.style.color = DARK_FONT_CL;
          } else {
            menberName.children[0].style.color = DEFAULT_FONT_CL;
          }
        });
        c.addEventListener("mouseout", () => {
          const menberName = c.querySelector(".name");
          menberName.style.color = DEFAULT_FONT_CL;
        });
        const card = c.querySelector(".card");
        const btn = c.querySelector("a.btn01");
        card.addEventListener("click", () => {
          btn.click();
        });
      });
    };
    const getBackgroundImageUrl = (el) => {
      const bg = window.getComputedStyle(el).backgroundImage;
      const urlMatch = bg.match(/url\(["']?(.*?)["']?\)/);
      return urlMatch ? urlMatch[1] : null;
    };
    const parseColorToRGBArray = (colorStr) => {
      const defaultColor = [140, 200, 209];
      const ctx = document.createElement("canvas").getContext("2d");
      ctx.fillStyle = "#000";
      try {
        ctx.fillStyle = colorStr;
      } catch (e) {
        return defaultColor;
      }
      if (ctx) {
        const computed = ctx.fillStyle;
        const match = computed.match(/#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/i);
        if (!match) return defaultColor;
        return [parseInt(match[1], 16), parseInt(match[2], 16), parseInt(match[3], 16)];
      } else {
        return defaultColor;
      }
    };
    const getHeaderFontColor = (r, g, b, threshold = 30) => {
      const defaultFontColor = parseColorToRGBArray(HINATA_BLUE);
      const default_R = defaultFontColor[0];
      const default_G = defaultFontColor[1];
      const default_B = defaultFontColor[2];
      const isNearlyDefault = r >= default_R - threshold && g >= default_G - threshold && b >= default_B - threshold;
      if (isNearlyDefault) {
        const compR = 255 - default_R * 0.4;
        const compG = 255 - default_G * 0.4;
        const compB = 255 - default_B * 0.8;
        return `rgb(${compR}, ${compG}, ${compB})`;
      } else {
        return `rgb(${defaultFontColor[0]}, ${defaultFontColor[1]}, ${defaultFontColor[2]})`;
      }
    };
    const setMemberIconOutline = (r, g, b) => {
      const icon = document.querySelector(".c-blog-member__icon");
      if (icon) {
        icon.style.outline = `8px solid rgb(${r}, ${g}, ${b})`;
      }
    };
    const getFontSize = (x) => ((z) => parseInt(z))(((y) => y.replace(/([0-9][0-9\.]+).*/, "$1"))(x != null ? window.getComputedStyle(x).getPropertyValue("font-size") : "0"));
    const setFontColor = (selector, color) => {
      Array.prototype.forEach.call(document.querySelectorAll(selector), (e) => {
        const fontSize = getFontSize(e);
        if (e.classList.contains("p-blog-face__icon")) {
          e.style.cssText = `--color: ${color}`;
        } else if (fontSize > 60) {
          e.style.textStroke = `0.5px ${color}`;
          e.style.webkitTextStroke = `0.5px ${color}`;
        } else {
          e.style.color = "white";
          e.style.cssText += `-webkit-text-stroke: 3px ${color};
      text-stroke: 3px ${color};
      paint-order: stroke;`;
        }
      });
    };
    const setFontColorOnImage4Greasemonkey = (imageUrl, selector) => {
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let r = 0, g = 0, b = 0, count2 = 0;
        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count2++;
        }
        r = Math.round(r / count2);
        g = Math.round(g / count2);
        b = Math.round(b / count2);
        setMemberIconOutline(r, g, b);
        const baseColor = getHeaderFontColor(r, g, b);
        setFontColor(selector, baseColor);
      };
      img.onerror = () => {
        setFontColor(selector, HINATA_BLUE);
        console.error("画像の読み込みに失敗しました");
      };
    };
    const setFontColorOnImage4Tampermonkey = (imageUrl, selector) => {
      _GM_xmlhttpRequest({
        method: "GET",
        url: imageUrl,
        responseType: "blob",
        onload: function(res) {
          const blob = res.response;
          const url = URL.createObjectURL(blob);
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            let r = 0, g = 0, b = 0, count2 = 0;
            for (let i = 0; i < data.length; i += 4) {
              r += data[i];
              g += data[i + 1];
              b += data[i + 2];
              count2++;
            }
            r = Math.round(r / count2);
            g = Math.round(g / count2);
            b = Math.round(b / count2);
            setMemberIconOutline(r, g, b);
            const baseColor = getHeaderFontColor(r, g, b);
            setFontColor(selector, baseColor);
            URL.revokeObjectURL(url);
          };
          img.src = url;
        },
        onerror: function() {
          setFontColor(selector, HINATA_BLUE);
          console.error("画像の読み込みに失敗しました");
        }
      });
    };
    const updateColorOnImage = (imageUrl, selector) => {
      if (typeof _GM_info !== "undefined") {
        if (_GM_info.scriptHandler === "Tampermonkey") {
          setFontColorOnImage4Tampermonkey(imageUrl, selector);
        } else if (_GM_info.scriptHandler === "Greasemonkey") {
          setFontColorOnImage4Greasemonkey(imageUrl, selector);
        } else {
          setFontColorOnImage4Tampermonkey(imageUrl, selector);
        }
      }
    };
    const updateColorOnTopImage = (imgSelector, textSelector) => {
      const blogContainer = document.querySelector(imgSelector);
      const imageUrl = getBackgroundImageUrl(blogContainer);
      if (imageUrl) {
        updateColorOnImage(imageUrl, textSelector);
      }
    };
    const scrollOnLoad = () => {
      const headerHeight = document.querySelector(".p-header-wrap").offsetHeight;
      scrollTo(0, 0);
      scrollTo({
        top: document.querySelector(".p-blog-article__head").getBoundingClientRect().top - headerHeight,
        behavior: "smooth"
      });
    };
    const processBlogDetail = () => {
      document.appendStyle("blog", CSS_BLOG);
      const articleTitleDiv = document.querySelector(".c-blog-article__title");
      if (articleTitleDiv) {
        const height = articleTitleDiv.scrollHeight + "px";
        articleTitleDiv.style.setProperty("--height", height);
        articleTitleDiv.style.marginBottom = "0px";
        articleTitleDiv.classList.add("hidden");
      }
      const articleInfo = document.querySelector(".p-blog-article__info");
      const pager = document.querySelector(".p-pager");
      if (articleInfo && pager) {
        articleInfo.appendChild(pager);
      }
      setTimeout(() => {
        const articleHeight = document.documentElement.clientHeight * 0.8;
        ((x) => {
          if (x) {
            x.style.height = articleHeight + "px";
          }
        })(document.querySelector(".c-blog-article__text"));
        if (articleTitleDiv && articleTitleDiv.offsetWidth < articleTitleDiv.scrollWidth) {
          const articleTitle = articleTitleDiv.innerText;
          articleTitleDiv.innerText = articleTitle + "🔼";
          articleTitleDiv.style.cursor = "pointer";
          articleTitleDiv.addEventListener("click", function() {
            articleTitleDiv.classList.toggle("hidden");
            articleTitleDiv.classList.toggle("open");
          });
        }
        scrollOnLoad();
      }, 100);
    };
    const getIcon = (memberName) => {
      if (!memberName) return "❔️";
      switch (memberName) {
        case "日向坂46":
          return Hinatazaka46.MEMBER_PROPERTIES[Hinatazaka46.MEMBER_PROPERTIES.length - 2].ico;
        case "ポカ":
          return Hinatazaka46.MEMBER_PROPERTIES[0].ico;
        case "五期生リレー":
          return Hinatazaka46.MEMBER_PROPERTIES[Hinatazaka46.MEMBER_PROPERTIES.length - 1].ico;
        default:
          return Hinatazaka46.MEMBER_PROPERTIES[parseInt(Hinatazaka46.MEMBERS[memberName])].ico;
      }
    };
    const rewriteMemberSelectOption = () => {
      Array.prototype.forEach.call(document.querySelectorAll(".js-select.sort option"), (o, i) => {
        if (i > 0) {
          const memberName = o.innerText.trim().match(/(([^\x01-\x7E]|\x20)*)/)[1];
          const icon = getIcon(memberName);
          o.innerText = o.innerText.replace(/(([^\x01-\x7E]|\x20)*)\(([1-2]?[0-9])\.([1-3]?[0-9] [0-2][0-9]:[0-5][0-9]).*\).*/g, `${icon} $1 ($3/$4)`);
        }
      });
    };
    const processBlogList = () => {
      const blogGroupHeight = document.documentElement.clientHeight;
      document.appendStyle("blog-list", `
  .c-blog-member__icon--all { height: 60px; }
  .p-button { padding-top: 0; }
  .calender_pats { margin: 10px 0 20px 0; }
  .s-blog__index {
    position: relative;
    z-index: 50;
    margin: 0 0 0 -50px;
    height: 250px;
    width: 280px;
    overflow-x: hidden;
    overflow-y: scroll;
  }
  .d-article {
    line-height: 20px;
    margin-bottom: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis "…";
  }
  .d-article {
    a { padding-left: 0.5rem; }
    .s-datetime { padding-left: 1rem; }
  }
  .s-member-icon { font-size: larger }
  .s-article-title { font-size: smaller; }
  .s-datetime { font-size: smaller; }
  .p-blog-group {
    height: ${blogGroupHeight - 60}px;
    overflow: scroll;
  }
  .l-maincontents--blog { border: none; }
  .c-blog-article__title { margin-bottom: 0px; }
  .p-pager { margin: 0 0 2px 0; }
  `);
      const titleList = document.createElement("div");
      titleList.setAttribute("class", "s-blog__index");
      const createAnchor2 = (idx, datetime, icon, articleTitle) => `<div class="d-article"><a href="#article${idx}">
    <span class="s-member-icon">${icon}</span>
    <span class="s-article-title">${articleTitle}</span><br/><span class="s-datetime">${datetime}</span>
  </a></div>`;
      Array.prototype.forEach.call(document.getElementsByClassName("p-blog-article"), (x, i) => {
        x.setAttribute("id", "article" + i);
        const datetimeDiv = x.childNodes[1].childNodes[3].childNodes[1];
        const datetime = datetimeDiv.firstChild.textContent.trim();
        const articleTitleDiv = x.childNodes[1].childNodes[1];
        const articleTitle = articleTitleDiv.firstChild.textContent.trim();
        const memberName = x.childNodes[1].childNodes[3].childNodes[3].innerText;
        const icon = getIcon(memberName);
        titleList.insertAdjacentHTML("beforeend", createAnchor2(i, datetime, icon, articleTitle));
      });
      shortenYearWithDay(".s-datetime");
      const calendar = document.querySelector(".calender_pats");
      if (calendar) {
        calendar.before(titleList);
      }
      rewriteMemberSelectOption();
      Array.prototype.forEach.call(document.getElementsByClassName("p-blog-entry__group"), (g) => {
        const blogEntrySubtitle = g.querySelector(".c-blog-entry_area__subtitle");
        if (blogEntrySubtitle && blogEntrySubtitle.innerText == "日向坂46の") {
          const blogEntryList = g.querySelector(".p-blog-entry__list");
          const memberSelectBtn = document.querySelector(".p-blog-member-filter");
          blogEntryList.before(memberSelectBtn);
        }
      });
      const pager = document.querySelector(".p-pager.p-pager--count");
      if (pager) {
        const blogList = document.querySelector(".p-blog-group");
        if (blogList) {
          blogList.before(pager);
        }
      }
      setTimeout(() => {
        ((x) => {
          if (x) {
            x.style.hight = "px";
          }
        })(document.querySelector(".p-blog-group"));
        scrollOnLoad();
      }, 100);
    };
    const oembed = (a) => {
      const CP = {
        YOUTUBE: "YouTube",
        TIKTOK: "TikTok"
      };
      if (a.tagName != "A") {
        console.error("this anchor is wrong. tagName: '", a.tagName, "'");
        return;
      }
      const href = a.getAttribute("href");
      if (href) {
        let cp = "";
        if (href.match(/https:\/\/youtu\.be|https:\/\/youtube\.com|https:\/\/www\.youtube\.com/)) {
          cp = CP.YOUTUBE;
        } else if (href.match(/\.tiktok\.com/)) {
          cp = CP.TIKTOK;
        } else {
          return;
        }
        const xhr = new XMLHttpRequest();
        switch (cp) {
          case CP.YOUTUBE:
            xhr.open("GET", `https://www.youtube.com/oembed?url=${href}&maxwidth=720&maxheight=405`);
            break;
          case CP.TIKTOK:
            xhr.open("GET", `https://www.tiktok.com/oembed?url=${href}`);
            break;
          default:
            return;
        }
        xhr.send();
        xhr.onreadystatechange = () => {
          if (xhr.readyState === XMLHttpRequest.DONE) {
            const res = JSON.parse(xhr.responseText);
            const div = document.createElement("div");
            switch (cp) {
              case CP.YOUTUBE:
                div.classList.add("div__youtube");
                div.innerHTML = res.html;
                break;
              case CP.TIKTOK:
                div.classList.add("div__tiktok");
                div.innerHTML = createTikTokPreview(res, href);
                break;
            }
            if (a.nextSibling == null) {
              a.parentNode.appendChild(div);
            } else if (a.nextSibling.nodeType !== Node.TEXT_NODE) {
              a.parentNode.insertBefore(div, a.nextSibling);
            } else {
              a.parentNode.insertBefore(div, a.nextSibling.nextSibling);
            }
          }
        };
      }
    };
    const createTikTokPreview = (dataJSON, url) => {
      const thumbnailUrl = dataJSON.thumbnail_url || "";
      const authorName = dataJSON.author_name || "不明";
      const title = dataJSON.title || "";
      const html = `
      <div class="tiktok-preview">
          <div class="video-info">
              <div class="author">@${authorName}</div>
              <div>${title}</div>
          </div>
          <a href="${url}" target="_blank">
              <div class="thumbnail-container">
                  <img src="${thumbnailUrl}" alt="${title}">
                  <div class="play-button">▶️</div>
              </div>
          </a>
      </div>
    `;
      return html;
    };
    const doProcessBlog = (blogPageType) => {
      const body = document.querySelector("body");
      if (body && body.getElementsByTagName("*").length === 0) {
        body.innerHTML = "This page is no longer available";
        return;
      }
      const isNotMemberBlog = location.search.match(/(cd=hinafes_blog|cd=event)/g);
      if (isNotMemberBlog) {
        return;
      }
      if (isMobile()) {
        return;
      }
      document.appendStyle("blog-base", `
  td[class^="cale_day"] a, .p-blog-member__info-table tbody tr:nth-child(2) .c-blog-member__info-td__text {
    font-family: "Libre Caslon Text", serif;
    font-size: 14px;
    font-optical-sizing: auto;
    font-weight: 600;
    font-style: normal;
  }
  td[class^="cale_day"] a {
    position: relative;
    bottom: 2px;
    font-size: 15px;
  }
  .cale_month, .p-blog-member__info-table tbody tr:nth-child(2) .c-blog-member__info-td__text {
    letter-spacing: 0.2rem;
  }
  .tiktok-preview {
      display: inline-block;
      margin: 10px;
      text-align: center;
      position: relative;
  }
  .thumbnail-container {
      position: relative;
      display: inline-block;
  }
  .tiktok-preview img {
      max-width: 100%;
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      cursor: pointer;
      transition: transform 0.2s;
      display: block;
  }
  .tiktok-preview a:hover img {
      transform: scale(1.05);
  }
  .play-button {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 60px;
      opacity: 0.7;
      pointer-events: none;
      text-shadow: 0 2px 4px rgba(0,0,0,0.5);
  }
  .video-info {
      margin-top: 10px;
      font-size: 14px;
  }
  .author {
      font-weight: bold;
  }
  .error {
      color: red;
      margin-top: 10px;
  }`);
      Array.prototype.forEach.call(document.querySelectorAll('.cale_table td[class^="cale_day"]'), (d) => {
        ((x) => {
          x.textContent = x.textContent.replace(/0([0-9])/, "$1");
        })(d.hasChildNodes() ? d.childNodes.item(0) : d);
      });
      updateColorOnTopImage(".p-blog-head-container", ".c-blog-page__title, .c-blog-page__subtitle, .c-blog-main__name, .c-blog__profilelink, .p-blog-face__title, .p-blog-face__icon");
      Array.prototype.forEach.call(document.querySelectorAll(".c-blog-article__text :not(div) > img"), (i) => {
        i.outerHTML = "<div>" + i.outerHTML + "</div>";
      });
      Array.prototype.forEach.call(document.querySelectorAll(".c-blog-article__text a"), (a) => {
        oembed(a);
      });
      Array.prototype.forEach.call(document.querySelectorAll(".p-blog-face__list"), (x) => {
        x.addEventListener("mouseover", () => {
          x.children[1].style.color = getColorMode() === DARK_COLOR ? `${DARK_FONT_CL}` : `${DEFAULT_FONT_CL}`;
        });
        x.addEventListener("mouseout", () => {
          x.children[1].style.color = DEFAULT_FONT_CL;
        });
      });
      const styleText_common = `
    .c-blog-face__item {
      transition: transform 0.3s ease, z-index 0.3s ease;
      transform-origin: center center;
    }
    .c-blog__profilelink { font-size: 1.5rem; }
    .c-select-box.js-selected-value { border: solid 1px ${HINATA_BLUE}; }
    .c-select-box {
      font-size: 1.8rem;
      padding-top: 0.2rem;
    }
    .p-blog-face__list:hover {
      > * {  transform: scale(1.2, 1.2) translateZ(10px); }
      > .c-blog-face__item { box-shadow: 0 0 0 3px ${HINATA_BLUE};}
    }
    .c-blog-main__category { background-color: #5ca8d1; }
    .c-button-grad, .c-button-grad.c-button-grad--big { background: ${GREEN_BUTTON}; }
    .c-button-grad.c-button-grad--big { min-width: 280px; }
    .js-select.sort { cursor: pointer; }
    `;
      if (blogPageType == "blog_top") {
        document.appendStyle("blog-top", styleText_common + `
    .p-blog-main__head { left: -30px; }
    .l-contents { padding-bottom: 20px; }
    .c-blog-top__name {
      font-weight: bold;
      font-size: 2rem;
    }
    .c-blog-page__subtitle { font-size: 3rem; }
    .c-blog-top__title, .c-blog-top__date { font-size: 1.2rem; }
    .c-blog-main__name { font-size: 3rem; }
    .c-blog-main__image, .c-blog__image { border: 2px solid ${HINATA_BLUE}; }`);
        rewriteMemberSelectOption();
        shortenYearWithDay(".c-blog-main__date, .c-blog-top__date", true);
        return;
      }
      const memberName = ((x) => x ? x.innerText : "")(document.querySelector(".c-blog-member__name"));
      const memberNo = ((x) => {
        if (x == "3000") {
          return -1;
        } else if (Number.isNaN(x) || x == "00") {
          return -2;
        } else {
          return parseInt(x);
        }
      })(Hinatazaka46.MEMBERS[memberName]);
      const color_set = Hinatazaka46.MEMBER_PROPERTIES.slice(memberNo)[0].cl;
      const code_01 = Hinatazaka46.PENLIGHT[color_set[0]].cd;
      const code_02 = Hinatazaka46.PENLIGHT[color_set[1]].cd;
      setBrogMemberIcon(memberName, code_01, code_02);
      const styleText_member_blog = getMemberBlogCSS(code_01, code_02);
      document.appendStyle("member-blog", styleText_common + styleText_member_blog);
      shortenYearWithDay(".c-blog-article__date, .c-blog-article__date time, .c-blog-entry__name, .c-pager__item__text time");
      setModalEvent(".c-blog-article__text img");
      const blog = document.querySelector(".l-maincontents--blog");
      blog.addEventListener("dblclick", () => {
        blog.classList.toggle("l-maincontents--blog__zoom");
      });
      switch (blogPageType) {
        case "blog_detail":
          processBlogDetail();
          break;
        case "blog_list":
          processBlogList();
          break;
        default:
          throw new Error(PAGE_TYPE_ERROR_MSG);
      }
      const memberBlogBtn = document.querySelector(".c-button-grad.c-button-grad--big");
      memberBlogBtn.classList.remove("c-button-grad--big");
      memberBlogBtn.classList.add("c-button-grad--right");
      memberBlogBtn.style.padding = "7px 16px;";
      const memberBlogEntryList = document.querySelector(".p-blog-entry__list");
      memberBlogEntryList.after(memberBlogBtn);
      const accordion = document.querySelector(".p-blog-face");
      initializeAccordion(accordion, { gridTemplateRows: "repeat(4, 200px)", gridTemplateColumns: "repeat(10, 150px)" });
      const memberBlogAccordion = document.querySelector(".p-blog-face");
      const title = document.querySelector(".p-blog-head");
      title.after(memberBlogAccordion);
      const span = document.createElement("span");
      span.classList.add("p-blog-face__icon");
      span.setAttribute("aria-hidden", "true");
      const faceTitle = document.querySelector(".p-blog-face__title");
      faceTitle.appendChild(span);
    };
    const CSS_MEMBERS = `
    #toggle__ex-members {
      position: absolute;
      top: 190px;
      left: 500px;
      font-size: 18px;

      input[type="checkbox"] {
        transform: scale(1.75);
        transform-origin: 25% 50%;
        cursor: pointer;
      }
    }
    .${CLASS_FORMER_ON} { display: block !important; }
    .p-member-filter { margin-top: 1rem; }
    .p-page-head-sub { padding-top: 20px; }
    .l-contents { padding-bottom: 0px !important; }
    .p-member__item {
      margin-bottom: 50px !important;
    }
    .p-member__item a div img {
      border: 1px solid;
      border-radius: 8px;
      padding: 0.2rem;
      transition: transform 0.3s ease, z-index 0.3s ease;
      transform-origin: center center;
    }
    .p-member__item:hover a div img { transform:scale(1.1, 1.1); }
    .c-select-box {
      font-size: 1.8rem;
      padding-top: 0.2rem;
    }
    .c-member__name { font-size: 2.4rem; font-weight: 600; }
    .c-member__kana { font-size: 1.6rem; font-weight: 900; }
    .c-member__birth {
      font-size: 2.0rem;
      font-family: "Libre Caslon Text";
      font-weight: 800;
      letter-spacing: 0.2rem;
      margin: 0;
    }
    .open-link-button {
      color: #dddddd;
      background-color: #303030;
      justify-content: center;
	    align-items: center;
      font-size: 14px;
      width: 190px;
      height: 30px;
      border-radius: 15px 5px;
      cursor: pointer;
      position: absolute;
      bottom: 3px;
      right: 3px;
      z-index: 10000;
      transition: 0.3s;
    }
    .open-link-button:hover { color: lightyellow; }`;
    const CSS_MEMBER_DETAIL = `
      .p-member__box { padding-top: 40px; }
      .c-member__thumb img {
        border: 3px solid;
        border-radius: 8px;
        padding: 0.2rem;
        position: relative;
      }
      .c-mamber__category_title { margin-bottom: 0; }
      .p-button--center { padding-top: 0; }
      .c-member-greeting-popup-pager-btn-in { cursor: pointer; }
      .c-member-greeting-popup-card-in.active img {
        transition: transform 0.3s ease, z-index 0.3s ease;
        transform-origin: 100% 25%;

        &:hover {
          transform: scale(1.45) translateZ(10px);
          z-index: 10; /* 前面に出す */
        }
      }
      .c-member-greeting-popup-pager-btn-icon {
        transition: transform 0.3s ease, z-index 0.3s ease;
        transform-origin: center center;
      }
      .c-member-greeting-popup-pager-btn-in:hover .c-member-greeting-popup-pager-btn-icon {
        box-shadow: 0px 0px 0px 3px ${HINATA_BLUE};
        transform: scale(1.08) translateZ(10px);
        z-index: 10; /* 前面に出す */
      }
      .c-member-greeting-popup-toggle-btn.active { background: ${GREEN_BUTTON}; }
      .p-contents.p-contents--news { padding-bottom: 0px; }
      .c-btn-member-greeting-popup-close {
        --color: black;

        &:before, &:after {
          border: solid 1px;
          background-color: var(--color);
        }
      }
      .c-blog__image {
        border: 2px solid ${HINATA_BLUE};
      }
      .c-news__date { width: 11rem; }`;
    const CSS_BLOG = `
    .p-blog-member__info {
      .p-button:nth-child(4) { display: block; }
      .p-button:nth-child(n + 5) { display: none; }
    }
    .p-blog-article { border-bottom: none; }
    .c-blog-article__title {
      --height: auto;
      height: var(--height);
      transition: height .3s ease-out;
    }
    .c-blog-article__title.open {
      height: var(--height);
      overflow: visible;
      white-space: wrap;
    }
    .c-blog-article__title.hidden {
      height: 50px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis "… 🔽";
    }
    .c-blog-article__text {
      overflow-x: hidden;
      overflow-y: scroll;
      border: none;
    }
    .p-blog-article__info div { vertical-align: top; }
    .p-pager {
      margin-top: 0px;
      padding-left: 5px;
      display: inline-block;
      width: 580px;
    }
    .c-pager__item {
      width: 280px;

      span {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis "…";
      }
    }
    .c-pager__item time {
      margin-top: 0;
    }
    .p-button--center {
      padding-top: 0;
      margin-top: -20px;
    }`;
    const getMemberBlogCSS = (code_01, code_02) => {
      const blogEntryItem = document.querySelector(".p-blog-entry__item");
      const blogEntryItemStyles = window.getComputedStyle(blogEntryItem, null);
      const blogEntryItemHeight = parseInt(blogEntryItemStyles.height.replace("px", ""));
      const blogEntryItemMarginBottom = parseInt(blogEntryItemStyles.marginBottom.replace("px", ""));
      const blogEntryItemHeightWithMargin = blogEntryItemHeight + blogEntryItemMarginBottom;
      const CONTENTS_WIDTH = Math.floor(screen.width * 0.1 * 0.9) * 10;
      const MAIN_CONTENTS_WIDTH = Math.floor(CONTENTS_WIDTH * 0.6);
      const OTHER_BLOG_LIST_WIDTH = Math.floor(CONTENTS_WIDTH * 0.22);
      const MARGIN_TOP = -180;
      const memberBlogCSS = `
    .l-contents { width: ${CONTENTS_WIDTH}px; }
    .l-other-contents--blog {
      width: ${OTHER_BLOG_LIST_WIDTH};
      margin-top: ${MARGIN_TOP}px;
      padding-top: 20px;
      --bg-color: #ffffff;
      background-color: var(--bg-color);
    }
    .c-button-grad { padding: 6px 40px 6px 32px; }
    .l-other-contents--blog::after, .c-button-grad.c-button-grad--big::after {
      background-color: var(--bg-color);
    }
    .p-blog-head-container { display: flex; }
    .p-blog-head {
      width: 600px;
      padding-top: 0;
      padding-left: 20px;
      margin: 0 0 0 60px;
    }
    .c-blog-page__subtitle { width: 230px; font-size: 20px; }
    .c-blog-page__title { width: 500px; margin-bottom: 0; }
    .c-blog-member__icon { margin-bottom: 10px; }
    .p-blog-member__head { margin-bottom: 5px; }
    .c-blog-member__info-td__name { padding-bottom: 5px; }
    .p-button { padding-top: 0; }
    .cale_table { margin-top: 0px; }
    .p-blog-article__head {
      background-color: #f6ffff;
      border: 1px solid #a0d8ef;
      border-radius: 10px;
      outline: 4px solid ${HINATA_BLUE};
    }
    .c-blog-article__title {
      font-size: 2.5rem;
      line-height: 58px;
      color: #636767;
      background-color: #e0ffff;
      border-radius: 10px;
    }
    .c-blog-article__title, .c-blog-article__date { text-indent: 5px; }
    .c-blog-article__text {
      text-indent: 1rem;
      padding-left: 1rem;
    }
    .l-maincontents--blog {
      width: ${MAIN_CONTENTS_WIDTH}px;
      margin-top: ${MARGIN_TOP}px;
      padding: 20px 20px 60px 20px;
      border-top-left-radius: 30px;
    }
    .l-contents--blog-list { padding-bottom: 0; }
    .c-blog-entry_area__title { margin-bottom: 2px; }
    .s-blog__index, .p-blog-group, .p-blog-entry__list {
      border: solid 1px #32a1ce;
      border-radius: 5px;
    }
    .p-blog-article {
      padding-bottom: 0;
      margin-bottom: 0;
    }
    .p-blog-article__info { margin-bottom: 5px; }
    .c-pager__item__text time { font-size: 1.4rem; }
    .p-button--center { padding: 0; }
    .p-blog-face {
        margin: 0 0 0px auto;
        padding-bottom: 0;
        width: 1000px;
    }
    .p-blog-face__title {
      font-size: 2.2rem;
      width: 300px;
      margin: 20px 0 0 auto;
      line-height: 24px;
      cursor: pointer;

      &::-webkit-details-marker { display: none; }
    }
    .p-blog-face__icon {
      position: relative;
      display: inline-block;
      inline-size: 1em;
      aspect-ratio: 1;

      &::before,
      &::after {
        position: absolute;
        top: 12px;
        inset: 0;
        inline-size: 100%;
        block-size: 1px;
        margin: 12px auto auto auto;
        content: "";
        background-color: currentcolor;
        --color: #ffffff;
        color: var(--color);
        width: 1.5rem;
        height: 0.3rem;
      }

      &::after {
        transition: opacity 0.3s;
        rotate: 90deg;
      }

      &:where(.p-blog-face.open *)::after { opacity: 0; }
    }
    .p-blog-face__list::hover .c-blog-face__name {
      --color: #ffffff;
      color: var(--color);
    }
    .p-blog-face__group {
      margin-top: 40px;
      margin-right: 600px;
      display: grid;
      transition: grid-template-rows 0.5s;
      height: 0;
      width: 0;
    }
    .p-blog-face__list {
      padding: 16px;
      margin: 0 24px 10px 24px;
    }
    .p-blog-face .p-blog-face__list {
      width: 0;
      height: 0;
      overflow: hidden;
    }
    .p-blog-face.open .p-blog-face__list {
      padding: 20px;
      width: 160px;
      height: 200px;
    }
    .p-blog-entry__group {
      padding-bottom: 0;
      width: ${OTHER_BLOG_LIST_WIDTH}px;
    }
    .p-blog-entry__list {
      height: ${blogEntryItemHeightWithMargin * 3}px;
      width: ${OTHER_BLOG_LIST_WIDTH}px;
      overflow-x: hidden;
      overflow-y: scroll;
      padding: 3px;
      margin: 10px 0;
    }
    .c-blog-entry__title, .c-blog-entry__name { font-size: 1.4rem; }
    .c-blog-article__text {
      padding-top: 1rem;

      img {
        border: 6px solid #fff;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        border-radius: 6px;
      }
    }
    .c-blog-entry__thumb {
      border: 3px solid #fff;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
      border-radius: 2px;
    }
    .l-sub-contents--blog { margin-top: -150px; width: 260px; }
    .c-blog-member__icon {
      border: 8px;
      border-style: groove ridge ridge groove;
      border-color: ${code_01} ${code_02} ${code_02} ${code_01};
    }
    .c-button-grad--right {
      font-size: 1.4rem;
      text-align: center;
      width: ${OTHER_BLOG_LIST_WIDTH}px;
      height: 36px;
      margin: 0 0 20px 0;
    }
    .l-maincontents--blog__zoom {
      transition: transform 0.3s ease, z-index 0.3s ease;
      transform-origin: 20% 46% 100px;
      transform: scale(1.12) perspective(500px) translateZ(100px);
      z-index: 20000;
      border-radius: 30px;
      outline: solid 4px ${HINATA_BLUE};

      .c-blog-article__text { font-size: 2.2rem };
    }
    .div__youtube {
      margin: 20px 0 10px 40px;
    }`;
      return memberBlogCSS;
    };
    const setBrogMemberIcon = (memberName, code_01, code_02) => {
      let memberIcon = document.querySelector(".c-blog-member__icon");
      if (!memberIcon) {
        memberIcon = createRelayBlogPhoto(_5TH_GEN_RELAY_BLOG_PHOTO);
        const info = document.querySelector(".p-blog-member__info");
        if (info) {
          info.prepend(memberIcon);
        }
        ((x) => {
          if (x) {
            x.style.marginTop = "20px";
          }
        })(document.querySelector(".calender_pats"));
      } else if (!memberName) {
        memberIcon.setAttribute(
          "style",
          `height: 188px;
      width: 188px;
      background-image: url("https://cdn.hinatazaka46.com/images/14/263/732dfca7d5ebb83ba68acb11e4eb4/400_320_102400.jpg");
      border-radius: 50%;`
        );
      }
      memberIcon.setPenlightColor(code_01, code_02, 0, 16, 2, 1);
    };
    const createRelayBlogPhoto = (url) => {
      const relayPhoto = document.createElement("div");
      relayPhoto.classList.add("c-blog-member__icon");
      relayPhoto.setAttribute("style", `
    background-image: url(${url});
    background-size: 120%;
    border-radius: 10%;
    background-position-y: 5px;
    background-repeat: no-repeat;
    width: 210px;
    height: 130px;
    position: relative;
    z-index: 2;
  `);
      return relayPhoto;
    };
    const createInputTime = (cssClass, hour, minute) => {
      return `<div class="time-input-container">
        <div class="time-input">
            <input type="number" class="${cssClass} hour" aria-labelledby="h-${cssClass}-time" min="0" max="47" placeholder="--" value="${hour ?? ""}"/>
            <span>:</span>
            <input type="number" class="${cssClass} minute" aria-labelledby="h-${cssClass}-time" min="0" max="59" placeholder="--" value="${minute ?? ""}"/>
        </div>
    </div>`;
    };
    const CSS_TIME = `
    .time-input-container {
        margin: 2px 0;
    }
    .time-input {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 16px;
    }
    .time-input input {
        width: 42px;
        padding: 2px;
        border: 1px solid #ddd;
        border-radius: 3px;
        text-align: center;
        font-size: 16px;
    }
    .time-input input:focus {
        outline: none;
        border-color: #4CAF50;
    }
    .time-input.invalid {
        border-color: #f44336;
    }`;
    document.appendStyle("time", CSS_TIME);
    const formatNumber = (input) => {
      const value = input.value;
      if (value && value.length === 1) {
        input.value = "0" + value;
      }
    };
    const setInputTimeEventListener = () => {
      Array.prototype.forEach.call(document.querySelectorAll(".time-input"), (x) => {
        const inputHour = x.querySelector(".hour");
        inputHour.addEventListener("blur", function() {
          formatNumber(this);
        });
        inputHour.addEventListener("input", function() {
          if (this.value.length === 2) {
            const nextInput = this.nextElementSibling?.nextElementSibling;
            if (nextInput && nextInput.tagName === "INPUT") {
              nextInput.focus();
            }
          }
        });
        const inputMinute = x.querySelector(".minute");
        inputMinute.addEventListener("blur", function() {
          formatNumber(this);
        });
        inputMinute.addEventListener("input", function() {
          if (this.value.length === 2) {
            const nextInput = this.nextElementSibling?.nextElementSibling;
            if (nextInput && nextInput.tagName === "INPUT") {
              nextInput.focus();
            }
          }
        });
      });
    };
    const GRID_ROWS = 5;
    const GRID_CULOMNS = 12;
    const BUTTON_WIDTH = "6rem";
    const createMemberGrid = () => {
      const genSet = new Set();
      const alltimeMembers = Array.prototype.filter.call(Hinatazaka46.MEMBER_PROPERTIES, (m) => {
        const isPerson = parseInt(m.gen) > 0;
        if (isPerson) genSet.add(m.gen);
        return isPerson;
      });
      const membersGroupedByGens = Object.groupBy(alltimeMembers, ({ gen }) => {
        return gen;
      });
      const fragments = [];
      Set.prototype.forEach.call(genSet, (gen) => {
        let index = 0;
        Array.prototype.forEach.call(membersGroupedByGens[gen], (m) => {
          fragments.push(`<button class="toggle" data-no="${m.no}" aria-pressed="false">${m.ico}</button>`);
          index++;
        });
        for (let i = 0; i < GRID_CULOMNS - index; i++) {
          fragments.push(`<button class="blank" aria-pressed="false">&nbsp;</button>`);
        }
      });
      return fragments.join("");
    };
    const dialog = `
<!-- モーダルのオーバーレイ -->
<div class="overlay" id="overlay" hidden></div>

<!-- モーダル本体 (A) -->
<div class="modal" id="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle" hidden>
  <div class="modal-inner">
    <!-- A3: 左上の × ボタン -->
    <button class="close-btn" id="closeBtn" aria-label="Close">×</button>

    <h2 id="modalTitle" class="modal-title">Toggle Grid</h2>

    <!-- A2: 3列 × 12行のグリッド（A1の集合） -->
    <div class="toggle-grid" id="toggleGrid" aria-label="Toggle grid">
      ${createMemberGrid()}
    </div>

    <!-- A4: 右下の OK ボタン（押下時処理はスケルトン） -->
    <button class="ok-btn" id="okBtn">OK</button>
  </div>
  <input id="memberselect_target" tyoe="hidden" value="" hidden/>
  <input id="memberselect_row_index" tyoe="hidden" value="" hidden/>
</div>`;
    const MEM_SELECT_CSS = `
  :root {
    --modal-bg: #111;
    --panel-bg: #1a1a1a;
    --accent: #4cc9f0;
    --text: #f5f5f5;
    --shadow: rgba(0,0,0,0.4);
  }
  /* hidden 属性で表示非表示を制御 */
  [hidden] {
    visibility: hidden; /* 見えなくなる */
    opacity: 0;         /* 不透明度を 0 に */
    pointer-events: none; /* クリックを無効化 */
  }
  /* オーバーレイ */
  .overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(2px);
    z-index: 9999;
  }

  /* モーダル本体 */
  .modal {
    position: fixed;
    inset: 0;
    display: grid;
    place-items: center;
    z-index: 10000;
  }
  .modal-inner {
    position: relative;
    width: min(90vw, 1080px);
    max-height: min(90vh, 640px);
    background: var(--panel-bg);
    color: var(--text);
    border-radius: 16px;
    box-shadow: 0 20px 40px var(--shadow);
    padding: 56px 56px 72px; /* 余白を多めにして ×/OK を置きやすく */
    overflow: auto;
  }

  .modal-title {
    margin: 0 0 16px 0;
    font-size: 18px;
    font-weight: 600;
    opacity: 0.9;
  }

  /* A2: トグルのグリッド（横 {GRID_ROWS}} x 縦{GRID_CULOMNS}） */
  .toggle-grid {
    position: relative;
    display: grid;
    grid-template-columns: repeat(${GRID_CULOMNS}, ${BUTTON_WIDTH});
    grid-auto-rows: ${BUTTON_WIDTH};
    gap: 12px;
    align-content: start; /* 左詰め（縦方向も上に詰める） */
    width: max-content;   /* ちょうどの幅 */
    min-height: calc(${GRID_ROWS} * ${BUTTON_WIDTH} + (${GRID_ROWS} - 1) * 12px); /* {GRID_ROWS} 行分の高さ相当（見た目の目安） */
  }

  /* ボタン */
  .toggle, .blank {
    width: ${BUTTON_WIDTH};
    height: ${BUTTON_WIDTH};
    border-radius: 12px;
    border: 0;
    background: #222;
    color: #fff;
    font-size: 28px;
    display: grid;
    place-items: center;
    user-select: none;
    /* 凹凸（立ち上がり） */
    box-shadow: 0 6px 12px rgba(0,0,0,0.45), inset 0 0 0 rgba(255,255,255,0);
  }
  .toggle {
    cursor: pointer;
    transition: transform 120ms ease, box-shadow 120ms ease, background 120ms ease;
  }
  .toggle:active {
    transform: translateY(1px);
  }
  /* ひなのなの */
  .toggle:nth-child(25) {
    font-size: 16px;
  }
  /* ON状態（aria-pressed="true"）を凹（押し込み）っぽく */
  .toggle[aria-pressed="true"] {
    background: #1e2630;
    box-shadow:
      inset 0 6px 14px rgba(0,0,0,0.6),
      inset 0 -2px 6px rgba(255,255,255,0.06);
    outline: 2px solid var(--accent);
  }

  /* A3: 左上の × ボタン（グリッドの左上あたりに位置） */
  .close-btn {
    position: absolute;
    top: 14px;            /* modal-inner の内側左上 */
    left: 14px;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    border: 0;
    background: #2a2a2a;
    color: #eee;
    font-size: 18px;
    cursor: pointer;
    box-shadow: 0 6px 12px rgba(0,0,0,0.35);
    transition: transform 120ms ease, background 120ms ease;
  }
  .close-btn:hover { background: #333; }
  .close-btn:active { transform: translateY(1px); }

  /* A4: 右下の OK ボタン（グリッド右下に寄せる） */
  .ok-btn {
    position: absolute;
    right: 24px;
    bottom: 20px;
    padding: 10px 20px;
    border-radius: 10px;
    border: 0;
    background: var(--accent);
    color: #0b132b;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 8px 16px rgba(0,0,0,0.25);
    transition: transform 120ms ease, filter 120ms ease;
  }
  .ok-btn:hover { filter: brightness(1.05); }
  .ok-btn:active { transform: translateY(1px); }`;
    const styleElem = document.createElement("style");
    styleElem.setAttribute("rel", "stylesheet");
    styleElem.textContent = MEM_SELECT_CSS;
    document.head.appendChild(styleElem);
    document.body.insertAdjacentHTML("beforeend", dialog);
    const modal = document.getElementById("modal");
    const overlay = document.getElementById("overlay");
    const closeBtn = document.getElementById("closeBtn");
    const okBtn = document.getElementById("okBtn");
    const grid = document.getElementById("toggleGrid");
    modal.hidden = true;
    overlay.hidden = true;
    function openMemberSelectModal(target, rowIndex, members) {
      const rowIndexElement = document.getElementById("memberselect_row_index");
      rowIndexElement.value = rowIndex.toString();
      const targetElement = document.getElementById("memberselect_target");
      targetElement.value = target;
      const membersBinary = parseInt(members).toString(2);
      Array.prototype.forEach.call(modal.querySelectorAll(".toggle-grid > button"), (x) => {
        const memberNo = parseInt(x.dataset.no);
        x.setAttribute("aria-pressed", membersBinary.at(-1 * memberNo - 1) == "1" ? "true" : "false");
      });
      modal.hidden = false;
      overlay.hidden = false;
    }
    function closeModal() {
      modal.hidden = true;
      overlay.hidden = true;
    }
    closeBtn.addEventListener("click", closeModal);
    overlay.addEventListener("click", closeModal);
    okBtn.addEventListener("click", () => {
      const selected = Array.from(grid.querySelectorAll(".toggle"));
      const selectedNos = [...selected].map((btn) => btn.getAttribute("aria-pressed") === "true" ? parseInt(btn.dataset.no) : null).reduce((accumrator, current) => current ? accumrator + Math.pow(2, current) : accumrator, 0);
      const selectedIcons = [...selected].map((btn) => btn.getAttribute("aria-pressed") === "true" ? btn.innerText : "").join("");
      const hiddenRowIndex = document.getElementById("memberselect_row_index");
      const row = document.getElementById(`row[${hiddenRowIndex.value}]`);
      row.querySelector(".members_icon").innerText = selectedIcons;
      row.querySelector(".members").value = selectedNos ? selectedNos.toString() : "";
      closeModal();
    });
    grid.addEventListener("click", (e) => {
      const btn = e.target.closest(".toggle");
      if (!btn) return;
      const pressed = btn.getAttribute("aria-pressed") === "true";
      btn.setAttribute("aria-pressed", String(!pressed));
    });
    const createMonthAndDay = (selectedDate) => {
      const monthAndDayFragment = document.createDocumentFragment();
      const container = document.createElement("div");
      container.classList.add("date-picker-container");
      const inputMonthAndDay = document.createElement("input");
      inputMonthAndDay.classList.add("month-and-day");
      inputMonthAndDay.type = "text";
      inputMonthAndDay.setAttribute("aria-labelledby", "h-month-and-day");
      inputMonthAndDay.readOnly = true;
      inputMonthAndDay.placeholder = "月日を選択";
      container.appendChild(inputMonthAndDay);
      monthAndDayFragment.appendChild(container);
      const calendarPopup = document.createElement("div");
      calendarPopup.classList.add("calendar-popup");
      const calendarHeader = document.createElement("div");
      calendarHeader.classList.add("calendar-header");
      const monthSelect = document.createElement("select");
      monthSelect.classList.add("month-select");
      calendarHeader.appendChild(monthSelect);
      calendarHeader.append(new Text(" 月"));
      calendarPopup.appendChild(calendarHeader);
      const calendarGrid = document.createElement("div");
      calendarGrid.classList.add("calendar-grid");
      calendarPopup.appendChild(calendarGrid);
      container.appendChild(calendarPopup);
      for (let i = 1; i <= 12; i++) {
        const month = i.toString();
        const option = document.createElement("option");
        option.value = month;
        option.textContent = month;
        monthSelect.appendChild(option);
      }
      const updateDateInput = (month, day) => {
        const selectedMonth = month;
        const formattedDate = `${selectedMonth}月${day}日`;
        inputMonthAndDay.value = formattedDate;
        calendarPopup.classList.remove("active");
      };
      if (selectedDate) {
        const selectedMonth = parseInt(selectedDate.substring(0, 2));
        updateDateInput(selectedMonth, parseInt(selectedDate.substring(2, 4)));
        monthSelect.value = selectedMonth.toString();
      } else {
        const today = new Date();
        monthSelect.value = (today.getMonth() + 1).toString();
      }
      inputMonthAndDay.addEventListener("click", (e) => {
        e.stopPropagation();
        const calendarPopup2 = inputMonthAndDay.nextSibling;
        calendarPopup2.classList.toggle("active");
      });
      document.addEventListener("click", (event) => {
        const target = event.target;
        if (!target || !calendarPopup.contains(target) && target !== monthAndDayFragment) {
          calendarPopup.classList.remove("active");
        }
      });
      const renderCalendar = (month) => {
        calendarGrid.innerHTML = "";
        const daysInMonth = new Date(2024, month, 0).getDate();
        for (let day = 1; day <= daysInMonth; day++) {
          const dayCell = document.createElement("div");
          dayCell.classList.add("day-cell");
          dayCell.textContent = day.toString();
          dayCell.addEventListener("click", () => {
            updateDateInput(month, day);
            document.querySelectorAll(".day-cell").forEach((cell) => cell.classList.remove("selected"));
            dayCell.classList.add("selected");
          });
          calendarGrid.appendChild(dayCell);
        }
      };
      monthSelect.addEventListener("change", (event) => {
        const selectedMonth = event.target.value;
        renderCalendar(parseInt(selectedMonth));
      });
      renderCalendar(selectedDate ? parseInt(selectedDate.substring(0, 2)) : ( new Date()).getMonth() + 1);
      return monthAndDayFragment;
    };
    const CSS_MONTH_DATE_PICKER = `
.date-picker-container {
  position: relative;
  display: inline-block;
}
.month-and-day {
  padding: 2px 4px;
  cursor: pointer;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.calendar-popup {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 10px;
  z-index: 1000;
  font-family: "Libre Caslon Text", serif;
  font-optical-sizing: auto;
  font-weight: 400;
  font-style: normal;
}
.calendar-popup.active {
  display: block;
}

.calendar-header {
  text-align: center;
  margin-bottom: 10px;
}
.month-select {
  font-size: 26px;
  padding: 4px 0 0 8px;
}
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}
.day-cell {
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  transition: background-color 0.2s;
  font-size: 20px;
}
.day-cell:hover {
  background-color: #f0f0f0;
}
.day-cell.selected {
  background-color: #007bff;
  color: #fff;
}
`;
    const TARGET_ANNIVERSARY = "a";
    const TARGET_WEEKLY = "w";
    const TARGET_SPOT = "s";
    const CSS_CLASS_SCHEDULE_PAST = "schedule__list-pastday";
    const SCHEDULE_TARGET_ICON_DIC = { [TARGET_ANNIVERSARY]: "🎂", [TARGET_WEEKLY]: "🔄", [TARGET_SPOT]: "📍" };
    const KEY_ANNIVERSARY_SCHEDULES = "__userscript_ANNIVERSARY_SCHEDULES";
    const KEY_WEEKLY_SCHEDULES = "__userscript_WEEKLY_SCHEDULES";
    const KEY_SPOT_SCHEDULES = "__userscript_SPOT_SCHEDULES";
    const MINIMUM_SIZE = 3;
    const ID_BUTTON_ANNIVERSARY = "buttonAnniversary";
    const ID_BUTTON_WEEKLY = "buttonWeekly";
    const ID_BUTTON_SPOT = "buttonSpot";
    const ID_BUTTON_ADD = "addButton";
    const ID_BUTTON_SAVE = "saveButton";
    const SCHEDULE_TYPE = {
      "event": "イベント",
      "live": "LIVE",
      "stage": "舞台",
      "shakehands": "イベント",
      "goods": "グッズ",
      "release": "リリース",
      "ticket": "チケット",
      "tv": "テレビ",
      "radio": "ラジオ",
      "stream": "配信",
      "magazinw": "雑誌",
      "web-col": "WEB連載",
      "birthday": "誕生日",
      "other": "その他"
    };
    const SCHEDULE_TYPE_CSS = {
      "event": "category_event",
      "live": "category_event",
      "stage": "category_event",
      "shakehands": "category_shakehands",
      "goods": "category_goods",
      "release": "category_release",
      "ticket": "category_ticket",
      "tv": "category_media",
      "radio": "category_media",
      "stream": "category_media",
      "magazine": "category_media",
      "web-col": "category_media",
      "birthday": "category_birthday",
      "other": "category_other"
    };
    const SVG_ADD = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" height="2em">
    <!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
    <path fill="#2a3282" stroke="none" d="M160 144C151.2 144 144 151.2 144 160L144 480C144 488.8 151.2 496 160 496L480 496C488.8 496 496 488.8 496 480L496 160C496 151.2 488.8 144 480 144L160 144zM96 160C96 124.7 124.7 96 160 96L480 96C515.3 96 544 124.7 544 160L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 160zM296 408L296 344L232 344C218.7 344 208 333.3 208 320C208 306.7 218.7 296 232 296L296 296L296 232C296 218.7 306.7 208 320 208C333.3 208 344 218.7 344 232L344 296L408 296C421.3 296 432 306.7 432 320C432 333.3 421.3 344 408 344L344 344L344 408C344 421.3 333.3 432 320 432C306.7 432 296 421.3 296 408z"/>
  </svg>`;
    const SVG_SAVE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" height="2em">
    <!--!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
    <path fill="#2a3282" stroke="none" d="M160 144C151.2 144 144 151.2 144 160L144 480C144 488.8 151.2 496 160 496L480 496C488.8 496 496 488.8 496 480L496 237.3C496 233.1 494.3 229 491.3 226L416 150.6L416 240C416 257.7 401.7 272 384 272L224 272C206.3 272 192 257.7 192 240L192 144L160 144zM240 144L240 224L368 224L368 144L240 144zM96 160C96 124.7 124.7 96 160 96L402.7 96C419.7 96 436 102.7 448 114.7L525.3 192C537.3 204 544 220.3 544 237.3L544 480C544 515.3 515.3 544 480 544L160 544C124.7 544 96 515.3 96 480L96 160zM256 384C256 348.7 284.7 320 320 320C355.3 320 384 348.7 384 384C384 419.3 355.3 448 320 448C284.7 448 256 419.3 256 384z"/>
  </svg>`;
    const getScheduleCategory = (type) => {
      let category = "";
      switch (type) {
        case "shakehands":
          category = "shakehands";
          break;
        case "release":
          category = "release";
          break;
        case "event":
        case "live":
        case "stage":
          category = "event";
          break;
        case "goods":
          category = "goods";
          break;
        case "ticket":
          category = "ticket";
          break;
        case "birthday":
          category = "birthday";
          break;
        case "radio":
        case "tv":
        case "stream":
        case "web-col":
          category = "media";
          break;
        case "other":
          category = "other";
          break;
      }
      return category;
    };
    const SCHEDULE_4_SETTING = {
      "event": "イベント",
      "live": "LIVE",
      "stage": "舞台",
      "shakehands": "握手会",
      "goods": "グッズ",
      "release": "リリース",
      "ticket": "チケット",
      "tv": "テレビ",
      "radio": "ラジオ",
      "stream": "配信",
      "magazinw": "雑誌",
      "web-col": "WEB連載",
      "birthday": "誕生日",
      "other": "その他"
    };
    const DAY_OF_WEEK = { "0": "日", "1": "月", "2": "火", "3": "水", "4": "木", "5": "金", "6": "土" };
    const DAY_OF_WEEK_ENTRIES = Object.entries(DAY_OF_WEEK);
    const setScheduler = () => {
      document.appendStyle("schedule", CSS_SCHEDULE);
      document.appendStyle("schedule-modal", CSS_SCHEDULE_MODAL);
      document.appendStyle("month-date-picker", CSS_MONTH_DATE_PICKER);
      const lContents = document.querySelector(".l-contents");
      const rightSideBar = document.createElement("div");
      rightSideBar.setAttribute("id", "l-sidebar--schedule");
      rightSideBar.style.cssText = "display: block; position: absolute; width: 2000px; right: -2000px; top: 0; height: 100%;";
      const editPanel = `<div></div>`;
      rightSideBar.insertAdjacentHTML("afterbegin", editPanel);
      lContents.appendChild(rightSideBar);
      const editAnniversarySchedule = createSchedulerButton(ID_BUTTON_ANNIVERSARY, `${SCHEDULE_TARGET_ICON_DIC[TARGET_ANNIVERSARY]} Anniversary`);
      editAnniversarySchedule.addEventListener("click", () => openScheduler(TARGET_ANNIVERSARY));
      rightSideBar.appendChild(editAnniversarySchedule);
      const editWeeklySchedule = createSchedulerButton(ID_BUTTON_WEEKLY, `${SCHEDULE_TARGET_ICON_DIC[TARGET_WEEKLY]} Weekly`);
      editWeeklySchedule.addEventListener("click", () => openScheduler(TARGET_WEEKLY));
      rightSideBar.appendChild(editWeeklySchedule);
      const editSpotSchedule = createSchedulerButton(ID_BUTTON_SPOT, `${SCHEDULE_TARGET_ICON_DIC[TARGET_SPOT]} Spot`);
      editSpotSchedule.addEventListener("click", () => openScheduler(TARGET_SPOT));
      rightSideBar.appendChild(editSpotSchedule);
    };
    const confirmUseStorage = () => {
      const emptyBlacket = "[]";
      if (confirm("カスタムスケジュールを作成するには localStorage に値を保存する必要があります。よろしいですか？")) {
        if (!localStorage.getItem(KEY_ANNIVERSARY_SCHEDULES)) {
          localStorage.setItem(KEY_ANNIVERSARY_SCHEDULES, emptyBlacket);
        }
        if (!localStorage.getItem(KEY_WEEKLY_SCHEDULES)) {
          localStorage.setItem(KEY_WEEKLY_SCHEDULES, emptyBlacket);
        }
        if (!localStorage.getItem(KEY_SPOT_SCHEDULES)) {
          localStorage.setItem(KEY_SPOT_SCHEDULES, emptyBlacket);
        }
      } else {
        alert("カスタムスケジュール作成を中止します。");
      }
    };
    const openScheduler = (target) => {
      const schedulerModal = document.createElement("div");
      schedulerModal.classList.add("modal--schedule");
      schedulerModal.style.display = "flex";
      const close = document.createElement("span");
      close.classList.add("close");
      close.addEventListener("click", (e) => {
        e.stopPropagation();
        closeSchedulerModal(schedulerModal);
      });
      schedulerModal.appendChild(close);
      schedulerModal.insertAdjacentHTML("beforeend", '<div class="update_log"></div>');
      let schedule_key;
      let saveSchedule;
      switch (target) {
        case TARGET_ANNIVERSARY:
          schedule_key = KEY_ANNIVERSARY_SCHEDULES;
          saveSchedule = saveAnniversary;
          break;
        case TARGET_WEEKLY:
          schedule_key = KEY_WEEKLY_SCHEDULES;
          saveSchedule = saveWeekly;
          break;
        case TARGET_SPOT:
          schedule_key = KEY_SPOT_SCHEDULES;
          saveSchedule = saveSpot;
          break;
        default:
          throw new TypeError("Illegal Schedeule Target is given.");
      }
      const saveButton = createSchedulerButton(ID_BUTTON_SAVE, SVG_SAVE);
      saveButton.classList.add("button--save");
      saveButton.addEventListener("click", saveSchedule);
      schedulerModal.appendChild(saveButton);
      const addButton = createSchedulerButton(ID_BUTTON_ADD, SVG_ADD);
      addButton.classList.add("button--add");
      addButton.addEventListener("click", () => {
        const grid2 = document.querySelector(".grid");
        const length = grid2.children.length;
        const createRowFunc = getCreateRowFunc(target);
        const row = createRowFunc(length);
        grid2?.insertAdjacentHTML("beforeend", row);
        if (target == TARGET_ANNIVERSARY) {
          const monthAndDay = grid2.querySelector(`[id="row[${length}]"] > .month-and-day`);
          monthAndDay?.appendChild(createMonthAndDay());
        }
        const updLog = document.querySelector(".update_log");
        updLog.insertAdjacentHTML("beforeend", `<p>[${createDatetime( new Date())}] 入力行を追加しました。</p>`);
        var bottom = updLog.scrollHeight - updLog.clientHeight;
        updLog.scroll(0, bottom);
      });
      schedulerModal.appendChild(addButton);
      if (!localStorage.getItem(schedule_key)) {
        confirmUseStorage();
      }
      createSchedulerModal(target, schedulerModal, localStorage.getItem(schedule_key));
      setOpenMemberSelectModal(schedulerModal, target);
      document.body.appendChild(schedulerModal);
      if ([TARGET_WEEKLY, TARGET_SPOT].includes(target)) {
        setInputTimeEventListener();
        setZoomEvent();
      }
    };
    const saveAnniversary = (e) => {
      e.stopPropagation();
      const records = new Array();
      Array.prototype.forEach.call(document.querySelectorAll(".grid .row"), (x, i) => {
        const record = new AnniversarySchedule(i + 1);
        Array.prototype.forEach.call(x.querySelectorAll("input, select"), (y) => {
          const classes = y.classList;
          if (classes.contains("type")) {
            record.type = y.value;
          } else if (classes.contains("month-and-day")) {
            const monthAndDay = y.value.match(/(\d{1,2})\D(\d{1,2})\D/);
            record.date = monthAndDay ? monthAndDay[1].padStart(2, "0") + monthAndDay[2].padStart(2, "0") : "";
          } else if (classes.contains("title")) {
            record.title = y.value.escapeString();
          } else if (classes.contains("link")) {
            record.link = y.value;
          } else if (classes.contains("members")) {
            record.members = y.value;
          }
        });
        if (record.isEmpty()) {
          return;
        } else if (record.isValid(x)) {
          records.push(record);
        }
      });
      records.sort((a, b) => {
        if (a.date > b.date || a.type > b.type || a.type === "birthday" && b.type === a.type && a.date === b.date && a.members > b.members) {
          return -1;
        } else {
          return 1;
        }
      });
      save(KEY_ANNIVERSARY_SCHEDULES, records);
    };
    const dayOfWeekDigit = (arr) => arr.reduce((p, c) => p + Math.pow(2, 6 - parseInt(c)), 0);
    const saveWeekly = (e) => {
      e.stopPropagation();
      const records = new Array();
      Array.prototype.forEach.call(document.querySelectorAll(".grid .row"), (x, i) => {
        const record = new WeeklySchedule(i + 1);
        Array.prototype.forEach.call(x.querySelectorAll("input, select"), (y) => {
          const classes = y.classList;
          if (classes.contains("from")) {
            record.from = y.value?.replaceAll("-", "");
          } else if (classes.contains("to")) {
            record.to = y.value?.replaceAll("-", "");
          } else if (classes.contains("type")) {
            record.type = y.value;
          } else if (classes.contains("dow") && y.checked) {
            record.dow?.push(y.value);
          } else if (classes.contains("start")) {
            if (classes.contains("hour")) {
              record.startHour = y.value;
            } else {
              record.startMinute = y.value;
            }
          } else if (classes.contains("end")) {
            if (classes.contains("hour")) {
              record.endHour = y.value;
            } else {
              record.endMinute = y.value;
            }
          } else if (classes.contains("title")) {
            record.title = y.value.escapeString();
          } else if (classes.contains("link")) {
            record.link = y.value;
          } else if (classes.contains("members")) {
            record.members = y.value;
          }
        });
        if (record.isEmpty()) {
          return;
        } else if (record.isValid(x)) {
          records.push(record);
        }
      });
      records.sort((a, b) => {
        if (a.from < b.from || a.from === b.from && dayOfWeekDigit(a.dow) > dayOfWeekDigit(b.dow)) {
          return -1;
        } else {
          return 1;
        }
      });
      save(KEY_WEEKLY_SCHEDULES, records);
    };
    const saveSpot = (e) => {
      e.stopPropagation();
      const records = new Array();
      Array.prototype.forEach.call(document.querySelectorAll(".grid .row"), (x, i) => {
        const record = new SpotSchedule(i + 1);
        Array.prototype.forEach.call(x.querySelectorAll("input, select"), (y) => {
          const classes = y.classList;
          if (classes.contains("date")) {
            record.date = y.value?.replaceAll("-", "");
          } else if (classes.contains("type")) {
            record.type = y.value;
          } else if (classes.contains("start")) {
            if (classes.contains("hour")) {
              record.startHour = y.value;
            } else {
              record.startMinute = y.value;
            }
          } else if (classes.contains("end")) {
            if (classes.contains("hour")) {
              record.endHour = y.value;
            } else {
              record.endMinute = y.value;
            }
          } else if (classes.contains("title")) {
            record.title = y.value.escapeString();
          } else if (classes.contains("link")) {
            record.link = y.value;
          } else if (classes.contains("members")) {
            record.members = y.value;
          }
        });
        if (record.isEmpty()) {
          return;
        } else if (record.isValid(x)) {
          records.push(record);
        }
      });
      records.sort((a, b) => {
        if (a.date < b.date) {
          return -1;
        } else {
          return 1;
        }
      });
      save(KEY_SPOT_SCHEDULES, records);
    };
    const createSchedulerModal = (target, modal2, jsonSchedules) => {
      const fragment = new DocumentFragment();
      const panel = document.createElement("div");
      panel.classList.add("panel--schedule");
      fragment.appendChild(panel);
      panel.insertAdjacentHTML("beforeend", (() => {
        switch (target) {
          case TARGET_ANNIVERSARY:
            return HEADER_ANNIVERSARY;
          case TARGET_WEEKLY:
            return HEADER_WEEKLY;
          case TARGET_SPOT:
            return HEADER_SPOT;
          default:
            return "";
        }
      })());
      const grid2 = document.createElement("div");
      grid2.classList.add("grid");
      panel.appendChild(grid2);
      const createRowFunc = getCreateRowFunc(target);
      const schedules = JSON.parse(jsonSchedules);
      schedules.forEach((x, i) => {
        const bitPos = bitPositions(BigInt(x.members ? parseInt(x.members) : 0));
        const memberIcons = bitPos.map((x2) => Hinatazaka46.MEMBER_PROPERTIES[x2].ico).join("");
        x.memberIcons = memberIcons;
        const record = createRowFunc(i, x);
        grid2.insertAdjacentHTML("beforeend", record);
        if (target == TARGET_ANNIVERSARY) {
          const monthAndDay = panel.querySelector(`[id="row[${i}]"] > .month-and-day`);
          monthAndDay?.appendChild(createMonthAndDay(x.date));
        }
      });
      const rowCnt = schedules.length;
      const maxCnt = rowCnt + MINIMUM_SIZE;
      for (let i = rowCnt; i < maxCnt; i++) {
        const record = createRowFunc(i);
        grid2.insertAdjacentHTML("beforeend", record);
        if (target === TARGET_ANNIVERSARY) {
          const monthAndDay = panel.querySelector(`[id="row[${i}]"] > .month-and-day`);
          monthAndDay?.appendChild(createMonthAndDay());
        }
      }
      modal2.appendChild(fragment);
      modal2.insertAdjacentHTML("beforeend", '<input id="is_saved" type="hidden" value="false" hidden/>');
    };
    const getCreateRowFunc = (target) => {
      switch (target) {
        case TARGET_ANNIVERSARY:
          return createAnniversaryRow;
        case TARGET_WEEKLY:
          return createWeeklyRow;
        case TARGET_SPOT:
          return createSpotRow;
        default:
          return (_i, _x) => "想定しないTARGET";
      }
    };
    const createSchedulerButton = (id, label) => {
      const button = document.createElement("div");
      if (label.toLowerCase().startsWith("<svg")) {
        button.innerHTML = label;
      } else {
        button.innerText = label;
      }
      button.setAttribute("id", id);
      button.classList.add("button--schedule");
      button.onmousedown = () => button.classList.add("pressed");
      button.onmouseup = () => button.classList.remove("pressed");
      button.onmouseleave = () => button.classList.remove("pressed");
      return button;
    };
    const setOpenMemberSelectModal = (schedulerModal, target) => {
      Array.prototype.forEach.call(schedulerModal.querySelectorAll(".button"), (x) => {
        x.addEventListener("click", () => {
          const index = x.dataset.index;
          const members = document.querySelector(`[id="row[${index}]"] .members`).value;
          openMemberSelectModal(target, index, members);
        });
      });
    };
    const clearRow = (index) => {
      const row = document.getElementById("row[" + index + "]");
      Array.prototype.forEach.call(row?.querySelectorAll("input"), (x) => {
        if (x.type == "checkbox") {
          x.checked = false;
        } else if (["text", "date", "time", "url"].includes(x.type)) {
          x.value = "";
        }
      });
      Array.prototype.forEach.call(row?.querySelectorAll("select"), (x) => {
        x.selectedIndex = 0;
      });
    };
    const scriptElem = document.createElement("script");
    scriptElem.setAttribute("type", "text/javascript");
    scriptElem.textContent = "const clearRow = " + clearRow.toString();
    document.head.appendChild(scriptElem);
    const createScheduleTypeOptions = (type) => {
      let options = '<option value="" style="color: red;">選択してください</option>';
      Array.prototype.forEach.call(Object.keys(SCHEDULE_4_SETTING), (x) => {
        options += `<option value="${x}" ${x == type ? "selected" : ""}>${SCHEDULE_4_SETTING[x]}</option>`;
      });
      return options;
    };
    const closeSchedulerModal = (modal2) => {
      const saved = document.getElementById("is_saved");
      if (saved.value === "true") {
        document.getElementById("pageForm").submit();
      }
      modal2.style.animation = "modalFadeOut 0.3s forwards";
      modal2.addEventListener("animationend", () => {
        modal2.style.display = "none";
        document.body.removeChild(modal2);
      });
    };
    const insertCustomSchedule = (category, yearMonth, lMainContentsUl, day, dayElem) => {
      const date = yearMonth + String(day).padStart(2, "0");
      insertAnniversarySchedule(category, date, dayElem);
      insertSpotSchedule(category, date, dayElem);
      insertWeeklySchedule(category, date, dayElem);
      void lMainContentsUl.offsetHeight;
    };
    const insertAnniversarySchedule = (category, date, dayElem) => {
      const anniversarySchedules = ((x) => JSON.parse(x ?? "[]"))(localStorage.getItem(KEY_ANNIVERSARY_SCHEDULES));
      Array.prototype.forEach.call(anniversarySchedules, (x) => {
        const monthAndDay = date.substring(4, 8);
        const scheduleCategory = getScheduleCategory(x.type);
        if (monthAndDay == x.date && (category == "all" || scheduleCategory == category)) {
          insertSchedule(dayElem, TARGET_ANNIVERSARY, x);
        }
      });
    };
    const insertWeeklySchedule = (category, date, dayElem) => {
      const dow = dayElem.querySelector("b").innerText;
      const weeklySchedules = ((x) => JSON.parse(x ?? "[]"))(localStorage.getItem(KEY_WEEKLY_SCHEDULES));
      Array.prototype.forEach.call(weeklySchedules, (x) => {
        x.dow.some((d) => {
          if (dow == DAY_OF_WEEK[d]) {
            const scheduleCatedory = getScheduleCategory(x.type);
            if ((x.from?.isEmpty() || date >= x.from) && (x.to?.isEmpty || date <= x.to) && (category == "all" || scheduleCatedory == category)) {
              const dayOfWeekArray = x.dow;
              dayOfWeekArray[dayOfWeekArray.indexOf("sun")] = "0";
              dayOfWeekArray[dayOfWeekArray.indexOf("mon")] = "1";
              dayOfWeekArray[dayOfWeekArray.indexOf("tue")] = "2";
              dayOfWeekArray[dayOfWeekArray.indexOf("wed")] = "3";
              dayOfWeekArray[dayOfWeekArray.indexOf("thu")] = "4";
              dayOfWeekArray[dayOfWeekArray.indexOf("fri")] = "5";
              dayOfWeekArray[dayOfWeekArray.indexOf("sat")] = "6";
              insertSchedule(dayElem, TARGET_WEEKLY, x);
            }
            return true;
          }
          return false;
        });
      });
    };
    const insertSpotSchedule = (category, date, dayElem) => {
      const spotSchedules = ((x) => JSON.parse(x ?? "[]"))(localStorage.getItem(KEY_SPOT_SCHEDULES));
      Array.prototype.forEach.call(spotSchedules, (x) => {
        const scheduleCategory = getScheduleCategory(x.type);
        if (date == x.date && (category == "all" || scheduleCategory == category)) {
          insertSchedule(dayElem, TARGET_SPOT, x);
        }
      });
    };
    const insertSchedule = (dayElem, target, schedule) => {
      const setMewmbers = BigInt(schedule.members ? parseInt(schedule.members) : 0);
      const filterMembers = Array.prototype.filter.call(document.querySelectorAll('#pageForm > [name="list[]"]'), (x) => {
        return !isNaN(x.value);
      }).map((x) => x.value).reduce((p, c) => p + Math.pow(2, c), 0);
      if (filterMembers != 0 && (BigInt(filterMembers) & setMewmbers) == 0n) return;
      const items = dayElem.getElementsByClassName("p-schedule__item");
      if (items.length == 0) {
        const daylyScheduleList = dayElem.querySelector(".p-schedule__list.p-schedule__list--long");
        daylyScheduleList.insertAdjacentHTML(
          "afterbegin",
          `<li class="p-schedule__item">
              <a href="${schedule.link ? schedule.link : "javascript:void(0)"}" ${schedule.link ? "" : 'class="linkless" onClick="return false;"'}>
                <div class="p-schedule__head">
                  <div class="c-schedule__category ${SCHEDULE_TYPE_CSS[schedule.type]}">
                    ${SCHEDULE_TYPE[schedule.type]}
                  </div>
                  <div class="c-schedule__time--list">
                    ${schedule.start ? schedule.start.toTimeFormat() + "〜" + schedule.end.toTimeFormat() : ""}
                  </div>
                </div>
                <p class="c-schedule__text">
                  ${SCHEDULE_TARGET_ICON_DIC[target]} ${schedule.title}
                </p>
              </a>
            </li>`
        );
      } else {
        Array.prototype.some.call(Array.prototype.slice.call(items).reverse(), (item, i) => {
          const insertScheduleHTML = () => item.insertAdjacentHTML(
            "afterend",
            `<li class="p-schedule__item">
              <a href="${schedule.link ? schedule.link : "javascript:void(0)"}" ${schedule.link ? "" : 'class="linkless" onClick="return false;"'}>
                <div class="p-schedule__head">
                  <div class="c-schedule__category ${SCHEDULE_TYPE_CSS[schedule.type]}">
                    ${SCHEDULE_TYPE[schedule.type]}
                  </div>
                  <div class="c-schedule__time--list">
                    ${schedule.start ? schedule.start.toTimeFormat() + "〜" + schedule.end.toTimeFormat() : ""}
                  </div>
                </div>
                <p class="c-schedule__text">
                  ${SCHEDULE_TARGET_ICON_DIC[target]} ${schedule.title}
                </p>
              </a>
            </li>`
          );
          const timeElem = item.querySelector(".c-schedule__time--list");
          if (!timeElem) {
            insertScheduleHTML();
            return true;
          } else {
            if (timeElem.innerText) {
              const time = timeElem.innerText.match(/[0-9]{1,2}:[0-9]{2}/)[0];
              const start = schedule.start;
              if (time < start || i == items.length - 1 || !start) {
                insertScheduleHTML();
                return true;
              }
            } else {
              insertScheduleHTML();
              return true;
            }
          }
          return false;
        });
      }
    };
    const fillEmpty = (lMainContentsUl, yearMonth, days) => {
      if (yearMonth) {
        fillEmptyMonthly(lMainContentsUl, yearMonth, days);
      } else {
        fillEmptyDay(lMainContentsUl);
      }
    };
    const fillEmptyMonthly = (lMainContentsUl, dispYearMonth, extenddays) => {
      const year = parseInt(dispYearMonth.substring(0, 4));
      const month = parseInt(dispYearMonth.substring(4, 6));
      const isNextMonth = !!extenddays;
      const lastDay = isNextMonth ? extenddays : new Date(year, month, 0).getDate();
      const dayArray = Array.prototype.map.call(lMainContentsUl.querySelectorAll(".c-schedule__date--list span"), (x) => {
        return parseInt(x.innerText);
      });
      const diff = [];
      for (let i = 1; i <= lastDay; i++) {
        if (dayArray.indexOf(i) === -1) {
          diff.push(new Date(year, month - 1, i));
        }
      }
      if (diff.length === 0) return;
      const today = new Date();
      const todayString = today.toYYYYMMDD();
      const listGroup = lMainContentsUl.querySelectorAll(".p-schedule__list-group");
      const dayClassForumula = (x) => x < todayString ? CSS_CLASS_SCHEDULE_PAST : x == todayString ? "schedule__list-today" : "schedule__list-future";
      Array.prototype.forEach.call(listGroup, (x) => {
        const dispDate = parseInt(x.querySelector("span").innerText);
        Array.prototype.forEach.call([...diff], (d) => {
          const diffDate = d.getDate();
          const dateString = d.toYYYYMMDD();
          const dayClass = dayClassForumula(dateString);
          if (diffDate < dispDate) {
            x.insertAdjacentHTML(
              "beforebegin",
              `<div class="p-schedule__list-group ${dayClass} ${isNextMonth ? "nextmonth" : ""}">
            <div class="c-schedule__date--list">
              <span ${diffDate == today.getDate() ? 'class="schedule__date-today"' : ""}>${diffDate}</span><b>${DAY_OF_WEEK_ENTRIES[d.getDay()][1]}</b>
            </div>
            <ul class="p-schedule__list p-schedule__list--long">
            </ul>
          </div>`
            );
            diff.shift();
          }
        });
      });
      Array.prototype.forEach.call(diff, (d) => {
        const dateString = d.toDateString();
        const dayClass = dayClassForumula(dateString);
        lMainContentsUl.insertAdjacentHTML(
          "beforeend",
          `<div class="p-schedule__list-group ${dayClass}">
        <div class="c-schedule__date--list">
          <span ${dateString == todayString ? 'class="schedule__date-today"' : ""}>${d.getDate()}</span><b>${DAY_OF_WEEK_ENTRIES[d.getDay()][1]}</b>
        </div>
        <ul class="p-schedule__list p-schedule__list--long">
        </ul>
      </div>`
        );
      });
    };
    const fillEmptyDay = (lMainContentsUl, d) => {
      const todayElem = lMainContentsUl.querySelector(".c-schedule__date--list span");
      if (!todayElem) {
        lMainContentsUl.insertAdjacentHTML("beforeend", createDateHTML(d));
      }
    };
    const createDateHTML = (d) => {
      let dayString;
      if (d) {
        const nextMonth = (d.getMonth() + 2) % 12;
        dayString = `<font size="-1">${nextMonth}/</font>${d.getDate()}`;
      } else {
        d = new Date();
        dayString = ( new Date()).getDate();
      }
      return `<div class="p-schedule__list-group">
      <div class="c-schedule__date--list">
        <span>${dayString}</span><b>${DAY_OF_WEEK_ENTRIES[d.getDay()][1]}</b>
      </div>
      <ul class="p-schedule__list p-schedule__list--long">
      </ul>
    </div>`;
    };
    const setZoomEvent = () => {
      Array.prototype.forEach.call(document.querySelectorAll(".title, .link"), (x) => {
        x.addEventListener("dblclick", () => {
          x.classList.toggle("zoom");
        });
        x.addEventListener("blur", () => {
          if (x.classList.contains("zoom")) {
            x.classList.remove("zoom");
          }
        });
      });
    };
    String.prototype.isEmpty = function() {
      return !this.isNotEmpty();
    };
    String.prototype.isNotEmpty = function() {
      if (this) {
        return this.length > 0;
      } else {
        return false;
      }
    };
    String.prototype.escapeString = function() {
      return this.replace("\\", "\\\\").replace('"', '"');
    };
    Array.prototype.getChecked = function(dow) {
      return this.includes(dow) ? "checked" : "";
    };
    const formatter = new Intl.DateTimeFormat("ja-JP", {
year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    });
    Date.prototype.toYYYYMMDD = function() {
      const parts = formatter.formatToParts(this);
      const values = Object.fromEntries(parts.map((p) => [p.type, p.value]));
      const yyyyMMdd = `${values.year}${values.month}${values.day}`;
      return yyyyMMdd;
    };
    class Schedule {
      constructor(no, type, title, link, members, start, end) {
        __publicField(this, "no");
        __publicField(this, "type");
        __publicField(this, "title");
        __publicField(this, "link");
        __publicField(this, "start");
        __publicField(this, "_startHour");
        __publicField(this, "_startMinute");
        __publicField(this, "end");
        __publicField(this, "_endHour");
        __publicField(this, "_endMinute");
        __publicField(this, "members");
        __publicField(this, "memberIcons");
        this.no = no;
        this.type = type;
        this.title = title;
        this.link = link;
        this.members = members;
        this.start = start ?? "";
        this._startHour = start ? start.substring(0, 2) : "";
        this._startMinute = start ? start.substring(0, 2) : "";
        this.end = end ?? "";
        this._endHour = end ? end.substring(0, 2) : "";
        this._endMinute = end ? end.substring(0, 2) : "";
      }
      isValid(element) {
        const isTypeSelected = this.type.isNotEmpty();
        strength(isTypeSelected, element, ".type");
        if (!isTypeSelected) scrWarnlog(this.no + "行目 「種別」を選択してください。");
        const isValidTitle = this.title.isNotEmpty();
        strength(isValidTitle, element, ".title");
        if (!isValidTitle) scrWarnlog(this.no + "行目 「タイトル」を入力してください。");
        const isValid = isTypeSelected && isValidTitle;
        return isValid;
      }
      isValidTime(element) {
        const isValidStartHour = isValidHour(this._startHour);
        if (!isValidStartHour) scrWarnlog(this.no + "行目 「開始時間」の時は0〜47の範囲で入力してください");
        strength(isValidStartHour, element, ".start.hour");
        const isValidStartMinute = isValidMinute(this._startMinute);
        if (!isValidStartMinute) scrWarnlog(this.no + "行目 「開始時間」の分は0〜59の範囲で入力してください");
        strength(isValidStartMinute, element, ".start.minute");
        const isValidStart = this.startHour.isNotEmpty() === this.startMinute.isNotEmpty();
        if (!isValidStart) scrWarnlog(this.no + "行目 「開始時間」の時分を両方設定するか両方未設定にしてください。");
        const isValidEndHour = isValidHour(this._endHour);
        if (!isValidEndHour) scrWarnlog(this.no + "行目 「終了時間」の時は0〜47の範囲で入力してください");
        strength(isValidEndHour, element, ".end.hour");
        const isValidEndMinute = isValidMinute(this._endMinute);
        if (!isValidEndMinute) scrWarnlog(this.no + "行目 「終了時間」の分は0〜59の範囲で入力してください");
        strength(isValidEndMinute, element, ".end.minute");
        const isValidEnd = this.endHour.isNotEmpty() === this.endMinute.isNotEmpty();
        if (!isValidEnd) scrWarnlog(this.no + "行目 「終了時間」の時分を両方設定するか両方未設定にしてください。");
        strength(isValidEnd, element, ".end.hour, .end.minute");
        const isNotEmptyStart = this.startHour.isNotEmpty() || this.startMinute.isNotEmpty();
        const isNotEmptyEnd = this.endHour.isNotEmpty() || this.endMinute.isNotEmpty();
        const isValidTime = !(!isNotEmptyStart && isNotEmptyEnd);
        if (!isValidTime) scrWarnlog(this.no + "行目 「開始時間」を設定してください。");
        strength(isValidStart && isValidTime, element, ".start.hour, .start.minute");
        const isValidOrder = !this.end || !this.start && !this.end || this.start < this.end;
        if (!isValidOrder) scrWarnlog(this.no + "行目 「開始時間」＜「終了時間」となるように設定してください。");
        strength(isValidOrder, element, ".start.hour, .start.minute, .end.hour, .end.minute");
        const isValid = isValidStartHour && isValidStartMinute && isValidStart && isValidEndHour && isValidEndMinute && isValidEnd && isValidStart && isValidTime && isValidEnd && isValidOrder;
        return isValid;
      }
      isEmpty() {
        return !this.type && !this.title && !this.link;
      }
      set startHour(hour) {
        this._startHour = hour;
        if (this._startMinute) {
          this.start = this._startHour + this._startMinute;
        }
      }
      get startHour() {
        return this._startHour;
      }
      set startMinute(minute) {
        this._startMinute = minute;
        if (this._startHour) {
          this.start = this._startHour + this._startMinute;
        } else if (!this._startHour) {
          this.start = "";
        }
      }
      get startMinute() {
        return this._startMinute;
      }
      set endHour(hour) {
        this._endHour = hour;
        if (this._endMinute) {
          this.end = this._endHour + this._endMinute;
        } else if (!this._endHour) {
          this.end = "";
        }
      }
      get endHour() {
        return this._endHour;
      }
      set endMinute(minute) {
        this._endMinute = minute;
        if (this._endHour) {
          this.end = this._endHour + this._endMinute;
        } else if (!this._endHour) {
          this.end = "";
        }
      }
      get endMinute() {
        return this._endMinute;
      }
    }
    const isValidHour = (hour) => hour.isEmpty() || ((h) => h >= 0 && h <= 47)(parseInt(hour));
    const isValidMinute = (minute) => minute.isEmpty() || ((m) => m >= 0 && m <= 59)(parseInt(minute));
    class AnniversarySchedule extends Schedule {
      constructor(no, type, title, link, members) {
        super(
          no,
          type,
          title,
          link,
          members
        );
        __publicField(this, "date");
        this.date = this.date;
      }
isValid(element) {
        const isValidSchedule = super.isValid(element);
        const isValidDow = this.date.isNotEmpty();
        strength(isValidDow, element, ".month-and-day");
        const isValid = isValidSchedule && isValidDow;
        return isValid;
      }
      isEmpty() {
        return super.isEmpty() && !this.date;
      }
    }
    class WeeklySchedule extends Schedule {
      constructor(no, type, title, link, members, from, to, start, end) {
        super(
          no,
          type,
          title,
          link,
          members,
          start,
          end
        );
        __publicField(this, "from");
        __publicField(this, "to");
        __publicField(this, "dow", []);
        this.from = from;
        this.to = to;
      }
isValid(element) {
        const isValidSchedule = super.isValid(element);
        const isValidDow = this.dow.length > 0;
        strength(isValidDow, element, ".dowlabel");
        const isValidTime = super.isValidTime(element);
        const isValid = isValidSchedule && isValidDow && isValidTime;
        return isValid;
      }
      isEmpty() {
        return super.isEmpty() && !this.from && !this.to && this.dow.length == 0;
      }
    }
    class SpotSchedule extends Schedule {
      constructor(no, type, title, link, members, date, start, end) {
        super(no, type, title, link, members, start = start, end = end);
        __publicField(this, "date");
        this.date = date;
      }
      isValid(element) {
        const isValidSchedule = super.isValid(element);
        const isValidDate = this.date.isNotEmpty();
        strength(isValidDate, element, ".date");
        const isValidTime = super.isValidTime(element);
        const isValid = isValidSchedule && isValidDate && isValidTime;
        return isValid;
      }
      isEmpty() {
        return super.isEmpty() && !this.date;
      }
    }
    const strength = (isValid, element, selector) => {
      Array.prototype.forEach.call(element.querySelectorAll(selector), (x) => {
        if (!isValid && !x.classList.contains("alert")) {
          x.classList.add("alert");
        } else if (isValid && x.classList.contains("alert")) {
          x.classList.remove("alert");
        }
      });
    };
    const CSS_SCHEDULE_MODAL = `
    .modal--schedule {
      display: none;
      position: fixed;
      z-index: 1000;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      background-color: rgb(0,0,0);
      background-color: rgba(0,0,0,0.9);
      align-items: center;
      justify-content: center;
      animation: modalFadeIn 0.3s;
    }
    .button--save {
      position: absolute;
      top: 60px;
      left: 200px;
    }
    .button--add {
      position: absolute;
      top: 60px;
      left: 300px;
    }

    #${ID_BUTTON_ANNIVERSARY}, #${ID_BUTTON_WEEKLY}, #${ID_BUTTON_SPOT} {
      width: 200px;
      height: 48px;
      position: relative;
      margin-top: 40px;
    }
    .zoom {
      width: 850px !important;
      height: 30px;
      font-size: 20px;
      margin-left: -400px;
    }
    div:has(.zoom) {
      z-index: 10000;
      place-items: center;
    }
    .button--schedule {
      padding: 8px 24px 0 24px;
      border: none;
      border-radius: 12px;
      background: linear-gradient(135deg, #4facfe, #00f2fe);
      color: white;
      font-size: 2rem;
      font-weight: bold;
      cursor: pointer;
      box-shadow: 0 6px 12px rgba(0,0,0,0.2);
      transition: all 0.15s ease;
    }
    .button--schedule.pressed {
      transform: scale(0.95);
      box-shadow: 0 3px 6px rgba(0,0,0,0.3);
      background: linear-gradient(135deg, #3a8dde, #00c2ce);
    }
    @keyframes modalFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes modalFadeOut {
      from { opacity: 1; }
    }
    .panel--schedule {
      background-color: white;
      position: absolute;
      top: 160px;

      .grid {
        min-height: 330px;
        max-height: 6000px;
        overflow:scroll;
      }
    }
    .close {
      position: absolute;
      top: 30px;
      left: 120px;
      display: inline-block;
      inline-size: 1em;
      aspect-ratio: 1;
      cursor: pointer;

      &::before,
      &::after {
        position: absolute;
        inset: 0;
        inline-size: 100%;
        block-size: 1px;
        margin: auto;
        content: "";
        background-color: currentcolor;
        --color: #ffffff;
        color: var(--color);
        width: 2rem;
        height: 0.2rem;
      }
      &::before {
        rotate: -45deg;
      }
      &::after {
        rotate: 45deg;
      }
    }
    .update_log {
      position: absolute;
      top: 60px;
      left: 450px;
      width: 1080px;
      height: 70px;
      overflow: scroll;

      background-color: black;

      p:nth-last-child(1) {
        color: ${HINATA_BLUE};
      }
      p:not(nth-last-child(1)) {
        color: darkcyan;
      }
      p.warn { color: lightpink; font-weight: 900; }

      .container {
        scrollbar-width: none;
      }
      -ms-overflow-style: none;
      &&::-webkit-scrollbar{
        display: none;
      }
    }`;
    const TRASH_WIDTH = "30px";
    const INDEX_WIDTH = "30px";
    const TIME_WIDTH = "100px";
    const DATE_WIDTH = "160px";
    const TYPE_WIDTH = "150px";
    const TITLE_WIDTH = "240px";
    const LINK_WIDTH = "200px";
    const PERSON_ICON_WIDTH = "30px";
    const MEMBER_PARADE_WIDTH = "100px";
    const CSS_SCHEDULE = `
    .schedule-form { font-family: system-ui, sans-serif; }
    .anniversary {
      display: grid;
      grid-template-columns: ${TRASH_WIDTH} ${INDEX_WIDTH} 120px ${TYPE_WIDTH} ${TITLE_WIDTH} ${LINK_WIDTH} ${PERSON_ICON_WIDTH} ${MEMBER_PARADE_WIDTH};
      gap: 8px;
      align-items: center;
    }
    .weekly {
      display: grid;
      grid-template-columns: ${TRASH_WIDTH} ${INDEX_WIDTH} ${DATE_WIDTH} ${DATE_WIDTH} ${TYPE_WIDTH} repeat(7, 25px) ${TIME_WIDTH} ${TIME_WIDTH} ${TITLE_WIDTH} ${LINK_WIDTH} ${PERSON_ICON_WIDTH} ${MEMBER_PARADE_WIDTH};
      gap: 8px;
      align-items: center;
    }
    .spot {
      display: grid;
      grid-template-columns: ${TRASH_WIDTH} ${INDEX_WIDTH} ${DATE_WIDTH} ${TYPE_WIDTH} ${TIME_WIDTH} ${TIME_WIDTH} ${TITLE_WIDTH} ${LINK_WIDTH} ${PERSON_ICON_WIDTH} ${MEMBER_PARADE_WIDTH};
      gap: 8px;
      align-items: center;
    }
    .header {
      font-weight: 600;
      padding: 6px 8px;
      background: #f2f4f7;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      text-align: center;
      white-space: nowrap;
    }
    .subheader {
      font-weight: 600;
      padding: 4px 6px;
      background: #fafafa;
      border: 1px solid #ececec;
      border-radius: 6px;
      text-align: center;
    }
    .cell.no {
      text-align: right;
      padding-right: 5px
    }
    .cell.clear,
    .cell.member,
    .cell input[type="date"],
    .cell input[type="checkbox"],
    .cell input[type="time"],
    .cell input[type="text"],
    .cell input[type="url"] {
      width: 100%;
      box-sizing: border-box;
      padding: 4px 10px;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      outline: none;
    }
    .cell.clear {
      padding: 4px 2px 2px 6px !important;
    }
    .cell input[type="button"] {
      cursor: pointer;
      padding: 6px 2px 0 2px;
      width: 100%;
      box-sizing: border-box;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      outline: none;
    }
    .cell input:focus {
      border-color: #2563eb;
      box-shadow: 0 0 0 3px rgba(37, 99, 235, .15);
    }
    .center { text-align: center; }
    .dowlabel { display: flex; justify-content: center; }
    .dow { width: 18px; height: 18px; }
    .alert { color: aquamarine;font-weight: 900; background-color: crimson; }`;
    const HEADER_ANNIVERSARY = `<div class="row anniversary" role="row">
      <div class="header" id="h-clear">&nbsp;</div>
      <div class="header" id="h-no">No</div>
      <div class="header" id="h-month-and-day">日付</div>
      <div class="header" id="h-type">種別</div>
      <div class="header" id="h-title">タイトル</div>
      <div class="header" id="h-link">リンク</div>
      <div class="header" id="h-button">&nbsp;</div>
      <div class="header" id="h-member">メンバー</div>
    </div>`;
    const HEADER_WEEKLY = `<!-- ヘッダー（1段目：大項目） -->
    <div class="row weekly" role="row">
      <div class="header" id="h-clear">&nbsp;</div>
      <div class="header" id="h-no">No</div>
      <div class="header" id="h-from-date">開始日</div>
      <div class="header" id="h-to-date">最終日</div>
      <div class="header" id="h-type">種別</div>
      <div class="header center" id="h-dayofweek" style="grid-column: 6 / span 7;">曜日</div>
      <div class="header" id="h-start-time">開始時間</div>
      <div class="header" id="h-end-time">終了時間</div>
      <div class="header" id="h-title">タイトル</div>
      <div class="header" id="h-link">リンク</div>
      <div class="header" id="h-button">&nbsp;</div>
      <div class="header" id="h-member">メンバー</div>
    </div>

    <!-- ヘッダー（2段目：曜日の内訳） -->
    <div class="row weekly" role="row">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div class="subheader" id="h-sun">日</div>
      <div class="subheader" id="h-mon">月</div>
      <div class="subheader" id="h-tue">火</div>
      <div class="subheader" id="h-wed">水</div>
      <div class="subheader" id="h-thu">木</div>
      <div class="subheader" id="h-fri">金</div>
      <div class="subheader" id="h-sat">土</div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>`;
    const HEADER_SPOT = `<div class="row spot" role="row">
      <div class="header" id="h-clear">&nbsp;</div>
      <div class="header" id="h-no">No</div>
      <div class="header" id="h-date">日付</div>
      <div class="header" id="h-type">種別</div>
      <div class="header" id="h-start-time">開始時間</div>
      <div class="header" id="h-end-time">終了時間</div>
      <div class="header" id="h-title">タイトル</div>
      <div class="header" id="h-link">リンク</div>
      <div class="header" id="h-button">&nbsp;</div>
      <div class="header" id="h-member">メンバー</div>
    </div>`;
    const createAnniversaryRow = (no, x) => `<div id="row[${no}]" class="row anniversary" role="row">
  <div class="cell">
    <input type="button" class="button" onclick="javscript:clearRow(${no})" value="🗑️" />
  </div>
  <div class="cell no">
    ${no + 1}
  </div>
  <div class="cell month-and-day">
  </div>
  <div class="cell">
    <select class="type" aria-labelledby="h-type">
      ${createScheduleTypeOptions(x?.type)}
    </select>
  </div>
  <div class="cell">
    <input type="text" class="title" placeholder="タイトル" aria-labelledby="h-title" value="${x?.title ?? ""}"/>
  </div>
  <div class="cell">
    <input type="url" class="link" placeholder="https://example.com" aria-labelledby="h-link" value="${x?.link ?? ""}"/>
  </div>
  <div class="cell">
    <input data-index="${no}" type="button" class="button" aria-labelledby="h-button" value="👤"/>
  </div>
  <div class="cell">
    <span class="members_icon" aria-labelledby="h-member">${x?.memberIcons ?? ""}</span>
  </div>
  <input type="hidden" class="members" value="${x?.members}">
</div>`;
    const createWeeklyRow = (no, x) => `<div id="row[${no}]" class="row weekly" role="row">
  <div class="cell clear">
    <input type="button" onclick="javscript:clearRow(${no});" value="🗑️"/>
  </div>
  <div class="cell no">
    ${no + 1}
  </div>
  <div class="cell">
    <input type="date" class="from" aria-labelledby="h-from-date" value="${x?.from ? x.from.toDateFormat() : ""}"/>
  </div>
  <div class="cell">
    <input type="date" class="to" aria-labelledby="h-to-date" value="${x?.to ? x.to.toDateFormat() : ""}"/>
  </div>
  <div class="cell">
    <select class="type" aria-labelledby="h-type">
      ${createScheduleTypeOptions(x?.type)}
    </select>
  </div>
  <label class="dowlabel" for="w${no}-sun" title="日"><input id="w${no}-sun" class="dow" type="checkbox" value="0" aria-labelledby="h-dayofweek h-sun" ${x?.dow?.getChecked("0")}/></label>
  <label class="dowlabel" for="w${no}-mon" title="月"><input id="w${no}-mon" class="dow" type="checkbox" value="1" aria-labelledby="h-dayofweek h-mon" ${x?.dow?.getChecked("1")}/></label>
  <label class="dowlabel" for="w${no}-tue" title="火"><input id="w${no}-tue" class="dow" type="checkbox" value="2" aria-labelledby="h-dayofweek h-tue" ${x?.dow?.getChecked("2")}/></label>
  <label class="dowlabel" for="w${no}-wed" title="水"><input id="w${no}-wed" class="dow" type="checkbox" value="3" aria-labelledby="h-dayofweek h-wed" ${x?.dow?.getChecked("3")}/></label>
  <label class="dowlabel" for="w${no}-thu" title="木"><input id="w${no}-thu" class="dow" type="checkbox" value="4" aria-labelledby="h-dayofweek h-thu" ${x?.dow?.getChecked("4")}/></label>
  <label class="dowlabel" for="w${no}-fri" title="金"><input id="w${no}-fri" class="dow" type="checkbox" value="5" aria-labelledby="h-dayofweek h-fri" ${x?.dow?.getChecked("5")}/></label>
  <label class="dowlabel" for="w${no}-sat" title="土"><input id="w${no}-sat" class="dow" type="checkbox" value="6" aria-labelledby="h-dayofweek h-sat" ${x?.dow?.getChecked("6")}/></label>

  <div class="cell">
    <!--input type="time" class="start" aria-labelledby="h-start-time" value="${x?.start ? x.start.toTimeFormat() : ""}"/-->
    ${createInputTime("start", x?.start ? x.start.substring(0, 2) : "", x?.start ? x.start.substring(2, 4) : "")}
  </div>
  <div class="cell">
    <!--input type="time" class="end" aria-labelledby="h-end-time" value="${x?.end ? x.end.toTimeFormat() : ""}"/-->
    ${createInputTime("end", x?.end ? x.end.substring(0, 2) : "", x?.end ? x.end.substring(2, 4) : "")}
  </div>
  <div class="cell">
    <input type="text" class="title" placeholder="イベント名" aria-labelledby="h-title" value="${x?.title ?? ""}"/>
  </div>
  <div class="cell">
    <input type="url" class="link" placeholder="https://example.com" aria-labelledby="h-link" value="${x?.link ?? ""}"/>
  </div>
  <div class="cell">
    <input data-index="${no}" type="button" class="button" aria-labelledby="h-button" value="👤"/>
  </div>
  <div class="cell">
    <span class="members_icon" aria-labelledby="h-member">${x?.memberIcons ?? ""}</span>
  </div>
  <input type="hidden" class="members" value="${x?.members}">
</div>`;
    const createSpotRow = (no, x) => `<div id="row[${no}]" class="row spot" role="row">
  <div class="cell clear">
    <div onclick="javscript:clearRow(${no});">🗑️</div>
  </div>
  <div class="cell no">
    ${no + 1}
  </div>
  <div class="cell">
    <input type="date" class="date" aria-labelledby="h-date" value="${x?.date?.toDateFormat()}"/>
  </div>
  <div class="cell">
    <select class="type" aria-labelledby="h-type">
      ${createScheduleTypeOptions(x?.type)}
    </select>
  </div>
  <div class="cell">
    <!--input type="time" class="start" aria-labelledby="h-start-time" value="${x?.start?.toTimeFormat()}"/-->
    ${createInputTime("start", x?.start ? x.start.substring(0, 2) : "", x?.start ? x.start.substring(2, 4) : "")}
  </div>
  <div class="cell">
    <!--input type="time" class="end" aria-labelledby="h-end-time" value="${x?.end?.toTimeFormat}"/-->
    ${createInputTime("end", x?.end ? x.end.substring(0, 2) : "", x?.end ? x.end.substring(2, 4) : "")}
  </div>
  <div class="cell">
    <input type="text" class="title" placeholder="イベント名" aria-labelledby="h-title" value="${x?.title ?? ""}"/>
  </div>
  <div class="cell">
    <input type="url" class="link" placeholder="https://example.com" aria-labelledby="h-link" value="${x?.link ?? ""}"/>
  </div>
  <div class="cell">
    <input data-index="${no}" type="button" class="button" aria-labelledby="h-button" value="👤"/>
  </div>
  <div class="cell">
    <span class="members_icon" aria-labelledby="h-member">${x?.memberIcons ?? ""}</span>
  </div>
  <input type="hidden" class="members" value="${x?.members}">
</div>`;
    const bitPositions = (n) => {
      const positions = [];
      let index = 0;
      while (n > 0) {
        if (n & 1n) {
          positions.push(index);
        }
        n = n >> 1n;
        index++;
      }
      return positions;
    };
    const save = (key, records) => {
      localStorage.setItem(key, JSON.stringify(records));
      const msg = records.length + "件 保存しました。";
      scrLog(msg);
      const isSaved = document.getElementById("is_saved");
      isSaved.value = "true";
    };
    const zeroPad = (x, pad = "00") => (pad + x).slice(-1 * pad.length);
    const createDatetime = (date) => date.getFullYear() + "-" + zeroPad(date.getMonth() + 1) + "-" + zeroPad(date.getDate()) + " " + zeroPad(date.getHours()) + ":" + +zeroPad(date.getMinutes()) + ":" + zeroPad(date.getSeconds()) + "." + zeroPad(date.getMilliseconds(), "000");
    const MSG_LOG = "log";
    const MSG_WARN = "warn";
    const scrWarnlog = (msg) => scrLog(msg, MSG_WARN);
    const scrLog = (msg, mode = MSG_LOG) => {
      const updLog = document.querySelector(".update_log");
      updLog.insertAdjacentHTML("beforeend", `<p class="${mode}">[${createDatetime( new Date())}] ${msg}</p>`);
      var bottom = updLog.scrollHeight - updLog.clientHeight;
      updLog.scroll(0, bottom);
    };
    const EXTENTION_DAYS = 7;
    const fetchSchedule = (targetMonth) => {
      const month = parseInt(targetMonth.substring(4, 6));
      return new Promise((resolve, reject) => {
        _GM_xmlhttpRequest({
          method: "GET",
          url: `https://www.hinatazaka46.com/s/official/media/list?ima=0000&dy=${targetMonth}`,
          onload: function(response) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, "text/html");
            const lMainContentsUl = doc.querySelector(".l-maincontents--schedule ul");
            fillEmptyMonthly(lMainContentsUl, targetMonth, EXTENTION_DAYS);
            const firstWeekSchedule = Array.prototype.filter.call(lMainContentsUl.querySelectorAll(".p-schedule__list-group"), (d) => {
              const dayElem = d.querySelector(".c-schedule__date--list span");
              const day = parseInt(dayElem.innerText);
              if (day <= EXTENTION_DAYS) {
                d.classList.remove(CSS_CLASS_SCHEDULE_PAST);
                dayElem.parentElement.parentElement.classList.add("nextmonth");
                dayElem.innerHTML = `<font size="-1">${month}/</font>${day}`;
                return true;
              } else {
                return false;
              }
            });
            resolve(firstWeekSchedule);
          },
          onerror: function(error) {
            reject(error);
          }
        });
      });
    };
    const extendSchedule = async (currentMonth) => {
      if (!currentMonth || currentMonth.length !== 6) {
        console.log("dyパラメータが見つかりません");
        return;
      }
      const mainSchedule = document.querySelector(".l-maincontents--schedule > ul");
      if (!mainSchedule) {
        console.log("スケジュール要素が見つかりません");
        return;
      }
      const nextMonth = getNextMonth(currentMonth);
      console.log("現在月:", currentMonth, "翌月:", nextMonth);
      try {
        const firstWeek = await fetchSchedule(nextMonth);
        firstWeek.forEach((d) => {
          mainSchedule.insertAdjacentElement("beforeend", d);
        });
        console.log("スケジュール拡張完了");
      } catch (error) {
        console.error("スケジュール取得エラー:", error);
      }
    };
    const DELTA = 2;
    const doProcessList = () => {
      const isDetail = location.href.match(new RegExp("/detail/")) != null;
      if (isDetail) {
        return;
      }
      const pageType = location.href.match(new RegExp("/(media|news)/"))[1];
      const selectorsDic = getSelectorsDic(pageType);
      const pageYearMonth = document.getElementsByName("dy")[0];
      const isSetYearMonth = pageYearMonth != null;
      const yearMonth = isSetYearMonth ? pageYearMonth.value.match(/(20[1-9][0-9])([0-1][0-9])/) : null;
      const year = yearMonth ? parseInt(yearMonth[1]) : -1;
      const month = yearMonth ? parseInt(yearMonth[2]) : -1;
      if (isSetYearMonth) {
        document.appendStyle("calendar", `td[class^="cale_day"] a {
      font-family: "Libre Caslon Text", serif;
      font-optical-sizing: auto;
      font-size: 15px;
      font-weight: 600;
      font-style: normal;
      position: relative;
      bottom: 2px;
    }`);
        setCalendar(year, month, selectorsDic);
      }
      const category = getCorrectedCategory();
      strengthCategoryDisp(category);
      if (isDetail) {
        return;
      }
      const PAGER_MARGIN_TOP = 20;
      setCSS4NewsAndSchedule();
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;
      const pDate = document.querySelector(selectorsDic.pDate);
      const pPager = document.querySelector(".p-pager");
      if (isSetYearMonth) {
        pPager.style.marginTop = `${PAGER_MARGIN_TOP}px`;
      } else {
        const cPageYear = document.querySelector(selectorsDic.cPageYear);
        cPageYear.innerText = String(currentYear) + "年";
        const cPageMonth = document.querySelector(selectorsDic.cPageMonth);
        cPageMonth.innerText = String(currentMonth) + "月";
        document.querySelector(selectorsDic.pArrow).remove();
        pPager.innerText = "";
        pPager.style.marginTop = "0px";
      }
      pDate.style.marginBottom = "5px";
      const lMainContentsUl = document.querySelector(selectorsDic.lMainContentsUl);
      const lMainContentsUlTop = lMainContentsUl.getBoundingClientRect().top;
      const pDateHeight = pDate.offsetHeight;
      const pPagerHeight = PAGER_MARGIN_TOP + pPager.offsetHeight;
      const lMainContentsUlHeight = document.documentElement.clientHeight - pDateHeight - pPagerHeight;
      lMainContentsUl.setAttribute("style", `height:${lMainContentsUlHeight}px; overflow-y: scroll; overflow-x: hidden; border: solid 1px #32a1ce;`);
      const scrollTop = lMainContentsUlTop - pDateHeight;
      scrollTo(0, 0);
      scrollTo({
        top: scrollTop,
        behavior: "smooth"
      });
      const nowYearMonth = String(currentYear) + String(currentMonth).padStart(2, "0");
      const dispYear = document.querySelector(selectorsDic.cPageYear);
      const dispMonth = document.querySelector(selectorsDic.cPageMonth);
      const dispYearMonth = ((y, m) => {
        return y == null || y.innerText == null || m == null || m.innerText == null ? nowYearMonth : y.innerText.replace("年", "") + m.innerText.replace("月", "");
      })(dispYear, dispMonth);
      if (lMainContentsUl && dispYearMonth < nowYearMonth) {
        lMainContentsUl.classList.add("schedule__list-pastday");
      }
      const createDateAnchor = createAnchor(selectorsDic.lMainContentsUl);
      if (pageType === "news") {
        doProcessNews(lMainContentsUlTop, createDateAnchor);
      } else {
        doProcessMedia(category, lMainContentsUl, lMainContentsUlTop, dispYearMonth, now, nowYearMonth, createDateAnchor);
      }
    };
    const doProcessNews = (lMainContentsUlTop, createAnchor2) => {
      const newsList = Array.prototype.map.call(
        document.getElementsByClassName("c-news__date"),
        (x) => [parseInt(x.innerText.match(new RegExp(/\d{4}\.\d{2}\.(\d{2})/))[1]), x.getBoundingClientRect().top]
      );
      const dayMap = new Map();
      newsList.forEach((x) => {
        if (!dayMap.has(x[0]) || x[1] < dayMap.get(x[0])) {
          dayMap.set(x[0], x[1]);
        }
      });
      dayMap.forEach((top, day) => {
        Array.prototype.some.call(document.querySelectorAll("table.cale_table tbody tr td"), (td) => {
          if (!td.classList.contains("is-disabled") && day === parseInt(td.innerText)) {
            td.innerHTML = createAnchor2(top - lMainContentsUlTop - DELTA, day);
            return true;
          }
          return false;
        });
      });
    };
    const doProcessMedia = async (category, lMainContentsUl, lMainContentsUlTop, dispYearMonth, now, nowYearMonth, createAnchor2) => {
      document.appendStyle("media", `.p-schedule__list-group { padding-top: 10px; }`);
      const dy = document.querySelector('input[name="dy"]');
      if (dy) fillEmpty(lMainContentsUl, dispYearMonth);
      lMainContentsUl.scroll(0, 0);
      const today = now.getDate();
      Array.prototype.forEach.call(document.getElementsByClassName("p-schedule__list-group"), (dayElem) => {
        const dateElem = dayElem.querySelector(".c-schedule__date--list span");
        const day = ((x) => {
          return parseInt(x.replace(/[0-9]{1,2}\//, ""));
        })(dateElem.innerText);
        insertCustomSchedule(category, dispYearMonth, lMainContentsUl, day, dayElem);
        Array.prototype.some.call(document.querySelectorAll("table.cale_table tbody tr td"), (td) => {
          if (!td.classList.contains("is-disabled") && day === parseInt(td.innerText)) {
            td.innerHTML = createAnchor2(dayElem.getBoundingClientRect().top - lMainContentsUlTop - DELTA, day);
            return true;
          }
          return false;
        });
        if (dispYearMonth === nowYearMonth) {
          if (day < today) {
            dayElem.classList.add("schedule__list-pastday");
          } else if (day === today) {
            dateElem.classList.add("schedule__date-today");
            dayElem.classList.add("schedule__list-today");
            lMainContentsUl.scroll({
              top: lMainContentsUl.querySelector(".schedule__list-today").getBoundingClientRect().top - lMainContentsUlTop - DELTA,
              behavior: "smooth"
            });
          } else if (day > today) {
            dayElem.classList.add("schedule__list-future");
          }
        }
        if (category != "all") {
          Array.prototype.forEach.call(document.querySelectorAll(".p-schedule__list-group > .p-schedule__list"), (x) => {
            if (x.childElementCount == 0) {
              x.parentElement.remove();
            }
          });
          if (document.querySelector(".p-schedule__list-group > .p-schedule__list")) {
            const p = document.querySelector("div.l-maincontents--schedule > ul > li > a > p");
            if (p && p.innerText == "この月の予定はありません。") {
              p.parentElement?.parentElement?.remove();
            }
          }
        }
      });
      if (dy) await appendNextMonthScehdule(dispYearMonth, category, lMainContentsUl);
    };
    const getSelectorsDic = (pageType) => {
      switch (pageType) {
        case "news":
          return {
            "pArrow": ".p-news__pager-arrow",
            "cArrowLeft": ".c-news_pager-arrow--left",
            "cArrowRight": ".c-news_pager-arrow--right",
            "cPageMonth": ".c-news__page_month",
            "cPageYear": ".c-news__page_year",
            "lMainContentsUl": ".l-maincontents--news ul",
            "pDate": ".p-news__page_date",
            "lSubContents": ".l-sub-contents--news"
          };
        case "media":
          return {
            "pArrow": ".p-schedule__pager-arrow",
            "cArrowLeft": ".c-schedule_pager-arrow--left",
            "cArrowRight": ".c-schedule_pager-arrow--right",
            "cPageMonth": ".c-schedule__page_month",
            "cPageYear": ".c-schedule__page_year",
            "lMainContentsUl": ".l-maincontents--schedule ul",
            "pDate": ".p-schedule__page_date",
            "lSubContents": ".l-sub-contents--schedule"
          };
        default:
          throw new Error(PAGE_TYPE_ERROR_MSG);
      }
    };
    const getCorrectedCategory = () => {
      const c = document.getElementsByName("cd");
      let value = "";
      if (c == null || c.length == 0) {
        value = "all";
      } else if (c[0] instanceof HTMLInputElement) {
        const tempValue = c[0].value;
        switch (tempValue) {
          case "birthday":
            value = "birth";
            break;
          case "fanclub":
            value = "fanclubonly";
            break;
          default:
            value = tempValue;
        }
      }
      return value;
    };
    const setCSS4NewsAndSchedule = () => {
      const PASTDAY_BG_CL = "#ededf0";
      const TODAY_DATE_CL = "orange";
      const TODAY_BG_CL = "#fafeff";
      const TODAY_BORDER_CL_UPPER = "#d7eeff";
      const TODAY_BORDER_CL_LOWER = "#5bbee4";
      document.appendStyle("news-schedule", `
    .linkless { cursor: default; }
    .l-contents { margin-top: -20px; }
    .c-button-filter { cursor: pointer; }
    .is-disabled { color: silver; }
    .p-page-head { padding-top: 20px; }
    .c-pager__item a svg { fill: #7ab6db; }
    .schedule__list-pastday { background-color: ${PASTDAY_BG_CL}; }
    .schedule__list-today {
      background-color: ${TODAY_BG_CL};
      border: 2px solid;
      border-image: linear-gradient(to right bottom, ${TODAY_BORDER_CL_UPPER}, ${TODAY_BORDER_CL_LOWER}) 1;
    }
    .schedule__date-today { color: ${TODAY_DATE_CL}; }
    .p-news__item, .p-schedule__item { outline-offset: 1px; }
    .p-news__item { padding-left: 4px; }
    .module-modal.js-member-filter .mordal-box .member-box ul li p.check input[type=checkbox]:checked+label:before {
      background-color:#6bcaea;
      border:1px solid #6bcaea;
    }
    .check-box { padding: 0 220px !important;}
    .check-box > div { width: 240px; padding: 0 4px 0 4px !important; }
    .check-box p { font-size: 1.3rem !important;}
    .btn-decision > a { color: #0a2040 !important;}`);
    };
    const setCalendar = (year, month, selectorsDic) => {
      const daysOfWeek = ["日", "月", "火", "水", "木", "金", "土"];
      const first = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0);
      const endDate = end.getDate();
      const endPrevMonth = new Date(year, month - 1, 0);
      const endDatePrevMonth = endPrevMonth.getDate();
      const firstDayOfWeek = first.getDay();
      let numOfDay = 1;
      const leftArrowHref = document.querySelector(selectorsDic.cArrowLeft).children[0].href;
      const rightArrowHref = document.querySelector(selectorsDic.cArrowRight).children[0].href;
      let calendarHtml = `
      <table class="cale_table" style="width: 220px; margin: -130px 0 20px -50px; position: relative; right: 24px;">
        <tr><td></td><td class="cale_prev"><a id="cale_prev" href="${leftArrowHref}">＜</a></td>
          <td class="cale_month" colspan="3">${year}年&#160;${month}月</td><td class="cale_next"><a href="${rightArrowHref}">＞</a></td><td></td></tr>
        <tr>`;
      for (let i = 0; i < daysOfWeek.length; i++) {
        calendarHtml += `<td class="cale_wek${i}">${daysOfWeek[i]}</td>`;
      }
      calendarHtml += "</tr>";
      for (let w = 0; w < 6; w++) {
        calendarHtml += "<tr>";
        for (let d = 0; d < 7; d++) {
          if (w == 0 && d < firstDayOfWeek) {
            let num = endDatePrevMonth - firstDayOfWeek + d + 1;
            calendarHtml += `<td class="cale_day${d} is-disabled">${num}</td>`;
          } else if (numOfDay > endDate) {
            let num = numOfDay - endDate;
            calendarHtml += `<td class="cale_day${d} is-disabled">${num}</td>`;
            numOfDay++;
            w = 99;
          } else {
            calendarHtml += `<td class="cale_day${d}">${numOfDay}</td>`;
            numOfDay++;
          }
        }
        calendarHtml += "</tr>";
      }
      calendarHtml += "</table>";
      document.querySelector(selectorsDic.lSubContents).insertAdjacentHTML("afterbegin", calendarHtml);
    };
    const createAnchor = (selector) => (top, day) => `<a href="javascript:document.querySelector('${selector}').scroll({top:${top}, behavior: 'smooth'});">${day}</a>`;
    const strengthCategoryDisp = (category) => {
      const categoryElem = document.querySelector(".c-button-category.category_" + category);
      const categoryStyles = window.getComputedStyle(categoryElem);
      const categoryParent = categoryElem.parentElement;
      categoryParent.style.marginLeft = "-5px";
      categoryParent.style.paddingLeft = "4.5px";
      categoryParent.style.marginRight = "40px";
      categoryElem.style.color = `rgb(from ${categoryStyles.color} calc(r - 64) calc(g - 64) calc(b - 64))`;
      categoryParent.style.backgroundColor = `rgb(from ${categoryStyles.color} calc(r + 64) calc(g + 64) calc(b + 64))`;
      categoryParent.style.border = `solid 0.5px ${categoryElem.style.color}`;
    };
    async function appendNextMonthScehdule(dispYearMonth, category, lMainContentsUl) {
      await extendSchedule(dispYearMonth);
      const nextMonth = getNextMonth(dispYearMonth);
      Array.prototype.forEach.call(document.getElementsByClassName("nextmonth"), (dayElem) => {
        const dateElem = dayElem.querySelector(".c-schedule__date--list span");
        const day = ((x) => {
          return parseInt(x.replace(/[0-9]{1,2}\//, ""));
        })(dateElem.innerText);
        insertCustomSchedule(category, nextMonth, lMainContentsUl, day, dayElem);
      });
      setHoveredFontAndBgColor(".p-schedule__list-group.nextmonth .p-schedule__item", "time");
      setScheduler();
    }
    const doProcessDiscography = () => {
      document.appendStyle("disco", CSS_DISCO);
      const releaseYearSelector = ".c-disco__year";
      const yearListHTML = createYearJumpListHTML$1(releaseYearSelector);
      const main = document.querySelector(".l-main");
      main.setAttribute("style", "padding-top:0; margin: 20px 0 0 40px; font-size: larger;");
      main.insertAdjacentHTML("afterbegin", yearListHTML);
      setTimeout(() => {
        const header = document.querySelector("header");
        const nav = document.querySelector(".nav");
        const navHeight = nav.clientHeight;
        window.onscroll = () => {
          if (window.pageYOffset >= header.clientHeight) {
            nav.classList.add("fixed");
            main.setAttribute("style", `padding-top: ${navHeight}px`);
          } else {
            nav.classList.remove("fixed");
            main.setAttribute("style", "padding-top:0; margin: 20px 0 0 40px; font-size: larger;");
          }
        };
        const latestYear = document.querySelector(releaseYearSelector);
        const scrollTop = latestYear.parentNode.getBoundingClientRect().top;
        scrollTo(0, 0);
        scrollTo({
          top: scrollTop,
          behavior: "smooth"
        });
        Array.prototype.forEach.call(document.getElementsByClassName("rel_year"), (x) => {
          const year = x.innerText;
          const yearElement = document.getElementById("y_" + year);
          const top = yearElement.getBoundingClientRect().top;
          x.setAttribute("href", `javascript:scrollTo({top:${top}, behavior:'smooth'});`);
        });
      }, 100);
    };
    const createYearJumpListHTML$1 = (_yearSelector) => {
      let html = `<header class="header" role="banner" style="z-index: 1000;">
                   <nav class="nav">
                     <div class="release">RELEASE<br/>YEAR</div>
                     <ul class="nav-list">`;
      Array.prototype.forEach.call(document.querySelectorAll(_yearSelector), (x) => {
        const year = x.innerText;
        const id_year = "y_" + year;
        x.parentNode.setAttribute("id", id_year);
        html += `<li><a class="rel_year">${year}</a></li>`;
      });
      html += `</ul>
      </nav>
    </header>`;
      return html;
    };
    const CSS_DISCO = `
      .fixed {
        width: 12rem;
        position: fixed;
        top: 60px;
        left: 40px;
        z-index: 1;
        font-size:larger;
      }
      .header { width: 100px; }
      .release { line-height: 20px; }
      .l-container { margin-top: -280px; }
      .c-disco__year { padding-top: 20px; font-size: 4rem; width: 12rem;}
      .c-disco__category {font-size: 14px;}
      .p-page-head-sub--first {padding-top: 10px;}
      `;
    const doProcessFormation = () => {
      document.appendStyle("formation", CSS_FORMATION);
      const releaseYearSelector = ".c-page-subtitle";
      let navText = `
  <header class="header" role="banner" style="z-index: 1000;">
    <nav class="nav">
      <div class="release">RELEASE<br/>YEAR</div>
        <ul class="nav-list">`;
      Array.prototype.forEach.call(document.querySelectorAll(releaseYearSelector), (x) => {
        const year = x.innerText;
        const id_year = "y_" + year;
        x.parentNode.setAttribute("id", id_year);
        navText += `<li><a href="#${id_year}">${year}</a></li>`;
      });
      navText += `
      </ul>
    </nav>
  </header>`;
      const main = document.querySelector(".l-main");
      main.setAttribute("style", "padding-top:0; margin: 20px 0 0 40px; font-size: larger;");
      main.insertAdjacentHTML("afterbegin", navText);
      const header = document.querySelector("header");
      const nav = document.querySelector(".nav");
      const navHeight = nav.clientHeight;
      window.onscroll = () => {
        if (window.pageYOffset >= header.clientHeight) {
          nav.classList.add("fixed");
          main.setAttribute("style", `padding-top: ${navHeight}px`);
        } else {
          nav.classList.remove("fixed");
          main.setAttribute("style", "padding-top:0; margin: 20px 0 0 40px; font-size: larger;");
        }
      };
      const latestYear = document.querySelector(releaseYearSelector);
      const scrollTop = latestYear.parentNode.getBoundingClientRect().top;
      scrollTo(0, 0);
      scrollTo({
        top: scrollTop,
        behavior: "smooth"
      });
    };
    const CSS_FORMATION = `
  .l-container { margin-top: -280px; }
  .formation_image ul li {
      transition: transform 0.3s ease, z-index 0.3s ease;
      transform-origin: center center;
      &:hover {
        transform: scale(1.4, 1.4) translateZ(10px);
        z-index: 10;
      }
  }
  .formation_image li {
    &:hover i { font-size: 16px; }
    i { font-size: 14px; }
  }
  .fixed {
    width: 12rem;
    position: fixed;
    top: 60px;
    left: 40px;
    z-index: 1;
    font-size:larger;
  }
  .header { width: 100px; }
  .release { line-height: 20px; }
  .p-page-head-sub, .l-contents { width: 1300px; }
  .p-page-head-sub { margin: 0px auto 0px auto; }
  .p-page-head-sub--first { padding-top: 20px; }
  .formation_list {
    .block_head { width:23% !important; }
    .block_head+ { width:77% !important; }
    h4 {
      color: ${HINATA_BLUE};
      background-color: #0c1860;
      outline: 2px solid darkslateblue;
      font-size: 1.4em;
      font-weight: bold;
      padding: 0.3em 0.1em;
    }
  }
  @media screen and (min-width: 1024px) {
    .formation_image li {
      span {
        width: 80px;
        height: 80px;
      }
      &:hover span { box-shadow: 0px 0px 0px 3px ${HINATA_BLUE}; }
      i {
        font-size: 1.12em;
        width: 130px;
        padding-left: 20px;
        shite-space: pre-line;
      }
    }
  }`;
    const doProcessEvent = () => {
      setHoveredFontAndBgColor(".p-section--shakehands", ".c-shakehands-calender.pc, .c-shakehands-calender.pc a");
    };
    const doProcessFc = () => {
      document.appendStyle("fc", ".fc-logo { padding: 15px; }");
    };
    const memberSelectShim = () => {
      document.querySelector(".c-button-filter").style.cursor = "pointer";
      const decAnchor = document.querySelector(".btn-decision a");
      const createNowYearMonth = () => {
        const now = new Date();
        return String(now.getFullYear()) + String(now.getMonth() + 1).padStart(2, "0");
      };
      const dispYearMonth = ((x) => {
        return x === null ? createNowYearMonth() : x[0];
      })(decAnchor.href.match(new RegExp("[0-9]{6}")));
      const newDecAnchor = document.createElement("a");
      newDecAnchor.text = "決定する";
      newDecAnchor.style.cursor = "pointer";
      newDecAnchor.addEventListener(
        "click",
        () => {
          const PARAM_NM_DY = "dy";
          const pageForm = document.getElementById("pageForm");
          const item = pageForm.elements.namedItem(PARAM_NM_DY);
          if (item) {
            item.value = dispYearMonth;
          } else {
            pageForm.elements[0].setAttribute("name", PARAM_NM_DY);
            pageForm.elements[0].setAttribute("value", dispYearMonth);
          }
          const list = document.querySelectorAll('#pageForm > [name="list[]"]');
          const sendCheckedIdList = Array.prototype.filter.call(list, (x) => {
            return x.type === "checkbox" && x.checked;
          }).map((x) => {
            return x.value;
          });
          Array.prototype.forEach.call(list, (x) => {
            if (x.type === "hidden" && sendCheckedIdList.indexOf(x.value) < 0) {
              x.remove();
            }
          });
          pageForm.submit();
        }
      );
      const decBtn = document.querySelector(".btn-decision");
      decBtn.replaceChildren(newDecAnchor);
      const checkedIdList = [];
      Array.prototype.forEach.call(document.querySelectorAll('#pageForm > [name="list[]"]'), (x) => {
        const memberId = x.value;
        if (checkedIdList.indexOf(memberId) < 0) {
          checkedIdList.push(memberId);
        } else {
          x.remove();
        }
      });
      Array.prototype.forEach.call(checkedIdList, (x) => {
        document.getElementById(x)?.dispatchEvent(new MouseEvent("click"));
      });
    };
    const HINATA_BIRRTH = "2019-02-11";
    const EVENT_HIGHT = 20;
    const EVENT_WIDTH = 460;
    const EVENT_WIDTH_SHORT = EVENT_WIDTH - 170;
    const MARGIN_X = 20;
    const NEARLY_DAY_OFFSET_X = 180;
    const SAME_DAY_OFFSET_X = 10;
    const INDENT_X = 55;
    const LIMIT_COUNT = 35;
    const START_DATE = new Date("2015-01-01");
    const END_DATE = new Date();
    END_DATE.setFullYear(END_DATE.getFullYear() + 1);
    const SVG_HEIGHT = (END_DATE.getFullYear() - START_DATE.getFullYear()) * 1800;
    const SVG_WIDTH = 1e3;
    const doProcessBiography = () => {
      document.appendStyle("biography", CSS_BIOGRAPHY);
      const timelineX = 200;
      const topMargin = 50;
      const bottomMargin = 50;
      const lineColor = HINATA_BLUE;
      const circleRadius = 6;
      const svgTimeline = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svgTimeline.setAttribute("id", "timeline");
      svgTimeline.setAttribute("width", SVG_WIDTH.toString());
      svgTimeline.setAttribute("height", SVG_HEIGHT.toString());
      const timeLineContainer = document.createElement("div");
      timeLineContainer.setAttribute("id", "tl_container");
      timeLineContainer.appendChild(svgTimeline);
      const lContents = document.querySelector(".l-contents");
      lContents?.insertAdjacentElement("afterbegin", timeLineContainer);
      const dateToY = (date) => {
        const totalDays = (END_DATE.getTime() - START_DATE.getTime()) / (1e3 * 60 * 60 * 24);
        const targetDays = (new Date(date).getTime() - START_DATE.getTime()) / (1e3 * 60 * 60 * 24);
        const availableHeight = SVG_HEIGHT - topMargin - bottomMargin;
        return topMargin + targetDays / totalDays * availableHeight;
      };
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", timelineX.toString());
      line.setAttribute("y1", topMargin.toString());
      line.setAttribute("x2", timelineX.toString());
      line.setAttribute("y2", (SVG_HEIGHT - bottomMargin).toString());
      line.setAttribute("stroke", lineColor);
      line.setAttribute("stroke-width", "3");
      svgTimeline.appendChild(line);
      const startYear = START_DATE.getFullYear();
      const endYear = END_DATE.getFullYear();
      for (let year = startYear; year <= endYear; year++) {
        const yearDate = new Date(`${year}-01-01`);
        const y = dateToY(yearDate.toString());
        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttribute("cx", timelineX.toString());
        circle.setAttribute("cy", y.toString());
        circle.setAttribute("r", circleRadius.toString());
        circle.setAttribute("fill", lineColor);
        svgTimeline.appendChild(circle);
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("id", "y_" + year.toString());
        text.setAttribute("x", (timelineX - 15).toString());
        text.setAttribute("y", (y + 5).toString());
        text.setAttribute("text-anchor", "end");
        text.setAttribute("class", "year-label");
        text.textContent = year.toString();
        svgTimeline.appendChild(text);
      }
      const nameDictionary = {};
      Hinatazaka46.MEMBER_PROPERTIES.forEach((x, i) => {
        nameDictionary["\\" + i.toString() + ";"] = x.nm.replace(" ", "");
      });
      nameDictionary["\\0;"] = "長濱ねる";
      const convert2MemberName = (str) => ((m) => m != null ? convert2MemberName(str.replace(m[0], nameDictionary[m[0]])) : str)(str.match(/\\\d+;/));
      const converted = [...hinataEvents].map((x) => {
        return { date: convert2Date(x.d), name: convert2MemberName(x.n) };
      });
      const sortedEvents = converted.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      const eventsByDate = {};
      sortedEvents.forEach((_event) => {
        if (!eventsByDate[_event.date]) {
          eventsByDate[_event.date] = [];
        }
        eventsByDate[_event.date].push(_event);
      });
      let prevX = 0;
      let prevY = 0;
      let prevEventName = "";
      let isPreEventSlided = false;
      Object.entries(eventsByDate).forEach(([date, events], _i) => {
        const baseY = dateToY(date);
        events.forEach((event, index) => {
          let offsetY = 0;
          let offsetX = 0;
          const distanceToPrev = Math.round(baseY - prevY);
          offsetY = distanceToPrev < 0 ? Math.abs(distanceToPrev) + EVENT_HIGHT : distanceToPrev < EVENT_HIGHT ? EVENT_HIGHT - distanceToPrev : Math.max(EVENT_HIGHT - distanceToPrev, EVENT_HIGHT * -1);
          if (index > 0) {
            offsetX = index * SAME_DAY_OFFSET_X + (isPreEventSlided ? 0 : NEARLY_DAY_OFFSET_X);
            offsetY = EVENT_HIGHT - distanceToPrev;
            isPreEventSlided = true;
          } else if (offsetY > 0 && prevEventName.getByteLength() < LIMIT_COUNT) {
            offsetX = isPreEventSlided ? 0 : NEARLY_DAY_OFFSET_X;
            offsetY = (isPreEventSlided ? 1 : 0.8) * EVENT_HIGHT - distanceToPrev;
            isPreEventSlided = true;
          } else {
            if (index > 0) {
              offsetY = index * 0.5 * EVENT_HIGHT;
              offsetX = index * SAME_DAY_OFFSET_X;
              isPreEventSlided = true;
            }
            isPreEventSlided = false;
          }
          const y = baseY + offsetY;
          prevY = y;
          const x = index > 0 ? prevX + SAME_DAY_OFFSET_X : timelineX + MARGIN_X + offsetX;
          prevX = x;
          const height = EVENT_HIGHT;
          const textByteLength = event.name.getByteLength();
          const width = computeEventWidth(textByteLength);
          const color = date < HINATA_BIRRTH || date === HINATA_BIRRTH && index === 0 ? "#58e954" : HINATA_BLUE;
          const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
          group.setAttribute("class", "event-pentagon");
          const pentagon = document.createElementNS("http://www.w3.org/2000/svg", "path");
          pentagon.setAttribute("d", createPentagonPath(x, y, width, height));
          pentagon.setAttribute("fill", color);
          pentagon.setAttribute("stroke", "white");
          pentagon.setAttribute("stroke-width", "1");
          group.appendChild(pentagon);
          const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
          text.setAttribute("x", (x + INDENT_X).toString());
          text.setAttribute("y", (y + 5).toString());
          text.setAttribute("class", "event-text");
          text.style.fontSize = (13 - Math.round(textByteLength / 10) / 2).toString() + "px";
          text.textContent = event.name;
          group.appendChild(text);
          const dateText = document.createElementNS("http://www.w3.org/2000/svg", "text");
          dateText.setAttribute("x", (x + 10).toString());
          dateText.setAttribute("y", (y + 5).toString());
          dateText.setAttribute("class", "event-date");
          dateText.setAttribute("font-size", "10");
          dateText.setAttribute("opacity", "0.8");
          dateText.textContent = date.replace(/\d{4}\-(\d{2})\-(\d{2})/, "$1/$2");
          group.appendChild(dateText);
          const bendPoint1X = timelineX + (x - timelineX) * 0.3;
          const bendPoint1Y = baseY;
          const bendPoint2X = timelineX + (x - timelineX) * 0.7;
          const bendPoint2Y = y;
          const connector = document.createElementNS("http://www.w3.org/2000/svg", "path");
          const connectorPath = `
          M ${timelineX} ${baseY}
          L ${bendPoint1X} ${bendPoint1Y}
          L ${bendPoint2X} ${bendPoint2Y}
          L ${x} ${y}
      `;
          connector.setAttribute("d", connectorPath.trim());
          connector.setAttribute("stroke", color);
          connector.setAttribute("stroke-width", "2");
          connector.setAttribute("opacity", "0.5");
          connector.setAttribute("fill", "none");
          svgTimeline.appendChild(group);
          svgTimeline.insertBefore(connector, group);
          prevEventName = event.name;
        });
      });
      setYearJump();
    };
    const convert2Date = (str) => {
      const month = str.substring(2, 4);
      const day = str.substring(4, 6);
      if (!str.match(/\d{6}/) || parseInt(month) + 1 > 13 || parseInt(day) + 1 > 32) throw new Error("引数はyyMMdd形式を設定してください");
      const date = "20" + str.substring(0, 2) + "-" + month + "-" + day;
      return date;
    };
    const createPentagonPath = (x, y, width, height) => {
      const tipWidth = 15;
      const path = `
      M ${x} ${y}
      L ${x + tipWidth} ${y - height / 2}
      L ${x + width} ${y - height / 2}
      L ${x + width} ${y + height / 2}
      L ${x + tipWidth} ${y + height / 2}
      Z`;
      return path;
    };
    const computeEventWidth = (byteLength) => byteLength < LIMIT_COUNT ? EVENT_WIDTH_SHORT : EVENT_WIDTH;
    String.prototype.getByteLength = function() {
      let byteLength = 0;
      for (let i = 0; i < this.length; i++) {
        const charCode = this.charCodeAt(i);
        if (charCode < 128) {
          byteLength += 1;
        } else {
          byteLength += 2;
        }
      }
      return byteLength;
    };
    const setYearJump = () => {
      const yearSelector = ".year-label";
      const yearListHTML = createYearJumpListHTML(yearSelector);
      const main = document.querySelector(".l-main");
      main.setAttribute("style", "padding-top:0; margin: 20px 0 0 40px; font-size: larger;");
      main.insertAdjacentHTML("afterbegin", yearListHTML);
      setTimeout(() => {
        const header = document.querySelector("header");
        const nav = document.querySelector(".nav");
        const navHeight = nav.clientHeight;
        window.onscroll = () => {
          if (window.pageYOffset >= header.clientHeight) {
            nav.classList.add("fixed");
            main.setAttribute("style", `padding-top: ${navHeight}px`);
          } else {
            nav.classList.remove("fixed");
            main.setAttribute("style", "padding-top:0; margin: 20px 0 0 40px; font-size: larger;");
          }
        };
        const latestYear = document.querySelector(yearSelector);
        const scrollTop = latestYear.parentNode.getBoundingClientRect().top;
        scrollTo(0, 0);
        scrollTo({
          top: scrollTop,
          behavior: "smooth"
        });
        Array.prototype.forEach.call(document.getElementsByClassName("rel_year"), (x) => {
          const year = x.innerText;
          const yearElement = document.getElementById("y_" + year);
          const top = yearElement.getBoundingClientRect().top;
          console.log("@@@", year, top);
          x.setAttribute("href", `javascript:scrollTo({top:${top}, behavior:'smooth'});`);
        });
      }, 100);
    };
    const createYearJumpListHTML = (_yearSelector) => {
      let html = `<header class="header" role="banner" style="z-index: 1000;">
                   <nav class="nav">
                     <ul class="nav-list">`;
      Array.prototype.forEach.call(document.querySelectorAll(_yearSelector), (x) => {
        const year = x.textContent;
        html += `<li><a class="rel_year">${year}</a></li>`;
      });
      html += `</ul>
      </nav>
    </header>`;
      return html;
    };
    const hinataEvents = [
      { d: "150821", n: "欅坂46 結成" },
      { d: "151130", n: "\\0; 特例で欅坂46に加入" },
      { d: "151130", n: "けやき坂46オーディション 開催発表" },
      { d: "160508", n: "けやき坂46 一期生11名加入" },
      { d: "160626", n: "\\0; 欅坂46/けやき坂46の兼任メンバーに" },
      { d: "160810", n: '"ひらがなけやき" 収録 欅坂46 2ndシングル 発売' },
      { d: "161028", n: '初単独イベント "ひらがなおもてなし会" 開催' },
      { d: "161130", n: '"誰よりも高く跳べ！" 収録 欅坂46 3rdシングル 発売' },
      { d: "170312", n: "ひらがな全国ツアー2017 開催" },
      { d: "170403", n: "はんにゃ・金田と欅坂46のゆうがたパラダイス 放送開始" },
      { d: "170405", n: '"僕たちは付き合っている" 収録 欅坂46 4thシングル 発売' },
      { d: "170406", n: "けやき坂46メンバー追加オーディション発表" },
      { d: "170709", n: '"沈黙した恋人よ"、"永遠の白線" 収録 欅坂46 1stアルバム 発売' },
      { d: "170722", n: "欅共和国2017 出演" },
      { d: "170805", n: "TOKYO IDOL FESTIVAL 2017 出演" },
      { d: "170813", n: "追加メンバー9名(のちの二期生) 加入" },
      { d: "170924", n: "\\0; けやき坂46兼任から欅坂46専任へ" },
      { d: "171018", n: 'ゲームアプリ "欅のキセキ" サービス開始' },
      { d: "171020", n: "Re:Mind 放送開始" },
      { d: "171025", n: '"それでも歩いてる" "NO WAR in the future" 収録 欅坂46 5thシングル 発売' },
      { d: "180130", n: "ひらがなけやき日本武道館3Days!! 開催" },
      { d: "180212", n: "けやき坂46二期生おもてなし会 開催" },
      { d: "180307", n: '"イマニミテイロ" "半分の記憶" 収録 欅坂46 6thシングル 発売' },
      { d: "180310", n: "坂道合同新規メンバー募集オーディション 開催発表" },
      { d: "180409", n: '冠番組 "ひらがな推し" 放送開始' },
      { d: "180415", n: '"けやき坂46 ラーメン大好き! 齊藤京子です" 放送' },
      { d: "180417", n: '"KEYABINGO!4 ひらがなけやきって何？" 放送開始' },
      { d: "180420", n: '舞台 "あゆみ" 出演' },
      { d: "180522", n: '\\14; "Seventeen" 専属モデル就任' },
      { d: "180601", n: "\\4; 活動休止を発表", l: "https://www.keyakizaka46.com/s/k46o/news/detail/O00098" },
      { d: "180603", n: "\\7; けやき坂46 キャプテン就任" },
      { d: "180604", n: '"走り出す瞬間" ツアー 2018 開催' },
      { d: "180620", n: 'けやき坂46 デビューアルバム "走り出す瞬間" 発売' },
      { d: "180720", n: "欅共和国2018 出演" },
      { d: "180728", n: "SUNNY TRAIN REVUE 2018 ～テレビがフェスつくっちゃいました!～ 出演" },
      { d: "180803", n: "TOKYO IDOL FESTIVAL 2018 出演" },
      { d: "180815", n: '"ハッピーオーラ" 収録 欅坂46 7thシングル 発売' },
      { d: "180815", n: "コカ･コーラ SUMMER STATION 音楽LIVE 出演" },
      { d: "180824", n: '舞台 "マギアレコード 魔法少女まどか☆マギカ外伝" 出演' },
      { d: "181004", n: '\\18; 舞台 "七色いんこ" 出演' },
      { d: "181006", n: "TGC KITAKYUSHU 2018 ARTIST LIVE 出演" },
      { d: "181026", n: 'Hot Stuff Promotion 40th Anniversary "MASAKA" 出演' },
      { d: "181120", n: 'カレーハウスCoCo壱番屋 TVCM "ここいち de HAPPY!キャンペーン" 出演' },
      { d: "181110", n: "三期生 \\21; 加入" },
      { d: "181116", n: '\\3; \\5; \\6; \\14; 舞台 "ザンビ" 出演' },
      { d: "181124", n: "Livejack SPECIAL 2018 出演" },
      { d: "181210", n: "欅坂46二期生/けやき坂46三期生 お見立て会 開催" },
      { d: "181210", n: "New Asian Artist Japan 受賞" },
      { d: "181211", n: "ひらがなくりすます2018 開催" },
      { d: "190101", n: '\\8; Aimer "花びらたちのマーチ" MV 出演' },
      { d: "190103", n: '\\6; "イマドキッ" レギュラー出演' },
      { d: "190117", n: '\\20;ソロ写真集 "陽だまり" 発売' },
      { d: "190207", n: `\\2; \\7; \\18; 舞台 "ザンビ THEATER'S END" 出演` },
      { d: "190211", n: '"日向坂46"へ改名発表' },
      { d: "190211", n: "日向坂46として活動開始" },
      { d: "190214", n: '\\5; "CanCam" 専属モデル就任' },
      { d: "190214", n: '\\7; "Ray" 専属モデル就任' },
      { d: "190214", n: '\\8; "non-no" 専属モデル就任' },
      { d: "190214", n: '\\10; "JJ" 専属モデル就任' },
      { d: "190227", n: '"君に話しておきたいこと" 収録 欅坂46 8thシングル 発売' },
      { d: "190305", n: "日向坂46 デビューカウントダウンライブ!! 開催" },
      { d: "190305", n: '公式YouTubeチャンネル "日向坂46 OFFICIAL YouTube CHANNEL" 開設' },
      { d: "190313", n: '\\6; "ラーメン女子博 in 静岡 2019" PR大使就任' },
      { d: "190315", n: "開店!みーぱんベーカリー 放送" },
      { d: "190323", n: "LAGUNA MUSIC FES.2019 出演" },
      { d: "190327", n: '1stシングル "キュン" 発売' },
      { d: "190330", n: "東京ガールズコレクション 2019 SPRING/SUMMER スペシャルライブ 出演" },
      { d: "190401", n: "はんにゃ・金田と欅坂46と日向坂46のゆうがたパラダイス 放送開始" },
      { d: "190402", n: "\\5; レコメン！ 毎週火曜レギュラー出演" },
      { d: "190409", n: '冠番組 "日向坂で会いましょう" へリニューアル' },
      { d: "190409", n: '\\3; \\18; NHK高校講座 "社会と情報" 出演' },
      { d: "190416", n: "HINABINGO! 放送開始" },
      { d: "190515", n: 'ゲームアプリ "ザンビ THE GAME" サービス開始' },
      { d: "190518", n: "Rakuten GirlsAward 2019 SPRING/SUMMER ライブステージ 出演" },
      { d: "190525", n: "メ～テレ MUSIC WAVE 2019～踊るラグーナビーチ～ 出演" },
      { d: "190530", n: '高校生eスポーツ甲子園「STAGE:0」第1回大会“STAGE:0" 応援マネージャー就任' },
      { d: "190621", n: "\\3; 卒業を発表" },
      { d: "190605", n: '\\8; 朗読劇 "Reading♥︎Stage「百合と薔薇」" 出演' },
      { d: "190607", n: '\\6; "ar" レギュラーモデル就任' },
      { d: "190618", n: '\\18; 朗読劇 "Reading♥︎Stage「百合と薔薇」" 出演' },
      { d: "190621", n: "\\17; 活動休止を発表" },
      { d: "190626", n: "テレ東音楽祭2019 出演" },
      { d: "190701", n: "\\20; 未確認フェスティバル2019 応援ガール就任" },
      { d: "190706", n: '"THE MUSIC DAY 時代" 出演' },
      { d: "190715", n: '"ドレミソラシド" 文化放送パワープレイ(7/15週）' },
      { d: "190716", n: "全力! 日向坂46バラエティー HINABINGO!2 放送開始" },
      { d: "190717", n: '2ndシングル "ドレミソラシド" 発売' },
      { d: "190724", n: "FNSうたの夏まつり 出演" },
      { d: "190731", n: '新感覚ホラーアトラクション "ザンビ THE ROOM 最後の選択" 開催' },
      { d: "190803", n: "TOKYO IDOL FESTIVAL 2019 出演" },
      { d: "190811", n: "\\3; 卒業" },
      { d: "190814", n: "Coca-Cola STAGE:0 2019 FINAL STAGE 決勝大会 来場" },
      { d: "190825", n: "@JAM EXPO 2019 出演" },
      { d: "190828", n: 'グループ1st写真集 "立ち漕ぎ" 発売' },
      { d: "190903", n: '\\6; 舞台 "サザエさん" 出演' },
      { d: "190903", n: "\\7; \\10; HARD OFF ECOスタジアム新潟 巨人 VS 中日 始球式" },
      { d: "190908", n: "FAGi GIRL's FESTA 2019 with ストライプインターナショナル 出演" },
      { d: "190915", n: "KOYABU SONIC 2019 出演" },
      { d: "190918", n: "日向坂46 MTV VMAJ 2019 -THE LIVE- MC出演" },
      { d: "190921", n: "イナズマロック フェス 2019 出演" },
      { d: "190924", n: `ゲームアプリ "UNI'S ON AIR" サービス開始` },
      { d: "190926", n: "日向坂46 3rdシングル発売記念ワンマンライブ 開催" },
      { d: "190928", n: "Rakuten GirlsAward 2019 AWTUMN/WINTER ライブステージ 出演" },
      { d: "191002", n: '3rdシングル "こんなに好きになっちゃっていいの?" 発売' },
      { d: "191010", n: 'MRT宮崎放送 "日向坂で会いましょう" 放送開始' },
      { d: "191012", n: "長岡米百俵フェス 台風のため開催中止" },
      { d: "191016", n: "\\7; \\18; 坂道グループのオールナイトニッポン 出演" },
      { d: "191020", n: "LAGUNA MUSIC FES. 2019 Autumn Special 出演" },
      { d: "191030", n: "坂道グループ合同 研修生ツアー 開催" },
      { d: "191102", n: "FAI Drone Tokyo 2019 Racing & Conference〈決勝〉in TMS ライブゲスト出演" },
      { d: "191113", n: "ベストヒット歌謡祭2019 出演" },
      { d: "191115", n: '\\14; 映画 "恐怖人形" 出演' },
      { d: "191116", n: '第61回日本レコード大賞 "ドレミソラシド" 優秀作品 賞受賞' },
      { d: "191204", n: "Yahoo！検索大賞2019」アイドル部門賞受賞" },
      { d: "191211", n: "FNS歌謡祭2019 第2夜 出演" },
      { d: "191217", n: "ひなくり2019 〜17人のサンタクロースと空のクリスマス〜 開催" },
      { d: "191227", n: "MUSIC STATION ウルトラSUPERLIVE2019 出演" },
      { d: "191231", n: '第70回NHK紅白歌合戦 初出場 "キュン"を披露' },
      { d: "191231", n: "CDTVスペシャル！年越しプレミアライブ2019⇒2020 出演" },
      { d: "200106", n: "DASADA 放送開始" },
      { d: "200107", n: "\\17; 活動再開" },
      { d: "200111", n: "SDGs推進 TGC しずおか 2020 by TOKYO GIRLS COLLECTION DASADA STAGE 出演" },
      { d: "200204", n: "日向坂46×DASADA LIVE & FASHION SHOW 開催" },
      { d: "200216", n: "\\7; 全国ボロいい宿〜発見！それでも人気なわけがある！ 出演" },
      { d: "200221", n: "\\1; 卒業を発表" },
      { d: "200216", n: "坂道研修生から日向坂46三期生として3名加入" },
      { d: "200219", n: '4thシングル "ソンナコトナイヨ" 発売' },
      { d: "200220", n: '東京ガールズコレクション 2020 SPRING/SUMMER "DASADA スペシャルファッションショー" 出演' },
      { d: "200314", n: "日向坂46です。ちょっといいですか? 配信開始" },
      { d: "200325", n: 'ノンフィクション書籍 "日向坂46ストーリー" 発売' },
      { d: "200325", n: '\\8; "ZIP!"内コーナー "流行ニュース キテルネ！" リポーター就任' },
      { d: "200330", n: "\\1; 卒業" },
      { d: "200331", n: "日向坂46デビュー1周年記念 スペシャルトーク&ライブ！ 配信" },
      { d: "200401", n: 'ゲームアプリ "欅のキセキ" アプリタイトル名を "欅のキセキ/日向のアユミ" に変更" ' },
      { d: "200403", n: '\\20; 日経エンタテインメント！ "今日も笑顔で全力疾走" 連載開始' },
      { d: "200405", n: "日向坂46の「ひ」 放送開始" },
      { d: "200426", n: "\\6; アッパレやってまーす！〜土曜日です レギュラー出演" },
      { d: "200526", n: "\\4; 活動再開" },
      { d: "200611", n: "STAGE:0 2020 応援マネージャー就任" },
      { d: "200615", n: '\\14; Johnson & Johnson Vision Home TVCM "アキュビュー® スマート調光®" 出演' },
      { d: "200627", n: 'MTV ACOUSTIC FLOWERS -Until Full Bloom“Bell & Like"- 放送' },
      { d: "200711", n: "\\8; 女子グルメバーガー部 出演" },
      { d: "200718", n: "音楽の日2020 出演" },
      { d: "200731", n: "HINATAZAKA46 Live Online, YES! with YOU! ~22人の音楽隊と風変わりな仲間たち~ 開催" },
      { d: "200807", n: 'ドキュメンタリー映画 "3年目のデビュー" 公開' },
      { d: "200905", n: "東京ガールズコレクション 2020 AUTUMN/WINTER ONLINE DASADA STAGE 出演" },
      { d: "200912", n: "THE MUSIC DAY 出演" },
      { d: "200921", n: "CDTV ライブ！ライブ！4時間SP 出演" },
      { d: "200921", n: "\\18; 休養を発表" },
      { d: "200922", n: '\\12; "bis" レギュラーモデル決定' },
      { d: "200923", n: '日向坂46名義としては初となる1stアルバム "ひなたざか" 発売' },
      { d: "200930", n: "テレ東音楽祭2020秋 出演" },
      { d: "201002", n: "ベルク presents 日向坂46の余計な事までやりましょう! 放送開始" },
      { d: "201004", n: "TOKYO IDOL FESTIVAL オンライン2020 出演" },
      { d: "201015", n: "日向坂46×DASADA Fall＆Winter Collection 開催" },
      { d: "201024", n: "SONGS OF TOKYO Festival 2020 出演" },
      { d: "201028", n: '\\7; "みえる" MC就任' },
      { d: "201101", n: "大好き！日向坂46 ～芸能界おひさま化計画&ライブ映像蔵出しSP～ #1 配信" },
      { d: "201114", n: "\\12; \\16; \\20; 埼玉県150周年1年前イベント 出演" },
      { d: "201114", n: "\\12; \\16; \\20; 埼玉応援団 就任" },
      { d: "201118", n: 'ゲームアプリ "ひなこい" サービス開始' },
      { d: "201125", n: "ベストアーティスト2020 出演" },
      { d: "201206", n: "大好き！日向坂46 ～芸能界おひさま化計画&ライブ映像蔵出しSP～ #2 配信" },
      { d: "201209", n: "2020FNS歌謡祭 出演" },
      { d: "201121", n: "\\19; 休養を発表" },
      { d: "201224", n: "ひなくり2020 〜おばけホテルと22人のサンタクロース〜 開催" },
      { d: "201225", n: "ミュージックステーション ウルトラSUPER LIVE 2020 出演" },
      { d: "201224", n: "\\18; 活動再開" },
      { d: "201226", n: "The Entertainment Showsite 20/21 -TES 20/21- DAY1 出演" },
      { d: "201229", n: "\\2; さくらひなたロッチの伸びしろラジオ 出演" },
      { d: "201231", n: '第71回NHK紅白歌合戦 2年連続2回目の出場 "アザトカワイイ"を披露' },
      { d: "201231", n: "CDTV ライブ！ライブ！年越しスペシャル 2020→2021 出演" },
      { d: "210101", n: "\\5; \\7; \\14; 芸能人格付けチェック！2021お正月スペシャル 出演" },
      { d: "210104", n: '\\20 "星になりたかった君と" 出演' },
      { d: "210119", n: '\\6; ソロ写真集 "とっておきの恋人" 発売' },
      { d: "210221", n: "\\7; 全国ボロいい宿－山奥で発見！人気の宿に泊まってみた－ 出演" },
      { d: "210225", n: '戦略バトルRPG "日向坂46とふしぎな図書室" サービス開始' },
      { d: "210307", n: '\\6; \\17; ドラマ "ボーダレス" 出演' },
      { d: "210323", n: "\\15; 1週間程度の休養を発表" },
      { d: "210326", n: "日向坂46 デビュー2周年キャンペーン Special 2days 開催" },
      { d: "210326", n: '\\8; "賭ケグルイ双" 出演' },
      { d: "210326", n: "\\19; 活動再開" },
      { d: "210329", n: "CDTV ライブ！ライブ！ 4時間スペシャル 出演" },
      { d: "210330", n: "\\5; ラヴィット！ 火曜レギュラー出演" },
      { d: "210401", n: "キョコロヒー 放送開始" },
      { d: "210402", n: "星のドラゴンクエスト presents 日向坂46 \\14;の「小坂なラジオ」 放送開始" },
      { d: "210408", n: '\\14; "Sony presents DinoScience 恐竜科学博" 公式アンバサダー就任' },
      { d: "210427", n: 'グループオフショット写真集 "日向坂46写真集 日向撮 VOL.01" 発売' },
      { d: "210429", n: "声春っ！ 放送開始" },
      { d: "210525", n: "\\5; 横浜DeNA VS オリックス ローソンデー始球式" },
      { d: "210525", n: "\\8; 休養を発表" },
      { d: "210526", n: '5thシングル "君しか勝たん" 発売' },
      { d: "210526", n: '5thシングル "君しか勝たん" ヒット祈願チアリーディング 配信' },
      { d: "210530", n: "\\4; さよなら私のクラマー 声優出演" },
      { d: "210601", n: "\\10; ラヴィット！ 火曜レギュラー出演" },
      { d: "210611", n: "\\4; 映画 さよなら私のクラマー ファーストタッチ 公開" },
      { d: "210617", n: "\\20\\ 女子グルメバーガー部 2021夏SP 出演" },
      { d: "210618", n: '\\14; 映画 "ヒノマルソウル〜舞台裏の英雄たち〜" 出演' },
      { d: "210620", n: "\\8; 活動再開" },
      { d: "210626", n: "\\14; 休養を発表" },
      { d: "210627", n: "\\20; 女子グルメバーガー部 2021 夏SP 出演" },
      { d: "210629", n: '\\14;1st写真集 "君は誰？" 発売' },
      { d: "210630", n: "テレ東音楽祭2021 出演" },
      { d: "210703", n: "\\5; \\6; \\16; THE MUSIC DAY 2021 出演" },
      { d: "210709", n: "W-KEYAKI FES. 2021 開催" },
      { d: "210709", n: "\\14; ソニー損害保険 TVCM 「ドライブデートの約束」篇 出演" },
      { d: "210717", n: "音楽の日2021 出演" },
      { d: "210801", n: "\\18; ラヴィット！ 月曜レギュラー出演" },
      { d: "210820", n: '\\4; 映画 "かぐや様は告らせたい〜天才たちの恋愛頭脳戦〜ファイナル" 出演' },
      { d: "210901", n: '\\12; ジェニーハイ "夏嵐" MV 出演' },
      { d: "210913", n: '\\17; "with" 専属モデル就任' },
      { d: "210919", n: '"不撓の"長岡 米百俵フェス 〜花火と食と音楽と〜 2021 開催延期' },
      { d: "210915", n: 'アリーナツアー "全国おひさま化計画 2021" 開催' },
      { d: "211002", n: "ひなこい presents 日向坂46\\18;の日向坂高校放送部 放送開始" },
      { d: "211002", n: '\\16; \\18; \\20; "CHOTeN 〜今週、誰を予想する?〜" 出演' },
      { d: "211003", n: "TOKYO IDOL FESTIVAL 2021 出演" },
      { d: "211005", n: "\\6; MTV LIVE MATCH 緑黄色社会ステージ ゲストボーカル出演" },
      { d: "211006", n: '\\7; "2分59秒" MC就任' },
      { d: "211009", n: "\\5; \\7; オールスター感謝祭’21秋 出演" },
      { d: "211027", n: '6thシングル "ってか" 発売' },
      { d: "211105", n: "日向坂46×KOEHARU LIVESHOW！ 開催" },
      { d: "211105", n: "星のドラゴンクエスト presents 日向坂46 \\8;の「ホイミーぱん」 放送開始" },
      { d: "211111", n: "ベストヒット歌謡祭 2021 出演" },
      { d: "211114", n: "\\12; \\16; \\20; 埼玉150th anniversary Specialイベント 出演" },
      { d: "211127", n: "\\5;, \\6; NHK WORLD JAPAN presents SONGS OF TOKYO Festival 2021 出演" },
      { d: "211201", n: "2021 FNS歌謡祭 第１夜 出演" },
      { d: "211222", n: "日向坂46 冬の大ユニット祭り X’masスペシャル 開催" },
      { d: "211224", n: "ひなくり2021 開催" },
      { d: "211228", n: "\\11; SASUKE 第39回大会 出場" },
      { d: "211231", n: '第72回NHK紅白歌合戦 3年連続3回目の出場 "君しか勝たん"を披露' },
      { d: "220101", n: "\\5; \\7; \\12; 芸能人格付けチェック！2022お正月スペシャル 出演" },
      { d: "220201", n: "\\20; 相席食堂 出演" },
      { d: "220220", n: "\\7; 全国ボロいい宿 それでも人気なわけがある！ 出演" },
      { d: "220301", n: '\\13;1st写真集 "思い出の順番" 発売' },
      { d: "220304", n: "\\14; 活動再開" },
      { d: "220307", n: "日向坂46 新メンバーオーディション 応募受付開始" },
      { d: "220330", n: "3回目のひな誕祭 開催" },
      { d: "220401", n: "ローソン presents 日向坂46のほっとひといき! 放送開始" },
      { d: "220403", n: "\\20; 卒業を発表" },
      { d: "220404", n: '\\16; "みんなのまめお" 声優出演' },
      { d: "220423", n: "\\20; グッドモーニング、眠れる獅子 出演" },
      { d: "220413", n: "\\15; ラヴィット! 水曜シーズンレギュラー出演" },
      { d: "220514", n: "Rakuten GirlsAward 2022 SPRING/SUMMER ライブステージ 出演" },
      { d: "220514", n: '\\2; 舞台 "フラガール -dance for smile-" 出演' },
      { d: "220524", n: "\\6; \\11; \\13; 生キョコロヒー！2022初夏～六本木くる民の集い～ 出演" },
      { d: "220531", n: "\\24; 横浜DeNA VS オリックス ローソンデー始球式" },
      { d: "220601", n: '7thシングル "僕なんか" 発売' },
      { d: "220603", n: '\\21; 日経エンタテインメント！ "ピュアで真っ直ぐな変化球" 連載開始' },
      { d: "220622", n: "テレ東音楽祭2022夏 出演" },
      { d: "220623", n: '日向坂46・\\20;卒業記念書籍 "私が私であるために" 発売' },
      { d: "220628", n: "\\20;卒業セレモニー 開催" },
      { d: "220703", n: '\\9; "CHOTeN 〜今週、誰を予想する?〜" 出演' },
      { d: "220708", n: 'ドキュメンタリー映画 "希望と絶望 その涙を誰も知らない" 公開' },
      { d: "220710", n: "\\15; GO ON! NEXT 〜サーキットで会いましょう〜 放送開始" },
      { d: "220713", n: "2022 FNS歌謡祭 夏 出演" },
      { d: "220716", n: "音楽の日2022 出演" },
      { d: "220722", n: '"W-KEYAKI FES. 2022" 開催' },
      { d: "220807", n: "TOKYO IDOL FESTIVAL 2022 出演" },
      { d: "220907", n: "\\19; 卒業を発表" },
      { d: "220908", n: "\\2; 休養を発表" },
      { d: "220910", n: "Happy Smile Tour 2022 開催" },
      { d: "220913", n: '\\11;1st写真集 "見つけた" 発売' },
      { d: "220921", n: "四期生12名 加入" },
      { d: "221004", n: '\\18; "THE TIME," 火曜レギュラー出演' },
      { d: "221008", n: "長岡米百俵フェス 出演" },
      { d: "221015", n: "\\14; 関西電力グループ TVCM 出演" },
      { d: "221026", n: '8thシングル "月と星が踊るMidnight" 発売' },
      { d: "221026", n: '\\8; ドラマ "ぴーすおぶけーき" 出演' },
      { d: "221026", n: "\\2; 活動再開" },
      { d: "221110", n: "ベストヒット歌謡祭 2022 出演" },
      { d: "221122", n: "\\4; FIFAワールドカップ カタール2022 (ABEMA/テレビ朝日) 出演" },
      { d: "221123", n: "テレ東音楽祭 2022冬 出演" },
      { d: "221201", n: '\\15; 首都高 TVCM "首都高 高速大師橋リニューアル" 出演' },
      { d: "221217", n: "ひなくり2022 開催" },
      { d: "221218", n: "ひなくり2022 \\19;卒業セレモニー 開催" },
      { d: "221220", n: '\\12;1st写真集 "羅針盤" 発売' },
      { d: "221227", n: "\\11 SASUKE2022～NINJA WARRIOR～ 第40回記念大会 出場" },
      { d: "221231", n: '第73回NHK紅白歌合戦 4年連続4回目の出場 "キツネ"を披露' },
      { d: "230120", n: '\\8; 舞台 "ぴーすおぶけーき" 出演' },
      { d: "230123", n: '\\17; 舞台 "オッドタクシー 金剛石は傷つかない" 出演' },
      { d: "230212", n: "四期生おもてなし会 開催" },
      { d: "230217", n: "\\2; 卒業を発表" },
      { d: "230219", n: "\\7; 全国ボロいい宿 仰天！人気のワケを聞いてみた 出演" },
      { d: "230228", n: '\\19; 小説集 "きらきらし" 発売' },
      { d: "230307", n: '\\10; \\17; "andGIRL" レギュラーモデル決定' },
      { d: "230308", n: '\\8; ミュージカル "SPYxFAMILY" 出演' },
      { d: "230324", n: '\\29; NHK高校講座 "情報I" 出演' },
      { d: "230401", n: "4回目のひな誕祭 開催" },
      { d: "230403", n: "\\24; さくらひなたロッチの伸びしろラジオ レギュラーMC就任" },
      { d: "230404", n: "日向坂46\\2;のサリマカシーラジオ 放送開始" },
      { d: "230408", n: "\\4; \\6; オールスター感謝祭23春 出演" },
      { d: "230414", n: '\\6; ドラマ "アクトレス" 出演' },
      { d: "230416", n: '公式YouTubeチャンネル "日向坂ちゃんねる" 開設' },
      { d: "230419", n: '9thシングル "One choice" 発売' },
      { d: "230424", n: "四期生 日向坂になりましょう 配信開始" },
      { d: "230507", n: "\\6; \\13; \\15; 生キョコロヒー2023春〜自覚と責任の5000席〜 出演" },
      { d: "230509", n: '\\4;1st写真集 "知らないことだらけ" 発売' },
      { d: "230513", n: 'DreamHack Japan 2023 "スプラトゥーン3 坂道グループ対抗戦" 出場' },
      { d: "230516", n: "\\15; サーキットで会いましょう 放送開始" },
      { d: "230521", n: "MTV Unplugged Presents: Kyoko Saito from Hinatazaka46 開催" },
      { d: "230614", n: "\\24; 横浜DeNA VS 北海道日本ハム ローソンデー始球式" },
      { d: "230620", n: '\\5;1st写真集 "#会いたい" 発売' },
      { d: "230628", n: "テレ東音楽祭2023夏 出演" },
      { d: "230705", n: '\\24; ドラマ "DIY!!-どぅー・いっと・ゆあせるふ-" 出演' },
      { d: "230711", n: '\\2; 舞台 "レ・ミゼラブル～惨めなる人々～" 出演' },
      { d: "230711", n: '\\30; ポルノグラフィティ×広島県 "メッセージ to ひろしま" 出演' },
      { d: "230712", n: "2023 FNS歌謡祭 夏 出演" },
      { d: "230712", n: '\\23; \\24; 舞台 "幕が上がる" 出演' },
      { d: "230715", n: "音楽の日2023 出演" },
      { d: "230719", n: "\\4;卒業セレモニー 開催" },
      { d: "230726", n: '10thシングル "Am I ready?" 発売' },
      { d: "230805", n: '"ひなたアカデミー" 放送開始' },
      { d: "230806", n: "TOKYO IDOL FESTIVAL 2023 出演" },
      { d: "230811", n: '\\15; ミュージカル "ヴィンチェンツォ" 出演' },
      { d: "230821", n: "日向坂アニメ部 第1回 放送" },
      { d: "230825", n: "\\16; 休養を発表" },
      { d: "230830", n: "Happy Train Tour 2023 開催" },
      { d: "230912", n: '\\21; 1st写真集 "そのままで" 発売' },
      { d: "230914", n: "\\2; 卒業を発表" },
      { d: "230914", n: "\\18; 春日ロケーション〜春日プロデューサーの旅番組〜 出演" },
      { d: "230915", n: "世界卓球2024 団体戦 応援サポーター就任" },
      { d: "230922", n: '\\6; 映画 "ミュータント・タートルズ：ミュータント・パニック" 声優出演' },
      { d: "230925", n: "\\35; 大須テレビ 出演" },
      { d: "231007", n: "SONYSONPO QUEST FOR THE FUTURE 放送開始" },
      { d: "231007", n: "日向坂46 \\31;のひら砲らじお 放送開始" },
      { d: "231009", n: "\\26; 休養を発表" },
      { d: "231013", n: '\\18; "クイズ!あなたは小学5年生より賢いの？" 300万円獲得' },
      { d: "231021", n: "\\6; 泥濘の食卓 出演" },
      { d: "231022", n: "\\6; MTV VMAJ 2023 コラボステージ 出演" },
      { d: "231029", n: "\\15; 全日本スーパーフォーミュラ選手権 第9戦 国歌独唱" },
      { d: "231029", n: "日向坂46・\\18;のオールナイトニッポン0(ZERO) 放送開始" },
      { d: "231103", n: "新参者 in TOKYU KABUKICHO TOWER 開催" },
      { d: "231108", n: '2ndアルバム "脈打つ感情" 発売' },
      { d: "231120", n: '\\6; ヤクルトの宅配『みんなのもの篇』イメージソング "My family" 歌唱' },
      { d: "231122", n: '\\22; 舞台 "ラフテイル・オブ・アラジン" 出演' },
      { d: "231207", n: "\\26; 活動辞退 発表" },
      { d: "231209", n: "Happy Train Tour 2023 追加公演 開催" },
      { d: "231209", n: "Happy Train Tour 2023 \\2; 卒業セレモニー 開催" },
      { d: "231227", n: "\\11; SASUKE2023 ～第41回大会～ 出場" },
      { d: "231231", n: "CDTVライブ！ライブ！年越しスペシャル2023→2024 出演" },
      { d: "231231", n: "\\16; 活動再開" },
      { d: "240101", n: 'キョコロヒー "After you!" デジタル配信' },
      { d: "241011", n: 'MRT宮崎放送 "日向坂で会いましょう" レギュラー放送再開' },
      { d: "240111", n: "\\6; 卒業を発表" },
      { d: "240124", n: "\\15; ABEMAモータースポーツアンバサダー就任" },
      { d: "240218", n: "\\7; 全国ボロいい宿 ～なぜ人気？ バナナマンが大調査～出演" },
      { d: "240301", n: '展覧会 "WE R!" 開催' },
      { d: "240303", n: "大好き日向坂46!! 歌も笑いも全部まとめて生配信 おひさまと一緒にひな祭りSP!! 配信" },
      { d: "240305", n: "\\10; 卒業を発表" },
      { d: "240308", n: '\\5; ドラマ25 "これから配信はじめます" 出演' },
      { d: "240309", n: "ユニ春！ ライブ 2024 出演" },
      { d: "240309", n: '\\15; 千鳥の鬼レンチャン "サビだけカラオケ" 鬼レンチャン達成 100万円獲得' },
      { d: "240313", n: '\\6; ドラマ "恋愛戦略会議" 出演' },
      { d: "240319", n: 'デビュー5周年記念公式BOOK "H46MODE vol.1" 発売' },
      { d: "240401", n: '四期生 "もっと！日向坂になりましょう" リニューアル配信開始' },
      { d: "240401", n: "\\27; さくらひなたロッチの伸びしろラジオ レギュラーMC就任" },
      { d: "240404", n: "日向坂46・\\18;のオールナイトニッポンX 放送開始" },
      { d: "240405", n: "\\6;卒業コンサート 開催" },
      { d: "240405", n: "LOGISTEED RADIONOMICS 放送開始" },
      { d: "240406", n: "5回目のひな誕祭 開催" },
      { d: "240406", n: '\\7; "スポーツ リアライブ〜SPORTS Real&Live〜" MC就任' },
      { d: "240406", n: "日向坂46 \\30;の地元できらる 放送開始" },
      { d: "240427", n: "ROUND1 TVCM 出演" },
      { d: "240501", n: "日向坂ミュージックパレード 放送開始" },
      { d: "240508", n: '11thシングル "君はハニーデュー" 発売' },
      { d: "240528", n: '\\18;1st写真集 "振り向いて" 発売' },
      { d: "240607", n: '\\7; "NEW ERA® DAY 2024" ジャイアンツ VS オリックス ファーストピッチ' },
      { d: "240608", n: "CHAGU CHAGU ROCK FESTIVAL 2024 出演" },
      { d: "240618", n: '\\10;1st写真集 "僕の記憶の中で" 発売' },
      { d: "240621", n: "ひなたフェス開催決定記念！日向坂46時間TV〜全国おひさま化計画〜 配信" },
      { d: "240626", n: "テレ東ミュージックフェス2024夏 出演" },
      { d: "240628", n: "\\33; 北海道日本ハム VS 福岡ソフトバンク ファーストピッチ＆きつねダンス披露" },
      { d: "240703", n: "11th Single ひなた坂46 LIVE 開催" },
      { d: "240703", n: "2024 FNS歌謡祭 夏 出演" },
      { d: "240704", n: "ひなた坂46 LIVE DAY2 高本彩花卒業セレモニー 開催" },
      { d: "240713", n: "J-WAVE presents INSPIRE TOKYO 2024 -Best Music & Market- 出演" },
      { d: "240713", n: "音楽の日2024 出演" },
      { d: "240714", n: "ソラシドエア タイアップ" },
      { d: "240718", n: "竹内希来里 休養を発表" },
      { d: "240722", n: "\\24; \\31; とっとりふるさと大使 就任" },
      { d: "240724", n: "OSAKA GIGANTIC MUSIC FESTIVAL 2024 出演" },
      { d: "240725", n: '\\5; "彩香ちゃんは弘子先輩に恋してる" 出演' },
      { d: "240804", n: "三期生 TOKYO IDOL FESTIVAL 2024 出演" },
      { d: "240805", n: "新メンバーオーディション 募集開始" },
      { d: "240806", n: "\\5; \\11; \\16; \\17; 卒業を発表" },
      { d: "240810", n: "放送作家\\18; 放送" },
      { d: "240811", n: "\\30; 活動再開" },
      { d: "240816", n: "日向坂46 みやざき大使 就任" },
      { d: "240817", n: "日向坂46\\34;のレジェわん！ 第1回放送" },
      { d: "240822", n: "\\14; 横浜DeNA VS 中日 ローソンデー始球式" },
      { d: "240827", n: "日向坂46四期生ライブ 開催" },
      { d: "240831", n: "Song for 能登！ 24時間テレビチャリティーライブ 出演" },
      { d: "240906", n: "\\21; \\23; 生キョコロヒー 2024 VTR出演" },
      { d: "240907", n: "ひなたフェス2024 開催" },
      { d: "240910", n: '\\12; 写真展 "みとめる" 開催' },
      { d: "240918", n: '12thシングル "絶対的第六感" 発売' },
      { d: "241004", n: "\\28;のCheer up！ 放送開始" },
      { d: "241005", n: "日向坂ミュージックパレードLIVE 開催" },
      { d: "241011", n: '\\16; 映画 "室井慎次 敗れざる者" 出演' },
      { d: "241013", n: "\\36; 休養を発表" },
      { d: "241023", n: "12th Single ひなた坂46 LIVE 開催" },
      { d: "241024", n: '\\29; Conton Candy "急行券とリズム" MV 出演' },
      { d: "241025", n: '映画 "ゼンブ・オブ・トーキョー" 公開' },
      { d: "241031", n: 'NTTドコモLemino "日向坂46パック" 提供開始' },
      { d: "241107", n: "\\22; 副キャプテン就任" },
      { d: "241115", n: '\\16; 映画 "室井慎次 生き続ける者" 出演' },
      { d: "241115", n: "\\36; 活動再開" },
      { d: "241119", n: "Happy Magical Tour 2024 開催" },
      { d: "241130", n: "\\16;卒業セレモニー 開催" },
      { d: "241130", n: "ベストアーティスト 2024 出演" },
      { d: "241203", n: '\\17;1st写真集 "もしも" 発売' },
      { d: "241205", n: "Happy Magical Tour 2024 福岡公演 \\17;卒業セレモニー 開催" },
      { d: "241218", n: '戦略バトルRPG "日向坂46とふしぎな図書室" サービス終了' },
      { d: "241217", n: '\\8;1st写真集 "陽射しのパレード" 発売' },
      { d: "241222", n: '\\18; TVer "まもなくM-1グランプリ2024 敗者復活戦会場から徹底考察＆生リポート" 出演' },
      { d: "241225", n: "Happy Magical Tour 2024 東京公演 \\5;卒業セレモニー 開催" },
      { d: "250102", n: "四期生 大正製薬presents プレミアMelodiX! スペシャル2025 出演" },
      { d: "250105", n: '\\15; \\22; 千鳥の鬼レンチャン "サビだけカラオケ タッグモード" 鬼レンチャン達成' },
      { d: "250106", n: "\\7; \\8; \\9; 卒業を発表" },
      { d: "250112", n: '"一夜限りの復活！ベルク presents 日向坂46の余計な事までやりましょう" 放送' },
      { d: "250125", n: "\\11;卒業セレモニー 開催" },
      { d: "250129", n: '13thシングル "卒業写真だけが知ってる" 発売' },
      { d: "250211", n: "オールナイトニッポンX スペシャルライブ 出演" },
      { d: "250216", n: "\\7; \\32; \\35; 全国ボロいい宿 ～バナナマンも興奮！人気のヒミツ～ 出演" },
      { d: "250222", n: "日向坂ミュージックパレードLIVE 2025 開催" },
      { d: "250226", n: "【目指せ登録者40万人！】みんなで餃子460個食べ切るまで終わりません！生配信" },
      { d: "250302", n: "IDOL RUNWAY COLLECTION 2025 Supported by TGC LIVE performance STAGE" },
      { d: "250307", n: '\\14; "non-no" 専属モデル就任' },
      { d: "250308", n: '舞台 "五等分の花嫁" 出演' },
      { d: "250309", n: "\\15; 全日本スーパーフォーミュラ選手権 第2戦 国歌独唱" },
      { d: "250310", n: "五期生11名 加入" },
      { d: "250325", n: '\\7;1st写真集 "めくる日々" 発売' },
      { d: "250404", n: "カンニング竹山のイチバン研究所 出演" },
      { d: "250404", n: '"社畜人ヤブー" 出演' },
      { d: "250404", n: '\\31; 日経エンタテインメント！ "頭の中はおもちゃ箱" 連載開始' },
      { d: "250405", n: "6回目のひな誕祭 \\8;卒業セレモニー 開催" },
      { d: "250406", n: "6回目のひな誕祭 \\7;卒業セレモニー 開催" },
      { d: "250406", n: "\\22; キャプテン就任" },
      { d: "250407", n: '日向坂46・\\9; 卒業記念! "まなふぃのふぃ〜するラジオ" 放送' },
      { d: "250407", n: '\\21; 書籍 "へんてこスイッチ" 発売' },
      { d: "250430", n: "13th Single ひなた坂46 LIVE 開催" },
      { d: "250501", n: "13th Single ひなた坂46 LIVE \\9;卒業セレモニー 開催" },
      { d: "250503", n: "\\16; 卒業を発表" },
      { d: "250521", n: '14thシングル "Love yourself!" 発売' },
      { d: "250527", n: "五期生おもてなし会 開催" },
      { d: "250528", n: 'BRAND NEW LIVE 2025 "OVER THE RAINBOW" 開催' },
      { d: "250529", n: "新・日向坂ミュージックパレード 放送開始" },
      { d: "250605", n: '\\31; 舞台 "サザエさん" 出演' },
      { d: "250607", n: "CHAGU CHAGU ROCK FESTIVAL 2025 出演" },
      { d: "250621", n: "四期生 SORAON 2025 出演" },
      { d: "250627", n: "14thシングル 発売記念配信ミニライブ \\15;卒業セレモニー開催" },
      { d: "250702", n: "2025 FNS歌謡祭 夏 出演" },
      { d: "250706", n: "\\14; 横浜DeNA VS 阪神 ローソンデー始球式" },
      { d: "250714", n: "日向坂になりましょう -五期生成長バラエティ- 配信開始" },
      { d: "250719", n: "音楽の日2025 出演" },
      { d: "250723", n: "Suzuka Tomita（Hinatazaka46）-One Last Live- 開催" },
      { d: "250729", n: "日向坂46四期生ライブ presented by 新・日向坂ミュージックパレード 開催" },
      { d: "250804", n: "\\13; 卒業を発表" },
      { d: "250805", n: '\\15; 1st写真集 "鈴花サーキット" 発売' },
      { d: "250809", n: "Lucky Fes 2025 出演" },
      { d: "250811", n: "放送作家\\18;リターンズ 放送" },
      { d: "250817", n: "日向坂46・\\29;のオールナイトニッポン0（ZERO) 放送" },
      { d: "250821", n: "\\33; 北海道日本ハム VS オリックス ファーストピッチ＆きつねダンス披露" },
      { d: "250917", n: '15thシングル "お願いバッハ！" 発売' },
      { d: "250920", n: 'ARENA TOUR 2025 "MONSTER GROOVE" 開催' },
      { d: "251001", n: "Newsクランチ！ \\32;のあま～い漂流記～お菓子い散文～ 連載開始" },
      { d: "251004", n: '\\14; アリナミン製薬 TVCM "ベンザブロック プレミアムDX" 出演' },
      { d: "251010", n: "\\14; 2025-26大同生命SV.LEAGUE WOMEN 大阪マーヴェラス ホーム開幕戦 始球式" },
      { d: "251018", n: '"日向坂46 \\33;のほっかいど～なっつ！" 放送' },
      { d: "251019", n: '\\14; \\29; \\33; ソニー損害保険 TVCM "ソニー損保の自動車保険" 出演' },
      { d: "251031", n: '\\14; "ストロボ・エッジ Season１" 出演' },
      { d: "251101", n: '\\31; "エフエム山陰 開局40周年記念 レトロな金曜日は、GO-！ひら砲らじお" 出演' },
      { d: "251105", n: 'YouTube おちゃのまスペシャル "食欲の秋！手打蕎麦このか開店！" 公開' },
      { d: "251111", n: "五期生 新参者 二〇二五 LIVE at THEATER MILANO-Za 開催" },
      { d: "251111", n: '\\13;2nd写真集 "テイクオフ" 発売' },
      { d: "251119", n: "ARENA TOUR 2025 \\13;卒業セレモニー 開催" },
      { d: "251129", n: "ベストアーティスト2025 出演" },
      { d: "251201", n: "\\18; 卒業を発表" },
      { d: "251208", n: "日向坂46・\\18;のオールナイトニッポンX 松田のトークが聴きてぇか！ in パシフィコ横浜 回愛" },
      { d: "251221", n: "\\18; TVer生配信「M-1 グランプリ2025開幕直前SP敗者復活戦会場から徹底考察&生リポート 出演" },
      { d: "251222", n: "CDTV ライブ! ライブ! クリスマス 年間ランキングFes. 出演" },
      { d: "251231", n: "CDTVライブ！ライブ！年越しカウントダウンFes.2025→2026 出演" },
      { d: "260125", n: "LAWSON 50th Anniversary presents Special LIVE ~櫻坂46 / 日向坂46~ 開催" },
      { d: "260126", n: '16th シングル "クリフハンガー" 発売' },
      { d: "260129", n: "\\18; 卒業セレモニー 開催" }
    ];
    const CSS_BIOGRAPHY = `
  .header { width: 100px; }
  .fixed {
    width: 12rem;
    position: fixed;
    top: 60px;
    left: 40px;
    z-index: 1;
    font-size:larger;
  }
  .l-section { margin-top: -400px; }

  .l-contents {
    height: ${SVG_HEIGHT + 50}px;
  }
  .c-page-title {
    margin-left: 300px;
  }
  .p-biography__logo {
    position: absolute;
    top: -210px;
    left: 100px;
  }
  .p-biography__text {
    margin-left: 550px;
  }
  div#tl_container {
    position: absolute;
    top: -180px;
    right: 350px;
    height: ${SVG_HEIGHT}px;
    width: ${SVG_WIDTH}px;
  }
  svg#timeline {
    display: block;
    margin: 0 auto;

  }
  .year-label {
    font-family: "Libre Caslon Text", serif;
    font-size: 18px;
    font-weight: 800;
    fill: ${HINATA_BLUE};
  }
  .event-date {
    font-family: "Libre Caslon Text", serif;
    font-size: 12px;
    fill: #7F1083;
    font-weight: 800;
  }
  .event-text {
    fill: #7F1083;
    font-weight: bold;
  }
  .event-pentagon {
    transition: opacity 0.2s;
    cursor: default;
  }
  .event-pentagon:hover {
    opacity: 0.8;
  }`;
    document.head.insertAdjacentHTML("afterbegin", `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&display=swap&display=swap" rel="stylesheet">
	`);
    doProcess(() => {
      const CSS_SLIM_DOWN_MENUBAR = `
		.l-header { height: 55px; }
		.p-header-wrap.is-fixed .p-header { height: 30px; }
		.p-header.p-header__in .c-header__logo {
			top: 5px;
			width: 155px;
			left: -20px;
		}
		.p-header-wrap.is-fixed .p-header .c-header__logo {
		  left: 40px;
		}
		.p-header.p-header__in {
			height: 60px;
			position: relative;
		}
		nav.p-menu.p-menu--pc {
			position: absolute;
			top: 50%;
			transform: translateY(-50%);
		}`;
      const pageType = getPageType();
      let styleText = `
		h1, h2, h3, h4, h5, h6 {font-weight: 950; }
		.js-select { cursor: pointer; }
		.c-select-box { color: #0fb84a; }
		.c-button-grad { z-index: 100; }
		.l-contents { padding-bottom: 60px; }`;
      if (isMobile()) {
        if (pageType == "formation") {
          document.appendStyle(
            "formation",
            styleText + `
				.formation_image li:hover {
					height: 60px;
					margin: -10px 0 0 0px;
					width: 60px;

					i {
						margin: -6px 0 0 -30px;
						font-size: larger;
        			}
	  			}`
          );
        }
        return;
      }
      document.appendStyle("slim-menu", styleText + CSS_SLIM_DOWN_MENUBAR);
      setLinkFontColor(".p-menu__item a");
      switch (pageType) {
        case "news":
        case "media":
          memberSelectShim();
          doProcessList();
          break;
        case "detail":
          break;
        case "search":
          doProcessMember();
          break;
        case "artist":
          doProcessMemberDetail();
          break;
        case "artist/00":
          doProcessDiscography();
          break;
        case "greeting":
          doProcessGreeting();
          break;
        case "contents":
          break;
        case "formation":
          doProcessFormation();
          break;
        case "diary/member":
          doProcessBlog("blog_top");
          break;
        case "diary/member/list":
          doProcessBlog("blog_list");
          break;
        case "diary/detail":
          doProcessBlog("blog_detail");
          break;
        case "video":
        case "aimashou":
          break;
        case "event":
          doProcessEvent();
          break;
        case "biography":
          doProcessBiography();
          break;
        case "about_fanclub":
          doProcessFc();
          break;
      }
    });
  })();

})();
