// ==UserScript==
// @name:en        hinatazaka46-lookandfeel
// @name:ja        日向坂46 ルックアンドフィール
// @namespace   https://greasyfork.org/ja/users/1328592-naoqv
// @description:en  Change the look & feel of the Hinatazaka46 website.
// @description:ja  日向坂46 ルックアンドフィール
// @version     0.58
// @require     https://update.greasyfork.org/scripts/544532/1635042/hinatazaka46-data.js
// @icon        https://cdn.hinatazaka46.com/files/14/hinata/img/favicons/favicon-32x32.png
// @compatible  chrome
// @compatible  firefox
// @grant       none
// @license     MIT
// ==/UserScript==
"use strict";

const PAGE_TYPE_ERROR_MSG = "Processing of out-of-scope pages. Check the settings @match.";

const pageTypeMatch = (x = location.href) => (x).match(/(news|media|detail|search|formation|diary\/member\/list|diary\/member|diary\/detail|artist\/00|artist|greeting|biography|video|contents|discography|aimashou|event|about_fanclub)/);

const getPageType = (x = location.href) => (x).match(/contents_list/) ? "contents"
  	: (y => y ? y[0] : "other")(pageTypeMatch(x));

/*
 * クライアント端末のモバイル判定
 */
const isMobile = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  const mobileRegex = /Android|iPhone|iPad|iPod|BlackBerry|Windows Phone|Opera Mini|IEMobile/i;

  return mobileRegex.test(userAgent) || window.matchMedia("only screen and (max-width: 768px)").matches;
}

/*
 * inlineスタイルを適用
 * @param {string} styleText - スタイル定義
 */
document.appendStyle = (styleText) => {
  const styleElem = document.createElement("style");
  styleElem.setAttribute("rel", "stylesheet");
  styleElem.textContent = styleText;
  document.head.appendChild(styleElem);
};

/*
 * スクロールダウン時にメニューバー細める
 */
const slimDownMenuBar = () => {
  const styleElem = document.createElement("style");
  styleElem.setAttribute("rel", "stylesheet");
  const styleText = `.l-header { height: 55px; }
  .p-header-wrap.is-fixed .p-header { height: 30px; }
  .c-header__logo {
    top: 5px;
    width: 155px;
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
  styleElem.textContent = styleText;
  document.head.appendChild(styleElem);
};

const COLOR_MODE = {DEFAULT_COLOR: "0", DARK_COLOR: "1"};

/**
 * カラーモードを取得
 * @returns {string} カラーモード
 */
const getColorMode = () => {
  let currentMode = CookieUtils.getCookie('color_mode');

  if (currentMode !== "0" && currentMode !== "1") {
    currentMode = COLOR_MODE.DEFAULT_COLOR;
  }
  return currentMode;
}

/**
 * カラーモードを設定
 * @param {string} mode - カラーモード
 */
const setColorMode = (mode) => {
  if (mode !== COLOR_MODE.DEFAULT_COLOR && mode !== COLOR_MODE.DARK_COLOR) {
    throw new Error("Illegal parameter error. [HinatazakaSigthtStyleUtils#setColorMode]");
  }
  CookieUtils.setCookie('color_mode', mode);
};

/**
 * カラーモードを切り替える
 * @returns {string} 切り替え後のカラーモード
 */
const toggleColorMode = () => {

  const mode = ((parseInt(getColorMode()) + 1) % 2).toString();
  setColorMode(mode);

  return mode;
};

const GREEN_BUTTON = "linear-gradient(to right, #50a0f0 0%, #32edae 100%)";

const DEFAULT_BLUE = '#8cc8d1';

const DEFAULT_FONT_CL = "#8babab";
const DEFAULT_TITLE_FONT_CL ="#abbaba";

const DARK_FONT_CL   = "#eeeeee";
const DARK_BG_CL     = "#202040";
const DARK_MENU_CL   = "#404070";
const DARK_SVG_CL    = "#eeeeee";
const DARK_IMG_BG_CL = "#eeeeee";

const HOVER_BG_UPPER_CL = "#ecf0f9";
const HOVER_BG_LOWER_CL = "#eff4fd";
const HOVER_BORDER_CL   = "#5bbee4";

const DARK_HOVER_BG_UPPER_CL = "#20cccc";
const DARK_HOVER_BG_LOWER_CL = "#202050";
const DARK_PAST_BG_CL = "#303040";

const DARK_TODAY_UPPER_CL  = "#30aaaa";
const DARK_TODAY_LOWER_CL  = "#303050";
const DARK_HOVER_BORDER_CL = "#79fcfc";

const DARK_STRONG_FONT_CL = 'crimson';
const DARK_STRONG_BG_CL   = 'aquamarine';
const DARK_FC_TEXT_CL     = 'rgb(99, 103, 103)';

// ライトモード/ダークモード 切替で色を変更する要素群のキー
const KEY = {
  BACKGROUND  : "backGround",
  MENUBAR     : "manuBar",
  BREADCRUMB  : "breadcrumb",
  LIST        : "list",
  ARTICLE     : "article",
  PASTDAY     : "pastday",
  TODAY       : "today",
  MEMBER_PROP : "memberProp",
  SVG_PATH    : "svgPath",
  BLOG        : "blog",
  STRONG      : "strong",
  DISCO       : "disco",
  AFTER       : "after",
  BIOGRAPHY   : "biography",
  FC_LOGO     : "fc_logo",
  FC_TEXT     : "fc_text"
}

const SELECTOR_DIC = {
  [KEY.BACKGROUND] : '.pages, .module-modal.js-member-filter .mordal-box, .l-container, .schedule__list-future',
  [KEY.MENUBAR]    : '.l-header, .p-header-wrap, .p-header-wrap.is-fixed',
  [KEY.BREADCRUMB] : '.p-page-breadcrumb__list, .c-page-breadcrumb__item:last-child span',
  [KEY.LIST]       : '.l-container, .p-news__list ',
  [KEY.ARTICLE]    : '.c-blog-main__title, .c-blog-main__date, .c-article__title, .p-article__text, .p-article__text span, .c-blog-article__text div *, .c-blog-article__text p span, .tbcms_program-detail__inner p, .c-tv-backnumber-kiji-time, .c-tv-backnumber-kiji-text',
  [KEY.PASTDAY]    : '.schedule__list-pastday',
  [KEY.TODAY]      : '.schedule__list-today',
  [KEY.MEMBER_PROP]: '.c-member__name, .c-member__name--info, .c-member__info-td__text, .c-blog-member__name, .c-blog-member__info-td__text, .c-mamber__category_title span, .c-section-title--member-name',
  [KEY.SVG_PATH]   : '.c-member__info-td__text a svg path',
  [KEY.BLOG]       : '.l-maincontents--blog, .p-blog-entry__group, .p-blog-entry__list, .s-blog__index, .p-blog-group, .p-blog-entry__list',
  [KEY.STRONG]     : '.p-article__text strong span, .p-article__text span strong',
  [KEY.DISCO]      : '.formation_image li i, .c-page-breadcrumb__item, .c-disco__title, .c-disco__date, .c-video-detail__title, .formation_image li i',
  [KEY.AFTER]      : '.l-other-contents--blog',
  [KEY.BIOGRAPHY]  : '.p-biography__text',
  [KEY.FC_LOGO]    : '.fc-logo',
  [KEY.FC_TEXT]    : '.fc-contents .text'
};

const CSS_DIC = {
  [KEY.BACKGROUND]  :['background-color'],
  [KEY.MENUBAR]     :['background-color'],
  [KEY.BREADCRUMB]  :['color'],
  [KEY.LIST]        :['color'],
  [KEY.ARTICLE]     :['color'],
  [KEY.PASTDAY]     :['background-color'],
  [KEY.TODAY]       :['background'],
  [KEY.MEMBER_PROP] :['color'],
  [KEY.SVG_PATH]    :['fill'],
  [KEY.BLOG]        :['color', 'background-color'],
  [KEY.STRONG]      :['color', 'background-color'],
  [KEY.DISCO]       :['color'],
  [KEY.AFTER]       :['color', '--bg-color'],
  [KEY.BIOGRAPHY]   :['color'],
  [KEY.FC_LOGO]     :['background-color'],
  [KEY.FC_TEXT]     :['color']
};

const DEFAULT_COLOR_CONFIG = {};

const DARK_COLOR_CONFIG = {
  [KEY.BACKGROUND]  : {"background-color": DARK_BG_CL},
  [KEY.MENUBAR]     : {"background-color": DARK_MENU_CL},
  [KEY.BREADCRUMB]  : {"color": DARK_FONT_CL},
  [KEY.LIST]        : {"color": DARK_FONT_CL},
  [KEY.ARTICLE]     : {"color": DARK_FONT_CL},
  [KEY.PASTDAY]     : {"background-color": DARK_PAST_BG_CL},
  [KEY.TODAY]       : {"background": `linear-gradient(${DARK_TODAY_UPPER_CL}, 10%, ${DARK_TODAY_LOWER_CL})`},
  [KEY.MEMBER_PROP] : {"color": DARK_FONT_CL},
  [KEY.SVG_PATH]    : {"fill": DARK_SVG_CL},
  [KEY.BLOG]        : {"color": DARK_FONT_CL, "background-color": DARK_BG_CL},
  [KEY.STRONG]      : {"color": DARK_STRONG_FONT_CL, "background-color": DARK_STRONG_BG_CL},
  [KEY.DISCO]       : {"color": DARK_FONT_CL},
  [KEY.AFTER]       : {"color": DARK_FONT_CL, "--bg-color": DARK_BG_CL},
  [KEY.BIOGRAPHY]   : {"color": DARK_FONT_CL},
  [KEY.FC_LOGO]     : {"background-color": DARK_IMG_BG_CL},
  [KEY.FC_TEXT]     : {"color": DARK_FC_TEXT_CL}
};

/**
 * cssプロパティの値を取得
 * @param {string} selector - cssセレクタ
 * @param {string} cssProperty - cssプロパティ名
 * @return {string} cssプロパティの値
 */
const getSelectorStyle = (selector, cssProperty) => 
  (((element, cssProperty) => (element != null) ? getComputedStyle(element).getPropertyValue(cssProperty) : 'rgb(0, 0, 0)')(document.querySelector(selector), cssProperty));

/**
 * 文字列に含まれる最初の','(カンマ)より前の部分文字列を返す
 * @param {string} str - 対象文字列
 */
const getBeforeFirstComma = (str) => {
    const index = str.indexOf(",");
    return index !== -1 ? str.slice(0, index) : str;
};

const COLOR_CONFIGS = [];

/**
 * デフォルトの色設定を解析
 */
const analyzeDefaultColor = () => {

  Array.prototype.forEach.call(Object.values(KEY), (k) => {
    DEFAULT_COLOR_CONFIG[k] = {};
    Array.prototype.forEach.call(CSS_DIC[k], (c) => {
      DEFAULT_COLOR_CONFIG[k][c] = getSelectorStyle(getBeforeFirstComma(SELECTOR_DIC[k]), c);
    });
  });

  COLOR_CONFIGS.push(DEFAULT_COLOR_CONFIG, DARK_COLOR_CONFIG);
};

/**
 * メニュー等のリンクのフォント色を設定
 * @param {string} selector - セレクタ
 * @param {string} originColor - mousout時に設定するオリジナルのフォント色
 */
const setLinkFontColor = (selector, originColor = DEFAULT_BLUE) => {

  Array.prototype.forEach.call(document.querySelectorAll(selector), (x) => {

    x.style.color = originColor;

    x.addEventListener('mouseover', () => {
        x.style.color = (getColorMode() === COLOR_MODE.DARK_COLOR) ? '#e0ffff' : '#5d5d5d';
    });

    x.addEventListener('mouseout', () => {
      x.style.color = originColor;
    });
  });
};

/**
 * hover時フォント設定
 * @param {string} itemSelector - hover対象セレクタ
 * @param {string} titleSelector - タイトルセレクタ
 * @param {string} datetimeSelector - 日時セレクタ
 */
const setHoveredFontColor = (itemSelector, titleSelector, datetimeSelector) => {
  Array.prototype.forEach.call(document.querySelectorAll(itemSelector), (x) => {
    x.addEventListener('mouseover', () => {

      if (getColorMode() === COLOR_MODE.DARK_COLOR) {

        x.querySelector(titleSelector).style.color = DARK_FONT_CL;
        const datetime = x.querySelector(datetimeSelector);
        if (datetime) { datetime.style.color = DARK_FONT_CL;}
      } else {

        x.querySelector(titleSelector).style.color = DEFAULT_FONT_CL;
        const datetime = x.querySelector(datetimeSelector);
        if (datetime) { datetime.style.color = DEFAULT_FONT_CL;}
      }
    });
  });

  Array.prototype.forEach.call(document.querySelectorAll(itemSelector), (x) => {
    x.addEventListener('mouseout', () => {

      x.querySelector(titleSelector).style.color = DEFAULT_TITLE_FONT_CL;
      const datetime = x.querySelector(datetimeSelector);
      if (datetime) { datetime.style.color = DEFAULT_FONT_CL;}
    });
  });
};

/**
 *
 * @param {string} itemSelector
 * @param {string} textSelector
 */
const setHoveredFontAndBgColor = (itemSelector, textSelector) => {
  Array.prototype.forEach.call(document.querySelectorAll(itemSelector), (x) => {
    x.addEventListener('mouseover', () => {

      if (getColorMode() === COLOR_MODE.DARK_COLOR) {
        x.style.background = `linear-gradient(${DARK_HOVER_BG_UPPER_CL}, 20%, ${DARK_HOVER_BG_LOWER_CL})`;
        x.style.outline = `1px solid ${DARK_HOVER_BORDER_CL}`

        x.style.color = DARK_FONT_CL;
        x.children[0].style.color = DARK_FONT_CL;
        const text = x.querySelector(textSelector);
        if (text) { text.style.color = DARK_FONT_CL;}
      } else {
        x.style.background = `linear-gradient(${HOVER_BG_UPPER_CL}, 10%, ${HOVER_BG_LOWER_CL})`;
        x.style.outline = `0.5px solid ${HOVER_BORDER_CL}`

        x.style.color = DEFAULT_FONT_CL;
        x.children[0].style.color = DEFAULT_FONT_CL;
        const text = x.querySelector(textSelector);
        if (text) { text.style.color = DEFAULT_FONT_CL}
      }
    });
  });

  Array.prototype.forEach.call(document.querySelectorAll(itemSelector), (x) => {
    x.addEventListener('mouseout', () => {
      x.style.background = "transparent";
      x.style.outline = "1px solid transparent";
      x.style.color = DEFAULT_FONT_CL;
      x.children[0].style.color = DEFAULT_FONT_CL;
      const text = x.querySelector(textSelector);
      if (text) { text.style.color = DEFAULT_FONT_CL;}
    });
  });
};

/**
 * ページに対応した色設定を行う
 * @param {string} pageType - ページ種類
 * @param {string} colorMode - カラーモード
 */
const setColor = (pageType, colorMode) => {

  const configIndex = parseInt(colorMode);

  Array.prototype.forEach.call(Object.values(KEY), (k) => {
    Array.prototype.forEach.call(document.querySelectorAll(SELECTOR_DIC[k]), (e) => {
      Array.prototype.forEach.call(CSS_DIC[k], (c) => {
        e.style.setProperty(c, COLOR_CONFIGS[configIndex][k][c]);
      });
    });
  });

  // パンくずリスト
  Array.prototype.forEach.call(document.querySelectorAll('.p-page-breadcrumb__list .c-page-breadcrumb__item:not(:last-child)'), (x) => {
    x.addEventListener('mouseover', () => {
      x.children[0].style.color = (getColorMode() === COLOR_MODE.DARK_COLOR) ? "lightcyan" : '#5d5d5d';
    });

    x.addEventListener('mouseout', () => {
      x.children[0].style.color = (getColorMode() === COLOR_MODE.DARK_COLOR) ? "lightcyan" : '#a9a9a9';
    });
  });

  switch (pageType) {
    case "news":
    case "media":
      setLinkFontColor('.cale_prev a, .cale_month a, .cale_next a, .cale_table tbody tr td a');
      setHoveredFontAndBgColor('.p-news__item, .p-other__item, .p-schedule__item', 'time');
      break;
    case "artist":
      setHoveredFontAndBgColor('.p-news__item', '.c-news__date');
      break;
    case "diary/member":
      shortenYearWithDay('.c-blog-main__date, .c-blog-top__date');
      setHoveredFontColor('.p-blog-top__item', '.c-blog-top__title', '.c-blog-top__date');
      break;
    case "diary/detail":
    case "diary/member/list":
      setLinkFontColor('.cale_prev a, .cale_month a, .cale_next a, .cale_table tbody tr td a');
      setHoveredFontAndBgColor('.p-blog-entry__item', '.c-blog-entry__title');
      setHoveredFontAndBgColor('.d-article', '.s-article-title');
      //setHoveredFontAndBgColor('.c-pager__item__text', 'time');
      break;

    // 動画
    case "video":
    case "contents":

      // 動画タイトル
      Array.prototype.forEach.call(document.querySelectorAll('.p-video__item.p-video__item--medium'), (x) => {

        x.addEventListener('mouseover', () => {
          x.children[1].children[0].style.color = (getColorMode() === COLOR_MODE.DARK_COLOR) ? "lightcyan" : '#5d5d5d';
        });

        x.addEventListener('mouseout', () => {
          x.children[1].children[0].style.color = '#a9a9a9';
        });
      });
      break;
    case "event":
      Array.prototype.forEach.call(document.getElementsByClassName('p-shakehands__item'), (x) => {
        x.addEventListener('mouseover', () => {

          if (getColorMode() === COLOR_MODE.DARK_COLOR) {
            x.children[1].children[1].style.color = "lightcyan";
            x.children[1].children[2].style.color = "lightcyan";
          } else {
            x.children[1].children[1].style.color = '#5d5d5d';
            x.children[1].children[2].style.color = '#5d5d5d';
          }
        });

        x.addEventListener('mouseout', () => {

          x.children[1].children[1].style.color = DEFAULT_FONT_CL;
          x.children[1].children[2].style.color = DEFAULT_FONT_CL;
        });
      });

      Array.prototype.forEach.call(document.getElementsByClassName('p-other__item'), (x) => {
         x.addEventListener('mouseover', () => {
          x.children[0].style.color = (getColorMode() === COLOR_MODE.DARK_COLOR) ? "lightcyan" : '#5d5d5d';
        });

        x.addEventListener('mouseout', () => {

          x.children[0].style.color = DEFAULT_FONT_CL;
        });
      });
      Array.prototype.forEach.call(document.querySelectorAll('.c-pager__item--count a'), (x) => {
         x.addEventListener('mouseover', () => {
            x.style.color = (getColorMode() === COLOR_MODE.DARK_COLOR) ? "lightcyan" : '#5d5d5d';
        });

        x.addEventListener('mouseout', () => {
          x.style.color = DEFAULT_FONT_CL;
        });
      });
      break;
    default:
      ;
  }
};


const leftPosition = (colorMode) => (colorMode === COLOR_MODE.DEFAULT_COLOR) ? "-3px" : "36px";

/**
 * カラーモードトグルのスイッチボタンを生成
 * @param {COLOR_MODE} colorMode
 */
const createSwitchButton = (colorMode) => {

  const switchButton = document.createElement('div');
  switchButton.classList.add("switch_button");
  const left = leftPosition(colorMode);

  switchButton.style.cssText
    = `left: ${left};
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

/**
 * カラーモードのトグルスイッチを初期化
 * @param {string} colorMode - "0": ライトモード、 "1": ダークモード
 */
const initializeColorToggle = (colorMode) => {

  const menuList = document.querySelector('.p-menu__list');

  if (menuList && !document.querySelector('.color_toggle')) {
    const colorToggle = document.createElement('div');
    colorToggle.classList.add("color_toggle");
    menuList.appendChild(colorToggle);

    colorToggle.style.cssText
      = `margin-top: 2px;
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
      const colorMode = toggleColorMode();
      switchButton.style.left = leftPosition(colorMode);
      setColor(getPageType(), colorMode);
    });

    return true;
  } else {

    return false;
  }
};

/**
 * ニュース / スケジュール
 */
const doProcessList = () => {

  const isDetail = ((location.href).match(new RegExp('\/detail\/')) != null);

  if (isDetail) {
    return;
  }

  const PAGE_TYPE_ERROR_MSG = "Processing of out-of-scope pages. Check the settings @match.";

  const pageType = (location.href).match(new RegExp('\/(media|news)\/'))[1];

  if (! pageType) {
    throw new Error(PAGE_TYPE_ERROR_MSG);
  }

  const SELECTORS = ((x) => {
      switch (x) {
        case "news":
          return {"pArrow": ".p-news__pager-arrow",
                "cArrowLeft": ".c-news_pager-arrow--left",
                "cArrowRight" : ".c-news_pager-arrow--right",
                "cPageMonth": ".c-news__page_month",
                "cPageYear": ".c-news__page_year",
                "lMainContentsUl": ".l-maincontents--news ul",
                "pDate": ".p-news__page_date",
                "lSubContents": ".l-sub-contents--news"};
        case "media":
          return {"pArrow": ".p-schedule__pager-arrow",
                "cArrowLeft": ".c-schedule_pager-arrow--left",
                "cArrowRight" : ".c-schedule_pager-arrow--right",
                "cPageMonth": ".c-schedule__page_month",
                "cPageYear": ".c-schedule__page_year",
                "lMainContentsUl": ".l-maincontents--schedule ul",
                "pDate": ".p-schedule__page_date",
                "lSubContents": ".l-sub-contents--schedule"};
        default:
            throw new Error(PAGE_TYPE_ERROR_MSG);
      }
  })(pageType);

  const pageYear = ((y) => {return (y === null || y === undefined) ? null : y.innerText;})(document.querySelector(SELECTORS.cPageYear));

  const now = new Date();

  // "年"のみの表示ではない場合
  if (pageYear !== "年") {

    const daysOfWeek = ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'];
    const year = parseInt(pageYear.match(/20[2-9][0-9]/)[0]);
    const month = parseInt(document.querySelector(SELECTORS.cPageMonth).innerText);
    // 月初
    const first = new Date(year, month - 1, 1);
    // 月末
    const end = new Date(year, month, 0);
    // 月末の日
    const endDate = end.getDate();
    // 前月末
    const endPrevMonth = new Date(year, month - 1, 0);
    // 前月末の日
    const endDatePrevMonth = endPrevMonth.getDate();
    // 月初の曜日
    const firstDayOfWeek = first.getDay();

    let numOfDay = 1;

    const pageMonth = ((m) => {return m !== null ? m.innerText : "";})(document.querySelector(SELECTORS.cPageMonth));

    const leftArrowHref = document.querySelector(SELECTORS.cArrowLeft).children[0].href;
    const rightArrowHref = document.querySelector(SELECTORS.cArrowRight).children[0].href;

    let calendarHtml = `
      <table class="cale_table" style="width: 210px; margin: -130px 0 20px -50px;">
        <tr><td></td><td class="cale_prev"><a id="cale_prev" href="${leftArrowHref}">＜</a></td>
          <td class="cale_month" colspan="3">${pageYear}&#160;${pageMonth}</td><td class="cale_next"><a href="${rightArrowHref}">＞</a></td><td></td></tr>
        <tr>`;

    for (let i = 0; i < daysOfWeek.length; i++) {
      calendarHtml += `<td class="cale_wek${i}">${daysOfWeek[i]}</td>`;
    }

    calendarHtml += '</tr>';

    for (let w = 0; w < 6; w++) {
      calendarHtml += '<tr>'

      for (let d = 0; d < 7; d++) {
        if (w == 0 && d < firstDayOfWeek) {
          // 前月
          let num = endDatePrevMonth - firstDayOfWeek + d + 1;
          calendarHtml += `<td class="cale_day${d} is-disabled">${num}</td>`;
        } else if (numOfDay > endDate) {
          // 次月
          let num = numOfDay - endDate;
          calendarHtml += `<td class="cale_day${d} is-disabled">${num}</td>`;
          numOfDay++;
          w = 99; // カレンダーの最下端が次月の日付のみになるのを防止
        } else {
          calendarHtml += `<td class="cale_day${d}">${numOfDay}</td>`;
          numOfDay++;
        }
      }
      calendarHtml += '</tr>'
    }

    calendarHtml += '</table>';

    document.querySelector(SELECTORS.lSubContents).insertAdjacentHTML('afterbegin', calendarHtml);
  }

  // 選択カテゴリ（ALL / 握手会・・・）
  const categorySelectorSuffix
  = ((c) => {
    let value = "";
    if (c.length == 0) {
      value = "all";
    } else {
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
  })(document.getElementsByName("cd"));

  const categoryElem = document.querySelector('.c-button-category.category_' + categorySelectorSuffix);
  const categoryStyles = window.getComputedStyle(categoryElem);
  const categoryParent = categoryElem.parentElement;
  categoryParent.style.marginLeft = "-5px";
  categoryParent.style.paddingLeft = "4.5px";
  categoryParent.style.marginRight = "40px";
  categoryElem.style.color = `rgb(from ${categoryStyles.color} calc(r - 64) calc(g - 64) calc(b - 64))`;
  categoryParent.style.backgroundColor = `rgb(from ${categoryStyles.color} calc(r + 64) calc(g + 64) calc(b + 64))`;
  categoryParent.style.border = `solid 0.5px ${categoryElem.style.color}`;

  // 詳細ページの場合 処理を終了
  if (isDetail) {
    return;
  }

  /*
   * フルブラウザ上ではNEWS/スケジュールが多い月は見づらいため
   * 自動スクロール、表示色を追加設定
   */

  const PAGER_MARGIN_TOP = 20;
  const PASTDAY_BG_CL = "#ededf0";
  const TODAY_DATE_CL = "orange";
  const TODAY_BG_CL = "#fafeff";
  const TODAY_BORDER_CL_UPPER = "#d7eeff";
  const TODAY_BORDER_CL_LOWER = "#5bbee4";

  document.appendStyle(`
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
      .module-modal.js-member-filter .mordal-box .member-box ul li p.check input[type=checkbox]:checked+label:before {
        background-color:#6bcaea;
        border:1px solid #6bcaea;
      }`);

  // リスト上方 "xxxx年 yy月" 行
  const pDate = document.querySelector(SELECTORS.pDate);

  // "xxxx年" ではなく "年"のみの場合
  if (pageYear === "年") {
    const cPageYear = document.querySelector(SELECTORS.cPageYear);

    cPageYear.innerText = String(now.getFullYear()) + "年";
    cPageYear.style.fontSize = "4.8rem";
    document.querySelector(SELECTORS.cPageMonth).remove();
    document.querySelector(SELECTORS.pArrow).remove();
  }

  pDate.style.marginBottom = "5px";

  // ニュース/スケジュール リスト
  const lMainContentsUl = document.querySelector(SELECTORS.lMainContentsUl);

  const lMainContentsUlTop = lMainContentsUl.getBoundingClientRect().top;

  const pDateHeight = pDate.offsetHeight;

  // リスト下方 前月/次月ページャ
  const pPager = document.querySelector(".p-pager");

  // "xxxx年" ではなく "年"のみの場合
  if (pageYear === "年") {
    pPager.innerText = "";

    pPager.style.marginTop = "0px";
  } else {

    pPager.style.marginTop = `${PAGER_MARGIN_TOP}px`;
  }

  const pPagerHeight = PAGER_MARGIN_TOP + pPager.offsetHeight;
  const lMainContentsUlHeight = document.documentElement.clientHeight - pDateHeight - pPagerHeight;

  // スクロール表示
  lMainContentsUl.setAttribute("style", `height:${lMainContentsUlHeight}px; overflow: scroll; border: solid 1px #32a1ce;`);

  const scrollTop = lMainContentsUlTop - pDateHeight;

  // スクロール位置リセット　〜「再読み込み」ボタン押下時の位置ズレ対応
  scrollTo(0, 0);

  // リスト位置までページ内で縦スクロール
  scrollTo({
    top: scrollTop,
    behavior: "smooth"
  });

  const nowYearMonth = String(now.getFullYear()) + String(now.getMonth() + 1).padStart( 2, '0');
  const dispYear = document.querySelector(SELECTORS.cPageYear);
  const dispMonth = document.querySelector(SELECTORS.cPageMonth);

  // 表示対象の年月（ex.202404）を取得。設定がなければ当月
  const dispYearMonth
  = ((y, m) => {return (y == null || m == null) ? nowYearMonth : y.innerText.replace('年', '') + m.innerText.replace('月', '')})(dispYear, dispMonth);

  // NEWS/スケジュールが当月以前の月の場合
  if (dispYearMonth < nowYearMonth) {

    lMainContentsUl.classList.add('schedule__list-pastday');
  }

  const createAnchor = (y, d) => `<a href="javascript:document.querySelector('${SELECTORS.lMainContentsUl}').scroll({top:${y}, behavior: 'smooth'});">${d}</a>`;

  if (pageType === "news") {
    doProcessNews(lMainContentsUlTop, createAnchor);
  } else {
    doProcessMedia(lMainContentsUl, lMainContentsUlTop, dispYearMonth, now, nowYearMonth, createAnchor);
  }
};

/**
 * 枠にペンライトカラーを設定
 * @param {string} color_01 - penlightColor 1
 * @param {string} color_02 - penlightColor 2
 * @param {number} thickness
 * @param {number} intensity
 * @param {number} base
 * @param {number} white
 */
HTMLElement.prototype.setPenlightColor = function (color_01, color_02, thickness, intensity, base = 2, white = 2) {

  this.style.borderLeftColor = "#" + color_01;
  this.style.borderTopColor = "#" + color_01;
  this.style.borderRightColor = "#" + color_02;
  this.style.borderBottomColor = "#" + color_02;

  this.style.boxShadow = `
    -${thickness}px 0               ${thickness}px -4px #${color_01},
    0               -${thickness}px ${thickness}px -4px #${color_01},
    ${thickness}px  0               ${thickness}px -4px #${color_02},
    0               ${thickness}px  ${thickness}px -4px #${color_02},

    inset 0    ${white}px  ${white * 2}px white,
    inset 2px  0           ${white * 2}px white,
    inset 0    -${white}px ${white * 2}px white,
    inset -2px 0           ${white * 2}px white,

    inset 0               ${base * 2}px  ${base * 2}px #${color_01},
    inset ${base * 2}px   0              ${base * 2}px #${color_01},
    inset 0               -${base * 2}px ${base * 2}px #${color_02},
    inset -${base * 2}px  0              ${base * 2}px #${color_02},

    inset 0                 ${thickness}px  ${base * 2}px rgb(from #${color_01} calc(r + ${intensity}) calc(g + ${intensity}) calc(b + ${intensity})),
    inset ${thickness}px    ${base * 2}px   4px           rgb(from #${color_01} calc(r + ${intensity}) calc(g + ${intensity}) calc(b + ${intensity})),
    inset 0                 -${thickness}px ${base * 2}px rgb(from #${color_02} calc(r + ${intensity}) calc(g + ${intensity}) calc(b + ${intensity})),
    inset -${thickness}px   0               ${base * 2}px rgb(from #${color_02} calc(r + ${intensity}) calc(g + ${intensity}) calc(b + ${intensity})),

    -${white * 2}px 0              ${white * 2}px -${white * 2}px white,
    0              -${white * 2}px ${white * 2}px -${white * 2}px white,
    ${white * 2}px  0              ${white * 2}px -${white * 2}px white,
    0              ${white * 2}px  ${white * 2}px -${white * 2}px white,

    -${base * 2}px 0px            ${base * 2}px -${base * 2}px rgb(from #${color_01} calc(r + ${intensity}) calc(g + ${intensity}) calc(b + ${intensity})),
    0              -${base * 2}px ${base * 2}px -${base * 2}px rgb(from #${color_01} calc(r + ${intensity}) calc(g + ${intensity}) calc(b + ${intensity})),
    ${base * 2}px  0px            ${base * 2}px -${base * 2}px rgb(from #${color_02} calc(r + ${intensity}) calc(g + ${intensity}) calc(b + ${intensity})),
    0              ${base * 2}px  ${base * 2}px -${base * 2}px rgb(from #${color_02} calc(r + ${intensity}) calc(g + ${intensity}) calc(b + ${intensity}))
    `;
};

/**
 * ExMemの期を生成
 * @param {number} gen - 期
 */
const createGeneration = (gen) => {
  const fragment = document.createDocumentFragment();
  const sub = document.createElement('div');
  sub.classList.add('p-page-head-sub');
  const subtitle = document.createElement('h2');
  subtitle.classList.add('c-page-subtitle', 'en');

  switch(gen) {
    case "1":
      subtitle.append(document.createTextNode('一期生'));
      break;
    case "2":
      subtitle.append(document.createTextNode('二期生'));
      break;
    case "3":
      subtitle.append(document.createTextNode('三期生'));
      break;
    case "4":
      subtitle.append(document.createTextNode('四期生'));
      break;
    case "5":
      subtitle.append(document.createTextNode('五期生'));
      break;
  }

  sub.appendChild(subtitle);
  fragment.append(sub);

  const lcontents = document.createElement('div');
  lcontents.classList.add('l-contents');
  const lmaincontents = document.createElement('div');
  lmaincontents.classList.add('l-maincontents');
  const pmemberlist = document.createElement('div');
  pmemberlist.classList.add('p-member__list');

  lmaincontents.appendChild(pmemberlist);
  lcontents.appendChild(lmaincontents);
  fragment.append(lcontents);

  return fragment;
};

const IMG_PREFIX = "https://cdn.hinatazaka46.com/images/14/";
const IMG_SUFFIX = "/800_800_102400.jpg";//1000_1000_102400.jpg

/**
 * アンカーに名前(漢字・かな)のテキストノードを追加
 * @param {Element} anchor
 * @param {[key: string]: string} nameInfo - 名前情報
 * @param {string} nameInfo.name - 名前
 * @param {string} nameInfo.kana - カナ
 */
const appendNmKn = (anchor, nameInfo) => {

  if (anchor.tagName != 'A') {
    console.error("this anchor is wrong. tagName: '",  anchor.tagName, "'");
    return;
  }

  const memberName = nameInfo.name;
  const memberKana = nameInfo.kana;  
  
  const name = document.createElement('div');
  name.classList.add('c-member__name');
  name.append(document.createTextNode(memberName));
  anchor.appendChild(name);

  const kana = document.createElement('div');
  kana.classList.add('c-member__kana');
  kana.append(document.createTextNode(memberKana));
  anchor.appendChild(kana);
};

/**
 * @const {[key:string]:string}
 */
const DATE_OPTIONS = {
  year: 'numeric',
  month: 'short',
  day: 'numeric'
};

/**
 * 名前と誕生日を追加
 *
 * @param {Element} anchor
 * @param {[key: string]: striing} birthInfo - 誕生日情報
 * @param {string} birthInfo.name - 名前
 * @param {date} birthInfo.birthday - 誕生日
 */
const appendBd = (anchor, birthInfo) => {

  if (anchor.tagName != 'A') {
    console.error("this anchor is wrong. tagName: '",  anchor.tagName, "'");
    return;
  }
  const memberName = birthInfo.name;

  const nameElement = document.createElement('div');
  nameElement.classList.add('c-member__name');
  nameElement.append(document.createTextNode(memberName));
  anchor.appendChild(nameElement);

  const birthElement = document.createElement('div');
  birthElement.classList.add('c-member__birth');

  birthElement.append(document.createTextNode(birthInfo.birth.toLocaleDateString('ja-JP', DATE_OPTIONS)));
  anchor.appendChild(birthElement);
};

/**
 * メンバー要素を生成
 * @param {number} number
 * @param {string} imgUrl
 * @param {string} linkUrl
 * @param {function} appendElemFunc
 * @param {Object[]} memberData
 * @param {string} memberData.memberName
 * @param {date} memberData.birth
 */
const createMemberElement = (number, imgUrl, linkUrl, appendElemFunc, memberData) => {

  const li = document.createElement('li');
  li.classList.add('p-member__item');
  li.style.display = "block";
  li.dataset.member = number;

  const anchor = document.createElement('a');

  const thumb = document.createElement('div');
  thumb.classList.add('c-member__thumb');
  thumb.style.position = "relative";

  const img = document.createElement('img');
  img.setAttribute('src', IMG_PREFIX + imgUrl + IMG_SUFFIX);

  thumb.appendChild(img);

  if (linkUrl) {
    img.style.cursor = "pointer";

    const linkButton = document.createElement('a');
    linkButton.append(document.createTextNode('Open Link in New Tab'));
    linkButton.classList.add('open-link-button');
    linkButton.style.display = "none";
    linkButton.setAttribute('href', "https://" + linkUrl);
    linkButton.setAttribute('target', '_blank');

    img.addEventListener('click', () => {
      linkButton.style.display = (linkButton.style.display == "none") ? 'flex' : 'none';
    });

    linkButton.addEventListener('click', (event) => { event.stopPropagation(); });

    thumb.appendChild(linkButton);
  }

  anchor.appendChild(thumb);

  appendElemFunc(anchor, memberData);

  li.appendChild(anchor);
  return li;
};

/**
 * メンバーページの各種ソートに対応するリスト生成
 * 複数グループが存在するソートカテゴリに卒業メンバーを追加して再構築
 * @param {string[]} list
 * @param {[key: string]: Object[]} groups
 * @param {Element} sortTop
 * @param {Element[]} headers
 */
const constructGroup = (list, groups, sortTop, headers) => {

  let lastAdded;

  Array.prototype.forEach.call(list, (x) => {

    if (!groups[x]) return;

    const groupMembers = Array.prototype.sort.call(groups[x], (a, b) => (a.kn).localeCompare(b.kn, 'ja'));

    const unorderedList = document.createElement('ul');
    unorderedList.className = 'p-member__list';

    Array.prototype.forEach.call(groupMembers, (m) => {

      const current = sortTop.querySelector(`[data-member="${m.no}"]`);

      if (current) {
        unorderedList.appendChild(current);
      // ex
      } else {
        const og = createMemberElement(m.no, m.img, m.lnk, appendBd, {"name": m.nm, "birth": m.birth});
        unorderedList.appendChild(og);
      }
    });

    let header = Array.prototype.find.call(headers, (h) => h.children[0].innerText.trim() == x);

    if (header) {

      header.nextSibling.nextSibling.children[0].replaceChild(unorderedList, header.nextSibling.nextSibling.children[0].children[0]);
      lastAdded = header.nextSibling.nextSibling;
    } else {

      header = document.createElement('div');
      header.className = 'p-page-head-sub';
      const headSubHeader = document.createElement('h2');
      header.classList.add('c-page-subtitle', 'en');
      headSubHeader.append(document.createTextNode(x));
      header.appendChild(headSubHeader);

      sortTop.insertBefore(header, lastAdded.nextSibling);
      
      const lContents = document.createElement('div');
      lContents.className = 'l-contents';

      lContents.appendChild(unorderedList);
      
      const lMainContents = document.createElement('div');
      lMainContents.className = 'l-maincontents';
      
      lContents.appendChild(lMainContents);

      sortTop.insertBefore(lContents, header.nextSibling);
      lastAdded = lContents;
    }
  });
};

/**
 * Member
 */
const doProcessMember = () => {

    document.appendStyle(`
    .p-member-filter { margin-top: 1rem; }
    .p-page-head-sub { padding-top: 20px; }
    .l-contents { padding-bottom: 0px !important; }
    .p-member__item {
      display: block;
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
    .c-member__name { font-size: 2.2rem; }
    .c-member__kana { font-size: 1.5rem; }
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
    .open-link-button:hover { color: lightyellow; }
    `
  );

  const currentNumberSet = new Set();

  Array.prototype.forEach.call(document.querySelectorAll('.p-member__item'), (m) => {
    currentNumberSet.add(m.dataset.member);
  });

  // 誕生日をExcel日付からdateに変換
  Array.prototype.forEach.call(HINATAZAKA46.DATA, (m) => {
    if (m.bd) {
      m.birth = excelSerialToDate(m.bd);
    }
  });

  const alltimeNumberSet = new Set();

  // alltime
  const alltimeMembers = Array.prototype.filter.call(HINATAZAKA46.DATA, (m) => {
    const intNo = parseInt(m.no);
    const isMember = intNo > 0 && intNo < 1000;

    if (isMember) {
      alltimeNumberSet.add(m.no);
    }
    return isMember;
  });

  // current
  const currentMembers = Array.prototype.filter.call(HINATAZAKA46.DATA, (m) => {
    return currentNumberSet.has(m.no);
  });

  const exNumberSet = alltimeNumberSet.difference(currentNumberSet);

  // ex
  const exMembers = Array.prototype.filter.call(HINATAZAKA46.DATA, (m) => {
    return exNumberSet.has(m.no);
  });

  const generations = {};

  Array.prototype.forEach.call(exMembers, (m) => {

    if (! generations[m.gen]) {
      generations[m.gen] = createGeneration(m.gen);
    }
    const genTree = generations[m.gen];
    const list = genTree.querySelector('.p-member__list');

    const memberElement = createMemberElement(m.no, m.img, m.lnk, appendNmKn, {"name": m.nm, "kana": m.kn});
    list.appendChild(memberElement);
  });

  const defaultMembers = document.querySelector('.sorted.sort-default.current');

  Array.prototype.forEach.call(Object.values(generations), (g) => {
    defaultMembers.appendChild(g);
  });

  // 名前順
  const newSortedByName = document.createElement('ul');
  newSortedByName.className = 'p-member__list';

  const sortedByName = document.querySelector('.sort-syllabary .p-member__list');

  const nameOrderMembers = Array.prototype.sort.call(alltimeMembers.slice(), (a, b) => (a.kn).localeCompare(b.kn, 'ja'));

  Array.prototype.forEach.call(nameOrderMembers, (m) => {
    const current = sortedByName.querySelector(`[data-member="${m.no}"]`);
    if (current) {
      newSortedByName.appendChild(current);
    } else {
      const og = createMemberElement(m.no, m.img, m.lnk, appendNmKn, {"name": m.nm, "kana": m.kn});
      newSortedByName.appendChild(og);
    }
  });

  sortedByName.parentNode.replaceChild(newSortedByName, sortedByName);

  // 誕生日
  const newSortedByBirth = document.createElement('ul');
  newSortedByBirth.className = 'p-member__list';

  const sortedByBirth = document.querySelector('.sort-birth .p-member__list');

  const birthOrderMembers = Array.prototype.sort.call(alltimeMembers.slice(), (a, b) => {
    const aBrthDay = parseInt(a.bd);
    const bBrthDay = parseInt(b.bd);

    if (aBrthDay > bBrthDay) {
      return -1;
    } else if (aBrthDay == bBrthDay) {
      return a.kn > b.kn ? 1: -1;
    } else {
      return 1;
    }
  });

  Array.prototype.forEach.call(birthOrderMembers, (m) => {

    const current = sortedByBirth.querySelector(`[data-member="${m.no}"]`);

    if (current) {
      newSortedByBirth.appendChild(current);
    // ex
    } else {
      const og = createMemberElement(m.no, m.img, m.lnk, appendBd, {"name": m.nm, "birth": m.birth});
      newSortedByBirth.appendChild(og);
    }
  });

  sortedByBirth.parentNode.replaceChild(newSortedByBirth, sortedByBirth);

  // 星座
  const zodiacGroups = Object.groupBy(alltimeMembers, ({ birth }) => getZodiacSign(birth));

  const zodiacTop = document.querySelector('.sort-constellation');

  const zodiacHeaders = document.querySelectorAll('.sort-constellation .p-page-head-sub');

  constructGroup(Object.values(ZODIAC), zodiacGroups, zodiacTop, zodiacHeaders);

  // 血液型
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

  const bloodTop = document.querySelector('.sort-blood');

  const bloodHeaders = document.querySelectorAll('.sort-blood .p-page-head-sub');

  const BLOOD_TYPES = ["A型", "B型", "O型", "AB型", "不明"];

  constructGroup(BLOOD_TYPES, bloodGroups, bloodTop, bloodHeaders);

  // Penlight
  Array.prototype.forEach.call(document.querySelectorAll('.p-member__item'), (m) => {

    const color_set = HINATAZAKA46.DATA[m.dataset.member].cl;
    const code_01 = HINATAZAKA46.LIGHT[color_set[0]].cd;
    const code_02 = HINATAZAKA46.LIGHT[color_set[1]].cd;

    const img = m.children[0].children[0].children[0];

    img.setPenlightColor(code_01, code_02, 4, 64);

    m.addEventListener('mouseover', () => {img.setPenlightColor(code_01, code_02, 12, 128);});
    m.addEventListener('mouseout', () =>{img.setPenlightColor(code_01, code_02, 4, 64);});
  });
}

/**
 * メンバー詳細
 */
const doProcessMemberDetail = () => {

  document.appendStyle(`
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
        transform-origin: 100% 20%;

        &:hover {
          transform: scale(1.5) translateZ(10px);
          z-index: 10; /* 前面に出す */
        }
      }
      .c-member-greeting-popup-pager-btn-icon {
        transition: transform 0.3s ease, z-index 0.3s ease;
        transform-origin: center center;
      }
      .c-member-greeting-popup-pager-btn-in:hover .c-member-greeting-popup-pager-btn-icon {
        box-shadow: 0px 0px 0px 3px ${DEFAULT_BLUE};
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
        border: 2px solid ${DEFAULT_BLUE};
      }
      .c-news__date { width: 11rem; }`);

  const close_button = document.querySelector('.c-btn-member-greeting-popup-close');
  close_button.style.setProperty("--color", DEFAULT_FONT_CL);
  shortenYearWithDay('.c-news__date');

  const img = document.querySelector('.c-member__thumb > img:nth-child(1)');

  if (img) {
    const ct = (location.href).match(/artist\/([0-9]{1,2})/)[1];
    const color_set = HINATAZAKA46.DATA[ct].cl;
    const color_01 = HINATAZAKA46.LIGHT[color_set[0]];
    const color_02 = HINATAZAKA46.LIGHT[color_set[1]];

    img.setPenlightColor(color_01.cd, color_02.cd, 8, 64);
  }
};

/**
 * Greetingリスト
 */
const doProcessGreeting = () => {
  document.appendStyle(`
      .card, .member_thumb { cursor: pointer; }
      div.card {
        transition: transform 0.3s ease, z-index 0.3s ease;
        transform-origin: center center;
      }
      div.card:hover {
        transform: scale(1.05) translateZ(10px);
        z-index: 10; /* 前面に出す */
      }`
  );

  Array.prototype.forEach.call(document.querySelectorAll('[class^="card_"]'), (c) => {

    const cardNo = c.classList[0].match(/[0-9]{1,2}/)[0];

    const member = c.querySelector('.member_thumb');

    member.addEventListener('click', () => {
      location.href = "https://www.hinatazaka46.com/s/official/artist/" + cardNo + "?ima=0000";
    });

    c.addEventListener('mouseover', () => {
      const menberName = c.querySelector('.name');

      if (getColorMode() === COLOR_MODE.DARK_COLOR) {
        menberName.style.color = DARK_FONT_CL;
      } else {
        menberName.children[0].style.color = DEFAULT_FONT_CL;
      }
    });

    c.addEventListener('mouseout', () => {
      const menberName = c.querySelector('.name');
      menberName.style.color = DEFAULT_FONT_CL;
    });

    const card = c.querySelector('.card');
    const btn = c.querySelector('a.btn01');
    card.addEventListener('click', (e) => { btn.click(); });
  });
};

const DELTA = 2;

/**
 * NEWS
 * @param {Element} lMainContentsUlTop
 * @param {function} createAnchor
 */
const doProcessNews = (lMainContentsUlTop, createAnchor) => {
  const newsList = Array.prototype.map.call(document.getElementsByClassName("c-news__date"),
                   (x) => [parseInt(x.innerText.match(new RegExp(/\d{4}\.\d{2}\.(\d{2})/))[1]), x.getBoundingClientRect().top] );

  const dayMap = new Map();

  Array.prototype.forEach.call(newsList, (x) => {

    if (! dayMap.has(x[0]) || x[1] < dayMap.get(x[0])) {
      // Map(day, top)
      dayMap.set(x[0], x[1]);
    }
  });

  Map.prototype.forEach.call(dayMap, (top, day) => {

    Array.prototype.some.call(document.querySelectorAll("table.cale_table tbody tr td"), (td) => {

      if (!td.classList.contains("is-disabled") && day === parseInt(td.innerText)) {

        td.innerHTML = createAnchor((top - lMainContentsUlTop - DELTA), day);

        return true;
      }
      return false;
    });
  });
};


/**
 * SCHEDULE
 * @param {Element} lMainContentsUl
 * @param {Element} lMainContentsUlTop
 * @param {strting} dispYearMonth
 * @param {date} now
 * @param {strting} nowYearMonth
 * @param {function} createAnchor
 */
const doProcessMedia = (lMainContentsUl, lMainContentsUlTop, dispYearMonth, now, nowYearMonth, createAnchor) => {

  document.appendStyle(`.p-schedule__list-group { padding-top: 10px; }`);

  fillEmpty(dispYearMonth, lMainContentsUl);

  lMainContentsUl.scroll(0, 0);

  let isScrolled = false;

  const today = now.getDate();
  
  Array.prototype.forEach.call(document.getElementsByClassName("p-schedule__list-group"), (dayElem) => {

    const dateElem = dayElem.querySelector('.c-schedule__date--list');

    // 日付(innerText)の文字列 '(日付)\n(曜日)' から日付を抽出
    const day = ((x) => {return parseInt(x.substr(0, x.indexOf(`\n`)));})(dateElem.innerText);

    insertExtSchedule(dispYearMonth, lMainContentsUl, day, dayElem);

    Array.prototype.some.call(document.querySelectorAll("table.cale_table tbody tr td"), (td) => {

      if ( !td.classList.contains("is-disabled") && day === parseInt(td.innerText)) {

        td.innerHTML = createAnchor((dayElem.getBoundingClientRect().top - lMainContentsUlTop - DELTA), day);

        return true;
      }
      return false;
    });

    // 表示スケジュールが当月の場合
    if (dispYearMonth === nowYearMonth) {
      // 過去日
      if (day < today) {

        dayElem.classList.add("schedule__list-pastday");

        // 「今日」（ページを表示した日付）
      } else if (day === today) {

        dateElem.classList.add("schedule__date-today");
        dayElem.classList.add("schedule__list-today");
      }

      if (day >= today) {

        dayElem.classList.add("schedule__list-future");

        if (!isScrolled) {
          // 「今日」以降（「今日」を含めて）で最早のスケジュール日要素にスクロール
          lMainContentsUl.scroll({

            top: dateElem.getBoundingClientRect().top - lMainContentsUlTop - DELTA,
            behavior: "smooth"
          });

          isScrolled = true;
        }
      }
    }
  });
};

/*
 * "ディスコグラフィー"向けリリース年リストを画面に配置する
 */
const setReleaseYear4Disco = () => {
 
  const releaseYearSelector = '.c-disco__year';

  let navText = `<header class="header" role="banner" style="z-index: 1000;">
                   <nav class="nav">
                     <div class="release">RELEASE<br/>YEAR</div>
                     <ul class="nav-list">`;

  Array.prototype.forEach.call(document.querySelectorAll(releaseYearSelector), (x) => {

    const year = x.innerText;
    const id_year = "y_" + year;
    x.parentNode.setAttribute("id", id_year);
    navText += `<li><a class="rel_year">${year}</a></li>`;
  });

  navText += `</ul>
      </nav>
    </header>`;

  const main = document.querySelector('.l-main');
  main.setAttribute("style", 'padding-top:0; margin: 20px 0 0 40px; font-size: larger;');
  main.insertAdjacentHTML('afterbegin', navText);

  setTimeout(() => {

    const header = document.querySelector('header');
    const nav = document.querySelector('.nav');
    const navHeight = nav.clientHeight;

    window.onscroll = () => {

      if (window.pageYOffset >= header.clientHeight) {
        nav.classList.add('fixed');
        main.setAttribute('style', `padding-top: ${navHeight}px`);
      } else {
        nav.classList.remove('fixed');
        main.setAttribute('style', 'padding-top:0; margin: 20px 0 0 40px; font-size: larger;');
      }
    };

    const latestYear = document.querySelector(releaseYearSelector);

    const scrollTop = latestYear.parentNode.getBoundingClientRect().top;

    // スクロール位置リセット 〜「再読み込み」ボタン押下時の位置ズレ対応
    scrollTo(0, 0);

    // リスト位置までページ内で縦スクロール
    scrollTo({
      top: scrollTop,
      behavior: "smooth"
    });

    Array.prototype.forEach.call(document.getElementsByClassName('rel_year'), (x) => {
      const year = x.innerText;
      const yearElement = document.getElementById("y_" + year);
      const top = yearElement.getBoundingClientRect().top;
      x.setAttribute("href", `javascript:scrollTo({top:${top}, behavior:'smooth'});`);
    });

  }, 100);
};

/**
 * ディスコグラフィー
 */
const doProcessDiscography = () => {

  document.appendStyle(`
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
      `);

  setReleaseYear4Disco();
};

/**
 * "フォーメーション"向けリリース年リストを画面に配置する
 */
const setReleaseYear4Formation = () => {

  const releaseYearSelector = '.c-page-subtitle';

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

  const main = document.querySelector('.l-main');
  main.setAttribute("style", 'padding-top:0; margin: 20px 0 0 40px; font-size: larger;');
  main.insertAdjacentHTML('afterbegin', navText);

  const header = document.querySelector('header');
  const nav = document.querySelector('.nav');
  const navHeight = nav.clientHeight;

  window.onscroll = () => {

    if (window.pageYOffset >= header.clientHeight) {
      nav.classList.add('fixed');
      main.setAttribute('style', `padding-top: ${navHeight}px`);
    } else {
      nav.classList.remove('fixed');
      main.setAttribute('style', 'padding-top:0; margin: 20px 0 0 40px; font-size: larger;');
    }
  };

  const latestYear = document.querySelector(releaseYearSelector);
  const scrollTop = latestYear.parentNode.getBoundingClientRect().top;

  // スクロール位置リセット　〜「再読み込み」ボタン押下時の位置ズレ対応
  scrollTo(0, 0);

  // リスト位置までページ内で縦スクロール
  scrollTo({
    top: scrollTop,
    behavior: "smooth"
  });
};

/**
 * フォーメーション
 */
const doProcessFormation = () => {

  const styleText = `
      .l-container { margin-top: -280px; }
      .formation_image :not(.small_f) li, small_f span {
        transition: transform 0.3s ease, z-index 0.3s ease;
        transform-origin: center center;
      }
      .formation_image :not(.small_f) li:hover, .small_f span:hover {
        transform: scale(1.4, 1.4) translateZ(10px);
        z-index: 10;
      }
      .formation_image li
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
      .release { line-height: 20px; }
      .p-page-head-sub, .l-contents { width: 1300px; }
      .p-page-head-sub { margin: 0px auto 0px auto; }
      .p-page-head-sub--first { padding-top: 20px; }
      .formation_list {
        .block_head { width:23% !important; }
        .block_head+ { width:77% !important; }
        h4 {
          color: ${DEFAULT_BLUE};
          background-color: darkslateblue;
          font-size: 1.4em;
          font-weight: bold;
          padding: 0.3em 0.1em;
        }
      }
      .formation_image li {
        span {
          width: 80px;
          height: 80px;
          &:hover { box-shadow: 0px 0px 0px 3px ${DEFAULT_BLUE}; }
        }
        i {
          font-size: 1.2em;
          width: 130px;
          padding-left: 20px;
          shite-space: pre-line;
        }
      }`;

  document.appendStyle(styleText);

  setReleaseYear4Formation();
};


// Blog
/**
 * 背景画像のurlを取得
 * @param {Element} el
 */
const getBackgroundImageUrl = (el) => {
  const bg = window.getComputedStyle(el).backgroundImage;
  const urlMatch = bg.match(/url\(["']?(.*?)["']?\)/);
  return urlMatch ? urlMatch[1] : null;
}

/**
 * 16進コードを10進の配列に変換
 * @param {string} colorStr
 */
const parseColorToRGBArray = (colorStr) => {
  const ctx = document.createElement('canvas').getContext('2d');
  ctx.fillStyle = '#000'; // 初期値

  // 無効な色の文字列でも例外を出さないようにtry-catch
  try {
    ctx.fillStyle = colorStr;
  } catch (e) {
    return null;
  }

  // ブラウザが内部で解析したrgb(...)形式に変換されている
  const computed = ctx.fillStyle;
  // rgba形式を含めて正規化
  const match = computed.match(/#([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})/i);

  if (!match) return null;

  return [parseInt(match[1], 16), parseInt(match[2], 16), parseInt(match[3], 16)];
};

/**
 * ヘッダータイトルのフォント色を取得
 * @param {number} r - red
 * @param {number} g - green
 * @param {number} b - blue
 * @param {number} threshold - 閾値
 */
const getHeaderFontColor = (r, g, b, threshold = 30) => {

  const defaultFontColor = parseColorToRGBArray(DEFAULT_BLUE);
  const default_R = defaultFontColor[0];
  const default_G = defaultFontColor[1];
  const default_B = defaultFontColor[2];

  const isNearlyDefault = r >= default_R - threshold && g >= default_G - threshold && b >= default_B - threshold;

  // ヘッダータイトルの背景画像の色がデフォルトのフォント色と近い場合
  if (isNearlyDefault) {
    const compR = 255 - default_R * 0.2;
    const compG = 255 - default_G * 0.2;
    const compB = 255 - default_B * 0.5;

    return `rgb(${compR}, ${compG}, ${compB})`;
  } else {
    return `rgb(${defaultFontColor[0]}, ${defaultFontColor[1]}, ${defaultFontColor[2]})`;
  }
};

/**
 * メンバー顔写真の外枠を着色
 * @param {number} r
 * @param {number} g
 * @param {number} b
 */
const setMemberIconOutline = (r, g, b) => {
  const icon = document.querySelector('.c-blog-member__icon');
  if (icon) {
    icon.style.outline = `8px solid rgb(${r}, ${g}, ${b})`;
  }
};

/**
 * 画像の上に配置された要素の色を更新
 * @param {string} imageUrl - 画像URL
 * @param {string} selector - 着色対象の文字要素セレクタ
 */
const updateColorOnImage = (imageUrl, selector) => {
  const img = new Image();
  img.crossOrigin = "anonymous"; // CORS対策（必要）
  img.src = imageUrl;

  const getFontSize = x => (z => parseInt(z))((y => y.replace(/([0-9][0-9\.]+).*/, "$1"))(x != null ? window.getComputedStyle(x).getPropertyValue("font-size") : "0"));
 
  const setColor = (color) => {

    Array.prototype.forEach.call(document.querySelectorAll(selector), (e) => {
      const fontSize = getFontSize(e);
      
      if (e.classList.contains('p-blog-face__icon')) {
        e.style.cssText = `--color: ${color}`;
      } else if (fontSize > 60) {
        e.style.textStroke = `0.5px ${color}`;
        e.style.webkitTextStroke = `0.5px ${color}`;
      } else {
        e.style.background = `linear-gradient(90deg, ${color} 0%, white 20%, ${color} 40%)`;
        e.style.cssText += `background-clip: text; -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;`
      }
    });
  };

  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    let r = 0, g = 0, b = 0, count = 0;
    for (let i = 0; i < data.length; i += 4) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count++;
    }

    r = Math.round(r / count);
    g = Math.round(g / count);
    b = Math.round(b / count);

    setMemberIconOutline(r, g, b);

    const baseColor = getHeaderFontColor(r, g, b);
		setColor(baseColor);
  };

  img.onerror = () => {

    setColor(DEFAULT_BLUE);
    console.error("画像の読み込みに失敗しました");
  };
};

/**
 * 画像の内側に表示される要素の色を更新
 * @param {string} imageSelector - 画像要素セレクタ
 * @param {string} textSelector - 着色対象の文字要素セレクタ
 */
const updateColorOnTopImage = (imgSelector, textSelector) => {
  const blogContainer = document.querySelector(imgSelector);

  const imageUrl = getBackgroundImageUrl(blogContainer);

  if (imageUrl) {
    updateColorOnImage(imageUrl, textSelector);
  }
}

/**
 * 五期生リレーブログの写真を設定
 */
const create5thRelayPhoto = () => {

  const relayPhoto = document.createElement('div');
  relayPhoto.classList.add("c-blog-member__icon");
  relayPhoto.setAttribute("style", `
    background-image: url(https://cdn.hinatazaka46.com/images/14/fa2/dcd3c79b9d66efeed5a13af038129.jpg);
    background-size: 120%;
    border-radius: 10%;
    background-position-y: 5px;
    background-repeat: no-repeat;
    width: 210px;
    height: 130px;
    position: relative;
    z-index = 2;
  `);

  return relayPhoto;
};

/**
 * ロード時の自動スクロール向け
 */
const scrollOnLoad = () => {
  // 半透明ヘッダーメニュー 高さ
  const headerHeight = document.querySelector(".p-header-wrap").offsetHeight;
  // スクロール位置リセット リロード時のズレ対応
  scrollTo(0, 0);
  // 文頭までスクロール
  scrollTo({
    top: document.querySelector(".p-blog-article__head").getBoundingClientRect().top - headerHeight,
    behavior: "smooth"
  });
}

/** ブログ */
const blogDetail = () => {

  document.appendStyle(`
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
      overflow: scroll;
      border: none;
    }
    .p-blog-article__info div {
      vertical-align: top;
    }
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
    }`);

  const articleTitleDiv = document.querySelector('.c-blog-article__title');

  if (articleTitleDiv) {
    const height = articleTitleDiv.scrollHeight + 'px';

    articleTitleDiv.style.setProperty("--height", height);
    articleTitleDiv.style.marginBottom = "0px";
    articleTitleDiv.classList.add("hidden");
  }

  const articleInfo = document.querySelector('.p-blog-article__info');
  const pager = document.querySelector('.p-pager');

  if (articleInfo && pager) {
    articleInfo.appendChild(pager);
  }

  setTimeout(() => {
    const articleHeight = document.documentElement.clientHeight * 0.8;// - pBlogArticleHead.getBoundingClientRect().bottom + 20;

    (x => { if (x) { x.style.height = articleHeight + "px"; }})(document.querySelector('.c-blog-article__text'));

    if (articleTitleDiv && articleTitleDiv.offsetWidth < articleTitleDiv.scrollWidth) {

      const articleTitle = articleTitleDiv.innerText;
      articleTitleDiv.innerText = articleTitle + "🔼";
      articleTitleDiv.style.cursor = "pointer";

      articleTitleDiv.addEventListener('click', function() {
        articleTitleDiv.classList.toggle("hidden");
        articleTitleDiv.classList.toggle("open");
      });
    }

    scrollOnLoad();
  }, 100);
};

/**
 * メンバーアイコンを取得
 * @param {string} memberName
 */
const getIcon = (memberName) => {
 
  if (!memberName) return "❔️";

  switch (memberName) {
    case "日向坂46":
      return HINATAZAKA46.DATA[HINATAZAKA46.DATA.length - 2].ico;
    case "ポカ":
      return HINATAZAKA46.DATA[0].ico;
    case "五期生リレー":
      return HINATAZAKA46.DATA[HINATAZAKA46.DATA.length - 1].ico;
    default:
      return HINATAZAKA46.DATA[parseInt(HINATAZAKA46.MEMBER[memberName])].ico;
  }
};

/**
 * メンバー選択リストの選択肢を書き換える
 * ex. "小坂 菜緒(8.3 22:12 更新) | " → "🦕 小坂 菜緒 (8.3 22:12)"
 */
const rewriteMemberSelectOption = () => {
  Array.prototype.forEach.call(document.querySelectorAll('.js-select.sort option'), (o, i) => {
    if (i > 0) {
      const memberName = o.innerText.match(/(([^\x01-\x7E]|\x20)*)/)[1];
      const icon = getIcon(memberName);
      o.innerText = o.innerText.replace(/(([^\x01-\x7E]|\x20)*)\(([1-2]?[0-9]\.[1-3]?[0-9] [1-2]?[0-9]:[1-2]?[0-9]).*\).*/g,`${icon} $1 ($3)`);
    }
  });
};

/** 記事一覧 */
const blogList = () => {

  const blogGroupHeight = document.documentElement.clientHeight;

  document.appendStyle(`
  .c-blog-member__icon--all { height: 60px; }
  .p-button { padding-top: 0; }
  .s-blog__index {
    position: relative;
    z-index: 50;
    margin: 0 0 0 -50px;
    height: 250px;
    width: 280px;
    overflow: scroll;
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

  const titleList = document.createElement('div');
  titleList.setAttribute("class", "s-blog__index");

  const createAnchor = (idx, datetime, icon, articleTitle) => `<div class="d-article"><a href="#article${idx}">
    <span class="s-member-icon">${icon}</span>
    <span class="s-article-title">${articleTitle}</span><br/><span class="s-datetime">${datetime}</span>
  </a></div>`;

  Array.prototype.forEach.call(document.getElementsByClassName('p-blog-article'), (x, i) => {

    x.setAttribute('id', "article" + i);
    const datetimeDiv = x.childNodes[1].childNodes[3].childNodes[1];
    const datetime = datetimeDiv.firstChild.textContent.trim();
    const articleTitleDiv = x.childNodes[1].childNodes[1];
    const articleTitle = articleTitleDiv.firstChild.textContent.trim();
    // メンバー混合リストの場合があるので名前を取得
    const memberName = x.childNodes[1].childNodes[3].childNodes[3].innerText;

    const icon = getIcon(memberName);

    titleList.insertAdjacentHTML('beforeend', createAnchor(i, datetime, icon, articleTitle));
  });

  shortenYearWithDay('.s-datetime');
  
  const calendar = document.querySelector('.calender_pats');
  calendar.before(titleList);

  rewriteMemberSelectOption();

  Array.prototype.forEach.call(document.getElementsByClassName('p-blog-entry__group'), (g) => {

    const blogEntrySubtitle = g.querySelector('.c-blog-entry_area__subtitle');

    if (blogEntrySubtitle && blogEntrySubtitle.innerText == '日向坂46の') {

      const blogEntryList = g.querySelector('.p-blog-entry__list');
      const memberSelectBtn = document.querySelector('.p-blog-member-filter');
      blogEntryList.before(memberSelectBtn);      
    }

  });

  const pager = document.querySelector('.p-pager.p-pager--count');
 
  // ページャが配置されている(GETパラメータdyが設定されていない)場合
  if (pager) {
    const blogList = document.querySelector('.p-blog-group');
    blogList.before(pager);
  }

  setTimeout(() => {
    document.querySelector('.p-blog-group').style.hight = "px";
    scrollOnLoad();
  }, 100);
};

/**
 * アンカーがYoutubeのurlであれば埋め込みHTMLを取得してアンカーの次要素の位置に追加
 * @parameter {HTMLElement} a - anchor
 */
const oembed = (a) => {

  if (a.tagName != 'A') {
    console.error("this anchor is wrong. tagName: '",  a.tagName, "'");
    return;
  }

  const href = a.getAttribute('href');

  if (href && href.match('https:\/\/youtu\.be|https:\/\/youtube\.com|https:\/\/www\.youtube\.com')) {

    const xhr = new XMLHttpRequest();
    const url = `https://www.youtube.com/oembed?url=${href}&maxwidth=640&maxheight=360`;
    xhr.open("GET", url);
    xhr.send();

    xhr.onreadystatechange = (e) => {

      if (xhr.readyState === XMLHttpRequest.DONE) {

        const res = JSON.parse(xhr.responseText);
        const div = document.createElement('div');
        div.classList.add('div__youtube');
        div.innerHTML = res.html;

        if (a.nextSibling == null) {

          a.parentNode.appendChild(div);
        } else if (a.nextSibling.nodeType !== Node.TEXT_NODE) {

          a.parentNode.insertBefore(div, a.nextSibling);
        } else {

          a.parentNode.insertBefore(div, a.nextSibling.nextSibling);
        }
      }
    }
  }
};

/**
 * Blog
 */
const doProcessBlog = (blogPageType) => {

  const body = document.querySelector('body');

  // 内容が空のページ（卒業メンバーのブログなど）
  if (body.getElementsByTagName('*').length === 0) {
    body.innerHTML = 'This page is no longer available';
    return;
  }

  // ひなたフェス/握手会 は非メンバーブログ
  const isNotMemberBlog = (location.search).match(/(cd=hinafes_blog|cd=event)/g);

  if (isNotMemberBlog) {
    return;
  }

  if (isMobile()) {
    return;
  }

  updateColorOnTopImage('.p-blog-head-container', '.c-blog-page__title, .c-blog-page__subtitle, .c-blog-main__name, .c-blog__profilelink, .p-blog-face__title, .p-blog-face__icon');

  // 画像直後のテキストが画像右隣への回り込むのを回避
  Array.prototype.forEach.call(document.querySelectorAll('.c-blog-article__text :not(div) > img'), (i) => {
    i.outerHTML = "<div>" + i.outerHTML + "</div>";
  });

  Array.prototype.forEach.call(document.querySelectorAll('.c-blog-article__text a'), (a) => {
    oembed(a);
  });

  const faceSelector = '.p-blog-face__list';
 
  // 画面下部の顔写真
  Array.prototype.forEach.call(document.querySelectorAll(faceSelector), (x) => {
    x.addEventListener('mouseover', () => {

      x.children[1].style.color = getColorMode() === COLOR_MODE.DARK_COLOR ? `${DARK_FONT_CL}` : `${DEFAULT_FONT_CL}`;
    });
  });

  Array.prototype.forEach.call(document.querySelectorAll(faceSelector), (x) => {
    x.addEventListener('mouseout', () => {

      x.children[1].style.color = DEFAULT_FONT_CL;
    });
  });

  const styleText_common = `
    .c-blog-face__item {
      transition: transform 0.3s ease, z-index 0.3s ease;
      transform-origin: center center;
    }
    .c-blog__profilelink { font-size: 1.5rem; }
    .c-select-box.js-selected-value { border: solid 1px ${DEFAULT_BLUE}; }
    .p-blog-face__list:hover {
      > * {  transform: scale(1.2, 1.2) translateZ(10px); }
      > .c-blog-face__item { box-shadow: 0 0 0 3px ${DEFAULT_BLUE};}
    }
    .c-blog-main__category { background-color: #5ca8d1; }
    .c-button-grad, .c-button-grad.c-button-grad--big { background: ${GREEN_BUTTON}; }
    .c-button-grad.c-button-grad--big { min-width: 280px; }
    .js-select.sort { cursor: pointer; }
    `;

  if (blogPageType == "blog_top") {

    document.appendStyle(styleText_common + `
    .l-contents {
      padding-bottom: 20px;
    }
    .c-blog-top__name {
      font-weight: bold;
      font-size: 2rem;
    }
    .c-blog-page__subtitle {
      font-size: 3rem;
    }
    .c-blog-top__title, .c-blog-top__date {
      font-size: 1.2rem;
    }
    .c-blog-main__name {
      font-size: 3rem;
    }
    .c-blog-main__image, .c-blog__image {
      border: 2px solid ${DEFAULT_BLUE};
    }`);

    rewriteMemberSelectOption();

    return;
  }

  const memberName = ((x) => x != null ? x.innerText : "")(document.querySelector('.c-blog-member__name'));
  // "3000": 五期生リレー / 未設定 or "00" : 日向坂46
  const memberNo = ((x) => {if (x == "3000") { return -1; } else if (isNaN(x) || x == "00") { return -2; } else { return parseInt(x); }} )(HINATAZAKA46.MEMBER[memberName]);
  const color_set = HINATAZAKA46.DATA.slice(memberNo)[0].cl;
  const code_01 = HINATAZAKA46.LIGHT[color_set[0]].cd;
  const code_02 = HINATAZAKA46.LIGHT[color_set[1]].cd;

  const blogEntryItem = document.querySelector('.p-blog-entry__item');
  const blogEntryItemStyles = window.getComputedStyle(blogEntryItem, null);
  const blogEntryItemHeight = parseInt(blogEntryItemStyles.height.replace('px', ''));
  const blogEntryItemMarginBottom = parseInt(blogEntryItemStyles.marginBottom.replace('px', ''));
  const blogEntryItemHeightWithMargin = blogEntryItemHeight + blogEntryItemMarginBottom;
  
  const screenWidth = screen.width;
  const CONTENTS_WIDTH = Math.floor(screen.width * 0.1 * 0.9) * 10;
  const MAIN_CONTENTS_WIDTH = Math.floor(CONTENTS_WIDTH * 0.6);
  const OTHER_BLOG_LIST_WIDTH = Math.floor(CONTENTS_WIDTH * 0.22);

  const MARGIN_TOP = -180;

  const styleText_member_blog = `
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
    .p-blog-head-container {
      display: flex;
    }
    .p-blog-head {
      width: 600px;
      padding-top: 0;
      padding-left: 20px;
      margin: 0 0 0 60px;
    }
    .c-blog-page__subtitle {
      width: 230px;
    }
    .c-blog-page__title { margin-bottom: 0; }
    .c-blog-member__icon { margin-bottom: 10px; }
    .p-blog-member__head { margin-bottom: 5px; }
    .c-blog-member__info-td__name { padding-bottom: 5px; }
    .p-button { padding-top: 0; }
    .cale_table { margin-top: 0px; }
    .p-blog-article__head {
      background-color: #f6ffff;
      border: 1px solid #a0d8ef;
      border-radius: 10px;
      outline: 4px solid ${DEFAULT_BLUE};
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
    }
    .l-contents--blog-list { padding-bottom: 0; }
    .c-blog-entry_area__title { margin-bottom: 2px; }
    .p-blog-group { border: solid 1px #32a1ce; }
    .p-blog-article {
      padding-bottom: 0;
      margin-bottom: 0;
    }
    .p-blog-article__info { margin-bottom: 5px; }
    .c-pager__item__text time { font-size: 1.4rem; }
    .p-button--center { padding: 0; }
    .p-blog-face {
        margin: 0 0 0 auto;
        padding-bottom: 0;
        width: 700px;
        z-index: 100;
    }
    .p-blog-face__title {
      font-size: 2.2rem;
      width: 300px;
      margin: 20px 0 0 auto;
      line-height: 24px;
      cursor: pointer;

      &::-webkit-details-marker {
        display: none;
      }
    }
    .p-blog-face__icon {
      position: relative;
      display: inline-block;
      inline-size: 1em;
      aspect-ratio: 1;

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
        width: 1rem;
        height: 0.2rem;
      }

      &::after {
        transition: opacity 0.3s;
        rotate: 90deg;
      }

      &:where(.p-blog-face.open *)::after {
        opacity: 0;
      }
    }
    .p-blog-face__list::hover .c-blog-face__name {
      --color: #ffffff;
      color: var(--color);
    }
    .p-blog-face__group {
      padding-top: 20px;
      margin-right: 800px;
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
      overflow: scroll;
      border: none;
    }
    .c-blog-entry__name { font-size: 1.3rem; }
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
    .l-sub-contents--blog {
      margin-top: -150px;
    }
    .c-blog-member__icon {
      border: 8px;
      border-style: groove ridge ridge groove;
      border-color: #${code_01} #${code_02} #${code_02} #${code_01};
    }
    .c-button-grad--right {
      font-size: 1.4rem;
      text-align: center;
      width: ${OTHER_BLOG_LIST_WIDTH}px;
      height: 36px;
      margin: 0 0 20px 0;
    }`;

  document.appendStyle(styleText_common + styleText_member_blog);

  shortenYearWithDay('.c-blog-article__date, .c-blog-article__date time, .c-blog-entry__name, .c-pager__item__text time');

  setModalEvent('.c-blog-article__text img');

  let memberIcon = document.querySelector('.c-blog-member__icon');

  if (! memberIcon) {
    memberIcon = create5thRelayPhoto();
    const info = document.querySelector('.p-blog-member__info');
    info.prepend(memberIcon);
    // カレンダーの年月が背景と重なって見づらいので縦位置を調整
    const calendarPats = document.querySelector('.calender_pats');
    calendarPats.style.marginTop = "20px";
  } else if (! memberName) {
    memberIcon.setAttribute(
      'style',
      `height: 188px;
      width: 188px;
      background-image: url("https://cdn.hinatazaka46.com/images/14/263/732dfca7d5ebb83ba68acb11e4eb4/400_320_102400.jpg");
      border-radius: 50%;`);
  }

  memberIcon.setPenlightColor(code_01, code_02, 0, 16, 2, 1);

  switch (blogPageType) {
    case "blog_detail":
      blogDetail();
      break;
    case "blog_list":
      blogList();
      break;
    default:
      throw new Error(PAGE_TYPE_ERROR_MSG);
  }

  const memberBlogBtn = document.querySelector('.c-button-grad.c-button-grad--big');
  memberBlogBtn.classList.remove('c-button-grad--big');
  memberBlogBtn.classList.add('c-button-grad--right');
  memberBlogBtn.style.padding = "7px 16px;";

  const memberBlogEntryList = document.querySelector('.p-blog-entry__list');
  memberBlogEntryList.after(memberBlogBtn);

  const accordion = document.querySelector('.p-blog-face');
  initializeAccordion(accordion, {gridTemplateRows: "repeat(5, 200px)", gridTemplateColumns: "repeat(7, 160px)"});

  // メンバー別ブログ
  const memberBlogAccordion = document.querySelector('.p-blog-face');
  const title = document.querySelector('.p-blog-head');
  title.after(memberBlogAccordion );
  // メンバー別ブログ右の "+"
  const span = document.createElement('span');
  span.classList.add("p-blog-face__icon");
  span.setAttribute("aria-hidden", "true");
  const faceTitle = document.querySelector('.p-blog-face__title');
  faceTitle.appendChild(span);
};

/**
 * イベント
 */
const doProcessEvent = () => {
  setHoveredFontAndBgColor('.p-section--shakehands', '.c-shakehands-calender.pc, .c-shakehands-calender.pc a');
};

/**
 * FC
 */
const doProcessFc = () => {
  document.appendStyle('.fc-logo { padding: 15px; }');
};
